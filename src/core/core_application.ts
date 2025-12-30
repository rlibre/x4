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
import { getFocusableElements, ITabHandler } from './core_tools';

const socket_sent = Symbol( 'socket' );


export interface EvMessage extends CoreEvent {
	msg: string;
	params: any;
}

export interface ApplicationEvents extends EventMap {
	global: EvMessage;
	message: EvMessage;
}

// signleton
let main_app: Application = null;



class Process {

	/**
	 * can be use to see if we have some tactile input
	 * @returns max touch point count
	 */

	getMaxTouchPoints( ) {
		return navigator.maxTouchPoints;
	}
}

interface AppProps {
	mountPoint?: string;
}

export class Application<E extends ApplicationEvents = ApplicationEvents> extends CoreElement<E> {

	private env = new Map<string,any>( );
	private mainview: Component;
	private props: AppProps;
	private mounted = false;
	
	static readonly process = new Process( );

	constructor( props: AppProps = {} ) {
		super( );

		console.assert( main_app==null, "Application must be a singleton." );
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		main_app = this;

		if( props.mountPoint ) {
			window.addEventListener( "load", ( ) => this.mount( props.mountPoint ) )
		}
	}

	private mount( mountPoint = 'body' ) {
		if( !this.mainview ) {
			const ev = document.querySelector( mountPoint );
			if( ev ) {
				ev.appendChild( this.mainview.dom );
			}
		}
	}

	setMainView( view: Component ) {
		this.mainview = view;
		this._setupKeyboard( );
	}

	static instance<P extends Application = Application>( ): P {
		return main_app as P;
	}

	/**
	 * 
	 */

	getMainView( ) {
		return this.mainview;
	}

	/**
	 * 
	 */

	setEnv( name: string, value: any ) {
		this.env.set( name, value );
	}

	/**
	 * 
	 */
	
	getEnv( name: string, def_value?: any ) {
		return this.env.get( name ) ?? def_value;
	}

	/**
	 * small shortcut for Application.instance().fire( "global", ... );
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
	 * 
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
				looseCallback( );
				opened = 0;
			}
		}

		//msg_socket.onerror = (ev )=> {
		//	console.log( 'websocket error:', ev );
		//}
	}

	/**
	 * get a local storage value
	 * @param name name of the value
	 * @returns the value (string) or undefined
	 */

	getStorage( name: string ) : string {
		return localStorage.getItem( name );
	}

	getStorageJSON( name: string ) : any {
		try {
			return JSON.parse( localStorage.getItem( name ) );
		}
		catch( e ) {
			return undefined;
		}
	}

	/**
	 * change a loclastorage value
	 * @param name name of the value
	 * @param value the value to store
	 */

	setStorage( name: string, value: string | number ) {
		localStorage.setItem( name, value+'' );
	}

	setStorageJSON( name: string, value: any ) {
		localStorage.setItem( name, JSON.stringify( value ) );
	}
}