/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file planner.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvent, ComponentEvents, ComponentProps, EvClick, EvContextMenu, EvDblClick, EvSelectionChange } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { _tr } from '../../core/core_i18n';
import { isMac } from '../../core/core_shortcuts';
import { SvgBuilder, SvgComponent, SvgPath } from '../../core/core_svg';
import { clamp, date_add_days, date_clone, date_format, date_hash, date_week_start, formatIntlDate } from '../../core/core_tools';
import { Icon } from '../icon/icon';

import "./planner.module.scss";

export type PlannerID = string | number;
export type PlannerView = "day" | "week" | "month";

export interface PlannerEvent {
	id: PlannerID;
	title: string;
	start: Date;
	end?: Date;						// a date without hours is a whole day: end is its last day, included; else the time it ends. none: the day of start, or an hour after it
	text?: string;					// under the title, on as many lines as it has room for
	color?: string;					// a CSS colour for its border, its icon and a tint of its background; none: the accent of the theme
	icon?: string;					// on the right of its title, in its colour (as Icon: an svg)
	tooltip?: string;				// as html (see initTooltips)
	cls?: string;					// on each part of it: in each day, in the band, in the month
	data?: any;
}

export interface EvPlannerChange extends ComponentEvent {
	readonly event: PlannerEvent;	// as it was: the new dates are written in it after the event, unless ev.preventDefault( )
	readonly start: Date;
	readonly end: Date;				// as PlannerEvent.end
}

export interface EvPlannerSelect extends ComponentEvent {
	readonly start: Date;			// as an event: whole days have no hours, end is the last one
	readonly end: Date;
}

export interface EvPlannerView extends ComponentEvent {
	readonly view: PlannerView;
	readonly date: Date;
}

export interface PlannerEvents extends ComponentEvents {
	click: EvClick;					// context: the event
	dblClick: EvDblClick;			// context: the event
	contextMenu: EvContextMenu;		// context: the event
	selectionChange: EvSelectionChange;
	change: EvPlannerChange;		// an event moved, or one of its ends
	copy: EvPlannerChange;			// an event copied (ctrl, option on a Mac): nothing is written, the application adds it
	select: EvPlannerSelect;		// a range of time or of days, to create an event
	viewChange: EvPlannerView;		// the planner took another view: a day of the month opened
}

export interface PlannerProps extends Omit<ComponentProps,"content"> {
	events?: PlannerEvent[];
	view?: PlannerView;				// "week" by default
	date?: Date;					// a day shown; today by default
	workDays?: number[];			// as Date.getDay( ): monday to friday by default
	workHours?: [number, number];	// in minutes from midnight: 8:00 to 18:00 by default
	showOffDays?: boolean;			// the other days, narrower: true by default; false: the working days alone
	showOffHours?: boolean;			// the other hours, above and under the working ones, reached by the scroll: true by default; false: the working hours alone
	band?: boolean;					// the events of whole days in a band under the days: true by default; false: in the working hours of their days
	showSubGrid?: boolean;			// the lines of the steps between the hours: false by default
	step?: number;					// the precision of the pointer, in minutes: 15 by default
	readonly?: boolean;				// nothing is created, moved, stretched nor copied; the events are still clicked, the view moved
	click?: EventCallback<EvClick>;
	dblClick?: EventCallback<EvDblClick>;
	contextMenu?: EventCallback<EvContextMenu>;
	selectionChange?: EventCallback<EvSelectionChange>;
	change?: EventCallback<EvPlannerChange>;
	copy?: EventCallback<EvPlannerChange>;
	select?: EventCallback<EvPlannerSelect>;
	viewChange?: EventCallback<EvPlannerView>;
}

// an event on the planner: [start, end[, whole days from the midnight of the first one to the one after the last
interface PlannerItem {
	event: PlannerEvent;
	start: Date;
	end: Date;
	allDay: boolean;
}

// a day of the week, its place
interface PlannerColumn {
	date: Date;						// at midnight
	work: boolean;
	x: number;
	w: number;
}

// the part of an event with hours on a day, in minutes from midnight
interface PlannerSegment {
	item: PlannerItem;
	from: number;
	to: number;
	first: boolean;					// the day it starts
	last: boolean;					// the day it ends
}

// an event of whole days in the band: its columns, its line
interface PlannerBar {
	item: PlannerItem;
	c0: number;
	c1: number;
	lane: number;
}

// a day of the month
interface PlannerDay {
	date: Date;
	cell: Component;
	list: Component;
	more: Component;
}

// a point of the planner: the day, and the minutes in the canvas
interface PlannerPoint {
	day: Date;
	t: number;
}

interface PlannerDrag {
	area: "canvas" | "band" | "month";
	kind: "select" | "move" | "start" | "end";
	pointer: number;
	x: number;						// where the pointer went down, in the window
	y: number;
	moved: boolean;					// the pointer went 4px away: a drag, not a click
	copy: boolean;					// the key of the copy is down
	item: PlannerItem;				// move, start, end
	block: Component;				// the part of it under the pointer: stretched by one of its ends
	blocks: Component[];			// all its parts: faded while it is moved, not copied
	ghost: Component;				// where it goes, while it is moved
	day: Date;						// the day under the pointer at the start
	t0: number;						// canvas: the minutes under the pointer at the start
	preview: { start: Date, end: Date };	// the event where it goes
}

// the range selected, [start, end[: on a day of the canvas, or days of the band or of the month
interface PlannerRange {
	area: PlannerDrag["area"];
	start: Date;
	end: Date;
}

const DAY = 86400000;
const DAY_MINUTES = 24 * 60;
const GUTTER = 52;					// the hours, on the left
const MIN_STEP_PX = 10;				// a step of the working hours, at least
const HOURS_MARGIN = 12;			// shown above and under the working hours: their first and last hours can be read
const OFF_DAY_WEIGHT = 0.35;		// the width of a day off in the week, a working day being 1
const OFF_DAY_WEIGHT_MONTH = 0.5;
const FREE_STRIP = 14;				// on the right of a day: a press there selects, even over an event
const SMALL_EVENT = 40;				// under this height, an event is on one line
const EVENT_GAP = 2;				// between an event and the next one, from top to bottom
const GHOST_SHIFT = 16;				// the ghost of an event alone in its day: not on the event alone in the other one
const BAND_LINE = 22;				// a line of the band of the whole days
const MONTH_LINE = 20;				// a line of a day of the month, its gap included (scss)
const SCROLL_EDGE = 24;				// a drag that near the top or the bottom of the body scrolls it
const SCROLL_STEP = 8;				// by so many px every 20ms

// the days of the week from monday, as Date.getDay( ) numbers them
const WEEK = [ 1, 2, 3, 4, 5, 6, 0 ];

function hasTime( date: Date ) {
	return date.getHours( )!=0 || date.getMinutes( )!=0;
}

function dayOf( date: Date ) {
	return new Date( date.getFullYear( ), date.getMonth( ), date.getDate( ) );
}

function minutesOf( date: Date ) {
	return date.getHours( ) * 60 + date.getMinutes( );
}

// a time of a day; 24:00: the midnight after it
function atMinutes( day: Date, minutes: number ) {
	return new Date( day.getFullYear( ), day.getMonth( ), day.getDate( ), 0, minutes );
}

// the days from a midnight to another one (a day of summer time counts as one)
function daysBetween( from: Date, to: Date ) {
	return Math.round( ( to.getTime( ) - from.getTime( ) ) / DAY );
}

function timeText( date: Date ) {
	return formatIntlDate( date, "h:I" );
}

