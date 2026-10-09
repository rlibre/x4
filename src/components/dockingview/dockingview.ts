/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file dockingview.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools';
import { Component, ComponentEvent, ComponentEvents, ComponentProps } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { CSizer } from '../sizers/sizer';

import { bandOf, dockActivate, dockBand, dockFloat, dockMove, dockRestore, dockShow, dropZone, floatOf, isShown, keepInside, sharesOf, shownPanel, sideRect, stackOf, stacksOf, visiblePanels } from './docklayout';
import { DockFloat, DockKinds, DockLayout, DockNode, DockRect, DockStack } from './docklayout';

import "./dockingview.module.scss";

// the layout is given and read by the host: its types go with the component
export type { DockLayout, DockBand, DockNode, DockSplit, DockStack, DockFloat } from './docklayout';

/** under this distance, in pixels, a press on a title is a click, not a drag */
const DRAG_SLOP = 4;

/** depth of the zone along a side of a panel where a drop docks beside it, in pixels */
const SIDE_BAND = 48;

/** smallest size a sizer gives to a docked panel, in pixels (the stylesheet has the same) */
const MIN_SIZE = 48;

/** what a sizer always leaves to the contents, between the two bands */
const MIN_AREA = 80;

/** width of a band whose layout gives none */
const BAND_SIZE = 200;

/** smallest size of a panel that starts to float */
const FLOAT_MIN_W = 160;
const FLOAT_MIN_H = 120;

/** what always stays inside the box of a floating panel, in pixels: its title can be caught */
const FLOAT_KEEP = 40;

/** where a title is held when its panel leaves a dock to float, from its top-left corner */
const FLOAT_GRAB = { x: 30, y: 12 };

export interface DockPanel {
	id: string;

	/** shown in its tab; the id when missing */
	title?: string;

	content: Component;

	/** "tool" when missing */
	kind?: "tool" | "content";

	/** a tool: instead of what the box says. A content can be closed only if it says so. */
	closable?: boolean;

	/** a tool: instead of what the box says. A content never floats. */
	floating?: boolean;
}

export interface DockingViewProps extends ComponentProps {
	panels: DockPanel[];

	/** the layout to start with, and to come back to (resetLayout) */
	layout: DockLayout;

	/** tools can float above the rest */
	floating?: boolean;

	/** tools have a button that hides them (see showPanel) */
	closable?: boolean;

	/**
	 * A name: the layout is then remembered under it, in the storage of
	 * the application, and found again the next time.
	 */
	persist?: string;

	layoutChange?: EventCallback<ComponentEvent>;
}

interface DockingViewEvents extends ComponentEvents {
	/** the user, or the host, changed the layout (see getState) */
	layoutChange: ComponentEvent;
}

/** what happens if the panel that is dragged is dropped now */
interface Drop {
	rect: DockRect;						// where it will be, in the box
	apply: ( ) => DockLayout;
}

interface Drag {
	panel: string;
	from: { x: number, y: number };		// the pointer when the title was pressed
	grab: { x: number, y: number };		// from the corner of the panel to the pointer, when it floats
	moving: boolean;					// the pointer went far enough: it is not a click anymore
	drop: Drop;
}

