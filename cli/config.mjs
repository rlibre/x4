import fs from "node:fs";
import path from "node:path";

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

export function expandEnv(value, env = process.env) {
    if (typeof value !== "string")
        return value;

    return value.replace(
        /\$(?:\{([A-Za-z_][A-Za-z0-9_]*)\}|([A-Za-z_][A-Za-z0-9_]*))/g,
        (_, braced, plain) => {
            const name = braced ?? plain;
            const result = env[name];
            if (result === undefined)
                throw new Error(`Environment variable '${name}' is not defined`);
            return result;
        },
    );
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
        define: { ...define },
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
