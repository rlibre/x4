/**
 * VBox: the page of the gallery
 */

import { Button, Flex, HBox, Input, Label, SimpleText, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./vbox.scss";

/** @demo Disabled — enable( false ) makes all its content inert and faded: fields, buttons, the boxes in it. */
export function disabled( ) {
	const box = new VBox( { cls: "boxcolumn", width: 280, content: [
		new Label( { text: "Name" } ),
		new Input( { type: "text", value: "Ada" } ),
		new Button( { label: "Send" } ),
	] } );

	let enabled = true;
	return new VBox( { content: [
		new Button( { label: "Disable / enable", click: ( ) => {
			enabled = !enabled;
			box.enable( enabled );
		} } ),
		box,
	] } );
}

/** @demo A form — Its children one under the other, as wide as the box. */
export function form( ) {
	return new VBox( { cls: "boxcolumn", width: 280, content: [
		new Label( { text: "Name" } ),
		new Input( { type: "text", placeholder: "Your name" } ),
		new Label( { text: "Email" } ),
		new Input( { type: "email", placeholder: "you@example.com" } ),
		new Button( { label: "Send" } ),
	] } );
}

/** @demo The room left — A child with flex takes the height left between a title and a footer. */
export function roomLeft( ) {
	return new VBox( { cls: "boxcolumn", width: 280, height: 220, content: [
		new Label( { cls: "head", text: "Title" } ),
		new SimpleText( { cls: "body", flex: 1, text: "flex: 1, the height left" } ),
		new Button( { label: "Footer" } ),
	] } );
}

/** @demo Scrolling — With a height and overflow, the box scrolls its children. */
export function scrolling( ) {
	const lines = [];
	for( let i = 1; i <= 20; i++ ) {
		lines.push( new Label( { text: `Line ${i}` } ) );
	}

	return new VBox( { cls: "boxcolumn", width: 280, height: 160, style: { overflowY: "auto" }, content: lines } );
}

/** @demo Boxes in boxes — A VBox with a toolbar (an HBox) and a body: the side and the main part, stretched to its height. */
export function nested( ) {
	return new VBox( { cls: "boxcolumn", height: 220, content: [
		new HBox( { cls: "toolbar", content: [
			new Button( { label: "New" } ),
			new Button( { label: "Open" } ),
			new Flex( ),
			new Button( { label: "Help", cls: "outline" } ),
		] } ),
		new HBox( { flex: 1, content: [
			new SimpleText( { cls: "body", width: 120, stretch: true, text: "side" } ),
			new SimpleText( { cls: "body", flex: 1, stretch: true, text: "main" } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "VBox",
	category: "Layout containers",
	description: "A box that lays its children one under the other, in a column: a flex box. Its children take its width.",
	usage: {
		create: ( props ) => new VBox( { ...props, content: [
			new Button( { label: "Top" } ),
			new Flex( ),
			new Button( { label: "Bottom" } ),
		] } ),
		extra: "content: [ top, new Flex( ), bottom ]",
		props: { width: 200, height: 200 },
		controls: [
			{ name: "width", type: "number", min: 100, max: 500, step: 20, live: true },
			{ name: "height", type: "number", min: 100, max: 260, step: 20, live: true },
		],
	},
	demos: [ form, roomLeft, scrolling, nested, disabled ],
};

export default page;
