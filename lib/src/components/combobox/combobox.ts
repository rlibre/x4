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

import { Component, ComponentEvents, ComponentProps, EvSelectionChange, makeUniqueComponentId } from '../../core/component';
import { class_ns, IComponentInterface, IFormElement, kbNav } from '../../core/core_tools';
import { EventCallback } from '../../core/core_events';

import { Listbox, ListboxID, ListItem } from '../listbox/listbox';
import { Popup, PopupEvents, PopupProps } from '../popup/popup';
import { Label } from '../label/label';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { HBox } from '../boxes/boxes';

import "./combobox.module.scss";
import icon from "./updown.svg";



interface DropdownEvents extends PopupEvents {
	selectionChange: EvSelectionChange;
}


interface DropdownProps extends Omit<PopupProps,"content"> {
	items: ListItem[];
}


@class_ns( "x4" )
export class DropdownList extends Popup<DropdownProps,DropdownEvents> {

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

interface ComboboxEvents extends ComponentEvents {
	selectionChange: EvSelectionChange;
}

interface ComboboxProps extends Omit<ComponentProps,"content"> {
	label?: string;
	name?: string;
	value?: string;
	labelWidth?: number | string;
	readonly?: boolean;
	required?: boolean;
	items: ListItem[];
	selectionChange?: EventCallback<EvSelectionChange>,
}

@class_ns( "x4" )
export class Combobox extends Component<ComboboxProps,ComboboxEvents> {

	private _popup: DropdownList;
	//private _label: Label;
	private _input: Input;
	private _button: Button;
	private _prevent_close = false;
	private _edit: HBox;
				
	constructor( props: ComboboxProps ) {
		super( props );

		const id = makeUniqueComponentId( );

		this.mapPropEvents( props, "selectionChange" );

		const readonly = props.readonly===false ? false : true;	// by default

		this.setContent( [
			new HBox( { id: "label", content: new Label( { tag: "label", text: props.label, labelFor: id, width: props.labelWidth } ) } ),
			this._edit  = new HBox( { id: "edit", content: [
				this._input  = new Input( { id, type: "text", value: "", readonly: readonly, required: props.required }),
				this._button = new Button( { icon: icon, tabindex: -1 } )
			]} ),
		])

		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		if( props.required ) {
			this.setAttribute( "required", true );
		}

		this._popup = new DropdownList( { items: props.items } );
		const list = this._popup.getList( );

		const _select = ( sel: ListboxID ) => {
			const itm = list.getItem(sel);

			//TODO: unsafehtml
			//@ts-ignore
			this._input.setValue( itm ? itm.text : "" );
			
			if( !this._prevent_close ) {
				this._popup.show( false );
			}
		}

		this._popup.on( "selectionChange", ( ev ) => {
			const [sel] = ev.selection as ListboxID[];
			if( sel!==undefined ) {	// no empty sel
				_select( sel );			
				this.fire( "selectionChange", ev );
			}
		});

		if( props.value ) {
			_select( props.value );
		}

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
		this._popup.setStyleValue( "minWidth", rc.width+"px" );
		this._popup.displayNear( rc, "top left", "bottom left", {x:0,y:6} );
	}

	setItems( items: ListItem[] ) {
		this._getList().setItems( items );		
	}

	getValue( ) {
		return this._input.getValue( );
	}

	setValue( value: string ) {
		this._input.setValue( value );
	}

	selectItem( index: ListboxID ) {
		this._getList( ).select( index );
	}

	getSelection( ) {
		const [sel] = this._getList( ).getSelection( );
		return sel;
	}

	private _getList( ) {
		return this._popup.getList( );
	}

	/**
	 * 
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getSelection(); },
				setRawValue: ( v: any ) => { this.selectItem(v); },
				isValid: ( ) => { return this._input.isValid(); }
			};

			//@ts-ignore
			return i as T;
		}
		
		return super.queryInterface( name );
	}
}


