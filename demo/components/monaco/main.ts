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

import { Application, HBox, HSizer, Treeview, VBox } from "@x4js/x4"
import { MonacoEditor } from "@x4js/components/monaco/monaco"

import icons from './icons/icons';

import "./main.scss"

const app = new Application( );

MonacoEditor.addTypelib( 'demo.d.ts',
`
    declare namespace Demo {
        function compute(value: number): string;
    }
`
)

const mainw = new HBox( {
	cls: "mainview",	
	content: [
		new Treeview( { 
			cls: 'monaco-component',	// to be able to get monaco vars
			width: 400,
			items: [
				{
					id: 1,text: "project",
					children: [
						{ id: 2, text: "demo.js", iconId: icons.ts }
					]
				}
			]
		} ),
		new HSizer( false ),
		new MonacoEditor( {
			language: "typescript",
			content: "const v = Demo.compute(5);",
			theme: 'vs-dark',
			options: {
				fontSize: 11,
			}
		}),
	]
})

app.setMainView( mainw );

