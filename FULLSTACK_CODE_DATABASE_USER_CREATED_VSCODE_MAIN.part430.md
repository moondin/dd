---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 430
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 430 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookVariablesDataSource.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookVariablesDataSource.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { AsyncIterableProducer } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { INotebookVariableElement, NotebookVariableDataSource } from '../../browser/contrib/notebookVariables/notebookVariablesDataSource.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { INotebookKernel, INotebookKernelService, VariablesResult } from '../../common/notebookKernelService.js';


suite('NotebookVariableDataSource', () => {
	let dataSource: NotebookVariableDataSource;
	const notebookModel = { uri: 'one.ipynb', languages: ['python'] } as unknown as NotebookTextModel;
	let provideVariablesCalled: boolean;

	type VariablesResultWithAction = VariablesResult & { action?: () => void };
	let results: VariablesResultWithAction[];

	const kernel = new class extends mock<INotebookKernel>() {
		override hasVariableProvider = true;
		override provideVariables(
			notebookUri: URI,
			parentId: number | undefined,
			kind: 'named' | 'indexed',
			start: number,
			token: CancellationToken
		): AsyncIterableProducer<VariablesResult> {
			provideVariablesCalled = true;
			return new AsyncIterableProducer<VariablesResult>((emitter) => {
				for (let i = 0; i < results.length; i++) {
					if (token.isCancellationRequested) {
						break;
					}
					if (results[i].action) {
						results[i].action!();
					}
					emitter.emitOne(results[i]);
				}
			});
		}
	};

	const kernelService = new class extends mock<INotebookKernelService>() {
		override getMatchingKernel(notebook: NotebookTextModel) {
			return { selected: kernel, all: [], suggestions: [], hidden: [] };
		}
	};

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		provideVariablesCalled = false;
		dataSource = new NotebookVariableDataSource(kernelService);
		results = [
			{ id: 1, name: 'a', value: '1', hasNamedChildren: false, indexedChildrenCount: 0 },
		];
	});

	test('Root element should return children', async () => {
		const variables = await dataSource.getChildren({ kind: 'root', notebook: notebookModel });

		assert.strictEqual(variables.length, 1);
	});

	test('Get children of list element', async () => {
		const parent = { kind: 'variable', notebook: notebookModel, id: '1', extHostId: 1, name: 'list', value: '[...]', hasNamedChildren: false, indexedChildrenCount: 5 } as INotebookVariableElement;
		results = [
			{ id: 2, name: 'first', value: '1', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 3, name: 'second', value: '2', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 4, name: 'third', value: '3', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 5, name: 'fourth', value: '4', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 6, name: 'fifth', value: '5', hasNamedChildren: false, indexedChildrenCount: 0 },
		];

		const variables = await dataSource.getChildren(parent);

		assert.strictEqual(variables.length, 5);
	});

	test('Get children for large list', async () => {
		const parent = { kind: 'variable', notebook: notebookModel, id: '1', extHostId: 1, name: 'list', value: '[...]', hasNamedChildren: false, indexedChildrenCount: 2000 } as INotebookVariableElement;
		results = [];

		const variables = await dataSource.getChildren(parent);

		assert(variables.length > 1, 'We should have results for groups of children');
		assert(!provideVariablesCalled, 'provideVariables should not be called');
		assert.equal(variables[0].extHostId, parent.extHostId, 'ExtHostId should match the parent since we will use it to get the real children');
	});

	test('Get children for very large list', async () => {
		const parent = { kind: 'variable', notebook: notebookModel, id: '1', extHostId: 1, name: 'list', value: '[...]', hasNamedChildren: false, indexedChildrenCount: 1_000_000 } as INotebookVariableElement;
		results = [];

		const groups = await dataSource.getChildren(parent);
		const children = await dataSource.getChildren(groups[99]);

		assert(children.length === 100, 'We should have a full page of child groups');
		assert(!provideVariablesCalled, 'provideVariables should not be called');
		assert.equal(children[0].extHostId, parent.extHostId, 'ExtHostId should match the parent since we will use it to get the real children');
	});

	test('Cancel while enumerating through children', async () => {
		const parent = { kind: 'variable', notebook: notebookModel, id: '1', extHostId: 1, name: 'list', value: '[...]', hasNamedChildren: false, indexedChildrenCount: 10 } as INotebookVariableElement;
		results = [
			{ id: 2, name: 'first', value: '1', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 3, name: 'second', value: '2', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 4, name: 'third', value: '3', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 5, name: 'fourth', value: '4', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 5, name: 'fifth', value: '4', hasNamedChildren: false, indexedChildrenCount: 0, action: () => dataSource.cancel() } as VariablesResult,
			{ id: 7, name: 'sixth', value: '6', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 8, name: 'seventh', value: '7', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 9, name: 'eighth', value: '8', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 10, name: 'ninth', value: '9', hasNamedChildren: false, indexedChildrenCount: 0 },
			{ id: 11, name: 'tenth', value: '10', hasNamedChildren: false, indexedChildrenCount: 0 },
		];

		const variables = await dataSource.getChildren(parent);

		assert.equal(variables.length, 5, 'Iterating should have been cancelled');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookViewModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookViewModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IBulkEditService } from '../../../../../editor/browser/services/bulkEditService.js';
import { TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { insertCellAtIndex, runDeleteAction } from '../../browser/controller/cellOperations.js';
import { NotebookEventDispatcher } from '../../browser/viewModel/eventDispatcher.js';
import { NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { ViewContext } from '../../browser/viewModel/viewContext.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellKind, diff } from '../../common/notebookCommon.js';
import { NotebookOptions } from '../../browser/notebookOptions.js';
import { ICellRange } from '../../common/notebookRange.js';
import { NotebookEditorTestModel, setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { IBaseCellEditorOptions } from '../../browser/notebookBrowser.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';

suite('NotebookViewModel', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let textModelService: ITextModelService;
	let bulkEditService: IBulkEditService;
	let undoRedoService: IUndoRedoService;
	let modelService: IModelService;
	let languageService: ILanguageService;
	let languageDetectionService: ILanguageDetectionService;
	let notebookExecutionStateService: INotebookExecutionStateService;
	let notebookLogger: INotebookLoggingService;

	suiteSetup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		textModelService = instantiationService.get(ITextModelService);
		bulkEditService = instantiationService.get(IBulkEditService);
		undoRedoService = instantiationService.get(IUndoRedoService);
		modelService = instantiationService.get(IModelService);
		languageService = instantiationService.get(ILanguageService);
		languageDetectionService = instantiationService.get(ILanguageDetectionService);
		notebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
		notebookLogger = instantiationService.get(INotebookLoggingService);

		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IThemeService, new TestThemeService());
	});

	suiteTeardown(() => disposables.dispose());

	test('ctor', function () {
		const notebook = new NotebookTextModel('notebook', URI.parse('test'), [], {}, { transientCellMetadata: {}, transientDocumentMetadata: {}, transientOutputs: false, cellContentMetadata: {} }, undoRedoService, modelService, languageService, languageDetectionService, notebookExecutionStateService, notebookLogger);
		const model = new NotebookEditorTestModel(notebook);
		const options = new NotebookOptions(mainWindow, false, undefined, instantiationService.get(IConfigurationService), instantiationService.get(INotebookExecutionStateService), instantiationService.get(ICodeEditorService));
		const eventDispatcher = new NotebookEventDispatcher();
		const viewContext = new ViewContext(options, eventDispatcher, () => ({} as IBaseCellEditorOptions));
		const viewModel = new NotebookViewModel('notebook', model.notebook, viewContext, null, { isReadOnly: false }, instantiationService, bulkEditService, undoRedoService, textModelService, notebookExecutionStateService);
		assert.strictEqual(viewModel.viewType, 'notebook');
		notebook.dispose();
		model.dispose();
		options.dispose();
		eventDispatcher.dispose();
		viewModel.dispose();
	});

	test('insert/delete', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const cell = insertCellAtIndex(viewModel, 1, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true);
				assert.strictEqual(viewModel.length, 3);
				assert.strictEqual(viewModel.notebookDocument.cells.length, 3);
				assert.strictEqual(viewModel.getCellIndex(cell), 1);

				runDeleteAction(editor, viewModel.cellAt(1)!);
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.notebookDocument.cells.length, 2);
				assert.strictEqual(viewModel.getCellIndex(cell), -1);

				cell.dispose();
				cell.model.dispose();
			}
		);
	});

	test('index', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const firstViewCell = viewModel.cellAt(0)!;
				const lastViewCell = viewModel.cellAt(viewModel.length - 1)!;

				const insertIndex = viewModel.getCellIndex(firstViewCell) + 1;
				const cell = insertCellAtIndex(viewModel, insertIndex, 'var c = 3;', 'javascript', CellKind.Code, {}, [], true, true);

				const addedCellIndex = viewModel.getCellIndex(cell);
				runDeleteAction(editor, viewModel.cellAt(addedCellIndex)!);

				const secondInsertIndex = viewModel.getCellIndex(lastViewCell) + 1;
				const cell2 = insertCellAtIndex(viewModel, secondInsertIndex, 'var d = 4;', 'javascript', CellKind.Code, {}, [], true, true);

				assert.strictEqual(viewModel.length, 3);
				assert.strictEqual(viewModel.notebookDocument.cells.length, 3);
				assert.strictEqual(viewModel.getCellIndex(cell2), 2);

				cell.dispose();
				cell.model.dispose();
				cell2.dispose();
				cell2.model.dispose();
			}
		);
	});
});

function getVisibleCells<T>(cells: T[], hiddenRanges: ICellRange[]) {
	if (!hiddenRanges.length) {
		return cells;
	}

	let start = 0;
	let hiddenRangeIndex = 0;
	const result: T[] = [];

	while (start < cells.length && hiddenRangeIndex < hiddenRanges.length) {
		if (start < hiddenRanges[hiddenRangeIndex].start) {
			result.push(...cells.slice(start, hiddenRanges[hiddenRangeIndex].start));
		}

		start = hiddenRanges[hiddenRangeIndex].end + 1;
		hiddenRangeIndex++;
	}

	if (start < cells.length) {
		result.push(...cells.slice(start));
	}

	return result;
}

suite('NotebookViewModel Decorations', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('tracking range', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
			],
			(editor, viewModel) => {
				const trackedId = viewModel.setTrackedRange('test', { start: 1, end: 2 }, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 2,
				});

				const cell1 = insertCellAtIndex(viewModel, 0, 'var d = 6;', 'javascript', CellKind.Code, {}, [], true, true);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 2,

					end: 3
				});

				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 2
				});

				const cell2 = insertCellAtIndex(viewModel, 3, 'var d = 7;', 'javascript', CellKind.Code, {}, [], true, true);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 3
				});

				runDeleteAction(editor, viewModel.cellAt(3)!);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 2
				});

				runDeleteAction(editor, viewModel.cellAt(1)!);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 0,

					end: 1
				});

				cell1.dispose();
				cell1.model.dispose();
				cell2.dispose();
				cell2.model.dispose();
			}
		);
	});

	test('tracking range 2', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}],
				['var e = 5;', 'javascript', CellKind.Code, [], {}],
				['var e = 6;', 'javascript', CellKind.Code, [], {}],
				['var e = 7;', 'javascript', CellKind.Code, [], {}],
			],
			(editor, viewModel) => {
				const trackedId = viewModel.setTrackedRange('test', { start: 1, end: 3 }, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 3
				});

				insertCellAtIndex(viewModel, 5, 'var d = 9;', 'javascript', CellKind.Code, {}, [], true, true);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 3
				});

				insertCellAtIndex(viewModel, 4, 'var d = 10;', 'javascript', CellKind.Code, {}, [], true, true);
				assert.deepStrictEqual(viewModel.getTrackedRange(trackedId!), {
					start: 1,

					end: 4
				});
			}
		);
	});

	test('diff hidden ranges', async function () {
		assert.deepStrictEqual(getVisibleCells<number>([1, 2, 3, 4, 5], []), [1, 2, 3, 4, 5]);

		assert.deepStrictEqual(
			getVisibleCells<number>(
				[1, 2, 3, 4, 5],
				[{ start: 1, end: 2 }]
			),
			[1, 4, 5]
		);

		assert.deepStrictEqual(
			getVisibleCells<number>(
				[1, 2, 3, 4, 5, 6, 7, 8, 9],
				[
					{ start: 1, end: 2 },
					{ start: 4, end: 5 }
				]
			),
			[1, 4, 7, 8, 9]
		);

		const original = getVisibleCells<number>(
			[1, 2, 3, 4, 5, 6, 7, 8, 9],
			[
				{ start: 1, end: 2 },
				{ start: 4, end: 5 }
			]
		);

		const modified = getVisibleCells<number>(
			[1, 2, 3, 4, 5, 6, 7, 8, 9],
			[
				{ start: 2, end: 4 }
			]
		);

		assert.deepStrictEqual(diff<number>(original, modified, (a) => {
			return original.indexOf(a) >= 0;
		}), [{ start: 1, deleteCount: 1, toInsert: [2, 6] }]);
	});
});

