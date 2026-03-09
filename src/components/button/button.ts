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

import { Component, ComponentEvents, ComponentProps, EvClick } from "../../core/component.ts"
import { EventCallback } from '../../core/core_events.ts';
import { class_ns, UnsafeHtml } from '../../core/core_tools.ts';

import { Icon } from "../icon/icon.ts"

import "./button.module.scss";


/**
 * Button events
 */

interface ButtonEvents extends ComponentEvents {
	/** 
	 * Fired when the button is clicked 
	 * ex: myButton.on( "click", ( e: EvClick ) => { console.log( "click") } );
	 */

	click: EvClick;
}

/**
 * Button properties.
 */

export interface ButtonProps extends ComponentProps {
	/** Text or HTML content of the button */
	label?: string | UnsafeHtml;	

	/** Icon identifier to display */
	icon?: string;

	/** 
	 * Tab index for keyboard navigation.
	 * - `false` to exclude from tab order
	 * - `number` to set specific tab index
	 */
	tabindex?: boolean | number;
	
	/** 
	 * Enable auto-repeat behavior when button is held down.
	 * - `true` uses default 200ms repeat interval
	 * - `number` specifies custom repeat interval in milliseconds
	 * 
	 * First click triggers after 500ms, then repeats at specified interval.
	 */
	autorepeat?: number | boolean;

	/**
	 * Callback function invoked when button is clicked 
	 * cf. ButtonEvents
	 */
	click?: EventCallback<EvClick>;
}

/**
 * Represents a clickable button component.
 * 
 * Generates the CSS class **x4button** based on the class name.
 * The button can contain an optional icon and label, supports keyboard activation,
 * and may trigger auto-repeated click events while pointer is held down.
 * 
 */


@class_ns( "x4" )
export class Button extends Component<ButtonProps,ButtonEvents> {

	#text: Component;

	/**
	 * Create a new Button.
	 *
	 * @param {ButtonProps} props - Configuration options such as `label`, `icon`, `tabindex`, `autorepeat`, and `click`.
	 *
	 * @example
	 * const btn = new Button({
	 *   label: "Save",
	 *   icon: "check",
	 *   click: () => console.log("clicked"),
	 * });
	 */

	constructor( props: ButtonProps ) {
		super( { ...props, tag: 'button', content: null } );

		this.mapPropEvents( props, 'click' );

		if( props.autorepeat ) {
			this.addDOMEvent('pointerdown', (e) => this._on_mouse(e) );
			this.addDOMEvent('pointerup', (e) => this._on_mouse(e) );
		}
		else {
			this.addDOMEvent('click', (e) => this._on_click(e));
		}

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
	 * @internal 
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
	 * @internal
	 */

	protected _on_mouse( e: PointerEvent ) {

		let count = 0;

		if( e.type=='pointerdown' ) {
			this.dom.setPointerCapture( e.pointerId );

			const rt = this.props.autorepeat===true ? 200 : this.props.autorepeat as number;

			this.setTimeout( 'repeat', 500, ( ) => {
				this.fire( "click", {} );
				this.setInterval( 'repeat', rt, ( ) => {
					count++;
					this.fire( "click", {repeat:count} );
				})
			} );
		}
		else {
			this.clearTimeout( 'repeat' );

			if( !count ) {
				this.fire("click", {} );
			}
		}
	}

	/**
	 * Activate the button as if it was clicked by a user.
	 *
	 * @example
	 * button.click();
	 */

	click( ) {
		(this.dom as HTMLButtonElement).click( );
	}

	/**
	 * @internal
	 */

	protected _on_keydown( e: KeyboardEvent ) {
		if( e.key=='Enter' ) {
			this.click( );
			e.preventDefault( );
		}
	}

	/**
	 * Set or change the button label.
	 *
	 * @param {string | UnsafeHtml} text - Text content or unsafe HTML.
	 *
	 * @example
	 * button.setText("Confirm");
	 * button.setText(new UnsafeHtml("<strong>OK</strong>"));
	 * button.setText( unsafe`<strong>OK</strong>` );
	 */

	public setText( text: string | UnsafeHtml ) {
		this.#text.setContent( text );
		this.#text.setClass( "empty", !text );
	}
	
	/**
	 * Set or change the icon displayed by the button.
	 *
	 * @param {string} icon - Icon identifier to associate with the button.
	 *
	 * @example
	 * button.setIcon("arrow-right");
	 */

	public setIcon( icon: string ) {
		this.query<Icon>( "#icon" ).setIcon( icon );
	}

}

