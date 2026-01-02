---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 431
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 431 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/test/browser/contrib/outputCopyTests.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/contrib/outputCopyTests.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICellOutputViewModel, ICellViewModel } from '../../../browser/notebookBrowser.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { IClipboardService } from '../../../../../../platform/clipboard/common/clipboardService.js';
import { ILogService } from '../../../../../../platform/log/common/log.js';
import assert from 'assert';
import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { IOutputItemDto } from '../../../common/notebookCommon.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { copyCellOutput } from '../../../browser/viewModel/cellOutputTextHelper.js';

suite('Cell Output Clipboard Tests', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	class ClipboardService {
		private _clipboardContent = '';
		public get clipboardContent() {
			return this._clipboardContent;
		}
		public async writeText(value: string) {
			this._clipboardContent = value;
		}
	}

	const logService = new class extends mock<ILogService>() { };

	function createOutputViewModel(outputs: IOutputItemDto[], cellViewModel?: ICellViewModel) {
		const outputViewModel = { model: { outputs: outputs } } as ICellOutputViewModel;

		if (cellViewModel) {
			cellViewModel.outputsViewModels.push(outputViewModel);
			cellViewModel.model.outputs.push(outputViewModel.model);
		} else {
			cellViewModel = {
				outputsViewModels: [outputViewModel],
				model: { outputs: [outputViewModel.model] }
			} as ICellViewModel;
		}

		outputViewModel.cellViewModel = cellViewModel;

		return outputViewModel;
	}

	test('Copy text/plain output', async () => {
		const mimeType = 'text/plain';
		const clipboard = new ClipboardService();

		const outputDto = { data: VSBuffer.fromString('output content'), mime: 'text/plain' };
		const output = createOutputViewModel([outputDto]);

		await copyCellOutput(mimeType, output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'output content');
	});

	test('Nothing copied for invalid mimetype', async () => {
		const clipboard = new ClipboardService();

		const outputDtos = [
			{ data: VSBuffer.fromString('output content'), mime: 'bad' },
			{ data: VSBuffer.fromString('output 2'), mime: 'unknown' }];
		const output = createOutputViewModel(outputDtos);

		await copyCellOutput('bad', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, '');
	});

	test('Text copied if available instead of invalid mime type', async () => {
		const clipboard = new ClipboardService();

		const outputDtos = [
			{ data: VSBuffer.fromString('output content'), mime: 'bad' },
			{ data: VSBuffer.fromString('text content'), mime: 'text/plain' }];
		const output = createOutputViewModel(outputDtos);

		await copyCellOutput('bad', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'text content');
	});

	test('Selected mimetype is preferred', async () => {
		const clipboard = new ClipboardService();

		const outputDtos = [
			{ data: VSBuffer.fromString('plain text'), mime: 'text/plain' },
			{ data: VSBuffer.fromString('html content'), mime: 'text/html' }];
		const output = createOutputViewModel(outputDtos);

		await copyCellOutput('text/html', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'html content');
	});

	test('copy subsequent output', async () => {
		const clipboard = new ClipboardService();

		const output = createOutputViewModel([{ data: VSBuffer.fromString('first'), mime: 'text/plain' }]);
		const output2 = createOutputViewModel([{ data: VSBuffer.fromString('second'), mime: 'text/plain' }], output.cellViewModel as ICellViewModel);
		const output3 = createOutputViewModel([{ data: VSBuffer.fromString('third'), mime: 'text/plain' }], output.cellViewModel as ICellViewModel);

		await copyCellOutput('text/plain', output2, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'second');

		await copyCellOutput('text/plain', output3, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'third');
	});

	test('adjacent stream outputs are concanented', async () => {
		const clipboard = new ClipboardService();

		const output = createOutputViewModel([{ data: VSBuffer.fromString('stdout'), mime: 'application/vnd.code.notebook.stdout' }]);
		createOutputViewModel([{ data: VSBuffer.fromString('stderr'), mime: 'application/vnd.code.notebook.stderr' }], output.cellViewModel as ICellViewModel);
		createOutputViewModel([{ data: VSBuffer.fromString('text content'), mime: 'text/plain' }], output.cellViewModel as ICellViewModel);
		createOutputViewModel([{ data: VSBuffer.fromString('non-adjacent'), mime: 'application/vnd.code.notebook.stdout' }], output.cellViewModel as ICellViewModel);

		await copyCellOutput('application/vnd.code.notebook.stdout', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'stdoutstderr');
	});

	test('error output uses the value in the stack', async () => {
		const clipboard = new ClipboardService();

		const data = VSBuffer.fromString(`{"name":"Error Name","message":"error message","stack":"error stack"}`);
		const output = createOutputViewModel([{ data, mime: 'application/vnd.code.notebook.error' }]);

		await copyCellOutput('application/vnd.code.notebook.error', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'error stack');
	});

	test('error without stack uses the name and message', async () => {
		const clipboard = new ClipboardService();

		const data = VSBuffer.fromString(`{"name":"Error Name","message":"error message"}`);
		const output = createOutputViewModel([{ data, mime: 'application/vnd.code.notebook.error' }]);

		await copyCellOutput('application/vnd.code.notebook.error', output, clipboard as unknown as IClipboardService, logService);

		assert.strictEqual(clipboard.clipboardContent, 'Error Name: error message');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/diff/editorHeightCalculator.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/diff/editorHeightCalculator.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore, IReference } from '../../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { DiffEditorHeightCalculatorService } from '../../../browser/diff/editorHeightCalculator.js';
import { FontInfo } from '../../../../../../editor/common/config/fontInfo.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../../base/common/uri.js';
import { createTextModel as createTextModelWithText } from '../../../../../../editor/test/common/testTextModel.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { DefaultLinesDiffComputer } from '../../../../../../editor/common/diff/defaultLinesDiffComputer/defaultLinesDiffComputer.js';
import { DiffAlgorithmName, IEditorWorkerService } from '../../../../../../editor/common/services/editorWorker.js';
import { IDocumentDiffProviderOptions, IDocumentDiff } from '../../../../../../editor/common/diff/documentDiffProvider.js';
import { getEditorPadding } from '../../../browser/diff/diffCellEditorOptions.js';
import { HeightOfHiddenLinesRegionInDiffEditor } from '../../../browser/diff/diffElementViewModel.js';

suite('NotebookDiff EditorHeightCalculator', () => {
	['Hide Unchanged Regions', 'Show Unchanged Regions'].forEach(suiteTitle => {
		suite(suiteTitle, () => {
			const fontInfo: FontInfo = { lineHeight: 18, fontSize: 18 } as FontInfo;
			let disposables: DisposableStore;
			let textModelResolver: ITextModelService;
			let editorWorkerService: IEditorWorkerService;
			const original: URI = URI.parse('original');
			const modified: URI = URI.parse('modified');
			let originalModel: ITextModel;
			let modifiedModel: ITextModel;
			const diffComputer = new DefaultLinesDiffComputer();
			let calculator: DiffEditorHeightCalculatorService;
			const hideUnchangedRegions = suiteTitle.startsWith('Hide');
			const configurationService = new TestConfigurationService({
				notebook: { diff: { ignoreMetadata: true } }, diffEditor: {
					hideUnchangedRegions: {
						enabled: hideUnchangedRegions, minimumLineCount: 3, contextLineCount: 3
					}
				}
			});

			function createTextModel(lines: string[]): ITextModel {
				return createTextModelWithText(lines.join('\n'));
			}

			teardown(() => disposables.dispose());
			ensureNoDisposablesAreLeakedInTestSuite();

			setup(() => {
				disposables = new DisposableStore();
				textModelResolver = new class extends mock<ITextModelService>() {
					override async createModelReference(resource: URI): Promise<IReference<IResolvedTextEditorModel>> {
						return {
							dispose: () => { },
							object: {
								textEditorModel: resource === original ? originalModel : modifiedModel,
								getLanguageId: () => 'javascript',
							} as IResolvedTextEditorModel
						};
					}
				};
				editorWorkerService = new class extends mock<IEditorWorkerService>() {
					override async computeDiff(_original: URI, _modified: URI, options: IDocumentDiffProviderOptions, _algorithm: DiffAlgorithmName): Promise<IDocumentDiff | null> {
						const originalLines = new Array(originalModel.getLineCount()).fill(0).map((_, i) => originalModel.getLineContent(i + 1));
						const modifiedLines = new Array(modifiedModel.getLineCount()).fill(0).map((_, i) => modifiedModel.getLineContent(i + 1));
						const result = diffComputer.computeDiff(originalLines, modifiedLines, options);
						const identical = originalLines.join('') === modifiedLines.join('');

						return {
							identical,
							quitEarly: result.hitTimeout,
							changes: result.changes,
							moves: result.moves,
						};

					}
				};
				calculator = new DiffEditorHeightCalculatorService(fontInfo.lineHeight, textModelResolver, editorWorkerService, configurationService);
			});

			test('1 original line with change in same line', async () => {
				originalModel = disposables.add(createTextModel(['Hello World']));
				modifiedModel = disposables.add(createTextModel(['Foo Bar']));

				const height = await calculator.diffAndComputeHeight(original, modified);
				const expectedHeight = getExpectedHeight(1, 0);

				assert.strictEqual(height, expectedHeight);
			});

			test('1 original line with insertion of a new line', async () => {
				originalModel = disposables.add(createTextModel(['Hello World']));
				modifiedModel = disposables.add(createTextModel(['Hello World', 'Foo Bar']));

				const height = await calculator.diffAndComputeHeight(original, modified);
				const expectedHeight = getExpectedHeight(2, 0);

				assert.strictEqual(height, expectedHeight);
			});

			test('1 line with update to a line and insert of a new line', async () => {
				originalModel = disposables.add(createTextModel(['Hello World']));
				modifiedModel = disposables.add(createTextModel(['Foo Bar', 'Bar Baz']));

				const height = await calculator.diffAndComputeHeight(original, modified);
				const expectedHeight = getExpectedHeight(2, 0);

				assert.strictEqual(height, expectedHeight);
			});

			test('10 line with update to a line and insert of a new line', async () => {
				originalModel = disposables.add(createTextModel(createLines(10)));
				modifiedModel = disposables.add(createTextModel(createLines(10).concat('Foo Bar')));

				const height = await calculator.diffAndComputeHeight(original, modified);
				const expectedHeight = getExpectedHeight(hideUnchangedRegions ? 4 : 11, hideUnchangedRegions ? 1 : 0);

				assert.strictEqual(height, expectedHeight);
			});

			test('50 lines with updates, deletions and inserts', async () => {
				originalModel = disposables.add(createTextModel(createLines(60)));
				const modifiedLines = createLines(60);
				modifiedLines[3] = 'Foo Bar';
				modifiedLines.splice(7, 3);
				modifiedLines.splice(10, 0, 'Foo Bar1', 'Foo Bar2', 'Foo Bar3');
				modifiedLines.splice(30, 0, '', '');
				modifiedLines.splice(40, 4);
				modifiedLines.splice(50, 0, '1', '2', '3', '4', '5');

				modifiedModel = disposables.add(createTextModel(modifiedLines));

				const height = await calculator.diffAndComputeHeight(original, modified);
				const expectedHeight = getExpectedHeight(hideUnchangedRegions ? 50 : 70, hideUnchangedRegions ? 3 : 0);

				assert.strictEqual(height, expectedHeight);
			});

			function getExpectedHeight(visibleLineCount: number, unchangeRegionsHeight: number): number {
				return (visibleLineCount * fontInfo.lineHeight) + getEditorPadding(visibleLineCount).top + getEditorPadding(visibleLineCount).bottom + (unchangeRegionsHeight * HeightOfHiddenLinesRegionInDiffEditor);
			}

			function createLines(count: number, linePrefix = 'Hello World'): string[] {
				return new Array(count).fill(0).map((_, i) => `${linePrefix} ${i}`);
			}
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/diff/notebookDiff.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/diff/notebookDiff.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../../../base/common/buffer.js';
import { CancellationToken, CancellationTokenSource } from '../../../../../../base/common/cancellation.js';
import { IDiffResult, ISequence, LcsDiff } from '../../../../../../base/common/diff/diff.js';
import { DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../../base/common/mime.js';
import { mock } from '../../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IDiffElementViewModelBase, SideBySideDiffElementViewModel } from '../../../browser/diff/diffElementViewModel.js';
import { NotebookDiffEditorEventDispatcher } from '../../../browser/diff/eventDispatcher.js';
import { INotebookDiffViewModel, INotebookDiffViewModelUpdateEvent } from '../../../browser/diff/notebookDiffEditorBrowser.js';
import { NotebookDiffViewModel, prettyChanges } from '../../../browser/diff/notebookDiffViewModel.js';
import { CellKind, INotebookTextModel } from '../../../common/notebookCommon.js';
import { INotebookService } from '../../../common/notebookService.js';
import { INotebookEditorWorkerService } from '../../../common/services/notebookWorkerService.js';
import { withTestNotebookDiffModel } from '../testNotebookEditor.js';
import { IDiffEditorHeightCalculatorService } from '../../../browser/diff/editorHeightCalculator.js';

class CellSequence implements ISequence {

	constructor(readonly textModel: INotebookTextModel) {
	}

	getElements(): string[] | number[] | Int32Array {
		const hashValue = new Int32Array(this.textModel.cells.length);
		for (let i = 0; i < this.textModel.cells.length; i++) {
			hashValue[i] = this.textModel.cells[i].getHashValue();
		}

		return hashValue;
	}
}

suite('NotebookDiff', () => {
	let disposables: DisposableStore;
	let token: CancellationToken;
	let eventDispatcher: NotebookDiffEditorEventDispatcher;
	let diffViewModel: NotebookDiffViewModel;
	let diffResult: IDiffResult;
	let notebookEditorWorkerService: INotebookEditorWorkerService;
	let heightCalculator: IDiffEditorHeightCalculatorService;
	teardown(() => disposables.dispose());

	const configurationService = new TestConfigurationService({ notebook: { diff: { ignoreMetadata: true } } });
	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		const cancellation = disposables.add(new CancellationTokenSource());
		eventDispatcher = disposables.add(new NotebookDiffEditorEventDispatcher());
		token = cancellation.token;
		notebookEditorWorkerService = new class extends mock<INotebookEditorWorkerService>() {
			override computeDiff() { return Promise.resolve({ cellsDiff: diffResult, metadataChanged: false }); }
		};
		heightCalculator = new class extends mock<IDiffEditorHeightCalculatorService>() {
			override diffAndComputeHeight() { return Promise.resolve(0); }
			override computeHeightFromLines(_lineCount: number): number {
				return 0;
			}
		};
	});

	async function verifyChangeEventIsNotFired(diffViewModel: INotebookDiffViewModel) {
		let eventArgs: INotebookDiffViewModelUpdateEvent | undefined = undefined;
		disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
		await diffViewModel.computeDiff(token);

		assert.strictEqual(eventArgs, undefined);
	}

	test('diff different source', async () => {
		await withTestNotebookDiffModel([
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], [
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);
			assert.strictEqual(diffResult.changes.length, 1);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 0,
				originalLength: 1,
				modifiedStart: 0,
				modifiedLength: 1
			}]);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 1);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
		});
	});

	test('No changes when re-computing diff with the same source', async () => {
		await withTestNotebookDiffModel([
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], [
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);
			assert.strictEqual(diffResult.changes.length, 1);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 0,
				originalLength: 1,
				modifiedStart: 0,
				modifiedLength: 1
			}]);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff different output', async () => {
		await withTestNotebookDiffModel([
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([5])) }] }], { metadata: { collapsed: false }, executionOrder: 5 }],
			['', 'javascript', CellKind.Code, [], {}]
		], [
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
			['', 'javascript', CellKind.Code, [], {}]
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);
			assert.strictEqual(diffResult.changes.length, 1);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 0,
				originalLength: 1,
				modifiedStart: 0,
				modifiedLength: 1
			}]);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined = undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
			assert.strictEqual(diffViewModel.items[1].type, 'placeholder');


			diffViewModel.items[1].showHiddenCells();

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 1, elements: [diffViewModel.items[1]] });

			(diffViewModel.items[1] as unknown as SideBySideDiffElementViewModel).hideUnchangedCells();

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
			assert.strictEqual((diffViewModel.items[1] as IDiffElementViewModelBase).type, 'placeholder');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 1, elements: [diffViewModel.items[1]] });

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff test small source', async () => {
		await withTestNotebookDiffModel([
			['123456789', 'javascript', CellKind.Code, [], {}]
		], [
			['987654321', 'javascript', CellKind.Code, [], {}],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);
			assert.strictEqual(diffResult.changes.length, 1);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 0,
				originalLength: 1,
				modifiedStart: 0,
				modifiedLength: 1
			}]);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 1);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff test data single cell', async () => {
		await withTestNotebookDiffModel([
			[[
				'# This version has a bug\n',
				'def mult(a, b):\n',
				'    return a / b'
			].join(''), 'javascript', CellKind.Code, [], {}]
		], [
			[[
				'def mult(a, b):\n',
				'    \'This version is debugged.\'\n',
				'    return a * b'
			].join(''), 'javascript', CellKind.Code, [], {}],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);
			assert.strictEqual(diffResult.changes.length, 1);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 0,
				originalLength: 1,
				modifiedStart: 0,
				modifiedLength: 1
			}]);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 1);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff foo/foe', async () => {
		await withTestNotebookDiffModel([
			[['def foe(x, y):\n', '    return x + y\n', 'foe(3, 2)'].join(''), 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([6])) }] }], { metadata: { collapsed: false }, executionOrder: 5 }],
			[['def foo(x, y):\n', '    return x * y\n', 'foo(1, 2)'].join(''), 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([2])) }] }], { metadata: { collapsed: false }, executionOrder: 6 }],
			['', 'javascript', CellKind.Code, [], {}]
		], [
			[['def foo(x, y):\n', '    return x * y\n', 'foo(1, 2)'].join(''), 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([6])) }] }], { metadata: { collapsed: false }, executionOrder: 5 }],
			[['def foe(x, y):\n', '    return x + y\n', 'foe(3, 2)'].join(''), 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([2])) }] }], { metadata: { collapsed: false }, executionOrder: 6 }],
			['', 'javascript', CellKind.Code, [], {}]
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined = undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 3);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
			assert.strictEqual(diffViewModel.items[1].type, 'modified');
			assert.strictEqual(diffViewModel.items[2].type, 'placeholder');
			diffViewModel.items[2].showHiddenCells();
			assert.strictEqual(diffViewModel.items[2].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 2, deleteCount: 1, elements: [diffViewModel.items[2]] });

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff markdown', async () => {
		await withTestNotebookDiffModel([
			['This is a test notebook with only markdown cells', 'markdown', CellKind.Markup, [], {}],
			['Lorem ipsum dolor sit amet', 'markdown', CellKind.Markup, [], {}],
			['In other news', 'markdown', CellKind.Markup, [], {}],
		], [
			['This is a test notebook with markdown cells only', 'markdown', CellKind.Markup, [], {}],
			['Lorem ipsum dolor sit amet', 'markdown', CellKind.Markup, [], {}],
			['In the news', 'markdown', CellKind.Markup, [], {}],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined = undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 3);
			assert.strictEqual(diffViewModel.items[0].type, 'modified');
			assert.strictEqual(diffViewModel.items[1].type, 'placeholder');
			assert.strictEqual(diffViewModel.items[2].type, 'modified');

			diffViewModel.items[1].showHiddenCells();
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 1, elements: [diffViewModel.items[1]] });

			await verifyChangeEventIsNotFired(diffViewModel);

		});
	});

	test('diff insert', async () => {
		await withTestNotebookDiffModel([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], [
			['var h = 8;', 'javascript', CellKind.Code, [], {}],
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], async (model, disposables, accessor) => {
			diffResult = {
				changes: [{
					originalStart: 0,
					originalLength: 0,
					modifiedStart: 0,
					modifiedLength: 1
				}],
				quitEarly: false
			};

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(eventArgs?.firstChangeIndex, 0);
			assert.strictEqual(diffViewModel.items[0].type, 'insert');
			assert.strictEqual(diffViewModel.items[1].type, 'placeholder');

			diffViewModel.items[1].showHiddenCells();
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[2].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 1, elements: [diffViewModel.items[1], diffViewModel.items[2]] });

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff insert 2', async () => {

		await withTestNotebookDiffModel([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], [
			['var h = 8;', 'javascript', CellKind.Code, [], {}],
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], async (model, disposables, accessor) => {
			const eventDispatcher = disposables.add(new NotebookDiffEditorEventDispatcher());
			diffResult = {
				changes: [{
					originalStart: 0,
					originalLength: 0,
					modifiedStart: 0,
					modifiedLength: 1
				}, {
					originalStart: 0,
					originalLength: 6,
					modifiedStart: 1,
					modifiedLength: 6
				}],
				quitEarly: false
			};

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(eventArgs?.firstChangeIndex, 0);
			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'insert');
			assert.strictEqual(diffViewModel.items[1].type, 'placeholder');

			diffViewModel.items[1].showHiddenCells();
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[2].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[3].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[4].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[5].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[6].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[7].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 1, elements: diffViewModel.items.slice(1) });


			(diffViewModel.items[1] as unknown as SideBySideDiffElementViewModel).hideUnchangedCells();

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'insert');
			assert.strictEqual((diffViewModel.items[1] as IDiffElementViewModelBase).type, 'placeholder');
			assert.deepStrictEqual(eventArgs, { start: 1, deleteCount: 7, elements: [diffViewModel.items[1]] });

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff insert 3', async () => {

		await withTestNotebookDiffModel([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], [
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var h = 8;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], async (model, disposables, accessor) => {
			diffResult = {
				changes: [{
					originalStart: 4,
					originalLength: 0,
					modifiedStart: 4,
					modifiedLength: 1
				}],
				quitEarly: false
			};

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			let eventArgs: INotebookDiffViewModelUpdateEvent | undefined = undefined;
			disposables.add(diffViewModel.onDidChangeItems(e => eventArgs = e));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items[0].type, 'placeholder');
			assert.strictEqual(diffViewModel.items[1].type, 'insert');
			assert.strictEqual(diffViewModel.items[2].type, 'placeholder');

			diffViewModel.items[0].showHiddenCells();
			assert.strictEqual(diffViewModel.items[0].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[2].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[3].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[4].type, 'insert');
			assert.strictEqual(diffViewModel.items[5].type, 'placeholder');
			assert.deepStrictEqual(eventArgs, { start: 0, deleteCount: 1, elements: diffViewModel.items.slice(0, 4) });

			diffViewModel.items[5].showHiddenCells();
			assert.strictEqual((diffViewModel.items[0] as IDiffElementViewModelBase).type, 'unchanged');
			assert.strictEqual(diffViewModel.items[1].type, 'unchanged');
			assert.strictEqual((diffViewModel.items[2] as IDiffElementViewModelBase).type, 'unchanged');
			assert.strictEqual(diffViewModel.items[3].type, 'unchanged');
			assert.strictEqual(diffViewModel.items[4].type, 'insert');
			assert.strictEqual(diffViewModel.items[5].type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 5, deleteCount: 1, elements: diffViewModel.items.slice(5) });

			(diffViewModel.items[0] as SideBySideDiffElementViewModel).hideUnchangedCells();
			assert.strictEqual((diffViewModel.items[0] as IDiffElementViewModelBase).type, 'placeholder');
			assert.strictEqual(diffViewModel.items[1].type, 'insert');
			assert.strictEqual((diffViewModel.items[2] as IDiffElementViewModelBase).type, 'unchanged');
			assert.deepStrictEqual(eventArgs, { start: 0, deleteCount: 4, elements: diffViewModel.items.slice(0, 1) });

			await verifyChangeEventIsNotFired(diffViewModel);

		});
	});

	test('LCS', async () => {
		await withTestNotebookDiffModel([
			['# Description', 'markdown', CellKind.Markup, [], { metadata: {} }],
			['x = 3', 'javascript', CellKind.Code, [], { metadata: { collapsed: true }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [], { metadata: { collapsed: false } }]
		], [
			['# Description', 'markdown', CellKind.Markup, [], { metadata: {} }],
			['x = 3', 'javascript', CellKind.Code, [], { metadata: { collapsed: true }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [], { metadata: { collapsed: false } }],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 1 }]
		], async (model) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			const diffResult = diff.ComputeDiff(false);
			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 2,
				originalLength: 0,
				modifiedStart: 2,
				modifiedLength: 1
			}, {
				originalStart: 3,
				originalLength: 1,
				modifiedStart: 4,
				modifiedLength: 0
			}]);
		});
	});

	test('LCS 2', async () => {
		await withTestNotebookDiffModel([
			['# Description', 'markdown', CellKind.Markup, [], { metadata: {} }],
			['x = 3', 'javascript', CellKind.Code, [], { metadata: { collapsed: true }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [], { metadata: { collapsed: false } }],
			['x = 5', 'javascript', CellKind.Code, [], {}],
			['x', 'javascript', CellKind.Code, [], {}],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([5])) }] }], {}],
		], [
			['# Description', 'markdown', CellKind.Markup, [], { metadata: {} }],
			['x = 3', 'javascript', CellKind.Code, [], { metadata: { collapsed: true }, executionOrder: 1 }],
			['x', 'javascript', CellKind.Code, [], { metadata: { collapsed: false } }],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 1 }],
			['x = 5', 'javascript', CellKind.Code, [], {}],
			['x', 'javascript', CellKind.Code, [{ outputId: 'someId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([5])) }] }], {}],
			['x', 'javascript', CellKind.Code, [], {}],
		], async (model) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			const diffResult = diff.ComputeDiff(false);
			prettyChanges(model.original.notebook, model.modified.notebook, diffResult);

			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 2,
				originalLength: 0,
				modifiedStart: 2,
				modifiedLength: 1
			}, {
				originalStart: 3,
				originalLength: 1,
				modifiedStart: 4,
				modifiedLength: 0
			}, {
				originalStart: 5,
				originalLength: 0,
				modifiedStart: 5,
				modifiedLength: 1
			}, {
				originalStart: 6,
				originalLength: 1,
				modifiedStart: 7,
				modifiedLength: 0
			}]);
		});
	});

	test('LCS 3', async () => {
		await withTestNotebookDiffModel([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], [
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}],
			['var c = 3;', 'javascript', CellKind.Code, [], {}],
			['var d = 4;', 'javascript', CellKind.Code, [], {}],
			['var h = 8;', 'javascript', CellKind.Code, [], {}],
			['var e = 5;', 'javascript', CellKind.Code, [], {}],
			['var f = 6;', 'javascript', CellKind.Code, [], {}],
			['var g = 7;', 'javascript', CellKind.Code, [], {}],
		], async (model) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			const diffResult = diff.ComputeDiff(false);
			prettyChanges(model.original.notebook, model.modified.notebook, diffResult);

			assert.deepStrictEqual(diffResult.changes.map(change => ({
				originalStart: change.originalStart,
				originalLength: change.originalLength,
				modifiedStart: change.modifiedStart,
				modifiedLength: change.modifiedLength
			})), [{
				originalStart: 4,
				originalLength: 0,
				modifiedStart: 4,
				modifiedLength: 1
			}]);
		});
	});

	test('diff output', async () => {
		await withTestNotebookDiffModel([
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([4])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], [
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([5])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'placeholder');
			diffViewModel.items[0].showHiddenCells();
			assert.strictEqual((diffViewModel.items[0] as unknown as SideBySideDiffElementViewModel).checkIfOutputsModified(), false);
			assert.strictEqual(diffViewModel.items[1].type, 'modified');

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});

	test('diff output fast check', async () => {
		await withTestNotebookDiffModel([
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([4])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], [
			['x', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([3])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
			['y', 'javascript', CellKind.Code, [{ outputId: 'someOtherId', outputs: [{ mime: Mimes.text, data: VSBuffer.wrap(new Uint8Array([5])) }] }], { metadata: { collapsed: false }, executionOrder: 3 }],
		], async (model, disposables, accessor) => {
			const diff = new LcsDiff(new CellSequence(model.original.notebook), new CellSequence(model.modified.notebook));
			diffResult = diff.ComputeDiff(false);

			diffViewModel = disposables.add(new NotebookDiffViewModel(model, notebookEditorWorkerService, configurationService, eventDispatcher, accessor.get<INotebookService>(INotebookService), heightCalculator, undefined));
			await diffViewModel.computeDiff(token);

			assert.strictEqual(diffViewModel.items.length, 2);
			assert.strictEqual(diffViewModel.items[0].type, 'placeholder');
			diffViewModel.items[0].showHiddenCells();
			assert.strictEqual((diffViewModel.items[0] as unknown as SideBySideDiffElementViewModel).original!.textModel.equal((diffViewModel.items[0] as unknown as SideBySideDiffElementViewModel).modified!.textModel), true);
			assert.strictEqual((diffViewModel.items[1] as unknown as SideBySideDiffElementViewModel).original!.textModel.equal((diffViewModel.items[1] as unknown as SideBySideDiffElementViewModel).modified!.textModel), false);

			await verifyChangeEventIsNotFired(diffViewModel);
		});
	});
});
```

--------------------------------------------------------------------------------

````
