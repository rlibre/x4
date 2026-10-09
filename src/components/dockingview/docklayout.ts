/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file docklayout.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

/**
 * How the panels of a DockingView are laid out: docked, floating or hidden.
 *
 * There are two kinds of panels, which never mix:
 *
 *   tools      docked in a band on the left or on the right: one above the
 *              other, side by side, or as tabs of the same stack; they
 *              can also float.
 *   contents   what is worked on (a document, as the editors of an IDE).
 *              They share the room between the bands: side by side, one
 *              above the other, or as tabs of the same stack.
 *
 * A layout is plain data, so that it can be saved as it is:
 *
 *   left, right   the two bands: a width, and a tree of tools.
 *   content       the tree of the contents.
 *
 *                 In a tree, a split puts its children side by side (row)
 *                 or one above the other (column); a stack holds panels,
 *                 one tab each.
 *
 *   floats        the tools that float above the rest, with their rectangle.
 *   hidden        the panels that are closed. They keep their place, and
 *                 come back there when shown again.
 *
 * Panels are known by their id only: what they show is the business of the
 * view (dockingview.ts), which also says what may go where. Nothing here
 * changes the layout it is given: every function returns a new one.
 *
 * (this file imports nothing, and knows nothing of the DOM)
 */

export type DockSide = "left" | "right" | "top" | "bottom";

/** where a panel goes, relative to another one: beside it, or with it as a tab */
export type DockWhere = DockSide | "tab";

/**
 * `size` is the share a child has of its split: the room is divided in
 * proportion. The sizes on screen, in pixels, are written there (see the
 * view); 0 is a share that is not known yet.
 */

export interface DockSplit {
	type: "split";
	dir: "row" | "column";
	size: number;
	children: DockNode[];
}

export interface DockStack {
	type: "stack";
	size: number;
	panels: string[];
	active: string;
}

export type DockNode = DockSplit | DockStack;

/** the tools docked on one side: `size` is its width in pixels, `root` is null when it has none */
export interface DockBand {
	size: number;
	root: DockNode;
}

export interface DockRect {
	x: number;
	y: number;
	w: number;
	h: number;
}

/** a floating panel; its rectangle is relative to the box that holds the layout */
export interface DockFloat extends DockRect {
	panel: string;
}

export interface DockLayout {
	left: DockBand;
	right: DockBand;
	content: DockNode;
	floats: DockFloat[];
	hidden: string[];
}

/** the panels that exist, by kind */
export interface DockKinds {
	tools: string[];
	contents: string[];
}

function copy( layout: DockLayout ): DockLayout {
	return structuredClone( layout );
}

/**
 * the stacks of a tree, from left to right and from top to bottom
 */

export function stacksOf( node: DockNode ): DockStack[] {
	if( !node ) {
		return [];
	}

	return node.type === "stack" ? [node] : node.children.flatMap( child => stacksOf( child ) );
}

function allStacks( layout: DockLayout ): DockStack[] {
	return [...stacksOf( layout.left.root ), ...stacksOf( layout.right.root ), ...stacksOf( layout.content )];
}

function parentOf( root: DockNode, node: DockNode ): DockSplit {
	if( !root || root.type === "stack" ) {
		return null;
	}

	return root.children.includes( node ) ? root : root.children.map( child => parentOf( child, node ) ).find( p => !!p ) ?? null;
}

/**
 * Tidy a tree: no stack without panel, no split with a single child, no
 * split straight inside a split of the same direction.
 */

function normalize( node: DockNode ): DockNode {
	if( !node ) {
		return null;
	}

	if( node.type === "stack" ) {
		if( node.panels.length === 0 ) {
			return null;
		}

		if( !node.panels.includes( node.active ) ) {
			node.active = node.panels[0];
		}

		return node;
	}

	node.children = node.children.flatMap( child => {
		const tidy = normalize( child );
		if( !tidy ) {
			return [];
		}

		return tidy.type === "split" && tidy.dir === node.dir ? tidy.children : [tidy];
	} );

	if( node.children.length === 0 ) {
		return null;
	}

	// the only child takes the place of the split
	if( node.children.length === 1 ) {
		node.children[0].size = node.size;
		return node.children[0];
	}

	return node;
}

function tidy( layout: DockLayout ): void {
	layout.content = normalize( layout.content );
	layout.left.root = normalize( layout.left.root );
	layout.right.root = normalize( layout.right.root );
}

/**
 * take a panel out of where it is; the layout is not tidied
 */

