/**
 * SettingsView: the page of the gallery
 */

import { BoxProps, Button, Checkbox, Form, HBox, Input, Label, Select, SettingItem, SettingsSection, SettingsView, Switch, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./settingsview.scss";

// the sections of the configurator: new components each time, a component is in one place only
function makeSections( ): SettingsSection[] {
	return [
		{ id: "editor", title: "Editor", description: "How the text is shown.", content: [
			new SettingItem( { title: "Font size", description: "The size of the text, in pixels.", content: new Input( { type: "number", value: 14, min: 8, max: 32 } ) } ),
			new SettingItem( { title: "Word wrap", description: "Long lines go on the next line.", content: new Checkbox( { label: "Wrap", checked: true } ) } ),
		] },
		{ id: "files", title: "Files", content: [
			new SettingItem( { title: "Auto save", description: "Saves the file after a delay.", content: new Checkbox( { label: "After 1 s" } ) } ),
			new SettingItem( { title: "Encoding", description: "The encoding of new files.", content: new Input( { type: "text", value: "utf-8" } ) } ),
		] },
	];
}

/** @demo Searchable — A search field above the sections: an item is shown when its title or its description holds the words typed. */
export function searchable( ) {
	return new SettingsView( {
		height: 340,
		searchable: true,
		searchPlaceholder: "Search: try \"size\" or \"files\"",
		noMatch: "No setting found.",
		sections: [
			{ id: "window", title: "Window", content: [
				new SettingItem( { title: "Zoom", description: "The size of everything in the window.", content: new Input( { type: "number", value: 100, step: 10 } ) } ),
				new SettingItem( { title: "Title bar", description: "Shows the name of the file in the title bar.", content: new Checkbox( { label: "Show", checked: true } ) } ),
			] },
			{ id: "files", title: "Files", description: "What happens when a file is opened or saved.", content: [
				new SettingItem( { title: "Size limit", description: "Larger files are opened read only, in MB.", content: new Input( { type: "number", value: 50 } ) } ),
				new SettingItem( { title: "Trim spaces", description: "Removes the spaces at the end of the lines.", content: new Checkbox( { label: "On save" } ) } ),
			] },
		],
	} );
}

/** @demo A Form of settings — The items in a Form, their controls named: getValues reads them all, setValues writes them. */
export function form( ) {
	const values = new Label( { cls: "values", text: "" } );
	const settings = new Form( { content: [
		new SettingItem( { title: "Font size", description: "The size of the text, in pixels.", content: new Input( { type: "number", name: "fontSize", value: 14 } ) } ),
		new SettingItem( { title: "Theme", description: "The colors of the window.", content: new Select( { name: "theme", value: "light", items: [
			{ id: "light", text: "Light" },
			{ id: "dark", text: "Dark" },
		] } ) } ),
		new SettingItem( { title: "Word wrap", description: "Long lines go on the next line.", content: new Switch( { label: "", name: "wrap", checked: true } ) } ),
	] } );

	return new VBox( { content: [
		new SettingsView( { height: 300, sections: [
			{ id: "editor", title: "Editor", content: [ settings ] },
		] } ),
		new HBox( { content: [
			new Button( { label: "getValues", click: ( ) => values.setText( JSON.stringify( settings.getValues( ) ) ) } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => settings.setValues( { fontSize: 14, theme: "light", wrap: true } ) } ),
			values,
		] } ),
	] } );
}

/** @demo A class of your own — A page that keeps its controls in refs builds its sections after super(), with setSections. */
export function derived( ) {
	class EditorSettings extends SettingsView {
		declare protected refs: { size: Input; preview: Label };

		constructor( props: BoxProps ) {
			super( { ...props, searchable: true } );

			this.setSections( [
				{ id: "font", title: "Font", content: [
					new SettingItem( { title: "Font size", description: "Type a size: the text below follows it.", content: [
						this.refs.size = new Input( { type: "number", value: 14, min: 8, max: 32, change: ( ) => this.update( ) } ),
						this.refs.preview = new Label( { text: "The quick brown fox" } ),
					] } ),
				] },
			] );
		}

		private update( ) {
			this.refs.preview.setStyleValue( "fontSize", this.refs.size.getNumValue( 14 ) );
		}
	}

	return new EditorSettings( { height: 260 } );
}

/** @demo sectionChange — The event gives the id of the section at the top while the view scrolls; showSection brings one to the top. */
export function sectionChange( ) {
	const current = new Label( { text: "" } );
	const view = new SettingsView( {
		height: 300,
		sectionChange: ( ev ) => current.setText( `at the top: ${ev.section}` ),
		sections: [
			{ id: "general", title: "General", content: [
				new SettingItem( { title: "Name", content: new Input( { type: "text", value: "My project" } ) } ),
				new SettingItem( { title: "Version", content: new Input( { type: "text", value: "1.0" } ) } ),
			] },
			{ id: "build", title: "Build", content: [
				new SettingItem( { title: "Minify", content: new Checkbox( { label: "In production", checked: true } ) } ),
				new SettingItem( { title: "Source maps", content: new Checkbox( { label: "In debug" } ) } ),
			] },
			{ id: "about", title: "About", content: [
				new Label( { text: "A text in a section: shown with its section." } ),
			] },
		],
	} );

	return new VBox( { content: [
		view,
		new HBox( { content: [
			new Button( { label: "Build", cls: "outline", click: ( ) => view.showSection( "build" ) } ),
			new Button( { label: "About", cls: "outline", click: ( ) => view.showSection( "about" ) } ),
			current,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "SettingsView",
	category: "Forms",
	description: "A page of settings, as the settings of VS Code: the summary of the sections on the left, the sections on the right, each SettingItem with its name, what it does and its controls.",
	imports: [ "SettingsView", "SettingItem" ],
	usage: {
		create: ( props ) => new SettingsView( { ...props, sections: makeSections( ) } ),
		extra: "sections",
		props: { searchable: true, searchPlaceholder: "", noMatch: "", height: 320 },
		controls: [
			{ name: "searchable", type: "boolean" },
			{ name: "searchPlaceholder", type: "string" },
			{ name: "noMatch", type: "string" },
			{ name: "height", type: "number", min: 200, max: 600, step: 20, live: true },
		],
	},
	demos: [ searchable, form, derived, sectionChange ],
};

export default page;
