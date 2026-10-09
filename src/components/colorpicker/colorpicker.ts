/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file colorpicker.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Color, Hsv } from '../../core/core_colors';
import { Rect, clamp, class_ns, isFeatureAvailable } from '../../core/core_tools';

import { Component, ComponentEvent, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { Box, BoxProps, HBox, VBox } from '../boxes/boxes';

import "./colorpicker.module.scss"

export interface ColorPickerProps extends ComponentProps {
	color: string | Color;

	/** Colors offered under the sliders, to be picked with a click. */
	swatches?: ( string | Color )[];

	/** Adds a "no color" swatch: picking it fires `change` with a null color. */
	nullable?: boolean;
}

interface HueChangeEvent extends ComponentEvent {
	hue: number;
}

interface AlphaChangeEvent extends ComponentEvent {
	alpha: number;
}

interface SatChangeEvent extends ComponentEvent {
	saturation: number;
	value: number;
}

interface CommonEvents extends ComponentEvents {
	hue_change: HueChangeEvent;	
	alpha_change: AlphaChangeEvent;
	sat_change: SatChangeEvent;	
}

/**
 * 
 */

@class_ns( "x4" )
export class Saturation extends Box<BoxProps,CommonEvents> {

	private mdown = false;
	private irect: Rect;
	
	private hsv: Hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };

	private color: Component;
	private thumb: Component;
		
	constructor( props: BoxProps, init: Hsv ) {
		super( props );

		this.setContent( [
			this.color = new Component( { cls: "overlay" } ),
			new Component( { cls: "overlay", style: { backgroundImage: "linear-gradient(90deg, rgb(255, 255, 255), transparent)" } } ),
			new Component( { cls: "overlay", style: { backgroundImage: "linear-gradient(0deg, rgb(0, 0, 0), transparent)" } } ),
			this.thumb = new Component( { cls: "thumb" } ),
		]);

		this.setDOMEvents( {
			pointerdown: ( e ) => this.mousedown( e ),
			pointermove: ( e ) => this.mousemove( e ),
			pointerup: ( e ) => this.mouseup( e ),
			created: () => this.updateThumbMarker( ),
		} );

		this.updateBaseColor( init );
	}

	mousedown( ev: PointerEvent ) {
		this.mdown = true;
		this.irect = this.getBoundingRect( );
		this.setCapture( ev.pointerId );
	}

	mousemove( ev: PointerEvent ) {

		if( this.mdown ) {
			const ir = this.irect;

			let hpos = clamp(ev.clientX - ir.left, 0, ir.width );
			let hperc = hpos / ir.width;

			let vpos = clamp(ev.clientY - ir.top, 0, ir.height );
			let vperc = vpos / ir.height;

			this.hsv.saturation = hperc;
			this.hsv.value = 1-vperc;
			
			this.updateThumbMarker( );
			this.fire( "sat_change", { saturation: this.hsv.saturation, value: this.hsv.value } );
		}
	}

	mouseup( ev: PointerEvent ) {
		if( this.mdown ) {
			this.releaseCapture( ev.pointerId );
			this.mdown = false;
		}
	}

	updateThumbMarker( ) {
		const rc = this.color.getBoundingRect( );
		
		this.thumb.setStyle( { 
			left: (this.hsv.saturation * rc.width ) + 'px',
			bottom: ( this.hsv.value * rc.height ) + 'px'
		} );
	}

	updateBaseColor( hsv: Hsv ) {
		const base = new Color(0,0,0)
		base.setHsv( hsv.hue, 1, 1, 1 );
		this.color.setStyleValue( "backgroundColor", base.toRgbString(false) );
	}

	/**
	 * Shows another color: base color and thumb. Does not fire `sat_change`.
	 */

	setColor( hsv: Hsv ) {
		this.hsv.saturation = hsv.saturation;
		this.hsv.value = hsv.value;

		this.updateBaseColor( hsv );
		this.updateThumbMarker( );
	}

	move( sens: string, delta: number ) {
		switch( sens ) {
			case 'saturation': {
				this.hsv.saturation += delta;
				if( this.hsv.saturation<0 ) {
					this.hsv.saturation = 0;
				}
				else if( this.hsv.saturation>1 ) {
					this.hsv.saturation = 1;
				}
				
				this.fire( "sat_change", { saturation: this.hsv.saturation, value: this.hsv.value } );
				this.updateThumbMarker( );
				break;
			}

			case 'value': {
				this.hsv.value += delta;
				if( this.hsv.value<0 ) {
					this.hsv.value = 0;
				}
				else if( this.hsv.value>1 ) {
					this.hsv.value = 1;
				}

				this.fire( "sat_change", { saturation: this.hsv.saturation, value: this.hsv.value } );
				this.updateThumbMarker( );
				break;
			}
		}
	}
}



