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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, componentFromDOM, wrapDOM } from '../../core/component';
import { class_ns, ITipHandler, Point, Rect, Timer, UnsafeHtml, unsafeHtml } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { Popup, PopupProps } from '../popup/popup';
import { Icon } from '../icon/icon';

import "./tooltips.scss"

import icon from "./comments-question.svg"


let last_hit: HTMLElement = null;
let tooltip: Tooltip = null;

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

	document.addEventListener( "mouseleave", ( ev: Event ) => {
		//console.log( "leave", ev.target );

		if( last_hit && ev.target==last_hit ) {
			last_hit = null;
			closeTT( );
		}

	}, true );
}

function showTT( text: string, rc: Rect, pt: Point ) {
	if( !tooltip ) {
		tooltip = new Tooltip( { } );
	}

	timer.setTimeout( null, 300, ( ) => {
		tooltip.setText( unsafeHtml(text) );
		//tooltip.displayNear( rc, "top left", "bottom left", {x:0,y:4} );
		tooltip.displayAt( pt.x+17, pt.y+17 );
	} );
}

function closeTT( ) {
	tooltip.show( false );
	timer.clearTimeout( null );
}

/**
 * 
 */

@class_ns( "x4" )
class Tooltip extends Popup {

	constructor( props: PopupProps ) {
		super( props );

		this.setContent( 
			new HBox( {content: [
				new Icon( { iconId: icon } ),
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