/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file gridview.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { Component, ComponentContent, ComponentEvents, ComponentProps, EvClick, EvContextMenu, EvDblClick, EvSelectionChange } from '../../core/component';
import { formatDate, formatDateTime, formatMoney, formatNumber, isNumber, isString, setWaitCursor, UnsafeHtml } from '../../core/core_tools';
import { DataModel, DataStore, DataView, DataRecord, EvViewChange, SortCallback } from '../../core/core_data';
import { EventCallback } from '../../core/core_events';
import { kbNav } from '../../core/core_tools';

import { Icon } from '../icon/icon';
import { Image } from '../image/image'
import { Box } from '../boxes/boxes';
import { CSizer } from '../sizers/sizer'
import { Viewport } from '../viewport/viewport';
import { Label, SimpleText } from '../label/label';
import icons from "../assets/icons"

import { _tr } from '../../core/core_i18n';

import "./gridview.module.scss"

export type CellRenderer = (rec: DataRecord, col_id: any) => Component;
export type CellClassifier = (data: any, rec: DataRecord, col: string ) => string;	// return the cell computed class

type ColType = "number" | "money" | "checkbox" | "date" | "string" | "image" | "percent" | "icon" | "date-time";

const SCROLL_LIMIT = 200;


/**
 * 
 */

export interface GridColumn {
	id: any;
	title: string | UnsafeHtml;
	width: number;
	fixed?: boolean;
	flex?: number;
	align?: 'left' | 'center' | 'right';
	header_align?: 'left' | 'center' | 'right';
	renderer?: CellRenderer;				// for "renderer" type
	formatter?: (input: any) => string;	// for "custom" type
	type?: ColType;
	cls?: string;
    tooltip?: boolean;  // allow tooltip for each cell of thi column
	sortable?: boolean | SortCallback;
	footer_val?: string;
	classifier?: CellClassifier;
}

interface GridColumnEx extends GridColumn {
	sens?: "up" | "dn";
}

export interface GridviewEvents extends ComponentEvents {
	click?: EvClick;
	dblClick?: EvDblClick;
	contextMenu?: EvContextMenu;
	selectionChange?: EvSelectionChange;
}

export interface GridviewProps extends ComponentProps {
	footer?: boolean | Component;
	store: DataStore;
	columns: GridColumn[];
	emptyMsg?: string;

	/**
	 * several rows can be selected: Ctrl (Cmd on a Mac) + click adds a row or
	 * removes it, Shift + click selects up to the row, Ctrl + A selects all
	 */
	multisel?: boolean;

	click?: EventCallback<EvClick>;
	dblClick?: EventCallback<EvDblClick>;
	contextMenu?: EventCallback<EvContextMenu>;
	selectionChange?: EventCallback<EvSelectionChange>;
	sort?: {
		field_id: string;
		asc?: boolean;
	}
}

/**
 * we can handle
 * 4_095 cols and (1_048_575-1)/2 rows (this is a chrome limitation max pixels of scrollbars )
 */

/**
 * @cssvar
 * ```
 * --gridview-background
 * --gridview-border
 * --gridview-header-cell-background
 * --gridview-header-cell-color
 * --gridview-header-sort-color
 * --gridview-header-cell-vline
 * --gridview-header-cell-border
 * --grid-check-background
 * --grid-check-color
 * --grid-check-background-hover
 * --grid-check-color-hover
 * --grid-perc-background
 * --grid-perc-color
 * --grid-perc-background-hover
 * --grid-perc-color-hover
 * --gridview-cell-color
 * --gridview-cell-color-sel
 * --gridview-cell-vline
 * --gridview-row-background
 * --gridview-row-odd-background
 * --gridview-row-border
 * --gridview-row-background-hover
 * --gridview-row-background-hover-sel
 * --gridview-row-background-sel
 * --gridview-row-color-sel
 * --gridview-fix-border
 * ```
 */

export class Gridview<P extends GridviewProps = GridviewProps, E extends GridviewEvents = GridviewEvents> extends Component<P,E> {
	static classPrefix = "x4";

	private _dataview: DataView;
	private _datamodel: DataModel;

	private _columns: GridColumnEx[];

	private _lock: number;
	private _dirty: number;

	private _row_height: number;
	
	private _left: number;
	private _top: number;

	private _body: Component;
	private _viewport: Component;

	private _fheader: Box;	// fixed col header
	private _hheader: Box;	// col header
	private _vheader: Box;	// vertical row header
	private _ffooter: Box;	// fixed footer
	private _footer: Box;	// footer

