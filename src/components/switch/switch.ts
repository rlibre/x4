/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file switch.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps, makeUniqueComponentId } from '../../core/component';

//import { Checkbox } from '@controls/controls';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { HBox } from '../boxes/boxes';

import "./switch.module.scss";

interface SwitchProps extends ComponentProps {
	label: string;
	checked?: boolean;
	value?: string;
	name?: string;	// with it, a Form reads and writes the switch (a boolean)
}

/**
 * cls "square": the track and the thumb with corners barely rounded; "danger": the colour of an
 * alert when on.
 *
 * @cssvar
 * ```
 * --switch-border
 * --switch-background
 * --switch-background-disabled
 * --switch-checked
 * --switch-danger
 * --switch-thumb
 * ```
 */

export class Switch extends HBox<SwitchProps> {
	static classPrefix = "x4";

	constructor(props: SwitchProps ) {
		super( props );

		const inputId = makeUniqueComponentId( );

		this.setContent( [
			// the track, its thumb in it; the input over them (role switch: a screen reader says "switch, on")
			new Component( {
				cls: "switch",
				content: [
					// value: sent by a <form> of the browser when checked; a Form of x4 reads a boolean
					new Input( { type: "checkbox", id: inputId, name: props.name, value: props.value, checked: props.checked, attrs: { role: "switch" } } ),
					new Component( { cls: "thumb" } ),
				]
	 		} ),
			new Label( {
				tag: "label",
				text: props.label,
				labelFor: inputId,
			}),
		])

		
	}
}