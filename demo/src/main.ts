/**
 * x4 gallery: a page per component, a configurator of its props, its variations with their code.
 * The library is the package x4js. The pages are the files of src/demos (listed by gen-sources.mjs).
 *
 * Address: #/ is the presentation page, #/button shows a component, #/button/icons brings one
 * of its variations to the top.
 */

import { Application, BoxProps, Button, Component, Flex, HBox, HSplitBox, Label, MenuElement, Router, TextEdit, VBox, getCurrentLanguage, initTooltips, selectLanguage, shortcutText, unsafeHtml } from 'x4js';
import x4package from 'x4js-package';

import { pages } from './demos/sources.gen';
import { ComponentPage } from './page';
import { HomePage } from './home';
import { icon_close, icon_menu, icon_moon, icon_sun } from './icons';
import logo from '../../logox4-v3.svg';
import logo_dark from '../../logox4-v3-dark.svg';
import { categoryText, texts } from './texts';
import { ComponentGroup } from './types';

import "./main.scss";

// the sections of the navigation: the sections of aicontext.md, the inputs first, then the
// components with an entry of their own (x4js/mapview...), then Extras (SVG, state, JSX...)
const categories = [
	"Input components",
	"Display components",
	"Layout containers",
	"Lists / grids / trees",
	"Menus / button groups / tabs",
	"Popup / Dialog",
	"Forms",
	"Sizers / viewport / misc",
	"Add-ons",
	"Extras",
];

// the components that have a page, in the order of the navigation
const components = pages.slice( ).sort( ( a, b ) => categories.indexOf( a.category ) - categories.indexOf( b.category ) || a.name.localeCompare( b.name ) );

// the components by category, a category without one left out: the navigation, the presentation page
const groups: ComponentGroup[] = categories
	.map( category => ( { category, docs: components.filter( c => c.category == category ) } ) )
	.filter( group => group.docs.length );

/**
 * the page: the header, the navigation on the left, the page of a component
 */

class Gallery extends VBox {
	declare protected refs: { brand: Label; search: TextEdit; clear: Button; nav: VBox; content: Component };

	private router = new Router( );
	private page: ComponentPage = null;
	private route = "";				// the component shown: "button"

