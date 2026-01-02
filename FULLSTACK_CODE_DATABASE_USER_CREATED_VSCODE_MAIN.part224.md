---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 224
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 224 of 552)

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

---[FILE: src/vs/editor/contrib/find/test/browser/findController.test.ts]---
Location: vscode-main/src/vs/editor/contrib/find/test/browser/findController.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Delayer } from '../../../../../base/common/async.js';
import * as platform from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ICodeEditor } from '../../../../browser/editorBrowser.js';
import { EditorAction } from '../../../../browser/editorExtensions.js';
import { EditOperation } from '../../../../common/core/editOperation.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { CommonFindController, FindStartFocusAction, IFindStartOptions, NextMatchFindAction, NextSelectionMatchFindAction, StartFindAction, StartFindReplaceAction, StartFindWithSelectionAction } from '../../browser/findController.js';
import { CONTEXT_FIND_INPUT_FOCUSED } from '../../browser/findModel.js';
import { withAsyncTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';
import { IClipboardService } from '../../../../../platform/clipboard/common/clipboardService.js';
import { IContextKey, IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { IStorageService, InMemoryStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';

class TestFindController extends CommonFindController {

	public hasFocus: boolean;
	public delayUpdateHistory: boolean = false;

	private _findInputFocused: IContextKey<boolean>;

	constructor(
		editor: ICodeEditor,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IStorageService storageService: IStorageService,
		@IClipboardService clipboardService: IClipboardService,
		@INotificationService notificationService: INotificationService,
		@IHoverService hoverService: IHoverService
	) {
		super(editor, contextKeyService, storageService, clipboardService, notificationService, hoverService);
		this._findInputFocused = CONTEXT_FIND_INPUT_FOCUSED.bindTo(contextKeyService);
		this._updateHistoryDelayer = new Delayer<void>(50);
		this.hasFocus = false;
	}

	protected override async _start(opts: IFindStartOptions): Promise<void> {
		await super._start(opts);

		if (opts.shouldFocus !== FindStartFocusAction.NoFocusChange) {
			this.hasFocus = true;
		}

		const inputFocused = opts.shouldFocus === FindStartFocusAction.FocusFindInput;
		this._findInputFocused.set(inputFocused);
	}
}

function fromSelection(slc: Selection): number[] {
	return [slc.startLineNumber, slc.startColumn, slc.endLineNumber, slc.endColumn];
}

function executeAction(instantiationService: IInstantiationService, editor: ICodeEditor, action: EditorAction, args?: any): Promise<void> {
	return instantiationService.invokeFunction((accessor) => {
		return Promise.resolve(action.runEditorCommand(accessor, editor, args));
	});
}

suite('FindController', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	let clipboardState = '';
	const serviceCollection = new ServiceCollection();
	serviceCollection.set(IStorageService, new InMemoryStorageService());

	if (platform.isMacintosh) {
		// eslint-disable-next-line local/code-no-any-casts
		serviceCollection.set(IClipboardService, <any>{
			readFindText: () => clipboardState,
			writeFindText: (value: any) => { clipboardState = value; }
		});
	}

	/* test('stores to the global clipboard buffer on start find action', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			if (!platform.isMacintosh) {
				assert.ok(true);
				return;
			}
			let findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			let startFindAction = new StartFindAction();
			// I select ABC on the first line
			editor.setSelection(new Selection(1, 1, 1, 4));
			// I hit Ctrl+F to show the Find dialog
			startFindAction.run(null, editor);

			assert.deepStrictEqual(findController.getGlobalBufferTerm(), findController.getState().searchString);
			findController.dispose();
		});
	});

	test('reads from the global clipboard buffer on next find action if buffer exists', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = 'ABC';

			if (!platform.isMacintosh) {
				assert.ok(true);
				return;
			}

			let findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			let findState = findController.getState();
			let nextMatchFindAction = new NextMatchFindAction();

			nextMatchFindAction.run(null, editor);
			assert.strictEqual(findState.searchString, 'ABC');

			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 1, 1, 4]);

			findController.dispose();
		});
	});

	test('writes to the global clipboard buffer when text changes', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			if (!platform.isMacintosh) {
				assert.ok(true);
				return;
			}

			let findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			let findState = findController.getState();

			findState.change({ searchString: 'ABC' }, true);

			assert.deepStrictEqual(findController.getGlobalBufferTerm(), 'ABC');

			findController.dispose();
		});
	}); */

	test('issue #1857: F3, Find Next, acts like "Find Under Cursor"', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			// The cursor is at the very top, of the file, at the first ABC
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const findState = findController.getState();
			const nextMatchFindAction = NextMatchFindAction;

			// I hit Ctrl+F to show the Find dialog
			await executeAction(instantiationService, editor, StartFindAction);

			// I type ABC.
			findState.change({ searchString: 'A' }, true);
			findState.change({ searchString: 'AB' }, true);
			findState.change({ searchString: 'ABC' }, true);

			// The first ABC is highlighted.
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 1, 1, 4]);

			// I hit Esc to exit the Find dialog.
			findController.closeFindWidget();
			findController.hasFocus = false;

			// The cursor is now at end of the first line, with ABC on that line highlighted.
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 1, 1, 4]);

			// I hit delete to remove it and change the text to XYZ.
			editor.pushUndoStop();
			editor.executeEdits('test', [EditOperation.delete(new Range(1, 1, 1, 4))]);
			editor.executeEdits('test', [EditOperation.insert(new Position(1, 1), 'XYZ')]);
			editor.pushUndoStop();

			// At this point the text editor looks like this:
			//   XYZ
			//   ABC
			//   XYZ
			//   ABC
			assert.strictEqual(editor.getModel()!.getLineContent(1), 'XYZ');

			// The cursor is at end of the first line.
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 4, 1, 4]);

			// I hit F3 to "Find Next" to find the next occurrence of ABC, but instead it searches for XYZ.
			await editor.runAction(nextMatchFindAction);

			assert.strictEqual(findState.searchString, 'ABC');
			assert.strictEqual(findController.hasFocus, false);

			findController.dispose();
		});
	});

	test('issue #3090: F3 does not loop with two matches on a single line', async () => {
		await withAsyncTestCodeEditor([
			'import nls = require(\'vs/nls\');'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const nextMatchFindAction = NextMatchFindAction;

			editor.setPosition({
				lineNumber: 1,
				column: 9
			});

			await editor.runAction(nextMatchFindAction);
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 26, 1, 29]);

			await editor.runAction(nextMatchFindAction);
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 8, 1, 11]);

			findController.dispose();
		});
	});

	test('issue #6149: Auto-escape highlighted text for search and replace regex mode', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3  * 5)',
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const nextMatchFindAction = NextMatchFindAction;

			editor.setSelection(new Selection(1, 9, 1, 13));

			findController.toggleRegex();
			await executeAction(instantiationService, editor, StartFindAction);

			await editor.runAction(nextMatchFindAction);
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [2, 9, 2, 13]);

			await editor.runAction(nextMatchFindAction);
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [1, 9, 1, 13]);

			findController.dispose();
		});
	});

	test('issue #41027: Don\'t replace find input value on replace action if find input is active', async () => {
		await withAsyncTestCodeEditor([
			'test',
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			const testRegexString = 'tes.';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const nextMatchFindAction = NextMatchFindAction;

			findController.toggleRegex();
			findController.setSearchString(testRegexString);
			await findController.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.FocusFindInput,
				shouldAnimate: false,
				updateSearchScope: false,
				loop: true
			});
			await editor.runAction(nextMatchFindAction);
			await executeAction(instantiationService, editor, StartFindReplaceAction);

			assert.strictEqual(findController.getState().searchString, testRegexString);

			findController.dispose();
		});
	});

	test('issue #9043: Clear search scope when find widget is hidden', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			await findController.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: false,
				updateSearchScope: false,
				loop: true
			});

			assert.strictEqual(findController.getState().searchScope, null);

			findController.getState().change({
				searchScope: [new Range(1, 1, 1, 5)]
			}, false);

			assert.deepStrictEqual(findController.getState().searchScope, [new Range(1, 1, 1, 5)]);

			findController.closeFindWidget();
			assert.strictEqual(findController.getState().searchScope, null);
		});
	});

	test('issue #18111: Regex replace with single space replaces with no space', async () => {
		await withAsyncTestCodeEditor([
			'HRESULT OnAmbientPropertyChange(DISPID   dispid);'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			await executeAction(instantiationService, editor, StartFindAction);

			findController.getState().change({ searchString: '\\b\\s{3}\\b', replaceString: ' ', isRegex: true }, false);
			findController.moveToNextMatch();

			assert.deepStrictEqual(editor.getSelections()!.map(fromSelection), [
				[1, 39, 1, 42]
			]);

			findController.replace();

			assert.deepStrictEqual(editor.getValue(), 'HRESULT OnAmbientPropertyChange(DISPID dispid);');

			findController.dispose();
		});
	});

	test('issue #24714: Regular expression with ^ in search & replace', async () => {
		await withAsyncTestCodeEditor([
			'',
			'line2',
			'line3'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			await executeAction(instantiationService, editor, StartFindAction);

			findController.getState().change({ searchString: '^', replaceString: 'x', isRegex: true }, false);
			findController.moveToNextMatch();

			assert.deepStrictEqual(editor.getSelections()!.map(fromSelection), [
				[2, 1, 2, 1]
			]);

			findController.replace();

			assert.deepStrictEqual(editor.getValue(), '\nxline2\nline3');

			findController.dispose();
		});
	});

	test('issue #38232: Find Next Selection, regex enabled', async () => {
		await withAsyncTestCodeEditor([
			'([funny]',
			'',
			'([funny]'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const nextSelectionMatchFindAction = new NextSelectionMatchFindAction();

			// toggle regex
			findController.getState().change({ isRegex: true }, false);

			// change selection
			editor.setSelection(new Selection(1, 1, 1, 9));

			// cmd+f3
			await editor.runAction(nextSelectionMatchFindAction);

			assert.deepStrictEqual(editor.getSelections()!.map(fromSelection), [
				[3, 1, 3, 9]
			]);

			findController.dispose();
		});
	});

	test('issue #38232: Find Next Selection, regex enabled, find widget open', async () => {
		await withAsyncTestCodeEditor([
			'([funny]',
			'',
			'([funny]'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const nextSelectionMatchFindAction = new NextSelectionMatchFindAction();

			// cmd+f - open find widget
			await executeAction(instantiationService, editor, StartFindAction);

			// toggle regex
			findController.getState().change({ isRegex: true }, false);

			// change selection
			editor.setSelection(new Selection(1, 1, 1, 9));

			// cmd+f3
			await editor.runAction(nextSelectionMatchFindAction);

			assert.deepStrictEqual(editor.getSelections()!.map(fromSelection), [
				[3, 1, 3, 9]
			]);

			findController.dispose();
		});
	});

	test('issue #47400, CMD+E supports feeding multiple line of text into the find widget', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			// change selection
			editor.setSelection(new Selection(1, 1, 1, 1));

			// cmd+f - open find widget
			await executeAction(instantiationService, editor, StartFindAction);

			editor.setSelection(new Selection(1, 1, 2, 4));
			const startFindWithSelectionAction = new StartFindWithSelectionAction();
			await editor.runAction(startFindWithSelectionAction);
			const findState = findController.getState();

			assert.deepStrictEqual(findState.searchString.split(/\r\n|\r|\n/g), ['ABC', 'ABC']);

			editor.setSelection(new Selection(3, 1, 3, 1));
			await editor.runAction(startFindWithSelectionAction);

			findController.dispose();
		});
	});

	test('issue #109756, CMD+E with empty cursor should always work', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'ABC',
			'XYZ',
			'ABC',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor) => {
			clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			editor.setSelection(new Selection(1, 2, 1, 2));

			const startFindWithSelectionAction = new StartFindWithSelectionAction();
			editor.runAction(startFindWithSelectionAction);

			const findState = findController.getState();
			assert.deepStrictEqual(findState.searchString, 'ABC');
			findController.dispose();
		});
	});
});

suite('FindController query options persistence', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const serviceCollection = new ServiceCollection();
	const storageService = new InMemoryStorageService();
	storageService.store('editor.isRegex', false, StorageScope.WORKSPACE, StorageTarget.USER);
	storageService.store('editor.matchCase', false, StorageScope.WORKSPACE, StorageTarget.USER);
	storageService.store('editor.wholeWord', false, StorageScope.WORKSPACE, StorageTarget.USER);
	serviceCollection.set(IStorageService, storageService);

	test('matchCase', async () => {
		await withAsyncTestCodeEditor([
			'abc',
			'ABC',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			storageService.store('editor.matchCase', true, StorageScope.WORKSPACE, StorageTarget.USER);
			// The cursor is at the very top, of the file, at the first ABC
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const findState = findController.getState();

			// I hit Ctrl+F to show the Find dialog
			await executeAction(instantiationService, editor, StartFindAction);

			// I type ABC.
			findState.change({ searchString: 'ABC' }, true);
			// The second ABC is highlighted as matchCase is true.
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [2, 1, 2, 4]);

			findController.dispose();
		});
	});

	storageService.store('editor.matchCase', false, StorageScope.WORKSPACE, StorageTarget.USER);
	storageService.store('editor.wholeWord', true, StorageScope.WORKSPACE, StorageTarget.USER);

	test('wholeWord', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'AB',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor, _, instantiationService) => {
			// The cursor is at the very top, of the file, at the first ABC
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const findState = findController.getState();

			// I hit Ctrl+F to show the Find dialog
			await executeAction(instantiationService, editor, StartFindAction);

			// I type AB.
			findState.change({ searchString: 'AB' }, true);
			// The second AB is highlighted as wholeWord is true.
			assert.deepStrictEqual(fromSelection(editor.getSelection()!), [2, 1, 2, 3]);

			findController.dispose();
		});
	});

	test('toggling options is saved', async () => {
		await withAsyncTestCodeEditor([
			'ABC',
			'AB',
			'XYZ',
			'ABC'
		], { serviceCollection: serviceCollection }, async (editor) => {
			// The cursor is at the very top, of the file, at the first ABC
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			findController.toggleRegex();
			assert.strictEqual(storageService.getBoolean('editor.isRegex', StorageScope.WORKSPACE), true);

			findController.dispose();
		});
	});

	test('issue #27083: Update search scope once find widget becomes visible', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection, find: { autoFindInSelection: 'always', globalFindClipboard: false } }, async (editor) => {
			// clipboardState = '';
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);
			const findConfig: IFindStartOptions = {
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: false,
				updateSearchScope: true,
				loop: true
			};

			editor.setSelection(new Range(1, 1, 2, 1));
			findController.start(findConfig);
			assert.deepStrictEqual(findController.getState().searchScope, [new Selection(1, 1, 2, 1)]);

			findController.closeFindWidget();

			editor.setSelections([new Selection(1, 1, 2, 1), new Selection(2, 1, 2, 5)]);
			findController.start(findConfig);
			assert.deepStrictEqual(findController.getState().searchScope, [new Selection(1, 1, 2, 1), new Selection(2, 1, 2, 5)]);
		});
	});

	test('issue #58604: Do not update searchScope if it is empty', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection, find: { autoFindInSelection: 'always', globalFindClipboard: false } }, async (editor) => {
			// clipboardState = '';
			editor.setSelection(new Range(1, 2, 1, 2));
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			await findController.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: false,
				updateSearchScope: true,
				loop: true
			});

			assert.deepStrictEqual(findController.getState().searchScope, null);
		});
	});

	test('issue #58604: Update searchScope if it is not empty', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection, find: { autoFindInSelection: 'always', globalFindClipboard: false } }, async (editor) => {
			// clipboardState = '';
			editor.setSelection(new Range(1, 2, 1, 3));
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			await findController.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: false,
				updateSearchScope: true,
				loop: true
			});

			assert.deepStrictEqual(findController.getState().searchScope, [new Selection(1, 2, 1, 3)]);
		});
	});


	test('issue #27083: Find in selection when multiple lines are selected', async () => {
		await withAsyncTestCodeEditor([
			'var x = (3 * 5)',
			'var y = (3 * 5)',
			'var z = (3 * 5)',
		], { serviceCollection: serviceCollection, find: { autoFindInSelection: 'multiline', globalFindClipboard: false } }, async (editor) => {
			// clipboardState = '';
			editor.setSelection(new Range(1, 6, 2, 1));
			const findController = editor.registerAndInstantiateContribution(TestFindController.ID, TestFindController);

			await findController.start({
				forceRevealReplace: false,
				seedSearchStringFromSelection: 'none',
				seedSearchStringFromNonEmptySelection: false,
				seedSearchStringFromGlobalClipboard: false,
				shouldFocus: FindStartFocusAction.NoFocusChange,
				shouldAnimate: false,
				updateSearchScope: true,
				loop: true
			});

			assert.deepStrictEqual(findController.getState().searchScope, [new Selection(1, 6, 2, 1)]);
		});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/test/browser/findModel.test.ts]---
Location: vscode-main/src/vs/editor/contrib/find/test/browser/findModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CoreNavigationCommands } from '../../../../browser/coreCommands.js';
import { IActiveCodeEditor, ICodeEditor } from '../../../../browser/editorBrowser.js';
import { Position } from '../../../../common/core/position.js';
import { Range } from '../../../../common/core/range.js';
import { Selection } from '../../../../common/core/selection.js';
import { PieceTreeTextBufferBuilder } from '../../../../common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder.js';
import { FindModelBoundToEditorModel } from '../../browser/findModel.js';
import { FindReplaceState } from '../../browser/findState.js';
import { withTestCodeEditor } from '../../../../test/browser/testCodeEditor.js';

