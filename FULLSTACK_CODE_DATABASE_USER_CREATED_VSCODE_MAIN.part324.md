---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 324
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 324 of 552)

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

---[FILE: src/vs/workbench/api/test/node/extHostSearch.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/node/extHostSearch.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mapArrayOrNot } from '../../../../base/common/arrays.js';
import { timeout } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { revive } from '../../../../base/common/marshalling.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import * as pfs from '../../../../base/node/pfs.js';
import { mock } from '../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { NullLogService } from '../../../../platform/log/common/log.js';
import { MainContext, MainThreadSearchShape } from '../../common/extHost.protocol.js';
import { ExtHostConfigProvider, IExtHostConfiguration } from '../../common/extHostConfiguration.js';
import { IExtHostInitDataService } from '../../common/extHostInitDataService.js';
import { Range } from '../../common/extHostTypes.js';
import { URITransformerService } from '../../common/extHostUriTransformerService.js';
import { NativeExtHostSearch } from '../../node/extHostSearch.js';
import { TestRPCProtocol } from '../common/testRPCProtocol.js';
import { IFileMatch, IFileQuery, IPatternInfo, IRawFileMatch2, ISearchCompleteStats, ISearchQuery, ITextQuery, QueryType, resultIsMatch } from '../../../services/search/common/search.js';
import { TextSearchManager } from '../../../services/search/common/textSearchManager.js';
import { NativeTextSearchManager } from '../../../services/search/node/textSearchManager.js';
import type * as vscode from 'vscode';
import { AISearchKeyword } from '../../../services/search/common/searchExtTypes.js';

let rpcProtocol: TestRPCProtocol;
let extHostSearch: NativeExtHostSearch;

let mockMainThreadSearch: MockMainThreadSearch;
class MockMainThreadSearch implements MainThreadSearchShape {
	lastHandle!: number;

	results: Array<UriComponents | IRawFileMatch2> = [];

	keywords: Array<AISearchKeyword> = [];

	$registerFileSearchProvider(handle: number, scheme: string): void {
		this.lastHandle = handle;
	}

	$registerTextSearchProvider(handle: number, scheme: string): void {
		this.lastHandle = handle;
	}

	$registerAITextSearchProvider(handle: number, scheme: string): void {
		this.lastHandle = handle;
	}

	$unregisterProvider(handle: number): void {
	}

	$handleFileMatch(handle: number, session: number, data: UriComponents[]): void {
		this.results.push(...data);
	}

	$handleTextMatch(handle: number, session: number, data: IRawFileMatch2[]): void {
		this.results.push(...data);
	}

	$handleKeywordResult(handle: number, session: number, data: AISearchKeyword): void {
		this.keywords.push(data);
	}

	$handleTelemetry(eventName: string, data: any): void {
	}

	dispose() {
	}
}

let mockPFS: Partial<typeof pfs>;

function extensionResultIsMatch(data: vscode.TextSearchResult): data is vscode.TextSearchMatch {
	return !!(<vscode.TextSearchMatch>data).preview;
}

