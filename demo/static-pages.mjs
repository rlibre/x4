/**
 * Writes static/: the gallery as plain HTML, for the crawlers that do not run scripts (those
 * of the AI assistants). The build copies it into bin/ (x4.config.json, x4.local.json).
 *
 *     index.html               the components by category, a link to the page of each one
 *     <component>/index.html   its description, its import line, its variations with their code
 *     sitemap.xml              the addresses of these pages online
 *
 * Each page is src/index.html with its title, its description and its text in
 * <main id="static">: the gallery starts over it, main.ts hides that text then removes it.
 * The page of a component has <base href="../">: main.js, main.css and monaco/ are found in
 * the folder of the gallery, and main.ts shows the component (#/button).
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

// the address of the gallery online, for sitemap.xml
const SITE = "https://x4js.org/doc/gallery/";

// for an assistant that lands on the gallery: x4js in a few files
const ASSISTANT_LINKS = `<p>For an assistant: <a href="https://x4js.org/llms.txt">llms.txt</a>, <a href="https://x4js.org/llms-full.txt">llms-full.txt</a>.</p>`;

const dir = new URL( "./static/", import.meta.url );

/**
 * a text in HTML: & < > escaped; the quotes are left, the code stays readable in the HTML
 */

function escapeHtml( text ) {
	return text
		.replace( /&/g, "&amp;" )
		.replace( /</g, "&lt;" )
		.replace( />/g, "&gt;" );
}

/**
 * a text in the value of an attribute: its quotes escaped too
 */

function escapeAttribute( text ) {
	return escapeHtml( text ).replace( /"/g, "&quot;" );
}

/**
 * a paragraph of the text of a variation: what is between backquotes in <code>, as the
 * gallery shows it; its lines kept
 */

function paragraphToHtml( paragraph ) {
	const escaped = escapeHtml( paragraph );
	const withCode = escaped.replace( /`([^`]+)`/g, "<code>$1</code>" );
	const withBreaks = withCode.replace( /\n/g, "<br>\n" );
	return `<p>${withBreaks}</p>`;
}

/**
 * the text of a variation: its paragraphs are separated by an empty line
 */

function textToHtml( text ) {
	const paragraphs = text.split( /\n\s*\n/ );
	return paragraphs.map( paragraphToHtml ).join( "\n" );
}

function codeToHtml( code, language ) {
	return `<pre><code class="language-${language}">${escapeHtml( code )}</code></pre>`;
}

/**
 * replaces the first match of pattern in the template; a function gives the replacement: a
 * "$" of the code is not read as a pattern of replace
 */

function replaceInTemplate( html, pattern, replacement ) {
	if( !pattern.test( html ) ) {
		console.error( `src/index.html: ${pattern} not found` );
		process.exit( 1 );
	}

	return html.replace( pattern, ( ) => replacement );
}

/**
 * a page: the template with its title and its description, its <base> when it is in a
 * folder of the gallery, its text in <main id="static">
 */

function makePage( template, { title, description, base, body } ) {
	let html = template;
	html = replaceInTemplate( html, /<title>[^<]*<\/title>/, `<title>${escapeHtml( title )}</title>` );
	html = replaceInTemplate( html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttribute( description )}">` );

	if( base ) {
		html = replaceInTemplate( html, /<head>/, `<head>\n\t\t<base href="${base}">` );
	}

	html = replaceInTemplate( html, /<\/html>/, `\t<body>\n<main id="static">\n${body}\n</main>\n\t</body>\n</html>` );
	return html;
}

/**
 * the text of the presentation page: the components by category, in alphabetical order
 */

function makeHomeBody( gallery, docs ) {
	const lines = [
		`<h1>${escapeHtml( gallery.title )}</h1>`,
		`<p>${escapeHtml( gallery.description )}</p>`,
		ASSISTANT_LINKS,
	];

	const categories = [ ...new Set( docs.map( doc => doc.category ) ) ].sort( );
	for( const category of categories ) {
		const inCategory = docs.filter( doc => doc.category == category );
		const sorted = inCategory.slice( ).sort( ( a, b ) => a.name.localeCompare( b.name ) );

		lines.push( `<h2>${escapeHtml( category )}</h2>` );
		lines.push( "<ul>" );
		for( const doc of sorted ) {
			lines.push( `<li><a href="${doc.name.toLowerCase( )}/">${escapeHtml( doc.name )}</a>: ${escapeHtml( doc.description )}</li>` );
		}
		lines.push( "</ul>" );
	}

	return lines.join( "\n" );
}

/**
 * the text of the page of a component; each variation has the id of its card in the gallery
 * ("button-icons")
 */

function makeComponentBody( gallery, doc ) {
	const route = doc.name.toLowerCase( );
	const importLine = `import { ${doc.imports.join( ", " )} } from "${doc.module}"`;

	const lines = [
		// its <base> is the folder of the gallery
		`<p><a href="./">${escapeHtml( gallery.title )}</a></p>`,
		`<h1>${escapeHtml( doc.name )}</h1>`,
		`<p>${escapeHtml( doc.description )}</p>`,
		codeToHtml( importLine, "ts" ),
	];

	for( const variation of doc.variations ) {
		lines.push( `<h2 id="${route}-${variation.id}">${escapeHtml( variation.title )}</h2>` );
		lines.push( textToHtml( variation.text ) );
		lines.push( codeToHtml( variation.ts, "ts" ) );
		if( variation.scss ) {
			lines.push( codeToHtml( variation.scss, "scss" ) );
		}
	}

	lines.push( ASSISTANT_LINKS );
	return lines.join( "\n" );
}

/**
 * the addresses of the pages online
 */

function makeSitemap( docs ) {
	const pages = [ "", ...docs.map( doc => doc.name.toLowerCase( ) + "/" ) ];
	const urls = pages.map( page => `\t<url><loc>${SITE}${page}</loc></url>` );

	return [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...urls,
		`</urlset>`,
		"",
	].join( "\n" );
}

/**
 * docs: the pages of src/demos, as gen-sources.mjs reads them:
 *     { name, category, description, module, imports, variations: [ { id, title, text, ts, scss } ] }
 */

export function writeStaticPages( docs ) {
	const template = readFileSync( new URL( "./src/index.html", import.meta.url ), "utf8" ).replace( /\r\n/g, "\n" );

	// the title and the description of the gallery: those of the template
	const gallery = {
		title: /<title>([^<]*)<\/title>/.exec( template )[1],
		description: /<meta name="description" content="([^"]*)">/.exec( template )[1],
	};

	rmSync( dir, { recursive: true, force: true } );
	mkdirSync( dir );

	const home = makePage( template, { title: gallery.title, description: gallery.description, body: makeHomeBody( gallery, docs ) } );
	writeFileSync( new URL( "index.html", dir ), home );

	for( const doc of docs ) {
		const route = doc.name.toLowerCase( );
		const page = makePage( template, {
			title: `${doc.name} — ${gallery.title}`,
			description: doc.description,
			base: "../",
			body: makeComponentBody( gallery, doc ),
		} );

		mkdirSync( new URL( route + "/", dir ) );
		writeFileSync( new URL( route + "/index.html", dir ), page );
	}

	writeFileSync( new URL( "sitemap.xml", dir ), makeSitemap( docs ) );
}