	private _vis_rows: Map<number, { h: Component, r: Component }>;
	private _start: number;
	private _end: number;

	private _selection: Set<any>;	// the ids of the selected records: a row changes place when the view is sorted
	

	// TODO: that

	private _has_fixed: boolean;
	private _has_footer: boolean;

	constructor(props: P) {
		super(props);

		this._lock = 0;
		this._dirty = 0;

		this._row_height = 32;
		
		this._left = 0;
		this._top = 0;

		this._vis_rows = new Map();
		this._selection = new Set();
		this._has_fixed = false;
		this._has_footer = props.footer===true;

        if( props.footer instanceof Component ) {
            props.footer.addClass( "gadget-footer packed" );
        }

		this._columns = props.columns.map(x => x);

		this.mapPropEvents( props, "click", "dblClick", "contextMenu", "selectionChange" );

		this.lock(true);
		this.setAttribute("tabindex", 0);

		this.addDOMEvent("created", () => {
			// back in the document: the view follows its store again (see "removed")
			if (this._dataview) {
				this._dataview.open( );
			}

			this._init();
			this._dirty = 1;
			this.lock(false);
		});

		// out of the document: its store must not keep the grid alive, nor redraw it
		this.addDOMEvent("removed", () => {
			if (this._dataview) {
				this._dataview.close( );
			}

			// as before its first insertion: nothing is drawn out of the document
			this.lock( true );
		});

		this.addDOMEvent("resized", () => {
			this._updateFlexs( );
			this._computeFullSize( );
			this._update( true );
		});

		this.addDOMEvent( "keydown", (e) => {
			this._on_key( e );
		})

		// the handlers of the grid itself are put once, here. _init builds what is
		// inside the grid, each time it comes in the document

		// WHEEL
		this.addDOMEvent("wheel", (ev: WheelEvent) => {
			// many rows: one pixel of the scroll bar is one row, wherever the pointer is
			if (ev.deltaY && this._dataview && this._dataview.getCount() >= SCROLL_LIMIT) {
				this._viewport.dom.scrollBy(0, ev.deltaY < 0 ? -1 : 1);
				ev.stopPropagation();
				ev.preventDefault();
			}
			else if (this._has_fixed && ev.deltaY) {
				// wheel on fixed part
				//	fixed part do not have scrollbar, so we need to handle it by hand
				let t = ev.target as Node;
				while (t != this.dom) {
					if (t == this._vheader.dom) {
						this._viewport.dom.scrollBy(0, ev.deltaY < 0 ? -this._row_height : this._row_height);
						ev.stopPropagation();
						ev.preventDefault();
						break;
					}

					t = t.parentNode;
				}
			}
		})

		const targetRow = ( e: MouseEvent ) => {
			let el = Component.parentElement(e.target as HTMLElement, Component);
			while (el && !el.hasClass("row")) {
				el = el.parentElement();
			}

			if (el) {
				return el.getIntData("row");
			}
			
			return undefined;
		}

		const inColHeader = ( e: MouseEvent ) => {
			let el = Component.parentElement(e.target as HTMLElement, Component);
			while (el && !el.hasClass("col-header")) {
				el = el.parentElement();
			}

			return !!el;
		}

		// multisel, Ctrl + click: one row more, or one row less
		const toggleRow = ( row: number ) => {
			const id = this._dataview.getIdByIndex( row );
			if( !this._selection.has( id ) ) {
				this._addSelection( row );
				return;
			}

			this._selection.delete( id );
			this.queryAll(`.row[data-row="${row}"]`).forEach(el => {
				el.removeClass("selected");
			});

			this.fire("selectionChange", { selection: this.getSelection( ) ?? [], empty: this._selection.size==0 } );
		}

		// multisel, Shift + click: from the row that was selected last to this one
		const selectTo = ( row: number ) => {
			let last: any;
			for (const id of this._selection) {
				last = id;
			}

			const from = this._dataview.indexOfId( last );

			this._clearSelection( false );

			// the row to start from is added last: the next Shift + click starts from it too
			if( from<0 ) {
				this._addSelection( row, false );
			}
			else if( from<=row ) {
				for( let r=row; r>=from; r-- ) {
					this._addSelection( r, false );
				}
			}
			else {
				for( let r=row; r<=from; r++ ) {
					this._addSelection( r, false );
				}
			}

			this.fire("selectionChange", { selection: this.getSelection( ), empty: false } );
		}


		// CLICK
		this.addDOMEvent("click", (e) => {
			const row = targetRow( e );
			if (row!==undefined ) {
				if( this.props.multisel && ( e.ctrlKey || e.metaKey ) ) {
					toggleRow( row );
				}
				else if( this.props.multisel && e.shiftKey && this._selection.size ) {
					selectTo( row );
				}
				// this row alone
				else if( this._selection.size!=1 || !this._selection.has( this._dataview.getIdByIndex( row ) ) ) {
					this._clearSelection( false );
					this._addSelection(row);
				}

				// once the selection is what the click made it
				const rec = this._dataview.getByIndex( row );
				this.fire( "click", { context: rec } );
			}
			// a click in a column header sorts or sizes it: what is selected stays
			else if( !inColHeader( e ) ) {
				this._clearSelection( true );
			}
		});

		// DBLCLICK
		this.addDOMEvent("dblclick", (e) => {
			const row = targetRow( e );
			if (row!==undefined ) {
				if( !this._selection.has( this._dataview.getIdByIndex( row ) ) ) {
					this._clearSelection( false );
					this._addSelection(row);
				}

				this._on_dblclk( e, row );

				const rec = this._dataview.getByIndex( row );
				this.fire( "dblClick", { context: rec } );
			}
		});

		// CONTEXT
		this.addDOMEvent("contextmenu", (e) => {
			const row = targetRow( e );
			if (row!==undefined ) {
				// on a selected row, the menu is for all that is selected
				if( !this._selection.has( this._dataview.getIdByIndex( row ) ) ) {
					this._clearSelection( false );
					this._addSelection(row);
				}

				const rec = this._dataview.getByIndex( row );
				this.fire( "contextMenu", { uievent: e, context: rec } );
			}

			e.preventDefault( );
			e.stopPropagation( );
		});

		// MOUSE OVER
		this.addDOMEvent("mouseover", (e) => {

			if (!this._has_fixed) {
				return;
			}

			let el = Component.parentElement(e.target as HTMLElement, Component);
			while (el && !el.hasClass("row")) {
				el = el.parentElement();
			}

			if (el) {
				const data = el.getData("row");

				this.queryAll(".hover").forEach(x => x.removeClass("hover"));

				if (data) {
					const rows = this.queryAll(`.row[data-row="${data}"]`);
					rows.forEach(x => x.addClass("hover"));
				}
			}
		});

		// MOUSE LEAVE
		this.addDOMEvent("mouseleave", (e) => {

			if (!this._has_fixed) {
				return;
			}

			this.queryAll(".hover").forEach(x => x.removeClass("hover"));
		});

		if( props.multisel ) {
			this.addShortcut( "Mod+A", ( ) => this.selectAll( ) );
		}

		if (props.store) {
			this.setStore(props.store);

			if( props.sort ) {
				this.sortCol( props.sort.field_id, props.sort.asc===true );
			}
		}
	}

