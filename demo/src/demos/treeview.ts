/**
 * Treeview: the page of the gallery
 */

import { BtnGroup, Button, HBox, Label, TreeItem, Treeview, VBox } from 'x4js';
import { icon_file, icon_folder } from '../icons';
import { DemoComponent } from '../types';

// the items of the configurator
function projectItems( ): TreeItem[] {
	return [
		{ id: "src", text: "src", iconId: icon_folder, open: true, children: [
			{ id: "main", text: "main.ts", iconId: icon_file },
			{ id: "style", text: "main.scss", iconId: icon_file },
		] },
		{ id: "bin", text: "bin", iconId: icon_folder, children: [
			{ id: "index", text: "index.html", iconId: icon_file },
		] },
		{ id: "package", text: "package.json", iconId: icon_file },
	];
}

/** @demo Folders — An item with children is a folder: a click on its arrow opens it; open: true shows it open at first. */
export function folders( ) {
	return new Treeview( { width: 300, height: 220, items: [
		{ id: "docs", text: "Documents", iconId: icon_folder, open: true, children: [
			{ id: "cv", text: "cv.pdf", iconId: icon_file },
			{ id: "letters", text: "Letters", iconId: icon_folder, children: [
				{ id: "bank", text: "bank.txt", iconId: icon_file },
				{ id: "school", text: "school.txt", iconId: icon_file },
			] },
		] },
		{ id: "music", text: "Music", iconId: icon_folder, children: [
			{ id: "song", text: "song.mp3", iconId: icon_file },
		] },
		{ id: "notes", text: "notes.txt", iconId: icon_file },
	] } );
}

/** @demo Selection — selectionChange gives the item selected (the item itself, not its id); dblClick its id in ev.context. */
export function selection( ) {
	const label = new Label( { text: "Nothing selected" } );

	return new HBox( { content: [
		new Treeview( { width: 300, height: 220, items: projectItems( ),
			selectionChange: ( ev ) => {
				label.setText( ev.empty ? "Nothing selected" : `selected: ${ev.selection[0].text}` );
			},
			dblClick: ( ev ) => label.setText( `double click: ${ev.context}` ),
		} ),
		label,
	] } );
}

/** @demo From the code — selectItem selects an item by its id, clearSelection removes the selection; the buttons are in the footer of the tree. */
export function api( ) {
	const tree: Treeview = new Treeview( { width: 300, height: 240, items: projectItems( ), footer: new BtnGroup( { items: [
		new Button( { label: "Select main.ts", click: ( ) => tree.selectItem( "main" ) } ),
		new Button( { label: "Clear", click: ( ) => tree.clearSelection( ) } ),
	] } ) } );

	return tree;
}

/** @demo Empty — Without items the tree shows emptyMsg; setItems gives it its items. */
export function empty( ) {
	const tree = new Treeview( { width: 300, height: 200, items: [], emptyMsg: "No project open" } );

	return new HBox( { content: [
		tree,
		new VBox( { content: [
			new Button( { label: "Open a project", click: ( ) => tree.setItems( projectItems( ) ) } ),
			new Button( { label: "Close", cls: "outline", click: ( ) => tree.setItems( [] ) } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Treeview",
	category: "Lists / grids / trees",
	description: "A tree of items: the folders open and close, one item is selected at a time. An item is drawn from its text, its icon and its class.",
	usage: {
		create: ( props ) => new Treeview( { ...props, items: projectItems( ) } ),
		extra: "items",
		props: { disabled: false, width: 300, height: 220 },
		controls: [
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 160, max: 500, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 400, step: 20, live: true },
		],
	},
	demos: [ folders, selection, api, empty ],
};

export default page;
