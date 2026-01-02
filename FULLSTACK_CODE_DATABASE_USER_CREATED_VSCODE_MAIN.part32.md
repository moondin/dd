---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:25Z
part: 32
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 32 of 552)

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

---[FILE: extensions/css-language-features/server/src/requests.ts]---
Location: vscode-main/extensions/css-language-features/server/src/requests.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestType, Connection } from 'vscode-languageserver';
import { RuntimeEnvironment } from './cssServer';

export namespace FsContentRequest {
	export const type: RequestType<{ uri: string; encoding?: string }, string, any> = new RequestType('fs/content');
}
export namespace FsStatRequest {
	export const type: RequestType<string, FileStat, any> = new RequestType('fs/stat');
}

export namespace FsReadDirRequest {
	export const type: RequestType<string, [string, FileType][], any> = new RequestType('fs/readDir');
}

export enum FileType {
	/**
	 * The file type is unknown.
	 */
	Unknown = 0,
	/**
	 * A regular file.
	 */
	File = 1,
	/**
	 * A directory.
	 */
	Directory = 2,
	/**
	 * A symbolic link to a file.
	 */
	SymbolicLink = 64
}
export interface FileStat {
	/**
	 * The type of the file, e.g. is a regular file, a directory, or symbolic link
	 * to a file.
	 */
	type: FileType;
	/**
	 * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	ctime: number;
	/**
	 * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
	 */
	mtime: number;
	/**
	 * The size in bytes.
	 */
	size: number;
}

export interface RequestService {
	getContent(uri: string, encoding?: string): Promise<string>;

	stat(uri: string): Promise<FileStat>;
	readDirectory(uri: string): Promise<[string, FileType][]>;
}


export function getRequestService(handledSchemas: string[], connection: Connection, runtime: RuntimeEnvironment): RequestService {
	const builtInHandlers: { [protocol: string]: RequestService | undefined } = {};
	for (const protocol of handledSchemas) {
		if (protocol === 'file') {
			builtInHandlers[protocol] = runtime.file;
		} else if (protocol === 'http' || protocol === 'https') {
			builtInHandlers[protocol] = runtime.http;
		}
	}
	return {
		async stat(uri: string): Promise<FileStat> {
			const handler = builtInHandlers[getScheme(uri)];
			if (handler) {
				return handler.stat(uri);
			}
			const res = await connection.sendRequest(FsStatRequest.type, uri.toString());
			return res;
		},
		readDirectory(uri: string): Promise<[string, FileType][]> {
			const handler = builtInHandlers[getScheme(uri)];
			if (handler) {
				return handler.readDirectory(uri);
			}
			return connection.sendRequest(FsReadDirRequest.type, uri.toString());
		},
		getContent(uri: string, encoding?: string): Promise<string> {
			const handler = builtInHandlers[getScheme(uri)];
			if (handler) {
				return handler.getContent(uri, encoding);
			}
			return connection.sendRequest(FsContentRequest.type, { uri: uri.toString(), encoding });
		}
	};
}

function getScheme(uri: string) {
	return uri.substr(0, uri.indexOf(':'));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/browser/cssServerMain.ts]---
Location: vscode-main/extensions/css-language-features/server/src/browser/cssServerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, BrowserMessageReader, BrowserMessageWriter, Disposable } from 'vscode-languageserver/browser';
import { RuntimeEnvironment, startServer } from '../cssServer';

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setTimeout(callback, 0, ...args);
			return { dispose: () => clearTimeout(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	}
};

startServer(connection, runtime);
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/browser/cssServerWorkerMain.ts]---
Location: vscode-main/extensions/css-language-features/server/src/browser/cssServerWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as l10n from '@vscode/l10n';

let initialized = false;
const pendingMessages: any[] = [];
const messageHandler = async (e: any) => {
	if (!initialized) {
		const l10nLog: string[] = [];
		initialized = true;
		const i10lLocation = e.data.i10lLocation;
		if (i10lLocation) {
			try {
				await l10n.config({ uri: i10lLocation });
				l10nLog.push(`l10n: Configured to ${i10lLocation.toString()}.`);
			} catch (e) {
				l10nLog.push(`l10n: Problems loading ${i10lLocation.toString()} : ${e}.`);
			}
		} else {
			l10nLog.push(`l10n: No bundle configured.`);
		}
		await import('./cssServerMain.js');
		if (self.onmessage !== messageHandler) {
			pendingMessages.forEach(msg => self.onmessage?.(msg));
			pendingMessages.length = 0;
		}
		l10nLog.forEach(console.log);
	} else {
		pendingMessages.push(e);
	}
};
self.onmessage = messageHandler;
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/node/cssServerMain.ts]---
Location: vscode-main/extensions/css-language-features/server/src/node/cssServerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, Connection, Disposable } from 'vscode-languageserver/node';
import { formatError } from '../utils/runner';
import { RuntimeEnvironment, startServer } from '../cssServer';
import { getNodeFSRequestService } from './nodeFs';

// Create a connection for the server.
const connection: Connection = createConnection();

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

process.on('unhandledRejection', (e: any) => {
	connection.console.error(formatError(`Unhandled exception`, e));
});

const runtime: RuntimeEnvironment = {
	timer: {
		setImmediate(callback: (...args: any[]) => void, ...args: any[]): Disposable {
			const handle = setImmediate(callback, ...args);
			return { dispose: () => clearImmediate(handle) };
		},
		setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): Disposable {
			const handle = setTimeout(callback, ms, ...args);
			return { dispose: () => clearTimeout(handle) };
		}
	},
	file: getNodeFSRequestService()
};

startServer(connection, runtime);
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/node/cssServerNodeMain.ts]---
Location: vscode-main/extensions/css-language-features/server/src/node/cssServerNodeMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as l10n from '@vscode/l10n';
async function setupMain() {
	const l10nLog: string[] = [];

	const i10lLocation = process.env['VSCODE_L10N_BUNDLE_LOCATION'];
	if (i10lLocation) {
		try {
			await l10n.config({ uri: i10lLocation });
			l10nLog.push(`l10n: Configured to ${i10lLocation.toString()}`);
		} catch (e) {
			l10nLog.push(`l10n: Problems loading ${i10lLocation.toString()} : ${e}`);
		}
	}
	await import('./cssServerMain.js');
	l10nLog.forEach(console.log);
}
setupMain();
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/node/nodeFs.ts]---
Location: vscode-main/extensions/css-language-features/server/src/node/nodeFs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RequestService } from '../requests';
import { URI as Uri } from 'vscode-uri';

import * as fs from 'fs';
import { FileType } from 'vscode-css-languageservice';

export function getNodeFSRequestService(): RequestService {
	function ensureFileUri(location: string) {
		if (!location.startsWith('file://')) {
			throw new Error('fileRequestService can only handle file URLs');
		}
	}
	return {
		getContent(location: string, encoding?: BufferEncoding) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.readFile(uri.fsPath, encoding, (err, buf) => {
					if (err) {
						return e(err);
					}
					c(buf.toString());

				});
			});
		},
		stat(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const uri = Uri.parse(location);
				fs.stat(uri.fsPath, (err, stats) => {
					if (err) {
						if (err.code === 'ENOENT') {
							return c({ type: FileType.Unknown, ctime: -1, mtime: -1, size: -1 });
						} else {
							return e(err);
						}
					}

					let type = FileType.Unknown;
					if (stats.isFile()) {
						type = FileType.File;
					} else if (stats.isDirectory()) {
						type = FileType.Directory;
					} else if (stats.isSymbolicLink()) {
						type = FileType.SymbolicLink;
					}

					c({
						type,
						ctime: stats.ctime.getTime(),
						mtime: stats.mtime.getTime(),
						size: stats.size
					});
				});
			});
		},
		readDirectory(location: string) {
			ensureFileUri(location);
			return new Promise((c, e) => {
				const path = Uri.parse(location).fsPath;

				fs.readdir(path, { withFileTypes: true }, (err, children) => {
					if (err) {
						return e(err);
					}
					c(children.map(stat => {
						if (stat.isSymbolicLink()) {
							return [stat.name, FileType.SymbolicLink];
						} else if (stat.isDirectory()) {
							return [stat.name, FileType.Directory];
						} else if (stat.isFile()) {
							return [stat.name, FileType.File];
						} else {
							return [stat.name, FileType.Unknown];
						}
					}));
				});
			});
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/test/completion.test.ts]---
Location: vscode-main/extensions/css-language-features/server/src/test/completion.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import { URI } from 'vscode-uri';
import { TextDocument, CompletionList, TextEdit } from 'vscode-languageserver-types';
import { WorkspaceFolder } from 'vscode-languageserver-protocol';
import { getCSSLanguageService, LanguageServiceOptions, getSCSSLanguageService } from 'vscode-css-languageservice';
import { getNodeFSRequestService } from '../node/nodeFs';
import { getDocumentContext } from '../utils/documentContext';

export interface ItemDescription {
	label: string;
	resultText?: string;
}

