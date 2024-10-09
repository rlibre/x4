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

import { Component, ComponentEvents, componentFromDOM, ComponentProps, EvContextMenu, EvDblClick, EvSelectionChange, wrapDOM } from '@core/component.js';
import { CoreEvent } from '@core/core_events.js';
import { Label } from '../label/label.js';
import { Icon } from '../icon/icon.js';

import { HBox, VBox } from '../boxes/boxes.js';
import { _tr } from '@core/core_i18n.js';
import { isFunction, unsafeHtml, UnsafeHtml } from '@core/core_tools.js';

import icon_arrow_up from "./icon-arrow-up.svg"
import icon_arrow_down from "./icon-arrow-down.svg"
import { DataStore, DataView } from './datastore.js';


interface Record {}


export interface EvGridCheck extends CoreEvent {
	rec: Record;
	chk: boolean;
}





/**
 * 
 */

interface GridColumn {
	id: any;
	title: string;
	width: number;
	flex?: number;
	align?: 'left' | 'center' | 'right';
	renderer?: CellRenderer;
	//formatter?: FormatFunc;
	cls?: string;
	sortable?: boolean;
}

interface GridColumnInternal extends GridColumn {
	$hdr: ColHeader;
	$ftr: Component;
}

export type CellRenderer = (rec: Record) => Component;
export type RowClassifier = (rec: Record, Row: Component) => void;
export type ContextMenuGridItem = (event: MouseEvent, item: Record, grid: GridView) => any;

type emptyFn = () => string;

interface GridViewEvents extends ComponentEvents {
	dblClick?: EvDblClick;
	selectionChange?: EvSelectionChange;
	contextMenu?: EvContextMenu;
	gridCheck?: EvGridCheck;
}

export interface GridViewProps extends ComponentProps {
	store: DataStore | DataView;
	columns: GridColumn[];
	calcRowClass?: RowClassifier;
	empty_text?: string | emptyFn;	// set or return '' to avoid message
	hasMarks?: boolean;	// if true add a checkbox on left side cf. clearMarks, getMarksIds
	hasFooter?: boolean;
}

/**
 * 
 */

class ColHeader extends Component<GridViewProps> {

	private m_sens: "up" | "dn";
	private m_sorted: boolean;
	private m_sorter: Icon
	
	constructor( props: GridViewProps, title: string ) {
		super( props );

		this.m_sorted = false;
		this.m_sens = 'dn';
	
		this.setContent( [
			new Label({
				tag: 'span',
				content: title
			}),
			this.m_sorter = new Icon( {
				cls: 'sort',
				hidden: true,
				iconId: icon_arrow_down
			})
		]);
	}

	isSorted( ) {
		return this.m_sorted;
	}

	//set sorted( v ) {
	//	this.m_sorted = v;
	//	this.m_sens = 'dn';
	//	this.itemWithRef<Icon>( 'sorter' ).show( v );
	//}

	sort( v: boolean, sens: "up" | "dn" ) {
		this.m_sorted = v;
        this.m_sens = sens;

		this.m_sorter.setIcon( this.m_sens == 'up' ? icon_arrow_down : icon_arrow_up );
		this.m_sorter.show(v);
	}

	get sens( ) {
		return this.m_sens;
	}

	toggleSens( ) {
		this.m_sens = this.m_sens=='up' ? 'dn' : 'up';
		this.m_sorter.setIcon( this.m_sens == 'up' ? icon_arrow_down : icon_arrow_up );
	}
}



/**
 * gridview class
 */

export class GridView extends VBox<GridViewProps, GridViewEvents> {

	protected m_dataview: DataView;
	protected m_data_cx: EventDisposer;

	protected m_columns: GridColumn[];

	protected m_view_el: Component;
	protected m_container: Component;
	protected m_header: Component;

	protected m_footer: Component;
	
	protected m_empty_msg: Label;
	protected m_empty_text: string | emptyFn;

	protected m_selection: any;
	private m_itemHeight: number;
	private m_topIndex: number;
	protected m_visible_rows: Component[];		// shown elements

	protected m_hasMarks: boolean;
	protected m_marks: Set<any>;	// checked elements

	private m_recycler: Component[];

