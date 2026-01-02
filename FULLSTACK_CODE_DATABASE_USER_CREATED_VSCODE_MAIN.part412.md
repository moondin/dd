---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 412
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 412 of 552)

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

---[FILE: src/vs/workbench/contrib/mergeEditor/browser/view/media/mergeEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/browser/view/media/mergeEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .merge-editor .code-view > .header {
	padding: 0 10px;
	height: 30px;
	display: flex;
	align-content: center;
	overflow: hidden;
}

.monaco-workbench .merge-editor .code-view > .header > span {
	align-self: center;
	text-overflow: ellipsis;
	overflow: hidden;
	padding-right: 6px;
	white-space: nowrap;
}

.monaco-workbench .merge-editor .code-view > .header > span.title {
	flex-shrink: 0;
}

.monaco-workbench .merge-editor .code-view > .header > span.description {
	flex-shrink: 0;
	display: flex;
	font-size: 12px;
	align-items: center;
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .merge-editor .code-view.result > .header > .description {
	display: inline;
	flex-shrink: 1;
}
.monaco-workbench .merge-editor .code-view.result > .header > .detail {
	flex-shrink: 0;
}
.monaco-workbench .merge-editor .code-view.result > .header > .toolbar {
	flex-shrink: 0;
}

.monaco-workbench .merge-editor .code-view > .header > span.description .codicon {
	font-size: 14px;
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .merge-editor .code-view > .header > span.detail {
	margin-left: auto;
	font-size: 12px;
	color: var(--vscode-descriptionForeground);
}

.monaco-workbench .merge-editor .code-view > .header > span.detail .codicon {
	font-size: 13px;
}

/* for input1|2 -> align details to the left  */
.monaco-workbench .merge-editor .code-view.input > .header > span.detail::before {
	content: '•';
	opacity: .5;
	padding-right: 3px;
}
.monaco-workbench .merge-editor .code-view.input > .header > span.detail {
	margin-left: 0;
}
.monaco-workbench .merge-editor .code-view.input > .header > span.toolbar {
	flex-shrink: 0;
	margin-left: auto;
}


.monaco-workbench .merge-editor .code-view > .container {
	display: flex;
	flex-direction: row;
}

.monaco-workbench .merge-editor .code-view > .container > .gutter {
	width: 24px;
	position: relative;
	overflow: hidden;
	flex-shrink: 0;
	flex-grow: 0;
}

.monaco-workbench .merge-editor .merge-editor-diff {
	background-color: var(--vscode-mergeEditor-change-background);
}

.monaco-workbench .merge-editor .merge-editor-diff-word {
	background-color: var(--vscode-mergeEditor-change-word-background);
}

/* BEGIN: .merge-editor-block */

.monaco-workbench .merge-editor .merge-editor-block:not(.handled):not(.focused) {
	border: 1px solid var(--vscode-mergeEditor-conflict-unhandledUnfocused-border);
}

.monaco-workbench .merge-editor .merge-editor-block:not(.handled).focused {
	border: 2px solid var(--vscode-mergeEditor-conflict-unhandledFocused-border);
}

.monaco-workbench .merge-editor .merge-editor-block.handled:not(.focused) {
	border: 1px solid var(--vscode-mergeEditor-conflict-handledUnfocused-border);
}

.monaco-workbench .merge-editor .merge-editor-block.handled.focused {
	border: 1px solid var(--vscode-mergeEditor-conflict-handledFocused-border);
}

.monaco-workbench .merge-editor .merge-editor-simplified.input.i1, .merge-editor-block.use-simplified-decorations.input.i1 {
	background-color: var(--vscode-mergeEditor-conflict-input1-background);
}

.monaco-workbench .merge-editor .merge-editor-simplified.input.i2, .merge-editor-block.use-simplified-decorations.input.i2 {
	background-color: var(--vscode-mergeEditor-conflict-input2-background);
}

/* END: .merge-editor-block */

.gutter.monaco-editor > div {
	position: absolute;
}

.merge-accept-gutter-marker {
	width: 28px;
	margin-left: 4px;
}

.merge-accept-gutter-marker .background {
	height: 100%;
	width: 50%;
	position: absolute;
}

.merge-accept-gutter-marker.multi-line.focused .background {
	border: 2px solid var(--vscode-mergeEditor-conflict-unhandledFocused-border);
	border-right: 0;
}

.merge-accept-gutter-marker.multi-line .background {
	border: 2px solid var(--vscode-mergeEditor-conflict-unhandledUnfocused-border);
	border-right: 0;
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
}

.merge-accept-gutter-marker.multi-line.handled.focused .background {
	border: 2px solid var(--vscode-mergeEditor-conflict-handledFocused-border);
	border-right: 0;
}

.merge-accept-gutter-marker.multi-line.handled .background {
	border: 2px solid var(--vscode-checkbox-border);
	border-right: 0;
}


.focused .accept-conflict-group.monaco-custom-toggle {
	border: 1px solid var(--vscode-mergeEditor-conflict-unhandledFocused-border);
}

.accept-conflict-group.monaco-custom-toggle {
	border: 1px solid var(--vscode-mergeEditor-conflict-unhandledUnfocused-border);
}

.handled.focused .accept-conflict-group.monaco-custom-toggle {
	border: 1px solid var(--vscode-mergeEditor-conflict-handledFocused-border);
}

.handled .accept-conflict-group.monaco-custom-toggle {
	border: 1px solid var(--vscode-checkbox-border);
}

.merge-accept-gutter-marker.multi-line .background {
	left: 8px;
	width: 10px;
}

.merge-accept-gutter-marker .checkbox {
	width: 100%;
	position: absolute;
}

.accept-conflict-group.monaco-custom-toggle {
	height: 18px;
	width: 18px;
	border-radius: 3px;
	margin-right: 0px;
	margin-left: 0px;
	padding: 0px;
	opacity: 1;
	background-size: 16px !important;
	background-color: var(--vscode-checkbox-border);
}

.merge-accept-gutter-marker .checkbox-background {
	display: flex;
	background: var(--vscode-editor-background);
}

.conflict-zone-root {
	background-color: var(--vscode-mergeEditor-change-background);
	border: 1px solid var(--vscode-mergeEditor-conflict-unhandledUnfocused-border);
	height: 90%;
	display: flex;
	align-items: center;
	align-content: center;
}

.conflict-zone-root .dots {
	margin: 0 10px;
}

.conflict-zone-root pre {
	display: 'inline';
	font-family: var(--monaco-monospace-font);
}

.conflict-zone-root .text {
	background: var(--vscode-mergeEditor-conflictingLines-background);
	margin-left: auto;
	padding: 0 8px;
	display: flex;
	align-items: center;
	height: 100%;
	white-space: nowrap;
	overflow: hidden;
}


.focused.conflict-zone .conflict-zone-root {
	border: 1px solid var(--vscode-mergeEditor-conflict-unhandledFocused-border);
}

.merge-editor-conflict-actions {
	margin: 0px 3px;
	overflow: hidden;
	display: inline-block;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--vscode-editorCodeLens-foreground)
}

.merge-editor-conflict-actions > span,
.merge-editor-conflict-actions > a {
	user-select: none;
	-webkit-user-select: none;
	white-space: nowrap;
}

.merge-editor-conflict-actions > a {
	text-decoration: none;
}

.merge-editor-conflict-actions > a:hover {
	cursor: pointer;
	color: var(--vscode-editorLink-activeForeground) !important;
}

.merge-editor-conflict-actions > a:hover .codicon {
	color: var(--vscode-editorLink-activeForeground) !important;
}

.merge-editor-conflict-actions .codicon {
	vertical-align: middle;
	color: currentColor !important;
	color: var(--vscode-editorCodeLens-foreground);
}

.merge-editor-conflict-actions > a:hover .codicon::before {
	cursor: pointer;
}

.fixed-zone-widget {
	width: 100%;
}

.merge-editor-diff-empty-word.base {
	margin-left: 3px;
	border-left: solid var(--vscode-mergeEditor-changeBase-word-background) 3px;
}

.merge-editor-diff-empty-word.input {
	margin-left: 3px;
	border-left: solid var(--vscode-mergeEditor-change-word-background) 3px;
}

.merge-editor-diff-word.base {
	background-color: var(--vscode-mergeEditor-changeBase-word-background);
}

.merge-editor-diff.base {
	background-color: var(--vscode-mergeEditor-changeBase-background);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/common/mergeEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/common/mergeEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export type MergeEditorLayoutKind = 'mixed' | 'columns';

export const ctxIsMergeEditor = new RawContextKey<boolean>('isMergeEditor', false, { type: 'boolean', description: localize('is', 'The editor is a merge editor') });
export const ctxIsMergeResultEditor = new RawContextKey<boolean>('isMergeResultEditor', false, { type: 'boolean', description: localize('isr', 'The editor is a the result editor of a merge editor.') });
export const ctxMergeEditorLayout = new RawContextKey<MergeEditorLayoutKind>('mergeEditorLayout', 'mixed', { type: 'string', description: localize('editorLayout', 'The layout mode of a merge editor') });
export const ctxMergeEditorShowBase = new RawContextKey<boolean>('mergeEditorShowBase', false, { type: 'boolean', description: localize('showBase', 'If the merge editor shows the base version') });
export const ctxMergeEditorShowBaseAtTop = new RawContextKey<boolean>('mergeEditorShowBaseAtTop', false, { type: 'boolean', description: localize('showBaseAtTop', 'If base should be shown at the top') });
export const ctxMergeEditorShowNonConflictingChanges = new RawContextKey<boolean>('mergeEditorShowNonConflictingChanges', false, { type: 'boolean', description: localize('showNonConflictingChanges', 'If the merge editor shows non-conflicting changes') });

export const ctxMergeBaseUri = new RawContextKey<string>('mergeEditorBaseUri', '', { type: 'string', description: localize('baseUri', 'The uri of the baser of a merge editor') });
export const ctxMergeResultUri = new RawContextKey<string>('mergeEditorResultUri', '', { type: 'string', description: localize('resultUri', 'The uri of the result of a merge editor') });

export interface MergeEditorContents {
	languageId: string;
	base: string;
	input1: string;
	input2: string;
	result: string;
	initialResult?: string;
}

export const StorageCloseWithConflicts = 'mergeEditorCloseWithConflicts';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/electron-browser/devCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/electron-browser/devCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { randomPath } from '../../../../base/common/extpath.js';
import { URI } from '../../../../base/common/uri.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { localize, localize2 } from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { Action2, IAction2Options } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IResourceMergeEditorInput } from '../../../common/editor.js';
import { MergeEditor } from '../browser/view/mergeEditor.js';
import { MergeEditorViewModel } from '../browser/view/viewModel.js';
import { MergeEditorContents } from '../common/mergeEditor.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

const MERGE_EDITOR_CATEGORY: ILocalizedString = localize2('mergeEditor', 'Merge Editor (Dev)');

export class MergeEditorOpenContentsFromJSON extends Action2 {
	constructor() {
		super({
			id: 'merge.dev.openContentsJson',
			category: MERGE_EDITOR_CATEGORY,
			title: localize2('merge.dev.openState', "Open Merge Editor State from JSON"),
			icon: Codicon.layoutCentered,
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, args?: { data?: MergeEditorContents; resultState?: 'initial' | 'current' }): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const clipboardService = accessor.get(IClipboardService);
		const editorService = accessor.get(IEditorService);
		const languageService = accessor.get(ILanguageService);
		const env = accessor.get(INativeEnvironmentService);
		const fileService = accessor.get(IFileService);

		if (!args) {
			args = {};
		}

		let content: MergeEditorContents;
		if (!args.data) {
			const result = await quickInputService.input({
				prompt: localize('mergeEditor.enterJSON', 'Enter JSON'),
				value: await clipboardService.readText(),
			});
			if (result === undefined) {
				return;
			}
			content =
				result !== ''
					? JSON.parse(result)
					: { base: '', input1: '', input2: '', result: '', languageId: 'plaintext' };
		} else {
			content = args.data;
		}

		const targetDir = URI.joinPath(env.tmpDir, randomPath());

		const extension = languageService.getExtensions(content.languageId)[0] || '';

		const baseUri = URI.joinPath(targetDir, `/base${extension}`);
		const input1Uri = URI.joinPath(targetDir, `/input1${extension}`);
		const input2Uri = URI.joinPath(targetDir, `/input2${extension}`);
		const resultUri = URI.joinPath(targetDir, `/result${extension}`);
		const initialResultUri = URI.joinPath(targetDir, `/initialResult${extension}`);

		async function writeFile(uri: URI, content: string): Promise<void> {
			await fileService.writeFile(uri, VSBuffer.fromString(content));
		}

		const shouldOpenInitial = await promptOpenInitial(quickInputService, args.resultState);

		await Promise.all([
			writeFile(baseUri, content.base),
			writeFile(input1Uri, content.input1),
			writeFile(input2Uri, content.input2),
			writeFile(resultUri, shouldOpenInitial ? (content.initialResult || '') : content.result),
			writeFile(initialResultUri, content.initialResult || ''),
		]);

		const input: IResourceMergeEditorInput = {
			base: { resource: baseUri },
			input1: { resource: input1Uri, label: 'Input 1', description: 'Input 1', detail: '(from JSON)' },
			input2: { resource: input2Uri, label: 'Input 2', description: 'Input 2', detail: '(from JSON)' },
			result: { resource: resultUri },
		};
		editorService.openEditor(input);
	}
}

async function promptOpenInitial(quickInputService: IQuickInputService, resultStateOverride?: 'initial' | 'current') {
	if (resultStateOverride) {
		return resultStateOverride === 'initial';
	}
	const result = await quickInputService.pick([{ label: 'result', result: false }, { label: 'initial result', result: true }], { canPickMany: false });
	return result?.result;
}

abstract class MergeEditorAction extends Action2 {
	constructor(desc: Readonly<IAction2Options>) {
		super(desc);
	}

	run(accessor: ServicesAccessor): void {
		const { activeEditorPane } = accessor.get(IEditorService);
		if (activeEditorPane instanceof MergeEditor) {
			const vm = activeEditorPane.viewModel.get();
			if (!vm) {
				return;
			}
			this.runWithViewModel(vm, accessor);
		}
	}

	abstract runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor): void;
}

export class OpenSelectionInTemporaryMergeEditor extends MergeEditorAction {
	constructor() {
		super({
			id: 'merge.dev.openSelectionInTemporaryMergeEditor',
			category: MERGE_EDITOR_CATEGORY,
			title: localize2('merge.dev.openSelectionInTemporaryMergeEditor', "Open Selection In Temporary Merge Editor"),
			icon: Codicon.layoutCentered,
			f1: true,
		});
	}

	override async runWithViewModel(viewModel: MergeEditorViewModel, accessor: ServicesAccessor) {
		const rangesInBase = viewModel.selectionInBase.get()?.rangesInBase;
		if (!rangesInBase || rangesInBase.length === 0) {
			return;
		}

		const base = rangesInBase
			.map((r) =>
				viewModel.model.base.getValueInRange(
					r
				)
			)
			.join('\n');

		const input1 = rangesInBase
			.map((r) =>
				viewModel.inputCodeEditorView1.editor.getModel()!.getValueInRange(
					viewModel.model.translateBaseRangeToInput(1, r)
				)
			)
			.join('\n');

		const input2 = rangesInBase
			.map((r) =>
				viewModel.inputCodeEditorView2.editor.getModel()!.getValueInRange(
					viewModel.model.translateBaseRangeToInput(2, r)
				)
			)
			.join('\n');

		const result = rangesInBase
			.map((r) =>
				viewModel.resultCodeEditorView.editor.getModel()!.getValueInRange(
					viewModel.model.translateBaseRangeToResult(r)
				)
			)
			.join('\n');

		new MergeEditorOpenContentsFromJSON().run(accessor, {
			data: {
				base,
				input1,
				input2,
				result,
				languageId: viewModel.resultCodeEditorView.editor.getModel()!.getLanguageId()
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/electron-browser/mergeEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/electron-browser/mergeEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { MergeEditorOpenContentsFromJSON, OpenSelectionInTemporaryMergeEditor } from './devCommands.js';

// Dev Commands
registerAction2(MergeEditorOpenContentsFromJSON);
registerAction2(OpenSelectionInTemporaryMergeEditor);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/test/browser/mapping.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/test/browser/mapping.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { TextLength } from '../../../../../editor/common/core/text/textLength.js';
import { DocumentRangeMap, RangeMapping } from '../../browser/model/mapping.js';

suite('merge editor mapping', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	suite('DocumentRangeMap', () => {
		const documentMap = createDocumentRangeMap([
			'1:3',
			['0:2', '0:3'],
			'1:1',
			['1:2', '3:3'],
			'0:2',
			['0:2', '0:3'],
		]);

		test('map', () => assert.deepStrictEqual(documentMap.rangeMappings.map(m => m.toString()), [
			'[2:4, 2:6) -> [2:4, 2:7)',
			'[3:2, 4:3) -> [3:2, 6:4)',
			'[4:5, 4:7) -> [6:6, 6:9)'
		]));

		function f(this: Mocha.Context) {
			return documentMap.project(parsePos(this.test!.title)).toString();
		}

		test('1:1', function () { assert.deepStrictEqual(f.apply(this), '[1:1, 1:1) -> [1:1, 1:1)'); });
		test('2:3', function () { assert.deepStrictEqual(f.apply(this), '[2:3, 2:3) -> [2:3, 2:3)'); });
		test('2:4', function () { assert.deepStrictEqual(f.apply(this), '[2:4, 2:6) -> [2:4, 2:7)'); });
		test('2:5', function () { assert.deepStrictEqual(f.apply(this), '[2:4, 2:6) -> [2:4, 2:7)'); });
		test('2:6', function () { assert.deepStrictEqual(f.apply(this), '[2:6, 2:6) -> [2:7, 2:7)'); });
		test('2:7', function () { assert.deepStrictEqual(f.apply(this), '[2:7, 2:7) -> [2:8, 2:8)'); });
		test('3:1', function () { assert.deepStrictEqual(f.apply(this), '[3:1, 3:1) -> [3:1, 3:1)'); });
		test('3:2', function () { assert.deepStrictEqual(f.apply(this), '[3:2, 4:3) -> [3:2, 6:4)'); });
		test('4:2', function () { assert.deepStrictEqual(f.apply(this), '[3:2, 4:3) -> [3:2, 6:4)'); });
		test('4:3', function () { assert.deepStrictEqual(f.apply(this), '[4:3, 4:3) -> [6:4, 6:4)'); });
		test('4:4', function () { assert.deepStrictEqual(f.apply(this), '[4:4, 4:4) -> [6:5, 6:5)'); });
		test('4:5', function () { assert.deepStrictEqual(f.apply(this), '[4:5, 4:7) -> [6:6, 6:9)'); });
	});
});

function parsePos(str: string): Position {
	const [lineCount, columnCount] = str.split(':');
	return new Position(parseInt(lineCount, 10), parseInt(columnCount, 10));
}

function parseLengthObj(str: string): TextLength {
	const [lineCount, columnCount] = str.split(':');
	return new TextLength(parseInt(lineCount, 10), parseInt(columnCount, 10));
}

function toPosition(length: TextLength): Position {
	return new Position(length.lineCount + 1, length.columnCount + 1);
}

function createDocumentRangeMap(items: ([string, string] | string)[]) {
	const mappings: RangeMapping[] = [];
	let lastLen1 = new TextLength(0, 0);
	let lastLen2 = new TextLength(0, 0);
	for (const item of items) {
		if (typeof item === 'string') {
			const len = parseLengthObj(item);
			lastLen1 = lastLen1.add(len);
			lastLen2 = lastLen2.add(len);
		} else {
			const len1 = parseLengthObj(item[0]);
			const len2 = parseLengthObj(item[1]);
			mappings.push(new RangeMapping(
				Range.fromPositions(toPosition(lastLen1), toPosition(lastLen1.add(len1))),
				Range.fromPositions(toPosition(lastLen2), toPosition(lastLen2.add(len2))),
			));
			lastLen1 = lastLen1.add(len1);
			lastLen2 = lastLen2.add(len2);
		}
	}

	return new DocumentRangeMap(mappings, lastLen1.lineCount);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/mergeEditor/test/browser/model.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/mergeEditor/test/browser/model.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IReader, transaction } from '../../../../../base/common/observable.js';
import { isDefined } from '../../../../../base/common/types.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { linesDiffComputers } from '../../../../../editor/common/diff/linesDiffComputers.js';
import { EndOfLinePreference, ITextModel } from '../../../../../editor/common/model.js';
import { createModelServices, createTextModel } from '../../../../../editor/test/common/testTextModel.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IMergeDiffComputer, IMergeDiffComputerResult, toLineRange, toRangeMapping } from '../../browser/model/diffComputer.js';
import { DetailedLineRangeMapping } from '../../browser/model/mapping.js';
import { MergeEditorModel } from '../../browser/model/mergeEditorModel.js';
import { MergeEditorTelemetry } from '../../browser/telemetry.js';

suite('merge editor model', () => {
	// todo: renable when failing case is found https://github.com/microsoft/vscode/pull/190444#issuecomment-1678151428
	// ensureNoDisposablesAreLeakedInTestSuite();

	test('prepend line', async () => {
		await testMergeModel(
			{
				'languageId': 'plaintext',
				'base': 'line1\nline2',
				'input1': '0\nline1\nline2',
				'input2': '0\nline1\nline2',
				'result': ''
			},
			model => {
				assert.deepStrictEqual(model.getProjections(), {
					base: ['⟦⟧₀line1', 'line2'],
					input1: ['⟦0', '⟧₀line1', 'line2'],
					input2: ['⟦0', '⟧₀line1', 'line2'],
					result: ['⟦⟧{unrecognized}₀'],
				});

				model.toggleConflict(0, 1);
				assert.deepStrictEqual(
					{ result: model.getResult() },
					{ result: '0\nline1\nline2' }
				);

				model.toggleConflict(0, 2);
				assert.deepStrictEqual(
					{ result: model.getResult() },
					({ result: '0\n0\nline1\nline2' })
				);
			}
		);
	});

	test('empty base', async () => {
		await testMergeModel(
			{
				'languageId': 'plaintext',
				'base': '',
				'input1': 'input1',
				'input2': 'input2',
				'result': ''
			},
			model => {
				assert.deepStrictEqual(model.getProjections(), {
					base: ['⟦⟧₀'],
					input1: ['⟦input1⟧₀'],
					input2: ['⟦input2⟧₀'],
					result: ['⟦⟧{base}₀'],
				});

				model.toggleConflict(0, 1);
				assert.deepStrictEqual(
					{ result: model.getResult() },
					({ result: 'input1' })
				);

				model.toggleConflict(0, 2);
				assert.deepStrictEqual(
					{ result: model.getResult() },
					({ result: 'input2' })
				);
			}
		);
	});

	test('can merge word changes', async () => {
		await testMergeModel(
			{
				'languageId': 'plaintext',
				'base': 'hello',
				'input1': 'hallo',
				'input2': 'helloworld',
				'result': ''
			},
			model => {
				assert.deepStrictEqual(model.getProjections(), {
					base: ['⟦hello⟧₀'],
					input1: ['⟦hallo⟧₀'],
					input2: ['⟦helloworld⟧₀'],
					result: ['⟦⟧{unrecognized}₀'],
				});

				model.toggleConflict(0, 1);
				model.toggleConflict(0, 2);

				assert.deepStrictEqual(
					{ result: model.getResult() },
					{ result: 'halloworld' }
				);
			}
		);

	});

	test('can combine insertions at end of document', async () => {
		await testMergeModel(
			{
				'languageId': 'plaintext',
				'base': 'Zürich\nBern\nBasel\nChur\nGenf\nThun',
				'input1': 'Zürich\nBern\nChur\nDavos\nGenf\nThun\nfunction f(b:boolean) {}',
				'input2': 'Zürich\nBern\nBasel (FCB)\nChur\nGenf\nThun\nfunction f(a:number) {}',
				'result': 'Zürich\nBern\nBasel\nChur\nDavos\nGenf\nThun'
			},
			model => {
				assert.deepStrictEqual(model.getProjections(), {
					base: ['Zürich', 'Bern', '⟦Basel', '⟧₀Chur', '⟦⟧₁Genf', 'Thun⟦⟧₂'],
					input1: [
						'Zürich',
						'Bern',
						'⟦⟧₀Chur',
						'⟦Davos',
						'⟧₁Genf',
						'Thun',
						'⟦function f(b:boolean) {}⟧₂',
					],
					input2: [
						'Zürich',
						'Bern',
						'⟦Basel (FCB)',
						'⟧₀Chur',
						'⟦⟧₁Genf',
						'Thun',
						'⟦function f(a:number) {}⟧₂',
					],
					result: [
						'Zürich',
						'Bern',
						'⟦Basel',
						'⟧{base}₀Chur',
						'⟦Davos',
						'⟧{1✓}₁Genf',
						'Thun⟦⟧{base}₂',
					],
				});

				model.toggleConflict(2, 1);
				model.toggleConflict(2, 2);

				assert.deepStrictEqual(
					{ result: model.getResult() },
					{
						result:
							'Zürich\nBern\nBasel\nChur\nDavos\nGenf\nThun\nfunction f(b:boolean) {}\nfunction f(a:number) {}',
					}
				);
			}
		);
	});

	test('conflicts are reset', async () => {
		await testMergeModel(
			{
				'languageId': 'typescript',
				'base': `import { h } from 'vs/base/browser/dom';\nimport { Disposable, IDisposable } from 'vs/base/common/lifecycle';\nimport { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';\nimport { EditorOption } from 'vs/editor/common/config/editorOptions';\nimport { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\n`,
				'input1': `import { h } from 'vs/base/browser/dom';\nimport { Disposable, IDisposable } from 'vs/base/common/lifecycle';\nimport { observableSignalFromEvent } from 'vs/base/common/observable';\nimport { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';\nimport { autorun, IReader, observableFromEvent } from 'vs/workbench/contrib/audioCues/browser/observable';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\n`,
				'input2': `import { h } from 'vs/base/browser/dom';\nimport { Disposable, IDisposable } from 'vs/base/common/lifecycle';\nimport { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';\nimport { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\n`,
				'result': `import { h } from 'vs/base/browser/dom';\r\nimport { Disposable, IDisposable } from 'vs/base/common/lifecycle';\r\nimport { observableSignalFromEvent } from 'vs/base/common/observable';\r\nimport { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';\r\n<<<<<<< Updated upstream\r\nimport { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';\r\n=======\r\nimport { autorun, IReader, observableFromEvent } from 'vs/workbench/contrib/audioCues/browser/observable';\r\n>>>>>>> Stashed changes\r\nimport { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';\r\n`
			},
			model => {
				assert.deepStrictEqual(model.getProjections(), {
					base: [
						`import { h } from 'vs/base/browser/dom';`,
						`import { Disposable, IDisposable } from 'vs/base/common/lifecycle';`,
						`⟦⟧₀import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';`,
						`⟦import { EditorOption } from 'vs/editor/common/config/editorOptions';`,
						`import { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';`,
						`⟧₁import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';`,
						'',
					],
					input1: [
						`import { h } from 'vs/base/browser/dom';`,
						`import { Disposable, IDisposable } from 'vs/base/common/lifecycle';`,
						`⟦import { observableSignalFromEvent } from 'vs/base/common/observable';`,
						`⟧₀import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';`,
						`⟦import { autorun, IReader, observableFromEvent } from 'vs/workbench/contrib/audioCues/browser/observable';`,
						`⟧₁import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';`,
						'',
					],
					input2: [
						`import { h } from 'vs/base/browser/dom';`,
						`import { Disposable, IDisposable } from 'vs/base/common/lifecycle';`,
						`⟦⟧₀import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';`,
						`⟦import { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';`,
						`⟧₁import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';`,
						'',
					],
					result: [
						`import { h } from 'vs/base/browser/dom';`,
						`import { Disposable, IDisposable } from 'vs/base/common/lifecycle';`,
						`⟦import { observableSignalFromEvent } from 'vs/base/common/observable';`,
						`⟧{1✓}₀import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';`,
						'⟦<<<<<<< Updated upstream',
						`import { autorun, IReader, observableFromEvent, ObservableValue } from 'vs/workbench/contrib/audioCues/browser/observable';`,
						'=======',
						`import { autorun, IReader, observableFromEvent } from 'vs/workbench/contrib/audioCues/browser/observable';`,
						'>>>>>>> Stashed changes',
						`⟧{unrecognized}₁import { LineRange } from 'vs/workbench/contrib/mergeEditor/browser/model/lineRange';`,
						'',
					],
				});
			}
		);
	});

	test('auto-solve equal edits', async () => {
		await testMergeModel(
			{
				'languageId': 'javascript',
				'base': `const { readFileSync } = require('fs');\n\nlet paths = process.argv.slice(2);\nmain(paths);\n\nfunction main(paths) {\n    // print the welcome message\n    printMessage();\n\n    let data = getLineCountInfo(paths);\n    console.log("Lines: " + data.totalLineCount);\n}\n\n/**\n * Prints the welcome message\n*/\nfunction printMessage() {\n    console.log("Welcome To Line Counter");\n}\n\n/**\n * @param {string[]} paths\n*/\nfunction getLineCountInfo(paths) {\n    let lineCounts = paths.map(path => ({ path, count: getLinesLength(readFileSync(path, 'utf8')) }));\n    return {\n        totalLineCount: lineCounts.reduce((acc, { count }) => acc + count, 0),\n        lineCounts,\n    };\n}\n\n/**\n * @param {string} str\n */\nfunction getLinesLength(str) {\n    return str.split('\\n').length;\n}\n`,
				'input1': `const { readFileSync } = require('fs');\n\nlet paths = process.argv.slice(2);\nmain(paths);\n\nfunction main(paths) {\n    // print the welcome message\n    printMessage();\n\n    const data = getLineCountInfo(paths);\n    console.log("Lines: " + data.totalLineCount);\n}\n\nfunction printMessage() {\n    console.log("Welcome To Line Counter");\n}\n\n/**\n * @param {string[]} paths\n*/\nfunction getLineCountInfo(paths) {\n    let lineCounts = paths.map(path => ({ path, count: getLinesLength(readFileSync(path, 'utf8')) }));\n    return {\n        totalLineCount: lineCounts.reduce((acc, { count }) => acc + count, 0),\n        lineCounts,\n    };\n}\n\n/**\n * @param {string} str\n */\nfunction getLinesLength(str) {\n    return str.split('\\n').length;\n}\n`,
				'input2': `const { readFileSync } = require('fs');\n\nlet paths = process.argv.slice(2);\nrun(paths);\n\nfunction run(paths) {\n    // print the welcome message\n    printMessage();\n\n    const data = getLineCountInfo(paths);\n    console.log("Lines: " + data.totalLineCount);\n}\n\nfunction printMessage() {\n    console.log("Welcome To Line Counter");\n}\n\n/**\n * @param {string[]} paths\n*/\nfunction getLineCountInfo(paths) {\n    let lineCounts = paths.map(path => ({ path, count: getLinesLength(readFileSync(path, 'utf8')) }));\n    return {\n        totalLineCount: lineCounts.reduce((acc, { count }) => acc + count, 0),\n        lineCounts,\n    };\n}\n\n/**\n * @param {string} str\n */\nfunction getLinesLength(str) {\n    return str.split('\\n').length;\n}\n`,
				'result': '<<<<<<< uiae\n>>>>>>> Stashed changes',
				resetResult: true,
			},
			async model => {
				await model.mergeModel.reset();

				assert.deepStrictEqual(model.getResult(), `const { readFileSync } = require('fs');\n\nlet paths = process.argv.slice(2);\nrun(paths);\n\nfunction run(paths) {\n    // print the welcome message\n    printMessage();\n\n    const data = getLineCountInfo(paths);\n    console.log("Lines: " + data.totalLineCount);\n}\n\nfunction printMessage() {\n    console.log("Welcome To Line Counter");\n}\n\n/**\n * @param {string[]} paths\n*/\nfunction getLineCountInfo(paths) {\n    let lineCounts = paths.map(path => ({ path, count: getLinesLength(readFileSync(path, 'utf8')) }));\n    return {\n        totalLineCount: lineCounts.reduce((acc, { count }) => acc + count, 0),\n        lineCounts,\n    };\n}\n\n/**\n * @param {string} str\n */\nfunction getLinesLength(str) {\n    return str.split('\\n').length;\n}\n`);
			}
		);
	});
});

async function testMergeModel(
	options: MergeModelOptions,
	fn: (model: MergeModelInterface) => void
): Promise<void> {
	const disposables = new DisposableStore();
	const modelInterface = disposables.add(
		new MergeModelInterface(options, createModelServices(disposables))
	);
	await modelInterface.mergeModel.onInitialized;
	await fn(modelInterface);
	disposables.dispose();
}

interface MergeModelOptions {
	languageId: string;
	input1: string;
	input2: string;
	base: string;
	result: string;
	resetResult?: boolean;
}

function toSmallNumbersDec(value: number): string {
	const smallNumbers = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
	return value.toString().split('').map(c => smallNumbers[parseInt(c)]).join('');
}

class MergeModelInterface extends Disposable {
	public readonly mergeModel: MergeEditorModel;

	constructor(options: MergeModelOptions, instantiationService: IInstantiationService) {
		super();
		const input1TextModel = this._register(createTextModel(options.input1, options.languageId));
		const input2TextModel = this._register(createTextModel(options.input2, options.languageId));
		const baseTextModel = this._register(createTextModel(options.base, options.languageId));
		const resultTextModel = this._register(createTextModel(options.result, options.languageId));

		const diffComputer: IMergeDiffComputer = {
			async computeDiff(textModel1: ITextModel, textModel2: ITextModel, reader: IReader): Promise<IMergeDiffComputerResult> {
				const result = await linesDiffComputers.getLegacy().computeDiff(
					textModel1.getLinesContent(),
					textModel2.getLinesContent(),
					{ ignoreTrimWhitespace: false, maxComputationTimeMs: 10000, computeMoves: false }
				);
				const changes = result.changes.map(c =>
					new DetailedLineRangeMapping(
						toLineRange(c.original),
						textModel1,
						toLineRange(c.modified),
						textModel2,
						c.innerChanges?.map(ic => toRangeMapping(ic)).filter(isDefined)
					)
				);
				return {
					diffs: changes
				};
			}
		};

		this.mergeModel = this._register(instantiationService.createInstance(MergeEditorModel,
			baseTextModel,
			{
				textModel: input1TextModel,
				description: '',
				detail: '',
				title: '',
			},
			{
				textModel: input2TextModel,
				description: '',
				detail: '',
				title: '',
			},
			resultTextModel,
			diffComputer,
			{
				resetResult: options.resetResult || false
			},
			new MergeEditorTelemetry(NullTelemetryService),
		));
	}

	getProjections(): unknown {
		interface LabeledRange {
			range: Range;
			label: string;
		}
		function applyRanges(textModel: ITextModel, ranges: LabeledRange[]): void {
			textModel.applyEdits(ranges.map(({ range, label }) => ({
				range: range,
				text: `⟦${textModel.getValueInRange(range)}⟧${label}`,
			})));
		}
		const baseRanges = this.mergeModel.modifiedBaseRanges.get();

		const baseTextModel = createTextModel(this.mergeModel.base.getValue());
		applyRanges(
			baseTextModel,
			baseRanges.map<LabeledRange>((r, idx) => ({
				range: r.baseRange.toExclusiveRange(),
				label: toSmallNumbersDec(idx),
			}))
		);

		const input1TextModel = createTextModel(this.mergeModel.input1.textModel.getValue());
		applyRanges(
			input1TextModel,
			baseRanges.map<LabeledRange>((r, idx) => ({
				range: r.input1Range.toExclusiveRange(),
				label: toSmallNumbersDec(idx),
			}))
		);

		const input2TextModel = createTextModel(this.mergeModel.input2.textModel.getValue());
		applyRanges(
			input2TextModel,
			baseRanges.map<LabeledRange>((r, idx) => ({
				range: r.input2Range.toExclusiveRange(),
				label: toSmallNumbersDec(idx),
			}))
		);

		const resultTextModel = createTextModel(this.mergeModel.resultTextModel.getValue());
		applyRanges(
			resultTextModel,
			baseRanges.map<LabeledRange>((r, idx) => ({
				range: this.mergeModel.getLineRangeInResult(r.baseRange).toExclusiveRange(),
				label: `{${this.mergeModel.getState(r).get()}}${toSmallNumbersDec(idx)}`,
			}))
		);

		const result = {
			base: baseTextModel.getValue(EndOfLinePreference.LF).split('\n'),
			input1: input1TextModel.getValue(EndOfLinePreference.LF).split('\n'),
			input2: input2TextModel.getValue(EndOfLinePreference.LF).split('\n'),
			result: resultTextModel.getValue(EndOfLinePreference.LF).split('\n'),
		};
		baseTextModel.dispose();
		input1TextModel.dispose();
		input2TextModel.dispose();
		resultTextModel.dispose();
		return result;
	}

	toggleConflict(conflictIdx: number, inputNumber: 1 | 2): void {
		const baseRange = this.mergeModel.modifiedBaseRanges.get()[conflictIdx];
		if (!baseRange) {
			throw new Error();
		}
		const state = this.mergeModel.getState(baseRange).get();
		transaction(tx => {
			this.mergeModel.setState(baseRange, state.toggle(inputNumber), true, tx);
		});
	}

	getResult(): string {
		return this.mergeModel.resultTextModel.getValue();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/actions.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/actions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { URI } from '../../../../base/common/uri.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { localize2 } from '../../../../nls.js';
import { Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ITextEditorOptions, TextEditorSelectionRevealType } from '../../../../platform/editor/common/editor.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { resolveCommandsContext } from '../../../browser/parts/editor/editorCommandsContext.js';
import { MultiDiffEditor } from './multiDiffEditor.js';
import { MultiDiffEditorInput } from './multiDiffEditorInput.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ActiveEditorContext } from '../../../common/contextkeys.js';

export class GoToFileAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.goToFile',
			title: localize2('goToFile', 'Open File'),
			icon: Codicon.goToFile,
			precondition: ActiveEditorContext.isEqualTo(MultiDiffEditor.ID),
			menu: {
				when: ActiveEditorContext.isEqualTo(MultiDiffEditor.ID),
				id: MenuId.MultiDiffEditorFileToolbar,
				order: 22,
				group: 'navigation',
			},
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const uri = args[0] as URI;
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;
		let selections: Selection[] | undefined = undefined;
		if (!(activeEditorPane instanceof MultiDiffEditor)) {
			return;
		}

		const editor = activeEditorPane.tryGetCodeEditor(uri);
		if (editor) {
			selections = editor.editor.getSelections() ?? undefined;
		}

		let targetUri = uri;
		const item = activeEditorPane.findDocumentDiffItem(uri);
		if (item && item.goToFileUri) {
			targetUri = item.goToFileUri;
		}

		await editorService.openEditor({
			label: item?.goToFileEditorTitle,
			resource: targetUri,
			options: {
				selection: selections?.[0],
				selectionRevealType: TextEditorSelectionRevealType.CenterIfOutsideViewport,
			} satisfies ITextEditorOptions,
		});
	}
}

export class GoToNextChangeAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.goToNextChange',
			title: localize2('goToNextChange', 'Go to Next Change'),
			icon: Codicon.arrowDown,
			precondition: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
			menu: [MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				when: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
				group: 'navigation',
				order: 2
			})),
			keybinding: {
				primary: KeyMod.Alt | KeyCode.F5,
				weight: KeybindingWeight.EditorContrib,
				when: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
			},
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;

		if (!(activeEditorPane instanceof MultiDiffEditor)) {
			return;
		}

		activeEditorPane.goToNextChange();
	}
}

export class GoToPreviousChangeAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.goToPreviousChange',
			title: localize2('goToPreviousChange', 'Go to Previous Change'),
			icon: Codicon.arrowUp,
			precondition: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
			menu: [MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				when: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
				group: 'navigation',
				order: 1
			})),
			keybinding: {
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.F5,
				weight: KeybindingWeight.EditorContrib,
				when: ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID),
			},
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const activeEditorPane = editorService.activeEditorPane;

		if (!(activeEditorPane instanceof MultiDiffEditor)) {
			return;
		}

		activeEditorPane.goToPreviousChange();
	}
}

