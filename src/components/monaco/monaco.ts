import { class_ns, Component, ComponentProps } from '../../x4.js';

import Monaco from './bin/monaco'; 
import "./monaco.module.scss"


interface MonacoEditorProps extends ComponentProps {
	language: "typescript" | "javascript" | "json" | "css" | "html";
	theme?: string;
	content?: string;
	options?: Monaco.editor.IEditorOptions & Monaco.editor.IGlobalEditorOptions;
}

@class_ns( "x4" )
export class MonacoEditor extends Component<MonacoEditorProps> {

	static initCount = 0;
	static basePath: string = "./bin";
	static monaco: typeof Monaco;
	static initCbs: Function[] = [];

	private _editor: Monaco.editor.IStandaloneCodeEditor;

	static async start( ) { 
		if( this.initCount ) {
			return;
		}

		this.monaco = (await import( "./bin/monaco.js" )).default;
		this.initCount++;

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

				const fullpath = MonacoEditor.basePath+'/workers/'+workerPath;
				console.log( `getting "${label} path: ${fullpath}` );
				return fullpath;
			}
		};

		const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = MonacoEditor.basePath+'/monaco.css';
        link.type = 'text/css';
        document.head.appendChild(link);
	}

	static addTypelib( name: string, code: string ) {
		const register = ( ) => {
			///@ts-ignore
			const ts = MonacoEditor.monaco.languages.typescript;
			///@ts-ignore
			ts.typescriptDefaults.addExtraLib( code, `ts:filename/${name}`);
		}

		if( MonacoEditor.monaco ) {
			register( );
		}
		else {
			this.initCbs.push( register );
		}
	}

	constructor( props: MonacoEditorProps ) {
		const content = props.content;
		delete props.content;

		super( props );

		MonacoEditor.start( )
			.then( ( ) => {
				MonacoEditor.initCbs.forEach( x => x() );

				this._editor = MonacoEditor.monaco.editor.create( this.dom as HTMLElement, {
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
}

