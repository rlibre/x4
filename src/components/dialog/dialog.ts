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
import { CoreEvent, EventCallback } from '@core/core_events.js';
import { class_ns } from '@core/core_tools.js';
import { ComponentEvent } from '../../core/component.js';
import { Button } from '../button/button.js';

import "./dialog.module.scss"
import close_icon from "./xmark-sharp-light.svg";

let modal_stack: Popup[] = [];

export interface DialogProps extends PopupProps {
	icon?: string;
	title: string;
	form?: Form;
	buttons: BtnGroupItem[];
	closable?: boolean;
	modal?: boolean;
	btnclick?: EventCallback<EvBtnClick>;
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

@class_ns( "x4" )
export class Dialog<P extends DialogProps = DialogProps, E extends DialogEvents = DialogEvents>  extends Popup<P,E> {

	private form: Form;

	constructor( props: P ) {
		super( { ...props, tag: "dialog" } );
		this._ismodal = props.modal;

		this.mapPropEvents( props, "btnclick" );

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
			this.form = props.form ? props.form : new Form( { } ),
			new BtnGroup( {
				id: "btnbar",
				reverse: true,
				items: props.buttons,
				btnclick: ( ev ) => { this.fire( "btnclick", ev ) }
			}) 
		]);

		this.addDOMEvent( "keydown",  (ev) => {
			console.log( ev.key );
			if( ev.key=='Escape' ) {
				// todo cancel
				ev.preventDefault( );
				ev.stopPropagation( );
			}
			else if( ev.key=='Enter' ) {
				// todo default button
				ev.preventDefault( );
				ev.stopPropagation( );	

				const def = this.query<Button>( 'button.default');
				if( def ) {
					def.click( );
				}
			}
			else if (ev.key === 'Tab') {
				
			}
		})

	}

	/**
	 * 
	 */

	override setContent( form: Form ) {
		this.dom.replaceChild( this.form.dom, form.dom );
		this.form = form;
	}

	/**
	 * 
	 */
	
	getForm( ) {
		return this.form;
	}

	/**
	 * 
	 */

	getValues( ) {
		return this.form.getValues( );
	}
}


