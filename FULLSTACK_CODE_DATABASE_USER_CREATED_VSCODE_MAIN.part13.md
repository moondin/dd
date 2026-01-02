---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 13
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 13 of 552)

````text
================================================================================
FULLSTACK USER CREATED CODE DATABASE (VERBATIM) - vscode-main
================================================================================
Generated: December 18, 2025
Source: user_created_projects/vscode-main
================================================================================

NOTES:
- This output is verbatim because the source is user-owned.
- Large/binary files may be skipped by size/binary detection limits.

================================================================================

---[FILE: build/lib/optimize.ts]---
Location: vscode-main/build/lib/optimize.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import gulp from 'gulp';
import filter from 'gulp-filter';
import path from 'path';
import fs from 'fs';
import pump from 'pump';
import VinylFile from 'vinyl';
import * as bundle from './bundle.ts';
import esbuild from 'esbuild';
import sourcemaps from 'gulp-sourcemaps';
import fancyLog from 'fancy-log';
import ansiColors from 'ansi-colors';
import { getTargetStringFromTsConfig } from './tsconfigUtils.ts';
import svgmin from 'gulp-svgmin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

declare module 'gulp-sourcemaps' {
	interface WriteOptions {
		addComment?: boolean;
		includeContent?: boolean;
		sourceRoot?: string | WriteMapper;
		sourceMappingURL?: ((f: any) => string);
		sourceMappingURLPrefix?: string | WriteMapper;
		clone?: boolean | CloneOptions;
	}
}

const REPO_ROOT_PATH = path.join(import.meta.dirname, '../..');

export interface IBundleESMTaskOpts {
	/**
	 * The folder to read files from.
	 */
	src: string;
	/**
	 * The entry points to bundle.
	 */
	entryPoints: Array<bundle.IEntryPoint | string>;
	/**
	 * Other resources to consider (svg, etc.)
	 */
	resources?: string[];
	/**
	 * File contents interceptor for a given path.
	 */
	fileContentMapper?: (path: string) => ((contents: string) => Promise<string> | string) | undefined;
	/**
	 * Allows to skip the removal of TS boilerplate. Use this when
	 * the entry point is small and the overhead of removing the
	 * boilerplate makes the file larger in the end.
	 */
	skipTSBoilerplateRemoval?: (entryPointName: string) => boolean;
}

const DEFAULT_FILE_HEADER = [
	'/*!--------------------------------------------------------',
	' * Copyright (C) Microsoft Corporation. All rights reserved.',
	' *--------------------------------------------------------*/'
].join('\n');

function bundleESMTask(opts: IBundleESMTaskOpts): NodeJS.ReadWriteStream {
	const resourcesStream = es.through(); // this stream will contain the resources
	const bundlesStream = es.through(); // this stream will contain the bundled files

	const target = getBuildTarget();

	const entryPoints = opts.entryPoints.map(entryPoint => {
		if (typeof entryPoint === 'string') {
			return { name: path.parse(entryPoint).name };
		}

		return entryPoint;
	});

	const bundleAsync = async () => {
		const files: VinylFile[] = [];
		const tasks: Promise<any>[] = [];

		for (const entryPoint of entryPoints) {
			fancyLog(`Bundled entry point: ${ansiColors.yellow(entryPoint.name)}...`);

			// support for 'dest' via esbuild#in/out
			const dest = entryPoint.dest?.replace(/\.[^/.]+$/, '') ?? entryPoint.name;

			// banner contents
			const banner = {
				js: DEFAULT_FILE_HEADER,
				css: DEFAULT_FILE_HEADER
			};

			// TS Boilerplate
			if (!opts.skipTSBoilerplateRemoval?.(entryPoint.name)) {
				const tslibPath = path.join(require.resolve('tslib'), '../tslib.es6.js');
				banner.js += await fs.promises.readFile(tslibPath, 'utf-8');
			}

			const contentsMapper: esbuild.Plugin = {
				name: 'contents-mapper',
				setup(build) {
					build.onLoad({ filter: /\.js$/ }, async ({ path }) => {
						const contents = await fs.promises.readFile(path, 'utf-8');

						// TS Boilerplate
						let newContents: string;
						if (!opts.skipTSBoilerplateRemoval?.(entryPoint.name)) {
							newContents = bundle.removeAllTSBoilerplate(contents);
						} else {
							newContents = contents;
						}

						// File Content Mapper
						const mapper = opts.fileContentMapper?.(path.replace(/\\/g, '/'));
						if (mapper) {
							newContents = await mapper(newContents);
						}

						return { contents: newContents };
					});
				}
			};

			const externalOverride: esbuild.Plugin = {
				name: 'external-override',
				setup(build) {
					// We inline selected modules that are we depend on on startup without
					// a conditional `await import(...)` by hooking into the resolution.
					build.onResolve({ filter: /^minimist$/ }, () => {
						return { path: path.join(REPO_ROOT_PATH, 'node_modules', 'minimist', 'index.js'), external: false };
					});
				},
			};

			const task = esbuild.build({
				bundle: true,
				packages: 'external', // "external all the things", see https://esbuild.github.io/api/#packages
				platform: 'neutral', // makes esm
				format: 'esm',
				sourcemap: 'external',
				plugins: [contentsMapper, externalOverride],
				target: [target],
				loader: {
					'.ttf': 'file',
					'.svg': 'file',
					'.png': 'file',
					'.sh': 'file',
				},
				assetNames: 'media/[name]', // moves media assets into a sub-folder "media"
				banner: entryPoint.name === 'vs/workbench/workbench.web.main' ? undefined : banner, // TODO@esm remove line when we stop supporting web-amd-esm-bridge
				entryPoints: [
					{
						in: path.join(REPO_ROOT_PATH, opts.src, `${entryPoint.name}.js`),
						out: dest,
					}
				],
				outdir: path.join(REPO_ROOT_PATH, opts.src),
				write: false, // enables res.outputFiles
				metafile: true, // enables res.metafile
				// minify: NOT enabled because we have a separate minify task that takes care of the TSLib banner as well
			}).then(res => {
				for (const file of res.outputFiles) {
					let sourceMapFile: esbuild.OutputFile | undefined = undefined;
					if (file.path.endsWith('.js')) {
						sourceMapFile = res.outputFiles.find(f => f.path === `${file.path}.map`);
					}

					const fileProps = {
						contents: Buffer.from(file.contents),
						sourceMap: sourceMapFile ? JSON.parse(sourceMapFile.text) : undefined, // support gulp-sourcemaps
						path: file.path,
						base: path.join(REPO_ROOT_PATH, opts.src)
					};
					files.push(new VinylFile(fileProps));
				}
			});

			tasks.push(task);
		}

		await Promise.all(tasks);
		return { files };
	};

	bundleAsync().then((output) => {

		// bundle output (JS, CSS, SVG...)
		es.readArray(output.files).pipe(bundlesStream);

		// forward all resources
		gulp.src(opts.resources ?? [], { base: `${opts.src}`, allowEmpty: true }).pipe(resourcesStream);
	});

	const result = es.merge(
		bundlesStream,
		resourcesStream
	);

	return result
		.pipe(sourcemaps.write('./', {
			sourceRoot: undefined,
			addComment: true,
			includeContent: true
		}));
}

export interface IBundleTaskOpts {
	/**
	 * Destination folder for the bundled files.
	 */
	out: string;
	/**
	 * Bundle ESM modules (using esbuild).
	*/
	esm: IBundleESMTaskOpts;
}

export function bundleTask(opts: IBundleTaskOpts): () => NodeJS.ReadWriteStream {
	return function () {
		return bundleESMTask(opts.esm).pipe(gulp.dest(opts.out));
	};
}

export function minifyTask(src: string, sourceMapBaseUrl?: string): (cb: any) => void {
	const sourceMappingURL = sourceMapBaseUrl ? ((f: any) => `${sourceMapBaseUrl}/${f.relative}.map`) : undefined;
	const target = getBuildTarget();

	return cb => {

		const esbuildFilter = filter('**/*.{js,css}', { restore: true });
		const svgFilter = filter('**/*.svg', { restore: true });

		pump(
			gulp.src([src + '/**', '!' + src + '/**/*.map']),
			esbuildFilter,
			sourcemaps.init({ loadMaps: true }),
			es.map((f: any, cb) => {
				esbuild.build({
					entryPoints: [f.path],
					minify: true,
					sourcemap: 'external',
					outdir: '.',
					packages: 'external', // "external all the things", see https://esbuild.github.io/api/#packages
					platform: 'neutral', // makes esm
					target: [target],
					write: false,
				}).then(res => {
					const jsOrCSSFile = res.outputFiles.find(f => /\.(js|css)$/.test(f.path))!;
					const sourceMapFile = res.outputFiles.find(f => /\.(js|css)\.map$/.test(f.path))!;

					const contents = Buffer.from(jsOrCSSFile.contents);
					const unicodeMatch = contents.toString().match(/[^\x00-\xFF]+/g);
					if (unicodeMatch) {
						cb(new Error(`Found non-ascii character ${unicodeMatch[0]} in the minified output of ${f.path}. Non-ASCII characters in the output can cause performance problems when loading. Please review if you have introduced a regular expression that esbuild is not automatically converting and convert it to using unicode escape sequences.`));
					} else {
						f.contents = contents;
						f.sourceMap = JSON.parse(sourceMapFile.text);

						cb(undefined, f);
					}
				}, cb);
			}),
			esbuildFilter.restore,
			svgFilter,
			svgmin(),
			svgFilter.restore,
			sourcemaps.write('./', {
				sourceMappingURL,
				sourceRoot: undefined,
				includeContent: true,
				addComment: true
			}),
			gulp.dest(src + '-min'),
			(err: any) => cb(err));
	};
}

function getBuildTarget() {
	const tsconfigPath = path.join(REPO_ROOT_PATH, 'src', 'tsconfig.base.json');
	return getTargetStringFromTsConfig(tsconfigPath);
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/preLaunch.ts]---
Location: vscode-main/build/lib/preLaunch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const rootDir = path.resolve(import.meta.dirname, '..', '..');

function runProcess(command: string, args: ReadonlyArray<string> = []) {
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, args, { cwd: rootDir, stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
		child.on('exit', err => !err ? resolve() : process.exit(err ?? 1));
		child.on('error', reject);
	});
}

async function exists(subdir: string) {
	try {
		await fs.stat(path.join(rootDir, subdir));
		return true;
	} catch {
		return false;
	}
}

async function ensureNodeModules() {
	if (!(await exists('node_modules'))) {
		await runProcess(npm, ['ci']);
	}
}

async function getElectron() {
	await runProcess(npm, ['run', 'electron']);
}

async function ensureCompiled() {
	if (!(await exists('out'))) {
		await runProcess(npm, ['run', 'compile']);
	}
}

async function main() {
	await ensureNodeModules();
	await getElectron();
	await ensureCompiled();

	// Can't require this until after dependencies are installed
	const { getBuiltInExtensions } = await import('./builtInExtensions.ts');
	await getBuiltInExtensions();
}

