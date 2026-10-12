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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools';
import { Component, ComponentProps } from '../../core/component';

import "./progress.module.scss";

interface ProgressProps extends ComponentProps {
	value: number;
	min?: number;	// 0 when missing
	max?: number;	// 100 when missing
}

/**
 * @cssvar
 * ```
 * --progress-background
 * --progress-color
 * ```
 */

@class_ns( "x4" )
export class Progress extends Component<ProgressProps> {

	private _bar: Component;

	constructor( props: ProgressProps ) {
		super( props );

		this.setContent( this._bar=new Component( { cls: "bar" } ) );
		this.setValue( props.value );
	}

	setValue( value: number ) {
		const min = this.props.min ?? 0;
		const max = this.props.max ?? 100;

		// where the value is between the two: min is 0%, max is 100%
		const perc = (value-min) / (max-min) * 100;
		this._bar.setStyleValue( "width", perc+"%" );
	}
}