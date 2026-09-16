import fs from "node:fs/promises";
import path from "node:path";

async function walk(source) {
    const files = [];
    const dirs = [];

    async function visit(current) {
        const stat = await fs.stat(current);
        if (!stat.isDirectory()) {
            files.push({ path: current, stat });
            return;
        }

        dirs.push(current);
        const entries = await fs.readdir(current, { withFileTypes: true });
        for (const entry of entries)
            await visit(path.join(current, entry.name));
    }

    try {
        await visit(source);
    }
    catch (error) {
        if (error.code !== "ENOENT")
            throw error;
    }

    return { files, dirs, isDirectory: dirs.includes(source) };
}

function destinationFor(entry, sourceFile) {
    if (!entry.sourceIsDirectory)
        return entry.destRoot;
    return path.join(entry.destRoot, path.relative(entry.from, sourceFile));
}

export function copyPlugin(config, { dev = false } = {}) {
    const entries = config.copy.map((entry) => ({
        ...entry,
        destRoot: path.resolve(config.outdir, entry.to),
    }));
    let previousDestinations = new Set();
    let snapshot = { files: [], dirs: [], fingerprint: "0" };

    async function scan() {
        const files = [];
        const dirs = [];
        const fingerprint = [];

        for (const entry of entries) {
            const result = await walk(entry.from);
            entry.sourceIsDirectory = result.isDirectory;
            dirs.push(...result.dirs);
            for (const item of result.files) {
                files.push({ entry, ...item });
                fingerprint.push(`${item.path}\0${item.stat.size}\0${item.stat.mtimeMs}`);
            }
        }

        snapshot = {
            files,
            dirs,
            fingerprint: fingerprint.sort().join("\n"),
        };
    }

    async function copyFiles() {
        const destinations = new Set();

        for (const item of snapshot.files) {
            const dest = destinationFor(item.entry, item.path);
            destinations.add(dest);
            await fs.mkdir(path.dirname(dest), { recursive: true });
            await fs.copyFile(item.path, dest);
        }

        for (const stale of previousDestinations) {
            if (!destinations.has(stale)) {
                try { await fs.rm(stale, { force: true }); }
                catch { /* ignored */ }
            }
        }

        previousDestinations = destinations;
    }

    return {
        name: "x4-copy",
        setup(build) {
            build.onStart(async () => {
                await scan();
            });

            if (dev) {
                build.onResolve({ filter: /^x4:copy-state$/ }, () => ({
                    path: "copy-state",
                    namespace: "x4-internal",
                }));

                build.onLoad({ filter: /^copy-state$/, namespace: "x4-internal" }, async () => ({
                    contents: `export default ${JSON.stringify(snapshot.fingerprint)};`,
                    loader: "js",
                    watchFiles: snapshot.files.map((item) => item.path),
                    watchDirs: snapshot.dirs,
                }));
            }

            build.onEnd(async (result) => {
                if (result.errors.length === 0)
                    await copyFiles();
            });
        },
    };
}
