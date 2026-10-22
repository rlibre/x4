/**
 * Timeline: the page of the gallery
 */

import { HBox, Label, Tag, Timeline, TimelineItem, VBox } from 'x4js';
import { icon_check, icon_edit, icon_file, icon_mail, icon_plus, icon_star, icon_user } from '../icons';
import { DemoComponent } from '../types';

import "./timeline.scss";

// the items of the configurator
function projectSteps( ): TimelineItem[] {
	const ago = ( min: number ) => new Date( Date.now( ) - min * 60000 );

	return [
		{ icon: icon_plus, title: "Project created", text: "From the template x4js", date: ago( 60 * 24 * 3 ), done: true },
		{ icon: icon_edit, title: "First page", text: "The form of the customer", date: ago( 60 * 5 ), done: true },
		{ icon: icon_check, title: "Review", text: "Asked to Alice" },
		{ icon: icon_star, title: "Release" },
	];
}

/** @demo Activity — Each event has an icon, a title, a sentence and a date written relative to now; done puts its mark in the accent. */
export function activity( ) {
	const ago = ( min: number ) => new Date( Date.now( ) - min * 60000 );

	return new Timeline( { width: 340, items: [
		{ icon: icon_plus, title: "New branch", text: "You've created new branch fix-notifications from master", date: ago( 120 ), done: true },
		{ icon: icon_edit, title: "Commits", text: "You've pushed 23 commits to fix-notifications branch", date: ago( 52 ), done: true },
		{ icon: icon_file, title: "Pull request", text: "You've submitted a pull request Fix incorrect notification message (#187)", date: ago( 34 ) },
		{ icon: icon_user, title: "Code review", text: "Robert left a code review on your pull request", date: ago( 12 ) },
	] } );
}

/** @demo Side by side — vertical: false puts the events on a line; without a date, no time is shown. */
export function horizontal( ) {
	return new Timeline( { vertical: false, width: 560, items: [
		{ icon: icon_check, title: "Ordered", text: "2 items", done: true },
		{ icon: icon_mail, title: "Paid", text: "By card", done: true },
		{ icon: icon_file, title: "Shipped", text: "Within 2 days" },
		{ icon: icon_star, title: "Delivered" },
	] } );
}

/** @demo Click — A click anywhere in an event fires click, with its item in ev.context. */
export function click( ) {
	const label = new Label( { text: "Click an event" } );

	return new HBox( { content: [
		new Timeline( { width: 300, items: projectSteps( ),
			click: ( ev ) => label.setText( `clicked: ${( ev.context as TimelineItem ).title}` ),
		} ),
		label,
	] } );
}

/** @demo Renderer — renderer gives what is beside the mark; the mark and the line stay. */
export function renderer( ) {
	return new Timeline( { width: 300, items: projectSteps( ),
		renderer: ( item ) => new VBox( { cls: "step", content: [
			new Label( { text: item.title } ),
			new Tag( { label: item.done ? "done" : "to do", cls: item.done ? "" : "alert" } ),
		] } ),
	} );
}

/** @demo Colors — A class of your own sets the CSS variables of the timeline. */
export function colors( ) {
	return new Timeline( { cls: "green", width: 300, items: projectSteps( ) } );
}

const page: DemoComponent = {
	name: "Timeline",
	category: "Display components",
	description: "Events one after the other on a line, each with its icon in a round mark: a title, a sentence and its date, written relative to now. A done event has its mark in the accent colour; a click gives its item.",
	usage: {
		create: ( props ) => new Timeline( { ...props, items: projectSteps( ) } ),
		extra: "items",
		props: { vertical: true, width: 340 },
		controls: [
			{ name: "vertical", type: "boolean", default: true },
			{ name: "width", type: "number", min: 200, max: 700, step: 20, live: true },
		],
	},
	demos: [ activity, horizontal, click, renderer, colors ],
};

export default page;
