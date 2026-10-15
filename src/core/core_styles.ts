/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_styles.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { isString } from './core_tools';

export const unitless: Record<string,1> = {
	animationIterationCount: 1,
	aspectRatio: 1,
	borderImageOutset: 1,
	borderImageSlice: 1,
	borderImageWidth: 1,
	boxFlex: 1,
	boxFlexGroup: 1,
	boxOrdinalGroup: 1,
	columnCount: 1,
	columns: 1,
	flex: 1,
	flexGrow: 1,
	flexPositive: 1,
	flexShrink: 1,
	flexNegative: 1,
	flexOrder: 1,
	gridRow: 1,
	gridRowEnd: 1,
	gridRowSpan: 1,
	gridRowStart: 1,
	gridColumn: 1,
	gridColumnEnd: 1,
	gridColumnSpan: 1,
	gridColumnStart: 1,
	msGridRow: 1,
	msGridRowSpan: 1,
	msGridColumn: 1,
	msGridColumnSpan: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	tabSize: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1,
	WebkitLineClamp: 1,
  
	// SVG-related properties
	fillOpacity: 1,
	floodOpacity: 1,
	stopOpacity: 1,
	strokeDasharray: 1,
	strokeDashoffset: 1,
	strokeMiterlimit: 1,
	strokeOpacity: 1,
	strokeWidth: 1
}

export type AriaAttributes = {
	"role":                   1;
	"aria-label":             1;
	"aria-labelledby":        1;
	"aria-describedby":       1;
	"aria-details":           1;
	"aria-roledescription":   1;
	"aria-keyshortcuts":      1;
	"aria-placeholder":       1;
	"aria-activedescendant":  1;
	"aria-controls":          1;
	"aria-owns":              1;
	"aria-flowto":            1;
	"aria-errormessage":      1;
	"aria-hidden":            1;
	"aria-disabled":          1;
	"aria-busy":              1;
	"aria-modal":             1;
	"aria-required":          1;
	"aria-readonly":          1;
	"aria-checked":           1;
	"aria-pressed":           1;
	"aria-selected":          1;
	"aria-expanded":          1;
	"aria-invalid":           1;
	"aria-current":           1;
	"aria-haspopup":          1;
	"aria-multiselectable":   1;
	"aria-multiline":         1;
	"aria-atomic":            1;
	"aria-live":              1;
	"aria-relevant":          1;
	"aria-orientation":       1;
	"aria-sort":              1;
	"aria-valuemin":          1;
	"aria-valuemax":          1;
	"aria-valuenow":          1;
	"aria-valuetext":         1;
	"aria-level":             1;
	"aria-setsize":           1;
	"aria-posinset":          1;
	"aria-rowcount":          1;
	"aria-colcount":          1;
	"aria-rowindex":          1;
	"aria-colindex":          1;
	"aria-rowspan":           1;
	"aria-colspan":           1;
	"aria-autocomplete":      1;
}

export function isUnitLess( name: string ) {
	return unitless[name] ? true : false;
}

// one sheet for the page, shared by all the Stylesheet: a name is one rule,
// whatever instance sets it
let page_sheet: CSSStyleSheet = null;
const page_rules = new Map<string, CSSRule>( );

function pageSheet( ): CSSStyleSheet {
	if( !page_sheet ) {
		// found by its id: a title would make it a "preferred" style sheet,
		// of which a page applies only one
		let dom = document.getElementById( 'x4-dynamic-css' ) as HTMLStyleElement;
		if( !dom ) {
			dom = document.createElement( 'style' );
			dom.id = 'x4-dynamic-css';
			document.head.appendChild( dom );
		}

		page_sheet = dom.sheet;
	}

	return page_sheet;
}

/**
 * Rules added to the page while it runs, in one <style id="x4-dynamic-css">.
 * @deprecated the CSS variables do it: setStyleVariable( ) on a component,
 * var( --name ) in its stylesheet
 */

export class Stylesheet {

	readonly _sheet: CSSStyleSheet;
	readonly _rules: Map<string, CSSRule>;

	constructor() {
		this._sheet = pageSheet( );
		this._rules = page_rules;
	}

    /**
     * add a new rule to the style sheet
     * @param {string} name - internal rule name 
     * @param {string} definition - css definition of the rule 
     * @example
     * setRule('xbody', "body { background-color: #ff0000; }" );
     * @deprecated a CSS variable: setStyleVariable( ) on a component, var( --name ) in its stylesheet
     */

	public setRule(name: string, definition: any ) {

		if( isString(definition) ) {
			const sheet = this._sheet;
			const old = this._rules.get( name );

			// in the place of the rule of that name, else at the end
			let index = sheet.cssRules.length;
			if( old ) {
				const at = Array.prototype.indexOf.call( sheet.cssRules, old );
				if( at>=0 ) {
					index = at;
				}
			}

			// inserted first: a definition that is not valid throws, the old rule stays
			sheet.insertRule( definition, index );
			if( old && sheet.cssRules[index+1]===old ) {
				sheet.deleteRule( index+1 );
			}

			this._rules.set( name, sheet.cssRules[index] );
		}
		else {
			let idx = 1;
			for( let r in definition ) {

				let rule = r + " { ",
					css = definition[r];

				for (let i in css) {
					
					let values = css[i];	// this is an array !
					for (let j = 0; j < values.length; j++) {
						rule += i + ": " + values[j] + "; "
					}
				}

				rule += '}';

				//console.log( rule );
				
				this.setRule( name+'--'+idx, rule );
				idx++;
			}
		}
	}

	/**
	 * Returns the computed value of a CSS custom property (CSS variable) from the document's root element.
	 * @param name - variable name 
	 * @example
	 * ```
	 * let color = Component.getCss( ).getVar( 'button-color' );
	 * ```
	 * @deprecated getStyleVariable( ) of a component, or getComputedStyle( document.documentElement ).getPropertyValue( "--name" )
	 */

	public static getVar( name: string ) : any {
		if( !Stylesheet.doc_style ) {
			Stylesheet.doc_style = getComputedStyle( document.documentElement );
		}

		if( !name.startsWith('--') ) {
			name = '--'+name;
		}

    	return Stylesheet.doc_style.getPropertyValue( name ); // #999999
	}

	static guid: number = 1;
	static doc_style: CSSStyleDeclaration;
}

/**
 * 
 */

export class ComputedStyle {
	m_style:CSSStyleDeclaration;

	constructor( style: CSSStyleDeclaration ) {
		this.m_style = style;
	}

	/**
	 * return the raw value
	 */

	value( name: keyof CSSStyleDeclaration ) : any {
		return this.m_style[name];
	}

	/**
	 * return the interpreted value
	 */
	
	parse( name: keyof CSSStyleDeclaration ) : number {
		return parseInt( this.m_style[name] as any  );
	}

	/**
	 * 
	 */

	get style( ) {
		return this.m_style;
	}
}
