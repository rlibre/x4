/**
 * InputBox: the page of the gallery
 */

import { Button, HBox, InputBox, Label } from 'x4js';
import { DemoComponent } from '../types';

/** @demo A text — showAsync( message, value, title ): the text typed after OK, null after Cancel or Escape. */
export function text( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Rename", click: async ( ) => {
			const name = await InputBox.showAsync( "The new name of the file:", "report.pdf", "Rename" );
			result.setText( name === null ? "cancelled" : `new name: "${name}"` );
		} } ),
		result,
	] } );
}

/** @demo A password — The option password hides what is typed. */
export function password( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Unlock", click: async ( ) => {
			const secret = await InputBox.showAsync( "Your password:", "", "Unlock", { password: true } );
			result.setText( secret === null ? "cancelled" : `${secret.length} characters typed` );
		} } ),
		result,
	] } );
}

/** @demo Spaces kept — The text is trimmed unless trim is false. */
export function untrimmed( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Prefix", click: async ( ) => {
			const prefix = await InputBox.showAsync( "The prefix, spaces included:", "  > ", "Prefix", { trim: false } );
			result.setText( prefix === null ? "cancelled" : `[${prefix}]` );
		} } ),
		result,
	] } );
}

const page: DemoComponent = {
	name: "InputBox",
	category: "Popup / Dialog",
	description: "Asks for one text in a modal box, with its static showAsync: the text after OK, null otherwise.",
	demos: [ text, password, untrimmed ],
};

export default page;
