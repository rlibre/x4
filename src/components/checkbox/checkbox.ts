import { Component, ComponentProps, makeUniqueComponentId } from '@core/component.js';

import { Input } from '../input/input';
import { Label } from '../label/label';

import "./checkbox.module.scss"
import icon from "./check.svg";

import { HBox } from '../boxes/boxes.js';
import { svgLoader } from '../icon/icon.js';

interface CheckboxProps extends ComponentProps {
	label: string;
	checked?: boolean;
	value?: string;
}

/**
 * 
 */

export class Checkbox extends Component {

	//private _check: Component;
	//private _label: SimpleLabel;

	constructor( props: CheckboxProps ) {
		super( props );

		const inputId = makeUniqueComponentId( );

		this.setContent( [
			new Component( {
				cls: 'inner',
				content: [
					new Input( { 
						type:"checkbox", 
						id: inputId, 
						checked: props.checked 
					})
				] 
			}),
			new Label( { 
				tag: 'label',
				text: props.label, 
				labelFor: inputId, 
				id: undefined 
			} ),
		])

		svgLoader.load( icon ).then( svg => {
			this.query<Label>( '.inner' ).dom.insertAdjacentHTML( "beforeend", svg );
		});
	}
}