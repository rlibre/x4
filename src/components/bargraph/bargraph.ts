/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file bargraph.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Application } from '../../core/core_application';
import { Color } from '../../core/core_colors';
import { clamp } from '../../core/core_tools';

import { Canvas, CanvasProps } from '../canvas/canvas';
import { CanvasEx } from '../canvas/canvas_ex';

import './bargraph.module.scss';

// no colors given: the accent, pale to full (variables: the theme gives them)
const accentStops = [
	'var(--bargraph-color-start)',
	'var(--bargraph-color-end)',
];

const PEAK_HOLD = 1000;		// ms the peak stays
const PEAK_FALL = 1500;		// ms to fall the whole range

export interface BargraphProps extends Omit<CanvasProps, "paint" | "paint_cb" | "clear"> {
	value?: number;
	/** 0 to 100 by default */
	min?: number;
	max?: number;
	/** the segments go up from the bottom; else from the left */
	vertical?: boolean;
	/** the count of segments, 20 by default */
	segments?: number;
	/** the colors from min to max, as Gauge (linearColorStops: green to red); one color: a plain bar.
	 * none: the accent, pale to full */
	colors?: string[];
	/** the segments that start at this value or above have the overshoot color (alert); the colors go under it */
	overshoot?: number;
	/** the bar goes up quickly and down slowly, in a few frames; false: at once (true by default) */
	animated?: boolean;
	/** the highest segment reached stays lit a second, then falls */
	peak?: boolean;
}

/**
 * a bar of segments, lit from min up to the value (a level meter), drawn in a canvas.
 *
 * @example
 * new Bargraph( { vertical: true, overshoot: 85, peak: true } )
 * meter.setValue( level )		// as often as needed
 * each segment has the color of its place between the colors; an unlit one, a trace of it.
 *
 * setValue can be called many times a second: the bars are drawn once a frame, all together,
 * and only when a segment changes.
 *
 * @cssvar
 * ```
 * --bargraph-color-start
 * --bargraph-color-end
 * --bargraph-overshoot
 * --bargraph-off
 * --bargraph-off-mix
 * --bargraph-gap
 * ```
 */

export class Bargraph extends Canvas<BargraphProps> {
	static classPrefix = "x4";

	private _value = 0;			// the value given
	private _shown = 0;			// the value drawn: it goes to _value when animated
	private _peak = 0;			// the peak drawn
	private _peakTime = 0;

	// what is drawn: the counts of segments
	private _lit = 0;
	private _peakLit = 0;

	// the colors of the segments, read from the css; null: to read again
	private _on: string[] = null;
	private _off: string[] = null;
	private _theme = "";		// the theme of the colors read
	private _gap = 2;

	constructor( props: BargraphProps ) {
		super( props );

		if( props.vertical ) {
			this.addClass( 'vertical' );
		}

		this.setAttribute( "role", "meter" );

		this._value = this._shown = this._peak = props.value ?? this._min( );
		this._aria( );
		this._count( );
	}

	private _min( ) { return this.props.min ?? 0; }
	private _max( ) { return this.props.max ?? 100; }
	private _segments( ) { return Math.max( 1, this.props.segments ?? 20 ); }

	private _aria( ) {
		this.setAria( "aria-valuemin", this._min( ) );
		this.setAria( "aria-valuemax", this._max( ) );
		this.setAria( "aria-valuenow", this._value );
	}

	// :: animation: one loop for all the bargraphs, while one of them moves :::::::

	private static _moving = new Set<Bargraph>( );
	private static _raf = 0;
	private static _last = 0;

	private static _tick( now: number ) {
		const dt = Bargraph._last ? Math.min( now - Bargraph._last, 100 ) : 16.7;
		Bargraph._last = now;
		Bargraph._raf = 0;

		for( const b of Bargraph._moving ) {
			if( !b._step( now, dt ) ) {
				Bargraph._moving.delete( b );
			}
		}

		if( Bargraph._moving.size ) {
			Bargraph._raf = requestAnimationFrame( Bargraph._tick );
		}
		else {
			Bargraph._last = 0;
		}
	}

	private _animate( ) {
		Bargraph._moving.add( this );
		if( !Bargraph._raf ) {
			Bargraph._raf = requestAnimationFrame( Bargraph._tick );
		}
	}

	// a frame: false when it does not move anymore
	private _step( now: number, dt: number ) {
		const range = Math.abs( this._max( ) - this._min( ) ) || 1;
		const delta = this._value - this._shown;

		if( this.props.animated===false ) {
			this._shown = this._value;
		}
		else {
			// up quickly, down slowly: as a level meter
			this._shown += delta * ( 1 - Math.pow( delta>0 ? 0.5 : 0.8, dt/16.7 ) );
			if( Math.abs( this._value - this._shown ) < range/1000 ) {
				this._shown = this._value;
			}
		}

		let moving = this._shown!==this._value;

		if( this.props.peak ) {
			if( this._shown>=this._peak ) {
				this._peak = this._shown;
				this._peakTime = now;
			}
			else if( now - this._peakTime > PEAK_HOLD ) {
				this._peak = Math.max( this._shown, this._peak - range * dt / PEAK_FALL );
			}

			moving ||= this._peak>this._shown;
		}

		if( this._count( ) ) {
			this.redraw( );
		}

		return moving;
	}

