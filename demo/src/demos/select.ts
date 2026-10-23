/**
 * Select: the page of the gallery
 */

import { Button, Form, HBox, Label, ListItem, Select, VBox } from 'x4js';
import { DemoComponent } from '../types';

// the items of the configurator
const languages: ListItem[] = [
	{ id: "fr", text: "French" },
	{ id: "en", text: "English" },
	{ id: "de", text: "German" },
	{ id: "es", text: "Spanish" },
];

/** @demo Change — value is the id of the item selected; change gives the id the user chose. */
export function change( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Select( { width: 180, value: "en", items: [
			{ id: "fr", text: "French" },
			{ id: "en", text: "English" },
			{ id: "de", text: "German" },
		], change: ( ev ) => label.setText( `change: ${ev.value}` ) } ),
		label,
	] } );
}

/** @demo Multiple — With multiple, Ctrl+click picks several items; getSelValues and setSelValues read and write them. */
export function multiple( ) {
	const label = new Label( { text: "" } );
	const select = new Select( { width: 180, multiple: true, items: [
		{ id: 1, text: "Monday" },
		{ id: 2, text: "Tuesday" },
		{ id: 3, text: "Wednesday" },
		{ id: 4, text: "Thursday" },
		{ id: 5, text: "Friday" },
	] } );

	return new HBox( { content: [
		select,
		new VBox( { content: [
			new Button( { label: "getSelValues", click: ( ) => label.setText( JSON.stringify( select.getSelValues( ) ) ) } ),
			new Button( { label: "All week days", cls: "outline", click: ( ) => select.setSelValues( [ 1, 2, 3, 4, 5 ] ) } ),
			label,
		] } ),
	] } );
}

/** @demo Linked lists — setItems gives a select new items: the cities follow the country. */
export function linked( ) {
	const cities = new Select( { width: 180, items: [
		{ id: "paris", text: "Paris" },
		{ id: "lyon", text: "Lyon" },
	] } );

	return new HBox( { content: [
		new Select( { width: 180, value: "fr", items: [
			{ id: "fr", text: "France" },
			{ id: "de", text: "Germany" },
		], change: ( ev ) => {
			if( ev.value == "fr" ) {
				cities.setItems( [ { id: "paris", text: "Paris" }, { id: "lyon", text: "Lyon" } ] );
			}
			else {
				cities.setItems( [ { id: "berlin", text: "Berlin" }, { id: "munich", text: "Munich" } ] );
			}
		} } ),
		cities,
	] } );
}

/** @demo In a Form — With a name, Form.getValues reads the id selected (an array with multiple). */
export function inForm( ) {
	const values = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, content: [
		new Select( { name: "size", width: 200, value: "m", items: [
			{ id: "s", text: "Small" },
			{ id: "m", text: "Medium" },
			{ id: "l", text: "Large" },
		] } ),
		new Select( { name: "toppings", width: 200, multiple: true, items: [
			{ id: "cheese", text: "Cheese" },
			{ id: "ham", text: "Ham" },
			{ id: "olives", text: "Olives" },
		] } ),
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
	name: "Select",
	category: "Input components",
	description: "The native select of the browser: one item, or several with multiple. Its value is the id of the item.",
	usage: {
		create: ( props ) => new Select( { ...props, items: languages } ),
		extra: "items: languages",
		props: { value: "en", multiple: false, required: false, disabled: false, width: 200 },
		controls: [
			{ name: "value", type: "options", options: [
				{ id: "", text: "none" },
				{ id: "fr", text: "fr" },
				{ id: "en", text: "en" },
				{ id: "de", text: "de" },
				{ id: "es", text: "es" },
			] },
			{ name: "multiple", type: "boolean" },
			{ name: "required", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 100, max: 400, step: 20, live: true },
		],
	},
	demos: [ change, multiple, linked, inForm ],
};

export default page;
