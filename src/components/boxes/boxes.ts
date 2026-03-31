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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { asap, class_ns, isArray, isNumber } from '../../core/core_tools';
import { Component, ComponentEvents, ComponentProps, EvSelectionChange } from "../../core/component"
import { EventCallback } from '../../core/core_events';

import "./boxes.module.scss";

export interface BoxProps extends ComponentProps {
	/** Optional HTML tag to use for the box. */
	tag?: string;
}

/**
 * A generic container component for grouping and laying out child components.
 * The CSS class for this component is automatically generated as `x4box`.
 */

@class_ns( "x4" )
export class Box<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Component<P,E> {
}


/**
 * A horizontal box layout component.
 * Arranges child components in a horizontal line.
 * The CSS class for this component is automatically generated as `x4hbox`.
 */

@class_ns( "x4" )
export class HBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
}

/**
 * A vertical box layout component.
 * Arranges child components in a vertical stack.
 * The CSS class for this component is automatically generated as `x4vbox`.
 */

@class_ns( "x4" )
export class VBox<P extends BoxProps=BoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {
	constructor( p: P ) {
		super( p );
	}
}


type ContentBuilder = ( ) => Component;


/**
 * Represents an item in a {@link StackBox}.
 */

interface StackItem {
	/** Unique name for the stack item. */
	name: string;
	/** Content of the stack item, either a component or a builder function. */
	content: Component | ContentBuilder;
	title?: string;
}

/**
 * Events specific to the {@link StackBox} component.
 */

interface StackeBoxEvents extends ComponentEvents {
	/** Fired when the current page changes. */
	pageChange?: EvSelectionChange;
}

/**
 * Properties for the {@link StackBox} component.
 */

export interface StackBoxProps extends Omit<ComponentProps,"content"> {
	/** Name of the default page to display. */
	default: string;

	/** List of stack items. */
	items: StackItem[];

	/** Callback for page change events. */
	pageChange?: EventCallback<EvSelectionChange>;
}


interface StackItemEx extends StackItem {
	page: Component;
}

/**
 * A stack of widgets where only one widget is visible at a time.
 * The CSS class for this component is automatically generated as `x4stackbox`.
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

	/**
     * Adds a new item to the stack.
     * @param item - The item to add.
     */

	addItem( item: StackItem ) {
		this._items.push( {
			name: item.name,
			content: item.content,
			page: null
		});
	}

	/**
     * Removes an item from the stack by its name.
     * @param name - The name of the item to remove.
     */

	removeItem( name: string ) {
		const index = this._items.findIndex( x => x.name==name );
		if( index>=0 ) {
			const pg = this._items[index];
			if( pg?.page ) {
				this.removeChild( pg.page );
			}

			this._items.splice( index, 1 );
		}
	}

	/**
     * Selects a page by its name.
     * @param name - The name of the page to select.
     * @returns The selected page component, if any.
     */
	
	select( name: string ) {
		let sel = this.query( `:scope > .selected` );
		if( sel ) {
			sel.setClass( "selected", false );
			(sel as any).deactivate?.( );
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

			asap( ( ) => this.fire( "pageChange", { selection: [pg.name], empty: !sel } ) );
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
     * Retrieves a page by its name.
     * @param name - The name of the page to retrieve.
     * @returns The page content, if found.
     */
	
	getPage( name: string ) {
		const pg = this._items.find( x => x.name==name );
		return pg ? pg.content : null;
	}

	/**
     * Gets the total number of pages in the stack.
     * @returns The number of pages.
     */

	getPageCount( ) {
		return this._items.length;
	}

	/**
     * Enumerates the names of all pages in the stack.
     * @returns An array of page names.
     */

	enumPageNames( ) {
		return this._items.map( x => x.name );
	}

	/**
     * Retrieves a stack item by its name.
     * @param name - The name of the item to retrieve.
     * @returns The stack item, if found.
     */

	getItem( name: string ) {
		const pg = this._items.find( x => x.name==name );
		return pg;
	}

	/**
     * Gets the name of the currently selected page.
     * @returns The name of the current page, if any.
     */

	getCurPage( ) {
		const c = this._items[this._cur];
		return c?.name;
	}
}

// :: ASSIST BOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


/**
 * A specialized stack box for assisted navigation, such as wizards or carousels.
 * The CSS class for this component is automatically generated as `x4assistbox`.
 */

@class_ns( "x4" )
export class AssistBox extends StackBox {

	/**
     * Selects the next or previous page in the stack.
     * @param nxt - If `true`, selects the next page; otherwise, selects the previous page.
     */

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

	/**
     * Checks if the current page is the first page.
     * @returns `true` if the current page is the first page.
     */

	isFirstPage( ) {
		return this._cur==0;
	}

	/**
     * Checks if the current page is the last page.
     * @returns `true` if the current page is the last page.
     */

	isLastPage( ) {
		return this._cur==this._items.length-1;
	}
}



// :: GRIDBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface GridBoxItem {
	row: number;	// starts at 0
	col: number;	// starts at 0
	item: Component;
}

