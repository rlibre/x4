/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_element.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventMap, EventSource } from './core_events.js';

/**
 * 
 */

export class CoreElement<E extends EventMap = EventMap> {

	#events: EventSource<E>;
	#timers: Map<string, Function>;

	private __startTimer( name: string, ms: number, repeat: boolean, callback: ( ) => void ) {
		if (!this.#timers) {
			this.#timers = new Map();
		}
		else {
			this.__stopTimer(name);
		}

		const id = (repeat ? setInterval : setTimeout)( callback, ms );

		this.#timers.set(name, () => { 
			(repeat ? clearInterval : clearTimeout)(id); 
			this.#timers.delete(name) 
		});
	}

	private __stopTimer( name: string ) {
		const clear = this.#timers.get(name);
		if (clear) { clear(); }
	}

	setTimeout( name: string, ms: number, callback: () => void ) {
		this.__startTimer( name, ms, false, callback );
	}

	clearTimeout( name: string ) {
		this.__stopTimer( name );
	}

	setInterval( name: string, ms: number, callback: ( ) => void ) {
		this.__startTimer( name, ms, true, callback );
	}

	clearInterval( name: string ) {
		this.__stopTimer( name );
	}

	clearTimeouts( ) {
		for( const [id,val] of this.#timers ) {
			val( );
		}
		
		this.#timers.clear( );
	}

	// :: EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * attach to an event
	 */

	on<K extends keyof E>( name: K, listener: ( ev: E[K] ) => void ) {
		console.assert( listener!==undefined && listener!==null );

		if( !this.#events ) {
			this.#events = new EventSource( this );
		}
		
		this.#events.addListener( name, listener );
	}

	/**
	 * 
	 */

	fire<K extends keyof E>( name: K, ev: E[K] ) {
		if( this.#events ) {
			this.#events.fire( name, ev );
		}
	}
}