/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file gantt.ts
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
import { SvgBuilder, SvgComponent } from '../../core/core_svg';
import { UnsafeHtml, clamp, date_calc_weeknum, date_format, date_week_start, formatDate, formatDateTime, formatPercent, formatUnit } from '../../core/core_tools';
import { Icon } from '../icon/icon';
import { CSizer } from '../sizers/sizer';
import icons from '../assets/icons';

import "./gantt.module.scss";

export type GanttID = string | number;
export type GanttScale = "hour" | "day" | "week" | "month";

export interface GanttTask {
	id: GanttID;
	title: string;
	start?: Date;					// required for a task; a group takes it from its tasks
	end?: Date;						// its last day, included, when it has no hours; else the hour it ends. none: the day of start
	progress?: number;				// 0 to 100: the part of the bar filled
	milestone?: boolean;			// a diamond in the middle of the task: of its day, for a date without hours
	children?: GanttTask[];			// a group: its bar goes from the first start of its tasks to their last end
	open?: boolean;					// a group: its tasks shown; true by default
	deps?: GanttID[];				// the tasks that end before this one starts: an arrow from each of them
	color?: string;					// a CSS colour for its bar; a group gives it to its tasks that have none. none: the theme
	tooltip?: string;				// on its line and its bar, as html (see initTooltips)
	cls?: string;					// on its line, its lane and its bar
	data?: any;
}

export interface GanttColumn {
	id: string;						// "title", "start", "end", "duration", "progress", or a field of the task
	title?: string;					// none: for the ids above, their title in the language (_tr.global.gantt)
	width?: number;					// 100 by default
	align?: "left" | "center" | "right";
	formatter?: ( task: GanttTask ) => string | UnsafeHtml;
}

export interface EvGanttChange extends ComponentEvent {
	readonly task: GanttTask;		// as it was: the new values are written in it after the event, unless ev.preventDefault( )
	readonly start: Date;
	readonly end: Date;
	readonly progress: number;
}

export interface EvGanttScale extends ComponentEvent {
	readonly scale: GanttScale;
}

export interface GanttEvents extends ComponentEvents {
	click: EvClick;					// context: the task
	dblClick: EvDblClick;			// context: the task
	contextMenu: EvContextMenu;		// context: the task
	selectionChange: EvSelectionChange;
	change: EvGanttChange;
	scaleChange: EvGanttScale;		// the zoom took another scale
}

export interface GanttProps extends Omit<ComponentProps,"content"> {
	tasks?: GanttTask[];
	columns?: GanttColumn[];		// the list on the left; the titles alone by default
	scale?: GanttScale;				// what a column of the chart is: "day" by default; the zoom changes it
	start?: Date;					// the first day shown; else the one of the first task
	end?: Date;						// the last day shown; else the one of the last task
	rowHeight?: number;				// 32 by default
	readonly?: boolean;				// the bars cannot be moved, stretched nor their progress changed; the tasks are still clicked
	click?: EventCallback<EvClick>;
	dblClick?: EventCallback<EvDblClick>;
	contextMenu?: EventCallback<EvContextMenu>;
	selectionChange?: EventCallback<EvSelectionChange>;
	change?: EventCallback<EvGanttChange>;
	scaleChange?: EventCallback<EvGanttScale>;
}

// a task shown: its line, its place in days (see toDays)
interface GanttRow {
	task: GanttTask;
	level: number;					// 0 at the top, 1 in a group...
	index: number;					// its line, from the top
	from: number;					// undefined: a task without start, no bar
	to: number;
	progress: number;
	color: string;					// its own, else the one of its group
	line: Component;				// in the list
	lane: Component;				// in the chart
	bar: Component;
	fill: Component;				// the progress, in the bar
}

interface GanttDrag {
	row: GanttRow;
	mode: "move" | "start" | "end" | "progress";
	x: number;						// where the pointer went down
	from: number;					// the row as it was
	to: number;
	progress: number;
	moved: boolean;					// the pointer went 3px away: a drag, not a click
}

// the days in view, [from, to[
interface GanttView {
	from: number;
	to: number;
}

// the last notch of the zoom: the day under the pointer, and where the pointer and the scroll were
interface GanttZoom {
	day: number;
	x: number;
	scroll: number;
}

// a cell of the header: [from, to[ in days
interface GanttCell {
	from: number;
	to: number;
	text: string;
	weekend?: boolean;
}

const DAY = 86400000;
const GAP = 8;						// the arrows: their length out of a bar, and into the next one
const DIAMOND = 8;					// half the width of a milestone

// the width of a day, by scale
const DAY_WIDTHS: Record<GanttScale, number> = { hour: 24 * 28, day: 32, week: 14, month: 4 };

// the zoom: a month of 45px at least, an hour of 60px at most
const MIN_DW = 1.5;
const MAX_DW = 24 * 60;

