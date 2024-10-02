/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file form.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Box } from '../boxes/boxes.js';

import "./form.module.scss"

type FormValue = string | number | boolean;
type FormValues = Record<string,FormValue>;

export class Form extends Box {

	setValues( values: FormValues ) {
		const items = this.queryAll( "input[name]" );
		console.log( items );
	}

	getValues( ): FormValues {
		const result: FormValues = {};
		return result;
	}
}

