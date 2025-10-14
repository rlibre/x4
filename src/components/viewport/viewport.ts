/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file viewport.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools';
import { Component, ComponentProps } from "../../core/component"

import "./viewport.module.scss"

@class_ns( "x4" )
export class Viewport extends Component {
	constructor( props: ComponentProps ) {
		super( props );
	}
}

@class_ns( "x4" )
export class ScrollView extends Component {
	constructor( props: ComponentProps ) {
		super( props );
		this.setContent( new Viewport( {} ) );
	}

	getViewport( ) {
		return this.firstChild<Viewport>( );
	}
}


