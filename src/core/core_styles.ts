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
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { isString } from './core_tools.js';

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

export type ariaValues = {
	"aria-activedescendant": 1,
	"role": 1,
}

export function isUnitLess( name: string ) {
	return unitless[name] ? true : false;
}

/**
 * 
 */

export class Stylesheet {

	readonly m_sheet: CSSStyleSheet;
	readonly m_rules: Map<string, number> = new Map( );

	constructor() {
		
		function getStyleSheet( name: string ) : CSSStyleSheet {
			for(let i=0; i<document.styleSheets.length; i++) {
			  	let sheet = document.styleSheets[i];
			  	if(sheet.title === name ) {
					return sheet;
			  	}
			}
		}

		this.m_sheet = getStyleSheet( 'x4-dynamic-css' );
		if( !this.m_sheet ) {
			const dom = document.createElement( 'style' );
			dom.setAttribute('id', 'x4-dynamic-css' );
			document.head.appendChild(dom);
			this.m_sheet = dom.sheet
		}
	}

    /**
     * add a new rule to the style sheet
     * @param {string} name - internal rule name 
     * @param {string} definition - css definition of the rule 
     * @example
     * setRule('xbody', "body { background-color: #ff0000; }" );
     */

	public setRule(name: string, definition: any ) {

		if( isString(definition) ) {
			let index = this.m_rules.get( name );
			if (index !== undefined) {
				this.m_sheet.deleteRule(index);
			}
			else {
				index = this.m_sheet.cssRules.length;
			}

			this.m_rules.set( name, this.m_sheet.insertRule( definition, index) );
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
	 * return the style variable value
	 * @param name - variable name 
	 * @example
	 * ```
	 * let color = Component.getCss( ).getVar( 'button-color' );
	 * ```
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