/**
 * A view whose panels the user arranges by dragging their title.
 *
 * The host gives the panels and a layout to start with (docklayout.ts):
 *
 * @example
 * new DockingView( {
 *   floating: true,
 *   closable: true,
 *   persist: "myapp.layout",
 *   panels: [
 *     { id: "tools", title: "Tools", content: tools },
 *     { id: "page", kind: "content", content: editor },
 *   ],
 *   layout: {
 *     left: { size: 180, root: { type: "stack", size: 0, panels: ["tools"], active: "tools" } },
 *     right: { size: 0, root: null },
 *     content: { type: "stack", size: 0, panels: ["page"], active: "page" },
 *     floats: [],
 *     hidden: [],
 *   },
 * } );
 *
 * There are two kinds of panels, which never mix.
 *
 * A tool is docked in a band, on the left or on the right. Its title
 * dragged to a side of another tool is put beside it, above or under it;
 * to its middle, it becomes one of its tabs; to the left or to the right
 * of the contents, it joins the band of that side. With `floating`, a tool
 * dropped anywhere else floats above the rest. With `closable`, its title
 * has a button that hides it; showPanel() brings it back.
 *
 * A content is what is worked on (a document, as the editors of an IDE).
 * Contents share the room between the bands: a title dragged to a side of
 * another content is put beside it, to its middle it becomes one of its
 * tabs. A content alone has no title.
 *
 * The view only works on the layout, which does all the reasoning. It makes
 * its boxes again each time the layout changes, around what the panels
 * show, which is never built twice.
 *
 * @cssvar
 * ```
 * --dock-line
 * --dock-accent
 * --dock-title-background
 * --dock-title-background-hover
 * --dock-title-color
 * --dock-title-color-active
 * --dock-float-background
 * --dock-float-shadow
 * ```
 */

@class_ns( "x4" )
export class DockingView extends Component<DockingViewProps, DockingViewEvents> {

	private layout: DockLayout;
	private saved: { layout: DockLayout } = null;		// the state that remembers it

	// what each panel shows, in a box of its own that is moved from place to place
	private pages = new Map<string, Component>( );

	// the boxes of the layout as it is shown now
	private nodes = new Map<DockNode, Component>( );
	private bands = new Map<"left" | "right", Component>( );
	private floats = new Map<string, Component>( );
	private area: Component;					// the room of the contents, between the bands

	private frame: Component;					// holds the boxes of the layout
	private fills: ( ( ) => void )[] = [];		// puts the pages in the boxes that were just made
	private park: Component;					// where the pages of the hidden panels wait
	private preview: Component;					// shows where the panel that is dragged will go
	private grip: Component;					// holds the pointer during a drag

	private drag: Drag = null;

	constructor( props: DockingViewProps ) {
		super( props );

		this.mapPropEvents( props, "layoutChange" );

		for( const panel of props.panels ) {
			this.pages.set( panel.id, new Component( { cls: "dock-page", content: panel.content } ) );
		}

		this.frame = new Component( { cls: "dock-frame" } );
		this.park = new Component( { cls: "dock-park", hidden: true, content: [...this.pages.values( )] } );
		this.preview = new Component( { cls: "dock-preview", hidden: true } );

		// The pointer of a drag is not captured by the box itself: a handler
		// here would be called for every pointer event of what the panels show.
		this.grip = new Component( {
			cls: "dock-grip",
			dom_events: {
				pointermove: ev => this.onDragMove( ev ),
				pointerup: ev => this.onDragEnd( ev, true ),
				pointercancel: ev => this.onDragEnd( ev, false ),
			},
		} );

		if( props.persist ) {
			this.saved = this.loadPState( props.persist, { layout: null } );
		}

		this.layout = dockRestore( this.saved?.layout ?? null, this.kinds( ), props.layout );

		// the box got its size, or another one: the floating panels must stay in it
		this.addDOMEvent( "resized", ( ) => this.placeFloats( ) );

		this.setContent( [this.frame, this.preview, this.grip, this.park] );
		this.rebuild( );
	}

	// :: LAYOUT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * the layout as it is now: plain data, to be saved and given back to setState
	 */

	getState( ): DockLayout {
		this.measure( );
		return structuredClone( this.layout );
	}

	/**
	 * A layout that was saved. What it does not say (a panel added since)
	 * comes from the layout of the props, and so does everything when it
	 * cannot be used.
	 */

	setState( layout: unknown ): void {
		this.apply( dockRestore( layout, this.kinds( ), this.props.layout ) );
	}

	/**
	 * back to the layout of the props
	 */

	resetLayout( ): void {
		this.setState( null );
	}