export class CollapseAllAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.collapseAll',
			title: localize2('collapseAllDiffs', 'Collapse All Diffs'),
			icon: Codicon.collapseAll,
			precondition: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.not('multiDiffEditorAllCollapsed')),
			menu: [MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.not('multiDiffEditorAllCollapsed')),
				group: 'navigation',
				order: 100
			})),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));

		const groupContext = resolvedContext.groupedEditors[0];
		if (!groupContext) {
			return;
		}

		const editor = groupContext.editors[0];
		if (editor instanceof MultiDiffEditorInput) {
			const viewModel = await editor.getViewModel();
			viewModel.collapseAll();
		}
	}
}

export class ExpandAllAction extends Action2 {
	constructor() {
		super({
			id: 'multiDiffEditor.expandAll',
			title: localize2('ExpandAllDiffs', 'Expand All Diffs'),
			icon: Codicon.expandAll,
			precondition: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.has('multiDiffEditorAllCollapsed')),
			menu: [MenuId.EditorTitle, MenuId.CompactWindowEditorTitle].map(id => ({
				id,
				when: ContextKeyExpr.and(ContextKeyExpr.equals('activeEditor', MultiDiffEditor.ID), ContextKeyExpr.has('multiDiffEditorAllCollapsed')),
				group: 'navigation',
				order: 100
			})),
			f1: true,
		});
	}

	async run(accessor: ServicesAccessor, ...args: unknown[]): Promise<void> {
		const resolvedContext = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));

		const groupContext = resolvedContext.groupedEditors[0];
		if (!groupContext) {
			return;
		}

		const editor = groupContext.editors[0];
		if (editor instanceof MultiDiffEditorInput) {
			const viewModel = await editor.getViewModel();
			viewModel.expandAll();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/icons.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/icons.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const MultiDiffEditorIcon = registerIcon('multi-diff-editor-label-icon', Codicon.diffMultiple, localize('multiDiffEditorLabelIcon', 'Icon of the multi diff editor label.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditor.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditor.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry } from '../../../common/editor.js';
import { MultiDiffEditor } from './multiDiffEditor.js';
import { MultiDiffEditorInput, MultiDiffEditorResolverContribution, MultiDiffEditorSerializer } from './multiDiffEditorInput.js';
import { CollapseAllAction, ExpandAllAction, GoToFileAction, GoToNextChangeAction, GoToPreviousChangeAction } from './actions.js';
import { IMultiDiffSourceResolverService, MultiDiffSourceResolverService } from './multiDiffSourceResolverService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { OpenScmGroupAction, ScmMultiDiffSourceResolverContribution } from './scmMultiDiffSourceResolver.js';

registerAction2(GoToFileAction);
registerAction2(GoToNextChangeAction);
registerAction2(GoToPreviousChangeAction);
registerAction2(CollapseAllAction);
registerAction2(ExpandAllAction);


registerSingleton(IMultiDiffSourceResolverService, MultiDiffSourceResolverService, InstantiationType.Delayed);

// Editor Integration
registerWorkbenchContribution2(MultiDiffEditorResolverContribution.ID, MultiDiffEditorResolverContribution, WorkbenchPhase.BlockStartup /* only registering an editor resolver */);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane)
	.registerEditorPane(
		EditorPaneDescriptor.create(MultiDiffEditor, MultiDiffEditor.ID, localize('name', "Multi Diff Editor")),
		[new SyncDescriptor(MultiDiffEditorInput)]
	);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory)
	.registerEditorSerializer(MultiDiffEditorInput.ID, MultiDiffEditorSerializer);

// SCM integration
registerAction2(OpenScmGroupAction);
registerWorkbenchContribution2(ScmMultiDiffSourceResolverContribution.ID, ScmMultiDiffSourceResolverContribution, WorkbenchPhase.BlockStartup /* only registering an editor resolver  */);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { MultiDiffEditorWidget } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidget.js';
import { IResourceLabel, IWorkbenchUIElementFactory } from '../../../../editor/browser/widget/multiDiffEditor/workbenchUIElementFactory.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { FloatingClickMenu } from '../../../../platform/actions/browser/floatingMenu.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationService } from '../../../../platform/instantiation/common/instantiationService.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ResourceLabel } from '../../../browser/labels.js';
import { AbstractEditorWithViewState } from '../../../browser/parts/editor/editorWithViewState.js';
import { ICompositeControl } from '../../../common/composite.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IDocumentDiffItemWithMultiDiffEditorItem, MultiDiffEditorInput } from './multiDiffEditorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { URI } from '../../../../base/common/uri.js';
import { MultiDiffEditorViewModel } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorViewModel.js';
import { IMultiDiffEditorOptions, IMultiDiffEditorViewState } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IDiffEditor } from '../../../../editor/common/editorCommon.js';
import { Range } from '../../../../editor/common/core/range.js';
import { MultiDiffEditorItem } from './multiDiffSourceResolverService.js';
import { IEditorProgressService } from '../../../../platform/progress/common/progress.js';
import { ResourceContextKey } from '../../../common/contextkeys.js';

