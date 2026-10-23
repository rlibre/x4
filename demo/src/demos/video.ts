/**
 * Video: the page of the gallery
 */

import { Button, Canvas, HBox, Image, Label, VBox, Video } from 'x4js';
import { DemoComponent } from '../types';

import "./video.scss";

// Big Buck Bunny, (c) copyright Blender Foundation | www.bigbuckbunny.org, CC BY 3.0,
// in 360p on Wikimedia Commons: the browser loads only what it plays
const bunny = "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.360p.vp9.webm";

/** @demo A video file — src plays a file, here Big Buck Bunny (© Blender Foundation, CC BY 3.0); loop starts it again at its end. */
export function file( ) {
	const video = new Video( { src: bunny, width: 320, height: 180, muted: true } );
	video.loop = true;

	return new HBox( { content: [
		video,
		new VBox( { content: [
			new Button( { label: "Play", click: ( ) => video.play( ) } ),
			new Button( { label: "Pause", cls: "outline", click: ( ) => video.pause( ) } ),
		] } ),
	] } );
}

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

	const video = new Video( { width: 320, height: 240, muted: true } );

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

/** @demo Camera — The stream of the camera, asked on a click; play() tells whether the playback could start. A photo is the image of the player drawn in a canvas. */
export function camera( ) {
	const status = new Label( { text: "" } );
	const video = new Video( { width: 320, height: 240, muted: true, playsInline: true } );
	const photo = new Image( { src: "", fit: "contain", width: 160, height: 120 } );

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
			new Button( { label: "Take a photo", cls: "outline", click: ( ) => {
				const canvas = document.createElement( "canvas" );
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				canvas.getContext( "2d" ).drawImage( video.player, 0, 0 );
				photo.setImage( canvas.toDataURL( "image/jpeg" ) );
			} } ),
			status,
			photo,
		] } ),
	] } );
}

const page: DemoComponent = {
	name: "Video",
	category: "Sizers / viewport / misc",
	description: "A <video> that plays a file (src) or shows a MediaStream: a camera, a screen, a canvas. play(), pause(), mute() and the player itself (player) drive it.",
	usage: {
		create: ( props ) => new Video( { ...props, src: bunny } ),
		extra: "src: bunny",
		props: { width: 320, height: 180, muted: true, autoplay: true, playsInline: false },
		controls: [
			{ name: "width", type: "number", min: 160, max: 560, step: 20, live: true },
			{ name: "height", type: "number", min: 90, max: 320, step: 10, live: true },
			{ name: "muted", type: "boolean" },
			{ name: "autoplay", type: "boolean" },
			{ name: "playsInline", type: "boolean" },
		],
	},
	demos: [ file, canvasStream, camera ],
};

export default page;