	private m_rowClassifier: RowClassifier;

	constructor(props: GridViewProps) {
		super(props);

		this.m_columns = props.columns;
		this.m_hasMarks = props.hasMarks ?? false;
		this.m_marks = new Set<any>();

		// prepend the checkable column
		if (this.m_hasMarks) {
			this.m_columns.unshift({
				id: 'id',
				title: '',
				width: 30,
				renderer: (e) => this._renderCheck( e )
			});
		}

		this.setAttribute('tabindex', 0);

		this.m_topIndex = 0;
		this.m_itemHeight = 0;
		this.m_recycler = [];
		this.m_rowClassifier = props.calcRowClass;

		this.m_empty_text = props.empty_text ?? _tr.global.empty_list;

		this.addDOMEvent('created', () => this._on_create() );
		this.addDOMEvent('click', (e)=>this._on_click(e));
		this.addDOMEvent('dblclick', (e)=>this._on_dblclick(e));
		this.addDOMEvent('contextmenu', (e)=>this._on_menu(e));
		this.addDOMEvent('keydown', (e)=>this._on_key(e));

		this.setStore(props.store);
	}

	_on_create() {
		this._updateScroll(true);
	}

	/**
	 * 
	 */

	private _moveSel(sens: number, select = true) {

		let sel = this.m_selection;
		let scrolltype = null;

		if (sel === undefined) {
			sel = this.m_dataview.getByIndex(0).getID();
		}
		else {

			let index = this.m_dataview.indexOfId(this.m_selection);

			if (sens == 1) {
				index++;
			}
			else if (sens == -1) {
				index--;
			}
			else if (sens == 2) {
				index += this.m_visible_rows.length - 1;
			}
			else if (sens == -2) {
				index -= this.m_visible_rows.length - 1;
			}

			if (sens < 0) {
				scrolltype = 'start';
			}
			else {
				scrolltype = 'end';
			}

			if (index < 0) {
				index = 0;
			}
			else if (index >= this.m_dataview.getCount()) {
				index = this.m_dataview.getCount() - 1;
			}

			sel = this.m_dataview.getByIndex(index).getID();
		}

		if (this.m_selection != sel && select) {
			this._selectItem(sel, null, scrolltype);
		}

		return sel;
	}

	/**
	 * 
	 */

	private _on_key(event: KeyboardEvent) {
		if (!this.m_dataview || this.m_dataview.getCount() == 0) {
			return;
		}

		switch (event.key) {
			case 'ArrowDown':
			case 'Down': {
				this._moveSel(1);
				break;
			}

			case 'ArrowUp':
			case 'Up': {
				this._moveSel(-1);
				break;
			}

			case 'PageUp': {
				this._moveSel(-2);
				break;
			}

			case 'PageDown': {
				this._moveSel(2);
				break;
			}
		}
	}

	/**
	 * 
	 */

	getNextSel(sens: number) {
		return this._moveSel(sens, false);
	}

	private _scrollIntoView(id: any, sens?: string) {

		let itm = this._findItem(id);
		if (itm) {
			itm.scrollIntoView({
				block: 'center'	//<ScrollLogicalPosition>sens ?? 'nearest'
			});
		}
		else {
			this.m_topIndex = this.m_dataview.indexOfId(id);
			this.m_view_el.dom.scrollTop = this.m_topIndex * this.m_itemHeight;
			this._buildItems();

			this._scrollIntoView(id);
		}

	}

	/**
	 * change the list of item displayed
	 * @param items - new array of items
	 */

	public setStore(store: DataStore | DataView) {

		this.m_selection = undefined;

		if (store instanceof DataStore) {
			this.m_dataview = store.createView();
		}
		else {
			this.m_dataview = store;
		}

		if( this.m_hasMarks ) {
			this.clearMarks( );
		}

		// unlink previous observer
		if (this.m_data_cx) {
			this.m_data_cx.dispose( );
		}

		if (this.m_dataview) {

			this.m_data_cx = this.m_dataview.on( 'view_change', ( ev ) => {
				if (ev.change_type == 'change') {
					this.m_selection = undefined;
				}

				this._updateScroll(true);
			});

			//this.update( );
			this._updateScroll(true);
		}
	}

