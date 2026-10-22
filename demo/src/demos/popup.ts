/**
 * Popup: the page of the gallery
 */

import { Button, Component, HBox, Label, Popup, SimpleText } from 'x4js';
import { DemoComponent } from '../types';

import "./popup.scss";

/** @demo Near a button — displayNear places the popup against a rectangle; with autoClose, a click outside closes it. */
export function near( ) {
	const button = new Button( { label: "Open near me", click: ( ) => {
		const popup = new Popup( { cls: "popup-panel", autoClose: true, content: [
			new SimpleText( { text: "Under the button, its left edge on the left of the button." } ),
			new SimpleText( { text: "Click outside to close it." } ),
		] } );

		popup.displayNear( button.getBoundingRect( ), "top left", "bottom left", { x: 0, y: 4 } );
	} } );

	return new HBox( { content: [ button ] } );
}

/** @demo At the pointer — displayAt places it at a point: here a menu of your own, opened by a right click in the zone. */
export function at( ) {
	const zone = new Component( { cls: "popup-zone", content: "Right click here", dom_events: {
		contextmenu: ( ev: MouseEvent ) => {
			ev.preventDefault( );

			const popup = new Popup( { cls: "popup-panel", autoClose: true, content: [
				new SimpleText( { text: `At x ${ev.pageX}, y ${ev.pageY}` } ),
			] } );

			popup.displayAt( ev.pageX, ev.pageY );
		},
	} } );

	return zone;
}

/** @demo Movable and sizable — A popup in the middle of the page: its title (class caption-element) moves it, its edges size it. */
export function movable( ) {
	return new HBox( { content: [
		new Button( { label: "Open in the middle", click: ( ) => {
			const popup: Popup = new Popup( { cls: "popup-panel", movable: true, sizable: true, content: [
				new Label( { cls: "caption-element", text: "Drag me by this title" } ),
				new SimpleText( { flex: 1, text: "Drag an edge or a corner to size the popup." } ),
				new Button( { label: "Close", click: ( ) => popup.close( ) } ),
			] } );

			// show( ) is displayCenter( )
			popup.show( );
		} } ),
	] } );
}

/** @demo opened and closed — The events of a popup: here a label tells whether it is open. */
export function events( ) {
	const state = new Label( { text: "closed" } );

	const button = new Button( { label: "Open", click: ( ) => {
		const popup = new Popup( { cls: "popup-panel", autoClose: true, content: [
			new SimpleText( { text: "Click outside to close it." } ),
		] } );

		popup.on( "opened", ( ) => state.setText( "opened" ) );
		popup.on( "closed", ( ) => state.setText( "closed" ) );
		popup.displayNear( button.getBoundingRect( ), "top left", "top right", { x: 8, y: 0 } );
	} } );

	return new HBox( { content: [ button, state ] } );
}

const page: DemoComponent = {
	name: "Popup",
	category: "Popup / Dialog",
	description: "The base of what floats above the page: menus, dialogs, notifications. It is placed near a rectangle, at a point, or in the middle; it can close by itself on a click outside.",
	usage: {
		// the preview: a button that opens the popup
		create: ( props ) => {
			const button = new Button( { label: "Open the popup", click: ( ) => {
				const popup: Popup = new Popup( { ...props, cls: "popup-panel", content: [
					new Label( { cls: "caption-element", text: "A popup: movable by this title" } ),
					new Button( { label: "Close", click: ( ) => popup.close( ) } ),
				] } );

				popup.displayNear( button.getBoundingRect( ), "top left", "bottom left", { x: 0, y: 4 } );
			} } );

			return button;
		},
		extra: "cls: \"popup-panel\", content: [ title, closeButton ]",
		props: { autoClose: true, movable: false, sizable: false },
		controls: [
			{ name: "autoClose", type: "boolean" },
			{ name: "movable", type: "boolean" },
			{ name: "sizable", type: "boolean" },
		],
	},
	demos: [ near, at, movable, events ],
};

export default page;
