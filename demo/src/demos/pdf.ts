/**
 * PDF: the page of the gallery
 */

import { Button, Component, HBox, Image, VBox, X4PDFBuilder, renderBarcodeImage } from 'x4js';
import { DemoComponent } from '../types';
import { icon_star } from '../icons';

/** @demo An invoice — page( width, height, ( ctx ) => ... ) draws a page in points, its origin at the bottom left: texts, rectangles, lines. buildURL( ) gives an address of the file, for an iframe. */
export function invoice( ) {
	const pdf = new X4PDFBuilder( { title: "Invoice 2026-042" } );

	pdf.page( 595, 842, ( ctx ) => {		// A4
		ctx.rect( 0, 772, 595, 70, "#126e9e" );
		ctx.text( "INVOICE", 40, 798, 24, { color: "#ffffff", bold: true } );
		ctx.text( "2026-042", 355, 800, 14, { align: "right", width: 200, color: "#ffffff" } );

		const rows: [ string, number, number ][] = [
			[ "x4 support, one year", 1, 1200 ],
			[ "Training, a day", 2, 900 ],
			[ "Report designer", 1, 450 ],
		];

		let y = 700;
		ctx.text( "Item", 40, y, 11, { bold: true } );
		ctx.text( "Qty", 355, y, 11, { bold: true, align: "right", width: 60 } );
		ctx.text( "Amount", 455, y, 11, { bold: true, align: "right", width: 100 } );
		ctx.line( 40, y - 8, 555, y - 8, "#999999" );

		let total = 0;
		for( const [ item, qty, price ] of rows ) {
			y -= 26;
			total += qty * price;
			ctx.text( item, 40, y, 11 );
			ctx.text( `${qty}`, 355, y, 11, { align: "right", width: 60 } );
			ctx.text( `${( qty * price ).toFixed( 2 )} €`, 455, y, 11, { align: "right", width: 100 } );
		}

		ctx.line( 40, y - 10, 555, y - 10, "#999999" );
		ctx.text( `Total: ${total.toFixed( 2 )} €`, 355, y - 34, 14, { bold: true, align: "right", width: 200 } );
	} );

	const url = pdf.buildURL( );

	return new VBox( { content: [
		new Component( { tag: "iframe", attrs: { src: url }, style: { width: "100%", height: "420px", border: "1px solid #ccc" } } ),
		new HBox( { content: [
			new Button( { label: "Open in a tab", cls: "outline", click: ( ) => window.open( url ) } ),
		] } ),
	] } );
}

/** @demo Barcodes — barcode( ) draws a Data Matrix or a Code 128 in the page; renderBarcodeImage( ) gives the same code as an image for the screen. */
export function barcodes( ) {
	const pdf = new X4PDFBuilder( );

	pdf.page( 595, 420, ( ctx ) => {
		ctx.text( "Data Matrix", 40, 370, 12, { bold: true } );
		ctx.barcode( "datamatrix", "https://x4js.org", 40, 240, 110, 110 );

		ctx.text( "Code 128", 220, 370, 12, { bold: true } );
		ctx.barcode( "code128", "X4-2026-042", 220, 270, 300, 80 );
		ctx.text( "X4-2026-042", 220, 250, 11, { align: "center", width: 300 } );
	} );

	const url = pdf.buildURL( );

	return new HBox( { content: [
		new Image( { src: renderBarcodeImage( "datamatrix", "https://x4js.org" ), width: 120, height: 120 } ),
		new Component( { tag: "iframe", attrs: { src: url }, style: { width: "100%", height: "300px", border: "1px solid #ccc" } } ),
	] } );
}

/** @demo Icons, paths, links — icon( ) draws an svg as Icon takes it, svgPath( ) a path of svg, and link( ) makes a zone of the page open an address. */
export function graphics( ) {
	const pdf = new X4PDFBuilder( );

	pdf.page( 595, 300, ( ctx ) => {
		ctx.icon( icon_star, 40, 180, 80, 80, { color: "#f39c12" } );
		ctx.svgPath( "M0 0 L80 0 L40 70 Z", 160, 260, 1, "#8ad0f5", "#126e9e", 2 );

		ctx.text( "x4js.org", 300, 210, 18, { color: "#126e9e" } );
		ctx.link( "https://x4js.org", 300, 204, 80, 22, { underline: "#126e9e" } );
	} );

	const url = pdf.buildURL( );
	return new Component( { tag: "iframe", attrs: { src: url }, style: { width: "100%", height: "260px", border: "1px solid #ccc" } } );
}

const page: DemoComponent = {
	name: "PDF",
	category: "Extra",
	description: "X4PDFBuilder writes a PDF file in the browser, with no library: pages drawn in points, texts, lines, paths, svg icons, links and barcodes. build( ) gives its bytes, to show, download or send.",
	imports: [ "X4PDFBuilder" ],
	demos: [ invoice, barcodes, graphics ],
};

export default page;