	// the counts of segments lit; true when they changed
	private _count( ) {
		const min = this._min( );
		const max = this._max( );
		const n = this._segments( );
		const at = ( v: number ) => max>min ? Math.round( clamp( (v-min) / (max-min), 0, 1 ) * n ) : 0;

		const lit = at( this._shown );
		const peak = this.props.peak ? at( this._peak ) : 0;

		if( lit==this._lit && peak==this._peakLit ) {
			return false;
		}

		this._lit = lit;
		this._peakLit = peak;
		return true;
	}

	// :: colors ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _recolor( ) {
		this._on = null;
		this.redraw( );
	}

	// the variables as the bargraph sees them: a box may give its own
	private _readColors( ) {
		const style = getComputedStyle( this.dom );
		this._theme = Application.getTheme( );
		const read = ( value: string ) => new Color( value.replace( /var\(\s*(--[\w-]+)\s*\)/g, ( _, name ) => style.getPropertyValue( name ).trim( ) ) );
		const copy = ( c: Color ) => { const x = c.toRgb( ); return new Color( x.red, x.green, x.blue, x.alpha ); };

		const n = this._segments( );
		const min = this._min( );
		const size = ( this._max( ) - min ) / n;
		const overshoot = this.props.overshoot;

		// the segments under the overshoot: the colors are spread on them only
		let low = n;
		if( overshoot!==undefined ) {
			low = 0;
			while( low<n && min + low*size < overshoot ) {
				low++;
			}
		}

		const stops = ( this.props.colors?.length ? this.props.colors : accentStops ).map( read );
		const over = read( "var(--bargraph-overshoot)" );
		const off = read( "var(--bargraph-off)" );
		const offMix = ( parseFloat( style.getPropertyValue( "--bargraph-off-mix" ) ) || 15 ) / 100;
		const disabled = this.isDisabled( ) ? read( "var(--disabled-color-light)" ) : null;

		// the color at pos (0 to 1) between the stops
		const colorAt = ( pos: number ) => {
			if( stops.length==1 ) {
				return copy( stops[0] );
			}

			const at = pos * (stops.length-1);
			const k = Math.min( Math.floor( at ), stops.length-2 );
			return copy( stops[k] ).mix( stops[k+1], at-k );
		};

		this._on = [];
		this._off = [];

		for( let i=0; i<n; i++ ) {
			const on = i<low ? colorAt( low>1 ? i/(low-1) : 0 ) : copy( over );

			// a trace of its color
			this._off.push( copy( off ).mix( on, offMix ).toRgbString( true ) );
			this._on.push( ( disabled ?? on ).toRgbString( true ) );
		}

		this._gap = parseFloat( style.getPropertyValue( "--bargraph-gap" ) ) || 0;
	}

	// :: drawing :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// in pixels of the screen, not of the page: the segments stay sharp at any zoom.
	// the theme has no event: it is compared at each drawing (a bargraph that does not move
	// keeps the colors it has until it is drawn again: refresh)
	protected override paint( ctx: CanvasEx ) {
		if( !this._on || this._theme!=Application.getTheme( ) ) {
			this._readColors( );
		}

		const canvas = this.canvas.dom as HTMLCanvasElement;
		const W = canvas.width;
		const H = canvas.height;

		ctx.setTransform( 1, 0, 0, 1, 0, 0 );
		ctx.clearRect( 0, 0, W, H );

		const vertical = !!this.props.vertical;
		const n = this._on.length;
		const gap = Math.round( this._gap * ( window.devicePixelRatio || 1 ) );
		const len = vertical ? H : W;

		for( let i=0; i<n; i++ ) {
			const a = Math.round( i * (len+gap) / n );
			const b = Math.round( (i+1) * (len+gap) / n ) - gap;
			const lit = i<this._lit || i==this._peakLit-1;

			ctx.fillStyle = lit ? this._on[i] : this._off[i];

			if( vertical ) {
				ctx.fillRect( 0, H-b, W, b-a );
			}
			else {
				ctx.fillRect( a, 0, b-a, H );
			}
		}
	}

	// :: api :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * drawn at the next frame: call it as often as needed
	 */

	setValue( v: number ) {
		this._value = v;
		this.setAria( "aria-valuenow", v );
		this._animate( );
	}

	getValue( ) {
		return this._value;
	}

	setMin( min: number ) {
		this.props.min = min;
		this._changed( );
	}

	setMax( max: number ) {
		this.props.max = max;
		this._changed( );
	}

	setColorStops( colors: string[] ) {
		this.props.colors = colors;
		this._changed( );
	}

	/** undefined: no overshoot */
	setOvershoot( overshoot: number ) {
		this.props.overshoot = overshoot;
		this._changed( );
	}

	/**
	 * read the colors again and draw: after a change of the css variables, of the theme
	 */

	refresh( ) {
		this._recolor( );
	}

	// disabled: the segments lit take the disabled color
	override enable( ena = true ): this {
		super.enable( ena );
		this._recolor( );
		return this;
	}

	private _changed( ) {
		this._aria( );
		this._on = null;
		this._count( );
		this.redraw( );
	}
}
