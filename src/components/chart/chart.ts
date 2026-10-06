/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file chart.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { ComponentEvent, ComponentEvents } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { SvgBuilder, SvgComponent, SvgGroup, SvgPath, SvgProps, SvgShape } from '../../core/core_svg';
import { class_ns, clamp, IRect, isNumber, sanitizeHtml } from '../../core/core_tools';

import "./chart.module.scss"

export type ChartType = "line" | "area" | "bar" | "pie" | "donut";

export interface ChartTick {
	value: number;		// on x axis: index of the point
	text: string;
}

export interface ChartAxis {
	name?: string;
	ticks?: ChartTick[];
	min?: number;
	max?: number;		// on x axis: number of points
	step?: number;		// on x axis: one label every 'step' points
}

export interface ChartSerie {
	name?: string;
	values: number[];	// undefined: no value (hole in the line)
	color?: string;		// default: palette --chart-color-1..8
	fill?: string;		// area fill color
	dots?: boolean;		// always show the points
}

export interface EvChartClick extends ComponentEvent {
	serie: number;		// serie index
	index: number;		// value index
	value: number;
}

interface ChartEvents extends ComponentEvents {
	click: EvChartClick;
}

export interface ChartProps extends Omit<SvgProps,"svg"|"viewbox"|"content"> {
	type?: ChartType;		// default "line"
	series: ChartSerie[];	// pie & donut use the first serie
	labels?: string[];		// default: 1, 2, 3...
	xaxis?: ChartAxis;
	yaxis?: ChartAxis;
	legend?: boolean;		// default: shown when there is more than one named serie
	stacked?: boolean;
	formatter?: ( value: number ) => string;
	click?: EventCallback<EvChartClick>;
}

const PADDING = 8;
const CHAR_WIDTH = 6;		// estimated, font size is 10px
const NUM_COLORS = 8;
const MAX_BAR = 32;
const MAX_GHOSTS = 500;		// hover points are not created above this count


// :: COMPUTATIONS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * format a number with k, M, B... units
 */

export function chartFormatUnit( value: number, decimals = 2 ) {
	const units = ['', 'k', 'M', 'B', 'T', 'P', 'E'];
	let unitIndex = 0;
	let scaledValue = Math.abs( value );

	while (scaledValue >= 1000 && unitIndex < units.length - 1) {
		scaledValue /= 1000;
		unitIndex++;
	}

	const pow = Math.pow(10, decimals);
	const roundedValue = Math.round(scaledValue * pow) / pow;
	const text = roundedValue % 1 == 0 ? `${roundedValue}` : roundedValue.toFixed(decimals).replace(/\.?0+$/, '');

	return ( value<0 && roundedValue!=0 ? '-' : '' ) + text + units[unitIndex];
}

/**
 * compute a readable scale (bounds are multiples of step)
 */

function niceScale( min: number, max: number, maxTicks: number ) {

	if( min==max ) {
		if( min==0 ) 		{ max = 1; }
		else if( min>0 ) 	{ min = 0; }
		else 				{ max = 0; }
	}

	const rawStep = ( max-min ) / Math.max( 1, maxTicks );
	const exponent = Math.floor( Math.log10(rawStep) );
	const fraction = rawStep / Math.pow( 10, exponent );

	let nFraction;
	if (fraction <= 1) nFraction = 1;
	else if (fraction <= 2) nFraction = 2;
	else if (fraction <= 5) nFraction = 5;
	else nFraction = 10;

	const step = nFraction * Math.pow( 10, exponent );

	return {
		min: Math.floor( min/step ) * step,
		max: Math.ceil( max/step ) * step,
		step
	};
}

function makeTicks( min: number, max: number, step: number, fmt: ( v: number ) => string ) {
	const ticks: ChartTick[] = [];
	const first = Math.ceil( min/step - 1e-9 ) * step;

	for( let i=0; i<100; i++ ) {
		const value = parseFloat( ( first + i*step ).toPrecision( 12 ) );
		if( value>max+step*1e-6 ) {
			break;
		}

		ticks.push( { value, text: fmt(value) } );
	}

	return ticks;
}

/**
 * cumulated values: [serie][index] = { lo, hi }
 */

function computeStack( series: ChartSerie[], count: number ) {
	const pos = new Array<number>( count ).fill( 0 );
	const neg = new Array<number>( count ).fill( 0 );

	return series.map( s => {
		const out: { lo: number, hi: number }[] = [];
		for( let i=0; i<count; i++ ) {
			const v = isNumber( s.values[i] ) ? s.values[i] : 0;
			const acc = v>=0 ? pos : neg;

			out.push( { lo: acc[i], hi: acc[i]+v } );
			acc[i] += v;
		}

		return out;
	});
}

