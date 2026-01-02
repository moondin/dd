---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 233
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 233 of 552)

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

---[FILE: src/vs/editor/contrib/inlineProgress/browser/inlineProgress.ts]---
Location: vscode-main/src/vs/editor/contrib/inlineProgress/browser/inlineProgress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { disposableTimeout } from '../../../../base/common/async.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Disposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { noBreakWhitespace } from '../../../../base/common/strings.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import './inlineProgressWidget.css';
import { ContentWidgetPositionPreference, ICodeEditor, IContentWidget, IContentWidgetPosition } from '../../../browser/editorBrowser.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

const inlineProgressDecoration = ModelDecorationOptions.register({
	description: 'inline-progress-widget',
	stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
	showIfCollapsed: true,
	after: {
		content: noBreakWhitespace,
		inlineClassName: 'inline-editor-progress-decoration',
		inlineClassNameAffectsLetterSpacing: true,
	}
});


class InlineProgressWidget extends Disposable implements IContentWidget {
	private static readonly baseId = 'editor.widget.inlineProgressWidget';

	allowEditorOverflow = false;
	suppressMouseDown = true;

	private domNode!: HTMLElement;

	constructor(
		private readonly typeId: string,
		private readonly editor: ICodeEditor,
		private readonly range: Range,
		title: string,
		private readonly delegate: InlineProgressDelegate,
	) {
		super();

		this.create(title);

		this.editor.addContentWidget(this);
		this.editor.layoutContentWidget(this);
	}

	private create(title: string): void {
		this.domNode = dom.$('.inline-progress-widget');
		this.domNode.role = 'button';
		this.domNode.title = title;

		const iconElement = dom.$('span.icon');
		this.domNode.append(iconElement);

		iconElement.classList.add(...ThemeIcon.asClassNameArray(Codicon.loading), 'codicon-modifier-spin');

		const updateSize = () => {
			const lineHeight = this.editor.getOption(EditorOption.lineHeight);
			this.domNode.style.height = `${lineHeight}px`;
			this.domNode.style.width = `${Math.ceil(0.8 * lineHeight)}px`;
		};
		updateSize();

		this._register(this.editor.onDidChangeConfiguration(c => {
			if (c.hasChanged(EditorOption.fontSize) || c.hasChanged(EditorOption.lineHeight)) {
				updateSize();
			}
		}));

		this._register(dom.addDisposableListener(this.domNode, dom.EventType.CLICK, e => {
			this.delegate.cancel();
		}));
	}

	getId(): string {
		return InlineProgressWidget.baseId + '.' + this.typeId;
	}

	getDomNode(): HTMLElement {
		return this.domNode;
	}

	getPosition(): IContentWidgetPosition | null {
		return {
			position: { lineNumber: this.range.startLineNumber, column: this.range.startColumn },
			preference: [ContentWidgetPositionPreference.EXACT]
		};
	}

	override dispose(): void {
		super.dispose();
		this.editor.removeContentWidget(this);
	}
}

interface InlineProgressDelegate {
	cancel(): void;
}

export class InlineProgressManager extends Disposable {

	/** Delay before showing the progress widget */
	private readonly _showDelay = 500; // ms
	private readonly _showPromise = this._register(new MutableDisposable());

	private readonly _currentDecorations: IEditorDecorationsCollection;
	private readonly _currentWidget = this._register(new MutableDisposable<InlineProgressWidget>());

	private _operationIdPool = 0;
	private _currentOperation?: number;

	constructor(
		private readonly id: string,
		private readonly _editor: ICodeEditor,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._currentDecorations = _editor.createDecorationsCollection();
	}

	public override dispose(): void {
		super.dispose();
		this._currentDecorations.clear();
	}

	public async showWhile<R>(position: IPosition, title: string, promise: Promise<R>, delegate: InlineProgressDelegate, delayOverride?: number): Promise<R> {
		const operationId = this._operationIdPool++;
		this._currentOperation = operationId;

		this.clear();

		this._showPromise.value = disposableTimeout(() => {
			const range = Range.fromPositions(position);
			const decorationIds = this._currentDecorations.set([{
				range: range,
				options: inlineProgressDecoration,
			}]);

			if (decorationIds.length > 0) {
				this._currentWidget.value = this._instantiationService.createInstance(InlineProgressWidget, this.id, this._editor, range, title, delegate);
			}
		}, delayOverride ?? this._showDelay);

		try {
			return await promise;
		} finally {
			if (this._currentOperation === operationId) {
				this.clear();
				this._currentOperation = undefined;
			}
		}
	}

	private clear() {
		this._showPromise.clear();
		this._currentDecorations.clear();
		this._currentWidget.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inlineProgress/browser/inlineProgressWidget.css]---
Location: vscode-main/src/vs/editor/contrib/inlineProgress/browser/inlineProgressWidget.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.inline-editor-progress-decoration {
	display: inline-block;
	width: 1em;
	height: 1em;
}

.inline-progress-widget  {
	display: flex !important;
	justify-content: center;
	align-items: center;
}

.inline-progress-widget .icon {
	font-size: 80% !important;
}

.inline-progress-widget:hover .icon {
	font-size: 90% !important;
	animation: none;
}

.inline-progress-widget:hover .icon::before {
	content: var(--vscode-icon-x-content);
	font-family: var(--vscode-icon-x-font-family);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.css]---
Location: vscode-main/src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


.monaco-editor.vs .valueSetReplacement {
	outline: solid 2px var(--vscode-editorBracketMatch-border);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.ts]---
Location: vscode-main/src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, timeout } from '../../../../base/common/async.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { CodeEditorStateFlag, EditorState } from '../../editorState/browser/editorState.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution, IEditorDecorationsCollection } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IInplaceReplaceSupportResult } from '../../../common/languages.js';
import { IEditorWorkerService } from '../../../common/services/editorWorker.js';
import * as nls from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { InPlaceReplaceCommand } from './inPlaceReplaceCommand.js';
import './inPlaceReplace.css';

class InPlaceReplaceController implements IEditorContribution {

	public static readonly ID = 'editor.contrib.inPlaceReplaceController';

	static get(editor: ICodeEditor): InPlaceReplaceController | null {
		return editor.getContribution<InPlaceReplaceController>(InPlaceReplaceController.ID);
	}

	private static readonly DECORATION = ModelDecorationOptions.register({
		description: 'in-place-replace',
		className: 'valueSetReplacement'
	});

	private readonly editor: ICodeEditor;
	private readonly editorWorkerService: IEditorWorkerService;
	private readonly decorations: IEditorDecorationsCollection;
	private currentRequest?: CancelablePromise<IInplaceReplaceSupportResult | null>;
	private decorationRemover?: CancelablePromise<void>;

	constructor(
		editor: ICodeEditor,
		@IEditorWorkerService editorWorkerService: IEditorWorkerService
	) {
		this.editor = editor;
		this.editorWorkerService = editorWorkerService;
		this.decorations = this.editor.createDecorationsCollection();
	}

	public dispose(): void {
	}

	public run(source: string, up: boolean): Promise<void> | undefined {

		// cancel any pending request
		this.currentRequest?.cancel();

		const editorSelection = this.editor.getSelection();
		const model = this.editor.getModel();
		if (!model || !editorSelection) {
			return undefined;
		}
		let selection = editorSelection;
		if (selection.startLineNumber !== selection.endLineNumber) {
			// Can't accept multiline selection
			return undefined;
		}

		const state = new EditorState(this.editor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position);
		const modelURI = model.uri;
		if (!this.editorWorkerService.canNavigateValueSet(modelURI)) {
			return Promise.resolve(undefined);
		}

		this.currentRequest = createCancelablePromise(token => this.editorWorkerService.navigateValueSet(modelURI, selection, up));

		return this.currentRequest.then(result => {

			if (!result || !result.range || !result.value) {
				// No proper result
				return;
			}

			if (!state.validate(this.editor)) {
				// state has changed
				return;
			}

			// Selection
			const editRange = Range.lift(result.range);
			let highlightRange = result.range;
			const diff = result.value.length - (selection.endColumn - selection.startColumn);

			// highlight
			highlightRange = {
				startLineNumber: highlightRange.startLineNumber,
				startColumn: highlightRange.startColumn,
				endLineNumber: highlightRange.endLineNumber,
				endColumn: highlightRange.startColumn + result.value.length
			};
			if (diff > 1) {
				selection = new Selection(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn + diff - 1);
			}

			// Insert new text
			const command = new InPlaceReplaceCommand(editRange, selection, result.value);

			this.editor.pushUndoStop();
			this.editor.executeCommand(source, command);
			this.editor.pushUndoStop();

			// add decoration
			this.decorations.set([{
				range: highlightRange,
				options: InPlaceReplaceController.DECORATION
			}]);

			// remove decoration after delay
			this.decorationRemover?.cancel();
			this.decorationRemover = timeout(350);
			this.decorationRemover.then(() => this.decorations.clear()).catch(onUnexpectedError);

		}).catch(onUnexpectedError);
	}
}

class InPlaceReplaceUp extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.inPlaceReplace.up',
			label: nls.localize2('InPlaceReplaceAction.previous.label', "Replace with Previous Value"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Comma,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> | undefined {
		const controller = InPlaceReplaceController.get(editor);
		if (!controller) {
			return Promise.resolve(undefined);
		}
		return controller.run(this.id, false);
	}
}

class InPlaceReplaceDown extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.inPlaceReplace.down',
			label: nls.localize2('InPlaceReplaceAction.next.label', "Replace with Next Value"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Period,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): Promise<void> | undefined {
		const controller = InPlaceReplaceController.get(editor);
		if (!controller) {
			return Promise.resolve(undefined);
		}
		return controller.run(this.id, true);
	}
}

registerEditorContribution(InPlaceReplaceController.ID, InPlaceReplaceController, EditorContributionInstantiation.Lazy);
registerEditorAction(InPlaceReplaceUp);
registerEditorAction(InPlaceReplaceDown);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplaceCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/inPlaceReplace/browser/inPlaceReplaceCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

export class InPlaceReplaceCommand implements ICommand {

	private readonly _editRange: Range;
	private readonly _originalSelection: Selection;
	private readonly _text: string;

