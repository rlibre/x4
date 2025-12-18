/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_svg.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps } from './component';
import { isUnitLess } from "./core_styles";
import { DOMEventHandler, GlobalDOMEvents, addEvent } from './core_dom';
import { isNumber, isString } from './core_tools';

const SVG_NS = "http://www.w3.org/2000/svg"; 

// degrees to radian
function d2r( d: number ): number {
	return d * Math.PI / 180.0;
}

// polar to cartesian
function p2c( x: number, y: number, r: number, deg: number ): {x: number,y: number} {
	const rad = d2r( deg );
	return {
		x: x + r * Math.cos( rad ),
		y: y + r * Math.sin( rad )
	};
}

// fix prec for numbers
function num( x: number ): number {
	return Math.round( x * 1000 ) / 1000;
}

// clean values
function clean( a: any, ...b: any ) {
	// just round number values to 3 digits
	b = b.map( ( v: any ) => {
		if( typeof v === 'number' && isFinite(v) ) {
			return num(v);
		}

		return v;
	});

	return String.raw( a, ...b );
}



/**
 * Represents a lightweight wrapper around an SVG DOM element that provides
 * convenient, chainable helpers for common SVG manipulations (attributes,
 * styles, transforms, classes and events).
 *
 * The class encapsulates an underlying SVGElement and
 * exposes methods that operate directly on that element while allowing fluent chaining.
 *
 * Key behaviors:
 * - Creation: instances are constructed with the local name of the SVG tag
 *   (e.g. "rect", "circle", "g") and internally create the element in the
 *   SVG namespace.
 * - Attribute management: `getAttr`, `getNumAttr`, and `setAttr` let you read
 *   and write attributes. Passing `null` or `undefined` to `setAttr` removes
 *   the attribute.
 * - Styling: `setStyle` assigns CSS properties on the element. When a numeric
 *   value is provided, a "px" unit is appended unless the property is known
 *   to be unitless (the implementation relies on a small helper to detect
 *   unitless properties).
 * - Geometry & transforms: helpers exist for setting or appending transforms
 *   (`transform`, `add_transformation`, `clear_transform`), and higher-level
 *   helpers for rotate, translate and scale (both replace and append forms).
 * - Stroke & fill helpers: `stroke`, `strokeWidth`, `strokeCap`, `strokeOpacity`,
 *   `fill`, and `no_fill` provide convenient setters for common paint
 *   properties. These methods return `this` so they can be chained.
 * - Classes & clipping: `addClass` / `removeClass` manipulate the element's
 *   class list (supporting space-separated lists) and `clip` sets a clip-path
 *   reference using an id.
 * - Reset: `reset` removes all attributes from the element (but does not
 *   remove the element itself).
 * - Events: `addDOMEvent` attaches DOM events to the underlying element.
 *
 * Notes and caveats:
 * - This class is not a full DOM abstraction; it intentionally focuses on a
 *   small, ergonomic surface for building and manipulating SVG elements.
 * - Some behaviors depend on small utility helpers (e.g. numeric/unit detection
 *   and event-attachment helpers) provided elsewhere in the codebase.
 *
 */

class SvgItem {
	protected _dom : SVGElement;

	constructor( tag: string ) {
		this._dom = document.createElementNS("http://www.w3.org/2000/svg", tag ); 
	}

	/**
	 * @returns the svh element dom
	 */

	getDom( ) {
		return this._dom;
	}

	/**
	 * 
	 */

	/**
	 * Remove all attributes from the underlying DOM element.
	 * @returns The current instance (this) to allow method chaining.
	 */
	reset( ) {
		const attrs = this._dom.attributes;
		for (let i = attrs.length - 1; i >= 0; i--) {
			this._dom.removeAttribute(attrs[i].name);
		}

		return this;
	}


	/**
	 * change the stroke color
	 * @param color 
	 */

	stroke( color: string, width?: number ): this {
		this.setAttr( 'stroke', color );
		if( width!==undefined ) {
			this.setAttr( 'stroke-width', width+'px' );	
		}
		return this;
	}

	/**
	 * change the stroke width
	 * @param width 
	 */
	strokeWidth( width: number ): this {
		this.setAttr( 'stroke-width', width+'px' );
		return this;
	}

	/**
	 * change the stroke cap
	 * @param cap 
	 */

