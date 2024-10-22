/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file popup.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, ComponentProps, componentFromDOM, makeUniqueComponentId } from "../../core/component"
import { CSizer } from '../sizers/sizer';
import { Rect, Point, class_ns } from '../../core/core_tools.js';

import "./popup.module.scss"


export interface PopupEvents extends ComponentEvents {
	closed: ComponentEvent;
	opened: ComponentEvent;
}

export interface PopupProps extends ComponentProps {
	modal?: boolean;
	autoClose?: boolean | string;
	sizable?: boolean;
	movable?: boolean;
}


let modal_mask: Component;
let modal_count = 0;

let modal_stack: Popup[] = [];
let autoclose_list: Popup[] = [];
let popup_list:  Popup[] = [];



/**
 * 
 */

@class_ns( "x4" )
export class Popup<P extends PopupProps = PopupProps, E extends PopupEvents = PopupEvents> extends Component<P,E> {

	private _isopen = false;
	private _isshown = false;

	constructor( props: P ) {
		super( props );

		if( this.props.sizable ) {
			this._createSizers( );
		}
	}

	displayNear( rc: Rect, dst = "top left", src = "top left", offset = {x:0,y:0} ) {

		this.setStyle( { left: "0px", top: "0px" } );	// avoid scrollbar
		this._show( );									// to compute size
		
		let rm = this.getBoundingRect();

		let xref = rc.left;
		let yref = rc.top;

		if( src.indexOf('right')>=0 ) {
			xref = (rc.left+rc.width);
		}
		else if( src.indexOf('center')>=0 ) {
			xref = rc.left + rc.width/2;
		}

		if( src.indexOf('bottom')>=0 ) {
			yref = rc.bottom;
		}
		else if( src.indexOf('middle')>=0 ) {
			yref = rc.top + rc.height/2;
		}

		let halign = 'l';
		if (dst.indexOf('right') >= 0) {
			xref -= rm.width;
		}
		else if( dst.indexOf('center')>=0 ) {
			xref -= rm.width/2;
		}

		let valign = 't';
		if (dst.indexOf('bottom') >= 0) {
			yref -= rm.height;
		}
		else if( dst.indexOf('middle')>=0 ) {
			yref -= rm.height/2;
		}
		
		if (offset) {
			xref += offset.x;
			yref += offset.y;
		}

		// our parent is body, so take care of the scroll position
		xref += document.scrollingElement.scrollLeft;
		yref += document.scrollingElement.scrollTop;

		this.displayAt( xref, yref );
	}

	/**
	 * 
	 */

	displayCenter( ) {
		this.displayNear( new Rect( window.innerWidth/2, window.innerHeight/2, 0, 0 ), "center middle" );
	}

	/**
	 * 
	 */

	displayAt( x: number, y: number ) {
		//TODO: check is already visible
		this.setStyle( {
			left: x+"px",
			top: y+"px",
		})

		this._show( );

		const rc = this.getBoundingRect( );
		const width = window.innerWidth - 16;
		const height = window.innerHeight - 16;
		
		if( rc.right>width ) {
			this.setStyleValue( "left", width-rc.width );
		}

		if( rc.bottom>height ) {
			this.setStyleValue( "top", height-rc.height );
		}

		if( this.props.movable ) {
			const movers = this.queryAll( ".caption-element" );
			movers.forEach( m => new CMover(m,this) );

			if( this.hasClass("popup-caption") ) {
				new CMover(this,this);
			}		
		}

		this.fire( "opened", {} );
	}

	private _show( ) {
		
		if( this.props.modal && !this._isshown ) {
			this._showModalMask( );
			modal_stack.push( this );
			modal_count++;
		}

		this._isshown = true;
		
		if( this.props.autoClose ) {
			if( autoclose_list.length==0 ) {
				document.addEventListener( "pointerdown", this._dismiss );
			}

			autoclose_list.push( this );
			this.setData( "close", this.props.autoClose===true ? makeUniqueComponentId() : this.props.autoClose );
		}

		popup_list.push( this );
		document.body.appendChild( this.dom );

		this.show( );
	}

	override show( show = true ) {
		this._isopen = show;
		super.show( show );
	}

	isOpen( ) {
		return this._isopen;
	}

	/**
	 * 
	 */

