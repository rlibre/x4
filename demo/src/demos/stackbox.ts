/**
 * StackBox: the page of the gallery
 */

import { Button, HBox, Label, StackBox, VBox } from 'x4js';
import { icon_gear, icon_home, icon_user } from '../icons';
import { DemoComponent } from '../types';

import "./stackbox.scss";

/** @demo Pages — One page shown at a time: select( name ) shows another one; pageChange gives its name. */
export function pages( ) {
	const label = new Label( { text: "" } );
	const stack = new StackBox( {
		cls: "pages",
		height: 120,
		default: "home",
		items: [
			{ name: "home", content: new Label( { cls: "page", icon: icon_home, text: "Home" } ) },
			{ name: "profile", content: new Label( { cls: "page", icon: icon_user, text: "Profile" } ) },
			{ name: "settings", content: new Label( { cls: "page", icon: icon_gear, text: "Settings" } ) },
		],
		pageChange: ( ev ) => label.setText( `pageChange: ${ev.selection[0]}` ),
	} );

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Home", click: ( ) => stack.select( "home" ) } ),
			new Button( { label: "Profile", click: ( ) => stack.select( "profile" ) } ),
			new Button( { label: "Settings", click: ( ) => stack.select( "settings" ) } ),
			label,
		] } ),
		stack,
	] } );
}

/** @demo Built when shown — A content given as a function is built the first time its page is shown, then kept. */
export function lazy( ) {
	let built = 0;
	const count = new Label( { text: "pages built: 0" } );
	const make = ( name: string ) => {
		built++;
		count.setText( `pages built: ${built}` );
		return new Label( { cls: "page", text: `${name}, built at ${new Date( ).toLocaleTimeString( )}` } );
	};

	const stack = new StackBox( {
		cls: "pages",
		height: 120,
		default: "first",
		items: [
			{ name: "first", content: ( ) => make( "First" ) },
			{ name: "second", content: ( ) => make( "Second" ) },
		],
	} );

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "First", click: ( ) => stack.select( "first" ) } ),
			new Button( { label: "Second", click: ( ) => stack.select( "second" ) } ),
			count,
		] } ),
		stack,
	] } );
}

/** @demo Pages added — addItem adds a page, removeItem takes one away; getPageCount counts them. */
export function addRemove( ) {
	let next = 1;
	const label = new Label( { text: "" } );
	const stack = new StackBox( { cls: "pages", height: 120, default: "start", items: [
		{ name: "start", content: new Label( { cls: "page", text: "Add a page" } ) },
	] } );

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Add a page", click: ( ) => {
				const name = `page${next}`;
				stack.addItem( { name, content: new Label( { cls: "page", text: `Page ${next}` } ) } );
				stack.select( name );
				next++;
				label.setText( `${stack.getPageCount( )} pages` );
			} } ),
			new Button( { label: "Remove it", cls: "outline", click: ( ) => {
				const name = stack.getCurPage( );
				if( name != "start" ) {
					stack.removeItem( name );
					stack.select( "start" );
					label.setText( `${stack.getPageCount( )} pages` );
				}
			} } ),
			label,
		] } ),
		stack,
	] } );
}

const page: DemoComponent = {
	name: "StackBox",
	category: "Layout containers",
	description: "A stack of pages where one only is shown at a time; a page given as a function is built the first time it is shown.",
	usage: {
		create: ( props ) => new StackBox( { ...props, cls: "pages", items: [
			{ name: "home", content: new Label( { cls: "page", icon: icon_home, text: "Home" } ) },
			{ name: "profile", content: new Label( { cls: "page", icon: icon_user, text: "Profile" } ) },
			{ name: "settings", content: new Label( { cls: "page", icon: icon_gear, text: "Settings" } ) },
		] } ),
		extra: "items",
		props: { default: "home", width: 320, height: 140 },
		controls: [
			{ name: "default", type: "options", options: [
				{ id: "home", text: "home" },
				{ id: "profile", text: "profile" },
				{ id: "settings", text: "settings" },
			] },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 80, max: 240, step: 20, live: true },
		],
	},
	demos: [ pages, lazy, addRemove ],
};

export default page;
