/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file input.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps } from '@core/component';
import { IComponentInterface, IFormElement } from '@core/core_tools.js';

import "./input.module.scss"

export interface BaseProps extends ComponentProps {
	name?: string;
}

interface CheckboxProps extends BaseProps {
	type: "checkbox";
	value?: boolean | number | string;
	checked?: boolean;
}

interface RadioProps extends BaseProps {
	type: "radio";
	value: boolean | number | string;
	checked?: boolean;
}

export interface RangeProps extends BaseProps {
	type: "range";
	value: number;
	min: number;
	max: number;
	step?: number;
}

interface DateProps extends BaseProps {
	type: "date";
	readonly?: boolean;
	required?: boolean;
	value: Date | string;
}

interface NumberProps extends BaseProps {
	type: "number";
	readonly?: boolean;
	required?: boolean;
	value: number | string;
	min: number;
	max: number;
	step?: number;
}

interface FileProps extends BaseProps {
	type: "file";
	accept: string | string[];
}

export interface TextInputProps extends BaseProps {
	type: "text" | "email" | "password";
	readonly?: boolean;
	required?: boolean;
	pattern?: string;
	value: string | number;
	placeholder?: string;
	spellcheck?: boolean;
}


export type InputProps = CheckboxProps | RadioProps | TextInputProps | RangeProps | DateProps | NumberProps | FileProps;



/**
 * 
 */

export class Input extends Component<InputProps> {
	constructor( props: InputProps ) {
		super( { tag: "input", ...props } );

		this.setAttribute( "type", props.type ?? "text" );
		this.setAttribute( "name", props.name );
					
		switch( props.type ) {
			case "checkbox":
			case "radio": {
				this.setAttribute( "checked", props.checked );
				this.setAttribute( "value", props.value );
				break;
			}

			case "range": {
				this.setAttribute( "min", props.min );
				this.setAttribute( "max", props.max );
				this.setAttribute( "step", props.step );
				this.setAttribute( "value", props.value );
				break;
			}

			case "number": {
				this.setAttribute( "required", props.required );
				this.setAttribute( "readonly", props.readonly );
				this.setAttribute( "min", props.min );
				this.setAttribute( "max", props.max );
				this.setAttribute( "step", props.step );
				this.setAttribute( "value", props.value+'' );
				break;
			}

			case "date": {
				this.setAttribute( "required", props.required );

				let v = props.value;
				if( v instanceof Date ) {
					//this.setAttribute( "value", formatDate( v, "Y-M-D" ) );
				}
				else {
					this.setAttribute( "value", v );
				}

				break;
			}

			case "file": {
				let v: string;
				if( Array.isArray(props.accept) ) {
					v = props.accept.join("," );
				}
				else {
					v = props.accept;
				}

				this.setAttribute( "accept", v );
				break;
			}

			default: {
				this.setAttribute( "required", props.required );
				this.setAttribute( "readonly", props.readonly );

				if( props.value!==null && props.value!==undefined ) {
					this.setAttribute( "value", props.value );
				}

				if( props.pattern!==null && props.pattern!==undefined ) {
					this.setAttribute( "pattern", props.pattern );
				}

				if( props.placeholder!==null && props.placeholder!==undefined ) {
					this.setAttribute( "placeholder", props.placeholder );
				}

				if( props.spellcheck===false ) {
					this.setAttribute( "spellcheck", false );
				}

				break;
			}
		}
	}

	/**
	 * @returns 
	 */

	public getValue( ) {
		return (this.dom as HTMLInputElement).value;
	}
	
	/**
	 * 
	 * @param value 
	 */
	
	public setValue( value: string ) {
		(this.dom as HTMLInputElement).value = value+"";
	}

	/**
	 * 
	 * @returns 
	 */
	
	public getNumValue( ) {
		return parseFloat( this.getValue() );
	}

	/**
	 * 
	 * @param value 
	 */

	public setNumValue( value: number ) {
		this.setValue( value+"" );
	}

	/**
	 * 
	 */

	public setReadOnly( ro: boolean ) {
		const d = this.dom as HTMLInputElement;
		d.readOnly = ro;
	}

	/**
	 * select all the text
	 */

	public selectAll( ) {
		const d = this.dom as HTMLInputElement;
        d.select(); 
	}

	/**
	 * select a part of the text
	 * @param start 
	 * @param length 
	 */

	public select( start: number, length: number = 9999 ) : void {
		const d = this.dom as HTMLInputElement;
		d.setSelectionRange( start, start+length );
	}

	/**
	 * get the selection as { start, length }
	 */

	public getSelection( ) {
		const d = this.dom as HTMLInputElement;

		return {
			start: d.selectionStart,
			length: d.selectionEnd - d.selectionStart,
		};
	}

	/**
	 * 
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getValue(); },
				setRawValue: ( v: any ) => { this.setValue(v); }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}





