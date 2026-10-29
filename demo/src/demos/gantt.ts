/**
 * Gantt: the page of the gallery
 */

import { Button, Checkbox, HBox, Label, Select, VBox, formatDate } from 'x4js';
import { Gantt, GanttScale, GanttTask } from 'x4js/gantt';
import { DemoComponent } from '../types';

// a day from today, at midnight (or at an hour): the project stays around the day the page is opened
function day( offset: number, hours = 0 ) {
	const d = new Date( );
	return new Date( d.getFullYear( ), d.getMonth( ), d.getDate( ) + offset, hours );
}

// a project around today: three groups (one closed), milestones, a task in hours (Review); a new one
// for each Gantt, which writes the changes in its tasks
function project( ): GanttTask[] {
	return [
		{ id: "spec", title: "Specification", color: "#43a047", children: [
			{ id: "needs", title: "Needs", start: day( -10 ), end: day( -6 ), progress: 100 },
			{ id: "design", title: "Design", start: day( -5 ), end: day( -1 ), progress: 80, deps: [ "needs" ] },
			{ id: "review", title: "Review", start: day( 0, 14 ), end: day( 0, 17 ), deps: [ "design" ], tooltip: "With the client, <b>room B</b>" },
			{ id: "spec-ok", title: "Specification approved", start: day( 1 ), milestone: true, deps: [ "review" ] },
		] },
		{ id: "dev", title: "Development", color: "#fb8c00", children: [
			{ id: "core", title: "Core", start: day( 2 ), end: day( 12 ), progress: 30, deps: [ "spec-ok" ] },
			{ id: "api", title: "Server API", start: day( 4 ), end: day( 9 ), progress: 50, deps: [ "spec-ok" ] },
			{ id: "ui", title: "User interface", start: day( 6 ), end: day( 18 ), progress: 10, deps: [ "api" ] },
		] },
		{ id: "tests", title: "Tests", color: "#8e24aa", children: [
			{ id: "unit", title: "Unit tests", start: day( 10 ), end: day( 20 ), deps: [ "core" ] },
			{ id: "beta", title: "Beta", start: day( 21 ), end: day( 30 ), deps: [ "ui", "unit" ] },
		] },
		{ id: "doc", title: "Documentation", open: false, children: [
			{ id: "guide", title: "Guide", start: day( 14 ), end: day( 24 ) },
			{ id: "api-doc", title: "API reference", start: day( 16 ), end: day( 26 ) },
		] },
		{ id: "release", title: "Release", start: day( 31 ), milestone: true, deps: [ "beta" ] },
	];
}

/** @demo A project — Groups and their tasks, milestones, deps drawn as arrows; columns are the list on the left. The pointer moves a bar, stretches it by its ends, its progress by the mark under it: change tells it before it is written in the task. */
export function tasks( ) {
	const result = new Label( { text: "Move a bar" } );

	return new VBox( { content: [
		new Gantt( { width: "100%", height: 360, tasks: project( ),
			columns: [
				{ id: "title", width: 180 },
				{ id: "start", width: 100 },
				{ id: "end", width: 100 },
			],
			click: ( ev ) => result.setText( "click: " + ( ev.context as GanttTask ).title ),
			change: ( ev ) => result.setText( `change: ${ev.task.title}, ${formatDate( ev.start )} - ${formatDate( ev.end )}, ${ev.progress} %` ),
		} ),
		result,
	] } );
}

/** @demo Scales — scale is the width of a day: hours, days, weeks or months. ctrl+wheel on the chart zooms, the day under the pointer stays: scaleChange tells the scale it took. scrollToDate brings a day in the middle. */
export function scales( ) {
	const scale = new Select( { value: "day", change: ( ev ) => gantt.setScale( ev.value as GanttScale ), items: [
		{ id: "hour", text: "Hours" },
		{ id: "day", text: "Days" },
		{ id: "week", text: "Weeks" },
		{ id: "month", text: "Months" },
	] } );

	const gantt = new Gantt( { width: "100%", height: 300, tasks: project( ),
		scaleChange: ( ev ) => scale.setValue( ev.scale ),
	} );

	return new VBox( { content: [
		new HBox( { content: [
			scale,
			new Button( { label: "Today", cls: "outline", click: ( ) => gantt.scrollToDate( new Date( ) ) } ),
		] } ),
		gantt,
	] } );
}

/** @demo Colors and tooltips — color is the bar of a task: a group gives its own to its tasks that have none, a task may have another one; without color, the theme. tooltip is shown over the bar. */
export function colors( ) {
	return new Gantt( { width: "100%", height: 230, tasks: [
		{ id: "dev", title: "Development", color: "#fb8c00", children: [
			{ id: "core", title: "Core", start: day( 0 ), end: day( 8 ), progress: 30, tooltip: "The engine: <b>2 developers</b>" },
			{ id: "api", title: "Server API", start: day( 2 ), end: day( 7 ), progress: 50 },
			{ id: "ui", title: "User interface", start: day( 4 ), end: day( 14 ), color: "#e53935", deps: [ "api" ] },
		] },
		{ id: "doc", title: "Documentation", children: [
			{ id: "guide", title: "Guide", start: day( 6 ), end: day( 12 ) },
		] },
	] } );
}

/** @demo Read only, disabled — setReadOnly( true ): no bar is moved. enable( false ): faded, as a Box. */
export function readOnly( ) {
	const gantt = new Gantt( { width: "100%", height: 300, tasks: project( ) } );

	return new VBox( { content: [
		new HBox( { content: [
			new Checkbox( { label: "Read only", change: ( ev ) => gantt.setReadOnly( ev.value ) } ),
			new Checkbox( { label: "Disabled", change: ( ev ) => gantt.enable( !ev.value ) } ),
		] } ),
		gantt,
	] } );
}

const page: DemoComponent = {
	name: "Gantt",
	category: "Add-ons",
	description: "Tasks on a calendar: their list on the left, a tree of groups, their bars on the right, with milestones and arrows between them. The pointer moves a bar, stretches it, changes its progress; ctrl+wheel zooms. Not in x4js: it is imported from x4js/gantt.",
	imports: [ "Gantt", "GanttTask" ],
	module: "x4js/gantt",
	expand: true,
	usage: {
		create: ( props ) => new Gantt( { ...props, width: "100%", height: 300, tasks: project( ) } ),
		extra: "tasks",
		props: { scale: "day", rowHeight: 32, readonly: false },
		controls: [
			{ name: "scale", type: "options", default: "day", options: [
				{ id: "hour", text: "hour" },
				{ id: "day", text: "day" },
				{ id: "week", text: "week" },
				{ id: "month", text: "month" },
			] },
			{ name: "rowHeight", type: "number", min: 24, max: 48, step: 4, live: true, default: 32 },
			{ name: "readonly", type: "boolean" },
		],
	},
	demos: [ tasks, scales, colors, readOnly ],
};

export default page;
