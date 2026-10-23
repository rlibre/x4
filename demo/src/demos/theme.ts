/**
 * Theme: the page of the gallery
 */

import { Application, Button, Checkbox, Color, ColorInput, HBox, Radio, Slider, Switch, VBox } from 'x4js';
import { DemoComponent } from '../types';

import "./theme.scss";

// a few components that show the colours of the theme (group: the name of its radio)
function sample( group: string ) {
	return new HBox( { cls: "theme-sample", content: [
		new Button( { label: "Save" } ),
		new Button( { label: "Cancel", cls: "outline" } ),
		new Checkbox( { label: "Checked", checked: true } ),
		new Radio( { label: "Chosen", name: group, value: "a", checked: true } ),
		new Switch( { label: "On", checked: true } ),
		new Slider( { min: 0, max: 100, value: 60, width: 120 } ),
	] } );
}

/** @demo Light and dark — Application.setTheme( "dark" ) puts the class x4theme-dark on <html>: the variables of the dark theme replace those of the light one, and every component follows; setTheme( "" ) gives the light one back. */
export function lightDark( ) {
	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Light", cls: "outline", click: ( ) => Application.setTheme( "" ) } ),
			new Button( { label: "Dark", cls: "outline", click: ( ) => Application.setTheme( "dark" ) } ),
		] } ),
		sample( "theme-light-dark" ),
	] } );
}

/** @demo A theme of your own — Its variables under html.x4theme-<name> in the style of the application, and setTheme( "<name>" ). The greys are mixes of --color-primary-a0 (the background) and a100 (the text): those two change them all. */
export function ownTheme( ) {
	return new VBox( { content: [
		new HBox( { content: [
			new Button( { label: "Sand", cls: "outline", click: ( ) => Application.setTheme( "sand" ) } ),
			new Button( { label: "Light", cls: "outline", click: ( ) => Application.setTheme( "" ) } ),
		] } ),
		sample( "theme-own" ),
	] } );
}

/** @demo Your colour, live — A theme is only variables: the picker writes the accent and its shades on <html> (style.setProperty), and the whole page follows, the gallery too. Reset gives the theme back. */
export function liveAccent( ) {
	const root = document.documentElement.style;
	const names = [ "--accent-background", "--accent-background-hover", "--accent-background-focus", "--accent-background-active" ];

	const apply = ( color: Color ) => {
		const hex = color.toHexString( );
		root.setProperty( "--accent-background", hex );
		root.setProperty( "--accent-background-hover", new Color( hex ).lighten( 12 ).toHexString( ) );
		root.setProperty( "--accent-background-focus", new Color( hex ).darken( 12 ).toHexString( ) );
		root.setProperty( "--accent-background-active", new Color( hex ).darken( 30 ).toHexString( ) );
	};

	// the accent of the theme shown, to start from
	const accent = getComputedStyle( document.documentElement ).getPropertyValue( "--accent-background" ).trim( );

	return new VBox( { content: [
		new HBox( { content: [
			new ColorInput( { width: 220, color: accent, format: "hex", picker: true, change: ( ev ) => apply( ev.color ),
				swatches: [ "#3488ce", "#e8590c", "#2f9e44", "#7048e8", "#c2255c", "#1098ad" ] } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => names.forEach( name => root.removeProperty( name ) ) } ),
		] } ),
		sample( "theme-live" ),
	] } );
}

const page: DemoComponent = {
	name: "Theme",
	category: "Extra",
	description: "The colours of x4 are CSS variables: a theme only changes them. Application.setTheme gives the dark theme of x4, or one of the application (html.x4theme-<name>); a variable can also be written by the code.",
	imports: [ "Application" ],
	demos: [ lightDark, ownTheme, liveAccent ],
};

export default page;