suite('ExtHostSearch', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	async function registerTestTextSearchProvider(provider: vscode.TextSearchProvider, scheme = 'file'): Promise<void> {
		disposables.add(extHostSearch.registerTextSearchProviderOld(scheme, provider));
		await rpcProtocol.sync();
	}

	async function registerTestFileSearchProvider(provider: vscode.FileSearchProvider, scheme = 'file'): Promise<void> {
		disposables.add(extHostSearch.registerFileSearchProviderOld(scheme, provider));
		await rpcProtocol.sync();
	}

	async function runFileSearch(query: IFileQuery, cancel = false): Promise<{ results: URI[]; stats: ISearchCompleteStats }> {
		let stats: ISearchCompleteStats;
		try {
			const cancellation = new CancellationTokenSource();
			const p = extHostSearch.$provideFileSearchResults(mockMainThreadSearch.lastHandle, 0, query, cancellation.token);
			if (cancel) {
				await timeout(0);
				cancellation.cancel();
			}

			stats = await p;
		} catch (err) {
			if (!isCancellationError(err)) {
				await rpcProtocol.sync();
				throw err;
			}
		}

		await rpcProtocol.sync();
		return {
			results: (<UriComponents[]>mockMainThreadSearch.results).map(r => URI.revive(r)),
			stats: stats!
		};
	}

	async function runTextSearch(query: ITextQuery): Promise<{ results: IFileMatch[]; stats: ISearchCompleteStats }> {
		let stats: ISearchCompleteStats;
		try {
			const cancellation = new CancellationTokenSource();
			const p = extHostSearch.$provideTextSearchResults(mockMainThreadSearch.lastHandle, 0, query, cancellation.token);

			stats = await p;
		} catch (err) {
			if (!isCancellationError(err)) {
				await rpcProtocol.sync();
				throw err;
			}
		}

		await rpcProtocol.sync();
		const results: IFileMatch[] = revive(<IRawFileMatch2[]>mockMainThreadSearch.results);

		return { results, stats: stats! };
	}

	setup(() => {
		rpcProtocol = new TestRPCProtocol();

		mockMainThreadSearch = new MockMainThreadSearch();
		const logService = new NullLogService();

		rpcProtocol.set(MainContext.MainThreadSearch, mockMainThreadSearch);

		mockPFS = {};
		extHostSearch = disposables.add(new class extends NativeExtHostSearch {
			constructor() {
				super(
					rpcProtocol,
					new class extends mock<IExtHostInitDataService>() { override remote = { isRemote: false, authority: undefined, connectionData: null }; },
					new URITransformerService(null),
					new class extends mock<IExtHostConfiguration>() {
						override async getConfigProvider(): Promise<ExtHostConfigProvider> {
							return {
								onDidChangeConfiguration(_listener: (event: vscode.ConfigurationChangeEvent) => void) { },
								getConfiguration(): vscode.WorkspaceConfiguration {
									return {
										get() { },
										has() {
											return false;
										},
										inspect() {
											return undefined;
										},
										async update() { }
									};
								},

							} as ExtHostConfigProvider;
						}
					},
					logService
				);
				// eslint-disable-next-line local/code-no-any-casts
				this._pfs = mockPFS as any;
			}

			protected override createTextSearchManager(query: ITextQuery, provider: vscode.TextSearchProvider2): TextSearchManager {
				return new NativeTextSearchManager(query, provider, this._pfs);
			}
		});
	});

	teardown(() => {
		return rpcProtocol.sync();
	});

	const rootFolderA = URI.file('/foo/bar1');
	const rootFolderB = URI.file('/foo/bar2');
	const fancyScheme = 'fancy';
	const fancySchemeFolderA = URI.from({ scheme: fancyScheme, path: '/project/folder1' });

	suite('File:', () => {

		function getSimpleQuery(filePattern = ''): IFileQuery {
			return {
				type: QueryType.File,

				filePattern,
				folderQueries: [
					{ folder: rootFolderA }
				]
			};
		}

		function compareURIs(actual: URI[], expected: URI[]) {
			const sortAndStringify = (arr: URI[]) => arr.sort().map(u => u.toString());

			assert.deepStrictEqual(
				sortAndStringify(actual),
				sortAndStringify(expected));
		}

		test('no results', async () => {
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return Promise.resolve(null!);
				}
			});

			const { results, stats } = await runFileSearch(getSimpleQuery());
			assert(!stats.limitHit);
			assert(!results.length);
		});

		test('simple results', async () => {
			const reportedResults = [
				joinPath(rootFolderA, 'file1.ts'),
				joinPath(rootFolderA, 'file2.ts'),
				joinPath(rootFolderA, 'subfolder/file3.ts')
			];

			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return Promise.resolve(reportedResults);
				}
			});

			const { results, stats } = await runFileSearch(getSimpleQuery());
			assert(!stats.limitHit);
			assert.strictEqual(results.length, 3);
			compareURIs(results, reportedResults);
		});

		test('Search canceled', async () => {
			let cancelRequested = false;
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {

					return new Promise((resolve, reject) => {
						function onCancel() {
							cancelRequested = true;

							resolve([joinPath(options.folder, 'file1.ts')]); // or reject or nothing?
						}

						if (token.isCancellationRequested) {
							onCancel();
						} else {
							disposables.add(token.onCancellationRequested(() => onCancel()));
						}
					});
				}
			});

			const { results } = await runFileSearch(getSimpleQuery(), true);
			assert(cancelRequested);
			assert(!results.length);
		});

		test('session cancellation should work', async () => {
			let numSessionCancelled = 0;
			const disposables: (vscode.Disposable | undefined)[] = [];
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {

					disposables.push(options.session?.onCancellationRequested(() => {
						numSessionCancelled++;
					}));

					return Promise.resolve([]);
				}
			});


			await runFileSearch({ ...getSimpleQuery(), cacheKey: '1' }, true);
			await runFileSearch({ ...getSimpleQuery(), cacheKey: '2' }, true);
			extHostSearch.$clearCache('1');
			assert.strictEqual(numSessionCancelled, 1);
			disposables.forEach(d => d?.dispose());
		});

		test('provider returns null', async () => {
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return null!;
				}
			});

			try {
				await runFileSearch(getSimpleQuery());
				assert(false, 'Expected to fail');
			} catch {
				// Expected to throw
			}
		});

		test('all provider calls get global include/excludes', async () => {
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					assert(options.excludes.length === 2 && options.includes.length === 2, 'Missing global include/excludes');
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				includePattern: {
					'foo': true,
					'bar': true
				},
				excludePattern: {
					'something': true,
					'else': true
				},
				folderQueries: [
					{ folder: rootFolderA },
					{ folder: rootFolderB }
				]
			};

			await runFileSearch(query);
		});

		test('global/local include/excludes combined', async () => {
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					if (options.folder.toString() === rootFolderA.toString()) {
						assert.deepStrictEqual(options.includes.sort(), ['*.ts', 'foo']);
						assert.deepStrictEqual(options.excludes.sort(), ['*.js', 'bar']);
					} else {
						assert.deepStrictEqual(options.includes.sort(), ['*.ts']);
						assert.deepStrictEqual(options.excludes.sort(), ['*.js']);
					}

					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				includePattern: {
					'*.ts': true
				},
				excludePattern: {
					'*.js': true
				},
				folderQueries: [
					{
						folder: rootFolderA,
						includePattern: {
							'foo': true
						},
						excludePattern: [{
							pattern: {
								'bar': true
							}
						}]
					},
					{ folder: rootFolderB }
				]
			};

			await runFileSearch(query);
		});

		test('include/excludes resolved correctly', async () => {
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					assert.deepStrictEqual(options.includes.sort(), ['*.jsx', '*.ts']);
					assert.deepStrictEqual(options.excludes.sort(), []);

					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				includePattern: {
					'*.ts': true,
					'*.jsx': false
				},
				excludePattern: {
					'*.js': true,
					'*.tsx': false
				},
				folderQueries: [
					{
						folder: rootFolderA,
						includePattern: {
							'*.jsx': true
						},
						excludePattern: [{
							pattern: {
								'*.js': false
							}
						}]
					}
				]
			};

			await runFileSearch(query);
		});

		test('basic sibling exclude clause', async () => {
			const reportedResults = [
				'file1.ts',
				'file1.js',
			];

			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return Promise.resolve(reportedResults
						.map(relativePath => joinPath(options.folder, relativePath)));
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				excludePattern: {
					'*.js': {
						when: '$(basename).ts'
					}
				},
				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results } = await runFileSearch(query);
			compareURIs(
				results,
				[
					joinPath(rootFolderA, 'file1.ts')
				]);
		});

		// https://github.com/microsoft/vscode-remotehub/issues/255
		test('include, sibling exclude, and subfolder', async () => {
			const reportedResults = [
				'foo/file1.ts',
				'foo/file1.js',
			];

			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return Promise.resolve(reportedResults
						.map(relativePath => joinPath(options.folder, relativePath)));
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				includePattern: { '**/*.ts': true },
				excludePattern: {
					'*.js': {
						when: '$(basename).ts'
					}
				},
				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results } = await runFileSearch(query);
			compareURIs(
				results,
				[
					joinPath(rootFolderA, 'foo/file1.ts')
				]);
		});

		test('multiroot sibling exclude clause', async () => {

			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					let reportedResults: URI[];
					if (options.folder.fsPath === rootFolderA.fsPath) {
						reportedResults = [
							'folder/fileA.scss',
							'folder/fileA.css',
							'folder/file2.css'
						].map(relativePath => joinPath(rootFolderA, relativePath));
					} else {
						reportedResults = [
							'fileB.ts',
							'fileB.js',
							'file3.js'
						].map(relativePath => joinPath(rootFolderB, relativePath));
					}

					return Promise.resolve(reportedResults);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				excludePattern: {
					'*.js': {
						when: '$(basename).ts'
					},
					'*.css': true
				},
				folderQueries: [
					{
						folder: rootFolderA,
						excludePattern: [{
							pattern: {
								'folder/*.css': {
									when: '$(basename).scss'
								}
							}
						}]
					},
					{
						folder: rootFolderB,
						excludePattern: [{
							pattern: {
								'*.js': false
							}
						}]
					}
				]
			};

			const { results } = await runFileSearch(query);
			compareURIs(
				results,
				[
					joinPath(rootFolderA, 'folder/fileA.scss'),
					joinPath(rootFolderA, 'folder/file2.css'),

					joinPath(rootFolderB, 'fileB.ts'),
					joinPath(rootFolderB, 'fileB.js'),
					joinPath(rootFolderB, 'file3.js'),
				]);
		});

		test('max results = 1', async () => {
			const reportedResults = [
				joinPath(rootFolderA, 'file1.ts'),
				joinPath(rootFolderA, 'file2.ts'),
				joinPath(rootFolderA, 'file3.ts'),
			];

			let wasCanceled = false;
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));

					return Promise.resolve(reportedResults);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				maxResults: 1,

				folderQueries: [
					{
						folder: rootFolderA
					}
				]
			};

			const { results, stats } = await runFileSearch(query);
			assert(stats.limitHit, 'Expected to return limitHit');
			assert.strictEqual(results.length, 1);
			compareURIs(results, reportedResults.slice(0, 1));
			assert(wasCanceled, 'Expected to be canceled when hitting limit');
		});

		test('max results = 2', async () => {
			const reportedResults = [
				joinPath(rootFolderA, 'file1.ts'),
				joinPath(rootFolderA, 'file2.ts'),
				joinPath(rootFolderA, 'file3.ts'),
			];

			let wasCanceled = false;
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));

					return Promise.resolve(reportedResults);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				maxResults: 2,

				folderQueries: [
					{
						folder: rootFolderA
					}
				]
			};

			const { results, stats } = await runFileSearch(query);
			assert(stats.limitHit, 'Expected to return limitHit');
			assert.strictEqual(results.length, 2);
			compareURIs(results, reportedResults.slice(0, 2));
			assert(wasCanceled, 'Expected to be canceled when hitting limit');
		});

		test('provider returns maxResults exactly', async () => {
			const reportedResults = [
				joinPath(rootFolderA, 'file1.ts'),
				joinPath(rootFolderA, 'file2.ts'),
			];

			let wasCanceled = false;
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));

					return Promise.resolve(reportedResults);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				maxResults: 2,

				folderQueries: [
					{
						folder: rootFolderA
					}
				]
			};

			const { results, stats } = await runFileSearch(query);
			assert(!stats.limitHit, 'Expected not to return limitHit');
			assert.strictEqual(results.length, 2);
			compareURIs(results, reportedResults);
			assert(!wasCanceled, 'Expected not to be canceled when just reaching limit');
		});

		test('multiroot max results', async () => {
			let cancels = 0;
			await registerTestFileSearchProvider({
				async provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					disposables.add(token.onCancellationRequested(() => cancels++));

					// Provice results async so it has a chance to invoke every provider
					await new Promise(r => process.nextTick(r));
					return [
						'file1.ts',
						'file2.ts',
						'file3.ts',
					].map(relativePath => joinPath(options.folder, relativePath));
				}
			});

			const query: ISearchQuery = {
				type: QueryType.File,

				filePattern: '',
				maxResults: 2,

				folderQueries: [
					{
						folder: rootFolderA
					},
					{
						folder: rootFolderB
					}
				]
			};

			const { results } = await runFileSearch(query);
			assert.strictEqual(results.length, 2); // Don't care which 2 we got
			assert.strictEqual(cancels, 2, 'Expected all invocations to be canceled when hitting limit');
		});

		test('works with non-file schemes', async () => {
			const reportedResults = [
				joinPath(fancySchemeFolderA, 'file1.ts'),
				joinPath(fancySchemeFolderA, 'file2.ts'),
				joinPath(fancySchemeFolderA, 'subfolder/file3.ts'),

			];

			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					return Promise.resolve(reportedResults);
				}
			}, fancyScheme);

			const query: ISearchQuery = {
				type: QueryType.File,
				filePattern: '',
				folderQueries: [
					{
						folder: fancySchemeFolderA
					}
				]
			};

			const { results } = await runFileSearch(query);
			compareURIs(results, reportedResults);
		});
		test('if onlyFileScheme is set, do not call custom schemes', async () => {
			let fancySchemeCalled = false;
			await registerTestFileSearchProvider({
				provideFileSearchResults(query: vscode.FileSearchQuery, options: vscode.FileSearchOptions, token: vscode.CancellationToken): Promise<URI[]> {
					fancySchemeCalled = true;
					return Promise.resolve([]);
				}
			}, fancyScheme);

			const query: ISearchQuery = {
				type: QueryType.File,
				filePattern: '',
				folderQueries: []
			};

			await runFileSearch(query);
			assert(!fancySchemeCalled);
		});
	});

	suite('Text:', () => {

		function makePreview(text: string): vscode.TextSearchMatch['preview'] {
			return {
				matches: [new Range(0, 0, 0, text.length)],
				text
			};
		}

		function makeTextResult(baseFolder: URI, relativePath: string): vscode.TextSearchMatch {
			return {
				preview: makePreview('foo'),
				ranges: [new Range(0, 0, 0, 3)],
				uri: joinPath(baseFolder, relativePath)
			};
		}

		function getSimpleQuery(queryText: string): ITextQuery {
			return {
				type: QueryType.Text,
				contentPattern: getPattern(queryText),

				folderQueries: [
					{ folder: rootFolderA }
				]
			};
		}

		function getPattern(queryText: string): IPatternInfo {
			return {
				pattern: queryText
			};
		}

		function assertResults(actual: IFileMatch[], expected: vscode.TextSearchResult[]) {
			const actualTextSearchResults: vscode.TextSearchResult[] = [];
			for (const fileMatch of actual) {
				// Make relative
				for (const lineResult of fileMatch.results!) {
					if (resultIsMatch(lineResult)) {
						actualTextSearchResults.push({
							preview: {
								text: lineResult.previewText,
								matches: mapArrayOrNot(
									lineResult.rangeLocations.map(r => r.preview),
									m => new Range(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn))
							},
							ranges: mapArrayOrNot(
								lineResult.rangeLocations.map(r => r.source),
								r => new Range(r.startLineNumber, r.startColumn, r.endLineNumber, r.endColumn),
							),
							uri: fileMatch.resource
						});
					} else {
						actualTextSearchResults.push(<vscode.TextSearchContext>{
							text: lineResult.text,
							lineNumber: lineResult.lineNumber,
							uri: fileMatch.resource
						});
					}
				}
			}

			const rangeToString = (r: vscode.Range) => `(${r.start.line}, ${r.start.character}), (${r.end.line}, ${r.end.character})`;

			const makeComparable = (results: vscode.TextSearchResult[]) => results
				.sort((a, b) => {
					const compareKeyA = a.uri.toString() + ': ' + (extensionResultIsMatch(a) ? a.preview.text : a.text);
					const compareKeyB = b.uri.toString() + ': ' + (extensionResultIsMatch(b) ? b.preview.text : b.text);
					return compareKeyB.localeCompare(compareKeyA);
				})
				.map(r => extensionResultIsMatch(r) ? {
					uri: r.uri.toString(),
					range: mapArrayOrNot(r.ranges, rangeToString),
					preview: {
						text: r.preview.text,
						match: null // Don't care about this right now
					}
				} : {
					uri: r.uri.toString(),
					text: r.text,
					lineNumber: r.lineNumber
				});

			return assert.deepStrictEqual(
				makeComparable(actualTextSearchResults),
				makeComparable(expected));
		}

		test('no results', async () => {
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					return Promise.resolve(null!);
				}
			});

			const { results, stats } = await runTextSearch(getSimpleQuery('foo'));
			assert(!stats.limitHit);
			assert(!results.length);
		});

		test('basic results', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.ts'),
				makeTextResult(rootFolderA, 'file2.ts')
			];

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const { results, stats } = await runTextSearch(getSimpleQuery('foo'));
			assert(!stats.limitHit);
			assertResults(results, providedResults);
		});

		test('all provider calls get global include/excludes', async () => {
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					assert.strictEqual(options.includes.length, 1);
					assert.strictEqual(options.excludes.length, 1);
					return Promise.resolve(null!);
				}
			});

			const query: ITextQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				includePattern: {
					'*.ts': true
				},

				excludePattern: {
					'*.js': true
				},

				folderQueries: [
					{ folder: rootFolderA },
					{ folder: rootFolderB }
				]
			};

			await runTextSearch(query);
		});

		test('global/local include/excludes combined', async () => {
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					if (options.folder.toString() === rootFolderA.toString()) {
						assert.deepStrictEqual(options.includes.sort(), ['*.ts', 'foo']);
						assert.deepStrictEqual(options.excludes.sort(), ['*.js', 'bar']);
					} else {
						assert.deepStrictEqual(options.includes.sort(), ['*.ts']);
						assert.deepStrictEqual(options.excludes.sort(), ['*.js']);
					}

					return Promise.resolve(null!);
				}
			});

			const query: ITextQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				includePattern: {
					'*.ts': true
				},
				excludePattern: {
					'*.js': true
				},
				folderQueries: [
					{
						folder: rootFolderA,
						includePattern: {
							'foo': true
						},
						excludePattern: [{
							pattern: {
								'bar': true
							}
						}]
					},
					{ folder: rootFolderB }
				]
			};

			await runTextSearch(query);
		});

		test('include/excludes resolved correctly', async () => {
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					assert.deepStrictEqual(options.includes.sort(), ['*.jsx', '*.ts']);
					assert.deepStrictEqual(options.excludes.sort(), []);

					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				includePattern: {
					'*.ts': true,
					'*.jsx': false
				},
				excludePattern: {
					'*.js': true,
					'*.tsx': false
				},
				folderQueries: [
					{
						folder: rootFolderA,
						includePattern: {
							'*.jsx': true
						},
						excludePattern: [{
							pattern: {
								'*.js': false
							}
						}]
					}
				]
			};

			await runTextSearch(query);
		});

		test('provider fail', async () => {
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					throw new Error('Provider fail');
				}
			});

			try {
				await runTextSearch(getSimpleQuery('foo'));
				assert(false, 'Expected to fail');
			} catch {
				// expected to fail
			}
		});

		test('basic sibling clause', async () => {
			// eslint-disable-next-line local/code-no-any-casts
			(mockPFS as any).Promises = {
				readdir: (_path: string): any => {
					if (_path === rootFolderA.fsPath) {
						return Promise.resolve([
							'file1.js',
							'file1.ts'
						]);
					} else {
						return Promise.reject(new Error('Wrong path'));
					}
				}
			};

			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.js'),
				makeTextResult(rootFolderA, 'file1.ts')
			];

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				excludePattern: {
					'*.js': {
						when: '$(basename).ts'
					}
				},

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results } = await runTextSearch(query);
			assertResults(results, providedResults.slice(1));
		});

		test('multiroot sibling clause', async () => {
			// eslint-disable-next-line local/code-no-any-casts
			(mockPFS as any).Promises = {
				readdir: (_path: string): any => {
					if (_path === joinPath(rootFolderA, 'folder').fsPath) {
						return Promise.resolve([
							'fileA.scss',
							'fileA.css',
							'file2.css'
						]);
					} else if (_path === rootFolderB.fsPath) {
						return Promise.resolve([
							'fileB.ts',
							'fileB.js',
							'file3.js'
						]);
					} else {
						return Promise.reject(new Error('Wrong path'));
					}
				}
			};

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					let reportedResults;
					if (options.folder.fsPath === rootFolderA.fsPath) {
						reportedResults = [
							makeTextResult(rootFolderA, 'folder/fileA.scss'),
							makeTextResult(rootFolderA, 'folder/fileA.css'),
							makeTextResult(rootFolderA, 'folder/file2.css')
						];
					} else {
						reportedResults = [
							makeTextResult(rootFolderB, 'fileB.ts'),
							makeTextResult(rootFolderB, 'fileB.js'),
							makeTextResult(rootFolderB, 'file3.js')
						];
					}

					reportedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				excludePattern: {
					'*.js': {
						when: '$(basename).ts'
					},
					'*.css': true
				},
				folderQueries: [
					{
						folder: rootFolderA,
						excludePattern: [{
							pattern: {
								'folder/*.css': {
									when: '$(basename).scss'
								}
							}
						}]
					},
					{
						folder: rootFolderB,
						excludePattern: [{
							pattern: {
								'*.js': false
							}
						}]
					}
				]
			};

			const { results } = await runTextSearch(query);
			assertResults(results, [
				makeTextResult(rootFolderA, 'folder/fileA.scss'),
				makeTextResult(rootFolderA, 'folder/file2.css'),
				makeTextResult(rootFolderB, 'fileB.ts'),
				makeTextResult(rootFolderB, 'fileB.js'),
				makeTextResult(rootFolderB, 'file3.js')]);
		});

		test('include pattern applied', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.js'),
				makeTextResult(rootFolderA, 'file1.ts')
			];

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				includePattern: {
					'*.ts': true
				},

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results } = await runTextSearch(query);
			assertResults(results, providedResults.slice(1));
		});

		test('max results = 1', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.ts'),
				makeTextResult(rootFolderA, 'file2.ts')
			];

			let wasCanceled = false;
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				maxResults: 1,

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results, stats } = await runTextSearch(query);
			assert(stats.limitHit, 'Expected to return limitHit');
			assertResults(results, providedResults.slice(0, 1));
			assert(wasCanceled, 'Expected to be canceled');
		});

		test('max results = 2', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.ts'),
				makeTextResult(rootFolderA, 'file2.ts'),
				makeTextResult(rootFolderA, 'file3.ts')
			];

			let wasCanceled = false;
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				maxResults: 2,

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results, stats } = await runTextSearch(query);
			assert(stats.limitHit, 'Expected to return limitHit');
			assertResults(results, providedResults.slice(0, 2));
			assert(wasCanceled, 'Expected to be canceled');
		});

		test('provider returns maxResults exactly', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.ts'),
				makeTextResult(rootFolderA, 'file2.ts')
			];

			let wasCanceled = false;
			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					disposables.add(token.onCancellationRequested(() => wasCanceled = true));
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				maxResults: 2,

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results, stats } = await runTextSearch(query);
			assert(!stats.limitHit, 'Expected not to return limitHit');
			assertResults(results, providedResults);
			assert(!wasCanceled, 'Expected not to be canceled');
		});

		test('provider returns early with limitHit', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(rootFolderA, 'file1.ts'),
				makeTextResult(rootFolderA, 'file2.ts'),
				makeTextResult(rootFolderA, 'file3.ts')
			];

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve({ limitHit: true });
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				maxResults: 1000,

				folderQueries: [
					{ folder: rootFolderA }
				]
			};

			const { results, stats } = await runTextSearch(query);
			assert(stats.limitHit, 'Expected to return limitHit');
			assertResults(results, providedResults);
		});

		test('multiroot max results', async () => {
			let cancels = 0;
			await registerTestTextSearchProvider({
				async provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					disposables.add(token.onCancellationRequested(() => cancels++));
					await new Promise(r => process.nextTick(r));
					[
						'file1.ts',
						'file2.ts',
						'file3.ts',
					].forEach(f => progress.report(makeTextResult(options.folder, f)));
					return null!;
				}
			});

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				maxResults: 2,

				folderQueries: [
					{ folder: rootFolderA },
					{ folder: rootFolderB }
				]
			};

			const { results } = await runTextSearch(query);
			assert.strictEqual(results.length, 2);
			assert.strictEqual(cancels, 2);
		});

		test('works with non-file schemes', async () => {
			const providedResults: vscode.TextSearchResult[] = [
				makeTextResult(fancySchemeFolderA, 'file1.ts'),
				makeTextResult(fancySchemeFolderA, 'file2.ts'),
				makeTextResult(fancySchemeFolderA, 'file3.ts')
			];

			await registerTestTextSearchProvider({
				provideTextSearchResults(query: vscode.TextSearchQuery, options: vscode.TextSearchOptions, progress: vscode.Progress<vscode.TextSearchResult>, token: vscode.CancellationToken): Promise<vscode.TextSearchComplete> {
					providedResults.forEach(r => progress.report(r));
					return Promise.resolve(null!);
				}
			}, fancyScheme);

			const query: ISearchQuery = {
				type: QueryType.Text,
				contentPattern: getPattern('foo'),

				folderQueries: [
					{ folder: fancySchemeFolderA }
				]
			};

			const { results } = await runTextSearch(query);
			assertResults(results, providedResults);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/test/node/extHostTunnelService.test.ts]---
Location: vscode-main/src/vs/workbench/api/test/node/extHostTunnelService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { findPorts, getRootProcesses, getSockets, loadConnectionTable, loadListeningPorts, parseIpAddress, tryFindRootPorts } from '../../node/extHostTunnelService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';

const tcp =
	`  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
	0: 00000000:0BBA 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2335214 1 0000000010173312 100 0 0 10 0
	1: 00000000:1AF3 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2334514 1 000000008815920b 100 0 0 10 0
	2: 0100007F:A9EA 0100007F:1AF3 01 00000000:00000000 00:00000000 00000000  1000        0 2334521 1 00000000a37d44c6 21 4 0 10 -1
	3: 0100007F:E8B4 0100007F:98EF 01 00000000:00000000 00:00000000 00000000  1000        0 2334532 1 0000000031b88f06 21 4 0 10 -1
	4: 0100007F:866C 0100007F:8783 01 00000000:00000000 00:00000000 00000000  1000        0 2334510 1 00000000cbf670bb 21 4 30 10 -1
	5: 0100007F:1AF3 0100007F:A9EA 01 00000000:00000000 00:00000000 00000000  1000        0 2338989 1 0000000000bace62 21 4 1 10 -1
`;
const tcp6 =
	`  sl  local_address                         remote_address                        st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
	0: 00000000000000000000000000000000:815B 00000000000000000000000000000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2321070 1 00000000c44f3f02 100 0 0 10 0
	1: 00000000000000000000000000000000:8783 00000000000000000000000000000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2334509 1 000000003915e812 100 0 0 10 0
	2: 00000000000000000000000000000000:9907 00000000000000000000000000000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2284465 1 00000000f13b9374 100 0 0 10 0
	3: 00000000000000000000000000000000:98EF 00000000000000000000000000000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2334531 1 00000000184cae9c 100 0 0 10 0
	4: 00000000000000000000000000000000:8BCF 00000000000000000000000000000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2329890 1 00000000c05a3466 100 0 0 10 0
	5: 0000000000000000FFFF00000100007F:8783 0000000000000000FFFF00000100007F:866C 01 00000000:00000000 00:00000000 00000000  1000        0 2334511 1 00000000bf547132 21 4 1 10 -1
	6: 0000000000000000FFFF00000100007F:98EF 0000000000000000FFFF00000100007F:E8B4 01 00000000:00000000 00:00000000 00000000  1000        0 2334533 1 0000000039d0bcd2 21 4 1 10 -1
	7: 0000000000000000FFFF0000DFD317AC:9907 0000000000000000FFFF000001D017AC:C123 01 0000005A:00000000 01:00000017 00000000  1000        0 2311039 3 0000000067b6c8db 23 5 25 10 52
	8: 0000000000000000FFFF0000DFD317AC:9907 0000000000000000FFFF000001D017AC:C124 01 00000000:00000000 00:00000000 00000000  1000        0 2311040 1 00000000230bb017 25 4 30 10 28
	9: 0000000000000000FFFF0000DFD317AC:9907 0000000000000000FFFF000001D017AC:C213 01 00000000:00000000 00:00000000 00000000  1000        0 2331501 1 00000000957fcb4a 26 4 30 10 57
	10: 0000000000000000FFFF0000DFD317AC:9907 0000000000000000FFFF000001D017AC:C214 01 00000000:00000000 00:00000000 00000000  1000        0 2331500 1 00000000d7f87ceb 25 4 28 10 -1
`;

const procSockets =
	`ls: cannot access '/proc/8289/fd/255': No such file or directory
			ls: cannot access '/proc/8289/fd/3': No such file or directory
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/230/fd/3 -> socket:[21862]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/0 -> socket:[2311043]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/1 -> socket:[2311045]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/19 -> socket:[2311040]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/2 -> socket:[2311047]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/20 -> socket:[2314928]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/22 -> socket:[2307042]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/24 -> socket:[2307051]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/25 -> socket:[2307044]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/27 -> socket:[2307046]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/29 -> socket:[2307053]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/3 -> socket:[2311049]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/30 -> socket:[2307048]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/32 -> socket:[2307055]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/33 -> socket:[2307067]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/34 -> socket:[2307057]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/35 -> socket:[2321483]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/37 -> socket:[2321070]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/41 -> socket:[2321485]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/42 -> socket:[2321074]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/43 -> socket:[2321487]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/44 -> socket:[2329890]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/45 -> socket:[2321489]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2504/fd/46 -> socket:[2334509]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/47 -> socket:[2334510]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/48 -> socket:[2329894]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/49 -> socket:[2334511]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/50 -> socket:[2334515]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/51 -> socket:[2334519]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/52 -> socket:[2334518]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/53 -> socket:[2334521]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/54 -> socket:[2334531]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/55 -> socket:[2334532]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/2504/fd/56 -> socket:[2334533]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2515/fd/3 -> socket:[2311053]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2719/fd/0 -> socket:[2307043]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2719/fd/1 -> socket:[2307045]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2719/fd/2 -> socket:[2307047]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2719/fd/3 -> socket:[2307049]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2725/fd/0 -> socket:[2307052]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2725/fd/1 -> socket:[2307054]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2725/fd/2 -> socket:[2307056]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2725/fd/20 -> socket:[2290617]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2725/fd/3 -> socket:[2307058]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2739/fd/0 -> socket:[2307052]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2739/fd/1 -> socket:[2307054]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2739/fd/2 -> socket:[2307056]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2739/fd/3 -> socket:[2290618]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2795/fd/0 -> socket:[2321484]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2795/fd/1 -> socket:[2321486]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2795/fd/2 -> socket:[2321488]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/2795/fd/3 -> socket:[2321490]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/18 -> socket:[2284465]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/19 -> socket:[2311039]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/23 -> socket:[2331501]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/24 -> socket:[2311052]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/25 -> socket:[2311042]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/26 -> socket:[2331504]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/27 -> socket:[2311051]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/29 -> socket:[2311044]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/314/fd/30 -> socket:[2321909]
			lrwx------ 1 alex alex 64 Dec  8 14:59 /proc/314/fd/31 -> socket:[2311046]
			lrwx------ 1 alex alex 64 Dec  8 15:14 /proc/314/fd/33 -> socket:[2311048]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/314/fd/35 -> socket:[2329692]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/314/fd/37 -> socket:[2331506]
			lrwx------ 1 alex alex 64 Dec  8 15:20 /proc/314/fd/40 -> socket:[2331508]
			lrwx------ 1 alex alex 64 Dec  8 15:20 /proc/314/fd/42 -> socket:[2331510]
			lrwx------ 1 alex alex 64 Dec  8 15:17 /proc/314/fd/68 -> socket:[2322083]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4412/fd/20 -> socket:[2335214]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/0 -> socket:[2331505]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/1 -> socket:[2331507]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/2 -> socket:[2331509]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/23 -> socket:[2334514]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/24 -> socket:[2338989]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/26 -> socket:[2338276]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/27 -> socket:[2331500]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/3 -> socket:[2331511]
			lrwx------ 1 alex alex 64 Dec  8 15:22 /proc/4496/fd/31 -> socket:[2338285]`;

const processes: { pid: number; cwd: string; cmd: string }[] = [
	{
		pid: 230,
		cwd: '/mnt/c/WINDOWS/system32',
		cmd: 'dockerserve--addressunix:///home/alex/.docker/run/docker-cli-api.sock',
	},
	{
		pid: 2504,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/out/bootstrap-fork--type=extensionHost--transformURIs--useHostProxy=',
	},
	{
		pid: 2515,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/out/bootstrap-fork--type=watcherService'
	},
	{
		pid: 2526,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: '/bin/bash'
	}, {
		pid: 2719,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node--max-old-space-size=3072/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/node_modules/typescript/lib/tsserver.js--serverModepartialSemantic--useInferredProjectPerProjectRoot--disableAutomaticTypingAcquisition--cancellationPipeName/tmp/vscode-typescript1000/7cfa7171c0c00aacf1ee/tscancellation-602cd80b954818b6a2f7.tmp*--logVerbosityverbose--logFile/home/alex/.vscode-server-insiders/data/logs/20201208T145954/exthost2/vscode.typescript-language-features/tsserver-log-nxBt2m/tsserver.log--globalPluginstypescript-vscode-sh-plugin--pluginProbeLocations/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/typescript-language-features--localeen--noGetErrOnBackgroundUpdate--validateDefaultNpmLocation'
	},
	{
		pid: 2725,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node--max-old-space-size=3072/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/node_modules/typescript/lib/tsserver.js--useInferredProjectPerProjectRoot--enableTelemetry--cancellationPipeName/tmp/vscode-typescript1000/7cfa7171c0c00aacf1ee/tscancellation-04a0b92f880c2fd535ae.tmp*--logVerbosityverbose--logFile/home/alex/.vscode-server-insiders/data/logs/20201208T145954/exthost2/vscode.typescript-language-features/tsserver-log-fqyBrs/tsserver.log--globalPluginstypescript-vscode-sh-plugin--pluginProbeLocations/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/typescript-language-features--localeen--noGetErrOnBackgroundUpdate--validateDefaultNpmLocation'
	},
	{
		pid: 2739,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/node_modules/typescript/lib/typingsInstaller.js--globalTypingsCacheLocation/home/alex/.cache/typescript/4.1--enableTelemetry--logFile/home/alex/.vscode-server-insiders/data/logs/20201208T145954/exthost2/vscode.typescript-language-features/tsserver-log-fqyBrs/ti-2725.log--typesMapLocation/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/node_modules/typescript/lib/typesMap.json--validateDefaultNpmLocation'
	},
	{
		pid: 2795,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/json-language-features/server/dist/node/jsonServerMain--node-ipc--clientProcessId=2504'
	},
	{
		pid: 286,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: 'sh-c\"$VSCODE_WSL_EXT_LOCATION/ scripts / wslServer.sh\" bc13785d3dd99b4b0e9da9aed17bb79809a50804 insider .vscode-server-insiders 0  '
	},
	{
		pid: 287,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: 'sh/mnt/c/Users/alros/.vscode-insiders/extensions/ms-vscode-remote.remote-wsl-0.52.0/scripts/wslServer.shbc13785d3dd99b4b0e9da9aed17bb79809a50804insider.vscode-server-insiders0'
	},
	{
		pid: 3058,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: 'npm'
	},
	{
		pid: 3070,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: 'sh-ctsc -watch -p ./'
	},
	{
		pid: 3071,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: 'node/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample/node_modules/.bin/tsc-watch-p./'
	},
	{
		pid: 312,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: 'sh/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/server.sh--port=0--use-host-proxy--enable-remote-auto-shutdown--print-ip-address'
	},
	{
		pid: 314,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/out/server-main.js--port=0--use-host-proxy--enable-remote-auto-shutdown--print-ip-address'
	},
	{
		pid: 3172,
		cwd: '/home/alex',
		cmd: '/bin/bash'
	},
	{
		pid: 3610,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: '/bin/bash'
	},
	{
		pid: 4412,
		cwd: '/home/alex/repos/Microsoft/vscode-extension-samples/helloworld-sample',
		cmd: 'http-server'
	},
	{
		pid: 4496,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node--inspect-brk=0.0.0.0:6899/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/out/bootstrap-fork--type=extensionHost--transformURIs--useHostProxy='
	},
	{
		pid: 4507,
		cwd: '/mnt/c/Users/alros/AppData/Local/Programs/Microsoft VS Code Insiders',
		cmd: '/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/node/home/alex/.vscode-server-insiders/bin/bc13785d3dd99b4b0e9da9aed17bb79809a50804/extensions/ms-vscode.js-debug/src/hash.bundle.js'
	}
];

const psStdOut =
	`4 S root         1     0  0  80   0 -   596 -       1440   2 14:41 ?        00:00:00 /bin/sh -c echo Container started ; trap "exit 0" 15; while sleep 1 & wait $!; do :; done
4 S root        14     0  0  80   0 -   596 -        764   4 14:41 ?        00:00:00 /bin/sh
4 S root        40     0  0  80   0 -   596 -        700   4 14:41 ?        00:00:00 /bin/sh
4 S root       513   380  0  80   0 -  2476 -       3404   1 14:41 pts/1    00:00:00 sudo npx http-server -p 5000
4 S root       514   513  0  80   0 - 165439 -     41380   5 14:41 pts/1    00:00:00 http-server
0 S root      1052     1  0  80   0 -   573 -        752   5 14:43 ?        00:00:00 sleep 1
0 S node      1056   329  0  80   0 -   596 do_wai   764  10 14:43 ?        00:00:00 /bin/sh -c ps -F -A -l | grep root
0 S node      1058  1056  0  80   0 -   770 pipe_w   888   9 14:43 ?        00:00:00 grep root`;

suite('ExtHostTunnelService', () => {
	ensureNoDisposablesAreLeakedInTestSuite();
	test('getSockets', function () {
		const result = getSockets(procSockets);
		assert.strictEqual(Object.keys(result).length, 75);
		// 4412 is the pid of the http-server in the test data
		assert.notStrictEqual(Object.keys(result).find(key => result[key].pid === 4412), undefined);
	});

	test('loadConnectionTable', function () {
		const result = loadConnectionTable(tcp);
		assert.strictEqual(result.length, 6);
		assert.deepStrictEqual(result[0], {
			10: '1',
			11: '0000000010173312',
			12: '100',
			13: '0',
			14: '0',
			15: '10',
			16: '0',
			inode: '2335214',
			local_address: '00000000:0BBA',
			rem_address: '00000000:0000',
			retrnsmt: '00000000',
			sl: '0:',
			st: '0A',
			timeout: '0',
			tr: '00:00000000',
			tx_queue: '00000000:00000000',
			uid: '1000'
		});
	});

	test('loadListeningPorts', function () {
		const result = loadListeningPorts(tcp, tcp6);
		// There should be 7 based on the input data. One of them should be 3002.
		assert.strictEqual(result.length, 7);
		assert.notStrictEqual(result.find(value => value.port === 3002), undefined);
	});

	test('tryFindRootPorts', function () {
		const rootProcesses = getRootProcesses(psStdOut);
		assert.strictEqual(rootProcesses.length, 6);
		const result = tryFindRootPorts([{ socket: 1000, ip: '127.0.0.1', port: 5000 }], psStdOut, new Map());
		assert.strictEqual(result.size, 1);
		assert.strictEqual(result.get(5000)?.pid, 514);
	});

	test('findPorts', async function () {
		const result = await findPorts(loadListeningPorts(tcp, tcp6), getSockets(procSockets), processes);
		assert.strictEqual(result.length, 1);
		assert.strictEqual(result[0].host, '0.0.0.0');
		assert.strictEqual(result[0].port, 3002);
		assert.strictEqual(result[0].detail, 'http-server');
	});

	test('parseIpAddress', function () {
		assert.strictEqual(parseIpAddress('00000000000000000000000001000000'), '0:0:0:0:0:0:0:1');
		assert.strictEqual(parseIpAddress('0000000000000000FFFF0000040510AC'), '0:0:0:0:0:ffff:ac10:504');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/worker/extensionHostWorker.ts]---
Location: vscode-main/src/vs/workbench/api/worker/extensionHostWorker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMessagePassingProtocol } from '../../../base/parts/ipc/common/ipc.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter } from '../../../base/common/event.js';
import { isMessageOfType, MessageType, createMessageOfType, IExtensionHostInitData } from '../../services/extensions/common/extensionHostProtocol.js';
import { ExtensionHostMain } from '../common/extensionHostMain.js';
import { IHostUtils } from '../common/extHostExtensionService.js';
import { NestedWorker } from '../../services/extensions/worker/polyfillNestedWorker.js';
import * as path from '../../../base/common/path.js';
import * as performance from '../../../base/common/performance.js';

import '../common/extHost.common.services.js';
import './extHost.worker.services.js';
import { FileAccess } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';

//#region --- Define, capture, and override some globals

declare function postMessage(data: any, transferables?: Transferable[]): void;
declare const name: string; // https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/name
declare type _Fetch = typeof fetch;

declare namespace self {
	let close: any;
	let postMessage: any;
	let addEventListener: any;
	let removeEventListener: any;
	let dispatchEvent: any;
	let indexedDB: { open: any;[k: string]: any };
	let caches: { open: any;[k: string]: any };
	let importScripts: any;
	let fetch: _Fetch;
	let XMLHttpRequest: any;
}

const nativeClose = self.close.bind(self);
self.close = () => console.trace(`'close' has been blocked`);

const nativePostMessage = postMessage.bind(self);
self.postMessage = () => console.trace(`'postMessage' has been blocked`);

function shouldTransformUri(uri: string): boolean {
	// In principle, we could convert any URI, but we have concerns
	// that parsing https URIs might end up decoding escape characters
	// and result in an unintended transformation
	return /^(file|vscode-remote):/i.test(uri);
}

const nativeFetch = fetch.bind(self);
function patchFetching(asBrowserUri: (uri: URI) => Promise<URI>) {
	self.fetch = async function (input, init) {
		if (input instanceof Request) {
			// Request object - massage not supported
			return nativeFetch(input, init);
		}
		if (shouldTransformUri(String(input))) {
			input = (await asBrowserUri(URI.parse(String(input)))).toString(true);
		}
		return nativeFetch(input, init);
	};

	self.XMLHttpRequest = class extends XMLHttpRequest {
		override open(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null): void {
			(async () => {
				if (shouldTransformUri(url.toString())) {
					url = (await asBrowserUri(URI.parse(url.toString()))).toString(true);
				}
				super.open(method, url, async ?? true, username, password);
			})();
		}
	};
}

self.importScripts = () => { throw new Error(`'importScripts' has been blocked`); };

// const nativeAddEventListener = addEventListener.bind(self);
self.addEventListener = () => console.trace(`'addEventListener' has been blocked`);

// eslint-disable-next-line local/code-no-any-casts
(<any>self)['AMDLoader'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['NLSLoaderPlugin'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['define'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['require'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['webkitRequestFileSystem'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['webkitRequestFileSystemSync'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['webkitResolveLocalFileSystemSyncURL'] = undefined;
// eslint-disable-next-line local/code-no-any-casts
(<any>self)['webkitResolveLocalFileSystemURL'] = undefined;

// eslint-disable-next-line local/code-no-any-casts
if ((<any>self).Worker) {

	// make sure new Worker(...) always uses blob: (to maintain current origin)
	// eslint-disable-next-line local/code-no-any-casts
	const _Worker = (<any>self).Worker;
	// eslint-disable-next-line local/code-no-any-casts
	Worker = <any>function (stringUrl: string | URL, options?: WorkerOptions) {
		if (/^file:/i.test(stringUrl.toString())) {
			stringUrl = FileAccess.uriToBrowserUri(URI.parse(stringUrl.toString())).toString(true);
		} else if (/^vscode-remote:/i.test(stringUrl.toString())) {
			// Supporting transformation of vscode-remote URIs requires an async call to the main thread,
			// but we cannot do this call from within the embedded Worker, and the only way out would be
			// to use templating instead of a function in the web api (`resourceUriProvider`)
			throw new Error(`Creating workers from remote extensions is currently not supported.`);
		}

		// IMPORTANT: bootstrapFn is stringified and injected as worker blob-url. Because of that it CANNOT
		// have dependencies on other functions or variables. Only constant values are supported. Due to
		// that logic of FileAccess.asBrowserUri had to be copied, see `asWorkerBrowserUrl` (below).
		const bootstrapFnSource = (function bootstrapFn(workerUrl: string) {
			function asWorkerBrowserUrl(url: string | URL | TrustedScriptURL): any {
				if (typeof url === 'string' || url instanceof URL) {
					return String(url).replace(/^file:\/\//i, 'vscode-file://vscode-app');
				}
				return url;
			}

			const nativeFetch = fetch.bind(self);
			self.fetch = function (input, init) {
				if (input instanceof Request) {
					// Request object - massage not supported
					return nativeFetch(input, init);
				}
				return nativeFetch(asWorkerBrowserUrl(input), init);
			};
			self.XMLHttpRequest = class extends XMLHttpRequest {
				override open(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null): void {
					return super.open(method, asWorkerBrowserUrl(url), async ?? true, username, password);
				}
			};
			const nativeImportScripts = importScripts.bind(self);
			self.importScripts = (...urls: string[]) => {
				nativeImportScripts(...urls.map(asWorkerBrowserUrl));
			};

			nativeImportScripts(workerUrl);
		}).toString();

		const js = `(${bootstrapFnSource}('${stringUrl}'))`;
		options = options || {};
		options.name = `${name} -> ${options.name || path.basename(stringUrl.toString())}`;
		const blob = new Blob([js], { type: 'application/javascript' });
		const blobUrl = URL.createObjectURL(blob);
		return new _Worker(blobUrl, options);
	};

} else {
	// eslint-disable-next-line local/code-no-any-casts
	(<any>self).Worker = class extends NestedWorker {
		constructor(stringOrUrl: string | URL, options?: WorkerOptions) {
			super(nativePostMessage, stringOrUrl, { name: path.basename(stringOrUrl.toString()), ...options });
		}
	};
}

//#endregion ---

const hostUtil = new class implements IHostUtils {
	declare readonly _serviceBrand: undefined;
	public readonly pid = undefined;
	exit(_code?: number | undefined): void {
		nativeClose();
	}
};


class ExtensionWorker {

	// protocol
	readonly protocol: IMessagePassingProtocol;

	constructor() {

		const channel = new MessageChannel();
		const emitter = new Emitter<VSBuffer>();
		let terminating = false;

		// send over port2, keep port1
		nativePostMessage(channel.port2, [channel.port2]);

		channel.port1.onmessage = event => {
			const { data } = event;
			if (!(data instanceof ArrayBuffer)) {
				console.warn('UNKNOWN data received', data);
				return;
			}

			const msg = VSBuffer.wrap(new Uint8Array(data, 0, data.byteLength));
			if (isMessageOfType(msg, MessageType.Terminate)) {
				// handle terminate-message right here
				terminating = true;
				onTerminate('received terminate message from renderer');
				return;
			}

			// emit non-terminate messages to the outside
			emitter.fire(msg);
		};

		this.protocol = {
			onMessage: emitter.event,
			send: vsbuf => {
				if (!terminating) {
					const data = vsbuf.buffer.buffer.slice(vsbuf.buffer.byteOffset, vsbuf.buffer.byteOffset + vsbuf.buffer.byteLength);
					channel.port1.postMessage(data, [data]);
				}
			}
		};
	}
}

interface IRendererConnection {
	protocol: IMessagePassingProtocol;
	initData: IExtensionHostInitData;
}
function connectToRenderer(protocol: IMessagePassingProtocol): Promise<IRendererConnection> {
	return new Promise<IRendererConnection>(resolve => {
		const once = protocol.onMessage(raw => {
			once.dispose();
			const initData = <IExtensionHostInitData>JSON.parse(raw.toString());
			protocol.send(createMessageOfType(MessageType.Initialized));
			resolve({ protocol, initData });
		});
		protocol.send(createMessageOfType(MessageType.Ready));
	});
}

let onTerminate = (reason: string) => nativeClose();

interface IInitMessage {
	readonly type: 'vscode.init';
	readonly data: ReadonlyMap<string, MessagePort>;
}

function isInitMessage(a: any): a is IInitMessage {
	return !!a && typeof a === 'object' && a.type === 'vscode.init' && a.data instanceof Map;
}

export function create(): { onmessage: (message: any) => void } {
	performance.mark(`code/extHost/willConnectToRenderer`);
	const res = new ExtensionWorker();

	return {
		onmessage(message: any) {
			if (!isInitMessage(message)) {
				return; // silently ignore foreign messages
			}

			connectToRenderer(res.protocol).then(data => {
				performance.mark(`code/extHost/didWaitForInitData`);
				const extHostMain = new ExtensionHostMain(
					data.protocol,
					data.initData,
					hostUtil,
					null,
					message.data
				);

				patchFetching(uri => extHostMain.asBrowserUri(uri));

				onTerminate = (reason: string) => extHostMain.terminate(reason);
			});
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/worker/extensionHostWorkerMain.ts]---
Location: vscode-main/src/vs/workbench/api/worker/extensionHostWorkerMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { create } from './extensionHostWorker.js';

const data = create();
self.onmessage = (e) => data.onmessage(e.data);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/worker/extHost.worker.services.ts]---
Location: vscode-main/src/vs/workbench/api/worker/extHost.worker.services.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SyncDescriptor } from '../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostAuthentication, IExtHostAuthentication } from '../common/extHostAuthentication.js';
import { IExtHostExtensionService } from '../common/extHostExtensionService.js';
import { ExtHostLogService } from '../common/extHostLogService.js';
import { ExtensionStoragePaths, IExtensionStoragePaths } from '../common/extHostStoragePaths.js';
import { ExtHostTelemetry, IExtHostTelemetry } from '../common/extHostTelemetry.js';
import { ExtHostExtensionService } from './extHostExtensionService.js';

// #########################################################################
// ###                                                                   ###
// ### !!! PLEASE ADD COMMON IMPORTS INTO extHost.common.services.ts !!! ###
// ###                                                                   ###
// #########################################################################

registerSingleton(ILogService, new SyncDescriptor(ExtHostLogService, [true], true));
registerSingleton(IExtHostAuthentication, ExtHostAuthentication, InstantiationType.Eager);
registerSingleton(IExtHostExtensionService, ExtHostExtensionService, InstantiationType.Eager);
registerSingleton(IExtensionStoragePaths, ExtensionStoragePaths, InstantiationType.Eager);
registerSingleton(IExtHostTelemetry, new SyncDescriptor(ExtHostTelemetry, [true], true));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/worker/extHostConsoleForwarder.ts]---
Location: vscode-main/src/vs/workbench/api/worker/extHostConsoleForwarder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractExtHostConsoleForwarder } from '../common/extHostConsoleForwarder.js';
import { IExtHostInitDataService } from '../common/extHostInitDataService.js';
import { IExtHostRpcService } from '../common/extHostRpcService.js';

export class ExtHostConsoleForwarder extends AbstractExtHostConsoleForwarder {

	constructor(
		@IExtHostRpcService extHostRpc: IExtHostRpcService,
		@IExtHostInitDataService initData: IExtHostInitDataService,
	) {
		super(extHostRpc, initData);
	}

	protected override _nativeConsoleLogMessage(_method: unknown, original: (...args: any[]) => void, args: IArguments) {
		// eslint-disable-next-line local/code-no-any-casts
		original.apply(console, args as any);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/worker/extHostExtensionService.ts]---
Location: vscode-main/src/vs/workbench/api/worker/extHostExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createApiFactoryAndRegisterActors } from '../common/extHost.api.impl.js';
import { ExtensionActivationTimesBuilder } from '../common/extHostExtensionActivator.js';
import { AbstractExtHostExtensionService } from '../common/extHostExtensionService.js';
import { URI } from '../../../base/common/uri.js';
import { RequireInterceptor } from '../common/extHostRequireInterceptor.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ExtensionRuntime } from '../common/extHostTypes.js';
import { timeout } from '../../../base/common/async.js';
import { ExtHostConsoleForwarder } from './extHostConsoleForwarder.js';
import { extname } from '../../../base/common/path.js';

class WorkerRequireInterceptor extends RequireInterceptor {

	protected _installInterceptor() { }

	getModule(request: string, parent: URI): undefined | any {
		for (const alternativeModuleName of this._alternatives) {
			const alternative = alternativeModuleName(request);
			if (alternative) {
				request = alternative;
				break;
			}
		}

		if (this._factories.has(request)) {
			return this._factories.get(request)!.load(request, parent, () => { throw new Error('CANNOT LOAD MODULE from here.'); });
		}
		return undefined;
	}
}

export class ExtHostExtensionService extends AbstractExtHostExtensionService {
	readonly extensionRuntime = ExtensionRuntime.Webworker;

	private _fakeModules?: WorkerRequireInterceptor;

	protected async _beforeAlmostReadyToRunExtensions(): Promise<void> {
		// make sure console.log calls make it to the render
		this._instaService.createInstance(ExtHostConsoleForwarder);

		// initialize API and register actors
		const apiFactory = this._instaService.invokeFunction(createApiFactoryAndRegisterActors);
		this._fakeModules = this._instaService.createInstance(WorkerRequireInterceptor, apiFactory, { mine: this._myRegistry, all: this._globalRegistry });
		await this._fakeModules.install();
		performance.mark('code/extHost/didInitAPI');

		await this._waitForDebuggerAttachment();
	}

	protected _getEntryPoint(extensionDescription: IExtensionDescription): string | undefined {
		return extensionDescription.browser;
	}

	protected async _loadCommonJSModule<T extends object | undefined>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		module = module.with({ path: ensureSuffix(module.path, '.js') });
		const extensionId = extension?.identifier.value;
		if (extensionId) {
			performance.mark(`code/extHost/willFetchExtensionCode/${extensionId}`);
		}

		// First resolve the extension entry point URI to something we can load using `fetch`
		// This needs to be done on the main thread due to a potential `resourceUriProvider` (workbench api)
		// which is only available in the main thread
		const browserUri = URI.revive(await this._mainThreadExtensionsProxy.$asBrowserUri(module));
		const response = await fetch(browserUri.toString(true));
		if (extensionId) {
			performance.mark(`code/extHost/didFetchExtensionCode/${extensionId}`);
		}

		if (response.status !== 200) {
			throw new Error(response.statusText);
		}

		// fetch JS sources as text and create a new function around it
		const source = await response.text();
		// Here we append #vscode-extension to serve as a marker, such that source maps
		// can be adjusted for the extra wrapping function.
		const sourceURL = `${module.toString(true)}#vscode-extension`;
		const fullSource = `${source}\n//# sourceURL=${sourceURL}`;
		let initFn: Function;
		try {
			initFn = new Function('module', 'exports', 'require', fullSource); // CodeQL [SM01632] js/eval-call there is no alternative until we move to ESM
		} catch (err) {
			if (extensionId) {
				console.error(`Loading code for extension ${extensionId} failed: ${err.message}`);
			} else {
				console.error(`Loading code failed: ${err.message}`);
			}
			console.error(`${module.toString(true)}${typeof err.line === 'number' ? ` line ${err.line}` : ''}${typeof err.column === 'number' ? ` column ${err.column}` : ''}`);
			console.error(err);
			throw err;
		}

		if (extension) {
			await this._extHostLocalizationService.initializeLocalizedMessages(extension);
		}

		// define commonjs globals: `module`, `exports`, and `require`
		const _exports = {};
		const _module = { exports: _exports };
		const _require = (request: string) => {
			const result = this._fakeModules!.getModule(request, module);
			if (result === undefined) {
				throw new Error(`Cannot load module '${request}'`);
			}
			return result;
		};

		try {
			activationTimesBuilder.codeLoadingStart();
			if (extensionId) {
				performance.mark(`code/extHost/willLoadExtensionCode/${extensionId}`);
			}
			initFn(_module, _exports, _require);
			return <T>(_module.exports !== _exports ? _module.exports : _exports);
		} finally {
			if (extensionId) {
				performance.mark(`code/extHost/didLoadExtensionCode/${extensionId}`);
			}
			activationTimesBuilder.codeLoadingStop();
		}
	}

	protected override _loadESMModule<T>(extension: IExtensionDescription | null, module: URI, activationTimesBuilder: ExtensionActivationTimesBuilder): Promise<T> {
		throw new Error('ESM modules are not supported in the web worker extension host');
	}

	async $setRemoteEnvironment(_env: { [key: string]: string | null }): Promise<void> {
		return;
	}

	private async _waitForDebuggerAttachment(waitTimeout = 5000) {
		// debugger attaches async, waiting for it fixes #106698 and #99222
		if (!this._initData.environment.isExtensionDevelopmentDebug) {
			return;
		}

		const deadline = Date.now() + waitTimeout;
		while (Date.now() < deadline && !('__jsDebugIsReady' in globalThis)) {
			await timeout(10);
		}
	}
}

function ensureSuffix(path: string, suffix: string): string {
	const extName = extname(path);
	return extName ? path : path + suffix;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/codeeditor.ts]---
Location: vscode-main/src/vs/workbench/browser/codeeditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../base/common/actions.js';
import { Emitter } from '../../base/common/event.js';
import { Disposable, DisposableStore } from '../../base/common/lifecycle.js';
import { isEqual } from '../../base/common/resources.js';
import { URI } from '../../base/common/uri.js';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, OverlayWidgetPositionPreference, isCodeEditor, isCompositeEditor } from '../../editor/browser/editorBrowser.js';
import { EmbeddedCodeEditorWidget } from '../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { EditorOption } from '../../editor/common/config/editorOptions.js';
import { IRange } from '../../editor/common/core/range.js';
import { CursorChangeReason, ICursorPositionChangedEvent } from '../../editor/common/cursorEvents.js';
import { IEditorContribution } from '../../editor/common/editorCommon.js';
import { IModelDecorationsChangeAccessor, TrackedRangeStickiness } from '../../editor/common/model.js';
import { ModelDecorationOptions } from '../../editor/common/model/textModel.js';
import { AbstractFloatingClickMenu, FloatingClickWidget } from '../../platform/actions/browser/floatingMenu.js';
import { IMenuService, MenuId } from '../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../platform/keybinding/common/keybinding.js';
import { IEditorService } from '../services/editor/common/editorService.js';

export interface IRangeHighlightDecoration {
	resource: URI;
	range: IRange;
	isWholeLine?: boolean;
}

export class RangeHighlightDecorations extends Disposable {

	private readonly _onHighlightRemoved = this._register(new Emitter<void>());
	readonly onHighlightRemoved = this._onHighlightRemoved.event;

	private rangeHighlightDecorationId: string | null = null;
	private editor: ICodeEditor | null = null;
	private readonly editorDisposables = this._register(new DisposableStore());

	constructor(@IEditorService private readonly editorService: IEditorService) {
		super();
	}

	removeHighlightRange() {
		if (this.editor && this.rangeHighlightDecorationId) {
			const decorationId = this.rangeHighlightDecorationId;
			this.editor.changeDecorations((accessor) => {
				accessor.removeDecoration(decorationId);
			});
			this._onHighlightRemoved.fire();
		}

		this.rangeHighlightDecorationId = null;
	}

	highlightRange(range: IRangeHighlightDecoration, editor?: unknown) {
		editor = editor ?? this.getEditor(range);
		if (isCodeEditor(editor)) {
			this.doHighlightRange(editor, range);
		} else if (isCompositeEditor(editor) && isCodeEditor(editor.activeCodeEditor)) {
			this.doHighlightRange(editor.activeCodeEditor, range);
		}
	}

	private doHighlightRange(editor: ICodeEditor, selectionRange: IRangeHighlightDecoration) {
		this.removeHighlightRange();

		editor.changeDecorations((changeAccessor: IModelDecorationsChangeAccessor) => {
			this.rangeHighlightDecorationId = changeAccessor.addDecoration(selectionRange.range, this.createRangeHighlightDecoration(selectionRange.isWholeLine));
		});

		this.setEditor(editor);
	}

	private getEditor(resourceRange: IRangeHighlightDecoration): ICodeEditor | undefined {
		const resource = this.editorService.activeEditor?.resource;
		if (resource && isEqual(resource, resourceRange.resource) && isCodeEditor(this.editorService.activeTextEditorControl)) {
			return this.editorService.activeTextEditorControl;
		}

		return undefined;
	}

	private setEditor(editor: ICodeEditor) {
		if (this.editor !== editor) {
			this.editorDisposables.clear();
			this.editor = editor;
			this.editorDisposables.add(this.editor.onDidChangeCursorPosition((e: ICursorPositionChangedEvent) => {
				if (
					e.reason === CursorChangeReason.NotSet
					|| e.reason === CursorChangeReason.Explicit
					|| e.reason === CursorChangeReason.Undo
					|| e.reason === CursorChangeReason.Redo
				) {
					this.removeHighlightRange();
				}
			}));
			this.editorDisposables.add(this.editor.onDidChangeModel(() => { this.removeHighlightRange(); }));
			this.editorDisposables.add(this.editor.onDidDispose(() => {
				this.removeHighlightRange();
				this.editor = null;
			}));
		}
	}

	private static readonly _WHOLE_LINE_RANGE_HIGHLIGHT = ModelDecorationOptions.register({
		description: 'codeeditor-range-highlight-whole',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'rangeHighlight',
		isWholeLine: true
	});

	private static readonly _RANGE_HIGHLIGHT = ModelDecorationOptions.register({
		description: 'codeeditor-range-highlight',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		className: 'rangeHighlight'
	});

	private createRangeHighlightDecoration(isWholeLine: boolean = true): ModelDecorationOptions {
		return (isWholeLine ? RangeHighlightDecorations._WHOLE_LINE_RANGE_HIGHLIGHT : RangeHighlightDecorations._RANGE_HIGHLIGHT);
	}

	override dispose() {
		super.dispose();

		if (this.editor?.getModel()) {
			this.removeHighlightRange();
			this.editor = null;
		}
	}
}

export class FloatingEditorClickWidget extends FloatingClickWidget implements IOverlayWidget {

	constructor(
		private editor: ICodeEditor,
		label: string,
		keyBindingAction: string | null,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super(
			keyBindingAction && keybindingService.lookupKeybinding(keyBindingAction)
				? `${label} (${keybindingService.lookupKeybinding(keyBindingAction)!.getLabel()})`
				: label
		);
	}

	getId(): string {
		return 'editor.overlayWidget.floatingClickWidget';
	}

	getPosition(): IOverlayWidgetPosition {
		return {
			preference: OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
		};
	}

	override render() {
		super.render();
		this.editor.addOverlayWidget(this);
	}

	override dispose(): void {
		this.editor.removeOverlayWidget(this);
		super.dispose();
	}

}

export class FloatingEditorClickMenu extends AbstractFloatingClickMenu implements IEditorContribution {
	static readonly ID = 'editor.contrib.floatingClickMenu';

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super(MenuId.EditorContent, menuService, contextKeyService);
		this.render();
	}

	protected override createWidget(action: IAction): FloatingClickWidget {
		return this.instantiationService.createInstance(FloatingEditorClickWidget, this.editor, action.label, action.id);
	}

	protected override isVisible() {
		return !(this.editor instanceof EmbeddedCodeEditorWidget) && this.editor?.hasModel() && !this.editor.getOption(EditorOption.inDiffEditor);
	}

	protected override getActionArg(): unknown {
		return this.editor.getModel()?.uri;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/composite.ts]---
Location: vscode-main/src/vs/workbench/browser/composite.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction, IActionRunner, ActionRunner } from '../../base/common/actions.js';
import { Component } from '../common/component.js';
import { ITelemetryService } from '../../platform/telemetry/common/telemetry.js';
import { IComposite, ICompositeControl } from '../common/composite.js';
import { Event, Emitter } from '../../base/common/event.js';
import { IThemeService } from '../../platform/theme/common/themeService.js';
import { IConstructorSignature, IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { trackFocus, Dimension, IDomPosition } from '../../base/browser/dom.js';
import { IStorageService } from '../../platform/storage/common/storage.js';
import { Disposable } from '../../base/common/lifecycle.js';
import { assertReturnsDefined } from '../../base/common/types.js';
import { IActionViewItem } from '../../base/browser/ui/actionbar/actionbar.js';
import { MenuId } from '../../platform/actions/common/actions.js';
import { IBoundarySashes } from '../../base/browser/ui/sash/sash.js';
import { IBaseActionViewItemOptions } from '../../base/browser/ui/actionbar/actionViewItems.js';

/**
 * Composites are layed out in the sidebar and panel part of the workbench. At a time only one composite
 * can be open in the sidebar, and only one composite can be open in the panel.
 *
 * Each composite has a minimized representation that is good enough to provide some
 * information about the state of the composite data.
 *
 * The workbench will keep a composite alive after it has been created and show/hide it based on
 * user interaction. The lifecycle of a composite goes in the order create(), setVisible(true|false),
 * layout(), focus(), dispose(). During use of the workbench, a composite will often receive a setVisible,
 * layout and focus call, but only one create and dispose call.
 */
export abstract class Composite<MementoType extends object = object> extends Component<MementoType> implements IComposite {

	private readonly _onTitleAreaUpdate = this._register(new Emitter<void>());
	readonly onTitleAreaUpdate = this._onTitleAreaUpdate.event;

	protected _onDidFocus: Emitter<void> | undefined;
	get onDidFocus(): Event<void> {
		if (!this._onDidFocus) {
			this._onDidFocus = this.registerFocusTrackEvents().onDidFocus;
		}

		return this._onDidFocus.event;
	}

	private _onDidBlur: Emitter<void> | undefined;
	get onDidBlur(): Event<void> {
		if (!this._onDidBlur) {
			this._onDidBlur = this.registerFocusTrackEvents().onDidBlur;
		}

		return this._onDidBlur.event;
	}

	private _hasFocus = false;
	hasFocus(): boolean {
		return this._hasFocus;
	}

	private registerFocusTrackEvents(): { onDidFocus: Emitter<void>; onDidBlur: Emitter<void> } {
		const container = assertReturnsDefined(this.getContainer());
		const focusTracker = this._register(trackFocus(container));

		const onDidFocus = this._onDidFocus = this._register(new Emitter<void>());
		this._register(focusTracker.onDidFocus(() => {
			this._hasFocus = true;

			onDidFocus.fire();
		}));

		const onDidBlur = this._onDidBlur = this._register(new Emitter<void>());
		this._register(focusTracker.onDidBlur(() => {
			this._hasFocus = false;

			onDidBlur.fire();
		}));

		return { onDidFocus, onDidBlur };
	}

	protected actionRunner: IActionRunner | undefined;

	private visible = false;
	private parent: HTMLElement | undefined;

	constructor(
		id: string,
		protected readonly telemetryService: ITelemetryService,
		themeService: IThemeService,
		storageService: IStorageService
	) {
		super(id, themeService, storageService);
	}

	getTitle(): string | undefined {
		return undefined;
	}

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Called to create this composite on the provided parent. This method is only
	 * called once during the lifetime of the workbench.
	 * Note that DOM-dependent calculations should be performed from the setVisible()
	 * call. Only then the composite will be part of the DOM.
	 */
	create(parent: HTMLElement): void {
		this.parent = parent;
	}

	/**
	 * Returns the container this composite is being build in.
	 */
	getContainer(): HTMLElement | undefined {
		return this.parent;
	}

	/**
	 * Note: Clients should not call this method, the workbench calls this
	 * method. Calling it otherwise may result in unexpected behavior.
	 *
	 * Called to indicate that the composite has become visible or hidden. This method
	 * is called more than once during workbench lifecycle depending on the user interaction.
	 * The composite will be on-DOM if visible is set to true and off-DOM otherwise.
	 *
	 * Typically this operation should be fast though because setVisible might be called many times during a session.
	 * If there is a long running operation it is fine to have it running in the background asyncly and return before.
	 */
	setVisible(visible: boolean): void {
		if (this.visible !== !!visible) {
			this.visible = visible;
		}
	}

	/**
	 * Called when this composite should receive keyboard focus.
	 */
	focus(): void {
		// Subclasses can implement
	}

	/**
	 * Layout the contents of this composite using the provided dimensions.
	 */
	abstract layout(dimension: Dimension, position?: IDomPosition): void;

	/**
	 * Set boundary sashes for this composite. These are used to create
	 * draggable corner areas with inner sashes.
	 */
	abstract setBoundarySashes(sashes: IBoundarySashes): void;

	/**
	 *
	 * @returns the action runner for this composite
	 */
	getMenuIds(): readonly MenuId[] {
		return [];
	}

	/**
	 * Returns an array of actions to show in the action bar of the composite.
	 */
	getActions(): readonly IAction[] {
		return [];
	}

	/**
	 * Returns an array of actions to show in the action bar of the composite
	 * in a less prominent way then action from getActions.
	 */
	getSecondaryActions(): readonly IAction[] {
		return [];
	}

	/**
	 * Returns an array of actions to show in the context menu of the composite
	 */
	getContextMenuActions(): readonly IAction[] {
		return [];
	}

	/**
	 * For any of the actions returned by this composite, provide an IActionViewItem in
	 * cases where the implementor of the composite wants to override the presentation
	 * of an action. Returns undefined to indicate that the action is not rendered through
	 * an action item.
	 */
	getActionViewItem(action: IAction, options: IBaseActionViewItemOptions): IActionViewItem | undefined {
		return undefined;
	}

	/**
	 * Provide a context to be passed to the toolbar.
	 */
	getActionsContext(): unknown {
		return null;
	}

	/**
	 * Returns the instance of IActionRunner to use with this composite for the
	 * composite tool bar.
	 */
	getActionRunner(): IActionRunner {
		if (!this.actionRunner) {
			this.actionRunner = this._register(new ActionRunner());
		}

		return this.actionRunner;
	}

	/**
	 * Method for composite implementors to indicate to the composite container that the title or the actions
	 * of the composite have changed. Calling this method will cause the container to ask for title (getTitle())
	 * and actions (getActions(), getSecondaryActions()) if the composite is visible or the next time the composite
	 * gets visible.
	 */
	protected updateTitleArea(): void {
		this._onTitleAreaUpdate.fire();
	}

	/**
	 * Returns true if this composite is currently visible and false otherwise.
	 */
	isVisible(): boolean {
		return this.visible;
	}

	/**
	 * Returns the underlying composite control or `undefined` if it is not accessible.
	 */
	getControl(): ICompositeControl | undefined {
		return undefined;
	}
}

/**
 * A composite descriptor is a lightweight descriptor of a composite in the workbench.
 */
export abstract class CompositeDescriptor<T extends Composite> {

	constructor(
		private readonly ctor: IConstructorSignature<T>,
		readonly id: string,
		readonly name: string,
		readonly cssClass?: string,
		readonly order?: number,
		readonly requestedIndex?: number,
	) { }

	instantiate(instantiationService: IInstantiationService): T {
		return instantiationService.createInstance(this.ctor);
	}
}

export abstract class CompositeRegistry<T extends Composite> extends Disposable {

	private readonly _onDidRegister = this._register(new Emitter<CompositeDescriptor<T>>());
	readonly onDidRegister = this._onDidRegister.event;

	private readonly _onDidDeregister = this._register(new Emitter<CompositeDescriptor<T>>());
	readonly onDidDeregister = this._onDidDeregister.event;

	private readonly composites: CompositeDescriptor<T>[] = [];

	protected registerComposite(descriptor: CompositeDescriptor<T>): void {
		if (this.compositeById(descriptor.id)) {
			return;
		}

		this.composites.push(descriptor);
		this._onDidRegister.fire(descriptor);
	}

	protected deregisterComposite(id: string): void {
		const descriptor = this.compositeById(id);
		if (!descriptor) {
			return;
		}

		this.composites.splice(this.composites.indexOf(descriptor), 1);
		this._onDidDeregister.fire(descriptor);
	}

	getComposite(id: string): CompositeDescriptor<T> | undefined {
		return this.compositeById(id);
	}

	protected getComposites(): CompositeDescriptor<T>[] {
		return this.composites.slice(0);
	}

	private compositeById(id: string): CompositeDescriptor<T> | undefined {
		return this.composites.find(composite => composite.id === id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/contextkeys.ts]---
Location: vscode-main/src/vs/workbench/browser/contextkeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../base/common/lifecycle.js';
import { IContextKeyService, IContextKey, setConstant as setConstantContextKey } from '../../platform/contextkey/common/contextkey.js';
import { IsMacContext, IsLinuxContext, IsWindowsContext, IsWebContext, IsMacNativeContext, IsDevelopmentContext, IsIOSContext, ProductQualityContext, IsMobileContext } from '../../platform/contextkey/common/contextkeys.js';
import { SplitEditorsVertically, InEditorZenModeContext, AuxiliaryBarVisibleContext, SideBarVisibleContext, PanelAlignmentContext, PanelMaximizedContext, PanelVisibleContext, EmbedderIdentifierContext, EditorTabsVisibleContext, IsMainEditorCenteredLayoutContext, MainEditorAreaVisibleContext, DirtyWorkingCopiesContext, EmptyWorkspaceSupportContext, EnterMultiRootWorkspaceSupportContext, HasWebFileSystemAccess, IsMainWindowFullscreenContext, OpenFolderWorkspaceSupportContext, RemoteNameContext, VirtualWorkspaceContext, WorkbenchStateContext, WorkspaceFolderCountContext, PanelPositionContext, TemporaryWorkspaceContext, TitleBarVisibleContext, TitleBarStyleContext, IsAuxiliaryWindowFocusedContext, ActiveEditorGroupEmptyContext, ActiveEditorGroupIndexContext, ActiveEditorGroupLastContext, ActiveEditorGroupLockedContext, MultipleEditorGroupsContext, EditorsVisibleContext, AuxiliaryBarMaximizedContext, InAutomationContext } from '../common/contextkeys.js';
import { preferredSideBySideGroupDirection, GroupDirection, IEditorGroupsService } from '../services/editor/common/editorGroupsService.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IWorkbenchEnvironmentService } from '../services/environment/common/environmentService.js';
import { WorkbenchState, IWorkspaceContextService, isTemporaryWorkspace } from '../../platform/workspace/common/workspace.js';
import { IWorkbenchLayoutService, Parts, positionToString } from '../services/layout/browser/layoutService.js';
import { getRemoteName } from '../../platform/remote/common/remoteHosts.js';
import { getVirtualWorkspaceScheme } from '../../platform/workspace/common/virtualWorkspace.js';
import { IWorkingCopyService } from '../services/workingCopy/common/workingCopyService.js';
import { isNative } from '../../base/common/platform.js';
import { IPaneCompositePartService } from '../services/panecomposite/browser/panecomposite.js';
import { WebFileSystemAccess } from '../../platform/files/browser/webFileSystemAccess.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { getTitleBarStyle } from '../../platform/window/common/window.js';
import { mainWindow } from '../../base/browser/window.js';
import { isFullscreen, onDidChangeFullscreen } from '../../base/browser/browser.js';
import { IEditorService } from '../services/editor/common/editorService.js';

export class WorkbenchContextKeysHandler extends Disposable {

	private dirtyWorkingCopiesContext: IContextKey<boolean>;

	private activeEditorGroupEmpty: IContextKey<boolean>;
	private activeEditorGroupIndex: IContextKey<number>;
	private activeEditorGroupLast: IContextKey<boolean>;
	private activeEditorGroupLocked: IContextKey<boolean>;
	private multipleEditorGroupsContext: IContextKey<boolean>;

	private editorsVisibleContext: IContextKey<boolean>;

	private splitEditorsVerticallyContext: IContextKey<boolean>;

	private workbenchStateContext: IContextKey<string>;
	private workspaceFolderCountContext: IContextKey<number>;

	private openFolderWorkspaceSupportContext: IContextKey<boolean>;
	private enterMultiRootWorkspaceSupportContext: IContextKey<boolean>;
	private emptyWorkspaceSupportContext: IContextKey<boolean>;

	private virtualWorkspaceContext: IContextKey<string>;
	private temporaryWorkspaceContext: IContextKey<boolean>;
	private inAutomationContext: IContextKey<boolean>;

	private inZenModeContext: IContextKey<boolean>;
	private isMainWindowFullscreenContext: IContextKey<boolean>;
	private isAuxiliaryWindowFocusedContext: IContextKey<boolean>;
	private isMainEditorCenteredLayoutContext: IContextKey<boolean>;
	private sideBarVisibleContext: IContextKey<boolean>;
	private mainEditorAreaVisibleContext: IContextKey<boolean>;
	private panelPositionContext: IContextKey<string>;
	private panelVisibleContext: IContextKey<boolean>;
	private panelAlignmentContext: IContextKey<string>;
	private panelMaximizedContext: IContextKey<boolean>;
	private auxiliaryBarVisibleContext: IContextKey<boolean>;
	private auxiliaryBarMaximizedContext: IContextKey<boolean>;
	private editorTabsVisibleContext: IContextKey<boolean>;
	private titleAreaVisibleContext: IContextKey<boolean>;
	private titleBarStyleContext: IContextKey<string>;

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IProductService private readonly productService: IProductService,
		@IEditorGroupsService private readonly editorGroupService: IEditorGroupsService,
		@IEditorService private readonly editorService: IEditorService,
		@IWorkbenchLayoutService private readonly layoutService: IWorkbenchLayoutService,
		@IPaneCompositePartService private readonly paneCompositeService: IPaneCompositePartService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
	) {
		super();

		// Platform
		IsMacContext.bindTo(this.contextKeyService);
		IsLinuxContext.bindTo(this.contextKeyService);
		IsWindowsContext.bindTo(this.contextKeyService);

		IsWebContext.bindTo(this.contextKeyService);
		IsMacNativeContext.bindTo(this.contextKeyService);
		IsIOSContext.bindTo(this.contextKeyService);
		IsMobileContext.bindTo(this.contextKeyService);

		RemoteNameContext.bindTo(this.contextKeyService).set(getRemoteName(this.environmentService.remoteAuthority) || '');

		this.virtualWorkspaceContext = VirtualWorkspaceContext.bindTo(this.contextKeyService);
		this.temporaryWorkspaceContext = TemporaryWorkspaceContext.bindTo(this.contextKeyService);
		this.updateWorkspaceContextKeys();

		// Capabilities
		HasWebFileSystemAccess.bindTo(this.contextKeyService).set(WebFileSystemAccess.supported(mainWindow));

		// Development
		const isDevelopment = !this.environmentService.isBuilt || this.environmentService.isExtensionDevelopment;
		IsDevelopmentContext.bindTo(this.contextKeyService).set(isDevelopment);
		setConstantContextKey(IsDevelopmentContext.key, isDevelopment);

		// Product Service
		ProductQualityContext.bindTo(this.contextKeyService).set(this.productService.quality || '');
		EmbedderIdentifierContext.bindTo(this.contextKeyService).set(productService.embedderIdentifier);

		// Automation
		this.inAutomationContext = InAutomationContext.bindTo(this.contextKeyService);
		this.inAutomationContext.set(!!this.environmentService.enableSmokeTestDriver);

		// Editor Groups
		this.activeEditorGroupEmpty = ActiveEditorGroupEmptyContext.bindTo(this.contextKeyService);
		this.activeEditorGroupIndex = ActiveEditorGroupIndexContext.bindTo(this.contextKeyService);
		this.activeEditorGroupLast = ActiveEditorGroupLastContext.bindTo(this.contextKeyService);
		this.activeEditorGroupLocked = ActiveEditorGroupLockedContext.bindTo(this.contextKeyService);
		this.multipleEditorGroupsContext = MultipleEditorGroupsContext.bindTo(this.contextKeyService);

		// Editors
		this.editorsVisibleContext = EditorsVisibleContext.bindTo(this.contextKeyService);

		// Working Copies
		this.dirtyWorkingCopiesContext = DirtyWorkingCopiesContext.bindTo(this.contextKeyService);
		this.dirtyWorkingCopiesContext.set(this.workingCopyService.hasDirty);

		// Workbench State
		this.workbenchStateContext = WorkbenchStateContext.bindTo(this.contextKeyService);
		this.updateWorkbenchStateContextKey();

		// Workspace Folder Count
		this.workspaceFolderCountContext = WorkspaceFolderCountContext.bindTo(this.contextKeyService);
		this.updateWorkspaceFolderCountContextKey();

		// Opening folder support: support for opening a folder workspace
		// (e.g. "Open Folder...") is limited in web when not connected
		// to a remote.
		this.openFolderWorkspaceSupportContext = OpenFolderWorkspaceSupportContext.bindTo(this.contextKeyService);
		this.openFolderWorkspaceSupportContext.set(isNative || typeof this.environmentService.remoteAuthority === 'string');

		// Empty workspace support: empty workspaces require built-in file system
		// providers to be available that allow to enter a workspace or open loose
		// files. This condition is met:
		// - desktop: always
		// -     web: only when connected to a remote
		this.emptyWorkspaceSupportContext = EmptyWorkspaceSupportContext.bindTo(this.contextKeyService);
		this.emptyWorkspaceSupportContext.set(isNative || typeof this.environmentService.remoteAuthority === 'string');

		// Entering a multi root workspace support: support for entering a multi-root
		// workspace (e.g. "Open Workspace from File...", "Duplicate Workspace", "Save Workspace")
		// is driven by the ability to resolve a workspace configuration file (*.code-workspace)
		// with a built-in file system provider.
		// This condition is met:
		// - desktop: always
		// -     web: only when connected to a remote
		this.enterMultiRootWorkspaceSupportContext = EnterMultiRootWorkspaceSupportContext.bindTo(this.contextKeyService);
		this.enterMultiRootWorkspaceSupportContext.set(isNative || typeof this.environmentService.remoteAuthority === 'string');

		// Editor Layout
		this.splitEditorsVerticallyContext = SplitEditorsVertically.bindTo(this.contextKeyService);
		this.updateSplitEditorsVerticallyContext();

		// Window
		this.isMainWindowFullscreenContext = IsMainWindowFullscreenContext.bindTo(this.contextKeyService);
		this.isAuxiliaryWindowFocusedContext = IsAuxiliaryWindowFocusedContext.bindTo(this.contextKeyService);

		// Zen Mode
		this.inZenModeContext = InEditorZenModeContext.bindTo(this.contextKeyService);

		// Centered Layout (Main Editor)
		this.isMainEditorCenteredLayoutContext = IsMainEditorCenteredLayoutContext.bindTo(this.contextKeyService);

		// Editor Area
		this.mainEditorAreaVisibleContext = MainEditorAreaVisibleContext.bindTo(this.contextKeyService);
		this.editorTabsVisibleContext = EditorTabsVisibleContext.bindTo(this.contextKeyService);

		// Sidebar
		this.sideBarVisibleContext = SideBarVisibleContext.bindTo(this.contextKeyService);

		// Title Bar
		this.titleAreaVisibleContext = TitleBarVisibleContext.bindTo(this.contextKeyService);
		this.titleBarStyleContext = TitleBarStyleContext.bindTo(this.contextKeyService);
		this.updateTitleBarContextKeys();

		// Panel
		this.panelPositionContext = PanelPositionContext.bindTo(this.contextKeyService);
		this.panelPositionContext.set(positionToString(this.layoutService.getPanelPosition()));
		this.panelVisibleContext = PanelVisibleContext.bindTo(this.contextKeyService);
		this.panelVisibleContext.set(this.layoutService.isVisible(Parts.PANEL_PART));
		this.panelMaximizedContext = PanelMaximizedContext.bindTo(this.contextKeyService);
		this.panelMaximizedContext.set(this.layoutService.isPanelMaximized());
		this.panelAlignmentContext = PanelAlignmentContext.bindTo(this.contextKeyService);
		this.panelAlignmentContext.set(this.layoutService.getPanelAlignment());

		// Auxiliary Bar
		this.auxiliaryBarVisibleContext = AuxiliaryBarVisibleContext.bindTo(this.contextKeyService);
		this.auxiliaryBarVisibleContext.set(this.layoutService.isVisible(Parts.AUXILIARYBAR_PART));
		this.auxiliaryBarMaximizedContext = AuxiliaryBarMaximizedContext.bindTo(this.contextKeyService);
		this.auxiliaryBarMaximizedContext.set(this.layoutService.isAuxiliaryBarMaximized());

		this.registerListeners();
	}

	private registerListeners(): void {
		this.editorGroupService.whenReady.then(() => {
			this.updateEditorAreaContextKeys();
			this.updateActiveEditorGroupContextKeys();
			this.updateVisiblePanesContextKeys();
		});

		this._register(this.editorService.onDidActiveEditorChange(() => this.updateActiveEditorGroupContextKeys()));
		this._register(this.editorService.onDidVisibleEditorsChange(() => this.updateVisiblePanesContextKeys()));
		this._register(this.editorGroupService.onDidAddGroup(() => this.updateEditorGroupsContextKeys()));
		this._register(this.editorGroupService.onDidRemoveGroup(() => this.updateEditorGroupsContextKeys()));
		this._register(this.editorGroupService.onDidChangeGroupIndex(() => this.updateActiveEditorGroupContextKeys()));
		this._register(this.editorGroupService.onDidChangeGroupLocked(() => this.updateActiveEditorGroupContextKeys()));

		this._register(this.editorGroupService.onDidChangeEditorPartOptions(() => this.updateEditorAreaContextKeys()));

		this._register(this.contextService.onDidChangeWorkbenchState(() => this.updateWorkbenchStateContextKey()));
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => {
			this.updateWorkspaceFolderCountContextKey();
			this.updateWorkspaceContextKeys();
		}));

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('workbench.editor.openSideBySideDirection')) {
				this.updateSplitEditorsVerticallyContext();
			}
		}));

		this._register(this.layoutService.onDidChangeZenMode(enabled => this.inZenModeContext.set(enabled)));
		this._register(this.layoutService.onDidChangeActiveContainer(() => this.isAuxiliaryWindowFocusedContext.set(this.layoutService.activeContainer !== this.layoutService.mainContainer)));
		this._register(onDidChangeFullscreen(windowId => {
			if (windowId === mainWindow.vscodeWindowId) {
				this.isMainWindowFullscreenContext.set(isFullscreen(mainWindow));
			}
		}));
		this._register(this.layoutService.onDidChangeMainEditorCenteredLayout(centered => this.isMainEditorCenteredLayoutContext.set(centered)));
		this._register(this.layoutService.onDidChangePanelPosition(position => this.panelPositionContext.set(position)));

		this._register(this.layoutService.onDidChangePanelAlignment(alignment => this.panelAlignmentContext.set(alignment)));

		this._register(this.paneCompositeService.onDidPaneCompositeClose(() => this.updateSideBarContextKeys()));
		this._register(this.paneCompositeService.onDidPaneCompositeOpen(() => this.updateSideBarContextKeys()));

		this._register(this.layoutService.onDidChangePartVisibility(() => {
			this.mainEditorAreaVisibleContext.set(this.layoutService.isVisible(Parts.EDITOR_PART, mainWindow));
			this.panelVisibleContext.set(this.layoutService.isVisible(Parts.PANEL_PART));
			this.panelMaximizedContext.set(this.layoutService.isPanelMaximized());
			this.auxiliaryBarVisibleContext.set(this.layoutService.isVisible(Parts.AUXILIARYBAR_PART));

			this.updateTitleBarContextKeys();
		}));

		this._register(this.layoutService.onDidChangeAuxiliaryBarMaximized(() => {
			this.auxiliaryBarMaximizedContext.set(this.layoutService.isAuxiliaryBarMaximized());
		}));

		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.dirtyWorkingCopiesContext.set(workingCopy.isDirty() || this.workingCopyService.hasDirty)));
	}

	private updateVisiblePanesContextKeys(): void {
		const visibleEditorPanes = this.editorService.visibleEditorPanes;
		if (visibleEditorPanes.length > 0) {
			this.editorsVisibleContext.set(true);
		} else {
			this.editorsVisibleContext.reset();
		}
	}

	// Context keys depending on the state of the editor group itself
	private updateActiveEditorGroupContextKeys(): void {
		if (!this.editorService.activeEditor) {
			this.activeEditorGroupEmpty.set(true);
		} else {
			this.activeEditorGroupEmpty.reset();
		}

		const activeGroup = this.editorGroupService.activeGroup;
		this.activeEditorGroupIndex.set(activeGroup.index + 1); // not zero-indexed
		this.activeEditorGroupLocked.set(activeGroup.isLocked);

		this.updateEditorGroupsContextKeys();
	}

	// Context keys depending on the state of other editor groups
	private updateEditorGroupsContextKeys(): void {
		const groupCount = this.editorGroupService.count;
		if (groupCount > 1) {
			this.multipleEditorGroupsContext.set(true);
		} else {
			this.multipleEditorGroupsContext.reset();
		}

		const activeGroup = this.editorGroupService.activeGroup;
		this.activeEditorGroupLast.set(activeGroup.index === groupCount - 1);
	}

	private updateEditorAreaContextKeys(): void {
		this.editorTabsVisibleContext.set(this.editorGroupService.partOptions.showTabs === 'multiple');
	}

	private updateWorkbenchStateContextKey(): void {
		this.workbenchStateContext.set(this.getWorkbenchStateString());
	}

	private updateWorkspaceFolderCountContextKey(): void {
		this.workspaceFolderCountContext.set(this.contextService.getWorkspace().folders.length);
	}

	private updateSplitEditorsVerticallyContext(): void {
		const direction = preferredSideBySideGroupDirection(this.configurationService);
		this.splitEditorsVerticallyContext.set(direction === GroupDirection.DOWN);
	}

	private getWorkbenchStateString(): string {
		switch (this.contextService.getWorkbenchState()) {
			case WorkbenchState.EMPTY: return 'empty';
			case WorkbenchState.FOLDER: return 'folder';
			case WorkbenchState.WORKSPACE: return 'workspace';
		}
	}

	private updateSideBarContextKeys(): void {
		this.sideBarVisibleContext.set(this.layoutService.isVisible(Parts.SIDEBAR_PART));
	}

	private updateTitleBarContextKeys(): void {
		this.titleAreaVisibleContext.set(this.layoutService.isVisible(Parts.TITLEBAR_PART, mainWindow));
		this.titleBarStyleContext.set(getTitleBarStyle(this.configurationService));
	}

	private updateWorkspaceContextKeys(): void {
		this.virtualWorkspaceContext.set(getVirtualWorkspaceScheme(this.contextService.getWorkspace()) || '');
		this.temporaryWorkspaceContext.set(isTemporaryWorkspace(this.contextService.getWorkspace()));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/dnd.ts]---
