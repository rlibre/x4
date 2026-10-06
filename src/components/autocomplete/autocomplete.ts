/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file autocomplete.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, EvChange } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { class_ns, kbNav } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { DropdownList } from '../combobox/combobox';
import { TextInputProps } from '../input/input';
import { SimpleText } from '../label/label';
import { ListboxID, ListItem } from '../listbox/listbox';
import { TextEdit, TextEditBase } from '../textedit/textedit';

import "./autocomplete.module.scss"

/**
 * fired when suggestions are needed for a text
 * setItems can be called later (async), late answers are ignored
 */

export interface EvSearch extends ComponentEvent {
	text: string;
	setItems: ( items: ListItem[] ) => void;
}

/**
 * fired when the value is validated
 */

export interface EvAutoCompleteChange extends EvChange {
	item: ListItem;		// picked item, null for a free text
}

interface AutoCompleteEvents extends ComponentEvents {
	search: EvSearch;
	change: EvAutoCompleteChange;
}

export interface AutoCompleteProps extends Omit<TextInputProps,"type"|"change">, TextEditBase {
	search: EventCallback<EvSearch>;
	change?: EventCallback<EvAutoCompleteChange>;

	/** only a picked item (or nothing) is accepted, default false: free text is kept */
	strict?: boolean;

	/** what is written in the field when an item is picked (default "text") */
	itemValue?: "text" | "id";

	/** delay between the last key and the search, in ms (default 250) */
	delay?: number;

	/** number of chars needed to start a search (default 1) */
	minChars?: number;

	/** custom renderer for the suggestions */
	renderer?: ( item: ListItem ) => Component;
}

// suggestion as: id + text
const render_id_item = ( item: ListItem ) => {
	return new HBox( {
		cls: item.cls,
		content: [
			new SimpleText( { cls: "id", text: item.id+"" } ),
			new SimpleText( { cls: "text", text: item.text } ),
		]
	});
}

/**
 * Text field with suggestions asked on demand (search event).
 *
 * @example
 * new AutoComplete( {
 *   label: "Customer",
 *   strict: true,
 *   search: async ( ev ) => {
 *     const rows = await api.searchCustomers( ev.text );
 *     ev.setItems( rows.map( r => ( { id: r.id, text: r.name } ) ) );
 *   },
 *   change: ( ev ) => console.log( ev.value, ev.item ),
 * })
 */

@class_ns( "x4" )
export class AutoComplete extends TextEdit<AutoCompleteEvents> {

	private _popup: DropdownList;

	private _strict: boolean;
	private _by_id: boolean;
	private _delay: number;
	private _min_chars: number;

	private _text: string;		// last validated text
	private _item: ListItem;	// last picked item (null: free text)
	private _seq: number;		// search sequence, to ignore late answers
	private _count: number;		// number of suggestions

	constructor( props: AutoCompleteProps ) {
		// the change of the input (each key) starts the search, our change event is fired on validation
		super( { ...props, type: "text", change: ( ) => this._on_input( ) } );

		this._strict = !!props.strict;
		this._by_id = props.itemValue=="id";
		this._delay = props.delay ?? 250;
		this._min_chars = props.minChars ?? 1;

		this._text = this.getInput( ).getValue( );
		this._item = null;
		this._seq = 0;
		this._count = 0;

		this.mapPropEvents( props, 'change', 'search' );

		this._popup = new DropdownList( {
			cls: "autocomplete",
			items: [],
			renderer: props.renderer ?? ( this._by_id ? render_id_item : undefined )
		} );

		this._popup.on( "click", ( ev ) => {
			const item = this._popup.getList( ).getItem( ev.context as ListboxID );
			if( item ) {
				this._pick( item );
			}
		});

		this.getInput( ).addDOMEvent( "keydown", ( ev ) => this._on_key( ev ) );

		this.addDOMEvent( "focusout", ( ev ) => this._on_focusout( ev ) );
	}

	/**
	 *
	 */

	private _on_input( ) {
		const text = this.getInput( ).getValue( );

		// pending answers are obsolete
		this._seq++;

		if( text.length<this._min_chars ) {
			this.clearTimeout( "search" );
			this._popup.show( false );
			return;
		}

		this.setTimeout( "search", this._delay, ( ) => this._search( text ) );
	}

