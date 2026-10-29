/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file carousel.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { EventCallback } from '../../core/core_events';
import { Component, ComponentEvents, ComponentProps, EvChange } from '../../core/component';
import { _tr } from '../../core/core_i18n';
import { clamp, sprintf, UnsafeHtml } from '../../core/core_tools';

import { HBox } from '../boxes/boxes';
import { Button } from '../button/button';
import { Image, ImageProps } from '../image/image';

import './carousel.module.scss';

export interface CarouselEvents extends ComponentEvents {
	change: EvChange;
}

/** a slide that is an image: loaded when it comes near the view */
export interface CarouselImage {
	src: string;
	alt?: string;
	/** over the bottom of the image */
	caption?: string | UnsafeHtml;
	/** cover by default: the image fills the slide, cut; contain: all of it, with margins */
	fit?: "cover" | "contain";
}

export type CarouselItem = Component | CarouselImage;

export interface CarouselProps extends Omit<ComponentProps,"content"> {
	/** the slides: components, or images */
	items?: CarouselItem[];
	/** the slides seen side by side, 1 by default; a move goes one slide further */
	perView?: number;
	/** the slide at the start (its index), 0 by default */
	index?: number;
	/** after the last slide comes the first one, and before the first the last */
	loop?: boolean;
	/** ms between two slides: it goes by itself (and loops), paused while the pointer is over it or the focus in it */
	autoplay?: number;
	/** the buttons previous and next on its sides; true by default */
	arrows?: boolean;
	/** a dot for each place, under the slides; true by default */
	dots?: boolean;
	/** the user (arrows, dots, swipe, keys) or the autoplay went to another slide: value is its index; not by the code */
	change?: EventCallback<EvChange>;
}

const icon_prev = `<svg viewBox="0 0 24 24"><path d="M15.4 5.4L14 4l-8 8 8 8 1.4-1.4L8.8 12z"/></svg>`;
const icon_next = `<svg viewBox="0 0 24 24"><path d="M8.6 5.4L10 4l8 8-8 8-1.4-1.4 6.6-6.6z"/></svg>`;

/**
 * slides side by side, one place at a time (or perView): arrows, dots, a swipe with the finger or
 * the mouse, the arrow keys, and an autoplay. A slide is a component, or an image.
 *
 * @example
 * new Carousel( {
 *   height: 300, autoplay: 5000,
 *   items: photos.map( p => ( { src: p.url, alt: p.title, caption: p.title } ) ),
 * } )
 *
 * @cssvar
 * ```
 * --carousel-gap
 * --carousel-duration
 * --carousel-arrow-background
 * --carousel-arrow-color
 * --carousel-dot
 * --carousel-dot-active
 * --carousel-radius
 * --carousel-caption-color
 * --carousel-caption-background
 * --carousel-disabled-filter
 * ```
 */

export class Carousel extends Component<CarouselProps,CarouselEvents> {
	static classPrefix = "x4";

	private _index = 0;
	private _slides: Component[] = [];
	private _images = new Map<number, { image: Image, src: string }>( );	// slides that are images, not loaded yet

	private _viewport: Component;
	private _track: Component;
	private _prev: Button;
	private _next: Button;
	private _dots: HBox;

	// swipe: where it started; dragging once it moved more than a click
	private _swipe: { id: number, x: number, y: number, dragging: boolean } = null;

	// autoplay: paused while the pointer is over it, the focus in it, or a swipe
	private _hover = false;
	private _focus = false;

