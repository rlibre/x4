/**
 * Knob: the page of the gallery
 */

import { Button, Form, HBox, Knob, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';
import { icon_gear, icon_sun } from '../icons';

/** @demo Change — change comes when the user turns it: the pointer turns the dial around its center, the wheel while it has the focus, the arrows by step (Ctrl: 10 steps), Home and End go to min and max. Not when the code sets the value. */
export function change( ) {
	const result = new Label( { text: "value: 25" } );

	return new HBox( { content: [
		new Knob( { value: 25, label: "Volume", change: ( ev ) => result.setText( `value: ${ev.value}` ) } ),
		result,
	] } );
}

/** @demo Range and step — On a range, the arc goes from min (-135°) to max (+135°) and the knob stops there; the value stays on the step. size is the diameter of the dial. */
export function range( ) {
	const result = new Label( { text: "0 dB" } );

	return new HBox( { content: [
		new Knob( { min: -12, max: 12, step: 0.5, value: 0, size: 64, label: "Gain", change: ( ev ) => result.setText( `${ev.value} dB` ) } ),
		new Knob( { min: 0, max: 10, value: 7, label: "Bass" } ),
		new Knob( { min: 0, max: 10, value: 4, label: "Treble" } ),
		result,
	] } );
}

/** @demo Infinite — It turns without end: turn is the value of a whole turn (360 by default: the value is an angle). A double click sets it back to its first value. */
export function infinite( ) {
	const angle = new Label( { text: "angle: 0" } );
	const count = new Label( { text: "count: 5" } );

	return new HBox( { content: [
		new Knob( { infinite: true, icon: icon_gear, change: ( ev ) => angle.setText( `angle: ${ev.value}` ) } ),
		angle,
		new Knob( { infinite: true, turn: 20, value: 5, label: "Encoder", change: ( ev ) => count.setText( `count: ${ev.value}` ) } ),
		count,
	] } );
}

/** @demo Label and icon — label and icon are under the dial; setLabel and setIcon change them. Disabled, it takes the disabled colors. */
export function labels( ) {
	const knob = new Knob( { value: 60, label: "Brightness", icon: icon_sun } );

	return new HBox( { content: [
		knob,
		new Button( { label: "setLabel", cls: "outline", click: ( ) => knob.setLabel( "Light" ) } ),
		new Knob( { value: 40, label: "Disabled", disabled: true } ),
		new Knob( { infinite: true, value: 90, label: "Disabled", disabled: true } ),
	] } );
}

/** @demo In a Form — With a name, the form reads a number. */
export function inForm( ) {
	const result = new Label( { text: "" } );
	// flex: none: a Form grows (flex) and would get no height in a box that has none
	const form = new Form( { style: { flex: "none" }, content: new HBox( { content: [
		new Knob( { name: "gain", value: 10, label: "gain" } ),
		new Knob( { name: "pan", infinite: true, label: "pan" } ),
	] } ) } );

	return new VBox( { content: [
		form,
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => result.setText( JSON.stringify( form.getValues( ) ) ) } ),
			result,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Knob",
	category: "Input components",
	description: "A rotary button: a value on a range, on an arc of 270°, or a knob that turns without end. It is turned with the mouse, the wheel or the arrow keys.",
	usage: {
		create: ( props ) => new Knob( props ),
		props: { value: 40, min: 0, max: 100, step: 1, infinite: false, size: 48, label: "Volume", disabled: false },
		controls: [
			{ name: "value", type: "number", min: 0, max: 100, step: 1, live: true },
			{ name: "min", type: "number", step: 10, live: true },
			{ name: "max", type: "number", step: 10, live: true },
			{ name: "step", type: "number", min: 1, max: 50, step: 1, live: true },
			{ name: "infinite", type: "boolean" },
			{ name: "size", type: "number", min: 24, max: 120, step: 4, live: true },
			{ name: "label", type: "string" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ change, range, infinite, labels, inForm ],
};

export default page;