suite('FindModel', () => {

	let disposables: DisposableStore;

	setup(() => {
		disposables = new DisposableStore();
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function findTest(testName: string, callback: (editor: IActiveCodeEditor) => void): void {
		test(testName, () => {
			const textArr = [
				'// my cool header',
				'#include "cool.h"',
				'#include <iostream>',
				'',
				'int main() {',
				'    cout << "hello world, Hello!" << endl;',
				'    cout << "hello world again" << endl;',
				'    cout << "Hello world again" << endl;',
				'    cout << "helloworld again" << endl;',
				'}',
				'// blablablaciao',
				''
			];
			withTestCodeEditor(textArr, {}, (editor) => callback(editor as IActiveCodeEditor));

			const text = textArr.join('\n');
			const ptBuilder = new PieceTreeTextBufferBuilder();
			ptBuilder.acceptChunk(text.substr(0, 94));
			ptBuilder.acceptChunk(text.substr(94, 101));
			ptBuilder.acceptChunk(text.substr(195, 59));
			const factory = ptBuilder.finish();
			withTestCodeEditor(
				factory,
				{},
				(editor) => callback(editor as IActiveCodeEditor)
			);
		});
	}

	function fromRange(rng: Range): number[] {
		return [rng.startLineNumber, rng.startColumn, rng.endLineNumber, rng.endColumn];
	}

	function _getFindState(editor: ICodeEditor) {
		const model = editor.getModel()!;
		const currentFindMatches: Range[] = [];
		const allFindMatches: Range[] = [];

		for (const dec of model.getAllDecorations()) {
			if (dec.options.className === 'currentFindMatch') {
				currentFindMatches.push(dec.range);
				allFindMatches.push(dec.range);
			} else if (dec.options.className === 'findMatch') {
				allFindMatches.push(dec.range);
			}
		}

		currentFindMatches.sort(Range.compareRangesUsingStarts);
		allFindMatches.sort(Range.compareRangesUsingStarts);

		return {
			highlighted: currentFindMatches.map(fromRange),
			findDecorations: allFindMatches.map(fromRange)
		};
	}

	function assertFindState(editor: ICodeEditor, cursor: number[], highlighted: number[] | null, findDecorations: number[][]): void {
		assert.deepStrictEqual(fromRange(editor.getSelection()!), cursor, 'cursor');

		const expectedState = {
			highlighted: highlighted ? [highlighted] : [],
			findDecorations: findDecorations
		};
		assert.deepStrictEqual(_getFindState(editor), expectedState, 'state');
	}

	findTest('incremental find from beginning of file', (editor) => {
		editor.setPosition({ lineNumber: 1, column: 1 });
		const findState = disposables.add(new FindReplaceState());
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		// simulate typing the search string
		findState.change({ searchString: 'H' }, true);
		assertFindState(
			editor,
			[1, 12, 1, 13],
			[1, 12, 1, 13],
			[
				[1, 12, 1, 13],
				[2, 16, 2, 17],
				[6, 14, 6, 15],
				[6, 27, 6, 28],
				[7, 14, 7, 15],
				[8, 14, 8, 15],
				[9, 14, 9, 15]
			]
		);

		// simulate typing the search string
		findState.change({ searchString: 'He' }, true);
		assertFindState(
			editor,
			[1, 12, 1, 14],
			[1, 12, 1, 14],
			[
				[1, 12, 1, 14],
				[6, 14, 6, 16],
				[6, 27, 6, 29],
				[7, 14, 7, 16],
				[8, 14, 8, 16],
				[9, 14, 9, 16]
			]
		);

		// simulate typing the search string
		findState.change({ searchString: 'Hello' }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		// simulate toggling on `matchCase`
		findState.change({ matchCase: true }, true);
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 27, 6, 32],
				[8, 14, 8, 19]
			]
		);

		// simulate typing the search string
		findState.change({ searchString: 'hello' }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19]
			]
		);

		// simulate toggling on `wholeWord`
		findState.change({ wholeWord: true }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19]
			]
		);

		// simulate toggling off `matchCase`
		findState.change({ matchCase: false }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		// simulate toggling off `wholeWord`
		findState.change({ wholeWord: false }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		// simulate adding a search scope
		findState.change({ searchScope: [new Range(8, 1, 10, 1)] }, true);
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		// simulate removing the search scope
		findState.change({ searchScope: null }, true);
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model removes its decorations', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assert.strictEqual(findState.matchesCount, 5);
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		findModel.dispose();
		findState.dispose();

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);
	});

	findTest('find model updates state matchesCount', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assert.strictEqual(findState.matchesCount, 5);
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		findState.change({ searchString: 'helloo' }, false);
		assert.strictEqual(findState.matchesCount, 0);
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model reacts to position change', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		editor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(6, 20)
		});

		assertFindState(
			editor,
			[6, 20, 6, 20],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		findState.change({ searchString: 'Hello' }, true);
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model next', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model next stays in scope', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true, searchScope: [new Range(7, 1, 9, 1)] }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('multi-selection find model next stays in scope (overlap)', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true, searchScope: [new Range(7, 1, 8, 2), new Range(8, 1, 9, 1)] }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('multi-selection find model next stays in scope', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', matchCase: true, wholeWord: false, searchScope: [new Range(6, 1, 7, 38), new Range(9, 3, 9, 38)] }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				// `matchCase: false` would
				// find this match as well:
				// [6, 27, 6, 32],
				[7, 14, 7, 19],
				// `wholeWord: true` would
				// exclude this match:
				[9, 14, 9, 19],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[9, 14, 9, 19],
			[9, 14, 9, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model prev', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model prev stays in scope', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true, searchScope: [new Range(7, 1, 9, 1)] }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model next/prev with no matches', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'helloo', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find model next/prev respects cursor position', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		editor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(6, 20)
		});
		assertFindState(
			editor,
			[6, 20, 6, 20],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find ^', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[1, 1, 1, 1],
				[2, 1, 2, 1],
				[3, 1, 3, 1],
				[4, 1, 4, 1],
				[5, 1, 5, 1],
				[6, 1, 6, 1],
				[7, 1, 7, 1],
				[8, 1, 8, 1],
				[9, 1, 9, 1],
				[10, 1, 10, 1],
				[11, 1, 11, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[2, 1, 2, 1],
			[2, 1, 2, 1],
			[
				[1, 1, 1, 1],
				[2, 1, 2, 1],
				[3, 1, 3, 1],
				[4, 1, 4, 1],
				[5, 1, 5, 1],
				[6, 1, 6, 1],
				[7, 1, 7, 1],
				[8, 1, 8, 1],
				[9, 1, 9, 1],
				[10, 1, 10, 1],
				[11, 1, 11, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[3, 1, 3, 1],
			[3, 1, 3, 1],
			[
				[1, 1, 1, 1],
				[2, 1, 2, 1],
				[3, 1, 3, 1],
				[4, 1, 4, 1],
				[5, 1, 5, 1],
				[6, 1, 6, 1],
				[7, 1, 7, 1],
				[8, 1, 8, 1],
				[9, 1, 9, 1],
				[10, 1, 10, 1],
				[11, 1, 11, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find $', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '$', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[1, 18, 1, 18],
				[2, 18, 2, 18],
				[3, 20, 3, 20],
				[4, 1, 4, 1],
				[5, 13, 5, 13],
				[6, 43, 6, 43],
				[7, 41, 7, 41],
				[8, 41, 8, 41],
				[9, 40, 9, 40],
				[10, 2, 10, 2],
				[11, 17, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[1, 18, 1, 18],
			[1, 18, 1, 18],
			[
				[1, 18, 1, 18],
				[2, 18, 2, 18],
				[3, 20, 3, 20],
				[4, 1, 4, 1],
				[5, 13, 5, 13],
				[6, 43, 6, 43],
				[7, 41, 7, 41],
				[8, 41, 8, 41],
				[9, 40, 9, 40],
				[10, 2, 10, 2],
				[11, 17, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[2, 18, 2, 18],
			[2, 18, 2, 18],
			[
				[1, 18, 1, 18],
				[2, 18, 2, 18],
				[3, 20, 3, 20],
				[4, 1, 4, 1],
				[5, 13, 5, 13],
				[6, 43, 6, 43],
				[7, 41, 7, 41],
				[8, 41, 8, 41],
				[9, 40, 9, 40],
				[10, 2, 10, 2],
				[11, 17, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[3, 20, 3, 20],
			[3, 20, 3, 20],
			[
				[1, 18, 1, 18],
				[2, 18, 2, 18],
				[3, 20, 3, 20],
				[4, 1, 4, 1],
				[5, 13, 5, 13],
				[6, 43, 6, 43],
				[7, 41, 7, 41],
				[8, 41, 8, 41],
				[9, 40, 9, 40],
				[10, 2, 10, 2],
				[11, 17, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find next ^$', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^$', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[4, 1, 4, 1],
			[4, 1, 4, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[12, 1, 12, 1],
			[12, 1, 12, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[4, 1, 4, 1],
			[4, 1, 4, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find .*', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '.*', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find next ^.*$', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^.*$', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[1, 1, 1, 18],
			[1, 1, 1, 18],
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[2, 1, 2, 18],
			[2, 1, 2, 18],
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find prev ^.*$', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^.*$', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[12, 1, 12, 1],
			[12, 1, 12, 1],
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[11, 1, 11, 17],
			[11, 1, 11, 17],
			[
				[1, 1, 1, 18],
				[2, 1, 2, 18],
				[3, 1, 3, 20],
				[4, 1, 4, 1],
				[5, 1, 5, 13],
				[6, 1, 6, 43],
				[7, 1, 7, 41],
				[8, 1, 8, 41],
				[9, 1, 9, 40],
				[10, 1, 10, 2],
				[11, 1, 11, 17],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('find prev ^$', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^$', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[12, 1, 12, 1],
			[12, 1, 12, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[4, 1, 4, 1],
			[4, 1, 4, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.moveToPrevMatch();
		assertFindState(
			editor,
			[12, 1, 12, 1],
			[12, 1, 12, 1],
			[
				[4, 1, 4, 1],
				[12, 1, 12, 1],
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('replace hello', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'hi', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		editor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(6, 20)
		});
		assertFindState(
			editor,
			[6, 20, 6, 20],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[6, 27, 6, 32],
			[6, 27, 6, 32],
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, hi!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[6, 14, 6, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hi world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[6, 16, 6, 16],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, hi!" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replace bla', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'bla', replaceString: 'ciao' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[11, 4, 11, 7],
				[11, 7, 11, 10],
				[11, 10, 11, 13]
			]
		);

		findModel.replace();
		assertFindState(
			editor,
			[11, 4, 11, 7],
			[11, 4, 11, 7],
			[
				[11, 4, 11, 7],
				[11, 7, 11, 10],
				[11, 10, 11, 13]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// blablablaciao');

		findModel.replace();
		assertFindState(
			editor,
			[11, 8, 11, 11],
			[11, 8, 11, 11],
			[
				[11, 8, 11, 11],
				[11, 11, 11, 14]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// ciaoblablaciao');

		findModel.replace();
		assertFindState(
			editor,
			[11, 12, 11, 15],
			[11, 12, 11, 15],
			[
				[11, 12, 11, 15]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// ciaociaoblaciao');

		findModel.replace();
		assertFindState(
			editor,
			[11, 16, 11, 16],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// ciaociaociaociao');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll hello', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'hi', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		editor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(6, 20)
		});
		assertFindState(
			editor,
			[6, 20, 6, 20],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, Hello!" << endl;');

		findModel.replaceAll();
		assertFindState(
			editor,
			[6, 17, 6, 17],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, hi!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hi world again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll two spaces with one space', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '  ', replaceString: ' ' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 1, 6, 3],
				[6, 3, 6, 5],
				[7, 1, 7, 3],
				[7, 3, 7, 5],
				[8, 1, 8, 3],
				[8, 3, 8, 5],
				[9, 1, 9, 3],
				[9, 3, 9, 5]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 1, 6, 3],
				[7, 1, 7, 3],
				[8, 1, 8, 3],
				[9, 1, 9, 3]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '  cout << "hello world, Hello!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '  cout << "hello world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '  cout << "Hello world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(9), '  cout << "helloworld again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll bla', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'bla', replaceString: 'ciao' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[11, 4, 11, 7],
				[11, 7, 11, 10],
				[11, 10, 11, 13]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// ciaociaociaociao');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll bla with \\t\\n', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'bla', replaceString: '<\\n\\t>', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[11, 4, 11, 7],
				[11, 7, 11, 10],
				[11, 10, 11, 13]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(11), '// <');
		assert.strictEqual(editor.getModel()!.getLineContent(12), '\t><');
		assert.strictEqual(editor.getModel()!.getLineContent(13), '\t><');
		assert.strictEqual(editor.getModel()!.getLineContent(14), '\t>ciao');

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #3516: "replace all" moves page/cursor/focus/scroll to the place of the last replacement', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'include', replaceString: 'bar' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[2, 2, 2, 9],
				[3, 2, 3, 9]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		assert.strictEqual(editor.getModel()!.getLineContent(2), '#bar "cool.h"');
		assert.strictEqual(editor.getModel()!.getLineContent(3), '#bar <iostream>');

		findModel.dispose();
		findState.dispose();
	});

	findTest('listens to model content changes', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'hi', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		editor.getModel()!.setValue('hello\nhi');
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('selectAllMatches', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'hi', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.selectAllMatches();

		assert.deepStrictEqual(editor.getSelections()!.map(s => s.toString()), [
			new Selection(6, 14, 6, 19),
			new Selection(6, 27, 6, 32),
			new Selection(7, 14, 7, 19),
			new Selection(8, 14, 8, 19)
		].map(s => s.toString()));

		assertFindState(
			editor,
			[6, 14, 6, 19],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #14143 selectAllMatches should maintain primary cursor if feasible', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'hi', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		editor.setSelection(new Range(7, 14, 7, 19));

		findModel.selectAllMatches();

		assert.deepStrictEqual(editor.getSelections()!.map(s => s.toString()), [
			new Selection(7, 14, 7, 19),
			new Selection(6, 14, 6, 19),
			new Selection(6, 27, 6, 32),
			new Selection(8, 14, 8, 19)
		].map(s => s.toString()));

		assert.deepStrictEqual(editor.getSelection()!.toString(), new Selection(7, 14, 7, 19).toString());

		assertFindState(
			editor,
			[7, 14, 7, 19],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #1914: NPE when there is only one find match', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'cool.h' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[2, 11, 2, 17]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[2, 11, 2, 17],
			[2, 11, 2, 17],
			[
				[2, 11, 2, 17]
			]
		);

		findModel.moveToNextMatch();
		assertFindState(
			editor,
			[2, 11, 2, 17],
			[2, 11, 2, 17],
			[
				[2, 11, 2, 17]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('replace when search string has look ahed regex', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello(?=\\sworld)', replaceString: 'hi', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.replace();

		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[8, 16, 8, 16],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hi world again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replace when search string has look ahed regex and cursor is at the last find match', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello(?=\\sworld)', replaceString: 'hi', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		editor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(8, 14)
		});

		assertFindState(
			editor,
			[8, 14, 8, 14],
			null,
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.replace();

		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "Hello world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hi world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[7, 16, 7, 16],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll when search string has look ahed regex', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello(?=\\sworld)', replaceString: 'hi', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.replaceAll();

		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, Hello!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hi world again" << endl;');

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('replace when search string has look ahed regex and replace string has capturing groups', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hel(lo)(?=\\sworld)', replaceString: 'hi$1', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.replace();

		assertFindState(
			editor,
			[6, 14, 6, 19],
			[6, 14, 6, 19],
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[7, 14, 7, 19],
			[7, 14, 7, 19],
			[
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hilo world, Hello!" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[8, 14, 8, 19],
			[8, 14, 8, 19],
			[
				[8, 14, 8, 19]
			]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hilo world again" << endl;');

		findModel.replace();
		assertFindState(
			editor,
			[8, 18, 8, 18],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "hilo world again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll when search string has look ahed regex and replace string has capturing groups', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'wo(rl)d(?=.*;$)', replaceString: 'gi$1', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 20, 6, 25],
				[7, 20, 7, 25],
				[8, 20, 8, 25],
				[9, 19, 9, 24]
			]
		);

		findModel.replaceAll();

		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello girl, Hello!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hello girl again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "Hello girl again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(9), '    cout << "hellogirl again" << endl;');

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll when search string is multiline and has look ahed regex and replace string has capturing groups', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'wo(rl)d(.*;\\n)(?=.*hello)', replaceString: 'gi$1$2', isRegex: true, matchCase: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 20, 7, 1],
				[8, 20, 9, 1]
			]
		);

		findModel.replaceAll();

		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hello girl, Hello!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "Hello girl again" << endl;');

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('replaceAll preserving case', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: 'goodbye', isRegex: false, matchCase: false, preserveCase: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19],
				[9, 14, 9, 19],
			]
		);

		findModel.replaceAll();

		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "goodbye world, Goodbye!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "goodbye world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << "Goodbye world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(9), '    cout << "goodbyeworld again" << endl;');

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #18711 replaceAll with empty string', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', replaceString: '', wholeWord: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[6, 27, 6, 32],
				[7, 14, 7, 19],
				[8, 14, 8, 19]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << " world, !" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << " world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(8), '    cout << " world again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #32522 replaceAll with ^ on more than 1000 matches', (editor) => {
		let initialText = '';
		for (let i = 0; i < 1100; i++) {
			initialText += 'line' + i + '\n';
		}
		editor.getModel()!.setValue(initialText);
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: '^', replaceString: 'a ', isRegex: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		findModel.replaceAll();

		let expectedText = '';
		for (let i = 0; i < 1100; i++) {
			expectedText += 'a line' + i + '\n';
		}
		expectedText += 'a ';
		assert.strictEqual(editor.getModel()!.getValue(), expectedText);

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #19740 Find and replace capture group/backreference inserts `undefined` instead of empty string', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello(z)?', replaceString: 'hi$1', isRegex: true, matchCase: true }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[6, 14, 6, 19],
				[7, 14, 7, 19],
				[9, 14, 9, 19]
			]
		);

		findModel.replaceAll();
		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[]
		);
		assert.strictEqual(editor.getModel()!.getLineContent(6), '    cout << "hi world, Hello!" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(7), '    cout << "hi world again" << endl;');
		assert.strictEqual(editor.getModel()!.getLineContent(9), '    cout << "hiworld again" << endl;');

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #27083. search scope works even if it is a single line', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', wholeWord: true, searchScope: [new Range(7, 1, 8, 1)] }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assertFindState(
			editor,
			[1, 1, 1, 1],
			null,
			[
				[7, 14, 7, 19]
			]
		);

		findModel.dispose();
		findState.dispose();
	});

	findTest('issue #3516: Control behavior of "Next" operations (not looping back to beginning)', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello', loop: false }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assert.strictEqual(findState.matchesCount, 5);

		// Test next operations
		assert.strictEqual(findState.matchesPosition, 0);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), false);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 2);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 3);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 4);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 5);
		assert.strictEqual(findState.canNavigateForward(), false);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 5);
		assert.strictEqual(findState.canNavigateForward(), false);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 5);
		assert.strictEqual(findState.canNavigateForward(), false);
		assert.strictEqual(findState.canNavigateBack(), true);

		// Test previous operations
		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 4);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 3);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 2);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), false);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), false);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), false);

	});

	findTest('issue #3516: Control behavior of "Next" operations (looping back to beginning)', (editor) => {
		const findState = disposables.add(new FindReplaceState());
		findState.change({ searchString: 'hello' }, false);
		const findModel = disposables.add(new FindModelBoundToEditorModel(editor, findState));

		assert.strictEqual(findState.matchesCount, 5);

		// Test next operations
		assert.strictEqual(findState.matchesPosition, 0);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 2);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 3);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 4);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 5);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToNextMatch();
		assert.strictEqual(findState.matchesPosition, 2);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		// Test previous operations
		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 5);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 4);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 3);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 2);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

		findModel.moveToPrevMatch();
		assert.strictEqual(findState.matchesPosition, 1);
		assert.strictEqual(findState.canNavigateForward(), true);
		assert.strictEqual(findState.canNavigateBack(), true);

	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/find/test/browser/replacePattern.test.ts]---
