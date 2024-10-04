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

import { ScrollView, Viewport } from '../viewport/viewport';
import { HBox } from '../boxes/boxes.js';
import { Label } from '../label/label.js';

import "./listbox.module.scss"

export enum kbNav {
	first,
	prev,
	next,
	last,
}

export type ListboxID = number | string;

export interface ListItem {
	id: ListboxID;
	text: string;

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
	checkable?: true,
}



export class Listbox extends Component<ListboxProps,ListboxEvents> {

	private _view: Viewport;
	private _selection: ListboxID;
	private _selitem: Component;
	private _items: ListItem[];

	preventFocus = false;

	constructor( props: ListboxProps ) {
		super( { ...props } );

		this.setAttribute( "tabindex", 0 );
		
		const scroller = new ScrollView( { cls: "body" } );
		this._view = scroller.getViewport( );

		this.setContent( [
			//props.header ? props.header : null,
			scroller,
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
		
		if( !this._selitem ) {
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
				this._selectItem( id, fel );
				return true;
			}
		}
		else {
			let nel = sens==kbNav.next ? this._selitem.nextElement() : this._selitem.prevElement();
			nel = next_visible( nel, sens==kbNav.next );

			if( nel ) {
				const id = nel.getData( "id" );
				this._selectItem( id, nel );
				return true;
			}
		}

		return false;
	}

	/**
	 * 
	 */
	
	private _on_click( ev: UIEvent ) {
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
					this._selectItem( id, c );
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
				
				this._selectItem(id, c);
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

	private _selectItem( id: ListboxID, item: Component ) {
		if( this._selitem ) {
			this._selitem.removeClass( "selected" );
			this._selitem = undefined;
		}

		this._selitem = item;
		this._selection = id;

		if( item ) {
			item.addClass( "selected" );
			item.scrollIntoView( {
				behavior: "smooth",
				block: "nearest"
			} );
		}

		const itm = this._findItem( id );
		this.fire( "selectionChange", { selection: itm } );
	}

	/**
	 * 
	 */

	private _findItem( id: ListboxID ) {
		return this._items.find( x => x.id==id );
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

	clearSelection( ) {
		if( this._selitem ) {
			this._selitem.removeClass( "selected" );
			this._selitem = undefined;
		}

		this._selection = undefined;
		this.fire( "selectionChange", { selection: undefined } );
	}
	
	/**
	 * 
	 */

	setItems( items: ListItem[] ) {
		this.clearSelection( );
		
		this._view.clearContent( );
		this._items = items;

		if( items ) {
			const content = items.map( x => this.renderItem(x) );
			this._view.setContent( content );
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
			this._selectItem( item.id, el );
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
		if( this._selection && this._selection===id ) {
			was_sel = true;
		}

		// replace it in the list
		this._items[idx] = item;

		// rebuild & replace it's line
		const oldDOM = this.query( `[data-id="${item.id}"]` )?.dom;
		if( oldDOM ) {
			const _new = this.renderItem( item );
			this._view.dom.replaceChild( _new.dom, oldDOM );

			if( was_sel ) {
				this._selectItem( item.id, _new );
			}
		}
	}
}
