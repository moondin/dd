---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 15
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 15 of 552)

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

---[FILE: build/lib/tsb/builder.ts]---
Location: vscode-main/build/lib/tsb/builder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as utils from './utils.ts';
import colors from 'ansi-colors';
import ts from 'typescript';
import Vinyl from 'vinyl';
import { type RawSourceMap, SourceMapConsumer, SourceMapGenerator } from 'source-map';

export interface IConfiguration {
	logFn: (topic: string, message: string) => void;
	_emitWithoutBasePath?: boolean;
}

export interface CancellationToken {
	isCancellationRequested(): boolean;
}

export const CancellationToken = new class {
	None: CancellationToken = {
		isCancellationRequested() { return false; }
	};
};

export interface ITypeScriptBuilder {
	build(out: (file: Vinyl) => void, onError: (err: ts.Diagnostic) => void, token?: CancellationToken): Promise<any>;
	file(file: Vinyl): void;
	languageService: ts.LanguageService;
}

function normalize(path: string): string {
	return path.replace(/\\/g, '/');
}

export function createTypeScriptBuilder(config: IConfiguration, projectFile: string, cmd: ts.ParsedCommandLine): ITypeScriptBuilder {

	const _log = config.logFn;

	const host = new LanguageServiceHost(cmd, projectFile, _log);

	const outHost = new LanguageServiceHost({ ...cmd, options: { ...cmd.options, sourceRoot: cmd.options.outDir } }, cmd.options.outDir ?? '', _log);
	const toBeCheckedForCycles: string[] = [];

	const service = ts.createLanguageService(host, ts.createDocumentRegistry());
	const lastBuildVersion: { [path: string]: string } = Object.create(null);
	const lastDtsHash: { [path: string]: string } = Object.create(null);
	const userWantsDeclarations = cmd.options.declaration;
	let oldErrors: { [path: string]: ts.Diagnostic[] } = Object.create(null);
	let headUsed = process.memoryUsage().heapUsed;
	let emitSourceMapsInStream = true;

	// always emit declaraction files
	host.getCompilationSettings().declaration = true;

	function file(file: Vinyl): void {
		// support gulp-sourcemaps
		if (file.sourceMap) {
			emitSourceMapsInStream = false;
		}

		if (!file.contents) {
			host.removeScriptSnapshot(file.path);
			delete lastBuildVersion[normalize(file.path)];
		} else {
			host.addScriptSnapshot(file.path, new VinylScriptSnapshot(file));
		}
	}

	function baseFor(snapshot: ScriptSnapshot): string {
		if (snapshot instanceof VinylScriptSnapshot) {
			return cmd.options.outDir || snapshot.getBase();
		} else {
			return '';
		}
	}

	function isExternalModule(sourceFile: ts.SourceFile): boolean {
		interface SourceFileWithModuleIndicator extends ts.SourceFile {
			externalModuleIndicator?: unknown;
		}
		return !!(sourceFile as SourceFileWithModuleIndicator).externalModuleIndicator
			|| /declare\s+module\s+('|")(.+)\1/.test(sourceFile.getText());
	}

	function build(out: (file: Vinyl) => void, onError: (err: any) => void, token = CancellationToken.None): Promise<any> {

		function checkSyntaxSoon(fileName: string): Promise<ts.Diagnostic[]> {
			return new Promise<ts.Diagnostic[]>(resolve => {
				process.nextTick(function () {
					if (!host.getScriptSnapshot(fileName, false)) {
						resolve([]); // no script, no problems
					} else {
						resolve(service.getSyntacticDiagnostics(fileName));
					}
				});
			});
		}

		function checkSemanticsSoon(fileName: string): Promise<ts.Diagnostic[]> {
			return new Promise<ts.Diagnostic[]>(resolve => {
				process.nextTick(function () {
					if (!host.getScriptSnapshot(fileName, false)) {
						resolve([]); // no script, no problems
					} else {
						resolve(service.getSemanticDiagnostics(fileName));
					}
				});
			});
		}

		function emitSoon(fileName: string): Promise<{ fileName: string; signature?: string; files: Vinyl[] }> {

			return new Promise(resolve => {
				process.nextTick(function () {

					if (/\.d\.ts$/.test(fileName)) {
						// if it's already a d.ts file just emit it signature
						const snapshot = host.getScriptSnapshot(fileName);
						const signature = crypto.createHash('sha256')
							.update(snapshot.getText(0, snapshot.getLength()))
							.digest('base64');

						return resolve({
							fileName,
							signature,
							files: []
						});
					}

					const output = service.getEmitOutput(fileName);
					const files: Vinyl[] = [];
					let signature: string | undefined;

					for (const file of output.outputFiles) {
						if (!emitSourceMapsInStream && /\.js\.map$/.test(file.name)) {
							continue;
						}

						if (/\.d\.ts$/.test(file.name)) {
							signature = crypto.createHash('sha256')
								.update(file.text)
								.digest('base64');

							if (!userWantsDeclarations) {
								// don't leak .d.ts files if users don't want them
								continue;
							}
						}

						const vinyl = new Vinyl({
							path: file.name,
							contents: Buffer.from(file.text),
							base: !config._emitWithoutBasePath && baseFor(host.getScriptSnapshot(fileName)) || undefined
						});

						if (!emitSourceMapsInStream && /\.js$/.test(file.name)) {
							const sourcemapFile = output.outputFiles.filter(f => /\.js\.map$/.test(f.name))[0];

							if (sourcemapFile) {
								const extname = path.extname(vinyl.relative);
								const basename = path.basename(vinyl.relative, extname);
								const dirname = path.dirname(vinyl.relative);
								const tsname = (dirname === '.' ? '' : dirname + '/') + basename + '.ts';

								let sourceMap = JSON.parse(sourcemapFile.text) as RawSourceMap;
								sourceMap.sources[0] = tsname.replace(/\\/g, '/');

								// check for an "input source" map and combine them
								// in step 1 we extract all line edit from the input source map, and
								// in step 2 we apply the line edits to the typescript source map
								const snapshot = host.getScriptSnapshot(fileName);
								if (snapshot instanceof VinylScriptSnapshot && snapshot.sourceMap) {
									const inputSMC = new SourceMapConsumer(snapshot.sourceMap);
									const tsSMC = new SourceMapConsumer(sourceMap);
									let didChange = false;
									const smg = new SourceMapGenerator({
										file: sourceMap.file,
										sourceRoot: sourceMap.sourceRoot
									});

									// step 1
									const lineEdits = new Map<number, [from: number, to: number][]>();
									inputSMC.eachMapping(m => {
										if (m.originalLine === m.generatedLine) {
											// same line mapping
											let array = lineEdits.get(m.originalLine);
											if (!array) {
												array = [];
												lineEdits.set(m.originalLine, array);
											}
											array.push([m.originalColumn, m.generatedColumn]);
										} else {
											// NOT SUPPORTED
										}
									});

									// step 2
									tsSMC.eachMapping(m => {
										didChange = true;
										const edits = lineEdits.get(m.originalLine);
										let originalColumnDelta = 0;
										if (edits) {
											for (const [from, to] of edits) {
												if (to >= m.originalColumn) {
													break;
												}
												originalColumnDelta = from - to;
											}
										}
										smg.addMapping({
											source: m.source,
											name: m.name,
											generated: { line: m.generatedLine, column: m.generatedColumn },
											original: { line: m.originalLine, column: m.originalColumn + originalColumnDelta }
										});
									});

									if (didChange) {

										interface SourceMapGeneratorWithSources extends SourceMapGenerator {
											_sources: { add(source: string): void };
										}

										[tsSMC, inputSMC].forEach((consumer) => {
											(consumer as SourceMapConsumer & { sources: string[] }).sources.forEach((sourceFile: string) => {
												(smg as SourceMapGeneratorWithSources)._sources.add(sourceFile);
												const sourceContent = consumer.sourceContentFor(sourceFile);
												if (sourceContent !== null) {
													smg.setSourceContent(sourceFile, sourceContent);
												}
											});
										}); sourceMap = JSON.parse(smg.toString());

										// const filename = '/Users/jrieken/Code/vscode/src2/' + vinyl.relative + '.map';
										// fs.promises.mkdir(path.dirname(filename), { recursive: true }).then(async () => {
										// 	await fs.promises.writeFile(filename, smg.toString());
										// 	await fs.promises.writeFile('/Users/jrieken/Code/vscode/src2/' + vinyl.relative, vinyl.contents);
										// });
									}
								}

								(vinyl as Vinyl & { sourceMap?: RawSourceMap }).sourceMap = sourceMap;
							}
						} files.push(vinyl);
					}

					resolve({
						fileName,
						signature,
						files
					});
				});
			});
		}

		const newErrors: { [path: string]: ts.Diagnostic[] } = Object.create(null);
		const t1 = Date.now();

		const toBeEmitted: string[] = [];
		const toBeCheckedSyntactically: string[] = [];
		const toBeCheckedSemantically: string[] = [];
		const filesWithChangedSignature: string[] = [];
		const dependentFiles: string[] = [];
		const newLastBuildVersion = new Map<string, string>();

		for (const fileName of host.getScriptFileNames()) {
			if (lastBuildVersion[fileName] !== host.getScriptVersion(fileName)) {

				toBeEmitted.push(fileName);
				toBeCheckedSyntactically.push(fileName);
				toBeCheckedSemantically.push(fileName);
			}
		}

		return new Promise<void>(resolve => {

			const semanticCheckInfo = new Map<string, number>();
			const seenAsDependentFile = new Set<string>();

			function workOnNext() {

				let promise: Promise<any> | undefined;
				// let fileName: string;

				// someone told us to stop this
				if (token.isCancellationRequested()) {
					_log('[CANCEL]', '>>This compile run was cancelled<<');
					newLastBuildVersion.clear();
					resolve();
					return;
				}

				// (1st) emit code
				else if (toBeEmitted.length) {
					const fileName = toBeEmitted.pop()!;
					promise = emitSoon(fileName).then(value => {

						for (const file of value.files) {
							_log('[emit code]', file.path);
							out(file);
						}

						// remember when this was build
						newLastBuildVersion.set(fileName, host.getScriptVersion(fileName));

						// remeber the signature
						if (value.signature && lastDtsHash[fileName] !== value.signature) {
							lastDtsHash[fileName] = value.signature;
							filesWithChangedSignature.push(fileName);
						}

						// line up for cycle check
						const jsValue = value.files.find(candidate => candidate.basename.endsWith('.js'));
						if (jsValue) {
							outHost.addScriptSnapshot(jsValue.path, new ScriptSnapshot(String(jsValue.contents), new Date()));
							toBeCheckedForCycles.push(normalize(jsValue.path));
						}

					}).catch(e => {
						// can't just skip this or make a result up..
						host.error(`ERROR emitting ${fileName}`);
						host.error(e);
					});
				}

				// (2nd) check syntax
				else if (toBeCheckedSyntactically.length) {
					const fileName = toBeCheckedSyntactically.pop()!;
					_log('[check syntax]', fileName);
					promise = checkSyntaxSoon(fileName).then(diagnostics => {
						delete oldErrors[fileName];
						if (diagnostics.length > 0) {
							diagnostics.forEach(d => onError(d));
							newErrors[fileName] = diagnostics;

							// stop the world when there are syntax errors
							toBeCheckedSyntactically.length = 0;
							toBeCheckedSemantically.length = 0;
							filesWithChangedSignature.length = 0;
						}
					});
				}

				// (3rd) check semantics
				else if (toBeCheckedSemantically.length) {

					let fileName = toBeCheckedSemantically.pop();
					while (fileName && semanticCheckInfo.has(fileName)) {
						fileName = toBeCheckedSemantically.pop()!;
					}

					if (fileName) {
						_log('[check semantics]', fileName);
						promise = checkSemanticsSoon(fileName).then(diagnostics => {
							delete oldErrors[fileName!];
							semanticCheckInfo.set(fileName!, diagnostics.length);
							if (diagnostics.length > 0) {
								diagnostics.forEach(d => onError(d));
								newErrors[fileName!] = diagnostics;
							}
						});
					}
				}

				// (4th) check dependents
				else if (filesWithChangedSignature.length) {
					while (filesWithChangedSignature.length) {
						const fileName = filesWithChangedSignature.pop()!;

						if (!isExternalModule(service.getProgram()!.getSourceFile(fileName)!)) {
							_log('[check semantics*]', fileName + ' is an internal module and it has changed shape -> check whatever hasn\'t been checked yet');
							toBeCheckedSemantically.push(...host.getScriptFileNames());
							filesWithChangedSignature.length = 0;
							dependentFiles.length = 0;
							break;
						}

						host.collectDependents(fileName, dependentFiles);
					}
				}

				// (5th) dependents contd
				else if (dependentFiles.length) {
					let fileName = dependentFiles.pop();
					while (fileName && seenAsDependentFile.has(fileName)) {
						fileName = dependentFiles.pop();
					}
					if (fileName) {
						seenAsDependentFile.add(fileName);
						const value = semanticCheckInfo.get(fileName);
						if (value === 0) {
							// already validated successfully -> look at dependents next
							host.collectDependents(fileName, dependentFiles);

						} else if (typeof value === 'undefined') {
							// first validate -> look at dependents next
							dependentFiles.push(fileName);
							toBeCheckedSemantically.push(fileName);
						}
					}
				}


				// (last) done
				else {
					resolve();
					return;
				}

				if (!promise) {
					promise = Promise.resolve();
				}

				promise.then(function () {
					// change to change
					process.nextTick(workOnNext);
				}).catch(err => {
					console.error(err);
				});
			}

			workOnNext();

		}).then(() => {
			// check for cyclic dependencies
			const cycles = outHost.getCyclicDependencies(toBeCheckedForCycles);
			toBeCheckedForCycles.length = 0;

			for (const [filename, error] of cycles) {
				const cyclicDepErrors: ts.Diagnostic[] = [];
				if (error) {
					cyclicDepErrors.push({
						category: ts.DiagnosticCategory.Error,
						code: 1,
						file: undefined,
						start: undefined,
						length: undefined,
						messageText: `CYCLIC dependency: ${error}`
					});
				}
				delete oldErrors[filename];
				newErrors[filename] = cyclicDepErrors;
				cyclicDepErrors.forEach(d => onError(d));
			}

		}).then(() => {

			// store the build versions to not rebuilt the next time
			newLastBuildVersion.forEach((value, key) => {
				lastBuildVersion[key] = value;
			});

			// print old errors and keep them
			for (const [key, value] of Object.entries(oldErrors)) {
				value.forEach(diag => onError(diag));
				newErrors[key] = value;
			}
			oldErrors = newErrors;

			// print stats
			const headNow = process.memoryUsage().heapUsed;
			const MB = 1024 * 1024;
			_log(
				'[tsb]',
				`time:  ${colors.yellow((Date.now() - t1) + 'ms')} + \nmem:  ${colors.cyan(Math.ceil(headNow / MB) + 'MB')} ${colors.bgCyan('delta: ' + Math.ceil((headNow - headUsed) / MB))}`
			);
			headUsed = headNow;
		});
	}

	return {
		file,
		build,
		languageService: service
	};
}

class ScriptSnapshot implements ts.IScriptSnapshot {

	private readonly _text: string;
	private readonly _mtime: Date;

	constructor(text: string, mtime: Date) {
		this._text = text;
		this._mtime = mtime;
	}

	getVersion(): string {
		return this._mtime.toUTCString();
	}

	getText(start: number, end: number): string {
		return this._text.substring(start, end);
	}

	getLength(): number {
		return this._text.length;
	}

	getChangeRange(_oldSnapshot: ts.IScriptSnapshot): ts.TextChangeRange | undefined {
		return undefined;
	}
}

class VinylScriptSnapshot extends ScriptSnapshot {

	private readonly _base: string;

	readonly sourceMap?: RawSourceMap;

	constructor(file: Vinyl & { sourceMap?: RawSourceMap }) {
		super(file.contents!.toString(), file.stat!.mtime);
		this._base = file.base;
		this.sourceMap = file.sourceMap;
	}

	getBase(): string {
		return this._base;
	}
}

class LanguageServiceHost implements ts.LanguageServiceHost {

	private readonly _snapshots: { [path: string]: ScriptSnapshot };
	private readonly _filesInProject: Set<string>;
	private readonly _filesAdded: Set<string>;
	private readonly _dependencies: InstanceType<typeof utils.graph.Graph<string>>;
	private readonly _dependenciesRecomputeList: string[];
	private readonly _fileNameToDeclaredModule: { [path: string]: string[] };

	private _projectVersion: number;
	private readonly _cmdLine: ts.ParsedCommandLine;
	private readonly _projectPath: string;
	private readonly _log: (topic: string, message: string) => void;

	constructor(
		cmdLine: ts.ParsedCommandLine,
		projectPath: string,
		log: (topic: string, message: string) => void
	) {
		this._cmdLine = cmdLine;
		this._projectPath = projectPath;
		this._log = log;
		this._snapshots = Object.create(null);
		this._filesInProject = new Set(this._cmdLine.fileNames);
		this._filesAdded = new Set();
		this._dependencies = new utils.graph.Graph<string>();
		this._dependenciesRecomputeList = [];
		this._fileNameToDeclaredModule = Object.create(null);

		this._projectVersion = 1;
	}

	log(_s: string): void {
		// console.log(s);
	}

	trace(_s: string): void {
		// console.log(s);
	}

	error(s: string): void {
		console.error(s);
	}

	getCompilationSettings(): ts.CompilerOptions {
		return this._cmdLine.options;
	}

	getProjectVersion(): string {
		return String(this._projectVersion);
	}

	getScriptFileNames(): string[] {
		const res = Object.keys(this._snapshots).filter(path => this._filesInProject.has(path) || this._filesAdded.has(path));
		return res;
	}

	getScriptVersion(filename: string): string {
		filename = normalize(filename);
		const result = this._snapshots[filename];
		if (result) {
			return result.getVersion();
		}
		return 'UNKNWON_FILE_' + Math.random().toString(16).slice(2);
	}

	getScriptSnapshot(filename: string, resolve: boolean = true): ScriptSnapshot {
		filename = normalize(filename);
		let result = this._snapshots[filename];
		if (!result && resolve) {
			try {
				result = new VinylScriptSnapshot(new Vinyl({
					path: filename,
					contents: fs.readFileSync(filename),
					base: this.getCompilationSettings().outDir,
					stat: fs.statSync(filename)
				}));
				this.addScriptSnapshot(filename, result);
			} catch (e) {
				// ignore
			}
		}
		return result;
	}

	private static _declareModule = /declare\s+module\s+('|")(.+)\1/g;

	addScriptSnapshot(filename: string, snapshot: ScriptSnapshot): ScriptSnapshot {
		this._projectVersion++;
		filename = normalize(filename);
		const old = this._snapshots[filename];
		if (!old && !this._filesInProject.has(filename) && !filename.endsWith('.d.ts')) {
			//                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^
			//                                              not very proper!
			this._filesAdded.add(filename);
		}
		if (!old || old.getVersion() !== snapshot.getVersion()) {
			this._dependenciesRecomputeList.push(filename);

			// (cheap) check for declare module
			LanguageServiceHost._declareModule.lastIndex = 0;
			let match: RegExpExecArray | null | undefined;
			while ((match = LanguageServiceHost._declareModule.exec(snapshot.getText(0, snapshot.getLength())))) {
				let declaredModules = this._fileNameToDeclaredModule[filename];
				if (!declaredModules) {
					this._fileNameToDeclaredModule[filename] = declaredModules = [];
				}
				declaredModules.push(match[2]);
			}
		}
		this._snapshots[filename] = snapshot;
		return old;
	}

	removeScriptSnapshot(filename: string): boolean {
		filename = normalize(filename);
		this._log('removeScriptSnapshot', filename);
		this._filesInProject.delete(filename);
		this._filesAdded.delete(filename);
		this._projectVersion++;
		delete this._fileNameToDeclaredModule[filename];
		return delete this._snapshots[filename];
	}

	getCurrentDirectory(): string {
		return path.dirname(this._projectPath);
	}

	getDefaultLibFileName(options: ts.CompilerOptions): string {
		return ts.getDefaultLibFilePath(options);
	}

	readonly directoryExists = ts.sys.directoryExists;
	readonly getDirectories = ts.sys.getDirectories;
	readonly fileExists = ts.sys.fileExists;
	readonly readFile = ts.sys.readFile;
	readonly readDirectory = ts.sys.readDirectory;

	// ---- dependency management

	collectDependents(filename: string, target: string[]): void {
		while (this._dependenciesRecomputeList.length) {
			this._processFile(this._dependenciesRecomputeList.pop()!);
		}
		filename = normalize(filename);
		const node = this._dependencies.lookup(filename);
		if (node) {
			node.incoming.forEach((entry: any) => target.push(entry.data));
		}
	}

	getCyclicDependencies(filenames: string[]): Map<string, string | undefined> {
		// Ensure dependencies are up to date
		while (this._dependenciesRecomputeList.length) {
			this._processFile(this._dependenciesRecomputeList.pop()!);
		}
		const cycles = this._dependencies.findCycles(filenames.sort((a, b) => a.localeCompare(b)));
		const result = new Map<string, string | undefined>();
		for (const [key, value] of cycles) {
			result.set(key, value?.join(' -> '));
		}
		return result;
	}

	_processFile(filename: string): void {
		if (filename.match(/.*\.d\.ts$/)) {
			return;
		}
		filename = normalize(filename);
		const snapshot = this.getScriptSnapshot(filename);
		if (!snapshot) {
			this._log('processFile', `Missing snapshot for: ${filename}`);
			return;
		}
		const info = ts.preProcessFile(snapshot.getText(0, snapshot.getLength()), true);

		// (0) clear out old dependencies
		this._dependencies.resetNode(filename);

		// (1) ///-references
		info.referencedFiles.forEach(ref => {
			const resolvedPath = path.resolve(path.dirname(filename), ref.fileName);
			const normalizedPath = normalize(resolvedPath);

			this._dependencies.inertEdge(filename, normalizedPath);
		});

		// (2) import-require statements
		info.importedFiles.forEach(ref => {

			if (!ref.fileName.startsWith('.')) {
				// node module?
				return;
			}
			if (ref.fileName.endsWith('.css')) {
				return;
			}

			const stopDirname = normalize(this.getCurrentDirectory());
			let dirname = filename;
			let found = false;


			while (!found && dirname.indexOf(stopDirname) === 0) {
				dirname = path.dirname(dirname);
				let resolvedPath = path.resolve(dirname, ref.fileName);
				if (resolvedPath.endsWith('.js')) {
					resolvedPath = resolvedPath.slice(0, -3);
				}
				const normalizedPath = normalize(resolvedPath);

				if (this.getScriptSnapshot(normalizedPath + '.ts')) {
					this._dependencies.inertEdge(filename, normalizedPath + '.ts');
					found = true;

				} else if (this.getScriptSnapshot(normalizedPath + '.d.ts')) {
					this._dependencies.inertEdge(filename, normalizedPath + '.d.ts');
					found = true;

				} else if (this.getScriptSnapshot(normalizedPath + '.js')) {
					this._dependencies.inertEdge(filename, normalizedPath + '.js');
					found = true;
				}
			}

			if (!found) {
				for (const key in this._fileNameToDeclaredModule) {
					if (this._fileNameToDeclaredModule[key] && ~this._fileNameToDeclaredModule[key].indexOf(ref.fileName)) {
						this._dependencies.inertEdge(filename, key);
					}
				}
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/tsb/index.ts]---
Location: vscode-main/build/lib/tsb/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Vinyl from 'vinyl';
import through from 'through';
import * as builder from './builder.ts';
import ts from 'typescript';
import { Readable, Writable, Duplex } from 'stream';
import { dirname } from 'path';
import { strings } from './utils.ts';
import { readFileSync, statSync } from 'fs';
import log from 'fancy-log';
import { ESBuildTranspiler, type ITranspiler, TscTranspiler } from './transpiler.ts';
import colors from 'ansi-colors';

export interface IncrementalCompiler {
	(token?: any): Readable & Writable;
	src(opts?: { cwd?: string; base?: string }): Readable;
}

class EmptyDuplex extends Duplex {
	_write(_chunk: any, _encoding: string, callback: (err?: Error) => void): void { callback(); }
	_read() { this.push(null); }
}

function createNullCompiler(): IncrementalCompiler {
	const result: IncrementalCompiler = function () { return new EmptyDuplex(); };
	result.src = () => new EmptyDuplex();
	return result;
}

const _defaultOnError = (err: string) => console.log(JSON.stringify(err, null, 4));

export function create(
	projectPath: string,
	existingOptions: Partial<ts.CompilerOptions>,
	config: { verbose?: boolean; transpileOnly?: boolean; transpileOnlyIncludesDts?: boolean; transpileWithEsbuild?: boolean },
	onError: (message: string) => void = _defaultOnError
): IncrementalCompiler {

	function printDiagnostic(diag: ts.Diagnostic | Error): void {

		if (diag instanceof Error) {
			onError(diag.message);
		} else if (!diag.file || !diag.start) {
			onError(ts.flattenDiagnosticMessageText(diag.messageText, '\n'));
		} else {
			const lineAndCh = diag.file.getLineAndCharacterOfPosition(diag.start);
			onError(strings.format('{0}({1},{2}): {3}',
				diag.file.fileName,
				lineAndCh.line + 1,
				lineAndCh.character + 1,
				ts.flattenDiagnosticMessageText(diag.messageText, '\n'))
			);
		}
	}

	const parsed = ts.readConfigFile(projectPath, ts.sys.readFile);
	if (parsed.error) {
		printDiagnostic(parsed.error);
		return createNullCompiler();
	}

	const cmdLine = ts.parseJsonConfigFileContent(parsed.config, ts.sys, dirname(projectPath), existingOptions);
	if (cmdLine.errors.length > 0) {
		cmdLine.errors.forEach(printDiagnostic);
		return createNullCompiler();
	}

	function logFn(topic: string, message: string): void {
		if (config.verbose) {
			log(colors.cyan(topic), message);
		}
	}

	// FULL COMPILE stream doing transpile, syntax and semantic diagnostics
	function createCompileStream(builder: builder.ITypeScriptBuilder, token?: builder.CancellationToken): Readable & Writable {

		return through(function (this: through.ThroughStream, file: Vinyl) {
			// give the file to the compiler
			if (file.isStream()) {
				this.emit('error', 'no support for streams');
				return;
			}
			builder.file(file);

		}, function (this: { queue(a: any): void }) {
			// start the compilation process
			builder.build(
				file => this.queue(file),
				printDiagnostic,
				token
			).catch(e => console.error(e)).then(() => this.queue(null));
		});
	}

	// TRANSPILE ONLY stream doing just TS to JS conversion
	function createTranspileStream(transpiler: ITranspiler): Readable & Writable {
		return through(function (this: through.ThroughStream & { queue(a: any): void }, file: Vinyl) {
			// give the file to the compiler
			if (file.isStream()) {
				this.emit('error', 'no support for streams');
				return;
			}
			if (!file.contents) {
				return;
			}
			if (!config.transpileOnlyIncludesDts && file.path.endsWith('.d.ts')) {
				return;
			}

			if (!transpiler.onOutfile) {
				transpiler.onOutfile = file => this.queue(file);
			}

			transpiler.transpile(file);

		}, function (this: { queue(a: any): void }) {
			transpiler.join().then(() => {
				this.queue(null);
				transpiler.onOutfile = undefined;
			});
		});
	}


	let result: IncrementalCompiler;
	if (config.transpileOnly) {
		const transpiler = !config.transpileWithEsbuild
			? new TscTranspiler(logFn, printDiagnostic, projectPath, cmdLine)
			: new ESBuildTranspiler(logFn, printDiagnostic, projectPath, cmdLine);
		result = (() => createTranspileStream(transpiler)) as IncrementalCompiler;
	} else {
		const _builder = builder.createTypeScriptBuilder({ logFn }, projectPath, cmdLine);
		result = ((token: builder.CancellationToken) => createCompileStream(_builder, token)) as IncrementalCompiler;
	}

	result.src = (opts?: { cwd?: string; base?: string }) => {
		let _pos = 0;
		const _fileNames = cmdLine.fileNames.slice(0);
		return new class extends Readable {
			constructor() {
				super({ objectMode: true });
			}
			_read() {
				let more: boolean = true;
				let path: string;
				for (; more && _pos < _fileNames.length; _pos++) {
					path = _fileNames[_pos];
					more = this.push(new Vinyl({
						path,
						contents: readFileSync(path),
						stat: statSync(path),
						cwd: opts && opts.cwd,
						base: opts && opts.base || dirname(projectPath)
					}));
				}
				if (_pos >= _fileNames.length) {
					this.push(null);
				}
			}
		};
	};

	return result as IncrementalCompiler;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/tsb/transpiler.ts]---
Location: vscode-main/build/lib/tsb/transpiler.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import esbuild from 'esbuild';
import ts from 'typescript';
import threads from 'node:worker_threads';
import Vinyl from 'vinyl';
import { cpus } from 'node:os';
import { getTargetStringFromTsConfig } from '../tsconfigUtils.ts';

interface TranspileReq {
	readonly tsSrcs: string[];
	readonly options: ts.TranspileOptions;
}

interface TranspileRes {
	readonly jsSrcs: string[];
	readonly diagnostics: ts.Diagnostic[][];
}

function transpile(tsSrc: string, options: ts.TranspileOptions): { jsSrc: string; diag: ts.Diagnostic[] } {

	const isAmd = /\n(import|export)/m.test(tsSrc);
	if (!isAmd && options.compilerOptions?.module === ts.ModuleKind.AMD) {
		// enforce NONE module-system for not-amd cases
		options = { ...options, ...{ compilerOptions: { ...options.compilerOptions, module: ts.ModuleKind.None } } };
	}
	const out = ts.transpileModule(tsSrc, options);
	return {
		jsSrc: out.outputText,
		diag: out.diagnostics ?? []
	};
}

if (!threads.isMainThread) {
	// WORKER
	threads.parentPort?.addListener('message', (req: TranspileReq) => {
		const res: TranspileRes = {
			jsSrcs: [],
			diagnostics: []
		};
		for (const tsSrc of req.tsSrcs) {
			const out = transpile(tsSrc, req.options);
			res.jsSrcs.push(out.jsSrc);
			res.diagnostics.push(out.diag);
		}
		threads.parentPort!.postMessage(res);
	});
}

class OutputFileNameOracle {

	readonly getOutputFileName: (name: string) => string;

	constructor(cmdLine: ts.ParsedCommandLine, configFilePath: string) {
		// very complicated logic to re-use TS internal functions to know the output path
		// given a TS input path and its config
		type InternalTsApi = typeof ts & {
			normalizePath(path: string): string;
			getOutputFileNames(commandLine: ts.ParsedCommandLine, inputFileName: string, ignoreCase: boolean): readonly string[];
		};
		this.getOutputFileName = (file) => {
			try {

				// windows: path-sep normalizing
				file = (ts as InternalTsApi).normalizePath(file);

				if (!cmdLine.options.configFilePath) {
					// this is needed for the INTERNAL getOutputFileNames-call below...
					cmdLine.options.configFilePath = configFilePath;
				}
				const isDts = file.endsWith('.d.ts');
				if (isDts) {
					file = file.slice(0, -5) + '.ts';
					cmdLine.fileNames.push(file);
				}
				const outfile = (ts as InternalTsApi).getOutputFileNames(cmdLine, file, true)[0];
				if (isDts) {
					cmdLine.fileNames.pop();
				}
				return outfile;

			} catch (err) {
				console.error(file, cmdLine.fileNames);
				console.error(err);
				throw err;
			}
		};
	}
}

class TranspileWorker {

	private static pool = 1;

	readonly id = TranspileWorker.pool++;

	private _worker = new threads.Worker(import.meta.filename);
	private _pending?: [resolve: Function, reject: Function, file: Vinyl[], options: ts.TranspileOptions, t1: number];
	private _durations: number[] = [];

	constructor(outFileFn: (fileName: string) => string) {

		this._worker.addListener('message', (res: TranspileRes) => {
			if (!this._pending) {
				console.error('RECEIVING data WITHOUT request');
				return;
			}

			const [resolve, reject, files, options, t1] = this._pending;

			const outFiles: Vinyl[] = [];
			const diag: ts.Diagnostic[] = [];

			for (let i = 0; i < res.jsSrcs.length; i++) {
				// inputs and outputs are aligned across the arrays
				const file = files[i];
				const jsSrc = res.jsSrcs[i];
				const diag = res.diagnostics[i];

				if (diag.length > 0) {
					diag.push(...diag);
					continue;
				}
				const SuffixTypes = {
					Dts: 5,
					Ts: 3,
					Unknown: 0
				} as const;
				const suffixLen = file.path.endsWith('.d.ts') ? SuffixTypes.Dts
					: file.path.endsWith('.ts') ? SuffixTypes.Ts
						: SuffixTypes.Unknown;

				// check if output of a DTS-files isn't just "empty" and iff so
				// skip this file
				if (suffixLen === SuffixTypes.Dts && _isDefaultEmpty(jsSrc)) {
					continue;
				}

				const outBase = options.compilerOptions?.outDir ?? file.base;
				const outPath = outFileFn(file.path);

				outFiles.push(new Vinyl({
					path: outPath,
					base: outBase,
					contents: Buffer.from(jsSrc),
				}));
			}

			this._pending = undefined;
			this._durations.push(Date.now() - t1);

			if (diag.length > 0) {
				reject(diag);
			} else {
				resolve(outFiles);
			}
		});
	}

	terminate() {
		// console.log(`Worker#${this.id} ENDS after ${this._durations.length} jobs (total: ${this._durations.reduce((p, c) => p + c, 0)}, avg: ${this._durations.reduce((p, c) => p + c, 0) / this._durations.length})`);
		this._worker.terminate();
	}

	get isBusy() {
		return this._pending !== undefined;
	}

	next(files: Vinyl[], options: ts.TranspileOptions) {
		if (this._pending !== undefined) {
			throw new Error('BUSY');
		}
		return new Promise<Vinyl[]>((resolve, reject) => {
			this._pending = [resolve, reject, files, options, Date.now()];
			const req: TranspileReq = {
				options,
				tsSrcs: files.map(file => String(file.contents))
			};
			this._worker.postMessage(req);
		});
	}
}

export interface ITranspiler {
	onOutfile?: (file: Vinyl) => void;
	join(): Promise<void>;
	transpile(file: Vinyl): void;
}

export class TscTranspiler implements ITranspiler {

	static P = Math.floor(cpus().length * .5);

	private readonly _outputFileNames: OutputFileNameOracle;


	public onOutfile?: (file: Vinyl) => void;

	private _workerPool: TranspileWorker[] = [];
	private _queue: Vinyl[] = [];
	private _allJobs: Promise<unknown>[] = [];

	private readonly _logFn: (topic: string, message: string) => void;
	private readonly _onError: (err: any) => void;
	private readonly _cmdLine: ts.ParsedCommandLine;

	constructor(
		logFn: (topic: string, message: string) => void,
		onError: (err: any) => void,
		configFilePath: string,
		cmdLine: ts.ParsedCommandLine
	) {
		this._logFn = logFn;
		this._onError = onError;
		this._cmdLine = cmdLine;
		this._logFn('Transpile', `will use ${TscTranspiler.P} transpile worker`);
		this._outputFileNames = new OutputFileNameOracle(this._cmdLine, configFilePath);
	}

	async join() {
		// wait for all penindg jobs
		this._consumeQueue();
		await Promise.allSettled(this._allJobs);
		this._allJobs.length = 0;

		// terminate all worker
		this._workerPool.forEach(w => w.terminate());
		this._workerPool.length = 0;
	}


	transpile(file: Vinyl) {

		if (this._cmdLine.options.noEmit) {
			// not doing ANYTHING here
			return;
		}

		const newLen = this._queue.push(file);
		if (newLen > TscTranspiler.P ** 2) {
			this._consumeQueue();
		}
	}

	private _consumeQueue(): void {

		if (this._queue.length === 0) {
			// no work...
			return;
		}

		// kinda LAZYily create workers
		if (this._workerPool.length === 0) {
			for (let i = 0; i < TscTranspiler.P; i++) {
				this._workerPool.push(new TranspileWorker(file => this._outputFileNames.getOutputFileName(file)));
			}
		}

		const freeWorker = this._workerPool.filter(w => !w.isBusy);
		if (freeWorker.length === 0) {
			// OK, they will pick up work themselves
			return;
		}

		for (const worker of freeWorker) {
			if (this._queue.length === 0) {
				break;
			}

			const job = new Promise(resolve => {

				const consume = () => {
					const files = this._queue.splice(0, TscTranspiler.P);
					if (files.length === 0) {
						// DONE
						resolve(undefined);
						return;
					}
					// work on the NEXT file
					// const [inFile, outFn] = req;
					worker.next(files, { compilerOptions: this._cmdLine.options }).then(outFiles => {
						if (this.onOutfile) {
							outFiles.map(this.onOutfile, this);
						}
						consume();
					}).catch(err => {
						this._onError(err);
					});
				};

				consume();
			});

			this._allJobs.push(job);
		}
	}
}

export class ESBuildTranspiler implements ITranspiler {

	private readonly _outputFileNames: OutputFileNameOracle;
	private _jobs: Promise<any>[] = [];

	onOutfile?: ((file: Vinyl) => void) | undefined;

	private readonly _transformOpts: esbuild.TransformOptions;
	private readonly _logFn: (topic: string, message: string) => void;
	private readonly _onError: (err: any) => void;
	private readonly _cmdLine: ts.ParsedCommandLine;

	constructor(
		logFn: (topic: string, message: string) => void,
		onError: (err: any) => void,
		configFilePath: string,
		cmdLine: ts.ParsedCommandLine
	) {
		this._logFn = logFn;
		this._onError = onError;
		this._cmdLine = cmdLine;
		this._logFn('Transpile', `will use ESBuild to transpile source files`);
		this._outputFileNames = new OutputFileNameOracle(this._cmdLine, configFilePath);

		const isExtension = configFilePath.includes('extensions');

		const target = getTargetStringFromTsConfig(configFilePath);

		this._transformOpts = {
			target: [target],
			format: isExtension ? 'cjs' : 'esm',
			platform: isExtension ? 'node' : undefined,
			loader: 'ts',
			sourcemap: 'inline',
			tsconfigRaw: JSON.stringify({
				compilerOptions: {
					...this._cmdLine.options,
					...{
						module: isExtension ? ts.ModuleKind.CommonJS : undefined
					} satisfies ts.CompilerOptions
				}
			}),
			supported: {
				'class-static-blocks': false, // SEE https://github.com/evanw/esbuild/issues/3823,
				'dynamic-import': !isExtension, // see https://github.com/evanw/esbuild/issues/1281
				'class-field': !isExtension
			}
		};
	}

	async join(): Promise<void> {
		const jobs = this._jobs.slice();
		this._jobs.length = 0;
		await Promise.allSettled(jobs);
	}

	transpile(file: Vinyl): void {
		if (!(file.contents instanceof Buffer)) {
			throw Error('file.contents must be a Buffer');
		}
		const t1 = Date.now();
		this._jobs.push(esbuild.transform(file.contents, {
			...this._transformOpts,
			sourcefile: file.path,
		}).then(result => {

			// check if output of a DTS-files isn't just "empty" and iff so
			// skip this file
			if (file.path.endsWith('.d.ts') && _isDefaultEmpty(result.code)) {
				return;
			}

			const outBase = this._cmdLine.options.outDir ?? file.base;
			const outPath = this._outputFileNames.getOutputFileName(file.path);

			this.onOutfile!(new Vinyl({
				path: outPath,
				base: outBase,
				contents: Buffer.from(result.code),
			}));

			this._logFn('Transpile', `esbuild took ${Date.now() - t1}ms for ${file.path}`);

		}).catch(err => {
			this._onError(err);
		}));
	}
}

function _isDefaultEmpty(src: string): boolean {
	return src
		.replace('"use strict";', '')
		.replace(/\/\/# sourceMappingURL.*^/, '')
		.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
		.trim().length === 0;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/tsb/utils.ts]---
Location: vscode-main/build/lib/tsb/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const strings = (() => {

    function format(value: string, ...rest: unknown[]): string {
        return value.replace(/(\{\d+\})/g, function (match) {
            const index = Number(match.substring(1, match.length - 1));
            return String(rest[index]) || match;
        });
    }

    return { format };
})();

export const graph = (() => {

    class Node<T> {

        readonly incoming = new Map<T, Node<T>>();
        readonly outgoing = new Map<T, Node<T>>();
        readonly data: T;

        constructor(data: T) {
            this.data = data;
        }
    }

    class Graph<T> {

        private _nodes = new Map<T, Node<T>>();

        inertEdge(from: T, to: T): void {
            const fromNode = this.lookupOrInsertNode(from);
            const toNode = this.lookupOrInsertNode(to);

            fromNode.outgoing.set(toNode.data, toNode);
            toNode.incoming.set(fromNode.data, fromNode);
        }

        resetNode(data: T): void {
            const node = this._nodes.get(data);
            if (!node) {
                return;
            }
            for (const outDep of node.outgoing.values()) {
                outDep.incoming.delete(node.data);
            }
            node.outgoing.clear();
        }

        lookupOrInsertNode(data: T): Node<T> {
            let node = this._nodes.get(data);

            if (!node) {
                node = new Node(data);
                this._nodes.set(data, node);
            }

            return node;
        }

        lookup(data: T): Node<T> | null {
            return this._nodes.get(data) ?? null;
        }

        findCycles(allData: T[]): Map<T, T[] | undefined> {
            const result = new Map<T, T[] | undefined>();
            const checked = new Set<T>();
            for (const data of allData) {
                const node = this.lookup(data);
                if (!node) {
                    continue;
                }
                const r = this._findCycle(node, checked, new Set());
                result.set(node.data, r);
            }
            return result;
        }

        private _findCycle(node: Node<T>, checked: Set<T>, seen: Set<T>): T[] | undefined {

            if (checked.has(node.data)) {
                return undefined;
            }

            let result: T[] | undefined;
            for (const child of node.outgoing.values()) {
                if (seen.has(child.data)) {
                    const seenArr = Array.from(seen);
                    const idx = seenArr.indexOf(child.data);
                    seenArr.push(child.data);
                    return idx > 0 ? seenArr.slice(idx) : seenArr;
                }
                seen.add(child.data);
                result = this._findCycle(child, checked, seen);
                seen.delete(child.data);
                if (result) {
                    break;
                }
            }
            checked.add(node.data);
            return result;
        }
    }

    return { Node, Graph };
})();
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/asar.d.ts]---
Location: vscode-main/build/lib/typings/asar.d.ts

```typescript
declare module 'asar/lib/filesystem.js' {

	export default class AsarFilesystem {
		readonly header: unknown;
		constructor(src: string);
		insertDirectory(path: string, shouldUnpack?: boolean): unknown;
		insertFile(path: string, shouldUnpack: boolean, file: { stat: { size: number; mode: number } }, options: {}): Promise<void>;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/cgmanifest.json]---
Location: vscode-main/build/lib/typings/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "definitelytyped",
					"repositoryUrl": "https://github.com/DefinitelyTyped/DefinitelyTyped",
					"commitHash": "69e3ac6bec3008271f76bbfa7cf69aa9198c4ff0"
				}
			},
			"license": "MIT"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/chromium-pickle-js.d.ts]---
Location: vscode-main/build/lib/typings/chromium-pickle-js.d.ts

```typescript
declare module 'chromium-pickle-js' {
	export interface Pickle {
		writeString(value: string): void;
		writeUInt32(value: number): void;

		toBuffer(): Buffer;
	}

	export function createEmpty(): Pickle;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/event-stream.d.ts]---
Location: vscode-main/build/lib/typings/event-stream.d.ts

```typescript
declare module "event-stream" {
	import { Stream } from 'stream';
	import { ThroughStream as _ThroughStream } from 'through';
	import File from 'vinyl';

	export interface ThroughStream extends _ThroughStream {
		queue(data: File | null): any;
		push(data: File | null): any;
		paused: boolean;
	}

	function merge(streams: Stream[]): ThroughStream;
	function merge(...streams: Stream[]): ThroughStream;
	function concat(...stream: Stream[]): ThroughStream;
	function duplex(istream: Stream, ostream: Stream): ThroughStream;

	function through(write?: (this: ThroughStream, data: any) => void, end?: (this: ThroughStream) => void,
		opts?: { autoDestroy: boolean; }): ThroughStream;

	function readArray<T>(array: T[]): ThroughStream;
	function writeArray<T>(cb: (err: Error, array: T[]) => void): ThroughStream;

	function mapSync<I, O>(cb: (data: I) => O): ThroughStream;
	function map<I, O>(cb: (data: I, cb: (err?: Error, data?: O) => void) => O): ThroughStream;

	function readable(asyncFunction: (this: ThroughStream, ...args: unknown[]) => any): any;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-azure-storage.d.ts]---
Location: vscode-main/build/lib/typings/gulp-azure-storage.d.ts

```typescript
declare module 'gulp-azure-storage' {
	import { ThroughStream } from 'event-stream';

	export function upload(options: any): ThroughStream;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-bom.d.ts]---
Location: vscode-main/build/lib/typings/gulp-bom.d.ts

```typescript

declare module "gulp-bom" {
	function f(): NodeJS.ReadWriteStream;

	/**
	 * This is required as per:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-buffer.d.ts]---
Location: vscode-main/build/lib/typings/gulp-buffer.d.ts

```typescript

declare module "gulp-buffer" {
	function f(): NodeJS.ReadWriteStream;

	/**
	 * This is required as per:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-gunzip.d.ts]---
Location: vscode-main/build/lib/typings/gulp-gunzip.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gulp-gunzip' {
	import type { Transform } from 'stream';

	/**
	 * Gunzip plugin for gulp
	 */
	function gunzip(): Transform;

	export = gunzip;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-untar.d.ts]---
Location: vscode-main/build/lib/typings/gulp-untar.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'gulp-untar' {
	import type { Transform } from 'stream';

	function untar(): Transform;

	export = untar;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/gulp-vinyl-zip.d.ts]---
Location: vscode-main/build/lib/typings/gulp-vinyl-zip.d.ts

```typescript

declare module 'gulp-vinyl-zip' {
	export function src(): NodeJS.ReadWriteStream;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/rcedit.d.ts]---
Location: vscode-main/build/lib/typings/rcedit.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'rcedit' {
	export default function rcedit(exePath, options, cb): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/stream.d.ts]---
Location: vscode-main/build/lib/typings/stream.d.ts

```typescript
declare namespace NodeJS {
	type ComposeFnParam = (source: any) => void;
	interface ReadWriteStream {
		compose<T extends NodeJS.ReadableStream>(
			stream: T | ComposeFnParam | Iterable<T> | AsyncIterable<T>,
			options?: { signal: AbortSignal },
		): T;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/ternary-stream.d.ts]---
Location: vscode-main/build/lib/typings/ternary-stream.d.ts

```typescript
declare module 'ternary-stream' {
	import File = require('vinyl');
	function f(check: (f: File) => boolean, onTrue: NodeJS.ReadWriteStream, opnFalse?: NodeJS.ReadWriteStream): NodeJS.ReadWriteStream;

	/**
	 * This is required as per:
	 * https://github.com/microsoft/TypeScript/issues/5073
	 */
	namespace f {}

	export = f;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/vscode-gulp-watch.d.ts]---
Location: vscode-main/build/lib/typings/vscode-gulp-watch.d.ts

```typescript
declare module 'vscode-gulp-watch' {
	export default function watch(...args: any[]): any;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/typings/@vscode/gulp-electron.d.ts]---
Location: vscode-main/build/lib/typings/@vscode/gulp-electron.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module '@vscode/gulp-electron' {

	interface MainFunction {
		(options: any): NodeJS.ReadWriteStream;
		dest(destination: string, options: any): NodeJS.ReadWriteStream;
	}

	const main: MainFunction;
	export default main;
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/watch/index.ts]---
Location: vscode-main/build/lib/watch/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const watch = process.platform === 'win32' ? require('./watch-win32.ts').default : require('vscode-gulp-watch');

export default function (...args: any[]): ReturnType<typeof watch> {
	return watch.apply(null, args);
}
```

--------------------------------------------------------------------------------

---[FILE: build/lib/watch/watch-win32.ts]---
Location: vscode-main/build/lib/watch/watch-win32.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import path from 'path';
import cp from 'child_process';
import fs from 'fs';
import File from 'vinyl';
import es from 'event-stream';
import filter from 'gulp-filter';
import { Stream } from 'stream';

const watcherPath = path.join(import.meta.dirname, 'watcher.exe');

function toChangeType(type: '0' | '1' | '2'): 'change' | 'add' | 'unlink' {
	switch (type) {
		case '0': return 'change';
		case '1': return 'add';
		default: return 'unlink';
	}
}

function watch(root: string): Stream {
	const result = es.through();
	let child: cp.ChildProcess | null = cp.spawn(watcherPath, [root]);

	child.stdout!.on('data', function (data) {
		const lines: string[] = data.toString('utf8').split('\n');
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i].trim();
			if (line.length === 0) {
				continue;
			}

			const changeType = line[0] as '0' | '1' | '2';
			const changePath = line.substr(2);

			// filter as early as possible
			if (/^\.git/.test(changePath) || /(^|\\)out($|\\)/.test(changePath)) {
				continue;
			}

			const changePathFull = path.join(root, changePath);

			const file = new File({
				path: changePathFull,
				base: root
			});
			file.event = toChangeType(changeType);
			result.emit('data', file);
		}
	});

	child.stderr!.on('data', function (data) {
		result.emit('error', data);
	});

	child.on('exit', function (code) {
		result.emit('error', 'Watcher died with code ' + code);
		child = null;
	});

	process.once('SIGTERM', function () { process.exit(0); });
	process.once('SIGTERM', function () { process.exit(0); });
	process.once('exit', function () { if (child) { child.kill(); } });

	return result;
}

const cache: { [cwd: string]: Stream } = Object.create(null);

export default function (pattern: string | string[] | filter.FileFunction, options?: { cwd?: string; base?: string; dot?: boolean }) {
	options = options || {};

	const cwd = path.normalize(options.cwd || process.cwd());
	let watcher = cache[cwd];

	if (!watcher) {
		watcher = cache[cwd] = watch(cwd);
	}

	const rebase = !options.base ? es.through() : es.mapSync(function (f: File) {
		f.base = options!.base!;
		return f;
	});

	return watcher
		.pipe(filter(['**', '!.git{,/**}'], { dot: options.dot })) // ignore all things git
		.pipe(filter(pattern, { dot: options.dot }))
		.pipe(es.map(function (file: File, cb) {
			fs.stat(file.path, function (err, stat) {
				if (err && err.code === 'ENOENT') { return cb(undefined, file); }
				if (err) { return cb(); }
				if (!stat.isFile()) { return cb(); }

				fs.readFile(file.path, function (err, contents) {
					if (err && err.code === 'ENOENT') { return cb(undefined, file); }
					if (err) { return cb(); }

					file.contents = contents;
					file.stat = stat;
					cb(undefined, file);
				});
			});
		}))
		.pipe(rebase);
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/dependencies-generator.ts]---
Location: vscode-main/build/linux/dependencies-generator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { spawnSync } from 'child_process';
import path from 'path';
import { getChromiumSysroot, getVSCodeSysroot } from './debian/install-sysroot.ts';
import { generatePackageDeps as generatePackageDepsDebian } from './debian/calculate-deps.ts';
import { generatePackageDeps as generatePackageDepsRpm } from './rpm/calculate-deps.ts';
import { referenceGeneratedDepsByArch as debianGeneratedDeps } from './debian/dep-lists.ts';
import { referenceGeneratedDepsByArch as rpmGeneratedDeps } from './rpm/dep-lists.ts';
import { type DebianArchString, isDebianArchString } from './debian/types.ts';
import { isRpmArchString, type RpmArchString } from './rpm/types.ts';
import product from '../../product.json' with { type: 'json' };

// A flag that can easily be toggled.
// Make sure to compile the build directory after toggling the value.
// If false, we warn about new dependencies if they show up
// while running the prepare package tasks for a release.
// If true, we fail the build if there are new dependencies found during that task.
// The reference dependencies, which one has to update when the new dependencies
// are valid, are in dep-lists.ts
const FAIL_BUILD_FOR_NEW_DEPENDENCIES: boolean = true;

// Based on https://source.chromium.org/chromium/chromium/src/+/refs/tags/142.0.7444.235:chrome/installer/linux/BUILD.gn;l=64-80
// and the Linux Archive build
// Shared library dependencies that we already bundle.
const bundledDeps = [
	'libEGL.so',
	'libGLESv2.so',
	'libvulkan.so.1',
	'libvk_swiftshader.so',
	'libffmpeg.so'
];

export async function getDependencies(packageType: 'deb' | 'rpm', buildDir: string, applicationName: string, arch: string): Promise<string[]> {
	if (packageType === 'deb') {
		if (!isDebianArchString(arch)) {
			throw new Error('Invalid Debian arch string ' + arch);
		}
	}
	if (packageType === 'rpm' && !isRpmArchString(arch)) {
		throw new Error('Invalid RPM arch string ' + arch);
	}

	// Get the files for which we want to find dependencies.
	const canAsar = false; // TODO@esm ASAR disabled in ESM
	const nativeModulesPath = path.join(buildDir, 'resources', 'app', canAsar ? 'node_modules.asar.unpacked' : 'node_modules');
	const findResult = spawnSync('find', [nativeModulesPath, '-name', '*.node']);
	if (findResult.status) {
		console.error('Error finding files:');
		console.error(findResult.stderr.toString());
		return [];
	}

	const appPath = path.join(buildDir, applicationName);
	// Add the native modules
	const files = findResult.stdout.toString().trimEnd().split('\n');
	// Add the tunnel binary.
	files.push(path.join(buildDir, 'bin', product.tunnelApplicationName));
	// Add the main executable.
	files.push(appPath);
	// Add chrome sandbox and crashpad handler.
	files.push(path.join(buildDir, 'chrome-sandbox'));
	files.push(path.join(buildDir, 'chrome_crashpad_handler'));

	// Generate the dependencies.
	let dependencies: Set<string>[];
	if (packageType === 'deb') {
		const chromiumSysroot = await getChromiumSysroot(arch as DebianArchString);
		const vscodeSysroot = await getVSCodeSysroot(arch as DebianArchString);
		dependencies = generatePackageDepsDebian(files, arch as DebianArchString, chromiumSysroot, vscodeSysroot);
	} else {
		dependencies = generatePackageDepsRpm(files);
	}

	// Merge all the dependencies.
	const mergedDependencies = mergePackageDeps(dependencies);

	// Exclude bundled dependencies and sort
	const sortedDependencies: string[] = Array.from(mergedDependencies).filter(dependency => {
		return !bundledDeps.some(bundledDep => dependency.startsWith(bundledDep));
	}).sort();

	const referenceGeneratedDeps = packageType === 'deb' ?
		debianGeneratedDeps[arch as DebianArchString] :
		rpmGeneratedDeps[arch as RpmArchString];
	if (JSON.stringify(sortedDependencies) !== JSON.stringify(referenceGeneratedDeps)) {
		const failMessage = 'The dependencies list has changed.'
			+ '\nOld:\n' + referenceGeneratedDeps.join('\n')
			+ '\nNew:\n' + sortedDependencies.join('\n');
		if (FAIL_BUILD_FOR_NEW_DEPENDENCIES) {
			throw new Error(failMessage);
		} else {
			console.warn(failMessage);
		}
	}

	return sortedDependencies;
}


// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/rpm/merge_package_deps.py.
function mergePackageDeps(inputDeps: Set<string>[]): Set<string> {
	const requires = new Set<string>();
	for (const depSet of inputDeps) {
		for (const dep of depSet) {
			const trimmedDependency = dep.trim();
			if (trimmedDependency.length && !trimmedDependency.startsWith('#')) {
				requires.add(trimmedDependency);
			}
		}
	}
	return requires;
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/libcxx-fetcher.ts]---
Location: vscode-main/build/linux/libcxx-fetcher.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Can be removed once https://github.com/electron/electron-rebuild/pull/703 is available.

import fs from 'fs';
import path from 'path';
import debug from 'debug';
import extract from 'extract-zip';
import { downloadArtifact } from '@electron/get';

const root = path.dirname(path.dirname(import.meta.dirname));

const d = debug('libcxx-fetcher');

export async function downloadLibcxxHeaders(outDir: string, electronVersion: string, lib_name: string): Promise<void> {
	if (await fs.existsSync(path.resolve(outDir, 'include'))) {
		return;
	}
	if (!await fs.existsSync(outDir)) {
		await fs.mkdirSync(outDir, { recursive: true });
	}

	d(`downloading ${lib_name}_headers`);
	const headers = await downloadArtifact({
		version: electronVersion,
		isGeneric: true,
		artifactName: `${lib_name}_headers.zip`,
	});

	d(`unpacking ${lib_name}_headers from ${headers}`);
	await extract(headers, { dir: outDir });
}

export async function downloadLibcxxObjects(outDir: string, electronVersion: string, targetArch: string = 'x64'): Promise<void> {
	if (await fs.existsSync(path.resolve(outDir, 'libc++.a'))) {
		return;
	}
	if (!await fs.existsSync(outDir)) {
		await fs.mkdirSync(outDir, { recursive: true });
	}

	d(`downloading libcxx-objects-linux-${targetArch}`);
	const objects = await downloadArtifact({
		version: electronVersion,
		platform: 'linux',
		artifactName: 'libcxx-objects',
		arch: targetArch,
	});

	d(`unpacking libcxx-objects from ${objects}`);
	await extract(objects, { dir: outDir });
}

async function main(): Promise<void> {
	const libcxxObjectsDirPath = process.env['VSCODE_LIBCXX_OBJECTS_DIR'];
	const libcxxHeadersDownloadDir = process.env['VSCODE_LIBCXX_HEADERS_DIR'];
	const libcxxabiHeadersDownloadDir = process.env['VSCODE_LIBCXXABI_HEADERS_DIR'];
	const arch = process.env['VSCODE_ARCH'];
	const packageJSON = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
	const electronVersion = packageJSON.devDependencies.electron;

	if (!libcxxObjectsDirPath || !libcxxHeadersDownloadDir || !libcxxabiHeadersDownloadDir) {
		throw new Error('Required build env not set');
	}

	await downloadLibcxxObjects(libcxxObjectsDirPath, electronVersion, arch);
	await downloadLibcxxHeaders(libcxxHeadersDownloadDir, electronVersion, 'libcxx');
	await downloadLibcxxHeaders(libcxxabiHeadersDownloadDir, electronVersion, 'libcxxabi');
}

if (import.meta.main) {
	main().catch(err => {
		console.error(err);
		process.exit(1);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/debian/calculate-deps.ts]---
Location: vscode-main/build/linux/debian/calculate-deps.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawnSync } from 'child_process';
import { constants, statSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import manifests from '../../../cgmanifest.json' with { type: 'json' };
import { additionalDeps } from './dep-lists.ts';
import type { DebianArchString } from './types.ts';

export function generatePackageDeps(files: string[], arch: DebianArchString, chromiumSysroot: string, vscodeSysroot: string): Set<string>[] {
	const dependencies: Set<string>[] = files.map(file => calculatePackageDeps(file, arch, chromiumSysroot, vscodeSysroot));
	const additionalDepsSet = new Set(additionalDeps);
	dependencies.push(additionalDepsSet);
	return dependencies;
}

// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/calculate_package_deps.py.
function calculatePackageDeps(binaryPath: string, arch: DebianArchString, chromiumSysroot: string, vscodeSysroot: string): Set<string> {
	try {
		if (!(statSync(binaryPath).mode & constants.S_IXUSR)) {
			throw new Error(`Binary ${binaryPath} needs to have an executable bit set.`);
		}
	} catch (e) {
		// The package might not exist. Don't re-throw the error here.
		console.error('Tried to stat ' + binaryPath + ' but failed.');
	}

	// Get the Chromium dpkg-shlibdeps file.
	const chromiumManifest = manifests.registrations.filter(registration => {
		return registration.component.type === 'git' && registration.component.git!.name === 'chromium';
	});
	const dpkgShlibdepsUrl = `https://raw.githubusercontent.com/chromium/chromium/${chromiumManifest[0].version}/third_party/dpkg-shlibdeps/dpkg-shlibdeps.pl`;
	const dpkgShlibdepsScriptLocation = `${tmpdir()}/dpkg-shlibdeps.pl`;
	const result = spawnSync('curl', [dpkgShlibdepsUrl, '-o', dpkgShlibdepsScriptLocation]);
	if (result.status !== 0) {
		throw new Error('Cannot retrieve dpkg-shlibdeps. Stderr:\n' + result.stderr);
	}
	const cmd = [dpkgShlibdepsScriptLocation, '--ignore-weak-undefined'];
	switch (arch) {
		case 'amd64':
			cmd.push(`-l${chromiumSysroot}/usr/lib/x86_64-linux-gnu`,
				`-l${chromiumSysroot}/lib/x86_64-linux-gnu`,
				`-l${vscodeSysroot}/usr/lib/x86_64-linux-gnu`,
				`-l${vscodeSysroot}/lib/x86_64-linux-gnu`);
			break;
		case 'armhf':
			cmd.push(`-l${chromiumSysroot}/usr/lib/arm-linux-gnueabihf`,
				`-l${chromiumSysroot}/lib/arm-linux-gnueabihf`,
				`-l${vscodeSysroot}/usr/lib/arm-linux-gnueabihf`,
				`-l${vscodeSysroot}/lib/arm-linux-gnueabihf`);
			break;
		case 'arm64':
			cmd.push(`-l${chromiumSysroot}/usr/lib/aarch64-linux-gnu`,
				`-l${chromiumSysroot}/lib/aarch64-linux-gnu`,
				`-l${vscodeSysroot}/usr/lib/aarch64-linux-gnu`,
				`-l${vscodeSysroot}/lib/aarch64-linux-gnu`);
			break;
	}
	cmd.push(`-l${chromiumSysroot}/usr/lib`);
	cmd.push(`-L${vscodeSysroot}/debian/libxkbfile1/DEBIAN/shlibs`);
	cmd.push('-O', '-e', path.resolve(binaryPath));

	const dpkgShlibdepsResult = spawnSync('perl', cmd, { cwd: chromiumSysroot });
	if (dpkgShlibdepsResult.status !== 0) {
		throw new Error(`dpkg-shlibdeps failed with exit code ${dpkgShlibdepsResult.status}. stderr:\n${dpkgShlibdepsResult.stderr} `);
	}

	const shlibsDependsPrefix = 'shlibs:Depends=';
	const requiresList = dpkgShlibdepsResult.stdout.toString('utf-8').trimEnd().split('\n');
	let depsStr = '';
	for (const line of requiresList) {
		if (line.startsWith(shlibsDependsPrefix)) {
			depsStr = line.substring(shlibsDependsPrefix.length);
		}
	}
	// Refs https://chromium-review.googlesource.com/c/chromium/src/+/3572926
	// Chromium depends on libgcc_s, is from the package libgcc1.  However, in
	// Bullseye, the package was renamed to libgcc-s1.  To avoid adding a dep
	// on the newer package, this hack skips the dep.  This is safe because
	// libgcc-s1 is a dependency of libc6.  This hack can be removed once
	// support for Debian Buster and Ubuntu Bionic are dropped.
	//
	// Remove kerberos native module related dependencies as the versions
	// computed from sysroot will not satisfy the minimum supported distros
	// Refs https://github.com/microsoft/vscode/issues/188881.
	// TODO(deepak1556): remove this workaround in favor of computing the
	// versions from build container for native modules.
	const filteredDeps = depsStr.split(', ').filter(dependency => {
		return !dependency.startsWith('libgcc-s1');
	}).sort();
	const requires = new Set(filteredDeps);
	return requires;
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/debian/dep-lists.ts]---
Location: vscode-main/build/linux/debian/dep-lists.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/additional_deps
// Additional dependencies not in the dpkg-shlibdeps output.
export const additionalDeps = [
	'ca-certificates', // Make sure users have SSL certificates.
	'libgtk-3-0 (>= 3.9.10) | libgtk-4-1',
	'libnss3 (>= 3.26)',
	'libcurl3-gnutls | libcurl3-nss | libcurl4 | libcurl3', // For Breakpad crash reports.
	'xdg-utils (>= 1.0.2)', // OS integration
];

// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/manual_recommends
// Dependencies that we can only recommend
// for now since some of the older distros don't support them.
export const recommendedDeps = [
	'libvulkan1' // Move to additionalDeps once support for Trusty and Jessie are dropped.
];

export const referenceGeneratedDepsByArch = {
	'amd64': [
		'ca-certificates',
		'libasound2 (>= 1.0.17)',
		'libatk-bridge2.0-0 (>= 2.5.3)',
		'libatk1.0-0 (>= 2.11.90)',
		'libatspi2.0-0 (>= 2.9.90)',
		'libc6 (>= 2.14)',
		'libc6 (>= 2.16)',
		'libc6 (>= 2.17)',
		'libc6 (>= 2.2.5)',
		'libc6 (>= 2.25)',
		'libc6 (>= 2.28)',
		'libcairo2 (>= 1.6.0)',
		'libcurl3-gnutls | libcurl3-nss | libcurl4 | libcurl3',
		'libdbus-1-3 (>= 1.9.14)',
		'libexpat1 (>= 2.1~beta3)',
		'libgbm1 (>= 17.1.0~rc2)',
		'libglib2.0-0 (>= 2.39.4)',
		'libgtk-3-0 (>= 3.9.10)',
		'libgtk-3-0 (>= 3.9.10) | libgtk-4-1',
		'libnspr4 (>= 2:4.9-2~)',
		'libnss3 (>= 2:3.30)',
		'libnss3 (>= 3.26)',
		'libpango-1.0-0 (>= 1.14.0)',
		'libudev1 (>= 183)',
		'libx11-6',
		'libx11-6 (>= 2:1.4.99.1)',
		'libxcb1 (>= 1.9.2)',
		'libxcomposite1 (>= 1:0.4.4-1)',
		'libxdamage1 (>= 1:1.1)',
		'libxext6',
		'libxfixes3',
		'libxkbcommon0 (>= 0.5.0)',
		'libxkbfile1 (>= 1:1.1.0)',
		'libxrandr2',
		'xdg-utils (>= 1.0.2)'
	],
	'armhf': [
		'ca-certificates',
		'libasound2 (>= 1.0.17)',
		'libatk-bridge2.0-0 (>= 2.5.3)',
		'libatk1.0-0 (>= 2.11.90)',
		'libatspi2.0-0 (>= 2.9.90)',
		'libc6 (>= 2.15)',
		'libc6 (>= 2.16)',
		'libc6 (>= 2.17)',
		'libc6 (>= 2.25)',
		'libc6 (>= 2.28)',
		'libc6 (>= 2.4)',
		'libc6 (>= 2.9)',
		'libcairo2 (>= 1.6.0)',
		'libcurl3-gnutls | libcurl3-nss | libcurl4 | libcurl3',
		'libdbus-1-3 (>= 1.9.14)',
		'libexpat1 (>= 2.1~beta3)',
		'libgbm1 (>= 17.1.0~rc2)',
		'libglib2.0-0 (>= 2.39.4)',
		'libgtk-3-0 (>= 3.9.10)',
		'libgtk-3-0 (>= 3.9.10) | libgtk-4-1',
		'libnspr4 (>= 2:4.9-2~)',
		'libnss3 (>= 2:3.30)',
		'libnss3 (>= 3.26)',
		'libpango-1.0-0 (>= 1.14.0)',
		'libstdc++6 (>= 4.1.1)',
		'libstdc++6 (>= 5)',
		'libstdc++6 (>= 5.2)',
		'libstdc++6 (>= 6)',
		'libstdc++6 (>= 9)',
		'libudev1 (>= 183)',
		'libx11-6',
		'libx11-6 (>= 2:1.4.99.1)',
		'libxcb1 (>= 1.9.2)',
		'libxcomposite1 (>= 1:0.4.4-1)',
		'libxdamage1 (>= 1:1.1)',
		'libxext6',
		'libxfixes3',
		'libxkbcommon0 (>= 0.5.0)',
		'libxkbfile1 (>= 1:1.1.0)',
		'libxrandr2',
		'xdg-utils (>= 1.0.2)'
	],
	'arm64': [
		'ca-certificates',
		'libasound2 (>= 1.0.17)',
		'libatk-bridge2.0-0 (>= 2.5.3)',
		'libatk1.0-0 (>= 2.11.90)',
		'libatspi2.0-0 (>= 2.9.90)',
		'libc6 (>= 2.17)',
		'libc6 (>= 2.25)',
		'libc6 (>= 2.28)',
		'libcairo2 (>= 1.6.0)',
		'libcurl3-gnutls | libcurl3-nss | libcurl4 | libcurl3',
		'libdbus-1-3 (>= 1.9.14)',
		'libexpat1 (>= 2.1~beta3)',
		'libgbm1 (>= 17.1.0~rc2)',
		'libglib2.0-0 (>= 2.39.4)',
		'libgtk-3-0 (>= 3.9.10)',
		'libgtk-3-0 (>= 3.9.10) | libgtk-4-1',
		'libnspr4 (>= 2:4.9-2~)',
		'libnss3 (>= 2:3.30)',
		'libnss3 (>= 3.26)',
		'libpango-1.0-0 (>= 1.14.0)',
		'libstdc++6 (>= 4.1.1)',
		'libstdc++6 (>= 5)',
		'libstdc++6 (>= 5.2)',
		'libstdc++6 (>= 6)',
		'libstdc++6 (>= 9)',
		'libudev1 (>= 183)',
		'libx11-6',
		'libx11-6 (>= 2:1.4.99.1)',
		'libxcb1 (>= 1.9.2)',
		'libxcomposite1 (>= 1:0.4.4-1)',
		'libxdamage1 (>= 1:1.1)',
		'libxext6',
		'libxfixes3',
		'libxkbcommon0 (>= 0.5.0)',
		'libxkbfile1 (>= 1:1.1.0)',
		'libxrandr2',
		'xdg-utils (>= 1.0.2)'
	]
};
```

--------------------------------------------------------------------------------

---[FILE: build/linux/debian/install-sysroot.ts]---
Location: vscode-main/build/linux/debian/install-sysroot.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawnSync, execSync } from 'child_process';
import { tmpdir } from 'os';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { createHash } from 'crypto';
import type { DebianArchString } from './types.ts';

// Based on https://source.chromium.org/chromium/chromium/src/+/main:build/linux/sysroot_scripts/install-sysroot.py.
const URL_PREFIX = 'https://msftelectronbuild.z5.web.core.windows.net';
const URL_PATH = 'sysroots/toolchain';
const REPO_ROOT = path.dirname(path.dirname(path.dirname(import.meta.dirname)));

const ghApiHeaders: Record<string, string> = {
	Accept: 'application/vnd.github.v3+json',
	'User-Agent': 'VSCode Build',
};

if (process.env.GITHUB_TOKEN) {
	ghApiHeaders.Authorization = 'Basic ' + Buffer.from(process.env.GITHUB_TOKEN).toString('base64');
}

const ghDownloadHeaders = {
	...ghApiHeaders,
	Accept: 'application/octet-stream',
};

interface IFetchOptions {
	assetName: string;
	checksumSha256?: string;
	dest: string;
}

function getElectronVersion(): Record<string, string> {
	const npmrc = fs.readFileSync(path.join(REPO_ROOT, '.npmrc'), 'utf8');
	const electronVersion = /^target="(.*)"$/m.exec(npmrc)![1];
	const msBuildId = /^ms_build_id="(.*)"$/m.exec(npmrc)![1];
	return { electronVersion, msBuildId };
}

function getSha(filename: fs.PathLike): string {
	const hash = createHash('sha256');
	// Read file 1 MB at a time
	const fd = fs.openSync(filename, 'r');
	const buffer = Buffer.alloc(1024 * 1024);
	let position = 0;
	let bytesRead = 0;
	while ((bytesRead = fs.readSync(fd, buffer, 0, buffer.length, position)) === buffer.length) {
		hash.update(buffer);
		position += bytesRead;
	}
	hash.update(buffer.slice(0, bytesRead));
	return hash.digest('hex');
}

function getVSCodeSysrootChecksum(expectedName: string) {
	const checksums = fs.readFileSync(path.join(REPO_ROOT, 'build', 'checksums', 'vscode-sysroot.txt'), 'utf8');
	for (const line of checksums.split('\n')) {
		const [checksum, name] = line.split(/\s+/);
		if (name === expectedName) {
			return checksum;
		}
	}
	return undefined;
}

/*
 * Do not use the fetch implementation from build/lib/fetch as it relies on vinyl streams
 * and vinyl-fs breaks the symlinks in the compiler toolchain sysroot. We use the native
 * tar implementation for that reason.
 */
async function fetchUrl(options: IFetchOptions, retries = 10, retryDelay = 1000): Promise<undefined> {
	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30 * 1000);
		const version = '20250407-330404';
		try {
			const response = await fetch(`https://api.github.com/repos/Microsoft/vscode-linux-build-agent/releases/tags/v${version}`, {
				headers: ghApiHeaders,
				signal: controller.signal
			});
			if (response.ok && (response.status >= 200 && response.status < 300)) {
				console.log(`Fetch completed: Status ${response.status}.`);
				const contents = Buffer.from(await response.arrayBuffer());
				const asset = JSON.parse(contents.toString()).assets.find((a: { name: string }) => a.name === options.assetName);
				if (!asset) {
					throw new Error(`Could not find asset in release of Microsoft/vscode-linux-build-agent @ ${version}`);
				}
				console.log(`Found asset ${options.assetName} @ ${asset.url}.`);
				const assetResponse = await fetch(asset.url, {
					headers: ghDownloadHeaders
				});
				if (assetResponse.ok && (assetResponse.status >= 200 && assetResponse.status < 300)) {
					const assetContents = Buffer.from(await assetResponse.arrayBuffer());
					console.log(`Fetched response body buffer: ${(assetContents as Buffer).byteLength} bytes`);
					if (options.checksumSha256) {
						const actualSHA256Checksum = createHash('sha256').update(assetContents).digest('hex');
						if (actualSHA256Checksum !== options.checksumSha256) {
							throw new Error(`Checksum mismatch for ${asset.url} (expected ${options.checksumSha256}, actual ${actualSHA256Checksum}))`);
						}
					}
					console.log(`Verified SHA256 checksums match for ${asset.url}`);
					const tarCommand = `tar -xz -C ${options.dest}`;
					execSync(tarCommand, { input: assetContents });
					console.log(`Fetch complete!`);
					return;
				}
				throw new Error(`Request ${asset.url} failed with status code: ${assetResponse.status}`);
			}
			throw new Error(`Request https://api.github.com failed with status code: ${response.status}`);
		} finally {
			clearTimeout(timeout);
		}
	} catch (e) {
		if (retries > 0) {
			console.log(`Fetching failed: ${e}`);
			await new Promise(resolve => setTimeout(resolve, retryDelay));
			return fetchUrl(options, retries - 1, retryDelay);
		}
		throw e;
	}
}

type SysrootDictEntry = {
	Sha256Sum: string;
	SysrootDir: string;
	Tarball: string;
};

export async function getVSCodeSysroot(arch: DebianArchString, isMusl: boolean = false): Promise<string> {
	let expectedName: string;
	let triple: string;
	const prefix = process.env['VSCODE_SYSROOT_PREFIX'] ?? '-glibc-2.28-gcc-10.5.0';
	switch (arch) {
		case 'amd64':
			expectedName = `x86_64-linux-gnu${prefix}.tar.gz`;
			triple = 'x86_64-linux-gnu';
			break;
		case 'arm64':
			if (isMusl) {
				expectedName = 'aarch64-linux-musl-gcc-10.3.0.tar.gz';
				triple = 'aarch64-linux-musl';
			} else {
				expectedName = `aarch64-linux-gnu${prefix}.tar.gz`;
				triple = 'aarch64-linux-gnu';
			}
			break;
		case 'armhf':
			expectedName = `arm-rpi-linux-gnueabihf${prefix}.tar.gz`;
			triple = 'arm-rpi-linux-gnueabihf';
			break;
	}
	console.log(`Fetching ${expectedName} for ${triple}`);
	const checksumSha256 = getVSCodeSysrootChecksum(expectedName);
	if (!checksumSha256) {
		throw new Error(`Could not find checksum for ${expectedName}`);
	}
	const sysroot = process.env['VSCODE_SYSROOT_DIR'] ?? path.join(tmpdir(), `vscode-${arch}-sysroot`);
	const stamp = path.join(sysroot, '.stamp');
	let result = `${sysroot}/${triple}/${triple}/sysroot`;
	if (isMusl) {
		result = `${sysroot}/output/${triple}`;
	}
	if (fs.existsSync(stamp) && fs.readFileSync(stamp).toString() === expectedName) {
		return result;
	}
	console.log(`Installing ${arch} root image: ${sysroot}`);
	fs.rmSync(sysroot, { recursive: true, force: true });
	fs.mkdirSync(sysroot, { recursive: true });
	await fetchUrl({
		checksumSha256,
		assetName: expectedName,
		dest: sysroot
	});
	fs.writeFileSync(stamp, expectedName);
	return result;
}

export async function getChromiumSysroot(arch: DebianArchString): Promise<string> {
	const sysrootJSONUrl = `https://raw.githubusercontent.com/electron/electron/v${getElectronVersion().electronVersion}/script/sysroots.json`;
	const sysrootDictLocation = `${tmpdir()}/sysroots.json`;
	const result = spawnSync('curl', [sysrootJSONUrl, '-o', sysrootDictLocation]);
	if (result.status !== 0) {
		throw new Error('Cannot retrieve sysroots.json. Stderr:\n' + result.stderr);
	}
	const sysrootInfo = JSON.parse(fs.readFileSync(sysrootDictLocation, 'utf8'));
	const sysrootArch = `bullseye_${arch}`;
	const sysrootDict: SysrootDictEntry = sysrootInfo[sysrootArch];
	const tarballFilename = sysrootDict['Tarball'];
	const tarballSha = sysrootDict['Sha256Sum'];
	const sysroot = path.join(tmpdir(), sysrootDict['SysrootDir']);
	const url = [URL_PREFIX, URL_PATH, tarballSha].join('/');
	const stamp = path.join(sysroot, '.stamp');
	if (fs.existsSync(stamp) && fs.readFileSync(stamp).toString() === url) {
		return sysroot;
	}

	console.log(`Installing Debian ${arch} root image: ${sysroot}`);
	fs.rmSync(sysroot, { recursive: true, force: true });
	fs.mkdirSync(sysroot);
	const tarball = path.join(sysroot, tarballFilename);
	console.log(`Downloading ${url}`);
	let downloadSuccess = false;
	for (let i = 0; i < 3 && !downloadSuccess; i++) {
		fs.writeFileSync(tarball, '');
		await new Promise<void>((c) => {
			https.get(url, (res) => {
				res.on('data', (chunk) => {
					fs.appendFileSync(tarball, chunk);
				});
				res.on('end', () => {
					downloadSuccess = true;
					c();
				});
			}).on('error', (err) => {
				console.error('Encountered an error during the download attempt: ' + err.message);
				c();
			});
		});
	}
	if (!downloadSuccess) {
		fs.rmSync(tarball);
		throw new Error('Failed to download ' + url);
	}
	const sha = getSha(tarball);
	if (sha !== tarballSha) {
		throw new Error(`Tarball sha1sum is wrong. Expected ${tarballSha}, actual ${sha}`);
	}

	const proc = spawnSync('tar', ['xf', tarball, '-C', sysroot]);
	if (proc.status) {
		throw new Error('Tarball extraction failed with code ' + proc.status);
	}
	fs.rmSync(tarball);
	fs.writeFileSync(stamp, url);
	return sysroot;
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/debian/types.ts]---
Location: vscode-main/build/linux/debian/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type DebianArchString = 'amd64' | 'armhf' | 'arm64';

export function isDebianArchString(s: string): s is DebianArchString {
	return ['amd64', 'armhf', 'arm64'].includes(s);
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/rpm/calculate-deps.ts]---
Location: vscode-main/build/linux/rpm/calculate-deps.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawnSync } from 'child_process';
import { constants, statSync } from 'fs';
import { additionalDeps } from './dep-lists.ts';

