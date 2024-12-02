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

import { Component, ComponentEvents, ComponentProps, EvClick } from "../../core/component"
import { EventCallback } from '../../core/core_events.js';
import { class_ns, UnsafeHtml } from '../../core/core_tools.js';

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
	tabindex?: boolean | number;
	click?: EventCallback<EvClick>;
}

/**
 * Button component.
 */

@class_ns( "x4" )
export class Button extends Component<ButtonProps,ButtonEvents> {

	#text: Component;

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
		this.addDOMEvent('keydown', (e) => this._on_keydown(e) );

		this.setContent( [
			new Icon( { id: "icon", iconId: this.props.icon } ),
			this.#text = new Component( { id: "label" } ),
		] );

		this.setText( props.label );

		if( props.tabindex!==false ) {
			this.setAttribute( 'tabindex', props.tabindex );
		}
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
	 * simulate a click
	 */

	click( ) {
		(this.dom as HTMLButtonElement).click( );
	}

	/**
	 * called on key down
	 */

	protected _on_keydown( e: KeyboardEvent ) {
		if( e.key=='Enter' ) {
			this.click( );
			e.preventDefault( );
		}
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
		this.#text.setContent( text );
		this.#text.setClass( "empty", !text );
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

