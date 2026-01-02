/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file keyboard.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component } from '../../core/component';
import { Box, BoxProps, Button, HBox, VBox } from '../components';
import { _tr } from '../../core/core_i18n';

import "./keyboard.module.scss"
import { class_ns } from '../../core/core_tools';
import { Application } from '../../core/core_application';

import icon_bksp from "./delete-left.svg";
import icon_shift from "./arrow-up.svg";
import icon_hide from "./eye-slash.svg";



const kb_def: any = {
    'fr-FR': {
        lines: {
            lower: [
                "1 2 3 4 5 6 7 8 9 0",
                "a z e r t y u i o p {2}",
                "q s d f g h j k l m {3}",
                "{4} w x c v b n , . {4}",
                "{5} {6} ' {7}"
            ],
            upper: [
                "! @ # $ % ^ & * ( ) _ +",
                "A Z E R T Y U I O P {2}",
                "Q S D F G H J K L M {3}",
                "{4} W X C V B N ? : {4}",
                "{5} {6} ' {7}",
            ],
            number: [
				"1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 . {3} {9}"
            ],
            date: [
				"1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 / {3} {9}"
            ]
        }
    },
    'en-GB': {
        lines: {
            lower: [
                "1 2 3 4 5 6 7 8 9 0",
                "a z e r t y u i o p {2}",
                "q s d f g h j k l m {3}",
                "{4} w x c v b n , . {4}",
                "{5} {6} ' {7}"
            ],
            upper: [
                "! @ # $ % ^ & * ( ) _ +",
                "A Z E R T Y U I O P {2}",
                "Q S D F G H J K L M {3}",
                "{4} W X C V B N ? : {4}",
                "{5} {6} ' {7}",
            ],
            number: [
                "1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 . {3} {9}"
            ],
			date: [
				"1 2 3 {2}",
				"4 5 6 {8}",
				"7 8 9 {9}",
				"0 / {3} {9}"
            ]
        }
    },
    'en-US': 'en-GB'
}


const RE_sel = /text|password|search|tel|url/i;

interface KeyboardProps extends BoxProps {

}

@class_ns( "x4" )
export class Keyboard extends HBox<KeyboardProps>
{
	mode: "lower" | "upper" | "number" | "date";
	locale: string;
	keyboard: Box;
	visible: boolean;
	input: HTMLInputElement;
		
    constructor( props: KeyboardProps )  {
        super( { ...props, id: 'v-keyboard' } );

        this.mode   = 'lower';
        this.locale = 'fr-FR';
		this.visible = false;
        
        document.addEventListener( 'focusin', (e) => this.handleFocus(e.target as Element,true), false );
        document.addEventListener( 'focusout', (e) => this.handleFocus(e.target as Element,false), false );

		this.hide( );

		this.addDOMEvent( "mousedown", (e) => {
			this.handleKeyEvent( e ); 	
			e.preventDefault( );
			e.stopPropagation( );
		});

		// for rapid people
		this.addDOMEvent( "dblclick", (e) => {
			this.handleKeyEvent( e ); 	
			e.preventDefault( );
			e.stopPropagation( );
		});

		// for slow people
		this.addDOMEvent( "contextmenu", (e) => {
			e.preventDefault( );
			e.stopPropagation( );
		});
    }

	setZoom( perc: number ) {
		this.setStyleVariable( '--keyboard-zoom', perc+'%' );
	}

	/**
	 * 
	 */

    private handleKeyEvent( e: UIEvent ) {
        let target = e.target as HTMLElement;
        let key;

        while( target!==this.dom ) {
            if( target.hasAttribute('data-key') ) {
                key = parseInt(target.getAttribute('data-key'), 10);
                break;
            }

            target = target.parentNode as HTMLElement;
        }

		if( !key ) {
			return;
		}

		this._handleKey( key );
	}

	private _handleKey( key: number ) {
        switch( key ) {
            // bk space
            case 2: {
                this.fireKey( 0, this._backspace );
                break;
            }

            // return
            case 3: {
                this._focusNext( );
                break;
            }

            // shift
            case 4: {
                if( this.mode=='lower' ) {
                    this.mode = 'upper';
                }
                else {
                    this.mode = 'lower';
                }

                this._redraw( );
                break;                
            }

            // num + sym
            case 5: {
                this._switchMode( "number" );
                break;                
            }

            // space
            case 6: {
                this.fireKey( 32, this._insertChar );
                break;
            }

            // hide
            case 7: {
                this.hide( );
                break;
            }

            case 8: {
                this._switchMode( "lower" );
                break;
            }

            default: {
                this.fireKey( key, this._insertChar );
                break;
            }
        }
    }

	/**
	 * 
	 */

    private _focusNext( ) {
        Application.instance().focusNext( true );
    }

	/**
	 * 
	 */

	private _switchMode( m: "lower" | "upper" | "number" | "date" ) {
		this.mode = m;
		this._redraw( );
	}

	/**
	 * 
	 */

    private _redraw( ) {
		this.setContent( [
			this.keyboard = new VBox( {
				id: "kb",
				cls: this.mode,
				content: this._createContent( ),
			}),
        ] );
    }