	strokeCap( cap: "butt" | "round" | "sqaure" ) {
		return this.setAttr( "stroke-linecap", cap );
	}

	/**
	 * change the stroke opacity attribute on the element.
	 * @param opacity - Opacity value where 0 is fully transparent and 1 is fully opaque.
	 * @returns The current instance to allow method chaining.
	 */

	strokeOpacity( opacity: number ) {
		return this.setAttr( "stroke-opacity", opacity+"" );
	}

	/**
	 * Set the shape rendering attribute to control anti-aliasing for shapes.
	 *
	 * When enabled, the attribute is set to "auto" to allow smoothing/anti-aliasing.
	 * When disabled, the attribute is set to "crispEdges" to favor pixel-aligned,
	 * non-anti-aliased rendering.
	 *
	 * @param set - True to enable anti-aliasing ("auto"), false to disable ("crispEdges").
	 * @returns the current instance to allow chaining).
	 */

	antiAlias( set: boolean ) {
		return this.setAttr( "shape-rendering", set ? "auto" : "crispEdges" );
	}

	/**
	 * change the fill color
	 * @param color 
	 */

	fill( color: string ): this {
		this.setAttr( 'fill', color );
		return this;
	}

	/**
	 * the element is not filled
	 */
	
	no_fill( ): this {
		this.setAttr( 'fill', "transparent" );
		return this;
	}

	/**
	 * return the given attribute if any 
	 */

	getAttr( name: string ) : string {
		const a = this._dom.getAttribute( name ) || '';
		return a;
	}

	/**
	 * return the attribute as number
	 */

	getNumAttr( name: string ) {
		const a = this._dom.getAttribute( name )
		if( a=='' ) {
			return 0;
		}

		return parseInt( a );
	}

	/**
	 * define a new attribute
	 * @param name attibute name
	 * @param value attribute value
	 * @returns this
	 */

	setAttr( name: string, value: string ) : this {
		if( value===null || value===undefined ) {
			this._dom.removeAttribute( name );
		}
		else {
			this._dom.setAttribute( name, value );
		}
		return this;
	}

	/**
	 * change one style value
	 */

	setStyle<K extends keyof CSSStyleDeclaration>( name: K, value: string | number ) : this {
		const _style = this._dom.style;

		if( isNumber(value) ) {
			let v = value+"";
			if( !isUnitLess(name as string) ) {
				v += "px";
			}
			
			(_style as any)[name] = v;
		}
		else {
			(_style as any)[name] = value;
		}

		return this;
	}

	/**
	 * add a class
	 * @param name class name to add 
	 */
	
	addClass( cls: string ): this {
		if( !cls ) return;
		
		cls = cls.trim();
		if( cls.indexOf(' ')>=0 ) {
			const ccs = cls.split( " " );
			this._dom.classList.add(...ccs);
		}
		else {
			this._dom.classList.add(cls);
		}

		return this;
	}

	/**
	 * remove a class
	 * @param name class name to remove
	 */
	
	removeClass( cls: string ): this {
		if( !cls ) return;
		
		if( cls.indexOf(' ')>=0 ) {
			const ccs = cls.split( " " );
			this._dom.classList.remove(...ccs);
		}
		else {
			this._dom.classList.remove(cls);
		}

		return this;
	}

	/**
	 * 
	 */

	clip( id: string ): this {
		this.setAttr( "clip-path", `url(#${id})` );
		return this;
	}
	
	/**
	 * define the whole transformation
	 */

	transform( tr: string ): this {
		this.setAttr( "transform", tr );
		return this;
	}

	/**
	 * add a transformation to the current transformation
	 */

	add_transformation( tr: string ): this {
		const t = this.getAttr( "transform" );
		this.setAttr( "transform", t+' '+tr );
		return this;
	}

	/**
	 * remove all transformations
	 */

	clear_transform( ) {
		this.setAttr( "transform", null );
		return this;
	}

	/**
	 * rotation
	 */

	rotate( deg: number, cx: number, cy: number ): this {
		this.transform( `rotate( ${deg} ${cx} ${cy} )` );
		return this;
	}

	add_rotation( deg: number, cx: number, cy: number ): this {
		this.add_transformation( `rotate( ${deg} ${cx} ${cy} )` );
		return this;
	}

	/**
	 * translation
	 */

	translate( dx: number, dy: number ): this {
		this.transform( `translate( ${dx} ${dy} )` );
		return this;
	}

