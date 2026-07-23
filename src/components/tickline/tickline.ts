import { SvgBuilder, SvgComponent } from '../../core/core_svg';
import { Color } from '../../core/core_colors';
import { Component, ComponentProps } from '../../core/component';
import { class_ns } from '../../core/core_tools';

import "./tickline.module.scss"

interface TickLineProps extends ComponentProps {
	values: number[];
	min?: number;
	max?: number;
	color?: Color;			
	background?: Color;		
	type: "bars" | "line";	
}

/**
 * 
 * @cssvar
 * ```
 * --tickline-axis-color
 * --tickline-color
 * --tickline-background
 * ```
 */

@class_ns( "x4" )
export class TickLine extends Component<TickLineProps> {
	
	constructor( props: TickLineProps ) {
		super( props );

		this.addDOMEvent( "resized", ( ) => this.update( ) );
	}

	update( ) {
		const props = this.props;
		const vals = props.values;

		if( !vals.length  ) {
			this.clearContent( );
			return;
		}
		
		const rc = this.getBoundingRect( );
		const min = props.min ?? 0;
		const max = props.max ?? 100;

		const xmul = rc.width/vals.length;
		const ymul = rc.height/(max-min);

		const b = rc.height;

		const bld = new SvgBuilder( );

		if( props.background ) {
			bld.rect( 0, 0, rc.width, rc.height )
				.fill( props.background.toHexString() );
		}

		if( min!=0 ) {
			bld.path( )
				.moveTo( 0, b-(0-min)*ymul )
				.lineTo( rc.width, b-(0-min)*ymul )
				.stroke( "var(--tickline-axis-color)", 1 )
				.antiAlias( false )
		}

		if( props.type=="line" ) {
			const pth = bld.path( );
			for( let x=0; x<vals.length; x++ ) {
				if( x==0 ) {
					pth.moveTo( x*xmul, b-(vals[x]-min)*ymul );
				}
				else {
					pth.lineTo( x*xmul, b-(vals[x]-min)*ymul );
				}
			}

			pth.stroke( props.color ? props.color.toHexString() : "var(--tickline-color)", 1 )
				.no_fill( );
		}
		else {
			for( let x=0; x<vals.length; x++ ) {
				bld.rect( x*xmul, b-(0-min)*ymul, xmul-1, b-vals[x]*ymul )
					.fill( props.color ? props.color.toHexString() : "var(--tickline-color)" )
					.antiAlias( false );
			}
		}



		this.setContent( new SvgComponent( {width: "100%", height: "100%", svg: bld, attrs: { viewport:`0 ${props.min??0} ${vals.length} ${props.max??100}` } } ) );
	}
}