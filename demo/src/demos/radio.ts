/**
 * Radio: the page of the gallery
 */

import { Button, Form, HBox, Label, Radio, VBox } from 'x4js';
import { icon_file, icon_folder, icon_image } from '../icons';
import { DemoComponent } from '../types';

/** @demo A group — The radios that have the same name are one group: checking one unchecks the others. change gives its value. */
export function group( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Radio( { label: "Apple", name: "fruit", value: "apple", checked: true, change: ( ev ) => result.setText( `value: ${ev.value}` ) } ),
		new Radio( { label: "Banana", name: "fruit", value: "banana", change: ( ev ) => result.setText( `value: ${ev.value}` ) } ),
		new Radio( { label: "Cherry", name: "fruit", value: "cherry", change: ( ev ) => result.setText( `value: ${ev.value}` ) } ),
		result,
	] } );
}

/** @demo checkValue — Checks the radio of a value in the group; it can be called on any radio of the group. */
export function checkValue( ) {
	const slow = new Radio( { label: "Slow", name: "speed", value: "slow" } );

	return new VBox( { content: [
		new HBox( { content: [
			slow,
			new Radio( { label: "Normal", name: "speed", value: "normal", checked: true } ),
			new Radio( { label: "Fast", name: "speed", value: "fast" } ),
		] } ),
		new HBox( { content: [
			new Button( { label: "Slow", cls: "outline", click: ( ) => slow.checkValue( "slow" ) } ),
			new Button( { label: "Fast", cls: "outline", click: ( ) => slow.checkValue( "fast" ) } ),
		] } ),
	] } );
}

/** @demo In a Form — The form reads the value of the radio checked in the group, and checks the one of a value. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, content: [
		new HBox( { content: [
			new Radio( { label: "Free", name: "plan", value: "free", checked: true } ),
			new Radio( { label: "Pro", name: "plan", value: "pro" } ),
			new Radio( { label: "Team", name: "plan", value: "team" } ),
		] } ),
	] } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
			new Button( { label: "setValues", cls: "outline", click: ( ) => form.setValues( { plan: "team" } ) } ),
			result,
		] } ),
	] } );
}

/** @demo Icons — A radio may show an icon before its label. */
export function icons( ) {
	return new HBox( { content: [
		new Radio( { label: "Files", icon: icon_file, name: "view", value: "files", checked: true } ),
		new Radio( { label: "Folders", icon: icon_folder, name: "view", value: "folders" } ),
		new Radio( { label: "Images", icon: icon_image, name: "view", value: "images" } ),
	] } );
}

const page: DemoComponent = {
	name: "Radio",
	category: "Input components",
	description: "One choice among several: the radios with the same name are a group, a single one of them is checked.",
	usage: {
		// the radio of the props, and two more of its group (its name): a choice among three
		create: ( props ) => new HBox( { content: [
			new Radio( props ),
			new Radio( { label: "Medium", name: props.name, value: "m" } ),
			new Radio( { label: "Large", name: props.name, value: "l" } ),
		] } ),
		props: { label: "Small", name: "size", value: "s", checked: true, disabled: false },
		controls: [
			{ name: "label", type: "string" },
			{ name: "name", type: "string" },
			{ name: "value", type: "string" },
			{ name: "checked", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ group, checkValue, inForm, icons ],
};

export default page;