	public getView(): DataView {
		return this.m_dataview;
	}

	/**
	 * return the current selection (row id) or null 
	 */

	public getSelection(): any {
		return this.m_selection;
	}

	public getSelRec(): Record {
		if (this.m_selection) {
			return this.m_dataview.getById(this.m_selection);
		}

		return null;
	}

	public setSelection(recId: any) {
		this._selectItem(recId, null, 'center');
	}

	/** @ignore */
	render() {

		this.m_recycler = [];
		this.m_container = new Component({
			cls: 'content',
		});

		this.m_empty_msg = new Label({
			cls: 'empty-msg',
			text: ''
		});

		this.m_view_el = new Component({
			cls: '@scroll-view',
			flex: 1,
			dom_events: {
				sizechange: ( ) => this._updateScroll(true),
				scroll: ( ) => this._updateScroll(false)
			},
			content: this.m_container
		});

		let flex = false;
		let cols = this.m_columns.map((col, index) => {

			let cls = '@cell';
			if (col.cls) {
				cls += ' ' + col.cls;
			}

			let comp = new ColHeader({
				cls,
				flex: col.flex,
				sizable: 'right',
				style: {
					width: col.width+"px"
				},
				dom_events: {
					click: (ev: MouseEvent) => {
						let t = wrapDOM(<HTMLElement>ev.target);
						if (!t.hasClass('@sizer-overlay')) { // avoid sizer click
							this._sortCol(col);
							ev.preventDefault();
						}
					}
				}
			}, col.title );

			const resizeCol = ( ev: EvSize ) => {
				this._on_col_resize(index, ev.size.width);

				if( this.m_footer ) {
					let col = componentFromDOM( this.m_footer.dom.childNodes[index] as HTMLElement );
					if( col ) {
						col.setStyleValue( 'width', ev.size.width ); 
					}
				}
			}

			new SizerOverlay({
				target: comp,
				sens: 'right',
				events: {resize: ( e ) => resizeCol(e )}
			});

			if( col.flex ) {
				flex = true;
			}

			(<any>col).$hdr = comp;
			return comp;
		});

		(cols as any).push( new Flex( {
			ref: 'flex',
			cls: flex ? '@hidden' : ''
		} ) );
		
		// compute full width
		let full_width = 0;
		this.m_columns.forEach((col) => {
			full_width += col.width ?? 0;
		});

		this.m_header = new HBox({
			cls: '@header',
			content: <any>cols,
			style: {
				minWidth: full_width+"px"
			}
		});	

		if( this.props.hasFooter ) {
			let foots = this.m_columns.map((col, index) => {

				let cls = '@cell';

				if (col.align) {
					cls += ' ' + col.align;
				}
				
				if (col.cls) {
					cls += ' ' + col.cls;
				}

				let comp = new Component({
					cls,
					data: { col: index },
					flex: col.flex,
					style: {
						width: col.width+"px"
					}
				});

				(col as GridColumnInternal).$ftr = comp;
				return comp;
			});

			(foots as any).push( new Flex( {
				ref: 'flex',
				cls: flex ? '@hidden' : ''
			} ) );
			
			this.m_footer = new HBox({
				cls: '@footer',
				content: <any>foots,
				style: {
					minWidth: full_width+"px"
				}
			});
		}
		else {
			this.m_footer = null;
		}

		this.setContent([
			this.m_header,
			this.m_view_el,
			this.m_footer,
			this.m_empty_msg,
		]);

	}

	private _on_col_resize(col: number, width: number) {

		const _col = this.m_columns[col] as GridColumnInternal;

		let updateFlex = false;
				
		if( width>=0 ) {
			_col.width = width;
			if( _col.flex ) {
				_col.$hdr.removeClass( '@flex' );
				_col.$ftr?.removeClass( '@flex' );
				_col.flex = undefined;
				updateFlex = true;
			}
		}
		else if( width<0 && !_col.flex ) {
			_col.$hdr.addClass( '@flex' );
			_col.$ftr?.addClass( '@flex' );
			_col.flex = 1;
			updateFlex = true;
		}

		if( updateFlex ) {
			let flex = false;
			this.m_columns.forEach( c => {
				if( c.flex ) {
					flex = true;
				}
			});
				
			this.m_header.itemWithRef( 'flex' )?.show( flex ? false : true );
			if( this.m_footer ) {
				this.m_footer.itemWithRef( 'flex' )?.show( flex ? false : true );
			}
		}

		this._updateScroll(true);
	}