	close( ) {
		document.body.removeChild( this.dom );

		// remove from popup list
		const idx = popup_list.indexOf( this );
		console.assert( idx>=0 );
		popup_list.splice( idx, 1 );

		// remove from auto close list
		if( this.props.autoClose ) {
			const idx = autoclose_list.indexOf( this );
			if( idx>=0 ) {
				autoclose_list.splice( idx, 1 );
				if( autoclose_list.length==0 ) {
					document.removeEventListener( "pointerdown", this._dismiss );
				}
			}
		}

		// update mask
		if( this.props.modal ) {
			const top = modal_stack.pop( );
			console.assert( top==this );
			this._updateModalMask( );
		}

		this._isshown = false;
		this.fire( "closed", {} );
	}

	/**
	 * binded
	 */

	private _dismiss = ( e: UIEvent ) => {
		const onac = autoclose_list.some( x=> x.dom.contains(e.target as Node) )
		if( onac ) {
			return;
		}

		e.preventDefault( );
		e.stopPropagation( );

		this.dismiss( );
	}
	
	/**
	 * dismiss all popup belonging to the same group as 'this'
	 */

	dismiss( after = false ) {

		if( autoclose_list.length==0 ) {
			return;
		}

		const cgroup = this.getData( "close" );
		const inc_group: Popup[] = [];
		const excl_group: Popup[] = [];
		
		let aidx = -1;
		if( after ) {
			aidx = autoclose_list.indexOf( this );
		}

		autoclose_list.forEach( (x,idx) => {
			const group = x.getData( "close" );
			if( group==cgroup && idx>aidx) {
				inc_group.push( x );
			}
			else {
				excl_group.push( x );
			}
		})

		const list = inc_group.reverse( );
		autoclose_list = excl_group;
		if( autoclose_list.length==0 ) {
			document.removeEventListener( "pointerdown", this._dismiss );
		}
		
		list.forEach( x => x.close() );
	}

	/**
	 * 
	 */

	private _showModalMask( ) {
		
		if( !modal_mask ) {
			modal_mask = new Component( {
				cls: "x4modal-mask",
				domEvents: {
					click: this._dismiss
				}
			});
		}

		modal_mask.show( true );
		document.body.insertAdjacentElement( "beforeend", modal_mask.dom );
	}

	/**
	 * 
	 */

	private _updateModalMask( ) {
		if( --modal_count == 0 ) {
			modal_mask.show( false );
		}
		else {
			const top = modal_stack[modal_stack.length-1];
			top.dom.insertAdjacentElement( "beforebegin", modal_mask.dom );
		}
	}

	/**
	 * 
	 */

	private _createSizers( ) {
		this.appendContent( [
			new CSizer( "top" ),
			new CSizer( "bottom" ),
			new CSizer( "left" ),
			new CSizer( "right" ),
			new CSizer( "top-left" ),
			new CSizer( "bottom-left" ),
			new CSizer( "top-right" ),
			new CSizer( "bottom-right" ),
		])
	}
}


/**
 * 
 */

class CMover {
	private ref: Component;
	private delta: Point;
	private self: boolean;

	constructor( x: Component, ref?: Component ) {

		this.self = ref ? true : false;

		x.addDOMEvent( "pointerdown", ( e: PointerEvent ) => {
			if( this.self && e.target!=x.dom ) {
				return;
			}

			x.setCapture( e.pointerId );

			this.ref = ref ?? componentFromDOM( x.dom.parentElement );

			this.delta = {x:0,y:0};
			const rc = this.ref.getBoundingRect();

			this.delta.x = e.pageX-rc.left;
			this.delta.y = e.pageY-rc.top;
		});

		x.addDOMEvent( "pointerup", ( e: PointerEvent ) => {
			x.releaseCapture( e.pointerId );
			this.ref = null;
		});

		x.addDOMEvent( "pointermove", ( e: PointerEvent ) => {
			this._onMouseMove( e );
		});
	}

	private _onMouseMove( e: PointerEvent ) {
		if( !this.ref ) {
			return;
		}

		const pt = { x: e.pageX-this.delta.x, y: e.pageY-this.delta.y };
		const rc = this.ref.getBoundingRect( );

		let nr: any = {
		};

		this.ref.setStyle( {
			top: pt.y+"",
			left: pt.x+"",
		} );
		
		e.preventDefault( );
		e.stopPropagation( );
	}
}




