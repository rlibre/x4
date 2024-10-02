/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file label.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentProps } from "@core/component"
import { Icon } from "../icon/icon"

import "./label.module.scss";
import { UnsafeHtml } from '@core/core_tools.js';

interface LabelProps extends ComponentProps {
	text: string | UnsafeHtml;
	icon?: string;
	labelFor?: string;
}

export class Label extends Component<LabelProps> {

	constructor( p: LabelProps ) {
		super( { ...p, content: null } );

		this.setContent( [
			new Icon( { id:"icon", iconId: this.props.icon } ),
			new Component( { tag: 'span', id: 'text', content: this.props.text } )
		] );

		if( p.labelFor ) {
			this.setAttribute( "for", p.labelFor );
		}
	}

	setText( text: string | UnsafeHtml ) {
		this.query( "#text" ).setContent( text );
	}

	setIcon( icon: string ) {
		this.query<Icon>( "#icon" ).setIcon( icon );
	}
}

