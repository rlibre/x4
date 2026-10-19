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
 * @copyright (c) 2026 R-libre ingenierie
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

// shift, digits, letters, accents, signs: these keys draw the keyboard again. They act on the
// click of their button: on the pointerdown they would remove the key under the finger, the
// mousedown that follows would go to a node out of the page, nobody would prevent it and the
// field would lose the focus ( the keyboard hides )
const REDRAW_KEYS = new Set( [ 4, 5, 8, 10, 11 ] );



/**
 * A layout is the place of the 26 letters (its base) and the letters that
 * a language adds to them (its extra), shown on a page of their own,
 * called by a key. The upper case is computed, the digits and the signs
 * are the same for all.
 *
 * base: the countries where it is not QWERTY are those that
 *   https://en.wikipedia.org/wiki/QWERTZ and /AZERTY list.
 * extra: the main letters of the language in the CLDR of Unicode
 *   (cldr-json, cldr-misc-full/main/<lang>/characters.json), without a..z.
 */

type KbBase = "azerty" | "qwerty" | "qwertz";
type KbMode = "alpha" | "accents" | "symbols" | "number" | "date";

interface KbLayout {
	base: KbBase;
	extra: string;
}

const kb_bases: Record<KbBase,string[]> = {
	azerty: [ "a z e r t y u i o p", "q s d f g h j k l m", "w x c v b n" ],
	qwerty: [ "q w e r t y u i o p", "a s d f g h j k l", "z x c v b n m" ],
	qwertz: [ "q w e r t z u i o p", "a s d f g h j k l", "y x c v b n m" ],
};

// by language
const kb_langs: Record<string,KbLayout> = {
	cs: { base: "qwertz", extra: "á č ď é ě í ň ó ř š ť ú ů ý ž" },
	da: { base: "qwerty", extra: "æ ø å" },
	de: { base: "qwertz", extra: "ä ö ü ß" },
	en: { base: "qwerty", extra: "" },
	es: { base: "qwerty", extra: "á é í ñ ó ú ü" },
	et: { base: "qwerty", extra: "õ ä ö ü š ž" },
	fi: { base: "qwerty", extra: "å ä ö š ž" },
	fr: { base: "azerty", extra: "é è ê ë à â æ ç î ï ô œ ù û ü ÿ" },
	ga: { base: "qwerty", extra: "á é í ó ú" },
	hr: { base: "qwertz", extra: "č ć đ š ž" },
	hu: { base: "qwertz", extra: "á é í ó ö ő ú ü ű" },
	it: { base: "qwerty", extra: "à è é ì ò ù" },
	lt: { base: "qwerty", extra: "ą č ę ė į š ų ū ž" },
	lv: { base: "qwerty", extra: "ā č ē ģ ī ķ ļ ņ š ū ž" },
	mt: { base: "qwerty", extra: "à ċ è ġ ħ ì ò ù ż" },
	nl: { base: "qwerty", extra: "á ä é ë í ï ó ö ú ü" },
	pl: { base: "qwerty", extra: "ą ć ę ł ń ó ś ź ż" },
	pt: { base: "qwerty", extra: "á à â ã ç é ê í ó ò ô õ ú" },
	ro: { base: "qwerty", extra: "ă â î ș ț" },
	sk: { base: "qwertz", extra: "á ä č ď é í ĺ ľ ň ó ô ŕ š ť ú ý ž" },
	sl: { base: "qwertz", extra: "č š ž" },
	sv: { base: "qwerty", extra: "å ä ö é à" },
};

// the countries that do not have the keyboard of their language
const kb_countries: Record<string,Partial<KbLayout>> = {
	"de-CH": { extra: "ä ö ü" },		// no ß in Switzerland
	"fr-CH": { base: "qwertz" },
	"it-CH": { base: "qwertz" },
	"fr-LU": { base: "qwertz" },		// the Swiss French keyboard
	"nl-BE": { base: "azerty" },
};

