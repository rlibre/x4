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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component } from "../../core/component"
import { DOMEventHandler } from '../../core/core_dom';
import { Timer, UnsafeHtml, isFunction, isString } from '../../core/core_tools';
import { shortcutText } from '../../core/core_shortcuts';

import { Popup, PopupProps } from '../popup/popup';
import { Icon } from '../icon/icon';
import { BoxProps, HBox } from '../boxes/boxes';

import icons from "../assets/icons";
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
	disabled?: boolean;
	checked?: boolean | ( () => boolean);
	click?: DOMEventHandler;

	/**
	 * the keys of the command, shown at the right of the item: "Mod+S" is written
	 * "Ctrl+S", "⌘S" on a Mac (shortcutText). Shown only: the shortcut itself
	 * is added by Application.addShortcut or Component.addShortcut
	 */
	shortcut?: string;
}

export type MenuElement = MenuItem | Component | string;

export interface MenuProps extends Omit<PopupProps,"content"> {
	items: MenuElement[];
}

/**
 * @cssvar
 * ```
 * --menu-background
 * --menu-border
 * --menuitem-color
 * --menuitem-background-active
 * --menuitem-color-active
 * --menuitem-background-hover
 * --menuitem-color-hover
 * --menuitem-shortcut-color
 * ```
 */

class CMenuSep extends Component {
	static classPrefix = "x4";

	constructor( ) {
		super( { } );
	}
}


const openTimer = new Timer( );

/**
 * 
 */

class CMenuItem extends Component {
	static classPrefix = "x4";

	private menu: Menu;
	
	constructor( itm: MenuItem ) {
		super( { disabled: itm.disabled, cls: itm.cls } );

		if( itm.menu ) {
			this.addClass( "popup" );
		}

		let iconId = itm.icon;
		if( !iconId && itm.checked ) {
			const chk = isFunction(itm.checked) ? itm.checked() : itm.checked;
			if( chk ) {
				iconId = icons.check;
			}
		}

		this.setContent( [
			new Icon({ id:"icon", iconId }),
			new Component( { id: "text", content: itm.text } ),
			itm.shortcut ? new Component( { id: "shortcut", content: shortcutText( itm.shortcut ) } ) : null,
			// a sub menu: a triangle at the right, in the colour of the text
			itm.menu ? new Icon( { id: "sub", iconId: icons.caret } ) : null,
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

export class Menu extends Popup {
	static classPrefix = "x4";
	
	constructor( props: MenuProps ) {
		super( { ...props, autoClose: "menu" } );

		this.addClass( "x4vbox" );

		if( props.items ) {
			let children = props.items.filter( x=> !!x);

			// trim separators
			while( children.at(0)=='-' ) {
				children.shift( );
			}

			while( children.at(-1)=='-' ) {
				children.pop( );
			}

			const items = children.map( itm => {
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

			this.setContent( items );
		}
	}
}

/**
 *
 */

export interface MenuBarItem {
	text: string;
	icon?: string;
	disabled?: boolean;

	/** its menu; a function is called at each opening: it gives the items of that time */
	items: MenuElement[] | ( ( ) => MenuElement[] );
}

export interface MenuBarProps extends Omit<BoxProps,"content"> {
	items: MenuBarItem[];
}

/**
 * a title of the bar
 */

class CMenuBarItem extends Component {
	static classPrefix = "x4";

	constructor( itm: MenuBarItem ) {
		super( { disabled: itm.disabled } );

		this.setContent( [
			itm.icon ? new Icon( { id: "icon", iconId: itm.icon } ) : null,
			new Component( { id: "text", content: itm.text } ),
		] );
	}
}

/**
 * A row of titles, each one opens its menu under it.
 * A click on a title opens its menu, a second one closes it. While a menu is open, the
 * mouse on another title opens the menu of that one.
 *
 * For a web application. A desktop application (Electron...) should not use it: the menu
 * of the system is preferable, where the user expects it (the top of the screen on a Mac)
 * and with the keyboard of the system.
 *
 * @example
 * new MenuBar( { items: [
 *     { text: "File", items: [ { text: "Open…", shortcut: "Mod+O", click: open }, "-", { text: "Quit", click: quit } ] },
 *     { text: "Edit", items: ( ) => [ { text: "Undo", disabled: !canUndo( ), click: undo } ] },
 * ] } );
 *
 * @cssvar
 * ```
 * --menubar-background
 * --menubar-border
 * --menubaritem-color
 * --menubaritem-background-hover
 * --menubaritem-color-hover
 * --menubaritem-color-disabled
 * ```
 */

export class MenuBar extends HBox<MenuBarProps> {
	static classPrefix = "x4";

	private _menu: Menu;				// the menu open, null when none
	private _title: CMenuBarItem;		// the title of that menu
	private _closed: CMenuBarItem;		// the title whose menu closed last
	private _closedAt = -1;				// when (performance.now)

	constructor( props: MenuBarProps ) {
		super( props );

		this.setContent( props.items.map( itm => {
			const title = new CMenuBarItem( itm );

			// The menu closes by itself as soon as the button goes down outside of it,
			// before the title hears of it: it was the menu of this title if it closed
			// since this very press began.
			let wasOpen = false;

			title.addDOMEvent( "pointerdown", ev => { wasOpen = this._closed===title && this._closedAt >= ev.timeStamp; } );
			title.addDOMEvent( "click", ( ) => {
				if( !wasOpen ) {
					this._open( title, itm );
				}
			} );

			title.addDOMEvent( "mouseenter", ( ) => {
				if( this._menu && this._title!==title ) {
					this._open( title, itm );
				}
			} );

			return title;
		} ) );
	}

	/**
	 * closes the menu open, opens the one of the title under it
	 */

	private _open( title: CMenuBarItem, itm: MenuBarItem ) {
		if( title.isDisabled( ) ) {
			return;
		}

		if( this._menu ) {
			this._menu.dismiss( );
		}

		const menu = new Menu( { items: isFunction( itm.items ) ? itm.items( ) : itm.items } );

		menu.on( "closed", ( ) => {
			title.removeClass( "opened" );

			this._closed = title;
			this._closedAt = performance.now( );

			if( this._menu===menu ) {
				this._menu = null;
				this._title = null;
			}
		} );

		this._menu = menu;
		this._title = title;
		title.addClass( "opened" );

		menu.displayNear( title.getBoundingRect( ), "top left", "bottom left" );
	}
}

