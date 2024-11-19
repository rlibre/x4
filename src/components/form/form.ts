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
type FormValues = Record<string,string>;

export interface FormProps extends BoxProps {
	flex?: boolean;
}

@class_ns( "x4" )
export class Form<P extends FormProps = FormProps> extends Box<P> {

	constructor( props: P ) {
		super( { tag: "form", ...props } );

		if( props.flex===false ) {
			this.addClass( "no-flex" );
		}
	}

	setValues( values: FormValues ) {
		const items = this.queryAll( "input[name]" );
		
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

	getValues( ): FormValues {
		const result: FormValues = {}
		const items = this.queryAll( "input[name]" );

		items.forEach( x => {
			const ifx = x.queryInterface( "form-element" ) as IFormElement;
			
			if( ifx ) {
				const nme = x.getAttribute( "name" );
				result[nme] = ifx.getRawValue( );
			}
		});

		return result;
	}
}

