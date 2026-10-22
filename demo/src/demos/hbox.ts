/**
 * HBox: the page of the gallery
 */

import { Button, Flex, HBox, Input, Label, Space, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./hbox.scss";

/** @demo A line of a form — A label, a field that takes the room left (flex), a button. */
export function formLine( ) {
	return new HBox( { cls: "boxline", content: [
		new Label( { text: "Name" } ),
		new Input( { type: "text", flex: 1, placeholder: "Your name" } ),
		new Button( { label: "Save" } ),
	] } );
}

/** @demo Flex — A Flex takes the room left: it pushes what follows it to the right. */
export function flex( ) {
	return new HBox( { cls: "boxline", content: [
		new Button( { label: "Back", cls: "outline" } ),
		new Flex( ),
		new Button( { label: "Cancel", cls: "outline" } ),
		new Button( { label: "OK" } ),
	] } );
}

/** @demo Space — A Space keeps a fixed room between two children: in pixels, or with a unit. */
export function space( ) {
	return new HBox( { cls: "boxline", content: [
		new Button( { label: "Cut" } ),
		new Button( { label: "Copy" } ),
		new Space( 40 ),
		new Button( { label: "Undo" } ),
		new Space( "4em" ),
		new Button( { label: "Help" } ),
	] } );
}

/** @demo Shares of the width — A flex number: the children share the room in proportion (1, 2, 1). */
export function shares( ) {
	return new HBox( { cls: "boxline", content: [
		new Button( { label: "flex: 1", flex: 1 } ),
		new Button( { label: "flex: 2", flex: 2 } ),
		new Button( { label: "flex: 1", flex: 1 } ),
	] } );
}

/** @demo Alignment — The children are centered on the height of the box; the class align-start puts them at its top. */
export function alignment( ) {
	return new VBox( { content: [
		new HBox( { cls: "boxline high", content: [
			new Button( { label: "Centered" } ),
			new Button( { label: "Higher", height: 60 } ),
		] } ),
		new HBox( { cls: "boxline high align-start", content: [
			new Button( { label: "At the top" } ),
			new Button( { label: "Higher", height: 60 } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "HBox",
	category: "Layout containers",
	description: "A box that lays its children side by side, in a row: a flex box. Flex and Space set the room between them.",
	imports: [ "HBox", "Flex", "Space" ],
	usage: {
		create: ( props ) => new HBox( { ...props, content: [
			new Button( { label: "One" } ),
			new Button( { label: "Two", height: 60 } ),
			new Button( { label: "Three" } ),
		] } ),
		extra: "content: [ one, two, three ]",
		props: { cls: "", width: 360, height: 120 },
		controls: [
			{ name: "cls", type: "options", options: [
				{ id: "", text: "centered (default)" },
				{ id: "align-start", text: "align-start" },
			] },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 60, max: 240, step: 20, live: true },
		],
	},
	demos: [ formLine, flex, space, shares, alignment ],
};

export default page;
