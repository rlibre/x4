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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '@core/core_tools.js';
import { Component, ComponentProps } from '../../core/component';

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
 * 
 */

export interface IconProps extends ComponentProps {
	iconId?: string;
}

/**
 * 
 */

@class_ns( "x4" )
export class Icon extends Component<IconProps> {

	constructor( props: IconProps ) {
		super( props );

		this.setIcon( props.iconId );
	}

	/**
	 * change the icon content
	 * @param iconId if name is starting with var: then we use css variable name a path
	 * @example
	 * 
	 * setIcon( "var:home" )
	 * 
	 * import myicon from "./myicon.svg"
	 * setIcon( myicon );
	 * 
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