	constructor( props: CarouselProps ) {
		super( props );

		this.mapPropEvents( props, "change" );

		this.setContent( [
			this._viewport = new Component( { cls: "viewport", content: [
				this._track = new Component( { cls: "track" } ),
				this._prev = new Button( { cls: "arrow prev", icon: icon_prev, tabindex: false, attrs: { "aria-label": _tr.global.carousel.prev }, click: ( ) => this._go( this._index-1 ) } ),
				this._next = new Button( { cls: "arrow next", icon: icon_next, tabindex: false, attrs: { "aria-label": _tr.global.carousel.next }, click: ( ) => this._go( this._index+1 ) } ),
			] } ),
			this._dots = new HBox( { cls: "dots" } ),
		] );

		this.setAttribute( "tabindex", 0 );
		this.setAttribute( "role", "region" );
		this.setAria( "aria-roledescription", _tr.global.carousel.carousel );

		this._viewport.setDOMEvents( {
			pointerdown: ( ev ) => this._on_pointerdown( ev ),
			pointermove: ( ev ) => this._on_pointermove( ev ),
			pointerup: ( ev ) => this._on_pointerup( ev ),
			pointercancel: ( ev ) => this._on_pointerup( ev ),
			// an image dragged by the browser would take the swipe
			dragstart: ( ev ) => ev.preventDefault( ),
		} );

		this.setDOMEvents( {
			keydown: ( ev ) => this._on_key( ev ),
			pointerenter: ( ) => { this._hover = true; },
			pointerleave: ( ) => { this._hover = false; },
			focusin: ( ) => { this._focus = true; },
			focusout: ( ) => { this._focus = false; },
			// the timers of a component are not stopped when it leaves the page
			created: ( ) => this._autoplay( ),
			removed: ( ) => this.clearTimeouts( ),
		} );

		this.setItems( props.items ?? [], props.index ?? 0 );
	}

	private _perView( ) { return Math.max( 1, Math.round( this.props.perView ?? 1 ) ); }

	// the last place: the last slides fill the view
	private _maxIndex( ) { return Math.max( 0, this._slides.length - this._perView( ) ); }

	private _loops( ) { return !!this.props.loop || !!this.props.autoplay; }

	// :: places ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	// beyond the ends, the other end when it loops; notify: the user (arrows, dots, swipe, keys), not the code
	private _go( index: number, notify = true ) {
		const max = this._maxIndex( );

		if( this._loops( ) ) {
			index = index>max ? 0 : ( index<0 ? max : index );
		}

		// a move of the user starts the time of the autoplay again
		this._autoplay( );

		if( this._show( index ) && notify ) {
			this.fire( "change", { value: this._index } );
		}
	}

	// true when the place changed
	private _show( index: number ) {
		index = clamp( index, 0, this._maxIndex( ) );
		const changed = index!=this._index;

		this._index = index;
		this.setStyleVariable( "--carousel-index", index+"" );

		// the images of the slides seen, and of their neighbours: ready for the next move
		const pv = this._perView( );
		this._load( index-1, index+pv );

		// the slides out of the view: no focus, no reader
		this._slides.forEach( ( s, i ) => {
			const seen = i>=index && i<index+pv;
			s.setAttribute( "inert", !seen );
			s.setAria( "aria-hidden", !seen );
		} );

		this._dots.enumChildComponents( false ).forEach( ( d, i ) => {
			d.setClass( "selected", i==index );
			d.setAria( "aria-current", i==index );
		} );

		const loops = this._loops( );
		this._prev.enable( loops || index>0 );
		this._next.enable( loops || index<this._maxIndex( ) );

		return changed;
	}

	private _load( from: number, to: number ) {
		const n = this._slides.length;
		if( !n ) {
			return;
		}

		for( let i=from; i<=to; i++ ) {
			// the neighbours of the ends, when it loops
			const k = ( ( i % n ) + n ) % n;
			const img = this._images.get( k );
			if( img ) {
				img.image.setImage( img.src );
				this._images.delete( k );
			}
		}
	}

	private _buildSlide( item: CarouselItem ) {
		if( item instanceof Component ) {
			return item;
		}

		// src given when it comes near the view (_load)
		const image = new Image<ImageProps>( { src: "", alt: item.alt, fit: item.fit ?? "cover" } );
		const content: Component[] = [ image ];

		if( item.caption ) {
			content.push( new Component( { cls: "caption", content: item.caption } ) );
		}

		return { image, src: item.src, content };
	}

	// :: autoplay ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _autoplay( ) {
		const ms = this.props.autoplay;
		if( !ms ) {
			return;
		}