	/**
	 * 
	 */

	private _on_key( ev: KeyboardEvent ) {
		if( this.isDisabled() ) {
			return;
		}

		switch( ev.key ) {
			case "ArrowDown": {
				this.navigate( kbNav.next );
				break;
			}

			case "ArrowUp": {
				this.navigate( kbNav.prev );
				break;
			}

			case "Home": {
				this.navigate( kbNav.first );
				break;
			}

			case "End": {
				this.navigate( kbNav.last );
				break;
			}

			case "PageDown": {
				this.navigate( kbNav.pgdn );
				break;
			}

			case "PageUp": {
				this.navigate( kbNav.pgup );
				break;
			}

			default:
				return;
		}

		ev.preventDefault( );
		ev.stopPropagation( );
	}

	/**
	 * 
	 */

	navigate( sens: kbNav ) {
		// no row to go to
		if( !this._dataview || !this._dataview.getCount( ) ) {
			return false;
		}

		// the row to start from: the one of the first selected record
		let fsel = -1;
		if( this._selection.size ) {
			fsel = this._dataview.indexOfId( this._selection.values().next().value );
		}

		if( fsel<0 ) {
			if( sens==kbNav.next || sens==kbNav.pgdn )  {
				sens = kbNav.first;
			}
			else {
				sens = kbNav.last;
			}
		}

		if( sens==kbNav.first || sens==kbNav.last ) {
			let nel = sens==kbNav.first ? 0 : this._dataview.getCount()-1;
			this._clearSelection( false );
			this._addSelection( nel );
			this._scrollToIndex( nel );
			return true;
		}
		else if( sens==kbNav.prev || sens==kbNav.next ) {
			let nel = sens==kbNav.next ? fsel+1 : fsel-1;
			if( nel>=0 && nel<this._dataview.getCount() ) {
				this._clearSelection( false );
				this._addSelection( nel );
				this._scrollToIndex( nel );
				return true;
			}
		}
		else if( sens==kbNav.pgdn || sens==kbNav.pgup ) {
			const pgh = this._vis_rows.size;

			let sby = sens==kbNav.pgdn ? pgh : -pgh;
			let nel = fsel+sby;

			if( nel<0 ) {
				nel = 0;
			}
			else if( nel>=this._dataview.getCount() ) {
				nel = this._dataview.getCount()-1;
			}

			if( nel!=fsel ) {
				this._clearSelection( false );
				this._addSelection( nel );

				if (this._dataview.getCount() < SCROLL_LIMIT) {
					sby *= this._row_height;
				}

				this._viewport.dom.scrollBy( 0, sby );
				
				return true;
			}
		}

		return false;
	}

