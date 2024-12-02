/** 
 *  ___  ___ __
 *  \  \/  /  / _
 *   \    /  /_| |_
 *   /    \____   _|  
 *  /__/\__\   |_|
 * 
 * @file core_i18n.ts
 * @author Etienne Cochard 
 * 
 * @copyright (c) 2024 R-libre ingenierie
 *
 * Use of this source code is governed by an MIT-style license 
 * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.
 **/


/**
 * language definition
 */

 interface Language {
    name: string;
    base: string;
	src_translations: any;
    translations: any;
}

const sym_lang = Symbol( "i18n" );

let languages: Record<string,Language> = {
};

/**
 * create a new language
 * @param name language name (code)
 * @param base base language (code)
 * @example:
 * ```js
 * createLanguage( 'en', 'fr' );
 * ```
 */

export function createLanguage( name: string, base: string ) {
    languages[name] = { 
        name,
        base,
		src_translations: {},
        translations: {}
    };
}

/**
 * check if the given language is known
 * @param name language name (code)
 */

export function isLanguage( name: string ): boolean {
    return languages[name]!==undefined;
}

/**
 * build the language with given fragments
 * @param name language name (code)
 * @param parts misc elements that make the language
 * @example:
 * ```js
 * createLanguage( 'en', 'fr' );
 * const app = {
 * 	clients: {
 * 		translation1: "hello",
 *  }
 * }
 * addTranslation( 'en', app );
 * ```
  */

export function addTranslation( name: string, ...parts: any[] ) {
	
	if( !isLanguage(name) ) {
		return;
	}

	const lang = languages[name];
    
	parts.forEach( p => {
		_patch( lang.src_translations, p );
	} );

	lang.translations = _proxyfy( lang.src_translations, lang.base, true );
}

/**
 * patch the base object with the given object
 * (real patch)
 */

function _patch( obj: any, by: any ) {

	for( let n in by ) {
		const src = by[n];
		if( typeof src === "string" ) {
			obj[n] = src;
		}
		else {
			if( Array.isArray(src) && (!obj[n] || !Array.isArray(obj[n])) ) {
				obj[n] = [...src];
			}
			else if( !obj[n] || (typeof obj[n] !== "object") ) {
				obj[n] = { ...src };
			}
			else {
				_patch( obj[n], by[n] );
			}
		}
	}
}

/**
 * create a proxy for all sub objects
 * (deep traverse)
 */

function _proxyfy( obj: any, base: any, root: any ) {

	const result: any = {}

	for( const n in obj ) {
		if( typeof obj[n]!=="string" && !Array.isArray(obj[n])) {
			result[n] = _proxyfy( obj[n], base, false );
		}
		else {
			result[n] = obj[n];
		}
	}

	return _mk_proxy( result, base, root );
}


/**
 * create a proxy for the given object
 */

function _mk_proxy( obj: any, base: string, root: boolean ) : any {
	return new Proxy( obj, {
		get: (target, prop) => {
			if( root ) {
				req_path = [prop];
			}
			else {
				req_path.push( prop );
			}

			let value = target[prop];
			if( value===undefined ) {
				if( base ) {
					value = _findBaseTrans( base );
				}

				if( value===undefined ) {
					console.error( "I18N error: unable to find", '_tr.'+req_path.join('.') );
				}
			}

			return value;
		}
	});
}


/**
 * when we ask for _tr.xxx
 * reqpath is set to [xxx]
 * 
 * then when we try to get _tr.xxx.yyy
 * reqpath is [xxx,yyy]
 * if yyy is not found, we try with base langage for the full reqpath 
 * until no base found
 */

let req_path: (string | symbol)[];

/**
 * 
 */

function _findBaseTrans( base: any ) {

	while( base ) {
		const lang = languages[base];
		let trans = lang.translations;
		let value;

		for( const p of req_path ) {
			value = trans[p];
			if( value===undefined ) {
				break;
			}

			trans = value;
		}

		if( value!==undefined ) {
			return trans;
		}

		base = lang.base;
	}

	return undefined;
}

export let _tr: Partial<typeof fr> = {};

