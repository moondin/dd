---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 449
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 449 of 552)

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

---[FILE: src/vs/workbench/contrib/search/test/browser/searchModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as sinon from 'sinon';
import * as arrays from '../../../../../base/common/arrays.js';
import { DeferredPromise, timeout } from '../../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ModelService } from '../../../../../editor/common/services/modelService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IAITextQuery, IFileMatch, IFileQuery, IFileSearchStats, IFolderQuery, ISearchComplete, ISearchProgressItem, ISearchQuery, ISearchService, ITextQuery, ITextSearchMatch, OneLineRange, QueryType, TextSearchMatch } from '../../../../services/search/common/search.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { SearchModelImpl } from '../../browser/searchTreeModel/searchModel.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { TestEditorGroupsService, TestEditorService } from '../../../../test/browser/workbenchTestServices.js';
import { NotebookEditorWidgetService } from '../../../notebook/browser/services/notebookEditorServiceImpl.js';
import { createFileUriFromPathFromRoot, getRootName } from './searchTestCommon.js';
import { INotebookCellMatchWithModel, INotebookFileMatchWithModel, contentMatchesToTextSearchMatches, webviewMatchesToTextSearchMatches } from '../../browser/notebookSearch/searchNotebookHelpers.js';
import { CellKind } from '../../../notebook/common/notebookCommon.js';
import { ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { FindMatch, IReadonlyTextBuffer } from '../../../../../editor/common/model.js';
import { ResourceMap, ResourceSet } from '../../../../../base/common/map.js';
import { INotebookService } from '../../../notebook/common/notebookService.js';
import { INotebookSearchService } from '../../common/notebookSearch.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CellMatch, MatchInNotebook } from '../../browser/notebookSearch/notebookSearchModel.js';

const nullEvent = new class {
	id: number = -1;
	topic!: string;
	name!: string;
	description!: string;
	data: any;

	startTime!: Date;
	stopTime!: Date;

	stop(): void {
		return;
	}

	timeTaken(): number {
		return -1;
	}
};

const lineOneRange = new OneLineRange(1, 0, 1);

suite('SearchModel', () => {

	let instantiationService: TestInstantiationService;
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const testSearchStats: IFileSearchStats = {
		fromCache: false,
		resultCount: 1,
		type: 'searchProcess',
		detailStats: {
			fileWalkTime: 0,
			cmdTime: 0,
			cmdResultCount: 0,
			directoriesWalked: 2,
			filesWalked: 3
		}
	};

	const folderQueries: IFolderQuery[] = [
		{ folder: createFileUriFromPathFromRoot() }
	];

	setup(() => {
		instantiationService = new TestInstantiationService();
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(ILabelService, { getUriBasenameLabel: (uri: URI) => '' });
		instantiationService.stub(INotebookService, { getNotebookTextModels: () => [] });
		instantiationService.stub(IModelService, stubModelService(instantiationService));
		instantiationService.stub(INotebookEditorService, stubNotebookEditorService(instantiationService));
		instantiationService.stub(ISearchService, {});
		instantiationService.stub(ISearchService, 'textSearch', Promise.resolve({ results: [] }));
		const fileService = new FileService(new NullLogService());
		store.add(fileService);
		const uriIdentityService = new UriIdentityService(fileService);
		store.add(uriIdentityService);
		instantiationService.stub(IUriIdentityService, uriIdentityService);
		instantiationService.stub(ILogService, new NullLogService());
	});

	teardown(() => sinon.restore());

	function searchServiceWithResults(results: IFileMatch[], complete: ISearchComplete | null = null): ISearchService {
		return <ISearchService>{
			textSearch(query: ISearchQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void, notebookURIs?: ResourceSet): Promise<ISearchComplete> {
				return new Promise(resolve => {
					queueMicrotask(() => {
						results.forEach(onProgress!);
						resolve(complete!);
					});
				});
			},
			fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
				return new Promise(resolve => {
					queueMicrotask(() => {
						resolve({ results: results, messages: [] });
					});

				});
			},
			aiTextSearch(query: ISearchQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void, notebookURIs?: ResourceSet): Promise<ISearchComplete> {
				return new Promise(resolve => {
					queueMicrotask(() => {
						results.forEach(onProgress!);
						resolve(complete!);
					});
				});
			},
			textSearchSplitSyncAsync(query: ITextQuery, token?: CancellationToken | undefined, onProgress?: ((result: ISearchProgressItem) => void) | undefined): { syncResults: ISearchComplete; asyncResults: Promise<ISearchComplete> } {
				return {
					syncResults: {
						results: [],
						messages: []
					},
					asyncResults: new Promise(resolve => {
						queueMicrotask(() => {
							results.forEach(onProgress!);
							resolve(complete!);
						});
					})
				};
			}
		};
	}

	function searchServiceWithError(error: Error): ISearchService {
		return <ISearchService>{
			textSearch(query: ISearchQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void): Promise<ISearchComplete> {
				return new Promise((resolve, reject) => {
					reject(error);
				});
			},
			fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
				return new Promise((resolve, reject) => {
					queueMicrotask(() => {
						reject(error);
					});
				});
			},
			aiTextSearch(query: ISearchQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void, notebookURIs?: ResourceSet): Promise<ISearchComplete> {
				return new Promise((resolve, reject) => {
					reject(error);
				});
			},
			textSearchSplitSyncAsync(query: ITextQuery, token?: CancellationToken | undefined, onProgress?: ((result: ISearchProgressItem) => void) | undefined): { syncResults: ISearchComplete; asyncResults: Promise<ISearchComplete> } {
				return {
					syncResults: {
						results: [],
						messages: []
					},
					asyncResults: new Promise((resolve, reject) => {
						reject(error);
					})
				};
			}
		};
	}

	function canceleableSearchService(tokenSource: CancellationTokenSource): ISearchService {
		return <ISearchService>{
			textSearch(query: ITextQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void): Promise<ISearchComplete> {
				const disposable = token?.onCancellationRequested(() => tokenSource.cancel());
				if (disposable) {
					store.add(disposable);
				}

				return this.textSearchSplitSyncAsync(query, token, onProgress).asyncResults;
			},
			fileSearch(query: IFileQuery, token?: CancellationToken): Promise<ISearchComplete> {
				const disposable = token?.onCancellationRequested(() => tokenSource.cancel());
				if (disposable) {
					store.add(disposable);
				}
				return new Promise(resolve => {
					queueMicrotask(() => {
						// eslint-disable-next-line local/code-no-any-casts
						resolve(<any>{});
					});
				});
			},
			aiTextSearch(query: IAITextQuery, token?: CancellationToken, onProgress?: (result: ISearchProgressItem) => void, notebookURIs?: ResourceSet): Promise<ISearchComplete> {
				const disposable = token?.onCancellationRequested(() => tokenSource.cancel());
				if (disposable) {
					store.add(disposable);
				}

				return Promise.resolve({
					results: [],
					messages: []
				});
			},
			textSearchSplitSyncAsync(query: ITextQuery, token?: CancellationToken | undefined, onProgress?: ((result: ISearchProgressItem) => void) | undefined): { syncResults: ISearchComplete; asyncResults: Promise<ISearchComplete> } {
				const disposable = token?.onCancellationRequested(() => tokenSource.cancel());
				if (disposable) {
					store.add(disposable);
				}
				return {
					syncResults: {
						results: [],
						messages: []
					},
					asyncResults: new Promise(resolve => {
						queueMicrotask(() => {
							// eslint-disable-next-line local/code-no-any-casts
							resolve(<any>{
								results: [],
								messages: []
							});
						});
					})
				};
			}
		};
	}

	function searchServiceWithDeferredPromise(p: Promise<ISearchComplete>): ISearchService {
		return <ISearchService>{
			textSearchSplitSyncAsync(query: ITextQuery, token?: CancellationToken | undefined, onProgress?: ((result: ISearchProgressItem) => void) | undefined): { syncResults: ISearchComplete; asyncResults: Promise<ISearchComplete> } {
				return {
					syncResults: {
						results: [],
						messages: []
					},
					asyncResults: p,
				};
			}
		};
	}


	function notebookSearchServiceWithInfo(results: INotebookFileMatchWithModel[], tokenSource: CancellationTokenSource | undefined): INotebookSearchService {
		return <INotebookSearchService>{
			_serviceBrand: undefined,
			notebookSearch(query: ITextQuery, token: CancellationToken | undefined, searchInstanceID: string, onProgress?: (result: ISearchProgressItem) => void): {
				openFilesToScan: ResourceSet;
				completeData: Promise<ISearchComplete>;
				allScannedFiles: Promise<ResourceSet>;
			} {
				const disposable = token?.onCancellationRequested(() => tokenSource?.cancel());
				if (disposable) {
					store.add(disposable);
				}
				const localResults = new ResourceMap<INotebookFileMatchWithModel | null>(uri => uri.path);

				results.forEach(r => {
					localResults.set(r.resource, r);
				});

				if (onProgress) {
					arrays.coalesce([...localResults.values()]).forEach(onProgress);
				}
				return {
					openFilesToScan: new ResourceSet([...localResults.keys()]),
					completeData: Promise.resolve({
						messages: [],
						results: arrays.coalesce([...localResults.values()]),
						limitHit: false
					}),
					allScannedFiles: Promise.resolve(new ResourceSet()),
				};
			}
		};
	}

	test('Search Model: Search adds to results', async () => {
		const results = [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11))),
			aRawMatch('/2', new TextSearchMatch('preview 2', lineOneRange))];
		instantiationService.stub(ISearchService, searchServiceWithResults(results, { limitHit: false, messages: [], results }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		await testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		const actual = testObject.searchResult.matches();

		assert.strictEqual(2, actual.length);
		assert.strictEqual(URI.file(`${getRootName()}/1`).toString(), actual[0].resource.toString());

		let actuaMatches = actual[0].matches();
		assert.strictEqual(2, actuaMatches.length);
		assert.strictEqual('preview 1', actuaMatches[0].text());
		assert.ok(new Range(2, 2, 2, 5).equalsRange(actuaMatches[0].range()));
		assert.strictEqual('preview 1', actuaMatches[1].text());
		assert.ok(new Range(2, 5, 2, 12).equalsRange(actuaMatches[1].range()));

		actuaMatches = actual[1].matches();
		assert.strictEqual(1, actuaMatches.length);
		assert.strictEqual('preview 2', actuaMatches[0].text());
		assert.ok(new Range(2, 1, 2, 2).equalsRange(actuaMatches[0].range()));
	});


	test('Search Model: Search can return notebook results', async () => {
		const results = [
			aRawMatch('/2',
				new TextSearchMatch('test', new OneLineRange(1, 1, 5)),
				new TextSearchMatch('this is a test', new OneLineRange(1, 11, 15))),
			aRawMatch('/3', new TextSearchMatch('test', lineOneRange))];
		instantiationService.stub(ISearchService, searchServiceWithResults(results, { limitHit: false, messages: [], results }));
		sinon.stub(CellMatch.prototype, 'addContext');

		const mdInputCell = {
			cellKind: CellKind.Markup, textBuffer: <IReadonlyTextBuffer>{
				getLineContent(lineNumber: number): string {
					if (lineNumber === 1) {
						return '# Test';
					} else {
						return '';
					}
				}
			},
			id: 'mdInputCell'
		} as ICellViewModel;

		const findMatchMds = [new FindMatch(new Range(1, 3, 1, 7), ['Test'])];

		const codeCell = {
			cellKind: CellKind.Code, textBuffer: <IReadonlyTextBuffer>{
				getLineContent(lineNumber: number): string {
					if (lineNumber === 1) {
						return 'print("test! testing!!")';
					} else {
						return '';
					}
				}
			},
			id: 'codeCell'
		} as ICellViewModel;

		const findMatchCodeCells =
			[new FindMatch(new Range(1, 8, 1, 12), ['test']),
			new FindMatch(new Range(1, 14, 1, 18), ['test']),
			];
		const webviewMatches = [{
			index: 0,
			searchPreviewInfo: {
				line: 'test! testing!!',
				range: {
					start: 1,
					end: 5
				}
			}
		},
		{
			index: 1,
			searchPreviewInfo: {
				line: 'test! testing!!',
				range: {
					start: 7,
					end: 11
				}
			}
		}
		];
		const cellMatchMd: INotebookCellMatchWithModel = {
			cell: mdInputCell,
			index: 0,
			contentResults: contentMatchesToTextSearchMatches(findMatchMds, mdInputCell),
			webviewResults: []
		};

		const cellMatchCode: INotebookCellMatchWithModel = {
			cell: codeCell,
			index: 1,
			contentResults: contentMatchesToTextSearchMatches(findMatchCodeCells, codeCell),
			webviewResults: webviewMatchesToTextSearchMatches(webviewMatches),
		};

		const notebookSearchService = instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([aRawMatchWithCells('/1', cellMatchMd, cellMatchCode)], undefined));
		const notebookSearch = sinon.spy(notebookSearchService, 'notebookSearch');
		const model: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(model);
		await model.search({ contentPattern: { pattern: 'test' }, type: QueryType.Text, folderQueries }).asyncResults;
		const actual = model.searchResult.matches();

		assert(notebookSearch.calledOnce);

		assert.strictEqual(3, actual.length);
		assert.strictEqual(URI.file(`${getRootName()}/1`).toString(), actual[0].resource.toString());
		const notebookFileMatches = actual[0].matches();

		assert.ok(notebookFileMatches[0].range().equalsRange(new Range(1, 3, 1, 7)));
		assert.ok(notebookFileMatches[1].range().equalsRange(new Range(1, 8, 1, 12)));
		assert.ok(notebookFileMatches[2].range().equalsRange(new Range(1, 14, 1, 18)));
		assert.ok(notebookFileMatches[3].range().equalsRange(new Range(1, 2, 1, 6)));
		assert.ok(notebookFileMatches[4].range().equalsRange(new Range(1, 8, 1, 12)));

		notebookFileMatches.forEach(match => match instanceof MatchInNotebook);
		assert((notebookFileMatches[0] as MatchInNotebook).cell?.id === 'mdInputCell');
		assert((notebookFileMatches[1] as MatchInNotebook).cell?.id === 'codeCell');
		assert((notebookFileMatches[2] as MatchInNotebook).cell?.id === 'codeCell');
		assert((notebookFileMatches[3] as MatchInNotebook).cell?.id === 'codeCell');
		assert((notebookFileMatches[4] as MatchInNotebook).cell?.id === 'codeCell');

		const mdCellMatchProcessed = (notebookFileMatches[0] as MatchInNotebook).cellParent;
		const codeCellMatchProcessed = (notebookFileMatches[1] as MatchInNotebook).cellParent;

		assert(mdCellMatchProcessed.contentMatches.length === 1);
		assert(codeCellMatchProcessed.contentMatches.length === 2);
		assert(codeCellMatchProcessed.webviewMatches.length === 2);

		assert(mdCellMatchProcessed.contentMatches[0] === notebookFileMatches[0]);
		assert(codeCellMatchProcessed.contentMatches[0] === notebookFileMatches[1]);
		assert(codeCellMatchProcessed.contentMatches[1] === notebookFileMatches[2]);
		assert(codeCellMatchProcessed.webviewMatches[0] === notebookFileMatches[3]);
		assert(codeCellMatchProcessed.webviewMatches[1] === notebookFileMatches[4]);

		assert.strictEqual(URI.file(`${getRootName()}/2`).toString(), actual[1].resource.toString());
		assert.strictEqual(URI.file(`${getRootName()}/3`).toString(), actual[2].resource.toString());
	});

	test('Search Model: Search reports telemetry on search completed', async () => {
		const target = instantiationService.spy(ITelemetryService, 'publicLog');
		const results = [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11))),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))];
		instantiationService.stub(ISearchService, searchServiceWithResults(results, { limitHit: false, messages: [], results }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		await testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		assert.ok(target.calledThrice);
		assert.ok(target.calledWith('searchResultsFirstRender'));
		assert.ok(target.calledWith('searchResultsFinished'));
	});

	test('Search Model: Search reports timed telemetry on search when progress is not called', () => {
		const target2 = sinon.spy();
		sinon.stub(nullEvent, 'stop').callsFake(target2);
		const target1 = sinon.stub().returns(nullEvent);
		instantiationService.stub(ITelemetryService, 'publicLog', target1);

		instantiationService.stub(ISearchService, searchServiceWithResults([], { limitHit: false, messages: [], results: [] }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		const result = testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		return result.then(() => {
			return timeout(1).then(() => {
				assert.ok(target1.calledWith('searchResultsFirstRender'));
				assert.ok(target1.calledWith('searchResultsFinished'));
			});
		});
	});

	test('Search Model: Search reports timed telemetry on search when progress is called', () => {
		const target2 = sinon.spy();
		sinon.stub(nullEvent, 'stop').callsFake(target2);
		const target1 = sinon.stub().returns(nullEvent);
		instantiationService.stub(ITelemetryService, 'publicLog', target1);

		instantiationService.stub(ISearchService, searchServiceWithResults(
			[aRawMatch('/1', new TextSearchMatch('some preview', lineOneRange))],
			{ results: [], stats: testSearchStats, messages: [] }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		const result = testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		return result.then(() => {
			return timeout(1).then(() => {
				// timeout because promise handlers may run in a different order. We only care that these
				// are fired at some point.
				assert.ok(target1.calledWith('searchResultsFirstRender'));
				assert.ok(target1.calledWith('searchResultsFinished'));
				// assert.strictEqual(1, target2.callCount);
			});
		});
	});

	test('Search Model: Search reports timed telemetry on search when error is called', () => {
		const target2 = sinon.spy();
		sinon.stub(nullEvent, 'stop').callsFake(target2);
		const target1 = sinon.stub().returns(nullEvent);
		instantiationService.stub(ITelemetryService, 'publicLog', target1);

		instantiationService.stub(ISearchService, searchServiceWithError(new Error('This error should be thrown by this test.')));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		const result = testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		return result.then(() => { }, () => {
			return timeout(1).then(() => {
				assert.ok(target1.calledWith('searchResultsFirstRender'));
				assert.ok(target1.calledWith('searchResultsFinished'));
			});
		});
	});

	test('Search Model: Search reports timed telemetry on search when error is cancelled error', () => {
		const target2 = sinon.spy();
		sinon.stub(nullEvent, 'stop').callsFake(target2);
		const target1 = sinon.stub().returns(nullEvent);
		instantiationService.stub(ITelemetryService, 'publicLog', target1);

		const deferredPromise = new DeferredPromise<ISearchComplete>();

		instantiationService.stub(ISearchService, searchServiceWithDeferredPromise(deferredPromise.p));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		const result = testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;

		deferredPromise.cancel();

		return result.then(() => { }, async () => {
			return timeout(1).then(() => {
				assert.ok(target1.calledWith('searchResultsFirstRender'));
				assert.ok(target1.calledWith('searchResultsFinished'));
				// assert.ok(target2.calledOnce);
			});
		});
	});

	test('Search Model: Search results are cleared during search', async () => {
		const results = [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11))),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))];
		instantiationService.stub(ISearchService, searchServiceWithResults(results, { limitHit: false, messages: [], results: [] }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));
		const testObject: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		await testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries }).asyncResults;
		assert.ok(!testObject.searchResult.isEmpty());

		instantiationService.stub(ISearchService, searchServiceWithResults([]));

		testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries });
		assert.ok(testObject.searchResult.isEmpty());
	});

	test('Search Model: Previous search is cancelled when new search is called', async () => {
		const tokenSource = new CancellationTokenSource();
		store.add(tokenSource);
		instantiationService.stub(ISearchService, canceleableSearchService(tokenSource));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], tokenSource));
		const testObject: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries });
		instantiationService.stub(ISearchService, searchServiceWithResults([]));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));
		testObject.search({ contentPattern: { pattern: 'somestring' }, type: QueryType.Text, folderQueries });

		assert.ok(tokenSource.token.isCancellationRequested);
	});

	test('getReplaceString returns proper replace string for regExpressions', async () => {
		const results = [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11)))];
		instantiationService.stub(ISearchService, searchServiceWithResults(results, { limitHit: false, messages: [], results }));
		instantiationService.stub(INotebookSearchService, notebookSearchServiceWithInfo([], undefined));

		const testObject: SearchModelImpl = instantiationService.createInstance(SearchModelImpl);
		store.add(testObject);
		await testObject.search({ contentPattern: { pattern: 're' }, type: QueryType.Text, folderQueries }).asyncResults;
		testObject.replaceString = 'hello';
		let match = testObject.searchResult.matches()[0].matches()[0];
		assert.strictEqual('hello', match.replaceString);

		await testObject.search({ contentPattern: { pattern: 're', isRegExp: true }, type: QueryType.Text, folderQueries }).asyncResults;
		match = testObject.searchResult.matches()[0].matches()[0];
		assert.strictEqual('hello', match.replaceString);

		await testObject.search({ contentPattern: { pattern: 're(?:vi)', isRegExp: true }, type: QueryType.Text, folderQueries }).asyncResults;
		match = testObject.searchResult.matches()[0].matches()[0];
		assert.strictEqual('hello', match.replaceString);

		await testObject.search({ contentPattern: { pattern: 'r(e)(?:vi)', isRegExp: true }, type: QueryType.Text, folderQueries }).asyncResults;
		match = testObject.searchResult.matches()[0].matches()[0];
		assert.strictEqual('hello', match.replaceString);

		await testObject.search({ contentPattern: { pattern: 'r(e)(?:vi)', isRegExp: true }, type: QueryType.Text, folderQueries }).asyncResults;
		testObject.replaceString = 'hello$1';
		match = testObject.searchResult.matches()[0].matches()[0];
		assert.strictEqual('helloe', match.replaceString);
	});

	function aRawMatch(resource: string, ...results: ITextSearchMatch[]): IFileMatch {
		return { resource: createFileUriFromPathFromRoot(resource), results };
	}

	function aRawMatchWithCells(resource: string, ...cells: INotebookCellMatchWithModel[]) {
		return { resource: createFileUriFromPathFromRoot(resource), cellResults: cells };
	}

	function stubModelService(instantiationService: TestInstantiationService): IModelService {
		instantiationService.stub(IThemeService, new TestThemeService());
		const config = new TestConfigurationService();
		config.setUserConfiguration('search', { searchOnType: true });
		instantiationService.stub(IConfigurationService, config);
		const modelService = instantiationService.createInstance(ModelService);
		store.add(modelService);
		return modelService;
	}

	function stubNotebookEditorService(instantiationService: TestInstantiationService): INotebookEditorService {
		instantiationService.stub(IEditorGroupsService, new TestEditorGroupsService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IEditorService, store.add(new TestEditorService()));
		const notebookEditorWidgetService = instantiationService.createInstance(NotebookEditorWidgetService);
		store.add(notebookEditorWidgetService);
		return notebookEditorWidgetService;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/searchNotebookHelpers.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchNotebookHelpers.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Range } from '../../../../../editor/common/core/range.js';
