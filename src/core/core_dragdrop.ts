/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_dragdrop.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Component } from './component';
import { Point } from './core_tools';

const x_drag_cb = Symbol( 'x-drag-cb' );

interface DropInfo {
	pt: Point;
	data: DataTransfer;
}

type DropCallback = ( command: 'enter' | 'leave' | 'drag' | 'drop', el: Component, infos: DropInfo ) => void;
type FilterCallback = ( el: Component, data: DataTransfer ) => boolean;

/** 
 * Manages drag and drop operations within the application.
 * This class handles the registration of draggable elements and drop targets, 
 * and orchestrates the visual feedback and event dispatching during drag operations.
 */


class DragManager {

	dragSource: Component;
	dragGhost: HTMLElement;
	dropTarget: Component;
	
	notified: Component;
	
	timer: any; // pb with name of settimeout return

	/**
	 * Registers a component as a draggable element.
	 * This sets up DOM event listeners for `dragstart`, `drag`, and `dragend`
	 * to manage the drag operation, including creating a drag ghost and applying CSS classes.
	 *
	 * @param el - The component to make draggable.
	 */
	// TODO: Add support for custom drag data beyond 'text/string'.
	registerDraggableElement(el: Component) {

		el.addDOMEvent('dragstart', (ev: DragEvent) => {

			this.dragSource = el;
			this.dragGhost = el.dom.cloneNode(true) as HTMLElement;
			
			this.dragGhost.classList.add('dragged');
			document.body.appendChild(this.dragGhost);

			el.addClass( 'dragging' );

			ev.dataTransfer.setData('text/string', '1');
			ev.dataTransfer.setDragImage(new Image(), 0, 0);

			ev.stopPropagation( );
		});

		el.addDOMEvent('drag', (ev: DragEvent) => {
			this.dragGhost.style.left = ev.pageX + "px";
			this.dragGhost.style.top = ev.pageY + "px";
		});

		el.addDOMEvent('dragend', (ev: DragEvent) => {
			el.removeClass( 'dragging' );
			this.dragGhost.remove();
		});

		el.setAttribute('draggable', "true");
	}

	/**
	 * Registers a component as a drop target.
	 * This sets up DOM event listeners for `dragenter`, `dragover`, `dragleave`, and `drop`.
	 * It uses a `DropCallback` to notify the component about drag events and an optional `FilterCallback`
	 * to determine if the target should accept the dragged item.
	 *
	 * @param el - The component to make a drop target.
	 * @param cb - The callback function to execute on drag events.
	 * @param filterCB - An optional callback to filter which draggable items can be dropped.
	 */

	registerDropTarget(el: Component, cb: DropCallback, filterCB?: FilterCallback ) {

		const dragEnter = (ev: DragEvent) => {
			if( filterCB && !filterCB(this.dragSource,ev.dataTransfer) ) {
				console.log( 'reject ', el );
				ev.dataTransfer.dropEffect = 'none';	
				return;
			}

			console.log( 'accepted ', el );
			ev.preventDefault();
			ev.dataTransfer.dropEffect = 'copy';
		};

		const dragOver = (ev: DragEvent) => {
			//console.log( "dragover", ev.target );
			
			if( filterCB && !filterCB(this.dragSource,ev.dataTransfer) ) {
				console.log( 'reject ', el );
				ev.dataTransfer.dropEffect = 'none';	
				return;
			}
			
			ev.preventDefault();
									
			if (this.dropTarget != el) {
				this.dropTarget = el;
				this._startCheck();
			}

			if( this.dropTarget ) {
				const infos = {
					pt: { x: ev.pageX, y: ev.pageY },
					data: ev.dataTransfer,
				}

				cb( 'drag', this.dragSource, infos );
			}

			ev.dataTransfer.dropEffect = 'copy';
		};

		const dragLeave = (ev: DragEvent) => {
			//console.log( "dragleave", ev.target );
			this.dropTarget = null;
			ev.preventDefault();
		};

		const drop = (ev: DragEvent) => {
			const infos = {
				pt: { x: ev.pageX, y: ev.pageY },
				data: ev.dataTransfer,
			}

			cb('drop', this.dragSource, infos );
			
			this.dropTarget = null;
			el.removeClass('drop-over');

			ev.preventDefault();
		}

		el.addDOMEvent('dragenter', dragEnter);
		el.addDOMEvent('dragover', dragOver);
		el.addDOMEvent('dragleave', dragLeave);
		el.addDOMEvent('drop', drop);

		el.setInternalData( x_drag_cb, cb );
	}

	/**
	 * @internal
	 */

	private _startCheck() {

		if (this.timer) {
			clearInterval(this.timer);
			this._check( );
		}

		this.timer = setInterval( () => this._check(), 300 );
	}

	/**
	 * @internal
	 */

	private _check( ) {

		const leaving = ( x: Component ) => {
			x.removeClass('drop-over');

			const cb = x.getInternalData( x_drag_cb );
			cb( 'leave', this.dragSource );
		}

		const entering = ( x: Component ) => {
			x.addClass('drop-over');
			const cb = x.getInternalData( x_drag_cb );
			cb( 'enter', this.dragSource );
		}
	
		if (this.dropTarget) {
			if (!this.notified || this.notified != this.dropTarget) {

				if( this.notified ) {
					leaving( this.notified );
				}
		
				this.notified = this.dropTarget;
				entering( this.notified );
			}
		}
		else {
			if (this.notified) {
				leaving( this.notified );
				this.notified = null;

				clearInterval(this.timer);
			}
		}
	}
}

/**
 * Singleton instance of the DragManager for global access.
 */

export const dragManager = new DragManager();