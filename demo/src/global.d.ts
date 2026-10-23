// the svg files x4 imports: their content, as a string
declare module "*.svg" {
	const content: string;
	export default content;
}

// the package.json of the x4js bundled (an alias of x4.config.json, x4.local.json): its version
declare module "x4js-package" {
	const pkg: { version: string };
	export default pkg;
}

// true when the gallery is built on the sources of x4 (x4.local.json)
declare const X4_SOURCES: boolean;
