/**
 * The code of the gallery: a tiny highlighter, the code that builds a component
 * from its props, and the view that shows it.
 */

import { BoxProps, Button, Component, Flex, HBox, VBox, sanitizeHtml, setClipboard, unsafeHtml } from 'x4js';
import { DemoControl } from './types';
import { texts } from './texts';

const keywords = new Set( [
	"as", "async", "await", "break", "case", "catch", "class", "const", "constructor", "continue", "declare",
	"default", "delete", "do", "else", "export", "extends", "false", "finally", "for", "from", "function",
	"if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "of", "private",
	"protected", "public", "readonly", "return", "static", "super", "switch", "this", "throw", "true", "try",
	"type", "typeof", "undefined", "var", "void", "while",
] );

// a comment, a string, a number, a word
const tokens = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)/g;

/**
 * the html of a code: the comments, strings, numbers, keywords and class names in a span;
 * also good enough for scss
 */

export function highlight( code: string ) {
	let html = "";
	let last = 0;

	for( const m of code.matchAll( tokens ) ) {
		const [all, comment, str, num, word] = m;

		let cls = "";
		if( comment ) {
			cls = "comment";
		}
		else if( str ) {
			cls = "string";
		}
		else if( num ) {
			cls = "number";
		}
		else if( keywords.has( word ) && code[m.index + all.length] != ":" ) {	// not a prop: default: "home"
			cls = "keyword";
		}
		else if( /^[A-Z]/.test( word ) ) {
			cls = "class";
		}

		html += sanitizeHtml( code.slice( last, m.index ) );
		html += cls ? `<span class="${cls}">${sanitizeHtml( all )}</span>` : sanitizeHtml( all );
		last = m.index + all.length;
	}

	return html + sanitizeHtml( code.slice( last ) );
}

/**
 * a value as written in the code: a string quoted, a boolean or a number as it is,
 * an option that carries its text (`icon_save`) as this text
 */

function valueCode( value: any, control: DemoControl ) {
	if( control && control.options ) {
		const option = control.options.find( o => o.id === value );
		if( option && option.data ) {
			return option.data as string;
		}
	}

	return typeof value === "string" ? JSON.stringify( value ) : String( value );
}

/**
 * the props that are set: not false, not empty, or, for a control that gives the
 * default of x4, not this default. The component is built with them, the code
 * lists them: what is not set keeps the default of x4.
 */

export function setProps( props: Record<string, any>, controls: DemoControl[] ) {
	const set: Record<string, any> = {};
	for( const key in props ) {
		const value = props[key];
		const control = controls.find( c => c.name == key );

		if( control && control.default !== undefined ) {
			if( value !== control.default ) {
				set[key] = value;
			}
		}
		else if( value !== undefined && value !== null && value !== false && value !== "" ) {
			set[key] = value;
		}
	}
	return set;
}

/**
 * the code that builds a component: `new Button( { label: "Save", disabled: true } )`,
 * with the props that are set. extra: the props the configurator does not edit, written first.
 */

export function makeCode( name: string, props: Record<string, any>, controls: DemoControl[], extra?: string ) {
	const parts: string[] = [];
	if( extra ) {
		parts.push( extra );
	}

	const set = setProps( props, controls );
	for( const key in set ) {
		parts.push( `${key}: ${valueCode( set[key], controls.find( c => c.name == key ) )}` );
	}

	const line = `new ${name}( { ${parts.join( ", " )} } )`;
	if( line.length <= 80 ) {
		return line;
	}

	// too long for a line: a prop per line
	return `new ${name}( {\n${parts.map( p => "\t" + p + ",\n" ).join( "" )}} )`;
}

/**
 * a code shown: a tab per file (.ts, .scss when there is a style), a copy button
 */

interface CodeViewProps extends BoxProps {
	ts: string;
	scss?: string;
}

export class CodeView extends VBox<CodeViewProps> {
	declare protected refs: { ts: Button; scss: Button; copy: Button; pre: Component };

	private code: { ts: string, scss: string };
	private tab: "ts" | "scss" = "ts";

	constructor( props: CodeViewProps ) {
		super( props );

		this.code = { ts: props.ts, scss: props.scss ?? "" };

		this.setContent( [
			new HBox( { cls: "bar", content: [
				this.refs.ts = new Button( { cls: "tab", label: ".ts", click: ( ) => this.showTab( "ts" ) } ),
				this.code.scss ? this.refs.scss = new Button( { cls: "tab", label: ".scss", click: ( ) => this.showTab( "scss" ) } ) : null,
				new Flex( ),
				this.refs.copy = new Button( { cls: "copy", label: texts( ).copy, click: ( ) => this.copy( ) } ),
			] } ),
			this.refs.pre = new Component( { tag: "pre" } ),
		] );

		this.showTab( "ts" );
	}

	setCode( ts: string ) {
		this.code.ts = ts;
		this.showTab( this.tab );
	}

	private showTab( tab: "ts" | "scss" ) {
		this.tab = tab;
		this.refs.pre.setContent( unsafeHtml( highlight( this.code[tab] ) ) );
		this.refs.ts.setClass( "active", tab == "ts" );
		if( this.refs.scss ) {
			this.refs.scss.setClass( "active", tab == "scss" );
		}
	}

	// setClipboard: navigator.clipboard, which may refuse (a page not in https)
	private async copy( ) {
		const ok = await setClipboard( { text: this.code[this.tab] } );
		this.refs.copy.setText( ok ? texts( ).copied : texts( ).not_copied );
		this.setTimeout( "copy", 1500, ( ) => this.refs.copy.setText( texts( ).copy ) );
	}
}
