/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file button.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvClick } from "@core/component"
import { EventCallback } from '@core/core_events.js';
import { UnsafeHtml } from '@core/core_tools.js';

import { Icon } from "../icon/icon"

import "./button.module.scss";


/**
 * Button events
 */

interface ButtonEvents extends ComponentEvents {
	click: EvClick;
}

/**
 * Button properties.
 */

export interface ButtonProps extends ComponentProps {
	label?: string;
	icon?: string;
	click?: EventCallback<EvClick>;
}

/**
 * Button component.
 */

export class Button extends Component<ButtonProps,ButtonEvents> {

	/**
     * Creates an instance of Button.
     * 
     * @param props - The properties for the button component, including label and icon.
     * @example
     * const button = new Button({ label: 'Submit', icon: 'check-icon' });
     */

	constructor( props: ButtonProps ) {
		super( { ...props, tag: 'button', content: null } );

		this.mapPropEvents( props, 'click' );
		this.addDOMEvent('click', (e) => this._on_click(e));

		this.setContent( [
			new Icon( { id: "icon", iconId: this.props.icon } ),
			new Component( { id: "label", content: this.props.label } ),
		] );
	}

	/**
	 * called by the system on click event
	 */

	protected _on_click( ev: MouseEvent ) {

		//if (this.m_props.menu) {
		//	let menu = new Menu({
		//		items: isFunction(this.m_props.menu) ? this.m_props.menu() : this.m_props.menu
		//	});
		//
		//	let rc = this.getBoundingRect();
		//	menu.displayAt(rc.left, rc.bottom, 'tl');
		//}
		//else {
			this.fire('click', {} );
		//}

		ev.preventDefault();
		ev.stopPropagation();
	}

	/**
     * Sets the text content of the button's label.
     * 
     * @param text - The new text or HTML content for the label.
     * @example
     * button.setText('Click Me');
     * button.setText(new UnsafeHtml('<b>Bold Text</b>'));
     */

	public setText( text: string | UnsafeHtml ) {
		this.query( "#label" ).setContent( text );
	}

	/**
     * Sets the icon of the button.
     * 
     * @param icon - The new icon ID to set on the button.
     * @example
     * button.setIcon('new-icon-id');
     */

	public setIcon( icon: string ) {
		this.query<Icon>( "#icon" ).setIcon( icon );
	}
}