	add_translation( dx: number, dy: number ): this {
		this.add_transformation( `translate( ${dx} ${dy} )` );
		return this;
	}

	/**
	 * scaling
	 */

	scale( x: number ): this {
		this.transform( `scale( ${x} )` );
		return this;
	}

	add_scale( x: number ): this {
		this.add_transformation( `scale( ${x} )` );
		return this;
	}

	/**
	 * handle SVG DOM event
	 */

	addDOMEvent<K extends keyof GlobalDOMEvents>( name: K, listener: GlobalDOMEvents[K], prepend = false ) {
		addEvent( this._dom, name, listener as DOMEventHandler, prepend );
		return this;
	}
}



/**
 * Represents an SVG path element, providing methods for constructing and manipulating SVG paths.
 * It extends `SvgItem` to inherit common SVG element functionalities.
 */

export class SvgPath extends SvgItem {
	private _path: string;

	constructor( ) {
		super( 'path' );
		this._path = '';
	}

	private _update( ): this {
		this.setAttr( 'd', this._path );
		return this;
	}

	/**
	 * Resets the path data and all attributes of the SVG path element.
	 * @returns The current `SvgPath` instance for chaining.
	 */
	reset( ) {
		this._path = "";
		super.reset( );
		return this;
	}

	/**
	 * Moves the current drawing position to the specified coordinates without drawing a line.
	 * This is typically the first command in a path.
	 *
	 * @param x - The x-coordinate to move to.
	 * @param y - The y-coordinate to move to.
	 * @returns this
	 */

	moveTo( x: number, y: number ) : this {
		this._path += clean`M${x},${y}`;
		return this._update( );
	}

	/**
	 * Draws a straight line from the current position to the specified coordinates.
	 *
	 * @param x - The x-coordinate of the end point.
	 * @param y - The y-coordinate of the end point.
	 * @returns this
	 */

	lineTo( x: number, y: number ): this {
		this._path += clean`L${x},${y}`;
		return this._update( );
	}

	/**
	 * Draws a cubic Bézier curve from the current point to `(x3, y3)` using `(x1, y1)`
	 * as the control point at the beginning of the curve and `(x2, y2)` as the
	 * control point at the end of the curve.
	 *
	 * @param x1 - The x-coordinate of the first control point.
	 * @param y1 - The y-coordinate of the first control point.
	 * @param x2 - The x-coordinate of the second control point.
	 * @param y2 - The y-coordinate of the second control point.
	 * @param x3 - The x-coordinate of the end point of the curve.
	 * @param y3 - The y-coordinate of the end point of the curve.
	 *
	 * @returns The current `SvgPath` instance for chaining.
	 */

	curveTo( x1: number, y1: number, x2: number, y2: number, x3: number, y3: number ) {
		this._path += clean`C${x1},${y1} ${x2},${y2} ${x3},${y3}`;
		return this._update( );
	}


	/**
	 * Closes the current subpath by drawing a straight line from the current position
	 * to the initial point of the current subpath.
	 * @returns The current `SvgPath` instance for chaining.
	 */

	closePath( ): this {
		this._path += 'Z';
		return this._update( );
	}

	/**
	 * draw an arc
	 * Draws an elliptical arc from the current point to a new point.
	 *
	 * @param x - The x-coordinate of the center of the ellipse.
	 * @param y - The y-coordinate of the center of the ellipse.
	 * @param r - The radius of the arc.
	 * @param start - The start angle of the arc in degrees (0 is right, 90 is down).
	 * @param end - The end angle of the arc in degrees.
	 * @param clockwise - If `true`, the arc is drawn clockwise; otherwise, counter-clockwise. Defaults to `true`.
	 *
	 * @returns this
	 */

	arc( x: number, y: number, r: number, start: number, end: number, clockwise= true ): this {

		const st = p2c( x, y, r, start-90 );
		const en = p2c( x, y, r, end-90 );

		const flag = ((end-start) <= 180 ? "0" : "1");
		this._path += clean`M${st.x},${st.y}A${r},${r} 0 ${flag} ${(clockwise ? '1' : '0')} ${en.x},${en.y}`;
		
		return this._update( );
	}
}

/**
 * Represents an SVG text element, providing methods for positioning and styling text.
 * It extends `SvgItem` to inherit common SVG element functionalities.
 */

