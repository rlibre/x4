/**
 * ScrollView: the page of the gallery
 */

import { Button, HBox, Label, ScrollView, SimpleText, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./scrollview.scss";

/** @demo Long content — A ScrollView fills the box it is in; what is put in its viewport scrolls. */
export function longContent( ) {
	const scroller = new ScrollView( { } );

	const lines = [];
	for( let i = 1; i <= 40; i++ ) {
		lines.push( new SimpleText( { text: `Line ${i}` } ) );
	}
	scroller.getViewport( ).setContent( lines );

	// the box gives the size: the ScrollView takes all of it
	return new VBox( { cls: "scroll-frame", width: 260, height: 180, content: scroller } );
}

/** @demo Both ways — A content wider and higher than the box scrolls in both directions. */
export function bothWays( ) {
	const scroller = new ScrollView( { } );
	scroller.getViewport( ).setContent( new VBox( { cls: "big", width: 900, height: 600, content: [
		new SimpleText( { text: "Top left" } ),
		new SimpleText( { cls: "far", text: "Bottom right, 900 x 600" } ),
	] } ) );

	return new VBox( { cls: "scroll-frame", width: 360, height: 180, content: scroller } );
}

/** @demo Appending — Items appended to the viewport; the view scrolled to the last one. */
export function appending( ) {
	let count = 0;
	const scroller = new ScrollView( { } );
	const viewport = scroller.getViewport( );

	return new HBox( { content: [
		new VBox( { cls: "scroll-frame", width: 260, height: 160, content: scroller } ),
		new Button( { label: "Add a line", click: ( ) => {
			count++;
			const line = new Label( { text: `Message ${count}` } );
			viewport.appendContent( line );
			line.scrollIntoView( { block: "nearest" } );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "ScrollView",
	category: "Sizers / viewport / misc",
	description: "A box that scrolls its viewport. It fills the box it is put in (absolute, 100%): that box gives its size.",
	imports: [ "ScrollView" ],
	demos: [ longContent, bothWays, appending ],
};

export default page;
