import { Component, ComponentProps } from '@core/component';

import "./progress.module.scss";

interface ProgressProps extends ComponentProps {
	value: number;
	min: number;
	max: number;
}


export class Progress extends Component<ProgressProps> {

	private _bar: Component;

	constructor( props: ProgressProps ) {
		super( props );

		this.setContent( this._bar=new Component( { cls: "bar" } ) );
		this.setValue( props.value );
	}

	setValue( value: number ) {
		const perc = value / (this.props.max-this.props.min) * 100;
		this._bar.setStyleValue( "width", perc+"%" );
	}
}