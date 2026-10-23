/**
 * HSplitBox: the page of the gallery (with VSplitBox, HSizer, VSizer, CSizer)
 */

import { CSizer, HBox, HSizer, HSplitBox, Label, SimpleText, VBox, VSplitBox } from 'x4js';
import { DemoComponent } from '../types';

import "./hsplitbox.scss";

/** @demo Side by side — A sizer is put between the panels: it resizes the panel that is not flex, the flex one takes the rest. */
export function sideBySide( ) {
	return new HSplitBox( { cls: "panes", height: 200, content: [
		new VBox( { width: 200, content: new SimpleText( { text: "200px at first: drag the line on my right." } ) } ),
		new VBox( { flex: 1, content: new SimpleText( { text: "flex: the rest of the width." } ) } ),
	] } );
}

/** @demo VSplitBox — The same, stacked: the sizer changes the height of the panel that is not flex. */
export function stacked( ) {
	return new VSplitBox( { cls: "panes", height: 260, content: [
		new VBox( { flex: 1, content: new SimpleText( { text: "flex: the rest of the height." } ) } ),
		new VBox( { height: 90, content: new SimpleText( { text: "90px at first: drag the line above me." } ) } ),
	] } );
}

/** @demo Nested — A VSplitBox in a HSplitBox: the layout of an editor, a tree on the left, a log at the bottom. */
export function nested( ) {
	return new HSplitBox( { cls: "panes", height: 260, content: [
		new VBox( { width: 160, content: new SimpleText( { text: "Files" } ) } ),
		new VSplitBox( { flex: 1, content: [
			new VBox( { flex: 1, content: new SimpleText( { text: "Editor" } ) } ),
			new VBox( { height: 70, content: new SimpleText( { text: "Log" } ) } ),
		] } ),
		new VBox( { width: 140, content: new SimpleText( { text: "Outline" } ) } ),
	] } );
}

/** @demo HSizer by hand — In any HBox, a sizer you put between two children: HSizer( false ) resizes the one before it, HSizer( ) the one after it; the flex one takes the rest. A SplitBox puts them for you. */
export function bySizer( ) {
	return new HBox( { cls: "panes", height: 120, content: [
		new VBox( { width: 180, content: new SimpleText( { text: "HSizer( false ), on my right, resizes me." } ) } ),
		new HSizer( false ),
		new VBox( { flex: 1, content: new SimpleText( { text: "flex: the rest." } ) } ),
		new HSizer( ),
		new VBox( { width: 180, content: new SimpleText( { text: "HSizer( ), on my left, resizes me." } ) } ),
	] } );
}

/** @demo Edges — A CSizer on the edge of a box resizes the box; its resize event gives the new size. */
export function edges( ) {
	const size = new Label( { text: "Drag the right edge or the corner." } );
	const right = new CSizer( "right" );
	const corner = new CSizer( "bottom-right" );

	right.on( "resize", ( ev ) => size.setText( `${ev.width} x ${ev.height}` ) );
	corner.on( "resize", ( ev ) => size.setText( `${ev.width} x ${ev.height}` ) );

	return new VBox( { height: 220, content: [
		new VBox( { cls: "resizable", width: 240, height: 120, content: [ size, right, corner ] } ),
	] } );
}

const page: DemoComponent = {
	name: "HSplitBox",
	category: "Sizers / viewport / misc",
	description: "Panels side by side that the user resizes by dragging the line between them; VSplitBox stacks them. The sizers they put between their panels can also be placed by hand.",
	imports: [ "HSplitBox", "VSplitBox", "HSizer", "CSizer" ],
	usage: {
		create: ( props ) => new HSplitBox( { ...props, cls: "panes", content: [
			new VBox( { width: 180, content: new SimpleText( { text: "left: 180px" } ) } ),
			new VBox( { flex: 1, content: new SimpleText( { text: "right: flex" } ) } ),
		] } ),
		extra: "content: [ left, right ]",
		props: { width: 520, height: 200 },
		controls: [
			{ name: "width", type: "number", min: 300, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 100, max: 400, step: 20, live: true },
		],
	},
	demos: [ sideBySide, stacked, nested, bySizer, edges ],
};

export default page;
