/**
 * Calendar: the page of the gallery
 */

import { Button, Calendar, formatIntlDate, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo Change — A click on a day fires change, its value the Date chosen. The month and the year open a menu. */
export function change( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Calendar( { width: 340, height: 280, change: ( ev ) => label.setText( `change: ${formatIntlDate( ev.value, "D/M/Y" )}` ) } ),
		label,
	] } );
}

/** @demo Limits — The days out of minDate and maxDate are shown, and cannot be chosen: here the next 30 days only. */
export function limits( ) {
	const today = new Date( );
	const last = new Date( );
	last.setDate( today.getDate( ) + 30 );

	return new Calendar( { width: 340, height: 280, date: today, minDate: today, maxDate: last } );
}

/** @demo setDate and getDate — The code moves the calendar to a date; getDate gives a copy of the one chosen. */
export function fromCode( ) {
	const label = new Label( { text: "" } );
	const calendar = new Calendar( { width: 340, height: 280, date: new Date( 2026, 0, 15 ) } );

	return new HBox( { content: [
		calendar,
		new VBox( { content: [
			new Button( { label: "Today", cls: "outline", click: ( ) => calendar.setDate( new Date( ) ) } ),
			new Button( { label: "Next week", cls: "outline", click: ( ) => {
				const date = calendar.getDate( );
				date.setDate( date.getDate( ) + 7 );
				calendar.setDate( date );
			} } ),
			new Button( { label: "getDate", click: ( ) => label.setText( formatIntlDate( calendar.getDate( ), "J d O Y" ) ) } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Calendar",
	category: "Sizers / viewport / misc",
	description: "A month to choose a day from, with the week numbers; the month and the year can be changed.",
	usage: {
		create: ( props ) => new Calendar( { ...props, date: new Date( 2026, 9, 21 ) } ),
		extra: "date: new Date( 2026, 9, 21 )",
		props: { width: 340, height: 280, disabled: false },
		controls: [
			{ name: "width", type: "number", min: 320, max: 480, step: 20, live: true },
			{ name: "height", type: "number", min: 200, max: 400, step: 20, live: true },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ change, limits, fromCode ],
};

export default page;
