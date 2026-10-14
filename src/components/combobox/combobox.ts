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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvClick, EvSelectionChange, makeUniqueComponentId } from '../../core/component';
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
	//selectionChange: EvSelectionChange;
	click: EvClick;
}


interface DropdownProps extends Omit<PopupProps,"content"> {
	items: ListItem[];
	renderer?: ( item: ListItem ) => Component;
}


@class_ns( "x4" )
export class DropdownList extends Popup<DropdownProps,DropdownEvents> {

	private _list: Listbox;

	constructor( props: DropdownProps ) {
		super( props );

		this._list = new Listbox( { items: props.items, renderer: props.renderer } );
		this.setContent( this._list );

		this.addDOMEvent( "mousedown", ( ev: Event ) => { 
			ev.stopImmediatePropagation( );
			ev.stopPropagation( );
			ev.preventDefault( );
		}, true );

		this._list.on( "click", ( ev ) => {
			//this.fire( "selectionChange", ev );
			this.fire( "click", ev );
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
	value?: ListboxID;
	labelWidth?: number | string;
	readonly?: boolean;
	required?: boolean;
	items: ListItem[];

	/** draws an item of the list, instead of its text. The field still shows the text of the item that is chosen. */
	renderer?: ( item: ListItem ) => Component;

	selectionChange?: EventCallback<EvSelectionChange>,
}

/**
 * @cssvar
 * ```
 * --dropdown-border
 * --dropdown-background
 * --combobox-border
 * --combobox-border-focus
 * --combobox-btn-background
 * --combobox-btn-color
 * --combobox-btn-color-hover
 * --combo-tree-indent
 * ```
 */

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

		this._popup = new DropdownList( { items: props.items, renderer: props.renderer } );
		this._popup.on( "click", ( ev ) => {
			const sel = ev.context as ListboxID;
			if( sel!==undefined ) {	// no empty sel
				this._choose( sel, true );
			}
		});

		if( props.value!==undefined && props.value!==null ) {
			this._choose( props.value, false );
		}

		this._button.addDOMEvent( "click", ( ) => this._on_click( ) );
		this._input.addDOMEvent( "input", ( ) => this._on_input( ) );
		this._input.addDOMEvent( "keydown", ( ev ) => this._on_key( ev ) );

		this.setDOMEvents( {
			focusout: ( ) => this._on_focusout( ),
			click: ( ) => this._on_click( ),
		})
	}

	/**
	 * the item chosen: by a click, by the arrows (the popup stays open), or by the props
	 */

	private _choose( sel: ListboxID, notify: boolean ) {
		const list = this._getList( );
		const itm = list.getItem( sel );
		if( itm ) {
			list.select( sel, false );
			this._input.setValue( itm.text as string );
		}

		if( !this._prevent_close ) {
			this._popup.show( false );
		}

		if( notify ) {
			this.fire( "selectionChange", { selection: [sel], empty: false } );
		}
	}

	private _on_key( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "Enter":
			case "Escape": {
				if( this._popup.isOpen( ) ) {
					this._popup.show( false );
					break;
				}
				return;
			}

			case "ArrowUp":
				this._prevent_close = true;
				if( !this._popup.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					// the item reached is chosen at once
					const list = this._getList( );
					list.navigate( kbNav.prev );
					const [sel] = list.getSelection( );
					if( sel!==undefined ) {
						this._choose( sel, true );
					}
				}

				this._prevent_close = false;
				break;

			case "ArrowDown":
				this._prevent_close = true;
				if( !this._popup.isOpen( ) ) {
					this.showDropDown( );
				}
				else {
					// the item reached is chosen at once
					const list = this._getList( );
					list.navigate( kbNav.next );
					const [sel] = list.getSelection( );
					if( sel!==undefined ) {
						this._choose( sel, true );
					}
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

		// the text typed is no longer the one of the item chosen: none is chosen
		const list = this._getList( );
		const sel = this.getSelection( );
		if( sel!==undefined ) {
			const itm = list.getItem( sel );
			if( !itm || itm.text!==this._input.getValue( ) ) {
				list.clearSelection( false );
				this.fire( "selectionChange", { selection: [], empty: true } );
			}
		}

		list.filter( this._input.getValue( ) );
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
		this._popup.getList().ensureSelectionVisible( );
	}

	setItems( items: ListItem[] ) {
		const list = this._getList( );
		list.setItems( items );
		this.setValue( "" ); 
	}

	getValue( ) {
		return this._input.getValue( );
	}

	setValue( value: string ) {
		this._input.setValue( value );
	}

	selectItem( index: ListboxID ) {
		const list = this._getList( );
		list.select( index );
		// no item (null...): the text is emptied too
		const el = list.getItem( index );
		this.setValue( el ? el.text as string : "" );
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

			return i as unknown as T;
		}
		
		return super.queryInterface( name );
	}

	getInput( ) {
		return this._input;
	}
}


