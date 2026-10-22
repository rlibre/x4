/**
 * Canvas: the page of the gallery
 */

import { Button, Canvas, CanvasEx, HBox, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./canvas.scss";

// the drawing of the configurator
function drawShapes( ctx: CanvasEx ) {
	ctx.fillStyle = "#569cd6";
	ctx.beginPath( );
	ctx.roundRect( 20, 20, 120, 70, 10 );
	ctx.fill( );

	ctx.fillStyle = "#e8590c";
	ctx.beginPath( );
	ctx.circle( 200, 55, 35 );
	ctx.fill( );

	ctx.line( 20, 120, ctx.width - 20, 120, "#888", 2 );
}

/** @demo Shapes — paint_cb draws: the context has helpers of x4 (roundRect, circle, line) and the size of the canvas. */
export function shapes( ) {
	return new Canvas( { width: 360, height: 160, paint_cb: ( ctx ) => {
		ctx.fillStyle = "#569cd6";
		ctx.beginPath( );
		ctx.roundRect( 20, 20, 120, 70, 10 );
		ctx.fill( );

		ctx.fillStyle = "#e8590c";
		ctx.beginPath( );
		ctx.circle( 200, 55, 35 );
		ctx.fill( );

		ctx.line( 20, 120, ctx.width - 20, 120, "#888", 2 );

		ctx.fillStyle = "#888";
		ctx.fillText( `${ctx.width} x ${ctx.height}`, 20, 145 );
	} } );
}

/** @demo Redraw — The data changes, redraw() paints again: the canvas follows its size too (resized). */
export function redraw( ) {
	let values = [ 30, 70, 45, 90, 60 ];

	const canvas = new Canvas( { height: 140, clear: true, paint_cb: ( ctx ) => {
		const w = ( ctx.width - 20 ) / values.length;
		ctx.fillStyle = "#569cd6";
		values.forEach( ( v, i ) => {
			ctx.fillRect( 10 + i * w, ctx.height - v, w - 6, v );
		} );
	} } );

	return new VBox( { content: [
		canvas,
		new HBox( { content: new Button( { label: "New values", click: ( ) => {
			values = values.map( ( ) => 10 + Math.round( Math.random( ) * 120 ) );
			canvas.redraw( );
		} } ) } ),
	] } );
}

/** @demo Smooth line — smoothLine draws a smooth curve from points { x, y }. */
export function smooth( ) {
	return new Canvas( { width: 360, height: 140, paint_cb: ( ctx ) => {
		const points = [ { x: 10, y: 120 }, { x: 80, y: 40 }, { x: 160, y: 90 }, { x: 240, y: 20 }, { x: 350, y: 100 } ];

		ctx.strokeStyle = "#e8590c";
		ctx.lineWidth = 3;
		ctx.beginPath( );
		ctx.smoothLine( points, null, true );
		ctx.stroke( );

		ctx.fillStyle = "#569cd6";
		for( const p of points ) {
			ctx.beginPath( );
			ctx.circle( p.x, p.y, 4 );
			ctx.fill( );
		}
	} } );
}

/** @demo Scale — scale() zooms the whole drawing; the paint event is the other way to draw. */
export function scale( ) {
	let zoom = 1;
	const canvas = new Canvas( { width: 360, height: 140, clear: true, paint: ( ev ) => {
		ev.ctx.fillStyle = "#569cd6";
		ev.ctx.fillRect( 20, 20, 80, 50 );
		ev.ctx.fillStyle = "#888";
		ev.ctx.fillText( `zoom ${zoom}`, 20, 90 );
	} } );

	return new VBox( { content: [
		canvas,
		new HBox( { content: [
			new Button( { label: "Zoom in", click: ( ) => {
				zoom *= 1.5;
				canvas.scale( zoom );
			} } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => {
				zoom = 1;
				canvas.scale( zoom );
			} } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Canvas",
	category: "Sizers / viewport / misc",
	description: "A <canvas> that paints itself with a callback, sharp on any screen: it is painted again when its size changes, or when redraw() is called.",
	imports: [ "Canvas", "CanvasEx" ],
	usage: {
		create: ( props ) => new Canvas( { ...props, paint_cb: drawShapes } ),
		extra: "paint_cb: drawShapes",
		props: { width: 300, height: 140, clear: false },
		controls: [
			{ name: "width", type: "number", min: 100, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 60, max: 260, step: 20, live: true },
			{ name: "clear", type: "boolean" },
		],
	},
	demos: [ shapes, redraw, smooth, scale ],
};

export default page;
