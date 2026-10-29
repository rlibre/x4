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
		expand: "Enlarge",
		collapse: "Reduce",
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
			"Extras": "Extras",
			"Add-ons": "Add-ons",
		},

		// the presentation page
		home: {
			nav: "Overview",
			tagline: "A full TypeScript framework for web and desktop applications.",
			intro: "This gallery has a page for each component of x4js: what it does, its props to try, its variations and their code.",
			start: "Getting started",
			start_text: "Create a project, then serve it: the page reloads when a source changes.",
			guide: "The getting started guide",
			components: "Components",
			links: "Links",
			docs: "Documentation",
			api: "API reference",
			repo: "Sources (GitHub)",
			npm: "Package (npm)",
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
		expand: "Agrandir",
		collapse: "Réduire",
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
			"Extras": "Extras",
			"Add-ons": "Compléments",
		},

		home: {
			nav: "Présentation",
			tagline: "Un framework TypeScript complet pour les applications web et desktop.",
			intro: "Cette galerie a une page par composant de x4js : ce qu'il fait, ses propriétés à essayer, ses variantes et leur code.",
			start: "Démarrer",
			start_text: "Créer un projet, puis le lancer : la page se recharge quand un source change.",
			guide: "Le guide de démarrage",
			components: "Composants",
			links: "Liens",
			docs: "Documentation",
			api: "Référence de l'API",
			repo: "Sources (GitHub)",
			npm: "Paquet (npm)",
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
		expand: "Ampliar",
		collapse: "Reducir",
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
			"Extras": "Extras",
			"Add-ons": "Complementos",
		},

		home: {
			nav: "Presentación",
			tagline: "Un framework TypeScript completo para aplicaciones web y de escritorio.",
			intro: "Esta galería tiene una página por componente de x4js: lo que hace, sus propiedades para probar, sus variantes y su código.",
			start: "Empezar",
			start_text: "Crear un proyecto y luego lanzarlo: la página se recarga cuando cambia un archivo fuente.",
			guide: "La guía de inicio",
			components: "Componentes",
			links: "Enlaces",
			docs: "Documentación",
			api: "Referencia de la API",
			repo: "Código fuente (GitHub)",
			npm: "Paquete (npm)",
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
		expand: "Vergrößern",
		collapse: "Verkleinern",
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
			"Extras": "Extras",
			"Add-ons": "Erweiterungen",
		},

		home: {
			nav: "Übersicht",
			tagline: "Ein vollständiges TypeScript-Framework für Web- und Desktop-Anwendungen.",
			intro: "Diese Galerie hat eine Seite pro Komponente von x4js: was sie tut, ihre Eigenschaften zum Ausprobieren, ihre Varianten und deren Code.",
			start: "Erste Schritte",
			start_text: "Ein Projekt anlegen, dann starten: die Seite lädt neu, wenn sich eine Quelldatei ändert.",
			guide: "Die Anleitung für den Einstieg",
			components: "Komponenten",
			links: "Links",
			docs: "Dokumentation",
			api: "API-Referenz",
			repo: "Quellcode (GitHub)",
			npm: "Paket (npm)",
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