export class MultiDiffEditor extends AbstractEditorWithViewState<IMultiDiffEditorViewState> {
	static readonly ID = 'multiDiffEditor';

	private _multiDiffEditorWidget: MultiDiffEditorWidget | undefined = undefined;
	private _viewModel: MultiDiffEditorViewModel | undefined;
	private _sessionResourceContextKey: ResourceContextKey | undefined;
	private _contentOverlay: MultiDiffEditorContentMenuOverlay | undefined;

	public get viewModel(): MultiDiffEditorViewModel | undefined {
		return this._viewModel;
	}

	constructor(
		group: IEditorGroup,
		@IInstantiationService instantiationService: InstantiationService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IEditorProgressService private editorProgressService: IEditorProgressService,
		@IMenuService private readonly menuService: IMenuService,
	) {
		super(
			MultiDiffEditor.ID,
			group,
			'multiDiffEditor',
			telemetryService,
			instantiationService,
			storageService,
			textResourceConfigurationService,
			themeService,
			editorService,
			editorGroupService
		);
	}

	protected createEditor(parent: HTMLElement): void {
		this._multiDiffEditorWidget = this._register(this.instantiationService.createInstance(
			MultiDiffEditorWidget,
			parent,
			this.instantiationService.createInstance(WorkbenchUIElementFactory),
		));

		this._register(this._multiDiffEditorWidget.onDidChangeActiveControl(() => {
			this._onDidChangeControl.fire();
		}));

		const scopedContextKeyService = this._multiDiffEditorWidget.getContextKeyService();
		const scopedInstantiationService = this._multiDiffEditorWidget.getScopedInstantiationService();
		this._sessionResourceContextKey = this._register(scopedInstantiationService.createInstance(ResourceContextKey));
		this._contentOverlay = this._register(new MultiDiffEditorContentMenuOverlay(
			this._multiDiffEditorWidget.getRootElement(),
			this._sessionResourceContextKey,
			scopedContextKeyService,
			this.menuService,
			scopedInstantiationService,
		));
	}

	override async setInput(input: MultiDiffEditorInput, options: IMultiDiffEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);
		this._viewModel = await input.getViewModel();
		this._sessionResourceContextKey?.set(input.resource);
		this._contentOverlay?.updateResource(input.resource);
		this._multiDiffEditorWidget!.setViewModel(this._viewModel);

		const viewState = this.loadEditorViewState(input, context);
		if (viewState) {
			this._multiDiffEditorWidget!.setViewState(viewState);
		}
		this._applyOptions(options);
	}

	override setOptions(options: IMultiDiffEditorOptions | undefined): void {
		this._applyOptions(options);
	}

	private _applyOptions(options: IMultiDiffEditorOptions | undefined): void {
		const viewState = options?.viewState;
		if (!viewState || !viewState.revealData) {
			return;
		}
		this._multiDiffEditorWidget?.reveal(viewState.revealData.resource, {
			range: viewState.revealData.range ? Range.lift(viewState.revealData.range) : undefined,
			highlight: true
		});
	}

	override async clearInput(): Promise<void> {
		await super.clearInput();
		this._sessionResourceContextKey?.set(null);
		this._contentOverlay?.updateResource(undefined);
		this._multiDiffEditorWidget!.setViewModel(undefined);
	}

	layout(dimension: DOM.Dimension): void {
		this._multiDiffEditorWidget!.layout(dimension);
	}

	override getControl(): ICompositeControl | undefined {
		return this._multiDiffEditorWidget!.getActiveControl();
	}

	override focus(): void {
		super.focus();

		this._multiDiffEditorWidget?.getActiveControl()?.focus();
	}

	override hasFocus(): boolean {
		return this._multiDiffEditorWidget?.getActiveControl()?.hasTextFocus() || super.hasFocus();
	}

	protected override computeEditorViewState(resource: URI): IMultiDiffEditorViewState | undefined {
		return this._multiDiffEditorWidget!.getViewState();
	}

	protected override tracksEditorViewState(input: EditorInput): boolean {
		return input instanceof MultiDiffEditorInput;
	}

	protected override toEditorViewStateResource(input: EditorInput): URI | undefined {
		return (input as MultiDiffEditorInput).resource;
	}

	public tryGetCodeEditor(resource: URI): { diffEditor: IDiffEditor; editor: ICodeEditor } | undefined {
		return this._multiDiffEditorWidget!.tryGetCodeEditor(resource);
	}

	public findDocumentDiffItem(resource: URI): MultiDiffEditorItem | undefined {
		const i = this._multiDiffEditorWidget!.findDocumentDiffItem(resource);
		if (!i) { return undefined; }
		const i2 = i as IDocumentDiffItemWithMultiDiffEditorItem;
		return i2.multiDiffEditorItem;
	}

	public goToNextChange(): void {
		this._multiDiffEditorWidget?.goToNextChange();
	}

	public goToPreviousChange(): void {
		this._multiDiffEditorWidget?.goToPreviousChange();
	}

	public async showWhile(promise: Promise<unknown>): Promise<void> {
		return this.editorProgressService.showWhile(promise);
	}
}

class MultiDiffEditorContentMenuOverlay extends Disposable {
	private readonly overlayStore = this._register(new MutableDisposable<DisposableStore>());
	private readonly resourceContextKey: ResourceContextKey;
	private currentResource: URI | undefined;
	private readonly rebuild: () => void;

	constructor(
		root: HTMLElement,
		resourceContextKey: ResourceContextKey,
		contextKeyService: IContextKeyService,
		menuService: IMenuService,
		instantiationService: IInstantiationService,
	) {
		super();
		this.resourceContextKey = resourceContextKey;

		const menu = this._register(menuService.createMenu(MenuId.MultiDiffEditorContent, contextKeyService));

		this.rebuild = () => {
			this.overlayStore.clear();

			const hasActions = menu.getActions().length > 0;
			if (!hasActions) {
				return;
			}

			const container = DOM.h('div.floating-menu-overlay-widget.multi-diff-root-floating-menu');
			root.appendChild(container.root);
			const floatingMenu = instantiationService.createInstance(FloatingClickMenu, {
				container: container.root,
				menuId: MenuId.MultiDiffEditorContent,
				getActionArg: () => this.currentResource,
			});

			const store = new DisposableStore();
			store.add(floatingMenu);
			store.add(toDisposable(() => container.root.remove()));
			this.overlayStore.value = store;
		};

		this.rebuild();
		this._register(menu.onDidChange(() => {
			this.overlayStore.clear();
			this.rebuild();
		}));

		this._register(resourceContextKey);
	}

	public updateResource(resource: URI | undefined): void {
		this.currentResource = resource;
		// Update context key and rebuild so menu arg matches
		this.resourceContextKey.set(resource ?? null);
		this.overlayStore.clear();
		this.rebuild();
	}
}


