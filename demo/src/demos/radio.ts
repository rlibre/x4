/**
 * Radio: the page of the gallery
 */

import { Button, Form, HBox, Label, Radio, VBox } from 'x4js';
import { icon_file, icon_folder, icon_image } from '../icons';
import { DemoComponent } from '../types';

import "./radio.scss";

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

/** @demo Icons — A radio may show an icon before its label; with cls: "button" it is a button, the one checked marked (Tab and the arrows still go from one to the other). */
export function icons( ) {
	return new VBox( { cls: "radio-icons", content: [
		new HBox( { content: [
			new Radio( { label: "Files", icon: icon_file, name: "view", value: "files", checked: true } ),
			new Radio( { label: "Folders", icon: icon_folder, name: "view", value: "folders" } ),
			new Radio( { label: "Images", icon: icon_image, name: "view", value: "images" } ),
		] } ),
		new HBox( { content: [
			new Radio( { cls: "button", label: "Files", icon: icon_file, name: "view2", value: "files", checked: true } ),
			new Radio( { cls: "button", label: "Folders", icon: icon_folder, name: "view2", value: "folders" } ),
			new Radio( { cls: "button", label: "Images", icon: icon_image, name: "view2", value: "images" } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Radio",
	category: "Input components",
	description: "One choice among several: the radios with the same name are a group, a single one of them is checked.",
	usage: {
		// the radio of the props, and two more of its group (its name, its class): a choice among three
		create: ( props ) => new HBox( { content: [
			new Radio( props ),
			new Radio( { cls: props.cls, label: "Medium", name: props.name, value: "m" } ),
			new Radio( { cls: props.cls, label: "Large", name: props.name, value: "l" } ),
		] } ),
		props: { label: "Small", name: "size", value: "s", checked: true, cls: "", disabled: false },
		controls: [
			{ name: "label", type: "string" },
			{ name: "name", type: "string" },
			{ name: "value", type: "string" },
			{ name: "checked", type: "boolean" },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "button", text: "button" },
				{ id: "button outline", text: "button outline" },
				{ id: "square", text: "square" },
			] },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ group, checkValue, inForm, icons ],
};

export default page;