function textWidth( text: string ) {
	return ( text?.length ?? 0 ) * CHAR_WIDTH;
}

function maxTextWidth( ticks: ChartTick[] ) {
	return ticks.reduce( ( w, t ) => Math.max( w, textWidth(t.text) ), 0 );
}


// :: DRAWING HELPERS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function drawText( grp: SvgGroup, x: number, y: number, text: string, halign: 'left' | 'center' | 'right', valign: 'top' | 'center' | 'bottom' ) {
	const baseline = valign=='top' ? 'hanging' : ( valign=='center' ? 'central' : 'auto' );
	return grp.text( x, y, text )
				.textAlign( halign )
				.setAttr( 'dominant-baseline', baseline );
}

/**
 * bar from the baseline (y0) to the value (y1), rounded on the value side
 */

function drawBar( grp: SvgGroup, x: number, w: number, y0: number, y1: number, radius: number ) {
	const dir = y1<y0 ? 1 : -1;
	const r = Math.min( radius, w/2, Math.abs(y1-y0) );

	return grp.path( )
		.moveTo( x, y0 )
		.lineTo( x, y1+dir*r )
		.curveTo( x, y1, x, y1, x+r, y1 )
		.lineTo( x+w-r, y1 )
		.curveTo( x+w, y1, x+w, y1, x+w, y1+dir*r )
		.lineTo( x+w, y0 )
		.closePath( );
}


/**
 * Minimal chart (line, area, bar, pie, donut) drawn in svg.
 *
 * @example
 * new Chart( {
 *   type: "bar",
 *   labels: [ "Jan", "Feb", "Mar" ],
 *   series: [
 *     { name: "2025", values: [ 12, 19, 7 ] },
 *     { name: "2026", values: [ 15, 11, 14 ] },
 *   ],
 *   click: ( ev ) => console.log( ev.serie, ev.index, ev.value ),
 * })
 *
 * @cssvar
 * ```
 * --chart-background
 * --chart-text
 * --chart-grid
 * --chart-axis
 * --chart-color-1 ... --chart-color-8
 * ```
 */

@class_ns( "x4" )
export class Chart extends SvgComponent<ChartProps,ChartEvents> {

	private _type: ChartType;
	private _series: ChartSerie[];
	private _labels: string[];
	private _xaxis: ChartAxis;
	private _yaxis: ChartAxis;

	constructor( props: ChartProps ) {
		super( props );

		this._type = props.type ?? "line";
		this._series = props.series ?? [];
		this._labels = props.labels;
		this._xaxis = { ...props.xaxis };
		this._yaxis = { ...props.yaxis };

		this.mapPropEvents( props, "click" );

		this.addDOMEvent( "created", ( ) => {
			this._render( );
		});

		this.addDOMEvent( "resized", ( ) => {
			this._render( );
		});

		this.addDOMEvent( "click", ( e ) => {
			const el = ( e.target as Element ).closest( "[data-index]" );
			if( el && this.dom.contains( el ) ) {
				const serie = parseInt( el.getAttribute( "data-serie" ) );
				const index = parseInt( el.getAttribute( "data-index" ) );
				this.fire( "click", { serie, index, value: this._series[serie]?.values[index] } );
			}
		});
	}

	setType( type: ChartType ) {
		this._type = type;
		this._render( );
	}

	/**
	 * @param labels - if given, replace the labels too
	 */

	setSeries( series: ChartSerie[], labels?: string[] ) {
		this._series = series ?? [];
		if( labels!==undefined ) {
			this._labels = labels;
		}

		this._render( );
	}

	setLabels( labels: string[] ) {
		this._labels = labels;
		this._render( );
	}

	setTicks( sens: "x" | "y", ticks: ChartTick[] ) {
		if( sens=="x" ) {
			this._xaxis.ticks = ticks;
		}
		else {
			this._yaxis.ticks = ticks;
		}

		this._render( );
	}

	/**
	 *
	 */

	private _label( index: number ) {
		return this._labels?.[index] ?? ( index+1 )+"";
	}

	private _format( value: number ) {
		return this.props.formatter ? this.props.formatter( value ) : chartFormatUnit( value );
	}

	/**
	 * set the color of an element: palette slot or explicit color
	 */

