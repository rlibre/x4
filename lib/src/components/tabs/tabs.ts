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
import { class_ns } from '../../core/core_tools';

/**
 * 
 */


export interface TabItem {
	name: string;
	title: string;
	icon?: string;
	content: Component;
}

/**
 * 
 */

@class_ns( "x4" )
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

@class_ns( "x4" )
class CTabList extends HBox<TablistProps,TablistEvents> {

	private _selitem: Button;
	
	constructor( props: TablistProps, items: TabItem[] ) {
		super( props );

		this.setItems( items );
		this.mapPropEvents( props, "click" );
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
		
		if( this._selitem ) {
			this._selitem.setClass( "selected", true );
		}
	}


	setItems( items: TabItem[ ] ) {
		this.clearContent( );
		items.forEach( tab => {
			this.addItem( tab );
		})
	}

	addItem( tab: TabItem ) {
		this.appendContent( new CTab( {
			click: ( ev ) => this._on_click( ev ),
		}, tab ) );
	}

	getTabCount( ) {
		return this.dom.children.length;
	}
}


/**
 * 
 */

interface TabsProps extends Omit<ComponentProps,"content"> {
	default: string;
	items: TabItem[]
}

/**
 * 
 */

@class_ns( "x4" )
export class Tabs extends VBox<TabsProps> {

	private _list: CTabList;
	private _stack: StackBox;
	private _current: string;

	constructor( props: TabsProps ) {
		super( props );

		const pages = props.items?.map( x => {
			return {
				name: x.name,
				content: x.content ,
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
		this._current = name;
	}

	private _onclick( ev: TablistClickEvent ) {
		this.selectTab( ev.name );
	}

	/**
	 * 
	 */
	
	getTab( name: string ) {
		return this._stack.getPage( name );
	}

	getCurTab( ) {
		return this._current;
	}

	/**
	 * 
	 */

	addTab( item: TabItem ) {
		this._list.addItem( item );
		this._stack.addItem( { name: item.name, content: item.content } );

		if( this._list.getTabCount( )==1 ) {
			this.selectTab( item.name );
		}
	}
}

