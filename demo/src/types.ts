/**
 * The description of a component, default export of src/demos/<component>.ts
 */

import { Component, PropertyValue } from 'x4js';

/**
 * a prop the configurator edits: a row of the PropertyGrid. Its value comes from
 * DemoUsage.props. An option may carry in its `data` the text written in the code
 * for its value (an icon: `icon_save`).
 */

export interface DemoControl extends Omit<PropertyValue, "value" | "callback"> {
	default?: boolean | number | string;	// the default of x4 when it is not empty: the prop is written when it differs from it (readonly: false)
}

export interface DemoUsage {
	create: ( props: any ) => Component;	// builds the component from the props of the configurator
	props: Record<string, any>;				// the props at the start
	extra?: string;							// the props the configurator does not edit, as written in the code: "items: fruits"
	controls: DemoControl[];
}

export interface DemoComponent {
	name: string;							// the class: "Button"
	category: string;						// a section of the navigation
	description: string;
	imports?: string[];						// the import line of the page; [name] when missing
	module?: string;						// the entry of the import line: "x4js/mapview"; "x4js" when missing
	usage?: DemoUsage;						// the configurator; none when the props do not fit it
	expand?: boolean;						// a button on the right of the title of each variation: the card covers the window
	demos: ( ( ) => Component )[];			// the variations: functions with a "@demo" doc comment
}

/**
 * the components of a category of the navigation
 */

export interface ComponentGroup {
	category: string;
	docs: DemoComponent[];
}

/**
 * a variation, as gen-sources.mjs reads it
 */

export interface DemoSource {
	title: string;
	text: string;
	ts: string;
	scss: string;
}
