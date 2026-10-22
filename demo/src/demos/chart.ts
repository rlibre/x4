/**
 * Chart: the page of the gallery
 */

import { Button, Chart, ChartSerie, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

// the series of the configurator
const sales: ChartSerie[] = [
	{ name: "2025", values: [ 12, 19, 14, 22, 28, 25 ] },
	{ name: "2026", values: [ 15, 21, 18, 27, 31, 34 ] },
];
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ];

/** @demo Lines — Each serie is a line; with two named series a legend is shown; dots shows every point, undefined leaves a hole. */
export function lines( ) {
	return new Chart( { height: 240,
		labels: [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
		series: [
			{ name: "Visits", values: [ 120, 180, 150, 210, undefined, 90, 60 ], dots: true },
			{ name: "Orders", values: [ 20, 35, 28, 44, 39, 18, 9 ] },
		],
	} );
}

/** @demo Area and axes — An area under the line; the axes get a name, the y axis its bounds. */
export function area( ) {
	return new Chart( { height: 240, type: "area",
		labels: [ "0h", "4h", "8h", "12h", "16h", "20h", "24h" ],
		series: [ { name: "Temperature", values: [ 11, 9, 13, 21, 24, 18, 13 ] } ],
		xaxis: { name: "Hour" },
		yaxis: { name: "°C", min: 0, max: 30 },
		formatter: ( value ) => value + "°",
	} );
}

/** @demo Stacked bars — Bars side by side, or stacked: each serie on the one before. */
export function bars( ) {
	return new Chart( { height: 240, type: "bar", stacked: true,
		labels: [ "Q1", "Q2", "Q3", "Q4" ],
		series: [
			{ name: "Hardware", values: [ 40, 52, 48, 61 ] },
			{ name: "Software", values: [ 25, 30, 41, 45 ] },
			{ name: "Services", values: [ 12, 18, 15, 22 ] },
		],
	} );
}

/** @demo Pie and donut — Both use the first serie: a slice per value, named by its label. */
export function donut( ) {
	const labels = [ "Chrome", "Safari", "Firefox", "Edge", "Other" ];
	const shares = [ { values: [ 64, 19, 4, 5, 8 ] } ];

	return new HBox( { content: [
		new Chart( { width: 300, height: 220, type: "pie", labels, series: shares } ),
		new Chart( { width: 300, height: 220, type: "donut", labels, series: shares } ),
	] } );
}

/** @demo Click and new data — click gives the serie, the index and the value of the point; setSeries draws other values. */
export function click( ) {
	const label = new Label( { text: "Click a bar" } );
	const first = [ { name: "Rain (mm)", values: [ 52, 41, 48, 60, 72, 45 ] } ];
	const second = [ { name: "Rain (mm)", values: [ 30, 66, 58, 39, 41, 80 ] } ];

	const chart = new Chart( { height: 220, type: "bar", labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun" ], series: first,
		click: ( ev ) => label.setText( `serie ${ev.serie}, point ${ev.index}: ${ev.value} mm` ),
	} );

	return new VBox( { content: [
		chart,
		new HBox( { content: [
			new Button( { label: "2025", cls: "outline", click: ( ) => chart.setSeries( first ) } ),
			new Button( { label: "2026", cls: "outline", click: ( ) => chart.setSeries( second ) } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Chart",
	category: "Lists / grids / trees",
	description: "A minimal svg chart: lines, areas, bars, pie and donut, with axes, a legend and a click on the points. Its colors are CSS variables.",
	usage: {
		create: ( props ) => new Chart( { ...props, series: sales, labels: months } ),
		extra: "series: sales, labels: months",
		props: { type: "line", stacked: false, width: 480, height: 260 },
		controls: [
			{ name: "type", type: "options", options: [
				{ id: "line", text: "line" },
				{ id: "area", text: "area" },
				{ id: "bar", text: "bar" },
				{ id: "pie", text: "pie" },
				{ id: "donut", text: "donut" },
			] },
			{ name: "stacked", type: "boolean" },
			{ name: "width", type: "number", min: 200, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 400, step: 20, live: true },
		],
	},
	demos: [ lines, area, bars, donut, click ],
};

export default page;
