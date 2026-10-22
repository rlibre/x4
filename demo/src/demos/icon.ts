/**
 * Icon: the page of the gallery
 */

import { Button, HBox, Icon } from 'x4js';
import { icon_gear, icon_heart, icon_home, icon_star, icon_user } from '../icons';
import { DemoComponent } from '../types';

import "./icon.scss";

/** @demo Inline svg — An iconId that starts with "<svg" is put in the page as it is: CSS gives its size and its color. */
export function inlineSvg( ) {
	return new HBox( { cls: "icon-row", content: [
		new Icon( { iconId: icon_home } ),
		new Icon( { iconId: icon_user } ),
		new Icon( { iconId: icon_gear } ),
		new Icon( { iconId: icon_heart, cls: "red" } ),
	] } );
}

/** @demo Data url — "data:image/svg+xml,<svg..." is read as an inline svg too. */
export function dataUrl( ) {
	const circle = `data:image/svg+xml,<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>`;

	return new HBox( { cls: "icon-row", content: [
		new Icon( { iconId: circle } ),
		new Icon( { iconId: circle, cls: "red" } ),
	] } );
}

/** @demo CSS variable — "var:bell" is the svg set by the code in the variable --bell of <html>: one place to change the icon everywhere. */
export function cssVariable( ) {
	document.documentElement.style.setProperty( "--bell", `<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.9V4a1 1 0 0 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1z"/></svg>` );

	return new HBox( { cls: "icon-row", content: [
		new Icon( { iconId: "var:bell" } ),
		new Icon( { iconId: "var:--bell", cls: "red" } ),
	] } );
}

/** @demo setIcon — setIcon changes the icon shown. */
export function setIcon( ) {
	const icon = new Icon( { iconId: icon_star } );

	return new HBox( { cls: "icon-row", content: [
		icon,
		new Button( { label: "Heart", cls: "outline", click: ( ) => icon.setIcon( icon_heart ) } ),
		new Button( { label: "Star", cls: "outline", click: ( ) => icon.setIcon( icon_star ) } ),
	] } );
}

const page: DemoComponent = {
	name: "Icon",
	category: "Display components",
	description: "An icon: an inline svg, a data url, a CSS variable that holds an svg, an svg file loaded once and kept, or an image.",
	usage: {
		create: ( props ) => new Icon( props ),
		props: { iconId: icon_star, width: 32, height: 32 },
		controls: [
			{ name: "iconId", type: "options", options: [
				{ id: icon_star, text: "star", data: "icon_star" },
				{ id: icon_heart, text: "heart", data: "icon_heart" },
				{ id: icon_home, text: "home", data: "icon_home" },
				{ id: icon_gear, text: "gear", data: "icon_gear" },
			] },
			{ name: "width", type: "number", min: 8, max: 128, step: 4, live: true },
			{ name: "height", type: "number", min: 8, max: 128, step: 4, live: true },
		],
	},
	demos: [ inlineSvg, dataUrl, cssVariable, setIcon ],
};

export default page;
