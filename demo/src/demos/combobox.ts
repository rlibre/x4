/**
 * Combobox: the page of the gallery
 */

import { Button, Combobox, HBox, Label, ListItem, SimpleText, VBox } from 'x4js';
import { icon_file, icon_folder, icon_image } from '../icons';
import { DemoComponent } from '../types';

import "./combobox.scss";

// the items of the configurator
const fruits: ListItem[] = [
	{ id: 1, text: "Apple" },
	{ id: 2, text: "Banana" },
	{ id: 3, text: "Cherry" },
	{ id: 4, text: "Grape" },
	{ id: 5, text: "Lemon" },
];

/** @demo Pick an item — A click opens the list (the arrows too); selectionChange gives the id of the item chosen. */
export function pick( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Combobox( { label: "Country", labelWidth: 70, width: 280, value: "fr", items: [
			{ id: "fr", text: "France" },
			{ id: "de", text: "Germany" },
			{ id: "it", text: "Italy" },
			{ id: "es", text: "Spain" },
		], selectionChange: ( ev ) => label.setText( `selection: ${ev.selection.join( ", " )}` ) } ),
		label,
	] } );
}

/** @demo Typed — With readonly: false the user types: the list shows the items that hold the text. */
export function typed( ) {
	return new Combobox( { label: "City", labelWidth: 70, width: 280, readonly: false, items: [
		{ id: 1, text: "Paris" },
		{ id: 2, text: "Lyon" },
		{ id: 3, text: "Marseille" },
		{ id: 4, text: "Lille" },
		{ id: 5, text: "Grenoble" },
	] } );
}

/** @demo Renderer — A renderer draws the items of the list; the field still shows the text of the item chosen. */
export function renderer( ) {
	return new Combobox( { label: "File", labelWidth: 70, width: 280, cls: "files", items: [
		{ id: 1, text: "notes.txt", iconId: icon_file, data: "2 KB" },
		{ id: 2, text: "photo.jpg", iconId: icon_image, data: "1.4 MB" },
		{ id: 3, text: "projects", iconId: icon_folder, data: "folder" },
	], renderer: ( item ) => new HBox( { content: [
		new Label( { flex: 1, icon: item.iconId, text: item.text } ),
		new SimpleText( { cls: "size", text: item.data } ),
	] } ) } );
}

/** @demo From the code — selectItem chooses an item (null: none), setItems gives new items, getSelection reads the id. */
export function fromCode( ) {
	const label = new Label( { text: "" } );
	const combo = new Combobox( { label: "Size", labelWidth: 70, width: 280, items: [
		{ id: "s", text: "Small" },
		{ id: "m", text: "Medium" },
		{ id: "l", text: "Large" },
	] } );

	return new VBox( { content: [
		combo,
		new HBox( { content: [
			new Button( { label: "Medium", cls: "outline", click: ( ) => combo.selectItem( "m" ) } ),
			new Button( { label: "None", cls: "outline", click: ( ) => combo.selectItem( null ) } ),
			new Button( { label: "Shoe sizes", cls: "outline", click: ( ) => combo.setItems( [
				{ id: 40, text: "40" },
				{ id: 42, text: "42" },
				{ id: 44, text: "44" },
			] ) } ),
			new Button( { label: "getSelection", click: ( ) => label.setText( `getSelection: ${combo.getSelection( )}` ) } ),
			label,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Combobox",
	category: "Input components",
	description: "A field and a dropdown list of items. The user picks an item; with readonly: false he can type to filter the list.",
	usage: {
		create: ( props ) => new Combobox( { ...props, items: fruits } ),
		extra: "items: fruits",
		props: { label: "Fruit", labelWidth: 60, value: 1, readonly: true, required: false, disabled: false, width: 260 },
		controls: [
			{ name: "label", type: "string" },
			{ name: "labelWidth", type: "number", min: 0, max: 200, step: 10, live: true },
			{ name: "value", type: "options", options: [
				{ id: 1, text: "Apple" },
				{ id: 2, text: "Banana" },
				{ id: 3, text: "Cherry" },
			] },
			{ name: "readonly", type: "boolean", default: true },
			{ name: "required", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 160, max: 480, step: 20, live: true },
		],
	},
	demos: [ pick, typed, renderer, fromCode ],
};

export default page;
