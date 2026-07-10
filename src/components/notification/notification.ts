/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file notification.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { ComponentProps } from '../../core/component';
import { class_ns, Rect, UnsafeHtml } from '../../core/core_tools';

import { Popup } from '../popup/popup';
import { HBox, VBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { Label } from '../label/label';
import { Button } from '../button/button';

import icons from "../assets/icons"

import "./notification.module.scss";

/**
 * 
 */

interface NotificationProps extends ComponentProps {
	loading?: boolean;
	iconId?: string;
	closable?: boolean;
	mode?: "success" | "danger";

	title: string;
	text: string | UnsafeHtml;
}

/**
 * 
 */

@class_ns( "x4" )
export class Notification extends Popup {
	private static list = new Set<Notification>( );

	constructor( props: NotificationProps ) {
		super( { } );

		let icon = props.iconId;
		if( !icon ) {
			if( props.loading ) {
				icon = icons.loading;
				this.addClass( "")
			}
			else if( props.mode=="danger" ) {
				icon = icons.danger;
			}
			else {
				icon = icons.checked;
			}
		}

		this.addClass( props.mode );

		const _icon = new Icon( { iconId: icon } );
		if( props.loading ) {
			_icon.addClass( "rotate" );
			//this.props.modal = true;
		}

		this.setContent( new HBox( { 
			content: [
				_icon,
				new VBox( { cls: "body", content: [ 
					props.title ? new Label( { cls: "title", text: props.title } ) : null,
					new Label( { cls: "text", text: props.text } ),
				] }),
				props.closable ? new Button( { cls: "outline", icon: icons.close_box, click: ( ) => {this.close( );} } ) : null
			]
		}) );
	}

	close( ) {
		Notification.list.delete( this );
		this.clearTimeout( "close" );
		super.close( );
	}

	display( time_in_s = 0 ) {
		Notification.list.add( this );
		if( time_in_s ) {
			this.setTimeout( "close", time_in_s*1000, ( ) => { 
				this.close() 
			} );
		}

		Notification.updatePositions( )
	}

	static updatePositions( ) {
		const r = new Rect( 0, 0, window.innerWidth, window.innerHeight );

		for( const n of this.list ) {
			n.displayNear( r, "bottom right", "bottom right", { x: -20, y: -10 } );
			const nr = n.getBoundingRect( );
			r.height -= nr.height+10;
			if( r.height<10 ) {
				r.height = 10;
			}
		}

	}
}