suite('NotebookViewModel API', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('#115432, get nearest code cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['b = 2;', 'python', CellKind.Code, [], {}],
				['var c = 3', 'javascript', CellKind.Code, [], {}],
				['# header d', 'markdown', CellKind.Markup, [], {}],
				['var e = 4;', 'TypeScript', CellKind.Code, [], {}],
				['# header f', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel) => {
				assert.strictEqual(viewModel.nearestCodeCellIndex(0), 1);
				// find the nearest code cell from above
				assert.strictEqual(viewModel.nearestCodeCellIndex(2), 1);
				assert.strictEqual(viewModel.nearestCodeCellIndex(4), 3);
				assert.strictEqual(viewModel.nearestCodeCellIndex(5), 4);
				assert.strictEqual(viewModel.nearestCodeCellIndex(6), 4);
			}
		);
	});

	test('#108464, get nearest code cell', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel) => {
				assert.strictEqual(viewModel.nearestCodeCellIndex(2), 1);
			}
		);
	});

	test('getCells', async () => {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel) => {
				assert.strictEqual(viewModel.getCellsInRange().length, 3);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 0, end: 1 }).map(cell => cell.getText()), ['# header a']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 0, end: 2 }).map(cell => cell.getText()), ['# header a', 'var b = 1;']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 0, end: 3 }).map(cell => cell.getText()), ['# header a', 'var b = 1;', '# header b']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 0, end: 4 }).map(cell => cell.getText()), ['# header a', 'var b = 1;', '# header b']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 1, end: 4 }).map(cell => cell.getText()), ['var b = 1;', '# header b']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 2, end: 4 }).map(cell => cell.getText()), ['# header b']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 3, end: 4 }).map(cell => cell.getText()), []);

				// no one should use an invalid range but `getCells` should be able to handle that.
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: -1, end: 1 }).map(cell => cell.getText()), ['# header a']);
				assert.deepStrictEqual(viewModel.getCellsInRange({ start: 3, end: 0 }).map(cell => cell.getText()), ['# header a', 'var b = 1;', '# header b']);
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookViewZones.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookViewZones.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NotebookCellsLayout } from '../../browser/view/notebookCellListView.js';
import { FoldingModel } from '../../browser/viewModel/foldingModel.js';
import { CellEditType, CellKind } from '../../common/notebookCommon.js';
import { createNotebookCellList, setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';

suite('NotebookRangeMap', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty', () => {
		const rangeMap = new NotebookCellsLayout();
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);
	});

	const one = { size: 1 };
	const two = { size: 2 };
	const three = { size: 3 };
	const five = { size: 5 };
	const ten = { size: 10 };

	test('length & count', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 1);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #2', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [one, one, one, one, one]);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('length & count #3', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [five]);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #4', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 25);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('insert', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 25);
		assert.strictEqual(rangeMap.count, 5);

		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 50);
		assert.strictEqual(rangeMap.count, 10);

		rangeMap.splice(5, 0, [ten, ten]);
		assert.strictEqual(rangeMap.size, 70);
		assert.strictEqual(rangeMap.count, 12);

		rangeMap.splice(12, 0, [{ size: 200 }]);
		assert.strictEqual(rangeMap.size, 270);
		assert.strictEqual(rangeMap.count, 13);
	});

	test('delete', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [five, five, five, five, five,
			five, five, five, five, five,
			five, five, five, five, five,
			five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 100);
		assert.strictEqual(rangeMap.count, 20);

		rangeMap.splice(10, 5);
		assert.strictEqual(rangeMap.size, 75);
		assert.strictEqual(rangeMap.count, 15);

		rangeMap.splice(0, 1);
		assert.strictEqual(rangeMap.size, 70);
		assert.strictEqual(rangeMap.count, 14);

		rangeMap.splice(1, 13);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);

		rangeMap.splice(1, 1);
		assert.strictEqual(rangeMap.size, 5);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('insert & delete', () => {
		const rangeMap = new NotebookCellsLayout();
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);

		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 1);
		assert.strictEqual(rangeMap.count, 1);

		rangeMap.splice(0, 1);
		assert.strictEqual(rangeMap.size, 0);
		assert.strictEqual(rangeMap.count, 0);
	});

	test('insert & delete #2', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one]);
		rangeMap.splice(2, 6);
		assert.strictEqual(rangeMap.count, 4);
		assert.strictEqual(rangeMap.size, 4);
	});

	test('insert & delete #3', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one,
			two, two, two, two, two,
			two, two, two, two, two]);
		rangeMap.splice(8, 4);
		assert.strictEqual(rangeMap.count, 16);
		assert.strictEqual(rangeMap.size, 24);
	});

	test('insert & delete #4', () => {
		const rangeMap = new NotebookCellsLayout();
		rangeMap.splice(0, 0, [one, one, one, one, one,
			one, one, one, one, one,
			two, two, two, two, two,
			two, two, two, two, two]);
		rangeMap.splice(5, 0, [three, three, three, three, three]);
		assert.strictEqual(rangeMap.count, 25);
		assert.strictEqual(rangeMap.size, 45);

		rangeMap.splice(4, 7);
		assert.strictEqual(rangeMap.count, 18);
		assert.strictEqual(rangeMap.size, 28);
	});

	suite('indexAt, positionAt', () => {
		test('empty', () => {
			const rangeMap = new NotebookCellsLayout();
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(-1), -1);
			assert.strictEqual(rangeMap.positionAt(0), -1);
			assert.strictEqual(rangeMap.positionAt(10), -1);
			assert.strictEqual(rangeMap.positionAt(-1), -1);
		});

		test('simple', () => {
			const rangeMap = new NotebookCellsLayout();
			rangeMap.splice(0, 0, [one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});

		test('simple #2', () => {
			const rangeMap = new NotebookCellsLayout();
			rangeMap.splice(0, 0, [ten]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(5), 0);
			assert.strictEqual(rangeMap.indexAt(9), 0);
			assert.strictEqual(rangeMap.indexAt(10), 1);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});

		test('insert', () => {
			const rangeMap = new NotebookCellsLayout();
			rangeMap.splice(0, 0, [one, one, one, one, one, one, one, one, one, one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.indexAt(5), 5);
			assert.strictEqual(rangeMap.indexAt(9), 9);
			assert.strictEqual(rangeMap.indexAt(10), 10);
			assert.strictEqual(rangeMap.indexAt(11), 10);

			rangeMap.splice(10, 0, [one, one, one, one, one, one, one, one, one, one]);
			assert.strictEqual(rangeMap.indexAt(10), 10);
			assert.strictEqual(rangeMap.indexAt(19), 19);
			assert.strictEqual(rangeMap.indexAt(20), 20);
			assert.strictEqual(rangeMap.indexAt(21), 20);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(19), 19);
			assert.strictEqual(rangeMap.positionAt(20), -1);
		});

		test('delete', () => {
			const rangeMap = new NotebookCellsLayout();
			rangeMap.splice(0, 0, [one, one, one, one, one, one, one, one, one, one]);
			rangeMap.splice(2, 6);

			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 1);
			assert.strictEqual(rangeMap.indexAt(3), 3);
			assert.strictEqual(rangeMap.indexAt(4), 4);
			assert.strictEqual(rangeMap.indexAt(5), 4);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 1);
			assert.strictEqual(rangeMap.positionAt(3), 3);
			assert.strictEqual(rangeMap.positionAt(4), -1);
		});

		test('delete #2', () => {
			const rangeMap = new NotebookCellsLayout();
			rangeMap.splice(0, 0, [ten, ten, ten, ten, ten, ten, ten, ten, ten, ten]);
			rangeMap.splice(2, 6);

			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 0);
			assert.strictEqual(rangeMap.indexAt(30), 3);
			assert.strictEqual(rangeMap.indexAt(40), 4);
			assert.strictEqual(rangeMap.indexAt(50), 4);
			assert.strictEqual(rangeMap.positionAt(0), 0);
			assert.strictEqual(rangeMap.positionAt(1), 10);
			assert.strictEqual(rangeMap.positionAt(2), 20);
			assert.strictEqual(rangeMap.positionAt(3), 30);
			assert.strictEqual(rangeMap.positionAt(4), -1);
		});
	});
});

suite('NotebookRangeMap with top padding', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('empty', () => {
		const rangeMap = new NotebookCellsLayout(10);
		assert.strictEqual(rangeMap.size, 10);
		assert.strictEqual(rangeMap.count, 0);
	});

	const one = { size: 1 };
	const five = { size: 5 };
	const ten = { size: 10 };

	test('length & count', () => {
		const rangeMap = new NotebookCellsLayout(10);
		rangeMap.splice(0, 0, [one]);
		assert.strictEqual(rangeMap.size, 11);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #2', () => {
		const rangeMap = new NotebookCellsLayout(10);
		rangeMap.splice(0, 0, [one, one, one, one, one]);
		assert.strictEqual(rangeMap.size, 15);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('length & count #3', () => {
		const rangeMap = new NotebookCellsLayout(10);
		rangeMap.splice(0, 0, [five]);
		assert.strictEqual(rangeMap.size, 15);
		assert.strictEqual(rangeMap.count, 1);
	});

	test('length & count #4', () => {
		const rangeMap = new NotebookCellsLayout(10);
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 35);
		assert.strictEqual(rangeMap.count, 5);
	});

	test('insert', () => {
		const rangeMap = new NotebookCellsLayout(10);
		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 35);
		assert.strictEqual(rangeMap.count, 5);

		rangeMap.splice(0, 0, [five, five, five, five, five]);
		assert.strictEqual(rangeMap.size, 60);
		assert.strictEqual(rangeMap.count, 10);

		rangeMap.splice(5, 0, [ten, ten]);
		assert.strictEqual(rangeMap.size, 80);
		assert.strictEqual(rangeMap.count, 12);

		rangeMap.splice(12, 0, [{ size: 200 }]);
		assert.strictEqual(rangeMap.size, 280);
		assert.strictEqual(rangeMap.count, 13);
	});

	suite('indexAt, positionAt', () => {
		test('empty', () => {
			const rangeMap = new NotebookCellsLayout(10);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(-1), -1);
			assert.strictEqual(rangeMap.positionAt(0), -1);
			assert.strictEqual(rangeMap.positionAt(10), -1);
			assert.strictEqual(rangeMap.positionAt(-1), -1);
		});

		test('simple', () => {
			const rangeMap = new NotebookCellsLayout(10);
			rangeMap.splice(0, 0, [one]);
			assert.strictEqual(rangeMap.indexAt(0), 0);
			assert.strictEqual(rangeMap.indexAt(1), 0);
			assert.strictEqual(rangeMap.indexAt(10), 0);
			assert.strictEqual(rangeMap.indexAt(11), 1);
			assert.strictEqual(rangeMap.positionAt(0), 10);
			assert.strictEqual(rangeMap.positionAt(1), -1);
		});
	});
});

