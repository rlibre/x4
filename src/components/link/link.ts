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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvClick } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { class_ns, UnsafeHtml } from '../../core/core_tools';
import { Label } from '../label/label';


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
	click?: EventCallback<EvClick>;
}

@class_ns( "x4" )
export class Link extends Component<LinkProps,LinkEvents> {
	constructor( props: LinkProps ) {
		super( { tag: "a", ...props} );

		this.setAttribute( "href", props.href );
		this.mapPropEvents( props, "click" );

		this.setContent( new Label( {
			text: props.text,
			icon: props.icon,
		} ) );

		this.addDOMEvent('click', (e) => this._on_click(e));
	}

	/**
	 * 
	 * @param text 
	 */

	setText( text: string | UnsafeHtml ) {
		this.setContent( text );
	}

	/**
	 * 
	 */

	protected _on_click( ev: MouseEvent ) {

		const xev: EvClick = {context: this.props.href };
		this.fire('click', xev );
	
		if( xev.preventDefault ) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	}
}