import { FindMatch, IReadonlyTextBuffer } from '../../../../../editor/common/model.js';
import { IFileMatch, ISearchRange, ITextSearchMatch, QueryType } from '../../../../services/search/common/search.js';
import { ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { CellKind } from '../../../notebook/common/notebookCommon.js';
import { contentMatchesToTextSearchMatches, webviewMatchesToTextSearchMatches } from '../../browser/notebookSearch/searchNotebookHelpers.js';
import { CellFindMatchModel } from '../../../notebook/browser/contrib/find/findModel.js';
import { SearchModelImpl } from '../../browser/searchTreeModel/searchModel.js';
import { URI } from '../../../../../base/common/uri.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { createFileUriFromPathFromRoot, stubModelService, stubNotebookEditorService } from './searchTestCommon.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CellMatch, NotebookCompatibleFileMatch, textSearchMatchesToNotebookMatches } from '../../browser/notebookSearch/notebookSearchModel.js';
import { FolderMatchImpl } from '../../browser/searchTreeModel/folderMatch.js';
import { INotebookFileInstanceMatch } from '../../browser/notebookSearch/notebookSearchModelBase.js';

suite('searchNotebookHelpers', () => {
	let instantiationService: TestInstantiationService;
	let mdCellFindMatch: CellFindMatchModel;
	let codeCellFindMatch: CellFindMatchModel;
	let mdInputCell: ICellViewModel;
	let codeCell: ICellViewModel;

	let markdownContentResults: ITextSearchMatch[];
	let codeContentResults: ITextSearchMatch[];
	let codeWebviewResults: ITextSearchMatch[];
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let counter: number = 0;
	setup(() => {

		instantiationService = new TestInstantiationService();
		store.add(instantiationService);
		const modelService = stubModelService(instantiationService, (e) => store.add(e));
		const notebookEditorService = stubNotebookEditorService(instantiationService, (e) => store.add(e));
		instantiationService.stub(IModelService, modelService);
		instantiationService.stub(INotebookEditorService, notebookEditorService);
		mdInputCell = {
			id: 'mdCell',
			cellKind: CellKind.Markup, textBuffer: <IReadonlyTextBuffer>{
				getLineContent(lineNumber: number): string {
					if (lineNumber === 1) {
						return '# Hello World Test';
					} else {
						return '';
					}
				}
			}
		} as ICellViewModel;

		const findMatchMds = [new FindMatch(new Range(1, 15, 1, 19), ['Test'])];
		codeCell = {
			id: 'codeCell',
			cellKind: CellKind.Code, textBuffer: <IReadonlyTextBuffer>{
				getLineContent(lineNumber: number): string {
					if (lineNumber === 1) {
						return 'print("test! testing!!")';
					} else if (lineNumber === 2) {
						return 'print("this is a Test")';
					} else {
						return '';
					}
				}
			}
		} as ICellViewModel;
		const findMatchCodeCells =
			[new FindMatch(new Range(1, 8, 1, 12), ['test']),
			new FindMatch(new Range(1, 14, 1, 18), ['test']),
			new FindMatch(new Range(2, 18, 2, 22), ['Test'])
			];

		const webviewMatches = [{
			index: 0,
			searchPreviewInfo: {
				line: 'test! testing!!',
				range: {
					start: 1,
					end: 5
				}
			}
		},
		{
			index: 1,
			searchPreviewInfo: {
				line: 'test! testing!!',
				range: {
					start: 7,
					end: 11
				}
			}
		},
		{
			index: 3,
			searchPreviewInfo: {
				line: 'this is a Test',
				range: {
					start: 11,
					end: 15
				}
			}
		}

		];


		mdCellFindMatch = new CellFindMatchModel(
			mdInputCell,
			0,
			findMatchMds,
			[],
		);

		codeCellFindMatch = new CellFindMatchModel(
			codeCell,
			5,
			findMatchCodeCells,
			webviewMatches
		);

	});

	teardown(() => {
		instantiationService.dispose();
	});

	suite('notebookEditorMatchesToTextSearchResults', () => {

		function assertRangesEqual(actual: ISearchRange | ISearchRange[], expected: ISearchRange[]) {
			if (!Array.isArray(actual)) {
				actual = [actual];
			}

			assert.strictEqual(actual.length, expected.length);
			actual.forEach((r, i) => {
				const expectedRange = expected[i];
				assert.deepStrictEqual(
					{ startLineNumber: r.startLineNumber, startColumn: r.startColumn, endLineNumber: r.endLineNumber, endColumn: r.endColumn },
					{ startLineNumber: expectedRange.startLineNumber, startColumn: expectedRange.startColumn, endLineNumber: expectedRange.endLineNumber, endColumn: expectedRange.endColumn });
			});
		}

		test('convert CellFindMatchModel to ITextSearchMatch and check results', () => {
			markdownContentResults = contentMatchesToTextSearchMatches(mdCellFindMatch.contentMatches, mdInputCell);
			codeContentResults = contentMatchesToTextSearchMatches(codeCellFindMatch.contentMatches, codeCell);
			codeWebviewResults = webviewMatchesToTextSearchMatches(codeCellFindMatch.webviewMatches);

			assert.strictEqual(markdownContentResults.length, 1);
			assert.strictEqual(markdownContentResults[0].previewText, '# Hello World Test\n');
			assertRangesEqual(markdownContentResults[0].rangeLocations.map(e => e.preview), [new Range(0, 14, 0, 18)]);
			assertRangesEqual(markdownContentResults[0].rangeLocations.map(e => e.source), [new Range(0, 14, 0, 18)]);


			assert.strictEqual(codeContentResults.length, 2);
			assert.strictEqual(codeContentResults[0].previewText, 'print("test! testing!!")\n');
			assert.strictEqual(codeContentResults[1].previewText, 'print("this is a Test")\n');
			assertRangesEqual(codeContentResults[0].rangeLocations.map(e => e.preview), [new Range(0, 7, 0, 11), new Range(0, 13, 0, 17)]);
			assertRangesEqual(codeContentResults[0].rangeLocations.map(e => e.source), [new Range(0, 7, 0, 11), new Range(0, 13, 0, 17)]);

			assert.strictEqual(codeWebviewResults.length, 3);
			assert.strictEqual(codeWebviewResults[0].previewText, 'test! testing!!');
			assert.strictEqual(codeWebviewResults[1].previewText, 'test! testing!!');
			assert.strictEqual(codeWebviewResults[2].previewText, 'this is a Test');

			assertRangesEqual(codeWebviewResults[0].rangeLocations.map(e => e.preview), [new Range(0, 1, 0, 5)]);
			assertRangesEqual(codeWebviewResults[1].rangeLocations.map(e => e.preview), [new Range(0, 7, 0, 11)]);
			assertRangesEqual(codeWebviewResults[2].rangeLocations.map(e => e.preview), [new Range(0, 11, 0, 15)]);
			assertRangesEqual(codeWebviewResults[0].rangeLocations.map(e => e.source), [new Range(0, 1, 0, 5)]);
			assertRangesEqual(codeWebviewResults[1].rangeLocations.map(e => e.source), [new Range(0, 7, 0, 11)]);
			assertRangesEqual(codeWebviewResults[2].rangeLocations.map(e => e.source), [new Range(0, 11, 0, 15)]);
		});

		test('convert ITextSearchMatch to MatchInNotebook', () => {
			const mdCellMatch = new CellMatch(aFileMatch(), mdInputCell, 0);
			const markdownCellContentMatchObjs = textSearchMatchesToNotebookMatches(markdownContentResults, mdCellMatch);

			const codeCellMatch = new CellMatch(aFileMatch(), codeCell, 0);
			const codeCellContentMatchObjs = textSearchMatchesToNotebookMatches(codeContentResults, codeCellMatch);
			const codeWebviewContentMatchObjs = textSearchMatchesToNotebookMatches(codeWebviewResults, codeCellMatch);


			assert.strictEqual(markdownCellContentMatchObjs[0].cell?.id, mdCellMatch.id);
			assertRangesEqual(markdownCellContentMatchObjs[0].range(), [new Range(1, 15, 1, 19)]);

			assert.strictEqual(codeCellContentMatchObjs[0].cell?.id, codeCellMatch.id);
			assert.strictEqual(codeCellContentMatchObjs[1].cell?.id, codeCellMatch.id);
			assertRangesEqual(codeCellContentMatchObjs[0].range(), [new Range(1, 8, 1, 12)]);
			assertRangesEqual(codeCellContentMatchObjs[1].range(), [new Range(1, 14, 1, 18)]);
			assertRangesEqual(codeCellContentMatchObjs[2].range(), [new Range(2, 18, 2, 22)]);

			assert.strictEqual(codeWebviewContentMatchObjs[0].cell?.id, codeCellMatch.id);
			assert.strictEqual(codeWebviewContentMatchObjs[1].cell?.id, codeCellMatch.id);
			assert.strictEqual(codeWebviewContentMatchObjs[2].cell?.id, codeCellMatch.id);
			assertRangesEqual(codeWebviewContentMatchObjs[0].range(), [new Range(1, 2, 1, 6)]);
			assertRangesEqual(codeWebviewContentMatchObjs[1].range(), [new Range(1, 8, 1, 12)]);
			assertRangesEqual(codeWebviewContentMatchObjs[2].range(), [new Range(1, 12, 1, 16)]);

		});


		function aFileMatch(): INotebookFileInstanceMatch {
			const rawMatch: IFileMatch = {
				resource: URI.file('somepath' + ++counter),
				results: []
			};

			const searchModel = instantiationService.createInstance(SearchModelImpl);
			store.add(searchModel);
			const folderMatch = instantiationService.createInstance(FolderMatchImpl, URI.file('somepath'), '', 0, {
				type: QueryType.Text, folderQueries: [{ folder: createFileUriFromPathFromRoot() }], contentPattern: {
					pattern: ''
				}
			}, searchModel.searchResult.plainTextSearchResult, searchModel.searchResult, null);
			const fileMatch = instantiationService.createInstance(NotebookCompatibleFileMatch, {
				pattern: ''
			}, undefined, undefined, folderMatch, rawMatch, null, '');
			fileMatch.createMatches();
			store.add(folderMatch);
			store.add(fileMatch);

			return fileMatch;
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/searchResult.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchResult.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import * as sinon from 'sinon';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { SearchModelImpl } from '../../browser/searchTreeModel/searchModel.js';
import { URI } from '../../../../../base/common/uri.js';
import { IFileMatch, TextSearchMatch, OneLineRange, ITextSearchMatch, QueryType } from '../../../../services/search/common/search.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ModelService } from '../../../../../editor/common/services/modelService.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IReplaceService } from '../../browser/replace.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { MockLabelService } from '../../../../services/label/test/common/mockLabelService.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { TestEditorGroupsService, TestEditorService } from '../../../../test/browser/workbenchTestServices.js';
import { NotebookEditorWidgetService } from '../../../notebook/browser/services/notebookEditorServiceImpl.js';
import { ICellViewModel } from '../../../notebook/browser/notebookBrowser.js';
import { CellKind } from '../../../notebook/common/notebookCommon.js';
import { addToSearchResult, createFileUriFromPathFromRoot, getRootName } from './searchTestCommon.js';
import { INotebookCellMatchWithModel, INotebookFileMatchWithModel } from '../../browser/notebookSearch/searchNotebookHelpers.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CellMatch, NotebookCompatibleFileMatch } from '../../browser/notebookSearch/notebookSearchModel.js';
import { INotebookFileInstanceMatch } from '../../browser/notebookSearch/notebookSearchModelBase.js';
import { ISearchResult, ISearchTreeFolderMatch, MATCH_PREFIX } from '../../browser/searchTreeModel/searchTreeCommon.js';
import { FolderMatchImpl } from '../../browser/searchTreeModel/folderMatch.js';
import { SearchResultImpl } from '../../browser/searchTreeModel/searchResult.js';
import { MatchImpl } from '../../browser/searchTreeModel/match.js';

const lineOneRange = new OneLineRange(1, 0, 1);

suite('SearchResult', () => {

	let instantiationService: TestInstantiationService;
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		instantiationService = new TestInstantiationService();
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(IModelService, stubModelService(instantiationService));
		instantiationService.stub(INotebookEditorService, stubNotebookEditorService(instantiationService));
		const fileService = new FileService(new NullLogService());
		store.add(fileService);
		const uriIdentityService = new UriIdentityService(fileService);
		store.add(uriIdentityService);
		instantiationService.stub(IUriIdentityService, uriIdentityService);
		instantiationService.stubPromise(IReplaceService, {});
		instantiationService.stub(IReplaceService, 'replace', () => Promise.resolve(null));
		instantiationService.stub(ILabelService, new MockLabelService());
		instantiationService.stub(ILogService, new NullLogService());
	});

	teardown(() => {
		instantiationService.dispose();
	});

	test('Line Match', function () {
		const fileMatch = aFileMatch('folder/file.txt', null!);
		const lineMatch = new MatchImpl(fileMatch, ['0 foo bar'], new OneLineRange(0, 2, 5), new OneLineRange(1, 0, 5), false);
		assert.strictEqual(lineMatch.text(), '0 foo bar');
		assert.strictEqual(lineMatch.range().startLineNumber, 2);
		assert.strictEqual(lineMatch.range().endLineNumber, 2);
		assert.strictEqual(lineMatch.range().startColumn, 1);
		assert.strictEqual(lineMatch.range().endColumn, 6);
		assert.strictEqual(lineMatch.id(), MATCH_PREFIX + 'file:///folder/file.txt>[2,1 -> 2,6]foo');

		assert.strictEqual(lineMatch.fullMatchText(), 'foo');
		assert.strictEqual(lineMatch.fullMatchText(true), '0 foo bar');
	});

	test('Line Match - Remove', function () {
		const fileMatch = aFileMatch('folder/file.txt', aSearchResult(), new TextSearchMatch('foo bar', new OneLineRange(1, 0, 3)));
		const lineMatch = fileMatch.matches()[0];
		fileMatch.remove(lineMatch);
		assert.strictEqual(fileMatch.matches().length, 0);
	});

	test('File Match', function () {
		let fileMatch = aFileMatch('folder/file.txt', aSearchResult());
		assert.strictEqual(fileMatch.matches().length, 0);
		assert.strictEqual(fileMatch.resource.toString(), 'file:///folder/file.txt');
		assert.strictEqual(fileMatch.name(), 'file.txt');

		fileMatch = aFileMatch('file.txt', aSearchResult());
		assert.strictEqual(fileMatch.matches().length, 0);
		assert.strictEqual(fileMatch.resource.toString(), 'file:///file.txt');
		assert.strictEqual(fileMatch.name(), 'file.txt');
	});

	test('File Match: Select an existing match', function () {
		const testObject = aFileMatch(
			'folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));

		testObject.setSelectedMatch(testObject.matches()[0]);

		assert.strictEqual(testObject.matches()[0], testObject.getSelectedMatch());
	});

	test('File Match: Select non existing match', function () {
		const testObject = aFileMatch(
			'folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));
		const target = testObject.matches()[0];
		testObject.remove(target);

		testObject.setSelectedMatch(target);

		assert.strictEqual(testObject.getSelectedMatch(), null);
	});

	test('File Match: isSelected return true for selected match', function () {
		const testObject = aFileMatch(
			'folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));
		const target = testObject.matches()[0];
		testObject.setSelectedMatch(target);

		assert.ok(testObject.isMatchSelected(target));
	});

	test('File Match: isSelected return false for un-selected match', function () {
		const testObject = aFileMatch('folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));
		testObject.setSelectedMatch(testObject.matches()[0]);
		assert.ok(!testObject.isMatchSelected(testObject.matches()[1]));
	});

	test('File Match: unselect', function () {
		const testObject = aFileMatch(
			'folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));
		testObject.setSelectedMatch(testObject.matches()[0]);
		testObject.setSelectedMatch(null);

		assert.strictEqual(null, testObject.getSelectedMatch());
	});

	test('File Match: unselect when not selected', function () {
		const testObject = aFileMatch(
			'folder/file.txt',
			aSearchResult(),
			new TextSearchMatch('foo', new OneLineRange(1, 0, 3)),
			new TextSearchMatch('bar', new OneLineRange(1, 5, 3)));
		testObject.setSelectedMatch(null);

		assert.strictEqual(null, testObject.getSelectedMatch());
	});

	test('Match -> FileMatch -> SearchResult hierarchy exists', function () {

		const searchModel = instantiationService.createInstance(SearchModelImpl);
		store.add(searchModel);
		const searchResult = instantiationService.createInstance(SearchResultImpl, searchModel);
		store.add(searchResult);
		const fileMatch = aFileMatch('far/boo', searchResult);
		const lineMatch = new MatchImpl(fileMatch, ['foo bar'], new OneLineRange(0, 0, 3), new OneLineRange(1, 0, 3), false);

		assert(lineMatch.parent() === fileMatch);
		assert(fileMatch.parent() === searchResult.folderMatches()[0]);
	});

	test('Adding a raw match will add a file match with line matches', function () {
		const testObject = aSearchResult();
		const target = [aRawMatch('/1',
			new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
			new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11)),
			new TextSearchMatch('preview 2', lineOneRange))];

		addToSearchResult(testObject, target);

		assert.strictEqual(3, testObject.count());

		const actual = testObject.matches();
		assert.strictEqual(1, actual.length);
		assert.strictEqual(URI.file(`${getRootName()}/1`).toString(), actual[0].resource.toString());

		const actuaMatches = actual[0].matches();
		assert.strictEqual(3, actuaMatches.length);

		assert.strictEqual('preview 1', actuaMatches[0].text());
		assert.ok(new Range(2, 2, 2, 5).equalsRange(actuaMatches[0].range()));

		assert.strictEqual('preview 1', actuaMatches[1].text());
		assert.ok(new Range(2, 5, 2, 12).equalsRange(actuaMatches[1].range()));

		assert.strictEqual('preview 2', actuaMatches[2].text());
		assert.ok(new Range(2, 1, 2, 2).equalsRange(actuaMatches[2].range()));
	});

	test('Adding multiple raw matches', function () {
		const testObject = aSearchResult();
		const target = [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11))),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))];

		addToSearchResult(testObject, target);

		assert.strictEqual(3, testObject.count());

		const actual = testObject.matches();
		assert.strictEqual(2, actual.length);
		assert.strictEqual(URI.file(`${getRootName()}/1`).toString(), actual[0].resource.toString());

		let actuaMatches = actual[0].matches();
		assert.strictEqual(2, actuaMatches.length);
		assert.strictEqual('preview 1', actuaMatches[0].text());
		assert.ok(new Range(2, 2, 2, 5).equalsRange(actuaMatches[0].range()));
		assert.strictEqual('preview 1', actuaMatches[1].text());
		assert.ok(new Range(2, 5, 2, 12).equalsRange(actuaMatches[1].range()));

		actuaMatches = actual[1].matches();
		assert.strictEqual(1, actuaMatches.length);
		assert.strictEqual('preview 2', actuaMatches[0].text());
		assert.ok(new Range(2, 1, 2, 2).equalsRange(actuaMatches[0].range()));
	});

	test('Test that notebook matches get added correctly', function () {
		const testObject = aSearchResult();
		const cell1 = { cellKind: CellKind.Code } as ICellViewModel;
		const cell2 = { cellKind: CellKind.Code } as ICellViewModel;

		sinon.stub(CellMatch.prototype, 'addContext');

		const addFileMatch = sinon.spy(FolderMatchImpl.prototype, 'addFileMatch');
		const fileMatch1 = aRawFileMatchWithCells('/1',
			{
				cell: cell1,
				index: 0,
				contentResults: [
					new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				],
				webviewResults: [
					new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11)),
					new TextSearchMatch('preview 2', lineOneRange)
				]
			},);
		const fileMatch2 = aRawFileMatchWithCells('/2',
			{
				cell: cell2,
				index: 0,
				contentResults: [
					new TextSearchMatch('preview 1', new OneLineRange(1, 1, 4)),
				],
				webviewResults: [
					new TextSearchMatch('preview 1', new OneLineRange(1, 4, 11)),
					new TextSearchMatch('preview 2', lineOneRange)
				]
			});
		const target = [fileMatch1, fileMatch2];

		addToSearchResult(testObject, target);
		assert.strictEqual(6, testObject.count());
		assert.deepStrictEqual(fileMatch1.cellResults[0].contentResults, (addFileMatch.getCall(0).args[0][0] as INotebookFileMatchWithModel).cellResults[0].contentResults);
		assert.deepStrictEqual(fileMatch1.cellResults[0].webviewResults, (addFileMatch.getCall(0).args[0][0] as INotebookFileMatchWithModel).cellResults[0].webviewResults);
		assert.deepStrictEqual(fileMatch2.cellResults[0].contentResults, (addFileMatch.getCall(0).args[0][1] as INotebookFileMatchWithModel).cellResults[0].contentResults);
		assert.deepStrictEqual(fileMatch2.cellResults[0].webviewResults, (addFileMatch.getCall(0).args[0][1] as INotebookFileMatchWithModel).cellResults[0].webviewResults);
	});

	test('Dispose disposes matches', function () {
		const target1 = sinon.spy();
		const target2 = sinon.spy();

		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange)),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))]);

		store.add(testObject.matches()[0].onDispose(target1));
		store.add(testObject.matches()[1].onDispose(target2));

		testObject.dispose();

		assert.ok(testObject.isEmpty());
		assert.ok(target1.calledOnce);
		assert.ok(target2.calledOnce);
	});

	test('remove triggers change event', function () {
		const target = sinon.spy();
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange))]);
		const objectToRemove = testObject.matches()[0];
		store.add(testObject.onChange(target));

		testObject.remove(objectToRemove);

		assert.ok(target.calledOnce);
		assert.deepStrictEqual([{ elements: [objectToRemove], removed: true }], target.args[0]);
	});

	test('remove array triggers change event', function () {
		const target = sinon.spy();
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange)),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))]);
		const arrayToRemove = testObject.matches();
		store.add(testObject.onChange(target));

		testObject.remove(arrayToRemove);

		assert.ok(target.calledOnce);
		assert.deepStrictEqual([{ elements: arrayToRemove, removed: true }], target.args[0]);
	});

	test('Removing all line matches and adding back will add file back to result', function () {
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange))]);
		const target = testObject.matches()[0];
		const matchToRemove = target.matches()[0];
		target.remove(matchToRemove);

		assert.ok(testObject.isEmpty());
		target.add(matchToRemove, true);

		assert.strictEqual(1, testObject.fileCount());
		assert.strictEqual(target, testObject.matches()[0]);
	});

	test('replace should remove the file match', function () {
		const voidPromise = Promise.resolve(null);
		instantiationService.stub(IReplaceService, 'replace', voidPromise);
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange))]);

		testObject.replace(testObject.matches()[0]);

		return voidPromise.then(() => assert.ok(testObject.isEmpty()));
	});

	test('replace should trigger the change event', function () {
		const target = sinon.spy();
		const voidPromise = Promise.resolve(null);
		instantiationService.stub(IReplaceService, 'replace', voidPromise);
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange))]);

		store.add(testObject.onChange(target));
		const objectToRemove = testObject.matches()[0];

		testObject.replace(objectToRemove);

		return voidPromise.then(() => {
			assert.ok(target.calledOnce);
			assert.deepStrictEqual([{ elements: [objectToRemove], removed: true }], target.args[0]);
		});
	});

	test('replaceAll should remove all file matches', function () {
		const voidPromise = Promise.resolve(null);
		instantiationService.stubPromise(IReplaceService, 'replace', voidPromise);
		const testObject = aSearchResult();
		addToSearchResult(testObject, [
			aRawMatch('/1',
				new TextSearchMatch('preview 1', lineOneRange)),
			aRawMatch('/2',
				new TextSearchMatch('preview 2', lineOneRange))]);

		testObject.replaceAll(null!);

		return voidPromise.then(() => assert.ok(testObject.isEmpty()));
	});

	test('batchRemove should trigger the onChange event correctly', function () {
		const target = sinon.spy();
		const testObject = getPopulatedSearchResult();

		const folderMatch = testObject.folderMatches()[0];
		const fileMatch = testObject.folderMatches()[1].allDownstreamFileMatches()[0];
		const match = testObject.folderMatches()[1].allDownstreamFileMatches()[1].matches()[0];

		const arrayToRemove = [folderMatch, fileMatch, match];
		const expectedArrayResult = folderMatch.allDownstreamFileMatches().concat([fileMatch, match.parent()]);

		store.add(testObject.onChange(target));
		testObject.batchRemove(arrayToRemove);

		assert.ok(target.calledOnce);
		assert.deepStrictEqual([{ elements: expectedArrayResult, removed: true, added: false }], target.args[0]);
	});

	test('batchReplace should trigger the onChange event correctly', async function () {
		const replaceSpy = sinon.spy();
		instantiationService.stub(IReplaceService, 'replace', (arg: any) => {
			if (Array.isArray(arg)) {
				replaceSpy(arg[0]);
			} else {
				replaceSpy(arg);
			}
			return Promise.resolve();
		});

		const target = sinon.spy();
		const testObject = getPopulatedSearchResult();

		const folderMatch = testObject.folderMatches()[0];
		const fileMatch = testObject.folderMatches()[1].allDownstreamFileMatches()[0];
		const match = testObject.folderMatches()[1].allDownstreamFileMatches()[1].matches()[0];

		const firstExpectedMatch = folderMatch.allDownstreamFileMatches()[0];

		const arrayToRemove = [folderMatch, fileMatch, match];

		store.add(testObject.onChange(target));
		await testObject.batchReplace(arrayToRemove);

		assert.ok(target.calledOnce);
		sinon.assert.calledThrice(replaceSpy);
		sinon.assert.calledWith(replaceSpy.firstCall, firstExpectedMatch);
		sinon.assert.calledWith(replaceSpy.secondCall, fileMatch);
		sinon.assert.calledWith(replaceSpy.thirdCall, match);
	});

	test('Creating a model with nested folders should create the correct structure', function () {
		const testObject = getPopulatedSearchResultForTreeTesting();

		const root0 = testObject.folderMatches()[0];
		const root1 = testObject.folderMatches()[1];
		const root2 = testObject.folderMatches()[2];
		const root3 = testObject.folderMatches()[3];

		const root0DownstreamFiles = root0.allDownstreamFileMatches();
		assert.deepStrictEqual(root0DownstreamFiles, [...root0.fileMatchesIterator(), ...getFolderMatchAtIndex(root0, 0).fileMatchesIterator()]);
		assert.deepStrictEqual(getFolderMatchAtIndex(root0, 0).allDownstreamFileMatches(), Array.from(getFolderMatchAtIndex(root0, 0).fileMatchesIterator()));
		assert.deepStrictEqual(getFileMatchAtIndex(getFolderMatchAtIndex(root0, 0), 0).parent(), getFolderMatchAtIndex(root0, 0));
		assert.deepStrictEqual(getFolderMatchAtIndex(root0, 0).parent(), root0);
		assert.deepStrictEqual((getFolderMatchAtIndex(root0, 0) as FolderMatchImpl).closestRoot, root0);
		root0DownstreamFiles.forEach((e) => {
			assert.deepStrictEqual(e.closestRoot, root0);
		});

		const root1DownstreamFiles = root1.allDownstreamFileMatches();
		assert.deepStrictEqual(root1.allDownstreamFileMatches(), [...root1.fileMatchesIterator(), ...getFolderMatchAtIndex(root1, 0).fileMatchesIterator()]); // excludes the matches from nested root
		assert.deepStrictEqual(getFileMatchAtIndex(getFolderMatchAtIndex(root1, 0), 0).parent(), getFolderMatchAtIndex(root1, 0));
		root1DownstreamFiles.forEach((e) => {
			assert.deepStrictEqual(e.closestRoot, root1);
		});

		const root2DownstreamFiles = root2.allDownstreamFileMatches();
		assert.deepStrictEqual(root2DownstreamFiles, Array.from(root2.fileMatchesIterator()));
		assert.deepStrictEqual(getFileMatchAtIndex(root2, 0).parent(), root2);
		assert.deepStrictEqual(getFileMatchAtIndex(root2, 0).closestRoot, root2);


		const root3DownstreamFiles = root3.allDownstreamFileMatches();
		const root3Level3Folder = getFolderMatchAtIndex(getFolderMatchAtIndex(root3, 0), 0);
		assert.deepStrictEqual(root3DownstreamFiles, [...root3.fileMatchesIterator(), ...getFolderMatchAtIndex(root3Level3Folder, 0).fileMatchesIterator(), ...getFolderMatchAtIndex(root3Level3Folder, 1).fileMatchesIterator()].flat());
		assert.deepStrictEqual(root3Level3Folder.allDownstreamFileMatches(), getFolderMatchAtIndex(root3, 0).allDownstreamFileMatches());

		assert.deepStrictEqual(getFileMatchAtIndex(getFolderMatchAtIndex(root3Level3Folder, 1), 0).parent(), getFolderMatchAtIndex(root3Level3Folder, 1));
		assert.deepStrictEqual(getFolderMatchAtIndex(root3Level3Folder, 1).parent(), root3Level3Folder);
		assert.deepStrictEqual(root3Level3Folder.parent(), getFolderMatchAtIndex(root3, 0));

		root3DownstreamFiles.forEach((e) => {
			assert.deepStrictEqual(e.closestRoot, root3);
		});
	});

	test('Removing an intermediate folder should call OnChange() on all downstream file matches', function () {
		const target = sinon.spy();
		const testObject = getPopulatedSearchResultForTreeTesting();

		const folderMatch = getFolderMatchAtIndex(getFolderMatchAtIndex(getFolderMatchAtIndex(testObject.folderMatches()[3], 0), 0), 0);

		const expectedArrayResult = folderMatch.allDownstreamFileMatches();

		store.add(testObject.onChange(target));
		testObject.remove(folderMatch);
		assert.ok(target.calledOnce);
		assert.deepStrictEqual([{ elements: expectedArrayResult, removed: true, added: false, clearingAll: false }], target.args[0]);
	});

	test('Replacing an intermediate folder should remove all downstream folders and file matches', async function () {
		const target = sinon.spy();
		const testObject = getPopulatedSearchResultForTreeTesting();

		const folderMatch = getFolderMatchAtIndex(testObject.folderMatches()[3], 0);

		const expectedArrayResult = folderMatch.allDownstreamFileMatches();

		store.add(testObject.onChange(target));
		await testObject.batchReplace([folderMatch]);
		assert.deepStrictEqual([{ elements: expectedArrayResult, removed: true, added: false }], target.args[0]);

	});

	function aFileMatch(path: string, searchResult: ISearchResult | undefined, ...lineMatches: ITextSearchMatch[]): INotebookFileInstanceMatch {
		if (!searchResult) {
			searchResult = aSearchResult();
		}
		const rawMatch: IFileMatch = {
			resource: URI.file('/' + path),
			results: lineMatches
		};
		const root = searchResult?.folderMatches()[0];
		const fileMatch = instantiationService.createInstance(NotebookCompatibleFileMatch, {
			pattern: ''
		}, undefined, undefined, root, rawMatch, null, '');
		fileMatch.createMatches();

		store.add(fileMatch);
		return fileMatch;
	}

	function aSearchResult(): ISearchResult {
		const searchModel = instantiationService.createInstance(SearchModelImpl);
		store.add(searchModel);
		searchModel.searchResult.query = {
			type: QueryType.Text, folderQueries: [{ folder: createFileUriFromPathFromRoot() }], contentPattern: {
				pattern: ''
			}
		};
		return searchModel.searchResult;
	}

	function aRawMatch(resource: string, ...results: ITextSearchMatch[]): IFileMatch {
		return { resource: createFileUriFromPathFromRoot(resource), results };
	}

	function aRawFileMatchWithCells(resource: string, ...cellMatches: INotebookCellMatchWithModel[]): INotebookFileMatchWithModel {
		return {
			resource: createFileUriFromPathFromRoot(resource),
			cellResults: cellMatches
		};
	}

	function stubModelService(instantiationService: TestInstantiationService): IModelService {
		instantiationService.stub(IThemeService, new TestThemeService());
		const config = new TestConfigurationService();
		config.setUserConfiguration('search', { searchOnType: true });
		instantiationService.stub(IConfigurationService, config);
		const modelService = instantiationService.createInstance(ModelService);
		store.add(modelService);
		return modelService;
	}

	function stubNotebookEditorService(instantiationService: TestInstantiationService): INotebookEditorService {
		instantiationService.stub(IEditorGroupsService, new TestEditorGroupsService());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IEditorService, store.add(new TestEditorService()));
		const notebookEditorWidgetService = instantiationService.createInstance(NotebookEditorWidgetService);
		store.add(notebookEditorWidgetService);
		return notebookEditorWidgetService;
	}

	function getPopulatedSearchResult() {
		const testObject = aSearchResult();

		testObject.query = {
			type: QueryType.Text,
			contentPattern: { pattern: 'foo' },
			folderQueries: [{
				folder: createFileUriFromPathFromRoot('/voo')
			},
			{ folder: createFileUriFromPathFromRoot('/with') },
			]
		};

		addToSearchResult(testObject, [
			aRawMatch('/voo/foo.a',
				new TextSearchMatch('preview 1', lineOneRange), new TextSearchMatch('preview 2', lineOneRange)),
			aRawMatch('/with/path/bar.b',
				new TextSearchMatch('preview 3', lineOneRange)),
			aRawMatch('/with/path.c',
				new TextSearchMatch('preview 4', lineOneRange), new TextSearchMatch('preview 5', lineOneRange)),
		]);
		return testObject;
	}

	function getPopulatedSearchResultForTreeTesting() {
		const testObject = aSearchResult();

		testObject.query = {
			type: QueryType.Text,
			contentPattern: { pattern: 'foo' },
			folderQueries: [{
				folder: createFileUriFromPathFromRoot('/voo')
			},
			{
				folder: createFileUriFromPathFromRoot('/with')
			},
			{
				folder: createFileUriFromPathFromRoot('/with/test')
			},
			{
				folder: createFileUriFromPathFromRoot('/eep')
			},
			]
		};
		/***
		 * file structure looks like:
		 * *voo/
		 * |- foo.a
		 * |- beep
		 *    |- foo.c
		 * 	  |- boop.c
		 * *with/
		 * |- path
		 *    |- bar.b
		 * |- path.c
		 * |- *test/
		 *    |- woo.c
		 * eep/
		 *    |- bar
		 *       |- goo
		 *           |- foo
		 *              |- here.txt
		 * 			 |- ooo
		 *              |- there.txt
		 *    |- eyy.y
		 */

		addToSearchResult(testObject, [
			aRawMatch('/voo/foo.a',
				new TextSearchMatch('preview 1', lineOneRange), new TextSearchMatch('preview 2', lineOneRange)),
			aRawMatch('/voo/beep/foo.c',
				new TextSearchMatch('preview 1', lineOneRange), new TextSearchMatch('preview 2', lineOneRange)),
			aRawMatch('/voo/beep/boop.c',
				new TextSearchMatch('preview 3', lineOneRange)),
			aRawMatch('/with/path.c',
				new TextSearchMatch('preview 4', lineOneRange), new TextSearchMatch('preview 5', lineOneRange)),
			aRawMatch('/with/path/bar.b',
				new TextSearchMatch('preview 3', lineOneRange)),
			aRawMatch('/with/test/woo.c',
				new TextSearchMatch('preview 3', lineOneRange)),
			aRawMatch('/eep/bar/goo/foo/here.txt',
				new TextSearchMatch('preview 6', lineOneRange), new TextSearchMatch('preview 7', lineOneRange)),
			aRawMatch('/eep/bar/goo/ooo/there.txt',
				new TextSearchMatch('preview 6', lineOneRange), new TextSearchMatch('preview 7', lineOneRange)),
			aRawMatch('/eep/eyy.y',
				new TextSearchMatch('preview 6', lineOneRange), new TextSearchMatch('preview 7', lineOneRange))
		]);
		return testObject;
	}

	function getFolderMatchAtIndex(parent: ISearchTreeFolderMatch, index: number) {
		return Array.from(parent.folderMatchesIterator())[index];
	}

	function getFileMatchAtIndex(parent: ISearchTreeFolderMatch, index: number) {
		return Array.from(parent.fileMatchesIterator())[index];
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/searchTestCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchTestCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { isWindows } from '../../../../../base/common/platform.js';
import { URI } from '../../../../../base/common/uri.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ModelService } from '../../../../../editor/common/services/modelService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { NotebookEditorWidgetService } from '../../../notebook/browser/services/notebookEditorServiceImpl.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IFileMatch } from '../../../../services/search/common/search.js';
import { TestEditorGroupsService, TestEditorService } from '../../../../test/browser/workbenchTestServices.js';
import { ISearchResult } from '../../browser/searchTreeModel/searchTreeCommon.js';

export function createFileUriFromPathFromRoot(path?: string): URI {
	const rootName = getRootName();
	if (path) {
		return URI.file(`${rootName}${path}`);
	} else {
		if (isWindows) {
			return URI.file(`${rootName}/`);
		} else {
			return URI.file(rootName);
		}
	}
}

export function getRootName(): string {
	if (isWindows) {
		return 'c:';
	} else {
		return '';
	}
}

export function stubModelService(instantiationService: TestInstantiationService, addDisposable: (e: IDisposable) => void): IModelService {
	instantiationService.stub(IThemeService, new TestThemeService());
	const config = new TestConfigurationService();
	config.setUserConfiguration('search', { searchOnType: true });
	instantiationService.stub(IConfigurationService, config);
	const modelService = instantiationService.createInstance(ModelService);
	addDisposable(modelService);
	return modelService;
}

export function stubNotebookEditorService(instantiationService: TestInstantiationService, addDisposable: (e: IDisposable) => void): INotebookEditorService {
	instantiationService.stub(IEditorGroupsService, new TestEditorGroupsService());
	instantiationService.stub(IContextKeyService, new MockContextKeyService());
	const es = new TestEditorService();
	addDisposable(es);
	instantiationService.stub(IEditorService, es);
	const notebookEditorWidgetService = instantiationService.createInstance(NotebookEditorWidgetService);
	addDisposable(notebookEditorWidgetService);
	return notebookEditorWidgetService;
}

export function addToSearchResult(searchResult: ISearchResult, allRaw: IFileMatch[], searchInstanceID = '') {
	searchResult.add(allRaw, searchInstanceID, false);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/browser/searchViewlet.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/browser/searchViewlet.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ILanguageConfigurationService } from '../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { TestLanguageConfigurationService } from '../../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';
import { TestWorkspace } from '../../../../../platform/workspace/test/common/testWorkspace.js';
import { SearchModelImpl } from '../../browser/searchTreeModel/searchModel.js';
import { MockLabelService } from '../../../../services/label/test/common/mockLabelService.js';
import { IFileMatch, ITextSearchMatch, OneLineRange, QueryType, SearchSortOrder } from '../../../../services/search/common/search.js';
import { TestContextService } from '../../../../test/common/workbenchTestServices.js';
import { INotebookEditorService } from '../../../notebook/browser/services/notebookEditorService.js';
import { createFileUriFromPathFromRoot, getRootName, stubModelService, stubNotebookEditorService } from './searchTestCommon.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ISearchTreeFolderMatch, ISearchResult, ITextSearchHeading, FILE_MATCH_PREFIX, MATCH_PREFIX } from '../../browser/searchTreeModel/searchTreeCommon.js';
import { NotebookCompatibleFileMatch } from '../../browser/notebookSearch/notebookSearchModel.js';
import { INotebookFileInstanceMatch } from '../../browser/notebookSearch/notebookSearchModelBase.js';
import { FolderMatchImpl } from '../../browser/searchTreeModel/folderMatch.js';
import { searchComparer, searchMatchComparer } from '../../browser/searchCompare.js';
import { MatchImpl } from '../../browser/searchTreeModel/match.js';

suite('Search - Viewlet', () => {
	let instantiation: TestInstantiationService;
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		instantiation = new TestInstantiationService();
		instantiation.stub(ILanguageConfigurationService, TestLanguageConfigurationService);
		instantiation.stub(IModelService, stubModelService(instantiation, (e) => store.add(e)));
		instantiation.stub(INotebookEditorService, stubNotebookEditorService(instantiation, (e) => store.add(e)));

		instantiation.set(IWorkspaceContextService, new TestContextService(TestWorkspace));
		const fileService = new FileService(new NullLogService());
		store.add(fileService);
		const uriIdentityService = new UriIdentityService(fileService);
		store.add(uriIdentityService);
		instantiation.stub(IUriIdentityService, uriIdentityService);
		instantiation.stub(ILabelService, new MockLabelService());
		instantiation.stub(ILogService, new NullLogService());
	});

	teardown(() => {
		instantiation.dispose();
	});

	test('Data Source', function () {
		const result: ISearchResult = aSearchResult();
		result.query = {
			type: QueryType.Text,
			contentPattern: { pattern: 'foo' },
			folderQueries: [{
				folder: createFileUriFromPathFromRoot()
			}]
		};

		result.add([{
			resource: createFileUriFromPathFromRoot('/foo'),
			results: [{

				previewText: 'bar',
				rangeLocations: [
					{
						preview: {
							startLineNumber: 0,
							startColumn: 0,
							endLineNumber: 0,
							endColumn: 1
						},
						source: {
							startLineNumber: 1,
							startColumn: 0,
							endLineNumber: 1,
							endColumn: 1
						}
					}
				]
			}]
		}], '', false);

		const fileMatch = result.matches()[0];
		const lineMatch = fileMatch.matches()[0];

		assert.strictEqual(fileMatch.id(), FILE_MATCH_PREFIX + URI.file(`${getRootName()}/foo`).toString());
		assert.strictEqual(lineMatch.id(), `${MATCH_PREFIX}${URI.file(`${getRootName()}/foo`).toString()}>[2,1 -> 2,2]b`);
	});

	test('Comparer', () => {
		const fileMatch1 = aFileMatch('/foo');
		const fileMatch2 = aFileMatch('/with/path');
		const fileMatch3 = aFileMatch('/with/path/foo');
		const lineMatch1 = new MatchImpl(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(0, 1, 1), false);
		const lineMatch2 = new MatchImpl(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1), false);
		const lineMatch3 = new MatchImpl(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1), false);

		assert(searchMatchComparer(fileMatch1, fileMatch2) < 0);
		assert(searchMatchComparer(fileMatch2, fileMatch1) > 0);
		assert(searchMatchComparer(fileMatch1, fileMatch1) === 0);
		assert(searchMatchComparer(fileMatch2, fileMatch3) < 0);

		assert(searchMatchComparer(lineMatch1, lineMatch2) < 0);
		assert(searchMatchComparer(lineMatch2, lineMatch1) > 0);
		assert(searchMatchComparer(lineMatch2, lineMatch3) === 0);
	});

	test('Advanced Comparer', () => {
		const fileMatch1 = aFileMatch('/with/path/foo10');
		const fileMatch2 = aFileMatch('/with/path2/foo1');
		const fileMatch3 = aFileMatch('/with/path/bar.a');
		const fileMatch4 = aFileMatch('/with/path/bar.b');

		// By default, path < path2
		assert(searchMatchComparer(fileMatch1, fileMatch2) < 0);
		// By filenames, foo10 > foo1
		assert(searchMatchComparer(fileMatch1, fileMatch2, SearchSortOrder.FileNames) > 0);
		// By type, bar.a < bar.b
		assert(searchMatchComparer(fileMatch3, fileMatch4, SearchSortOrder.Type) < 0);
	});

	test('Cross-type Comparer', () => {

		const searchResult = aSearchResult();
		const folderMatch1 = aFolderMatch('/voo', 0, searchResult.plainTextSearchResult);
		const folderMatch2 = aFolderMatch('/with', 1, searchResult.plainTextSearchResult);

		const fileMatch1 = aFileMatch('/voo/foo.a', folderMatch1);
		const fileMatch2 = aFileMatch('/with/path.c', folderMatch2);
		const fileMatch3 = aFileMatch('/with/path/bar.b', folderMatch2);

		const lineMatch1 = new MatchImpl(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(0, 1, 1), false);
		const lineMatch2 = new MatchImpl(fileMatch1, ['bar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1), false);

		const lineMatch3 = new MatchImpl(fileMatch2, ['barfoo'], new OneLineRange(0, 1, 1), new OneLineRange(0, 1, 1), false);
		const lineMatch4 = new MatchImpl(fileMatch2, ['fooooo'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1), false);

		const lineMatch5 = new MatchImpl(fileMatch3, ['foobar'], new OneLineRange(0, 1, 1), new OneLineRange(2, 1, 1), false);

		/***
		 * Structure would take the following form:
		 *
		 *	folderMatch1 (voo)
		 *		> fileMatch1 (/foo.a)
		 *			>> lineMatch1
		 *			>> lineMatch2
		 *	folderMatch2 (with)
		 *		> fileMatch2 (/path.c)
		 *			>> lineMatch4
		 *			>> lineMatch5
		 *		> fileMatch3 (/path/bar.b)
		 *			>> lineMatch3
		 *
		 */

		// for these, refer to diagram above
		assert(searchComparer(fileMatch1, fileMatch3) < 0);
		assert(searchComparer(fileMatch2, fileMatch3) < 0);
		assert(searchComparer(folderMatch2, fileMatch2) < 0);
		assert(searchComparer(lineMatch4, lineMatch5) < 0);
		assert(searchComparer(lineMatch1, lineMatch3) < 0);
		assert(searchComparer(lineMatch2, folderMatch2) < 0);

		// travel up hierarchy and order of folders take precedence. "voo < with" in indices
		assert(searchComparer(fileMatch1, fileMatch3, SearchSortOrder.FileNames) < 0);
		// bar.b < path.c
		assert(searchComparer(fileMatch3, fileMatch2, SearchSortOrder.FileNames) < 0);
		// lineMatch4's parent is fileMatch2, "bar.b < path.c"
		assert(searchComparer(fileMatch3, lineMatch4, SearchSortOrder.FileNames) < 0);

		// bar.b < path.c
		assert(searchComparer(fileMatch3, fileMatch2, SearchSortOrder.Type) < 0);
		// lineMatch4's parent is fileMatch2, "bar.b < path.c"
		assert(searchComparer(fileMatch3, lineMatch4, SearchSortOrder.Type) < 0);
	});

	function aFileMatch(path: string, parentFolder?: ISearchTreeFolderMatch, ...lineMatches: ITextSearchMatch[]): INotebookFileInstanceMatch {
		const rawMatch: IFileMatch = {
			resource: URI.file('/' + path),
			results: lineMatches
		};
		const fileMatch = instantiation.createInstance(NotebookCompatibleFileMatch, {
			pattern: ''
		}, undefined, undefined, parentFolder ?? aFolderMatch('', 0), rawMatch, null, '');
		fileMatch.createMatches();
		store.add(fileMatch);
		return fileMatch;
	}

	function aFolderMatch(path: string, index: number, parent?: ITextSearchHeading): ISearchTreeFolderMatch {
		const searchModel = instantiation.createInstance(SearchModelImpl);
		store.add(searchModel);
		const folderMatch = instantiation.createInstance(FolderMatchImpl, createFileUriFromPathFromRoot(path), path, index, {
			type: QueryType.Text, folderQueries: [{ folder: createFileUriFromPathFromRoot() }], contentPattern: {
				pattern: ''
			}
		}, (parent ?? aSearchResult().folderMatches()[0]) as FolderMatchImpl, searchModel.searchResult, null);
		store.add(folderMatch);
		return folderMatch;
	}

	function aSearchResult(): ISearchResult {
		const searchModel = instantiation.createInstance(SearchModelImpl);
		store.add(searchModel);

		searchModel.searchResult.query = {
			type: QueryType.Text, folderQueries: [{ folder: createFileUriFromPathFromRoot() }], contentPattern: {
				pattern: ''
			}
		};
		return searchModel.searchResult;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/common/cacheState.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/common/cacheState.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as errors from '../../../../../base/common/errors.js';
import { QueryType, IFileQuery } from '../../../../services/search/common/search.js';
import { FileQueryCacheState } from '../../common/cacheState.js';
import { DeferredPromise } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('FileQueryCacheState', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('reuse old cacheKey until new cache is loaded', async function () {

		const cache = new MockCache();

		const first = createCacheState(cache);
		const firstKey = first.cacheKey;
		assert.strictEqual(first.isLoaded, false);
		assert.strictEqual(first.isUpdating, false);

		first.load();
		assert.strictEqual(first.isLoaded, false);
		assert.strictEqual(first.isUpdating, true);

		await cache.loading[firstKey].complete(null);
		assert.strictEqual(first.isLoaded, true);
		assert.strictEqual(first.isUpdating, false);

		const second = createCacheState(cache, first);
		second.load();
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, true);
		await cache.awaitDisposal(0);
		assert.strictEqual(second.cacheKey, firstKey); // still using old cacheKey

		const secondKey = cache.cacheKeys[1];
		await cache.loading[secondKey].complete(null);
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(1);
		assert.strictEqual(second.cacheKey, secondKey);
	});

	test('do not spawn additional load if previous is still loading', async function () {

		const cache = new MockCache();

		const first = createCacheState(cache);
		const firstKey = first.cacheKey;
		first.load();
		assert.strictEqual(first.isLoaded, false);
		assert.strictEqual(first.isUpdating, true);
		assert.strictEqual(Object.keys(cache.loading).length, 1);

		const second = createCacheState(cache, first);
		second.load();
		assert.strictEqual(second.isLoaded, false);
		assert.strictEqual(second.isUpdating, true);
		assert.strictEqual(cache.cacheKeys.length, 2);
		assert.strictEqual(Object.keys(cache.loading).length, 1); // still only one loading
		assert.strictEqual(second.cacheKey, firstKey);

		await cache.loading[firstKey].complete(null);
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(0);
	});

	test('do not use previous cacheKey if query changed', async function () {

		const cache = new MockCache();

		const first = createCacheState(cache);
		const firstKey = first.cacheKey;
		first.load();
		await cache.loading[firstKey].complete(null);
		assert.strictEqual(first.isLoaded, true);
		assert.strictEqual(first.isUpdating, false);
		await cache.awaitDisposal(0);

		cache.baseQuery.excludePattern = { '**/node_modules': true };
		const second = createCacheState(cache, first);
		assert.strictEqual(second.isLoaded, false);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(1);

		second.load();
		assert.strictEqual(second.isLoaded, false);
		assert.strictEqual(second.isUpdating, true);
		assert.notStrictEqual(second.cacheKey, firstKey); // not using old cacheKey
		const secondKey = cache.cacheKeys[1];
		assert.strictEqual(second.cacheKey, secondKey);

		await cache.loading[secondKey].complete(null);
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(1);
	});

	test('dispose propagates', async function () {

		const cache = new MockCache();

		const first = createCacheState(cache);
		const firstKey = first.cacheKey;
		first.load();
		await cache.loading[firstKey].complete(null);
		const second = createCacheState(cache, first);
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(0);

		second.dispose();
		assert.strictEqual(second.isLoaded, false);
		assert.strictEqual(second.isUpdating, false);
		await cache.awaitDisposal(1);
		assert.ok(cache.disposing[firstKey]);
	});

	test('keep using old cacheKey when loading fails', async function () {

		const cache = new MockCache();

		const first = createCacheState(cache);
		const firstKey = first.cacheKey;
		first.load();
		await cache.loading[firstKey].complete(null);

		const second = createCacheState(cache, first);
		second.load();
		const secondKey = cache.cacheKeys[1];
		const origErrorHandler = errors.errorHandler.getUnexpectedErrorHandler();
		try {
			errors.setUnexpectedErrorHandler(() => null);
			await cache.loading[secondKey].error('loading failed');
		} finally {
			errors.setUnexpectedErrorHandler(origErrorHandler);
		}
		assert.strictEqual(second.isLoaded, true);
		assert.strictEqual(second.isUpdating, false);
		assert.strictEqual(Object.keys(cache.loading).length, 2);
		await cache.awaitDisposal(0);
		assert.strictEqual(second.cacheKey, firstKey); // keep using old cacheKey

		const third = createCacheState(cache, second);
		third.load();
		assert.strictEqual(third.isLoaded, true);
		assert.strictEqual(third.isUpdating, true);
		assert.strictEqual(Object.keys(cache.loading).length, 3);
		await cache.awaitDisposal(0);
		assert.strictEqual(third.cacheKey, firstKey);

		const thirdKey = cache.cacheKeys[2];
		await cache.loading[thirdKey].complete(null);
		assert.strictEqual(third.isLoaded, true);
		assert.strictEqual(third.isUpdating, false);
		assert.strictEqual(Object.keys(cache.loading).length, 3);
		await cache.awaitDisposal(2);
		assert.strictEqual(third.cacheKey, thirdKey); // recover with next successful load
	});

	function createCacheState(cache: MockCache, previous?: FileQueryCacheState): FileQueryCacheState {
		return new FileQueryCacheState(
			cacheKey => cache.query(cacheKey),
			query => cache.load(query),
			cacheKey => cache.dispose(cacheKey),
			previous
		);
	}

	class MockCache {

		public cacheKeys: string[] = [];
		public loading: { [cacheKey: string]: DeferredPromise<any> } = {};
		public disposing: { [cacheKey: string]: DeferredPromise<void> } = {};

		private _awaitDisposal: (() => void)[][] = [];

		public baseQuery: IFileQuery = {
			type: QueryType.File,
			folderQueries: []
		};

		public query(cacheKey: string): IFileQuery {
			this.cacheKeys.push(cacheKey);
			return Object.assign({ cacheKey: cacheKey }, this.baseQuery);
		}

		public load(query: IFileQuery): Promise<any> {
			const promise = new DeferredPromise<any>();
			this.loading[query.cacheKey!] = promise;
			return promise.p;
		}

		public dispose(cacheKey: string): Promise<void> {
			const promise = new DeferredPromise<void>();
			this.disposing[cacheKey] = promise;
			const n = Object.keys(this.disposing).length;
			for (const done of this._awaitDisposal[n] || []) {
				done();
			}
			delete this._awaitDisposal[n];
			return promise.p;
		}

		public awaitDisposal(n: number) {
			return new Promise<void>(resolve => {
				if (n === Object.keys(this.disposing).length) {
					resolve();
				} else {
					(this._awaitDisposal[n] || (this._awaitDisposal[n] = [])).push(resolve);
				}
			});
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/search/test/common/extractRange.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/search/test/common/extractRange.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { extractRangeFromFilter } from '../../common/search.js';

suite('extractRangeFromFilter', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('basics', async function () {
		assert.ok(!extractRangeFromFilter(''));
		assert.ok(!extractRangeFromFilter('/some/path'));
		assert.ok(!extractRangeFromFilter('/some/path/file.txt'));

		for (const lineSep of [':', '#', '(', ':line ']) {
			for (const colSep of [':', '#', ',']) {
				const base = '/some/path/file.txt';

				let res = extractRangeFromFilter(`${base}${lineSep}20`);
				assert.strictEqual(res?.filter, base);
				assert.strictEqual(res?.range.startLineNumber, 20);
				assert.strictEqual(res?.range.startColumn, 1);

				res = extractRangeFromFilter(`${base}${lineSep}20${colSep}`);
				assert.strictEqual(res?.filter, base);
				assert.strictEqual(res?.range.startLineNumber, 20);
				assert.strictEqual(res?.range.startColumn, 1);

				res = extractRangeFromFilter(`${base}${lineSep}20${colSep}3`);
				assert.strictEqual(res?.filter, base);
				assert.strictEqual(res?.range.startLineNumber, 20);
				assert.strictEqual(res?.range.startColumn, 3);
			}
		}
	});

	test('allow space after path', async function () {
		const res = extractRangeFromFilter('/some/path/file.txt (19,20)');

		assert.strictEqual(res?.filter, '/some/path/file.txt');
		assert.strictEqual(res?.range.startLineNumber, 19);
		assert.strictEqual(res?.range.startColumn, 20);
	});

	suite('unless', function () {
		const testSpecs = [
			// alpha-only symbol after unless
			{ filter: '/some/path/file.txt@alphasymbol', unless: ['@'], result: undefined },
			// unless as first char
			{ filter: '@/some/path/file.txt (19,20)', unless: ['@'], result: undefined },
			// unless as last char
			{ filter: '/some/path/file.txt (19,20)@', unless: ['@'], result: undefined },
			// unless before ,
			{
				filter: '/some/@path/file.txt (19,20)', unless: ['@'], result: {
					filter: '/some/@path/file.txt',
					range: {
						endColumn: 20,
						endLineNumber: 19,
						startColumn: 20,
						startLineNumber: 19
					}
				}
			},
			// unless before :
			{
				filter: '/some/@path/file.txt:19:20', unless: ['@'], result: {
					filter: '/some/@path/file.txt',
					range: {
						endColumn: 20,
						endLineNumber: 19,
						startColumn: 20,
						startLineNumber: 19
					}
				}
			},
			// unless before #
			{
				filter: '/some/@path/file.txt#19', unless: ['@'], result: {
					filter: '/some/@path/file.txt',
					range: {
						endColumn: 1,
						endLineNumber: 19,
						startColumn: 1,
						startLineNumber: 19
					}
				}
			},
		];
		for (const { filter, unless, result } of testSpecs) {
			test(`${filter} - ${JSON.stringify(unless)}`, () => {
				assert.deepStrictEqual(extractRangeFromFilter(filter, unless), result);
			});
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/constants.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/constants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const InSearchEditor = new RawContextKey<boolean>('inSearchEditor', false);

export const SearchEditorScheme = 'search-editor';

export const SearchEditorWorkingCopyTypeId = 'search/editor';

export const SearchEditorFindMatchClass = 'searchEditorFindMatch';

export const SearchEditorID = 'workbench.editor.searchEditor';

export const OpenNewEditorCommandId = 'search.action.openNewEditor';
export const OpenEditorCommandId = 'search.action.openEditor';
export const ToggleSearchEditorContextLinesCommandId = 'toggleSearchEditorContextLines';

export const SearchEditorInputTypeId = 'workbench.editorinputs.searchEditorInput';
export type SearchConfiguration = {
	query: string;
	filesToInclude: string;
	filesToExclude: string;
	contextLines: number;
	matchWholeWord: boolean;
	isCaseSensitive: boolean;
	isRegexp: boolean;
	useExcludeSettingsAndIgnoreFiles: boolean;
	showIncludesExcludes: boolean;
	onlyOpenEditors: boolean;
	notebookSearchConfig: {
		includeMarkupInput: boolean;
		includeMarkupPreview: boolean;
		includeCodeInput: boolean;
		includeOutput: boolean;
	};
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ToggleCaseSensitiveKeybinding, ToggleRegexKeybinding, ToggleWholeWordKeybinding } from '../../../../editor/contrib/find/browser/findModel.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IEditorSerializer, IEditorFactoryRegistry, EditorExtensions, DEFAULT_EDITOR_ASSOCIATION } from '../../../common/editor.js';
import { ActiveEditorContext } from '../../../common/contextkeys.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { getSearchView } from '../../search/browser/searchActionsBase.js';
import { searchNewEditorIcon, searchRefreshIcon } from '../../search/browser/searchIcons.js';
import * as SearchConstants from '../../search/common/constants.js';
import * as SearchEditorConstants from './constants.js';
import { SearchEditor } from './searchEditor.js';
import { createEditorFromSearchResult, modifySearchEditorContextLinesCommand, openNewSearchEditor, openSearchEditor, selectAllSearchEditorMatchesCommand, toggleSearchEditorCaseSensitiveCommand, toggleSearchEditorContextLinesCommand, toggleSearchEditorRegexCommand, toggleSearchEditorWholeWordCommand } from './searchEditorActions.js';
import { getOrMakeSearchEditorInput, SearchEditorInput, SEARCH_EDITOR_EXT } from './searchEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { VIEW_ID } from '../../../services/search/common/search.js';
import { RegisteredEditorPriority, IEditorResolverService } from '../../../services/editor/common/editorResolverService.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../services/workingCopy/common/workingCopyEditorService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { getActiveElement } from '../../../../base/browser/dom.js';


const OpenInEditorCommandId = 'search.action.openInEditor';
const OpenNewEditorToSideCommandId = 'search.action.openNewEditorToSide';
const FocusQueryEditorWidgetCommandId = 'search.action.focusQueryEditorWidget';
const FocusQueryEditorFilesToIncludeCommandId = 'search.action.focusFilesToInclude';
const FocusQueryEditorFilesToExcludeCommandId = 'search.action.focusFilesToExclude';

const ToggleSearchEditorCaseSensitiveCommandId = 'toggleSearchEditorCaseSensitive';
const ToggleSearchEditorWholeWordCommandId = 'toggleSearchEditorWholeWord';
const ToggleSearchEditorRegexCommandId = 'toggleSearchEditorRegex';
const IncreaseSearchEditorContextLinesCommandId = 'increaseSearchEditorContextLines';
const DecreaseSearchEditorContextLinesCommandId = 'decreaseSearchEditorContextLines';

const RerunSearchEditorSearchCommandId = 'rerunSearchEditorSearch';
const CleanSearchEditorStateCommandId = 'cleanSearchEditorState';
const SelectAllSearchEditorMatchesCommandId = 'selectAllSearchEditorMatches';



//#region Editor Descriptior
Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		SearchEditor,
		SearchEditor.ID,
		localize('searchEditor', "Search Editor")
	),
	[
		new SyncDescriptor(SearchEditorInput)
	]
);
//#endregion

//#region Startup Contribution
class SearchEditorContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.searchEditor';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		editorResolverService.registerEditor(
			'*' + SEARCH_EDITOR_EXT,
			{
				id: SearchEditorInput.ID,
				label: localize('promptOpenWith.searchEditor.displayName', "Search Editor"),
				detail: DEFAULT_EDITOR_ASSOCIATION.providerDisplayName,
				priority: RegisteredEditorPriority.default,
			},
			{
				singlePerResource: true,
				canSupportResource: resource => (extname(resource) === SEARCH_EDITOR_EXT)
			},
			{
				createEditorInput: ({ resource }) => {
					return { editor: instantiationService.invokeFunction(getOrMakeSearchEditorInput, { from: 'existingFile', fileUri: resource }) };
				}
			}
		);
	}
}

registerWorkbenchContribution2(SearchEditorContribution.ID, SearchEditorContribution, WorkbenchPhase.BlockStartup);
//#endregion

//#region Input Serializer
type SerializedSearchEditor = { modelUri: string | undefined; dirty: boolean; config?: SearchEditorConstants.SearchConfiguration; name: string; matchRanges: Range[]; backingUri?: string };

class SearchEditorInputSerializer implements IEditorSerializer {

	canSerialize(input: SearchEditorInput) {
		return !!input.tryReadConfigSync();
	}

	serialize(input: SearchEditorInput) {
		if (!this.canSerialize(input)) {
			return undefined;
		}

		if (input.isDisposed()) {
			return JSON.stringify({ modelUri: undefined, dirty: false, config: input.tryReadConfigSync(), name: input.getName(), matchRanges: [], backingUri: input.backingUri?.toString() } satisfies SerializedSearchEditor);
		}

		let modelUri = undefined;
		if (input.modelUri.path || input.modelUri.fragment && input.isDirty()) {
			modelUri = input.modelUri.toString();
		}

		const config = input.tryReadConfigSync();
		const dirty = input.isDirty();
		const matchRanges = dirty ? input.getMatchRanges() : [];
		const backingUri = input.backingUri;

		return JSON.stringify({ modelUri, dirty, config, name: input.getName(), matchRanges, backingUri: backingUri?.toString() } satisfies SerializedSearchEditor);
	}

	deserialize(instantiationService: IInstantiationService, serializedEditorInput: string): SearchEditorInput | undefined {
		const { modelUri, dirty, config, matchRanges, backingUri } = JSON.parse(serializedEditorInput) as SerializedSearchEditor;
		if (config && (config.query !== undefined)) {
			if (modelUri) {
				const input = instantiationService.invokeFunction(getOrMakeSearchEditorInput,
					{ from: 'model', modelUri: URI.parse(modelUri), config, backupOf: backingUri ? URI.parse(backingUri) : undefined });
				input.setDirty(dirty);
				input.setMatchRanges(matchRanges);
				return input;
			} else {
				if (backingUri) {
					return instantiationService.invokeFunction(getOrMakeSearchEditorInput,
						{ from: 'existingFile', fileUri: URI.parse(backingUri) });
				} else {
					return instantiationService.invokeFunction(getOrMakeSearchEditorInput,
						{ from: 'rawData', resultsContents: '', config });
				}
			}
		}
		return undefined;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	SearchEditorInput.ID,
	SearchEditorInputSerializer);
//#endregion

//#region Commands
CommandsRegistry.registerCommand(
	CleanSearchEditorStateCommandId,
	(accessor: ServicesAccessor) => {
		const activeEditorPane = accessor.get(IEditorService).activeEditorPane;
		if (activeEditorPane instanceof SearchEditor) {
			activeEditorPane.cleanState();
		}
	});
//#endregion

//#region Actions
const category = localize2('search', 'Search Editor');

export type LegacySearchEditorArgs = Partial<{
	query: string;
	includes: string;
	excludes: string;
	contextLines: number;
	wholeWord: boolean;
	caseSensitive: boolean;
	regexp: boolean;
	useIgnores: boolean;
	showIncludesExcludes: boolean;
	triggerSearch: boolean;
	focusResults: boolean;
	location: 'reuse' | 'new';
}>;

const translateLegacyConfig = (legacyConfig: LegacySearchEditorArgs & OpenSearchEditorArgs = {}): OpenSearchEditorArgs => {
	const config: OpenSearchEditorArgs = {};
	const overrides: { [K in keyof LegacySearchEditorArgs]: keyof OpenSearchEditorArgs } = {
		includes: 'filesToInclude',
		excludes: 'filesToExclude',
		wholeWord: 'matchWholeWord',
		caseSensitive: 'isCaseSensitive',
		regexp: 'isRegexp',
		useIgnores: 'useExcludeSettingsAndIgnoreFiles',
	};
	Object.entries(legacyConfig).forEach(([key, value]) => {
		// eslint-disable-next-line local/code-no-any-casts
		(config as any)[(overrides as any)[key] ?? key] = value;
	});
	return config;
};

export type OpenSearchEditorArgs = Partial<SearchEditorConstants.SearchConfiguration & { triggerSearch: boolean; focusResults: boolean; location: 'reuse' | 'new' }>;
const openArgMetadata = {
	description: 'Open a new search editor. Arguments passed can include variables like ${relativeFileDirname}.',
	args: [{
		name: 'Open new Search Editor args',
		schema: {
			properties: {
				query: { type: 'string' },
				filesToInclude: { type: 'string' },
				filesToExclude: { type: 'string' },
				contextLines: { type: 'number' },
				matchWholeWord: { type: 'boolean' },
				isCaseSensitive: { type: 'boolean' },
				isRegexp: { type: 'boolean' },
				useExcludeSettingsAndIgnoreFiles: { type: 'boolean' },
				showIncludesExcludes: { type: 'boolean' },
				triggerSearch: { type: 'boolean' },
				focusResults: { type: 'boolean' },
				onlyOpenEditors: { type: 'boolean' },
			}
		}
	}]
} as const;

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'search.searchEditor.action.deleteFileResults',
			title: localize2('searchEditor.deleteResultBlock', 'Delete File Results'),
			keybinding: {
				weight: KeybindingWeight.EditorContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Backspace,
			},
			precondition: SearchEditorConstants.InSearchEditor,
			category,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor) {
		const contextService = accessor.get(IContextKeyService).getContext(getActiveElement());
		if (contextService.getValue(SearchEditorConstants.InSearchEditor.serialize())) {
			(accessor.get(IEditorService).activeEditorPane as SearchEditor).deleteResultBlock();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SearchEditorConstants.OpenNewEditorCommandId,
			title: localize2('search.openNewSearchEditor', 'New Search Editor'),
			category,
			f1: true,
			metadata: openArgMetadata
		});
	}
	async run(accessor: ServicesAccessor, args: LegacySearchEditorArgs | OpenSearchEditorArgs) {
		await accessor.get(IInstantiationService).invokeFunction(openNewSearchEditor, translateLegacyConfig({ location: 'new', ...args }));
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SearchEditorConstants.OpenEditorCommandId,
			title: localize2('search.openSearchEditor', 'Open Search Editor'),
			category,
			f1: true,
			metadata: openArgMetadata
		});
	}
	async run(accessor: ServicesAccessor, args: LegacySearchEditorArgs | OpenSearchEditorArgs) {
		await accessor.get(IInstantiationService).invokeFunction(openNewSearchEditor, translateLegacyConfig({ location: 'reuse', ...args }));
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: OpenNewEditorToSideCommandId,
			title: localize2('search.openNewEditorToSide', 'Open New Search Editor to the Side'),
			category,
			f1: true,
			metadata: openArgMetadata
		});
	}
	async run(accessor: ServicesAccessor, args: LegacySearchEditorArgs | OpenSearchEditorArgs) {
		await accessor.get(IInstantiationService).invokeFunction(openNewSearchEditor, translateLegacyConfig(args), true);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: OpenInEditorCommandId,
			title: localize2('search.openResultsInEditor', 'Open Results in Editor'),
			category,
			f1: true,
			keybinding: {
				primary: KeyMod.Alt | KeyCode.Enter,
				when: ContextKeyExpr.and(SearchConstants.SearchContext.HasSearchResults, SearchConstants.SearchContext.SearchViewFocusedKey),
				weight: KeybindingWeight.WorkbenchContrib,
				mac: {
					primary: KeyMod.CtrlCmd | KeyCode.Enter
				}
			},
		});
	}
	async run(accessor: ServicesAccessor) {
		const viewsService = accessor.get(IViewsService);
		const instantiationService = accessor.get(IInstantiationService);
		const searchView = getSearchView(viewsService);
		if (searchView) {
			await instantiationService.invokeFunction(createEditorFromSearchResult, searchView.searchResult, searchView.searchIncludePattern.getValue(), searchView.searchExcludePattern.getValue(), searchView.searchIncludePattern.onlySearchInOpenEditors());
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: RerunSearchEditorSearchCommandId,
			title: localize2('search.rerunSearchInEditor', 'Search Again'),
			category,
			keybinding: {
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyR,
				when: SearchEditorConstants.InSearchEditor,
				weight: KeybindingWeight.EditorContrib
			},
			icon: searchRefreshIcon,
			menu: [...[MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				group: 'navigation',
				when: ActiveEditorContext.isEqualTo(SearchEditorConstants.SearchEditorID)
			})),
			{
				id: MenuId.CommandPalette,
				when: ActiveEditorContext.isEqualTo(SearchEditorConstants.SearchEditorID)
			}]
		});
	}
	async run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			(editorService.activeEditorPane as SearchEditor).triggerSearch({ resetCursor: false });
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: FocusQueryEditorWidgetCommandId,
			title: localize2('search.action.focusQueryEditorWidget', 'Focus Search Editor Input'),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: {
				primary: KeyCode.Escape,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}
	async run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			(editorService.activeEditorPane as SearchEditor).focusSearchInput();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: FocusQueryEditorFilesToIncludeCommandId,
			title: localize2('search.action.focusFilesToInclude', 'Focus Search Editor Files to Include'),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
		});
	}
	async run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			(editorService.activeEditorPane as SearchEditor).focusFilesToIncludeInput();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: FocusQueryEditorFilesToExcludeCommandId,
			title: localize2('search.action.focusFilesToExclude', 'Focus Search Editor Files to Exclude'),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
		});
	}
	async run(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		const input = editorService.activeEditor;
		if (input instanceof SearchEditorInput) {
			(editorService.activeEditorPane as SearchEditor).focusFilesToExcludeInput();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: ToggleSearchEditorCaseSensitiveCommandId,
			title: localize2('searchEditor.action.toggleSearchEditorCaseSensitive', 'Toggle Match Case'),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: SearchConstants.SearchContext.SearchInputBoxFocusedKey,
			}, ToggleCaseSensitiveKeybinding)
		});
	}
	run(accessor: ServicesAccessor) {
		toggleSearchEditorCaseSensitiveCommand(accessor);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: ToggleSearchEditorWholeWordCommandId,
			title: localize2('searchEditor.action.toggleSearchEditorWholeWord', 'Toggle Match Whole Word'),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: SearchConstants.SearchContext.SearchInputBoxFocusedKey,
			}, ToggleWholeWordKeybinding)
		});
	}
	run(accessor: ServicesAccessor) {
		toggleSearchEditorWholeWordCommand(accessor);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: ToggleSearchEditorRegexCommandId,
			title: localize2('searchEditor.action.toggleSearchEditorRegex', "Toggle Use Regular Expression"),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: Object.assign({
				weight: KeybindingWeight.WorkbenchContrib,
				when: SearchConstants.SearchContext.SearchInputBoxFocusedKey,
			}, ToggleRegexKeybinding)
		});
	}
	run(accessor: ServicesAccessor) {
		toggleSearchEditorRegexCommand(accessor);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SearchEditorConstants.ToggleSearchEditorContextLinesCommandId,
			title: localize2('searchEditor.action.toggleSearchEditorContextLines', "Toggle Context Lines"),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyCode.KeyL,
				mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyL }
			}
		});
	}
	run(accessor: ServicesAccessor) {
		toggleSearchEditorContextLinesCommand(accessor);
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: IncreaseSearchEditorContextLinesCommandId,
			title: localize2('searchEditor.action.increaseSearchEditorContextLines', "Increase Context Lines"),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyCode.Equal
			}
		});
	}
	run(accessor: ServicesAccessor) { modifySearchEditorContextLinesCommand(accessor, true); }
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: DecreaseSearchEditorContextLinesCommandId,
			title: localize2('searchEditor.action.decreaseSearchEditorContextLines', "Decrease Context Lines"),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.Alt | KeyCode.Minus
			}
		});
	}
	run(accessor: ServicesAccessor) { modifySearchEditorContextLinesCommand(accessor, false); }
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: SelectAllSearchEditorMatchesCommandId,
			title: localize2('searchEditor.action.selectAllSearchEditorMatches', "Select All Matches"),
			category,
			f1: true,
			precondition: SearchEditorConstants.InSearchEditor,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL,
			}
		});
	}
	run(accessor: ServicesAccessor) {
		selectAllSearchEditorMatchesCommand(accessor);
	}
});