suite('NotebookRangeMap with whitesspaces', () => {
	let testDisposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let config: TestConfigurationService;

	teardown(() => {
		testDisposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		testDisposables = new DisposableStore();
		instantiationService = setupInstantiationService(testDisposables);
		config = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, config);
	});

	test('simple', () => {
		const rangeMap = new NotebookCellsLayout(0);
		rangeMap.splice(0, 0, [{ size: 479 }, { size: 163 }, { size: 182 }, { size: 106 }, { size: 106 }, { size: 106 }, { size: 87 }]);

		const start = rangeMap.indexAt(650);
		const end = rangeMap.indexAfter(650 + 890 - 1);
		assert.strictEqual(start, 2);
		assert.strictEqual(end, 7);

		rangeMap.insertWhitespace('1', 0, 18);
		assert.strictEqual(rangeMap.indexAt(650), 1);
	});

	test('Whitespace CRUD', async function () {
		const twenty = { size: 20 };

		const rangeMap = new NotebookCellsLayout(0);
		rangeMap.splice(0, 0, [twenty, twenty, twenty]);
		rangeMap.insertWhitespace('0', 0, 5);
		rangeMap.insertWhitespace('1', 0, 5);
		assert.strictEqual(rangeMap.indexAt(0), 0);
		assert.strictEqual(rangeMap.indexAt(1), 0);
		assert.strictEqual(rangeMap.indexAt(10), 0);
		assert.strictEqual(rangeMap.indexAt(11), 0);
		assert.strictEqual(rangeMap.indexAt(21), 0);
		assert.strictEqual(rangeMap.indexAt(31), 1);
		assert.strictEqual(rangeMap.positionAt(0), 10);

		assert.strictEqual(rangeMap.getWhitespacePosition('0'), 0);
		assert.strictEqual(rangeMap.getWhitespacePosition('1'), 5);

		assert.strictEqual(rangeMap.positionAt(0), 10);
		assert.strictEqual(rangeMap.positionAt(1), 30);

		rangeMap.changeOneWhitespace('0', 0, 10);
		assert.strictEqual(rangeMap.getWhitespacePosition('0'), 0);
		assert.strictEqual(rangeMap.getWhitespacePosition('1'), 10);

		assert.strictEqual(rangeMap.positionAt(0), 15);
		assert.strictEqual(rangeMap.positionAt(1), 35);

		rangeMap.removeWhitespace('1');
		assert.strictEqual(rangeMap.getWhitespacePosition('0'), 0);

		assert.strictEqual(rangeMap.positionAt(0), 10);
		assert.strictEqual(rangeMap.positionAt(1), 30);
	});

	test('Whitespace with editing', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 1,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 70);
					assert.strictEqual(cellList.getElementTop(2), 170);

					const textModel = editor.textModel;
					textModel.applyEdits([
						{ editType: CellEditType.Replace, index: 0, count: 1, cells: [] },
					], true, undefined, () => undefined, undefined, true);

					assert.strictEqual(cellList.getElementTop(0), 20);
					assert.strictEqual(cellList.getElementTop(1), 120);
					assert.strictEqual(cellList.getElementTop(2), 170);

					accessor.removeZone(id);
				});
			});
	});

	test('Multiple Whitespaces', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const first = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(first);

					const second = accessor.addZone({
						afterModelPosition: 3,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(second);

					assert.strictEqual(cellList.scrollHeight, 390);

					assert.strictEqual(cellList.getElementTop(0), 20);
					assert.strictEqual(cellList.getElementTop(1), 70);
					assert.strictEqual(cellList.getElementTop(2), 170);
					assert.strictEqual(cellList.getElementTop(3), 240);

					accessor.removeZone(first);

					assert.strictEqual(cellList.scrollHeight, 370);
					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 50);
					assert.strictEqual(cellList.getElementTop(2), 150);
					assert.strictEqual(cellList.getElementTop(3), 220);

					accessor.removeZone(second);

					assert.strictEqual(cellList.scrollHeight, 350);
					assert.strictEqual(cellList.getElementTop(3), 200);
				});
			});
	});

	test('Multiple Whitespaces 2', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const first = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(first);

					const second = accessor.addZone({
						afterModelPosition: 1,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(second);

					assert.strictEqual(cellList.scrollHeight, 390);
					assert.strictEqual(cellList._getView().getWhitespacePosition(first), 0);
					assert.strictEqual(cellList._getView().getWhitespacePosition(second), 70);

					accessor.removeZone(first);
					accessor.removeZone(second);
				});
			});
	});

	test('Multiple Whitespaces 3', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const first = accessor.addZone({
						afterModelPosition: 1,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(first);

					const second = accessor.addZone({
						afterModelPosition: 2,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(second);

					assert.strictEqual(cellList.scrollHeight, 390);
					assert.strictEqual(cellList._getView().getWhitespacePosition(first), 50);
					assert.strictEqual(cellList._getView().getWhitespacePosition(second), 170);

					accessor.removeZone(first);
					accessor.removeZone(second);
				});
			});
	});

	// test('Multiple Whitespaces 4', async function () {
	// 	await withTestNotebook(
	// 		[
	// 			['# header a', 'markdown', CellKind.Markup, [], {}],
	// 			['var b = 1;', 'javascript', CellKind.Code, [], {}],
	// 			['# header b', 'markdown', CellKind.Markup, [], {}],
	// 			['var b = 2;', 'javascript', CellKind.Code, [], {}],
	// 			['# header c', 'markdown', CellKind.Markup, [], {}]
	// 		],
	// 		async (editor, viewModel, disposables) => {
	// 			viewModel.restoreEditorViewState({
	// 				editingCells: [false, false, false, false, false],
	// 				cellLineNumberStates: {},
	// 				editorViewStates: [null, null, null, null, null],
	// 				cellTotalHeights: [50, 100, 50, 100, 50],
	// 				collapsedInputCells: {},
	// 				collapsedOutputCells: {},
	// 			});

	// 			const cellList = createNotebookCellList(instantiationService, disposables);
	// 			disposables.add(cellList);
	// 			cellList.attachViewModel(viewModel);

	// 			// render height 210, it can render 3 full cells and 1 partial cell
	// 			cellList.layout(210, 100);
	// 			assert.strictEqual(cellList.scrollHeight, 350);

	// 			cellList.changeViewZones(accessor => {
	// 				const first = accessor.addZone({
	// 					afterModelPosition: 1,
	// 					heightInPx: 20,
	// 					domNode: document.createElement('div')
	// 				});
	// 				accessor.layoutZone(first);

	// 				const second = accessor.addZone({
	// 					afterModelPosition: 1,
	// 					heightInPx: 20,
	// 					domNode: document.createElement('div')
	// 				});
	// 				accessor.layoutZone(second);

	// 				const third = accessor.addZone({
	// 					afterModelPosition: 2,
	// 					heightInPx: 20,
	// 					domNode: document.createElement('div')
	// 				});
	// 				accessor.layoutZone(second);

	// 				assert.strictEqual(cellList.scrollHeight, 410);
	// 				assert.strictEqual(cellList._getView().getWhitespacePosition(first), 50);
	// 				assert.strictEqual(cellList._getView().getWhitespacePosition(second), 70);
	// 				assert.strictEqual(cellList._getView().getWhitespacePosition(third), 190);

	// 				accessor.removeZone(first);
	// 				accessor.removeZone(second);
	// 				accessor.removeZone(third);
	// 			});
	// 		});
	// });

	test('Whitespace with folding support', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					assert.strictEqual(cellList.getElementTop(0), 20);
					assert.strictEqual(cellList.getElementTop(1), 70);
					assert.strictEqual(cellList.getElementTop(2), 170);
					assert.strictEqual(cellList.getElementTop(3), 220);
					assert.strictEqual(cellList.getElementTop(4), 320);

					accessor.removeZone(id);
					assert.strictEqual(cellList.scrollHeight, 350);
				});

				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 1,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 70);
					assert.strictEqual(cellList.getElementTop(2), 170);
					assert.strictEqual(cellList.getElementTop(3), 220);
					assert.strictEqual(cellList.getElementTop(4), 320);

					accessor.removeZone(id);
					assert.strictEqual(cellList.scrollHeight, 350);
				});

				// Whitespace should be hidden if it's after the header in a folding region
				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 3,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					const foldingModel = disposables.add(new FoldingModel());
					foldingModel.attachViewModel(viewModel);
					foldingModel.applyMemento([{ start: 2, end: 3 }]);
					viewModel.updateFoldingRanges(foldingModel.regions);
					assert.deepStrictEqual(viewModel.getHiddenRanges(), [
						{ start: 3, end: 3 }
					]);
					cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
					assert.strictEqual(cellList.scrollHeight, 250);

					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 50);
					assert.strictEqual(cellList.getElementTop(2), 150);
					assert.strictEqual(cellList.getElementTop(3), 200);

					cellList.setHiddenAreas([], true);
					assert.strictEqual(cellList.scrollHeight, 370);
					accessor.removeZone(id);
					assert.strictEqual(cellList.scrollHeight, 350);
				});

				// Whitespace should not be hidden if it's after the last cell in a folding region
				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 4,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					const foldingModel = disposables.add(new FoldingModel());
					foldingModel.attachViewModel(viewModel);
					foldingModel.applyMemento([{ start: 2, end: 3 }]);
					viewModel.updateFoldingRanges(foldingModel.regions);
					assert.deepStrictEqual(viewModel.getHiddenRanges(), [
						{ start: 3, end: 3 }
					]);
					cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
					assert.strictEqual(cellList.scrollHeight, 270);

					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 50);
					assert.strictEqual(cellList.getElementTop(2), 150);
					assert.strictEqual(cellList.getElementTop(3), 220);

					cellList.setHiddenAreas([], true);
					assert.strictEqual(cellList.scrollHeight, 370);
					accessor.removeZone(id);
					assert.strictEqual(cellList.scrollHeight, 350);
				});

				// Whitespace move when previous folding regions fold
				cellList.changeViewZones(accessor => {
					const id = accessor.addZone({
						afterModelPosition: 4,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(id);
					assert.strictEqual(cellList.scrollHeight, 370);

					const foldingModel = disposables.add(new FoldingModel());
					foldingModel.attachViewModel(viewModel);
					foldingModel.applyMemento([{ start: 0, end: 1 }]);
					viewModel.updateFoldingRanges(foldingModel.regions);
					assert.deepStrictEqual(viewModel.getHiddenRanges(), [
						{ start: 1, end: 1 }
					]);
					cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
					assert.strictEqual(cellList.scrollHeight, 270);

					assert.strictEqual(cellList.getElementTop(0), 0);
					assert.strictEqual(cellList.getElementTop(1), 50);
					assert.strictEqual(cellList.getElementTop(2), 100);
					assert.strictEqual(cellList.getElementTop(3), 220);

					cellList.setHiddenAreas([], true);
					assert.strictEqual(cellList.scrollHeight, 370);
					accessor.removeZone(id);
					assert.strictEqual(cellList.scrollHeight, 350);
				});
			});
	});

	test('Whitespace with multiple viewzones at same position', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			async (editor, viewModel, disposables) => {
				viewModel.restoreEditorViewState({
					editingCells: [false, false, false, false, false],
					cellLineNumberStates: {},
					editorViewStates: [null, null, null, null, null],
					cellTotalHeights: [50, 100, 50, 100, 50],
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = createNotebookCellList(instantiationService, disposables);
				disposables.add(cellList);
				cellList.attachViewModel(viewModel);

				// render height 210, it can render 3 full cells and 1 partial cell
				cellList.layout(210, 100);
				assert.strictEqual(cellList.scrollHeight, 350);

				cellList.changeViewZones(accessor => {
					const first = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: 20,
						domNode: document.createElement('div')
					});

					accessor.layoutZone(first);
					assert.strictEqual(cellList.scrollHeight, 370);

					const second = accessor.addZone({
						afterModelPosition: 0,
						heightInPx: 20,
						domNode: document.createElement('div')
					});
					accessor.layoutZone(second);
					assert.strictEqual(cellList.scrollHeight, 390);

					assert.strictEqual(cellList.getElementTop(0), 40);
					assert.strictEqual(cellList.getElementTop(1), 90);
					assert.strictEqual(cellList.getElementTop(2), 190);
					assert.strictEqual(cellList.getElementTop(3), 240);
					assert.strictEqual(cellList.getElementTop(4), 340);


					accessor.removeZone(first);
					assert.strictEqual(cellList.scrollHeight, 370);
					accessor.removeZone(second);
					assert.strictEqual(cellList.scrollHeight, 350);
				});
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookWorkbenchToolbar.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookWorkbenchToolbar.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workbenchCalculateActions, workbenchDynamicCalculateActions } from '../../browser/viewParts/notebookEditorToolbar.js';
import { Action, IAction, Separator } from '../../../../../base/common/actions.js';
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

interface IActionModel {
	action: IAction;
	size: number;
	visible: boolean;
	renderLabel: boolean;
}

/**
 * Calculate the visible actions in the toolbar.
 * @param action The action to measure.
 * @param container The container the action will be placed in.
 * @returns The primary and secondary actions to be rendered
 *
 * NOTE: every action requires space for ACTION_PADDING +8 to the right.
 *
 * ex: action with size 50 requires 58px of space
 */
suite('Workbench Toolbar calculateActions (strategy always + never)', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const defaultSecondaryActionModels: IActionModel[] = [
		{ action: new Action('secondaryAction0', 'Secondary Action 0'), size: 50, visible: true, renderLabel: true },
		{ action: new Action('secondaryAction1', 'Secondary Action 1'), size: 50, visible: true, renderLabel: true },
		{ action: new Action('secondaryAction2', 'Secondary Action 2'), size: 50, visible: true, renderLabel: true },
	];
	const defaultSecondaryActions: IAction[] = defaultSecondaryActionModels.map(action => action.action);
	const separator: IActionModel = { action: new Separator(), size: 1, visible: true, renderLabel: true };

	setup(function () {
		defaultSecondaryActionModels.forEach(action => disposables.add(<Action>action.action));
	});

	test('should return empty primary and secondary actions when given empty initial actions', () => {
		const result = workbenchCalculateActions([], [], 100);
		assert.deepEqual(result.primaryActions, []);
		assert.deepEqual(result.secondaryActions, []);
	});

	test('should return all primary actions when they fit within the container width', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action2', 'Action 2')), size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 200);
		assert.deepEqual(result.primaryActions, actions);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should move actions to secondary when they do not fit within the container width', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action2', 'Action 2')), size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 100);
		assert.deepEqual(result.primaryActions, [actions[0]]);
		assert.deepEqual(result.secondaryActions, [actions[1], actions[2], separator, ...defaultSecondaryActionModels].map(action => action.action));
	});

	test('should ignore second separator when two separators are in a row', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 125);
		assert.deepEqual(result.primaryActions, [actions[0], actions[1], actions[3]]);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should ignore separators when they are at the end of the resulting primary actions', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 200);
		assert.deepEqual(result.primaryActions, [actions[0], actions[1], actions[2]]);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should keep actions with size 0 in primary actions', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action2', 'Action 2')), size: 50, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action3', 'Action 3')), size: 0, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 116);
		assert.deepEqual(result.primaryActions, [actions[0], actions[1], actions[3]]);
		assert.deepEqual(result.secondaryActions, [actions[2], separator, ...defaultSecondaryActionModels].map(action => action.action));
	});

	test('should not render separator if preceeded by size 0 action(s).', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 0, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 116);
		assert.deepEqual(result.primaryActions, [actions[0], actions[2]]);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should not render second separator if space between is hidden (size 0) actions.', () => {
		const actions: IActionModel[] = [
			{ action: disposables.add(new Action('action0', 'Action 0')), size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action1', 'Action 1')), size: 0, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action2', 'Action 2')), size: 0, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: disposables.add(new Action('action3', 'Action 3')), size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchCalculateActions(actions, defaultSecondaryActions, 300);
		assert.deepEqual(result.primaryActions, [actions[0], actions[1], actions[2], actions[3], actions[5]]);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});
});

suite('Workbench Toolbar Dynamic calculateActions (strategy dynamic)', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const actionTemplate = [
		new Action('action0', 'Action 0'),
		new Action('action1', 'Action 1'),
		new Action('action2', 'Action 2'),
		new Action('action3', 'Action 3')
	];

	const defaultSecondaryActionModels: IActionModel[] = [
		{ action: new Action('secondaryAction0', 'Secondary Action 0'), size: 50, visible: true, renderLabel: true },
		{ action: new Action('secondaryAction1', 'Secondary Action 1'), size: 50, visible: true, renderLabel: true },
		{ action: new Action('secondaryAction2', 'Secondary Action 2'), size: 50, visible: true, renderLabel: true },
	];
	const defaultSecondaryActions: IAction[] = defaultSecondaryActionModels.map(action => action.action);

	setup(function () {
		defaultSecondaryActionModels.forEach(action => disposables.add(<Action>action.action));
	});

	test('should return empty primary and secondary actions when given empty initial actions', () => {
		const result = workbenchDynamicCalculateActions([], [], 100);
		assert.deepEqual(result.primaryActions, []);
		assert.deepEqual(result.secondaryActions, []);
	});

	test('should return all primary actions as visiblewhen they fit within the container width', () => {
		const constainerSize = 200;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, constainerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('actions all within a group that cannot all fit, will all be icon only', () => {
		const containerSize = 150;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: false },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: false },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: false },
		];


		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, [...defaultSecondaryActionModels].map(action => action.action));
	});

	test('should ignore second separator when two separators are in a row', () => {
		const containerSize = 200;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('check label visibility in different groupings', () => {
		const containerSize = 150;
		const actions: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: true },
		];
		const expectedOutputActions: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: false },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: false },
		];


		const result = workbenchDynamicCalculateActions(actions, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expectedOutputActions);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should ignore separators when they are at the end of the resulting primary actions', () => {
		const containerSize = 200;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should keep actions with size 0 in primary actions', () => {
		const containerSize = 170;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[3], size: 0, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 50, visible: true, renderLabel: false },
			{ action: actionTemplate[3], size: 0, visible: true, renderLabel: false },
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should not render separator if preceeded by size 0 action(s), but keep size 0 action in primary.', () => {
		const containerSize = 116;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 0, visible: true, renderLabel: true }, 	// hidden
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },		// sep
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true },	// visible
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 0, visible: true, renderLabel: true }, 	// hidden
			{ action: actionTemplate[1], size: 50, visible: true, renderLabel: true } 	// visible
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});

	test('should not render second separator if space between is hidden (size 0) actions.', () => {
		const containerSize = 300;
		const input: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 0, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 0, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[3], size: 50, visible: true, renderLabel: true },
		];
		const expected: IActionModel[] = [
			{ action: actionTemplate[0], size: 50, visible: true, renderLabel: true },
			{ action: new Separator(), size: 1, visible: true, renderLabel: true },
			{ action: actionTemplate[1], size: 0, visible: true, renderLabel: true },
			{ action: actionTemplate[2], size: 0, visible: true, renderLabel: true },
			// remove separator here
			{ action: actionTemplate[3], size: 50, visible: true, renderLabel: true },
		];
		const result = workbenchDynamicCalculateActions(input, defaultSecondaryActions, containerSize);
		assert.deepEqual(result.primaryActions, expected);
		assert.deepEqual(result.secondaryActions, defaultSecondaryActions);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/testNotebookEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/testNotebookEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { IListRenderer, IListVirtualDelegate } from '../../../../../base/browser/ui/list/list.js';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { NotImplementedError } from '../../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { ILanguageConfigurationService } from '../../../../../editor/common/languages/languageConfigurationRegistry.js';
