/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file mapview.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvent, ComponentEvents, ComponentProps } from '../../core/component';
import { SvgBuilder, SvgComponent } from '../../core/core_svg';
import { clamp, UnsafeHtml, unsafeHtml } from '../../core/core_tools';

import { VBox } from '../boxes/boxes';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { SimpleText } from '../label/label';

import './mapview.module.scss';

export interface LatLng {
	lat: number;
	lng: number;
}

export interface MapMarker extends LatLng {
	title?: string;			// its tooltip (shown as html: escape a text from a user)
	icon?: string;			// a pin by default
	data?: any;
}

// a zone on the map: its color is the one of the palette of Chart (--chart-color-1..8), in turn,
// or its own

interface MapShapeBase {
	title?: string;			// its tooltip (shown as html: escape a text from a user)
	color?: string;
	width?: number;			// its line, in pixels: 4 for a line, 2 for the border of a polygon or a circle by default
	data?: any;
}

export interface MapPolygon extends MapShapeBase {
	type: "polygon";
	points: LatLng[];
}

export interface MapCircle extends MapShapeBase {
	type: "circle";
	center: LatLng;
	radius: number;			// in meters
}

export interface MapLine extends MapShapeBase {
	type: "line";
	points: LatLng[];
}

export type MapShape = MapPolygon | MapCircle | MapLine;

export interface EvMapMove extends ComponentEvent {
	readonly center: LatLng;
	readonly zoom: number;
}

export interface EvMapClick extends ComponentEvent {
	readonly latlng: LatLng;
}

export interface EvMarkerClick extends ComponentEvent {
	readonly marker: MapMarker;
}

export interface EvShapeClick extends ComponentEvent {
	readonly shape: MapShape;
}

export interface MapViewEvents extends ComponentEvents {
	move: EvMapMove;
	click: EvMapClick;
	markerClick: EvMarkerClick;
	shapeClick: EvShapeClick;
}

export interface MapViewProps extends Omit<ComponentProps,"content"> {
	center?: LatLng;		// 0,0 by default
	zoom?: number;			// 2 by default
	minZoom?: number;		// 1 by default
	maxZoom?: number;		// 19 by default
	/** the url of a tile: {z} {x} {y}; openstreetmap by default */
	tiles?: string;
	/** the credit of the tiles, always shown; the one of openstreetmap by default */
	attribution?: string | UnsafeHtml;
	markers?: MapMarker[];
	/** zones, under the markers */
	shapes?: MapShape[];
	/** the user moved or zoomed the map (not setCenter, setZoom, fitBounds) */
	move?: EventCallback<EvMapMove>;
	/** a click on the map, not on a marker nor a zone: where */
	click?: EventCallback<EvMapClick>;
	markerClick?: EventCallback<EvMarkerClick>;
	shapeClick?: EventCallback<EvShapeClick>;
}

const TILE = 256;
const NUM_COLORS = 8;
const EQUATOR = 40075016.686;		// meters: the world at the equator, TILE pixels at the zoom 0
const MAX_LAT = 85.0511287798;		// web mercator: the world is a square
const OSM_TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_CREDIT = unsafeHtml( `© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors` );

