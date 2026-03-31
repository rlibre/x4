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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventMap, EventSource } from './core_events';


/**
 * CoreElement
 *
 * A lightweight base class that provides two orthogonal utilities commonly needed by UI
 * or domain objects:
 * 1) Named timers (wraps setTimeout / setInterval by name so they can be started, stopped,
 *    and cleared by string identifier), and
 * 2) A typed eventing surface (lazy-initialised EventSource) for attaching, detaching and
 *    firing events.
 *
 * The class is generic over an EventMap `E` which maps event name keys to the payload
 * type for that event. This enables compile-time type safety for listeners and fired events.
 *
 * Template parameters:
 * @template E - An {@link EventMap}-shaped type that maps event keys to the event payload types.
 *
 * Timer semantics:
 * - Timers are referenced by a string `name`. Each instance of CoreElement maintains its own
 *   map of timers.
 * - Starting a timer with a name that is already present will stop the previous timer first.
 * - setTimeout(name, ms, callback) creates a single-shot timer (uses global setTimeout).
 * - setInterval(name, ms, callback) creates a repeating timer (uses global setInterval).
 * - clearTimeout(name) and clearInterval(name) both stop and remove the timer with the given
 *   name (they are aliases for the same internal stop logic).
 * - clearTimeouts() will stop and remove all timers currently tracked by the instance.
 * - The underlying timer handles are encapsulated; callers only interact via the string name.
 *
 * Event semantics:
 * - Event support is provided via a lazily-initialised EventSource instance internal to the
 *   CoreElement. The EventSource is created on first use (first call to on()).
 * - on(name, listener) registers a listener for the given event name and returns a small
 *   subscription object exposing an off() method for convenience.
 * - off(name, listener) removes a previously-registered listener (no-op if there is no
 *   EventSource or listener).
 * - fire(name, ev) will dispatch the given payload to all listeners registered for that
 *   event name (no-op if there is no EventSource).
 * - Listener and event payload types are enforced by the generic `E`.
 *
 * Threading / reentrancy / error handling:
 * - Timer callbacks execute via the platform timer mechanisms (setTimeout/setInterval). Any
 *   exceptions thrown by callbacks will propagate according to the environment's timer
 *   semantics (typically uncaught unless handled by the callback).
 * - The class uses console.assert to validate non-null listeners on public attach/detach
 *   methods; callers should avoid passing undefined/null listeners.
 * Example:
 * ```ts
 * // Strongly-typed events
 * interface MyEvents { loaded: { ok: boolean }, tick: number }
 * class MyElement extends CoreElement<MyEvents> {}
 *
 * const el = new MyElement();
 * const sub = el.on("loaded", e => console.log(e.ok));
 * el.fire("loaded", { ok: true });
 * sub.off(); // convenience to remove listener
 *
 * // Timers
 * el.setInterval("poll", 1000, () => el.fire("tick", Date.now()));
 * el.clearInterval("poll");
 * ```
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
		const clear = this.#timers?.get(name);
		if (clear) { clear(); }
	}

	/**
	 * Sets a timeout that executes a callback function after a specified delay.
	 * If a timeout with the same name already exists, it will be cleared before the new one is set.
	 * @param name - A unique string identifier for this timeout.
	 * @param ms - The delay in milliseconds before the callback is executed.
	 * @param callback - The function to execute after the delay.
	 */
	
	setTimeout( name: string, ms: number, callback: () => void ) {
		this.__startTimer( name, ms, false, callback );
	}
	
	/**
	 * Clears a previously set timeout.
	 * @param name - The name of the timeout to clear.
	 * @link setTimeout
	 */

	clearTimeout( name: string ) {
		this.__stopTimer( name );
	}

	/**
	 * Sets an interval that repeatedly executes a callback function after a specified delay.
	 * If a timeout with the same name already exists, it will be cleared before the new one is set.
	 * @param name - A unique string identifier for this timeout.
	 * @param ms - The delay in milliseconds before the callback is executed.
	 * @param callback - The function to execute after the delay.
	 */

	setInterval( name: string, ms: number, callback: ( ) => void ) {
		this.__startTimer( name, ms, true, callback );
	}

	/**
	 * Clears a previously set interval.
	 * @param name - The name of the interval to clear.
	 * @link setInterval
	 */

	clearInterval( name: string ) {
		this.__stopTimer( name );
	}

	/**
	 * Clears all timeouts and intervals currently managed by this instance.
	 * This stops all scheduled callbacks and removes their references.
	 * @link setTimeout
	 */
	clearTimeouts( ) {
		for( const [id,val] of this.#timers ) {
			val( );
		}
		
		this.#timers.clear( );
	}

	// :: EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * Registers an event listener for a specific event name.
	 * The listener will be invoked when an event with the given name is fired.
	 * Returns an object with an `off()` method, which can be used to conveniently remove this specific listener.
	 * @param name - The name of the event to listen for.
	 * @param listener - The callback function to execute when the event is fired.
	 * @returns An object containing an `off()` method to unsubscribe the listener.
	 * @link fire
	 * attach to an event
	 */

	on<K extends keyof E>( name: K, listener: ( ev: E[K] ) => void ) {
		console.assert( listener!==undefined && listener!==null );

		if( !this.#events ) {
			this.#events = new EventSource( this );
		}
		
		this.#events.addListener( name, listener );
		return {
			off: ( ) => {
				this.#events.removeListener( name, listener );
			}
		}
	}

	/**
	 * Removes a previously registered event listener.
	 * If the listener was not found or no events were registered, this method does nothing.
	 * @param name - The name of the event from which to remove the listener.
	 * @param listener - The specific listener function to remove.
	 * @link on
	 * @link fire
	 */

	off<K extends keyof E>( name: K, listener: ( ev: E[K] ) => void ) {
		console.assert( listener!==undefined && listener!==null );

		if( this.#events ) {
			this.#events.removeListener( name, listener );
		}
	}

	/**
	 * Dispatches an event with a given name and payload to all registered listeners.
	 * If no listeners are registered for the event name, or if no EventSource has been initialized, this method does nothing.
	 * @param name - The name of the event to fire.
	 * @param ev - The payload (event object) to pass to the listeners.
	 * @link on
	 * @link off
	 */

	fire<K extends keyof E>( name: K, ev: E[K] ) {
		if( this.#events ) {
			this.#events.fire( name, ev );
		}
	}
}