registerAction2(class OpenSearchEditorAction extends Action2 {
	constructor() {
		super({
			id: 'search.action.openNewEditorFromView',
			title: localize('search.openNewEditor', "Open New Search Editor"),
			category,
			icon: searchNewEditorIcon,
			menu: [{
				id: MenuId.ViewTitle,
				group: 'navigation',
				order: 2,
				when: ContextKeyExpr.equals('view', VIEW_ID),
			}]
		});
	}
	run(accessor: ServicesAccessor, ...args: unknown[]) {
		return openSearchEditor(accessor);
	}
});
//#endregion

//#region Search Editor Working Copy Editor Handler
class SearchEditorWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.searchEditorWorkingCopyEditorHandler';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
	) {
		super();

		this._register(workingCopyEditorService.registerHandler(this));
	}

	handles(workingCopy: IWorkingCopyIdentifier): boolean {
		return workingCopy.resource.scheme === SearchEditorConstants.SearchEditorScheme;
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handles(workingCopy)) {
			return false;
		}

		return editor instanceof SearchEditorInput && isEqual(workingCopy.resource, editor.modelUri);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		const input = this.instantiationService.invokeFunction(getOrMakeSearchEditorInput, { from: 'model', modelUri: workingCopy.resource });
		input.setDirty(true);

		return input;
	}
}

