/**
 * Video: the page of the gallery
 */

import { Button, Canvas, HBox, Label, VBox, Video } from 'x4js';
import { DemoComponent } from '../types';

import "./video.scss";

/** @demo A canvas filmed — The stream of a Canvas (captureStream) shown by a Video; Start paints it 25 times a second, Stop pauses. */
export function canvasStream( ) {
	let angle = 0;
	const canvas = new Canvas( { width: 160, height: 120, clear: true, paint_cb: ( ctx ) => {
		ctx.fillStyle = "#1e1f22";
		ctx.fillRect( 0, 0, ctx.width, ctx.height );
		ctx.strokeStyle = "#569cd6";
		ctx.lineWidth = 6;
		ctx.beginPath( );
		ctx.arc( 80, 60, 40, angle, angle + 4 );
		ctx.stroke( );
	} } );

	const video = new Video( { width: 320, height: 240, muted: true, stream: null } );

	return new HBox( { content: [
		canvas,
		video,
		new VBox( { content: [
			new Button( { label: "Start", click: ( ) => {
				video.stream = ( canvas.canvas.dom as HTMLCanvasElement ).captureStream( 25 );
				video.play( );
				video.setInterval( "paint", 40, ( ) => {
					angle += 0.1;
					canvas.redraw( );
				} );
			} } ),
			new Button( { label: "Stop", cls: "outline", click: ( ) => {
				video.clearInterval( "paint" );
				video.pause( );
			} } ),
		] } ),
	] } );
}

/** @demo Camera — The stream of the camera, asked on a click; play() tells whether the playback could start. */
export function camera( ) {
	const status = new Label( { text: "" } );
	const video = new Video( { width: 320, height: 240, muted: true, playsInline: true, stream: null } );

	return new HBox( { content: [
		video,
		new VBox( { content: [
			new Button( { label: "Open the camera", click: async ( ) => {
				try {
					video.stream = await navigator.mediaDevices.getUserMedia( { video: true } );
					status.setText( await video.play( ) ? "Playing" : "Could not play" );
				}
				catch( e ) {
					status.setText( "No camera, or not allowed" );
				}
			} } ),
			status,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Video",
	category: "Sizers / viewport / misc",
	description: "A <video> that shows a MediaStream: a camera, a screen, a canvas. play(), pause(), mute() and the player itself (player) drive it.",
	usage: {
		create: ( props ) => new Video( { ...props, stream: null } ),
		extra: "stream: null",
		props: { width: 320, height: 180, muted: true, autoplay: false, playsInline: false },
		controls: [
			{ name: "width", type: "number", min: 160, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 90, max: 320, step: 10, live: true },
			{ name: "muted", type: "boolean" },
			{ name: "autoplay", type: "boolean" },
			{ name: "playsInline", type: "boolean" },
		],
	},
	demos: [ canvasStream, camera ],
};

export default page;