/**
 * a date as a number of days: the days from 1/1/1970 to its day in the local calendar, plus the part
 * of its day gone at its hour. A day of 23 or 25 hours (summer time) counts as one all the same
 */

function toDays( date: Date ): number {
	return Date.UTC( date.getFullYear( ), date.getMonth( ), date.getDate( ) ) / DAY + ( date.getHours( ) * 60 + date.getMinutes( ) ) / 1440;
}

/**
 * the date of a number of days (toDays), to the minute
 */

function fromDays( days: number ): Date {
	const day = Math.floor( days );
	const utc = new Date( day * DAY );
	return new Date( utc.getUTCFullYear( ), utc.getUTCMonth( ), utc.getUTCDate( ), 0, Math.round( ( days - day ) * 1440 ) );
}

function isWhole( days: number ) {
	return Math.abs( days - Math.round( days ) ) < 1e-6;
}

function hasTime( date: Date ) {
	return date.getHours( )!=0 || date.getMinutes( )!=0;
}

function isGroup( task: GanttTask ) {
	return !!task.children && task.children.length > 0;
}

/**
 * the end of a task from the day it stops: at midnight, the day before (its last day, included); else that hour
 */

function toEnd( to: number ): Date {
	return isWhole( to ) ? fromDays( Math.round( to ) - 1 ) : fromDays( to );
}

/**
 * a date of a task as text: its day, and its time when it has one
 */

export function dateText( date: Date ) {
	return hasTime( date ) ? formatDateTime( date ) : formatDate( date );
}

// "3 j", "5 h" in fr: in hours under a day
function durationText( days: number ) {
	return days < 1 ? formatUnit( days * 24, "hour", 1 ) : formatUnit( days, "day", 1 );
}

/**
 * the scale of a width of a day: the cells of the second line of the header stay readable
 * (an hour of 20px, a day of 18px, a week of 35px)
 */

function scaleOf( dw: number ): GanttScale {
	if( dw >= 24 * 20 ) {
		return "hour";
	}

	if( dw >= 18 ) {
		return "day";
	}

	return dw >= 5 ? "week" : "month";
}

/**
 * Not in `x4js`: import it from `"x4js/gantt"`.
 *
 * Tasks on a calendar: their list on the left (a tree, with columns), a bar for each one on the
 * days it lasts, an arrow from each task it waits for. The pointer moves a bar, stretches it by
 * its ends, sets its progress by the mark under it. Ctrl+wheel on the chart zooms it: the scale
 * follows the width of a day.
 *
 * Read only (readonly, setReadOnly): no bar is moved, stretched nor its progress changed. Disabled
 * (disabled, enable( false )): nothing, faded as a Box (--box-disabled-opacity).
 *
 * A date without hours is a whole day: `end` is the last day of the task, included.
 *
 * @cssvar
 * ```
 * --gantt-background
 * --gantt-border
 * --gantt-border-focus
 * --gantt-header-background
 * --gantt-header-color
 * --gantt-line-color
 * --gantt-major-line-color
 * --gantt-weekend-background
 * --gantt-today-color
 * --gantt-row-background-sel
 * --gantt-row-color-sel
 * --gantt-lane-background-sel
 * --gantt-icon-color
 * --gantt-bar-background
 * --gantt-bar-border
 * --gantt-bar-progress
 * --gantt-bar-label
 * --gantt-handle-color
 * --gantt-group-background
 * --gantt-milestone-background
 * --gantt-link-color
 * --gantt-link-color-sel
 * ```
 */

export class Gantt extends Component<GanttProps, GanttEvents> {
	static classPrefix = "x4";

	private _tasks: GanttTask[];
	private _columns: GanttColumn[];
	private _widths: number[];
	private _scale: GanttScale;
	private _rowHeight: number;
	private _readonly: boolean;

	private _rows: GanttRow[] = [];
	private _byId = new Map<GanttID, GanttRow>( );
	private _selection: GanttID;
	private _drag: GanttDrag;
	private _zoom: GanttZoom;

	private _origin: number;		// the first day shown (toDays)
	private _end: number;			// the day after the last one
	private _dw: number;			// the width of a day, in px

	private _body: Component;
	private _head: Component;
	private _top: Component;
	private _bottom: Component;
	private _list: Component;
	private _chart: Component;
	private _grid: SvgComponent;
	private _lanes: Component;
	private _links: SvgComponent;

