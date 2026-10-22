/**
 * Button: the page of the gallery
 */

import { BtnGroup, Button, HBox, Label } from 'x4js';
import { icon_heart, icon_plus, icon_save, icon_trash } from '../icons';
import { DemoComponent } from '../types';

import "./button.scss";

/** @demo Icons — The icon alone, with a tooltip, then the icon and the text. */
export function icons( ) {
	return new HBox( { content: [
		new Button( { icon: icon_save, tooltip: "Save" } ),
		new Button( { icon: icon_heart, cls: "round", tooltip: "Like" } ),
		new Button( { icon: icon_save, label: "Save" } ),
		new Button( { icon: icon_trash, label: "Delete" } ),
	] } );
}

/** @demo Styles — The classes outline and danger, and a class of your own that sets the CSS variables of the button. */
export function styles( ) {
	return new HBox( { content: [
		new Button( { label: "Default" } ),
		new Button( { label: "Outline", cls: "outline" } ),
		new Button( { label: "Danger", cls: "danger" } ),
		new Button( { label: "Green", cls: "green" } ),
	] } );
}

/** @demo Disabled — A disabled button cannot be clicked nor focused; enable() gives it back. */
export function disabled( ) {
	const target = new Button( { label: "Send", disabled: true } );

	return new HBox( { content: [
		target,
		new Button( { label: "Enable / disable", cls: "outline", click: ( ) => {
			target.enable( !!target.isDisabled( ) );
		} } ),
	] } );
}

/** @demo Click — A click updates a label. With autorepeat, holding the button down clicks again and again. */
export function click( ) {
	let count = 0;
	const label = new Label( { text: "Not clicked yet" } );

	return new HBox( { content: [
		new Button( { label: "Click me", click: ( ) => {
			count++;
			label.setText( `Clicked ${count} times` );
		} } ),
		new Button( { icon: icon_plus, label: "Hold me", autorepeat: true, click: ( ev ) => {
			count++;
			label.setText( `Clicked ${count} times (repeat ${ev.repeat ?? 0})` );
		} } ),
		label,
	] } );
}

/** @demo With a menu — A click opens the menu under the button, in place of the click event. Given as a function, the menu is built at each click: its entry counts the opens. */
export function withMenu( ) {
	let opened = 0;
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "File", menu: [
			{ text: "Open", click: ( ) => label.setText( "Open" ) },
			{ text: "Save", icon: icon_save, click: ( ) => label.setText( "Save" ) },
			"-",
			{ text: "Delete", icon: icon_trash, click: ( ) => label.setText( "Delete" ) },
		] } ),
		new Button( { label: "Recent", cls: "outline", menu: ( ) => {
			opened++;
			return [ { text: `Opened ${opened} times`, click: ( ) => label.setText( `Recent, open ${opened}` ) } ];
		} } ),
		label,
	] } );
}

/** @demo In a BtnGroup — Predefined buttons ("ok", "cancel": their text follows the language), a spacer, a button of your own; btnclick gives the name of the one clicked. */
export function inBtnGroup( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new BtnGroup( { width: 380, items: [
			"ok",
			"cancel.outline",
			"-",
			new Button( { id: "help", label: "Help", cls: "outline" } ),
		], btnclick: ( ev ) => label.setText( `btnclick: ${ev.button}` ) } ),
		label,
	] } );
}

const page: DemoComponent = {
	name: "Button",
	category: "Menus / button groups / tabs",
	description: "A button with a text, an icon, or both. A click fires its click event, or opens its menu; it can repeat while held down.",
	usage: {
		create: ( props ) => new Button( props ),
		props: { label: "Save", icon: "", cls: "", disabled: false, tooltip: "" },
		controls: [
			{ name: "label", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "none" },
				{ id: icon_save, text: "save", data: "icon_save" },
				{ id: icon_trash, text: "trash", data: "icon_trash" },
				{ id: icon_heart, text: "heart", data: "icon_heart" },
			] },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "outline", text: "outline" },
				{ id: "danger", text: "danger" },
			] },
			{ name: "disabled", type: "boolean" },
			{ name: "tooltip", type: "string" },
		],
	},
	demos: [ icons, styles, disabled, click, withMenu, inBtnGroup ],
};

export default page;
