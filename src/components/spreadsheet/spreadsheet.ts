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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { Component, ComponentContent, ComponentEvents, ComponentProps, EvClick, EvContextMenu, EvDblClick, EvSelectionChange, componentFromDOM } from '../../core/component';
import { GridColumn } from '../gridview/gridview'

import { class_ns, isNumber, isString, UnsafeHtml } from '../../core/core_tools';
import { CoreEvent, EventCallback, EventMap } from '../../core/core_events';
import { kbNav } from '../../core/core_tools';

import { Icon } from '../icon/icon';
import { Image } from '../image/image'
import { Box } from '../boxes/boxes';
import { CSizer } from '../sizers/sizer'
import { Viewport } from '../viewport/viewport';
import { SimpleText } from '../label/label';

import check_icon from "../checkbox/check.svg";
import "./spreadsheet.module.scss"
import { CoreElement } from '../../x4.js';

interface CellRef {
	col: number;
	row: number;
}

export type CellClassifier = ( row: number, col: number ) => string;	    // return the cell computed class
export type RowClassifier = (row: number ) => string;	    				// return the row computed class
export type CellRenderer = (row: number, col: number, content: any) => Component;

export interface SpreadsheetColumn extends Omit<GridColumn,"classifier"> {
    cellClassifier?: CellClassifier;
}


function mkid(row: number, col: number) {
	return ((row & 0xfffff) << 12) | (col & 0xfff);
}

/**
 * 
 */

export interface EvChange extends CoreEvent {
}

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
			this.fire("changed", {});
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
}

export interface SpreadsheetProps extends ComponentProps {
	footer?: boolean;
	store: Store;
	columns: SpreadsheetColumn[];
	rowClassifier?: RowClassifier;


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
 * 
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

		this.mapPropEvents(props, "click", "dblClick", "contextMenu", "selectionChange");

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

			default:
				return;
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
				if( m===undefined || m>row ) { m = row; col=x&0xff; }
				if( M===undefined || M<row ) { M = row; col=x&0xff; }
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
				//this._scrollToIndex( nline );
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
					if( this._store.hasData( x ) ) {
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
					return new Icon({ cls: "cell-check" + cls, iconId: check_icon });
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

			if (this._selection.has(mkid(col, rowid))) {
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


		// CLICK
		this.addDOMEvent("click", (e) => {
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
			const ref = targetCell(e);
			if (ref) {
				//TODO: multiselection
				if (!this._selection.has(ref.ref)) {
					this._clearSelection(false);
					this._addSelection(ref.ref,true);
				}

				this.fire( "dblClick", { context: { row: ref.row, col: ref.col } } );
			}
		});

		// CONTEXT
		this.addDOMEvent("contextmenu", (e) => {
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
			this.fire("selectionChange", { selection, empty: selection.length != 0 });
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
}

