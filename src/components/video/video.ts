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

import { Component, ComponentProps } from '../../core/component';

import "./video.module.scss"

interface VideoProps extends ComponentProps {
	autoplay?: boolean;
	muted?: boolean;
	playsInline?: boolean;
	stream: MediaStream;
}

import { class_ns } from '../../core/core_tools';
export class Video extends Component {
	constructor( props: VideoProps ) {
		super( { tag: 'video', ...props } );

		if( props.autoplay !== undefined ) {
			this.AutoPlay = props.autoplay;
		}

		if( props.muted !== undefined ) {
			this.Muted = props.muted;
		}

		if( props.playsInline !== undefined ) {
			this.PlaysInline = props.playsInline;
		}

		this.Stream = props.stream;
	}

	set AutoPlay( set: boolean ) {
		(this.dom as HTMLVideoElement).autoplay = set;
	}

	set Muted( set: boolean ) {
		(this.dom as HTMLVideoElement).muted = set;
	}
	
	set PlaysInline( set: boolean ) {
		(this.dom as HTMLVideoElement).playsInline = set;
	}

	set Stream( stream: MediaStream ) {
		(this.dom as HTMLVideoElement).srcObject = stream;
	}

	get videoWidth( ) {
		return (this.dom as HTMLVideoElement).videoWidth;
	}

	get videoHeight( ) {
		return (this.dom as HTMLVideoElement).videoHeight;
	}
}