if (import.meta.main) {
	main().catch(err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/propertyInitOrderChecker.ts]---
Location: vscode-main/build/lib/propertyInitOrderChecker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const TS_CONFIG_PATH = path.join(import.meta.dirname, '../../', 'src', 'tsconfig.json');

//
// #############################################################################################
//
// A custom typescript checker that ensure constructor properties are NOT used to initialize
// defined properties. This is needed for the times when `useDefineForClassFields` is gone.
//
// see https://github.com/microsoft/vscode/issues/243049, https://github.com/microsoft/vscode/issues/186726,
// https://github.com/microsoft/vscode/pull/241544
//
// #############################################################################################
//

const EntryKind = Object.freeze({
	Span: 'Span',
	Node: 'Node',
	StringLiteral: 'StringLiteral',
	SearchedLocalFoundProperty: 'SearchedLocalFoundProperty',
	SearchedPropertyFoundLocal: 'SearchedPropertyFoundLocal'
});

type EntryKind = typeof EntryKind[keyof typeof EntryKind];

const cancellationToken: ts.CancellationToken = {
	isCancellationRequested: () => false,
	throwIfCancellationRequested: () => { },
};

const seenFiles = new Set<ts.SourceFile>();
let errorCount = 0;



function createProgram(tsconfigPath: string): ts.Program {
	const tsConfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

	const configHostParser: ts.ParseConfigHost = { fileExists: fs.existsSync, readDirectory: ts.sys.readDirectory, readFile: file => fs.readFileSync(file, 'utf8'), useCaseSensitiveFileNames: process.platform === 'linux' };
	const tsConfigParsed = ts.parseJsonConfigFileContent(tsConfig.config, configHostParser, path.resolve(path.dirname(tsconfigPath)), { noEmit: true });

	const compilerHost = ts.createCompilerHost(tsConfigParsed.options, true);

	return ts.createProgram(tsConfigParsed.fileNames, tsConfigParsed.options, compilerHost);
}

const program = createProgram(TS_CONFIG_PATH);

program.getTypeChecker();

for (const file of program.getSourceFiles()) {
	if (!file || file.isDeclarationFile) {
		continue;
	}
	visit(file);
}

if (seenFiles.size) {
	console.log();
	console.log(`Found ${errorCount} error${errorCount === 1 ? '' : 's'} in ${seenFiles.size} file${seenFiles.size === 1 ? '' : 's'}.`);
	process.exit(errorCount);
}

function visit(node: ts.Node) {
	if (ts.isParameter(node) && ts.isParameterPropertyDeclaration(node, node.parent)) {
		checkParameterPropertyDeclaration(node);
	}

	ts.forEachChild(node, visit);
}

function checkParameterPropertyDeclaration(param: ts.ParameterPropertyDeclaration) {
	const uses = [...collectReferences(param.name, [])];
	if (!uses.length) {
		return;
	}

	const sourceFile = param.getSourceFile();
	if (!seenFiles.has(sourceFile)) {
		if (seenFiles.size) {
			console.log(``);
		}
		console.log(`${formatFileName(param)}:`);
		seenFiles.add(sourceFile);
	} else {
		console.log(``);
	}
	console.log(`  Parameter property '${param.name.getText()}' is used before its declaration.`);
	for (const { stack, container } of uses) {
		const use = stack[stack.length - 1];
		console.log(`    at ${formatLocation(use)}: ${formatMember(container)} -> ${formatStack(stack)}`);
		errorCount++;
	}
}

interface InvalidUse {
	stack: ts.Node[];
	container: ReferenceContainer;
}

function* collectReferences(node: ts.Node, stack: ts.Node[], requiresInvocationDepth: number = 0, seen = new Set<ReferenceContainer>()): Generator<InvalidUse> {
	for (const use of findAllReferencesInClass(node)) {
		const container = findContainer(use);
		if (!container || seen.has(container) || ts.isConstructorDeclaration(container)) {
			continue;
		}
		seen.add(container);

		const nextStack = [...stack, use];

		let nextRequiresInvocationDepth = requiresInvocationDepth;
		if (isInvocation(use) && nextRequiresInvocationDepth > 0) {
			nextRequiresInvocationDepth--;
		}

		if (ts.isPropertyDeclaration(container) && nextRequiresInvocationDepth === 0) {
			yield { stack: nextStack, container };
		}
		else if (requiresInvocation(container)) {
			nextRequiresInvocationDepth++;
		}

		yield* collectReferences(container.name ?? container, nextStack, nextRequiresInvocationDepth, seen);
	}
}

function requiresInvocation(definition: ReferenceContainer): boolean {
	return ts.isMethodDeclaration(definition) || ts.isFunctionDeclaration(definition) || ts.isFunctionExpression(definition) || ts.isArrowFunction(definition);
}

function isInvocation(use: ts.Node): boolean {
	let location = use;
	if (ts.isPropertyAccessExpression(location.parent) && location.parent.name === location) {
		location = location.parent;
	}
	else if (ts.isElementAccessExpression(location.parent) && location.parent.argumentExpression === location) {
		location = location.parent;
	}
	return ts.isCallExpression(location.parent) && location.parent.expression === location
		|| ts.isTaggedTemplateExpression(location.parent) && location.parent.tag === location;
}

function formatFileName(node: ts.Node): string {
	const sourceFile = node.getSourceFile();
	return path.resolve(sourceFile.fileName);
}

function formatLocation(node: ts.Node): string {
	const sourceFile = node.getSourceFile();
	const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
	return `${formatFileName(sourceFile)}(${line + 1},${character + 1})`;
}

function formatStack(stack: ts.Node[]): string {
	return stack.slice().reverse().map((use) => formatUse(use)).join(' -> ');
}

function formatMember(container: ReferenceContainer): string {
	const name = container.name?.getText();
	if (name) {
		const className = findClass(container)?.name?.getText();
		if (className) {
			return `${className}.${name}`;
		}
		return name;
	}
	return '<unknown>';
}

function formatUse(use: ts.Node): string {
	let text = use.getText();
	if (use.parent && ts.isPropertyAccessExpression(use.parent) && use.parent.name === use) {
		if (use.parent.expression.kind === ts.SyntaxKind.ThisKeyword) {
			text = `this.${text}`;
		}
		use = use.parent;
	}
	else if (use.parent && ts.isElementAccessExpression(use.parent) && use.parent.argumentExpression === use) {
		if (use.parent.expression.kind === ts.SyntaxKind.ThisKeyword) {
			text = `this['${text}']`;
		}
		use = use.parent;
	}
	if (ts.isCallExpression(use.parent)) {
		text = `${text}(...)`;
	}
	return text;
}

type ReferenceContainer =
	| ts.PropertyDeclaration
	| ts.MethodDeclaration
	| ts.GetAccessorDeclaration
	| ts.SetAccessorDeclaration
	| ts.ConstructorDeclaration
	| ts.ClassStaticBlockDeclaration
	| ts.ArrowFunction
	| ts.FunctionExpression
	| ts.FunctionDeclaration
	| ts.ParameterDeclaration;

function findContainer(node: ts.Node): ReferenceContainer | undefined {
	return ts.findAncestor(node, ancestor => {
		switch (ancestor.kind) {
			case ts.SyntaxKind.PropertyDeclaration:
			case ts.SyntaxKind.MethodDeclaration:
			case ts.SyntaxKind.GetAccessor:
			case ts.SyntaxKind.SetAccessor:
			case ts.SyntaxKind.Constructor:
			case ts.SyntaxKind.ClassStaticBlockDeclaration:
			case ts.SyntaxKind.ArrowFunction:
			case ts.SyntaxKind.FunctionExpression:
			case ts.SyntaxKind.FunctionDeclaration:
			case ts.SyntaxKind.Parameter:
				return true;
		}
		return false;
	}) as ReferenceContainer | undefined;
}

function findClass(node: ts.Node): ts.ClassLikeDeclaration | undefined {
	return ts.findAncestor(node, ts.isClassLike);
}

function* findAllReferencesInClass(node: ts.Node): Generator<ts.Node> {
	const classDecl = findClass(node);
	if (!classDecl) {
		return [];
	}
	for (const ref of findAllReferences(node)) {
		for (const entry of ref.references) {
			if (entry.kind !== EntryKind.Node || entry.node === node) {
				continue;
			}
			if (findClass(entry.node) === classDecl) {
				yield entry.node;
			}
		}
	}
}

// NOTE: The following uses TypeScript internals and are subject to change from version to version.

interface TypeScriptInternals {
	getTouchingPropertyName(sourceFile: ts.SourceFile, position: number): ts.Node;
	FindAllReferences: {
		FindReferencesUse: {
			References: number;
		};
		Core: {
			getReferencedSymbolsForNode(
				position: number,
				node: ts.Node,
				program: ts.Program,
				sourceFiles: readonly ts.SourceFile[],
				cancellationToken: ts.CancellationToken,
				options: { use: number }
			): readonly SymbolAndEntries[] | undefined;
		};
	};
}

function findAllReferences(node: ts.Node): readonly SymbolAndEntries[] {
	const sourceFile = node.getSourceFile();
	const position = node.getStart();
	const tsInternal = ts as unknown as TypeScriptInternals;
	const name: ts.Node = tsInternal.getTouchingPropertyName(sourceFile, position);
	const options = { use: tsInternal.FindAllReferences.FindReferencesUse.References };
	return tsInternal.FindAllReferences.Core.getReferencedSymbolsForNode(position, name, program, [sourceFile], cancellationToken, options) ?? [];
}

interface SymbolAndEntries {
	readonly definition: Definition | undefined;
	readonly references: readonly Entry[];
}

const DefinitionKind = Object.freeze({
	Symbol: 0,
	Label: 1,
	Keyword: 2,
	This: 3,
	String: 4,
	TripleSlashReference: 5,
});
type DefinitionKind = typeof DefinitionKind[keyof typeof DefinitionKind];

type Definition =
	| { readonly type: DefinitionKind; readonly symbol: ts.Symbol }
	| { readonly type: DefinitionKind; readonly node: ts.Identifier }
	| { readonly type: DefinitionKind; readonly node: ts.Node }
	| { readonly type: DefinitionKind; readonly node: ts.Node }
	| { readonly type: DefinitionKind; readonly node: ts.StringLiteralLike }
	| { readonly type: DefinitionKind; readonly reference: ts.FileReference; readonly file: ts.SourceFile };

type NodeEntryKind = typeof EntryKind.Node | typeof EntryKind.StringLiteral | typeof EntryKind.SearchedLocalFoundProperty | typeof EntryKind.SearchedPropertyFoundLocal;
type Entry = NodeEntry | SpanEntry;
interface ContextWithStartAndEndNode {
	start: ts.Node;
	end: ts.Node;
}
type ContextNode = ts.Node | ContextWithStartAndEndNode;
interface NodeEntry {
	readonly kind: NodeEntryKind;
	readonly node: ts.Node;
	readonly context?: ContextNode;
}
interface SpanEntry {
	readonly kind: typeof EntryKind.Span;
	readonly fileName: string;
	readonly textSpan: ts.TextSpan;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/reporter.ts]---
Location: vscode-main/build/lib/reporter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import fancyLog from 'fancy-log';
import ansiColors from 'ansi-colors';
import fs from 'fs';
import path from 'path';

class ErrorLog {
	public id: string;

	constructor(id: string) {
		this.id = id;
	}
	allErrors: string[][] = [];
	startTime: number | null = null;
	count = 0;

	onStart(): void {
		if (this.count++ > 0) {
			return;
		}

		this.startTime = new Date().getTime();
		fancyLog(`Starting ${ansiColors.green('compilation')}${this.id ? ansiColors.blue(` ${this.id}`) : ''}...`);
	}

	onEnd(): void {
		if (--this.count > 0) {
			return;
		}

		this.log();
	}

	log(): void {
		const errors = this.allErrors.flat();
		const seen = new Set<string>();

		errors.map(err => {
			if (!seen.has(err)) {
				seen.add(err);
				fancyLog(`${ansiColors.red('Error')}: ${err}`);
			}
		});

		fancyLog(`Finished ${ansiColors.green('compilation')}${this.id ? ansiColors.blue(` ${this.id}`) : ''} with ${errors.length} errors after ${ansiColors.magenta((new Date().getTime() - this.startTime!) + ' ms')}`);

		const regex = /^([^(]+)\((\d+),(\d+)\): (.*)$/s;
		const messages = errors
			.map(err => regex.exec(err))
			.filter(match => !!match)
			.map(x => x as string[])
			.map(([, path, line, column, message]) => ({ path, line: parseInt(line), column: parseInt(column), message }));

		try {
			const logFileName = 'log' + (this.id ? `_${this.id}` : '');
			fs.writeFileSync(path.join(buildLogFolder, logFileName), JSON.stringify(messages));
		} catch (err) {
			//noop
		}
	}

}

const errorLogsById = new Map<string, ErrorLog>();
function getErrorLog(id: string = '') {
	let errorLog = errorLogsById.get(id);
	if (!errorLog) {
		errorLog = new ErrorLog(id);
		errorLogsById.set(id, errorLog);
	}
	return errorLog;
}

const buildLogFolder = path.join(path.dirname(path.dirname(import.meta.dirname)), '.build');

try {
	fs.mkdirSync(buildLogFolder);
} catch (err) {
	// ignore
}

export interface IReporter {
	(err: string): void;
	hasErrors(): boolean;
	end(emitError: boolean): NodeJS.ReadWriteStream;
}

class ReporterError extends Error {
	__reporter__ = true;
}

interface Errors extends Array<string> {
	__logged__?: boolean;
}

export function createReporter(id?: string): IReporter {
	const errorLog = getErrorLog(id);

	const errors: Errors = [];
	errorLog.allErrors.push(errors);

	const result = (err: string) => errors.push(err);

	result.hasErrors = () => errors.length > 0;

	result.end = (emitError: boolean): NodeJS.ReadWriteStream => {
		errors.length = 0;
		errorLog.onStart();

		return es.through(undefined, function () {
			errorLog.onEnd();

			if (emitError && errors.length > 0) {
				if (!errors.__logged__) {
					errorLog.log();
				}

				errors.__logged__ = true;

				const err = new ReporterError(`Found ${errors.length} errors`);
				this.emit('error', err);
			} else {
				this.emit('end');
			}
		});
	};

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/snapshotLoader.ts]---
Location: vscode-main/build/lib/snapshotLoader.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const snaps = (() => {

	const fs = require('fs');
	const path = require('path');
	const os = require('os');
	const cp = require('child_process');

	const mksnapshot = path.join(import.meta.dirname, `../../node_modules/.bin/${process.platform === 'win32' ? 'mksnapshot.cmd' : 'mksnapshot'}`);
	const product = require('../../product.json');
	const arch = (process.argv.join('').match(/--arch=(.*)/) || [])[1];

	//
	let loaderFilepath: string;
	let startupBlobFilepath: string;

	switch (process.platform) {
		case 'darwin':
			loaderFilepath = `VSCode-darwin/${product.nameLong}.app/Contents/Resources/app/out/vs/loader.js`;
			startupBlobFilepath = `VSCode-darwin/${product.nameLong}.app/Contents/Frameworks/Electron Framework.framework/Resources/snapshot_blob.bin`;
			break;

		case 'win32':
		case 'linux':
			loaderFilepath = `VSCode-${process.platform}-${arch}/resources/app/out/vs/loader.js`;
			startupBlobFilepath = `VSCode-${process.platform}-${arch}/snapshot_blob.bin`;
			break;

		default:
			throw new Error('Unknown platform');
	}

	loaderFilepath = path.join(import.meta.dirname, '../../../', loaderFilepath);
	startupBlobFilepath = path.join(import.meta.dirname, '../../../', startupBlobFilepath);

	snapshotLoader(loaderFilepath, startupBlobFilepath);

	function snapshotLoader(loaderFilepath: string, startupBlobFilepath: string): void {

		const inputFile = fs.readFileSync(loaderFilepath);
		const wrappedInputFile = `
		var Monaco_Loader_Init;
		(function() {
			var doNotInitLoader = true;
			${inputFile.toString()};
			Monaco_Loader_Init = function() {
				AMDLoader.init();
				CSSLoaderPlugin.init();
				NLSLoaderPlugin.init();

				return { define, require };
			}
		})();
		`;
		const wrappedInputFilepath = path.join(os.tmpdir(), 'wrapped-loader.js');
		console.log(wrappedInputFilepath);
		fs.writeFileSync(wrappedInputFilepath, wrappedInputFile);

		cp.execFileSync(mksnapshot, [wrappedInputFilepath, `--startup_blob`, startupBlobFilepath]);
	}

	return {};
})();
```

--------------------------------------------------------------------------------

---[FILE: build/lib/standalone.ts]---
Location: vscode-main/build/lib/standalone.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import * as tss from './treeshaking.ts';
import ts from 'typescript';

const dirCache: { [dir: string]: boolean } = {};

function writeFile(filePath: string, contents: Buffer | string): void {
	function ensureDirs(dirPath: string): void {
		if (dirCache[dirPath]) {
			return;
		}
		dirCache[dirPath] = true;

		ensureDirs(path.dirname(dirPath));
		if (fs.existsSync(dirPath)) {
			return;
		}
		fs.mkdirSync(dirPath);
	}
	ensureDirs(path.dirname(filePath));
	fs.writeFileSync(filePath, contents);
}

export function extractEditor(options: tss.ITreeShakingOptions & { destRoot: string; tsOutDir: string; additionalFilesToCopyOut?: string[] }): void {
	const tsConfig = JSON.parse(fs.readFileSync(path.join(options.sourcesRoot, 'tsconfig.monaco.json')).toString());
	let compilerOptions: { [key: string]: any };
	if (tsConfig.extends) {
		const extendedConfig = JSON.parse(fs.readFileSync(path.join(options.sourcesRoot, tsConfig.extends)).toString());
		compilerOptions = Object.assign({}, extendedConfig.compilerOptions, tsConfig.compilerOptions);
		delete tsConfig.extends;
	} else {
		compilerOptions = tsConfig.compilerOptions;
	}
	tsConfig.compilerOptions = compilerOptions;
	tsConfig.compilerOptions.sourceMap = true;
	tsConfig.compilerOptions.outDir = options.tsOutDir;

	compilerOptions.noEmit = false;
	compilerOptions.noUnusedLocals = false;
	compilerOptions.preserveConstEnums = false;
	compilerOptions.declaration = false;


	options.compilerOptions = compilerOptions;

	console.log(`Running tree shaker with shakeLevel ${tss.toStringShakeLevel(options.shakeLevel)}`);

	// Take the extra included .d.ts files from `tsconfig.monaco.json`
	options.typings = (tsConfig.include as string[]).filter(includedFile => /\.d\.ts$/.test(includedFile));

	const result = tss.shake(options);
	for (const fileName in result) {
		if (result.hasOwnProperty(fileName)) {
			let fileContents = result[fileName];
			// Replace .ts? with .js? in new URL() patterns
			fileContents = fileContents.replace(
				/(new\s+URL\s*\(\s*['"`][^'"`]*?)\.ts(\?[^'"`]*['"`])/g,
				'$1.js$2'
			);
			const relativePath = path.relative(options.sourcesRoot, fileName);
			writeFile(path.join(options.destRoot, relativePath), fileContents);
		}
	}
	const copied: { [fileName: string]: boolean } = {};
	const copyFile = (fileName: string, toFileName?: string) => {
		if (copied[fileName]) {
			return;
		}
		copied[fileName] = true;

		if (path.isAbsolute(fileName)) {
			const relativePath = path.relative(options.sourcesRoot, fileName);
			const dstPath = path.join(options.destRoot, toFileName ?? relativePath);
			writeFile(dstPath, fs.readFileSync(fileName));
		} else {
			const srcPath = path.join(options.sourcesRoot, fileName);
			const dstPath = path.join(options.destRoot, toFileName ?? fileName);
			writeFile(dstPath, fs.readFileSync(srcPath));
		}
	};
	const writeOutputFile = (fileName: string, contents: string | Buffer) => {
		const relativePath = path.isAbsolute(fileName) ? path.relative(options.sourcesRoot, fileName) : fileName;
		writeFile(path.join(options.destRoot, relativePath), contents);
	};
	for (const fileName in result) {
		if (result.hasOwnProperty(fileName)) {
			const fileContents = result[fileName];
			const info = ts.preProcessFile(fileContents);

			for (let i = info.importedFiles.length - 1; i >= 0; i--) {
				const importedFileName = info.importedFiles[i].fileName;

				let importedFilePath = importedFileName;
				if (/(^\.\/)|(^\.\.\/)/.test(importedFilePath)) {
					importedFilePath = path.join(path.dirname(fileName), importedFilePath);
				}

				if (/\.css$/.test(importedFilePath)) {
					transportCSS(importedFilePath, copyFile, writeOutputFile);
				} else {
					const pathToCopy = path.join(options.sourcesRoot, importedFilePath);
					if (fs.existsSync(pathToCopy) && !fs.statSync(pathToCopy).isDirectory()) {
						copyFile(importedFilePath);
					}
				}
			}
		}
	}

	delete tsConfig.compilerOptions.moduleResolution;
	writeOutputFile('tsconfig.json', JSON.stringify(tsConfig, null, '\t'));

	options.additionalFilesToCopyOut?.forEach((file) => {
		copyFile(file);
	});

	copyFile('vs/loader.js');
	copyFile('typings/css.d.ts');
	copyFile('../node_modules/@vscode/tree-sitter-wasm/wasm/web-tree-sitter.d.ts', '@vscode/tree-sitter-wasm.d.ts');
}

function transportCSS(module: string, enqueue: (module: string) => void, write: (path: string, contents: string | Buffer) => void): boolean {

	if (!/\.css/.test(module)) {
		return false;
	}

	const fileContents = fs.readFileSync(module).toString();
	const inlineResources = 'base64'; // see https://github.com/microsoft/monaco-editor/issues/148

	const newContents = _rewriteOrInlineUrls(fileContents, inlineResources === 'base64');
	write(module, newContents);
	return true;

	function _rewriteOrInlineUrls(contents: string, forceBase64: boolean): string {
		return _replaceURL(contents, (url) => {
			const fontMatch = url.match(/^(.*).ttf\?(.*)$/);
			if (fontMatch) {
				const relativeFontPath = `${fontMatch[1]}.ttf`; // trim the query parameter
				const fontPath = path.join(path.dirname(module), relativeFontPath);
				enqueue(fontPath);
				return relativeFontPath;
			}

			const imagePath = path.join(path.dirname(module), url);
			const fileContents = fs.readFileSync(imagePath);
			const MIME = /\.svg$/.test(url) ? 'image/svg+xml' : 'image/png';
			let DATA = ';base64,' + fileContents.toString('base64');

			if (!forceBase64 && /\.svg$/.test(url)) {
				// .svg => url encode as explained at https://codepen.io/tigt/post/optimizing-svgs-in-data-uris
				const newText = fileContents.toString()
					.replace(/"/g, '\'')
					.replace(/</g, '%3C')
					.replace(/>/g, '%3E')
					.replace(/&/g, '%26')
					.replace(/#/g, '%23')
					.replace(/\s+/g, ' ');
				const encodedData = ',' + newText;
				if (encodedData.length < DATA.length) {
					DATA = encodedData;
				}
			}
			return '"data:' + MIME + DATA + '"';
		});
	}

	function _replaceURL(contents: string, replacer: (url: string) => string): string {
		// Use ")" as the terminator as quotes are oftentimes not used at all
		return contents.replace(/url\(\s*([^\)]+)\s*\)?/g, (_: string, ...matches: string[]) => {
			let url = matches[0];
			// Eliminate starting quotes (the initial whitespace is not captured)
			if (url.charAt(0) === '"' || url.charAt(0) === '\'') {
				url = url.substring(1);
			}
			// The ending whitespace is captured
			while (url.length > 0 && (url.charAt(url.length - 1) === ' ' || url.charAt(url.length - 1) === '\t')) {
				url = url.substring(0, url.length - 1);
			}
			// Eliminate ending quotes
			if (url.charAt(url.length - 1) === '"' || url.charAt(url.length - 1) === '\'') {
				url = url.substring(0, url.length - 1);
			}

			if (!_startsWith(url, 'data:') && !_startsWith(url, 'http://') && !_startsWith(url, 'https://')) {
				url = replacer(url);
			}

			return 'url(' + url + ')';
		});
	}

	function _startsWith(haystack: string, needle: string): boolean {
		return haystack.length >= needle.length && haystack.substr(0, needle.length) === needle;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/stats.ts]---
Location: vscode-main/build/lib/stats.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import fancyLog from 'fancy-log';
import ansiColors from 'ansi-colors';
import File from 'vinyl';

class Entry {
	readonly name: string;
	public totalCount: number;
	public totalSize: number;

	constructor(name: string, totalCount: number, totalSize: number) {
		this.name = name;
		this.totalCount = totalCount;
		this.totalSize = totalSize;
	}

	toString(pretty?: boolean): string {
		if (!pretty) {
			if (this.totalCount === 1) {
				return `${this.name}: ${this.totalSize} bytes`;
			} else {
				return `${this.name}: ${this.totalCount} files with ${this.totalSize} bytes`;
			}
		} else {
			if (this.totalCount === 1) {
				return `Stats for '${ansiColors.grey(this.name)}': ${Math.round(this.totalSize / 1204)}KB`;

			} else {
				const count = this.totalCount < 100
					? ansiColors.green(this.totalCount.toString())
					: ansiColors.red(this.totalCount.toString());

				return `Stats for '${ansiColors.grey(this.name)}': ${count} files, ${Math.round(this.totalSize / 1204)}KB`;
			}
		}
	}
}

const _entries = new Map<string, Entry>();

export function createStatsStream(group: string, log?: boolean): es.ThroughStream {

	const entry = new Entry(group, 0, 0);
	_entries.set(entry.name, entry);

	return es.through(function (data) {
		const file = data as File;
		if (typeof file.path === 'string') {
			entry.totalCount += 1;
			if (Buffer.isBuffer(file.contents)) {
				entry.totalSize += file.contents.length;
			} else if (file.stat && typeof file.stat.size === 'number') {
				entry.totalSize += file.stat.size;
			} else {
				// funky file...
			}
		}
		this.emit('data', data);
	}, function () {
		if (log) {
			if (entry.totalCount === 1) {
				fancyLog(`Stats for '${ansiColors.grey(entry.name)}': ${Math.round(entry.totalSize / 1204)}KB`);

			} else {
				const count = entry.totalCount < 100
					? ansiColors.green(entry.totalCount.toString())
					: ansiColors.red(entry.totalCount.toString());

				fancyLog(`Stats for '${ansiColors.grey(entry.name)}': ${count} files, ${Math.round(entry.totalSize / 1204)}KB`);
			}
		}

		this.emit('end');
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/task.ts]---
Location: vscode-main/build/lib/task.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fancyLog from 'fancy-log';
import ansiColors from 'ansi-colors';

export interface BaseTask {
	displayName?: string;
	taskName?: string;
	_tasks?: Task[];
}
export interface PromiseTask extends BaseTask {
	(): Promise<void>;
}
export interface StreamTask extends BaseTask {
	(): NodeJS.ReadWriteStream;
}
export interface CallbackTask extends BaseTask {
	(cb?: (err?: Error) => void): void;
}

export type Task = PromiseTask | StreamTask | CallbackTask;

function _isPromise(p: Promise<void> | NodeJS.ReadWriteStream): p is Promise<void> {
	return typeof (p as Promise<void>).then === 'function';
}

function _renderTime(time: number): string {
	return `${Math.round(time)} ms`;
}

async function _execute(task: Task): Promise<void> {
	const name = task.taskName || task.displayName || `<anonymous>`;
	if (!task._tasks) {
		fancyLog('Starting', ansiColors.cyan(name), '...');
	}
	const startTime = process.hrtime();
	await _doExecute(task);
	const elapsedArr = process.hrtime(startTime);
	const elapsedNanoseconds = (elapsedArr[0] * 1e9 + elapsedArr[1]);
	if (!task._tasks) {
		fancyLog(`Finished`, ansiColors.cyan(name), 'after', ansiColors.magenta(_renderTime(elapsedNanoseconds / 1e6)));
	}
}

async function _doExecute(task: Task): Promise<void> {
	// Always invoke as if it were a callback task
	return new Promise((resolve, reject) => {
		if (task.length === 1) {
			// this is a callback task
			task((err) => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
			return;
		}

		const taskResult = task();

		if (typeof taskResult === 'undefined') {
			// this is a sync task
			resolve();
			return;
		}

		if (_isPromise(taskResult)) {
			// this is a promise returning task
			taskResult.then(resolve, reject);
			return;
		}

		// this is a stream returning task
		taskResult.on('end', _ => resolve());
		taskResult.on('error', err => reject(err));
	});
}

export function series(...tasks: Task[]): PromiseTask {
	const result = async () => {
		for (let i = 0; i < tasks.length; i++) {
			await _execute(tasks[i]);
		}
	};
	result._tasks = tasks;
	return result;
}

export function parallel(...tasks: Task[]): PromiseTask {
	const result = async () => {
		await Promise.all(tasks.map(t => _execute(t)));
	};
	result._tasks = tasks;
	return result;
}

export function define(name: string, task: Task): Task {
	if (task._tasks) {
		// This is a composite task
		const lastTask = task._tasks[task._tasks.length - 1];

		if (lastTask._tasks || lastTask.taskName) {
			// This is a composite task without a real task function
			// => generate a fake task function
			return define(name, series(task, () => Promise.resolve()));
		}

		lastTask.taskName = name;
		task.displayName = name;
		return task;
	}

	// This is a simple task
	task.taskName = name;
	task.displayName = name;
	return task;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/treeshaking.ts]---
Location: vscode-main/build/lib/treeshaking.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';
import { type IFileMap, TypeScriptLanguageServiceHost } from './typeScriptLanguageServiceHost.ts';

const ShakeLevel = Object.freeze({
	Files: 0,
	InnerFile: 1,
	ClassMembers: 2
});

type ShakeLevel = typeof ShakeLevel[keyof typeof ShakeLevel];

export function toStringShakeLevel(shakeLevel: ShakeLevel): string {
	switch (shakeLevel) {
		case ShakeLevel.Files:
			return 'Files (0)';
		case ShakeLevel.InnerFile:
			return 'InnerFile (1)';
		case ShakeLevel.ClassMembers:
			return 'ClassMembers (2)';
	}
}

export interface ITreeShakingOptions {
	/**
	 * The full path to the root where sources are.
	 */
	sourcesRoot: string;
	/**
	 * Module ids.
	 * e.g. `vs/editor/editor.main` or `index`
	 */
	entryPoints: string[];
	/**
	 * Inline usages.
	 */
	inlineEntryPoints: string[];
	/**
	 * Other .d.ts files
	 */
	typings: string[];
	/**
	 * TypeScript compiler options.
	 */
	compilerOptions?: any;
	/**
	 * The shake level to perform.
	 */
	shakeLevel: ShakeLevel;
	/**
	 * regex pattern to ignore certain imports e.g. `.css` imports
	 */
	importIgnorePattern: RegExp;
}

export interface ITreeShakingResult {
	[file: string]: string;
}

function printDiagnostics(options: ITreeShakingOptions, diagnostics: ReadonlyArray<ts.Diagnostic>): void {
	for (const diag of diagnostics) {
		let result = '';
		if (diag.file) {
			result += `${path.join(options.sourcesRoot, diag.file.fileName)}`;
		}
		if (diag.file && diag.start) {
			const location = diag.file.getLineAndCharacterOfPosition(diag.start);
			result += `:${location.line + 1}:${location.character}`;
		}
		result += ` - ` + JSON.stringify(diag.messageText);
		console.log(result);
	}
}

export function shake(options: ITreeShakingOptions): ITreeShakingResult {
	const languageService = createTypeScriptLanguageService(ts, options);
	const program = languageService.getProgram()!;

	const globalDiagnostics = program.getGlobalDiagnostics();
	if (globalDiagnostics.length > 0) {
		printDiagnostics(options, globalDiagnostics);
		throw new Error(`Compilation Errors encountered.`);
	}

	const syntacticDiagnostics = program.getSyntacticDiagnostics();
	if (syntacticDiagnostics.length > 0) {
		printDiagnostics(options, syntacticDiagnostics);
		throw new Error(`Compilation Errors encountered.`);
	}

	const semanticDiagnostics = program.getSemanticDiagnostics();
	if (semanticDiagnostics.length > 0) {
		printDiagnostics(options, semanticDiagnostics);
		throw new Error(`Compilation Errors encountered.`);
	}

	markNodes(ts, languageService, options);

	return generateResult(ts, languageService, options.shakeLevel);
}

//#region Discovery, LanguageService & Setup
function createTypeScriptLanguageService(ts: typeof import('typescript'), options: ITreeShakingOptions): ts.LanguageService {
	// Discover referenced files
	const FILES: IFileMap = new Map();

	// Add entrypoints
	options.entryPoints.forEach(entryPoint => {
		const filePath = path.join(options.sourcesRoot, entryPoint);
		FILES.set(path.normalize(filePath), fs.readFileSync(filePath).toString());
	});

	// Add fake usage files
	options.inlineEntryPoints.forEach((inlineEntryPoint, index) => {
		FILES.set(path.normalize(path.join(options.sourcesRoot, `inlineEntryPoint.${index}.ts`)), inlineEntryPoint);
	});

	// Add additional typings
	options.typings.forEach((typing) => {
		const filePath = path.join(options.sourcesRoot, typing);
		FILES.set(path.normalize(filePath), fs.readFileSync(filePath).toString());
	});

	const basePath = path.join(options.sourcesRoot, '..');
	const compilerOptions = ts.convertCompilerOptionsFromJson(options.compilerOptions, basePath).options;
	const host = new TypeScriptLanguageServiceHost(ts, FILES, compilerOptions);
	return ts.createLanguageService(host);
}

//#endregion

//#region Tree Shaking

const NodeColor = Object.freeze({
	White: 0,
	Gray: 1,
	Black: 2
});
type NodeColor = typeof NodeColor[keyof typeof NodeColor];

type ObjectLiteralElementWithName = ts.ObjectLiteralElement & { name: ts.PropertyName; parent: ts.ObjectLiteralExpression | ts.JsxAttributes };

declare module 'typescript' {
	interface Node {
		$$$color?: NodeColor;
		$$$neededSourceFile?: boolean;
		symbol?: ts.Symbol;
	}

	function getContainingObjectLiteralElement(node: ts.Node): ObjectLiteralElementWithName | undefined;
	function getNameFromPropertyName(name: ts.PropertyName): string | undefined;
	function getPropertySymbolsFromContextualType(node: ObjectLiteralElementWithName, checker: ts.TypeChecker, contextualType: ts.Type, unionSymbolOk: boolean): ReadonlyArray<ts.Symbol>;
}

function getColor(node: ts.Node): NodeColor {
	return node.$$$color || NodeColor.White;
}
function setColor(node: ts.Node, color: NodeColor): void {
	node.$$$color = color;
}
function markNeededSourceFile(node: ts.SourceFile): void {
	node.$$$neededSourceFile = true;
}
function isNeededSourceFile(node: ts.SourceFile): boolean {
	return Boolean(node.$$$neededSourceFile);
}
function nodeOrParentIsBlack(node: ts.Node): boolean {
	while (node) {
		const color = getColor(node);
		if (color === NodeColor.Black) {
			return true;
		}
		node = node.parent;
	}
	return false;
}
function nodeOrChildIsBlack(node: ts.Node): boolean {
	if (getColor(node) === NodeColor.Black) {
		return true;
	}
	for (const child of node.getChildren()) {
		if (nodeOrChildIsBlack(child)) {
			return true;
		}
	}
	return false;
}

function isSymbolWithDeclarations(symbol: ts.Symbol | undefined | null): symbol is ts.Symbol & { declarations: ts.Declaration[] } {
	return !!(symbol && symbol.declarations);
}

function isVariableStatementWithSideEffects(ts: typeof import('typescript'), node: ts.Node): boolean {
	if (!ts.isVariableStatement(node)) {
		return false;
	}
	let hasSideEffects = false;
	const visitNode = (node: ts.Node) => {
		if (hasSideEffects) {
			// no need to go on
			return;
		}
		if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
			// TODO: assuming `createDecorator` and `refineServiceDecorator` calls are side-effect free
			const isSideEffectFree = /(createDecorator|refineServiceDecorator)/.test(node.expression.getText());
			if (!isSideEffectFree) {
				hasSideEffects = true;
			}
		}
		node.forEachChild(visitNode);
	};
	node.forEachChild(visitNode);
	return hasSideEffects;
}

function isStaticMemberWithSideEffects(ts: typeof import('typescript'), node: ts.ClassElement | ts.TypeElement): boolean {
	if (!ts.isPropertyDeclaration(node)) {
		return false;
	}
	if (!node.modifiers) {
		return false;
	}
	if (!node.modifiers.some(mod => mod.kind === ts.SyntaxKind.StaticKeyword)) {
		return false;
	}
	let hasSideEffects = false;
	const visitNode = (node: ts.Node) => {
		if (hasSideEffects) {
			// no need to go on
			return;
		}
		if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
			hasSideEffects = true;
		}
		node.forEachChild(visitNode);
	};
	node.forEachChild(visitNode);
	return hasSideEffects;
}

function markNodes(ts: typeof import('typescript'), languageService: ts.LanguageService, options: ITreeShakingOptions) {
	const program = languageService.getProgram();
	if (!program) {
		throw new Error('Could not get program from language service');
	}

	if (options.shakeLevel === ShakeLevel.Files) {
		// Mark all source files Black
		program.getSourceFiles().forEach((sourceFile) => {
			setColor(sourceFile, NodeColor.Black);
		});
		return;
	}

	const black_queue: ts.Node[] = [];
	const gray_queue: ts.Node[] = [];
	const export_import_queue: ts.Node[] = [];
	const sourceFilesLoaded: { [fileName: string]: boolean } = {};

	function enqueueTopLevelModuleStatements(sourceFile: ts.SourceFile): void {

		sourceFile.forEachChild((node: ts.Node) => {

			if (ts.isImportDeclaration(node)) {
				if (!node.importClause && ts.isStringLiteral(node.moduleSpecifier)) {
					setColor(node, NodeColor.Black);
					enqueueImport(node, node.moduleSpecifier.text);
				}
				return;
			}

			if (ts.isExportDeclaration(node)) {
				if (!node.exportClause && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
					// export * from "foo";
					setColor(node, NodeColor.Black);
					enqueueImport(node, node.moduleSpecifier.text);
				}
				if (node.exportClause && ts.isNamedExports(node.exportClause)) {
					for (const exportSpecifier of node.exportClause.elements) {
						export_import_queue.push(exportSpecifier);
					}
				}
				return;
			}

			if (isVariableStatementWithSideEffects(ts, node)) {
				enqueue_black(node);
			}

			if (
				ts.isExpressionStatement(node)
				|| ts.isIfStatement(node)
				|| ts.isIterationStatement(node, true)
				|| ts.isExportAssignment(node)
			) {
				enqueue_black(node);
			}

			if (ts.isImportEqualsDeclaration(node)) {
				if (/export/.test(node.getFullText(sourceFile))) {
					// e.g. "export import Severity = BaseSeverity;"
					enqueue_black(node);
				}
			}

		});
	}

	/**
	 * Return the parent of `node` which is an ImportDeclaration
	 */
	function findParentImportDeclaration(node: ts.Declaration): ts.ImportDeclaration | null {
		let _node: ts.Node = node;
		do {
			if (ts.isImportDeclaration(_node)) {
				return _node;
			}
			_node = _node.parent;
		} while (_node);
		return null;
	}

	function enqueue_gray(node: ts.Node): void {
		if (nodeOrParentIsBlack(node) || getColor(node) === NodeColor.Gray) {
			return;
		}
		setColor(node, NodeColor.Gray);
		gray_queue.push(node);
	}

	function enqueue_black(node: ts.Node): void {
		const previousColor = getColor(node);

		if (previousColor === NodeColor.Black) {
			return;
		}

		if (previousColor === NodeColor.Gray) {
			// remove from gray queue
			gray_queue.splice(gray_queue.indexOf(node), 1);
			setColor(node, NodeColor.White);

			// add to black queue
			enqueue_black(node);

			// move from one queue to the other
			// black_queue.push(node);
			// setColor(node, NodeColor.Black);
			return;
		}

		if (nodeOrParentIsBlack(node)) {
			return;
		}

		const fileName = node.getSourceFile().fileName;
		if (/^defaultLib:/.test(fileName) || /\.d\.ts$/.test(fileName)) {
			setColor(node, NodeColor.Black);
			return;
		}

		const sourceFile = node.getSourceFile();
		if (!sourceFilesLoaded[sourceFile.fileName]) {
			sourceFilesLoaded[sourceFile.fileName] = true;
			enqueueTopLevelModuleStatements(sourceFile);
		}

		if (ts.isSourceFile(node)) {
			return;
		}

		setColor(node, NodeColor.Black);
		black_queue.push(node);

		if (options.shakeLevel === ShakeLevel.ClassMembers && (ts.isMethodDeclaration(node) || ts.isMethodSignature(node) || ts.isPropertySignature(node) || ts.isPropertyDeclaration(node) || ts.isGetAccessor(node) || ts.isSetAccessor(node))) {
			const references = languageService.getReferencesAtPosition(node.getSourceFile().fileName, node.name.pos + node.name.getLeadingTriviaWidth());
			if (references) {
				for (let i = 0, len = references.length; i < len; i++) {
					const reference = references[i];
					const referenceSourceFile = program!.getSourceFile(reference.fileName);
					if (!referenceSourceFile) {
						continue;
					}

					const referenceNode = getTokenAtPosition(ts, referenceSourceFile, reference.textSpan.start, false, false);
					if (
						ts.isMethodDeclaration(referenceNode.parent)
						|| ts.isPropertyDeclaration(referenceNode.parent)
						|| ts.isGetAccessor(referenceNode.parent)
						|| ts.isSetAccessor(referenceNode.parent)
					) {
						enqueue_gray(referenceNode.parent);
					}
				}
			}
		}
	}

	function enqueueFile(filename: string): void {
		const sourceFile = program!.getSourceFile(filename);
		if (!sourceFile) {
			console.warn(`Cannot find source file ${filename}`);
			return;
		}
		// This source file should survive even if it is empty
		markNeededSourceFile(sourceFile);
		enqueue_black(sourceFile);
	}

	function enqueueImport(node: ts.Node, importText: string): void {
		if (options.importIgnorePattern.test(importText)) {
			// this import should be ignored
			return;
		}

		const nodeSourceFile = node.getSourceFile();
		let fullPath: string;
		if (/(^\.\/)|(^\.\.\/)/.test(importText)) {
			if (importText.endsWith('.js')) { // ESM: code imports require to be relative and to have a '.js' file extension
				importText = importText.substr(0, importText.length - 3);
			}
			fullPath = path.join(path.dirname(nodeSourceFile.fileName), importText);
		} else {
			fullPath = importText;
		}

		if (fs.existsSync(fullPath + '.ts')) {
			fullPath = fullPath + '.ts';
		} else {
			fullPath = fullPath + '.js';
		}

		enqueueFile(fullPath);
	}

	options.entryPoints.forEach(moduleId => enqueueFile(path.join(options.sourcesRoot, moduleId)));
	// Add fake usage files
	options.inlineEntryPoints.forEach((_, index) => enqueueFile(path.join(options.sourcesRoot, `inlineEntryPoint.${index}.ts`)));

	let step = 0;

	const checker = program.getTypeChecker();
	while (black_queue.length > 0 || gray_queue.length > 0) {
		++step;
		let node: ts.Node;

		if (step % 100 === 0) {
			console.log(`Treeshaking - ${Math.floor(100 * step / (step + black_queue.length + gray_queue.length))}% - ${step}/${step + black_queue.length + gray_queue.length} (${black_queue.length}, ${gray_queue.length})`);
		}

		if (black_queue.length === 0) {
			for (let i = 0; i < gray_queue.length; i++) {
				const node = gray_queue[i];
				const nodeParent = node.parent;
				if ((ts.isClassDeclaration(nodeParent) || ts.isInterfaceDeclaration(nodeParent)) && nodeOrChildIsBlack(nodeParent)) {
					gray_queue.splice(i, 1);
					black_queue.push(node);
					setColor(node, NodeColor.Black);
					i--;
				}
			}
		}

		if (black_queue.length > 0) {
			node = black_queue.shift()!;
		} else {
			// only gray nodes remaining...
			break;
		}
		const nodeSourceFile = node.getSourceFile();

		const loop = (node: ts.Node) => {
			const symbols = getRealNodeSymbol(ts, checker, node);
			for (const { symbol, symbolImportNode } of symbols) {
				if (symbolImportNode) {
					setColor(symbolImportNode, NodeColor.Black);
					const importDeclarationNode = findParentImportDeclaration(symbolImportNode);
					if (importDeclarationNode && ts.isStringLiteral(importDeclarationNode.moduleSpecifier)) {
						enqueueImport(importDeclarationNode, importDeclarationNode.moduleSpecifier.text);
					}
				}

				if (isSymbolWithDeclarations(symbol) && !nodeIsInItsOwnDeclaration(nodeSourceFile, node, symbol)) {
					for (let i = 0, len = symbol.declarations.length; i < len; i++) {
						const declaration = symbol.declarations[i];
						if (ts.isSourceFile(declaration)) {
							// Do not enqueue full source files
							// (they can be the declaration of a module import)
							continue;
						}

						if (options.shakeLevel === ShakeLevel.ClassMembers && (ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration)) && !isLocalCodeExtendingOrInheritingFromDefaultLibSymbol(ts, program, checker, declaration)) {
							enqueue_black(declaration.name!);

							for (let j = 0; j < declaration.members.length; j++) {
								const member = declaration.members[j];
								const memberName = member.name ? member.name.getText() : null;
								if (
									ts.isConstructorDeclaration(member)
									|| ts.isConstructSignatureDeclaration(member)
									|| ts.isIndexSignatureDeclaration(member)
									|| ts.isCallSignatureDeclaration(member)
									|| memberName === '[Symbol.iterator]'
									|| memberName === '[Symbol.toStringTag]'
									|| memberName === 'toJSON'
									|| memberName === 'toString'
									|| memberName === 'dispose'// TODO: keeping all `dispose` methods
									|| /^_(.*)Brand$/.test(memberName || '') // TODO: keeping all members ending with `Brand`...
								) {
									enqueue_black(member);
								}

								if (isStaticMemberWithSideEffects(ts, member)) {
									enqueue_black(member);
								}
							}

							// queue the heritage clauses
							if (declaration.heritageClauses) {
								for (const heritageClause of declaration.heritageClauses) {
									enqueue_black(heritageClause);
								}
							}
						} else {
							enqueue_black(declaration);
						}
					}
				}
			}
			node.forEachChild(loop);
		};
		node.forEachChild(loop);
	}

	while (export_import_queue.length > 0) {
		const node = export_import_queue.shift()!;
		if (nodeOrParentIsBlack(node)) {
			continue;
		}
		if (!node.symbol) {
			continue;
		}
		const aliased = checker.getAliasedSymbol(node.symbol);
		if (aliased.declarations && aliased.declarations.length > 0) {
			if (nodeOrParentIsBlack(aliased.declarations[0]) || nodeOrChildIsBlack(aliased.declarations[0])) {
				setColor(node, NodeColor.Black);
			}
		}
	}
}

function nodeIsInItsOwnDeclaration(nodeSourceFile: ts.SourceFile, node: ts.Node, symbol: ts.Symbol & { declarations: ts.Declaration[] }): boolean {
	for (let i = 0, len = symbol.declarations.length; i < len; i++) {
		const declaration = symbol.declarations[i];
		const declarationSourceFile = declaration.getSourceFile();

		if (nodeSourceFile === declarationSourceFile) {
			if (declaration.pos <= node.pos && node.end <= declaration.end) {
				return true;
			}
		}
	}

	return false;
}

function generateResult(ts: typeof import('typescript'), languageService: ts.LanguageService, shakeLevel: ShakeLevel): ITreeShakingResult {
	const program = languageService.getProgram();
	if (!program) {
		throw new Error('Could not get program from language service');
	}

	const result: ITreeShakingResult = {};
	const writeFile = (filePath: string, contents: string): void => {
		result[filePath] = contents;
	};

	program.getSourceFiles().forEach((sourceFile) => {
		const fileName = sourceFile.fileName;
		if (/^defaultLib:/.test(fileName)) {
			return;
		}
		const destination = fileName;
		if (/\.d\.ts$/.test(fileName)) {
			if (nodeOrChildIsBlack(sourceFile)) {
				writeFile(destination, sourceFile.text);
			}
			return;
		}

		const text = sourceFile.text;
		let result = '';

		function keep(node: ts.Node): void {
			result += text.substring(node.pos, node.end);
		}
		function write(data: string): void {
			result += data;
		}

		function writeMarkedNodes(node: ts.Node): void {
			if (getColor(node) === NodeColor.Black) {
				return keep(node);
			}

			// Always keep certain top-level statements
			if (ts.isSourceFile(node.parent)) {
				if (ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression) && node.expression.text === 'use strict') {
					return keep(node);
				}

				if (ts.isVariableStatement(node) && nodeOrChildIsBlack(node)) {
					return keep(node);
				}
			}

			// Keep the entire import in import * as X cases
			if (ts.isImportDeclaration(node)) {
				if (node.importClause && node.importClause.namedBindings) {
					if (ts.isNamespaceImport(node.importClause.namedBindings)) {
						if (getColor(node.importClause.namedBindings) === NodeColor.Black) {
							return keep(node);
						}
					} else {
						const survivingImports: string[] = [];
						for (const importNode of node.importClause.namedBindings.elements) {
							if (getColor(importNode) === NodeColor.Black) {
								survivingImports.push(importNode.getFullText(sourceFile));
							}
						}
						const leadingTriviaWidth = node.getLeadingTriviaWidth();
						const leadingTrivia = sourceFile.text.substr(node.pos, leadingTriviaWidth);
						if (survivingImports.length > 0) {
							if (node.importClause && node.importClause.name && getColor(node.importClause) === NodeColor.Black) {
								return write(`${leadingTrivia}import ${node.importClause.name.text}, {${survivingImports.join(',')} } from${node.moduleSpecifier.getFullText(sourceFile)};`);
							}
							return write(`${leadingTrivia}import {${survivingImports.join(',')} } from${node.moduleSpecifier.getFullText(sourceFile)};`);
						} else {
							if (node.importClause && node.importClause.name && getColor(node.importClause) === NodeColor.Black) {
								return write(`${leadingTrivia}import ${node.importClause.name.text} from${node.moduleSpecifier.getFullText(sourceFile)};`);
							}
						}
					}
				} else {
					if (node.importClause && getColor(node.importClause) === NodeColor.Black) {
						return keep(node);
					}
				}
			}

			if (ts.isExportDeclaration(node)) {
				if (node.exportClause && node.moduleSpecifier && ts.isNamedExports(node.exportClause)) {
					const survivingExports: string[] = [];
					for (const exportSpecifier of node.exportClause.elements) {
						if (getColor(exportSpecifier) === NodeColor.Black) {
							survivingExports.push(exportSpecifier.getFullText(sourceFile));
						}
					}
					const leadingTriviaWidth = node.getLeadingTriviaWidth();
					const leadingTrivia = sourceFile.text.substr(node.pos, leadingTriviaWidth);
					if (survivingExports.length > 0) {
						return write(`${leadingTrivia}export {${survivingExports.join(',')} } from${node.moduleSpecifier.getFullText(sourceFile)};`);
					}
				}
			}

			if (shakeLevel === ShakeLevel.ClassMembers && (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) && nodeOrChildIsBlack(node)) {
				let toWrite = node.getFullText();
				for (let i = node.members.length - 1; i >= 0; i--) {
					const member = node.members[i];
					if (getColor(member) === NodeColor.Black || !member.name) {
						// keep method
						continue;
					}

					const pos = member.pos - node.pos;
					const end = member.end - node.pos;
					toWrite = toWrite.substring(0, pos) + toWrite.substring(end);
				}
				return write(toWrite);
			}

			if (ts.isFunctionDeclaration(node)) {
				// Do not go inside functions if they haven't been marked
				return;
			}

			node.forEachChild(writeMarkedNodes);
		}

		if (getColor(sourceFile) !== NodeColor.Black) {
			if (!nodeOrChildIsBlack(sourceFile)) {
				// none of the elements are reachable
				if (isNeededSourceFile(sourceFile)) {
					// this source file must be written, even if nothing is used from it
					// because there is an import somewhere for it.
					// However, TS complains with empty files with the error "x" is not a module,
					// so we will export a dummy variable
					result = 'export const __dummy = 0;';
				} else {
					// don't write this file at all!
					return;
				}
			} else {
				sourceFile.forEachChild(writeMarkedNodes);
				result += sourceFile.endOfFileToken.getFullText(sourceFile);
			}
		} else {
			result = text;
		}

		writeFile(destination, result);
	});

	return result;
}

//#endregion

//#region Utils

function isLocalCodeExtendingOrInheritingFromDefaultLibSymbol(ts: typeof import('typescript'), program: ts.Program, checker: ts.TypeChecker, declaration: ts.ClassDeclaration | ts.InterfaceDeclaration): boolean {
	if (!program.isSourceFileDefaultLibrary(declaration.getSourceFile()) && declaration.heritageClauses) {
		for (const heritageClause of declaration.heritageClauses) {
			for (const type of heritageClause.types) {
				const symbol = findSymbolFromHeritageType(ts, checker, type);
				if (symbol) {
					const decl = symbol.valueDeclaration || (symbol.declarations && symbol.declarations[0]);
					if (decl && program.isSourceFileDefaultLibrary(decl.getSourceFile())) {
						return true;
					}
				}
			}
		}
	}
	return false;
}

function findSymbolFromHeritageType(ts: typeof import('typescript'), checker: ts.TypeChecker, type: ts.ExpressionWithTypeArguments | ts.Expression | ts.PrivateIdentifier): ts.Symbol | null {
	if (ts.isExpressionWithTypeArguments(type)) {
		return findSymbolFromHeritageType(ts, checker, type.expression);
	}
	if (ts.isIdentifier(type)) {
		const tmp = getRealNodeSymbol(ts, checker, type);
		return (tmp.length > 0 ? tmp[0].symbol : null);
	}
	if (ts.isPropertyAccessExpression(type)) {
		return findSymbolFromHeritageType(ts, checker, type.name);
	}
	return null;
}

class SymbolImportTuple {
	public readonly symbol: ts.Symbol | null;
	public readonly symbolImportNode: ts.Declaration | null;

	constructor(
		symbol: ts.Symbol | null,
		symbolImportNode: ts.Declaration | null
	) {
		this.symbol = symbol;
		this.symbolImportNode = symbolImportNode;
	}
}

/**
 * Returns the node's symbol and the `import` node (if the symbol resolved from a different module)
 */
function getRealNodeSymbol(ts: typeof import('typescript'), checker: ts.TypeChecker, node: ts.Node): SymbolImportTuple[] {

	// Go to the original declaration for cases:
	//
	//   (1) when the aliased symbol was declared in the location(parent).
	//   (2) when the aliased symbol is originating from an import.
	//
	function shouldSkipAlias(node: ts.Node, declaration: ts.Node): boolean {
		if (!ts.isShorthandPropertyAssignment(node) && node.kind !== ts.SyntaxKind.Identifier) {
			return false;
		}
		if (node.parent === declaration) {
			return true;
		}
		switch (declaration.kind) {
			case ts.SyntaxKind.ImportClause:
			case ts.SyntaxKind.ImportEqualsDeclaration:
				return true;
			case ts.SyntaxKind.ImportSpecifier:
				return declaration.parent.kind === ts.SyntaxKind.NamedImports;
			default:
				return false;
		}
	}

	if (!ts.isShorthandPropertyAssignment(node)) {
		if (node.getChildCount() !== 0) {
			return [];
		}
	}

	const { parent } = node;

	let symbol = (
		ts.isShorthandPropertyAssignment(node)
			? checker.getShorthandAssignmentValueSymbol(node)
			: checker.getSymbolAtLocation(node)
	);

	let importNode: ts.Declaration | null = null;
	// If this is an alias, and the request came at the declaration location
	// get the aliased symbol instead. This allows for goto def on an import e.g.
	//   import {A, B} from "mod";
	// to jump to the implementation directly.
	if (symbol && symbol.flags & ts.SymbolFlags.Alias && symbol.declarations && shouldSkipAlias(node, symbol.declarations[0])) {
		const aliased = checker.getAliasedSymbol(symbol);
		if (aliased.declarations) {
			// We should mark the import as visited
			importNode = symbol.declarations[0];
			symbol = aliased;
		}
	}

	if (symbol) {
		// Because name in short-hand property assignment has two different meanings: property name and property value,
		// using go-to-definition at such position should go to the variable declaration of the property value rather than
		// go to the declaration of the property name (in this case stay at the same position). However, if go-to-definition
		// is performed at the location of property access, we would like to go to definition of the property in the short-hand
		// assignment. This case and others are handled by the following code.
		if (node.parent.kind === ts.SyntaxKind.ShorthandPropertyAssignment) {
			symbol = checker.getShorthandAssignmentValueSymbol(symbol.valueDeclaration);
		}

		// If the node is the name of a BindingElement within an ObjectBindingPattern instead of just returning the
		// declaration the symbol (which is itself), we should try to get to the original type of the ObjectBindingPattern
		// and return the property declaration for the referenced property.
		// For example:
		//      import('./foo').then(({ b/*goto*/ar }) => undefined); => should get use to the declaration in file "./foo"
		//
		//      function bar<T>(onfulfilled: (value: T) => void) { //....}
		//      interface Test {
		//          pr/*destination*/op1: number
		//      }
		//      bar<Test>(({pr/*goto*/op1})=>{});
		if (ts.isPropertyName(node) && ts.isBindingElement(parent) && ts.isObjectBindingPattern(parent.parent) &&
			(node === (parent.propertyName || parent.name))) {
			const name = ts.getNameFromPropertyName(node);
			const type = checker.getTypeAtLocation(parent.parent);
			if (name && type) {
				if (type.isUnion()) {
					return generateMultipleSymbols(type, name, importNode);
				} else {
					const prop = type.getProperty(name);
					if (prop) {
						symbol = prop;
					}
				}
			}
		}

		// If the current location we want to find its definition is in an object literal, try to get the contextual type for the
		// object literal, lookup the property symbol in the contextual type, and use this for goto-definition.
		// For example
		//      interface Props{
		//          /*first*/prop1: number
		//          prop2: boolean
		//      }
		//      function Foo(arg: Props) {}
		//      Foo( { pr/*1*/op1: 10, prop2: false })
		const element = ts.getContainingObjectLiteralElement(node);
		if (element) {
			const contextualType = element && checker.getContextualType(element.parent);
			if (contextualType) {
				const propertySymbols = ts.getPropertySymbolsFromContextualType(element, checker, contextualType, /*unionSymbolOk*/ false);
				if (propertySymbols) {
					symbol = propertySymbols[0];
				}
			}
		}
	}

	if (symbol && symbol.declarations) {
		return [new SymbolImportTuple(symbol, importNode)];
	}

	return [];

	function generateMultipleSymbols(type: ts.UnionType, name: string, importNode: ts.Declaration | null): SymbolImportTuple[] {
		const result: SymbolImportTuple[] = [];
		for (const t of type.types) {
			const prop = t.getProperty(name);
			if (prop && prop.declarations) {
				result.push(new SymbolImportTuple(prop, importNode));
			}
		}
		return result;
	}
}

/** Get the token whose text contains the position */
function getTokenAtPosition(ts: typeof import('typescript'), sourceFile: ts.SourceFile, position: number, allowPositionInLeadingTrivia: boolean, includeEndPosition: boolean): ts.Node {
	let current: ts.Node = sourceFile;
	outer: while (true) {
		// find the child that contains 'position'
		for (const child of current.getChildren()) {
			const start = allowPositionInLeadingTrivia ? child.getFullStart() : child.getStart(sourceFile, /*includeJsDoc*/ true);
			if (start > position) {
				// If this child begins after position, then all subsequent children will as well.
				break;
			}

			const end = child.getEnd();
			if (position < end || (position === end && (child.kind === ts.SyntaxKind.EndOfFileToken || includeEndPosition))) {
				current = child;
				continue outer;
			}
		}

		return current;
	}
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: build/lib/tsconfigUtils.ts]---
Location: vscode-main/build/lib/tsconfigUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { dirname } from 'path';
import ts from 'typescript';

/**
 * Get the target (e.g. 'ES2024') from a tsconfig.json file.
 */
export function getTargetStringFromTsConfig(configFilePath: string): string {
	const parsed = ts.readConfigFile(configFilePath, ts.sys.readFile);
	if (parsed.error) {
		throw new Error(`Cannot determine target from ${configFilePath}. TS error: ${parsed.error.messageText}`);
	}

	const cmdLine = ts.parseJsonConfigFileContent(parsed.config, ts.sys, dirname(configFilePath), {});
	const resolved = typeof cmdLine.options.target !== 'undefined' ? ts.ScriptTarget[cmdLine.options.target] : undefined;
	if (!resolved) {
		throw new Error(`Could not resolve target in ${configFilePath}`);
	}
	return resolved;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typeScriptLanguageServiceHost.ts]---
Location: vscode-main/build/lib/typeScriptLanguageServiceHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ts from 'typescript';
import fs from 'node:fs';
import { normalize } from 'node:path';

export type IFileMap = Map</*fileName*/ string, string>;

function normalizePath(filePath: string): string {
	return normalize(filePath);
}

/**
 * A TypeScript language service host
 */
export class TypeScriptLanguageServiceHost implements ts.LanguageServiceHost {

	private readonly ts: typeof import('typescript');
	private readonly topLevelFiles: IFileMap;
	private readonly compilerOptions: ts.CompilerOptions;

	constructor(
		ts: typeof import('typescript'),
		topLevelFiles: IFileMap,
		compilerOptions: ts.CompilerOptions,
	) {
		this.ts = ts;
		this.topLevelFiles = topLevelFiles;
		this.compilerOptions = compilerOptions;
	}

	// --- language service host ---------------
	getCompilationSettings(): ts.CompilerOptions {
		return this.compilerOptions;
	}
	getScriptFileNames(): string[] {
		return [
			...this.topLevelFiles.keys(),
			this.ts.getDefaultLibFilePath(this.compilerOptions)
		];
	}
	getScriptVersion(_fileName: string): string {
		return '1';
	}
	getProjectVersion(): string {
		return '1';
	}
	getScriptSnapshot(fileName: string): ts.IScriptSnapshot {
		fileName = normalizePath(fileName);

		if (this.topLevelFiles.has(fileName)) {
			return this.ts.ScriptSnapshot.fromString(this.topLevelFiles.get(fileName)!);
		} else {
			return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
		}
	}
	getScriptKind(_fileName: string): ts.ScriptKind {
		return this.ts.ScriptKind.TS;
	}
	getCurrentDirectory(): string {
		return '';
	}
	getDefaultLibFileName(options: ts.CompilerOptions): string {
		return this.ts.getDefaultLibFilePath(options);
	}
	readFile(path: string, encoding?: string): string | undefined {
		path = normalizePath(path);

		if (this.topLevelFiles.get(path)) {
			return this.topLevelFiles.get(path);
		}
		return ts.sys.readFile(path, encoding);
	}
	fileExists(path: string): boolean {
		path = normalizePath(path);

		if (this.topLevelFiles.has(path)) {
			return true;
		}
		return ts.sys.fileExists(path);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/util.ts]---
Location: vscode-main/build/lib/util.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import es from 'event-stream';
import _debounce from 'debounce';
import _filter from 'gulp-filter';
import rename from 'gulp-rename';
import path from 'path';
import fs from 'fs';
import _rimraf from 'rimraf';
import VinylFile from 'vinyl';
import through from 'through';
import sm from 'source-map';
import { pathToFileURL } from 'url';
import ternaryStream from 'ternary-stream';

const root = path.dirname(path.dirname(import.meta.dirname));

export interface ICancellationToken {
	isCancellationRequested(): boolean;
}

const NoCancellationToken: ICancellationToken = { isCancellationRequested: () => false };

export interface IStreamProvider {
	(cancellationToken?: ICancellationToken): NodeJS.ReadWriteStream;
}

export function incremental(streamProvider: IStreamProvider, initial: NodeJS.ReadWriteStream, supportsCancellation?: boolean): NodeJS.ReadWriteStream {
	const input = es.through();
	const output = es.through();
	let state = 'idle';
	let buffer = Object.create(null);

	const token: ICancellationToken | undefined = !supportsCancellation ? undefined : { isCancellationRequested: () => Object.keys(buffer).length > 0 };

	const run = (input: NodeJS.ReadWriteStream, isCancellable: boolean) => {
		state = 'running';

		const stream = !supportsCancellation ? streamProvider() : streamProvider(isCancellable ? token : NoCancellationToken);

		input
			.pipe(stream)
			.pipe(es.through(undefined, () => {
				state = 'idle';
				eventuallyRun();
			}))
			.pipe(output);
	};

	if (initial) {
		run(initial, false);
	}

	const eventuallyRun = _debounce(() => {
		const paths = Object.keys(buffer);

		if (paths.length === 0) {
			return;
		}

		const data = paths.map(path => buffer[path]);
		buffer = Object.create(null);
		run(es.readArray(data), true);
	}, 500);

	input.on('data', (f: any) => {
		buffer[f.path] = f;

		if (state === 'idle') {
			eventuallyRun();
		}
	});

	return es.duplex(input, output);
}

export function debounce(task: () => NodeJS.ReadWriteStream, duration = 500): NodeJS.ReadWriteStream {
	const input = es.through();
	const output = es.through();
	let state = 'idle';

	const run = () => {
		state = 'running';

		task()
			.pipe(es.through(undefined, () => {
				const shouldRunAgain = state === 'stale';
				state = 'idle';

				if (shouldRunAgain) {
					eventuallyRun();
				}
			}))
			.pipe(output);
	};

	run();

	const eventuallyRun = _debounce(() => run(), duration);

	input.on('data', () => {
		if (state === 'idle') {
			eventuallyRun();
		} else {
			state = 'stale';
		}
	});

	return es.duplex(input, output);
}

export function fixWin32DirectoryPermissions(): NodeJS.ReadWriteStream {
	if (!/win32/.test(process.platform)) {
		return es.through();
	}

	return es.mapSync<VinylFile, VinylFile>(f => {
		if (f.stat && f.stat.isDirectory && f.stat.isDirectory()) {
			f.stat.mode = 16877;
		}

		return f;
	});
}

export function setExecutableBit(pattern?: string | string[]): NodeJS.ReadWriteStream {
	const setBit = es.mapSync<VinylFile, VinylFile>(f => {
		if (!f.stat) {
			const stat: Pick<fs.Stats, 'isFile' | 'mode'> = { isFile() { return true; }, mode: 0 };
			f.stat = stat as fs.Stats;
		}
		f.stat!.mode = /* 100755 */ 33261;
		return f;
	});

	if (!pattern) {
		return setBit;
	}

	const input = es.through();
	const filter = _filter(pattern, { restore: true });
	const output = input
		.pipe(filter)
		.pipe(setBit)
		.pipe(filter.restore);

	return es.duplex(input, output);
}

export function toFileUri(filePath: string): string {
	const match = filePath.match(/^([a-z])\:(.*)$/i);

	if (match) {
		filePath = '/' + match[1].toUpperCase() + ':' + match[2];
	}

	return 'file://' + filePath.replace(/\\/g, '/');
}

export function skipDirectories(): NodeJS.ReadWriteStream {
	return es.mapSync<VinylFile, VinylFile | undefined>(f => {
		if (!f.isDirectory()) {
			return f;
		}
	});
}

export function cleanNodeModules(rulePath: string): NodeJS.ReadWriteStream {
	const rules = fs.readFileSync(rulePath, 'utf8')
		.split(/\r?\n/g)
		.map(line => line.trim())
		.filter(line => line && !/^#/.test(line));

	const excludes = rules.filter(line => !/^!/.test(line)).map(line => `!**/node_modules/${line}`);
	const includes = rules.filter(line => /^!/.test(line)).map(line => `**/node_modules/${line.substr(1)}`);

	const input = es.through();
	const output = es.merge(
		input.pipe(_filter(['**', ...excludes])),
		input.pipe(_filter(includes))
	);

	return es.duplex(input, output);
}

type FileSourceMap = VinylFile & { sourceMap: sm.RawSourceMap };

export function loadSourcemaps(): NodeJS.ReadWriteStream {
	const input = es.through();

	const output = input
		.pipe(es.map<FileSourceMap, FileSourceMap | undefined>((f, cb): FileSourceMap | undefined => {
			if (f.sourceMap) {
				cb(undefined, f);
				return;
			}

			if (!f.contents) {
				cb(undefined, f);
				return;
			}

			const contents = (f.contents as Buffer).toString('utf8');
			const reg = /\/\/# sourceMappingURL=(.*)$/g;
			let lastMatch: RegExpExecArray | null = null;
			let match: RegExpExecArray | null = null;

			while (match = reg.exec(contents)) {
				lastMatch = match;
			}

			if (!lastMatch) {
				f.sourceMap = {
					version: '3',
					names: [],
					mappings: '',
					sources: [f.relative.replace(/\\/g, '/')],
					sourcesContent: [contents]
				};

				cb(undefined, f);
				return;
			}

			f.contents = Buffer.from(contents.replace(/\/\/# sourceMappingURL=(.*)$/g, ''), 'utf8');

			fs.readFile(path.join(path.dirname(f.path), lastMatch[1]), 'utf8', (err, contents) => {
				if (err) { return cb(err); }

				f.sourceMap = JSON.parse(contents);
				cb(undefined, f);
			});
		}));

	return es.duplex(input, output);
}

export function stripSourceMappingURL(): NodeJS.ReadWriteStream {
	const input = es.through();

	const output = input
		.pipe(es.mapSync<VinylFile, VinylFile>(f => {
			const contents = (f.contents as Buffer).toString('utf8');
			f.contents = Buffer.from(contents.replace(/\n\/\/# sourceMappingURL=(.*)$/gm, ''), 'utf8');
			return f;
		}));

	return es.duplex(input, output);
}

/** Splits items in the stream based on the predicate, sending them to onTrue if true, or onFalse otherwise */
export function $if(test: boolean | ((f: VinylFile) => boolean), onTrue: NodeJS.ReadWriteStream, onFalse: NodeJS.ReadWriteStream = es.through()) {
	if (typeof test === 'boolean') {
		return test ? onTrue : onFalse;
	}

	return ternaryStream(test, onTrue, onFalse);
}

/** Operator that appends the js files' original path a sourceURL, so debug locations map */
export function appendOwnPathSourceURL(): NodeJS.ReadWriteStream {
	const input = es.through();

	const output = input
		.pipe(es.mapSync<VinylFile, VinylFile>(f => {
			if (!(f.contents instanceof Buffer)) {
				throw new Error(`contents of ${f.path} are not a buffer`);
			}

			f.contents = Buffer.concat([f.contents, Buffer.from(`\n//# sourceURL=${pathToFileURL(f.path)}`)]);
			return f;
		}));

	return es.duplex(input, output);
}

