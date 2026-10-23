/**
 * Clipboard: the page of the gallery
 */

import { Button, HBox, Image, Label, TextEdit, VBox, getClipboard, getEventClipboard, setClipboard, setEventClipboard } from 'x4js';
import { DemoComponent } from '../types';

import "./clipboard.scss";

/** @demo From buttons — setClipboard writes a text, getClipboard reads it; out of a key of the user, the browser may ask first, or refuse: false. */
export function buttons( ) {
	const source = new TextEdit( { label: "Text", labelWidth: 60, width: 320, value: "Hello from x4" } );
	const target = new TextEdit( { label: "Pasted", labelWidth: 60, width: 320 } );
	const status = new Label( { text: "" } );

	return new VBox( { content: [
		source,
		new HBox( { content: [
			new Button( { label: "Copy", click: async ( ) => status.setText( await setClipboard( { text: source.getValue( ) } ) ? "copied" : "refused" ) } ),
			new Button( { label: "Paste", cls: "outline", click: async ( ) => target.setValue( ( await getClipboard( ) ).text ?? "" ) } ),
			status,
		] } ),
		target,
	] } );
}

/** @demo Ctrl+C, Ctrl+V — The keys of the user are the copy and paste events of the component that has the focus (a tabindex): no permission is asked. A pasted image is shown. */
export function keys( ) {
	let text = "Click here, then Ctrl+V a text or an image (a screenshot); Ctrl+C copies this text";
	const shown = new Label( { text } );
	const picture = new Image( { src: "", fit: "contain", width: 240, height: 120 } );
	const zone = new VBox( { cls: "paste-zone", attrs: { tabindex: 0 }, content: [ shown, picture ] } );

	zone.addDOMEvent( "copy", ( ev ) => setEventClipboard( ev, { text } ) );
	zone.addDOMEvent( "paste", ( ev ) => {
		const data = getEventClipboard( ev );
		if( data.image ) {
			picture.setImage( URL.createObjectURL( data.image ) );
		}
		else if( data.text ) {
			text = data.text;
			shown.setText( text );
		}
	} );

	return zone;
}

/** @demo An image — setClipboard( { image } ) writes an image, here drawn in a canvas: to paste in a document or a mail. */
export function image( ) {
	const canvas = document.createElement( "canvas" );
	canvas.width = 160;
	canvas.height = 100;

	const ctx = canvas.getContext( "2d" );
	ctx.fillStyle = "#126e9e";
	ctx.fillRect( 0, 0, 160, 100 );
	ctx.fillStyle = "#8ad0f5";
	ctx.beginPath( );
	ctx.arc( 80, 50, 32, 0, Math.PI * 2 );
	ctx.fill( );

	const status = new Label( { text: "" } );

	return new HBox( { content: [
		new Image( { src: canvas.toDataURL( ), width: 160, height: 100 } ),
		new Button( { label: "Copy the image", click: ( ) => canvas.toBlob( async ( blob ) => {
			status.setText( await setClipboard( { image: blob } ) ? "copied: paste it in a document" : "refused" );
		} ) } ),
		status,
	] } );
}

const page: DemoComponent = {
	name: "Clipboard",
	category: "Extra",
	description: "The clipboard of the system: a text, an image, files. setClipboard and getClipboard from a button or a menu; in the copy, cut and paste events (Ctrl+C, Ctrl+V), setEventClipboard and getEventClipboard.",
	imports: [ "setClipboard", "getClipboard", "setEventClipboard", "getEventClipboard" ],
	demos: [ buttons, keys, image ],
};

export default page;
