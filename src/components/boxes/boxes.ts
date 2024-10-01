import { Component, ComponentProps } from "@core/component"

import "./boxes.module.scss";

interface BoxProps extends ComponentProps {
	id?: string;
}

/**
 * 
 */

export class HBox extends Component<BoxProps> {
	constructor( p: BoxProps ) {
		super( p );
	}
}

/**
 * 
 */

export class VBox extends Component<BoxProps> {
	constructor( p: BoxProps ) {
		super( p );
	}
}

