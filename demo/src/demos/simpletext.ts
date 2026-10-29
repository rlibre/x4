/**
 * SimpleText: the page of the gallery
 */

import { Button, HBox, SimpleText, VBox, unsafe } from 'x4js';
import { DemoComponent } from '../types';

import "./simpletext.scss";

/** @demo Paragraph — A text without icon, which goes on several lines when it is longer than its box. */
export function paragraph( ) {
	return new SimpleText( { width: 420, text: "x4 builds the interface with objects: each component is a TypeScript object that owns a real element of the page. Changing it is calling its methods; nothing is drawn again behind your back." } );
}

/** @demo Html — A string is escaped; the tag `unsafe`, before a template string, writes html, its values still escaped. */
export function html( ) {
	const name = "<script>";

	return new VBox( { content: [
		new SimpleText( { text: "A string: <b>shown as it is</b>" } ),
		new SimpleText( { text: unsafe`Some html: <b>bold</b>, <code>code</code>, and a value escaped: <b>${name}</b>` } ),
	] } );
}

/** @demo Alignment — align puts the text on the left, in the center or on the right of its box. */
export function alignment( ) {
	return new VBox( { cls: "aligned-text", content: [
		new SimpleText( { width: 320, align: "left", text: "On the left" } ),
		new SimpleText( { width: 320, align: "center", text: "In the center" } ),
		new SimpleText( { width: 320, align: "right", text: "On the right" } ),
	] } );
}

/** @demo setText — setText changes the text of a SimpleText already shown. */
export function setText( ) {
	let count = 0;
	const text = new SimpleText( { text: "No message yet" } );

	return new HBox( { content: [
		new Button( { label: "New message", click: ( ) => {
			count++;
			text.setText( `${count} new message${count > 1 ? "s" : ""}` );
		} } ),
		text,
	] } );
}

const page: DemoComponent = {
	name: "SimpleText",
	category: "Display components",
	description: "A text alone, without icon: lighter than a Label, it goes on several lines when it is too long.",
	usage: {
		create: ( props ) => new SimpleText( { ...props, width: 300 } ),
		extra: "width: 300",
		props: { text: "A simple text, that wraps when it is longer than its box.", align: "" },
		controls: [
			{ name: "text", type: "string" },
			{ name: "align", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "left", text: "left" },
				{ id: "center", text: "center" },
				{ id: "right", text: "right" },
			] },
		],
	},
	demos: [ paragraph, html, alignment, setText ],
};

export default page;
