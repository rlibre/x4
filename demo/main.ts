/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * DEMO FILE
 * 
 **/

import { wrapDOM, Component } from "../src/core/component.ts";
import { unsafeHtml } from '../src/core/core_tools.js'
import { SvgBuilder, SvgComponent } from '../src/core/core_svg.js'

import { Button } from "../src/components/button/button.js"
import { Label } from "../src/components/label/label.js"
import { Checkbox } from "../src/components/checkbox/checkbox.js"
import { HBox, VBox } from "../src/components/boxes/boxes.js"

import { Listbox, ListItem } from '../src/components/listbox/listbox.js'
import { Panel } from '../src/components/panel/panel.js'
import { TextEdit } from '../src/components/textedit/textedit.js'
import { TextArea } from '../src/components/textarea/textarea.js'
import { Switch } from '../src/components/switch/switch.js'
import { Combobox } from '../src/components/combobox/combobox.js'
import { Slider } from '../src/components/slider/slider.js'
import { Progress } from '../src/components/progress/progress.js'
import { BtnGroup } from '../src/components/btngroup/btngroup.js'
import { Image } from '../src/components/image/image.js'
import { ColorInput } from '../src/components/colorinput/colorinput.js'
import { ColorPicker } from '../src/components/colorpicker/colorpicker.js'
import { Menu } from '../src/components/menu/menu.js'
import { initTooltips } from '../src/components/tooltips/tooltips.js'
import { Treeview, TreeItem } from '../src/components/treeview/treeview.js'
import { Dialog } from '../src/components/dialog/dialog.js'
import { Form } from '../src/components/form/form.js'
import { MessageBox } from '../src/components/messages/messages.js'
import { Calendar } from '../src/components/calendar/calendar.js'
import { Notification } from '../src/components/notification/notification.js'
import { Header } from '../src/components/header/header.js'
import { Tabs } from '../src/components/tabs/tabs.js'
import { Rating } from '../src/components/rating/rating.js'

import "@fontsource/montserrat"
import "./main.scss"

import def_icon from "./assets/house-light.svg";


