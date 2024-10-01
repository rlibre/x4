import { Component, ComponentProps } from '@core/component';
//import { formatDate } from '@core/tools';

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

	getValue( ) {
		return (this.dom as HTMLInputElement).value;
	}
	
	setValue( value: string ) {
		(this.dom as HTMLInputElement).value = value+"";
	}

	getNumValue( ) {
		return parseFloat( this.getValue() );
	}

	setNumValue( value: number ) {
		this.setValue( value+"" );
	}
}


