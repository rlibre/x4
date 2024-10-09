/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file image.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '@core/core_tools.js';
import { Component, ComponentProps } from '../../core/component.js';

import "./image.module.scss"

export interface ImageProps extends ComponentProps {
	src: string;
	fit?: "contain" | "cover" | "fill" | "scale-down";
	position?: string;
	lazy?: boolean;
	alt?: string;
	draggable?: boolean;
}

/**
 * 
 */

@class_ns( "x4" )
export class Image extends Component<ImageProps> {

	private _img: Component;

	constructor( props: ImageProps ) {
		super( props );

		this._img = new Component( {
			tag: "img",
			attrs: {
				loading: props.lazy,
				alt: props.alt,
				draggable: props.draggable ?? false,
			},
			style: {
				width: "100%",
				height: "100%",
				objectFit: props.fit,
				objectPosition: props.position,
			}
		})
		
		this.setContent( this._img );
		this.setImage( props.src );
	}

	/**
	 * 
	 */
	
	setImage( src: string ) {
		this._img.setAttribute( "src", src );
	}
}