export function rewriteSourceMappingURL(sourceMappingURLBase: string): NodeJS.ReadWriteStream {
	const input = es.through();

	const output = input
		.pipe(es.mapSync<VinylFile, VinylFile>(f => {
			const contents = (f.contents as Buffer).toString('utf8');
			const str = `//# sourceMappingURL=${sourceMappingURLBase}/${path.dirname(f.relative).replace(/\\/g, '/')}/$1`;
			f.contents = Buffer.from(contents.replace(/\n\/\/# sourceMappingURL=(.*)$/gm, str));
			return f;
		}));

	return es.duplex(input, output);
}

export function rimraf(dir: string): () => Promise<void> {
	const result = () => new Promise<void>((c, e) => {
		let retries = 0;

		const retry = () => {
			_rimraf(dir, { maxBusyTries: 1 }, (err: any) => {
				if (!err) {
					return c();
				}

				if (err.code === 'ENOTEMPTY' && ++retries < 5) {
					return setTimeout(() => retry(), 10);
				}

				return e(err);
			});
		};

		retry();
	});

	result.taskName = `clean-${path.basename(dir).toLowerCase()}`;
	return result;
}

function _rreaddir(dirPath: string, prepend: string, result: string[]): void {
	const entries = fs.readdirSync(dirPath, { withFileTypes: true });
	for (const entry of entries) {
		if (entry.isDirectory()) {
			_rreaddir(path.join(dirPath, entry.name), `${prepend}/${entry.name}`, result);
		} else {
			result.push(`${prepend}/${entry.name}`);
		}
	}
}

export function rreddir(dirPath: string): string[] {
	const result: string[] = [];
	_rreaddir(dirPath, '', result);
	return result;
}

export function ensureDir(dirPath: string): void {
	if (fs.existsSync(dirPath)) {
		return;
	}
	ensureDir(path.dirname(dirPath));
	fs.mkdirSync(dirPath);
}

export function rebase(count: number): NodeJS.ReadWriteStream {
	return rename(f => {
		const parts = f.dirname ? f.dirname.split(/[\/\\]/) : [];
		f.dirname = parts.slice(count).join(path.sep);
	});
}

export interface FilterStream extends NodeJS.ReadWriteStream {
	restore: through.ThroughStream;
}

export function filter(fn: (data: any) => boolean): FilterStream {
	const result = es.through(function (data) {
		if (fn(data)) {
			this.emit('data', data);
		} else {
			result.restore.push(data);
		}
	}) as unknown as FilterStream;

	result.restore = es.through();
	return result;
}

export function streamToPromise(stream: NodeJS.ReadWriteStream): Promise<void> {
	return new Promise((c, e) => {
		stream.on('error', err => e(err));
		stream.on('end', () => c());
	});
}

export function getElectronVersion(): Record<string, string> {
	const npmrc = fs.readFileSync(path.join(root, '.npmrc'), 'utf8');
	const electronVersion = /^target="(.*)"$/m.exec(npmrc)![1];
	const msBuildId = /^ms_build_id="(.*)"$/m.exec(npmrc)![1];
	return { electronVersion, msBuildId };
}

export class VinylStat implements fs.Stats {

	readonly dev: number;
	readonly ino: number;
	readonly mode: number;
	readonly nlink: number;
	readonly uid: number;
	readonly gid: number;
	readonly rdev: number;
	readonly size: number;
	readonly blksize: number;
	readonly blocks: number;
	readonly atimeMs: number;
	readonly mtimeMs: number;
	readonly ctimeMs: number;
	readonly birthtimeMs: number;
	readonly atime: Date;
	readonly mtime: Date;
	readonly ctime: Date;
	readonly birthtime: Date;

	constructor(stat: Partial<fs.Stats>) {
		this.dev = stat.dev ?? 0;
		this.ino = stat.ino ?? 0;
		this.mode = stat.mode ?? 0;
		this.nlink = stat.nlink ?? 0;
		this.uid = stat.uid ?? 0;
		this.gid = stat.gid ?? 0;
		this.rdev = stat.rdev ?? 0;
		this.size = stat.size ?? 0;
		this.blksize = stat.blksize ?? 0;
		this.blocks = stat.blocks ?? 0;
		this.atimeMs = stat.atimeMs ?? 0;
		this.mtimeMs = stat.mtimeMs ?? 0;
		this.ctimeMs = stat.ctimeMs ?? 0;
		this.birthtimeMs = stat.birthtimeMs ?? 0;
		this.atime = stat.atime ?? new Date(0);
		this.mtime = stat.mtime ?? new Date(0);
		this.ctime = stat.ctime ?? new Date(0);
		this.birthtime = stat.birthtime ?? new Date(0);
	}

	isFile(): boolean { return true; }
	isDirectory(): boolean { return false; }
	isBlockDevice(): boolean { return false; }
	isCharacterDevice(): boolean { return false; }
	isSymbolicLink(): boolean { return false; }
	isFIFO(): boolean { return false; }
	isSocket(): boolean { return false; }
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/mangle/index.ts]---
Location: vscode-main/build/lib/mangle/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import v8 from 'node:v8';
import fs from 'fs';
import path from 'path';
import { type Mapping, SourceMapGenerator } from 'source-map';
import ts from 'typescript';
import { pathToFileURL } from 'url';
import workerpool from 'workerpool';
import { StaticLanguageServiceHost } from './staticLanguageServiceHost.ts';
import * as buildfile from '../../buildfile.ts';

class ShortIdent {

	private static _keywords = new Set(['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
		'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if',
		'import', 'in', 'instanceof', 'let', 'new', 'null', 'return', 'static', 'super', 'switch', 'this', 'throw',
		'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield']);

	private static _alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$_'.split('');

	private _value = 0;
	private readonly prefix: string;

	constructor(
		prefix: string
	) {
		this.prefix = prefix;
	}

	next(isNameTaken?: (name: string) => boolean): string {
		const candidate = this.prefix + ShortIdent.convert(this._value);
		this._value++;
		if (ShortIdent._keywords.has(candidate) || /^[_0-9]/.test(candidate) || isNameTaken?.(candidate)) {
			// try again
			return this.next(isNameTaken);
		}
		return candidate;
	}

	private static convert(n: number): string {
		const base = this._alphabet.length;
		let result = '';
		do {
			const rest = n % base;
			result += this._alphabet[rest];
			n = (n / base) | 0;
		} while (n > 0);
		return result;
	}
}

const FieldType = Object.freeze({
	Public: 0,
	Protected: 1,
	Private: 2
});
type FieldType = typeof FieldType[keyof typeof FieldType];

class ClassData {

	fields = new Map<string, { type: FieldType; pos: number }>();

	private replacements: Map<string, string> | undefined;

	parent: ClassData | undefined;
	children: ClassData[] | undefined;

	readonly fileName: string;
	readonly node: ts.ClassDeclaration | ts.ClassExpression;

	constructor(
		fileName: string,
		node: ts.ClassDeclaration | ts.ClassExpression,
	) {
		this.fileName = fileName;
		this.node = node;
		// analyse all fields (properties and methods). Find usages of all protected and
		// private ones and keep track of all public ones (to prevent naming collisions)

		const candidates: (ts.NamedDeclaration)[] = [];
		for (const member of node.members) {
			if (ts.isMethodDeclaration(member)) {
				// method `foo() {}`
				candidates.push(member);

			} else if (ts.isPropertyDeclaration(member)) {
				// property `foo = 234`
				candidates.push(member);

			} else if (ts.isGetAccessor(member)) {
				// getter: `get foo() { ... }`
				candidates.push(member);

			} else if (ts.isSetAccessor(member)) {
				// setter: `set foo() { ... }`
				candidates.push(member);

			} else if (ts.isConstructorDeclaration(member)) {
				// constructor-prop:`constructor(private foo) {}`
				for (const param of member.parameters) {
					if (hasModifier(param, ts.SyntaxKind.PrivateKeyword)
						|| hasModifier(param, ts.SyntaxKind.ProtectedKeyword)
						|| hasModifier(param, ts.SyntaxKind.PublicKeyword)
						|| hasModifier(param, ts.SyntaxKind.ReadonlyKeyword)
					) {
						candidates.push(param);
					}
				}
			}
		}
		for (const member of candidates) {
			const ident = ClassData._getMemberName(member);
			if (!ident) {
				continue;
			}
			const type = ClassData._getFieldType(member);
			this.fields.set(ident, { type, pos: member.name!.getStart() });
		}
	}

	private static _getMemberName(node: ts.NamedDeclaration): string | undefined {
		if (!node.name) {
			return undefined;
		}
		const { name } = node;
		let ident = name.getText();
		if (name.kind === ts.SyntaxKind.ComputedPropertyName) {
			if (name.expression.kind !== ts.SyntaxKind.StringLiteral) {
				// unsupported: [Symbol.foo] or [abc + 'field']
				return;
			}
			// ['foo']
			ident = name.expression.getText().slice(1, -1);
		}

		return ident;
	}

	private static _getFieldType(node: ts.Node): FieldType {
		if (hasModifier(node, ts.SyntaxKind.PrivateKeyword)) {
			return FieldType.Private;
		} else if (hasModifier(node, ts.SyntaxKind.ProtectedKeyword)) {
			return FieldType.Protected;
		} else {
			return FieldType.Public;
		}
	}

	static _shouldMangle(type: FieldType): boolean {
		return type === FieldType.Private
			|| type === FieldType.Protected
			;
	}

	static makeImplicitPublicActuallyPublic(data: ClassData, reportViolation: (name: string, what: string, why: string) => void): void {
		// TS-HACK
		// A subtype can make an inherited protected field public. To prevent accidential
		// mangling of public fields we mark the original (protected) fields as public...
		for (const [name, info] of data.fields) {
			if (info.type !== FieldType.Public) {
				continue;
			}
			let parent: ClassData | undefined = data.parent;
			while (parent) {
				if (parent.fields.get(name)?.type === FieldType.Protected) {
					const parentPos = parent.node.getSourceFile().getLineAndCharacterOfPosition(parent.fields.get(name)!.pos);
					const infoPos = data.node.getSourceFile().getLineAndCharacterOfPosition(info.pos);
					reportViolation(name, `'${name}' from ${parent.fileName}:${parentPos.line + 1}`, `${data.fileName}:${infoPos.line + 1}`);

					parent.fields.get(name)!.type = FieldType.Public;
				}
				parent = parent.parent;
			}
		}
	}

	static fillInReplacement(data: ClassData) {

		if (data.replacements) {
			// already done
			return;
		}

		// fill in parents first
		if (data.parent) {
			ClassData.fillInReplacement(data.parent);
		}

		data.replacements = new Map();

		const isNameTaken = (name: string) => {
			// locally taken
			if (data._isNameTaken(name)) {
				return true;
			}

			// parents
			let parent: ClassData | undefined = data.parent;
			while (parent) {
				if (parent._isNameTaken(name)) {
					return true;
				}
				parent = parent.parent;
			}

			// children
			if (data.children) {
				const stack = [...data.children];
				while (stack.length) {
					const node = stack.pop()!;
					if (node._isNameTaken(name)) {
						return true;
					}
					if (node.children) {
						stack.push(...node.children);
					}
				}
			}

			return false;
		};
		const identPool = new ShortIdent('');

		for (const [name, info] of data.fields) {
			if (ClassData._shouldMangle(info.type)) {
				const shortName = identPool.next(isNameTaken);
				data.replacements.set(name, shortName);
			}
		}
	}

	// a name is taken when a field that doesn't get mangled exists or
	// when the name is already in use for replacement
	private _isNameTaken(name: string) {
		if (this.fields.has(name) && !ClassData._shouldMangle(this.fields.get(name)!.type)) {
			// public field
			return true;
		}
		if (this.replacements) {
			for (const shortName of this.replacements.values()) {
				if (shortName === name) {
					// replaced already (happens wih super types)
					return true;
				}
			}
		}

		if (isNameTakenInFile(this.node, name)) {
			return true;
		}

		return false;
	}

	lookupShortName(name: string): string {
		let value = this.replacements!.get(name)!;
		let parent = this.parent;
		while (parent) {
			if (parent.replacements!.has(name) && parent.fields.get(name)?.type === FieldType.Protected) {
				value = parent.replacements!.get(name)! ?? value;
			}
			parent = parent.parent;
		}
		return value;
	}

	// --- parent chaining

	addChild(child: ClassData) {
		this.children ??= [];
		this.children.push(child);
		child.parent = this;
	}
}

declare module 'typescript' {
	interface SourceFile {
		identifiers?: Map<string, true>;
	}
}

function isNameTakenInFile(node: ts.Node, name: string): boolean {
	const identifiers = node.getSourceFile().identifiers;
	if (identifiers instanceof Map) {
		if (identifiers.has(name)) {
			return true;
		}
	}
	return false;
}

const skippedExportMangledFiles = [

	// Monaco
	'editorCommon',
	'editorOptions',
	'editorZoom',
	'standaloneEditor',
	'standaloneEnums',
	'standaloneLanguages',

	// Generated
	'extensionsApiProposals',

	// Module passed around as type
	'pfs',

	// entry points
	...[
		buildfile.workerEditor,
		buildfile.workerExtensionHost,
		buildfile.workerNotebook,
		buildfile.workerLanguageDetection,
		buildfile.workerLocalFileSearch,
		buildfile.workerProfileAnalysis,
		buildfile.workerOutputLinks,
		buildfile.workerBackgroundTokenization,
		buildfile.workbenchDesktop,
		buildfile.workbenchWeb,
		buildfile.code,
		buildfile.codeWeb
	].flat().map(x => x.name),
];

const skippedExportMangledProjects = [
	// Test projects
	'vscode-api-tests',

	// These projects use webpack to dynamically rewrite imports, which messes up our mangling
	'configuration-editing',
	'microsoft-authentication',
	'github-authentication',
	'html-language-features/server',
];

const skippedExportMangledSymbols = [
	// Don't mangle extension entry points
	'activate',
	'deactivate',
];

class DeclarationData {

	readonly replacementName: string;
	readonly fileName: string;
	readonly node: ts.FunctionDeclaration | ts.ClassDeclaration | ts.EnumDeclaration | ts.VariableDeclaration;

	constructor(
		fileName: string,
		node: ts.FunctionDeclaration | ts.ClassDeclaration | ts.EnumDeclaration | ts.VariableDeclaration,
		fileIdents: ShortIdent,
	) {
		this.fileName = fileName;
		this.node = node;
		// Todo: generate replacement names based on usage count, with more used names getting shorter identifiers
		this.replacementName = fileIdents.next();
	}

	getLocations(service: ts.LanguageService): Iterable<{ fileName: string; offset: number }> {
		if (ts.isVariableDeclaration(this.node)) {
			// If the const aliases any types, we need to rename those too
			const definitionResult = service.getDefinitionAndBoundSpan(this.fileName, this.node.name.getStart());
			if (definitionResult?.definitions && definitionResult.definitions.length > 1) {
				return definitionResult.definitions.map(x => ({ fileName: x.fileName, offset: x.textSpan.start }));
			}
		}

		return [{
			fileName: this.fileName,
			offset: this.node.name!.getStart()
		}];
	}

	shouldMangle(newName: string): boolean {
		const currentName = this.node.name!.getText();
		if (currentName.startsWith('$') || skippedExportMangledSymbols.includes(currentName)) {
			return false;
		}

		// New name is longer the existing one :'(
		if (newName.length >= currentName.length) {
			return false;
		}

		// Don't mangle functions we've explicitly opted out
		if (this.node.getFullText().includes('@skipMangle')) {
			return false;
		}

		return true;
	}
}

export interface MangleOutput {
	out: string;
	sourceMap?: string;
}

/**
 * TypeScript2TypeScript transformer that mangles all private and protected fields
 *
 * 1. Collect all class fields (properties, methods)
 * 2. Collect all sub and super-type relations between classes
 * 3. Compute replacement names for each field
 * 4. Lookup rename locations for these fields
 * 5. Prepare and apply edits
 */
export class Mangler {

	private readonly allClassDataByKey = new Map<string, ClassData>();
	private readonly allExportedSymbols = new Set<DeclarationData>();

	private readonly renameWorkerPool: workerpool.WorkerPool;

	private readonly projectPath: string;
	private readonly log: typeof console.log;
	private readonly config: { readonly manglePrivateFields: boolean; readonly mangleExports: boolean };

	constructor(
		projectPath: string,
		log: typeof console.log = () => { },
		config: { readonly manglePrivateFields: boolean; readonly mangleExports: boolean },
	) {
		this.projectPath = projectPath;
		this.log = log;
		this.config = config;

		this.renameWorkerPool = workerpool.pool(path.join(import.meta.dirname, 'renameWorker.ts'), {
			maxWorkers: 4,
			minWorkers: 'max'
		});
	}

	async computeNewFileContents(strictImplicitPublicHandling?: Set<string>): Promise<Map<string, MangleOutput>> {

		const service = ts.createLanguageService(new StaticLanguageServiceHost(this.projectPath));

		// STEP:
		// - Find all classes and their field info.
		// - Find exported symbols.

		const fileIdents = new ShortIdent('$');

		const visit = (node: ts.Node): void => {
			if (this.config.manglePrivateFields) {
				if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
					const anchor = node.name ?? node;
					const key = `${node.getSourceFile().fileName}|${anchor.getStart()}`;
					if (this.allClassDataByKey.has(key)) {
						throw new Error('DUPE?');
					}
					this.allClassDataByKey.set(key, new ClassData(node.getSourceFile().fileName, node));
				}
			}

			if (this.config.mangleExports) {
				// Find exported classes, functions, and vars
				if (
					(
						// Exported class
						ts.isClassDeclaration(node)
						&& hasModifier(node, ts.SyntaxKind.ExportKeyword)
						&& node.name
					) || (
						// Exported function
						ts.isFunctionDeclaration(node)
						&& ts.isSourceFile(node.parent)
						&& hasModifier(node, ts.SyntaxKind.ExportKeyword)
						&& node.name && node.body // On named function and not on the overload
					) || (
						// Exported variable
						ts.isVariableDeclaration(node)
						&& hasModifier(node.parent.parent, ts.SyntaxKind.ExportKeyword) // Variable statement is exported
						&& ts.isSourceFile(node.parent.parent.parent)
					)

					// Disabled for now because we need to figure out how to handle
					// enums that are used in monaco or extHost interfaces.
					/* || (
						// Exported enum
						ts.isEnumDeclaration(node)
						&& ts.isSourceFile(node.parent)
						&& hasModifier(node, ts.SyntaxKind.ExportKeyword)
						&& !hasModifier(node, ts.SyntaxKind.ConstKeyword) // Don't bother mangling const enums because these are inlined
						&& node.name
					*/
				) {
					if (isInAmbientContext(node)) {
						return;
					}

					this.allExportedSymbols.add(new DeclarationData(node.getSourceFile().fileName, node, fileIdents));
				}
			}

			ts.forEachChild(node, visit);
		};

		for (const file of service.getProgram()!.getSourceFiles()) {
			if (!file.isDeclarationFile) {
				ts.forEachChild(file, visit);
			}
		}
		this.log(`Done collecting. Classes: ${this.allClassDataByKey.size}. Exported symbols: ${this.allExportedSymbols.size}`);


		//  STEP: connect sub and super-types

		const setupParents = (data: ClassData) => {
			const extendsClause = data.node.heritageClauses?.find(h => h.token === ts.SyntaxKind.ExtendsKeyword);
			if (!extendsClause) {
				// no EXTENDS-clause
				return;
			}

			const info = service.getDefinitionAtPosition(data.fileName, extendsClause.types[0].expression.getEnd());
			if (!info || info.length === 0) {
				// throw new Error('SUPER type not found');
				return;
			}

			if (info.length !== 1) {
				// inherits from declared/library type
				return;
			}

			const [definition] = info;
			const key = `${definition.fileName}|${definition.textSpan.start}`;
			const parent = this.allClassDataByKey.get(key);
			if (!parent) {
				// throw new Error(`SUPER type not found: ${key}`);
				return;
			}
			parent.addChild(data);
		};
		for (const data of this.allClassDataByKey.values()) {
			setupParents(data);
		}

		//  STEP: make implicit public (actually protected) field really public
		const violations = new Map<string, string[]>();
		let violationsCauseFailure = false;
		for (const data of this.allClassDataByKey.values()) {
			ClassData.makeImplicitPublicActuallyPublic(data, (name: string, what, why) => {
				const arr = violations.get(what);
				if (arr) {
					arr.push(why);
				} else {
					violations.set(what, [why]);
				}

				if (strictImplicitPublicHandling && !strictImplicitPublicHandling.has(name)) {
					violationsCauseFailure = true;
				}
			});
		}
		for (const [why, whys] of violations) {
			this.log(`WARN: ${why} became PUBLIC because of: ${whys.join(' , ')}`);
		}
		if (violationsCauseFailure) {
			const message = 'Protected fields have been made PUBLIC. This hurts minification and is therefore not allowed. Review the WARN messages further above';
			this.log(`ERROR: ${message}`);
			throw new Error(message);
		}

		// STEP: compute replacement names for each class
		for (const data of this.allClassDataByKey.values()) {
			ClassData.fillInReplacement(data);
		}
		this.log(`Done creating class replacements`);

		// STEP: prepare rename edits
		this.log(`Starting prepare rename edits`);

		type Edit = { newText: string; offset: number; length: number };
		const editsByFile = new Map<string, Edit[]>();

		const appendEdit = (fileName: string, edit: Edit) => {
			const edits = editsByFile.get(fileName);
			if (!edits) {
				editsByFile.set(fileName, [edit]);
			} else {
				edits.push(edit);
			}
		};
		const appendRename = (newText: string, loc: ts.RenameLocation) => {
			appendEdit(loc.fileName, {
				newText: (loc.prefixText || '') + newText + (loc.suffixText || ''),
				offset: loc.textSpan.start,
				length: loc.textSpan.length
			});
		};

		type RenameFn = (projectName: string, fileName: string, pos: number) => ts.RenameLocation[];

		const renameResults: Array<Promise<{ readonly newName: string; readonly locations: readonly ts.RenameLocation[] }>> = [];

		const queueRename = (fileName: string, pos: number, newName: string) => {
			renameResults.push(Promise.resolve(this.renameWorkerPool.exec<RenameFn>('findRenameLocations', [this.projectPath, fileName, pos]))
				.then((locations) => ({ newName, locations })));
		};

		for (const data of this.allClassDataByKey.values()) {
			if (hasModifier(data.node, ts.SyntaxKind.DeclareKeyword)) {
				continue;
			}

			fields: for (const [name, info] of data.fields) {
				if (!ClassData._shouldMangle(info.type)) {
					continue fields;
				}

				// TS-HACK: protected became public via 'some' child
				// and because of that we might need to ignore this now
				let parent = data.parent;
				while (parent) {
					if (parent.fields.get(name)?.type === FieldType.Public) {
						continue fields;
					}
					parent = parent.parent;
				}

				const newName = data.lookupShortName(name);
				queueRename(data.fileName, info.pos, newName);
			}
		}

		for (const data of this.allExportedSymbols.values()) {
			if (data.fileName.endsWith('.d.ts')
				|| skippedExportMangledProjects.some(proj => data.fileName.includes(proj))
				|| skippedExportMangledFiles.some(file => data.fileName.endsWith(file + '.ts'))
			) {
				continue;
			}

			if (!data.shouldMangle(data.replacementName)) {
				continue;
			}

			const newText = data.replacementName;
			for (const { fileName, offset } of data.getLocations(service)) {
				queueRename(fileName, offset, newText);
			}
		}

		await Promise.all(renameResults).then((result) => {
			for (const { newName, locations } of result) {
				for (const loc of locations) {
					appendRename(newName, loc);
				}
			}
		});

		await this.renameWorkerPool.terminate();

		this.log(`Done preparing edits: ${editsByFile.size} files`);

		// STEP: apply all rename edits (per file)
		const result = new Map<string, MangleOutput>();
		let savedBytes = 0;

		for (const item of service.getProgram()!.getSourceFiles()) {

			const { mapRoot, sourceRoot } = service.getProgram()!.getCompilerOptions();
			const projectDir = path.dirname(this.projectPath);
			const sourceMapRoot = mapRoot ?? pathToFileURL(sourceRoot ?? projectDir).toString();

			// source maps
			let generator: SourceMapGenerator | undefined;

			let newFullText: string;
			const edits = editsByFile.get(item.fileName);
			if (!edits) {
				// just copy
				newFullText = item.getFullText();

			} else {
				// source map generator
				const relativeFileName = normalize(path.relative(projectDir, item.fileName));
				const mappingsByLine = new Map<number, Mapping[]>();

				// apply renames
				edits.sort((a, b) => b.offset - a.offset);
				const characters = item.getFullText().split('');

				let lastEdit: Edit | undefined;

				for (const edit of edits) {
					if (lastEdit && lastEdit.offset === edit.offset) {
						//
						if (lastEdit.length !== edit.length || lastEdit.newText !== edit.newText) {
							this.log('ERROR: Overlapping edit', item.fileName, edit.offset, edits);
							throw new Error('OVERLAPPING edit');
						} else {
							continue;
						}
					}
					lastEdit = edit;
					const mangledName = characters.splice(edit.offset, edit.length, edit.newText).join('');
					savedBytes += mangledName.length - edit.newText.length;

					// source maps
					const pos = item.getLineAndCharacterOfPosition(edit.offset);


					let mappings = mappingsByLine.get(pos.line);
					if (!mappings) {
						mappings = [];
						mappingsByLine.set(pos.line, mappings);
					}
					mappings.unshift({
						source: relativeFileName,
						original: { line: pos.line + 1, column: pos.character },
						generated: { line: pos.line + 1, column: pos.character },
						name: mangledName
					}, {
						source: relativeFileName,
						original: { line: pos.line + 1, column: pos.character + edit.length },
						generated: { line: pos.line + 1, column: pos.character + edit.newText.length },
					});
				}

				// source map generation, make sure to get mappings per line correct
				generator = new SourceMapGenerator({ file: path.basename(item.fileName), sourceRoot: sourceMapRoot });
				generator.setSourceContent(relativeFileName, item.getFullText());
				for (const [, mappings] of mappingsByLine) {
					let lineDelta = 0;
					for (const mapping of mappings) {
						generator.addMapping({
							...mapping,
							generated: { line: mapping.generated.line, column: mapping.generated.column - lineDelta }
						});
						lineDelta += mapping.original.column - mapping.generated.column;
					}
				}

				newFullText = characters.join('');
			}
			result.set(item.fileName, { out: newFullText, sourceMap: generator?.toString() });
		}

		service.dispose();
		this.renameWorkerPool.terminate();

		this.log(`Done: ${savedBytes / 1000}kb saved, memory-usage: ${JSON.stringify(v8.getHeapStatistics())}`);
		return result;
	}
}

// --- ast utils

function hasModifier(node: ts.Node, kind: ts.SyntaxKind) {
	const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
	return Boolean(modifiers?.find(mode => mode.kind === kind));
}

function isInAmbientContext(node: ts.Node): boolean {
	for (let p = node.parent; p; p = p.parent) {
		if (ts.isModuleDeclaration(p)) {
			return true;
		}
	}
	return false;
}

function normalize(path: string): string {
	return path.replace(/\\/g, '/');
}

async function _run() {
	const root = path.join(import.meta.dirname, '..', '..', '..');
	const projectBase = path.join(root, 'src');
	const projectPath = path.join(projectBase, 'tsconfig.json');
	const newProjectBase = path.join(path.dirname(projectBase), path.basename(projectBase) + '2');

	fs.cpSync(projectBase, newProjectBase, { recursive: true });

	const mangler = new Mangler(projectPath, console.log, {
		mangleExports: true,
		manglePrivateFields: true,
	});
	for (const [fileName, contents] of await mangler.computeNewFileContents(new Set(['saveState']))) {
		const newFilePath = path.join(newProjectBase, path.relative(projectBase, fileName));
		await fs.promises.mkdir(path.dirname(newFilePath), { recursive: true });
		await fs.promises.writeFile(newFilePath, contents.out);
		if (contents.sourceMap) {
			await fs.promises.writeFile(newFilePath + '.map', contents.sourceMap);
		}
	}
}

if (import.meta.main) {
	_run();
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/mangle/renameWorker.ts]---
Location: vscode-main/build/lib/mangle/renameWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ts from 'typescript';
import workerpool from 'workerpool';
import { StaticLanguageServiceHost } from './staticLanguageServiceHost.ts';

let service: ts.LanguageService | undefined;

function findRenameLocations(
	projectPath: string,
	fileName: string,
	position: number,
): readonly ts.RenameLocation[] {
	if (!service) {
		service = ts.createLanguageService(new StaticLanguageServiceHost(projectPath));
	}

	return service.findRenameLocations(fileName, position, false, false, {
		providePrefixAndSuffixTextForRename: true,
	}) ?? [];
}

workerpool.worker({
	findRenameLocations
});
```

--------------------------------------------------------------------------------

---[FILE: build/lib/mangle/staticLanguageServiceHost.ts]---
Location: vscode-main/build/lib/mangle/staticLanguageServiceHost.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import ts from 'typescript';
import path from 'path';

export class StaticLanguageServiceHost implements ts.LanguageServiceHost {

	private readonly _cmdLine: ts.ParsedCommandLine;
	private readonly _scriptSnapshots: Map<string, ts.IScriptSnapshot> = new Map();
	readonly projectPath: string;

	constructor(projectPath: string) {
		this.projectPath = projectPath;
		const existingOptions: Partial<ts.CompilerOptions> = {};
		const parsed = ts.readConfigFile(projectPath, ts.sys.readFile);
		if (parsed.error) {
			throw parsed.error;
		}
		this._cmdLine = ts.parseJsonConfigFileContent(parsed.config, ts.sys, path.dirname(projectPath), existingOptions);
		if (this._cmdLine.errors.length > 0) {
			throw parsed.error;
		}
	}
	getCompilationSettings(): ts.CompilerOptions {
		return this._cmdLine.options;
	}
	getScriptFileNames(): string[] {
		return this._cmdLine.fileNames;
	}
	getScriptVersion(_fileName: string): string {
		return '1';
	}
	getProjectVersion(): string {
		return '1';
	}
	getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
		let result: ts.IScriptSnapshot | undefined = this._scriptSnapshots.get(fileName);
		if (result === undefined) {
			const content = ts.sys.readFile(fileName);
			if (content === undefined) {
				return undefined;
			}
			result = ts.ScriptSnapshot.fromString(content);
			this._scriptSnapshots.set(fileName, result);
		}
		return result;
	}
	getCurrentDirectory(): string {
		return path.dirname(this.projectPath);
	}
	getDefaultLibFileName(options: ts.CompilerOptions): string {
		return ts.getDefaultLibFilePath(options);
	}
	directoryExists = ts.sys.directoryExists;
	getDirectories = ts.sys.getDirectories;
	fileExists = ts.sys.fileExists;
	readFile = ts.sys.readFile;
	readDirectory = ts.sys.readDirectory;
	// this is necessary to make source references work.
	realpath = ts.sys.realpath;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/basePolicy.ts]---
Location: vscode-main/build/lib/policies/basePolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { renderADMLString } from './render.ts';
import type { Category, LanguageTranslations, NlsString, Policy, PolicyType } from './types.ts';

export abstract class BasePolicy implements Policy {
	readonly type: PolicyType;
	readonly name: string;
	readonly category: Category;
	readonly minimumVersion: string;
	protected description: NlsString;
	protected moduleName: string;

	constructor(
		type: PolicyType,
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
	) {
		this.type = type;
		this.name = name;
		this.category = category;
		this.minimumVersion = minimumVersion;
		this.description = description;
		this.moduleName = moduleName;
	}

	protected renderADMLString(nlsString: NlsString, translations?: LanguageTranslations): string {
		return renderADMLString(this.name, this.moduleName, nlsString, translations);
	}

	renderADMX(regKey: string) {
		return [
			`<policy name="${this.name}" class="Both" displayName="$(string.${this.name})" explainText="$(string.${this.name}_${this.description.nlsKey.replace(/\./g, '_')})" key="Software\\Policies\\Microsoft\\${regKey}" presentation="$(presentation.${this.name})">`,
			`	<parentCategory ref="${this.category.name.nlsKey}" />`,
			`	<supportedOn ref="Supported_${this.minimumVersion.replace(/\./g, '_')}" />`,
			`	<elements>`,
			...this.renderADMXElements(),
			`	</elements>`,
			`</policy>`
		];
	}

	protected abstract renderADMXElements(): string[];

	renderADMLStrings(translations?: LanguageTranslations) {
		return [
			`<string id="${this.name}">${this.name}</string>`,
			this.renderADMLString(this.description, translations)
		];
	}

	renderADMLPresentation(): string {
		return `<presentation id="${this.name}">${this.renderADMLPresentationContents()}</presentation>`;
	}

	protected abstract renderADMLPresentationContents(): string;

	renderProfile() {
		return [`<key>${this.name}</key>`, this.renderProfileValue()];
	}

	renderProfileManifest(translations?: LanguageTranslations): string {
		return `<dict>
${this.renderProfileManifestValue(translations)}
</dict>`;
	}

	abstract renderJsonValue(): string | number | boolean | object | null;
	abstract renderProfileValue(): string;
	abstract renderProfileManifestValue(translations?: LanguageTranslations): string;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/booleanPolicy.ts]---
Location: vscode-main/build/lib/policies/booleanPolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BasePolicy } from './basePolicy.ts';
import type { CategoryDto, PolicyDto } from './policyDto.ts';
import { renderProfileString } from './render.ts';
import { type Category, type NlsString, PolicyType, type LanguageTranslations } from './types.ts';

export class BooleanPolicy extends BasePolicy {

	static from(category: CategoryDto, policy: PolicyDto): BooleanPolicy | undefined {
		const { name, minimumVersion, localization, type } = policy;

		if (type !== 'boolean') {
			return undefined;
		}

		return new BooleanPolicy(name, { moduleName: '', name: { nlsKey: category.name.key, value: category.name.value } }, minimumVersion, { nlsKey: localization.description.key, value: localization.description.value }, '');
	}

	private constructor(
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
	) {
		super(PolicyType.Boolean, name, category, minimumVersion, description, moduleName);
	}

	protected renderADMXElements(): string[] {
		return [
			`<boolean id="${this.name}" valueName="${this.name}">`,
			`	<trueValue><decimal value="1" /></trueValue><falseValue><decimal value="0" /></falseValue>`,
			`</boolean>`
		];
	}

	renderADMLPresentationContents() {
		return `<checkBox refId="${this.name}">${this.name}</checkBox>`;
	}

	renderJsonValue() {
		return false;
	}

	renderProfileValue(): string {
		return `<false/>`;
	}

	renderProfileManifestValue(translations?: LanguageTranslations): string {
		return `<key>pfm_default</key>
<false/>
<key>pfm_description</key>
<string>${renderProfileString(this.name, this.moduleName, this.description, translations)}</string>
<key>pfm_name</key>
<string>${this.name}</string>
<key>pfm_title</key>
<string>${this.name}</string>
<key>pfm_type</key>
<string>boolean</string>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/copyPolicyDto.ts]---
Location: vscode-main/build/lib/policies/copyPolicyDto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';