import { LanguageService } from '../../../../../editor/common/services/languageService.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ModelService } from '../../../../../editor/common/services/modelService.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { TestLanguageConfigurationService } from '../../../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { TestClipboardService } from '../../../../../platform/clipboard/test/common/testClipboardService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ContextKeyService } from '../../../../../platform/contextkey/browser/contextKeyService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { MockKeybindingService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { ILayoutService } from '../../../../../platform/layout/browser/layoutService.js';
import { IListService, ListService } from '../../../../../platform/list/browser/listService.js';
import { ILogService, NullLogService } from '../../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { TestThemeService } from '../../../../../platform/theme/test/common/testThemeService.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../../../platform/undoRedo/common/undoRedoService.js';
import { IWorkspaceTrustRequestService } from '../../../../../platform/workspace/common/workspaceTrust.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { EditorModel } from '../../../../common/editor/editorModel.js';
import { CellFindMatchWithIndex, CellFocusMode, IActiveNotebookEditorDelegate, IBaseCellEditorOptions, ICellViewModel, INotebookEditorDelegate } from '../../browser/notebookBrowser.js';
import { NotebookCellStateChangedEvent, NotebookLayoutInfo } from '../../browser/notebookViewEvents.js';
import { NotebookCellStatusBarService } from '../../browser/services/notebookCellStatusBarServiceImpl.js';
import { ListViewInfoAccessor, NotebookCellList } from '../../browser/view/notebookCellList.js';
import { BaseCellRenderTemplate } from '../../browser/view/notebookRenderingCommon.js';
import { NotebookEventDispatcher } from '../../browser/viewModel/eventDispatcher.js';
import { CellViewModel, NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { ViewContext } from '../../browser/viewModel/viewContext.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { INotebookCellStatusBarService } from '../../common/notebookCellStatusBarService.js';
import { CellKind, CellUri, ICellDto2, INotebookDiffEditorModel, INotebookEditorModel, INotebookFindOptions, IOutputDto, IResolvedNotebookEditorModel, NotebookCellExecutionState, NotebookCellMetadata, SelectionStateType } from '../../common/notebookCommon.js';
import { ICellExecuteUpdate, ICellExecutionComplete, ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookCellExecution, INotebookExecution, INotebookExecutionStateService, INotebookFailStateChangedEvent } from '../../common/notebookExecutionStateService.js';
import { NotebookOptions } from '../../browser/notebookOptions.js';
import { ICellRange } from '../../common/notebookRange.js';
import { TextModelResolverService } from '../../../../services/textmodelResolver/common/textModelResolverService.js';
import { IWorkingCopySaveEvent } from '../../../../services/workingCopy/common/workingCopy.js';
import { TestLayoutService } from '../../../../test/browser/workbenchTestServices.js';
import { TestStorageService, TestTextResourcePropertiesService, TestWorkspaceTrustRequestService } from '../../../../test/common/workbenchTestServices.js';
import { FontInfo } from '../../../../../editor/common/config/fontInfo.js';
import { EditorFontLigatures, EditorFontVariations } from '../../../../../editor/common/config/editorOptions.js';
import { ICodeEditorService } from '../../../../../editor/browser/services/codeEditorService.js';
import { mainWindow } from '../../../../../base/browser/window.js';
import { TestCodeEditorService } from '../../../../../editor/test/browser/editorTestServices.js';
import { INotebookCellOutlineDataSourceFactory, NotebookCellOutlineDataSourceFactory } from '../../browser/viewModel/notebookOutlineDataSourceFactory.js';
import { ILanguageDetectionService } from '../../../../services/languageDetection/common/languageDetectionWorkerService.js';
import { INotebookOutlineEntryFactory, NotebookOutlineEntryFactory } from '../../browser/viewModel/notebookOutlineEntryFactory.js';
import { IOutlineService } from '../../../../services/outline/browser/outline.js';
import { DefaultEndOfLine } from '../../../../../editor/common/model.js';
import { ITextResourcePropertiesService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';

class NullNotebookLoggingService implements INotebookLoggingService {
	_serviceBrand: undefined;
	info(category: string, output: string): void { }
	warn(category: string, output: string): void { }
	error(category: string, output: string): void { }
	debug(category: string, output: string): void { }
	trace(category: string, message: string): void { }
}

export class TestCell extends NotebookCellTextModel {
	constructor(
		public viewType: string,
		handle: number,
		public source: string,
		language: string,
		cellKind: CellKind,
		outputs: IOutputDto[],
		languageService: ILanguageService,
	) {
		super(
			CellUri.generate(URI.parse('test:///fake/notebook'), handle),
			handle,
			{
				source,
				language,
				mime: Mimes.text,
				cellKind,
				outputs,
				metadata: undefined,
				internalMetadata: undefined,
				collapseState: undefined
			},
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, transientOutputs: false, cellContentMetadata: {} },
			languageService,
			DefaultEndOfLine.LF,
			undefined, // defaultCollapseConfig
			undefined,  // languageDetectionService
			new NullNotebookLoggingService()
		);
	}
}

export class NotebookEditorTestModel extends EditorModel implements INotebookEditorModel {
	private _dirty = false;

	protected readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	protected readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	readonly onDidChangeOrphaned = Event.None;
	readonly onDidChangeReadonly = Event.None;
	readonly onDidRevertUntitled = Event.None;

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;


	get viewType() {
		return this._notebook.viewType;
	}

	get resource() {
		return this._notebook.uri;
	}

	get notebook(): NotebookTextModel {
		return this._notebook;
	}

	constructor(
		private _notebook: NotebookTextModel
	) {
		super();

		if (_notebook && _notebook.onDidChangeContent) {
			this._register(_notebook.onDidChangeContent(() => {
				this._dirty = true;
				this._onDidChangeDirty.fire();
				this._onDidChangeContent.fire();
			}));
		}
	}

	isReadonly(): boolean {
		return false;
	}

	isOrphaned(): boolean {
		return false;
	}

	hasAssociatedFilePath(): boolean {
		return false;
	}

	isDirty() {
		return this._dirty;
	}

	get hasErrorState() {
		return false;
	}

	isModified(): boolean {
		return this._dirty;
	}

	getNotebook(): NotebookTextModel {
		return this._notebook;
	}

	async load(): Promise<IResolvedNotebookEditorModel> {
		return this;
	}

	async save(): Promise<boolean> {
		if (this._notebook) {
			this._dirty = false;
			this._onDidChangeDirty.fire();
			this._onDidSave.fire({});
			// todo, flush all states
			return true;
		}

		return false;
	}

	saveAs(): Promise<EditorInput | undefined> {
		throw new NotImplementedError();
	}

	revert(): Promise<void> {
		throw new NotImplementedError();
	}
}

export function setupInstantiationService(disposables: Pick<DisposableStore, 'add'>) {
	const instantiationService = disposables.add(new TestInstantiationService());
	const testThemeService = new TestThemeService();
	instantiationService.stub(ILanguageService, disposables.add(new LanguageService()));
	instantiationService.stub(IUndoRedoService, instantiationService.createInstance(UndoRedoService));
	instantiationService.stub(IConfigurationService, new TestConfigurationService());
	instantiationService.stub(IThemeService, testThemeService);
	instantiationService.stub(ILanguageConfigurationService, disposables.add(new TestLanguageConfigurationService()));
	instantiationService.stub(ITextResourcePropertiesService, instantiationService.createInstance(TestTextResourcePropertiesService));
	instantiationService.stub(IModelService, disposables.add(instantiationService.createInstance(ModelService)));
	instantiationService.stub(ITextModelService, <ITextModelService>disposables.add(instantiationService.createInstance(TextModelResolverService)));
	instantiationService.stub(IContextKeyService, disposables.add(instantiationService.createInstance(ContextKeyService)));
	instantiationService.stub(IListService, disposables.add(instantiationService.createInstance(ListService)));
	instantiationService.stub(ILayoutService, new TestLayoutService());
	instantiationService.stub(ILogService, new NullLogService());
	instantiationService.stub(IClipboardService, TestClipboardService);
	instantiationService.stub(IStorageService, disposables.add(new TestStorageService()));
	instantiationService.stub(IWorkspaceTrustRequestService, disposables.add(new TestWorkspaceTrustRequestService(true)));
	instantiationService.stub(INotebookExecutionStateService, new TestNotebookExecutionStateService());
	instantiationService.stub(IKeybindingService, new MockKeybindingService());
	instantiationService.stub(INotebookCellStatusBarService, disposables.add(new NotebookCellStatusBarService()));
	instantiationService.stub(ICodeEditorService, disposables.add(new TestCodeEditorService(testThemeService)));
	instantiationService.stub(IOutlineService, new class extends mock<IOutlineService>() { override registerOutlineCreator() { return { dispose() { } }; } });
	instantiationService.stub(INotebookCellOutlineDataSourceFactory, instantiationService.createInstance(NotebookCellOutlineDataSourceFactory));
	instantiationService.stub(INotebookOutlineEntryFactory, instantiationService.createInstance(NotebookOutlineEntryFactory));
	instantiationService.stub(INotebookLoggingService, new NullNotebookLoggingService());

	instantiationService.stub(ILanguageDetectionService, new class MockLanguageDetectionService implements ILanguageDetectionService {
		_serviceBrand: undefined;
		isEnabledForLanguage(languageId: string): boolean {
			return false;
		}
		async detectLanguage(resource: URI, supportedLangs?: string[] | undefined): Promise<string | undefined> {
			return undefined;
		}
	});

	return instantiationService;
}

function _createTestNotebookEditor(instantiationService: TestInstantiationService, disposables: DisposableStore, cells: MockNotebookCell[]): { editor: IActiveNotebookEditorDelegate; viewModel: NotebookViewModel } {

	const viewType = 'notebook';
	const notebook = disposables.add(instantiationService.createInstance(NotebookTextModel, viewType, URI.parse('test://test'), cells.map((cell): ICellDto2 => {
		return {
			source: cell[0],
			mime: undefined,
			language: cell[1],
			cellKind: cell[2],
			outputs: cell[3] ?? [],
			metadata: cell[4]
		};
	}), {}, { transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false }));

	const model = disposables.add(new NotebookEditorTestModel(notebook));
	const notebookOptions = disposables.add(new NotebookOptions(mainWindow, false, undefined, instantiationService.get(IConfigurationService), instantiationService.get(INotebookExecutionStateService), instantiationService.get(ICodeEditorService)));
	const baseCellEditorOptions = new class extends mock<IBaseCellEditorOptions>() { };
	const viewContext = new ViewContext(notebookOptions, disposables.add(new NotebookEventDispatcher()), () => baseCellEditorOptions);
	const viewModel: NotebookViewModel = disposables.add(instantiationService.createInstance(NotebookViewModel, viewType, model.notebook, viewContext, null, { isReadOnly: false }));

	const cellList = disposables.add(createNotebookCellList(instantiationService, disposables, viewContext));
	cellList.attachViewModel(viewModel);
	const listViewInfoAccessor = disposables.add(new ListViewInfoAccessor(cellList));

	let visibleRanges: ICellRange[] = [{ start: 0, end: 100 }];

	const id = Date.now().toString();
	const notebookEditor: IActiveNotebookEditorDelegate = new class extends mock<IActiveNotebookEditorDelegate>() {
		// eslint-disable-next-line local/code-must-use-super-dispose
		override dispose() {
			viewModel.dispose();
		}
		override notebookOptions = notebookOptions;
		override onDidChangeModel: Event<NotebookTextModel | undefined> = new Emitter<NotebookTextModel | undefined>().event;
		override onDidChangeCellState: Event<NotebookCellStateChangedEvent> = new Emitter<NotebookCellStateChangedEvent>().event;
		override getViewModel(): NotebookViewModel {
			return viewModel;
		}
		override textModel = viewModel.notebookDocument;
		override hasModel(): this is IActiveNotebookEditorDelegate {
			return !!viewModel;
		}
		override getLength() { return viewModel.length; }
		override getFocus() { return viewModel.getFocus(); }
		override getSelections() { return viewModel.getSelections(); }
		override setFocus(focus: ICellRange) {
			viewModel.updateSelectionsState({
				kind: SelectionStateType.Index,
				focus: focus,
				selections: viewModel.getSelections()
			});
		}
		override setSelections(selections: ICellRange[]) {
			viewModel.updateSelectionsState({
				kind: SelectionStateType.Index,
				focus: viewModel.getFocus(),
				selections: selections
			});
		}
		override getViewIndexByModelIndex(index: number) { return listViewInfoAccessor.getViewIndex(viewModel.viewCells[index]); }
		override getCellRangeFromViewRange(startIndex: number, endIndex: number) { return listViewInfoAccessor.getCellRangeFromViewRange(startIndex, endIndex); }
		override revealCellRangeInView() { }
		override async revealInView() { }
		override setHiddenAreas(_ranges: ICellRange[]): boolean {
			return cellList.setHiddenAreas(_ranges, true);
		}
		override getActiveCell() {
			const elements = cellList.getFocusedElements();

			if (elements && elements.length) {
				return elements[0];
			}

			return undefined;
		}
		override hasOutputTextSelection() {
			return false;
		}
		override changeModelDecorations() { return null; }
		override focusElement() { }
		override setCellEditorSelection() { }
		override async revealRangeInCenterIfOutsideViewportAsync() { }
		override async layoutNotebookCell() { }
		override async createOutput() { }
		override async removeInset() { }
		override async focusNotebookCell(cell: ICellViewModel, focusItem: 'editor' | 'container' | 'output') {
			cell.focusMode = focusItem === 'editor' ? CellFocusMode.Editor
				: focusItem === 'output' ? CellFocusMode.Output
					: CellFocusMode.Container;
		}
		override cellAt(index: number) { return viewModel.cellAt(index)!; }
		override getCellIndex(cell: ICellViewModel) { return viewModel.getCellIndex(cell); }
		override getCellsInRange(range?: ICellRange) { return viewModel.getCellsInRange(range); }
		override getCellByHandle(handle: number) { return viewModel.getCellByHandle(handle); }
		override getNextVisibleCellIndex(index: number) { return viewModel.getNextVisibleCellIndex(index); }
		getControl() { return this; }
		override get onDidChangeSelection() { return viewModel.onDidChangeSelection as Event<any>; }
		override get onDidChangeOptions() { return viewModel.onDidChangeOptions; }
		override get onDidChangeViewCells() { return viewModel.onDidChangeViewCells; }
		override async find(query: string, options: INotebookFindOptions): Promise<CellFindMatchWithIndex[]> {
			const findMatches = viewModel.find(query, options).filter(match => match.length > 0);
			return findMatches;
		}
		override deltaCellDecorations() { return []; }
		override onDidChangeVisibleRanges = Event.None;

		override get visibleRanges() {
			return visibleRanges;
		}

		override set visibleRanges(_ranges: ICellRange[]) {
			visibleRanges = _ranges;
		}

		override getId(): string { return id; }
		override setScrollTop(scrollTop: number): void {
			cellList.scrollTop = scrollTop;
		}
		override get scrollTop(): number {
			return cellList.scrollTop;
		}
		override getLayoutInfo(): NotebookLayoutInfo {
			return {
				width: 0,
				height: 0,
				scrollHeight: cellList.getScrollHeight(),
				fontInfo: new FontInfo({
					pixelRatio: 1,
					fontFamily: 'mockFont',
					fontWeight: 'normal',
					fontSize: 14,
					fontFeatureSettings: EditorFontLigatures.OFF,
					fontVariationSettings: EditorFontVariations.OFF,
					lineHeight: 19,
					letterSpacing: 1.5,
					isMonospace: true,
					typicalHalfwidthCharacterWidth: 10,
					typicalFullwidthCharacterWidth: 20,
					canUseHalfwidthRightwardsArrow: true,
					spaceWidth: 10,
					middotWidth: 10,
					wsmiddotWidth: 10,
					maxDigitWidth: 10,
				}, true),
				stickyHeight: 0,
				listViewOffsetTop: 0,
			};
		}
	};

	return { editor: notebookEditor, viewModel };
}

export function createTestNotebookEditor(instantiationService: TestInstantiationService, disposables: DisposableStore, cells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][]): { editor: INotebookEditorDelegate; viewModel: NotebookViewModel } {
	return _createTestNotebookEditor(instantiationService, disposables, cells);
}

export async function withTestNotebookDiffModel<R = any>(originalCells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][], modifiedCells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][], callback: (diffModel: INotebookDiffEditorModel, disposables: DisposableStore, accessor: TestInstantiationService) => Promise<R> | R): Promise<R> {
	const disposables = new DisposableStore();
	const instantiationService = setupInstantiationService(disposables);
	const originalNotebook = createTestNotebookEditor(instantiationService, disposables, originalCells);
	const modifiedNotebook = createTestNotebookEditor(instantiationService, disposables, modifiedCells);
	const originalResource = new class extends mock<IResolvedNotebookEditorModel>() {
		override get notebook() {
			return originalNotebook.viewModel.notebookDocument;
		}
		override get resource() {
			return originalNotebook.viewModel.notebookDocument.uri;
		}
	};

	const modifiedResource = new class extends mock<IResolvedNotebookEditorModel>() {
		override get notebook() {
			return modifiedNotebook.viewModel.notebookDocument;
		}
		override get resource() {
			return modifiedNotebook.viewModel.notebookDocument.uri;
		}
	};

	const model = new class extends mock<INotebookDiffEditorModel>() {
		override get original() {
			return originalResource;
		}
		override get modified() {
			return modifiedResource;
		}
	};

	const res = await callback(model, disposables, instantiationService);
	if (res instanceof Promise) {
		res.finally(() => {
			originalNotebook.editor.dispose();
			originalNotebook.viewModel.notebookDocument.dispose();
			originalNotebook.viewModel.dispose();
			modifiedNotebook.editor.dispose();
			modifiedNotebook.viewModel.notebookDocument.dispose();
			modifiedNotebook.viewModel.dispose();
			disposables.dispose();
		});
	} else {
		originalNotebook.editor.dispose();
		originalNotebook.viewModel.notebookDocument.dispose();
		originalNotebook.viewModel.dispose();
		modifiedNotebook.editor.dispose();
		modifiedNotebook.viewModel.notebookDocument.dispose();
		modifiedNotebook.viewModel.dispose();
		disposables.dispose();
	}
	return res;
}

interface IActiveTestNotebookEditorDelegate extends IActiveNotebookEditorDelegate {
	visibleRanges: ICellRange[];
}

export type MockNotebookCell = [
	source: string,
	lang: string,
	kind: CellKind,
	output?: IOutputDto[],
	metadata?: NotebookCellMetadata,
];

export type MockDocumentSymbol = {
	name: string;
	range: {};
	kind?: number;
	children?: MockDocumentSymbol[];
};

