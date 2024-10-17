/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file progress.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '@core/core_tools.js';
import { Component, ComponentProps } from '../../core/component';

import "./progress.module.scss";

interface ProgressProps extends ComponentProps {
	value: number;
	min: number;
	max: number;
}

@class_ns( "x4" )
export class Progress extends Component<ProgressProps> {

	private _bar: Component;

	constructor( props: ProgressProps ) {
		super( props );

		this.setContent( this._bar=new Component( { cls: "bar" } ) );
		this.setValue( props.value );
	}

	setValue( value: number ) {
		const perc = value / (this.props.max-this.props.min) * 100;
		this._bar.setStyleValue( "width", perc+"%" );
	}
}