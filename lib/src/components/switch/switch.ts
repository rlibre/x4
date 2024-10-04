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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps, makeUniqueComponentId } from '../../core/component';

//import { Checkbox } from '@controls/controls.js';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { HBox } from '../boxes/boxes.js';

import "./switch.module.scss";

interface SwitchProps extends ComponentProps {
	label: string;
	checked?: boolean;
	value?: string;
}

export class Switch extends HBox<SwitchProps> {
	constructor(props: SwitchProps ) {
		super( props );

		const inputId = makeUniqueComponentId( );

		this.setContent( [
			new Component( {
				cls: "switch",
				content: [
					new Input( { type: "checkbox", id: inputId, checked: props.checked } ),
					new Component( { cls: "track" } ),
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