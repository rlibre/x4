/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file core_pdf.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 * 
 * taken from excellent
 * https://github.com/Lulzx/tinypdf/tree/main
 **/

import { Color } from './core_colors.js'
import { isArray, isFunction, isNumber, isPlainObject, isString } from './core_tools.js'
import { SvgBuilder, SvgGroup } from './core_svg.js'


/**
 * the widths of the characters, by their code in WinAnsiEncoding, from 32 to 255:
 * the AFM of Adobe for the core fonts. 0: a code that has no character
 */

const WIDTHS: number[] = [
	278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
	556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
	1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
	667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
	333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
	556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 0,
	556, 0, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0, 611, 0,
	0, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 0, 500, 667,
	278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333,
	400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611,
	667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
	722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
	556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278,
	556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500,
]

const WIDTHS_BOLD: number[] = [
	278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278,
	556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611,
	975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778,
	667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556,
	333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611,
	611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 0,
	556, 0, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0, 611, 0,
	0, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 0, 500, 667,
	278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333,
	400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611,
	722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278,
	722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611,
	556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278,
	611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556,
]

/**
 * WinAnsiEncoding is Windows-1252: from 0x20 to 0x7e and from 0xa0 to 0xff
 * the codes of Unicode, between them these characters
 */

const CP1252: Record<number, number> = {
	0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
	0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e,
	0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
	0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
}

/**
 * the codes of a text in WinAnsiEncoding; a character that it does not have is a '?'
 */

function winAnsiCodes(str: string): number[] {
	const codes: number[] = []
	for (const ch of str) {
		const code = ch.codePointAt(0)
		if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff)) {
			codes.push(code)
		}
		else {
			codes.push(CP1252[code] ?? 0x3f)
		}
	}
	return codes
}

export interface TextOptions {
	align?: 'left' | 'center' | 'right'
	width?: number
	color?: string
	bold?: boolean		// Helvetica-Bold
}

/**
 * m: moveto, l: lineto, c: bezier curve (two control points, then the end), h: closepath
 */

export type PathSegment =
	| ['m', number, number]
	| ['l', number, number]
	| ['c', number, number, number, number, number, number]
	| ['h']

export interface PDFProps {
	title?: string		// shown by the reader in place of the name of the file
	author?: string
	subject?: string
}

export interface LinkOptions {
	underline?: string
}

// :: BARCODES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export interface BarcodeOptions {
	/**
	 * the text is a GS1 element string, its AIs between parentheses:
	 * "(01)03400930000120(17)270101(10)AB12". FNC1 starts the code and
	 * ends the fields of variable length
	 */
	gs1?: boolean
	color?: string		// of the modules; black when not given
}

const FNC1 = -1

// the AIs of fixed length, by their first two digits: they need no FNC1 after them
const GS1_FIXED = ['00', '01', '02', '03', '04', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '31', '32', '33', '34', '35', '36', '41']

/**
 * the characters of the code, FNC1 for the separators of GS1
 */

function barcodeChars( text: string, opts: BarcodeOptions ): number[] {
	if (!opts.gs1) {
		return [...text].map( ch => ch.codePointAt(0) )
	}

	const re = /\((\d{2,4})\)([^(]*)/y
	const out: number[] = [FNC1]
	let m: RegExpExecArray
	let fixed = true

	while ((m = re.exec(text)) !== null) {
		if (!fixed) {
			out.push(FNC1)
		}

		for (const ch of m[1] + m[2]) {
			out.push(ch.codePointAt(0))
		}

		fixed = GS1_FIXED.includes(m[1].substring(0, 2))
		if (re.lastIndex === text.length) {
			return out
		}
	}

	throw new Error(`not a GS1 element string: ${text}`)
}

/**
 * Data Matrix (ECC200): square, 10 x 10 to 26 x 26 modules, ASCII encoding
 * (the digits by pairs). Its sizes: symbol, data codewords, error codewords
 */

const DM_SIZES: [number, number, number][] = [
	[10, 3, 5], [12, 5, 7], [14, 8, 10], [16, 12, 12], [18, 18, 14],
	[20, 22, 18], [22, 30, 20], [24, 36, 24], [26, 44, 28],
]

const isDigit = ( c: number ) => c >= 0x30 && c <= 0x39

function dmCodewords( chars: number[] ): number[] {
	const cw: number[] = []
	for (let i = 0; i < chars.length; i++) {
		const c = chars[i]
		if (c === FNC1) {
			cw.push(232)
		}
		else if (isDigit(c) && isDigit(chars[i + 1])) {
			cw.push(130 + (c - 0x30) * 10 + (chars[i + 1] - 0x30))
			i++
		}
		else if (c < 128) {
			cw.push(c + 1)
		}
		else if (c < 256) {
			cw.push(235, c - 128 + 1)		// upper shift
		}
		else {
			throw new Error(`character not encodable in a Data Matrix: ${String.fromCodePoint(c)}`)
		}
	}
	return cw
}

// GF(256), x^8 + x^5 + x^3 + x^2 + 1
const GF_EXP: number[] = []
const GF_LOG: number[] = []
{
	let v = 1
	for (let i = 0; i < 255; i++) {
		GF_EXP[i] = v
		GF_LOG[v] = i
		v <<= 1
		if (v & 0x100) {
			v ^= 0x12d
		}
	}
}

const gfMul = ( a: number, b: number ) => (a && b) ? GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255] : 0

/**
 * the error codewords of Reed-Solomon, generator ( x - a^1 )...( x - a^n )
 */

function dmErrors( data: number[], n: number ): number[] {
	let gen = [1]
	for (let i = 1; i <= n; i++) {
		const next = new Array(gen.length + 1).fill(0)
		gen.forEach( ( g, j ) => {
			next[j] ^= g
			next[j + 1] ^= gfMul(g, GF_EXP[i])
		} )
		gen = next
	}

	const ecc = new Array(n).fill(0)
	for (const d of data) {
		const k = d ^ ecc[0]
		ecc.shift()
		ecc.push(0)
		for (let j = 0; j < n; j++) {
			ecc[j] ^= gfMul(gen[j + 1], k)
		}
	}
	return ecc
}

/**
 * the place of each bit in the data region (ISO 16022, annex F):
 * 10 * codeword + bit (1 the highest), 1 for a module always dark, 0 for one always light
 */

