/**
* @file core_state.ts
* @author Etienne Cochard 
* @copyright (c) 2025 R-libre ingenierie, all rights reserved.
**/


type StateData = boolean | number | string | Date | any;
type State = Record<string,StateData>;

export class StateManager {
	
	private _state: StateData;
	private _subscribers: Map<string,any>;
	private _currentTracking: Set<string>;

	constructor(initialState: StateData ) {
		this._state = initialState ? { ...initialState } : {};
		this._subscribers = new Map();
		this._currentTracking = new Set( );
	}

	getState( path: string, defaultValue: StateData = null) {
		// Optional tracking for reactivity
		if (this._currentTracking) {
			this._currentTracking.add(path);
		}
		// Fast path-based access
		const parts = path.split('.');
		let current = this._state;

		for (const part of parts) {
			if (current?.[part] === undefined) {
				return defaultValue;
			}

			current = current[part];
		}

		return current;
	}

	setState(path: string, value: StateData, context: any = {} ) {
		// Update state
		const parts = path.split('.');
		let current = this._state;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (!current[part] || typeof current[part] !== 'object') {
				current[part] = {};
			}
			
			current = current[part];
		}

		current[parts[parts.length - 1]] = value;

		// Notify subscribers
		//this._notifySubscribers(path, value);
	}
}