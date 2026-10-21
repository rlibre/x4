/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file textarea.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 * 
 * 2026-05-26: added resize types
 **/

import { BaseProps } from '../input/input';
import { Component, ComponentEvents, ComponentProps, EvChange, EvFocus } from '../../core/component';

import { Label } from '../label/label';
import { VBox } from '../boxes/boxes';

import "./textarea.module.scss";
import { class_ns, IFormElement } from '../../core/core_tools';

/**
 * 
 */

export interface SimpleTextAreaProps extends BaseProps {
	value?: string;
	resize?: boolean | "none" | "vertical" | "horizontal" | "both";
	readonly?: boolean;
	trim?: boolean;
}

export interface TextAreaProps extends SimpleTextAreaProps {
	label?: string;
}

export interface TextAreaEvents extends ComponentEvents {
	focus: EvFocus;
	change: EvChange;
}


/**
 *
 */

@class_ns( "x4" )
export class SimpleTextArea extends Component<SimpleTextAreaProps,TextAreaEvents> {

	constructor( props: SimpleTextAreaProps ) {
		super( { ...props, tag: "textarea" } );

		this.mapPropEvents( props, "focus", "change" );

		this.setAttribute( "name", props.name );
		if( props.value ) {
			this.setText( props.value+'' );
		}

		// none by default (the stylesheet); true: "both", false: "none"
		if( props.resize!==undefined ) {
			this.setStyleValue( "resize", props.resize===true ? "both" : props.resize===false ? "none" : props.resize );
		}

		if( props.readonly ) {
			this.setAttribute( "readonly", true );
		}

		if( props.placeholder ) {
			this.setAttribute( "placeholder", props.placeholder );
		}

		if( props.required ) {
			this.setAttribute( "required", true );
		}

		if( props.autofocus ) {
			this.setAttribute( "autofocus", true );
		}

		this.addDOMEvent( "blur", ( ) => this.fire( "focus", { focus_out: true } ) );
		this.addDOMEvent( "focus", ( ) => this.fire( "focus", { focus_out: false } ) );
		this.addDOMEvent( "input", ( ) => this.fire( "change", { value: this.getText( ) } ) );
	}

	setText( text: string ) {
		(this.dom as HTMLTextAreaElement).value = text;
	}

	getText( ) {
		let text = (this.dom as HTMLTextAreaElement).value;
		if( this.props.trim!==false ) {
			text = text.trim();
		}

		return text;
	}

	scrollToBottom( ) {
		this.dom.scrollTop = this.dom.scrollHeight;
	}

	/** false when it is required and empty */

	isValid( ) {
		return !this.props.required || this.getText( )!=="";
	}

	queryInterface<T>(name: string): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getText(); },
				setRawValue: ( v: any ) => { this.setText( v ); },
				isValid: ( ) => { return this.isValid( ); }
			};

			return i as unknown as T;
		}
		
		return super.queryInterface( name );
	}
}



/**
 * 
 * @cssvar
 * ```
 * --textarea-border
 * --textarea-border-focus
 * --textarea-selection
 * --textarea-selection-color
 * --textarea-background
 * --textarea-color
 * ```
 */

@class_ns( "x4" )
export class TextArea extends VBox {
	
	private _input: SimpleTextArea;

	constructor( props: TextAreaProps ) {
		super( props );


		const { value, resize, readonly, trim, name, placeholder, required, autofocus, focus, change } = props;

		this.setContent( [
			new Label( { text: props.label }),
			this._input = new SimpleTextArea( { value,resize,readonly,trim,name,placeholder,required,autofocus,focus,change } )
		])
	}

	setText( text: string ) {
		this._input.setText( text );
	}

	getText( ) {
		return this._input.getText( );
	}

	scrollToBottom( ) {
		this._input.scrollToBottom( );
	}

	/** false when it is required and empty */

	isValid( ) {
		return this._input.isValid( );
	}

	queryInterface<T>(name: string): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getText(); },
				setRawValue: ( v: any ) => { this.setText( v ); },
				isValid: ( ) => { return this.isValid( ); }
			};

			return i as unknown as T;
		}
		
		return super.queryInterface( name );
	}
}
