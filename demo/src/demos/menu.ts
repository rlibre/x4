/**
 * Menu: the page of the gallery
 */

import { Button, Component, HBox, Label, Menu } from 'x4js';
import { icon_copy, icon_edit, icon_file, icon_folder, icon_save, icon_trash } from '../icons';
import { DemoComponent } from '../types';

import "./menu.scss";

/** @demo A menu — A Menu is a popup: built at the click, shown under the button with displayNear; an item calls its click. */
export function basic( ) {
	const label = new Label( { text: "" } );
	const button = new Button( { label: "Open the menu", click: ( ) => {
		const menu = new Menu( { items: [
			{ text: "New file", icon: icon_file, click: ( ) => label.setText( "New file" ) },
			{ text: "Save", icon: icon_save, click: ( ) => label.setText( "Save" ) },
			"-",
			{ text: "Delete", icon: icon_trash, click: ( ) => label.setText( "Delete" ) },
		] } );
		menu.displayNear( button.getBoundingRect( ), "top left", "bottom left" );
	} } );

	return new HBox( { content: [ button, label ] } );
}

/** @demo Titles and sub-menus — A string is a title, "-" a line; an item with a menu opens it on its right; an item can be disabled. */
export function submenus( ) {
	const label = new Label( { text: "" } );
	const button = new Button( { label: "Edit", cls: "outline", click: ( ) => {
		const recent = new Menu( { items: [
			{ text: "notes.txt", icon: icon_file, click: ( ) => label.setText( "notes.txt" ) },
			{ text: "todo.md", icon: icon_file, click: ( ) => label.setText( "todo.md" ) },
		] } );

		const menu = new Menu( { items: [
			"Clipboard",
			{ text: "Copy", icon: icon_copy, click: ( ) => label.setText( "Copy" ) },
			{ text: "Paste", disabled: true },
			"-",
			"Files",
			{ text: "Open recent", icon: icon_folder, menu: recent },
			{ text: "Rename", icon: icon_edit, click: ( ) => label.setText( "Rename" ) },
		] } );
		menu.displayNear( button.getBoundingRect( ), "top left", "bottom left" );
	} } );

	return new HBox( { content: [ button, label ] } );
}

/** @demo Checked items — checked shows a check in place of the icon; a function is read when the menu is built. */
export function checked( ) {
	const options = { wrap: true, numbers: false };
	const label = new Label( { text: "" } );
	const show = ( ) => label.setText( `wrap: ${options.wrap}, numbers: ${options.numbers}` );

	const button = new Button( { label: "View", cls: "outline", click: ( ) => {
		const menu = new Menu( { items: [
			{ text: "Word wrap", checked: ( ) => options.wrap, click: ( ) => {
				options.wrap = !options.wrap;
				show( );
			} },
			{ text: "Line numbers", checked: ( ) => options.numbers, click: ( ) => {
				options.numbers = !options.numbers;
				show( );
			} },
		] } );
		menu.displayNear( button.getBoundingRect( ), "top left", "bottom left" );
	} } );

	show( );
	return new HBox( { content: [ button, label ] } );
}

/** @demo Context menu — A right click in the zone: the menu at the place of the pointer, with displayAt. */
export function context( ) {
	const label = new Label( { text: "Right click in the zone" } );
	const zone = new Component( { cls: "menu-zone", content: label, dom_events: {
		contextmenu: ( ev: MouseEvent ) => {
			ev.preventDefault( );
			const menu = new Menu( { items: [
				{ text: "Copy", icon: icon_copy, click: ( ) => label.setText( "Copy" ) },
				{ text: "Delete", icon: icon_trash, click: ( ) => label.setText( "Delete" ) },
			] } );
			menu.displayAt( ev.pageX, ev.pageY );
		},
	} } );

	return zone;
}

/** @demo A button with a menu — The menu prop of a Button: its items, or a function that gives them at each click. */
export function buttonMenu( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Export", menu: [
			{ text: "As PDF", click: ( ) => label.setText( "PDF" ) },
			{ text: "As CSV", click: ( ) => label.setText( "CSV" ) },
		] } ),
		new Button( { label: "Now", cls: "outline", menu: ( ) => [
			{ text: new Date( ).toLocaleTimeString( ), click: ( ) => label.setText( "the time" ) },
		] } ),
		label,
	] } );
}

const page: DemoComponent = {
	name: "Menu",
	category: "Menus / button groups / tabs",
	description: "A popup list of commands: icons, titles, separators, sub-menus, checked items. It is built when it opens and closes when an item is clicked or the user clicks elsewhere.",
	demos: [ basic, submenus, checked, context, buttonMenu ],
};

export default page;
