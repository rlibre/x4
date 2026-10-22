/**
 * Link: the page of the gallery
 */

import { HBox, Icon, Label, Link, SimpleText, VBox } from 'x4js';
import { icon_file, icon_home, icon_mail, icon_right } from '../icons';
import { DemoComponent } from '../types';

import "./link.scss";

/** @demo Text and icon — A link shows its text, underlined, after its icon; attrs gives it a target. */
export function textAndIcon( ) {
	return new VBox( { content: [
		new Link( { href: "https://x4js.org", text: "x4js.org, in a new tab", icon: icon_home, attrs: { target: "_blank" } } ),
		new Link( { href: "mailto:someone@example.com", text: "Write to us", icon: icon_mail } ),
	] } );
}

/** @demo Click — click is fired first; ev.context is the href, and ev.preventDefault( ) keeps the link from being followed. */
export function click( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Link( { href: "https://example.com/report.pdf", text: "report.pdf", icon: icon_file, click: ( ev ) => {
			ev.preventDefault( );
			label.setText( `not followed: ${ev.context}` );
		} } ),
		label,
	] } );
}

/** @demo Content — With content, the link is what it holds: here a small card. */
export function content( ) {
	return new Link( { cls: "card-link", href: "#/link", content: [
		new Icon( { iconId: icon_file } ),
		new VBox( { flex: 1, content: [
			new SimpleText( { cls: "title", text: "Getting started" } ),
			new SimpleText( { text: "Create a project and run it in a few minutes." } ),
		] } ),
		new Icon( { iconId: icon_right } ),
	] } );
}

/** @demo setText — setText changes the text of the link; its icon stays. */
export function setText( ) {
	let count = 0;
	const link = new Link( { href: "#/link", text: "Clicked 0 times", icon: icon_right } );

	link.on( "click", ( ev ) => {
		ev.preventDefault( );
		count++;
		link.setText( `Clicked ${count} times` );
	} );

	return link;
}

const page: DemoComponent = {
	name: "Link",
	category: "Display components",
	description: "A link (an <a>) with a text and an icon, or any content. Its click event comes before the browser follows it.",
	usage: {
		create: ( props ) => new Link( props ),
		props: { href: "https://x4js.org", text: "x4js.org", icon: icon_home, align: "" },
		controls: [
			{ name: "href", type: "string" },
			{ name: "text", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_home, text: "home", data: "icon_home" },
				{ id: icon_mail, text: "mail", data: "icon_mail" },
			] },
			{ name: "align", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "center", text: "center" },
				{ id: "right", text: "right" },
			] },
		],
	},
	demos: [ textAndIcon, click, content, setText ],
};

export default page;
