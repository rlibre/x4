/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file select.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2025 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvents, ComponentProps, EvChange, EvFocus  } from '../../core/component';
import { class_ns, IComponentInterface, IFormElement, isArray } from '../../core/core_tools';

import { ListboxID, ListItem } from '../components';

import "./select.module.scss"

/**
 * 
 */

export interface SelectProps extends ComponentProps {
	name?: string;
	value?: ListboxID;
	items: ListItem[];
	multiple?: boolean;
	required?: boolean;
	change?: EventCallback<EvChange>;
	focus?: EventCallback<EvFocus>;
}

interface SelectEvents extends ComponentEvents {
	focus: EvFocus;
	change: EvChange;
}


/**
 * simple select
 * cf. Combobox
 */

@class_ns( "x4" )
export class Select extends Component<SelectProps,SelectEvents> {

	private _items: ListItem[];

	constructor( props: SelectProps ) {
		super( { tag: "select", ...props } );

		this.mapPropEvents( props, "focus", "change" );
		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		if( props.multiple ) {
			this.setAttribute( "multiple", true );
		}

		if( props.required ) {
			this.setAttribute( "required", true );
		}

		this.setItems( props.items );

		this.addDOMEvent( "blur", ( e ) => { this.on_focus(e,true);} );
		this.addDOMEvent( "focus", ( e ) => { this.on_focus(e,false);} );
		this.addDOMEvent( "input", ( e ) => { this.on_change(e as InputEvent); });

		if( props.value!==undefined ) {
			this.setValue( props.value );
		}
	}

	/**
	 * 
	 */

	private on_focus( ev: FocusEvent, focus_out: boolean ) {
		const event: EvFocus = { focus_out }
		this.fire( "focus", event );

		if( event.defaultPrevented ) {
			ev.preventDefault( );
		}
	}

	/**
	 * 
	 */

	private on_change( ev: InputEvent ) {

		const event: EvChange = { value: this.getValue() };
		this.fire( "change", event );

		if( event.defaultPrevented ) {
			ev.preventDefault( );
		}
	}

	/**
	 * 
 	 */

	setItems( items: ListItem[] ) {
		const sel = this._items ? this.getSelValues( ) : [];

		this._items = [...items];
		this.setContent( items.map( x => {
			return new Component( {
				tag: "option",
				cls: x.cls ? "select-option "+x.cls : "select-option",
				attrs: { value: x.id },
				content: x.text,
			});
		} ));

		if( sel.length ) {
			this.setSelValues( sel );
		}
	}

	/**
	 * @returns 
	 */

	public getValue( ) : ListboxID {
		const el = (this.dom as HTMLSelectElement);
		const sel = this._items[el.selectedIndex];
		return sel?.id;
	}

	/**
	 * @param value 
	 */
	
	public setValue( value: ListboxID ) {
		//(this.dom as HTMLSelectElement).value = value+"";
		const el = (this.dom as HTMLSelectElement);
		el.selectedIndex = this._items.findIndex( x => x.id===value );
	}

	/**
	 * @returns all selected ids (multiple)
	 */

	public getSelValues( ) : ListboxID[] {
		const el = (this.dom as HTMLSelectElement);
		return Array.from( el.selectedOptions ).map( o => this._items[o.index].id );
	}

	/**
	 * @param values ids to select (multiple)
	 */

	public setSelValues( values: ListboxID[] ) {
		const el = (this.dom as HTMLSelectElement);
		this._items.forEach( ( x, i ) => {
			el.options[i].selected = values.includes( x.id );
		});
	}

	/**
	 *
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.props.multiple ? this.getSelValues() : this.getValue(); },
				setRawValue: ( v: any ) => { isArray(v) ? this.setSelValues(v) : this.setValue(v); },
				isValid: ( ) => { return (this.dom as HTMLSelectElement).checkValidity(); }
			};

			return i as unknown as T;
		}

		return super.queryInterface( name );
	}
}


