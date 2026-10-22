
// :: MESSAGEBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { _tr } from '../../core/core_i18n';
import { asap, class_ns, sprintf, unsafeHtml, UnsafeHtml } from '../../core/core_tools';

import { HBox, VBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { Label, SimpleText } from '../label/label';
import { Dialog, DialogProps } from "../dialog/dialog"
import { Form } from '../form/form';
import { BtnGroupItem } from '../btngroup/btngroup';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { Component } from '../../core/component';
import { Progress } from '../components.js';
import icons from '../assets/icons';

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
 * --msgbox-log-border
 * --msgbox-log-border-focus
 * --msgbox-log-error-color
 * --msgbox-log-error-background
 * --msgbox-log-warning-color
 * --msgbox-log-warning-background
 * --msgbox-log-scrollbar
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
 * in a <pre>, in a fixed font, a <div> each: a string is text, an UnsafeHtml is html. An
 * error, a warning are coloured on all their width, a bar on their left. addSection puts
 * the lines that follow in a section that folds. Ctrl+A selects the lines.
 * done( ) shows its button OK: after an error or a warning it waits for it, their counts
 * on the left of the bar; else it closes the box after 5s, the seconds left in the button.
 */

@class_ns( "x4" )
export class ProgressionBox  extends Dialog {

	// an error or a warning: done( ) waits for OK
	private _errors = 0;
	private _warnings = 0;

	private _section: Component;		// the last section (a <details>): the lines go in it

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
								new Component( { tag: "pre", id: "sub-text", attrs: { tabindex: 0 }, dom_events: {
									keydown: ( ev ) => this._on_log_key( ev ),
								} } ),
							]})
						]
					}),
				]
			}),
			buttons: [ new Label( { id: "alerts", text: "" } ), "-", "ok.outline.default" ]
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

	/** a line at the end, with the icon of an error: done( ) then waits for the button OK */

	addError( text: string | UnsafeHtml, perc: number ) {
		this._addLine( text, "error" );
		this.query<Progress>( "#prog").setValue( perc );
		this.addClass( "error" );		// the title bar in red, as the one of an error of MessageBox

		this._errors++;
	}

	/** a line at the end, with the icon of a warning: done( ) then waits for the button OK */

	addWarning( text: string | UnsafeHtml, perc: number ) {
		this._addLine( text, "warning" );
		this.query<Progress>( "#prog").setValue( perc );

		this._warnings++;
	}

	/**
	 * a section at the end, open: the lines that follow go in it. A click on its title folds
	 * it; its title has the icon of the worst of its lines (an error, a warning)
	 */

	addSection( title: string | UnsafeHtml, perc: number ) {
		const summary = new Component( { tag: "summary", content: new Component( { tag: "span", cls: "alert" } ) } );
		summary.appendContent( title );

		this._section = new Component( { tag: "details", attrs: { open: true }, content: summary } );

		const log = this.query( "#sub-text" );
		log.appendContent( this._section );
		log.dom.scrollTop = log.dom.scrollHeight;
		this.query<Progress>( "#prog").setValue( perc );
	}

	/** the text in place of all the lines */

	setText( text: string | UnsafeHtml, perc: number ) {
		this._section = null;
		this.query( "#sub-text" ).setContent( text );
		this.query<Progress>( "#prog").setValue( perc );
	}

	/** as at the start: no line, no error, no button OK */

	clear( ) {
		this._errors = 0;
		this._warnings = 0;
		this.clearInterval( "close" );
		this.query( "#btnbar" ).show( false );
		this.removeClass( "error" );
		this.query<Label>( "#alerts" ).setText( "" );
		this.query<Label>( "#alerts" ).setIcon( null );
		this._section = null;
		this.query( "#sub-text" ).clearContent( );
	}

	// the line after the others (in the last section), the last one shown: a <div>, of the
	// class of its kind for an error, a warning
	private _addLine( text: string | UnsafeHtml, kind?: "error" | "warning" ) {
		const log = this.query( "#sub-text" );
		const target = this._section ?? log;

		target.appendContent( new Component( { cls: kind ? "line " + kind : "line", content: text } ) );

		// the title of the section: the icon of the worst, in its colour
		const alert = this._section?.query( ".alert" );
		if( kind && alert && !alert.hasClass( "error" ) ) {
			alert.setClass( "warning", kind=="warning" );
			alert.setClass( "error", kind=="error" );
			alert.setContent( unsafeHtml( kind=="error" ? icons.danger : icons.warning ) );
		}

		log.dom.scrollTop = log.dom.scrollHeight;
	}

	// Ctrl+A: the lines only, not the whole page
	private _on_log_key( ev: KeyboardEvent ) {
		if( ( ev.ctrlKey || ev.metaKey ) && ev.key.toLowerCase( )=="a" ) {
			document.getSelection( ).selectAllChildren( ev.currentTarget as HTMLElement );
			ev.preventDefault( );
		}
	}

	/**
	 * the task is over: the button OK is shown. After an error or a warning it waits for
	 * a click, their counts on the left of the bar ("2 errors / 1 warning"); without one it counts the
	 * seconds left, "OK (5s)", and closes the box at 0
	 */

	done( ) {
		const ok = this.query<Button>( "#ok" );
		this.query( "#btnbar" ).show( true );

		if( this._errors || this._warnings ) {
			const tr = _tr.global.progression;
			const counts = [];
			if( this._errors ) {
				counts.push( sprintf( this._errors>1 ? tr.errors : tr.error, this._errors ) );
			}
			if( this._warnings ) {
				counts.push( sprintf( this._warnings>1 ? tr.warnings : tr.warning, this._warnings ) );
			}

			// on the left, the icon of the worst
			const alerts = this.query<Label>( "#alerts" );
			alerts.setText( counts.join( " / " ) );
			alerts.setIcon( this._errors ? icons.danger : icons.warning );
			alerts.setClass( "error", this._errors>0 );
			alerts.setClass( "warning", this._errors==0 );

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