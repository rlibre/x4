/**
 * JSX: the page of the gallery
 */

import { Button, Checkbox, Combobox, Form, HBox, Label, Listbox, Panel, TextEdit, VBox, makeState, x4_react } from 'x4js';
import { DemoComponent } from '../types';
import { icon_close } from '../icons';

/** @demo A view — A class of the application builds its tree in JSX; ref={[this, "name"]} keeps a part in this.refs, its methods use it; style={{ ... }} gives its inline style. */
export function view( ) {
	class ContactView extends VBox {
		declare protected refs: { form: Form; result: Label };

		constructor( ) {
			super( { width: 420 } );

			this.setContent( [
				<Form ref={[this, "form"]} flex={false} style={{ border: "1px solid var( --border )", padding: "8px" }}>
					<TextEdit label="Name" name="name" labelWidth={70} value="Ada Lovelace" />
					<TextEdit label="Email" name="email" type="email" labelWidth={70} />
					<Combobox label="Role" name="role" labelWidth={70} value="dev" items={[
						{ id: "dev", text: "Developer" },
						{ id: "lead", text: "Tech lead" },
					]} />
					<Checkbox label="Newsletter" name="news" />
				</Form>,
				<HBox>
					<Button label="Save" click={( ) => this.save( )} />
					<Button label="Clear" cls="outline" click={( ) => this.clear( )} />
				</HBox>,
				<Label ref={[this, "result"]} text="" />,
			] );
		}

		save( ) {
			this.refs.result.setText( JSON.stringify( this.refs.form.getValues( ) ) );
		}

		clear( ) {
			this.refs.form.setValues( { name: "", email: "", news: false } );
			this.refs.result.setText( "" );
		}
	}

	return new ContactView( );
}

/** @demo With a state — The list is built again from the state at each change: {items.map( ... )} gives a line per task, a condition the text of an empty list. */
export function todo( ) {
	const state = makeState( { items: [ "Write the doc", "Fix the grid" ] } );
	const list = new VBox( { width: 320 } );
	const field: TextEdit = <TextEdit label="Task" labelWidth={40} width={260} />;

	const render = ( ) => list.setContent( <VBox>
		{state.items.map( ( item, i ) => <HBox>
			<Label text={item} flex />
			<Button icon={icon_close} cls="outline" click={( ) => state.items = state.items.filter( ( _, j ) => j != i )} />
		</HBox> )}
		{state.items.length == 0 && <Label text="Nothing to do" />}
	</VBox> );

	state.watch( "items", render );
	render( );

	return <VBox>
		<HBox>
			{field}
			<Button label="Add" click={( ) => {
				if( field.getValue( ) ) {
					state.items.push( field.getValue( ) );
					field.setValue( "" );
				}
			}} />
		</HBox>
		{list}
	</VBox>;
}

/** @demo Objects and JSX — JSX gives the same objects as new: a Listbox built in code goes in a tree written in JSX, and that tree in the content of a new HBox. */
export function mixed( ) {
	const info = new Label( { text: "nothing selected" } );
	const list = new Listbox( { width: 180, height: 120, items: [
		{ id: 1, text: "Lyon" },
		{ id: 2, text: "Grenoble" },
		{ id: 3, text: "Torino" },
	], selectionChange: ( ev ) => info.setText( `selection: ${ev.selection.join( ", " )}` ) } );

	const panel = <Panel title="Selection" width={220}>
		{info}
	</Panel>;

	return new HBox( { content: [ list, panel ] } );
}

const page: DemoComponent = {
	name: "JSX",
	category: "Extras",
	description: "The components written as a tree, in a .tsx file: JSX only calls their constructors, there is no virtual DOM. In tsconfig.json: \"jsx\": \"react\" and \"jsxFactory\": \"x4_react.create_element\".",
	imports: [ "x4_react" ],
	demos: [ view, todo, mixed ],
};

export default page;
