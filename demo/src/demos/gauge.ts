/**
 * Gauge: the page of the gallery
 */

import { Button, Gauge, HBox, Label, Slider, VBox, simpleColorStop } from 'x4js';
import { DemoComponent } from '../types';

/** @demo setPos — setPos moves the needle; here a Slider gives the position. */
export function setPos( ) {
	const gauge = new Gauge( { width: 240, height: 130 } );
	gauge.setPos( 30 );

	return new VBox( { content: [
		gauge,
		new Slider( { width: 240, value: 30, min: 0, max: 100, change: ( ev ) => gauge.setPos( ev.value ) } ),
	] } );
}

/** @demo Colors — colors: the arcs of the dial, from the left; simpleColorStop is one arc of the color of the theme. */
export function colors( ) {
	return new HBox( { content: [
		new Gauge( { width: 200, height: 110, colors: simpleColorStop } ),
		new Gauge( { width: 200, height: 110, colors: [ "#2f9e44", "#f59f00", "#e03131" ] } ),
	] } );
}

/** @demo setRange — The range is from min to max (0 to 100 when missing); setRange changes it, the needle keeps its value. */
export function setRange( ) {
	const gauge = new Gauge( { width: 240, height: 130, min: -20, max: 40 } );
	const label = new Label( { text: "-20 °C to 40 °C, 15 °C" } );
	gauge.setPos( 15 );

	return new HBox( { content: [
		gauge,
		new VBox( { content: [
			new Button( { label: "-20 to 40", cls: "outline", click: ( ) => {
				gauge.setRange( -20, 40 );
				label.setText( "-20 °C to 40 °C, 15 °C" );
			} } ),
			new Button( { label: "0 to 20", cls: "outline", click: ( ) => {
				gauge.setRange( 0, 20 );
				label.setText( "0 °C to 20 °C, 15 °C" );
			} } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Gauge",
	category: "Display components",
	description: "A dial and its needle, drawn in svg at the size of the component. The needle is moved by setPos: it has no prop.",
	usage: {
		create: ( props ) => new Gauge( props ),
		props: { min: 0, max: 100, width: 240, height: 130 },
		controls: [
			{ name: "min", type: "number", min: -100, max: 100, step: 10, live: true },
			{ name: "max", type: "number", min: 0, max: 200, step: 10, live: true },
			{ name: "width", type: "number", min: 100, max: 400, step: 20, live: true },
			{ name: "height", type: "number", min: 60, max: 240, step: 10, live: true },
		],
	},
	demos: [ setPos, colors, setRange ],
};

export default page;