Location: vscode-main/src/vs/workbench/browser/dnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DataTransfers, IDragAndDropData } from '../../base/browser/dnd.js';
import { DragAndDropObserver, EventType, addDisposableListener, onDidRegisterWindow } from '../../base/browser/dom.js';
import { DragMouseEvent } from '../../base/browser/mouseEvent.js';
import { IListDragAndDrop } from '../../base/browser/ui/list/list.js';
import { ElementsDragAndDropData, ListViewTargetSector } from '../../base/browser/ui/list/listView.js';
import { ITreeDragOverReaction } from '../../base/browser/ui/tree/tree.js';
import { coalesce } from '../../base/common/arrays.js';
import { UriList, VSDataTransfer } from '../../base/common/dataTransfer.js';
import { Emitter, Event } from '../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, markAsSingleton } from '../../base/common/lifecycle.js';
import { stringify } from '../../base/common/marshalling.js';
import { Mimes } from '../../base/common/mime.js';
import { FileAccess, Schemas } from '../../base/common/network.js';
import { isWindows } from '../../base/common/platform.js';
import { basename, isEqual } from '../../base/common/resources.js';
import { URI } from '../../base/common/uri.js';
import { CodeDataTransfers, Extensions, IDragAndDropContributionRegistry, IDraggedResourceEditorInput, IResourceStat, LocalSelectionTransfer, createDraggedEditorInputFromRawResourcesData, extractEditorsAndFilesDropData } from '../../platform/dnd/browser/dnd.js';
import { IFileService } from '../../platform/files/common/files.js';
import { IInstantiationService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../platform/label/common/label.js';
import { extractSelection, withSelection } from '../../platform/opener/common/opener.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { IWindowOpenable } from '../../platform/window/common/window.js';
import { IWorkspaceContextService, hasWorkspaceFileExtension, isTemporaryWorkspace } from '../../platform/workspace/common/workspace.js';
import { IWorkspaceFolderCreationData, IWorkspacesService } from '../../platform/workspaces/common/workspaces.js';
import { EditorResourceAccessor, GroupIdentifier, IEditorIdentifier, isEditorIdentifier, isResourceDiffEditorInput, isResourceMergeEditorInput, isResourceSideBySideEditorInput } from '../common/editor.js';
import { IEditorGroup } from '../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { IHostService } from '../services/host/browser/host.js';
import { ITextFileService } from '../services/textfile/common/textfiles.js';
import { IWorkspaceEditingService } from '../services/workspaces/common/workspaceEditing.js';
import { IEditorOptions } from '../../platform/editor/common/editor.js';
import { mainWindow } from '../../base/browser/window.js';
import { BroadcastDataChannel } from '../../base/browser/broadcast.js';

//#region Editor / Resources DND

export class DraggedEditorIdentifier {

	constructor(readonly identifier: IEditorIdentifier) { }
}

export class DraggedEditorGroupIdentifier {

	constructor(readonly identifier: GroupIdentifier) { }
}

export async function extractTreeDropData(dataTransfer: VSDataTransfer): Promise<Array<IDraggedResourceEditorInput>> {
	const editors: IDraggedResourceEditorInput[] = [];
	const resourcesKey = Mimes.uriList.toLowerCase();

	// Data Transfer: Resources
	if (dataTransfer.has(resourcesKey)) {
		try {
			const asString = await dataTransfer.get(resourcesKey)?.asString();
			const rawResourcesData = JSON.stringify(UriList.parse(asString ?? ''));
			editors.push(...createDraggedEditorInputFromRawResourcesData(rawResourcesData));
		} catch (error) {
			// Invalid transfer
		}
	}

	return editors;
}

export interface IResourcesDropHandlerOptions {

	/**
	 * Whether we probe for the dropped resource to be a workspace
	 * (i.e. code-workspace file or even a folder), allowing to
	 * open it as workspace instead of opening as editor.
	 */
	readonly allowWorkspaceOpen: boolean;
}

/**
 * Shared function across some components to handle drag & drop of resources.
 * E.g. of folders and workspace files to open them in the window instead of
 * the editor or to handle dirty editors being dropped between instances of Code.
 */
export class ResourcesDropHandler {

	constructor(
		private readonly options: IResourcesDropHandlerOptions,
		@IFileService private readonly fileService: IFileService,
		@IWorkspacesService private readonly workspacesService: IWorkspacesService,
		@IEditorService private readonly editorService: IEditorService,
		@IWorkspaceEditingService private readonly workspaceEditingService: IWorkspaceEditingService,
		@IHostService private readonly hostService: IHostService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
	}

	async handleDrop(event: DragEvent, targetWindow: Window, resolveTargetGroup?: () => IEditorGroup | undefined, afterDrop?: (targetGroup: IEditorGroup | undefined) => void, options?: IEditorOptions): Promise<void> {
		const editors = await this.instantiationService.invokeFunction(accessor => extractEditorsAndFilesDropData(accessor, event));
		if (!editors.length) {
			return;
		}

		// Make the window active to handle the drop properly within
		await this.hostService.focus(targetWindow);

		// Check for workspace file / folder being dropped if we are allowed to do so
		if (this.options.allowWorkspaceOpen) {
			const localFilesAllowedToOpenAsWorkspace = coalesce(editors.filter(editor => editor.allowWorkspaceOpen && editor.resource?.scheme === Schemas.file).map(editor => editor.resource));
			if (localFilesAllowedToOpenAsWorkspace.length > 0) {
				const isWorkspaceOpening = await this.handleWorkspaceDrop(localFilesAllowedToOpenAsWorkspace);
				if (isWorkspaceOpening) {
					return; // return early if the drop operation resulted in this window changing to a workspace
				}
			}
		}

		// Add external ones to recently open list unless dropped resource is a workspace
		const externalLocalFiles = coalesce(editors.filter(editor => editor.isExternal && editor.resource?.scheme === Schemas.file).map(editor => editor.resource));
		if (externalLocalFiles.length) {
			this.workspacesService.addRecentlyOpened(externalLocalFiles.map(resource => ({ fileUri: resource })));
		}

		// Open in Editor
		const targetGroup = resolveTargetGroup?.();
		await this.editorService.openEditors(editors.map(editor => ({
			...editor,
			resource: editor.resource,
			options: {
				...editor.options,
				...options,
				pinned: true
			}
		})), targetGroup, { validateTrust: true });

		// Finish with provided function
		afterDrop?.(targetGroup);
	}

	private async handleWorkspaceDrop(resources: URI[]): Promise<boolean> {
		const toOpen: IWindowOpenable[] = [];
		const folderURIs: IWorkspaceFolderCreationData[] = [];

		await Promise.all(resources.map(async resource => {

			// Check for Workspace
			if (hasWorkspaceFileExtension(resource)) {
				toOpen.push({ workspaceUri: resource });

				return;
			}

			// Check for Folder
			try {
				const stat = await this.fileService.stat(resource);
				if (stat.isDirectory) {
					toOpen.push({ folderUri: stat.resource });
					folderURIs.push({ uri: stat.resource });
				}
			} catch (error) {
				// Ignore error
			}
		}));

		// Return early if no external resource is a folder or workspace
		if (toOpen.length === 0) {
			return false;
		}

		// Open in separate windows if we drop workspaces or just one folder
		if (toOpen.length > folderURIs.length || folderURIs.length === 1) {
			await this.hostService.openWindow(toOpen);
		}

		// Add to workspace if we are in a temporary workspace
		else if (isTemporaryWorkspace(this.contextService.getWorkspace())) {
			await this.workspaceEditingService.addFolders(folderURIs);
		}

		// Finally, enter untitled workspace when dropping >1 folders
		else {
			await this.workspaceEditingService.createAndEnterWorkspace(folderURIs);
		}

		return true;
	}
}

export function fillEditorsDragData(accessor: ServicesAccessor, resources: URI[], event: DragMouseEvent | DragEvent, options?: { disableStandardTransfer: boolean }): void;
export function fillEditorsDragData(accessor: ServicesAccessor, resources: IResourceStat[], event: DragMouseEvent | DragEvent, options?: { disableStandardTransfer: boolean }): void;
export function fillEditorsDragData(accessor: ServicesAccessor, editors: IEditorIdentifier[], event: DragMouseEvent | DragEvent, options?: { disableStandardTransfer: boolean }): void;
export function fillEditorsDragData(accessor: ServicesAccessor, resourcesOrEditors: Array<URI | IResourceStat | IEditorIdentifier>, event: DragMouseEvent | DragEvent, options?: { disableStandardTransfer: boolean }): void {
	if (resourcesOrEditors.length === 0 || !event.dataTransfer) {
		return;
	}

	const textFileService = accessor.get(ITextFileService);
	const editorService = accessor.get(IEditorService);
	const fileService = accessor.get(IFileService);
	const labelService = accessor.get(ILabelService);

	// Extract resources from URIs or Editors that
	// can be handled by the file service
	const resources = coalesce(resourcesOrEditors.map((resourceOrEditor): IResourceStat | undefined => {
		if (URI.isUri(resourceOrEditor)) {
			return { resource: resourceOrEditor };
		}

		if (isEditorIdentifier(resourceOrEditor)) {
			if (URI.isUri(resourceOrEditor.editor.resource)) {
				return { resource: resourceOrEditor.editor.resource };
			}

			return undefined; // editor without resource
		}

		return {
			resource: resourceOrEditor.selection ? withSelection(resourceOrEditor.resource, resourceOrEditor.selection) : resourceOrEditor.resource,
			isDirectory: resourceOrEditor.isDirectory,
			selection: resourceOrEditor.selection,
		};
	}));

	const fileSystemResources = resources.filter(({ resource }) => fileService.hasProvider(resource));
	if (!options?.disableStandardTransfer) {

		// Text: allows to paste into text-capable areas
		const lineDelimiter = isWindows ? '\r\n' : '\n';
		event.dataTransfer.setData(DataTransfers.TEXT, fileSystemResources.map(({ resource }) => labelService.getUriLabel(resource, { noPrefix: true })).join(lineDelimiter));

		// Download URL: enables support to drag a tab as file to desktop
		// Requirements:
		// - Chrome/Edge only
		// - only a single file is supported
		// - only file:/ resources are supported
		const firstFile = fileSystemResources.find(({ isDirectory }) => !isDirectory);
		if (firstFile) {
			const firstFileUri = FileAccess.uriToFileUri(firstFile.resource); // enforce `file:` URIs
			if (firstFileUri.scheme === Schemas.file) {
				event.dataTransfer.setData(DataTransfers.DOWNLOAD_URL, [Mimes.binary, basename(firstFile.resource), firstFileUri.toString()].join(':'));
			}
		}
	}

	// Resource URLs: allows to drop multiple file resources to a target in VS Code
	const files = fileSystemResources.filter(({ isDirectory }) => !isDirectory);
	if (files.length) {
		event.dataTransfer.setData(DataTransfers.RESOURCES, JSON.stringify(files.map(({ resource }) => resource.toString())));
	}

	// Contributions
	const contributions = Registry.as<IDragAndDropContributionRegistry>(Extensions.DragAndDropContribution).getAll();
	for (const contribution of contributions) {
		contribution.setData(resources, event);
	}

	// Editors: enables cross window DND of editors
	// into the editor area while presering UI state
	const draggedEditors: IDraggedResourceEditorInput[] = [];

	for (const resourceOrEditor of resourcesOrEditors) {

		// Extract resource editor from provided object or URI
		let editor: IDraggedResourceEditorInput | undefined = undefined;
		if (isEditorIdentifier(resourceOrEditor)) {
			const untypedEditor = resourceOrEditor.editor.toUntyped({ preserveViewState: resourceOrEditor.groupId });
			if (untypedEditor) {
				editor = { ...untypedEditor, resource: EditorResourceAccessor.getCanonicalUri(untypedEditor) };
			}
		} else if (URI.isUri(resourceOrEditor)) {
			const { selection, uri } = extractSelection(resourceOrEditor);
			editor = { resource: uri, options: selection ? { selection } : undefined };
		} else if (!resourceOrEditor.isDirectory) {
			editor = {
				resource: resourceOrEditor.resource,
				options: {
					selection: resourceOrEditor.selection,
				}
			};
		}

		if (!editor) {
			continue; // skip over editors that cannot be transferred via dnd
		}

		// Fill in some properties if they are not there already by accessing
		// some well known things from the text file universe.
		// This is not ideal for custom editors, but those have a chance to
		// provide everything from the `toUntyped` method.
		{
			const resource = editor.resource;
			if (resource) {
				const textFileModel = textFileService.files.get(resource);
				if (textFileModel) {

					// language
					if (typeof editor.languageId !== 'string') {
						editor.languageId = textFileModel.getLanguageId();
					}

					// encoding
					if (typeof editor.encoding !== 'string') {
						editor.encoding = textFileModel.getEncoding();
					}

					// contents (only if dirty and not too large)
					if (typeof editor.contents !== 'string' && textFileModel.isDirty() && !textFileModel.textEditorModel.isTooLargeForHeapOperation()) {
						editor.contents = textFileModel.textEditorModel.getValue();
					}
				}

				// viewState
				if (!editor.options?.viewState) {
					editor.options = {
						...editor.options,
						viewState: (() => {
							for (const visibleEditorPane of editorService.visibleEditorPanes) {
								if (isEqual(visibleEditorPane.input.resource, resource)) {
									const viewState = visibleEditorPane.getViewState();
									if (viewState) {
										return viewState;
									}
								}
							}

							return undefined;
						})()
					};
				}
			}
		}

		// Add as dragged editor
		draggedEditors.push(editor);
	}

	if (draggedEditors.length) {
		event.dataTransfer.setData(CodeDataTransfers.EDITORS, stringify(draggedEditors));
	}

	// Add a URI list entry
	const draggedDirectories: URI[] = fileSystemResources.filter(({ isDirectory }) => isDirectory).map(({ resource }) => resource);
	if (draggedEditors.length || draggedDirectories.length) {
		const uriListEntries: URI[] = [...draggedDirectories];
		for (const editor of draggedEditors) {
			if (editor.resource) {
				uriListEntries.push(editor.options?.selection ? withSelection(editor.resource, editor.options.selection) : editor.resource);
			} else if (isResourceDiffEditorInput(editor)) {
				if (editor.modified.resource) {
					uriListEntries.push(editor.modified.resource);
				}
			} else if (isResourceSideBySideEditorInput(editor)) {
				if (editor.primary.resource) {
					uriListEntries.push(editor.primary.resource);
				}
			} else if (isResourceMergeEditorInput(editor)) {
				uriListEntries.push(editor.result.resource);
			}
		}

		// Due to https://bugs.chromium.org/p/chromium/issues/detail?id=239745, we can only set
		// a single uri for the real `text/uri-list` type. Otherwise all uris end up joined together
		// However we write the full uri-list to an internal type so that other parts of VS Code
		// can use the full list.
		if (!options?.disableStandardTransfer) {
			event.dataTransfer.setData(Mimes.uriList, UriList.create(uriListEntries.slice(0, 1)));
		}
		event.dataTransfer.setData(DataTransfers.INTERNAL_URI_LIST, UriList.create(uriListEntries));
	}
}

//#endregion

//#region Composites DND

export type Before2D = {
	readonly verticallyBefore: boolean;
	readonly horizontallyBefore: boolean;
};

export interface ICompositeDragAndDrop {
	drop(data: IDragAndDropData, target: string | undefined, originalEvent: DragEvent, before?: Before2D): void;
	onDragOver(data: IDragAndDropData, target: string | undefined, originalEvent: DragEvent): boolean;
	onDragEnter(data: IDragAndDropData, target: string | undefined, originalEvent: DragEvent): boolean;
}

export interface ICompositeDragAndDropObserverCallbacks {
	onDragEnter?: (e: IDraggedCompositeData) => void;
	onDragLeave?: (e: IDraggedCompositeData) => void;
	onDrop?: (e: IDraggedCompositeData) => void;
	onDragOver?: (e: IDraggedCompositeData) => void;
	onDragStart?: (e: IDraggedCompositeData) => void;
	onDragEnd?: (e: IDraggedCompositeData) => void;
}

export class CompositeDragAndDropData implements IDragAndDropData {

	constructor(private type: 'view' | 'composite', private id: string) { }

	update(dataTransfer: DataTransfer): void {
		// no-op
	}

	getData(): {
		type: 'view' | 'composite';
		id: string;
	} {
		return { type: this.type, id: this.id };
	}
}

export interface IDraggedCompositeData {
	readonly eventData: DragEvent;
	readonly dragAndDropData: CompositeDragAndDropData;
}

export class DraggedCompositeIdentifier {

	constructor(private compositeId: string) { }

	get id(): string {
		return this.compositeId;
	}
}

export class DraggedViewIdentifier {

	constructor(private viewId: string) { }

	get id(): string {
		return this.viewId;
	}
}

export type ViewType = 'composite' | 'view';

export class CompositeDragAndDropObserver extends Disposable {

	private static instance: CompositeDragAndDropObserver | undefined;

	static get INSTANCE(): CompositeDragAndDropObserver {
		if (!CompositeDragAndDropObserver.instance) {
			CompositeDragAndDropObserver.instance = new CompositeDragAndDropObserver();
			markAsSingleton(CompositeDragAndDropObserver.instance);
		}

		return CompositeDragAndDropObserver.instance;
	}

	private readonly transferData = LocalSelectionTransfer.getInstance<DraggedCompositeIdentifier | DraggedViewIdentifier>();

	private readonly onDragStart = this._register(new Emitter<IDraggedCompositeData>());
	private readonly onDragEnd = this._register(new Emitter<IDraggedCompositeData>());

	private constructor() {
		super();

		this._register(this.onDragEnd.event(e => {
			const id = e.dragAndDropData.getData().id;
			const type = e.dragAndDropData.getData().type;
			const data = this.readDragData(type);
			if (data?.getData().id === id) {
				this.transferData.clearData(type === 'view' ? DraggedViewIdentifier.prototype : DraggedCompositeIdentifier.prototype);
			}
		}));
	}

	private readDragData(type: ViewType): CompositeDragAndDropData | undefined {
		if (this.transferData.hasData(type === 'view' ? DraggedViewIdentifier.prototype : DraggedCompositeIdentifier.prototype)) {
			const data = this.transferData.getData(type === 'view' ? DraggedViewIdentifier.prototype : DraggedCompositeIdentifier.prototype);
			if (data?.[0]) {
				return new CompositeDragAndDropData(type, data[0].id);
			}
		}

		return undefined;
	}

	private writeDragData(id: string, type: ViewType): void {
		this.transferData.setData([type === 'view' ? new DraggedViewIdentifier(id) : new DraggedCompositeIdentifier(id)], type === 'view' ? DraggedViewIdentifier.prototype : DraggedCompositeIdentifier.prototype);
	}

	registerTarget(element: HTMLElement, callbacks: ICompositeDragAndDropObserverCallbacks): IDisposable {
		const disposableStore = new DisposableStore();
		disposableStore.add(new DragAndDropObserver(element, {
			onDragEnter: e => {
				e.preventDefault();

				if (callbacks.onDragEnter) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (data) {
						callbacks.onDragEnter({ eventData: e, dragAndDropData: data });
					}
				}
			},
			onDragLeave: e => {
				const data = this.readDragData('composite') || this.readDragData('view');
				if (callbacks.onDragLeave && data) {
					callbacks.onDragLeave({ eventData: e, dragAndDropData: data });
				}
			},
			onDrop: e => {
				if (callbacks.onDrop) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (!data) {
						return;
					}

					callbacks.onDrop({ eventData: e, dragAndDropData: data });

					// Fire drag event in case drop handler destroys the dragged element
					this.onDragEnd.fire({ eventData: e, dragAndDropData: data });
				}
			},
			onDragOver: e => {
				e.preventDefault();

				if (callbacks.onDragOver) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (!data) {
						return;
					}

					callbacks.onDragOver({ eventData: e, dragAndDropData: data });
				}
			}
		}));

		if (callbacks.onDragStart) {
			this.onDragStart.event(e => {
				callbacks.onDragStart!(e);
			}, this, disposableStore);
		}

		if (callbacks.onDragEnd) {
			this.onDragEnd.event(e => {
				callbacks.onDragEnd!(e);
			}, this, disposableStore);
		}

		return this._register(disposableStore);
	}

	registerDraggable(element: HTMLElement, draggedItemProvider: () => { type: ViewType; id: string }, callbacks: ICompositeDragAndDropObserverCallbacks): IDisposable {
		element.draggable = true;

		const disposableStore = new DisposableStore();

		disposableStore.add(new DragAndDropObserver(element, {
			onDragStart: e => {
				const { id, type } = draggedItemProvider();
				this.writeDragData(id, type);

				e.dataTransfer?.setDragImage(element, 0, 0);

				this.onDragStart.fire({ eventData: e, dragAndDropData: this.readDragData(type)! });
			},
			onDragEnd: e => {
				const { type } = draggedItemProvider();
				const data = this.readDragData(type);
				if (!data) {
					return;
				}

				this.onDragEnd.fire({ eventData: e, dragAndDropData: data });
			},
			onDragEnter: e => {
				if (callbacks.onDragEnter) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (!data) {
						return;
					}

					if (data) {
						callbacks.onDragEnter({ eventData: e, dragAndDropData: data });
					}
				}
			},
			onDragLeave: e => {
				const data = this.readDragData('composite') || this.readDragData('view');
				if (!data) {
					return;
				}

				callbacks.onDragLeave?.({ eventData: e, dragAndDropData: data });
			},
			onDrop: e => {
				if (callbacks.onDrop) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (!data) {
						return;
					}

					callbacks.onDrop({ eventData: e, dragAndDropData: data });

					// Fire drag event in case drop handler destroys the dragged element
					this.onDragEnd.fire({ eventData: e, dragAndDropData: data });
				}
			},
			onDragOver: e => {
				if (callbacks.onDragOver) {
					const data = this.readDragData('composite') || this.readDragData('view');
					if (!data) {
						return;
					}

					callbacks.onDragOver({ eventData: e, dragAndDropData: data });
				}
			}
		}));

		if (callbacks.onDragStart) {
			this.onDragStart.event(e => {
				callbacks.onDragStart!(e);
			}, this, disposableStore);
		}

		if (callbacks.onDragEnd) {
			this.onDragEnd.event(e => {
				callbacks.onDragEnd!(e);
			}, this, disposableStore);
		}

		return this._register(disposableStore);
	}
}

