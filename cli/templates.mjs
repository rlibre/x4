import { fetchTemplates } from "./templates-source.mjs";
import { color } from "./log.mjs";

export async function templates(_argv = [], { version = "unknown" } = {}) {
    const manifest = await fetchTemplates(version);
    const names = Object.keys(manifest).sort();
    const width = names.reduce((max, name) => Math.max(max, name.length), 0) + 3;

    console.log(color.cyan("Available templates"));
    console.log();
    for (const name of names)
        console.log(`  ${color.green(name.padEnd(width))}${manifest[name]}`);
}
