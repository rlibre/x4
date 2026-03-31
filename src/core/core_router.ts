/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_router.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EvChange, EvError } from './component';
import { EventMap, EventSource } from './core_events';

type RouteHandler = ( params: any, path: string ) => void;

interface Segment {
	/** The names of the parameters extracted from the route string (e.g., `['id']` for `'/detail/:id'`). */
	keys: string[];
	/** The regular expression used to match the route against a URL path. */
	pattern: RegExp;
}

interface Route {
	/** The names of the parameters extracted from the route string. */
	keys: string[];
	/** The regular expression used to match the route against a URL path. */
	pattern: RegExp;
	/** The function to call when this route matches the current URL. */
	handler: RouteHandler;
}

/**
 * Parses a route string or regular expression into a `Segment` object.
 * This function converts human-readable route patterns (e.g., `'/users/:id'`) into
 * a regular expression that can be used for matching URL paths, and extracts parameter names.
 *
 * @param str - The route pattern as a string (e.g., `'/users/:id'`) or a direct `RegExp` object.
 * @param loose - If `true`, the pattern will match paths that start with the route but may have additional segments.
 *                If `false` (default), the pattern must match the entire path.
 * @returns A `Segment` object containing the extracted keys and the compiled regular expression.
 */

export function parseRoute(str: string | RegExp, loose = false): Segment {

	if (str instanceof RegExp) {
		return {
			keys: null,
			pattern: str
		};
	}

	const arr = str.split('/');

	let keys = [];
	let pattern = '';

	if( arr[0]=='' ) {
		arr.shift();
	}

	for (const tmp of arr) {
		const c = tmp[0];

		if (c === '*') {
			keys.push('wild');
			pattern += '/(.*)';
		}
		else if (c === ':') {
			const o = tmp.indexOf('?', 1);
			const ext = tmp.indexOf('.', 1);

			keys.push(tmp.substring(1, o >= 0 ? o : ext >= 0 ? ext : tmp.length));
			pattern += o >= 0 && ext < 0 ? '(?:/([^/]+?))?' : '/([^/]+?)';
			if (ext >= 0) {
				pattern += (o >= 0 ? '?' : '') + '\\' + tmp.substring(ext);
			}
		}
		else {
			pattern += '/' + tmp;
		}
	}

	return {
		keys,
		pattern: new RegExp( `^${pattern}${loose ? '(?=$|/)' : '/?$'}`, 'i' )
	};
}

/**
 * Defines the events that the `Router` can emit.
 */

interface RouterEvents extends EventMap {
	/** Emitted when the route changes successfully. The `value` property contains the new URL path. */
	change: EvChange;
	/** Emitted when a route is not found (404 error). The `code` is 404 and `message` describes the error. */
	error: EvError;
}


/**
 * micro router
 * 
 * ```
 * const router = new Router( );
 * 
 * router.get( "/detail/:id", ( params: any ) => {
 * 	this._showDetail( detail );
 * } );
 * 
 * router.get( "/:id", ( params: any ) => {
 *   if( params.id==0 )
 * 		router.navigate( '/home' );
 *	 }
 * });
 * 
 * router.on( "error", ( ) => {
 * 	router.navigate( '/home' );
 * })
 * 
 * router.init( );
 * ```
 */


export class Router extends EventSource< RouterEvents > {

	private m_routes: Route[];
	private m_useHash: boolean;

	constructor( useHash = true ) {
		super( );

		this.m_routes = [];
		this.m_useHash = useHash;
		
		window.addEventListener('popstate', (event) => {
			const url = this._getLocation( );
			const found = this._find(url);
		
			found.handlers.forEach(h => {
				h(found.params,url);
			});

			this.fire( "change", { value: this._getLocation() } );
		});
	}

	
	/**
	 * Registers a route handler for the given URI pattern.
	 *
	 * @param uri - A path string (may include parameter placeholders) or a RegExp used to match request URIs.
	 * @param handler - A function conforming to the RouteHandler type that will be executed when a request matches the route.
	 *
	 * @remarks
	 * The provided uri is parsed (via parseRoute) into a RegExp pattern and an ordered list of parameter keys.
	 * The resulting route descriptor ({ keys, pattern, handler }) is appended to the router's internal route list.
	 *
	 * @returns void
	 */

