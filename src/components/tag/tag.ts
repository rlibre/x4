/**
* @file tag.ts
* @author Etienne Cochard 
* @copyright (c) 2026 R-libre ingenierie, all rights reserved.
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