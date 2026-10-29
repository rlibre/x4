/**
 * The presentation page: what x4js is, how a project is started, the components by
 * category, the links of the project.
 */

import { BoxProps, Component, HBox, Icon, Label, Link, SimpleText, VBox } from 'x4js';

import { ComponentGroup } from './types';
import { categoryText, texts } from './texts';
import { descriptionText } from './descriptions';
import logo from '../../logox4-v3.svg';
import logo_dark from '../../logox4-v3-dark.svg';

// the links of x4js.org (its home page), in English
const GETTING_STARTED = "https://x4js.org/doc/en/getting-started/";
const DOCS = "https://x4js.org/doc/en/";
const API = "https://rlibre.github.io/x4/index.html";
const REPO = "https://github.com/rlibre/x4";
const NPM = "https://www.npmjs.com/package/x4js";

interface HomePageProps extends BoxProps {
	groups: ComponentGroup[];			// in the order of the navigation
}

export class HomePage extends VBox<HomePageProps> {

	constructor( props: HomePageProps ) {
		// a <div>, as the page of a component
		super( { ...props, tag: "div" } );

		const t = texts( ).home;

		this.setContent( [
			new HBox( { cls: "hero", content: [
				// the "4" of the logo is light in the dark theme: main.scss shows one of them
				new Icon( { cls: "logo light", iconId: logo } ),
				new Icon( { cls: "logo dark", iconId: logo_dark } ),
				new VBox( { content: [
					new Label( { cls: "title", text: "x4js" } ),
					new SimpleText( { cls: "tagline", text: t.tagline } ),
				] } ),
			] } ),
			new SimpleText( { cls: "description", text: t.intro } ),

			new Label( { cls: "section", text: t.start } ),
			new SimpleText( { cls: "text", text: t.start_text } ),
			new Component( { tag: "pre", content: "npx x4js create my-app\ncd my-app\nnpm run dev" } ),
			this.makeLink( t.guide, GETTING_STARTED ),

			new Label( { cls: "section", text: t.components } ),
			new Component( { cls: "categories", content: props.groups.map( group => this.makeCard( group ) ) } ),

			new Label( { cls: "section", text: t.links } ),
			new HBox( { cls: "links", content: [
				this.makeLink( t.docs, DOCS ),
				this.makeLink( t.api, API ),
				this.makeLink( t.repo, REPO ),
				this.makeLink( t.npm, NPM ),
			] } ),
		] );
	}

	/**
	 * a category: its title, a link per component, its description in the tooltip
	 */

	private makeCard( group: ComponentGroup ) {
		return new VBox( { cls: "category", content: [
			new Label( { cls: "title", text: categoryText( group.category ) } ),
			new Component( { cls: "names", content: group.docs.map( doc => new Link( {
				href: "#/" + doc.name.toLowerCase( ),
				text: doc.name,
				tooltip: descriptionText( doc.name ),
			} ) ) } ),
		] } );
	}

	/**
	 * a link out of the gallery, in a new tab
	 */

	private makeLink( text: string, href: string ) {
		return new Link( { cls: "out", href, text, attrs: { target: "_blank", rel: "noopener" } } );
	}
}
