import fs from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";

export const DEFAULT_CONFIG_FILE = "x4.config.json";

const DEFAULTS = Object.freeze({
    entryPoints: ["src/main.ts"],
    outdir: "./bin",
    copy: [],
    external: [],
    define: {},
    dev: {
        host: "127.0.0.1",
        https: false,
    },
});

export function expandEnv(value, env = process.env, escape = (text) => text) {
    if (typeof value !== "string")
        return value;

    return value.replace(
        /\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))/g,
        (_, braced, plain) => {
            const name = braced ?? plain;
            const result = env[name];
            if (result === undefined)
                throw new Error(`Environment variable '${name}' is not defined`);
            return escape(result);
        },
    );
}

// A define value is a JavaScript expression, usually a string literal
// ("\"$NAME\""). The value of the variable is escaped so that a quote or a
// backslash in it cannot end or corrupt that literal.
function escapeForDefine(text) {
    return JSON.stringify(text).slice(1, -1);
}

export function resolvePath(root, value, env = process.env) {
    const expanded = expandEnv(value, env);
    return path.isAbsolute(expanded)
        ? path.normalize(expanded)
        : path.resolve(root, expanded);
}

export function resolveConfigFile(root, configFile = DEFAULT_CONFIG_FILE, env = process.env) {
    return resolvePath(root, configFile, env);
}

/**
 * Reads the file given to --env.
 * Returns the environment to expand the config with: the variables of the
 * file, under those already defined, which win as with `node --env-file`.
 *
 * The option is not named --env-file on purpose: node handles that name
 * itself, even after the script name, before this code runs.
 */
export function loadEnvFile(root, file, env = process.env) {
    const filename = resolvePath(root, file, env);

    let variables;
    try {
        variables = parseEnv(fs.readFileSync(filename, "utf8"));
    }
    catch (error) {
        if (error.code === "ENOENT")
            throw new Error(`Env file not found: ${filename}`);
        throw new Error(`Cannot read env file '${filename}': ${error.message}`);
    }

    // Inherit from the environment instead of copying it: process.env has
    // its own lookup rules (names are case-insensitive on Windows).
    // defineProperty, because a plain assignment would go through to it.
    const merged = Object.create(env);
    for (const [name, value] of Object.entries(variables)) {
        if (env[name] === undefined)
            Object.defineProperty(merged, name, { value, enumerable: true });
    }

    return { filename, env: merged };
}

function readJson(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, "utf8"));
    }
    catch (error) {
        throw new Error(`Cannot read config '${filename}': ${error.message}`);
    }
}

function validateCopy(copy) {
    if (!Array.isArray(copy))
        throw new Error("copy must be an array");

    for (const item of copy) {
        if (!item || typeof item !== "object" || typeof item.from !== "string" || typeof item.to !== "string")
            throw new Error("Each copy entry must contain string 'from' and 'to' fields");
        if (path.isAbsolute(item.to))
            throw new Error(`copy destination must be relative to outdir: '${item.to}'`);
        const normalized = path.normalize(item.to);
        if (normalized === ".." || normalized.startsWith(`..${path.sep}`))
            throw new Error(`copy destination escapes outdir: '${item.to}'`);
    }
}

export function loadConfig(root = process.cwd(), configFile = DEFAULT_CONFIG_FILE, env = process.env, { explicit = false } = {}) {
    root = path.resolve(root);
    const filename = resolveConfigFile(root, configFile, env);

    let cfg = {};
    if (fs.existsSync(filename))
        cfg = readJson(filename);
    else if (explicit)
        throw new Error(`Config file not found: ${filename}`);

    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg))
        throw new Error("x4 config must be an object");

    const entryPoints = cfg.entryPoints ?? DEFAULTS.entryPoints;
    if (!Array.isArray(entryPoints) || !entryPoints.length || entryPoints.some((entry) => typeof entry !== "string"))
        throw new Error("entryPoints must be a non-empty array of strings");

    const copy = cfg.copy ?? DEFAULTS.copy;
    validateCopy(copy);

    const external = cfg.external ?? DEFAULTS.external;
    if (!Array.isArray(external) || external.some((entry) => typeof entry !== "string"))
        throw new Error("external must be an array of strings");

    const define = cfg.define ?? DEFAULTS.define;
    if (!define || typeof define !== "object" || Array.isArray(define))
        throw new Error("define must be an object");
    if (Object.values(define).some((value) => typeof value !== "string"))
        throw new Error("define values must be strings containing esbuild define expressions");

    const devCfg = cfg.dev ?? {};
    if (!devCfg || typeof devCfg !== "object" || Array.isArray(devCfg))
        throw new Error("dev must be an object");

    const host = devCfg.host ?? DEFAULTS.dev.host;
    if (typeof host !== "string" || !host)
        throw new Error("dev.host must be a non-empty string");

    const port = devCfg.port;
    if (port !== undefined && (!Number.isInteger(port) || port < 0 || port > 65535))
        throw new Error("dev.port must be an integer between 0 and 65535");

    const https = devCfg.https ?? DEFAULTS.dev.https;
    if (typeof https !== "boolean")
        throw new Error("dev.https must be a boolean");

    if (devCfg.tls !== undefined) {
        if (!devCfg.tls || typeof devCfg.tls !== "object" || Array.isArray(devCfg.tls))
            throw new Error("dev.tls must be an object");
        if (typeof devCfg.tls.cert !== "string" || typeof devCfg.tls.key !== "string")
            throw new Error("dev.tls requires string 'cert' and 'key' fields");
    }

    const outdirRaw = cfg.outdir ?? DEFAULTS.outdir;
    if (typeof outdirRaw !== "string")
        throw new Error("outdir must be a string");

    const outdir = resolvePath(root, outdirRaw, env);
    if (outdir === root)
        throw new Error("outdir cannot be the project root");
    if (outdir === path.parse(outdir).root)
        throw new Error("outdir cannot be a filesystem root");

    let esbuildOptions = {};
    if (cfg.esbuild !== undefined) {
        if (!cfg.esbuild || typeof cfg.esbuild !== "object" || Array.isArray(cfg.esbuild))
            throw new Error("esbuild must be an object");
        esbuildOptions = { ...cfg.esbuild };
    }

    return {
        root,
        configFile: filename,
        entryPoints: entryPoints.map((entry) => resolvePath(root, entry, env)),
        outdir,
        copy: copy.map((item) => ({
            from: resolvePath(root, item.from, env),
            to: path.normalize(item.to),
        })),
        external: [...external],
        define: Object.fromEntries(
            Object.entries(define).map(([name, value]) => [name, expandEnv(value, env, escapeForDefine)]),
        ),
        dev: {
            host,
            port,
            https,
            tls: devCfg.tls ? { ...devCfg.tls } : undefined,
        },
        esbuild: esbuildOptions,
    };
}

export function resolveTls(config, env = process.env) {
    const tls = config.dev.tls;
    if (!tls)
        throw new Error("HTTPS is enabled but dev.tls.cert/key are not configured");

    const certfile = resolvePath(config.root, tls.cert, env);
    const keyfile = resolvePath(config.root, tls.key, env);

    if (!fs.existsSync(certfile))
        throw new Error(`TLS certificate not found: ${certfile}`);
    if (!fs.existsSync(keyfile))
        throw new Error(`TLS private key not found: ${keyfile}`);

    return { certfile, keyfile };
}