export function toggleDropEffect(dataTransfer: DataTransfer | null, dropEffect: 'none' | 'copy' | 'link' | 'move', shouldHaveIt: boolean) {
	if (!dataTransfer) {
		return;
	}

	dataTransfer.dropEffect = shouldHaveIt ? dropEffect : 'none';
}

export class ResourceListDnDHandler<T> implements IListDragAndDrop<T> {
	constructor(
		private readonly toResource: (e: T) => URI | null,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) { }

	getDragURI(element: T): string | null {
		const resource = this.toResource(element);
		return resource ? resource.toString() : null;
	}

	getDragLabel(elements: T[]): string | undefined {
		const resources = coalesce(elements.map(this.toResource));
		return resources.length === 1 ? basename(resources[0]) : resources.length > 1 ? String(resources.length) : undefined;
	}

	onDragStart(data: IDragAndDropData, originalEvent: DragEvent): void {
		const resources: URI[] = [];
		const elements = (data as ElementsDragAndDropData<T>).elements;
		for (const element of elements) {
			const resource = this.toResource(element);
			if (resource) {
				resources.push(resource);
			}
		}
		this.onWillDragElements(elements, originalEvent);
		if (resources.length) {
			// Apply some datatransfer types to allow for dragging the element outside of the application
			this.instantiationService.invokeFunction(accessor => fillEditorsDragData(accessor, resources, originalEvent));
		}
	}