suite('Completions', () => {

	const assertCompletion = function (completions: CompletionList, expected: ItemDescription, document: TextDocument, _offset: number) {
		const matches = completions.items.filter(completion => {
			return completion.label === expected.label;
		});

		assert.strictEqual(matches.length, 1, `${expected.label} should only existing once: Actual: ${completions.items.map(c => c.label).join(', ')}`);
		const match = matches[0];
		if (expected.resultText && TextEdit.is(match.textEdit)) {
			assert.strictEqual(TextDocument.applyEdits(document, [match.textEdit]), expected.resultText);
		}
	};

	async function assertCompletions(value: string, expected: { count?: number; items?: ItemDescription[] }, testUri: string, workspaceFolders?: WorkspaceFolder[], lang: string = 'css'): Promise<any> {
		const offset = value.indexOf('|');
		value = value.substr(0, offset) + value.substr(offset + 1);

		const document = TextDocument.create(testUri, lang, 0, value);
		const position = document.positionAt(offset);

		if (!workspaceFolders) {
			workspaceFolders = [{ name: 'x', uri: testUri.substr(0, testUri.lastIndexOf('/')) }];
		}

		const lsOptions: LanguageServiceOptions = { fileSystemProvider: getNodeFSRequestService() };
		const cssLanguageService = lang === 'scss' ? getSCSSLanguageService(lsOptions) : getCSSLanguageService(lsOptions);

		const context = getDocumentContext(testUri, workspaceFolders);
		const stylesheet = cssLanguageService.parseStylesheet(document);
		const list = await cssLanguageService.doComplete2(document, position, stylesheet, context);

		if (expected.count) {
			assert.strictEqual(list.items.length, expected.count);
		}
		if (expected.items) {
			for (const item of expected.items) {
				assertCompletion(list, item, document, offset);
			}
		}
	}

	test('CSS url() Path completion', async function () {
		const testUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
		const folders = [{ name: 'x', uri: URI.file(path.resolve(__dirname, '../../test')).toString(true) }];

		await assertCompletions('html { background-image: url("./|")', {
			items: [
				{ label: 'about.html', resultText: 'html { background-image: url("./about.html")' }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('../|')`, {
			items: [
				{ label: 'about/', resultText: `html { background-image: url('../about/')` },
				{ label: 'index.html', resultText: `html { background-image: url('../index.html')` },
				{ label: 'src/', resultText: `html { background-image: url('../src/')` }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('../src/a|')`, {
			items: [
				{ label: 'feature.js', resultText: `html { background-image: url('../src/feature.js')` },
				{ label: 'data/', resultText: `html { background-image: url('../src/data/')` },
				{ label: 'test.js', resultText: `html { background-image: url('../src/test.js')` }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('../src/data/f|.asar')`, {
			items: [
				{ label: 'foo.asar', resultText: `html { background-image: url('../src/data/foo.asar')` }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('|')`, {
			items: [
				{ label: 'about.html', resultText: `html { background-image: url('about.html')` },
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('/|')`, {
			items: [
				{ label: 'pathCompletionFixtures/', resultText: `html { background-image: url('/pathCompletionFixtures/')` }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url('/pathCompletionFixtures/|')`, {
			items: [
				{ label: 'about/', resultText: `html { background-image: url('/pathCompletionFixtures/about/')` },
				{ label: 'index.html', resultText: `html { background-image: url('/pathCompletionFixtures/index.html')` },
				{ label: 'src/', resultText: `html { background-image: url('/pathCompletionFixtures/src/')` }
			]
		}, testUri, folders);

		await assertCompletions(`html { background-image: url("/|")`, {
			items: [
				{ label: 'pathCompletionFixtures/', resultText: `html { background-image: url("/pathCompletionFixtures/")` }
			]
		}, testUri, folders);
	});

	test('CSS url() Path Completion - Unquoted url', async function () {
		const testUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
		const folders = [{ name: 'x', uri: URI.file(path.resolve(__dirname, '../../test')).toString(true) }];

		await assertCompletions('html { background-image: url(./|)', {
			items: [
				{ label: 'about.html', resultText: 'html { background-image: url(./about.html)' }
			]
		}, testUri, folders);

		await assertCompletions('html { background-image: url(./a|)', {
			items: [
				{ label: 'about.html', resultText: 'html { background-image: url(./about.html)' }
			]
		}, testUri, folders);

		await assertCompletions('html { background-image: url(../|src/)', {
			items: [
				{ label: 'about/', resultText: 'html { background-image: url(../about/)' }
			]
		}, testUri, folders);

		await assertCompletions('html { background-image: url(../s|rc/)', {
			items: [
				{ label: 'about/', resultText: 'html { background-image: url(../about/)' }
			]
		}, testUri, folders);
	});

	test('CSS @import Path completion', async function () {
		const testUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
		const folders = [{ name: 'x', uri: URI.file(path.resolve(__dirname, '../../test')).toString(true) }];

		await assertCompletions(`@import './|'`, {
			items: [
				{ label: 'about.html', resultText: `@import './about.html'` },
			]
		}, testUri, folders);

		await assertCompletions(`@import '../|'`, {
			items: [
				{ label: 'about/', resultText: `@import '../about/'` },
				{ label: 'scss/', resultText: `@import '../scss/'` },
				{ label: 'index.html', resultText: `@import '../index.html'` },
				{ label: 'src/', resultText: `@import '../src/'` }
			]
		}, testUri, folders);
	});

	/**
	 * For SCSS, `@import 'foo';` can be used for importing partial file `_foo.scss`
	 */
	test('SCSS @import Path completion', async function () {
		const testCSSUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
		const folders = [{ name: 'x', uri: URI.file(path.resolve(__dirname, '../../test')).toString(true) }];

		/**
		 * We are in a CSS file, so no special treatment for SCSS partial files
		*/
		await assertCompletions(`@import '../scss/|'`, {
			items: [
				{ label: 'main.scss', resultText: `@import '../scss/main.scss'` },
				{ label: '_foo.scss', resultText: `@import '../scss/_foo.scss'` }
			]
		}, testCSSUri, folders);

		const testSCSSUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/scss/main.scss')).toString(true);
		await assertCompletions(`@import './|'`, {
			items: [
				{ label: '_foo.scss', resultText: `@import './foo'` }
			]
		}, testSCSSUri, folders, 'scss');
	});

	test('Completion should ignore files/folders starting with dot', async function () {
		const testUri = URI.file(path.resolve(__dirname, '../../test/pathCompletionFixtures/about/about.css')).toString(true);
		const folders = [{ name: 'x', uri: URI.file(path.resolve(__dirname, '../../test')).toString(true) }];

		await assertCompletions('html { background-image: url("../|")', {
			count: 4
		}, testUri, folders);

	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/test/links.test.ts]---
Location: vscode-main/extensions/css-language-features/server/src/test/links.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import 'mocha';
import * as assert from 'assert';
import { URI } from 'vscode-uri';
import { resolve } from 'path';
import { TextDocument, DocumentLink } from 'vscode-languageserver-types';
import { WorkspaceFolder } from 'vscode-languageserver-protocol';
import { getCSSLanguageService } from 'vscode-css-languageservice';
import { getDocumentContext } from '../utils/documentContext';
import { getNodeFSRequestService } from '../node/nodeFs';

export interface ItemDescription {
	offset: number;
	value: string;
	target: string;
}

suite('Links', () => {
	const cssLanguageService = getCSSLanguageService({ fileSystemProvider: getNodeFSRequestService() });

	const assertLink = function (links: DocumentLink[], expected: ItemDescription, document: TextDocument) {
		const matches = links.filter(link => {
			return document.offsetAt(link.range.start) === expected.offset;
		});

		assert.strictEqual(matches.length, 1, `${expected.offset} should only existing once: Actual: ${links.map(l => document.offsetAt(l.range.start)).join(', ')}`);
		const match = matches[0];
		assert.strictEqual(document.getText(match.range), expected.value);
		assert.strictEqual(match.target, expected.target);
	};

	async function assertLinks(value: string, expected: ItemDescription[], testUri: string, workspaceFolders?: WorkspaceFolder[], lang: string = 'css'): Promise<void> {
		const offset = value.indexOf('|');
		value = value.substr(0, offset) + value.substr(offset + 1);

		const document = TextDocument.create(testUri, lang, 0, value);

		if (!workspaceFolders) {
			workspaceFolders = [{ name: 'x', uri: testUri.substr(0, testUri.lastIndexOf('/')) }];
		}

		const context = getDocumentContext(testUri, workspaceFolders);

		const stylesheet = cssLanguageService.parseStylesheet(document);
		const links = await cssLanguageService.findDocumentLinks2(document, stylesheet, context)!;

		assert.strictEqual(links.length, expected.length);

		for (const item of expected) {
			assertLink(links, item, document);
		}
	}

	function getTestResource(path: string) {
		return URI.file(resolve(__dirname, '../../test/linksTestFixtures', path)).toString(true);
	}

	test('url links', async function () {

		const testUri = getTestResource('about.css');
		const folders = [{ name: 'x', uri: getTestResource('') }];

		await assertLinks('html { background-image: url("hello.html|")',
			[{ offset: 29, value: '"hello.html"', target: getTestResource('hello.html') }], testUri, folders
		);
	});

	test('url links - untitled', async function () {

		const testUri = 'untitled:untitled-1';
		const folders = [{ name: 'x', uri: getTestResource('') }];

		await assertLinks('@import url("base.css|");")',
			[{ offset: 12, value: '"base.css"', target: 'untitled:base.css' }], testUri, folders
		);
	});

	test('node module resolving', async function () {

		const testUri = getTestResource('about.css');
		const folders = [{ name: 'x', uri: getTestResource('') }];

		await assertLinks('html { background-image: url("~foo/hello.html|")',
			[{ offset: 29, value: '"~foo/hello.html"', target: getTestResource('node_modules/foo/hello.html') }], testUri, folders
		);
	});

	test('node module subfolder resolving', async function () {

		const testUri = getTestResource('subdir/about.css');
		const folders = [{ name: 'x', uri: getTestResource('') }];

		await assertLinks('html { background-image: url("~foo/hello.html|")',
			[{ offset: 29, value: '"~foo/hello.html"', target: getTestResource('node_modules/foo/hello.html') }], testUri, folders
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/utils/documentContext.ts]---
Location: vscode-main/extensions/css-language-features/server/src/utils/documentContext.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DocumentContext } from 'vscode-css-languageservice';
import { endsWith, startsWith } from '../utils/strings';
import { WorkspaceFolder } from 'vscode-languageserver';
import { Utils, URI } from 'vscode-uri';

export function getDocumentContext(documentUri: string, workspaceFolders: WorkspaceFolder[]): DocumentContext {
	function getRootFolder(): string | undefined {
		for (const folder of workspaceFolders) {
			let folderURI = folder.uri;
			if (!endsWith(folderURI, '/')) {
				folderURI = folderURI + '/';
			}
			if (startsWith(documentUri, folderURI)) {
				return folderURI;
			}
		}
		return undefined;
	}

	return {
		resolveReference: (ref: string, base = documentUri) => {
			if (ref[0] === '/') { // resolve absolute path against the current workspace folder
				const folderUri = getRootFolder();
				if (folderUri) {
					return folderUri + ref.substring(1);
				}
			}
			const baseUri = URI.parse(base);
			const baseUriDir = baseUri.path.endsWith('/') ? baseUri : Utils.dirname(baseUri);
			return Utils.resolvePath(baseUriDir, ref).toString(true);
		},
	};
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/utils/runner.ts]---
Location: vscode-main/extensions/css-language-features/server/src/utils/runner.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResponseError, CancellationToken, LSPErrorCodes } from 'vscode-languageserver';
import { RuntimeEnvironment } from '../cssServer';

export function formatError(message: string, err: any): string {
	if (err instanceof Error) {
		const error = <Error>err;
		return `${message}: ${error.message}\n${error.stack}`;
	} else if (typeof err === 'string') {
		return `${message}: ${err}`;
	} else if (err) {
		return `${message}: ${err.toString()}`;
	}
	return message;
}

export function runSafeAsync<T>(runtime: RuntimeEnvironment, func: () => Thenable<T>, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<any>> {
	return new Promise<T | ResponseError<any>>((resolve) => {
		runtime.timer.setImmediate(() => {
			if (token.isCancellationRequested) {
				resolve(cancelValue());
				return;
			}
			return func().then(result => {
				if (token.isCancellationRequested) {
					resolve(cancelValue());
					return;
				} else {
					resolve(result);
				}
			}, e => {
				console.error(formatError(errorMessage, e));
				resolve(errorVal);
			});
		});
	});
}

function cancelValue<E>() {
	return new ResponseError<E>(LSPErrorCodes.RequestCancelled, 'Request cancelled');
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/utils/strings.ts]---
Location: vscode-main/extensions/css-language-features/server/src/utils/strings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function startsWith(haystack: string, needle: string): boolean {
	if (haystack.length < needle.length) {
		return false;
	}

	for (let i = 0; i < needle.length; i++) {
		if (haystack[i] !== needle[i]) {
			return false;
		}
	}

	return true;
}

/**
 * Determines if haystack ends with needle.
 */
export function endsWith(haystack: string, needle: string): boolean {
	const diff = haystack.length - needle.length;
	if (diff > 0) {
		return haystack.lastIndexOf(needle) === diff;
	} else if (diff === 0) {
		return haystack === needle;
	} else {
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/src/utils/validation.ts]---
Location: vscode-main/extensions/css-language-features/server/src/utils/validation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, Connection, Diagnostic, Disposable, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportKind, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-css-languageservice';
import { formatError, runSafeAsync } from './runner';
import { RuntimeEnvironment } from '../cssServer';

export type Validator = (textDocument: TextDocument) => Promise<Diagnostic[]>;
export type DiagnosticsSupport = {
	dispose(): void;
	requestRefresh(): void;
};

export function registerDiagnosticsPushSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	const pendingValidationRequests: { [uri: string]: Disposable } = {};
	const validationDelayMs = 500;

	const disposables: Disposable[] = [];

	// The content of a text document has changed. This event is emitted
	// when the text document first opened or when its content has changed.
	documents.onDidChangeContent(change => {
		triggerValidation(change.document);
	}, undefined, disposables);

	// a document has closed: clear all diagnostics
	documents.onDidClose(event => {
		cleanPendingValidation(event.document);
		connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
	}, undefined, disposables);

	function cleanPendingValidation(textDocument: TextDocument): void {
		const request = pendingValidationRequests[textDocument.uri];
		if (request) {
			request.dispose();
			delete pendingValidationRequests[textDocument.uri];
		}
	}

	function triggerValidation(textDocument: TextDocument): void {
		cleanPendingValidation(textDocument);
		const request = pendingValidationRequests[textDocument.uri] = runtime.timer.setTimeout(async () => {
			if (request === pendingValidationRequests[textDocument.uri]) {
				try {
					const diagnostics = await validate(textDocument);
					if (request === pendingValidationRequests[textDocument.uri]) {
						connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
					}
					delete pendingValidationRequests[textDocument.uri];
				} catch (e) {
					connection.console.error(formatError(`Error while validating ${textDocument.uri}`, e));
				}
			}
		}, validationDelayMs);
	}

	return {
		requestRefresh: () => {
			documents.all().forEach(triggerValidation);
		},
		dispose: () => {
			disposables.forEach(d => d.dispose());
			disposables.length = 0;
			const keys = Object.keys(pendingValidationRequests);
			for (const key of keys) {
				pendingValidationRequests[key].dispose();
				delete pendingValidationRequests[key];
			}
		}
	};
}

export function registerDiagnosticsPullSupport(documents: TextDocuments<TextDocument>, connection: Connection, runtime: RuntimeEnvironment, validate: Validator): DiagnosticsSupport {

	function newDocumentDiagnosticReport(diagnostics: Diagnostic[]): DocumentDiagnosticReport {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: diagnostics
		};
	}

	const registration = connection.languages.diagnostics.on(async (params: DocumentDiagnosticParams, token: CancellationToken) => {
		return runSafeAsync(runtime, async () => {
			const document = documents.get(params.textDocument.uri);
			if (document) {
				return newDocumentDiagnosticReport(await validate(document));
			}
			return newDocumentDiagnosticReport([]);

		}, newDocumentDiagnosticReport([]), `Error while computing diagnostics for ${params.textDocument.uri}`, token);
	});

	function requestRefresh(): void {
		connection.languages.diagnostics.refresh();
	}

	return {
		requestRefresh,
		dispose: () => {
			registration.dispose();
		}
	};

}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/index.js]---
Location: vscode-main/extensions/css-language-features/server/test/index.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const path = require('path');
const Mocha = require('mocha');
const glob = require('glob');

const suite = 'Integration CSS Extension Tests';

const options = {
	ui: 'tdd',
	color: true,
	timeout: 60000
};

if (process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE) {
	options.reporter = 'mocha-multi-reporters';
	options.reporterOptions = {
		reporterEnabled: 'spec, mocha-junit-reporter',
		mochaJunitReporterReporterOptions: {
			testsuitesTitle: `${suite} ${process.platform}`,
			mochaFile: path.join(
				process.env.BUILD_ARTIFACTSTAGINGDIRECTORY || process.env.GITHUB_WORKSPACE || __dirname,
				`test-results/${process.platform}-${process.arch}-${suite.toLowerCase().replace(/[^\w]/g, '-')}-results.xml`)
		}
	};
}

const mocha = new Mocha(options);

glob.sync(__dirname + '/../out/test/**/*.test.js')
	.forEach(file => mocha.addFile(file));

mocha.run(failures => process.exit(failures ? -1 : 0));
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/linksTestFixtures/.gitignore]---
Location: vscode-main/extensions/css-language-features/server/test/linksTestFixtures/.gitignore

```text
!/node_modules
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/linksTestFixtures/node_modules/foo/package.json]---
Location: vscode-main/extensions/css-language-features/server/test/linksTestFixtures/node_modules/foo/package.json

```json
{}
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/.foo.js]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/.foo.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/about/about.css]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/about/about.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/scss/main.scss]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/scss/main.scss

```scss
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/scss/_foo.scss]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/scss/_foo.scss

```scss
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/src/feature.js]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/src/feature.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/src/test.js]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/src/test.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/server/test/pathCompletionFixtures/src/data/foo.asar]---
Location: vscode-main/extensions/css-language-features/server/test/pathCompletionFixtures/src/data/foo.asar

```text
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
```

--------------------------------------------------------------------------------

---[FILE: extensions/css-language-features/test/mocha.opts]---
Location: vscode-main/extensions/css-language-features/test/mocha.opts

```text
--ui tdd
--useColors true
server/out/test/**.test.js
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/.vscodeignore]---
Location: vscode-main/extensions/dart/.vscodeignore

```text
build/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/cgmanifest.json]---
Location: vscode-main/extensions/dart/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "dart-lang/dart-syntax-highlight",
					"repositoryUrl": "https://github.com/dart-lang/dart-syntax-highlight",
					"commitHash": "e1ac5c446c2531343393adbe8fff9d45d8a7c412"
				}
			},
			"licenseDetail": [
				"Copyright 2020, the Dart project authors.",
				"",
				"Redistribution and use in source and binary forms, with or without",
				"modification, are permitted provided that the following conditions are",
				"met:",
				"",
				"    * Redistributions of source code must retain the above copyright",
				"    notice, this list of conditions and the following disclaimer.",
				"    * Redistributions in binary form must reproduce the above",
				"    copyright notice, this list of conditions and the following",
				"    disclaimer in the documentation and/or other materials provided",
				"    with the distribution.",
				"    * Neither the name of Google LLC nor the names of its",
				"    contributors may be used to endorse or promote products derived",
				"    from this software without specific prior written permission.",
				"",
				"THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS",
				"\"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT",
				"LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR",
				"A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT",
				"OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,",
				"SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT",
				"LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,",
				"DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY",
				"THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT",
				"(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE",
				"OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
			],
			"license": "BSD",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/language-configuration.json]---
Location: vscode-main/extensions/dart/language-configuration.json

```json
{
	"comments": {
		"lineComment": "//",
		"blockComment": [ "/*", "*/" ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		{ "open": "{", "close": "}" },
		{ "open": "[", "close": "]" },
		{ "open": "(", "close": ")" },
		{ "open": "'", "close": "'", "notIn": ["string", "comment"] },
		{ "open": "\"", "close": "\"", "notIn": ["string"] },
		{ "open": "`", "close": "`", "notIn": ["string", "comment"] },
		{ "open": "/**", "close": " */", "notIn": ["string"] }
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["<", ">"],
		["'", "'"],
		["\"", "\""],
		["`", "`"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/package.json]---
Location: vscode-main/extensions/dart/package.json

```json
{
	"name": "dart",
	"displayName": "%displayName%",
	"description": "%description%",
	"version": "1.0.0",
	"publisher": "vscode",
	"license": "MIT",
	"engines": {
		"vscode": "0.10.x"
	},
	"scripts": {
		"update-grammar": "node ../node_modules/vscode-grammar-updater/bin dart-lang/dart-syntax-highlight grammars/dart.json ./syntaxes/dart.tmLanguage.json"
	},
	"categories": [
		"Programming Languages"
	],
	"contributes": {
		"languages": [
			{
				"id": "dart",
				"extensions": [
					".dart"
				],
				"aliases": [
					"Dart"
				],
				"configuration": "./language-configuration.json"
			}
		],
		"grammars": [
			{
				"language": "dart",
				"scopeName": "source.dart",
				"path": "./syntaxes/dart.tmLanguage.json"
			}
		]
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/package.nls.json]---
Location: vscode-main/extensions/dart/package.nls.json

```json
{
	"displayName": "Dart Language Basics",
	"description": "Provides syntax highlighting & bracket matching in Dart files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dart/syntaxes/dart.tmLanguage.json]---
Location: vscode-main/extensions/dart/syntaxes/dart.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/dart-lang/dart-syntax-highlight/blob/master/grammars/dart.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/dart-lang/dart-syntax-highlight/commit/e1ac5c446c2531343393adbe8fff9d45d8a7c412",
	"name": "Dart",
	"scopeName": "source.dart",
	"patterns": [
		{
			"name": "meta.preprocessor.script.dart",
			"match": "^(#!.*)$"
		},
		{
			"name": "meta.declaration.dart",
			"begin": "^\\w*\\b(augment\\s+library|library|import\\s+augment|import|part\\s+of|part|export)\\b",
			"beginCaptures": {
				"0": {
					"name": "keyword.other.import.dart"
				}
			},
			"end": ";",
			"endCaptures": {
				"0": {
					"name": "punctuation.terminator.dart"
				}
			},
			"patterns": [
				{
					"include": "#strings"
				},
				{
					"include": "#comments"
				},
				{
					"name": "keyword.other.import.dart",
					"match": "\\b(as|show|hide)\\b"
				},
				{
					"name": "keyword.control.dart",
					"match": "\\b(if)\\b"
				}
			]
		},
		{
			"include": "#comments"
		},
		{
			"include": "#punctuation"
		},
		{
			"include": "#annotations"
		},
		{
			"include": "#keywords"
		},
		{
			"include": "#constants-and-special-vars"
		},
		{
			"include": "#operators"
		},
		{
			"include": "#strings"
		}
	],
	"repository": {
		"dartdoc-codeblock-triple": {
			"begin": "^\\s*///\\s*(?!\\s*```)",
			"end": "\n",
			"contentName": "variable.other.source.dart"
		},
		"dartdoc-codeblock-block": {
			"begin": "^\\s*\\*\\s*(?!(\\s*```|/))",
			"end": "\n",
			"contentName": "variable.other.source.dart"
		},
		"dartdoc": {
			"patterns": [
				{
					"match": "(\\[.*?\\])",
					"captures": {
						"0": {
							"name": "variable.name.source.dart"
						}
					}
				},
				{
					"begin": "^\\s*///\\s*(```)",
					"end": "^\\s*///\\s*(```)|^(?!\\s*///)",
					"patterns": [
						{
							"include": "#dartdoc-codeblock-triple"
						}
					]
				},
				{
					"begin": "^\\s*\\*\\s*(```)",
					"end": "^\\s*\\*\\s*(```)|^(?=\\s*\\*/)",
					"patterns": [
						{
							"include": "#dartdoc-codeblock-block"
						}
					]
				},
				{
					"match": "`[^`\n]+`",
					"name": "variable.other.source.dart"
				},
				{
					"match": "(?:\\*|\\/\\/)\\s{4,}(.*?)(?=($|\\*\\/))",
					"captures": {
						"1": {
							"name": "variable.other.source.dart"
						}
					}
				}
			]
		},
		"comments": {
			"patterns": [
				{
					"name": "comment.block.empty.dart",
					"match": "/\\*\\*/",
					"captures": {
						"0": {
							"name": "punctuation.definition.comment.dart"
						}
					}
				},
				{
					"include": "#comments-doc-oldschool"
				},
				{
					"include": "#comments-doc"
				},
				{
					"include": "#comments-inline"
				}
			]
		},
		"comments-doc-oldschool": {
			"patterns": [
				{
					"name": "comment.block.documentation.dart",
					"begin": "/\\*\\*",
					"end": "\\*/",
					"patterns": [
						{
							"include": "#comments-doc-oldschool"
						},
						{
							"include": "#comments-block"
						},
						{
							"include": "#dartdoc"
						}
					]
				}
			]
		},
		"comments-doc": {
			"patterns": [
				{
					"name": "comment.block.documentation.dart",
					"begin": "///",
					"end": "^(?!\\s*///)",
					"patterns": [
						{
							"include": "#dartdoc"
						}
					]
				}
			]
		},
		"comments-inline": {
			"patterns": [
				{
					"include": "#comments-block"
				},
				{
					"match": "((//).*)$",
					"captures": {
						"1": {
							"name": "comment.line.double-slash.dart"
						}
					}
				}
			]
		},
		"comments-block": {
			"patterns": [
				{
					"name": "comment.block.dart",
					"begin": "/\\*",
					"end": "\\*/",
					"patterns": [
						{
							"include": "#comments-block"
						}
					]
				}
			]
		},
		"annotations": {
			"patterns": [
				{
					"name": "storage.type.annotation.dart",
					"match": "@[a-zA-Z]+"
				}
			]
		},
		"constants-and-special-vars": {
			"patterns": [
				{
					"name": "constant.language.dart",
					"match": "(?<!\\$)\\b(true|false|null)\\b(?!\\$)"
				},
				{
					"name": "variable.language.dart",
					"match": "(?<!\\$)\\b(this|super|augmented)\\b(?!\\$)"
				},
				{
					"name": "constant.numeric.dart",
					"match": "(?<!\\$)\\b((0(x|X)[0-9a-fA-F][0-9a-fA-F_]*)|(([0-9][0-9_]*\\.?[0-9_]*)|(\\.[0-9][0-9_]*))((e|E)(\\+|-)?[0-9][0-9_]*)?)\\b(?!\\$)"
				},
				{
					"include": "#class-identifier"
				},
				{
					"include": "#function-identifier"
				}
			]
		},
		"class-identifier": {
			"patterns": [
				{
					"match": "(?<!\\$)\\b(bool|num|int|double|dynamic)\\b(?!\\$)",
					"name": "support.class.dart"
				},
				{
					"match": "(?<!\\$)\\bvoid\\b(?!\\$)",
					"name": "storage.type.primitive.dart"
				},
				{
					"begin": "(?<![a-zA-Z0-9_$])([_$]*[A-Z][a-zA-Z0-9_$]*)\\b",
					"end": "(?!<)",
					"beginCaptures": {
						"1": {
							"name": "support.class.dart"
						}
					},
					"patterns": [
						{
							"include": "#type-args"
						}
					]
				}
			]
		},
		"function-identifier": {
			"patterns": [
				{
					"match": "([_$]*[a-z][a-zA-Z0-9_$]*)(<(?:[a-zA-Z0-9_$<>?]|,\\s*|\\s+extends\\s+)+>)?[!?]?\\(",
					"captures": {
						"1": {
							"name": "entity.name.function.dart"
						},
						"2": {
							"patterns": [
								{
									"include": "#type-args"
								}
							]
						}
					}
				}
			]
		},
		"type-args": {
			"begin": "(<)",
			"end": "(>)",
			"beginCaptures": {
				"1": {
					"name": "other.source.dart"
				}
			},
			"endCaptures": {
				"1": {
					"name": "other.source.dart"
				}
			},
			"patterns": [
				{
					"include": "#class-identifier"
				},
				{
					"match": ","
				},
				{
					"name": "keyword.declaration.dart",
					"match": "extends"
				},
				{
					"include": "#comments"
				}
			]
		},
		"keywords": {
			"patterns": [
				{
					"name": "keyword.cast.dart",
					"match": "(?<!\\$)\\bas\\b(?!\\$)"
				},
				{
					"name": "keyword.control.catch-exception.dart",
					"match": "(?<!\\$)\\b(try|on|catch|finally|throw|rethrow)\\b(?!\\$)"
				},
				{
					"name": "keyword.control.dart",
					"match": "(?<!\\$)\\b(break|case|continue|default|do|else|for|if|in|switch|while|when)\\b(?!\\$)"
				},
				{
					"name": "keyword.control.dart",
					"match": "(?<!\\$)\\b(sync(\\*)?|async(\\*)?|await|yield(\\*)?)\\b(?!\\$)"
				},
				{
					"name": "keyword.control.dart",
					"match": "(?<!\\$)\\bassert\\b(?!\\$)"
				},
				{
					"name": "keyword.control.new.dart",
					"match": "(?<!\\$)\\b(new)\\b(?!\\$)"
				},
				{
					"name": "keyword.control.return.dart",
					"match": "(?<!\\$)\\b(return)\\b(?!\\$)"
				},
				{
					"name": "keyword.declaration.dart",
					"match": "(?<!\\$)\\b(abstract|sealed|base|interface|class|enum|extends|extension\\s+type|extension|external|factory|implements|get(?![(<])|mixin|native|operator|set(?![(<])|typedef|with|covariant)\\b(?!\\$)"
				},
				{
					"name": "storage.modifier.dart",
					"match": "(?<!\\$)\\b(macro|augment|static|final|const|required|late)\\b(?!\\$)"
				},
				{
					"name": "storage.type.primitive.dart",
					"match": "(?<!\\$)\\b(?:void|var)\\b(?!\\$)"
				}
			]
		},
		"operators": {
			"patterns": [
				{
					"name": "keyword.operator.dart",
					"match": "(?<!\\$)\\b(is\\!?)\\b(?!\\$)"
				},
				{
					"name": "keyword.operator.ternary.dart",
					"match": "\\?|:"
				},
				{
					"name": "keyword.operator.bitwise.dart",
					"match": "(<<|>>>?|~|\\^|\\||&)"
				},
				{
					"name": "keyword.operator.assignment.bitwise.dart",
					"match": "((&|\\^|\\||<<|>>>?)=)"
				},
				{
					"name": "keyword.operator.closure.dart",
					"match": "(=>)"
				},
				{
					"name": "keyword.operator.comparison.dart",
					"match": "(==|!=|<=?|>=?)"
				},
				{
					"name": "keyword.operator.assignment.arithmetic.dart",
					"match": "(([+*/%-]|\\~)=)"
				},
				{
					"name": "keyword.operator.assignment.dart",
					"match": "(=)"
				},
				{
					"name": "keyword.operator.increment-decrement.dart",
					"match": "(\\-\\-|\\+\\+)"
				},
				{
					"name": "keyword.operator.arithmetic.dart",
					"match": "(\\-|\\+|\\*|\\/|\\~\\/|%)"
				},
				{
					"name": "keyword.operator.logical.dart",
					"match": "(!|&&|\\|\\|)"
				}
			]
		},
		"expression": {
			"patterns": [
				{
					"include": "#constants-and-special-vars"
				},
				{
					"include": "#strings"
				},
				{
					"name": "variable.parameter.dart",
					"match": "[a-zA-Z0-9_]+"
				},
				{
					"begin": "\\{",
					"end": "\\}",
					"patterns": [
						{
							"include": "#expression"
						}
					]
				}
			]
		},
		"string-interp": {
			"patterns": [
				{
					"name": "meta.embedded.expression.dart",
					"match": "\\$([a-zA-Z0-9_]+)",
					"captures": {
						"1": {
							"name": "variable.parameter.dart"
						}
					}
				},
				{
					"name": "meta.embedded.expression.dart",
					"begin": "\\$\\{",
					"end": "\\}",
					"patterns": [
						{
							"include": "#expression"
						}
					]
				},
				{
					"name": "constant.character.escape.dart",
					"match": "\\\\."
				}
			]
		},
		"strings": {
			"patterns": [
				{
					"name": "string.interpolated.triple.double.dart",
					"begin": "(?<!r)\"\"\"",
					"end": "\"\"\"(?!\")",
					"patterns": [
						{
							"include": "#string-interp"
						}
					]
				},
				{
					"name": "string.interpolated.triple.single.dart",
					"begin": "(?<!r)'''",
					"end": "'''(?!')",
					"patterns": [
						{
							"include": "#string-interp"
						}
					]
				},
				{
					"name": "string.quoted.triple.double.dart",
					"begin": "r\"\"\"",
					"end": "\"\"\"(?!\")"
				},
				{
					"name": "string.quoted.triple.single.dart",
					"begin": "r'''",
					"end": "'''(?!')"
				},
				{
					"name": "string.interpolated.double.dart",
					"begin": "(?<!\\|r)\"",
					"end": "\"",
					"patterns": [
						{
							"name": "invalid.string.newline",
							"match": "\\n"
						},
						{
							"include": "#string-interp"
						}
					]
				},
				{
					"name": "string.quoted.double.dart",
					"begin": "r\"",
					"end": "\"",
					"patterns": [
						{
							"name": "invalid.string.newline",
							"match": "\\n"
						}
					]
				},
				{
					"name": "string.interpolated.single.dart",
					"begin": "(?<!\\|r)'",
					"end": "'",
					"patterns": [
						{
							"name": "invalid.string.newline",
							"match": "\\n"
						},
						{
							"include": "#string-interp"
						}
					]
				},
				{
					"name": "string.quoted.single.dart",
					"begin": "r'",
					"end": "'",
					"patterns": [
						{
							"name": "invalid.string.newline",
							"match": "\\n"
						}
					]
				}
			]
		},
		"punctuation": {
			"patterns": [
				{
					"name": "punctuation.comma.dart",
					"match": ","
				},
				{
					"name": "punctuation.terminator.dart",
					"match": ";"
				},
				{
					"name": "punctuation.dot.dart",
					"match": "\\."
				}
			]
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/.npmrc]---
Location: vscode-main/extensions/debug-auto-launch/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/.vscodeignore]---
Location: vscode-main/extensions/debug-auto-launch/.vscodeignore

```text
src/**
tsconfig.json
out/**
extension.webpack.config.js
package-lock.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/extension.webpack.config.js]---
Location: vscode-main/extensions/debug-auto-launch/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts',
	},
	resolve: {
		mainFields: ['module', 'main']
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/package-lock.json]---
Location: vscode-main/extensions/debug-auto-launch/package-lock.json

```json
{
  "name": "debug-auto-launch",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "debug-auto-launch",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.5.0"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/package.json]---
Location: vscode-main/extensions/debug-auto-launch/package.json

```json
{
  "name": "debug-auto-launch",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.5.0"
  },
  "icon": "media/icon.png",
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./out/extension",
  "scripts": {
    "compile": "gulp compile-extension:debug-auto-launch",
    "watch": "gulp watch-extension:debug-auto-launch"
  },
  "contributes": {
    "commands": [
      {
        "command": "extension.node-debug.toggleAutoAttach",
        "title": "%toggle.auto.attach%",
        "category": "Debug"
      }
    ]
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "prettier": {
    "printWidth": 100,
    "trailingComma": "all",
    "singleQuote": true,
    "arrowParens": "avoid"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/package.nls.json]---
Location: vscode-main/extensions/debug-auto-launch/package.nls.json

```json
{
	"displayName": "Node Debug Auto-attach",
	"description": "Helper for auto-attach feature when node-debug extensions are not active.",
	"toggle.auto.attach": "Toggle Auto Attach"
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/tsconfig.json]---
Location: vscode-main/extensions/debug-auto-launch/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/.vscode/launch.json]---
Location: vscode-main/extensions/debug-auto-launch/.vscode/launch.json

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Extension",
      "type": "extensionHost",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "args": [
        "--extensionDevelopmentPath=${workspaceFolder}",
      ],
      "outFiles": [
        "${workspaceFolder}/out/**/*.js",
      ],
    }
  ]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-auto-launch/src/extension.ts]---
