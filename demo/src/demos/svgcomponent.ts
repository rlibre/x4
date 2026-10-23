/**
 * SvgComponent: the page of the gallery (with SvgBuilder)
 */

import { Button, HBox, Label, SvgBuilder, SvgComponent, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./svgcomponent.scss";

// an icon for SvgIcon: its svg has its xmlns
const heart = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21l-1.5-1.4C5 14.6 2 11.9 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.4-3 6.1-8.5 11.1L12 21z"/></svg>`;

// the drawing of the configurator
function drawing( ) {
	const svg = new SvgBuilder( );
	svg.rect( 10, 10, 80, 50 ).fill( "#569cd6" );
	svg.circle( 130, 35, 25 ).fill( "#e8590c" );
	svg.text( 10, 90, "SvgBuilder" ).fontSize( 14 ).fill( "#888" );
	return svg;
}

/** @demo Shapes — An SvgBuilder draws rectangles, circles, paths and texts; fill and stroke chain on each shape. */
export function shapes( ) {
	const svg = new SvgBuilder( );
	svg.rect( 10, 10, 100, 60 ).fill( "#569cd6" ).stroke( "#2f6fa8", 2 );
	svg.circle( 170, 40, 30 ).fill( "#e8590c" );
	svg.ellipse( 260, 40, 40, 20 ).fill( "none" ).stroke( "#2f9e44", 3 );
	svg.path( ).moveTo( 10, 110 ).lineTo( 80, 90 ).lineTo( 150, 120 ).lineTo( 300, 85 ).stroke( "#888", 2 ).no_fill( );
	svg.text( 10, 150, "rect, circle, ellipse, path, text" ).fontSize( 14 ).fill( "#888" );

	return new SvgComponent( { width: 320, height: 160, svg } );
}

/** @demo Gradient — linear_gradient gives a gradient with its stops; its id is the fill of a shape. */
export function gradient( ) {
	const svg = new SvgBuilder( );
	const grad = svg.linear_gradient( "0%", "0%", "100%", "0%" )
		.addStop( 0, "#569cd6" )
		.addStop( 100, "#e8590c" );

	svg.rect( 0, 0, 320, 60 ).fill( grad.id );

	return new SvgComponent( { width: 320, height: 60, svg } );
}

/** @demo Arcs — path().arc draws an arc, its angles in degrees from the top: a gauge at 70 %. */
export function arcs( ) {
	const svg = new SvgBuilder( );
	svg.path( ).arc( 60, 60, 45, -120, 120 ).stroke( "#ccc", 12 ).strokeCap( "round" ).no_fill( );
	svg.path( ).arc( 60, 60, 45, -120, 48 ).stroke( "#569cd6", 12 ).strokeCap( "round" ).no_fill( );
	svg.text( 60, 66, "70 %" ).fontSize( 18 ).textAlign( "center" ).fill( "#888" );

	return new SvgComponent( { width: 120, height: 120, svg } );
}

/** @demo viewBox and transforms — A drawing of 100 x 100 shown at 200 x 200 by its viewbox; a group rotated, an icon in it (its svg needs its xmlns). */
export function transforms( ) {
	const svg = new SvgBuilder( );
	const group = svg.group( );
	group.rect( 30, 30, 40, 40 ).fill( "#569cd6" );
	group.icon( heart, 40, 40, 20, 20 ).fill( "#fff" );
	group.rotate( 30, 50, 50 );

	return new SvgComponent( { width: 200, height: 200, viewbox: "0 0 100 100", svg } );
}

/** @demo setSvg — setSvg replaces the whole drawing: new bars at each click, in the accent of the theme (a variable, by setStyle). */
export function setSvg( ) {
	const view = new SvgComponent( { width: 320, height: 100 } );

	const draw = ( ) => {
		const svg = new SvgBuilder( );
		for( let i = 0; i < 10; i++ ) {
			const h = 10 + Math.random( ) * 85;
			// the accent of the theme: a variable, in the style of the shape
			svg.rect( i * 32, 100 - h, 26, h ).setStyle( "fill", "var( --accent-background )" );
		}
		view.setSvg( svg );
	};

	draw( );
	return new VBox( { content: [
		view,
		new HBox( { content: new Button( { label: "Draw again", click: draw } ) } ),
	] } );
}

/** @demo Interactive — A shape takes DOM events (addDOMEvent) and a tooltip: its attribute tooltip, shown as html by initTooltips. The hover is in the style. */
export function interactive( ) {
	const months: [ string, number ][] = [ [ "Jan", 42 ], [ "Feb", 58 ], [ "Mar", 35 ], [ "Apr", 71 ], [ "May", 64 ], [ "Jun", 80 ] ];
	const info = new Label( { text: "Click a bar" } );
	const svg = new SvgBuilder( );

	months.forEach( ( [ month, value ], i ) => {
		svg.rect( 10 + i * 50, 100 - value, 36, value )
			.fill( "#569cd6" )
			.addClass( "bar" )
			.setAttr( "tooltip", `<b>${month}</b>: ${value} orders` )
			.addDOMEvent( "click", ( ) => info.setText( `${month}: ${value} orders` ) );

		svg.text( 28 + i * 50, 116, month ).fontSize( 11 ).textAlign( "center" ).fill( "#888" );
	} );

	return new VBox( { content: [ new SvgComponent( { width: 320, height: 120, svg } ), info ] } );
}

/** @demo Drawing with the mouse — A click on the drawing adds a point where the pointer is (no viewbox: a point of the drawing is a pixel); a click on a point removes it. */
export function dots( ) {
	const svg = new SvgBuilder( );
	const view = new SvgComponent( { cls: "dots", width: 320, height: 160, svg } );

	view.addDOMEvent( "click", ( ev ) => {
		// on a point, its own click removes it
		if( ev.target !== view.dom ) {
			return;
		}

		const dot = svg.circle( ev.offsetX, ev.offsetY, 8 ).fill( "#e8590c" ).addClass( "dot" );
		dot.addDOMEvent( "click", ( ) => dot.getDom( ).remove( ) );
	} );

	return view;
}

const page: DemoComponent = {
	name: "SvgComponent",
	category: "Extra",
	description: "An <svg> element whose drawing is made with an SvgBuilder: shapes, paths, texts, gradients, groups, all in code.",
	imports: [ "SvgComponent", "SvgBuilder" ],
	usage: {
		create: ( props ) => new SvgComponent( { ...props, svg: drawing( ) } ),
		extra: "svg: drawing( )",
		props: { width: 200, height: 120, viewbox: "" },
		controls: [
			{ name: "width", type: "number", min: 100, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 60, max: 260, step: 20, live: true },
			{ name: "viewbox", type: "options", options: [
				{ id: "", text: "none" },
				{ id: "0 0 160 100", text: "0 0 160 100" },
				{ id: "0 0 320 200", text: "0 0 320 200" },
			] },
		],
	},
	demos: [ shapes, interactive, dots, gradient, arcs, transforms, setSvg ],
};

export default page;
