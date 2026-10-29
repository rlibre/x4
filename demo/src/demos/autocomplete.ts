/**
 * AutoComplete: the page of the gallery
 */

import { AutoComplete, EvSearch, HBox, Label, ListItem, VBox } from 'x4js';
import { DemoComponent } from '../types';

// the search of the configurator: the cities whose name holds the text
const cities: ListItem[] = [
	{ id: "75001", text: "Paris" },
	{ id: "69001", text: "Lyon" },
	{ id: "13001", text: "Marseille" },
	{ id: "59000", text: "Lille" },
	{ id: "38000", text: "Grenoble" },
	{ id: "44000", text: "Nantes" },
];

function searchCities( ev: EvSearch ) {
	ev.setItems( cities.filter( c => ( c.text as string ).toLowerCase( ).includes( ev.text.toLowerCase( ) ) ) );
}

/** @demo Free text — search gives the suggestions of a text; change gives the value when the field is left or an item picked. */
export function freeText( ) {
	const label = new Label( { text: "" } );
	const fruits = [ "Apple", "Apricot", "Banana", "Blackberry", "Cherry", "Grape" ];

	return new VBox( { content: [
		new AutoComplete( { label: "Fruit", labelWidth: 80, width: 320, placeholder: "type a, b or c", search: ( ev ) => {
			const found = fruits.filter( f => f.toLowerCase( ).startsWith( ev.text.toLowerCase( ) ) );
			ev.setItems( found.map( f => ( { id: f, text: f } ) ) );
		}, change: ( ev ) => label.setText( `change: "${ev.value}", item: ${ev.item ? ev.item.id : "null"}` ) } ),
		label,
	] } );
}

/** @demo Strict — Only an item of the suggestions is accepted: a text typed and not picked goes back to the last value. */
export function strict( ) {
	const label = new Label( { text: "" } );
	const colors = [ "Red", "Green", "Blue", "Yellow", "Black", "White" ];

	return new VBox( { content: [
		new AutoComplete( { label: "Color", labelWidth: 80, width: 320, strict: true, search: ( ev ) => {
			const found = colors.filter( c => c.toLowerCase( ).includes( ev.text.toLowerCase( ) ) );
			ev.setItems( found.map( c => ( { id: c.toLowerCase( ), text: c } ) ) );
		}, change: ( ev ) => label.setText( `change: "${ev.value}"` ) } ),
		label,
	] } );
}

/** @demo By id — itemValue: "id" writes the id of the item picked in the field: here the zip code of a city. */
export function byId( ) {
	const towns: ListItem[] = [
		{ id: "75001", text: "Paris" },
		{ id: "69001", text: "Lyon" },
		{ id: "13001", text: "Marseille" },
		{ id: "38000", text: "Grenoble" },
	];

	return new AutoComplete( { label: "Zip code", labelWidth: 80, width: 320, itemValue: "id", strict: true, placeholder: "type a city", search: ( ev ) => {
		ev.setItems( towns.filter( t => ( t.text as string ).toLowerCase( ).includes( ev.text.toLowerCase( ) ) ) );
	} } );
}

/** @demo From a server — setItems may be called later: an answer that comes after a newer search is ignored. */
export function server( ) {
	const status = new Label( { text: "" } );
	const names = [ "Alice", "Albert", "Bernard", "Beatrice", "Charles", "Chloe" ];

	return new HBox( { content: [
		new AutoComplete( { label: "Customer", labelWidth: 80, width: 320, delay: 300, search: ( ev ) => {
			status.setText( `searching "${ev.text}"...` );
			// a fake server: answers after 200 to 700 ms
			setTimeout( ( ) => {
				status.setText( "" );
				const found = names.filter( n => n.toLowerCase( ).startsWith( ev.text.toLowerCase( ) ) );
				ev.setItems( found.map( n => ( { id: n, text: n } ) ) );
			}, 200 + Math.random( ) * 500 );
		} } ),
		status,
	] } );
}

const page: DemoComponent = {
	name: "AutoComplete",
	category: "Input components",
	description: "A text field that asks for suggestions while the user types (the search event), from a list or a server. ↓ opens the list: the last suggestions, or a search of the text as it is, even empty.",
	usage: {
		create: ( props ) => new AutoComplete( { ...props, search: searchCities } ),
		extra: "search: searchCities",
		props: { label: "City", labelWidth: 60, placeholder: "type a few letters", strict: false, itemValue: "text", minChars: 1, delay: 250, width: 320, cls: "" },
		controls: [
			{ name: "label", type: "string" },
			{ name: "labelWidth", type: "number", min: 0, max: 200, step: 10, live: true },
			{ name: "placeholder", type: "string" },
			{ name: "strict", type: "boolean" },
			{ name: "itemValue", type: "options", options: [
				{ id: "text", text: "text" },
				{ id: "id", text: "id" },
			] },
			{ name: "minChars", type: "number", min: 0, max: 5, step: 1, live: true },
			{ name: "delay", type: "number", min: 0, max: 1000, step: 50, live: true },
			{ name: "width", type: "number", min: 200, max: 480, step: 20, live: true },
			{ name: "cls", type: "options", options: [
				{ id: "", text: "default" },
				{ id: "label-top", text: "label-top" },
			] },
		],
	},
	demos: [ freeText, strict, byId, server ],
};

export default page;