class WorkbenchUIElementFactory implements IWorkbenchUIElementFactory {
	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	createResourceLabel(element: HTMLElement): IResourceLabel {
		const label = this._instantiationService.createInstance(ResourceLabel, element, {});
		return {
			setUri(uri, options = {}) {
				if (!uri) {
					label.element.clear();
				} else {
					label.element.setFile(uri, { strikethrough: options.strikethrough });
				}
			},
			dispose() {
				label.dispose();
			}
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LazyStatefulPromise, raceTimeout } from '../../../../base/common/async.js';
import { BugIndicatingError, onUnexpectedError } from '../../../../base/common/errors.js';
import { Event, ValueWithChangeEvent } from '../../../../base/common/event.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore, IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { parse } from '../../../../base/common/marshalling.js';
import { Schemas } from '../../../../base/common/network.js';
import { deepClone } from '../../../../base/common/objects.js';
import { ObservableLazyPromise, ValueWithChangeEventFromObservable, autorun, constObservable, derived, mapObservableArrayCached, observableFromEvent, observableFromValueWithChangeEvent, observableValue, recomputeInitiallyAndOnChange } from '../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { isDefined, isObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { RefCounted } from '../../../../editor/browser/widget/diffEditor/utils.js';
import { IDocumentDiffItem, IMultiDiffEditorModel } from '../../../../editor/browser/widget/multiDiffEditor/model.js';
import { MultiDiffEditorViewModel } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorViewModel.js';
import { IDiffEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { localize } from '../../../../nls.js';
import { ConfirmResult } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IEditorConfiguration } from '../../../browser/parts/editor/textEditor.js';
import { DEFAULT_EDITOR_ASSOCIATION, EditorInputCapabilities, EditorInputWithOptions, GroupIdentifier, IEditorSerializer, IResourceMultiDiffEditorInput, IRevertOptions, ISaveOptions, IUntypedEditorInput } from '../../../common/editor.js';
import { EditorInput, IEditorCloseHandler } from '../../../common/editor/editorInput.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { ILanguageSupport, ITextFileEditorModel, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { MultiDiffEditorIcon } from './icons.contribution.js';
import { IMultiDiffSourceResolverService, IResolvedMultiDiffSource, MultiDiffEditorItem } from './multiDiffSourceResolverService.js';

export class MultiDiffEditorInput extends EditorInput implements ILanguageSupport {
	public static fromResourceMultiDiffEditorInput(input: IResourceMultiDiffEditorInput, instantiationService: IInstantiationService): MultiDiffEditorInput {
		if (!input.multiDiffSource && !input.resources) {
			throw new BugIndicatingError('MultiDiffEditorInput requires either multiDiffSource or resources');
		}
		const multiDiffSource = input.multiDiffSource ?? URI.parse(`multi-diff-editor:${new Date().getMilliseconds().toString() + Math.random().toString()}`);
		return instantiationService.createInstance(
			MultiDiffEditorInput,
			multiDiffSource,
			input.label,
			input.resources?.map(resource => {
				return new MultiDiffEditorItem(
					resource.original.resource,
					resource.modified.resource,
					resource.goToFileResource,
				);
			}),
			input.isTransient ?? false
		);
	}

	public static fromSerialized(data: ISerializedMultiDiffEditorInput, instantiationService: IInstantiationService): MultiDiffEditorInput {
		return instantiationService.createInstance(
			MultiDiffEditorInput,
			URI.parse(data.multiDiffSourceUri),
			data.label,
			data.resources?.map(resource => new MultiDiffEditorItem(
				resource.originalUri ? URI.parse(resource.originalUri) : undefined,
				resource.modifiedUri ? URI.parse(resource.modifiedUri) : undefined,
				resource.goToFileUri ? URI.parse(resource.goToFileUri) : undefined,
			)),
			false
		);
	}

	static readonly ID: string = 'workbench.input.multiDiffEditor';

	get resource(): URI | undefined { return this.multiDiffSource; }

	override get capabilities(): EditorInputCapabilities { return EditorInputCapabilities.Readonly; }
	override get typeId(): string { return MultiDiffEditorInput.ID; }

	private _name: string;
	override getName(): string { return this._name; }

	override get editorId(): string { return DEFAULT_EDITOR_ASSOCIATION.id; }
	override getIcon(): ThemeIcon { return MultiDiffEditorIcon; }

	constructor(
		public readonly multiDiffSource: URI,
		public readonly label: string | undefined,
		public readonly initialResources: readonly MultiDiffEditorItem[] | undefined,
		public readonly isTransient: boolean = false,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@ITextResourceConfigurationService private readonly _textResourceConfigurationService: ITextResourceConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IMultiDiffSourceResolverService private readonly _multiDiffSourceResolverService: IMultiDiffSourceResolverService,
		@ITextFileService private readonly _textFileService: ITextFileService,
	) {
		super();
		this._name = '';
		this._viewModel = new LazyStatefulPromise(async () => {
			const model = await this._createModel();
			this._register(model);
			const vm = new MultiDiffEditorViewModel(model, this._instantiationService);
			this._register(vm);
			await raceTimeout(vm.waitForDiffs(), 1000);
			return vm;
		});
		this._resolvedSource = new ObservableLazyPromise(async () => {
			const source: IResolvedMultiDiffSource | undefined = this.initialResources
				? { resources: ValueWithChangeEvent.const(this.initialResources) }
				: await this._multiDiffSourceResolverService.resolve(this.multiDiffSource);
			return {
				source,
				resources: source ? observableFromValueWithChangeEvent(this, source.resources) : constObservable([]),
			};
		});
		this.resources = derived(this, reader => this._resolvedSource.cachedPromiseResult.read(reader)?.data?.resources.read(reader));
		this.textFileServiceOnDidChange = new FastEventDispatcher<ITextFileEditorModel, URI>(
			this._textFileService.files.onDidChangeDirty,
			item => item.resource.toString(),
			uri => uri.toString()
		);
		this._isDirtyObservables = mapObservableArrayCached(this, this.resources.map(r => r ?? []), res => {
			const isModifiedDirty = res.modifiedUri ? isUriDirty(this.textFileServiceOnDidChange, this._textFileService, res.modifiedUri) : constObservable(false);
			const isOriginalDirty = res.originalUri ? isUriDirty(this.textFileServiceOnDidChange, this._textFileService, res.originalUri) : constObservable(false);
			return derived(reader => /** @description modifiedDirty||originalDirty */ isModifiedDirty.read(reader) || isOriginalDirty.read(reader));
		}, i => i.getKey());
		this._isDirtyObservable = derived(this, reader => this._isDirtyObservables.read(reader).some(isDirty => isDirty.read(reader)))
			.keepObserved(this._store);
		this.onDidChangeDirty = Event.fromObservableLight(this._isDirtyObservable);
		this.closeHandler = {

			// This is a workaround for not having a better way
			// to figure out if the editors this input wraps
			// around are opened or not

			async confirm() {
				return ConfirmResult.DONT_SAVE;
			},
			showConfirm() {
				return false;
			}
		};

		this._register(autorun((reader) => {
			/** @description Updates name */
			const resources = this.resources.read(reader);
			const label = this.label ?? localize('name', "Multi Diff Editor");
			if (resources && resources.length === 1) {
				this._name = localize({ key: 'nameWithOneFile', comment: ['{0} is the name of the editor'] }, "{0} (1 file)", label);
			} else if (resources) {
				this._name = localize({ key: 'nameWithFiles', comment: ['{0} is the name of the editor', '{1} is the number of files being shown'] }, "{0} ({1} files)", label, resources.length);
			} else {
				this._name = label;
			}
			this._onDidChangeLabel.fire();
		}));
	}

	public serialize(): ISerializedMultiDiffEditorInput {
		return {
			label: this.label,
			multiDiffSourceUri: this.multiDiffSource.toString(),
			resources: this.initialResources?.map(resource => ({
				originalUri: resource.originalUri?.toString(),
				modifiedUri: resource.modifiedUri?.toString(),
				goToFileUri: resource.goToFileUri?.toString(),
			})),
		};
	}

	public setLanguageId(languageId: string, source?: string | undefined): void {
		const activeDiffItem = this._viewModel.requireValue().activeDiffItem.get();
		const value = activeDiffItem?.documentDiffItem;
		if (!value) { return; }
		const target = value.modified ?? value.original;
		if (!target) { return; }
		target.setLanguage(languageId, source);
	}

	public async getViewModel(): Promise<MultiDiffEditorViewModel> {
		return this._viewModel.getPromise();
	}

	private readonly _viewModel;

	private async _createModel(): Promise<IMultiDiffEditorModel & IDisposable> {
		const source = await this._resolvedSource.getPromise();
		const textResourceConfigurationService = this._textResourceConfigurationService;

		const documentsWithPromises = mapObservableArrayCached(this, source.resources, async (r, store) => {
			/** @description documentsWithPromises */
			let original: IReference<IResolvedTextEditorModel> | undefined;
			let modified: IReference<IResolvedTextEditorModel> | undefined;

			const multiDiffItemStore = new DisposableStore();

			try {
				[original, modified] = await Promise.all([
					r.originalUri ? this._textModelService.createModelReference(r.originalUri) : undefined,
					r.modifiedUri ? this._textModelService.createModelReference(r.modifiedUri) : undefined,
				]);
				if (original) { multiDiffItemStore.add(original); }
				if (modified) { multiDiffItemStore.add(modified); }
			} catch (e) {
				// e.g. "File seems to be binary and cannot be opened as text"
				console.error(e);
				onUnexpectedError(e);
				return undefined;
			}

			const uri = (r.modifiedUri ?? r.originalUri)!;
			const result: IDocumentDiffItemWithMultiDiffEditorItem = {
				multiDiffEditorItem: r,
				original: original?.object.textEditorModel,
				modified: modified?.object.textEditorModel,
				contextKeys: r.contextKeys,
				get options() {
					return {
						...getReadonlyConfiguration(modified?.object.isReadonly() ?? true),
						...computeOptions(textResourceConfigurationService.getValue(uri)),
					} satisfies IDiffEditorOptions;
				},
				onOptionsDidChange: h => this._textResourceConfigurationService.onDidChangeConfiguration(e => {
					if (e.affectsConfiguration(uri, 'editor') || e.affectsConfiguration(uri, 'diffEditor')) {
						h();
					}
				}),
			};
			return store.add(RefCounted.createOfNonDisposable(result, multiDiffItemStore, this));
		}, i => JSON.stringify([i.modifiedUri?.toString(), i.originalUri?.toString()]));

		const documents = observableValue<readonly RefCounted<IDocumentDiffItem>[] | 'loading'>('documents', 'loading');

		const updateDocuments = derived(async reader => {
			/** @description Update documents */
			const docsPromises = documentsWithPromises.read(reader);
			const docs = await Promise.all(docsPromises);
			const newDocuments = docs.filter(isDefined);
			documents.set(newDocuments, undefined);
		});

		const a = recomputeInitiallyAndOnChange(updateDocuments);
		await updateDocuments.get();

		const result: IMultiDiffEditorModel & IDisposable = {
			dispose: () => a.dispose(),
			documents: new ValueWithChangeEventFromObservable(documents),
			contextKeys: source.source?.contextKeys,
		};
		return result;
	}

	private readonly _resolvedSource;

	override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
		if (super.matches(otherInput)) {
			return true;
		}

		if (otherInput instanceof MultiDiffEditorInput) {
			return this.multiDiffSource.toString() === otherInput.multiDiffSource.toString();
		}

		return false;
	}

	public readonly resources;

	private readonly textFileServiceOnDidChange;

	private readonly _isDirtyObservables;
	private readonly _isDirtyObservable;

	override readonly onDidChangeDirty;
	override isDirty() { return this._isDirtyObservable.get(); }

	override async save(group: number, options?: ISaveOptions | undefined): Promise<EditorInput> {
		await this.doSaveOrRevert('save', group, options);
		return this;
	}

	override  revert(group: GroupIdentifier, options?: IRevertOptions): Promise<void> {
		return this.doSaveOrRevert('revert', group, options);
	}

	private async doSaveOrRevert(mode: 'save', group: GroupIdentifier, options?: ISaveOptions): Promise<void>;
	private async doSaveOrRevert(mode: 'revert', group: GroupIdentifier, options?: IRevertOptions): Promise<void>;
	private async doSaveOrRevert(mode: 'save' | 'revert', group: GroupIdentifier, options?: ISaveOptions | IRevertOptions): Promise<void> {
		const items = this._viewModel.currentValue?.items.get();
		if (items) {
			await Promise.all(items.map(async item => {
				const model = item.diffEditorViewModel.model;
				const handleOriginal = model.original.uri.scheme !== Schemas.untitled && this._textFileService.isDirty(model.original.uri); // match diff editor behaviour

				await Promise.all([
					handleOriginal ? mode === 'save' ? this._textFileService.save(model.original.uri, options) : this._textFileService.revert(model.original.uri, options) : Promise.resolve(),
					mode === 'save' ? this._textFileService.save(model.modified.uri, options) : this._textFileService.revert(model.modified.uri, options),
				]);
			}));
		}
		return undefined;
	}

	override readonly closeHandler: IEditorCloseHandler;
}

export interface IDocumentDiffItemWithMultiDiffEditorItem extends IDocumentDiffItem {
	multiDiffEditorItem: MultiDiffEditorItem;
}

/**
 * Uses a map to efficiently dispatch events to listeners that are interested in a specific key.
*/
class FastEventDispatcher<T, TKey> {
	private _count = 0;
	private readonly _buckets = new Map<string, Set<(value: T) => void>>();

	private _eventSubscription: IDisposable | undefined;

	constructor(
		private readonly _event: Event<T>,
		private readonly _getEventArgsKey: (item: T) => string,
		private readonly _keyToString: (key: TKey) => string,
	) {
	}

	public filteredEvent(filter: TKey): (listener: (e: T) => unknown) => IDisposable {
		return listener => {
			const key = this._keyToString(filter);
			let bucket = this._buckets.get(key);
			if (!bucket) {
				bucket = new Set();
				this._buckets.set(key, bucket);
			}
			bucket.add(listener);

			this._count++;
			if (this._count === 1) {
				this._eventSubscription = this._event(this._handleEventChange);
			}

			return {
				dispose: () => {
					bucket!.delete(listener);
					if (bucket!.size === 0) {
						this._buckets.delete(key);
					}
					this._count--;

					if (this._count === 0) {
						this._eventSubscription?.dispose();
						this._eventSubscription = undefined;
					}
				}
			};
		};
	}

	private readonly _handleEventChange = (e: T) => {
		const key = this._getEventArgsKey(e);
		const bucket = this._buckets.get(key);
		if (bucket) {
			for (const listener of bucket) {
				listener(e);
			}
		}
	};
}

function isUriDirty(onDidChangeDirty: FastEventDispatcher<ITextFileEditorModel, URI>, textFileService: ITextFileService, uri: URI) {
	return observableFromEvent(onDidChangeDirty.filteredEvent(uri), () => textFileService.isDirty(uri));
}

function getReadonlyConfiguration(isReadonly: boolean | IMarkdownString | undefined): { readOnly: boolean; readOnlyMessage: IMarkdownString | undefined } {
	return {
		readOnly: !!isReadonly,
		readOnlyMessage: typeof isReadonly !== 'boolean' ? isReadonly : undefined
	};
}

function computeOptions(configuration: IEditorConfiguration): IDiffEditorOptions {
	const editorConfiguration = deepClone(configuration.editor);

	// Handle diff editor specially by merging in diffEditor configuration
	if (isObject(configuration.diffEditor)) {
		const diffEditorConfiguration: IDiffEditorOptions = deepClone(configuration.diffEditor);

		// User settings defines `diffEditor.codeLens`, but here we rename that to `diffEditor.diffCodeLens` to avoid collisions with `editor.codeLens`.
		diffEditorConfiguration.diffCodeLens = diffEditorConfiguration.codeLens;
		delete diffEditorConfiguration.codeLens;

		// User settings defines `diffEditor.wordWrap`, but here we rename that to `diffEditor.diffWordWrap` to avoid collisions with `editor.wordWrap`.
		diffEditorConfiguration.diffWordWrap = <'off' | 'on' | 'inherit' | undefined>diffEditorConfiguration.wordWrap;
		delete diffEditorConfiguration.wordWrap;

		Object.assign(editorConfiguration, diffEditorConfiguration);
	}
	return editorConfiguration;
}

export class MultiDiffEditorResolverContribution extends Disposable {

	static readonly ID = 'workbench.contrib.multiDiffEditorResolver';

	constructor(
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();

		this._register(editorResolverService.registerEditor(
			`*`,
			{
				id: DEFAULT_EDITOR_ASSOCIATION.id,
				label: DEFAULT_EDITOR_ASSOCIATION.displayName,
				detail: DEFAULT_EDITOR_ASSOCIATION.providerDisplayName,
				priority: RegisteredEditorPriority.builtin
			},
			{},
			{
				createMultiDiffEditorInput: (multiDiffEditor: IResourceMultiDiffEditorInput): EditorInputWithOptions => {
					return {
						editor: MultiDiffEditorInput.fromResourceMultiDiffEditorInput(multiDiffEditor, instantiationService),
					};
				},
			}
		));
	}
}

interface ISerializedMultiDiffEditorInput {
	multiDiffSourceUri: string;
	label: string | undefined;
	resources: {
		originalUri: string | undefined;
		modifiedUri: string | undefined;
		goToFileUri: string | undefined;
	}[] | undefined;
}

export class MultiDiffEditorSerializer implements IEditorSerializer {

	canSerialize(editor: EditorInput): editor is MultiDiffEditorInput {
		return editor instanceof MultiDiffEditorInput && !editor.isTransient;
	}

	serialize(editor: MultiDiffEditorInput): string | undefined {
		if (!this.canSerialize(editor)) {
			return undefined;
		}

		return JSON.stringify(editor.serialize());
	}

