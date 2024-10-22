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

import { Component } from './component.js';
import { CoreElement } from './core_element.js';
import { CoreEvent, EventMap } from './core_events';

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

export class Application<E extends ApplicationEvents = ApplicationEvents> extends CoreElement<E> {

	#env = new Map<string,any>( );

	constructor( ) {
		super( );

		console.assert( main_app==null, "Application must be a singleton." );
		main_app = this;
	}

	setMainView( view: Component ) {
		document.body.appendChild( view.dom );
	}

	static instance<P extends Application = Application>( ): P {
		return main_app as P;
	}

	/**
	 * 
	 */

	setEnv( name: string, value: any ) {
		this.#env.set( name, value );
	}

	/**
	 * 
	 */
	
	getEnv( name: string, def_value?: any ) {
		return this.#env.get( name ) ?? def_value;
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

	setupSocketMessaging( path?: string ) {
		
		const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
		const address = path ?? `${protocol}${window.location.hostname}:${window.location.port}/ws`;	

		let msg_socket:WebSocket = null;

		// we trap all 'global' messages send via application
		// then we send them on websocket
		
		this.on( 'global', ( e: EvMessage ) => {
			if( e.hasOwnProperty(socket_sent) ) {
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
			this.setupSocketMessaging( path );
		}

		msg_socket.onerror = (ev )=> {
			console.log( 'websocket error:', ev );
		}
	}

}