export function generatePackageDeps(files: string[]): Set<string>[] {
	const dependencies: Set<string>[] = files.map(file => calculatePackageDeps(file));
	const additionalDepsSet = new Set(additionalDeps);
	dependencies.push(additionalDepsSet);
	return dependencies;
}

// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/rpm/calculate_package_deps.py.
function calculatePackageDeps(binaryPath: string): Set<string> {
	try {
		if (!(statSync(binaryPath).mode & constants.S_IXUSR)) {
			throw new Error(`Binary ${binaryPath} needs to have an executable bit set.`);
		}
	} catch (e) {
		// The package might not exist. Don't re-throw the error here.
		console.error('Tried to stat ' + binaryPath + ' but failed.');
	}

	const findRequiresResult = spawnSync('/usr/lib/rpm/find-requires', { input: binaryPath + '\n' });
	if (findRequiresResult.status !== 0) {
		throw new Error(`find-requires failed with exit code ${findRequiresResult.status}.\nstderr: ${findRequiresResult.stderr}`);
	}

	const requires = new Set(findRequiresResult.stdout.toString('utf-8').trimEnd().split('\n'));
	return requires;
}
```

--------------------------------------------------------------------------------

---[FILE: build/linux/rpm/dep-lists.ts]---
Location: vscode-main/build/linux/rpm/dep-lists.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// Based on https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/rpm/additional_deps
// Additional dependencies not in the rpm find-requires output.
export const additionalDeps = [
	'ca-certificates', // Make sure users have SSL certificates.
	'libgtk-3.so.0()(64bit)',
	'libnss3.so(NSS_3.22)(64bit)',
	'libssl3.so(NSS_3.28)(64bit)',
	'rpmlib(FileDigests) <= 4.6.0-1',
	'libvulkan.so.1()(64bit)',
	'libcurl.so.4()(64bit)',
	'xdg-utils' // OS integration
];

export const referenceGeneratedDepsByArch = {
	'x86_64': [
		'ca-certificates',
		'ld-linux-x86-64.so.2()(64bit)',
		'ld-linux-x86-64.so.2(GLIBC_2.2.5)(64bit)',
		'ld-linux-x86-64.so.2(GLIBC_2.3)(64bit)',
		'libX11.so.6()(64bit)',
		'libXcomposite.so.1()(64bit)',
		'libXdamage.so.1()(64bit)',
		'libXext.so.6()(64bit)',
		'libXfixes.so.3()(64bit)',
		'libXrandr.so.2()(64bit)',
		'libasound.so.2()(64bit)',
		'libasound.so.2(ALSA_0.9)(64bit)',
		'libasound.so.2(ALSA_0.9.0rc4)(64bit)',
		'libatk-1.0.so.0()(64bit)',
		'libatk-bridge-2.0.so.0()(64bit)',
		'libatspi.so.0()(64bit)',
		'libc.so.6()(64bit)',
		'libc.so.6(GLIBC_2.10)(64bit)',
		'libc.so.6(GLIBC_2.11)(64bit)',
		'libc.so.6(GLIBC_2.12)(64bit)',
		'libc.so.6(GLIBC_2.14)(64bit)',
		'libc.so.6(GLIBC_2.15)(64bit)',
		'libc.so.6(GLIBC_2.16)(64bit)',
		'libc.so.6(GLIBC_2.17)(64bit)',
		'libc.so.6(GLIBC_2.18)(64bit)',
		'libc.so.6(GLIBC_2.2.5)(64bit)',
		'libc.so.6(GLIBC_2.25)(64bit)',
		'libc.so.6(GLIBC_2.27)(64bit)',
		'libc.so.6(GLIBC_2.28)(64bit)',
		'libc.so.6(GLIBC_2.3)(64bit)',
		'libc.so.6(GLIBC_2.3.2)(64bit)',
		'libc.so.6(GLIBC_2.3.3)(64bit)',
		'libc.so.6(GLIBC_2.3.4)(64bit)',
		'libc.so.6(GLIBC_2.4)(64bit)',
		'libc.so.6(GLIBC_2.6)(64bit)',
		'libc.so.6(GLIBC_2.7)(64bit)',
		'libc.so.6(GLIBC_2.8)(64bit)',
		'libc.so.6(GLIBC_2.9)(64bit)',
		'libcairo.so.2()(64bit)',
		'libcurl.so.4()(64bit)',
		'libdbus-1.so.3()(64bit)',
		'libdbus-1.so.3(LIBDBUS_1_3)(64bit)',
		'libdl.so.2()(64bit)',
		'libdl.so.2(GLIBC_2.2.5)(64bit)',
		'libexpat.so.1()(64bit)',
		'libgbm.so.1()(64bit)',
		'libgcc_s.so.1()(64bit)',
		'libgcc_s.so.1(GCC_3.0)(64bit)',
		'libgcc_s.so.1(GCC_3.3)(64bit)',
		'libgcc_s.so.1(GCC_4.0.0)(64bit)',
		'libgcc_s.so.1(GCC_4.2.0)(64bit)',
		'libgio-2.0.so.0()(64bit)',
		'libglib-2.0.so.0()(64bit)',
		'libgobject-2.0.so.0()(64bit)',
		'libgtk-3.so.0()(64bit)',
		'libm.so.6()(64bit)',
		'libm.so.6(GLIBC_2.2.5)(64bit)',
		'libnspr4.so()(64bit)',
		'libnss3.so()(64bit)',
		'libnss3.so(NSS_3.11)(64bit)',
		'libnss3.so(NSS_3.12)(64bit)',
		'libnss3.so(NSS_3.12.1)(64bit)',
		'libnss3.so(NSS_3.2)(64bit)',
		'libnss3.so(NSS_3.22)(64bit)',
		'libnss3.so(NSS_3.3)(64bit)',
		'libnss3.so(NSS_3.30)(64bit)',
		'libnss3.so(NSS_3.4)(64bit)',
		'libnss3.so(NSS_3.5)(64bit)',
		'libnss3.so(NSS_3.6)(64bit)',
		'libnss3.so(NSS_3.9.2)(64bit)',
		'libnssutil3.so()(64bit)',
		'libnssutil3.so(NSSUTIL_3.12.3)(64bit)',
		'libpango-1.0.so.0()(64bit)',
		'libpthread.so.0()(64bit)',
		'libpthread.so.0(GLIBC_2.12)(64bit)',
		'libpthread.so.0(GLIBC_2.2.5)(64bit)',
		'libpthread.so.0(GLIBC_2.3.2)(64bit)',
		'libpthread.so.0(GLIBC_2.3.3)(64bit)',
		'libpthread.so.0(GLIBC_2.3.4)(64bit)',
		'librt.so.1()(64bit)',
		'librt.so.1(GLIBC_2.2.5)(64bit)',
		'libsmime3.so()(64bit)',
		'libsmime3.so(NSS_3.10)(64bit)',
		'libsmime3.so(NSS_3.2)(64bit)',
		'libssl3.so(NSS_3.28)(64bit)',
		'libudev.so.1()(64bit)',
		'libudev.so.1(LIBUDEV_183)(64bit)',
		'libutil.so.1()(64bit)',
		'libutil.so.1(GLIBC_2.2.5)(64bit)',
		'libxcb.so.1()(64bit)',
		'libxkbcommon.so.0()(64bit)',
		'libxkbcommon.so.0(V_0.5.0)(64bit)',
		'libxkbfile.so.1()(64bit)',
		'rpmlib(FileDigests) <= 4.6.0-1',
		'rtld(GNU_HASH)',
		'xdg-utils'
	],
	'armv7hl': [
		'ca-certificates',
		'ld-linux-armhf.so.3',
		'ld-linux-armhf.so.3(GLIBC_2.4)',
		'libX11.so.6',
		'libXcomposite.so.1',
		'libXdamage.so.1',
		'libXext.so.6',
		'libXfixes.so.3',
		'libXrandr.so.2',
		'libasound.so.2',
		'libasound.so.2(ALSA_0.9)',
		'libasound.so.2(ALSA_0.9.0rc4)',
		'libatk-1.0.so.0',
		'libatk-bridge-2.0.so.0',
		'libatspi.so.0',
		'libc.so.6',
		'libc.so.6(GLIBC_2.10)',
		'libc.so.6(GLIBC_2.11)',
		'libc.so.6(GLIBC_2.12)',
		'libc.so.6(GLIBC_2.14)',
		'libc.so.6(GLIBC_2.15)',
		'libc.so.6(GLIBC_2.16)',
		'libc.so.6(GLIBC_2.17)',
		'libc.so.6(GLIBC_2.18)',
		'libc.so.6(GLIBC_2.25)',
		'libc.so.6(GLIBC_2.27)',
		'libc.so.6(GLIBC_2.28)',
		'libc.so.6(GLIBC_2.4)',
		'libc.so.6(GLIBC_2.6)',
		'libc.so.6(GLIBC_2.7)',
		'libc.so.6(GLIBC_2.8)',
		'libc.so.6(GLIBC_2.9)',
		'libcairo.so.2',
		'libcurl.so.4()(64bit)',
		'libdbus-1.so.3',
		'libdbus-1.so.3(LIBDBUS_1_3)',
		'libdl.so.2',
		'libdl.so.2(GLIBC_2.4)',
		'libexpat.so.1',
		'libgbm.so.1',
		'libgcc_s.so.1',
		'libgcc_s.so.1(GCC_3.0)',
		'libgcc_s.so.1(GCC_3.5)',
		'libgcc_s.so.1(GCC_4.3.0)',
		'libgio-2.0.so.0',
		'libglib-2.0.so.0',
		'libgobject-2.0.so.0',
		'libgtk-3.so.0',
		'libgtk-3.so.0()(64bit)',
		'libm.so.6',
		'libm.so.6(GLIBC_2.4)',
		'libnspr4.so',
		'libnss3.so',
		'libnss3.so(NSS_3.11)',
		'libnss3.so(NSS_3.12)',
		'libnss3.so(NSS_3.12.1)',
		'libnss3.so(NSS_3.2)',
		'libnss3.so(NSS_3.22)',
		'libnss3.so(NSS_3.22)(64bit)',
		'libnss3.so(NSS_3.3)',
		'libnss3.so(NSS_3.30)',
		'libnss3.so(NSS_3.4)',
		'libnss3.so(NSS_3.5)',
		'libnss3.so(NSS_3.6)',
		'libnss3.so(NSS_3.9.2)',
		'libnssutil3.so',
		'libnssutil3.so(NSSUTIL_3.12.3)',
		'libpango-1.0.so.0',
		'libpthread.so.0',
		'libpthread.so.0(GLIBC_2.12)',
		'libpthread.so.0(GLIBC_2.4)',
		'librt.so.1',
		'librt.so.1(GLIBC_2.4)',
		'libsmime3.so',
		'libsmime3.so(NSS_3.10)',
		'libsmime3.so(NSS_3.2)',
		'libssl3.so(NSS_3.28)(64bit)',
		'libstdc++.so.6',
		'libstdc++.so.6(CXXABI_1.3)',
		'libstdc++.so.6(CXXABI_1.3.5)',
		'libstdc++.so.6(CXXABI_1.3.8)',
		'libstdc++.so.6(CXXABI_1.3.9)',
		'libstdc++.so.6(CXXABI_ARM_1.3.3)',
		'libstdc++.so.6(GLIBCXX_3.4)',
		'libstdc++.so.6(GLIBCXX_3.4.11)',
		'libstdc++.so.6(GLIBCXX_3.4.14)',
		'libstdc++.so.6(GLIBCXX_3.4.15)',
		'libstdc++.so.6(GLIBCXX_3.4.18)',
		'libstdc++.so.6(GLIBCXX_3.4.19)',
		'libstdc++.so.6(GLIBCXX_3.4.20)',
		'libstdc++.so.6(GLIBCXX_3.4.21)',
		'libstdc++.so.6(GLIBCXX_3.4.22)',
		'libstdc++.so.6(GLIBCXX_3.4.26)',
		'libstdc++.so.6(GLIBCXX_3.4.5)',
		'libstdc++.so.6(GLIBCXX_3.4.9)',
		'libudev.so.1',
		'libudev.so.1(LIBUDEV_183)',
		'libutil.so.1',
		'libutil.so.1(GLIBC_2.4)',
		'libxcb.so.1',
		'libxkbcommon.so.0',
		'libxkbcommon.so.0(V_0.5.0)',
		'libxkbfile.so.1',
		'rpmlib(FileDigests) <= 4.6.0-1',
		'rtld(GNU_HASH)',
		'xdg-utils'
	],
	'aarch64': [
		'ca-certificates',
		'ld-linux-aarch64.so.1()(64bit)',
		'ld-linux-aarch64.so.1(GLIBC_2.17)(64bit)',
		'libX11.so.6()(64bit)',
		'libXcomposite.so.1()(64bit)',
		'libXdamage.so.1()(64bit)',
		'libXext.so.6()(64bit)',
		'libXfixes.so.3()(64bit)',
		'libXrandr.so.2()(64bit)',
		'libasound.so.2()(64bit)',
		'libasound.so.2(ALSA_0.9)(64bit)',
		'libasound.so.2(ALSA_0.9.0rc4)(64bit)',
		'libatk-1.0.so.0()(64bit)',
		'libatk-bridge-2.0.so.0()(64bit)',
		'libatspi.so.0()(64bit)',
		'libc.so.6()(64bit)',
		'libc.so.6(GLIBC_2.17)(64bit)',
		'libc.so.6(GLIBC_2.18)(64bit)',
		'libc.so.6(GLIBC_2.25)(64bit)',
		'libc.so.6(GLIBC_2.27)(64bit)',
		'libc.so.6(GLIBC_2.28)(64bit)',
		'libcairo.so.2()(64bit)',
		'libcurl.so.4()(64bit)',
		'libdbus-1.so.3()(64bit)',
		'libdbus-1.so.3(LIBDBUS_1_3)(64bit)',
		'libdl.so.2()(64bit)',
		'libdl.so.2(GLIBC_2.17)(64bit)',
		'libexpat.so.1()(64bit)',
		'libgbm.so.1()(64bit)',
		'libgcc_s.so.1()(64bit)',
		'libgcc_s.so.1(GCC_3.0)(64bit)',
		'libgcc_s.so.1(GCC_3.3)(64bit)',
		'libgcc_s.so.1(GCC_4.2.0)(64bit)',
		'libgcc_s.so.1(GCC_4.5.0)(64bit)',
		'libgio-2.0.so.0()(64bit)',
		'libglib-2.0.so.0()(64bit)',
		'libgobject-2.0.so.0()(64bit)',
		'libgtk-3.so.0()(64bit)',
		'libm.so.6()(64bit)',
		'libm.so.6(GLIBC_2.17)(64bit)',
		'libnspr4.so()(64bit)',
		'libnss3.so()(64bit)',
		'libnss3.so(NSS_3.11)(64bit)',
		'libnss3.so(NSS_3.12)(64bit)',
		'libnss3.so(NSS_3.12.1)(64bit)',
		'libnss3.so(NSS_3.2)(64bit)',
		'libnss3.so(NSS_3.22)(64bit)',
		'libnss3.so(NSS_3.3)(64bit)',
		'libnss3.so(NSS_3.30)(64bit)',
		'libnss3.so(NSS_3.4)(64bit)',
		'libnss3.so(NSS_3.5)(64bit)',
		'libnss3.so(NSS_3.6)(64bit)',
		'libnss3.so(NSS_3.9.2)(64bit)',
		'libnssutil3.so()(64bit)',
		'libnssutil3.so(NSSUTIL_3.12.3)(64bit)',
		'libpango-1.0.so.0()(64bit)',
		'libpthread.so.0()(64bit)',
		'libpthread.so.0(GLIBC_2.17)(64bit)',
		'libsmime3.so()(64bit)',
		'libsmime3.so(NSS_3.10)(64bit)',
		'libsmime3.so(NSS_3.2)(64bit)',
		'libssl3.so(NSS_3.28)(64bit)',
		'libstdc++.so.6()(64bit)',
		'libstdc++.so.6(CXXABI_1.3)(64bit)',
		'libstdc++.so.6(CXXABI_1.3.5)(64bit)',
		'libstdc++.so.6(CXXABI_1.3.8)(64bit)',
		'libstdc++.so.6(CXXABI_1.3.9)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.11)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.14)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.15)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.18)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.19)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.20)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.21)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.22)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.26)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.5)(64bit)',
		'libstdc++.so.6(GLIBCXX_3.4.9)(64bit)',
		'libudev.so.1()(64bit)',
		'libudev.so.1(LIBUDEV_183)(64bit)',
		'libutil.so.1()(64bit)',
		'libutil.so.1(GLIBC_2.17)(64bit)',
		'libxcb.so.1()(64bit)',
		'libxkbcommon.so.0()(64bit)',
		'libxkbcommon.so.0(V_0.5.0)(64bit)',
		'libxkbfile.so.1()(64bit)',
		'rpmlib(FileDigests) <= 4.6.0-1',
		'rtld(GNU_HASH)',
		'xdg-utils'
	]
};
```