	constructor(editRange: Range, originalSelection: Selection, text: string) {
		this._editRange = editRange;
		this._originalSelection = originalSelection;
		this._text = text;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		builder.addTrackedEditOperation(this._editRange, this._text);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		const inverseEditOperations = helper.getInverseEditOperations();
		const srcRange = inverseEditOperations[0].range;

		if (!this._originalSelection.isEmpty()) {
			// Preserve selection and extends to typed text
			return new Selection(
				srcRange.endLineNumber,
				srcRange.endColumn - this._text.length,
				srcRange.endLineNumber,
				srcRange.endColumn
			);
		}

		return new Selection(
			srcRange.endLineNumber,
			Math.min(this._originalSelection.positionColumn, srcRange.endColumn),
			srcRange.endLineNumber,
			Math.min(this._originalSelection.positionColumn, srcRange.endColumn)
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/insertFinalNewLine/browser/insertFinalNewLine.ts]---
Location: vscode-main/src/vs/editor/contrib/insertFinalNewLine/browser/insertFinalNewLine.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { InsertFinalNewLineCommand } from './insertFinalNewLineCommand.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as nls from '../../../../nls.js';

export class InsertFinalNewLineAction extends EditorAction {

	public static readonly ID = 'editor.action.insertFinalNewLine';

	constructor() {
		super({
			id: InsertFinalNewLineAction.ID,
			label: nls.localize2('insertFinalNewLine', "Insert Final New Line"),
			precondition: EditorContextKeys.writable
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		const selection = editor.getSelection();
		if (selection === null) {
			return;
		}

		const command = new InsertFinalNewLineCommand(selection);

		editor.pushUndoStop();
		editor.executeCommands(this.id, [command]);
		editor.pushUndoStop();
	}
}

registerEditorAction(InsertFinalNewLineAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/insertFinalNewLine/browser/insertFinalNewLineCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/insertFinalNewLine/browser/insertFinalNewLineCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

export class InsertFinalNewLineCommand implements ICommand {

	private readonly _selection: Selection;
	private _selectionId: string | null;


	constructor(selection: Selection) {
		this._selection = selection;
		this._selectionId = null;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const op = insertFinalNewLine(model);
		if (op) {
			builder.addEditOperation(op.range, op.text);
		}
		this._selectionId = builder.trackSelection(this._selection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this._selectionId!);
	}
}

/**
 * Generate edit operations for inserting a final new line if needed.
 * Returns undefined if no edit is needed.
 */
export function insertFinalNewLine(model: ITextModel): ISingleEditOperation | undefined {
	const lineCount = model.getLineCount();
	const lastLine = model.getLineContent(lineCount);
	const lastLineIsEmptyOrWhitespace = strings.lastNonWhitespaceIndex(lastLine) === -1;

	if (!lineCount || lastLineIsEmptyOrWhitespace) {
		return;
	}

	return EditOperation.insert(
		new Position(lineCount, model.getLineMaxColumn(lineCount)),
		model.getEOL()
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/lineSelection/browser/lineSelection.ts]---
Location: vscode-main/src/vs/editor/contrib/lineSelection/browser/lineSelection.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { CursorChangeReason } from '../../../common/cursorEvents.js';
import { CursorMoveCommands } from '../../../common/cursor/cursorMoveCommands.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import * as nls from '../../../../nls.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';

interface ExpandLinesSelectionArgs {
	source?: string;
}

export class ExpandLineSelectionAction extends EditorAction {
	constructor() {
		super({
			id: 'expandLineSelection',
			label: nls.localize2('expandLineSelection', "Expand Line Selection"),
			precondition: undefined,
			kbOpts: {
				weight: KeybindingWeight.EditorCore,
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyCode.KeyL
			},
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, args: ExpandLinesSelectionArgs): void {
		args = args || {};
		if (!editor.hasModel()) {
			return;
		}
		const viewModel = editor._getViewModel();
		viewModel.model.pushStackElement();
		viewModel.setCursorStates(
			args.source,
			CursorChangeReason.Explicit,
			CursorMoveCommands.expandLineSelection(viewModel, viewModel.getCursorStates())
		);
		viewModel.revealAllCursors(args.source, true);
	}
}

registerEditorAction(ExpandLineSelectionAction);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/lineSelection/test/browser/lineSelection.test.ts]---
Location: vscode-main/src/vs/editor/contrib/lineSelection/test/browser/lineSelection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import type { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorAction } from '../../../../browser/editorExtensions.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { ExpandLineSelectionAction } from '../../browser/lineSelection.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

function executeAction(action: EditorAction, editor: ICodeEditor): void {
	action.run(null!, editor, undefined);
}

suite('LineSelection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('', () => {
		const LINE1 = '    \tMy First Line\t ';
		const LINE2 = '\tMy Second Line';
		const LINE3 = '    Third Line🐶';
		const LINE4 = '';
		const LINE5 = '1';

		const TEXT =
			LINE1 + '\r\n' +
			LINE2 + '\n' +
			LINE3 + '\n' +
			LINE4 + '\r\n' +
			LINE5;

		withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
			const action = new ExpandLineSelectionAction();

			//              0          1         2
			//              01234 56789012345678 0
			// let LINE1 = '    \tMy First Line\t ';
			editor.setPosition(new Position(1, 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));

			editor.setPosition(new Position(1, 2));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));

			editor.setPosition(new Position(1, 5));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));

			editor.setPosition(new Position(1, 19));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));

			editor.setPosition(new Position(1, 20));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));

			editor.setPosition(new Position(1, 21));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 2, 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 3, 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 4, 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 5, 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 5, LINE5.length + 1));
			executeAction(action, editor);
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 5, LINE5.length + 1));
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/browser/copyLinesCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/browser/copyLinesCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Range } from '../../../common/core/range.js';
import { Selection, SelectionDirection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

export class CopyLinesCommand implements ICommand {

	private readonly _selection: Selection;
	private readonly _isCopyingDown: boolean;
	private readonly _noop: boolean;

	private _selectionDirection: SelectionDirection;
	private _selectionId: string | null;
	private _startLineNumberDelta: number;
	private _endLineNumberDelta: number;

	constructor(selection: Selection, isCopyingDown: boolean, noop?: boolean) {
		this._selection = selection;
		this._isCopyingDown = isCopyingDown;
		this._noop = noop || false;
		this._selectionDirection = SelectionDirection.LTR;
		this._selectionId = null;
		this._startLineNumberDelta = 0;
		this._endLineNumberDelta = 0;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		let s = this._selection;

		this._startLineNumberDelta = 0;
		this._endLineNumberDelta = 0;
		if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
			this._endLineNumberDelta = 1;
			s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
		}

		const sourceLines: string[] = [];
		for (let i = s.startLineNumber; i <= s.endLineNumber; i++) {
			sourceLines.push(model.getLineContent(i));
		}
		const sourceText = sourceLines.join('\n');

		if (sourceText === '') {
			// Duplicating empty line
			if (this._isCopyingDown) {
				this._startLineNumberDelta++;
				this._endLineNumberDelta++;
			}
		}

		if (this._noop) {
			builder.addEditOperation(new Range(s.endLineNumber, model.getLineMaxColumn(s.endLineNumber), s.endLineNumber + 1, 1), s.endLineNumber === model.getLineCount() ? '' : '\n');
		} else {
			if (!this._isCopyingDown) {
				builder.addEditOperation(new Range(s.endLineNumber, model.getLineMaxColumn(s.endLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)), '\n' + sourceText);
			} else {
				builder.addEditOperation(new Range(s.startLineNumber, 1, s.startLineNumber, 1), sourceText + '\n');
			}
		}

		this._selectionId = builder.trackSelection(s);
		this._selectionDirection = this._selection.getDirection();
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		let result = helper.getTrackedSelection(this._selectionId!);

		if (this._startLineNumberDelta !== 0 || this._endLineNumberDelta !== 0) {
			let startLineNumber = result.startLineNumber;
			let startColumn = result.startColumn;
			let endLineNumber = result.endLineNumber;
			let endColumn = result.endColumn;

			if (this._startLineNumberDelta !== 0) {
				startLineNumber = startLineNumber + this._startLineNumberDelta;
				startColumn = 1;
			}

			if (this._endLineNumberDelta !== 0) {
				endLineNumber = endLineNumber + this._endLineNumberDelta;
				endColumn = 1;
			}

			result = Selection.createWithDirection(startLineNumber, startColumn, endLineNumber, endColumn, this._selectionDirection);
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/browser/linesOperations.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/browser/linesOperations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import * as nls from '../../../../nls.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { CoreEditingCommands } from '../../../browser/coreCommands.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../browser/editorBrowser.js';
import { EditorAction, IActionOptions, registerEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ReplaceCommand, ReplaceCommandThatPreservesSelection, ReplaceCommandThatSelectsText } from '../../../common/commands/replaceCommand.js';
import { TrimTrailingWhitespaceCommand } from '../../../common/commands/trimTrailingWhitespaceCommand.js';
import { EditorOption } from '../../../common/config/editorOptions.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Position } from '../../../common/core/position.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { EnterOperation } from '../../../common/cursor/cursorTypeEditOperations.js';
import { TypeOperations } from '../../../common/cursor/cursorTypeOperations.js';
import { ICommand } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../common/model.js';
import { CopyLinesCommand } from './copyLinesCommand.js';
import { MoveLinesCommand } from './moveLinesCommand.js';
import { SortLinesCommand } from './sortLinesCommand.js';

// copy lines

abstract class AbstractCopyLinesAction extends EditorAction {

	private readonly down: boolean;

	constructor(down: boolean, opts: IActionOptions) {
		super(opts);
		this.down = down;
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const selections = editor.getSelections().map((selection, index) => ({ selection, index, ignore: false }));
		selections.sort((a, b) => Range.compareRangesUsingStarts(a.selection, b.selection));

		// Remove selections that would result in copying the same line
		let prev = selections[0];
		for (let i = 1; i < selections.length; i++) {
			const curr = selections[i];
			if (prev.selection.endLineNumber === curr.selection.startLineNumber) {
				// these two selections would copy the same line
				if (prev.index < curr.index) {
					// prev wins
					curr.ignore = true;
				} else {
					// curr wins
					prev.ignore = true;
					prev = curr;
				}
			}
		}

		const commands: ICommand[] = [];
		for (const selection of selections) {
			commands.push(new CopyLinesCommand(selection.selection, this.down, selection.ignore));
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

class CopyLinesUpAction extends AbstractCopyLinesAction {
	constructor() {
		super(false, {
			id: 'editor.action.copyLinesUpAction',
			label: nls.localize2('lines.copyUp', "Copy Line Up"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.UpArrow,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.Shift | KeyCode.UpArrow },
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '2_line',
				title: nls.localize({ key: 'miCopyLinesUp', comment: ['&& denotes a mnemonic'] }, "&&Copy Line Up"),
				order: 1
			},
			canTriggerInlineEdits: true,
		});
	}
}

class CopyLinesDownAction extends AbstractCopyLinesAction {
	constructor() {
		super(true, {
			id: 'editor.action.copyLinesDownAction',
			label: nls.localize2('lines.copyDown', "Copy Line Down"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.DownArrow,
				linux: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.Shift | KeyCode.DownArrow },
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '2_line',
				title: nls.localize({ key: 'miCopyLinesDown', comment: ['&& denotes a mnemonic'] }, "Co&&py Line Down"),
				order: 2
			},
			canTriggerInlineEdits: true,
		});
	}
}

export class DuplicateSelectionAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.duplicateSelection',
			label: nls.localize2('duplicateSelection', "Duplicate Selection"),
			precondition: EditorContextKeys.writable,
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '2_line',
				title: nls.localize({ key: 'miDuplicateSelection', comment: ['&& denotes a mnemonic'] }, "&&Duplicate Selection"),
				order: 5
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor, args: unknown): void {
		if (!editor.hasModel()) {
			return;
		}

		const commands: ICommand[] = [];
		const selections = editor.getSelections();
		const model = editor.getModel();

		for (const selection of selections) {
			if (selection.isEmpty()) {
				commands.push(new CopyLinesCommand(selection, true));
			} else {
				const insertSelection = new Selection(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn);
				commands.push(new ReplaceCommandThatSelectsText(insertSelection, model.getValueInRange(selection)));
			}
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

// move lines

abstract class AbstractMoveLinesAction extends EditorAction {

	private readonly down: boolean;

	constructor(down: boolean, opts: IActionOptions) {
		super(opts);
		this.down = down;
	}

	public run(accessor: ServicesAccessor, editor: ICodeEditor): void {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);

		const commands: ICommand[] = [];
		const selections = editor.getSelections() || [];
		const autoIndent = editor.getOption(EditorOption.autoIndent);

		for (const selection of selections) {
			commands.push(new MoveLinesCommand(selection, this.down, autoIndent, languageConfigurationService));
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

class MoveLinesUpAction extends AbstractMoveLinesAction {
	constructor() {
		super(false, {
			id: 'editor.action.moveLinesUpAction',
			label: nls.localize2('lines.moveUp', "Move Line Up"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyCode.UpArrow,
				linux: { primary: KeyMod.Alt | KeyCode.UpArrow },
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '2_line',
				title: nls.localize({ key: 'miMoveLinesUp', comment: ['&& denotes a mnemonic'] }, "Mo&&ve Line Up"),
				order: 3
			},
			canTriggerInlineEdits: true,
		});
	}
}

class MoveLinesDownAction extends AbstractMoveLinesAction {
	constructor() {
		super(true, {
			id: 'editor.action.moveLinesDownAction',
			label: nls.localize2('lines.moveDown', "Move Line Down"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyCode.DownArrow,
				linux: { primary: KeyMod.Alt | KeyCode.DownArrow },
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				menuId: MenuId.MenubarSelectionMenu,
				group: '2_line',
				title: nls.localize({ key: 'miMoveLinesDown', comment: ['&& denotes a mnemonic'] }, "Move &&Line Down"),
				order: 4
			},
			canTriggerInlineEdits: true,
		});
	}
}

export abstract class AbstractSortLinesAction extends EditorAction {
	private readonly descending: boolean;

	constructor(descending: boolean, opts: IActionOptions) {
		super(opts);
		this.descending = descending;
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const model = editor.getModel();
		let selections = editor.getSelections();
		if (selections.length === 1 && selections[0].isEmpty()) {
			// Apply to whole document.
			selections = [new Selection(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))];
		}

		for (const selection of selections) {
			if (!SortLinesCommand.canRun(editor.getModel(), selection, this.descending)) {
				return;
			}
		}

		const commands: ICommand[] = [];
		for (let i = 0, len = selections.length; i < len; i++) {
			commands[i] = new SortLinesCommand(selections[i], this.descending);
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

export class SortLinesAscendingAction extends AbstractSortLinesAction {
	constructor() {
		super(false, {
			id: 'editor.action.sortLinesAscending',
			label: nls.localize2('lines.sortAscending', "Sort Lines Ascending"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}
}

export class SortLinesDescendingAction extends AbstractSortLinesAction {
	constructor() {
		super(true, {
			id: 'editor.action.sortLinesDescending',
			label: nls.localize2('lines.sortDescending', "Sort Lines Descending"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}
}

export class DeleteDuplicateLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.removeDuplicateLines',
			label: nls.localize2('lines.deleteDuplicates', "Delete Duplicate Lines"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const model: ITextModel = editor.getModel();
		if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
			return;
		}

		const edits: ISingleEditOperation[] = [];
		const endCursorState: Selection[] = [];

		let linesDeleted = 0;
		let updateSelection = true;

		let selections = editor.getSelections();
		if (selections.length === 1 && selections[0].isEmpty()) {
			// Apply to whole document.
			selections = [new Selection(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))];
			updateSelection = false;
		}

		for (const selection of selections) {
			const uniqueLines = new Set();
			const lines = [];

			for (let i = selection.startLineNumber; i <= selection.endLineNumber; i++) {
				const line = model.getLineContent(i);

				if (uniqueLines.has(line)) {
					continue;
				}

				lines.push(line);
				uniqueLines.add(line);
			}


			const selectionToReplace = new Selection(
				selection.startLineNumber,
				1,
				selection.endLineNumber,
				model.getLineMaxColumn(selection.endLineNumber)
			);

			const adjustedSelectionStart = selection.startLineNumber - linesDeleted;
			const finalSelection = new Selection(
				adjustedSelectionStart,
				1,
				adjustedSelectionStart + lines.length - 1,
				lines[lines.length - 1].length + 1
			);

			edits.push(EditOperation.replace(selectionToReplace, lines.join('\n')));
			endCursorState.push(finalSelection);

			linesDeleted += (selection.endLineNumber - selection.startLineNumber + 1) - lines.length;
		}

		editor.pushUndoStop();
		editor.executeEdits(this.id, edits, updateSelection ? endCursorState : undefined);
		editor.pushUndoStop();
	}
}

export class ReverseLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.reverseLines',
			label: nls.localize2('lines.reverseLines', "Reverse lines"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const model: ITextModel = editor.getModel();
		const originalSelections = editor.getSelections();
		let selections = originalSelections;
		if (selections.length === 1 && selections[0].isEmpty()) {
			// Apply to whole document.
			selections = [new Selection(1, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))];
		}

		const edits: ISingleEditOperation[] = [];
		const resultingSelections: Selection[] = [];

		for (let i = 0; i < selections.length; i++) {
			const selection = selections[i];
			const originalSelection = originalSelections[i];
			let endLineNumber = selection.endLineNumber;
			if (selection.startLineNumber < selection.endLineNumber && selection.endColumn === 1) {
				endLineNumber--;
			}

			let range: Range = new Range(selection.startLineNumber, 1, endLineNumber, model.getLineMaxColumn(endLineNumber));

			// Exclude last line if empty and we're at the end of the document
			if (endLineNumber === model.getLineCount() && model.getLineContent(range.endLineNumber) === '') {
				range = range.setEndPosition(range.endLineNumber - 1, model.getLineMaxColumn(range.endLineNumber - 1));
			}

			const lines: string[] = [];
			for (let i = range.endLineNumber; i >= range.startLineNumber; i--) {
				lines.push(model.getLineContent(i));
			}
			const edit: ISingleEditOperation = EditOperation.replace(range, lines.join('\n'));
			edits.push(edit);

			const updateLineNumber = function (lineNumber: number): number {
				return lineNumber <= range.endLineNumber ? range.endLineNumber - lineNumber + range.startLineNumber : lineNumber;
			};
			const updateSelection = function (sel: Selection): Selection {
				if (sel.isEmpty()) {
					// keep just the cursor
					return new Selection(updateLineNumber(sel.positionLineNumber), sel.positionColumn, updateLineNumber(sel.positionLineNumber), sel.positionColumn);
				} else {
					// keep selection - maintain direction by creating backward selection
					const newSelectionStart = updateLineNumber(sel.selectionStartLineNumber);
					const newPosition = updateLineNumber(sel.positionLineNumber);
					const newSelectionStartColumn = sel.selectionStartColumn;
					const newPositionColumn = sel.positionColumn;

					// Create selection: from (newSelectionStart, newSelectionStartColumn) to (newPosition, newPositionColumn)
					// After reversal: from (3, 2) to (1, 3)
					return new Selection(newSelectionStart, newSelectionStartColumn, newPosition, newPositionColumn);
				}
			};
			resultingSelections.push(updateSelection(originalSelection));
		}

		editor.pushUndoStop();
		editor.executeEdits(this.id, edits, resultingSelections);
		editor.pushUndoStop();
	}
}

interface TrimTrailingWhitespaceArgs {
	reason?: 'auto-save';
}

export class TrimTrailingWhitespaceAction extends EditorAction {

	public static readonly ID = 'editor.action.trimTrailingWhitespace';

	constructor() {
		super({
			id: TrimTrailingWhitespaceAction.ID,
			label: nls.localize2('lines.trimTrailingWhitespace', "Trim Trailing Whitespace"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyX),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, args: TrimTrailingWhitespaceArgs): void {

		let cursors: Position[] = [];
		if (args.reason === 'auto-save') {
			// See https://github.com/editorconfig/editorconfig-vscode/issues/47
			// It is very convenient for the editor config extension to invoke this action.
			// So, if we get a reason:'auto-save' passed in, let's preserve cursor positions.
			cursors = (editor.getSelections() || []).map(s => new Position(s.positionLineNumber, s.positionColumn));
		}

		const selection = editor.getSelection();
		if (selection === null) {
			return;
		}

		const config = _accessor.get(IConfigurationService);
		const model = editor.getModel();
		const trimInRegexAndStrings = config.getValue<boolean>('files.trimTrailingWhitespaceInRegexAndStrings', { overrideIdentifier: model?.getLanguageId(), resource: model?.uri });

		const command = new TrimTrailingWhitespaceCommand(selection, cursors, trimInRegexAndStrings);

		editor.pushUndoStop();
		editor.executeCommands(this.id, [command]);
		editor.pushUndoStop();
	}
}

// delete lines

interface IDeleteLinesOperation {
	startLineNumber: number;
	selectionStartColumn: number;
	endLineNumber: number;
	positionColumn: number;
}

export class DeleteLinesAction extends EditorAction {

	constructor() {
		super({
			id: 'editor.action.deleteLines',
			label: nls.localize2('lines.delete', "Delete Line"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyK,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}

		const ops = this._getLinesToRemove(editor);

		const model: ITextModel = editor.getModel();
		if (model.getLineCount() === 1 && model.getLineMaxColumn(1) === 1) {
			// Model is empty
			return;
		}

		let linesDeleted = 0;
		const edits: ISingleEditOperation[] = [];
		const cursorState: Selection[] = [];
		for (let i = 0, len = ops.length; i < len; i++) {
			const op = ops[i];

			let startLineNumber = op.startLineNumber;
			let endLineNumber = op.endLineNumber;

			let startColumn = 1;
			let endColumn = model.getLineMaxColumn(endLineNumber);
			if (endLineNumber < model.getLineCount()) {
				endLineNumber += 1;
				endColumn = 1;
			} else if (startLineNumber > 1) {
				startLineNumber -= 1;
				startColumn = model.getLineMaxColumn(startLineNumber);
			}

			edits.push(EditOperation.replace(new Selection(startLineNumber, startColumn, endLineNumber, endColumn), ''));
			cursorState.push(new Selection(startLineNumber - linesDeleted, op.positionColumn, startLineNumber - linesDeleted, op.positionColumn));
			linesDeleted += (op.endLineNumber - op.startLineNumber + 1);
		}

		editor.pushUndoStop();
		editor.executeEdits(this.id, edits, cursorState);
		editor.revealAllCursors(true);
		editor.pushUndoStop();
	}

	private _getLinesToRemove(editor: IActiveCodeEditor): IDeleteLinesOperation[] {
		// Construct delete operations
		const operations: IDeleteLinesOperation[] = editor.getSelections().map((s) => {

			let endLineNumber = s.endLineNumber;
			if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
				endLineNumber -= 1;
			}

			return {
				startLineNumber: s.startLineNumber,
				selectionStartColumn: s.selectionStartColumn,
				endLineNumber: endLineNumber,
				positionColumn: s.positionColumn
			};
		});

		// Sort delete operations
		operations.sort((a, b) => {
			if (a.startLineNumber === b.startLineNumber) {
				return a.endLineNumber - b.endLineNumber;
			}
			return a.startLineNumber - b.startLineNumber;
		});

		// Merge delete operations which are adjacent or overlapping
		const mergedOperations: IDeleteLinesOperation[] = [];
		let previousOperation = operations[0];
		for (let i = 1; i < operations.length; i++) {
			if (previousOperation.endLineNumber + 1 >= operations[i].startLineNumber) {
				// Merge current operations into the previous one
				previousOperation.endLineNumber = operations[i].endLineNumber;
			} else {
				// Push previous operation
				mergedOperations.push(previousOperation);
				previousOperation = operations[i];
			}
		}
		// Push the last operation
		mergedOperations.push(previousOperation);

		return mergedOperations;
	}
}

export class IndentLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.indentLines',
			label: nls.localize2('lines.indent', "Indent Line"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.BracketRight,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const viewModel = editor._getViewModel();
		if (!viewModel) {
			return;
		}
		editor.pushUndoStop();
		editor.executeCommands(this.id, TypeOperations.indent(viewModel.cursorConfig, editor.getModel(), editor.getSelections()));
		editor.pushUndoStop();
	}
}

class OutdentLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.outdentLines',
			label: nls.localize2('lines.outdent', "Outdent Line"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.BracketLeft,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		CoreEditingCommands.Outdent.runEditorCommand(_accessor, editor, null);
	}
}

export class InsertLineBeforeAction extends EditorAction {
	public static readonly ID = 'editor.action.insertLineBefore';
	constructor() {
		super({
			id: InsertLineBeforeAction.ID,
			label: nls.localize2('lines.insertBefore', "Insert Line Above"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const viewModel = editor._getViewModel();
		if (!viewModel) {
			return;
		}
		editor.pushUndoStop();
		editor.executeCommands(this.id, EnterOperation.lineInsertBefore(viewModel.cursorConfig, editor.getModel(), editor.getSelections()));
	}
}

export class InsertLineAfterAction extends EditorAction {
	public static readonly ID = 'editor.action.insertLineAfter';
	constructor() {
		super({
			id: InsertLineAfterAction.ID,
			label: nls.localize2('lines.insertAfter', "Insert Line Below"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const viewModel = editor._getViewModel();
		if (!viewModel) {
			return;
		}
		editor.pushUndoStop();
		editor.executeCommands(this.id, EnterOperation.lineInsertAfter(viewModel.cursorConfig, editor.getModel(), editor.getSelections()));
	}
}

export abstract class AbstractDeleteAllToBoundaryAction extends EditorAction {
	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		if (!editor.hasModel()) {
			return;
		}
		const primaryCursor = editor.getSelection();

		const rangesToDelete = this._getRangesToDelete(editor);
		// merge overlapping selections
		const effectiveRanges: Range[] = [];

		for (let i = 0, count = rangesToDelete.length - 1; i < count; i++) {
			const range = rangesToDelete[i];
			const nextRange = rangesToDelete[i + 1];

			if (Range.intersectRanges(range, nextRange) === null) {
				effectiveRanges.push(range);
			} else {
				rangesToDelete[i + 1] = Range.plusRange(range, nextRange);
			}
		}

		effectiveRanges.push(rangesToDelete[rangesToDelete.length - 1]);

		const endCursorState = this._getEndCursorState(primaryCursor, effectiveRanges);

		const edits: ISingleEditOperation[] = effectiveRanges.map(range => {
			return EditOperation.replace(range, '');
		});

		editor.pushUndoStop();
		editor.executeEdits(this.id, edits, endCursorState);
		editor.pushUndoStop();
	}

	/**
	 * Compute the cursor state after the edit operations were applied.
	 */
	protected abstract _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[];

	protected abstract _getRangesToDelete(editor: IActiveCodeEditor): Range[];
}

export class DeleteAllLeftAction extends AbstractDeleteAllToBoundaryAction {
	constructor() {
		super({
			id: 'deleteAllLeft',
			label: nls.localize2('lines.deleteAllLeft', "Delete All Left"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.CtrlCmd | KeyCode.Backspace },
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	protected _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[] {
		let endPrimaryCursor: Selection | null = null;
		const endCursorState: Selection[] = [];
		let deletedLines = 0;

		rangesToDelete.forEach(range => {
			let endCursor;
			if (range.endColumn === 1 && deletedLines > 0) {
				const newStartLine = range.startLineNumber - deletedLines;
				endCursor = new Selection(newStartLine, range.startColumn, newStartLine, range.startColumn);
			} else {
				endCursor = new Selection(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn);
			}

			deletedLines += range.endLineNumber - range.startLineNumber;

			if (range.intersectRanges(primaryCursor)) {
				endPrimaryCursor = endCursor;
			} else {
				endCursorState.push(endCursor);
			}
		});

		if (endPrimaryCursor) {
			endCursorState.unshift(endPrimaryCursor);
		}

		return endCursorState;
	}

	protected _getRangesToDelete(editor: IActiveCodeEditor): Range[] {
		const selections = editor.getSelections();
		if (selections === null) {
			return [];
		}

		let rangesToDelete: Range[] = selections;
		const model = editor.getModel();

		if (model === null) {
			return [];
		}

		rangesToDelete.sort(Range.compareRangesUsingStarts);
		rangesToDelete = rangesToDelete.map(selection => {
			if (selection.isEmpty()) {
				if (selection.startColumn === 1) {
					const deleteFromLine = Math.max(1, selection.startLineNumber - 1);
					const deleteFromColumn = selection.startLineNumber === 1 ? 1 : model.getLineLength(deleteFromLine) + 1;
					return new Range(deleteFromLine, deleteFromColumn, selection.startLineNumber, 1);
				} else {
					return new Range(selection.startLineNumber, 1, selection.startLineNumber, selection.startColumn);
				}
			} else {
				return new Range(selection.startLineNumber, 1, selection.endLineNumber, selection.endColumn);
			}
		});

		return rangesToDelete;
	}
}

export class DeleteAllRightAction extends AbstractDeleteAllToBoundaryAction {
	constructor() {
		super({
			id: 'deleteAllRight',
			label: nls.localize2('lines.deleteAllRight', "Delete All Right"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.textInputFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyK, secondary: [KeyMod.CtrlCmd | KeyCode.Delete] },
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	protected _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[] {
		let endPrimaryCursor: Selection | null = null;
		const endCursorState: Selection[] = [];
		for (let i = 0, len = rangesToDelete.length, offset = 0; i < len; i++) {
			const range = rangesToDelete[i];
			const endCursor = new Selection(range.startLineNumber - offset, range.startColumn, range.startLineNumber - offset, range.startColumn);

			if (range.intersectRanges(primaryCursor)) {
				endPrimaryCursor = endCursor;
			} else {
				endCursorState.push(endCursor);
			}
		}

		if (endPrimaryCursor) {
			endCursorState.unshift(endPrimaryCursor);
		}

		return endCursorState;
	}

	protected _getRangesToDelete(editor: IActiveCodeEditor): Range[] {
		const model = editor.getModel();
		if (model === null) {
			return [];
		}

		const selections = editor.getSelections();

		if (selections === null) {
			return [];
		}

		const rangesToDelete: Range[] = selections.map((sel) => {
			if (sel.isEmpty()) {
				const maxColumn = model.getLineMaxColumn(sel.startLineNumber);

				if (sel.startColumn === maxColumn) {
					return new Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber + 1, 1);
				} else {
					return new Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber, maxColumn);
				}
			}
			return sel;
		});

		rangesToDelete.sort(Range.compareRangesUsingStarts);
		return rangesToDelete;
	}
}

export class JoinLinesAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.joinLines',
			label: nls.localize2('lines.joinLines', "Join Lines"),
			precondition: EditorContextKeys.writable,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: 0,
				mac: { primary: KeyMod.WinCtrl | KeyCode.KeyJ },
				weight: KeybindingWeight.EditorContrib
			},
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const selections = editor.getSelections();
		if (selections === null) {
			return;
		}

		let primaryCursor = editor.getSelection();
		if (primaryCursor === null) {
			return;
		}

		selections.sort(Range.compareRangesUsingStarts);
		const reducedSelections: Selection[] = [];

		const lastSelection = selections.reduce((previousValue, currentValue) => {
			if (previousValue.isEmpty()) {
				if (previousValue.endLineNumber === currentValue.startLineNumber) {
					if (primaryCursor!.equalsSelection(previousValue)) {
						primaryCursor = currentValue;
					}
					return currentValue;
				}

				if (currentValue.startLineNumber > previousValue.endLineNumber + 1) {
					reducedSelections.push(previousValue);
					return currentValue;
				} else {
					return new Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
				}
			} else {
				if (currentValue.startLineNumber > previousValue.endLineNumber) {
					reducedSelections.push(previousValue);
					return currentValue;
				} else {
					return new Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
				}
			}
		});

		reducedSelections.push(lastSelection);

		const model = editor.getModel();
		if (model === null) {
			return;
		}

		const edits: ISingleEditOperation[] = [];
		const endCursorState: Selection[] = [];
		let endPrimaryCursor = primaryCursor;
		let lineOffset = 0;

		for (let i = 0, len = reducedSelections.length; i < len; i++) {
			const selection = reducedSelections[i];
			const startLineNumber = selection.startLineNumber;
			const startColumn = 1;
			let columnDeltaOffset = 0;
			let endLineNumber: number,
				endColumn: number;

			const selectionEndPositionOffset = model.getLineLength(selection.endLineNumber) - selection.endColumn;

			if (selection.isEmpty() || selection.startLineNumber === selection.endLineNumber) {
				const position = selection.getStartPosition();
				if (position.lineNumber < model.getLineCount()) {
					endLineNumber = startLineNumber + 1;
					endColumn = model.getLineMaxColumn(endLineNumber);
				} else {
					endLineNumber = position.lineNumber;
					endColumn = model.getLineMaxColumn(position.lineNumber);
				}
			} else {
				endLineNumber = selection.endLineNumber;
				endColumn = model.getLineMaxColumn(endLineNumber);
			}

			let trimmedLinesContent = model.getLineContent(startLineNumber);

			for (let i = startLineNumber + 1; i <= endLineNumber; i++) {
				const lineText = model.getLineContent(i);
				const firstNonWhitespaceIdx = model.getLineFirstNonWhitespaceColumn(i);

				if (firstNonWhitespaceIdx >= 1) {
					let insertSpace = true;
					if (trimmedLinesContent === '') {
						insertSpace = false;
					}

					if (insertSpace && (trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === ' ' ||
						trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === '\t')) {
						insertSpace = false;
						trimmedLinesContent = trimmedLinesContent.replace(/[\s\uFEFF\xA0]+$/g, ' ');
					}

					const lineTextWithoutIndent = lineText.substr(firstNonWhitespaceIdx - 1);

					trimmedLinesContent += (insertSpace ? ' ' : '') + lineTextWithoutIndent;

					if (insertSpace) {
						columnDeltaOffset = lineTextWithoutIndent.length + 1;
					} else {
						columnDeltaOffset = lineTextWithoutIndent.length;
					}
				} else {
					columnDeltaOffset = 0;
				}
			}

			const deleteSelection = new Range(startLineNumber, startColumn, endLineNumber, endColumn);

			if (!deleteSelection.isEmpty()) {
				let resultSelection: Selection;

				if (selection.isEmpty()) {
					edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
					resultSelection = new Selection(deleteSelection.startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1, startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1);
				} else {
					if (selection.startLineNumber === selection.endLineNumber) {
						edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
						resultSelection = new Selection(selection.startLineNumber - lineOffset, selection.startColumn,
							selection.endLineNumber - lineOffset, selection.endColumn);
					} else {
						edits.push(EditOperation.replace(deleteSelection, trimmedLinesContent));
						resultSelection = new Selection(selection.startLineNumber - lineOffset, selection.startColumn,
							selection.startLineNumber - lineOffset, trimmedLinesContent.length - selectionEndPositionOffset);
					}
				}

				if (Range.intersectRanges(deleteSelection, primaryCursor) !== null) {
					endPrimaryCursor = resultSelection;
				} else {
					endCursorState.push(resultSelection);
				}
			}

			lineOffset += deleteSelection.endLineNumber - deleteSelection.startLineNumber;
		}

		endCursorState.unshift(endPrimaryCursor);
		editor.pushUndoStop();
		editor.executeEdits(this.id, edits, endCursorState);
		editor.pushUndoStop();
	}
}

export class TransposeAction extends EditorAction {
	constructor() {
		super({
			id: 'editor.action.transpose',
			label: nls.localize2('editor.transpose', "Transpose Characters around the Cursor"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const selections = editor.getSelections();
		if (selections === null) {
			return;
		}

		const model = editor.getModel();
		if (model === null) {
			return;
		}

		const commands: ICommand[] = [];

		for (let i = 0, len = selections.length; i < len; i++) {
			const selection = selections[i];

			if (!selection.isEmpty()) {
				continue;
			}

			const cursor = selection.getStartPosition();
			const maxColumn = model.getLineMaxColumn(cursor.lineNumber);

			if (cursor.column >= maxColumn) {
				if (cursor.lineNumber === model.getLineCount()) {
					continue;
				}

				// The cursor is at the end of current line and current line is not empty
				// then we transpose the character before the cursor and the line break if there is any following line.
				const deleteSelection = new Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1);
				const chars = model.getValueInRange(deleteSelection).split('').reverse().join('');

				commands.push(new ReplaceCommand(new Selection(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1), chars));
			} else {
				const deleteSelection = new Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber, cursor.column + 1);
				const chars = model.getValueInRange(deleteSelection).split('').reverse().join('');
				commands.push(new ReplaceCommandThatPreservesSelection(deleteSelection, chars,
					new Selection(cursor.lineNumber, cursor.column + 1, cursor.lineNumber, cursor.column + 1)));
			}
		}

		editor.pushUndoStop();
		editor.executeCommands(this.id, commands);
		editor.pushUndoStop();
	}
}

export abstract class AbstractCaseAction extends EditorAction {
	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		const selections = editor.getSelections();
		if (selections === null) {
			return;
		}

		const model = editor.getModel();
		if (model === null) {
			return;
		}

		const wordSeparators = editor.getOption(EditorOption.wordSeparators);
		const textEdits: ISingleEditOperation[] = [];

		for (const selection of selections) {
			if (selection.isEmpty()) {
				const cursor = selection.getStartPosition();
				const word = editor.getConfiguredWordAtPosition(cursor);

				if (!word) {
					continue;
				}

				const wordRange = new Range(cursor.lineNumber, word.startColumn, cursor.lineNumber, word.endColumn);
				const text = model.getValueInRange(wordRange);
				textEdits.push(EditOperation.replace(wordRange, this._modifyText(text, wordSeparators)));
			} else {
				const text = model.getValueInRange(selection);
				textEdits.push(EditOperation.replace(selection, this._modifyText(text, wordSeparators)));
			}
		}

		editor.pushUndoStop();
		editor.executeEdits(this.id, textEdits);
		editor.pushUndoStop();
	}

	protected abstract _modifyText(text: string, wordSeparators: string): string;
}

export class UpperCaseAction extends AbstractCaseAction {
	constructor() {
		super({
			id: 'editor.action.transformToUppercase',
			label: nls.localize2('editor.transformToUppercase', "Transform to Uppercase"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		return text.toLocaleUpperCase();
	}
}

export class LowerCaseAction extends AbstractCaseAction {
	constructor() {
		super({
			id: 'editor.action.transformToLowercase',
			label: nls.localize2('editor.transformToLowercase', "Transform to Lowercase"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		return text.toLocaleLowerCase();
	}
}

class BackwardsCompatibleRegExp {

	private _actual: RegExp | null;
	private _evaluated: boolean;

	constructor(
		private readonly _pattern: string,
		private readonly _flags: string
	) {
		this._actual = null;
		this._evaluated = false;
	}

	public get(): RegExp | null {
		if (!this._evaluated) {
			this._evaluated = true;
			try {
				this._actual = new RegExp(this._pattern, this._flags);
			} catch (err) {
				// this browser does not support this regular expression
			}
		}
		return this._actual;
	}

	public isSupported(): boolean {
		return (this.get() !== null);
	}
}

export class TitleCaseAction extends AbstractCaseAction {

	public static titleBoundary = new BackwardsCompatibleRegExp('(^|[^\\p{L}\\p{N}\']|((^|\\P{L})\'))\\p{L}', 'gmu');

	constructor() {
		super({
			id: 'editor.action.transformToTitlecase',
			label: nls.localize2('editor.transformToTitlecase', "Transform to Title Case"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		const titleBoundary = TitleCaseAction.titleBoundary.get();
		if (!titleBoundary) {
			// cannot support this
			return text;
		}
		return text
			.toLocaleLowerCase()
			.replace(titleBoundary, (b) => b.toLocaleUpperCase());
	}
}

export class SnakeCaseAction extends AbstractCaseAction {

	public static caseBoundary = new BackwardsCompatibleRegExp('(\\p{Ll})(\\p{Lu})', 'gmu');
	public static singleLetters = new BackwardsCompatibleRegExp('(\\p{Lu}|\\p{N})(\\p{Lu})(\\p{Ll})', 'gmu');

	constructor() {
		super({
			id: 'editor.action.transformToSnakecase',
			label: nls.localize2('editor.transformToSnakecase', "Transform to Snake Case"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		const caseBoundary = SnakeCaseAction.caseBoundary.get();
		const singleLetters = SnakeCaseAction.singleLetters.get();
		if (!caseBoundary || !singleLetters) {
			// cannot support this
			return text;
		}
		return (text
			.replace(caseBoundary, '$1_$2')
			.replace(singleLetters, '$1_$2$3')
			.toLocaleLowerCase()
		);
	}
}

export class CamelCaseAction extends AbstractCaseAction {
	public static singleLineWordBoundary = new BackwardsCompatibleRegExp('[_\\s-]+', 'gm');
	public static multiLineWordBoundary = new BackwardsCompatibleRegExp('[_-]+', 'gm');
	public static validWordStart = new BackwardsCompatibleRegExp('^(\\p{Lu}[^\\p{Lu}])', 'gmu');

	constructor() {
		super({
			id: 'editor.action.transformToCamelcase',
			label: nls.localize2('editor.transformToCamelcase', "Transform to Camel Case"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		const wordBoundary = /\r\n|\r|\n/.test(text) ? CamelCaseAction.multiLineWordBoundary.get() : CamelCaseAction.singleLineWordBoundary.get();
		const validWordStart = CamelCaseAction.validWordStart.get();
		if (!wordBoundary || !validWordStart) {
			// cannot support this
			return text;
		}
		const words = text.split(wordBoundary);
		const firstWord = words.shift()?.replace(validWordStart, (start: string) => start.toLocaleLowerCase());
		return firstWord + words.map((word: string) => word.substring(0, 1).toLocaleUpperCase() + word.substring(1))
			.join('');
	}
}

export class PascalCaseAction extends AbstractCaseAction {
	public static wordBoundary = new BackwardsCompatibleRegExp('[_ \\t-]', 'gm');
	public static wordBoundaryToMaintain = new BackwardsCompatibleRegExp('(?<=\\.)', 'gm');
	public static upperCaseWordMatcher = new BackwardsCompatibleRegExp('^\\p{Lu}+$', 'mu');

	constructor() {
		super({
			id: 'editor.action.transformToPascalcase',
			label: nls.localize2('editor.transformToPascalcase', "Transform to Pascal Case"),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	protected _modifyText(text: string, wordSeparators: string): string {
		const wordBoundary = PascalCaseAction.wordBoundary.get();
		const wordBoundaryToMaintain = PascalCaseAction.wordBoundaryToMaintain.get();
		const upperCaseWordMatcher = PascalCaseAction.upperCaseWordMatcher.get();

		if (!wordBoundary || !wordBoundaryToMaintain || !upperCaseWordMatcher) {
			// cannot support this
			return text;
		}

		const wordsWithMaintainBoundaries = text.split(wordBoundaryToMaintain);
		const words = wordsWithMaintainBoundaries.map(word => word.split(wordBoundary)).flat();

		return words.map(word => {
			const normalizedWord = word.charAt(0).toLocaleUpperCase() + word.slice(1);
			const isAllCaps = normalizedWord.length > 1 && upperCaseWordMatcher.test(normalizedWord);
			if (isAllCaps) {
				return normalizedWord.charAt(0) + normalizedWord.slice(1).toLocaleLowerCase();
			}
			return normalizedWord;
		}).join('');
	}
}

export class KebabCaseAction extends AbstractCaseAction {

	public static isSupported(): boolean {
		const areAllRegexpsSupported = [
			this.caseBoundary,
			this.singleLetters,
			this.underscoreBoundary,
		].every((regexp) => regexp.isSupported());

		return areAllRegexpsSupported;
	}

	private static caseBoundary = new BackwardsCompatibleRegExp('(\\p{Ll})(\\p{Lu})', 'gmu');
	private static singleLetters = new BackwardsCompatibleRegExp('(\\p{Lu}|\\p{N})(\\p{Lu}\\p{Ll})', 'gmu');
	private static underscoreBoundary = new BackwardsCompatibleRegExp('(\\S)(_)(\\S)', 'gm');

	constructor() {
		super({
			id: 'editor.action.transformToKebabcase',
			label: nls.localize2('editor.transformToKebabcase', 'Transform to Kebab Case'),
			precondition: EditorContextKeys.writable,
			canTriggerInlineEdits: true,
		});
	}

	protected _modifyText(text: string, _: string): string {
		const caseBoundary = KebabCaseAction.caseBoundary.get();
		const singleLetters = KebabCaseAction.singleLetters.get();
		const underscoreBoundary = KebabCaseAction.underscoreBoundary.get();

		if (!caseBoundary || !singleLetters || !underscoreBoundary) {
			// one or more regexps aren't supported
			return text;
		}

		return text
			.replace(underscoreBoundary, '$1-$3')
			.replace(caseBoundary, '$1-$2')
			.replace(singleLetters, '$1-$2')
			.toLocaleLowerCase();
	}
}

registerEditorAction(CopyLinesUpAction);
registerEditorAction(CopyLinesDownAction);
registerEditorAction(DuplicateSelectionAction);
registerEditorAction(MoveLinesUpAction);
registerEditorAction(MoveLinesDownAction);
registerEditorAction(SortLinesAscendingAction);
registerEditorAction(SortLinesDescendingAction);
registerEditorAction(DeleteDuplicateLinesAction);
registerEditorAction(TrimTrailingWhitespaceAction);
registerEditorAction(DeleteLinesAction);
registerEditorAction(IndentLinesAction);
registerEditorAction(OutdentLinesAction);
registerEditorAction(InsertLineBeforeAction);
registerEditorAction(InsertLineAfterAction);
registerEditorAction(DeleteAllLeftAction);
registerEditorAction(DeleteAllRightAction);
registerEditorAction(JoinLinesAction);
registerEditorAction(TransposeAction);
registerEditorAction(UpperCaseAction);
registerEditorAction(LowerCaseAction);
registerEditorAction(ReverseLinesAction);

if (SnakeCaseAction.caseBoundary.isSupported() && SnakeCaseAction.singleLetters.isSupported()) {
	registerEditorAction(SnakeCaseAction);
}
if (CamelCaseAction.singleLineWordBoundary.isSupported() && CamelCaseAction.multiLineWordBoundary.isSupported()) {
	registerEditorAction(CamelCaseAction);
}
if (PascalCaseAction.wordBoundary.isSupported()) {
	registerEditorAction(PascalCaseAction);
}
if (TitleCaseAction.titleBoundary.isSupported()) {
	registerEditorAction(TitleCaseAction);
}

if (KebabCaseAction.isSupported()) {
	registerEditorAction(KebabCaseAction);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/browser/moveLinesCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/browser/moveLinesCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from '../../../../base/common/strings.js';
import { ShiftCommand } from '../../../common/commands/shiftCommand.js';
import { EditorAutoIndentStrategy } from '../../../common/config/editorOptions.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';
import { CompleteEnterAction, IndentAction } from '../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { IndentConsts } from '../../../common/languages/supports/indentRules.js';
import * as indentUtils from '../../indentation/common/indentUtils.js';
import { getGoodIndentForLine, getIndentMetadata, IIndentConverter, IVirtualModel } from '../../../common/languages/autoIndent.js';
import { getEnterAction } from '../../../common/languages/enterAction.js';

export class MoveLinesCommand implements ICommand {

	private readonly _selection: Selection;
	private readonly _isMovingDown: boolean;
	private readonly _autoIndent: EditorAutoIndentStrategy;

	private _selectionId: string | null;
	private _moveEndPositionDown?: boolean;
	private _moveEndLineSelectionShrink: boolean;

	constructor(
		selection: Selection,
		isMovingDown: boolean,
		autoIndent: EditorAutoIndentStrategy,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService
	) {
		this._selection = selection;
		this._isMovingDown = isMovingDown;
		this._autoIndent = autoIndent;
		this._selectionId = null;
		this._moveEndLineSelectionShrink = false;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {

		const getLanguageId = () => {
			return model.getLanguageId();
		};
		const getLanguageIdAtPosition = (lineNumber: number, column: number) => {
			return model.getLanguageIdAtPosition(lineNumber, column);
		};

		const modelLineCount = model.getLineCount();

		if (this._isMovingDown && this._selection.endLineNumber === modelLineCount) {
			this._selectionId = builder.trackSelection(this._selection);
			return;
		}
		if (!this._isMovingDown && this._selection.startLineNumber === 1) {
			this._selectionId = builder.trackSelection(this._selection);
			return;
		}

		this._moveEndPositionDown = false;
		let s = this._selection;

		if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
			this._moveEndPositionDown = true;
			s = s.setEndPosition(s.endLineNumber - 1, model.getLineMaxColumn(s.endLineNumber - 1));
		}

		const { tabSize, indentSize, insertSpaces } = model.getOptions();
		const indentConverter = this.buildIndentConverter(tabSize, indentSize, insertSpaces);

		if (s.startLineNumber === s.endLineNumber && model.getLineMaxColumn(s.startLineNumber) === 1) {
			// Current line is empty
			const lineNumber = s.startLineNumber;
			const otherLineNumber = (this._isMovingDown ? lineNumber + 1 : lineNumber - 1);

			if (model.getLineMaxColumn(otherLineNumber) === 1) {
				// Other line number is empty too, so no editing is needed
				// Add a no-op to force running by the model
				builder.addEditOperation(new Range(1, 1, 1, 1), null);
			} else {
				// Type content from other line number on line number
				builder.addEditOperation(new Range(lineNumber, 1, lineNumber, 1), model.getLineContent(otherLineNumber));

				// Remove content from other line number
				builder.addEditOperation(new Range(otherLineNumber, 1, otherLineNumber, model.getLineMaxColumn(otherLineNumber)), null);
			}
			// Track selection at the other line number
			s = new Selection(otherLineNumber, 1, otherLineNumber, 1);

		} else {

			let movingLineNumber: number;
			let movingLineText: string;

			if (this._isMovingDown) {
				movingLineNumber = s.endLineNumber + 1;
				movingLineText = model.getLineContent(movingLineNumber);
				// Delete line that needs to be moved
				builder.addEditOperation(new Range(movingLineNumber - 1, model.getLineMaxColumn(movingLineNumber - 1), movingLineNumber, model.getLineMaxColumn(movingLineNumber)), null);

				let insertingText = movingLineText;

				if (this.shouldAutoIndent(model, s)) {
					const movingLineMatchResult = this.matchEnterRule(model, indentConverter, tabSize, movingLineNumber, s.startLineNumber - 1);
					// if s.startLineNumber - 1 matches onEnter rule, we still honor that.
					if (movingLineMatchResult !== null) {
						const oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber));
						const newSpaceCnt = movingLineMatchResult + indentUtils.getSpaceCnt(oldIndentation, tabSize);
						const newIndentation = indentUtils.generateIndent(newSpaceCnt, tabSize, insertSpaces);
						insertingText = newIndentation + this.trimStart(movingLineText);
					} else {
						// no enter rule matches, let's check indentatin rules then.
						const virtualModel: IVirtualModel = {
							tokenization: {
								getLineTokens: (lineNumber: number) => {
									if (lineNumber === s.startLineNumber) {
										return model.tokenization.getLineTokens(movingLineNumber);
									} else {
										return model.tokenization.getLineTokens(lineNumber);
									}
								},
								getLanguageId,
								getLanguageIdAtPosition,
							},
							getLineContent: (lineNumber: number) => {
								if (lineNumber === s.startLineNumber) {
									return model.getLineContent(movingLineNumber);
								} else {
									return model.getLineContent(lineNumber);
								}
							},
						};
						const indentOfMovingLine = getGoodIndentForLine(
							this._autoIndent,
							virtualModel,
							model.getLanguageIdAtPosition(movingLineNumber, 1),
							s.startLineNumber,
							indentConverter,
							this._languageConfigurationService
						);
						if (indentOfMovingLine !== null) {
							const oldIndentation = strings.getLeadingWhitespace(model.getLineContent(movingLineNumber));
							const newSpaceCnt = indentUtils.getSpaceCnt(indentOfMovingLine, tabSize);
							const oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
							if (newSpaceCnt !== oldSpaceCnt) {
								const newIndentation = indentUtils.generateIndent(newSpaceCnt, tabSize, insertSpaces);
								insertingText = newIndentation + this.trimStart(movingLineText);
							}
						}
					}

					// add edit operations for moving line first to make sure it's executed after we make indentation change
					// to s.startLineNumber
					builder.addEditOperation(new Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText + '\n');

					const ret = this.matchEnterRuleMovingDown(model, indentConverter, tabSize, s.startLineNumber, movingLineNumber, insertingText);

					// check if the line being moved before matches onEnter rules, if so let's adjust the indentation by onEnter rules.
					if (ret !== null) {
						if (ret !== 0) {
							this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
						}
					} else {
						// it doesn't match onEnter rules, let's check indentation rules then.
						const virtualModel: IVirtualModel = {
							tokenization: {
								getLineTokens: (lineNumber: number) => {
									if (lineNumber === s.startLineNumber) {
										// TODO@aiday-mar: the tokens here don't correspond exactly to the corresponding content (after indentation adjustment), have to fix this.
										return model.tokenization.getLineTokens(movingLineNumber);
									} else if (lineNumber >= s.startLineNumber + 1 && lineNumber <= s.endLineNumber + 1) {
										return model.tokenization.getLineTokens(lineNumber - 1);
									} else {
										return model.tokenization.getLineTokens(lineNumber);
									}
								},
								getLanguageId,
								getLanguageIdAtPosition,
							},
							getLineContent: (lineNumber: number) => {
								if (lineNumber === s.startLineNumber) {
									return insertingText;
								} else if (lineNumber >= s.startLineNumber + 1 && lineNumber <= s.endLineNumber + 1) {
									return model.getLineContent(lineNumber - 1);
								} else {
									return model.getLineContent(lineNumber);
								}
							},
						};

						const newIndentatOfMovingBlock = getGoodIndentForLine(
							this._autoIndent,
							virtualModel,
							model.getLanguageIdAtPosition(movingLineNumber, 1),
							s.startLineNumber + 1,
							indentConverter,
							this._languageConfigurationService
						);

						if (newIndentatOfMovingBlock !== null) {
							const oldIndentation = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
							const newSpaceCnt = indentUtils.getSpaceCnt(newIndentatOfMovingBlock, tabSize);
							const oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
							if (newSpaceCnt !== oldSpaceCnt) {
								const spaceCntOffset = newSpaceCnt - oldSpaceCnt;

								this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
							}
						}
					}
				} else {
					// Insert line that needs to be moved before
					builder.addEditOperation(new Range(s.startLineNumber, 1, s.startLineNumber, 1), insertingText + '\n');
				}
			} else {
				movingLineNumber = s.startLineNumber - 1;
				movingLineText = model.getLineContent(movingLineNumber);

				// Delete line that needs to be moved
				builder.addEditOperation(new Range(movingLineNumber, 1, movingLineNumber + 1, 1), null);

				// Insert line that needs to be moved after
				builder.addEditOperation(new Range(s.endLineNumber, model.getLineMaxColumn(s.endLineNumber), s.endLineNumber, model.getLineMaxColumn(s.endLineNumber)), '\n' + movingLineText);

				if (this.shouldAutoIndent(model, s)) {
					const virtualModel: IVirtualModel = {
						tokenization: {
							getLineTokens: (lineNumber: number) => {
								if (lineNumber === movingLineNumber) {
									return model.tokenization.getLineTokens(s.startLineNumber);
								} else {
									return model.tokenization.getLineTokens(lineNumber);
								}
							},
							getLanguageId,
							getLanguageIdAtPosition,
						},
						getLineContent: (lineNumber: number) => {
							if (lineNumber === movingLineNumber) {
								return model.getLineContent(s.startLineNumber);
							} else {
								return model.getLineContent(lineNumber);
							}
						},
					};

					const ret = this.matchEnterRule(model, indentConverter, tabSize, s.startLineNumber, s.startLineNumber - 2);
					// check if s.startLineNumber - 2 matches onEnter rules, if so adjust the moving block by onEnter rules.
					if (ret !== null) {
						if (ret !== 0) {
							this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, ret);
						}
					} else {
						// it doesn't match any onEnter rule, let's check indentation rules then.
						const indentOfFirstLine = getGoodIndentForLine(
							this._autoIndent,
							virtualModel,
							model.getLanguageIdAtPosition(s.startLineNumber, 1),
							movingLineNumber,
							indentConverter,
							this._languageConfigurationService
						);
						if (indentOfFirstLine !== null) {
							// adjust the indentation of the moving block
							const oldIndent = strings.getLeadingWhitespace(model.getLineContent(s.startLineNumber));
							const newSpaceCnt = indentUtils.getSpaceCnt(indentOfFirstLine, tabSize);
							const oldSpaceCnt = indentUtils.getSpaceCnt(oldIndent, tabSize);
							if (newSpaceCnt !== oldSpaceCnt) {
								const spaceCntOffset = newSpaceCnt - oldSpaceCnt;

								this.getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, spaceCntOffset);
							}
						}
					}
				}
			}
		}

		this._selectionId = builder.trackSelection(s);
	}

	private buildIndentConverter(tabSize: number, indentSize: number, insertSpaces: boolean): IIndentConverter {
		return {
			shiftIndent: (indentation) => {
				return ShiftCommand.shiftIndent(indentation, indentation.length + 1, tabSize, indentSize, insertSpaces);
			},
			unshiftIndent: (indentation) => {
				return ShiftCommand.unshiftIndent(indentation, indentation.length + 1, tabSize, indentSize, insertSpaces);
			}
		};
	}

	private parseEnterResult(model: ITextModel, indentConverter: IIndentConverter, tabSize: number, line: number, enter: CompleteEnterAction | null) {
		if (enter) {
			let enterPrefix = enter.indentation;

			if (enter.indentAction === IndentAction.None) {
				enterPrefix = enter.indentation + enter.appendText;
			} else if (enter.indentAction === IndentAction.Indent) {
				enterPrefix = enter.indentation + enter.appendText;
			} else if (enter.indentAction === IndentAction.IndentOutdent) {
				enterPrefix = enter.indentation;
			} else if (enter.indentAction === IndentAction.Outdent) {
				enterPrefix = indentConverter.unshiftIndent(enter.indentation) + enter.appendText;
			}
			const movingLineText = model.getLineContent(line);
			if (this.trimStart(movingLineText).indexOf(this.trimStart(enterPrefix)) >= 0) {
				const oldIndentation = strings.getLeadingWhitespace(model.getLineContent(line));
				let newIndentation = strings.getLeadingWhitespace(enterPrefix);
				const indentMetadataOfMovelingLine = getIndentMetadata(model, line, this._languageConfigurationService);
				if (indentMetadataOfMovelingLine !== null && indentMetadataOfMovelingLine & IndentConsts.DECREASE_MASK) {
					newIndentation = indentConverter.unshiftIndent(newIndentation);
				}
				const newSpaceCnt = indentUtils.getSpaceCnt(newIndentation, tabSize);
				const oldSpaceCnt = indentUtils.getSpaceCnt(oldIndentation, tabSize);
				return newSpaceCnt - oldSpaceCnt;
			}
		}

		return null;
	}

	/**
	 *
	 * @param model
	 * @param indentConverter
	 * @param tabSize
	 * @param line the line moving down
	 * @param futureAboveLineNumber the line which will be at the `line` position
	 * @param futureAboveLineText
	 */
	private matchEnterRuleMovingDown(model: ITextModel, indentConverter: IIndentConverter, tabSize: number, line: number, futureAboveLineNumber: number, futureAboveLineText: string) {
		if (strings.lastNonWhitespaceIndex(futureAboveLineText) >= 0) {
			// break
			const maxColumn = model.getLineMaxColumn(futureAboveLineNumber);
			const enter = getEnterAction(this._autoIndent, model, new Range(futureAboveLineNumber, maxColumn, futureAboveLineNumber, maxColumn), this._languageConfigurationService);
			return this.parseEnterResult(model, indentConverter, tabSize, line, enter);
		} else {
			// go upwards, starting from `line - 1`
			let validPrecedingLine = line - 1;
			while (validPrecedingLine >= 1) {
				const lineContent = model.getLineContent(validPrecedingLine);
				const nonWhitespaceIdx = strings.lastNonWhitespaceIndex(lineContent);

				if (nonWhitespaceIdx >= 0) {
					break;
				}

				validPrecedingLine--;
			}

			if (validPrecedingLine < 1 || line > model.getLineCount()) {
				return null;
			}

			const maxColumn = model.getLineMaxColumn(validPrecedingLine);
			const enter = getEnterAction(this._autoIndent, model, new Range(validPrecedingLine, maxColumn, validPrecedingLine, maxColumn), this._languageConfigurationService);
			return this.parseEnterResult(model, indentConverter, tabSize, line, enter);
		}
	}

	private matchEnterRule(model: ITextModel, indentConverter: IIndentConverter, tabSize: number, line: number, oneLineAbove: number, previousLineText?: string) {
		let validPrecedingLine = oneLineAbove;
		while (validPrecedingLine >= 1) {
			// ship empty lines as empty lines just inherit indentation
			let lineContent;
			if (validPrecedingLine === oneLineAbove && previousLineText !== undefined) {
				lineContent = previousLineText;
			} else {
				lineContent = model.getLineContent(validPrecedingLine);
			}

			const nonWhitespaceIdx = strings.lastNonWhitespaceIndex(lineContent);
			if (nonWhitespaceIdx >= 0) {
				break;
			}
			validPrecedingLine--;
		}

		if (validPrecedingLine < 1 || line > model.getLineCount()) {
			return null;
		}

		const maxColumn = model.getLineMaxColumn(validPrecedingLine);
		const enter = getEnterAction(this._autoIndent, model, new Range(validPrecedingLine, maxColumn, validPrecedingLine, maxColumn), this._languageConfigurationService);
		return this.parseEnterResult(model, indentConverter, tabSize, line, enter);
	}

	private trimStart(str: string) {
		return str.replace(/^\s+/, '');
	}

	private shouldAutoIndent(model: ITextModel, selection: Selection) {
		if (this._autoIndent < EditorAutoIndentStrategy.Full) {
			return false;
		}
		// if it's not easy to tokenize, we stop auto indent.
		if (!model.tokenization.isCheapToTokenize(selection.startLineNumber)) {
			return false;
		}
		const languageAtSelectionStart = model.getLanguageIdAtPosition(selection.startLineNumber, 1);
		const languageAtSelectionEnd = model.getLanguageIdAtPosition(selection.endLineNumber, 1);

		if (languageAtSelectionStart !== languageAtSelectionEnd) {
			return false;
		}

		if (this._languageConfigurationService.getLanguageConfiguration(languageAtSelectionStart).indentRulesSupport === null) {
			return false;
		}

		return true;
	}

	private getIndentEditsOfMovingBlock(model: ITextModel, builder: IEditOperationBuilder, s: Selection, tabSize: number, insertSpaces: boolean, offset: number) {
		for (let i = s.startLineNumber; i <= s.endLineNumber; i++) {
			const lineContent = model.getLineContent(i);
			const originalIndent = strings.getLeadingWhitespace(lineContent);
			const originalSpacesCnt = indentUtils.getSpaceCnt(originalIndent, tabSize);
			const newSpacesCnt = originalSpacesCnt + offset;
			const newIndent = indentUtils.generateIndent(newSpacesCnt, tabSize, insertSpaces);

			if (newIndent !== originalIndent) {
				builder.addEditOperation(new Range(i, 1, i, originalIndent.length + 1), newIndent);

				if (i === s.endLineNumber && s.endColumn <= originalIndent.length + 1 && newIndent === '') {
					// as users select part of the original indent white spaces
					// when we adjust the indentation of endLine, we should adjust the cursor position as well.
					this._moveEndLineSelectionShrink = true;
				}
			}

		}
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		let result = helper.getTrackedSelection(this._selectionId!);

		if (this._moveEndPositionDown) {
			result = result.setEndPosition(result.endLineNumber + 1, 1);
		}

		if (this._moveEndLineSelectionShrink && result.startLineNumber < result.endLineNumber) {
			result = result.setEndPosition(result.endLineNumber, 2);
		}

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/browser/sortLinesCommand.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/browser/sortLinesCommand.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeIntl } from '../../../../base/common/date.js';
import { Lazy } from '../../../../base/common/lazy.js';
import { EditOperation, ISingleEditOperation } from '../../../common/core/editOperation.js';
import { Range } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder } from '../../../common/editorCommon.js';
import { ITextModel } from '../../../common/model.js';

export class SortLinesCommand implements ICommand {

	static _COLLATOR: Lazy<Intl.Collator> = safeIntl.Collator();

	private readonly selection: Selection;
	private readonly descending: boolean;
	private selectionId: string | null;

	constructor(selection: Selection, descending: boolean) {
		this.selection = selection;
		this.descending = descending;
		this.selectionId = null;
	}

	public getEditOperations(model: ITextModel, builder: IEditOperationBuilder): void {
		const op = sortLines(model, this.selection, this.descending);
		if (op) {
			builder.addEditOperation(op.range, op.text);
		}

		this.selectionId = builder.trackSelection(this.selection);
	}

	public computeCursorState(model: ITextModel, helper: ICursorStateComputerData): Selection {
		return helper.getTrackedSelection(this.selectionId!);
	}

	public static canRun(model: ITextModel | null, selection: Selection, descending: boolean): boolean {
		if (model === null) {
			return false;
		}

		const data = getSortData(model, selection, descending);

		if (!data) {
			return false;
		}

		for (let i = 0, len = data.before.length; i < len; i++) {
			if (data.before[i] !== data.after[i]) {
				return true;
			}
		}

		return false;
	}
}

function getSortData(model: ITextModel, selection: Selection, descending: boolean) {
	const startLineNumber = selection.startLineNumber;
	let endLineNumber = selection.endLineNumber;

	if (selection.endColumn === 1) {
		endLineNumber--;
	}

	// Nothing to sort if user didn't select anything.
	if (startLineNumber >= endLineNumber) {
		return null;
	}

	const linesToSort: string[] = [];

	// Get the contents of the selection to be sorted.
	for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
		linesToSort.push(model.getLineContent(lineNumber));
	}

	let sorted = linesToSort.slice(0);
	sorted.sort(SortLinesCommand._COLLATOR.value.compare);

	// If descending, reverse the order.
	if (descending === true) {
		sorted = sorted.reverse();
	}

	return {
		startLineNumber: startLineNumber,
		endLineNumber: endLineNumber,
		before: linesToSort,
		after: sorted
	};
}

/**
 * Generate commands for sorting lines on a model.
 */
function sortLines(model: ITextModel, selection: Selection, descending: boolean): ISingleEditOperation | null {
	const data = getSortData(model, selection, descending);

	if (!data) {
		return null;
	}

	return EditOperation.replace(
		new Range(data.startLineNumber, 1, data.endLineNumber, model.getLineMaxColumn(data.endLineNumber)),
		data.after.join('\n')
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/test/browser/copyLinesCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/test/browser/copyLinesCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { CopyLinesCommand } from '../../browser/copyLinesCommand.js';
import { DuplicateSelectionAction } from '../../browser/linesOperations.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { testCommand } from '../../../../test/browser/testCommand.js';

function testCopyLinesDownCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new CopyLinesCommand(sel, true), expectedLines, expectedSelection);
}

function testCopyLinesUpCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new CopyLinesCommand(sel, false), expectedLines, expectedSelection);
}

suite('Editor Contrib - Copy Lines Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('copy first line down', function () {
		testCopyLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 1),
			[
				'first',
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 2, 1)
		);
	});

	test('copy first line up', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 1),
			[
				'first',
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 1)
		);
	});

	test('copy last line down', function () {
		testCopyLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 3, 5, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth',
				'fifth'
			],
			new Selection(6, 3, 6, 1)
		);
	});

	test('copy last line up', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 3, 5, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth',
				'fifth'
			],
			new Selection(5, 3, 5, 1)
		);
	});

	test('issue #1322: copy line up', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 11, 3, 11),
			[
				'first',
				'second line',
				'third line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 11, 3, 11)
		);
	});

	test('issue #1322: copy last line up', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 6, 5, 6),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth',
				'fifth'
			],
			new Selection(5, 6, 5, 6)
		);
	});

	test('copy many lines up', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 3, 2, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 3, 2, 1)
		);
	});

	test('ignore empty selection', function () {
		testCopyLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 1),
			[
				'first',
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 1)
		);
	});
});

suite('Editor Contrib - Duplicate Selection', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const duplicateSelectionAction = new DuplicateSelectionAction();

	function testDuplicateSelectionAction(lines: string[], selections: Selection[], expectedLines: string[], expectedSelections: Selection[]): void {
		withTestCodeEditor(lines.join('\n'), {}, (editor) => {
			editor.setSelections(selections);
			duplicateSelectionAction.run(null!, editor, {});
			assert.deepStrictEqual(editor.getValue(), expectedLines.join('\n'));
			assert.deepStrictEqual(editor.getSelections()!.map(s => s.toString()), expectedSelections.map(s => s.toString()));
		});
	}

	test('empty selection', function () {
		testDuplicateSelectionAction(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			[new Selection(2, 2, 2, 2), new Selection(3, 2, 3, 2)],
			[
				'first',
				'second line',
				'second line',
				'third line',
				'third line',
				'fourth line',
				'fifth'
			],
			[new Selection(3, 2, 3, 2), new Selection(5, 2, 5, 2)]
		);
	});

	test('with selection', function () {
		testDuplicateSelectionAction(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			[new Selection(2, 1, 2, 4), new Selection(3, 1, 3, 4)],
			[
				'first',
				'secsecond line',
				'thithird line',
				'fourth line',
				'fifth'
			],
			[new Selection(2, 4, 2, 7), new Selection(3, 4, 3, 7)]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/test/browser/linesOperations.test.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/test/browser/linesOperations.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CoreEditingCommands } from '../../../../browser/coreCommands.js';
import type { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorAction } from '../../../../browser/editorExtensions.js';
import { Position } from '../../../../common/core/position.js';
import { Selection } from '../../../../common/core/selection.js';
import { Handler } from '../../../../common/editorCommon.js';
import { ITextModel } from '../../../../common/model.js';
import { ViewModel } from '../../../../common/viewModel/viewModelImpl.js';
import { CamelCaseAction, PascalCaseAction, DeleteAllLeftAction, DeleteAllRightAction, DeleteDuplicateLinesAction, DeleteLinesAction, IndentLinesAction, InsertLineAfterAction, InsertLineBeforeAction, JoinLinesAction, KebabCaseAction, LowerCaseAction, SnakeCaseAction, SortLinesAscendingAction, SortLinesDescendingAction, TitleCaseAction, TransposeAction, UpperCaseAction, ReverseLinesAction } from '../../browser/linesOperations.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { createTextModel } from '../../../../test/common/testTextModel.js';

function assertSelection(editor: ICodeEditor, expected: Selection | Selection[]): void {
	if (!Array.isArray(expected)) {
		expected = [expected];
	}
	assert.deepStrictEqual(editor.getSelections(), expected);
}

function executeAction(action: EditorAction, editor: ICodeEditor): void {
	action.run(null!, editor, undefined);
}

suite('Editor Contrib - Line Operations', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	suite('SortLinesAscendingAction', () => {
		test('should sort selected lines in ascending order', function () {
			withTestCodeEditor(
				[
					'omicron',
					'beta',
					'alpha'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const sortLinesAscendingAction = new SortLinesAscendingAction();

					editor.setSelection(new Selection(1, 1, 3, 5));
					executeAction(sortLinesAscendingAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron'
					]);
					assertSelection(editor, new Selection(1, 1, 3, 7));
				});
		});

		test('should sort lines in ascending order', function () {
			withTestCodeEditor(
				[
					'omicron',
					'beta',
					'alpha'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const sortLinesAscendingAction = new SortLinesAscendingAction();

					executeAction(sortLinesAscendingAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron'
					]);
				});
		});

		test('should sort multiple selections in ascending order', function () {
			withTestCodeEditor(
				[
					'omicron',
					'beta',
					'alpha',
					'',
					'omicron',
					'beta',
					'alpha'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const sortLinesAscendingAction = new SortLinesAscendingAction();

					editor.setSelections([new Selection(1, 1, 3, 5), new Selection(5, 1, 7, 5)]);
					executeAction(sortLinesAscendingAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron',
						'',
						'alpha',
						'beta',
						'omicron'
					]);
					const expectedSelections = [
						new Selection(1, 1, 3, 7),
						new Selection(5, 1, 7, 7)
					];
					editor.getSelections()!.forEach((actualSelection, index) => {
						assert.deepStrictEqual(actualSelection.toString(), expectedSelections[index].toString());
					});
				});
		});
	});

	suite('SortLinesDescendingAction', () => {
		test('should sort selected lines in descending order', function () {
			withTestCodeEditor(
				[
					'alpha',
					'beta',
					'omicron'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const sortLinesDescendingAction = new SortLinesDescendingAction();

					editor.setSelection(new Selection(1, 1, 3, 7));
					executeAction(sortLinesDescendingAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'omicron',
						'beta',
						'alpha'
					]);
					assertSelection(editor, new Selection(1, 1, 3, 5));
				});
		});

		test('should sort multiple selections in descending order', function () {
			withTestCodeEditor(
				[
					'alpha',
					'beta',
					'omicron',
					'',
					'alpha',
					'beta',
					'omicron'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const sortLinesDescendingAction = new SortLinesDescendingAction();

					editor.setSelections([new Selection(1, 1, 3, 7), new Selection(5, 1, 7, 7)]);
					executeAction(sortLinesDescendingAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'omicron',
						'beta',
						'alpha',
						'',
						'omicron',
						'beta',
						'alpha'
					]);
					const expectedSelections = [
						new Selection(1, 1, 3, 5),
						new Selection(5, 1, 7, 5)
					];
					editor.getSelections()!.forEach((actualSelection, index) => {
						assert.deepStrictEqual(actualSelection.toString(), expectedSelections[index].toString());
					});
				});
		});
	});

	suite('DeleteDuplicateLinesAction', () => {
		test('should remove duplicate lines within selection', function () {
			withTestCodeEditor(
				[
					'alpha',
					'beta',
					'beta',
					'beta',
					'alpha',
					'omicron',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteDuplicateLinesAction = new DeleteDuplicateLinesAction();

					editor.setSelection(new Selection(1, 3, 6, 4));
					executeAction(deleteDuplicateLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron',
					]);
					assertSelection(editor, new Selection(1, 1, 3, 8));
				});
		});

		test('should remove duplicate lines', function () {
			withTestCodeEditor(
				[
					'alpha',
					'beta',
					'beta',
					'beta',
					'alpha',
					'omicron',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteDuplicateLinesAction = new DeleteDuplicateLinesAction();

					executeAction(deleteDuplicateLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron',
					]);
					assert.ok(editor.getSelection().isEmpty());
				});
		});

		test('should remove duplicate lines in multiple selections', function () {
			withTestCodeEditor(
				[
					'alpha',
					'beta',
					'beta',
					'omicron',
					'',
					'alpha',
					'alpha',
					'beta'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteDuplicateLinesAction = new DeleteDuplicateLinesAction();

					editor.setSelections([new Selection(1, 2, 4, 3), new Selection(6, 2, 8, 3)]);
					executeAction(deleteDuplicateLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), [
						'alpha',
						'beta',
						'omicron',
						'',
						'alpha',
						'beta'
					]);
					const expectedSelections = [
						new Selection(1, 1, 3, 8),
						new Selection(5, 1, 6, 5)
					];
					editor.getSelections()!.forEach((actualSelection, index) => {
						assert.deepStrictEqual(actualSelection.toString(), expectedSelections[index].toString());
					});
				});
		});
	});


	suite('DeleteAllLeftAction', () => {
		test('should delete to the left of the cursor', function () {
			withTestCodeEditor(
				[
					'one',
					'two',
					'three'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteAllLeftAction = new DeleteAllLeftAction();

					editor.setSelection(new Selection(1, 2, 1, 2));
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(1), 'ne');

					editor.setSelections([new Selection(2, 2, 2, 2), new Selection(3, 2, 3, 2)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(2), 'wo');
					assert.strictEqual(model.getLineContent(3), 'hree');
				});
		});

		test('should jump to the previous line when on first column', function () {
			withTestCodeEditor(
				[
					'one',
					'two',
					'three'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteAllLeftAction = new DeleteAllLeftAction();

					editor.setSelection(new Selection(2, 1, 2, 1));
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(1), 'onetwo');

					editor.setSelections([new Selection(1, 1, 1, 1), new Selection(2, 1, 2, 1)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLinesContent()[0], 'onetwothree');
					assert.strictEqual(model.getLinesContent().length, 1);

					editor.setSelection(new Selection(1, 1, 1, 1));
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLinesContent()[0], 'onetwothree');
				});
		});

		test('should keep deleting lines in multi cursor mode', function () {
			withTestCodeEditor(
				[
					'hi my name is Carlos Matos',
					'BCC',
					'waso waso waso',
					'my wife doesnt believe in me',
					'nonononono',
					'bitconneeeect'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteAllLeftAction = new DeleteAllLeftAction();

					const beforeSecondWasoSelection = new Selection(3, 5, 3, 5);
					const endOfBCCSelection = new Selection(2, 4, 2, 4);
					const endOfNonono = new Selection(5, 11, 5, 11);

					editor.setSelections([beforeSecondWasoSelection, endOfBCCSelection, endOfNonono]);

					executeAction(deleteAllLeftAction, editor);
					let selections = editor.getSelections()!;

					assert.strictEqual(model.getLineContent(2), '');
					assert.strictEqual(model.getLineContent(3), ' waso waso');
					assert.strictEqual(model.getLineContent(5), '');

					assert.deepStrictEqual([
						selections[0].startLineNumber,
						selections[0].startColumn,
						selections[0].endLineNumber,
						selections[0].endColumn
					], [3, 1, 3, 1]);

					assert.deepStrictEqual([
						selections[1].startLineNumber,
						selections[1].startColumn,
						selections[1].endLineNumber,
						selections[1].endColumn
					], [2, 1, 2, 1]);

					assert.deepStrictEqual([
						selections[2].startLineNumber,
						selections[2].startColumn,
						selections[2].endLineNumber,
						selections[2].endColumn
					], [5, 1, 5, 1]);

					executeAction(deleteAllLeftAction, editor);
					selections = editor.getSelections()!;

					assert.strictEqual(model.getLineContent(1), 'hi my name is Carlos Matos waso waso');
					assert.strictEqual(selections.length, 2);

					assert.deepStrictEqual([
						selections[0].startLineNumber,
						selections[0].startColumn,
						selections[0].endLineNumber,
						selections[0].endColumn
					], [1, 27, 1, 27]);

					assert.deepStrictEqual([
						selections[1].startLineNumber,
						selections[1].startColumn,
						selections[1].endLineNumber,
						selections[1].endColumn
					], [2, 29, 2, 29]);
				});
		});

		test('should work in multi cursor mode', function () {
			withTestCodeEditor(
				[
					'hello',
					'world',
					'hello world',
					'hello',
					'bonjour',
					'hola',
					'world',
					'hello world',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteAllLeftAction = new DeleteAllLeftAction();

					editor.setSelections([new Selection(1, 2, 1, 2), new Selection(1, 4, 1, 4)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(1), 'lo');

					editor.setSelections([new Selection(2, 2, 2, 2), new Selection(2, 4, 2, 5)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(2), 'd');

					editor.setSelections([new Selection(3, 2, 3, 5), new Selection(3, 7, 3, 7)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(3), 'world');

					editor.setSelections([new Selection(4, 3, 4, 3), new Selection(4, 5, 5, 4)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(4), 'jour');

					editor.setSelections([new Selection(5, 3, 6, 3), new Selection(6, 5, 7, 5), new Selection(7, 7, 7, 7)]);
					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(5), 'world');
				});
		});

		test('issue #36234: should push undo stop', () => {
			withTestCodeEditor(
				[
					'one',
					'two',
					'three'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const deleteAllLeftAction = new DeleteAllLeftAction();

					editor.setSelection(new Selection(1, 1, 1, 1));

					editor.trigger('keyboard', Handler.Type, { text: 'Typing some text here on line ' });
					assert.strictEqual(model.getLineContent(1), 'Typing some text here on line one');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 31, 1, 31));

					executeAction(deleteAllLeftAction, editor);
					assert.strictEqual(model.getLineContent(1), 'one');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 1, 1, 1));

					editor.runCommand(CoreEditingCommands.Undo, null);
					assert.strictEqual(model.getLineContent(1), 'Typing some text here on line one');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 31, 1, 31));
				});
		});
	});

	suite('JoinLinesAction', () => {
		test('should join lines and insert space if necessary', function () {
			withTestCodeEditor(
				[
					'hello',
					'world',
					'hello ',
					'world',
					'hello		',
					'	world',
					'hello   ',
					'	world',
					'',
					'',
					'hello world'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const joinLinesAction = new JoinLinesAction();

					editor.setSelection(new Selection(1, 2, 1, 2));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(1), 'hello world');
					assertSelection(editor, new Selection(1, 6, 1, 6));

					editor.setSelection(new Selection(2, 2, 2, 2));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(2), 'hello world');
					assertSelection(editor, new Selection(2, 7, 2, 7));

					editor.setSelection(new Selection(3, 2, 3, 2));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(3), 'hello world');
					assertSelection(editor, new Selection(3, 7, 3, 7));

					editor.setSelection(new Selection(4, 2, 5, 3));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(4), 'hello world');
					assertSelection(editor, new Selection(4, 2, 4, 8));

					editor.setSelection(new Selection(5, 1, 7, 3));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(5), 'hello world');
					assertSelection(editor, new Selection(5, 1, 5, 3));
				});
		});

		test('#50471 Join lines at the end of document', function () {
			withTestCodeEditor(
				[
					'hello',
					'world'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const joinLinesAction = new JoinLinesAction();

					editor.setSelection(new Selection(2, 1, 2, 1));
					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(1), 'hello');
					assert.strictEqual(model.getLineContent(2), 'world');
					assertSelection(editor, new Selection(2, 6, 2, 6));
				});
		});

		test('should work in multi cursor mode', function () {
			withTestCodeEditor(
				[
					'hello',
					'world',
					'hello ',
					'world',
					'hello		',
					'	world',
					'hello   ',
					'	world',
					'',
					'',
					'hello world'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const joinLinesAction = new JoinLinesAction();

					editor.setSelections([
						/** primary cursor */
						new Selection(5, 2, 5, 2),
						new Selection(1, 2, 1, 2),
						new Selection(3, 2, 4, 2),
						new Selection(5, 4, 6, 3),
						new Selection(7, 5, 8, 4),
						new Selection(10, 1, 10, 1)
					]);

					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLinesContent().join('\n'), 'hello world\nhello world\nhello world\nhello world\n\nhello world');
					assertSelection(editor, [
						/** primary cursor */
						new Selection(3, 4, 3, 8),
						new Selection(1, 6, 1, 6),
						new Selection(2, 2, 2, 8),
						new Selection(4, 5, 4, 9),
						new Selection(6, 1, 6, 1)
					]);
				});
		});

		test('should push undo stop', function () {
			withTestCodeEditor(
				[
					'hello',
					'world'
				], {}, (editor) => {
					const model = editor.getModel()!;
					const joinLinesAction = new JoinLinesAction();

					editor.setSelection(new Selection(1, 6, 1, 6));

					editor.trigger('keyboard', Handler.Type, { text: ' my dear' });
					assert.strictEqual(model.getLineContent(1), 'hello my dear');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 14, 1, 14));

					executeAction(joinLinesAction, editor);
					assert.strictEqual(model.getLineContent(1), 'hello my dear world');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 14, 1, 14));

					editor.runCommand(CoreEditingCommands.Undo, null);
					assert.strictEqual(model.getLineContent(1), 'hello my dear');
					assert.deepStrictEqual(editor.getSelection(), new Selection(1, 14, 1, 14));
				});
		});
	});

	suite('ReverseLinesAction', () => {
		test('reverses lines', function () {
			withTestCodeEditor(
				[
					'alice',
					'bob',
					'charlie',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['charlie', 'bob', 'alice']);
				});
		});

		test('excludes empty last line', function () {
			withTestCodeEditor(
				[
					'alice',
					'bob',
					'charlie',
					'',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['charlie', 'bob', 'alice', '']);
				});
		});

		test('updates cursor', function () {
			withTestCodeEditor(
				[
					'alice',
					'bob',
					'charlie',
				], {}, (editor) => {
					const reverseLinesAction = new ReverseLinesAction();
					// cursor at third column of third line 'charlie'
					editor.setPosition(new Position(3, 3));

					executeAction(reverseLinesAction, editor);
					// cursor at third column of *first* line 'charlie'
					assert.deepStrictEqual(editor.getPosition(), new Position(1, 3));
				});
		});

		test('preserves cursor on empty last line', function () {
			withTestCodeEditor(
				[
					'alice',
					'bob',
					'charlie',
					'',
				], {}, (editor) => {
					const reverseLinesAction = new ReverseLinesAction();
					editor.setPosition(new Position(4, 1));

					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(editor.getPosition(), new Position(4, 1));
				});
		});

		test('preserves selected text when selections do not span lines', function () {
			withTestCodeEditor(
				[
					'alice',
					'bob',
					'charlie',
					'',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();
					editor.setSelections([new Selection(1, 1, 1, 3), new Selection(2, 1, 2, 4), new Selection(3, 1, 3, 5)]);
					const expectedSelectedText: string[] = ['al', 'bob', 'char'];
					assert.deepStrictEqual(editor.getSelections().map(s => model.getValueInRange(s)), expectedSelectedText);

					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(editor.getSelections().map(s => model.getValueInRange(s)), expectedSelectedText);
				});
		});

		test('reverses lines within selection', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
					'line4',
					'line5',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					// Select lines 2-4
					editor.setSelection(new Selection(2, 1, 4, 6));
					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['line1', 'line4', 'line3', 'line2', 'line5']);
				});
		});

		test('reverses lines within partial selection', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
					'line4',
					'line5',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					// Select partial lines 2-4 (from middle of line2 to middle of line4)
					editor.setSelection(new Selection(2, 3, 4, 3));
					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['line1', 'line4', 'line3', 'line2', 'line5']);
				});
		});

		test('reverses lines with multiple selections', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
					'line4',
					'line5',
					'line6',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					// Select lines 1-2 and lines 4-5
					editor.setSelections([new Selection(1, 1, 2, 6), new Selection(4, 1, 5, 6)]);
					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['line2', 'line1', 'line3', 'line5', 'line4', 'line6']);
				});
		});

		test('updates selection positions after reversal', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
					'line4',
				], {}, (editor) => {
					const reverseLinesAction = new ReverseLinesAction();

					// Select lines 1-3
					editor.setSelection(new Selection(1, 2, 3, 3));
					executeAction(reverseLinesAction, editor);

					// After reversal, selection should be updated to maintain relative position
					// Originally line 1 col 2 -> line 3 col 3, so after reversal should be line 3 col 2 -> line 1 col 3
					const selection = editor.getSelection()!;
					// The selection should cover the same logical text after reversal
					// Range normalization ensures startLineNumber <= endLineNumber
					assert.strictEqual(selection.startLineNumber, 1);
					assert.strictEqual(selection.startColumn, 3);
					assert.strictEqual(selection.endLineNumber, 3);
					assert.strictEqual(selection.endColumn, 2);
				});
		});

		test('handles single line selection', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					// Select only line 2
					editor.setSelection(new Selection(2, 1, 2, 6));
					executeAction(reverseLinesAction, editor);
					// Single line should remain unchanged
					assert.deepStrictEqual(model.getLinesContent(), ['line1', 'line2', 'line3']);
				});
		});

		test('excludes end line when selection ends at column 1', function () {
			withTestCodeEditor(
				[
					'line1',
					'line2',
					'line3',
					'line4',
					'line5',
				], {}, (editor) => {
					const model = editor.getModel()!;
					const reverseLinesAction = new ReverseLinesAction();

					// Select from line 2 to line 4 column 1 (should exclude line 4)
					editor.setSelection(new Selection(2, 1, 4, 1));
					executeAction(reverseLinesAction, editor);
					assert.deepStrictEqual(model.getLinesContent(), ['line1', 'line3', 'line2', 'line4', 'line5']);
				});
		});
	});

	test('transpose', () => {
		withTestCodeEditor(
			[
				'hello world',
				'',
				'',
				'   ',
			], {}, (editor) => {
				const model = editor.getModel()!;
				const transposeAction = new TransposeAction();

				editor.setSelection(new Selection(1, 1, 1, 1));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hello world');
				assertSelection(editor, new Selection(1, 2, 1, 2));

				editor.setSelection(new Selection(1, 6, 1, 6));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hell oworld');
				assertSelection(editor, new Selection(1, 7, 1, 7));

				editor.setSelection(new Selection(1, 12, 1, 12));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hell oworl');
				assertSelection(editor, new Selection(2, 2, 2, 2));

				editor.setSelection(new Selection(3, 1, 3, 1));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(3), '');
				assertSelection(editor, new Selection(4, 1, 4, 1));

				editor.setSelection(new Selection(4, 2, 4, 2));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(4), '   ');
				assertSelection(editor, new Selection(4, 3, 4, 3));
			}
		);

		// fix #16633
		withTestCodeEditor(
			[
				'',
				'',
				'hello',
				'world',
				'',
				'hello world',
				'',
				'hello world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const transposeAction = new TransposeAction();

				editor.setSelection(new Selection(1, 1, 1, 1));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(2), '');
				assertSelection(editor, new Selection(2, 1, 2, 1));

				editor.setSelection(new Selection(3, 6, 3, 6));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(4), 'oworld');
				assertSelection(editor, new Selection(4, 2, 4, 2));

				editor.setSelection(new Selection(6, 12, 6, 12));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(7), 'd');
				assertSelection(editor, new Selection(7, 2, 7, 2));

				editor.setSelection(new Selection(8, 12, 8, 12));
				executeAction(transposeAction, editor);
				assert.strictEqual(model.getLineContent(8), 'hello world');
				assertSelection(editor, new Selection(8, 12, 8, 12));
			}
		);
	});

	test('toggle case', function () {
		withTestCodeEditor(
			[
				'hello world',
				'öçşğü',
				'parseHTMLString',
				'getElementById',
				'insertHTML',
				'PascalCase',
				'CSSSelectorsList',
				'iD',
				'tEST',
				'öçşÖÇŞğüĞÜ',
				'audioConverter.convertM4AToMP3();',
				'snake_case',
				'Capital_Snake_Case',
				`function helloWorld() {
				return someGlobalObject.printHelloWorld("en", "utf-8");
				}
				helloWorld();`.replace(/^\s+/gm, ''),
				`'JavaScript'`,
				'parseHTML4String',
				'_accessor: ServicesAccessor'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const uppercaseAction = new UpperCaseAction();
				const lowercaseAction = new LowerCaseAction();
				const titlecaseAction = new TitleCaseAction();
				const snakecaseAction = new SnakeCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(uppercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'HELLO WORLD');
				assertSelection(editor, new Selection(1, 1, 1, 12));

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(lowercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hello world');
				assertSelection(editor, new Selection(1, 1, 1, 12));

				editor.setSelection(new Selection(1, 3, 1, 3));
				executeAction(uppercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'HELLO world');
				assertSelection(editor, new Selection(1, 3, 1, 3));

				editor.setSelection(new Selection(1, 4, 1, 4));
				executeAction(lowercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hello world');
				assertSelection(editor, new Selection(1, 4, 1, 4));

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'Hello World');
				assertSelection(editor, new Selection(1, 1, 1, 12));

				editor.setSelection(new Selection(2, 1, 2, 6));
				executeAction(uppercaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'ÖÇŞĞÜ');
				assertSelection(editor, new Selection(2, 1, 2, 6));

				editor.setSelection(new Selection(2, 1, 2, 6));
				executeAction(lowercaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'öçşğü');
				assertSelection(editor, new Selection(2, 1, 2, 6));

				editor.setSelection(new Selection(2, 1, 2, 6));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'Öçşğü');
				assertSelection(editor, new Selection(2, 1, 2, 6));

				editor.setSelection(new Selection(3, 1, 3, 16));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(3), 'parse_html_string');
				assertSelection(editor, new Selection(3, 1, 3, 18));

				editor.setSelection(new Selection(4, 1, 4, 15));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(4), 'get_element_by_id');
				assertSelection(editor, new Selection(4, 1, 4, 18));

				editor.setSelection(new Selection(5, 1, 5, 11));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(5), 'insert_html');
				assertSelection(editor, new Selection(5, 1, 5, 12));

				editor.setSelection(new Selection(6, 1, 6, 11));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(6), 'pascal_case');
				assertSelection(editor, new Selection(6, 1, 6, 12));

				editor.setSelection(new Selection(7, 1, 7, 17));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(7), 'css_selectors_list');
				assertSelection(editor, new Selection(7, 1, 7, 19));

				editor.setSelection(new Selection(8, 1, 8, 3));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(8), 'i_d');
				assertSelection(editor, new Selection(8, 1, 8, 4));

				editor.setSelection(new Selection(9, 1, 9, 5));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(9), 't_est');
				assertSelection(editor, new Selection(9, 1, 9, 6));

				editor.setSelection(new Selection(10, 1, 10, 11));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(10), 'öçş_öç_şğü_ğü');
				assertSelection(editor, new Selection(10, 1, 10, 14));

				editor.setSelection(new Selection(11, 1, 11, 34));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(11), 'audio_converter.convert_m4a_to_mp3();');
				assertSelection(editor, new Selection(11, 1, 11, 38));

				editor.setSelection(new Selection(12, 1, 12, 11));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(12), 'snake_case');
				assertSelection(editor, new Selection(12, 1, 12, 11));

				editor.setSelection(new Selection(13, 1, 13, 19));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(13), 'capital_snake_case');
				assertSelection(editor, new Selection(13, 1, 13, 19));

				editor.setSelection(new Selection(14, 1, 17, 14));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getValueInRange(new Selection(14, 1, 17, 15)), `function hello_world() {
					return some_global_object.print_hello_world("en", "utf-8");
				}
				hello_world();`.replace(/^\s+/gm, ''));
				assertSelection(editor, new Selection(14, 1, 17, 15));

				editor.setSelection(new Selection(18, 1, 18, 13));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(18), `'java_script'`);
				assertSelection(editor, new Selection(18, 1, 18, 14));

				editor.setSelection(new Selection(19, 1, 19, 17));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(19), 'parse_html4_string');
				assertSelection(editor, new Selection(19, 1, 19, 19));

				editor.setSelection(new Selection(20, 1, 20, 28));
				executeAction(snakecaseAction, editor);
				assert.strictEqual(model.getLineContent(20), '_accessor: services_accessor');
				assertSelection(editor, new Selection(20, 1, 20, 29));
			}
		);

		withTestCodeEditor(
			[
				'foO baR BaZ',
				'foO\'baR\'BaZ',
				'foO[baR]BaZ',
				'foO`baR~BaZ',
				'foO^baR%BaZ',
				'foO$baR!BaZ',
				'\'physician\'s assistant\''
			], {}, (editor) => {
				const model = editor.getModel()!;
				const titlecaseAction = new TitleCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'Foo Bar Baz');

				editor.setSelection(new Selection(2, 1, 2, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'Foo\'bar\'baz');

				editor.setSelection(new Selection(3, 1, 3, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(3), 'Foo[Bar]Baz');

				editor.setSelection(new Selection(4, 1, 4, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(4), 'Foo`Bar~Baz');

				editor.setSelection(new Selection(5, 1, 5, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(5), 'Foo^Bar%Baz');

				editor.setSelection(new Selection(6, 1, 6, 12));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(6), 'Foo$Bar!Baz');

				editor.setSelection(new Selection(7, 1, 7, 23));
				executeAction(titlecaseAction, editor);
				assert.strictEqual(model.getLineContent(7), '\'Physician\'s Assistant\'');
			}
		);

		withTestCodeEditor(
			[
				'camel from words',
				'from_snake_case',
				'from-kebab-case',
				'alreadyCamel',
				'ReTain_some_CAPitalization',
				'my_var.test_function()',
				'öçş_öç_şğü_ğü',
				'XMLHttpRequest',
				'\tfunction hello_world() {',
				'\t\treturn some_global_object;',
				'\t}',
			], {}, (editor) => {
				const model = editor.getModel()!;
				const camelcaseAction = new CamelCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 18));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'camelFromWords');

				editor.setSelection(new Selection(2, 1, 2, 15));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'fromSnakeCase');

				editor.setSelection(new Selection(3, 1, 3, 15));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(3), 'fromKebabCase');

				editor.setSelection(new Selection(4, 1, 4, 12));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(4), 'alreadyCamel');

				editor.setSelection(new Selection(5, 1, 5, 26));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(5), 'reTainSomeCAPitalization');

				editor.setSelection(new Selection(6, 1, 6, 23));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(6), 'myVar.testFunction()');

				editor.setSelection(new Selection(7, 1, 7, 14));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(7), 'öçşÖçŞğüĞü');

				editor.setSelection(new Selection(8, 1, 8, 14));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getLineContent(8), 'XMLHttpRequest');

				editor.setSelection(new Selection(9, 1, 11, 2));
				executeAction(camelcaseAction, editor);
				assert.strictEqual(model.getValueInRange(new Selection(9, 1, 11, 3)), '\tfunction helloWorld() {\n\t\treturn someGlobalObject;\n\t}');
			}
		);

		withTestCodeEditor(
			[
				'',
				'   '
			], {}, (editor) => {
				const model = editor.getModel()!;
				const uppercaseAction = new UpperCaseAction();
				const lowercaseAction = new LowerCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 1));
				executeAction(uppercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), '');
				assertSelection(editor, new Selection(1, 1, 1, 1));

				editor.setSelection(new Selection(1, 1, 1, 1));
				executeAction(lowercaseAction, editor);
				assert.strictEqual(model.getLineContent(1), '');
				assertSelection(editor, new Selection(1, 1, 1, 1));

				editor.setSelection(new Selection(2, 2, 2, 2));
				executeAction(uppercaseAction, editor);
				assert.strictEqual(model.getLineContent(2), '   ');
				assertSelection(editor, new Selection(2, 2, 2, 2));

				editor.setSelection(new Selection(2, 2, 2, 2));
				executeAction(lowercaseAction, editor);
				assert.strictEqual(model.getLineContent(2), '   ');
				assertSelection(editor, new Selection(2, 2, 2, 2));
			}
		);

		withTestCodeEditor(
			[
				'hello world',
				'öçşğü',
				'parseHTMLString',
				'getElementById',
				'PascalCase',
				'öçşÖÇŞğüĞÜ',
				'audioConverter.convertM4AToMP3();',
				'Capital_Snake_Case',
				'parseHTML4String',
				'_accessor: ServicesAccessor',
				'Kebab-Case',
			], {}, (editor) => {
				const model = editor.getModel()!;
				const kebabCaseAction = new KebabCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'hello world');
				assertSelection(editor, new Selection(1, 1, 1, 12));

				editor.setSelection(new Selection(2, 1, 2, 6));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'öçşğü');
				assertSelection(editor, new Selection(2, 1, 2, 6));

				editor.setSelection(new Selection(3, 1, 3, 16));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(3), 'parse-html-string');
				assertSelection(editor, new Selection(3, 1, 3, 18));

				editor.setSelection(new Selection(4, 1, 4, 15));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(4), 'get-element-by-id');
				assertSelection(editor, new Selection(4, 1, 4, 18));

				editor.setSelection(new Selection(5, 1, 5, 11));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(5), 'pascal-case');
				assertSelection(editor, new Selection(5, 1, 5, 12));

				editor.setSelection(new Selection(6, 1, 6, 11));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(6), 'öçş-öç-şğü-ğü');
				assertSelection(editor, new Selection(6, 1, 6, 14));

				editor.setSelection(new Selection(7, 1, 7, 34));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(7), 'audio-converter.convert-m4a-to-mp3();');
				assertSelection(editor, new Selection(7, 1, 7, 38));

				editor.setSelection(new Selection(8, 1, 8, 19));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(8), 'capital-snake-case');
				assertSelection(editor, new Selection(8, 1, 8, 19));

				editor.setSelection(new Selection(9, 1, 9, 17));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(9), 'parse-html4-string');
				assertSelection(editor, new Selection(9, 1, 9, 19));

				editor.setSelection(new Selection(10, 1, 10, 28));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(10), '_accessor: services-accessor');
				assertSelection(editor, new Selection(10, 1, 10, 29));

				editor.setSelection(new Selection(11, 1, 11, 11));
				executeAction(kebabCaseAction, editor);
				assert.strictEqual(model.getLineContent(11), 'kebab-case');
				assertSelection(editor, new Selection(11, 1, 11, 11));
			}
		);

		withTestCodeEditor(
			[
				'hello world',
				'öçşğü',
				'parseHTMLString',
				'getElementById',
				'PascalCase',
				'öçşÖÇŞğüĞÜ',
				'audioConverter.convertM4AToMP3();',
				'Capital_Snake_Case',
				'parseHTML4String',
				'Kebab-Case',
				'FOO_BAR',
				'FOO BAR A',
				'xML_HTTP-reQUEsT',
				'ÉCOLE',
				'ΩMEGA_CASE',
				'ДОМ_ТЕСТ',
			], {}, (editor) => {
				const model = editor.getModel()!;
				const pascalCaseAction = new PascalCaseAction();

				editor.setSelection(new Selection(1, 1, 1, 12));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(1), 'HelloWorld');
				assertSelection(editor, new Selection(1, 1, 1, 11));

				editor.setSelection(new Selection(2, 1, 2, 6));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(2), 'Öçşğü');
				assertSelection(editor, new Selection(2, 1, 2, 6));

				editor.setSelection(new Selection(3, 1, 3, 16));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(3), 'ParseHTMLString');
				assertSelection(editor, new Selection(3, 1, 3, 16));

				editor.setSelection(new Selection(4, 1, 4, 15));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(4), 'GetElementById');
				assertSelection(editor, new Selection(4, 1, 4, 15));

				editor.setSelection(new Selection(5, 1, 5, 11));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(5), 'PascalCase');
				assertSelection(editor, new Selection(5, 1, 5, 11));

				editor.setSelection(new Selection(6, 1, 6, 11));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(6), 'ÖçşÖÇŞğüĞÜ');
				assertSelection(editor, new Selection(6, 1, 6, 11));

				editor.setSelection(new Selection(7, 1, 7, 34));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(7), 'AudioConverter.ConvertM4AToMP3();');
				assertSelection(editor, new Selection(7, 1, 7, 34));

				editor.setSelection(new Selection(8, 1, 8, 19));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(8), 'CapitalSnakeCase');
				assertSelection(editor, new Selection(8, 1, 8, 17));

				editor.setSelection(new Selection(9, 1, 9, 17));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(9), 'ParseHTML4String');
				assertSelection(editor, new Selection(9, 1, 9, 17));

				editor.setSelection(new Selection(10, 1, 10, 11));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(10), 'KebabCase');
				assertSelection(editor, new Selection(10, 1, 10, 10));

				editor.setSelection(new Selection(9, 1, 10, 11));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getValueInRange(new Selection(9, 1, 10, 11)), 'ParseHTML4String\nKebabCase');
				assertSelection(editor, new Selection(9, 1, 10, 10));

				editor.setSelection(new Selection(11, 1, 11, 8));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(11), 'FooBar');
				assertSelection(editor, new Selection(11, 1, 11, 7));

				editor.setSelection(new Selection(12, 1, 12, 10));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(12), 'FooBarA');
				assertSelection(editor, new Selection(12, 1, 12, 8));

				editor.setSelection(new Selection(13, 1, 13, 17));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(13), 'XmlHttpReQUEsT');
				assertSelection(editor, new Selection(13, 1, 13, 15));

				editor.setSelection(new Selection(14, 1, 14, 6));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(14), 'École');
				assertSelection(editor, new Selection(14, 1, 14, 6));

				editor.setSelection(new Selection(15, 1, 15, 11));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(15), 'ΩmegaCase');
				assertSelection(editor, new Selection(15, 1, 15, 10));

				editor.setSelection(new Selection(16, 1, 16, 9));
				executeAction(pascalCaseAction, editor);
				assert.strictEqual(model.getLineContent(16), 'ДомТест');
				assertSelection(editor, new Selection(16, 1, 16, 8));

			}
		);
	});

	suite('DeleteAllRightAction', () => {
		test('should be noop on empty', () => {
			withTestCodeEditor([''], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 1, 1, 1)]);

				editor.setSelection(new Selection(1, 1, 1, 1));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 1, 1, 1)]);

				editor.setSelections([new Selection(1, 1, 1, 1), new Selection(1, 1, 1, 1), new Selection(1, 1, 1, 1)]);
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 1, 1, 1)]);
			});
		});

		test('should delete selected range', () => {
			withTestCodeEditor([
				'hello',
				'world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				editor.setSelection(new Selection(1, 2, 1, 5));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['ho', 'world']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 2, 1, 2)]);

				editor.setSelection(new Selection(1, 1, 2, 4));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['ld']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 1, 1, 1)]);

				editor.setSelection(new Selection(1, 1, 1, 3));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 1, 1, 1)]);
			});
		});

		test('should delete to the right of the cursor', () => {
			withTestCodeEditor([
				'hello',
				'world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				editor.setSelection(new Selection(1, 3, 1, 3));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['he', 'world']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 3, 1, 3)]);

				editor.setSelection(new Selection(2, 1, 2, 1));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['he', '']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(2, 1, 2, 1)]);
			});
		});

		test('should join two lines, if at the end of the line', () => {
			withTestCodeEditor([
				'hello',
				'world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				editor.setSelection(new Selection(1, 6, 1, 6));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['helloworld']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 6, 1, 6)]);

				editor.setSelection(new Selection(1, 6, 1, 6));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['hello']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 6, 1, 6)]);

				editor.setSelection(new Selection(1, 6, 1, 6));
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['hello']);
				assert.deepStrictEqual(editor.getSelections(), [new Selection(1, 6, 1, 6)]);
			});
		});

		test('should work with multiple cursors', () => {
			withTestCodeEditor([
				'hello',
				'there',
				'world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				editor.setSelections([
					new Selection(1, 3, 1, 3),
					new Selection(1, 6, 1, 6),
					new Selection(3, 4, 3, 4),
				]);
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['hethere', 'wor']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(2, 4, 2, 4)
				]);

				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['he', 'wor']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(2, 4, 2, 4)
				]);

				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['hewor']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(1, 6, 1, 6)
				]);

				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['he']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3)
				]);

				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['he']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3)
				]);
			});
		});

		test('should work with undo/redo', () => {
			withTestCodeEditor([
				'hello',
				'there',
				'world'
			], {}, (editor) => {
				const model = editor.getModel()!;
				const action = new DeleteAllRightAction();

				editor.setSelections([
					new Selection(1, 3, 1, 3),
					new Selection(1, 6, 1, 6),
					new Selection(3, 4, 3, 4),
				]);
				executeAction(action, editor);
				assert.deepStrictEqual(model.getLinesContent(), ['hethere', 'wor']);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(2, 4, 2, 4)
				]);

				editor.runCommand(CoreEditingCommands.Undo, null);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(1, 6, 1, 6),
					new Selection(3, 4, 3, 4)
				]);
				editor.runCommand(CoreEditingCommands.Redo, null);
				assert.deepStrictEqual(editor.getSelections(), [
					new Selection(1, 3, 1, 3),
					new Selection(2, 4, 2, 4)
				]);
			});
		});
	});

	test('InsertLineBeforeAction', () => {
		function testInsertLineBefore(lineNumber: number, column: number, callback: (model: ITextModel, viewModel: ViewModel) => void): void {
			const TEXT = [
				'First line',
				'Second line',
				'Third line'
			];
			withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
				editor.setPosition(new Position(lineNumber, column));
				const insertLineBeforeAction = new InsertLineBeforeAction();

				executeAction(insertLineBeforeAction, editor);
				callback(editor.getModel()!, viewModel);
			});
		}

		testInsertLineBefore(1, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(1, 1, 1, 1));
			assert.strictEqual(model.getLineContent(1), '');
			assert.strictEqual(model.getLineContent(2), 'First line');
			assert.strictEqual(model.getLineContent(3), 'Second line');
			assert.strictEqual(model.getLineContent(4), 'Third line');
		});

		testInsertLineBefore(2, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(2, 1, 2, 1));
			assert.strictEqual(model.getLineContent(1), 'First line');
			assert.strictEqual(model.getLineContent(2), '');
			assert.strictEqual(model.getLineContent(3), 'Second line');
			assert.strictEqual(model.getLineContent(4), 'Third line');
		});

		testInsertLineBefore(3, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(3, 1, 3, 1));
			assert.strictEqual(model.getLineContent(1), 'First line');
			assert.strictEqual(model.getLineContent(2), 'Second line');
			assert.strictEqual(model.getLineContent(3), '');
			assert.strictEqual(model.getLineContent(4), 'Third line');
		});
	});

	test('InsertLineAfterAction', () => {
		function testInsertLineAfter(lineNumber: number, column: number, callback: (model: ITextModel, viewModel: ViewModel) => void): void {
			const TEXT = [
				'First line',
				'Second line',
				'Third line'
			];
			withTestCodeEditor(TEXT, {}, (editor, viewModel) => {
				editor.setPosition(new Position(lineNumber, column));
				const insertLineAfterAction = new InsertLineAfterAction();

				executeAction(insertLineAfterAction, editor);
				callback(editor.getModel()!, viewModel);
			});
		}

		testInsertLineAfter(1, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(2, 1, 2, 1));
			assert.strictEqual(model.getLineContent(1), 'First line');
			assert.strictEqual(model.getLineContent(2), '');
			assert.strictEqual(model.getLineContent(3), 'Second line');
			assert.strictEqual(model.getLineContent(4), 'Third line');
		});

		testInsertLineAfter(2, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(3, 1, 3, 1));
			assert.strictEqual(model.getLineContent(1), 'First line');
			assert.strictEqual(model.getLineContent(2), 'Second line');
			assert.strictEqual(model.getLineContent(3), '');
			assert.strictEqual(model.getLineContent(4), 'Third line');
		});

		testInsertLineAfter(3, 3, (model, viewModel) => {
			assert.deepStrictEqual(viewModel.getSelection(), new Selection(4, 1, 4, 1));
			assert.strictEqual(model.getLineContent(1), 'First line');
			assert.strictEqual(model.getLineContent(2), 'Second line');
			assert.strictEqual(model.getLineContent(3), 'Third line');
			assert.strictEqual(model.getLineContent(4), '');
		});
	});

	test('Bug 18276:[editor] Indentation broken when selection is empty', () => {

		const model = createTextModel(
			[
				'function baz() {'
			].join('\n'),
			undefined,
			{
				insertSpaces: false,
			}
		);

		withTestCodeEditor(model, {}, (editor) => {
			const indentLinesAction = new IndentLinesAction();
			editor.setPosition(new Position(1, 2));

			executeAction(indentLinesAction, editor);
			assert.strictEqual(model.getLineContent(1), '\tfunction baz() {');
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 3, 1, 3));

			editor.runCommand(CoreEditingCommands.Tab, null);
			assert.strictEqual(model.getLineContent(1), '\tf\tunction baz() {');
		});

		model.dispose();
	});

	test('issue #80736: Indenting while the cursor is at the start of a line of text causes the added spaces or tab to be selected', () => {
		const model = createTextModel(
			[
				'Some text'
			].join('\n'),
			undefined,
			{
				insertSpaces: false,
			}
		);

		withTestCodeEditor(model, {}, (editor) => {
			const indentLinesAction = new IndentLinesAction();
			editor.setPosition(new Position(1, 1));

			executeAction(indentLinesAction, editor);
			assert.strictEqual(model.getLineContent(1), '\tSome text');
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 2, 1, 2));
		});

		model.dispose();
	});

	test('Indenting on empty line should move cursor', () => {
		const model = createTextModel(
			[
				''
			].join('\n')
		);

		withTestCodeEditor(model, { useTabStops: false }, (editor) => {
			const indentLinesAction = new IndentLinesAction();
			editor.setPosition(new Position(1, 1));

			executeAction(indentLinesAction, editor);
			assert.strictEqual(model.getLineContent(1), '    ');
			assert.deepStrictEqual(editor.getSelection(), new Selection(1, 5, 1, 5));
		});

		model.dispose();
	});

	test('issue #62112: Delete line does not work properly when multiple cursors are on line', () => {
		const TEXT = [
			'a',
			'foo boo',
			'too',
			'c',
		];
		withTestCodeEditor(TEXT, {}, (editor) => {
			editor.setSelections([
				new Selection(2, 4, 2, 4),
				new Selection(2, 8, 2, 8),
				new Selection(3, 4, 3, 4),
			]);
			const deleteLinesAction = new DeleteLinesAction();
			executeAction(deleteLinesAction, editor);

			assert.strictEqual(editor.getValue(), 'a\nc');
		});
	});

	function testDeleteLinesCommand(initialText: string[], _initialSelections: Selection | Selection[], resultingText: string[], _resultingSelections: Selection | Selection[]): void {
		const initialSelections = Array.isArray(_initialSelections) ? _initialSelections : [_initialSelections];
		const resultingSelections = Array.isArray(_resultingSelections) ? _resultingSelections : [_resultingSelections];
		withTestCodeEditor(initialText, {}, (editor) => {
			editor.setSelections(initialSelections);
			const deleteLinesAction = new DeleteLinesAction();
			executeAction(deleteLinesAction, editor);

			assert.strictEqual(editor.getValue(), resultingText.join('\n'));
			assert.deepStrictEqual(editor.getSelections(), resultingSelections);
		});
	}

	test('empty selection in middle of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 2, 3),
			[
				'first',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 3, 2, 3)
		);
	});

	test('empty selection at top of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5),
			[
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('empty selection at end of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 2, 5, 2),
			[
				'first',
				'second line',
				'third line',
				'fourth line'
			],
			new Selection(4, 2, 4, 2)
		);
	});

	test('with selection in middle of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 3, 2, 2),
			[
				'first',
				'fourth line',
				'fifth'
			],
			new Selection(2, 2, 2, 2)
		);
	});

	test('with selection at top of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 1, 5),
			[
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('with selection at end of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 1, 5, 2),
			[
				'first',
				'second line',
				'third line',
				'fourth line'
			],
			new Selection(4, 2, 4, 2)
		);
	});

	test('with full line selection in middle of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 1, 2, 1),
			[
				'first',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 2, 1)
		);
	});

	test('with full line selection at top of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 5),
			[
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 5, 1, 5)
		);
	});

	test('with full line selection at end of lines', function () {
		testDeleteLinesCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 1, 5, 2),
			[
				'first',
				'second line',
				'third line'
			],
			new Selection(3, 2, 3, 2)
		);
	});

	test('multicursor 1', function () {
		testDeleteLinesCommand(
			[
				'class P {',
				'',
				'    getA() {',
				'        if (true) {',
				'            return "a";',
				'        }',
				'    }',
				'',
				'    getB() {',
				'        if (true) {',
				'            return "b";',
				'        }',
				'    }',
				'',
				'    getC() {',
				'        if (true) {',
				'            return "c";',
				'        }',
				'    }',
				'}',
			],
			[
				new Selection(4, 1, 5, 1),
				new Selection(10, 1, 11, 1),
				new Selection(16, 1, 17, 1),
			],
			[
				'class P {',
				'',
				'    getA() {',
				'            return "a";',
				'        }',
				'    }',
				'',
				'    getB() {',
				'            return "b";',
				'        }',
				'    }',
				'',
				'    getC() {',
				'            return "c";',
				'        }',
				'    }',
				'}',
			],
			[
				new Selection(4, 1, 4, 1),
				new Selection(9, 1, 9, 1),
				new Selection(14, 1, 14, 1),
			]
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/test/browser/moveLinesCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/test/browser/moveLinesCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditorAutoIndentStrategy } from '../../../../common/config/editorOptions.js';
import { Selection } from '../../../../common/core/selection.js';
import { ILanguageService } from '../../../../common/languages/language.js';
import { IndentationRule } from '../../../../common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../../common/languages/languageConfigurationRegistry.js';
import { LanguageService } from '../../../../common/services/languageService.js';
import { MoveLinesCommand } from '../../browser/moveLinesCommand.js';
import { testCommand } from '../../../../test/browser/testCommand.js';
import { TestLanguageConfigurationService } from '../../../../test/common/modes/testLanguageConfigurationService.js';

const enum MoveLinesDirection {
	Up,
	Down
}

function testMoveLinesDownCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService): void {
	testMoveLinesUpOrDownCommand(MoveLinesDirection.Down, lines, selection, expectedLines, expectedSelection, languageConfigurationService);
}

function testMoveLinesUpCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService): void {
	testMoveLinesUpOrDownCommand(MoveLinesDirection.Up, lines, selection, expectedLines, expectedSelection, languageConfigurationService);
}

