/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file combobox.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentProps, EvChange, EvSelectionChange, makeUniqueComponentId } from '../../core/component';
import { Listbox, ListboxID, ListItem, kbNav } from '../listbox/listbox';
import { Popup, PopupEvents, PopupProps } from '../popup/popup.js';
import { Label } from '../label/label';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { HBox } from '../boxes/boxes';

import "./combobox.module.scss";
import icon from "./updown.svg";
import { class_ns } from '@core/core_tools.js';



interface DropdownEvents extends PopupEvents {
	selectionChange: EvSelectionChange;
}


interface DropdownProps extends Omit<PopupProps,"content"> {
	items: ListItem[];
}

@class_ns( "x4" )
class Dropdown extends Popup<DropdownProps,DropdownEvents> {

	private _list: Listbox;

	constructor( props: DropdownProps, content?: ListItem[] ) {
		super( props );

		this._list = new Listbox( { items: props.items } );
		this.setContent( this._list );

		this.addDOMEvent( "mousedown", ( ev: Event ) => { 
			console.log( "trap" );
			ev.stopImmediatePropagation( );
			ev.stopPropagation( );
			ev.preventDefault( );
		}, true );

		this._list.on( "selectionChange", ( ev ) => {
			this.fire( "selectionChange", ev );
		})
	}

	getList( ) {
		return this._list;
	}
}


/**
 * 
 */

interface ComboboxProps extends Omit<ComponentProps,"content"> {
	label?: string;
	labelWidth?: number | string;
	readonly?: boolean;
	items: ListItem[];
}

@class_ns( "x4" )
export class Combobox extends Component<ComboboxProps> {

	private _popup: Dropdown;
	private _label: Label;
	private _input: Input;
	private _button: Button;
	private _prevent_close = false;
	private _edit: HBox;
				
	constructor( props: ComboboxProps ) {
		super( props );

		const id = makeUniqueComponentId( );

		this.setContent( [
			new HBox( { id: "label", content: new Label( { tag: "label", text: props.label, labelFor: id, width: props.labelWidth } ) } ),
			this._edit  = new HBox( { id: "edit", content: [
				this._input  = new Input( { type: "text", value: "", readonly: props.readonly }),
				this._button = new Button( { icon: icon } )
			]} ),
		])

		const popup = new Dropdown( { items: props.items } );
		const list = popup.getList( );

		popup.on( "selectionChange", ( ev ) => {
			const [sel] = ev.selection as ListboxID[];
			this._input.setValue( sel ? list.getItem(sel) : "" );
			
			if( !this._prevent_close ) {
				popup.show( false );
			}
		});

		this._popup = popup;

		this._button.addDOMEvent( "click", ( ) => this._on_click( ) );
		this._input.addDOMEvent( "input", ( ) => this._on_input( ) );
		this._input.addDOMEvent( "keydown", ( ev ) => this._on_key( ev ) );

		this.setDOMEvents( {
			focusout: ( ) => this._on_focusout( ),
			click: ( ) => this._on_click( ),
		})
	}

	private _on_key( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "Enter":
			case "Escape": {
				this._popup.show( false );
				break;
			}

			case "ArrowUp":
				this._prevent_close = true;
				if( !this._popup.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					this._popup.getList().navigate( kbNav.prev );
				}

				this._prevent_close = false;
				break;

			case "ArrowDown":
				this._prevent_close = true;
				if( !this._popup.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					this._popup.getList().navigate( kbNav.next );
				}

				this._prevent_close = false;
				break;

			default: {
				return;
			}
		}

		ev.preventDefault( );
		ev.stopPropagation( );
	}

	private _on_input( ) {
		if( !this._popup.isOpen( ) ) {
			this.showDropDown( );
		}

		this._popup.getList().filter( this._input.getValue( ) );
	}

	private _on_focusout( ) {
		this._popup.show( false );
	}
	
	private _on_click( ) {
		this.showDropDown( );
	}

	showDropDown( ) {
		if( this.isDisabled() ) {
			return;
		}
		
		const rc = this._edit.getBoundingRect( );
		this._popup.setStyleValue( "width", rc.width+"px" );
		this._popup.displayNear( rc, "top left", "bottom left", {x:0,y:6} );
	}
}


