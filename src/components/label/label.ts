/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file label.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps } from "../../core/component"
import { Icon } from "../icon/icon"

import "./label.module.scss";
import { class_ns, UnsafeHtml } from '../../core/core_tools';

export interface LabelProps extends ComponentProps {
	text?: string | UnsafeHtml;
	icon?: string;
	labelFor?: string;
}

/**
 * 
 */

@class_ns( "x4" )
export class Label extends Component<LabelProps> {
	#text: Component;
	
	constructor( p: LabelProps ) {
		super( { ...p, content: null } );

		this.setContent( [
			new Icon( { id:"icon", iconId: this.props.icon } ),
			this.#text = new Component( { tag: 'span', id: 'text' } )
		] );

		// small hack for react:
		//	p.content may be the text
		const text = this.props.text;
		this.setText( text );
	
		if( p.labelFor ) {
			this.setAttribute( "for", p.labelFor );
		}
	}

	setText( text: string | UnsafeHtml ) {
		this.#text.setContent( text );
		this.#text.setClass( "empty", !text );
	}

	setIcon( icon: string ) {
		this.query<Icon>( "#icon" ).setIcon( icon );
	}
}

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export interface SimpleTextProps extends ComponentProps {
	text: string | UnsafeHtml;
	align?: "left" | "center" | "right";
}

@class_ns( "x4" )
export class SimpleText extends Component<SimpleTextProps> {
	
	/**
	 * 
	 */
	
	constructor( p: SimpleTextProps ) {
		super( { ...p } );

		this.setContent( p.text );

		if( p.align ) {
			this.addClass( "al-"+p.align );
		}
	}	

	/**
	 * 
	 */

	setText( text: string | UnsafeHtml ) {
		this.setContent( text );
		this.setClass( "empty", !text );
	}
}
