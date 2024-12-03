/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file propertygrid.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { DataModel, DataRecord, DataStore, FieldInfo } from '../../core/core_data';
import { Input } from "../input/input"
import { Gridview, GridviewEvents, GridviewProps } from '../gridview/gridview';
import { componentFromDOM, EvChange } from "../../core/component"


/**
 * 
 */

class PropertyModel extends DataModel {
	override getFields(): FieldInfo[] {
		return [
			{ name: "name", type: "string" },
			{ name: "label", type: "string" },
			{ name: "type", type: "string" },
			{ name: "value", type: "any" }
		]
	}

	override getID(rec: DataRecord) {
		return rec.name;
	}
}

/**
 * 
 */

interface PropertyValue {
	name: string;
	label: string;
	type: "number" | "string";
	value: any;
}

interface PropertygridProps extends Omit<Omit<GridviewProps,"store">,"columns"> {
	values?: PropertyValue[];
}

interface PropertygridEvents extends GridviewEvents {
	propertyChange?: EvChange;
}

/**
 * 
 */

export class PropertyGrid extends Gridview<GridviewProps,PropertygridEvents> {

	private _editor: Input;
	private _datastore: DataStore;

	constructor( props: PropertygridProps ) {
		const store = new DataStore( { model: new PropertyModel } );
		super( { ...props, store: store, columns: [
			{ id: "label", title: "Nom", width: 10, flex: 1 },
			{ id: "value", title: "Valeur", width: 10, flex: 1 }
		] } );

		this._datastore = store;

		if( props.values ) {
			this.setValues( props.values );
		}
	}

	setValues( values: PropertyValue[] ) {
		this.lock( true );
		values.forEach( p => {
			this._datastore.append( {
				name: p.name,
				type: p.type,
				label: p.label,
				value: p.value,
			})
		})
		this.lock( false );
	}

	/**
	 * TODO: handle misc types
	 */
	
	protected override _on_dblclk( e: UIEvent, row: number ) {
		let el = componentFromDOM(e.target as HTMLElement );
		while (el && !el.hasClass("cell")) {
			el = el.parentElement();
		}

		if (!el) {
			return;
		}

		const col = el.getIntData("col");
		if( col!=1 ) { // on value
			return;
		}

		// calc cell position 
		const rc = el.getBoundingRect( );
		const mrc = this.getBoundingRect( );
		const data = this._datastore.getByIndex( row );
		
		if( !this._editor ) {
			this._editor = new Input( { type: "text", value: "" } );
			this.appendContent( this._editor );

			this._editor.addDOMEvent( "focusout", ( ) => {
				this._editor.hide( );

				const value = this._editor.getValue( );

				const ev: EvChange = { value: value, context: data.name };
				this.fire( "propertyChange", ev );

				if( !ev.defaultPrevented ) {
					data.value = value
					this._datastore.update( data );
				}
			});
		}

		this._editor.setStyle( {
			zIndex: "100",
			position: "absolute",
			left: (rc.left-mrc.left-1)+"px",
			top: (rc.top-mrc.top-1)+"px",
			width: (rc.width-2)+"px",
			height: (rc.height)+"px",
			outline: "2px solid var(--accent-background)"
		});

		this._editor.setValue( (data as any).value );
		this._editor.show( );
		this._editor.focus( );
	}
}

