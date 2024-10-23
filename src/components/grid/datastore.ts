/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file datastore.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { ComponentEvents, ComponentProps, EvChange } from '@core/component.js';
import { CoreElement } from '@core/core_element.js';
import { CoreEvent, EventCallback, EventMap, EventSource } from '@core/core_events.js';
import { isArray, isString } from '@core/core_tools.js';
import { Component } from 'x4js';

export type RecordID = any;

export type ChangeCallback = (type: string, id?: RecordID) => void;
export type CalcCallback = () => string;

export type FieldType = 'string' | 'int' | 'float' | 'date' | 'bool' | 'array' | 'object' | 'any' | 'calc';
export type DataIndex = Uint32Array;

export interface EvDataChange extends CoreEvent {
	change_type: 'create' | 'update' | 'delete' | 'data' | 'change';
	id?: RecordID;
}






/**
 * fields definition
 * 	field with index=0 is record id
 */

export interface MetaData {
	type?: FieldType;
	prec?: number;
	required?: boolean;
	calc?: (rec: Record) => any;
	model?: DataModel;	// in case of array of subtypes, the model
}

export interface FieldInfo extends MetaData {
	name: string;
}

/**
 * 
 */

class MetaInfos {
	name: string;
	id: string;				// field name holding 'id' record info
	fields: FieldInfo[];	// field list

	constructor( name: string ) {
		this.name = name;
		this.id = undefined;
		this.fields = [];
	}
}

const metaFields = Symbol( 'metaField' );

function _getMetas( obj: object, create = true ) : MetaInfos {
	
	let ctor = obj.constructor as any;
	let mfld = ctor.hasOwnProperty(metaFields) ? ctor[metaFields] : undefined;
	
	if( mfld===undefined ) {
		if( !create ) {
			console.assert( mfld!==undefined );
		}
		
		// construct our metas
		mfld = new MetaInfos( ctor.name );

		// merge with parent class metas
		let pctor = Object.getPrototypeOf(ctor);
		if( pctor!=DataModel ) {
			let pmetas = pctor[metaFields];
			mfld.fields = [...pmetas.fields, ...mfld.fields ]
			
			console.assert( mfld.id===undefined, 'cannot define mutiple record id' );
			if( !mfld.id ) {
				mfld.id = pmetas.id;
			}
		}	

		(obj.constructor as any)[metaFields] = mfld;
	}

	return mfld;
}

export namespace data {

	/**
	 * define a model id
	 * @example
	 *	\@data_id()
	*  id: string; // this field is the record id
	**/

	export function id( ) {
	return ( ownerCls: any, fldName: string ) => {
		let metas = _getMetas( ownerCls );
		metas.fields.push( {
			name: fldName,
			type: 'any',
			required: true,
		});

		metas.id = fldName;
	}
}

	/**
	 * @ignore
	 */

	export function field( data: MetaData ) {

		return ( ownerCls: any, fldName: string ) => {
			let metas = _getMetas( ownerCls );
			metas.fields.push( {
				name: fldName,
				...data
			} );
		}
	}

	/**
	 * following member is a string field
	 * @example
	 * \@data_string()
	 * my_field: string;	// this field will be seen as a string
	 */

	export function string( props?: MetaData ) {
		return field( { ...props, type: 'string' } );
	}

	/**
	 * following member is an integer field
	 * @example
	 * \@data_string()
	 * my_field: number;	// this field will be seen as an integer
	 */

	export function int( props?: MetaData ) {
		return field( { ...props, type: 'int' } );
	}

	/**
	 * following member is a float field
	 * @example
	 * \@data_float()
	 * my_field: number;	// this field will be seen as a float
	 */

	export function float( props?: MetaData ) {
		return field( { ...props, type: 'float' } );
	}

	/**
	 * following member is a boolean field
	 * @example
	 * \@data_bool()
	 * my_field: boolean;	// this field will be seen as a boolean
	 */

	export function bool( props?: MetaData ) {
		return field( { ...props, type: 'bool' } );
	}

	/**
	 * following member is a date field
	 * @example
	 * \@data_date()
	 * my_field: date;	// this field will be seen as a date
	 */

	export function date( props?: MetaData ) {
		return field( { ...props, type: 'date' } );
	}

	/**
	 * following member is a calculated field
	 * @example
	 * \@data_calc( )
	 * get my_field(): string => {
	 * 	return 'hello';
	 * };	
	 */