	deserialize(instantiationService: IInstantiationService, serializedEditor: string): EditorInput | undefined {
		try {
			const data = parse(serializedEditor) as ISerializedMultiDiffEditorInput;
			return MultiDiffEditorInput.fromSerialized(data, instantiationService);
		} catch (err) {
			onUnexpectedError(err);
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffSourceResolverService.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/multiDiffSourceResolverService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BugIndicatingError } from '../../../../base/common/errors.js';
import { IValueWithChangeEvent } from '../../../../base/common/event.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ContextKeyValue } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IMultiDiffSourceResolverService = createDecorator<IMultiDiffSourceResolverService>('multiDiffSourceResolverService');

export interface IMultiDiffSourceResolverService {
	readonly _serviceBrand: undefined;

	registerResolver(resolver: IMultiDiffSourceResolver): IDisposable;

	resolve(uri: URI): Promise<IResolvedMultiDiffSource | undefined>;
}

export interface IMultiDiffSourceResolver {
	canHandleUri(uri: URI): boolean;

	resolveDiffSource(uri: URI): Promise<IResolvedMultiDiffSource>;
}

export interface IResolvedMultiDiffSource {
	readonly resources: IValueWithChangeEvent<readonly MultiDiffEditorItem[]>;
	readonly contextKeys?: Record<string, ContextKeyValue>;
}

export class MultiDiffEditorItem {
	constructor(
		readonly originalUri: URI | undefined,
		readonly modifiedUri: URI | undefined,
		readonly goToFileUri: URI | undefined,
		readonly goToFileEditorTitle?: string | undefined,
		readonly contextKeys?: Record<string, ContextKeyValue>
	) {
		if (!originalUri && !modifiedUri) {
			throw new BugIndicatingError('Invalid arguments');
		}
	}

	getKey(): string {
		return JSON.stringify([this.modifiedUri?.toString(), this.originalUri?.toString()]);
	}
}

export class MultiDiffSourceResolverService implements IMultiDiffSourceResolverService {
	public readonly _serviceBrand: undefined;

	private readonly _resolvers = new Set<IMultiDiffSourceResolver>();

	registerResolver(resolver: IMultiDiffSourceResolver): IDisposable {
		// throw on duplicate
		if (this._resolvers.has(resolver)) {
			throw new BugIndicatingError('Duplicate resolver');
		}
		this._resolvers.add(resolver);
		return toDisposable(() => this._resolvers.delete(resolver));
	}

	resolve(uri: URI): Promise<IResolvedMultiDiffSource | undefined> {
		for (const resolver of this._resolvers) {
			if (resolver.canHandleUri(uri)) {
				return resolver.resolveDiffSource(uri);
			}
		}
		return Promise.resolve(undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/multiDiffEditor/browser/scmMultiDiffSourceResolver.ts]---
Location: vscode-main/src/vs/workbench/contrib/multiDiffEditor/browser/scmMultiDiffSourceResolver.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ValueWithChangeEvent } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { observableFromEvent, ValueWithChangeEventFromObservable, waitForState } from '../../../../base/common/observable.js';
import { basename } from '../../../../base/common/path.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IMultiDiffEditorOptions } from '../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js';
import { localize2 } from '../../../../nls.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyValue } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IActivityService, ProgressBadge } from '../../../services/activity/common/activity.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ISCMProvider, ISCMRepository, ISCMResourceGroup, ISCMService } from '../../scm/common/scm.js';
import { IMultiDiffSourceResolver, IMultiDiffSourceResolverService, IResolvedMultiDiffSource, MultiDiffEditorItem } from './multiDiffSourceResolverService.js';

export class ScmMultiDiffSourceResolver implements IMultiDiffSourceResolver {
	private static readonly _scheme = 'scm-multi-diff-source';

	public static getMultiDiffSourceUri(repositoryUri: string, groupId: string): URI {
		return URI.from({
			scheme: ScmMultiDiffSourceResolver._scheme,
			query: JSON.stringify({ repositoryUri, groupId } satisfies UriFields),
		});
	}

	private static parseUri(uri: URI): { repositoryUri: URI; groupId: string } | undefined {
		if (uri.scheme !== ScmMultiDiffSourceResolver._scheme) {
			return undefined;
		}

		let query: UriFields;
		try {
			query = JSON.parse(uri.query) as UriFields;
		} catch (e) {
			return undefined;
		}

		if (typeof query !== 'object' || query === null) {
			return undefined;
		}

		const { repositoryUri, groupId } = query;
		if (typeof repositoryUri !== 'string' || typeof groupId !== 'string') {
			return undefined;
		}

		return { repositoryUri: URI.parse(repositoryUri), groupId };
	}

	constructor(
		@ISCMService private readonly _scmService: ISCMService,
		@IActivityService private readonly _activityService: IActivityService,
	) {
	}

	canHandleUri(uri: URI): boolean {
		return ScmMultiDiffSourceResolver.parseUri(uri) !== undefined;
	}

	async resolveDiffSource(uri: URI): Promise<IResolvedMultiDiffSource> {
		const { repositoryUri, groupId } = ScmMultiDiffSourceResolver.parseUri(uri)!;

		const repository = await waitForState(observableFromEvent(this,
			this._scmService.onDidAddRepository,
			() => [...this._scmService.repositories].find(r => r.provider.rootUri?.toString() === repositoryUri.toString()))
		);
		const group = await waitForState(observableFromEvent(this,
			repository.provider.onDidChangeResourceGroups,
			() => repository.provider.groups.find(g => g.id === groupId)
		));

		const scmActivities = observableFromEvent(
			this._activityService.onDidChangeActivity,
			() => [...this._activityService.getViewContainerActivities('workbench.view.scm')],
		);
		const scmViewHasNoProgressBadge = scmActivities.map(activities => !activities.some(a => a.badge instanceof ProgressBadge));
		await waitForState(scmViewHasNoProgressBadge, v => v);

		return new ScmResolvedMultiDiffSource(group, repository);
	}
}

interface ScmHistoryItemUriFields {
	readonly repositoryId: string;
	readonly historyItemId: string;
	readonly historyItemParentId?: string;
	readonly historyItemDisplayId?: string;
}

export class ScmHistoryItemResolver implements IMultiDiffSourceResolver {
	static readonly scheme = 'scm-history-item';

	public static getMultiDiffSourceUri(provider: ISCMProvider, historyItemId: string, historyItemParentId: string | undefined, historyItemDisplayId: string | undefined): URI {
		return URI.from({
			scheme: ScmHistoryItemResolver.scheme,
			path: provider.rootUri?.fsPath,
			query: JSON.stringify({
				repositoryId: provider.id,
				historyItemId,
				historyItemParentId,
				historyItemDisplayId
			} satisfies ScmHistoryItemUriFields)
		}, true);
	}

	public static parseUri(uri: URI): ScmHistoryItemUriFields | undefined {
		if (uri.scheme !== ScmHistoryItemResolver.scheme) {
			return undefined;
		}

		let query: ScmHistoryItemUriFields;
		try {
			query = JSON.parse(uri.query) as ScmHistoryItemUriFields;
		} catch (e) {
			return undefined;
		}

		if (typeof query !== 'object' || query === null) {
			return undefined;
		}

		const { repositoryId, historyItemId, historyItemParentId, historyItemDisplayId } = query;
		if (typeof repositoryId !== 'string' || typeof historyItemId !== 'string' ||
			(typeof historyItemParentId !== 'string' && historyItemParentId !== undefined) ||
			(typeof historyItemDisplayId !== 'string' && historyItemDisplayId !== undefined)) {
			return undefined;
		}

		return { repositoryId, historyItemId, historyItemParentId, historyItemDisplayId };
	}

	constructor(@ISCMService private readonly _scmService: ISCMService) { }

	canHandleUri(uri: URI): boolean {
		return ScmHistoryItemResolver.parseUri(uri) !== undefined;
	}

	async resolveDiffSource(uri: URI): Promise<IResolvedMultiDiffSource> {
		const { repositoryId, historyItemId, historyItemParentId, historyItemDisplayId } = ScmHistoryItemResolver.parseUri(uri)!;

		const repository = this._scmService.getRepository(repositoryId);
		const historyProvider = repository?.provider.historyProvider.get();
		const historyItemChanges = await historyProvider?.provideHistoryItemChanges(historyItemId, historyItemParentId) ?? [];

		const resources = ValueWithChangeEvent.const<readonly MultiDiffEditorItem[]>(
			historyItemChanges.map(change => {
				const goToFileEditorTitle = change.modifiedUri
					? `${basename(change.modifiedUri.fsPath)} (${historyItemDisplayId ?? historyItemId})`
					: undefined;

				return new MultiDiffEditorItem(change.originalUri, change.modifiedUri, change.modifiedUri, goToFileEditorTitle);
			})
		);

		return { resources };
	}
}

class ScmResolvedMultiDiffSource implements IResolvedMultiDiffSource {
	private readonly _resources;
	readonly resources;

	public readonly contextKeys: Record<string, ContextKeyValue>;

	constructor(
		private readonly _group: ISCMResourceGroup,
		private readonly _repository: ISCMRepository,
	) {
		this._resources = observableFromEvent<MultiDiffEditorItem[]>(
			this._group.onDidChangeResources,
			() => /** @description resources */ this._group.resources.map(e => new MultiDiffEditorItem(e.multiDiffEditorOriginalUri, e.multiDiffEditorModifiedUri, e.sourceUri))
		);
		this.resources = new ValueWithChangeEventFromObservable(this._resources);
		this.contextKeys = {
			scmResourceGroup: this._group.id,
			scmProvider: this._repository.provider.providerId,
		};
	}
}

interface UriFields {
	repositoryUri: string;
	groupId: string;
}

export class ScmMultiDiffSourceResolverContribution extends Disposable {

	static readonly ID = 'workbench.contrib.scmMultiDiffSourceResolver';

	constructor(
		@IInstantiationService instantiationService: IInstantiationService,
		@IMultiDiffSourceResolverService multiDiffSourceResolverService: IMultiDiffSourceResolverService,
	) {
		super();

		this._register(multiDiffSourceResolverService.registerResolver(instantiationService.createInstance(ScmHistoryItemResolver)));
		this._register(multiDiffSourceResolverService.registerResolver(instantiationService.createInstance(ScmMultiDiffSourceResolver)));
	}
}

interface OpenScmGroupActionOptions {
	title: string;
	repositoryUri: UriComponents;
	resourceGroupId: string;
}

export class OpenScmGroupAction extends Action2 {
	public static async openMultiFileDiffEditor(editorService: IEditorService, label: string, repositoryRootUri: URI | undefined, resourceGroupId: string, options?: IMultiDiffEditorOptions) {
		if (!repositoryRootUri) {
			return;
		}

		const multiDiffSource = ScmMultiDiffSourceResolver.getMultiDiffSourceUri(repositoryRootUri.toString(), resourceGroupId);
		return await editorService.openEditor({ label, multiDiffSource, options });
	}

	constructor() {
		super({
			id: '_workbench.openScmMultiDiffEditor',
			title: localize2('openChanges', 'Open Changes'),
			f1: false
		});
	}

	async run(accessor: ServicesAccessor, options: OpenScmGroupActionOptions): Promise<void> {
		const editorService = accessor.get(IEditorService);
		await OpenScmGroupAction.openMultiFileDiffEditor(editorService, options.title, URI.revive(options.repositoryUri), options.resourceGroupId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebook.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebook.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { IDisposable, Disposable, DisposableStore, dispose } from '../../../../base/common/lifecycle.js';
import { parse } from '../../../../base/common/marshalling.js';
import { extname, isEqual } from '../../../../base/common/resources.js';
import { assertType } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { toFormattedString } from '../../../../base/common/jsonFormatter.js';
import { ITextModel, ITextBufferFactory, ITextBuffer } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageSelection, ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import * as nls from '../../../../nls.js';
import { Extensions, IConfigurationPropertySchema, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IEditorSerializer, IEditorFactoryRegistry, EditorExtensions } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { NotebookEditor } from './notebookEditor.js';
import { NotebookEditorInput, NotebookEditorInputOptions } from '../common/notebookEditorInput.js';
import { INotebookService } from '../common/notebookService.js';
import { NotebookService } from './services/notebookServiceImpl.js';
import { CellKind, CellUri, IResolvedNotebookEditorModel, NotebookWorkingCopyTypeIdentifier, NotebookSetting, ICellOutput, ICell, NotebookCellsChangeType, NotebookMetadataUri } from '../common/notebookCommon.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { INotebookEditorModelResolverService } from '../common/notebookEditorModelResolverService.js';
import { NotebookDiffEditorInput } from '../common/notebookDiffEditorInput.js';
import { NotebookTextDiffEditor } from './diff/notebookDiffEditor.js';
import { INotebookEditorWorkerService } from '../common/services/notebookWorkerService.js';
import { NotebookEditorWorkerServiceImpl } from './services/notebookWorkerServiceImpl.js';
import { INotebookCellStatusBarService } from '../common/notebookCellStatusBarService.js';
import { NotebookCellStatusBarService } from './services/notebookCellStatusBarServiceImpl.js';
import { INotebookEditorService } from './services/notebookEditorService.js';
import { NotebookEditorWidgetService } from './services/notebookEditorServiceImpl.js';
import { IJSONContributionRegistry, Extensions as JSONExtensions } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { IJSONSchema, IJSONSchemaMap } from '../../../../base/common/jsonSchema.js';
import { Event } from '../../../../base/common/event.js';
import { getFormattedOutputJSON, getStreamOutputData } from './diff/diffElementViewModel.js';
import { NotebookModelResolverServiceImpl } from '../common/notebookEditorModelResolverServiceImpl.js';
import { INotebookKernelHistoryService, INotebookKernelService } from '../common/notebookKernelService.js';
import { NotebookKernelService } from './services/notebookKernelServiceImpl.js';
import { IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { IResourceEditorInput } from '../../../../platform/editor/common/editor.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../services/workingCopy/common/workingCopyEditorService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { NotebookRendererMessagingService } from './services/notebookRendererMessagingServiceImpl.js';
import { INotebookRendererMessagingService } from '../common/notebookRendererMessagingService.js';
import { INotebookCellOutlineDataSourceFactory, NotebookCellOutlineDataSourceFactory } from './viewModel/notebookOutlineDataSourceFactory.js';

// Editor Controller
import './controller/coreActions.js';
import './controller/insertCellActions.js';
import './controller/executeActions.js';
import './controller/sectionActions.js';
import './controller/layoutActions.js';
import './controller/editActions.js';
import './controller/cellOutputActions.js';
import './controller/apiActions.js';
import './controller/foldingController.js';
import './controller/chat/notebook.chat.contribution.js';
import './controller/variablesActions.js';

// Editor Contribution
import './contrib/editorHint/emptyCellEditorHint.js';
import './contrib/clipboard/notebookClipboard.js';
import './contrib/find/notebookFind.js';
import './contrib/format/formatting.js';
import './contrib/saveParticipants/saveParticipants.js';
import './contrib/gettingStarted/notebookGettingStarted.js';
import './contrib/layout/layoutActions.js';
import './contrib/marker/markerProvider.js';
import './contrib/navigation/arrow.js';
import './contrib/outline/notebookOutline.js';
import './contrib/profile/notebookProfile.js';
import './contrib/cellStatusBar/statusBarProviders.js';
import './contrib/cellStatusBar/contributedStatusBarItemController.js';
import './contrib/cellStatusBar/executionStatusBarItemController.js';
import './contrib/editorStatusBar/editorStatusBar.js';
import './contrib/undoRedo/notebookUndoRedo.js';
import './contrib/cellCommands/cellCommands.js';
import './contrib/viewportWarmup/viewportWarmup.js';
import './contrib/troubleshoot/layout.js';
import './contrib/debug/notebookBreakpoints.js';
import './contrib/debug/notebookCellPausing.js';
import './contrib/debug/notebookDebugDecorations.js';
import './contrib/execute/executionEditorProgress.js';
import './contrib/kernelDetection/notebookKernelDetection.js';
import './contrib/cellDiagnostics/cellDiagnostics.js';
import './contrib/multicursor/notebookMulticursor.js';
import './contrib/multicursor/notebookSelectionHighlight.js';
import './contrib/notebookVariables/notebookInlineVariables.js';

// Diff Editor Contribution
import './diff/notebookDiffActions.js';

// Services
import { editorOptionsRegistry } from '../../../../editor/common/config/editorOptions.js';
import { NotebookExecutionStateService } from './services/notebookExecutionStateServiceImpl.js';
import { NotebookExecutionService } from './services/notebookExecutionServiceImpl.js';
import { INotebookExecutionService } from '../common/notebookExecutionService.js';
import { INotebookKeymapService } from '../common/notebookKeymapService.js';
import { NotebookKeymapService } from './services/notebookKeymapServiceImpl.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { INotebookExecutionStateService } from '../common/notebookExecutionStateService.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { NotebookInfo } from '../../../../editor/common/languageFeatureRegistry.js';
import { COMMENTEDITOR_DECORATION_KEY } from '../../comments/browser/commentReply.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { NotebookKernelHistoryService } from './services/notebookKernelHistoryServiceImpl.js';
import { INotebookLoggingService } from '../common/notebookLoggingService.js';
import { NotebookLoggingService } from './services/notebookLoggingServiceImpl.js';
import product from '../../../../platform/product/common/product.js';
import { NotebookVariables } from './contrib/notebookVariables/notebookVariables.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { NotebookAccessibilityHelp } from './notebookAccessibilityHelp.js';
import { NotebookAccessibleView } from './notebookAccessibleView.js';
import { DefaultFormatter } from '../../format/browser/formatActionsMultiple.js';
import { NotebookMultiTextDiffEditor } from './diff/notebookMultiDiffEditor.js';
import { NotebookMultiDiffEditorInput } from './diff/notebookMultiDiffEditorInput.js';
import { getFormattedMetadataJSON } from '../common/model/notebookCellTextModel.js';
import { INotebookOutlineEntryFactory, NotebookOutlineEntryFactory } from './viewModel/notebookOutlineEntryFactory.js';
import { getFormattedNotebookMetadataJSON } from '../common/model/notebookMetadataTextModel.js';
import { NotebookOutputEditor } from './outputEditor/notebookOutputEditor.js';
import { NotebookOutputEditorInput } from './outputEditor/notebookOutputEditorInput.js';

/*--------------------------------------------------------------------------------------------- */

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		NotebookEditor,
		NotebookEditor.ID,
		'Notebook Editor'
	),
	[
		new SyncDescriptor(NotebookEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		NotebookTextDiffEditor,
		NotebookTextDiffEditor.ID,
		'Notebook Diff Editor'
	),
	[
		new SyncDescriptor(NotebookDiffEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		NotebookOutputEditor,
		NotebookOutputEditor.ID,
		'Notebook Output Editor'
	),
	[
		new SyncDescriptor(NotebookOutputEditorInput)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		NotebookMultiTextDiffEditor,
		NotebookMultiTextDiffEditor.ID,
		'Notebook Diff Editor'
	),
	[
		new SyncDescriptor(NotebookMultiDiffEditorInput)
	]
);

class NotebookDiffEditorSerializer implements IEditorSerializer {
	constructor(@IConfigurationService private readonly _configurationService: IConfigurationService) { }
	canSerialize(): boolean {
		return true;
	}

	serialize(input: EditorInput): string {
		assertType(input instanceof NotebookDiffEditorInput);
		return JSON.stringify({
			resource: input.resource,
			originalResource: input.original.resource,
			name: input.getName(),
			originalName: input.original.getName(),
			textDiffName: input.getName(),
			viewType: input.viewType,
		});
	}

	deserialize(instantiationService: IInstantiationService, raw: string) {
		type Data = { resource: URI; originalResource: URI; name: string; originalName: string; viewType: string; textDiffName: string | undefined; group: number };
		const data = <Data>parse(raw);
		if (!data) {
			return undefined;
		}
		const { resource, originalResource, name, viewType } = data;
		if (!data || !URI.isUri(resource) || !URI.isUri(originalResource) || typeof name !== 'string' || typeof viewType !== 'string') {
			return undefined;
		}

		if (this._configurationService.getValue('notebook.experimental.enableNewDiffEditor')) {
			return NotebookMultiDiffEditorInput.create(instantiationService, resource, name, undefined, originalResource, viewType);
		} else {
			return NotebookDiffEditorInput.create(instantiationService, resource, name, undefined, originalResource, viewType);
		}
	}

	static canResolveBackup(editorInput: EditorInput, backupResource: URI): boolean {
		return false;
	}

}
type SerializedNotebookEditorData = { resource: URI; preferredResource: URI; viewType: string; options?: NotebookEditorInputOptions };
class NotebookEditorSerializer implements IEditorSerializer {
	canSerialize(input: EditorInput): boolean {
		return input.typeId === NotebookEditorInput.ID;
	}
	serialize(input: EditorInput): string {
		assertType(input instanceof NotebookEditorInput);
		const data: SerializedNotebookEditorData = {
			resource: input.resource,
			preferredResource: input.preferredResource,
			viewType: input.viewType,
			options: input.options
		};
		return JSON.stringify(data);
	}
	deserialize(instantiationService: IInstantiationService, raw: string) {
		const data = <SerializedNotebookEditorData>parse(raw);
		if (!data) {
			return undefined;
		}
		const { resource, preferredResource, viewType, options } = data;
		if (!data || !URI.isUri(resource) || typeof viewType !== 'string') {
			return undefined;
		}

		const input = NotebookEditorInput.getOrCreate(instantiationService, resource, preferredResource, viewType, options);
		return input;
	}
}

export type SerializedNotebookOutputEditorData = { notebookUri: URI; cellIndex: number; outputIndex: number };
class NotebookOutputEditorSerializer implements IEditorSerializer {
	canSerialize(input: EditorInput): boolean {
		return input.typeId === NotebookOutputEditorInput.ID;
	}
	serialize(input: EditorInput): string | undefined {
		assertType(input instanceof NotebookOutputEditorInput);

		const data = input.getSerializedData(); // in case of cell movement etc get latest indices
		if (!data) {
			return undefined;
		}

		return JSON.stringify(data);
	}
	deserialize(instantiationService: IInstantiationService, raw: string): EditorInput | undefined {
		const data = <SerializedNotebookOutputEditorData>parse(raw);
		if (!data) {
			return undefined;
		}

		const input = instantiationService.createInstance(NotebookOutputEditorInput, data.notebookUri, data.cellIndex, undefined, data.outputIndex);
		return input;
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	NotebookEditorInput.ID,
	NotebookEditorSerializer
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	NotebookDiffEditorInput.ID,
	NotebookDiffEditorSerializer
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	NotebookOutputEditorInput.ID,
	NotebookOutputEditorSerializer
);

export class NotebookContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.notebook';

	private _uriComparisonKeyComputer?: IDisposable;

	constructor(
		@IUndoRedoService undoRedoService: IUndoRedoService,
		@IConfigurationService configurationService: IConfigurationService,
		@ICodeEditorService private readonly codeEditorService: ICodeEditorService,
	) {
		super();

		this.updateCellUndoRedoComparisonKey(configurationService, undoRedoService);

		// Watch for changes to undoRedoPerCell setting
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.undoRedoPerCell)) {
				this.updateCellUndoRedoComparisonKey(configurationService, undoRedoService);
			}
		}));

		// register comment decoration
		this._register(this.codeEditorService.registerDecorationType('comment-controller', COMMENTEDITOR_DECORATION_KEY, {}));
	}

	// Add or remove the cell undo redo comparison key based on the user setting
	private updateCellUndoRedoComparisonKey(configurationService: IConfigurationService, undoRedoService: IUndoRedoService) {
		const undoRedoPerCell = configurationService.getValue<boolean>(NotebookSetting.undoRedoPerCell);

		if (!undoRedoPerCell) {
			// Add comparison key to map cell => main document
			if (!this._uriComparisonKeyComputer) {
				this._uriComparisonKeyComputer = undoRedoService.registerUriComparisonKeyComputer(CellUri.scheme, {
					getComparisonKey: (uri: URI): string => {
						if (undoRedoPerCell) {
							return uri.toString();
						}
						return NotebookContribution._getCellUndoRedoComparisonKey(uri);
					}
				});
			}
		} else {
			// Dispose comparison key
			this._uriComparisonKeyComputer?.dispose();
			this._uriComparisonKeyComputer = undefined;
		}
	}

	private static _getCellUndoRedoComparisonKey(uri: URI) {
		const data = CellUri.parse(uri);
		if (!data) {
			return uri.toString();
		}

		return data.notebook.toString();
	}

	override dispose(): void {
		super.dispose();
		this._uriComparisonKeyComputer?.dispose();
	}
}

class CellContentProvider implements ITextModelContentProvider {

