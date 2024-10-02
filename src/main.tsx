import { wrapDOM } from '@core/component.js'

import { Button } from "./components/button/button"
import { Label } from "./components/label/label"
import { Checkbox } from "./components/checkbox/checkbox"
import { HBox, VBox } from "./components/boxes/boxes"

import { Listbox, ListItem } from './components/listbox/listbox'
import { Panel } from './components/panel/panel'
import { TextEdit } from './components/textedit/textedit.js'
import { TextArea } from './components/textarea/textarea.js'
import { Switch } from './components/switch/switch.js'
import { Combobox } from './components/combobox/combobox.js'
import { Slider } from './components/slider/slider.js'
import { Progress } from './components/progress/progress.js'
import { BtnGroup } from './components/btngroup/btngroup.js'
import { Image } from './components/image/image.js'


import "@fontsource/montserrat"
import "./main.scss"
import { ColorInput } from './components/colorinput/colorinput.js'
import { ColorPicker } from './components/colorpicker/colorpicker.js'

window.onload = ( ) => {
	
	const items: ListItem[] = [
		{ id: 1, text: "Item 1" },
		{ id: 2, text: "Item 2" },
		{ id: 3, text: "Item 3" },
		{ id: 4, text: "Item 4" },
		{ id: 5, text: "Item 5" },
		{ id: 6, text: "Item 6" },
	];

	const t = new HBox( {
		style: {
			alignItems: "start",
			gap: "8px",
			flexWrap: "wrap",
		},
		content: [
			new Panel( {
				title: "Panel",
				icon:"assets/house-light.svg",
				width: 510,
				content: [
				new Label( { text: "label", icon: "assets/radio.svg" } ),
				new HBox( { content: [
					new Button( { label:'OK', icon:"assets/house-light.svg" } ),
					new Button( { label:'OK', icon:"assets/house-light.svg", disabled: true } ),
					new Button( { cls: "outline", label:'OK', icon:"assets/house-light.svg" } ),
				]}),
				new VBox({ content: [
					new HBox({ content: [
						new Checkbox( { label: 'Unchecked', checked: false } ),
						new Checkbox( { label: 'Checked', checked: true } ),
						new Checkbox( { label: 'Disabled', disabled: true, checked: true } ),
					]}),
					new HBox({ content: [
						new Switch( { label: 'Unchecked', checked: false } ),
						new Switch( { label: 'Checked', checked: true } ),
						new Switch( { label: 'Disabled', checked: true, disabled: true } ),
					]}),
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
			]}),
			new Panel( {
				title: "Panel",
				icon:"assets/house-light.svg",
				width: 510,
				content: [
					new TextEdit( { labelWidth: 90, label: "Login", value: "hello", required: true, disabled: true } ),
					new TextEdit( { labelWidth: 90, label: "Password", value: "world", type: "password", inputGadgets: [
						new Button( { icon: "assets/house-light.svg" })
					] } ),
					new TextEdit( { labelWidth: 90, label: "Email", value: "", type: "email", placeholder: "select your email contact" } ),
					new TextArea( { label: "Demo", height: 140 } ),
					new Combobox( { label: 'ComboBox', items }),
					new Combobox( { label: 'Readonly', items, readonly: true }),
					new Combobox( { label: 'Disabled', items, disabled: true })
				]
			}),
			new Panel( {
				title: "Another panel",
				width: 610,
				content: [
					new Slider( {min: 0, max: 100, step: 10, value: 50 } ),
					new Progress( { min: 0, max: 100, value: 45, cls: "indeterm" } ),
					new BtnGroup( { cls: "x4flex", items: [ new Label({text:"group"} ), "ok","cancel","yes","no","-","retry","abort",new Button({cls:"danger",label:"custom"})]}),
					new HBox( { content: [
						new Image( { src:"https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png", lazy: true, width: 250, height: "100%", fit: "contain", position: "50% 50%", alt: "an image" } ),
						new ColorPicker( { color: "red",  } ),
					]}),
					new ColorInput( { color: "red",  } ),
					
				]
			})
		]
	} );

	const body = wrapDOM( document.body );
	body.appendContent( t );
	body.addClass( "fit" );
}