--------------------------------------------------------------------------------

---[FILE: build/linux/rpm/types.ts]---
Location: vscode-main/build/linux/rpm/types.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export type RpmArchString = 'x86_64' | 'armv7hl' | 'aarch64';

export function isRpmArchString(s: string): s is RpmArchString {
	return ['x86_64', 'armv7hl', 'aarch64'].includes(s);
}
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/LICENSE]---
Location: vscode-main/build/monaco/LICENSE

```text
The MIT License (MIT)

Copyright (c) 2016 - present Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/monaco.d.ts.recipe]---
Location: vscode-main/build/monaco/monaco.d.ts.recipe

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

// eslint-disable-next-line no-var
declare var MonacoEnvironment: monaco.Environment | undefined;

declare namespace monaco {

	export type Thenable<T> = PromiseLike<T>;

	export interface Environment {
		/**
		 * Define a global `monaco` symbol.
		 * This is true by default in AMD and false by default in ESM.
		 */
		globalAPI?: boolean;
		/**
		 * The base url where the editor sources are found (which contains the vs folder)
		 */
		baseUrl?: string;
		/**
		 * A web worker factory.
		 * NOTE: If `getWorker` is defined, `getWorkerUrl` is not invoked.
		 */
		getWorker?(workerId: string, label: string): Promise<Worker> | Worker;
		/**
		 * Return the location for web worker scripts.
		 * NOTE: If `getWorker` is defined, `getWorkerUrl` is not invoked.
		 */
		getWorkerUrl?(workerId: string, label: string): string;
		/**
		 * Create a trusted types policy (same API as window.trustedTypes.createPolicy)
		 */
		createTrustedTypesPolicy?(
			policyName: string,
			policyOptions?: ITrustedTypePolicyOptions,
		): undefined | ITrustedTypePolicy;
	}

	export interface ITrustedTypePolicyOptions {
		createHTML?: (input: string, ...arguments: any[]) => string;
		createScript?: (input: string, ...arguments: any[]) => string;
		createScriptURL?: (input: string, ...arguments: any[]) => string;
	}

	export interface ITrustedTypePolicy {
		readonly name: string;
		createHTML?(input: string): any;
		createScript?(input: string): any;
		createScriptURL?(input: string): any;
	}

	export interface IDisposable {
		dispose(): void;
	}

	export interface IEvent<T> {
		(listener: (e: T) => any, thisArg?: any): IDisposable;
	}

	/**
	 * A helper that allows to emit and listen to typed events
	 */
	export class Emitter<T> {
		constructor();
		readonly event: Event<T>;
		fire(event: T): void;
		dispose(): void;
	}

#include(vs/platform/markers/common/markers.js): MarkerTag, MarkerSeverity
#include(vs/base/common/cancellation.js): CancellationTokenSource, CancellationToken
#include(vs/base/common/uri.js): URI, UriComponents
#include(vs/base/common/keyCodes.js): KeyCode
#include(vs/editor/common/services/editorBaseApi.js): KeyMod
#include(vs/base/common/htmlContent.js): IMarkdownString, MarkdownStringTrustedOptions
#include(vs/base/browser/keyboardEvent.js): IKeyboardEvent
#include(vs/base/browser/mouseEvent.js): IMouseEvent
#include(vs/editor/common/editorCommon.js): IScrollEvent
#include(vs/editor/common/core/position.js): IPosition, Position
#include(vs/editor/common/core/range.js): IRange, Range
#include(vs/editor/common/core/selection.js): ISelection, Selection, SelectionDirection
#include(vs/editor/common/languages.js): Token
}

declare namespace monaco.editor {
#includeAll(vs/editor/standalone/browser/standaloneEditor.js;languages.Token=>Token):
#include(vs/editor/standalone/common/standaloneTheme.js): BuiltinTheme, IStandaloneThemeData, IColors
#include(vs/editor/common/languages/supports/tokenization.js): ITokenThemeRule
#include(vs/editor/standalone/browser/standaloneWebWorker.js): MonacoWebWorker, IInternalWebWorkerOptions
#include(vs/editor/standalone/browser/standaloneCodeEditor.js): IActionDescriptor, IGlobalEditorOptions, IStandaloneEditorConstructionOptions, IStandaloneDiffEditorConstructionOptions, IStandaloneCodeEditor, IStandaloneDiffEditor
export interface ICommandHandler {
	(...args: any[]): void;
}
export interface ILocalizedString {
	original: string;
	value: string;
}
export interface ICommandMetadata {
	readonly description: ILocalizedString | string;
}
#include(vs/platform/contextkey/common/contextkey.js): IContextKey, ContextKeyValue
#include(vs/editor/standalone/browser/standaloneServices.js): IEditorOverrideServices
#include(vs/platform/markers/common/markers.js): IMarker, IMarkerData, IRelatedInformation
#include(vs/editor/standalone/browser/colorizer.js): IColorizerOptions, IColorizerElementOptions
#include(vs/base/common/scrollable.js): ScrollbarVisibility
#include(vs/base/common/themables.js): ThemeColor, ThemeIcon
#include(vs/editor/common/core/editOperation.js): ISingleEditOperation
#include(vs/editor/common/core/wordHelper.js): IWordAtPosition
#includeAll(vs/editor/common/model.js): IScrollEvent
#include(vs/editor/common/diff/legacyLinesDiffComputer.js): IChange, ICharChange, ILineChange
#include(vs/editor/common/core/2d/dimension.js): IDimension
#includeAll(vs/editor/common/editorCommon.js): IScrollEvent
#includeAll(vs/editor/common/textModelEvents.js):
#include(vs/editor/common/model/mirrorTextModel.js): IModelContentChange
#includeAll(vs/editor/common/cursorEvents.js):
#include(vs/platform/accessibility/common/accessibility.js): AccessibilitySupport
#includeAll(vs/editor/common/config/editorOptions.js):
#include(vs/editor/browser/config/editorConfiguration.js): IEditorConstructionOptions
#includeAll(vs/editor/browser/editorBrowser.js;editorCommon.=>):
#include(vs/editor/common/config/fontInfo.js): FontInfo, BareFontInfo
#include(vs/editor/common/config/editorZoom.js): EditorZoom, IEditorZoom

//compatibility:
export type IReadOnlyModel = ITextModel;
export type IModel = ITextModel;
}

declare namespace monaco.languages {

#include(vs/editor/common/textModelEditSource.js): EditDeltaInfo
#include(vs/base/common/glob.js): IRelativePattern
#include(vs/editor/common/languageSelector.js): LanguageSelector, LanguageFilter
#includeAll(vs/editor/standalone/browser/standaloneLanguages.js;languages.=>;editorCommon.=>editor.;model.=>editor.;IMarkerData=>editor.IMarkerData):
#includeAll(vs/editor/common/languages/languageConfiguration.js):
#includeAll(vs/editor/common/languages.js;IMarkerData=>editor.IMarkerData;ISingleEditOperation=>editor.ISingleEditOperation;model.=>editor.;ThemeIcon=>editor.ThemeIcon): Token
#include(vs/editor/common/languages/language.js): ILanguageExtensionPoint
#includeAll(vs/editor/standalone/common/monarch/monarchTypes.js):

}

declare namespace monaco.worker {

#include(vs/editor/common/model/mirrorTextModel.js): IMirrorTextModel
#includeAll(vs/editor/common/services/editorWebWorker.js;):

}

//dtsv=3
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/monaco.usage.recipe]---
Location: vscode-main/build/monaco/monaco.usage.recipe

```text

