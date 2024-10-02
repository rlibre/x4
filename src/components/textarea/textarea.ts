/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
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
import { Component } from '@core/component';

import { Label } from '../label/label';
import { VBox } from '../boxes/boxes';

import "./textarea.module.scss";

/**
 * 
 */

interface TextAreaProps extends BaseProps {
	label?: string;
	value?: string;
	resize?: boolean;
}

export class TextArea extends VBox {
	
	private _input: Component;

	constructor( props: TextAreaProps ) {
		super( props );

		this.setContent( [
			new Label( { text: props.label }),
			this._input = new Component( { tag: "textarea" })
		])

		this._input.setAttribute( "name", props.name );
		this._input.setAttribute( "value", props.value+'' );

		if( !props.resize ) {
			this._input.setAttribute( "resize", false );
		}
	}
}
