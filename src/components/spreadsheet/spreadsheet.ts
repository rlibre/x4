/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file spreadsheet.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { Component, ComponentContent, ComponentEvent, ComponentEvents, ComponentProps, EvChange, EvClick, EvContextMenu, EvDblClick, EvSelectionChange, componentFromDOM } from '../../core/component';
import { GridColumn } from '../gridview/gridview'

import { class_ns, IFormElement, isFunction, isNumber, isString, UnsafeHtml } from '../../core/core_tools';
import { CoreEvent, EventCallback, EventMap } from '../../core/core_events';
import { kbNav } from '../../core/core_tools';

import { Icon } from '../icon/icon';
import { Image } from '../image/image'
import { Box } from '../boxes/boxes';
import { CSizer } from '../sizers/sizer'
import { Viewport } from '../viewport/viewport';
import { SimpleText } from '../label/label';
import { Input } from '../input/input';
import { CoreElement } from '../../x4.js';

import icons from "../assets/icons"
import "./spreadsheet.module.scss"

interface CellRef {
	col: number;
	row: number;
}

export type SSCellClassifier = ( row: number, col: number ) => string;	    // return the cell computed class
export type RowClassifier = (row: number ) => string;	    				// return the row computed class
//export type CellRenderer = (row: number, col: number, content: any) => Component;

export type SSCellEditable = ( row: number, col: number ) => boolean;			// col is the column index
export type SSCellEditor = ( row: number, col: number, value: any ) => Component;	// col is the column index

export interface SpreadsheetColumn extends Omit<GridColumn,"classifier"> {
    cellClassifier?: SSCellClassifier;

	/** allow the inline edition of the cells of this column */
	editable?: boolean | SSCellEditable;

	/**
	 * custom cell editor (default is an input matching the column type)
	 * the component must implement the "form-element" interface
	 */
	editor?: SSCellEditor;
}

/**
 * fired before an edited value is written to the store
 * call preventDefault to refuse the value
 */

export interface EvCellChange extends ComponentEvent {
	row: number;
	col: number;		// column index
	colId: any;			// column id (the key in the store)
	value: any;			// new value, the handler can change it
	oldValue: any;
}

/**
 * fired for each key pressed on the grid (not while a cell is edited), before the default handling
 * call preventDefault to handle the key yourself
 */

export interface EvCellKey extends ComponentEvent {
	key: string;				// "F2", "Enter", "a"...
	row: number;				// selected cell, undefined if none
	col: number;				// column index
	uievent: KeyboardEvent;		// UI event that fire this event
}

interface CellEdit extends CellRef {
	editor: Component;
	initial?: string;	// text of the editor at start
	busy?: boolean;		// rows are being rebuilt, focus loss must be ignored
}


function mkid(row: number, col: number) {
	return ((row & 0xfffff) << 12) | (col & 0xfff);
}

/**
 * 
 */

export interface StoreEvents extends EventMap {
	changed: EvChange;
}

export class Store extends CoreElement<StoreEvents> {
	private _maxrows: number;
	private _data: Map<number, any>;
	private _lock: number;	// lock
	private _change: boolean;

	constructor() {
		super();

		this._data = new Map();
		this._lock = 0;
		this._change = false;
		this._maxrows = 0;
	}

	setMaxRowCount(rows: number) {

		if (this._maxrows == rows) {
			return
		}

		if (rows < this._maxrows) {
			const n = new Map<number, any>();
			this._data.forEach((v, k) => {
				const row = k >> 12;
				if (row <= rows) {
					n.set(k, v);
				}
			});
			this._data = n;
		}

		this._maxrows = rows;
		this._changed()
	}

	getRowCount(): number {
		return this._maxrows;
	}

	setData(row: number, col: number, data: any) {
		this._data.set(mkid(row, col), data);
		if (row > this._maxrows) {
			this._maxrows = row;
		}

		this._changed();
	}

	getData(row: number, col: number) {
		return this._data.get(mkid(row, col));
	}

	hasData( row: number, col?: number ) {
		return this._data.has( col===undefined ? row : mkid(row, col));
	}

	lock() {
		this._lock++;
	}

	unlock() {
		if (this._lock) {
			this._lock--;
			if (!this._lock && this._change) {
				this._changed();
			}
		}
	}

	removeRow( row_num: number ) {

		if( row_num>=this._maxrows ) {
			return;
		}

		const n = new Map<number, any>();
		this._data.forEach( (v, k) => {
			const row = k >> 12;
			if (row != row_num) {
				if( row>row_num ) {
					k = mkid(row-1,k&0xfff) 
				}
				
				n.set(k, v);
			}
		} );
		this._data = n;

		this._maxrows--;
		this._changed( );
	}