export class SvgText extends SvgItem {
	/**
	 * Creates an instance of `SvgText`.
	 * @param x - The x-coordinate for the text's starting position.
	 * @param y - The y-coordinate for the text's starting position.
	 * @param txt - The text content.
	 */
	constructor( x: number, y: number, txt: string ) {
		super( 'text' );
		
		this.setAttr( 'x', num(x)+'' );
		this.setAttr( 'y', num(y)+'' );

		this._dom.innerHTML = txt;
	}

	/**
	 * Sets the font family for the text.
	 * @param font - The font family name (e.g., "Arial", "sans-serif").
	 * @returns The current `SvgText` instance for chaining.
	 */
	font( font: string ): this {
		return this.setAttr( 'font-family', font );
	}

	/**
	 * Sets the font size for the text.
	 * @param size - The font size, either as a number (e.g., 12) or a string (e.g., "1.2em").
	 * @returns The current `SvgText` instance for chaining.
	 */
	fontSize( size: number | string ): this {
		return this.setAttr( 'font-size', size+'' );
	}

	/**
	 * Sets the font weight for the text.
	 * @param weight - The font weight ("light", "normal", or "bold").
	 * @returns The current `SvgText` instance for chaining.
	 */
	fontWeight( weight: 'light' | 'normal' | 'bold' ): this {
		return this.setAttr( 'font-weight', weight );
	}

	/**
	 * Sets the horizontal text alignment.
	 * @param align - The horizontal alignment ("left", "center", or "right").
	 * @returns The current `SvgText` instance for chaining.
	 */
	textAlign( align: 'left' | 'center' | 'right' ): this {

		let al;
		switch( align ) {
			case 'left': al = 'start'; break;
			case 'center': al = 'middle'; break;
			case 'right': al = 'end'; break;
			default:
				// If an invalid alignment is provided, do nothing and return this for chaining.
				// This prevents setting an invalid attribute value.
				console.warn(`Invalid textAlign value: ${align}. Must be 'left', 'center', or 'right'.`);
				return this;
		}

		return this.setAttr( 'text-anchor', al );
	}

	/**
	 * change the vertical alignment
	 */
	verticalAlign( align: 'top' | 'center' | 'bottom' | 'baseline' ): this {

		let al;
		switch( align ) {
			case 'top': al = 'hanging'; break;
			case 'center': al = 'middle'; break;
			case 'bottom': al = 'baseline'; break;
			case 'baseline': al = 'mathematical'; break;
			default:
				// If an invalid alignment is provided, do nothing and return this for chaining.
				console.warn(`Invalid verticalAlign value: ${align}. Must be 'top', 'center', 'bottom', or 'baseline'.`);
				return this;
		}

		return this.setAttr( 'alignment-baseline', al );
	}
}

/**
 * Represents an SVG icon, which is essentially an SVG element embedded within another.
 * It extends `SvgItem` to inherit common SVG element functionalities.
 */

export class SvgIcon extends SvgItem {
	/**
	 * Creates an instance of `SvgIcon` from an SVG string.
	 * @param svg - The SVG string, optionally prefixed with "data:image/svg+xml,".
	 */
	constructor( svg: string ) {
		super( "svg" );

		if( svg.startsWith("data:image/svg+xml,") ) {
			svg = svg.substring( 19 );
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString( decodeURIComponent(svg), "image/svg+xml");

		const parserErrorElement = doc.querySelector("parsererror");
		if( parserErrorElement ) {
			console.error( "error while parsing svg:\n"+ parserErrorElement.textContent );
		}

		const svgRoot = doc.documentElement; // The <svg> element from the string
		for( let i=0; i<svgRoot.attributes.length; i++) {
			this._dom.setAttribute( svgRoot.attributes[i].name, svgRoot.attributes[i].value );
		}

		for( let i=0; i<svgRoot.childNodes.length; i++) {
			const child = svgRoot.childNodes[i];
			if (child.nodeType === 1) { 
				this._dom.appendChild(child);
			} 
		}
	}
}



/**
 * Represents a generic SVG shape element.
 * It extends `SvgItem` to inherit common SVG element functionalities.
 */

export class SvgShape extends SvgItem {
	constructor( tag: string ) {
		super( tag );
	}
}

/**
 * 
 * Type alias for a number or a percentage string.
 */

type number_or_perc = number | `${string}%`

/**
 * Represents an SVG linear gradient element.
 * It extends `SvgItem` to inherit common SVG element functionalities.
 */
export class SvgGradient extends SvgItem {