	protected onWillDragElements(elements: readonly T[], originalEvent: DragEvent): void {
		// noop
	}

	onDragOver(data: IDragAndDropData, targetElement: T, targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): boolean | ITreeDragOverReaction {
		return false;
	}

	drop(data: IDragAndDropData, targetElement: T, targetIndex: number, targetSector: ListViewTargetSector | undefined, originalEvent: DragEvent): void { }

	dispose(): void { }
}

//#endregion

class GlobalWindowDraggedOverTracker extends Disposable {

	private static readonly CHANNEL_NAME = 'monaco-workbench-global-dragged-over';

	private readonly broadcaster = this._register(new BroadcastDataChannel<boolean>(GlobalWindowDraggedOverTracker.CHANNEL_NAME));

	constructor() {
		super();

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			disposables.add(addDisposableListener(window, EventType.DRAG_OVER, () => this.markDraggedOver(false), true));
			disposables.add(addDisposableListener(window, EventType.DRAG_LEAVE, () => this.clearDraggedOver(false), true));
		}, { window: mainWindow, disposables: this._store }));

		this._register(this.broadcaster.onDidReceiveData(data => {
			if (data === true) {
				this.markDraggedOver(true);
			} else {
				this.clearDraggedOver(true);
			}
		}));
	}

	private draggedOver = false;
	get isDraggedOver(): boolean { return this.draggedOver; }

	private markDraggedOver(fromBroadcast: boolean): void {
		if (this.draggedOver === true) {
			return; // alrady marked
		}

		this.draggedOver = true;

		if (!fromBroadcast) {
			this.broadcaster.postData(true);
		}
	}

	private clearDraggedOver(fromBroadcast: boolean): void {
		if (this.draggedOver === false) {
			return; // alrady cleared
		}

		this.draggedOver = false;

		if (!fromBroadcast) {
			this.broadcaster.postData(false);
		}
	}
}

