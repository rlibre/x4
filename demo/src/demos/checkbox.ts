/**
 * Checkbox: the page of the gallery
 */

import { Button, Checkbox, Form, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Change — change gives the new state in ev.value. */
export function change( ) {
	const state = new Label( { text: "" } );

	return new HBox( { content: [
		new Checkbox( { label: "Send me the news", change: ( ev ) => state.setText( `checked: ${ev.value}` ) } ),
		state,
	] } );
}

/** @demo From the code — setCheck sets the state, toggle inverts it, getCheck reads it; none of them fires change. */
export function fromCode( ) {
	const bread = new Checkbox( { label: "Bread", checked: true } );
	const milk = new Checkbox( { label: "Milk" } );
	const eggs = new Checkbox( { label: "Eggs" } );
	const result = new Label( { text: "" } );

	return new VBox( { content: [
		new HBox( { content: [ bread, milk, eggs ] } ),
		new HBox( { content: [
			new Button( { label: "All", click: ( ) => {
				bread.setCheck( true );
				milk.setCheck( true );
				eggs.setCheck( true );
			} } ),
			new Button( { label: "Toggle", cls: "outline", click: ( ) => {
				bread.toggle( );
				milk.toggle( );
				eggs.toggle( );
			} } ),
			new Button( { label: "getCheck", cls: "outline", click: ( ) => {
				result.setText( `bread ${bread.getCheck( )}, milk ${milk.getCheck( )}, eggs ${eggs.getCheck( )}` );
			} } ),
			result,
		] } ),
	] } );
}

/** @demo In a Form — Without a value the form reads a boolean; with one, the value when checked and null when not. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, content: [
		new Checkbox( { label: "Newsletter", name: "news", checked: true } ),
		new Checkbox( { label: "Pro plan", name: "plan", value: "pro" } ),
	] } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
			new Button( { label: "setValues", cls: "outline", click: ( ) => form.setValues( { news: false, plan: "pro" } ) } ),
			result,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Checkbox",
	category: "Input components",
	description: "A box to check, with its label: a click on either changes it.",
	usage: {
		create: ( props ) => new Checkbox( props ),
		props: { label: "Remember me", checked: false, disabled: false },
		controls: [
			{ name: "label", type: "string" },
			{ name: "checked", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ change, fromCode, inForm ],
};

export default page;
