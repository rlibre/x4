
// :: MESSAGEBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { _tr } from '../../core/core_i18n';

import { HBox } from '../boxes/boxes';
import { Icon } from '../icon/icon';
import { Label } from '../label/label';
import { Dialog, DialogProps } from "../dialog/dialog"

import "./messages.module.scss";

import error_icon from "./circle-exclamation.svg";
import { asap, class_ns, UnsafeHtml } from '../../core/core_tools.js';
import { Form } from '../form/form.js';
import { BtnGroupItem } from '../components.js';

export interface MessageBoxProps extends DialogProps {
	message: string;
	click: (button: string) => void;
}

/**
 * 
 */

@class_ns( "x4" )
export class MessageBox extends Dialog<DialogProps>
{
	m_label: Label;

	constructor(props: DialogProps) {
		super(props);
	}

	setText(txt: string | UnsafeHtml ) {
		this.m_label.setText( txt );
	}

	/**
	 * display a messagebox
	 */

	static show( msg: string | UnsafeHtml, buttons?: BtnGroupItem[] ): MessageBox {

		const box = new MessageBox({ 
			modal: true,
			title: _tr.global.error,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: error_icon }),
							new Label( { text: msg } ),
						]
					}),
				]
			}),
			buttons: buttons ?? [ "ok.outline","cancel.outline" ]
		});
	
		box.on( "btnclick", ( ev ) => {
			asap( ( ) => {
				box.close() 
			});
		});

		box.display();
		return box;
	}
}