/**
 * select the given language as current
 * @param name laguage name (code)
 */

export function selectLanguage( name: string ) {

	if( !isLanguage(name) ) {
		return;
	}

	_tr = languages[name].translations;
	(_tr as any)[sym_lang] = name;
	return _tr;
}

/**
 * 
 */

export function getCurrentLanguage( ): string {
	return (_tr as any)[sym_lang];
}

/**
 * 
 */

export function getAvailableLanguages( ): string[] {
	return Object.keys( languages );
}




/**
 * language definition
 * x4 specific strings
 */

let fr = {
	global: {
		ok: 'OK',
		cancel: 'Annuler',
		ignore: 'Ignorer',
		yes: 'Oui',
		no: 'Non',
		abort: "Abandonner",
		retry: "Réessayer",

		error: "Erreur",
		today: "Aujourd'hui",

		open: 'Ouvrir',
		new: 'Nouveau',
		delete: 'Supprimer',
		close: 'Fermer',
		save: 'Enregistrer',

		search: 'Rechercher',
		search_tip: 'Saisissez le texte à rechercher. <b>Enter</b> pour lancer la recherche. <b>Esc</b> pour annuler.',

		required_field: "information requise",
		invalid_format: "format invalide",
		invalid_email: 'adresse mail invalide',
		invalid_number: 'valeur numérique invalide',

		diff_date_seconds: '{0} secondes',
		diff_date_minutes: '{0} minutes',
		diff_date_hours: '{0} heures',

		invalid_date: 'Date non reconnue ({0})',
		empty_list: 'Liste vide',

		date_input_formats: 'd/m/y|d.m.y|d m y|d-m-y|dmy',
		date_format: 'D/M/Y',

		day_short: [ 'dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam' ],
		day_long: [ 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi' ],

		month_short: [ 'jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jui', 'aoû', 'sep', 'oct', 'nov', 'déc' ],
		month_long: [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre' ],

		property: 'Propriété',
		value: 'Valeur',

		err_403: `Vous n'avez pas les droits suffisants pour effectuer cette action`,

		copy: 'Copier',
		cut: 'Couper',
		paste: 'Coller',

		filedrop: 'Déposez un fichier',

		keyboard: {
			next: 'Suivant',
			numeric: '123',
			alpha: 'Abc'
		},
	}
};

/** @ignore */

let en = {
	global: {
		ok: 'OK',
		cancel: 'Cancel',
		ignore: 'Ignore',
		yes: 'Yes',
		no: 'No',
		abort: "Abort",
		retry: "Retry",

		error: "Error",
		today: "Today",

		open: 'Open',
		new: 'New',
		delete: 'Delete',
		close: 'Close',
		save: 'Save',

		search: 'Search',
		search_tip: 'Type in the text to search. <b>Enter</b> to start the search. <b>Esc</b> to cancel.',

		required_field: "missing information",
		invalid_format: "invalid format",
		invalid_email: 'invalid email address',
		invalid_number: 'bad numeric value',

		diff_date_seconds: '{0} seconds',
		diff_date_minutes: '{0} minutes',
		diff_date_hours: '{0} hours',

		invalid_date: 'Unrecognized date({0})',
		empty_list: 'Empty list',

		date_input_formats: 'm/d/y|m.d.y|m d y|m-d-y|mdy',
		date_format: 'M/D/Y',

		day_short: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ],
		day_long: [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ],

		month_short: [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jui', 'aug', 'sep', 'oct', 'nov', 'dec' ],
		month_long: [ 'january', 'february', 'march', 'april', 'mau', 'june', 'jully', 'august', 'september', 'october', 'november', 'december' ],

		property: 'Property',
		value: 'Value',

		err_403: `You do not have sufficient rights to do that action`,

		copy: 'Copy',
		cut: 'Cut',
		paste: 'Paste',

		filedrop: 'Drop a file',

		keyboard: {
			next: 'Next',
			numeric: '123',
			alpha: 'Abc'
		},
	}
};

createLanguage( 'fr', null );
addTranslation( 'fr', fr );

createLanguage( 'en', 'fr' );
addTranslation( 'en', en );

selectLanguage( 'fr' );	// by default