/**
 * @internal
 */

@class_ns( "x4" )
class HueSlider extends Box<BoxProps,CommonEvents> {

	private thumb: Component;
	private hsv: Hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };

	private mdown = false;
	private irect: Rect;

	constructor( props: BoxProps, init: Hsv ) {
		super( props );

		this.setContent( [
			this.thumb = new Component( { cls: "thumb", left: "50%" } ),
		]);

		this.setDOMEvents( {
			pointerdown: ( e ) => this.mousedown( e ),
			pointermove: ( e ) => this.mousemove( e ),
			pointerup: ( e ) => this.mouseup( e ),
		} );

		this.updateHue( init );
	}

	mousedown( ev: PointerEvent ) {
		this.mdown = true;
		this.irect = this.getBoundingRect( );
		this.setCapture( ev.pointerId );
	}

	mousemove( ev: PointerEvent ) {

		if( this.mdown ) {
			const ir = this.irect;

			let hpos = clamp(ev.clientX - ir.left, 0, ir.width );
			let hperc = hpos / ir.width;

			this.hsv.hue = hperc;

			this.updateHue( this.hsv );
			this.fire( "hue_change", { hue: this.hsv.hue } );
		}
	}

	mouseup( ev: PointerEvent ) {
		if( this.mdown ) {
			this.releaseCapture( ev.pointerId );
			this.mdown = false;
		}
	}

	updateHue( hsv: Hsv ) {
		this.hsv.hue = hsv.hue;
		this.thumb.setStyleValue( "left", (hsv.hue*100)+'%' );
	}

	move( delta: number ) {
		this.hsv.hue += delta;
		if( this.hsv.hue<0 ) {
			this.hsv.hue = 0;
		}
		else if( this.hsv.hue>1 ) {
			this.hsv.hue = 1;
		}

		this.fire( "hue_change", { hue: this.hsv.hue } );
		this.updateHue( this.hsv );
	}
}


/**
 * @internal
 */

@class_ns( "x4" )
class AlphaSlider extends Box<BoxProps,CommonEvents> {
	
	private thumb: Component;
	private color: Component;
	private hsv: Hsv = { hue: 1, saturation: 1, value: 1, alpha: 1 };

	private mdown = false;
	private irect: Rect;
	
	constructor( props: BoxProps, init: Hsv ) {
		super( props );

		this.setContent( [
			new Component( { cls: "overlay checkers"} ),
			this.color = new Component( { cls: "overlay color"} ),
			this.thumb = new Component( { cls: "thumb", left: "50%" } ),
		]);

		this.setDOMEvents( {
			pointerdown: ( e ) => this._on_mousedown( e ),
			pointermove: ( e ) => this._on_mousemove( e ),
			pointerup: ( e ) => this._on_mouseup( e ),
		} );

		this.updateAlpha( );
		this.updateBaseColor( init );
	}

	_on_mousedown( ev: PointerEvent ) {
		this.mdown = true;
		this.irect = this.getBoundingRect( );
		this.setCapture( ev.pointerId );
	}

