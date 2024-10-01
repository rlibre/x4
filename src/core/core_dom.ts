/** @ignore this events must be defined on domNode (do not bubble) */
export const unbubbleEvents = {
	mouseleave: 1, mouseenter: 1, load: 1, unload: 1, scroll: 1, focus: 1, blur: 1, rowexit: 1, beforeunload: 1, stop: 1,
	dragdrop: 1, dragenter: 1, dragexit: 1, draggesture: 1, dragover: 1, contextmenu: 1, created: 2, removed: 2, sizechange: 2
};

export type DOMEventHandler = ( ev: Event ) => void;
type EventEntry = Record<string,DOMEventHandler | DOMEventHandler[]>;

const event_handlers = new WeakMap<Node,EventEntry>( );

/**
 * handle dom mutations
 */

let mutObserver: MutationObserver = null;

const observeMutation = (mutations: MutationRecord[], observer: MutationObserver): void => {

	const sendEvent = ( node: Node, code: "created" | "removed" ) => {
//		console.log( "notify", node, code );
			
		const store = event_handlers.get( node );
		if ( store && store[code] ) {
			node.dispatchEvent( new Event( code, {} ) );
		}
	}

	const notify = ( node: Node, create: boolean ) => {

		if( create ) {
			sendEvent( node, "created" );
		}

		for( let c=node.firstChild; c; c=c.nextSibling ) {
			notify( c, create );
		}

		if( !create ) {
			sendEvent( node, "removed" );
		}
	}

	
	for (const mutation of mutations)  {
		if( mutation.type=="childList" ) {
			if( mutation.addedNodes ) {
				mutation.addedNodes.forEach( node => {
					notify( node, true );
				} );
			}
			
			if( mutation.removedNodes ) {
				mutation.removedNodes.forEach( node => {
					notify( node, false );
				} );
			}
		}
	}
}



/**
 * 
 */

let sizeObserver: ResizeObserver = null;

function observeSize(entries: ResizeObserverEntry[]) {
	entries.forEach((entry) => {
		let dom = entry.target as HTMLElement;
		if (dom.offsetParent !== null) {
			dom.dispatchEvent( new Event('resized') );
		}
	});
}

/**
 * 
 */

export function dispatchEvent(ev: Event) {

	let target = ev.target as Node,
		noup = (unbubbleEvents as any)[ev.type] === 2;

	while (target) {
		const store = event_handlers.get( target );
		if ( store ) {
			const callback = store[ev.type];
			if( callback ) {
				if( Array.isArray(callback) ) {
					callback.some( c => c( ev ) );
				}	
				else {
					callback( ev );
				}

				if (ev.stopPropagation || ev.defaultPrevented || noup) {
					break;
				}
			}
		}

		target = target.parentNode;

		// no need to go above
		if (target == document) {
			break;
		}
	}
}

/**
 * 
 */

export function addEvent( node: Node, name: string, handler: DOMEventHandler, prepend = false ) {

	if( name=="removed" || name=="created" ) {
		if( !mutObserver ) {
			mutObserver = new MutationObserver( observeMutation )
			mutObserver.observe( document.body, {childList: true,subtree: true} );
		}
	}
	else if( name=="resized" ) {
		if (!sizeObserver) {
			sizeObserver = new ResizeObserver( observeSize );
		}
		
		sizeObserver.observe( node as Element );
	}


	let store = event_handlers.get( node );
	if( !store ) {
		store = {}
		event_handlers.set( node, store );
	}

	if( !store[name] ) {
		store[name] = handler;
		node.addEventListener( name, dispatchEvent );
	}
	else {
		const entry = store[name];
		if( Array.isArray(entry) ) {
			entry.push( handler );
		}
		else {
			store[name] = [entry,handler];
		}
	}
}

/**
 * 
 */

export interface GlobalDOMEvents {

	/**
	 * Fires when the user aborts the download.
	 * @param ev The event.
	 */

	abort?: (ev: UIEvent) => any;
	animationcancel?: (ev: AnimationEvent) => any;
	animationend?: (ev: AnimationEvent) => any;
	animationiteration?: (ev: AnimationEvent) => any;
	animationstart?: (ev: AnimationEvent) => any;
	auxclick?: (ev: MouseEvent) => any;

	/**
	 * Fires when the object loses the input focus.
	 * @param ev The focus event.
	 */
	blur?: (ev: FocusEvent) => any;
	cancel?: (ev: Event) => any;

