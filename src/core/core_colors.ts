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
	 */

	setValue(value: string): this {

		this.invalid = false;

		if (value.length == 4 && /#[0-9a-fA-F]{3}/.test(value)) {
			const r1 = parseInt(value[1], 16);
			const g1 = parseInt(value[2], 16);
			const b1 = parseInt(value[3], 16);
			return this.setRgb(r1 << 4 | r1, g1 << 4 | g1, b1 << 4 | b1, 1.0);
		}

		if (value.length == 7 && /#[0-9a-fA-F]{6}/.test(value)) {
			const r1 = parseInt(value[1], 16);
			const r2 = parseInt(value[2], 16);
			const g1 = parseInt(value[3], 16);
			const g2 = parseInt(value[4], 16);
			const b1 = parseInt(value[5], 16);
			const b2 = parseInt(value[6], 16);
			return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, 1.0);
		}

		if (value.length == 9 && /#[0-9a-fA-F]{8}/.test(value)) {
			const r1 = parseInt(value[1], 16);
			const r2 = parseInt(value[2], 16);
			const g1 = parseInt(value[3], 16);
			const g2 = parseInt(value[4], 16);
			const b1 = parseInt(value[5], 16);
			const b2 = parseInt(value[6], 16);
			const a1 = parseInt(value[7], 16);
			const a2 = parseInt(value[8], 16);
			return this.setRgb(r1 << 4 | r2, g1 << 4 | g2, b1 << 4 | b2, (a1 << 4 | a2) / 255.0);
		}

		if (value.startsWith('rgba')) {
			const re = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*((\d+)|(\d*\.\d+)|(\.\d+))\s*\)/;
			const m = re.exec(value);
			if (m) {
				return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4]));
			}
		}
		else if (value.startsWith('rgb')) {
			const re = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
			const m = re.exec(value);
			if (m) {
				return this.setRgb(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), 1.0);
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
			const nm = value.toLowerCase();
			const xx = CSS_COLORS[nm];
			if( xx!==undefined ) {
				return this.setRgb( xx[0], xx[1], xx[2], 1.0 );
			}
			else if( nm=="transparent" ) {
				return this.setRgb( 0, 0, 0, 0 );
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




const CSS_COLORS: Record<string, number[]> = {
	aliceblue: [240, 248, 255],
	antiquewhite: [250, 235, 215],
	aqua: [0, 255, 255],
	aquamarine: [127, 255, 212],
	azure: [240, 255, 255],
	beige: [245, 245, 220],
	bisque: [255, 228, 196],
	black: [0, 0, 0],
	blanchedalmond: [255, 235, 205],
	blue: [0, 0, 255],
	blueviolet: [138, 43, 226],
	brown: [165, 42, 42],
	burlywood: [222, 184, 135],
	cadetblue: [95, 158, 160],
	chartreuse: [127, 255, 0],
	chocolate: [210, 105, 30],
	coral: [255, 127, 80],
	cornflowerblue: [100, 149, 237],
	cornsilk: [255, 248, 220],
	crimson: [220, 20, 60],
	cyan: [0, 255, 255],
	darkblue: [0, 0, 139],
	darkcyan: [0, 139, 139],
	darkgoldenrod: [184, 134, 11],
	darkgray: [169, 169, 169],
	darkgreen: [0, 100, 0],
	darkgrey: [169, 169, 169],
	darkkhaki: [189, 183, 107],
	darkmagenta: [139, 0, 139],
	darkolivegreen: [85, 107, 47],
	darkorange: [255, 140, 0],
	darkorchid: [153, 50, 204],
	darkred: [139, 0, 0],
	darksalmon: [233, 150, 122],
	darkseagreen: [143, 188, 143],
	darkslateblue: [72, 61, 139],
	darkslategray: [47, 79, 79],
	darkslategrey: [47, 79, 79],
	darkturquoise: [0, 206, 209],
	darkviolet: [148, 0, 211],
	deeppink: [255, 20, 147],
	deepskyblue: [0, 191, 255],
	dimgray: [105, 105, 105],
	dimgrey: [105, 105, 105],
	dodgerblue: [30, 144, 255],
	firebrick: [178, 34, 34],
	floralwhite: [255, 250, 240],
	forestgreen: [34, 139, 34],
	fuchsia: [255, 0, 255],
	gainsboro: [220, 220, 220],
	ghostwhite: [248, 248, 255],
	gold: [255, 215, 0],
	goldenrod: [218, 165, 32],
	gray: [128, 128, 128],
	green: [0, 128, 0],
	greenyellow: [173, 255, 47],
	grey: [128, 128, 128],
	honeydew: [240, 255, 240],
	hotpink: [255, 105, 180],
	indianred: [205, 92, 92],
	indigo: [75, 0, 130],
	ivory: [255, 255, 240],
	khaki: [240, 230, 140],
	lavender: [230, 230, 250],
	lavenderblush: [255, 240, 245],
	lawngreen: [124, 252, 0],
	lemonchiffon: [255, 250, 205],
	lightblue: [173, 216, 230],
	lightcoral: [240, 128, 128],
	lightcyan: [224, 255, 255],
	lightgoldenrodyellow: [250, 250, 210],
	lightgray: [211, 211, 211],
	lightgreen: [144, 238, 144],
	lightgrey: [211, 211, 211],
	lightpink: [255, 182, 193],
	lightsalmon: [255, 160, 122],
	lightseagreen: [32, 178, 170],
	lightskyblue: [135, 206, 250],
	lightslategray: [119, 136, 153],
	lightslategrey: [119, 136, 153],
	lightsteelblue: [176, 196, 222],
	lightyellow: [255, 255, 224],
	lime: [0, 255, 0],
	limegreen: [50, 205, 50],
	linen: [250, 240, 230],
	magenta: [255, 0, 255],
	maroon: [128, 0, 0],
	mediumaquamarine: [102, 205, 170],
	mediumblue: [0, 0, 205],
	mediumorchid: [186, 85, 211],
	mediumpurple: [147, 112, 219],
	mediumseagreen: [60, 179, 113],
	mediumslateblue: [123, 104, 238],
	mediumspringgreen: [0, 250, 154],
	mediumturquoise: [72, 209, 204],
	mediumvioletred: [199, 21, 133],
	midnightblue: [25, 25, 112],
	mintcream: [245, 255, 250],
	mistyrose: [255, 228, 225],
	moccasin: [255, 228, 181],
	navajowhite: [255, 222, 173],
	navy: [0, 0, 128],
	oldlace: [253, 245, 230],
	olive: [128, 128, 0],
	olivedrab: [107, 142, 35],
	orange: [255, 165, 0],
	orangered: [255, 69, 0],
	orchid: [218, 112, 214],
	palegoldenrod: [238, 232, 170],
	palegreen: [152, 251, 152],
	paleturquoise: [175, 238, 238],
	palevioletred: [219, 112, 147],
	papayawhip: [255, 239, 213],
	peachpuff: [255, 218, 185],
	peru: [205, 133, 63],
	pink: [255, 192, 203],
	plum: [221, 160, 221],
	powderblue: [176, 224, 230],
	purple: [128, 0, 128],
	rebeccapurple: [102, 51, 153],
	red: [255, 0, 0],
	rosybrown: [188, 143, 143],
	royalblue: [65, 105, 225],
	saddlebrown: [139, 69, 19],
	salmon: [250, 128, 114],
	sandybrown: [244, 164, 96],
	seagreen: [46, 139, 87],
	seashell: [255, 245, 238],
	sienna: [160, 82, 45],
	silver: [192, 192, 192],
	skyblue: [135, 206, 235],
	slateblue: [106, 90, 205],
	slategray: [112, 128, 144],
	slategrey: [112, 128, 144],
	snow: [255, 250, 250],
	springgreen: [0, 255, 127],
	steelblue: [70, 130, 180],
	tan: [210, 180, 140],
	teal: [0, 128, 128],
	thistle: [216, 191, 216],
	tomato: [255, 99, 71],
	turquoise: [64, 224, 208],
	violet: [238, 130, 238],
	wheat: [245, 222, 179],
	white: [255, 255, 255],
	whitesmoke: [245, 245, 245],
	yellow: [255, 255, 0],
	yellowgreen: [154, 205, 50]
};