	export function calc( props?: MetaData ) {
		return field( { ...props, type: 'calc'} ) 
	}

	/**
	 * 
	 */

	interface ModelConstructor {
		new ( data?: any, id?: any ): DataModel;
	}

	/**
	 * following member is a record array
	 * @example
	 * \@data_array( )
	 * my_field(): TypedRecord[];	
	 */

	export function array( ctor: ModelConstructor, props?: MetaData  ) {
		return data.field( { ...props, type: 'array', model: ctor ? new ctor() : null } )
	}

}




/**
 * record model
 */

export class DataModel {

	/**
	 * MUST IMPLEMENT
	 * @returns fields descriptors
	 */

	getFields(): FieldInfo[] { 
		let metas = _getMetas( this, false );
		return metas.fields;
	}
	
	/**
	 * 
	 */

	validate( record: Record ) : Error[] {
		
		let errs: Error[] = null;

		let fields = this.getFields( );

		fields.forEach( (fi) => {
			if( fi.required && !this.getField(fi.name,record) ) {
				if( errs ) {
					errs = [];
				}
				
				errs.push( new Error( `field ${fi.name} is required.` ) );
			}
		})

		return errs;
	}	

	/**
	 * return the field index by name
	 */

	getFieldIndex( name: string ) : number {
		let fields = this.getFields( );
		return fields.findIndex( (fd) => fd.name == name );
	}

	/**
	 * default serializer
	 * @returns an object with known record values
	 */

	serialize( input: Record ): any { 
		let rec: any = {};

		this.getFields().forEach((f) => {
			if( f.calc === undefined ) {
				rec[f.name] = input[f.name];
			}
		});

		return rec;
	}
	
	/**
	 * default unserializer
	 * @param data - input data 
	 * @returns a new Record
	 */

	unSerialize(data: any, id?: RecordID ) : Record { 

		const fields = this.getFields();
		const rec = new Record( );

		fields.forEach( (sf) => {
			let value = data[sf.name];
			if (value !== undefined) {
				rec[sf.name] = this._convertField( sf, value );
			}
		});

		if( id!==undefined ) {
			rec[fields[0].name] = id;
		}
		else {
			console.assert( this.getID(rec)!==undefined ); // store do not have ID field
		}

		return rec;
	}

	/**
	 * field conversion
	 * @param field - field descriptor
	 * @param input - value to convert
	 * @returns the field value in it's original form
	 */

	protected _convertField( field: FieldInfo, input: any ) : any {
		
		//TODO: boolean

		switch( field.type ) {
			case 'float': {
				let ffv: number = typeof (input) === 'number' ? input : parseFloat(input);
				
				if (field.prec !== undefined) {
					let mul = Math.pow(10, field.prec);
					ffv = Math.round(ffv * mul) / mul;
				}
			
				return ffv;
			}

			case 'int': {
				return typeof (input) === 'number' ? input : parseInt(input);
			}

			case 'date': {
				return isString(input) ? new Date(input) : input;
			}

			case 'array': {
				debugger;
				/*
				let result: any[] = [];
			
				if( field.model ) {
					input.forEach( ( v: any ) => {
						result.push( field.model.clone( v ) );
					})
			
					return result;
				}
				*/
				break;
			}
		}
		
		return input;
	}

	/**
	 * get the record unique identifier
	 * by default the return value is the first field
	 * @return unique identifier
	 */

	getID( rec: Record ): any { 
		if( !rec ) return null;
		let metas = _getMetas( this, false );
		return rec[metas.id];
	}

	/**
	 * get raw value of a field
	 * @param name - field name or field index
	 */

	getRaw( name: string | number, rec: Record ) : any {
		
		let idx;
		let fields = this.getFields( );

		if( typeof(name) === 'string' ) {
			idx = fields.findIndex( ( fi: FieldInfo) => fi.name == name );
			if( idx < 0 ) {
				console.assert( false, 'unknown field: '+name);
				return undefined;
			}
		}
		else if( name<fields.length ) {
			if( name<0 ) {
				return undefined
			}

			idx = name;
		}
		else {
			console.assert( false, 'bad field name: '+name);
			return undefined;
		}

		let fld = fields[idx];
		if( fld.calc!==undefined ) {
			return fld.calc( rec );
		}
		
		return rec[fld.name];
	}

	/**
	 * get field value (as string)
	 * @param name - field name
	 * @example
	 * let value = record.get('field1');
	 */

