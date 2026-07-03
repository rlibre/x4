import { class_ns } from '../../core/core_tools';
import { Component, ComponentProps } from '../../core/component';

import Monaco from './bin/monaco'; 
import "./monaco.module.scss"


interface MonacoEditorProps extends ComponentProps {
	language: "typescript" | "javascript" | "json" | "css" | "html" | string;
	theme?: string;
	content?: string;
	options?: Monaco.editor.IEditorOptions & Monaco.editor.IGlobalEditorOptions;
}

@class_ns( "x4" )
export class MonacoEditor extends Component<MonacoEditorProps> {

	private static _initCount = 0;
	private static _basePath: string = "monaco/";
	private static _monaco: typeof Monaco;
	private static _initCbs: Function[] = [];

	private _editor: Monaco.editor.IStandaloneCodeEditor;

	static async _start( ) { 
		if( this._initCount ) {
			return;
		}

        // dynamic import (without esbuild intervention)
        const dynamicImport = new Function("path", "return import('./'+path)");
        this._monaco = (await dynamicImport(this._basePath + "monaco.js")).default;
		this._initCount++;

		globalThis.MonacoEnvironment = {
			getWorkerUrl: function (_moduleId, label) {
				let workerPath: string;

				if (label == 'json') {
					workerPath = 'json.worker.js';
				}
				else if (label == 'css' || label == 'scss' || label == 'less') {
					workerPath = 'css.worker.js';
				}
				else if (label == 'html' ) {
					workerPath = 'html.worker.js';
				}
				else if (label === 'typescript' || label === 'javascript') {
					workerPath = 'ts.worker.js';
				}
				else {
					workerPath = "editor.worker.js";
				}

				const fullpath = MonacoEditor._basePath+'workers/'+workerPath;
				//console.log( `getting "${label} path: ${fullpath}` );
				return fullpath;
			}
		};

        // custom append css
		const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = MonacoEditor._basePath+'monaco.css';
        link.type = 'text/css';
        document.head.appendChild(link);
	}

	static addTypelib( name: string, code: string ) {
		const register = ( ) => {
			///@ts-ignore
			const ts = MonacoEditor._monaco.languages.typescript;
			///@ts-ignore
			ts.typescriptDefaults.addExtraLib( code, `ts:filename/${name}`);
		}

		if( MonacoEditor._monaco ) {
			register( );
		}
		else {
			this._initCbs.push( register );
		}
	}

	constructor( props: MonacoEditorProps ) {
		const content = props.content;
		delete props.content;

		super( props );

		MonacoEditor._start( )
			.then( ( ) => {
				MonacoEditor._initCbs.forEach( x => x() );

				this._editor = MonacoEditor._monaco.editor.create( this.dom as HTMLElement, {
					value: content,
					language: props.language,
					theme: props.theme,
					//automaticLayout: true,
				});

				if( props.options ) {
					this._editor.updateOptions( props.options );
				}
			} );

		this.addDOMEvent( "resized", ( ) => {
			//const rc = this.getBoundingRect( );
			if( this._editor ) {
				this._editor.layout();
			}
		})
	}

	setTheme( name: string ) {
		MonacoEditor._monaco.editor.setTheme( name );
	}

	queryInterface<T>(name: string): T {
		if( name=='tab-handler' ) {
			const rc = {
				focusNext: ( ) : boolean => { return false; }
			}
			return rc as T;
		}

		return super.queryInterface( name );
	}

	static async monaco( ) {
		await this._start( );
		return this._monaco;
	}
}

