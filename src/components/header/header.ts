import { class_ns, getScrollbarSize } from '../../core/core_tools';
import { Component, ComponentProps } from '../../core/component';
import { HBox } from '../boxes/boxes';
import { Label } from '../label/label';
import { CSizer } from '../sizers/sizer';

import "./header.module.scss"

interface HeaderItem {
	name?: string;	// default to ref-cx
	title: string;
	iconId?: string;
	width?: number;	// <0 for flex
}

interface HeaderProps extends Omit<ComponentProps,"content"> {
	items: HeaderItem[]
	target?: Component;	// target element to set header col variable width var( --{name}-width ) parent element if not set
}

const CELL_MW = 8;
const MAX_COLS = 10;	// columns with a default name (ref-c1...ref-c10) handled by the listbox css

/**
 * by default when a header item is resized, the 'target' style '--{name}-width' is updated
 *
 * a Listbox handles 10 columns at most: the width of its cells is given by the
 * css classes ref-c1 to ref-c10 (text of the item, then sub_cols).
 * above, give a name to the header item and handle '--{name}-width' in your own css.
 *
 * @cssvar
 * ```
 * --header-background-hover
 * --header-sizer-hover
 * --header-color
 * ```
 */

@class_ns( "x4" )
export class Header extends HBox<HeaderProps> {

	private _els: Component[];
	private _vwp: Component;

	constructor( props: HeaderProps ) {
		super( props );

		if( props.items?.some( ( x, index ) => !x.name && index>=MAX_COLS ) ) {
			console.warn( `Header: ${props.items.length} columns, only the first ${MAX_COLS} get a width in a Listbox (ref-c1 to ref-c${MAX_COLS}).` );
		}

		this._els = props.items?.map( (x,index) => {

			if( !x.name ) {
				x.name = `ref-c${index+1}`;
			}

			const cell = new Label( { cls: "cell", text: x.title, icon: x.iconId } );
			const sizer = new CSizer( "right" );
			
			if( x.width>0 ) {
				cell.setStyleValue( "width", x.width+'px' );
				cell.setInternalData( "width", x.width );
			}
			else if( x.width<0 ) {
				cell.setInternalData( "flex", -x.width );
			}
			else {
				cell.setInternalData( "width", 0 );
			}

			sizer.addDOMEvent( "dblclick", ( e: MouseEvent ) => {
				cell.setInternalData( "flex", 1 );
				this._calc_sizes( );
			})

			let resized = false;

			sizer.on( "start", ( ) => {
				// freeze the flex columns: if they keep taking the remaining space, the left side
				// of the resized cell moves, and the sizer (which measures from it) runs away
				resized = false;

				this._els.forEach( c => {
					const flex = c.getInternalData( "flex" );
					if( flex ) {
						c.setInternalData( "saved-flex", flex );
						c.setInternalData( "flex", 0 );
						c.setInternalData( "width", Math.round( c.getBoundingRect( ).width ) );
					}
				});
			} );

			sizer.on( "stop", ( ) => {
				this._els.forEach( c => {
					const flex = c.getInternalData( "saved-flex" );
					if( flex ) {
						c.setInternalData( "saved-flex", 0 );

						// the resized column keeps its new width
						if( c!==cell || !resized ) {
							c.setInternalData( "flex", flex );
						}
					}
				});

				this._calc_sizes( );
			} );

			sizer.on( "resize", ( ev ) => {
				//cell.setStyleValue( "flexGrow", "0" );
				resized = true;
				const sze = ev.size<CELL_MW ? CELL_MW : ev.size;
				cell.setInternalData("flex",0);
				cell.setInternalData("width",sze);
				this._calc_sizes( );
			});

			cell.appendContent( sizer );
			cell.setInternalData( "data", x );

			return cell;
		});

		this.addDOMEvent( "resized", ( ) => this._on_resize() );
		this.addDOMEvent( "created", ( ) => this._calc_sizes( ) );

		this._vwp = new HBox( { content: this._els } );
		this.setContent(  this._vwp );
	}

	private _calc_sizes( ) {

		let count = 0;
		let filled = 0;

		this._els.forEach( c => {
			const flex = c.getInternalData( "flex" );
			if( flex ) {
				count += flex;
			}
			else {
				let width = c.getInternalData( "width" );
				if( width==0 ) {
					const rc = c.getBoundingRect( );
					width = Math.ceil( rc.width )+2;
					c.setInternalData( "width", width );
				}
					
				filled += width;
			}
		} );

		const rc = this.getBoundingRect( );
        const cs = this.getComputedStyle( );
		
		let   rest = (rc.width-filled-getScrollbarSize()) - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
		const unit = Math.ceil( rest/count );

		//console.log( "filled", filled );
		//console.log( "count", count );
		//console.log( "rest", rest );
		//console.log( "unit", unit );
		
		let fullw = 0;
		this._els.forEach( c => {
			let width = 0;

			const flex = c.getInternalData( "flex" );
			if( flex ) {
				width = Math.floor(Math.min( unit*flex, rest ));
				rest -= width;
			}
			else {
				width = c.getInternalData( "width" );
			}

			if( width<CELL_MW ) {
				width = CELL_MW;
			}

			c.setWidth( width );

			const item = c.getInternalData<HeaderItem>( 'data' );

			if( !this.props.target ) {
				this.parentElement().setStyleVariable( `--${item.name}-width`, width + "px");
			}
			else {
				this.props.target?.setStyleVariable( `--${item.name}-width`, width + "px");
			}
			
			fullw += width;
		} );

		this._vwp.setWidth( fullw );
	}

	private _on_resize( ) {
		this._calc_sizes( );
	}


}