Location: vscode-main/src/vs/editor/contrib/find/test/browser/replacePattern.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { buildReplaceStringWithCasePreserved } from '../../../../../base/common/search.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { parseReplaceString, ReplacePattern, ReplacePiece } from '../../browser/replacePattern.js';

suite('Replace Pattern test', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	test('parse replace string', () => {
		const testParse = (input: string, expectedPieces: ReplacePiece[]) => {
			const actual = parseReplaceString(input);
			const expected = new ReplacePattern(expectedPieces);
			assert.deepStrictEqual(actual, expected, 'Parsing ' + input);
		};

		// no backslash => no treatment
		testParse('hello', [ReplacePiece.staticValue('hello')]);

		// \t => TAB
		testParse('\\thello', [ReplacePiece.staticValue('\thello')]);
		testParse('h\\tello', [ReplacePiece.staticValue('h\tello')]);
		testParse('hello\\t', [ReplacePiece.staticValue('hello\t')]);

		// \n => LF
		testParse('\\nhello', [ReplacePiece.staticValue('\nhello')]);

		// \\t => \t
		testParse('\\\\thello', [ReplacePiece.staticValue('\\thello')]);
		testParse('h\\\\tello', [ReplacePiece.staticValue('h\\tello')]);
		testParse('hello\\\\t', [ReplacePiece.staticValue('hello\\t')]);

		// \\\t => \TAB
		testParse('\\\\\\thello', [ReplacePiece.staticValue('\\\thello')]);

		// \\\\t => \\t
		testParse('\\\\\\\\thello', [ReplacePiece.staticValue('\\\\thello')]);

		// \ at the end => no treatment
		testParse('hello\\', [ReplacePiece.staticValue('hello\\')]);

		// \ with unknown char => no treatment
		testParse('hello\\x', [ReplacePiece.staticValue('hello\\x')]);

		// \ with back reference => no treatment
		testParse('hello\\0', [ReplacePiece.staticValue('hello\\0')]);

		testParse('hello$&', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(0)]);
		testParse('hello$0', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(0)]);
		testParse('hello$02', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(0), ReplacePiece.staticValue('2')]);
		testParse('hello$1', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(1)]);
		testParse('hello$2', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(2)]);
		testParse('hello$9', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(9)]);
		testParse('$9hello', [ReplacePiece.matchIndex(9), ReplacePiece.staticValue('hello')]);

		testParse('hello$12', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(12)]);
		testParse('hello$99', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(99)]);
		testParse('hello$99a', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(99), ReplacePiece.staticValue('a')]);
		testParse('hello$1a', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(1), ReplacePiece.staticValue('a')]);
		testParse('hello$100', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(10), ReplacePiece.staticValue('0')]);
		testParse('hello$100a', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(10), ReplacePiece.staticValue('0a')]);
		testParse('hello$10a0', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(10), ReplacePiece.staticValue('a0')]);
		testParse('hello$$', [ReplacePiece.staticValue('hello$')]);
		testParse('hello$$0', [ReplacePiece.staticValue('hello$0')]);

		testParse('hello$`', [ReplacePiece.staticValue('hello$`')]);
		testParse('hello$\'', [ReplacePiece.staticValue('hello$\'')]);
	});

	test('parse replace string with case modifiers', () => {
		const testParse = (input: string, expectedPieces: ReplacePiece[]) => {
			const actual = parseReplaceString(input);
			const expected = new ReplacePattern(expectedPieces);
			assert.deepStrictEqual(actual, expected, 'Parsing ' + input);
		};
		function assertReplace(target: string, search: RegExp, replaceString: string, expected: string): void {
			const replacePattern = parseReplaceString(replaceString);
			const m = search.exec(target);
			const actual = replacePattern.buildReplaceString(m);

			assert.strictEqual(actual, expected, `${target}.replace(${search}, ${replaceString}) === ${expected}`);
		}

		// \U, \u => uppercase  \L, \l => lowercase  \E => cancel

		testParse('hello\\U$1', [ReplacePiece.staticValue('hello'), ReplacePiece.caseOps(1, ['U'])]);
		assertReplace('func privateFunc(', /func (\w+)\(/, 'func \\U$1(', 'func PRIVATEFUNC(');

		testParse('hello\\u$1', [ReplacePiece.staticValue('hello'), ReplacePiece.caseOps(1, ['u'])]);
		assertReplace('func privateFunc(', /func (\w+)\(/, 'func \\u$1(', 'func PrivateFunc(');

		testParse('hello\\L$1', [ReplacePiece.staticValue('hello'), ReplacePiece.caseOps(1, ['L'])]);
		assertReplace('func privateFunc(', /func (\w+)\(/, 'func \\L$1(', 'func privatefunc(');

		testParse('hello\\l$1', [ReplacePiece.staticValue('hello'), ReplacePiece.caseOps(1, ['l'])]);
		assertReplace('func PrivateFunc(', /func (\w+)\(/, 'func \\l$1(', 'func privateFunc(');

		testParse('hello$1\\u\\u\\U$4goodbye', [ReplacePiece.staticValue('hello'), ReplacePiece.matchIndex(1), ReplacePiece.caseOps(4, ['u', 'u', 'U']), ReplacePiece.staticValue('goodbye')]);
		assertReplace('hellogooDbye', /hello(\w+)/, 'hello\\u\\u\\l\\l\\U$1', 'helloGOodBYE');
	});

	test('replace has JavaScript semantics', () => {
		const testJSReplaceSemantics = (target: string, search: RegExp, replaceString: string, expected: string) => {
			const replacePattern = parseReplaceString(replaceString);
			const m = search.exec(target);
			const actual = replacePattern.buildReplaceString(m);

			assert.deepStrictEqual(actual, expected, `${target}.replace(${search}, ${replaceString})`);
		};

		testJSReplaceSemantics('hi', /hi/, 'hello', 'hi'.replace(/hi/, 'hello'));
		testJSReplaceSemantics('hi', /hi/, '\\t', 'hi'.replace(/hi/, '\t'));
		testJSReplaceSemantics('hi', /hi/, '\\n', 'hi'.replace(/hi/, '\n'));
		testJSReplaceSemantics('hi', /hi/, '\\\\t', 'hi'.replace(/hi/, '\\t'));
		testJSReplaceSemantics('hi', /hi/, '\\\\n', 'hi'.replace(/hi/, '\\n'));

		// implicit capture group 0
		testJSReplaceSemantics('hi', /hi/, 'hello$&', 'hi'.replace(/hi/, 'hello$&'));
		testJSReplaceSemantics('hi', /hi/, 'hello$0', 'hi'.replace(/hi/, 'hello$&'));
		testJSReplaceSemantics('hi', /hi/, 'hello$&1', 'hi'.replace(/hi/, 'hello$&1'));
		testJSReplaceSemantics('hi', /hi/, 'hello$01', 'hi'.replace(/hi/, 'hello$&1'));

		// capture groups have funny semantics in replace strings
		// the replace string interprets $nn as a captured group only if it exists in the search regex
		testJSReplaceSemantics('hi', /(hi)/, 'hello$10', 'hi'.replace(/(hi)/, 'hello$10'));
		testJSReplaceSemantics('hi', /(hi)()()()()()()()()()/, 'hello$10', 'hi'.replace(/(hi)()()()()()()()()()/, 'hello$10'));
		testJSReplaceSemantics('hi', /(hi)/, 'hello$100', 'hi'.replace(/(hi)/, 'hello$100'));
		testJSReplaceSemantics('hi', /(hi)/, 'hello$20', 'hi'.replace(/(hi)/, 'hello$20'));
	});

	test('get replace string if given text is a complete match', () => {
		function assertReplace(target: string, search: RegExp, replaceString: string, expected: string): void {
			const replacePattern = parseReplaceString(replaceString);
			const m = search.exec(target);
			const actual = replacePattern.buildReplaceString(m);

			assert.strictEqual(actual, expected, `${target}.replace(${search}, ${replaceString}) === ${expected}`);
		}

		assertReplace('bla', /bla/, 'hello', 'hello');
		assertReplace('bla', /(bla)/, 'hello', 'hello');
		assertReplace('bla', /(bla)/, 'hello$0', 'hellobla');

		const searchRegex = /let\s+(\w+)\s*=\s*require\s*\(\s*['"]([\w\.\-/]+)\s*['"]\s*\)\s*/;
		assertReplace('let fs = require(\'fs\')', searchRegex, 'import * as $1 from \'$2\';', 'import * as fs from \'fs\';');
		assertReplace('let something = require(\'fs\')', searchRegex, 'import * as $1 from \'$2\';', 'import * as something from \'fs\';');
		assertReplace('let something = require(\'fs\')', searchRegex, 'import * as $1 from \'$1\';', 'import * as something from \'something\';');
		assertReplace('let something = require(\'fs\')', searchRegex, 'import * as $2 from \'$1\';', 'import * as fs from \'something\';');
		assertReplace('let something = require(\'fs\')', searchRegex, 'import * as $0 from \'$0\';', 'import * as let something = require(\'fs\') from \'let something = require(\'fs\')\';');
		assertReplace('let fs = require(\'fs\')', searchRegex, 'import * as $1 from \'$2\';', 'import * as fs from \'fs\';');
		assertReplace('for ()', /for(.*)/, 'cat$1', 'cat ()');

		// issue #18111
		assertReplace('HRESULT OnAmbientPropertyChange(DISPID   dispid);', /\b\s{3}\b/, ' ', ' ');
	});

	test('get replace string if match is sub-string of the text', () => {
		function assertReplace(target: string, search: RegExp, replaceString: string, expected: string): void {
			const replacePattern = parseReplaceString(replaceString);
			const m = search.exec(target);
			const actual = replacePattern.buildReplaceString(m);

			assert.strictEqual(actual, expected, `${target}.replace(${search}, ${replaceString}) === ${expected}`);
		}
		assertReplace('this is a bla text', /bla/, 'hello', 'hello');
		assertReplace('this is a bla text', /this(?=.*bla)/, 'that', 'that');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$1at', 'that');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$1e', 'the');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$1ere', 'there');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$1', 'th');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, 'ma$1', 'math');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, 'ma$1s', 'maths');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$0', 'this');
		assertReplace('this is a bla text', /(th)is(?=.*bla)/, '$0$1', 'thisth');
		assertReplace('this is a bla text', /bla(?=\stext$)/, 'foo', 'foo');
		assertReplace('this is a bla text', /b(la)(?=\stext$)/, 'f$1', 'fla');
		assertReplace('this is a bla text', /b(la)(?=\stext$)/, 'f$0', 'fbla');
		assertReplace('this is a bla text', /b(la)(?=\stext$)/, '$0ah', 'blaah');
	});

	test('issue #19740 Find and replace capture group/backreference inserts `undefined` instead of empty string', () => {
		const replacePattern = parseReplaceString('a{$1}');
		const matches = /a(z)?/.exec('abcd');
		const actual = replacePattern.buildReplaceString(matches);
		assert.strictEqual(actual, 'a{}');
	});

	test('buildReplaceStringWithCasePreserved test', () => {
		function assertReplace(target: string[], replaceString: string, expected: string): void {
			let actual: string = '';
			actual = buildReplaceStringWithCasePreserved(target, replaceString);
			assert.strictEqual(actual, expected);
		}

		assertReplace(['abc'], 'Def', 'def');
		assertReplace(['Abc'], 'Def', 'Def');
		assertReplace(['ABC'], 'Def', 'DEF');
		assertReplace(['abc', 'Abc'], 'Def', 'def');
		assertReplace(['Abc', 'abc'], 'Def', 'Def');
		assertReplace(['ABC', 'abc'], 'Def', 'DEF');
		assertReplace(['aBc', 'abc'], 'Def', 'def');
		assertReplace(['AbC'], 'Def', 'Def');
		assertReplace(['aBC'], 'Def', 'def');
		assertReplace(['aBc'], 'DeF', 'deF');
		assertReplace(['Foo-Bar'], 'newfoo-newbar', 'Newfoo-Newbar');
		assertReplace(['Foo-Bar-Abc'], 'newfoo-newbar-newabc', 'Newfoo-Newbar-Newabc');
		assertReplace(['Foo-Bar-abc'], 'newfoo-newbar', 'Newfoo-newbar');
		assertReplace(['foo-Bar'], 'newfoo-newbar', 'newfoo-Newbar');
		assertReplace(['foo-BAR'], 'newfoo-newbar', 'newfoo-NEWBAR');
		assertReplace(['foO-BAR'], 'NewFoo-NewBar', 'newFoo-NEWBAR');
		assertReplace(['Foo_Bar'], 'newfoo_newbar', 'Newfoo_Newbar');
		assertReplace(['Foo_Bar_Abc'], 'newfoo_newbar_newabc', 'Newfoo_Newbar_Newabc');
		assertReplace(['Foo_Bar_abc'], 'newfoo_newbar', 'Newfoo_newbar');
		assertReplace(['Foo_Bar-abc'], 'newfoo_newbar-abc', 'Newfoo_newbar-abc');
		assertReplace(['foo_Bar'], 'newfoo_newbar', 'newfoo_Newbar');
		assertReplace(['Foo_BAR'], 'newfoo_newbar', 'Newfoo_NEWBAR');
	});

	test('preserve case', () => {
		function assertReplace(target: string[], replaceString: string, expected: string): void {
			const replacePattern = parseReplaceString(replaceString);
			const actual = replacePattern.buildReplaceString(target, true);
			assert.strictEqual(actual, expected);
		}

		assertReplace(['abc'], 'Def', 'def');
		assertReplace(['Abc'], 'Def', 'Def');
		assertReplace(['ABC'], 'Def', 'DEF');
		assertReplace(['abc', 'Abc'], 'Def', 'def');
		assertReplace(['Abc', 'abc'], 'Def', 'Def');
		assertReplace(['ABC', 'abc'], 'Def', 'DEF');
		assertReplace(['aBc', 'abc'], 'Def', 'def');
		assertReplace(['AbC'], 'Def', 'Def');
		assertReplace(['aBC'], 'Def', 'def');
		assertReplace(['aBc'], 'DeF', 'deF');
		assertReplace(['Foo-Bar'], 'newfoo-newbar', 'Newfoo-Newbar');
		assertReplace(['Foo-Bar-Abc'], 'newfoo-newbar-newabc', 'Newfoo-Newbar-Newabc');
		assertReplace(['Foo-Bar-abc'], 'newfoo-newbar', 'Newfoo-newbar');
		assertReplace(['foo-Bar'], 'newfoo-newbar', 'newfoo-Newbar');
		assertReplace(['foo-BAR'], 'newfoo-newbar', 'newfoo-NEWBAR');
		assertReplace(['foO-BAR'], 'NewFoo-NewBar', 'newFoo-NEWBAR');
		assertReplace(['Foo_Bar'], 'newfoo_newbar', 'Newfoo_Newbar');
		assertReplace(['Foo_Bar_Abc'], 'newfoo_newbar_newabc', 'Newfoo_Newbar_Newabc');
		assertReplace(['Foo_Bar_abc'], 'newfoo_newbar', 'Newfoo_newbar');
		assertReplace(['Foo_Bar-abc'], 'newfoo_newbar-abc', 'Newfoo_newbar-abc');
		assertReplace(['foo_Bar'], 'newfoo_newbar', 'newfoo_Newbar');
		assertReplace(['foo_BAR'], 'newfoo_newbar', 'newfoo_NEWBAR');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/floatingMenu/browser/floatingMenu.contribution.ts]---
Location: vscode-main/src/vs/editor/contrib/floatingMenu/browser/floatingMenu.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './floatingMenu.css';
import { registerEditorContribution, EditorContributionInstantiation } from '../../../browser/editorExtensions.js';
import { FloatingEditorToolbar } from './floatingMenu.js';

registerEditorContribution(FloatingEditorToolbar.ID, FloatingEditorToolbar, EditorContributionInstantiation.AfterFirstRender);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/floatingMenu/browser/floatingMenu.css]---
Location: vscode-main/src/vs/editor/contrib/floatingMenu/browser/floatingMenu.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.floating-menu-overlay-widget {
	padding: 0px;
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
	border-radius: 2px;
	border: 1px solid var(--vscode-contrastBorder);
	display: flex;
	align-items: center;
	z-index: 10;
	box-shadow: 0 2px 8px var(--vscode-widget-shadow);
	overflow: hidden;

	.action-item > .action-label {
		padding: 5px;
		font-size: 12px;
		border-radius: 2px;
	}

	.action-item > .action-label.codicon, .action-item .codicon {
		color: var(--vscode-button-foreground);
	}

	.action-item > .action-label.codicon:not(.separator) {
		padding-top: 6px;
		padding-bottom: 6px;
	}

	.action-item:first-child > .action-label {
		padding-left: 7px;
	}

	.action-item:last-child > .action-label {
		padding-right: 7px;
	}

	.action-item .action-label.separator {
		background-color: var(--vscode-button-separator);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/floatingMenu/browser/floatingMenu.ts]---
Location: vscode-main/src/vs/editor/contrib/floatingMenu/browser/floatingMenu.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { h } from '../../../../base/browser/dom.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, constObservable, observableFromEvent } from '../../../../base/common/observable.js';
import { MenuEntryActionViewItem } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { HiddenItemStrategy, MenuWorkbenchToolBar } from '../../../../platform/actions/browser/toolbar.js';
import { IMenuService, MenuId, MenuItemAction } from '../../../../platform/actions/common/actions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ICodeEditor, OverlayWidgetPositionPreference } from '../../../browser/editorBrowser.js';
import { observableCodeEditor } from '../../../browser/observableCodeEditor.js';
import { IEditorContribution } from '../../../common/editorCommon.js';

export class FloatingEditorToolbar extends Disposable implements IEditorContribution {
	static readonly ID = 'editor.contrib.floatingToolbar';

	constructor(
		editor: ICodeEditor,
		@IInstantiationService instantiationService: IInstantiationService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IMenuService menuService: IMenuService
	) {
		super();

		const editorObs = this._register(observableCodeEditor(editor));

		const menu = this._register(menuService.createMenu(MenuId.EditorContent, editor.contextKeyService));
		const menuIsEmptyObs = observableFromEvent(this, menu.onDidChange, () => menu.getActions().length === 0);

		this._register(autorun(reader => {
			const menuIsEmpty = menuIsEmptyObs.read(reader);
			if (menuIsEmpty) {
				return;
			}

			const container = h('div.floating-menu-overlay-widget');

			// Set height explicitly to ensure that the floating menu element
			// is rendered in the lower right corner at the correct position.
			container.root.style.height = '28px';

			// Toolbar
			const toolbar = instantiationService.createInstance(MenuWorkbenchToolBar, container.root, MenuId.EditorContent, {
				actionViewItemProvider: (action, options) => {
					if (!(action instanceof MenuItemAction)) {
						return undefined;
					}

					const keybinding = keybindingService.lookupKeybinding(action.id);
					if (!keybinding) {
						return undefined;
					}

					return instantiationService.createInstance(class extends MenuEntryActionViewItem {
						protected override updateLabel(): void {
							if (this.options.label && this.label) {
								this.label.textContent = `${this._commandAction.label} (${keybinding.getLabel()})`;
							}
						}
					}, action, { ...options, keybindingNotRenderedWithLabel: true });
				},
				hiddenItemStrategy: HiddenItemStrategy.Ignore,
				menuOptions: {
					shouldForwardArgs: true
				},
				telemetrySource: 'editor.overlayToolbar',
				toolbarOptions: {
					primaryGroup: () => true,
					useSeparatorsInPrimaryActions: true
				},
			});

			reader.store.add(toolbar);
			reader.store.add(autorun(reader => {
				const model = editorObs.model.read(reader);
				toolbar.context = model?.uri;
			}));

			// Overlay widget
			reader.store.add(editorObs.createOverlayWidget({
				allowEditorOverflow: false,
				domNode: container.root,
				minContentWidthInPx: constObservable(0),
				position: constObservable({
					preference: OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
				})
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/folding.css]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/folding.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
.monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,
.monaco-editor .margin-view-overlays .codicon-folding-manual-expanded,
.monaco-editor .margin-view-overlays .codicon-folding-expanded,
.monaco-editor .margin-view-overlays .codicon-folding-collapsed {
	cursor: pointer;
	opacity: 0;
	transition: opacity 0.5s;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 140%;
	margin-left: 2px;
}

.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-collapsed,
.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-manual-expanded,
.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-expanded,
.monaco-reduce-motion .monaco-editor .margin-view-overlays .codicon-folding-collapsed {
	transition: initial;
}

.monaco-editor .margin-view-overlays:hover .codicon,
.monaco-editor .margin-view-overlays .codicon.codicon-folding-collapsed,
.monaco-editor .margin-view-overlays .codicon.codicon-folding-manual-collapsed,
.monaco-editor .margin-view-overlays .codicon.alwaysShowFoldIcons {
	opacity: 1;
}

.monaco-editor .inline-folded:after {
	color: var(--vscode-editor-foldPlaceholderForeground);
	margin: 0.1em 0.2em 0 0.2em;
	content: "\22EF"; /* ellipses unicode character */
	display: inline;
	line-height: 1em;
	cursor: pointer;
}

.monaco-editor .folded-background {
	background-color: var(--vscode-editor-foldBackground);
}

.monaco-editor .cldr.codicon.codicon-folding-expanded,
.monaco-editor .cldr.codicon.codicon-folding-collapsed,
.monaco-editor .cldr.codicon.codicon-folding-manual-expanded,
.monaco-editor .cldr.codicon.codicon-folding-manual-collapsed {
	color: var(--vscode-editorGutter-foldingControlForeground) !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/folding.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/folding.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, Delayer, RunOnceScheduler } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { illegalArgument, onUnexpectedError } from '../../../../base/common/errors.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';
import * as types from '../../../../base/common/types.js';
import './folding.css';
import { StableEditorScrollState } from '../../../browser/stableEditorScroll.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../browser/editorBrowser.js';
import { EditorAction, EditorContributionInstantiation, registerEditorAction, registerEditorContribution, registerInstantiatedEditorAction, ServicesAccessor } from '../../../browser/editorExtensions.js';
import { ConfigurationChangedEvent, EditorOption } from '../../../common/config/editorOptions.js';
import { IPosition } from '../../../common/core/position.js';
import { IRange } from '../../../common/core/range.js';
import { Selection } from '../../../common/core/selection.js';
import { IEditorContribution, ScrollType } from '../../../common/editorCommon.js';
import { EditorContextKeys } from '../../../common/editorContextKeys.js';
import { ITextModel } from '../../../common/model.js';
import { IModelContentChangedEvent } from '../../../common/textModelEvents.js';
import { FoldingRange, FoldingRangeKind, FoldingRangeProvider } from '../../../common/languages.js';
import { ILanguageConfigurationService } from '../../../common/languages/languageConfigurationRegistry.js';
import { CollapseMemento, FoldingModel, getNextFoldLine, getParentFoldLine as getParentFoldLine, getPreviousFoldLine, setCollapseStateAtLevel, setCollapseStateForMatchingLines, setCollapseStateForRest, setCollapseStateForType, setCollapseStateLevelsDown, setCollapseStateLevelsUp, setCollapseStateUp, toggleCollapseState } from './foldingModel.js';
import { HiddenRangeModel } from './hiddenRangeModel.js';
import { IndentRangeProvider } from './indentRangeProvider.js';
import * as nls from '../../../../nls.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { FoldingDecorationProvider } from './foldingDecorations.js';
import { FoldingRegion, FoldingRegions, FoldRange, FoldSource, ILineRange } from './foldingRanges.js';
import { SyntaxRangeProvider } from './syntaxRangeProvider.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IFeatureDebounceInformation, ILanguageFeatureDebounceService } from '../../../common/services/languageFeatureDebounce.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILanguageFeaturesService } from '../../../common/services/languageFeatures.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { URI } from '../../../../base/common/uri.js';
import { IModelService } from '../../../common/services/model.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';

const CONTEXT_FOLDING_ENABLED = new RawContextKey<boolean>('foldingEnabled', false);

export interface RangeProvider {
	readonly id: string;
	compute(cancelationToken: CancellationToken): Promise<FoldingRegions | null>;
	dispose(): void;
}

interface FoldingStateMemento {
	collapsedRegions?: CollapseMemento;
	lineCount?: number;
	provider?: string;
	foldedImports?: boolean;
}

export interface FoldingLimitReporter {
	readonly limit: number;
	update(computed: number, limited: number | false): void;
}

export type FoldingRangeProviderSelector = (provider: FoldingRangeProvider[], document: ITextModel) => FoldingRangeProvider[] | undefined;

export class FoldingController extends Disposable implements IEditorContribution {

	public static readonly ID = 'editor.contrib.folding';

	public static get(editor: ICodeEditor): FoldingController | null {
		return editor.getContribution<FoldingController>(FoldingController.ID);
	}

	private static _foldingRangeSelector: FoldingRangeProviderSelector | undefined;

	public static getFoldingRangeProviders(languageFeaturesService: ILanguageFeaturesService, model: ITextModel): FoldingRangeProvider[] {
		const foldingRangeProviders = languageFeaturesService.foldingRangeProvider.ordered(model);
		return (FoldingController._foldingRangeSelector?.(foldingRangeProviders, model)) ?? foldingRangeProviders;
	}

	public static setFoldingRangeProviderSelector(foldingRangeSelector: FoldingRangeProviderSelector): IDisposable {
		FoldingController._foldingRangeSelector = foldingRangeSelector;
		return { dispose: () => { FoldingController._foldingRangeSelector = undefined; } };
	}

	private readonly editor: ICodeEditor;
	private _isEnabled: boolean;
	private _useFoldingProviders: boolean;
	private _unfoldOnClickAfterEndOfLine: boolean;
	private _restoringViewState: boolean;
	private _foldingImportsByDefault: boolean;
	private _currentModelHasFoldedImports: boolean;

	private readonly foldingDecorationProvider: FoldingDecorationProvider;

	private foldingModel: FoldingModel | null;
	private hiddenRangeModel: HiddenRangeModel | null;

	private rangeProvider: RangeProvider | null;
	private foldingRegionPromise: CancelablePromise<FoldingRegions | null> | null;

	private foldingModelPromise: Promise<FoldingModel | null> | null;
	private updateScheduler: Delayer<FoldingModel | null> | null;
	private readonly updateDebounceInfo: IFeatureDebounceInformation;

	private foldingEnabled: IContextKey<boolean>;
	private cursorChangedScheduler: RunOnceScheduler | null;

	private readonly localToDispose = this._register(new DisposableStore());
	private mouseDownInfo: { lineNumber: number; iconClicked: boolean } | null;

	public readonly _foldingLimitReporter: RangesLimitReporter;

	constructor(
		editor: ICodeEditor,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ILanguageConfigurationService private readonly languageConfigurationService: ILanguageConfigurationService,
		@INotificationService notificationService: INotificationService,
		@ILanguageFeatureDebounceService languageFeatureDebounceService: ILanguageFeatureDebounceService,
		@ILanguageFeaturesService private readonly languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this.editor = editor;

		this._foldingLimitReporter = this._register(new RangesLimitReporter(editor));

		const options = this.editor.getOptions();
		this._isEnabled = options.get(EditorOption.folding);
		this._useFoldingProviders = options.get(EditorOption.foldingStrategy) !== 'indentation';
		this._unfoldOnClickAfterEndOfLine = options.get(EditorOption.unfoldOnClickAfterEndOfLine);
		this._restoringViewState = false;
		this._currentModelHasFoldedImports = false;
		this._foldingImportsByDefault = options.get(EditorOption.foldingImportsByDefault);
		this.updateDebounceInfo = languageFeatureDebounceService.for(languageFeaturesService.foldingRangeProvider, 'Folding', { min: 200 });

		this.foldingModel = null;
		this.hiddenRangeModel = null;
		this.rangeProvider = null;
		this.foldingRegionPromise = null;
		this.foldingModelPromise = null;
		this.updateScheduler = null;
		this.cursorChangedScheduler = null;
		this.mouseDownInfo = null;

		this.foldingDecorationProvider = new FoldingDecorationProvider(editor);
		this.foldingDecorationProvider.showFoldingControls = options.get(EditorOption.showFoldingControls);
		this.foldingDecorationProvider.showFoldingHighlights = options.get(EditorOption.foldingHighlight);
		this.foldingEnabled = CONTEXT_FOLDING_ENABLED.bindTo(this.contextKeyService);
		this.foldingEnabled.set(this._isEnabled);

		this._register(this.editor.onDidChangeModel(() => this.onModelChanged()));

		this._register(this.editor.onDidChangeConfiguration((e: ConfigurationChangedEvent) => {
			if (e.hasChanged(EditorOption.folding)) {
				this._isEnabled = this.editor.getOptions().get(EditorOption.folding);
				this.foldingEnabled.set(this._isEnabled);
				this.onModelChanged();
			}
			if (e.hasChanged(EditorOption.foldingMaximumRegions)) {
				this.onModelChanged();
			}
			if (e.hasChanged(EditorOption.showFoldingControls) || e.hasChanged(EditorOption.foldingHighlight)) {
				const options = this.editor.getOptions();
				this.foldingDecorationProvider.showFoldingControls = options.get(EditorOption.showFoldingControls);
				this.foldingDecorationProvider.showFoldingHighlights = options.get(EditorOption.foldingHighlight);
				this.triggerFoldingModelChanged();
			}
			if (e.hasChanged(EditorOption.foldingStrategy)) {
				this._useFoldingProviders = this.editor.getOptions().get(EditorOption.foldingStrategy) !== 'indentation';
				this.onFoldingStrategyChanged();
			}
			if (e.hasChanged(EditorOption.unfoldOnClickAfterEndOfLine)) {
				this._unfoldOnClickAfterEndOfLine = this.editor.getOptions().get(EditorOption.unfoldOnClickAfterEndOfLine);
			}
			if (e.hasChanged(EditorOption.foldingImportsByDefault)) {
				this._foldingImportsByDefault = this.editor.getOptions().get(EditorOption.foldingImportsByDefault);
			}
		}));
		this.onModelChanged();
	}

	public get limitReporter() {
		return this._foldingLimitReporter;
	}

	/**
	 * Store view state.
	 */
	public saveViewState(): FoldingStateMemento | undefined {
		const model = this.editor.getModel();
		if (!model || !this._isEnabled || model.isTooLargeForTokenization()) {
			return {};
		}
		if (this.foldingModel) { // disposed ?
			const collapsedRegions = this.foldingModel.getMemento();
			const provider = this.rangeProvider ? this.rangeProvider.id : undefined;
			return { collapsedRegions, lineCount: model.getLineCount(), provider, foldedImports: this._currentModelHasFoldedImports };
		}
		return undefined;
	}

	/**
	 * Restore view state.
	 */
	public restoreViewState(state: FoldingStateMemento): void {
		const model = this.editor.getModel();
		if (!model || !this._isEnabled || model.isTooLargeForTokenization() || !this.hiddenRangeModel) {
			return;
		}
		if (!state) {
			return;
		}

		this._currentModelHasFoldedImports = !!state.foldedImports;
		if (state.collapsedRegions && state.collapsedRegions.length > 0 && this.foldingModel) {
			this._restoringViewState = true;
			try {
				this.foldingModel.applyMemento(state.collapsedRegions);
			} finally {
				this._restoringViewState = false;
			}
		}
	}

	private onModelChanged(): void {
		this.localToDispose.clear();

		const model = this.editor.getModel();
		if (!this._isEnabled || !model || model.isTooLargeForTokenization()) {
			// huge files get no view model, so they cannot support hidden areas
			return;
		}

		this._currentModelHasFoldedImports = false;
		this.foldingModel = new FoldingModel(model, this.foldingDecorationProvider);
		this.localToDispose.add(this.foldingModel);

		this.hiddenRangeModel = new HiddenRangeModel(this.foldingModel);
		this.localToDispose.add(this.hiddenRangeModel);
		this.localToDispose.add(this.hiddenRangeModel.onDidChange(hr => this.onHiddenRangesChanges(hr)));

		this.updateScheduler = new Delayer<FoldingModel>(this.updateDebounceInfo.get(model));
		this.localToDispose.add(this.updateScheduler);

		this.cursorChangedScheduler = new RunOnceScheduler(() => this.revealCursor(), 200);
		this.localToDispose.add(this.cursorChangedScheduler);
		this.localToDispose.add(this.languageFeaturesService.foldingRangeProvider.onDidChange(() => this.onFoldingStrategyChanged()));
		this.localToDispose.add(this.editor.onDidChangeModelLanguageConfiguration(() => this.onFoldingStrategyChanged())); // covers model language changes as well
		this.localToDispose.add(this.editor.onDidChangeModelContent(e => this.onDidChangeModelContent(e)));
		this.localToDispose.add(this.editor.onDidChangeCursorPosition(() => this.onCursorPositionChanged()));
		this.localToDispose.add(this.editor.onMouseDown(e => this.onEditorMouseDown(e)));
		this.localToDispose.add(this.editor.onMouseUp(e => this.onEditorMouseUp(e)));
		this.localToDispose.add({
			dispose: () => {
				if (this.foldingRegionPromise) {
					this.foldingRegionPromise.cancel();
					this.foldingRegionPromise = null;
				}
				this.updateScheduler?.cancel();
				this.updateScheduler = null;
				this.foldingModel = null;
				this.foldingModelPromise = null;
				this.hiddenRangeModel = null;
				this.cursorChangedScheduler = null;
				this.rangeProvider?.dispose();
				this.rangeProvider = null;
			}
		});
		this.triggerFoldingModelChanged();
	}

	private onFoldingStrategyChanged() {
		this.rangeProvider?.dispose();
		this.rangeProvider = null;
		this.triggerFoldingModelChanged();
	}

	private getRangeProvider(editorModel: ITextModel): RangeProvider {
		if (this.rangeProvider) {
			return this.rangeProvider;
		}
		const indentRangeProvider = new IndentRangeProvider(editorModel, this.languageConfigurationService, this._foldingLimitReporter);
		this.rangeProvider = indentRangeProvider; // fallback
		if (this._useFoldingProviders && this.foldingModel) {
			const selectedProviders = FoldingController.getFoldingRangeProviders(this.languageFeaturesService, editorModel);
			if (selectedProviders.length > 0) {
				this.rangeProvider = new SyntaxRangeProvider(editorModel, selectedProviders, () => this.triggerFoldingModelChanged(), this._foldingLimitReporter, indentRangeProvider);
			}
		}
		return this.rangeProvider;
	}

	public getFoldingModel(): Promise<FoldingModel | null> | null {
		return this.foldingModelPromise;
	}

	private onDidChangeModelContent(e: IModelContentChangedEvent) {
		this.hiddenRangeModel?.notifyChangeModelContent(e);
		this.triggerFoldingModelChanged();
	}


	public triggerFoldingModelChanged() {
		if (this.updateScheduler) {
			if (this.foldingRegionPromise) {
				this.foldingRegionPromise.cancel();
				this.foldingRegionPromise = null;
			}
			this.foldingModelPromise = this.updateScheduler.trigger(() => {
				const foldingModel = this.foldingModel;
				if (!foldingModel) { // null if editor has been disposed, or folding turned off
					return null;
				}
				const sw = new StopWatch();
				const provider = this.getRangeProvider(foldingModel.textModel);
				const foldingRegionPromise = this.foldingRegionPromise = createCancelablePromise(token => provider.compute(token));
				return foldingRegionPromise.then(foldingRanges => {
					if (foldingRanges && foldingRegionPromise === this.foldingRegionPromise) { // new request or cancelled in the meantime?
						let scrollState: StableEditorScrollState | undefined;

						if (this._foldingImportsByDefault && !this._currentModelHasFoldedImports) {
							const hasChanges = foldingRanges.setCollapsedAllOfType(FoldingRangeKind.Imports.value, true);
							if (hasChanges) {
								scrollState = StableEditorScrollState.capture(this.editor);
								this._currentModelHasFoldedImports = hasChanges;
							}
						}

						// some cursors might have moved into hidden regions, make sure they are in expanded regions
						const selections = this.editor.getSelections();
						foldingModel.update(foldingRanges, toSelectedLines(selections));

						scrollState?.restore(this.editor);

						// update debounce info
						const newValue = this.updateDebounceInfo.update(foldingModel.textModel, sw.elapsed());
						if (this.updateScheduler) {
							this.updateScheduler.defaultDelay = newValue;
						}
					}
					return foldingModel;
				});
			}).then(undefined, (err) => {
				onUnexpectedError(err);
				return null;
			});
		}
	}

	private onHiddenRangesChanges(hiddenRanges: IRange[]) {
		if (this.hiddenRangeModel && hiddenRanges.length && !this._restoringViewState) {
			const selections = this.editor.getSelections();
			if (selections) {
				if (this.hiddenRangeModel.adjustSelections(selections)) {
					this.editor.setSelections(selections);
				}
			}
		}
		this.editor.setHiddenAreas(hiddenRanges, this);
	}

	private onCursorPositionChanged() {
		if (this.hiddenRangeModel && this.hiddenRangeModel.hasRanges()) {
			this.cursorChangedScheduler!.schedule();
		}
	}

	private revealCursor() {
		const foldingModel = this.getFoldingModel();
		if (!foldingModel) {
			return;
		}
		foldingModel.then(foldingModel => { // null is returned if folding got disabled in the meantime
			if (foldingModel) {
				const selections = this.editor.getSelections();
				if (selections && selections.length > 0) {
					const toToggle: FoldingRegion[] = [];
					for (const selection of selections) {
						const lineNumber = selection.selectionStartLineNumber;
						if (this.hiddenRangeModel && this.hiddenRangeModel.isHidden(lineNumber)) {
							toToggle.push(...foldingModel.getAllRegionsAtLine(lineNumber, r => r.isCollapsed && lineNumber > r.startLineNumber));
						}
					}
					if (toToggle.length) {
						foldingModel.toggleCollapseState(toToggle);
						this.reveal(selections[0].getPosition());
					}
				}
			}
		}).then(undefined, onUnexpectedError);

	}

	private onEditorMouseDown(e: IEditorMouseEvent): void {
		this.mouseDownInfo = null;


		if (!this.hiddenRangeModel || !e.target || !e.target.range) {
			return;
		}
		if (!e.event.leftButton && !e.event.middleButton) {
			return;
		}
		const range = e.target.range;
		let iconClicked = false;
		switch (e.target.type) {
			case MouseTargetType.GUTTER_LINE_DECORATIONS: {
				const data = e.target.detail;
				const offsetLeftInGutter = e.target.element!.offsetLeft;
				const gutterOffsetX = data.offsetX - offsetLeftInGutter;

				// const gutterOffsetX = data.offsetX - data.glyphMarginWidth - data.lineNumbersWidth - data.glyphMarginLeft;

				// TODO@joao TODO@alex TODO@martin this is such that we don't collide with dirty diff
				if (gutterOffsetX < 4) { // the whitespace between the border and the real folding icon border is 4px
					return;
				}

				iconClicked = true;
				break;
			}
			case MouseTargetType.CONTENT_EMPTY: {
				if (this._unfoldOnClickAfterEndOfLine && this.hiddenRangeModel.hasRanges()) {
					const data = e.target.detail;
					if (!data.isAfterLines) {
						break;
					}
				}
				return;
			}
			case MouseTargetType.CONTENT_TEXT: {
				if (this.hiddenRangeModel.hasRanges()) {
					const model = this.editor.getModel();
					if (model && range.startColumn === model.getLineMaxColumn(range.startLineNumber)) {
						break;
					}
				}
				return;
			}
			default:
				return;
		}

		this.mouseDownInfo = { lineNumber: range.startLineNumber, iconClicked };
	}

	private onEditorMouseUp(e: IEditorMouseEvent): void {
		const foldingModel = this.foldingModel;
		if (!foldingModel || !this.mouseDownInfo || !e.target) {
			return;
		}
		const lineNumber = this.mouseDownInfo.lineNumber;
		const iconClicked = this.mouseDownInfo.iconClicked;

		const range = e.target.range;
		if (!range || range.startLineNumber !== lineNumber) {
			return;
		}

		if (iconClicked) {
			if (e.target.type !== MouseTargetType.GUTTER_LINE_DECORATIONS) {
				return;
			}
		} else {
			const model = this.editor.getModel();
			if (!model || range.startColumn !== model.getLineMaxColumn(lineNumber)) {
				return;
			}
		}

		const region = foldingModel.getRegionAtLine(lineNumber);
		if (region && region.startLineNumber === lineNumber) {
			const isCollapsed = region.isCollapsed;
			if (iconClicked || isCollapsed) {
				const surrounding = e.event.altKey;
				let toToggle = [];
				if (surrounding) {
					const filter = (otherRegion: FoldingRegion) => !otherRegion.containedBy(region) && !region.containedBy(otherRegion);
					const toMaybeToggle = foldingModel.getRegionsInside(null, filter);
					for (const r of toMaybeToggle) {
						if (r.isCollapsed) {
							toToggle.push(r);
						}
					}
					// if any surrounding regions are folded, unfold those. Otherwise, fold all surrounding
					if (toToggle.length === 0) {
						toToggle = toMaybeToggle;
					}
				}
				else {
					const recursive = e.event.middleButton || e.event.shiftKey;
					if (recursive) {
						for (const r of foldingModel.getRegionsInside(region)) {
							if (r.isCollapsed === isCollapsed) {
								toToggle.push(r);
							}
						}
					}
					// when recursive, first only collapse all children. If all are already folded or there are no children, also fold parent.
					if (isCollapsed || !recursive || toToggle.length === 0) {
						toToggle.push(region);
					}
				}
				foldingModel.toggleCollapseState(toToggle);
				this.reveal({ lineNumber, column: 1 });
			}
		}
	}

	public reveal(position: IPosition): void {
		this.editor.revealPositionInCenterIfOutsideViewport(position, ScrollType.Smooth);
	}
}

export class RangesLimitReporter extends Disposable implements FoldingLimitReporter {
	constructor(private readonly editor: ICodeEditor) {
		super();
	}

	public get limit() {
		return this.editor.getOptions().get(EditorOption.foldingMaximumRegions);
	}

	private _onDidChange = this._register(new Emitter<void>());
	public get onDidChange(): Event<void> { return this._onDidChange.event; }

	private _computed: number = 0;
	private _limited: number | false = false;
	public get computed(): number {
		return this._computed;
	}
	public get limited(): number | false {
		return this._limited;
	}
	public update(computed: number, limited: number | false) {
		if (computed !== this._computed || limited !== this._limited) {
			this._computed = computed;
			this._limited = limited;
			this._onDidChange.fire();
		}
	}
}

abstract class FoldingAction<T> extends EditorAction {

	abstract invoke(foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: T, languageConfigurationService: ILanguageConfigurationService): void;

	public override runEditorCommand(accessor: ServicesAccessor, editor: ICodeEditor, args: T): void | Promise<void> {
		const languageConfigurationService = accessor.get(ILanguageConfigurationService);
		const foldingController = FoldingController.get(editor);
		if (!foldingController) {
			return;
		}
		const foldingModelPromise = foldingController.getFoldingModel();
		if (foldingModelPromise) {
			this.reportTelemetry(accessor, editor);
			return foldingModelPromise.then(foldingModel => {
				if (foldingModel) {
					this.invoke(foldingController, foldingModel, editor, args, languageConfigurationService);
					const selection = editor.getSelection();
					if (selection) {
						foldingController.reveal(selection.getStartPosition());
					}
				}
			});
		}
	}

	protected getSelectedLines(editor: ICodeEditor) {
		const selections = editor.getSelections();
		return selections ? selections.map(s => s.startLineNumber) : [];
	}

	protected getLineNumbers(args: FoldingArguments, editor: ICodeEditor) {
		if (args && args.selectionLines) {
			return args.selectionLines.map(l => l + 1); // to 0-bases line numbers
		}
		return this.getSelectedLines(editor);
	}

	public run(_accessor: ServicesAccessor, _editor: ICodeEditor): void {
	}
}

export interface SelectedLines {
	startsInside(startLine: number, endLine: number): boolean;
}

export function toSelectedLines(selections: Selection[] | null): SelectedLines {
	if (!selections || selections.length === 0) {
		return {
			startsInside: () => false
		};
	}
	return {
		startsInside(startLine: number, endLine: number): boolean {
			for (const s of selections) {
				const line = s.startLineNumber;
				if (line >= startLine && line <= endLine) {
					return true;
				}
			}
			return false;
		}
	};
}

interface FoldingArguments {
	levels?: number;
	direction?: 'up' | 'down';
	selectionLines?: number[];
}

function foldingArgumentsConstraint(args: unknown) {
	if (!types.isUndefined(args)) {
		if (!types.isObject(args)) {
			return false;
		}
		const foldingArgs: FoldingArguments = args;
		if (!types.isUndefined(foldingArgs.levels) && !types.isNumber(foldingArgs.levels)) {
			return false;
		}
		if (!types.isUndefined(foldingArgs.direction) && !types.isString(foldingArgs.direction)) {
			return false;
		}
		if (!types.isUndefined(foldingArgs.selectionLines) && (!Array.isArray(foldingArgs.selectionLines) || !foldingArgs.selectionLines.every(types.isNumber))) {
			return false;
		}
	}
	return true;
}

class UnfoldAction extends FoldingAction<FoldingArguments> {

	constructor() {
		super({
			id: 'editor.unfold',
			label: nls.localize2('unfoldAction.label', "Unfold"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketRight,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.BracketRight
				},
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: 'Unfold the content in the editor',
				args: [
					{
						name: 'Unfold editor argument',
						description: `Property-value pairs that can be passed through this argument:
						* 'levels': Number of levels to unfold. If not set, defaults to 1.
						* 'direction': If 'up', unfold given number of levels up otherwise unfolds down.
						* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the unfold action to. If not set, the active selection(s) will be used.
						`,
						constraint: foldingArgumentsConstraint,
						schema: {
							'type': 'object',
							'properties': {
								'levels': {
									'type': 'number',
									'default': 1
								},
								'direction': {
									'type': 'string',
									'enum': ['up', 'down'],
									'default': 'down'
								},
								'selectionLines': {
									'type': 'array',
									'items': {
										'type': 'number'
									}
								}
							}
						}
					}
				]
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: FoldingArguments): void {
		const levels = args && args.levels || 1;
		const lineNumbers = this.getLineNumbers(args, editor);
		if (args && args.direction === 'up') {
			setCollapseStateLevelsUp(foldingModel, false, levels, lineNumbers);
		} else {
			setCollapseStateLevelsDown(foldingModel, false, levels, lineNumbers);
		}
	}
}

class UnFoldRecursivelyAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.unfoldRecursively',
			label: nls.localize2('unFoldRecursivelyAction.label', "Unfold Recursively"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.BracketRight),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, _args: unknown): void {
		setCollapseStateLevelsDown(foldingModel, false, Number.MAX_VALUE, this.getSelectedLines(editor));
	}
}

class FoldAction extends FoldingAction<FoldingArguments> {

	constructor() {
		super({
			id: 'editor.fold',
			label: nls.localize2('foldAction.label', "Fold"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.BracketLeft,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.BracketLeft
				},
				weight: KeybindingWeight.EditorContrib
			},
			metadata: {
				description: 'Fold the content in the editor',
				args: [
					{
						name: 'Fold editor argument',
						description: `Property-value pairs that can be passed through this argument:
							* 'levels': Number of levels to fold.
							* 'direction': If 'up', folds given number of levels up otherwise folds down.
							* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the fold action to. If not set, the active selection(s) will be used.
							If no levels or direction is set, folds the region at the locations or if already collapsed, the first uncollapsed parent instead.
						`,
						constraint: foldingArgumentsConstraint,
						schema: {
							'type': 'object',
							'properties': {
								'levels': {
									'type': 'number',
								},
								'direction': {
									'type': 'string',
									'enum': ['up', 'down'],
								},
								'selectionLines': {
									'type': 'array',
									'items': {
										'type': 'number'
									}
								}
							}
						}
					}
				]
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: FoldingArguments): void {
		const lineNumbers = this.getLineNumbers(args, editor);

		const levels = args && args.levels;
		const direction = args && args.direction;

		if (typeof levels !== 'number' && typeof direction !== 'string') {
			// fold the region at the location or if already collapsed, the first uncollapsed parent instead.
			setCollapseStateUp(foldingModel, true, lineNumbers);
		} else {
			if (direction === 'up') {
				setCollapseStateLevelsUp(foldingModel, true, levels || 1, lineNumbers);
			} else {
				setCollapseStateLevelsDown(foldingModel, true, levels || 1, lineNumbers);
			}
		}
	}
}


class ToggleFoldAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.toggleFold',
			label: nls.localize2('toggleFoldAction.label', "Toggle Fold"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyL),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		toggleCollapseState(foldingModel, 1, selectedLines);
	}
}


class FoldRecursivelyAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.foldRecursively',
			label: nls.localize2('foldRecursivelyAction.label', "Fold Recursively"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.BracketLeft),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		setCollapseStateLevelsDown(foldingModel, true, Number.MAX_VALUE, selectedLines);
	}
}


class ToggleFoldRecursivelyAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.toggleFoldRecursively',
			label: nls.localize2('toggleFoldRecursivelyAction.label', "Toggle Fold Recursively"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyL),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		toggleCollapseState(foldingModel, Number.MAX_VALUE, selectedLines);
	}
}


class FoldAllBlockCommentsAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.foldAllBlockComments',
			label: nls.localize2('foldAllBlockComments.label', "Fold All Block Comments"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Slash),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: void, languageConfigurationService: ILanguageConfigurationService): void {
		if (foldingModel.regions.hasTypes()) {
			setCollapseStateForType(foldingModel, FoldingRangeKind.Comment.value, true);
		} else {
			const editorModel = editor.getModel();
			if (!editorModel) {
				return;
			}
			const comments = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).comments;
			if (comments && comments.blockCommentStartToken) {
				const regExp = new RegExp('^\\s*' + escapeRegExpCharacters(comments.blockCommentStartToken));
				setCollapseStateForMatchingLines(foldingModel, regExp, true);
			}
		}
	}
}

class FoldAllRegionsAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.foldAllMarkerRegions',
			label: nls.localize2('foldAllMarkerRegions.label', "Fold All Regions"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Digit8),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: void, languageConfigurationService: ILanguageConfigurationService): void {
		if (foldingModel.regions.hasTypes()) {
			setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, true);
		} else {
			const editorModel = editor.getModel();
			if (!editorModel) {
				return;
			}
			const foldingRules = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;
			if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
				const regExp = new RegExp(foldingRules.markers.start);
				setCollapseStateForMatchingLines(foldingModel, regExp, true);
			}
		}
	}
}

class UnfoldAllRegionsAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.unfoldAllMarkerRegions',
			label: nls.localize2('unfoldAllMarkerRegions.label', "Unfold All Regions"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Digit9),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor, args: void, languageConfigurationService: ILanguageConfigurationService): void {
		if (foldingModel.regions.hasTypes()) {
			setCollapseStateForType(foldingModel, FoldingRangeKind.Region.value, false);
		} else {
			const editorModel = editor.getModel();
			if (!editorModel) {
				return;
			}
			const foldingRules = languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;
			if (foldingRules && foldingRules.markers && foldingRules.markers.start) {
				const regExp = new RegExp(foldingRules.markers.start);
				setCollapseStateForMatchingLines(foldingModel, regExp, false);
			}
		}
	}
}

class FoldAllExceptAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.foldAllExcept',
			label: nls.localize2('foldAllExcept.label', "Fold All Except Selected"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Minus),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		setCollapseStateForRest(foldingModel, true, selectedLines);
	}

}

class UnfoldAllExceptAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.unfoldAllExcept',
			label: nls.localize2('unfoldAllExcept.label', "Unfold All Except Selected"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Equal),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		setCollapseStateForRest(foldingModel, false, selectedLines);
	}
}

class FoldAllAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.foldAll',
			label: nls.localize2('foldAllAction.label', "Fold All"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Digit0),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, _editor: ICodeEditor): void {
		setCollapseStateLevelsDown(foldingModel, true);
	}
}

class UnfoldAllAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.unfoldAll',
			label: nls.localize2('unfoldAllAction.label', "Unfold All"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyJ),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, _editor: ICodeEditor): void {
		setCollapseStateLevelsDown(foldingModel, false);
	}
}

class FoldLevelAction extends FoldingAction<void> {
	private static readonly ID_PREFIX = 'editor.foldLevel';
	public static readonly ID = (level: number) => FoldLevelAction.ID_PREFIX + level;

	private getFoldingLevel() {
		return parseInt(this.id.substr(FoldLevelAction.ID_PREFIX.length));
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		setCollapseStateAtLevel(foldingModel, this.getFoldingLevel(), true, this.getSelectedLines(editor));
	}
}

/** Action to go to the parent fold of current line */
class GotoParentFoldAction extends FoldingAction<void> {
	constructor() {
		super({
			id: 'editor.gotoParentFold',
			label: nls.localize2('gotoParentFold.label', "Go to Parent Fold"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		if (selectedLines.length > 0) {
			const startLineNumber = getParentFoldLine(selectedLines[0], foldingModel);
			if (startLineNumber !== null) {
				editor.setSelection({
					startLineNumber: startLineNumber,
					startColumn: 1,
					endLineNumber: startLineNumber,
					endColumn: 1
				});
			}
		}
	}
}

/** Action to go to the previous fold of current line */
class GotoPreviousFoldAction extends FoldingAction<void> {
	constructor() {
		super({
			id: 'editor.gotoPreviousFold',
			label: nls.localize2('gotoPreviousFold.label', "Go to Previous Folding Range"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		if (selectedLines.length > 0) {
			const startLineNumber = getPreviousFoldLine(selectedLines[0], foldingModel);
			if (startLineNumber !== null) {
				editor.setSelection({
					startLineNumber: startLineNumber,
					startColumn: 1,
					endLineNumber: startLineNumber,
					endColumn: 1
				});
			}
		}
	}
}

/** Action to go to the next fold of current line */
class GotoNextFoldAction extends FoldingAction<void> {
	constructor() {
		super({
			id: 'editor.gotoNextFold',
			label: nls.localize2('gotoNextFold.label', "Go to Next Folding Range"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selectedLines = this.getSelectedLines(editor);
		if (selectedLines.length > 0) {
			const startLineNumber = getNextFoldLine(selectedLines[0], foldingModel);
			if (startLineNumber !== null) {
				editor.setSelection({
					startLineNumber: startLineNumber,
					startColumn: 1,
					endLineNumber: startLineNumber,
					endColumn: 1
				});
			}
		}
	}
}

class FoldRangeFromSelectionAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.createFoldingRangeFromSelection',
			label: nls.localize2('createManualFoldRange.label', "Create Folding Range from Selection"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Comma),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(_foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const collapseRanges: FoldRange[] = [];
		const selections = editor.getSelections();
		if (selections) {
			for (const selection of selections) {
				let endLineNumber = selection.endLineNumber;
				if (selection.endColumn === 1) {
					--endLineNumber;
				}
				if (endLineNumber > selection.startLineNumber) {
					collapseRanges.push({
						startLineNumber: selection.startLineNumber,
						endLineNumber: endLineNumber,
						type: undefined,
						isCollapsed: true,
						source: FoldSource.userDefined
					});
					editor.setSelection({
						startLineNumber: selection.startLineNumber,
						startColumn: 1,
						endLineNumber: selection.startLineNumber,
						endColumn: 1
					});
				}
			}
			if (collapseRanges.length > 0) {
				collapseRanges.sort((a, b) => {
					return a.startLineNumber - b.startLineNumber;
				});
				const newRanges = FoldingRegions.sanitizeAndMerge(foldingModel.regions, collapseRanges, editor.getModel()?.getLineCount());
				foldingModel.updatePost(FoldingRegions.fromFoldRanges(newRanges));
			}
		}
	}
}

class RemoveFoldRangeFromSelectionAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.removeManualFoldingRanges',
			label: nls.localize2('removeManualFoldingRanges.label', "Remove Manual Folding Ranges"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.Period),
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	invoke(foldingController: FoldingController, foldingModel: FoldingModel, editor: ICodeEditor): void {
		const selections = editor.getSelections();
		if (selections) {
			const ranges: ILineRange[] = [];
			for (const selection of selections) {
				const { startLineNumber, endLineNumber } = selection;
				ranges.push(endLineNumber >= startLineNumber ? { startLineNumber, endLineNumber } : { endLineNumber, startLineNumber });
			}
			foldingModel.removeManualRanges(ranges);
			foldingController.triggerFoldingModelChanged();
		}
	}
}


class ToggleImportFoldAction extends FoldingAction<void> {

	constructor() {
		super({
			id: 'editor.toggleImportFold',
			label: nls.localize2('toggleImportFold.label', "Toggle Import Fold"),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	async invoke(foldingController: FoldingController, foldingModel: FoldingModel): Promise<void> {
		const regionsToToggle: FoldingRegion[] = [];
		const regions = foldingModel.regions;
		for (let i = regions.length - 1; i >= 0; i--) {
			if (regions.getType(i) === FoldingRangeKind.Imports.value) {
				regionsToToggle.push(regions.toRegion(i));
			}
		}
		foldingModel.toggleCollapseState(regionsToToggle);
		foldingController.triggerFoldingModelChanged();
	}
}


registerEditorContribution(FoldingController.ID, FoldingController, EditorContributionInstantiation.Eager); // eager because it uses `saveViewState`/`restoreViewState`
registerEditorAction(UnfoldAction);
registerEditorAction(UnFoldRecursivelyAction);
registerEditorAction(FoldAction);
registerEditorAction(FoldRecursivelyAction);
registerEditorAction(ToggleFoldRecursivelyAction);
registerEditorAction(FoldAllAction);
registerEditorAction(UnfoldAllAction);
registerEditorAction(FoldAllBlockCommentsAction);
registerEditorAction(FoldAllRegionsAction);
registerEditorAction(UnfoldAllRegionsAction);
registerEditorAction(FoldAllExceptAction);
registerEditorAction(UnfoldAllExceptAction);
registerEditorAction(ToggleFoldAction);
registerEditorAction(GotoParentFoldAction);
registerEditorAction(GotoPreviousFoldAction);
registerEditorAction(GotoNextFoldAction);
registerEditorAction(FoldRangeFromSelectionAction);
registerEditorAction(RemoveFoldRangeFromSelectionAction);
registerEditorAction(ToggleImportFoldAction);

for (let i = 1; i <= 7; i++) {
	registerInstantiatedEditorAction(
		new FoldLevelAction({
			id: FoldLevelAction.ID(i),
			label: nls.localize2('foldLevelAction.label', "Fold Level {0}", i),
			precondition: CONTEXT_FOLDING_ENABLED,
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | (KeyCode.Digit0 + i)),
				weight: KeybindingWeight.EditorContrib
			}
		})
	);
}

CommandsRegistry.registerCommand('_executeFoldingRangeProvider', async function (accessor, ...args) {
	const [resource] = args;
	if (!(resource instanceof URI)) {
		throw illegalArgument();
	}

	const languageFeaturesService = accessor.get(ILanguageFeaturesService);

	const model = accessor.get(IModelService).getModel(resource);
	if (!model) {
		throw illegalArgument();
	}

	const configurationService = accessor.get(IConfigurationService);
	if (!configurationService.getValue('editor.folding', { resource })) {
		return [];
	}

	const languageConfigurationService = accessor.get(ILanguageConfigurationService);

	const strategy = configurationService.getValue('editor.foldingStrategy', { resource });
	const foldingLimitReporter = {
		get limit() {
			return configurationService.getValue<number>('editor.foldingMaximumRegions', { resource });
		},
		update: (computed: number, limited: number | false) => { }
	};

	const indentRangeProvider = new IndentRangeProvider(model, languageConfigurationService, foldingLimitReporter);
	let rangeProvider: RangeProvider = indentRangeProvider;
	if (strategy !== 'indentation') {
		const providers = FoldingController.getFoldingRangeProviders(languageFeaturesService, model);
		if (providers.length) {
			rangeProvider = new SyntaxRangeProvider(model, providers, () => { }, foldingLimitReporter, indentRangeProvider);
		}
	}
	const ranges = await rangeProvider.compute(CancellationToken.None);
	const result: FoldingRange[] = [];
	try {
		if (ranges) {
			for (let i = 0; i < ranges.length; i++) {
				const type = ranges.getType(i);
				result.push({ start: ranges.getStartLineNumber(i), end: ranges.getEndLineNumber(i), kind: type ? FoldingRangeKind.fromValue(type) : undefined });
			}
		}
		return result;
	} finally {
		rangeProvider.dispose();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/foldingDecorations.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/foldingDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { ICodeEditor } from '../../../browser/editorBrowser.js';
import { IModelDecorationOptions, IModelDecorationsChangeAccessor, MinimapPosition, TrackedRangeStickiness } from '../../../common/model.js';
import { ModelDecorationOptions } from '../../../common/model/textModel.js';
import { IDecorationProvider } from './foldingModel.js';
import { localize } from '../../../../nls.js';
import { editorSelectionBackground, iconForeground, registerColor, transparent } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

const foldBackground = registerColor('editor.foldBackground', { light: transparent(editorSelectionBackground, 0.3), dark: transparent(editorSelectionBackground, 0.3), hcDark: null, hcLight: null }, localize('foldBackgroundBackground', "Background color behind folded ranges. The color must not be opaque so as not to hide underlying decorations."), true);
registerColor('editor.foldPlaceholderForeground', { light: '#808080', dark: '#808080', hcDark: null, hcLight: null }, localize('collapsedTextColor', "Color of the collapsed text after the first line of a folded range."));
registerColor('editorGutter.foldingControlForeground', iconForeground, localize('editorGutter.foldingControlForeground', 'Color of the folding control in the editor gutter.'));

export const foldingExpandedIcon = registerIcon('folding-expanded', Codicon.chevronDown, localize('foldingExpandedIcon', 'Icon for expanded ranges in the editor glyph margin.'));
export const foldingCollapsedIcon = registerIcon('folding-collapsed', Codicon.chevronRight, localize('foldingCollapsedIcon', 'Icon for collapsed ranges in the editor glyph margin.'));
export const foldingManualCollapsedIcon = registerIcon('folding-manual-collapsed', foldingCollapsedIcon, localize('foldingManualCollapedIcon', 'Icon for manually collapsed ranges in the editor glyph margin.'));
export const foldingManualExpandedIcon = registerIcon('folding-manual-expanded', foldingExpandedIcon, localize('foldingManualExpandedIcon', 'Icon for manually expanded ranges in the editor glyph margin.'));

const foldedBackgroundMinimap = { color: themeColorFromId(foldBackground), position: MinimapPosition.Inline };

const collapsed = localize('linesCollapsed', "Click to expand the range.");
const expanded = localize('linesExpanded', "Click to collapse the range.");

export class FoldingDecorationProvider implements IDecorationProvider {

	private static readonly COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-collapsed-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingCollapsedIcon),
	});

	private static readonly COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-collapsed-highlighted-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		className: 'folded-background',
		minimap: foldedBackgroundMinimap,
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingCollapsedIcon)
	});

	private static readonly MANUALLY_COLLAPSED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-manually-collapsed-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualCollapsedIcon)
	});

	private static readonly MANUALLY_COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-manually-collapsed-highlighted-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		className: 'folded-background',
		minimap: foldedBackgroundMinimap,
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualCollapsedIcon)
	});

	private static readonly NO_CONTROLS_COLLAPSED_RANGE_DECORATION = ModelDecorationOptions.register({
		description: 'folding-no-controls-range-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
	});

	private static readonly NO_CONTROLS_COLLAPSED_HIGHLIGHTED_RANGE_DECORATION = ModelDecorationOptions.register({
		description: 'folding-no-controls-range-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		afterContentClassName: 'inline-folded',
		className: 'folded-background',
		minimap: foldedBackgroundMinimap,
		isWholeLine: true,
		linesDecorationsTooltip: collapsed,
	});

	private static readonly EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-expanded-visual-decoration',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		isWholeLine: true,
		firstLineDecorationClassName: 'alwaysShowFoldIcons ' + ThemeIcon.asClassName(foldingExpandedIcon),
		linesDecorationsTooltip: expanded,
	});

	private static readonly EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-expanded-auto-hide-visual-decoration',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		isWholeLine: true,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingExpandedIcon),
		linesDecorationsTooltip: expanded,
	});

	private static readonly MANUALLY_EXPANDED_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-manually-expanded-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		isWholeLine: true,
		firstLineDecorationClassName: 'alwaysShowFoldIcons ' + ThemeIcon.asClassName(foldingManualExpandedIcon),
		linesDecorationsTooltip: expanded,
	});

	private static readonly MANUALLY_EXPANDED_AUTO_HIDE_VISUAL_DECORATION = ModelDecorationOptions.register({
		description: 'folding-manually-expanded-auto-hide-visual-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		isWholeLine: true,
		firstLineDecorationClassName: ThemeIcon.asClassName(foldingManualExpandedIcon),
		linesDecorationsTooltip: expanded,
	});

	private static readonly NO_CONTROLS_EXPANDED_RANGE_DECORATION = ModelDecorationOptions.register({
		description: 'folding-no-controls-range-decoration',
		stickiness: TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges,
		isWholeLine: true
	});

	private static readonly HIDDEN_RANGE_DECORATION = ModelDecorationOptions.register({
		description: 'folding-hidden-range-decoration',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
	});

	public showFoldingControls: 'always' | 'never' | 'mouseover' = 'mouseover';

	public showFoldingHighlights: boolean = true;

	constructor(private readonly editor: ICodeEditor) {
	}

	getDecorationOption(isCollapsed: boolean, isHidden: boolean, isManual: boolean): IModelDecorationOptions {
		if (isHidden) { // is inside another collapsed region
			return FoldingDecorationProvider.HIDDEN_RANGE_DECORATION;
		}
		if (this.showFoldingControls === 'never') {
			if (isCollapsed) {
				return this.showFoldingHighlights ? FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_HIGHLIGHTED_RANGE_DECORATION : FoldingDecorationProvider.NO_CONTROLS_COLLAPSED_RANGE_DECORATION;
			}
			return FoldingDecorationProvider.NO_CONTROLS_EXPANDED_RANGE_DECORATION;
		}
		if (isCollapsed) {
			return isManual ?
				(this.showFoldingHighlights ? FoldingDecorationProvider.MANUALLY_COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION : FoldingDecorationProvider.MANUALLY_COLLAPSED_VISUAL_DECORATION)
				: (this.showFoldingHighlights ? FoldingDecorationProvider.COLLAPSED_HIGHLIGHTED_VISUAL_DECORATION : FoldingDecorationProvider.COLLAPSED_VISUAL_DECORATION);
		} else if (this.showFoldingControls === 'mouseover') {
			return isManual ? FoldingDecorationProvider.MANUALLY_EXPANDED_AUTO_HIDE_VISUAL_DECORATION : FoldingDecorationProvider.EXPANDED_AUTO_HIDE_VISUAL_DECORATION;
		} else {
			return isManual ? FoldingDecorationProvider.MANUALLY_EXPANDED_VISUAL_DECORATION : FoldingDecorationProvider.EXPANDED_VISUAL_DECORATION;
		}
	}

	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null {
		return this.editor.changeDecorations(callback);
	}

	removeDecorations(decorationIds: string[]): void {
		this.editor.removeDecorations(decorationIds);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/editor/contrib/folding/browser/foldingModel.ts]---
