/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file timeline.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvClick } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { UnsafeHtml } from '../../core/core_tools';
import { getCurrentLocale } from '../../core/core_i18n';
import { Icon } from '../icon/icon';

import "./timeline.module.scss";

export interface TimelineItem {
	icon?: string;					// in the round mark
	title: string | UnsafeHtml;		// in bold
	text?: string | UnsafeHtml;		// the sentence under it
	date?: Date;					// written relative to now, in the locale: "2 hours ago"; none: no time shown
	done?: boolean;					// the mark filled in the accent; else a grey mark
}

export interface TimelineEvents extends ComponentEvents {
	click: EvClick;					// context: the TimelineItem clicked
}

export interface TimelineProps extends ComponentProps {
	items?: TimelineItem[];
	vertical?: boolean;				// true by default; false: the events side by side
	renderer?: ( item: TimelineItem ) => Component;	// what is beside the mark
	click?: EventCallback<EvClick>;
}

/**
 * "2 hours ago", "yesterday", "in 3 days": the largest unit that gives at least 1
 */

function relativeTime( date: Date ): string {
	const fmt = new Intl.RelativeTimeFormat( getCurrentLocale( ), { numeric: "auto" } );
	const sec = ( date.getTime( ) - Date.now( ) ) / 1000;		// < 0: in the past
	const abs = Math.abs( sec );

	if( abs < 60 ) {
		return fmt.format( Math.trunc( sec ), "second" );
	}

	if( abs < 3600 ) {
		return fmt.format( Math.trunc( sec / 60 ), "minute" );
	}

	if( abs < 86400 ) {
		return fmt.format( Math.trunc( sec / 3600 ), "hour" );
	}

	if( abs < 86400 * 30 ) {
		return fmt.format( Math.trunc( sec / 86400 ), "day" );
	}

	if( abs < 86400 * 365 ) {
		return fmt.format( Math.trunc( sec / ( 86400 * 30 ) ), "month" );
	}

	return fmt.format( Math.trunc( sec / ( 86400 * 365 ) ), "year" );
}

/**
 * Events one after the other on a line, each with its icon in a round mark.
 * The line from a mark to the next one is in the accent when the next event is done,
 * dashed when the event it leaves is not done.
 *
 * @cssvar
 * ```
 * --timeline-done-color
 * --timeline-done-icon-color
 * --timeline-todo-color
 * --timeline-todo-icon-color
 * --timeline-title-color
 * --timeline-text-color
 * --timeline-time-color
 * ```
 */

export class Timeline extends Component<TimelineProps, TimelineEvents> {
	static classPrefix = "x4";

	constructor( props: TimelineProps ) {
		super( props );

		this.setClass( "vertical", props.vertical ?? true );

		this.mapPropEvents( props, "click" );
		this.addDOMEvent( "click", ( ev ) => this._onClick( ev ) );

		if( props.items ) {
			this.setItems( props.items );
		}
	}

	setItems( items: TimelineItem[] ) {
		const renderer = this.props.renderer;

		const content = items.map( ( item, i ) => {
			const body = renderer ? renderer( item ) : [
				new Component( { cls: "title", content: item.title } ),
				item.text ? new Component( { cls: "text", content: item.text } ) : null,
				item.date ? new Component( { cls: "time", content: relativeTime( item.date ) } ) : null,
			];

			const el = new Component( { cls: "item", content: [
				new Component( { cls: "rail", content: [
					new Component( { cls: "mark", content: new Icon( { iconId: item.icon } ) } ),
					new Component( { cls: "line" } ),
				] } ),
				new Component( { cls: "content", content: body } ),
			] } );

			el.setClass( "done", !!item.done );
			el.setClass( "next-done", i + 1 < items.length && !!items[i + 1].done );
			el.setInternalData( "item", item );
			return el;
		} );

		this.setContent( content );
	}

	/**
	 * a click anywhere in an event: its item
	 */

	private _onClick( ev: MouseEvent ) {
		const el = Component.closest( ev.target as Element, ".x4timeline > .item" );
		if( el ) {
			this.fire( "click", { context: el.getInternalData( "item" ) } );
		}
	}
}
