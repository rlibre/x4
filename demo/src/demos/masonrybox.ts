/**
 * MasonryBox: the page of the gallery
 */

import { Button, HBox, MasonryBox, SimpleText, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./masonrybox.scss";

/** @demo Cards — Items of different heights fill the columns without holes; the class "content" is what is measured. */
export function cards( ) {
	return new MasonryBox( { items: [
		new SimpleText( { cls: "content card", text: "A line." } ),
		new SimpleText( { cls: "content card", text: "A few more words, to make this card a little higher than the first one." } ),
		new SimpleText( { cls: "content card", text: "This one has a text long enough to take several lines in its column: the cards beside it go on under the short ones, without leaving holes." } ),
		new SimpleText( { cls: "content card", text: "Two lines, maybe." } ),
		new SimpleText( { cls: "content card", text: "Not as long as the long one, but more than a line or two." } ),
		new SimpleText( { cls: "content card", text: "The end." } ),
	] } );
}

/** @demo Items changed — setItems puts new items; resizeAllItems gives each one its height again. */
export function setItems( ) {
	let count = 3;
	const box = new MasonryBox( { items: [
		new SimpleText( { cls: "content card", text: "A card." } ),
		new SimpleText( { cls: "content card", text: "A card with a longer text, on two lines or three." } ),
		new SimpleText( { cls: "content card", text: "A card." } ),
	] } );

	const make = ( ) => {
		const items = [];
		for( let i = 1; i <= count; i++ ) {
			items.push( new SimpleText( { cls: "content card", text: `Card ${i}: ` + "some words, ".repeat( 1 + i % 4 * 4 ) } ) );
		}
		return items;
	};

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Add a card", click: ( ) => {
				count++;
				box.setItems( make( ) );
				// setItems does not measure the new items: the box does it when its size changes
				box.resizeAllItems( );
			} } ),
		] } ),
		box,
	] } );
}

const page: DemoComponent = {
	name: "MasonryBox",
	category: "Layout containers",
	description: "A box that lays its items in columns of 250px at least, as many as its width holds, each item as high as its content (\"Pinterest\").",
	usage: {
		create: ( props ) => new MasonryBox( { ...props, items: [
			new SimpleText( { cls: "content card", text: "A card." } ),
			new SimpleText( { cls: "content card", text: "A card with a longer text, on two lines or three in its column." } ),
			new SimpleText( { cls: "content card", text: "Short." } ),
			new SimpleText( { cls: "content card", text: "A card with a text that is long enough to take a few lines more than the others." } ),
		] } ),
		extra: "items",
		props: { width: 560 },
		controls: [
			{ name: "width", type: "number", min: 260, max: 600, step: 20, live: true },
		],
	},
	demos: [ cards, setItems ],
};

export default page;