	get(uri: string | RegExp, handler: RouteHandler ) {
		let { keys, pattern } = parseRoute(uri);
		this.m_routes.push({ keys, pattern, handler });
	}


	init() {
		this.navigate( this._getLocation() );
	}

	private _getLocation( ) {
		return this.m_useHash ? '/'+document.location.hash.substring(1) : document.location.pathname;
	}

	/**
	 * Navigate to a given URI within the router, update browser history, and optionally notify route handlers.
	 *
	 * Normalizes the supplied URI
	 * updates the browser history and emits lifecycle events. 
	 *
	 * Behavior summary:
	 * - If no matching route or no handlers are found, logs a message, fires an "error" event with
	 *   { code: 404, message: "route not found" } and returns false.
	 * - If notify is true, invokes the first handler of the matched route with (params, uri).
	 * - Always fires a "change" event with { value: this._getLocation() } after performing the navigation.
	 *
	 * @param uri - Target URI to navigate to. If it does not start with '/', a leading '/' will be added.
	 *                When m_useHash is true the resulting location will be converted to a '#...' fragment.
	 * @param notify - Whether to invoke the matched route handler after updating history. Defaults to true.
	 * @param replace - Whether to replace the current history entry (true) or push a new one (false). Defaults to false.
	 * @returns True if navigation succeeded (route found and history updated); false if no route or handlers were found.
	 *
	 * @example
	 * // Navigate to /dashboard and notify handlers (pushes new history entry)
	 * navigate('/dashboard');
	 *
	 * @example
	 * // Replace the current history entry without notifying handlers
	 * navigate('/login', false, true);
	 */
	
	navigate( uri: string, notify = true, replace = false ) {

		if( !uri.startsWith('/') ) {
			uri = '/'+uri;
		}

		const found = this._find( uri );

		if( !found || found.handlers.length==0 ) {
			//window.history.pushState({}, '', 'error')
			console.log( 'route not found: '+uri );
			this.fire( "error", {code: 404, message: "route not found" } );
			return false;
		}

		if( this.m_useHash ) {
			while( uri.at(0)=='/' ) {
				uri = uri.substring( 1 );
			}
			
			uri = '#'+uri;
		}
		
		if( replace ) {
			window.history.replaceState({}, '', uri );
		}
		else {
			window.history.pushState({}, '', uri );
		}

		if( notify ) {
			//found.handlers.forEach( h => {
			//	h( found.params, uri );
			//} );
			
			found.handlers[0]( found.params, uri );
		}

		this.fire( "change", { value: this._getLocation() } );
		return true;
	}

	/**
	 * 
	 */

	private _find( url: string ): { params: Record<string,any>, handlers: RouteHandler[] } {
		
		let matches = [];
		let params: Record<string,any> = {};
		let handlers: RouteHandler[] = [];

		for (const tmp of this.m_routes ) {
			if (!tmp.keys ) {
				matches = tmp.pattern.exec(url);
				if (!matches) {
					continue;
				}

				if (matches['groups']) {
					for (const k in matches['groups']) {
						params[k] = matches['groups'][k];
					}
				}

				handlers = [...handlers, tmp.handler];
			} 
			else if (tmp.keys.length > 0) {
				matches = tmp.pattern.exec(url);
				if (matches === null) {
					continue;
				}

				for ( let j = 0; j < tmp.keys.length;) {
					params[tmp.keys[j]] = matches[++j];
				}

				handlers = [...handlers, tmp.handler];
			} 
			else if (tmp.pattern.test(url)) {
				handlers = [...handlers, tmp.handler];
			}
		}

		return { params, handlers };
	}
}
