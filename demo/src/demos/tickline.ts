/**
 * TickLine: the page of the gallery
 */

import { Button, Color, HBox, Label, TickLine, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./tickline.scss";

// the values of the configurator
const load = [ 20, 35, 30, 60, 75, 50, 40, 65, 90, 70, 55, 45 ];

/** @demo Bars — A small bar chart of values between min and max (0 and 100 by default), with a tooltip on each bar. */
export function bars( ) {
	return new TickLine( {
		type: "bars",
		width: 300,
		height: 60,
		values: [ 20, 35, 30, 60, 75, 50, 40, 65, 90, 70, 55, 45 ],
		color: new Color( "#569cd6" ),
		display: { tooltips: true },
	} );
}

/** @demo Line — A line through the values, an axis at 0 when min is below it. */
export function line( ) {
	return new TickLine( {
		type: "line",
		width: 300,
		height: 80,
		min: -50,
		max: 50,
		values: [ -10, 5, 20, 15, -25, -40, -5, 30, 45, 10 ],
		color: new Color( "#e8590c" ),
		display: { axis: true },
	} );
}

/** @demo Live — setValues gives new values (and a new range): a CPU meter fed each second while it runs. */
export function live( ) {
	const values = [ 40, 55, 30, 70, 60 ];
	const label = new Label( { text: "" } );
	const tick = new TickLine( { type: "bars", width: 300, height: 60, values, color: new Color( "#2f9e44" ) } );

	return new HBox( { content: [
		tick,
		new VBox( { content: [
			new Button( { label: "Start", click: ( ) => {
				tick.setInterval( "feed", 1000, ( ) => {
					values.push( Math.round( Math.random( ) * 100 ) );
					if( values.length > 30 ) {
						values.shift( );
					}
					tick.setValues( values );
					label.setText( `${values[values.length - 1]} %` );
				} );
			} } ),
			new Button( { label: "Stop", cls: "outline", click: ( ) => tick.clearInterval( "feed" ) } ),
		] } ),
		label,
	] } );
}

const page: DemoComponent = {
	name: "TickLine",
	category: "Sizers / viewport / misc",
	description: "A tiny chart in svg, bars or a line, to show a trend in a cell or a status bar.",
	imports: [ "TickLine", "Color" ],
	usage: {
		create: ( props ) => new TickLine( { ...props, values: load, color: new Color( props.color ?? "#569cd6" ) } ),
		extra: "values: load",
		props: { type: "bars", min: 0, max: 100, color: "#569cd6", width: 300, height: 80 },
		controls: [
			{ name: "type", type: "options", options: [
				{ id: "bars", text: "bars" },
				{ id: "line", text: "line" },
			] },
			{ name: "min", type: "number", min: -100, max: 50, step: 10, live: true },
			{ name: "max", type: "number", min: 60, max: 200, step: 10, live: true },
			{ name: "color", type: "options", options: [
				{ id: "#569cd6", text: "blue", data: "new Color( \"#569cd6\" )" },
				{ id: "#e8590c", text: "orange", data: "new Color( \"#e8590c\" )" },
				{ id: "#2f9e44", text: "green", data: "new Color( \"#2f9e44\" )" },
			] },
			{ name: "width", type: "number", min: 100, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 30, max: 200, step: 10, live: true },
		],
	},
	demos: [ bars, line, live ],
};

export default page;