	_on_mousemove( ev: PointerEvent ) {

		if( this.mdown ) {
			const ir = this.irect;

			let hpos = clamp(ev.clientX - ir.left, 0, ir.width );
			let hperc = hpos / ir.width;

			this.hsv.alpha = hperc;

			this.updateAlpha( );
			this.fire( "alpha_change", { alpha: this.hsv.alpha } );
		}
	}

	_on_mouseup( ev: PointerEvent ) {
		if( this.mdown ) {
			this.releaseCapture( ev.pointerId );
			this.mdown = false;
		}
	}

	updateAlpha( ) {
		this.thumb.setStyleValue( "left", (this.hsv.alpha*100)+'%' );
	}

	updateBaseColor( hsv: Hsv ) {
		const base = new Color(0,0,0)
		base.setHsv( hsv.hue, hsv.saturation, hsv.value, 1 );
		this.color.setStyleValue( "backgroundImage", `linear-gradient(90deg, transparent, ${base.toRgbString(false)})` );		
	}

	setColor( hsv: Hsv ) {
		this.hsv = hsv;
		this.updateBaseColor( hsv );
		this.updateAlpha( );
	}

	move( delta: number ) {
		this.hsv.alpha += delta;
		if( this.hsv.alpha<0 ) {
			this.hsv.alpha = 0;
		}
		else if( this.hsv.alpha>1 ) {
			this.hsv.alpha = 1;
		}

		this.fire( "alpha_change", { alpha: this.hsv.alpha } );
		this.updateAlpha( );
	}
}


/**
 * 
 */

/**
 * Fired by ColorPicker and ColorInput when the user changes the color.
 *
 * `value` is the color as text: "#rrggbb", or "#rrggbbaa" when it is not
 * opaque. Both are null when the user picked "no color" (`nullable`).
 */

export interface EvColorChange extends EvChange {
	color: Color;
	readonly value: string;
}

interface ColorPickerChangeEvents extends ComponentEvents {
	change: EvColorChange
}

/**
 *
 */

@class_ns( "x4" )
export class ColorPicker extends VBox<ColorPickerProps,ColorPickerChangeEvents> {

	private _base: Color;
	private _hsv: Hsv;
	private _sat: Saturation;
	private _swatch: Component;
	private _hue: HueSlider;
	private _alpha: AlphaSlider;
	private _swatches: HBox;


	constructor( props: ColorPickerProps ) {
		super( props );

		if( props.color instanceof Color ) {
			this._base = props.color;
		}
		else {
			this._base = new Color( props.color );
		}

		const hsv = this._hsv = this._base.toHsv( );

		this.setAttribute( "tabindex", 0 );

		this.setContent( [
			this._sat = new Saturation( { }, hsv ),
			new HBox( {
				cls: "body",
				content: [
					new VBox( {cls: "x4flex", content: [
						this._hue = new HueSlider( { }, hsv ),
						this._alpha = new AlphaSlider( { }, hsv ),
					] } ),
					new Box( { cls: "swatch", content: [
						new Component( { cls: "overlay checkers" } ),
						this._swatch = new Component( { cls: "overlay" } ),
					] } )
				]
			}),
			this._swatches = new HBox( { cls: "swatches" } ),
		]);

		this._sat.on( "sat_change", ( ev ) => {
			this._hsv.saturation = ev.saturation;
			this._hsv.value = ev.value;
			this._changed( );
			this._alpha.updateBaseColor( this._hsv );
		} );

		this._hue.on( 'hue_change', ( ev ) => {
			this._hsv.hue = ev.hue;
			this._sat.updateBaseColor( this._hsv );
			this._alpha.updateBaseColor( this._hsv );
			this._changed( );
		} );

		this._alpha.on( 'alpha_change', ( ev ) => {
			this._hsv.alpha = ev.alpha;
			this._changed( );
		} );

		if( isFeatureAvailable("eyedropper") ) {
			this._swatch.addDOMEvent( "click", ( e ) => {
				const eyeDropper = new (window as any).EyeDropper();
				eyeDropper.open( ).then( ( result: any ) => {
					this._pick( new Color( result.sRGBHex ) );
				}).catch( (_: any )=> {
					/* silence */
				} );
			})
		}

		this.addDOMEvent( "keydown", ( ev ) => this._onkey( ev ) );

		this.setSwatches( props.swatches );
		this._changed( );
	}

