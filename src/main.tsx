import { Component } from '@core/component.js'
import { Button } from "./components/button/button"
import { Label } from "./components/label/label"
import { Checkbox } from "./components/checkbox/checkbox"
import { HBox } from "./components/boxes/boxes"

import "@fontsource/montserrat"
import "./main.scss"
import { Listbox, ListboxItem } from './components/listbox/listbox.js'

window.onload = ( ) => {
	
	const items: ListboxItem[] = [
		{ id: 1, text: "Item 1" },
		{ id: 2, text: "Item 2" },
		{ id: 3, text: "Item 3" },
		{ id: 4, text: "Item 4" },
		{ id: 5, text: "Item 5" },
		{ id: 6, text: "Item 6" },
	];

	const t = new HBox( {
		content: [
			new Label( { text: "label", icon: "assets/radio.svg" } ),
			new Button( { label:'OK', icon:"assets/house-light.svg" } ),
			new Button( { label:'OK', icon:"assets/house-light.svg", disabled: true } ),
			new Button( { cls: "outline", label:'OK', icon:"assets/house-light.svg" } ),
			new Checkbox( { label: 'Check', checked: true } ),
			new Checkbox( { label: 'Check', disabled: true, checked: true } ),
			new Listbox( {
				width: 250,
				height: 150,
				items
			}),
			new Listbox( {
				width: 250,
				height: 150,
				items,
				disabled: true,
			})
		]
	} );

	document.body.appendChild( t.dom );
}

