/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
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


function hx(v: number) {
	const hex = v.toString(16);
	return hex.padStart(2, '0');
}

function round(v: number) {
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

	private rgb: [red: number, green: number, blue: number, alpha: number] = [0, 0, 0, 1];
	private invalid = false;

	constructor(value: string);
	constructor(r: number, g: number, b: number, a?: number);
	constructor(...args: any[]) {
		if (isString(args[0])) {
			this.setValue(args[0]);
		}
		else {
			this.setRgb(args[0], args[1], args[2], args[3]);
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
	 *  cyan
	 *  transparent
	 */

	setValue(value: string): this {

		this.invalid = false;

		if( value.startsWith('#') ) {
			if (value.length == 7 && /#[0-9a-fA-F]{6}/.test(value)) {
				const hex = parseInt(value.slice(1), 16);
				return this.setRgb( hex >> 16, hex >> 8, hex, 1.0 );
			}
	
			if (value.length == 4 && /#[0-9a-fA-F]{3}/.test(value)) {
				const hex = parseInt(value.slice(1), 16);
				return this.setRgb( ((hex >> 8)&0xf)*17, ((hex >> 4)&0xf) * 17, (hex & 0x0F)*17, 1.0 );
			}

			if (value.length == 9 && /#[0-9a-fA-F]{8}/.test(value)) {
				const hex = parseInt(value.slice(1), 16) >>> 0;
				return this.setRgb( hex >> 24, hex >> 16, hex >> 8, (hex & 0xFF) / 255.0 );
			}
		}
		else {
			value = value.toLowerCase();
			
			if (value.startsWith('rgba')) {
				const re = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*((\d+)|(\d*\.\d+)|(\.\d+))\s*\)/;
				const m = re.exec(value);
				if (m) {
					return this.setRgb(+m[1], +m[2], +m[3], +m[4]);
				}
			}
			else if (value.startsWith('rgb')) {
				const re = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
				const m = re.exec(value);
				if (m) {
					return this.setRgb(+m[1], +m[2], +m[3], 1.0);
				}
			}
			else if (value.startsWith("var")) {
				const re = /var\s*\(([^)]*)\)/;
				const m = re.exec(value);
				if (m) {
					const expr = m[1].trim();
					const style = getComputedStyle(document.documentElement);
					const value = style.getPropertyValue(expr);
					return this.setValue(value);
				}
			}
			else {
				const xx = CSS_COLORS[value];
				if( xx!==undefined ) {
					return this.setRgb( xx>>16, xx>>8, xx, 1.0 );
				}
				else if( value=="transparent" ) {
					return this.setRgb( 0, 0, 0, 0 );
				}
			}
		}

		this.invalid = true;
		return this.setRgb(255, 0, 0, 1);
	}

	setHsv(h: number, s: number, v: number, a = 1.0): this {

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

		return this.setRgb(R * 255, G * 255, B * 255, a);
	}


	setRgb(r: number, g: number, b: number, a: number): this {
		this.rgb = [clamp(r | 0, 0, 255), clamp(g | 0, 0, 255), clamp(b | 0, 0, 255), clamp(a, 0, 1)];
		return this;
	}

	toRgbString(withAlpha?: boolean): string {
		const _ = this.rgb;
		return withAlpha === false || _[3] == 1 ? `rgb(${round(_[0])},${round(_[1])},${round(_[2])})` : `rgba(${round(_[0])},${round(_[1])},${round(_[2])},${_[3].toFixed(3)})`
	}

	toHexString(): string {
		const _ = this.rgb;
		return _[3] == 1 ? `#${hx(_[0])}${hx(_[1])}${hx(_[2])}` : `#${hx(_[0])}${hx(_[1])}${hx(_[2])}${(hx((_[3] * 255) | 0))}`
	}

	toRgb(): Rgb {
		const _ = this.rgb;
		return { red: _[0], green: _[1], blue: _[2], alpha: _[3] };
	}

	toHsv(): Hsv {

		let el = this.toRgb();

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

	toNumber(): number {
        const _ = this.rgb;
        return ((_[0] << 16) | (_[1] << 8) | _[2]) >>> 0;
    }

	getAlpha() {
		return this.rgb[3];
	}

	setAlpha(a: number): this {
		this.rgb[3] = clamp(a, 0, 1);
		return this;
	}

	isInvalid() {
		return this.invalid;
	}

	lighten(percent: number) : this {

		if (percent < 0) {
			percent = 0;
		}
		else if (percent > 100) {
			percent = 100;
		}

		const factor = percent / 100;

		const adj = (value: number): number => {
			value = (value + (255 - value) * factor) | 0;
			if (value > 255) {
				value = 255;
			}
			return value;
		};

		const _ = this.rgb;
		this.rgb = [adj(_[0]), adj(_[1]), adj(_[2]), _[3]];

		return this;
	}
}




const CSS_COLORS: Record<string, number> = {
    aliceblue: 0xF0F8FF,
    antiquewhite: 0xFAEBD7,
    aqua: 0x00FFFF,
    aquamarine: 0x7FFFD4,
    azure: 0xF0FFFF,
    beige: 0xF5F5DC,
    bisque: 0xFFE4C4,
    black: 0x000000,
    blanchedalmond: 0xFFEBCD,
    blue: 0x0000FF,
    blueviolet: 0x8A2BE2,
    brown: 0xA52A2A,
    burlywood: 0xDEB887,
    cadetblue: 0x5F9EA0,
    chartreuse: 0x7FFF00,
    chocolate: 0xD2691E,
    coral: 0xFF7F50,
    cornflowerblue: 0x6495ED,
    cornsilk: 0xFFF8DC,
    crimson: 0xDC143C,
    cyan: 0x00FFFF,
    darkblue: 0x00008B,
    darkcyan: 0x008B8B,
    darkgoldenrod: 0xB8860B,
    darkgray: 0xA9A9A9,
    darkgreen: 0x006400,
    darkgrey: 0xA9A9A9,
    darkkhaki: 0xBDB76B,
    darkmagenta: 0x8B008B,
    darkolivegreen: 0x556B2F,
    darkorange: 0xFF8C00,
    darkorchid: 0x9932CC,
    darkred: 0x8B0000,
    darksalmon: 0xE9967A,
    darkseagreen: 0x8FBC8F,
    darkslateblue: 0x483D8B,
    darkslategray: 0x2F4F4F,
    darkslategrey: 0x2F4F4F,
    darkturquoise: 0x00CED1,
    darkviolet: 0x9400D3,
    deeppink: 0xFF1493,
    deepskyblue: 0x00BFFF,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1E90FF,
    firebrick: 0xB22222,
    floralwhite: 0xFFFAF0,
    forestgreen: 0x228B22,
    fuchsia: 0xFF00FF,
    gainsboro: 0xDCDCDC,
    ghostwhite: 0xF8F8FF,
    gold: 0xFFD700,
    goldenrod: 0xDAA520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xADFF2F,
    grey: 0x808080,
    honeydew: 0xF0FFF0,
    hotpink: 0xFF69B4,
    indianred: 0xCD5C5C,
    indigo: 0x4B0082,
    ivory: 0xFFFFF0,
    khaki: 0xF0E68C,
    lavender: 0xE6E6FA,
    lavenderblush: 0xFFF0F5,
    lawngreen: 0x7CFC00,
    lemonchiffon: 0xFFFACD,
    lightblue: 0xADD8E6,
    lightcoral: 0xF08080,
    lightcyan: 0xE0FFFF,
    lightgoldenrodyellow: 0xFAFAD2,
    lightgray: 0xD3D3D3,
    lightgreen: 0x90EE90,
    lightgrey: 0xD3D3D3,
    lightpink: 0xFFB6C1,
    lightsalmon: 0xFFA07A,
    lightseagreen: 0x20B2AA,
    lightskyblue: 0x87CEFA,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xB0C4DE,
    lightyellow: 0xFFFFE0,
    lime: 0x00FF00,
    limegreen: 0x32CD32,
    linen: 0xFAF0E6,
    magenta: 0xFF00FF,
    maroon: 0x800000,
    mediumaquamarine: 0x66CDAA,
    mediumblue: 0x0000CD,
    mediumorchid: 0xBA55D3,
    mediumpurple: 0x9370DB,
    mediumseagreen: 0x3CB371,
    mediumslateblue: 0x7B68EE,
    mediumspringgreen: 0x00FA9A,
    mediumturquoise: 0x48D1CC,
    mediumvioletred: 0xC71585,
    midnightblue: 0x191970,
    mintcream: 0xF5FFFA,
    mistyrose: 0xFFE4E1,
    moccasin: 0xFFE4B5,
    navajowhite: 0xFFDEAD,
    navy: 0x000080,
    oldlace: 0xFDF5E6,
    olive: 0x808000,
    olivedrab: 0x6B8E23,
    orange: 0xFFA500,
    orangered: 0xFF4500,
    orchid: 0xDA70D6,
    palegoldenrod: 0xEEE8AA,
    palegreen: 0x98FB98,
    paleturquoise: 0xAFEEEE,
    palevioletred: 0xDB7093,
    papayawhip: 0xFFEFD5,
    peachpuff: 0xFFDAB9,
    peru: 0xCD853F,
    pink: 0xFFC0CB,
    plum: 0xDDA0DD,
    powderblue: 0xB0E0E6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xFF0000,
    rosybrown: 0xBC8F8F,
    royalblue: 0x4169E1,
    saddlebrown: 0x8B4513,
    salmon: 0xFA8072,
    sandybrown: 0xF4A460,
    seagreen: 0x2E8B57,
    seashell: 0xFFF5EE,
    sienna: 0xA0522D,
    silver: 0xC0C0C0,
    skyblue: 0x87CEEB,
    slateblue: 0x6A5ACD,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xFFFAFA,
    springgreen: 0x00FF7F,
    steelblue: 0x4682B4,
    tan: 0xD2B48C,
    teal: 0x008080,
    thistle: 0xD8BFD8,
    tomato: 0xFF6347,
    turquoise: 0x40E0D0,
    violet: 0xEE82EE,
    wheat: 0xF5DEB3,
    white: 0xFFFFFF,
    whitesmoke: 0xF5F5F5,
    yellow: 0xFFFF00,
    yellowgreen: 0x9ACD32
};