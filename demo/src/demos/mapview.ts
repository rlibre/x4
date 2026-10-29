/**
 * MapView: the page of the gallery
 */

import { Button, HBox, Label, VBox } from 'x4js';
import { LatLng, MapMarker, MapView } from 'x4js/mapview';
import { DemoComponent } from '../types';

// the center of the configurator
const paris: LatLng = { lat: 48.8566, lng: 2.3522 };

const places: MapMarker[] = [
	{ lat: 48.8584, lng: 2.2945, title: "Tour Eiffel" },
	{ lat: 48.8606, lng: 2.3376, title: "Louvre" },
	{ lat: 48.8530, lng: 2.3499, title: "Notre-Dame" },
	{ lat: 48.8867, lng: 2.3431, title: "Sacré-Cœur" },
];

/** @demo Markers — A pin on each place, its title as tooltip; markerClick gives the marker. fitBounds shows them all. */
export function markers( ) {
	const result = new Label( { text: "Click a marker" } );
	const map = new MapView( { width: "100%", height: 320, center: paris, zoom: 12, markers: places,
		markerClick: ( ev ) => result.setText( ev.marker.title ),
	} );

	return new VBox( { content: [
		map,
		new HBox( { content: [
			new Button( { label: "fitBounds", cls: "outline", click: ( ) => map.fitBounds( map.getMarkers( ) ) } ),
			result,
		] } ),
	] } );
}

/** @demo Zones — Under the markers: a polygon, a circle of a radius in meters, a line; the colors of Chart in turn, or color; width is the line. shapeClick gives the zone. */
export function zones( ) {
	const result = new Label( { text: "Click a zone" } );

	return new VBox( { content: [
		new MapView( { width: "100%", height: 320, center: { lat: 48.8640, lng: 2.3250 }, zoom: 13,
			markers: places,
			shapes: [
				{ type: "polygon", title: "Île de la Cité", points: [
					{ lat: 48.8571, lng: 2.3410 }, { lat: 48.8580, lng: 2.3445 }, { lat: 48.8545, lng: 2.3525 },
					{ lat: 48.8520, lng: 2.3530 }, { lat: 48.8540, lng: 2.3450 },
				] },
				{ type: "circle", title: "500 m around the Tour Eiffel", center: places[0], radius: 500 },
				{ type: "line", title: "A walk", color: "var(--accent-background)", width: 6, points: places },
			],
			shapeClick: ( ev ) => result.setText( `${ev.shape.type}: ${ev.shape.title}` ),
		} ),
		result,
	] } );
}

/** @demo Click and move — click gives the place clicked (here a new marker); move comes when the user moves or zooms the map, not when the code does. */
export function clickMove( ) {
	const result = new Label( { text: "Click the map" } );
	const map = new MapView( { width: "100%", height: 320, center: paris, zoom: 11,
		click: ( ev ) => {
			map.addMarker( { ...ev.latlng, title: `${ev.latlng.lat.toFixed( 4 )}, ${ev.latlng.lng.toFixed( 4 )}` } );
			result.setText( `click: ${ev.latlng.lat.toFixed( 4 )}, ${ev.latlng.lng.toFixed( 4 )}` );
		},
		move: ( ev ) => result.setText( `move: ${ev.center.lat.toFixed( 4 )}, ${ev.center.lng.toFixed( 4 )}, zoom ${ev.zoom}` ),
	} );

	return new VBox( { content: [
		map,
		new HBox( { content: [
			new Button( { label: "Clear", cls: "outline", click: ( ) => map.setMarkers( [] ) } ),
			result,
		] } ),
	] } );
}

/** @demo From the code — setCenter goes to a place, with a zoom or not; setZoom keeps the center. */
export function fromCode( ) {
	const map = new MapView( { width: "100%", height: 320, center: paris, zoom: 5 } );

	return new VBox( { content: [
		map,
		new HBox( { content: [
			new Button( { label: "Paris", cls: "outline", click: ( ) => map.setCenter( paris, 12 ) } ),
			new Button( { label: "Genève", cls: "outline", click: ( ) => map.setCenter( { lat: 46.2044, lng: 6.1432 }, 13 ) } ),
			new Button( { label: "Tokyo", cls: "outline", click: ( ) => map.setCenter( { lat: 35.6762, lng: 139.6503 }, 11 ) } ),
			new Button( { label: "The world", cls: "outline", click: ( ) => map.setCenter( { lat: 30, lng: 0 }, 2 ) } ),
			new Button( { label: "zoom 15", cls: "outline", click: ( ) => map.setZoom( 15 ) } ),
		] } ),
	] } );
}

/** @demo Other tiles — tiles is the url of a tile ({z}, {x}, {y}), attribution its credit, always shown. Openstreetmap is for a light use: an application with many users takes the tiles of a provider. */
export function tiles( ) {
	return new MapView( { width: "100%", height: 320, center: { lat: 45.8326, lng: 6.8652 }, zoom: 12,
		tiles: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
		attribution: "© OpenStreetMap contributors, SRTM | © OpenTopoMap (CC-BY-SA)",
		maxZoom: 17,
	} );
}

const page: DemoComponent = {
	name: "MapView",
	category: "Add-ons",
	description: "A map of tiles, openstreetmap by default, with markers and zones (polygons, circles, lines). It is moved with the pointer and zoomed with the wheel, its buttons, a double click or two fingers.",
	imports: [ "MapView", "MapMarker", "LatLng" ],
	module: "x4js/mapview",
	usage: {
		create: ( props ) => new MapView( { ...props, center: paris } ),
		extra: "center: paris",
		props: { zoom: 12, width: 480, height: 320 },
		controls: [
			{ name: "zoom", type: "number", min: 1, max: 19, step: 1, live: true },
			{ name: "width", type: "number", min: 200, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 160, max: 480, step: 20, live: true },
		],
	},
	demos: [ markers, zones, clickMove, fromCode, tiles ],
};

export default page;
