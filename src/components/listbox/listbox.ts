/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file listbox.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, componentFromDOM, ComponentProps, EvChange, EvClick, EvContextMenu, EvDblClick, EvSelectionChange } from '../../core/component';
import { EventCallback } from '../../core/core_events.js';
import { kbNav, class_ns, isArray, UnsafeHtml } from '@core/core_tools.js';

import { ScrollView, Viewport } from '../viewport/viewport';
import { HBox } from '../boxes/boxes.js';
import { Label } from '../label/label.js';

import "./listbox.module.scss"

export type ListboxID = number | string;

export interface ListItem {
	id: ListboxID;
	text: string | UnsafeHtml;

	iconId?: string;
	data?: any;
	cls?: string;
	checked?: boolean;
}

/**
 * 
 */

interface ListboxEvents extends ComponentEvents {
	//change: EvChange;
	click?: EvClick;
	dblClick?: EvDblClick;
	contextMenu?: EvContextMenu;
	selectionChange?: EvSelectionChange;
}

/**
 * 
 */

interface ListboxProps extends Omit<ComponentProps,'content'> {
	items?: ListItem[];
	renderer?: ( item: ListItem ) => Component;
	//header?: Header;
	footer?: Component,
	checkable?: true,
	multisel?: true,

	dblClick?: EventCallback<EvDblClick>;
	selectionChange?: EventCallback<EvSelectionChange>;
	contextMenu?: EventCallback<EvContextMenu>;
}

/**
 * 
 */

@class_ns( "x4" )
export class Listbox extends Component<ListboxProps,ListboxEvents> {

	private _view: Viewport;
	//private _selection: ListboxID;
	//private _selitem: Component;
	
	private _lastsel: ListboxID;
	
	private _multisel: Set<ListboxID>;
	private _items: ListItem[];

	preventFocus = false;

