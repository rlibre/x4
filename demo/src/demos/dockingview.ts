/**
 * DockingView: the page of the gallery
 */

import { Button, DockingView, HBox, Label, SimpleText, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./dockingview.scss";

/** @demo Tools and a content — Two tools in the bands of the left and of the right, a content between them: drag a title to move a panel. */
export function tools( ) {
	return new DockingView( {
		cls: "dock",
		height: 300,
		panels: [
			{ id: "files", title: "Files", content: new SimpleText( { text: "src/\nmain.ts\nmain.scss" } ) },
			{ id: "outline", title: "Outline", content: new SimpleText( { text: "class App\nfunction main" } ) },
			{ id: "props", title: "Properties", content: new SimpleText( { text: "width: 200\nheight: 100" } ) },
			{ id: "editor", kind: "content", content: new SimpleText( { text: "The content: what is worked on." } ) },
		],
		layout: {
			left: { size: 160, root: { type: "split", dir: "column", size: 0, children: [
				{ type: "stack", size: 0, panels: [ "files" ], active: "files" },
				{ type: "stack", size: 0, panels: [ "outline" ], active: "outline" },
			] } },
			right: { size: 160, root: { type: "stack", size: 0, panels: [ "props" ], active: "props" } },
			content: { type: "stack", size: 0, panels: [ "editor" ], active: "editor" },
			floats: [],
			hidden: [],
		},
	} );
}

/** @demo Contents as tabs — Several contents in one stack: a tab each; drag a tab to a side of the other to split them. */
export function contents( ) {
	return new DockingView( {
		cls: "dock",
		height: 260,
		panels: [
			{ id: "main", title: "main.ts", kind: "content", content: new SimpleText( { text: "main.ts" } ) },
			{ id: "style", title: "main.scss", kind: "content", content: new SimpleText( { text: "main.scss" } ) },
			{ id: "readme", title: "README.md", kind: "content", content: new SimpleText( { text: "README.md" } ) },
		],
		layout: {
			left: { size: 0, root: null },
			right: { size: 0, root: null },
			content: { type: "stack", size: 0, panels: [ "main", "style", "readme" ], active: "main" },
			floats: [],
			hidden: [],
		},
	} );
}

/** @demo Closed and shown again — With closable, a tool can be closed; showPanel shows it again, resetLayout goes back to the layout of the props. */
export function showPanel( ) {
	const state = new Label( { text: "" } );
	const view = new DockingView( {
		cls: "dock",
		height: 260,
		closable: true,
		floating: true,
		panels: [
			{ id: "files", title: "Files", content: new SimpleText( { text: "Close me with the button of my title." } ) },
			{ id: "editor", kind: "content", content: new SimpleText( { text: "The content." } ) },
		],
		layout: {
			left: { size: 200, root: { type: "stack", size: 0, panels: [ "files" ], active: "files" } },
			right: { size: 0, root: null },
			content: { type: "stack", size: 0, panels: [ "editor" ], active: "editor" },
			floats: [],
			hidden: [],
		},
		layoutChange: ( ) => state.setText( `layoutChange: files ${view.isPanelVisible( "files" ) ? "shown" : "hidden"}` ),
	} );

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Show Files", click: ( ) => view.showPanel( "files" ) } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => view.resetLayout( ) } ),
			state,
		] } ),
		view,
	] } );
}

/** @demo A band at the bottom — sides lets a tool be docked under the contents: here a log, wide and low. */
export function bottom( ) {
	return new DockingView( {
		cls: "dock",
		height: 280,
		panels: [
			{ id: "files", title: "Files", content: new SimpleText( { text: "src/" } ) },
			{ id: "log", title: "Log", sides: [ "bottom", "left" ], content: new SimpleText( { text: "12:00 build started\n12:01 build done" } ) },
			{ id: "editor", kind: "content", content: new SimpleText( { text: "The content." } ) },
		],
		layout: {
			left: { size: 160, root: { type: "stack", size: 0, panels: [ "files" ], active: "files" } },
			right: { size: 0, root: null },
			bottom: { size: 90, root: { type: "stack", size: 0, panels: [ "log" ], active: "log" } },
			content: { type: "stack", size: 0, panels: [ "editor" ], active: "editor" },
			floats: [],
			hidden: [],
		},
	} );
}

const page: DemoComponent = {
	name: "DockingView",
	category: "Layout containers",
	description: "Panels the user arranges by dragging their title: tools docked in bands on the sides (or floating), and the contents between them, split or as tabs.",
	usage: {
		create: ( props ) => new DockingView( { ...props, cls: "dock", panels: [
			{ id: "files", title: "Files", content: new SimpleText( { text: "Drag my title" } ) },
			{ id: "props", title: "Properties", content: new SimpleText( { text: "Or mine" } ) },
			{ id: "editor", kind: "content", content: new SimpleText( { text: "The content" } ) },
		], layout: {
			left: { size: 150, root: { type: "stack", size: 0, panels: [ "files" ], active: "files" } },
			right: { size: 150, root: { type: "stack", size: 0, panels: [ "props" ], active: "props" } },
			content: { type: "stack", size: 0, panels: [ "editor" ], active: "editor" },
			floats: [],
			hidden: [],
		} } ),
		extra: "panels, layout",
		props: { floating: false, closable: false, width: 560, height: 260 },
		controls: [
			{ name: "floating", type: "boolean" },
			{ name: "closable", type: "boolean" },
			{ name: "width", type: "number", min: 360, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 160, max: 400, step: 20, live: true },
		],
	},
	demos: [ tools, contents, showPanel, bottom ],
};

export default page;
