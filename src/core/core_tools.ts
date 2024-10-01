
/**
 * check if a value is a string
 * @param val 
 */
export function isString(val: any): val is string {
	return typeof val === 'string';
}

/**
 * 
 */

export function isNumber( v: any ): v is number {
	return typeof v === 'number' && isFinite(v);
}

/**
 * check is a value is an array
 * @param val 
 */
export function isArray(val: any): val is any[] {
	return val instanceof Array;
}

/**
 * 
 */

export function isFunction(val: any): val is Function {
	return val instanceof Function;
}



/**
 * 
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

export interface IRect {
	left: number;
    top: number;
    height: number;
    width: number;
}

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
 * 
 */

export interface Point {
	x: number;
	y: number;
}
