/**
 * Carousel: the page of the gallery
 */

import { Button, Carousel, CarouselImage, HBox, Label, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./carousel.scss";

// pictures: a gradient, a sun and hills, as data urls (the gallery loads nothing)
function picture( c1: string, c2: string, i: number ) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">`
		+ `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`
		+ `<rect width="1200" height="600" fill="url(#g)"/>`
		+ `<circle cx="${280 + i * 140}" cy="210" r="90" fill="#fff" fill-opacity="0.35"/>`
		+ `<path d="M0 600 L0 420 Q300 ${330 + i * 20} 600 430 T1200 400 L1200 600 Z" fill="#000" fill-opacity="0.18"/></svg>`;

	return "data:image/svg+xml," + encodeURIComponent( svg );
}

const tones = [ "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#4a3aa7" ];
const photos: CarouselImage[] = tones.map( ( c, i ) => ( { src: picture( c, tones[( i+1 ) % tones.length], i ), alt: `Picture ${i+1}`, caption: `Picture ${i+1}` } ) );

/** @demo Images — A slide is an image: src, alt, a caption over its bottom, fit (cover by default). It is loaded when it comes near the view. autoplay goes by itself, paused under the pointer; change gives the index. */
export function images( ) {
	const result = new Label( { text: "change: 0" } );

	return new VBox( { content: [
		new Carousel( { height: 260, autoplay: 4000, items: photos, change: ( ev ) => result.setText( `change: ${ev.value}` ) } ),
		result,
	] } );
}

/** @demo Several at once — perView shows slides side by side; a move goes one slide further. A slide is any component: a swipe on it is not a click. */
export function perView( ) {
	const result = new Label( { text: "Click a card" } );
	const cards = tones.map( ( c, i ) => new VBox( { cls: "card", style: { borderColor: c }, content: [
		new Label( { text: `Card ${i+1}` } ),
		new Button( { label: "Open", cls: "outline", click: ( ) => result.setText( `card ${i+1}` ) } ),
	] } ) );

	return new VBox( { content: [
		new Carousel( { height: 140, perView: 3, items: cards } ),
		result,
	] } );
}

/** @demo Loop and commands — loop: after the last slide, the first. arrows and dots can go; the swipe and the keys (← → Home End, with the focus) stay. */
export function commands( ) {
	return new HBox( { content: [
		new Carousel( { width: 280, height: 160, loop: true, arrows: false, items: photos.slice( 0, 4 ) } ),
		new Carousel( { width: 280, height: 160, dots: false, items: photos.slice( 2 ) } ),
	] } );
}

/** @demo From the code — select, next and prev move it without a change event; disabled, it is faded and grey. */
export function fromCode( ) {
	const carousel = new Carousel( { height: 200, items: photos } );
	const disabled = new Carousel( { width: 220, height: 120, items: photos, disabled: true } );

	return new VBox( { content: [
		carousel,
		new HBox( { content: [
			new Button( { label: "prev", cls: "outline", click: ( ) => carousel.prev( ) } ),
			new Button( { label: "next", cls: "outline", click: ( ) => carousel.next( ) } ),
			new Button( { label: "select( 4 )", cls: "outline", click: ( ) => carousel.select( 4 ) } ),
		] } ),
		disabled,
	] } );
}

const page: DemoComponent = {
	name: "Carousel",
	category: "Layout containers",
	description: "Slides side by side that move, images or components: arrows, dots, a swipe with the finger or the mouse, the arrow keys and an autoplay. One slide seen at a time, or several.",
	imports: [ "Carousel", "CarouselImage" ],
	usage: {
		create: ( props ) => new Carousel( { ...props, items: photos } ),
		extra: "items: photos",
		props: { perView: 1, autoplay: 0, loop: false, arrows: true, dots: true, width: 480, height: 240, disabled: false },
		controls: [
			{ name: "perView", type: "number", min: 1, max: 4, step: 1, live: true, default: 1 },
			{ name: "autoplay", type: "number", min: 0, max: 10000, step: 1000, live: true },
			{ name: "loop", type: "boolean" },
			{ name: "arrows", type: "boolean", default: true },
			{ name: "dots", type: "boolean", default: true },
			{ name: "width", type: "number", min: 200, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 100, max: 400, step: 20, live: true },
			{ name: "disabled", type: "boolean" },
		],
	},
	demos: [ images, perView, commands, fromCode ],
};

export default page;
