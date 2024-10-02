
// :: MESSAGEBOX ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { _tr } from '@core/core_i18n.js';
import { HBox } from '../boxes/boxes.js';
import { Icon } from '../icon/icon.js';
import { Label } from '../label/label.js';

///@ts-ignore
import error_icon from "./circle-exclamation.svg";

export interface MessageBoxProps extends DialogProps {
	message: string;
	click: (button: string) => void;
}

export class MessageBox extends Dialog<DialogProps>
{
	m_label: Label;

	constructor(props: DialogProps) {
		super(props);
	}

	set text(txt: string ) {
		this.m_label.setLabel( txt );
	}

	/**
	 * display a messagebox
	 */

	static show( msg: string ): MessageBox {

		const box = new MessageBox({ 
			modal: true,
			title: _tr.global.error,
			movable: true,
			form: new Form( {
				content: [
					new HBox( {
						content: [
							new Icon( { iconId: error_icon }),
							new Label( { label: msg } ),
						]
					}),
				]
			}),
			buttons: ["ok","cancel"]
		});
	
		box.on( "btnClick", ( ev ) => {
			setTimeout( ( ) => {
				box.close();
			}, 0 );
		});

		box.display();
		return box;
	}
}