import * as esbuild from 'esbuild';

const MONACO_DIR = 'node_modules/monaco-editor/esm/vs';

const commonConfig = {
	bundle: true,
	minify: true,
	format: 'esm',
	target: 'es2022',
	logLevel: 'info',
};

async function build() {
	// 1. Build des Workers (obligatoires pour la coloration/validation)
	// On génère uniquement les workers dont on a besoin
	await esbuild.build({
		...commonConfig,
		entryPoints: {
			'editor.worker': 	`${MONACO_DIR}/editor/editor.worker.js`,
			'ts.worker': 		`${MONACO_DIR}/language/typescript/ts.worker.js`,
			'css.worker': 		`${MONACO_DIR}/language/css/css.worker.js`,
			'html.worker': 		`${MONACO_DIR}/language/html/html.worker.js`,
			'json.worker': 		`${MONACO_DIR}/language/json/json.worker.js`,
		},
		outdir: 'dist/workers',
	});

	// 2. Build de l'application principale
	await esbuild.build({
		...commonConfig,
		entryPoints: ['index.ts'],
		outfile: 'dist/monaco.js',
		globalName: 'monaco',
		loader: {
			'.ttf': 'file',
			'.css': 'css',
		},
	});
}

build();