/**
 * Tag: the page of the gallery
 */

import { HBox, Tag } from 'x4js';
import { icon_calendar, icon_check, icon_star, icon_user, icon_warning } from '../icons';
import { DemoComponent } from '../types';

import "./tag.scss";

/** @demo Icons — A short text in a rounded frame, an icon before it. */
export function icons( ) {
	return new HBox( { cls: "tags", content: [
		new Tag( { label: "Draft" } ),
		new Tag( { label: "Done", icon: icon_check } ),
		new Tag( { label: "Tomorrow", icon: icon_calendar } ),
		new Tag( { label: "Alice", icon: icon_user } ),
	] } );
}

/** @demo Alert — The class alert gives a tag the colors of an alert. */
export function alert( ) {
	return new HBox( { cls: "tags", content: [
		new Tag( { label: "Late", icon: icon_warning, cls: "alert" } ),
		new Tag( { label: "3 errors", cls: "alert" } ),
	] } );
}

/** @demo Colors — A class of your own sets the CSS variables of the tag. */
export function colors( ) {
	return new HBox( { cls: "tags", content: [
		new Tag( { label: "Paid", icon: icon_check, cls: "green" } ),
		new Tag( { label: "Featured", icon: icon_star, cls: "outline" } ),
	] } );
}

/** @demo A list — Tags made from an array, in a box that wraps them on several lines. */
export function list( ) {
	const keywords = [ "typescript", "components", "dom", "no virtual dom", "css variables", "router", "state", "forms", "dialogs", "grid" ];

	return new HBox( { cls: "tags wrap", width: 360, content: keywords.map( k => new Tag( { label: k } ) ) } );
}

const page: DemoComponent = {
	name: "Tag",
	category: "Display components",
	description: "A short text in a rounded frame, with an icon: a state, a keyword, a person. It has no method: its text and its icon are those of its props.",
	usage: {
		create: ( props ) => new Tag( props ),
		props: { label: "Draft", icon: "", cls: "" },
		controls: [
			{ name: "label", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_check, text: "check", data: "icon_check" },
				{ id: icon_star, text: "star", data: "icon_star" },
				{ id: icon_warning, text: "warning", data: "icon_warning" },
			] },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "alert", text: "alert" },
			] },
		],
	},
	demos: [ icons, alert, colors, list ],
};

export default page;
