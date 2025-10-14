/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file sizer.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, ComponentProps, componentFromDOM } from '../../core/component';
import { class_ns, Point } from '../../core/core_tools';

import "./sizer.module.scss"

/**
 * 
 */

export interface EvSizeChange extends ComponentEvent {
	size: number;
}

interface CSizerEvent extends ComponentEvents {
	resize: EvSizeChange;
	start: ComponentEvent;
	stop: ComponentEvent;
}

type SizerType = "left" | "top" | "right" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" ;

/**
 * 
 */


@class_ns( "x4" )
export class CSizer extends Component<ComponentProps,CSizerEvent> {

	private _type: SizerType;
	private _ref: Component;
	private _delta: Point;

	constructor( type: SizerType, target?: Component ) {
		super( {} );

		this._type = type;
		this.addClass( type );

		this.addDOMEvent( "pointerdown", ( e: PointerEvent ) => {
			this.setCapture( e.pointerId );
			this._ref = target ?? componentFromDOM( this.dom.parentElement );

			this._delta = {x:0,y:0};
			const rc = this._ref.getBoundingRect();

			if( this._type.includes("left") ) {
				this._delta.x = e.pageX-rc.left;
			}
			else {
				this._delta.x = e.pageX-(rc.left+rc.width);
			}

			if( this._type.includes("top") ) {
				this._delta.y = e.pageY-rc.top;
			}
			else {
				this._delta.y = e.pageY-(rc.top+rc.height);
			}

			this.fire( "start", { })
		});

		this.addDOMEvent( "pointerup", ( e: PointerEvent ) => {
			this.fire( "stop", { })
			this.releaseCapture( e.pointerId );
			this._ref = null;
		});

		this.addDOMEvent( "pointermove", ( e: PointerEvent ) => {
			this._onMouseMove( e );
		});
	}

	private _onMouseMove( e: PointerEvent ) {
		if( !this._ref ) {
			return;
		}

		const pt = { x: e.pageX-this._delta.x, y: e.pageY-this._delta.y };
		const rc = this._ref.getBoundingRect( );

		let nr: any = {};
		let horz = true;

		if( this._type.includes("top") ) {
			nr.top = pt.y,
			nr.height = (rc.top+rc.height)-pt.y;
			horz = false;
		}

		if( this._type.includes("bottom") ) {
			//nr.top = rc.top;
			nr.height = (pt.y-rc.top);
			horz = false;
		}

		if( this._type.includes("left") ) {
			nr.left = pt.x;
			nr.width = ((rc.left+rc.width)-pt.x);
		}

		if( this._type.includes("right") ) {
			nr.width = (pt.x-rc.left);
			}

		this._ref.setStyle( nr );
		//this._ref.setStyleValue( "flexGrow", 0 );

		const nrc = this._ref.getBoundingRect( );
		this.fire( "resize", { size: horz ? nrc.width : nrc.height })

		e.preventDefault( );
		e.stopPropagation( );
	}
}