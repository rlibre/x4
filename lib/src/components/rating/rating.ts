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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, componentFromDOM, ComponentProps, EvChange } from '../../core/component';
import { EventCallback } from '../../core/core_events';
import { HBox } from '../boxes/boxes';
import { Input } from '../input/input';
import { Icon } from '../icon/icon';

import "./rating.module.scss"
import star_icon from "./star-sharp-solid.svg"
import { class_ns } from '../../core/core_tools';

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
 */

@class_ns( "x4" )
export class Rating extends HBox<RatingProps,RatingEventMap> {

	private m_els: Component[];
	private m_input: Input;
	
	constructor( props: RatingProps ) {
		super( props );

		props.steps = props.steps ?? 5;
		this._update( );
	}

	private _update( ) {
		
		const props = this.props;

		let shape = props.icon ?? star_icon;
		let value = props.value ?? 0;

		this.m_input = new Input( {
			type: "text",
			hidden: true,
			name: props.name,
			value: ''+value
		} );

		this.addDOMEvent( 'click', (e) => this._on_click(e) );

		this.m_els = [];
		for( let i=0; i<props.steps; i++ ) {
			
			let cls = 'item';
			if( i+1 <= value ) {
				cls += ' checked';
			}

			let c = new Icon( { 
				cls,
				iconId: shape,
			} );

			c.setInternalData( "value", i );

			this.m_els.push( c );
		}

		this.m_els.push( this.m_input );
		this.setContent( this.m_els );
	}

	getValue( ) {
		return this.props.value ?? 0;
	}

	setValue( v: number ) {
		this.props.value = v;

		for( let c=0; c<this.props.steps; c++ ) {
			this.m_els[c].setClass( 'checked', this.m_els[c].getInternalData('value')<=v );
		}

		this.m_input.setValue( ''+this.props.value );
	}

	setSteps( n: number ) {
		this.props.steps = n;
		this._update( );
	}

	setShape( icon: string ) {
		this.removeClass( this.props.icon );
		this.props.icon = icon;
	}

	private _on_click( ev: MouseEvent ) {
		let item = componentFromDOM( ev.target as HTMLElement );
		item = item.parentElement( Icon );
		
		if( item ) {
			this.setValue( item.getInternalData("value") );
		}

		this.fire( 'change', {value:this.props.value} );
	} 
}
