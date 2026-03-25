/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_application.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, componentFromDOM } from './component';
import { CoreElement } from './core_element';
import { CoreEvent, EventMap } from './core_events';
import { asap, getFocusableElements, ITabHandler } from './core_tools';

const socket_sent = Symbol( 'socket' );


export interface EvMessage extends CoreEvent {
	msg: string;
	params: any;
}

export interface ApplicationEvents extends EventMap {
	global: EvMessage;
	message: EvMessage;
}

// singleton
let main_app: Application = null;

/**
 * Provides information about the user's device and browser capabilities.
 */

class Process {

	/**
	 * can be use to see if we have some tactile input
	 * @returns max touch point count
	 */

	getMaxTouchPoints( ) {
		return navigator.maxTouchPoints;
	}
}

/**
 * 
 */

interface AppProps {
	/** The CSS selector for the DOM element where the application's main view will be mounted (default: `'body'`). */
	mountPoint?: string;
}

/**
 * The main application class, acting as a singleton.
 * It manages the main view, environment variables, keyboard navigation,
 * and provides utilities for local storage and WebSocket communication.
 *
 * Assertions ensure only one instance of `Application` can exist.
 */

export class Application<E extends ApplicationEvents = ApplicationEvents> extends CoreElement<E> {

	private env = new Map<string,any>( );
	private mainview: Component;
	private props: AppProps;
	private mounted = false;
	
	 /**
     * Provides access to process-related information, such as touch capabilities.
     */

	static readonly process = new Process( );

	/**
     * Creates an instance of the Application.
     * This class is a singleton; an assertion will fail if multiple instances are created.
     * @param props - Configuration properties for the application.
     */

	constructor( props: AppProps = {} ) {
		super( );

		console.assert( main_app==null, "Application must be a singleton." );
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		main_app = this;

		const loaded = ( ) => {
			this.mount( props.mountPoint ?? 'body' )
		}

		if( document.readyState=='complete' ) {
			asap( loaded );
		}
		else {
			window.addEventListener( "load", loaded, { once: true } );
		}
	}

	/**
	 * 
	 */

	private mount( mountPoint = 'body' ) {
		if( !this.mounted && this.mainview ) {
			const ev = document.querySelector( mountPoint );
			if( ev ) {
				ev.appendChild( this.mainview.dom );
			}
		}
	}

	/**
     * Sets the main view component for the application.
     * This component will be mounted to the DOM.
     * @param view - The component to set as the main view.
     */
	
	setMainView( view: Component ) {
		this.mainview = view;
		this._setupKeyboard( );
	}

	/**
     * Returns the singleton instance of the Application.
     * @returns The application instance.
     */

	static instance<P extends Application = Application>( ): P {
		return main_app as P;
	}

	 /**
     * Retrieves the main view component of the application.
     * @returns The application's main view component.
     */

	getMainView( ) {
		return this.mainview;
	}

	/**
     * Sets an environment variable in the application's environment map.
     * @param name - The name of the environment variable.
     * @param value - The value to store for the environment variable.
     */

	setEnv( name: string, value: any ) {
		this.env.set( name, value );
	}

	/**
     * Retrieves an environment variable from the application's environment map.
     * @param name - The name of the environment variable.
     * @param def_value - An optional default value to return if the variable is not found.
     * @returns The value of the environment variable, or `def_value` if not found.
     */
	
	getEnv( name: string, def_value?: any ) {
		return this.env.get( name ) ?? def_value;
	}

	/**
     * Retrieves an environment variable from the application's environment map.
     * @param name - The name of the environment variable.
     * @param def_value - An optional default value to return if the variable is not found.
     * @returns The value of the environment variable, or `def_value` if not found.
     */

	static fireGlobal( msg: string, params?: any ) {
		Application.instance().fire( "global", { msg, params } );
	}

	/**
	 * 
	 */

	private _setupKeyboard( ) {
		
		document.addEventListener( "keydown", (ev) => {
			if( ev.key=="Tab" || ev.key=="Enter" ) {
				if( this.focusNext( !ev.shiftKey ) ) {
					ev.preventDefault( );
				}
			}
		} );
	}