	/**
	 * Hide a panel, or show it again where it was.
	 */

	showPanel( id: string, show = true ): void {
		if( show !== this.isPanelVisible( id ) ) {
			this.apply( dockShow( this.layout, id, show ) );
		}
	}

	isPanelVisible( id: string ): boolean {
		return this.pages.has( id ) && !this.layout.hidden.includes( id );
	}

	private panel( id: string ): DockPanel {
		return this.props.panels.find( panel => panel.id === id );
	}

	private isTool( id: string ): boolean {
		return this.panel( id ).kind !== "content";
	}

	private kinds( ): DockKinds {
		const ids = this.props.panels.map( panel => panel.id );
		return { tools: ids.filter( id => this.isTool( id ) ), contents: ids.filter( id => !this.isTool( id ) ) };
	}

	private mayFloat( id: string ): boolean {
		return this.isTool( id ) && ( this.panel( id ).floating ?? this.props.floating ?? false );
	}

	private mayClose( id: string ): boolean {
		return this.panel( id ).closable ?? ( this.isTool( id ) && !!this.props.closable );
	}

	private apply( layout: DockLayout ): void {
		if( layout === this.layout ) {
			return;
		}

		this.layout = layout;
		this.rebuild( );
		this.changed( );
	}

	/**
	 * the layout changed, by its shape or by a size
	 */

	private changed( ): void {
		this.measure( );

		// a copy: the state must not see what is done to the layout later
		if( this.saved ) {
			this.saved.layout = structuredClone( this.layout );
		}

		this.fire( "layoutChange", {} );
	}

	// :: BUILDING ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * Make the boxes of the layout again: the band of the left, the room
	 * of the contents, the band of the right, and the floating tools.
	 *
	 * What the panels show is not built again: their pages are moved. They
	 * go straight from a place in the document to another one, the park
	 * first, then the new boxes once these are in the document: x4 then
	 * sees a move, not something that leaves (it would clean it up) nor
	 * something new. Those of the hidden panels stay in the park.
	 */

	private rebuild( ): void {
		const { content, floats, hidden } = this.layout;

		// a move takes the keyboard from what has it: given back below
		const focused = document.activeElement;

		this.park.appendContent( [...this.pages.values( )] );
		this.nodes.clear( );
		this.bands.clear( );
		this.floats.clear( );
		this.fills = [];

		// a content alone has no title: there is nowhere to drag it to
		const titled = this.kinds( ).contents.filter( id => !hidden.includes( id ) ).length > 1;

		this.area = new Component( {
			cls: "dock-area",
			content: content && isShown( content, hidden ) ? this.makeNode( content, titled ) : null,
		} );

		this.frame.setContent( [
			...this.makeBand( "left" ),
			this.area,
			...this.makeBand( "right" ),
			...floats.filter( float => !hidden.includes( float.panel ) ).map( float => this.makeFloat( float ) ),
		] );

		this.fills.forEach( fill => fill( ) );
		this.placeFloats( );

		if( focused instanceof HTMLElement && this.dom.contains( focused ) ) {
			focused.focus( );
		}
	}

	/**
	 * A band and the sizer that changes its width, in the order they are
	 * shown; nothing when none of its tools is shown.
	 */

	private makeBand( side: "left" | "right" ): Component[] {
		const band = this.layout[side];

		if( !band.root || !isShown( band.root, this.layout.hidden ) ) {
			return [];
		}

		const box = new Component( {
			cls: `dock-band ${side}`,
			width: band.size || BAND_SIZE,
			content: this.makeNode( band.root, true ),
		} );

		this.bands.set( side, box );

		// what the band gets is taken from the contents
		const sign = side === "left" ? 1 : -1;
		let size = 0;
		let max = 0;

		const sizer = this.makeSizer( true, ( ) => {
			size = band.size;
			max = size + Math.max( 0, this.area.getBoundingRect( ).width - MIN_AREA );
		}, delta => {
			band.size = Math.round( Math.max( MIN_SIZE, Math.min( size + delta * sign, max ) ) );
			box.setWidth( band.size );
		} );

		return side === "left" ? [box, sizer] : [sizer, box];
	}