function main( ) {
	
	initTooltips( );

	const testMenu = ( ev: MouseEvent ) => {
		const sub = new Menu( { items: [
				"Sub menu 1",
				{ text: "sub 1-1" }
			] 
		})

		const sub3 = new Menu( { items: [
				"Sub menu 3",
				{ text: "sub 3-1" }
			] 
		})
			
		const sub2 = new Menu( { items: [
				"Sub menu 2",
				{ text: "sub 2-1" },
				{ text: "menu e", menu: sub3 }
			] 
		})
		
		const pop = new Menu( {items: [
				"Title",
				{ text: "menu a", click: null, icon: def_icon },
				"-",
				{ text: "menu b", click: null },
				{ text: "menu c", click: null, disabled: true },
				"-",
				{ text: "menu d", menu: sub },
				{ text: "menu e", menu: sub2 },
			]
		});

		pop.displayAt( ev.pageX, ev.pageY );
		ev.stopPropagation( );
		ev.preventDefault( );
	}
	
	const items: ListItem[] = [
		{ id: 1, text: "Item 1" },
		{ id: 2, text: "Item 2" },
		{ id: 3, text: "Item 3" },
		{ id: 4, text: "Item 4" },
		{ id: 5, text: "Item 5" },
		{ id: 6, text: "Item 6" },
	];

	const tree_items: TreeItem[] = [
		{ id: 1, text: "root", open: true, children: [
			{ id: 2, text: "folder 1", children: [
				{ id: 3, text: "folder 1.1", children: [
					{ id: 4, text: "value 1.1" },
					{ id: 5, text: "value 1.2", iconId: def_icon },
					{ id: 6, text: "value 1.3" }
				] }
			]},
			{ id: 10, text: "folder 2", open: true, children: [
				{ id: 11, text: "folder 2.1", open: true, children: [
					{ id: 12, text: "value 2.1" },
					{ id: 13, text: "value 2.2" },
					{ id: 14, text: "value 2.3" }
				] }
			]}
		]}
	]

	const dialog = new Dialog( {
		title: "Dialog",
		modal: true,
		movable: true,
		sizable: true,
		closable: true,
		buttons: ['ok','cancel'],
		form: new Form( {
			content: [
				new Label( { cls: "x4flex", text: unsafeHtml("<h1>Example dialog</h1><p>This dialog is <i>resizable</i>...") } ),
				new TextEdit( { label: "title", value: "" } ),
			]
		}),
	});

	const svg_builder = new SvgBuilder( );

	svg_builder
		.ellipse( 45, 45, 40 )
		.stroke( "#ccc", 5 )
		.fill( "transparent" );

	svg_builder.path( )
		.arc( 45, 45, 40, 0, 30*360/100 )
		.stroke( "var( --accent-background )", 5 )
		.fill( "none" )
		.setAttr("tooltip","test")
		.strokeCap( "round" )
		.addDOMEvent( "mouseenter", ( ev ) => {
			console.log( ev.target );
			(ev.target as SVGElement).setAttribute( "stroke-width", "10px" );
		})
		.addDOMEvent( "mouseleave", ( ev ) => {
			console.log( ev.target );
			(ev.target as SVGElement).setAttribute( "stroke-width", "5px" );
		});

	svg_builder.text( 45, 42, "30%" )
		.textAlign( "center" )
		.verticalAlign( "baseline" )
		.fontSize( "150%" )
		.fontWeight( "bold" );

	svg_builder.text( 45, 80, "custom control" )
		.fontSize( "10px" )
		.textAlign( "center" )

	const t = new HBox( {
		style: {
			alignItems: "start",
			gap: "8px",
			flexWrap: "wrap",
		},
		content: [
			new Panel( {
				title: "Panel",
				icon: def_icon,
				width: 510,
				content: [
				new Label( { text: "label", icon: def_icon } ),
				new HBox( { content: [
					new Button( { label:'OK', icon:def_icon } ),
					new Button( { label:'OK', icon:def_icon, disabled: true } ),
					new Button( { cls: "outline", label:'OK', icon:def_icon } ),
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
				new Treeview( {
					items: tree_items,
					height: 150,
				}),
				new Header( { 
					items: [
						{ title: "Column ", name: "a1" },
						{ title: "Column 66%", name: "a2", width: -2 },
						{ title: "Column 33%", name: "a3", width: -1 },
					]
				} ),
			]}),
			new Panel( {
				title: "Panel",
				icon: def_icon,
				width: 510,
				content: [
					new TextEdit( { labelWidth: 90, label: "Login", value: "hello", required: true, disabled: true } ),
					new TextEdit( { labelWidth: 90, label: "Password", value: "world", type: "password", inputGadgets: [
						new Button( { icon: def_icon })
					] } ),
					new TextEdit( { labelWidth: 90, label: "Email", value: "", type: "email", placeholder: "select your email contact" } ),
					new TextArea( { label: "Demo", height: 140, tooltip: "This is a small tooltip" } ),
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
					new Rating( { value: 3 } ),
					new SvgComponent( { svg: svg_builder, id: "", viewbox: "0 0 90 90", width: 90, height: 90, style: { margin: '16px'} } ),

					new HBox( { content: [
						new Button( { label:'Dialog...', click: ( ) => dialog.show() } ),
						new Button( { label:'Message...', click: ( ) => {MessageBox.show( unsafeHtml( '<b>Care</b><br/>You will delete <i>all data</i>.' ) ) } } ),
						new Button( { label:'Notification...', click: ( ) => { new Notification( { mode: "success", text: "Modification saved", title: "Backup" } ).display( 5 ) } } ),
					]}),
				]
			}),
			new Panel( {
				title: "Another panel",
				width: 410,
				content: [
					new Calendar( { } ),
				]
			}),
			new Tabs( {

				width: 500,
				height: 200,

				default: "page1",
				items: [
					{ name: "page1", title: "Tab 1", icon: def_icon, tab: new Label( { text: unsafeHtml(`<h4>tab 1 content</h4><p>lorem ipsum</p>`)}) },
					{ name: "page2", title: "Tab 2", icon: def_icon, tab: new Label( { text: unsafeHtml(`<h4>tab 2 content</h4><p>ipsum lorem</p>` )}) },
					{ name: "page3", title: "Tab 3", tab: new Label( { text: unsafeHtml(`<h4>tab 3 content</h4><p>ipsum ++</p>` )}) },
				]
			})
		]
	} );

	const body = wrapDOM( document.body );
	body.appendContent( t );
	body.addClass( "fit" );
	body.addDOMEvent( "contextmenu", ( ev ) => { testMenu(ev) } );
}

function waitFontLoading(name: string) {

	// tip for waiting font loading:
	// by default, body is created invisible ((opacity = 0)
	// we create a div inside with the font we need to wait the loading
	// as soon as the font is loaded, it's size will change, the browser end font loading
	// we can remove the div.
	// pitfall: if the font is already loaded, ne never end.
	// @review that

	let ct = document.createElement('div');

	ct.style.position = 'absolute';
	ct.style.visibility = 'hidden';
	ct.innerText = 'X';

	document.body.appendChild(ct);

	return new Promise<void>((resolve) => {

		//let irc = ct.getBoundingClientRect();
		const initialWidth = ct.offsetWidth;

		let tm = setInterval(() => {

			const newWidth = ct.offsetWidth;
			if (newWidth!=initialWidth ) {
				clearInterval(tm);
				document.body.removeChild(ct);
				resolve();
			}
		}, 0);
	});
}

waitFontLoading( "montserrat" ).then( main );
//main( );
