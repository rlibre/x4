/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_tools.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { _tr } from "./core_i18n.js";

/**
 * @returns true if object is a string
 */
export function isString(val: any): val is string {
	return typeof val === 'string';
}

/**
 * @returns true if object is a number
 */

export function isNumber( v: any ): v is number {
	return typeof v === 'number' && isFinite(v);
}

/**
 * @returns true if object is an array
 */
export function isArray(val: any): val is any[] {
	return val instanceof Array;
}

/**
 * @returns true if object is a function
 */

export function isFunction(val: any): val is Function {
	return val instanceof Function;
}

/**
 * generic constructor
 */

export type Constructor<P> = {
	new(...params: any[]): P;
};


/**
 * a way to explain that the given string may be unsafe but must be treated a sstring
 * @example
 * label.setText( unsafehtml`<b>Bold</b> text` );
 * label.setText( new UnsafeHtml("<b>Bold</b> text`" ) );
 */

export class UnsafeHtml extends String {
	constructor( value: string ) {
		super( value );
	}
}

export function unsafeHtml( x: string ): UnsafeHtml {
	return new UnsafeHtml( x );
}

/**
 * 
 */

export function clamp<T>( v: T, min: T, max: T ) : T {
	if( v<min ) { return min; }
	if( v>max ) { return max; }
	return v;
}


/**
 * generic Rectangle 
 */

export interface IRect {
	left: number;
    top: number;
    height: number;
    width: number;
}

/**
 * 
 */

export class Rect implements IRect {
	left: number;
	top: number;
	height: number;
	width: number;

	constructor( );
	constructor( l: number, t: number, w: number, h: number );
	constructor( l: Rect );
	constructor( l?: number | IRect, t?: number, w?: number, h?: number ) {
		if( l!==undefined ) {
			if( isNumber( l ) ) {
				this.left = l;
				this.top = t;
				this.width = w;
				this.height = h;
			}
			else {
				Object.assign( this, l );
			}
		}
	}
	
	get right( ) {
		return this.left+this.width; 
	}

	get bottom( ) {
		return this.top+this.height;
	}
}


/**
 * generic Point
 */

export interface Point {
	x: number;
	y: number;
}

/**
 * 
 */

export interface IComponentInterface {
}

// form-element
export interface IFormElement extends IComponentInterface {
	getRawValue( ): any;
	setRawValue( v: any ): void;
}

/**
 * 
 */

interface Features {
	eyedropper: 1,
}

export function isFeatureAvailable( name: keyof Features ): boolean {
	switch( name ) {
		case "eyedropper": return "EyeDropper" in window;
	}

	return false;
}

export class Timer {
	
	protected _timers: Map<string,any>;
	
	/**
	 * 
	 */

	setTimeout( name: string, time: number, callback: Function ) {
		if( !this._timers ) {
			this._timers = new Map( );
		}
		else {
			this.clearTimeout( name );
		}

		const tm = setTimeout( callback, time );
		this._timers.set( name, tm );

		return tm;
	}

	clearTimeout( name: string ) {
		if( this._timers && this._timers.has(name) ) {
			clearTimeout( this._timers.get(name) );
			this._timers.delete( name );
		}
	}

	/**
	 * 
	 */

	setInterval( name: string, time: number, callback: Function ) {
		if( !this._timers ) {
			this._timers = new Map( );
		}
		else {
			this.clearInterval( name );
		}

		const tm = setInterval( callback, time );
		this._timers.set( name, tm );

		return tm;
	}

	clearInterval( name: string ) {
		if( this._timers && this._timers.has(name) ) {
			clearInterval( this._timers.get(name) );
			this._timers.delete( name );
		}
	}

	clearAllTimeouts( ) {
		this._timers?.forEach( t => {
			clearTimeout( t );
		} );

		this._timers = null;
	}
}

/**
 * 
 */

export function asap( callback: ( ) => void ) {
	return requestAnimationFrame( callback );
}


// :: STRING UTILS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


/**
 * prepend 0 to a value to a given length
 * @param value 
 * @param length 
 */

export function pad(what: any, size: number, ch: string = '0') {

	let value: string;

	if (!isString(what)) {
		value = '' + what;
	}
	else {
		value = what;
	}

	if (size > 0) {
		return value.padEnd(size, ch);
	}
	else {
		return value.padStart(-size, ch);
	}
}

