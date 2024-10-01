import { Component, ComponentContent, ComponentProps } from '@core/component';
import { UnsafeHtml, Constructor } from '@core/core_tools';

import { VBox } from '../boxes/boxes';
import { Label } from '../label/label';

import "./panel.module.scss";

interface PanelProps extends ComponentProps {
	title: string;
	icon?: string;
	bodyModel?: Constructor<Component>;
}

/**
 * 
 */

export class Panel extends VBox<PanelProps> {

	private _title: Component;
	private _body: Component;

	constructor( props: PanelProps ) {
		super( { ...props, content: undefined } );

		const model = props.bodyModel ?? VBox;
		super.setContent( [
			this._title = new Label( { tag: "legend", text: props.title, icon: props.icon } ),
			this._body  = new model( { cls: "body", content: props.content } )
		] );
	}

	setContent( content: ComponentContent ) {
		this._body.setContent( content );
	}

	setTitle( title: string | UnsafeHtml ) {
		this._title.setContent( title )
	}
}