	/**
	 * Occurs when playback is possible, but would require further buffering.
	 * @param ev The event.
	 */
	canplay?: (ev: Event) => any;
	canplaythrough?: (ev: Event) => any;
	/**
	 * Fires when the contents of the object or selection have changed.
	 * @param ev The event.
	 */
	change?: (ev: Event) => any;
	/**
	 * Fires when the user clicks the left mouse button on the object
	 * @param ev The mouse event.
	 */
	click?: (ev: MouseEvent) => any;
	close?: (ev: Event) => any;
	/**
	 * Fires when the user clicks the right mouse button in the client area, opening the context menu.
	 * @param ev The mouse event.
	 */
	contextmenu?: (ev: MouseEvent) => any;
	cuechange?: (ev: Event) => any;
	/**
	 * Fires when the user double-clicks the object.
	 * @param ev The mouse event.
	 */
	dblclick?: (ev: MouseEvent) => any;
	/**
	 * Fires on the source object continuously during a drag operation.
	 * @param ev The event.
	 */
	drag?: (ev: DragEvent) => any;
	/**
	 * Fires on the source object when the user releases the mouse at the close of a drag operation.
	 * @param ev The event.
	 */
	dragend?: (ev: DragEvent) => any;
	/**
	 * Fires on the target element when the user drags the object to a valid drop target.
	 * @param ev The drag event.
	 */
	dragenter?: (ev: DragEvent) => any;
	dragexit?: (ev: Event) => any;
	/**
	 * Fires on the target object when the user moves the mouse out of a valid drop target during a drag operation.
	 * @param ev The drag event.
	 */
	dragleave?: (ev: DragEvent) => any;
	/**
	 * Fires on the target element continuously while the user drags the object over a valid drop target.
	 * @param ev The event.
	 */
	dragover?: (ev: DragEvent) => any;
	/**
	 * Fires on the source object when the user starts to drag a text selection or selected object.
	 * @param ev The event.
	 */
	dragstart?: (ev: DragEvent) => any;
	drop?: (ev: DragEvent) => any;
	/**
	 * Occurs when the duration attribute is updated.
	 * @param ev The event.
	 */
	durationchange?: (ev: Event) => any;
	/**
	 * Occurs when the media element is reset to its initial state.
	 * @param ev The event.
	 */
	emptied?: (ev: Event) => any;
	/**
	 * Occurs when the end of playback is reached.
	 * @param ev The event
	 */
	ended?: (ev: Event) => any;
	/**
	 * Fires when an error occurs during object loading.
	 * @param ev The event.
	 */
	error?: OnErrorEventHandler;
	/**
	 * Fires when the object receives focus.
	 * @param ev The event.
	 */
	focusin?: (ev: FocusEvent) => any;
	focusout?: (ev: FocusEvent) => any;
	focus?: (ev: FocusEvent) => any;
	gotpointercapture?: (ev: PointerEvent) => any;
	input?: (ev: Event) => any;
	invalid?: (ev: Event) => any;
	/**
	 * Fires when the user presses a key.
	 * @param ev The keyboard event
	 */
	keydown?: (ev: KeyboardEvent) => any;
	/**
	 * Fires when the user presses an alphanumeric key.
	 * @param ev The event.
	 */
	keypress?: (ev: KeyboardEvent) => any;
	/**
	 * Fires when the user releases a key.
	 * @param ev The keyboard event
	 */
	keyup?: (ev: KeyboardEvent) => any;
	/**
	 * Fires immediately after the browser loads the object.
	 * @param ev The event.
	 */
	load?: (ev: Event) => any;
	/**
	 * Occurs when media data is loaded at the current playback position.
	 * @param ev The event.
	 */
	loadeddata?: (ev: Event) => any;
	/**
	 * Occurs when the duration and dimensions of the media have been determined.
	 * @param ev The event.
	 */
	loadedmetadata?: (ev: Event) => any;
	/**
	 * Occurs when Internet Explorer begins looking for media data.
	 * @param ev The event.
	 */
	loadstart?: (ev: Event) => any;
	lostpointercapture?: (ev: PointerEvent) => any;
	/**
	 * Fires when the user clicks the object with either mouse button.
	 * @param ev The mouse event.
	 */
	mousedown?: (ev: MouseEvent) => any;
	mouseenter?: (ev: MouseEvent) => any;
	mouseleave?: (ev: MouseEvent) => any;
	/**
	 * Fires when the user moves the mouse over the object.
	 * @param ev The mouse event.
	 */
	mousemove?: (ev: MouseEvent) => any;
	/**
	 * Fires when the user moves the mouse pointer outside the boundaries of the object.
	 * @param ev The mouse event.
	 */
	mouseout?: (ev: MouseEvent) => any;
	/**
	 * Fires when the user moves the mouse pointer into the object.
	 * @param ev The mouse event.
	 */
	mouseover?: (ev: MouseEvent) => any;
	/**
	 * Fires when the user releases a mouse button while the mouse is over the object.
	 * @param ev The mouse event.
	 */
	mouseup?: (ev: MouseEvent) => any;
	/**
	 * Occurs when playback is paused.
	 * @param ev The event.
	 */
	pause?: (ev: Event) => any;
	/**
	 * Occurs when the play method is requested.
	 * @param ev The event.
	 */
	play?: (ev: Event) => any;
	/**
	 * Occurs when the audio or video has started playing.
	 * @param ev The event.
	 */
	playing?: (ev: Event) => any;
	pointercancel?: (ev: PointerEvent) => any;
	pointerdown?: (ev: PointerEvent) => any;
	pointerenter?: (ev: PointerEvent) => any;
	pointerleave?: (ev: PointerEvent) => any;
	pointermove?: (ev: PointerEvent) => any;
	pointerout?: (ev: PointerEvent) => any;
	pointerover?: (ev: PointerEvent) => any;
	pointerup?: (ev: PointerEvent) => any;
	/**
	 * Occurs to indicate progress while downloading media data.
	 * @param ev The event.
	 */
	progress?: (ev: ProgressEvent) => any;
	/**
	 * Occurs when the playback rate is increased or decreased.
	 * @param ev The event.
	 */
	ratechange?: (ev: Event) => any;
	/**
	 * Fires when the user resets a form.
	 * @param ev The event.
	 */
	reset?: (ev: Event) => any;
	//resize?: (ev: UIEvent) => any;	remove to avoid errors with sizechange event