	constructor( props: GanttProps ) {
		super( props );

		this._tasks = props.tasks ?? [];
		this._columns = props.columns ?? [ { id: "title", width: 240 } ];
		this._widths = this._columns.map( col => col.width ?? 100 );
		this._scale = props.scale ?? "day";
		this._dw = DAY_WIDTHS[this._scale];
		this._rowHeight = props.rowHeight ?? 32;

		this.setAttribute( "tabindex", 0 );
		this._readonly = !!props.readonly;
		this.setClass( "readonly", this._readonly );
		this.setStyleVariable( "--gantt-row-height", this._rowHeight + "px" );

		this.setContent( this._body = new Component( { cls: "body", content: [
			new Component( { cls: "corner", content: this._columns.map( ( col, i ) => this._makeTitle( col, i ) ) } ),
			this._head = new Component( { cls: "head", content: [
				this._top = new Component( { cls: "line top" } ),
				this._bottom = new Component( { cls: "line bottom" } ),
			] } ),
			this._list = new Component( { cls: "list" } ),
			this._chart = new Component( { cls: "chart", content: [
				this._grid = new SvgComponent( { cls: "grid", attrs: { preserveAspectRatio: "none" } } ),
				this._lanes = new Component( { cls: "lanes" } ),
				this._links = new SvgComponent( { cls: "links" } ),
			] } ),
		] } ) );

		this.mapPropEvents( props, "click", "dblClick", "contextMenu", "selectionChange", "change", "scaleChange" );

		this.addDOMEvent( "click", ( ev ) => this._onClick( ev ) );
		this.addDOMEvent( "dblclick", ( ev ) => this._onDblClick( ev ) );
		this.addDOMEvent( "contextmenu", ( ev ) => this._onContextMenu( ev ) );
		this.addDOMEvent( "keydown", ( ev ) => this._onKey( ev ) );
		this.addDOMEvent( "wheel", ( ev ) => this._onWheel( ev ) );
		this.addDOMEvent( "resized", ( ) => this._onResize( ) );

		this._chart.addDOMEvent( "pointerdown", ( ev ) => this._onPointerDown( ev ) );
		this._chart.addDOMEvent( "pointermove", ( ev ) => this._onPointerMove( ev ) );
		this._chart.addDOMEvent( "pointerup", ( ev ) => this._onPointerUp( ev ) );
		this._chart.addDOMEvent( "pointercancel", ( ) => this._onPointerCancel( ) );
		this._chart.addDOMEvent( "lostpointercapture", ( ) => this._onPointerCancel( ) );

		this._render( );
	}

	setTasks( tasks: GanttTask[] ) {
		this._tasks = tasks;
		this._render( null );
	}

	/**
	 * the width of a day of this scale; the date at the left of the chart stays there
	 */

	setScale( scale: GanttScale ) {
		const left = this._origin + this._body.dom.scrollLeft / this._dw;

		this._scale = scale;
		this._dw = DAY_WIDTHS[scale];
		this._render( this._viewAt( left, 0 ) );
	}

	/**
	 * the bars cannot be moved, stretched nor their progress changed; the tasks are still clicked
	 */

	setReadOnly( ro: boolean ) {
		this._readonly = ro;
		this.setClass( "readonly", ro );
		this._render( );		// their handles
	}

	getScale( ): GanttScale {
		return this._scale;
	}

	/**
	 * a task shown (not in a group closed); null: none
	 */

	selectTask( id: GanttID ) {
		const row = this._byId.get( id );
		this._select( row, false );

		if( row ) {
			this._ensureVisible( row );
		}
	}

	getSelection( ): GanttID {
		return this._selection;
	}

	/**
	 * the date in the middle of the chart
	 */

	scrollToDate( date: Date ) {
		const body = this._body.dom;
		body.scrollLeft = this._x( toDays( date ) ) - ( body.clientWidth - this._listWidth( ) ) / 2;
	}

	// :: RENDER ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * view: the days to show, the first one at the left of the chart in view, not before the
	 * first day of the chart; by default the days in view stay where they are. null: the days
	 * of the tasks alone
	 */

	private _render( view = this._view( ) ) {
		this._rows = [];
		this._flatten( this._tasks, 0 );
		this._byId = new Map( this._rows.map( row => [ row.task.id, row ] ) );

		const range = this._calcRange( view );
		this._origin = range.origin;
		this._end = range.end;

		const top = this._topCells( );
		const bottom = this._bottomCells( );

		this._top.setContent( top.map( cell => this._makeCell( cell ) ) );
		this._bottom.setContent( bottom.map( cell => this._makeCell( cell ) ) );
		this._list.setContent( this._rows.map( row => row.line = this._makeLine( row ) ) );

		this._renderGrid( top, bottom );
		this._lanes.setContent( this._rows.map( row => row.lane = this._makeLane( row ) ) );
		this._drawLinks( );
		this._layout( );

		if( view ) {
			this._body.dom.scrollLeft = this._x( view.from );
		}
	}

	/**
	 * the tasks shown, one under the other: the tasks of a group after it, when it is open
	 */

	private _flatten( tasks: GanttTask[], level: number, color?: string ) {
		tasks.forEach( task => {
			const row = { task, level, index: this._rows.length, color: task.color ?? color } as GanttRow;

			const m = this._measure( task );
			if( m ) {
				row.from = m.from;
				row.to = m.to;
				row.progress = m.progress;
			}

			this._rows.push( row );

			if( isGroup( task ) && task.open!==false ) {
				this._flatten( task.children, level + 1, row.color );
			}
		} );
	}

