/**
 * Header: the page of the gallery
 */

import { Component, Header, Listbox, VBox } from 'x4js';
import { icon_calendar, icon_file, icon_user } from '../icons';
import { DemoComponent } from '../types';

import "./header.scss";

/** @demo Columns of a Listbox — The header of a Listbox: its columns size the text and the sub_cols of the items; drag a border to resize. */
export function listColumns( ) {
	return new Listbox( { width: 460, height: 180,
		header: new Header( { items: [
			{ title: "Name", width: 200 },
			{ title: "Size", width: 80 },
			{ title: "Modified", width: -1 },
		] } ),
		items: [
			{ id: 1, text: "report.pdf", iconId: icon_file, sub_cols: [ "1.2 MB", "2026-10-02" ] },
			{ id: 2, text: "notes.txt", iconId: icon_file, sub_cols: [ "4 KB", "2026-10-18" ] },
			{ id: 3, text: "photo.jpg", iconId: icon_file, sub_cols: [ "3.4 MB", "2026-09-27" ] },
		],
	} );
}

/** @demo Flex and icons — A negative width is a share of the rest of the width; a double click on a border makes its column flex again. */
export function flexIcons( ) {
	return new Listbox( { width: 520, height: 150,
		header: new Header( { items: [
			{ title: "Who", iconId: icon_user, width: -2 },
			{ title: "When", iconId: icon_calendar, width: -1 },
			{ title: "#", width: 50 },
		] } ),
		items: [
			{ id: 1, text: "Ada Lovelace", sub_cols: [ "1843", "1" ] },
			{ id: 2, text: "Alan Turing", sub_cols: [ "1936", "2" ] },
		],
	} );
}

/** @demo Your own rows — Named columns set --<name>-width on the target: your own CSS gives that width to your cells. */
export function namedColumns( ) {
	const table = new VBox( { cls: "own-table" } );

	table.setContent( [
		new Header( { target: table, items: [
			{ name: "city", title: "City", width: 160 },
			{ name: "country", title: "Country", width: -1 },
		] } ),
		new Component( { cls: "row", content: [
			new Component( { cls: "city", content: "Lyon" } ),
			new Component( { cls: "country", content: "France" } ),
		] } ),
		new Component( { cls: "row", content: [
			new Component( { cls: "city", content: "Torino" } ),
			new Component( { cls: "country", content: "Italy" } ),
		] } ),
	] );

	return table;
}

const page: DemoComponent = {
	name: "Header",
	category: "Sizers / viewport / misc",
	description: "A row of column titles the user resizes. Each width is given to a CSS variable --<name>-width: a Listbox uses it for its columns, your own rows can too.",
	demos: [ listColumns, flexIcons, namedColumns ],
};

export default page;