Location: vscode-main/extensions/debug-auto-launch/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { promises as fs } from 'fs';
import { createServer, Server } from 'net';
import { dirname } from 'path';
import * as vscode from 'vscode';

const enum State {
	Disabled = 'disabled',
	OnlyWithFlag = 'onlyWithFlag',
	Smart = 'smart',
	Always = 'always',
}
const TEXT_STATUSBAR_LABEL = {
	[State.Disabled]: vscode.l10n.t('Auto Attach: Disabled'),
	[State.Always]: vscode.l10n.t('Auto Attach: Always'),
	[State.Smart]: vscode.l10n.t('Auto Attach: Smart'),
	[State.OnlyWithFlag]: vscode.l10n.t('Auto Attach: With Flag'),
};

const TEXT_STATE_LABEL = {
	[State.Disabled]: vscode.l10n.t('Disabled'),
	[State.Always]: vscode.l10n.t('Always'),
	[State.Smart]: vscode.l10n.t('Smart'),
	[State.OnlyWithFlag]: vscode.l10n.t('Only With Flag'),
};
const TEXT_STATE_DESCRIPTION = {
	[State.Disabled]: vscode.l10n.t('Auto attach is disabled and not shown in status bar'),
	[State.Always]: vscode.l10n.t('Auto attach to every Node.js process launched in the terminal'),
	[State.Smart]: vscode.l10n.t("Auto attach when running scripts that aren't in a node_modules folder"),
	[State.OnlyWithFlag]: vscode.l10n.t('Only auto attach when the `--inspect` flag is given')
};

const TEXT_TOGGLE_TITLE = vscode.l10n.t('Toggle Auto Attach');
const TEXT_TOGGLE_WORKSPACE = vscode.l10n.t('Toggle auto attach in this workspace');
const TEXT_TOGGLE_GLOBAL = vscode.l10n.t('Toggle auto attach on this machine');
const TEXT_TEMP_DISABLE = vscode.l10n.t('Temporarily disable auto attach in this session');
const TEXT_TEMP_ENABLE = vscode.l10n.t('Re-enable auto attach');
const TEXT_TEMP_DISABLE_LABEL = vscode.l10n.t('Auto Attach: Disabled');

const TOGGLE_COMMAND = 'extension.node-debug.toggleAutoAttach';
const STORAGE_IPC = 'jsDebugIpcState';

const SETTING_SECTION = 'debug.javascript';
const SETTING_STATE = 'autoAttachFilter';

/**
 * settings that, when changed, should cause us to refresh the state vars
 */
const SETTINGS_CAUSE_REFRESH = new Set(
	['autoAttachSmartPattern', SETTING_STATE].map(s => `${SETTING_SECTION}.${s}`),
);


let currentState: Promise<{ context: vscode.ExtensionContext; state: State | null }>;
let statusItem: vscode.StatusBarItem | undefined; // and there is no status bar item
let server: Promise<Server | undefined> | undefined; // auto attach server
let isTemporarilyDisabled = false; // whether the auto attach server is disabled temporarily, reset whenever the state changes

export function activate(context: vscode.ExtensionContext): void {
	currentState = Promise.resolve({ context, state: null });

	context.subscriptions.push(
		vscode.commands.registerCommand(TOGGLE_COMMAND, toggleAutoAttachSetting.bind(null, context)),
	);

	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			// Whenever a setting is changed, disable auto attach, and re-enable
			// it (if necessary) to refresh variables.
			if (
				e.affectsConfiguration(`${SETTING_SECTION}.${SETTING_STATE}`) ||
				[...SETTINGS_CAUSE_REFRESH].some(setting => e.affectsConfiguration(setting))
			) {
				refreshAutoAttachVars();
			}
		}),
	);

	updateAutoAttach(readCurrentState());
}

export async function deactivate(): Promise<void> {
	await destroyAttachServer();
}

function refreshAutoAttachVars() {
	updateAutoAttach(State.Disabled);
	updateAutoAttach(readCurrentState());
}

function getDefaultScope(info: ReturnType<vscode.WorkspaceConfiguration['inspect']>) {
	if (!info) {
		return vscode.ConfigurationTarget.Global;
	} else if (info.workspaceFolderValue) {
		return vscode.ConfigurationTarget.WorkspaceFolder;
	} else if (info.workspaceValue) {
		return vscode.ConfigurationTarget.Workspace;
	} else if (info.globalValue) {
		return vscode.ConfigurationTarget.Global;
	}

	return vscode.ConfigurationTarget.Global;
}

type PickResult = { state: State } | { setTempDisabled: boolean } | { scope: vscode.ConfigurationTarget } | undefined;
type PickItem = vscode.QuickPickItem & ({ state: State } | { setTempDisabled: boolean });

async function toggleAutoAttachSetting(context: vscode.ExtensionContext, scope?: vscode.ConfigurationTarget): Promise<void> {
	const section = vscode.workspace.getConfiguration(SETTING_SECTION);
	scope = scope || getDefaultScope(section.inspect(SETTING_STATE));

	const isGlobalScope = scope === vscode.ConfigurationTarget.Global;
	const quickPick = vscode.window.createQuickPick<PickItem>();
	const current = readCurrentState();

	const items: PickItem[] = [State.Always, State.Smart, State.OnlyWithFlag, State.Disabled].map(state => ({
		state,
		label: TEXT_STATE_LABEL[state],
		description: TEXT_STATE_DESCRIPTION[state],
		alwaysShow: true,
	}));

	if (current !== State.Disabled) {
		items.unshift({
			setTempDisabled: !isTemporarilyDisabled,
			label: isTemporarilyDisabled ? TEXT_TEMP_ENABLE : TEXT_TEMP_DISABLE,
			alwaysShow: true,
		});
	}

	quickPick.items = items;
	quickPick.activeItems = isTemporarilyDisabled
		? [items[0]]
		: quickPick.items.filter(i => 'state' in i && i.state === current);
	quickPick.title = TEXT_TOGGLE_TITLE;
	quickPick.placeholder = isGlobalScope ? TEXT_TOGGLE_GLOBAL : TEXT_TOGGLE_WORKSPACE;
	quickPick.buttons = [
		{
			iconPath: new vscode.ThemeIcon(isGlobalScope ? 'folder' : 'globe'),
			tooltip: isGlobalScope ? TEXT_TOGGLE_WORKSPACE : TEXT_TOGGLE_GLOBAL,
		},
	];

	quickPick.show();

	let result = await new Promise<PickResult>(resolve => {
		quickPick.onDidAccept(() => resolve(quickPick.selectedItems[0]));
		quickPick.onDidHide(() => resolve(undefined));
		quickPick.onDidTriggerButton(() => {
			resolve({
				scope: isGlobalScope
					? vscode.ConfigurationTarget.Workspace
					: vscode.ConfigurationTarget.Global,
			});
		});
	});

	quickPick.dispose();

	if (!result) {
		return;
	}

	if ('scope' in result) {
		return await toggleAutoAttachSetting(context, result.scope);
	}

	if ('state' in result) {
		if (result.state !== current) {
			section.update(SETTING_STATE, result.state, scope);
		} else if (isTemporarilyDisabled) {
			result = { setTempDisabled: false };
		}
	}

	if ('setTempDisabled' in result) {
		updateStatusBar(context, current, true);
		isTemporarilyDisabled = result.setTempDisabled;
		if (result.setTempDisabled) {
			await destroyAttachServer();
		} else {
			await createAttachServer(context); // unsets temp disabled var internally
		}
		updateStatusBar(context, current, false);
	}
}

function readCurrentState(): State {
	const section = vscode.workspace.getConfiguration(SETTING_SECTION);
	return section.get<State>(SETTING_STATE) ?? State.Disabled;
}

async function clearJsDebugAttachState(context: vscode.ExtensionContext) {
	if (server || await context.workspaceState.get(STORAGE_IPC)) {
		await context.workspaceState.update(STORAGE_IPC, undefined);
		await vscode.commands.executeCommand('extension.js-debug.clearAutoAttachVariables');
		await destroyAttachServer();
	}
}

/**
 * Turns auto attach on, and returns the server auto attach is listening on
 * if it's successful.
 */
async function createAttachServer(context: vscode.ExtensionContext) {
	const ipcAddress = await getIpcAddress(context);
	if (!ipcAddress) {
		return undefined;
	}

	server = createServerInner(ipcAddress).catch(async err => {
		console.error('[debug-auto-launch] Error creating auto attach server: ', err);

		if (process.platform !== 'win32') {
			// On macOS, and perhaps some Linux distros, the temporary directory can
			// sometimes change. If it looks like that's the cause of a listener
			// error, automatically refresh the auto attach vars.
			try {
				await fs.access(dirname(ipcAddress));
			} catch {
				console.error('[debug-auto-launch] Refreshing variables from error');
				refreshAutoAttachVars();
				return undefined;
			}
		}

		return undefined;
	});

	return await server;
}

const createServerInner = async (ipcAddress: string) => {
	try {
		return await createServerInstance(ipcAddress);
	} catch (e) {
		// On unix/linux, the file can 'leak' if the process exits unexpectedly.
		// If we see this, try to delete the file and then listen again.
		await fs.unlink(ipcAddress).catch(() => undefined);
		return await createServerInstance(ipcAddress);
	}
};

const createServerInstance = (ipcAddress: string) =>
	new Promise<Server>((resolve, reject) => {
		const s = createServer(socket => {
			const data: Buffer[] = [];
			socket.on('data', async chunk => {
				if (chunk[chunk.length - 1] !== 0) {
					// terminated with NUL byte
					data.push(chunk);
					return;
				}

				data.push(chunk.slice(0, -1));

				try {
					await vscode.commands.executeCommand(
						'extension.js-debug.autoAttachToProcess',
						JSON.parse(Buffer.concat(data).toString()),
					);
					socket.write(Buffer.from([0]));
				} catch (err) {
					socket.write(Buffer.from([1]));
					console.error(err);
				}
			});
		})
			.on('error', reject)
			.listen(ipcAddress, () => resolve(s));
	});

/**
 * Destroys the auto-attach server, if it's running.
 */
async function destroyAttachServer() {
	const instance = await server;
	if (instance) {
		await new Promise(r => instance.close(r));
	}
}

interface CachedIpcState {
	ipcAddress: string;
	jsDebugPath: string | undefined;
	settingsValue: string;
}

/**
 * Map of logic that happens when auto attach states are entered and exited.
 * All state transitions are queued and run in order; promises are awaited.
 */
const transitions: { [S in State]: (context: vscode.ExtensionContext) => Promise<void> } = {
	async [State.Disabled](context) {
		await clearJsDebugAttachState(context);
	},

	async [State.OnlyWithFlag](context) {
		await createAttachServer(context);
	},

	async [State.Smart](context) {
		await createAttachServer(context);
	},

	async [State.Always](context) {
		await createAttachServer(context);
	},
};

/**
 * Ensures the status bar text reflects the current state.
 */
function updateStatusBar(context: vscode.ExtensionContext, state: State, busy = false) {
	if (state === State.Disabled && !busy) {
		statusItem?.hide();
		return;
	}

	if (!statusItem) {
		statusItem = vscode.window.createStatusBarItem('status.debug.autoAttach', vscode.StatusBarAlignment.Left);
		statusItem.name = vscode.l10n.t("Debug Auto Attach");
		statusItem.command = TOGGLE_COMMAND;
		statusItem.tooltip = vscode.l10n.t("Automatically attach to node.js processes in debug mode");
		context.subscriptions.push(statusItem);
	}

	let text = busy ? '$(loading) ' : '';
	text += isTemporarilyDisabled ? TEXT_TEMP_DISABLE_LABEL : TEXT_STATUSBAR_LABEL[state];
	statusItem.text = text;
	statusItem.show();
}

/**
 * Updates the auto attach feature based on the user or workspace setting
 */
function updateAutoAttach(newState: State) {
	currentState = currentState.then(async ({ context, state: oldState }) => {
		if (newState === oldState) {
			return { context, state: oldState };
		}

		if (oldState !== null) {
			updateStatusBar(context, oldState, true);
		}

		await transitions[newState](context);
		isTemporarilyDisabled = false;
		updateStatusBar(context, newState, false);
		return { context, state: newState };
	});
}

/**
 * Gets the IPC address for the server to listen on for js-debug sessions. This
 * is cached such that we can reuse the address of previous activations.
 */
async function getIpcAddress(context: vscode.ExtensionContext) {
	// Iff the `cachedData` is present, the js-debug registered environment
	// variables for this workspace--cachedData is set after successfully
	// invoking the attachment command.
	const cachedIpc = context.workspaceState.get<CachedIpcState>(STORAGE_IPC);

	// We invalidate the IPC data if the js-debug path changes, since that
	// indicates the extension was updated or reinstalled and the
	// environment variables will have been lost.
	// todo: make a way in the API to read environment data directly without activating js-debug?
	const jsDebugPath =
		vscode.extensions.getExtension('ms-vscode.js-debug-nightly')?.extensionPath ||
		vscode.extensions.getExtension('ms-vscode.js-debug')?.extensionPath;

	const settingsValue = getJsDebugSettingKey();
	if (cachedIpc?.jsDebugPath === jsDebugPath && cachedIpc?.settingsValue === settingsValue) {
		return cachedIpc.ipcAddress;
	}

	const result = await vscode.commands.executeCommand<{ ipcAddress: string }>(
		'extension.js-debug.setAutoAttachVariables',
		cachedIpc?.ipcAddress,
	);
	if (!result) {
		return;
	}

	const ipcAddress = result.ipcAddress;
	await context.workspaceState.update(STORAGE_IPC, {
		ipcAddress,
		jsDebugPath,
		settingsValue,
	} satisfies CachedIpcState);

	return ipcAddress;
}

function getJsDebugSettingKey() {
	const o: { [key: string]: unknown } = {};
	const config = vscode.workspace.getConfiguration(SETTING_SECTION);
	for (const setting of SETTINGS_CAUSE_REFRESH) {
		o[setting] = config.get(setting);
	}

	return JSON.stringify(o);
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/.npmrc]---
Location: vscode-main/extensions/debug-server-ready/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/.vscodeignore]---
Location: vscode-main/extensions/debug-server-ready/.vscodeignore

