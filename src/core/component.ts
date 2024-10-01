import { isArray, UnsafeHtml, isNumber, Rect } from './core_tools';
import { CoreElement } from './core_element';
import { ariaValues, unitless } from './core_styles';
import { EventMap } from './core_events';
import { addEvent, DOMEventHandler, GlobalDOMEvents } from './core_dom';

interface RefType<T extends Component> {
	dom: T;
}

type ComponentAttributes = Record<string,string|number|boolean>;

const FRAGMENT = Symbol( "fragment" );
const COMPONENT = Symbol( "component" );

const RE_NUMBER = /^-?\d+(\.\d*)?$/;

/**
 * 
 */

function genClassNames( x: any ) {
	
	let classes = [];
	let self = Object.getPrototypeOf(x);

	while (self && self.constructor !== Component ) {
		let clsname:string = self.constructor.name;
		classes.push( 'x4'+clsname.toLowerCase() );
		self = Object.getPrototypeOf(self);
	}

	return classes;
}

/**
 * 
 */

type ComponentChild = Component | string | UnsafeHtml | number | boolean | Component[];
//type ComponentChildren = ComponentChild | ComponentChild[];

let gen_id = 1000;

export const makeUniqueComponentId = ( ) => {
	return `x4-${gen_id++}`;
}

/**
 * 
 */

export interface ComponentProps {
	tag?: string;
	ns?: string;

	style?: Partial<CSSStyleDeclaration>;
	attrs?: Record<string,string|number|boolean>;
	content?: ComponentChild;
	dom_events?: GlobalDOMEvents;
	cls?: string;
	id?: string;
	ref?: RefType<any>;

	// shortcuts
	width?: string | number;
	height?: string | number;
	disabled?: true,

    // wrapper
	existingDOM?: HTMLElement;

	//  index signature 
	//	to avoid errors: Type 'X' has no properties in common with type 'Y' 
	//	because all memebers here are optional.
	//	this allow TS to recongnize derived props as ComponentProps
	//[key: string]: any; 
};

/**
 * 
 */

export interface ComponentEvents extends EventMap {
}

/**
 * 
 */