/**
 * replace {0..9} by given arguments
 * @param format string
 * @param args 
 * 
 * @example ```ts
 * 
 * console.log( sprintf( 'here is arg 1 {1} and arg 0 {0}', 'argument 0', 'argument 1' ) )
 */

export function sprintf( format: string, ...args:any[] ) {
	return format.replace(/{(\d+)}/g, function (match, index) {
		return typeof args[index] != 'undefined' ? args[index] : match;
	});
}

// :: DATES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

let cur_locale: string = 'fr-FR';

/**
 * change the current locale for misc translations (date...)
 * @param locale 
 */

export function _date_set_locale(locale: string) {
	cur_locale = locale;
}

/**
 * 
 * @param date 
 * @param options 
 * @example
 * let date = new Date( );
 * let options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
 * let text = date_format( date, options );
 */

export function date_format(date: Date, options?: any): string {
	//return new Intl.DateTimeFormat(cur_locale, options).format( date );
	return formatIntlDate(date);
}

/**
 * 
 * @param date 
 * @param options 
 */

export function date_diff(date1: Date, date2: Date, options?: any): string {

	var dt = (date1.getTime() - date2.getTime()) / 1000;

	// seconds
	let sec = dt;
	if (sec < 60) {
		return sprintf(_tr.global.diff_date_seconds, Math.round(sec));
	}

	// minutes
	let min = Math.floor(sec / 60);
	if (min < 60) {
		return sprintf(_tr.global.diff_date_minutes, Math.round(min));
	}

	// hours
	let hrs = Math.floor(min / 60);
	return sprintf(_tr.global.diff_date_hours, hrs, min % 60);
}

export function date_to_sql(date: Date, withHours: boolean) {

	if (withHours) {
		return formatIntlDate(date, 'Y-M-D H:I:S');
	}
	else {
		return formatIntlDate(date, 'Y-M-D');
	}
}

/**
 * construct a date from an utc date time (sql format)
 * YYYY-MM-DD HH:MM:SS
 */

export function date_sql_utc(date: string): Date {
	let result = new Date(date + ' GMT');
	return result;
}



/**
 * return a number that is a representation of the date
 * this number can be compared with another hash
 */

export function date_hash(date: Date): number {
	return date.getFullYear() << 16 | date.getMonth() << 8 | date.getDate();
}

/**
 * return a copy of a date
 */

export function date_clone(date: Date): Date {
	return new Date(date.getTime());
}

/**
 * return the week number of a date
 */

