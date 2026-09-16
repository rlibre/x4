import fs from "node:fs/promises";
import path from "node:path";

export function rawFilePlugin({ filter, mime }) {
    const namespace = "x4-raw-file";

    return {
        name: "x4-raw-file",

        setup(build) {
            build.onResolve({ filter }, (args) => {
                // Seulement les imports JS/TS.
                if (
                    args.kind !== "import-statement" &&
                    args.kind !== "dynamic-import"
                ) {
                    return;
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