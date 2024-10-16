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

import { class_ns } from '@core/core_tools.js';
import { Box, BoxProps } from '../boxes/boxes';

import "./form.module.scss"

type FormValue = string | number | boolean;
type FormValues = Record<string,FormValue>;

export interface FormProps extends BoxProps {
}

@class_ns( "x4" )
export class Form<P extends FormProps = FormProps> extends Box<P> {

	setValues( values: FormValues ) {
		const items = this.queryAll( "input[name]" );
		console.log( items );
	}

	getValues( ): FormValues {
		const result: FormValues = {};
		return result;
	}
}