	/**
	 * the days of a task, [from, to[, and its progress; a group: those of its tasks, its progress
	 * weighted by their length. null: a task without start
	 */

	private _measure( task: GanttTask ): { from: number, to: number, progress: number } {
		if( isGroup( task ) ) {
			let from = Infinity;
			let to = -Infinity;
			let work = 0;
			let length = 0;

			task.children.forEach( child => {
				const m = this._measure( child );
				if( m ) {
					from = Math.min( from, m.from );
					to = Math.max( to, m.to );

					if( !child.milestone ) {
						work += m.progress * ( m.to - m.from );
						length += m.to - m.from;
					}
				}
			} );

			return isFinite( from ) ? { from, to, progress: length ? work / length : 0 } : null;
		}

		if( !task.start ) {
			return null;
		}

		const end = task.end ?? task.start;
		const from = toDays( task.start );
		const to = hasTime( end ) ? toDays( end ) : toDays( end ) + 1;
		return { from, to: Math.max( from, to ), progress: task.progress ?? 0 };
	}

	/**
	 * the days shown: from the column of the first task to the end of the unit of the first line
	 * of the header after the last one (or after the last day in view), and more units until the
	 * chart fills the width of the view
	 */

	private _calcRange( view: GanttView ) {
		let min = Infinity;
		let max = -Infinity;

		this._rows.forEach( row => {
			if( row.from!==undefined ) {
				min = Math.min( min, row.from );
				max = Math.max( max, row.to );
			}
		} );

		// the chart goes to the end of what is in view (the zoom keeps the day under the pointer),
		// not before the first task
		if( view ) {
			max = Math.max( max, view.to );
		}

		if( this.props.start ) {
			min = toDays( this.props.start );
		}

		if( this.props.end ) {
			max = toDays( this.props.end ) + 1;
		}

		if( !isFinite( min ) ) {
			min = Math.floor( toDays( new Date( ) ) );
		}

		if( !isFinite( max ) ) {
			max = min + 1;
		}

		const origin = this._floor( min );
		let end = this._next( max );

		const width = this._body.dom.clientWidth - this._listWidth( );
		while( ( end - origin ) * this._dw < width ) {
			end = this._next( end );
		}

		return { origin, end };
	}

	// the first day shown for a day: its midnight (by hours), its month (by months), else its monday
	private _floor( days: number ): number {
		const date = fromDays( days );

		switch( this._scale ) {
			case "hour":	return Math.floor( days );
			case "month":	return toDays( new Date( date.getFullYear( ), date.getMonth( ), 1 ) );
			default:		return Math.floor( toDays( date_week_start( date ) ) );
		}
	}

	// the start of the unit of the first line of the header after a day: the next day, month, year
	private _next( days: number ): number {
		const date = fromDays( days );

		switch( this._scale ) {
			case "hour":	return Math.floor( days ) + 1;
			case "month":	return toDays( new Date( date.getFullYear( ) + 1, 0, 1 ) );
			default:		return toDays( new Date( date.getFullYear( ), date.getMonth( ) + 1, 1 ) );
		}
	}

	// the first line of the header: the days (by hours), the months, the years (by months)
	private _topCells( ): GanttCell[] {
		const cells: GanttCell[] = [];

		for( let day = this._origin; day < this._end; ) {
			const next = this._next( day );
			const date = fromDays( day );

			let text: string;
			switch( this._scale ) {
				case "hour":	text = date_format( date, { weekday: "short", day: "numeric", month: "short" } ); break;
				case "month":	text = "" + date.getFullYear( ); break;
				default:		text = date_format( date, { month: "long", year: "numeric" } ); break;
			}

			cells.push( { from: day, to: next, text } );
			day = next;
		}

		return cells;
	}

	// the second line: the hours, the days, the weeks (from monday) or the months
	private _bottomCells( ): GanttCell[] {
		const cells: GanttCell[] = [];

		for( let day = this._origin; day < this._end; ) {
			const date = fromDays( day );
			const weekend = date.getDay( )==0 || date.getDay( )==6;

			switch( this._scale ) {
				case "hour": {
					for( let h = 0; h < 24; h++ ) {
						cells.push( { from: day + h / 24, to: day + ( h + 1 ) / 24, text: ( "" + h ).padStart( 2, "0" ), weekend } );
					}

					day++;
					break;
				}

				case "day": {
					cells.push( { from: day, to: day + 1, text: "" + date.getDate( ), weekend } );
					day++;
					break;
				}

				case "week": {
					const next = Math.min( Math.floor( toDays( date_week_start( date ) ) ) + 7, this._end );
					cells.push( { from: day, to: next, text: "" + date_calc_weeknum( date ) } );
					day = next;
					break;
				}

				case "month": {
					const next = toDays( new Date( date.getFullYear( ), date.getMonth( ) + 1, 1 ) );
					cells.push( { from: day, to: next, text: date_format( date, { month: "short" } ) } );
					day = next;
					break;
				}
			}
		}

		return cells;
	}

