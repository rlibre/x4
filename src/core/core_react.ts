/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file core_react.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2025 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 *
 * to use you must:
 * 
 * 1. add this to your tsconfig.json
 * 		"compilerOptions": {
 * 			...
 * 			"jsx": "preserve",
 * 			...
 * 		}
 * 	
 * 2. be sure that esbuild has this:
 * 		jsxFactory: "x4create_element",
 * 		loader: { ".ts": "tsx" }
 * 		
 * 
 * after that, all things like that will be ok
 * 
 * 	import { x4_create_element }  from "x4react"
 * 	const xx = <h1>This is a title</h1>
 * 
 */

import { Component } from './component.js';
import { Constructor, isString } from './core_tools.js';


/**
 * x4 is reactive ?
 * hard jsx :)
 */

export class x4_react {

	static create_element( tag: string, props: any, ...content: any[] ): Component;
	static create_element<X extends Component>( tag: string | Constructor<X>, props: X["props"], ...content: any[] ) {
		
		props = props || {};

		let el: Component;

		// --- simple div ------------------------
		if( isString(tag) ) {
			el = new Component( { tag } );
			Object.entries( props )
				.forEach(([name, value]) => {
					if (name.startsWith('on') && name.toLowerCase() in window) {
						el.dom.addEventListener(name.toLowerCase().substring(2), value)
					}
					else {
						el.setAttribute(name, value )
					}
				});
		}
		// --- Component ------------------------
		else {
			el = new tag( props );
		}

		if( content && content.length ) {
			el.appendContent( content );
		}

		return el;
	}
}