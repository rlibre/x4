/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file settingsview.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { class_ns } from '../../core/core_tools';

import { BoxProps, HBox, VBox } from '../boxes/boxes';
import { Input } from '../input/input';
import { Label } from '../label/label';
import { Listbox } from '../listbox/listbox';

import { _tr } from '../../x4.js';

import "./settingsview.module.scss"

/**
 *
 */

export interface SettingItemProps extends BoxProps {
	title: string;
	description?: string;
	content: Component | Component[];	// its controls
}

/**
 * one setting: its name, what it does, then its controls on a line that wraps.
 * It has no value of its own: its controls keep theirs. To read and write them
 * together, put the items in a Form and give the controls a name.
 */

@class_ns( "x4" )
export class SettingItem extends VBox<SettingItemProps> {

	constructor( props: SettingItemProps ) {
		// the content goes under the name and the description, not in the box itself
		super( { ...props, content: undefined } );

		this.setContent( [
			new Label( { cls: "name", text: props.title } ),
			props.description ? new Label( { cls: "description", text: props.description } ) : null,
			new HBox( { cls: "controls", content: props.content } ),
		] );
	}

	/**
	 * the text a search looks in: the name and the description
	 */

	getSearchText( ) {
		return `${this.props.title} ${this.props.description ?? ""}`;
	}
}

/**
 * a section: a panel, its title on a band, then its content
 */

export interface SettingsSection {
	id: string;
	title: string;
	description?: string;		// under the title
	content: Component[];		// SettingItem, Form of SettingItem, or any component
}

export interface EvSectionChange extends ComponentEvent {
	readonly section: string;	// the id of the section now at the top
}

export interface SettingsViewProps extends BoxProps {
	sections?: SettingsSection[];
	searchable?: boolean;			// a search field above the sections
	searchPlaceholder?: string;		// _tr.global.settings.search when missing
	noMatch?: string;				// shown when the search finds nothing; _tr.global.settings.nomatch when missing
	sectionChange?: EventCallback<EvSectionChange>;
}

export interface SettingsViewEvents extends ComponentEvents {
	sectionChange: EvSectionChange;
}

/**
 * text compared without case nor accents
 */

function normalize( text: string ) {
	return text.normalize( "NFD" ).replace( /[̀-ͯ]/g, "" ).toLowerCase( );
}

/**
 * a page of settings, as the settings of VS Code: the summary of the sections
 * on the left, the sections on the right, one after the other. A click in the
 * summary brings its section to the top; the summary follows the scroll.
 * With searchable, a field above them filters the settings.
 *
 * @cssvar
 * ```
 * --settingsview-toc-width
 * --settingsview-section-background
 * --settingsview-section-title-background
 * --settingsview-hover-background
 * --settingsview-marker
 * ```
 */

@class_ns( "x4" )
export class SettingsView<P extends SettingsViewProps = SettingsViewProps> extends VBox<P,SettingsViewEvents> {

	// fields, not refs: refs belong to the classes that derive from this one
	private _search: Input = null;
	private _toc: Listbox;
	private _view: VBox;
	private _noMatch: Label;

	// shown: kept by the search (isVisible is false too while the view is hidden)
	private _sections: { section: SettingsSection, box: VBox, shown: boolean }[] = [];
	private _current = "";		// the id of the section at the top