const sourceFile = path.join(import.meta.dirname, '../../../src/vs/workbench/contrib/policyExport/common/policyDto.ts');
const destFile = path.join(import.meta.dirname, 'policyDto.ts');

try {
	// Check if source file exists
	if (!fs.existsSync(sourceFile)) {
		console.error(`Error: Source file not found: ${sourceFile}`);
		console.error('Please ensure policyDto.ts exists in src/vs/workbench/contrib/policyExport/common/');
		process.exit(1);
	}

	// Copy the file
	fs.copyFileSync(sourceFile, destFile);
} catch (error) {
	console.error(`Error copying policyDto.ts: ${(error as Error).message}`);
	process.exit(1);
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/numberPolicy.ts]---
Location: vscode-main/build/lib/policies/numberPolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BasePolicy } from './basePolicy.ts';
import type { CategoryDto, PolicyDto } from './policyDto.ts';
import { renderProfileString } from './render.ts';
import { type Category, type NlsString, PolicyType, type LanguageTranslations } from './types.ts';

export class NumberPolicy extends BasePolicy {

	static from(category: CategoryDto, policy: PolicyDto): NumberPolicy | undefined {
		const { type, default: defaultValue, name, minimumVersion, localization } = policy;

		if (type !== 'number') {
			return undefined;
		}

		if (typeof defaultValue !== 'number') {
			throw new Error(`Missing required 'default' property.`);
		}

		return new NumberPolicy(name, { moduleName: '', name: { nlsKey: category.name.key, value: category.name.value } }, minimumVersion, { nlsKey: localization.description.key, value: localization.description.value }, '', defaultValue);
	}

