/**
 * Input: the page of the gallery
 */

import { Button, HBox, Input, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./input.scss";

/** @demo Types — The native field of each type: text, password, number with its min, max and step, date, time. */
export function types( ) {
	return new VBox( { cls: "input-types", content: [
		new HBox( { content: [ new Label( { text: "text" } ), new Input( { type: "text", placeholder: "Your name" } ) ] } ),
		new HBox( { content: [ new Label( { text: "password" } ), new Input( { type: "password", value: "secret" } ) ] } ),
		new HBox( { content: [ new Label( { text: "number" } ), new Input( { type: "number", value: 5, min: 0, max: 10, step: 1 } ) ] } ),
		new HBox( { content: [ new Label( { text: "date" } ), new Input( { type: "date", value: new Date( 2026, 9, 21 ) } ) ] } ),
		new HBox( { content: [ new Label( { text: "time" } ), new Input( { type: "time", value: "12:30" } ) ] } ),
	] } );
}

/** @demo Events — change comes at each key typed, with the text in ev.value; focus when the field gets or loses the focus. */
export function events( ) {
	const typed = new Label( { text: "Type something" } );
	const focus = new Label( { text: "" } );

	return new HBox( { content: [
		new Input( { type: "text", placeholder: "Type here",
			change: ( ev ) => typed.setText( `change: "${ev.value}"` ),
			focus: ( ev ) => focus.setText( ev.focus_out ? "focus: left" : "focus: in" ),
		} ),
		typed,
		focus,
	] } );
}

/** @demo Numbers — getNumValue reads a number; setNumValue writes one, with as many decimals as the step (-2). */
export function numbers( ) {
	const price = new Input( { type: "number", value: 2.5, min: 0, step: 0.25 } );
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		price,
		new Button( { label: "+ 1", click: ( ) => price.setNumValue( price.getNumValue( 0 ) + 1, -2 ) } ),
		new Button( { label: "Read", cls: "outline", click: ( ) => result.setText( `getNumValue: ${price.getNumValue( )}` ) } ),
		result,
	] } );
}

/** @demo Validation — required and pattern are checked by isValid() and by a Form; the browser marks the field while it is not valid. */
export function validation( ) {
	const zip = new Input( { type: "text", required: true, pattern: "[0-9]{5}", placeholder: "5 digits" } );
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		zip,
		new Button( { label: "isValid", click: ( ) => {
			// isValid checks required; the browser checks the pattern (validity)
			result.setText( zip.isValid( ) ? "required: ok" : "required: empty" );
		} } ),
		result,
	] } );
}

/** @demo Selection — selectAll, select( start, length ) and getSelection work on the text of the field. */
export function selection( ) {
	const field = new Input( { type: "text", value: "The quick brown fox" } );
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		field,
		new Button( { label: "Select \"quick\"", cls: "outline", click: ( ) => {
			field.focus( );
			field.select( 4, 5 );
		} } ),
		new Button( { label: "Select all", cls: "outline", click: ( ) => {
			field.focus( );
			field.selectAll( );
		} } ),
		new Button( { label: "getSelection", cls: "outline", click: ( ) => {
			const sel = field.getSelection( );
			result.setText( `start ${sel.start}, length ${sel.length}` );
		} } ),
		result,
	] } );
}

const page: DemoComponent = {
	name: "Input",
	category: "Input components",
	description: "The native <input> field, of any type: text, password, number, date, time, checkbox, range, file. Without a label: see TextEdit for a field with one.",
	usage: {
		create: ( props ) => new Input( props ),
		props: { type: "text", placeholder: "Type here", value: "", required: false, readonly: false, disabled: false },
		controls: [
			{ name: "type", type: "options", options: [
				{ id: "text", text: "text" },
				{ id: "email", text: "email" },
				{ id: "password", text: "password" },
				{ id: "number", text: "number" },
				{ id: "date", text: "date" },
				{ id: "time", text: "time" },
			] },
			{ name: "placeholder", type: "string" },
			{ name: "value", type: "string" },
			{ name: "required", type: "boolean" },
			{ name: "readonly", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ types, events, numbers, validation, selection ],
};

export default page;