function dmPlacement( nrow: number, ncol: number ): number[] {
	const array = new Array(nrow * ncol).fill(0)

	const module = ( row: number, col: number, chr: number, bit: number ) => {
		if (row < 0) {
			row += nrow
			col += 4 - ((nrow + 4) % 8)
		}
		if (col < 0) {
			col += ncol
			row += 4 - ((ncol + 4) % 8)
		}
		array[row * ncol + col] = 10 * chr + bit
	}

	const utah = ( row: number, col: number, chr: number ) => {
		module(row - 2, col - 2, chr, 1); module(row - 2, col - 1, chr, 2)
		module(row - 1, col - 2, chr, 3); module(row - 1, col - 1, chr, 4); module(row - 1, col, chr, 5)
		module(row, col - 2, chr, 6); module(row, col - 1, chr, 7); module(row, col, chr, 8)
	}

	const corner = ( chr: number, places: number[][] ) => {
		places.forEach( ( [r, c], i ) => module(r, c, chr, i + 1) )
	}

	const R = nrow, C = ncol
	let row = 4, col = 0, chr = 1

	do {
		if (row === R && col === 0) {
			corner(chr++, [[R - 1, 0], [R - 1, 1], [R - 1, 2], [0, C - 2], [0, C - 1], [1, C - 1], [2, C - 1], [3, C - 1]])
		}
		if (row === R - 2 && col === 0 && C % 4) {
			corner(chr++, [[R - 3, 0], [R - 2, 0], [R - 1, 0], [0, C - 4], [0, C - 3], [0, C - 2], [0, C - 1], [1, C - 1]])
		}
		if (row === R - 2 && col === 0 && C % 8 === 4) {
			corner(chr++, [[R - 3, 0], [R - 2, 0], [R - 1, 0], [0, C - 2], [0, C - 1], [1, C - 1], [2, C - 1], [3, C - 1]])
		}
		if (row === R + 4 && col === 2 && !(C % 8)) {
			corner(chr++, [[R - 1, 0], [R - 1, C - 1], [0, C - 3], [0, C - 2], [0, C - 1], [1, C - 3], [1, C - 2], [1, C - 1]])
		}

		do {
			if (row < R && col >= 0 && !array[row * C + col]) {
				utah(row, col, chr++)
			}
			row -= 2
			col += 2
		} while (row >= 0 && col < C)
		row += 1
		col += 3

		do {
			if (row >= 0 && col < C && !array[row * C + col]) {
				utah(row, col, chr++)
			}
			row += 2
			col -= 2
		} while (row < R && col >= 0)
		row += 3
		col += 1
	} while (row < R || col < C)

	if (!array[R * C - 1]) {
		array[R * C - 1] = array[R * C - C - 2] = 1
	}

	return array
}

/**
 * The modules of a Data Matrix (ECC200), its rows from the top: true for a dark one.
 * The smallest square that holds the text, up to 26 x 26 (44 codewords: 44
 * characters, 88 digits). Characters from 0 to 255. Without its quiet zone, one module wide.
 * "G1234K7" is a 12 x 12
 */

function encodeDataMatrix( text: string, opts: BarcodeOptions = {} ): boolean[][] {
	const data = dmCodewords( barcodeChars(text, opts) )
	const size = DM_SIZES.find( s => s[1] >= data.length )
	if (!size) {
		throw new Error(`too long for a Data Matrix of 26 x 26: ${text}`)
	}

	const [n, ndata, necc] = size

	// pads: 129, then pseudo random from their position (counted from 1)
	const first = data.length
	while (data.length < ndata) {
		const p = data.length + 1
		let v = 129
		if (data.length > first) {
			v = 129 + ((149 * p) % 253) + 1
			if (v > 254) {
				v -= 254
			}
		}
		data.push(v)
	}

	const cw = [...data, ...dmErrors(data, necc)]
	const region = n - 2
	const place = dmPlacement(region, region)

	const rows: boolean[][] = []
	for (let r = 0; r < n; r++) {
		const row: boolean[] = []
		for (let c = 0; c < n; c++) {
			if (c === 0 || r === n - 1) {
				row.push(true)						// the L
			}
			else if (r === 0) {
				row.push(c % 2 === 0)				// the clocks
			}
			else if (c === n - 1) {
				row.push(r % 2 === 1)
			}
			else {
				const v = place[(r - 1) * region + (c - 1)]
				row.push(v === 1 || (v > 1 && (cw[Math.floor(v / 10) - 1] & (1 << (8 - v % 10))) !== 0))
			}
		}
		rows.push(row)
	}

	return rows
}

/**
 * Code 128: the 107 symbols, as the widths of their bars and spaces
 */

const C128 = (
	'212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 ' +
	'123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 ' +
	'232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 ' +
	'313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 ' +
	'111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 ' +
	'111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 ' +
	'114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'
).split(' ')

const C128_START_A = 103, C128_START_B = 104, C128_START_C = 105
const C128_TO_A = 101, C128_TO_B = 100, C128_TO_C = 99, C128_FNC1 = 102

function c128Values( chars: number[] ): number[] {
	const digitsAt = ( i: number ) => {
		let n = 0
		while (i + n < chars.length && isDigit(chars[i + n])) {
			n++
		}
		return n
	}

	for (const c of chars) {
		if (c !== FNC1 && (c < 0 || c > 127)) {
			throw new Error(`character not encodable in a Code 128: ${String.fromCodePoint(c)}`)
		}
	}

	// in C, the digits by pairs; else A for the controls, B for the rest
	const textSet = ( c: number ) => (c >= 0 && c < 32) ? 'A' : 'B'
	const values: number[] = []
	let set: string

	let i = 0
	const lead = chars[0] === FNC1 ? 1 : 0
	const d0 = digitsAt(lead)
	if (d0 >= 4 || (d0 >= 2 && lead + d0 === chars.length && d0 % 2 === 0)) {
		set = 'C'
		values.push(C128_START_C)
	}
	else {
		set = textSet(chars.find( c => c !== FNC1 ) ?? 0x20)
		values.push(set === 'A' ? C128_START_A : C128_START_B)
	}

	while (i < chars.length) {
		const c = chars[i]
		if (c === FNC1) {
			values.push(C128_FNC1)
			i++
			continue
		}

		if (set === 'C') {
			if (digitsAt(i) >= 2) {
				values.push((c - 0x30) * 10 + (chars[i + 1] - 0x30))
				i += 2
				continue
			}

			set = textSet(c)
			values.push(set === 'A' ? C128_TO_A : C128_TO_B)
		}

		// a run of digits worth C: 4 at the end, 6 elsewhere (C costs a switch to it, and one back)
		const d = digitsAt(i)
		if (d >= 6 || (d >= 4 && i + d === chars.length)) {
			if (d % 2) {
				values.push(c - 32)		// the odd digit, in A or B
				i++
			}
			set = 'C'
			values.push(C128_TO_C)
			continue
		}

		const want = (set === 'A' && c >= 96) ? 'B' : (set === 'B' && c < 32) ? 'A' : set
		if (want !== set) {
			set = want
			values.push(set === 'A' ? C128_TO_A : C128_TO_B)
		}

		values.push(c < 32 ? c + 64 : c - 32)
		i++
	}

	let sum = values[0]
	for (let k = 1; k < values.length; k++) {
		sum += values[k] * k
	}
	values.push(sum % 103)

	values.push(106)		// stop
	return values
}

