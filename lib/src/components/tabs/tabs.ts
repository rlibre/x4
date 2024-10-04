/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file tabs.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/
import { Component, ComponentEvents, ComponentProps, EvClick } from '../../core/component';
import { CoreEvent } from '../../core/core_events';

import { Button, ButtonProps } from '../button/button';
import { HBox, VBox, StackBox } from '../boxes/boxes';

import "./tabs.module.scss"

/**
 * 
 */


export interface TabItem {
	name: string;
	title: string;
	icon?: string;
	tab: Component;
}


class CTab extends Button {
	constructor( props: ButtonProps, item: TabItem ) {
		super( props );

		this.addClass( "outline" );
		this.setIcon( item.icon );
		this.setText( item.title );
		this.setData( "tabname", item.name );
	}
}

/**
 * 
 */

interface TablistClickEvent extends CoreEvent {
	name: string;
}

interface TablistProps extends ComponentProps {
	click: ( ev: TablistClickEvent ) => void;
}

interface TablistEvents extends ComponentEvents {
	click: TablistClickEvent;
}

/**
 * bar containing buttons
 */
class CTabList extends HBox<TablistProps,TablistEvents> {

	private _selitem: Button;
	private _selection: string;
	
	constructor( props: TablistProps, content: TabItem[] ) {
		super( props );

		const tabs = content.map( tab => {
			return new CTab( {
				click: ( ev ) => this._on_click( ev ),
			}, tab );
		})

		this.mapPropEvents( props, "click" );
		this.setContent( tabs );
	}

	private _on_click( ev: EvClick ) {
		const name = (ev.source as Component).getData( "tabname" );
		this.fire( "click", {name} );
	}

	select( name: string ) {
		const tab = this.query<Button>( `[data-tabname="${name}"]` );
		if( this._selitem ) {
			this._selitem.setClass( "selected", false );
		}

		this._selitem = tab;
		this._selection = name;
		
		if( this._selitem ) {
			this._selitem.setClass( "selected", true );
		}
	}
}


/**
 * 
 */

interface TabsProps extends Omit<ComponentProps,"content"> {
	default: string;
	items: TabItem[]
}


export class Tabs extends VBox<TabsProps> {

	private _list: CTabList;
	private _stack: StackBox;

	constructor( props: TabsProps ) {
		super( props );

		const pages = props.items?.map( x => {
			return {
				name: x.name,
				content: x.tab ,
			}
		});
		
		this.setContent( [
			this._list = new CTabList( { 
				click: ( ev ) => this._onclick( ev ) }, 
				props.items 
			),
			this._stack = new StackBox( { 
				cls: "body x4flex", 
				default: props.default,
				items: pages,  
			} ),
		]);

		if( props.default ) {
			this.selectTab( props.default );
		}
	}

	selectTab( name: string ) {
		this._list.select( name );
		this._stack.select( name );
	}

	private _onclick( ev: TablistClickEvent ) {
		this.selectTab( ev.name );
	}
}

