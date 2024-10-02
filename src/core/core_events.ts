/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file core_events.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { CoreElement } from './core_element';

/**
 * 
 */

export interface CoreEvent {
	readonly type?: string;			// type of the event 'click', 'change', ...
	readonly source?: CoreElement;	// object that fires the event
	readonly context?: any;			// contextual data, left to the user

	propagationStopped?: boolean;	// if true, do not propagate the event
	defaultPrevented?: boolean;		// if true, do not call default handler (if any)

	stopPropagation?(): void;		// stop the propagation
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
 * 
 */

export interface EventMap {
}

/**
 * 
 */

export type EventCallback<T extends CoreEvent = CoreEvent> = (event: T) => any;

/**
 * 
 */

export class EventSource<E extends EventMap = EventMap > {

	private _source: unknown;
	private _registry: Map<string,EventCallback[]>;

	constructor(source: unknown = null) {
		this._source = source ?? this;
	}

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
	}

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




