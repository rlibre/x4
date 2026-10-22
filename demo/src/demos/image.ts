/**
 * Image: the page of the gallery
 */

import { Button, HBox, Image, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./image.scss";

// the pictures of the demos: svg drawn here, in data urls (a page needs no file)
const landscape = "data:image/svg+xml," + encodeURIComponent( `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" preserveAspectRatio="none"><rect width="300" height="200" fill="#9fd3f5"/><circle cx="230" cy="55" r="28" fill="#ffd43b"/><path d="M0 200L90 80l60 70 40-40 110 90z" fill="#2f9e44"/></svg>` );
const portrait = "data:image/svg+xml," + encodeURIComponent( `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="200" viewBox="0 0 120 200"><rect width="120" height="200" fill="#e5dbff"/><circle cx="60" cy="70" r="30" fill="#7048e8"/><rect x="25" y="115" width="70" height="60" rx="30" fill="#7048e8"/></svg>` );

/** @demo Fit — fit says how the picture fills its box: contain, cover, fill or scale-down. */
export function fit( ) {
	return new HBox( { cls: "fits", content: [
		new VBox( { content: [
			new Image( { src: landscape, fit: "contain", width: 150, height: 150 } ),
			new Label( { text: "contain" } ),
		] } ),
		new VBox( { content: [
			new Image( { src: landscape, fit: "cover", width: 150, height: 150 } ),
			new Label( { text: "cover" } ),
		] } ),
		new VBox( { content: [
			new Image( { src: landscape, fit: "fill", width: 150, height: 150 } ),
			new Label( { text: "fill" } ),
		] } ),
		new VBox( { content: [
			new Image( { src: landscape, fit: "scale-down", width: 150, height: 150 } ),
			new Label( { text: "scale-down" } ),
		] } ),
	] } );
}

/** @demo setImage — setImage shows another picture; clear( ) shows none. */
export function setImage( ) {
	const image = new Image( { src: landscape, fit: "contain", width: 200, height: 140, alt: "A picture" } );

	return new HBox( { cls: "fits", content: [
		image,
		new VBox( { content: [
			new Button( { label: "Landscape", cls: "outline", click: ( ) => image.setImage( landscape ) } ),
			new Button( { label: "Portrait", cls: "outline", click: ( ) => image.setImage( portrait ) } ),
			new Button( { label: "Clear", cls: "outline", click: ( ) => image.clear( ) } ),
		] } ),
	] } );
}

/** @demo Drop a file — With candrop, a click opens the file dialog and a file can be dropped on it; change gives the files, shown here with setImage. */
export function dropFile( ) {
	const image = new Image( {
		cls: "drop",
		src: portrait,
		fit: "contain",
		width: 200,
		height: 160,
		candrop: true,
		accept: "image/*",
		change: ( ev ) => {
			image.setImage( URL.createObjectURL( ev.files[0] ) );
		},
	} );

	return new HBox( { cls: "fits", content: [
		image,
		new Label( { text: "Click the picture, or drop one on it" } ),
	] } );
}

const page: DemoComponent = {
	name: "Image",
	category: "Display components",
	description: "A picture: an <img> that fills the box of the component as fit says. It can also take a file the user drops on it.",
	usage: {
		create: ( props ) => new Image( props ),
		props: { src: landscape, fit: "contain", alt: "A landscape", width: 240, height: 160 },
		controls: [
			{ name: "src", type: "options", options: [
				{ id: landscape, text: "landscape", data: "landscape" },
				{ id: portrait, text: "portrait", data: "portrait" },
			] },
			{ name: "fit", type: "options", options: [
				{ id: "contain", text: "contain" },
				{ id: "cover", text: "cover" },
				{ id: "fill", text: "fill" },
				{ id: "scale-down", text: "scale-down" },
			] },
			{ name: "alt", type: "string" },
			{ name: "width", type: "number", min: 40, max: 480, step: 20, live: true },
			{ name: "height", type: "number", min: 40, max: 400, step: 20, live: true },
		],
	},
	demos: [ fit, setImage, dropFile ],
};

export default page;