const globalDraggedOverTracker = new GlobalWindowDraggedOverTracker();

/**
 * Returns whether the workbench is currently dragged over in any of
 * the opened windows (main windows and auxiliary windows).
 */
export function isWindowDraggedOver(): boolean {
	return globalDraggedOverTracker.isDraggedOver;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/editor.ts]---
Location: vscode-main/src/vs/workbench/browser/editor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { EditorResourceAccessor, EditorExtensions, SideBySideEditor, IEditorDescriptor as ICommonEditorDescriptor, EditorCloseContext, IWillInstantiateEditorPaneEvent } from '../common/editor.js';
import { EditorInput } from '../common/editor/editorInput.js';
import { SyncDescriptor } from '../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { EditorPane } from './parts/editor/editorPane.js';
import { IConstructorSignature, IInstantiationService, BrandedService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { IDisposable, toDisposable } from '../../base/common/lifecycle.js';
import { Promises } from '../../base/common/async.js';
import { IEditorService } from '../services/editor/common/editorService.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkingCopyService } from '../services/workingCopy/common/workingCopyService.js';
import { URI } from '../../base/common/uri.js';
import { Schemas } from '../../base/common/network.js';
import { IEditorGroup } from '../services/editor/common/editorGroupsService.js';
import { Iterable } from '../../base/common/iterator.js';
import { Emitter } from '../../base/common/event.js';

//#region Editor Pane Registry

export interface IEditorPaneDescriptor extends ICommonEditorDescriptor<EditorPane> { }

export interface IEditorPaneRegistry {

	/**
	 * Registers an editor pane to the platform for the given editor type. The second parameter also supports an
	 * array of input classes to be passed in. If the more than one editor is registered for the same editor
	 * input, the input itself will be asked which editor it prefers if this method is provided. Otherwise
	 * the first editor in the list will be returned.
	 *
	 * @param editorDescriptors A set of constructor functions that return an instance of `EditorInput` for which the
	 * registered editor should be used for.
	 */
	registerEditorPane(editorPaneDescriptor: IEditorPaneDescriptor, editorDescriptors: readonly SyncDescriptor<EditorInput>[]): IDisposable;

	/**
	 * Returns the editor pane descriptor for the given editor or `undefined` if none.
	 */
	getEditorPane(editor: EditorInput): IEditorPaneDescriptor | undefined;
}

/**
 * A lightweight descriptor of an editor pane. The descriptor is deferred so that heavy editor
 * panes can load lazily in the workbench.
 */
export class EditorPaneDescriptor implements IEditorPaneDescriptor {

	private static readonly instantiatedEditorPanes = new Set<string>();
	static didInstantiateEditorPane(typeId: string): boolean {
		return EditorPaneDescriptor.instantiatedEditorPanes.has(typeId);
	}

	private static readonly _onWillInstantiateEditorPane = new Emitter<IWillInstantiateEditorPaneEvent>();
	static readonly onWillInstantiateEditorPane = EditorPaneDescriptor._onWillInstantiateEditorPane.event;

	static create<Services extends BrandedService[]>(
		ctor: { new(group: IEditorGroup, ...services: Services): EditorPane },
		typeId: string,
		name: string
	): EditorPaneDescriptor {
		return new EditorPaneDescriptor(ctor as IConstructorSignature<EditorPane, [IEditorGroup]>, typeId, name);
	}

	private constructor(
		private readonly ctor: IConstructorSignature<EditorPane, [IEditorGroup]>,
		readonly typeId: string,
		readonly name: string
	) { }

	instantiate(instantiationService: IInstantiationService, group: IEditorGroup): EditorPane {
		EditorPaneDescriptor._onWillInstantiateEditorPane.fire({ typeId: this.typeId });

		const pane = instantiationService.createInstance(this.ctor, group);
		EditorPaneDescriptor.instantiatedEditorPanes.add(this.typeId);

		return pane;
	}

	describes(editorPane: EditorPane): boolean {
		return editorPane.getId() === this.typeId;
	}
}

export class EditorPaneRegistry implements IEditorPaneRegistry {

	private readonly mapEditorPanesToEditors = new Map<EditorPaneDescriptor, readonly SyncDescriptor<EditorInput>[]>();

	registerEditorPane(editorPaneDescriptor: EditorPaneDescriptor, editorDescriptors: readonly SyncDescriptor<EditorInput>[]): IDisposable {
		this.mapEditorPanesToEditors.set(editorPaneDescriptor, editorDescriptors);

		return toDisposable(() => {
			this.mapEditorPanesToEditors.delete(editorPaneDescriptor);
		});
	}

	getEditorPane(editor: EditorInput): EditorPaneDescriptor | undefined {
		const descriptors = this.findEditorPaneDescriptors(editor);

		if (descriptors.length === 0) {
			return undefined;
		}

		if (descriptors.length === 1) {
			return descriptors[0];
		}

		return editor.prefersEditorPane(descriptors);
	}

	private findEditorPaneDescriptors(editor: EditorInput, byInstanceOf?: boolean): EditorPaneDescriptor[] {
		const matchingEditorPaneDescriptors: EditorPaneDescriptor[] = [];

		for (const editorPane of this.mapEditorPanesToEditors.keys()) {
			const editorDescriptors = this.mapEditorPanesToEditors.get(editorPane) || [];
			for (const editorDescriptor of editorDescriptors) {
				const editorClass = editorDescriptor.ctor;

				// Direct check on constructor type (ignores prototype chain)
				if (!byInstanceOf && editor.constructor === editorClass) {
					matchingEditorPaneDescriptors.push(editorPane);
					break;
				}

				// Normal instanceof check
				else if (byInstanceOf && editor instanceof editorClass) {
					matchingEditorPaneDescriptors.push(editorPane);
					break;
				}
			}
		}

		// If no descriptors found, continue search using instanceof and prototype chain
		if (!byInstanceOf && matchingEditorPaneDescriptors.length === 0) {
			return this.findEditorPaneDescriptors(editor, true);
		}

		return matchingEditorPaneDescriptors;
	}

	//#region Used for tests only

	getEditorPaneByType(typeId: string): EditorPaneDescriptor | undefined {
		return Iterable.find(this.mapEditorPanesToEditors.keys(), editor => editor.typeId === typeId);
	}

	getEditorPanes(): readonly EditorPaneDescriptor[] {
		return Array.from(this.mapEditorPanesToEditors.keys());
	}

	getEditors(): SyncDescriptor<EditorInput>[] {
		const editorClasses: SyncDescriptor<EditorInput>[] = [];
		for (const editorPane of this.mapEditorPanesToEditors.keys()) {
			const editorDescriptors = this.mapEditorPanesToEditors.get(editorPane);
			if (editorDescriptors) {
				editorClasses.push(...editorDescriptors.map(editorDescriptor => editorDescriptor.ctor));
			}
		}

		return editorClasses;
	}

	//#endregion
}

Registry.add(EditorExtensions.EditorPane, new EditorPaneRegistry());

//#endregion

//#region Editor Close Tracker

export function whenEditorClosed(accessor: ServicesAccessor, resources: URI[]): Promise<void> {
	const editorService = accessor.get(IEditorService);
	const uriIdentityService = accessor.get(IUriIdentityService);
	const workingCopyService = accessor.get(IWorkingCopyService);

	return new Promise(resolve => {
		let remainingResources = [...resources];

		// Observe any editor closing from this moment on
		const listener = editorService.onDidCloseEditor(async event => {
			if (event.context === EditorCloseContext.MOVE) {
				return; // ignore move events where the editor will open in another group
			}

			let primaryResource = EditorResourceAccessor.getOriginalUri(event.editor, { supportSideBySide: SideBySideEditor.PRIMARY });
			let secondaryResource = EditorResourceAccessor.getOriginalUri(event.editor, { supportSideBySide: SideBySideEditor.SECONDARY });

			// Specially handle an editor getting replaced: if the new active editor
			// matches any of the resources from the closed editor, ignore those
			// resources because they were actually not closed, but replaced.
			// (see https://github.com/microsoft/vscode/issues/134299)
			if (event.context === EditorCloseContext.REPLACE) {
				const newPrimaryResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
				const newSecondaryResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.SECONDARY });

				if (uriIdentityService.extUri.isEqual(primaryResource, newPrimaryResource)) {
					primaryResource = undefined;
				}

				if (uriIdentityService.extUri.isEqual(secondaryResource, newSecondaryResource)) {
					secondaryResource = undefined;
				}
			}

			// Remove from resources to wait for being closed based on the
			// resources from editors that got closed
			remainingResources = remainingResources.filter(resource => {

				// Closing editor matches resource directly: remove from remaining
				if (uriIdentityService.extUri.isEqual(resource, primaryResource) || uriIdentityService.extUri.isEqual(resource, secondaryResource)) {
					return false;
				}

				// Closing editor is untitled with associated resource
				// that matches resource directly: remove from remaining
				// but only if the editor was not replaced, otherwise
				// saving an untitled with associated resource would
				// release the `--wait` call.
				// (see https://github.com/microsoft/vscode/issues/141237)
				if (event.context !== EditorCloseContext.REPLACE) {
					if (
						(primaryResource?.scheme === Schemas.untitled && uriIdentityService.extUri.isEqual(resource, primaryResource.with({ scheme: resource.scheme }))) ||
						(secondaryResource?.scheme === Schemas.untitled && uriIdentityService.extUri.isEqual(resource, secondaryResource.with({ scheme: resource.scheme })))
					) {
						return false;
					}
				}

				// Editor is not yet closed, so keep it in waiting mode
				return true;
			});

			// All resources to wait for being closed are closed
			if (remainingResources.length === 0) {

				// If auto save is configured with the default delay (1s) it is possible
				// to close the editor while the save still continues in the background. As such
				// we have to also check if the editors to track for are dirty and if so wait
				// for them to get saved.
				const dirtyResources = resources.filter(resource => workingCopyService.isDirty(resource));
				if (dirtyResources.length > 0) {
					await Promises.settled(dirtyResources.map(async resource => await new Promise<void>(resolve => {
						if (!workingCopyService.isDirty(resource)) {
							return resolve(); // return early if resource is not dirty
						}

						// Otherwise resolve promise when resource is saved
						const listener = workingCopyService.onDidChangeDirty(workingCopy => {
							if (!workingCopy.isDirty() && uriIdentityService.extUri.isEqual(resource, workingCopy.resource)) {
								listener.dispose();

								return resolve();
							}
						});
					})));
				}

				listener.dispose();

				return resolve();
			}
		});
	});
}

