/**
 * TextEdit: the page of the gallery
 */

import { Button, Combobox, Form, HBox, Label, TextArea, TextEdit, VBox } from 'x4js';
import { icon_close, icon_search } from '../icons';
import { DemoComponent } from '../types';

import "./textedit.scss";

/** @demo A form — Fields of several types; the same labelWidth lines up their labels. */
export function form( ) {
	return new VBox( { width: 420, content: [
		new TextEdit( { label: "Name", labelWidth: 110, placeholder: "Your name" } ),
		new TextEdit( { label: "Email", labelWidth: 110, type: "email", placeholder: "you@example.com" } ),
		new TextEdit( { label: "Age", labelWidth: 110, type: "number", value: 30, min: 0, max: 120 } ),
		new TextEdit( { label: "Birth date", labelWidth: 110, type: "date" } ),
		new TextEdit( { label: "Password", labelWidth: 110, type: "password", required: true } ),
	] } );
}

/** @demo Label above — The class label-top puts the label above its field, smaller, darker while the field has the focus: on a field, or on a box that holds fields (a Form, the main view: all the application). It works for TextEdit, AutoComplete, Combobox and TextArea; labelWidth is not used. */
export function labelTop( ) {
	return new HBox( { content: [
		new Form( { cls: "label-top", flex: false, width: 280, content: [
			new TextEdit( { label: "Name", placeholder: "Your name", required: true } ),
			new TextEdit( { label: "Email", type: "email", placeholder: "you@example.com" } ),
			new Combobox( { label: "Country", items: [ { id: 1, text: "France" }, { id: 2, text: "Suisse" }, { id: 3, text: "Belgique" } ] } ),
			new TextArea( { label: "Comment", placeholder: "A few words..." } ),
		] } ),
		new VBox( { width: 280, content: [
			new TextEdit( { label: "On the left", placeholder: "default" } ),
			new TextEdit( { cls: "label-top", label: "Above, on this field only", placeholder: "label-top" } ),
		] } ),
	] } );
}

/** @demo Gadgets — inputGadgets puts buttons in the field, after the input: here a search and a clear button. */
export function gadgets( ) {
	const result = new Label( { text: "" } );

	const search: TextEdit = new TextEdit( { label: "Search", labelWidth: 70, width: 360, placeholder: "a city", inputGadgets: [
		new Button( { icon: icon_search, tooltip: "Search", click: ( ) => result.setText( `searching "${search.getValue( )}"` ) } ),
		new Button( { icon: icon_close, tooltip: "Clear", click: ( ) => search.setValue( "" ) } ),
	] } );

	return new VBox( { content: [ search, result ] } );
}

/** @demo Reading the value — getValue reads the text, setValue writes it; change comes at each key, as for an Input. */
export function values( ) {
	const result = new Label( { text: "" } );
	const city = new TextEdit( { label: "City", labelWidth: 70, width: 320, value: "Grenoble", change: ( ev ) => result.setText( `change: ${ev.value}` ) } );

	return new HBox( { content: [
		city,
		new Button( { label: "getValue", click: ( ) => result.setText( `getValue: ${city.getValue( )}` ) } ),
		new Button( { label: "setValue", cls: "outline", click: ( ) => city.setValue( "Lyon" ) } ),
		result,
	] } );
}

/** @demo In a Form — With a name, the field is read by getValues; validate() returns null while a required field is empty. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, width: 400, content: [
		new TextEdit( { label: "First name", labelWidth: 110, name: "first", required: true } ),
		new TextEdit( { label: "Last name", labelWidth: 110, name: "last", value: "Doe" } ),
	] } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "validate", click: ( ) => result.setText( JSON.stringify( form.validate( ) ) ) } ),
			result,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "TextEdit",
	category: "Input components",
	description: "A label and an input on a line: the field of a form. It takes the props of an Input (text, email, password, number, date, time) and its label.",
	usage: {
		create: ( props ) => new TextEdit( props ),
		props: { label: "Name", type: "text", placeholder: "Your name", labelWidth: 100, width: 360, cls: "", required: false, readonly: false, disabled: false },
		controls: [
			{ name: "label", type: "string" },
			{ name: "type", type: "options", options: [
				{ id: "text", text: "text" },
				{ id: "email", text: "email" },
				{ id: "password", text: "password" },
				{ id: "number", text: "number" },
				{ id: "date", text: "date" },
				{ id: "time", text: "time" },
			] },
			{ name: "placeholder", type: "string" },
			{ name: "labelWidth", type: "number", min: 40, max: 200, step: 10, live: true },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "label-top", text: "label-top" },
			] },
			{ name: "required", type: "boolean" },
			{ name: "readonly", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ form, labelTop, gadgets, values, inForm ],
};

export default page;
