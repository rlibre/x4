/**
 * PropertyGrid: the page of the gallery
 */

import { Button, HBox, Label, PropertyGroup, PropertyGrid, VBox } from 'x4js';
import { icon_gear } from '../icons';
import { DemoComponent } from '../types';

import "./propertygrid.scss";

// the groups of the configurator
function shapeGroups( ): PropertyGroup[] {
	return [ { title: "Shape", items: [
		{ name: "name", type: "string", value: "Circle" },
		{ name: "radius", type: "number", value: 40, min: 1, max: 200 },
		{ name: "filled", type: "boolean", value: true },
		{ name: "color", type: "color", value: "#569cd6" },
	] } ];
}

/** @demo Row types — A row per property: boolean, number, string, password, options, color, label, button; callback( name, value ) on each change. */
export function types( ) {
	const label = new Label( { text: "Change a value" } );
	const changed = ( name: string, value: any ) => label.setText( `${name} = ${value}` );

	return new VBox( { content: [
		new PropertyGrid( { width: 420, height: 370, groups: [ { title: "Properties", items: [
			{ name: "visible", type: "boolean", value: true, callback: changed },
			{ name: "size", type: "number", value: 12, min: 8, max: 72, step: 1, live: true, callback: changed },
			{ name: "title", type: "string", value: "Hello", callback: changed },
			{ name: "secret", type: "password", value: "1234", callback: changed },
			{ name: "align", type: "options", value: "left", options: [
				{ id: "left", text: "Left" },
				{ id: "center", text: "Center" },
				{ id: "right", text: "Right" },
			], callback: changed },
			{ name: "color", type: "color", value: "#d65656", callback: changed },
			{ name: "version", title: "Version", type: "label", value: "2.3.22" },
			{ name: "reset", type: "button", value: "Reset", callback: changed },
		] } ] } ),
		label,
	] } );
}

/** @demo Groups — Several groups, each with its title, an icon, a description; collapsible: true, or -1 to start collapsed. */
export function groups( ) {
	return new PropertyGrid( { width: 420, height: 320, groups: [
		{ title: "General", icon: icon_gear, desc: "What everybody sees.", items: [
			{ name: "label", title: "Label", type: "string", value: "OK" },
			{ name: "enabled", title: "Enabled", type: "boolean", value: true },
		] },
		{ title: "Layout", collapsible: true, items: [
			{ name: "width", title: "Width", type: "number", value: 120 },
			{ name: "height", title: "Height", type: "number", value: 32 },
		] },
		{ title: "Advanced", collapsible: -1, desc: "Collapsed at first: a click on the arrow opens it.", items: [
			{ name: "tabindex", title: "Tab index", type: "number", value: 0 },
		] },
	] } );
}

/** @demo Editing an object — value can be a function of the name: here the grid reads an object, and its callback writes it back. */
export function object( ) {
	const shape: Record<string, any> = { x: 10, y: 20, text: "Box", border: true };
	const json = new Label( { cls: "json", text: JSON.stringify( shape ) } );

	const read = ( name: string ) => shape[name];
	const write = ( name: string, value: any ) => {
		shape[name] = value;
		json.setText( JSON.stringify( shape ) );
	};

	return new HBox( { content: [
		new PropertyGrid( { width: 320, height: 220, groups: [ { title: "Shape", items: [
			{ name: "x", type: "number", value: read, live: true, callback: write },
			{ name: "y", type: "number", value: read, live: true, callback: write },
			{ name: "text", type: "string", value: read, callback: write },
			{ name: "border", type: "boolean", value: read, callback: write },
		] } ] } ),
		json,
	] } );
}

/** @demo From the code — setPropValue changes the editor of a property; enableGroup enables or disables the rows of a named group. */
export function api( ) {
	const grid = new PropertyGrid( { width: 360, height: 200, groups: [
		{ title: "Font", name: "font", items: [
			{ name: "family", type: "options", value: "sans", options: [
				{ id: "sans", text: "Sans serif" },
				{ id: "serif", text: "Serif" },
				{ id: "mono", text: "Monospace" },
			] },
			{ name: "fontsize", title: "size", type: "number", value: 14 },
			{ name: "bold", type: "boolean", value: false },
		] },
	] } );

	let enabled = true;

	return new VBox( { content: [
		grid,
		new HBox( { content: [
			new Button( { label: "Title style", cls: "outline", click: ( ) => {
				grid.setPropValue( "family", "serif" );
				grid.setPropValue( "fontsize", 24 );
				grid.setPropValue( "bold", true );
			} } ),
			new Button( { label: "Enable / disable", cls: "outline", click: ( ) => {
				enabled = !enabled;
				grid.enableGroup( "font", enabled );
			} } ),
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "PropertyGrid",
	category: "Lists / grids / trees",
	description: "Properties in two columns, their names and their editors, by groups: the editor follows the type of the property, and a callback gets each change.",
	imports: [ "PropertyGrid", "PropertyGroup" ],
	usage: {
		create: ( props ) => new PropertyGrid( { ...props, groups: shapeGroups( ) } ),
		extra: "groups",
		props: { disabled: false, width: 360, height: 220 },
		controls: [
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 240, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 400, step: 20, live: true },
		],
	},
	demos: [ types, groups, object, api ],
};

export default page;
