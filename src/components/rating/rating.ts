/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file rating.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { HBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { class_ns, IComponentInterface, IFormElement } from '../../core/core_tools';

import icons from "../assets/icons"

import "./rating.module.scss"

interface RatingEventMap extends ComponentEvents {
	change: EvChange;
}



export interface RatingProps extends ComponentProps {
	steps?: number;
	value?: number;
	icon?: string;
	name?: string; 

	change?: EventCallback<EvChange>;
}

/**
 * 
 * @cssvar
 * ```
 * --rating
 * --rating-hover
 * --rating-checked
 * ```
 */

@class_ns( "x4" )
export class Rating extends HBox<RatingProps,RatingEventMap> {

	private m_els: Component[];

	constructor( props: RatingProps ) {
		super( props );

		// this.props: a copy of props (Box adds its tag)
		this.props.steps = this.props.steps ?? 5;

		// the name is on the rating: a Form finds it, and reads its value as a number (queryInterface)
		if( props.name ) {
			this.setAttribute( "name", props.name );
		}

		this.addDOMEvent( 'click', (e) => this._on_click(e) );
		this._update( );
	}

	// value: the count of stars that are lit, 0 for none
	private _update( ) {
		const props = this.props;
		const shape = props.icon ?? icons.star.solid;
		const value = props.value ?? 0;

		this.m_els = [];
		for( let i=0; i<props.steps; i++ ) {
			this.m_els.push( new Icon( { cls: i < value ? 'item checked' : 'item', iconId: shape } ) );
		}

		this.setContent( this.m_els );
	}

	getValue( ) {
		return this.props.value ?? 0;
	}

	setValue( v: number ) {
		this.props.value = v;
		this.m_els.forEach( ( c, i ) => c.setClass( 'checked', i < v ) );
	}

	setSteps( n: number ) {
		this.props.steps = n;
		this._update( );
	}

	setShape( icon: string ) {
		this.props.icon = icon;
		this._update( );
	}

	// the star clicked: its svg, or the Icon itself
	private _on_click( ev: MouseEvent ) {
		const n = this.m_els.findIndex( c => c.dom.contains( ev.target as Node ) );
		if( n>=0 ) {
			this.setValue( n+1 );
			this.fire( 'change', { value: this.props.value } );
		}
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
