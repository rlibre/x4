/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file image.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { class_ns } from '../../core/core_tools';
import { Component, ComponentEvents, ComponentProps } from '../../core/component';
import { EventCallback, CoreEvent } from '../../core/core_events.js';
import { dragManager } from '../../core/core_dragdrop.js';

import { EvDropChange, FileDialog } from '../filedrop/filedrop';
import { Menu } from '../menu/menu';



import "./image.module.scss"
import { _tr } from '@core/core_i18n.js';


interface ImageEvents extends ComponentEvents {
	change: EvDropChange;
	clear: CoreEvent;
}
export interface ImageProps extends ComponentProps {
	src: string;
	fit?: "contain" | "cover" | "fill" | "scale-down";
	position?: string;
	lazy?: boolean;
	alt?: string;
	draggable?: boolean;

	candrop?: boolean;
	accept?: string;	// ex: 'image/*'

	change?: EventCallback<EvDropChange>;
	clear?: EventCallback<CoreEvent>;
}

/**
 * 
 */

@class_ns( "x4" )
export class Image<P extends ImageProps = ImageProps, E extends ImageEvents = ImageEvents> extends Component<P,E> {

	private _img: Component;

	constructor( props: P ) {
		super( props );

		this._img = new Component( {
			tag: "img",
			attrs: {
				loading: props.lazy,
				alt: props.alt,
				draggable: props.draggable ?? false,
			},
			style: {
				width: "100%",
				height: "100%",
				objectFit: props.fit,
				objectPosition: props.position,
			}
		})
		
		this.setContent( this._img );
		this.setImage( props.src );

		if( props.candrop ) {
			this.mapPropEvents( props, "change", "clear" );

			let fileDialog = new FileDialog( {
				accept: props.accept,
				multiple: false,
				callback: ( files ) => {
					this.fire( "change", { files } );
				},
			});

			this.appendContent( fileDialog );

			this.addDOMEvent( "click", ( ) => fileDialog.showDialog() );

			const filterInput = ( _: Component, data: DataTransfer ) => {
				// check that input is of type image
				if( data.items?.length ) {
					const type = data.items[0].type;
					if( /image\/.*/.test(type) ) {
						return true;
					}
				}	

				return false;
			}

			dragManager.registerDropTarget( this, async ( cmd, el, infos ) => {
				if( cmd=="enter" ) {
					this.addClass( "hit" );
				}
				else if( cmd=='leave' ) {
					this.removeClass( "hit" );
				}
				else if( cmd=='drop' ) {
					if( infos.data.files && infos.data.files.length>0 ) {
						const files = infos.data.files;
						this.fire( "change", { files } );
					}
				}
			}, filterInput );

			this.addDOMEvent( "contextmenu", ( ev ) => {
				const menu = new Menu( {
					items: [
						{ text: _tr.global.cut, click: ( ) => {
							this.fire( "clear", {} );
						} },
					]
				});

				menu.displayAt( ev.pageX, ev.pageY );
				ev.stopPropagation( );
				ev.preventDefault( );
			});
		}
	}

	/**
	 * 
	 */
	
	setImage( src: string ) {
		if( src ) {
			this._img.setAttribute( "src", src );
		}
		else {
			this.clear( );
		}
	}

	/**
	 * 
	 */

	clear( ) {
		this._img.setAttribute( "src", 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' );
	}
}


