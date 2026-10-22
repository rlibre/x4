/**
 * Rating: the page of the gallery
 */

import { Button, Form, HBox, Label, Rating, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./rating.scss";

/** @demo Change — A click lights the stars up to the one clicked; the star of the value clicked again gives 0. change gives the value. */
export function change( ) {
	const label = new Label( { text: "value: 2" } );

	return new HBox( { content: [
		new Rating( { value: 2, change: ( ev ) => label.setText( `value: ${ev.value}` ) } ),
		label,
	] } );
}

/** @demo Steps — steps: the count of stars, 5 when missing. setValue changes the value; it fires no change. */
export function steps( ) {
	const rating = new Rating( { steps: 10, value: 7 } );

	return new HBox( { content: [
		rating,
		new Button( { label: "setValue( 3 )", cls: "outline", click: ( ) => rating.setValue( 3 ) } ),
	] } );
}

/** @demo Shape — icon: another shape than the star; its svg takes the color of the text (currentColor). */
export function shape( ) {
	const heart = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21l-1.5-1.4C5 14.6 2 11.9 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.4-3 6.1-8.5 11.1L12 21z"/></svg>`;

	return new Rating( { cls: "hearts", icon: heart, value: 4 } );
}

/** @demo In a form — With a name, a Form reads the value of the rating as a number. */
export function inForm( ) {
	const values = new Label( { text: "" } );
	const form = new Form( { cls: "ratings", content: [
		new HBox( { content: [ new Label( { text: "Food", width: 80 } ), new Rating( { name: "food", value: 4 } ) ] } ),
		new HBox( { content: [ new Label( { text: "Service", width: 80 } ), new Rating( { name: "service", value: 3 } ) ] } ),
	] } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => values.setText( JSON.stringify( form.getValues( ) ) ) } ),
			values,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Rating",
	category: "Display components",
	description: "A row of stars, the first ones lit: a score the user gives with a click, or shows.",
	usage: {
		create: ( props ) => new Rating( props ),
		props: { value: 3, steps: 5 },
		controls: [
			{ name: "value", type: "number", min: 0, max: 10, step: 1, live: true },
			{ name: "steps", type: "number", min: 1, max: 10, step: 1, live: true },
		],
	},
	demos: [ change, steps, shape, inForm ],
};

export default page;
