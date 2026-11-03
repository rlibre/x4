/**
 * MenuBar: the page of the gallery
 */

import { Label, MenuBar, VBox } from 'x4js';
import { icon_copy, icon_edit, icon_file, icon_save, icon_trash } from '../icons';
import { DemoComponent } from '../types';

/** @demo A menu bar — A click on a title opens its menu under it, a second one closes it; while a menu is open, the mouse on another title opens that one. The items are those of a Menu; shortcut shows the keys of a command, it does not add them. */
export function basic( ) {
	const label = new Label( { text: "" } );

	const bar = new MenuBar( { items: [
		{ text: "File", items: [
			{ text: "New file", icon: icon_file, shortcut: "Mod+N", click: ( ) => label.setText( "New file" ) },
			{ text: "Save", icon: icon_save, shortcut: "Mod+S", click: ( ) => label.setText( "Save" ) },
			"-",
			{ text: "Delete", icon: icon_trash, shortcut: "Delete", click: ( ) => label.setText( "Delete" ) },
		] },
		{ text: "Edit", items: [
			{ text: "Copy", icon: icon_copy, shortcut: "Mod+C", click: ( ) => label.setText( "Copy" ) },
			{ text: "Paste", shortcut: "Mod+V", disabled: true },
		] },
		{ text: "Tools", disabled: true, items: [] },
	] } );

	return new VBox( { content: [ bar, label ] } );
}

/** @demo Built at each opening — Given by a function, the items of a title are those of that time: Undo is disabled until something is renamed, the check of Word wrap follows its option. */
export function dynamic( ) {
	const label = new Label( { text: "" } );
	let changes = 0;
	let wrap = true;

	const bar = new MenuBar( { items: [
		{ text: "Edit", items: ( ) => [
			{ text: "Rename", icon: icon_edit, shortcut: "F2", click: ( ) => {
				changes++;
				label.setText( `Rename: ${changes} to undo` );
			} },
			{ text: "Undo", shortcut: "Mod+Z", disabled: changes==0, click: ( ) => {
				changes--;
				label.setText( `Undo: ${changes} to undo` );
			} },
		] },
		{ text: "View", items: ( ) => [
			{ text: "Word wrap", checked: wrap, click: ( ) => {
				wrap = !wrap;
				label.setText( `Word wrap: ${wrap}` );
			} },
		] },
	] } );

	return new VBox( { content: [ bar, label ] } );
}

const page: DemoComponent = {
	name: "MenuBar",
	category: "Menus / button groups / tabs",
	description: "A row of titles at the top of a web application, each one opens its menu: the items of a Menu. A click opens it, the mouse on another title goes to its menu. A desktop application should use the menu of the system.",
	demos: [ basic, dynamic ],
};

export default page;