	/**
	 *
	 */

	private _search( text: string ) {
		const seq = ++this._seq;

		const setItems = ( items: ListItem[] ) => {
			// a newer search was started (or the field was left)
			if( seq!=this._seq ) {
				return;
			}

			this._setItems( items ?? [] );
		}

		this.fire( "search", { text, setItems } );
	}

	private _setItems( items: ListItem[] ) {
		const list = this._popup.getList( );
		list.setItems( items );
		this._count = items.length;

		if( !items.length ) {
			this._popup.show( false );
			return;
		}

		this.showDropDown( );

		// strict: Enter picks the first suggestion
		if( this._strict ) {
			list.navigate( kbNav.first );
		}
	}

	/**
	 *
	 */

	private _on_key( ev: KeyboardEvent ) {
		const list = this._popup.getList( );
		const open = this._popup.isOpen( );

		switch( ev.key ) {
			case "ArrowUp":
			case "ArrowDown": {
				if( open ) {
					list.navigate( ev.key=="ArrowDown" ? kbNav.next : kbNav.prev );
				}
				else if( this._count ) {
					this.showDropDown( );
				}
				else {
					this.clearTimeout( "search" );
					this._search( this.getInput( ).getValue( ) );
				}

				break;
			}

			case "Enter": {
				const [sel] = open ? list.getSelection( ) : [];
				const item = sel!==undefined ? list.getItem( sel ) : null;

				if( !item ) {
					// nothing to pick: the key is not for us
					this._popup.show( false );
					return;
				}

				this._pick( item );
				break;
			}

			case "Escape": {
				if( !open ) {
					return;
				}

				this._popup.show( false );
				break;
			}

			default: {
				return;
			}
		}

		ev.preventDefault( );
		ev.stopPropagation( );
	}

	/**
	 *
	 */

	private _on_focusout( ev: FocusEvent ) {
		// focus is moving inside the control
		const to = ev.relatedTarget as Node;
		if( to && this.dom.contains( to ) ) {
			return;
		}

		this.clearTimeout( "search" );
		this._seq++;
		this._popup.show( false );

		const input = this.getInput( );
		const text = input.getValue( );
		if( text===this._text ) {
			return;
		}

		// strict: back to the last validated value (but the field can be emptied)
		if( this._strict && text!=="" ) {
			input.setValue( this._text );
			return;
		}

		this._commit( text, null );
	}

	/**
	 * an item was choosen in the suggestions
	 */

	private _pick( item: ListItem ) {
		const text = ( this._by_id ? item.id : item.text ) + "";

		this.clearTimeout( "search" );
		this._seq++;

		this.getInput( ).setValue( text );
		this._popup.show( false );

		this._commit( text, item );
	}

	private _commit( text: string, item: ListItem ) {
		const changed = text!==this._text || item?.id!==this._item?.id;

		this._text = text;
		this._item = item;

		if( changed ) {
			this.fire( "change", { value: text, item } );
		}
	}

	/**
	 *
	 */

	showDropDown( ) {
		if( this.isDisabled() || this._popup.isOpen( ) ) {
			return;
		}

		const rc = ( this.query( ":scope > #edit" ) ?? this ).getBoundingRect( );
		this._popup.setStyleValue( "minWidth", rc.width+"px" );
		this._popup.displayNear( rc, "top left", "bottom left", {x:0,y:6} );
	}

	/**
	 * change the text of the field (no item is selected, no event)
	 */

	override setValue( value: string ) {
		super.setValue( value );

		this._text = this.getInput( ).getValue( );
		this._item = null;
	}

	/**
	 * select an item as if it was picked in the suggestions (no event)
	 */

	setSelection( item: ListItem ) {
		super.setValue( ( this._by_id ? item.id : item.text ) + "" );

		this._text = this.getInput( ).getValue( );
		this._item = item;
	}

	/**
	 * @returns the id of the picked item, undefined if the text does not come from the suggestions
	 */

	getSelection( ): ListboxID {
		return this.getInput( ).getValue( )===this._text ? this._item?.id : undefined;
	}
}
