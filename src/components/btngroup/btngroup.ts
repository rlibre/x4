/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file btngroup.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, Flex } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { class_ns, isString } from '../../core/core_tools';
import { _tr } from '../../core/core_i18n'

import { Button } from '../button/button';
import { Box } from '../boxes/boxes.js';
import { Label } from '../label/label.js';
import { EvBtnClick } from '../dialog/dialog.js';

import "./btngroup.module.scss"

/**
 * accept "ok" or "ok.<classname>"
 */

type predefined = 		`ok${ "" | `.${string}`}` 
					| 	`cancel${ "" | `.${string}`}` 
					| 	`yes${ "" | `.${string}`}`
					|	`no${ "" | `.${string}`}`
					| 	`retry${ "" | `.${string}`}`
					| 	`abort${ "" | `.${string}`}`
					| 	"-";	// - = flex

export type BtnGroupItem = predefined | Button | Label;

interface BtnGroupEvents extends ComponentEvents {
	btnclick: EvBtnClick;
}

interface BtnGroupProps extends Omit<ComponentProps,"content"> {
	align?: "left" | "center" | "right";	// left default
	vertical?: boolean;					
	items: BtnGroupItem[];
	reverse?: boolean,
	btnclick?: EventCallback<EvBtnClick>;
}

/**
 * 
 */

@class_ns( "x4" )
export class BtnGroup extends Box<BtnGroupProps,BtnGroupEvents> {

	constructor( props: BtnGroupProps ) {
		super( props );

		if( props.align ) {
			this.addClass( "align-"+props.align );
		}

		this.addClass( props.vertical ? "x4vbox" : "x4hbox" );

		if( props.items ) {
			this.setButtons( props.items );
		}

		this.mapPropEvents( props, "btnclick" );
	}

	/**
	 * 
	 * @param btns 
	 */

	setButtons( btns: BtnGroupItem[] ) {

		this.clearContent( );

		const childs: Component[] = [];

		btns?.forEach( (b: string | Component) => {

			if( b==="-" ) {
				b = new Flex( );
			}
			else if( isString(b) ) {
				let title: string;

				const nm = (b as predefined);

				let [txt,cls] = nm.split( "." );
								
				switch( txt as predefined ) {
					case "ok": 		title = _tr.global.ok; break;
					case "cancel": 	title = _tr.global.cancel; break;
					case "abort":	title = _tr.global.abort; break;
					case "no":		title = _tr.global.no; break;
					case "yes":		title = _tr.global.yes; break;
					case "retry":	title = _tr.global.retry; break;
				}

				b = new Button( { cls, label: title, click: ( ) => {
					this.fire( "btnclick", {button:txt as string} )
				} } );
			}

			childs.push( b );
		});

		super.setContent( childs );
	}
}