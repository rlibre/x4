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

import { class_ns, isArray, isNumber, isString } from '@core/core_tools.js';
import { Component, ComponentContent, ComponentEvents, ComponentProps, EvSelectionChange } from "../../core/component"

import "./boxes.module.scss";
import { EventCallback } from '@core/core_events.js';

export interface BoxProps extends ComponentProps {
	tag?: string;
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

/**
 * 
 */

interface StackeBoxEvents extends ComponentEvents {
	pageChange?: EvSelectionChange;
}

export interface StackBoxProps extends Omit<ComponentProps,"content"> {
	default: string;
	items: StackItem[];
	pageChange?: EventCallback<EvSelectionChange>;
}

/**
 * 
 */

interface StackItemEx extends StackItem {
	page: Component;
}

/**
 * 
 */

@class_ns( "x4" )
export class StackBox<P extends StackBoxProps = StackBoxProps, E extends StackeBoxEvents = StackeBoxEvents>  extends Box<StackBoxProps,StackeBoxEvents> {
	
	protected _items: StackItemEx[];
	protected _cur: number;

	constructor( props: StackBoxProps ) {
		super( props );

		this.mapPropEvents( props, "pageChange" );

		this._items = props.items?.map( itm => {
			return { ...itm, page: null as any};
		});

		if( props.default ) {
			this.select( props.default );
		}
		else if( this._items.length ) {
			this.select( this._items[0].name );
		}
	}

	addItem( item: StackItem ) {
		this._items.push( {
			name: item.name,
			content: item.content,
			page: null
		});
	}

	select( name: string ) {
		let sel = this.query( `:scope > .selected` );
		if( sel ) {
			sel.setClass( "selected", false );
		}

		this._cur = this._items.findIndex( x => x.name==name );
		const pg = this._items[this._cur];

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

			this.fire( "pageChange", { selection: pg.name, empty: !sel } );
		}

		return pg?.page;
	}

	/**
	 * 
	 */

	private _createPage( page: StackItemEx ) {
		
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

	/**
	 * 
	 */
	
	getPage( name: string ) {
		const pg = this._items.find( x => x.name==name );
		return pg ? pg.content : null;
	}

	/**
	 * 
	 */

	getCurPage( ) {
		const c = this._items[this._cur];
		return c?.name;
	}
}

// :: ASSIST BOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


@class_ns( "x4" )
export class AssistBox extends StackBox {
	selectNextPage( nxt = true ) {
		let p;
		if( nxt && this._cur<this._items.length-1 ) {
			p = this._items[this._cur+1];
		}
		else if( !nxt && this._cur>0 ) {
			p = this._items[this._cur-1];
		}

		if( p ) {
			this.select( p.name );
		}
	}
}



// :: GRIDBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


export interface GridboxProps extends BoxProps {
	rows?: number | string | string[];
	columns?: number | string | string[];
}

@class_ns("x4")
export class GridBox<P extends GridboxProps=GridboxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {

	constructor( props: P ) {
		super( props );

		if( props.rows!==undefined ) {
			this.setRows( props.rows );
		}

		if( props.columns!==undefined ) {
			this.setCols( props.columns );
		}
	}

	setRows( r: number | string | string[] ) {
		if( isArray(r) ) {
			r = r.join( " " );
		}
		else if( isNumber(r) ) {
			r = `repeat( ${r}, 1fr )`;
		}

		this.setStyleValue( "gridTemplateRows", r );
	}

	setCols( r: number | string | string[] ) {
		if( isArray(r) ) {
			r = r.join( " " );
		}
		else if( isNumber(r) ) {
			r = `repeat( ${r}, 1fr )`;
		}

		this.setStyleValue( "gridTemplateColumns", r );
	}

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


// :: MASONRY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// from a nice article of Andy Barefoot
//	https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb

interface MasonryProps extends Omit<BoxProps,"content"> {
	items: Component[];
}

@class_ns("x4")
export class MasonryBox extends Box<MasonryProps> {

	constructor(props: MasonryProps ) {
		super(props);

		this.addDOMEvent( 'resized', () => {
			this.resizeAllItems( );
		});

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	resizeItem(item: Component) {
		const style = this.getComputedStyle();

		const rowHeight = parseInt(style['gridAutoRows']);
		const rowGap = parseInt(style['rowGap']);

		let content = item.query('.content');
		if( !content ) {
			content = item;
		}

		if (content && (rowHeight + rowGap)) {
			const rc = content.getBoundingRect();
			const rowSpan = Math.ceil( (rc.height + rowGap) / (rowHeight + rowGap) );
			item.setStyleValue('gridRowEnd', "span " + rowSpan);
		}
	}
	  
	resizeAllItems( ) {
		const els = this.queryAll( ".item" );
		els.forEach( itm => {;
			this.resizeItem( itm );
		} );
	}

	setItems( items: Component[] ) {
		const els = items.map( x => {
			return new Box( {
				cls: 'item',
				content: x
			} );
		});
		
		this.setContent( els );
	}
}