const icon_pin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="currentColor"/><circle cx="12" cy="12" r="4.5" fill="#fff"/></svg>`;

// web mercator: a place → its pixel in the world at the zoom z, and back

function project( ll: LatLng, z: number ) {
	const ws = TILE * 2**z;
	const s = Math.sin( clamp( ll.lat, -MAX_LAT, MAX_LAT ) * Math.PI / 180 );

	return {
		x: ( ll.lng + 180 ) / 360 * ws,
		y: ( 0.5 - Math.log( (1+s) / (1-s) ) / ( 4*Math.PI ) ) * ws,
	};
}

function unproject( x: number, y: number, z: number ): LatLng {
	const ws = TILE * 2**z;
	const n = Math.PI - 2*Math.PI * y / ws;

	return {
		lat: 180 / Math.PI * Math.atan( Math.sinh( n ) ),
		lng: x / ws * 360 - 180,
	};
}


/**
 * a map of tiles (openstreetmap by default): the pointer moves it, the wheel, a double click
 * and the buttons zoom it, markers are put on places.
 *
 * The tiles of openstreetmap are for a light use: an application with many users takes
 * its tiles from a provider (props tiles and attribution).
 *
 * @cssvar
 * ```
 * --mapview-background
 * --mapview-marker
 * --mapview-tile-filter
 * --mapview-credit-background
 * ```
 */

export class MapView extends Component<MapViewProps,MapViewEvents> {
	static classPrefix = "x4";

	private _zoom: number;
	private _cx: number;		// the center, in pixels of the world at _zoom
	private _cy: number;
	private _markers: MapMarker[];
	private _fit: LatLng[] = null;		// fitBounds before the map has a size

	// two layers of tiles: the front one is drawn; the back one, the tiles of the zoom before,
	// grows or shrinks under it while the new tiles come
	private _layers: Component[];
	private _tiles: Component;
	private _zones: SvgComponent;
	private _pins: Component;
	private _shapes: MapShape[];
	private _shown = new Map<string, Component>( );		// tiles of the front layer: "z/x/y"

	private _pointers = new Map<number, { x: number, y: number }>( );
	private _drag: { x: number, y: number, moved: number } = null;
	private _pinch: { d0: number, m0: { x: number, y: number }, r: number, dx: number, dy: number } = null;
	private _wheel = 0;

	constructor( props: MapViewProps ) {
		super( props );

		this.mapPropEvents( props, "move", "click", "markerClick", "shapeClick" );

		this._zoom = clamp( props.zoom ?? 2, this._minZoom( ), this._maxZoom( ) );
		const c = project( props.center ?? { lat: 0, lng: 0 }, this._zoom );
		this._cx = c.x;
		this._cy = c.y;
		this._markers = props.markers ?? [];
		this._shapes = props.shapes ?? [];

		this.setContent( [
			this._tiles = new Component( { cls: "tiles front" } ),
			new Component( { cls: "tiles" } ),
			this._zones = new SvgComponent( { cls: "shapes" } ),
			this._pins = new Component( { cls: "markers" } ),
			new VBox( { cls: "zoom", content: [
				new Button( { label: "+", tabindex: false, click: ( ) => this._zoomBy( 1 ) } ),
				new Button( { label: "−", tabindex: false, click: ( ) => this._zoomBy( -1 ) } ),
			] } ),
			new SimpleText( { cls: "credit", text: props.attribution ?? OSM_CREDIT } ),
		] );

		this._layers = this.queryAll( ".tiles" );

		this.setAttribute( "tabindex", 0 );
		this._buildMarkers( );

		this.setDOMEvents( {
			created: ( ) => this._render( ),
			resized: ( ) => this._render( ),
			pointerdown: ( ev ) => this._on_pointerdown( ev ),
			pointermove: ( ev ) => this._on_pointermove( ev ),
			pointerup: ( ev ) => this._on_pointerup( ev ),
			pointercancel: ( ev ) => this._on_pointerup( ev ),
			wheel: ( ev ) => this._on_wheel( ev ),
			dblclick: ( ev ) => this._on_dblclick( ev ),
			keydown: ( ev ) => this._on_key( ev ),
		} );
	}

	private _minZoom( ) { return this.props.minZoom ?? 1; }
	private _maxZoom( ) { return this.props.maxZoom ?? 19; }

	// :: drawing ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _render( ) {
		const rc = this.getBoundingRect( );
		if( !rc.width || !rc.height ) {
			return;
		}

		if( this._fit ) {
			const points = this._fit;
			this._fit = null;
			this.fitBounds( points );
			return;
		}

		const z = this._zoom;
		const n = 2**z;
		const ws = TILE * n;

		// east and west, the world goes round; north and south, it stops
		this._cx = ( ( this._cx % ws ) + ws ) % ws;
		this._cy = clamp( this._cy, 0, ws );

		const left = this._cx - rc.width/2;
		const top = this._cy - rc.height/2;

		const keep = new Set<string>( );
		const url = this.props.tiles ?? OSM_TILES;

		for( let ty=Math.floor( top/TILE ); ty<=Math.floor( (top+rc.height)/TILE ); ty++ ) {
			if( ty<0 || ty>=n ) {
				continue;
			}

			for( let tx=Math.floor( left/TILE ); tx<=Math.floor( (left+rc.width)/TILE ); tx++ ) {
				// tx out of the world: the same tile again, at its place
				const key = `${z}/${tx}/${ty}`;
				keep.add( key );

				let tile = this._shown.get( key );
				if( !tile ) {
					const wx = ( ( tx % n ) + n ) % n;
					tile = new Component( { tag: "img", cls: "tile", attrs: {
						src: url.replace( "{z}", z+"" ).replace( "{x}", wx+"" ).replace( "{y}", ty+"" ),
						alt: "",
						draggable: "false",
					} } );

					tile.addDOMEvent( "load", ( ) => tile.addClass( "loaded" ) );
					this._tiles.appendContent( tile );
					this._shown.set( key, tile );
				}

				tile.setStyle( { left: Math.round( tx*TILE - left ), top: Math.round( ty*TILE - top ) } );
			}
		}

		// the tiles not seen anymore (an other zoom too)
		for( const [key,tile] of this._shown ) {
			if( !keep.has( key ) ) {
				this._tiles.removeChild( tile );
				this._shown.delete( key );
			}
		}

		this._drawShapes( left, top, ws );

		// the markers: the copy of the world nearest to the center
		for( const pin of this._pins.enumChildComponents( false ) ) {
			const m = pin.getInternalData<MapMarker>( "marker" );
			const p = project( m, z );
			const x = p.x + Math.round( ( this._cx - p.x ) / ws ) * ws;

			pin.setStyle( { left: Math.round( x - left ), top: Math.round( p.y - top ) } );
		}
	}

	// the zones, drawn again at each move: pixels of the view
	private _drawShapes( left: number, top: number, ws: number ) {
		const z = this._zoom;
		const bld = new SvgBuilder( );

		// the copy of the world nearest to the center, from the first point
		const view = ( first: LatLng ) => {
			const p = project( first, z );
			const dx = Math.round( ( this._cx - p.x ) / ws ) * ws - left;
			return ( ll: LatLng ) => {
				const q = project( ll, z );
				return { x: q.x + dx, y: q.y - top };
			};
		};

		this._shapes.forEach( ( shape, i ) => {
			let item: ReturnType<SvgBuilder["circle"]> | ReturnType<SvgBuilder["path"]>;

			if( shape.type=="circle" ) {
				const c = view( shape.center )( shape.center );
				// the meters of a pixel there
				const mpp = EQUATOR * Math.cos( shape.center.lat * Math.PI / 180 ) / ( TILE * 2**z );
				item = bld.circle( c.x, c.y, shape.radius / mpp );
			}
			else {
				if( !shape.points?.length ) {
					return;
				}

				const at = view( shape.points[0] );
				const pth = bld.path( );
				shape.points.forEach( ( ll, k ) => {
					const p = at( ll );
					if( k==0 ) pth.moveTo( p.x, p.y );
					else pth.lineTo( p.x, p.y );
				} );

				if( shape.type=="polygon" ) {
					pth.closePath( );
				}

				item = pth;
			}

			item.addClass( `shape ${shape.type} c${ i % NUM_COLORS + 1 }` )
				.setAttr( "data-shape", i+"" );

			if( shape.color ) {
				item.getDom( ).style.setProperty( "--shape-c", shape.color );
			}

			// a style: the css of .shape wins over an attribute
			if( shape.width!==undefined ) {
				item.setStyle( "strokeWidth", shape.width );
			}

			if( shape.title ) {
				item.setAttr( "tooltip", shape.title );
			}
		} );

		this._zones.setSvg( bld );
	}

	private _buildMarkers( ) {
		this._pins.setContent( this._markers.map( m => {
			const pin = new Icon( { cls: "marker", iconId: m.icon ?? icon_pin, tooltip: m.title } );
			pin.setInternalData( "marker", m );
			return pin;
		} ) );
	}

	// :: user ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _fireMove( ) {
		this.fire( "move", { center: this.getCenter( ), zoom: this._zoom } );
	}

	// mx, my: the point that stays in place, in the view; its center by default.
	// pinch: the gesture that ends (the front layer has its transform), the zoom may stay the same
	private _zoomAt( z: number, mx?: number, my?: number, pinch?: { dx: number, dy: number } ) {
		z = clamp( z, this._minZoom( ), this._maxZoom( ) );
		if( z==this._zoom && !pinch ) {
			return false;
		}

		const rc = this.getBoundingRect( );
		mx ??= rc.width/2;
		my ??= rc.height/2;

		const f = 2**( z - this._zoom );

		// the tiles before go to the back, and grow (or shrink) to their place at the new zoom
		const back = this._swapLayers( );
		if( pinch ) {
			back.setStyle( { transform: `translate(${pinch.dx}px,${pinch.dy}px) scale(${f})` } );
		}
		else {
			back.setStyle( { transformOrigin: `${mx}px ${my}px`, transform: `scale(${f})` } );
		}

		this.setTimeout( "zoomanim", 300, ( ) => this._endZoomAnim( ) );

		const px = this._cx - rc.width/2 + mx;
		const py = this._cy - rc.height/2 + my;

		this._cx = px*f - mx + rc.width/2;
		this._cy = py*f - my + rc.height/2;
		this._zoom = z;

		this._render( );
		return true;
	}

	// the front layer goes to the back (its tiles, its transform), the back one is emptied for the front
	private _swapLayers( ) {
		this._endZoomAnim( );

		const back = this._tiles;
		const front = this._layers.find( l => l!==back );

		back.removeClass( "front" );
		back.addClass( "back" );
		front.addClass( "front" );

		this._tiles = front;
		this._shown = new Map( );
		return back;
	}

	private _endZoomAnim( ) {
		this.clearTimeout( "zoomanim" );

		for( const layer of this._layers ) {
			if( layer!==this._tiles ) {
				layer.clearContent( );
				layer.removeClass( "back" );
				layer.setStyle( { transform: "", transformOrigin: "" } );
			}
		}
	}

	private _zoomBy( dz: number ) {
		if( this._zoomAt( this._zoom + dz ) ) {
			this._fireMove( );
		}
	}

	// the buttons and the credit are not the map
	private _onMap( ev: Event ) {
		return !Component.closest( ev.target as Element, ".zoom, .credit" );
	}

	private _on_pointerdown( ev: PointerEvent ) {
		if( ev.button!=0 || !this._onMap( ev ) ) {
			return;
		}

		ev.preventDefault( );
		this.focus( );
		this.setCapture( ev.pointerId );

		this._pointers.set( ev.pointerId, { x: ev.clientX, y: ev.clientY } );

		if( this._pointers.size==1 ) {
			this._endZoomAnim( );
			this._drag = { x: ev.clientX, y: ev.clientY, moved: 0 };
			this.addClass( "dragging" );
		}
		else if( this._pointers.size==2 ) {
			this._startPinch( );
		}
	}

	private _on_pointermove( ev: PointerEvent ) {
		if( !this._pointers.has( ev.pointerId ) ) {
			return;
		}

		this._pointers.set( ev.pointerId, { x: ev.clientX, y: ev.clientY } );

		if( this._pinch ) {
			this._movePinch( );
			return;
		}

		if( !this._drag ) {
			return;
		}

		const dx = ev.clientX - this._drag.x;
		const dy = ev.clientY - this._drag.y;

		this._drag.x = ev.clientX;
		this._drag.y = ev.clientY;
		this._drag.moved += Math.abs( dx ) + Math.abs( dy );

		this._cx -= dx;
		this._cy -= dy;
		this._render( );
	}

	// it did not move: a click, on a marker or on the map
	private _on_pointerup( ev: PointerEvent ) {
		if( !this._pointers.delete( ev.pointerId ) ) {
			return;
		}

		this.releaseCapture( ev.pointerId );

		if( this._pinch ) {
			// the finger left on the screen does not move the map
			if( this._pointers.size<2 ) {
				this._endPinch( );
			}
			return;
		}

		if( !this._drag ) {
			return;
		}

		const moved = this._drag.moved;
		this._drag = null;
		this.removeClass( "dragging" );

		if( moved>=4 ) {
			this._fireMove( );
			return;
		}

		if( ev.type!="pointerup" ) {
			return;
		}

		// a marker is over a zone
		const pin = Component.closest( ev.target as Element, ".marker" );
		const zone = ( ev.target as Element ).closest( "[data-shape]" );

		if( pin ) {
			this.fire( "markerClick", { marker: pin.getInternalData<MapMarker>( "marker" ) } );
		}
		else if( zone ) {
			this.fire( "shapeClick", { shape: this._shapes[ parseInt( zone.getAttribute( "data-shape" ) ) ] } );
		}
		else {
			const rc = this.getBoundingRect( );
			this.fire( "click", { latlng: this._latlngAt( ev.clientX-rc.left, ev.clientY-rc.top ) } );
		}
	}

	// :: pinch: two fingers; the front layer follows them, the zoom is set when they leave

	private _twoPointers( ) {
		const rc = this.getBoundingRect( );
		const [a,b] = [ ...this._pointers.values( ) ];

		return {
			d: Math.hypot( b.x-a.x, b.y-a.y ) || 1,
			m: { x: (a.x+b.x)/2 - rc.left, y: (a.y+b.y)/2 - rc.top },
		};
	}

	private _startPinch( ) {
		const { d, m } = this._twoPointers( );

		this._drag = null;
		this._endZoomAnim( );
		this.removeClass( "dragging" );
		this.addClass( "pinching" );

		this._pinch = { d0: d, m0: m, r: 1, dx: 0, dy: 0 };
		this._tiles.setStyle( { transformOrigin: `${m.x}px ${m.y}px` } );
	}

	private _movePinch( ) {
		const { d, m } = this._twoPointers( );
		const p = this._pinch;

		// not beyond the zooms the map has
		p.r = clamp( d / p.d0, 2**( this._minZoom( ) - this._zoom ), 2**( this._maxZoom( ) - this._zoom ) );
		p.dx = m.x - p.m0.x;
		p.dy = m.y - p.m0.y;

		this._tiles.setStyle( { transform: `translate(${p.dx}px,${p.dy}px) scale(${p.r})` } );
	}

	// the nearest zoom: the layer goes from the scale of the fingers to the one of that zoom
	private _endPinch( ) {
		const p = this._pinch;
		this._pinch = null;
		this.removeClass( "pinching" );

		this._cx -= p.dx;
		this._cy -= p.dy;
		this._zoomAt( this._zoom + Math.round( Math.log2( p.r ) ), p.m0.x+p.dx, p.m0.y+p.dy, p );
		this._fireMove( );
	}

	// a mouse gives 100 a notch, a touchpad less but often: a zoom each 100
	private _on_wheel( ev: WheelEvent ) {
		if( !this._onMap( ev ) ) {
			return;
		}

		ev.preventDefault( );

		this._wheel += ev.deltaY;
		if( Math.abs( this._wheel )<100 ) {
			return;
		}

		const rc = this.getBoundingRect( );
		const dz = this._wheel<0 ? 1 : -1;
		this._wheel = 0;

		if( this._zoomAt( this._zoom+dz, ev.clientX-rc.left, ev.clientY-rc.top ) ) {
			this._fireMove( );
		}
	}

	private _on_dblclick( ev: MouseEvent ) {
		if( !this._onMap( ev ) ) {
			return;
		}

		const rc = this.getBoundingRect( );
		if( this._zoomAt( this._zoom+1, ev.clientX-rc.left, ev.clientY-rc.top ) ) {
			this._fireMove( );
		}
	}

	private _on_key( ev: KeyboardEvent ) {
		const STEP = 64;

		switch( ev.key ) {
			case "ArrowLeft": this._cx -= STEP; break;
			case "ArrowRight": this._cx += STEP; break;
			case "ArrowUp": this._cy -= STEP; break;
			case "ArrowDown": this._cy += STEP; break;
			case "+": this._zoomBy( 1 ); ev.preventDefault( ); return;
			case "-": this._zoomBy( -1 ); ev.preventDefault( ); return;
			default: return;
		}

		ev.preventDefault( );
		this._render( );
		this._fireMove( );
	}

	private _latlngAt( mx: number, my: number ) {
		const rc = this.getBoundingRect( );
		const ll = unproject( this._cx - rc.width/2 + mx, this._cy - rc.height/2 + my, this._zoom );

		// the copies of the world: back to -180..180
		ll.lng = ( ( ll.lng + 540 ) % 360 ) - 180;
		return ll;
	}

	// :: api :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	getCenter( ): LatLng {
		const ll = unproject( this._cx, this._cy, this._zoom );
		ll.lng = ( ( ll.lng + 540 ) % 360 ) - 180;
		return ll;
	}

	setCenter( center: LatLng, zoom?: number ) {
		if( zoom!==undefined ) {
			this._zoom = clamp( Math.round( zoom ), this._minZoom( ), this._maxZoom( ) );
		}

		this._endZoomAnim( );

		const p = project( center, this._zoom );
		this._cx = p.x;
		this._cy = p.y;
		this._render( );
	}

	getZoom( ) {
		return this._zoom;
	}

	setZoom( zoom: number ) {
		this._zoomAt( Math.round( zoom ) );
	}

	/**
	 * the highest zoom where all the points are seen, with a margin
	 */

	fitBounds( points: LatLng[], margin = 32 ) {
		if( !points?.length ) {
			return;
		}

		const rc = this.getBoundingRect( );
		if( !rc.width || !rc.height ) {
			this._fit = points;		// when it has a size
			return;
		}

		let z = this._maxZoom( );
		for( ; z>this._minZoom( ); z-- ) {
			const pts = points.map( p => project( p, z ) );
			const w = Math.max( ...pts.map( p => p.x ) ) - Math.min( ...pts.map( p => p.x ) );
			const h = Math.max( ...pts.map( p => p.y ) ) - Math.min( ...pts.map( p => p.y ) );

			if( w<=rc.width-margin*2 && h<=rc.height-margin*2 ) {
				break;
			}
		}

		this._endZoomAnim( );

		const pts = points.map( p => project( p, z ) );
		this._zoom = z;
		this._cx = ( Math.max( ...pts.map( p => p.x ) ) + Math.min( ...pts.map( p => p.x ) ) ) / 2;
		this._cy = ( Math.max( ...pts.map( p => p.y ) ) + Math.min( ...pts.map( p => p.y ) ) ) / 2;
		this._render( );
	}

	setMarkers( markers: MapMarker[] ) {
		this._markers = markers ?? [];
		this._buildMarkers( );
		this._render( );
	}

	addMarker( marker: MapMarker ) {
		this.setMarkers( [ ...this._markers, marker ] );
	}

	removeMarker( marker: MapMarker ) {
		this.setMarkers( this._markers.filter( m => m!==marker ) );
	}

	getMarkers( ) {
		return this._markers;
	}

	setShapes( shapes: MapShape[] ) {
		this._shapes = shapes ?? [];
		this._render( );
	}

	addShape( shape: MapShape ) {
		this.setShapes( [ ...this._shapes, shape ] );
	}

	removeShape( shape: MapShape ) {
		this.setShapes( this._shapes.filter( s => s!==shape ) );
	}

	getShapes( ) {
		return this._shapes;
	}
}
