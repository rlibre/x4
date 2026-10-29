/**
 * Planner: the page of the gallery
 */

import { Button, Checkbox, HBox, Label, Select, VBox, date_add_days, date_week_start, formatDate, formatDateTime, isMac } from 'x4js';
import { Planner, PlannerEvent, PlannerView } from 'x4js/planner';
import { icon_mail, icon_star, icon_user } from '../icons';
import { DemoComponent } from '../types';

// a day of this week (0: its monday), at an hour, or at midnight: a whole day
function day( offset: number, hours = 0, minutes = 0 ) {
	const monday = date_add_days( date_week_start( new Date( ) ), offset );
	return new Date( monday.getFullYear( ), monday.getMonth( ), monday.getDate( ), hours, minutes );
}

// a week around today: three events that overlap on tuesday, one before the working hours, one across
// midnight, whole days in the band; next week, five events on wednesday (the month shows "+n").
// A new one for each Planner, which writes the changes in its events
function thisWeek( ): PlannerEvent[] {
	return [
		{ id: 1, title: "Stand-up", start: day( 0, 9 ), end: day( 0, 9, 30 ) },
		{ id: 2, title: "Design review", start: day( 0, 10 ), end: day( 0, 12 ), color: "#2e9e48", icon: icon_user, text: "Room B\nWith the client", tooltip: "Design review, <b>room B</b>" },
		{ id: 3, title: "Lunch", start: day( 0, 12, 30 ), end: day( 0, 13, 30 ), color: "#ef7d00" },
		{ id: 4, title: "Workshop", start: day( 1, 14 ), end: day( 1, 17 ), color: "#9c27b0", icon: icon_user },
		{ id: 5, title: "Call", start: day( 1, 15 ), end: day( 1, 16 ), color: "#e53935", icon: icon_mail },
		{ id: 6, title: "1:1", start: day( 1, 15, 30 ), end: day( 1, 16 ) },
		{ id: 7, title: "Deploy", start: day( 2, 6 ), end: day( 2, 7, 30 ), color: "#546e7a", icon: icon_star },
		{ id: 8, title: "Night batch", start: day( 3, 22 ), end: day( 4, 2 ), color: "#3949ab" },
		{ id: 9, title: "Market", start: day( 5, 10 ), end: day( 5, 12 ), color: "#2e9e48" },
		{ id: 10, title: "Sprint 12", start: day( 0 ), end: day( 4 ), color: "#607d8b" },
		{ id: 11, title: "Conference", start: day( 2 ), end: day( 3 ), color: "#1e88e5", icon: icon_user },
		{ id: 12, title: "Day off", start: day( 4 ), color: "#b38f00" },
		{ id: 13, title: "Planning", start: day( 9, 9 ), end: day( 9, 10 ) },
		{ id: 14, title: "Review", start: day( 9, 10 ), end: day( 9, 11 ), color: "#2e9e48", icon: icon_user },
		{ id: 15, title: "Lunch", start: day( 9, 12 ), end: day( 9, 13 ), color: "#ef7d00" },
		{ id: 16, title: "Demo", start: day( 9, 14 ), end: day( 9, 15 ), color: "#9c27b0" },
		{ id: 17, title: "Retro", start: day( 9, 16 ), end: day( 9, 17 ), color: "#e53935" },
	];
}

/** @demo A week — The events with hours in their day, side by side when they overlap; the whole days in the band under the days. A drag moves an event, its top or its bottom stretches it: change tells it before it is written in the event. The events out of the view have a mark at the top or the bottom of their day. */
export function week( ) {
	const result = new Label( { text: "Move an event" } );

	return new VBox( { content: [
		new Planner( { width: "100%", height: 480, events: thisWeek( ),
			click: ( ev ) => result.setText( "click: " + ( ev.context as PlannerEvent ).title ),
			change: ( ev ) => result.setText( `change: ${ev.event.title}, ${formatDateTime( ev.start )} - ${formatDateTime( ev.end )}` ),
		} ),
		result,
	] } );
}

