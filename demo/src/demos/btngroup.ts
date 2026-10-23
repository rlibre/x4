/**
 * BtnGroup: the page of the gallery
 */

import { BtnGroup, Button, Input, Label, VBox } from 'x4js';
import { icon_copy, icon_edit, icon_folder, icon_home, icon_save, icon_search, icon_star, icon_trash, icon_user } from '../icons';
import { DemoComponent } from '../types';

import "./btngroup.scss";

/** @demo Predefined buttons — "ok", "cancel", "save"...: their text follows the language; options after a dot ("cancel.outline", "retry.disabled"); "-" pushes what follows to the right. */
export function predefined( ) {
	const label = new Label( { text: "" } );

	return new VBox( { content: [
		new BtnGroup( {
			items: [ "save", "-", "retry.disabled", "cancel.outline", "ok" ],
			btnclick: ( ev ) => label.setText( `btnclick: ${ev.button}` ),
		} ),
		label,
	] } );
}

/** @demo Alignment — align puts the buttons on the left, in the center or on the right. */
export function align( ) {
	return new VBox( { content: [
		new BtnGroup( { align: "left", items: [ "ok", "cancel" ] } ),
		new BtnGroup( { align: "center", items: [ "ok", "cancel" ] } ),
		new BtnGroup( { align: "right", items: [ "ok", "cancel" ] } ),
	] } );
}

/** @demo Vertical — The buttons one above the other: a bar of tools on the side. */
export function vertical( ) {
	return new BtnGroup( { vertical: true, width: 160, items: [
		new Button( { icon: icon_home, label: "Home" } ),
		new Button( { icon: icon_folder, label: "Files" } ),
		new Button( { icon: icon_user, label: "Account" } ),
	] } );
}

/** @demo Toolbar — The class packed: buttons side by side, without gap; a BtnGroup also takes a Label or an Input. */
export function toolbar( ) {
	return new BtnGroup( { cls: "packed", items: [
		new Button( { icon: icon_save, tooltip: "Save" } ),
		new Button( { icon: icon_copy, tooltip: "Copy" } ),
		new Button( { icon: icon_edit, tooltip: "Edit" } ),
		new Button( { icon: icon_trash, tooltip: "Delete" } ),
		"~",
		new Label( { icon: icon_search, text: "Find" } ),
		new Input( { type: "text", placeholder: "a word" } ),
	] } );
}

/** @demo Changing the buttons — getButton( id ) gives a button to change; setButtons replaces them all. */
export function dynamic( ) {
	const group = new BtnGroup( { items: [ "save", "cancel" ] } );

	return new VBox( { content: [
		group,
		new BtnGroup( { items: [
			new Button( { label: "Disable save", cls: "outline", click: ( ) => {
				group.getButton( "save" ).enable( false );
			} } ),
			new Button( { label: "Yes / no", cls: "outline", click: ( ) => {
				group.setButtons( [ "yes", "no" ] );
			} } ),
			new Button( { label: "Your own", cls: "outline", click: ( ) => {
				group.setButtons( [ new Button( { label: "Star", icon: icon_star } ) ] );
			} } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "BtnGroup",
	category: "Menus / button groups / tabs",
	description: "A row (or a column) of buttons: predefined ones whose text follows the language, buttons of your own, spacers. btnclick gives the name of the one clicked.",
	usage: {
		create: ( props ) => new BtnGroup( { ...props, items: [ "save", "ok", "cancel" ] } ),
		extra: "items: [ \"save\", \"ok\", \"cancel\" ]",
		props: { align: "", vertical: false, cls: "", width: 420 },
		controls: [
			{ name: "align", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "left", text: "left" },
				{ id: "center", text: "center" },
				{ id: "right", text: "right" },
			] },
			{ name: "vertical", type: "boolean" },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "packed", text: "packed" },
			] },
			{ name: "width", type: "number", min: 100, max: 560, step: 20, live: true },
		],
	},
	demos: [ predefined, align, vertical, toolbar, dynamic ],
};

export default page;
