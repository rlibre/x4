import { Component, ComponentEvent, ComponentProps, EvChange, EvSelectionChange, makeUniqueComponentId } from '@core/component';
import { Listbox, ListboxID, ListItem, kbNav } from '../listbox/listbox';
import { Popup, PopupEvents, PopupProps } from '../popup/popup.js';
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


export class Combobox extends Component<ComboboxProps> {

	private _dropdown: Dropdown;
	private _label: Label;
	private _input: Input;
	private _button: Button;
	private _prevent_close = false;
	private _edit: HBox;
				
	constructor( props: ComboboxProps ) {
		super( props );

		const id = makeUniqueComponentId( );

		this.setContent( [
			new HBox( { id: "label", content: new Label( { text: props.label, labelFor: id, width: props.labelWidth } ) } ),
			this._edit  = new HBox( { id: "edit", content: [
				this._input  = new Input( { type: "text", value: "", readonly: props.readonly }),
				this._button = new Button( { icon: icon } )
			]} ),
		])

		this._dropdown = new Dropdown( { items: props.items } );

		this._dropdown.on( "selectionChange", ( ev ) => {
			const sel = ev.selection as ListItem;
			this._input.setValue( sel ? sel.text : "" );
			
			if( !this._prevent_close ) {
				this._dropdown.show( false );
			}
		});

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
				this._dropdown.show( false );
				break;
			}

			case "ArrowUp":
				this._prevent_close = true;
				if( !this._dropdown.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					this._dropdown.getList().navigate( kbNav.prev );
				}

				this._prevent_close = false;
				break;

			case "ArrowDown":
				this._prevent_close = true;
				if( !this._dropdown.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					this._dropdown.getList().navigate( kbNav.next );
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
		if( !this._dropdown.isOpen( ) ) {
			this.showDropDown( );
		}

		this._dropdown.getList().filter( this._input.getValue( ) );
	}

	private _on_focusout( ) {
		this._dropdown.show( false );
	}
	
	private _on_click( ) {
		this.showDropDown( );
	}

	showDropDown( ) {
		const rc = this._edit.getBoundingRect( );
		this._dropdown.setStyleValue( "width", rc.width+"px" );
		this._dropdown.displayNear( rc, "top left", "bottom left", {x:0,y:6} );
	}
}