	getField( name: string, rec: Record ): string {
		let v = this.getRaw( name, rec );
		return (v===undefined || v===null) ? '' : ''+v;
	}
}

/**
 * 
 */

const $model = Symbol( "model" )

export class Record  {
	[ key: string ]: number | string | Date;

	/*
	/ **
	 * @returns fields descriptors
	 * /

	getFields(): FieldInfo[] { 
		let metas = _getMetas( this, false );
		return metas.fields;
	}

	

	/ **
	 * 
	 * @param name 
	 * @param data 
	 * /

	setRaw( name: string, data: string ) {
		this[name] = data;
	}

	

	/ **
	 * set field value
	 * @param name - field name
	 * @param value - value to set
	 * @example
	 * record.set( 'field1', 7 );
	 * /

	setField(name: string, value: any) {
		let fields = this.getFields( );
		let idx = fields.findIndex( fi => fi.name == name );

		if( idx < 0 ) {
			console.assert( false, 'unknown field: '+name);
			return;
		}

		let fld = fields[idx];
		if( fld.calc!==undefined ) {
			console.assert( false, 'cannot set calc field: '+name);
			return;
		}
		
		this.setRaw( fld.name, value );
	}
	*/
}


/**
 * 
 */

interface DataEventMap extends ComponentEvents {
	change?: EvChange;
}

type DataSolver = ( data: any ) => Record[];

export interface DataProxyProps {
	url: string;
	params?: string[];
	solver?: DataSolver;
}

export class DataProxy extends CoreElement<DataEventMap> {

	protected m_props: DataProxyProps;

	constructor( props: DataProxyProps ) {
		super( );

		this.m_props = props;
	}

	async load( url?: string ) {
		if( url ) {
			this.m_props.url = url;
		}
		else {
			url = this.m_props.url;
		}

		if( this.m_props.params ) {
			url += '?' + this.m_props.params.join( '&' );
		}

		const r = await fetch( url );
		if( r.ok ) {
			const raw = await r.json( );
			
			let json = raw;
			if( this.m_props.solver ) {
				json = this.m_props.solver( json );
			}

			this.fire( 'change', {value:json,context:raw} );
		}
	}
}


/**
 * 
 */

interface DataStoreProps  {
	model: DataModel;
	data?: any[];
	url?: string;
	autoload?: false;
	solver?: DataSolver;
}


interface DataStoreEventMap extends EventMap {
	data_change: EvDataChange;
}



/**
 * 
 */

export class DataStore extends EventSource<DataStoreEventMap> {
	
	protected m_model: DataModel;
	protected m_fields: FieldInfo[];
	protected m_records: Record[];

	protected m_proxy: DataProxy;
	protected m_rec_index: DataIndex;

	constructor(props: DataStoreProps ) {
		super( );

		this.m_fields = undefined;
		this.m_records = [];
		this.m_rec_index = null;
		this.m_model = props.model;
		this.m_fields = props.model.getFields();

		if (props.data) {
			this.setRawData( props.data );
		}
		else if( props.url ) {
			this.m_proxy = new DataProxy( {
				url: props.url,
				solver: props.solver,
			});

			this.m_proxy.on( 'change', ( ev: EvChange) => {
				this.setData( ev.value );
			}); 

			if( props.autoload!=false ) {
				this.m_proxy.load( );
			}
		}
	}

	/**
	 * 
	 * @param records 
	 */

	async load( url?: string ) {
		return this.m_proxy.load( url );
	}

	async reload( ) {
		return this.m_proxy.load( );
	}

	/**
	 * convert raw objects to real records from model
	 * @param records 
	 */

	public setData( records: any[] ) {

		const realRecords: Record[] = new Array( records.length );

		records.forEach( (rec,idx) => {
			realRecords[idx] = this.m_model.unSerialize(rec);
		});

		this.setRawData( realRecords );
	}

	/**
	 * just set the records
	 * @param records - must be of the same type as model
	 */

	public setRawData(records: Record[]) {

		this.m_records = records;
		this._rebuildIndex( );
		this.fire( 'data_change', { change_type: 'change'} );
	}
	
	private _rebuildIndex( ) {
		this.m_rec_index = null; // null to signal that we have to run on records instead of index
		this.m_rec_index = this.createIndex( null ); // prepare index (remove deleted)
		this.m_rec_index = this.sortIndex( this.m_rec_index, null ); // sort by id
	}

	/**
	 * 
	 */