	protected readonly defaultValue: number;

	private constructor(
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
		defaultValue: number,
	) {
		super(PolicyType.Number, name, category, minimumVersion, description, moduleName);
		this.defaultValue = defaultValue;
	}

	protected renderADMXElements(): string[] {
		return [
			`<decimal id="${this.name}" valueName="${this.name}" />`
			// `<decimal id="Quarantine_PurgeItemsAfterDelay" valueName="PurgeItemsAfterDelay" minValue="0" maxValue="10000000" />`
		];
	}

	renderADMLPresentationContents() {
		return `<decimalTextBox refId="${this.name}" defaultValue="${this.defaultValue}">${this.name}</decimalTextBox>`;
	}

	renderJsonValue() {
		return this.defaultValue;
	}

	renderProfileValue() {
		return `<integer>${this.defaultValue}</integer>`;
	}

	renderProfileManifestValue(translations?: LanguageTranslations) {
		return `<key>pfm_default</key>
<integer>${this.defaultValue}</integer>
<key>pfm_description</key>
<string>${renderProfileString(this.name, this.moduleName, this.description, translations)}</string>
<key>pfm_name</key>
<string>${this.name}</string>
<key>pfm_title</key>
<string>${this.name}</string>
<key>pfm_type</key>
<string>integer</string>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/objectPolicy.ts]---
Location: vscode-main/build/lib/policies/objectPolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BasePolicy } from './basePolicy.ts';
import type { CategoryDto, PolicyDto } from './policyDto.ts';
import { renderProfileString } from './render.ts';
import { type Category, type NlsString, PolicyType, type LanguageTranslations } from './types.ts';

export class ObjectPolicy extends BasePolicy {

	static from(category: CategoryDto, policy: PolicyDto): ObjectPolicy | undefined {
		const { type, name, minimumVersion, localization } = policy;

		if (type !== 'object' && type !== 'array') {
			return undefined;
		}

		return new ObjectPolicy(name, { moduleName: '', name: { nlsKey: category.name.key, value: category.name.value } }, minimumVersion, { nlsKey: localization.description.key, value: localization.description.value }, '');
	}

	private constructor(
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
	) {
		super(PolicyType.Object, name, category, minimumVersion, description, moduleName);
	}

	protected renderADMXElements(): string[] {
		return [`<multiText id="${this.name}" valueName="${this.name}" required="true" />`];
	}

	renderADMLPresentationContents() {
		return `<multiTextBox refId="${this.name}" />`;
	}

	renderJsonValue() {
		return '';
	}

	renderProfileValue(): string {
		return `<string></string>`;
	}

	renderProfileManifestValue(translations?: LanguageTranslations): string {
		return `<key>pfm_default</key>
<string></string>
<key>pfm_description</key>
<string>${renderProfileString(this.name, this.moduleName, this.description, translations)}</string>
<key>pfm_name</key>
<string>${this.name}</string>
<key>pfm_title</key>
<string>${this.name}</string>
<key>pfm_type</key>
<string>string</string>
`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/policyData.jsonc]---
Location: vscode-main/build/lib/policies/policyData.jsonc

```text
/** THIS FILE IS AUTOMATICALLY GENERATED USING `code --export-policy-data`. DO NOT MODIFY IT MANUALLY. **/
{
    "categories": [
        {
            "key": "Extensions",
            "name": {
                "key": "extensionsConfigurationTitle",
                "value": "Extensions"
            }
        },
        {
            "key": "IntegratedTerminal",
            "name": {
                "key": "terminalIntegratedConfigurationTitle",
                "value": "Integrated Terminal"
            }
        },
        {
            "key": "InteractiveSession",
            "name": {
                "key": "interactiveSessionConfigurationTitle",
                "value": "Chat"
            }
        },
        {
            "key": "Telemetry",
            "name": {
                "key": "telemetryConfigurationTitle",
                "value": "Telemetry"
            }
        },
        {
            "key": "Update",
            "name": {
                "key": "updateConfigurationTitle",
                "value": "Update"
            }
        }
    ],
    "policies": [
        {
            "key": "chat.mcp.gallery.serviceUrl",
            "name": "McpGalleryServiceUrl",
            "category": "InteractiveSession",
            "minimumVersion": "1.101",
            "localization": {
                "description": {
                    "key": "mcp.gallery.serviceUrl",
                    "value": "Configure the MCP Gallery service URL to connect to"
                }
            },
            "type": "string",
            "default": ""
        },
        {
            "key": "extensions.gallery.serviceUrl",
            "name": "ExtensionGalleryServiceUrl",
            "category": "Extensions",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "extensions.gallery.serviceUrl",
                    "value": "Configure the Marketplace service URL to connect to"
                }
            },
            "type": "string",
            "default": ""
        },
        {
            "key": "extensions.allowed",
            "name": "AllowedExtensions",
            "category": "Extensions",
            "minimumVersion": "1.96",
            "localization": {
                "description": {
                    "key": "extensions.allowed.policy",
                    "value": "Specify a list of extensions that are allowed to use. This helps maintain a secure and consistent development environment by restricting the use of unauthorized extensions. More information: https://code.visualstudio.com/docs/setup/enterprise#_configure-allowed-extensions"
                }
            },
            "type": "object",
            "default": "*"
        },
        {
            "key": "chat.tools.global.autoApprove",
            "name": "ChatToolsAutoApprove",
            "category": "InteractiveSession",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "autoApprove2.description",
                    "value": "Global auto approve also known as \"YOLO mode\" disables manual approval completely for all tools in all workspaces, allowing the agent to act fully autonomously. This is extremely dangerous and is *never* recommended, even containerized environments like Codespaces and Dev Containers have user keys forwarded into the container that could be compromised.\n\nThis feature disables critical security protections and makes it much easier for an attacker to compromise the machine."
                }
            },
            "type": "boolean",
            "default": false
        },
        {
            "key": "chat.tools.eligibleForAutoApproval",
            "name": "ChatToolsEligibleForAutoApproval",
            "category": "InteractiveSession",
            "minimumVersion": "1.107",
            "localization": {
                "description": {
                    "key": "chat.tools.eligibleForAutoApproval",
                    "value": "Controls which tools are eligible for automatic approval. Tools set to 'false' will always present a confirmation and will never offer the option to auto-approve. The default behavior (or setting a tool to 'true') may result in the tool offering auto-approval options."
                }
            },
            "type": "object",
            "default": {}
        },
        {
            "key": "chat.mcp.access",
            "name": "ChatMCP",
            "category": "InteractiveSession",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "chat.mcp.access",
                    "value": "Controls access to installed Model Context Protocol servers."
                },
                "enumDescriptions": [
                    {
                        "key": "chat.mcp.access.none",
                        "value": "No access to MCP servers."
                    },
                    {
                        "key": "chat.mcp.access.registry",
                        "value": "Allows access to MCP servers installed from the registry that VS Code is connected to."
                    },
                    {
                        "key": "chat.mcp.access.any",
                        "value": "Allow access to any installed MCP server."
                    }
                ]
            },
            "type": "string",
            "default": "all",
            "enum": [
                "none",
                "registry",
                "all"
            ]
        },
        {
            "key": "chat.extensionTools.enabled",
            "name": "ChatAgentExtensionTools",
            "category": "InteractiveSession",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "chat.extensionToolsEnabled",
                    "value": "Enable using tools contributed by third-party extensions."
                }
            },
            "type": "boolean",
            "default": true
        },
        {
            "key": "chat.agent.enabled",
            "name": "ChatAgentMode",
            "category": "InteractiveSession",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "chat.agent.enabled.description",
                    "value": "When enabled, agent mode can be activated from chat and tools in agentic contexts with side effects can be used."
                }
            },
            "type": "boolean",
            "default": true
        },
        {
            "key": "chat.tools.terminal.enableAutoApprove",
            "name": "ChatToolsTerminalEnableAutoApprove",
            "category": "IntegratedTerminal",
            "minimumVersion": "1.104",
            "localization": {
                "description": {
                    "key": "autoApproveMode.description",
                    "value": "Controls whether to allow auto approval in the run in terminal tool."
                }
            },
            "type": "boolean",
            "default": true
        },
        {
            "key": "update.mode",
            "name": "UpdateMode",
            "category": "Update",
            "minimumVersion": "1.67",
            "localization": {
                "description": {
                    "key": "updateMode",
                    "value": "Configure whether you receive automatic updates. Requires a restart after change. The updates are fetched from a Microsoft online service."
                },
                "enumDescriptions": [
                    {
                        "key": "none",
                        "value": "Disable updates."
                    },
                    {
                        "key": "manual",
                        "value": "Disable automatic background update checks. Updates will be available if you manually check for updates."
                    },
                    {
                        "key": "start",
                        "value": "Check for updates only on startup. Disable automatic background update checks."
                    },
                    {
                        "key": "default",
                        "value": "Enable automatic update checks. Code will check for updates automatically and periodically."
                    }
                ]
            },
            "type": "string",
            "default": "default",
            "enum": [
                "none",
                "manual",
                "start",
                "default"
            ]
        },
        {
            "key": "telemetry.telemetryLevel",
            "name": "TelemetryLevel",
            "category": "Telemetry",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "telemetry.telemetryLevel.policyDescription",
                    "value": "Controls the level of telemetry."
                },
                "enumDescriptions": [
                    {
                        "key": "telemetry.telemetryLevel.default",
                        "value": "Sends usage data, errors, and crash reports."
                    },
                    {
                        "key": "telemetry.telemetryLevel.error",
                        "value": "Sends general error telemetry and crash reports."
                    },
                    {
                        "key": "telemetry.telemetryLevel.crash",
                        "value": "Sends OS level crash reports."
                    },
                    {
                        "key": "telemetry.telemetryLevel.off",
                        "value": "Disables all product telemetry."
                    }
                ]
            },
            "type": "string",
            "default": "all",
            "enum": [
                "all",
                "error",
                "crash",
                "off"
            ]
        },
        {
            "key": "telemetry.feedback.enabled",
            "name": "EnableFeedback",
            "category": "Telemetry",
            "minimumVersion": "1.99",
            "localization": {
                "description": {
                    "key": "telemetry.feedback.enabled",
                    "value": "Enable feedback mechanisms such as the issue reporter, surveys, and other feedback options."
                }
            },
            "type": "boolean",
            "default": true
        }
    ]
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/policyGenerator.ts]---
Location: vscode-main/build/lib/policies/policyGenerator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import minimist from 'minimist';
import * as fs from 'fs';
import path from 'path';
import { type CategoryDto, type ExportedPolicyDataDto } from './policyDto.ts';
import * as JSONC from 'jsonc-parser';
import { BooleanPolicy } from './booleanPolicy.ts';
import { NumberPolicy } from './numberPolicy.ts';
import { ObjectPolicy } from './objectPolicy.ts';
import { StringEnumPolicy } from './stringEnumPolicy.ts';
import { StringPolicy } from './stringPolicy.ts';
import { type Version, type LanguageTranslations, type Policy, type Translations, Languages, type ProductJson } from './types.ts';
import { renderGP, renderJsonPolicies, renderMacOSPolicy } from './render.ts';

