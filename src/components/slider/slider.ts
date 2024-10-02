/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file slider.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, ComponentEvent } from '@core/component';
import { Rect } from '@core/core_tools.js';

import { HBox } from '../boxes/boxes';
import { Input } from '../input/input.js';

import './slider.module.scss';

interface ChangeEvent extends ComponentEvent {
	value: number;
}

interface SliderEvents extends ComponentEvents {
	change: ChangeEvent;
}

interface SliderProps extends ComponentProps {
	value: number;
	min: number;
	max: number;
	step?: number;
}

export class Slider extends Component<SliderProps,SliderEvents> {

	private _mdown = false;
	private _irect: Rect = null;
	private _thumb: Component = null;
	private _bar: Component = null;
	private _range: Input = null;


	constructor( props: SliderProps ) {
		super( props );

		this.setContent( [
			new HBox( { cls: "track", content: [
				this._bar = new Component( { cls: "bar" } ),
				this._thumb = new Component( { cls: "thumb" } ),
			] }),
			this._range = new Input( { type: "range", hidden: true, value: props.value, min: props.min, max: props.max, step: props.step } )
		]);

		this.setAttribute( "tabindex", 0 );

		this.setDOMEvents( {
			pointerdown: ( ev ) => this._on_mousedown( ev ),
			pointermove: ( ev ) => this._on_mousemove( ev ),
			pointerup: ( ev ) => this._on_mouseup( ev ),
			keydown: ( ev ) => this._on_key( ev ),
		} );

		this._range.addDOMEvent( "change", ( ev: Event) => {
			//console.log( ev );
		})
	}

	private _on_mousedown( ev: PointerEvent ) {
		ev.stopPropagation( );
		ev.preventDefault( );

		this.focus( );

		this._mdown = true;
		this._irect = this.getBoundingRect( );

		this.setCapture( ev.pointerId );
	}

	private _on_mousemove( ev: PointerEvent ) {
		if( this._mdown ) {
			let pos = ev.pageX - this._irect.left;
			if( pos<0 ) {
				pos = 0;
			}
			else if( pos>this._irect.width ) {
				pos = this._irect.width;
			}

			let perc = pos / this._irect.width * 100;
			this._range.setNumValue( perc );
			
			this._update( );
		}
	}

	private _update( ) {
		const value = this._range.getNumValue( );

		const perc = value / (this.props.max-this.props.min) * 100;
		this._thumb.setStyleValue( "left", perc+"%" );
		this._bar.setStyleValue( "width", perc+"%" );
		//thumb.setAttribute( "tooltip", value );

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
}