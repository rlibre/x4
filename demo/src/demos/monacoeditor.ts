/**
 * MonacoEditor: the page of the gallery
 */

import { Button, HBox, Label, VBox } from 'x4js';
import { MonacoEditor } from 'x4js/monaco';
import x4package from 'x4js-package';
import { DemoComponent } from '../types';

import "./monacoeditor.scss";

// the gallery does not carry the files of Monaco (14 MB): src/monaco-cdn.js, copied to
// bin/monaco/monaco.js, loads them from jsDelivr, from the package x4js of this version
( globalThis as any ).x4MonacoCDN = `https://cdn.jsdelivr.net/npm/x4js@${x4package.version}/src/components/monaco/bin/`;

/** @demo An editor — Its files are copied to the folder `monaco` of the output, by the `copy` of x4.config.json:
 *
 * `{ "from": "./node_modules/x4js/src/components/monaco/bin", "to": "monaco" }`
 *
 * The first editor loads them: `monaco/monaco.js` beside the bundle, its workers and its css. `language` and `content` (the text at the start) are its props, `options` the ones of Monaco. */
export function editor( ) {
	return new MonacoEditor( { height: 420, language: "typescript",
		options: { minimap: { enabled: false }, fontSize: 13 },
		content: [
			"interface Task {",
			"	id: number;",
			"	title: string;",
			"	done: boolean;",
			"}",
			"",
			"const tasks: Task[] = [",
			"	{ id: 1, title: \"Write the specification\", done: true },",
			"	{ id: 2, title: \"Build the prototype\", done: false },",
			"	{ id: 3, title: \"Review it with the client\", done: false },",
			"];",
			"",
			"// the tasks still to do, by their id",
			"function todo( list: Task[] ): Task[] {",
			"	return list.filter( task => !task.done ).sort( ( a, b ) => a.id - b.id );",
			"}",
			"",
			"for( const task of todo( tasks ) ) {",
			"	console.log( `#${task.id}: ${task.title}` );",
			"}",
			"",
		].join( "\n" ),
	} );
}

/** @demo Its text — `getText` reads the text of the editor, `setText` replaces it. `setTheme` takes a theme of Monaco: `"vs"`, `"vs-dark"`, `"hc-black"`, `"hc-light"`. */
export function text( ) {
	// an x4.config.json that copies Monaco
	const editor = new MonacoEditor( { height: 340, language: "json", content: JSON.stringify( {
		entryPoints: [ "src/main.ts" ],
		outdir: "./bin",
		copy: [
			{ from: "./src/index.html", to: "index.html" },
			{ from: "./node_modules/x4js/src/components/monaco/bin", to: "monaco" },
		],
	}, null, "\t" ) } );
	const result = new Label( { text: "" } );

	return new VBox( { content: [
		editor,
		new HBox( { content: [
			new Button( { label: "Read", click: ( ) => result.setText( `${editor.getText( ).length} characters` ) } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => editor.setText( "{ }" ) } ),
			new Button( { label: "Dark", cls: "outline", click: ( ) => editor.setTheme( "vs-dark" ) } ),
			result,
		] } ),
	] } );
}

/** @demo Typings — `MonacoEditor.addTypelib( name, code )` gives a .d.ts to the completion of typescript: the functions of your application are proposed while typing. It can be called before the first editor: the typings are given once Monaco is loaded. */
export function typings( ) {
	MonacoEditor.addTypelib( "app.d.ts", [
		"interface User { name: string; email: string; admin: boolean }",
		"declare function currentUser( ): User;",
		"declare function notify( text: string, seconds?: number ): void;",
	].join( "\n" ) );

	return new MonacoEditor( { height: 260, language: "typescript", content: [
		"// currentUser and notify come from app.d.ts: type \"user.\" or \"noti\", then ctrl+space",
		"const user = currentUser( );",
		"",
		"if( user.admin ) {",
		"	notify( `welcome back, ${user.name}`, 5 );",
		"}",
		"",
		"// an error: email is a string",
		"const mail: number = user.email;",
		"",
	].join( "\n" ) } );
}