	private _makeCell( cell: GanttCell ) {
		const el = new Component( { cls: "cell", style: this._place( cell.from, cell.to ), content: new Component( { tag: "span", content: cell.text } ) } );
		el.setClass( "weekend", !!cell.weekend );
		return el;
	}

	// the title of a column of the list, with its sizer
	private _makeTitle( col: GanttColumn, index: number ) {
		const sizer = new CSizer( "right" );
		const cell = new Component( { cls: "cell " + ( col.align ?? "left" ), style: { width: `var(--gantt-col${index}-width)` }, content: [
			new Component( { tag: "span", content: col.title ?? _tr.global.gantt[col.id as keyof typeof _tr.global.gantt] } ),
			sizer,
		] } );

		// the sizer gives the cell a width: it follows its column again
		sizer.on( "resize", ( ev ) => {
			this._widths[index] = Math.max( 24, Math.round( ev.width ) );
			cell.setStyleValue( "width", `var(--gantt-col${index}-width)` );
			this._layout( );
		} );

		sizer.on( "stop", ( ) => this._onResize( ) );
		return cell;
	}

	// the line of a task in the list: a cell by column
	private _makeLine( row: GanttRow ) {
		const line = new Component( { cls: "row", tooltip: row.task.tooltip, content: this._columns.map( ( col, i ) => this._makeField( col, i, row ) ) } );

		this._classify( line, row );
		line.setClass( "selected", row.task.id===this._selection );
		line.setInternalData( "row", row );
		return line;
	}

	private _makeField( col: GanttColumn, index: number, row: GanttRow ) {
		const cell = new Component( { cls: "cell " + ( col.align ?? "left" ), style: { width: `var(--gantt-col${index}-width)` } } );

		if( col.id=="title" ) {
			// the tree: the level by the margin, the arrow of a group
			cell.addClass( "title" );
			cell.setStyle( { paddingLeft: row.level * 16 + 2 } );
			cell.setContent( [
				new Icon( { cls: "arrow", iconId: isGroup( row.task ) ? icons.chevron : undefined } ),
				new Component( { tag: "span", cls: "text", content: this._fieldText( col, row ) } ),
			] );
		}
		else {
			cell.setContent( this._fieldText( col, row ) );
		}

		return cell;
	}

	private _fieldText( col: GanttColumn, row: GanttRow ): string | UnsafeHtml {
		if( col.formatter ) {
			return col.formatter( row.task );
		}

		const task = row.task;
		const timed = row.from!==undefined;		// a task without start has no dates

		switch( col.id ) {
			case "title":		return task.title;
			case "start":		return timed ? dateText( fromDays( row.from ) ) : "";
			case "end":			return timed ? dateText( toEnd( row.to ) ) : "";
			case "duration":	return timed && !task.milestone ? durationText( row.to - row.from ) : "";
			case "progress":	return timed && !task.milestone ? formatPercent( row.progress ) : "";
		}

		const value = ( task as any )[col.id];
		return value===undefined || value===null ? "" : "" + value;
	}

	// the classes of a task, on its line, its lane and its bar
	private _classify( el: Component, row: GanttRow ) {
		const task = row.task;

		el.setClass( "group", isGroup( task ) );
		el.setClass( "open", isGroup( task ) && task.open!==false );
		el.setClass( "milestone", !!task.milestone );

		if( task.cls ) {
			el.addClass( task.cls );
		}
	}

	/**
	 * behind the tasks, a path for each: the week-ends, the lines of the rows, a line by column,
	 * a line by unit of the first line, now over them. Drawn in a height of 1, that the svg
	 * stretches to the one of the chart
	 */

	private _renderGrid( top: GanttCell[], bottom: GanttCell[] ) {
		const svg = new SvgBuilder( );
		const weekends = svg.path( ).addClass( "weekend" );
		svg.path( ).addClass( "row" );			// placed by _placeRows
		const cols = svg.path( ).addClass( "col" );
		const majors = svg.path( ).addClass( "major" );

		bottom.forEach( cell => {
			const x = this._x( cell.from );
			cols.moveTo( x, 0 ).lineTo( x, 1 );

			if( cell.weekend ) {
				const x2 = this._x( cell.to );
				weekends.moveTo( x, 0 ).lineTo( x2, 0 ).lineTo( x2, 1 ).lineTo( x, 1 ).closePath( );
			}
		} );

		top.forEach( cell => {
			const x = this._x( cell.from );
			majors.moveTo( x, 0 ).lineTo( x, 1 );
		} );

		const now = toDays( new Date( ) );
		if( now >= this._origin && now < this._end ) {
			const x = this._x( now );
			svg.path( ).addClass( "today" ).moveTo( x, 0 ).lineTo( x, 1 );
		}

		this._grid.setAttribute( "viewBox", `0 0 ${this._x( this._end )} 1` );
		this._grid.setSvg( svg );
		this._placeRows( );
	}