export class Component<P extends ComponentProps = ComponentProps, E extends ComponentEvents = ComponentEvents> 
		extends CoreElement<E> {

	readonly dom: Element;
	readonly props: P;

	constructor( props: P ) {
		super( );

		this.props = props;	// copy ?

		if( props.existingDOM ) {
			this.dom = props.existingDOM;
		}
		else {
			if( props.ns ) {
				this.dom = document.createElementNS( props.ns, props.tag ?? "div" );
			}
			else {
				this.dom = document.createElement( props.tag ?? "div" );
			}

			if (props.attrs) {
				this.setAttributes( props.attrs );
			}

			if( props.disabled ) {
				this.enable( false );
			}

			if( props.cls ) {
				this.addClass( props.cls );
			}

			if( props.id!==undefined ) {
				this.setAttribute( "id", props.id );
			}

			// small shortcut
			if( props.width!==undefined ) {
				this.setStyleValue( "width", props.width );
			}

			// small shortcut
			if( props.height!==undefined ) {
				this.setStyleValue( "height", props.height );
			}

			if( props.style ) {
				this.setStyle( props.style );
			}

			if( props.content ) {
				this.setContent( props.content );
			}

			if( props.dom_events ) {
				this.setDOMEvents( props.dom_events );
			}

			const classes = genClassNames( this );
			this.dom.classList.add( ...classes );
		}

		(this.dom as any)[COMPONENT] = this;
	}


	// :: CLASSES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * 
	 */

	hasClass( cls: string ) {
		return this.dom.classList.contains( cls );
	}

	/**
	 * 
	 */

	addClass( cls: string ) {
		if( !cls ) return;
		
		if( cls.indexOf(' ')>=0 ) {
			const ccs = cls.split( " " );
			this.dom.classList.add(...ccs);
		}
		else {
			this.dom.classList.add(cls);
		}
	}

	/**
	 * 
	 */

	removeClass( cls: string ) {
		if( !cls ) return;
		
		if( cls.indexOf(' ')>=0 ) {
			const ccs = cls.split( " " );
			this.dom.classList.remove(...ccs);
		}
		else {
			this.dom.classList.remove(cls);
		}
	}

	/**
	 * 
	 */

	toggleClass( cls: string ) {
		if( !cls ) return;
		
		const toggle = ( x: string ) => {
			this.dom.classList.toggle(x);
		}

		if( cls.indexOf(' ')>=0 ) {
			const ccs = cls.split( " " );
			ccs.forEach( toggle );
		}
		else {
			toggle( cls );
		}
	}

	/**
	 * 
	 */

	setClass( cls: string, set: boolean = true ) {
		if( set ) this.addClass(cls);
		else this.removeClass( cls );
	}

	// :: ATTRIBUTES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * attributes
	 */

	setAttributes( attrs: ComponentAttributes ) {
		
		for( const name in attrs ) {
			const value = attrs[name];
			this.setAttribute( name, value );
		}
	}

	/**
	 * 
	 */
	
	setAttribute( name: string, value: string | number | boolean ) {
		if( value===null || value===undefined ) {
			this.dom.removeAttribute( name );
		}
		else {
			this.dom.setAttribute( name, ""+value );
		}
	}

	/**
	 * 
	 */

	getAttribute( name: string ): string {
		return this.dom.getAttribute( name );
	}

	/**
	 * 
	 */

	getData( name: string ) : string {
		return this.getAttribute( "data-"+name );
	}

	/**
	 * 
	 */

	setData( name: string, value: string ) {
		return this.setAttribute( "data-"+name, value );
	}


	// :: DOM EVENTS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * 
	 */

	addDOMEvent<K extends keyof GlobalDOMEvents>( name: K, listener: GlobalDOMEvents[K], prepend = false ) {
		addEvent( this.dom, name, listener as DOMEventHandler, prepend );
	}

	/**
	 * 
	 */

	setDOMEvents( events: GlobalDOMEvents ) {
		for( const name in events ) {
			this.addDOMEvent( name as any, (events as any)[name] );
		}
	}

	// :: CONTENT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * update the component
	 * @param delay >0 delay in ms, <0 next frame, 0 immediately
	 */

	update( delay: number = 0 ) {

		const up = ( ) => {
			this.render( );
		}

		if( delay==0 ) {
			up( );
		}
		else if( delay<0 ) {
			requestAnimationFrame( up );
		}
		else {
			setTimeout( up, delay );
		}
	}

	/**
	 * render the component
	 */

	render( ) {
	}

	/**
	 * remove all content from component
	 */

	clearContent( ) {
		const d = this.dom;
		while( d.firstChild ) {
			d.removeChild( d.firstChild );
		}
	}

	/**
	 * change the whole content of the component
	 * clear the content before
	 * @param content new content
	 */

	setContent( content: ComponentChild ) {
		this.clearContent( );
		this.appendContent( content );
	}

	/**
	 * cf. appendContent
	 * @param content content to append
	 */

	appendContent( content: ComponentChild ) {
		const d = this.dom;

		const set = ( c: Component | string | UnsafeHtml | number | boolean ) => {
			if (c instanceof Component ) {
				d.appendChild( c.dom );
			}
			else if( c instanceof UnsafeHtml) {
				d.insertAdjacentHTML('beforeend', c.toString() );
			}
			else if (typeof c === "string" || typeof c === "number") {
				d.appendChild(document.createTextNode(c.toString()));
			}
			else {
				console.warn("Unknown type to append: ", c);
			}
		}

		if( !isArray(content) ) {
			set( content );
		}
		else {
			const fragment = document.createDocumentFragment( );
			for (const child of content ) {
				set( child );
			}
			d.appendChild( fragment );
		}
	}		

	/**
	 * remove a single child
	 * @see clearContent
	 */

	removeChild( child: Component ) {
		this.dom.removeChild( child.dom );
	}

	
	/**
	 * query all elements by selector
	 */

	queryAll( selector: string ): Component[] {
		const all = this.dom.querySelectorAll( selector );
		const rc = new Array( all.length );
		all.forEach( (x,i) => rc[i]=componentFromDOM(x) );
		return rc;
	}

	/**
	 * 
	 */
	
	query<T extends Component = Component>( selector: string ): T {
		const r = this.dom.querySelector( selector );
		return componentFromDOM<T>(r);
	}

	// :: STYLES ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	
	/**
	 * 
	 */
	
	setAria( name: keyof ariaValues, value: string | number | boolean ): this {
		this.setAttribute( name, value );
		return this;
	}


	/**
	 * 
	 */

	setStyle( style: Partial<CSSStyleDeclaration> ): this {
		const _style = (this.dom as HTMLElement).style;

		for( const name in style ) {
			
			let value = style[name];
			if( !unitless[name] && (isNumber(value) || RE_NUMBER.test(value)) ) {
				value += "px";
			}

			_style[name] = value;
		}

		return this;
	}

	/**
	 * 
	 */

	setStyleValue<K extends keyof CSSStyleDeclaration>( name: K, value: CSSStyleDeclaration[K] | number ): this {
		
		const _style = (this.dom as HTMLElement).style;

		if( isNumber(value) ) {
			let v = value+"";
			if( !unitless[name as string] ) {
				v += "px";
			}
			
			(_style as any)[name] = v;
		}
		else {
			_style[name] = value;
		}

		return this;
	}

	/**
	 * 
	 * @param name 
	 * @returns 
	 */

	getStyleValue<K extends keyof CSSStyleDeclaration>( name: K ) {
		const _style = (this.dom as HTMLElement).style;
		return _style[name];
	}

	/**
	 * 
	 */

	setStyleVariable( name: string, value: string ) {
		(this.dom as HTMLElement).style.setProperty( name, value );
	}

	/**
	 * 
	 */

	getStyleVariable( name: string ) {
		const style = this.getComputedStyle( );
		return style.getPropertyValue( name );
	}

	/**
	 * 
	 * @returns 
	 */

	getComputedStyle( ) {
		return getComputedStyle( this.dom );
	}

	/**
	 * 
	 */

	setCapture( pointerId: number ) {
		this.dom.setPointerCapture( pointerId );
	}

	/**
	 * 
	 */

	releaseCapture( pointerId: number ) {
		this.dom.releasePointerCapture( pointerId );
	}

	/**
	 * 
	 */

	getBoundingRect( ): Rect {
		const rc = this.dom.getBoundingClientRect( );
		return new Rect( rc );
	}

	// :: MISC ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * 
	 */

	public scrollIntoView(arg?: boolean | ScrollIntoViewOptions) {
		this.dom.scrollIntoView(arg);
	}

	/**
	 * 
	 */

	isVisible( ) {
		return (this.dom as HTMLElement).offsetParent !== null;
	}

	/**
	 * 
	 */

	show( vis = true ) {
		this.setClass( 'x4hidden', !vis );
	}

	/**
	 * 
	 */

	hide( ) {
		this.show( false );
	}

	/**
	 * 
	 */

	enable( ena = true ) {
		this.setAttribute( "disabled", !ena );
	}

	/**
	 * 
	 */

	disable( ) {
		this.enable( false );
	}

	/**
	 * check if element is marked disabled
	 */

	isDisabled( ) {
		return this.getAttribute('disabled');
	}

	/**
	 * 
	 */

	nextElement<T extends Component = Component>( ): T {
		const nxt = this.dom.nextElementSibling;
		return componentFromDOM<T>( nxt );
	}

	/**
	 * 
	 * @returns 
	 */

	prevElement<T extends Component = Component>( ): T {
		const nxt = this.dom.previousElementSibling;
		return componentFromDOM<T>( nxt );
	}

	/**
	 * 
	 * @returns 
	 */

	firstChild<T extends Component = Component>( ) : T {
		const nxt = this.dom.firstElementChild;
		return componentFromDOM<T>( nxt );
	}

	/**
	 * 
	 * @returns 
	 */

	lastChild<T extends Component = Component>( ) : T {
		const nxt = this.dom.lastElementChild;
		return componentFromDOM( nxt );
	}

	/**
	 * 
	 * @param callback 
	 */

	enumChilds( callback: ( c: Component ) => boolean | void ) {
		for( let c=this.firstChild( ); c; c=c.nextElement() ) {
			if( callback(c)===true ) {
				break;
			}
		}
	}

	/**
	 * 
	 */

	animate( keyframes: Keyframe[], duration: number ) {
		this.dom.animate(keyframes,duration);
	}


	// :: TSX/REACT ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * called by the compiler when a jsx element is seen
	 */

	static createElement( clsOrTag: string | ComponentConstructor | Symbol | Function, attrs: any, ...children: Component[] ): Component | Component[] {

		let comp: Component;

		// fragment
		if( clsOrTag==this.createFragment || clsOrTag===FRAGMENT ) {
			return children;
		}

		// class constructor, yes : dirty
		if( clsOrTag instanceof Function ) {
			attrs = attrs ?? {};
			if( !attrs.children && children && children.length ) {
				attrs.content = children;
			}

			comp = new (clsOrTag as any)( attrs ?? {} );
		}
		// basic tag
		else {
			comp = new Component( {
				tag: clsOrTag,
				content: children,
				...attrs,
			});
		}

		if( children && children.length ) {
			//comp.setContent( children );
		}

		return comp;
	}

	static createFragment( ): Component[] {
		return this.createElement( FRAGMENT, null ) as Component[];
	}
}  


/**
 * 
 */

type ComponentConstructor = {
	new(...params: any[]): Component;
};

/**
 * get a component element from it's DOM counterpart
 */

export function componentFromDOM<T extends Component = Component>( node: Element ) {
	return node ? (node as any)[COMPONENT] as T : null;
}

/**
 * create a component from an existing DOM
 */

export function wrapDOM( el: HTMLElement ): Component {
	const com = componentFromDOM(el);
	if( com ) {
		return com;
	}

	return new Component( { existingDOM: el } );
}
