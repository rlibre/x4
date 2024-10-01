import { Component, ComponentProps } from "@core/component"

import "./viewport.module.scss"

export class Viewport extends Component {
	constructor( props: ComponentProps ) {
		super( props );
	}
}

export class ScrollView extends Component {
	constructor( props: ComponentProps ) {
		super( props );
		this.setContent( new Viewport( {} ) );
	}

	getViewport( ) {
		return this.firstChild<Viewport>( );
	}
}


