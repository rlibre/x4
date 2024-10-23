/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file filedrop.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component, ComponentEvents, ComponentProps } from '../../core/component';
import { _tr } from '../../core/core_i18n';
import { dragManager } from '../../core/core_dragdrop';
import { CoreEvent, EventCallback } from '../../core/core_events';
import { class_ns, UnsafeHtml } from '../../core/core_tools';

import { VBox } from '../boxes/boxes';
import { SimpleText } from '../label/label';
import { Icon } from '../icon/icon';

import icon_drop from "./cloud-arrow-up.svg"
import "./filedrop.module.scss"

type LoadCallback = ( files: FileList ) => void;


interface FileDialogProps extends ComponentProps {
	accept: string;	// "image/*"
	multiple?: boolean;
	callback: LoadCallback;
}

export class FileDialog extends Component {

	constructor( props: FileDialogProps ) {
		
		super( { 
			tag: "input",
			style: { 
				display: "none" 
			},
			attrs: {
				type: "file",
				multiple: props.multiple ?? false,
				accept: props.accept,
			},
			dom_events: {
				change: ( ) => {
					const files = (this.dom as HTMLInputElement).files;
					props.callback( files );
				}
			}
		} );
	}

	showDialog( ) {
		(this.dom as HTMLInputElement).click( );
	}
}



// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

interface EvDropChange extends CoreEvent {
	files: FileList;
}

interface FileDropEvents extends ComponentEvents {
	change: EvDropChange;
}

interface FileDropProps extends ComponentProps {
	label?: string | UnsafeHtml;
	icon?: string;

	accept: string;	// ex: 'image/*'
	change: EventCallback<EvDropChange>;
}

/**
 * 
 */

@class_ns( "x4" )
export class FileDrop extends VBox<FileDropProps,FileDropEvents> {

	constructor( props: FileDropProps ) {
		super( props );

		this.mapPropEvents( props, "change" );

		let fileDialog = new FileDialog( {
			accept: props.accept,
			callback: ( files ) => {
				this.fire( "change", { files } );
			},
		});

		this.setContent( [
			fileDialog,
			new Icon( { iconId: props.icon ?? icon_drop } ),
			new SimpleText( { text: props.label ?? _tr.global.filedrop } ),
		])

		this.addDOMEvent( "click", ( ) => fileDialog.showDialog() );

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
		} );
	}
}