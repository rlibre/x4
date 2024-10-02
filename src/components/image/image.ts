import { Component, ComponentProps } from '@core/component.js';

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