export async function withTestNotebook<R = any>(cells: MockNotebookCell[], callback: (editor: IActiveTestNotebookEditorDelegate, viewModel: NotebookViewModel, disposables: DisposableStore, accessor: TestInstantiationService) => Promise<R> | R, accessor?: TestInstantiationService): Promise<R> {
	const disposables: DisposableStore = new DisposableStore();
	const instantiationService = accessor ?? setupInstantiationService(disposables);
	const notebookEditor = _createTestNotebookEditor(instantiationService, disposables, cells);

	return runWithFakedTimers({ useFakeTimers: true }, async () => {
		const res = await callback(notebookEditor.editor, notebookEditor.viewModel, disposables, instantiationService);
		if (res instanceof Promise) {
			res.finally(() => {
				notebookEditor.editor.dispose();
				notebookEditor.viewModel.dispose();
				notebookEditor.editor.textModel.dispose();
				disposables.dispose();
			});
		} else {
			notebookEditor.editor.dispose();
			notebookEditor.viewModel.dispose();
			notebookEditor.editor.textModel.dispose();
			disposables.dispose();
		}
		return res;
	});
}

export function createNotebookCellList(instantiationService: TestInstantiationService, disposables: Pick<DisposableStore, 'add'>, viewContext?: ViewContext) {
	const delegate: IListVirtualDelegate<CellViewModel> = {
		getHeight(element: CellViewModel) { return element.getHeight(17); },
		getTemplateId() { return 'template'; }
	};

	const baseCellRenderTemplate = new class extends mock<BaseCellRenderTemplate>() { };
	const renderer: IListRenderer<CellViewModel, BaseCellRenderTemplate> = {
		templateId: 'template',
		renderTemplate() { return baseCellRenderTemplate; },
		renderElement() { },
		disposeTemplate() { }
	};

	const notebookOptions = !!viewContext ? viewContext.notebookOptions
		: disposables.add(new NotebookOptions(mainWindow, false, undefined, instantiationService.get(IConfigurationService), instantiationService.get(INotebookExecutionStateService), instantiationService.get(ICodeEditorService)));
	const cellList: NotebookCellList = disposables.add(instantiationService.createInstance(
		NotebookCellList,
		'NotebookCellList',
		DOM.$('container'),
		notebookOptions,
		delegate,
		[renderer],
		instantiationService.get<IContextKeyService>(IContextKeyService),
		{
			supportDynamicHeights: true,
			multipleSelectionSupport: true,
		}
	));

	return cellList;
}

export function valueBytesFromString(value: string): VSBuffer {
	return VSBuffer.fromString(value);
}

class TestCellExecution implements INotebookCellExecution {
	constructor(
		readonly notebook: URI,
		readonly cellHandle: number,
		private onComplete: () => void,
	) { }

	readonly state: NotebookCellExecutionState = NotebookCellExecutionState.Unconfirmed;

	readonly didPause: boolean = false;
	readonly isPaused: boolean = false;

	confirm(): void {
	}

	update(updates: ICellExecuteUpdate[]): void {
	}

	complete(complete: ICellExecutionComplete): void {
		this.onComplete();
	}
}

export class TestNotebookExecutionStateService implements INotebookExecutionStateService {
	_serviceBrand: undefined;

	private _executions = new ResourceMap<INotebookCellExecution>();

	onDidChangeExecution = new Emitter<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>().event;
	onDidChangeLastRunFailState = new Emitter<INotebookFailStateChangedEvent>().event;

	forceCancelNotebookExecutions(notebookUri: URI): void {
	}

	getCellExecutionsForNotebook(notebook: URI): INotebookCellExecution[] {
		return [];
	}

	getCellExecution(cellUri: URI): INotebookCellExecution | undefined {
		return this._executions.get(cellUri);
	}

	createCellExecution(notebook: URI, cellHandle: number): INotebookCellExecution {
		const onComplete = () => this._executions.delete(CellUri.generate(notebook, cellHandle));
		const exe = new TestCellExecution(notebook, cellHandle, onComplete);
		this._executions.set(CellUri.generate(notebook, cellHandle), exe);
		return exe;
	}

	getCellExecutionsByHandleForNotebook(notebook: URI): Map<number, INotebookCellExecution> | undefined {
		return;
	}

	getLastFailedCellForNotebook(notebook: URI): number | undefined {
		return;
	}
	getLastCompletedCellForNotebook(notebook: URI): number | undefined {
		return;
	}
	getExecution(notebook: URI): INotebookExecution | undefined {
		return;
	}
	createExecution(notebook: URI): INotebookExecution {
		throw new Error('Method not implemented.');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/contributedStatusBarItemController.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/contributedStatusBarItemController.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ContributedStatusBarItemController } from '../../../browser/contrib/cellStatusBar/contributedStatusBarItemController.js';
import { INotebookCellStatusBarService } from '../../../common/notebookCellStatusBarService.js';
import { CellKind, INotebookCellStatusBarItemProvider } from '../../../common/notebookCommon.js';
import { withTestNotebook } from '../testNotebookEditor.js';

suite('Notebook Statusbar', () => {
	const testDisposables = new DisposableStore();

	teardown(() => {
		testDisposables.clear();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	test('Calls item provider', async function () {
		await withTestNotebook(
			[
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header a', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				const cellStatusbarSvc = accessor.get(INotebookCellStatusBarService);
				testDisposables.add(accessor.createInstance(ContributedStatusBarItemController, editor));

				const provider = testDisposables.add(new class extends Disposable implements INotebookCellStatusBarItemProvider {
					private provideCalls = 0;

					private _onProvideCalled = this._register(new Emitter<number>());
					public onProvideCalled = this._onProvideCalled.event;

					public _onDidChangeStatusBarItems = this._register(new Emitter<void>());
					public onDidChangeStatusBarItems = this._onDidChangeStatusBarItems.event;

					async provideCellStatusBarItems(_uri: URI, index: number, _token: CancellationToken) {
						if (index === 0) {
							this.provideCalls++;
							this._onProvideCalled.fire(this.provideCalls);
						}

						return { items: [] };
					}

					viewType = editor.textModel.viewType;
				});
				const providePromise1 = asPromise(provider.onProvideCalled, 'registering provider');
				testDisposables.add(cellStatusbarSvc.registerCellStatusBarItemProvider(provider));
				assert.strictEqual(await providePromise1, 1, 'should call provider on registration');

				const providePromise2 = asPromise(provider.onProvideCalled, 'updating metadata');
				const cell0 = editor.textModel.cells[0];
				cell0.metadata = { ...cell0.metadata, ...{ newMetadata: true } };
				assert.strictEqual(await providePromise2, 2, 'should call provider on updating metadata');

				const providePromise3 = asPromise(provider.onProvideCalled, 'changing cell language');
				cell0.language = 'newlanguage';
				assert.strictEqual(await providePromise3, 3, 'should call provider on changing language');

				const providePromise4 = asPromise(provider.onProvideCalled, 'manually firing change event');
				provider._onDidChangeStatusBarItems.fire();
				assert.strictEqual(await providePromise4, 4, 'should call provider on manually firing change event');
			});
	});
});

async function asPromise<T>(event: Event<T>, message: string): Promise<T> {
	const error = new Error('asPromise TIMEOUT reached: ' + message);
	return new Promise<T>((resolve, reject) => {
		const handle = setTimeout(() => {
			sub.dispose();
			reject(error);
		}, 1000);

		const sub = event(e => {
			clearTimeout(handle);
			sub.dispose();
			resolve(e);
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/executionStatusBarItem.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/executionStatusBarItem.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { formatCellDuration } from '../../../browser/contrib/cellStatusBar/executionStatusBarItemController.js';

suite('notebookBrowser', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('formatCellDuration', function () {
		assert.strictEqual(formatCellDuration(0, false), '0.0s');
		assert.strictEqual(formatCellDuration(0), '0ms');
		assert.strictEqual(formatCellDuration(10, false), '0.0s');
		assert.strictEqual(formatCellDuration(10), '10ms');
		assert.strictEqual(formatCellDuration(100, false), '0.1s');
		assert.strictEqual(formatCellDuration(100), '100ms');
		assert.strictEqual(formatCellDuration(200, false), '0.2s');
		assert.strictEqual(formatCellDuration(200), '200ms');
		assert.strictEqual(formatCellDuration(3300), '3.3s');
		assert.strictEqual(formatCellDuration(180000), '3m 0.0s');
		assert.strictEqual(formatCellDuration(189412), '3m 9.4s');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/find.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/find.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Range } from '../../../../../../editor/common/core/range.js';
import { FindMatch, ITextBuffer, ValidAnnotatedEditOperation } from '../../../../../../editor/common/model.js';
import { USUAL_WORD_SEPARATORS } from '../../../../../../editor/common/core/wordHelper.js';
import { ILanguageService } from '../../../../../../editor/common/languages/language.js';
import { FindReplaceState } from '../../../../../../editor/contrib/find/browser/findState.js';
import { IConfigurationService, IConfigurationValue } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { NotebookFindFilters } from '../../../browser/contrib/find/findFilters.js';
import { CellFindMatchModel, FindModel } from '../../../browser/contrib/find/findModel.js';
import { IActiveNotebookEditor, ICellModelDecorations, ICellModelDeltaDecorations } from '../../../browser/notebookBrowser.js';
import { NotebookViewModel } from '../../../browser/viewModel/notebookViewModelImpl.js';
import { CellEditType, CellKind } from '../../../common/notebookCommon.js';
import { TestCell, withTestNotebook } from '../testNotebookEditor.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';

suite('Notebook Find', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	const configurationValue: IConfigurationValue<any> = {
		value: USUAL_WORD_SEPARATORS
	};
	const configurationService = new class extends TestConfigurationService {
		override inspect() {
			return configurationValue;
		}
	}();

	const setupEditorForTest = (editor: IActiveNotebookEditor, viewModel: NotebookViewModel) => {
		editor.changeModelDecorations = (callback) => {
			return callback({
				deltaDecorations: (oldDecorations: ICellModelDecorations[], newDecorations: ICellModelDeltaDecorations[]) => {
					const ret: ICellModelDecorations[] = [];
					newDecorations.forEach(dec => {
						const cell = viewModel.viewCells.find(cell => cell.handle === dec.ownerId);
						const decorations = cell?.deltaModelDecorations([], dec.decorations) ?? [];

						if (decorations.length > 0) {
							ret.push({ ownerId: dec.ownerId, decorations: decorations });
						}
					});

					return ret;
				}
			});
		};
	};

	test('Update find matches basics', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(IConfigurationService, configurationService);
				const state = disposables.add(new FindReplaceState<NotebookFindFilters>());
				const model = disposables.add(new FindModel(editor, state, accessor.get(IConfigurationService)));

				const found = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ isRevealed: true }, true);
				state.change({ searchString: '1' }, true);
				await found;
				assert.strictEqual(model.findMatches.length, 2);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);

				assert.strictEqual(editor.textModel.length, 3);

				const found2 = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 3, count: 0, cells: [
						disposables.add(new TestCell(viewModel.viewType, 3, '# next paragraph 1', 'markdown', CellKind.Code, [], accessor.get(ILanguageService))),
					]
				}], true, undefined, () => undefined, undefined, true);
				await found2;
				assert.strictEqual(editor.textModel.length, 4);
				assert.strictEqual(model.findMatches.length, 3);
				assert.strictEqual(model.currentMatch, 1);
			});
	});

	test('Update find matches basics 2', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.3', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				setupEditorForTest(editor, viewModel);
				accessor.stub(IConfigurationService, configurationService);
				const state = disposables.add(new FindReplaceState<NotebookFindFilters>());
				const model = disposables.add(new FindModel(editor, state, accessor.get(IConfigurationService)));
				const found = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ isRevealed: true }, true);
				state.change({ searchString: '1' }, true);
				await found;
				// find matches is not necessarily find results
				assert.strictEqual(model.findMatches.length, 4);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 2);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 3);

				const found2 = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 2, count: 1, cells: []
				}], true, undefined, () => undefined, undefined, true);
				await found2;
				assert.strictEqual(model.findMatches.length, 3);

				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: true });
				assert.strictEqual(model.currentMatch, 3);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 2);
			});
	});

	test('Update find matches basics 3', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.3', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				setupEditorForTest(editor, viewModel);
				accessor.stub(IConfigurationService, configurationService);
				const state = disposables.add(new FindReplaceState<NotebookFindFilters>());
				const model = disposables.add(new FindModel(editor, state, accessor.get(IConfigurationService)));
				const found = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ isRevealed: true }, true);
				state.change({ searchString: '1' }, true);
				await found;
				// find matches is not necessarily find results
				assert.strictEqual(model.findMatches.length, 4);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: true });
				assert.strictEqual(model.currentMatch, 4);

				const found2 = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 2, count: 1, cells: []
				}], true, undefined, () => undefined, undefined, true);
				await found2;
				assert.strictEqual(model.findMatches.length, 3);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: true });
				assert.strictEqual(model.currentMatch, 3);
				model.find({ previous: true });
				assert.strictEqual(model.currentMatch, 2);
			});
	});

	test('Update find matches, #112748', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1.3', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				setupEditorForTest(editor, viewModel);
				accessor.stub(IConfigurationService, configurationService);
				const state = disposables.add(new FindReplaceState<NotebookFindFilters>());
				const model = disposables.add(new FindModel(editor, state, accessor.get(IConfigurationService)));
				const found = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ isRevealed: true }, true);
				state.change({ searchString: '1' }, true);
				await found;
				// find matches is not necessarily find results
				assert.strictEqual(model.findMatches.length, 4);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				model.find({ previous: false });
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 3);
				const found2 = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				(viewModel.viewCells[1].textBuffer as ITextBuffer).applyEdits([
					new ValidAnnotatedEditOperation(null, new Range(1, 1, 1, 14), '', false, false, false)
				], false, true);
				// cell content updates, recompute
				model.research();
				await found2;
				assert.strictEqual(model.currentMatch, 1);
			});
	});

	test('Reset when match not found, #127198', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(IConfigurationService, configurationService);
				const state = disposables.add(new FindReplaceState<NotebookFindFilters>());
				const model = disposables.add(new FindModel(editor, state, accessor.get(IConfigurationService)));
				const found = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ isRevealed: true }, true);
				state.change({ searchString: '1' }, true);
				await found;
				assert.strictEqual(model.findMatches.length, 2);
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 0);
				model.find({ previous: false });
				assert.strictEqual(model.currentMatch, 1);

				assert.strictEqual(editor.textModel.length, 3);

				const found2 = new Promise<boolean>(resolve => disposables.add(state.onFindReplaceStateChange(e => {
					if (e.matchesCount) { resolve(true); }
				})));
				state.change({ searchString: '3' }, true);
				await found2;
				assert.strictEqual(model.currentMatch, -1);
				assert.strictEqual(model.findMatches.length, 0);
			});
	});

	test('CellFindMatchModel', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['print(1)', 'typescript', CellKind.Code, [], {}],
			],
			async (editor) => {
				const mdCell = editor.cellAt(0);
				const mdModel = new CellFindMatchModel(mdCell, 0, [], []);
				assert.strictEqual(mdModel.length, 0);

				mdModel.contentMatches.push(new FindMatch(new Range(1, 1, 1, 2), []));
				assert.strictEqual(mdModel.length, 1);
				mdModel.webviewMatches.push({
					index: 0,
					searchPreviewInfo: {
						line: '',
						range: {
							start: 0,
							end: 0,
						}
					}
				}, {
					index: 1,
					searchPreviewInfo: {
						line: '',
						range: {
							start: 0,
							end: 0,
						}
					}
				});

				assert.strictEqual(mdModel.length, 3);
				assert.strictEqual(mdModel.getMatch(0), mdModel.contentMatches[0]);
				assert.strictEqual(mdModel.getMatch(1), mdModel.webviewMatches[0]);
				assert.strictEqual(mdModel.getMatch(2), mdModel.webviewMatches[1]);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/layoutActions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/layoutActions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ToggleCellToolbarPositionAction } from '../../../browser/contrib/layout/layoutActions.js';

