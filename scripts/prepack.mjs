#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from "node:path"
import chalk from "chalk"
import * as ts from 'typescript';

import { execSync } from "node:child_process";

function readJSON(fname) {
	let cpath = process.cwd();

	// check here
	let pth = path.join(cpath, fname);

	if (fs.existsSync(pth)) {
		const raw = fs.readFileSync(pth, "utf-8");
		return JSON.parse(raw);
	}

	throw new Error(`cannot find ${fname}`);
}

function readPackage() {
	return readJSON("package.json");
}




class DTSGenerator {

	output = null;

	emit( lvl, code ) {
		this.output.write( '\t'.repeat(lvl)+code );
	}

	/**
	 * 
	 */

	genMethodSig(node, source, ctor) {

		const name = ctor ? "constructor" : (node.name ? node.name.getText(source) : 'new');

		const typeParameters = node.typeParameters
			? `<${node.typeParameters.map(param => param.getText(source)).join(', ')}>`
			: '';

		const parameters = node.parameters?.map(param => {
			const paramName = param.name.getText(source);
			const paramType = param.type ? param.type.getText(source) : 'any';
			return `${paramName}: ${paramType}`;
		}).join(', ');

		const returnType = ctor ? '' : `: ${node.type ? node.type.getText(source) : 'void'}`;

		this.emit( 2, `${name}${typeParameters}( ${parameters} )${returnType};\n` );
	}

	/**
	 * 
	 */

	genPropSig( node, source ) {
		const name = node.name ? node.name.getText(source) : 'unknown';
		const type = node.type ? node.type.getText(source) : 'any';
		const isOptional = node.questionToken ? '?' : '';
		this.emit( 2, `${name}${isOptional}: ${type};\n` );
	}

	/**
	 * 
	 */

	genClassSig(node, source) {

		const cname = node.name.getText(source);
		const modifiers = node.modifiers ? node.modifiers.map(mod => mod.getText(source)).join(' ') : '';

		const heritage = node.heritageClauses ? node.heritageClauses.map(clause => {
			const typeText = clause.types.map(type => type.getText(source)).join(', ');
			return clause.token === ts.SyntaxKind.ExtendsKeyword ? `extends ${typeText}` : `implements ${typeText}`;
		}).join(' ') : '';

		const typeParameters = node.typeParameters ? `<${node.typeParameters.map(param => param.getText(source)).join(', ')}>` : '';

		this.emit( 1, `${modifiers} class ${cname}${typeParameters} ${heritage} {\n` );

		ts.forEachChild(node, (x) => {

			if (ts.isPropertyDeclaration(x)) {
				const name = x.name ? x.name.getText(source) : 'unknown';
				const type = x.type ? x.type.getText(source) : 'any';
				const isOptional = x.questionToken ? '?' : '';
				this.emit( 2, `${name}${isOptional}: ${type};\n` );
			}
			else if (ts.isMethodDeclaration(x)) {
				this.genMethodSig(x, source, false);
			}
			else if (ts.isConstructorDeclaration(x)) {
				this.genMethodSig(x, source, true);
			}
			else if (ts.isPropertySignature(x)) {
				this.genPropSig( x, source );
			}
			else {
				//debugger;
			}
		});

		this.emit( 1, "}\n\n" );
	}

	/**
	 * 
	 */

	genInterfaceSig(node, source) {
		const name = node.name.getText(source);
		const modifiers = node.modifiers ? node.modifiers.map(mod => mod.getText(source)).join(' ') + ' ' : '';
		const heritage = node.heritageClauses ? node.heritageClauses.map(clause => {
			const typeText = clause.types.map(type => type.getText(source)).join(', ');
			return clause.token === ts.SyntaxKind.ExtendsKeyword ? `extends ${typeText}` : `implements ${typeText}`;
		}).join(' ') : '';

		const typeParameters = this.genTypeParams( node.typeParameters, source );

		this.emit( 1, `${modifiers}interface ${name}${typeParameters} ${heritage} {\n` );

		ts.forEachChild(node, (x) => {

			if (ts.isPropertySignature(x)) {
				const name = x.name ? x.name.getText(source) : 'unknown';
				const type = x.type ? x.type.getText(source) : 'any';
				const isOptional = x.questionToken ? '?' : '';
				this.emit( 2, `${name}${isOptional}: ${type};\n` );
			}
			else if (ts.isMethodSignature(x)) {
				this.genMethodSig(x, source, false);
			}
		});

		this.emit( 1, "}\n\n" );
	}

	/**
	 * 
	 */
	
	genTypeParams( node, source ) {
		return node ? `<${node.map(param => param.getText(source)).join(', ')}>` : '';
	}

	/**
	 * 
	 */

