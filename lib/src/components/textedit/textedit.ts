/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file textedit.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps, makeUniqueComponentId } from '../../core/component';
import { class_ns, UnsafeHtml } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { Input, TextInputProps } from "../input/input"
import { Label } from '../label/label';

import "./textedit.module.scss";

//@todo: disabled

/**
 * 
 */

interface TextEditProps extends ComponentProps {
	label: string | UnsafeHtml;
	labelWidth?: number;
	inputId?: string;

	type?: "text" | "email" | "password";
	readonly?: boolean;
	required?: boolean;
	value: string | number;
	placeholder?: string;

	inputGadgets?: Component[];
}

/**
 * 
 */

@class_ns( "x4" )
export class TextEdit extends HBox {
	constructor( props: TextEditProps ) {
		super( props );

		if( !props.inputId ) {
			props.inputId = makeUniqueComponentId()
		}

		if( props.required ) {
			this.setAttribute( "required", true );
		}

		const gadgets = props.inputGadgets ?? [];

		this.setContent( [
			new HBox( { id: "label", width: props.labelWidth, content: [
				new Label( { tag: "label", text: props.label, labelFor: props.inputId } ),
			]}),
			new HBox( { id: "edit", content: [
				new Input( { 
					type: props.type ?? "text", 
					readonly: props.readonly, 
					value: props.value, 
					id: props.inputId, 
					required: props.required, 
					disabled: props.disabled, 
					placeholder: props.placeholder 
				} ),
				...gadgets,
			]})
		])
	}
}