	/**
	 * 
	 */

	private _scrollToIndex( index: number, block = 'nearest' ) {

		// not built yet: nothing to scroll
		if( !this._viewport ) {
			return;
		}

		// is it already visible ?
		let rows = this.queryAll(`.row[data-row="${index}"]`);
		if (rows.length) {
			rows.forEach( row => {
				row.scrollIntoView({ block: block as any } );
			} );
		}
		// nope, refill
		else {
			let top = index;
			if (this._dataview.getCount() < SCROLL_LIMIT) {
				top *= this._row_height;
			}

			this._viewport.dom.scrollTo( 0, top );
		}
	}

	/**
	 * 
	 */

	setStore(store: DataStore) {

		const on_change = (ev: EvViewChange) => {
			if( !this._viewport ) {
				// not created
				return;
			}

			// the data or the filter changed: a record that left the view leaves the selection
			if (ev.change_type != 'sort') {
				let lost = false;

				for (const id of this._selection) {
					if (this._dataview.indexOfId( id ) < 0) {
						this._selection.delete( id );
						lost = true;
					}
				}

				if (lost) {
					this.fire("selectionChange", { selection: this.getSelection( ) ?? [], empty: this._selection.size==0 } );
				}
			}

			this._updateFlexs( );
			this._computeFullSize();
			this._update(true);
		}

		// the previous view stops following its store
		if (this._dataview) {
			this._dataview.close( );
		}

		if (store) {
			this._dataview = new DataView({ store: store });
			this._datamodel = store.getModel();
			this._dataview.on('view_change', on_change);
		}
		else {
			this._dataview = null;
			this._datamodel = null;
		}
	}

	/*
	setColumns( columns: GridColumn[] ) {
		this._columns = columns.map(x => x);

		if( this.dom ) {
			this._updateFlexs( );
			
			// Rebuild headers
			if (this._fheader) {
				const newFixedHeader = this._buildColHeader(true);
				this._fheader.setContent(newFixedHeader.getChildren());
				// On doit remplacer _fheader dans le DOM ou mettre à jour son contenu
				// La méthode _buildColHeader retourne une Box.
				// Ici, je vais simplifier en vidant et remplissant si possible, 
				// mais Box n'a pas forcément de méthode simple pour remplacer tout le DOM interne sans casser les events.
				// Le plus simple est de remplacer les composants header dans le DOM global du gridview.
				
				// Approche : on recrée les headers et on remplace les anciens
				this._fheader.destroy();
				this._hheader.destroy();
				
				this._fheader = this._buildColHeader(true);
				this._hheader = this._buildColHeader(false);
				
				// Il faut réinsérer ces headers au bon endroit dans le DOM du Gridview.
				// _init fait: 
				// 		this.setContent([
				//			this._fheader,
				//			this._hheader,
				//			this._vheader,
				//			this._viewport,
				//			this._ffooter,
				//			this._footer,
				//		]);
				
				// Donc on peut reconstruire le content complet
				const content = [
					this._fheader,
					this._hheader,
					this._vheader,
					this._viewport
				];
				
				if (this._has_footer) {
					this._ffooter.destroy();
					this._footer.destroy();
					this._ffooter = this._buildColFooter(true);
					this._footer = this._buildColFooter(false);
					content.push(this._ffooter);
					content.push(this._footer);
				}
				
				this.setContent(content);
			}

			this._computeFullSize( );
			this._update( true );
		}
	}
	*/

	getView( ): DataView {
		return this._dataview;
	}

	/**
	 * 
	 */

	lock(lock: boolean) {
		if (lock) {
			this._lock++;
		}
		// an unlock too many leaves it at 0: the grid goes on drawing
		else if (this._lock > 0) {
			if (--this._lock == 0 && this._dirty) {
				this._update( true );
			}
		}
	}

	private _getColCount() {
		return this._columns.length;
	}