registerWorkbenchContribution2(SearchEditorWorkingCopyEditorHandler.ID, SearchEditorWorkingCopyEditorHandler, WorkbenchPhase.BlockRestore);
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';
import { Delayer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import './media/searchEditor.css';
import { ICodeEditorWidgetOptions } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { Position } from '../../../../editor/common/core/position.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ICodeEditorViewState } from '../../../../editor/common/editorCommon.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ReferencesController } from '../../../../editor/contrib/gotoSymbol/browser/peek/referencesController.js';
import { localize } from '../../../../nls.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IEditorProgressService, LongRunningOperation } from '../../../../platform/progress/common/progress.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { inputBorder, registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { AbstractTextCodeEditor } from '../../../browser/parts/editor/textCodeEditor.js';
import { EditorInputCapabilities, IEditorOpenContext } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ExcludePatternInputWidget, IncludePatternInputWidget } from '../../search/browser/patternInputWidget.js';
import { SearchWidget } from '../../search/browser/searchWidget.js';
import { ITextQueryBuilderOptions, QueryBuilder } from '../../../services/search/common/queryBuilder.js';
import { getOutOfWorkspaceEditorResources } from '../../search/common/search.js';
import { SearchModelImpl } from '../../search/browser/searchTreeModel/searchModel.js';
import { InSearchEditor, SearchEditorID, SearchEditorInputTypeId, SearchConfiguration } from './constants.js';
import type { SearchEditorInput } from './searchEditorInput.js';
import { serializeSearchResultForEditor } from './searchEditorSerialization.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IPatternInfo, ISearchComplete, ISearchConfigurationProperties, ITextQuery, SearchSortOrder } from '../../../services/search/common/search.js';
import { searchDetailsIcon } from '../../search/browser/searchIcons.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { TextSearchCompleteMessage } from '../../../services/search/common/searchExtTypes.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { renderSearchMessage } from '../../search/browser/searchMessage.js';
import { EditorExtensionsRegistry, IEditorContributionDescription } from '../../../../editor/browser/editorExtensions.js';
import { UnusualLineTerminatorsDetector } from '../../../../editor/contrib/unusualLineTerminators/browser/unusualLineTerminators.js';
import { defaultToggleStyles, getInputBoxStyle } from '../../../../platform/theme/browser/defaultStyles.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { SearchContext } from '../../search/common/constants.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { ISearchResult } from '../../search/browser/searchTreeModel/searchTreeCommon.js';