/**
 * an event on the planner: [start, end[
 */

function measure( event: PlannerEvent ): PlannerItem {
	const start = event.start;

	if( !hasTime( start ) && ( !event.end || !hasTime( event.end ) ) ) {
		const last = event.end && event.end.getTime( ) > start.getTime( ) ? event.end : start;
		return { event, start: dayOf( start ), end: date_add_days( dayOf( last ), 1 ), allDay: true };
	}

	const end = event.end ?? new Date( start.getTime( ) + 3600000 );
	return { event, start, end: end.getTime( ) > start.getTime( ) ? end : start, allDay: false };
}

/**
 * the end of an event from [start, end[: the day before for whole days (their last one), else that time
 */

function endOf( start: Date, end: Date ) {
	return !hasTime( start ) && !hasTime( end ) ? date_add_days( end, -1 ) : end;
}

/**
 * the lane of each segment in its group of segments that overlap, and the count of lanes of that
 * group: they share the width of their day. segments: sorted by start
 */

function layoutLanes( segments: PlannerSegment[] ) {
	const result: { segment: PlannerSegment, lane: number, lanes: number }[] = [];

	let group: typeof result = [];
	let ends: number[] = [];
	let groupEnd = -1;

	const close = ( ) => {
		group.forEach( r => r.lanes = ends.length );
		result.push( ...group );
		group = [];
		ends = [];
	};

	segments.forEach( segment => {
		if( segment.from >= groupEnd ) {
			close( );
		}

		let lane = ends.findIndex( end => end <= segment.from );
		if( lane < 0 ) {
			lane = ends.length;
			ends.push( segment.to );
		}
		else {
			ends[lane] = segment.to;
		}

		group.push( { segment, lane, lanes: 0 } );
		groupEnd = Math.max( groupEnd, segment.to );
	} );

	close( );
	return result;
}

/**
 * the first and the last index of the dates from a day to another, [from, to[; null: none of them
 */

function indicesOf( dates: Date[], from: Date, to: Date ): [ number, number ] {
	let first = -1;
	let last = -1;

	dates.forEach( ( date, i ) => {
		if( date.getTime( ) >= from.getTime( ) && date.getTime( ) < to.getTime( ) ) {
			if( first < 0 ) {
				first = i;
			}

			last = i;
		}
	} );

	return first < 0 ? null : [ first, last ];
}

// the key that makes a drag a copy: option on a Mac, where ctrl+click is the right click; ctrl elsewhere
function isCopyKey( ev: MouseEvent ) {
	return isMac ? ev.altKey : ev.ctrlKey;
}

/**
 * Not in `x4js`: import it from `"x4js/planner"`.
 *
 * Events on a calendar, by day, by week or by month.
 *
 * In a day or a week, the days are in columns, the hours from top to bottom: the working hours
 * fill the height of the view, the others above and under them are reached by the scroll, or not
 * shown (showOffHours); the days
 * off are narrower, or not shown (showOffDays). The events of whole days are in a band under the
 * days, or in the working hours of their days (band). The lines of the steps between the hours
 * can be shown (showSubGrid).
 *
 * With the pointer: a drag on an empty place selects a range (`select`: the application creates
 * the event); the strip on the right of a day, or shift, select over the events too. A drag moves
 * an event, or one of its ends (`change`); ctrl (option on a Mac) copies it (`copy`). In the month,
 * a double click on a day, or its "+n", opens its week.
 *
 * Read only (readonly, setReadOnly): nothing is created, moved, stretched nor copied. Disabled
 * (disabled, enable( false )): nothing, faded as a Box (--box-disabled-opacity).
 *
 * A date without hours is a whole day: `end` is the last day of the event, included.
 *
 * @cssvar
 * ```
 * --planner-background
 * --planner-border
 * --planner-border-focus
 * --planner-header-color
 * --planner-day-color
 * --planner-off-color
 * --planner-today-background
 * --planner-today-color
 * --planner-today-column
 * --planner-off-background
 * --planner-line-color
 * --planner-step-color
 * --planner-hour-line-color
 * --planner-hour-color
 * --planner-hour-color-work
 * --planner-edge-background
 * --planner-edge-color
 * --planner-edge-shadow
 * --planner-now-color
 * --planner-now-tag
 * --planner-now-text
 * --planner-event-background
 * --planner-event-color
 * --planner-event-tint
 * --planner-event-radius
 * --planner-event-title
 * --planner-event-text
 * --planner-event-selected
 * --planner-range-background
 * --planner-range-border
 * --planner-out-color
 * --planner-more-color
 * ```
 */

export class Planner extends Component<PlannerProps, PlannerEvents> {
	static classPrefix = "x4";

	private _events: PlannerEvent[];
	private _items: PlannerItem[] = [];
	private _view: PlannerView;
	private _date: Date;			// at midnight
	private _workDays: number[];
	private _workHours: [number, number];
	private _offDays: boolean;				// the days off shown
	private _offHours: boolean;				// the hours out of the working ones shown
	private _bandShown: boolean;			// the events of whole days in the band
	private _readonly: boolean;
	private _step: number;

	private _columns: PlannerColumn[] = [];
	private _monthDays: PlannerDay[] = [];
	private _blocks: Component[] = [];		// the events drawn: in the days, in the band, in the month
	private _hourPx = 40;					// the height of a working hour
	private _scrolled = false;				// the first layout shows the start of the working hours
	private _selection: PlannerID;
	private _drag: PlannerDrag;
	private _range: PlannerRange;
	private _scrollDir = 0;					// a drag near the top (-1) or the bottom (1) of the body: it scrolls
	private _scrollEv: PointerEvent;		// the last move of that drag
	private _parts: { col: PlannerColumn, top: number, bottom: number }[] = [];	// the events in the days: where they are

	private _head: Component;
	private _band: Component;
	private _bandRange: Component;
	private _body: Component;
	private _canvas: Component;
	private _grid: SvgComponent;
	private _hours: Component;
	private _layer: Component;
	private _marks: Component;
	private _now: Component;				// the line of now: on the days before today
	private _nowToday: Component;			// on today, paler
	private _nowAfter: Component;			// on the days after it
	private _nowTime: Component;
	private _edges: Component;
	private _month: Component;
	private _names: Component;
	private _cells: Component;