export function date_calc_weeknum(date: Date): number {
	const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.valueOf() - firstDayOfYear.valueOf()) / 86400000;
	return Math.floor((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}



/**
 * parse a date according to the given format 
 * @param value - string date to parse
 * @param fmts - format list - i18 tranlation by default
 * allowed format specifiers:
 * d or D: date (1 or 2 digits)
 * m or M: month (1 or 2 digits)
 * y or Y: year (2 or 4 digits)
 * h or H: hours (1 or 2 digits)
 * i or I: minutes (1 or 2 digits)
 * s or S: seconds (1 or 2 digits)
 * <space>: 1 or more spaces
 * any other char: <0 or more spaces><the char><0 or more spaces>
 * each specifiers is separated from other by a pipe (|)
 * more specific at first
 * @example
 * 'd/m/y|d m Y|dmy|y-m-d h:i:s|y-m-d'
 */

export function parseIntlDate(value: string, fmts: string = _tr.global.date_input_formats): Date {

	let formats = fmts.split('|');
	for (let fmatch of formats) {

		//review: could do that only once & keep result
		//review: add hours, minutes, seconds

		let smatch = '';
		for (let c of fmatch) {

			if (c == 'd' || c == 'D') {
				smatch += '(?<day>\\d{1,2})';
			}
			else if (c == 'm' || c == 'M') {
				smatch += '(?<month>\\d{1,2})';
			}
			else if (c == 'y' || c == 'Y') {
				smatch += '(?<year>\\d{1,4})';
			}
			else if (c == 'h' || c == 'H') {
				smatch += '(?<hour>\\d{1,2})';
			}
			else if (c == 'i' || c == 'I') {
				smatch += '(?<min>\\d{1,2})';
			}
			else if (c == 's' || c == 'S') {
				smatch += '(?<sec>\\d{1,2})';
			}
			else if (c == ' ') {
				smatch += '\\s+';
			}
			else {
				smatch += '\\s*\\' + c + '\\s*';
			}
		}

		let rematch = new RegExp('^' + smatch + '$', 'm');

		let match = rematch.exec(value);

		if (match) {
			const now = new Date( );

			let d = parseInt(match.groups.day ?? '1');
			let m = parseInt(match.groups.month ?? '1');
			let y = parseInt(match.groups.year ?? now.getFullYear()+'');
			let h = parseInt(match.groups.hour ?? '0');
			let i = parseInt(match.groups.min ?? '0');
			let s = parseInt(match.groups.sec ?? '0');

			if (y > 0 && y < 100) {
				y += 2000;
			}

			let result = new Date(y, m - 1, d, h, i, s, 0);

			// we test the vdate validity (without adjustments)
			// without this test, date ( 0, 0, 0) is accepted and transformed to 1969/11/31 (not fun)
			let ty = result.getFullYear(),
				tm = result.getMonth() + 1,
				td = result.getDate();

			if (ty != y || tm != m || td != d) {
				//debugger;
				return null;
			}

			return result;
		}
	}

	return null;
}

/**
 * format a date as string 
 * @param date - date to format
 * @param fmt - format 
 * format specifiers:
 * d: date (no pad)
 * D: 2 digits date padded with 0
 * j: day of week short mode 'mon'
 * J: day of week long mode 'monday'
 * w: week number
 * m: month (no pad)
 * M: 2 digits month padded with 0
 * o: month short mode 'jan'
 * O: month long mode 'january'
 * y or Y: year
 * h: hour (24 format)
 * H: 2 digits hour (24 format) padded with 0
 * i: minutes
 * I: 2 digits minutes padded with 0
 * s: seconds
 * S: 2 digits seconds padded with 0
 * a: am or pm
 * anything else is inserted
 * if you need to insert some text, put it between {}
 * 
 * @example
 * 
 * 01/01/1970 11:25:00 with '{this is my demo date formatter: }H-i*M'
 * "this is my demo date formatter: 11-25*january"
 */

export function formatIntlDate(date: Date, fmt: string = _tr.global.date_format) {

	if (!date) {
		return '';
	}

	let now = {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		wday: date.getDay(),
		hours: date.getHours(),
		minutes: date.getMinutes(),
		seconds: date.getSeconds(),
		milli: date.getMilliseconds()
	};


	let result = '';
	let esc = 0;

	for (let c of fmt) {

		if (c == '{') {
			if (++esc == 1) {
				continue;
			}
		}
		else if (c == '}') {
			if (--esc == 0) {
				continue;
			}
		}

		if (esc) {
			result += c;
			continue;
		}

		if (c == 'd') {
			result += now.day;
		}
		else if (c == 'D') {
			result += pad(now.day, -2);
		}
		else if (c == 'j') { // day short
			result += _tr.global.day_short[now.wday];
		}
		else if (c == 'J') { // day long
			result += _tr.global.day_long[now.wday];
		}
		else if (c == 'w') {	// week
			result += date_calc_weeknum(date);
		}
		else if (c == 'W') {	// week
			result += pad(date_calc_weeknum(date), -2);
		}
		else if (c == 'm') {
			result += now.month;
		}
		else if (c == 'M') {
			result += pad(now.month, -2);
		}
		else if (c == 'o') {	// month short
			result += _tr.global.month_short[now.month - 1];
		}
		else if (c == 'O') {	// month long
			result += _tr.global.month_long[now.month - 1];
		}
		else if (c == 'y' || c == 'Y') {
			result += pad(now.year, -4);
		}
		else if (c == 'a' || c == 'A') {
			result += now.hours < 12 ? 'am' : 'pm';
		}
		else if (c == 'h') {
			result += now.hours;
		}
		else if (c == 'H') {
			result += pad(now.hours, -2);
		}
		else if (c == 'i') {
			result += now.minutes;
		}
		else if (c == 'I') {
			result += pad(now.minutes, -2);
		}
		else if (c == 's') {
			result += now.seconds;
		}
		else if (c == 'S') {
			result += pad(now.seconds, -2);
		}
		else if (c == 'l') {
			result += now.milli;
		}
		else if (c == 'L') {
			result += pad(now.milli, -3);
		}
		else {
			result += c;
		}
	}

	return result;
}

export function calcAge(birth: Date, ref?: Date) {
	if (ref === undefined) {
		ref = new Date();
	}

	if (!birth) {
		return 0;
	}

	let age = ref.getFullYear() - birth.getFullYear();
	if (ref.getMonth() < birth.getMonth() || (ref.getMonth() == birth.getMonth() && ref.getDate() < birth.getDate())) {
		age--;
	}

	return age;
}

