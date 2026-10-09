import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const run = (cmd: string): void => {
	execSync(cmd, { stdio: "inherit" });
};

const pkgPath = "./package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

const version: number[] = pkg.version.split(".").map(Number);
version[2]++;
pkg.version = version.join(".");

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// The changes of this release are under the first heading of the changelog:
// give it the number and the date of the release. A heading that already has
// a date belongs to a release that is out: nothing was noted since.
const logPath = "./changelog.md";
const log = readFileSync(logPath, "utf-8");
const first = /^## .*$/m.exec(log);

if (first && !/\(\d{4}-\d{2}-\d{2}\)$/.test(first[0])) {
	const today = new Date().toISOString().slice(0, 10);
	writeFileSync(logPath, log.replace(first[0], `## ${pkg.version} (${today})`));
}

try {
	run( `git commit -am "release: ${pkg.version}"` );
	run( `git push` );
	run( `git tag ${pkg.version}`);
	run( "git push --tags");
} 
catch (e) {
	console.error("Échec du push :", e instanceof Error ? e.message : e);
	process.exit(-11);
}