	constructor( props: P ) {
		super( props );
		this.mapPropEvents( props, "sectionChange" );

		this.setContent( [
			props.searchable ? new HBox( {
				cls: "search",
				content: this._search = new Input( {
					type: "text",
					placeholder: props.searchPlaceholder ?? _tr.global.settings.search,
					change: ( ) => this._filter( ),
				} ),
			} ) : null,

			new HBox( {
				cls: "body",
				flex: true,
				content: [
					this._toc = new Listbox( {
						cls: "toc",
						items: [],
						selectionChange: ( ev ) => this.showSection( ev.selection[0] as string ),
					} ),
					this._view = new VBox( { cls: "sections", flex: true } ),
				],
			} ),
		] );

		this._noMatch = new Label( { cls: "nomatch", text: props.noMatch ?? _tr.global.settings.nomatch, hidden: true } );
		this._view.addDOMEvent( "scroll", ( ) => this._followScroll( ) );

		// Escape empties the search
		if( this._search ) {
			this._search.addDOMEvent( "keydown", ( ev ) => {
				if( ev.key == "Escape" && this._search.getValue( ) ) {
					this._search.setValue( "" );
					this._filter( );
				}
			} );
		}

		if( props.sections ) {
			this.setSections( props.sections );
		}
	}

	/**
	 * the sections, in their order; for a class that builds them in its
	 * constructor, after super( )
	 */

	setSections( sections: SettingsSection[] ) {
		this._sections = sections.map( section => ( {
			section,
			shown: true,
			box: new VBox( {
				cls: "section",
				content: [
					new Label( { cls: "title", text: section.title } ),
					section.description ? new Label( { cls: "description", text: section.description } ) : null,
					...section.content,
				],
			} ),
		} ) );

		this._view.setContent( [ ...this._sections.map( s => s.box ), this._noMatch ] );
		this._current = "";
		this._filter( );
	}

	/**
	 * brings a section to the top of the view
	 */

	showSection( id: string, smooth = true ) {
		this._sections.find( s => s.section.id == id )?.box.scrollIntoView( { behavior: smooth ? "smooth" : "auto", block: "start" } );
	}

	/**
	 * the id of the section at the top of the view
	 */

	getSection( ) {
		return this._current;
	}

	/**
	 * shows what the search finds; everything when it is empty. A section
	 * whose title or description holds the words is shown whole; otherwise
	 * only its settings that hold them, and what holds those settings.
	 */

	private _filter( ) {
		const text = this._search ? this._search.getValue( ) : "";
		const words = normalize( text ).split( /\s+/ ).filter( w => w );
		const matches = ( text: string ) => {
			const t = normalize( text );
			return words.every( w => t.includes( w ) );
		};

		let found = false;
		for( const s of this._sections ) {
			const { section, box } = s;
			const whole = !words.length || matches( `${section.title} ${section.description ?? ""}` );
			let shown = whole;

			for( const c of section.content ) {
				const items = c instanceof SettingItem ? [c] : c.enumChildComponents( true ).filter( x => x instanceof SettingItem ) as SettingItem[];
				let some = false;
				for( const item of items ) {
					const ok = whole || matches( item.getSearchText( ) );
					item.show( ok );
					some ||= ok;
				}
				// what holds no setting (a table, a text) is shown with its whole section only
				c.show( whole || some );
				shown ||= some;
			}

			s.shown = shown;
			box.show( shown );
			found ||= shown;
		}

		this._noMatch.show( !found );

		// the summary lists the sections shown; the last one is as high as the
		// view at least: a click in the summary can bring every section to the top
		const shown = this._sections.filter( s => s.shown );
		this._sections.forEach( s => s.box.setClass( "last", s == shown[shown.length - 1] ) );
		this._toc.clearSelection( false );
		this._toc.setItems( shown.map( s => ( { id: s.section.id, text: s.section.title } ) ) );
		this._current = "";
		this._followScroll( );
	}

	/**
	 * the summary on the section at the top of the view; the first one while the view is hidden
	 */

	private _followScroll( ) {
		const view = this._view.getBoundingRect( );

		let current = "";
		for( const { section, box, shown } of this._sections ) {
			if( shown && ( !current || ( view.height && box.getBoundingRect( ).top <= view.top + 40 ) ) ) {
				current = section.id;
			}
		}

		this._toc.select( current, false );
		if( current != this._current ) {
			this._current = current;
			this.fire( "sectionChange", { section: current } );
		}
	}
}
