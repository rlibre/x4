/**
 * FileDrop and FileDialog: the page of the gallery
 */

import { Button, EvDropChange, FileDialog, FileDrop, HBox, Image, Label } from 'x4js';
import { icon_file, icon_image } from '../icons';
import { DemoComponent } from '../types';

import "./filedrop.scss";

// the files of the configurator: their names in the console
function onFiles( ev: EvDropChange ) {
	console.log( Array.from( ev.files ).map( f => f.name ) );
}

/** @demo Change — Files dropped on the zone, or chosen after a click (or the space bar): change gives them. */
export function change( ) {
	const label = new Label( { text: "" } );

	return new HBox( { content: [
		new FileDrop( { width: 260, accept: "", multiple: true, change: ( ev ) => {
			const names = Array.from( ev.files ).map( f => `${f.name} (${f.size} bytes)` );
			label.setText( names.join( ", " ) );
		} } ),
		label,
	] } );
}

/** @demo Images — accept limits the files offered: here images, shown as soon as one is dropped. */
export function images( ) {
	const preview = new Image( { cls: "dropped", src: "", width: 160, height: 120, fit: "contain" } );

	return new HBox( { content: [
		new FileDrop( { width: 260, accept: "image/*", icon: icon_image, label: "Drop an image here", change: ( ev ) => {
			preview.setImage( URL.createObjectURL( ev.files[0] ) );
		} } ),
		preview,
	] } );
}

/** @demo FileDialog — The file dialog alone, opened by a button of your own: showDialog, then its callback gets the files. */
export function dialog( ) {
	const label = new Label( { text: "" } );
	const files = new FileDialog( { accept: ".txt,.md,.json", multiple: false, callback: ( list ) => {
		label.setText( list.length ? list[0].name : "" );
	} } );

	return new HBox( { content: [
		files,
		new Button( { icon: icon_file, label: "Open a text file...", click: ( ) => files.showDialog( ) } ),
		label,
	] } );
}

const page: DemoComponent = {
	name: "FileDrop",
	category: "Input components",
	description: "A zone where files are dropped, or chosen with the file dialog of the system after a click. FileDialog is that dialog alone.",
	imports: [ "FileDrop", "FileDialog" ],
	usage: {
		create: ( props ) => new FileDrop( { ...props, change: onFiles } ),
		extra: "change: onFiles",
		props: { label: "", icon: "", accept: "", multiple: false, width: 260 },
		controls: [
			{ name: "label", type: "string" },
			{ name: "icon", type: "options", options: [
				{ id: "", text: "default" },
				{ id: icon_image, text: "image", data: "icon_image" },
				{ id: icon_file, text: "file", data: "icon_file" },
			] },
			{ name: "accept", type: "options", options: [
				{ id: "", text: "any file" },
				{ id: "image/*", text: "image/*" },
				{ id: ".txt,.md", text: ".txt,.md" },
			] },
			{ name: "multiple", type: "boolean" },
			{ name: "width", type: "number", min: 160, max: 480, step: 20, live: true },
		],
	},
	demos: [ change, images, dialog ],
};

export default page;
