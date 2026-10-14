import { parseArgs } from "node:util";
import { fetchTemplates } from "./templates-source.mjs";
import { color } from "./log.mjs";

export async function templates(argv = [], { version = "unknown" } = {}) {
    // takes no argument: one given is an error
    parseArgs({ args: argv, options: {}, strict: true });

    const manifest = await fetchTemplates(version);
    const names = Object.keys(manifest).sort();
    const width = names.reduce((max, name) => Math.max(max, name.length), 0) + 3;

    console.log(color.cyan("Available templates"));
    console.log();
    for (const name of names)
        console.log(`  ${color.green(name.padEnd(width))}${manifest[name]}`);
}
