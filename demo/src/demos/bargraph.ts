/**
 * Bargraph: the page of the gallery
 */

import { Bargraph, HBox, Knob, Label, linearColorStops, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Levels — Meters that move as a sound: up quickly, down slowly; overshoot puts the top in the alert color, peak keeps the highest segment lit a second. */
export function levels( ) {
	const meters = [ 0, 1, 2, 3, 4, 5 ].map( ( ) => new Bargraph( { vertical: true, height: 160, overshoot: 85, peak: true } ) );
	const box = new HBox( { content: meters } );

	// a named timer of the box, stopped when the box leaves the page
	let t = 0;
	box.setInterval( "levels", 50, ( ) => {
		t++;
		meters.forEach( ( m, i ) => m.setValue( 45 + 50 * Math.abs( Math.sin( t / ( 6 + i * 2 ) ) ) * ( 0.6 + 0.4 * Math.random( ) ) ) );
	} );
	box.addDOMEvent( "removed", ( ) => box.clearTimeouts( ) );

	return box;
}

/** @demo Animated — setValue: the bar goes up in a few frames and comes down slower; animated: false shows the value at once. */
export function animated( ) {
	const soft = new Bargraph( { value: 40, width: 300 } );
	const hard = new Bargraph( { value: 40, width: 300, animated: false } );

	return new HBox( { content: [
		new Knob( { value: 40, label: "value", change: ( ev ) => { soft.setValue( ev.value ); hard.setValue( ev.value ); } } ),
		new VBox( { content: [
			soft,
			new Label( { text: "animated" } ),
			hard,
			new Label( { text: "animated: false" } ),
		] } ),
	] } );
}

/** @demo Colors — No colors: the accent, pale to full. colors: from min to max, as Gauge (linearColorStops), two colors, or one: a plain bar. An unlit segment keeps a trace of its color. */
export function colors( ) {
	return new VBox( { content: [
		new Bargraph( { value: 70, width: 360 } ),
		new Bargraph( { value: 70, width: 360, colors: linearColorStops } ),
		new Bargraph( { value: 70, width: 360, colors: [ "#2a78d6", "#e87ba4" ] } ),
		new Bargraph( { value: 70, width: 360, colors: [ "var(--success-background)" ] } ),
	] } );
}

/** @demo Segments and overshoot — segments: their count; overshoot: the segments that start at this value or above have the alert color, the colors go under it. Disabled, the lit segments are grey. */
export function segments( ) {
	return new HBox( { content: [
		new Bargraph( { vertical: true, height: 160, value: 90, segments: 10 } ),
		new Bargraph( { vertical: true, height: 160, value: 90, segments: 20, overshoot: 80 } ),
		new Bargraph( { vertical: true, height: 160, value: 90, segments: 40, width: 20, overshoot: 70 } ),
		new Bargraph( { vertical: true, height: 160, value: 90, segments: 40, width: 4 } ),
		new Bargraph( { vertical: true, height: 160, value: 60, overshoot: 80, disabled: true } ),
	] } );
}

/** @demo Many meters — 32 meters of 40 segments, a value each at each frame: one loop draws them all, and only the segments that change. */
export function many( ) {
	const meters = Array.from( { length: 32 }, ( ) => new Bargraph( { vertical: true, segments: 40, width: 8, height: 160, overshoot: 85, peak: true } ) );
	const box = new HBox( { style: { gap: 3 }, content: meters } );

	box.setInterval( "levels", 16, ( ) => {
		const now = performance.now( );
		meters.forEach( ( m, i ) => m.setValue( 40 + 55 * Math.abs( Math.sin( now / ( 300 + i * 37 ) ) ) * ( 0.7 + 0.3 * Math.random( ) ) ) );
	} );
	box.addDOMEvent( "removed", ( ) => box.clearTimeouts( ) );

	return box;
}

const page: DemoComponent = {
	name: "Bargraph",
	category: "Display components",
	description: "A level meter of segments, horizontal or vertical, drawn in a canvas: the accent or the colors given from min to max, an overshoot in the alert color, a peak that stays. Its value can change at each frame.",
	usage: {
		create: ( props ) => new Bargraph( props ),
		props: { value: 60, segments: 20, overshoot: 80, vertical: false, disabled: false },
		controls: [
			{ name: "value", type: "number", min: 0, max: 100, step: 1, live: true },
			{ name: "segments", type: "number", min: 1, max: 60, step: 1, live: true },
			{ name: "overshoot", type: "number", min: 0, max: 100, step: 5, live: true },
			{ name: "vertical", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ levels, animated, colors, segments, many ],
};

export default page;