	private makeNode( node: DockNode, titled: boolean ): Component {
		const box = node.type === "stack"
			? this.makeStack( node, titled )
			: new Component( { cls: `dock-split ${node.dir}`, content: this.makeShares( node.children, node.dir === "row", titled ) } );

		this.nodes.set( node, box );
		return box;
	}

	/**
	 * The children of a split: those that are shown, each with its share
	 * of the room, and a sizer between two of them.
	 */

	private makeShares( nodes: DockNode[], horizontal: boolean, titled: boolean ): Component[] {
		const shown = nodes.filter( node => isShown( node, this.layout.hidden ) );
		const shares = sharesOf( shown );
		const content: Component[] = [];

		shown.forEach( ( node, i ) => {
			if( i > 0 ) {
				content.push( this.makeShareSizer( shown[i - 1], node, horizontal ) );
			}

			const box = this.makeNode( node, titled );
			this.setShare( box, shares[i] );
			content.push( box );
		} );

		return content;
	}

	/**
	 * the share of a box among its neighbours: the room is divided in proportion
	 */

	private setShare( box: Component, share: number ): void {
		box.setStyleValue( "flex", `${share} 1 0px` );
	}

	private makeStack( stack: DockStack, titled: boolean ): Component {
		const hidden = this.layout.hidden;
		const panels = visiblePanels( stack, hidden );
		const shown = shownPanel( stack, hidden );

		return new Component( {
			cls: "dock-stack",
			content: [
				titled ? this.makeTitles( panels, shown ) : null,
				this.makeBody( panels, shown ),
			],
		} );
	}

	/**
	 * the box where a stack or a floating panel shows its pages; only `shown` is visible
	 */

	private makeBody( panels: string[], shown: string ): Component {
		const body = new Component( { cls: "dock-body" } );

		this.fills.push( ( ) => body.setContent( panels.map( id => this.pages.get( id ).show( id === shown ) ) ) );
		return body;
	}

	/**
	 * The titles of a stack, one tab per panel. The bar itself, beside the
	 * tabs, is a handle too: it takes the panel that is shown.
	 */

	private makeTitles( panels: string[], shown: string ): Component {
		return new Component( {
			cls: "dock-titles",
			content: panels.map( id => this.makeTitle( id, id === shown ) ),
			dom_events: {
				pointerdown: ev => this.onTitleDown( ev, shown ),
			},
		} );
	}

	private makeTitle( id: string, active: boolean ): Component {
		// Its own press must not reach the title, which would start a drag.
		// Preventing the default is what stops x4 from calling the handlers above.
		const close = !this.mayClose( id ) ? null : new Component( {
			cls: "dock-close",
			content: "×",
			dom_events: {
				pointerdown: ev => { ev.stopPropagation( ); ev.preventDefault( ); },
				click: ( ) => this.showPanel( id, false ),
			},
		} );

		return new Component( {
			cls: active ? "dock-title active" : "dock-title",
			content: [
				new Component( { tag: "span", content: this.panel( id ).title ?? id } ),
				close,
			],
			dom_events: {
				pointerdown: ev => this.onTitleDown( ev, id ),
			},
		} );
	}

	/**
	 * A floating tool: a title, what it shows, and a corner to resize it.
	 */

	private makeFloat( float: DockFloat ): Component {
		const id = float.panel;
		const box = new Component( { cls: "dock-float" } );

		const corner = new CSizer( "bottom-right", box );
		corner.on( "stop", ( ) => this.onFloatSized( id ) );

		box.setContent( [
			this.makeTitles( [id], id ),
			this.makeBody( [id], id ),
			corner,
		] );

		this.floats.set( id, box );
		return box;
	}

