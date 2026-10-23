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

/** @demo HTML — The text of a tooltip is HTML, styled by the page: a title, a sentence, a shortcut written by shortcutText, a list, a badge. A text that comes from a user is escaped with sanitizeHtml. */
export function html( ) {
	return new HBox( { content: [
		new Button( { label: "Save", tooltip: `<div class="demo-tip">
			<b>Save the document</b>
			<p>Your changes go to the disk; the previous version is kept for 30 days.</p>
			<span class="key">${shortcutText( "Mod+S" )}</span>
		</div>` } ),
		new Button( { label: "Export", cls: "outline", tooltip: `<div class="demo-tip">
			<b>Export the table</b>
			<ul>
				<li><b>PDF</b>, to print it</li>
				<li><b>CSV</b>, for a spreadsheet</li>
				<li><b>JSON</b>, for the code</li>
			</ul>
		</div>` } ),
		new Button( { label: "Publish", cls: "outline", tooltip: `<div class="demo-tip">
			<b>Publish</b> <span class="badge">new</span>
			<p>Your page online in one click, at <u>x4js.org</u>.</p>
			<span class="muted">Last published 2 hours ago</span>
		</div>` } ),
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
	category: "Extra",
	description: "A text that shows under the pointer, on any component that has a tooltip. initTooltips( ) once at the start of the application turns them on.",
	imports: [ "initTooltips" ],
	demos: [ prop, html, change, handler ],
};

export default page;