function detach( layout: DockLayout, panel: string ): void {
	// A tool that was beside others, alone in its stack, takes its width
	// with it: its band gets narrower by its share of the row.
	for( const band of [layout.left, layout.right] ) {
		const root = band.root;
		const at = root?.type === "split" && root.dir === "row" ? root.children.findIndex( child => child.type === "stack" && child.panels.length === 1 && child.panels[0] === panel ) : -1;

		if( root?.type === "split" && at >= 0 ) {
			const shares = sharesOf( root.children );
			band.size = Math.round( band.size * ( 1 - shares[at] / shares.reduce( ( a, b ) => a + b ) ) );
		}
	}

	for( const stack of allStacks( layout ) ) {
		stack.panels = stack.panels.filter( id => id !== panel );
	}

	layout.floats = layout.floats.filter( float => float.panel !== panel );
}

/**
 * every panel of a layout: docked, floating, hidden or not
 */

export function dockPanels( layout: DockLayout ): string[] {
	return [...allStacks( layout ).flatMap( stack => stack.panels ), ...layout.floats.map( float => float.panel )];
}

/**
 * the stack a panel is docked in, null when it floats or is unknown
 */

export function stackOf( layout: DockLayout, panel: string ): DockStack {
	return allStacks( layout ).find( stack => stack.panels.includes( panel ) ) ?? null;
}

/**
 * the band a panel is docked in, null when it is a content, floats or is unknown
 */

export function bandOf( layout: DockLayout, panel: string ): "left" | "right" {
	const holds = ( band: DockBand ) => stacksOf( band.root ).some( stack => stack.panels.includes( panel ) );

	if( holds( layout.left ) ) {
		return "left";
	}

	return holds( layout.right ) ? "right" : null;
}

export function floatOf( layout: DockLayout, panel: string ): DockFloat {
	return layout.floats.find( float => float.panel === panel ) ?? null;
}

/**
 * the panels of a stack that are not hidden
 */

export function visiblePanels( stack: DockStack, hidden: string[] ): string[] {
	return stack.panels.filter( id => !hidden.includes( id ) );
}

/**
 * the panel a stack shows: its active one, or the first that is not hidden
 */

export function shownPanel( stack: DockStack, hidden: string[] ): string {
	const visible = visiblePanels( stack, hidden );
	return visible.includes( stack.active ) ? stack.active : visible[0] ?? null;
}

/**
 * false for a stack whose panels are all hidden, and for a split of such stacks
 */

export function isShown( node: DockNode, hidden: string[] ): boolean {
	return stacksOf( node ).some( stack => visiblePanels( stack, hidden ).length > 0 );
}

/**
 * The share of each node among those that are shown together, as numbers
 * that only mean something compared to each other. A node whose size is
 * not known gets the average of the others.
 */

export function sharesOf( nodes: DockNode[] ): number[] {
	const known = nodes.map( node => node.size ).filter( size => size > 0 );
	const average = known.length ? known.reduce( ( a, b ) => a + b ) / known.length : 1;

	return nodes.map( node => node.size > 0 ? node.size : average );
}

/**
 * Dock a panel beside another one, or with it as a tab.
 *
 * `target` is a panel of the stack that receives it. Beside it, the panel
 * takes half of its room. But a tool put on the left or on the right of
 * another one does not make it narrower: with `width`, the band gets
 * wider by that much, which is what the tool gets.
 */

export function dockMove( layout: DockLayout, panel: string, target: string, where: DockWhere, width = 0 ): DockLayout {
	const result = copy( layout );
	const dest = stackOf( result, target );

	if( !dest ) {
		return layout;
	}

	if( where === "tab" ) {
		if( !dest.panels.includes( panel ) ) {
			detach( result, panel );
			dest.panels.push( panel );
		}

		dest.active = panel;
		tidy( result );
		return result;
	}

	// beside the stack it is alone in: nothing to do
	if( dest.panels.length === 1 && dest.panels[0] === panel ) {
		return layout;
	}

	const side = bandOf( result, target );
	const band = side ? result[side] : null;

	detach( result, panel );

	const dir = where === "left" || where === "right" ? "row" : "column";
	const before = where === "left" || where === "top";
	const wider = !!band && dir === "row" && width > 0;

	const half = dest.size / 2;
	const fresh: DockStack = { type: "stack", size: wider ? width : half, panels: [panel], active: panel };
	const parent = parentOf( band ? band.root : result.content, dest );

	// the parent already cuts that way: one more child
	if( parent && parent.dir === dir ) {
		dest.size = wider ? dest.size : half;
		parent.children.splice( parent.children.indexOf( dest ) + ( before ? 0 : 1 ), 0, fresh );
	}
	else {
		// the stack is cut in two: a split takes its place, its two children share it
		const split: DockSplit = { type: "split", dir, size: dest.size, children: before ? [fresh, dest] : [dest, fresh] };

		dest.size = wider ? band.size : 0;
		fresh.size = wider ? width : 0;

		if( parent ) {
			parent.children[parent.children.indexOf( dest )] = split;
		}
		else if( band ) {
			band.root = split;
		}
		else {
			result.content = split;
		}
	}

	if( wider ) {
		band.size += width;
	}

	tidy( result );
	return result;
}