suite('Notebook Layout Actions', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	test('Toggle Cell Toolbar Position', async function () {
		const action = new ToggleCellToolbarPositionAction();

		// "notebook.cellToolbarLocation": "right"
		assert.deepStrictEqual(action.togglePosition('test-nb', 'right'), {
			default: 'right',
			'test-nb': 'left'
		});

		// "notebook.cellToolbarLocation": "left"
		assert.deepStrictEqual(action.togglePosition('test-nb', 'left'), {
			default: 'left',
			'test-nb': 'right'
		});

		// "notebook.cellToolbarLocation": "hidden"
		assert.deepStrictEqual(action.togglePosition('test-nb', 'hidden'), {
			default: 'hidden',
			'test-nb': 'right'
		});

		// invalid
		assert.deepStrictEqual(action.togglePosition('test-nb', ''), {
			default: 'right',
			'test-nb': 'left'
		});

		// no user config, default value
		assert.deepStrictEqual(action.togglePosition('test-nb', {
			default: 'right'
		}), {
			default: 'right',
			'test-nb': 'left'
		});

		// user config, default to left
		assert.deepStrictEqual(action.togglePosition('test-nb', {
			default: 'left'
		}), {
			default: 'left',
			'test-nb': 'right'
		});

		// user config, default to hidden
		assert.deepStrictEqual(action.togglePosition('test-nb', {
			default: 'hidden'
		}), {
			default: 'hidden',
			'test-nb': 'right'
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookCellDiagnostics.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookCellDiagnostics.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Emitter, Event } from '../../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../../base/common/map.js';
import { URI } from '../../../../../../base/common/uri.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { IConfigurationService } from '../../../../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IMarkerData, IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { IChatAgent, IChatAgentData, IChatAgentService } from '../../../../chat/common/chatAgents.js';
import { CellDiagnostics } from '../../../browser/contrib/cellDiagnostics/cellDiagnosticEditorContrib.js';
import { CodeCellViewModel } from '../../../browser/viewModel/codeCellViewModel.js';
import { CellKind, NotebookSetting } from '../../../common/notebookCommon.js';
import { ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookCellExecution, INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';
import { setupInstantiationService, TestNotebookExecutionStateService, withTestNotebook } from '../testNotebookEditor.js';
import { nullExtensionDescription } from '../../../../../services/extensions/common/extensions.js';
import { ChatAgentLocation, ChatModeKind } from '../../../../chat/common/constants.js';


suite('notebookCellDiagnostics', () => {

	let instantiationService: TestInstantiationService;
	let disposables: DisposableStore;
	let testExecutionService: TestExecutionService;
	let markerService: ITestMarkerService;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	class TestExecutionService extends TestNotebookExecutionStateService {
		private _onDidChangeExecution = new Emitter<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent>();
		override onDidChangeExecution = this._onDidChangeExecution.event;

		fireExecutionChanged(notebook: URI, cellHandle: number, changed?: INotebookCellExecution) {
			this._onDidChangeExecution.fire({
				type: NotebookExecutionType.cell,
				cellHandle,
				notebook,
				affectsNotebook: () => true,
				affectsCell: () => true,
				changed: changed
			});
		}
	}

	interface ITestMarkerService extends IMarkerService {
		markers: ResourceMap<IMarkerData[]>;
		readonly onMarkersUpdated: Event<void>;
	}

	setup(function () {

		disposables = new DisposableStore();

		instantiationService = setupInstantiationService(disposables);
		testExecutionService = new TestExecutionService();
		instantiationService.stub(INotebookExecutionStateService, testExecutionService);

		const agentData = {
			extensionId: nullExtensionDescription.identifier,
			extensionVersion: undefined,
			extensionDisplayName: '',
			extensionPublisherId: '',
			name: 'testEditorAgent',
			isDefault: true,
			locations: [ChatAgentLocation.Notebook],
			modes: [ChatModeKind.Ask],
			metadata: {},
			slashCommands: [],
			disambiguation: [],
		};
		const chatAgentService = new class extends mock<IChatAgentService>() {
			override getAgents(): IChatAgentData[] {
				return [{
					id: 'testEditorAgent',
					...agentData
				}];
			}
			override onDidChangeAgents: Event<IChatAgent | undefined> = Event.None;
		};
		instantiationService.stub(IChatAgentService, chatAgentService);

		markerService = new class extends mock<ITestMarkerService>() {
			private _onMarkersUpdated = new Emitter<void>();
			override onMarkersUpdated = this._onMarkersUpdated.event;
			override markers: ResourceMap<IMarkerData[]> = new ResourceMap();
			override changeOne(owner: string, resource: URI, markers: IMarkerData[]) {
				this.markers.set(resource, markers);
				this._onMarkersUpdated.fire();
			}
		};
		instantiationService.stub(IMarkerService, markerService);

		const config = instantiationService.get<IConfigurationService>(IConfigurationService) as TestConfigurationService;
		config.setUserConfiguration(NotebookSetting.cellFailureDiagnostics, true);
	});

	test('diagnostic is added for cell execution failure', async function () {
		await withTestNotebook([
			['print(x)', 'python', CellKind.Code, [], {}]
		], async (editor, viewModel, store, accessor) => {
			const cell = viewModel.viewCells[0] as CodeCellViewModel;

			disposables.add(instantiationService.createInstance(CellDiagnostics, editor));

			cell.model.internalMetadata.lastRunSuccess = false;
			cell.model.internalMetadata.error = {
				name: 'error',
				message: 'something bad happened',
				stack: 'line 1 : print(x)',
				uri: cell.uri,
				location: { startColumn: 1, endColumn: 5, startLineNumber: 1, endLineNumber: 1 }
			};
			testExecutionService.fireExecutionChanged(editor.textModel.uri, cell.handle);
			await new Promise<void>(resolve => Event.once(markerService.onMarkersUpdated)(resolve));

			assert.strictEqual(cell?.executionErrorDiagnostic.get()?.message, 'something bad happened');
			assert.equal(markerService.markers.get(cell.uri)?.length, 1);
		}, instantiationService);
	});

	test('diagnostics are cleared only for cell with new execution', async function () {
		await withTestNotebook([
			['print(x)', 'python', CellKind.Code, [], {}],
			['print(y)', 'python', CellKind.Code, [], {}]
		], async (editor, viewModel, store, accessor) => {
			const cell = viewModel.viewCells[0] as CodeCellViewModel;
			const cell2 = viewModel.viewCells[1] as CodeCellViewModel;

			disposables.add(instantiationService.createInstance(CellDiagnostics, editor));

			cell.model.internalMetadata.lastRunSuccess = false;
			cell.model.internalMetadata.error = {
				name: 'error',
				message: 'something bad happened',
				stack: 'line 1 : print(x)',
				uri: cell.uri,
				location: { startColumn: 1, endColumn: 5, startLineNumber: 1, endLineNumber: 1 }
			};
			cell2.model.internalMetadata.lastRunSuccess = false;
			cell2.model.internalMetadata.error = {
				name: 'error',
				message: 'another bad thing happened',
				stack: 'line 1 : print(y)',
				uri: cell.uri,
				location: { startColumn: 1, endColumn: 5, startLineNumber: 1, endLineNumber: 1 }
			};
			testExecutionService.fireExecutionChanged(editor.textModel.uri, cell.handle);
			testExecutionService.fireExecutionChanged(editor.textModel.uri, cell2.handle);

			await new Promise<void>(resolve => Event.once(markerService.onMarkersUpdated)(resolve));

			const clearMarkers = new Promise<void>(resolve => Event.once(markerService.onMarkersUpdated)(resolve));
			// on NotebookCellExecution value will make it look like its currently running
			testExecutionService.fireExecutionChanged(editor.textModel.uri, cell.handle, {} as INotebookCellExecution);

			await clearMarkers;

			assert.strictEqual(cell?.executionErrorDiagnostic.get(), undefined);
			assert.strictEqual(cell2?.executionErrorDiagnostic.get()?.message, 'another bad thing happened', 'cell that was not executed should still have an error');
			assert.equal(markerService.markers.get(cell.uri)?.length, 0);
			assert.equal(markerService.markers.get(cell2.uri)?.length, 1);
		}, instantiationService);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookClipboard.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookClipboard.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { mock } from '../../../../../../base/test/common/mock.js';
import { NotebookClipboardContribution, runCopyCells, runCutCells } from '../../../browser/contrib/clipboard/notebookClipboard.js';
import { CellKind, NOTEBOOK_EDITOR_ID, SelectionStateType } from '../../../common/notebookCommon.js';
import { withTestNotebook } from '../testNotebookEditor.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IActiveNotebookEditor, INotebookEditor } from '../../../browser/notebookBrowser.js';
import { IVisibleEditorPane } from '../../../../../common/editor.js';
import { INotebookService } from '../../../common/notebookService.js';
import { FoldingModel, updateFoldingStateAtIndex } from '../../../browser/viewModel/foldingModel.js';
import { NotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';

suite('Notebook Clipboard', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	const createEditorService = (editor: IActiveNotebookEditor) => {
		const visibleEditorPane = new class extends mock<IVisibleEditorPane>() {
			override getId(): string {
				return NOTEBOOK_EDITOR_ID;
			}
			override getControl(): INotebookEditor {
				return editor;
			}
		};

		const editorService: IEditorService = new class extends mock<IEditorService>() {
			override get activeEditorPane(): IVisibleEditorPane | undefined {
				return visibleEditorPane;
			}
		};

		return editorService;
	};

	test.skip('Cut multiple selected cells', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() { override setToCopy() { } });

				const clipboardContrib = new NotebookClipboardContribution(createEditorService(editor));

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 2 }, selections: [{ start: 0, end: 2 }] }, 'model');
				assert.ok(clipboardContrib.runCutAction(accessor));
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.strictEqual(viewModel.length, 1);
				assert.strictEqual(viewModel.cellAt(0)?.getText(), 'paragraph 2');
			});
	});

	test.skip('Cut should take folding info into account', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3', 'javascript', CellKind.Markup, [], {}],
				['# header d', 'markdown', CellKind.Markup, [], {}],
				['var e = 4;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				const foldingModel = new FoldingModel();
				foldingModel.attachViewModel(viewModel);

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				editor.setHiddenAreas(viewModel.getHiddenRanges());
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }, 'model');

				accessor.stub(INotebookService, new class extends mock<INotebookService>() { override setToCopy() { } });

				const clipboardContrib = new NotebookClipboardContribution(createEditorService(editor));
				clipboardContrib.runCutAction(accessor);
				assert.strictEqual(viewModel.length, 5);
				await viewModel.undo();
				assert.strictEqual(viewModel.length, 7);
			});
	});

	test.skip('Copy should take folding info into account', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3', 'javascript', CellKind.Markup, [], {}],
				['# header d', 'markdown', CellKind.Markup, [], {}],
				['var e = 4;', 'javascript', CellKind.Code, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				const foldingModel = new FoldingModel();
				foldingModel.attachViewModel(viewModel);

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				editor.setHiddenAreas(viewModel.getHiddenRanges());
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }, 'model');

				let _cells: NotebookCellTextModel[] = [];
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy(cells: NotebookCellTextModel[]) { _cells = cells; }
					override getToCopy() { return { items: _cells, isCopy: true }; }
				});

				const clipboardContrib = new NotebookClipboardContribution(createEditorService(editor));
				clipboardContrib.runCopyAction(accessor);
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 6, end: 7 }, selections: [{ start: 6, end: 7 }] }, 'model');
				clipboardContrib.runPasteAction(accessor);

				assert.strictEqual(viewModel.length, 9);
				assert.strictEqual(viewModel.cellAt(8)?.getText(), 'var b = 1;');
			});
	});

	test.skip('#119773, cut last item should not focus on the top first cell', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() { override setToCopy() { } });
				const clipboardContrib = new NotebookClipboardContribution(createEditorService(editor));

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 2, end: 3 }, selections: [{ start: 2, end: 3 }] }, 'model');
				assert.ok(clipboardContrib.runCutAction(accessor));
				// it should be the last cell, other than the first one.
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });
			});
	});

	test.skip('#119771, undo paste should restore selections', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy() { }
					override getToCopy() {
						return {
							items: [
								viewModel.cellAt(0)!.model
							],
							isCopy: true
						};
					}
				});

				const clipboardContrib = new NotebookClipboardContribution(createEditorService(editor));

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 2, end: 3 }, selections: [{ start: 2, end: 3 }] }, 'model');
				assert.ok(clipboardContrib.runPasteAction(accessor));

				assert.strictEqual(viewModel.length, 4);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 3, end: 4 });
				assert.strictEqual(viewModel.cellAt(3)?.getText(), '# header 1');
				await viewModel.undo();
				assert.strictEqual(viewModel.length, 3);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
			});
	});

	test('copy cell from ui still works if the target cell is not part of a selection', async () => {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				let _toCopy: NotebookCellTextModel[] = [];
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy(toCopy: NotebookCellTextModel[]) { _toCopy = toCopy; }
					override getToCopy() {
						return {
							items: _toCopy,
							isCopy: true
						};
					}
				});

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 2 }] }, 'model');
				assert.ok(runCopyCells(accessor, editor, viewModel.cellAt(0)));
				assert.deepStrictEqual(_toCopy, [viewModel.cellAt(0)!.model, viewModel.cellAt(1)!.model]);

				assert.ok(runCopyCells(accessor, editor, viewModel.cellAt(2)));
				assert.deepStrictEqual(_toCopy.length, 1);
				assert.deepStrictEqual(_toCopy, [viewModel.cellAt(2)!.model]);
			});
	});

	test('cut cell from ui still works if the target cell is not part of a selection', async () => {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 3', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy() { }
					override getToCopy() {
						return { items: [], isCopy: true };
					}
				});

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 2 }] }, 'model');
				assert.ok(runCutCells(accessor, editor, viewModel.cellAt(0)));
				assert.strictEqual(viewModel.length, 2);
				await viewModel.undo();
				assert.strictEqual(viewModel.length, 4);

				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 2 }]);
				assert.ok(runCutCells(accessor, editor, viewModel.cellAt(2)));
				assert.strictEqual(viewModel.length, 3);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.strictEqual(viewModel.cellAt(0)?.getText(), '# header 1');
				assert.strictEqual(viewModel.cellAt(1)?.getText(), 'paragraph 1');
				assert.strictEqual(viewModel.cellAt(2)?.getText(), 'paragraph 3');

				await viewModel.undo();
				assert.strictEqual(viewModel.length, 4);
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 2, end: 3 }, selections: [{ start: 2, end: 4 }] }, 'model');
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
				assert.ok(runCutCells(accessor, editor, viewModel.cellAt(0)));
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 3 }]);
			});
	});

	test('cut focus cell still works if the focus is not part of any selection', async () => {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 3', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy() { }
					override getToCopy() {
						return { items: [], isCopy: true };
					}
				});

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 2, end: 4 }] }, 'model');
				assert.ok(runCutCells(accessor, editor, undefined));
				assert.strictEqual(viewModel.length, 3);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 3 }]);
			});
	});

	test('cut focus cell still works if the focus is not part of any selection 2', async () => {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 1', 'markdown', CellKind.Markup, [], {}],
				['paragraph 2', 'markdown', CellKind.Markup, [], {}],
				['paragraph 3', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				accessor.stub(INotebookService, new class extends mock<INotebookService>() {
					override setToCopy() { }
					override getToCopy() {
						return { items: [], isCopy: true };
					}
				});

				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 3, end: 4 }, selections: [{ start: 0, end: 2 }] }, 'model');
				assert.ok(runCutCells(accessor, editor, undefined));
				assert.strictEqual(viewModel.length, 3);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 2 }]);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookOutline.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookOutline.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { setupInstantiationService, withTestNotebook } from '../testNotebookEditor.js';