	genTypeDefinition(node, source) {
		const typeName = node.name.getText(source);
		const params = this.genTypeParams( node.typeParameters, source );

		// pb if complex types
		//const typeDefinition = node.type ? node.type.getText(source) : '';

		this.emit( 1, `type ${typeName}${params} = ` );

		if (ts.isTypeLiteralNode(node.type)) {
			this.emit( 0, `{\n` );
				
			node.type.members.forEach( member => {
				if( ts.isMethodSignature(member) || ts.isConstructSignatureDeclaration(member) ) {
					this.genMethodSig( member, source );
				}
				else if( ts.isPropertySignature(member) ) {
					this.genPropSig( member, source );
				}
			});

			this.emit( 1, `}\n\n` );
		} 
		else if ( ts.isUnionTypeNode(node.type) || ts.isIntersectionTypeNode(node.type) ) {
			const operator = ts.isUnionTypeNode(node.type) ? ' | ' : ' & ';
			const typeDefinition = node.type.types.map(t => t.getText(source)).join(operator);
			this.emit( 0, `${typeDefinition};\n\n` );
		} 
		else if (ts.isArrayTypeNode(node.type)) {
			// Gérer les tableaux
			const typeDefinition = `${node.type.elementType.getText(source)}[]`;
			debugger;
			this.emit( 0, `${typeDefinition};\n\n` );
		} 
		else {
			// Pour les autres types (primitifs, tuples, etc.)
			const typeDefinition = node.type.getText(source);
			this.emit( 0, `${typeDefinition};\n\n` );
		}


	}

	/**
	 * 
	 */

	genEnumDefinition(node,source) {

		const ename = node.name.getText(source);
			
		this.emit( 1, `enum ${ename} {\n`);
		
		node.members.forEach( member => {
			const memberName = member.name.getText(source);
			const memberValue = member.initializer ? ` = ${member.initializer.getText(source)}` : '';
			this.emit( 2, `${memberName}${memberValue},\n` );
		});

		// Assembler la définition complète
		this.emit( 1, `}\n\n`);
	}

	/**
	 * 
	 */

	visitNode(node, source) {
		if (ts.isInterfaceDeclaration(node)) {
			this.genInterfaceSig(node, source);
		}
		else if (ts.isClassDeclaration(node)) {
			this.genClassSig(node, source);
		}
		else if (ts.isTypeAliasDeclaration(node)) {
			this.genTypeDefinition(node, source );
		}
		else if (ts.isEnumDeclaration(node)) {
			this.genEnumDefinition(node, source );
		}
		else {
			ts.forEachChild(node, (x) => this.visitNode(x, source));
		}
	}

	/**
	 * rz=eally quick and dirty dts generator
	 */

	async build( output_path ) {

		this.output = fs.createWriteStream(output_path, {});

		this.emit( 0, `/** \n`);
		this.emit( 0, ` *  ___  ___ __\n`);
		this.emit( 0, ` *  \\  \\/  /  / _\n`);
		this.emit( 0, ` *   \\    /  /_| |_\n`);
		this.emit( 0, ` *   /    \\____   _|  \n`);
		this.emit( 0, ` *  /__/\\__\\   |_|\n`);
		this.emit( 0, ` * \n`);
		this.emit( 0, ` * @author Etienne Cochard \n`);
		this.emit( 0, ` * @copyright (c) 2024 R-libre ingenierie\n`);
		this.emit( 0, ` *\n`);
		this.emit( 0, ` * Use of this source code is governed by an MIT-style license \n`);
		this.emit( 0, ` * that can be found in the LICENSE file or at https://opensource.org/licenses/MIT.\n`);
		this.emit( 0, ` *\n` );
		this.emit( 0, ` * AUTOGENERATED CODE, DO NOT MODIFY\n` );
		this.emit( 0, ` * generated on ${new Date().toDateString()}\n` );
		this.emit( 0, ` */\n\n\n` );

		this.emit( 0, "declare module 'x4js' {\n\n");

		const inputFiles = ["src/x4.ts", "src/custom.d.ts"];
		const compilerOptions = readJSON("tsconfig.json");

		compilerOptions.declaration = true;

		const host = ts.createCompilerHost(compilerOptions);
		const program = ts.createProgram(inputFiles, compilerOptions, host);

		const cwd = process.cwd().replaceAll("\\", "/");
		const mod_path = cwd + "/node_modules";

		program.getSourceFiles().forEach((sourceFile) => {

			let pth = sourceFile.fileName;
			if (pth.startsWith(mod_path)) {
				return;
			}
			else if( !pth.startsWith(cwd) ) {
				return;
			}

			pth = pth.substring(cwd.length);
			
			this.emit(1,`// ---------------------------------------\n` );
			this.emit(1,`// from ${pth}\n\n`);

			this.visitNode(sourceFile, sourceFile);
		});

		this.emit(0,"}\n\n");
	}
}


async function main() {

	const pkg = readPackage();

	console.log(chalk.yellow("-- prepack ------------------------"))

	fs.mkdirSync('lib/src', { recursive: true });
	fs.mkdirSync('lib/styles', { recursive: true });
	fs.mkdirSync('lib/types', { recursive: true });

	console.log(chalk.green("building esm..."));
	execSync("node scripts/build.mjs --release --outdir=lib/esm");

	console.log(chalk.green("building cjs..."));
	execSync("node scripts/build.mjs --release --cjs --outdir=lib/cjs");

	console.log(chalk.green("creating .d.ts..."));
	
	const generator = new DTSGenerator( );
	await generator.build( "lib/types/x4js.d.ts" );

	console.log(chalk.green("copying dependencies..."));

	fs.cpSync('lib/esm/x4.css', 'lib/styles/x4.css');
	fs.renameSync('lib/esm/x4.js', 'lib/esm/x4.mjs');

	fs.cpSync('src/', 'lib/src/', { recursive: true });
	fs.cpSync('README.md', 'lib/README.txt');

	console.log(chalk.yellow("-----------------------------------"))
}

main( );

//(async function tt( ) {
//const generator = new DTSGenerator( );
//	await generator.build( "output.d.ts" );
//})( );