	public update( rec: Record ) {

		let id = this.m_model.getID( rec );
		let index = this.indexOfId(id);
		if (index < 0) {
			return false;
		}

		this.m_records[this.m_rec_index[index]] = rec;
		this.fire( 'data_change', {change_type: 'update', id } );
		return true;
	}

	/**
	 * 
	 * @param data 
	 */

	public append( rec: Record | any ) {

		if( !(rec instanceof Record) ) {
			rec = this.m_model.unSerialize( rec );
		}

		console.assert( this.m_model.getID(rec) );

		this.m_records.push( rec );
		this._rebuildIndex( );
		this.fire( 'data_change', {change_type: 'create', id: rec.getID() } );
	}

	/**
	 * 
	 */

	getMaxId( ) {
		let maxID: number = undefined;
		const m = this.m_model;

		this.m_records.forEach( (r) => {
			let rid = m.getID( r );
			if( maxID===undefined || maxID<rid ) {
				maxID = rid;
			}
		});

		return maxID;
	}

	/**
	 * 
	 * @param id 
	 */

	public delete(id: RecordID ): boolean {

		let idx = this.indexOfId( id );
		if( idx<0 ) {
			return false;
		}

		idx = this.m_rec_index[idx];

		// mark as deleted
		this.m_records.splice( idx, 1 );
		this._rebuildIndex( );
		this.fire( 'data_change', { change_type: 'delete', id } );
		return true;
	}

	/**
	 * return the number of records
	 */

	get count( ) : number {
		return this.m_rec_index ? this.m_rec_index.length : this.m_records.length;
	}

	/**
	 * return the fields
	 */

	get fields( ) : FieldInfo [] {
		return this.m_fields;
	}

	/**
	 * find the index of the element with the given id
	 */

	public indexOfId(id: RecordID ): number {

		//if( this.count<10 ) {
		//	this.forEach( (rec) => rec.getID() == id );
		//}

		const m = this.m_model;

		for( let lim = this.count, base = 0; lim != 0; lim >>= 1 ) {
			
			const p = base + (lim >> 1); // int conversion
			const idx = this.m_rec_index[p];
			const rid = m.getID( this.m_records[idx] );
	
			if( rid==id ) {
				return p;
			}

			if( rid<id ) {
				base = p+1;
				lim--;
			}
		}
	
		return -1;
	}

	/**
	 * return the record by it's id 
	 * @returns record or null
	 */

	public getById(id: RecordID): Record {
		let idx = this.indexOfId( id );
		if( idx<0 ) {
			return null;
		}

		idx = this.m_rec_index[idx];
		return this.m_records[idx];
	}

	/**
	 * return a record by it's index
	 * @returns record or null
	 */

	public getByIndex( index: number ): Record {
		let idx = this.m_rec_index[index];
		return this._getRecord( idx );
	}

	private _getRecord( index: number ) : Record {
		return this.m_records[index] ?? null;
	}

	public moveTo( other: DataStore ) {
		other.setRawData( this.m_records );
	}
	
	/**
	 * create a new view on the DataStore
	 * @param opts 
	 */

	createView( opts?: DataViewProps ) : DataView {
		let eopts = { ...opts, store: this };
		return new DataView( eopts );
	}

	/**
	 * 
	 */