	constructor( props: BoxProps ) {
		super( props );

		this.setContent( [
			new HBox( { cls: "header", content: [
				// the version of the x4 bundled; "+": built on its sources (more than that version)
				// a click: the presentation page
				this.refs.brand = new Label( { cls: "brand", icon: logo, text: unsafeHtml( `Gallery<span class="version">x4 ${x4package.version}${X4_SOURCES ? "+" : ""}</span>` ), dom_events: {
					click: ( ) => this.router.navigate( "/" ),
				} } ),
				// no label: the field alone; its gadget clears it, shown when there is a text
				this.refs.search = new TextEdit( { cls: "search", label: "", placeholder: this.searchHint( ), change: ( ) => this.filterNav( ), inputGadgets: [
					this.refs.clear = new Button( { icon: icon_close, hidden: true, click: ( ) => this.clearSearch( ) } ),
				] } ),
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

		// the theme is changed by the menu, or by the page Theme: the "4" of the logo is light
		// in the dark theme
		new MutationObserver( ( ) => this.refs.brand.setIcon( Application.getTheme( ) == "dark" ? logo_dark : logo ) )
			.observe( document.documentElement, { attributes: true, attributeFilter: [ "class" ] } );
	}

	/**
	 * the link of the presentation page, then a box per category, a link per component
	 */

	private makeNav( ) {
		return [
			// in a box as a category: the search hides it when a text is typed (its name is "")
			new VBox( { cls: "category home", content: [
				this.makeLink( texts( ).home.nav, "" ),
			] } ),
			...groups.map( group => new VBox( { cls: "category", content: [
				new Label( { cls: "title", text: categoryText( group.category ) } ),
				...group.docs.map( doc => this.makeLink( doc.name, doc.name.toLowerCase( ) ) ),
			] } ) ),
		];
	}

	/**
	 * a link of the navigation to "#/<route>"; an <a> without href: the browser shows no
	 * address at the bottom of the window
	 */

	private makeLink( text: string, route: string ) {
		return new Component( { tag: "a", content: text, attrs: { "data-name": route }, dom_events: {
			click: ( ) => this.router.navigate( "/" + route ),
		} } );
	}

	/**
	 * the links whose name holds the text typed; a category without one is hidden
	 */

	private filterNav( ) {
		const text = this.refs.search.getValue( ).trim( ).toLowerCase( );
		this.refs.clear.show( text != "" );

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
	 * the text of the empty search, with its shortcut: "Search components (Ctrl+F)"
	 */

	private searchHint( ) {
		return `${texts( ).search} (${shortcutText( "Mod+F" )})`;
	}

	/**
	 * the gadget of the search: all the navigation again, the focus back in the field
	 */

	private clearSearch( ) {
		this.refs.search.setValue( "" );
		this.filterNav( );
		this.focusSearch( );
	}

	/**
	 * Ctrl+F (Cmd+F on a Mac): the focus in the search, its text selected
	 */

	focusSearch( ) {
		const input = this.refs.search.getInput( ).dom as HTMLInputElement;
		input.focus( );
		input.select( );
	}

	/**
	 * the page of a component (the presentation page when it is unknown), then the card of a variation
	 */

	private showPage( route: string, demo: string ) {
		const doc = components.find( c => c.name.toLowerCase( ) == route.toLowerCase( ) );
		if( !doc ) {
			this.showHome( );
			return;
		}

		const shown = this.page && this.route == route;
		if( !shown ) {
			this.route = route;
			this.page = new ComponentPage( { flex: true, doc } );
			this.refs.content.setContent( this.page );
			this.setActive( route );
		}

		if( demo ) {
			this.page.showDemo( demo, shown );
		}
	}

	/**
	 * the presentation page: its route is ""
	 */

	private showHome( ) {
		this.route = "";
		this.page = null;
		this.refs.content.setContent( new HomePage( { flex: true, groups } ) );
		this.setActive( "" );
	}

	/**
	 * the link of the page shown, brought into the navigation
	 */

	private setActive( route: string ) {
		this.refs.nav.queryAll( "a" ).forEach( link => {
			const active = link.getData( "name" ) == route;
			link.setClass( "active", active );
			if( active ) {
				link.scrollIntoView( { block: "nearest" } );
			}
		} );
	}

	/**
	 * the menu of the header: the theme it switches to, then the languages, the one selected checked
	 */

	private makeMenu( ): MenuElement[] {
		const lang = getCurrentLanguage( );
		const dark = Application.getTheme( ) == "dark";

		return [
			{ text: dark ? texts( ).light : texts( ).dark, icon: dark ? icon_sun : icon_moon, click: ( ) => this.toggleTheme( ) },
			"-",
			{ text: "English", checked: lang == "en", click: ( ) => this.setLanguage( "en" ) },
			{ text: "Français", checked: lang == "fr", click: ( ) => this.setLanguage( "fr" ) },
			{ text: "Español", checked: lang == "es", click: ( ) => this.setLanguage( "es" ) },
			{ text: "Deutsch", checked: lang == "de", click: ( ) => this.setLanguage( "de" ) },
		];
	}

	/**
	 * the dark theme of x4: the class "x4theme-dark" on <html>; another theme (one of the page
	 * Theme) goes to the dark one too
	 */

	private toggleTheme( ) {
		Application.setTheme( Application.getTheme( ) == "dark" ? "" : "dark" );
	}

	/**
	 * x4 reads its texts when a component is built: the text of the search is set
	 * again, the navigation and the page are built again
	 */

	private setLanguage( lang: string ) {
		selectLanguage( lang );

		this.refs.search.getInput( ).setAttribute( "placeholder", this.searchHint( ) );
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

		const gallery = new Gallery( { cls: "gallery" } );
		this.setMainView( gallery );

		// from anywhere, a field too: the search of the navigation, not the one of the browser
		this.addShortcut( "Mod+F", ( ) => gallery.focusSearch( ), { editable: true } );
	}
}

// the texts of the gallery are in English: x4 too, at the start
selectLanguage( "en" );
new App( );
