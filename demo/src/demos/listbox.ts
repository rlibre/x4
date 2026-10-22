/**
 * Listbox: the page of the gallery
 */

import { Button, HBox, Input, Label, Listbox, ListItem, SimpleText, VBox } from 'x4js';
import { icon_file, icon_folder, icon_heart } from '../icons';
import { DemoComponent } from '../types';

import "./listbox.scss";

// the items of the configurator
const fruits: ListItem[] = [
	{ id: 1, text: "Apple" },
	{ id: 2, text: "Banana" },
	{ id: 3, text: "Cherry" },
	{ id: 4, text: "Grape" },
	{ id: 5, text: "Lemon" },
	{ id: 6, text: "Orange" },
	{ id: 7, text: "Peach" },
	{ id: 8, text: "Pear" },
];

/** @demo Icons — Each item has its iconId; selectionChange gives the ids of the selection. */
export function icons( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Listbox( { width: 220, height: 160, items: [
			{ id: "src", text: "src", iconId: icon_folder },
			{ id: "bin", text: "bin", iconId: icon_folder },
			{ id: "readme", text: "README.md", iconId: icon_file },
			{ id: "package", text: "package.json", iconId: icon_file },
		], selectionChange: ( ev ) => label.setText( `selection: ${ev.selection.join( ", " )}` ) } ),
		label,
	] } );
}

/** @demo Multiple selection — With multisel, Ctrl+click adds an item to the selection or removes it. */
export function multisel( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Listbox( { width: 220, height: 160, multisel: true, items: [
			{ id: "fr", text: "French" },
			{ id: "en", text: "English" },
			{ id: "de", text: "German" },
			{ id: "es", text: "Spanish" },
			{ id: "it", text: "Italian" },
		], selectionChange: ( ev ) => label.setText( `selection: ${ev.selection.join( ", " )}` ) } ),
		label,
	] } );
}

/** @demo Checkable — With checkable, a case at the start of each line: a click on it, or Space, changes it; getChecked gives the ids checked. */
export function checkable( ) {
	const label = new Label( { text: "" } );

	const list = new Listbox( { width: 220, height: 160, checkable: true, items: [
		{ id: "mail", text: "Mail" },
		{ id: "calendar", text: "Calendar", checked: true },
		{ id: "contacts", text: "Contacts", checked: true },
		{ id: "notes", text: "Notes" },
	], checkChange: ( ev ) => label.setText( `${ev.id} ${ev.checked ? "checked" : "unchecked"} — checked: ${list.getChecked( ).join( ", " )}` ) } );

	return new HBox( { content: [ list, label ] } );
}

/** @demo Reselect — With reselect, a click on the item already selected fires selectionChange again: the view shows what was clicked last. */
export function reselect( ) {
	const label = new Label( { text: "" } );
	let count = 0;

	return new HBox( { content: [
		new Listbox( { width: 220, height: 160, reselect: true, items: [
			{ id: "acme", text: "Acme" },
			{ id: "globex", text: "Globex" },
			{ id: "initech", text: "Initech" },
		], selectionChange: ( ev ) => label.setText( `selectionChange ${++count}: ${ev.selection.join( ", " )}` ) } ),
		label,
	] } );
}

/** @demo Renderer — A renderer of your own draws each item: here its text and its price, from item.data. */
export function renderer( ) {
	return new Listbox( { width: 260, height: 160, cls: "prices", items: [
		{ id: 1, text: "Coffee", data: { price: 2.5 } },
		{ id: 2, text: "Tea", data: { price: 2 } },
		{ id: 3, text: "Hot chocolate", data: { price: 3.2 } },
		{ id: 4, text: "Orange juice", data: { price: 4 } },
	], renderer: ( item ) => new HBox( { content: [
		new Label( { flex: 1, icon: icon_heart, text: item.text } ),
		new SimpleText( { cls: "price", text: item.data.price.toFixed( 2 ) + " €" } ),
	] } ) } );
}

/** @demo Empty — Without items the listbox shows emptyMsg; setItems with items shows them instead. */
export function empty( ) {
	const files: ListItem[] = [];
	const list = new Listbox( { width: 220, height: 160, items: files, emptyMsg: "No file yet" } );

	return new HBox( { content: [
		list,
		new VBox( { content: [
			new Button( { label: "Add a file", click: ( ) => {
				const id = files.length + 1;
				files.push( { id, text: `file ${id}.txt`, iconId: icon_file } );
				list.setItems( files );
				list.select( id );
			} } ),
			new Button( { label: "Clear", cls: "outline", click: ( ) => {
				files.length = 0;
				list.setItems( files );
			} } ),
		] } ),
	] } );
}

/** @demo Filter — filter( text ) shows the items whose text holds it, without case. */
export function filter( ) {
	const list = new Listbox( { width: 220, height: 160, items: [
		{ id: 1, text: "Paris" },
		{ id: 2, text: "Lyon" },
		{ id: 3, text: "Marseille" },
		{ id: 4, text: "Lille" },
		{ id: 5, text: "Nantes" },
		{ id: 6, text: "Grenoble" },
	] } );

	return new VBox( { content: [
		new Input( { type: "text", width: 220, placeholder: "Type to filter", change: ( ev ) => list.filter( ev.value ) } ),
		list,
	] } );
}

const page: DemoComponent = {
	name: "Listbox",
	category: "Lists / grids / trees",
	description: "A list of items to choose from: one or several, with icons, or drawn by a renderer of your own.",
	usage: {
		create: ( props ) => new Listbox( { ...props, items: fruits } ),
		extra: "items: fruits",
		props: { title: "", icon: "", multisel: false, checkable: false, disabled: false, width: 240, height: 200 },
		controls: [
			{ name: "title", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_heart, text: "heart", data: "icon_heart" },
				{ id: icon_folder, text: "folder", data: "icon_folder" },
			] },
			{ name: "multisel", type: "boolean" },
			{ name: "checkable", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 120, max: 480, step: 20, live: true },
			{ name: "height", type: "number", min: 100, max: 400, step: 20, live: true },
		],
	},
	demos: [ icons, multisel, checkable, reselect, renderer, empty, filter ],
};

export default page;
