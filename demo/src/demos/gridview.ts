/**
 * Gridview: the page of the gallery
 */

import { Application, Button, DataModel, DataStore, GridColumn, Gridview, HBox, Input, Label, VBox, data } from 'x4js';
import { icon_trash } from '../icons';
import { DemoComponent } from '../types';

import "./gridview.scss";

// the model and the store of the configurator and of the examples after the first one
class CityModel extends DataModel {
	@data.id( ) id: number;
	@data.string( ) name: string;
	@data.string( ) country: string;
	@data.int( ) population: number;
}

const cities = [
	{ id: 1, name: "Paris", country: "France", population: 2102650 },
	{ id: 2, name: "Lyon", country: "France", population: 522250 },
	{ id: 3, name: "Geneva", country: "Switzerland", population: 203856 },
	{ id: 4, name: "Turin", country: "Italy", population: 841600 },
	{ id: 5, name: "Munich", country: "Germany", population: 1512491 },
	{ id: 6, name: "Barcelona", country: "Spain", population: 1620343 },
	{ id: 7, name: "Lausanne", country: "Switzerland", population: 140202 },
	{ id: 8, name: "Marseille", country: "France", population: 873076 },
	{ id: 9, name: "Milan", country: "Italy", population: 1371498 },
	{ id: 10, name: "Freiburg", country: "Germany", population: 231848 },
];

function cityStore( ) {
	return new DataStore( { model: new CityModel( ), data: cities } );
}

// the columns of the configurator; footer_val is shown with footer: true
const cityColumns: GridColumn[] = [
	{ id: "name", title: "City", width: 160, flex: 1, footer_val: "10 cities" },
	{ id: "country", title: "Country", width: 140 },
	{ id: "population", title: "Population", width: 120, align: "right", type: "number", footer_val: "9 419 814" },
];

/** @demo A model and its store — The fields of a model are declared with the decorators of data; the store holds the records, the columns say what is shown. */
export function store( ) {
	class Person extends DataModel {
		@data.id( ) id: number;
		@data.string( ) name: string;
		@data.string( ) job: string;
		@data.int( ) age: number;
	}

	const persons = new DataStore( { model: new Person( ), data: [
		{ id: 1, name: "Alice", job: "Engineer", age: 34 },
		{ id: 2, name: "Bruno", job: "Designer", age: 28 },
		{ id: 3, name: "Chloé", job: "Manager", age: 45 },
		{ id: 4, name: "David", job: "Developer", age: 39 },
	] } );

	return new Gridview( { height: 200, store: persons, columns: [
		{ id: "id", title: "#", width: 50, align: "right" },
		{ id: "name", title: "Name", width: 160 },
		{ id: "job", title: "Job", width: 160, flex: 1 },
		{ id: "age", title: "Age", width: 80, align: "right", type: "number" },
	] } );
}

/** @demo Column types — The type of a column formats its cells: number, money, percent (a bar), checkbox, date. */
export function types( ) {
	// a model can also be given its fields, without a class
	const tasks = new DataStore( {
		model: new DataModel( [
			{ name: "id" },
			{ name: "task", type: "string" },
			{ name: "budget", type: "float" },
			{ name: "progress", type: "int" },
			{ name: "done", type: "bool" },
			{ name: "due", type: "date" },
		] ),
		data: [
			{ id: 1, task: "Specifications", budget: 1200, progress: 100, done: true, due: new Date( 2026, 0, 15 ) },
			{ id: 2, task: "Design", budget: 3500.5, progress: 80, done: false, due: new Date( 2026, 2, 1 ) },
			{ id: 3, task: "Development", budget: 12000, progress: 35, done: false, due: new Date( 2026, 5, 30 ) },
			{ id: 4, task: "Tests", budget: 2800, progress: 0, done: false, due: new Date( 2026, 7, 15 ) },
		],
	} );

	return new Gridview( { height: 200, store: tasks, columns: [
		{ id: "task", title: "Task", width: 160, flex: 1 },
		{ id: "budget", title: "Budget", width: 120, align: "right", type: "money" },
		{ id: "progress", title: "Progress", width: 120, type: "percent" },
		{ id: "done", title: "Done", width: 70, align: "center", type: "checkbox" },
		{ id: "due", title: "Due", width: 110, type: "date" },
	] } );
}