	private static g_id = 1;

	private _id: string;
	private _stops: { offset: number_or_perc, color: string } [];

	/**
	 * Creates an instance of `SvgGradient`.
	 * @param x1 - The x-coordinate of the starting point of the gradient vector.
	 * @param y1 - The y-coordinate of the starting point of the gradient vector.
	 * @param x2 - The x-coordinate of the ending point of the gradient vector.
	 * @param y2 - The y-coordinate of the ending point of the gradient vector.
	 * @returns The current `SvgGradient` instance for chaining.
	 */
	constructor( x1: number_or_perc, y1: number_or_perc, x2: number_or_perc, y2: number_or_perc ) {
		super( 'linearGradient')
		
		this._id = 'gx-'+SvgGradient.g_id;
		SvgGradient.g_id++;

		this.setAttr( 'id', this._id );
		this.setAttr( 'x1', isString(x1) ? x1 : num(x1)+'' );
		this.setAttr( 'x2', isString(x2) ? x2 : num(x2)+'' );
		this.setAttr( 'y1', isString(y1) ? y1 : num(y1)+'' );
		this.setAttr( 'y2', isString(y2) ? y2 : num(y2)+'' );

		this._stops = [];
	}

	/**
	 * Gets the URL reference to this gradient, suitable for use in `fill` or `stroke` attributes.
	 * @returns A string in the format `url(#<gradient_id>)`.
	 */
	get id( ) {
		return 'url(#'+this._id+')';
	}

	/**
	 * Adds a color stop to the gradient.
	 * @param offset - The offset of the color stop, either as a number (0-100) or a percentage string.
	 * @param color - The color at this stop.
	 * @returns The current `SvgGradient` instance for chaining.
	 */
	addStop( offset: number_or_perc, color: string ): this {
		this._dom.insertAdjacentHTML( "beforeend", `<stop offset="${offset}%" stop-color="${color}"></stop>`);
		return this;
	}
}

/**
 * Represents an SVG group element (`<g>`), which can contain other SVG elements.
 * It extends `SvgItem` and provides methods for appending various SVG shapes and gradients.
 */

export class SvgGroup extends SvgItem {
	
	/**
	 * Creates an instance of `SvgGroup`.
	 * @param tag - The SVG tag name for the group element (defaults to "g").
	 */
	constructor( tag = "g" ) {
		super( tag )
	}

	/**
	 * Appends an `SvgItem` to this group.
	 *
	 * @template K - The type of the `SvgItem` being appended.
	 * @param item - The `SvgItem` instance to append.
	 *
	 * @returns The appended `SvgItem` instance.
	 */
	

	append<K extends SvgItem>( item: K ): K  {
		this._dom.appendChild( item.getDom() );
		return item;
	}

	appendItems<K extends SvgItem>( items: K[] )  {
		items.forEach( item => {
			this._dom.appendChild( item.getDom() );
		} );
	}

	/**
	 * Creates and appends an `SvgPath` element to this group.
	 * @returns The newly created `SvgPath` instance.
	 */

	path( ): SvgPath {
		const path = new SvgPath( );
		return this.append( path );
	}

	/**
	 * Creates and appends an `SvgText` element to this group.
	 * @param x - The x-coordinate for the text.
	 * @param y - The y-coordinate for the text.
	 * @param txt - The text content.
	 * @returns The newly created `SvgText` instance.
	 */
	text( x: number, y: number, txt: string ) {
		const text = new SvgText( x, y, txt );
		return this.append( text );
	}

	/**
	 * Creates and appends an SVG ellipse element to this group.
	 *
	 * @param x - The x-coordinate of the center of the ellipse.
	 * @param y - The y-coordinate of the center of the ellipse.
	 * @param r1 - The x-radius of the ellipse.
	 * @param r2 - The y-radius of the ellipse.
	 *
	 * @returns The newly created `SvgShape` instance representing the ellipse.
	 */
	ellipse( x: number, y: number, r1: number, r2: number ): SvgShape {
		const shape = new SvgShape( 'ellipse' );
		shape.setAttr( 'cx', num(x)+'' );
		shape.setAttr( 'cy', num(y)+'' );
		shape.setAttr( 'rx', num(r1)+'' );
		shape.setAttr( 'ry', num(r2)+'' );
		return this.append( shape );
	}

