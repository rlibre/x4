/**
 * Writes src/demos/sources.gen.ts, the code the gallery shows.
 *
 * In src/demos/<component>.ts (or .tsx), each variation is a function at column 0 preceded by
 * a doc comment:
 *     /** @demo Icons — The icon alone, the icon and the text. *\/
 * The comment may go on over several lines, up to "*\/": each one is a line of the text, without
 * its " * "; an empty one is a gap between two paragraphs. The card shows these lines.
 * Its code is the text of the function, from the line after the comment to the
 * first "}" at column 0. Its style is the block of src/demos/<component>.scss that
 * starts with the comment "/* @demo <function> *\/", up to the next marker or the end.
 *
 * The map is keyed "<component>/<function>": "button/icons".
 *
 * It also lists the pages: the default export of each file of src/demos that has one.
 *
 * Then it writes static/ (static-pages.mjs): the gallery as plain HTML, for the crawlers. It
 * reads in each page "const page: DemoComponent = {" its name, category, description, module,
 * imports and demos, each on one line, one tab in, its value written as in JSON (demos: the
 * names of the functions).
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { writeStaticPages } from "./static-pages.mjs";

const dir = new URL( "./src/demos/", import.meta.url );
const sources = {};
const pages = [];		// the files that export a page
const docs = [];		// the fields of these pages, for the static pages

// the blocks of a scss file, by the name of their marker
function readStyles( text ) {
	const blocks = {};
	const parts = text.split( /^\/\*\s*@demo\s+(\w+)\s*\*\/[ \t]*$/m );
	for( let i = 1; i < parts.length; i += 2 ) {
		blocks[parts[i]] = parts[i + 1].trim( );
	}
	return blocks;
}

// a field of a page, on one line and one tab in ("\tname: \"Button\","): its value as written
function readField( block, key ) {
	const found = new RegExp( `^\\t${key}: (.+?),?$`, "m" ).exec( block );
	return found ? found[1] : undefined;
}

/**
 * the fields of the page of a file that the static pages need; module and imports have the
 * defaults of the gallery (page.ts) when they are missing
 */

function readPage( file, text ) {
	const start = text.search( /^const page: DemoComponent = \{$/m );
	const end = text.indexOf( "\n};", start );
	if( start < 0 || end < 0 ) {
		console.error( `${file}: the page is "const page: DemoComponent = {" up to "};" at column 0` );
		process.exit( 1 );
	}

	const block = text.substring( start, end );
	const name = readField( block, "name" );
	const category = readField( block, "category" );
	const description = readField( block, "description" );
	const demos = readField( block, "demos" );
	if( !name || !category || !description || !demos ) {
		console.error( `${file}: the page needs name, category, description and demos, each on one line` );
		process.exit( 1 );
	}

	const module = readField( block, "module" );
	const imports = readField( block, "imports" );

	return {
		name: JSON.parse( name ),
		category: JSON.parse( category ),
		description: JSON.parse( description ),
		module: module ? JSON.parse( module ) : "x4js",
		imports: imports ? JSON.parse( imports ) : [ JSON.parse( name ) ],
		demos: demos.replace( /[[\]\s]/g, "" ).split( "," ),		// "[ icons, sizes ]"
	};
}

/**
 * the variations of a page, in the order of its demos, with their text and code
 */

function variationsOf( doc ) {
	return doc.demos.map( fn => {
		const source = sources[`${doc.file}/${fn}`];
		if( !source ) {
			console.error( `${doc.file}: ${fn}, in demos, has no @demo comment` );
			process.exit( 1 );
		}
		return { id: fn, ...source };
	} );
}

for( const file of readdirSync( dir ) ) {
	if( !/\.tsx?$/.test( file ) || file.endsWith( ".gen.ts" ) ) {
		continue;
	}

	const comp = file.replace( /\.tsx?$/, "" );
	const text = readFileSync( new URL( file, dir ), "utf8" ).replace( /\r\n/g, "\n" );
	const lines = text.split( "\n" );

	if( /^export default /m.test( text ) ) {
		pages.push( comp );
		docs.push( { file: comp, ...readPage( file, text ) } );
	}

	const scssFile = new URL( comp + ".scss", dir );
	const styles = existsSync( scssFile ) ? readStyles( readFileSync( scssFile, "utf8" ).replace( /\r\n/g, "\n" ) ) : {};

	for( let i = 0; i < lines.length; i++ ) {
		if( !/^\/\*\*\s*@demo\s/.test( lines[i] ) ) {
			continue;
		}

		// the comment up to "*/", its lines after the first one without their " * "
		const first = i;
		let comment = lines[i];
		while( !comment.includes( "*/" ) && i + 1 < lines.length ) {
			i++;
			comment += "\n" + lines[i].replace( /^\s*\*( |$)/, "" );
		}

		const doc = /^\/\*\*\s*@demo\s+(.+?)\s+—\s+([\s\S]+?)\s*\*\/\s*$/.exec( comment );
		if( !doc ) {
			console.error( `${file}:${first + 1}: a @demo comment is "/** @demo <title> — <text> */" (spaces around the dash)` );
			process.exit( 1 );
		}

		const start = i + 1;
		let end = start;
		while( end < lines.length && lines[end] !== "}" ) {
			end++;
		}

		const fn = /function\s+(\w+)/.exec( lines[start] );
		if( !fn || end == lines.length ) {
			console.error( `${file}:${i + 1}: a @demo comment must be followed by a function that ends with "}" at column 0` );
			process.exit( 1 );
		}

		sources[`${comp}/${fn[1]}`] = {
			title: doc[1],
			text: doc[2],
			ts: lines.slice( start, end + 1 ).join( "\n" ),
			scss: styles[fn[1]] ?? "",
		};

		i = end;
	}
}

// a prefix: a file may have the name of a keyword (switch)
const out = `// generated by gen-sources.mjs from src/demos: do not edit

import { DemoComponent, DemoSource } from "../types";
${pages.map( p => `import p_${p} from "./${p}";\n` ).join( "" )}
export const pages: DemoComponent[] = [ ${pages.map( p => "p_" + p ).join( ", " )} ];

export const sources: Record<string, DemoSource> = ${JSON.stringify( sources, null, "\t" )};
`;

writeFileSync( new URL( "sources.gen.ts", dir ), out );
console.log( `sources.gen.ts: ${pages.length} pages, ${Object.keys( sources ).length} variations` );

const staticDocs = docs.map( doc => ( { ...doc, variations: variationsOf( doc ) } ) );
writeStaticPages( staticDocs );
console.log( `static: ${staticDocs.length + 1} pages and sitemap.xml` );
