/**
 * ColorPicker: the page of the gallery
 */

import { Button, ColorPicker, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Change — The saturation square, the hue and alpha sliders; change gives the color at each move, as "#rrggbb" (or "#rrggbbaa"). */
export function change( ) {
	const label = new Label( { text: "" } );
	const picker = new ColorPicker( { color: "#1565c0" } );
	picker.on( "change", ( ev ) => label.setText( `change: ${ev.value}` ) );

	return new HBox( { content: [ picker, label ] } );
}

/** @demo Swatches — Colors to pick with a click under the sliders; nullable adds a "no color" swatch, whose change has a null value. */
export function swatches( ) {
	const label = new Label( { text: "" } );
	const picker = new ColorPicker( { color: "#ef6c00", nullable: true, swatches: [
		"#c62828", "#ef6c00", "#f9a825", "#2e7d32", "#1565c0", "#6a1b9a",
	] } );
	picker.on( "change", ( ev ) => label.setText( `change: ${ev.value}` ) );

	return new HBox( { content: [ picker, label ] } );
}

/** @demo Opaque — alpha: false hides the alpha slider: the colors stay opaque. */
export function opaque( ) {
	return new ColorPicker( { color: "#2e7d32", alpha: false } );
}

/** @demo setColor and getColor — The code writes a color; getColor gives the current one (a Color, to copy to keep it). */
export function fromCode( ) {
	const label = new Label( { text: "" } );
	const picker = new ColorPicker( { color: "#6a1b9a" } );

	return new HBox( { content: [
		picker,
		new VBox( { content: [
			new Button( { label: "Red", cls: "outline", click: ( ) => picker.setColor( "#c62828" ) } ),
			new Button( { label: "Half transparent", cls: "outline", click: ( ) => picker.setColor( "rgba(21, 101, 192, 0.5)" ) } ),
			new Button( { label: "getColor", click: ( ) => label.setText( picker.getColor( ).toRgbString( true ) ) } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "ColorPicker",
	category: "Sizers / viewport / misc",
	description: "A color chooser: a saturation square, a hue slider, an alpha slider and swatches. ColorInput opens one.",
	usage: {
		create: ( props ) => new ColorPicker( { ...props } ),
		props: { color: "#569cd6", nullable: false, alpha: true, width: 240 },
		controls: [
			{ name: "color", type: "color" },
			{ name: "nullable", type: "boolean" },
			{ name: "alpha", type: "boolean", default: true },
			{ name: "width", type: "number", min: 180, max: 400, step: 20, live: true },
		],
	},
	demos: [ change, swatches, opaque, fromCode ],
};

export default page;
