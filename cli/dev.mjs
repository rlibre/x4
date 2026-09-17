import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";
import esbuild from "esbuild";
import { DEFAULT_CONFIG_FILE, expandEnv, loadConfig, resolveConfigFile, resolveTls } from "./config.mjs";
import { createBuildOptions } from "./build-options.mjs";
import { info, success, failure } from "./log.mjs";

function openBrowser(url) {
    let command;
    let args;

    if (process.platform === "win32") {
        command = "cmd";
        args = ["/c", "start", "", url];
    }
    else if (process.platform === "darwin") {
        command = "open";
        args = [url];
    }
    else {
        command = "xdg-open";
        args = [url];
    }

    const child = spawn(command, args, {
        detached: true,
        stdio: "ignore",
    });
    child.unref();
}

function protocolConfig(config, values) {
    if (values.http && values.https)
        throw new Error("--http and --https are mutually exclusive");

    let https = config.dev.https;
    if (values.http)
        https = false;
    if (values.https)
        https = true;

    return https;
}

function serverUrl(host, port, https) {
    let displayHost = host;
    if (host === "0.0.0.0")
        displayHost = "127.0.0.1";
    else if (host === "::")
        displayHost = "[::1]";
    else if (host.includes(":") && !host.startsWith("["))
        displayHost = `[${host}]`;
    return `${https ? "https" : "http"}://${displayHost}:${port}`;
}

export async function dev(argv = [], root = process.cwd()) {
    const { values, positionals } = parseArgs({
        args: argv,
        options: {
            config: { type: "string" },
            host: { type: "string" },
            port: { type: "string" },
            http: { type: "boolean", default: false },
            https: { type: "boolean", default: false },
            open: { type: "boolean", default: false },
        },
        allowPositionals: true,
        strict: true,
    });

    if (positionals.length)
        throw new Error(`Unexpected argument: ${positionals[0]}`);
    if (values.port !== undefined && !/^\d+$/.test(values.port))
        throw new Error("--port must be an integer");

    const configArg = values.config ? expandEnv(values.config) : DEFAULT_CONFIG_FILE;
    const explicitConfig = values.config !== undefined;
    const watchedConfigFile = resolveConfigFile(root, configArg);

    let context;
    let configWatcher;
    let stopping = false;
    let restartTimer;
    let restartChain = Promise.resolve();
    let browserOpened = false;

    async function start(config) {
        const host = values.host ?? config.dev.host;
        const port = values.port === undefined ? config.dev.port : Number(values.port);
        if (port !== undefined && (port < 0 || port > 65535))
            throw new Error("--port must be between 0 and 65535");

        const useHttps = protocolConfig(config, values);
        const serveOptions = {
            host,
            servedir: config.outdir,
        };

        if (port !== undefined)
            serveOptions.port = port;
        if (useHttps)
            Object.assign(serveOptions, resolveTls(config));

        const next = await esbuild.context(createBuildOptions(config, "dev"));
        try {
            await next.watch();
            const result = await next.serve(serveOptions);
            context = next;

            const actualHost = result.hosts.includes(host) ? host : (result.hosts[0] ?? host);
            const url = serverUrl(actualHost, result.port, useHttps);
            info("mode", "dev");
            info("config", config.configFile);
            info("outdir", config.outdir);
            success("server", url);

            if (values.open && !browserOpened) {
                browserOpened = true;
                openBrowser(url);
            }
        }
        catch (error) {
            await next.dispose();
            throw error;
        }
    }

    async function reload() {
        let config;
        try {
            config = loadConfig(root, configArg, process.env, { explicit: explicitConfig });
            protocolConfig(config, values);
            if (values.https || (!values.http && config.dev.https))
                resolveTls(config);
        }
        catch (error) {
            failure(`config: ${error.message}`);
            return;
        }

        const previous = context;
        context = undefined;
        if (previous)
            await previous.dispose();

        try {
            await start(config);
            success("config", "reloaded");
        }
        catch (error) {
            failure(`restart: ${error.message}`);
        }
    }

    function scheduleReload() {
        clearTimeout(restartTimer);
        restartTimer = setTimeout(() => {
            restartChain = restartChain.then(reload, reload);
        }, 150);
    }

    const initialConfig = loadConfig(root, configArg, process.env, { explicit: explicitConfig });
    await start(initialConfig);

    const watchDir = path.dirname(watchedConfigFile);
    const watchName = path.basename(watchedConfigFile);
    configWatcher = fs.watch(watchDir, { persistent: true }, (_event, filename) => {
        if (filename === null || filename.toString() === watchName)
            scheduleReload();
    });

    async function stop() {
        if (stopping)
            return;
        stopping = true;
        clearTimeout(restartTimer);
        configWatcher?.close();
        await restartChain.catch(() => {});
        await context?.dispose();
    }

    process.once("SIGINT", async () => {
        await stop();
        process.exit(0);
    });
    process.once("SIGTERM", async () => {
        await stop();
        process.exit(0);
    });

    return { stop };
}