//#endregion

//#region ARIA

export function computeEditorAriaLabel(input: EditorInput, index: number | undefined, group: IEditorGroup | undefined, groupCount: number | undefined): string {
	let ariaLabel = input.getAriaLabel();
	if (group && !group.isPinned(input)) {
		ariaLabel = localize('preview', "{0}, preview", ariaLabel);
	}

	if (group?.isSticky(index ?? input)) {
		ariaLabel = localize('pinned', "{0}, pinned", ariaLabel);
	}

	// Apply group information to help identify in
	// which group we are (only if more than one group
	// is actually opened)
	if (group && typeof groupCount === 'number' && groupCount > 1) {
		ariaLabel = `${ariaLabel}, ${group.ariaLabel}`;
	}

	return ariaLabel;
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/labels.ts]---
Location: vscode-main/src/vs/workbench/browser/labels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../nls.js';
import { URI } from '../../base/common/uri.js';
import { dirname, isEqual, basenameOrAuthority } from '../../base/common/resources.js';
import { IconLabel, IIconLabelValueOptions, IIconLabelCreationOptions } from '../../base/browser/ui/iconLabel/iconLabel.js';
import { ILanguageService } from '../../editor/common/languages/language.js';
import { IWorkspaceContextService } from '../../platform/workspace/common/workspace.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IModelService } from '../../editor/common/services/model.js';
import { ITextFileService } from '../services/textfile/common/textfiles.js';
import { IDecoration, IDecorationsService, IResourceDecorationChangeEvent } from '../services/decorations/common/decorations.js';
import { Schemas } from '../../base/common/network.js';
import { FileKind, FILES_ASSOCIATIONS_CONFIG } from '../../platform/files/common/files.js';
import { ITextModel } from '../../editor/common/model.js';
import { IThemeService } from '../../platform/theme/common/themeService.js';
import { Event, Emitter } from '../../base/common/event.js';
import { ILabelService } from '../../platform/label/common/label.js';
import { getIconClasses } from '../../editor/common/services/getIconClasses.js';
import { Disposable, dispose, IDisposable, MutableDisposable } from '../../base/common/lifecycle.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { normalizeDriveLetter } from '../../base/common/labels.js';
import { IRange } from '../../editor/common/core/range.js';
import { ThemeIcon } from '../../base/common/themables.js';
import { INotebookDocumentService, extractCellOutputDetails } from '../services/notebook/common/notebookDocumentService.js';

export interface IResourceLabelProps {
	resource?: URI | { primary?: URI; secondary?: URI };
	name?: string | string[];
	range?: IRange;
	description?: string;
}

function toResource(props: IResourceLabelProps | undefined): URI | undefined {
	if (!props?.resource) {
		return undefined;
	}

	if (URI.isUri(props.resource)) {
		return props.resource;
	}

	return props.resource.primary;
}

export interface IResourceLabelOptions extends IIconLabelValueOptions {

	/**
	 * A hint to the file kind of the resource.
	 */
	fileKind?: FileKind;

	/**
	 * File decorations to use for the label.
	 */
	readonly fileDecorations?: { colors: boolean; badges: boolean };

	/**
	 * Will take the provided label as is and e.g. not override it for untitled files.
	 */
	readonly forceLabel?: boolean;

	/**
	 * A prefix to be added to the name of the label.
	 */
	readonly namePrefix?: string;

	/**
	 * A suffix to be added to the name of the label.
	 */
	readonly nameSuffix?: string;

	/**
	 * Uses the provided icon instead of deriving a resource icon.
	 */
	readonly icon?: ThemeIcon | URI;
}

export interface IFileLabelOptions extends IResourceLabelOptions {
	hideLabel?: boolean;
	hidePath?: boolean;
	range?: IRange;
}

export interface IResourceLabel extends IDisposable {

	readonly element: HTMLElement;

	readonly onDidRender: Event<void>;

	/**
	 * Most generic way to apply a label with raw information.
	 */
	setLabel(label?: string, description?: string, options?: IIconLabelValueOptions): void;

	/**
	 * Convenient method to apply a label by passing a resource along.
	 *
	 * Note: for file resources consider to use the #setFile() method instead.
	 */
	setResource(label: IResourceLabelProps, options?: IResourceLabelOptions): void;

	/**
	 * Convenient method to render a file label based on a resource.
	 */
	setFile(resource: URI, options?: IFileLabelOptions): void;

	/**
	 * Resets the label to be empty.
	 */
	clear(): void;
}

export interface IResourceLabelsContainer {
	readonly onDidChangeVisibility: Event<boolean>;
}

export const DEFAULT_LABELS_CONTAINER: IResourceLabelsContainer = {
	onDidChangeVisibility: Event.None
};

export class ResourceLabels extends Disposable {

	private readonly _onDidChangeDecorations = this._register(new Emitter<void>());
	get onDidChangeDecorations() { return this._onDidChangeDecorations.event; }

	private widgets: ResourceLabelWidget[] = [];
	private labels: IResourceLabel[] = [];

