/**
 * Breadcrumbs: the page of the gallery
 */

import { Breadcrumbs, Button, HBox, Label, VBox } from 'x4js';
import { icon_folder, icon_home } from '../icons';
import { DemoComponent } from '../types';

/** @demo A path — Each element: its label, an icon, a name; the click event gives the name of the one clicked in ev.context. */
export function basic( ) {
	const label = new Label( { text: "" } );

	return new VBox( { content: [
		new Breadcrumbs( { items: [
			{ name: "home", label: "Home", icon: icon_home },
			{ name: "docs", label: "Documents", icon: icon_folder },
			{ name: "2026", label: "2026", icon: icon_folder },
		], click: ( ev ) => label.setText( `click: ${ev.context}` ) } ),
		label,
	] } );
}

/** @demo A click per element — An element with its own click: it is called with its name, the click event is not fired. */
export function ownClick( ) {
	const label = new Label( { text: "" } );
	const show = ( name: string ) => label.setText( `to ${name}` );

	return new VBox( { content: [
		new Breadcrumbs( { items: [
			{ name: "shop", label: "Shop", click: show },
			{ name: "books", label: "Books", click: show },
			{ name: "novels", label: "Novels" },
		] } ),
		label,
	] } );
}

/** @demo Navigation — setItems shows the path again: a click on an element goes back to it, a button opens a folder. */
export function navigation( ) {
	const path = [ "home" ];
	const crumbs = new Breadcrumbs( { items: [], click: ( ev ) => {
		path.length = path.indexOf( ev.context ) + 1;
		update( );
	} } );

	const update = ( ) => {
		crumbs.setItems( path.map( name => ( { name, label: name, icon: icon_folder } ) ) );
	};

	update( );

	return new VBox( { content: [
		crumbs,
		new HBox( { content: [
			new Button( { label: "Open a folder", click: ( ) => {
				path.push( `folder${path.length}` );
				update( );
			} } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Breadcrumbs",
	category: "Sizers / viewport / misc",
	description: "The path to the page shown, an element per level; a click on one gives its name, to go back to it.",
	demos: [ basic, ownClick, navigation ],
};

export default page;
