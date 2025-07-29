/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file treeview.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools';
import { Component, ComponentEvent, ComponentEvents, ComponentProps, EvSelectionChange, componentFromDOM } from '../../core/component';

import { ScrollView, Viewport } from '../viewport/viewport';
import { Label } from '../label/label';
import { ListboxID, ListItem, kbNav } from '../listbox/listbox';
import { Box, BoxProps, HBox, VBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';

import "./treeview.module.scss";
import folder_icon from "./chevron-down-light.svg"


//import folder_closed from "./folder-minus-light.svg"

export enum kbTreeNav {
	first,
	prev,
	next,
	last,
	
	parent,
	child,

	expand,
	collapse,
	toggle,
}


export interface TreeItem extends ListItem {
	children?: TreeItem[];
	open?: boolean;
}

interface TreeviewProps extends Omit<ComponentProps,"content"> {
	items: TreeItem[];
	footer?: Component;
}

interface ChangeEvent extends ComponentEvent {
	selection: TreeItem;
}

interface TreeviewEvents extends ComponentEvents {
	selectionChange?: EvSelectionChange;
}

/**
 * 
 */

@class_ns( "x4" )
class CTreeViewItem extends Box {

	private _item: TreeItem;
	private _label: Component;
	private _icon: Icon;
	private _childs: Component;

	constructor( props: BoxProps, item: TreeItem ) {
		super( { ...props } );

		this._item = item;

		if( item ) {
			this._label = new HBox( {cls:"label item", content: [
				this._icon = new Icon( { iconId: item.children ? folder_icon : undefined } ),
				new Label( { tag: "span", cls: "", text: item.text, icon: item.iconId } ),
			]});

			this._label.setData( "id", item.id+"" );
				
			if( item.children ) {
				this. _childs = new VBox( { cls: "body" } );

				if( item.open===undefined ) {
					item.open = false;
				}

				this.addClass( "folder" )
				this.setClass( "open", item.open );
				this.setItems( item.children );

				this._icon.addDOMEvent( "click", ( ev )=>this.toggle(ev) );
			}
		}
		else {
			this. _childs = new VBox( { cls: "body" } );
		}
		
		this.setContent( [
			this._label,
			this._childs,
		] );
	}

	toggle( ev?: UIEvent ) {
		
		const isOpen = this.hasClass("open");
		this.open( !isOpen );

		if( ev ) {
			ev.stopPropagation( );
		}
	}

	open( open = true ) {
		this.setClass( "open", open );
		this._item.open = open;
	}

	setItems( items: TreeItem[ ] ) {
		if( items ) {
			const childs = items.map( itm => {
				return new CTreeViewItem( {}, itm );
			})
			this._childs.setContent( childs );
		}
		else {
			this._childs.clearContent( );
		}
	}
}


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



/**
 * 
 */

@class_ns( "x4" )
export class Treeview extends Component<TreeviewProps,TreeviewEvents> {

	private _view: Viewport;
	private _selection: ListboxID;
	private _selitem: Component;
	private _items: TreeItem[];

	constructor( props: TreeviewProps ) {
		super( props );

		const scroller = new ScrollView( { cls: "body" } );
		this._view = scroller.getViewport( );

		this.setContent( [
			scroller,
			props.footer,
		] );

		if( props.footer ) {
			props.footer.setAttribute( "id", "footer" );
		}

		this.setAttribute( "tabindex", 0 );
		this.setDOMEvents( {
			click: ( ev ) => this._onclick( ev ),
			keydown: ( ev ) => this._onkey( ev ),
		});

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	/**
	 * 
	 */

	setItems( items: TreeItem[ ] ) {
		this.clearSelection( );
		this._view.clearContent( );
		this._items = items;

		const root = new CTreeViewItem( { cls: "root"}, null );

		if( items ) {
			root.setItems( items );
			this._view.setContent( root );
		}
	}

	private _onclick( ev: UIEvent ) {
		let target = ev.target as HTMLElement;
		while( target && target!=this.dom ) {
			const c = componentFromDOM( target );
			
			if( c && c.hasClass("item") ) {
				const id = c.getData( "id" );
				this._selectItem( id, c );
				return;
			}

			target = target.parentElement;
		}

		this.clearSelection( );
	}

	private _onkey( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "ArrowDown": {
				this.navigate( kbTreeNav.next );
				break;
			}

			case "ArrowUp": {
				this.navigate( kbTreeNav.prev );
				break;
			}

			case "Home": {
				this.navigate( kbTreeNav.first );
				break;
			}

			case "End": {
				this.navigate( kbTreeNav.last );
				break;
			}

			case "ArrowRight":{
				this.navigate( kbTreeNav.child );
				break;
			}

			case "+": {
				this.navigate( kbTreeNav.expand );
				break;
			}

			case "ArrowLeft": {
				this.navigate( kbTreeNav.parent );
				break;
			}
			
			case "-": {
				this.navigate( kbTreeNav.collapse );
				break;
			}

			
			case ' ': {
				this.navigate( kbTreeNav.toggle );
				break;
			}

			default:
				console.log( ev.key );
				return;
		}

		ev.preventDefault( );
		ev.stopPropagation( );
	}

	/**
	 * 
	 */

	navigate( sens: kbTreeNav ) {

		if( !this._items || this._items.length==0 ) {
			return;
		}
		
		if( !this._selitem ) {
			if( sens==kbTreeNav.next || sens==kbTreeNav.parent ) sens = kbTreeNav.first;
			else if( sens==kbTreeNav.prev ) sens = kbTreeNav.last;
			else return;
		}

		const p = this._selitem?.parentElement<CTreeViewItem>( );
		const isFolder = p?.hasClass("folder");

		if( p && sens==kbTreeNav.parent && isFolder && p.hasClass("open") ) {
			sens = kbTreeNav.collapse;
		}
		else if( sens==kbTreeNav.child ) {
			if( isFolder) {
				if( !p.hasClass("open") ) {
					sens = kbTreeNav.expand;
				}
				else {
					sens = kbTreeNav.next;
				}
			}
			else {
				sens = kbTreeNav.next;
			}
		}

		if( sens==kbTreeNav.expand || sens==kbTreeNav.collapse || sens==kbTreeNav.toggle ) {
			if( isFolder ) {
				if( sens==kbTreeNav.toggle ) {
					p.toggle( );
					return true;
				}
				else {
					p.open( sens==kbTreeNav.expand );
					return true;
				}
			}
		}
		else {
			const all = this._flattenOpenItems( );
			let cur = all.findIndex( x => this._selection==x.id );

			let newSel: ListboxID;
			
			if( sens==kbTreeNav.first ) {
				newSel = all[0].id;
			} 
			else if( sens==kbTreeNav.last ) {
				newSel = all[all.length-1].id;
			}
			else if( cur>=0 ) {
				if( sens==kbTreeNav.prev ) {
					if( cur>0 ) {
						newSel = all[cur-1].id;
					}
				}
				else if( sens==kbTreeNav.next ) {
					if( cur<all.length-1 ) {
						newSel = all[cur+1].id;
					}
				}
				else if( sens==kbTreeNav.parent ) {

					const clevel = all[cur].level;
					while( cur>0 ) {
						cur--;
						if( all[cur].level<clevel ) {
							newSel = all[cur].id;
							break;
						}
					}
				}
			}

			if( newSel ) {
				const nsel = this.query( `[data-id="${newSel}"]`)
				this._selectItem( newSel, nsel );
				return true;
			}
		}
		
		return false;
	}

	private _flattenOpenItems( ) {
		let all: { id: ListboxID, level: number }[] = [];
		
		const build = ( x: TreeItem, level: number ) => {
			all.push( {id: x.id+"", level } );
			if( x.children && x.open ) {
				x.children.forEach( y => build( y, level+1 ) );
			}
		}

		this._items.forEach( y => build( y, 0 ) );
		return all;
	}

	private _flattenItems( ) {
		let all: TreeItem[] = [];
		
		const build = ( x: TreeItem ) => {
			all.push( x );
			if( x.children ) {
				x.children.forEach( y => build(y) );
			}
		}

		this._items.forEach( y => build( y ) );
		return all;
	}

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
		this.fire( "selectionChange", { selection: itm, empty: false } );
	}

	private _findItem( id: ListboxID ) {
		const all = this._flattenItems( );
		return all.find( x => x.id==id );
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
		this.fire( "selectionChange", { selection: undefined, empty: true } );
	}

	/**
	 * 
	 */

	getSelection( ) {
		return this._selection;
	}
}
