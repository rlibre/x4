// tsc keeps the imports without a name (import "./x.module.scss") in the declarations:
// they load styles, they declare no type.
import { readFileSync, writeFileSync } from "node:fs";

const path = "types/x4.d.ts";
const declarations = readFileSync( path, "utf-8" );

const styleImport = /^\s*import ["'][^"']+\.s?css["'];\r?\n/gm;
writeFileSync( path, declarations.replace( styleImport, "" ) );
