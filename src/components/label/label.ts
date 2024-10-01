import { Component, ComponentProps } from "@core/component"
import { Icon } from "../icon/icon"

import "./label.module.scss";
import { UnsafeHtml } from '@core/core_tools.js';

interface LabelProps extends ComponentProps {
	text: string;
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