const RESULT_LINE_REGEX = /^(\s+)(\d+)(: |  )(\s*)(.*)$/;
const FILE_LINE_REGEX = /^(\S.*):$/;

type SearchEditorViewState = ICodeEditorViewState & { focused: 'input' | 'editor' };

export class SearchEditor extends AbstractTextCodeEditor<SearchEditorViewState> {
	static readonly ID: string = SearchEditorID;

	static readonly SEARCH_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'searchEditorViewState';

	private queryEditorWidget!: SearchWidget;
	private get searchResultEditor() { return this.editorControl!; }
	private queryEditorContainer!: HTMLElement;
	private dimension?: DOM.Dimension;
	private inputPatternIncludes!: IncludePatternInputWidget;
	private inputPatternExcludes!: ExcludePatternInputWidget;
	private includesExcludesContainer!: HTMLElement;
	private toggleQueryDetailsButton!: HTMLElement;
	private messageBox!: HTMLElement;

	private runSearchDelayer = new Delayer(0);
	private pauseSearching: boolean = false;
	private showingIncludesExcludes: boolean = false;
	private searchOperation: LongRunningOperation;
	private searchHistoryDelayer: Delayer<void>;
	private readonly messageDisposables: DisposableStore;
	private container: HTMLElement;
	private searchModel: SearchModelImpl;
	private ongoingOperations: number = 0;
	private updatingModelForSearch: boolean = false;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IModelService private readonly modelService: IModelService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@ILabelService private readonly labelService: ILabelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@ICommandService private readonly commandService: ICommandService,
		@IOpenerService private readonly openerService: IOpenerService,
		@INotificationService private readonly notificationService: INotificationService,
		@IEditorProgressService progressService: IEditorProgressService,
		@ITextResourceConfigurationService textResourceService: ITextResourceConfigurationService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IConfigurationService protected configurationService: IConfigurationService,
		@IFileService fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IHoverService private readonly hoverService: IHoverService
	) {
		super(SearchEditor.ID, group, telemetryService, instantiationService, storageService, textResourceService, themeService, editorService, editorGroupService, fileService);
		this.container = DOM.$('.search-editor');

		this.searchOperation = this._register(new LongRunningOperation(progressService));
		this._register(this.messageDisposables = new DisposableStore());

		this.searchHistoryDelayer = new Delayer<void>(2000);

		this.searchModel = this._register(this.instantiationService.createInstance(SearchModelImpl));
	}

	protected override createEditor(parent: HTMLElement) {
		DOM.append(parent, this.container);
		this.queryEditorContainer = DOM.append(this.container, DOM.$('.query-container'));
		const searchResultContainer = DOM.append(this.container, DOM.$('.search-results'));
		super.createEditor(searchResultContainer);
		this.registerEditorListeners();

		const scopedContextKeyService = assertReturnsDefined(this.scopedContextKeyService);
		InSearchEditor.bindTo(scopedContextKeyService).set(true);

		this.createQueryEditor(
			this.queryEditorContainer,
			this._register(this.instantiationService.createChild(new ServiceCollection([IContextKeyService, scopedContextKeyService]))),
			SearchContext.InputBoxFocusedKey.bindTo(scopedContextKeyService)
		);
	}


	private createQueryEditor(container: HTMLElement, scopedInstantiationService: IInstantiationService, inputBoxFocusedContextKey: IContextKey<boolean>) {
		const searchEditorInputboxStyles = getInputBoxStyle({ inputBorder: searchEditorTextInputBorder });

		this.queryEditorWidget = this._register(scopedInstantiationService.createInstance(SearchWidget, container, { _hideReplaceToggle: true, showContextToggle: true, inputBoxStyles: searchEditorInputboxStyles, toggleStyles: defaultToggleStyles }));
		this._register(this.queryEditorWidget.onReplaceToggled(() => this.reLayout()));
		this._register(this.queryEditorWidget.onDidHeightChange(() => this.reLayout()));
		this._register(this.queryEditorWidget.onSearchSubmit(({ delay }) => this.triggerSearch({ delay })));
		if (this.queryEditorWidget.searchInput) {
			this._register(this.queryEditorWidget.searchInput.onDidOptionChange(() => this.triggerSearch({ resetCursor: false })));
		} else {
			this.logService.warn('SearchEditor: SearchWidget.searchInput is undefined, cannot register onDidOptionChange listener');
		}
		this._register(this.queryEditorWidget.onDidToggleContext(() => this.triggerSearch({ resetCursor: false })));

		// Includes/Excludes Dropdown
		this.includesExcludesContainer = DOM.append(container, DOM.$('.includes-excludes'));

		// Toggle query details button
		const toggleQueryDetailsLabel = localize('moreSearch', "Toggle Search Details");
		this.toggleQueryDetailsButton = DOM.append(this.includesExcludesContainer, DOM.$('.expand' + ThemeIcon.asCSSSelector(searchDetailsIcon), { tabindex: 0, role: 'button', 'aria-label': toggleQueryDetailsLabel }));
		this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('element'), this.toggleQueryDetailsButton, toggleQueryDetailsLabel));
		this._register(DOM.addDisposableListener(this.toggleQueryDetailsButton, DOM.EventType.CLICK, e => {
			DOM.EventHelper.stop(e);
			this.toggleIncludesExcludes();
		}));
		this._register(DOM.addDisposableListener(this.toggleQueryDetailsButton, DOM.EventType.KEY_UP, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyCode.Enter) || event.equals(KeyCode.Space)) {
				DOM.EventHelper.stop(e);
				this.toggleIncludesExcludes();
			}
		}));
		this._register(DOM.addDisposableListener(this.toggleQueryDetailsButton, DOM.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			const event = new StandardKeyboardEvent(e);
			if (event.equals(KeyMod.Shift | KeyCode.Tab)) {
				if (this.queryEditorWidget.isReplaceActive()) {
					this.queryEditorWidget.focusReplaceAllAction();
				}
				else {
					this.queryEditorWidget.isReplaceShown() ? this.queryEditorWidget.replaceInput?.focusOnPreserve() : this.queryEditorWidget.focusRegexAction();
				}
				DOM.EventHelper.stop(e);
			}
		}));

		// Includes
		const folderIncludesList = DOM.append(this.includesExcludesContainer, DOM.$('.file-types.includes'));
		const filesToIncludeTitle = localize('searchScope.includes', "files to include");
		DOM.append(folderIncludesList, DOM.$('h4', undefined, filesToIncludeTitle));
		this.inputPatternIncludes = this._register(scopedInstantiationService.createInstance(IncludePatternInputWidget, folderIncludesList, this.contextViewService, {
			ariaLabel: localize('label.includes', 'Search Include Patterns'),
			inputBoxStyles: searchEditorInputboxStyles
		}));
		this._register(this.inputPatternIncludes.onSubmit(triggeredOnType => this.triggerSearch({ resetCursor: false, delay: triggeredOnType ? this.searchConfig.searchOnTypeDebouncePeriod : 0 })));
		this._register(this.inputPatternIncludes.onChangeSearchInEditorsBox(() => this.triggerSearch()));

		// Excludes
		const excludesList = DOM.append(this.includesExcludesContainer, DOM.$('.file-types.excludes'));
		const excludesTitle = localize('searchScope.excludes', "files to exclude");
		DOM.append(excludesList, DOM.$('h4', undefined, excludesTitle));
		this.inputPatternExcludes = this._register(scopedInstantiationService.createInstance(ExcludePatternInputWidget, excludesList, this.contextViewService, {
			ariaLabel: localize('label.excludes', 'Search Exclude Patterns'),
			inputBoxStyles: searchEditorInputboxStyles
		}));
		this._register(this.inputPatternExcludes.onSubmit(triggeredOnType => this.triggerSearch({ resetCursor: false, delay: triggeredOnType ? this.searchConfig.searchOnTypeDebouncePeriod : 0 })));
		this._register(this.inputPatternExcludes.onChangeIgnoreBox(() => this.triggerSearch()));

		// Messages
		this.messageBox = DOM.append(container, DOM.$('.messages.text-search-provider-messages'));

		[this.queryEditorWidget.searchInputFocusTracker, this.queryEditorWidget.replaceInputFocusTracker, this.inputPatternExcludes.inputFocusTracker, this.inputPatternIncludes.inputFocusTracker]
			.forEach(tracker => {
				if (!tracker) {
					return;
				}
				this._register(tracker.onDidFocus(() => setTimeout(() => inputBoxFocusedContextKey.set(true), 0)));
				this._register(tracker.onDidBlur(() => inputBoxFocusedContextKey.set(false)));
			});
	}

	private toggleRunAgainMessage(show: boolean) {
		DOM.clearNode(this.messageBox);
		this.messageDisposables.clear();

		if (show) {
			const runAgainLink = DOM.append(this.messageBox, DOM.$('a.pointer.prominent.message', {}, localize('runSearch', "Run Search")));
			this.messageDisposables.add(DOM.addDisposableListener(runAgainLink, DOM.EventType.CLICK, async () => {
				await this.triggerSearch();
				this.searchResultEditor.focus();
			}));
		}
	}

	private _getContributions(): IEditorContributionDescription[] {
		const skipContributions = [UnusualLineTerminatorsDetector.ID];
		return EditorExtensionsRegistry.getEditorContributions().filter(c => skipContributions.indexOf(c.id) === -1);
	}

	protected override getCodeEditorWidgetOptions(): ICodeEditorWidgetOptions {
		return { contributions: this._getContributions() };
	}

	private registerEditorListeners() {
		this._register(this.searchResultEditor.onMouseUp(e => {
			if (e.event.detail === 1) {
				const behaviour = this.searchConfig.searchEditor.singleClickBehaviour;
				const position = e.target.position;
				if (position && behaviour === 'peekDefinition') {
					const line = this.searchResultEditor.getModel()?.getLineContent(position.lineNumber) ?? '';
					if (line.match(FILE_LINE_REGEX) || line.match(RESULT_LINE_REGEX)) {
						this.searchResultEditor.setSelection(Range.fromPositions(position));
						this.commandService.executeCommand('editor.action.peekDefinition');
					}
				}
			} else if (e.event.detail === 2) {
				const behaviour = this.searchConfig.searchEditor.doubleClickBehaviour;
				const position = e.target.position;
				if (position && behaviour !== 'selectWord') {
					const line = this.searchResultEditor.getModel()?.getLineContent(position.lineNumber) ?? '';
					if (line.match(RESULT_LINE_REGEX)) {
						this.searchResultEditor.setSelection(Range.fromPositions(position));
						this.commandService.executeCommand(behaviour === 'goToLocation' ? 'editor.action.goToDeclaration' : 'editor.action.openDeclarationToTheSide');
					} else if (line.match(FILE_LINE_REGEX)) {
						this.searchResultEditor.setSelection(Range.fromPositions(position));
						this.commandService.executeCommand('editor.action.peekDefinition');
					}
				}
			}
		}));
		this._register(this.searchResultEditor.onDidChangeModelContent(() => {
			if (!this.updatingModelForSearch) {
				this.getInput()?.setDirty(true);
			}
		}));
	}

	override getControl() {
		return this.searchResultEditor;
	}

	override focus() {
		super.focus();

		const viewState = this.loadEditorViewState(this.getInput());
		if (viewState && viewState.focused === 'editor') {
			this.searchResultEditor.focus();
		} else {
			this.queryEditorWidget.focus();
		}
	}

	focusSearchInput() {
		this.queryEditorWidget.searchInput?.focus();
	}

	focusFilesToIncludeInput() {
		if (!this.showingIncludesExcludes) {
			this.toggleIncludesExcludes(true);
		}
		this.inputPatternIncludes.focus();
	}

	focusFilesToExcludeInput() {
		if (!this.showingIncludesExcludes) {
			this.toggleIncludesExcludes(true);
		}
		this.inputPatternExcludes.focus();
	}

	focusNextInput() {
		if (this.queryEditorWidget.searchInputHasFocus()) {
			if (this.showingIncludesExcludes) {
				this.inputPatternIncludes.focus();
			} else {
				this.searchResultEditor.focus();
			}
		} else if (this.inputPatternIncludes.inputHasFocus()) {
			this.inputPatternExcludes.focus();
		} else if (this.inputPatternExcludes.inputHasFocus()) {
			this.searchResultEditor.focus();
		} else if (this.searchResultEditor.hasWidgetFocus()) {
			// pass
		}
	}

	focusPrevInput() {
		if (this.queryEditorWidget.searchInputHasFocus()) {
			this.searchResultEditor.focus(); // wrap
		} else if (this.inputPatternIncludes.inputHasFocus()) {
			this.queryEditorWidget.searchInput?.focus();
		} else if (this.inputPatternExcludes.inputHasFocus()) {
			this.inputPatternIncludes.focus();
		} else if (this.searchResultEditor.hasWidgetFocus()) {
			// unreachable.
		}
	}

	setQuery(query: string) {
		this.queryEditorWidget.searchInput?.setValue(query);
	}

	selectQuery() {
		this.queryEditorWidget.searchInput?.select();
	}

	toggleWholeWords() {
		this.queryEditorWidget.searchInput?.setWholeWords(!this.queryEditorWidget.searchInput.getWholeWords());
		this.triggerSearch({ resetCursor: false });
	}

	toggleRegex() {
		this.queryEditorWidget.searchInput?.setRegex(!this.queryEditorWidget.searchInput.getRegex());
		this.triggerSearch({ resetCursor: false });
	}

	toggleCaseSensitive() {
		this.queryEditorWidget.searchInput?.setCaseSensitive(!this.queryEditorWidget.searchInput.getCaseSensitive());
		this.triggerSearch({ resetCursor: false });
	}

	toggleContextLines() {
		this.queryEditorWidget.toggleContextLines();
	}

	modifyContextLines(increase: boolean) {
		this.queryEditorWidget.modifyContextLines(increase);
	}

	toggleQueryDetails(shouldShow?: boolean) {
		this.toggleIncludesExcludes(shouldShow);
	}

	deleteResultBlock() {
		const linesToDelete = new Set<number>();

		const selections = this.searchResultEditor.getSelections();
		const model = this.searchResultEditor.getModel();
		if (!(selections && model)) { return; }

		const maxLine = model.getLineCount();
		const minLine = 1;

		const deleteUp = (start: number) => {
			for (let cursor = start; cursor >= minLine; cursor--) {
				const line = model.getLineContent(cursor);
				linesToDelete.add(cursor);
				if (line[0] !== undefined && line[0] !== ' ') {
					break;
				}
			}
		};

		const deleteDown = (start: number): number | undefined => {
			linesToDelete.add(start);
			for (let cursor = start + 1; cursor <= maxLine; cursor++) {
				const line = model.getLineContent(cursor);
				if (line[0] !== undefined && line[0] !== ' ') {
					return cursor;
				}
				linesToDelete.add(cursor);
			}
			return;
		};

		const endingCursorLines: Array<number | undefined> = [];
		for (const selection of selections) {
			const lineNumber = selection.startLineNumber;
			endingCursorLines.push(deleteDown(lineNumber));
			deleteUp(lineNumber);
			for (let inner = selection.startLineNumber; inner <= selection.endLineNumber; inner++) {
				linesToDelete.add(inner);
			}
		}

		if (endingCursorLines.length === 0) { endingCursorLines.push(1); }

		const isDefined = <T>(x: T | undefined): x is T => x !== undefined;

		model.pushEditOperations(this.searchResultEditor.getSelections(),
			[...linesToDelete].map(line => ({ range: new Range(line, 1, line + 1, 1), text: '' })),
			() => endingCursorLines.filter(isDefined).map(line => new Selection(line, 1, line, 1)));
	}

	cleanState() {
		this.getInput()?.setDirty(false);
	}

	private get searchConfig(): ISearchConfigurationProperties {
		return this.configurationService.getValue<ISearchConfigurationProperties>('search');
	}

	private iterateThroughMatches(reverse: boolean) {
		const model = this.searchResultEditor.getModel();
		if (!model) { return; }

		const lastLine = model.getLineCount() ?? 1;
		const lastColumn = model.getLineLength(lastLine);

		const fallbackStart = reverse ? new Position(lastLine, lastColumn) : new Position(1, 1);

		const currentPosition = this.searchResultEditor.getSelection()?.getStartPosition() ?? fallbackStart;

		const matchRanges = this.getInput()?.getMatchRanges();
		if (!matchRanges) { return; }

		const matchRange = (reverse ? findPrevRange : findNextRange)(matchRanges, currentPosition);
		if (!matchRange) { return; }

		this.searchResultEditor.setSelection(matchRange);
		this.searchResultEditor.revealLineInCenterIfOutsideViewport(matchRange.startLineNumber);
		this.searchResultEditor.focus();

		const matchLineText = model.getLineContent(matchRange.startLineNumber);
		const matchText = model.getValueInRange(matchRange);
		let file = '';
		for (let line = matchRange.startLineNumber; line >= 1; line--) {
			const lineText = model.getValueInRange(new Range(line, 1, line, 2));
			if (lineText !== ' ') { file = model.getLineContent(line); break; }
		}
		alert(localize('searchResultItem', "Matched {0} at {1} in file {2}", matchText, matchLineText, file.slice(0, file.length - 1)));
	}

	focusNextResult() {
		this.iterateThroughMatches(false);
	}

	focusPreviousResult() {
		this.iterateThroughMatches(true);
	}

	focusAllResults() {
		this.searchResultEditor
			.setSelections((this.getInput()?.getMatchRanges() ?? []).map(
				range => new Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn)));
		this.searchResultEditor.focus();
	}

	async triggerSearch(_options?: { resetCursor?: boolean; delay?: number; focusResults?: boolean }) {
		const focusResults = this.searchConfig.searchEditor.focusResultsOnSearch;

		// If _options don't define focusResult field, then use the setting
		if (_options === undefined) {
			_options = { focusResults: focusResults };
		} else if (_options.focusResults === undefined) {
			_options.focusResults = focusResults;
		}

		const options = { resetCursor: true, delay: 0, ..._options };

		if (!(this.queryEditorWidget.searchInput?.inputBox.isInputValid())) {
			return;
		}

		if (!this.pauseSearching) {
			await this.runSearchDelayer.trigger(async () => {
				this.toggleRunAgainMessage(false);
				await this.doRunSearch();
				if (options.resetCursor) {
					this.searchResultEditor.setPosition(new Position(1, 1));
					this.searchResultEditor.setScrollPosition({ scrollTop: 0, scrollLeft: 0 });
				}
				if (options.focusResults) {
					this.searchResultEditor.focus();
				}
			}, options.delay);
		}
	}

	private readConfigFromWidget(): SearchConfiguration {
		return {
			isCaseSensitive: this.queryEditorWidget.searchInput?.getCaseSensitive() ?? false,
			contextLines: this.queryEditorWidget.getContextLines(),
			filesToExclude: this.inputPatternExcludes.getValue(),
			filesToInclude: this.inputPatternIncludes.getValue(),
			query: this.queryEditorWidget.searchInput?.getValue() ?? '',
			isRegexp: this.queryEditorWidget.searchInput?.getRegex() ?? false,
			matchWholeWord: this.queryEditorWidget.searchInput?.getWholeWords() ?? false,
			useExcludeSettingsAndIgnoreFiles: this.inputPatternExcludes.useExcludesAndIgnoreFiles(),
			onlyOpenEditors: this.inputPatternIncludes.onlySearchInOpenEditors(),
			showIncludesExcludes: this.showingIncludesExcludes,
			notebookSearchConfig: {
				includeMarkupInput: this.queryEditorWidget.getNotebookFilters().markupInput,
				includeMarkupPreview: this.queryEditorWidget.getNotebookFilters().markupPreview,
				includeCodeInput: this.queryEditorWidget.getNotebookFilters().codeInput,
				includeOutput: this.queryEditorWidget.getNotebookFilters().codeOutput,
			}
		};
	}

	private async doRunSearch() {
		this.searchModel.cancelSearch(true);

		const startInput = this.getInput();
		if (!startInput) { return; }

		this.searchHistoryDelayer.trigger(() => {
			this.queryEditorWidget.searchInput?.onSearchSubmit();
			this.inputPatternExcludes.onSearchSubmit();
			this.inputPatternIncludes.onSearchSubmit();
		});

		const config = this.readConfigFromWidget();

		if (!config.query) { return; }

		const content: IPatternInfo = {
			pattern: config.query,
			isRegExp: config.isRegexp,
			isCaseSensitive: config.isCaseSensitive,
			isWordMatch: config.matchWholeWord,
		};

		const options: ITextQueryBuilderOptions = {
			_reason: 'searchEditor',
			extraFileResources: this.instantiationService.invokeFunction(getOutOfWorkspaceEditorResources),
			maxResults: this.searchConfig.maxResults ?? undefined,
			disregardIgnoreFiles: !config.useExcludeSettingsAndIgnoreFiles || undefined,
			disregardExcludeSettings: !config.useExcludeSettingsAndIgnoreFiles || undefined,
			excludePattern: [{ pattern: config.filesToExclude }],
			includePattern: config.filesToInclude,
			onlyOpenEditors: config.onlyOpenEditors,
			previewOptions: {
				matchLines: 1,
				charsPerLine: 1000
			},
			surroundingContext: config.contextLines,
			isSmartCase: this.searchConfig.smartCase,
			expandPatterns: true,
			notebookSearchConfig: {
				includeMarkupInput: config.notebookSearchConfig.includeMarkupInput,
				includeMarkupPreview: config.notebookSearchConfig.includeMarkupPreview,
				includeCodeInput: config.notebookSearchConfig.includeCodeInput,
				includeOutput: config.notebookSearchConfig.includeOutput,
			}
		};

		const folderResources = this.contextService.getWorkspace().folders;
		let query: ITextQuery;
		try {
			const queryBuilder = this.instantiationService.createInstance(QueryBuilder);
			query = queryBuilder.text(content, folderResources.map(folder => folder.uri), options);
		}
		catch (err) {
			return;
		}

		this.searchOperation.start(500);
		this.ongoingOperations++;

		const { configurationModel } = await startInput.resolveModels();
		configurationModel.updateConfig(config);
		const result = this.searchModel.search(query);
		startInput.ongoingSearchOperation = result.asyncResults.finally(() => {
			this.ongoingOperations--;
			if (this.ongoingOperations === 0) {
				this.searchOperation.stop();
			}
		});

		const searchOperation = await startInput.ongoingSearchOperation;
		await this.onSearchComplete(searchOperation, config, startInput);
	}

	private async onSearchComplete(searchOperation: ISearchComplete, startConfig: SearchConfiguration, startInput: SearchEditorInput) {
		const input = this.getInput();
		if (!input ||
			input !== startInput ||
			JSON.stringify(startConfig) !== JSON.stringify(this.readConfigFromWidget())) {
			return;
		}

		input.ongoingSearchOperation = undefined;

		const sortOrder = this.searchConfig.sortOrder;
		if (sortOrder === SearchSortOrder.Modified) {
			await this.retrieveFileStats(this.searchModel.searchResult);
		}

		const controller = ReferencesController.get(this.searchResultEditor);
		controller?.closeWidget(false);
		const labelFormatter = (uri: URI): string => this.labelService.getUriLabel(uri, { relative: true });
		const results = serializeSearchResultForEditor(this.searchModel.searchResult, startConfig.filesToInclude, startConfig.filesToExclude, startConfig.contextLines, labelFormatter, sortOrder, searchOperation?.limitHit);
		const { resultsModel } = await input.resolveModels();
		this.updatingModelForSearch = true;
		this.modelService.updateModel(resultsModel, results.text);
		this.updatingModelForSearch = false;

		if (searchOperation && searchOperation.messages) {
			for (const message of searchOperation.messages) {
				this.addMessage(message);
			}
		}
		this.reLayout();

		input.setDirty(!input.hasCapability(EditorInputCapabilities.Untitled));
		input.setMatchRanges(results.matchRanges);
	}

	private addMessage(message: TextSearchCompleteMessage) {
		let messageBox: HTMLElement;
		if (this.messageBox.firstChild) {
			messageBox = this.messageBox.firstChild as HTMLElement;
		} else {
			messageBox = DOM.append(this.messageBox, DOM.$('.message'));
		}

		DOM.append(messageBox, renderSearchMessage(message, this.instantiationService, this.notificationService, this.openerService, this.commandService, this.messageDisposables, () => this.triggerSearch()));
	}

	private async retrieveFileStats(searchResult: ISearchResult): Promise<void> {
		const files = searchResult.matches().filter(f => !f.fileStat).map(f => f.resolveFileStat(this.fileService));
		await Promise.all(files);
	}

	override layout(dimension: DOM.Dimension) {
		this.dimension = dimension;
		this.reLayout();
	}

	getSelected() {
		const selection = this.searchResultEditor.getSelection();
		if (selection) {
			return this.searchResultEditor.getModel()?.getValueInRange(selection) ?? '';
		}
		return '';
	}

	private reLayout() {
		if (this.dimension) {
			this.queryEditorWidget.setWidth(this.dimension.width - 28 /* container margin */);
			this.searchResultEditor.layout({ height: this.dimension.height - DOM.getTotalHeight(this.queryEditorContainer), width: this.dimension.width });
			this.inputPatternExcludes.setWidth(this.dimension.width - 28 /* container margin */);
			this.inputPatternIncludes.setWidth(this.dimension.width - 28 /* container margin */);
		}
	}

	private getInput(): SearchEditorInput | undefined {
		return this.input as SearchEditorInput;
	}

	private priorConfig: Partial<Readonly<SearchConfiguration>> | undefined;
	setSearchConfig(config: Partial<Readonly<SearchConfiguration>>) {
		this.priorConfig = config;
		if (config.query !== undefined) { this.queryEditorWidget.setValue(config.query); }
		if (config.isCaseSensitive !== undefined) { this.queryEditorWidget.searchInput?.setCaseSensitive(config.isCaseSensitive); }
		if (config.isRegexp !== undefined) { this.queryEditorWidget.searchInput?.setRegex(config.isRegexp); }
		if (config.matchWholeWord !== undefined) { this.queryEditorWidget.searchInput?.setWholeWords(config.matchWholeWord); }
		if (config.contextLines !== undefined) { this.queryEditorWidget.setContextLines(config.contextLines); }
		if (config.filesToExclude !== undefined) { this.inputPatternExcludes.setValue(config.filesToExclude); }
		if (config.filesToInclude !== undefined) { this.inputPatternIncludes.setValue(config.filesToInclude); }
		if (config.onlyOpenEditors !== undefined) { this.inputPatternIncludes.setOnlySearchInOpenEditors(config.onlyOpenEditors); }
		if (config.useExcludeSettingsAndIgnoreFiles !== undefined) { this.inputPatternExcludes.setUseExcludesAndIgnoreFiles(config.useExcludeSettingsAndIgnoreFiles); }
		if (config.showIncludesExcludes !== undefined) { this.toggleIncludesExcludes(config.showIncludesExcludes); }
	}

	override async setInput(newInput: SearchEditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(newInput, options, context, token);
		if (token.isCancellationRequested) {
			return;
		}

		const { configurationModel, resultsModel } = await newInput.resolveModels();
		if (token.isCancellationRequested) { return; }

		this.searchResultEditor.setModel(resultsModel);
		this.pauseSearching = true;

		this.toggleRunAgainMessage(!newInput.ongoingSearchOperation && resultsModel.getLineCount() === 1 && resultsModel.getValueLength() === 0 && configurationModel.config.query !== '');

		this.setSearchConfig(configurationModel.config);

		this._register(configurationModel.onConfigDidUpdate(newConfig => {
			if (newConfig !== this.priorConfig) {
				this.pauseSearching = true;
				this.setSearchConfig(newConfig);
				this.pauseSearching = false;
			}
		}));

		this.restoreViewState(context);

		if (!options?.preserveFocus) {
			this.focus();
		}

		this.pauseSearching = false;

		if (newInput.ongoingSearchOperation) {
			const existingConfig = this.readConfigFromWidget();
			newInput.ongoingSearchOperation.then(complete => {
				this.onSearchComplete(complete, existingConfig, newInput);
			});
		}
	}

	private toggleIncludesExcludes(_shouldShow?: boolean): void {
		const cls = 'expanded';
		const shouldShow = _shouldShow ?? !this.includesExcludesContainer.classList.contains(cls);

		if (shouldShow) {
			this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'true');
			this.includesExcludesContainer.classList.add(cls);
		} else {
			this.toggleQueryDetailsButton.setAttribute('aria-expanded', 'false');
			this.includesExcludesContainer.classList.remove(cls);
		}

		this.showingIncludesExcludes = this.includesExcludesContainer.classList.contains(cls);

		this.reLayout();
	}

	protected override toEditorViewStateResource(input: EditorInput): URI | undefined {
		if (input.typeId === SearchEditorInputTypeId) {
			return (input as SearchEditorInput).modelUri;
		}

		return undefined;
	}

	protected override computeEditorViewState(resource: URI): SearchEditorViewState | undefined {
		const control = this.getControl();
		const editorViewState = control.saveViewState();
		if (!editorViewState) { return undefined; }
		if (resource.toString() !== this.getInput()?.modelUri.toString()) { return undefined; }

		return { ...editorViewState, focused: this.searchResultEditor.hasWidgetFocus() ? 'editor' : 'input' };
	}

	protected tracksEditorViewState(input: EditorInput): boolean {
		return input.typeId === SearchEditorInputTypeId;
	}

	private restoreViewState(context: IEditorOpenContext) {
		const viewState = this.loadEditorViewState(this.getInput(), context);
		if (viewState) { this.searchResultEditor.restoreViewState(viewState); }
	}

	getAriaLabel() {
		return this.getInput()?.getName() ?? localize('searchEditor', "Search");
	}
}

