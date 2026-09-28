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

import { Component } from './component';
import { Constructor, isString } from './core_tools';


/**
 * x4 is reactive ?
 * hard jsx :)
 */

export class x4_react {

	static create_element( tag: string, props: any, ...content: any[] ): Component;
	static create_element<X extends Component>( tag: string | Constructor<X>, props: X["props"], ...children: any[] ) {

		// ref is a JSX-only attribute: never passed to the component
		const { ref, ...attrs } = ( props ?? {} ) as any;

		// flatten {items.map(...)} and drop null / false from conditional children
		const content = children.flat( Infinity )
								.filter( c => c !== null && c !== undefined && c !== false );

		let el: Component;

		// --- simple html element ------------------------
		if( isString( tag ) ) {
			el = new Component( { tag } );

			Object.entries( attrs )
				.forEach( ( [name, value]: [string, any] ) => {
					if( name.startsWith( 'on' ) && name.toLowerCase( ) in window ) {
						el.dom.addEventListener( name.toLowerCase( ).substring( 2 ), value );
					}
					else {
						el.setAttribute( name, value );
					}
				});

			if( content.length ) {
				el.setContent( content );
			}
		}
		// --- Component ------------------------
		else {
			// same path as object construction: <X a={1}>{kids}</X> === new X({ a: 1, content: kids })
			el = new tag( content.length ? { ...attrs, content } : attrs );
		}

		// ref={[owner, "name"]} stores the element in owner.refs.name
		if( ref ) {
			const [owner, name] = ref;

			// the owner must be a Box: only Box has refs
			if( !owner?.refs || typeof name !== "string" ) {
				console.error( "invalid JSX ref, expected [ownerBox, \"name\"]:", ref );
			}
			else {
				owner.refs[name] = el;
			}
		}

		return el;
	}
}