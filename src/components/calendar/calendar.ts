/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file calendar.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvChange, Flex } from '../../core/component'
import { date_clone, date_hash, formatIntlDate, Point, unsafeHtml } from "../../core/core_tools"
import { _tr } from '../../core/core_i18n';
import { EventCallback } from '../../core/core_events';

import { Button } from '../button/button';
import { Label } from '../label/label';
import { HBox, VBox } from '../boxes/boxes'
import { Menu, MenuItem } from '../menu/menu';

import "./calendar.module.scss"

import icon_prev from "./chevron-left-sharp-light.svg";
import icon_today from "./calendar-check-sharp-light.svg";
import icon_next from "./chevron-right-sharp-light.svg";

interface CalendarEventMap extends ComponentEvents {
	change?: EvChange;
}


interface CalendarProps extends ComponentProps {
	date?: Date;	// initial date to display
	minDate?: Date;	// minimal date before the user cannot go
	maxDate?: Date;	// maximal date after the user cannot go

	change?: EventCallback<EvChange>; // shortcut to events: { change: ... }
}


/**
 * default calendar control
 * 
 * fires:
 * 		EventChange ( value = Date )
 * 
 * @cssvar
 * ```
 * --calendar-btn-background
 * --calendar-btn-color
 * --calendar-btn-color-hover
 * --calendar-week-color
 * --calendar-week-color-hover
 * --calendard-day-background-hover
 * --calendard-day-color-hover
 * --calendar-sel-background
 * --calendar-sel-color
 * --calendar-today-background
 * --calendar-today-color
 * --calendar-today-border
 * --calendar-header-color
 * --calendar-out-color
 * --calendar-day-color
 * ```
 */

export class Calendar extends VBox<CalendarProps, CalendarEventMap>
{
	static classPrefix = "x4";

	private m_date: Date;

	constructor(props: CalendarProps) {
		super(props);

		this.mapPropEvents( props, 'change' );
		this.m_date = this._clamp( props.date ? date_clone( props.date ) : new Date() );

		this._update( );
	}

	/** @ignore */

	private _update( ) {

		let month_start = date_clone(this.m_date);
		month_start.setDate(1);

		let day = month_start.getDay();
		if (day == 0) {
			day = 7;
		}

		month_start.setDate(-day + 1 + 1);
		let dte = date_clone(month_start);

		let selection = date_hash( this.m_date );
		let today = date_hash( new Date() );

		let month_end = date_clone(this.m_date);
		month_end.setDate(1);
		month_end.setMonth(month_end.getMonth() + 1);
		month_end.setDate(0);

		let end_of_month = date_hash(month_end);

		let rows: HBox[] = [];

		// month selector
		let header = new HBox({
			cls: 'month-sel',
			content: [
				new Label({
					cls: 'month',
					text: formatIntlDate(this.m_date, 'O'),
					dom_events: {
						click: () => this._choose('month')
					}
				}),
				new Label({
					cls: 'year',
					text: formatIntlDate(this.m_date, 'Y'),
					dom_events: {
						click: () => this._choose('year')
					}
				}),
				new Flex( ),
				new Button({ icon: icon_prev, click: () => this._next(false) } ),
				new Button({ icon: icon_today, click: () => this.setDate( this._clamp( new Date() ) ), tooltip: _tr.global.today } ),
				new Button({ icon: icon_next, click: () => this._next(true) } )
			]
		});

		rows.push(header);

		// calendar part
		let day_names = [];

		// day names
		// empty week num
		day_names.push(new HBox({
			cls: 'weeknum cell',
		}));

		for (let d = 0; d < 7; d++) {
			day_names.push(new Label({
				cls: 'cell',
				text: _tr.global.day_short[(d + 1) % 7]
			}));
		}

		rows.push(new HBox({
			cls: 'week header',
			content: day_names
		}));

		let cmonth = this.m_date.getMonth();
		const { minDate, maxDate } = this.props;
		const min_hash = minDate ? date_hash( minDate ) : null;
		const max_hash = maxDate ? date_hash( maxDate ) : null;

		// weeks
		let first = true;
		while (date_hash(dte) <= end_of_month) {

			let days: Component[] = [
				new HBox({ cls: 'weeknum cell', content: new Component({ tag: 'span', content: formatIntlDate(dte, 'w') }) })
			];

			// days
			for (let d = 0; d < 7; d++) {

				let cls = 'cell day';
				if (date_hash(dte) == selection) {
					cls += ' selection';
				}

				if (date_hash(dte) == today) {
					cls += ' today';
				}

				if (dte.getMonth() != cmonth) {
					cls += ' out';
				}

				// out of minDate..maxDate: shown, not chosen
				const hash = date_hash( dte );
				const off = (min_hash!==null && hash < min_hash) || (max_hash!==null && hash > max_hash);
				if( off ) {
					cls += ' disabled';
				}

				const mkItem = ( dte: Date ) => {
					return new HBox({
						cls,
						flex: 1,
						content: new Component({
							cls: "text",
							content: unsafeHtml( `<span>${formatIntlDate(dte, 'd')}</span>` ),
						}),
						dom_events: off ? undefined : {
							click: () => this.select(dte)
						}
					})
				}

				days.push( mkItem( date_clone( dte ) ) );

				dte.setDate(dte.getDate() + 1);
				first = false;
			}

			rows.push(new HBox({
				cls: 'week',
				flex: 1,
				content: days
			}));
		}

		this.setContent(rows);
	}

