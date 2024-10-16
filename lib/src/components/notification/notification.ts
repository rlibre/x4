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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { ComponentProps } from '../../core/component.js';
import { class_ns, Rect, UnsafeHtml } from '../../core/core_tools.js';

import { Popup } from '../popup/popup.js';
import { HBox, VBox } from '../boxes/boxes.js';
import { Icon } from '../icon/icon.js';
import { Label } from '../label/label.js';
import { Button } from '../button/button.js';

import "./notification.module.scss";

import def_icon from "./circle-check-solid.svg";
import danger_icon from "./circle-exclamation-solid.svg"
import spin_icon from "./circle-notch-light.svg";
import close_icon from "./xmark-sharp-light.svg";

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
	constructor( props: NotificationProps ) {
		super( { } );

		let icon = props.iconId;
		if( !icon ) {
			if( props.loading ) {
				icon = spin_icon;
				this.addClass( "")
			}
			else if( props.mode=="danger" ) {
				icon = danger_icon;
			}
			else {
				icon = def_icon;
			}
		}

		this.addClass( props.mode );

		const _icon = new Icon( { iconId: icon } );
		if( props.loading ) {
			_icon.addClass( "rotate" );
			this.props.modal = true;
		}

		this.setContent( new HBox( { 
			content: [
				_icon,
				new VBox( { cls: "body", content: [ 
					new Label( { cls: "title", text: props.title } ),
					new Label( { cls: "text", text: props.text } ),
				] }),
				new Button( { cls: "outline", icon: close_icon, click: ( ) => {
					this.close( );
				} } )
			]
		}) );
	}

	close( ) {
		this.clearTimeout( "close" );
		super.close( );
	}

	display( time_in_s = 0 ) {
		const r = new Rect( 0, 0, window.innerWidth, window.innerHeight );
		this.displayNear( r, "bottom right", "bottom right", { x: -20, y: -10 } );

		if( time_in_s ) {
			this.setTimeout( "close", time_in_s*1000, ( ) => { 
				this.close() 
			} );
		}
	}
}