	/**
	 * the lines under the rows, in the height of 1 of the grid: on the last pixel of each row, from
	 * the height of the chart, which can be more than the rows (again when it changes)
	 */

	private _placeRows( ) {
		const height = this._chart.dom.clientHeight;
		const path = this._grid.dom.querySelector( ".row" );
		if( !height || !path ) {
			return;		// not shown yet: the resize will come
		}

		const width = this._x( this._end );
		const d = this._rows.map( ( row, i ) => `M0 ${( ( i + 1 ) * this._rowHeight - 0.5 ) / height} H${width}` );
		path.setAttribute( "d", d.join( " " ) );
	}

	// the lane of a task in the chart, with its bar
	private _makeLane( row: GanttRow ) {
		const lane = new Component( { cls: "lane" } );

		this._classify( lane, row );
		lane.setClass( "selected", row.task.id===this._selection );
		lane.setInternalData( "row", row );

		if( row.from===undefined ) {
			return lane;
		}

		const task = row.task;
		const content = [
			row.fill = new Component( { cls: "fill" } ),
			new Component( { cls: "label", content: task.title } ),
		];

		// a group follows its tasks, a milestone is only moved
		if( !this._readonly && !isGroup( task ) && !task.milestone ) {
			row.fill.setContent( new Component( { cls: "handle", attrs: { "data-mode": "progress" } } ) );
			content.push(
				new Component( { cls: "handle", attrs: { "data-mode": "start" } } ),
				new Component( { cls: "handle", attrs: { "data-mode": "end" } } ),
			);
		}

		row.bar = new Component( { cls: "bar", tooltip: task.tooltip, content } );
		this._classify( row.bar, row );
		row.bar.setInternalData( "row", row );

		// the stylesheet puts it on the bar
		if( row.color ) {
			row.bar.addClass( "colored" );
			row.bar.setStyleVariable( "--gantt-task-color", row.color );
		}
		this._placeBar( row );

		lane.setContent( row.bar );
		return lane;
	}

	// the bar on its days; a milestone in their middle
	private _placeBar( row: GanttRow ) {
		const left = this._x( row.from );
		const width = ( row.to - row.from ) * this._dw;

		if( row.task.milestone ) {
			row.bar.setStyle( { left: left + width / 2 } );
		}
		else {
			row.bar.setStyle( { left, width: Math.max( width, 2 ) } );
			row.fill.setStyleValue( "width", clamp( row.progress, 0, 100 ) + "%" );
		}
	}

	/**
	 * an arrow from the end of each task a task waits for to its start; around, back between the
	 * lines, when it starts before
	 */

	private _drawLinks( ) {
		const svg = new SvgBuilder( );
		const rh = this._rowHeight;

		this._rows.forEach( dst => {
			if( !dst.task.deps || dst.from===undefined ) {
				return;
			}

			dst.task.deps.forEach( id => {
				const src = this._byId.get( id );
				if( !src || src.from===undefined ) {
					return;		// in a group closed, or without dates
				}

				const x1 = this._linkX( src, true );
				const y1 = ( src.index + 0.5 ) * rh;
				const x2 = this._linkX( dst, false );
				const y2 = ( dst.index + 0.5 ) * rh;

				const path = svg.path( ).moveTo( x1, y1 ).lineTo( x1 + GAP, y1 );

				if( x2 - x1 >= 2 * GAP ) {
					path.lineTo( x1 + GAP, y2 );
				}
				else {
					const y = dst.index > src.index ? ( src.index + 1 ) * rh : src.index * rh;
					path.lineTo( x1 + GAP, y ).lineTo( x2 - GAP, y ).lineTo( x2 - GAP, y2 );
				}

				// the head
				path.lineTo( x2, y2 ).moveTo( x2 - 5, y2 - 4 ).lineTo( x2, y2 ).lineTo( x2 - 5, y2 + 4 );
				path.addClass( "link" );

				if( src.task.id===this._selection || dst.task.id===this._selection ) {
					path.addClass( "selected" );
				}
			} );
		} );

		this._links.setSvg( svg );
	}

	// where an arrow leaves a task (its end) or comes to it (its start)
	private _linkX( row: GanttRow, out: boolean ) {
		if( row.task.milestone ) {
			return this._x( ( row.from + row.to ) / 2 ) + ( out ? DIAMOND : -DIAMOND );
		}

		return this._x( out ? row.to : row.from );
	}

	// the widths: the columns of the list, the list, the chart
	private _layout( ) {
		this._widths.forEach( ( width, i ) => {
			this.setStyleVariable( `--gantt-col${i}-width`, width + "px" );
		} );

		const list = this._listWidth( );
		this.setStyleVariable( "--gantt-list-width", list + "px" );
		this._body.setStyleValue( "gridTemplateColumns", `${list}px ${this._x( this._end )}px` );
	}

	private _listWidth( ) {
		return this._widths.reduce( ( sum, width ) => sum + width, 0 );
	}