const searchEditorTextInputBorder = registerColor('searchEditor.textInputBorder', inputBorder, localize('textInputBoxBorder', "Search editor text input box border."));

function findNextRange(matchRanges: Range[], currentPosition: Position) {
	for (const matchRange of matchRanges) {
		if (Position.isBefore(currentPosition, matchRange.getStartPosition())) {
			return matchRange;
		}
	}
	return matchRanges[0];
}

function findPrevRange(matchRanges: Range[], currentPosition: Position) {
	for (let i = matchRanges.length - 1; i >= 0; i--) {
		const matchRange = matchRanges[i];
		if (Position.isBefore(matchRange.getStartPosition(), currentPosition)) {
			{
				return matchRange;
			}
		}
	}
	return matchRanges[matchRanges.length - 1];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditorActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditorActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { URI } from '../../../../base/common/uri.js';
import './media/searchEditor.css';
import { ICodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { EditorsOrder } from '../../../common/editor.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { getSearchView } from '../../search/browser/searchActionsBase.js';
import { SearchEditor } from './searchEditor.js';
import { OpenSearchEditorArgs } from './searchEditor.contribution.js';
import { getOrMakeSearchEditorInput, SearchEditorInput } from './searchEditorInput.js';
import { serializeSearchResultForEditor } from './searchEditorSerialization.js';
import { IConfigurationResolverService } from '../../../services/configurationResolver/common/configurationResolver.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../services/editor/common/editorService.js';
import { IHistoryService } from '../../../services/history/common/history.js';
import { ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { ISearchResult } from '../../search/browser/searchTreeModel/searchTreeCommon.js';

export const toggleSearchEditorCaseSensitiveCommand = (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).toggleCaseSensitive();
	}
};

export const toggleSearchEditorWholeWordCommand = (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).toggleWholeWords();
	}
};

