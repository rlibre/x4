/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file input.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '@core/core_events.js';
import { Component, ComponentEvent, ComponentProps, EvChange, EvFocus } from '../../core/component';
import { class_ns, formatIntlDate, IComponentInterface, IFormElement, isString } from '../../core/core_tools.js';

import "./input.module.scss"

export interface BaseProps extends ComponentProps {
	name?: string;
	autofocus?: boolean;
	required?: boolean;
	readonly?: boolean;
	placeholder?: string;
	
	focus?: EventCallback<EvFocus>;
	change?: EventCallback<EvChange>;
}

interface CheckboxProps extends BaseProps {
	type: "checkbox";
	value?: boolean | number | string;
	checked?: boolean;
}

interface RadioProps extends BaseProps {
	type: "radio";
	value?: boolean | number | string;
	checked?: boolean;
}

export interface RangeProps extends BaseProps {
	type: "range";
	value?: number;
	min: number;
	max: number;
	step?: number;
}

export interface FileProps extends BaseProps {
	type: "file";
	accept: string | string[];
	value?: never;
}


export interface DateProps extends BaseProps {
	type: "date";
	value?: Date | string;
}

export interface TimeProps extends BaseProps {
	type: "time";
	readonly?: boolean;
	required?: boolean;
	value?: string;
}

export interface NumberProps extends BaseProps {
	type: "number";
	readonly?: boolean;
	required?: boolean;
	value?: number | string;
	min?: number;
	max?: number;
	step?: number;
}

export interface TextInputProps extends BaseProps {
	type?: "text" | "email" | "password";
	readonly?: boolean;
	required?: boolean;
	pattern?: string;
	value?: string | number;
	spellcheck?: boolean;
	minlength?: number;
	maxlength?: number;
}


export type InputProps = TextInputProps | CheckboxProps | RadioProps | RangeProps | DateProps | NumberProps | FileProps | TimeProps;


interface InputEvents extends ComponentEvent {
	focus: EvFocus;
	change: EvChange;
}


/**
 * 
 */

@class_ns( "x4" )
export class Input extends Component<InputProps,InputEvents> {
	constructor( props: InputProps ) {
		super( { tag: "input", ...props } );

		this.mapPropEvents( props, "focus", "change" );

		this.setAttribute( "type", props.type ?? "text" );
		this.setAttribute( "name", props.name );

		if( props.autofocus===true ) {
			this.setAttribute( "autofocus", true );
		}
					
		switch( props.type ) {
			case "checkbox":
			case "radio": {
				const ck = this.dom as HTMLInputElement;
				ck.checked = props.checked;
				ck.value = props.value === undefined ? "" : props.value+"";
				//this.setAttribute( "checked", props.checked );
				//this.setAttribute( "value", props.value );
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
				const p = this.props as NumberProps;
			
				this.setAttribute( "required", p.required );
				this.setAttribute( "readonly", p.readonly );
				this.setAttribute( "min", p.min );
				this.setAttribute( "max", p.max );
				this.setAttribute( "step", p.step );
				//this.setAttribute( "value", p.value+'' );
				this.setNumValue( isString(p.value) ? parseFloat(p.value) : p.value, -2 );

				this.addDOMEvent( "wheel", ( e: WheelEvent ) => {
					if( this.hasFocus() ) { // only if has focus
						e.preventDefault( );
						let v = this.getNumValue();
						const delta = e.deltaY < 0 ? 1 : -1;
						v += (p.step ? p.step : 1) * delta;
						this.setNumValue( v, -2 );

						this.dom.dispatchEvent(new Event('input')); 
					}
				}, );
				break;
			}

			case "date": {
				this.setAttribute( "required", props.required );

				let v = props.value;
				if( v instanceof Date ) {
					this.setAttribute( "value", formatIntlDate( v, "Y-M-D" ) );
				}
				else if( props.value!==null && props.value!==undefined ) {
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

			case "time": {
				this.setAttribute( "required", props.required );
				if( props.value!==null && props.value!==undefined ) {
					this.setAttribute( "value", props.value );
				}
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

				if( props.minlength!==undefined ) {
					this.setAttribute( "minlength", props.minlength );
				}
				
				if( props.maxlength!==undefined ) {
					this.setAttribute( "maxlength", props.maxlength );
				}

				break;
			}
		}

		this.addDOMEvent( "blur", ( e ) => { this.on_focus(e,true);} );
		this.addDOMEvent( "focus", ( e ) => { this.on_focus(e,false);} );
		this.addDOMEvent( "input", ( e ) => { this.on_change(e as InputEvent); });
	}

	/**
	 * 
	 */

	private on_focus( ev: FocusEvent, focus_out: boolean ) {
		const event: EvFocus = { focus_out }
		this.fire( "focus", event );

		if( event.defaultPrevented ) {
			ev.preventDefault( );
		}
	}

	/**
	 * 
	 */

	private on_change( ev: InputEvent ) {

		const event: EvChange = { value: this.getValue() };
		this.fire( "change", event );

		if( event.defaultPrevented ) {
			ev.preventDefault( );
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
	
	public getNumValue( defNan?: number ) {
		const v = parseFloat( this.getValue() );
		if( isNaN(v) && defNan!==undefined ) {
			return defNan;
		}
		return v;
	}

	/**
	 * 
	 * @param value 
	 * @param ndec number of decimals or -1 for auto, -2 as prop.step
	 * 
	 */

	public setNumValue( value: number, ndec = -1 ) {
		
		if( ndec==-2 && this.props.type=='number' ) {
			const p = this.props as NumberProps;

			if( p.step ) {
				let ndec = -Math.floor(Math.log10(p.step ?? 1) );
				return this.setValue( value.toFixed(ndec) );
			}
		}
		else if( ndec>=0 ) {
			return this.setValue( value.toFixed(ndec) );
		}

		this.setValue( value+"" );
	}

	/**
	 * @return the checked value
	 */

	public getCheck() {
		const d = this.dom as HTMLInputElement;
		return d.checked;
	}

	/**
	 * change the checked value
	 * @param {boolean} ck new checked value	
	 */

	public setCheck(ck: boolean) {
		const d = this.dom as HTMLInputElement;
		d.checked = ck;
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

	public isValid( ) {

		if( (this.props as any).required ) {
			const v = this.getValue( );
			if( v==="" ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getValue(); },
				setRawValue: ( v: any ) => { this.setValue(v); },
				isValid: ( ) => { return this.isValid(); }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}





