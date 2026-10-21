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
 * @copyright (c) 2026 R-libre ingenierie
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

	lang.translations = _proxyfy( lang.src_translations, lang.base, [] );

	// the current language: _tr sees the new translations at once
	if( name==current.name ) {
		current.translations = lang.translations;
	}
}

/**
 * patch the base object with the given object
 * (real patch)
 */

function _patch( obj: any, by: any ) {

	for( const n in by ) {
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
 * @param path where obj is, from _tr: [] for _tr itself, ["global"] for _tr.global
 */

function _proxyfy( obj: any, base: string, path: string[] ) {

	const result: any = {}

	for( const n in obj ) {
		if( typeof obj[n]!=="string" && !Array.isArray(obj[n])) {
			result[n] = _proxyfy( obj[n], base, [...path, n] );
		}
		else {
			result[n] = obj[n];
		}
	}

	return _mk_proxy( result, base, path );
}


/**
 * create a proxy for the given object
 * what is not found is asked to the base language, at the same path
 */

function _mk_proxy( obj: any, base: string, path: string[] ) : any {
	return new Proxy( obj, {
		get: (target, prop) => {
			const value = target[prop];

			// a symbol is not a translation
			if( value!==undefined || typeof prop==="symbol" ) {
				return value;
			}

			const asked = [...path, prop];

			// not in this language: in its base, which looks in its own base
			if( base ) {
				return _findBaseTrans( base, asked );
			}

			console.error( "I18N error: unable to find", '_tr.'+asked.join('.') );
			return undefined;
		}
	});
}

/**
 * the translation at path in the language base
 * its proxies look in their own base: the last language of the chain tells what is missing
 */

function _findBaseTrans( base: string, path: string[] ) {

	let trans = languages[base].translations;

	for( const p of path ) {
		trans = trans[p];
		if( trans===undefined ) {
			return undefined;
		}
	}

	return trans;
}

/**
 * current language state
 */

const current = {
	name: "",
	translations: {} as any,
};

/**
 * stable translation object: forwards every access to the current language,
 * so references to _tr stay valid after selectLanguage
 */

const tr_handler: ProxyHandler<any> = {
	get( _target, prop ) {
		return current.translations[prop];
	},

	has( _target, prop ) {
		return prop in current.translations;
	},

	ownKeys( ) {
		return Reflect.ownKeys( current.translations );
	},

	getOwnPropertyDescriptor( _target, prop ) {
		const value = current.translations[prop];

		if( value === undefined ) {
			return undefined;
		}

		return { value, enumerable: true, configurable: true };
	},
};

export const _tr: Partial<typeof fr> = new Proxy( {}, tr_handler );
 

/**
 * select the given language as current
 * @param name laguage name (code)
 */

export function selectLanguage( name: string ) {

	if( !isLanguage(name) ) {
		return;
	}

	current.name = name;
	current.translations = languages[name].translations;

	return _tr;
}

/**
 * 
 */

export function getCurrentLanguage( ): string {
	return current.name;
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
		diff_date_hours: '{0} heures {1} minutes',

		invalid_date: 'Date non reconnue ({0})',
		empty_list: 'Liste vide',

		date_input_formats: 'd/m/y|d.m.y|d m y|d-m-y|dmy',
		date_format: 'D/M/Y',
        date_time_format: 'D/M/Y H:I:S',

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

		settings: {
			search: 'Rechercher un paramètre',
			nomatch: 'Aucun paramètre trouvé',
		},

		progression: {
			error: '{0} erreur',
			errors: '{0} erreurs',
			warning: '{0} avertissement',
			warnings: '{0} avertissements',
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
		diff_date_hours: '{0} hours {1} minutes',

		invalid_date: 'Unrecognized date({0})',
		empty_list: 'Empty list',

		date_input_formats: 'm/d/y|m.d.y|m d y|m-d-y|mdy',
		date_format: 'M/D/Y',
        date_time_format: 'M/D/Y H:I:S',

		day_short: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ],
		day_long: [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday' ],

		month_short: [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ],
		month_long: [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ],

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

		settings: {
			search: 'Search settings',
			nomatch: 'No setting found',
		},

		progression: {
			error: '{0} error',
			errors: '{0} errors',
			warning: '{0} warning',
			warnings: '{0} warnings',
		},
	}
};

/** @ignore */

let es = {
	global: {
		ok: 'Aceptar',
		cancel: 'Cancelar',
		ignore: 'Ignorar',
		yes: 'Sí',
		no: 'No',
		abort: "Anular",
		retry: "Reintentar",

		error: "Error",
		today: "Hoy",

		open: 'Abrir',
		new: 'Nuevo',
		delete: 'Eliminar',
		close: 'Cerrar',
		save: 'Guardar',

		search: 'Buscar',
		search_tip: 'Escriba el texto que desea buscar. <b>Intro</b> para iniciar la búsqueda. <b>Esc</b> para cancelar.',

		required_field: "dato obligatorio",
		invalid_format: "formato no válido",
		invalid_email: 'dirección de correo no válida',
		invalid_number: 'valor numérico no válido',

		diff_date_seconds: '{0} segundos',
		diff_date_minutes: '{0} minutos',
		diff_date_hours: '{0} horas {1} minutos',

		invalid_date: 'Fecha no reconocida ({0})',
		empty_list: 'Lista vacía',

		date_input_formats: 'd/m/y|d.m.y|d m y|d-m-y|dmy',
		date_format: 'D/M/Y',
        date_time_format: 'D/M/Y H:I:S',

		day_short: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
		day_long: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],

		month_short: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
		month_long: [ 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],

		property: 'Propiedad',
		value: 'Valor',

		err_403: `No tiene permisos suficientes para realizar esta acción`,

		copy: 'Copiar',
		cut: 'Cortar',
		paste: 'Pegar',

		filedrop: 'Suelte un archivo',

		keyboard: {
			next: 'Siguiente',
			numeric: '123',
			alpha: 'Abc'
		},

		settings: {
			search: 'Buscar un ajuste',
			nomatch: 'Ningún ajuste encontrado',
		},

		progression: {
			error: '{0} error',
			errors: '{0} errores',
			warning: '{0} advertencia',
			warnings: '{0} advertencias',
		},
	}
};

/** @ignore */

let de = {
	global: {
		ok: 'OK',
		cancel: 'Abbrechen',
		ignore: 'Ignorieren',
		yes: 'Ja',
		no: 'Nein',
		abort: "Abbrechen",
		retry: "Wiederholen",

		error: "Fehler",
		today: "Heute",

		open: 'Öffnen',
		new: 'Neu',
		delete: 'Löschen',
		close: 'Schließen',
		save: 'Speichern',

		search: 'Suchen',
		search_tip: 'Geben Sie den zu suchenden Text ein. <b>Enter</b> startet die Suche. <b>Esc</b> bricht ab.',

		required_field: "Pflichtangabe",
		invalid_format: "ungültiges Format",
		invalid_email: 'ungültige E-Mail-Adresse',
		invalid_number: 'ungültiger Zahlenwert',

		diff_date_seconds: '{0} Sekunden',
		diff_date_minutes: '{0} Minuten',
		diff_date_hours: '{0} Stunden {1} Minuten',

		invalid_date: 'Datum nicht erkannt ({0})',
		empty_list: 'Leere Liste',

		date_input_formats: 'd.m.y|d/m/y|d m y|d-m-y|dmy',
		date_format: 'D.M.Y',
        date_time_format: 'D.M.Y H:I:S',

		day_short: [ 'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa' ],
		day_long: [ 'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag' ],

		month_short: [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ],
		month_long: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],

		property: 'Eigenschaft',
		value: 'Wert',

		err_403: `Sie haben nicht die erforderlichen Rechte für diese Aktion`,

		copy: 'Kopieren',
		cut: 'Ausschneiden',
		paste: 'Einfügen',

		filedrop: 'Datei hier ablegen',

		keyboard: {
			next: 'Weiter',
			numeric: '123',
			alpha: 'Abc'
		},

		settings: {
			search: 'Einstellungen durchsuchen',
			nomatch: 'Keine Einstellung gefunden',
		},

		progression: {
			error: '{0} Fehler',
			errors: '{0} Fehler',
			warning: '{0} Warnung',
			warnings: '{0} Warnungen',
		},
	}
};

createLanguage( 'fr', null );
addTranslation( 'fr', fr );

createLanguage( 'en', 'fr' );
addTranslation( 'en', en );

// a key they lack is taken in english
createLanguage( 'es', 'en' );
addTranslation( 'es', es );

createLanguage( 'de', 'en' );
addTranslation( 'de', de );

selectLanguage( 'fr' );	// by default





