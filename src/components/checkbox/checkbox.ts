import { Component, ComponentEvents, ComponentProps, EvChange, makeUniqueComponentId } from '../../core/component.js';
import { EventCallback } from '../../core/core_events.js';

import { Input } from '../input/input';
import { Label } from '../label/label';

import { svgLoader } from '../icon/icon.js';

import "./checkbox.module.scss"
import icon from "./check.svg";
import { class_ns } from '@core/core_tools.js';

/**
 * Checkbox events
 */

interface CheckBoxEvents extends ComponentEvents {
	change?: EvChange;
}

/**
 * Checkbox properties.
 */

interface CheckboxProps extends ComponentProps {
	label: string; 			// The text label for the checkbox.
	checked?: boolean;		// Optional boolean indicating if the checkbox is checked by default.
	value?: boolean | number | string;			// Optional value associated with the checkbox.
	name?: string;
	change?: EventCallback<EvChange>;
}

/**
 * Checkbox component that can be checked or unchecked.
 */

@class_ns( "x4" )
export class Checkbox extends Component<CheckboxProps,CheckBoxEvents> {
	readonly _input: Input;

	/**
     * Creates an instance of the Checkbox component.
     * 
     * @param {CheckboxProps} props - The properties for the checkbox component, including label, checked state, and value.
     * @example
     * const checkbox = new Checkbox({ label: 'Accept Terms', checked: true });
     */

	constructor( props: CheckboxProps ) {
		super( props );

		const inputId = makeUniqueComponentId( );

		this.mapPropEvents( props, 'change' );

		this.setContent( [
			new Component( {
				cls: 'inner',
				content: [
					this._input = new Input( { 
						type:"checkbox", 
						id: inputId, 
						name: props.name,
						checked: props.checked,
						dom_events: {
							change: ( ) => this._on_change( ),
						}
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

		this.addDOMEvent('click', (e) => this._on_click(e));	// for outside click
	}

	/**
	 * handle click outside label & input
	 */
	
	protected _on_click( ev: MouseEvent ) {
		if( ev.target==this.dom ) {
			(this._input.dom as HTMLInputElement).click( );
			ev.preventDefault();
			ev.stopPropagation();
		}
	}

	/**
	 * check state changed
	 */

	private _on_change() {
		this.fire('change', { value:this.getCheck() } );
	}

	/**
	 * @return the checked value
	 */

	public getCheck() {
		const d = this._input.dom as HTMLInputElement;
		return d.checked;
	}

	/**
	 * change the checked value
	 * @param {boolean} ck new checked value	
	 */

	public setCheck(ck: boolean) {
		const d = this._input.dom as HTMLInputElement;
		d.checked = ck;
	}

	/**
	 * change the checkbox label
	 * @param text 
	 */

	public setLabel(text: string) {
		this.query<Label>('label').setText( text );
	}

	/**
	 * toggle the checkbox
	 */

	public toggle() {
		this.setCheck( !this.getCheck() );
	}

}