```text
src/**
tsconfig.json
out/**
extension.webpack.config.js
package-lock.json
.vscode
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/extension.webpack.config.js]---
Location: vscode-main/extensions/debug-server-ready/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/extension.ts',
	},
	resolve: {
		mainFields: ['module', 'main']
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/package-lock.json]---
Location: vscode-main/extensions/debug-server-ready/package-lock.json

```json
{
  "name": "debug-server-ready",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "debug-server-ready",
      "version": "1.0.0",
      "license": "MIT",
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.32.0"
      }
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/package.json]---
Location: vscode-main/extensions/debug-server-ready/package.json

```json
{
  "name": "debug-server-ready",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.32.0"
  },
  "icon": "media/icon.png",
  "activationEvents": [
    "onDebugResolve"
  ],
  "capabilities": {
    "virtualWorkspaces": false,
    "untrustedWorkspaces": {
      "supported": true
    }
  },
  "enabledApiProposals": [
    "terminalDataWriteEvent"
  ],
  "main": "./out/extension",
  "scripts": {
    "compile": "gulp compile-extension:debug-server-ready",
    "watch": "gulp watch-extension:debug-server-ready"
  },
  "contributes": {
    "debuggers": [
      {
        "type": "*",
        "configurationAttributes": {
          "launch": {
            "properties": {
              "serverReadyAction": {
                "oneOf": [
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "markdownDescription": "%debug.server.ready.serverReadyAction.description%",
                    "default": {
                      "action": "openExternally",
                      "killOnServerStop": false
                    },
                    "properties": {
                      "action": {
                        "type": "string",
                        "enum": [
                          "openExternally"
                        ],
                        "enumDescriptions": [
                          "%debug.server.ready.action.openExternally.description%"
                        ],
                        "markdownDescription": "%debug.server.ready.action.description%",
                        "default": "openExternally"
                      },
                      "pattern": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.pattern.description%",
                        "default": "listening on port ([0-9]+)"
                      },
                      "uriFormat": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.uriFormat.description%",
                        "default": "http://localhost:%s"
                      },
                      "killOnServerStop": {
                        "type": "boolean",
                        "markdownDescription": "%debug.server.ready.killOnServerStop.description%",
                        "default": false
                      }
                    }
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "markdownDescription": "%debug.server.ready.serverReadyAction.description%",
                    "default": {
                      "action": "debugWithEdge",
                      "pattern": "listening on port ([0-9]+)",
                      "uriFormat": "http://localhost:%s",
                      "webRoot": "${workspaceFolder}",
                      "killOnServerStop": false
                    },
                    "properties": {
                      "action": {
                        "type": "string",
                        "enum": [
                          "debugWithChrome",
                          "debugWithEdge"
                        ],
                        "enumDescriptions": [
                          "%debug.server.ready.action.debugWithChrome.description%"
                        ],
                        "markdownDescription": "%debug.server.ready.action.description%",
                        "default": "debugWithEdge"
                      },
                      "pattern": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.pattern.description%",
                        "default": "listening on port ([0-9]+)"
                      },
                      "uriFormat": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.uriFormat.description%",
                        "default": "http://localhost:%s"
                      },
                      "webRoot": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.webRoot.description%",
                        "default": "${workspaceFolder}"
                      },
                      "killOnServerStop": {
                        "type": "boolean",
                        "markdownDescription": "%debug.server.ready.killOnServerStop.description%",
                        "default": false
                      }
                    }
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "markdownDescription": "%debug.server.ready.serverReadyAction.description%",
                    "default": {
                      "action": "startDebugging",
                      "name": "<launch browser config name>",
                      "killOnServerStop": false
                    },
                    "required": [
                      "name"
                    ],
                    "properties": {
                      "action": {
                        "type": "string",
                        "enum": [
                          "startDebugging"
                        ],
                        "enumDescriptions": [
                          "%debug.server.ready.action.startDebugging.description%"
                        ],
                        "markdownDescription": "%debug.server.ready.action.description%",
                        "default": "startDebugging"
                      },
                      "pattern": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.pattern.description%",
                        "default": "listening on port ([0-9]+)"
                      },
                      "name": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.debugConfigName.description%",
                        "default": "Launch Browser"
                      },
                      "killOnServerStop": {
                        "type": "boolean",
                        "markdownDescription": "%debug.server.ready.killOnServerStop.description%",
                        "default": false
                      }
                    }
                  },
                  {
                    "type": "object",
                    "additionalProperties": false,
                    "markdownDescription": "%debug.server.ready.serverReadyAction.description%",
                    "default": {
                      "action": "startDebugging",
                      "config": {
                        "type": "node",
                        "request": "launch"
                      },
                      "killOnServerStop": false
                    },
                    "required": [
                      "config"
                    ],
                    "properties": {
                      "action": {
                        "type": "string",
                        "enum": [
                          "startDebugging"
                        ],
                        "enumDescriptions": [
                          "%debug.server.ready.action.startDebugging.description%"
                        ],
                        "markdownDescription": "%debug.server.ready.action.description%",
                        "default": "startDebugging"
                      },
                      "pattern": {
                        "type": "string",
                        "markdownDescription": "%debug.server.ready.pattern.description%",
                        "default": "listening on port ([0-9]+)"
                      },
                      "config": {
                        "type": "object",
                        "markdownDescription": "%debug.server.ready.debugConfig.description%",
                        "default": {}
                      },
                      "killOnServerStop": {
                        "type": "boolean",
                        "markdownDescription": "%debug.server.ready.killOnServerStop.description%",
                        "default": false
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/package.nls.json]---
Location: vscode-main/extensions/debug-server-ready/package.nls.json

```json
{
	"displayName": "Server Ready Action",
	"description": "Open URI in browser if server under debugging is ready.",

	"debug.server.ready.serverReadyAction.description": "Act upon a URI when a server program under debugging is ready (indicated by sending output of the form 'listening on port 3000' or 'Now listening on: https://localhost:5001' to the debug console.)",
	"debug.server.ready.action.description": "What to do with the URI when the server is ready.",
	"debug.server.ready.action.openExternally.description": "Open URI externally with the default application.",
	"debug.server.ready.action.debugWithChrome.description": "Start debugging with the 'Debugger for Chrome'.",
	"debug.server.ready.action.startDebugging.description": "Run another launch configuration.",
	"debug.server.ready.pattern.description": "Server is ready if this pattern appears on the debug console. The first capture group must include a URI or a port number.",
	"debug.server.ready.debugConfig.description": "The debug configuration to run.",
	"debug.server.ready.uriFormat.description": "A format string used when constructing the URI from a port number. The first '%s' is substituted with the port number.",
	"debug.server.ready.webRoot.description": "Value passed to the debug configuration for the 'Debugger for Chrome'.",
	"debug.server.ready.killOnServerStop.description": "Stop the child session when the parent session stopped.",
	"debug.server.ready.debugConfigName.description": "Name of the launch configuration to run."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/tsconfig.json]---
Location: vscode-main/extensions/debug-server-ready/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"types": [
			"node"
		],
		"typeRoots": [
			"./node_modules/@types"
		]
	},
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts",
		"../../src/vscode-dts/vscode.proposed.terminalDataWriteEvent.d.ts",
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/.vscode/launch.json]---
Location: vscode-main/extensions/debug-server-ready/.vscode/launch.json

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Run Server Ready Extension",
			"type": "extensionHost",
			"request": "launch",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}"
			],
			"outFiles": [
				"${workspaceFolder}/out/**/*.js"
			]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/debug-server-ready/src/extension.ts]---
Location: vscode-main/extensions/debug-server-ready/src/extension.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import * as util from 'util';
import { randomUUID } from 'crypto';

const PATTERN = 'listening on.* (https?://\\S+|[0-9]+)'; // matches "listening on port 3000" or "Now listening on: https://localhost:5001"
const URI_PORT_FORMAT = 'http://localhost:%s';
const URI_FORMAT = '%s';
const WEB_ROOT = '${workspaceFolder}';

interface ServerReadyAction {
	pattern: string;
	action?: 'openExternally' | 'debugWithChrome' | 'debugWithEdge' | 'startDebugging';
	uriFormat?: string;
	webRoot?: string;
	name?: string;
	config?: vscode.DebugConfiguration;
	killOnServerStop?: boolean;
}

// From src/vs/base/common/strings.ts
const CSI_SEQUENCE = /(?:\x1b\[|\x9b)[=?>!]?[\d;:]*["$#'* ]?[a-zA-Z@^`{}|~]/;
const OSC_SEQUENCE = /(?:\x1b\]|\x9d).*?(?:\x1b\\|\x07|\x9c)/;
const ESC_SEQUENCE = /\x1b(?:[ #%\(\)\*\+\-\.\/]?[a-zA-Z0-9\|}~@])/;
const CONTROL_SEQUENCES = new RegExp('(?:' + [
	CSI_SEQUENCE.source,
	OSC_SEQUENCE.source,
	ESC_SEQUENCE.source,
].join('|') + ')', 'g');

/**
 * Froms vs/base/common/strings.ts in core
 * @see https://github.com/microsoft/vscode/blob/22a2a0e833175c32a2005b977d7fbd355582e416/src/vs/base/common/strings.ts#L736
 */
function removeAnsiEscapeCodes(str: string): string {
	if (str) {
		str = str.replace(CONTROL_SEQUENCES, '');
	}

	return str;
}

class Trigger {
	private _fired = false;

	public get hasFired() {
		return this._fired;
	}

	public fire() {
		this._fired = true;
	}
}

class ServerReadyDetector extends vscode.Disposable {

	private static detectors = new Map<vscode.DebugSession, ServerReadyDetector>();
	private static terminalDataListener: vscode.Disposable | undefined;

	private readonly stoppedEmitter = new vscode.EventEmitter<void>();
	private readonly onDidSessionStop = this.stoppedEmitter.event;
	private readonly disposables = new Set<vscode.Disposable>([]);
	private trigger: Trigger;
	private shellPid?: number;
	private regexp: RegExp;

	static start(session: vscode.DebugSession): ServerReadyDetector | undefined {
		if (session.configuration.serverReadyAction) {
			let detector = ServerReadyDetector.detectors.get(session);
			if (!detector) {
				detector = new ServerReadyDetector(session);
				ServerReadyDetector.detectors.set(session, detector);
			}
			return detector;
		}
		return undefined;
	}

	static stop(session: vscode.DebugSession): void {
		const detector = ServerReadyDetector.detectors.get(session);
		if (detector) {
			ServerReadyDetector.detectors.delete(session);
			detector.sessionStopped();
			detector.dispose();
		}
	}

	static rememberShellPid(session: vscode.DebugSession, pid: number) {
		const detector = ServerReadyDetector.detectors.get(session);
		if (detector) {
			detector.shellPid = pid;
		}
	}

	static async startListeningTerminalData() {
		if (!this.terminalDataListener) {
			this.terminalDataListener = vscode.window.onDidWriteTerminalData(async e => {

				// first find the detector with a matching pid
				const pid = await e.terminal.processId;
				const str = removeAnsiEscapeCodes(e.data);
				for (const [, detector] of this.detectors) {
					if (detector.shellPid === pid) {
						detector.detectPattern(str);
						return;
					}
				}

				// if none found, try all detectors until one matches
				for (const [, detector] of this.detectors) {
					if (detector.detectPattern(str)) {
						return;
					}
				}
			});
		}
	}

	private constructor(private session: vscode.DebugSession) {
		super(() => this.internalDispose());

		// Re-used the triggered of the parent session, if one exists
		if (session.parentSession) {
			this.trigger = ServerReadyDetector.start(session.parentSession)?.trigger ?? new Trigger();
		} else {
			this.trigger = new Trigger();
		}

		this.regexp = new RegExp(session.configuration.serverReadyAction.pattern || PATTERN, 'i');
	}

	private internalDispose() {
		this.disposables.forEach(d => d.dispose());
		this.disposables.clear();
	}

	public sessionStopped() {
		this.stoppedEmitter.fire();
	}

	detectPattern(s: string): boolean {
		if (!this.trigger.hasFired) {
			const matches = this.regexp.exec(s);
			if (matches && matches.length >= 1) {
				this.openExternalWithString(this.session, matches.length > 1 ? matches[1] : '');
				this.trigger.fire();
				return true;
			}
		}
		return false;
	}

	private openExternalWithString(session: vscode.DebugSession, captureString: string) {
		const args: ServerReadyAction = session.configuration.serverReadyAction;

		let uri;
		if (captureString === '') {
			// nothing captured by reg exp -> use the uriFormat as the target uri without substitution
			// verify that format does not contain '%s'
			const format = args.uriFormat || '';
			if (format.indexOf('%s') >= 0) {
				const errMsg = vscode.l10n.t("Format uri ('{0}') uses a substitution placeholder but pattern did not capture anything.", format);
				vscode.window.showErrorMessage(errMsg, { modal: true }).then(_ => undefined);
				return;
			}
			uri = format;
		} else {
			// if no uriFormat is specified guess the appropriate format based on the captureString
			const format = args.uriFormat || (/^[0-9]+$/.test(captureString) ? URI_PORT_FORMAT : URI_FORMAT);
			// verify that format only contains a single '%s'
			const s = format.split('%s');
			if (s.length !== 2) {
				const errMsg = vscode.l10n.t("Format uri ('{0}') must contain exactly one substitution placeholder.", format);
				vscode.window.showErrorMessage(errMsg, { modal: true }).then(_ => undefined);
				return;
			}
			uri = util.format(format, captureString);
		}

		this.openExternalWithUri(session, uri);
	}

	private async openExternalWithUri(session: vscode.DebugSession, uri: string) {

		const args: ServerReadyAction = session.configuration.serverReadyAction;
		switch (args.action || 'openExternally') {

			case 'openExternally':
				await vscode.env.openExternal(vscode.Uri.parse(uri));
				break;

			case 'debugWithChrome':
				await this.debugWithBrowser('pwa-chrome', session, uri);
				break;

			case 'debugWithEdge':
				await this.debugWithBrowser('pwa-msedge', session, uri);
				break;

			case 'startDebugging':
				if (args.config) {
					await this.startDebugSession(session, args.config.name, args.config);
				} else {
					await this.startDebugSession(session, args.name || 'unspecified');
				}
				break;

			default:
				// not supported
				break;
		}
	}

	private async debugWithBrowser(type: string, session: vscode.DebugSession, uri: string) {
		const args = session.configuration.serverReadyAction as ServerReadyAction;
		if (!args.killOnServerStop) {
			await this.startBrowserDebugSession(type, session, uri);
			return;
		}

		const trackerId = randomUUID();
		const cts = new vscode.CancellationTokenSource();
		const newSessionPromise = this.catchStartedDebugSession(session => session.configuration._debugServerReadySessionId === trackerId, cts.token);

		if (!await this.startBrowserDebugSession(type, session, uri, trackerId)) {
			cts.cancel();
			cts.dispose();
			return;
		}

		const createdSession = await newSessionPromise;
		cts.dispose();

		if (!createdSession) {
			return;
		}

		const stopListener = this.onDidSessionStop(async () => {
			stopListener.dispose();
			this.disposables.delete(stopListener);
			await vscode.debug.stopDebugging(createdSession);
		});
		this.disposables.add(stopListener);
	}

	private startBrowserDebugSession(type: string, session: vscode.DebugSession, uri: string, trackerId?: string) {
		return vscode.debug.startDebugging(session.workspaceFolder, {
			type,
			name: 'Browser Debug',
			request: 'launch',
			url: uri,
			webRoot: session.configuration.serverReadyAction.webRoot || WEB_ROOT,
			_debugServerReadySessionId: trackerId,
		});
	}

	/**
	 * Starts a debug session given a debug configuration name (saved in launch.json) or a debug configuration object.
	 *
	 * @param session The parent debugSession
	 * @param name The name of the configuration to launch. If config it set, it assumes it is the same as config.name.
	 * @param config [Optional] Instead of starting a debug session by debug configuration name, use a debug configuration object instead.
	 */
	private async startDebugSession(session: vscode.DebugSession, name: string, config?: vscode.DebugConfiguration) {
		const args = session.configuration.serverReadyAction as ServerReadyAction;
		if (!args.killOnServerStop) {
			await vscode.debug.startDebugging(session.workspaceFolder, config ?? name);
			return;
		}

		const cts = new vscode.CancellationTokenSource();
		const newSessionPromise = this.catchStartedDebugSession(x => x.name === name, cts.token);

		if (!await vscode.debug.startDebugging(session.workspaceFolder, config ?? name)) {
			cts.cancel();
			cts.dispose();
			return;
		}

		const createdSession = await newSessionPromise;
		cts.dispose();

		if (!createdSession) {
			return;
		}

		const stopListener = this.onDidSessionStop(async () => {
			stopListener.dispose();
			this.disposables.delete(stopListener);
			await vscode.debug.stopDebugging(createdSession);
		});
		this.disposables.add(stopListener);
	}

	private catchStartedDebugSession(predicate: (session: vscode.DebugSession) => boolean, cancellationToken: vscode.CancellationToken): Promise<vscode.DebugSession | undefined> {
		return new Promise<vscode.DebugSession | undefined>(_resolve => {
			const done = (value?: vscode.DebugSession) => {
				listener.dispose();
				cancellationListener.dispose();
				this.disposables.delete(listener);
				this.disposables.delete(cancellationListener);
				_resolve(value);
			};

			const cancellationListener = cancellationToken.onCancellationRequested(done);
			const listener = vscode.debug.onDidStartDebugSession(session => {
				if (predicate(session)) {
					done(session);
				}
			});

			// In case the debug session of interest was never caught anyhow.
			this.disposables.add(listener);
			this.disposables.add(cancellationListener);
		});
	}
}

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.debug.onDidStartDebugSession(session => {
		if (session.configuration.serverReadyAction) {
			const detector = ServerReadyDetector.start(session);
			if (detector) {
				ServerReadyDetector.startListeningTerminalData();
			}
		}
	}));

	context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(session => {
		ServerReadyDetector.stop(session);
	}));

	const trackers = new Set<string>();

	context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('*', {
		resolveDebugConfigurationWithSubstitutedVariables(_folder: vscode.WorkspaceFolder | undefined, debugConfiguration: vscode.DebugConfiguration) {
			if (debugConfiguration.type && debugConfiguration.serverReadyAction) {
				if (!trackers.has(debugConfiguration.type)) {
					trackers.add(debugConfiguration.type);
					startTrackerForType(context, debugConfiguration.type);
				}
			}
			return debugConfiguration;
		}
	}));
}

function startTrackerForType(context: vscode.ExtensionContext, type: string) {

	// scan debug console output for a PORT message
	context.subscriptions.push(vscode.debug.registerDebugAdapterTrackerFactory(type, {
		createDebugAdapterTracker(session: vscode.DebugSession) {
			const detector = ServerReadyDetector.start(session);
			if (detector) {
				let runInTerminalRequestSeq: number | undefined;
				return {
					onDidSendMessage: m => {
						if (m.type === 'event' && m.event === 'output' && m.body) {
							switch (m.body.category) {
								case 'console':
								case 'stderr':
								case 'stdout':
									if (m.body.output) {
										detector.detectPattern(m.body.output);
									}
									break;
								default:
									break;
							}
						}
						if (m.type === 'request' && m.command === 'runInTerminal' && m.arguments) {
							if (m.arguments.kind === 'integrated') {
								runInTerminalRequestSeq = m.seq; // remember this to find matching response
							}
						}
					},
					onWillReceiveMessage: m => {
						if (runInTerminalRequestSeq && m.type === 'response' && m.command === 'runInTerminal' && m.body && runInTerminalRequestSeq === m.request_seq) {
							runInTerminalRequestSeq = undefined;
							ServerReadyDetector.rememberShellPid(session, m.body.shellProcessId);
						}
					}
				};
			}
			return undefined;
		}
	}));
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/.vscodeignore]---
Location: vscode-main/extensions/diff/.vscodeignore