function testMoveLinesDownWithIndentCommand(languageId: string, lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService): void {
	testMoveLinesUpOrDownWithIndentCommand(MoveLinesDirection.Down, languageId, lines, selection, expectedLines, expectedSelection, languageConfigurationService);
}

function testMoveLinesUpWithIndentCommand(languageId: string, lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService): void {
	testMoveLinesUpOrDownWithIndentCommand(MoveLinesDirection.Up, languageId, lines, selection, expectedLines, expectedSelection, languageConfigurationService);
}

function testMoveLinesUpOrDownCommand(direction: MoveLinesDirection, lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService) {
	const disposables = new DisposableStore();
	if (!languageConfigurationService) {
		languageConfigurationService = disposables.add(new TestLanguageConfigurationService());
	}
	testCommand(lines, null, selection, (accessor, sel) => new MoveLinesCommand(sel, direction === MoveLinesDirection.Up ? false : true, EditorAutoIndentStrategy.Advanced, languageConfigurationService), expectedLines, expectedSelection);
	disposables.dispose();
}

function testMoveLinesUpOrDownWithIndentCommand(direction: MoveLinesDirection, languageId: string, lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection, languageConfigurationService?: ILanguageConfigurationService) {
	const disposables = new DisposableStore();
	if (!languageConfigurationService) {
		languageConfigurationService = disposables.add(new TestLanguageConfigurationService());
	}
	testCommand(lines, languageId, selection, (accessor, sel) => new MoveLinesCommand(sel, direction === MoveLinesDirection.Up ? false : true, EditorAutoIndentStrategy.Full, languageConfigurationService), expectedLines, expectedSelection);
	disposables.dispose();
}

