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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { IComponentInterface, IFormElement, Rect } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { Input } from '../input/input';

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
	/** for a Form: it reads the value as a number */
	name?: string;
	change?: EventCallback<EvChange>;
}

/**
 * 
 * @cssvar
 * ```
 * --slider-track
 * --slider-thumb-background
 * --slider-thumb-border
 * --slider-thumb-border-focus 
 * ```
 */

export class Slider extends Component<SliderProps,SliderEvents> {
	static classPrefix = "x4";

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

		// the name is on the slider: a Form finds it (queryInterface). The hidden range keeps
		// the value: the browser brings it between min and max, on the step
		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

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
		const min = parseFloat( this._range.getAttribute( 'min' ) );
		const max = parseFloat( this._range.getAttribute( 'max' ) );
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
			this._update( true );
		}
	}

	// notify: a change made by the user (drag, arrows); not by the code, nor at the construction
	private _update( notify = false ) {
		const value = this._range.getNumValue( );
		const [min,max] = this._getMinMax( );

		// from min: min is at 0%, max at 100%
		let perc = max>min ? (value-min) / (max-min) * 100 : 0;

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

		if( notify ) {
			this.fire( "change", { value } );
		}
	}

	private _on_mouseup( ev: PointerEvent ) {
		if( this._mdown ) {
			this.releaseCapture( ev.pointerId );
			this._mdown = false;
		}
	}

	private _on_key( ev: KeyboardEvent ) {
		//console.log( ev.key );

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
			this._update( true );
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

	getValue( ) {
		return this._range.getNumValue( );
	}

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ) => this.getValue( ),
				setRawValue: ( v: any ) => { this.setValue( +v ); },
				isValid: ( ) => true,
			};

			return i as unknown as T;
		}

		return super.queryInterface( name );
	}
}