	/**
	 * 
	 */

	sortCol( name: string, asc = true ) {
		const col = this.m_columns.find(c => c.id==name );
		if( col===undefined ) {
			console.assert( false, "unknown field "+name+" in grid.sortCol" );
			return;
		}

		this._sortCol( col, asc ? "dn" : "up" );
	}

	/**
	 * 
	 */

	private _sortCol(col: GridColumn, sens: "up" | "dn" = "up" ) {

		if (col.sortable === false) {
			return;
		}

		this.m_columns.forEach((c) => {
			if (c !== col) {
				(c as GridColumnInternal).$hdr.sort( false, "dn" );
			}
		});

		const $hdr = (col as GridColumnInternal).$hdr;

		if ($hdr.isSorted()) {
			$hdr.toggleSens( );
		}
		else {
			$hdr.sort( true, sens );
		}

		if (this.m_dataview) {
			this.m_dataview.sort([
				{ field: col.id, ascending: $hdr.sens=='dn' ? false : true }
			]);
		}
	}

	/**
	 * 
	 */

	private _computeItemHeight() {
		let gr = document.createElement('div');
		gr.classList.add('x-row');

		let gv = document.createElement('div');
		gv.classList.add('x-grid-view');
		gv.style.position = 'absolute';
		gv.style.top = '-1000px';
		gv.appendChild(gr);

		this.dom.appendChild(gv);
		let rc = gr.getBoundingClientRect();
		this.dom.removeChild(gv);

		this.m_itemHeight = rc.height;
	}

	private _createRow( props: ComponentProps ): Component {

		let row: Component;
		if (this.m_recycler.length) {
			row = this.m_recycler.pop();
			row.clearClasses();
			row.addClass( props.cls );
			row.setContent( props.content );
			row.setStyle( props.style );

			for( let n in props.data ) {
				row.setData( n, props.data[n] );
			}
		}
		else {
			row = new HBox( props );
		}

		if (!row.dom) {
			this.m_container.appendContent(row);
		}

		return row;
	}