/** @demo Locale — Application.setLocale( locale, currency ) changes the formats of the numbers, amounts and dates; a grid drawn after it uses them. */
export function locale( ) {
	const view = new VBox( { content: types( ) } );
	const use = ( locale: string, currency: string ) => {
		Application.setLocale( locale, currency );
		view.setContent( types( ) );
	};

	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "fr-FR, EUR", click: ( ) => use( "fr-FR", "EUR" ) } ),
			new Button( { label: "en-US, USD", click: ( ) => use( "en-US", "USD" ) } ),
			new Button( { label: "de-CH, CHF", click: ( ) => use( "de-CH", "CHF" ) } ),
		] } ),
		view,
	] } );
}

/** @demo Selection — With multisel, Ctrl+click adds a row, Shift+click a range; selectionChange gives the records selected. */
export function selection( ) {
	const label = new Label( { text: "Nothing selected" } );

	return new VBox( { content: [
		new Gridview( { height: 220, multisel: true, store: cityStore( ), columns: [
			{ id: "name", title: "City", width: 160, flex: 1 },
			{ id: "country", title: "Country", width: 140 },
		], selectionChange: ( ev ) => {
			label.setText( ev.empty ? "Nothing selected" : "Selected: " + ev.selection.map( rec => rec.name ).join( ", " ) );
		} } ),
		label,
	] } );
}

/** @demo Sort and filter — The first sort is a prop (a click on a title sorts too); getView( ).filter keeps the records a function accepts. */
export function filter( ) {
	const grid = new Gridview( { height: 220, store: cityStore( ), sort: { field_id: "population", asc: false }, columns: [
		{ id: "name", title: "City", width: 160, flex: 1 },
		{ id: "country", title: "Country", width: 140 },
		{ id: "population", title: "Population", width: 120, align: "right", type: "number" },
	] } );

	return new VBox( { content: [
		new Input( { type: "text", width: 240, placeholder: "City or country", change: ( ev ) => {
			const text = ev.value.toLowerCase( );
			if( text ) {
				grid.getView( ).filter( { op: ( rec ) => ( rec.name + " " + rec.country ).toLowerCase( ).includes( text ) } );
			}
			else {
				grid.getView( ).filter( );
			}
		} } ),
		grid,
	] } );
}

/** @demo Renderer — A column that is not a field is drawn by its renderer: here a button that deletes the record from the store, and the grid follows. */
export function renderer( ) {
	const records = cityStore( );

	return new Gridview( { height: 260, store: records, columns: [
		{ id: "name", title: "City", width: 160, flex: 1 },
		{ id: "population", title: "Population", width: 120, align: "right", type: "number" },
		{ id: "actions", title: "", width: 60, align: "center", renderer: ( rec ) => new Button( {
			cls: "delete",
			icon: icon_trash,
			tooltip: "Delete",
			click: ( ) => records.delete( rec.id ),
		} ) },
	] } );
}

const page: DemoComponent = {
	name: "Gridview",
	category: "Lists / grids / trees",
	description: "A grid of records: its rows come from a DataStore, its columns say which fields are shown and how. Only the rows in view are built, so it holds large stores.",
	imports: [ "Gridview", "DataStore", "DataModel", "data" ],
	usage: {
		create: ( props ) => new Gridview( { ...props, store: cityStore( ), columns: cityColumns } ),
		extra: "store, columns",
		props: { multisel: false, footer: false, disabled: false, width: 480, height: 240 },
		controls: [
			{ name: "multisel", type: "boolean" },
			{ name: "footer", type: "boolean" },
			{ name: "disabled", type: "boolean" },
			{ name: "width", type: "number", min: 240, max: 600, step: 20, live: true },
			{ name: "height", type: "number", min: 120, max: 400, step: 20, live: true },
		],
	},
	demos: [ store, types, locale, selection, filter, renderer ],
};

export default page;
