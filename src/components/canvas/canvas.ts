/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file canvas.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2025 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '@core/core_tools.js';
import { Component, ComponentEvent, ComponentEvents, ComponentProps } from '../../core/component';
import { EventCallback } from "../../core/core_events"
import { CanvasEx, createPainter } from './canvas_ex.js';

import './canvas.module.scss'

export interface EvPaint extends ComponentEvent {
	ctx: CanvasEx;
}

interface CanvasEventMap extends ComponentEvents {
	paint: EvPaint;
}

interface CanvasProps extends ComponentProps {
	paint: EventCallback<EvPaint>
	clear?: boolean;
}



// ============================================================================
// [CANVAS]
// ============================================================================

/**
 * Standard Canvas
 */

@class_ns( "x4" )
export class Canvas extends Component<CanvasProps, CanvasEventMap> {

	private m_iwidth: number = -1;
	private m_iheight: number = -1;
	private m_scale = 1.0;
	private m_canvas: Component;

	constructor(props: CanvasProps) {
		super(props);

		this.mapPropEvents( props, 'paint' );
		this.addDOMEvent('resized', () => { this._paint(); })
		
		this.m_iwidth = -1;
		this.m_iheight = -1;
		this.m_canvas = new Component({
			tag: 'canvas'
		});

		this.setContent( this.m_canvas );
	}

	/**
	 * scale the whole canvas
	 */

	scale(scale: number) {
		this.m_scale = scale;
		this.m_iwidth = -1;	// force recalc
		this.redraw();
	}

	/**
	 * return the internal canvas
	 */
	get canvas(): Component {
		return this.m_canvas;
	}

	getContext( ) {
		return (this.m_canvas.dom as HTMLCanvasElement).getContext('2d') as CanvasEx;
	}

	/**
	 * redraw the canvas (force a paint)
	 */

	private $update_rep = 0;
	public redraw(wait?: number) {

		if (wait !== undefined) {
			if( ++this.$update_rep>=20 ) {
				this.clearTimeout( 'update' );
				this._paint( );
			}
			else {
				this.setTimeout( 'update', wait, () => this._paint() );
			}
		}
		else {
			this.clearTimeout( 'update' );
			this._paint();
		}
	}

	/**
	 * 
	 */

	private _paint() {
		this.$update_rep = 0;

		let dom = this.dom;
		if (!this.isVisible() ) {
			return;
		}

		//const canvas = this.m_canvas.dom as HTMLCanvasElement;
		const w = dom.clientWidth;
		const h = dom.clientHeight;

		const ctx = this.getContext();
		if (w != this.m_iwidth || h != this.m_iheight) {
			// adjustment for HDPI
			let devicePixelRatio = window.devicePixelRatio || 1;
			let backingStoreRatio = (<any>ctx).webkitBackingStorePixelRatio ||
				(<any>ctx).mozBackingStorePixelRatio ||
				(<any>ctx).msBackingStorePixelRatio ||
				(<any>ctx).oBackingStorePixelRatio ||
				(<any>ctx).backingStorePixelRatio || 1;

			let canvas = this.canvas;

			if ( this.m_scale != 1.0 ) { //devicePixelRatio !== backingStoreRatio || this.m_scale != 1.0) {
				let ratio = 1;	//devicePixelRatio / backingStoreRatio,
				const rw = w * ratio;
				const rh = h * ratio;

				canvas.setAttribute('width', '' + rw);
				canvas.setAttribute('height', '' + rh);
				canvas.setStyleValue('width', w);
				canvas.setStyleValue('height', h);

				ratio *= this.m_scale;
				ctx.scale(ratio, ratio);
			}
			else {
				canvas.setAttribute('width', '' + w);
				canvas.setAttribute('height', '' + h);
				canvas.setStyleValue('width', w);
				canvas.setStyleValue('height', h);
				ctx.scale(1, 1);
			}

			this.m_iwidth = w;
			this.m_iheight = h;
		}

		if (w && h) {
			let cc = createPainter(ctx, w, h);
			if (this.props.clear) {
				
				cc.clearRect(0,0,w/this.m_scale,h/this.m_scale);
			}

			cc.save();
			cc.translate(-0.5, -0.5);
			this.paint(cc);
			cc.restore();
		}
	}

	protected paint(ctx: CanvasEx ) {
		try {
			this.fire('paint', { ctx } );
		}
		catch (x) {
			console.assert(false, x);
		}
	}
}

