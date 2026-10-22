/**
 * GridBox: the page of the gallery
 */

import { Button, GridBox, HBox, Label, SimpleText, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./gridbox.scss";

/** @demo Cells — Each item is put in its row and column (from 0); columns and rows: a count, or the CSS of the tracks. */
export function cells( ) {
	return new GridBox( {
		cls: "cells",
		columns: 3,
		rows: [ "auto", "60px" ],
		items: [
			{ row: 0, col: 0, item: new SimpleText( { text: "row 0, col 0" } ) },
			{ row: 0, col: 1, item: new SimpleText( { text: "row 0, col 1" } ) },
			{ row: 0, col: 2, item: new SimpleText( { text: "row 0, col 2" } ) },
			{ row: 1, col: 0, item: new SimpleText( { text: "row 1, col 0" } ) },
			{ row: 1, col: 2, item: new SimpleText( { text: "row 1, col 2" } ) },
		],
	} );
}

/** @demo Areas — setTemplate names the areas of the grid; each child says its area (gridArea). */
export function areas( ) {
	const grid = new GridBox( { cls: "cells", height: 200, columns: [ "140px", "1fr" ], rows: [ "auto", "1fr", "auto" ] } );
	grid.setTemplate( [
		"head head",
		"side main",
		"foot foot",
	] );
	grid.setContent( [
		new SimpleText( { text: "head", style: { gridArea: "head" } } ),
		new SimpleText( { text: "side", style: { gridArea: "side" } } ),
		new SimpleText( { text: "main", style: { gridArea: "main" } } ),
		new SimpleText( { text: "foot", style: { gridArea: "foot" } } ),
	] );
	return grid;
}

/** @demo Columns changed — Children without a cell flow in the grid; setColCount lays them out on another count of columns. */
export function columns( ) {
	const grid = new GridBox( { cls: "cells", columns: 3 } );
	grid.setContent( [
		new SimpleText( { text: "A" } ),
		new SimpleText( { text: "B" } ),
		new SimpleText( { text: "C" } ),
		new SimpleText( { text: "D" } ),
		new SimpleText( { text: "E" } ),
		new SimpleText( { text: "F" } ),
	] );

	return new VBox( { content: [
		new HBox( { content: [
			new Label( { text: "Columns:" } ),
			new Button( { label: "2", cls: "outline", click: ( ) => grid.setColCount( 2 ) } ),
			new Button( { label: "3", cls: "outline", click: ( ) => grid.setColCount( 3 ) } ),
			new Button( { label: "6", cls: "outline", click: ( ) => grid.setColCount( 6 ) } ),
		] } ),
		grid,
	] } );
}

const page: DemoComponent = {
	name: "GridBox",
	category: "Layout containers",
	description: "A box that lays its children on a CSS grid: its rows and columns as a count or as tracks, each item in its cell, or named areas.",
	usage: {
		create: ( props ) => new GridBox( { ...props, cls: "cells", items: [
			{ row: 0, col: 0, item: new SimpleText( { text: "0, 0" } ) },
			{ row: 0, col: 1, item: new SimpleText( { text: "0, 1" } ) },
			{ row: 1, col: 0, item: new SimpleText( { text: "1, 0" } ) },
			{ row: 1, col: 1, item: new SimpleText( { text: "1, 1" } ) },
			{ row: 2, col: 2, item: new SimpleText( { text: "2, 2" } ) },
		] } ),
		extra: "items",
		props: { columns: 3, rows: 3, width: 420, height: 180 },
		controls: [
			{ name: "columns", type: "options", options: [
				{ id: 3, text: "3" },
				{ id: "1fr 2fr 1fr", text: "1fr 2fr 1fr" },
				{ id: "80px 1fr 80px", text: "80px 1fr 80px" },
			] },
			{ name: "rows", type: "options", options: [
				{ id: 3, text: "3" },
				{ id: "auto auto 1fr", text: "auto auto 1fr" },
				{ id: "40px 1fr 40px", text: "40px 1fr 40px" },
			] },
			{ name: "width", type: "number", min: 200, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 260, step: 20, live: true },
		],
	},
	demos: [ cells, areas, columns ],
};

export default page;
