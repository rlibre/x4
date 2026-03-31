/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file icon.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools.ts';
import { Component, ComponentProps } from '../../core/component.ts';

import "./icon.module.scss"

type solveCallback = (data:string)=>void;

/**
 * 
 */

class SvgLoader {
	private cache: Map<string,string>;
	private waiters: Map<string,solveCallback[]>;

	constructor( ) {
		this.cache = new Map( );
		this.waiters = new Map( );
	}

	async load( file: string ): Promise<string> {

		if( this.cache.has(file) ) {
			return Promise.resolve( this.cache.get(file) );
		}

		return new Promise( (resolve,reject) => {
			if( this.waiters.has(file) ) {
				this.waiters.get(file).push( resolve );
			}
			else {
				this.waiters.set( file, [resolve] );
				this._load( file )
					.then( ( data: string ) => {
						this.cache.set( file, data );
						const ww = this.waiters.get( file );
						ww.forEach( cb => cb(data ) );
					})
			}
		});
	}

	private async _load( file: string ): Promise<string> {
		const res = await fetch( file );
		if( res.ok ) {
			return res.text( );
		}
	}

}

export const svgLoader = new SvgLoader( );

/**
 * Icon component properties.
 *
 * @property {string} [iconId] - Identifier or path of the icon to display.
 */

export interface IconProps extends ComponentProps {
	/**
     * Identifier for the icon.
     * Can be a URL, a CSS variable (prefixed with `var:`), or inline SVG data.
     * @example
     * // Using a CSS variable
     * { iconId: "var:home" }
     * @example
     * // Using an imported SVG
     * import myicon from "./myicon.svg";
     * { iconId: myicon }
     */
	iconId?: string;
}

/**
 * A component for rendering icons.
 * Supports inline SVG, external SVG files, and CSS variables for icon paths.
 * The CSS class for this component is automatically generated as `x4icon`.
 */

@class_ns( "x4" )
export class Icon extends Component<IconProps> {

	/**
	 * Create a new Icon.
	 *
	 * @param {IconProps} props - Optional initial icon identifier.
	 *
	 * @example
	 * const icon = new Icon({ iconId: "check" });
	 */

	constructor( props: IconProps ) {
		super( props );

		this.setIcon( props.iconId );
	}

	/**
     * Sets or updates the icon content.
     * @param iconId - Identifier for the icon.
     *                 If it starts with `var:`, the value is treated as a CSS variable name.
     *                 If it is a data URL (e.g., `data:image/svg+xml,<svg...`), the SVG is rendered directly.
     *                 If it ends with `.svg`, the file is loaded asynchronously.
     *                 Otherwise, it is treated as an image URL.
     * @example
     * // Using a CSS variable
     * setIcon("var:home");
     * @example
     * // Using an imported SVG
     * import myicon from "./myicon.svg";
     * setIcon(myicon);
     */

	setIcon( iconId: string ) {
		this.clearContent( );
			
		if( iconId ) {
			if( iconId.startsWith('var:') ) {
				do {
					const path = iconId.substring( 4 );
					iconId = document.documentElement.style.getPropertyValue( path );
				} while( iconId.startsWith('var:') );
			} 

			if( iconId.startsWith("data:image/svg+xml,<svg") ) {
				this.dom.insertAdjacentHTML('beforeend', iconId.substring(19) );
			}
			else if( iconId.startsWith("<svg") ) {	// raw
				this.dom.insertAdjacentHTML('beforeend', iconId );
			}
			else if( iconId.endsWith(".svg") ) {
				svgLoader.load( iconId ).then( svg => {
					this.clearContent( );
					this.dom.insertAdjacentHTML('beforeend', svg );
				});
			}
			else {
				this.setContent( new Component( { tag: "img", attrs: { src: iconId } } ) );
			}

			this.removeClass( "empty" );
		}
		else {
			this.addClass( "empty" );
		}
	}
}