import { OutlineTarget } from '../../../../../services/outline/browser/outline.js';
import { IFileIconTheme, IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { Event } from '../../../../../../base/common/event.js';
import { IEditorService } from '../../../../../services/editor/common/editorService.js';
import { IMarkerService } from '../../../../../../platform/markers/common/markers.js';
import { MarkerService } from '../../../../../../platform/markers/common/markerService.js';
import { CellKind, IOutputDto, NotebookCellMetadata } from '../../../common/notebookCommon.js';
import { IActiveNotebookEditor, INotebookEditorPane } from '../../../browser/notebookBrowser.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { TestInstantiationService } from '../../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NotebookCellOutline, NotebookOutlineCreator } from '../../../browser/contrib/outline/notebookOutline.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ILanguageFeaturesService } from '../../../../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../../../editor/common/services/languageFeaturesService.js';
import { IEditorPaneSelectionChangeEvent } from '../../../../../common/editor.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { INotebookOutlineEntryFactory, NotebookOutlineEntryFactory } from '../../../browser/viewModel/notebookOutlineEntryFactory.js';

suite('Notebook Outline', function () {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let symbolsCached: boolean;

	teardown(() => disposables.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		symbolsCached = false;
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		instantiationService.set(IEditorService, new class extends mock<IEditorService>() { });
		instantiationService.set(ILanguageFeaturesService, new LanguageFeaturesService());
		instantiationService.set(IMarkerService, disposables.add(new MarkerService()));
		instantiationService.set(IThemeService, new class extends mock<IThemeService>() {
			override onDidFileIconThemeChange = Event.None;
			override getFileIconTheme(): IFileIconTheme {
				return { hasFileIcons: true, hasFolderIcons: true, hidesExplorerArrows: false };
			}
		});
	});


	async function withNotebookOutline<R = any>(
		cells: [source: string, lang: string, kind: CellKind, output?: IOutputDto[], metadata?: NotebookCellMetadata][],
		target: OutlineTarget,
		callback: (outline: NotebookCellOutline, editor: IActiveNotebookEditor) => R,
	): Promise<R> {

		return withTestNotebook(cells, async (editor) => {
			if (!editor.hasModel()) {
				assert.ok(false, 'MUST have active text editor');
			}
			const notebookEditorPane = new class extends mock<INotebookEditorPane>() {
				override getControl() {
					return editor;
				}
				override onDidChangeModel: Event<void> = Event.None;
				override onDidChangeSelection: Event<IEditorPaneSelectionChangeEvent> = Event.None;
			};


			const testOutlineEntryFactory = instantiationService.createInstance(NotebookOutlineEntryFactory) as NotebookOutlineEntryFactory;
			testOutlineEntryFactory.cacheSymbols = async () => { symbolsCached = true; };
			instantiationService.stub(INotebookOutlineEntryFactory, testOutlineEntryFactory);

			const outline = await instantiationService.createInstance(NotebookOutlineCreator).createOutline(notebookEditorPane, target, CancellationToken.None);

			disposables.add(outline!);
			return callback(outline as NotebookCellOutline, editor);
		});

	}

	test('basic', async function () {
		await withNotebookOutline([], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements(), []);
		});
	});

	test('special characters in heading', async function () {
		await withNotebookOutline([
			['# Hellö & Hällo', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'Hellö & Hällo');
		});

		await withNotebookOutline([
			['# bo<i>ld</i>', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'bold');
		});
	});

	test('Notebook falsely detects "empty cells"', async function () {
		await withNotebookOutline([
			['  的时代   ', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, (outline, notebookEditor) => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.entries[0].label, '的时代',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in outline label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, '的时代',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in quickpick entry label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
		});

		await withNotebookOutline([
			['   ', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, (outline, notebookEditor) => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.entries[0].label, 'empty cell',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up as an empty cell in outline label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'empty cell',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up as an empty cell in quickpick entry label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
		});

		await withNotebookOutline([
			['+++++[]{}--)(0  ', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, (outline, notebookEditor) => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.entries[0].label, '+++++[]{}--)(0',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in outline label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, '+++++[]{}--)(0',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in quickpick entry label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
		});

		await withNotebookOutline([
			['+++++[]{}--)(0 Hello **&^ ', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, (outline, notebookEditor) => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.entries[0].label, '+++++[]{}--)(0 Hello **&^',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in outline label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, '+++++[]{}--)(0 Hello **&^',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in quickpick entry label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
		});

		await withNotebookOutline([
			['!@#$\n Überschrïft', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, (outline, notebookEditor) => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.entries[0].label, '!@#$',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in outline label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, '!@#$',
				`cell content: ${notebookEditor.cellAt(0).model.getValue()} did not show up correctly in quickpick entry label. \n Cell text buffer line 1: ${outline.entries[0].cell.textBuffer.getLineContent(1)}`
			);
		});
	});

	test('Heading text defines entry label', async function () {
		return await withNotebookOutline([
			['foo\n # h1', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 1);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'h1');
		});
	});

	test('Notebook outline ignores markdown headings #115200', async function () {
		await withNotebookOutline([
			['## h2 \n# h1', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 2);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'h2');
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[1].label, 'h1');
		});

		await withNotebookOutline([
			['## h2', 'md', CellKind.Markup],
			['# h1', 'md', CellKind.Markup]
		], OutlineTarget.OutlinePane, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements().length, 2);
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[0].label, 'h2');
			assert.deepStrictEqual(outline.config.quickPickDataSource.getQuickPickElements()[1].label, 'h1');
		});
	});

	test('Symbols for goto quickpick are pre-cached', async function () {
		await withNotebookOutline([
			['a = 1\nb = 2', 'python', CellKind.Code]
		], OutlineTarget.QuickPick, outline => {
			assert.ok(outline instanceof NotebookCellOutline);
			assert.strictEqual(symbolsCached, true);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookOutlineViewProviders.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookOutlineViewProviders.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IDataSource } from '../../../../../../base/browser/ui/tree/tree.js';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { IReference } from '../../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IOutlineModelService, OutlineModel } from '../../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { TestThemeService } from '../../../../../../platform/theme/test/common/testThemeService.js';
import { NotebookBreadcrumbsProvider, NotebookCellOutline, NotebookOutlinePaneProvider, NotebookQuickPickProvider } from '../../../browser/contrib/outline/notebookOutline.js';
import { ICellViewModel } from '../../../browser/notebookBrowser.js';
import { INotebookCellOutlineDataSource } from '../../../browser/viewModel/notebookOutlineDataSource.js';
import { NotebookOutlineEntryFactory } from '../../../browser/viewModel/notebookOutlineEntryFactory.js';
import { OutlineEntry } from '../../../browser/viewModel/OutlineEntry.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { MockDocumentSymbol } from '../testNotebookEditor.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../../base/common/uri.js';

suite('Notebook Outline View Providers', function () {

	// #region Setup

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	const configurationService = new TestConfigurationService();
	const themeService = new TestThemeService();

	const symbolsPerTextModel: Record<string, MockDocumentSymbol[]> = {};
	function setSymbolsForTextModel(symbols: MockDocumentSymbol[], textmodelId = 'textId') {
		symbolsPerTextModel[textmodelId] = symbols;
	}

	const executionService = new class extends mock<INotebookExecutionStateService>() {
		override getCellExecution() { return undefined; }
	};

	class OutlineModelStub {
		constructor(private textId: string) { }

		getTopLevelSymbols() {
			return symbolsPerTextModel[this.textId];
		}
	}
	const outlineModelService = new class extends mock<IOutlineModelService>() {
		override getOrCreate(model: ITextModel, arg1: any) {
			const outline = new OutlineModelStub(model.id) as unknown as OutlineModel;
			return Promise.resolve(outline);
		}
		override getDebounceValue(arg0: any) {
			return 0;
		}
	};
	const textModelService = new class extends mock<ITextModelService>() {
		override createModelReference(uri: URI) {
			return Promise.resolve({
				object: {
					textEditorModel: {
						id: uri.toString(),
						getVersionId() { return 1; }
					}
				},
				dispose() { }
			} as IReference<IResolvedTextEditorModel>);
		}
	};

	// #endregion
	// #region Helpers

	function createCodeCellViewModel(version: number = 1, source = '# code', textmodelId = 'textId') {
		return {
			uri: { toString() { return textmodelId; } },
			id: textmodelId,
			textBuffer: {
				getLineCount() { return 0; }
			},
			getText() {
				return source;
			},
			model: {
				textModel: {
					id: textmodelId,
					getVersionId() { return version; }
				}
			},
			resolveTextModel() {
				return this.model.textModel as unknown;
			},
			cellKind: 2
		} as ICellViewModel;
	}

	function createMockOutlineDataSource(entries: OutlineEntry[], activeElement: OutlineEntry | undefined = undefined) {
		return new class extends mock<IReference<INotebookCellOutlineDataSource>>() {
			override object: INotebookCellOutlineDataSource = {
				entries: entries,
				activeElement: activeElement,
			};
		};
	}

	function createMarkupCellViewModel(version: number = 1, source = 'markup', textmodelId = 'textId', alternativeId = 1) {
		return {
			textBuffer: {
				getLineCount() { return 0; }
			},
			getText() {
				return source;
			},
			getAlternativeId() {
				return alternativeId;
			},
			model: {
				textModel: {
					id: textmodelId,
					getVersionId() { return version; }
				}
			},
			resolveTextModel() {
				return this.model.textModel as unknown;
			},
			cellKind: 1
		} as ICellViewModel;
	}

	function flatten(element: OutlineEntry, dataSource: IDataSource<NotebookCellOutline, OutlineEntry>): OutlineEntry[] {
		const elements: OutlineEntry[] = [];

		const children = dataSource.getChildren(element);
		for (const child of children) {
			elements.push(child);
			elements.push(...flatten(child, dataSource));
		}

		return elements;
	}

	function buildOutlineTree(entries: OutlineEntry[]): OutlineEntry[] | undefined {
		if (entries.length > 0) {
			const result: OutlineEntry[] = [entries[0]];
			const parentStack: OutlineEntry[] = [entries[0]];

			for (let i = 1; i < entries.length; i++) {
				const entry = entries[i];

				while (true) {
					const len = parentStack.length;
					if (len === 0) {
						// root node
						result.push(entry);
						parentStack.push(entry);
						break;

					} else {
						const parentCandidate = parentStack[len - 1];
						if (parentCandidate.level < entry.level) {
							parentCandidate.addChild(entry);
							parentStack.push(entry);
							break;
						} else {
							parentStack.pop();
						}
					}
				}
			}
			return result;
		}
		return undefined;
	}

	/**
	 * Set the configuration settings relevant to various outline views (OutlinePane, QuickPick, Breadcrumbs)
	 *
	 * @param outlineShowMarkdownHeadersOnly: boolean 	(notebook.outline.showMarkdownHeadersOnly)
	 * @param outlineShowCodeCells: boolean 			(notebook.outline.showCodeCells)
	 * @param outlineShowCodeCellSymbols: boolean 		(notebook.outline.showCodeCellSymbols)
	 * @param quickPickShowAllSymbols: boolean 			(notebook.gotoSymbols.showAllSymbols)
	 * @param breadcrumbsShowCodeCells: boolean 		(notebook.breadcrumbs.showCodeCells)
	 */
	async function setOutlineViewConfiguration(config: {
		outlineShowMarkdownHeadersOnly: boolean;
		outlineShowCodeCells: boolean;
		outlineShowCodeCellSymbols: boolean;
		quickPickShowAllSymbols: boolean;
		breadcrumbsShowCodeCells: boolean;
	}) {
		await configurationService.setUserConfiguration('notebook.outline.showMarkdownHeadersOnly', config.outlineShowMarkdownHeadersOnly);
		await configurationService.setUserConfiguration('notebook.outline.showCodeCells', config.outlineShowCodeCells);
		await configurationService.setUserConfiguration('notebook.outline.showCodeCellSymbols', config.outlineShowCodeCellSymbols);
		await configurationService.setUserConfiguration('notebook.gotoSymbols.showAllSymbols', config.quickPickShowAllSymbols);
		await configurationService.setUserConfiguration('notebook.breadcrumbs.showCodeCells', config.breadcrumbsShowCodeCells);
	}

	// #endregion
	// #region OutlinePane

	test('OutlinePane 0: Default Settings (Headers Only ON, Code cells OFF, Symbols ON)', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: true,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: true,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {} }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const outlinePaneProvider = store.add(new NotebookOutlinePaneProvider(undefined, configurationService));
		const results = flatten(outlineModel, outlinePaneProvider);

		// Validate
		assert.equal(results.length, 1);
		assert.equal(results[0].label, 'h1');
		assert.equal(results[0].level, 1);
	});

	test('OutlinePane 1: ALL Markdown', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {} }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const outlinePaneProvider = store.add(new NotebookOutlinePaneProvider(undefined, configurationService));
		const results = flatten(outlineModel, outlinePaneProvider);

		assert.equal(results.length, 2);

		assert.equal(results[0].label, 'h1');
		assert.equal(results[0].level, 1);

		assert.equal(results[1].label, 'plaintext');
		assert.equal(results[1].level, 7);
	});

	test('OutlinePane 2: Only Headers', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: true,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {} }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const outlinePaneProvider = store.add(new NotebookOutlinePaneProvider(undefined, configurationService));
		const results = flatten(outlineModel, outlinePaneProvider);

		assert.equal(results.length, 1);

		assert.equal(results[0].label, 'h1');
		assert.equal(results[0].level, 1);
	});

	test('OutlinePane 3: Only Headers + Code Cells', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: true,
			outlineShowCodeCells: true,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {} }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const outlinePaneProvider = store.add(new NotebookOutlinePaneProvider(undefined, configurationService));
		const results = flatten(outlineModel, outlinePaneProvider);

		assert.equal(results.length, 3);

		assert.equal(results[0].label, 'h1');
		assert.equal(results[0].level, 1);

		assert.equal(results[1].label, '# code cell 2');
		assert.equal(results[1].level, 7);

		assert.equal(results[2].label, '# code cell 3');
		assert.equal(results[2].level, 7);
	});

	test('OutlinePane 4: Only Headers + Code Cells + Symbols', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: true,
			outlineShowCodeCells: true,
			outlineShowCodeCellSymbols: true,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {} }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const outlinePaneProvider = store.add(new NotebookOutlinePaneProvider(undefined, configurationService));
		const results = flatten(outlineModel, outlinePaneProvider);

		// validate
		assert.equal(results.length, 5);

		assert.equal(results[0].label, 'h1');
		assert.equal(results[0].level, 1);

		assert.equal(results[1].label, '# code cell 2');
		assert.equal(results[1].level, 7);

		assert.equal(results[2].label, 'var2');
		assert.equal(results[2].level, 8);

		assert.equal(results[3].label, '# code cell 3');
		assert.equal(results[3].level, 7);

		assert.equal(results[4].label, 'var3');
		assert.equal(results[4].level, 8);
	});

	// #endregion
	// #region QuickPick

	test('QuickPick 0: Symbols On + 2 cells WITH symbols', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: true,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {}, kind: 12 }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {}, kind: 12 }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const quickPickProvider = store.add(new NotebookQuickPickProvider(createMockOutlineDataSource([...outlineModel.children]), configurationService, themeService));
		const results = quickPickProvider.getQuickPickElements();

		// Validate
		assert.equal(results.length, 4);

		assert.equal(results[0].label, '$(markdown) h1');
		assert.equal(results[0].element.level, 1);

		assert.equal(results[1].label, '$(markdown) plaintext');
		assert.equal(results[1].element.level, 7);

		assert.equal(results[2].label, '$(symbol-variable) var2');
		assert.equal(results[2].element.level, 8);

		assert.equal(results[3].label, '$(symbol-variable) var3');
		assert.equal(results[3].element.level, 8);
	});

	test('QuickPick 1: Symbols On + 1 cell WITH symbol + 1 cell WITHOUT symbol', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: true,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {}, kind: 12 }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const quickPickProvider = store.add(new NotebookQuickPickProvider(createMockOutlineDataSource([...outlineModel.children]), configurationService, themeService));
		const results = quickPickProvider.getQuickPickElements();

		// Validate
		assert.equal(results.length, 4);

		assert.equal(results[0].label, '$(markdown) h1');
		assert.equal(results[0].element.level, 1);

		assert.equal(results[1].label, '$(markdown) plaintext');
		assert.equal(results[1].element.level, 7);

		assert.equal(results[2].label, '$(code) # code cell 2');
		assert.equal(results[2].element.level, 7);

		assert.equal(results[3].label, '$(symbol-variable) var3');
		assert.equal(results[3].element.level, 8);
	});

	test('QuickPick 3: Symbols Off', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {}, kind: 12 }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {}, kind: 12 }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createCodeCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}

		// Generate filtered outline (view model)
		const quickPickProvider = store.add(new NotebookQuickPickProvider(createMockOutlineDataSource([...outlineModel.children]), configurationService, themeService));
		const results = quickPickProvider.getQuickPickElements();

		// Validate
		assert.equal(results.length, 4);

		assert.equal(results[0].label, '$(markdown) h1');
		assert.equal(results[0].element.level, 1);

		assert.equal(results[1].label, '$(markdown) plaintext');
		assert.equal(results[1].element.level, 7);

		assert.equal(results[2].label, '$(code) # code cell 2');
		assert.equal(results[2].element.level, 7);

		assert.equal(results[3].label, '$(code) # code cell 3');
		assert.equal(results[3].element.level, 7);
	});

	// #endregion
	// #region Breadcrumbs

	test('Breadcrumbs 0: Code Cells On ', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: true
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {}, kind: 12 }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {}, kind: 12 }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createMarkupCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}
		const outlineTree = buildOutlineTree([...outlineModel.children]);

		// Generate filtered outline (view model)
		const breadcrumbsProvider = store.add(new NotebookBreadcrumbsProvider(createMockOutlineDataSource([], [...outlineTree![0].children][1]), configurationService));
		const results = breadcrumbsProvider.getBreadcrumbElements();

		// Validate
		assert.equal(results.length, 3);

		assert.equal(results[0].element.label, 'fakeRoot');
		assert.equal(results[0].element.level, -1);

		assert.equal(results[1].element.label, 'h1');
		assert.equal(results[1].element.level, 1);

		assert.equal(results[2].element.label, '# code cell 2');
		assert.equal(results[2].element.level, 7);
	});

	test('Breadcrumbs 1: Code Cells Off ', async function () {
		await setOutlineViewConfiguration({
			outlineShowMarkdownHeadersOnly: false,
			outlineShowCodeCells: false,
			outlineShowCodeCellSymbols: false,
			quickPickShowAllSymbols: false,
			breadcrumbsShowCodeCells: false
		});

		// Create models + symbols
		const cells = [
			createMarkupCellViewModel(1, '# h1', '$0', 0),
			createMarkupCellViewModel(1, 'plaintext', '$1', 0),
			createCodeCellViewModel(1, '# code cell 2', '$2'),
			createCodeCellViewModel(1, '# code cell 3', '$3')
		];
		setSymbolsForTextModel([], '$0');
		setSymbolsForTextModel([], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {}, kind: 12 }], '$2');
		setSymbolsForTextModel([{ name: 'var3', range: {}, kind: 12 }], '$3');

		// Cache symbols
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		for (const cell of cells) {
			await entryFactory.cacheSymbols(cell, CancellationToken.None);
		}

		// Generate raw outline
		const outlineModel = new OutlineEntry(-1, -1, createMarkupCellViewModel(), 'fakeRoot', false, false, undefined, undefined);
		for (const cell of cells) {
			entryFactory.getOutlineEntries(cell, 0).forEach(entry => outlineModel.addChild(entry));
		}
		const outlineTree = buildOutlineTree([...outlineModel.children]);

		// Generate filtered outline (view model)
		const breadcrumbsProvider = store.add(new NotebookBreadcrumbsProvider(createMockOutlineDataSource([], [...outlineTree![0].children][1]), configurationService));
		const results = breadcrumbsProvider.getBreadcrumbElements();

		// Validate
		assert.equal(results.length, 2);

		assert.equal(results[0].element.label, 'fakeRoot');
		assert.equal(results[0].element.level, -1);

		assert.equal(results[1].element.label, 'h1');
		assert.equal(results[1].element.level, 1);
	});

	// #endregion
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookSymbols.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookSymbols.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../../base/common/cancellation.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IOutlineModelService, OutlineModel } from '../../../../../../editor/contrib/documentSymbols/browser/outlineModel.js';
import { ICellViewModel } from '../../../browser/notebookBrowser.js';
import { NotebookOutlineEntryFactory } from '../../../browser/viewModel/notebookOutlineEntryFactory.js';
import { INotebookExecutionStateService } from '../../../common/notebookExecutionStateService.js';
import { MockDocumentSymbol } from '../testNotebookEditor.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../../base/common/uri.js';
import { IReference } from '../../../../../../base/common/lifecycle.js';