/** @demo Day, week, month — view, then next and prev go a day, a week or a month further; getRange gives the days shown. In the month, a click on a day opens its week: viewChange tells it. */
export function views( ) {
	const range = new Label( { text: "" } );
	const show = ( ) => {
		const { start, end } = planner.getRange( );
		range.setText( `${formatDate( start )} - ${formatDate( end )}` );
	};

	const view = new Select( { value: "month", change: ( ev ) => { planner.setView( ev.value as PlannerView ); show( ); }, items: [
		{ id: "day", text: "Day" },
		{ id: "week", text: "Week" },
		{ id: "month", text: "Month" },
	] } );

	const planner = new Planner( { width: "100%", height: 480, view: "month", events: thisWeek( ),
		viewChange: ( ev ) => { view.setValue( ev.view ); show( ); },
	} );

	show( );

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "◀", cls: "outline", click: ( ) => { planner.prev( ); show( ); } } ),
			new Button( { label: "Today", cls: "outline", click: ( ) => { planner.setDate( new Date( ) ); show( ); } } ),
			new Button( { label: "▶", cls: "outline", click: ( ) => { planner.next( ); show( ); } } ),
			view,
			range,
		] } ),
		planner,
	] } );
}

/** @demo Create, copy, delete — A drag on an empty place selects a range: select gives it, the application creates the event. ctrl+drag (option on a Mac) copies an event: copy gives its dates, the application adds it. A key on the event selected: addShortcut and getSelection. */
export function create( ) {
	const result = new Label( { text: "Select a range, then Delete" } );
	let events = thisWeek( );
	let next = 100;

	const add = ( event: PlannerEvent ) => {
		events = [ ...events, event ];
		planner.setEvents( events );
	};

	const planner = new Planner( { width: "100%", height: 480, events,
		select: ( ev ) => add( { id: next++, title: "New event", start: ev.start, end: ev.end } ),
		copy: ( ev ) => add( { ...ev.event, id: next++, start: ev.start, end: ev.end } ),
	} );

	// Backspace on a Mac too: its key "delete"
	planner.addShortcut( isMac ? [ "Delete", "Backspace" ] : "Delete", ( ) => {
		const event = events.find( e => e.id === planner.getSelection( ) );
		if( event ) {
			events = events.filter( e => e !== event );
			planner.setEvents( events );
			result.setText( "deleted: " + event.title );
		}
	} );

	return new VBox( { content: [ planner, result ] } );
}

/** @demo Options — The band of the whole days, the hours and the days off, the sub grid, the precision of the pointer: by their props, or by their setters. setReadOnly( true ): nothing created, moved, stretched nor copied; enable( false ): faded, as a Box. */
export function options( ) {
	const planner = new Planner( { width: "100%", height: 480, events: thisWeek( ) } );

	return new VBox( { content: [
		new HBox( { content: [
			new Checkbox( { label: "Band", checked: true, change: ( ev ) => planner.setBand( ev.value ) } ),
			new Checkbox( { label: "Off hours", checked: true, change: ( ev ) => planner.setShowOffHours( ev.value ) } ),
			new Checkbox( { label: "Off days", checked: true, change: ( ev ) => planner.setShowOffDays( ev.value ) } ),
			new Checkbox( { label: "Sub grid", change: ( ev ) => planner.setShowSubGrid( ev.value ) } ),
			new Select( { value: 15, change: ( ev ) => planner.setStep( ev.value as number ), items: [
				{ id: 10, text: "10 min" },
				{ id: 15, text: "15 min" },
				{ id: 60, text: "1 h" },
			] } ),
		] } ),
		new HBox( { content: [
			new Checkbox( { label: "Read only", change: ( ev ) => planner.setReadOnly( ev.value ) } ),
			new Checkbox( { label: "Disabled", change: ( ev ) => planner.enable( !ev.value ) } ),
		] } ),
		planner,
	] } );
}

const page: DemoComponent = {
	name: "Planner",
	category: "Add-ons",
	description: "Events by day, week or month, as an agenda: the events with hours side by side in their day, the whole days in a band. The pointer creates, moves, stretches and copies them. Not in x4js: it is imported from x4js/planner.",
	imports: [ "Planner", "PlannerEvent" ],
	module: "x4js/planner",
	expand: true,
	usage: {
		create: ( props ) => new Planner( { ...props, width: "100%", height: 420, events: thisWeek( ) } ),
		extra: "events",
		props: { view: "week", band: true, showOffDays: true, showOffHours: true, showSubGrid: false, step: 15, readonly: false },
		controls: [
			{ name: "view", type: "options", default: "week", options: [
				{ id: "day", text: "day" },
				{ id: "week", text: "week" },
				{ id: "month", text: "month" },
			] },
			{ name: "band", type: "boolean", default: true },
			{ name: "showOffDays", type: "boolean", default: true },
			{ name: "showOffHours", type: "boolean", default: true },
			{ name: "showSubGrid", type: "boolean" },
			{ name: "step", type: "number", min: 5, max: 60, step: 5, default: 15 },
			{ name: "readonly", type: "boolean" },
		],
	},
	demos: [ week, views, create, options ],
};

export default page;
