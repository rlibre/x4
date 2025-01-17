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
import { class_ns, getFocusableElements, IComponentInterface, isString, ITabHandler } from '@core/core_tools.js';
import { ComponentEvent } from '../../core/component.js';
import { Button } from '../button/button.js';

import "./dialog.module.scss"
import close_icon from "./xmark-sharp-light.svg";


//let modal_stack: Popup[] = [];

export interface DialogProps extends PopupProps {
	icon?: string;
	title: string;
	form?: Form;
	buttons: BtnGroupItem[];
	closable?: boolean | string;
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

@class_ns("x4")
export class Dialog<P extends DialogProps = DialogProps, E extends DialogEvents = DialogEvents> extends Popup<P, E> {

	private form: Form;

	constructor(props: P) {
		super({ tag: "dialog", modal: true, ...props });

		this._ismodal = this.props.modal;

		this.mapPropEvents(props, "btnclick");

		this.appendContent([
			new HBox({
				cls: "caption",
				content: [
					new Label({
						id: "title",
						cls: "caption-element",
						icon: props.icon,
						text: props.title
					}),
					props.closable ? new Button({
						id: "closebox",
						icon: close_icon,
						tabindex: -1,
						click: () => { 
							if( isString(props.closable) ) {
								this.fire("btnclick", { button: props.closable } );
							}
							else {
								this.close() 
							}
						}
					}) : null,
				]
			}),
			this.form = props.form ? props.form : new Form({}),
			new BtnGroup({
				id: "btnbar",
				reverse: true,
				items: props.buttons,
				btnclick: (ev) => { this.fire("btnclick", ev) }
			})
		]);

		this.addDOMEvent("keydown", (ev) => {

			if (ev.key == 'Escape') {
				// todo cancel
				ev.preventDefault();
				ev.stopPropagation();
			}
			else if (ev.key == 'Enter') {
				const def = this.query<Button>('button.default');
				if (def) {
					ev.preventDefault();
					ev.stopPropagation();

					def.click();
				}
			}
		})
	}

	private focusNext( next: boolean) : boolean {

		const focusable = getFocusableElements( this.dom );
		
		if (!focusable.length) {
			return false;
		}
		else {
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			let newf: HTMLElement;
			if (!next && active === first) {
				newf = last as HTMLElement;
			}
			else if (next && active === last) {
				newf = first as HTMLElement;
			}
			else {
				const idx = focusable.indexOf(active);
				if (!next) {
					newf = focusable[idx - 1] as HTMLElement;
				}
				else {
					newf = focusable[idx + 1] as HTMLElement
				}
			}

			if (newf) {
				newf.focus();
				return true;
			}

			return false;
		}
	}

	/**
	 * 
	 */

	override setContent(form: Form) {
		this.dom.replaceChild(this.form.dom, form.dom);
		this.form = form;
	}

	/**
	 * 
	 */

	getForm() {
		return this.form;
	}

	/**
	 * 
	 */

	getValues() {
		return this.form.getValues();
	}

	/**
	 * 
	 */

	getButton(name: string) {
		const btns = this.query<BtnGroup>("#btnbar");
		return btns.getButton(name);
	}

	/**
	 * 
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="tab-handler" ) {
			const i: ITabHandler = {
				focusNext: ( n: boolean ) => { return this.focusNext( n ); }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}


