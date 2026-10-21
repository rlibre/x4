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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvent, ComponentProps, EvChange, EvFocus } from '../../core/component';
import { class_ns, formatIntlDate, IComponentInterface, IFormElement, isString } from '../../core/core_tools';

import "./input.module.scss"


/**
 * @internal where to look for the radios of a group: the form that holds them,
 * else the document
 */

export function getRadioOwner( el: Element ): ParentNode {

	// two forms of a page can each have a group of the same name;
	// a dialog has its form, its radios are in it
	const form = el.closest( "form" );
	if( form ) {
		return form;
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
 * 
 * @cssvar
 * ```
 * --input-background
 * --input-color
 * --input-color-disabled
 * --input-sel-background
 * --input-sel-color
 * --input-placeholder
 * --input-error
 * --input-checkbox-color
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

		// every type but checkbox and radio (range and file ignore readonly)
		if( props.type!="checkbox" && props.type!="radio" ) {
			this.setAttribute( "required", props.required );
			this.setAttribute( "readonly", props.readonly );
		}

		// placeholder: shown by the browser on text, email, password and number only,
		// not on date nor time (they show their own pattern)
		if( props.type===undefined || props.type=="text" || props.type=="email" || props.type=="password" || props.type=="number" ) {
			this.setAttribute( "placeholder", props.placeholder );
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

				this.setAttribute( "min", p.min );
				this.setAttribute( "max", p.max );
				this.setAttribute( "step", p.step );
				//this.setAttribute( "value", p.value+'' );
				this.setNumValue( isString(p.value) ? parseFloat(p.value) : p.value, -2 );

				this.addDOMEvent( "wheel", ( e: WheelEvent ) => {
					if( this.hasFocus() ) { // only if has focus
						e.preventDefault( );

						// the browser keeps the value between min and max, on the step,
						// and starts from a valid one when the field is empty
						const input = this.dom as HTMLInputElement;
						if( e.deltaY < 0 ) {
							input.stepUp( );
						}
						else {
							input.stepDown( );
						}

						// the decimals of the step: 10.1 shown 10.10 for a step of 0.01
						this.setNumValue( this.getNumValue( ), -2 );
						this.dom.dispatchEvent(new Event('input'));
					}
				}, );
				break;
			}

			case "date": {
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
				if( props.value!==null && props.value!==undefined ) {
					this.setAttribute( "value", props.value );
				}
				break;
			}

			default: {
				if( props.value!==null && props.value!==undefined ) {
					this.setAttribute( "value", props.value );
				}

				if( props.pattern!==null && props.pattern!==undefined ) {
					this.setAttribute( "pattern", props.pattern );
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

		// no number (a field that is not filled): the field is emptied
		if( value===undefined || value===null || isNaN( value ) ) {
			return this.setValue( "" );
		}

		if( ndec==-2 && this.props.type=='number' ) {
			const step = (this.props as NumberProps).step;

			// as many decimals as the step, 4 at most: the step in 1/10000 is an integer,
			// each 0 on its right is a decimal less (0.25 → 2500 → 2, 2.5 → 25000 → 1, 2 → 0)
			if( step!==undefined && step!=1 ) {
				let n = Math.round( step * 10000 );
				let decimals = 4;
				while( n && n%10==0 && decimals ) {
					n /= 10;
					decimals--;
				}

				return this.setValue( value.toFixed( decimals ) );
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
					// checkbox without value, or a boolean one: a boolean; with one: the value when checked,
					// null when not (as a <form>)
					if( this.props.type=='checkbox' ) {
						const value = this.props.value;
						if( value===undefined || typeof value==="boolean" ) {
							return this.getCheck( );
						}

						return this.getCheck( ) ? value : null;
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
					// checkbox with a value (not a boolean): checked by that value (or true)
					if( this.props.type=='checkbox' ) {
						const value = this.props.value;
						const plain = value===undefined || typeof value==="boolean";
						this.setCheck( plain ? !!v : ( v===value || v===true ) );
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

			return i as unknown as T;
		}
		
		return super.queryInterface( name );
	}
}

