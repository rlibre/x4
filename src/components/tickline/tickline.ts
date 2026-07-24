import { SvgBuilder, SvgComponent } from '../../core/core_svg';
import { Color } from '../../core/core_colors';
import { Component, ComponentProps } from '../../core/component';

import "./tickline.module.scss"
import { class_ns } from '../../core/core_tools';

interface TickLineProps extends ComponentProps {
	values: number[];
	min?: number;
	max?: number;
	color?: Color;			
	background?: Color;		
	type: "bars" | "line";	
    display?: {
        tooltips?: boolean; // display values tootips
        axis?: boolean;     // display axis
    }
}

/**
 * 
 * @cssvar
 * ```
 * --tickline-axis-color
 * --tickline-color
 * --tickline-background
 * ```
 * 
 * by default values are in percent.
 * 
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
        const padding = 4;

		if( !vals.length  ) {
			this.clearContent( );
			return;
		}
		
		const rc = this.getBoundingRect( ).moveTo(0,0).inflate( -padding );

        const min = props.min ?? 0;
		const max = props.max ?? 100;

        if( max<=min || rc.width<=0 || rc.height<=0 ) {
            this.clearContent( );
            return;
        }

		const xmul = props.type=="line" ? rc.width/(vals.length-1) : rc.width/vals.length;
		const ymul = rc.height/(max-min);

		const b    = rc.bottom;

		const bld = new SvgBuilder( );

		if( props.background ) {
			bld.rect( 0, 0, rc.width+padding*2, rc.height+padding*2 )
				.fill( props.background.toHexString() );
		}

		if( min!=0 || props.display?.axis ) {
			bld.path( )
				.moveTo( rc.left, b-(0-min)*ymul )
				.lineTo( rc.right, b-(0-min)*ymul )
				.stroke( "var(--tickline-axis-color)", 1 )
				.antiAlias( false )
		}

		if( props.type=="line" ) {
			const pth = bld.path( );
			for( let x=0; x<vals.length; x++ ) {
				if( x==0 ) {
					pth.moveTo( rc.left+x*xmul, b-(vals[x]-min)*ymul );
				}
				else {
					pth.lineTo( rc.left+x*xmul, b-(vals[x]-min)*ymul );
				}
			}

			pth.stroke( props.color ? props.color.toHexString() : "var(--tickline-color)", 1 )
				.no_fill( );
		}
		else {
			for( let x=0; x<vals.length; x++ ) {
				const r = bld.rect( rc.left+x*xmul, b-(vals[x]-min)*ymul, xmul-1, (vals[x]-min)*ymul )
					.fill( props.color ? props.color.toHexString() : "var(--tickline-color)" )
                    .antiAlias( false );

                if( props.display?.tooltips ) {
                    r.setAttr( 'tooltip', vals[x].toFixed(1) )
                }
			}
		}

		this.setContent( new SvgComponent( {width: "100%", height: "100%", svg: bld, attrs: { viewport:`0 ${props.min??0} ${vals.length} ${props.max??100}` } } ) );
	}

    setValues( values: number[], options? : { min: number, max: number } ) {

        options = { min: 0, max: 100, ...options };

        this.props.values = values;
        this.props.min = options.min;
        this.props.max = options.max;

        this.update( );
    }
}