	private _buildItems( canOpt = true ) {
		let rc = this.getBoundingRect();
		let rh = this.m_header.getBoundingRect();
		let height = rc.height - rh.height + this.m_itemHeight;

		if (this.m_itemHeight == 0) {
			this._computeItemHeight();
		}

		let top = this.m_topIndex * this.m_itemHeight;
		let y = 0;
		let cidx = 0;
		let index = this.m_topIndex;
		let count = this.m_dataview ? this.m_dataview.getCount() : 0;
		
		let full_width = 0; // todo: +4 pixel of left border
		let even = this.m_topIndex & 1 ? true : false;

		// compute full width
		this.m_columns.forEach((col) => {
			full_width += col.width ?? 0;
		});

		// if items height make scroll visible, update header width
		if (((count + 1) * this.m_itemHeight) >= height) {
			let w = Component.getScrollbarSize();
			this.m_header.setStyleValue("paddingRight", w);
			this.m_footer?.setStyleValue("paddingRight", w);
		}
		else {
			this.m_header.setStyleValue("paddingRight", 0);
			this.m_footer?.setStyleValue("paddingRight", 0);
		}

		// passe 0 - all created cells are moved to the recycler
		if( this.m_visible_rows ) {
			this.m_visible_rows.forEach((c) => {
				this.m_recycler.push(c);
			});
		}

		this.m_visible_rows = [];
		let limit = 100;
		while (y < height && index < count && --limit > 0) {

			let rec = this.m_dataview.getByIndex(index);
			let rowid = rec.getID();

			let crow = canOpt ? this.m_recycler.findIndex( ( r ) => r.getData('row-id')==rowid ) : -1;
			if( crow>=0 ) {
				let rrow = this.m_recycler.splice( crow, 1 )[ 0 ];
				rrow.setStyle( {
					top: (y + top)+"px",
					minWidth: full_width+"px",
				} );

				if (this.m_hasMarks) {
					rrow.setClass( '@marked', this.m_marks.has(rowid) );
				}

				rrow.removeClass( '@hidden' );
				rrow.setClass( '@selected', this.m_selection === rowid );

				this.m_visible_rows[cidx] = rrow;
			}
			else {
				let cols = this.m_columns.map( col => {

					let cls = '@cell';
					if (col.align) {
						cls += ' ' + col.align;
					}

					if (col.cls) {
						cls += ' ' + col.cls;
					}

					let cell: Component;
					if (col.renderer) {
						cell = col.renderer(rec);
						if (cell) {
							cell.addClass(cls);
							cell.setStyleValue('width', col.width);
							if (col.flex !== undefined) {
								cell.addClass('@flex');
								cell.setStyleValue('flex', col.flex);
							}
						}
					}
					else {

						let fmt = col.formatter;
						let text;

						if (fmt && fmt instanceof Function) {
							text = fmt(rec.getRaw(col.id), rec);
						}
						else {
							text = rec.getField(col.id);
						}

						cell = new Component({
							cls,
							width: col.width,
							content: unsafeHtml( `<span>${text}</span>` ),
							flex: col.flex
						})
					}

					return cell;
				});

				let cls = '@row @hlayout center';
				if (this.m_hasMarks) {
					if (this.m_marks.has(rowid)) {
						cls += ' @marked';
					}
				}

				if (this.m_selection === rowid) {
					cls += ' @selected';
				}

				let row = this.m_visible_rows[cidx] = this._createRow( {
					cls,
					content: <any>cols,
					style: {
						top: (y + top)+"px",
						minWidth: full_width+"px",
					},
					data: {
						'row-id': rowid,
						'row-idx': index
					}
				});

				row.addClass(even ? 'even' : 'odd');
				even = !even;

				if (this.m_rowClassifier) {
					this.m_rowClassifier(rec, row);
				}
			}

			y += this.m_itemHeight;

			index++;
			cidx++;
		}

		// if some cells are still in cache, hide them
		this.m_recycler.forEach((c) => {
			c.addClass('@hidden');
		})

		//this.m_container.setContent(<ComponentContent>this.m_visible_rows);

		let show = !count;
		let msg = (this.m_empty_text instanceof Function) ? this.m_empty_text() : this.m_empty_text;
		this.m_empty_msg.setText( msg );

		if (show && msg.length == 0) {
			show = false;
		}

		this.m_empty_msg.show(show);

		if (full_width < rc.width) {
			this.m_header.setStyleValue('width', null);
			this.m_footer?.setStyleValue('width', null);
			this.m_container.setStyle({
				height: (count * this.m_itemHeight)+"px",
				width: null
			});
		}
		else {
			this.m_header.setStyleValue('width', full_width + 1000 );
			this.m_footer?.setStyleValue('width', full_width + 1000 );
			this.m_container.setStyle({
				height: (count * this.m_itemHeight)+"px",
				width: full_width+"px"
			});
		}
	}

	/**
	 * 
	 */

	private _updateScroll(forceUpdate: boolean ) {
		if (!this.m_view_el || !this.m_view_el.dom) {
			return;
		}

		const update = () => {

			// element destroyed between updateScroll and now
			if( !this.dom ) {
				return;
			}

			let newTop = Math.floor(this.m_view_el.dom.scrollTop / (this.m_itemHeight || 1));

			if (newTop != this.m_topIndex || forceUpdate) {
				this.m_topIndex = newTop;
				this._buildItems( !forceUpdate );
			}

			let newLeft = this.m_view_el.dom.scrollLeft;
			this.m_header.setStyleValue('left', -newLeft);
			this.m_footer?.setStyleValue('left', -newLeft);
		}

		if (forceUpdate) {
			this.singleShot( update, 10 );
		}
		else {
			update();
		}
	}

	/** @ignore */

	private _rowFromTarget(dom: Element ) {
		let self = this.dom;

		while (dom && dom != self) {
			let itm = componentFromDOM(dom);

			if (itm) {
				let id = itm.getData('row-id');
				if (id !== undefined) {
					return { id, itm };
				}
			}

			dom = dom.parentElement;
		}

		return undefined;
	}