suite('Editor Contrib - Move Lines Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('move first up / last down disabled', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1)
		);

		testMoveLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 1, 5, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 1, 5, 1)
		);
	});

	test('move first line down', function () {
		testMoveLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 4, 1, 1),
			[
				'second line',
				'first',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 4, 2, 1)
		);
	});

	test('move 2nd line up', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 2, 1),
			[
				'second line',
				'first',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 1, 1)
		);
	});

	test('issue #1322a: move 2nd line up', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 12, 2, 12),
			[
				'second line',
				'first',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 12, 1, 12)
		);
	});

	test('issue #1322b: move last line up', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 6, 5, 6),
			[
				'first',
				'second line',
				'third line',
				'fifth',
				'fourth line'
			],
			new Selection(4, 6, 4, 6)
		);
	});

	test('issue #1322c: move last line selected up', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 6, 5, 1),
			[
				'first',
				'second line',
				'third line',
				'fifth',
				'fourth line'
			],
			new Selection(4, 6, 4, 1)
		);
	});

	test('move last line up', function () {
		testMoveLinesUpCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(5, 1, 5, 1),
			[
				'first',
				'second line',
				'third line',
				'fifth',
				'fourth line'
			],
			new Selection(4, 1, 4, 1)
		);
	});

	test('move 4th line down', function () {
		testMoveLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 1, 4, 1),
			[
				'first',
				'second line',
				'third line',
				'fifth',
				'fourth line'
			],
			new Selection(5, 1, 5, 1)
		);
	});

	test('move multiple lines down', function () {
		testMoveLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(4, 4, 2, 2),
			[
				'first',
				'fifth',
				'second line',
				'third line',
				'fourth line'
			],
			new Selection(5, 4, 3, 2)
		);
	});

	test('invisible selection is ignored', function () {
		testMoveLinesDownCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(2, 1, 1, 1),
			[
				'second line',
				'first',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 1, 2, 1)
		);
	});
});