	static readonly ID = 'workbench.contrib.cellContentProvider';

	private readonly _registration: IDisposable;

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@INotebookEditorModelResolverService private readonly _notebookModelResolverService: INotebookEditorModelResolverService,
	) {
		this._registration = textModelService.registerTextModelContentProvider(CellUri.scheme, this);
	}

	dispose(): void {
		this._registration.dispose();
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}
		const data = CellUri.parse(resource);
		// const data = parseCellUri(resource);
		if (!data) {
			return null;
		}

		const ref = await this._notebookModelResolverService.resolve(data.notebook);
		let result: ITextModel | null = null;

		if (!ref.object.isResolved()) {
			return null;
		}

		for (const cell of ref.object.notebook.cells) {
			if (cell.uri.toString() === resource.toString()) {
				const bufferFactory: ITextBufferFactory = {
					create: (defaultEOL) => {
						return { textBuffer: cell.textBuffer as ITextBuffer, disposable: Disposable.None };
					},
					getFirstLineText: (limit: number) => {
						return cell.textBuffer.getLineContent(1).substring(0, limit);
					}
				};
				const languageId = this._languageService.getLanguageIdByLanguageName(cell.language);
				const languageSelection = languageId ? this._languageService.createById(languageId) : (cell.cellKind === CellKind.Markup ? this._languageService.createById('markdown') : this._languageService.createByFilepathOrFirstLine(resource, cell.textBuffer.getLineContent(1)));
				result = this._modelService.createModel(
					bufferFactory,
					languageSelection,
					resource
				);
				break;
			}
		}

		if (!result) {
			ref.dispose();
			return null;
		}

		const once = Event.any(result.onWillDispose, ref.object.notebook.onWillDispose)(() => {
			once.dispose();
			ref.dispose();
		});

		return result;
	}
}

class CellInfoContentProvider {

	static readonly ID = 'workbench.contrib.cellInfoContentProvider';

	private readonly _disposables: IDisposable[] = [];

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILabelService private readonly _labelService: ILabelService,
		@INotebookEditorModelResolverService private readonly _notebookModelResolverService: INotebookEditorModelResolverService,
	) {
		this._disposables.push(textModelService.registerTextModelContentProvider(Schemas.vscodeNotebookCellMetadata, {
			provideTextContent: this.provideMetadataTextContent.bind(this)
		}));

		this._disposables.push(textModelService.registerTextModelContentProvider(Schemas.vscodeNotebookCellOutput, {
			provideTextContent: this.provideOutputTextContent.bind(this)
		}));

		this._disposables.push(this._labelService.registerFormatter({
			scheme: Schemas.vscodeNotebookCellMetadata,
			formatting: {
				label: '${path} (metadata)',
				separator: '/'
			}
		}));

		this._disposables.push(this._labelService.registerFormatter({
			scheme: Schemas.vscodeNotebookCellOutput,
			formatting: {
				label: '${path} (output)',
				separator: '/'
			}
		}));
	}

	dispose(): void {
		dispose(this._disposables);
	}

	async provideMetadataTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}

		const data = CellUri.parseCellPropertyUri(resource, Schemas.vscodeNotebookCellMetadata);
		if (!data) {
			return null;
		}

		const ref = await this._notebookModelResolverService.resolve(data.notebook);
		let result: ITextModel | null = null;

		const mode = this._languageService.createById('json');
		const disposables = new DisposableStore();
		for (const cell of ref.object.notebook.cells) {
			if (cell.handle === data.handle) {
				const cellIndex = ref.object.notebook.cells.indexOf(cell);
				const metadataSource = getFormattedMetadataJSON(ref.object.notebook.transientOptions.transientCellMetadata, cell.metadata, cell.language, true);
				result = this._modelService.createModel(
					metadataSource,
					mode,
					resource
				);
				this._disposables.push(disposables.add(ref.object.notebook.onDidChangeContent(e => {
					if (result && e.rawEvents.some(event => (event.kind === NotebookCellsChangeType.ChangeCellMetadata || event.kind === NotebookCellsChangeType.ChangeCellLanguage) && event.index === cellIndex)) {
						const value = getFormattedMetadataJSON(ref.object.notebook.transientOptions.transientCellMetadata, cell.metadata, cell.language, true);
						if (result.getValue() !== value) {
							result.setValue(value);
						}
					}
				})));
				break;
			}
		}

		if (!result) {
			ref.dispose();
			return null;
		}

		const once = result.onWillDispose(() => {
			disposables.dispose();
			once.dispose();
			ref.dispose();
		});

		return result;
	}

	private parseStreamOutput(op?: ICellOutput): { content: string; mode: ILanguageSelection } | undefined {
		if (!op) {
			return;
		}

		const streamOutputData = getStreamOutputData(op.outputs);
		if (streamOutputData) {
			return {
				content: streamOutputData,
				mode: this._languageService.createById(PLAINTEXT_LANGUAGE_ID)
			};
		}

		return;
	}

	private _getResult(data: {
		notebook: URI;
		outputId?: string | undefined;
	}, cell: ICell) {
		let result: { content: string; mode: ILanguageSelection } | undefined = undefined;

		const mode = this._languageService.createById('json');
		const op = cell.outputs.find(op => op.outputId === data.outputId || op.alternativeOutputId === data.outputId);
		const streamOutputData = this.parseStreamOutput(op);
		if (streamOutputData) {
			result = streamOutputData;
			return result;
		}

		const obj = cell.outputs.map(output => ({
			metadata: output.metadata,
			outputItems: output.outputs.map(opit => ({
				mimeType: opit.mime,
				data: opit.data.toString()
			}))
		}));

		const outputSource = toFormattedString(obj, {});
		result = {
			content: outputSource,
			mode
		};

		return result;
	}

	async provideOutputsTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}

		const data = CellUri.parseCellPropertyUri(resource, Schemas.vscodeNotebookCellOutput);
		if (!data) {
			return null;
		}

		const ref = await this._notebookModelResolverService.resolve(data.notebook);
		const cell = ref.object.notebook.cells.find(cell => cell.handle === data.handle);

		if (!cell) {
			ref.dispose();
			return null;
		}

		const mode = this._languageService.createById('json');
		const model = this._modelService.createModel(getFormattedOutputJSON(cell.outputs || []), mode, resource, true);
		const cellModelListener = Event.any(cell.onDidChangeOutputs ?? Event.None, cell.onDidChangeOutputItems ?? Event.None)(() => {
			model.setValue(getFormattedOutputJSON(cell.outputs || []));
		});

		const once = model.onWillDispose(() => {
			once.dispose();
			cellModelListener.dispose();
			ref.dispose();
		});

		return model;
	}

	async provideOutputTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}

		const data = CellUri.parseCellOutputUri(resource);
		if (!data) {
			return this.provideOutputsTextContent(resource);
		}

		const ref = await this._notebookModelResolverService.resolve(data.notebook);
		const cell = ref.object.notebook.cells.find(cell => !!cell.outputs.find(op => op.outputId === data.outputId || op.alternativeOutputId === data.outputId));

		if (!cell) {
			ref.dispose();
			return null;
		}

		const result = this._getResult(data, cell);

		if (!result) {
			ref.dispose();
			return null;
		}

		const model = this._modelService.createModel(result.content, result.mode, resource);
		const cellModelListener = Event.any(cell.onDidChangeOutputs ?? Event.None, cell.onDidChangeOutputItems ?? Event.None)(() => {
			const newResult = this._getResult(data, cell);

			if (!newResult) {
				return;
			}

			model.setValue(newResult.content);
			model.setLanguage(newResult.mode.languageId);
		});

		const once = model.onWillDispose(() => {
			once.dispose();
			cellModelListener.dispose();
			ref.dispose();
		});

		return model;
	}
}

class NotebookMetadataContentProvider {
	static readonly ID = 'workbench.contrib.notebookMetadataContentProvider';

	private readonly _disposables: IDisposable[] = [];

	constructor(
		@ITextModelService textModelService: ITextModelService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILabelService private readonly _labelService: ILabelService,
		@INotebookEditorModelResolverService private readonly _notebookModelResolverService: INotebookEditorModelResolverService,
	) {
		this._disposables.push(textModelService.registerTextModelContentProvider(Schemas.vscodeNotebookMetadata, {
			provideTextContent: this.provideMetadataTextContent.bind(this)
		}));

		this._disposables.push(this._labelService.registerFormatter({
			scheme: Schemas.vscodeNotebookMetadata,
			formatting: {
				label: '${path} (metadata)',
				separator: '/'
			}
		}));
	}

	dispose(): void {
		dispose(this._disposables);
	}

	async provideMetadataTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this._modelService.getModel(resource);
		if (existing) {
			return existing;
		}

		const data = NotebookMetadataUri.parse(resource);
		if (!data) {
			return null;
		}

		const ref = await this._notebookModelResolverService.resolve(data);
		let result: ITextModel | null = null;

		const mode = this._languageService.createById('json');
		const disposables = new DisposableStore();
		const metadataSource = getFormattedNotebookMetadataJSON(ref.object.notebook.transientOptions.transientDocumentMetadata, ref.object.notebook.metadata);
		result = this._modelService.createModel(
			metadataSource,
			mode,
			resource
		);

		if (!result) {
			ref.dispose();
			return null;
		}

		this._disposables.push(disposables.add(ref.object.notebook.onDidChangeContent(e => {
			if (result && e.rawEvents.some(event => (event.kind === NotebookCellsChangeType.ChangeCellContent || event.kind === NotebookCellsChangeType.ChangeDocumentMetadata || event.kind === NotebookCellsChangeType.ModelChange))) {
				const value = getFormattedNotebookMetadataJSON(ref.object.notebook.transientOptions.transientDocumentMetadata, ref.object.notebook.metadata);
				if (result.getValue() !== value) {
					result.setValue(value);
				}
			}
		})));

		const once = result.onWillDispose(() => {
			disposables.dispose();
			once.dispose();
			ref.dispose();
		});

		return result;
	}
}

class RegisterSchemasContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.registerCellSchemas';

	constructor() {
		super();
		this.registerMetadataSchemas();
	}

	private registerMetadataSchemas(): void {
		const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
		const metadataSchema: IJSONSchema = {
			properties: {
				['language']: {
					type: 'string',
					description: 'The language for the cell'
				}
			},
			// patternProperties: allSettings.patternProperties,
			additionalProperties: true,
			allowTrailingCommas: true,
			allowComments: true
		};

		jsonRegistry.registerSchema('vscode://schemas/notebook/cellmetadata', metadataSchema);
	}
}

