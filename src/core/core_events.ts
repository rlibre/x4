/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_events.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { CoreElement } from './core_element';

/**
 * Represents a base event interface for the framework.
 * All custom events should implement this interface to ensure consistent behavior
 * regarding event propagation and default action prevention.
 */

export interface CoreEvent {
	readonly type?: string;			// type of the event 'click', 'change', ...
	readonly source?: CoreElement;	// object that fires the event
	readonly context?: any;			// contextual data, left to the user

	propagationStopped?: boolean;	// if true, do not propagate the event
	defaultPrevented?: boolean;		// if true, do not call default handler (if any)

	/**
	 * Stops the propagation of the event to further listeners.
	 * Subsequent listeners for the same event on the same EventSource will not be called.
	 */
	stopPropagation?(): void;		// stop the propagation
	/**
	 * Prevents the default action associated with the event.
	 * If a default handler exists, it will not be executed.
	 */
	preventDefault?(): void;		// prevent the default handler
}

// default stopPropagation implementation for Events
const stopPropagation = function ( this: CoreEvent ) {
	this.propagationStopped = true;
}

// default preventDefault implementation for Events
const preventDefault = function ( this: CoreEvent ) {
	this.defaultPrevented = true;
}


/**
 * A generic interface for mapping event names to their corresponding event payload types.
 * This is used by `EventSource` and `CoreElement` to provide compile-time type safety
 * for event listeners and fired events.
 *
 * @example
 * ```typescript
 * interface MyCustomEvents {
 *   'dataLoaded': { data: any, timestamp: number };
 *   'itemSelected': { itemId: string };
 * }
 * ```
 */

export interface EventMap {
}

/**
 * Defines the signature for an event callback function.
 * @template T - The specific type of `CoreEvent` that the callback handles.
 */

export type EventCallback<T extends CoreEvent = CoreEvent> = (event: T) => any;

/**
 * A base class for objects that can emit and listen to custom events.
 * It provides a typed eventing mechanism, allowing for the registration and removal of listeners,
 * and the firing of events with associated payloads.
 *
 * @template E - An `EventMap`-shaped type that defines the events supported by this source.
 */

export class EventSource<E extends EventMap = EventMap > {

	private _source: unknown;
	private _registry: Map<string,EventCallback[]>;

	/**
	 * Creates an instance of EventSource.
	 * @param source - The object that will be reported as the `source` of events fired by this instance.
	 *                 If `null` or `undefined`, the `EventSource` instance itself will be the source.
	 */
	constructor(source: unknown = null) {
		this._source = source ?? this;
	}

	/**
	 * Registers an event listener for a specific event name.
	 * @param name - The name of the event to listen for (must be a key in `E`).
	 * @param callback - The function to be called when the event is fired.
	 * @param capturing - If `true`, the listener will be added to the beginning of the listener list (capturing phase).
	 */
	addListener<K extends keyof E>( name: K, callback: ( ev: E[K] ) => void, capturing = false ) {
		
		if (!this._registry) {
			this._registry = new Map();
		}

		let listeners = this._registry.get(name as string);
		if (!listeners) {
			listeners = [];
			this._registry.set(name as string, listeners);
		}

		const cb = callback as EventCallback;

		if (listeners.indexOf(cb) == -1) {
			if (capturing) {
				listeners.unshift(cb);
			}
			else {
				listeners.push(cb);
			}
		}

		return ( ) => {
			this.removeListener( name, callback );
		}
	}

	/**
	 * Removes a previously registered event listener.
	 * @param name - The name of the event from which to remove the listener.
	 * @param callback - The specific callback function to remove. It must be the same function instance that was originally registered.
	 */

	removeListener<K extends keyof E>(name: K, callback: (ev: E[K]) => any) {
		
		if (!this._registry ) {
			return;
		}

		let listeners = this._registry.get(name as string);
		if (!listeners) {
			return;
		}

		const cb = callback as EventCallback;
		const idx = listeners.indexOf(cb);
		if (idx !== -1) {
			listeners.splice(idx, 1);
		}
	}

	/**
	 * Dispatches an event with a given name and payload to all registered listeners.
	 * @param name - The name of the event to fire (must be a key in `E`).
	 * @param evx - The event payload (event object) to pass to the listeners.
	 */
	fire<K extends keyof E>(name: K, evx: E[K]) {
		
		let listeners = this._registry?.get(name as string);
		//const defaultHandler = this.m_defaultHandlers?.get(eventName);

		if (listeners && listeners.length) {
			let ev = evx as CoreEvent;
			if (!ev) {
				ev = {};
			}

			if (!ev.source) {
				// readonly
				(ev as any).source = this._source;
			}

			if (!ev.type) {
				// readonly
				(ev as any).type = name;
			}

			
			if (!ev.preventDefault) {
				ev.preventDefault = preventDefault;
			}

			if (!ev.stopPropagation) {
				ev.stopPropagation = stopPropagation;
			}

			// small optimisation
			if (listeners.length == 1) {
				listeners[0](ev);
			}
			else {
				const temp = listeners.slice();
				for (let i = 0, n = temp.length; i < n; i++) {
					temp[i](ev);
					if (ev.propagationStopped) {
						break;
					}
				}
			}
		}

		//if (defaultHandler && defaultHandler.length && !e.defaultPrevented) {
		//	return defaultHandler[0](e);
		//}
	}
}
