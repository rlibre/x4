/**
 * Panel: the page of the gallery
 */

import { Button, Checkbox, HBox, Panel, TextEdit, VBox } from 'x4js';
import { icon_gear, icon_info, icon_user } from '../icons';
import { DemoComponent } from '../types';

/** @demo Title and icon — A frame with its title on its border, an icon before the title. */
export function titled( ) {
	return new HBox( { content: [
		new Panel( { title: "Account", icon: icon_user, width: 260, content: [
			new TextEdit( { label: "Name", value: "Ada" } ),
			new TextEdit( { label: "Email", type: "email", value: "ada@example.com" } ),
		] } ),
		new Panel( { title: "Options", icon: icon_gear, width: 220, content: [
			new Checkbox( { label: "Dark theme" } ),
			new Checkbox( { label: "Notifications", checked: true } ),
		] } ),
	] } );
}

/** @demo Inline — The class inline: a line above the content and its title, no frame. */
export function inline( ) {
	return new VBox( { width: 420, content: [
		new Panel( { cls: "inline", title: "General", content: [
			new Checkbox( { label: "Open the last file at start" } ),
		] } ),
		new Panel( { cls: "inline", title: "Advanced", content: [
			new Checkbox( { label: "Log what happens" } ),
		] } ),
	] } );
}

/** @demo setTitle — setTitle changes the text of the title, its icon stays; setContent fills its body. */
export function setTitle( ) {
	let count = 0;
	const panel = new Panel( { title: "Messages", icon: icon_info, width: 300, content: "No message." } );

	return new HBox( { content: [
		panel,
		new Button( { label: "New message", click: ( ) => {
			count++;
			panel.setTitle( `Messages (${count})` );
			panel.setContent( `Message ${count} arrived.` );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "Panel",
	category: "Sizers / viewport / misc",
	description: "A frame with a title on its border (a legend), around a body that holds its content.",
	usage: {
		create: ( props ) => new Panel( props ),
		props: { title: "Options", icon: "", cls: "", content: "The content of the panel.", width: 300 },
		controls: [
			{ name: "title", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_gear, text: "gear", data: "icon_gear" },
				{ id: icon_info, text: "info", data: "icon_info" },
			] },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "frame" },
				{ id: "inline", text: "inline" },
			] },
			{ name: "content", type: "string" },
			{ name: "width", type: "number", min: 160, max: 560, step: 20, live: true },
		],
	},
	demos: [ titled, inline, setTitle ],
};

export default page;
