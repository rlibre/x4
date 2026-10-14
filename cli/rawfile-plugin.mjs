import fs from "node:fs/promises";
import path from "node:path";

export function rawFilePlugin({ filter, mime }) {
    const namespace = "x4-raw-file";

    return {
        name: "x4-raw-file",

        setup(build) {
            build.onResolve({ filter }, async (args) => {
                // Seulement les imports JS/TS.
                // pluginData: the call of build.resolve below, which esbuild resolves itself
                if (
                    (args.kind !== "import-statement" &&
                    args.kind !== "dynamic-import") ||
                    args.pluginData === namespace
                ) {
                    return;
                }

                // a package: esbuild finds it in node_modules. Its file is read here
                // too, in base64: Icon inserts the svg of the url as it is, a "%23"
                // of a url in text would stay in it
                if (!args.path.startsWith(".") && !path.isAbsolute(args.path)) {
                    const found = await build.resolve(args.path, {
                        kind: args.kind,
                        resolveDir: args.resolveDir,
                        importer: args.importer,
                        pluginData: namespace,
                    });

                    if (found.errors.length) {
                        return { errors: found.errors };
                    }

                    return { path: found.path, namespace };
                }

                return {
                    path: path.resolve(args.resolveDir, args.path),
                    namespace,
                };
            });

            build.onLoad(
                { filter: /.*/, namespace },
                async (args) => {
                    const data = await fs.readFile(args.path);

                    const value =
                        `data:${mime};base64,${data.toString("base64")}`;

                    return {
                        contents:
                            `export default ${JSON.stringify(value)};`,
                        loader: "js",
                    };
                }
            );
        },
    };
}