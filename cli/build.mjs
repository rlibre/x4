import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import esbuild from "esbuild";
import { DEFAULT_CONFIG_FILE, expandEnv, loadConfig, loadEnvFile } from "./config.mjs";
import { createBuildOptions } from "./build-options.mjs";
import { info, success } from "./log.mjs";
import { printBuildError, printWarnings } from "./diagnostic-plugin.mjs";

export async function build(argv = [], root = process.cwd()) {
    const { values, positionals } = parseArgs({
        args: argv,
        options: {
            config: { type: "string" },
            env: { type: "string" },
            debug: { type: "boolean", default: false },
        },
        allowPositionals: true,
        strict: true,
    });

    if (positionals.length)
        throw new Error(`Unexpected argument: ${positionals[0]}`);

    const envFile = values.env ? loadEnvFile(root, values.env) : undefined;
    const env = envFile?.env ?? process.env;

    const configArg = values.config ? expandEnv(values.config) : DEFAULT_CONFIG_FILE;
    const config = loadConfig(root, configArg, env, { explicit: values.config !== undefined });
    const mode = values.debug ? "debug" : "production";

    info("mode", mode);
    info("config", config.configFile);
    if (envFile)
        info("env file", envFile.filename);
    info("outdir", config.outdir);

    await fs.rm(config.outdir, { recursive: true, force: true });
    await fs.mkdir(config.outdir, { recursive: true });

    const started = performance.now();
    try {
        const result = await esbuild.build(createBuildOptions(config, mode));
        if (result.warnings.length)
            await printWarnings(result.warnings);
        success("built", `${Math.round(performance.now() - started)}ms`);
    }
    catch (error) {
        await printBuildError(error);
        process.exitCode = 1;
    }
}
