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









class SvgItem {
	protected _dom : SVGElement;

	constructor( tag: string ) {
		this._dom = document.createElementNS("http://www.w3.org/2000/svg", tag ); 
	}

	getDom( ) {
		return this._dom;
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

	strokeCap( cap: "butt" | "round" | "sqaure" ) {
		return this.setAttr( "stroke-linecap", cap );
	}

	strokeOpacity( opacity: number ) {
		return this.setAttr( "stroke-opacity", opacity+"" );
	}

	/**
	 * 
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

	no_fill( ): this {
		this.setAttr( 'fill', "transparent" );
		return this;
	}

	/**
	 * return the given attribute if any 
	 */

	getAttr( name: string ) : string {
		return this._dom.getAttribute( name );
	}

	/**
	 * define a new attribute
	 * @param name attibute name
	 * @param value attribute value
	 * @returns this
	 */

	setAttr( name: string, value: string ) : this {
		this._dom.setAttribute( name, value );
		return this;
	}

	/**
	 * 
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
	 * 
	 */

	clip( id: string ): this {
		this.setAttr( "clip-path", `url(#${id})` );
		return this;
	}

	/**
	 * 
	 */

	transform( tr: string ): this {
		const t = this.getAttr( "transform" ) ?? "";
		this.setAttr( "transform", t+' '+tr );
		return this;
	}

	clear_transform( ) {
		this.setAttr( "transform", null );
		return this;
	}

	/**
	 * 
	 */

	rotate( deg: number, cx: number, cy: number ): this {
		this.transform( `rotate( ${deg} ${cx} ${cy} )` );
		return this;
	}

	translate( dx: number, dy: number ): this {
		this.transform( `translate( ${dx} ${dy} )` );
		return this;
	}

	scale( x: number ): this {
		this.transform( `scale( ${x} )` );
		return this;
	}

	/**
	 * 
	 */

	addDOMEvent<K extends keyof GlobalDOMEvents>( name: K, listener: GlobalDOMEvents[K], prepend = false ) {
		addEvent( this._dom, name, listener as DOMEventHandler, prepend );
		return this;
	}
}



/**
 * 
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
	 * move the current pos
	 * @param x new pos x
	 * @param y new pos y
	 * @returns this
	 */

	moveTo( x: number, y: number ) : this {
		this._path += clean`M${x},${y}`;
		return this._update( );
	}

	/**
	 * draw aline to the given point
	 * @param x end x
	 * @param y end y
	 * @returns this
	 */

	lineTo( x: number, y: number ): this {
		this._path += clean`L${x},${y}`;
		return this._update( );
	}

	/**
	 * close the currentPath
	 */

	closePath( ): this {
		this._path += 'Z';
		return this._update( );
	}

	/**
	 * draw an arc
	 * @param x center x
	 * @param y center y
	 * @param r radius
	 * @param start angle start in degrees
	 * @param end angle end in degrees
	 * @returns this
	 */

	arc( x: number, y: number, r: number, start: number, end: number ): this {

		const st = p2c( x, y, r, start-90 );
		const en = p2c( x, y, r, end-90 );

		const flag = end - start <= 180 ? "0" : "1";
		this._path += clean`M${st.x},${st.y}A${r},${r} 0 ${flag} 1 ${en.x},${en.y}`;
		
		return this._update( );
	}
}

/**
 * 
 */

export class SvgText extends SvgItem {

	constructor( x: number, y: number, txt: string ) {
		super( 'text' );
		
		this.setAttr( 'x', num(x)+'' );
		this.setAttr( 'y', num(y)+'' );

		this._dom.innerHTML = txt;
	}

	font( font: string ): this {
		return this.setAttr( 'font-family', font );
	}

	fontSize( size: number | string ): this {
		return this.setAttr( 'font-size', size+'' );
	}

	fontWeight( weight: 'light' | 'normal' | 'bold' ): this {
		return this.setAttr( 'font-weight', weight );
	}

	textAlign( align: 'left' | 'center' | 'right' ): this {

		let al;
		switch( align ) {
			case 'left': al = 'start'; break;
			case 'center': al = 'middle'; break;
			case 'right': al = 'end'; break;
			default: return this;
		}

		return this.setAttr( 'text-anchor', al );
	}

