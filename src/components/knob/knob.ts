/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file knob.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { clamp, IComponentInterface, IFormElement, UnsafeHtml } from '../../core/core_tools';

import { Label } from '../label/label';

import './knob.module.scss';

export interface KnobEvents extends ComponentEvents {
	change: EvChange;
}

export interface KnobProps extends ComponentProps {
	value?: number;
	/** range: the value between min and max (0 to 100 by default), on an arc of 270° */
	min?: number;
	max?: number;
	step?: number;
	/** the knob turns without end: the value has no min nor max */
	infinite?: boolean;
	/** infinite: the value of a whole turn (360 by default: the value is an angle) */
	turn?: number;
	/** the diameter of the dial, in px (48 by default): width and height size the whole, label included */
	size?: number;
	/** under the dial, with its icon */
	label?: string | UnsafeHtml;
	icon?: string;
	/** for a Form: it reads the value as a number */
	name?: string;
	change?: EventCallback<EvChange>;
}

// range: the arc goes from -135° to +135°, 0 at the top
const SWEEP = 270;

/**
 * a rotary button: on a range (min to max), or infinite.
 * the pointer turns it around its center, the wheel (when it has the focus) and the arrows by step.
 * infinite: a double click sets it back to its first value.
 *
 * @example
 * new Knob( { label: "Volume", value: 25, change: ( ev ) => player.setVolume( ev.value ) } )
 * new Knob( { infinite: true, turn: 20, change: ( ev ) => list.scrollTo( ev.value ) } )
 *
 * @cssvar
 * ```
 * --knob-track
 * --knob-value
 * --knob-cap-background
 * --knob-cap-border
 * --knob-pointer
 * --knob-border-focus
 * --knob-track-disabled
 * --knob-value-disabled
 * --knob-cap-background-disabled
 * ```
 */

export class Knob extends Component<KnobProps,KnobEvents> {
	static classPrefix = "x4";

	private _value = 0;
	private _raw = 0;			// while dragged: the value not yet on the step
	private _angle = 0;			// while dragged: the angle of the pointer at the last move
	private _center: { x: number, y: number } = null;

	private _dial: Component = null;
	private _label: Label = null;

	constructor( props: KnobProps ) {
		super( props );

		this.mapPropEvents( props, "change" );

		if( props.infinite ) {
			this.addClass( 'infinite' );
		}

		if( props.size ) {
			this.setStyleVariable( "--knob-size", props.size+"px" );
		}

		this.setContent( [
			this._dial = new Component( { cls: "dial", content: [
				new Component( { cls: "ring" } ),
				new Component( { cls: "cap", content: new Component( { cls: "pointer" } ) } ),
			] } ),
			this._label = new Label( { text: props.label, icon: props.icon, align: "center" } ),
		] );

		this._showLabel( );

		this.setAttribute( "tabindex", 0 );
		this.setAttribute( "role", "slider" );

		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		// the dial is turned; the label is not
		this._dial.setDOMEvents( {
			pointerdown: ( ev ) => this._on_pointerdown( ev ),
			pointermove: ( ev ) => this._on_pointermove( ev ),
			pointerup: ( ev ) => this._on_pointerup( ev ),
			pointercancel: ( ev ) => this._on_pointerup( ev ),
			dblclick: ( ) => this._on_dblclick( ),
		} );

		this.setDOMEvents( {
			wheel: ( ev ) => this._on_wheel( ev ),
			keydown: ( ev ) => this._on_key( ev ),
		} );

		this._value = this._fix( props.value ?? this._min( ) );
		this._update( );
	}

	private _min( ) { return this.props.min ?? 0; }
	private _max( ) { return this.props.max ?? 100; }
	private _step( ) { return this.props.step ?? 1; }
	private _turn( ) { return this.props.turn ?? 360; }

	// on the step (from min on a range), between min and max on a range
	private _fix( v: number ) {
		const step = this._step( );

		if( this.props.infinite ) {
			return step>0 ? Math.round( v/step )*step : v;
		}

		const min = this._min( );
		const max = this._max( );

		if( step>0 ) {
			v = min + Math.round( (v-min)/step )*step;
		}

		return clamp( v, min, Math.max( min, max ) );
	}

	// the angle of the point of the page, around the center: 0 at the top, clockwise
	private _angleOf( ev: PointerEvent ) {
		const dx = ev.clientX - this._center.x;
		const dy = ev.clientY - this._center.y;
		return Math.atan2( dx, -dy ) * 180 / Math.PI;
	}

	private _on_pointerdown( ev: PointerEvent ) {
		ev.stopPropagation( );
		ev.preventDefault( );

		this.focus( );

		const rc = this._dial.getBoundingRect( );
		this._center = { x: rc.left + rc.width/2, y: rc.top + rc.height/2 };
		this._angle = this._angleOf( ev );
		this._raw = this._value;

		this.addClass( "dragging" );
		this._dial.setCapture( ev.pointerId );
	}