/**
 * The modules of a Code 128, from the left: true for a bar. Its sets A, B and C
 * are chosen for the shortest code. ASCII only. Without its quiet zone (10 modules on each side).
 */

function encodeCode128( text: string, opts: BarcodeOptions = {} ): boolean[] {
	const modules: boolean[] = []
	for (const v of c128Values( barcodeChars(text, opts) )) {
		[...C128[v]].forEach( ( w, k ) => {
			for (let n = +w; n > 0; n--) {
				modules.push(k % 2 === 0)
			}
		} )
	}
	return modules
}

export type BarcodeType = 'datamatrix' | 'code128'

/**
 * the rows of the modules (one for a Code 128), and the runs of dark
 * modules on them: [row, column, length]
 */

function barcodeRuns( type: BarcodeType, text: string, opts: BarcodeOptions ) {
	const rows = type === 'datamatrix' ? encodeDataMatrix(text, opts) : [encodeCode128(text, opts)]
	const runs: [number, number, number][] = []

	rows.forEach( ( row, r ) => {
		let c = 0
		while (c < row.length) {
			if (!row[c]) {
				c++
				continue
			}
			let end = c
			while (end < row.length && row[end]) {
				end++
			}
			runs.push([r, c, end - c])
			c = end
		}
	} )

	return { rows: rows.length, cols: rows[0].length, runs }
}

export interface BarcodeImageOptions extends BarcodeOptions {
	module?: number		// the size of a module, in px; 4 when not given
}

/**
 * A barcode as an image, for the screen: "data:image/svg+xml,...", for the
 * src of an Image or an Icon. Drawn on white, with its quiet zone (1 module
 * around a Data Matrix, 10 on the sides of a Code 128): it can be read on a dark theme too.
 * A Code 128 is 50 modules high.
 *
 * @example
 * new Image( { src: renderBarcodeImage( "datamatrix", "G1234K7" ) } )
 * new Image( { src: renderBarcodeImage( "code128", "(01)03400930000120(17)270101", { gs1: true, module: 2 } ) } )
 */

export function renderBarcodeImage( type: BarcodeType, text: string, opts: BarcodeImageOptions = {} ): string {
	const { rows, cols, runs } = barcodeRuns(type, text, opts)
	const qx = type === 'datamatrix' ? 1 : 10
	const qy = type === 'datamatrix' ? 1 : 0
	const h = type === 'datamatrix' ? 1 : 50			// height of a row, in modules
	const W = cols + 2 * qx
	const H = rows * h + 2 * qy
	const m = opts.module ?? 4

	const svg = new SvgGroup('svg')
	svg.setAttr('viewBox', `0 0 ${W} ${H}`)
	svg.setAttr('width', `${W * m}`)
	svg.setAttr('height', `${H * m}`)

	const bld = svg.append(new SvgBuilder())
	bld.rect(0, 0, W, H).fill('#ffffff')

	const path = bld.path()
	for (const [r, c, len] of runs) {
		const x = qx + c, y = qy + r * h
		path.moveTo(x, y).lineTo(x + len, y).lineTo(x + len, y + h).lineTo(x, y + h).closePath()
	}
	path.fill(opts.color ?? '#000000').antiAlias(false)

	return 'data:image/svg+xml,' + encodeURIComponent(new XMLSerializer().serializeToString(svg.getDom()))
}

// :: SVG :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * the endpoint arc of SVG as Bézier curves, a quarter of turn at most each
 * (SVG 1.1, appendix F.6.5)
 */

function arcToCurves( x1: number, y1: number, rx: number, ry: number, phi: number, large: boolean, sweep: boolean, x2: number, y2: number ): PathSegment[] {
	if (x1 === x2 && y1 === y2) {
		return []
	}

	rx = Math.abs(rx)
	ry = Math.abs(ry)
	if (!rx || !ry) {
		return [['l', x2, y2]]
	}

	const cos = Math.cos(phi * Math.PI / 180), sin = Math.sin(phi * Math.PI / 180)
	const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
	const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy

	// radii too small: scaled up
	const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry)
	if (lambda > 1) {
		rx *= Math.sqrt(lambda)
		ry *= Math.sqrt(lambda)
	}

	const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp
	const den = rx * rx * yp * yp + ry * ry * xp * xp
	const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den))
	const cxp = k * rx * yp / ry, cyp = -k * ry * xp / rx
	const cx = cos * cxp - sin * cyp + (x1 + x2) / 2
	const cy = sin * cxp + cos * cyp + (y1 + y2) / 2

	const angle = ( ux: number, uy: number, vx: number, vy: number ) => {
		const a = Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)))))
		return (ux * vy - uy * vx < 0) ? -a : a
	}

	const t1 = angle(1, 0, (xp - cxp) / rx, (yp - cyp) / ry)
	let dt = angle((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry)
	if (!sweep && dt > 0) {
		dt -= 2 * Math.PI
	}
	else if (sweep && dt < 0) {
		dt += 2 * Math.PI
	}

	const n = Math.ceil(Math.abs(dt) / (Math.PI / 2) - 1e-9)
	const step = dt / n
	const kappa = 4 / 3 * Math.tan(step / 4)

	// a point of the ellipse, and its derivative
	const pt = ( t: number ) => [cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos]
	const dv = ( t: number ) => [-rx * Math.sin(t) * cos - ry * Math.cos(t) * sin, -rx * Math.sin(t) * sin + ry * Math.cos(t) * cos]

	const out: PathSegment[] = []
	for (let i = 0; i < n; i++) {
		const a = t1 + i * step, b = a + step
		const [ax, ay] = pt(a), [bx, by] = pt(b)
		const [adx, ady] = dv(a), [bdx, bdy] = dv(b)
		const last = i === n - 1
		out.push(['c', ax + kappa * adx, ay + kappa * ady, bx - kappa * bdx, by - kappa * bdy, last ? x2 : bx, last ? y2 : by])
	}
	return out
}

/**
 * The "d" of a SVG path as absolute segments, in its own coordinates (y goes down).
 * M L H V C S Q T A Z, absolute and relative; Q and T become exact cubic curves,
 * A becomes Bézier curves. Another command throws: better than a drawing cut short.
 */