    private _scrollIntoView( el: HTMLElement ) {
        
        let parent = el.parentElement ;

        while( parent!=document.body ) {
            
            if( parent.style.overflowY!=='' ) {
                let targ  = el.getBoundingClientRect( );
                let bound = parent.getBoundingClientRect( );

                if( targ.top<bound.top ) {
                    el.scrollIntoView( true );
                }
                else if( targ.bottom>bound.bottom ) {
                    el.scrollIntoView( false );
                }
                break;
            }

            parent = parent.parentElement;
        }
        
        //el.scrollIntoView( false );
    }

    private _updateVis = ( ) => {
        
        if( this.visible ) {
            if( this.input ) {
				const type = this.input.type;

                if( type=='check' || type=="radio" ) {
                    this.hide( );
                    this.input = null;        
                }
                else {
                    this.show( );
                    this._scrollIntoView( this.input );

                    const dtype = this.input.getAttribute( "data-type" );

                    if( type==='number' || dtype==='number' ) {
                        this._switchMode( "number" )
                    }
                    else if( type==='date' || dtype==='date' ) {
                        this._switchMode( "date");
                    }
                    else {
                        this._switchMode( "lower" );
                    }
                }
            }
        }
        else {
            this.hide( );
            this.input = null;
        }
	}
	
	/**
	 * 
	 */

	showOn( el: Component ) {
		this.handleFocus( el.dom, true );
	}

	/**
	 * 
	 */

    private handleFocus( target: Element, enter: boolean ) {
		
        if( enter ) {
            if( target.tagName=='INPUT' ) {
				const input = target as HTMLInputElement;
				if( !input.readOnly && 
					input.type!='checkbox' && input.type!='radio' && 
					input.type!='range' && input.type!='file' ) {
					this.input = input;
					this.visible = true;
					this.setTimeout( "vis", 200, this._updateVis );
					return;
				}
            }
		}
		
        this.visible = false;
        this.setTimeout( "vis", 200, this._updateVis );
    }

	/**
	 * 
	 */

    private _insertChar(caret: any, text: string, ch: string ) {
        text = text.substring(0, caret.start) + ch.toString() + text.substring(caret.end);
        caret.start += ch.length;
        caret.end = caret.start;
        return text;
    }

    /**
	 * 
	 */

    private _backspace(caret: any, text: string ) {
        text = text.substring(0, caret.start - 1) + text.substring(caret.start);
        caret.start -= 1;
        caret.end = caret.start;
        return text;
    }
    
    /**
	 * 
	 */

    private _getCaret( ) {
        
        if( this.input && RE_sel.test(this.input.type) ) { 
            let pos = {
                start: this.input.selectionStart || 0,
                end: this.input.selectionEnd || 0
            };

            if (pos.end < pos.start) {
				pos.end = pos.start;
			}

            return pos;
        }
        else {
            let length = this.input.value.length;
            return  {
                start: length,
                end: length
            };
        }
    }

    /**
	 * 
	 */

    private _restoreCaretPos( caret: any ) {
        if( RE_sel.test(this.input.type) ) {
            this.input.selectionStart = caret.start;
            this.input.selectionEnd = caret.end;
        }
    }

    /**
	 * 
	 */

    private fireKey( key: number, cb: Function ) {
        let caret = this._getCaret( );
        let text  = this.input.value;
        text = cb.call( this, caret, text, String.fromCharCode(key) );
        this.input.value = text;
        this._restoreCaretPos(caret);
    }

    /**
	 * 
	 */

    private _createContent( ) {
        let     lines = kb_def[this.locale].lines[this.mode];
        let     result: Box[] = [];
        
		for( let j=0; j<lines.length; j++ ) {
        
          	const line = lines[j].split(' ');
            
            let tl: Component[] = [];

            for( let i=0; i<line.length; i++ ) {

                let cls = 'tch c'+i;
                let content = line[i];
                let key;
				let icon = null;
				let repeat = false;

                if( content.length>2 && content[0]=='{' && content[content.length-1]=='}') {
                    
                    let c = parseInt(content.substring(1, content.length - 1), 10 );
					
                    switch( c ) {
						default:
						case 0: 
						{
							content = '';       
							cls += ' x4hidden';
							break;
						}

						case 1: 
						{
							content = '';       
							break;
						}

						case 2:
						{
							repeat = true;
							content = undefined;
							icon = icon_bksp;
							cls += ' cdel'; 
							break;
						}

						case 3:
						{
							content = _tr.global.keyboard.next;       
							cls += ' cret';
							break;
						}

						case 4:
						{
							content = undefined;
							icon = icon_shift;
							cls += ' cshift';
							break;
						}

						case 5:
						{
							content = _tr.global.keyboard.numeric;    
							cls += ' cnum';
							break;
						}

						case 6: 
						{
							content = '\u00a0';       
							cls += ' cspace';
							break;
						}

						case 7:
						{
							content = undefined;
							icon = icon_hide;
							cls += ' chide'; 
							break;
						}

						case 8: 
						{
							content = _tr.global.keyboard.alpha;    
							cls += ' calpha'; 
							break;
						}

						case 9: 
						{
							content = '';       
							cls += ' cplace'; 
							break;
						}
                    }

                    key = c;
                }
                else {
                    key = line[i].charCodeAt(0);
                }

                let el = new Button( { 
					cls, 
					label: content, 
					attrs: {'data-key': key}, 
					icon, 
					autorepeat: repeat, 
					click: ( e ) => {
						if( e.repeat ) {
							this._handleKey( key )
						}
					}
				} );
                tl.push( el );
            }

            result.push( new HBox( { cls: 'line', content: tl } ) );
        }

        return result;
    }
}