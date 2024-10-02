import { Component } from '@core/component';
import { isFeatureAvailable } from '@core/core_tools.js';
import { Color } from '@core/core_colors';

import { BoxProps, HBox } from '../boxes/boxes';
import { Input } from '../input/input.js';
import { Button } from '../button/button.js';


import "./colorinput.module.scss"
import icon from "./pen-light.svg"

//TODO: add swatches

/**
 * 
 */

interface ColorInputProps extends BoxProps {
	color: Color | string;
}

/**
 * 
 */

export class ColorInput extends HBox<ColorInputProps> {
	constructor( props: ColorInputProps ) {
		super( props );

		let swatch: Component;
		let edit: Input;

		this.setContent( [
			swatch = new Component( { cls: "swatch" } ),
			edit = new Input( { type: "text", value: "", spellcheck: false } ),

			isFeatureAvailable("eyedropper") ? new Button( { icon: icon, click: ( ) => {
				const eyeDropper = new (window as any).EyeDropper();
				eyeDropper.open( ).then( ( result: any ) => {
					color = new Color( result.sRGBHex );
					updateColor( color );
				});
			} } ) : null
		])

		edit.addDOMEvent( "input", ( ) => {
			const txt = edit.getValue( );
			const clr = new Color( txt );
			if( !clr.isInvalid() ) {
				color = clr;
				updateColor( color );
			}
		});

		const updateColor = ( clr: Color ) => {
			swatch.setStyleValue( "backgroundColor", clr.toRgbString(false) );
			edit.setValue( clr.toRgbString(false) );
		}

		let color: Color;
		if( props.color instanceof Color ) {
			color = props.color;
		}
		else {
			color = new Color( props.color );
		}

		updateColor( color );
	}
}