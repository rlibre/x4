/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file slider.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '@core/core_events.js';
import { Component, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { class_ns, Rect } from '../../core/core_tools.js';

import { HBox } from '../boxes/boxes';
import { Input } from '../input/input.js';

import './slider.module.scss';

interface SliderEvents extends ComponentEvents {
	change: EvChange;
}

interface SliderProps extends ComponentProps {
	value: number;
	min: number;
	max: number;
	step?: number;
	vertical?: boolean;
	change?: EventCallback<EvChange>;
}

/**
 * 
 */

@class_ns( "x4" )
export class Slider extends Component<SliderProps,SliderEvents> {

	private _mdown = false;
	private _irect: Rect = null;
	private _thumb: Component = null;
	private _bar: Component = null;
	private _range: Input = null;


	constructor( props: SliderProps ) {
		super( props );

		this.mapPropEvents( props, "change" );

		if( props.vertical ) {
			this.addClass( 'vertical' );
		}

		this.setContent( [
			new HBox( { cls: "track", content: [
				this._bar = new Component( { cls: "bar" } ),
				this._thumb = new Component( { cls: "thumb" } ),
			] }),
			this._range = new Input( { 
				type: "range", 
				hidden: true, 
				value: props.value, 
				min: props.min, 
				max: props.max, 
				step: props.step,
			} )
		]);

		this.setAttribute( "tabindex", 0 );

		this.setDOMEvents( {
			pointerdown: ( ev ) => this._on_mousedown( ev ),
			pointermove: ( ev ) => this._on_mousemove( ev ),
			pointerup: ( ev ) => this._on_mouseup( ev ),
			keydown: ( ev ) => this._on_key( ev ),
		} );

		this._update( );
	}

	private _on_mousedown( ev: PointerEvent ) {
		ev.stopPropagation( );
		ev.preventDefault( );

		this.focus( );

		this._mdown = true;
		this._irect = this.getBoundingRect( );

		this.setCapture( ev.pointerId );
	}

	private _getMinMax( ) {
		const min = parseInt( this._range.getAttribute( 'min' ) );
		const max = parseInt( this._range.getAttribute( 'max' ) );
		return [min,max];
	}

	private _on_mousemove( ev: PointerEvent ) {
		if( this._mdown ) {

			let pos: number;
			let size: number;
			
			if( !this.props.vertical ) {
				pos = ev.offsetX;	// - this._irect.left;
				size = this._irect.width;
			}
			else {
				pos  = ev.offsetY;	// - this._irect.top;
				size = this._irect.height;
			}
		
			let perc = pos / size;
			if( this.props.vertical ) {
				perc = 1-perc;
			}

			const [min,max] = this._getMinMax( );

			this._range.setNumValue( min + (perc * (max-min) ) );
			this._update( );
		}
	}

	private _update( ) {
		const value = this._range.getNumValue( );
		const [min,max] = this._getMinMax( );

		let perc = max>min ? value / Math.abs(max-min) * 100 : 0;

		if( !this.props.vertical ) {
			this._thumb.setStyleValue( "left", perc+"%" );
			this._bar.setStyleValue( "width", perc+"%" );
		}
		else {
			// 0 is at bottom
			perc = 100-perc;
			this._thumb.setStyleValue( "top", perc+"%" );
			this._bar.setStyleValue( "height", perc+"%" );
		}

		this.fire( "change", { value } );
	}

	private _on_mouseup( ev: PointerEvent ) {
		if( this._mdown ) {
			this.releaseCapture( ev.pointerId );
			this._mdown = false;
		}
	}

	private _on_key( ev: KeyboardEvent ) {
		console.log( ev.key );

		let stp = this.props.step ?? 1;
		let inc = 0;
		switch( ev.key ) {
			case "ArrowRight":
			case "ArrowUp": inc = stp; break;

			case "ArrowLeft":
			case "ArrowDown": inc = -stp; break;
		}

		if( inc ) {
			if( ev.ctrlKey ) {
				inc *= 10;
			}

			this._range.setNumValue( this._range.getNumValue()+inc );
			this._update( );
		}
	}

	setMin( min: number ) {
		this._range.setAttribute( 'min', min+'' );
		this._update( );
	}

	setMax( max: number ) {
		this._range.setAttribute( 'max', max+'' );
		this._update( );
	}

	setValue( v: number ) {
		this._range.setNumValue( v );
		this._update( );
	}
}