	// the knob follows the turn of the pointer, not its position: no jump when it is taken,
	// nor from max to min on a range
	private _on_pointermove( ev: PointerEvent ) {
		if( !this._center ) {
			return;
		}

		const angle = this._angleOf( ev );
		let delta = angle - this._angle;

		// across ±180°: the short way
		if( delta>180 ) delta -= 360;
		else if( delta<-180 ) delta += 360;

		this._angle = angle;

		if( this.props.infinite ) {
			this._raw += delta / 360 * this._turn( );
		}
		else {
			const min = this._min( );
			const max = this._max( );
			this._raw = clamp( this._raw + delta / SWEEP * (max-min), min, max );
		}

		this._set( this._fix( this._raw ), true );
	}

	private _on_pointerup( ev: PointerEvent ) {
		if( this._center ) {
			this._dial.releaseCapture( ev.pointerId );
			this.removeClass( "dragging" );
			this._center = null;
		}
	}

	// infinite: back to the value it started with (0 by default)
	private _on_dblclick( ) {
		if( this.props.infinite ) {
			this._set( this._fix( this.props.value ?? 0 ), true );
		}
	}

	// only with the focus: the wheel over the page scrolls it, and does not turn the knobs it meets
	private _on_wheel( ev: WheelEvent ) {
		if( !this.hasFocus( ) || !ev.deltaY ) {
			return;
		}

		ev.preventDefault( );
		this._inc( ev.deltaY<0 ? 1 : -1, ev.ctrlKey );
	}

	private _on_key( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "ArrowRight":
			case "ArrowUp": this._inc( 1, ev.ctrlKey ); break;

			case "ArrowLeft":
			case "ArrowDown": this._inc( -1, ev.ctrlKey ); break;

			case "PageUp": this._inc( 1, true ); break;
			case "PageDown": this._inc( -1, true ); break;

			case "Home": {
				if( this.props.infinite ) return;
				this._set( this._min( ), true );
				break;
			}

			case "End": {
				if( this.props.infinite ) return;
				this._set( this._fix( this._max( ) ), true );
				break;
			}

			default:
				return;
		}

		ev.preventDefault( );
	}

	// a step, ten with ctrl
	private _inc( sens: number, big: boolean ) {
		const step = this._step( ) || 1;
		this._set( this._fix( this._value + sens * step * (big ? 10 : 1) ), true );
	}

	// notify: a change made by the user (pointer, wheel, keys); not by the code, nor at the construction
	private _set( v: number, notify: boolean ) {
		if( v===this._value ) {
			return;
		}

		this._value = v;
		this._update( );

		if( notify ) {
			this.fire( "change", { value: v } );
		}
	}

	private _update( ) {
		let angle: number;

		if( this.props.infinite ) {
			angle = ( this._value / this._turn( ) * 360 ) % 360;
			this.setAria( "aria-valuenow", this._value );
		}
		else {
			const min = this._min( );
			const max = this._max( );
			const perc = max>min ? (this._value-min) / (max-min) : 0;

			angle = -SWEEP/2 + perc * SWEEP;
			this.setStyleVariable( "--knob-perc", perc*SWEEP + "deg" );

			this.setAria( "aria-valuemin", min );
			this.setAria( "aria-valuemax", max );
			this.setAria( "aria-valuenow", this._value );
		}

		this.setStyleVariable( "--knob-angle", angle + "deg" );
	}

	// no label nor icon: no room under the dial
	private _showLabel( ) {
		this._label.show( !!( this.props.label || this.props.icon ) );
	}

	setLabel( text: string | UnsafeHtml ) {
		this.props.label = text;
		this._label.setText( text );
		this._showLabel( );
	}

	setIcon( icon: string ) {
		this.props.icon = icon;
		this._label.setIcon( icon );
		this._showLabel( );
	}

	setMin( min: number ) {
		this.props.min = min;
		this._value = this._fix( this._value );
		this._update( );
	}

	setMax( max: number ) {
		this.props.max = max;
		this._value = this._fix( this._value );
		this._update( );
	}

	setValue( v: number ) {
		this._set( this._fix( v ), false );
	}

	getValue( ) {
		return this._value;
	}

	override queryInterface<T extends IComponentInterface>( name: string ): T {
		if( name=="form-element" ) {
			const i: IFormElement = {
				getRawValue: ( ) => this.getValue( ),
				setRawValue: ( v: any ) => { this.setValue( +v ); },
				isValid: ( ) => true,
			};

			return i as unknown as T;
		}

		return super.queryInterface( name );
	}
}
