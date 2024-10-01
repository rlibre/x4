import { Component, ComponentProps } from "@core/component"

import "./boxes.module.scss";

interface BoxProps extends ComponentProps {
}

/**
 * 
 */

export class HBox<P extends BoxProps=BoxProps> extends Component<P> {
	constructor( p: P ) {
		super( p );
	}
}

/**
 * 
 */

export class VBox<P extends BoxProps=BoxProps> extends Component<P> {
	constructor( p: P ) {
		super( p );
	}
}