	private _changed() {
		if (!this._lock) {
			this.fire("changed", {value:null});
			this._change = false;
		}
		else {
			this._change = true;
		}
	}

	clear( ) {
		this._data = new Map();
		this._maxrows = 0;
		this._changed( );
	}
}


/**
 * 
 */

const SCROLL_LIMIT = 200;

export interface SpreadsheetEvents extends ComponentEvents {
	click?: EvClick;
	dblClick?: EvDblClick;
	contextMenu?: EvContextMenu;
	selectionChange?: EvSelectionChange;
	cellChange?: EvCellChange;
	cellKey?: EvCellKey;
}

export interface SpreadsheetProps extends ComponentProps {
	footer?: boolean;
	store: Store;
	columns: SpreadsheetColumn[];
	rowClassifier?: RowClassifier;

	/** where the selection goes when an edition is validated with Enter (default "down") */
	enterMove?: "down" | "right" | "none";

	cellChange?: EventCallback<EvCellChange>;
	cellKey?: EventCallback<EvCellKey>;
	click?: EventCallback<EvClick>;
	dblClick?: EventCallback<EvDblClick>;
	contextMenu?: EventCallback<EvContextMenu>;
	selectionChange?: EventCallback<EvSelectionChange>;
}

/**
 * we can handle
 * 4_095 cols and (1_048_575-1)/2 rows (this is a chrome limitation max pixels of scrollbars )
 */

/**
 * @cssvar
 * ```
 * --spreadsheet-background
 * --spreadsheet-border
 * --spreadsheet-header-cell-background
 * --spreadsheet-header-cell-color
 * --spreadsheet-header-cell-vline
 * --spreadsheet-header-cell-border
 * --spreadsheet-check-background
 * --spreadsheet-check-color
 * --spreadsheet-check-background-hover
 * --spreadsheet-check-color-hover
 * --spreadsheet-perc-background
 * --spreadsheet-perc-color
 * --spreadsheet-perc-background-hover
 * --spreadsheet-perc-color-hover
 * --spreadsheet-cell-color
 * --spreadsheet-cell-color-sel
 * --spreadsheet-cell-vline
 * --spreadsheet-row-background
 * --spreadsheet-row-odd-background
 * --spreadsheet-row-border
 * --spreadsheet-row-background-hover
 * --spreadsheet-row-background-hover-sel
 * --spreadsheet-row-background-sel
 * --spreadsheet-row-color-sel
 * --spreadsheet-fix-border
 * ```
 */

@class_ns("x4")
export class Spreadsheet<P extends SpreadsheetProps = SpreadsheetProps, E extends SpreadsheetEvents = SpreadsheetEvents> extends Component<P, E> {

	private _columns: SpreadsheetColumn[];
	private _store: Store;

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

	private _selection: Set<number>;
	private _num_fmt = new Intl.NumberFormat('fr-FR');
	private _mny_fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
	private _dte_fmt = new Intl.DateTimeFormat('fr-FR', {});

	private _has_fixed: boolean;
	private _has_footer: boolean;

	private _edit: CellEdit;	// cell being edited

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
		this._has_footer = props.footer;

		this._columns = props.columns.map(x => x);

		this.mapPropEvents(props, "click", "dblClick", "contextMenu", "selectionChange", "cellChange", "cellKey");

		this.lock(true);
		this.setAttribute("tabindex", 0);

		this.addDOMEvent("created", () => {
			this._init();
			this._dirty = 1;
			this.lock(false);
		});

		this.addDOMEvent("resized", () => {
			this._updateFlexs();
			this._computeFullSize();
			this._update(true);
		});

		this.addDOMEvent("keydown", (e) => {
			this._on_key(e);
		})

