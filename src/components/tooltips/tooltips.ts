/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file tooltips.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, wrapDOM } from '../../core/component';
import { class_ns, ITipHandler, Point, Rect, Timer, UnsafeHtml, unsafeHtml } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { Popup, PopupProps } from '../popup/popup';
import { Icon } from '../icon/icon';

import "./tooltips.scss"

import icons from "../assets/icons"


let last_hit: HTMLElement = null;
let tooltip: Tooltip = null;
let mouse_pos: Point = {x:0, y:0 };

const timer = new Timer( );

export function initTooltips( ) {

	document.addEventListener( "mouseenter", ( ev: MouseEvent ) => {
		if( ev.target===document ) {
			return;
		}
		
		const c = wrapDOM( ev.target as HTMLElement );
		let tt = c.getAttribute( "tooltip" );
		const ifx = c.queryInterface("tip-handler" ) as ITipHandler;
		if( ifx ) {
			tt = ifx.getTip( );
		}

		if( tt ) {
			last_hit = ev.target as HTMLElement;
			const rc = c.getBoundingRect( );
			showTT( tt, rc, { x:ev.pageX,y:ev.pageY } );
		}

	}, true );

	document.addEventListener( "mouseleave", ( ev: MouseEvent ) => {
		//console.log( "leave", ev.target );
		if( last_hit && ev.target==last_hit ) {
			last_hit = null;
			closeTT( );
		}

	}, true );

	document.addEventListener( "mousemove", ( ev: MouseEvent ) => {
		if( last_hit ) {
			mouse_pos = { x:ev.pageX, y:ev.pageY }
		}
	});
}

function showTT( text: string, rc: Rect, pt: Point ) {
	if( !tooltip ) {
		tooltip = new Tooltip( { } );
	}

	timer.setTimeout( "update", 300, ( ) => {
		tooltip.setText( unsafeHtml(text) );

		let y = mouse_pos.y;
		if( rc.contains(mouse_pos) ) {
			y = rc.bottom;
		}

		//tooltip.displayNear( rc, "top left", "bottom left", {x:0,y:4} );
		tooltip.displayAt( mouse_pos.x+17, y+5 );
	} );
}

function closeTT( ) {
	tooltip.show( false );
	timer.clearTimeout( "update" );
}

/**
 * 
 * @cssvar
 * ```
 * --tooltip-caption-background
 * --tooltip-caption-color
 * --tooltip-icon-background
 * --tooltip-icon-color
 * --tooltip-background
 * --tooltip-color
 * --tooltip-border
 * ```
 */

@class_ns( "x4" )
class Tooltip extends Popup {

	constructor( props: PopupProps ) {
		super( props );

		this.setContent( 
			new HBox( {content: [
				new Icon( { iconId: icons.question } ),
				new Component( { id: "text" } )
			]} )
		);
	}

	/**
	 * 
	 */

	setText( text: string|UnsafeHtml )	{
		this.query( "#text" ).setContent( text );
	}
}