function parseSvgPath( d: string ): PathSegment[] {
	let pos = 0

	const skip = () => {
		while (pos < d.length && /[\s,]/.test(d[pos])) {
			pos++
		}
	}

	const number = () => {
		skip()
		const m = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/.exec(d.substring(pos))
		if (!m) {
			throw new Error(`svg path: number expected at ${pos}: ${d.substring(pos, pos + 20)}`)
		}
		pos += m[0].length
		return parseFloat(m[0])
	}

	// the flags of an arc are one digit, without a separator: "a1 1 0 001 1"
	const flag = () => {
		skip()
		const f = d[pos++]
		if (f !== '0' && f !== '1') {
			throw new Error(`svg path: flag expected at ${pos - 1}`)
		}
		return f === '1'
	}

	const out: PathSegment[] = []
	let cx = 0, cy = 0				// current point
	let sx = 0, sy = 0				// start of the subpath
	let qx = 0, qy = 0				// last control point, reflected by S and T
	let last = ''					// last command, uppercase
	let cmd = ''

	const curve = ( x1: number, y1: number, x2: number, y2: number, x: number, y: number ) => {
		out.push(['c', x1, y1, x2, y2, x, y])
		qx = x2; qy = y2
		cx = x; cy = y
	}

	const quad = ( x1: number, y1: number, x: number, y: number ) => {
		out.push(['c', cx + 2 / 3 * (x1 - cx), cy + 2 / 3 * (y1 - cy), x + 2 / 3 * (x1 - x), y + 2 / 3 * (y1 - y), x, y])
		qx = x1; qy = y1
		cx = x; cy = y
	}

	skip()
	while (pos < d.length) {
		if (/[a-zA-Z]/.test(d[pos])) {
			cmd = d[pos++]
		}
		else if (!cmd) {
			throw new Error(`svg path: command expected at ${pos}`)
		}

		const rel = cmd === cmd.toLowerCase()
		const ox = rel ? cx : 0, oy = rel ? cy : 0
		const C = cmd.toUpperCase()

		switch (C) {
			case 'Z':
				out.push(['h'])
				cx = sx; cy = sy
				break

			case 'M':
				cx = sx = number() + ox
				cy = sy = number() + oy
				out.push(['m', cx, cy])
				cmd = rel ? 'l' : 'L'		// the next pairs are lines
				break

			case 'L':
				cx = number() + ox
				cy = number() + oy
				out.push(['l', cx, cy])
				break

			case 'H':
				cx = number() + ox
				out.push(['l', cx, cy])
				break

			case 'V':
				cy = number() + oy
				out.push(['l', cx, cy])
				break

			case 'C':
				curve(number() + ox, number() + oy, number() + ox, number() + oy, number() + ox, number() + oy)
				break

			case 'S': {
				const x1 = (last === 'C' || last === 'S') ? 2 * cx - qx : cx
				const y1 = (last === 'C' || last === 'S') ? 2 * cy - qy : cy
				curve(x1, y1, number() + ox, number() + oy, number() + ox, number() + oy)
				break
			}

			case 'Q':
				quad(number() + ox, number() + oy, number() + ox, number() + oy)
				break

			case 'T': {
				const x1 = (last === 'Q' || last === 'T') ? 2 * cx - qx : cx
				const y1 = (last === 'Q' || last === 'T') ? 2 * cy - qy : cy
				quad(x1, y1, number() + ox, number() + oy)
				break
			}

			case 'A': {
				const rx = number(), ry = number(), phi = number()
				const large = flag(), sweep = flag()
				const x = number() + ox, y = number() + oy
				out.push(...arcToCurves(cx, cy, rx, ry, phi, large, sweep, x, y))
				cx = x; cy = y
				break
			}

			default:
				throw new Error(`svg path: command not handled: ${cmd}`)
		}

		last = C
		skip()
	}

	return out
}

// a 2d affine transform: [a b c d e f], x' = a x + c y + e, y' = b x + d y + f
type Matrix = [number, number, number, number, number, number]

const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0]

function mulMatrix( m: Matrix, n: Matrix ): Matrix {
	return [
		m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
		m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
		m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
	]
}

function parseTransform( tr: string ): Matrix {
	let m = IDENTITY
	for (const [, fn, args] of tr.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
		const v = args.split(/[\s,]+/).filter(s => s).map(Number)
		let t: Matrix
		switch (fn) {
			case 'matrix': t = v.slice(0, 6) as Matrix; break
			case 'translate': t = [1, 0, 0, 1, v[0], v[1] ?? 0]; break
			case 'scale': t = [v[0], 0, 0, v[1] ?? v[0], 0, 0]; break
			case 'rotate': {
				const a = v[0] * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
				const [px, py] = [v[1] ?? 0, v[2] ?? 0]
				t = [c, s, -s, c, px - c * px + s * py, py - s * px - c * py]
				break
			}
			case 'skewX': t = [1, 0, Math.tan(v[0] * Math.PI / 180), 1, 0, 0]; break
			case 'skewY': t = [1, Math.tan(v[0] * Math.PI / 180), 0, 1, 0, 0]; break
			default: continue
		}
		m = mulMatrix(m, t)
	}
	return m
}

function transformSegments( segs: PathSegment[], m: Matrix ): PathSegment[] {
	const X = ( x: number, y: number ) => m[0] * x + m[2] * y + m[4]
	const Y = ( x: number, y: number ) => m[1] * x + m[3] * y + m[5]

	return segs.map( ( s ): PathSegment => {
		switch (s[0]) {
			case 'm': return ['m', X(s[1], s[2]), Y(s[1], s[2])]
			case 'l': return ['l', X(s[1], s[2]), Y(s[1], s[2])]
			case 'c': return ['c', X(s[1], s[2]), Y(s[1], s[2]), X(s[3], s[4]), Y(s[3], s[4]), X(s[5], s[6]), Y(s[5], s[6])]
			default: return ['h']
		}
	} )
}

/**
 * The text of a svg, as an Icon takes it: "var:name" (a CSS variable), "data:image/svg+xml,...",
 * "data:image/svg+xml;base64,..." (a svg imported by the bundler), "<svg...". A file (".svg") cannot
 * be read while a page is drawn: load it first, with svgLoader.load( )
 */

function svgSource( icon: string ): string {
	while (icon.startsWith('var:')) {
		icon = document.documentElement.style.getPropertyValue(icon.substring(4)).trim()
	}

	if (icon.startsWith('data:image/svg+xml;base64,')) {
		return atob(icon.substring(26))
	}

	if (icon.startsWith('data:image/svg+xml,')) {
		const body = icon.substring(19)
		return body.startsWith('<') ? body : decodeURIComponent(body)
	}

	if (icon.trimStart().startsWith('<')) {
		return icon
	}

	throw new Error(`icon: not a svg (a file is loaded first, by svgLoader.load): ${icon.substring(0, 40)}`)
}

export interface IconOptions {
	color?: string			// currentColor, and a fill that is not given; black when not given
	background?: string		// an opacity is mixed with it (a PDF without transparency); white when not given
}

interface SvgShape {
	segs: PathSegment[]			// in the coordinates of the viewBox
	fill: string				// null: not filled
	stroke: string				// null: not stroked
	width: number				// of the stroke, in the coordinates of the viewBox
	alpha: number
	evenOdd: boolean
}

