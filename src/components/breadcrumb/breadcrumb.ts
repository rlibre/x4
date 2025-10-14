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

import { class_ns } from '../../core/core_tools';
import { parseRoute, Router } from '../../core/core_router';

import { BoxProps, Button, HBox, Icon } from '../components';
import { Component, ComponentEvents, EvClick } from '../../core/component';
import { EventCallback } from '../../core/core_events';

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
	name?: string;
	icon?: string;
    label: string;
	click?: ( name: string ) => void;
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

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	setItems( elements: BreadcrumbElement[ ] ) {

		const items = elements.map( itm => {
			return new Button( {
				label: itm.label,
				icon: itm.icon,
				click: ( ) => {
					if( itm.click ) {
						itm.click( itm.name );
					}
					else {
						this.fire( "click", { context: itm.name } );
					}
				}
			})
		});

		this.setContent( items );
	}
}

