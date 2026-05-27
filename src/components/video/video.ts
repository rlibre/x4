/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|.2
 * 
 * @file video.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2026 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/

import { Box, Component, ComponentProps } from 'x4js';

import "./video.module.scss"

interface VideoProps extends ComponentProps {
	autoplay?: boolean;
	muted?: boolean;
	playsInline?: boolean;
	stream: MediaStream;
}

/**
 * 
 */

export class Video extends Box {
	
	private _vplayer: HTMLVideoElement;

	constructor( props: VideoProps ) {
		super( props );

		const el = new Component( { cls: "vplayer", tag: 'video', } );
		this.setContent( el );

		this._vplayer = el.dom as HTMLVideoElement;

		if( props.autoplay !== undefined ) {
			this.autoPlay = props.autoplay;
		}

		if( props.muted !== undefined ) {
			this.mute( props.muted );
		}

		if( props.playsInline !== undefined ) {
			this.playsInline = props.playsInline;
		}

		this.stream = props.stream;
	}

	get player( ) {
		return this._vplayer;
	}

	get volume( ) {
		return this.player.volume;
	}

	set volume( vol: number ) {
		this.player.volume = vol;
	}

	get autoPlay( ) {
		return this.player.autoplay;
	}

	set autoPlay( set: boolean ) {
		this.player.autoplay = set;
	}

	get playsInline( ) {
		return this.player.playsInline;
	}

	set playsInline( set: boolean ) {
		this.player.playsInline = set;
	}

	set stream( stream: MediaStream ) {
		this.player.srcObject = stream;
	}

	get videoWidth( ) {
		return this.player.videoWidth;
	}

	get videoHeight( ) {
		return this.player.videoHeight;
	}

	get loop( ) {
		return this.player.loop;
	}

	set loop( set: boolean ) {
		this.player.loop = set;
	}

	get duration( ) {
		return this.player.duration;
	}

	get muted( ) {
		return this.player.muted;
	}

	mute( set: boolean ) {
		this.player.muted = set;
	}
		
	get paused( ) {
		return this.player.paused;
	}

	pause( ) {
		this.player.pause( );
	}

	play( ) {
		this.player.play( );
	}
}
