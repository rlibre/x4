/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file core_shortcuts.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { isArray } from './core_tools';

/**
 * Keyboard shortcuts.
 *
 * A shortcut is a sequence of keys, written as it is read: "Mod+C",
 * "Shift+Mod+Z", "Delete", "Alt+ArrowLeft". The modifiers are Shift, Ctrl,
 * Cmd, Alt and Mod: the key of the commands, which is Ctrl on Windows and
 * Linux, and Cmd on a Mac.
 *
 * This class only holds a list of shortcuts and finds the one a keyboard
 * event is. It is used by Component.addShortcut (the shortcuts of a view,
 * while the focus is in it) and by Application.addShortcut (those of the
 * whole application).
 */

export type ShortcutCallback = ( ev: KeyboardEvent ) => void;

export interface ShortcutOptions {
	/** also while the user types in a field (Mod+S, F5...) */
	editable?: boolean;
}

interface Shortcut {
	sequence: string;
	callback: ShortcutCallback;
	editable: boolean;
}

interface Keys {
	shift: boolean;
	ctrl: boolean;
	cmd: boolean;
	alt: boolean;
	key: string;
}

const isMac = typeof navigator!=="undefined" && /mac|iphone|ipad/i.test( navigator.platform ?? "" );

/**
 * "Shift+Mod+K" -> shift, ctrl (cmd on a Mac), k
 */

function parse( keys: string ): Keys {
	const parts = keys.toLowerCase( ).split( "+" ).map( p => p.trim( ) );
	const key = parts.pop( ) || "+";			// "Ctrl++": the key is +
	const has = ( name: string ) => parts.includes( name );

	return {
		shift: has( "shift" ),
		ctrl: has( "ctrl" ) || ( has( "mod" ) && !isMac ),
		cmd: has( "cmd" ) || ( has( "mod" ) && isMac ),
		alt: has( "alt" ),
		key
	};
}

/**
 * always in the same order: "shift+ctrl+cmd+alt+key"
 */

function join( k: Keys ): string {
	return ( k.shift ? "shift+" : "" ) + ( k.ctrl ? "ctrl+" : "" ) + ( k.cmd ? "cmd+" : "" ) + ( k.alt ? "alt+" : "" ) + k.key;
}

function sequenceOf( ev: KeyboardEvent ): string {
	// AltGr writes characters, never a command (Windows reports it as ctrl + alt)
	if( ev.getModifierState( "AltGraph" ) ) {
		return null;
	}

	// a keyboard without latin letters: the key where the letter is on a latin one
	let key = ev.key.toLowerCase( );
	if( key.length===1 && ( key<"a" || key>"z" ) && /^Key[A-Z]$/.test( ev.code ) ) {
		key = ev.code[3].toLowerCase( );
	}

	return join( { shift: ev.shiftKey, ctrl: ev.ctrlKey, cmd: ev.metaKey, alt: ev.altKey, key } );
}

function isEditable( target: EventTarget ): boolean {
	const el = target as HTMLElement;
	return el.isContentEditable || el.tagName==="INPUT" || el.tagName==="TEXTAREA" || el.tagName==="SELECT";
}

/**
 *
 */

export class Shortcuts {

	private list: Shortcut[] = [];

	/**
	 * @param keys - a sequence, or several ones for the same action
	 * @example
	 * shortcuts.add( "Mod+C", ( ) => this.copy( ) );
	 * shortcuts.add( ["Mod+Y", "Shift+Mod+Z"], ( ) => this.redo( ) );
	 */

	add( keys: string | string[], callback: ShortcutCallback, options: ShortcutOptions = {} ) {
		for( const k of isArray( keys ) ? keys : [keys] ) {
			this.list.push( { sequence: join( parse( k ) ), callback, editable: !!options.editable } );
		}
	}

	clear( ) {
		this.list = [];
	}

	/**
	 * calls the shortcut a key is, if any
	 * @returns true when it was one
	 */

	handle( ev: KeyboardEvent ): boolean {
		// already used by what has the focus (Enter on a button...)
		if( ev.defaultPrevented ) {
			return false;
		}

		const sequence = sequenceOf( ev );
		const found = this.list.find( s => s.sequence===sequence && ( s.editable || !isEditable( ev.target ) ) );
		if( !found ) {
			return false;
		}

		ev.preventDefault( );
		found.callback( ev );
		return true;
	}
}

/**
 * how the keys with a name are written
 */

const key_names: Record<string,string> = {
	arrowleft: "←",
	arrowup: "↑",
	arrowright: "→",
	arrowdown: "↓",
	escape: "Esc",
	delete: "Del",
	" ": "Space",
};

/**
 * How a sequence is written for the user, in a tooltip or a menu:
 * "Ctrl+C", "Ctrl+Shift+Z", and on a Mac the signs of its keys.
 *
 * @example
 * new Button( { icon, tooltip: `Undo (${shortcutText( "Mod+Z" )})` } )
 */

export function shortcutText( keys: string ): string {
	const k = parse( keys );
	const key = key_names[k.key] ?? ( k.key[0].toUpperCase( ) + k.key.substring( 1 ) );

	if( isMac ) {
		return ( k.ctrl ? "⌃" : "" ) + ( k.alt ? "⌥" : "" ) + ( k.shift ? "⇧" : "" ) + ( k.cmd ? "⌘" : "" ) + key;
	}

	return ( k.ctrl ? "Ctrl+" : "" ) + ( k.cmd ? "Meta+" : "" ) + ( k.alt ? "Alt+" : "" ) + ( k.shift ? "Shift+" : "" ) + key;
}