		// a named timer: starting it again replaces it
		this.setInterval( "autoplay", ms, ( ) => {
			if( this._hover || this._focus || this._swipe || document.hidden ) {
				return;
			}

			const index = this._index>=this._maxIndex( ) ? 0 : this._index+1;
			if( this._show( index ) ) {
				this.fire( "change", { value: this._index } );
			}
		} );
	}

	// :: swipe :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	private _on_pointerdown( ev: PointerEvent ) {
		if( ev.button!=0 || Component.closest( ev.target as Element, ".arrow" ) ) {
			return;
		}

		this._swipe = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, dragging: false };
	}

	private _on_pointermove( ev: PointerEvent ) {
		const sw = this._swipe;
		if( !sw || sw.id!=ev.pointerId ) {
			return;
		}

		let dx = ev.clientX - sw.x;

		if( !sw.dragging ) {
			// more than a click; along the slides, not across (the page scrolls)
			if( Math.abs( dx )<6 || Math.abs( dx )<Math.abs( ev.clientY - sw.y ) ) {
				return;
			}

			// captured: the click at the end goes to the viewport, not to what is in the slide
			sw.dragging = true;
			this._viewport.setCapture( ev.pointerId );
			this.addClass( "dragging" );
		}

		// at an end, it resists
		const max = this._maxIndex( );
		if( !this._loops( ) && ( ( this._index==0 && dx>0 ) || ( this._index==max && dx<0 ) ) ) {
			dx /= 3;
		}

		this.setStyleVariable( "--carousel-drag", dx+"px" );
	}

	// far enough (a fifth of a slide): to the next places, as many as the slides it went over
	private _on_pointerup( ev: PointerEvent ) {
		const sw = this._swipe;
		if( !sw || sw.id!=ev.pointerId ) {
			return;
		}

		this._swipe = null;
		if( !sw.dragging ) {
			return;
		}

		this._viewport.releaseCapture( ev.pointerId );
		this.removeClass( "dragging" );
		this.setStyleVariable( "--carousel-drag", "0px" );

		// taken by the browser (the page scrolls): back to its place
		if( ev.type=="pointercancel" ) {
			return;
		}

		const dx = ev.clientX - sw.x;
		const gap = parseFloat( this._track.getComputedStyle( ).columnGap ) || 0;
		const step = ( this._viewport.getBoundingRect( ).width + gap ) / this._perView( );

		let n = Math.round( -dx / step );
		if( n==0 && Math.abs( dx )>step/5 ) {
			n = dx<0 ? 1 : -1;
		}

		if( n ) {
			this._go( this._index + n );
		}
	}

	private _on_key( ev: KeyboardEvent ) {
		switch( ev.key ) {
			case "ArrowLeft": this._go( this._index-1 ); break;
			case "ArrowRight": this._go( this._index+1 ); break;
			case "Home": this._go( 0 ); break;
			case "End": this._go( this._maxIndex( ) ); break;
			default: return;
		}

		ev.preventDefault( );
	}

	// :: api :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * the slides; index: the place to show (the current one by default)
	 */

	setItems( items: CarouselItem[], index = this._index ) {
		const n = items.length;
		this._images.clear( );

		this._slides = items.map( ( item, i ) => {
			const built = this._buildSlide( item );
			let s: Component;

			if( built instanceof Component ) {
				s = new Component( { cls: "slide", content: built } );
			}
			else {
				s = new Component( { cls: "slide image", content: built.content } );
				this._images.set( i, { image: built.image, src: built.src } );
			}

			s.setAttribute( "role", "group" );
			s.setAria( "aria-roledescription", _tr.global.carousel.slide );
			s.setAria( "aria-label", sprintf( _tr.global.carousel.position, i+1, n ) );
			return s;
		} );

		this._track.setContent( this._slides );
		this.setStyleVariable( "--carousel-per-view", this._perView( )+"" );

		// a dot for each place
		const places = this._maxIndex( ) + 1;
		this._dots.setContent( Array.from( { length: places }, ( _, i ) => new Component( {
			tag: "button", cls: "dot",
			attrs: { type: "button", tabindex: -1, "aria-label": sprintf( _tr.global.carousel.position, i+1, places ) },
			dom_events: { click: ( ) => this._go( i ) },
		} ) ) );

		// nothing to move: no commands
		const moves = places>1;
		this._prev.show( moves && this.props.arrows!==false );
		this._next.show( moves && this.props.arrows!==false );
		this._dots.show( moves && this.props.dots!==false );

		this._index = -1;
		this._show( index );
	}

	/**
	 * goes to a slide, without a change event; beyond the ends: the end
	 */

	select( index: number ) {
		this._show( index );
		this._autoplay( );
	}

	/** the next place, the first after the last when it loops; without a change event */
	next( ) {
		this._go( this._index+1, false );
	}

	/** the place before, the last before the first when it loops; without a change event */
	prev( ) {
		this._go( this._index-1, false );
	}

	getIndex( ) {
		return this._index;
	}

	getCount( ) {
		return this._slides.length;
	}
}
