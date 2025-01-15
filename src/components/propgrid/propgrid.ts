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
import { Input } from "../input/input"
import { ListItem } from "../listbox/listbox"
import { SimpleText } from "../label/label"
import { isFunction } from '../../core/core_tools';

import "./progrid.module.scss"
import folder_open from "./folder-open.svg"
import folder_close from "./folder-closed.svg"

type IValue = boolean | number | string;
type IValueCB = ( name: string) => IValue;

interface PropertyValue {
	group: string;
	name: string;
	type: 'boolean' | 'number' | 'string' | 'password' | 'options';
	title?: string;
	value: IValue | IValueCB;
	options?: ListItem[];
	callback: ( name: string, value: any ) => void;
}

export interface PropertyProps extends ComponentProps {
	data: PropertyValue[];
}

export class PropertyGrid extends VBox {

	private root: Component;
	private properties: PropertyValue[];

	constructor(props: PropertyProps) {
		super(props);

		this.root = new Component({ cls: "root" });
		this.setContent( this.root );

		this._fillSettings( props.data );
	};

	/**
	 * 
	 */

	private async _fillSettings( data: PropertyValue[] ) {

		this.properties = data;

		interface g {
			name: string;
			group: Component;
			items: Component[];
		}

		let groups = new Map<string, g>();

		for( const prop of data ) {
			const nme = prop.group ?? "other";
			let grp = groups.get(nme);

			if (!grp) {
				grp = {
					name: nme,
					group: this.makeGroupHeader(nme, false),
					items: []
				}

				groups.set(nme, grp);
			}

			grp.items.push( await this.makePropertyRow(prop));
		}

		const sorted = [...groups.values()].sort((a, b) => { return a.name > b.name ? 1 : -1 });
		this.root.setContent(sorted.flatMap(x => [x.group, ...x.items]));
	}

	/**
	 * Gets the html of a group header row
	 * @param {string} displayName - The group display name
	 * @param {boolean} isCollapsible - Whether the group should support expand/collapse
	 */

	makeGroupHeader(displayName: string, isCollapsible: boolean) {

		const toggle = (e: Component) => {

			let parent = e.parentElement();
			while (parent && !parent.hasClass("group")) {
				parent = parent.parentElement();
			}

			let visible: boolean;
			if (!e.hasClass("collapsed")) {
				e.addClass("collapsed");
				(e as Button).setIcon(folder_close);
				visible = false;
			}
			else {
				e.removeClass("collapsed");
				(e as Button).setIcon(folder_open);
				visible = true;
			}

			let p = parent.nextElement();
			while (p && p.hasClass("row")) {
				p.show(visible);
				p = p.nextElement();
			}
		}

		const tr = new HBox({
			cls: 'group',
			content: [
				new Button({ icon: folder_open, click: (e) => toggle(e.source as Component) }),
				new SimpleText({ text: displayName }),
			]
		});

		tr.setClass("collapsible", isCollapsible);
		return tr;
	}

	/**
	 * 
	 */
	
	makePropertyRow(prop: PropertyValue) {

		// If boolean create checkbox
		let editor: Component;
		let value = isFunction(prop.value) ? prop.value( prop.name ) : prop.value;
		prop.value = value;

		if (prop.type === 'boolean') {
			editor = new Input({ 
				type: "checkbox", 
				id: prop.group + "-" + prop.name,
				name: prop.name, 
				checked: value as boolean, 
				change: ( e: EvChange ) => {
					prop.callback( prop.name, e.value );
				}
			});
			
		}
		else if (prop.type === 'options') {
			editor = new Select( {
				value: value as string,
				id: prop.group + "-" + prop.name,
				items: prop.options,
				name: prop.name,
				change: ( e: EvChange ) => {
					debugger;
					prop.callback( prop.name, e.value );
				}
			});
		}
		else if (prop.type === 'password') {
			editor = new Input({ 
				type: 'password',
				id: prop.group + "-" + prop.name,
				name: prop.name, 
				value: value as string, 
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						prop.callback( prop.name, (editor as Input).getValue() );
					}
				}
			});
		}
		else if (prop.type === 'number') {
			editor = new Input({ 
				type: 'number', 
				id: prop.group + "-" + prop.name,
				name: prop.name, 
				value: value as string,
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						prop.callback( prop.name, (editor as Input).getValue() );
					}
				}
			});
		}
		else {
			editor = new Input({ 
				type: 'text', 
				id: prop.group + "-" + prop.name,
				name: prop.name, 
				value: value as string,
				focus: ( e: EvFocus ) => {
					if( e.focus_out ) {
						prop.callback( prop.name, (editor as Input).getValue() );
					}
				}
			});
		}

		return new HBox({
			cls: 'row',
			content: [
				new Component({ cls: 'cell hdr', content: prop.title ?? prop.name }),
				new Component({ cls: 'cell', content: editor })
			]
		});
	}

	/**
	 * 
	 */

	setPropValue( name: string, value: any ) {
		const prop = this.properties.find( x => x.name==name );
		if( !prop ) {
			return;
		}

		if (prop.type === 'boolean') {
			const editor = this.root.query<Input>( '#'+prop.group+"-"+prop.name );
			if( editor ) {
				editor.setCheck( value as boolean );
			}
		}
		else if (prop.type === 'options') {
			const editor = this.root.query<Select>( '#'+prop.group+"-"+prop.name );
			if( editor ) {
				editor.setValue( value as string );
			}
		}
		else if (prop.type === 'number') {
			const editor = this.root.query<Input>( '#'+prop.group+"-"+prop.name );
			if( editor ) {
				editor.setNumValue( value as number );
			}
		}
		else {
			const editor = this.root.query<Input>( '#'+prop.group+"-"+prop.name );
			if( editor ) {
				editor.setValue( value as string );
			}
		}
	}
}

