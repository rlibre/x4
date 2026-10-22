/**
 * PromptBox: the page of the gallery
 */

import { Button, HBox, Input, Label, PromptBox, Rating, Select } from 'x4js';
import { DemoComponent } from '../types';

/** @demo An editor of your own — showAsync( message, editor, title ) gives the button; the value is read from the editor. */
export function editor( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Choose a format", click: async ( ) => {
			const format = new Select( { value: "pdf", items: [
				{ id: "pdf", text: "PDF" },
				{ id: "csv", text: "CSV" },
				{ id: "xlsx", text: "Excel" },
			] } );

			const button = await PromptBox.showAsync( "Export the table as:", format, "Export" );
			result.setText( button === "ok" ? `format: ${format.getValue( )}` : "cancelled" );
		} } ),
		result,
	] } );
}

/** @demo Refuse a value — show( message, editor, title, callback ): the box closes only when the callback does not return false. */
export function refuse( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Set the age", click: ( ) => {
			const age = new Input( { type: "number", value: 200, min: 0, max: 130 } );

			PromptBox.show( "An age between 0 and 130:", age, "Age", ( button ) => {
				if( button === "ok" ) {
					const value = age.getNumValue( );
					if( value < 0 || value > 130 ) {
						result.setText( `${value}: refused, the box stays open` );
						return false;
					}

					result.setText( `age: ${value}` );
				}

				return true;
			} );
		} } ),
		result,
	] } );
}

/** @demo A rating — Any component can be the editor: here a Rating. */
export function rating( ) {
	const result = new Label( { text: "" } );

	return new HBox( { content: [
		new Button( { label: "Rate the gallery", click: async ( ) => {
			const stars = new Rating( { value: 3 } );

			if( await PromptBox.showAsync( "How useful is this page?", stars, "Your opinion" ) === "ok" ) {
				result.setText( `${stars.getValue( )} stars` );
			}
		} } ),
		result,
	] } );
}

const page: DemoComponent = {
	name: "PromptBox",
	category: "Popup / Dialog",
	description: "A modal box that shows a message and an editor of your own, with OK and Cancel; its static functions showAsync and show.",
	demos: [ editor, refuse, rating ],
};

export default page;
