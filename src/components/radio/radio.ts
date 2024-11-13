/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file radio.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvChange, makeUniqueComponentId } from '../../core/component';
import { class_ns } from '@core/core_tools';
import { EventCallback } from '@core/core_events';

import { Label } from '../label/label';
import { Input } from '../input/input'
import { HBox } from '../boxes/boxes';
import { svgLoader } from '../components';

import icon from "./radio.svg";
import "./radio.module.scss";

/**
 * Checkbox events
 */

interface RadioEvents extends ComponentEvents {
	change?: EvChange;
}

/**
 * Checkbox properties.
 */

interface RadioProps extends ComponentProps {
	label: string;
	name: string;	// all same names are grouped
	value: number | string;
	checked?: boolean;
	change?: EventCallback<EvChange>;
}

/**
 * 
 */

@class_ns( "x4" )
export class Radio extends Component<RadioProps,RadioEvents> {

	private _check: HBox;
	private _input: Input;
	private _label: Label;

	constructor( props: RadioProps ) {
		super( props );

		this.mapPropEvents( props, 'change' );

		const inputId = makeUniqueComponentId( );
		this.setContent( [
			this._check = new HBox( {cls:'inner', content: [
				this._input = new Input( { 
					type:"radio", 
					id: inputId, 
					name: props.name, 
					value: props.value, 
					checked: props.checked,
					dom_events: {
						change: ( ) => this._on_change( ),
					}
				}),
			]} ),
			this._label = new Label( { 
				tag: 'label',
				text: props.label, 
				id: undefined, 
				labelFor: inputId 
			} ),
		])

		svgLoader.load( icon ).then( svg => {
			this._check.dom.insertAdjacentHTML( "beforeend", svg );
		});
	}

	/**
	 * check state changed
	 */

	private _on_change() {
		this.fire('change', { value:this.getValue() } );
	}

	/**
	 * check the radio
	 * @param {boolean} ck new checked value	
	 */

	public setCheck(ck: boolean) {
		const d = this._input.dom as HTMLInputElement;
		d.checked = ck;
	}

	/**
	 * change the checkbox label
	 * @param text 
	 */

	public setLabel(text: string) {
		this._label.setText( text );
	}

	/**
	 * returns the radio value
	 */

	getValue( ) {
		return this._input.getValue( );
	}
}