export const toggleSearchEditorRegexCommand = (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).toggleRegex();
	}
};

export const toggleSearchEditorContextLinesCommand = (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).toggleContextLines();
	}
};

export const modifySearchEditorContextLinesCommand = (accessor: ServicesAccessor, increase: boolean) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).modifyContextLines(increase);
	}
};

export const selectAllSearchEditorMatchesCommand = (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const input = editorService.activeEditor;
	if (input instanceof SearchEditorInput) {
		(editorService.activeEditorPane as SearchEditor).focusAllResults();
	}
};

export async function openSearchEditor(accessor: ServicesAccessor): Promise<void> {
	const viewsService = accessor.get(IViewsService);
	const instantiationService = accessor.get(IInstantiationService);
	const searchView = getSearchView(viewsService);
	if (searchView) {
		await instantiationService.invokeFunction(openNewSearchEditor, {
			filesToInclude: searchView.searchIncludePattern.getValue(),
			onlyOpenEditors: searchView.searchIncludePattern.onlySearchInOpenEditors(),
			filesToExclude: searchView.searchExcludePattern.getValue(),
			isRegexp: searchView.searchAndReplaceWidget.searchInput?.getRegex(),
			isCaseSensitive: searchView.searchAndReplaceWidget.searchInput?.getCaseSensitive(),
			matchWholeWord: searchView.searchAndReplaceWidget.searchInput?.getWholeWords(),
			useExcludeSettingsAndIgnoreFiles: searchView.searchExcludePattern.useExcludesAndIgnoreFiles(),
			showIncludesExcludes: !!(searchView.searchIncludePattern.getValue() || searchView.searchExcludePattern.getValue() || !searchView.searchExcludePattern.useExcludesAndIgnoreFiles())
		});
	} else {
		await instantiationService.invokeFunction(openNewSearchEditor);
	}
}

export const openNewSearchEditor =
	async (accessor: ServicesAccessor, _args: OpenSearchEditorArgs = {}, toSide = false) => {
		const editorService = accessor.get(IEditorService);
		const editorGroupsService = accessor.get(IEditorGroupsService);
		const telemetryService = accessor.get(ITelemetryService);
		const instantiationService = accessor.get(IInstantiationService);
		const configurationService = accessor.get(IConfigurationService);

		const configurationResolverService = accessor.get(IConfigurationResolverService);
		const workspaceContextService = accessor.get(IWorkspaceContextService);
		const historyService = accessor.get(IHistoryService);
		const activeWorkspaceRootUri = historyService.getLastActiveWorkspaceRoot(Schemas.file);
		const lastActiveWorkspaceRoot = activeWorkspaceRootUri ? workspaceContextService.getWorkspaceFolder(activeWorkspaceRootUri) ?? undefined : undefined;


		const activeEditorControl = editorService.activeTextEditorControl;
		let activeModel: ICodeEditor | undefined;
		let selected = '';
		if (activeEditorControl) {
			if (isDiffEditor(activeEditorControl)) {
				if (activeEditorControl.getOriginalEditor().hasTextFocus()) {
					activeModel = activeEditorControl.getOriginalEditor();
				} else {
					activeModel = activeEditorControl.getModifiedEditor();
				}
			} else {
				activeModel = activeEditorControl as ICodeEditor;
			}
			const selection = activeModel?.getSelection();
			selected = (selection && activeModel?.getModel()?.getValueInRange(selection)) ?? '';

			if (selection?.isEmpty() && configurationService.getValue<ISearchConfigurationProperties>('search').seedWithNearestWord) {
				const wordAtPosition = activeModel.getModel()?.getWordAtPosition(selection.getStartPosition());
				if (wordAtPosition) {
					selected = wordAtPosition.word;
				}
			}
		} else {
			if (editorService.activeEditor instanceof SearchEditorInput) {
				const active = editorService.activeEditorPane as SearchEditor;
				selected = active.getSelected();
			}
		}

		telemetryService.publicLog2<{},
			{
				owner: 'roblourens';
				comment: 'Fired when a search editor is opened';
			}>
			('searchEditor/openNewSearchEditor');

		const seedSearchStringFromSelection = _args.location === 'new' || configurationService.getValue<IEditorOptions>('editor').find!.seedSearchStringFromSelection;
		const args: OpenSearchEditorArgs = { query: seedSearchStringFromSelection ? selected : undefined };
		for (const entry of Object.entries(_args)) {
			const name = entry[0];
			const value = entry[1];
			if (value !== undefined) {
				// eslint-disable-next-line local/code-no-any-casts
				(args as any)[name as any] = (typeof value === 'string') ? await configurationResolverService.resolveAsync(lastActiveWorkspaceRoot, value) : value;
			}
		}
		const existing = editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE).find(id => id.editor.typeId === SearchEditorInput.ID);
		let editor: SearchEditor;
		if (existing && args.location === 'reuse') {
			const group = editorGroupsService.getGroup(existing.groupId);
			if (!group) {
				throw new Error('Invalid group id for search editor');
			}
			const input = existing.editor as SearchEditorInput;
			editor = (await group.openEditor(input)) as SearchEditor;
			if (selected) { editor.setQuery(selected); }
			else { editor.selectQuery(); }
			editor.setSearchConfig(args);
		} else {
			const input = instantiationService.invokeFunction(getOrMakeSearchEditorInput, { config: args, resultsContents: '', from: 'rawData' });
			// TODO @roblourens make this use the editor resolver service if possible
			editor = await editorService.openEditor(input, { pinned: true }, toSide ? SIDE_GROUP : ACTIVE_GROUP) as SearchEditor;
		}

		const searchOnType = configurationService.getValue<ISearchConfigurationProperties>('search').searchOnType;
		if (
			args.triggerSearch === true ||
			args.triggerSearch !== false && searchOnType && args.query
		) {
			editor.triggerSearch({ focusResults: args.focusResults });
		}

		if (!args.focusResults) { editor.focusSearchInput(); }
	};

export const createEditorFromSearchResult =
	async (accessor: ServicesAccessor, searchResult: ISearchResult, rawIncludePattern: string, rawExcludePattern: string, onlySearchInOpenEditors: boolean) => {
		if (!searchResult.query) {
			console.error('Expected searchResult.query to be defined. Got', searchResult);
			return;
		}

		const editorService = accessor.get(IEditorService);
		const telemetryService = accessor.get(ITelemetryService);
		const instantiationService = accessor.get(IInstantiationService);
		const labelService = accessor.get(ILabelService);
		const configurationService = accessor.get(IConfigurationService);
		const sortOrder = configurationService.getValue<ISearchConfigurationProperties>('search').sortOrder;

		telemetryService.publicLog2<
			{},
			{
				owner: 'roblourens';
				comment: 'Fired when a search editor is opened from the search view';
			}>
			('searchEditor/createEditorFromSearchResult');

		const labelFormatter = (uri: URI): string => labelService.getUriLabel(uri, { relative: true });

		const { text, matchRanges, config } = serializeSearchResultForEditor(searchResult, rawIncludePattern, rawExcludePattern, 0, labelFormatter, sortOrder);
		config.onlyOpenEditors = onlySearchInOpenEditors;
		const contextLines = configurationService.getValue<ISearchConfigurationProperties>('search').searchEditor.defaultNumberOfContextLines;

		if (searchResult.isDirty || contextLines === 0 || contextLines === null) {
			const input = instantiationService.invokeFunction(getOrMakeSearchEditorInput, { resultsContents: text, config, from: 'rawData' });
			await editorService.openEditor(input, { pinned: true });
			input.setMatchRanges(matchRanges);
		} else {
			const input = instantiationService.invokeFunction(getOrMakeSearchEditorInput, { from: 'rawData', resultsContents: '', config: { ...config, contextLines } });
			const editor = await editorService.openEditor(input, { pinned: true }) as SearchEditor;
			editor.triggerSearch();
		}
	};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/searchEditor.css';
