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

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvent, componentFromDOM, ComponentProps, EvChange, EvFocus } from '../../core/component';
import { class_ns, formatIntlDate, IComponentInterface, IFormElement, isString } from '../../core/core_tools';

import "./input.module.scss"


function getRadioOwner( el: Element )  {

	while( el!=document.body ) {
		const comp = componentFromDOM(el);
		const ifx = comp.queryInterface( "tab-handler");
		if( ifx ) {
			return el;
		}

		el = el.parentElement;
	}

	return document;
}


/**
 * Base properties for all input types.
 */

export interface BaseProps extends ComponentProps {
	/** 
	 * Input field name. 
	 * required if you want to use form getValues/setValues
	 */

	name?: string;
	/** Automatically focus the input on page load. */
	autofocus?: boolean;
	/** Marks the input as required. */
	required?: boolean;
	/** Makes the input read-only. */
	readonly?: boolean;
	/** Placeholder text displayed when empty. */
    placeholder?: string;
	/** Fired when the input receives/loses focus. */
    focus?: EventCallback<EvFocus>;
	/** Fired when the input value changes. */
    change?: EventCallback<EvChange>;
}

/**
 * Checkbox-specific input properties.
 */

interface CheckboxProps extends BaseProps {
	type: "checkbox";
	/** Checkbox value (submitted when checked). */
	value?: boolean | number | string;
	/** Initial checked state. */
	checked?: boolean;
}

/**
 * Radio button-specific input properties.
 */

interface RadioProps extends BaseProps {
	type: "radio";
	/** Radio value (submitted when selected). */
	value?: boolean | number | string;
	/** Initial checked state. */
	checked?: boolean;
}

/**
 * Range slider input properties.
 */

export interface RangeProps extends BaseProps {
	type: "range";
	/** Current slider value. */
	value?: number;
	/** Minimum allowed value. */
	min: number;
	/** Maximum allowed value. */
	max: number;
	/** Step increment. */
	step?: number;
}

/**
 * File upload input properties.
 */
export interface FileProps extends BaseProps {
	type: "file";
	/** Allowed file types (e.g., `"image/*"` or `[".pdf", ".doc"]`). */
	accept: string | string[];
	value?: never;
}

/**
 * Date picker input properties.
 */
export interface DateProps extends BaseProps {
	type: "date";
	/** Current date value (Date object or ISO string). */
    value?: Date | string;
}

/**
 * Time picker input properties.
 */

export interface TimeProps extends BaseProps {
	type: "time";
	readonly?: boolean;
	required?: boolean;
	/** Current time value (e.g., `"12:30"`). */
    value?: string;
}

/**
 * Numeric input properties.
 */

export interface NumberProps extends BaseProps {
	type: "number";
	readonly?: boolean;
	required?: boolean;
	/** Current numeric value. */
    value?: number | string;
	/** Minimum allowed value. */
    min?: number;
	/** Maximum allowed value. */
    max?: number;
	/** Step increment. */
    step?: number;
}

/**
 * Text/email/password input properties.
 */

export interface TextInputProps extends BaseProps {
	type?: "text" | "email" | "password";
	readonly?: boolean;
	required?: boolean;
	/** Regex pattern for validation. */
	pattern?: string;
	/** Input value. */
	value?: string | number;
	/** Enables/disables spellcheck. */
	spellcheck?: boolean;
	/** Minimum input length. */
	minlength?: number;
	/** Maximum input length. */
	maxlength?: number;
	trim?: boolean;
}


export type InputProps = TextInputProps | CheckboxProps | RadioProps | RangeProps | DateProps | NumberProps | FileProps | TimeProps;


interface InputEvents extends ComponentEvent {
	focus: EvFocus;
	change: EvChange;
}


