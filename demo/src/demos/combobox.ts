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

/** @demo From the code — Each button calls what it shows: selectItem chooses an item by its id (null: none), getSelection reads the id chosen, setItems gives the list new items. */
export function fromCode( ) {
	const result = new Label( { text: "" } );
	const combo = new Combobox( { label: "Size", labelWidth: 70, width: 280, items: [
		{ id: "s", text: "Small" },
		{ id: "m", text: "Medium" },
		{ id: "l", text: "Large" },
	] } );

	return new VBox( { content: [
		combo,
		new HBox( { content: [
			new Button( { label: "selectItem( \"m\" )", cls: "outline", click: ( ) => combo.selectItem( "m" ) } ),
			new Button( { label: "selectItem( null )", cls: "outline", click: ( ) => combo.selectItem( null ) } ),
			new Button( { label: "getSelection( )", cls: "outline", click: ( ) => result.setText( `getSelection( ) gives ${combo.getSelection( )}` ) } ),
		] } ),
		new HBox( { content: [
			// two sizes more, and the new one chosen: open the list to see the five
			new Button( { label: "setItems( XS to XL )", cls: "outline", click: ( ) => {
				combo.setItems( [
					{ id: "xs", text: "Extra small" },
					{ id: "s", text: "Small" },
					{ id: "m", text: "Medium" },
					{ id: "l", text: "Large" },
					{ id: "xl", text: "Extra large" },
				] );
				combo.selectItem( "xl" );
				result.setText( "five sizes now: open the list" );
			} } ),
			result,
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