import { Emitter, Event } from '../../../../base/common/event.js';
import { basename } from '../../../../base/common/path.js';
import { extname, isEqual, joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { Range } from '../../../../editor/common/core/range.js';
import { ITextModel, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { localize } from '../../../../nls.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { GroupIdentifier, IRevertOptions, ISaveOptions, EditorResourceAccessor, IMoveResult, EditorInputCapabilities, IUntypedEditorInput } from '../../../common/editor.js';
import { Memento } from '../../../common/memento.js';
import { SearchEditorFindMatchClass, SearchEditorInputTypeId, SearchEditorScheme, SearchEditorWorkingCopyTypeId, SearchConfiguration } from './constants.js';
import { SearchConfigurationModel, SearchEditorModel, searchEditorModelFactory } from './searchEditorModel.js';
import { defaultSearchConfig, parseSavedSearchEditor, serializeSearchConfiguration } from './searchEditorSerialization.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { ITextFileSaveOptions, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IWorkingCopy, IWorkingCopyBackup, IWorkingCopySaveEvent, WorkingCopyCapabilities } from '../../../services/workingCopy/common/workingCopy.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ISearchComplete, ISearchConfigurationProperties } from '../../../services/search/common/search.js';
import { bufferToReadable, VSBuffer } from '../../../../base/common/buffer.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const SEARCH_EDITOR_EXT = '.code-search';

const SearchEditorIcon = registerIcon('search-editor-label-icon', Codicon.search, localize('searchEditorLabelIcon', 'Icon of the search editor label.'));

export class SearchEditorInput extends EditorInput {
	static readonly ID: string = SearchEditorInputTypeId;

	override get typeId(): string {
		return SearchEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return this.typeId;
	}

	override getIcon(): ThemeIcon {
		return SearchEditorIcon;
	}

	override get capabilities(): EditorInputCapabilities {
		let capabilities = EditorInputCapabilities.None;
		if (!this.backingUri) {
			capabilities |= EditorInputCapabilities.Untitled;
		}

		return capabilities;
	}

	private memento: Memento<{ searchConfig: SearchConfiguration }>;

	private dirty: boolean = false;

	private lastLabel: string | undefined;

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;

	private readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave: Event<IWorkingCopySaveEvent> = this._onDidSave.event;

	private oldDecorationsIDs: string[] = [];

	get resource() {
		return this.backingUri || this.modelUri;
	}

	public ongoingSearchOperation: Promise<ISearchComplete> | undefined;

	public model: SearchEditorModel;
	private _cachedResultsModel: ITextModel | undefined;
	private _cachedConfigurationModel: SearchConfigurationModel | undefined;

	constructor(
		public readonly modelUri: URI,
		public readonly backingUri: URI | undefined,
		@IModelService private readonly modelService: IModelService,
		@ITextFileService protected readonly textFileService: ITextFileService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IPathService private readonly pathService: IPathService,
		@IStorageService storageService: IStorageService,
	) {
		super();

		this.model = instantiationService.createInstance(SearchEditorModel, modelUri);

		if (this.modelUri.scheme !== SearchEditorScheme) {
			throw Error('SearchEditorInput must be invoked with a SearchEditorScheme uri');
		}

		this.memento = new Memento(SearchEditorInput.ID, storageService);
		this._register(storageService.onWillSaveState(() => this.memento.saveMemento()));

		const input = this;
		const workingCopyAdapter = new class implements IWorkingCopy {
			readonly typeId = SearchEditorWorkingCopyTypeId;
			readonly resource = input.modelUri;
			get name() { return input.getName(); }
			readonly capabilities = input.hasCapability(EditorInputCapabilities.Untitled) ? WorkingCopyCapabilities.Untitled : WorkingCopyCapabilities.None;
			readonly onDidChangeDirty = input.onDidChangeDirty;
			readonly onDidChangeContent = input.onDidChangeContent;
			readonly onDidSave = input.onDidSave;
			isDirty(): boolean { return input.isDirty(); }
			isModified(): boolean { return input.isDirty(); }
			backup(token: CancellationToken): Promise<IWorkingCopyBackup> { return input.backup(token); }
			save(options?: ISaveOptions): Promise<boolean> { return input.save(0, options).then(editor => !!editor); }
			revert(options?: IRevertOptions): Promise<void> { return input.revert(0, options); }
		};

		this._register(this.workingCopyService.registerWorkingCopy(workingCopyAdapter));
	}

	override async save(group: GroupIdentifier, options?: ITextFileSaveOptions): Promise<EditorInput | undefined> {
		if (((await this.resolveModels()).resultsModel).isDisposed()) { return; }

		if (this.backingUri) {
			await this.textFileService.write(this.backingUri, await this.serializeForDisk(), options);
			this.setDirty(false);
			this._onDidSave.fire({ reason: options?.reason, source: options?.source });
			return this;
		} else {
			return this.saveAs(group, options);
		}
	}

	public tryReadConfigSync(): SearchConfiguration | undefined {
		return this._cachedConfigurationModel?.config;
	}

	private async serializeForDisk() {
		const { configurationModel, resultsModel } = await this.resolveModels();
		return serializeSearchConfiguration(configurationModel.config) + '\n' + resultsModel.getValue();
	}

	private configChangeListenerDisposable: IDisposable | undefined;
	private registerConfigChangeListeners(model: SearchConfigurationModel) {
		this.configChangeListenerDisposable?.dispose();
		if (!this.isDisposed()) {
			this.configChangeListenerDisposable = model.onConfigDidUpdate(() => {
				if (this.lastLabel !== this.getName()) {
					this._onDidChangeLabel.fire();
					this.lastLabel = this.getName();
				}
				this.memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE).searchConfig = model.config;
			});
			this._register(this.configChangeListenerDisposable);
		}
	}

	async resolveModels() {
		return this.model.resolve().then(data => {
			this._cachedResultsModel = data.resultsModel;
			this._cachedConfigurationModel = data.configurationModel;
			if (this.lastLabel !== this.getName()) {
				this._onDidChangeLabel.fire();
				this.lastLabel = this.getName();
			}
			this.registerConfigChangeListeners(data.configurationModel);
			return data;
		});
	}

	override async saveAs(group: GroupIdentifier, options?: ITextFileSaveOptions): Promise<EditorInput | undefined> {
		const path = await this.fileDialogService.pickFileToSave(await this.suggestFileName(), options?.availableFileSystems);
		if (path) {
			this.telemetryService.publicLog2<
				{},
				{
					owner: 'roblourens';
					comment: 'Fired when a search editor is saved';
				}>
				('searchEditor/saveSearchResults');
			const toWrite = await this.serializeForDisk();
			if (await this.textFileService.create([{ resource: path, value: toWrite, options: { overwrite: true } }])) {
				this.setDirty(false);
				if (!isEqual(path, this.modelUri)) {
					const input = this.instantiationService.invokeFunction(getOrMakeSearchEditorInput, { fileUri: path, from: 'existingFile' });
					input.setMatchRanges(this.getMatchRanges());
					return input;
				}
				return this;
			}
		}
		return undefined;
	}

	override getName(maxLength = 12): string {
		const trimToMax = (label: string) => (label.length < maxLength ? label : `${label.slice(0, maxLength - 3)}...`);

		if (this.backingUri) {
			const originalURI = EditorResourceAccessor.getOriginalUri(this);
			return localize('searchTitle.withQuery', "Search: {0}", basename((originalURI ?? this.backingUri).path, SEARCH_EDITOR_EXT));
		}

		const query = this._cachedConfigurationModel?.config?.query?.trim();
		if (query) {
			return localize('searchTitle.withQuery', "Search: {0}", trimToMax(query));
		}
		return localize('searchTitle', "Search");
	}

	setDirty(dirty: boolean) {
		const wasDirty = this.dirty;
		this.dirty = dirty;
		if (wasDirty !== dirty) {
			this._onDidChangeDirty.fire();
		}
	}

	override isDirty() {
		return this.dirty;
	}

	override async rename(group: GroupIdentifier, target: URI): Promise<IMoveResult | undefined> {
		if (extname(target) === SEARCH_EDITOR_EXT) {
			return {
				editor: this.instantiationService.invokeFunction(getOrMakeSearchEditorInput, { from: 'existingFile', fileUri: target })
			};
		}
		// Ignore move if editor was renamed to a different file extension
		return undefined;
	}

	override dispose() {
		this.modelService.destroyModel(this.modelUri);
		super.dispose();
	}

	override matches(other: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(other)) {
			return true;
		}

		if (other instanceof SearchEditorInput) {
			return !!(other.modelUri.fragment && other.modelUri.fragment === this.modelUri.fragment) || !!(other.backingUri && isEqual(other.backingUri, this.backingUri));
		}
		return false;
	}

	getMatchRanges(): Range[] {
		return (this._cachedResultsModel?.getAllDecorations() ?? [])
			.filter(decoration => decoration.options.className === SearchEditorFindMatchClass)
			.filter(({ range }) => !(range.startColumn === 1 && range.endColumn === 1))
			.map(({ range }) => range);
	}

	async setMatchRanges(ranges: Range[]) {
		this.oldDecorationsIDs = (await this.resolveModels()).resultsModel.deltaDecorations(this.oldDecorationsIDs, ranges.map(range =>
			({ range, options: { description: 'search-editor-find-match', className: SearchEditorFindMatchClass, stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges } })));
	}

	override async revert(group: GroupIdentifier, options?: IRevertOptions) {
		if (options?.soft) {
			this.setDirty(false);
			return;
		}

		if (this.backingUri) {
			const { config, text } = await this.instantiationService.invokeFunction(parseSavedSearchEditor, this.backingUri);
			const { resultsModel, configurationModel } = await this.resolveModels();
			resultsModel.setValue(text);
			configurationModel.updateConfig(config);
		} else {
			(await this.resolveModels()).resultsModel.setValue('');
		}
		super.revert(group, options);
		this.setDirty(false);
	}

	private async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
		const contents = await this.serializeForDisk();
		if (token.isCancellationRequested) {
			return {};
		}

		return {
			content: bufferToReadable(VSBuffer.fromString(contents))
		};
	}

	private async suggestFileName(): Promise<URI> {
		const query = (await this.resolveModels()).configurationModel.config.query;
		const searchFileName = (query.replace(/[^\w \-_]+/g, '_') || 'Search') + SEARCH_EDITOR_EXT;
		return joinPath(await this.fileDialogService.defaultFilePath(this.pathService.defaultUriScheme), searchFileName);
	}

	override toUntyped(): IResourceEditorInput | undefined {
		if (this.hasCapability(EditorInputCapabilities.Untitled)) {
			return undefined;
		}

		return {
			resource: this.resource,
			options: {
				override: SearchEditorInput.ID
			}
		};
	}

	override copy(): EditorInput {
		// Generate a new modelUri for the split editor
		const newModelUri = URI.from({ scheme: SearchEditorScheme, fragment: `${Math.random()}` });
		const config = this._cachedConfigurationModel?.config ?? {};
		const results = this._cachedResultsModel?.getValue() ?? '';
		// Use the 'rawData' variant and pass modelUri
		return this.instantiationService.invokeFunction(
			getOrMakeSearchEditorInput,
			// eslint-disable-next-line local/code-no-any-casts
			{ from: 'rawData', config, resultsContents: results, modelUri: newModelUri } as any // modelUri is not in the type, but we handle it below
		);
	}
}

export const getOrMakeSearchEditorInput = (
	accessor: ServicesAccessor,
	existingData: (
		| { from: 'model'; config?: Partial<SearchConfiguration>; modelUri: URI; backupOf?: URI }
		| { from: 'rawData'; resultsContents: string | undefined; config: Partial<SearchConfiguration>; modelUri?: URI }
		| { from: 'existingFile'; fileUri: URI })
): SearchEditorInput => {

	const storageService = accessor.get(IStorageService);
	const configurationService = accessor.get(IConfigurationService);

	const instantiationService = accessor.get(IInstantiationService);
	let modelUri: URI;
	if (existingData.from === 'model') {
		modelUri = existingData.modelUri;
	} else if (existingData.from === 'rawData' && existingData.modelUri) {
		modelUri = existingData.modelUri;
	} else {
		modelUri = URI.from({ scheme: SearchEditorScheme, fragment: `${Math.random()}` });
	}

	if (!searchEditorModelFactory.models.has(modelUri)) {
		if (existingData.from === 'existingFile') {
			instantiationService.invokeFunction(accessor => searchEditorModelFactory.initializeModelFromExistingFile(accessor, modelUri, existingData.fileUri));
		} else {

			const searchEditorSettings = configurationService.getValue<ISearchConfigurationProperties>('search').searchEditor;

			const reuseOldSettings = searchEditorSettings.reusePriorSearchConfiguration;
			const defaultNumberOfContextLines = searchEditorSettings.defaultNumberOfContextLines;

			const priorConfig = reuseOldSettings ? new Memento<{ searchConfig?: SearchConfiguration }>(SearchEditorInput.ID, storageService).getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE).searchConfig ?? {} : {};
			const defaultConfig = defaultSearchConfig();

			const config = { ...defaultConfig, ...priorConfig, ...existingData.config };

			if (defaultNumberOfContextLines !== null && defaultNumberOfContextLines !== undefined) {
				config.contextLines = existingData?.config?.contextLines ?? defaultNumberOfContextLines;
			}
			if (existingData.from === 'rawData') {
				if (existingData.resultsContents) {
					config.contextLines = 0;
				}
				instantiationService.invokeFunction(accessor => searchEditorModelFactory.initializeModelFromRawData(accessor, modelUri, config, existingData.resultsContents));
			} else {
				instantiationService.invokeFunction(accessor => searchEditorModelFactory.initializeModelFromExistingModel(accessor, modelUri, config));
			}
		}
	}
	return instantiationService.createInstance(
		SearchEditorInput,
		modelUri,
		existingData.from === 'existingFile'
			? existingData.fileUri
			: existingData.from === 'model'
				? existingData.backupOf
				: undefined);
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/searchEditor/browser/searchEditorModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/searchEditor/browser/searchEditorModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { parseSavedSearchEditor, parseSerializedSearchEditor } from './searchEditorSerialization.js';
import { IWorkingCopyBackupService } from '../../../services/workingCopy/common/workingCopyBackup.js';
import { SearchConfiguration, SearchEditorWorkingCopyTypeId } from './constants.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { createTextBufferFactoryFromStream } from '../../../../editor/common/model/textModel.js';
import { Emitter } from '../../../../base/common/event.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { SEARCH_RESULT_LANGUAGE_ID } from '../../../services/search/common/search.js';

export type SearchEditorData = { resultsModel: ITextModel; configurationModel: SearchConfigurationModel };

export class SearchConfigurationModel {
	private _onConfigDidUpdate = new Emitter<SearchConfiguration>();
	public readonly onConfigDidUpdate = this._onConfigDidUpdate.event;

	constructor(public config: Readonly<SearchConfiguration>) { }
	updateConfig(config: SearchConfiguration) { this.config = config; this._onConfigDidUpdate.fire(config); }
}

export class SearchEditorModel {
	constructor(
		private resource: URI,
	) { }

	async resolve(): Promise<SearchEditorData> {
		return assertReturnsDefined(searchEditorModelFactory.models.get(this.resource)).resolve();
	}
}

class SearchEditorModelFactory {
	models = new ResourceMap<{ resolve: () => Promise<SearchEditorData> }>();

	constructor() { }

	initializeModelFromExistingModel(accessor: ServicesAccessor, resource: URI, config: SearchConfiguration) {
		if (this.models.has(resource)) {
			throw Error('Unable to contruct model for resource that already exists');
		}

		const languageService = accessor.get(ILanguageService);
		const modelService = accessor.get(IModelService);
		const instantiationService = accessor.get(IInstantiationService);
		const workingCopyBackupService = accessor.get(IWorkingCopyBackupService);

		let ongoingResolve: Promise<SearchEditorData> | undefined;

		this.models.set(resource, {
			resolve: () => {
				if (!ongoingResolve) {
					ongoingResolve = (async () => {

						const backup = await this.tryFetchModelFromBackupService(resource, languageService, modelService, workingCopyBackupService, instantiationService);
						if (backup) {
							return backup;
						}

						return Promise.resolve({
							resultsModel: modelService.getModel(resource) ?? modelService.createModel('', languageService.createById(SEARCH_RESULT_LANGUAGE_ID), resource),
							configurationModel: new SearchConfigurationModel(config)
						});
					})();
				}
				return ongoingResolve;
			}
		});
	}

	initializeModelFromRawData(accessor: ServicesAccessor, resource: URI, config: SearchConfiguration, contents: string | undefined) {
		if (this.models.has(resource)) {
			throw Error('Unable to contruct model for resource that already exists');
		}

		const languageService = accessor.get(ILanguageService);
		const modelService = accessor.get(IModelService);
		const instantiationService = accessor.get(IInstantiationService);
		const workingCopyBackupService = accessor.get(IWorkingCopyBackupService);

		let ongoingResolve: Promise<SearchEditorData> | undefined;

		this.models.set(resource, {
			resolve: () => {
				if (!ongoingResolve) {
					ongoingResolve = (async () => {

						const backup = await this.tryFetchModelFromBackupService(resource, languageService, modelService, workingCopyBackupService, instantiationService);
						if (backup) {
							return backup;
						}

						return Promise.resolve({
							resultsModel: modelService.createModel(contents ?? '', languageService.createById(SEARCH_RESULT_LANGUAGE_ID), resource),
							configurationModel: new SearchConfigurationModel(config)
						});
					})();
				}
				return ongoingResolve;
			}
		});
	}

	initializeModelFromExistingFile(accessor: ServicesAccessor, resource: URI, existingFile: URI) {
		if (this.models.has(resource)) {
			throw Error('Unable to contruct model for resource that already exists');
		}

		const languageService = accessor.get(ILanguageService);
		const modelService = accessor.get(IModelService);
		const instantiationService = accessor.get(IInstantiationService);
		const workingCopyBackupService = accessor.get(IWorkingCopyBackupService);

		let ongoingResolve: Promise<SearchEditorData> | undefined;

		this.models.set(resource, {
			resolve: async () => {
				if (!ongoingResolve) {
					ongoingResolve = (async () => {

						const backup = await this.tryFetchModelFromBackupService(resource, languageService, modelService, workingCopyBackupService, instantiationService);
						if (backup) {
							return backup;
						}

						const { text, config } = await instantiationService.invokeFunction(parseSavedSearchEditor, existingFile);
						return ({
							resultsModel: modelService.createModel(text ?? '', languageService.createById(SEARCH_RESULT_LANGUAGE_ID), resource),
							configurationModel: new SearchConfigurationModel(config)
						});
					})();
				}
				return ongoingResolve;
			}
		});
	}

	private async tryFetchModelFromBackupService(resource: URI, languageService: ILanguageService, modelService: IModelService, workingCopyBackupService: IWorkingCopyBackupService, instantiationService: IInstantiationService): Promise<SearchEditorData | undefined> {
		const backup = await workingCopyBackupService.resolve({ resource, typeId: SearchEditorWorkingCopyTypeId });

		let model = modelService.getModel(resource);
		if (!model && backup) {
			const factory = await createTextBufferFactoryFromStream(backup.value);

			model = modelService.createModel(factory, languageService.createById(SEARCH_RESULT_LANGUAGE_ID), resource);
		}

		if (model) {
			const existingFile = model.getValue();
			const { text, config } = parseSerializedSearchEditor(existingFile);
			modelService.destroyModel(resource);
			return ({
				resultsModel: modelService.createModel(text ?? '', languageService.createById(SEARCH_RESULT_LANGUAGE_ID), resource),
				configurationModel: new SearchConfigurationModel(config)
			});
		}
		else {
			return undefined;
		}
	}
}

export const searchEditorModelFactory = new SearchEditorModelFactory();
```

--------------------------------------------------------------------------------

````
