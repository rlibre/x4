/**
 * The page of a component: its header, the configurator ("Usage"), then a card
 * per variation.
 */

import { BoxProps, Button, Component, HBox, Label, Link, PropertyGrid, SimpleText, VBox, unsafeHtml } from 'x4js';
import { CodeView, highlight, makeCode, setProps } from './code';
import { sources } from './demos/sources.gen';
import { DemoComponent } from './types';
import { texts } from './texts';
import { descriptionText } from './descriptions';

/**
 * a variation: its title (a link to it), its sentence, the demo, then its code behind "Show code"
 */

interface DemoCardProps extends BoxProps {
	route: string;				// the component: "button"
	demo: ( ) => Component;
}

class DemoCard extends VBox<DemoCardProps> {
	declare protected refs: { toggle: Button; code: CodeView };

	constructor( props: DemoCardProps ) {
		super( { ...props, cls: "card", id: `${props.route}-${props.demo.name}` } );

		// its title, sentence and code, read by gen-sources.mjs in src/demos
		const key = `${props.route}/${props.demo.name}`;
		const source = sources[key];

		this.setContent( [
			new Link( { cls: "title", href: `#/${key}`, content: source.title } ),
			new SimpleText( { cls: "text", text: source.text } ),
			new VBox( { cls: "demo", content: props.demo( ) } ),
			this.refs.toggle = new Button( { cls: "toggle outline", label: texts( ).show_code, click: ( ) => this.toggleCode( ) } ),
			this.refs.code = new CodeView( { ts: source.ts, scss: source.scss, hidden: true } ),
		] );
	}

	private toggleCode( ) {
		const show = this.refs.code.hasClass( "x4hidden" );
		this.refs.code.show( show );
		this.refs.toggle.setText( show ? texts( ).hide_code : texts( ).show_code );
	}
}

/**
 * the page of a component
 */

interface ComponentPageProps extends BoxProps {
	doc: DemoComponent;
}

export class ComponentPage extends VBox<ComponentPageProps> {
	declare protected refs: { preview: Component; code: CodeView };

	constructor( props: ComponentPageProps ) {
		// a <div>, not the <fieldset> of a Box: in Chrome a fieldset that scrolls goes back to 0
		// when a fieldset in it changes (Show code in a card)
		super( { ...props, tag: "div", cls: "page" } );

		const doc = props.doc;
		const route = doc.name.toLowerCase( );
		const imports = doc.imports ?? [ doc.name ];

		this.setContent( [
			new Label( { cls: "name", text: doc.name } ),
			new SimpleText( { cls: "description", text: descriptionText( doc.name ) } ),
			new Component( { tag: "pre", cls: "import", content: unsafeHtml( highlight( `import { ${imports.join( ", " )} } from "x4js"` ) ) } ),
			...this.makeUsage( doc ),
			new Label( { cls: "section", text: texts( ).examples } ),
			...doc.demos.map( demo => new DemoCard( { route, demo } ) ),
		] );
	}

	/**
	 * the configurator: the component, its props in a PropertyGrid, its code under them;
	 * nothing when the page has none
	 */

	private makeUsage( doc: DemoComponent ): Component[] {
		const usage = doc.usage;
		if( !usage ) {
			return [];
		}

		// the props of the configurator: each change builds the component again
		const current = { ...usage.props };
		const code = ( ) => makeCode( doc.name, current, usage.controls, usage.extra );

		const update = ( name: string, value: any ) => {
			current[name] = value;
			this.refs.preview.setContent( usage.create( setProps( current, usage.controls ) ) );
			this.refs.code.setCode( code( ) );
		};

		return [
			new Label( { cls: "section", text: texts( ).usage } ),
			new HBox( { cls: "usage", content: [
				// as high as the PropertyGrid needs: its rows scroll in it, they do not size it
				this.refs.preview = new Component( { cls: "preview", flex: true, style: { minHeight: Math.max( 280, 60 + usage.controls.length * 37 ) }, content: usage.create( setProps( current, usage.controls ) ) } ),
				new PropertyGrid( { cls: "props", groups: [ {
					title: texts( ).props,
					items: usage.controls.map( c => ( { ...c, value: current[c.name], callback: update } ) ),
				} ] } ),
			] } ),
			this.refs.code = new CodeView( { cls: "usage-code", ts: code( ) } ),
		];
	}

	/**
	 * brings the card of a variation to the top
	 */

	showDemo( name: string, smooth: boolean ) {
		const card = this.query( `#${this.props.doc.name.toLowerCase( )}-${name}` );
		if( card ) {
			card.scrollIntoView( { behavior: smooth ? "smooth" : "auto", block: "start" } );
		}
	}
}