	/**
	 * Fires when the user repositions the scroll box in the scroll bar on the object.
	 * @param ev The event.
	 */
	scroll?: (ev: Event) => any;
	securitypolicyviolation?: (ev: SecurityPolicyViolationEvent) => any;
	/**
	 * Occurs when the seek operation ends.
	 * @param ev The event.
	 */
	seeked?: (ev: Event) => any;
	/**
	 * Occurs when the current playback position is moved.
	 * @param ev The event.
	 */
	seeking?: (ev: Event) => any;
	/**
	 * Fires when the current selection changes.
	 * @param ev The event.
	 */
	select?: (ev: Event) => any;
	selectionchange?: (ev: Event) => any;
	selectstart?: (ev: Event) => any;
	/**
	 * Occurs when the download has stopped.
	 * @param ev The event.
	 */
	stalled?: (ev: Event) => any;
	submit?: (ev: Event) => any;

	/**
	 * Occurs if the load operation has been intentionally halted.
	 * @param ev The event.
	 */
	suspend?: (ev: Event) => any;

	/**
	 * Occurs to indicate the current playback position.
	 * @param ev The event.
	 */
	timeupdate?: (ev: Event) => any;
	toggle?: (ev: Event) => any;
	touchcancel?: (ev: TouchEvent) => any;
	touchend?: (ev: TouchEvent) => any;
	touchmove?: (ev: TouchEvent) => any;
	touchstart?: (ev: TouchEvent) => any;
	transitioncancel?: (ev: TransitionEvent) => any;
	transitionend?: (ev: TransitionEvent) => any;
	transitionrun?: (ev: TransitionEvent) => any;
	transitionstart?: (ev: TransitionEvent) => any;

	/**
	 * Occurs when the volume is changed, or playback is muted or unmuted.
	 * @param ev The event.
	 */
	volumechange?: (ev: Event) => any;

	/**
	 * Occurs when playback stops because the next frame of a video resource is not available.
	 * @param ev The event.
	 */
	waiting?: (ev: Event) => any;
	wheel?: (ev: WheelEvent) => any;

	/**
	 * custom x4 events
	 */

	resized?: (ev: Event) => void;			// occurs when size changed
	created?: ( ev: Event ) => void;		// occurs when inserted in the dom
	removed?: ( ev: Event ) => void;		// occurs when removed from dom
}









