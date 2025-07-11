/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file menu.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component } from "../../core/component"
import { DOMEventHandler } from '../../core/core_dom';
import { Timer, UnsafeHtml, class_ns, isString } from '../../core/core_tools';

import { Popup, PopupProps } from '../popup/popup';
import { Icon } from '../icon/icon';

import "./menu.module.scss"

const OPEN_DELAY = 400;

/**
 * 
 */

export interface MenuItem {
	cls?: string;
	icon?: string;
	text: string | UnsafeHtml;
	menu?: Menu;
	disabled?: true;
	click?: DOMEventHandler;
}

export type MenuElement = MenuItem | Component | string;

export interface MenuProps extends Omit<PopupProps,"content"> {
	items: MenuElement[];
}

/**
 * 
 */

@class_ns( "x4" )
class CMenuSep extends Component {
	constructor( ) {
		super( { } );
	}
}


const openTimer = new Timer( );

/**
 * 
 */

@class_ns( "x4" )
class CMenuItem extends Component {

	private menu: Menu;
	
	constructor( itm: MenuItem ) {
		super( { disabled: itm.disabled, cls: itm.cls } );

		if( itm.menu ) {
			this.addClass( "popup" );
		}

		this.setContent( [
			new Icon({ id:"icon",iconId:itm.icon}), 
			new Component( { id: "text", content: itm.text } )
		]);

		if( itm.menu ) {
			this.menu = itm.menu;
			
			this.addDOMEvent( "mouseenter", ( ) => this.openSub( true ) );
			this.addDOMEvent( "click", ( ) => this.openSub( false ) );
			this.addDOMEvent( "mouseleave", ( ) => this.closeSub() );
			
			this.menu.on( "opened", ( ) => this.addClass( "opened" ) );
			this.menu.on( "closed", ( ) => this.removeClass( "opened" ) );
		}
		else {
			this.addDOMEvent( "mouseenter", ( ) => { 
				openTimer.setTimeout( "open", OPEN_DELAY, ( ) => {this.dismiss(true)}); 
			} );

			this.addDOMEvent( "click", ( ) => {
				this.dismiss( false );
				if( itm.click ) {
					itm.click( new Event("click") );
				}
			} );
		}
	}

	/**
	 * 
	 */

	dismiss( after: boolean ) {
		const menu = this.parentElement( Menu );
		if( menu ) {
			menu.dismiss( after );
		}
	}


	/**
	 * 
	 */

	openSub( delayed: boolean ) {
		const open = ( ) => {
			this.dismiss( true );
		
			const rc = this.getBoundingRect( );
			this.menu.displayAt( rc.right-4, rc.top );
		}

		if( delayed ) {
			openTimer.setTimeout( "open", OPEN_DELAY, open );
		}
		else {
			openTimer.clearTimeout( "open" );
			open( );
		}
	}

	closeSub( ) {
		openTimer.clearTimeout( "open" );
	}
}

/**
 * 
 */

@class_ns( "x4" )
export class Menu extends Popup {
	
	constructor( props: MenuProps ) {
		super( { ...props, autoClose: "menu" } );

		this.addClass( "x4vbox" );

		const children = props.items?.map( itm => {
			if( itm==="-" ) {
				return new CMenuSep( );
			}
			else if( isString(itm) ) {
				return new CMenuItem( { text: itm, click: null, cls: 'title' } );
			}
			else if( itm instanceof Component ) {
				return itm;
			}
			else {
				return new CMenuItem( itm );
			}
		});

		this.setContent( children );
	}
}

