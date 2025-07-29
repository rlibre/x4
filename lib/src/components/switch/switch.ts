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

//import { Checkbox } from '@controls/controls';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { HBox } from '../boxes/boxes';

import "./switch.module.scss";
import { class_ns } from '../../core/core_tools';

interface SwitchProps extends ComponentProps {
	label: string;
	checked?: boolean;
	value?: string;
}

/**
 * 
 */

@class_ns( "x4" )
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