const kb_digits = "1 2 3 4 5 6 7 8 9 0";
const kb_signs = "! @ # $ % ^ & * ( ) _ +";

// the page of the signs, that the letters do not have
const kb_symbols = [
	"- / : ; ( ) € & @ \"",
	"\\ | ~ _ ` § £ $ ^ %",
	"[ ] { } < > = + * #",
];

const kb_pads = {
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
};

const KB_MAX_EXTRA = 12;		// keys on a row of extra letters, as many as there are signs

/**
 * "de-CH", "de_ch", "de": the layout of the country, or else the one of
 * its language. A language that is not known gets a QWERTY.
 */

function findLayout( locale: string ): KbLayout {
	const [lang, country] = locale.replace( "_", "-" ).split( "-" );

	let layout = kb_langs[lang.toLowerCase( )];
	if( !layout ) {
		layout = kb_langs.en;
	}

	if( country ) {
		const own = kb_countries[lang.toLowerCase( ) + "-" + country.toUpperCase( )];
		if( own ) {
			layout = { ...layout, ...own };
		}
	}

	return layout;
}

function upperKeys( line: string ): string {
	return line.split( " " ).map( key => {
		const up = key.toUpperCase( );
		return up.length===1 ? up : key;		// ß has no upper case of one letter
	} ).join( " " );
}

/**
 * the extra letters, on rows of the same length
 */

function extraLines( extra: string ): string[] {
	if( !extra ) {
		return [];
	}

	const keys = extra.split( " " );
	const count = Math.ceil( keys.length / KB_MAX_EXTRA );
	const size = Math.ceil( keys.length / count );

	const lines: string[] = [];
	for( let i=0; i<keys.length; i+=size ) {
		lines.push( keys.slice( i, i+size ).join( " " ) );
	}

	return lines;
}

function letterLines( layout: KbLayout, upper: boolean ): string[] {
	let [l1, l2, l3] = kb_bases[layout.base];

	if( upper ) {
		l1 = upperKeys( l1 );
		l2 = upperKeys( l2 );
		l3 = upperKeys( l3 );
	}

	return [
		upper ? kb_signs : kb_digits,
		l1 + " {2}",
		l2 + " {3}",
		"{4} " + l3 + ( upper ? " ? : {4}" : " , . {4}" ),
		bottomLine( layout, "alpha" ),
	];
}

/**
 * the page called by {10}: the extra letters
 */

function accentLines( layout: KbLayout, upper: boolean ): string[] {
	let extra = extraLines( layout.extra );
	if( upper ) {
		extra = extra.map( upperKeys );
	}

	return [
		...extra,
		"{4} {2} {3}",
		bottomLine( layout, "accents" ),
	];
}

/**
 * the page called by {11}: the signs
 */

function symbolLines( layout: KbLayout ): string[] {
	const [s1, s2, s3] = kb_symbols;

	return [
		s1 + " {2}",
		s2 + " {3}",
		s3,
		bottomLine( layout, "symbols" ),
	];
}

/**
 * the last row of the pages of letters: the key of the page that is shown
 * is replaced by {8} at its place, to come back to the letters.
 * no key of the extra letters when the language has none
 */

function bottomLine( layout: KbLayout, page: "alpha" | "accents" | "symbols" ): string {
	const accents = !layout.extra ? "" : page=="accents" ? "{8} " : "{10} ";
	const symbols = page=="symbols" ? "{8} " : "{11} ";

	return "{5} " + accents + symbols + "{6} ' {7}";
}

/**
 * the text of the key that calls the extra letters: the first two of them
 */

function accentLabel( layout: KbLayout, upper: boolean ): string {
	const label = layout.extra.split( " " ).slice( 0, 2 ).join( " " );
	return ( upper ? upperKeys( label ) : label ).replace( " ", "" );
}


const RE_sel = /text|password|search|tel|url/i;

