/**
 * ColorInput: the page of the gallery
 */

import { Button, ColorInput, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Picker and swatches — A click on the swatch opens a ColorPicker; swatches are the colors offered under its sliders. */
export function picker( ) {
	return new ColorInput( { width: 260, color: "#2e7d32", format: "hex", picker: true, swatches: [
		"#c62828", "#ef6c00", "#f9a825", "#2e7d32", "#1565c0", "#6a1b9a",
	] } );
}

/** @demo Formats — The field writes the color in rgb (the default) or in hex; a color that is not opaque gets its alpha. */
export function formats( ) {
	return new VBox( { content: [
		new ColorInput( { width: 260, color: "#1565c0", format: "rgb" } ),
		new ColorInput( { width: 260, color: "#1565c0", format: "hex" } ),
		new ColorInput( { width: 260, color: "rgba(21, 101, 192, 0.5)", format: "hex" } ),
	] } );
}

/** @demo No color — nullable: the field may be emptied, it then has no color; placeholder is the text of the empty field. */
export function noColor( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new ColorInput( { width: 260, color: null, nullable: true, picker: true, placeholder: "no color", change: ( ev ) => {
			label.setText( `value: ${ev.value}` );
		} } ),
		label,
	] } );
}

/** @demo Change and setColor — change gives the color the user typed or picked ("#rrggbb"); setColor writes one, without a change. */
export function changeColor( ) {
	const label = new Label( { text: "" } );
	const input = new ColorInput( { width: 260, color: "#ef6c00", format: "hex", alpha: false, picker: true, change: ( ev ) => {
		label.setText( `change: ${ev.value}` );
	} } );

	return new VBox( { content: [
		input,
		new HBox( { content: [
			new Button( { label: "Red", cls: "outline", click: ( ) => input.setColor( "#c62828" ) } ),
			new Button( { label: "Blue", cls: "outline", click: ( ) => input.setColor( "#1565c0" ) } ),
			new Button( { label: "getValue", click: ( ) => label.setText( `getValue: ${input.getValue( )}` ) } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "ColorInput",
	category: "Input components",
	description: "A color field: a swatch and its text (rgb or hex), with a ColorPicker a click away.",
	usage: {
		create: ( props ) => new ColorInput( { ...props } ),
		props: { color: "#569cd6", format: "rgb", picker: true, nullable: false, alpha: true, placeholder: "", width: 260 },
		controls: [
			{ name: "color", type: "color" },
			{ name: "format", type: "options", options: [
				{ id: "rgb", text: "rgb" },
				{ id: "hex", text: "hex" },
			] },
			{ name: "picker", type: "boolean" },
			{ name: "nullable", type: "boolean" },
			{ name: "alpha", type: "boolean", default: true },
			{ name: "placeholder", type: "string" },
			{ name: "width", type: "number", min: 160, max: 480, step: 20, live: true },
		],
	},
	demos: [ picker, formats, noColor, changeColor ],
};

export default page;