	/**
	 * Put the floating tools where the layout says, brought back inside
	 * the box when it became too small for them. The layout keeps what the
	 * user chose: they go back there when the box grows again.
	 */

	private placeFloats( ): void {
		const within = this.rectOf( this );

		for( const float of this.layout.floats ) {
			const at = within.w > 0 ? keepInside( float, within, FLOAT_KEEP ) : float;
			this.floats.get( float.panel )?.setStyle( { left: at.x, top: at.y, width: float.w, height: float.h } );
		}
	}

	private onFloatSized( id: string ): void {
		const float = floatOf( this.layout, id );
		const rect = this.rectOf( this.floats.get( id ) );

		float.w = Math.round( rect.w );
		float.h = Math.round( rect.h );

		this.changed( );
	}

	// :: SIZES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * a rectangle on screen, from the top-left corner of the box
	 */

	private rectOf( component: Component ): DockRect {
		const origin = this.getBoundingRect( );
		const rc = component.getBoundingRect( );

		return { x: rc.left - origin.left, y: rc.top - origin.top, w: rc.width, h: rc.height };
	}

	/**
	 * Write in the layout the sizes that are on screen, in pixels: the
	 * shares then say what is seen, whatever the size the window had when
	 * they were given. Nothing is read while the box is not shown.
	 */

	private measure( ): void {
		const visit = ( node: DockNode, horizontal: boolean ) => {
			const box = this.nodes.get( node );

			if( box && horizontal !== null ) {
				const rc = box.getBoundingRect( );
				const size = Math.round( horizontal ? rc.width : rc.height );

				if( size > 0 ) {
					node.size = size;
				}
			}

			if( node.type === "split" ) {
				node.children.forEach( child => visit( child, node.dir === "row" ) );
			}
		};

		if( this.layout.content ) {
			visit( this.layout.content, null );
		}

		for( const side of ["left", "right"] as const ) {
			const band = this.layout[side];
			const width = Math.round( this.bands.get( side )?.getBoundingRect( ).width ?? 0 );

			if( width > 0 ) {
				band.size = width;
			}

			if( band.root ) {
				visit( band.root, null );
			}
		}
	}

	/**
	 * A line between two boxes, that is dragged. `take` is called when it
	 * is pressed, once the layout holds the sizes that are on screen;
	 * `move` gets how far the pointer went since.
	 */

	private makeSizer( horizontal: boolean, take: ( ) => void, move: ( delta: number ) => void ): Component {
		const along = ( ev: PointerEvent ) => horizontal ? ev.clientX : ev.clientY;
		const sizer = new Component( { cls: horizontal ? "dock-sizer row" : "dock-sizer column" } );

		let from: number = null;

		const end = ( ev: PointerEvent ) => {
			if( from !== null ) {
				from = null;
				sizer.releaseCapture( ev.pointerId );
				this.changed( );
			}
		};

		sizer.setDOMEvents( {
			pointerdown: ev => {
				ev.stopPropagation( );
				ev.preventDefault( );

				if( ev.button !== 0 ) {
					return;
				}

				this.measure( );
				take( );

				from = along( ev );
				sizer.setCapture( ev.pointerId );
			},

			pointermove: ev => {
				if( from !== null ) {
					move( along( ev ) - from );
				}
			},

			pointerup: end,
			pointercancel: end,
		} );

		return sizer;
	}

	/**
	 * the sizer between two neighbours: what one gets is taken from the other
	 */

	private makeShareSizer( first: DockNode, second: DockNode, horizontal: boolean ): Component {
		let size = 0;
		let total = 0;

		return this.makeSizer( horizontal, ( ) => {
			size = first.size;
			total = first.size + second.size;
		}, delta => {
			first.size = Math.round( Math.max( MIN_SIZE, Math.min( size + delta, total - MIN_SIZE ) ) );
			second.size = total - first.size;

			this.setShare( this.nodes.get( first ), first.size );
			this.setShare( this.nodes.get( second ), second.size );
		} );
	}