// This file is adding references to various symbols which should not be removed via tree shaking

import { IObservable } from './vs/base/common/observable.js';

import { ServiceIdentifier } from './vs/platform/instantiation/common/instantiation.js';
import { start } from './vs/editor/editor.worker.start.js';
import { SyncDescriptor0 } from './vs/platform/instantiation/common/descriptors.js';
import * as editorAPI from './vs/editor/editor.api.js';

(function () {
	var a: any;
	var b: any;
	a = (<ServiceIdentifier<any>>b).type;
	a = start;

	// injection madness
	a = (<SyncDescriptor0<any>>b).ctor;

	// exported API
	a = editorAPI.CancellationTokenSource;
	a = editorAPI.Emitter;
	a = editorAPI.KeyCode;
	a = editorAPI.KeyMod;
	a = editorAPI.Position;
	a = editorAPI.Range;
	a = editorAPI.Selection;
	a = editorAPI.SelectionDirection;
	a = editorAPI.MarkerSeverity;
	a = editorAPI.MarkerTag;
	a = editorAPI.Uri;
	a = editorAPI.Token;
	a = editorAPI.editor;
	a = editorAPI.languages;

	const o: IObservable<number> = null!;
	o.TChange;
})();
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/package.json]---
Location: vscode-main/build/monaco/package.json