	/**
	 * select the given date
	 * @param date 
	 */

	private select(date: Date) {
		this.m_date = date;
		this.fire('change', {value:date} );
		this._update();
	}

	/**
	 * 
	 */

	private _next(n: boolean) {
		this._goto( this.m_date.getFullYear( ), this.m_date.getMonth() + (n ? 1 : -1) );
	}

	/**
	 * shows another month: the day is kept, not past the end of the month
	 * (31 January → 28 February), and the date stays between minDate and maxDate
	 */

	private _goto( year: number, month: number ) {
		const day = this.m_date.getDate( );
		const d = date_clone( this.m_date );
		d.setDate( 1 );
		d.setFullYear( year, month );		// month 12: January of the next year
		d.setDate( Math.min( day, new Date( d.getFullYear( ), d.getMonth( )+1, 0 ).getDate( ) ) );

		this.m_date = this._clamp( d );
		this._update( );
	}

	/**
	 * the date brought between minDate and maxDate
	 */

	private _clamp( d: Date ) {
		const { minDate, maxDate } = this.props;
		if( minDate && d < minDate ) {
			return date_clone( minDate );
		}

		if( maxDate && d > maxDate ) {
			return date_clone( maxDate );
		}

		return d;
	}

	/**
	 * 
	 */

	private _choose(type: 'month' | 'year') {

		let items: MenuItem[] = [];

		if (type == 'month') {
			for (let m = 0; m < 12; m++) {
				items.push(({
					text: _tr.global.month_long[m],
					click: () => { this._goto( this.m_date.getFullYear( ), m ); }
				}));
			}
		}
		else if (type == 'year') {

			let min = this.props.minDate?.getFullYear() ?? 1900;
			let max = this.props.maxDate?.getFullYear() ?? 2037;

			for (let m = max; m >= min; m--) {
				items.push({
					text: '' + m,
					click: () => { this._goto( m, this.m_date.getMonth( ) ); }
				});
			}
		}

		let menu = new Menu({
			items
		});

		let rc = this.getBoundingRect();
		menu.displayAt(rc.left, rc.top);
	}

	// a copy: the calendar and its caller do not share the object
	getDate() {
		return date_clone( this.m_date );
	}

	setDate(date: Date) {
		this.m_date = date_clone( date );
		this._update();
	}
}




/**
 * default popup calendar
 * /

export class PopupCalendar extends Popup {
	static classPrefix = "x4";

	m_cal: Calendar;

	constructor(props: CalendarProps) {
		super({ tabIndex: 1 });

		this.enableMask(false);

		this.m_cal = new Calendar(props);
		this.m_cal.addClass('@fit');

		this.setContent(this.m_cal);
	}

	// binded
	private _handleClick = (e: MouseEvent) => {
		if (!this.dom) {
			return;
		}

		let newfocus = <HTMLElement>e.target;

		// child of this: ok
		if (this.dom.contains(newfocus)) {
			return;
		}

		// menu: ok
		let dest = Component.getElement(newfocus, MenuItem);
		if (dest) {
			return;
		}

		this.close();
	}

	/ ** @ignore * /
	show(modal?: boolean, at?: Point ) {
		x4document.addEventListener('mousedown', this._handleClick);
		if( at ) {
			super.displayAt( at.x, at.y, 'top left', undefined, modal );
		}
		else {
			super.show(modal);
		}
	}

	/ ** @ignore * /
	close() {
		x4document.removeEventListener('mousedown', this._handleClick);
		super.close();
	}
}
*/