	private _on_click(e: MouseEvent) {
		let hit = this._rowFromTarget(e.target as Element);
		if (hit) {
			this._selectItem(hit.id, hit.itm);
		}
		else {
			this._selectItem(undefined, undefined);
		}
	}

	private _on_dblclick(e: MouseEvent) {
		let hit = this._rowFromTarget(e.target as Element);
		if (hit) {
			this._selectItem(hit.id, hit.itm);

			let rec = this.m_dataview.getById(hit.id);
			this.fire( 'dblClick', {context:rec} );

			if (this.m_hasMarks) {
				this._toggleMark(rec);
			}
		}

	}

	/** @ignore */
	private _on_menu(e: MouseEvent) {

		let dom = e.target as HTMLElement,
			self = this.dom;

		while (dom && dom != self) {
			let itm = componentFromDOM(dom),
				id = itm?.getData('row-id');

			if (id !== undefined) {
				this._selectItem(id, itm);

				let idx = itm.getData('row-idx');
				let rec = this.m_dataview.getByIndex(idx);

				this._showItemContextMenu(e, rec);
				e.preventDefault();
				return;
			}

			dom = dom.parentElement;
		}
	}

	/**
	 * 
	 */

	private _findItem(id: string): Component {

		for (let i = 0; i < this.m_visible_rows.length; i++) {
			let itm = this.m_visible_rows[i];
			if (itm.getData('row-id') === id) {
				return itm;
			}
		}

		return null;
	}

	/**
	 * @ignore
	 * called when an item is selected by mouse
	 */

	protected _selectItem(item: any, dom_item: Component, scrollIntoView?: string) {

		if (this.m_selection !== undefined) {
			let old = this._findItem(this.m_selection);
			if (old) {
				old.removeClass('@selected');
			}
		}

		this.m_selection = item;

		if (item) {
			if (scrollIntoView) {
				this._scrollIntoView(item, scrollIntoView);
			}

			if (!dom_item) {
				dom_item = this._findItem(item);
			}

			if (dom_item) {
				dom_item.addClass('@selected');
			}

			let rec = this.m_dataview.getById(item);
			this.fire( 'selectionChange', {selection:rec});
		}
		else {
			this.fire( 'selectionChange', {selection:null});
		}
	}

	/**
	 * 
	 */

	protected _showItemContextMenu(event: MouseEvent, item: Record) {
		this.fire( 'contextMenu', {uievent:event,context:item});
	}

	/**
	 * 
	 */

	public clearSelection() {
		this._selectItem(null, null);
	}

	setEmptyText(text: string | UnsafeHtml) {
		this.m_empty_msg.setText( text );
	}

	private _renderCheck(rec: Record) {
		let icon = '--x4-icon-square';
		if (this.m_marks.has(rec.getID())) {
			icon = '--x4-icon-square-check';
		}

		return new Icon({ iconId: `var(${icon})` });
	}

	private _toggleMark(rec: Record) {

		let id = rec.getID();
		let chk = false;

		if (this.m_marks.has(id)) {
			this.m_marks.delete(id);
		}
		else {
			this.m_marks.add(id);
			chk = true;
		}

		this.fire( 'gridCheck',{rec:rec, chk:chk });
		this._buildItems( false );
	}

	public getMarks(): any[] {
		let ids = [];
		for (const v of this.m_marks.values()) {
			ids.push(v);
		}

		return ids;
	}

	public clearMarks() {
		if (this.m_marks.size) {
			this.m_marks = new Set<any>();
			this._buildItems( false );
		}
	}

	public setFooterData( rec: any ) {
		if( !this.m_footer ) {
			return;
		}

		this.m_footer.enumChilds( (c) => {
			let cid = c.getData( 'col' );
			if( cid ) {
				let col = this.m_columns[cid];

				let value = rec[col.id];
				if( value!==undefined ) {
					if( isFunction(value)  ) {	// FooterRenderer
						value( c );
					}
					else {
						let text;
						const fmt = col.formatter;
						if (fmt && fmt instanceof Function) {
							text = fmt(value, rec);
						}
						else {
							text = value;
						}

						c.setContent( text, false );
					}
				}
			}
		});
	}
}

