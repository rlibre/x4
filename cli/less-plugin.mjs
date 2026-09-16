import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

async function loadLess(projectRoot) {
    const require = createRequire(path.join(projectRoot, "package.json"));
    let resolved;
    try {
        resolved = require.resolve("less");
    }
    catch {
        throw new Error(
            'LESS support requires the "less" package.\n' +
            'Install it with: npm install -D less',
        );
    }

    const module = await import(pathToFileURL(resolved).href);
    return module.default ?? module;
}

export function lessPlugin(projectRoot) {
    let lessPromise;

    return {
        name: "x4-less",
        setup(build) {
            build.onLoad({ filter: /\.less$/ }, async (args) => {
                const source = await fs.readFile(args.path, "utf8");
                lessPromise ??= loadLess(projectRoot);
                const less = await lessPromise;

                const result = await less.render(source, {
                    filename: args.path,
                });

                return {
                    contents: result.css,
                    loader: "css",
                    resolveDir: path.dirname(args.path),
                    watchFiles: [args.path, ...(result.imports ?? [])],
                };
            });
        },
    };
}
