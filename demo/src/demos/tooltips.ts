/**
 * Tooltips: the page of the gallery
 */

import { Button, Checkbox, Component, HBox, IComponentInterface, ITipHandler, Input, Label, shortcutText } from 'x4js';
import { icon_info, icon_save, icon_trash } from '../icons';
import { DemoComponent } from '../types';

import "./tooltips.scss";

/** @demo The tooltip prop — Any component takes a tooltip; it is shown under the pointer once initTooltips( ) was called at the start. */
export function prop( ) {
	return new HBox( { content: [
		new Button( { icon: icon_save, tooltip: "Save the document" } ),
		new Button( { icon: icon_trash, cls: "danger", tooltip: "Delete it" } ),
		new Label( { icon: icon_info, text: "Hover me", tooltip: "A label has one too" } ),
		new Input( { type: "text", placeholder: "a field", tooltip: "And a field" } ),
	] } );
}

/** @demo HTML — The text of a tooltip is HTML: bold, a line break, a shortcut written by shortcutText. */
export function html( ) {
	return new HBox( { content: [
		new Button( { label: "Save", tooltip: `<b>Save</b><br>${shortcutText( "Mod+S" )}` } ),
		new Button( { label: "Undo", cls: "outline", tooltip: `<b>Undo</b><br>${shortcutText( "Mod+Z" )}` } ),
	] } );
}

/** @demo Changing it — The tooltip is the attribute "tooltip": setAttribute changes it. */
export function change( ) {
	const target = new Button( { label: "Hover me", cls: "outline", tooltip: "Not checked" } );

	return new HBox( { content: [
		new Checkbox( { label: "Checked", change: ( ev ) => {
			target.setAttribute( "tooltip", ev.value ? "Checked" : "Not checked" );
		} } ),
		target,
	] } );
}

/** @demo Computed when shown — A component that answers queryInterface( "tip-handler" ) gives its text at the moment it is shown. */
export function handler( ) {
	class Clock extends Component {
		override queryInterface<T extends IComponentInterface>( name: string ): T {
			if( name == "tip-handler" ) {
				const tip: ITipHandler = { getTip: ( ) => `It is ${new Date( ).toLocaleTimeString( )}` };
				return tip as unknown as T;
			}
			return super.queryInterface( name );
		}
	}

	return new HBox( { content: [
		new Clock( { cls: "clock", content: "What time is it?" } ),
	] } );
}

const page: DemoComponent = {
	name: "Tooltips",
	category: "Popup / Dialog",
	description: "A text that shows under the pointer, on any component that has a tooltip. initTooltips( ) once at the start of the application turns them on.",
	imports: [ "initTooltips" ],
	demos: [ prop, html, change, handler ],
};

export default page;