	// a day in the chart, in px
	private _x( days: number ) {
		return ( days - this._origin ) * this._dw;
	}

	private _place( from: number, to: number ) {
		return { left: this._x( from ), width: ( to - from ) * this._dw };
	}

	// the days in view when a day is at x px from the left of the chart in view
	private _viewAt( day: number, x: number ): GanttView {
		const from = day - x / this._dw;
		return { from, to: from + ( this._body.dom.clientWidth - this._listWidth( ) ) / this._dw };
	}

	// the days in view; none before the first render
	private _view( ): GanttView {
		if( this._origin===undefined ) {
			return null;
		}

		return this._viewAt( this._origin + this._body.dom.scrollLeft / this._dw, 0 );
	}

	/**
	 * a view wider: more days, to fill it
	 */

	private _onResize( ) {
		if( !this._drag && this._calcRange( this._view( ) ).end!=this._end ) {
			this._render( );
		}
		else {
			this._placeRows( );		// the height of the chart: the lines of the rows in the grid
		}
	}

	/**
	 * ctrl+wheel on the chart or its header: the width of a day, the day under the pointer stays
	 * under it; when the first day of the chart would come after the left of the view, it stays
	 * at the left. On the list, the browser zooms the page
	 */

	private _onWheel( ev: WheelEvent ) {
		if( !ev.ctrlKey || this._drag ) {
			return;
		}

		const body = this._body.dom;
		const x = ev.clientX - body.getBoundingClientRect( ).left - this._listWidth( );	// from the left of the chart in view
		if( x < 0 ) {
			return;
		}

		ev.preventDefault( );

		// a deltaY of 100: 25% more or less
		const dw = clamp( this._dw * Math.exp( -ev.deltaY / 450 ), MIN_DW, MAX_DW );
		if( dw==this._dw ) {
			return;
		}

		// the day of the last notch while neither the pointer nor the scroll moved: not the one of
		// the scroll, rounded to the pixel at each notch
		let day = this._origin + ( body.scrollLeft + x ) / this._dw;
		const last = this._zoom;
		if( last && last.x==x && last.scroll==body.scrollLeft ) {
			day = last.day;
		}

		const scale = scaleOf( dw );
		const changed = scale!=this._scale;

		this._scale = scale;
		this._dw = dw;
		this._render( this._viewAt( day, x ) );
		this._zoom = { day, x, scroll: body.scrollLeft };

		if( changed ) {
			this.fire( "scaleChange", { scale } );
		}
	}

	// :: SELECTION :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _select( row: GanttRow, notify: boolean ) {
		const id = row ? row.task.id : undefined;
		if( id===this._selection ) {
			return;
		}

		const old = this._byId.get( this._selection );
		if( old ) {
			old.line.removeClass( "selected" );
			old.lane.removeClass( "selected" );
		}

		this._selection = id;

		if( row ) {
			row.line.addClass( "selected" );
			row.lane.addClass( "selected" );
		}

		this._drawLinks( );