	createIndex( filter: FilterInfo ) : DataIndex {

		if( filter && filter.op==='empty-result' ) {
			return new Uint32Array(0);
		}
		
		let index = new Uint32Array( this.m_records.length );
		let iidx = 0;
			
		if( !filter ) {
			// reset filter
			this.forEach( (rec, idx) => {
				index[iidx++] = idx;
			} );
		}
		else {
			if( typeof(filter.op)==='function' ) {

				let fn = <FilterFunc>filter.op;

				// scan all records and append only interesting ones
				this.forEach( (rec, idx) => {

					// skip deleted
					if( !rec ) {
						return;
					}

					if( fn(rec) ) {
						index[iidx++] = idx;
					}
				} );
			}
			else {
				let filterFld = this.m_model.getFieldIndex( filter.field );	 // field index to filter on
				if( filterFld<0 ) {
					// unknown filter field, nothing inside
					console.assert( false, 'unknown field name in filter' )
					return new Uint32Array(0);
				}
				
				let filterValue = filter.value;
				if( isString(filterValue) && !filter.caseSensitive ) {
					filterValue = filterValue.toUpperCase( );
				}
				
				function _lt( recval: string ) : boolean {
					return recval < filterValue;
				}

				function _le( recval: string ) : boolean {
					return recval <= filterValue;
				}

				function _eq( recval: string ) : boolean {
					return recval == filterValue;
				}

				function _neq( recval: string ) : boolean {
					return recval != filterValue;
				}

				function _ge( recval: string ) : boolean {
					return recval >= filterValue;
				}

				function _gt( recval: string ) : boolean {
					return recval > filterValue;
				}

				function _re( recval: string ) : boolean {
					filterRe.lastIndex = -1;
					return filterRe.test( recval );
				}

				let filterFn: ( rec: string ) => boolean;	// filter fn 
				let filterRe: RegExp;	// if fielter is regexp
				if( filterValue instanceof RegExp ) {
					filterRe = filterValue;
					filterFn = _re;
				}
				else {
					switch( filter.op ) {
						case '<':	{ filterFn = _lt; break; }
						case '<=': 	{ filterFn = _le; break; }
						case '=': 	{ filterFn = _eq; break; }
						case '>=': 	{ filterFn = _ge; break; }
						case '>': 	{ filterFn = _gt; break; }
						case '<>':  { filterFn = _neq; break; }
					}
				}
			
				// scan all records and append only interesting ones
				const m = this.m_model;

				this.forEach( (rec, idx) => {

					// skip deleted
					if( !rec ) {
						return;
					}

					let field = m.getRaw( filterFld, rec );
					if( field===null || field===undefined ) {
						field = '';
					}
					else {
						field = ''+field;
						if( !filter.caseSensitive ) {
							field = field.toUpperCase( );
						}
					}

					let keep  = filterFn( field );
					if( keep ) {
						index[iidx++] = idx;
					};
				});
			}
		}

		return index.slice( 0, iidx );
	}

	sortIndex( index: DataIndex, sort: SortProp[] ) {
		
		interface sort_info {
			fidx: number,
			asc: boolean
		}

		let bads = 0;		// unknown fields
		let fidxs: sort_info[] = [];		// fields indexes

		// if no fields are given, reset sort by id
		if ( sort===null ) {
			fidxs.push( { fidx: 0, asc: true } );
		}
		else {
			fidxs = sort.map( (si) => {
				
				let fi = this.m_model.getFieldIndex( si.field );
				if (fi == -1) {
					console.assert( false, 'unknown field name in sort' )
					bads++;
				}

				return { fidx: fi, asc: si.ascending };
			});
		}

		// unknown field or nothing to sort on ??
		if( bads || fidxs.length==0 ) {
			return index;
		}

		// sort only by one field : optimize it
		const m = this.m_model;

		if( fidxs.length==1 ) {

			const field = fidxs[0].fidx;

			index.sort( ( ia, ib ) => {

				let va = m.getRaw( field, this.getByIndex(ia) ) ?? '';
				let vb = m.getRaw( field, this.getByIndex(ib) ) ?? '';
				if (va > vb) { return 1; }
				if (va < vb) { return -1; }
				return 0;
			} );

			// just reverse if 
			if( !fidxs[0].asc ) {
				index.reverse( );
			}
		}
		else {
			index.sort( ( ia, ib ) => {

				for( let fi=0; fi<fidxs.length; fi++ ) {

					let fidx = fidxs[fi].fidx;
					let mul = fidxs[fi].asc ? 1 : -1;

					let va = m.getRaw( fidx, this.getByIndex(ia) ) ?? '';
					let vb = m.getRaw( fidx, this.getByIndex(ib) ) ?? '';
					if (va > vb) { return mul; }
					if (va < vb) { return -mul; }
				}

				return 0;
			} );
		}

		return index	
	}

	/**
	 * 
	 */

	forEach( cb: ( rec: Record, index: number ) => any ) {
		
		if( this.m_rec_index ) {
			this.m_rec_index.some( (ri,index) => {
				if( cb( this.m_records[ri], index ) ) {
					return index;
				}
			});
		}
		else {
			this.m_records.some( ( rec, index ) => {
				if( rec ) {
					if( cb( rec, index ) ) {
						return index;
					}
				}
			} );
		}
	}

	export( ) {
		return this.m_records;
	}

	changed( ) {
		this.fire( 'data_change', { change_type: 'change'} );
	}

	getModel( ) {
		return this.m_model;
	}
}


// :: VIEWS ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export interface EvViewChange extends CoreEvent {
	change_type: "change" | "filter" | "sort";
}

interface DataViewEventMap extends EventMap {
	view_change: EvViewChange;
}

