/**
 * ProgressionBox: the page of the gallery
 */

import { Button, HBox, ProgressionBox } from 'x4js';
import { DemoComponent } from '../types';

import "./progressionbox.scss";

/** @demo The steps of a task — addText( text, percent ) adds a line and moves the bar; done( ) closes the box 5 s later. */
export function steps( ) {
	return new HBox( { content: [
		new Button( { label: "Import 5 files", click: ( ) => {
			const box = new ProgressionBox( "Importing the files" );
			box.show( );

			// a task of your own: here a file every 400 ms, on a named timer of the box
			let file = 0;
			box.setInterval( "step", 400, ( ) => {
				file++;
				box.addText( `file ${file}.csv imported`, file * 20 );

				if( file === 5 ) {
					box.clearInterval( "step" );
					box.done( );
				}
			} );
		} } ),
	] } );
}

/** @demo With errors — addError( text, percent ) shows a line in red; done( ) then shows the OK button that closes the box. */
export function errors( ) {
	return new HBox( { content: [
		new Button( { label: "Check 4 links", click: ( ) => {
			const box = new ProgressionBox( "Checking the links" );
			box.show( );

			let link = 0;
			box.setInterval( "step", 400, ( ) => {
				link++;
				if( link === 3 ) {
					box.addError( `link ${link}: not found`, link * 25 );
				}
				else {
					box.addText( `link ${link}: ok`, link * 25 );
				}

				if( link === 4 ) {
					box.clearInterval( "step" );
					box.done( );
				}
			} );
		} } ),
	] } );
}

/** @demo Sections and warnings — addSection( title, percent ) groups the lines that follow; addWarning in orange; the counts beside OK. */
export function sections( ) {
	return new HBox( { content: [
		new Button( { label: "Import 3 folders", click: ( ) => {
			const box = new ProgressionBox( "Importing the folders" );
			box.show( );

			let step = 0;
			box.setInterval( "step", 250, ( ) => {
				step++;

				// a folder each 4 steps: a section, folded by a click on its title
				if( step % 4 == 1 ) {
					box.addSection( `folder ${( step + 3 ) / 4}`, step * 8 );
				}

				if( step === 3 ) {
					box.addWarning( `file ${step}.csv: 2 empty lines skipped`, step * 8 );
				}
				else if( step === 7 ) {
					box.addError( `file ${step}.csv cannot be read`, step * 8 );
				}
				else {
					box.addText( `file ${step}.csv imported`, step * 8 );
				}

				if( step === 12 ) {
					box.clearInterval( "step" );
					box.done( );
				}
			} );
		} } ),
	] } );
}

/** @demo One line — setText( text, percent ) replaces the line instead of adding one. */
export function oneLine( ) {
	return new HBox( { content: [
		new Button( { label: "Download", click: ( ) => {
			const box = new ProgressionBox( "Downloading" );
			box.show( );

			let percent = 0;
			box.setInterval( "step", 200, ( ) => {
				percent += 10;
				box.setText( `${percent * 32} kB of 3200 kB`, percent );

				if( percent === 100 ) {
					box.clearInterval( "step" );
					box.done( );
				}
			} );
		} } ),
	] } );
}

const page: DemoComponent = {
	name: "ProgressionBox",
	category: "Popup / Dialog",
	description: "A modal box that follows a long task: a title, a bar, the lines of what is done; it closes by itself when all went well.",
	demos: [ steps, errors, sections, oneLine ],
};

export default page;