	private _paint<T extends SvgShape | SvgPath>( item: T, slot: number, color?: string ): T {
		item.addClass( "c"+( slot % NUM_COLORS + 1 ) );
		if( color ) {
			item.getDom().style.setProperty( "--chart-c", color );
		}

		return item;
	}

	/**
	 * make an element clickable with a tooltip
	 */

	private _mark<T extends SvgShape | SvgPath>( item: T, serie: number, index: number, tip: string ): T {
		item.setAttr( "data-serie", serie+"" )
			.setAttr( "data-index", index+"" )
			.setAttr( "tooltip", sanitizeHtml(tip) );

		return item;
	}

	/**
	 *
	 */

	private _render( ) {

		if( !this.dom.isConnected || !this.dom.checkVisibility() ) {
			return;
		}

		const grc = this.getBoundingRect( );
		const area: IRect = { left: PADDING, top: PADDING, width: grc.width-PADDING*2, height: grc.height-PADDING*2 };

		const bld = new SvgBuilder( );

		if( area.width>0 && area.height>0 ) {
			const pie = this._type=="pie" || this._type=="donut";

			let entries: string[];
			let legend = this.props.legend;

			if( pie ) {
				entries = ( this._series[0]?.values ?? [] ).map( ( _, i ) => this._label(i) );
				legend ??= !!this._labels;
			}
			else {
				entries = this._series.map( ( s, i ) => s.name ?? ( i+1 )+"" );
				legend ??= this._series.filter( s => s.name ).length>1;
			}

			if( legend && entries.length ) {
				area.height -= this._drawLegend( bld, entries, area, pie );
			}

			if( area.height>0 ) {
				if( pie ) {
					this._drawPie( bld, area );
				}
				else {
					this._drawXY( bld, area );
				}
			}
		}

		this.setSvg( bld );
	}

	/**
	 * legend at the bottom of the area
	 * @returns the height used
	 */

	private _drawLegend( bld: SvgBuilder, entries: string[], area: IRect, pie: boolean ) {
		const ROW = 18;

		// wrap entries
		let x = 0;
		let row = 0;

		const pos = entries.map( text => {
			const w = 16 + textWidth(text) + 16;
			if( x>0 && x+w>area.width ) {
				x = 0;
				row++;
			}

			const p = { x, row };
			x += w;
			return p;
		});

		const height = ( row+1 )*ROW + 6;
		const top = area.top + area.height - height + 6;

		const grp = bld.group( ).addClass( "legend" );

		entries.forEach( ( text, i ) => {
			const px = area.left + pos[i].x;
			const cy = top + pos[i].row*ROW + ROW/2;

			this._paint( grp.rect( px, cy-5, 10, 10 ).addClass( "mark" ), i, pie ? undefined : this._series[i].color );
			drawText( grp, px+16, cy, text, 'left', 'center' );
		});

		return height;
	}

	/**
	 * pie & donut: one slice for each value of the first serie
	 */

	private _drawPie( bld: SvgBuilder, area: IRect ) {
		const values = ( this._series[0]?.values ?? [] ).map( v => isNumber(v) && v>0 ? v : 0 );
		const total = values.reduce( ( a, v ) => a+v, 0 );
		const count = values.filter( v => v>0 ).length;

		const cx = area.left + area.width/2;
		const cy = area.top + area.height/2;
		const radius = Math.min( area.width, area.height )/2 - 2;

		if( !total || radius<=0 ) {
			return;
		}

		const donut = this._type=="donut";
		const thick = radius*0.4;
		const rr = donut ? radius-thick/2 : radius;

		// slices of a donut are strokes: separate them by a small angle
		const gap = donut && count>1 ? 2/( Math.PI*2*rr )*360 : 0;

		const grp = bld.group( ).addClass( "plot" );
		let start = 0;

		values.forEach( ( v, i ) => {
			if( !v ) {
				return;
			}

			const sweep = v/total*360;
			const full = sweep>=359.99;

			let item: SvgShape | SvgPath;

			if( donut ) {
				const g = sweep>gap*2 ? gap/2 : 0;
				item = full ? grp.circle( cx, cy, rr ) : grp.path( ).arc( cx, cy, rr, start+g, start+sweep-g );
				item.addClass( "ring" ).strokeWidth( thick );
			}
			else {
				item = full ? grp.circle( cx, cy, rr ) : grp.path( ).arc( cx, cy, rr, start, start+sweep ).lineTo( cx, cy ).closePath( );
				item.addClass( "slice" );
			}

			const perc = Math.round( v/total*1000 )/10;
			this._paint( item, i );
			this._mark( item, 0, i, `${this._label(i)}: ${this._format(v)} (${perc}%)` );

			start += sweep;
		});
	}

