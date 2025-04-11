/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file canvas_ex.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2025 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


export interface CanvasEx extends CanvasRenderingContext2D {
	width: number;
	height: number;

	smoothLine(points: any[], path: CanvasPath, move: boolean): void;
	smoothLineEx(_points: any[], tension: number, numOfSeg: number, path: CanvasPath, move?: boolean, close?: boolean): void;
	line(x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number): void;
	roundRect(x: number, y: number, width: number, height: number, radius: number): void;
	calcTextSize(text: string, rounded: boolean): { width: number, height: number };
	setFontSize(fs: number): void;
	circle(x: number, y: number, radius: number): void;
}

export function createPainter(c2d: CanvasRenderingContext2D, w: number, h: number): CanvasEx {

	let cp = c2d as CanvasEx;

	cp.width = w;
	cp.height = h;

	cp.smoothLine = smoothLine;
	cp.smoothLineEx = smoothLineEx;
	cp.line = line;
	cp.roundRect = roundRect;
	cp.calcTextSize = calcTextSize;
	cp.setFontSize = setFontSize;
	cp.circle = circle;

	return cp;
}

function smoothLine( this: CanvasRenderingContext2D, points: any[], path: CanvasPath = null, move = true) {
	if (points.length < 2) {
		return;
	}

	if (!path) {
		path = this;
	}

	if (points.length == 2) {
		if (move !== false) {
			path.moveTo(points[0].x, points[0].y);
		}
		else {
			path.lineTo(points[0].x, points[0].y);
		}

		path.lineTo(points[1].x, points[1].y);
		return;
	}

	function midPointBtw(p1: IPoint, p2: IPoint ) {
		return {
			x: p1.x + (p2.x - p1.x) / 2,
			y: p1.y + (p2.y - p1.y) / 2
		};
	}

	function getQuadraticXY(t: number, sx: number, sy: number, cp1x: number, cp1y: number, ex: number, ey: number) : IPoint {
		return {
			x: (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cp1x + t * t * ex,
			y: (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cp1y + t * t * ey
		};
	}

	let p1 = points[0],
		p2 = points[1],
		p3 = p1;

	path.moveTo(p1.x, p1.y);

	for (let i = 1, len = points.length; i < len; i++) {
		// we pick the point between pi+1 & pi+2 as the
		// end point and p1 as our control point
		let midPoint = midPointBtw(p1, p2);
		//this.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
		for (let i = 0; i < 8; i++) {
			let { x, y } = getQuadraticXY(i / 8, p3.x, p3.y, p1.x, p1.y, midPoint.x, midPoint.y);
			path.lineTo(x, y);
		}

		p1 = points[i];
		p2 = points[i + 1];
		p3 = midPoint;
	}

	// Draw last line as a straight line while
	// we wait for the next point to be able to calculate
	// the bezier control point

	path.lineTo(p1.x, p1.y);
}

function smoothLineEx(this: CanvasRenderingContext2D, _points: any[], tension: number = 0.5, numOfSeg: number = 10, path: CanvasPath = null, move = true, close = false) {

	let points = [];

	//pts = points.slice(0);
	for (let p = 0, pc = _points.length; p < pc; p++) {
		points.push(_points[p].x);
		points.push(_points[p].y);
	}

	let pts,
		i = 1,
		l = points.length,
		rPos = 0,
		rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
		res = new Float32Array(rLen),
		cache = new Float32Array((numOfSeg + 2) * 4),
		cachePtr = 4;

	pts = points.slice(0);

	if (close) {
		pts.unshift(points[l - 1]);				// insert end point as first point
		pts.unshift(points[l - 2]);
		pts.push(points[0], points[1]); 		// first point as last point
	}
	else {
		pts.unshift(points[1]);					// copy 1. point and insert at beginning
		pts.unshift(points[0]);
		pts.push(points[l - 2], points[l - 1]);	// duplicate end-points
	}

	// cache inner-loop calculations as they are based on t alone
	cache[0] = 1;								// 1,0,0,0

	for (; i < numOfSeg; i++) {

		var st = i / numOfSeg,
			st2 = st * st,
			st3 = st2 * st,
			st23 = st3 * 2,
			st32 = st2 * 3;

		cache[cachePtr++] = st23 - st32 + 1;	// c1
		cache[cachePtr++] = st32 - st23;		// c2
		cache[cachePtr++] = st3 - 2 * st2 + st;	// c3
		cache[cachePtr++] = st3 - st2;			// c4
	}

	cache[cachePtr] = 1;						// 0,1,0,0

	// calc. points
	parse(pts, cache, l);

	if (close) {
		//l = points.length;
		pts = [];
		pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
		pts.push(points[0], points[1], points[2], points[3]); // first and second
		parse(pts, cache, 4);
	}

	function parse(pts: number[], cache: Float32Array, l: number) {

		for (var i = 2, t; i < l; i += 2) {

			var pt1 = pts[i],
				pt2 = pts[i + 1],
				pt3 = pts[i + 2],
				pt4 = pts[i + 3],

				t1x = (pt3 - pts[i - 2]) * tension,
				t1y = (pt4 - pts[i - 1]) * tension,
				t2x = (pts[i + 4] - pt1) * tension,
				t2y = (pts[i + 5] - pt2) * tension;

			for (t = 0; t < numOfSeg; t++) {

				var c = t << 2, //t * 4;

					c1 = cache[c],
					c2 = cache[c + 1],
					c3 = cache[c + 2],
					c4 = cache[c + 3];

				res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
				res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
			}
		}
	}

	// add last point
	l = close ? 0 : points.length - 2;
	res[rPos++] = points[l];
	res[rPos] = points[l + 1];

	if (!path) {
		path = this;
	}

	// add lines to path
	for (let i = 0, l = res.length; i < l; i += 2) {
		if (i == 0 && move !== false) {
			path.moveTo(res[i], res[i + 1]);
		}
		else {
			path.lineTo(res[i], res[i + 1]);
		}
	}
}

function line(this: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lineWidth: number = 1) {
	this.save();
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.lineWidth = lineWidth;
	this.strokeStyle = color;
	this.stroke();
	this.restore();
}

function roundRect(this: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
	//this.beginPath( );
	this.moveTo(x + radius, y);
	this.lineTo(x + width - radius, y);
	this.quadraticCurveTo(x + width, y, x + width, y + radius);
	this.lineTo(x + width, y + height - radius);
	this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	this.lineTo(x + radius, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - radius);
	this.lineTo(x, y + radius);
	this.quadraticCurveTo(x, y, x + radius, y);
	this.closePath();
}

function calcTextSize( this: CanvasRenderingContext2D, text: string, rounded = false): { width: number, height: number } {

	let fh = this.measureText(text);
	let lh = fh.fontBoundingBoxAscent + fh.fontBoundingBoxDescent;

	if (rounded) {
		return { width: Math.round(fh.width), height: Math.round(lh) };
	}
	else {
		return { width: fh.width, height: lh };
	}
}

function setFontSize( this: CanvasRenderingContext2D, fs: number) {
	let fsize = Math.round(fs) + 'px';
	this.font = this.font.replace(/\d+px/, fsize);
}

function circle( this: CanvasRenderingContext2D, x: number, y: number, radius: number) {
	this.moveTo(x + radius, y);
	this.arc(x, y, radius, 0, Math.PI * 2);
}