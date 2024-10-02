/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file core_tools.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


/**
 * @returns true if object is a string
 */
export function isString(val: any): val is string {
	return typeof val === 'string';
}

/**
 * @returns true if object is a number
 */

export function isNumber( v: any ): v is number {
	return typeof v === 'number' && isFinite(v);
}

/**
 * @returns true if object is an array
 */
export function isArray(val: any): val is any[] {
	return val instanceof Array;
}

/**
 * @returns true if object is a function
 */

export function isFunction(val: any): val is Function {
	return val instanceof Function;
}

/**
 * generic constructor
 */

export type Constructor<P> = {
	new(...params: any[]): P;
};


/**
 * a way to explain that the given string may be unsafe but must be treated a sstring
 * @example
 * label.setText( unsafehtml`<b>Bold</b> text` );
 * label.setText( new UnsafeHtml("<b>Bold</b> text`" ) );
 */

export class UnsafeHtml extends String {
	constructor( value: string ) {
		super( value );
	}
}

export function unsafeHtml( x: string ): UnsafeHtml {
	return new UnsafeHtml( x );
}

/**
 * 
 */

export function clamp<T>( v: T, min: T, max: T ) : T {
	if( v<min ) { return min; }
	if( v>max ) { return max; }
	return v;
}


/**
 * generic Rectangle 
 */

export interface IRect {
	left: number;
    top: number;
    height: number;
    width: number;
}

/**
 * 
 */

export class Rect implements IRect {
	left: number;
	top: number;
	height: number;
	width: number;

	constructor( );
	constructor( l: number, t: number, w: number, h: number );
	constructor( l: Rect );
	constructor( l?: number | IRect, t?: number, w?: number, h?: number ) {
		if( l!==undefined ) {
			if( isNumber( l ) ) {
				this.left = l;
				this.top = t;
				this.width = w;
				this.height = h;
			}
			else {
				Object.assign( this, l );
			}
		}
	}
	
	get right( ) {
		return this.left+this.width; 
	}

	get bottom( ) {
		return this.top+this.height;
	}
}


/**
 * generic Point
 */

export interface Point {
	x: number;
	y: number;
}

/**
 * 
 */

export interface IComponentInterface {
}

// form-element
export interface IFormElement extends IComponentInterface {
	getRawValue( ): any;
	setRawValue( v: any ): void;
}

/**
 * 
 */

interface Features {
	eyedropper: 1,
}

export function isFeatureAvailable( name: keyof Features ): boolean {
	switch( name ) {
		case "eyedropper": return "EyeDropper" in window;
	}

	return false;
}

export class Timer {
	
	protected _timers: Map<string,any>;
	
	/**
	 * 
	 */

	setTimeout( name: string, time: number, callback: Function ) {
		if( !this._timers ) {
			this._timers = new Map( );
		}
		else {
			this.clearTimeout( name );
		}

		const tm = setTimeout( callback, time );
		this._timers.set( name, tm );

		return tm;
	}

	clearTimeout( name: string ) {
		if( this._timers && this._timers.has(name) ) {
			clearTimeout( this._timers.get(name) );
			this._timers.delete( name );
		}
	}

	/**
	 * 
	 */

	setInterval( name: string, time: number, callback: Function ) {
		if( !this._timers ) {
			this._timers = new Map( );
		}
		else {
			this.clearInterval( name );
		}

		const tm = setInterval( callback, time );
		this._timers.set( name, tm );

		return tm;
	}

	clearInterval( name: string ) {
		if( this._timers && this._timers.has(name) ) {
			clearInterval( this._timers.get(name) );
			this._timers.delete( name );
		}
	}

	clearAllTimeouts( ) {
		this._timers?.forEach( t => {
			clearTimeout( t );
		} );

		this._timers = null;
	}
}

/**
 * 
 */

export function asap( callback: ( ) => void ) {
	return requestAnimationFrame( callback );
}