class IndentRulesMode extends Disposable {
	public readonly languageId = 'moveLinesIndentMode';
	constructor(
		indentationRules: IndentationRule,
		@ILanguageService languageService: ILanguageService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
	) {
		super();
		this._register(languageService.registerLanguage({ id: this.languageId }));
		this._register(languageConfigurationService.register(this.languageId, {
			indentationRules: indentationRules
		}));
	}
}

suite('Editor contrib - Move Lines Command honors Indentation Rules', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const indentRules = {
		decreaseIndentPattern: /^\s*((?!\S.*\/[*]).*[*]\/\s*)?[})\]]|^\s*(case\b.*|default):\s*(\/\/.*|\/[*].*[*]\/\s*)?$/,
		increaseIndentPattern: /(\{[^}"'`]*|\([^)"']*|\[[^\]"']*|^\s*(\{\}|\(\)|\[\]|(case\b.*|default):))\s*(\/\/.*|\/[*].*[*]\/\s*)?$/,
		indentNextLinePattern: /^\s*(for|while|if|else)\b(?!.*[;{}]\s*(\/\/.*|\/[*].*[*]\/\s*)?$)/,
		unIndentedLinePattern: /^(?!.*([;{}]|\S:)\s*(\/\/.*|\/[*].*[*]\/\s*)?$)(?!.*(\{[^}"']*|\([^)"']*|\[[^\]"']*|^\s*(\{\}|\(\)|\[\]|(case\b.*|default):))\s*(\/\/.*|\/[*].*[*]\/\s*)?$)(?!^\s*((?!\S.*\/[*]).*[*]\/\s*)?[})\]]|^\s*(case\b.*|default):\s*(\/\/.*|\/[*].*[*]\/\s*)?$)(?!^\s*(for|while|if|else)\b(?!.*[;{}]\s*(\/\/.*|\/[*].*[*]\/\s*)?$))/
	};

	// https://github.com/microsoft/vscode/issues/28552#issuecomment-307862797
	test('first line indentation adjust to 0', () => {
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		const mode = new IndentRulesMode(indentRules, languageService, languageConfigurationService);

		testMoveLinesUpWithIndentCommand(
			mode.languageId,
			[
				'class X {',
				'\tz = 2',
				'}'
			],
			new Selection(2, 1, 2, 1),
			[
				'z = 2',
				'class X {',
				'}'
			],
			new Selection(1, 1, 1, 1),
			languageConfigurationService
		);

		mode.dispose();
		languageService.dispose();
		languageConfigurationService.dispose();
	});

	// https://github.com/microsoft/vscode/issues/28552#issuecomment-307867717
	test('move lines across block', () => {
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		const mode = new IndentRulesMode(indentRules, languageService, languageConfigurationService);

		testMoveLinesDownWithIndentCommand(
			mode.languageId,
			[
				'const value = 2;',
				'const standardLanguageDescriptions = [',
				'    {',
				'        diagnosticSource: \'js\',',
				'    }',
				'];'
			],
			new Selection(1, 1, 1, 1),
			[
				'const standardLanguageDescriptions = [',
				'    const value = 2;',
				'    {',
				'        diagnosticSource: \'js\',',
				'    }',
				'];'
			],
			new Selection(2, 5, 2, 5),
			languageConfigurationService
		);

		mode.dispose();
		languageService.dispose();
		languageConfigurationService.dispose();
	});


	test('move line should still work as before if there is no indentation rules', () => {
		testMoveLinesUpWithIndentCommand(
			null!,
			[
				'if (true) {',
				'    var task = new Task(() => {',
				'        var work = 1234;',
				'    });',
				'}'
			],
			new Selection(3, 1, 3, 1),
			[
				'if (true) {',
				'        var work = 1234;',
				'    var task = new Task(() => {',
				'    });',
				'}'
			],
			new Selection(2, 1, 2, 1)
		);
	});
});

