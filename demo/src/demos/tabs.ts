/**
 * Tabs: the page of the gallery
 */

import { Button, HBox, Label, SimpleText, Tabs, TabItem, VBox } from 'x4js';
import { icon_folder, icon_gear, icon_home } from '../icons';
import { DemoComponent } from '../types';

import "./tabs.scss";

// the tabs of the configurator: new components each time, a component is in one place only
function makeTabs( ): TabItem[] {
	return [
		{ name: "home", title: "Home", content: new SimpleText( { text: "The page Home." } ) },
		{ name: "files", title: "Files", content: new SimpleText( { text: "The page Files." } ) },
		{ name: "settings", title: "Settings", content: new SimpleText( { text: "The page Settings." } ) },
	];
}

/** @demo Tabs — A tab per item: its name, its title, its content; default is the tab shown first. */
export function basic( ) {
	return new Tabs( { height: 180, default: "general", items: [
		{ name: "general", title: "General", content: new SimpleText( { text: "The name of the project." } ) },
		{ name: "build", title: "Build", content: new SimpleText( { text: "How it is built." } ) },
		{ name: "about", title: "About", content: new SimpleText( { text: "Who made it." } ) },
	] } );
}

/** @demo Icons, content built later — A tab can have an icon; its content can be a function, called when the tab is shown the first time. */
export function lazy( ) {
	return new Tabs( { height: 180, default: "home", items: [
		{ name: "home", title: "Home", icon: icon_home,
			content: new SimpleText( { text: "Built with the tabs." } ) },
		{ name: "files", title: "Files", icon: icon_folder,
			content: ( ) => new SimpleText( { text: `Built at ${new Date( ).toLocaleTimeString( )}` } ) },
		{ name: "settings", title: "Settings", icon: icon_gear,
			content: ( ) => new SimpleText( { text: "Built when shown too." } ) },
	] } );
}

/** @demo Vertical — The tabs on the left of their content. */
export function vertical( ) {
	return new Tabs( { height: 180, vertical: true, default: "home", items: [
		{ name: "home", title: "Home", icon: icon_home, content: new SimpleText( { text: "Home." } ) },
		{ name: "files", title: "Files", icon: icon_folder, content: new SimpleText( { text: "Files." } ) },
		{ name: "settings", title: "Settings", icon: icon_gear, content: new SimpleText( { text: "Settings." } ) },
	] } );
}

/** @demo Adding and removing — addTab, removeTab, selectTab; getCurTab gives the name of the tab shown. */
export function dynamic( ) {
	let count = 0;
	const current = new Label( { text: "" } );
	const tabs = new Tabs( { height: 160, default: "first", items: [
		{ name: "first", title: "First", content: new SimpleText( { text: "The first tab." } ) },
	] } );

	return new VBox( { content: [
		tabs,
		new HBox( { content: [
			new Button( { label: "Add a tab", click: ( ) => {
				count++;
				const name = `tab${count}`;
				tabs.addTab( { name, title: `Tab ${count}`, content: new SimpleText( { text: `Tab number ${count}.` } ) } );
				tabs.selectTab( name );
			} } ),
			new Button( { label: "Remove the last one", cls: "outline", click: ( ) => {
				if( count ) {
					tabs.removeTab( `tab${count}` );
					count--;
					tabs.selectTab( count ? `tab${count}` : "first" );
				}
			} } ),
			new Button( { label: "getCurTab", cls: "outline", click: ( ) => current.setText( tabs.getCurTab( ) ) } ),
			current,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Tabs",
	category: "Menus / button groups / tabs",
	description: "Pages one at a time, chosen by their tab. The content of a page can be built when it is shown the first time.",
	usage: {
		create: ( props ) => new Tabs( { ...props, items: makeTabs( ) } ),
		extra: "items",
		props: { default: "home", vertical: false, width: 420, height: 200 },
		controls: [
			{ name: "default", type: "options", options: [
				{ id: "home", text: "home" },
				{ id: "files", text: "files" },
				{ id: "settings", text: "settings" },
			] },
			{ name: "vertical", type: "boolean" },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 100, max: 400, step: 20, live: true },
		],
	},
	demos: [ basic, lazy, vertical, dynamic ],
};

export default page;
