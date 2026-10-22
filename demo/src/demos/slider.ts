/**
 * Slider: the page of the gallery
 */

import { Button, Form, HBox, Label, Slider, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Change — change comes when the user moves the thumb (drag, arrows; Ctrl+arrow: 10 steps), not when the code sets the value. */
export function change( ) {
	const result = new Label( { text: "value: 30" } );

	return new HBox( { content: [
		new Slider( { width: 300, value: 30, min: 0, max: 100, change: ( ev ) => result.setText( `value: ${ev.value}` ) } ),
		result,
	] } );
}

/** @demo From the code — setValue keeps the value between min and max, on the step; setMin and setMax change the range. */
export function fromCode( ) {
	const volume = new Slider( { width: 300, value: 50, min: 0, max: 100, step: 10 } );

	return new VBox( { content: [
		volume,
		new HBox( { content: [
			new Button( { label: "0", cls: "outline", click: ( ) => volume.setValue( 0 ) } ),
			new Button( { label: "47 (step 10)", cls: "outline", click: ( ) => volume.setValue( 47 ) } ),
			new Button( { label: "150 (max 100)", cls: "outline", click: ( ) => volume.setValue( 150 ) } ),
			new Button( { label: "max 200", cls: "outline", click: ( ) => volume.setMax( 200 ) } ),
		] } ),
	] } );
}

/** @demo Vertical — vertical: the minimum at the bottom; it needs a height. */
export function vertical( ) {
	return new HBox( { content: [
		new Slider( { vertical: true, height: 140, value: 20, min: 0, max: 100 } ),
		new Slider( { vertical: true, height: 140, value: 60, min: 0, max: 100 } ),
		new Slider( { vertical: true, height: 140, value: 90, min: 0, max: 100 } ),
		new Slider( { vertical: true, height: 140, value: 40, min: 0, max: 100 } ),
	] } );
}

/** @demo In a Form — With a name, the form reads a number. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, content: [
		new Label( { text: "Brightness" } ),
		new Slider( { name: "brightness", width: 300, value: 70, min: 0, max: 100, step: 5 } ),
	] } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
			result,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Slider",
	category: "Input components",
	description: "A value between a minimum and a maximum, chosen by moving a thumb, with the mouse or the arrow keys.",
	usage: {
		create: ( props ) => new Slider( props ),
		props: { value: 40, min: 0, max: 100, step: 1, width: 300, disabled: false },
		controls: [
			{ name: "value", type: "number", min: 0, max: 100, step: 1, live: true },
			{ name: "min", type: "number", step: 10, live: true },
			{ name: "max", type: "number", step: 10, live: true },
			{ name: "step", type: "number", min: 1, max: 50, step: 1, live: true },
			{ name: "width", type: "number", min: 100, max: 560, step: 20, live: true },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ change, fromCode, vertical, inForm ],
};

export default page;