/**
 * Customizable input component supporting multiple types (text, number, date, etc.).
 * Auto-generates CSS class: `x4input`.
 *
 * @example
 * ```ts
 * // Text input
 * const nameInput = new Input({ type: "text", placeholder: "Enter name" });
 *
 * // Checkbox
 * const agreeCheckbox = new Input({
 *   type: "checkbox",
 *   checked: true,
 *   change: (e) => console.log("Checked:", e.value)
 * });
 * ```
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

	/** Gets the current input value as a string. */
    
	public getValue( ) {
		let v = (this.dom as HTMLInputElement).value;
		if( (this.props as any).trim!==false ) {
			v = v.trim( );	
		}

		return v;
	}
	
	/**
     * Sets the input value.
     * @param value - New value (converted to string).
     */
	
	public setValue( value: string ) {
		(this.dom as HTMLInputElement).value = value+"";
	}

	/**
     * Gets the numeric value (for `type="number"` or `type="range"`).
     * @param defNan - Default value if parsing fails (default: `NaN`).
     * @returns Parsed number or `defNan`.
     */
	
	public getNumValue( defNan?: number ) {
		const v = parseFloat( this.getValue() );
		if( isNaN(v) && defNan!==undefined ) {
			return defNan;
		}
		return v;
	}

	/**
     * Sets a numeric value with optional decimal precision.
     * @param value - Numeric value to set.
     * @param ndec - Decimal places:
     *               `-1` = auto,
     *               `-2` = use `step` prop,
     *               `≥0` = fixed decimals.
     */

	public setNumValue( value: number, ndec = -1 ) {
		
		if( ndec==-2 && this.props.type=='number' ) {
			const p = this.props as NumberProps;

			if( p.step<1 ) {
				let ndec = -Math.floor(Math.log10(p.step ?? 1) );
				return this.setValue( value.toFixed(ndec) );
			}
			else if( p.step>1 ) {
				return this.setValue( value.toFixed() );
			}
		}
		else if( ndec>=0 ) {
			return this.setValue( value.toFixed(ndec) );
		}

		this.setValue( value+"" );
	}

	/** Gets the checked state (for checkboxes/radio buttons). */
    public getCheck() {
		const d = this.dom as HTMLInputElement;
		return d.checked;
	}

	/** Sets the checked state (for checkboxes/radio buttons). */
    
	public setCheck(ck: boolean) {
		const d = this.dom as HTMLInputElement;
		d.checked = ck;
	}

	/** Toggles read-only mode. */
    
	public setReadOnly( ro: boolean ) {
		const d = this.dom as HTMLInputElement;
		d.readOnly = ro;
	}

	/** Selects all text in the input. */
    
	public selectAll( ) {
		const d = this.dom as HTMLInputElement;
        d.select(); 
	}

	/**
     * Selects a text range.
     * @param start - Start position 
     * @param length - Length of selection
     */

	public select( start: number, length: number = 9999 ) : void {
		const d = this.dom as HTMLInputElement;
		d.setSelectionRange( start, start+length );
	}

	/**
     * Gets the current text selection.
     * @returns Object with `start` and `length` properties.
     */
	public getSelection( ) {
		const d = this.dom as HTMLInputElement;

		return {
			start: d.selectionStart,
			length: d.selectionEnd - d.selectionStart,
		};
	}

	/** Validates the input (checks `required` constraint). */
    
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
				getRawValue: ( ): any => { 
					if( this.props.type=='checkbox' ) {
						return this.getCheck( );
					}
					else if( this.props.type=='radio' ) {
						const owner = getRadioOwner( this.dom );
						const checked = owner.querySelector( `input[name="${this.props.name}"]:checked` )
						return checked ? (checked as HTMLInputElement).value : undefined;
					}
					else if( this.props.type=='number' ) {
						return this.getNumValue( 0 );
					}
					else {
						return this.getValue(); 
					}
				},
				setRawValue: ( v: any ) => { 
					if( this.props.type=='checkbox' ) {
						this.setCheck( !!v );
					}
					else if( this.props.type=='radio' ) {
						if( this.props.value==v ) {
							this.setCheck( true ) ;
						}
					}
					else if( this.props.type=='number' ) {
						return this.setNumValue( v, -2 );
					}
					else {
						this.setValue(v); 
					}
				},
				isValid: ( ) => { return this.isValid(); }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}