/**
 * Dock a tool in a band, under the tools that are already there.
 * `size` is the width the band gets when it was empty.
 */

export function dockBand( layout: DockLayout, panel: string, side: "left" | "right", size = 0 ): DockLayout {
	const result = copy( layout );
	const band = result[side];

	detach( result, panel );
	tidy( result );

	const fresh: DockStack = { type: "stack", size: 0, panels: [panel], active: panel };
	const root = band.root;

	if( !root ) {
		band.root = fresh;

		if( size > 0 ) {
			band.size = size;
		}
	}
	else if( root.type === "split" && root.dir === "column" ) {
		// as high as the others, on average
		fresh.size = sharesOf( root.children ).reduce( ( a, b ) => a + b ) / root.children.length;
		root.children.push( fresh );
	}
	else {
		// what was there and the tool share the height
		root.size = 0;
		band.root = { type: "split", dir: "column", size: 0, children: [root, fresh] };
	}

	return result;
}

/**
 * A content that is nowhere yet: a tab of the first stack of contents.
 */

function addContent( layout: DockLayout, panel: string ): DockLayout {
	const first = stacksOf( layout.content )[0];
	if( first ) {
		return dockMove( layout, panel, first.panels[0], "tab" );
	}

	const result = copy( layout );
	result.content = { type: "stack", size: 0, panels: [panel], active: panel };
	return result;
}

/**
 * Make a panel float, or move the one that already does. It comes above
 * the other floating panels.
 */

export function dockFloat( layout: DockLayout, panel: string, rect: DockRect ): DockLayout {
	const result = copy( layout );

	detach( result, panel );
	tidy( result );
	result.floats.push( { panel, x: rect.x, y: rect.y, w: rect.w, h: rect.h } );

	return result;
}

/**
 * Hide a panel or show it again, where it was.
 */

export function dockShow( layout: DockLayout, panel: string, show = true ): DockLayout {
	const result = copy( layout );

	result.hidden = result.hidden.filter( id => id !== panel );
	if( !show ) {
		result.hidden.push( panel );
	}

	// a panel that comes back is the one its stack shows
	const stack = stackOf( result, panel );
	if( show && stack ) {
		stack.active = panel;
	}

	return result;
}

/**
 * the tab of a panel comes in front of the others of its stack
 */

export function dockActivate( layout: DockLayout, panel: string ): DockLayout {
	const result = copy( layout );
	const stack = stackOf( result, panel );

	if( stack ) {
		stack.active = panel;
	}

	return result;
}


// :: RESTORE :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function isObject( value: unknown ): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

/** a number of a saved layout: 0 when it is missing or not a size */
function sizeOf( from: Record<string, unknown>, name: string ): number {
	const value = name in from ? from[name] : 0;
	return typeof value === "number" && Number.isFinite( value ) && value > 0 ? value : 0;
}

/**
 * A layout rebuilt from something that was saved, or null when it is not a
 * layout or holds no panel. Only what is understood is kept, and only the
 * panels that are known, each once and where its kind may be: a tool in a
 * band or floating, a content among the contents.
 *
 * (a field is read only once it is known to be there: what was saved may be
 * a state of x4, which reports the reading of a missing property)
 */

