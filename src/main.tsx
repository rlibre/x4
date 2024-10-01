import { Button } from "./components/button/button"
import { Label } from "./components/label/label"
import { Checkbox } from "./components/checkbox/checkbox"
import { HBox, VBox } from "./components/boxes/boxes"

import { Listbox, ListboxItem } from './components/listbox/listbox'
import { Panel } from './components/panel/panel'

import "@fontsource/montserrat"
import "./main.scss"
import { TextEdit } from './components/textedit/textedit.js'

window.onload = ( ) => {
	
	const items: ListboxItem[] = [
		{ id: 1, text: "Item 1" },
		{ id: 2, text: "Item 2" },
		{ id: 3, text: "Item 3" },
		{ id: 4, text: "Item 4" },
		{ id: 5, text: "Item 5" },
		{ id: 6, text: "Item 6" },
	];

	const t = new VBox( {
		style: {
			gap: "8px",
		},
		content: [
			new Label( { text: "label", icon: "assets/radio.svg" } ),
			new HBox( { content: [
				new Button( { label:'OK', icon:"assets/house-light.svg" } ),
				new Button( { label:'OK', icon:"assets/house-light.svg", disabled: true } ),
				new Button( { cls: "outline", label:'OK', icon:"assets/house-light.svg" } ),
			]}),
			new HBox({ content: [
				new Checkbox( { label: 'Check', checked: true } ),
				new Checkbox( { label: 'Check', disabled: true, checked: true } ),
			]}),
			new HBox( {content: [
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
			]}),
			new Panel( {
				title: "Panel",
				icon:"assets/house-light.svg",
				width: 450,
				content: [
					new TextEdit( { labelWidth: 90, label: "Login", value: "hello", required: true, disabled: true } ),
					new TextEdit( { labelWidth: 90, label: "Password", value: "world", type: "password", inputGadgets: [
						new Button( { icon: "assets/house-light.svg" })
					] } ),
					new TextEdit( { labelWidth: 90, label: "Email", value: "", type: "email", placeholder: "select your email contact" } ),
				]
			})
		]
	} );

	document.body.appendChild( t.dom );
}




