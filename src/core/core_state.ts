/**
* @file core_state.ts
* @author Etienne Cochard 
* @copyright (c) 2025 R-libre ingenierie, all rights reserved.
**/

import { CoreEvent, EventMap, EventSource } from './core_events.js';
import { getMemberValue, isPlainObject } from './core_tools.js';

type StateData = boolean | number | string | Date | unknown;
type State = Record<string, StateData>;

export interface EvStateChange extends CoreEvent {
	readonly path: string;
	readonly value: any;
}

export interface StateEvents extends EventMap {
	change: EvStateChange;
}

/**
 * type of the proxified state: the data itself + the manager's event API.
 * Pick<> avoids re-declaring the signatures — if on/off/once evolve
 * in StateManager, this type follows automatically.
 */

export type StateProxy<T extends State> = T & Pick<StateManager<T>, "on" | "off" | "once" | "watch">;


/**
 * true for values that must be wrapped in a proxy when accessed
 * (plain objects & arrays — excludes null, Date, RegExp, Map, Set,
 * class instances, ...)
 */

function _is_proxyable( value: any ): boolean {
	return value !== null && typeof value === "object" && ( Array.isArray( value ) || isPlainObject( value ) );
}

/**
 * append a segment to a dotted path, using bracket notation
 * for array indices: "items[3].name" instead of "items.3.name"
 */
function _child_path( path: string, prop: string, target: any ): string {
	if( Array.isArray( target ) && /^\d+$/.test( prop ) ) {
		return `${path}[${prop}]`;
	}
	return path ? `${path}.${prop}` : prop;
}

/**
 * true when 'path' is 'watched' itself or one of its descendants:
 *   _path_matches( "user",      "user" )        → true  (the value itself)
 *   _path_matches( "user.name", "user" )        → true  (descendant)
 *   _path_matches( "user.tags[2]", "user.tags") → true  (array element)
 *   _path_matches( "username",  "user" )        → false (boundary check)
 */
function _path_matches( path: string, watched: string ): boolean {
	if( !path.startsWith(watched) ) return false;
	if( path.length===watched.length ) return true;

	const c = path[watched.length];
	return c==='.' || c==='[';
}

/**
 * 
 */

export class StateManager<T extends State> extends EventSource<StateEvents> {

	private _state: T;
	private _proxy: StateProxy<T> | undefined;

	/**
	 * raw object → proxy cache, scoped to THIS manager
	 * - avoids re-creating a proxy on every get
	 * - guarantees referential identity: state.user === state.user
	 * - WeakMap: entries are collected with their objects, and the whole cache is collected with the manager
	 * - instance-scoped (not module-level) so the same raw object referenced by two different managers never gets a proxy bound to the wrong manager/path
	 */

	private _cache = new WeakMap<object, any>( );

	constructor( initialState: T ) {
		super( );
		this._state = { ...initialState };
	}

	proxify( ): StateProxy<T> {

		if( !this._proxy ) {
			// event API attached as non-enumerable properties on the raw root object: invisible to for...in / Object.keys 
			// OR JSON.stringify, and served by the get trap with no special handling

			Object.defineProperties( this._state, {
				on:   { value: this.on.bind( this ),   enumerable: false },
				off:  { value: this.off.bind( this ),  enumerable: false },
				once: { value: this.once.bind( this ), enumerable: false },
				watch: { value: this.watch.bind( this ), enumerable: false },
			});

			this._proxy = this._mk_proxy( this._state, "" );
		}

		return this._proxy;
	}

	/**
	 * create a lazy proxy: sub-objects and arrays are only wrapped
	 * when actually accessed, and are never copied — the original
	 * object remains the single source of truth.
	 */

	private _mk_proxy( obj: any, path: string ): any {

		const cached = this._cache.get( obj );
		if( cached ) return cached;

		const proxy = new Proxy( obj, {

			get: ( target, prop, receiver ) => {

				// symbols (Symbol.iterator, Symbol.toPrimitive, devtools inspection...): 
				// pass-through, never an error nor a wrap
				if( typeof prop === "symbol" ) {
					return Reflect.get( target, prop, receiver );
				}

				// genuinely missing property ('in' walks the prototype chain, so array methods, toString, toJSON... never trigger a false positive)
				if( !( prop in target ) ) {
					console.error( `state error, unable to find ${_child_path(path,prop,target)}` );
					return undefined;
				}

				const value = Reflect.get( target, prop, receiver );

				// wrap on demand, only what is actually read
				if( _is_proxyable( value ) ) {
					return this._mk_proxy( value, _child_path( path, prop, target ) );
				}

				return value;
			},

			set: ( target, prop, value, receiver ) => {

				// no notification when the value doesn't change
				// (avoids noise and listener → set → listener loops)
				if( Reflect.get( target, prop, receiver ) === value ) {
					return true;
				}

				Reflect.set( target, prop, value, receiver );

				// no readable path for a symbol: assign without firing
				if( typeof prop === "string" ) {
					this.fire( "change", { path: _child_path(path,prop,target), value } );
				}

				return true;
			},

			deleteProperty: ( target, prop ) => {

				if( !( prop in target ) ) return true;

				delete target[prop];

				if( typeof prop === "string" ) {
					this.fire( "change", { path: _child_path(path,prop,target), value: undefined } );
				}

				return true;
			}
		});

		this._cache.set( obj, proxy );
		return proxy;
	}

	on<K extends keyof StateEvents>( name: K, listener: ( ev: StateEvents[K] ) => void ) {
		this.addListener( name, listener );
		return {
			off: ( ) => this.removeListener( name, listener )
		}
	}

	off<K extends keyof StateEvents>( name: K, listener: ( ev: StateEvents[K] ) => void ) {
		this.removeListener( name, listener );
	}

	once<K extends keyof StateEvents>( name: K, listener: ( ev: StateEvents[K] ) => void ) {
		const handle = this.on( name, ( e ) => {
			handle.off( );
			listener( e );
		});
		return handle;
	}

	/**
	 * observe changes on a specific path and everything below it.
	 * fires for the path itself and for any descendant:
	 *   watch( "user", cb )  →  fires on user, user.name, user.tags[0], ...
	 * returns a handle with off() to unsubscribe.
	 */
	watch( path: string, cb: ( ev: EvStateChange ) => void ) {
		return this.on( "change", e => {
			if( _path_matches( e.path, path ) ) {
				cb( e );
			}
			else if( _path_matches( path, e.path ) ) {
				const ee = { ...e };
				ee.value = getMemberValue(this._proxy,path );
				cb( ee );
			}
		});
	}
}


/**
 * create a ready-to-use reactive state
 *
 * const state = makeState( { count: 0, items: [1,2,3] } );
 * state.on( "change", e => console.log( e.path, "=", e.value ) );
 * state.count++;         // "count = 1"
 * state.items.push( 4 ); // "items.3 = 4"
 */

export function makeState<T extends Record<keyof T, StateData>>( initialState: T ): StateProxy<T> {
	return new StateManager( initialState ).proxify( );
}