export interface GridBoxProps extends Omit<BoxProps,"content"> {
	rows?: number | string | string[];
	columns?: number | string | string[];
	items?: GridBoxItem[];
}

/**
 * Grid-based layout container.
 * Auto-generates CSS class: `x4gridbox`.
 */

@class_ns("x4")
export class GridBox<P extends GridBoxProps=GridBoxProps,E extends ComponentEvents=ComponentEvents> extends Box<P,E> {

	constructor( props: P ) {
		super( props );

		if( props.rows!==undefined ) {
			this.setRows( props.rows );
		}

		if( props.columns!==undefined ) {
			this.setCols( props.columns );
		}

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	/**
     * Sets grid rows (e.g., `2`, `"1fr 2fr"`, `["1fr", "2fr"]`).
     * @param r - Rows definition.
     */

	setRows( r: number | string | string[] ) {
		if( isArray(r) ) {
			r = r.join( " " );
		}
		else if( isNumber(r) ) {
			r = `repeat( ${r}, 1fr )`;
		}

		this.setStyleValue( "gridTemplateRows", r );
	}

	/**
     * Sets grid columns (e.g., `3`, `"1fr 1fr"`, `["auto", "1fr"]`).
     * @param r - Columns definition.
     */

	setCols( r: number | string | string[] ) {
		if( isArray(r) ) {
			r = r.join( " " );
		}
		else if( isNumber(r) ) {
			r = `repeat( ${r}, 1fr )`;
		}

		this.setStyleValue( "gridTemplateColumns", r );
	}

	/**
     * Sets the number of rows.
     * @param n - Row count.
     */

	setRowCount( n: number ) {
		this.setStyleValue( "gridTemplateRows", `repeat(${n})` );
	}

	/**
     * Sets the number of columns.
     * @param n - Column count.
     */

	setColCount( n: number ) {
		this.setStyleValue( "gridTemplateColumns", `repeat(${n})` );
	}

	/**
     * Sets grid template areas (e.g., `["a a", "b c"]`).
     * @param t - Template strings.
     */

	setTemplate( t: string[] ) {
		this.setAttribute( "grid-template-area", t.map( x => '"' + x + '"' ).join(" ") );
	}

	/**
     * Places items at specific grid positions.
     * @param items - Array of `{row, col, item}`.
     */

	setItems( items: GridBoxItem[] ) {
		items.forEach( x => {
			x.item.setStyle( {
				gridColumn: (x.col+1)+"",
				gridRow: (x.row+1)+"",
			} );
		});

		this.setContent( items.map( x => x.item ) );
	}
}


// :: MASONRY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// from a nice article of Andy Barefoot
//	https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb

interface MasonryProps extends Omit<BoxProps,"content"> {
	items: Component[];
}

/**
 * Masonry-style layout (Pinterest-like).
 * Auto-generates CSS class: `x4masonrybox`.
 */

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

	/**
     * Resizes a single masonry item.
     * @param item - Item to resize.
     */

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
	  
	/**
     * Resizes all items to fit the grid.
     */

	resizeAllItems( ) {
		const els = this.queryAll( ".item" );
		els.forEach( itm => {
			this.resizeItem( itm );
		} );
	}

	/**
     * Sets masonry items.
     * @param items - Array of components.
     */

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