const product: ProductJson = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../../../product.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../../../package.json'), 'utf8'));

async function getSpecificNLS(resourceUrlTemplate: string, languageId: string, version: Version): Promise<LanguageTranslations> {
	const resource = {
		publisher: 'ms-ceintl',
		name: `vscode-language-pack-${languageId}`,
		version: `${version[0]}.${version[1]}.${version[2]}`,
		path: 'extension/translations/main.i18n.json'
	};

	const url = resourceUrlTemplate.replace(/\{([^}]+)\}/g, (_, key) => resource[key as keyof typeof resource]);
	const res = await fetch(url);

	if (res.status !== 200) {
		throw new Error(`[${res.status}] Error downloading language pack ${languageId}@${version}`);
	}

	const { contents: result } = await res.json() as { contents: LanguageTranslations };

	// TODO: support module namespacing
	// Flatten all moduleName keys to empty string
	const flattened: LanguageTranslations = { '': {} };
	for (const moduleName in result) {
		for (const nlsKey in result[moduleName]) {
			flattened[''][nlsKey] = result[moduleName][nlsKey];
		}
	}

	return flattened;
}

function parseVersion(version: string): Version {
	const [, major, minor, patch] = /^(\d+)\.(\d+)\.(\d+)/.exec(version)!;
	return [parseInt(major), parseInt(minor), parseInt(patch)];
}