class EnterRulesMode extends Disposable {
	public readonly languageId = 'moveLinesEnterMode';
	constructor(
		@ILanguageService languageService: ILanguageService,
		@ILanguageConfigurationService languageConfigurationService: ILanguageConfigurationService
	) {
		super();
		this._register(languageService.registerLanguage({ id: this.languageId }));
		this._register(languageConfigurationService.register(this.languageId, {
			indentationRules: {
				decreaseIndentPattern: /^\s*\[$/,
				increaseIndentPattern: /^\s*\]$/,
			},
			brackets: [
				['{', '}']
			]
		}));
	}
}

suite('Editor - contrib - Move Lines Command honors onEnter Rules', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('issue #54829. move block across block', () => {
		const languageService = new LanguageService();
		const languageConfigurationService = new TestLanguageConfigurationService();
		const mode = new EnterRulesMode(languageService, languageConfigurationService);

		testMoveLinesDownWithIndentCommand(
			mode.languageId,

			[
				'if (true) {',
				'    if (false) {',
				'        if (1) {',
				'            console.log(\'b\');',
				'        }',
				'        console.log(\'a\');',
				'    }',
				'}'
			],
			new Selection(3, 9, 5, 10),
			[
				'if (true) {',
				'    if (false) {',
				'        console.log(\'a\');',
				'        if (1) {',
				'            console.log(\'b\');',
				'        }',
				'    }',
				'}'
			],
			new Selection(4, 9, 6, 10),
			languageConfigurationService
		);

		mode.dispose();
		languageService.dispose();
		languageConfigurationService.dispose();
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linesOperations/test/browser/sortLinesCommand.test.ts]---
Location: vscode-main/src/vs/editor/contrib/linesOperations/test/browser/sortLinesCommand.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Selection } from '../../../../common/core/selection.js';
import { SortLinesCommand } from '../../browser/sortLinesCommand.js';
import { testCommand } from '../../../../test/browser/testCommand.js';

function testSortLinesAscendingCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new SortLinesCommand(sel, false), expectedLines, expectedSelection);
}

