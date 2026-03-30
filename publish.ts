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