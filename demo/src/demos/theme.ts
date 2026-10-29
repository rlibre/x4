/**
 * Theme: the page of the gallery
 */

import { Application, Button, Checkbox, ColorInput, HBox, Label, Radio, Slider, Switch, VBox } from 'x4js';
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

/** @demo Your colour, live — A theme is only variables. From the colour picked, the scale --color-primary-a5 to a90 is made as themes.scss makes it (the lightness of the base moved, here by CSS), written on <html>: the accents, the titles, the selections follow, the gallery too. Reset gives the theme back. */
export function liveAccent( ) {
	const root = document.documentElement.style;

	// the shades of the scale: the lightness (HSL) of the base moved by so many points
	const scale: [ string, number ][] = [
		[ "a5", 35 ], [ "a10", 33.6 ], [ "a20", 25.2 ], [ "a30", 16.8 ], [ "a40", 8.4 ], [ "a50", 0 ],
		[ "a55", -5 ], [ "a60", -8.4 ], [ "a70", -16.8 ], [ "a80", -25.2 ], [ "a90", -33.6 ],
	];

	const apply = ( base: string ) => {
		// in the dark theme, the light shades are its dark surfaces: the accents only (a40 and after)
		const dark = Application.getTheme( ) == "dark";

		for( const [ name, delta ] of scale ) {
			if( !dark || delta <= 8.4 ) {
				root.setProperty( `--color-primary-${name}`, `hsl( from ${base} h s calc( l + ${delta} ) )` );
			}
		}
	};

	// the base of the theme shown, to start from
	const base = getComputedStyle( document.documentElement ).getPropertyValue( "--color-primary-a50" ).trim( );

	return new VBox( { content: [
		new HBox( { content: [
			new ColorInput( { width: 220, color: base, format: "hex", picker: true, change: ( ev ) => apply( ev.color.toHexString( ) ),
				swatches: [ "#569cd6", "#e8590c", "#2f9e44", "#7048e8", "#c2255c", "#1098ad" ] } ),
			new Button( { label: "Reset", cls: "outline", click: ( ) => scale.forEach( ( [ name ] ) => root.removeProperty( `--color-primary-${name}` ) ) } ),
		] } ),
		sample( "theme-live" ),
	] } );
}

/** @demo The size of the text — `--font-size` is the size of the text of `body`: 14px in x4, 12px in this gallery (its `:root`). To change the size of the text, set `--font-size`, not the `font-size` of `<html>`: the components follow `--font-size`, while the `font-size` of `<html>` is only the `rem` of a few inner sizes (the box of a checkbox, the round of a radio). This gallery sets its `<html>` to `--font-size`, so that its `rem` follow too. The slider writes it on `<html>`, Reset gives the one of the style back. */
export function fontSize( ) {
	const html = document.documentElement;
	const size = ( ) => parseFloat( getComputedStyle( html ).getPropertyValue( "--font-size" ) );
	const value = new Label( { text: `${size( )}px` } );

	const slider = new Slider( { min: 10, max: 18, step: 1, value: size( ), width: 200, change: ( ev ) => {
		html.style.setProperty( "--font-size", `${ev.value}px` );
		value.setText( `${ev.value}px` );
	} } );

	return new VBox( { content: [
		new HBox( { content: [
			slider,
			value,
			new Button( { label: "Reset", cls: "outline", click: ( ) => {
				html.style.removeProperty( "--font-size" );
				slider.setValue( size( ) );
				value.setText( `${size( )}px` );
			} } ),
		] } ),
		sample( "theme-font" ),
	] } );
}

const page: DemoComponent = {
	name: "Theme",
	category: "Extras",
	description: "The colours of x4 are CSS variables: a theme only changes them. Application.setTheme gives the dark theme of x4, or one of the application (html.x4theme-<name>); a variable can also be written by the code.",
	imports: [ "Application" ],
	demos: [ lightDark, ownTheme, liveAccent, fontSize ],
};

export default page;
