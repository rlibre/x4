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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component } from '../../core/component';
import { isFeatureAvailable, class_ns } from '../../core/core_tools.js';
import { Color } from '../../core/core_colors';

import { BoxProps, HBox } from '../boxes/boxes';
import { Input } from '../input/input.js';
import { Button } from '../button/button.js';


import "./colorinput.module.scss"
import icon from "./crosshairs-simple-sharp-light.svg"

//TODO: add swatches
//TODO: better keyboard handling (selection after cursor)

/**
 * 
 */

interface ColorInputProps extends BoxProps {
	color: Color | string;
}

/**
 * 
 */

@class_ns( "x4" )
export class ColorInput extends HBox<ColorInputProps> {
	static "$cls-ns" = "x4";

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