```json
{
  "name": "monaco-editor-core",
  "private": true,
  "version": "0.0.0",
  "description": "A browser based code editor",
  "author": "Microsoft Corporation",
  "license": "MIT",
  "typings": "./esm/vs/editor/editor.api.d.ts",
  "module": "./esm/vs/editor/editor.main.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode"
  },
  "bugs": {
    "url": "https://github.com/microsoft/vscode/issues"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/README-npm.md]---
Location: vscode-main/build/monaco/README-npm.md

```markdown
# monaco-editor-core

> This npm module is a building block for the [monaco-editor](https://www.npmjs.com/package/monaco-editor)
npm module and unless you are doing something special (e.g. authoring a monaco editor language that can be shipped
and consumed independently), it is best to consume the [monaco-editor](https://www.npmjs.com/package/monaco-editor) module
that contains this module and adds languages supports.

The Monaco Editor is the code editor that powers [VS Code](https://github.com/microsoft/vscode). Here is a good page describing some [editor features](https://code.visualstudio.com/docs/editor/editingevolved).

This npm module contains the core editor functionality, as it comes from the [vscode repository](https://github.com/microsoft/vscode).

## License

[MIT](https://github.com/microsoft/vscode/blob/main/LICENSE.txt)
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/README.md]---
Location: vscode-main/build/monaco/README.md

```markdown
# Steps to publish a new version of monaco-editor-core

## Generate monaco.d.ts

* The `monaco.d.ts` is now automatically generated when running `gulp watch`

## Bump version

* increase version in `build/monaco/package.json`

## Generate npm contents for monaco-editor-core

* Be sure to have all changes committed **and pushed to the remote**
* (the generated files contain the HEAD sha and that should be available on the remote)
* run gulp editor-distro

## Publish

* `cd out-monaco-editor-core`
* `npm publish`
```

--------------------------------------------------------------------------------

---[FILE: build/monaco/ThirdPartyNotices.txt]---
Location: vscode-main/build/monaco/ThirdPartyNotices.txt

```text
THIRD-PARTY SOFTWARE NOTICES AND INFORMATION
Do Not Translate or Localize

This project incorporates components from the projects listed below. The original copyright notices and the licenses
under which Microsoft received such components are set forth below. Microsoft reserves all rights not expressly granted
herein, whether by implication, estoppel or otherwise.



%% nodejs path library (https://github.com/nodejs/node/tree/43dd49c9782848c25e5b03448c8a0f923f13c158)
=========================================
Copyright Joyent, Inc. and other Node contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
=========================================
END OF nodejs path library NOTICES AND INFORMATION




%% markedjs NOTICES AND INFORMATION BEGIN HERE
=========================================
The MIT License (MIT)

Copyright (c) 2018+, MarkedJS (https://github.com/markedjs/)
Copyright (c) 2011-2018, Christopher Jeffrey (https://github.com/chjj/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
=========================================
END OF markedjs NOTICES AND INFORMATION
```

--------------------------------------------------------------------------------

---[FILE: build/npm/dirs.ts]---
Location: vscode-main/build/npm/dirs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { existsSync } from 'fs';

/**
 * Complete list of directories where npm should be executed to install node modules
 */
export const dirs = [
	'',
	'build',
	'build/vite',
	'extensions',
	'extensions/configuration-editing',
	'extensions/css-language-features',
	'extensions/css-language-features/server',
	'extensions/debug-auto-launch',
	'extensions/debug-server-ready',
	'extensions/emmet',
	'extensions/extension-editing',
	'extensions/git',
	'extensions/git-base',
	'extensions/github',
	'extensions/github-authentication',
	'extensions/grunt',
	'extensions/gulp',
	'extensions/html-language-features',
	'extensions/html-language-features/server',
	'extensions/ipynb',
	'extensions/jake',
	'extensions/json-language-features',
	'extensions/json-language-features/server',
	'extensions/markdown-language-features',
	'extensions/markdown-math',
	'extensions/media-preview',
	'extensions/merge-conflict',
	'extensions/mermaid-chat-features',
	'extensions/microsoft-authentication',
	'extensions/notebook-renderers',
	'extensions/npm',
	'extensions/php-language-features',
	'extensions/references-view',
	'extensions/search-result',
	'extensions/simple-browser',
	'extensions/tunnel-forwarding',
	'extensions/terminal-suggest',
	'extensions/typescript-language-features',
	'extensions/vscode-api-tests',
	'extensions/vscode-colorize-tests',
	'extensions/vscode-colorize-perf-tests',
	'extensions/vscode-test-resolver',
	'remote',
	'remote/web',
	'test/automation',
	'test/integration/browser',
	'test/monaco',
	'test/smoke',
	'test/mcp',
	'.vscode/extensions/vscode-selfhost-import-aid',
	'.vscode/extensions/vscode-selfhost-test-provider',
];

if (existsSync(`${import.meta.dirname}/../../.build/distro/npm`)) {
	dirs.push('.build/distro/npm');
	dirs.push('.build/distro/npm/remote');
	dirs.push('.build/distro/npm/remote/web');
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/mixin-telemetry-docs.ts]---
Location: vscode-main/build/npm/mixin-telemetry-docs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { existsSync, rmSync } from 'fs';

const rootPath = resolve(import.meta.dirname, '..', '..');
const telemetryDocsPath = join(rootPath, 'vscode-telemetry-docs');
const repoUrl = 'https://github.com/microsoft/vscode-telemetry-docs';

console.log('Cloning vscode-telemetry-docs repository...');

// Remove existing directory if it exists
if (existsSync(telemetryDocsPath)) {
	console.log('Removing existing vscode-telemetry-docs directory...');
	rmSync(telemetryDocsPath, { recursive: true, force: true });
}

try {
	// Clone the repository (shallow clone of main branch only)
	console.log(`Cloning ${repoUrl} to ${telemetryDocsPath}...`);
	execSync(`git clone --depth 1 --branch main --single-branch ${repoUrl} vscode-telemetry-docs`, {
		cwd: rootPath,
		stdio: 'inherit'
	});

	console.log('Successfully cloned vscode-telemetry-docs repository.');
} catch (error) {
	console.error('Failed to clone vscode-telemetry-docs repository:', (error as Error).message);
	process.exit(1);
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/postinstall.ts]---
Location: vscode-main/build/npm/postinstall.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import path from 'path';
import * as os from 'os';
import * as child_process from 'child_process';
import { dirs } from './dirs.ts';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const root = path.dirname(path.dirname(import.meta.dirname));

function log(dir: string, message: string) {
	if (process.stdout.isTTY) {
		console.log(`\x1b[34m[${dir}]\x1b[0m`, message);
	} else {
		console.log(`[${dir}]`, message);
	}
}

function run(command: string, args: string[], opts: child_process.SpawnSyncOptions) {
	log(opts.cwd as string || '.', '$ ' + command + ' ' + args.join(' '));

	const result = child_process.spawnSync(command, args, opts);

	if (result.error) {
		console.error(`ERR Failed to spawn process: ${result.error}`);
		process.exit(1);
	} else if (result.status !== 0) {
		console.error(`ERR Process exited with code: ${result.status}`);
		process.exit(result.status);
	}
}

function npmInstall(dir: string, opts?: child_process.SpawnSyncOptions) {
	opts = {
		env: { ...process.env },
		...(opts ?? {}),
		cwd: dir,
		stdio: 'inherit',
		shell: true
	};

	const command = process.env['npm_command'] || 'install';

	if (process.env['VSCODE_REMOTE_DEPENDENCIES_CONTAINER_NAME'] && /^(.build\/distro\/npm\/)?remote$/.test(dir)) {
		const userinfo = os.userInfo();
		log(dir, `Installing dependencies inside container ${process.env['VSCODE_REMOTE_DEPENDENCIES_CONTAINER_NAME']}...`);

		opts.cwd = root;
		if (process.env['npm_config_arch'] === 'arm64') {
			run('sudo', ['docker', 'run', '--rm', '--privileged', 'multiarch/qemu-user-static', '--reset', '-p', 'yes'], opts);
		}
		run('sudo', [
			'docker', 'run',
			'-e', 'GITHUB_TOKEN',
			'-v', `${process.env['VSCODE_HOST_MOUNT']}:/root/vscode`,
			'-v', `${process.env['VSCODE_HOST_MOUNT']}/.build/.netrc:/root/.netrc`,
			'-v', `${process.env['VSCODE_NPMRC_PATH']}:/root/.npmrc`,
			'-w', path.resolve('/root/vscode', dir),
			process.env['VSCODE_REMOTE_DEPENDENCIES_CONTAINER_NAME'],
			'sh', '-c', `\"chown -R root:root ${path.resolve('/root/vscode', dir)} && export PATH="/root/vscode/.build/nodejs-musl/usr/local/bin:$PATH" && npm i -g node-gyp-build && npm ci\"`
		], opts);
		run('sudo', ['chown', '-R', `${userinfo.uid}:${userinfo.gid}`, `${path.resolve(root, dir)}`], opts);
	} else {
		log(dir, 'Installing dependencies...');
		run(npm, command.split(' '), opts);
	}
	removeParcelWatcherPrebuild(dir);
}

function setNpmrcConfig(dir: string, env: NodeJS.ProcessEnv) {
	const npmrcPath = path.join(root, dir, '.npmrc');
	const lines = fs.readFileSync(npmrcPath, 'utf8').split('\n');

	for (const line of lines) {
		const trimmedLine = line.trim();
		if (trimmedLine && !trimmedLine.startsWith('#')) {
			const [key, value] = trimmedLine.split('=');
			env[`npm_config_${key}`] = value.replace(/^"(.*)"$/, '$1');
		}
	}

	// Use our bundled node-gyp version
	env['npm_config_node_gyp'] =
		process.platform === 'win32'
			? path.join(import.meta.dirname, 'gyp', 'node_modules', '.bin', 'node-gyp.cmd')
			: path.join(import.meta.dirname, 'gyp', 'node_modules', '.bin', 'node-gyp');

	// Force node-gyp to use process.config on macOS
	// which defines clang variable as expected. Otherwise we
	// run into compilation errors due to incorrect compiler
	// configuration.
	// NOTE: This means the process.config should contain
	// the correct clang variable. So keep the version check
	// in preinstall sync with this logic.
	// Change was first introduced in https://github.com/nodejs/node/commit/6e0a2bb54c5bbeff0e9e33e1a0c683ed980a8a0f
	if ((dir === 'remote' || dir === 'build') && process.platform === 'darwin') {
		env['npm_config_force_process_config'] = 'true';
	} else {
		delete env['npm_config_force_process_config'];
	}

	if (dir === 'build') {
		env['npm_config_target'] = process.versions.node;
		env['npm_config_arch'] = process.arch;
	}
}

function removeParcelWatcherPrebuild(dir: string) {
	const parcelModuleFolder = path.join(root, dir, 'node_modules', '@parcel');
	if (!fs.existsSync(parcelModuleFolder)) {
		return;
	}

	const parcelModules = fs.readdirSync(parcelModuleFolder);
	for (const moduleName of parcelModules) {
		if (moduleName.startsWith('watcher-')) {
			const modulePath = path.join(parcelModuleFolder, moduleName);
			fs.rmSync(modulePath, { recursive: true, force: true });
			log(dir, `Removed @parcel/watcher prebuilt module ${modulePath}`);
		}
	}
}

for (const dir of dirs) {

	if (dir === '') {
		removeParcelWatcherPrebuild(dir);
		continue; // already executed in root
	}

	let opts: child_process.SpawnSyncOptions | undefined;

	if (dir === 'build') {
		opts = {
			env: {
				...process.env
			},
		};
		if (process.env['CC']) { opts.env!['CC'] = 'gcc'; }
		if (process.env['CXX']) { opts.env!['CXX'] = 'g++'; }
		if (process.env['CXXFLAGS']) { opts.env!['CXXFLAGS'] = ''; }
		if (process.env['LDFLAGS']) { opts.env!['LDFLAGS'] = ''; }

		setNpmrcConfig('build', opts.env!);
		npmInstall('build', opts);
		continue;
	}

	if (/^(.build\/distro\/npm\/)?remote$/.test(dir)) {
		// node modules used by vscode server
		opts = {
			env: {
				...process.env
			},
		};
		if (process.env['VSCODE_REMOTE_CC']) {
			opts.env!['CC'] = process.env['VSCODE_REMOTE_CC'];
		} else {
			delete opts.env!['CC'];
		}
		if (process.env['VSCODE_REMOTE_CXX']) {
			opts.env!['CXX'] = process.env['VSCODE_REMOTE_CXX'];
		} else {
			delete opts.env!['CXX'];
		}
		if (process.env['CXXFLAGS']) { delete opts.env!['CXXFLAGS']; }
		if (process.env['CFLAGS']) { delete opts.env!['CFLAGS']; }
		if (process.env['LDFLAGS']) { delete opts.env!['LDFLAGS']; }
		if (process.env['VSCODE_REMOTE_CXXFLAGS']) { opts.env!['CXXFLAGS'] = process.env['VSCODE_REMOTE_CXXFLAGS']; }
		if (process.env['VSCODE_REMOTE_LDFLAGS']) { opts.env!['LDFLAGS'] = process.env['VSCODE_REMOTE_LDFLAGS']; }
		if (process.env['VSCODE_REMOTE_NODE_GYP']) { opts.env!['npm_config_node_gyp'] = process.env['VSCODE_REMOTE_NODE_GYP']; }

		setNpmrcConfig('remote', opts.env!);
		npmInstall(dir, opts);
		continue;
	}

	npmInstall(dir, opts);
}

child_process.execSync('git config pull.rebase merges');
child_process.execSync('git config blame.ignoreRevsFile .git-blame-ignore-revs');
```

--------------------------------------------------------------------------------

---[FILE: build/npm/preinstall.ts]---
Location: vscode-main/build/npm/preinstall.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as os from 'os';

if (!process.env['VSCODE_SKIP_NODE_VERSION_CHECK']) {
	// Get the running Node.js version
	const nodeVersion = /^(\d+)\.(\d+)\.(\d+)/.exec(process.versions.node);
	const majorNodeVersion = parseInt(nodeVersion![1]);
	const minorNodeVersion = parseInt(nodeVersion![2]);
	const patchNodeVersion = parseInt(nodeVersion![3]);

	// Get the required Node.js version from .nvmrc
	const nvmrcPath = path.join(import.meta.dirname, '..', '..', '.nvmrc');
	const requiredVersion = fs.readFileSync(nvmrcPath, 'utf8').trim();
	const requiredVersionMatch = /^(\d+)\.(\d+)\.(\d+)/.exec(requiredVersion);

	if (!requiredVersionMatch) {
		console.error('\x1b[1;31m*** Unable to parse required Node.js version from .nvmrc\x1b[0;0m');
		throw new Error();
	}

	const requiredMajor = parseInt(requiredVersionMatch[1]);
	const requiredMinor = parseInt(requiredVersionMatch[2]);
	const requiredPatch = parseInt(requiredVersionMatch[3]);

	if (majorNodeVersion < requiredMajor ||
		(majorNodeVersion === requiredMajor && minorNodeVersion < requiredMinor) ||
		(majorNodeVersion === requiredMajor && minorNodeVersion === requiredMinor && patchNodeVersion < requiredPatch)) {
		console.error(`\x1b[1;31m*** Please use Node.js v${requiredVersion} or later for development. Currently using v${process.versions.node}.\x1b[0;0m`);
		throw new Error();
	}
}

if (process.env.npm_execpath?.includes('yarn')) {
	console.error('\x1b[1;31m*** Seems like you are using `yarn` which is not supported in this repo any more, please use `npm i` instead. ***\x1b[0;0m');
	throw new Error();
}

if (process.platform === 'win32') {
	if (!hasSupportedVisualStudioVersion()) {
		console.error('\x1b[1;31m*** Invalid C/C++ Compiler Toolchain. Please check https://github.com/microsoft/vscode/wiki/How-to-Contribute#prerequisites.\x1b[0;0m');
		console.error('\x1b[1;31m*** If you have Visual Studio installed in a custom location, you can specify it via the environment variable:\x1b[0;0m');
		console.error('\x1b[1;31m*** set vs2022_install=<path> (or vs2019_install for older versions)\x1b[0;0m');
		throw new Error();
	}
}

installHeaders();

if (process.arch !== os.arch()) {
	console.error(`\x1b[1;31m*** ARCHITECTURE MISMATCH: The node.js process is ${process.arch}, but your OS architecture is ${os.arch()}. ***\x1b[0;0m`);
	console.error(`\x1b[1;31m*** This can greatly increase the build time of vs code. ***\x1b[0;0m`);
}

function hasSupportedVisualStudioVersion() {
	// Translated over from
	// https://source.chromium.org/chromium/chromium/src/+/master:build/vs_toolchain.py;l=140-175
	const supportedVersions = ['2022', '2019'];

	const availableVersions = [];
	for (const version of supportedVersions) {
		// Check environment variable first (explicit override)
		let vsPath = process.env[`vs${version}_install`];
		if (vsPath && fs.existsSync(vsPath)) {
			availableVersions.push(version);
			break;
		}

		// Check default installation paths
		const programFiles86Path = process.env['ProgramFiles(x86)'];
		const programFiles64Path = process.env['ProgramFiles'];

		const vsTypes = ['Enterprise', 'Professional', 'Community', 'Preview', 'BuildTools', 'IntPreview'];
		if (programFiles64Path) {
			vsPath = `${programFiles64Path}/Microsoft Visual Studio/${version}`;
			if (vsTypes.some(vsType => fs.existsSync(path.join(vsPath!, vsType)))) {
				availableVersions.push(version);
				break;
			}
		}

		if (programFiles86Path) {
			vsPath = `${programFiles86Path}/Microsoft Visual Studio/${version}`;
			if (vsTypes.some(vsType => fs.existsSync(path.join(vsPath!, vsType)))) {
				availableVersions.push(version);
				break;
			}
		}
	}

	return availableVersions.length;
}

function installHeaders() {
	const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
	child_process.execSync(`${npm} ${process.env.npm_command || 'ci'}`, {
		env: process.env,
		cwd: path.join(import.meta.dirname, 'gyp'),
		stdio: 'inherit'
	});

	// The node gyp package got installed using the above npm command using the gyp/package.json
	// file checked into our repository. So from that point it is safe to construct the path
	// to that executable
	const node_gyp = process.platform === 'win32'
		? path.join(import.meta.dirname, 'gyp', 'node_modules', '.bin', 'node-gyp.cmd')
		: path.join(import.meta.dirname, 'gyp', 'node_modules', '.bin', 'node-gyp');

	const local = getHeaderInfo(path.join(import.meta.dirname, '..', '..', '.npmrc'));
	const remote = getHeaderInfo(path.join(import.meta.dirname, '..', '..', 'remote', '.npmrc'));

	if (local !== undefined) {
		// Both disturl and target come from a file checked into our repository
		child_process.execFileSync(node_gyp, ['install', '--dist-url', local.disturl, local.target], { shell: true });
	}

	if (remote !== undefined) {
		// Both disturl and target come from a file checked into our repository
		child_process.execFileSync(node_gyp, ['install', '--dist-url', remote.disturl, remote.target], { shell: true });
	}

	// On Linux, apply a patch to the downloaded headers
	// Remove dependency on std::source_location to avoid bumping the required GCC version to 11+
	// Refs https://chromium-review.googlesource.com/c/v8/v8/+/6879784
	if (process.platform === 'linux') {
		const homedir = os.homedir();
		const cachePath = process.env.XDG_CACHE_HOME || path.join(homedir, '.cache');
		const nodeGypCache = path.join(cachePath, 'node-gyp');
		const localHeaderPath = path.join(nodeGypCache, local!.target, 'include', 'node');
		if (fs.existsSync(localHeaderPath)) {
			console.log('Applying v8-source-location.patch to', localHeaderPath);
			try {
				child_process.execFileSync('patch', ['-p0', '-i', path.join(import.meta.dirname, 'gyp', 'custom-headers', 'v8-source-location.patch')], {
					cwd: localHeaderPath
				});
			} catch (error) {
				throw new Error(`Error applying v8-source-location.patch: ${(error as Error).message}`);
			}
		}
	}
}

function getHeaderInfo(rcFile: string): { disturl: string; target: string } | undefined {
	const lines = fs.readFileSync(rcFile, 'utf8').split(/\r\n|\n/g);
	let disturl: string | undefined;
	let target: string | undefined;
	for (const line of lines) {
		let match = line.match(/\s*disturl=*\"(.*)\"\s*$/);
		if (match !== null && match.length >= 1) {
			disturl = match[1];
		}
		match = line.match(/\s*target=*\"(.*)\"\s*$/);
		if (match !== null && match.length >= 1) {
			target = match[1];
		}
	}
	return disturl !== undefined && target !== undefined
		? { disturl, target }
		: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/update-all-grammars.ts]---
Location: vscode-main/build/npm/update-all-grammars.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { spawn as _spawn } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

async function spawn(cmd: string, args: string[], opts?: Parameters<typeof _spawn>[2]) {
	return new Promise<void>((c, e) => {
		const child = _spawn(cmd, args, { shell: true, stdio: 'inherit', env: process.env, ...opts });
		child.on('close', code => code === 0 ? c() : e(`Returned ${code}`));
	});
}

async function main() {
	await spawn('npm', ['ci'], { cwd: 'extensions' });

	for (const extension of readdirSync('extensions')) {
		try {
			const packageJSON = JSON.parse(readFileSync(join('extensions', extension, 'package.json')).toString());
			if (!(packageJSON && packageJSON.scripts && packageJSON.scripts['update-grammar'])) {
				continue;
			}
		} catch {
			continue;
		}

		await spawn(`npm`, ['run', 'update-grammar'], { cwd: `extensions/${extension}` });
	}

	// run integration tests

	if (process.platform === 'win32') {
		_spawn('.\\scripts\\test-integration.bat', [], { env: process.env, stdio: 'inherit' });
	} else {
		_spawn('/bin/bash', ['./scripts/test-integration.sh'], { env: process.env, stdio: 'inherit' });
	}
}

if (import.meta.main) {
	try {
		await main();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/update-distro.ts]---
Location: vscode-main/build/npm/update-distro.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { execSync } from 'child_process';
import { join, resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const rootPath = resolve(import.meta.dirname, '..', '..', '..');
const vscodePath = join(rootPath, 'vscode');
const distroPath = join(rootPath, 'vscode-distro');
const commit = execSync('git rev-parse HEAD', { cwd: distroPath, encoding: 'utf8' }).trim();
const packageJsonPath = join(vscodePath, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

packageJson.distro = commit;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
```

--------------------------------------------------------------------------------

---[FILE: build/npm/update-localization-extension.ts]---
Location: vscode-main/build/npm/update-localization-extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as i18n from '../lib/i18n.ts';
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import vfs from 'vinyl-fs';
import rimraf from 'rimraf';
import minimist from 'minimist';

interface Options {
	_: string[];
	location?: string;
	externalExtensionsLocation?: string;
}

interface PackageJson {
	contributes?: {
		localizations?: Localization[];
	};
}

interface Localization {
	languageId: string;
	languageName: string;
	localizedLanguageName: string;
	translations?: Array<{ id: string; path: string }>;
}

interface TranslationPath {
	id: string;
	resourceName: string;
}

function update(options: Options) {
	const idOrPath = options._[0];
	if (!idOrPath) {
		throw new Error('Argument must be the location of the localization extension.');
	}
	const location = options.location;
	if (location !== undefined && !fs.existsSync(location)) {
		throw new Error(`${location} doesn't exist.`);
	}
	const externalExtensionsLocation = options.externalExtensionsLocation;
	if (externalExtensionsLocation !== undefined && !fs.existsSync(externalExtensionsLocation)) {
		throw new Error(`${externalExtensionsLocation} doesn't exist.`);
	}
	let locExtFolder: string = idOrPath;
	if (/^\w{2,3}(-\w+)?$/.test(idOrPath)) {
		locExtFolder = path.join('..', 'vscode-loc', 'i18n', `vscode-language-pack-${idOrPath}`);
	}
	const locExtStat = fs.statSync(locExtFolder);
	if (!locExtStat || !locExtStat.isDirectory) {
		throw new Error('No directory found at ' + idOrPath);
	}
	const packageJSON = JSON.parse(fs.readFileSync(path.join(locExtFolder, 'package.json')).toString()) as PackageJson;
	const contributes = packageJSON['contributes'];
	if (!contributes) {
		throw new Error('The extension must define a "localizations" contribution in the "package.json"');
	}
	const localizations = contributes['localizations'];
	if (!localizations) {
		throw new Error('The extension must define a "localizations" contribution of type array in the "package.json"');
	}

	localizations.forEach(function (localization) {
		if (!localization.languageId || !localization.languageName || !localization.localizedLanguageName) {
			throw new Error('Each localization contribution must define "languageId", "languageName" and "localizedLanguageName" properties.');
		}
		let languageId = localization.languageId;
		const translationDataFolder = path.join(locExtFolder, 'translations');

		switch (languageId) {
			case 'zh-cn':
				languageId = 'zh-Hans';
				break;
			case 'zh-tw':
				languageId = 'zh-Hant';
				break;
			case 'pt-br':
				languageId = 'pt-BR';
				break;
		}

		if (fs.existsSync(translationDataFolder) && fs.existsSync(path.join(translationDataFolder, 'main.i18n.json'))) {
			console.log('Clearing  \'' + translationDataFolder + '\'...');
			rimraf.sync(translationDataFolder);
		}

		console.log(`Importing translations for ${languageId} form '${location}' to '${translationDataFolder}' ...`);
		let translationPaths: TranslationPath[] | undefined = [];
		gulp.src([
			path.join(location!, '**', languageId, '*.xlf'),
			...i18n.EXTERNAL_EXTENSIONS.map((extensionId: string) => path.join(externalExtensionsLocation!, extensionId, languageId, '*-new.xlf'))
		], { silent: false })
			.pipe(i18n.prepareI18nPackFiles(translationPaths))
			.on('error', (error: unknown) => {
				console.log(`Error occurred while importing translations:`);
				translationPaths = undefined;
				if (Array.isArray(error)) {
					error.forEach(console.log);
				} else if (error) {
					console.log(error);
				} else {
					console.log('Unknown error');
				}
			})
			.pipe(vfs.dest(translationDataFolder))
			.on('end', function () {
				if (translationPaths !== undefined) {
					localization.translations = [];
					for (const tp of translationPaths) {
						localization.translations.push({ id: tp.id, path: `./translations/${tp.resourceName}` });
					}
					fs.writeFileSync(path.join(locExtFolder, 'package.json'), JSON.stringify(packageJSON, null, '\t') + '\n');
				}
			});
	});
}
if (path.basename(process.argv[1]) === 'update-localization-extension.js') {
	const options = minimist(process.argv.slice(2), {
		string: ['location', 'externalExtensionsLocation']
	}) as Options;
	update(options);
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/gyp/package-lock.json]---
Location: vscode-main/build/npm/gyp/package-lock.json

```json
{
  "name": "code-oss-dev-build",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "code-oss-dev-build",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "node-gyp": "^11.2.0"
      }
    },
    "node_modules/@isaacs/cliui": {
      "version": "8.0.2",
      "resolved": "https://registry.npmjs.org/@isaacs/cliui/-/cliui-8.0.2.tgz",
      "integrity": "sha512-O8jcjabXaleOG9DQ0+ARXWZBTfnP4WNAqzuiJK7ll44AmxGKv/J2M4TPjxjY3znBCfvBXFzucm1twdyFybFqEA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "string-width": "^5.1.2",
        "string-width-cjs": "npm:string-width@^4.2.0",
        "strip-ansi": "^7.0.1",
        "strip-ansi-cjs": "npm:strip-ansi@^6.0.1",
        "wrap-ansi": "^8.1.0",
        "wrap-ansi-cjs": "npm:wrap-ansi@^7.0.0"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@isaacs/fs-minipass": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/@isaacs/fs-minipass/-/fs-minipass-4.0.1.tgz",
      "integrity": "sha512-wgm9Ehl2jpeqP3zw/7mo3kRHFp5MEDhqAdwy1fTGkHAwnkGOVsgpvQhL8B5n1qlb01jV3n/bI0ZfZp5lWA1k4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.4"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@npmcli/agent": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/agent/-/agent-3.0.0.tgz",
      "integrity": "sha512-S79NdEgDQd/NGCay6TCoVzXSj74skRZIKJcpJjC5lOq34SZzyI6MqtiiWoiVWoVrTcGjNeC4ipbh1VIHlpfF5Q==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "agent-base": "^7.1.0",
        "http-proxy-agent": "^7.0.0",
        "https-proxy-agent": "^7.0.1",
        "lru-cache": "^10.0.1",
        "socks-proxy-agent": "^8.0.3"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/@npmcli/fs": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/@npmcli/fs/-/fs-4.0.0.tgz",
      "integrity": "sha512-/xGlezI6xfGO9NwuJlnwz/K14qD1kCSAGtacBHnGzeAIuJGazcp45KP5NuyARXoKb7cwulAGWVsbeSxdG/cb0Q==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "semver": "^7.3.5"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/@pkgjs/parseargs": {
      "version": "0.11.0",
      "resolved": "https://registry.npmjs.org/@pkgjs/parseargs/-/parseargs-0.11.0.tgz",
      "integrity": "sha512-+1VkjdD0QBLPodGrJUeqarH8VAIvQODIbwh9XpP5Syisf7YoQgsJKPNFoqqLQlu+VQ/tVSshMR6loPMn8U+dPg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=14"
      }
    },
    "node_modules/abbrev": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-3.0.1.tgz",
      "integrity": "sha512-AO2ac6pjRB3SJmGJo+v5/aK6Omggp6fsLrs6wN9bd35ulu4cCwaAU9+7ZhXjeqHVkaHThLuzH0nZr0YpCDhygg==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/agent-base": {
      "version": "7.1.3",
      "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-7.1.3.tgz",
      "integrity": "sha512-jRR5wdylq8CkOe6hei19GGZnxM6rBGwFl3Bg0YItGDimvjGtAvdZk4Pu6Cl4u4Igsws4a1fd1Vq3ezrhn4KmFw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/ansi-regex": {
      "version": "6.1.0",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-6.1.0.tgz",
      "integrity": "sha512-7HSX4QQb4CspciLpVFwyRe79O3xsIZDDLER21kERQ71oaPodF8jL725AgJMFAYbooIqolJoRLuM81SpeUkpkvA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-regex?sponsor=1"
      }
    },
    "node_modules/ansi-styles": {
      "version": "6.2.1",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-6.2.1.tgz",
      "integrity": "sha512-bN798gFfQX+viw3R7yrGWRqnrN2oRkEkUjjl4JNn4E8GxxbjtG3FbrEIIY3l8/hrwUwIeCZvi4QuOTP4MErVug==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/brace-expansion": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-2.0.2.tgz",
      "integrity": "sha512-Jt0vHyM+jmUBqojB7E1NIYadt0vI0Qxjxd2TErW94wDz+E2LAm5vKMXXwg6ZZBTHPuUlDgQHKXvjGBdfcF1ZDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0"
      }
    },
    "node_modules/cacache": {
      "version": "19.0.1",
      "resolved": "https://registry.npmjs.org/cacache/-/cacache-19.0.1.tgz",
      "integrity": "sha512-hdsUxulXCi5STId78vRVYEtDAjq99ICAUktLTeTYsLoTE6Z8dS0c8pWNCxwdrk9YfJeobDZc2Y186hD/5ZQgFQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/fs": "^4.0.0",
        "fs-minipass": "^3.0.0",
        "glob": "^10.2.2",
        "lru-cache": "^10.0.1",
        "minipass": "^7.0.3",
        "minipass-collect": "^2.0.1",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "p-map": "^7.0.2",
        "ssri": "^12.0.0",
        "tar": "^7.4.3",
        "unique-filename": "^4.0.0"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/chownr": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/chownr/-/chownr-3.0.0.tgz",
      "integrity": "sha512-+IxzY9BZOQd/XuYPRmrvEVjF/nqj5kgT4kEq7VofrDoM1MxoRjEWkrCC3EtLi59TVawxTAn+orJwFQcrqEN1+g==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/cross-spawn/node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/cross-spawn/node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/debug": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.1.tgz",
      "integrity": "sha512-KcKCqiftBJcZr++7ykoDIEwSa3XWowTfNPo92BYxjXiyYEVrUQh2aLyhxBCwww+heortUFxEJYcRzosstTEBYQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/eastasianwidth": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/eastasianwidth/-/eastasianwidth-0.2.0.tgz",
      "integrity": "sha512-I88TYZWc9XiYHRQ4/3c5rjjfgkjhLyW2luGIheGERbNQ6OY7yTybanSpDXZa8y7VUP9YmDcYa+eyq4ca7iLqWA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/encoding": {
      "version": "0.1.13",
      "resolved": "https://registry.npmjs.org/encoding/-/encoding-0.1.13.tgz",
      "integrity": "sha512-ETBauow1T35Y/WZMkio9jiM0Z5xjHHmJ4XmjZOq1l/dXz3lr2sRn87nJy20RupqSh1F2m3HHPSp8ShIPQJrJ3A==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "iconv-lite": "^0.6.2"
      }
    },
    "node_modules/env-paths": {
      "version": "2.2.1",
      "resolved": "https://registry.npmjs.org/env-paths/-/env-paths-2.2.1.tgz",
      "integrity": "sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/err-code": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/err-code/-/err-code-2.0.3.tgz",
      "integrity": "sha512-2bmlRpNKBxT/CRmPOlyISQpNj+qSeYvcym/uT0Jx2bMOlKLtSy1ZmLuVxSEKKyor/N5yhvp/ZiG1oE3DEYMSFA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/exponential-backoff": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/exponential-backoff/-/exponential-backoff-3.1.1.tgz",
      "integrity": "sha512-dX7e/LHVJ6W3DE1MHWi9S1EYzDESENfLrYohG2G++ovZrYOkm4Knwa0mc1cn84xJOR4KEU0WSchhLbd0UklbHw==",
      "dev": true,
      "license": "Apache-2.0"
    },
    "node_modules/fdir": {
      "version": "6.4.5",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.4.5.tgz",
      "integrity": "sha512-4BG7puHpVsIYxZUbiUE3RqGloLaSSwzYie5jvasC4LWuBWzZawynvYouhjbQKw2JuIGYdm0DzIxl8iVidKlUEw==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/foreground-child": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/foreground-child/-/foreground-child-3.3.1.tgz",
      "integrity": "sha512-gIXjKqtFuWEgzFRJA9WCQeSJLZDjgJUOMCMzxtvFq/37KojM1BFGufqsCy0r4qSQmYLsZYMeyRqzIWOMup03sw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "cross-spawn": "^7.0.6",
        "signal-exit": "^4.0.1"
      },
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/fs-minipass": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/fs-minipass/-/fs-minipass-3.0.3.tgz",
      "integrity": "sha512-XUBA9XClHbnJWSfBzjkm6RvPsyg3sryZt06BEQoXcF7EK/xpGaQYJgQKDJSUH5SGZ76Y7pFx1QBnXz09rU5Fbw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
      }
    },
    "node_modules/glob": {
      "version": "10.5.0",
      "resolved": "https://registry.npmjs.org/glob/-/glob-10.5.0.tgz",
      "integrity": "sha512-DfXN8DfhJ7NH3Oe7cFmu3NCu1wKbkReJ8TorzSAFbSKrlNaQSKfIzqYqVY8zlbs2NLBbWpRiU52GX2PbaBVNkg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "foreground-child": "^3.1.0",
        "jackspeak": "^3.1.2",
        "minimatch": "^9.0.4",
        "minipass": "^7.1.2",
        "package-json-from-dist": "^1.0.0",
        "path-scurry": "^1.11.1"
      },
      "bin": {
        "glob": "dist/esm/bin.mjs"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.10",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.10.tgz",
      "integrity": "sha512-9ByhssR2fPVsNZj478qUUbKfmL0+t5BDVyjShtyZZLiK7ZDAArFFfopyOTj0M05wE2tJPisA4iTnnXl2YoPvOA==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/http-cache-semantics": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/http-cache-semantics/-/http-cache-semantics-4.2.0.tgz",
      "integrity": "sha512-dTxcvPXqPvXBQpq5dUr6mEMJX4oIEFv6bwom3FDwKRDsuIjjJGANqhBuoAn9c1RQJIdAKav33ED65E2ys+87QQ==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/http-proxy-agent": {
      "version": "7.0.2",
      "resolved": "https://registry.npmjs.org/http-proxy-agent/-/http-proxy-agent-7.0.2.tgz",
      "integrity": "sha512-T1gkAiYYDWYx3V5Bmyu7HcfcvL7mUrTWiM6yOfa3PIphViJ/gFPbvidQ+veqSOHci/PxBcDabeUNCzpOODJZig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.0",
        "debug": "^4.3.4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/https-proxy-agent": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-7.0.6.tgz",
      "integrity": "sha512-vK9P5/iUfdl95AI+JVyUuIcVtd4ofvtrOr3HNtM2yxC9bnMbEdp3x01OhQNnjb8IJYi38VlTE3mBXwcfvywuSw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "4"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
      "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/ip-address": {
      "version": "9.0.5",
      "resolved": "https://registry.npmjs.org/ip-address/-/ip-address-9.0.5.tgz",
      "integrity": "sha512-zHtQzGojZXTwZTHQqra+ETKd4Sn3vgi7uBmlPoXVWZqYvuKmtI0l/VZTjqGmJY9x88GGOaZ9+G9ES8hC4T4X8g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "jsbn": "1.1.0",
        "sprintf-js": "^1.1.3"
      },
      "engines": {
        "node": ">= 12"
      }
    },
    "node_modules/is-fullwidth-code-point": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-3.0.0.tgz",
      "integrity": "sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/isexe": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-3.1.1.tgz",
      "integrity": "sha512-LpB/54B+/2J5hqQ7imZHfdU31OlgQqx7ZicVlkm9kzg9/w8GKLEcFfJl/t7DCEDueOyBAD6zCCwTO6Fzs0NoEQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/jackspeak": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/jackspeak/-/jackspeak-3.4.3.tgz",
      "integrity": "sha512-OGlZQpz2yfahA/Rd1Y8Cd9SIEsqvXkLVoSw/cgwhnhFMDbsQFeZYoJJ7bIZBS9BcamUW96asq/npPWugM+RQBw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "@isaacs/cliui": "^8.0.2"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      },
      "optionalDependencies": {
        "@pkgjs/parseargs": "^0.11.0"
      }
    },
    "node_modules/jsbn": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/jsbn/-/jsbn-1.1.0.tgz",
      "integrity": "sha512-4bYVV3aAMtDTTu4+xsDYa6sy9GyJ69/amsu9sYF2zqjiEoZA5xJi3BrfX3uY+/IekIu7MwdObdbDWpoZdBv3/A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/lru-cache": {
      "version": "10.4.3",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-10.4.3.tgz",
      "integrity": "sha512-JNAzZcXrCt42VGLuYz0zfAzDfAvJWW6AfYlDBQyDV5DClI2m5sAmK+OIO7s59XfsRsWHp02jAJrRadPRGTt6SQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/make-fetch-happen": {
      "version": "14.0.3",
      "resolved": "https://registry.npmjs.org/make-fetch-happen/-/make-fetch-happen-14.0.3.tgz",
      "integrity": "sha512-QMjGbFTP0blj97EeidG5hk/QhKQ3T4ICckQGLgz38QF7Vgbk6e6FTARN8KhKxyBbWn8R0HU+bnw8aSoFPD4qtQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@npmcli/agent": "^3.0.0",
        "cacache": "^19.0.1",
        "http-cache-semantics": "^4.1.1",
        "minipass": "^7.0.2",
        "minipass-fetch": "^4.0.0",
        "minipass-flush": "^1.0.5",
        "minipass-pipeline": "^1.2.4",
        "negotiator": "^1.0.0",
        "proc-log": "^5.0.0",
        "promise-retry": "^2.0.1",
        "ssri": "^12.0.0"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/minimatch": {
      "version": "9.0.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-9.0.5.tgz",
      "integrity": "sha512-G6T0ZX48xgozx7587koeX9Ys2NYy6Gmv//P89sEte9V9whIapMNF4idKxnW2QtCcLiTWlb/wfCabAtAFWhhBow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^2.0.1"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/minipass": {
      "version": "7.1.2",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-7.1.2.tgz",
      "integrity": "sha512-qOOzS1cBTWYF4BH8fVePDBOO9iptMnGUEZwNc/cMWnTV2nVLZ7VoNWEPHkYczZA0pdoA7dl6e7FL659nX9S2aw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-collect": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/minipass-collect/-/minipass-collect-2.0.1.tgz",
      "integrity": "sha512-D7V8PO9oaz7PWGLbCACuI1qEOsq7UKfLotx/C0Aet43fCUB/wfQ7DYeq2oR/svFJGYDHPr38SHATeaj/ZoKHKw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": ">=16 || 14 >=14.17"
      }
    },
    "node_modules/minipass-fetch": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/minipass-fetch/-/minipass-fetch-4.0.1.tgz",
      "integrity": "sha512-j7U11C5HXigVuutxebFadoYBbd7VSdZWggSe64NVdvWNBqGAiXPL2QVCehjmw7lY1oF9gOllYbORh+hiNgfPgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minipass": "^7.0.3",
        "minipass-sized": "^1.0.3",
        "minizlib": "^3.0.1"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      },
      "optionalDependencies": {
        "encoding": "^0.1.13"
      }
    },
    "node_modules/minipass-flush": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/minipass-flush/-/minipass-flush-1.0.5.tgz",
      "integrity": "sha512-JmQSYYpPUqX5Jyn1mXaRwOda1uQ8HP5KAT/oDSLCzt1BYRhQU0/hDtsB1ufZfEEzMZ9aAVmsBw8+FWsIXlClWw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/minipass-flush/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-flush/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/minipass-pipeline": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/minipass-pipeline/-/minipass-pipeline-1.2.4.tgz",
      "integrity": "sha512-xuIq7cIOt09RPRJ19gdi4b+RiNvDFYe5JH+ggNvBqGqpQXcru3PcRmOZuHBKWK1Txf9+cQ+HMVN4d6z46LZP7A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-pipeline/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/minipass-sized": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/minipass-sized/-/minipass-sized-1.0.3.tgz",
      "integrity": "sha512-MbkQQ2CTiBMlA2Dm/5cY+9SWFEN8pzzOXi6rlM5Xxq0Yqbda5ZQy9sU75a673FE9ZK0Zsbr6Y5iP6u9nktfg2g==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-sized/node_modules/minipass": {
      "version": "3.3.6",
      "resolved": "https://registry.npmjs.org/minipass/-/minipass-3.3.6.tgz",
      "integrity": "sha512-DxiNidxSEK+tHG6zOIklvNOwm3hvCrbUrdtzY74U6HKTJxvIDfOUL5W5P2Ghd3DTkhhKPYGqeNUIh5qcM4YBfw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/minipass-sized/node_modules/yallist": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-4.0.0.tgz",
      "integrity": "sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/minizlib": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/minizlib/-/minizlib-3.0.2.tgz",
      "integrity": "sha512-oG62iEk+CYt5Xj2YqI5Xi9xWUeZhDI8jjQmC5oThVH5JGCTgIjr7ciJDzC7MBzYd//WvR1OTmP5Q38Q8ShQtVA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minipass": "^7.1.2"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/mkdirp": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/mkdirp/-/mkdirp-3.0.1.tgz",
      "integrity": "sha512-+NsyUUAZDmo6YVHzL/stxSu3t9YS1iljliy3BSDrXJ/dkn1KYdmtZODGGjLcc9XLgVVpH4KshHB8XmZgMhaBXg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "mkdirp": "dist/cjs/src/bin.js"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
      "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/node-gyp": {
      "version": "11.2.0",
      "resolved": "https://registry.npmjs.org/node-gyp/-/node-gyp-11.2.0.tgz",
      "integrity": "sha512-T0S1zqskVUSxcsSTkAsLc7xCycrRYmtDHadDinzocrThjyQCn5kMlEBSj6H4qDbgsIOSLmmlRIeb0lZXj+UArA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "env-paths": "^2.2.0",
        "exponential-backoff": "^3.1.1",
        "graceful-fs": "^4.2.6",
        "make-fetch-happen": "^14.0.3",
        "nopt": "^8.0.0",
        "proc-log": "^5.0.0",
        "semver": "^7.3.5",
        "tar": "^7.4.3",
        "tinyglobby": "^0.2.12",
        "which": "^5.0.0"
      },
      "bin": {
        "node-gyp": "bin/node-gyp.js"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/nopt": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/nopt/-/nopt-8.1.0.tgz",
      "integrity": "sha512-ieGu42u/Qsa4TFktmaKEwM6MQH0pOWnaB3htzh0JRtx84+Mebc0cbZYN5bC+6WTZ4+77xrL9Pn5m7CV6VIkV7A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "abbrev": "^3.0.0"
      },
      "bin": {
        "nopt": "bin/nopt.js"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/p-map": {
      "version": "7.0.3",
      "resolved": "https://registry.npmjs.org/p-map/-/p-map-7.0.3.tgz",
      "integrity": "sha512-VkndIv2fIB99swvQoA65bm+fsmt6UNdGeIB0oxBs+WhAhdh08QA04JXpI7rbB9r08/nkbysKoya9rtDERYOYMA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/package-json-from-dist": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/package-json-from-dist/-/package-json-from-dist-1.0.1.tgz",
      "integrity": "sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==",
      "dev": true,
      "license": "BlueOak-1.0.0"
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-scurry": {
      "version": "1.11.1",
      "resolved": "https://registry.npmjs.org/path-scurry/-/path-scurry-1.11.1.tgz",
      "integrity": "sha512-Xa4Nw17FS9ApQFJ9umLiJS4orGjm7ZzwUrwamcGQuHSzDyth9boKDaycYdDcZDuqYATXw4HFXgaqWTctW/v1HA==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "lru-cache": "^10.2.0",
        "minipass": "^5.0.0 || ^6.0.2 || ^7.0.0"
      },
      "engines": {
        "node": ">=16 || 14 >=14.18"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/picomatch": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.2.tgz",
      "integrity": "sha512-M7BAV6Rlcy5u+m6oPhAPFgJTzAioX/6B0DxyvDlo9l8+T3nLKbrczg2WLUyzd45L8RqfUMyGPzekbMvX2Ldkwg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/proc-log": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/proc-log/-/proc-log-5.0.0.tgz",
      "integrity": "sha512-Azwzvl90HaF0aCz1JrDdXQykFakSSNPaPoiZ9fm5qJIMHioDZEi7OAdRwSm6rSoPtY3Qutnm3L7ogmg3dc+wbQ==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/promise-retry": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/promise-retry/-/promise-retry-2.0.1.tgz",
      "integrity": "sha512-y+WKFlBR8BGXnsNlIHFGPZmyDf3DFMoLhaflAnyZgV6rG6xu+JwesTo2Q9R6XwYmtmwAFCkAk3e35jEdoeh/3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "err-code": "^2.0.2",
        "retry": "^0.12.0"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/retry": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/retry/-/retry-0.12.0.tgz",
      "integrity": "sha512-9LkiTwjUh6rT555DtE9rTX+BKByPfrMzEAtnlEtdEwr3Nkffwiihqe2bWADg+OQRjt9gl6ICdmB/ZFDCGAtSow==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "dev": true,
      "license": "MIT",
      "optional": true
    },
    "node_modules/semver": {
      "version": "7.7.2",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.2.tgz",
      "integrity": "sha512-RF0Fw+rO5AMf9MAyaRXI4AV0Ulj5lMHqVxxdSgiVbixSCXoEmmX/jk0CuJw4+3SqroYO9VoUh+HcuJivvtJemA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/signal-exit": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-4.1.0.tgz",
      "integrity": "sha512-bzyZ1e88w9O1iNJbKnOlvYTrWPDl46O1bG0D3XInv+9tkPrxrN8jUUTiFlDkkmKWgn1M6CfIA13SuGqOa9Korw==",
      "dev": true,
      "license": "ISC",
      "engines": {
        "node": ">=14"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/smart-buffer": {
      "version": "4.2.0",
      "resolved": "https://registry.npmjs.org/smart-buffer/-/smart-buffer-4.2.0.tgz",
      "integrity": "sha512-94hK0Hh8rPqQl2xXc3HsaBoOXKV20MToPkcXvwbISWLEs+64sBq5kFgn2kJDHb1Pry9yrP0dxrCI9RRci7RXKg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 6.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks": {
      "version": "2.8.4",
      "resolved": "https://registry.npmjs.org/socks/-/socks-2.8.4.tgz",
      "integrity": "sha512-D3YaD0aRxR3mEcqnidIs7ReYJFVzWdd6fXJYUM8ixcQcJRGTka/b3saV0KflYhyVJXKhb947GndU35SxYNResQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ip-address": "^9.0.5",
        "smart-buffer": "^4.2.0"
      },
      "engines": {
        "node": ">= 10.0.0",
        "npm": ">= 3.0.0"
      }
    },
    "node_modules/socks-proxy-agent": {
      "version": "8.0.5",
      "resolved": "https://registry.npmjs.org/socks-proxy-agent/-/socks-proxy-agent-8.0.5.tgz",
      "integrity": "sha512-HehCEsotFqbPW9sJ8WVYB6UbmIMv7kUUORIF2Nncq4VQvBfNBLibW9YZR5dlYCSUhwcD628pRllm7n+E+YTzJw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "agent-base": "^7.1.2",
        "debug": "^4.3.4",
        "socks": "^2.8.3"
      },
      "engines": {
        "node": ">= 14"
      }
    },
    "node_modules/sprintf-js": {
      "version": "1.1.3",
      "resolved": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.1.3.tgz",
      "integrity": "sha512-Oo+0REFV59/rz3gfJNKQiBlwfHaSESl1pcGyABQsnnIfWOFt6JNj5gCog2U6MLZ//IGYD+nA8nI+mTShREReaA==",
      "dev": true,
      "license": "BSD-3-Clause"
    },
    "node_modules/ssri": {
      "version": "12.0.0",
      "resolved": "https://registry.npmjs.org/ssri/-/ssri-12.0.0.tgz",
      "integrity": "sha512-S7iGNosepx9RadX82oimUkvr0Ct7IjJbEbs4mJcTxst8um95J3sDYU1RBEOvdu6oL1Wek2ODI5i4MAw+dZ6cAQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "minipass": "^7.0.3"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/string-width": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-5.1.2.tgz",
      "integrity": "sha512-HnLOCR3vjcY8beoNLtcjZ5/nxn2afmME6lhrDrebokqMap+XbeW8n9TXpPDOqdGK5qcI3oT0GKTW6wC7EMiVqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eastasianwidth": "^0.2.0",
        "emoji-regex": "^9.2.2",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/string-width-cjs": {
      "name": "string-width",
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/string-width-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/string-width-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi": {
      "version": "7.1.0",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-7.1.0.tgz",
      "integrity": "sha512-iq6eVVI64nQQTRYq2KtEg2d2uU7LElhTJwsH4YzIHZshxlgZms/wIc4VoDQTlG/IvVIrBKG06CrZnp0qv7hkcQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^6.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/strip-ansi?sponsor=1"
      }
    },
    "node_modules/strip-ansi-cjs": {
      "name": "strip-ansi",
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/strip-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/tar": {
      "version": "7.4.3",
      "resolved": "https://registry.npmjs.org/tar/-/tar-7.4.3.tgz",
      "integrity": "sha512-5S7Va8hKfV7W5U6g3aYxXmlPoZVAwUMy9AOKyF2fVuZa2UD3qZjg578OrLRt8PcNN1PleVaL/5/yYATNL0ICUw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@isaacs/fs-minipass": "^4.0.0",
        "chownr": "^3.0.0",
        "minipass": "^7.1.2",
        "minizlib": "^3.0.1",
        "mkdirp": "^3.0.1",
        "yallist": "^5.0.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.14",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.14.tgz",
      "integrity": "sha512-tX5e7OM1HnYr2+a2C/4V0htOcSQcoSTH9KgJnVvNm5zm/cyEWKJ7j7YutsH9CxMdtOkkLFy2AHrMci9IM8IPZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.4.4",
        "picomatch": "^4.0.2"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/unique-filename": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/unique-filename/-/unique-filename-4.0.0.tgz",
      "integrity": "sha512-XSnEewXmQ+veP7xX2dS5Q4yZAvO40cBN2MWkJ7D/6sW4Dg6wYBNwM1Vrnz1FhH5AdeLIlUXRI9e28z1YZi71NQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "unique-slug": "^5.0.0"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/unique-slug": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/unique-slug/-/unique-slug-5.0.0.tgz",
      "integrity": "sha512-9OdaqO5kwqR+1kVgHAhsp5vPNU0hnxRa26rBFNfNgM7M6pNtgzeBn3s/xbyCQL3dcjzOatcef6UUHpB/6MaETg==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "imurmurhash": "^0.1.4"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/which": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/which/-/which-5.0.0.tgz",
      "integrity": "sha512-JEdGzHwwkrbWoGOlIHqQ5gtprKGOenpDHpxE9zVR1bWbOtYRyPPHMe9FaP6x61CmNaTThSkb0DAJte5jD+DmzQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^3.1.1"
      },
      "bin": {
        "node-which": "bin/which.js"
      },
      "engines": {
        "node": "^18.17.0 || >=20.5.0"
      }
    },
    "node_modules/wrap-ansi": {
      "version": "8.1.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-8.1.0.tgz",
      "integrity": "sha512-si7QWI6zUMq56bESFvagtmzMdGOtoxfR+Sez11Mobfc7tm+VkUckk9bW2UeffTGVUbOksxmSw0AA2gs8g71NCQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^6.1.0",
        "string-width": "^5.0.1",
        "strip-ansi": "^7.0.1"
      },
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs": {
      "name": "wrap-ansi",
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/wrap-ansi/-/wrap-ansi-7.0.0.tgz",
      "integrity": "sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.0.0",
        "string-width": "^4.1.0",
        "strip-ansi": "^6.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/wrap-ansi?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/ansi-regex": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
      "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/emoji-regex": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-8.0.0.tgz",
      "integrity": "sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/wrap-ansi-cjs/node_modules/string-width": {
      "version": "4.2.3",
      "resolved": "https://registry.npmjs.org/string-width/-/string-width-4.2.3.tgz",
      "integrity": "sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "emoji-regex": "^8.0.0",
        "is-fullwidth-code-point": "^3.0.0",
        "strip-ansi": "^6.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/wrap-ansi-cjs/node_modules/strip-ansi": {
      "version": "6.0.1",
      "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
      "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-regex": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/yallist": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-5.0.0.tgz",
      "integrity": "sha512-YgvUTfwqyc7UXVMrB+SImsVYSmTS8X/tSrtdNZMImM+n7+QTriRXyXim0mBrTXNeqzVF0KWGgHPeiyViFFrNDw==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "engines": {
        "node": ">=18"
      }
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/gyp/package.json]---
Location: vscode-main/build/npm/gyp/package.json

```json
{
  "name": "code-oss-dev-build",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "devDependencies": {
    "node-gyp": "^11.2.0"
  },
  "scripts": {}
}
```

--------------------------------------------------------------------------------

---[FILE: build/npm/gyp/custom-headers/v8-source-location.patch]---
Location: vscode-main/build/npm/gyp/custom-headers/v8-source-location.patch

```text
--- v8-source-location.h	2025-10-28 05:57:35
+++ v8-source-location.h	2025-11-07 03:10:02
@@ -6,12 +6,21 @@
 #define INCLUDE_SOURCE_LOCATION_H_

 #include <cstddef>
-#include <source_location>
 #include <string>

 #include "v8config.h"  // NOLINT(build/include_directory)

+#if defined(__has_builtin)
+#define V8_SUPPORTS_SOURCE_LOCATION                                      \
+  (__has_builtin(__builtin_FUNCTION) && __has_builtin(__builtin_FILE) && \
+   __has_builtin(__builtin_LINE))  // NOLINT
+#elif defined(V8_CC_GNU) && __GNUC__ >= 7
 #define V8_SUPPORTS_SOURCE_LOCATION 1
+#elif defined(V8_CC_INTEL) && __ICC >= 1800
+#define V8_SUPPORTS_SOURCE_LOCATION 1
+#else
+#define V8_SUPPORTS_SOURCE_LOCATION 0
+#endif

 namespace v8 {

@@ -25,10 +34,15 @@
    * Construct source location information corresponding to the location of the
    * call site.
    */
+#if V8_SUPPORTS_SOURCE_LOCATION
   static constexpr SourceLocation Current(
-      const std::source_location& loc = std::source_location::current()) {
-    return SourceLocation(loc);
+      const char* function = __builtin_FUNCTION(),
+      const char* file = __builtin_FILE(), size_t line = __builtin_LINE()) {
+    return SourceLocation(function, file, line);
   }
+#else
+  static constexpr SourceLocation Current() { return SourceLocation(); }
+#endif  // V8_SUPPORTS_SOURCE_LOCATION
 #ifdef DEBUG
   static constexpr SourceLocation CurrentIfDebug(
       const std::source_location& loc = std::source_location::current()) {
@@ -49,21 +63,21 @@
    *
    * \returns the function name as cstring.
    */
-  constexpr const char* Function() const { return loc_.function_name(); }
+  constexpr const char* Function() const { return function_; }

   /**
    * Returns the name of the current source file represented by this object.
    *
    * \returns the file name as cstring.
    */
-  constexpr const char* FileName() const { return loc_.file_name(); }
+  constexpr const char* FileName() const { return file_; }

   /**
    * Returns the line number represented by this object.
    *
    * \returns the line number.
    */
-  constexpr size_t Line() const { return loc_.line(); }
+  constexpr size_t Line() const { return line_; }

   /**
    * Returns a human-readable string representing this object.
@@ -71,18 +85,19 @@
    * \returns a human-readable string representing source location information.
    */
   std::string ToString() const {
-    if (loc_.line() == 0) {
+    if (!file_) {
       return {};
     }
-    return std::string(loc_.function_name()) + "@" + loc_.file_name() + ":" +
-           std::to_string(loc_.line());
+    return std::string(function_) + "@" + file_ + ":" + std::to_string(line_);
   }

  private:
-  constexpr explicit SourceLocation(const std::source_location& loc)
-      : loc_(loc) {}
+  constexpr SourceLocation(const char* function, const char* file, size_t line)
+      : function_(function), file_(file), line_(line) {}

-  std::source_location loc_;
+  const char* function_ = nullptr;
+  const char* file_ = nullptr;
+  size_t line_ = 0u;
 };

 }  // namespace v8
```

--------------------------------------------------------------------------------

---[FILE: build/vite/index-workbench.ts]---
Location: vscode-main/build/vite/index-workbench.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import '../../src/vs/code/browser/workbench/workbench';
import './setup-dev';
```

--------------------------------------------------------------------------------

---[FILE: build/vite/index.html]---
Location: vscode-main/build/vite/index.html

```html
<!-- Copyright (C) Microsoft Corporation. All rights reserved. -->
<!DOCTYPE html>
<html>
	<body>
		<div id="sampleContent"></div>
		<p>Use the Playground Launch Config for a better dev experience</p>
		<script src="./index.ts" type="module"></script>
	</body>
</html>
```

--------------------------------------------------------------------------------

---[FILE: build/vite/index.ts]---
Location: vscode-main/build/vite/index.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/// <reference path="../../src/vs/monaco.d.ts" />
/* eslint-disable local/code-no-standalone-editor */

export * from '../../src/vs/editor/editor.main';
import './style.css';
import * as monaco from '../../src/vs/editor/editor.main';

globalThis.monaco = monaco;
const root = document.getElementById('sampleContent');
if (root) {
	const d = monaco.editor.createDiffEditor(root);

	d.setModel({
		modified: monaco.editor.createModel(`hello world`),
		original: monaco.editor.createModel(`hello monaco`),
	});
}
```

--------------------------------------------------------------------------------

````
