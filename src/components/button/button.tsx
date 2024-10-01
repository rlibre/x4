import { Component, ComponentProps } from "@core/component"
import { UnsafeHtml } from '@core/core_tools.js';

import { Label } from "../label/label"
import { Icon } from "../icon/icon"

import "./button.module.scss";

interface ButtonProps extends ComponentProps {
	label?: string;
	icon?: string;
}

export class Button extends Component<ButtonProps> {

	constructor( p: ButtonProps ) {
		super( { ...p, tag: 'button', content: null } );

		this.setContent( [
			new Icon( { id: "icon", iconId: this.props.icon } ),
			new Component( { id: "label", content: this.props.label } ),
		] );
		
	}

	setText( text: string | UnsafeHtml ) {
		this.query( "#label" ).setContent( text );
	}

	setIcon( icon: string ) {
		this.query<Icon>( "#icon" ).setIcon( icon );
	}
}

