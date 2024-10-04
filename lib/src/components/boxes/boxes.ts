/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file boxes.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps } from "../../core/component"

import "./boxes.module.scss";

export interface BoxProps extends ComponentProps {
}

/**
 * 
 */

export class Box<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Component<P,E> {
}


/**
 * 
 */

export class HBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
}

/**
 * 
 */

export class VBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
	constructor( p: P ) {
		super( p );
	}
}


/**
 * stack of widgets where only one widget is visible at a time
 */

interface StackItem {
	name: string;
	content: Component;
}

interface StackedLayoutProps extends Omit<ComponentProps,"content"> {
	default: string;
	items: StackItem[];
}

interface _StackItem extends StackItem {
	page: Component;
}

export class StackBox extends Box<StackedLayoutProps> {

	private _items: _StackItem[];

	constructor( props: StackedLayoutProps ) {
		super( props );

		this._items = props.items?.map( itm => {
			return { ...itm, page: null };
		});

		if( props.default ) {
			this.select( props.default );
		}
		else if( this._items.length ) {
			this.select( this._items[0].name );
		}
	}

	select( name: string ) {
		let sel = this.query( `.selected` );
		if( sel ) {
			sel.setClass( "selected", false );
		}

		const pg = this._items.find( x => x.name==name );
		if( pg ) {
			if( !pg.page ) {
				pg.page = this._createPage( pg );
				this.appendContent( pg.page );
			}

			sel = pg.page;
			if( sel ) {
				sel.setClass( "selected", true );
			}
		}
	}

	/**
	 * 
	 */

	private _createPage( page: _StackItem ) {
		
		let content: Component;
		//if( page.content instanceof ComponentBuilder ) {
		//	content = page.content.create( );
		//}
		//else {
			content = page.content;
		//}
		
		content?.setData( "stackname", page.name );
		return content;
	}
}