```text
build/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/cgmanifest.json]---
Location: vscode-main/extensions/diff/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "textmate/diff.tmbundle",
					"repositoryUrl": "https://github.com/textmate/diff.tmbundle",
					"commitHash": "0593bb775eab1824af97ef2172fd38822abd97d7"
				}
			},
			"licenseDetail": [
				"Copyright (c) textmate-diff.tmbundle project authors",
				"",
				"If not otherwise specified (see below), files in this repository fall under the following license:",
				"",
				"Permission to copy, use, modify, sell and distribute this",
				"software is granted. This software is provided \"as is\" without",
				"express or implied warranty, and with no claim as to its",
				"suitability for any purpose.",
				"",
				"An exception is made for files in readable text which contain their own license information,",
				"or files where an accompanying file exists (in the same directory) with a \"-license\" suffix added",
				"to the base-name name of the original file, and an extension of txt, html, or similar. For example",
				"\"tidy\" is accompanied by \"tidy-license.txt\"."
			],
			"license": "TextMate Bundle License",
			"version": "0.0.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/language-configuration.json]---
Location: vscode-main/extensions/diff/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#",
		"blockComment": [ "#", " " ]
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/package.json]---
Location: vscode-main/extensions/diff/package.json

```json
{
  "name": "diff",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "0.10.x"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin textmate/diff.tmbundle Syntaxes/Diff.plist ./syntaxes/diff.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "diff",
        "aliases": [
          "Diff",
          "diff"
        ],
        "extensions": [
          ".diff",
          ".patch",
          ".rej"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "diff",
        "scopeName": "source.diff",
        "path": "./syntaxes/diff.tmLanguage.json"
      }
    ]
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/package.nls.json]---
Location: vscode-main/extensions/diff/package.nls.json

```json
{
	"displayName": "Diff Language Basics",
	"description": "Provides syntax highlighting & bracket matching in Diff files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/diff/syntaxes/diff.tmLanguage.json]---
Location: vscode-main/extensions/diff/syntaxes/diff.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/textmate/diff.tmbundle/blob/master/Syntaxes/Diff.plist",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/textmate/diff.tmbundle/commit/0593bb775eab1824af97ef2172fd38822abd97d7",
	"name": "Diff",
	"scopeName": "source.diff",
	"patterns": [
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.separator.diff"
				}
			},
			"match": "^((\\*{15})|(={67})|(-{3}))$\\n?",
			"name": "meta.separator.diff"
		},
		{
			"match": "^\\d+(,\\d+)*(a|d|c)\\d+(,\\d+)*$\\n?",
			"name": "meta.diff.range.normal"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.range.diff"
				},
				"2": {
					"name": "meta.toc-list.line-number.diff"
				},
				"3": {
					"name": "punctuation.definition.range.diff"
				}
			},
			"match": "^(@@)\\s*(.+?)\\s*(@@)($\\n?)?",
			"name": "meta.diff.range.unified"
		},
		{
			"captures": {
				"3": {
					"name": "punctuation.definition.range.diff"
				},
				"4": {
					"name": "punctuation.definition.range.diff"
				},
				"6": {
					"name": "punctuation.definition.range.diff"
				},
				"7": {
					"name": "punctuation.definition.range.diff"
				}
			},
			"match": "^(((\\-{3}) .+ (\\-{4}))|((\\*{3}) .+ (\\*{4})))$\\n?",
			"name": "meta.diff.range.context"
		},
		{
			"match": "^diff --git a/.*$\\n?",
			"name": "meta.diff.header.git"
		},
		{
			"match": "^diff (-|\\S+\\s+\\S+).*$\\n?",
			"name": "meta.diff.header.command"
		},
		{
			"captures": {
				"4": {
					"name": "punctuation.definition.from-file.diff"
				},
				"6": {
					"name": "punctuation.definition.from-file.diff"
				},
				"7": {
					"name": "punctuation.definition.from-file.diff"
				}
			},
			"match": "(^(((-{3}) .+)|((\\*{3}) .+))$\\n?|^(={4}) .+(?= - ))",
			"name": "meta.diff.header.from-file"
		},
		{
			"captures": {
				"2": {
					"name": "punctuation.definition.to-file.diff"
				},
				"3": {
					"name": "punctuation.definition.to-file.diff"
				},
				"4": {
					"name": "punctuation.definition.to-file.diff"
				}
			},
			"match": "(^(\\+{3}) .+$\\n?| (-) .* (={4})$\\n?)",
			"name": "meta.diff.header.to-file"
		},
		{
			"captures": {
				"3": {
					"name": "punctuation.definition.inserted.diff"
				},
				"6": {
					"name": "punctuation.definition.inserted.diff"
				}
			},
			"match": "^(((>)( .*)?)|((\\+).*))$\\n?",
			"name": "markup.inserted.diff"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.definition.changed.diff"
				}
			},
			"match": "^(!).*$\\n?",
			"name": "markup.changed.diff"
		},
		{
			"captures": {
				"3": {
					"name": "punctuation.definition.deleted.diff"
				},
				"6": {
					"name": "punctuation.definition.deleted.diff"
				}
			},
			"match": "^(((<)( .*)?)|((-).*))$\\n?",
			"name": "markup.deleted.diff"
		},
		{
			"begin": "^(#)",
			"captures": {
				"1": {
					"name": "punctuation.definition.comment.diff"
				}
			},
			"comment": "Git produces unified diffs with embedded comments\"",
			"end": "\\n",
			"name": "comment.line.number-sign.diff"
		},
		{
			"match": "^index [0-9a-f]{7,40}\\.\\.[0-9a-f]{7,40}.*$\\n?",
			"name": "meta.diff.index.git"
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.separator.key-value.diff"
				},
				"2": {
					"name": "meta.toc-list.file-name.diff"
				}
			},
			"match": "^Index(:) (.+)$\\n?",
			"name": "meta.diff.index"
		},
		{
			"match": "^Only in .*: .*$\\n?",
			"name": "meta.diff.only-in"
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/.vscodeignore]---
Location: vscode-main/extensions/docker/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/cgmanifest.json]---
Location: vscode-main/extensions/docker/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "language-docker",
					"repositoryUrl": "https://github.com/moby/moby",
					"commitHash": "bea959c7b793b32a893820b97c4eadc7c87fabb0",
					"tag": "28.3.3"
				}
			},
			"license": "Apache-2.0",
			"description": "The file syntaxes/docker.tmLanguage was included from https://github.com/moby/moby/blob/master/contrib/syntax/textmate/Docker.tmbundle/Syntaxes/Dockerfile.tmLanguage.",
			"version": "28.3.3"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/language-configuration.json]---
Location: vscode-main/extensions/docker/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"indentationRules": {
		"increaseIndentPattern": "^\\s*.*(:|-) ?(&amp;\\w+)?(\\{[^}\"']*|\\([^)\"']*)?$",
		"decreaseIndentPattern": "^\\s+\\}$"
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/package.json]---
Location: vscode-main/extensions/docker/package.json

```json
{
  "name": "docker",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "dockerfile",
        "extensions": [
          ".dockerfile",
          ".containerfile"
        ],
        "filenames": [
          "Dockerfile",
          "Containerfile"
        ],
        "filenamePatterns": [
          "Dockerfile.*",
          "Containerfile.*"
        ],
        "aliases": [
          "Docker",
          "Dockerfile",
          "Containerfile"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "dockerfile",
        "scopeName": "source.dockerfile",
        "path": "./syntaxes/docker.tmLanguage.json"
      }
    ],
    "configurationDefaults": {
      "[dockerfile]": {
        "editor.quickSuggestions": {
          "strings": true
        }
      }
    }
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/package.nls.json]---
Location: vscode-main/extensions/docker/package.nls.json

