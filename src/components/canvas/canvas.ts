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

import { class_ns } from '../../core/core_tools';
import { Component, ComponentEvent, ComponentEvents, ComponentProps } from '../../core/component';
import { EventCallback } from "../../core/core_events"
import { CanvasEx, createPainter } from './canvas_ex';

import './canvas.module.scss'

export interface EvPaint extends ComponentEvent {
	ctx: CanvasEx;
}

interface CanvasEventMap extends ComponentEvents {
	paint: EvPaint;
}

export interface CanvasProps extends ComponentProps {
	paint_cb?: (ctx: CanvasEx ) => void;// simple callback
	paint?: EventCallback<EvPaint>		// or standard event (slower)
	clear?: boolean;					// clear background before painting
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

	#update_rep = 0;
	public redraw(wait?: number) {

		if (wait !== undefined) {
			if( ++this.#update_rep>=20 ) {
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

	#pixel_ratio = -1		// can change when moving to another screen
	private _paint() {
		this.#update_rep = 0;

		if (!this.isVisible()) {
			return;
		}

		const dom = this.dom;
		const w = dom.clientWidth;
		const h = dom.clientHeight;

		if (!w || !h) {
			return;
		}

		const ctx = this.getContext();
		const ratio = window.devicePixelRatio || 1;

		if (
			w !== this.m_iwidth ||
			h !== this.m_iheight ||
			ratio !== this.#pixel_ratio
		) {
			const canvas = this.canvas;

			// CSS size stays in logical pixels, while the backing buffer
			// uses the physical screen resolution.
			canvas.setAttribute('width', '' + Math.round(w * ratio));
			canvas.setAttribute('height', '' + Math.round(h * ratio));
			canvas.setStyleValue('width', w);
			canvas.setStyleValue('height', h);

			this.m_iwidth = w;
			this.m_iheight = h;
			this.#pixel_ratio = ratio;
		}

		// setTransform avoids accumulating transformations between paints.
		const scale = ratio * this.m_scale;
		ctx.setTransform(scale, 0, 0, scale, 0, 0);

		const cc = createPainter(ctx, w, h);

		if (this.props.clear) {
			cc.clearRect(
				0,
				0,
				w / this.m_scale,
				h / this.m_scale
			);
		}

		cc.save();
		cc.translate(-0.5, -0.5);
		this.paint(cc);
		cc.restore();
	}

	protected paint(ctx: CanvasEx ) {
		try {
			if( this.props.paint_cb ) {
				this.props.paint_cb( ctx );
			}
			else {
				this.fire('paint', { ctx } );
			}
		}
		catch (x) {
			console.assert(false, x);
		}
	}
}