	constructor(
		container: IResourceLabelsContainer,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IModelService private readonly modelService: IModelService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IDecorationsService private readonly decorationsService: IDecorationsService,
		@IThemeService private readonly themeService: IThemeService,
		@ILabelService private readonly labelService: ILabelService,
		@ITextFileService private readonly textFileService: ITextFileService
	) {
		super();

		this.registerListeners(container);
	}

	private registerListeners(container: IResourceLabelsContainer): void {

		// notify when visibility changes
		this._register(container.onDidChangeVisibility(visible => {
			this.widgets.forEach(widget => widget.notifyVisibilityChanged(visible));
		}));

		// notify when extensions are registered with potentially new languages
		this._register(this.languageService.onDidChange(() => this.widgets.forEach(widget => widget.notifyExtensionsRegistered())));

		// notify when model language changes
		this._register(this.modelService.onModelLanguageChanged(e => {
			if (!e.model.uri) {
				return; // we need the resource to compare
			}

			this.widgets.forEach(widget => widget.notifyModelLanguageChanged(e.model));
		}));

		// notify when model is added
		this._register(this.modelService.onModelAdded(model => {
			if (!model.uri) {
				return; // we need the resource to compare
			}

			this.widgets.forEach(widget => widget.notifyModelAdded(model));
		}));

		// notify when workspace folders changes
		this._register(this.workspaceService.onDidChangeWorkspaceFolders(() => {
			this.widgets.forEach(widget => widget.notifyWorkspaceFoldersChange());
		}));

		// notify when file decoration changes
		this._register(this.decorationsService.onDidChangeDecorations(e => {
			let notifyDidChangeDecorations = false;
			this.widgets.forEach(widget => {
				if (widget.notifyFileDecorationsChanges(e)) {
					notifyDidChangeDecorations = true;
				}
			});

			if (notifyDidChangeDecorations) {
				this._onDidChangeDecorations.fire();
			}
		}));

		// notify when theme changes
		this._register(this.themeService.onDidColorThemeChange(() => this.widgets.forEach(widget => widget.notifyThemeChange())));

		// notify when files.associations changes
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(FILES_ASSOCIATIONS_CONFIG)) {
				this.widgets.forEach(widget => widget.notifyFileAssociationsChange());
			}
		}));

		// notify when label formatters change
		this._register(this.labelService.onDidChangeFormatters(e => {
			this.widgets.forEach(widget => widget.notifyFormattersChange(e.scheme));
		}));

		// notify when untitled labels change
		this._register(this.textFileService.untitled.onDidChangeLabel(model => {
			this.widgets.forEach(widget => widget.notifyUntitledLabelChange(model.resource));
		}));
	}

	get(index: number): IResourceLabel {
		return this.labels[index];
	}

	create(container: HTMLElement, options?: IIconLabelCreationOptions): IResourceLabel {
		const widget = this.instantiationService.createInstance(ResourceLabelWidget, container, options);

		// Only expose a handle to the outside
		const label: IResourceLabel = {
			element: widget.element,
			get onDidRender() { return widget.onDidRender; },
			setLabel: (label: string, description?: string, options?: IIconLabelValueOptions) => widget.setLabel(label, description, options),
			setResource: (label: IResourceLabelProps, options?: IResourceLabelOptions) => widget.setResource(label, options),
			setFile: (resource: URI, options?: IFileLabelOptions) => widget.setFile(resource, options),
			clear: () => widget.clear(),
			dispose: () => this.disposeWidget(widget)
		};

		// Store
		this.labels.push(label);
		this.widgets.push(widget);

		return label;
	}

	private disposeWidget(widget: ResourceLabelWidget): void {
		const index = this.widgets.indexOf(widget);
		if (index > -1) {
			this.widgets.splice(index, 1);
			this.labels.splice(index, 1);
		}

		dispose(widget);
	}

	clear(): void {
		this.widgets = dispose(this.widgets);
		this.labels = [];
	}

	override dispose(): void {
		super.dispose();

		this.clear();
	}
}

/**
 * Note: please consider to use `ResourceLabels` if you are in need
 * of more than one label for your widget.
 */
export class ResourceLabel extends ResourceLabels {

	private label: IResourceLabel;
	get element(): IResourceLabel { return this.label; }

	constructor(
		container: HTMLElement,
		options: IIconLabelCreationOptions | undefined,
		@IInstantiationService instantiationService: IInstantiationService,
		@IConfigurationService configurationService: IConfigurationService,
		@IModelService modelService: IModelService,
		@IWorkspaceContextService workspaceService: IWorkspaceContextService,
		@ILanguageService languageService: ILanguageService,
		@IDecorationsService decorationsService: IDecorationsService,
		@IThemeService themeService: IThemeService,
		@ILabelService labelService: ILabelService,
		@ITextFileService textFileService: ITextFileService
	) {
		super(DEFAULT_LABELS_CONTAINER, instantiationService, configurationService, modelService, workspaceService, languageService, decorationsService, themeService, labelService, textFileService);

		this.label = this._register(this.create(container, options));
	}
}

enum Redraw {
	Basic = 1,
	Full = 2
}

class ResourceLabelWidget extends IconLabel {

	private readonly _onDidRender = this._register(new Emitter<void>());
	get onDidRender() { return this._onDidRender.event; }

	private label: IResourceLabelProps | undefined = undefined;
	private readonly decoration = this._register(new MutableDisposable<IDecoration>());
	private options: IResourceLabelOptions | undefined = undefined;

	private computedIconClasses: string[] | undefined = undefined;
	private computedLanguageId: string | undefined = undefined;
	private computedPathLabel: string | undefined = undefined;
	private computedWorkspaceFolderLabel: string | undefined = undefined;

	private needsRedraw: Redraw | undefined = undefined;
	private isHidden: boolean = false;

	constructor(
		container: HTMLElement,
		options: IIconLabelCreationOptions | undefined,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService,
		@IDecorationsService private readonly decorationsService: IDecorationsService,
		@ILabelService private readonly labelService: ILabelService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@INotebookDocumentService private readonly notebookDocumentService: INotebookDocumentService
	) {
		super(container, options);
	}

	notifyVisibilityChanged(visible: boolean): void {
		if (visible === this.isHidden) {
			this.isHidden = !visible;

			if (visible && this.needsRedraw) {
				this.render({
					updateIcon: this.needsRedraw === Redraw.Full,
					updateDecoration: this.needsRedraw === Redraw.Full
				});

				this.needsRedraw = undefined;
			}
		}
	}

	notifyModelLanguageChanged(model: ITextModel): void {
		this.handleModelEvent(model);
	}

	notifyModelAdded(model: ITextModel): void {
		this.handleModelEvent(model);
	}

	private handleModelEvent(model: ITextModel): void {
		const resource = toResource(this.label);
		if (!resource) {
			return; // only update if resource exists
		}

		if (isEqual(model.uri, resource)) {
			if (this.computedLanguageId !== model.getLanguageId()) {
				this.computedLanguageId = model.getLanguageId();
				this.render({ updateIcon: true, updateDecoration: false }); // update if the language id of the model has changed from our last known state
			}
		}
	}

	notifyFileDecorationsChanges(e: IResourceDecorationChangeEvent): boolean {
		if (!this.options) {
			return false;
		}

		const resource = toResource(this.label);
		if (!resource) {
			return false;
		}

		if (this.options.fileDecorations && e.affectsResource(resource)) {
			return this.render({ updateIcon: false, updateDecoration: true });
		}

		return false;
	}

	notifyExtensionsRegistered(): void {
		this.render({ updateIcon: true, updateDecoration: false });
	}

	notifyThemeChange(): void {
		this.render({ updateIcon: false, updateDecoration: false });
	}

	notifyFileAssociationsChange(): void {
		this.render({ updateIcon: true, updateDecoration: false });
	}

	notifyFormattersChange(scheme: string): void {
		if (toResource(this.label)?.scheme === scheme) {
			this.render({ updateIcon: false, updateDecoration: false });
		}
	}

	notifyUntitledLabelChange(resource: URI): void {
		if (isEqual(resource, toResource(this.label))) {
			this.render({ updateIcon: false, updateDecoration: false });
		}
	}

	notifyWorkspaceFoldersChange(): void {
		if (typeof this.computedWorkspaceFolderLabel === 'string') {
			const resource = toResource(this.label);
			if (URI.isUri(resource) && this.label?.name === this.computedWorkspaceFolderLabel) {
				this.setFile(resource, this.options);
			}
		}
	}

	setFile(resource: URI, options?: IFileLabelOptions): void {
		const hideLabel = options?.hideLabel;
		let name: string | undefined;
		if (!hideLabel) {
			if (options?.fileKind === FileKind.ROOT_FOLDER) {
				const workspaceFolder = this.contextService.getWorkspaceFolder(resource);
				if (workspaceFolder) {
					name = workspaceFolder.name;
					this.computedWorkspaceFolderLabel = name;
				}
			}

			if (!name) {
				name = normalizeDriveLetter(basenameOrAuthority(resource));
			}
		}

		let description: string | undefined;
		if (!options?.hidePath) {
			const descriptionCandidate = this.labelService.getUriLabel(dirname(resource), { relative: true });
			if (descriptionCandidate && descriptionCandidate !== '.') {
				// omit description if its not significant: a relative path
				// of '.' just indicates that there is no parent to the path
				// https://github.com/microsoft/vscode/issues/208692
				description = descriptionCandidate;
			}
		}

		this.setResource({ resource, name, description, range: options?.range }, options);
	}

	setResource(label: IResourceLabelProps, options: IResourceLabelOptions = Object.create(null)): void {
		const resource = toResource(label);
		const isSideBySideEditor = label?.resource && !URI.isUri(label.resource);

		if (!options.forceLabel && !isSideBySideEditor && resource?.scheme === Schemas.untitled) {
			// Untitled labels are very dynamic because they may change
			// whenever the content changes (unless a path is associated).
			// As such we always ask the actual editor for it's name and
			// description to get latest in case name/description are
			// provided. If they are not provided from the label we got
			// we assume that the client does not want to display them
			// and as such do not override.
			//
			// We do not touch the label if it represents a primary-secondary
			// because in that case we expect it to carry a proper label
			// and description.
			const untitledModel = this.textFileService.untitled.get(resource);
			if (untitledModel && !untitledModel.hasAssociatedFilePath) {
				if (typeof label.name === 'string') {
					label.name = untitledModel.name;
				}

				if (typeof label.description === 'string') {
					const untitledDescription = untitledModel.resource.path;
					if (label.name !== untitledDescription) {
						label.description = untitledDescription;
					} else {
						label.description = undefined;
					}
				}

				const untitledTitle = untitledModel.resource.path;
				if (untitledModel.name !== untitledTitle) {
					options.title = `${untitledModel.name} • ${untitledTitle}`;
				} else {
					options.title = untitledTitle;
				}
			}
		}

		if (!options.forceLabel && !isSideBySideEditor && resource?.scheme === Schemas.vscodeNotebookCell) {
			// Notebook cells are embeded in a notebook document
			// As such we always ask the actual notebook document
			// for its position in the document.
			const notebookDocument = this.notebookDocumentService.getNotebook(resource);
			const cellIndex = notebookDocument?.getCellIndex(resource);
			if (notebookDocument && cellIndex !== undefined && typeof label.name === 'string') {
				options.title = localize('notebookCellLabel', "{0} • Cell {1}", label.name, `${cellIndex + 1}`);
			}

			if (typeof label.name === 'string' && notebookDocument && cellIndex !== undefined && typeof label.name === 'string') {
				label.name = localize('notebookCellLabel', "{0} • Cell {1}", label.name, `${cellIndex + 1}`);
			}
		}

		if (!options.forceLabel && !isSideBySideEditor && resource?.scheme === Schemas.vscodeNotebookCellOutput) {
			const notebookDocument = this.notebookDocumentService.getNotebook(resource);
			const outputUriData = extractCellOutputDetails(resource);
			if (outputUriData?.cellFragment) {
				if (!outputUriData.notebook) {
					return;
				}
				const cellUri = outputUriData.notebook.with({
					scheme: Schemas.vscodeNotebookCell,
					fragment: outputUriData.cellFragment
				});
				const cellIndex = notebookDocument?.getCellIndex(cellUri);
				const outputIndex = outputUriData.outputIndex;

				if (cellIndex !== undefined && outputIndex !== undefined && typeof label.name === 'string') {
					label.name = localize(
						'notebookCellOutputLabel',
						"{0} • Cell {1} • Output {2}",
						label.name,
						`${cellIndex + 1}`,
						`${outputIndex + 1}`
					);
				} else if (cellIndex !== undefined && typeof label.name === 'string') {
					label.name = localize(
						'notebookCellOutputLabelSimple',
						"{0} • Cell {1} • Output",
						label.name,
						`${cellIndex + 1}`
					);
				}
			}
		}

		if (options.namePrefix) {
			if (typeof label.name === 'string') {
				label.name = options.namePrefix + label.name;
			} else if (Array.isArray(label.name) && label.name.length > 0) {
				label.name = [options.namePrefix + label.name[0], ...label.name.slice(1)];
			}
		}

		if (options.nameSuffix) {
			if (typeof label.name === 'string') {
				label.name = label.name + options.nameSuffix;
			} else if (Array.isArray(label.name) && label.name.length > 0) {
				label.name = [...label.name.slice(0, label.name.length - 1), label.name[label.name.length - 1] + options.nameSuffix];
			}
		}

		const hasResourceChanged = this.hasResourceChanged(label);
		const hasPathLabelChanged = hasResourceChanged || this.hasPathLabelChanged(label);
		const hasFileKindChanged = this.hasFileKindChanged(options);
		const hasIconChanged = this.hasIconChanged(options);

		this.label = label;
		this.options = options;

		if (hasResourceChanged) {
			this.computedLanguageId = undefined; // reset computed language since resource changed
		}

		if (hasPathLabelChanged) {
			this.computedPathLabel = undefined; // reset path label due to resource/path-label change
		}

		this.render({
			updateIcon: hasResourceChanged || hasFileKindChanged || hasIconChanged,
			updateDecoration: hasResourceChanged || hasFileKindChanged
		});
	}

	private hasFileKindChanged(newOptions?: IResourceLabelOptions): boolean {
		const newFileKind = newOptions?.fileKind;
		const oldFileKind = this.options?.fileKind;

		return newFileKind !== oldFileKind; // same resource but different kind (file, folder)
	}

	private hasResourceChanged(newLabel: IResourceLabelProps): boolean {
		const newResource = toResource(newLabel);
		const oldResource = toResource(this.label);

		if (newResource && oldResource) {
			return newResource.toString() !== oldResource.toString();
		}

		if (!newResource && !oldResource) {
			return false;
		}

		return true;
	}

	private hasPathLabelChanged(newLabel: IResourceLabelProps): boolean {
		const newResource = toResource(newLabel);

		return !!newResource && this.computedPathLabel !== this.labelService.getUriLabel(newResource);
	}

	private hasIconChanged(newOptions?: IResourceLabelOptions): boolean {
		return this.options?.icon !== newOptions?.icon;
	}

	clear(): void {
		this.label = undefined;
		this.options = undefined;
		this.computedLanguageId = undefined;
		this.computedIconClasses = undefined;
		this.computedPathLabel = undefined;

		this.setLabel('');
	}

	private render(options: { updateIcon: boolean; updateDecoration: boolean }): boolean {
		if (this.isHidden) {
			if (this.needsRedraw !== Redraw.Full) {
				this.needsRedraw = (options.updateIcon || options.updateDecoration) ? Redraw.Full : Redraw.Basic;
			}

			return false;
		}

		if (options.updateIcon) {
			this.computedIconClasses = undefined;
		}

		if (!this.label) {
			return false;
		}

		const iconLabelOptions: IIconLabelValueOptions & { extraClasses: string[] } = {
			title: '',
			bold: this.options?.bold,
			italic: this.options?.italic,
			strikethrough: this.options?.strikethrough,
			matches: this.options?.matches,
			descriptionMatches: this.options?.descriptionMatches,
			extraClasses: [],
			separator: this.options?.separator,
			domId: this.options?.domId,
			disabledCommand: this.options?.disabledCommand,
			labelEscapeNewLines: this.options?.labelEscapeNewLines,
			descriptionTitle: this.options?.descriptionTitle,
			supportIcons: this.options?.supportIcons,
		};

		const resource = toResource(this.label);

		if (this.options?.title !== undefined) {
			iconLabelOptions.title = this.options.title;
		}

		if (resource && resource.scheme !== Schemas.data /* do not accidentally inline Data URIs */
			&& (
				(!this.options?.title)
				|| ((typeof this.options.title !== 'string') && !this.options.title.markdownNotSupportedFallback)
			)) {

			if (!this.computedPathLabel) {
				this.computedPathLabel = this.labelService.getUriLabel(resource);
			}

			if (!iconLabelOptions.title || (typeof iconLabelOptions.title === 'string')) {
				iconLabelOptions.title = this.computedPathLabel;
			} else if (!iconLabelOptions.title.markdownNotSupportedFallback) {
				iconLabelOptions.title.markdownNotSupportedFallback = this.computedPathLabel;
			}
		}

		if (this.options && !this.options.hideIcon) {
			if (!this.computedIconClasses) {
				this.computedIconClasses = getIconClasses(this.modelService, this.languageService, resource, this.options.fileKind, this.options.icon);
			}

			if (URI.isUri(this.options.icon)) {
				iconLabelOptions.iconPath = this.options.icon;
			}

			iconLabelOptions.extraClasses = this.computedIconClasses.slice(0);
		}

		if (this.options?.extraClasses) {
			iconLabelOptions.extraClasses.push(...this.options.extraClasses);
		}

		if (this.options?.fileDecorations && resource) {
			if (options.updateDecoration) {
				this.decoration.value = this.decorationsService.getDecoration(resource, this.options.fileKind !== FileKind.FILE);
			}

			const decoration = this.decoration.value;
			if (decoration) {
				if (decoration.tooltip) {
					if (typeof iconLabelOptions.title === 'string') {
						iconLabelOptions.title = `${iconLabelOptions.title} • ${decoration.tooltip}`;
					} else if (typeof iconLabelOptions.title?.markdown === 'string') {
						const title = `${iconLabelOptions.title.markdown} • ${decoration.tooltip}`;
						iconLabelOptions.title = { markdown: title, markdownNotSupportedFallback: title };
					}
				}

				if (decoration.strikethrough) {
					iconLabelOptions.strikethrough = true;
				}

				if (this.options.fileDecorations.colors) {
					iconLabelOptions.extraClasses.push(decoration.labelClassName);
				}

				if (this.options.fileDecorations.badges) {
					iconLabelOptions.extraClasses.push(decoration.badgeClassName);
					iconLabelOptions.extraClasses.push(decoration.iconClassName);
				}
			}
		}

		if (this.label.range) {
			iconLabelOptions.suffix = this.label.range.startLineNumber !== this.label.range.endLineNumber ?
				`:${this.label.range.startLineNumber}-${this.label.range.endLineNumber}` :
				`:${this.label.range.startLineNumber}`;
		}

		this.setLabel(this.label.name ?? '', this.label.description, iconLabelOptions);

		this._onDidRender.fire();

		return true;
	}

	override dispose(): void {
		super.dispose();

		this.label = undefined;
		this.options = undefined;
		this.computedLanguageId = undefined;
		this.computedIconClasses = undefined;
		this.computedPathLabel = undefined;
		this.computedWorkspaceFolderLabel = undefined;
	}
}
```

--------------------------------------------------------------------------------

````
