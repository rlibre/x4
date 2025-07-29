import { class_ns } from '../../core/core_tools';
import { Component, ComponentProps } from '../../core/component';
import { HBox } from '../boxes/boxes';
import { Label } from '../label/label';
import { CSizer } from '../sizers/sizer';

import "./header.module.scss"

interface HeaderItem {
	name: string;
	title: string;
	iconId?: string;
	width?: number;	// <0 for flex
}

interface HeaderProps extends Omit<ComponentProps,"content"> {
	items: HeaderItem[]
}

/**
 * 
 */

@class_ns( "x4" )
export class Header extends HBox<HeaderProps> {

	private _els: Component[];
	private _vwp: Component;

	constructor( props: HeaderProps ) {
		super( props );

		this._els = props.items?.map( x => {
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

			sizer.on( "resize", ( ev ) => {
				//cell.setStyleValue( "flexGrow", "0" );
				cell.setInternalData("flex",0);
				cell.setInternalData("width",ev.size);
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
		
		let rest = (rc.width-filled);
		const unit = Math.ceil( rest/count );

		console.log( "filled", filled );
		console.log( "count", count );
		console.log( "rest", rest );
		console.log( "unit", unit );
		
		let fullw = 0;
		this._els.forEach( c => {
			let width = 0;

			const flex = c.getInternalData( "flex" );
			if( flex ) {
				width = Math.min( unit*flex, rest );
				rest -= width;
			}
			else {
				width = c.getInternalData( "width" );
			}

			c.setWidth( width );
			fullw += width;
		} );

		this._vwp.setWidth( fullw );
	}

	private _on_resize( ) {
		this._calc_sizes( );
	}


}