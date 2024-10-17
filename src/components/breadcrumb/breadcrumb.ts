/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file breadcrumb.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '@core/core_tools.js';
import { BoxProps, Button, HBox, Icon } from '../components';
import { Component, ComponentEvents, EvClick } from '@core/component.js';
import { EventCallback } from '@core/core_events.js';

import "./breadcrumb.scss"

import icon_sep from "./chevron-right.svg"

/**
 * Breadcrumb events
 */

interface BreadcrumbEvents extends ComponentEvents {
	click: EvClick;	// context = item name
}

/**
 * 
 */

interface BreadcrumbElement {
	icon?: string;
    name:  string;
    label: string;
}

/**
 * 
 */

interface BreadcrumbsProps extends BoxProps{
	items: BreadcrumbElement[];
	click?: EventCallback<EvClick>;
}

/**
 * 
 */

@class_ns( "x4" )
export class Breadcrumbs extends HBox<BreadcrumbsProps,BreadcrumbEvents> {

	constructor( props: BreadcrumbsProps ) {
		super( props );

		this.mapPropEvents( props, "click" );
		
		const items: Component[] = [
		];
		
		props.items?.map( (x: BreadcrumbElement, idx ) => {
			items.push( new Button( {
				label: x.label,
				icon: x.icon,
				click: ( ) => {
					this.fire( "click", { context: x.name } );
				}
			}) );

			if( idx!=props.items.length-1 ) {
				items.push( new Icon( { iconId: icon_sep } ) );
			}
		});

		this.setContent( items );
	}
}

