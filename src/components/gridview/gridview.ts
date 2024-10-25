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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


import { Component, ComponentContent, ComponentEvents, ComponentProps, EvClick, EvContextMenu, EvDblClick, EvSelectionChange, componentFromDOM } from '../../core/component';
import { class_ns, isNumber, isString, setWaitCursor } from '../../core/core_tools';
import { DataModel, DataStore, DataView, DataRecord, DataFieldValue, EvViewChange } from '../../core/core_data';
import { EventCallback } from '../../core/core_events';


import { Icon } from '../icon/icon';
import { Image } from '../image/image'
import { Box } from '../boxes/boxes';
import { CSizer } from '../sizers/sizer'
import { Viewport } from '../viewport/viewport';
import { SimpleText } from '../label/label';

import check_icon from "../checkbox/check.svg";
import "./gridview.module.scss"

export type CellRenderer = (rec: DataRecord) => Component;
type ColType = "number" | "money" | "checkbox" | "date" | "string" | "image" | "percent" | "icon";


const SCROLL_LIMIT = 200;


/**
 * 
 */

interface GridColumn {
	id: any;
	title: string;
	width: number;
	fixed?: boolean;
	flex?: number;
	align?: 'left' | 'center' | 'right';
	renderer?: CellRenderer;				// for "renderer" type
	formatter?: (input: any) => string;	// for "custom" type
	type?: ColType;
	cls?: string;
	sortable?: boolean;
	footer_val?: string;
}

interface GridColumnEx extends GridColumn {
	sens?: "up" | "dn";
}

interface GridviewEvents extends ComponentEvents {
	click?: EvClick;
	dblClick?: EvDblClick;
	contextMenu?: EvContextMenu;
	selectionChange?: EvSelectionChange;
}

interface GridviewProps extends ComponentProps {
	footer?: boolean;
	store: DataStore;
	columns: GridColumn[];

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
export class Gridview extends Component<GridviewProps, GridviewEvents> {

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

	private _selection: Set<number>;
	private _num_fmt = new Intl.NumberFormat('fr-FR');
	private _mny_fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
	private _dte_fmt = new Intl.DateTimeFormat('fr-FR', {});

	private _has_fixed: boolean;
	private _has_footer: boolean;

	constructor(props: GridviewProps) {
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

		this.mapPropEvents( props, "click", "dblClick", "contextMenu", "selectionChange" );

		this.lock(true);
		this.setAttribute("tabindex", 0);

		this.addDOMEvent("created", () => {
			this._init();
			this._dirty = 1;
			this.lock(false);
		});

		this.addDOMEvent("resized", () => {
			this._updateFlexs( );
			this._computeFullSize( );
			this._update( true );
		});

		if (props.store) {
			this.setStore(props.store);
		}

	}

	/**
	 * 
	 */

