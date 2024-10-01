import { Component, componentFromDOM, ComponentProps } from '@core/component';

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

export interface ListboxItem {
	id: ListboxID;
	text: string;

	iconId?: string;
	data?: any;
	cls?: string;
}

/**
 * 
 */

//export interface ChangeEvent extends ComponentEvent {
//	selection: ListboxItem;
//}

//interface ListboxEvents extends ComponentEvents {
//	change: ChangeEvent;
//}

interface ListboxProps extends Omit<ComponentProps,'content'> {
	items?: ListboxItem[];
	renderer?: ( item: ListboxItem ) => Component;
	//header?: Header;
}



export class Listbox extends Component<ListboxProps/*,ListboxEvents*/> {

	private _view: Viewport;
	private _selection: ListboxID;
	private _selitem: Component;
	private _items: ListboxItem[];

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
			click: 	 (ev) => this._onclick( ev ),
			keydown: ( ev ) => this._onkey( ev ),
		} );

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	/**
	 * 
	 */

	private _onkey( ev: KeyboardEvent ) {
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

		if( sens==kbNav.first || sens==kbNav.last ) {
			const fel = sens==kbNav.first ? this._view.firstChild() : this._view.lastChild( );
			if( fel ) {
				const id = fel.getData( "id" );
				this._selectItem( id, fel );
				return true;
			}
		}
		else {
			const nel = sens==kbNav.next ? this._selitem.nextElement() : this._selitem.prevElement();
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
	
	private _onclick( ev: UIEvent ) {
		let target = ev.target as HTMLElement;
		while( target && target!=this.dom ) {
			const c = componentFromDOM( target );
			if( c && c.hasClass("x4item") ) {
				const id = c.getData( "id" );
				this._selectItem( id, c );
				return;
			}

			target = target.parentElement;
		}

		this.clearSelection( );
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
		//this.fire( "change", { selection: itm } );
	}

	private _findItem( id: ListboxID ) {
		return this._items.find( x => x.id==id );
	}

	clearSelection( ) {
		if( this._selitem ) {
			this._selitem.removeClass( "selected" );
			this._selitem = undefined;
		}

		this._selection = undefined;
		//this.fire( "change", { selection: undefined } );
	}
	
	setItems( items: ListboxItem[] ) {
		this._view.clearContent( );
		this._items = items;

		if( items ) {
			const content = items.map( x => this.renderItem(x) );
			this._view.setContent( content );
		}
	}

	renderItem( item: ListboxItem ) {
		const renderer = this.props.renderer ?? this.defaultRenderer;
		const line = renderer( item );
	
		line.addClass( "x4item" );
		line.setData( "id", item.id+"" );
		
		return line;
	}

	defaultRenderer( item: ListboxItem ): Component {
		return new HBox( {
			cls: item.cls,
			content: new Label( { icon: item.iconId, text: item.text }) 
		} )
	}

	filter( filter: string ) {
		const filtred = this._items.filter( x => x.text.includes(filter) );
		if( this._selection && !filtred.some( x => x.id==this._selection ) ) {
			this.clearSelection( );
		}

		this.setItems( filtred );
	}
}