	private _getCol(index: number) {
		return this._columns[index];
	}

	/**
	 * 
	 */

	private _buildColHeader(fixed: boolean) {
		// row header
		const els: Component[] = [];

		const count = this._getColCount();
		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if ((!!cdata.fixed) != fixed) {
				continue;
			}

			const sizer = new CSizer("right");

			sizer.on("stop", ( ) => {
				// the flex columns took what was left: the body gets the width of its columns
				this._updateFlexs( );
				this._computeFullSize( );
			})

			sizer.on("resize", (ev) => {
				const size = Math.max( ev.size, 16 );		// 16px at least: the min-width of a .cell
				cdata.width = size;
				cdata.flex  = 0;

				const cols = this.queryAll(`[data-col="${col}"]`)
				cols.forEach(c => {
					c.setStyleValue("width", size + "px");
				});

				const rh = header.getBoundingRect();

				if (!fixed) {
					this._body.setStyleValue("width", rh.width + "px");
				}
				else {
					this.setStyleVariable("--fixed-width", rh.width + "px");
				}
			})

			// a double click on the sizer: the column takes its share of the place
			// that is left (flex 1). To stop taking it, the sizer is dragged
			sizer.addDOMEvent("dblclick", (ev) => {
				// both: the cell under the sizer sorts its column on a double click
				ev.stopPropagation( );
				ev.preventDefault( );

				// a fixed column is not in the place that is shared
				if (fixed || cdata.flex) {
					return;
				}

				cdata.flex = 1;

				this._updateFlexs( );
				this._computeFullSize( );
			});

			const cell = new Component({
				cls: `cell`,
				attrs: { "data-col": col },
				style: { width: cdata.width ? cdata.width + "px" : undefined },
				content: [
					new SimpleText({ cls: 'title', text: cdata.title, align: cdata.header_align ?? "left" }),
					new Component({ cls: "sorter" }),
					sizer
				]
			});

			// the column the grid is sorted by
			if (cdata.sens) {
				cell.addClass( cdata.sens==="up" ? "sorted" : "sorted desc" );
			}

			cell.addDOMEvent("touchend", () => {
				const last = cell.getInternalData("touchend");
				const now = Date.now();
				const delta = last ? now - last : 0;
				if (delta > 30 && delta < 300) {
					this._sortCol(col);
				}
				else {
					cell.setInternalData("touchend", now);
				}
			})

			cell.addDOMEvent("dblclick", () => {
				this._sortCol(col);
			});

			els.push(cell);
		}

		if (fixed && els.length == 0) {
			return null;
		}

		const header = new Box({ cls: "col-header", content: els });
		header.setClass("fixed", fixed);