		if (props.store) {
			this.setStore(props.store);
		}

	}

	/**
	 * 
	 */

	private _on_key(ev: KeyboardEvent) {
		
		if (this.isDisabled()) {
			return;
		}

		// keys of the cell editor are handled by the editor
		if( this._edit ) {
			return;
		}

		// the application first
		const cur = this._curCell( );
		const kev: EvCellKey = { key: ev.key, row: cur?.row, col: cur?.col, uievent: ev };
		this.fire( "cellKey", kev );

		if( kev.defaultPrevented ) {
			ev.preventDefault();
			ev.stopPropagation();
			return;
		}

		switch (ev.key) {
			case "ArrowDown": {
				this.navigate(kbNav.next);
				break;
			}

			case "ArrowUp": {
				this.navigate(kbNav.prev);
				break;
			}

			case "ArrowLeft": {
				this.navigate(kbNav.left);
				break;
			}

			case "ArrowRight": {
				this.navigate(kbNav.right);
				break;
			}

			case "Home": {
				this.navigate(kbNav.first);
				break;
			}

			case "End": {
				this.navigate(kbNav.last);
				break;
			}

			case "PageDown": {
				this.navigate(kbNav.pgdn);
				break;
			}

			case "PageUp": {
				this.navigate(kbNav.pgup);
				break;
			}

			case "F2":
			case "Enter": {
				const sel = this._curCell( );
				if( !sel || !this.editCell( sel.row, sel.col ) ) {
					return;
				}
				break;
			}

			case "Delete": {
				const sel = this._curCell( );
				if( !sel || !this._isEditable( sel.row, sel.col ) ) {
					return;
				}

				this._setCellValue( sel.row, sel.col, null );
				break;
			}

			default: {
				const sel = this._curCell( );
				if( !sel ) {
					return;
				}

				if( ev.key==" " && this._toggleCell( sel.row, sel.col ) ) {
					break;
				}

				// a typed char starts the edition: the editor takes the focus, so the char goes into it
				const altgr = ev.getModifierState( "AltGraph" );
				if( ev.key.length==1 && ( altgr || ( !ev.ctrlKey && !ev.altKey && !ev.metaKey ) ) ) {
					this.editCell( sel.row, sel.col, true );
				}

				return;
			}
		}

		ev.preventDefault();
		ev.stopPropagation();
	}

	/**
	 * 
	 */

	navigate(sens: kbNav) {
		if (!this._selection.size) {
			if (sens == kbNav.next || sens == kbNav.pgdn) {
				sens = kbNav.first;
			}
			else {
				sens = kbNav.last;
			}
		}

		const getLineSel = ( top: boolean ) => {
			let m: number, M: number;
			let col: number;

			this._selection.forEach( x => {
				const row = x>>12;
				if( m===undefined || m>row ) { m = row; col=x&0xfff; }
				if( M===undefined || M<row ) { M = row; col=x&0xfff; }
			} );

			return [top ? m : M, col]
		}

		if (sens == kbNav.first || sens == kbNav.last) {
			let nline = sens == kbNav.first ? 0 : this._store.getRowCount() - 1;
			this._clearSelection(false);
			this._addSelection(mkid(nline,0), true);
			this._scrollToIndex(nline);
			return true;
		}
		else if (sens == kbNav.prev || sens == kbNav.next) {
			
			const [fline,col] = getLineSel( sens == kbNav.prev );

			let nline = sens == kbNav.next ? fline + 1 : fline - 1;
			if (nline >= 0 && nline < this._store.getRowCount()) {
				this._clearSelection(false);
				this._addSelection( mkid(nline,col), true);
				this._scrollToIndex( nline );
				return true;
			}
		}
		else if (sens == kbNav.pgdn || sens == kbNav.pgup) {
			const pgh = this._vis_rows.size;
			const [fline,col] = getLineSel( sens == kbNav.pgup );

			let sby = sens == kbNav.pgdn ? pgh : -pgh;
			let nline = fline + sby;

			if (nline < 0) {
				nline = 0;
			}
			else if (nline >= this._store.getRowCount()) {
				nline = this._store.getRowCount() - 1;
			}

			if (nline != fline) {
				this._clearSelection( false );
				this._addSelection(mkid(nline,col), true);

				if (this._store.getRowCount() < SCROLL_LIMIT) {
					sby *= this._row_height;
				}

				this._viewport.dom.scrollBy(0, sby);
				return true;
			}
		}
		else if( sens==kbNav.left || sens==kbNav.right ) {
			const [fline,col] = getLineSel( sens == kbNav.left );

			let ncol = sens == kbNav.right ? col+1 : col-1;
			if (ncol >= 0 && ncol < this._columns.length ) {
				this._clearSelection(false);
				this._addSelection( mkid(fline,ncol), true);

				// fixed columns are always visible
				if( !this._getCol(ncol).fixed ) {
					const cell = this.query( `.cell[data-ref="${mkid(fline,ncol)}"]` );
					cell?.scrollIntoView( { block: "nearest", inline: "nearest" } );
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * 
	 */

	private _scrollToIndex(index: number, block = 'nearest') {

		// is it already visible ?
		let ref = mkid(index,0);
		let rows = this.queryAll(`.cell[data-ref="${ref}"]`);
		if (rows.length) {
			rows[0].scrollIntoView({ block: block as any });
		}
		// nope, refill
		else {
			let top = index;
			if (this._store.getRowCount() < SCROLL_LIMIT) {
				top *= this._row_height;
			}

			this._viewport.dom.scrollTo(0, top);
		}
	}

	/**
	 * 
	 */

	setStore(store: Store) {

		const on_change = (ev: EvChange) => {
			if (!this._viewport) {
				// not created
				return;
			}

			// try to keep selection
			if (ev.type == 'changed' && this._selection.size ) {
				const nsel = new Set<number>();
				this._selection.forEach(x => {
					// selection use column index, store use column id
					const cdata = this._getCol( x & 0xfff );
					if( cdata && this._store.hasData( x >> 12, cdata.id ) ) {
						nsel.add( x );
					}
				});

				this._selection = nsel;
			}

			this._updateFlexs();
			this._computeFullSize();
			this._update(true);
		}

		// unlink previous observer
		if (this._store) {
			this._store.off('changed', on_change);
		}

		if (store) {
			this._store = store;
			this._store.on('changed', on_change);
		}
		else {
			this._store = null;
		}
	}

	/**
	 * 
	 */

	lock(lock: boolean) {
		if (lock) {
			this._lock++;
		}
		else {
			if (--this._lock == 0 && this._dirty) {
				this._update(true);
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

			sizer.on("stop", () => {
				this._updateFlexs();
			})

			sizer.on("resize", (ev) => {
				cdata.width = ev.size;
				cdata.flex = 0;

				const cols = this.queryAll(`[data-col="${col}"]`)
				cols.forEach(c => {
					c.setStyleValue("width", ev.size + "px");
				});

				const rh = header.getBoundingRect();

				if (!fixed) {
					this._body.setStyleValue("width", rh.width + "px");
				}
				else {
					this.setStyleVariable("--fixed-width", rh.width + "px");
				}
			})

			const cell = new Component({
				cls: `cell`,
				attrs: { "data-col": col },
				style: { width: cdata.width ? cdata.width + "px" : undefined },
				content: [
					new SimpleText({ text: cdata.title, align: cdata.header_align ?? "left" }),
					new Component({ cls: "sorter" }),
					sizer
				]
			});

			/*
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
			*/

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

	private _buildColFooter(fixed: boolean) {
		// row header
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

			/*
			cell.addDOMEvent("dblclick", () => {
				this._sortCol(col);
			});
			*/

			els.push(cell);
		}

		if (fixed && els.length == 0) {
			return null;
		}

		const header = new Box({ cls: "col-footer", content: els });
		header.setClass("fixed", fixed);

		return header;
	}
	/**
	 * extra_cls est input/output
	 */

	private _renderCell(row: number, column: SpreadsheetColumn, extra_cls: string[]): ComponentContent {

		const col = column.id;
		const type = column.type;

		let data = this._store.getData( row, col );
		if (data === undefined || data === null) {
			return null;
		}

        let cls = "";
		if( column.cellClassifier ) {
			extra_cls.push( column.cellClassifier( row, col ) );
		}

        if( data instanceof UnsafeHtml ) {
            return data;
        }

		if (column.formatter) {
			return column.formatter(data);
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

				data = this._num_fmt.format(data as number);
				break;
			}

			case "money": {
				if (!isNumber(data)) {
					return "NaN";
				}

				data = this._mny_fmt.format(data as number);
				break;
			}

			case "percent": {
				return new Box({
					cls: "percent " + cls,
					content: new Component({ cls: "bar", width: data + "%" })
				});
			}

			case "icon": {
				return new Icon({ cls, iconId: data + "" });
			}

			case "date": {
				data = this._dte_fmt.format(data as Date);
				break;
			}

			default: {
				data = data + "";
				break;
			}
		}

		return new Component({ tag: "span", cls, content: data });
	}

	/**
	 * 
	 */

	private _buildRow(rowid: number, top: number) {

		const els: Component[] = [];
		const count = this._getColCount();

		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if (cdata.fixed) {
				continue;
			}

			const extra: string[] = []
			const content = this._renderCell(rowid, cdata, extra);

			const el = new Component({
				cls: "cell",
				attrs: { "data-col": col },
				style: { width: cdata?.width ? cdata.width + "px" : undefined },
				content
			});

			switch (cdata.align) {
				case "center": 	el.addClass( "align-center" ); break;
				case "right": 	el.addClass( "align-right" ); break;
			}

			if (extra.length) {
				el.addClass(extra.join(' '));
			}

			if (cdata.type) {
				el.addClass(cdata.type);
			}

			const ref = mkid(rowid, col);
			if (this._selection.has(ref)) {
				el.addClass("selected");
			}

			el.setInternalData("col", col);
			el.setInternalData("row", rowid)
			el.setData("ref", ref + "");

			els.push(el);
		}
		
		let row_cls = 'row';
		if( this.props.rowClassifier ) {
			const xtra = this.props.rowClassifier( rowid );
			if( xtra ) {
				row_cls += ' ' + xtra.trim();
			}
		}

		return new Box({ cls: row_cls, style: { top: top.toFixed(2) + "px" }, content: els });
	}

	/**
	 * 
	 */

	private _buildRowHeader(rowid: number, top: number) {

		const cols: Component[] = [];
		const count = this._getColCount();

		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if (!cdata?.fixed) {
				continue;
			}

			const content = this._renderCell(rowid, cdata, [cdata.type]);

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

			el.setInternalData("col", col);
			el.setInternalData("row", rowid);
			el.setData("ref", mkid(rowid, col) + "");

			if (this._selection.has(mkid(rowid, col))) {
				el.addClass("selected");
			}



			cols.push(el);
		}

		return new Box({ cls: "row", style: { top: top + "px" }, content: cols });
	}

	/**
	 * 
	 */

	private _updateFlexs() {
		let maxw = 0;
		let flexc = 0;

		const ccount = this._getColCount();

		for (let x = 0; x < ccount; x++) {
			const cdata = this._getCol(x);

			if (!cdata.fixed && cdata.flex) {
				flexc += cdata.flex;
			}
			else {
				maxw += cdata.width;
			}
		}

		if (flexc) {
			const width = this._viewport.dom.clientWidth;
			const delta = width - maxw;
			const fw = delta / flexc;

			for (let col = 0; col < ccount; col++) {
				const cdata = this._getCol(col);
				if (!cdata.fixed && cdata.flex) {
					cdata.width = Math.max(cdata.flex * fw, 32);

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

			if (cdata.width) {
				w += cdata.width;
			}

			if (cdata.fixed) {
				maxfw += w;
			}
			else {
				maxw += w;
			}
		}

		const maxr = this._store ? this._store.getRowCount() : 0;
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
		this._body.setStyleValue("height", maxh + "px");
		this._body.setStyleValue("width", maxw + "px");
		this._vheader.setStyleValue("height", maxh + "px");
	}

	/**
	 * 
	 */

	private _init() {
		this._body = new Component({ cls: "body" });

		this._viewport = new Viewport({ content: this._body });

		if (!this._has_footer) {
			this.setStyleVariable("--footer-height", "0");
		}

		// SCROLL
		this._viewport.addDOMEvent("scroll", (ev) => {
			// sync horz & vert elements
			this._left = this._viewport.dom.scrollLeft;
			this.setStyleVariable("--left", -this._left + "px");

			this._top = this._viewport.dom.scrollTop;
			this.setStyleVariable("--top", -this._top + "px");

			//this.setTimeout( "update", 0, ( ) => this._update( ) );
			this._update()
		});

		// WHEEL
		this.addDOMEvent("wheel", (ev: WheelEvent) => {
			if (ev.deltaY && this._store && this._store.getRowCount() >= SCROLL_LIMIT) {
				this._viewport.dom.scrollBy(0, ev.deltaY < 0 ? -1 : 1);
				ev.stopPropagation();
				ev.preventDefault();
			}

			if (this._has_fixed && ev.deltaY) {
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

		const targetCell = (e: MouseEvent) => {
			let el = e.target as Element;
			while (el && !el.classList.contains("cell")) {
				el = el.parentElement;
			}

			if (el) {
				const cel = componentFromDOM(el);
				return {
					ref: cel.getIntData("ref"),
					row: cel.getInternalData("row"),
					col: cel.getInternalData("col"),
				}
			}

			return undefined;
		}


		// MOUSEDOWN
		this.addDOMEvent("mousedown", (e) => {
			if( !this._edit || this._inEditor(e) ) {
				return;
			}

			// click on another cell while editing:
			// validate now, rows may be rebuilt before the click event (and the click lost)
			const ref = targetCell(e);
			if( ref && ref.row!==undefined ) {
				this._endEdit( true, true );

				if (!this._selection.has(ref.ref)) {
					this._clearSelection( false );
					this._addSelection(ref.ref,true);
				}

				e.preventDefault( );
			}
		});

		// CLICK
		this.addDOMEvent("click", (e) => {
			if( this._inEditor(e) ) {
				return;
			}

			const ref = targetCell(e);
			if (ref) {
				//TODO: multiselection
				if (!this._selection.has(ref.ref)) {
					this._clearSelection( false );
					this._addSelection(ref.ref,true);
				}
			}
		});

		// DBLCLICK
		this.addDOMEvent("dblclick", (e) => {
			if( this._inEditor(e) ) {
				return;
			}

			const ref = targetCell(e);
			if (ref) {
				//TODO: multiselection
				if (!this._selection.has(ref.ref)) {
					this._clearSelection(false);
					this._addSelection(ref.ref,true);
				}

				const dev: EvDblClick = { context: { row: ref.row, col: ref.col } };
				this.fire( "dblClick", dev );

				// checkboxes are toggled, other cells are edited
				if( !dev.defaultPrevented && !this._toggleCell( ref.row, ref.col ) ) {
					this.editCell( ref.row, ref.col );
				}
			}
		});

		// CONTEXT
		this.addDOMEvent("contextmenu", (e) => {
			// keep the native menu of the editor (copy/paste)
			if( this._inEditor(e) ) {
				return;
			}

			const ref = targetCell(e);
			if (ref) {
				//TODO: multiselection
				if (!this._selection.has(ref.ref)) {
					this._clearSelection( false );
					this._addSelection(ref.ref, true );
				}

				this.fire( "contextMenu", { uievent: e, context: { row: ref.row, col: ref.col } } );
			}
			else {
				this.fire( "contextMenu", { uievent: e, context: null } );
			}

			e.preventDefault();
			e.stopPropagation();
		});

		this._updateFlexs();

		this._fheader = this._buildColHeader(true);
		this._hheader = this._buildColHeader(false);
		this._vheader = new Box({ cls: "row-header" })

		if (this._has_footer) {
			this._ffooter = this._buildColFooter(true);
			this._footer = this._buildColFooter(false);
		}

		this.setContent([this._viewport, this._fheader, this._hheader, this._ffooter, this._footer, this._vheader]);

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

	private _update(force = false) {

		if (!this._lock) {
			const rc = this.getBoundingRect();

			// rows
			const rowc = this._store ? this._store.getRowCount() : 0;
			const mul = rowc < SCROLL_LIMIT ? this._row_height : 1;

			const start = Math.floor(this._top / mul);
			const end = start + Math.ceil(rc.height / this._row_height);
			const hasFixed = this._has_fixed;

			if (this._start != start || this._end != end || force) {

				// rows are rebuilt: the cell editor must survive
				const edit = this._edit;
				const edit_focus = edit ? edit.editor.dom.contains( document.activeElement ) : false;
				if( edit ) {
					edit.busy = true;
				}

				const rows: Component[] = [];
				const headers: Component[] = [];

				if (force) {
					this._vis_rows.clear();
				}

				let newvis: typeof this._vis_rows = new Map();

				let y = start * mul;

				for (let row = start; row < end && row < rowc; row++, y += this._row_height) {

					let el = this._vis_rows.get(row);
					//const rec = this._store.getByIndex(row);

					if (hasFixed) {
						if (!el) {
							el = {
								h: this._buildRowHeader(row, y),
								r: this._buildRow(row, y),
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
							el = { h: null, r: this._buildRow(row, y), };
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

				if( edit && this._edit===edit ) {
					this._restoreEditor( edit, edit_focus );
				}
			}
		}
	}
	/**
	 * 
	 */

	private _clearSelection(notify = true) {
		for (const ref of this._selection.keys()) {
			const els = this.queryAll(`.cell[data-ref="${ref}"]`)
			els.forEach(el => {
				el.removeClass("selected");
			})
		}

		this._selection.clear();

		if (notify) {
			this.fire("selectionChange", { selection: [], empty: true });
		}
	}

	/**
	 * 
	 */

	private _addSelection(ref: number, notify = true) {
		this._selection.add(ref)

		const els = this.queryAll(`.cell[data-ref="${ref}"]`)
		els.forEach(el => {
			el.addClass("selected");
		});

		if (notify) {
			const selection = this.getSelection();
			this.fire("selectionChange", { selection, empty: selection.length == 0 });
		}
	}

	/**
	 * 
	 */

	getSelection(): CellRef[] {
		const selection: CellRef[] = [];

		this._selection.forEach(x => {
			selection.push({
				row: x >> 12,
				col: x & 0xfff,
			})
		});

		return selection;
	}

	/**
	 * 
	 */

	selectItem(row: number, col: number, append = false) {
		if (!append) {
			this._clearSelection(false);
		}

		this._addSelection(mkid(row, col), true);
	}

	// :: EDITION ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

	/**
	 * @returns the selected cell when there is exactly one
	 */

	private _curCell( ): CellRef {
		if( this._selection.size!=1 ) {
			return null;
		}

		const ref = this._selection.values().next().value as number;
		return { row: ref >> 12, col: ref & 0xfff };
	}

	private _inEditor( e: Event ) {
		return !!this._edit && this._edit.editor.dom.contains( e.target as Node );
	}

	/**
	 *
	 */

	private _isEditable( row: number, col: number ) {
		const cdata = this._getCol( col );
		if( !cdata?.editable || !this._store || this.isDisabled() ) {
			return false;
		}

		if( !(row>=0) || row>=this._store.getRowCount() ) {
			return false;
		}

		if( isFunction(cdata.editable) && !cdata.editable( row, col ) ) {
			return false;
		}

		// html content & images cannot be edited by the default editor
		if( !cdata.editor ) {
			if( cdata.type=="image" || cdata.type=="icon" ) {
				return false;
			}

			if( this._store.getData( row, cdata.id ) instanceof UnsafeHtml ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * write a value to the store (after cellChange agreement)
	 * @returns true if the value was written
	 */

	private _setCellValue( row: number, col: number, value: any ) {
		const cdata = this._getCol( col );
		if( !cdata || !this._store || row>=this._store.getRowCount() ) {
			return false;
		}

		const empty = ( v: any ) => v===undefined || v===null || v==="";
		const same = ( a: any, b: any ) => {
			if( a instanceof Date && b instanceof Date ) {
				return a.getTime()==b.getTime();
			}

			return a===b || ( empty(a) && empty(b) );
		}

		const oldValue = this._store.getData( row, cdata.id );
		if( same( value, oldValue ) ) {
			return false;
		}

		const ev: EvCellChange = { row, col, colId: cdata.id, value, oldValue };
		this.fire( "cellChange", ev );

		if( ev.defaultPrevented ) {
			return false;
		}

		this._store.setData( row, cdata.id, ev.value );
		return true;
	}

	/**
	 * editable checkboxes are toggled without editor
	 */

	private _toggleCell( row: number, col: number ) {
		const cdata = this._getCol( col );
		if( cdata?.type!="checkbox" || cdata.editor || !this._isEditable( row, col ) ) {
			return false;
		}

		this._setCellValue( row, col, !this._store.getData( row, cdata.id ) );
		return true;
	}

	/**
	 * default editor: an input matching the column type
	 */

	private _createEditor( cdata: SpreadsheetColumn, value: any, clear: boolean ): Component {
		switch( cdata.type ) {
			case "number":
			case "money":
			case "percent": {
				const ed = new Input( { type: "number", value: !clear && isNumber(value) ? value : undefined } );
				ed.setAttribute( "step", "any" );
				return ed;
			}

			case "date": {
				return new Input( { type: "date", value: !clear && value instanceof Date ? value : undefined } );
			}

			default: {
				return new Input( { type: "text", value: clear || value===undefined || value===null ? "" : value+"" } );
			}
		}
	}

	/**
	 * @returns the value of the editor, undefined if there is nothing to write
	 */

	private _readEditor( edit: CellEdit ): any {
		const cdata = this._getCol( edit.col );
		if( !cdata ) {
			return undefined;
		}

		if( cdata.editor ) {
			const fe = edit.editor.queryInterface<IFormElement>( "form-element" );
			return fe && fe.isValid() ? fe.getRawValue( ) : undefined;
		}

		const input = edit.editor as Input;
		if( (input.dom as HTMLInputElement).validity?.badInput ) {
			return undefined;
		}

		const text = input.getValue( );
		if( text===edit.initial ) {
			return undefined;	// untouched
		}

		switch( cdata.type ) {
			case "number":
			case "money":
			case "percent": {
				const v = parseFloat( text );
				return isNaN(v) ? null : v;
			}

			case "date": {
				const [y,m,d] = text.split( "-" ).map( x => parseInt(x) );
				return y ? new Date( y, m-1, d ) : null;
			}

			default: {
				// keep numbers as numbers
				const old = this._store.getData( edit.row, cdata.id );
				if( isNumber(old) && text!=="" && isFinite( Number(text) ) ) {
					return Number( text );
				}

				return text;
			}
		}
	}

	private _focusEditor( editor: Component ) {
		const dom = editor.dom as HTMLElement;
		const el = dom.matches( "input,select,textarea" ) ? dom : dom.querySelector<HTMLElement>( "input,select,textarea,[tabindex]" );
		( el ?? dom ).focus( { preventScroll: true } );
	}

	/**
	 * rows have been rebuilt: put the editor back in its cell
	 */

	private _restoreEditor( edit: CellEdit, focus: boolean ) {
		const cell = this.query( `.cell[data-ref="${mkid(edit.row,edit.col)}"]` );
		if( !cell ) {
			// the cell is no more visible
			edit.busy = false;
			this._endEdit( true, focus );
			return;
		}

		if( edit.editor.dom.parentElement!=cell.dom ) {
			cell.addClass( "editing" );
			cell.appendContent( edit.editor );
		}

		if( focus ) {
			this._focusEditor( edit.editor );
		}

		edit.busy = false;
	}

	/**
	 *
	 */

	private _on_edit_key( ev: KeyboardEvent ) {
		// the grid must not handle the editor keys (navigation)
		ev.stopPropagation( );

		if( ev.isComposing ) {
			return;
		}

		switch( ev.key ) {
			case "Enter": {
				this._endEdit( true, true );

				const move = this.props.enterMove ?? "down";
				if( move=="down" ) {
					this.navigate( ev.shiftKey ? kbNav.prev : kbNav.next );
				}
				else if( move=="right" ) {
					this.navigate( ev.shiftKey ? kbNav.left : kbNav.right );
				}

				break;
			}

			case "Tab": {
				this._endEdit( true, true );
				this.navigate( ev.shiftKey ? kbNav.left : kbNav.right );
				break;
			}

			case "Escape": {
				this._endEdit( false, true );
				break;
			}

			default:
				return;
		}

		ev.preventDefault( );
	}

	/**
	 * @param refocus - give the focus back to the grid (default: only if the editor has it)
	 */

	private _endEdit( commit: boolean, refocus?: boolean ) {
		const edit = this._edit;
		if( !edit ) {
			return;
		}

		this._edit = null;

		const value = commit ? this._readEditor( edit ) : undefined;
		const dom = edit.editor.dom;

		if( refocus===undefined ) {
			refocus = dom.contains( document.activeElement );
		}

		const cell = componentFromDOM( dom.parentElement );
		cell?.removeClass( "editing" );
		dom.remove( );

		if( refocus ) {
			(this.dom as HTMLElement).focus( { preventScroll: true } );
		}

		if( value!==undefined ) {
			this._setCellValue( edit.row, edit.col, value );
		}
	}

	/**
	 * start the edition of a cell (the cell must be visible and its column editable)
	 * @param row - row index
	 * @param col - column index
	 * @param clear - start with an empty editor
	 * @returns false if the cell cannot be edited
	 */

	editCell( row: number, col: number, clear = false ): boolean {
		this._endEdit( true );

		const cdata = this._getCol( col );
		if( !this._isEditable( row, col ) || ( cdata.type=="checkbox" && !cdata.editor ) ) {
			return false;
		}

		const ref = mkid( row, col );
		const cell = this.query( `.cell[data-ref="${ref}"]` );
		if( !cell ) {
			return false;
		}

		if( this._selection.size!=1 || !this._selection.has(ref) ) {
			this._clearSelection( false );
			this._addSelection( ref, true );
		}

		const value = this._store.getData( row, cdata.id );
		const editor = cdata.editor ? cdata.editor( row, col, value ) : this._createEditor( cdata, value, clear );
		if( !editor ) {
			return false;
		}

		const edit: CellEdit = { row, col, editor };
		if( !cdata.editor ) {
			edit.initial = (editor as Input).getValue( );
		}

		editor.addClass( "cell-editor" );
		editor.addDOMEvent( "keydown", ( ev ) => this._on_edit_key( ev ) );

		// avoid a second dispatch of the editor handlers by the grid
		editor.addDOMEvent( "wheel", ( ev ) => ev.stopPropagation( ) );

		editor.addDOMEvent( "focusout", ( ev ) => {
			if( this._edit!==edit || edit.busy ) {
				return;
			}

			// focus is moving inside the editor
			const to = ev.relatedTarget as Node;
			if( to && editor.dom.contains(to) ) {
				return;
			}

			this._endEdit( true, false );
		});

		this._edit = edit;

		cell.addClass( "editing" );
		cell.appendContent( editor );
		this._focusEditor( editor );

		if( !clear && !cdata.editor ) {
			const input = editor as Input;
			if( cdata.type=="number" || cdata.type=="money" || cdata.type=="percent" ) {
				input.selectAll( );
			}
			else if( cdata.type!="date" ) {
				input.select( input.getValue().length, 0 );
			}
		}

		return true;
	}

	/**
	 * stop the current edition
	 * @param commit - false to cancel
	 */

	stopEdit( commit = true ) {
		this._endEdit( commit );
	}

	isEditing( ) {
		return !!this._edit;
	}
}

