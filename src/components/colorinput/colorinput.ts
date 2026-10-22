/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file colorinput.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { isFeatureAvailable, isFunction, IComponentInterface, IFormElement } from '../../core/core_tools';
import { Color } from '../../core/core_colors';

import { BoxProps, HBox } from '../boxes/boxes';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { Popup } from '../popup/popup';
import { ColorPicker, EvColorChange } from '../colorpicker/colorpicker';


import "./colorinput.module.scss"
import icon from "./crosshairs-simple-sharp-light.svg"

//TODO: better keyboard handling (selection after cursor)

type Swatches = ( Color | string )[];

/**
 *
 */

export interface ColorInputProps extends BoxProps {
	/** The color at start. null: no color is shown. */
	color: Color | string;

	/** Name of the field: with it, a Form reads and writes the color (as "#rrggbb"). */
	name?: string;

	/** How the field writes the color. "rgb" by default: rgb(r,g,b). "hex": #rrggbb. */
	format?: "rgb" | "hex";

	/** A click on the swatch opens a color picker. */
	picker?: boolean;

	/**
	 * Colors offered in the picker. A function is called each time the
	 * picker opens: the list may change with time.
	 */
	swatches?: Swatches | ( ( ) => Swatches );

	/** The field may have no color: emptied, or "no color" picked. */
	nullable?: boolean;

	/** false: the colors are opaque, the picker has no alpha slider (default true). */
	alpha?: boolean;

	/** The text shown in the field while it is empty. */
	placeholder?: string;

	/** The user changed the color (not fired by setColor). */
	change?: EventCallback<EvColorChange>;
}

interface ColorInputEvents extends ComponentEvents {
	change: EvColorChange;
}

/**
 * @cssvar
 * ```
 * --colorinput-btn-background
 * --colorinput-btn-color
 * --colorinput-btn-color-hover
 * --colorinput-popup-background
 * --colorinput-none
 * ```
 */

export class ColorInput extends HBox<ColorInputProps,ColorInputEvents> {
	static classPrefix = "x4";

	static "$cls-ns" = "x4";

	private _color: Color;				// null: no color
	private _swatch: Component;
	private _edit: Input;
	private _swatches: Swatches | ( ( ) => Swatches );
	private _popup: Popup;				// the color picker, once it was opened
	private _closedAt = -1;				// when it closed for the last time (performance.now)

	constructor( props: ColorInputProps ) {
		super( props );

		this.mapPropEvents( props, "change" );
		this._swatches = props.swatches;

		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		this.setContent( [
			this._swatch = new Component( { cls: "swatch" } ),
			this._edit = new Input( { type: "text", value: "", spellcheck: false, placeholder: props.placeholder } ),

			isFeatureAvailable("eyedropper") ? new Button( { icon: icon, click: ( ) => {
				const eyeDropper = new (window as any).EyeDropper();
				eyeDropper.open( ).then( ( result: any ) => {
					this._changed( new Color( result.sRGBHex ) );
				}).catch( (_: any ) => {
					/* silence */
				});
			} } ) : null
		])

		// while it is typed, the text is left alone: the color follows it
		this._edit.addDOMEvent( "input", ( ) => {
			const txt = this._edit.getValue( );

			if( this.props.nullable && txt.trim( )=="" ) {
				this._changed( null, false );
				return;
			}

			const clr = new Color( txt );
			if( !clr.isInvalid() ) {
				this._changed( clr, false );
			}
		});

		// the field is left: the text is written from the color, in the form that was typed
		// (a text that could not be read shows the color that was kept)
		this._edit.addDOMEvent( "change", ( ) => {
			this._show( this._color );
		});

		if( props.picker ) {
			// A click on the swatch opens the picker, a second one closes it.
			// The picker closes by itself as soon as the button goes down
			// outside of it, before the swatch hears of it: it was open if
			// it closed since this very press began.
			let wasOpen = false;

			this._swatch.addClass( "picker" );
			this._swatch.addDOMEvent( "pointerdown", ev => { wasOpen = this._closedAt >= ev.timeStamp; } );
			this._swatch.addDOMEvent( "click", ( ) => {
				if( !wasOpen ) {
					this._openPicker( );
				}
			} );
		}

		this._show( this._parse( props.color ) );
	}