interface DataViewProps {
	store?: DataStore;
	filter?: FilterInfo;
	order?: string | SortProp[] | SortProp;
}

export type FilterFunc = ( rec: Record ) => boolean;

export interface FilterInfo {
	op: '<' | '<=' | '=' | '>=' | '>' | '<>' | 'empty-result' | FilterFunc,	// emptydb mean return an empty result always
	field?: string;
	value?: string | RegExp; // if regexp then operator is =
	caseSensitive?: boolean;
}


export interface SortProp {
	field: string; 			// 
	ascending: boolean;		// 
}



/**
 * Dataview allow different views of the DataStore.
 * You can sort the columns & filter data
 * You can have multiple views for a single DataStore
 */

export class DataView extends CoreElement<DataViewEventMap>
{
	protected m_index: DataIndex;
	protected m_store: DataStore;	
	protected m_model: DataModel;

	protected m_sort: SortProp[];
	protected m_filter: FilterInfo;

	protected m_props: DataViewProps;

	constructor( props: DataViewProps ) {
		super( );

		this.m_props = props;
		this.m_store = props.store;
		this.m_index = null;
		this.m_filter = null;
		this.m_sort = null;
		this.m_model = this.m_store.getModel();

		this.filter( props.filter );
		
		if( props.order ) {
			if( isString(props.order) ) {
				this.sort( [ { field: props.order, ascending: true } ] );
			}
			else if( isArray(props.order) ) {
				this.sort( props.order );
			}
			else {
				this.sort( [props.order] );
			}
		}
		else {
			this.sort( null );
		}

		this.m_store.addListener( 'data_change', ( e ) => this._storeChange(e) );
	}

	private _storeChange( ev: EvDataChange ) {
		
		this._filter( this.m_filter, ev.type!='change' );
		this._sort( this.m_sort, ev.type!='change' );
		
		this.fire( 'view_change', { change_type: 'change' } );
	}

	/**
	 * 
	 * @param filter 
	 */

	public filter( filter?: FilterInfo ) : number {

		this.m_index = null; // null to signal that we have to run on records instead of index
		return this._filter( filter, true );
	}

	private _filter( filter: FilterInfo, notify: boolean) : number {

		this.m_index = this.m_store.createIndex( filter );
		this.m_filter = filter;

		// need to sort again:
		if( this.m_sort ) {
			this.sort( this.m_sort );
		}
		
		if( notify ) {
			this.fire( 'view_change', { change_type: 'filter' } );
		}

		return this.m_index.length;
	}

	/**
	 * 
	 * @param columns 
	 * @param ascending 
	 */

	public sort( props: SortProp[] ) {
		this._sort( props, true );
	}

	private _sort( props: SortProp[], notify: boolean ) {
		this.m_index = this.m_store.sortIndex( this.m_index, props );
		this.m_sort = props;

		if( notify ) {
			this.fire( 'view_change', { change_type: 'sort' } );
		}
	}

	/**
	 * 
	 */

	getStore ( ) {
		return this.m_store;
	}

	/**
	 * 
	 */

	public getCount() {
		return this.m_index.length;
	}

	/**
	 * 
	 * @param id 
	 */

	public indexOfId(id: RecordID): number {
		let ridx = this.m_store.indexOfId( id );
		return this.m_index.findIndex( (rid) => rid === ridx );
	}

	/**
	 * 
	 * @param index 
	 */

	public getByIndex(index: number): Record {
		
		if (index >= 0 && index < this.m_index.length) {
			let rid = this.m_index[index];
			return this.m_store.getByIndex( rid );
		}	
		
		return null;
	}

	public getIdByIndex( index: number ) : RecordID {
		const rec = this.getByIndex( index );
		return this.m_model.getID( rec );
	}

	public getRecId( rec: Record ): RecordID {
		return this.m_model.getID( rec );
	}

	/**
	 * 
	 * @param id 
	 */

	public getById( id: RecordID): Record {
		return this.m_store.getById( id );
	}

	/**
	 * 
	 */

	getModel( ) {
		return this.m_model;
	}

	/**
	 * 
	 */

	changed( ) {
		this.fire( 'view_change', {change_type:'change'} );
	}

	/**
	 * 
	 */

	 forEach( cb: ( rec: Record, index: number ) => any ) {
		this.m_index.some( ( index ) => {
			let rec = this.m_store.getByIndex( index );
			if( rec ) {
				if( cb( rec, index ) ) {
					return index;
				}
			}
		} );
	}
}