```json
{
	"displayName": "Docker Language Basics",
	"description": "Provides syntax highlighting and bracket matching in Docker files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/docker/syntaxes/docker.tmLanguage.json]---
Location: vscode-main/extensions/docker/syntaxes/docker.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/moby/moby/blob/master/contrib/syntax/textmate/Docker.tmbundle/Syntaxes/Dockerfile.tmLanguage",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/moby/moby/commit/c2029cb2574647e4bc28ed58486b8e85883eedb9",
	"name": "Dockerfile",
	"scopeName": "source.dockerfile",
	"patterns": [
		{
			"captures": {
				"1": {
					"name": "keyword.other.special-method.dockerfile"
				},
				"2": {
					"name": "keyword.other.special-method.dockerfile"
				}
			},
			"match": "^\\s*\\b(?i:(FROM))\\b.*?\\b(?i:(AS))\\b"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.control.dockerfile"
				},
				"2": {
					"name": "keyword.other.special-method.dockerfile"
				}
			},
			"match": "^\\s*(?i:(ONBUILD)\\s+)?(?i:(ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR))\\s"
		},
		{
			"captures": {
				"1": {
					"name": "keyword.operator.dockerfile"
				},
				"2": {
					"name": "keyword.other.special-method.dockerfile"
				}
			},
			"match": "^\\s*(?i:(ONBUILD)\\s+)?(?i:(CMD|ENTRYPOINT))\\s"
		},
		{
			"include": "#string-character-escape"
		},
		{
			"begin": "\"",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.string.begin.dockerfile"
				}
			},
			"end": "\"",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.dockerfile"
				}
			},
			"name": "string.quoted.double.dockerfile",
			"patterns": [
				{
					"include": "#string-character-escape"
				}
			]
		},
		{
			"begin": "'",
			"beginCaptures": {
				"1": {
					"name": "punctuation.definition.string.begin.dockerfile"
				}
			},
			"end": "'",
			"endCaptures": {
				"1": {
					"name": "punctuation.definition.string.end.dockerfile"
				}
			},
			"name": "string.quoted.single.dockerfile",
			"patterns": [
				{
					"include": "#string-character-escape"
				}
			]
		},
		{
			"captures": {
				"1": {
					"name": "punctuation.whitespace.comment.leading.dockerfile"
				},
				"2": {
					"name": "comment.line.number-sign.dockerfile"
				},
				"3": {
					"name": "punctuation.definition.comment.dockerfile"
				}
			},
			"comment": "comment.line",
			"match": "^(\\s*)((#).*$\\n?)"
		}
	],
	"repository": {
		"string-character-escape": {
			"name": "constant.character.escaped.dockerfile",
			"match": "\\\\."
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/.vscodeignore]---
Location: vscode-main/extensions/dotenv/.vscodeignore

```text
test/**
cgmanifest.json
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/cgmanifest.json]---
Location: vscode-main/extensions/dotenv/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "dotenv-org/dotenv-vscode",
					"repositoryUrl": "https://github.com/dotenv-org/dotenv-vscode",
					"commitHash": "e7e41baa5b23e01c1ff0567a4e596c24860e7def"
				}
			},
			"licenseDetail": [
				"MIT License",
				"",
				"Copyright (c) 2022 Scott Motte",
				"",
				"Permission is hereby granted, free of charge, to any person obtaining a copy",
				"of this software and associated documentation files (the \"Software\"), to deal",
				"in the Software without restriction, including without limitation the rights",
				"to use, copy, modify, merge, publish, distribute, sublicense, and/or sell",
				"copies of the Software, and to permit persons to whom the Software is",
				"furnished to do so, subject to the following conditions:",
				"",
				"The above copyright notice and this permission notice shall be included in all",
				"copies or substantial portions of the Software.",
				"",
				"THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR",
				"IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,",
				"FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE",
				"AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER",
				"LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,",
				"OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE",
				"SOFTWARE."
			],
			"license": "MIT License",
			"version": "0.26.0"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/language-configuration.json]---
Location: vscode-main/extensions/dotenv/language-configuration.json

```json
{
	"comments": {
		"lineComment": "#"
	},
	"brackets": [
		["{", "}"],
		["[", "]"],
		["(", ")"]
	],
	"autoClosingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	],
	"surroundingPairs": [
		["{", "}"],
		["[", "]"],
		["(", ")"],
		["\"", "\""],
		["'", "'"]
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/package.json]---
Location: vscode-main/extensions/dotenv/package.json

```json
{
  "name": "dotenv",
  "displayName": "%displayName%",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "*"
  },
  "scripts": {
    "update-grammar": "node ../node_modules/vscode-grammar-updater/bin dotenv-org/dotenv-vscode syntaxes/dotenv.tmLanguage.json ./syntaxes/dotenv.tmLanguage.json"
  },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [
      {
        "id": "dotenv",
        "extensions": [
          ".env"
        ],
        "filenames": [
          ".env",
          ".flaskenv",
          "user-dirs.dirs"
        ],
        "filenamePatterns": [
          ".env.*"
        ],
        "aliases": [
          "Dotenv"
        ],
        "configuration": "./language-configuration.json"
      }
    ],
    "grammars": [
      {
        "language": "dotenv",
        "scopeName": "source.dotenv",
        "path": "./syntaxes/dotenv.tmLanguage.json"
      }
    ]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/package.nls.json]---
Location: vscode-main/extensions/dotenv/package.nls.json

```json
{
	"displayName": "Dotenv Language Basics",
	"description": "Provides syntax highlighting and bracket matching in dotenv files."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/dotenv/syntaxes/dotenv.tmLanguage.json]---
Location: vscode-main/extensions/dotenv/syntaxes/dotenv.tmLanguage.json

```json
{
	"information_for_contributors": [
		"This file has been converted from https://github.com/dotenv-org/dotenv-vscode/blob/master/syntaxes/dotenv.tmLanguage.json",
		"If you want to provide a fix or improvement, please create a pull request against the original repository.",
		"Once accepted there, we are happy to receive an update request."
	],
	"version": "https://github.com/dotenv-org/dotenv-vscode/commit/e7e41baa5b23e01c1ff0567a4e596c24860e7def",
	"scopeName": "source.dotenv",
	"patterns": [
		{
			"comment": "Full Line Comment",
			"match": "^\\s?(#.*$)\\n",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#line-comment"
						}
					]
				}
			}
		},
		{
			"comment": "ENV entry",
			"match": "^\\s?(.*?)\\s?(\\=)(.*)$",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#key"
						}
					]
				},
				"2": {
					"name": "keyword.operator.assignment.dotenv"
				},
				"3": {
					"name": "property.value.dotenv",
					"patterns": [
						{
							"include": "#line-comment"
						},
						{
							"include": "#double-quoted-string"
						},
						{
							"include": "#single-quoted-string"
						},
						{
							"include": "#interpolation"
						}
					]
				}
			}
		}
	],
	"repository": {
		"variable": {
			"comment": "env variable",
			"match": "[a-zA-Z_]+[a-zA-Z0-9_]*"
		},
		"line-comment": {
			"comment": "Comment",
			"match": "#.*$",
			"name": "comment.line.dotenv"
		},
		"interpolation": {
			"comment": "Interpolation (variable substitution)",
			"match": "(\\$\\{)(.*)(\\})",
			"captures": {
				"1": {
					"name": "keyword.interpolation.begin.dotenv"
				},
				"2": {
					"name": "variable.interpolation.dotenv"
				},
				"3": {
					"name": "keyword.interpolation.end.dotenv"
				}
			}
		},
		"escape-characters": {
			"comment": "Escape characters",
			"match": "\\\\[nrtfb\"'\\\\]|\\\\u[0123456789ABCDEF]{4}",
			"name": "constant.character.escape.dotenv"
		},
		"double-quoted-string": {
			"comment": "Double Quoted String",
			"match": "\"(.*)\"",
			"name": "string.quoted.double.dotenv",
			"captures": {
				"1": {
					"patterns": [
						{
							"include": "#interpolation"
						},
						{
							"include": "#escape-characters"
						}
					]
				}
			}
		},
		"single-quoted-string": {
			"comment": "Single Quoted String",
			"match": "'(.*)'",
			"name": "string.quoted.single.dotenv"
		},
		"key": {
			"comment": "Key",
			"match": "(export\\s)?(.*)",
			"captures": {
				"1": {
					"name": "keyword.key.export.dotenv"
				},
				"2": {
					"name": "variable.key.dotenv",
					"patterns": [
						{
							"include": "#variable"
						}
					]
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/.npmrc]---
Location: vscode-main/extensions/emmet/.npmrc

```text
legacy-peer-deps="true"
timeout=180000
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/.vscodeignore]---
Location: vscode-main/extensions/emmet/.vscodeignore

```text
test/**
test-workspace/**
src/**
out/**
tsconfig.json
extension.webpack.config.js
extension-browser.webpack.config.js
CONTRIBUTING.md
cgmanifest.json
package-lock.json
.vscode
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/cgmanifest.json]---
Location: vscode-main/extensions/emmet/cgmanifest.json

```json
{
	"registrations": [
		{
			"component": {
				"type": "git",
				"git": {
					"name": "expand-abbreviation",
					"repositoryUrl": "https://github.com/emmetio/expand-abbreviation",
					"commitHash": "ef943f2056572fe43ce9eebf72929d3c825f3995"
				}
			},
			"license": "MIT",
			"version": "0.5.8"
		}
	],
	"version": 1
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/CONTRIBUTING.md]---
Location: vscode-main/extensions/emmet/CONTRIBUTING.md

```markdown
## How to build and run from source?

Read the basics about extension authoring from [Extending Visual Studio Code](https://code.visualstudio.com/docs/extensions/overview)

- Read [Build and Run VS Code from Source](https://github.com/microsoft/vscode/wiki/How-to-Contribute#build-and-run-from-source) to get a local dev set up running for VS Code
- Open the `extensions/emmet` folder in the vscode repo in VS Code
- Press F5 to start debugging

## Running tests

Tests for Emmet extension are run as integration tests as part of VS Code.

- Read [Build and Run VS Code from Source](https://github.com/microsoft/vscode/wiki/How-to-Contribute#build-and-run-from-source) to get a local dev set up running for VS Code
- Run `./scripts/test-integration.sh` to run all the integrations tests that include the Emmet tests.
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/extension-browser.webpack.config.js]---
Location: vscode-main/extensions/emmet/extension-browser.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import { browser as withBrowserDefaults } from '../shared.webpack.config.mjs';

export default withBrowserDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/browser/emmetBrowserMain.ts'
	},
	output: {
		filename: 'emmetBrowserMain.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/extension.webpack.config.js]---
Location: vscode-main/extensions/emmet/extension.webpack.config.js

```javascript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import path from 'path';

import withDefaults from '../shared.webpack.config.mjs';

export default withDefaults({
	context: import.meta.dirname,
	entry: {
		extension: './src/node/emmetNodeMain.ts',
	},
	output: {
		path: path.join(import.meta.dirname, 'dist', 'node'),
		filename: 'emmetNodeMain.js'
	}
});
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/package-lock.json]---
Location: vscode-main/extensions/emmet/package-lock.json

```json
{
  "name": "emmet",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "emmet",
      "version": "1.0.0",
      "license": "MIT",
      "dependencies": {
        "@emmetio/css-parser": "ramya-rao-a/css-parser#vscode",
        "@emmetio/html-matcher": "^0.3.3",
        "@emmetio/math-expression": "^1.0.5",
        "@vscode/emmet-helper": "^2.8.8",
        "image-size": "~1.0.0",
        "vscode-languageserver-textdocument": "^1.0.1"
      },
      "devDependencies": {
        "@types/node": "22.x"
      },
      "engines": {
        "vscode": "^1.13.0"
      }
    },
    "node_modules/@emmetio/abbreviation": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/@emmetio/abbreviation/-/abbreviation-2.3.3.tgz",
      "integrity": "sha512-mgv58UrU3rh4YgbE/TzgLQwJ3pFsHHhCLqY20aJq+9comytTXUDNGG/SMtSeMJdkpxgXSXunBGLD8Boka3JyVA==",
      "dependencies": {
        "@emmetio/scanner": "^1.0.4"
      }
    },
    "node_modules/@emmetio/css-abbreviation": {
      "version": "2.1.8",
      "resolved": "https://registry.npmjs.org/@emmetio/css-abbreviation/-/css-abbreviation-2.1.8.tgz",
      "integrity": "sha512-s9yjhJ6saOO/uk1V74eifykk2CBYi01STTK3WlXWGOepyKa23ymJ053+DNQjpFcy1ingpaO7AxCcwLvHFY9tuw==",
      "dependencies": {
        "@emmetio/scanner": "^1.0.4"
      }
    },
    "node_modules/@emmetio/css-parser": {
      "version": "0.4.0",
      "resolved": "git+ssh://git@github.com/ramya-rao-a/css-parser.git#370c480ac103bd17c7bcfb34bf5d577dc40d3660",
      "dependencies": {
        "@emmetio/stream-reader": "^2.2.0",
        "@emmetio/stream-reader-utils": "^0.1.0"
      }
    },
    "node_modules/@emmetio/html-matcher": {
      "version": "0.3.3",
      "resolved": "https://registry.npmjs.org/@emmetio/html-matcher/-/html-matcher-0.3.3.tgz",
      "integrity": "sha512-+aeGmFXoR36nk2qzqPhBnWjnB38BV+dreTh/tsfbWP9kHv7fqRa9XuG1BSQFbPtKzsjUsBvGXkgGU3G8MkMw6A==",
      "license": "ISC",
      "dependencies": {
        "@emmetio/stream-reader": "^2.0.0",
        "@emmetio/stream-reader-utils": "^0.1.0"
      }
    },
    "node_modules/@emmetio/math-expression": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/@emmetio/math-expression/-/math-expression-1.0.5.tgz",
      "integrity": "sha512-qf5SXD/ViS04rXSeDg9CRGM10xLC9dVaKIbMHrrwxYr5LNB/C0rOfokhGSBwnVQKcidLmdRJeNWH1V1tppZ84Q==",
      "dependencies": {
        "@emmetio/scanner": "^1.0.4"
      }
    },
    "node_modules/@emmetio/scanner": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/@emmetio/scanner/-/scanner-1.0.4.tgz",
      "integrity": "sha512-IqRuJtQff7YHHBk4G8YZ45uB9BaAGcwQeVzgj/zj8/UdOhtQpEIupUhSk8dys6spFIWVZVeK20CzGEnqR5SbqA=="
    },
    "node_modules/@emmetio/stream-reader": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/@emmetio/stream-reader/-/stream-reader-2.2.0.tgz",
      "integrity": "sha1-Rs/+oRmgoAMxKiHC2bVijLX81EI= sha512-fXVXEyFA5Yv3M3n8sUGT7+fvecGrZP4k6FnWWMSZVQf69kAq0LLpaBQLGcPR30m3zMmKYhECP4k/ZkzvhEW5kw=="
    },
    "node_modules/@emmetio/stream-reader-utils": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/@emmetio/stream-reader-utils/-/stream-reader-utils-0.1.0.tgz",
      "integrity": "sha1-JEywLHfsLnT3ipvTGCGKvJxQCmE= sha512-ZsZ2I9Vzso3Ho/pjZFsmmZ++FWeEd/txqybHTm4OgaZzdS8V9V/YYWQwg5TC38Z7uLWUV1vavpLLbjJtKubR1A=="
    },
    "node_modules/@types/node": {
      "version": "22.13.10",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-22.13.10.tgz",
      "integrity": "sha512-I6LPUvlRH+O6VRUqYOcMudhaIdUVWfsjnZavnsraHvpBwaEyMN29ry+0UVJhImYL16xsscu0aske3yA+uPOWfw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.20.0"
      }
    },
    "node_modules/@vscode/emmet-helper": {
      "version": "2.11.0",
      "resolved": "https://registry.npmjs.org/@vscode/emmet-helper/-/emmet-helper-2.11.0.tgz",
      "integrity": "sha512-QLxjQR3imPZPQltfbWRnHU6JecWTF1QSWhx3GAKQpslx7y3Dp6sIIXhKjiUJ/BR9FX8PVthjr9PD6pNwOJfAzw==",
      "license": "MIT",
      "dependencies": {
        "emmet": "^2.4.3",
        "jsonc-parser": "^2.3.0",
        "vscode-languageserver-textdocument": "^1.0.1",
        "vscode-languageserver-types": "^3.15.1",
        "vscode-uri": "^3.0.8"
      }
    },
    "node_modules/emmet": {
      "version": "2.4.11",
      "resolved": "https://registry.npmjs.org/emmet/-/emmet-2.4.11.tgz",
      "integrity": "sha512-23QPJB3moh/U9sT4rQzGgeyyGIrcM+GH5uVYg2C6wZIxAIJq7Ng3QLT79tl8FUwDXhyq9SusfknOrofAKqvgyQ==",
      "license": "MIT",
      "workspaces": [
        "./packages/scanner",
        "./packages/abbreviation",
        "./packages/css-abbreviation",
        "./"
      ],
      "dependencies": {
        "@emmetio/abbreviation": "^2.3.3",
        "@emmetio/css-abbreviation": "^2.1.8"
      }
    },
    "node_modules/image-size": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/image-size/-/image-size-1.0.0.tgz",
      "integrity": "sha512-JLJ6OwBfO1KcA+TvJT+v8gbE6iWbj24LyDNFgFEN0lzegn6cC6a/p3NIDaepMsJjQjlUWqIC7wJv8lBFxPNjcw==",
      "dependencies": {
        "queue": "6.0.2"
      },
      "bin": {
        "image-size": "bin/image-size.js"
      },
      "engines": {
        "node": ">=12.0.0"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ=="
    },
    "node_modules/jsonc-parser": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/jsonc-parser/-/jsonc-parser-2.3.1.tgz",
      "integrity": "sha512-H8jvkz1O50L3dMZCsLqiuB2tA7muqbSg1AtGEkN0leAqGjsUzDJir3Zwr02BhqdcITPg3ei3mZ+HjMocAknhhg=="
    },
    "node_modules/queue": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/queue/-/queue-6.0.2.tgz",
      "integrity": "sha512-iHZWu+q3IdFZFX36ro/lKBkSvfkztY5Y7HMiPlOUjhupPcG2JMfst2KKEpu5XndviX/3UhFbRngUPNKtgvtZiA==",
      "dependencies": {
        "inherits": "~2.0.3"
      }
    },
    "node_modules/undici-types": {
      "version": "6.20.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.20.0.tgz",
      "integrity": "sha512-Ny6QZ2Nju20vw1SRHe3d9jVu6gJ+4e3+MMpqu7pqE5HT6WsTSlce++GQmK5UXS8mzV8DSYHrQH+Xrf2jVcuKNg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-textdocument": {
      "version": "1.0.12",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-textdocument/-/vscode-languageserver-textdocument-1.0.12.tgz",
      "integrity": "sha512-cxWNPesCnQCcMPeenjKKsOCKQZ/L6Tv19DTRIGuLWe32lyzWhihGVJ/rcckZXJxfdKCFvRLS3fpBIsV/ZGX4zA==",
      "license": "MIT"
    },
    "node_modules/vscode-languageserver-types": {
      "version": "3.17.5",
      "resolved": "https://registry.npmjs.org/vscode-languageserver-types/-/vscode-languageserver-types-3.17.5.tgz",
      "integrity": "sha512-Ld1VelNuX9pdF39h2Hgaeb5hEZM2Z3jUrrMgWQAu82jMtZp7p3vJT3BzToKtZI7NgQssZje5o0zryOrhQvzQAg==",
      "license": "MIT"
    },
    "node_modules/vscode-uri": {
      "version": "3.0.8",
      "resolved": "https://registry.npmjs.org/vscode-uri/-/vscode-uri-3.0.8.tgz",
      "integrity": "sha512-AyFQ0EVmsOZOlAnxoFOGOq1SQDWAB7C6aqMGS23svWAllfOaxbuFvcT8D1i8z3Gyn8fraVeZNNmN6e9bxxXkKw==",
      "license": "MIT"
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/package.json]---
Location: vscode-main/extensions/emmet/package.json

```json
{
  "name": "emmet",
  "displayName": "Emmet",
  "description": "%description%",
  "version": "1.0.0",
  "publisher": "vscode",
  "license": "MIT",
  "engines": {
    "vscode": "^1.13.0"
  },
  "icon": "images/icon.png",
  "categories": [
    "Other"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  },
  "activationEvents": [
    "onCommand:emmet.expandAbbreviation",
    "onLanguage"
  ],
  "main": "./out/node/emmetNodeMain",
  "browser": "./dist/browser/emmetBrowserMain",
  "contributes": {
    "configuration": {
      "type": "object",
      "title": "Emmet",
      "properties": {
        "emmet.showExpandedAbbreviation": {
          "type": [
            "string"
          ],
          "enum": [
            "never",
            "always",
            "inMarkupAndStylesheetFilesOnly"
          ],
          "default": "always",
          "markdownDescription": "%emmetShowExpandedAbbreviation%"
        },
        "emmet.showAbbreviationSuggestions": {
          "type": "boolean",
          "default": true,
          "scope": "language-overridable",
          "markdownDescription": "%emmetShowAbbreviationSuggestions%"
        },
        "emmet.includeLanguages": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          },
          "default": {},
          "markdownDescription": "%emmetIncludeLanguages%"
        },
        "emmet.variables": {
          "type": "object",
          "properties": {
            "lang": {
              "type": "string",
              "default": "en"
            },
            "charset": {
              "type": "string",
              "default": "UTF-8"
            }
          },
          "additionalProperties": {
            "type": "string"
          },
          "default": {},
          "markdownDescription": "%emmetVariables%"
        },
        "emmet.syntaxProfiles": {
          "type": "object",
          "default": {},
          "markdownDescription": "%emmetSyntaxProfiles%"
        },
        "emmet.excludeLanguages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [
            "markdown"
          ],
          "markdownDescription": "%emmetExclude%"
        },
        "emmet.extensionsPath": {
          "type": "array",
          "items": {
            "type": "string",
            "markdownDescription": "%emmetExtensionsPathItem%"
          },
          "default": [],
          "scope": "machine-overridable",
          "markdownDescription": "%emmetExtensionsPath%"
        },
        "emmet.triggerExpansionOnTab": {
          "type": "boolean",
          "default": false,
          "scope": "language-overridable",
          "markdownDescription": "%emmetTriggerExpansionOnTab%"
        },
        "emmet.useInlineCompletions": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%emmetUseInlineCompletions%"
        },
        "emmet.preferences": {
          "type": "object",
          "default": {},
          "markdownDescription": "%emmetPreferences%",
          "properties": {
            "css.intUnit": {
              "type": "string",
              "default": "px",
              "markdownDescription": "%emmetPreferencesIntUnit%"
            },
            "css.floatUnit": {
              "type": "string",
              "default": "em",
              "markdownDescription": "%emmetPreferencesFloatUnit%"
            },
            "css.propertyEnd": {
              "type": "string",
              "default": ";",
              "markdownDescription": "%emmetPreferencesCssAfter%"
            },
            "sass.propertyEnd": {
              "type": "string",
              "default": "",
              "markdownDescription": "%emmetPreferencesSassAfter%"
            },
            "stylus.propertyEnd": {
              "type": "string",
              "default": "",
              "markdownDescription": "%emmetPreferencesStylusAfter%"
            },
            "css.valueSeparator": {
              "type": "string",
              "default": ": ",
              "markdownDescription": "%emmetPreferencesCssBetween%"
            },
            "sass.valueSeparator": {
              "type": "string",
              "default": ": ",
              "markdownDescription": "%emmetPreferencesSassBetween%"
            },
            "stylus.valueSeparator": {
              "type": "string",
              "default": " ",
              "markdownDescription": "%emmetPreferencesStylusBetween%"
            },
            "bem.elementSeparator": {
              "type": "string",
              "default": "__",
              "markdownDescription": "%emmetPreferencesBemElementSeparator%"
            },
            "bem.modifierSeparator": {
              "type": "string",
              "default": "_",
              "markdownDescription": "%emmetPreferencesBemModifierSeparator%"
            },
            "filter.commentBefore": {
              "type": "string",
              "default": "",
              "markdownDescription": "%emmetPreferencesFilterCommentBefore%"
            },
            "filter.commentAfter": {
              "type": "string",
              "default": "\n<!-- /[#ID][.CLASS] -->",
              "markdownDescription": "%emmetPreferencesFilterCommentAfter%"
            },
            "filter.commentTrigger": {
              "type": "array",
              "default": [
                "id",
                "class"
              ],
              "markdownDescription": "%emmetPreferencesFilterCommentTrigger%"
            },
            "format.noIndentTags": {
              "type": "array",
              "default": [
                "html"
              ],
              "markdownDescription": "%emmetPreferencesFormatNoIndentTags%"
            },
            "format.forceIndentationForTags": {
              "type": "array",
              "default": [
                "body"
              ],
              "markdownDescription": "%emmetPreferencesFormatForceIndentTags%"
            },
            "profile.allowCompactBoolean": {
              "type": "boolean",
              "default": false,
              "markdownDescription": "%emmetPreferencesAllowCompactBoolean%"
            },
            "css.webkitProperties": {
              "type": "string",
              "default": null,
              "markdownDescription": "%emmetPreferencesCssWebkitProperties%"
            },
            "css.mozProperties": {
              "type": "string",
              "default": null,
              "markdownDescription": "%emmetPreferencesCssMozProperties%"
            },
            "css.oProperties": {
              "type": "string",
              "default": null,
              "markdownDescription": "%emmetPreferencesCssOProperties%"
            },
            "css.msProperties": {
              "type": "string",
              "default": null,
              "markdownDescription": "%emmetPreferencesCssMsProperties%"
            },
            "css.fuzzySearchMinScore": {
              "type": "number",
              "default": 0.3,
              "markdownDescription": "%emmetPreferencesCssFuzzySearchMinScore%"
            },
            "output.inlineBreak": {
              "type": "number",
              "default": 0,
              "markdownDescription": "%emmetPreferencesOutputInlineBreak%"
            },
            "output.reverseAttributes": {
              "type": "boolean",
              "default": false,
              "markdownDescription": "%emmetPreferencesOutputReverseAttributes%"
            },
            "output.selfClosingStyle": {
              "type": "string",
              "enum": [
                "html",
                "xhtml",
                "xml"
              ],
              "default": "html",
              "markdownDescription": "%emmetPreferencesOutputSelfClosingStyle%"
            },
            "css.color.short": {
              "type": "boolean",
              "default": true,
              "markdownDescription": "%emmetPreferencesCssColorShort%"
            }
          }
        },
        "emmet.showSuggestionsAsSnippets": {
          "type": "boolean",
          "default": false,
          "markdownDescription": "%emmetShowSuggestionsAsSnippets%"
        },
        "emmet.optimizeStylesheetParsing": {
          "type": "boolean",
          "default": true,
          "markdownDescription": "%emmetOptimizeStylesheetParsing%"
        }
      }
    },
    "commands": [
      {
        "command": "editor.emmet.action.wrapWithAbbreviation",
        "title": "%command.wrapWithAbbreviation%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.removeTag",
        "title": "%command.removeTag%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.updateTag",
        "title": "%command.updateTag%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.matchTag",
        "title": "%command.matchTag%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.balanceIn",
        "title": "%command.balanceIn%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.balanceOut",
        "title": "%command.balanceOut%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.prevEditPoint",
        "title": "%command.prevEditPoint%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.nextEditPoint",
        "title": "%command.nextEditPoint%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.mergeLines",
        "title": "%command.mergeLines%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.selectPrevItem",
        "title": "%command.selectPrevItem%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.selectNextItem",
        "title": "%command.selectNextItem%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.splitJoinTag",
        "title": "%command.splitJoinTag%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.toggleComment",
        "title": "%command.toggleComment%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.evaluateMathExpression",
        "title": "%command.evaluateMathExpression%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.updateImageSize",
        "title": "%command.updateImageSize%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.incrementNumberByOneTenth",
        "title": "%command.incrementNumberByOneTenth%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.incrementNumberByOne",
        "title": "%command.incrementNumberByOne%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.incrementNumberByTen",
        "title": "%command.incrementNumberByTen%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.decrementNumberByOneTenth",
        "title": "%command.decrementNumberByOneTenth%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.decrementNumberByOne",
        "title": "%command.decrementNumberByOne%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.decrementNumberByTen",
        "title": "%command.decrementNumberByTen%",
        "category": "Emmet"
      },
      {
        "command": "editor.emmet.action.reflectCSSValue",
        "title": "%command.reflectCSSValue%",
        "category": "Emmet"
      },
      {
        "command": "workbench.action.showEmmetCommands",
        "title": "%command.showEmmetCommands%",
        "category": ""
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "editor.emmet.action.wrapWithAbbreviation",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.removeTag",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.updateTag",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.matchTag",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.balanceIn",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.balanceOut",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.prevEditPoint",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.nextEditPoint",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.mergeLines",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.selectPrevItem",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.selectNextItem",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.splitJoinTag",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.toggleComment",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.evaluateMathExpression",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.updateImageSize",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.incrementNumberByOneTenth",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.incrementNumberByOne",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.incrementNumberByTen",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.decrementNumberByOneTenth",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.decrementNumberByOne",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.decrementNumberByTen",
          "when": "!activeEditorIsReadonly"
        },
        {
          "command": "editor.emmet.action.reflectCSSValue",
          "when": "!activeEditorIsReadonly"
        }
      ]
    }
  },
  "scripts": {
    "watch": "gulp watch-extension:emmet",
    "compile": "gulp compile-extension:emmet",
    "deps": "npm install @vscode/emmet-helper"
  },
  "devDependencies": {
    "@types/node": "22.x"
  },
  "dependencies": {
    "@emmetio/css-parser": "ramya-rao-a/css-parser#vscode",
    "@emmetio/html-matcher": "^0.3.3",
    "@emmetio/math-expression": "^1.0.5",
    "@vscode/emmet-helper": "^2.8.8",
    "image-size": "~1.0.0",
    "vscode-languageserver-textdocument": "^1.0.1"
  },
  "capabilities": {
    "virtualWorkspaces": true,
    "untrustedWorkspaces": {
      "supported": true
    }
  }
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/package.nls.json]---
Location: vscode-main/extensions/emmet/package.nls.json

```json
{
	"description": "Emmet support for VS Code",
	"command.wrapWithAbbreviation": "Wrap with Abbreviation",
	"command.removeTag": "Remove Tag",
	"command.updateTag": "Update Tag",
	"command.matchTag": "Go to Matching Pair",
	"command.balanceIn": "Balance (inward)",
	"command.balanceOut": "Balance (outward)",
	"command.prevEditPoint": "Go to Previous Edit Point",
	"command.nextEditPoint": "Go to Next Edit Point",
	"command.mergeLines": "Merge Lines",
	"command.selectPrevItem": "Select Previous Item",
	"command.selectNextItem": "Select Next Item",
	"command.splitJoinTag": "Split/Join Tag",
	"command.toggleComment": "Toggle Comment",
	"command.evaluateMathExpression": "Evaluate Math Expression",
	"command.updateImageSize": "Update Image Size",
	"command.reflectCSSValue": "Reflect CSS Value",
	"command.incrementNumberByOne": "Increment by 1",
	"command.decrementNumberByOne": "Decrement by 1",
	"command.incrementNumberByOneTenth": "Increment by 0.1",
	"command.decrementNumberByOneTenth": "Decrement by 0.1",
	"command.incrementNumberByTen": "Increment by 10",
	"command.decrementNumberByTen": "Decrement by 10",
	"command.showEmmetCommands": "Show Emmet Commands",
	"emmetSyntaxProfiles": "Define profile for specified syntax or use your own profile with specific rules.",
	"emmetExclude": "An array of languages where Emmet abbreviations should not be expanded.",
	"emmetExtensionsPath": "An array of paths, where each path can contain Emmet syntaxProfiles and/or snippet files.\nIn case of conflicts, the profiles/snippets of later paths will override those of earlier paths.\nSee https://code.visualstudio.com/docs/editor/emmet for more information and an example snippet file.",
	"emmetExtensionsPathItem": "A path containing Emmet syntaxProfiles and/or snippets.",
	"emmetShowExpandedAbbreviation": "Shows expanded Emmet abbreviations as suggestions.\nThe option `\"inMarkupAndStylesheetFilesOnly\"` applies to html, haml, jade, slim, xml, xsl, css, scss, sass, less and stylus.\nThe option `\"always\"` applies to all parts of the file regardless of markup/css.",
	"emmetShowAbbreviationSuggestions": "Shows possible Emmet abbreviations as suggestions. Not applicable in stylesheets or when emmet.showExpandedAbbreviation is set to `\"never\"`.",
	"emmetIncludeLanguages": "Enable Emmet abbreviations in languages that are not supported by default. Add a mapping here between the language and Emmet supported language.\n For example: `{\"vue-html\": \"html\", \"javascript\": \"javascriptreact\"}`",
	"emmetVariables": "Variables to be used in Emmet snippets.",
	"emmetTriggerExpansionOnTab": "When enabled, Emmet abbreviations are expanded when pressing TAB, even when completions do not show up. When disabled, completions that show up can still be accepted by pressing TAB.",
	"emmetPreferences": "Preferences used to modify behavior of some actions and resolvers of Emmet.",
	"emmetPreferencesIntUnit": "Default unit for integer values.",
	"emmetPreferencesFloatUnit": "Default unit for float values.",
	"emmetPreferencesCssAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations.",
	"emmetPreferencesSassAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations in Sass files.",
	"emmetPreferencesStylusAfter": "Symbol to be placed at the end of CSS property when expanding CSS abbreviations in Stylus files.",
	"emmetPreferencesCssBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations.",
	"emmetPreferencesSassBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations in Sass files.",
	"emmetPreferencesStylusBetween": "Symbol to be placed at the between CSS property and value when expanding CSS abbreviations in Stylus files.",
	"emmetShowSuggestionsAsSnippets": "If `true`, then Emmet suggestions will show up as snippets allowing you to order them as per `#editor.snippetSuggestions#` setting.",
	"emmetPreferencesBemElementSeparator": "Element separator used for classes when using the BEM filter.",
	"emmetPreferencesBemModifierSeparator": "Modifier separator used for classes when using the BEM filter.",
	"emmetPreferencesFilterCommentBefore": "A definition of comment that should be placed before matched element when comment filter is applied.",
	"emmetPreferencesFilterCommentAfter": "A definition of comment that should be placed after matched element when comment filter is applied.",
	"emmetPreferencesFilterCommentTrigger": "A comma-separated list of attribute names that should exist in the abbreviation for the comment filter to be applied.",
	"emmetPreferencesFormatNoIndentTags": "An array of tag names that should never get inner indentation.",
	"emmetPreferencesFormatForceIndentTags": "An array of tag names that should always get inner indentation.",
	"emmetPreferencesAllowCompactBoolean": "If `true`, compact notation of boolean attributes are produced.",
	"emmetPreferencesCssWebkitProperties": "Comma separated CSS properties that get the 'webkit' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'webkit' prefix.",
	"emmetPreferencesCssMozProperties": "Comma separated CSS properties that get the 'moz' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'moz' prefix.",
	"emmetPreferencesCssOProperties": "Comma separated CSS properties that get the 'o' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'o' prefix.",
	"emmetPreferencesCssMsProperties": "Comma separated CSS properties that get the 'ms' vendor prefix when used in Emmet abbreviation that starts with `-`. Set to empty string to always avoid the 'ms' prefix.",
	"emmetPreferencesCssFuzzySearchMinScore": "The minimum score (from 0 to 1) that fuzzy-matched abbreviation should achieve. Lower values may produce many false-positive matches, higher values may reduce possible matches.",
	"emmetOptimizeStylesheetParsing": "When set to `false`, the whole file is parsed to determine if current position is valid for expanding Emmet abbreviations. When set to `true`, only the content around the current position in CSS/SCSS/Less files is parsed.",
	"emmetPreferencesOutputInlineBreak": "The number of sibling inline elements needed for line breaks to be placed between those elements. If `0`, inline elements are always expanded onto a single line.",
	"emmetPreferencesOutputReverseAttributes": "If `true`, reverses attribute merging directions when resolving snippets.",
	"emmetPreferencesOutputSelfClosingStyle": "Style of self-closing tags: html (`<br>`), xml (`<br/>`) or xhtml (`<br />`).",
	"emmetPreferencesCssColorShort": "If `true`, color values like `#f` will be expanded to `#fff` instead of `#ffffff`.",
	"emmetUseInlineCompletions": "If `true`, Emmet will use inline completions to suggest expansions. To prevent the non-inline completion item provider from showing up as often while this setting is `true`, turn `#editor.quickSuggestions#` to `inline` or `off` for the `other` item."
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/README.md]---
Location: vscode-main/extensions/emmet/README.md

```markdown
# Emmet integration in Visual Studio Code

**Notice:** This extension is bundled with Visual Studio Code. It can be disabled but not uninstalled.

## Features

See [Emmet in Visual Studio Code](https://code.visualstudio.com/docs/editor/emmet) to learn about the features of this extension.

Please read the [CONTRIBUTING.md](https://github.com/microsoft/vscode/blob/master/extensions/emmet/CONTRIBUTING.md) file to learn how to contribute to this extension.
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/tsconfig.json]---
Location: vscode-main/extensions/emmet/tsconfig.json

```json
{
	"extends": "../tsconfig.base.json",
	"compilerOptions": {
		"outDir": "./out",
		"typeRoots": [
			"./node_modules/@types"
		],
		"skipLibCheck": true
	},
	"exclude": [
		"node_modules",
		".vscode-test"
	],
	"include": [
		"src/**/*",
		"../../src/vscode-dts/vscode.d.ts"
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/.vscode/launch.json]---
Location: vscode-main/extensions/emmet/.vscode/launch.json