	// :: DRAGGING ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private onTitleDown( ev: PointerEvent, id: string ): void {
		// the bar of the titles is above a title: it must not take the press for itself
		ev.stopPropagation( );
		ev.preventDefault( );

		if( ev.button !== 0 ) {
			return;
		}

		// a floating panel is held where it was caught
		const float = floatOf( this.layout, id );
		const origin = this.getBoundingRect( );
		const grab = float ? { x: ev.clientX - origin.left - float.x, y: ev.clientY - origin.top - float.y } : FLOAT_GRAB;

		this.drag = { panel: id, from: { x: ev.clientX, y: ev.clientY }, grab, moving: false, drop: null };
		this.grip.setCapture( ev.pointerId );
	}

	private onDragMove( ev: PointerEvent ): void {
		const drag = this.drag;
		if( !drag ) {
			return;
		}

		if( !drag.moving ) {
			if( Math.hypot( ev.clientX - drag.from.x, ev.clientY - drag.from.y ) < DRAG_SLOP ) {
				return;
			}

			drag.moving = true;
			this.measure( );
		}

		const origin = this.getBoundingRect( );
		const x = ev.clientX - origin.left;
		const y = ev.clientY - origin.top;

		drag.drop = this.isTool( drag.panel ) ? this.dropTool( x, y ) : this.dropContent( x, y );

		if( drag.drop ) {
			const { x: left, y: top, w: width, h: height } = drag.drop.rect;
			this.preview.setStyle( { left, top, width, height } );
		}

		this.preview.show( !!drag.drop );
	}

	private onDragEnd( ev: PointerEvent, done: boolean ): void {
		const drag = this.drag;
		if( !drag ) {
			return;
		}

		this.drag = null;
		this.grip.releaseCapture( ev.pointerId );
		this.preview.hide( );

		if( !done ) {
			return;
		}

		if( drag.moving ) {
			if( drag.drop ) {
				this.apply( drag.drop.apply( ) );
			}

			return;
		}

		// a click: the tab comes in front of its stack, a floating panel above the others
		const float = floatOf( this.layout, drag.panel );

		if( float ) {
			if( this.layout.floats.indexOf( float ) < this.layout.floats.length - 1 ) {
				this.apply( dockFloat( this.layout, drag.panel, float ) );
			}
		}
		else if( stackOf( this.layout, drag.panel ).active !== drag.panel ) {
			this.apply( dockActivate( this.layout, drag.panel ) );
		}
	}

	/**
	 * What dropping the tool that is dragged at this point of the box
	 * would do, null for nothing.
	 *
	 *   a side of a tool                        beside it, above or under it
	 *   the middle of another tool              one of its tabs
	 *   the left or the right of the contents   the band of that side, under its tools
	 *   anywhere else                           it floats, if it may
	 */

	private dropTool( x: number, y: number ): Drop {
		const { panel, grab } = this.drag;
		const layout = this.layout;
		const hidden = layout.hidden;

		const within = this.rectOf( this );
		const own = stackOf( layout, panel );
		const float = floatOf( layout, panel );
		const page = this.rectOf( this.pages.get( panel ) );

		const inside = ( rect: DockRect ) => dropZone( rect, x, y, 1 ) !== null;

		// the width the tool brings to a band: the one it has now, a third of the box at most
		const width = Math.round( Math.max( MIN_SIZE, Math.min( ( float?.w ?? page.w ) || BAND_SIZE, within.w / 3 ) ) );

		const floating = ( ): Drop => {
			if( !this.mayFloat( panel ) ) {
				return null;
			}

			// the size it already floats with, or the one it has in its band
			const w = float?.w ?? Math.max( FLOAT_MIN_W, Math.min( page.w, within.w / 2 ) );
			const h = float?.h ?? Math.max( FLOAT_MIN_H, Math.min( page.h, within.h / 2 ) );
			const rect = keepInside( { x: x - grab.x, y: y - grab.y, w, h }, within, FLOAT_KEEP );

			return { rect, apply: ( ) => dockFloat( layout, panel, rect ) };
		};

		// outside the box, or above another floating tool, which takes no tab
		const above = layout.floats.some( other => other.panel !== panel && !hidden.includes( other.panel ) && inside( this.rectOf( this.floats.get( other.panel ) ) ) );

		if( above || !inside( within ) ) {
			return floating( );
		}

		// a tool of a band
		for( const stack of [...stacksOf( layout.left.root ), ...stacksOf( layout.right.root )] ) {
			const box = this.nodes.get( stack );
			const rect = box ? this.rectOf( box ) : null;
			const zone = rect ? dropZone( rect, x, y, SIDE_BAND ) : null;

			if( !zone ) {
				continue;
			}

			const panels = visiblePanels( stack, hidden );

			if( zone === "center" ) {
				// the middle of its own stack: it leaves it
				return stack === own ? floating( ) : { rect, apply: ( ) => dockMove( layout, panel, panels[0], "tab" ) };
			}

			// beside the stack it is alone in: it is already there
			if( stack === own && panels.length === 1 ) {
				return null;
			}

			// Half of the stack is shown. On the left or on the right, the
			// band gets wider instead: the two tools keep their width.
			const half = ( zone === "left" || zone === "right" ? rect.w : rect.h ) / 2;
			return { rect: sideRect( rect, zone, half ), apply: ( ) => dockMove( layout, panel, panels[0], zone, width ) };
		}

		// the left or the right of the contents: the band of that side
		const area = this.rectOf( this.area );
		const side = x < area.x + SIDE_BAND ? "left" : x >= area.x + area.w - SIDE_BAND ? "right" : null;

		if( !side ) {
			return floating( );
		}

		const band = this.bands.get( side );
		const root = layout[side].root;
		const shown = stacksOf( root ).filter( stack => isShown( stack, hidden ) );

		// the only tool of that band: it is already there
		if( bandOf( layout, panel ) === side && shown.length === 1 && visiblePanels( own, hidden ).length === 1 ) {
			return null;
		}

		// A band that shows nothing is made beside the contents, as wide as
		// the tool is now. Otherwise the tool goes under what the band
		// holds: one more row of it, or its lower half.
		const rows = root?.type === "split" && root.dir === "column" ? root.children.filter( child => isShown( child, hidden ) ).length : 1;
		const bandRect = band ? this.rectOf( band ) : null;
		const rect = bandRect ? sideRect( bandRect, "bottom", bandRect.h / ( rows + 1 ) ) : sideRect( area, side, width );

		return { rect, apply: ( ) => dockBand( layout, panel, side, band ? 0 : width ) };
	}

	/**
	 * The same for a content: it only goes with the other contents.
	 *
	 *   a side of another content       beside it
	 *   the middle of another content   one of its tabs
	 */

	private dropContent( x: number, y: number ): Drop {
		const panel = this.drag.panel;
		const layout = this.layout;
		const own = stackOf( layout, panel );

		for( const [node, box] of this.nodes ) {
			if( node.type !== "stack" || this.isTool( node.panels[0] ) ) {
				continue;
			}

			const rect = this.rectOf( box );
			const zone = dropZone( rect, x, y, SIDE_BAND );
			if( !zone ) {
				continue;
			}

			const panels = visiblePanels( node, layout.hidden );

			if( zone === "center" ) {
				return node === own ? null : { rect, apply: ( ) => dockMove( layout, panel, panels[0], "tab" ) };
			}

			// beside the stack it is alone in: it is already there
			if( node === own && panels.length === 1 ) {
				return null;
			}

			// half of the stack
			const half = ( zone === "left" || zone === "right" ? rect.w : rect.h ) / 2;
			return { rect: sideRect( rect, zone, half ), apply: ( ) => dockMove( layout, panel, panels[0], zone ) };
		}

		return null;
	}
}
