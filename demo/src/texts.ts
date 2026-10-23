/**
 * The texts of the gallery, in the languages of x4. The descriptions of the
 * components and of their variations stay in English.
 */

import { _tr, addTranslation } from 'x4js';

const en = {
	gallery: {
		search: "Search components",
		dark: "Dark",
		light: "Light",
		usage: "Usage",
		examples: "Examples",
		props: "Props",
		show_code: "Show code",
		hide_code: "Hide code",
		copy: "Copy",
		copied: "Copied",
		not_copied: "Not copied",

		// by the name of the category in the pages (src/demos)
		categories: {
			"Layout containers": "Layout containers",
			"Display components": "Display components",
			"Input components": "Input components",
			"Lists / grids / trees": "Lists / grids / trees",
			"Menus / button groups / tabs": "Menus / button groups / tabs",
			"Popup / Dialog": "Popup / Dialog",
			"Forms": "Forms",
			"Sizers / viewport / misc": "Sizers / viewport / misc",
			"Extra": "Extra",
		},
	},
};

const fr: typeof en = {
	gallery: {
		search: "Rechercher un composant",
		dark: "Sombre",
		light: "Clair",
		usage: "Utilisation",
		examples: "Exemples",
		props: "Propriétés",
		show_code: "Voir le code",
		hide_code: "Masquer le code",
		copy: "Copier",
		copied: "Copié",
		not_copied: "Non copié",

		categories: {
			"Layout containers": "Conteneurs",
			"Display components": "Affichage",
			"Input components": "Saisie",
			"Lists / grids / trees": "Listes / grilles / arbres",
			"Menus / button groups / tabs": "Menus / groupes de boutons / onglets",
			"Popup / Dialog": "Popups / dialogues",
			"Forms": "Formulaires",
			"Sizers / viewport / misc": "Séparateurs / vues / divers",
			"Extra": "Extra",
		},
	},
};

const es: typeof en = {
	gallery: {
		search: "Buscar un componente",
		dark: "Oscuro",
		light: "Claro",
		usage: "Uso",
		examples: "Ejemplos",
		props: "Propiedades",
		show_code: "Ver el código",
		hide_code: "Ocultar el código",
		copy: "Copiar",
		copied: "Copiado",
		not_copied: "No copiado",

		categories: {
			"Layout containers": "Contenedores",
			"Display components": "Visualización",
			"Input components": "Entrada de datos",
			"Lists / grids / trees": "Listas / cuadrículas / árboles",
			"Menus / button groups / tabs": "Menús / grupos de botones / pestañas",
			"Popup / Dialog": "Popups / diálogos",
			"Forms": "Formularios",
			"Sizers / viewport / misc": "Separadores / vistas / varios",
			"Extra": "Extra",
		},
	},
};

const de: typeof en = {
	gallery: {
		search: "Komponente suchen",
		dark: "Dunkel",
		light: "Hell",
		usage: "Verwendung",
		examples: "Beispiele",
		props: "Eigenschaften",
		show_code: "Code anzeigen",
		hide_code: "Code ausblenden",
		copy: "Kopieren",
		copied: "Kopiert",
		not_copied: "Nicht kopiert",

		categories: {
			"Layout containers": "Container",
			"Display components": "Anzeige",
			"Input components": "Eingabe",
			"Lists / grids / trees": "Listen / Raster / Bäume",
			"Menus / button groups / tabs": "Menüs / Schaltflächengruppen / Tabs",
			"Popup / Dialog": "Popups / Dialoge",
			"Forms": "Formulare",
			"Sizers / viewport / misc": "Trenner / Ansichten / Sonstiges",
			"Extra": "Extra",
		},
	},
};

addTranslation( "en", en );
addTranslation( "fr", fr );
addTranslation( "es", es );
addTranslation( "de", de );

/**
 * the texts of the gallery in the language selected
 */

export function texts( ) {
	return ( _tr as unknown as typeof en ).gallery;
}

/**
 * the title of a category in the language selected; its name when it has none
 */

export function categoryText( name: string ) {
	const titles: Record<string, string> = texts( ).categories;
	return titles[name] ?? name;
}