```json
{
	// Use IntelliSense to learn about possible Node.js debug attributes.
	// Hover to view descriptions of existing attributes.
	// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
	"version": "0.2.0",
	"configurations": [
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "Launch Extension",
			"runtimeExecutable": "${execPath}",
			"args": ["--extensionDevelopmentPath=${workspaceFolder}"],
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		},
		{
			"type": "extensionHost",
			"request": "launch",
			"name": "Launch Tests",
			"runtimeExecutable": "${execPath}",
			"args": [
				"--extensionDevelopmentPath=${workspaceFolder}",
				"--extensionTestsPath=${workspaceFolder}/out/test",
				"--disable-extensions"
			],
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/out/**/*.js"]
		}
	]
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/.vscode/settings.json]---
Location: vscode-main/extensions/emmet/.vscode/settings.json

```json
{
    "emmet.excludeLanguages": []
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/abbreviationActions.ts]---
Location: vscode-main/extensions/emmet/src/abbreviationActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { Node, HtmlNode, Rule, Property, Stylesheet } from 'EmmetFlatNode';
import { getEmmetHelper, getFlatNode, getHtmlFlatNode, getMappingForIncludedLanguages, validate, getEmmetConfiguration, isStyleSheet, getEmmetMode, parsePartialStylesheet, isStyleAttribute, getEmbeddedCssNodeIfAny, allowedMimeTypesInScriptTag, toLSTextDocument, isOffsetInsideOpenOrCloseTag } from './util';
import { getRootNode as parseDocument } from './parseDocument';

const trimRegex = /[\u00a0]*[\d#\-\*\u2022]+\.?/;
const hexColorRegex = /^#[\da-fA-F]{0,6}$/;

interface ExpandAbbreviationInput {
	syntax: string;
	abbreviation: string;
	rangeToReplace: vscode.Range;
	textToWrap?: string[];
	filter?: string;
	indent?: string;
	baseIndent?: string;
}

interface PreviewRangesWithContent {
	previewRange: vscode.Range;
	originalRange: vscode.Range;
	originalContent: string;
	textToWrapInPreview: string[];
	baseIndent: string;
}

export async function wrapWithAbbreviation(args: any): Promise<boolean> {
	if (!validate(false)) {
		return false;
	}

	const editor = vscode.window.activeTextEditor!;
	const document = editor.document;

	args = args || {};
	if (!args['language']) {
		args['language'] = document.languageId;
	}
	// we know it's not stylesheet due to the validate(false) call above
	const syntax = getSyntaxFromArgs(args) || 'html';
	const rootNode = parseDocument(document, true);

	const helper = getEmmetHelper();

	const operationRanges = Array.from(editor.selections).sort((a, b) => a.start.compareTo(b.start)).map(selection => {
		let rangeToReplace: vscode.Range = selection;
		// wrap around the node if the selection falls inside its open or close tag
		{
			let { start, end } = rangeToReplace;

			const startOffset = document.offsetAt(start);
			const documentText = document.getText();
			const startNode = getHtmlFlatNode(documentText, rootNode, startOffset, true);
			if (startNode && isOffsetInsideOpenOrCloseTag(startNode, startOffset)) {
				start = document.positionAt(startNode.start);
				const nodeEndPosition = document.positionAt(startNode.end);
				end = nodeEndPosition.isAfter(end) ? nodeEndPosition : end;
			}

			const endOffset = document.offsetAt(end);
			const endNode = getHtmlFlatNode(documentText, rootNode, endOffset, true);
			if (endNode && isOffsetInsideOpenOrCloseTag(endNode, endOffset)) {
				const nodeStartPosition = document.positionAt(endNode.start);
				start = nodeStartPosition.isBefore(start) ? nodeStartPosition : start;
				const nodeEndPosition = document.positionAt(endNode.end);
				end = nodeEndPosition.isAfter(end) ? nodeEndPosition : end;
			}

			rangeToReplace = new vscode.Range(start, end);
		}
		// in case of multi-line, exclude last empty line from rangeToReplace
		if (!rangeToReplace.isSingleLine && rangeToReplace.end.character === 0) {
			const previousLine = rangeToReplace.end.line - 1;
			rangeToReplace = new vscode.Range(rangeToReplace.start, document.lineAt(previousLine).range.end);
		}
		// wrap line the cursor is on
		if (rangeToReplace.isEmpty) {
			rangeToReplace = document.lineAt(rangeToReplace.start).range;
		}

		// ignore whitespace on the first line
		const firstLineOfRange = document.lineAt(rangeToReplace.start);
		if (!firstLineOfRange.isEmptyOrWhitespace && firstLineOfRange.firstNonWhitespaceCharacterIndex > rangeToReplace.start.character) {
			rangeToReplace = rangeToReplace.with(new vscode.Position(rangeToReplace.start.line, firstLineOfRange.firstNonWhitespaceCharacterIndex));
		}

		return rangeToReplace;
	}).reduce((mergedRanges, range) => {
		// Merge overlapping ranges
		if (mergedRanges.length > 0 && range.intersection(mergedRanges[mergedRanges.length - 1])) {
			mergedRanges.push(range.union(mergedRanges.pop()!));
		} else {
			mergedRanges.push(range);
		}
		return mergedRanges;
	}, [] as vscode.Range[]);

	// Backup orginal selections and update selections
	// Also helps with https://github.com/microsoft/vscode/issues/113930 by avoiding `editor.linkedEditing`
	// execution if selection is inside an open or close tag
	const oldSelections = editor.selections;
	editor.selections = operationRanges.map(range => new vscode.Selection(range.start, range.end));

	// Fetch general information for the succesive expansions. i.e. the ranges to replace and its contents
	const rangesToReplace: PreviewRangesWithContent[] = operationRanges.map(rangeToReplace => {
		let textToWrapInPreview: string[];
		const textToReplace = document.getText(rangeToReplace);

		// the following assumes all the lines are indented the same way as the first
		// this assumption helps with applyPreview later
		const wholeFirstLine = document.lineAt(rangeToReplace.start).text;
		const otherMatches = wholeFirstLine.match(/^(\s*)/);
		const baseIndent = otherMatches ? otherMatches[1] : '';
		textToWrapInPreview = rangeToReplace.isSingleLine ?
			[textToReplace] :
			textToReplace.split('\n' + baseIndent).map(x => x.trimEnd());

		// escape $ characters, fixes #52640
		textToWrapInPreview = textToWrapInPreview.map(e => e.replace(/(\$\d)/g, '\\$1'));

		return {
			previewRange: rangeToReplace,
			originalRange: rangeToReplace,
			originalContent: textToReplace,
			textToWrapInPreview,
			baseIndent
		};
	});

	const { tabSize, insertSpaces } = editor.options;
	const indent = insertSpaces ? ' '.repeat(tabSize as number) : '\t';

	function revertPreview(): Thenable<boolean> {
		return editor.edit(builder => {
			for (const rangeToReplace of rangesToReplace) {
				builder.replace(rangeToReplace.previewRange, rangeToReplace.originalContent);
				rangeToReplace.previewRange = rangeToReplace.originalRange;
			}
		}, { undoStopBefore: false, undoStopAfter: false });
	}

	function applyPreview(expandAbbrList: ExpandAbbreviationInput[]): Thenable<boolean> {
		let lastOldPreviewRange = new vscode.Range(0, 0, 0, 0);
		let lastNewPreviewRange = new vscode.Range(0, 0, 0, 0);
		let totalNewLinesInserted = 0;

		return editor.edit(builder => {
			// the edits are applied in order top-down
			for (let i = 0; i < rangesToReplace.length; i++) {
				const expandedText = expandAbbr(expandAbbrList[i]) || '';
				if (!expandedText) {
					// Failed to expand text. We already showed an error inside expandAbbr.
					break;
				}

				// get the current preview range, format the new wrapped text, and then replace
				// the text in the preview range with that new text
				const oldPreviewRange = rangesToReplace[i].previewRange;
				const newText = expandedText
					.replace(/\$\{[\d]*\}/g, '|') // Removing Tabstops
					.replace(/\$\{[\d]*:([^}]*)\}/g, (_, placeholder) => placeholder) // Replacing Placeholders
					.replace(/\\\$/g, '$'); // Remove backslashes before $
				builder.replace(oldPreviewRange, newText);

				// calculate the new preview range to use for future previews
				// we also have to take into account that the previous expansions could:
				// - cause new lines to appear
				// - be on the same line as other expansions
				const expandedTextLines = newText.split('\n');
				const oldPreviewLines = oldPreviewRange.end.line - oldPreviewRange.start.line + 1;
				const newLinesInserted = expandedTextLines.length - oldPreviewLines;

				const newPreviewLineStart = oldPreviewRange.start.line + totalNewLinesInserted;
				let newPreviewStart = oldPreviewRange.start.character;
				const newPreviewLineEnd = oldPreviewRange.end.line + totalNewLinesInserted + newLinesInserted;
				let newPreviewEnd = expandedTextLines[expandedTextLines.length - 1].length;
				if (i > 0 && newPreviewLineEnd === lastNewPreviewRange.end.line) {
					// If newPreviewLineEnd is equal to the previous expandedText lineEnd,
					// set newPreviewStart to the length of the previous expandedText in that line
					// plus the number of characters between both selections.
					newPreviewStart = lastNewPreviewRange.end.character + (oldPreviewRange.start.character - lastOldPreviewRange.end.character);
					newPreviewEnd += newPreviewStart;
				} else if (i > 0 && newPreviewLineStart === lastNewPreviewRange.end.line) {
					// Same as above but expandedTextLines.length > 1 so newPreviewEnd keeps its value.
					newPreviewStart = lastNewPreviewRange.end.character + (oldPreviewRange.start.character - lastOldPreviewRange.end.character);
				} else if (expandedTextLines.length === 1) {
					// If the expandedText is single line, add the length of preceeding text as it will not be included in line length.
					newPreviewEnd += oldPreviewRange.start.character;
				}

				lastOldPreviewRange = rangesToReplace[i].previewRange;
				lastNewPreviewRange = new vscode.Range(newPreviewLineStart, newPreviewStart, newPreviewLineEnd, newPreviewEnd);
				rangesToReplace[i].previewRange = lastNewPreviewRange;
				totalNewLinesInserted += newLinesInserted;
			}
		}, { undoStopBefore: false, undoStopAfter: false });
	}

	let inPreviewMode = false;
	async function makeChanges(inputAbbreviation: string | undefined, previewChanges: boolean): Promise<boolean> {
		const isAbbreviationValid = !!inputAbbreviation && !!inputAbbreviation.trim() && helper.isAbbreviationValid(syntax, inputAbbreviation);
		const extractedResults = isAbbreviationValid ? helper.extractAbbreviationFromText(inputAbbreviation!, syntax) : undefined;
		if (!extractedResults) {
			if (inPreviewMode) {
				inPreviewMode = false;
				await revertPreview();
			}
			return false;
		}

		const { abbreviation, filter } = extractedResults;
		if (abbreviation !== inputAbbreviation) {
			// Not clear what should we do in this case. Warn the user? How?
		}

		if (previewChanges) {
			const expandAbbrList: ExpandAbbreviationInput[] = rangesToReplace.map(rangesAndContent =>
				({ syntax, abbreviation, rangeToReplace: rangesAndContent.originalRange, textToWrap: rangesAndContent.textToWrapInPreview, filter, indent, baseIndent: rangesAndContent.baseIndent })
			);

			inPreviewMode = true;
			return applyPreview(expandAbbrList);
		}

		const expandAbbrList: ExpandAbbreviationInput[] = rangesToReplace.map(rangesAndContent =>
			({ syntax, abbreviation, rangeToReplace: rangesAndContent.originalRange, textToWrap: rangesAndContent.textToWrapInPreview, filter, indent })
		);

		if (inPreviewMode) {
			inPreviewMode = false;
			await revertPreview();
		}

		return expandAbbreviationInRange(editor, expandAbbrList, false);
	}

	let currentValue = '';
	async function inputChanged(value: string): Promise<string> {
		if (value !== currentValue) {
			currentValue = value;
			await makeChanges(value, true);
		}
		return '';
	}

	const prompt = vscode.l10n.t("Enter Abbreviation");
	const inputAbbreviation = (args && args['abbreviation'])
		? (args['abbreviation'] as string)
		: await vscode.window.showInputBox({ prompt, validateInput: inputChanged });

	const changesWereMade = await makeChanges(inputAbbreviation, false);
	if (!changesWereMade) {
		editor.selections = oldSelections;
	}

	return changesWereMade;
}