		return header;
	}

	/**
	 * 
	 */

	private _buildColFooter(fixed: boolean): Box {

        if( !this.props.footer ) {
            return null;
        }

        // row footer
        const els: Component[] = [];

        const count = this._getColCount();
        for (let col = 0; col < count; col++) {
            const cdata = this._getCol(col);
            if ((!!cdata.fixed) != fixed) {
                continue;
            }

            const cell = new Component({
                cls: `cell`,
                attrs: { "data-col": col },
                style: { width: cdata.width ? cdata.width + "px" : undefined },
                content: [
                    new SimpleText({ text: cdata.footer_val }),
                ]
            });

            cell.addDOMEvent("dblclick", () => {
                this._sortCol(col);
            });

            els.push(cell);
        }

        if (fixed && els.length == 0) {
            return null;
        }

        const footer = new Box({ cls: "col-footer", content: els });
        footer.setClass("fixed", fixed);
        return footer;
	}

	/**
	 * 
	 */

	private _sortCol(col: number, ascending?: boolean ) {

		// to allow cursor
		this.setTimeout("sort", 50, () => {
			let asc = true;

			const cdata = this._getCol(col);

			if( ascending===undefined ) {
				// a double click on the sorted column reverses it
				asc = cdata.sens!=="up";
			}
			else {
				asc = ascending;
			}

			// one column is sorted. It is kept in the columns, not in the header: the header
			// may not be built yet, and is built again each time the grid comes in the document
			this._columns.forEach( c => { c.sens = undefined; } );
			cdata.sens = asc ? "up" : "dn";

			const sorted = this.queryAll(".sorted");
			sorted.forEach(x => x.removeClass("sorted asc desc"));

			const scol = this.query(`.col-header .cell[data-col="${col}"]`);
			if( scol ) {
				scol.setClass("sorted");
				scol.setClass("desc", !asc);
			}

			let num = false;
			switch (cdata.type) {
				case "checkbox":
				case "money":
				case "number":
				case "percent": {
					num = true;
				}
			}

			setWaitCursor(true);

			this._dataview.sort([{
				field: cdata.id,
				ascending: asc,
				numeric: num,
				callback: cdata.sortable instanceof Function ? cdata.sortable : undefined,
			}]);

			this._update(true);

			// sorted by a double click on a header: what is selected is shown where it went
			if( ascending===undefined && this._selection.size ) {
				this._scrollToIndex( this._dataview.indexOfId( this._selection.values().next().value ) );
			}

			setWaitCursor(false);
		});
	}

	/**
	 * 
	 */

	sortCol( colIdx: any, ascending: boolean ) {

		const idx = this._columns.findIndex( x => x.id === colIdx );
		if( idx>=0 ) {
			this._sortCol( idx, ascending );
		}
	}

	/**
	 * 
	 */

	private _renderCell(rec: DataRecord, column: GridColumnEx, extra_cls: string[] ): ComponentContent {

		const col = column.id;
		const type = column.type;

		// a column that is not a field of the model (actions...) has only its renderer to draw it
		if( column.renderer && isString( col ) && this._datamodel.getFieldIndex( col )<0 ) {
			return column.renderer( rec, col );
		}

		let data = this._datamodel.getRaw(col, rec);
		if (data === undefined || data === null) {
			return null;
		}

        if( column.renderer ) {
            const cell = column.renderer( rec, col );
            return cell;
        }

		let cls = "";
		if( column.classifier ) {
			extra_cls.push( column.classifier( data, rec, col ) );
		}
		
		if (data instanceof Function) {
			return data(rec, col);
		}
		
		if( column.formatter ) {
			return column.formatter( data );
		}

		switch (type) {
			case "checkbox": {
				if (data) {
					return new Icon({ cls: "cell-check" + cls, iconId: icons.check });
				}

				return undefined;
			}

			case "image": {
				if (isString(data)) {
					return new Image({ cls, src: data, fit: "scale-down" });
				}

				return undefined;
			}

			case "number": {
				if (!isNumber(data)) {
					return "NaN";
				}

				data = formatNumber(data as number);
				break;
			}

			case "money": {
				if (!isNumber(data)) {
					return "NaN";
				}

				data = formatMoney(data as number);
				break;
			}

			case "percent": {
				return new Box({
					cls: "percent" + cls,
					content: new Component({ cls: "bar", width: data + "%" })
				});
			}

			case "icon": {
				return new Icon({ cls, iconId: data + "" });
			}

			case "date": {
				if( isString(data) ) {
					data = new Date( data );
				}
				
				data = formatDate(data as Date);
				break;
			}

			case "date-time": {
				if( isString(data) ) {
					data = new Date( data );
				}
				
				data = formatDateTime(data as Date);
				break;
			}

			default: {
				data = data + "";
				break;
			}
		}

		return new Component({ 
            tag: "span", 
            cls, 
            content: data,
            tooltip: column.tooltip ? data : undefined
        });
	}

	/**
	 * 
	 */

	private _buildRow(rowid: number, rec: DataRecord, top: number) {

		const els: Component[] = [];
		const count = this._getColCount();

		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if (cdata.fixed) {
				continue;
			}

			const extra: string[] = []
			const content = this._renderCell(rec, cdata, extra );

			let align: string;
			switch (cdata.align) {
				case "center": align = "center"; break;
				case "right": align = "end"; break;
			}

			const el = new Component({
				cls: "cell",
				style: { width: cdata?.width ? cdata.width + "px" : undefined, justifyContent: align },
				content
			});

			if( extra.length ) {
				el.addClass( extra.join(' ') );
			}

			if (cdata.type) {
				el.addClass(cdata.type);
			}

			el.setData("col", col + "");
			el.setData("row", rowid + "")

			els.push(el);
		}

		const rowel = new Box({ cls: "row", style: { top: top.toFixed(2) + "px" }, content: els });
		rowel.setData("row", rowid + "");

		if (this._selection.has( this._dataview.getRecId( rec ) )) {
			rowel.addClass("selected");
		}

		if( rowid&1 ) {
			rowel.addClass( "even" );
		}
		else {
			rowel.addClass( "odd" );
		}

		return rowel;
	}

	/**
	 * 
	 */

	private _buildRowHeader(rowid: number, rec: DataRecord, top: number) {

		const cols: Component[] = [];
		const count = this._getColCount();

		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if (!cdata?.fixed) {
				continue;
			}

			const content = this._renderCell(rec, cdata, [cdata.type] );

			let align = "start";
			switch (cdata.align) {
				default: align = "start"; break;
				case "center": align = "center"; break;
				case "right": align = "end"; break;
			}

			const el = new Component({
				cls: "cell",
				style: { width: cdata?.width ? cdata.width + "px" : undefined, justifyContent: align },
				content
			});

			if (cdata.type) {
				el.addClass(cdata.type);
			}

			el.setData("col", col + "");
			el.setData("row", rowid + "")

			cols.push(el);
		}

		const rowel = new Box({ cls: "row", style: { top: top + "px" }, content: cols });
		rowel.setData("row", rowid + "");

		if (this._selection.has( this._dataview.getRecId( rec ) )) {
			rowel.addClass("selected");
		}

		return rowel;
	}

	/**
	 * 
	 */

	private _updateFlexs( ) {
		let maxw = 0;
		let flexc = 0;

		const ccount = this._getColCount();

		for (let x = 0; x < ccount; x++) {
			const cdata = this._getCol(x);

			// the fixed columns are not in the viewport: their width is not taken from its own
			if( cdata.fixed ) {
				continue;
			}

			if( cdata.flex ) {
				flexc += cdata.flex;
			}
			else {
				maxw  += cdata.width;
			}
		}

		if( flexc ) {
			const width = this._viewport.dom.clientWidth;
			const delta = width - maxw;
			const fw = delta / flexc;

			for (let col = 0; col < ccount; col++) {
				const cdata = this._getCol(col);
				if( !cdata.fixed && cdata.flex ) {
					cdata.width = Math.max( cdata.flex*fw, 32 );

					const cols = this.queryAll(`[data-col="${col}"]`)
					cols.forEach(c => {
						c.setStyleValue("width", cdata.width + "px");
					});
				}
			}
		}
	}

	/**
	 * 
	 */

	private _computeFullSize() {

		let maxw = 0;
		let maxfw = 0;
		
		const ccount = this._getColCount();

		for (let x = 0; x < ccount; x++) {
			const cdata = this._getCol(x);
			let w = 0;

			if (cdata.fixed) {
				this._has_fixed = true;
			}
			
			if ( cdata.width) {
				w += cdata.width;
			}
			
			if (cdata.fixed) {
				maxfw += w;
			}
			else {
				maxw += w;
			}
		}

		const maxr = this._dataview ? this._dataview.getCount() : 0;
		let maxh = maxr;

		if (maxr < SCROLL_LIMIT) {
			maxh *= this._row_height;
		}
		else {
			const height = this._body.dom.parentElement.clientHeight;
			const npage = height / this._row_height;
			maxh = maxr - Math.floor(npage) + npage * this._row_height;
		}

		this.setStyleVariable("--fixed-width", maxfw + "px");
		this._body.setStyleValue("height", maxh==0 ? "100%" : maxh + "px");
		this._body.setStyleValue("width", maxw + "px");
		this._vheader.setStyleValue("height", maxh + "px");
	}

	/**
	 * 
	 */

	private _init() {
		this._body = new Component({ cls: "body" });

		this._viewport = new Viewport({ content: this._body });

		if (!this.props.footer) {
			this.setStyleVariable("--footer-height", "0");
		}

		// SCROLL
		this._viewport.addDOMEvent( "scroll", (ev) => {
			// sync horz & vert elements
			this._left = this._viewport.dom.scrollLeft;
			this.setStyleVariable("--left", -this._left + "px");

			this._top = this._viewport.dom.scrollTop;
			this.setStyleVariable("--top", -this._top + "px");

			//this.setTimeout( "update", 0, ( ) => this._update( ) );
			this._update()
		});

		this._updateFlexs( );

		this._fheader = this._buildColHeader(true);
		this._hheader = this._buildColHeader(false);
		this._vheader = new Box({ cls: "row-header" })

        let rfooter: Component = null;
		if (this._has_footer===true ) {
			this._ffooter = this._buildColFooter(true);
			this._footer = this._buildColFooter(false);
		}
        else if( this.props.footer ) {
            rfooter = this.props.footer as Component
        }

		this.setContent([this._viewport, this._fheader, this._hheader, this._ffooter, this._footer, rfooter, this._vheader]);

		// compute misc variables
		{
			const rh = this.getStyleVariable("--row-height");
			this._row_height = parseInt(rh);
		}

		this._computeFullSize();
	}

	/**
	 * 
	 */

	protected _on_dblclk( e: UIEvent, row: number ) {
		
	}

	/**
	 * 
	 */

	private _update(force = false) {

		if (!this._lock) {
			const rc = this.getBoundingRect();

			// rows
			const rowc = this._dataview ? this._dataview.getCount() : 0;

			// empty ?
			if( rowc==0 ) {
				this._body.setContent( new Label( { cls: "empty vertical", icon: icons.empty, text: this.props.emptyMsg ?? _tr.global.empty_list } ) );
				return;
			}


			const mul = rowc < SCROLL_LIMIT ? this._row_height : 1;

			const start = Math.floor(this._top / mul);
			const end = start + Math.ceil(rc.height / this._row_height);
			const hasFixed = this._has_fixed;

			if (this._start != start || this._end != end || force) {

				const rows: Component[] = [];
				const headers: Component[] = [];

				if (force) {
					this._vis_rows.clear();
				}

				let newvis: typeof this._vis_rows = new Map();

				let y = start * mul;
				
				for (let row = start; row < end && row < rowc; row++, y += this._row_height) {

					let el = this._vis_rows.get(row);
					const rec = this._dataview.getByIndex(row);

					if (hasFixed) {
						if (!el) {
							el = {
								h: this._buildRowHeader(row, rec, y),
								r: this._buildRow(row, rec, y),
							};
						}
						else {
							el.h.setStyleValue("top", y + "px");
							el.r.setStyleValue("top", y + "px");
						}

						headers.push(el.h);
					}
					else {
						if (!el) {
							el = { h: null, r: this._buildRow(row, rec, y), };
						}
						else {
							el.r.setStyleValue("top", y + "px");
						}
					}

					rows.push(el.r);
					newvis.set(row, el);
				}

				if (hasFixed) {
					headers.push(new Component({ cls: "cell-out", style: { top: y + "px" } }));
				}

				this._vis_rows = newvis;
				this._start = start;
				this._end = end;

				this._body.setContent(rows);

				if (hasFixed) {
					this._vheader.removeClass("@hidden");
					this._vheader.setContent(headers);
				}
				else {
					this._vheader.addClass("@hidden");
				}
			}
		}
	}
	/**
	 * 
	 */

	clearSelection( ) {
		this._clearSelection( false );
	}

	/**
	 * Select every record of the view (with multisel only).
	 * The id of each record is kept, and selectionChange gives them all:
	 * on a very large view this costs memory.
	 */

	selectAll( ) {
		const count = this._dataview ? this._dataview.getCount( ) : 0;
		if( !this.props.multisel || !count ) {
			return;
		}

		for( let row=0; row<count; row++ ) {
			this._selection.add( this._dataview.getIdByIndex( row ) );
		}

		this.queryAll(".row").forEach(el => {
			el.addClass("selected");
		});

		this.fire("selectionChange", { selection: this.getSelection( ), empty: false } );
	}

	private _clearSelection( notify: boolean ) {
		if( !this._selection.size ) {
			return;
		}

		this.queryAll(".row.selected").forEach(el => {
			el.removeClass("selected");
		});

		this._selection.clear();
		if( notify ) {
			this.fire("selectionChange", { selection: [], empty: true } );
		}
	}

	/**
	 * 
	 */

	private _addSelection(rowid: number, notify = true) {
		this._selection.add( this._dataview.getIdByIndex( rowid ) );

		const els = this.queryAll(`.row[data-row="${rowid}"]`)
		els.forEach(el => {
			el.addClass("selected");
		});

		// all that is selected, not this row only
		if( notify ) {
			this.fire("selectionChange", { selection: this.getSelection( ), empty: false } );
		}
	}

	/**
	 * 
	 */
	
	getSelection( ) {
		// a record may be gone: out of the document, the grid does not follow its store
		const recs: DataRecord[] = [];
		for (const id of this._selection) {
			const rec = this._dataview.getById( id );
			if (rec) {
				recs.push( rec );
			}
		}

		return recs.length ? recs : null;
	}

	/**
	 *
	 */

	getFirstSel( ) {
		for (const id of this._selection) {
			const rec = this._dataview.getById( id );
			if (rec) {
				return rec;
			}
		}

		return null;
	}

	/**
	 * 
	 */

	selectItem( id: any, ensureVisible = true ) {
		const index = this._dataview.indexOfId( id );
		if( index>=0 ) {
			this._addSelection( index );
			if( ensureVisible ) {
				this._scrollToIndex( index );
			}
		}
	}

	/**
	 * 
	 */

	setColTitle( col_name: any, title: string ) {
		const col = this._columns.findIndex( x => x.id==col_name );
		if( col>=0 ) {
			this._columns[col].title = title;
			const el = this._hheader.query<SimpleText>(`[data-col="${col}"] .title` )
			el.setText( title );
		}
	}
}


