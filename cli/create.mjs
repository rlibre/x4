import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { parseArgs } from "node:util";
import { fetchTemplates, fetchTemplateFiles, downloadTemplateFile } from "./templates-source.mjs";
import { info, success } from "./log.mjs";

function x4Minor(version) {
    const match = /^(\d+)\.(\d+)/.exec(version);
    if (!match)
        throw new Error(`Invalid x4js version '${version}'`);
    return `${match[1]}.${match[2]}`;
}

function validatePackageName(name) {
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(name))
        throw new Error(`Invalid project name '${name}'. Use lowercase letters, digits, '.', '_' or '-'.`);
}

async function ensureEmptyTarget(target) {
    try {
        const entries = await fs.readdir(target);
        if (entries.length)
            throw new Error(`Target directory is not empty: ${target}`);
        return false;
    }
    catch (error) {
        if (error.code === "ENOENT") {
            await fs.mkdir(target, { recursive: true });
            return true;
        }
        throw error;
    }
}

async function clearDirectory(target) {
    const entries = await fs.readdir(target, { withFileTypes: true });
    await Promise.all(entries.map((entry) =>
        fs.rm(path.join(target, entry.name), { recursive: true, force: true })
    ));
}

async function patchPackage(target, projectName, version) {
    const filename = path.join(target, "package.json");
    let pkg;
    try {
        pkg = JSON.parse(await fs.readFile(filename, "utf8"));
    }
    catch (error) {
        throw new Error(`Template package.json is missing or invalid: ${error.message}`);
    }

    pkg.name = projectName;
    const minor = x4Minor(version);

    if (pkg.dependencies?.x4js !== undefined)
        pkg.dependencies.x4js = minor;
    else if (pkg.devDependencies?.x4js !== undefined)
        pkg.devDependencies.x4js = minor;
    else {
        pkg.dependencies ??= {};
        pkg.dependencies.x4js = minor;
    }

    await fs.writeFile(filename, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function npmInstall(target) {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    await new Promise((resolve, reject) => {
        const child = spawn(command, ["install"], {
            cwd: target,
            stdio: "inherit",
        });
        child.on("error", reject);
        child.on("exit", (code, signal) => {
            if (code === 0)
                resolve();
            else
                reject(new Error(`npm install failed${signal ? ` (${signal})` : ` (exit ${code})`}`));
        });
    });
}

export async function create(argv = [], { version = "unknown", cwd = process.cwd() } = {}) {
    const { values, positionals } = parseArgs({
        args: argv,
        options: {
            template: { type: "string", short: "t", default: "app" },
            "no-install": { type: "boolean", default: false },
        },
        allowPositionals: true,
        strict: true,
    });

    if (positionals.length !== 1)
        throw new Error("Usage: x4js create <project> [--template <name>] [--no-install]");

    const target = path.resolve(cwd, positionals[0]);
    const projectName = path.basename(target);
    validatePackageName(projectName);

    const manifest = await fetchTemplates(version);
    if (!(values.template in manifest))
        throw new Error(`Unknown template '${values.template}'. Run 'x4js templates' to list templates.`);

    const targetCreated = await ensureEmptyTarget(target);
    info("create", target);
    info("template", values.template);

    try {
        const files = await fetchTemplateFiles(values.template, version);

        await Promise.all(files.map(async (file) => {
            if (!file.path || file.path.split("/").includes(".."))
                throw new Error(`Unsafe template path '${file.path}'`);
            const destination = path.join(target, ...file.path.split("/"));
            await fs.mkdir(path.dirname(destination), { recursive: true });
            const data = await downloadTemplateFile(file.url, version);
            await fs.writeFile(destination, data);
        }));

        await patchPackage(target, projectName, version);

        if (!values["no-install"]) {
            info("install", "npm");
            await npmInstall(target);
        }

        success("created", target);
    }
    catch (error) {
        if (targetCreated)
            await fs.rm(target, { recursive: true, force: true });
        else
            await clearDirectory(target);
        throw error;
    }
}

export { x4Minor };