Location: vscode-main/src/vs/editor/contrib/folding/browser/foldingModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IModelDecorationOptions, IModelDecorationsChangeAccessor, IModelDeltaDecoration, ITextModel } from '../../../common/model.js';
import { FoldingRegion, FoldingRegions, ILineRange, FoldRange, FoldSource } from './foldingRanges.js';
import { hash } from '../../../../base/common/hash.js';
import { SelectedLines } from './folding.js';

export interface IDecorationProvider {
	getDecorationOption(isCollapsed: boolean, isHidden: boolean, isManual: boolean): IModelDecorationOptions;
	changeDecorations<T>(callback: (changeAccessor: IModelDecorationsChangeAccessor) => T): T | null;
	removeDecorations(decorationIds: string[]): void;
}

export interface FoldingModelChangeEvent {
	model: FoldingModel;
	collapseStateChanged?: FoldingRegion[];
}

interface ILineMemento extends ILineRange {
	checksum?: number;
	isCollapsed?: boolean;
	source?: FoldSource;
}

export type CollapseMemento = ILineMemento[];

export class FoldingModel {
	private readonly _textModel: ITextModel;
	private readonly _decorationProvider: IDecorationProvider;

	private _regions: FoldingRegions;
	private _editorDecorationIds: string[];

	private readonly _updateEventEmitter = new Emitter<FoldingModelChangeEvent>();
	public readonly onDidChange: Event<FoldingModelChangeEvent> = this._updateEventEmitter.event;

