import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { failure } from "./log.mjs";

const cliDir = path.dirname(fileURLToPath(import.meta.url));
const packageFile = path.join(cliDir, "..", "package.json");

function getVersion() {
    try {
        return JSON.parse(fs.readFileSync(packageFile, "utf8")).version ?? "unknown";
    }
    catch {
        return "unknown";
    }
}

function printHelp(version) {
    console.log(`x4js ${version}

Usage:
  x4js create <project> [--template <name>] [--no-install]
  x4js templates
  x4js dev [--config <file>] [--host <host>] [--port <port>] [--http|--https] [--open]
  x4js build [--config <file>] [--debug]

Options:
  --config <file>  Config file (default: x4.config.json)
  -h, --help       Show help
  -v, --version    Show version`);
}

const version = getVersion();
const [command, ...argv] = process.argv.slice(2);

try {
    switch (command) {
        case "create": {
            const { create } = await import("./create.mjs");
            await create(argv, { version });
            break;
        }
        case "templates": {
            const { templates } = await import("./templates.mjs");
            await templates(argv, { version });
            break;
        }
        case "dev": {
            const { dev } = await import("./dev.mjs");
            await dev(argv);
            break;
        }
        case "build": {
            const { build } = await import("./build.mjs");
            await build(argv);
            break;
        }
        case undefined:
        case "help":
        case "--help":
        case "-h":
            printHelp(version);
            break;
        case "--version":
        case "-v":
            console.log(version);
            break;
        default:
            throw new Error(`Unknown command '${command}'. Run 'x4js --help'.`);
    }
}
catch (error) {
    failure(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
}
