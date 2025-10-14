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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { BaseProps } from '../input/input';
import { Component, ComponentProps } from '../../core/component';

import { Label } from '../label/label';
import { VBox } from '../boxes/boxes';

import "./textarea.module.scss";
import { class_ns, IFormElement } from '../../core/core_tools';

/**
 * 
 */

interface TextAreaProps extends BaseProps {
	label?: string;
	value?: string;
	resize?: boolean;
	readonly?: boolean;
}


/**
 * 
 */

class SimpleTextArea extends Component {

	constructor( props: TextAreaProps ) {
		super( { ...props, tag: "textarea" } );

		this.setAttribute( "name", props.name );
		this.setAttribute( "value", props.value+'' );

		if( !props.resize ) {
			this.setAttribute( "resize", false );
		}

		if( props.readonly ) {
			this.setAttribute( "readonly", true );
		}
	}

	setText( text: string ) {
		(this.dom as HTMLTextAreaElement).value = text;
	}

	getText( ) {
		return (this.dom as HTMLTextAreaElement).value;
	}

	queryInterface<T>(name: string): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getText(); },
				setRawValue: ( v: any ) => { this.setText( v ); },
				isValid: ( ) => { return true; }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}



/**
 * 
 */

@class_ns( "x4" )
export class TextArea extends VBox {
	
	private _input: SimpleTextArea;

	constructor( props: TextAreaProps ) {
		super( props );

		this.setContent( [
			new Label( { text: props.label }),
			this._input = new SimpleTextArea( props )
		])
	}

	setText( text: string ) {
		this._input.setText( text );
	}

	getText( ) {
		return this._input.getText( );
	}

	queryInterface<T>(name: string): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getText(); },
				setRawValue: ( v: any ) => { this.setText( v ); },
				isValid: ( ) => { return true; }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}
