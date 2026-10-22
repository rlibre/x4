/**
 * Spreadsheet: the page of the gallery
 */

import { HBox, Label, Select, Spreadsheet, SpreadsheetColumn, Store, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./spreadsheet.scss";

// the store of the configurator and of the examples after the first one:
// a row per product; columns 0: name, 1: quantity, 2: price, 3: in stock
function stockStore( ) {
	const store = new Store( );

	store.lock( );
	store.setData( 0, 0, "Keyboard" ); store.setData( 0, 1, 12 ); store.setData( 0, 2, 49.9 ); store.setData( 0, 3, true );
	store.setData( 1, 0, "Mouse" ); store.setData( 1, 1, 0 ); store.setData( 1, 2, 19.5 ); store.setData( 1, 3, false );
	store.setData( 2, 0, "Screen" ); store.setData( 2, 1, 4 ); store.setData( 2, 2, 229 ); store.setData( 2, 3, true );
	store.setData( 3, 0, "Cable" ); store.setData( 3, 1, 40 ); store.setData( 3, 2, 7.9 ); store.setData( 3, 3, true );
	store.setData( 4, 0, "Webcam" ); store.setData( 4, 1, 0 ); store.setData( 4, 2, 59 ); store.setData( 4, 3, false );
	store.setMaxRowCount( 5 );
	store.unlock( );

	return store;
}

// the columns of the configurator: the id of a column is its number in the store
const stockColumns: SpreadsheetColumn[] = [
	{ id: 0, title: "Product", width: 160, flex: 1, editable: true },
	{ id: 1, title: "Quantity", width: 100, align: "right", type: "number", editable: true },
	{ id: 2, title: "Price", width: 110, align: "right", type: "money", editable: true },
	{ id: 3, title: "In stock", width: 90, align: "center", type: "checkbox", editable: true },
];

/** @demo A store of cells — A Store holds a value per cell (row, column); the id of a column is its number in the store. */
export function cells( ) {
	const store = new Store( );

	store.lock( );		// one redraw at the end
	for( let row = 0; row < 20; row++ ) {
		store.setData( row, 0, `Item ${row + 1}` );
		store.setData( row, 1, ( row + 1 ) * 3 );
		store.setData( row, 2, ( row % 4 ) * 25 );
	}
	store.setMaxRowCount( 20 );
	store.unlock( );

	return new Spreadsheet( { height: 240, store, columns: [
		{ id: 0, title: "Name", width: 160, flex: 1 },
		{ id: 1, title: "Value", width: 100, align: "right", type: "number" },
		{ id: 2, title: "Done", width: 140, type: "percent" },
	] } );
}

/** @demo Edition — editable: F2, Enter, a double click or a key edits a cell; cellChange can refuse a value (preventDefault) or change it. */
export function edition( ) {
	const label = new Label( { text: "Edit a cell: a negative quantity is refused." } );

	return new VBox( { content: [
		new Spreadsheet( { height: 220, store: stockStore( ), columns: [
			{ id: 0, title: "Product", width: 160, flex: 1, editable: true },
			{ id: 1, title: "Quantity", width: 100, align: "right", type: "number", editable: true },
			{ id: 2, title: "Price", width: 110, align: "right", type: "money", editable: true },
		], cellChange: ( ev ) => {
			if( ev.colId == 1 && ev.value < 0 ) {
				ev.preventDefault( );
				label.setText( "Refused: a quantity is never negative." );
			}
			else {
				label.setText( `Row ${ev.row + 1}: ${ev.oldValue} → ${ev.value}` );
			}
		} } ),
		label,
	] } );
}

/** @demo A select in a cell — The store holds the id; the editor is a Select, the formatter shows the text of the id. */
export function editor( ) {
	const states = [
		{ id: 1, text: "To do" },
		{ id: 2, text: "In progress" },
		{ id: 3, text: "Done" },
	];

	const store = new Store( );
	store.setData( 0, 0, "Write the specs" ); store.setData( 0, 1, 3 );
	store.setData( 1, 0, "Draw the screens" ); store.setData( 1, 1, 2 );
	store.setData( 2, 0, "Write the code" ); store.setData( 2, 1, 1 );
	store.setMaxRowCount( 3 );

	return new Spreadsheet( { height: 160, store, columns: [
		{ id: 0, title: "Task", width: 200, flex: 1, editable: true },
		{ id: 1, title: "State", width: 160, editable: true,
			formatter: ( id ) => states.find( s => s.id === id ).text,
			editor: ( row, col, value ) => new Select( { items: states, value } ),
		},
	] } );
}

/** @demo Rows and selection — rowClassifier gives a class to a row (here the products out of stock); selectionChange gives the cells selected. */
export function rows( ) {
	const store = stockStore( );
	const label = new Label( { text: "Click a cell" } );

	return new VBox( { content: [
		new Spreadsheet( { height: 220, store, cls: "stock", columns: [
			{ id: 0, title: "Product", width: 160, flex: 1 },
			{ id: 1, title: "Quantity", width: 100, align: "right", type: "number" },
		],
		rowClassifier: ( row ) => store.getData( row, 1 ) == 0 ? "out" : "",
		selectionChange: ( ev ) => {
			label.setText( ev.empty ? "Nothing selected" : ev.selection.map( c => `row ${c.row + 1}, col ${c.col + 1}` ).join( "; " ) );
		} } ),
		label,
	] } );
}

const page: DemoComponent = {
	name: "Spreadsheet",
	category: "Lists / grids / trees",
	description: "An editable grid of cells, backed by a Store (a value per row and column), with a header, a fixed column if needed, and inline editors.",
	imports: [ "Spreadsheet", "Store" ],
	usage: {
		create: ( props ) => new Spreadsheet( { ...props, store: stockStore( ), columns: stockColumns } ),
		extra: "store, columns",
		props: { enterMove: "down", footer: false, disabled: false, width: 520, height: 220 },
		controls: [
			{ name: "enterMove", type: "options", options: [
				{ id: "down", text: "down" },
				{ id: "right", text: "right" },
				{ id: "none", text: "none" },
			] },
			{ name: "footer", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 300, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 400, step: 20, live: true },
		],
	},
	demos: [ cells, edition, editor, rows ],
};

export default page;
