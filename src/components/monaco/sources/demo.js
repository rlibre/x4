import monaco from './dist/monaco.js';

const myLibCode = `
    declare namespace MyAPI {
        /**
         * Calcule une performance optimale.
         * @param value Le coefficient d'entrée.
         */
        function compute(value: number): string;
    }
`;

const myLibUri = 'ts:filename/myapi.d.ts';

const ts = (monaco.languages).typescript;
ts.typescriptDefaults.addExtraLib(myLibCode, myLibUri);

// Facultatif : Créer un modèle pour que l'éditeur "voie" le fichier
// Utile si tu veux que le "Go to Definition" fonctionne vers ce fichier
monaco.editor.createModel(myLibCode, 'typescript', monaco.Uri.parse(myLibUri));


const el = document.getElementById("container");

globalThis.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId, label) {
		if (label === 'json') return './dist/workers/json.worker.js';
		if (label === 'css' || label === 'scss' || label === 'less') return './dist/workers/css.worker.js';
		if (label === 'html') return './dist/workers/html.worker.js';
		if (label === 'typescript' || label === 'javascript') return './dist/workers/ts.worker.js';
		return './dist/workers/editor.worker.js';
	}
};

monaco.languages["typescript"].typescriptDefaults.setCompilerOptions({
	target: monaco.languages.typescript.ScriptTarget.ESNext,
	allowNonTsExtensions: true,
	moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
	module: monaco.languages.typescript.ModuleKind.CommonJS,
	noEmit: true,
	typeRoots: ["node_modules/@types"]
});

monaco.editor.create(el, {
	value: `
function test( ) {
	for( let i=0; i<1000; i++ ) {
		console.log( "i", i );
	}
}

test( );
			`,
	language: 'typescript',
	theme: 'vs-dark'
});

