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

//import { EventCallback } from '../../core/core_events';
import { Component, makeUniqueComponentId } from '../../core/component';
import { class_ns, UnsafeHtml } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { DateProps, Input, InputProps, NumberProps, TextInputProps, TimeProps } from "../input/input"
import { Label } from '../label/label';

import "./textedit.module.scss";

//@todo: disabled

/**
 * 
 */

type TextEditInputs = TextInputProps | NumberProps | DateProps | TimeProps;

interface TextEditBase {
	label: string | UnsafeHtml;
	labelWidth?: number;
	inputWidth?: number;		
	inputId?: string;
	inputGadgets?: Component[];
	inputAttrs?: any;
}

export type TextEditProps = TextEditInputs & TextEditBase;

/*
not enougth precise
interface TextEditProps extends InputProps {
	label: string | UnsafeHtml;
	labelWidth?: number;
	editWidth?: number;		
	inputId?: string;

	type?: "text" | "email" | "password" | "date" | "number" | "time";
	name?: string;
	readonly?: boolean;
	required?: boolean;
	value: string | number;
	placeholder?: string;
	autofocus?: boolean;

	inputGadgets?: Component[];
	inputAttrs?: any;

	focus?: EventCallback<EvFocus>;
	change?: EventCallback<EvChange>;
}
*/

/**
 * 
 */

@class_ns( "x4" )
export class TextEdit extends HBox {

	private input: Input;

	constructor( props: TextEditProps ) {
		super( props );

		if( !props.inputId ) {
			props.inputId = makeUniqueComponentId()
		}

		if( props.required ) {
			this.setAttribute( "required", true );
		}

		const gadgets = props.inputGadgets ?? [];
		gadgets.forEach( g => {
			g.addClass( "gadget" );
		})


		const iprops: InputProps = { ...props, id: props.inputId, attrs: props.inputAttrs, width: props.inputWidth };

		this.setContent( [
			props.label ? new HBox( { id: "label", width: props.labelWidth, content: [
				new Label( { tag: "label", text: props.label, labelFor: props.inputId } ),
			]}) : null,
			new HBox( { id: "edit", content: [
				this.input = new Input( iprops ),
				...gadgets,
			]})
		])
	}

	getValue( ) {
		return this.input.getValue( );
	}

	setValue( value: string ) {
		this.input.setValue( value );
	}

	getInput( ) {
		return this.input;
	}
}
