/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file propgrid.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Select } from "../select/select"
import { Button } from "../button/button"
import { Component, ComponentProps, EvChange, EvFocus } from "../../core/component"
import { HBox, VBox } from "../boxes/boxes"
import { Input, InputProps } from "../input/input"
import { ListItem } from "../listbox/listbox"
import { Label, SimpleText } from "../label/label"
import { class_ns, isFunction } from '../../core/core_tools';
import { Icon } from '../components.js'

import "./progrid.module.scss"
import updown_icon from "./updown.svg"


type IValue = boolean | number | string;
type IValueCB = ( name: string) => IValue;

export interface PropertyValue {
	type: 'boolean' | 'number' | 'string' | 'password' | 'options' | 'label' | 'button';
	title?: string;
	desc?: string;
	name?: string;
	value: IValue | IValueCB;
	options?: ListItem[];
	callback: ( name: string, value: any ) => void;
	step?: number;	// for numbers
	live?: boolean;	// for live update 
	cls?: string;
}

export interface PropertyGroup {
	title: string;
	desc?: string;
	icon?: string;
	cls?: string;
	collapsible?: boolean;

	items: PropertyValue[];
}

export interface PropertyProps extends ComponentProps {
	groups: PropertyGroup[];
}

@class_ns( "x4" )
export class PropertyGrid extends VBox {

	private root: Component;
	private groups: PropertyGroup[];

	constructor(props: PropertyProps) {
		super(props);

		this.root = new Component({ cls: "root" });
		this.setContent( this.root );

		if( props.groups ) {
			this.setItems( props.groups );
		}
	};

	/**
	 * 
	 */

	setItems( _grps: PropertyGroup[] ) {

		this.groups = _grps;
		//this.groups.sort( (a,b) => {return a.title>b.title ? 1 : 0} );

		let items: Component[] = [];

		for( const g of this.groups ) {
			items.push( this.makeGroupHeader(g) );
			g.items.forEach( i => {
				items.push( this.makePropertyRow(i) );
			});
		}

		this.root.setContent( items );
	}

	/**
	 * Gets the html of a group header row
	 * @param {string} displayName - The group display name
	 * @param {boolean} isCollapsible - Whether the group should support expand/collapse
	 */

	makeGroupHeader( g: PropertyGroup ) {

		const toggle = (e: Component) => {

			let visible: boolean;
			if (!e.hasClass("collapsed")) {
				e.addClass("collapsed");
				visible = false;
			}
			else {
				e.removeClass("collapsed");
				visible = true;
			}

			let p = e.nextElement();
			while (p && p.hasClass("row")) {
				p.show(visible);
				p = p.nextElement();
			}
		}

		const tr = new HBox({
			cls: 'group',
			content: [
				g.icon ? new Icon({ id: "icon", iconId: g.icon }) : null,
				new VBox( { content: [
					new SimpleText({ cls: "title", text: g.title }),
					g.desc ? new SimpleText({ cls: "desc", text: g.desc }) : null,
				]}),
				g.collapsible? new Button({ icon: updown_icon, click: (e) => toggle(tr) }) : null,
			]
		});

		tr.setClass("collapsible", g.collapsible );
		return tr;
	}

	/**
	 * 
	 */
	
	makePropertyRow( item: PropertyValue ) {

		let use_hdr = true;

		// If boolean create checkbox
		let editor: Component;
		let value = isFunction(item.value) ? item.value( item.name ) : item.value;
		item.value = value;

		if (item.type === 'boolean') {
			editor = new Input({ 
				type: "checkbox", 
				id: item.name,
				name: item.name, 
				checked: value as boolean, 
				dom_events: {
					change: ( e: Event ) => {
						item.callback?.( item.name, (editor.dom as HTMLInputElement).checked );
					}
				}
			});
			
		}
		else if (item.type === 'options') {
			editor = new Select( {
				value: value as string,
				id: item.name,
				items: item.options,
				name: item.name,
				change: ( e: EvChange ) => {
					item.callback?.( item.name, e.value );
				}
			});
		}
		else if (item.type === 'password') {
			editor = new Input({ 
				type: 'password',
				id: item.name,
				name: item.name, 
				value: value as string, 
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						item.callback?.( item.name, (editor as Input).getValue() );
					}
				}
			});
		}
		else if (item.type === 'number') {
			editor = new Input({ 
				type: 'number', 
				id: item.name,
				name: item.name, 
				value: value as string,
				step: item.step,
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						item.callback?.( item.name, (editor as Input).getNumValue() );
					}
				},
				change: ( ) => {
					if( item.live ) {
						item.callback?.( item.name, (editor as Input).getNumValue() );
					}
				}
			});
		}
		else if (item.type === 'label') {
			editor = new Label({ 
				id: item.name,
				text: value as string, 
			});
		}
		else if (item.type === 'button') {
			use_hdr = false;
			editor = new Button({ 
				id: item.name,
				label: value as string, 
				click: ( ) => {
					item.callback?.( item.name, '' );
				}
			});
		}
		else {
			editor = new Input({ 
				type: 'text', 
				id: item.name,
				name: item.name, 
				value: value as string,
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						item.callback?.( item.name, (editor as Input).getValue() );
					}
				}
			});
		}

		return new HBox({
			cls: 'row',
			content: [
				use_hdr ? new Component({ cls: 'cell hdr', content: item.title ?? item.name, tooltip: item.desc }) : null,
				new Component({ cls: 'cell', tag: "label", attrs: { "labelFor": item.name }, content: editor })
			]
		});
	}

	/**
	 * 
	 */

	setPropValue( name: string, value: any ) {
		const all = this.groups.flatMap( x => [ ...x.items ] ) ;
		const item = all.find( x => x.name==name );
		if( !item ) {
			return;
		}

		if (item.type === 'boolean') {
			const editor = this.root.query<Input>( '#'+item.name );
			if( editor ) {
				editor.setCheck( value as boolean );
			}
		}
		else if (item.type === 'options') {
			const editor = this.root.query<Select>( '#'+item.name );
			if( editor ) {
				editor.setValue( value as string );
			}
		}
		else if (item.type === 'number') {
			const editor = this.root.query<Input>( '#'+item.name );
			if( editor ) {
				editor.setNumValue( value as number, -2 );
			}
		}
		else {
			const editor = this.root.query<Input>( '#'+item.name );
			if( editor ) {
				editor.setValue( value as string );
			}
		}
	}
}