	constructor( props: PlannerProps ) {
		super( props );

		this._events = props.events ?? [];
		this._view = props.view ?? "week";
		this._date = dayOf( props.date ?? new Date( ) );
		this._workDays = props.workDays ?? [ 1, 2, 3, 4, 5 ];
		this._workHours = props.workHours ?? [ 8 * 60, 18 * 60 ];
		this._offDays = props.showOffDays ?? true;
		this._offHours = props.showOffHours ?? true;
		this._bandShown = props.band ?? true;
		this._step = props.step ?? 15;

		this.setAttribute( "tabindex", 0 );
		this._readonly = !!props.readonly;
		this.setClass( "readonly", this._readonly );
		this.setClass( "nosubgrid", !props.showSubGrid );

		this._bandRange = new Component( { cls: "range" } );

		this.setContent( [
			this._head = new Component( { cls: "head" } ),
			this._band = new Component( { cls: "band" } ),
			this._body = new Component( { cls: "body", content:
				this._canvas = new Component( { cls: "canvas", content: [
					this._grid = new SvgComponent( { cls: "grid" } ),
					this._hours = new Component( { cls: "hours" } ),
					this._layer = new Component( { cls: "layer" } ),
					this._marks = new Component( { cls: "marks" } ),
					this._now = new Component( { cls: "now" } ),
					this._nowToday = new Component( { cls: "now today" } ),
					this._nowAfter = new Component( { cls: "now" } ),
					this._nowTime = new Component( { cls: "now-time" } ),
					this._edges = new Component( { cls: "edges" } ),
				] } ),
			} ),
			this._month = new Component( { cls: "month", content: [
				this._names = new Component( { cls: "names" } ),
				this._cells = new Component( { cls: "cells" } ),
			] } ),
		] );

		this.mapPropEvents( props, "click", "dblClick", "contextMenu", "selectionChange", "change", "copy", "select", "viewChange" );

		this.addDOMEvent( "dblclick", ( ev ) => this._onDblClick( ev ) );
		this.addDOMEvent( "contextmenu", ( ev ) => this._onContextMenu( ev ) );
		this.addDOMEvent( "keydown", ( ev ) => this._onKey( ev ) );
		this.addDOMEvent( "resized", ( ) => this._onResize( ) );
		this._body.addDOMEvent( "scroll", ( ) => this._renderEdges( ) );

		this.addDOMEvent( "pointerdown", ( ev ) => this._onPointerDown( ev ) );
		this.addDOMEvent( "pointermove", ( ev ) => this._onPointerMove( ev ) );
		this.addDOMEvent( "pointerup", ( ev ) => this._onPointerUp( ev ) );
		this.addDOMEvent( "pointercancel", ( ) => this._onPointerCancel( ) );
		this.addDOMEvent( "lostpointercapture", ( ) => this._onPointerCancel( ) );

		this.setInterval( "now", 60 * 1000, ( ) => this._placeNow( ) );

		this._render( );
	}

	/**
	 * the event selected, when it is not in them any more: none
	 */

	setEvents( events: PlannerEvent[] ) {
		this._events = events;
		this._range = null;

		if( !events.some( event => event.id===this._selection ) ) {
			this._selection = undefined;
		}

		this._render( );
	}

	setView( view: PlannerView ) {
		this._view = view;
		this._range = null;
		this._render( );
	}

	getView( ): PlannerView {
		return this._view;
	}

	/**
	 * nothing is created, moved, stretched nor copied; the events are still clicked, the view moved
	 */

	setReadOnly( ro: boolean ) {
		this._readonly = ro;
		this.setClass( "readonly", ro );
		this._renderItems( );		// their ends to drag
	}

	/**
	 * the events of whole days in a band under the days; false: in the working hours of their days
	 */

	setBand( band: boolean ) {
		this._bandShown = band;
		this._range = null;
		this._render( );
	}

	/**
	 * the days off shown, narrower; false: the working days alone
	 */

	setShowOffDays( show: boolean ) {
		this._offDays = show;
		this._range = null;
		this._render( );
	}

	/**
	 * the lines of the steps between the hours; false: the lines of the hours alone
	 */

	setShowSubGrid( show: boolean ) {
		this.setClass( "nosubgrid", !show );
	}

	/**
	 * the precision of the pointer, in minutes; its lines in the working hours, of 10px at least
	 */

	setStep( step: number ) {
		this._step = step;
		this._range = null;
		this._render( );
	}

	/**
	 * the hours out of the working ones shown, reached by the scroll; false: the working hours alone
	 */

	setShowOffHours( show: boolean ) {
		this._offHours = show;
		this._scrolled = false;
		this._range = null;
		this._render( );
	}

	/**
	 * a day to show: its day, its week or its month
	 */

	setDate( date: Date ) {
		this._date = dayOf( date );
		this._range = null;
		this._render( );
	}

	getDate( ): Date {
		return date_clone( this._date );
	}

	/**
	 * the day, the week or the month after
	 */

	next( ) {
		this._moveBy( 1 );
	}

	prev( ) {
		this._moveBy( -1 );
	}

	/**
	 * the first and the last day shown; in the month, its days
	 */

	getRange( ): { start: Date, end: Date } {
		const date = this._date;

		switch( this._view ) {
			case "day": {
				return { start: date_clone( date ), end: date_clone( date ) };
			}

			case "week": {
				const start = date_week_start( date );
				return { start, end: date_add_days( start, 6 ) };
			}

			default: {
				return { start: new Date( date.getFullYear( ), date.getMonth( ), 1 ), end: new Date( date.getFullYear( ), date.getMonth( ) + 1, 0 ) };
			}
		}
	}

	/**
	 * an event selected, without selectionChange; null: none
	 */

	selectEvent( id: PlannerID ) {
		const item = this._items.find( item => item.event.id===id );
		this._select( item ?? null, false );
	}

	getSelection( ): PlannerID {
		return this._selection;
	}

	private _moveBy( n: number ) {
		const date = this._date;

		switch( this._view ) {
			case "day": {
				// the days off not shown: the working day before or after
				let day = date_add_days( date, n );
				while( !this._offDays && this._workDays.length && !this._isWorkDay( day ) ) {
					day = date_add_days( day, n );
				}

				this.setDate( day );
				break;
			}

			case "week":	this.setDate( date_add_days( date, 7 * n ) ); break;
			case "month":	this.setDate( new Date( date.getFullYear( ), date.getMonth( ) + n, 1 ) ); break;
		}
	}

	// :: RENDER ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _render( ) {
		this._items = this._events.filter( event => !!event.start ).map( measure );
		this.setClass( "month", this._view=="month" );