	/**
     * Moves focus to the next or previous focusable element within the application.
     * Handles Tab and Shift+Tab key presses.
     * @param next - If `true`, focus moves to the next element; if `false`, to the previous.
     * @returns `true` if focus was successfully moved, `false` otherwise.
     */

	focusNext( next: boolean ) {
		let act = document.activeElement;
		let topmost: HTMLElement;

		while( act!=document.body ) {
			const comp = componentFromDOM(act);
			if( comp ) {
				const ifx = comp.queryInterface( "tab-handler") as ITabHandler;

				if( ifx ) {
					return ifx.focusNext( next );
				}

				if( act.classList.contains("x4box") ) {	// todo: that is too dirty
					topmost = act as HTMLElement;
				}
			}

			act = act.parentElement;
		}

		if( topmost ) {
			const focusable = getFocusableElements( topmost );
			if( !focusable.length ) {
				return true;
			}
			else {
				const first = focusable[0];
				const last  = focusable[focusable.length - 1];
				
				let newf: HTMLElement;
				if (!next && document.activeElement === first) {
					newf = last as HTMLElement;
				}
				else if (next && document.activeElement === last) {
					newf = first as HTMLElement;
				}

				if( newf ) {
					newf.focus(); 
					return true;
				}
			}
		}

		return false;
	}

	/**
     * Sets up WebSocket messaging for the application.
     * All 'global' messages fired via the application will be sent over the WebSocket,
     * and messages received from the WebSocket will be re-fired as 'global' messages.
     * @param path - Optional WebSocket path. If not provided, it defaults to `ws://hostname:port/ws`.
     * @param looseCallback - A callback function to be executed when the WebSocket connection is closed unexpectedly.
     */

	setupSocketMessaging( path?: string, looseCallback?: ( ) => void ) {
		
		const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
		const address = path ? protocol+path : `${protocol}${window.location.hostname}:${window.location.port}/ws`;	

		let opened = 0;
		let msg_socket:WebSocket = null;

		// we trap all 'global' messages send via application
		// then we send them on websocket
		
		this.on( 'global', ( e: EvMessage ) => {
			if( Object.prototype.hasOwnProperty.call( e, socket_sent) ) {
				return;
			}

			if( msg_socket ) {
				msg_socket.send( JSON.stringify( {
					msg: e.msg,
					params: e.params,
				} ) );
			}
		});

		msg_socket = new WebSocket(address, 'messaging' );

		msg_socket.onopen = ( ) => {
			console.log( 'websocket opened' );
			opened = 1;
		}

		// receive a message
		msg_socket.onmessage = ( e ) => {
			if( e.data!='ping' ) {
				const message = JSON.parse(e.data);
				message[socket_sent] = true;
				this.fire( 'global', message );
			}
		}

		// loose socket
		msg_socket.onclose = ( ev ) => {
			console.log( 'websocket closed:', ev );
			msg_socket = null;

			if( opened ) {
				looseCallback?.( );
				opened = 0;
			}
		}

		//msg_socket.onerror = (ev )=> {
		//	console.log( 'websocket error:', ev );
		//}
	}

	/**
     * Retrieves a value from the browser's local storage.
     * @param name - The key of the value to retrieve.
     * @returns The stored value as a string, or `null` if not found.
     */

	getStorage( name: string ) : string {
		return localStorage.getItem( name );
	}

	/**
     * Retrieves and parses a JSON value from the browser's local storage.
     * @param name - The key of the JSON value to retrieve.
     * @returns The parsed JSON object, or `undefined` if not found or parsing fails.
     */

	getStorageJSON( name: string ) : any {
		try {
			return JSON.parse( localStorage.getItem( name ) );
		}
		catch( e ) {
			return undefined;
		}
	}

	/**
     * Stores a string or number value in the browser's local storage.
     * The value will be converted to a string before storage.
     * @param name - The key under which to store the value.
     * @param value - The value to store.
     */

	setStorage( name: string, value: string | number ) {
		localStorage.setItem( name, value+'' );
	}

	/**
     * Stores an object as a JSON string in the browser's local storage.
     * @param name - The key under which to store the JSON value.
     * @param value - The object to serialize and store.
     */
	
	setStorageJSON( name: string, value: any ) {
		localStorage.setItem( name, JSON.stringify( value ) );
	}
}