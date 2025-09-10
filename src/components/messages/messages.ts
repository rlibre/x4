
// :: MESSAGEBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { _tr } from '../../core/core_i18n';
import { asap, class_ns, UnsafeHtml } from '../../core/core_tools';

import { HBox, VBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { Label } from '../label/label';
import { Dialog, DialogProps } from "../dialog/dialog"
import { Form } from '../form/form';
import { BtnGroupItem } from '../btngroup/btngroup';
import { Input } from '../input/input';

import "./messages.module.scss";

import error_icon from "./circle-exclamation.svg";
import pen_icon from "./pen-field.svg";
import { Component } from '../../core/component';

export interface MessageBoxProps extends DialogProps {
	message: string;
	click: (button: string) => void;
}

/**
 * 
 */

@class_ns( "x4" )
export class MessageBox extends Dialog<DialogProps>
{
	constructor(props: DialogProps) {
		super(props);
	}

	/**
	 * 
	 */

	private static _create( msg: string | UnsafeHtml, buttons?: BtnGroupItem[], title?: string ) {
		const box = new MessageBox({ 
			modal: true,
			title: title ?? _tr.global.error,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: error_icon }),
							new Label( { text: msg } ),
						]
					}),
				]
			}),
			buttons: buttons ?? [ "ok.outline","cancel.outline" ]
		});

		return box;
	}

	/**
	 * display a messagebox
	 */

	static show( msg: string | UnsafeHtml, buttons?: BtnGroupItem[], title?: string ): MessageBox {

		const box = this._create( msg, buttons, title );
		box.on( "btnclick", ( ev ) => {
			asap( ( ) => {
				box.close() 
			});
		});

		box.show();
		return box;
	}

	/**
	 * idem with promise
	 */

	static async showAsync( msg: string | UnsafeHtml, buttons?: BtnGroupItem[], title?: string ) : Promise<string> {

		return new Promise( (resolve, reject ) => {
			const box = this._create( msg, buttons, title );
			box.on( "btnclick", ( ev ) => {
				asap( ( ) => {
					resolve( ev.button );
					box.close() 
				});
			});

			box.show();
		} );

	}
}


@class_ns( "x4" )
export class InputBox extends Dialog<DialogProps>
{
	constructor(props: DialogProps) {
		super(props);
	}

	getValue( ) {
		const input = this.query<Input>( "input" );
		return input.getValue( );
	}

	private static _create( msg: string | UnsafeHtml, value: string, title: string ) {
		const box = new InputBox({ 
			modal: true,
			title,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: pen_icon }),
							new VBox( { flex: 1, content: [
								new Label( { text: msg } ),
								new Input( { value, type: "text" } )
							]})
						]
					}),
				]
			}),
			buttons: [ "ok.outline.default","cancel.outline" ]
		});
	
		return box;
	}

	/**
	 * idem with promise
	 */

	static async showAsync( msg: string | UnsafeHtml, value: string, title?: string ) : Promise<string> {

		return new Promise( (resolve, reject ) => {

			const box = this._create( msg, value, title );
		
			box.on( "btnclick", ( ev ) => {
				asap( ( ) => {
					resolve( ev.button=="ok" ? box.getValue( ) : null );
					box.close() 
				});
			});

			box.show();
		} );

	}
}



@class_ns( "x4" )
export class PromptBox extends Dialog<DialogProps>
{
	constructor(props: DialogProps) {
		super(props);
	}

	private static _create( msg: string | UnsafeHtml, editor: Component, title: string ) {
		const box = new PromptBox({ 
			modal: true,
			title,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: pen_icon }),
							new VBox( { flex: 1, cls: "right", content: [
								new Label( { text: msg } ),
								editor
							]})
						]
					}),
				]
			}),
			buttons: [ "ok.outline.default","cancel.outline" ]
		});
	
		return box;
	}

	/**
	 * idem with promise
	 */

	static async showAsync( msg: string | UnsafeHtml, editor: Component, title?: string ) : Promise<string> {

		return new Promise( (resolve ) => {

			const box = this._create( msg, editor, title );
		
			box.on( "btnclick", ( ev ) => {
				asap( ( ) => {
					resolve( ev.button );
					box.close() 
				});
			});

			box.show();
		} );
	}

	static show(  msg: string | UnsafeHtml, editor: Component, title: string, callback: ( btn: string ) => boolean ) {

		const box = this._create( msg, editor, title );
	
		box.on( "btnclick", ( ev ) => {
			asap( ( ) => {
				if( callback( ev.button )!==false ) {
					box.close() 
				}
			});
		});

		box.show();
	}
}

