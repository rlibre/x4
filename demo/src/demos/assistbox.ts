/**
 * AssistBox: the page of the gallery
 */

import { AssistBox, Button, Flex, HBox, Input, Label, VBox } from 'x4js';
import { icon_heart, icon_home, icon_star } from '../icons';
import { DemoComponent } from '../types';

import "./assistbox.scss";

/** @demo A wizard — Back and Next call selectNextPage; isFirstPage and isLastPage enable them at each pageChange. */
export function wizard( ) {
	const back = new Button( { label: "Back", click: ( ) => steps.selectNextPage( false ) } );
	const next = new Button( { label: "Next", click: ( ) => steps.selectNextPage( true ) } );

	const steps = new AssistBox( {
		cls: "steps",
		height: 140,
		default: "name",
		items: [
			{ name: "name", content: new VBox( { cls: "step", content: [
				new Label( { text: "1. Your name" } ),
				new Input( { type: "text", placeholder: "Name" } ),
			] } ) },
			{ name: "mail", content: new VBox( { cls: "step", content: [
				new Label( { text: "2. Your email" } ),
				new Input( { type: "email", placeholder: "you@example.com" } ),
			] } ) },
			{ name: "done", content: new VBox( { cls: "step", content: [
				new Label( { text: "3. Done: thank you." } ),
			] } ) },
		],
		pageChange: ( ) => {
			back.enable( !steps.isFirstPage( ) );
			next.enable( !steps.isLastPage( ) );
		},
	} );

	return new VBox( { width: 360, content: [
		steps,
		new HBox( { content: [ back, new Flex( ), next ] } ),
	] } );
}

/** @demo A carousel — At the last page, Next goes back to the first one with select. */
export function carousel( ) {
	const slides = new AssistBox( {
		cls: "slides",
		height: 140,
		default: "home",
		items: [
			{ name: "home", content: new Label( { cls: "slide", icon: icon_home, text: "Home" } ) },
			{ name: "star", content: new Label( { cls: "slide", icon: icon_star, text: "Star" } ) },
			{ name: "heart", content: new Label( { cls: "slide", icon: icon_heart, text: "Heart" } ) },
		],
	} );

	return new VBox( { width: 360, content: [
		slides,
		new HBox( { content: [
			new Flex( ),
			new Button( { label: "Next", click: ( ) => {
				if( slides.isLastPage( ) ) {
					slides.select( slides.enumPageNames( )[0] );
				}
				else {
					slides.selectNextPage( );
				}
			} } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "AssistBox",
	category: "Layout containers",
	description: "A StackBox that goes from page to page in their order: for a wizard or a carousel.",
	usage: {
		create: ( props ) => new AssistBox( { ...props, cls: "slides", items: [
			{ name: "home", content: new Label( { cls: "slide", icon: icon_home, text: "Home" } ) },
			{ name: "star", content: new Label( { cls: "slide", icon: icon_star, text: "Star" } ) },
			{ name: "heart", content: new Label( { cls: "slide", icon: icon_heart, text: "Heart" } ) },
		] } ),
		extra: "items",
		props: { default: "home", width: 320, height: 140 },
		controls: [
			{ name: "default", type: "options", options: [
				{ id: "home", text: "home" },
				{ id: "star", text: "star" },
				{ id: "heart", text: "heart" },
			] },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 80, max: 240, step: 20, live: true },
		],
	},
	demos: [ wizard, carousel ],
};

export default page;