const SVG_SKIP = ['defs', 'clipPath', 'mask', 'symbol', 'style', 'title', 'desc', 'metadata', 'linearGradient', 'radialGradient', 'pattern', 'marker', 'filter', 'text', 'image', 'use', 'foreignObject']

/**
 * the shapes of a svg: path, rect, circle, ellipse, line, polyline, polygon, in groups,
 * with their transforms. fill, stroke, stroke-width, opacity, fill-opacity, fill-rule:
 * as attributes or in style="". currentColor, and a fill that is not given, are `color`
 */

function svgShapes( source: string, color: string ) {
	const doc = new DOMParser().parseFromString(source, 'image/svg+xml')
	const root = doc.documentElement
	if (root.nodeName !== 'svg') {
		throw new Error('icon: not a svg')
	}

	let vb = (root.getAttribute('viewBox') ?? '').split(/[\s,]+/).filter(s => s).map(Number)
	if (vb.length !== 4) {
		vb = [0, 0, parseFloat(root.getAttribute('width')), parseFloat(root.getAttribute('height'))]
	}
	if (!(vb[2] > 0 && vb[3] > 0)) {
		throw new Error('icon: no viewBox, nor width and height')
	}

	interface Paint { fill: string; stroke: string; width: number; alpha: number; fillAlpha: number; evenOdd: boolean }

	const shapes: SvgShape[] = []
	const n = ( el: Element, name: string, def = 0 ) => {
		const v = parseFloat(el.getAttribute(name))
		return isNaN(v) ? def : v
	}

	const visit = ( el: Element, m: Matrix, inherited: Paint ) => {
		if (SVG_SKIP.includes(el.nodeName)) {
			return
		}

		// the properties of the element: its attributes, then its style
		const props: Record<string, string> = {}
		for (const name of ['fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'fill-rule', 'display', 'visibility']) {
			const v = el.getAttribute(name)?.trim()
			if (v) {
				props[name] = v
			}
		}
		for (const decl of (el.getAttribute('style') ?? '').split(';')) {
			const [k, v] = decl.split(':').map(s => s?.trim())
			if (k && v) {
				props[k] = v
			}
		}

		if (props.display === 'none' || props.visibility === 'hidden') {
			return
		}

		const paint = (v: string, cur: string) => {
			if (v === undefined || v === 'inherit') {
				return cur
			}
			if (v === 'none' || v === 'transparent') {
				return null
			}
			return (v === 'currentColor' || v.startsWith('url(')) ? color : v
		}

		const p: Paint = {
			fill: paint(props.fill, inherited.fill),
			stroke: paint(props.stroke, inherited.stroke),
			width: props['stroke-width'] !== undefined ? parseFloat(props['stroke-width']) : inherited.width,
			alpha: inherited.alpha * (props.opacity !== undefined ? parseFloat(props.opacity) : 1),
			fillAlpha: props['fill-opacity'] !== undefined ? parseFloat(props['fill-opacity']) : inherited.fillAlpha,
			evenOdd: props['fill-rule'] !== undefined ? props['fill-rule'] === 'evenodd' : inherited.evenOdd,
		}

		const tr = el.getAttribute('transform')
		const mm = tr ? mulMatrix(m, parseTransform(tr)) : m

		let d: string = null
		switch (el.nodeName) {
			case 'svg':
			case 'g':
			case 'a':
				for (const child of Array.from(el.children)) {
					visit(child, mm, p)
				}
				return

			case 'path':
				d = el.getAttribute('d')
				break

			case 'rect': {
				const x = n(el, 'x'), y = n(el, 'y'), w = n(el, 'width'), h = n(el, 'height')
				let rx = n(el, 'rx', -1), ry = n(el, 'ry', -1)
				rx = rx < 0 ? Math.max(ry, 0) : rx
				ry = ry < 0 ? rx : ry
				rx = Math.min(rx, w / 2)
				ry = Math.min(ry, h / 2)
				d = (rx && ry)
					? `M${x + rx},${y}H${x + w - rx}A${rx},${ry} 0 0 1 ${x + w},${y + ry}V${y + h - ry}A${rx},${ry} 0 0 1 ${x + w - rx},${y + h}H${x + rx}A${rx},${ry} 0 0 1 ${x},${y + h - ry}V${y + ry}A${rx},${ry} 0 0 1 ${x + rx},${y}Z`
					: `M${x},${y}H${x + w}V${y + h}H${x}Z`
				break
			}

			case 'circle':
			case 'ellipse': {
				const cx = n(el, 'cx'), cy = n(el, 'cy')
				const rx = el.nodeName === 'circle' ? n(el, 'r') : n(el, 'rx')
				const ry = el.nodeName === 'circle' ? rx : n(el, 'ry')
				d = `M${cx - rx},${cy}A${rx},${ry} 0 1 0 ${cx + rx},${cy}A${rx},${ry} 0 1 0 ${cx - rx},${cy}Z`
				break
			}

			case 'line':
				d = `M${n(el, 'x1')},${n(el, 'y1')}L${n(el, 'x2')},${n(el, 'y2')}`
				break

			case 'polyline':
			case 'polygon':
				d = 'M' + (el.getAttribute('points') ?? '').trim() + (el.nodeName === 'polygon' ? 'Z' : '')
				break
		}

		if (!d) {
			return
		}

		// the stroke width grows with the transform
		const scale = Math.sqrt(Math.abs(mm[0] * mm[3] - mm[1] * mm[2]))

		shapes.push({
			segs: transformSegments(parseSvgPath(d), mm),
			fill: p.fill,
			stroke: p.stroke,
			width: p.width * scale,
			alpha: p.alpha * p.fillAlpha,
			evenOdd: p.evenOdd,
		})
	}

	// by default, a svg is filled in black: here in the color asked
	visit(root, IDENTITY, { fill: color, stroke: null, width: 1, alpha: 1, fillAlpha: 1, evenOdd: false })
	return { box: vb, shapes }
}

/**
 * a color with an opacity, mixed with the background: a PDF without transparency
 * (printers do not like it)
 */

function mixColor( color: string, background: string, alpha: number ): Color {
	const c = new Color(color)
	if (alpha >= 1) {
		return c
	}

	const f = c.toRgb(), b = new Color(background).toRgb()
	const mix = ( x: number, y: number ) => Math.round(alpha * x + (1 - alpha) * y)
	return new Color(mix(f.red, b.red), mix(f.green, b.green), mix(f.blue, b.blue))
}

type PDFValue = null | boolean | number | string | PDFValue[] | Ref | { [key: string]: PDFValue }

interface PDFObject {
	id: number
	dict: Record<string, PDFValue>
	stream: Uint8Array | null
}

export function measureText(str: string, size: number, bold = false): number {
	const widths = bold ? WIDTHS_BOLD : WIDTHS
	let width = 0
	for (const code of winAnsiCodes(str)) {
		width += widths[code - 32]
	}
	return (width * size) / 1000
}

function fx( v:number, n:number ) {
	return (+v.toFixed(n)).toString();
}

// the components of a color go from 0 to 1
function formatColor( clr: Color, suffix: string ) : string {
	const rgb = clr.toNumber( );
	return `${fx(((rgb>>16)&0xff)/255,3)} ${fx(((rgb>>8)&0xff)/255,3)} ${fx((rgb&0xff)/255,3)} ${suffix}`;
}

function hex( codes: number[] ): string {
	return codes.map( c => c.toString(16).padStart(2,'0') ).join('');
}

/**
 * a text of the content, in WinAnsiEncoding: written in hex, the content
 * stays in ASCII
 */

function pdfWinAnsi(str: string): string {
	return '<' + hex( winAnsiCodes(str) ) + '>';
}

/**
 * a text of the document (its title...): in UTF-16BE, any character passes
 */

function pdfTextString(str: string): string {
	const codes = [0xfe, 0xff];
	for (let i = 0; i < str.length; i++) {
		const c = str.charCodeAt(i);
		codes.push( c >> 8, c & 0xff );
	}
	return '<' + hex( codes ) + '>';
}


const STRING_MAP: Record<string,string> = {
  '\\': '\\\\',
  '(': '\\(',
  ')': '\\)',
  '\r': '\\r',
  '\n': '\\n'
};

function pdfString(str: string): string {
	return '(' + str.replace( /[\\()\r\n]/g, s => STRING_MAP[s]) + ')';
}

function serialize(val: PDFValue): string {
	if (val === null || val === undefined) {
		return 'null'
	}

	if ( typeof val === 'boolean') {
		return val ? 'true' : 'false'
	}

	if ( isNumber( val ) ) {
		return fx(val,4);
	}

	if ( isString(val) ) {
		if (val.startsWith('/')) {
			return val  // name
		}

		if (val.startsWith('(') || val.startsWith('<')) {
			return val  // already escaped string, or hex string
		}

		return pdfString(val)
	}

	if (isArray(val)) {
		return '[' + val.map(serialize).join(' ') + ']'
	}

	if (val instanceof Ref) {
		return `${val.id} 0 R`
	}

	if ( isPlainObject(val) ) {
		const pairs = Object.entries(val)
			.filter( ([_, v]) => v !== undefined)
			.map( ([k, v]) => `/${k} ${serialize(v as PDFValue)}`);

		return '<<\n' + pairs.join('\n') + '\n>>'
	}

	return String(val)
}

/**
 * zlib, as FlateDecode reads it
 */

async function deflate(data: Uint8Array): Promise<Uint8Array> {
	const stream = new Blob([data as BlobPart]).stream().pipeThrough(new CompressionStream('deflate'))
	return new Uint8Array(await new Response(stream).arrayBuffer())
}

// @internal
class Ref {
	id: number
	constructor(id: number) { this.id = id }
}

export interface PageContext {
	text(str: string, x: number, y: number, size: number, opts?: TextOptions): void;
	rect(x: number, y: number, w: number, h: number, fill: string): void;
	line(x1: number, y1: number, x2: number, y2: number, stroke: string, lineWidth?: number): void;
	image(jpegBytes: Uint8Array, x: number, y: number, w: number, h: number): void;
	link(url: string, x: number, y: number, w: number, h: number, opts?: LinkOptions): void;
	/** filled with fill, its outline drawn with stroke; null for none of them */
	path(segments: PathSegment[], fill: string, stroke?: string, lineWidth?: number): void;
	/**
	 * a Data Matrix: the square of side min( w, h ), (x, y) its bottom left corner;
	 * a Code 128: its bars on w x h. Without the quiet zone, left to the caller
	 */
	barcode(type: BarcodeType, text: string, x: number, y: number, w: number, h: number, opts?: BarcodeOptions): void;
	/**
	 * the "d" of a svg path: the origin of the svg on (x, y), its y going down;
	 * scale: points by unit of the svg. fill and stroke as for path
	 */
	svgPath(d: string, x: number, y: number, scale: number, fill: string, stroke?: string, lineWidth?: number): void;
	/**
	 * a svg icon, as an Icon takes it (not a file: load it first, by svgLoader.load),
	 * its viewBox fitted and centered in w x h, (x, y) the bottom left corner
	 */
	icon(svg: string, x: number, y: number, w: number, h: number, opts?: IconOptions): void;
}

export class X4PDFBuilder {

	private objects: PDFObject[] = [];
	private pages: Ref[] = [];
	private nextId = 1;
	private props: PDFProps;

	constructor( props: PDFProps = {} ) {
		this.props = props;
	}

	private _addObject(dict: Record<string, PDFValue>, streamBytes: Uint8Array = null): Ref {
		const id = this.nextId++;
		this.objects.push({ id, dict, stream: streamBytes });
		return new Ref(id);
	}

	page( width: number, height: number, callback: (ctx: PageContext) => void ): void;
	page( callback: (ctx: PageContext) => void ): void;
	page( param1: number | ((ctx: PageContext) => void), param2?: number, param3?: (ctx: PageContext) => void ): void {
		const ops: string[] = [];
		const images: { name: string; ref: Ref }[] = [];
		const links: { url: string; rect: number[] }[] = [];
		let imageCount = 0;

		const text = (str: string, x: number, y: number, size: number, opts: TextOptions = {}) => {
			const { align = 'left', width: boxWidth, color = '#000000', bold = false } = opts;

			let tx = x;
			if (align !== 'left' && boxWidth !== undefined) {
				const textWidth = measureText(str, size, bold);
				if (align === 'center') {
					tx = x + (boxWidth - textWidth) / 2;
				}

				if (align === 'right') {
					tx = x + boxWidth - textWidth;
				}
			}

			ops.push( formatColor(new Color(color), 'rg') );

			ops.push('BT')
			ops.push(`/${bold ? 'F2' : 'F1'} ${size} Tf`)
			ops.push(`${fx(tx,2)} ${fx(y,2)} Td`)
			ops.push(`${pdfWinAnsi(str)} Tj`)
			ops.push('ET')
		}

		const rect = (x: number, y: number, w: number, h: number, fill: string) => {
			ops.push( formatColor(new Color(fill), 'rg' ) );
			ops.push(`${fx(x,2)} ${fx(y,2)} ${fx(w,2)} ${fx(h,2)} re`);
			ops.push('f');
		}

		const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, lineWidth: number = 1) => {
			ops.push(`${fx(lineWidth,2)} w`);
			ops.push( formatColor( new Color(stroke),'RG') );
			ops.push(`${fx(x1,2)} ${fx(y1,2)} m`);
			ops.push(`${fx(x2,2)} ${fx(y2,2)} l`);
			ops.push('S')
		}

		const draw = (segments: PathSegment[], fill: Color, stroke: Color, lineWidth: number, evenOdd = false) => {
			if (!fill && !stroke) {
				return
			}

			if (fill) {
				ops.push( formatColor(fill, 'rg') );
			}

			if (stroke) {
				ops.push(`${fx(lineWidth,2)} w`);
				ops.push( formatColor(stroke, 'RG') );
			}

			for (const [op, ...coords] of segments) {
				ops.push( [...coords.map( v => fx(v,2) ), op].join(' ') );
			}

			// f: fill, S: stroke, B: both; * for the even-odd rule
			const star = evenOdd ? '*' : ''
			ops.push( fill ? (stroke ? 'B' + star : 'f' + star) : 'S' );
		}

		const path = (segments: PathSegment[], fill: string, stroke?: string, lineWidth: number = 1) => {
			draw(segments, fill ? new Color(fill) : null, stroke ? new Color(stroke) : null, lineWidth)
		}

		const svgPath = (d: string, x: number, y: number, scale: number, fill: string, stroke?: string, lineWidth: number = 1) => {
			// the origin of the svg on (x, y), its y going down
			const segs = transformSegments(parseSvgPath(d), [scale, 0, 0, -scale, x, y])
			draw(segs, fill ? new Color(fill) : null, stroke ? new Color(stroke) : null, lineWidth)
		}

		const icon = (svg: string, x: number, y: number, w: number, h: number, opts: IconOptions = {}) => {
			const { box: [bx, by, bw, bh], shapes } = svgShapes(svgSource(svg), opts.color ?? '#000000')
			const background = opts.background ?? '#ffffff'

			// the viewBox fits in w x h, centered, its y going down
			const s = Math.min(w / bw, h / bh)
			const ox = x + (w - bw * s) / 2 - bx * s
			const oy = y + h - (h - bh * s) / 2 + by * s
			const m: Matrix = [s, 0, 0, -s, ox, oy]

			for (const shape of shapes) {
				draw(
					transformSegments(shape.segs, m),
					shape.fill ? mixColor(shape.fill, background, shape.alpha) : null,
					shape.stroke ? mixColor(shape.stroke, background, shape.alpha) : null,
					shape.width * s,
					shape.evenOdd
				)
			}
		}
		
		const image = (jpegBytes: Uint8Array, x: number, y: number, w: number, h: number) => {
			let imgWidth = 0, imgHeight = 0
			for (let i = 0; i < jpegBytes.length - 1; i++) {
				if (jpegBytes[i] === 0xFF && (jpegBytes[i + 1] === 0xC0 || jpegBytes[i + 1] === 0xC2)) {
					imgHeight = (jpegBytes[i + 5] << 8) | jpegBytes[i + 6]
					imgWidth = (jpegBytes[i + 7] << 8) | jpegBytes[i + 8]
					break
				}
			}

			const imgName = `/Im${imageCount++}`
			const imgRef = this._addObject({
				Type: '/XObject',
				Subtype: '/Image',
				Width: imgWidth,
				Height: imgHeight,
				ColorSpace: '/DeviceRGB',
				BitsPerComponent: 8,
				Filter: '/DCTDecode',
				Length: jpegBytes.length
			}, jpegBytes)

			images.push({ name: imgName, ref: imgRef })

			ops.push('q')
			ops.push(`${fx(w,2)} 0 0 ${fx(h,2)} ${fx(x,2)} ${fx(y,2)} cm`)
			ops.push(`${imgName} Do`)
			ops.push('Q')
		}

		const link = (url: string, x: number, y: number, w: number, h: number, opts: LinkOptions = {}) => {
			links.push({ url, rect: [x, y, x + w, y + h] })
			if (opts.underline) {
				ops.push(`0.75 w`)
				ops.push( formatColor(new Color(opts.underline), 'RG' ) );
				ops.push(`${fx(x,2)} ${fx(y + 2,2)} m`);
				ops.push(`${fx(x + w,2)} ${fx(y + 2,2)} l`);
				ops.push('S')
			}
		}

		const barcode = (type: BarcodeType, str: string, x: number, y: number, w: number, h: number, opts: BarcodeOptions = {}) => {
			const { rows, cols, runs } = barcodeRuns(type, str, opts)

			// a module: square in a Data Matrix, the whole height in a Code 128
			let mw: number, mh: number
			if (type === 'datamatrix') {
				mw = mh = Math.min(w, h) / cols
			}
			else {
				mw = w / cols
				mh = h
			}

			const top = y + rows * mh
			ops.push( formatColor(new Color(opts.color ?? '#000000'), 'rg') )
			for (const [r, c, len] of runs) {
				ops.push(`${fx(x + c * mw,3)} ${fx(top - (r + 1) * mh,3)} ${fx(len * mw,3)} ${fx(mh,3)} re`)
			}
			ops.push('f')
		}

		const ctx: PageContext = {
			text,
			rect,
			line,
			image,
			link,
			path,
			barcode,
			svgPath,
			icon
		}

		let width: number
		let height: number
		
		if ( isFunction( param1) ) {
			width  = 612
			height = 792
			param1( ctx );
		} 
		else {
			width  = param1;
			height = param2;
			param3( ctx );
		}

		const content = ops.join('\n')
		const contentBytes = new TextEncoder().encode(content)

		const contentRef = this._addObject({ Length: contentBytes.length }, contentBytes)

		const xobjects: Record<string, Ref> = {}
		for (const img of images) {
			xobjects[img.name.slice(1)] = img.ref
		}

		const annots: Ref[] = links.map(lnk => this._addObject({
			Type: '/Annot',
			Subtype: '/Link',
			Rect: lnk.rect,
			Border: [0, 0, 0],
			A: { Type: '/Action', S: '/URI', URI: lnk.url }
		}, null ) )

		const pageRef = this._addObject({
			Type: '/Page',
			Parent: null,
			MediaBox: [0, 0, width, height],
			Contents: contentRef,
			Resources: {
				Font: { F1: null, F2: null },
				XObject: Object.keys(xobjects).length > 0 ? xobjects : undefined
			},
			Annots: annots.length > 0 ? annots : undefined
		}, null )

		this.pages.push(pageRef)
	}

	/**
	 * the document, its streams compressed (FlateDecode). The images, already
	 * JPEG, are left as they are
	 */

	async buildAsync(): Promise<Uint8Array> {
		for (const obj of this.objects) {
			if (obj.stream && !obj.dict.Filter) {
				obj.stream = await deflate(obj.stream)
				obj.dict.Filter = '/FlateDecode'
				obj.dict.Length = obj.stream.length
			}
		}

		return this.build()
	}

	/**
	 * the document, its streams not compressed
	 */

	build(): Uint8Array {
		const fontRef = this._addObject({
			Type: '/Font',
			Subtype: '/Type1',
			BaseFont: '/Helvetica',
			Encoding: '/WinAnsiEncoding'
		})

		const boldRef = this._addObject({
			Type: '/Font',
			Subtype: '/Type1',
			BaseFont: '/Helvetica-Bold',
			Encoding: '/WinAnsiEncoding'
		})

		const pagesRef = this._addObject({
			Type: '/Pages',
			Kids: this.pages,
			Count: this.pages.length
		})

		for (const obj of this.objects) {
			if (obj.dict.Type === '/Page') {
				obj.dict.Parent = pagesRef
				const resources = obj.dict.Resources as Record<string, PDFValue> | undefined
				if (resources?.Font) {
					const fonts = resources.Font as Record<string, PDFValue>
					fonts.F1 = fontRef
					fonts.F2 = boldRef
				}
			}
		}

		// printed at its size, not fitted to the paper
		const catalogRef = this._addObject({
			Type: '/Catalog',
			Pages: pagesRef,
			ViewerPreferences: { PrintScaling: '/None', DisplayDocTitle: true }
		})

		const { title, author, subject } = this.props
		const infoRef = this._addObject({
			Title: title ? pdfTextString(title) : undefined,
			Author: author ? pdfTextString(author) : undefined,
			Subject: subject ? pdfTextString(subject) : undefined,
			Producer: pdfTextString('x4js')
		})

		const parts: (string | Uint8Array)[] = []
		const offsets: number[] = []

		// 1.6: PrintScaling
		parts.push('%PDF-1.6\n%\xFF\xFF\xFF\xFF\n')

		for (const obj of this.objects) {
			offsets[obj.id] = parts.reduce((sum, p) => sum + (typeof p === 'string' ? new TextEncoder().encode(p).length : p.length), 0)

			let content = `${obj.id} 0 obj\n${serialize(obj.dict)}\n`
			if (obj.stream) {
				content += 'stream\n'
				parts.push(content)
				parts.push(obj.stream)
				parts.push('\nendstream\nendobj\n')
			} 
			else {
				content += 'endobj\n'
				parts.push(content)
			}
		}

		const xrefOffset = parts.reduce((sum, p) => sum + (typeof p === 'string' ? new TextEncoder().encode(p).length : p.length), 0)

		let xref = `xref\n0 ${this.objects.length + 1}\n`
		xref += '0000000000 65535 f \n'
		for (let i = 1; i <= this.objects.length; i++) {
			xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
		}
		parts.push(xref)

		parts.push(`trailer\n${serialize({ Size: this.objects.length + 1, Root: catalogRef, Info: infoRef })}\n`)
		parts.push(`startxref\n${xrefOffset}\n%%EOF\n`)

		const totalLength = parts.reduce((sum, p) => sum + (typeof p === 'string' ? new TextEncoder().encode(p).length : p.length), 0)
		const result = new Uint8Array(totalLength)
		let offset = 0
		for (const part of parts) {
			const bytes = typeof part === 'string' ? new TextEncoder().encode(part) : part
			result.set(bytes, offset)
			offset += bytes.length
		}

		return result
	}
}