class NotebookEditorManager implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.notebookEditorManager';

	private readonly _disposables = new DisposableStore();

	constructor(
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookEditorModelResolverService private readonly _notebookEditorModelService: INotebookEditorModelResolverService,
		@IEditorGroupsService editorGroups: IEditorGroupsService
	) {
		// OPEN notebook editor for models that have turned dirty without being visible in an editor
		type E = IResolvedNotebookEditorModel;
		this._disposables.add(Event.debounce<E, E[]>(
			this._notebookEditorModelService.onDidChangeDirty,
			(last, current) => !last ? [current] : [...last, current],
			100
		)(this._openMissingDirtyNotebookEditors, this));

		// CLOSE editors when we are about to open conflicting notebooks
		this._disposables.add(_notebookEditorModelService.onWillFailWithConflict(e => {
			for (const group of editorGroups.groups) {
				const conflictInputs = group.editors.filter(input => input instanceof NotebookEditorInput && input.viewType !== e.viewType && isEqual(input.resource, e.resource));
				const p = group.closeEditors(conflictInputs);
				e.waitUntil(p);
			}
		}));
	}

	dispose(): void {
		this._disposables.dispose();
	}

	private _openMissingDirtyNotebookEditors(models: IResolvedNotebookEditorModel[]): void {
		const result: IResourceEditorInput[] = [];
		for (const model of models) {
			if (model.isDirty() && !this._editorService.isOpened({ resource: model.resource, typeId: NotebookEditorInput.ID, editorId: model.viewType }) && extname(model.resource) !== '.interactive') {
				result.push({
					resource: model.resource,
					options: { inactive: true, preserveFocus: true, pinned: true, override: model.viewType }
				});
			}
		}
		if (result.length > 0) {
			this._editorService.openEditors(result);
		}
	}
}

class SimpleNotebookWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.simpleNotebookWorkingCopyEditorHandler';

	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkingCopyEditorService private readonly _workingCopyEditorService: IWorkingCopyEditorService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@INotebookService private readonly _notebookService: INotebookService
	) {
		super();

		this._installHandler();
	}

	async handles(workingCopy: IWorkingCopyIdentifier): Promise<boolean> {
		const viewType = this.handlesSync(workingCopy);
		if (!viewType) {
			return false;
		}

		return this._notebookService.canResolve(viewType);
	}

	private handlesSync(workingCopy: IWorkingCopyIdentifier): string /* viewType */ | undefined {
		const viewType = this._getViewType(workingCopy);
		if (!viewType || viewType === 'interactive') {
			return undefined;
		}

		return viewType;
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handlesSync(workingCopy)) {
			return false;
		}

		return editor instanceof NotebookEditorInput && editor.viewType === this._getViewType(workingCopy) && isEqual(workingCopy.resource, editor.resource);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		return NotebookEditorInput.getOrCreate(this._instantiationService, workingCopy.resource, undefined, this._getViewType(workingCopy)!);
	}

	private async _installHandler(): Promise<void> {
		await this._extensionService.whenInstalledExtensionsRegistered();

		this._register(this._workingCopyEditorService.registerHandler(this));
	}

	private _getViewType(workingCopy: IWorkingCopyIdentifier) {
		const notebookType = NotebookWorkingCopyTypeIdentifier.parse(workingCopy.typeId);
		if (notebookType && notebookType.viewType === notebookType.notebookType) {
			return notebookType?.viewType;
		}
		return undefined;
	}
}

class NotebookLanguageSelectorScoreRefine {

	static readonly ID = 'workbench.contrib.notebookLanguageSelectorScoreRefine';

	constructor(
		@INotebookService private readonly _notebookService: INotebookService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		languageFeaturesService.setNotebookTypeResolver(this._getNotebookInfo.bind(this));
	}

