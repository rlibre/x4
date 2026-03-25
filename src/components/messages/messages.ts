
// :: MESSAGEBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { _tr } from '../../core/core_i18n';
import { asap, class_ns, unsafeHtml, UnsafeHtml } from '../../core/core_tools';

import { HBox, VBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { Label, SimpleText } from '../label/label';
import { Dialog, DialogProps } from "../dialog/dialog"
import { Form } from '../form/form';
import { BtnGroupItem } from '../btngroup/btngroup';
import { Input } from '../input/input';
import { Component } from '../../core/component';
import { Progress } from '../components.js';

import "./messages.module.scss";

import error_icon from "./circle-exclamation.svg";
import pen_icon from "./pen-field.svg";
import spinner from "./spinner.svg"

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


interface InputOptions {
	password?: boolean;
	trim?: boolean;
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

	private static _create( msg: string | UnsafeHtml, value: string, title: string, options?: InputOptions ) {

		options = {trim: true, password: false, ...options };

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
								new Input( { value, type: options.password ? "password" : "text", trim: options.trim } )
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

	static async showAsync( msg: string | UnsafeHtml, value: string, title?: string, options?: InputOptions ) : Promise<string> {

		return new Promise( (resolve, _reject ) => {

			const box = this._create( msg, value, title, options );
		
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

	static show(  msg: string | UnsafeHtml, editor: Component, title: string, callback: ( btn: string ) => boolean | Promise<boolean> | Promise<void> ) {

		const box = this._create( msg, editor, title );
	
		box.on( "btnclick", ( ev ) => {
			asap( async ( ) => {
				if( await callback( ev.button )!==false ) {
					box.close() 
				}
			});
		});

		box.show();
	}
}

@class_ns( "x4" )
export class ProgressionBox  extends Dialog {

	#has_errors = false;

	constructor( title: string ) {
		super( { 
			modal: true,
			title: null,
			sizable: true,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: spinner }),
							new VBox( { flex: 1, cls: "right", content: [
								new SimpleText( { id: "title", text: title } ),
								new Progress( { id:"prog", min: 0, max: 100, value: 0 } ),
								new VBox( { id: "sub-text" } ),
							]})
						]
					}),
				]
			}),
			buttons: [ "ok.outline.default" ]
		});

		this.query("#btnbar").show( false );

		this.on("btnclick", ( ) => this.show( false ) );
	}

	addText( text: string | UnsafeHtml, perc: number ) {
		this.query<Label>( "#sub-text").appendContent( new SimpleText( { text } ) );
		this.query<Progress>( "#prog").setValue( perc );
	}

	addError( text: string | UnsafeHtml, perc: number ) {
		this.query<Label>( "#sub-text").appendContent( new SimpleText( { cls:"error", text } ) );
		this.query<Progress>( "#prog").setValue( perc );

		this.#has_errors = true;
	}

	setText( text: string | UnsafeHtml, perc: number ) {
		this.query<Label>( "#sub-text").setContent( new SimpleText( { text } ) );
		this.query<Progress>( "#prog").setValue( perc );
	}

	clear( ) {
		this.#has_errors = true;
		this.query<Label>( "#sub-text").clearContent( );
	}

	done( ) {
		if( this.#has_errors ) {
			this.query("#btnbar").show( true );
		}
		else {
			this.setTimeout( "close", 5000, ( ) => { this.show(false);} );
		}
	}
}