suite('Notebook Symbols', function () {
	ensureNoDisposablesAreLeakedInTestSuite();

	const symbolsPerTextModel: Record<string, MockDocumentSymbol[]> = {};
	function setSymbolsForTextModel(symbols: MockDocumentSymbol[], textmodelId = 'textId') {
		symbolsPerTextModel[textmodelId] = symbols;
	}

	const executionService = new class extends mock<INotebookExecutionStateService>() {
		override getCellExecution() { return undefined; }
	};

	class OutlineModelStub {
		constructor(private textId: string) { }

		getTopLevelSymbols() {
			return symbolsPerTextModel[this.textId];
		}
	}
	const outlineModelService = new class extends mock<IOutlineModelService>() {
		override getOrCreate(model: ITextModel, arg1: any) {
			const outline = new OutlineModelStub(model.id) as unknown as OutlineModel;
			return Promise.resolve(outline);
		}
		override getDebounceValue(arg0: any) {
			return 0;
		}
	};
	const textModelService = new class extends mock<ITextModelService>() {
		override createModelReference(uri: URI) {
			return Promise.resolve({
				object: {
					textEditorModel: {
						id: uri.toString(),
						getVersionId() { return 1; }
					}
				},
				dispose() { }
			} as IReference<IResolvedTextEditorModel>);
		}
	};

	function createCellViewModel(version: number = 1, textmodelId = 'textId') {
		return {
			id: textmodelId,
			uri: { toString() { return textmodelId; } },
			textBuffer: {
				getLineCount() { return 0; }
			},
			getText() {
				return '# code';
			},
			model: {
				textModel: {
					id: textmodelId,
					getVersionId() { return version; }
				}
			},
			resolveTextModel() {
				return this.model.textModel as unknown;
			},
		} as ICellViewModel;
	}

	test('Cell without symbols cache', function () {
		setSymbolsForTextModel([{ name: 'var', range: {} }]);
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		const entries = entryFactory.getOutlineEntries(createCellViewModel(), 0);

		assert.equal(entries.length, 1, 'no entries created');
		assert.equal(entries[0].label, '# code', 'entry should fall back to first line of cell');
	});

	test('Cell with simple symbols', async function () {
		setSymbolsForTextModel([{ name: 'var1', range: {} }, { name: 'var2', range: {} }]);
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		const cell = createCellViewModel();

		await entryFactory.cacheSymbols(cell, CancellationToken.None);
		const entries = entryFactory.getOutlineEntries(cell, 0);

		assert.equal(entries.length, 3, 'wrong number of outline entries');
		assert.equal(entries[0].label, '# code');
		assert.equal(entries[1].label, 'var1');
		// 6 levels for markdown, all code symbols are greater than the max markdown level
		assert.equal(entries[1].level, 8);
		assert.equal(entries[1].index, 1);
		assert.equal(entries[2].label, 'var2');
		assert.equal(entries[2].level, 8);
		assert.equal(entries[2].index, 2);
	});

	test('Cell with nested symbols', async function () {
		setSymbolsForTextModel([
			{ name: 'root1', range: {}, children: [{ name: 'nested1', range: {} }, { name: 'nested2', range: {} }] },
			{ name: 'root2', range: {}, children: [{ name: 'nested1', range: {} }] }
		]);
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);
		const cell = createCellViewModel();

		await entryFactory.cacheSymbols(cell, CancellationToken.None);
		const entries = entryFactory.getOutlineEntries(createCellViewModel(), 0);

		assert.equal(entries.length, 6, 'wrong number of outline entries');
		assert.equal(entries[0].label, '# code');
		assert.equal(entries[1].label, 'root1');
		assert.equal(entries[1].level, 8);
		assert.equal(entries[2].label, 'nested1');
		assert.equal(entries[2].level, 9);
		assert.equal(entries[3].label, 'nested2');
		assert.equal(entries[3].level, 9);
		assert.equal(entries[4].label, 'root2');
		assert.equal(entries[4].level, 8);
		assert.equal(entries[5].label, 'nested1');
		assert.equal(entries[5].level, 9);
	});

	test('Multiple Cells with symbols', async function () {
		setSymbolsForTextModel([{ name: 'var1', range: {} }], '$1');
		setSymbolsForTextModel([{ name: 'var2', range: {} }], '$2');
		const entryFactory = new NotebookOutlineEntryFactory(executionService, outlineModelService, textModelService);

		const cell1 = createCellViewModel(1, '$1');
		const cell2 = createCellViewModel(1, '$2');
		await entryFactory.cacheSymbols(cell1, CancellationToken.None);
		await entryFactory.cacheSymbols(cell2, CancellationToken.None);

		const entries1 = entryFactory.getOutlineEntries(createCellViewModel(1, '$1'), 0);
		const entries2 = entryFactory.getOutlineEntries(createCellViewModel(1, '$2'), 0);


		assert.equal(entries1.length, 2, 'wrong number of outline entries');
		assert.equal(entries1[0].label, '# code');
		assert.equal(entries1[1].label, 'var1');
		assert.equal(entries2.length, 2, 'wrong number of outline entries');
		assert.equal(entries2[0].label, '# code');
		assert.equal(entries2[1].label, 'var2');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/notebookUndoRedo.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/notebookUndoRedo.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { CellEditType, CellKind, SelectionStateType } from '../../../common/notebookCommon.js';
import { createNotebookCellList, withTestNotebook } from '../testNotebookEditor.js';

suite('Notebook Undo/Redo', () => {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite();

	test('Basics', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, _accessor) => {
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.getVersionId(), 0);
				assert.strictEqual(viewModel.getAlternativeId(), '0_0,1;1,1');

				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(viewModel.length, 0);
				assert.strictEqual(viewModel.getVersionId(), 1);
				assert.strictEqual(viewModel.getAlternativeId(), '1_');

				await viewModel.undo();
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.getVersionId(), 2);
				assert.strictEqual(viewModel.getAlternativeId(), '0_0,1;1,1');

				await viewModel.redo();
				assert.strictEqual(viewModel.length, 0);
				assert.strictEqual(viewModel.getVersionId(), 3);
				assert.strictEqual(viewModel.getAlternativeId(), '1_');

				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 0, cells: [
						{ source: '# header 3', language: 'markdown', cellKind: CellKind.Markup, outputs: [], mime: undefined }
					]
				}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(viewModel.getVersionId(), 4);
				assert.strictEqual(viewModel.getAlternativeId(), '4_2,1');

				await viewModel.undo();
				assert.strictEqual(viewModel.getVersionId(), 5);
				assert.strictEqual(viewModel.getAlternativeId(), '1_');
			}
		);
	});

	test('Invalid replace count should not throw', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, _viewModel, _ds, _accessor) => {
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, true);

				assert.doesNotThrow(() => {
					editor.textModel.applyEdits([{
						editType: CellEditType.Replace, index: 0, count: 2, cells: [
							{ source: '# header 2', language: 'markdown', cellKind: CellKind.Markup, outputs: [], mime: undefined }
						]
					}], true, undefined, () => undefined, undefined, true);
				});
			}
		);
	});

	test('Replace beyond length', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel) => {
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 1, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, true);

				assert.deepStrictEqual(viewModel.length, 1);
				await viewModel.undo();
				assert.deepStrictEqual(viewModel.length, 2);
			}
		);
	});

	test('Invalid replace count should not affect undo/redo', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, _accessor) => {
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, true);

				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 2, cells: [
						{ source: '# header 2', language: 'markdown', cellKind: CellKind.Markup, outputs: [], mime: undefined }
					]
				}], true, undefined, () => undefined, undefined, true);

				assert.deepStrictEqual(viewModel.length, 1);

				await viewModel.undo();
				await viewModel.undo();

				assert.deepStrictEqual(viewModel.length, 2);
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 1, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, true);
				assert.deepStrictEqual(viewModel.length, 1);
			}
		);
	});

	test('Focus/selection update', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				const cellList = createNotebookCellList(accessor, disposables);
				cellList.attachViewModel(viewModel);
				cellList.setFocus([1]);

				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 2, count: 0, cells: [
						{ source: '# header 2', language: 'markdown', cellKind: CellKind.Markup, outputs: [], mime: undefined }
					]
				}], true, { focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }], kind: SelectionStateType.Index }, () => {
					return {
						focus: { start: 2, end: 3 }, selections: [{ start: 2, end: 3 }], kind: SelectionStateType.Index
					};
				}, undefined, true);
				assert.strictEqual(viewModel.length, 3);
				assert.strictEqual(viewModel.getVersionId(), 1);
				assert.deepStrictEqual(cellList.getFocus(), [2]);
				assert.deepStrictEqual(cellList.getSelection(), [2]);

				await viewModel.undo();
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.getVersionId(), 2);
				assert.deepStrictEqual(cellList.getFocus(), [1]);
				assert.deepStrictEqual(cellList.getSelection(), [1]);

				await viewModel.redo();
				assert.strictEqual(viewModel.length, 3);
				assert.strictEqual(viewModel.getVersionId(), 3);
				assert.deepStrictEqual(cellList.getFocus(), [2]);
				assert.deepStrictEqual(cellList.getSelection(), [2]);
			}
		);
	});

	test('Batch edits', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
			],
			async (editor, viewModel, _ds, accessor) => {
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 2, count: 0, cells: [
						{ source: '# header 2', language: 'markdown', cellKind: CellKind.Markup, outputs: [], mime: undefined }
					]
				}, {
					editType: CellEditType.Metadata, index: 0, metadata: { inputCollapsed: false }
				}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(viewModel.getVersionId(), 1);
				assert.deepStrictEqual(viewModel.cellAt(0)?.metadata, { inputCollapsed: false });

				await viewModel.undo();
				assert.strictEqual(viewModel.length, 2);
				assert.strictEqual(viewModel.getVersionId(), 2);
				assert.deepStrictEqual(viewModel.cellAt(0)?.metadata, {});

				await viewModel.redo();
				assert.strictEqual(viewModel.length, 3);
				assert.strictEqual(viewModel.getVersionId(), 3);
				assert.deepStrictEqual(viewModel.cellAt(0)?.metadata, { inputCollapsed: false });

			}
		);
	});
});
```

--------------------------------------------------------------------------------

````