interface KeyboardProps extends BoxProps {
	/**
	 * the language of the keys, with or without its country: "fr-FR",
	 * "de-CH", "pl"... "fr-FR" when it is not given
	 */
	locale?: string;
}

/**
 * @cssvar
 * ```
 * --keyboard-key-background
 * --keyboard-hilite-color
 * --keyboard-key-color
 * --keyboard-accents-color
 * --keyboard-symbols-color
 * --keyboard-zoom
 * ```
 */
@class_ns( "x4" )
export class Keyboard extends HBox<KeyboardProps>
{
	mode: KbMode;
	upper: boolean;
	locale: string;
	keyboard: Box;
	visible: boolean;
	input: HTMLInputElement;
		
    constructor( props: KeyboardProps )  {
        super( { ...props, id: 'v-keyboard' } );

        this.mode   = 'alpha';
        this.upper  = false;
        this.locale = props.locale ?? 'fr-FR';
		this.visible = false;
        
        document.addEventListener( 'focusin', (e) => this.handleFocus(e.target as Element,true), false );
        document.addEventListener( 'focusout', (e) => this.handleFocus(e.target as Element,false), false );

		this.hide( );

		// a key: each contact, a finger or the mouse, the second tap of a quick double tap too
		this.addDOMEvent( "pointerdown", (e) => {
			const key = this._keyOf( e );
			if( key && !REDRAW_KEYS.has( key ) ) {
				this._handleKey( key );
			}
		});

		// the focus stays in the field
		this.addDOMEvent( "mousedown", (e) => {
			e.preventDefault( );
			e.stopPropagation( );
		});

		// a double click or a double tap: its two pointerdown gave the two keys
		this.addDOMEvent( "dblclick", (e) => {
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
	 * Change the language of the keys.
	 * @param locale - "fr-FR", "de-CH", "pl"... A country that has no keyboard
	 * of its own gets the one of its language, a language that is not known a QWERTY.
	 *
	 * @example
	 * keyboard.setLocale( "de-CH" );
	 */

	setLocale( locale: string ) {
		this.locale = locale;

		// a language without extra letters has no page for them
		if( this.mode=="accents" && !findLayout( locale ).extra ) {
			this.mode = "alpha";
		}

		// drawn at least once
		if( this.keyboard ) {
			this._redraw( );
		}
	}

	/**
	 * 
	 */

    private _keyOf( e: UIEvent ): number {
        let target = e.target as HTMLElement;

        while( target && target!==this.dom ) {
            if( target.hasAttribute('data-key') ) {
                return parseInt(target.getAttribute('data-key'), 10);
            }

            target = target.parentNode as HTMLElement;
        }

		return 0;
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
                this.upper = !this.upper;
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
                this._switchMode( "alpha" );
                break;
            }

            // extra letters
            case 10: {
                this._switchMode( "accents" );
                break;
            }

            // signs
            case 11: {
                this._switchMode( "symbols" );
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

	private _switchMode( m: KbMode ) {
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
                        this.upper = false;
                        this._switchMode( "alpha" );
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

        //<eco: fire change event
        this.input.dispatchEvent(new Event('input',  { bubbles: true }));
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
	 * 
	 */

    private _createContent( ) {
        let     lines: string[];
		const layout = findLayout( this.locale );

		if( this.mode=="number" || this.mode=="date" ) {
			lines = kb_pads[this.mode];
		}
		else if( this.mode=="accents" ) {
			lines = accentLines( layout, this.upper );
		}
		else if( this.mode=="symbols" ) {
			lines = symbolLines( layout );
		}
		else {
			lines = letterLines( layout, this.upper );
		}

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

						case 10:
						{
							content = accentLabel( layout, this.upper );
							cls += ' caccents';
							break;
						}

						case 11:
						{
							content = '#+=';
							cls += ' csymbols';
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
						if( e.repeat || REDRAW_KEYS.has( key ) ) {
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