/** @demo A language of your own — Here the formulas of a sheet, with their functions: type a letter, or ctrl+space, the functions are proposed with their help. A language is the one of Monaco, in four steps:
 *
 * - `MonacoEditor.monaco( )` gives the module of Monaco, once loaded
 * - `languages.register( { id } )` declares the language
 * - `languages.setMonarchTokensProvider( id, rules )` colours it: regular expressions that give each piece of text its kind (`keyword`, `number`, `string`...), an `IMonarchLanguage`
 * - `languages.registerCompletionItemProvider( id, provider )` proposes what can be typed, a `CompletionItemProvider`: here the functions, their arguments put as a snippet
 *
 * A language is registered once, for all the editors; the editor is created after it, with `language: id`. */
export function language( ) {
	const functions = [
		{ name: "SUM", args: "value1, value2, ...", help: "The sum of the values." },
		{ name: "AVERAGE", args: "value1, value2, ...", help: "The mean of the values." },
		{ name: "MIN", args: "value1, value2, ...", help: "The smallest of the values." },
		{ name: "MAX", args: "value1, value2, ...", help: "The largest of the values." },
		{ name: "IF", args: "test, then, else", help: "then when the test is true, else otherwise." },
		{ name: "ROUND", args: "value, digits", help: "The value rounded to so many digits." },
	];

	const box = new VBox( { } );

	MonacoEditor.monaco( ).then( monaco => {
		if( !monaco.languages.getLanguages( ).some( lang => lang.id == "formula" ) ) {
			monaco.languages.register( { id: "formula" } );

			monaco.languages.setMonarchTokensProvider( "formula", {
				ignoreCase: true,
				tokenizer: { root: [
					[ /[a-z]+(?=\s*\()/, "keyword" ],		// a function: a name before "("
					[ /[a-z]+[0-9]+/, "variable" ],			// a cell: A1
					[ /\d+(\.\d+)?/, "number" ],
					[ /"[^"]*"/, "string" ],
					[ /[=+\-*\/<>]/, "operator" ],
				] },
			} );

			monaco.languages.registerCompletionItemProvider( "formula", {
				provideCompletionItems: ( model, position ) => {
					const word = model.getWordUntilPosition( position );
					const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };

					return { suggestions: functions.map( fn => ( {
						label: fn.name,
						kind: monaco.languages.CompletionItemKind.Function,
						detail: `${fn.name}( ${fn.args} )`,
						documentation: fn.help,
						insertText: `${fn.name}( $0 )`,
						insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						range,
					} ) ) };
				},
			} );
		}

		box.setContent( new MonacoEditor( { height: 200, language: "formula", content: [
			"=SUM( A1, A2, A3 )",
			"=IF( B1 > 10, \"high\", \"low\" )",
			"=ROUND( AVERAGE( C1, C2, C3 ), 2 )",
			"",
		].join( "\n" ) } ) );
	} );

	return box;
}

/** @demo Like this gallery — The gallery does not carry the files of Monaco: it loads them from jsDelivr, which serves the files of every package of npm, here `https://cdn.jsdelivr.net/npm/x4js@<version>/src/components/monaco/bin/`. Three pieces, in the gallery alone:
 *
 * - `MonacoEditor` imports `./monaco/monaco.js`: there, the gallery puts a small file of its own (below), which imports the `monaco.js` of jsDelivr
 * - the css and the font of Monaco are small: the `copy` of x4.config.json puts them in `monaco/`, beside that file, where the editor looks for them
 * - a browser does not create a worker from another origin: the file adds to `MonacoEnvironment` a `getWorker`, which Monaco calls before `getWorkerUrl`; it makes each worker from a blob that imports the one of jsDelivr
 *
 * The page gives the address before the first editor, in `globalThis.x4MonacoCDN`. It must be served by http. */
export function cdn( ) {
	const box = new VBox( { } );

	// the file of the gallery, read where it is copied: monaco/monaco.js
	fetch( "monaco/monaco.js" )
		.then( response => response.text( ) )
		.then( text => box.setContent( new MonacoEditor( { height: 560, language: "javascript", content: text } ) ) );

	return box;
}

const page: DemoComponent = {
	name: "MonacoEditor",
	category: "Add-ons",
	description: "The code editor of VS Code (Monaco) in a component: the languages, the completion, the themes of Monaco. Not in x4js: it is imported from x4js/monaco. Its files (14 MB) are copied by the application to its output, where the editor loads them; the gallery does not carry them, it loads them from jsDelivr.",
	module: "x4js/monaco",
	demos: [ editor, text, typings, language, cdn ],
};

export default page;
