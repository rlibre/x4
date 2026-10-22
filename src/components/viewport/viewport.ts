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
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps } from "../../core/component"

import "./viewport.module.scss"
import { Box, BoxProps } from '../components';

/**
 * 
 */

export class Viewport extends Component {
	static classPrefix = "x4";

	constructor( props: ComponentProps ) {
		super( props );
	}
}

/**
 * 
 */

export class ScrollView extends Box {
	static classPrefix = "x4";

	constructor( props: BoxProps ) {
		super( props );
		this.setContent( new Viewport( {} ) );
	}

	getViewport( ) {
		return this.firstChild<Viewport>( );
	}
}