export function expandEmmetAbbreviation(args: any): Thenable<boolean | undefined> {
	if (!validate() || !vscode.window.activeTextEditor) {
		return fallbackTab();
	}

	/**
	 * Short circuit the parsing. If previous character is space, do not expand.
	 */
	if (vscode.window.activeTextEditor.selections.length === 1 &&
		vscode.window.activeTextEditor.selection.isEmpty
	) {
		const anchor = vscode.window.activeTextEditor.selection.anchor;
		if (anchor.character === 0) {
			return fallbackTab();
		}

		const prevPositionAnchor = anchor.translate(0, -1);
		const prevText = vscode.window.activeTextEditor.document.getText(new vscode.Range(prevPositionAnchor, anchor));
		if (prevText === ' ' || prevText === '\t') {
			return fallbackTab();
		}
	}

	args = args || {};
	if (!args['language']) {
		args['language'] = vscode.window.activeTextEditor.document.languageId;
	} else {
		const excludedLanguages = vscode.workspace.getConfiguration('emmet')['excludeLanguages'] ? vscode.workspace.getConfiguration('emmet')['excludeLanguages'] : [];
		if (excludedLanguages.includes(vscode.window.activeTextEditor.document.languageId)) {
			return fallbackTab();
		}
	}
	const syntax = getSyntaxFromArgs(args);
	if (!syntax) {
		return fallbackTab();
	}

	const editor = vscode.window.activeTextEditor;

	// When tabbed on a non empty selection, do not treat it as an emmet abbreviation, and fallback to tab instead
	if (vscode.workspace.getConfiguration('emmet')['triggerExpansionOnTab'] === true && editor.selections.find(x => !x.isEmpty)) {
		return fallbackTab();
	}

	const abbreviationList: ExpandAbbreviationInput[] = [];
	let firstAbbreviation: string;
	let allAbbreviationsSame: boolean = true;
	const helper = getEmmetHelper();

	const getAbbreviation = (document: vscode.TextDocument, selection: vscode.Selection, position: vscode.Position, syntax: string): [vscode.Range | null, string, string | undefined] => {
		position = document.validatePosition(position);
		let rangeToReplace: vscode.Range = selection;
		let abbr = document.getText(rangeToReplace);
		if (!rangeToReplace.isEmpty) {
			const extractedResults = helper.extractAbbreviationFromText(abbr, syntax);
			if (extractedResults) {
				return [rangeToReplace, extractedResults.abbreviation, extractedResults.filter];
			}
			return [null, '', ''];
		}

		const currentLine = editor.document.lineAt(position.line).text;
		const textTillPosition = currentLine.substr(0, position.character);

		// Expand cases like <div to <div></div> explicitly
		// else we will end up with <<div></div>
		if (syntax === 'html') {
			const matches = textTillPosition.match(/<(\w+)$/);
			if (matches) {
				abbr = matches[1];
				rangeToReplace = new vscode.Range(position.translate(0, -(abbr.length + 1)), position);
				return [rangeToReplace, abbr, ''];
			}
		}
		const extractedResults = helper.extractAbbreviation(toLSTextDocument(editor.document), position, { lookAhead: false });
		if (!extractedResults) {
			return [null, '', ''];
		}

		const { abbreviationRange, abbreviation, filter } = extractedResults;
		return [new vscode.Range(abbreviationRange.start.line, abbreviationRange.start.character, abbreviationRange.end.line, abbreviationRange.end.character), abbreviation, filter];
	};

	const selectionsInReverseOrder = editor.selections.slice(0);
	selectionsInReverseOrder.sort((a, b) => {
		const posA = a.isReversed ? a.anchor : a.active;
		const posB = b.isReversed ? b.anchor : b.active;
		return posA.compareTo(posB) * -1;
	});

	let rootNode: Node | undefined;
	function getRootNode() {
		if (rootNode) {
			return rootNode;
		}

		const usePartialParsing = vscode.workspace.getConfiguration('emmet')['optimizeStylesheetParsing'] === true;
		if (editor.selections.length === 1 && isStyleSheet(editor.document.languageId) && usePartialParsing && editor.document.lineCount > 1000) {
			rootNode = parsePartialStylesheet(editor.document, editor.selection.isReversed ? editor.selection.anchor : editor.selection.active);
		} else {
			rootNode = parseDocument(editor.document, true);
		}

		return rootNode;
	}

	selectionsInReverseOrder.forEach(selection => {
		const position = selection.isReversed ? selection.anchor : selection.active;
		const [rangeToReplace, abbreviation, filter] = getAbbreviation(editor.document, selection, position, syntax);
		if (!rangeToReplace) {
			return;
		}
		if (!helper.isAbbreviationValid(syntax, abbreviation)) {
			return;
		}
		if (isStyleSheet(syntax) && abbreviation.endsWith(':')) {
			// Fix for https://github.com/Microsoft/vscode/issues/1623
			return;
		}

		const offset = editor.document.offsetAt(position);
		let currentNode = getFlatNode(getRootNode(), offset, true);
		let validateLocation = true;
		let syntaxToUse = syntax;

		if (editor.document.languageId === 'html') {
			if (isStyleAttribute(currentNode, offset)) {
				syntaxToUse = 'css';
				validateLocation = false;
			} else {
				const embeddedCssNode = getEmbeddedCssNodeIfAny(editor.document, currentNode, position);
				if (embeddedCssNode) {
					currentNode = getFlatNode(embeddedCssNode, offset, true);
					syntaxToUse = 'css';
				}
			}
		}

		if (validateLocation && !isValidLocationForEmmetAbbreviation(editor.document, getRootNode(), currentNode, syntaxToUse, offset, rangeToReplace)) {
			return;
		}

		if (!firstAbbreviation) {
			firstAbbreviation = abbreviation;
		} else if (allAbbreviationsSame && firstAbbreviation !== abbreviation) {
			allAbbreviationsSame = false;
		}

		abbreviationList.push({ syntax: syntaxToUse, abbreviation, rangeToReplace, filter });
	});

	return expandAbbreviationInRange(editor, abbreviationList, allAbbreviationsSame).then(success => {
		return success ? Promise.resolve(undefined) : fallbackTab();
	});
}

function fallbackTab(): Thenable<boolean | undefined> {
	if (vscode.workspace.getConfiguration('emmet')['triggerExpansionOnTab'] === true) {
		return vscode.commands.executeCommand('tab');
	}
	return Promise.resolve(true);
}
/**
 * Checks if given position is a valid location to expand emmet abbreviation.
 * Works only on html and css/less/scss syntax
 * @param document current Text Document
 * @param rootNode parsed document
 * @param currentNode current node in the parsed document
 * @param syntax syntax of the abbreviation
 * @param position position to validate
 * @param abbreviationRange The range of the abbreviation for which given position is being validated
 */
export function isValidLocationForEmmetAbbreviation(document: vscode.TextDocument, rootNode: Node | undefined, currentNode: Node | undefined, syntax: string, offset: number, abbreviationRange: vscode.Range): boolean {
	if (isStyleSheet(syntax)) {
		const stylesheet = <Stylesheet>rootNode;
		if (stylesheet && (stylesheet.comments || []).some(x => offset >= x.start && offset <= x.end)) {
			return false;
		}
		// Continue validation only if the file was parse-able and the currentNode has been found
		if (!currentNode) {
			return true;
		}

		// Get the abbreviation right now
		// Fixes https://github.com/microsoft/vscode/issues/74505
		// Stylesheet abbreviations starting with @ should bring up suggestions
		// even at outer-most level
		const abbreviation = document.getText(new vscode.Range(abbreviationRange.start.line, abbreviationRange.start.character, abbreviationRange.end.line, abbreviationRange.end.character));
		if (abbreviation.startsWith('@')) {
			return true;
		}

		// Fix for https://github.com/microsoft/vscode/issues/34162
		// Other than sass, stylus, we can make use of the terminator tokens to validate position
		if (syntax !== 'sass' && syntax !== 'stylus' && currentNode.type === 'property') {
			// Fix for upstream issue https://github.com/emmetio/css-parser/issues/3
			if (currentNode.parent
				&& currentNode.parent.type !== 'rule'
				&& currentNode.parent.type !== 'at-rule') {
				return false;
			}

			const propertyNode = <Property>currentNode;
			if (propertyNode.terminatorToken
				&& propertyNode.separator
				&& offset >= propertyNode.separatorToken.end
				&& offset <= propertyNode.terminatorToken.start
				&& !abbreviation.includes(':')) {
				return hexColorRegex.test(abbreviation) || abbreviation === '!';
			}
			if (!propertyNode.terminatorToken
				&& propertyNode.separator
				&& offset >= propertyNode.separatorToken.end
				&& !abbreviation.includes(':')) {
				return hexColorRegex.test(abbreviation) || abbreviation === '!';
			}
			if (hexColorRegex.test(abbreviation) || abbreviation === '!') {
				return false;
			}
		}

		// If current node is a rule or at-rule, then perform additional checks to ensure
		// emmet suggestions are not provided in the rule selector
		if (currentNode.type !== 'rule' && currentNode.type !== 'at-rule') {
			return true;
		}

		const currentCssNode = <Rule>currentNode;

		// Position is valid if it occurs after the `{` that marks beginning of rule contents
		if (offset > currentCssNode.contentStartToken.end) {
			return true;
		}

		// Workaround for https://github.com/microsoft/vscode/30188
		// The line above the rule selector is considered as part of the selector by the css-parser
		// But we should assume it is a valid location for css properties under the parent rule
		if (currentCssNode.parent
			&& (currentCssNode.parent.type === 'rule' || currentCssNode.parent.type === 'at-rule')
			&& currentCssNode.selectorToken) {
			const position = document.positionAt(offset);
			const tokenStartPos = document.positionAt(currentCssNode.selectorToken.start);
			const tokenEndPos = document.positionAt(currentCssNode.selectorToken.end);
			if (position.line !== tokenEndPos.line
				&& tokenStartPos.character === abbreviationRange.start.character
				&& tokenStartPos.line === abbreviationRange.start.line
			) {
				return true;
			}
		}

		return false;
	}

	const startAngle = '<';
	const endAngle = '>';
	const escape = '\\';
	const question = '?';
	const currentHtmlNode = <HtmlNode>currentNode;
	let start = 0;

	if (currentHtmlNode) {
		if (currentHtmlNode.name === 'script') {
			const typeAttribute = (currentHtmlNode.attributes || []).filter(x => x.name.toString() === 'type')[0];
			const typeValue = typeAttribute ? typeAttribute.value.toString() : '';

			if (allowedMimeTypesInScriptTag.includes(typeValue)) {
				return true;
			}

			const isScriptJavascriptType = !typeValue || typeValue === 'application/javascript' || typeValue === 'text/javascript';
			if (isScriptJavascriptType) {
				return !!getSyntaxFromArgs({ language: 'javascript' });
			}
			return false;
		}

		// Fix for https://github.com/microsoft/vscode/issues/28829
		if (!currentHtmlNode.open || !currentHtmlNode.close ||
			!(currentHtmlNode.open.end <= offset && offset <= currentHtmlNode.close.start)) {
			return false;
		}

		// Fix for https://github.com/microsoft/vscode/issues/35128
		// Find the position up till where we will backtrack looking for unescaped < or >
		// to decide if current position is valid for emmet expansion
		start = currentHtmlNode.open.end;
		let lastChildBeforePosition = currentHtmlNode.firstChild;
		while (lastChildBeforePosition) {
			if (lastChildBeforePosition.end > offset) {
				break;
			}
			start = lastChildBeforePosition.end;
			lastChildBeforePosition = lastChildBeforePosition.nextSibling;
		}
	}
	const startPos = document.positionAt(start);
	let textToBackTrack = document.getText(new vscode.Range(startPos.line, startPos.character, abbreviationRange.start.line, abbreviationRange.start.character));

	// Worse case scenario is when cursor is inside a big chunk of text which needs to backtracked
	// Backtrack only 500 offsets to ensure we dont waste time doing this
	if (textToBackTrack.length > 500) {
		textToBackTrack = textToBackTrack.substr(textToBackTrack.length - 500);
	}

	if (!textToBackTrack.trim()) {
		return true;
	}

	let valid = true;
	let foundSpace = false; // If < is found before finding whitespace, then its valid abbreviation. E.g.: <div|
	let i = textToBackTrack.length - 1;
	if (textToBackTrack[i] === startAngle) {
		return false;
	}

	while (i >= 0) {
		const char = textToBackTrack[i];
		i--;
		if (!foundSpace && /\s/.test(char)) {
			foundSpace = true;
			continue;
		}
		if (char === question && textToBackTrack[i] === startAngle) {
			i--;
			continue;
		}
		// Fix for https://github.com/microsoft/vscode/issues/55411
		// A space is not a valid character right after < in a tag name.
		if (/\s/.test(char) && textToBackTrack[i] === startAngle) {
			i--;
			continue;
		}
		if (char !== startAngle && char !== endAngle) {
			continue;
		}
		if (i >= 0 && textToBackTrack[i] === escape) {
			i--;
			continue;
		}
		if (char === endAngle) {
			if (i >= 0 && textToBackTrack[i] === '=') {
				continue; // False alarm of cases like =>
			} else {
				break;
			}
		}
		if (char === startAngle) {
			valid = !foundSpace;
			break;
		}
	}

	return valid;
}

/**
 * Expands abbreviations as detailed in expandAbbrList in the editor
 *
 * @returns false if no snippet can be inserted.
 */
async function expandAbbreviationInRange(editor: vscode.TextEditor, expandAbbrList: ExpandAbbreviationInput[], insertSameSnippet: boolean): Promise<boolean> {
	if (!expandAbbrList || expandAbbrList.length === 0) {
		return false;
	}

	// Snippet to replace at multiple cursors are not the same
	// `editor.insertSnippet` will have to be called for each instance separately
	// We will not be able to maintain multiple cursors after snippet insertion
	let insertedSnippetsCount = 0;
	if (!insertSameSnippet) {
		expandAbbrList.sort((a: ExpandAbbreviationInput, b: ExpandAbbreviationInput) => { return b.rangeToReplace.start.compareTo(a.rangeToReplace.start); });
		for (const expandAbbrInput of expandAbbrList) {
			const expandedText = expandAbbr(expandAbbrInput);
			if (expandedText) {
				await editor.insertSnippet(new vscode.SnippetString(expandedText), expandAbbrInput.rangeToReplace, { undoStopBefore: false, undoStopAfter: false });
				insertedSnippetsCount++;
			}
		}
		return insertedSnippetsCount > 0;
	}

	// Snippet to replace at all cursors are the same
	// We can pass all ranges to `editor.insertSnippet` in a single call so that
	// all cursors are maintained after snippet insertion
	const anyExpandAbbrInput = expandAbbrList[0];
	const expandedText = expandAbbr(anyExpandAbbrInput);
	const allRanges = expandAbbrList.map(value => value.rangeToReplace);
	if (expandedText) {
		return editor.insertSnippet(new vscode.SnippetString(expandedText), allRanges);
	}
	return false;
}

/**
 * Expands abbreviation as detailed in given input.
 */
function expandAbbr(input: ExpandAbbreviationInput): string | undefined {
	const helper = getEmmetHelper();
	const expandOptions = helper.getExpandOptions(input.syntax, getEmmetConfiguration(input.syntax), input.filter);

	if (input.textToWrap) {
		// escape ${ sections, fixes #122231
		input.textToWrap = input.textToWrap.map(e => e.replace(/\$\{/g, '\\\$\{'));
		if (input.filter && input.filter.includes('t')) {
			input.textToWrap = input.textToWrap.map(line => {
				return line.replace(trimRegex, '').trim();
			});
		}
		expandOptions['text'] = input.textToWrap;

		if (expandOptions.options) {
			// Below fixes https://github.com/microsoft/vscode/issues/29898
			// With this, Emmet formats inline elements as block elements
			// ensuring the wrapped multi line text does not get merged to a single line
			if (!input.rangeToReplace.isSingleLine) {
				expandOptions.options['output.inlineBreak'] = 1;
			}

			if (input.indent) {
				expandOptions.options['output.indent'] = input.indent;
			}
			if (input.baseIndent) {
				expandOptions.options['output.baseIndent'] = input.baseIndent;
			}
		}
	}

	let expandedText: string | undefined;
	try {
		expandedText = helper.expandAbbreviation(input.abbreviation, expandOptions);
	} catch (e) {
		void vscode.window.showErrorMessage('Failed to expand abbreviation');
	}

	return expandedText;
}

export function getSyntaxFromArgs(args: { [x: string]: string }): string | undefined {
	const mappedModes = getMappingForIncludedLanguages();
	const language: string = args['language'];
	const parentMode: string = args['parentMode'];
	const excludedLanguages = vscode.workspace.getConfiguration('emmet')['excludeLanguages'] ? vscode.workspace.getConfiguration('emmet')['excludeLanguages'] : [];
	if (excludedLanguages.includes(language)) {
		return;
	}

	let syntax = getEmmetMode(mappedModes[language] ?? language, mappedModes, excludedLanguages);
	if (!syntax) {
		syntax = getEmmetMode(mappedModes[parentMode] ?? parentMode, mappedModes, excludedLanguages);
	}

	return syntax;
}
```

--------------------------------------------------------------------------------

---[FILE: extensions/emmet/src/balance.ts]---
Location: vscode-main/extensions/emmet/src/balance.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { getHtmlFlatNode, offsetRangeToSelection, validate } from './util';
import { getRootNode } from './parseDocument';
import { HtmlNode as HtmlFlatNode } from 'EmmetFlatNode';

let balanceOutStack: Array<readonly vscode.Selection[]> = [];
let lastBalancedSelections: readonly vscode.Selection[] = [];

export function balanceOut() {
	balance(true);
}

export function balanceIn() {
	balance(false);
}

function balance(out: boolean) {
	if (!validate(false) || !vscode.window.activeTextEditor) {
		return;
	}
	const editor = vscode.window.activeTextEditor;
	const document = editor.document;
	const rootNode = <HtmlFlatNode>getRootNode(document, true);
	if (!rootNode) {
		return;
	}

	const rangeFn = out ? getRangeToBalanceOut : getRangeToBalanceIn;
	let newSelections: readonly vscode.Selection[] = editor.selections.map(selection => {
		return rangeFn(document, rootNode, selection);
	});

	// check whether we are starting a balance elsewhere
	if (areSameSelections(lastBalancedSelections, editor.selections)) {
		// we are not starting elsewhere, so use the stack as-is
		if (out) {
			// make sure we are able to expand outwards
			if (!areSameSelections(editor.selections, newSelections)) {
				balanceOutStack.push(editor.selections);
			}
		} else if (balanceOutStack.length) {
			newSelections = balanceOutStack.pop()!;
		}
	} else {
		// we are starting elsewhere, so reset the stack
		balanceOutStack = out ? [editor.selections] : [];
	}

	editor.selections = newSelections;
	lastBalancedSelections = editor.selections;
}

function getRangeToBalanceOut(document: vscode.TextDocument, rootNode: HtmlFlatNode, selection: vscode.Selection): vscode.Selection {
	const offset = document.offsetAt(selection.start);
	const nodeToBalance = getHtmlFlatNode(document.getText(), rootNode, offset, false);
	if (!nodeToBalance) {
		return selection;
	}
	if (!nodeToBalance.open || !nodeToBalance.close) {
		return offsetRangeToSelection(document, nodeToBalance.start, nodeToBalance.end);
	}

	// Set reverse direction if we were in the end tag
	let innerSelection: vscode.Selection;
	let outerSelection: vscode.Selection;
	if (nodeToBalance.close.start <= offset && nodeToBalance.close.end > offset) {
		innerSelection = offsetRangeToSelection(document, nodeToBalance.close.start, nodeToBalance.open.end);
		outerSelection = offsetRangeToSelection(document, nodeToBalance.close.end, nodeToBalance.open.start);
	}
	else {
		innerSelection = offsetRangeToSelection(document, nodeToBalance.open.end, nodeToBalance.close.start);
		outerSelection = offsetRangeToSelection(document, nodeToBalance.open.start, nodeToBalance.close.end);
	}

	if (innerSelection.contains(selection) && !innerSelection.isEqual(selection)) {
		return innerSelection;
	}
	if (outerSelection.contains(selection) && !outerSelection.isEqual(selection)) {
		return outerSelection;
	}
	return selection;
}

function getRangeToBalanceIn(document: vscode.TextDocument, rootNode: HtmlFlatNode, selection: vscode.Selection): vscode.Selection {
	const offset = document.offsetAt(selection.start);
	const nodeToBalance = getHtmlFlatNode(document.getText(), rootNode, offset, true);
	if (!nodeToBalance) {
		return selection;
	}

	const selectionStart = document.offsetAt(selection.start);
	const selectionEnd = document.offsetAt(selection.end);
	if (nodeToBalance.open && nodeToBalance.close) {
		const entireNodeSelected = selectionStart === nodeToBalance.start && selectionEnd === nodeToBalance.end;
		const startInOpenTag = selectionStart > nodeToBalance.open.start && selectionStart < nodeToBalance.open.end;
		const startInCloseTag = selectionStart > nodeToBalance.close.start && selectionStart < nodeToBalance.close.end;

		if (entireNodeSelected || startInOpenTag || startInCloseTag) {
			return offsetRangeToSelection(document, nodeToBalance.open.end, nodeToBalance.close.start);
		}
	}

	if (!nodeToBalance.firstChild) {
		return selection;
	}

	const firstChild = nodeToBalance.firstChild;
	if (selectionStart === firstChild.start
		&& selectionEnd === firstChild.end
		&& firstChild.open
		&& firstChild.close) {
		return offsetRangeToSelection(document, firstChild.open.end, firstChild.close.start);
	}

	return offsetRangeToSelection(document, firstChild.start, firstChild.end);
}

function areSameSelections(a: readonly vscode.Selection[], b: readonly vscode.Selection[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	for (let i = 0; i < a.length; i++) {
		if (!a[i].isEqual(b[i])) {
			return false;
		}
	}
	return true;
}
```

--------------------------------------------------------------------------------

````
