/**
 * Label: the page of the gallery
 */

import { Button, HBox, Input, Label, VBox } from 'x4js';
import { icon_check, icon_folder, icon_info, icon_mail, icon_star, icon_user, icon_warning } from '../icons';
import { DemoComponent } from '../types';

import "./label.scss";

/** @demo Icons — An icon before the text, or an icon alone; its color follows the text. */
export function icons( ) {
	return new VBox( { content: [
		new Label( { icon: icon_info, text: "An icon and a text" } ),
		new Label( { icon: icon_warning, text: "A warning", cls: "warning" } ),
		new HBox( { content: [
			new Label( { icon: icon_star } ),
			new Label( { icon: icon_user } ),
			new Label( { icon: icon_mail } ),
		] } ),
	] } );
}

/** @demo Alignment — In a label wider than its text, align puts the text on the left, in the center or on the right. */
export function alignment( ) {
	return new VBox( { cls: "aligned", content: [
		new Label( { width: 300, align: "left", icon: icon_folder, text: "left" } ),
		new Label( { width: 300, align: "center", icon: icon_folder, text: "center" } ),
		new Label( { width: 300, align: "right", icon: icon_folder, text: "right: the icon goes after the text" } ),
	] } );
}

/** @demo setText — setText and setIcon change a label that is already shown. */
export function setText( ) {
	const status = new Label( { icon: icon_info, text: "Not saved" } );

	return new HBox( { content: [
		new Button( { label: "Save", click: ( ) => {
			status.setText( "Saved at " + new Date( ).toLocaleTimeString( ) );
			status.setIcon( icon_check );
		} } ),
		status,
	] } );
}

/** @demo labelFor — A label with the tag "label" and labelFor: a click on it gives the focus to its field. */
export function labelFor( ) {
	return new HBox( { content: [
		new Label( { tag: "label", text: "Your name", labelFor: "label-demo-name" } ),
		new Input( { type: "text", id: "label-demo-name", placeholder: "click on the label" } ),
	] } );
}

/** @demo Vertical — The class vertical puts the icon above the text. */
export function vertical( ) {
	return new HBox( { cls: "tiles", content: [
		new Label( { cls: "vertical", icon: icon_folder, text: "Documents" } ),
		new Label( { cls: "vertical", icon: icon_mail, text: "Mail" } ),
		new Label( { cls: "vertical", icon: icon_star, text: "Favorites" } ),
	] } );
}

const page: DemoComponent = {
	name: "Label",
	category: "Display components",
	description: "A text with an icon before it. Its color is the variable --label-color, which the components that hold a label set.",
	usage: {
		create: ( props ) => new Label( { ...props, width: 300 } ),
		extra: "width: 300",
		props: { text: "Hello", icon: icon_info, align: "", cls: "" },
		controls: [
			{ name: "text", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_info, text: "info", data: "icon_info" },
				{ id: icon_star, text: "star", data: "icon_star" },
				{ id: icon_folder, text: "folder", data: "icon_folder" },
			] },
			{ name: "align", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "left", text: "left" },
				{ id: "center", text: "center" },
				{ id: "right", text: "right" },
			] },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "vertical", text: "vertical" },
			] },
		],
	},
	demos: [ icons, alignment, setText, labelFor, vertical ],
};

export default page;
