/**
 * Notification: the page of the gallery
 */

import { Button, HBox, Notification } from 'x4js';
import { icon_mail } from '../icons';
import { DemoComponent } from '../types';

import "./notification.scss";

/** @demo Modes — The modes success and danger color its border and its icon; display( 3 ) closes it after 3 s. */
export function modes( ) {
	return new HBox( { content: [
		new Button( { label: "Default", click: ( ) => {
			new Notification( { title: "Saved", text: "report.pdf was saved." } ).display( 3 );
		} } ),
		new Button( { label: "Success", click: ( ) => {
			new Notification( { mode: "success", title: "Sent", text: "The mail was sent." } ).display( 3 );
		} } ),
		new Button( { label: "Danger", cls: "danger", click: ( ) => {
			new Notification( { mode: "danger", title: "Error", text: "The server does not answer." } ).display( 3 );
		} } ),
	] } );
}

/** @demo Until closed — display( ) without a time keeps it; closable adds the button that closes it. Several pile up in the corner. */
export function closable( ) {
	let count = 0;

	return new HBox( { content: [
		new Button( { label: "Notify", click: ( ) => {
			count++;
			new Notification( { closable: true, iconId: icon_mail, title: `Message ${count}`, text: "Close me with the button." } ).display( );
		} } ),
	] } );
}

/** @demo Loading, then done — loading turns its icon; close( ) removes it when the work is done. */
export function loading( ) {
	return new HBox( { content: [
		new Button( { label: "Synchronize", click: ( ) => {
			const wait = new Notification( { loading: true, title: "Synchronizing", text: "Two seconds…" } );
			wait.display( );

			// the work: here a named timer of the notification
			wait.setTimeout( "work", 2000, ( ) => {
				wait.close( );
				new Notification( { mode: "success", title: "Synchronized", text: "12 files are up to date." } ).display( 3 );
			} );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "Notification",
	category: "Extras",
	description: "A message in the bottom right corner of the window, for a few seconds or until it is closed; several pile up.",
	usage: {
		// the preview: a button that shows the notification for 3 s
		create: ( props ) => new Button( { label: "Notify", click: ( ) => new Notification( props ).display( 3 ) } ),
		props: { title: "Saved", text: "report.pdf was saved.", mode: "", loading: false, closable: false },
		controls: [
			{ name: "title", type: "string" },
			{ name: "text", type: "string" },
			{ name: "mode", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "success", text: "success" },
				{ id: "danger", text: "danger" },
			] },
			{ name: "loading", type: "boolean" },
			{ name: "closable", type: "boolean" },
		],
	},
	demos: [ modes, closable, loading ],
};

export default page;
