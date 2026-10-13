/**
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|
 *  /__/\__\   |_|
 *
 * @file core_clipboard.ts
 * @author Etienne Cochard
 *
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

/**
 * The clipboard of the system: a text, an image, files.
 *
 * There are two ways to it, and they do not give the same things.
 *
 * In a "copy", "cut" or "paste" event (the keys of the user, the menu of
 * the browser), the browser gives its clipboard at once and asks nothing:
 * setEventClipboard, getEventClipboard. It is the only way to read files.
 *
 * Out of an event (a menu, a button), the system is asked: setClipboard,
 * getClipboard. It is asynchronous, the browser may ask the user for a
 * permission or refuse, and there is nothing to ask on a page that is not
 * served in https. So what the application set last is kept: it is what is
 * read when the system does not answer, and copy and paste still work
 * inside the application.
 *
 * Files cannot be written, in neither way.
 */

export interface ClipboardContent {
	text?: string;
	/** written as a PNG, the format every browser takes: another one is converted */
	image?: Blob;
}

export interface ClipboardRead extends ClipboardContent {
	/** all the files, the images too; none out of an event */
	files: File[];
}

/** what the application set last */
let kept: ClipboardContent = null;

function toPng( image: Blob ): Promise<Blob> {
	return new Promise( ( resolve, reject ) => {
		const url = URL.createObjectURL( image );
		const img = document.createElement( "img" );

		img.onload = ( ) => {
			URL.revokeObjectURL( url );

			const canvas = document.createElement( "canvas" );
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			canvas.getContext( "2d" ).drawImage( img, 0, 0 );

			canvas.toBlob( png => png ? resolve( png ) : reject( new Error( "not an image" ) ), "image/png" );
		};

		img.onerror = ( ) => {
			URL.revokeObjectURL( url );
			reject( new Error( "not an image" ) );
		};

		img.src = url;
	} );
}

/**
 * Set the clipboard, from a menu or a button.
 *
 * @returns true when the system took it. When it did not, getClipboard
 * still gives it back: it can be pasted in the application.
 *
 * @example
 * setClipboard( { text: "hello" } );
 * setClipboard( { image: blob, text: "the same, for what cannot paste an image" } );
 */

export async function setClipboard( data: ClipboardContent ): Promise<boolean> {
	kept = { text: data.text, image: data.image };

	// not there on a page that is not served in https
	const system = navigator.clipboard;
	if( !system ) {
		return false;
	}

	try {
		if( !data.image ) {
			await system.writeText( data.text ?? "" );
			return true;
		}

		// the conversion is given as a promise: the system has to be asked
		// now, while the click of the user still allows it
		const parts: Record<string,Blob | Promise<Blob>> = {
			"image/png": data.image.type==="image/png" ? data.image : toPng( data.image ),
		};

		if( data.text ) {
			parts["text/plain"] = new Blob( [data.text], { type: "text/plain" } );
		}

		await system.write( [new ClipboardItem( parts )] );
		return true;
	}
	catch( e ) {
		return false;
	}
}

/**
 * Read the clipboard, from a menu or a button.
 *
 * @returns what the system holds. When it refuses or cannot be asked, what
 * the application set last. Never files: see getEventClipboard.
 *
 * @example
 * const data = await getClipboard( );
 * if( data.text ) {
 * 	input.setValue( data.text );
 * }
 */

export async function getClipboard( ): Promise<ClipboardRead> {
	const system = navigator.clipboard;

	if( system ) {
		try {
			// read gives the images too, but some browsers only have readText
			if( !system.read ) {
				const text = await system.readText( );
				return { text: text || undefined, files: [] };
			}

			const data: ClipboardRead = { files: [] };

			for( const item of await system.read( ) ) {
				for( const type of item.types ) {
					if( type==="text/plain" && !data.text ) {
						const blob = await item.getType( type );
						data.text = ( await blob.text( ) ) || undefined;
					}
					else if( type.startsWith( "image/" ) && !data.image ) {
						data.image = await item.getType( type );
					}
				}
			}

			return data;
		}
		catch( e ) {
			// refused: what the application has
		}
	}

	if( kept ) {
		return { text: kept.text, image: kept.image, files: [] };
	}

	return { files: [] };
}

/**
 * false when getClipboard has nothing to give: the system cannot be asked,
 * and the application did not set anything. What the system holds is not
 * known before it is asked for.
 *
 * @example
 * { text: _tr.global.paste, disabled: !canReadClipboard( ), click: ( ) => this.paste( ) }
 */

export function canReadClipboard( ): boolean {
	const system = navigator.clipboard;
	if( system && ( system.read || system.readText ) ) {
		return true;
	}

	return !!kept;
}

/**
 * Set the clipboard in a "copy" or a "cut" event. The default of the event
 * is prevented: the browser would copy its own selection instead.
 *
 * @example
 * this.addDOMEvent( "copy", ev => {
 * 	setEventClipboard( ev, { text: this.getSelectedText( ) } );
 * } );
 */

export function setEventClipboard( ev: ClipboardEvent, data: ClipboardContent ): void {
	kept = { text: data.text, image: data.image };

	ev.preventDefault( );

	if( data.text!==undefined && ev.clipboardData ) {
		ev.clipboardData.setData( "text/plain", data.text );
	}

	// the event only takes texts: the image is given to the system
	if( data.image ) {
		setClipboard( data );
	}
}

/**
 * Read the clipboard in a "paste" event. The default of the event is left
 * as it is: prevent it when what was read is used.
 *
 * @example
 * this.addDOMEvent( "paste", ev => {
 * 	const data = getEventClipboard( ev );
 * 	if( data.image ) {
 * 		ev.preventDefault( );
 * 		this.setPicture( data.image );
 * 	}
 * } );
 */

export function getEventClipboard( ev: ClipboardEvent ): ClipboardRead {
	const data: ClipboardRead = { files: [] };

	const transfer = ev.clipboardData;
	if( transfer ) {
		data.text = transfer.getData( "text/plain" ) || undefined;
		data.files = Array.from( transfer.files );
		data.image = data.files.find( file => file.type.startsWith( "image/" ) );
	}

	return data;
}