	public get regions(): FoldingRegions { return this._regions; }
	public get textModel() { return this._textModel; }
	public get decorationProvider() { return this._decorationProvider; }

	constructor(textModel: ITextModel, decorationProvider: IDecorationProvider) {
		this._textModel = textModel;
		this._decorationProvider = decorationProvider;
		this._regions = new FoldingRegions(new Uint32Array(0), new Uint32Array(0));
		this._editorDecorationIds = [];
	}

	public toggleCollapseState(toggledRegions: FoldingRegion[]) {
		if (!toggledRegions.length) {
			return;
		}
		toggledRegions = toggledRegions.sort((r1, r2) => r1.regionIndex - r2.regionIndex);

		const processed: { [key: string]: boolean | undefined } = {};
		this._decorationProvider.changeDecorations(accessor => {
			let k = 0; // index from [0 ... this.regions.length]
			let dirtyRegionEndLine = -1; // end of the range where decorations need to be updated
			let lastHiddenLine = -1; // the end of the last hidden lines
			const updateDecorationsUntil = (index: number) => {
				while (k < index) {
					const endLineNumber = this._regions.getEndLineNumber(k);
					const isCollapsed = this._regions.isCollapsed(k);
					if (endLineNumber <= dirtyRegionEndLine) {
						const isManual = this.regions.getSource(k) !== FoldSource.provider;
						accessor.changeDecorationOptions(this._editorDecorationIds[k], this._decorationProvider.getDecorationOption(isCollapsed, endLineNumber <= lastHiddenLine, isManual));
					}
					if (isCollapsed && endLineNumber > lastHiddenLine) {
						lastHiddenLine = endLineNumber;
					}
					k++;
				}
			};
			for (const region of toggledRegions) {
				const index = region.regionIndex;
				const editorDecorationId = this._editorDecorationIds[index];
				if (editorDecorationId && !processed[editorDecorationId]) {
					processed[editorDecorationId] = true;

					updateDecorationsUntil(index); // update all decorations up to current index using the old dirtyRegionEndLine

					const newCollapseState = !this._regions.isCollapsed(index);
					this._regions.setCollapsed(index, newCollapseState);

					dirtyRegionEndLine = Math.max(dirtyRegionEndLine, this._regions.getEndLineNumber(index));
				}
			}
			updateDecorationsUntil(this._regions.length);
		});
		this._updateEventEmitter.fire({ model: this, collapseStateChanged: toggledRegions });
	}

	public removeManualRanges(ranges: ILineRange[]) {
		const newFoldingRanges: FoldRange[] = new Array();
		const intersects = (foldRange: FoldRange) => {
			for (const range of ranges) {
				if (!(range.startLineNumber > foldRange.endLineNumber || foldRange.startLineNumber > range.endLineNumber)) {
					return true;
				}
			}
			return false;
		};
		for (let i = 0; i < this._regions.length; i++) {
			const foldRange = this._regions.toFoldRange(i);
			if (foldRange.source === FoldSource.provider || !intersects(foldRange)) {
				newFoldingRanges.push(foldRange);
			}
		}
		this.updatePost(FoldingRegions.fromFoldRanges(newFoldingRanges));
	}

	public update(newRegions: FoldingRegions, selection?: SelectedLines): void {
		const foldedOrManualRanges = this._currentFoldedOrManualRanges(selection);
		const newRanges = FoldingRegions.sanitizeAndMerge(newRegions, foldedOrManualRanges, this._textModel.getLineCount(), selection);
		this.updatePost(FoldingRegions.fromFoldRanges(newRanges));
	}

	public updatePost(newRegions: FoldingRegions) {
		const newEditorDecorations: IModelDeltaDecoration[] = [];
		let lastHiddenLine = -1;
		for (let index = 0, limit = newRegions.length; index < limit; index++) {
			const startLineNumber = newRegions.getStartLineNumber(index);
			const endLineNumber = newRegions.getEndLineNumber(index);
			const isCollapsed = newRegions.isCollapsed(index);
			const isManual = newRegions.getSource(index) !== FoldSource.provider;
			const decorationRange = {
				startLineNumber: startLineNumber,
				startColumn: this._textModel.getLineMaxColumn(startLineNumber),
				endLineNumber: endLineNumber,
				endColumn: this._textModel.getLineMaxColumn(endLineNumber) + 1
			};
			newEditorDecorations.push({ range: decorationRange, options: this._decorationProvider.getDecorationOption(isCollapsed, endLineNumber <= lastHiddenLine, isManual) });
			if (isCollapsed && endLineNumber > lastHiddenLine) {
				lastHiddenLine = endLineNumber;
			}
		}
		this._decorationProvider.changeDecorations(accessor => this._editorDecorationIds = accessor.deltaDecorations(this._editorDecorationIds, newEditorDecorations));
		this._regions = newRegions;
		this._updateEventEmitter.fire({ model: this });
	}