	setStore(store: DataStore) {

		const on_change = (ev: EvViewChange) => {

			if (ev.change_type == 'change') {
				this._selection.clear();
			}

			this._updateFlexs( );
			this._computeFullSize();
			this._update(true);
		}

		// unlink previous observer
		if (this._dataview) {
			this._dataview.off('view_change', on_change);
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

	/**
	 * 
	 */

	lock(lock: boolean) {
		if (lock) {
			this._lock++;
		}
		else {
			if (--this._lock == 0 && this._dirty) {
				this._update();
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
				this._updateFlexs( );
			})

			sizer.on("resize", (ev) => {
				cdata.width = ev.size;
				cdata.flex  = 0;
				
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
					new SimpleText({ text: cdata.title }),
					new Component({ cls: "sorter" }),
					sizer
				]
			});

			cell.addDOMEvent("touchend", () => {
				const last = cell.getInternalData("touchend");
				const now = Date.now();
				const delta = last ? now - last : 0;
				if (delta > 30 && delta < 300) {
					this.sortCol(col);
				}
				else {
					cell.setInternalData("touchend", now);
				}
			})

			cell.addDOMEvent("dblclick", () => {
				this.sortCol(col);
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

			cell.addDOMEvent("dblclick", () => {
				this.sortCol(col);
			});

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
	 * 
	 */

	navigate() {
	}

	/**
	 * 
	 */

	sortCol(col: number) {

		setWaitCursor(true);

		// to allow cursor
		this.setTimeout("sort", 50, () => {
			let asc = true;

			// already sorted ?
			const scol = this.query(`.col-header [data-col="${col}"`);
			if (scol.hasClass("sorted")) {
				if (scol.hasClass("desc")) {
					asc = true;
				}
				else {
					asc = false;
				}
			}
			else {
				const sorted = this.queryAll(".sorted");
				sorted.forEach(x => x.removeClass("sorted asc desc"));
			}

			scol.setClass("sorted");
			scol.setClass("desc", !asc);

			const cdata = this._getCol(col);

			let num = false;
			switch (cdata.type) {
				case "checkbox":
				case "money":
				case "number":
				case "percent": {
					num = true;
				}
			}

			this._dataview.sort([{
				field: cdata.id,
				ascending: asc,
				numeric: num
			}]);

			this._update(true);

			setWaitCursor(false);
		});

	}

	/**
	 * 
	 */

	private _renderCell(rec: DataRecord, col: string, type: string): ComponentContent {

		let data = this._datamodel.getRaw(col, rec);
		if (data === undefined || data === null) {
			return null;
		}

		let cls = "";

		//if( data.hasOwnProperty("cls") ) {
		//	cls = " " + (data as FieldValueWithCls).cls;
		//	data = (data as FieldValueWithCls).value;
		//	if( data===undefined ) {
		//		return null;
		//	}
		//}

		if (data instanceof Function) {
			return data(rec, col);
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
					cls: "percent" + cls,
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

	private _buildRow(rowid: number, rec: DataRecord, top: number) {

		const els: Component[] = [];
		const count = this._getColCount();

		for (let col = 0; col < count; col++) {
			const cdata = this._getCol(col);
			if (cdata.fixed) {
				continue;
			}

			const content = this._renderCell(rec, cdata.id, cdata.type);

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

			els.push(el);
		}

		const rowel = new Box({ cls: "row", style: { top: top.toFixed(2) + "px" }, content: els });
		rowel.setData("row", rowid + "");

		if (this._selection.has(rowid)) {
			rowel.addClass("selected");
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

			const content = this._renderCell(rec, cdata.id, cdata.type);

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

		if (this._selection.has(rowid)) {
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
		
			if( !cdata.fixed && cdata.flex ) {
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
		
		let flexw = 0;
		let flexc = 0;

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

		const maxr = this._dataview.getCount();
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

		this._viewport.setDOMEvents({
			scroll: (ev) => {
				// sync horz & vert elements
				this._left = this._viewport.dom.scrollLeft;
				this.setStyleVariable("--left", -this._left + "px");

				this._top = this._viewport.dom.scrollTop;
				this.setStyleVariable("--top", -this._top + "px");

				//this.setTimeout( "update", 0, ( ) => this._update( ) );
				this._update()
			}
		});

		this.addDOMEvent("wheel", (ev: WheelEvent) => {
			if (ev.deltaY && this._dataview.getCount() >= SCROLL_LIMIT) {
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

		this.addDOMEvent("click", (e) => {
			let el = Component.parentElement(e.target as HTMLElement, Component);
			while (el && !el.hasClass("row")) {
				el = el.parentElement();
			}

			if (el) {
				const data = el.getData("row");
				if (data) {
					//TODO: multiselection
					this._clearSelection();
					const row = parseInt(data);
					this._addSelection(row);
				}
			}
		});

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

		this.addDOMEvent("mouseleave", (e) => {

			if (!this._has_fixed) {
				return;
			}

			this.queryAll(".hover").forEach(x => x.removeClass("hover"));
		});

		this._updateFlexs( );

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
			const rowc = this._dataview.getCount();
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

	private _clearSelection() {
		for (const ref of this._selection.keys()) {
			const els = this.queryAll(`.row[data-row="${ref}"]`)
			els.forEach(el => {
				el.removeClass("selected");
			})
		}

		this._selection.clear();
	}

	/**
	 * 
	 */

	private _addSelection(rowid: number) {
		this._selection.add(rowid)

		const els = this.queryAll(`.row[data-row="${rowid}"]`)
		els.forEach(el => {
			el.addClass("selected");
		});

		const rec = this._dataview.getByIndex( rowid );
		this.fire("selectionChange", { selection: rec } );
	}

	/**
	 * 
	 */
	
	getSelection( ) {
		if( this._selection.size==0 ) {
			return null;
		}

		const ids = Array.from( this._selection.values() );
		return ids.map( id => this._dataview.getByIndex(id) );
	}
}

