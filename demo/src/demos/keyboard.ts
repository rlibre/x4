/**
 * Keyboard: the page of the gallery
 */

import { Button, HBox, Keyboard, Select, TextEdit, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./keyboard.scss";

/** @demo On a field — The keyboard shows itself at the bottom of its box while a field has the focus; its keys type in the field. */
export function onField( ) {
	return new VBox( { cls: "kb-box", height: 380, content: [
		new TextEdit( { label: "Name", labelWidth: 80, width: 340, placeholder: "click here" } ),
		new Keyboard( { } ),
	] } );
}

/** @demo Languages — locale gives the keys of a language ("de-CH", "pl"...); setLocale changes them, setZoom their size. */
export function languages( ) {
	const field = new TextEdit( { label: "Text", labelWidth: 80, width: 340, placeholder: "click here" } );
	const keyboard = new Keyboard( { locale: "de-CH" } );

	return new VBox( { cls: "kb-box", height: 400, content: [
		new HBox( { content: [
			field,
			new Select( { value: "de-CH", items: [
				{ id: "fr-FR", text: "Français" },
				{ id: "de-CH", text: "Deutsch (CH)" },
				{ id: "en", text: "English" },
				{ id: "pl", text: "Polski" },
			], change: ( ev ) => {
				keyboard.setLocale( ev.value );
				field.getInput( ).focus( );
			} } ),
			new Button( { label: "Zoom 80%", cls: "outline", click: ( ) => {
				keyboard.setZoom( 80 );
				field.getInput( ).focus( );
			} } ),
		] } ),
		keyboard,
	] } );
}

/** @demo Number pad — A number field gets the pad; with numpadOnly it has no key back to the letters. showOn opens it on a field. */
export function numpad( ) {
	const amount = new TextEdit( { label: "Amount", labelWidth: 80, width: 240, type: "number", value: 12 } );
	const keyboard = new Keyboard( { numpadOnly: true } );

	return new VBox( { cls: "kb-box", height: 320, content: [
		new HBox( { content: [
			amount,
			new Button( { label: "showOn", click: ( ) => {
				amount.getInput( ).focus( );
				keyboard.showOn( amount.getInput( ) );
			} } ),
		] } ),
		keyboard,
	] } );
}

const page: DemoComponent = {
	name: "Keyboard",
	category: "Sizers / viewport / misc",
	description: "A virtual keyboard for a touch screen: it shows itself at the bottom of its box while a field of the page has the focus.",
	usage: {
		create: ( props ) => new VBox( { cls: "kb-box", height: 380, width: 600, content: [
			new TextEdit( { label: "Text", labelWidth: 80, width: 340, placeholder: "click here" } ),
			new Keyboard( props ),
		] } ),
		props: { locale: "fr-FR", numpadOnly: false },
		controls: [
			{ name: "locale", type: "options", options: [
				{ id: "fr-FR", text: "fr-FR" },
				{ id: "de-CH", text: "de-CH" },
				{ id: "en", text: "en" },
				{ id: "es", text: "es" },
				{ id: "pl", text: "pl" },
			] },
			{ name: "numpadOnly", type: "boolean" },
		],
	},
	demos: [ onField, languages, numpad ],
};

export default page;