		if( this._view=="month" ) {
			this._renderMonth( );
		}
		else {
			this._renderWeek( );
		}
	}

	/**
	 * the days in columns (the days off too, or not), the hours from top to bottom: the working
	 * hours fill what remains of the height, the others as high (or not shown), a step never
	 * smaller than MIN_STEP_PX
	 */

	private _renderWeek( ) {
		const day = this._view=="day";
		const first = day ? this._date : date_week_start( this._date );
		let dates: Date[] = [];
		for( let i = 0; i < ( day ? 1 : 7 ); i++ ) {
			dates.push( date_add_days( first, i ) );
		}

		if( !day && !this._offDays && this._workDays.length ) {
			dates = dates.filter( date => this._isWorkDay( date ) );
		}

		// the band first: its height is taken from the one of the body
		this._band.show( this._bandShown );
		if( this._bandShown ) {
			this._setBandHeight( this._layoutBars( this._items, dates ) );
		}

		const height = this._body.dom.clientHeight;
		if( !height ) {
			return;		// not shown yet: the resize will come
		}

		// the time at the top of the view: it stays there when the height of an hour changes (a resize)
		const top = this._scrolled ? this._tOf( this._body.dom.scrollTop ) : 0;

		// the working hours fill the height, but for a margin above and under them where their first
		// and last hours can be read; the others, as high, above and under them: the scroll reaches them
		const [ workStart, workEnd ] = this._workHours;
		const margin = this._offHours ? HOURS_MARGIN * 2 : 0;
		this._hourPx = Math.max( MIN_STEP_PX * 60 / this._step, ( height - 1 - margin ) / ( ( workEnd - workStart ) / 60 ) );

		const total = Math.ceil( this._yOf( DAY_MINUTES ) );
		this._canvas.setStyle( { height: total } );

		// the width of the body without its scroll bar
		const width = this._body.dom.clientWidth - GUTTER;
		const weights = dates.map( date => dates.length > 1 && !this._isWorkDay( date ) ? OFF_DAY_WEIGHT : 1 );
		const sum = weights.reduce( ( a, b ) => a + b, 0 );

		let x = GUTTER;
		this._columns = dates.map( ( date, i ) => {
			const w = width * weights[i] / sum;
			const col = { date, work: this._isWorkDay( date ), x, w };
			x += w;
			return col;
		} );

		this._renderHead( );
		this._renderGrid( x, total );
		this._renderHours( );
		this._renderItems( );
		this._placeNow( );

		if( !this._scrolled ) {
			this._scrolled = true;
			this._body.dom.scrollTop = this._yOf( workStart ) - HOURS_MARGIN;
		}
		else {
			this._body.dom.scrollTop = this._yOf( top );
		}
	}

	// the days, over their columns: the name of the day, its number under it
	private _renderHead( ) {
		const today = date_hash( new Date( ) );

		this._head.setContent( this._columns.map( col => {
			const cell = new Component( { cls: "day", style: { left: col.x, width: col.w }, content: [
				new Component( { cls: "name", content: date_format( col.date, { weekday: "short" } ) } ),
				new Component( { cls: "num", content: "" + col.date.getDate( ) } ),
			] } );
			cell.setClass( "off", !col.work );
			cell.setClass( "today", date_hash( col.date )==today );
			return cell;
		} ) );
	}

	/**
	 * behind the events, a path for each: the days off and the hours out of the working ones,
	 * today, the steps, the lines between the days and of the hours off, the lines of the working hours
	 */

	private _renderGrid( width: number, height: number ) {
		const svg = new SvgBuilder( );
		const off = svg.path( ).addClass( "off" );
		const today = svg.path( ).addClass( "today" );
		const steps = svg.path( ).addClass( "step" );
		const lines = svg.path( ).addClass( "line" );
		const hours = svg.path( ).addClass( "hour" );
		const [ workStart, workEnd ] = this._workHours;
		const [ shownStart, shownEnd ] = this._hoursShown( );

		const rect = ( path: SvgPath, x1: number, y1: number, x2: number, y2: number ) => {
			path.moveTo( x1, y1 ).lineTo( x2, y1 ).lineTo( x2, y2 ).lineTo( x1, y2 ).closePath( );
		};

		if( this._offHours ) {
			rect( off, GUTTER, 0, width, this._yOf( workStart ) );
			rect( off, GUTTER, this._yOf( workEnd ), width, height );
		}

		const now = date_hash( new Date( ) );
		this._columns.forEach( col => {
			if( !col.work ) {
				rect( off, col.x, 0, col.x + col.w, height );
			}

			if( date_hash( col.date )==now ) {
				rect( today, col.x, 0, col.x + col.w, height );
			}

			lines.moveTo( col.x, 0 ).lineTo( col.x, height );
		} );

		// the hours shown: darker in the working ones; the steps from midnight, in the working hours
		for( let h = 1; h < 24; h++ ) {
			const t = h * 60;
			if( t <= shownStart || t >= shownEnd ) {
				continue;
			}

			const y = this._yOf( t );
			( t >= workStart && t <= workEnd ? hours : lines ).moveTo( GUTTER, y ).lineTo( width, y );
		}

		for( let t = Math.ceil( workStart / this._step ) * this._step; t < workEnd; t += this._step ) {
			if( t % 60 ) {
				const y = this._yOf( t );
				steps.moveTo( GUTTER, y ).lineTo( width, y );
			}
		}

		this._grid.setAttribute( "width", width );
		this._grid.setAttribute( "height", height );
		this._grid.setAttribute( "viewBox", `0 0 ${width} ${height}` );
		this._grid.setSvg( svg );
	}

	// the hours shown on the left, but on the edges; those out of the working ones paler
	private _renderHours( ) {
		const [ workStart, workEnd ] = this._workHours;
		const [ shownStart, shownEnd ] = this._hoursShown( );
		const labels: Component[] = [];

		for( let h = 1; h < 24; h++ ) {
			const t = h * 60;
			const work = t >= workStart && t <= workEnd;
			if( t <= shownStart || t >= shownEnd ) {
				continue;
			}

			const label = new Component( { cls: "hour", style: { top: this._yOf( t ) }, content: timeText( atMinutes( this._date, t ) ) } );
			label.setClass( "work", work );
			label.setInternalData( "y", this._yOf( t ) );
			labels.push( label );
		}

		this._hours.setContent( labels );
	}

	// the events: in the band and in the days, or in the month
	private _renderItems( ) {
		this._blocks = [];

		if( this._view=="month" ) {
			this._renderLines( );
		}
		else {
			if( this._bandShown ) {
				this._renderBand( );
			}

			this._renderEvents( );
		}

		this._renderRange( );
	}

	/**
	 * the events of whole days on the days shown: on the first line of the band where they have room
	 */

	private _layoutBars( items: PlannerItem[], dates: Date[] ): PlannerBar[] {
		const bars: PlannerBar[] = [];
		const ends: number[] = [];		// the last column of each line

		items
			.filter( item => item.allDay )
			.sort( ( a, b ) => a.start.getTime( ) - b.start.getTime( ) || b.end.getTime( ) - a.end.getTime( ) )
			.forEach( item => {
				// on the days shown only
				const cols = indicesOf( dates, item.start, item.end );
				if( !cols ) {
					return;
				}

				const [ c0, c1 ] = cols;
				let lane = ends.findIndex( end => end < c0 );
				if( lane < 0 ) {
					lane = ends.length;
					ends.push( c1 );
				}
				else {
					ends[lane] = c1;
				}

				bars.push( { item, c0, c1, lane } );
			} );

		return bars;
	}

	// a line for each line of bars, one at least: a range of days can be selected in it
	private _setBandHeight( bars: PlannerBar[] ) {
		const lanes = bars.reduce( ( n, bar ) => Math.max( n, bar.lane + 1 ), 1 );
		this._band.setStyle( { height: lanes * BAND_LINE + 4 } );
	}

	// the band of the whole days: the days off, the bars, the range of days selected
	private _renderBand( ) {
		const cols = this._columns;
		const bars = this._layoutBars( this._items, cols.map( col => col.date ) );
		this._setBandHeight( bars );

		const today = date_hash( new Date( ) );
		const content: Component[] = cols.map( col => {
			const day = new Component( { cls: "day", style: { left: col.x, width: col.w } } );
			day.setClass( "off", !col.work );
			day.setClass( "today", date_hash( col.date )==today );
			return day;
		} );

		bars.forEach( bar => {
			const x = cols[bar.c0].x + 2;
			const block = this._makeBar( bar.item );
			block.setStyle( { left: x, width: cols[bar.c1].x + cols[bar.c1].w - x - 3, top: bar.lane * BAND_LINE + 2, height: BAND_LINE - 2 } );
			content.push( block );
		} );

		content.push( this._bandRange );
		this._band.setContent( content );
	}

	/**
	 * the events in their days (those of whole days too, without the band); those that overlap
	 * share the width of their day, but for the strip on its right
	 */

	private _renderEvents( ) {
		const items = this._bandShown ? this._items.filter( item => !item.allDay ) : this._items;
		const blocks: Component[] = [];
		this._parts = [];

		this._columns.forEach( col => {
			const segments = items.map( item => this._segmentOn( item, col.date ) ).filter( segment => !!segment );
			segments.sort( ( a, b ) => a.from - b.from || a.to - b.to );

			const free = Math.min( FREE_STRIP, col.w * 0.2 );
			layoutLanes( segments ).forEach( ( { segment, lane, lanes } ) => {
				const w = ( col.w - 4 - free ) / lanes;
				const span = this._span( segment.from, segment.to );

				const block = this._makeEvent( segment );
				block.setStyle( { left: col.x + 2 + lane * w, width: w - 2, ...span } );
				block.setClass( "small", span.height < SMALL_EVENT );
				block.setInternalData( "segment", segment );
				block.setInternalData( "alone", lanes==1 );
				blocks.push( block );
				this._parts.push( { col, top: span.top, bottom: span.top + span.height } );
			} );
		} );

		this._layer.setContent( blocks );
		this._renderEdges( );
	}

	/**
	 * the events out of the view, above or under it: in each day, a mark at the top or the bottom
	 * of the view, how many; a click on it scrolls to the nearest of them
	 */

	private _renderEdges( ) {
		const body = this._body.dom;
		const top = body.scrollTop;
		const bottom = top + body.clientHeight;
		const edges: Component[] = [];

		this._columns.forEach( col => {
			const parts = this._parts.filter( part => part.col===col );
			const above = parts.filter( part => part.bottom <= top );
			const under = parts.filter( part => part.top >= bottom );

			if( above.length ) {
				const nearest = above.reduce( ( a, b ) => b.bottom > a.bottom ? b : a );
				edges.push( this._makeEdge( col, "up", above.length, top, ( ) => body.scrollTop = nearest.top - HOURS_MARGIN ) );
			}

			if( under.length ) {
				const nearest = under.reduce( ( a, b ) => b.top < a.top ? b : a );
				edges.push( this._makeEdge( col, "down", under.length, bottom, ( ) => body.scrollTop = nearest.bottom - body.clientHeight + HOURS_MARGIN ) );
			}
		} );

		this._edges.setContent( edges );
	}

	// a mark of the events out of the view in a day, at y: the top of the view, or its bottom
	private _makeEdge( col: PlannerColumn, dir: "up" | "down", count: number, y: number, click: ( ) => void ) {
		return new Component( {
			cls: "edge " + dir,
			style: { left: col.x + col.w / 2, top: y },
			content: ( dir=="up" ? "▲ " : "▼ " ) + count,
			dom_events: { click },
		} );
	}

	/**
	 * now, when today is shown, in the hours shown: a line across the days, over their events,
	 * paler across today; its time in the hours on the left, over the one it would cover
	 */

	private _placeNow( ) {
		const now = new Date( );
		const [ shownStart, shownEnd ] = this._hoursShown( );
		const t = minutesOf( now );
		const col = this._view=="month" || t < shownStart || t > shownEnd ? null : this._columnOf( now );
		const shown = !!col;
		const top = this._yOf( t );
		const first = this._columns[0];
		const last = this._columns[this._columns.length - 1];

		this._now.show( shown && col!==first );
		this._nowToday.show( shown );
		this._nowAfter.show( shown && col!==last );
		this._nowTime.show( shown );

		if( shown ) {
			this._now.setStyle( { left: first.x, width: col.x - first.x, top } );
			this._nowToday.setStyle( { left: col.x, width: col.w, top } );
			this._nowAfter.setStyle( { left: col.x + col.w, width: last.x + last.w - col.x - col.w, top } );
			this._nowTime.setStyle( { top } );
			this._nowTime.setContent( timeText( now ) );
		}

		this._hours.enumChildComponents( false ).forEach( label => {
			label.setClass( "covered", shown && Math.abs( label.getInternalData<number>( "y" ) - top ) < 14 );
		} );
	}

	/**
	 * the month of the date: its weeks from the monday before its first day to the sunday after
	 * its last one, the days off narrower (or not shown)
	 */

	private _renderMonth( ) {
		const month = new Date( this._date.getFullYear( ), this._date.getMonth( ), 1 );
		const first = date_week_start( month );
		const last = new Date( month.getFullYear( ), month.getMonth( ) + 1, 0 );
		const weeks = Math.ceil( ( daysBetween( first, last ) + 1 ) / 7 );
		const today = date_hash( new Date( ) );
		const shown = ( d: number ) => this._offDays || !this._workDays.length || this._workDays.includes( d );
		const week = WEEK.filter( shown );

		this._month.setStyleVariable( "--planner-cols", week.map( d => this._workDays.includes( d ) ? "1fr" : OFF_DAY_WEIGHT_MONTH + "fr" ).join( " " ) );
		this._month.setStyleVariable( "--planner-rows", "" + weeks );

		this._names.setContent( week.map( d => {
			const name = new Component( { cls: "name", content: _tr.global.day_short[d] } );
			name.setClass( "off", !this._workDays.includes( d ) );
			return name;
		} ) );

		this._monthDays = [];
		for( let i = 0; i < weeks * 7; i++ ) {
			const date = date_add_days( first, i );
			if( !shown( date.getDay( ) ) ) {
				continue;
			}

			const list = new Component( { cls: "list" } );
			const more = new Component( { cls: "more", hidden: true } );
			const cell = new Component( { cls: "day", content: [ new Component( { cls: "num", content: "" + date.getDate( ) } ), list, more ] } );

			cell.setClass( "out", date.getMonth( )!=month.getMonth( ) );
			cell.setClass( "today", date_hash( date )==today );
			cell.setClass( "off", !this._isWorkDay( date ) );
			this._monthDays.push( { date, cell, list, more } );
		}

		this._cells.setContent( this._monthDays.map( day => day.cell ) );
		this._renderItems( );
	}

	/**
	 * the events of each day of the month, the whole days first; when they do not hold in it,
	 * the last line tells how many are not shown
	 */

	private _renderLines( ) {
		const items = this._items;

		this._monthDays.forEach( day => {
			const from = day.date.getTime( );
			const next = date_add_days( day.date, 1 ).getTime( );

			const list = items
				.filter( item => item.start.getTime( ) < next && ( item.end.getTime( ) > from || item.start.getTime( )==from ) )
				.sort( ( a, b ) => +b.allDay - +a.allDay || a.start.getTime( ) - b.start.getTime( ) || a.end.getTime( ) - b.end.getTime( ) );

			// how many lines hold: all of them while the month is not shown
			const height = day.list.getBoundingRect( ).height + day.more.getBoundingRect( ).height;
			const room = height > 0 ? Math.max( 1, Math.floor( height / MONTH_LINE ) ) : list.length;
			const shown = list.length > room ? room - 1 : list.length;

			day.list.setContent( list.slice( 0, shown ).map( item => this._makeLine( item, day.date ) ) );
			day.more.setContent( "+" + ( list.length - shown ) );
			day.more.show( list.length > shown );
		} );
	}

	// the range selected: on a day of the canvas, on days of the band or of the month
	private _renderRange( ) {
		const range = this._range;

		if( this._view=="month" ) {
			this._monthDays.forEach( day => {
				const date = day.date.getTime( );
				day.cell.setClass( "range", !!range && date >= range.start.getTime( ) && date < range.end.getTime( ) );
			} );
			return;
		}

		const cols = this._columns;
		const marks: Component[] = [];
		this._bandRange.hide( );

		if( range && range.area=="canvas" ) {
			const col = this._columnOf( range.start );
			if( col ) {
				const top = this._yOf( minutesOf( range.start ) );

				marks.push(
					new Component( { cls: "range", style: { left: col.x + 1, width: col.w - 2, top, height: this._yOf( this._minutesTo( col.date, range.end ) ) - top } } ),
					new Component( { cls: "range-label", style: { left: col.x + 6, top: top + 2 }, content: `${timeText( range.start )} – ${timeText( range.end )}` } ),
				);
			}
		}
		else if( range && range.area=="band" ) {
			const shown = indicesOf( cols.map( col => col.date ), range.start, range.end );
			if( shown ) {
				const [ c0, c1 ] = shown;
				this._bandRange.setStyle( { left: cols[c0].x + 1, width: cols[c1].x + cols[c1].w - cols[c0].x - 2 } );
				this._bandRange.show( );
			}
		}

		this._marks.setContent( marks );
	}

	// :: EVENTS DRAWN ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// what each part of an event has: its colour, its tooltip, its classes
	private _makeBlock( item: PlannerItem, cls: string, content: Component[] ) {
		const event = item.event;
		const block = new Component( { cls: "event " + cls, tooltip: event.tooltip, content } );

		block.setClass( "selected", event.id===this._selection );

		// the stylesheet puts it on its border, its texts and its tint
		if( event.color ) {
			block.addClass( "colored" );
			block.setStyleVariable( "--planner-color", event.color );
		}

		if( event.cls ) {
			block.addClass( event.cls );
		}

		block.setInternalData( "item", item );
		this._blocks.push( block );
		return block;
	}

	// the title of an event, its icon on its right
	private _makeHead( event: PlannerEvent ) {
		const content: Component[] = [ new Component( { cls: "title", content: event.title } ) ];

		if( event.icon ) {
			content.push( new Icon( { cls: "icon", iconId: event.icon } ) );
		}

		return new Component( { cls: "head", content } );
	}

	// an event in a day: its title, its times (a whole day has none), its text; the ends that can be dragged, on the days it starts and ends
	private _makeEvent( segment: PlannerSegment ) {
		const item = segment.item;
		const event = item.event;
		const content: Component[] = [ this._makeHead( event ) ];

		if( !item.allDay ) {
			content.push( new Component( { cls: "time", content: `${timeText( item.start )} – ${timeText( item.end )}` } ) );
		}

		if( event.text ) {
			content.push( new Component( { cls: "text", content: event.text } ) );
		}

		if( !this._readonly ) {
			if( segment.first ) {
				content.push( new Component( { cls: "grip start" } ) );
			}

			if( segment.last ) {
				content.push( new Component( { cls: "grip end" } ) );
			}
		}

		return this._makeBlock( item, "", content );
	}

	// an event of whole days in the band: its title, its ends that can be dragged
	private _makeBar( item: PlannerItem ) {
		const content: Component[] = [ this._makeHead( item.event ) ];

		if( !this._readonly ) {
			content.push( new Component( { cls: "grip start" } ), new Component( { cls: "grip end" } ) );
		}

		return this._makeBlock( item, "bar", content );
	}

	// an event in a day of the month: the time it starts that day, its title
	private _makeLine( item: PlannerItem, day: Date ) {
		const content: Component[] = [ this._makeHead( item.event ) ];

		if( !item.allDay && item.start.getTime( ) >= day.getTime( ) ) {
			content.unshift( new Component( { cls: "time", content: timeText( item.start ) } ) );
		}

		return this._makeBlock( item, "line", content );
	}

	// :: GEOMETRY ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _isWorkDay( date: Date ) {
		return this._workDays.includes( date.getDay( ) );
	}

	// the hours shown, in minutes from midnight: the whole day, or the working hours alone
	private _hoursShown( ): [ number, number ] {
		return this._offHours ? [ 0, DAY_MINUTES ] : this._workHours;
	}

	// the column of the day of a date, null when it is not shown
	private _columnOf( date: Date ): PlannerColumn {
		const day = dayOf( date ).getTime( );
		return this._columns.find( col => col.date.getTime( )==day ) ?? null;
	}

	/**
	 * the part of an event on a day, in minutes from midnight; null: none, or out of the hours
	 * shown. A whole day (without the band): the working hours, without ends to drag
	 */

	private _segmentOn( item: PlannerItem, day: Date ): PlannerSegment {
		const from = day.getTime( );
		const next = date_add_days( day, 1 ).getTime( );
		const start = item.start.getTime( );
		const end = item.end.getTime( );

		if( start >= next || end < from || ( end==from && start < from ) ) {
			return null;
		}

		if( item.allDay ) {
			const [ workStart, workEnd ] = this._workHours;
			return { item, from: workStart, to: workEnd, first: false, last: false };
		}

		const segment = { item, from: start >= from ? minutesOf( item.start ) : 0, to: this._minutesTo( day, item.end ), first: start >= from, last: end <= next };
		const [ shownStart, shownEnd ] = this._hoursShown( );
		return segment.from >= shownEnd || segment.to <= shownStart ? null : segment;
	}

	// a time of a day (minutes) in the canvas, kept in the hours shown
	private _yOf( t: number ) {
		const [ shownStart, shownEnd ] = this._hoursShown( );
		return ( clamp( t, shownStart, shownEnd ) - shownStart ) / 60 * this._hourPx;
	}

	// the time at y in the canvas, in the hours shown
	private _tOf( y: number ) {
		const [ shownStart, shownEnd ] = this._hoursShown( );
		return clamp( shownStart + y / this._hourPx * 60, shownStart, shownEnd );
	}

	private _snap( t: number ) {
		return Math.floor( t / this._step ) * this._step;
	}

	private _snapRound( t: number ) {
		return Math.round( t / this._step ) * this._step;
	}

	// a part of an event in the canvas, from a time of its day to another: on the line of its start,
	// the gap under it, 6px high at least, never past the bottom
	private _span( from: number, to: number ) {
		const top = this._yOf( from );
		const height = Math.max( this._yOf( to ) - top - EVENT_GAP, 6 );
		return { top: Math.min( top, this._yOf( DAY_MINUTES ) - height ), height };
	}

	// where an event that ends at a date stops on a day: 24:00 when it goes on after it
	private _minutesTo( day: Date, end: Date ) {
		return end.getTime( ) < date_add_days( day, 1 ).getTime( ) ? minutesOf( end ) : DAY_MINUTES;
	}

	// the column at x in the canvas or the band, kept in the columns
	private _colOf( x: number ) {
		const cols = this._columns;
		for( let i = 0; i < cols.length; i++ ) {
			if( x < cols[i].x + cols[i].w ) {
				return i;
			}
		}

		return cols.length - 1;
	}

	// the day of the month at a point of the window, -1: none
	private _dayAt( x: number, y: number ) {
		return this._monthDays.findIndex( day => day.cell.getBoundingRect( ).contains( { x, y } ) );
	}

	// the part of the planner of an element
	private _areaOf( el: Element ): PlannerDrag["area"] {
		if( this._canvas.dom.contains( el ) ) {
			return "canvas";
		}

		if( this._band.dom.contains( el ) ) {
			return "band";
		}

		if( this._cells.dom.contains( el ) ) {
			return "month";
		}

		return null;
	}

	// the day under the pointer, and its minutes in the canvas; null out of the days of the month
	private _pointAt( area: PlannerDrag["area"], ev: MouseEvent ): PlannerPoint {
		if( area=="month" ) {
			const i = this._dayAt( ev.clientX, ev.clientY );
			return i < 0 ? null : { day: this._monthDays[i].date, t: 0 };
		}

		const rc = ( area=="canvas" ? this._canvas : this._band ).getBoundingRect( );
		const col = this._columns[this._colOf( ev.clientX - rc.left )];
		return { day: col.date, t: area=="canvas" ? this._tOf( ev.clientY - rc.top ) : 0 };
	}

	// the event of an element
	private _itemOf( el: Element ): PlannerItem {
		const block = Component.closest( el, ".event" );
		if( block && this.contains( block ) ) {
			return block.getInternalData<PlannerItem>( "item" );
		}

		return null;
	}

	// :: SELECTION :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _select( item: PlannerItem, notify: boolean ) {
		const id = item ? item.event.id : undefined;
		if( id===this._selection ) {
			return;
		}

		this._selection = id;
		this._blocks.forEach( block => block.setClass( "selected", block.getInternalData<PlannerItem>( "item" ).event.id===id ) );

		if( notify ) {
			this.fire( "selectionChange", { selection: item ? [ id ] : [], empty: !item } );
		}
	}

	// the week of a day of the month
	private _openWeek( date: Date ) {
		this._view = "week";
		this._date = dayOf( date );
		this._range = null;
		this._render( );
		this.fire( "viewChange", { view: this._view, date: this.getDate( ) } );
	}

	private _onResize( ) {
		if( !this._drag ) {
			this._render( );
		}
	}

	private _onDblClick( ev: MouseEvent ) {
		const item = this._itemOf( ev.target as Element );
		if( item ) {
			this.fire( "dblClick", { context: item.event } );
			return;
		}

		if( this._view=="month" ) {
			const i = this._dayAt( ev.clientX, ev.clientY );
			if( i >= 0 ) {
				this._openWeek( this._monthDays[i].date );
			}
		}
	}

	private _onContextMenu( ev: MouseEvent ) {
		ev.preventDefault( );

		const item = this._itemOf( ev.target as Element );
		if( item ) {
			this._select( item, true );
			this.fire( "contextMenu", { uievent: ev, context: item.event } );
		}
	}

	private _onKey( ev: KeyboardEvent ) {
		const drag = this._drag;
		if( ev.key=="Escape" && drag ) {
			ev.preventDefault( );
			this._onPointerCancel( );

			if( drag.moved ) {
				this.releaseCapture( drag.pointer );
			}
		}
	}

	// :: DRAG ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * an event under the pointer: moved, or one of its ends; an empty place, the strip on the
	 * right of a day or shift: a range. Nothing is taken before the pointer went 4px away: a
	 * click stays a click
	 */

	private _onPointerDown( ev: PointerEvent ) {
		if( ev.button!=0 ) {
			return;
		}

		const target = ev.target as Element;
		const area = this._areaOf( target );
		if( !area || Component.closest( target, ".edge" ) ) {
			return;		// out of the days, or a mark of the events out of the view: its click
		}

		// the hours, on the left
		let x = 0;
		if( area!="month" ) {
			x = ev.clientX - ( area=="canvas" ? this._canvas : this._band ).getBoundingRect( ).left;
			if( x < GUTTER ) {
				return;
			}
		}

		const at = this._pointAt( area, ev );
		if( !at ) {
			return;
		}

		this._range = null;
		this._renderRange( );

		let item = ev.shiftKey ? null : this._itemOf( target );
		const block = item ? Component.closest( target, ".event" ) : null;

		if( item && area=="canvas" ) {
			const col = this._columns[this._colOf( x )];
			if( x > col.x + col.w - Math.min( FREE_STRIP, col.w * 0.2 ) ) {
				item = null;
			}
		}

		let kind: PlannerDrag["kind"] = item ? "move" : "select";
		const grip = item ? Component.closest( target, ".grip" ) : null;
		if( grip ) {
			kind = grip.hasClass( "start" ) ? "start" : "end";
		}

		const t0 = kind=="select" ? Math.min( this._snap( at.t ), this._hoursShown( )[1] - this._step ) : at.t;
		this._drag = { area, kind, pointer: ev.pointerId, x: ev.clientX, y: ev.clientY, moved: false, copy: false, item, block, blocks: [], ghost: null, day: at.day, t0, preview: null };
	}

	private _onPointerMove( ev: PointerEvent ) {
		const drag = this._drag;
		if( !drag ) {
			return;
		}

		if( !drag.moved ) {
			// the button let go out of the planner, before any capture: no drag
			if( !( ev.buttons & 1 ) ) {
				this._drag = null;
				return;
			}

			if( Math.abs( ev.clientX - drag.x ) < 4 && Math.abs( ev.clientY - drag.y ) < 4 ) {
				return;
			}

			// read only: no range, an event is only clicked
			if( this._readonly ) {
				return;
			}

			drag.moved = true;
			this.setCapture( ev.pointerId );
			this.addClass( drag.kind=="select" ? "selecting" : drag.kind=="move" ? "moving" : "sizing" );

			if( drag.item ) {
				this._select( drag.item, true );
				drag.blocks = this._blocks.filter( block => block.getInternalData<PlannerItem>( "item" )===drag.item );
			}
		}

		if( drag.area=="canvas" ) {
			this._autoScroll( ev );
		}

		const at = this._pointAt( drag.area, ev );
		if( !at ) {
			return;
		}

		if( drag.kind=="select" ) {
			this._range = this._rangeOf( drag, at );
			this._renderRange( );
		}
		else {
			drag.copy = drag.kind=="move" && isCopyKey( ev );
			drag.preview = this._place( drag, at );
			this._showDrag( drag, at, ev );
		}
	}

	/**
	 * the drag on screen, nothing else drawn again: a move shows a ghost where the event goes, its
	 * parts faded at their place unless it is copied; an end stretches the part under the pointer
	 */

	private _showDrag( drag: PlannerDrag, at: PlannerPoint, ev: PointerEvent ) {
		const preview = drag.preview;
		const cols = this._columns;

		if( drag.kind=="move" ) {
			drag.blocks.forEach( block => block.setClass( "faded", !drag.copy ) );
			this._removeGhost( drag );
			drag.ghost = this._makeGhost( drag, { ...drag.item, start: preview.start, end: preview.end }, at, ev );
			return;
		}

		const block = drag.block;
		if( drag.area=="canvas" ) {
			const segment = block.getInternalData<PlannerSegment>( "segment" );
			const span = this._span( drag.kind=="start" ? minutesOf( preview.start ) : segment.from, drag.kind=="end" ? this._minutesTo( drag.day, preview.end ) : segment.to );

			block.setStyle( span );
			block.setClass( "small", span.height < SMALL_EVENT );
			block.query( ".time" ).setContent( `${timeText( preview.start )} – ${timeText( preview.end )}` );
		}
		else {
			const shown = indicesOf( cols.map( col => col.date ), preview.start, preview.end );
			if( shown ) {
				const [ c0, c1 ] = shown;
				const x = cols[c0].x + 2;
				block.setStyle( { left: x, width: cols[c1].x + cols[c1].w - x - 3 } );
			}
		}
	}

	/**
	 * where the event moved goes, over the others: in the column of its new day, as wide as it is
	 * and at its place in its column (alone in its day: as wide as the new one, shifted); in the
	 * band on its new days, on its line; in the month under the pointer, the day it goes to framed
	 */

	private _makeGhost( drag: PlannerDrag, item: PlannerItem, at: PlannerPoint, ev: PointerEvent ): Component {
		const cols = this._columns;
		let ghost: Component;

		switch( drag.area ) {
			case "canvas": {
				// its first day shown, out of the hours shown: no ghost
				const col = this._columnOf( item.start );
				const segment = col ? this._segmentOn( item, col.date ) : null;
				if( !segment ) {
					return null;
				}

				// not taken for another one: the width of the part dragged, at its place in its column;
				// alone in its day, the width of the new one, shifted
				const span = this._span( segment.from, segment.to );
				const block = drag.block.dom as HTMLElement;
				const from = this._columnOf( drag.day );

				let left = col.x + ( from ? block.offsetLeft - from.x : 2 );
				let width = block.offsetWidth;
				if( drag.block.getInternalData<boolean>( "alone" ) ) {
					left = col.x + 2 + GHOST_SHIFT;
					width = Math.max( 20, col.w - 6 - Math.min( FREE_STRIP, col.w * 0.2 ) - GHOST_SHIFT );
				}

				ghost = this._makeEvent( segment );
				ghost.setStyle( { left, width, ...span } );
				ghost.setClass( "small", span.height < SMALL_EVENT );
				this._layer.appendContent( ghost );
				break;
			}

			case "band": {
				const shown = indicesOf( cols.map( col => col.date ), item.start, item.end );
				if( !shown ) {
					return null;
				}

				const [ c0, c1 ] = shown;
				const x = cols[c0].x + 2;

				ghost = this._makeBar( item );
				ghost.setStyle( { left: x, width: cols[c1].x + cols[c1].w - x - 3, top: ( drag.block.dom as HTMLElement ).offsetTop, height: BAND_LINE - 2 } );
				this._band.appendContent( ghost );
				break;
			}

			default: {
				const rc = this._cells.getBoundingRect( );

				ghost = this._makeLine( item, at.day );
				ghost.setStyle( { left: ev.clientX - rc.left - 20, top: ev.clientY - rc.top - MONTH_LINE / 2, width: ( drag.block.dom as HTMLElement ).offsetWidth } );
				this._cells.appendContent( ghost );
				this._monthDays.forEach( day => day.cell.setClass( "drop", day.date.getTime( )==at.day.getTime( ) ) );
				break;
			}
		}

		ghost.addClass( "dragging" );
		return ghost;
	}

	private _removeGhost( drag: PlannerDrag ) {
		if( drag.ghost ) {
			drag.ghost.dom.remove( );
			drag.ghost = null;
		}
	}

	/**
	 * a drag in the hours near the top or the bottom of the body: it scrolls while the pointer
	 * stays there, the drag following the time under the pointer
	 */

	private _autoScroll( ev: PointerEvent ) {
		const rc = this._body.getBoundingRect( );
		const dir = ev.clientY < rc.top + SCROLL_EDGE ? -1 : ev.clientY > rc.bottom - SCROLL_EDGE ? 1 : 0;

		this._scrollEv = ev;
		if( dir==this._scrollDir ) {
			return;
		}

		this._scrollDir = dir;
		if( dir ) {
			this.setInterval( "autoscroll", 20, ( ) => {
				this._body.dom.scrollTop += this._scrollDir * SCROLL_STEP;
				this._onPointerMove( this._scrollEv );
			} );
		}
		else {
			this.clearInterval( "autoscroll" );
		}
	}

	// the end of a drag: no scroll, no ghost, no day framed, the cursor of the planner back
	private _endDrag( drag: PlannerDrag ) {
		this._scrollDir = 0;
		this.clearInterval( "autoscroll" );
		this._removeGhost( drag );
		this._monthDays.forEach( day => day.cell.removeClass( "drop" ) );
		this.removeClass( "selecting moving sizing" );
	}

	/**
	 * a range: told by select; an event: the change is told before it is written, ev.preventDefault( )
	 * puts it back; a copy is told, the application adds it
	 */

	private _onPointerUp( ev: PointerEvent ) {
		const drag = this._drag;
		this._drag = null;

		if( !drag ) {
			return;
		}

		if( !drag.moved ) {
			this._onTap( ev, drag );
			return;
		}

		this.releaseCapture( ev.pointerId );
		this._endDrag( drag );

		if( drag.kind=="select" ) {
			const range = this._range;
			if( range ) {
				this.fire( "select", { start: range.start, end: endOf( range.start, range.end ) } );
			}
			return;
		}

		const preview = drag.preview;
		if( !preview ) {
			this._renderItems( );
			return;
		}

		const event = drag.item.event;
		const change: EvPlannerChange = { event, start: preview.start, end: endOf( preview.start, preview.end ) };

		if( drag.kind=="move" && ( drag.copy || isCopyKey( ev ) ) ) {
			this.fire( "copy", change );
			this._renderItems( );
			return;
		}

		this.fire( "change", change );

		if( !change.defaultPrevented ) {
			event.start = change.start;
			event.end = change.end;
		}

		this._render( );
	}

	// a click: an event selected, or none; on the "+n" of a day of the month, its week
	private _onTap( ev: PointerEvent, drag: PlannerDrag ) {
		if( drag.area=="month" && Component.closest( ev.target as Element, ".more" ) ) {
			this._openWeek( drag.day );
			return;
		}

		this._select( drag.item, true );

		if( drag.item ) {
			this.fire( "click", { context: drag.item.event } );
		}
	}

	// the browser took the pointer, the capture was lost, Escape: the event goes back, no range.
	// After a pointerup the drag is already over: the capture it releases changes nothing
	private _onPointerCancel( ) {
		const drag = this._drag;
		this._drag = null;

		if( drag && drag.moved ) {
			this._endDrag( drag );
			this._range = null;
			this._renderItems( );
		}
	}

	// the range from where the pointer went down: the steps of its day in the canvas, else the days
	private _rangeOf( drag: PlannerDrag, at: PlannerPoint ): PlannerRange {
		if( drag.area=="canvas" ) {
			const t1 = Math.min( this._snap( at.t ), this._hoursShown( )[1] - this._step );
			return { area: drag.area, start: atMinutes( drag.day, Math.min( drag.t0, t1 ) ), end: atMinutes( drag.day, Math.max( drag.t0, t1 ) + this._step ) };
		}

		const after = at.day.getTime( ) > drag.day.getTime( );
		return { area: drag.area, start: after ? drag.day : at.day, end: date_add_days( after ? at.day : drag.day, 1 ) };
	}

	/**
	 * where the event dragged goes: moved by the days and the steps the pointer went, or one of its
	 * ends. In the canvas, an event of one day stays in the hours shown of its day: only its column
	 * changes its day; a whole day changes of day only
	 */

	private _place( drag: PlannerDrag, at: PlannerPoint ): { start: Date, end: Date } {
		const item = drag.item;
		const step = this._step * 60000;
		const canvas = drag.area=="canvas";

		switch( drag.kind ) {
			case "move": {
				const days = daysBetween( drag.day, at.day );
				const minutes = canvas && !item.allDay ? this._snapRound( at.t - drag.t0 ) : 0;
				const length = item.end.getTime( ) - item.start.getTime( );

				if( canvas && !item.allDay && daysBetween( dayOf( item.start ), dayOf( new Date( item.end.getTime( ) - 1 ) ) )==0 ) {
					const [ shownStart, shownEnd ] = this._hoursShown( );
					const t = clamp( minutesOf( item.start ) + minutes, shownStart, Math.max( shownStart, shownEnd - length / 60000 ) );
					const start = atMinutes( date_add_days( dayOf( item.start ), days ), t );
					return { start, end: new Date( start.getTime( ) + length ) };
				}

				const start = date_add_days( item.start, days );
				const end = date_add_days( item.end, days );
				start.setMinutes( start.getMinutes( ) + minutes );
				end.setMinutes( end.getMinutes( ) + minutes );
				return { start, end };
			}

			case "start": {
				if( canvas ) {
					const start = atMinutes( drag.day, this._snapRound( at.t ) ).getTime( );
					return { start: new Date( Math.min( start, item.end.getTime( ) - step ) ), end: item.end };
				}

				const last = date_add_days( item.end, -1 );
				return { start: at.day.getTime( ) > last.getTime( ) ? last : at.day, end: item.end };
			}

			default: {
				if( canvas ) {
					const end = atMinutes( drag.day, this._snapRound( at.t ) ).getTime( );
					return { start: item.start, end: new Date( Math.max( end, item.start.getTime( ) + step ) ) };
				}

				return { start: item.start, end: date_add_days( at.day.getTime( ) < item.start.getTime( ) ? item.start : at.day, 1 ) };
			}
		}
	}
}
