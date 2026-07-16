/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file tag.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { ComponentProps } from '../../core/component';
import { class_ns, UnsafeHtml } from '../../core/core_tools';
import { HBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { SimpleText } from '../label/label';

import "./tag.module.scss";


export interface TagProps extends ComponentProps {
	label?: string | UnsafeHtml;
	icon?: string;
}

/**
 * 
 * @cssvar
 * ```
 * --tag-border
 * --tag-border-focus
 * --tag-selection
 * --tag-color
 * --tag-icon-color
 * ```
 */

@class_ns( "x4" )
export class Tag extends HBox<TagProps> {

	constructor( props: TagProps ) {
		super( props );

		this.setContent( [
			new Icon( { iconId: props.icon } ),
			new SimpleText( { text: props.label } ),
		])
	}
}