		if( notify ) {
			this.fire( "selectionChange", { selection: row ? [ id ] : [], empty: !row } );
		}
	}

	// the scroll that shows a line under the header
	private _ensureVisible( row: GanttRow ) {
		const body = this._body.dom;
		const head = this._head.getBoundingRect( ).height;
		const top = row.index * this._rowHeight;

		if( top < body.scrollTop ) {
			body.scrollTop = top;
		}
		else if( head + top + this._rowHeight > body.scrollTop + body.clientHeight ) {
			body.scrollTop = head + top + this._rowHeight - body.clientHeight;
		}
	}

	private _toggle( row: GanttRow ) {
		row.task.open = row.task.open===false;
		this._render( );
	}

	// the task of a line of the list or of a lane of the chart
	private _rowOf( ev: Event ): GanttRow {
		const el = Component.closest( ev.target as Element, ".row, .lane" );
		if( el && this.contains( el ) ) {
			return el.getInternalData<GanttRow>( "row" );
		}

		return null;
	}

	private _onClick( ev: MouseEvent ) {
		const row = this._rowOf( ev );
		if( !row ) {
			return;
		}

		if( isGroup( row.task ) && Component.closest( ev.target as Element, ".arrow" ) ) {
			this._toggle( row );
			return;
		}

		this._select( row, true );
		this.fire( "click", { context: row.task } );
	}

	private _onDblClick( ev: MouseEvent ) {
		const row = this._rowOf( ev );
		if( row && !Component.closest( ev.target as Element, ".arrow" ) ) {
			this.fire( "dblClick", { context: row.task } );
		}
	}

	private _onContextMenu( ev: MouseEvent ) {
		ev.preventDefault( );

		const row = this._rowOf( ev );
		if( row ) {
			this._select( row, true );
			this.fire( "contextMenu", { uievent: ev, context: row.task } );
		}
	}

	/**
	 * up, down, home, end: the task selected; right opens a group, left closes it, or goes back to
	 * the group of the task
	 */

	private _onKey( ev: KeyboardEvent ) {
		const rows = this._rows;
		const cur = this._byId.get( this._selection );
		let next: GanttRow;

		switch( ev.key ) {
			case "ArrowDown":	next = rows[cur ? cur.index + 1 : 0]; break;
			case "ArrowUp":		next = rows[cur ? cur.index - 1 : 0]; break;
			case "Home":		next = rows[0]; break;
			case "End":			next = rows[rows.length - 1]; break;

			case "ArrowRight": {
				if( cur && isGroup( cur.task ) && cur.task.open===false ) {
					this._toggle( cur );
				}
				break;
			}

			case "ArrowLeft": {
				if( cur && isGroup( cur.task ) && cur.task.open!==false ) {
					this._toggle( cur );
				}
				else if( cur ) {
					next = rows.slice( 0, cur.index ).reverse( ).find( row => row.level < cur.level );
				}
				break;
			}

			default: return;
		}

		ev.preventDefault( );

		if( next ) {
			this._select( next, true );
			this._ensureVisible( next );
		}
	}

	// :: DRAG ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * a bar under the pointer: moved, stretched by an end, its progress by the mark under it.
	 * Nothing is taken before the pointer went 3px away: a click stays a click
	 */

	private _onPointerDown( ev: PointerEvent ) {
		if( ev.button!=0 || this._readonly ) {
			return;
		}

		const bar = Component.closest( ev.target as Element, ".bar" );
		if( !bar || !this.contains( bar ) || bar.hasClass( "group" ) ) {
			return;
		}

		let mode: GanttDrag["mode"] = "move";
		const handle = Component.closest( ev.target as Element, ".handle" );
		if( handle ) {
			mode = handle.getData( "mode" ) as GanttDrag["mode"];
		}

		const row = bar.getInternalData<GanttRow>( "row" );
		this._drag = { row, mode, x: ev.clientX, from: row.from, to: row.to, progress: row.progress, moved: false };
	}

	private _onPointerMove( ev: PointerEvent ) {
		const drag = this._drag;
		if( !drag ) {
			return;
		}

		const dx = ev.clientX - drag.x;

		if( !drag.moved ) {
			// the button let go out of the chart, before any capture: no drag
			if( !( ev.buttons & 1 ) ) {
				this._drag = null;
				return;
			}

			if( Math.abs( dx ) < 3 ) {
				return;
			}

			drag.moved = true;
			this._chart.setCapture( ev.pointerId );
			this.addClass( drag.mode=="move" ? "moving" : "sizing" );
			this._select( drag.row, true );
		}

		// by the hour, else by the day
		const steps = this._scale=="hour" ? 24 : 1;
		const snap = ( days: number ) => Math.round( days * steps ) / steps;
		const days = dx / this._dw;
		const row = drag.row;

		switch( drag.mode ) {
			case "move": {
				const delta = snap( days );
				row.from = drag.from + delta;
				row.to = drag.to + delta;
				break;
			}

			case "start": {
				row.from = Math.min( snap( drag.from + days ), drag.to - 1 / steps );
				break;
			}

			case "end": {
				row.to = Math.max( snap( drag.to + days ), drag.from + 1 / steps );
				break;
			}

			case "progress": {
				const width = ( drag.to - drag.from ) * this._dw;
				row.progress = Math.round( clamp( drag.progress + dx / width * 100, 0, 100 ) );
				break;
			}
		}

		this._placeBar( row );
		this._drawLinks( );
	}

	/**
	 * the change is told before it is written: ev.preventDefault( ) puts the bar back
	 */

	private _onPointerUp( ev: PointerEvent ) {
		const drag = this._drag;
		this._drag = null;

		if( !drag || !drag.moved ) {
			return;
		}

		this._chart.releaseCapture( ev.pointerId );
		this.removeClass( "moving sizing" );

		const row = drag.row;
		const task = row.task;
		const change: EvGanttChange = { task, start: fromDays( row.from ), end: toEnd( row.to ), progress: row.progress };
		this.fire( "change", change );

		if( change.defaultPrevented ) {
			this._restore( drag );
			return;
		}

		if( drag.mode=="progress" ) {
			task.progress = change.progress;
		}
		else {
			task.start = change.start;
			task.end = change.end;
		}

		this._render( );
	}

	// the browser took the pointer (a touch, a gesture) or the capture was lost: the bar goes back.
	// After a pointerup the drag is already over: the capture it releases changes nothing
	private _onPointerCancel( ) {
		const drag = this._drag;
		this._drag = null;

		if( drag && drag.moved ) {
			this.removeClass( "moving sizing" );
			this._restore( drag );
		}
	}

	private _restore( drag: GanttDrag ) {
		const row = drag.row;
		row.from = drag.from;
		row.to = drag.to;
		row.progress = drag.progress;

		this._placeBar( row );
		this._drawLinks( );
	}
}
