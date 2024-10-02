/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file core_colors.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { clamp, isString } from './core_tools';


function hx( v: number ) {
	const hex = v.toString( 16 );
	return hex.padStart( 2, '0' );
}

function round( v: number ) {
	return Math.round(v);
}


export interface Rgb {
	red: number;
	green: number;
	blue: number;
	alpha: number;
}

export interface Hsv {
	hue: number;
	saturation: number;
	value: number;
	alpha: number;
}


export class Color {

	private rgb: [red:number,green:number,blue:number,alpha:number] = [0,0,0,1];
	private invalid = false;

	constructor( value: string );
	constructor( r: number, g: number, b: number, a?: number );
	constructor( ...args: any[] ) {
		if( isString(args[0] ) ) {
			this.setValue(  args[0] );
		}
		else {
			this.setRgb( args[0], args[1], args[2], args[3] );
		}
	}

	/**
	 * accepts:
	 * 	#aaa
	 *  #ababab
	 *  #ababab55
	 *  rgb(a,b,c)
	 *  rgba(a,b,c,d)
	 *  var( --color-5 )
	 */
	
	setValue( value: string ): this {

		this.invalid = false;

		if( value.length==4 && /#[0-9a-fA-F]{3}/.test(value) ) {
			const r1 = parseInt( value[1], 16 );
			const g1 = parseInt( value[2], 16 );
			const b1 = parseInt( value[3], 16 );
			return this.setRgb( r1<<4|r1, g1<<4|g1, b1<<4|b1, 1.0 );
		}

		if( value.length==7 && /#[0-9a-fA-F]{6}/.test(value) ) {
			const r1 = parseInt( value[1], 16 );
			const r2 = parseInt( value[2], 16 );
			const g1 = parseInt( value[3], 16 );
			const g2 = parseInt( value[4], 16 );
			const b1 = parseInt( value[5], 16 );
			const b2 = parseInt( value[6], 16 );
			return this.setRgb( r1<<4|r2, g1<<4|g2, b1<<4|b2, 1.0 );
		}

		if( value.length==9 && /#[0-9a-fA-F]{8}/.test(value) ) {
			const r1 = parseInt( value[1], 16 );
			const r2 = parseInt( value[2], 16 );
			const g1 = parseInt( value[3], 16 );
			const g2 = parseInt( value[4], 16 );
			const b1 = parseInt( value[5], 16 );
			const b2 = parseInt( value[6], 16 );
			const a1 = parseInt( value[7], 16 );
			const a2 = parseInt( value[8], 16 );
			return this.setRgb( r1<<4|r2, g1<<4|g2, b1<<4|b2, (a1<<4|a2) / 255.0 );
		}

		if( value.startsWith('rgba') ) {
			const re = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*((\d+)|(\d*\.\d+)|(\.\d+))\s*\)/;
			const m = re.exec( value );
			if( m ) {
				return this.setRgb( parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4]) );
			}
		}
		else if( value.startsWith('rgb') ) {
			const re = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
			const m = re.exec( value );
			if( m ) {
				return this.setRgb( parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1.0 );
			}
		}
		else if( value.startsWith("var") ) {
			const re = /var\s*\(([^)]*)\)/;
			const m = re.exec( value );
			if( m ) {
				const expr = m[1].trim( );
				const style = getComputedStyle( document.documentElement );
				const value = style.getPropertyValue( expr );
				return this.setValue( value );
			}
		}

		this.invalid = true;
		return this.setRgb(255,0,0,1);
	}

	setHsv( h: number, s: number, v: number, a = 1.0 ): this {
		
		let i = Math.min(5, Math.floor(h * 6)),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);

		let R, G, B;

		switch (i) {
		case 0:
			R = v;
			G = t;
			B = p;
			break;
		case 1:
			R = q;
			G = v;
			B = p;
			break;
		case 2:
			R = p;
			G = v;
			B = t;
			break;
		case 3:
			R = p;
			G = q;
			B = v;
			break;
		case 4:
			R = t;
			G = p;
			B = v;
			break;
		case 5:
			R = v;
			G = p;
			B = q;
			break;
		}

		return this.setRgb( R*255, G*255, B*255, a );
	}


	setRgb( r: number, g: number, b: number, a: number ): this {
		this.rgb = [clamp(r,0,255),clamp(g,0,255),clamp(b,0,255),clamp(a,0,1)];
		return this;
	}

	toRgbString( withAlpha?: boolean ): string {
		const _ = this.rgb;
		return withAlpha===false || _[3]==1 ? `rgb(${round(_[0])},${round(_[1])},${round(_[2])})` : `rgba(${round(_[0])},${round(_[1])},${round(_[2])},${_[3].toFixed(3)})`
	}

	toHexString( ): string {
		const _ = this.rgb;
		return _[3]==1 ? `#(${hx(_[0])},${hx(_[1])},${hx(_[2])})` : `rgba(${hx(_[0])},${hx(_[1])},${hx(_[2])},${hx(_[3]*255)})`
	}

	toRgb( ): Rgb {
		const _ = this.rgb;
		return { red: _[0], green: _[1], blue: _[2], alpha: _[3] };
	}

	toHsv( ): Hsv {
		
		let el = this.toRgb( );

		el.red /= 255.0;
		el.green /= 255.0;
		el.blue /= 255.0;
		
		const max = Math.max(el.red, el.green, el.blue);
		const min = Math.min(el.red, el.green, el.blue);
		const delta = max - min;
		const saturation = (max === 0) ? 0 : (delta / max);
		const value = max;

		let hue;

		if (delta === 0) {
			hue = 0;
		}
		else {
			switch (max) {
			case el.red:
				hue = (el.green - el.blue) / delta / 6 + (el.green < el.blue ? 1 : 0);
				break;

			case el.green:
				hue = (el.blue - el.red) / delta / 6 + 1 / 3;
				break;

			case el.blue:
				hue = (el.red - el.green) / delta / 6 + 2 / 3;
				break;
			}
		}

		return { hue, saturation, value, alpha: el.alpha };
	}

	getAlpha( ) {
		return this.rgb[3];
	}

	setAlpha( a: number ): this {
		this.rgb[3] = clamp( a, 0, 1 );
		return this;
	}

	isInvalid( ) {
		return this.invalid;
	}
}