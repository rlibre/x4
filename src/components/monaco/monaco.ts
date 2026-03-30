import { Component, ComponentProps } from '../../x4.js';

import * as monaco from './bin/monaco.js';
import "./bin/monaco.css"


interface MonacoEditorProps extends ComponentProps {
	language: "typescript" | "javascript" | "json" | "css" | "html";
	theme?: string;
	content?: string;
}

export class MonacoEditor extends Component<MonacoEditorProps> {

	constructor( props: MonacoEditorProps ) {
		super( props );
		
		monaco.editor.create( this.dom as HTMLElement, {
			value: props.content,
			language: props.language,
			theme: props.theme,
		});
	}
}

