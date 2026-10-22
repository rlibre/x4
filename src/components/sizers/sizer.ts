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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, ComponentProps, componentFromDOM } from '../../core/component';
import { Point } from '../../core/core_tools';

import "./sizer.module.scss"

/**
 * 
 */

export interface EvSizeChange extends ComponentEvent {
	size: number;	// compat
	width: number;
	height: number;
}

interface CSizerEvent extends ComponentEvents {
	resize: EvSizeChange;
	start: ComponentEvent;
	stop: ComponentEvent;
}

type SizerType = "left" | "top" | "right" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right" 
					| "hsize-prev" | "hsize-next" | "vsize-prev" | "vsize-next";

/**
 * 
 */


export class CSizer extends Component<ComponentProps,CSizerEvent> {
	static classPrefix = "x4";

	private _type: SizerType;
	private _ref: Component;
	private _delta: Point;

	constructor( type: SizerType, target?: Component ) {
		super( {} );

		this._type = type;
		this.addClass( type );
		
		this.addDOMEvent( "pointerdown", ( e: PointerEvent ) => {
			this.setCapture( e.pointerId );

			let targ = target;
			if( !targ ) {
				if( type=='hsize-next' || type=='vsize-next' ) {
					targ = this.nextElement( );
				}
				else if( type=='hsize-prev' || type=='vsize-prev' ) {
					targ = this.prevElement( );
				}
			}

			this._ref = targ ?? componentFromDOM( this.dom.parentElement );

			this._delta = {x:0,y:0};
			const rc = this._ref.getBoundingRect();

			if( this._type=="hsize-next" || this._type.includes("left") ) {
				this._delta.x = e.pageX-rc.left;
			}
			else {
				this._delta.x = e.pageX-(rc.left+rc.width);
			}

			if( this._type=="vsize-next" || this._type.includes("top") ) {
				this._delta.y = e.pageY-rc.top;
			}
			else {
				this._delta.y = e.pageY-(rc.top+rc.height);
			}

			this.fire( "start", { })
			e.preventDefault( );
		});

		this.addDOMEvent( "pointerup", ( e: PointerEvent ) => {
			this.fire( "stop", { })
			this.releaseCapture( e.pointerId );
			this._ref = null;
		});

		// cancelled by the browser (a touch taken by a scroll, a gesture...): no pointerup will
		// come, the moves after are not a resize. The browser releases the capture itself
		this.addDOMEvent( "pointercancel", ( ) => {
			if( this._ref ) {
				this.fire( "stop", { })
				this._ref = null;
			}
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
		let size = 0;

		//const center = this._ref.hasClass("center");
		//if( center ) {
		//	const orc = this._ref.getBoundingRect( );
		//	this._ref.removeClass("center");
		//
		//	nr.left = orc.left;
		//	nr.top = orc.top;
		//}

		if( this._type.includes("top") ) {
			nr.top = pt.y,
			size = nr.height = (rc.top+rc.height)-pt.y;
			horz = false;
		}
		
		if( this._type=="vsize-next" ) {
			size = nr.height = (rc.top+rc.height)-pt.y;
			horz = false;
		}
		
		if( this._type.includes("bottom") || this._type=='vsize-prev' ) {
			size = nr.height = (pt.y-rc.top);
			horz = false;
		}
		
		if( this._type.includes("left") ) {
			nr.left = pt.x;
			size = nr.width = ((rc.left+rc.width)-pt.x);
		}
		
		if( this._type=="hsize-next" ) {
			size = nr.width = ((rc.left+rc.width)-pt.x);
		}
		
		if( this._type.includes("right") || this._type=='hsize-prev' ) {
			size = nr.width = (pt.x-rc.left);
		}

		// between two boxes: the neighbour sized by the basis of its flex; without a neighbour
		// (the sizer first or last in its box), the box itself by its size
		if( this._type.includes("-prev") || this._type.includes("-next") ) {
			const neighbour = this._type.includes("-prev") ? this.prevElement( ) : this.nextElement( );
			if( neighbour ) {
				this._ref.setStyleValue( "flex", `0 0 ${size}px` );
			}
			else {
				this._ref.setStyle( nr );
			}
		}
		else {
			this._ref.setStyle( nr );
		}

		const nrc = this._ref.getBoundingRect( );
		this.fire( "resize", { size, width: nrc.width, height: nrc.height })

		e.preventDefault( );
		e.stopPropagation( );
	}
}

export class HSizer extends CSizer {
	static classPrefix = "x4";

	constructor( next = true ) {
		super( next ? "hsize-next" : "hsize-prev" );
	}
}

export class VSizer extends CSizer {
	static classPrefix = "x4";

	constructor( next = true ) {
		super( next ? "vsize-next" : "vsize-prev" );
	}
}