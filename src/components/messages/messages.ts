
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
import { SimpleTextArea } from '../textarea/textarea';
import { Button } from '../button/button';
import { Component } from '../../core/component';
import { Progress } from '../components.js';

import "./messages.module.scss";

import error_icon from "./circle-exclamation.svg";
import question_icon from "./circle-question.svg";

import pen_icon from "./pen-field.svg";
import spinner from "./spinner.svg"

export interface MessageBoxProps extends DialogProps {
	message: string;
	click: (button: string) => void;
}

/**
 * 
 * @cssvar
 * ```
 * --msgbox-caption-background
 * --msgbox-caption-color
 * --msgbox-icon-color
 * --msgbox-question-icon-color
 * --msgbox-log-background
 * ```
 * --msgbox-caption-* and --msgbox-icon-color are the ones of an error; a question, an InputBox
 * and a PromptBox have the title bar of a Dialog and their icon in --msgbox-question-icon-color
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

	private static _create( msg: string | UnsafeHtml, buttons: BtnGroupItem[], title: string, icon_type: "error" | "question" ) {

		let icon = error_icon;
		switch( icon_type ) {
			case "question": {
				icon = question_icon;
				break;
			}
		}

		// the kind as a class: an error has its own title bar
		const box = new MessageBox({
			cls: icon_type ?? "error",
			modal: true,
			title: title ?? _tr.global.error,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: icon }),
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

	static show( msg: string | UnsafeHtml, buttons?: BtnGroupItem[], title?: string, icon_type?: "error" | "question" ): MessageBox {

		const box = this._create( msg, buttons, title, icon_type );
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

	static async showAsync( msg: string | UnsafeHtml, buttons?: BtnGroupItem[], title?: string, icon_type?: "error" | "question" ) : Promise<string> {

		return new Promise( (resolve, reject ) => {
			const box = this._create( msg, buttons, title, icon_type );
			box.on( "btnclick", ( ev ) => {
				asap( ( ) => {
					resolve( ev.button );
					box.close()
				});
			});

			// closed without a button (Escape, the close box): nothing was chosen
			box.on( "closed", ( ) => resolve( null ) );

			box.show();
		} );

	}
}

// :: INPUT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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

			// closed without a button (Escape, the close box): nothing was chosen
			box.on( "closed", ( ) => resolve( null ) );

			box.show();
		} );

	}
}


// :: PROMPT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


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

			// closed without a button (Escape, the close box): nothing was chosen
			box.on( "closed", ( ) => resolve( null ) );

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


// :: PROGRESS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * a modal box that follows a long task: a title, a bar, and the lines of what is done
 * in a textarea read only (they are text: a markup is shown as it is written).
 * done( ) shows its button OK: after an error it waits for it, else it closes the box
 * after 5s, the seconds left in the button.
 */

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
								new SimpleTextArea( { id: "sub-text", readonly: true, trim: false } ),
							]})
						]
					}),
				]
			}),
			buttons: [ "ok.outline.default" ]
		});

		this.query("#btnbar").show( false );

		// OK: closed at once, the countdown stopped
		this.on("btnclick", ( ) => {
			this.clearInterval( "close" );
			this.show( false );
		} );
	}

	/** a line at the end */

	addText( text: string | UnsafeHtml, perc: number ) {
		this._addLine( text );
		this.query<Progress>( "#prog").setValue( perc );
	}

	/** a line at the end: done( ) then waits for the button OK */

	addError( text: string | UnsafeHtml, perc: number ) {
		this._addLine( text );
		this.query<Progress>( "#prog").setValue( perc );

		this.#has_errors = true;
	}

	/** the text in place of all the lines */

	setText( text: string | UnsafeHtml, perc: number ) {
		this.query<SimpleTextArea>( "#sub-text" ).setText( text.toString( ) );
		this.query<Progress>( "#prog").setValue( perc );
	}

	/** as at the start: no line, no error, no button OK */

	clear( ) {
		this.#has_errors = false;
		this.clearInterval( "close" );
		this.query( "#btnbar" ).show( false );
		this.query<SimpleTextArea>( "#sub-text" ).setText( "" );
	}

	// the line after the others, the last one shown
	private _addLine( text: string | UnsafeHtml ) {
		const log = this.query<SimpleTextArea>( "#sub-text" );
		const lines = log.getText( );

		log.setText( lines ? lines + "\n" + text : text.toString( ) );
		log.scrollToBottom( );
	}

	/**
	 * the task is over: the button OK is shown. After an error it waits for a click;
	 * without one it counts the seconds left, "OK (5s)", and closes the box at 0
	 */

	done( ) {
		const ok = this.query<Button>( "#ok" );
		this.query( "#btnbar" ).show( true );

		if( this.#has_errors ) {
			ok.setText( _tr.global.ok );
			return;
		}

		let left = 5;
		ok.setText( `${_tr.global.ok} (${left}s)` );

		this.setInterval( "close", 1000, ( ) => {
			left--;
			if( left>0 ) {
				ok.setText( `${_tr.global.ok} (${left}s)` );
			}
			else {
				this.clearInterval( "close" );
				this.show( false );
			}
		} );
	}
}