	private _currentFoldedOrManualRanges(selection?: SelectedLines): FoldRange[] {
		const foldedRanges: FoldRange[] = [];
		for (let i = 0, limit = this._regions.length; i < limit; i++) {
			let isCollapsed = this.regions.isCollapsed(i);
			const source = this.regions.getSource(i);
			if (isCollapsed || source !== FoldSource.provider) {
				const foldRange = this._regions.toFoldRange(i);
				const decRange = this._textModel.getDecorationRange(this._editorDecorationIds[i]);
				if (decRange) {
					if (isCollapsed && selection?.startsInside(decRange.startLineNumber + 1, decRange.endLineNumber)) {
						isCollapsed = false; // uncollapse is the range is blocked
					}
					foldedRanges.push({
						startLineNumber: decRange.startLineNumber,
						endLineNumber: decRange.endLineNumber,
						type: foldRange.type,
						isCollapsed,
						source
					});
				}
			}
		}

		return foldedRanges;
	}

	/**
	 * Collapse state memento, for persistence only
	 */
	public getMemento(): CollapseMemento | undefined {
		const foldedOrManualRanges = this._currentFoldedOrManualRanges();
		const result: ILineMemento[] = [];
		const maxLineNumber = this._textModel.getLineCount();
		for (let i = 0, limit = foldedOrManualRanges.length; i < limit; i++) {
			const range = foldedOrManualRanges[i];
			if (range.startLineNumber >= range.endLineNumber || range.startLineNumber < 1 || range.endLineNumber > maxLineNumber) {
				continue;
			}
			const checksum = this._getLinesChecksum(range.startLineNumber + 1, range.endLineNumber);
			result.push({
				startLineNumber: range.startLineNumber,
				endLineNumber: range.endLineNumber,
				isCollapsed: range.isCollapsed,
				source: range.source,
				checksum: checksum
			});
		}
		return (result.length > 0) ? result : undefined;
	}

	/**
	 * Apply persisted state, for persistence only
	 */
	public applyMemento(state: CollapseMemento) {
		if (!Array.isArray(state)) {
			return;
		}
		const rangesToRestore: FoldRange[] = [];
		const maxLineNumber = this._textModel.getLineCount();
		for (const range of state) {
			if (range.startLineNumber >= range.endLineNumber || range.startLineNumber < 1 || range.endLineNumber > maxLineNumber) {
				continue;
			}
			const checksum = this._getLinesChecksum(range.startLineNumber + 1, range.endLineNumber);
			if (!range.checksum || checksum === range.checksum) {
				rangesToRestore.push({
					startLineNumber: range.startLineNumber,
					endLineNumber: range.endLineNumber,
					type: undefined,
					isCollapsed: range.isCollapsed ?? true,
					source: range.source ?? FoldSource.provider
				});
			}
		}

		const newRanges = FoldingRegions.sanitizeAndMerge(this._regions, rangesToRestore, maxLineNumber);
		this.updatePost(FoldingRegions.fromFoldRanges(newRanges));
	}

	private _getLinesChecksum(lineNumber1: number, lineNumber2: number): number {
		const h = hash(this._textModel.getLineContent(lineNumber1)
			+ this._textModel.getLineContent(lineNumber2));
		return h % 1000000; // 6 digits is plenty
	}

	public dispose() {
		this._decorationProvider.removeDecorations(this._editorDecorationIds);
	}

	getAllRegionsAtLine(lineNumber: number, filter?: (r: FoldingRegion, level: number) => boolean): FoldingRegion[] {
		const result: FoldingRegion[] = [];
		if (this._regions) {
			let index = this._regions.findRange(lineNumber);
			let level = 1;
			while (index >= 0) {
				const current = this._regions.toRegion(index);
				if (!filter || filter(current, level)) {
					result.push(current);
				}
				level++;
				index = current.parentIndex;
			}
		}
		return result;
	}

	getRegionAtLine(lineNumber: number): FoldingRegion | null {
		if (this._regions) {
			const index = this._regions.findRange(lineNumber);
			if (index >= 0) {
				return this._regions.toRegion(index);
			}
		}
		return null;
	}

	getRegionsInside(region: FoldingRegion | null, filter?: RegionFilter | RegionFilterWithLevel): FoldingRegion[] {
		const result: FoldingRegion[] = [];
		const index = region ? region.regionIndex + 1 : 0;
		const endLineNumber = region ? region.endLineNumber : Number.MAX_VALUE;

		if (filter && filter.length === 2) {
			const levelStack: FoldingRegion[] = [];
			for (let i = index, len = this._regions.length; i < len; i++) {
				const current = this._regions.toRegion(i);
				if (this._regions.getStartLineNumber(i) < endLineNumber) {
					while (levelStack.length > 0 && !current.containedBy(levelStack[levelStack.length - 1])) {
						levelStack.pop();
					}
					levelStack.push(current);
					if (filter(current, levelStack.length)) {
						result.push(current);
					}
				} else {
					break;
				}
			}
		} else {
			for (let i = index, len = this._regions.length; i < len; i++) {
				const current = this._regions.toRegion(i);
				if (this._regions.getStartLineNumber(i) < endLineNumber) {
					if (!filter || (filter as RegionFilter)(current)) {
						result.push(current);
					}
				} else {
					break;
				}
			}
		}
		return result;
	}

}

type RegionFilter = (r: FoldingRegion) => boolean;
type RegionFilterWithLevel = (r: FoldingRegion, level: number) => boolean;


/**
 * Collapse or expand the regions at the given locations
 * @param levels The number of levels. Use 1 to only impact the regions at the location, use Number.MAX_VALUE for all levels.
 * @param lineNumbers the location of the regions to collapse or expand, or if not set, all regions in the model.
 */
export function toggleCollapseState(foldingModel: FoldingModel, levels: number, lineNumbers: number[]) {
	const toToggle: FoldingRegion[] = [];
	for (const lineNumber of lineNumbers) {
		const region = foldingModel.getRegionAtLine(lineNumber);
		if (region) {
			const doCollapse = !region.isCollapsed;
			toToggle.push(region);
			if (levels > 1) {
				const regionsInside = foldingModel.getRegionsInside(region, (r, level: number) => r.isCollapsed !== doCollapse && level < levels);
				toToggle.push(...regionsInside);
			}
		}
	}
	foldingModel.toggleCollapseState(toToggle);
}


/**
 * Collapse or expand the regions at the given locations including all children.
 * @param doCollapse Whether to collapse or expand
 * @param levels The number of levels. Use 1 to only impact the regions at the location, use Number.MAX_VALUE for all levels.
 * @param lineNumbers the location of the regions to collapse or expand, or if not set, all regions in the model.
 */
export function setCollapseStateLevelsDown(foldingModel: FoldingModel, doCollapse: boolean, levels = Number.MAX_VALUE, lineNumbers?: number[]): void {
	const toToggle: FoldingRegion[] = [];
	if (lineNumbers && lineNumbers.length > 0) {
		for (const lineNumber of lineNumbers) {
			const region = foldingModel.getRegionAtLine(lineNumber);
			if (region) {
				if (region.isCollapsed !== doCollapse) {
					toToggle.push(region);
				}
				if (levels > 1) {
					const regionsInside = foldingModel.getRegionsInside(region, (r, level: number) => r.isCollapsed !== doCollapse && level < levels);
					toToggle.push(...regionsInside);
				}
			}
		}
	} else {
		const regionsInside = foldingModel.getRegionsInside(null, (r, level: number) => r.isCollapsed !== doCollapse && level < levels);
		toToggle.push(...regionsInside);
	}
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Collapse or expand the regions at the given locations including all parents.
 * @param doCollapse Whether to collapse or expand
 * @param levels The number of levels. Use 1 to only impact the regions at the location, use Number.MAX_VALUE for all levels.
 * @param lineNumbers the location of the regions to collapse or expand.
 */
export function setCollapseStateLevelsUp(foldingModel: FoldingModel, doCollapse: boolean, levels: number, lineNumbers: number[]): void {
	const toToggle: FoldingRegion[] = [];
	for (const lineNumber of lineNumbers) {
		const regions = foldingModel.getAllRegionsAtLine(lineNumber, (region, level) => region.isCollapsed !== doCollapse && level <= levels);
		toToggle.push(...regions);
	}
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Collapse or expand a region at the given locations. If the inner most region is already collapsed/expanded, uses the first parent instead.
 * @param doCollapse Whether to collapse or expand
 * @param lineNumbers the location of the regions to collapse or expand.
 */
export function setCollapseStateUp(foldingModel: FoldingModel, doCollapse: boolean, lineNumbers: number[]): void {
	const toToggle: FoldingRegion[] = [];
	for (const lineNumber of lineNumbers) {
		const regions = foldingModel.getAllRegionsAtLine(lineNumber, (region,) => region.isCollapsed !== doCollapse);
		if (regions.length > 0) {
			toToggle.push(regions[0]);
		}
	}
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Folds or unfolds all regions that have a given level, except if they contain one of the blocked lines.
 * @param foldLevel level. Level == 1 is the top level
 * @param doCollapse Whether to collapse or expand
*/
export function setCollapseStateAtLevel(foldingModel: FoldingModel, foldLevel: number, doCollapse: boolean, blockedLineNumbers: number[]): void {
	const filter = (region: FoldingRegion, level: number) => level === foldLevel && region.isCollapsed !== doCollapse && !blockedLineNumbers.some(line => region.containsLine(line));
	const toToggle = foldingModel.getRegionsInside(null, filter);
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Folds or unfolds all regions, except if they contain or are contained by a region of one of the blocked lines.
 * @param doCollapse Whether to collapse or expand
 * @param blockedLineNumbers the location of regions to not collapse or expand
 */
export function setCollapseStateForRest(foldingModel: FoldingModel, doCollapse: boolean, blockedLineNumbers: number[]): void {
	const filteredRegions: FoldingRegion[] = [];
	for (const lineNumber of blockedLineNumbers) {
		const regions = foldingModel.getAllRegionsAtLine(lineNumber, undefined);
		if (regions.length > 0) {
			filteredRegions.push(regions[0]);
		}
	}
	const filter = (region: FoldingRegion) => filteredRegions.every((filteredRegion) => !filteredRegion.containedBy(region) && !region.containedBy(filteredRegion)) && region.isCollapsed !== doCollapse;
	const toToggle = foldingModel.getRegionsInside(null, filter);
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Folds all regions for which the lines start with a given regex
 * @param foldingModel the folding model
 */
export function setCollapseStateForMatchingLines(foldingModel: FoldingModel, regExp: RegExp, doCollapse: boolean): void {
	const editorModel = foldingModel.textModel;
	const regions = foldingModel.regions;
	const toToggle: FoldingRegion[] = [];
	for (let i = regions.length - 1; i >= 0; i--) {
		if (doCollapse !== regions.isCollapsed(i)) {
			const startLineNumber = regions.getStartLineNumber(i);
			if (regExp.test(editorModel.getLineContent(startLineNumber))) {
				toToggle.push(regions.toRegion(i));
			}
		}
	}
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Folds all regions of the given type
 * @param foldingModel the folding model
 */
export function setCollapseStateForType(foldingModel: FoldingModel, type: string, doCollapse: boolean): void {
	const regions = foldingModel.regions;
	const toToggle: FoldingRegion[] = [];
	for (let i = regions.length - 1; i >= 0; i--) {
		if (doCollapse !== regions.isCollapsed(i) && type === regions.getType(i)) {
			toToggle.push(regions.toRegion(i));
		}
	}
	foldingModel.toggleCollapseState(toToggle);
}

/**
 * Get line to go to for parent fold of current line
 * @param lineNumber the current line number
 * @param foldingModel the folding model
 *
 * @return Parent fold start line
 */
export function getParentFoldLine(lineNumber: number, foldingModel: FoldingModel): number | null {
	let startLineNumber: number | null = null;
	const foldingRegion = foldingModel.getRegionAtLine(lineNumber);
	if (foldingRegion !== null) {
		startLineNumber = foldingRegion.startLineNumber;
		// If current line is not the start of the current fold, go to top line of current fold. If not, go to parent fold
		if (lineNumber === startLineNumber) {
			const parentFoldingIdx = foldingRegion.parentIndex;
			if (parentFoldingIdx !== -1) {
				startLineNumber = foldingModel.regions.getStartLineNumber(parentFoldingIdx);
			} else {
				startLineNumber = null;
			}
		}
	}
	return startLineNumber;
}

/**
 * Get line to go to for previous fold at the same level of current line
 * @param lineNumber the current line number
 * @param foldingModel the folding model
 *
 * @return Previous fold start line
 */
export function getPreviousFoldLine(lineNumber: number, foldingModel: FoldingModel): number | null {
	let foldingRegion = foldingModel.getRegionAtLine(lineNumber);
	// If on the folding range start line, go to previous sibling.
	if (foldingRegion !== null && foldingRegion.startLineNumber === lineNumber) {
		// If current line is not the start of the current fold, go to top line of current fold. If not, go to previous fold.
		if (lineNumber !== foldingRegion.startLineNumber) {
			return foldingRegion.startLineNumber;
		} else {
			// Find min line number to stay within parent.
			const expectedParentIndex = foldingRegion.parentIndex;
			let minLineNumber = 0;
			if (expectedParentIndex !== -1) {
				minLineNumber = foldingModel.regions.getStartLineNumber(foldingRegion.parentIndex);
			}

			// Find fold at same level.
			while (foldingRegion !== null) {
				if (foldingRegion.regionIndex > 0) {
					foldingRegion = foldingModel.regions.toRegion(foldingRegion.regionIndex - 1);

					// Keep at same level.
					if (foldingRegion.startLineNumber <= minLineNumber) {
						return null;
					} else if (foldingRegion.parentIndex === expectedParentIndex) {
						return foldingRegion.startLineNumber;
					}
				} else {
					return null;
				}
			}
		}
	} else {
		// Go to last fold that's before the current line.
		if (foldingModel.regions.length > 0) {
			foldingRegion = foldingModel.regions.toRegion(foldingModel.regions.length - 1);
			while (foldingRegion !== null) {
				// Found fold before current line.
				if (foldingRegion.startLineNumber < lineNumber) {
					return foldingRegion.startLineNumber;
				}
				if (foldingRegion.regionIndex > 0) {
					foldingRegion = foldingModel.regions.toRegion(foldingRegion.regionIndex - 1);
				} else {
					foldingRegion = null;
				}
			}
		}
	}
	return null;
}

/**
 * Get line to go to next fold at the same level of current line
 * @param lineNumber the current line number
 * @param foldingModel the folding model
 *
 * @return Next fold start line
 */
export function getNextFoldLine(lineNumber: number, foldingModel: FoldingModel): number | null {
	let foldingRegion = foldingModel.getRegionAtLine(lineNumber);
	// If on the folding range start line, go to next sibling.
	if (foldingRegion !== null && foldingRegion.startLineNumber === lineNumber) {
		// Find max line number to stay within parent.
		const expectedParentIndex = foldingRegion.parentIndex;
		let maxLineNumber = 0;
		if (expectedParentIndex !== -1) {
			maxLineNumber = foldingModel.regions.getEndLineNumber(foldingRegion.parentIndex);
		} else if (foldingModel.regions.length === 0) {
			return null;
		} else {
			maxLineNumber = foldingModel.regions.getEndLineNumber(foldingModel.regions.length - 1);
		}

		// Find fold at same level.
		while (foldingRegion !== null) {
			if (foldingRegion.regionIndex < foldingModel.regions.length) {
				foldingRegion = foldingModel.regions.toRegion(foldingRegion.regionIndex + 1);

				// Keep at same level.
				if (foldingRegion.startLineNumber >= maxLineNumber) {
					return null;
				} else if (foldingRegion.parentIndex === expectedParentIndex) {
					return foldingRegion.startLineNumber;
				}
			} else {
				return null;
			}
		}
	} else {
		// Go to first fold that's after the current line.
		if (foldingModel.regions.length > 0) {
			foldingRegion = foldingModel.regions.toRegion(0);
			while (foldingRegion !== null) {
				// Found fold after current line.
				if (foldingRegion.startLineNumber > lineNumber) {
					return foldingRegion.startLineNumber;
				}
				if (foldingRegion.regionIndex < foldingModel.regions.length) {
					foldingRegion = foldingModel.regions.toRegion(foldingRegion.regionIndex + 1);
				} else {
					foldingRegion = null;
				}
			}
		}
	}
	return null;
}
```

--------------------------------------------------------------------------------

````
