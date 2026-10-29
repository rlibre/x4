/**
 * Monaco from jsDelivr, for the gallery and x4test: they do not carry its files (14 MB).
 *
 * MonacoEditor imports ./monaco/monaco.js: this file, copied there (its css and its font are copied
 * beside it). It loads the monaco.js of jsDelivr, from the folder that the page put in
 * globalThis.x4MonacoCDN (the folder bin of Monaco in the package x4js, of its version), and its
 * workers from there too: a browser does not create a worker of another origin, so Monaco is given
 * them by getWorker, which it calls before getWorkerUrl.
 */

const base = globalThis.x4MonacoCDN;

// MonacoEditor sets MonacoEnvironment once this file is loaded: getWorker is added to it
let env;
Object.defineProperty( globalThis, "MonacoEnvironment", {
	configurable: true,
	get: ( ) => env,
	set: ( value ) => {
		env = { ...value, getWorker: ( id, label ) => {
			// "monaco/workers/ts.worker.js": its file on jsDelivr, imported by a module of this origin
			const file = value.getWorkerUrl( id, label ).replace( /^.*\/workers\//, "workers/" );
			const code = new Blob( [ `import "${base}${file}";` ], { type: "text/javascript" } );
			return new Worker( URL.createObjectURL( code ), { type: "module", name: label } );
		} };
	},
} );

export default ( await import( base + "monaco.js" ) ).default;
