import fs from "node:fs/promises";
import { parseArgs } from "node:util";
import esbuild from "esbuild";
import { loadConfig } from "./config.mjs";
import { createBuildOptions } from "./build-options.mjs";
import { info, success } from "./log.mjs";

export async function build(argv = [], root = process.cwd()) {
    const { values, positionals } = parseArgs({
        args: argv,
        options: {
            debug: { type: "boolean", default: false },
        },
        allowPositionals: true,
        strict: true,
    });

    if (positionals.length)
        throw new Error(`Unexpected argument: ${positionals[0]}`);

    const config = loadConfig(root);
    const mode = values.debug ? "debug" : "production";

    info("mode", mode);
    info("outdir", config.outdir);

    await fs.rm(config.outdir, { recursive: true, force: true });
    await fs.mkdir(config.outdir, { recursive: true });

    const started = performance.now();
    await esbuild.build(createBuildOptions(config, mode));
    success("built", `${Math.round(performance.now() - started)}ms`);
}
