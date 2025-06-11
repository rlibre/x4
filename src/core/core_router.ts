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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EvChange, EvError } from './component.js';
import { EventMap, EventSource } from './core_events.js';

type RouteHandler = ( params: any, path: string ) => void;

interface Segment {
	keys: string[],
	pattern: RegExp;
}

interface Route {
	keys: string[],
	pattern: RegExp;
	handler: RouteHandler;
}

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

interface RouterEvents extends EventMap {
	change: EvChange;
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
	 * 
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