	private _parse( color: Color | string ): Color {
		if( color instanceof Color ) {
			return color;
		}

		// Nothing to show (a color that is not known, or several ones). Whether
		// the user may choose "no color" is another matter: props.nullable.
		if( color===null || color===undefined || color==="" ) {
			return null;
		}

		return new Color( color );
	}

	private _format( color: Color ): string {
		// the form of the text in the field: "#..." or "rgb...", else props.format
		const text = this._edit.getValue( ).trim( ).toLowerCase( );

		let hex = this.props.format=="hex";
		if( text.startsWith( "#" ) ) {
			hex = true;
		}
		else if( text.startsWith( "rgb" ) ) {
			hex = false;
		}

		// rgba / #rrggbbaa when the color is not opaque
		return hex ? color.toHexString( ) : color.toRgbString( true );
	}

	/**
	 * show a color: swatch and text
	 * @param text false while the user empties the field: the text is left alone
	 */

	private _show( color: Color, text = true ) {
		// no alpha: every color shown is opaque, typed, picked or given
		if( color && this.props.alpha===false ) {
			color.setAlpha( 1 );
		}

		this._color = color;

		this._swatch.setClass( "none", !color );
		// the stylesheet draws it over checkers
		this._swatch.setStyleVariable( "--swatch-color", color ? color.toRgbString( true ) : "" );

		if( text ) {
			this._edit.setValue( color ? this._format( color ) : "" );
		}
	}

	/**
	 * the user changed the color
	 */

	private _changed( color: Color, text = true ) {
		this._show( color, text );
		this.fire( "change", { color, value: color ? color.toHexString( ) : null } );
	}

	/**
	 * The color picker, with the swatches, under the field. It closes on
	 * a click outside of it.
	 */

	private _openPicker( ) {
		const swatches = isFunction( this._swatches ) ? this._swatches( ) : this._swatches;

		// the picker works on its own color: it changes it in place
		const picker = new ColorPicker( {
			color: this._color ? new Color( this._color.toHexString( ) ) : new Color( 255, 255, 255 ),
			swatches,
			nullable: this.props.nullable,
			alpha: this.props.alpha,
		} );

		const popup = this._popup = new Popup( { cls: "x4colorinput-popup", autoClose: true, content: picker } );
		popup.on( "closed", ( ) => { this._closedAt = performance.now( ); } );

		// after the construction: the picker fires a first change when it is built
		picker.on( "change", ev => {
			this._changed( ev.color ? new Color( ev.value ) : null );

			if( !ev.color ) {
				popup.close( );
			}
		} );

		popup.displayNear( this.getBoundingRect( ), "top left", "bottom left", { x: 0, y: 6 } );
	}

	/**
	 * The current color, null when there is none.
	 */

	getColor( ): Color {
		return this._color;
	}

	/**
	 * The current color as "#rrggbb" ("#rrggbbaa" when it is not opaque),
	 * null when there is none.
	 */

	getValue( ): string {
		return this._color ? this._color.toHexString( ) : null;
	}

	/**
	 * Shows another color, or none (null). Does not fire `change`.
	 */

	setColor( color: Color | string ) {
		this._show( this._parse( color ) );
	}

	/**
	 * Changes the colors offered in the picker (see props.swatches).
	 */

	setSwatches( swatches: Swatches | ( ( ) => Swatches ) ) {
		this._swatches = swatches;
	}

	/**
	 *
	 */

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ): any => { return this.getValue( ); },
				setRawValue: ( v: any ) => { this.setColor( v ); },
				isValid: ( ) => { return true; }
			};

			return i as unknown as T;
		}

		return super.queryInterface( name );
	}
}
