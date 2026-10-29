/**
 * TextArea and SimpleTextArea: the page of the gallery
 */

import { Button, HBox, Label, SimpleTextArea, TextArea, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo With a label — A TextArea is a label above a textarea; resize: "vertical" gives it a handle. Without a height it has 2 rows. */
export function labelled( ) {
	return new VBox( { width: 420, content: [
		new TextArea( { label: "Comment", placeholder: "A few words...", resize: "vertical" } ),
	] } );
}

/** @demo A height — With a height, the textarea fills it. */
export function height( ) {
	return new TextArea( { label: "Description", width: 420, height: 180, value: "A text on\nseveral lines.\n\nThe textarea takes the height of the box." } );
}

/** @demo SimpleTextArea — The textarea alone, where a label has no place: a message to type and a log that follows it (scrollToBottom). */
export function simple( ) {
	const log = new SimpleTextArea( { readonly: true, height: 110, resize: false } );
	const message = new SimpleTextArea( { flex: 1, placeholder: "Your message", resize: false } );

	return new VBox( { width: 460, content: [
		log,
		new HBox( { content: [
			message,
			new Button( { label: "Send", click: ( ) => {
				log.setText( log.getText( ) + "\n" + message.getText( ) );
				log.scrollToBottom( );
				message.setText( "" );
			} } ),
		] } ),
	] } );
}

/** @demo Counting — change comes at each key with the text in ev.value: the count of its characters. */
export function counter( ) {
	const count = new Label( { text: "0 / 140" } );

	return new VBox( { width: 420, content: [
		new TextArea( { label: "Status", required: true, change: ( ev ) => count.setText( `${ev.value.length} / 140` ) } ),
		count,
	] } );
}

const page: DemoComponent = {
	name: "TextArea",
	category: "Input components",
	description: "A text on several lines: TextArea, a label above a textarea, for a form; SimpleTextArea, the textarea alone. Their value is read with getText, written with setText.",
	imports: [ "TextArea", "SimpleTextArea" ],
	usage: {
		create: ( props ) => new TextArea( props ),
		props: { label: "Comment", placeholder: "A few words...", resize: "", width: 360, cls: "", required: false, readonly: false, disabled: false },
		controls: [
			{ name: "label", type: "string" },
			{ name: "placeholder", type: "string" },
			{ name: "resize", type: "options", options: [
				{ id: "", text: "none" },
				{ id: "vertical", text: "vertical" },
				{ id: "horizontal", text: "horizontal" },
				{ id: "both", text: "both" },
			] },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "label-top", text: "label-top" },
			] },
			{ name: "required", type: "boolean" },
			{ name: "readonly", type: "boolean" },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ labelled, height, simple, counter ],
};

export default page;