	private _getNotebookInfo(uri: URI): NotebookInfo | undefined {
		const cellUri = CellUri.parse(uri);
		if (!cellUri) {
			return undefined;
		}
		const notebook = this._notebookService.getNotebookTextModel(cellUri.notebook);
		if (!notebook) {
			return undefined;
		}
		return {
			uri: notebook.uri,
			type: notebook.viewType
		};
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
registerWorkbenchContribution2(NotebookContribution.ID, NotebookContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(CellContentProvider.ID, CellContentProvider, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(CellInfoContentProvider.ID, CellInfoContentProvider, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(NotebookMetadataContentProvider.ID, NotebookMetadataContentProvider, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(RegisterSchemasContribution.ID, RegisterSchemasContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(NotebookEditorManager.ID, NotebookEditorManager, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(NotebookLanguageSelectorScoreRefine.ID, NotebookLanguageSelectorScoreRefine, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(SimpleNotebookWorkingCopyEditorHandler.ID, SimpleNotebookWorkingCopyEditorHandler, WorkbenchPhase.BlockRestore);
workbenchContributionsRegistry.registerWorkbenchContribution(NotebookVariables, LifecyclePhase.Eventually);

AccessibleViewRegistry.register(new NotebookAccessibleView());
AccessibleViewRegistry.register(new NotebookAccessibilityHelp());

registerSingleton(INotebookService, NotebookService, InstantiationType.Delayed);
registerSingleton(INotebookEditorWorkerService, NotebookEditorWorkerServiceImpl, InstantiationType.Delayed);
registerSingleton(INotebookEditorModelResolverService, NotebookModelResolverServiceImpl, InstantiationType.Delayed);
registerSingleton(INotebookCellStatusBarService, NotebookCellStatusBarService, InstantiationType.Delayed);
registerSingleton(INotebookEditorService, NotebookEditorWidgetService, InstantiationType.Delayed);
registerSingleton(INotebookKernelService, NotebookKernelService, InstantiationType.Delayed);
registerSingleton(INotebookKernelHistoryService, NotebookKernelHistoryService, InstantiationType.Delayed);
registerSingleton(INotebookExecutionService, NotebookExecutionService, InstantiationType.Delayed);
registerSingleton(INotebookExecutionStateService, NotebookExecutionStateService, InstantiationType.Delayed);
registerSingleton(INotebookRendererMessagingService, NotebookRendererMessagingService, InstantiationType.Delayed);
registerSingleton(INotebookKeymapService, NotebookKeymapService, InstantiationType.Delayed);
registerSingleton(INotebookLoggingService, NotebookLoggingService, InstantiationType.Delayed);
registerSingleton(INotebookCellOutlineDataSourceFactory, NotebookCellOutlineDataSourceFactory, InstantiationType.Delayed);
registerSingleton(INotebookOutlineEntryFactory, NotebookOutlineEntryFactory, InstantiationType.Delayed);

const schemas: IJSONSchemaMap = {};
function isConfigurationPropertySchema(x: IConfigurationPropertySchema | { [path: string]: IConfigurationPropertySchema }): x is IConfigurationPropertySchema {
	return (typeof x.type !== 'undefined' || typeof x.anyOf !== 'undefined');
}
for (const editorOption of editorOptionsRegistry) {
	const schema = editorOption.schema;
	if (schema) {
		if (isConfigurationPropertySchema(schema)) {
			schemas[`editor.${editorOption.name}`] = schema;
		} else {
			for (const key in schema) {
				if (Object.hasOwnProperty.call(schema, key)) {
					schemas[key] = schema[key];
				}
			}
		}
	}
}

const editorOptionsCustomizationSchema: IConfigurationPropertySchema = {
	description: nls.localize('notebook.editorOptions.experimentalCustomization', 'Settings for code editors used in notebooks. This can be used to customize most editor.* settings.'),
	default: {},
	allOf: [
		{
			properties: schemas,
		}
		// , {
		// 	patternProperties: {
		// 		'^\\[.*\\]$': {
		// 			type: 'object',
		// 			default: {},
		// 			properties: schemas
		// 		}
		// 	}
		// }
	],
	tags: ['notebookLayout']
};

const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'notebook',
	order: 100,
	title: nls.localize('notebookConfigurationTitle', "Notebook"),
	type: 'object',
	properties: {
		[NotebookSetting.displayOrder]: {
			description: nls.localize('notebook.displayOrder.description', "Priority list for output mime types"),
			type: 'array',
			items: {
				type: 'string'
			},
			default: []
		},
		[NotebookSetting.cellToolbarLocation]: {
			description: nls.localize('notebook.cellToolbarLocation.description', "Where the cell toolbar should be shown, or whether it should be hidden."),
			type: 'object',
			additionalProperties: {
				markdownDescription: nls.localize('notebook.cellToolbarLocation.viewType', "Configure the cell toolbar position for for specific file types"),
				type: 'string',
				enum: ['left', 'right', 'hidden']
			},
			default: {
				'default': 'right'
			},
			tags: ['notebookLayout']
		},
		[NotebookSetting.showCellStatusBar]: {
			description: nls.localize('notebook.showCellStatusbar.description', "Whether the cell status bar should be shown."),
			type: 'string',
			enum: ['hidden', 'visible', 'visibleAfterExecute'],
			enumDescriptions: [
				nls.localize('notebook.showCellStatusbar.hidden.description', "The cell status bar is always hidden."),
				nls.localize('notebook.showCellStatusbar.visible.description', "The cell status bar is always visible."),
				nls.localize('notebook.showCellStatusbar.visibleAfterExecute.description', "The cell status bar is hidden until the cell has executed. Then it becomes visible to show the execution status.")],
			default: 'visible',
			tags: ['notebookLayout']
		},
		[NotebookSetting.cellExecutionTimeVerbosity]: {
			description: nls.localize('notebook.cellExecutionTimeVerbosity.description', "Controls the verbosity of the cell execution time in the cell status bar."),
			type: 'string',
			enum: ['default', 'verbose'],
			enumDescriptions: [
				nls.localize('notebook.cellExecutionTimeVerbosity.default.description', "The cell execution duration is visible, with advanced information in the hover tooltip."),
				nls.localize('notebook.cellExecutionTimeVerbosity.verbose.description', "The cell last execution timestamp and duration are visible, with advanced information in the hover tooltip.")],
			default: 'default',
			tags: ['notebookLayout']
		},
		[NotebookSetting.textDiffEditorPreview]: {
			description: nls.localize('notebook.diff.enablePreview.description', "Whether to use the enhanced text diff editor for notebook."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		[NotebookSetting.diffOverviewRuler]: {
			description: nls.localize('notebook.diff.enableOverviewRuler.description', "Whether to render the overview ruler in the diff editor for notebook."),
			type: 'boolean',
			default: false,
			tags: ['notebookLayout']
		},
		[NotebookSetting.cellToolbarVisibility]: {
			markdownDescription: nls.localize('notebook.cellToolbarVisibility.description', "Whether the cell toolbar should appear on hover or click."),
			type: 'string',
			enum: ['hover', 'click'],
			default: 'click',
			tags: ['notebookLayout']
		},
		[NotebookSetting.undoRedoPerCell]: {
			description: nls.localize('notebook.undoRedoPerCell.description', "Whether to use separate undo/redo stack for each cell."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		[NotebookSetting.compactView]: {
			description: nls.localize('notebook.compactView.description', "Control whether the notebook editor should be rendered in a compact form. For example, when turned on, it will decrease the left margin width."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		[NotebookSetting.focusIndicator]: {
			description: nls.localize('notebook.focusIndicator.description', "Controls where the focus indicator is rendered, either along the cell borders or on the left gutter."),
			type: 'string',
			enum: ['border', 'gutter'],
			default: 'gutter',
			tags: ['notebookLayout']
		},
		[NotebookSetting.insertToolbarLocation]: {
			description: nls.localize('notebook.insertToolbarPosition.description', "Control where the insert cell actions should appear."),
			type: 'string',
			enum: ['betweenCells', 'notebookToolbar', 'both', 'hidden'],
			enumDescriptions: [
				nls.localize('insertToolbarLocation.betweenCells', "A toolbar that appears on hover between cells."),
				nls.localize('insertToolbarLocation.notebookToolbar', "The toolbar at the top of the notebook editor."),
				nls.localize('insertToolbarLocation.both', "Both toolbars."),
				nls.localize('insertToolbarLocation.hidden', "The insert actions don't appear anywhere."),
			],
			default: 'both',
			tags: ['notebookLayout']
		},
		[NotebookSetting.globalToolbar]: {
			description: nls.localize('notebook.globalToolbar.description', "Control whether to render a global toolbar inside the notebook editor."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		[NotebookSetting.stickyScrollEnabled]: {
			description: nls.localize('notebook.stickyScrollEnabled.description', "Experimental. Control whether to render notebook Sticky Scroll headers in the notebook editor."),
			type: 'boolean',
			default: false,
			tags: ['notebookLayout']
		},
		[NotebookSetting.stickyScrollMode]: {
			description: nls.localize('notebook.stickyScrollMode.description', "Control whether nested sticky lines appear to stack flat or indented."),
			type: 'string',
			enum: ['flat', 'indented'],
			enumDescriptions: [
				nls.localize('notebook.stickyScrollMode.flat', "Nested sticky lines appear flat."),
				nls.localize('notebook.stickyScrollMode.indented', "Nested sticky lines appear indented."),
			],
			default: 'indented',
			tags: ['notebookLayout']
		},
		[NotebookSetting.consolidatedOutputButton]: {
			description: nls.localize('notebook.consolidatedOutputButton.description', "Control whether outputs action should be rendered in the output toolbar."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		// [NotebookSetting.openOutputInPreviewEditor]: {
		// 	description: nls.localize('notebook.output.openInPreviewEditor.description', "Controls whether or not the action to open a cell output in a preview editor is enabled. This action can be used via the cell output menu."),
		// 	type: 'boolean',
		// 	default: false,
		// 	tags: ['preview']
		// },
		[NotebookSetting.showFoldingControls]: {
			description: nls.localize('notebook.showFoldingControls.description', "Controls when the Markdown header folding arrow is shown."),
			type: 'string',
			enum: ['always', 'never', 'mouseover'],
			enumDescriptions: [
				nls.localize('showFoldingControls.always', "The folding controls are always visible."),
				nls.localize('showFoldingControls.never', "Never show the folding controls and reduce the gutter size."),
				nls.localize('showFoldingControls.mouseover', "The folding controls are visible only on mouseover."),
			],
			default: 'mouseover',
			tags: ['notebookLayout']
		},
		[NotebookSetting.dragAndDropEnabled]: {
			description: nls.localize('notebook.dragAndDrop.description', "Control whether the notebook editor should allow moving cells through drag and drop."),
			type: 'boolean',
			default: true,
			tags: ['notebookLayout']
		},
		[NotebookSetting.consolidatedRunButton]: {
			description: nls.localize('notebook.consolidatedRunButton.description', "Control whether extra actions are shown in a dropdown next to the run button."),
			type: 'boolean',
			default: false,
			tags: ['notebookLayout']
		},
		[NotebookSetting.globalToolbarShowLabel]: {
			description: nls.localize('notebook.globalToolbarShowLabel', "Control whether the actions on the notebook toolbar should render label or not."),
			type: 'string',
			enum: ['always', 'never', 'dynamic'],
			default: 'always',
			tags: ['notebookLayout']
		},
		[NotebookSetting.textOutputLineLimit]: {
			markdownDescription: nls.localize('notebook.textOutputLineLimit', "Controls how many lines of text are displayed in a text output. If {0} is enabled, this setting is used to determine the scroll height of the output.", '`#notebook.output.scrolling#`'),
			type: 'number',
			default: 30,
			tags: ['notebookLayout', 'notebookOutputLayout'],
			minimum: 1,
		},
		[NotebookSetting.LinkifyOutputFilePaths]: {
			description: nls.localize('notebook.disableOutputFilePathLinks', "Control whether to disable filepath links in the output of notebook cells."),
			type: 'boolean',
			default: true,
			tags: ['notebookOutputLayout']
		},
		[NotebookSetting.minimalErrorRendering]: {
			description: nls.localize('notebook.minimalErrorRendering', "Control whether to render error output in a minimal style."),
			type: 'boolean',
			default: false,
			tags: ['notebookOutputLayout']
		},
		[NotebookSetting.markupFontSize]: {
			markdownDescription: nls.localize('notebook.markup.fontSize', "Controls the font size in pixels of rendered markup in notebooks. When set to {0}, 120% of {1} is used.", '`0`', '`#editor.fontSize#`'),
			type: 'number',
			default: 0,
			tags: ['notebookLayout']
		},
		[NotebookSetting.markdownLineHeight]: {
			markdownDescription: nls.localize('notebook.markdown.lineHeight', "Controls the line height in pixels of markdown cells in notebooks. When set to {0}, {1} will be used", '`0`', '`normal`'),
			type: 'number',
			default: 0,
			tags: ['notebookLayout']
		},
		[NotebookSetting.cellEditorOptionsCustomizations]: editorOptionsCustomizationSchema,
		[NotebookSetting.interactiveWindowCollapseCodeCells]: {
			markdownDescription: nls.localize('notebook.interactiveWindow.collapseCodeCells', "Controls whether code cells in the interactive window are collapsed by default."),
			type: 'string',
			enum: ['always', 'never', 'fromEditor'],
			default: 'fromEditor'
		},
		[NotebookSetting.outputLineHeight]: {
			markdownDescription: nls.localize('notebook.outputLineHeight', "Line height of the output text within notebook cells.\n - When set to 0, editor line height is used.\n - Values between 0 and 8 will be used as a multiplier with the font size.\n - Values greater than or equal to 8 will be used as effective values."),
			type: 'number',
			default: 0,
			tags: ['notebookLayout', 'notebookOutputLayout']
		},
		[NotebookSetting.outputFontSize]: {
			markdownDescription: nls.localize('notebook.outputFontSize', "Font size for the output text within notebook cells. When set to 0, {0} is used.", '`#editor.fontSize#`'),
			type: 'number',
			default: 0,
			tags: ['notebookLayout', 'notebookOutputLayout']
		},
		[NotebookSetting.outputFontFamily]: {
			markdownDescription: nls.localize('notebook.outputFontFamily', "The font family of the output text within notebook cells. When set to empty, the {0} is used.", '`#editor.fontFamily#`'),
			type: 'string',
			tags: ['notebookLayout', 'notebookOutputLayout']
		},
		[NotebookSetting.outputScrolling]: {
			markdownDescription: nls.localize('notebook.outputScrolling', "Initially render notebook outputs in a scrollable region when longer than the limit."),
			type: 'boolean',
			tags: ['notebookLayout', 'notebookOutputLayout'],
			default: typeof product.quality === 'string' && product.quality !== 'stable' // only enable as default in insiders
		},
		[NotebookSetting.outputWordWrap]: {
			markdownDescription: nls.localize('notebook.outputWordWrap', "Controls whether the lines in output should wrap."),
			type: 'boolean',
			tags: ['notebookLayout', 'notebookOutputLayout'],
			default: false
		},
		[NotebookSetting.defaultFormatter]: {
			description: nls.localize('notebookFormatter.default', "Defines a default notebook formatter which takes precedence over all other formatter settings. Must be the identifier of an extension contributing a formatter."),
			type: ['string', 'null'],
			default: null,
			enum: DefaultFormatter.extensionIds,
			enumItemLabels: DefaultFormatter.extensionItemLabels,
			markdownEnumDescriptions: DefaultFormatter.extensionDescriptions
		},
		[NotebookSetting.formatOnSave]: {
			markdownDescription: nls.localize('notebook.formatOnSave', "Format a notebook on save. A formatter must be available and the editor must not be shutting down. When {0} is set to `afterDelay`, the file will only be formatted when saved explicitly.", '`#files.autoSave#`'),
			type: 'boolean',
			tags: ['notebookLayout'],
			default: false
		},
		[NotebookSetting.insertFinalNewline]: {
			markdownDescription: nls.localize('notebook.insertFinalNewline', "When enabled, insert a final new line into the end of code cells when saving a notebook."),
			type: 'boolean',
			tags: ['notebookLayout'],
			default: false
		},
		[NotebookSetting.formatOnCellExecution]: {
			markdownDescription: nls.localize('notebook.formatOnCellExecution', "Format a notebook cell upon execution. A formatter must be available."),
			type: 'boolean',
			default: false
		},
		[NotebookSetting.confirmDeleteRunningCell]: {
			markdownDescription: nls.localize('notebook.confirmDeleteRunningCell', "Control whether a confirmation prompt is required to delete a running cell."),
			type: 'boolean',
			default: true
		},
		[NotebookSetting.findFilters]: {
			markdownDescription: nls.localize('notebook.findFilters', "Customize the Find Widget behavior for searching within notebook cells. When both markup source and markup preview are enabled, the Find Widget will search either the source code or preview based on the current state of the cell."),
			type: 'object',
			properties: {
				markupSource: {
					type: 'boolean',
					default: true
				},
				markupPreview: {
					type: 'boolean',
					default: true
				},
				codeSource: {
					type: 'boolean',
					default: true
				},
				codeOutput: {
					type: 'boolean',
					default: true
				}
			},
			default: {
				markupSource: true,
				markupPreview: true,
				codeSource: true,
				codeOutput: true
			},
			tags: ['notebookLayout']
		},
		[NotebookSetting.remoteSaving]: {
			markdownDescription: nls.localize('notebook.remoteSaving', "Enables the incremental saving of notebooks between processes and across Remote connections. When enabled, only the changes to the notebook are sent to the extension host, improving performance for large notebooks and slow network connections."),
			type: 'boolean',
			default: typeof product.quality === 'string' && product.quality !== 'stable', // only enable as default in insiders
			tags: ['experimental']
		},
		[NotebookSetting.scrollToRevealCell]: {
			markdownDescription: nls.localize('notebook.scrolling.revealNextCellOnExecute.description', "How far to scroll when revealing the next cell upon running {0}.", 'notebook.cell.executeAndSelectBelow'),
			type: 'string',
			enum: ['fullCell', 'firstLine', 'none'],
			markdownEnumDescriptions: [
				nls.localize('notebook.scrolling.revealNextCellOnExecute.fullCell.description', 'Scroll to fully reveal the next cell.'),
				nls.localize('notebook.scrolling.revealNextCellOnExecute.firstLine.description', 'Scroll to reveal the first line of the next cell.'),
				nls.localize('notebook.scrolling.revealNextCellOnExecute.none.description', 'Do not scroll.'),
			],
			default: 'fullCell'
		},
		[NotebookSetting.cellGenerate]: {
			markdownDescription: nls.localize('notebook.cellGenerate', "Enable experimental generate action to create code cell with inline chat enabled."),
			type: 'boolean',
			default: true
		},
		[NotebookSetting.notebookVariablesView]: {
			markdownDescription: nls.localize('notebook.VariablesView.description', "Enable the experimental notebook variables view within the debug panel."),
			type: 'boolean',
			default: false
		},
		[NotebookSetting.notebookInlineValues]: {
			markdownDescription: nls.localize('notebook.inlineValues.description', "Control whether to show inline values within notebook code cells after cell execution. Values will remain until the cell is edited, re-executed, or explicitly cleared via the Clear All Outputs toolbar button or the `Notebook: Clear Inline Values` command."),
			type: 'string',
			enum: ['on', 'auto', 'off'],
			enumDescriptions: [
				nls.localize('notebook.inlineValues.on', "Always show inline values, with a regex fallback if no inline value provider is registered. Note: There may be a performance impact in larger cells if the fallback is used."),
				nls.localize('notebook.inlineValues.auto', "Show inline values only when an inline value provider is registered."),
				nls.localize('notebook.inlineValues.off', "Never show inline values."),
			],
			default: 'off'
		},
		[NotebookSetting.cellFailureDiagnostics]: {
			markdownDescription: nls.localize('notebook.cellFailureDiagnostics', "Show available diagnostics for cell failures."),
			type: 'boolean',
			default: true
		},
		[NotebookSetting.outputBackupSizeLimit]: {
			markdownDescription: nls.localize('notebook.backup.sizeLimit', "The limit of notebook output size in kilobytes (KB) where notebook files will no longer be backed up for hot reload. Use 0 for unlimited."),
			type: 'number',
			default: 10000
		},
		[NotebookSetting.multiCursor]: {
			markdownDescription: nls.localize('notebook.multiCursor.enabled', "Experimental. Enables a limited set of multi cursor controls across multiple cells in the notebook editor. Currently supported are core editor actions (typing/cut/copy/paste/composition) and a limited subset of editor commands."),
			type: 'boolean',
			default: false
		},
		[NotebookSetting.markupFontFamily]: {
			markdownDescription: nls.localize('notebook.markup.fontFamily', "Controls the font family of rendered markup in notebooks. When left blank, this will fall back to the default workbench font family."),
			type: 'string',
			default: '',
			tags: ['notebookLayout']
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED } from '../common/notebookContextKeys.js';
import { localize } from '../../../../nls.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IVisibleEditorPane } from '../../../common/editor.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';

export class NotebookAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 105;
	readonly name = 'notebook';
	readonly when = ContextKeyExpr.and(NOTEBOOK_EDITOR_FOCUSED, IS_COMPOSITE_NOTEBOOK.negate());
	readonly type: AccessibleViewType = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		const activeEditor = accessor.get(ICodeEditorService).getActiveCodeEditor()
			|| accessor.get(ICodeEditorService).getFocusedCodeEditor()
			|| accessor.get(IEditorService).activeEditorPane;

		if (!activeEditor) {
			return;
		}
		return getAccessibilityHelpProvider(accessor, activeEditor);
	}
}

function getAccessibilityHelpText(): string {
	return [
		localize('notebook.overview', 'The notebook view is a collection of code and markdown cells. Code cells can be executed and will produce output directly below the cell.'),
		localize('notebook.cell.edit', 'The Edit Cell command{0} will focus on the cell input.', '<keybinding:notebook.cell.edit>'),
		localize('notebook.cell.quitEdit', 'The Quit Edit command{0} will set focus on the cell container. The default (Escape) key may need to be pressed twice first exit the virtual cursor if active.', '<keybinding:notebook.cell.quitEdit>'),
		localize('notebook.cell.focusInOutput', 'The Focus Output command{0} will set focus in the cell\'s output.', '<keybinding:notebook.cell.focusInOutput>'),
		localize('notebook.focusNextEditor', 'The Focus Next Cell Editor command{0} will set focus in the next cell\'s editor.', '<keybinding:notebook.focusNextEditor>'),
		localize('notebook.focusPreviousEditor', 'The Focus Previous Cell Editor command{0} will set focus in the previous cell\'s editor.', '<keybinding:notebook.focusPreviousEditor>'),
		localize('notebook.cellNavigation', 'The up and down arrows will also move focus between cells while focused on the outer cell container.'),
		localize('notebook.cell.executeAndFocusContainer', 'The Execute Cell command{0} executes the cell that currently has focus.', '<keybinding:notebook.cell.executeAndFocusContainer>'),
		localize('notebook.cell.insertCodeCellBelowAndFocusContainer', 'The Insert Cell Above{0} and Below{1} commands will create new empty code cells.', '<keybinding:notebook.cell.insertCodeCellAbove>', '<keybinding:notebook.cell.insertCodeCellBelow>'),
		localize('notebook.changeCellType', 'The Change Cell to Code/Markdown commands are used to switch between cell types.')
	].join('\n');
}

function getAccessibilityHelpProvider(accessor: ServicesAccessor, editor: ICodeEditor | IVisibleEditorPane) {
	const helpText = getAccessibilityHelpText();
	return new AccessibleContentProvider(
		AccessibleViewProviderId.Notebook,
		{ type: AccessibleViewType.Help },
		() => helpText,
		() => editor.focus(),
		AccessibilityVerbositySettingId.Notebook,
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookAccessibilityProvider.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookAccessibilityProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IListAccessibilityProvider } from '../../../../base/browser/ui/list/listWidget.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { observableFromEvent } from '../../../../base/common/observable.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { AccessibilityCommandId } from '../../accessibility/common/accessibilityCommands.js';
import { CellViewModel, NotebookViewModel } from './viewModel/notebookViewModelImpl.js';
import { CellKind, NotebookCellExecutionState } from '../common/notebookCommon.js';
import { ICellExecutionStateChangedEvent, IExecutionStateChangedEvent, INotebookExecutionStateService, NotebookExecutionType } from '../common/notebookExecutionStateService.js';
import { getAllOutputsText } from './viewModel/cellOutputTextHelper.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { alert } from '../../../../base/browser/ui/aria/aria.js';

type executionUpdate = { cellHandle: number; state: NotebookCellExecutionState | undefined };

export class NotebookAccessibilityProvider extends Disposable implements IListAccessibilityProvider<CellViewModel> {
	private readonly _onDidAriaLabelChange = new Emitter<CellViewModel>();
	private readonly onDidAriaLabelChange = this._onDidAriaLabelChange.event;

	constructor(
		private readonly viewModel: () => NotebookViewModel | undefined,
		private readonly isReplHistory: boolean,
		@INotebookExecutionStateService private readonly notebookExecutionStateService: INotebookExecutionStateService,
		@IKeybindingService private readonly keybindingService: IKeybindingService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAccessibilityService private readonly accessibilityService: IAccessibilityService
	) {
		super();
		this._register(Event.debounce<ICellExecutionStateChangedEvent | IExecutionStateChangedEvent, executionUpdate[]>(
			this.notebookExecutionStateService.onDidChangeExecution,
			(last: executionUpdate[] | undefined, e: ICellExecutionStateChangedEvent | IExecutionStateChangedEvent) => this.mergeEvents(last, e),
			100
		)((updates: executionUpdate[]) => {
			if (!updates.length) {
				return;
			}
			const viewModel = this.viewModel();
			if (viewModel) {
				for (const update of updates) {
					const cellModel = viewModel.getCellByHandle(update.cellHandle);
					if (cellModel) {
						this._onDidAriaLabelChange.fire(cellModel as CellViewModel);
					}
				}

				const lastUpdate = updates[updates.length - 1];
				if (this.shouldReadCellOutputs(lastUpdate.state)) {
					const cell = viewModel.getCellByHandle(lastUpdate.cellHandle);
					if (cell && cell.outputsViewModels.length) {
						const text = getAllOutputsText(viewModel.notebookDocument, cell, true);
						alert(text);
					}
				}
			}
		}, this));
	}

	private shouldReadCellOutputs(state: NotebookCellExecutionState | undefined): boolean {
		return state === undefined // execution completed
			&& this.isReplHistory
			&& this.accessibilityService.isScreenReaderOptimized()
			&& this.configurationService.getValue<boolean>('accessibility.replEditor.readLastExecutionOutput');
	}

	get verbositySettingId() {
		return this.isReplHistory ?
			AccessibilityVerbositySettingId.ReplEditor :
			AccessibilityVerbositySettingId.Notebook;
	}

	getAriaLabel(element: CellViewModel) {
		const event = Event.filter(this.onDidAriaLabelChange, e => e === element);
		return observableFromEvent(this, event, () => {
			const viewModel = this.viewModel();
			if (!viewModel) {
				return '';
			}
			const index = viewModel.getCellIndex(element);

			if (index >= 0) {
				return this.getLabel(element);
			}

			return '';
		});
	}

	private createItemLabel(executionLabel: string, cellKind: CellKind) {
		return this.isReplHistory ?
			`cell${executionLabel}` :
			`${cellKind === CellKind.Markup ? 'markdown' : 'code'} cell${executionLabel}`;
	}

	private getLabel(element: CellViewModel) {
		const executionState = this.notebookExecutionStateService.getCellExecution(element.uri)?.state;
		const executionLabel =
			executionState === NotebookCellExecutionState.Executing
				? ', executing'
				: executionState === NotebookCellExecutionState.Pending
					? ', pending'
					: '';

		return this.createItemLabel(executionLabel, element.cellKind);
	}

	private get widgetAriaLabelName() {
		return this.isReplHistory ?
			nls.localize('replHistoryTreeAriaLabel', "REPL Editor History") :
			nls.localize('notebookTreeAriaLabel', "Notebook");
	}

	getWidgetAriaLabel() {
		const keybinding = this.keybindingService.lookupKeybinding(AccessibilityCommandId.OpenAccessibilityHelp)?.getLabel();

		if (this.configurationService.getValue(this.verbositySettingId)) {
			return keybinding
				? nls.localize('notebookTreeAriaLabelHelp', "{0}\nUse {1} for accessibility help", this.widgetAriaLabelName, keybinding)
				: nls.localize('notebookTreeAriaLabelHelpNoKb', "{0}\nRun the Open Accessibility Help command for more information", this.widgetAriaLabelName);
		}
		return this.widgetAriaLabelName;
	}

	private mergeEvents(last: executionUpdate[] | undefined, e: ICellExecutionStateChangedEvent | IExecutionStateChangedEvent): executionUpdate[] {
		const viewModel = this.viewModel();
		const result = last || [];
		if (viewModel && e.type === NotebookExecutionType.cell && e.affectsNotebook(viewModel.uri)) {
			const index = result.findIndex(update => update.cellHandle === e.cellHandle);
			if (index >= 0) {
				result.splice(index, 1);
			}
			result.push({ cellHandle: e.cellHandle, state: e.changed?.state });
		}
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/notebookAccessibleView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/notebookAccessibleView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { getNotebookEditorFromEditorPane } from './notebookBrowser.js';
import { NOTEBOOK_CELL_LIST_FOCUSED } from '../common/notebookContextKeys.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { InputFocusedContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { getAllOutputsText } from './viewModel/cellOutputTextHelper.js';

export class NotebookAccessibleView implements IAccessibleViewImplementation {
	readonly priority = 100;
	readonly name = 'notebook';
	readonly type = AccessibleViewType.View;
	readonly when = ContextKeyExpr.and(NOTEBOOK_CELL_LIST_FOCUSED, InputFocusedContext.toNegated());
	getProvider(accessor: ServicesAccessor) {
		const editorService = accessor.get(IEditorService);
		return getAccessibleOutputProvider(editorService);
	}
}

export function getAccessibleOutputProvider(editorService: IEditorService) {
	const activePane = editorService.activeEditorPane;
	const notebookEditor = getNotebookEditorFromEditorPane(activePane);
	const notebookViewModel = notebookEditor?.getViewModel();
	const selections = notebookViewModel?.getSelections();
	const notebookDocument = notebookViewModel?.notebookDocument;

	if (!selections || !notebookDocument || !notebookEditor?.textModel) {
		return;
	}

	const viewCell = notebookViewModel.viewCells[selections[0].start];
	const outputContent = getAllOutputsText(notebookDocument, viewCell);

	if (!outputContent) {
		return;
	}

	return new AccessibleContentProvider(
		AccessibleViewProviderId.Notebook,
		{ type: AccessibleViewType.View },
		() => { return outputContent; },
		() => {
			notebookEditor?.setFocus(selections[0]);
			notebookEditor.focus();
		},
		AccessibilityVerbositySettingId.Notebook,
	);
}
```

--------------------------------------------------------------------------------

````