	verticalAlign( align: 'top' | 'center' | 'bottom' | 'baseline' ): this {

		let al;
		switch( align ) {
			case 'top': al = 'hanging'; break;
			case 'center': al = 'middle'; break;
			case 'bottom': al = 'baseline'; break;
			case 'baseline': al = 'mathematical'; break;
			default: return;
		}

		return this.setAttr( 'alignment-baseline', al );
	}
}

/**
 * 
 */

export class SvgShape extends SvgItem {
	constructor( tag: string ) {
		super( tag );
	}
}

/**
 * 
 */

type number_or_perc = number | `${string}%`

export class SvgGradient extends SvgItem {

	private static g_id = 1;

	private _id: string;
	private _stops: { offset: number_or_perc, color: string } [];

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

	get id( ) {
		return 'url(#'+this._id+')';
	}

	addStop( offset: number_or_perc, color: string ): this {
		this._dom.insertAdjacentHTML( "beforeend", `<stop offset="${offset}%" stop-color="${color}"></stop>`);
		return this;
	}
}

/**
 * 
 */

export class SvgGroup extends SvgItem {
	
	constructor( tag = "g" ) {
		super( tag )
	}

	/**
	 * 
	 */

	append<K extends SvgItem>( item: K ): K  {
		this._dom.appendChild( item.getDom() );
		return item;
	}

	appendItems( ...items: SvgItem[] ): this  {
		items.forEach( x => this._dom.appendChild( x.getDom() ) );
		return this;
	}

	/**
	 * 
	 */

	path( ): SvgPath {
		const path = new SvgPath( );
		return this.append( path );
	}

	text( x: number, y: number, txt: string ) {
		const text = new SvgText( x, y, txt );
		return this.append( text );
	}

	ellipse( x: number, y: number, r1: number, r2: number ): SvgShape {
		const shape = new SvgShape( 'ellipse' );
		shape.setAttr( 'cx', num(x)+'' );
		shape.setAttr( 'cy', num(y)+'' );
		shape.setAttr( 'rx', num(r1)+'' );
		shape.setAttr( 'ry', num(r2)+'' );
		return this.append( shape );
	}

	circle( x: number, y: number, r1: number ): SvgShape {
		const shape = new SvgShape( 'ellipse' );
		shape.setAttr( 'cx', num(x)+'' );
		shape.setAttr( 'cy', num(y)+'' );
		shape.setAttr( 'rx', num(r1)+'' );
		shape.setAttr( 'ry', num(r1)+'' );
		return this.append( shape );
	}

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

	group( id?: string ) {
		const group = new SvgGroup( );
		if( id ) {
			group.setAttr( 'id', id );
		}

		return this.append( group );
	}

	/**
	 * 
	 * example
	 * ```ts
	 * const g = c.linear_gradient( '0%', '0%', '0%', '100%' )
	 * 				.addStop( 0, 'red' )
	 * 				.addStop( 100, 'green' );
	 * 
	 * p.rect( 0, 0, 100, 100 )
	 * 		.stroke( g.id );
	 * 
	 * ```
	 */

	linear_gradient( x1: number_or_perc, y1: number_or_perc, x2: number_or_perc, y2: number_or_perc ) {
		const grad = new SvgGradient( x1, y1, x2, y2 );
		return this.append( grad );
	}

	/**
	 * clear 
	 */

	clear( ) {
		const dom = this._dom;
		while( dom.firstChild ) {
			dom.removeChild( dom.firstChild );
		}
	}
}





export class SvgBuilder extends SvgGroup {
	private static g_clip_id = 1;
	
	constructor( ) {
		super(  );
	}

	addClip( x: number, y: number, w: number, h: number ) {
        
		const id = 'c-'+SvgBuilder.g_clip_id++;
		const clip = new SvgGroup( 'clipPath' );
		clip.setAttr('id', id );
		clip.rect( x, y, w, h );

		this.append(clip);
        return id;
    }
}



/**
 * 
 */

interface SvgProps extends ComponentProps {
	viewbox?: string;
	svg: SvgBuilder;
}

/**
 * 
 */

export class SvgComponent<P extends SvgProps = SvgProps> extends Component<P> {

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

	setSvg( bld: SvgBuilder ) {
		this.clearContent( );
		this.dom.appendChild( bld.getDom() );
	}

	addItems( ...items: SvgItem[] ) {
		items.forEach( item => this.dom.appendChild( item.getDom() ) );
	}
}
