/**
 * Switch: the page of the gallery
 */

import { Button, Form, HBox, Label, Switch, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Several switches — On or off; a click on the switch or on its label changes it. */
export function several( ) {
	return new VBox( { content: [
		new Switch( { label: "Wi-Fi", checked: true } ),
		new Switch( { label: "Bluetooth" } ),
		new Switch( { label: "Airplane mode", disabled: true } ),
	] } );
}

/** @demo In a Form — With a name, the form reads a boolean; with a value, the value when on and null when off. A Switch has no event of its own: the change event of its input goes up to the form. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form: Form = new Form( {
		style: { flex: "none" },
		dom_events: { change: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) },
		content: [
			new Switch( { label: "Dark mode", name: "dark" } ),
			new Switch( { label: "Sync", name: "sync", value: "daily", checked: true } ),
		],
	} );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
			new Button( { label: "setValues", cls: "outline", click: ( ) => form.setValues( { dark: true, sync: null } ) } ),
			result,
		] } ),
	] } );
}

/** @demo Square, danger — The class `square` gives the track and the thumb corners barely rounded; the class `danger` gives the colour of an alert when on (`--switch-danger`). */
export function square( ) {
	return new VBox( { content: [
		new Switch( { label: "Wi-Fi", cls: "square", checked: true } ),
		new Switch( { label: "Bluetooth", cls: "square" } ),
		new Switch( { label: "Delete the files too", cls: "danger", checked: true } ),
		new Switch( { label: "Both", cls: "square danger", checked: true } ),
	] } );
}

const page: DemoComponent = {
	name: "Switch",
	category: "Input components",
	description: "An on/off switch with its label: a checkbox drawn as a switch. In a Form, with a name, it is read and written as a boolean.",
	usage: {
		create: ( props ) => new Switch( props ),
		props: { label: "Notifications", checked: true, disabled: false, cls: "" },
		controls: [
			{ name: "label", type: "string" },
			{ name: "checked", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "square", text: "square" },
				{ id: "danger", text: "danger" },
			] },
		],
	},
	demos: [ several, square, inForm ],
};

export default page;
