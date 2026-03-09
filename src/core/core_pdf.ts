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


const WIDTHS: number[] = [
	278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
	556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
	1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
	667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
	333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
	556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584
]

export interface TextOptions {
	align?: 'left' | 'center' | 'right'
	width?: number
	color?: string
}

export interface LinkOptions {
	underline?: string
}

type PDFValue = null | boolean | number | string | PDFValue[] | Ref | { [key: string]: PDFValue }

interface PDFObject {
	id: number
	dict: Record<string, PDFValue>
	stream: Uint8Array | null
}

export function measureText(str: string, size: number): number {
	let width = 0
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i)
		const w = (code >= 32 && code <= 126) ? WIDTHS[code - 32] : 556
		width += w
	}
	return (width * size) / 1000
}

function fx( v:number, n:number ) {
	return (+v.toFixed(n)).toString();
}

function formatColor( clr: Color, suffix: string ) : string {
	const rgb = clr.toNumber( );
	return `${fx((rgb>>16)&0xff,3)} ${fx((rgb>>8)&0xff,3)} ${fx(rgb&0xff,3)} ${suffix}`;
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

		if (val.startsWith('(')) {
			return val  // already escaped string
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

class Ref {
	id: number
	constructor(id: number) { this.id = id }
}

interface PageContext {
	text(str: string, x: number, y: number, size: number, opts?: TextOptions): void;
	rect(x: number, y: number, w: number, h: number, fill: string): void;
	line(x1: number, y1: number, x2: number, y2: number, stroke: string, lineWidth?: number): void;
	image(jpegBytes: Uint8Array, x: number, y: number, w: number, h: number): void;
	link(url: string, x: number, y: number, w: number, h: number, opts?: LinkOptions): void;
}

export class X4PDFBuilder {

	private objects: PDFObject[] = [];
	private pages: Ref[] = [];
	private nextId = 1;

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
			const { align = 'left', width: boxWidth, color = '#000000' } = opts;

			let tx = x;
			if (align !== 'left' && boxWidth !== undefined) {
				const textWidth = measureText(str, size);
				if (align === 'center') {
					tx = x + (boxWidth - textWidth) / 2;
				}

				if (align === 'right') {
					tx = x + boxWidth - textWidth;
				}
			}

			const rgb = new Color(color);
			if (rgb) {
				ops.push( formatColor(rgb, 'rg') );
			}

			ops.push('BT')
			ops.push(`/F1 ${size} Tf`)
			ops.push(`${fx(tx,2)} ${fx(y,2)} Td`)
			ops.push(`${str.startsWith('(') ? str : pdfString(str)} Tj`)
			ops.push('ET')
		}
		
		const rect = (x: number, y: number, w: number, h: number, fill: string) => {
			const rgb = new Color(fill)
			if (rgb) {
				ops.push( formatColor(rgb, 'rg' ) );
				ops.push(`${fx(x,2)} ${fx(y,2)} ${fx(w,2)} ${fx(h,2)} re`);
				ops.push('f');
			}
		}
		
		const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, lineWidth: number = 1) => {
			const rgb = new Color(stroke)
			if (rgb) {
				ops.push(`${fx(lineWidth,2)} w`);
				ops.push( formatColor( rgb,'RG') );
				ops.push(`${fx(x1,2)} ${fx(y1,2)} m`);
				ops.push(`${fx(x2,2)} ${fx(y2,2)} l`);
				ops.push('S')
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
				const rgb = new Color(opts.underline)
				if (rgb) {
					ops.push(`0.75 w`)
					ops.push( formatColor(rgb, 'RG' ) );
					ops.push(`${fx(x,2)} ${fx(y + 2,2)} m`);
					ops.push(`${fx(x + w,2)} ${fx(y + 2,2)} l`);
					ops.push('S')
				}
			}
		}

		const ctx: PageContext = {
			text,
			rect,
			line,
			image,
			link
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
				Font: { F1: null },
				XObject: Object.keys(xobjects).length > 0 ? xobjects : undefined
			},
			Annots: annots.length > 0 ? annots : undefined
		}, null )

		this.pages.push(pageRef)
	}

	build(): Uint8Array {
		const fontRef = this._addObject({
			Type: '/Font',
			Subtype: '/Type1',
			BaseFont: '/Helvetica',
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
					(resources.Font as Record<string, PDFValue>).F1 = fontRef
				}
			}
		}

		const catalogRef = this._addObject({
			Type: '/Catalog',
			Pages: pagesRef
		})

		const parts: (string | Uint8Array)[] = []
		const offsets: number[] = []

		parts.push('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n')

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

		parts.push(`trailer\n${serialize({ Size: this.objects.length + 1, Root: catalogRef })}\n`)
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