function compareVersions(a: Version, b: Version): number {
	if (a[0] !== b[0]) { return a[0] - b[0]; }
	if (a[1] !== b[1]) { return a[1] - b[1]; }
	return a[2] - b[2];
}

async function queryVersions(serviceUrl: string, languageId: string): Promise<Version[]> {
	const res = await fetch(`${serviceUrl}/extensionquery`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json;api-version=3.0-preview.1',
			'Content-Type': 'application/json',
			'User-Agent': 'VS Code Build',
		},
		body: JSON.stringify({
			filters: [{ criteria: [{ filterType: 7, value: `ms-ceintl.vscode-language-pack-${languageId}` }] }],
			flags: 0x1
		})
	});

	if (res.status !== 200) {
		throw new Error(`[${res.status}] Error querying for extension: ${languageId}`);
	}

	const result = await res.json() as { results: [{ extensions: { versions: { version: string }[] }[] }] };
	return result.results[0].extensions[0].versions.map(v => parseVersion(v.version)).sort(compareVersions);
}

async function getNLS(extensionGalleryServiceUrl: string, resourceUrlTemplate: string, languageId: string, version: Version) {
	const versions = await queryVersions(extensionGalleryServiceUrl, languageId);
	const nextMinor: Version = [version[0], version[1] + 1, 0];
	const compatibleVersions = versions.filter(v => compareVersions(v, nextMinor) < 0);
	const latestCompatibleVersion = compatibleVersions.at(-1)!; // order is newest to oldest

	if (!latestCompatibleVersion) {
		throw new Error(`No compatible language pack found for ${languageId} for version ${version}`);
	}

	return await getSpecificNLS(resourceUrlTemplate, languageId, latestCompatibleVersion);
}

// TODO: add more policy types
const PolicyTypes = [
	BooleanPolicy,
	NumberPolicy,
	StringEnumPolicy,
	StringPolicy,
	ObjectPolicy
];

async function parsePolicies(policyDataFile: string): Promise<Policy[]> {
	const contents = JSONC.parse(await fs.promises.readFile(policyDataFile, { encoding: 'utf8' })) as ExportedPolicyDataDto;
	const categories = new Map<string, CategoryDto>();
	for (const category of contents.categories) {
		categories.set(category.key, category);
	}

	const policies: Policy[] = [];
	for (const policy of contents.policies) {
		const category = categories.get(policy.category);
		if (!category) {
			throw new Error(`Unknown category: ${policy.category}`);
		}

		let result: Policy | undefined;
		for (const policyType of PolicyTypes) {
			if (result = policyType.from(category, policy)) {
				break;
			}
		}

		if (!result) {
			throw new Error(`Unsupported policy type: ${policy.type} for policy ${policy.name}`);
		}

		policies.push(result);
	}

	// Sort policies first by category name, then by policy name
	policies.sort((a, b) => {
		const categoryCompare = a.category.name.value.localeCompare(b.category.name.value);
		if (categoryCompare !== 0) {
			return categoryCompare;
		}
		return a.name.localeCompare(b.name);
	});

	return policies;
}

async function getTranslations(): Promise<Translations> {
	const extensionGalleryServiceUrl = product.extensionsGallery?.serviceUrl;

	if (!extensionGalleryServiceUrl) {
		console.warn(`Skipping policy localization: No 'extensionGallery.serviceUrl' found in 'product.json'.`);
		return [];
	}

	const resourceUrlTemplate = product.extensionsGallery?.resourceUrlTemplate;

	if (!resourceUrlTemplate) {
		console.warn(`Skipping policy localization: No 'resourceUrlTemplate' found in 'product.json'.`);
		return [];
	}

	const version = parseVersion(packageJson.version);
	const languageIds = Object.keys(Languages);

	return await Promise.all(languageIds.map(
		languageId => getNLS(extensionGalleryServiceUrl, resourceUrlTemplate, languageId, version)
			.then(languageTranslations => ({ languageId, languageTranslations }))
	));
}

async function windowsMain(policies: Policy[], translations: Translations) {
	const root = '.build/policies/win32';
	const { admx, adml } = renderGP(product, policies, translations);

	await fs.promises.rm(root, { recursive: true, force: true });
	await fs.promises.mkdir(root, { recursive: true });

	await fs.promises.writeFile(path.join(root, `${product.win32RegValueName}.admx`), admx.replace(/\r?\n/g, '\n'));

	for (const { languageId, contents } of adml) {
		const languagePath = path.join(root, languageId === 'en-us' ? 'en-us' : Languages[languageId as keyof typeof Languages]);
		await fs.promises.mkdir(languagePath, { recursive: true });
		await fs.promises.writeFile(path.join(languagePath, `${product.win32RegValueName}.adml`), contents.replace(/\r?\n/g, '\n'));
	}
}