function sanitize( saved: unknown, kinds: DockKinds ): DockLayout {
	if( !isObject( saved ) ) {
		return null;
	}

	const seen = new Set<string>( );

	const known = ( among: string[] ) => ( id: unknown ): id is string => {
		if( typeof id !== "string" || !among.includes( id ) || seen.has( id ) ) {
			return false;
		}

		seen.add( id );
		return true;
	};

	const stack = ( from: unknown, among: string[] ): DockStack => {
		if( !isObject( from ) || !( "panels" in from ) || !Array.isArray( from.panels ) ) {
			return null;
		}

		const ids = [...from.panels].filter( known( among ) );
		const active = "active" in from && ids.includes( from.active as string ) ? from.active as string : ids[0];

		return ids.length ? { type: "stack", size: sizeOf( from, "size" ), panels: ids, active } : null;
	};

	const node = ( from: unknown, among: string[] ): DockNode => {
		if( !isObject( from ) || !( "type" in from ) ) {
			return null;
		}

		if( from.type === "stack" ) {
			return stack( from, among );
		}

		if( from.type === "split" && "children" in from && Array.isArray( from.children ) ) {
			const children = [...from.children].map( child => node( child, among ) ).filter( child => !!child );
			const dir = "dir" in from && from.dir === "column" ? "column" : "row";

			return { type: "split", dir, size: sizeOf( from, "size" ), children };
		}

		return null;
	};

	const band = ( name: string ): DockBand => {
		const from = name in saved ? saved[name] : null;
		if( !isObject( from ) ) {
			return { size: 0, root: null };
		}

		return { size: sizeOf( from, "size" ), root: normalize( "root" in from ? node( from.root, kinds.tools ) : null ) };
	};

	const left = band( "left" );
	const right = band( "right" );
	const content = normalize( "content" in saved ? node( saved.content, kinds.contents ) : null );

	const floats: DockFloat[] = [];
	const hidden: string[] = [];
	const floating = known( kinds.tools );

	if( "floats" in saved && Array.isArray( saved.floats ) ) {
		for( const float of [...saved.floats] ) {
			if( isObject( float ) && "panel" in float && floating( float.panel ) ) {
				floats.push( { panel: float.panel, x: sizeOf( float, "x" ), y: sizeOf( float, "y" ), w: sizeOf( float, "w" ), h: sizeOf( float, "h" ) } );
			}
		}
	}

	if( "hidden" in saved && Array.isArray( saved.hidden ) ) {
		for( const id of [...saved.hidden] ) {
			if( typeof id === "string" && seen.has( id ) && !hidden.includes( id ) ) {
				hidden.push( id );
			}
		}
	}

	// nothing in it that is known: not worth more than no layout at all
	return seen.size > 0 ? { left, right, content, floats, hidden } : null;
}

/**
 * The layout to start with: the one that was saved if it can be used,
 * otherwise the default one.
 *
 * `kinds` are the panels that exist today. A saved layout may be older
 * than the application: the panels it does not know are added where the
 * default layout has them, those that are gone are dropped.
 */

export function dockRestore( saved: unknown, kinds: DockKinds, defaults: DockLayout ): DockLayout {
	const usual = sanitize( defaults, kinds ) ?? { left: { size: 0, root: null }, right: { size: 0, root: null }, content: null, floats: [], hidden: [] };
	let layout = sanitize( saved, kinds ) ?? usual;

	for( const panel of [...kinds.contents, ...kinds.tools] ) {
		if( dockPanels( layout ).includes( panel ) ) {
			continue;
		}

		const float = floatOf( usual, panel );
		const side = bandOf( usual, panel ) ?? "right";

		if( kinds.contents.includes( panel ) ) {
			layout = addContent( layout, panel );
		}
		else if( float ) {
			layout = dockFloat( layout, panel, float );
		}
		else {
			layout = dockBand( layout, panel, side, usual[side].size );
		}

		if( usual.hidden.includes( panel ) ) {
			layout = dockShow( layout, panel, false );
		}
	}

	return layout;
}


// :: GEOMETRY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * Where a point falls in a rectangle: near one of its sides, in a band of
 * `band` pixels (a third of the rectangle at most), or in its "center".
 * null when it is outside.
 */

export function dropZone( rect: DockRect, x: number, y: number, band: number ): DockSide | "center" {
	if( x < rect.x || y < rect.y || x >= rect.x + rect.w || y >= rect.y + rect.h ) {
		return null;
	}

	const bandX = Math.min( band, rect.w / 3 );
	const bandY = Math.min( band, rect.h / 3 );

	// how deep the point is in each band: 0 on the side, 1 where the band ends
	const depths: [DockSide, number][] = [
		["left", ( x - rect.x ) / bandX],
		["right", ( rect.x + rect.w - x ) / bandX],
		["top", ( y - rect.y ) / bandY],
		["bottom", ( rect.y + rect.h - y ) / bandY],
	];

	const [side, depth] = depths.reduce( ( a, b ) => b[1] < a[1] ? b : a );
	return depth < 1 ? side : "center";
}

/**
 * the part of a rectangle a panel takes when it is docked on one of its sides
 */

export function sideRect( rect: DockRect, side: DockSide, size: number ): DockRect {
	switch( side ) {
		case "left":	return { x: rect.x, y: rect.y, w: size, h: rect.h };
		case "right":	return { x: rect.x + rect.w - size, y: rect.y, w: size, h: rect.h };
		case "top":		return { x: rect.x, y: rect.y, w: rect.w, h: size };
		case "bottom":	return { x: rect.x, y: rect.y + rect.h - size, w: rect.w, h: size };
	}
}

/**
 * A rectangle brought back inside another one, as far as needed for its
 * top-left part to stay there: `keep` pixels of it, so that a floating
 * panel can always be caught by its title.
 */

export function keepInside( rect: DockRect, within: DockRect, keep: number ): DockRect {
	const x = Math.max( within.x, Math.min( rect.x, within.x + within.w - keep ) );
	const y = Math.max( within.y, Math.min( rect.y, within.y + within.h - keep ) );

	return { x, y, w: rect.w, h: rect.h };
}
