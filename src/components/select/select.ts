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
import { Component, ComponentEvent, ComponentProps, EvChange, EvFocus  } from '../../core/component';
import { class_ns } from '../../core/core_tools';

import { ListItem } from '../components';

import "./select.module.scss"

/**
 * 
 */

export interface SelectProps extends ComponentProps {
	name?: string;
	value: string;
	items: ListItem[];
	multiple?: boolean;
	change?: EventCallback<EvChange>;
	focus?: EventCallback<EvFocus>;
}

interface SelectEvents extends ComponentEvent {
	focus: EvFocus;
	change: EvChange;
}


/**
 * simple select
 */

@class_ns( "x4" )
export class Select extends Component<SelectProps,SelectEvents> {

	constructor( props: SelectProps ) {
		super( { tag: "select", ...props } );

		this.mapPropEvents( props, "focus", "change" );
		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		this.setItems( props.items );
		
		this.addDOMEvent( "blur", ( e ) => { this.on_focus(e,true);} );
		this.addDOMEvent( "focus", ( e ) => { this.on_focus(e,false);} );
		this.addDOMEvent( "input", ( e ) => { this.on_change(e as InputEvent); });

		if( props.multiple ) {
			this.setAttribute( "multiple", true );
		}

		if( props.value ) {
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
		this.setContent( items.map( x => {
			return new Component( {
				tag: "option",
				attrs: { value: x.id },
				content: x.text,
			});
		} ));
	}

	/**
	 * @returns 
	 */

	public getValue( ) {
		return (this.dom as HTMLSelectElement).value;
	}

	/**
	 * 
	 * @param value 
	 */
	
	public setValue( value: string ) {
		(this.dom as HTMLSelectElement).value = value+"";
	}
}


