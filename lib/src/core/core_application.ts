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
import { EventMap } from './core_events';


export interface ApplicationEvents extends EventMap {
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
}