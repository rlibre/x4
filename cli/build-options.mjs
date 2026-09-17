import path from "node:path";
import { fileURLToPath } from "node:url";
import { sassPlugin } from "esbuild-sass-plugin";
import { lessPlugin } from "./less-plugin.mjs";
import { copyPlugin } from "./copy-plugin.mjs";
import { rawFilePlugin } from "./rawfile-plugin.mjs";
import { diagnosticsPlugin } from "./diagnostic-plugin.mjs";

const cliDir = path.dirname(fileURLToPath(import.meta.url));
const devClient = path.join(cliDir, "dev-client.js");

function versionId() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${pad(now.getFullYear() - 2000)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
}

export function createBuildOptions(config, mode) {
    const production = mode === "production";
    const dev = mode === "dev";

    const defaults = {
        absWorkingDir: config.root,
        entryPoints: config.entryPoints,
        outdir: config.outdir,
        bundle: true,
        charset: "utf8",
        keepNames: true,
        platform: "browser",
		logLevel: "silent",
        format: "iife",
        target: "es2020",
        minify: production,
        sourcemap: production ? false : "linked",
        logLevel: "info",
        external: config.external,
        assetNames: "assets/[name]-[hash]",
        loader: {
            ".svg": "dataurl",
            ".jpg": "file",
            ".jpeg": "file",
            ".png": "file",
            ".ttf": "file",
            ".woff": "file",
            ".woff2": "file",
        },
        define: {
            ...config.define,
            DEBUG_MODE: production ? "false" : "true",
            VERSION_ID: versionId(),
        },
        plugins: [
			rawFilePlugin({
				filter: /\.svg$/,
				mime: "image/svg+xml",
			}),
            sassPlugin({
                type: "css",
                filter: /\.s[ac]ss$/,
            }),
            lessPlugin(config.root),
            copyPlugin(config, { dev }),

			//last
			...(dev ? [diagnosticsPlugin()] : []),
        ],
    };

    if (dev)
        defaults.inject = [devClient];

    // x4.esbuild is intentionally last: it is the escape hatch for projects
    // that need native esbuild options not modeled by x4js.
    return {
        ...defaults,
        ...config.esbuild,
    };
}
