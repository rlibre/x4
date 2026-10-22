/**
 * x4 gallery: a page per component, a configurator of its props, its variations with their code.
 * The library is the package x4js. The pages are the files of src/demos (listed by gen-sources.mjs).
 *
 * Address: #/button shows a component, #/button/icons brings one of its variations to the top.
 */

import { Application, BoxProps, Button, Component, Flex, HBox, HSplitBox, Input, Label, MenuElement, Router, VBox, getCurrentLanguage, initTooltips, selectLanguage } from 'x4js';

import { pages } from './demos/sources.gen';
import { ComponentPage } from './page';
import { icon_menu, icon_moon, icon_sun } from './icons';
import { categoryText, texts } from './texts';

import "./main.scss";

// the sections of the navigation: the sections of aicontext.md
const categories = [
	"Display components",
	"Layout containers",
	"Input components",
	"Lists / grids / trees",
	"Menus / button groups / tabs",
	"Popup / Dialog",
	"Forms",
	"Sizers / viewport / misc",
	"SVG",
];

// the components that have a page, in the order of the navigation
const components = pages.slice( ).sort( ( a, b ) => categories.indexOf( a.category ) - categories.indexOf( b.category ) || a.name.localeCompare( b.name ) );

/**
 * the page: the header, the navigation on the left, the page of a component
 */

class Gallery extends VBox {
	declare protected refs: { search: Input; nav: VBox; content: Component };

	private router = new Router( );
	private page: ComponentPage = null;
	private route = "";				// the component shown: "button"
	private dark = false;

	constructor( props: BoxProps ) {
		super( props );

		this.setContent( [
			new HBox( { cls: "header", content: [
				new Label( { cls: "brand", text: "x4 gallery" } ),
				this.refs.search = new Input( { type: "text", cls: "search", placeholder: texts( ).search, change: ( ) => this.filterNav( ) } ),
				new Flex( ),
				// built at each click: the theme it switches to, the language selected
				new Button( { cls: "menu outline", icon: icon_menu, menu: ( ) => this.makeMenu( ) } ),
			] } ),
			// the sizer between them changes the width of the navigation
			new HSplitBox( { cls: "main", flex: true, content: [
				this.refs.nav = new VBox( { cls: "nav", content: this.makeNav( ) } ),
				// a <div>, not a Box: in a Box (a <fieldset>), a new page in a Box beside
				// the navigation, also a Box, puts the scroll of the navigation back to 0 (Chrome)
				this.refs.content = new Component( { cls: "content", flex: true } ),
			] } ),
		] );

		this.router.get( "/:comp/:demo", ( params ) => this.showPage( params.comp, params.demo ) );
		this.router.get( "/:comp", ( params ) => this.showPage( params.comp, "" ) );
		this.router.get( "/*", ( ) => this.showPage( "", "" ) );

		// once in the document: a variation can be scrolled to
		this.addDOMEvent( "created", ( ) => this.router.init( ) );
	}

	/**
	 * a box per category, a link per component
	 */

	private makeNav( ) {
		return categories.map( category => {
			const docs = components.filter( c => c.category == category );
			if( !docs.length ) {
				return null;
			}

			return new VBox( { cls: "category", content: [
				new Label( { cls: "title", text: categoryText( category ) } ),
				// an <a> without href: the browser shows no address at the bottom of the window
				...docs.map( doc => new Component( { tag: "a", content: doc.name, attrs: { "data-name": doc.name.toLowerCase( ) }, dom_events: {
					click: ( ) => this.router.navigate( "/" + doc.name.toLowerCase( ) ),
				} } ) ),
			] } );
		} );
	}

	/**
	 * the links whose name holds the text typed; a category without one is hidden
	 */

	private filterNav( ) {
		const text = this.refs.search.getValue( ).trim( ).toLowerCase( );

		for( const category of this.refs.nav.enumChildComponents( false ) ) {
			let some = false;
			for( const link of category.queryAll( "a" ) ) {
				const ok = link.getData( "name" ).includes( text );
				link.show( ok );
				some ||= ok;
			}
			category.show( some );
		}
	}

	/**
	 * the page of a component (the first one when it is unknown), then the card of a variation
	 */

	private showPage( route: string, demo: string ) {
		const doc = components.find( c => c.name.toLowerCase( ) == route.toLowerCase( ) );
		if( !doc ) {
			this.router.navigate( "/" + components[0].name.toLowerCase( ), true, true );
			return;
		}

		const shown = this.page && this.route == route;
		if( !shown ) {
			this.route = route;
			this.page = new ComponentPage( { flex: true, doc } );
			this.refs.content.setContent( this.page );
			this.refs.nav.queryAll( "a" ).forEach( link => {
				const active = link.getData( "name" ) == route;
				link.setClass( "active", active );
				if( active ) {
					link.scrollIntoView( { block: "nearest" } );
				}
			} );
		}

		if( demo ) {
			this.page.showDemo( demo, shown );
		}
	}

	/**
	 * the menu of the header: the theme it switches to, then the languages, the one selected checked
	 */

	private makeMenu( ): MenuElement[] {
		const lang = getCurrentLanguage( );

		return [
			{ text: this.dark ? texts( ).light : texts( ).dark, icon: this.dark ? icon_sun : icon_moon, click: ( ) => this.toggleTheme( ) },
			"-",
			{ text: "English", checked: lang == "en", click: ( ) => this.setLanguage( "en" ) },
			{ text: "Français", checked: lang == "fr", click: ( ) => this.setLanguage( "fr" ) },
			{ text: "Español", checked: lang == "es", click: ( ) => this.setLanguage( "es" ) },
			{ text: "Deutsch", checked: lang == "de", click: ( ) => this.setLanguage( "de" ) },
		];
	}

	/**
	 * the dark theme of x4: the class "x4theme-dark" on <html>
	 */

	private toggleTheme( ) {
		this.dark = !this.dark;
		Application.setTheme( this.dark ? "dark" : "" );
	}

	/**
	 * x4 reads its texts when a component is built: the text of the search is set
	 * again, the navigation and the page are built again
	 */

	private setLanguage( lang: string ) {
		selectLanguage( lang );

		this.refs.search.setAttribute( "placeholder", texts( ).search );
		this.refs.nav.setContent( this.makeNav( ) );
		this.filterNav( );

		this.page = null;
		this.showPage( this.route, "" );
	}
}

class App extends Application {
	constructor( ) {
		super( );
		initTooltips( );
		this.setMainView( new Gallery( { cls: "gallery" } ) );
	}
}

// the texts of the gallery are in English: x4 too, at the start
selectLanguage( "en" );
new App( );