	/**
	 * Creates and appends an SVG circle element to this group.
	 * (Internally uses an ellipse with equal x and y radii).
	 *
	 * @param x - The x-coordinate of the center of the circle.
	 * @param y - The y-coordinate of the center of the circle.
	 * @param r1 - The radius of the circle.
	 * @returns The newly created `SvgShape` instance representing the circle.
	 */
	circle( x: number, y: number, r1: number ): SvgShape {
		const shape = new SvgShape( 'ellipse' );
		shape.setAttr( 'cx', num(x)+'' );
		shape.setAttr( 'cy', num(y)+'' );
		shape.setAttr( 'rx', num(r1)+'' );
		shape.setAttr( 'ry', num(r1)+'' );
		return this.append( shape );
	}

	/**
	 * Creates and appends an `SvgIcon` element to this group.
	 *
	 * @param svg - The SVG string content for the icon.
	 * @param x - The x-coordinate for the icon's position.
	 * @param y - The y-coordinate for the icon's position.
	 * @param w - The width of the icon.
	 * @param h - The height of the icon.
	 * @returns The newly created `SvgIcon` instance.
	 */
	icon( svg: string, x: number, y: number, w: number, h: number ): SvgIcon {
		const icon = new SvgIcon( svg );
		icon.setAttr( 'x', num(x)+'' );
		icon.setAttr( 'y', num(y)+'' );
		icon.setAttr( 'width', num(w)+'' );
		icon.setAttr( 'height', num(h)+'' );
		icon.setStyle( 'width', num(w)+'px' );
		icon.setStyle( 'height', num(h)+'px' );
		return this.append( icon );
	}

	/**
	 * Creates and appends an SVG rectangle element to this group.
	 * Handles negative height by adjusting `y` and `h` accordingly.
	 *
	 * @param x - The x-coordinate of the top-left corner of the rectangle.
	 * @param y - The y-coordinate of the top-left corner of the rectangle.
	 * @param w - The width of the rectangle.
	 * @param h - The height of the rectangle.
	 * @returns The newly created `SvgShape` instance representing the rectangle.
	 */
	rect( x: number, y: number, w: number, h: number ): SvgShape {

		if( h<0 ) {
			y = y+h;
			h = -h;
		}

		const shape = new SvgShape( 'rect' );
		shape.setAttr( 'x', num(x)+'' );
		shape.setAttr( 'y', num(y)+'' );
		shape.setAttr( 'width', num(w)+'' );
		shape.setAttr( 'height', num(h)+'' );
		return this.append( shape );
	}

	/**
	 * Creates and appends an SVG group element (`<g>`) to this group.
	 * @param id - Optional. An ID for the new group.
	 * @returns The newly created `SvgGroup` instance.
	 */
	group( id?: string ) {
		const group = new SvgGroup( );
		if( id ) {
			group.setAttr( 'id', id );
		}

		return this.append( group );
	}

	/**
	 * 
	 * Creates and appends an SVG linear gradient definition to this group.
	 *
	 * @example
	 * ```typescript
	 * const gradient = svgGroup.linear_gradient('0%', '0%', '0%', '100%')
	 *                          .addStop(0, 'red')
	 *                          .addStop(100, 'green');
	 * svgGroup.rect(0, 0, 100, 100).fill(gradient.id);
	 * ```
	 * @param x1 - The x-coordinate of the starting point of the gradient vector.
	 * @param y1 - The y-coordinate of the starting point of the gradient vector.
	 * @param x2 - The x-coordinate of the ending point of the gradient vector.
	 * @param y2 - The y-coordinate of the ending point of the gradient vector.
	 * @returns The newly created `SvgGradient` instance.
	 */

	linear_gradient( x1: number_or_perc, y1: number_or_perc, x2: number_or_perc, y2: number_or_perc ) {
		const grad = new SvgGradient( x1, y1, x2, y2 );
		return this.append( grad );
	}

	/**
	 * Clears all child elements from this SVG group.
	 *
	 * @returns void
	 */

	clear( ) {
		const dom = this._dom;
		while( dom.firstChild ) {
			dom.removeChild( dom.firstChild );
		}
	}
}





/**
 * A specialized `SvgGroup` that provides methods for adding SVG definitions like clip paths and patterns.
 * It extends `SvgGroup` to inherit common SVG element functionalities and acts as a container for definitions.
 */
export class SvgBuilder extends SvgGroup {
	private static g_clip_id = 1;
	private static g_pat_id = 1;
	
