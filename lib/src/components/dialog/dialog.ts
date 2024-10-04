/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file dialog.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Form } from "../form/form.js"
import { PopupEvents, PopupProps, Popup } from '../popup/popup.js';
import { BtnGroup, BtnGroupItem } from "../btngroup/btngroup"
import { HBox } from '../boxes/boxes.js';
import { Label } from '../label/label.js';
import { ComponentContent, ComponentEvent } from '../../core/component.js';
import { Button } from '../button/button.js';

import "./dialog.module.scss"
import close_icon from "./xmark-sharp-light.svg";
import { CoreEvent } from '@core/core_events.js';

export interface DialogProps extends PopupProps {
	icon?: string;
	title: string;
	form: Form;
	buttons: BtnGroupItem[];
	closable?: boolean;
}


export interface EvBtnClick extends CoreEvent {
	button: string;
}

interface DialogEvents extends PopupEvents {
	btnclick: EvBtnClick;
	close: ComponentEvent;
}

/**
 * 
 */

export class Dialog<P extends DialogProps = DialogProps, E extends DialogEvents = DialogEvents>  extends Popup<P,E> {

	constructor( props: P ) {
		super( props );

		this.appendContent( [
			new HBox( {
				cls: "caption",
				content: [
					new Label( { 
						id: "title", 
						cls: "caption-element",
						icon: props.icon, 
						text: props.title 
					} ),
					props.closable ? new Button( { 
						id: "closebox", 
						icon: close_icon, 
						click:  ( ) => { this.close() }
					} ) : null,
				]
			}),
			props.form,
			new BtnGroup( {
				id: "btnbar",
				reverse: true,
				items: props.buttons,
				btnclick: ( ev ) => { this.fire( "btnclick", ev ) }
			}) 
		])
	}

	display(  ) {
		super.displayCenter(  );
	}

	override close( ) {
		this.fire( "close", {} );
		super.close( );
	}
}