function testSortLinesDescendingCommand(lines: string[], selection: Selection, expectedLines: string[], expectedSelection: Selection): void {
	testCommand(lines, null, selection, (accessor, sel) => new SortLinesCommand(sel, true), expectedLines, expectedSelection);
}

suite('Editor Contrib - Sort Lines Command', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('no op unless at least two lines selected 1', function () {
		testSortLinesAscendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 1, 1)
		);
	});

	test('no op unless at least two lines selected 2', function () {
		testSortLinesAscendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 2, 1),
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 3, 2, 1)
		);
	});

	test('sorting two lines ascending', function () {
		testSortLinesAscendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(3, 3, 4, 2),
			[
				'first',
				'second line',
				'fourth line',
				'third line',
				'fifth'
			],
			new Selection(3, 3, 4, 1)
		);
	});

	test('sorting first 4 lines ascending', function () {
		testSortLinesAscendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 5, 1),
			[
				'first',
				'fourth line',
				'second line',
				'third line',
				'fifth'
			],
			new Selection(1, 1, 5, 1)
		);
	});

	test('sorting all lines ascending', function () {
		testSortLinesAscendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 5, 6),
			[
				'fifth',
				'first',
				'fourth line',
				'second line',
				'third line',
			],
			new Selection(1, 1, 5, 11)
		);
	});

	test('sorting first 4 lines descending', function () {
		testSortLinesDescendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 5, 1),
			[
				'third line',
				'second line',
				'fourth line',
				'first',
				'fifth'
			],
			new Selection(1, 1, 5, 1)
		);
	});

	test('sorting all lines descending', function () {
		testSortLinesDescendingCommand(
			[
				'first',
				'second line',
				'third line',
				'fourth line',
				'fifth'
			],
			new Selection(1, 1, 5, 6),
			[
				'third line',
				'second line',
				'fourth line',
				'first',
				'fifth',
			],
			new Selection(1, 1, 5, 6)
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/linkedEditing/browser/linkedEditing.css]---
Location: vscode-main/src/vs/editor/contrib/linkedEditing/browser/linkedEditing.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-editor .linked-editing-decoration {
	background-color: var(--vscode-editor-linkedEditingBackground);

	/* Ensure decoration is visible even if range is empty */
	min-width: 1px;
}
```

--------------------------------------------------------------------------------

````
