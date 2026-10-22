/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file link.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvClick } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { UnsafeHtml } from '../../core/core_tools';
import { Label } from '../label/label';

import "./link.module.scss"

/**
 * Link events
 */

interface LinkEvents extends ComponentEvents {
	click: EvClick;	// context = href
}

/**
 * 
 */

interface LinkProps extends ComponentProps {
	href: string;
	text?: string | UnsafeHtml;	// you can also use content for complexe content
	icon?: string;
	align?: "left" | "center" | "right";
	click?: EventCallback<EvClick>;
}

/**
 * 
 */

export class Link extends Component<LinkProps,LinkEvents> {
	static classPrefix = "x4";

	constructor( props: LinkProps ) {
		super( { tag: "a", ...props} );

		if( props.href ) {
			this.setAttribute( "href", props.href );
		}

		this.mapPropEvents( props, "click" );

		// content given: it is the link; else a label (icon and text)
		if( props.content===undefined ) {
			this.setContent( new Label( {
				text: props.text,
				icon: props.icon,
				align: props.align,
			} ) );
		}

		this.addDOMEvent('click', (e) => this._on_click(e));
	}

	/**
	 * 
	 * @param text 
	 */

	setText( text: string | UnsafeHtml ) {
		// the text of the label: its icon and alignment stay
		const label = this.query<Label>( ":scope > .x4label" );
		if( label ) {
			label.setText( text );
		}
		else {
			this.setContent( text );
		}
	}

	/**
	 * 
	 */

	protected _on_click( ev: MouseEvent ) {

		const xev: EvClick = {context: this.props.href };
		this.fire('click', xev );
	
		// the handler called ev.preventDefault( ): the link is not followed
		if( xev.defaultPrevented ) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}
