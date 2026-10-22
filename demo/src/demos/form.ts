/**
 * Form: the page of the gallery
 */

import { Button, Checkbox, Form, HBox, Label, Select, TextEdit } from 'x4js';
import { DemoComponent } from '../types';

import "./form.scss";

// the fields of the configurator
function fields( ) {
	return [
		new TextEdit( { label: "Name", name: "name", value: "Ada" } ),
		new TextEdit( { label: "City", name: "city", value: "Lyon" } ),
		new Checkbox( { label: "Subscribe", name: "news" } ),
	];
}

/** @demo getValues — The fields that have a name are read together: an object, a key per name. */
export function getValues( ) {
	const result = new Label( { cls: "result", text: "" } );
	const form = new Form( { content: [
		new TextEdit( { label: "Name", name: "name", value: "Ada" } ),
		new TextEdit( { label: "Age", name: "age", type: "number", value: 36 } ),
		new Select( { name: "lang", value: "en", items: [
			{ id: "en", text: "English" },
			{ id: "fr", text: "French" },
		] } ),
		new Checkbox( { label: "Subscribe", name: "news", checked: true } ),
	] } );

	return new HBox( { content: [
		form,
		new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
		result,
	] } );
}

/** @demo setValues — An object writes its values in the fields of the same names; the others are left as they are. */
export function setValues( ) {
	const form = new Form( { content: [
		new TextEdit( { label: "Name", name: "name", value: "" } ),
		new TextEdit( { label: "Email", name: "email", type: "email", value: "" } ),
		new Checkbox( { label: "Admin", name: "admin" } ),
	] } );

	return new HBox( { content: [
		form,
		new Button( { label: "Load Ada", click: ( ) => form.setValues( { name: "Ada", email: "ada@example.com", admin: true } ) } ),
		new Button( { label: "Load Alan", cls: "outline", click: ( ) => form.setValues( { name: "Alan", email: "alan@example.com", admin: false } ) } ),
	] } );
}

/** @demo Required — validate() returns the values, or null when a required field is empty. */
export function required( ) {
	const result = new Label( { cls: "result", text: "" } );
	const form = new Form( { content: [
		new TextEdit( { label: "Name", name: "name", required: true, value: "" } ),
		new TextEdit( { label: "Note", name: "note", value: "" } ),
	] } );

	return new HBox( { content: [
		form,
		new Button( { label: "validate", click: ( ) => {
			const values = form.validate( );
			result.setText( values ? JSON.stringify( values ) : "The name is required." );
		} } ),
		result,
	] } );
}

/** @demo setValidator — A validator checks the values and may change them: they are written back in the fields. */
export function validator( ) {
	const result = new Label( { cls: "result", text: "" } );
	const form = new Form( { content: [
		new TextEdit( { label: "Code", name: "code", value: " ab-12 " } ),
		new TextEdit( { label: "Password", name: "pass", type: "password", value: "secret" } ),
		new TextEdit( { label: "Again", name: "again", type: "password", value: "secrets" } ),
	] } );

	// the code is trimmed and in upper case; the two passwords must be the same
	form.setValidator( ( values, is_valid ) => {
		values.code = values.code.trim( ).toUpperCase( );
		return is_valid && values.pass === values.again;
	} );

	return new HBox( { content: [
		form,
		new Button( { label: "validate", click: ( ) => {
			const values = form.validate( );
			result.setText( values ? JSON.stringify( values ) : "The passwords differ." );
		} } ),
		result,
	] } );
}

const page: DemoComponent = {
	name: "Form",
	category: "Forms",
	description: "A box that reads and writes together the fields it holds (those that have a name), and validates them.",
	usage: {
		create: ( props ) => new Form( { ...props, content: fields( ) } ),
		extra: "content: fields( )",
		props: { cls: "", autoComplete: false },
		controls: [
			{ name: "cls", type: "options", options: [
				{ id: "", text: "vertical" },
				{ id: "horizontal", text: "horizontal" },
			] },
			{ name: "autoComplete", type: "boolean" },
		],
	},
	demos: [ getValues, setValues, required, validator ],
};

export default page;