	/**
	 * line, area & bar
	 */

	private _drawXY( bld: SvgBuilder, area: IRect ) {

		const series = this._series;
		const type = this._type;
		const stacked = !!this.props.stacked;
		const xaxis = this._xaxis;
		const yaxis = this._yaxis;

		// number of points
		let count = xaxis.max ?? 0;
		if( xaxis.max===undefined ) {
			series.forEach( s => { count = Math.max( count, s.values?.length ?? 0 ); } );
		}

		if( count<=0 ) {
			return;
		}

		const value = ( s: number, i: number ) => {
			const v = series[s].values?.[i];
			return isNumber(v) ? v : undefined;
		}

		const stack = stacked ? computeStack( series, count ) : null;

		// y scale
		let dmin = Infinity;
		let dmax = -Infinity;

		series.forEach( ( _, s ) => {
			for( let i=0; i<count; i++ ) {
				if( stack ) {
					dmin = Math.min( dmin, stack[s][i].lo, stack[s][i].hi );
					dmax = Math.max( dmax, stack[s][i].lo, stack[s][i].hi );
				}
				else {
					const v = value( s, i );
					if( v!==undefined ) {
						dmin = Math.min( dmin, v );
						dmax = Math.max( dmax, v );
					}
				}
			}
		});

		if( dmin==Infinity ) {
			dmin = 0;
			dmax = 1;
		}

		// bars always start from 0
		if( type=="bar" || stacked ) {
			dmin = Math.min( dmin, 0 );
			dmax = Math.max( dmax, 0 );
		}

		const nice = niceScale( yaxis.min ?? dmin, yaxis.max ?? dmax, clamp( Math.floor( area.height/40 ), 2, 10 ) );
		const min = yaxis.min ?? nice.min;
		let max = yaxis.max ?? nice.max;
		if( max<=min ) {
			max = min+1;
		}

		const step = yaxis.step>0 ? yaxis.step : nice.step;
		const yticks = yaxis.ticks ?? makeTicks( min, max, step, v => this._format(v) );

		// plot area
		const band = type=="bar";
		const yname = yaxis.name ? 14 : 0;
		const xname = xaxis.name ? 14 : 0;
		const ywidth = maxTextWidth( yticks ) + 8;

		const plot: IRect = {
			left: area.left + yname + ywidth,
			top: area.top + 6,
			width: area.width - yname - ywidth - ( band ? 0 : 10 ),
			height: area.height - 6 - 16 - xname,
		};

		if( plot.width<=0 || plot.height<=0 ) {
			return;
		}

		const right = plot.left + plot.width;
		const bottom = plot.top + plot.height;

		const xstep = band ? plot.width/count : ( count>1 ? plot.width/( count-1 ) : 0 );
		const xpos = ( i: number ) => {
			if( band ) {
				return plot.left + ( i+0.5 )*xstep;
			}

			return count>1 ? plot.left + i*xstep : plot.left + plot.width/2;
		}

		const yfac = plot.height / ( max-min );
		const ypos = ( v: number ) => bottom - ( v-min )*yfac;
		const ybase = ypos( clamp( 0, min, max ) );

		// x ticks
		let xticks = xaxis.ticks;
		if( !xticks ) {
			xticks = [];

			let maxw = 0;
			for( let i=0; i<count; i++ ) {
				maxw = Math.max( maxw, textWidth( this._label(i) ) );
			}

			// too many labels: show one every n
			const every = xaxis.step>0 ? Math.round( xaxis.step ) : Math.max( 1, Math.ceil( ( maxw+8 ) / ( xstep || plot.width ) ) );
			for( let i=0; i<count; i+=every ) {
				xticks.push( { value: i, text: this._label(i) } );
			}
		}

		// grid & axis
		const grid = bld.group( ).addClass( "axis" );

		for( const t of yticks ) {
			const y = ypos( t.value );
			if( y<plot.top-0.5 || y>bottom+0.5 ) {
				continue;
			}

			grid.path( ).moveTo( plot.left, y ).lineTo( right, y ).addClass( "grid" );
			drawText( grid, plot.left-6, y, t.text, 'right', 'center' );
		}

		for( const t of xticks ) {
			const x = xpos( t.value );
			if( xaxis.ticks && !band ) {
				grid.path( ).moveTo( x, plot.top ).lineTo( x, bottom ).addClass( "grid" );
			}

			drawText( grid, x, bottom+5, t.text, 'center', 'top' );
		}

		grid.path( ).moveTo( plot.left, ybase ).lineTo( right, ybase ).addClass( "base" );

		if( xaxis.name ) {
			drawText( grid, plot.left+plot.width/2, bottom+19, xaxis.name, 'center', 'top' ).addClass( "name" );
		}

		if( yaxis.name ) {
			const cy = plot.top + plot.height/2;
			drawText( grid, area.left, cy, yaxis.name, 'center', 'top' ).addClass( "name" ).rotate( -90, area.left, cy );
		}

		// series
		const grp = bld.group( ).addClass( "plot" );

		// values may be out of fixed bounds
		if( yaxis.min!==undefined || yaxis.max!==undefined ) {
			const { id } = bld.addClip( plot.left-5, plot.top, plot.width+10, plot.height );
			grp.clip( id );
		}

		const tip = ( s: number, i: number, v: number ) => {
			const name = series[s].name ? ` · ${series[s].name}` : '';
			return `${this._label(i)}${name}: ${this._format(v)}`;
		}

		if( band ) {
			const n = stacked ? 1 : Math.max( 1, series.length );
			const w = Math.min( xstep*0.8/n, MAX_BAR );
			const gap = w>6 ? 1 : 0;	// 2px between bars

			series.forEach( ( serie, s ) => {
				for( let i=0; i<count; i++ ) {
					const v = value( s, i );
					if( v===undefined ) {
						continue;
					}

					let bar: SvgPath;

					if( stack ) {
						const y0 = ypos( stack[s][i].lo );
						let y1 = ypos( stack[s][i].hi );

						// 2px between segments
						if( Math.abs( y1-y0 )>3 ) {
							y1 += y1<y0 ? 2 : -2;
						}

						bar = drawBar( grp, xpos(i)-w/2, w, y0, y1, 0 );
					}
					else {
						const x = xpos(i) - w*n/2 + s*w;
						bar = drawBar( grp, x+gap, w-gap*2, ybase, ypos(v), 4 );
					}

					this._paint( bar.addClass( "bar" ), s, serie.color );
					this._mark( bar, s, i, tip( s, i, v ) );
				}
			});
		}
		else {
			const areas = grp.group( );
			const lines = grp.group( );
			const dots  = grp.group( );

			const ghosts = series.length*count<=MAX_GHOSTS;

			series.forEach( ( serie, s ) => {

				// consecutive points
				type Pt = { i: number, x: number, y: number, ylo: number };
				const runs: Pt[][] = [];
				let run: Pt[] = null;

				for( let i=0; i<count; i++ ) {
					const v = stack ? stack[s][i].hi : value( s, i );
					if( v===undefined ) {
						run = null;
						continue;
					}

					if( !run ) {
						run = [];
						runs.push( run );
					}

					run.push( { i, x: xpos(i), y: ypos(v), ylo: stack ? ypos( stack[s][i].lo ) : ybase } );
				}

				for( const pts of runs ) {
					const first = pts[0];
					const last = pts[pts.length-1];

					if( type=="area" && pts.length>1 ) {
						const pth = areas.path( ).moveTo( first.x, first.ylo );
						pts.forEach( p => pth.lineTo( p.x, p.y ) );

						if( stack ) {
							for( let k=pts.length-1; k>0; k-- ) {
								pth.lineTo( pts[k].x, pts[k].ylo );
							}
						}
						else {
							pth.lineTo( last.x, last.ylo );
						}

						pth.closePath( ).addClass( "area" );
						this._paint( pth, s, serie.color );

						if( serie.fill ) {
							pth.setStyle( "fill", serie.fill ).setStyle( "fillOpacity", "1" );
						}
					}

					if( pts.length>1 ) {
						const pth = lines.path( ).moveTo( first.x, first.y );
						for( let k=1; k<pts.length; k++ ) {
							pth.lineTo( pts[k].x, pts[k].y );
						}

						this._paint( pth.addClass( "line" ), s, serie.color );
					}

					// points: always visible, or only on hover (ghost)
					const visible = serie.dots || pts.length==1;
					if( visible || ghosts ) {
						for( const p of pts ) {
							const dot = dots.circle( p.x, p.y, 4 ).addClass( visible ? "dot" : "dot ghost" );
							this._paint( dot, s, serie.color );
							this._mark( dot, s, p.i, tip( s, p.i, value( s, p.i ) ?? 0 ) );
						}
					}
				}
			});
		}
	}
}
