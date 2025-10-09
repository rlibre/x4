/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file gauge.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2025 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { centerRect, class_ns } from '../../core/core_tools';
import { Component, ComponentProps } from '../../core/component'
import { SvgBuilder, SvgComponent } from '../../core/core_svg';


import './gauge.module.scss'


export interface GaugeProps extends ComponentProps {
	colors?: string[];
	min?: number;
	max?: number;
}

export const linearColorStops = [
	'#01d266',
	'#7cd901',
	'#ffc701',
	'#ff9e01',
	'#ff2e49'
]

export const simpleColorStop = [
	'var(--gauge-base-color)'
]

@class_ns( "x4" )
export class Gauge extends Component<GaugeProps> {

	private pos: number;
	private stops: string[];
	private uppos: ( ) => void;

	constructor( props: GaugeProps ) {
		super( props );

		this.pos = 70;
		this.stops = [];

		this.setColorStops( props.colors ?? linearColorStops );

		this.addDOMEvent( "resized", ( ) => this.update( 10 ) );
		this.update( );
	}

	setRange( min: number, max: number ) {
		this.props.min = min;
		this.props.max = max;
		this.update( );
	}

	setPos( pos: number ) {
		if( pos!=this.pos ) {
			this.pos = pos;
			if( this.uppos ) {
				this.uppos( );
			}
		}
	}

	setColorStops( colors: string[] ) {
		if( !colors || !colors.length ) {
			return;
		}

		this.stops = colors;
		this.update( );
	}

	private update( delay: number = 1 ) {

		const render = ( ) => {
			const svg = new SvgBuilder( );
			const rc = this.getBoundingRect( );

			let width = rc.width;
			let height = Math.min( width, rc.height );

			const step = 180 / this.stops.length;
			let start = -90;

			const grect = centerRect( {left:0,top:0,width,height:height/2}, {left:0,top:0,width,height}, 15 );
			const radius = grect.height;
			
			for( const stop of this.stops ) {
				svg.path(  )
					.arc( grect.left+grect.width/2, grect.top+grect.height, radius, start, start+step, true )
					.fill( "none" )
					.stroke( stop, 20 );

				start += step;
			}

			if( this.pos<this.props.min ) {
				this.pos = this.props.min;
			}

			if( this.pos>this.props.max ) {
				this.pos = this.props.max;
			}

			const cx = grect.left+grect.width/2;
			
			const needle = svg.path( )
				.moveTo( cx, grect.top+grect.height-4 )
				.lineTo( cx-radius+4, grect.top+grect.height-2 )
				.lineTo( cx-radius+4, grect.top+grect.height+2 )
				.lineTo( cx, grect.top+grect.height+4 )
				.closePath( )
				.addClass( 'needle' );

			svg.circle( grect.left+grect.width/2, grect.top+grect.height, Math.min( width/20, height/20) )
				.addClass( 'needle-dot' )

			this.setContent( new SvgComponent( { id: '', svg, viewbox: `0 0 ${rc.width} ${rc.height}` } ) );

			const render_needle = ( ) => {
				if( this.pos<this.props.min ) {
					this.pos = this.props.min;
				}

				if( this.pos>this.props.max ) {
					this.pos = this.props.max;
				}

				const pos = (this.pos-this.props.min) / (this.props.max-this.props.min);
				needle.clear_transform( );
				needle.rotate( pos*180, grect.left+grect.width/2, grect.top+grect.height )
			}

			render_needle( );
			this.uppos = render_needle;
		}

		this.setTimeout( "render", delay, render );
	}
}