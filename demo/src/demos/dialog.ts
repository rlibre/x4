/**
 * Dialog: the page of the gallery
 */

import { Button, Dialog, Form, HBox, Label, SimpleText, TextArea, TextEdit } from 'x4js';
import { icon_trash, icon_user } from '../icons';
import { DemoComponent } from '../types';

/** @demo A form — The fields of its form, read with getValues once showAsync gives the button clicked. */
export function form( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Edit the user", icon: icon_user, click: async ( ) => {
			const dialog: Dialog = new Dialog( {
				title: "User",
				icon: icon_user,
				closable: true,
				form: new Form( { content: [
					new TextEdit( { label: "Name", name: "name", value: "Ada" } ),
					new TextEdit( { label: "Email", name: "email", type: "email", value: "ada@example.com" } ),
				] } ),
				buttons: [ "ok.default", "cancel.outline" ],
			} );

			// showAsync: the name of the button, null when closed by Escape or the close box
			const button = await dialog.showAsync( );
			result.setText( button === "ok" ? JSON.stringify( dialog.getValues( ) ) : `closed by ${button}` );
		} } ),
		result,
	] } );
}

/** @demo A note — Enter in a TextArea is a new line; Ctrl+Enter (Cmd+Enter) clicks the default button, as Enter does in a field. */
export function note( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Add a note", click: async ( ) => {
			const dialog: Dialog = new Dialog( {
				title: "Note",
				closable: true,
				form: new Form( { content: [
					new TextEdit( { label: "Title", name: "title", value: "Meeting" } ),
					new TextArea( { label: "Text", name: "text", value: "first line" } ),
				] } ),
				buttons: [ "ok.default", "cancel.outline" ],
			} );

			const button = await dialog.showAsync( );
			result.setText( button === "ok" ? JSON.stringify( dialog.getValues( ) ) : `closed by ${button}` );
		} } ),
		result,
	] } );
}

/** @demo Validation — With show( ), btnclick decides: the dialog closes only when validate( ) finds the form valid. */
export function validation( ) {
	return new HBox( { content: [
		new Button( { label: "Create a project", click: ( ) => {
			const dialog: Dialog = new Dialog( {
				title: "New project",
				content: [
					new TextEdit( { label: "Name", name: "name", required: true, placeholder: "required" } ),
					new SimpleText( { text: "Leave the name empty: OK keeps the dialog open." } ),
				],
				buttons: [ "ok.default", "cancel.outline" ],
				btnclick: ( ev ) => {
					// validate( ): the values, or null when a field is not valid
					if( ev.button === "cancel" || dialog.validate( ) ) {
						dialog.close( );
					}
				},
			} );

			dialog.show( );
		} } ),
	] } );
}

/** @demo Danger — The class danger colors its caption and its buttons; closable: "cancel" makes the close box click Cancel. */
export function danger( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Delete…", icon: icon_trash, cls: "danger", click: async ( ) => {
			const dialog: Dialog = new Dialog( {
				cls: "danger",
				title: "Delete the project",
				icon: icon_trash,
				closable: "cancel",
				content: "The project and its files will be deleted.",
				buttons: [ "ok", "cancel.outline" ],
			} );

			result.setText( `button: ${await dialog.showAsync( )}` );
		} } ),
		result,
	] } );
}

/** @demo Not modal — modal: false leaves the page usable under it; movable: its caption moves it. */
export function notModal( ) {
	return new HBox( { content: [
		new Button( { label: "Open a tool window", click: ( ) => {
			const dialog: Dialog = new Dialog( {
				title: "Tools",
				modal: false,
				movable: true,
				closable: true,
				content: "Drag the caption: the page under it still answers.",
				buttons: [ "ok.outline" ],
				btnclick: ( ) => dialog.close( ),
			} );

			dialog.show( );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "Dialog",
	category: "Popup / Dialog",
	description: "A popup with a caption, a form and a bar of buttons; modal by default. showAsync gives the button clicked; show and btnclick let you decide when it closes.",
	usage: {
		// the preview: a button that opens the dialog
		create: ( props ) => new Button( { label: "Open the dialog", click: ( ) => {
			new Dialog( { ...props, content: "Its content, then its buttons.", buttons: [ "ok.default", "cancel.outline" ] } ).showAsync( );
		} } ),
		extra: "content: \"Its content, then its buttons.\", buttons: [ \"ok.default\", \"cancel.outline\" ]",
		props: { title: "A dialog", modal: true, closable: true, movable: false, sizable: false, cls: "" },
		controls: [
			{ name: "title", type: "string" },
			{ name: "modal", type: "boolean", default: true },
			{ name: "closable", type: "boolean" },
			{ name: "movable", type: "boolean" },
			{ name: "sizable", type: "boolean" },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "danger", text: "danger" },
			] },
		],
	},
	demos: [ form, note, validation, danger, notModal ],
};

export default page;
