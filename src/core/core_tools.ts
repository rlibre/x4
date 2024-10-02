

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

