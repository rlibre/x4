/**
 * DragDrop: the page of the gallery
 */

import { Component, HBox, Label, VBox, dragManager } from 'x4js';
import { DemoComponent } from '../types';

import "./dragdrop.scss";

/** @demo Between two lists — registerDraggableElement makes a card something to drag, registerDropTarget a column a place to drop it. While it is dragged, a line shows where the card will go: drag gives the point, drop the card. */
export function kanban( ) {
	const column = ( title: string, cards: string[] ) => {
		const marker = new Component( { cls: "dd-marker" } );
		const col = new VBox( { cls: "dd-column", content: [
			new Label( { cls: "title", text: title } ),
			...cards.map( text => {
				const card = new Label( { cls: "dd-card", text } );
				dragManager.registerDraggableElement( card );
				return card;
			} ),
		] } );

		// the card the pointer is over in its upper half: the dragged one goes before it; none: at the end
		const placeAt = ( y: number ): Element => {
			for( const card of col.queryAll( ".dd-card:not(.dragging)" ) ) {
				const rc = card.dom.getBoundingClientRect( );
				if( y < rc.top + window.scrollY + rc.height / 2 ) {
					return card.dom;
				}
			}
			return null;
		};

		dragManager.registerDropTarget( col, ( cmd, el, infos ) => {
			if( cmd == "drag" ) {
				col.dom.insertBefore( marker.dom, placeAt( infos.pt.y ) );
			}
			else if( cmd == "drop" ) {
				if( el ) {
					col.dom.insertBefore( el.dom, placeAt( infos.pt.y ) );
				}
				marker.dom.remove( );
			}
			else if( cmd == "leave" ) {
				marker.dom.remove( );
			}
		} );

		return col;
	};

	return new HBox( { cls: "dd-board", content: [
		column( "To do", [ "Write the doc", "Fix the grid", "Answer the mails" ] ),
		column( "Done", [ "Release 2.3.27" ] ),
	] } );
}

/** @demo A filter — The third argument says what a target takes: Even accepts the even numbers only; over it, an odd one shows the sign of the browser that refuses. */
export function filter( ) {
	const chips = [ 1, 2, 3, 4, 5, 6 ].map( n => {
		const chip = new Label( { cls: "dd-card", text: `${n}` } );
		chip.setData( "n", `${n}` );
		dragManager.registerDraggableElement( chip );
		return chip;
	} );

	const pool = new VBox( { cls: "dd-column", content: [ new Label( { cls: "title", text: "Numbers" } ), ...chips ] } );
	const even = new VBox( { cls: "dd-column", content: new Label( { cls: "title", text: "Even" } ) } );

	dragManager.registerDropTarget( pool, ( cmd, el ) => cmd == "drop" && el && pool.appendContent( el ) );
	dragManager.registerDropTarget( even, ( cmd, el ) => cmd == "drop" && el && even.appendContent( el ),
		( el ) => el && Number( el.getData( "n" ) ) % 2 == 0 );

	return new HBox( { cls: "dd-board", content: [ pool, even ] } );
}

/** @demo Files from the desktop — A target also gets the files dropped from the system: el is then empty, infos.data.files has them. */
export function files( ) {
	const list = new Label( { text: "Drop files here" } );
	const zone = new VBox( { cls: "dd-column dd-files", content: list } );

	dragManager.registerDropTarget( zone, ( cmd, el, infos ) => {
		if( cmd == "drop" && infos.data.files.length ) {
			list.setText( Array.from( infos.data.files ).map( f => `${f.name} (${f.size} bytes)` ).join( ", " ) );
		}
	} );

	return zone;
}

const page: DemoComponent = {
	name: "DragDrop",
	category: "Extra",
	description: "dragManager makes a component something the user drags, and another one a place where it is dropped: components of the application, or files from the desktop.",
	imports: [ "dragManager" ],
	demos: [ kanban, filter, files ],
};

export default page;
