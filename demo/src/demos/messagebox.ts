/**
 * MessageBox: the page of the gallery
 */

import { Button, HBox, Label, MessageBox, unsafe } from 'x4js';
import { DemoComponent } from '../types';

/** @demo An error — showAsync( message, buttons, title ): the icon of error by default; it resolves when the box closes. */
export function error( ) {
	return new HBox( { content: [
		new Button( { label: "Save", click: async ( ) => {
			await MessageBox.showAsync( "The file could not be saved: the disk is full.", [ "ok.default" ], "Save" );
		} } ),
	] } );
}

/** @demo A question — The icon "question", buttons yes and no; the answer is the name of the button, null for Escape. */
export function question( ) {
	const answer = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Delete the file", click: async ( ) => {
			const button = await MessageBox.showAsync( "Delete report.pdf?", [ "yes.default", "no.outline" ], "Delete", "question" );
			answer.setText( `answer: ${button}` );
		} } ),
		answer,
	] } );
}

/** @demo Without waiting — MessageBox.show( ) shows the box and returns it at once; a button closes it. */
export function noWait( ) {
	return new HBox( { content: [
		new Button( { label: "Tell me", click: ( ) => {
			MessageBox.show( "The export runs in the background.", [ "ok" ], "Export", "question" );
		} } ),
	] } );
}

/** @demo Formatted text — The tag `unsafe`, before a template string, gives html to the message; the values in it are escaped. */
export function formatted( ) {
	return new HBox( { content: [
		new Button( { label: "Show the summary", click: ( ) => {
			const count = 3;
			const name = "<b>not bold</b>";
			MessageBox.showAsync( unsafe`<b>${count} files</b> were copied to <i>${name}</i>.`, [ "ok" ], "Copy", "question" );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "MessageBox",
	category: "Popup / Dialog",
	description: "A modal message with an icon and buttons, made by its static functions: showAsync waits for the button clicked, show does not.",
	demos: [ error, question, noWait, formatted ],
};

export default page;