	constructor( props: ListboxProps ) {
		super( { ...props } );

		this.setAttribute( "tabindex", 0 );
		this.mapPropEvents( props, "dblClick", "selectionChange", "contextMenu" );
		
		const scroller = new ScrollView( { cls: "body" } );
		this._view = scroller.getViewport( );
		this._multisel = new Set( );

		if( props.footer ) {
			props.footer.setAttribute( "id", "footer" );
		}

		this.setContent( [
			//props.header ? props.header : null,
			scroller,
			props.footer,
		] );
		
		this.setDOMEvents( {
			click: 	 (ev) => this._on_click( ev ),
			keydown: ( ev ) => this._on_key( ev ),
			dblclick: (e) => this._on_click(e),
			contextmenu: (e) => this._on_ctx_menu(e),
		} );

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	/**
	 * 
	 */

	private _on_key( ev: KeyboardEvent ) {
		if( this.isDisabled() ) {
			return;
		}

		switch( ev.key ) {
			case "ArrowDown": {
				this.navigate( kbNav.next );
				break;
			}

			case "ArrowUp": {
				this.navigate( kbNav.prev );
				break;
			}

			case "Home": {
				this.navigate( kbNav.first );
				break;
			}

			case "End": {
				this.navigate( kbNav.last );
				break;
			}

			default:
				return;
		}

		ev.preventDefault( );
		ev.stopPropagation( );
	}

	/**
	 * 
	 */

	navigate( sens: kbNav ) {
		
		if( !this._lastsel ) {
			if( sens==kbNav.next )  sens = kbNav.first;
			else sens = kbNav.last;
		}

		const next_visible = ( el: Component, down: boolean ) => {
			
			while( el && !el.isVisible() ) {
				el = down ? el.nextElement() : el.prevElement();
			}

			return el;
		}

		if( sens==kbNav.first || sens==kbNav.last ) {
			let fel = sens==kbNav.first ? this._view.firstChild() : this._view.lastChild( );
			fel = next_visible( fel, sens==kbNav.first );

			if( fel ) {
				const id = fel.getData( "id" );
				this._selectItem( id, fel, 'single' );
				return true;
			}
		}
		else {
			const selitem = this._itemFromID( this._lastsel );
			let nel = sens==kbNav.next ? selitem.nextElement() : selitem.prevElement();
			nel = next_visible( nel, sens==kbNav.next );

			if( nel ) {
				const id = nel.getData( "id" );
				this._selectItem( id, nel, 'single' );
				return true;
			}
		}

		return false;
	}

	/**
	 * 
	 */

	private _itemFromID( id: ListboxID ) {
		const itm = this.query( `[data-id="${id}"]` );
		return itm;
	}

	/**
	 * 
	 */
	
	private _on_click( ev: MouseEvent ) {
		ev.stopImmediatePropagation();
		ev.preventDefault( );

		let target = ev.target as HTMLElement;
		while( target && target!=this.dom ) {
			const c = componentFromDOM( target );
			if( c && c.hasClass("x4item") ) {
				const id = c.getData( "id" );
				const fev: ComponentEvent = { context:id };
				if (ev.type == 'click') {
					this.fire('click', fev );
				}
				else {
					this.fire('dblClick', fev );
				}

				if (!fev.defaultPrevented) {
					this._selectItem( id, c, ev.ctrlKey ? 'toggle' : 'single' );
				}
				
				return;
			}

			target = target.parentElement;
		}

		this.clearSelection( );
	}

	/**
	 * 
	 */

	private _on_ctx_menu(ev: MouseEvent) {

		ev.preventDefault();		

		let target = ev.target as HTMLElement;
		while( target && target!=this.dom ) {
			const c = componentFromDOM( target );
			if( c && c.hasClass("x4item") ) {
				const id = c.getData( "id" );
				
				this._selectItem(id, c, 'single' );
				this.fire('contextMenu', {uievent: ev, context: id } );
			
				return;
			}

			target = target.parentElement;
		}

		this.fire('contextMenu', { uievent:ev, context: null } );
	}

	/**
	 * 
	 */

	private _selectItem( id: ListboxID, item: Component, mode: "single" | "toggle" ) {
		
		if( !this.props.multisel ) {
			mode = 'single';
		}

		this._lastsel = id;

		if( mode=='single' ) {
			this._clearSelection( );

			if( item ) {
				this._multisel.add( id );
				item.addClass( "selected" );
			}
		}
		else {	// toggle
			if( item ) {
				if( this._multisel.has(id) ) {
					item.removeClass( "selected" );
					this._multisel.delete( id );
				}
				else {
					this._multisel.add( id );
					item.addClass( "selected" );
				}
			}
		}
		
		if( item ) {
			item.scrollIntoView( {
				behavior: "smooth",
				block: "nearest"
			} );
		}

		this.fire( "selectionChange", { selection: this.getSelection(), empty: this._multisel.size==0 } );
	}

	/**
	 * 
	 */

	getItem( id: ListboxID ): ListItem {
		return this._items.find( x => x.id==id );
	}

	/**
	 * select an item by it's id
	 */

	select( ids: ListboxID | ListboxID[] ) {

		if( !isArray(ids) ) {
			ids = [ids];
		}

		if( !ids.length ) {
			this.clearSelection( );
			return;
		}
		
		ids.forEach( id => {
			const itm = this.query( `[data-id="${id}"]` );
			if( itm ) {
				this._multisel.add( id );
				itm.addClass( "selected" );
			}
		});

		this.fire( "selectionChange", { selection: this.getSelection(), empty: this._multisel.size==0 } );
	}

	/**
	 * 
	 */
	
	private _findItemIndex( id: ListboxID ) {
		return this._items.findIndex( x => x.id==id );
	}

	/**
	 * 
	 */

	private _clearSelection( ) {
		if( this._multisel.size ) {
			const ids = Array.from( this._multisel );
			ids.forEach( id => {
				const itm = this.query( `[data-id="${id}"]` );
				itm.removeClass( "selected" );	
			} );
		}
		
		this._multisel.clear( );
	}

	clearSelection( ) {
		if( this._multisel.size ) {
			this._clearSelection( );
		}
		
		this.fire( "selectionChange", { selection: [], empty: true } );
	}
	
	/**
	 * 
	 */

	setItems( items: ListItem[], keepSel = false ) {

		const oldSel = this.getSelection( );

		this.clearSelection( );
		this._view.clearContent( );
		this._items = items;

		if( items ) {
			const content = items.map( x => this.renderItem(x) );
			this._view.setContent( content );

			if( keepSel ) {
				this.select( oldSel );
			}
		}
	}

	/**
	 * 
	 */

	renderItem( item: ListItem ) {
		const renderer = this.props.renderer ?? this.defaultRenderer;
		const line = renderer( item );
	
		line.addClass( "x4item" );
		line.setData( "id", item.id+"" );
		
		return line;
	}

	/**
	 * 
	 */

	defaultRenderer( item: ListItem ): Component {
		return new HBox( {
			cls: item.cls,
			content: new Label( { icon: item.iconId, text: item.text }) 
		} )
	}

	/**
	 * 
	 */

	filter( filter: string ) {
		const childs = this._view.enumChildComponents( false );
		
		if( !filter ) {
			childs.forEach( x => x.show( true ) );
		}
		else {
			// get list of visible items
			const filtred = this._items
					.filter( x => x.text.includes(filter) )
					.map( x => x.id+'' );

			// now hide all elements not in list
			childs.forEach( x => {
				x.show( filtred.includes( x.getData( "id" ) ) );
			});
		}
	}

	/**
	 * append or prepend a new item
	 * @param item 
	 * @param prepend 
	 * @param select 
	 */

	appendItem( item: ListItem, prepend = false, select = true ) {
		
		if( select ) {
			this.clearSelection( );
		}

		let el = this.renderItem( item );

		if( prepend ) {
			this._items.unshift( item );
			this._view.prependContent( el );
		}
		else {
			this._items.push( item );
			this._view.appendContent( el );
		}

		if( select ) {
			this._selectItem( item.id, el, 'single' );
		}
	}

	/**
	 * update an item
	 */

	 updateItem( id: any, item: ListItem ) {

		// find item
		const idx = this._findItemIndex( id );
		if( idx<0 ) {
			return;
		}
		
		// take care of selection
		let was_sel = false;
		if( this._multisel.has(id) ) {
			was_sel = true;
		}

		// replace it in the list
		this._items[idx] = item;

		// rebuild & replace it's line
		const old = this._itemFromID( item.id );
		if( old?.dom ) {
			const _new = this.renderItem( item );
			if( was_sel ) {
				_new.addClass( "selected" );
			}

			this._view.dom.replaceChild( _new.dom, old.dom );
		}
	}

	getSelection( ) {
		return Array.from( this._multisel );
	}
}
