/**
 * State: the page of the gallery
 */

import { Button, HBox, Label, TextEdit, VBox, makeState } from 'x4js';
import { DemoComponent } from '../types';

/** @demo A counter — makeState gives the data itself: state.count++ changes it, and watch( "count" ) is called with its new value. */
export function counter( ) {
	const state = makeState( { count: 0 } );
	const label = new Label( { text: "count: 0" } );

	state.watch( "count", ( ev ) => label.setText( `count: ${ev.value}` ) );

	return new HBox( { content: [
		new Button( { label: "+1", click: ( ) => state.count++ } ),
		new Button( { label: "Reset", cls: "outline", click: ( ) => state.count = 0 } ),
		label,
	] } );
}

/** @demo Two views, one state — The field and the label do not know each other: the field writes the state, both watch it. Replacing user is seen by a watch of "user" too. */
export function shared( ) {
	const state = makeState( { user: { name: "Ada" } } );
	const hello = new Label( { text: "Hello Ada" } );
	const field = new TextEdit( { label: "Name", labelWidth: 60, width: 300, value: state.user.name, change: ( ev ) => state.user.name = ev.value } );

	state.watch( "user", ( ) => {
		hello.setText( `Hello ${state.user.name}` );
		field.setValue( state.user.name );
	} );

	return new VBox( { content: [
		field,
		new HBox( { content: [
			new Button( { label: "Grace", cls: "outline", click: ( ) => state.user = { name: "Grace" } } ),
			hello,
		] } ),
	] } );
}

/** @demo Every change — on( "change" ) is called at each change with its path: "items[2]" for a push, "user.name" below an object. The value it already has changes nothing. */
export function changes( ) {
	const state = makeState( { items: [ "a", "b" ], user: { name: "Ada" } } );
	const log = new Label( { text: "" } );

	state.on( "change", ( ev ) => log.setText( `${ev.path} = ${JSON.stringify( ev.value )}` ) );

	return new HBox( { content: [
		new Button( { label: "items.push", click: ( ) => state.items.push( "c" ) } ),
		new Button( { label: "user.name = Grace", cls: "outline", click: ( ) => state.user.name = "Grace" } ),
		log,
	] } );
}

const page: DemoComponent = {
	name: "State",
	category: "Extra",
	description: "makeState makes an object observable: its properties are read and written as usual, and on or watch is called at each change, with its path.",
	imports: [ "makeState" ],
	demos: [ counter, shared, changes ],
};

export default page;