/*
export function markdown(md: string, opts: { width?: number; height?: number; margin?: number } = {}): Uint8Array {
	const W = opts.width ?? 612, H = opts.height ?? 792, M = opts.margin ?? 72
	const doc = pdf(), textW = W - M * 2, bodySize = 11, lineH = bodySize * 1.5
	type Item = { text: string; size: number; indent: number; spaceBefore: number; spaceAfter: number; rule?: boolean; color?: string }
	const items: Item[] = []

	const wrap = (text: string, size: number, maxW: number): string[] => {
		const words = text.split(' '), lines: string[] = []
		let line = ''
		for (const word of words) {
			const test = line ? line + ' ' + word : word
			if (measureText(test, size) <= maxW) line = test
			else { if (line) lines.push(line); line = word }
		}
		if (line) lines.push(line)
		return lines.length ? lines : ['']
	}

	let prevType = 'start'
	for (const raw of md.split('\n')) {
		const line = raw.trimEnd()
		if (/^#{1,3}\s/.test(line)) {
			const lvl = line.match(/^#+/)![0].length
			const size = [22, 16, 13][lvl - 1]
			const before = prevType === 'start' ? 0 : [14, 12, 10][lvl - 1]
			const wrapped = wrap(line.slice(lvl + 1), size, textW)
			wrapped.forEach((l, i) => items.push({ text: l, size, indent: 0, spaceBefore: i === 0 ? before : 0, spaceAfter: 4, color: '#111111' }))
			prevType = 'header'
		} else if (/^[-*]\s/.test(line)) {
			const wrapped = wrap(line.slice(2), bodySize, textW - 18)
			wrapped.forEach((l, i) => items.push({ text: (i === 0 ? '- ' : '  ') + l, size: bodySize, indent: 12, spaceBefore: 0, spaceAfter: 2 }))
			prevType = 'list'
		} else if (/^\d+\.\s/.test(line)) {
			const num = line.match(/^\d+/)![0]
			const text = line.slice(num.length + 2)
			const wrapped = wrap(text, bodySize, textW - 18)
			wrapped.forEach((l, i) => items.push({ text: (i === 0 ? num + '. ' : '   ') + l, size: bodySize, indent: 12, spaceBefore: 0, spaceAfter: 2 }))
			prevType = 'list'
		} else if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
			items.push({ text: '', size: bodySize, indent: 0, spaceBefore: 8, spaceAfter: 8, rule: true })
			prevType = 'rule'
		} else if (line.trim() === '') {
			if (prevType !== 'start' && prevType !== 'blank') items.push({ text: '', size: bodySize, indent: 0, spaceBefore: 0, spaceAfter: 4 })
			prevType = 'blank'
		} else {
			const wrapped = wrap(line, bodySize, textW)
			wrapped.forEach((l, i) => items.push({ text: l, size: bodySize, indent: 0, spaceBefore: 0, spaceAfter: 4, color: '#111111' }))
			prevType = 'para'
		}
	}

	const pages: { items: Item[]; ys: number[] }[] = []
	let y = H - M, pg: Item[] = [], ys: number[] = []
	for (const item of items) {
		const needed = item.spaceBefore + item.size + item.spaceAfter
		if (y - needed < M) { pages.push({ items: pg, ys }); pg = []; ys = []; y = H - M }
		y -= item.spaceBefore
		ys.push(y); pg.push(item)
		y -= item.size + item.spaceAfter
	}
	if (pg.length) pages.push({ items: pg, ys })

	for (const { items: pi, ys: py } of pages) {
		doc.page(W, H, ctx => {
			pi.forEach((it, i) => {
				if (it.rule) ctx.line(M, py[i], W - M, py[i], '#e0e0e0', 0.5)
				else if (it.text) ctx.text(it.text, M + it.indent, py[i], it.size, { color: it.color })
			})
		})
	}
	return doc.build()
}
*/
