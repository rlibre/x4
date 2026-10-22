/**
 * Progress: the page of the gallery
 */

import { Button, HBox, Label, Progress, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./progress.scss";

/** @demo setValue — setValue moves the bar; the value is kept by the code, Progress has no getValue. */
export function setValue( ) {
	let value = 30;
	const progress = new Progress( { value, width: 300 } );
	const label = new Label( { text: "30%" } );

	const move = ( delta: number ) => {
		value = Math.max( 0, Math.min( 100, value + delta ) );
		progress.setValue( value );
		label.setText( `${value}%` );
	};

	return new VBox( { content: [
		progress,
		new HBox( { content: [
			new Button( { label: "-10", cls: "outline", click: ( ) => move( -10 ) } ),
			new Button( { label: "+10", cls: "outline", click: ( ) => move( 10 ) } ),
			label,
		] } ),
	] } );
}

/** @demo Range — min and max: the bar is empty at min, full at max. Here 6 files of 8. */
export function range( ) {
	return new VBox( { content: [
		new Label( { text: "6 files of 8" } ),
		new Progress( { min: 0, max: 8, value: 6, width: 300 } ),
	] } );
}

/** @demo Busy — The class indeterm stripes the bar and moves it, while the length of the work is not known. */
export function busy( ) {
	const progress = new Progress( { value: 100, width: 300 } );

	return new HBox( { content: [
		progress,
		new Button( { label: "Busy / idle", cls: "outline", click: ( ) => progress.toggleClass( "indeterm" ) } ),
	] } );
}

/** @demo Colors — A class of your own sets the variables of the bar, and its height. */
export function colors( ) {
	return new VBox( { cls: "bars", content: [
		new Progress( { value: 80, width: 300, cls: "success" } ),
		new Progress( { value: 45, width: 300, cls: "thick" } ),
	] } );
}

const page: DemoComponent = {
	name: "Progress",
	category: "Display components",
	description: "A bar that shows where a value is between a min and a max: the progress of a work, a quota.",
	usage: {
		create: ( props ) => new Progress( { ...props, width: 300 } ),
		extra: "width: 300",
		props: { value: 40, min: 0, max: 100 },
		controls: [
			{ name: "value", type: "number", min: 0, max: 100, step: 5, live: true },
			{ name: "min", type: "number", min: 0, max: 100, step: 10, live: true },
			{ name: "max", type: "number", min: 10, max: 200, step: 10, live: true },
		],
	},
	demos: [ setValue, range, busy, colors ],
};

export default page;
