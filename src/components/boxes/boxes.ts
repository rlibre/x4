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

import { class_ns } from '@core/core_tools.js';
import { Component, ComponentContent, ComponentEvents, ComponentProps } from "../../core/component"

import "./boxes.module.scss";

export interface BoxProps extends ComponentProps {
}

/**
 * 
 */

@class_ns( "x4" )
export class Box<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Component<P,E> {
}


/**
 * 
 */

@class_ns( "x4" )
export class HBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
}

/**
 * 
 */

@class_ns( "x4" )
export class VBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
	constructor( p: P ) {
		super( p );
	}
}


/**
 * stack of widgets where only one widget is visible at a time
 */

type ContentBuilder = ( ) => Component;

interface StackItem {
	name: string;
	content: Component | ContentBuilder;
}

interface StackedLayoutProps extends Omit<ComponentProps,"content"> {
	default: string;
	items: StackItem[];
}

interface _StackItem extends StackItem {
	page: Component;
}

@class_ns( "x4" )
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
		let sel = this.query( `:scope > .selected` );
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
				(sel as any).activate?.( );
				sel.setClass( "selected", true );
			}
		}

		return pg?.page;
	}

	/**
	 * 
	 */

	private _createPage( page: _StackItem ) {
		
		let content: Component;
		if( page.content instanceof Function ) {
			content = page.content( );
			page.content = content;	// keep it
		}
		else {
			content = page.content;
		}
		
		content?.setData( "stackname", page.name );
		return content;
	}
}

/**
 * 
 */

@class_ns("x4")
export class GridBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {


	setRowCount( n: number ) {
		this.setStyleValue( "gridTemplateRows", `repeat(${n})` );
		
	}

	setColCount( n: number ) {
		this.setStyleValue( "gridTemplateColumns", `repeat(${n})` );
	}

	/**
	 * @param t "a a a" "b c c" "b c c"
	 * user item.setAttribute( "grid-area", "a" );
	 */

	setTemplate( t: string[] ) {
		this.setAttribute( "grid-template-area", t.map( x => '"' + x + '"' ).join(" ") );
	}

	
}