	/**
	 * the sliders moved: compute the color, show it, tell it
	 */

	private _changed( ) {
		const hsv = this._hsv;

		this._base.setHsv( hsv.hue, hsv.saturation, hsv.value, hsv.alpha );
		this._refresh( );
		this._notify( );
	}

	private _refresh( ) {
		this._swatch.setStyleValue( "backgroundColor", this._base.toRgbString() );
		this._swatch.setAttribute( "tooltip", this._base.toRgbString() );
	}

	private _notify( ) {
		this.fire( "change", { color: this._base, value: this._base.toHexString() } );
	}

	/**
	 * the user took a color as a whole (eye dropper, swatch)
	 */

	private _pick( color: Color ) {
		this.setColor( color );
		this._notify( );
	}

	/**
	 * The current color. It is the object the `change` event gives, and it
	 * changes with the picker: copy it to keep a value.
	 */

	getColor( ): Color {
		return this._base;
	}

	/**
	 * Shows another color. Does not fire `change`.
	 */

	setColor( color: Color | string ) {
		const rgb = ( color instanceof Color ? color : new Color( color ) ).toRgb( );

		// the color itself is kept as given: going through hsv could shift it
		this._base.setRgb( rgb.red, rgb.green, rgb.blue, rgb.alpha );

		const hsv = this._base.toHsv( );
		this._hsv.hue = hsv.hue;
		this._hsv.saturation = hsv.saturation;
		this._hsv.value = hsv.value;
		this._hsv.alpha = hsv.alpha;

		this._sat.setColor( this._hsv );
		this._hue.updateHue( this._hsv );
		this._alpha.setColor( this._hsv );

		this._refresh( );
	}

	/**
	 * Colors offered under the sliders. A click on one of them takes it
	 * and fires `change`. Nothing is shown without swatches.
	 */

	setSwatches( swatches: ( string | Color )[] ) {
		const items: Component[] = [];

		if( this.props.nullable ) {
			items.push( new Component( {
				cls: "item none",
				dom_events: {
					click: ( ) => this.fire( "change", { color: null, value: null } ),
				},
			} ) );
		}

		for( const swatch of swatches ?? [] ) {
			const color = swatch instanceof Color ? swatch : new Color( swatch );
			if( color.isInvalid( ) ) {
				continue;
			}

			items.push( new Component( {
				cls: "item",
				tooltip: color.toHexString( ),
				style: { backgroundColor: color.toRgbString( ) },
				dom_events: {
					click: ( ) => this._pick( color ),
				},
			} ) );
		}

		this._swatches.setContent( items );
		this._swatches.show( items.length>0 );
	}

	private _onkey( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "ArrowLeft": {
				if( ev.ctrlKey ) {
					this._hue.move( -0.01 );
				}
				else {
					this._sat.move( "saturation", -0.01 );
				}
				break;
			}

			case "ArrowRight": {
				if( ev.ctrlKey ) {
					this._hue.move( 0.01 );
				}
				else {
					this._sat.move( "saturation", 0.01 );
				}
				break;
			}

			case "ArrowUp": {
				if( ev.ctrlKey ) {
					this._alpha.move( 0.01 );
				}
				else {
					this._sat.move( "value", 0.01 );
				}
				break;
			}

			case "ArrowDown": {
				if( ev.ctrlKey ) {
					this._alpha.move( -0.01 );
				}
				else {
					this._sat.move( "value", -0.01 );
				}
				break;
			}
		}
	}
}