	/**
	 * Creates an instance of `SvgBuilder`.
	 */
	constructor( ) {
		super(  );
	}

	/**
	 * Adds an SVG clip path definition to the builder.
	 *
	 * @param x - The x-coordinate of the top-left corner of the clipping rectangle.
	 * @param y - The y-coordinate of the top-left corner of the clipping rectangle.
	 * @param w - The width of the clipping rectangle.
	 * @param h - The height of the clipping rectangle.
	 * @returns An object containing the generated `id` for the clip path and the `SvgGroup` instance representing the clip path.
	 */
	addClip( x: number, y: number, w: number, h: number ) {
		/**
		 * Adds an SVG clip path definition to the builder.
		 *
		 * @param x - The x-coordinate of the top-left corner of the clipping rectangle.
		 * @param y - The y-coordinate of the top-left corner of the clipping rectangle.
		 * @param w - The width of the clipping rectangle.
		 * @param h - The height of the clipping rectangle.
		 * @returns An object containing the generated `id` for the clip path and the `SvgGroup` instance representing the clip path.
		 */
		const id = 'clip-'+SvgBuilder.g_clip_id++;
		const clip = new SvgGroup( 'clipPath' );
		clip.setAttr('id', id );
		clip.rect( x, y, w, h );

		this.append(clip);
        return {id,clip};
    }

	/**
	 * Adds an SVG pattern definition to the builder.
	 *
	 * @param x - The x-coordinate of the pattern tile's top-left corner.
	 * @param y - The y-coordinate of the pattern tile's top-left corner.
	 * @param w - The width of the pattern tile.
	 * @param h - The height of the pattern tile.
	 * @returns An object containing the generated `id` for the pattern and the `SvgGroup` instance representing the pattern.
	 */
	addPattern( x: number, y: number, w: number, h: number ) {
		/**
		 * Adds an SVG pattern definition to the builder.
		 *
		 * @param x - The x-coordinate of the pattern tile's top-left corner.
		 * @param y - The y-coordinate of the pattern tile's top-left corner.
		 * @param w - The width of the pattern tile.
		 * @param h - The height of the pattern tile.
		 * @returns An object containing the generated `id` for the pattern and the `SvgGroup` instance representing the pattern.
		 */
		const id = 'pat-'+SvgBuilder.g_pat_id++;

		const pat = new SvgGroup( 'pattern' );
		pat.setAttr( 'id', id );
		pat.setAttr( 'x', num(x)+'' );
		pat.setAttr( 'y', num(y)+'' );
		pat.setAttr( 'width', num(w)+'' );
		pat.setAttr( 'height', num(h)+'' );
		pat.setAttr( 'patternUnits', "userSpaceOnUse" );

		this.append(pat);
		return {id,pat};
    }
}



/**
 * Properties for the `SvgComponent`.
 */

export interface SvgProps extends ComponentProps {
	viewbox?: string;
	svg?: SvgBuilder;
}

/**
 * A component that renders an SVG element, acting as a container for SVG graphics.
 * It extends `Component` and provides methods for setting SVG content.
 */

export class SvgComponent<P extends SvgProps = SvgProps> extends Component<P> {

	/**
	 * Creates an instance of `SvgComponent`.
	 * @param props - The properties for the SVG component.
	 */
	constructor( props: P ) {
		super( { ...props, tag: "svg", ns: SVG_NS } );

		this.setAttribute( 'xmlns', SVG_NS );

		if( props.viewbox ) {
			this.setAttribute( "viewBox", props.viewbox );
		}

		if( props.svg ) {
			this.dom.appendChild( props.svg.getDom() );
		}
	}

	/**
	 * Sets the entire SVG content of the component using an `SvgBuilder`.
	 * Any existing content will be cleared.
	 * @param bld - The `SvgBuilder` instance containing the SVG elements to render.
	 */
	setSvg( bld: SvgBuilder ) {
		this.clearContent( );
		this.dom.appendChild( bld.getDom() );
	}

	/**
	 * Appends one or more `SvgItem` instances directly to the SVG component's DOM.
	 *
	 * @param items - A spread array of `SvgItem` instances to append.
	 */
	addItems( ...items: SvgItem[] ) {
		items.forEach( item => this.dom.appendChild( item.getDom() ) );
	}
}
