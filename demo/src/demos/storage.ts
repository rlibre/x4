/**
 * Storage: the page of the gallery
 */

import { Application, BoxProps, Button, Checkbox, HBox, Label, StateProxy, TextEdit, VBox } from 'x4js';
import { DemoComponent } from '../types';

/** @demo A value — `setStorage` writes a string (or a number) under a name, `getStorage` reads it: `null` when there is none. Type a name, then open the page again: it is still there. */
export function value( ) {
	const app = Application.instance( );

	return new TextEdit( { label: "Your name", width: 320, value: app.getStorage( "gallery:name" ) ?? "",
		change: ( ev ) => app.setStorage( "gallery:name", ev.value ),
	} );
}

/** @demo An object — `setStorageJSON` writes an object as JSON, `getStorageJSON` reads it back: `null` when there is none, `undefined` when it cannot be read. Here a few settings. */
export function json( ) {
	const app = Application.instance( );
	const settings = app.getStorageJSON( "gallery:settings" ) ?? { compact: false, sound: true };
	const save = ( ) => app.setStorageJSON( "gallery:settings", settings );

	return new VBox( { content: [
		new Checkbox( { label: "Compact view", checked: settings.compact, change: ( ev ) => { settings.compact = ev.value; save( ); } } ),
		new Checkbox( { label: "Sound", checked: settings.sound, change: ( ev ) => { settings.sound = ev.value; save( ); } } ),
	] } );
}

/** @demo The state of a component — What for: a component that finds again, when the page is opened again, what the user did with it (a panel closed, a tab chosen, a width, a count).
 *
 * How: in the constructor of your class, `this.loadPState( name, defaults )` gives a state (`makeState`), read and changed as an object. The first time it holds the defaults, then what was saved.
 *
 * - each change is written by itself in the storage under `"x4@persist:<name>"`, 500 ms after the last one: there is no save to call
 * - the name is the key: two components with the same name write over each other
 * - `loadPState` is protected: the class calls it, not the code that uses the class
 *
 * Here: +1, then reload the page. */
export function component( ) {
	class Counter extends HBox {
		constructor( props: BoxProps ) {
			super( props );

			const state: StateProxy<{ count: number }> = this.loadPState( "gallery-counter", { count: 0 } );
			const label = new Label( { text: `count: ${state.count}` } );

			state.watch( "count", ( ev ) => label.setText( `count: ${ev.value}` ) );

			this.setContent( [
				new Button( { label: "+1", click: ( ) => state.count++ } ),
				new Button( { label: "Reset", cls: "outline", click: ( ) => state.count = 0 } ),
				label,
			] );
		}
	}

	return new Counter( { } );
}

const page: DemoComponent = {
	name: "Storage",
	category: "Extras",
	description: "The storage of the browser (localStorage), by the application: a string, a number or an object kept under a name, still there when the page is opened again. A component of yours keeps its state there with loadPState.",
	imports: [ "Application" ],
	demos: [ value, json, component ],
};

export default page;
