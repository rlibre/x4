/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file form.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns, IFormElement } from '@core/core_tools.js';
import { Box, BoxProps } from '../boxes/boxes';

import "./form.module.scss"

//type FormValue = string | number | boolean;
export type FormValues = Record<string,string>;

export interface FormProps extends BoxProps {
	autoComplete?: boolean;
}

type ValidationFn = ( values: FormValues, is_valid: boolean ) => boolean;

/**
 * 
 */

@class_ns( "x4" )
export class Form<P extends FormProps = FormProps> extends Box<P> {
	
	private validator: ValidationFn;

	constructor( props: P ) {
		super( { tag: "form", ...props } );

		if( props.flex===false ) {
			this.addClass( "no-flex" );
		}

		if( props.autoComplete!==undefined ) {
			this.setAutoComplete( props.autoComplete );
		}
	}

	/**
	 * 
	 */

	private _get_inputs( ) {
		return this.queryAll( "input[name], select[name], .x4combobox[name]" );
	}

	/**
	 * 
	 */

	setValues( values: FormValues ) {
		const items = this._get_inputs( );
		
		items.forEach( x => {
			const ifx = x.queryInterface( "form-element" ) as IFormElement;
			
			if( ifx ) {
				const nme = x.getAttribute( "name" );
				if( values.hasOwnProperty( nme) ) {
					ifx.setRawValue( values[nme] );
				}
			}
		});

	}

	/**
	 * 
	 */

	getValues( ): FormValues {
		const result: FormValues = {}
		const items = this._get_inputs( );

		items.forEach( x => {
			const ifx = x.queryInterface( "form-element" ) as IFormElement;
			
			if( ifx ) {
				const nme = x.getAttribute( "name" );
				result[nme] = ifx.getRawValue( );
			}
		});

		return result;
	}

	/**
	 * 
	 */

	setAutoComplete( on = true ) {
		const items = this._get_inputs( );
		items.forEach( x => {		
			x.setAttribute( "autocomplete", on ? "on" : "off" );
		} );
	}

	/**
	 * 
	 */

	setValidator( validator: ValidationFn ) {

		if( !this.validator ) {
			this.validator = validator;
			
			// validation en live des valeurs
			// disable du bouton ok si pas bon
			this.addDOMEvent( "focusout", ( ) => this.validate() );
		}
	}

	/**
	 * 
	 */

	validate( ): FormValues {

		const items = this._get_inputs( );
		
		let result: FormValues = {};
		let is_valid = true;

		for( let x of items ) {
			const ifx = x.queryInterface( "form-element" ) as IFormElement;
			
			if( ifx ) {
				const nme = x.getAttribute( "name" );
				result[nme] = ifx.getRawValue( );
				if( !ifx.isValid() ) {
					is_valid = false;
				}
			}
		}

		if( this.validator ) {
			let new_values = {...result};
			if( !this.validator( new_values, is_valid ) ) {
				return null;
			}

			for( let name in result ) {
				if( new_values[name] != result[name] ) {
					const x = this.query( `input[${name}"]` );
					const ifx = x.queryInterface( "form-element" ) as IFormElement;
					ifx.setRawValue( new_values[name] );
				}
			}

			result = new_values;
		}
		else if( !is_valid ) {
			result = null;
		}

		return result;
	}
}