async function darwinMain(policies: Policy[], translations: Translations) {
	const bundleIdentifier = product.darwinBundleIdentifier;
	if (!bundleIdentifier || !product.darwinProfilePayloadUUID || !product.darwinProfileUUID) {
		throw new Error(`Missing required product information.`);
	}
	const root = '.build/policies/darwin';
	const { profile, manifests } = renderMacOSPolicy(product, policies, translations);

	await fs.promises.rm(root, { recursive: true, force: true });
	await fs.promises.mkdir(root, { recursive: true });
	await fs.promises.writeFile(path.join(root, `${bundleIdentifier}.mobileconfig`), profile.replace(/\r?\n/g, '\n'));

	for (const { languageId, contents } of manifests) {
		const languagePath = path.join(root, languageId === 'en-us' ? 'en-us' : Languages[languageId as keyof typeof Languages]);
		await fs.promises.mkdir(languagePath, { recursive: true });
		await fs.promises.writeFile(path.join(languagePath, `${bundleIdentifier}.plist`), contents.replace(/\r?\n/g, '\n'));
	}
}

async function linuxMain(policies: Policy[]) {
	const root = '.build/policies/linux';
	const policyFileContents = JSON.stringify(renderJsonPolicies(policies), undefined, 4);

	await fs.promises.rm(root, { recursive: true, force: true });
	await fs.promises.mkdir(root, { recursive: true });

	const jsonPath = path.join(root, `policy.json`);
	await fs.promises.writeFile(jsonPath, policyFileContents.replace(/\r?\n/g, '\n'));
}

async function main() {
	const args = minimist(process.argv.slice(2));
	if (args._.length !== 2) {
		console.error(`Usage: node build/lib/policies <policy-data-file> <darwin|win32|linux>`);
		process.exit(1);
	}

	const policyDataFile = args._[0];
	const platform = args._[1];
	const [policies, translations] = await Promise.all([parsePolicies(policyDataFile), getTranslations()]);

	if (platform === 'darwin') {
		await darwinMain(policies, translations);
	} else if (platform === 'win32') {
		await windowsMain(policies, translations);
	} else if (platform === 'linux') {
		await linuxMain(policies);
	} else {
		console.error(`Usage: node build/lib/policies <policy-data-file> <darwin|win32|linux>`);
		process.exit(1);
	}
}

if (import.meta.main) {
	main().catch(err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/render.ts]---
Location: vscode-main/build/lib/policies/render.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { NlsString, LanguageTranslations, Category, Policy, Translations, ProductJson } from './types.ts';

export function renderADMLString(prefix: string, moduleName: string, nlsString: NlsString, translations?: LanguageTranslations): string {
	let value: string | undefined;

	if (translations) {
		const moduleTranslations = translations[moduleName];

		if (moduleTranslations) {
			value = moduleTranslations[nlsString.nlsKey];
		}
	}

	if (!value) {
		value = nlsString.value;
	}

	return `<string id="${prefix}_${nlsString.nlsKey.replace(/\./g, '_')}">${value}</string>`;
}

export function renderProfileString(_prefix: string, moduleName: string, nlsString: NlsString, translations?: LanguageTranslations): string {
	let value: string | undefined;

	if (translations) {
		const moduleTranslations = translations[moduleName];

		if (moduleTranslations) {
			value = moduleTranslations[nlsString.nlsKey];
		}
	}

	if (!value) {
		value = nlsString.value;
	}

	return value;
}

export function renderADMX(regKey: string, versions: string[], categories: Category[], policies: Policy[]) {
	versions = versions.map(v => v.replace(/\./g, '_'));

	return `<?xml version="1.0" encoding="utf-8"?>
<policyDefinitions revision="1.1" schemaVersion="1.0">
	<policyNamespaces>
		<target prefix="${regKey}" namespace="Microsoft.Policies.${regKey}" />
	</policyNamespaces>
	<resources minRequiredRevision="1.0" />
	<supportedOn>
		<definitions>
			${versions.map(v => `<definition name="Supported_${v}" displayName="$(string.Supported_${v})" />`).join(`\n			`)}
		</definitions>
	</supportedOn>
	<categories>
		<category displayName="$(string.Application)" name="Application" />
		${categories.map(c => `<category displayName="$(string.Category_${c.name.nlsKey})" name="${c.name.nlsKey}"><parentCategory ref="Application" /></category>`).join(`\n		`)}
	</categories>
	<policies>
		${policies.map(p => p.renderADMX(regKey)).flat().join(`\n		`)}
	</policies>
</policyDefinitions>
`;
}

export function renderADML(appName: string, versions: string[], categories: Category[], policies: Policy[], translations?: LanguageTranslations) {
	return `<?xml version="1.0" encoding="utf-8"?>
<policyDefinitionResources revision="1.0" schemaVersion="1.0">
	<displayName />
	<description />
	<resources>
		<stringTable>
			<string id="Application">${appName}</string>
			${versions.map(v => `<string id="Supported_${v.replace(/\./g, '_')}">${appName} &gt;= ${v}</string>`).join(`\n			`)}
			${categories.map(c => renderADMLString('Category', c.moduleName, c.name, translations)).join(`\n			`)}
			${policies.map(p => p.renderADMLStrings(translations)).flat().join(`\n			`)}
		</stringTable>
		<presentationTable>
			${policies.map(p => p.renderADMLPresentation()).join(`\n			`)}
		</presentationTable>
	</resources>
</policyDefinitionResources>
`;
}

export function renderProfileManifest(appName: string, bundleIdentifier: string, _versions: string[], _categories: Category[], policies: Policy[], translations?: LanguageTranslations) {

	const requiredPayloadFields = `
		<dict>
			<key>pfm_default</key>
			<string>Configure ${appName}</string>
			<key>pfm_name</key>
			<string>PayloadDescription</string>
			<key>pfm_title</key>
			<string>Payload Description</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<string>${appName}</string>
			<key>pfm_name</key>
			<string>PayloadDisplayName</string>
			<key>pfm_require</key>
			<string>always</string>
			<key>pfm_title</key>
			<string>Payload Display Name</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<string>${bundleIdentifier}</string>
			<key>pfm_name</key>
			<string>PayloadIdentifier</string>
			<key>pfm_require</key>
			<string>always</string>
			<key>pfm_title</key>
			<string>Payload Identifier</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<string>${bundleIdentifier}</string>
			<key>pfm_name</key>
			<string>PayloadType</string>
			<key>pfm_require</key>
			<string>always</string>
			<key>pfm_title</key>
			<string>Payload Type</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<string></string>
			<key>pfm_name</key>
			<string>PayloadUUID</string>
			<key>pfm_require</key>
			<string>always</string>
			<key>pfm_title</key>
			<string>Payload UUID</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<integer>1</integer>
			<key>pfm_name</key>
			<string>PayloadVersion</string>
			<key>pfm_range_list</key>
			<array>
				<integer>1</integer>
			</array>
			<key>pfm_require</key>
			<string>always</string>
			<key>pfm_title</key>
			<string>Payload Version</string>
			<key>pfm_type</key>
			<string>integer</string>
		</dict>
		<dict>
			<key>pfm_default</key>
			<string>Microsoft</string>
			<key>pfm_name</key>
			<string>PayloadOrganization</string>
			<key>pfm_title</key>
			<string>Payload Organization</string>
			<key>pfm_type</key>
			<string>string</string>
		</dict>`;

	const profileManifestSubkeys = policies.map(policy => {
		return policy.renderProfileManifest(translations);
	}).join('');

	return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>pfm_app_url</key>
    <string>https://code.visualstudio.com/</string>
    <key>pfm_description</key>
    <string>${appName} Managed Settings</string>
    <key>pfm_documentation_url</key>
    <string>https://code.visualstudio.com/docs/setup/enterprise</string>
    <key>pfm_domain</key>
    <string>${bundleIdentifier}</string>
    <key>pfm_format_version</key>
    <integer>1</integer>
    <key>pfm_interaction</key>
    <string>combined</string>
    <key>pfm_last_modified</key>
    <date>${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</date>
    <key>pfm_platforms</key>
    <array>
        <string>macOS</string>
    </array>
    <key>pfm_subkeys</key>
    <array>
	${requiredPayloadFields}
	${profileManifestSubkeys}
    </array>
    <key>pfm_title</key>
    <string>${appName}</string>
    <key>pfm_unique</key>
    <true/>
    <key>pfm_version</key>
    <integer>1</integer>
</dict>
</plist>`;
}

export function renderMacOSPolicy(product: ProductJson, policies: Policy[], translations: Translations) {
	const appName = product.nameLong;
	const bundleIdentifier = product.darwinBundleIdentifier;
	const payloadUUID = product.darwinProfilePayloadUUID;
	const UUID = product.darwinProfileUUID;

	const versions = [...new Set(policies.map(p => p.minimumVersion)).values()].sort();
	const categories = [...new Set(policies.map(p => p.category))];

	const policyEntries =
		policies.map(policy => policy.renderProfile())
			.flat()
			.map(entry => `\t\t\t\t${entry}`)
			.join('\n');


	return {
		profile: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>PayloadContent</key>
		<array>
			<dict>
				<key>PayloadDisplayName</key>
				<string>${appName}</string>
				<key>PayloadIdentifier</key>
				<string>${bundleIdentifier}.${UUID}</string>
				<key>PayloadType</key>
				<string>${bundleIdentifier}</string>
				<key>PayloadUUID</key>
				<string>${UUID}</string>
				<key>PayloadVersion</key>
				<integer>1</integer>
${policyEntries}
			</dict>
		</array>
		<key>PayloadDescription</key>
		<string>This profile manages ${appName}. For more information see https://code.visualstudio.com/docs/setup/enterprise</string>
		<key>PayloadDisplayName</key>
		<string>${appName}</string>
		<key>PayloadIdentifier</key>
		<string>${bundleIdentifier}</string>
		<key>PayloadOrganization</key>
		<string>Microsoft</string>
		<key>PayloadType</key>
		<string>Configuration</string>
		<key>PayloadUUID</key>
		<string>${payloadUUID}</string>
		<key>PayloadVersion</key>
		<integer>1</integer>
		<key>TargetDeviceType</key>
		<integer>5</integer>
	</dict>
</plist>`,
		manifests: [{ languageId: 'en-us', contents: renderProfileManifest(appName, bundleIdentifier, versions, categories, policies) },
		...translations.map(({ languageId, languageTranslations }) =>
			({ languageId, contents: renderProfileManifest(appName, bundleIdentifier, versions, categories, policies, languageTranslations) }))
		]
	};
}

export function renderGP(product: ProductJson, policies: Policy[], translations: Translations) {
	const appName = product.nameLong;
	const regKey = product.win32RegValueName;

	const versions = [...new Set(policies.map(p => p.minimumVersion)).values()].sort();
	const categories = [...Object.values(policies.reduce((acc, p) => ({ ...acc, [p.category.name.nlsKey]: p.category }), {}))] as Category[];

	return {
		admx: renderADMX(regKey, versions, categories, policies),
		adml: [
			{ languageId: 'en-us', contents: renderADML(appName, versions, categories, policies) },
			...translations.map(({ languageId, languageTranslations }) =>
				({ languageId, contents: renderADML(appName, versions, categories, policies, languageTranslations) }))
		]
	};
}

export function renderJsonPolicies(policies: Policy[]) {
	const policyObject: { [key: string]: string | number | boolean | object | null } = {};
	for (const policy of policies) {
		policyObject[policy.name] = policy.renderJsonValue();
	}
	return policyObject;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/stringEnumPolicy.ts]---
Location: vscode-main/build/lib/policies/stringEnumPolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BasePolicy } from './basePolicy.ts';
import type { CategoryDto, PolicyDto } from './policyDto.ts';
import { renderProfileString } from './render.ts';
import { type Category, type NlsString, PolicyType, type LanguageTranslations } from './types.ts';

export class StringEnumPolicy extends BasePolicy {

	static from(category: CategoryDto, policy: PolicyDto): StringEnumPolicy | undefined {
		const { type, name, minimumVersion, enum: enumValue, localization } = policy;

		if (type !== 'string') {
			return undefined;
		}

		const enum_ = enumValue;

		if (!enum_) {
			return undefined;
		}

		if (!localization.enumDescriptions || !Array.isArray(localization.enumDescriptions) || localization.enumDescriptions.length !== enum_.length) {
			throw new Error(`Invalid policy data: enumDescriptions must exist and have the same length as enum_ for policy "${name}".`);
		}
		const enumDescriptions = localization.enumDescriptions.map((e) => ({ nlsKey: e.key, value: e.value }));
		return new StringEnumPolicy(
			name,
			{ moduleName: '', name: { nlsKey: category.name.key, value: category.name.value } },
			minimumVersion,
			{ nlsKey: localization.description.key, value: localization.description.value },
			'',
			enum_,
			enumDescriptions
		);
	}

	protected enum_: string[];
	protected enumDescriptions: NlsString[];

	private constructor(
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
		enum_: string[],
		enumDescriptions: NlsString[],
	) {
		super(PolicyType.StringEnum, name, category, minimumVersion, description, moduleName);
		this.enum_ = enum_;
		this.enumDescriptions = enumDescriptions;
	}

	protected renderADMXElements(): string[] {
		return [
			`<enum id="${this.name}" valueName="${this.name}">`,
			...this.enum_.map((value, index) => `	<item displayName="$(string.${this.name}_${this.enumDescriptions[index].nlsKey.replace(/\./g, '_')})"><value><string>${value}</string></value></item>`),
			`</enum>`
		];
	}

	renderADMLStrings(translations?: LanguageTranslations) {
		return [
			...super.renderADMLStrings(translations),
			...this.enumDescriptions.map(e => this.renderADMLString(e, translations))
		];
	}

	renderADMLPresentationContents() {
		return `<dropdownList refId="${this.name}" />`;
	}

	renderJsonValue() {
		return this.enum_[0];
	}

	renderProfileValue() {
		return `<string>${this.enum_[0]}</string>`;
	}

	renderProfileManifestValue(translations?: LanguageTranslations): string {
		return `<key>pfm_default</key>
<string>${this.enum_[0]}</string>
<key>pfm_description</key>
<string>${renderProfileString(this.name, this.moduleName, this.description, translations)}</string>
<key>pfm_name</key>
<string>${this.name}</string>
<key>pfm_title</key>
<string>${this.name}</string>
<key>pfm_type</key>
<string>string</string>
<key>pfm_range_list</key>
<array>
	${this.enum_.map(e => `<string>${e}</string>`).join('\n	')}
</array>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/stringPolicy.ts]---
Location: vscode-main/build/lib/policies/stringPolicy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BasePolicy } from './basePolicy.ts';
import type { CategoryDto, PolicyDto } from './policyDto.ts';
import { renderProfileString } from './render.ts';
import { PolicyType, type Category, type LanguageTranslations, type NlsString } from './types.ts';

export class StringPolicy extends BasePolicy {

	static from(category: CategoryDto, policy: PolicyDto): StringPolicy | undefined {
		const { type, name, minimumVersion, localization } = policy;

		if (type !== 'string') {
			return undefined;
		}

		return new StringPolicy(name, { moduleName: '', name: { nlsKey: category.name.key, value: category.name.value } }, minimumVersion, { nlsKey: localization.description.key, value: localization.description.value }, '');
	}

	private constructor(
		name: string,
		category: Category,
		minimumVersion: string,
		description: NlsString,
		moduleName: string,
	) {
		super(PolicyType.String, name, category, minimumVersion, description, moduleName);
	}

	protected renderADMXElements(): string[] {
		return [`<text id="${this.name}" valueName="${this.name}" required="true" />`];
	}

	renderJsonValue() {
		return '';
	}

	renderADMLPresentationContents() {
		return `<textBox refId="${this.name}"><label>${this.name}:</label></textBox>`;
	}

	renderProfileValue(): string {
		return `<string></string>`;
	}

	renderProfileManifestValue(translations?: LanguageTranslations): string {
		return `<key>pfm_default</key>
<string></string>
<key>pfm_description</key>
<string>${renderProfileString(this.name, this.moduleName, this.description, translations)}</string>
<key>pfm_name</key>
<string>${this.name}</string>
<key>pfm_title</key>
<string>${this.name}</string>
<key>pfm_type</key>
<string>string</string>`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/policies/types.ts]---
Location: vscode-main/build/lib/policies/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface ProductJson {
	readonly nameLong: string;
	readonly darwinBundleIdentifier: string;
	readonly darwinProfilePayloadUUID: string;
	readonly darwinProfileUUID: string;
	readonly win32RegValueName: string;
	readonly extensionsGallery?: {
		readonly serviceUrl: string;
		readonly resourceUrlTemplate: string;
	};
}

export interface Policy {
	readonly name: string;
	readonly type: PolicyType;
	readonly category: Category;
	readonly minimumVersion: string;
	renderADMX(regKey: string): string[];
	renderADMLStrings(translations?: LanguageTranslations): string[];
	renderADMLPresentation(): string;
	renderJsonValue(): string | number | boolean | object | null;
	renderProfile(): string[];
	// https://github.com/ProfileManifests/ProfileManifests/wiki/Manifest-Format
	renderProfileManifest(translations?: LanguageTranslations): string;
}

export type NlsString = { value: string; nlsKey: string };

export interface Category {
	readonly moduleName: string;
	readonly name: NlsString;
}

export const PolicyType = Object.freeze({
	Boolean: 'boolean',
	Number: 'number',
	Object: 'object',
	String: 'string',
	StringEnum: 'stringEnum',
});
export type PolicyType = typeof PolicyType[keyof typeof PolicyType];

export const Languages = {
	'fr': 'fr-fr',
	'it': 'it-it',
	'de': 'de-de',
	'es': 'es-es',
	'ru': 'ru-ru',
	'zh-hans': 'zh-cn',
	'zh-hant': 'zh-tw',
	'ja': 'ja-jp',
	'ko': 'ko-kr',
	'cs': 'cs-cz',
	'pt-br': 'pt-br',
	'tr': 'tr-tr',
	'pl': 'pl-pl',
};

export type LanguageTranslations = { [moduleName: string]: { [nlsKey: string]: string } };
export type Translations = { languageId: string; languageTranslations: LanguageTranslations }[];

export type Version = [number, number, number];
```

--------------------------------------------------------------------------------

---[FILE: build/lib/stylelint/validateVariableNames.ts]---
Location: vscode-main/build/lib/stylelint/validateVariableNames.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readFileSync } from 'fs';
import path from 'path';

const RE_VAR_PROP = /var\(\s*(--([\w\-\.]+))/g;

let knownVariables: Set<string> | undefined;
function getKnownVariableNames() {
	if (!knownVariables) {
		const knownVariablesFileContent = readFileSync(path.join(import.meta.dirname, './vscode-known-variables.json'), 'utf8').toString();
		const knownVariablesInfo = JSON.parse(knownVariablesFileContent);
		knownVariables = new Set([...knownVariablesInfo.colors, ...knownVariablesInfo.others, ...(knownVariablesInfo.sizes || [])] as string[]);
	}
	return knownVariables;
}

const iconVariable = /^--vscode-icon-.+-(content|font-family)$/;

export interface IValidator {
	(value: string, report: (message: string) => void): void;
}

export function getVariableNameValidator(): IValidator {
	const allVariables = getKnownVariableNames();
	return (value: string, report: (unknwnVariable: string) => void) => {
		RE_VAR_PROP.lastIndex = 0; // reset lastIndex just to be sure
		let match;
		while (match = RE_VAR_PROP.exec(value)) {
			const variableName = match[1];
			if (variableName && !allVariables.has(variableName) && !iconVariable.test(variableName)) {
				report(variableName);
			}
		}
	};
}
```

--------------------------------------------------------------------------------

````
