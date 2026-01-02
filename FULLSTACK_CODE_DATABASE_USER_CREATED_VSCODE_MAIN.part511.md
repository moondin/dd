---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 511
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 511 of 552)

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

---[FILE: src/vs/workbench/services/history/test/browser/historyService.test.ts]---
Location: vscode-main/src/vs/workbench/services/history/test/browser/historyService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { URI } from '../../../../../base/common/uri.js';
import { workbenchInstantiationService, TestFileEditorInput, registerTestEditor, createEditorPart, registerTestFileEditor, TestServiceAccessor, TestTextFileEditor, workbenchTeardown, registerTestSideBySideEditor } from '../../../../test/browser/workbenchTestServices.js';
import { EditorPart } from '../../../../browser/parts/editor/editorPart.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { IEditorGroupsService, GroupDirection } from '../../../editor/common/editorGroupsService.js';
import { EditorNavigationStack, HistoryService } from '../../browser/historyService.js';
import { IEditorService, SIDE_GROUP } from '../../../editor/common/editorService.js';
import { EditorService } from '../../../editor/browser/editorService.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { GoFilter, GoScope, IHistoryService } from '../../common/history.js';
import { DeferredPromise, timeout } from '../../../../../base/common/async.js';
import { Event } from '../../../../../base/common/event.js';
import { EditorPaneSelectionChangeReason, isResourceEditorInput, IUntypedEditorInput } from '../../../../common/editor.js';
import { IResourceEditorInput, ITextEditorOptions } from '../../../../../platform/editor/common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { IResolvedTextFileEditorModel, ITextFileService } from '../../../textfile/common/textfiles.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { FileChangesEvent, FileChangeType, FileOperation, FileOperationEvent } from '../../../../../platform/files/common/files.js';
import { isLinux } from '../../../../../base/common/platform.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { EditorPane } from '../../../../browser/parts/editor/editorPane.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { SideBySideEditorInput } from '../../../../common/editor/sideBySideEditorInput.js';

suite('HistoryService', function () {

	const TEST_EDITOR_ID = 'MyTestEditorForEditorHistory';
	const TEST_EDITOR_INPUT_ID = 'testEditorInputForHistoyService';

	async function createServices(scope = GoScope.DEFAULT, configureSearchExclude = false): Promise<[EditorPart, HistoryService, EditorService, ITextFileService, IInstantiationService, TestConfigurationService]> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		const configurationService = new TestConfigurationService();
		if (scope === GoScope.EDITOR_GROUP) {
			configurationService.setUserConfiguration('workbench.editor.navigationScope', 'editorGroup');
		} else if (scope === GoScope.EDITOR) {
			configurationService.setUserConfiguration('workbench.editor.navigationScope', 'editor');
		}
		if (configureSearchExclude) {
			configurationService.setUserConfiguration('search', { exclude: { '**/node_modules/**': true } });
		}
		instantiationService.stub(IConfigurationService, configurationService);

		const historyService = disposables.add(instantiationService.createInstance(HistoryService));
		instantiationService.stub(IHistoryService, historyService);

		const accessor = instantiationService.createInstance(TestServiceAccessor);

		return [part, historyService, editorService, accessor.textFileService, instantiationService, configurationService];
	}

	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestEditor(TEST_EDITOR_ID, [new SyncDescriptor(TestFileEditorInput)]));
		disposables.add(registerTestSideBySideEditor());
		disposables.add(registerTestFileEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	test('back / forward: basics', async () => {
		const [part, historyService] = await createServices();

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input1, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input2, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		await historyService.goBack();
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		await historyService.goForward();
		assert.strictEqual(part.activeGroup.activeEditor, input2);
	});

	test('back / forward: is editor group aware', async function () {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const resource: URI = toResource.call(this, '/path/index.txt');
		const otherResource: URI = toResource.call(this, '/path/other.html');

		const pane1 = await editorService.openEditor({ resource, options: { pinned: true } });
		const pane2 = await editorService.openEditor({ resource, options: { pinned: true } }, SIDE_GROUP);

		// [index.txt] | [>index.txt<]

		assert.notStrictEqual(pane1, pane2);

		await editorService.openEditor({ resource: otherResource, options: { pinned: true } }, pane2?.group);

		// [index.txt] | [index.txt] [>other.html<]

		await historyService.goBack();

		// [index.txt] | [>index.txt<] [other.html]

		assert.strictEqual(part.activeGroup.id, pane2?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource.toString());

		await historyService.goBack();

		// [>index.txt<] | [index.txt] [other.html]

		assert.strictEqual(part.activeGroup.id, pane1?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource.toString());

		await historyService.goForward();

		// [index.txt] | [>index.txt<] [other.html]

		assert.strictEqual(part.activeGroup.id, pane2?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource.toString());

		await historyService.goForward();

		// [index.txt] | [index.txt] [>other.html<]

		assert.strictEqual(part.activeGroup.id, pane2?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), otherResource.toString());

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: in-editor text selection changes (user)', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');

		const pane = await editorService.openEditor({ resource, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(1, 2, 1, 2));
		await setTextSelection(historyService, pane, new Selection(15, 1, 15, 1)); // will be merged and dropped
		await setTextSelection(historyService, pane, new Selection(16, 1, 16, 1)); // will be merged and dropped
		await setTextSelection(historyService, pane, new Selection(17, 1, 17, 1));
		await setTextSelection(historyService, pane, new Selection(30, 5, 30, 8));
		await setTextSelection(historyService, pane, new Selection(40, 1, 40, 1));

		await historyService.goBack(GoFilter.NONE);
		assertTextSelection(new Selection(30, 5, 30, 8), pane);

		await historyService.goBack(GoFilter.NONE);
		assertTextSelection(new Selection(17, 1, 17, 1), pane);

		await historyService.goBack(GoFilter.NONE);
		assertTextSelection(new Selection(1, 2, 1, 2), pane);

		await historyService.goForward(GoFilter.NONE);
		assertTextSelection(new Selection(17, 1, 17, 1), pane);

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: in-editor text selection changes (navigation)', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');

		const pane = await editorService.openEditor({ resource, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(2, 2, 2, 10)); // this is our starting point
		await setTextSelection(historyService, pane, new Selection(5, 3, 5, 20), EditorPaneSelectionChangeReason.NAVIGATION); // this is our first target definition
		await setTextSelection(historyService, pane, new Selection(120, 8, 120, 18), EditorPaneSelectionChangeReason.NAVIGATION); // this is our second target definition
		await setTextSelection(historyService, pane, new Selection(300, 3, 300, 20)); // unrelated user navigation
		await setTextSelection(historyService, pane, new Selection(500, 3, 500, 20)); // unrelated user navigation
		await setTextSelection(historyService, pane, new Selection(200, 3, 200, 20)); // unrelated user navigation

		await historyService.goBack(GoFilter.NAVIGATION); // this should reveal the last navigation entry because we are not at it currently
		assertTextSelection(new Selection(120, 8, 120, 18), pane);

		await historyService.goBack(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goBack(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goForward(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(120, 8, 120, 18), pane);

		await historyService.goPrevious(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goPrevious(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(120, 8, 120, 18), pane);

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: in-editor text selection changes (jump)', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');

		const pane = await editorService.openEditor({ resource, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(2, 2, 2, 10), EditorPaneSelectionChangeReason.USER);
		await setTextSelection(historyService, pane, new Selection(5, 3, 5, 20), EditorPaneSelectionChangeReason.JUMP);
		await setTextSelection(historyService, pane, new Selection(120, 8, 120, 18), EditorPaneSelectionChangeReason.JUMP);

		await historyService.goBack(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goBack(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(2, 2, 2, 10), pane);

		await historyService.goForward(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goLast(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(120, 8, 120, 18), pane);

		await historyService.goPrevious(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goPrevious(GoFilter.NAVIGATION);
		assertTextSelection(new Selection(120, 8, 120, 18), pane);

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: selection changes with JUMP or NAVIGATION source are not merged (#143833)', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');

		const pane = await editorService.openEditor({ resource, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(2, 2, 2, 10), EditorPaneSelectionChangeReason.USER);
		await setTextSelection(historyService, pane, new Selection(5, 3, 5, 20), EditorPaneSelectionChangeReason.JUMP);
		await setTextSelection(historyService, pane, new Selection(6, 3, 6, 20), EditorPaneSelectionChangeReason.NAVIGATION);

		await historyService.goBack(GoFilter.NONE);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goBack(GoFilter.NONE);
		assertTextSelection(new Selection(2, 2, 2, 10), pane);

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: edit selection changes', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');

		const pane = await editorService.openEditor({ resource, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(2, 2, 2, 10));
		await setTextSelection(historyService, pane, new Selection(50, 3, 50, 20), EditorPaneSelectionChangeReason.EDIT);
		await setTextSelection(historyService, pane, new Selection(300, 3, 300, 20)); // unrelated user navigation
		await setTextSelection(historyService, pane, new Selection(500, 3, 500, 20)); // unrelated user navigation
		await setTextSelection(historyService, pane, new Selection(200, 3, 200, 20)); // unrelated user navigation
		await setTextSelection(historyService, pane, new Selection(5, 3, 5, 20), EditorPaneSelectionChangeReason.EDIT);
		await setTextSelection(historyService, pane, new Selection(200, 3, 200, 20)); // unrelated user navigation

		await historyService.goBack(GoFilter.EDITS); // this should reveal the last navigation entry because we are not at it currently
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		await historyService.goBack(GoFilter.EDITS);
		assertTextSelection(new Selection(50, 3, 50, 20), pane);

		await historyService.goForward(GoFilter.EDITS);
		assertTextSelection(new Selection(5, 3, 5, 20), pane);

		return workbenchTeardown(instantiationService);
	});

	async function setTextSelection(historyService: IHistoryService, pane: TestTextFileEditor, selection: Selection, reason = EditorPaneSelectionChangeReason.USER): Promise<void> {
		const promise = Event.toPromise((historyService as HistoryService).onDidChangeEditorNavigationStack);
		pane.setSelection(selection, reason);
		await promise;
	}

	function assertTextSelection(expected: Selection, pane: EditorPane): void {
		const options: ITextEditorOptions | undefined = pane.options;
		if (!options) {
			assert.fail('EditorPane has no selection');
		}

		assert.strictEqual(options.selection?.startLineNumber, expected.startLineNumber);
		assert.strictEqual(options.selection?.startColumn, expected.startColumn);
		assert.strictEqual(options.selection?.endLineNumber, expected.endLineNumber);
		assert.strictEqual(options.selection?.endColumn, expected.endColumn);
	}

	test('back / forward: tracks editor moves across groups', async function () {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const resource1: URI = toResource.call(this, '/path/one.txt');
		const resource2: URI = toResource.call(this, '/path/two.html');

		const pane1 = await editorService.openEditor({ resource: resource1, options: { pinned: true } });
		await editorService.openEditor({ resource: resource2, options: { pinned: true } });

		// [one.txt] [>two.html<]

		const sideGroup = part.addGroup(part.activeGroup, GroupDirection.RIGHT);

		// [one.txt] [>two.html<] | <empty>

		const editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		pane1?.group.moveEditor(pane1.input!, sideGroup);
		await editorChangePromise;

		// [one.txt] | [>two.html<]

		await historyService.goBack();

		// [>one.txt<] | [two.html]

		assert.strictEqual(part.activeGroup.id, pane1?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource1.toString());

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: tracks group removals', async function () {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const resource1 = toResource.call(this, '/path/one.txt');
		const resource2 = toResource.call(this, '/path/two.html');

		const pane1 = await editorService.openEditor({ resource: resource1, options: { pinned: true } });
		const pane2 = await editorService.openEditor({ resource: resource2, options: { pinned: true } }, SIDE_GROUP);

		// [one.txt] | [>two.html<]

		assert.notStrictEqual(pane1, pane2);

		await pane1?.group.closeAllEditors();

		// [>two.html<]

		await historyService.goBack();

		// [>two.html<]

		assert.strictEqual(part.activeGroup.id, pane2?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource2.toString());

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: editor navigation stack - navigation', async function () {
		const [, , editorService, , instantiationService] = await createServices();

		const stack = instantiationService.createInstance(EditorNavigationStack, GoFilter.NONE, GoScope.DEFAULT);

		const resource = toResource.call(this, '/path/index.txt');
		const otherResource = toResource.call(this, '/path/index.html');
		const pane = await editorService.openEditor({ resource, options: { pinned: true } });

		let changed = false;
		disposables.add(stack.onDidChange(() => changed = true));

		assert.strictEqual(stack.canGoBack(), false);
		assert.strictEqual(stack.canGoForward(), false);
		assert.strictEqual(stack.canGoLast(), false);

		// Opening our first editor emits change event
		stack.notifyNavigation(pane, { reason: EditorPaneSelectionChangeReason.USER });
		assert.strictEqual(changed, true);
		changed = false;

		assert.strictEqual(stack.canGoBack(), false);
		assert.strictEqual(stack.canGoLast(), true);

		// Opening same editor is not treated as new history stop
		stack.notifyNavigation(pane, { reason: EditorPaneSelectionChangeReason.USER });
		assert.strictEqual(stack.canGoBack(), false);

		// Opening different editor allows to go back
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });

		stack.notifyNavigation(pane, { reason: EditorPaneSelectionChangeReason.USER });
		assert.strictEqual(changed, true);
		changed = false;

		assert.strictEqual(stack.canGoBack(), true);

		await stack.goBack();
		assert.strictEqual(stack.canGoBack(), false);
		assert.strictEqual(stack.canGoForward(), true);
		assert.strictEqual(stack.canGoLast(), true);

		await stack.goForward();
		assert.strictEqual(stack.canGoBack(), true);
		assert.strictEqual(stack.canGoForward(), false);

		await stack.goPrevious();
		assert.strictEqual(stack.canGoBack(), false);
		assert.strictEqual(stack.canGoForward(), true);

		await stack.goPrevious();
		assert.strictEqual(stack.canGoBack(), true);
		assert.strictEqual(stack.canGoForward(), false);

		await stack.goBack();
		await stack.goLast();
		assert.strictEqual(stack.canGoBack(), true);
		assert.strictEqual(stack.canGoForward(), false);

		stack.dispose();
		assert.strictEqual(stack.canGoBack(), false);

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: editor navigation stack - mutations', async function () {
		const [, , editorService, , instantiationService] = await createServices();

		const stack = disposables.add(instantiationService.createInstance(EditorNavigationStack, GoFilter.NONE, GoScope.DEFAULT));

		const resource: URI = toResource.call(this, '/path/index.txt');
		const otherResource: URI = toResource.call(this, '/path/index.html');
		const unrelatedResource: URI = toResource.call(this, '/path/unrelated.html');
		const pane = await editorService.openEditor({ resource, options: { pinned: true } });

		stack.notifyNavigation(pane);

		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Clear
		assert.strictEqual(stack.canGoBack(), true);
		stack.clear();
		assert.strictEqual(stack.canGoBack(), false);

		await editorService.openEditor({ resource, options: { pinned: true } });
		stack.notifyNavigation(pane);
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Remove unrelated resource does not cause any harm (via internal event)
		await stack.goBack();
		assert.strictEqual(stack.canGoForward(), true);
		stack.remove(new FileOperationEvent(unrelatedResource, FileOperation.DELETE));
		assert.strictEqual(stack.canGoForward(), true);

		// Remove (via internal event)
		await stack.goForward();
		assert.strictEqual(stack.canGoBack(), true);
		stack.remove(new FileOperationEvent(resource, FileOperation.DELETE));
		assert.strictEqual(stack.canGoBack(), false);
		stack.clear();

		await editorService.openEditor({ resource, options: { pinned: true } });
		stack.notifyNavigation(pane);
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Remove (via external event)
		assert.strictEqual(stack.canGoBack(), true);
		stack.remove(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], !isLinux));
		assert.strictEqual(stack.canGoBack(), false);
		stack.clear();

		await editorService.openEditor({ resource, options: { pinned: true } });
		stack.notifyNavigation(pane);
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Remove (via editor)
		assert.strictEqual(stack.canGoBack(), true);
		stack.remove(pane!.input!);
		assert.strictEqual(stack.canGoBack(), false);
		stack.clear();

		await editorService.openEditor({ resource, options: { pinned: true } });
		stack.notifyNavigation(pane);
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Remove (via group)
		assert.strictEqual(stack.canGoBack(), true);
		stack.remove(pane!.group!.id);
		assert.strictEqual(stack.canGoBack(), false);
		stack.clear();

		await editorService.openEditor({ resource, options: { pinned: true } });
		stack.notifyNavigation(pane);
		await editorService.openEditor({ resource: otherResource, options: { pinned: true } });
		stack.notifyNavigation(pane);

		// Move
		const stat = {
			ctime: 0,
			etag: '',
			mtime: 0,
			isDirectory: false,
			isFile: true,
			isSymbolicLink: false,
			name: 'other.txt',
			readonly: false,
			locked: false,
			size: 0,
			resource: toResource.call(this, '/path/other.txt'),
			children: undefined
		};
		stack.move(new FileOperationEvent(resource, FileOperation.MOVE, stat));
		await stack.goBack();
		assert.strictEqual(pane?.input?.resource?.toString(), stat.resource.toString());

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: editor group scope', async function () {
		const [part, historyService, editorService, , instantiationService] = await createServices(GoScope.EDITOR_GROUP);

		const resource1 = toResource.call(this, '/path/one.txt');
		const resource2 = toResource.call(this, '/path/two.html');
		const resource3 = toResource.call(this, '/path/three.html');

		const pane1 = await editorService.openEditor({ resource: resource1, options: { pinned: true } });
		await editorService.openEditor({ resource: resource2, options: { pinned: true } });
		await editorService.openEditor({ resource: resource3, options: { pinned: true } });

		// [one.txt] [two.html] [>three.html<]

		const sideGroup = part.addGroup(part.activeGroup, GroupDirection.RIGHT);

		// [one.txt] [two.html] [>three.html<] | <empty>

		const pane2 = await editorService.openEditor({ resource: resource1, options: { pinned: true } }, sideGroup);
		await editorService.openEditor({ resource: resource2, options: { pinned: true } });
		await editorService.openEditor({ resource: resource3, options: { pinned: true } });

		// [one.txt] [two.html] [>three.html<] | [one.txt] [two.html] [>three.html<]

		await historyService.goBack();
		await historyService.goBack();
		await historyService.goBack();

		assert.strictEqual(part.activeGroup.id, pane2?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource1.toString());

		// [one.txt] [two.html] [>three.html<] | [>one.txt<] [two.html] [three.html]

		await editorService.openEditor({ resource: resource3, options: { pinned: true } }, pane1?.group);

		await historyService.goBack();
		await historyService.goBack();
		await historyService.goBack();

		assert.strictEqual(part.activeGroup.id, pane1?.group.id);
		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource1.toString());

		return workbenchTeardown(instantiationService);
	});

	test('back / forward: editor  scope', async function () {
		const [part, historyService, editorService, , instantiationService] = await createServices(GoScope.EDITOR);

		const resource1 = toResource.call(this, '/path/one.txt');
		const resource2 = toResource.call(this, '/path/two.html');

		const pane = await editorService.openEditor({ resource: resource1, options: { pinned: true } }) as TestTextFileEditor;

		await setTextSelection(historyService, pane, new Selection(2, 2, 2, 10));
		await setTextSelection(historyService, pane, new Selection(50, 3, 50, 20));

		await editorService.openEditor({ resource: resource2, options: { pinned: true } });
		await setTextSelection(historyService, pane, new Selection(12, 2, 12, 10));
		await setTextSelection(historyService, pane, new Selection(150, 3, 150, 20));

		await historyService.goBack();
		assertTextSelection(new Selection(12, 2, 12, 10), pane);

		await historyService.goBack();
		assertTextSelection(new Selection(12, 2, 12, 10), pane); // no change

		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource2.toString());

		await editorService.openEditor({ resource: resource1, options: { pinned: true } });

		await historyService.goBack();
		assertTextSelection(new Selection(2, 2, 2, 10), pane);

		await historyService.goBack();
		assertTextSelection(new Selection(2, 2, 2, 10), pane); // no change

		assert.strictEqual(part.activeGroup.activeEditor?.resource?.toString(), resource1.toString());

		return workbenchTeardown(instantiationService);
	});


	test('go to last edit location', async function () {
		const [, historyService, editorService, textFileService, instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');
		const otherResource = toResource.call(this, '/path/index.html');
		await editorService.openEditor({ resource });

		const model = await textFileService.files.resolve(resource) as IResolvedTextFileEditorModel;
		model.textEditorModel.setValue('Hello World');
		await timeout(10); // history debounces change events

		await editorService.openEditor({ resource: otherResource });

		const onDidActiveEditorChange = new DeferredPromise<void>();
		disposables.add(editorService.onDidActiveEditorChange(e => {
			onDidActiveEditorChange.complete(e);
		}));

		historyService.goLast(GoFilter.EDITS);
		await onDidActiveEditorChange.p;

		assert.strictEqual(editorService.activeEditor?.resource?.toString(), resource.toString());

		return workbenchTeardown(instantiationService);
	});

	test('reopen closed editor', async function () {
		const [, historyService, editorService, , instantiationService] = await createServices();

		const resource = toResource.call(this, '/path/index.txt');
		const pane = await editorService.openEditor({ resource });

		await pane?.group.closeAllEditors();

		const onDidActiveEditorChange = new DeferredPromise<void>();
		disposables.add(editorService.onDidActiveEditorChange(e => {
			onDidActiveEditorChange.complete(e);
		}));

		historyService.reopenLastClosedEditor();
		await onDidActiveEditorChange.p;

		assert.strictEqual(editorService.activeEditor?.resource?.toString(), resource.toString());

		return workbenchTeardown(instantiationService);
	});

	test('getHistory', async () => {

		class TestFileEditorInputWithUntyped extends TestFileEditorInput {

			override toUntyped(): IUntypedEditorInput {
				return {
					resource: this.resource,
					options: {
						override: 'testOverride'
					}
				};
			}
		}

		const [part, historyService, editorService, , instantiationService] = await createServices(undefined, true);

		let history = historyService.getHistory();
		assert.strictEqual(history.length, 0);

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1/node_modules/test.txt'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input1, { pinned: true });

		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input2, { pinned: true });

		const input3 = disposables.add(new TestFileEditorInputWithUntyped(URI.parse('foo://bar3'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input3, { pinned: true });

		const input4 = disposables.add(new TestFileEditorInputWithUntyped(URI.file('bar4'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input4, { pinned: true });

		history = historyService.getHistory();
		assert.strictEqual(history.length, 4);

		// first entry is untyped because it implements `toUntyped` and has a supported scheme
		assert.strictEqual(isResourceEditorInput(history[0]) && !(history[0] instanceof EditorInput), true);
		assert.strictEqual((history[0] as IResourceEditorInput).options?.override, 'testOverride');
		// second entry is not untyped even though it implements `toUntyped` but has unsupported scheme
		assert.strictEqual(history[1] instanceof EditorInput, true);
		assert.strictEqual(history[2] instanceof EditorInput, true);
		assert.strictEqual(history[3] instanceof EditorInput, true);

		historyService.removeFromHistory(input2);
		history = historyService.getHistory();
		assert.strictEqual(history.length, 3);
		assert.strictEqual(history[0].resource?.toString(), input4.resource.toString());

		input1.dispose(); // disposing the editor will apply `search.exclude` rules
		history = historyService.getHistory();
		assert.strictEqual(history.length, 2);

		// side by side
		const input5 = disposables.add(new TestFileEditorInputWithUntyped(URI.parse('file://bar5'), TEST_EDITOR_INPUT_ID));
		const input6 = disposables.add(new TestFileEditorInputWithUntyped(URI.file('file://bar1/node_modules/test.txt'), TEST_EDITOR_INPUT_ID));
		const input7 = new SideBySideEditorInput(undefined, undefined, input6, input5, editorService);
		await part.activeGroup.openEditor(input7, { pinned: true });

		history = historyService.getHistory();
		assert.strictEqual(history.length, 3);
		input7.dispose();

		history = historyService.getHistory();
		assert.strictEqual(history.length, 3); // only input5 survived, input6 is excluded via search.exclude

		return workbenchTeardown(instantiationService);
	});

	test('getLastActiveFile', async () => {
		const [part, historyService] = await createServices();

		assert.ok(!historyService.getLastActiveFile('foo'));

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input1, { pinned: true });

		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));
		await part.activeGroup.openEditor(input2, { pinned: true });

		assert.strictEqual(historyService.getLastActiveFile('foo')?.toString(), input2.resource.toString());
		assert.strictEqual(historyService.getLastActiveFile('foo', 'bar2')?.toString(), input2.resource.toString());
		assert.strictEqual(historyService.getLastActiveFile('foo', 'bar1')?.toString(), input1.resource.toString());
	});

	test('open next/previous recently used editor (single group)', async () => {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));

		await part.activeGroup.openEditor(input1, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		await part.activeGroup.openEditor(input2, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		let editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openPreviouslyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openNextRecentlyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openPreviouslyUsedEditor(part.activeGroup.id);
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openNextRecentlyUsedEditor(part.activeGroup.id);
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		return workbenchTeardown(instantiationService);
	});

	test('open next/previous recently used editor (multi group)', async () => {
		const [part, historyService, editorService, , instantiationService] = await createServices();
		const rootGroup = part.activeGroup;

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));

		const sideGroup = part.addGroup(rootGroup, GroupDirection.RIGHT);

		await rootGroup.openEditor(input1, { pinned: true });
		await sideGroup.openEditor(input2, { pinned: true });

		let editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openPreviouslyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup, rootGroup);
		assert.strictEqual(rootGroup.activeEditor, input1);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openNextRecentlyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup, sideGroup);
		assert.strictEqual(sideGroup.activeEditor, input2);

		return workbenchTeardown(instantiationService);
	});

	test('open next/previous recently is reset when other input opens', async () => {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));
		const input3 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar3'), TEST_EDITOR_INPUT_ID));
		const input4 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar4'), TEST_EDITOR_INPUT_ID));

		await part.activeGroup.openEditor(input1, { pinned: true });
		await part.activeGroup.openEditor(input2, { pinned: true });
		await part.activeGroup.openEditor(input3, { pinned: true });

		let editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openPreviouslyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		await timeout(0);
		await part.activeGroup.openEditor(input4, { pinned: true });

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openPreviouslyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input2);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange);
		historyService.openNextRecentlyUsedEditor();
		await editorChangePromise;
		assert.strictEqual(part.activeGroup.activeEditor, input4);

		return workbenchTeardown(instantiationService);
	});

	test('transient editors suspends editor change tracking', async () => {
		const [part, historyService, editorService, , instantiationService] = await createServices();

		const input1 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar1'), TEST_EDITOR_INPUT_ID));
		const input2 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar2'), TEST_EDITOR_INPUT_ID));
		const input3 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar3'), TEST_EDITOR_INPUT_ID));
		const input4 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar4'), TEST_EDITOR_INPUT_ID));
		const input5 = disposables.add(new TestFileEditorInput(URI.parse('foo://bar5'), TEST_EDITOR_INPUT_ID));

		let editorChangePromise: Promise<void> = Event.toPromise(editorService.onDidActiveEditorChange);
		await part.activeGroup.openEditor(input1, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input1);
		await editorChangePromise;

		await part.activeGroup.openEditor(input2, { transient: true });
		assert.strictEqual(part.activeGroup.activeEditor, input2);
		await part.activeGroup.openEditor(input3, { transient: true });
		assert.strictEqual(part.activeGroup.activeEditor, input3);

		editorChangePromise = Event.toPromise(editorService.onDidActiveEditorChange)
			.then(() => Event.toPromise(editorService.onDidActiveEditorChange));

		await part.activeGroup.openEditor(input4, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input4);
		await part.activeGroup.openEditor(input5, { pinned: true });
		assert.strictEqual(part.activeGroup.activeEditor, input5);

		// stack should be [input1, input4, input5]
		await historyService.goBack();
		assert.strictEqual(part.activeGroup.activeEditor, input4);
		await historyService.goBack();
		assert.strictEqual(part.activeGroup.activeEditor, input1);
		await historyService.goBack();
		assert.strictEqual(part.activeGroup.activeEditor, input1);

		await historyService.goForward();
		assert.strictEqual(part.activeGroup.activeEditor, input4);
		await historyService.goForward();
		assert.strictEqual(part.activeGroup.activeEditor, input5);

		return workbenchTeardown(instantiationService);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/host/browser/browserHostService.ts]---
Location: vscode-main/src/vs/workbench/services/host/browser/browserHostService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IHostService } from './host.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILayoutService } from '../../../../platform/layout/browser/layoutService.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWindowSettings, IWindowOpenable, IOpenWindowOptions, isFolderToOpen, isWorkspaceToOpen, isFileToOpen, IOpenEmptyWindowOptions, IPathData, IFileToOpen, IOpenedMainWindow, IOpenedAuxiliaryWindow } from '../../../../platform/window/common/window.js';
import { isResourceEditorInput, pathsToEditors } from '../../../common/editor.js';
import { whenEditorClosed } from '../../../browser/editor.js';
import { IWorkspace, IWorkspaceProvider } from '../../../browser/web.api.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { EventType, ModifierKeyEmitter, addDisposableListener, addDisposableThrottledListener, detectFullscreen, disposableWindowInterval, getActiveDocument, getActiveWindow, getWindowId, onDidRegisterWindow, trackFocus, getWindows as getDOMWindows } from '../../../../base/browser/dom.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { memoize } from '../../../../base/common/decorators.js';
import { parseLineAndColumnAware } from '../../../../base/common/extpath.js';
import { IWorkspaceFolderCreationData } from '../../../../platform/workspaces/common/workspaces.js';
import { IWorkspaceEditingService } from '../../workspaces/common/workspaceEditing.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILifecycleService, BeforeShutdownEvent, ShutdownReason } from '../../lifecycle/common/lifecycle.js';
import { BrowserLifecycleService } from '../../lifecycle/browser/lifecycleService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { getWorkspaceIdentifier } from '../../workspaces/browser/workspaces.js';
import { localize } from '../../../../nls.js';
import Severity from '../../../../base/common/severity.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import { isUndefined } from '../../../../base/common/types.js';
import { isTemporaryWorkspace, IWorkspaceContextService, toWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import { Schemas } from '../../../../base/common/network.js';
import { ITextEditorOptions } from '../../../../platform/editor/common/editor.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { mainWindow, isAuxiliaryWindow } from '../../../../base/browser/window.js';
import { isIOS, isMacintosh } from '../../../../base/common/platform.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { URI } from '../../../../base/common/uri.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';

enum HostShutdownReason {

	/**
	 * An unknown shutdown reason.
	 */
	Unknown = 1,

	/**
	 * A shutdown that was potentially triggered by keyboard use.
	 */
	Keyboard = 2,

	/**
	 * An explicit shutdown via code.
	 */
	Api = 3
}

export class BrowserHostService extends Disposable implements IHostService {

	declare readonly _serviceBrand: undefined;

	private workspaceProvider: IWorkspaceProvider;

	private shutdownReason = HostShutdownReason.Unknown;

	constructor(
		@ILayoutService private readonly layoutService: ILayoutService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IFileService private readonly fileService: IFileService,
		@ILabelService private readonly labelService: ILabelService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ILifecycleService private readonly lifecycleService: BrowserLifecycleService,
		@ILogService private readonly logService: ILogService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService
	) {
		super();

		if (environmentService.options?.workspaceProvider) {
			this.workspaceProvider = environmentService.options.workspaceProvider;
		} else {
			this.workspaceProvider = new class implements IWorkspaceProvider {
				readonly workspace = undefined;
				readonly trusted = undefined;
				async open() { return true; }
			};
		}

		this.registerListeners();
	}


	private registerListeners(): void {

		// Veto shutdown depending on `window.confirmBeforeClose` setting
		this._register(this.lifecycleService.onBeforeShutdown(e => this.onBeforeShutdown(e)));

		// Track modifier keys to detect keybinding usage
		this._register(ModifierKeyEmitter.getInstance().event(() => this.updateShutdownReasonFromEvent()));
	}

	private onBeforeShutdown(e: BeforeShutdownEvent): void {

		switch (this.shutdownReason) {

			// Unknown / Keyboard shows veto depending on setting
			case HostShutdownReason.Unknown:
			case HostShutdownReason.Keyboard: {
				const confirmBeforeClose = this.configurationService.getValue('window.confirmBeforeClose');
				if (confirmBeforeClose === 'always' || (confirmBeforeClose === 'keyboardOnly' && this.shutdownReason === HostShutdownReason.Keyboard)) {
					e.veto(true, 'veto.confirmBeforeClose');
				}
				break;
			}
			// Api never shows veto
			case HostShutdownReason.Api:
				break;
		}

		// Unset for next shutdown
		this.shutdownReason = HostShutdownReason.Unknown;
	}

	private updateShutdownReasonFromEvent(): void {
		if (this.shutdownReason === HostShutdownReason.Api) {
			return; // do not overwrite any explicitly set shutdown reason
		}

		if (ModifierKeyEmitter.getInstance().isModifierPressed) {
			this.shutdownReason = HostShutdownReason.Keyboard;
		} else {
			this.shutdownReason = HostShutdownReason.Unknown;
		}
	}

	//#region Focus

	@memoize
	get onDidChangeFocus(): Event<boolean> {
		const emitter = this._register(new Emitter<boolean>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const focusTracker = disposables.add(trackFocus(window));
			const visibilityTracker = disposables.add(new DomEmitter(window.document, 'visibilitychange'));

			Event.any(
				Event.map(focusTracker.onDidFocus, () => this.hasFocus, disposables),
				Event.map(focusTracker.onDidBlur, () => this.hasFocus, disposables),
				Event.map(visibilityTracker.event, () => this.hasFocus, disposables),
				Event.map(this.onDidChangeActiveWindow, () => this.hasFocus, disposables),
			)(focus => emitter.fire(focus), undefined, disposables);
		}, { window: mainWindow, disposables: this._store }));

		return Event.latch(emitter.event, undefined, this._store);
	}

	get hasFocus(): boolean {
		return getActiveDocument().hasFocus();
	}

	async hadLastFocus(): Promise<boolean> {
		return true;
	}

	async focus(targetWindow: Window): Promise<void> {
		targetWindow.focus();
	}

	//#endregion


	//#region Window

	@memoize
	get onDidChangeActiveWindow(): Event<number> {
		const emitter = this._register(new Emitter<number>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const windowId = getWindowId(window);

			// Emit via focus tracking
			const focusTracker = disposables.add(trackFocus(window));
			disposables.add(focusTracker.onDidFocus(() => emitter.fire(windowId)));

			// Emit via interval: immediately when opening an auxiliary window,
			// it is possible that document focus has not yet changed, so we
			// poll for a while to ensure we catch the event.
			if (isAuxiliaryWindow(window)) {
				disposables.add(disposableWindowInterval(window, () => {
					const hasFocus = window.document.hasFocus();
					if (hasFocus) {
						emitter.fire(windowId);
					}

					return hasFocus;
				}, 100, 20));
			}
		}, { window: mainWindow, disposables: this._store }));

		return Event.latch(emitter.event, undefined, this._store);
	}

	@memoize
	get onDidChangeFullScreen(): Event<{ windowId: number; fullscreen: boolean }> {
		const emitter = this._register(new Emitter<{ windowId: number; fullscreen: boolean }>());

		this._register(Event.runAndSubscribe(onDidRegisterWindow, ({ window, disposables }) => {
			const windowId = getWindowId(window);
			const viewport = isIOS && window.visualViewport ? window.visualViewport /** Visual viewport */ : window /** Layout viewport */;

			// Fullscreen (Browser)
			for (const event of [EventType.FULLSCREEN_CHANGE, EventType.WK_FULLSCREEN_CHANGE]) {
				disposables.add(addDisposableListener(window.document, event, () => emitter.fire({ windowId, fullscreen: !!detectFullscreen(window) })));
			}

			// Fullscreen (Native)
			disposables.add(addDisposableThrottledListener(viewport, EventType.RESIZE, () => emitter.fire({ windowId, fullscreen: !!detectFullscreen(window) }), undefined, isMacintosh ? 2000 /* adjust for macOS animation */ : 800 /* can be throttled */));
		}, { window: mainWindow, disposables: this._store }));

		return emitter.event;
	}

	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;
	openWindow(arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> {
		if (Array.isArray(arg1)) {
			return this.doOpenWindow(arg1, arg2);
		}

		return this.doOpenEmptyWindow(arg1);
	}

	private async doOpenWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void> {
		const payload = this.preservePayload(false /* not an empty window */, options);
		const fileOpenables: IFileToOpen[] = [];

		const foldersToAdd: IWorkspaceFolderCreationData[] = [];
		const foldersToRemove: URI[] = [];

		for (const openable of toOpen) {
			openable.label = openable.label || this.getRecentLabel(openable);

			// Folder
			if (isFolderToOpen(openable)) {
				if (options?.addMode) {
					foldersToAdd.push({ uri: openable.folderUri });
				} else if (options?.removeMode) {
					foldersToRemove.push(openable.folderUri);
				} else {
					this.doOpen({ folderUri: openable.folderUri }, { reuse: this.shouldReuse(options, false /* no file */), payload });
				}
			}

			// Workspace
			else if (isWorkspaceToOpen(openable)) {
				this.doOpen({ workspaceUri: openable.workspaceUri }, { reuse: this.shouldReuse(options, false /* no file */), payload });
			}

			// File (handled later in bulk)
			else if (isFileToOpen(openable)) {
				fileOpenables.push(openable);
			}
		}

		// Handle Folders to add or remove
		if (foldersToAdd.length > 0 || foldersToRemove.length > 0) {
			this.withServices(async accessor => {
				const workspaceEditingService: IWorkspaceEditingService = accessor.get(IWorkspaceEditingService);
				if (foldersToAdd.length > 0) {
					await workspaceEditingService.addFolders(foldersToAdd);
				}

				if (foldersToRemove.length > 0) {
					await workspaceEditingService.removeFolders(foldersToRemove);
				}
			});
		}

		// Handle Files
		if (fileOpenables.length > 0) {
			this.withServices(async accessor => {
				const editorService = accessor.get(IEditorService);

				// Support mergeMode
				if (options?.mergeMode && fileOpenables.length === 4) {
					const editors = coalesce(await pathsToEditors(fileOpenables, this.fileService, this.logService));
					if (editors.length !== 4 || !isResourceEditorInput(editors[0]) || !isResourceEditorInput(editors[1]) || !isResourceEditorInput(editors[2]) || !isResourceEditorInput(editors[3])) {
						return; // invalid resources
					}

					// Same Window: open via editor service in current window
					if (this.shouldReuse(options, true /* file */)) {
						editorService.openEditor({
							input1: { resource: editors[0].resource },
							input2: { resource: editors[1].resource },
							base: { resource: editors[2].resource },
							result: { resource: editors[3].resource },
							options: { pinned: true }
						});
					}

					// New Window: open into empty window
					else {
						const environment = new Map<string, string>();
						environment.set('mergeFile1', editors[0].resource.toString());
						environment.set('mergeFile2', editors[1].resource.toString());
						environment.set('mergeFileBase', editors[2].resource.toString());
						environment.set('mergeFileResult', editors[3].resource.toString());

						this.doOpen(undefined, { payload: Array.from(environment.entries()) });
					}
				}

				// Support diffMode
				else if (options?.diffMode && fileOpenables.length === 2) {
					const editors = coalesce(await pathsToEditors(fileOpenables, this.fileService, this.logService));
					if (editors.length !== 2 || !isResourceEditorInput(editors[0]) || !isResourceEditorInput(editors[1])) {
						return; // invalid resources
					}

					// Same Window: open via editor service in current window
					if (this.shouldReuse(options, true /* file */)) {
						editorService.openEditor({
							original: { resource: editors[0].resource },
							modified: { resource: editors[1].resource },
							options: { pinned: true }
						});
					}

					// New Window: open into empty window
					else {
						const environment = new Map<string, string>();
						environment.set('diffFileSecondary', editors[0].resource.toString());
						environment.set('diffFilePrimary', editors[1].resource.toString());

						this.doOpen(undefined, { payload: Array.from(environment.entries()) });
					}
				}

				// Just open normally
				else {
					for (const openable of fileOpenables) {

						// Same Window: open via editor service in current window
						if (this.shouldReuse(options, true /* file */)) {
							let openables: IPathData<ITextEditorOptions>[] = [];

							// Support: --goto parameter to open on line/col
							if (options?.gotoLineMode) {
								const pathColumnAware = parseLineAndColumnAware(openable.fileUri.path);
								openables = [{
									fileUri: openable.fileUri.with({ path: pathColumnAware.path }),
									options: {
										selection: !isUndefined(pathColumnAware.line) ? { startLineNumber: pathColumnAware.line, startColumn: pathColumnAware.column || 1 } : undefined
									}
								}];
							} else {
								openables = [openable];
							}

							editorService.openEditors(coalesce(await pathsToEditors(openables, this.fileService, this.logService)), undefined, { validateTrust: true });
						}

						// New Window: open into empty window
						else {
							const environment = new Map<string, string>();
							environment.set('openFile', openable.fileUri.toString());

							if (options?.gotoLineMode) {
								environment.set('gotoLineMode', 'true');
							}

							this.doOpen(undefined, { payload: Array.from(environment.entries()) });
						}
					}
				}

				// Support wait mode
				const waitMarkerFileURI = options?.waitMarkerFileURI;
				if (waitMarkerFileURI) {
					(async () => {

						// Wait for the resources to be closed in the text editor...
						const filesToWaitFor: URI[] = [];
						if (options.mergeMode) {
							filesToWaitFor.push(fileOpenables[3].fileUri /* [3] is the resulting merge file */);
						} else {
							filesToWaitFor.push(...fileOpenables.map(fileOpenable => fileOpenable.fileUri));
						}
						await this.instantiationService.invokeFunction(accessor => whenEditorClosed(accessor, filesToWaitFor));

						// ...before deleting the wait marker file
						await this.fileService.del(waitMarkerFileURI);
					})();
				}
			});
		}
	}

	private withServices(fn: (accessor: ServicesAccessor) => unknown): void {
		// Host service is used in a lot of contexts and some services
		// need to be resolved dynamically to avoid cyclic dependencies
		// (https://github.com/microsoft/vscode/issues/108522)
		this.instantiationService.invokeFunction(accessor => fn(accessor));
	}

	private preservePayload(isEmptyWindow: boolean, options?: IOpenWindowOptions): Array<unknown> | undefined {

		// Selectively copy payload: for now only extension debugging properties are considered
		const newPayload: Array<unknown> = [];
		if (!isEmptyWindow && this.environmentService.extensionDevelopmentLocationURI) {
			newPayload.push(['extensionDevelopmentPath', this.environmentService.extensionDevelopmentLocationURI.toString()]);

			if (this.environmentService.debugExtensionHost.debugId) {
				newPayload.push(['debugId', this.environmentService.debugExtensionHost.debugId]);
			}

			if (this.environmentService.debugExtensionHost.port) {
				newPayload.push(['inspect-brk-extensions', String(this.environmentService.debugExtensionHost.port)]);
			}
		}

		const newWindowProfile = options?.forceProfile
			? this.userDataProfilesService.profiles.find(profile => profile.name === options?.forceProfile)
			: undefined;
		if (newWindowProfile && !newWindowProfile.isDefault) {
			newPayload.push(['profile', newWindowProfile.name]);
		}

		return newPayload.length ? newPayload : undefined;
	}

	private getRecentLabel(openable: IWindowOpenable): string {
		if (isFolderToOpen(openable)) {
			return this.labelService.getWorkspaceLabel(openable.folderUri, { verbose: Verbosity.LONG });
		}

		if (isWorkspaceToOpen(openable)) {
			return this.labelService.getWorkspaceLabel(getWorkspaceIdentifier(openable.workspaceUri), { verbose: Verbosity.LONG });
		}

		return this.labelService.getUriLabel(openable.fileUri, { appendWorkspaceSuffix: true });
	}

	private shouldReuse(options: IOpenWindowOptions = Object.create(null), isFile: boolean): boolean {
		if (options.waitMarkerFileURI) {
			return true; // always handle --wait in same window
		}

		const windowConfig = this.configurationService.getValue<IWindowSettings | undefined>('window');
		const openInNewWindowConfig = isFile ? (windowConfig?.openFilesInNewWindow || 'off' /* default */) : (windowConfig?.openFoldersInNewWindow || 'default' /* default */);

		let openInNewWindow = (options.preferNewWindow || !!options.forceNewWindow) && !options.forceReuseWindow;
		if (!options.forceNewWindow && !options.forceReuseWindow && (openInNewWindowConfig === 'on' || openInNewWindowConfig === 'off')) {
			openInNewWindow = (openInNewWindowConfig === 'on');
		}

		return !openInNewWindow;
	}

	private async doOpenEmptyWindow(options?: IOpenEmptyWindowOptions): Promise<void> {
		return this.doOpen(undefined, {
			reuse: options?.forceReuseWindow,
			payload: this.preservePayload(true /* empty window */, options)
		});
	}

	private async doOpen(workspace: IWorkspace, options?: { reuse?: boolean; payload?: object }): Promise<void> {

		// When we are in a temporary workspace and are asked to open a local folder
		// we swap that folder into the workspace to avoid a window reload. Access
		// to local resources is only possible without a window reload because it
		// needs user activation.
		if (workspace && isFolderToOpen(workspace) && workspace.folderUri.scheme === Schemas.file && isTemporaryWorkspace(this.contextService.getWorkspace())) {
			this.withServices(async accessor => {
				const workspaceEditingService: IWorkspaceEditingService = accessor.get(IWorkspaceEditingService);

				await workspaceEditingService.updateFolders(0, this.contextService.getWorkspace().folders.length, [{ uri: workspace.folderUri }]);
			});

			return;
		}

		// We know that `workspaceProvider.open` will trigger a shutdown
		// with `options.reuse` so we handle this expected shutdown
		if (options?.reuse) {
			await this.handleExpectedShutdown(ShutdownReason.LOAD);
		}

		const opened = await this.workspaceProvider.open(workspace, options);
		if (!opened) {
			await this.dialogService.prompt({
				type: Severity.Warning,
				message: workspace ?
					localize('unableToOpenExternalWorkspace', "The browser blocked opening a new tab or window for '{0}'. Press 'Retry' to try again.", this.getRecentLabel(workspace)) :
					localize('unableToOpenExternal', "The browser blocked opening a new tab or window. Press 'Retry' to try again."),
				custom: {
					markdownDetails: [{ markdown: new MarkdownString(localize('unableToOpenWindowDetail', "Please allow pop-ups for this website in your [browser settings]({0}).", 'https://aka.ms/allow-vscode-popup'), true) }]
				},
				buttons: [
					{
						label: localize({ key: 'retry', comment: ['&& denotes a mnemonic'] }, "&&Retry"),
						run: () => this.workspaceProvider.open(workspace, options)
					}
				],
				cancelButton: true
			});
		}
	}

	async toggleFullScreen(targetWindow: Window): Promise<void> {
		const target = this.layoutService.getContainer(targetWindow);

		// Chromium
		if (targetWindow.document.fullscreen !== undefined) {
			if (!targetWindow.document.fullscreen) {
				try {
					return await target.requestFullscreen();
				} catch (error) {
					this.logService.warn('toggleFullScreen(): requestFullscreen failed'); // https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
				}
			} else {
				try {
					return await targetWindow.document.exitFullscreen();
				} catch (error) {
					this.logService.warn('toggleFullScreen(): exitFullscreen failed');
				}
			}
		}

		// Safari and Edge 14 are all using webkit prefix

		interface WebkitDocument extends Document {
			webkitFullscreenElement: Element | null;
			webkitExitFullscreen(): Promise<void>;
			webkitIsFullScreen: boolean;
		}

		interface WebkitHTMLElement extends HTMLElement {
			webkitRequestFullscreen(): Promise<void>;
		}

		const webkitDocument = targetWindow.document as WebkitDocument;
		const webkitElement = target as WebkitHTMLElement;
		if (webkitDocument.webkitIsFullScreen !== undefined) {
			try {
				if (!webkitDocument.webkitIsFullScreen) {
					webkitElement.webkitRequestFullscreen(); // it's async, but doesn't return a real promise
				} else {
					webkitDocument.webkitExitFullscreen(); // it's async, but doesn't return a real promise
				}
			} catch {
				this.logService.warn('toggleFullScreen(): requestFullscreen/exitFullscreen failed');
			}
		}
	}

	async moveTop(targetWindow: Window): Promise<void> {
		// There seems to be no API to bring a window to front in browsers
	}

	async getCursorScreenPoint(): Promise<undefined> {
		return undefined;
	}

	getWindows(options: { includeAuxiliaryWindows: true }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>>;
	getWindows(options: { includeAuxiliaryWindows: false }): Promise<Array<IOpenedMainWindow>>;
	async getWindows(options: { includeAuxiliaryWindows: boolean }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>> {
		const activeWindow = getActiveWindow();
		const activeWindowId = getWindowId(activeWindow);

		// Main window
		const result: Array<IOpenedMainWindow | IOpenedAuxiliaryWindow> = [{
			id: activeWindowId,
			title: activeWindow.document.title,
			workspace: toWorkspaceIdentifier(this.contextService.getWorkspace()),
			dirty: false
		}];

		// Auxiliary windows
		if (options.includeAuxiliaryWindows) {
			for (const { window } of getDOMWindows()) {
				const windowId = getWindowId(window);
				if (windowId !== activeWindowId && isAuxiliaryWindow(window)) {
					result.push({
						id: windowId,
						title: window.document.title,
						parentId: activeWindowId
					});
				}
			}
		}

		return result;
	}

	//#endregion

	//#region Lifecycle

	async restart(): Promise<void> {
		this.reload();
	}

	async reload(): Promise<void> {
		await this.handleExpectedShutdown(ShutdownReason.RELOAD);

		mainWindow.location.reload();
	}

	async close(): Promise<void> {
		await this.handleExpectedShutdown(ShutdownReason.CLOSE);

		mainWindow.close();
	}

	async withExpectedShutdown<T>(expectedShutdownTask: () => Promise<T>): Promise<T> {
		const previousShutdownReason = this.shutdownReason;
		try {
			this.shutdownReason = HostShutdownReason.Api;
			return await expectedShutdownTask();
		} finally {
			this.shutdownReason = previousShutdownReason;
		}
	}

	private async handleExpectedShutdown(reason: ShutdownReason): Promise<void> {

		// Update shutdown reason in a way that we do
		// not show a dialog because this is a expected
		// shutdown.
		this.shutdownReason = HostShutdownReason.Api;

		// Signal shutdown reason to lifecycle
		return this.lifecycleService.withExpectedShutdown(reason);
	}

	//#endregion

	//#region Screenshots

	async getScreenshot(): Promise<VSBuffer | undefined> {
		// Gets a screenshot from the browser. This gets the screenshot via the browser's display
		// media API which will typically offer a picker of all available screens and windows for
		// the user to select. Using the video stream provided by the display media API, this will
		// capture a single frame of the video and convert it to a JPEG image.
		const store = new DisposableStore();

		// Create a video element to play the captured screen source
		const video = document.createElement('video');
		store.add(toDisposable(() => video.remove()));
		let stream: MediaStream | undefined;
		try {
			// Create a stream from the screen source (capture screen without audio)
			stream = await navigator.mediaDevices.getDisplayMedia({
				audio: false,
				video: true
			});

			// Set the stream as the source of the video element
			video.srcObject = stream;
			video.play();

			// Wait for the video to load properly before capturing the screenshot
			await Promise.all([
				new Promise<void>(r => store.add(addDisposableListener(video, 'loadedmetadata', () => r()))),
				new Promise<void>(r => store.add(addDisposableListener(video, 'canplaythrough', () => r())))
			]);

			const canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				return undefined;
			}

			// Draw the portion of the video (x, y) with the specified width and height
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

			// Convert the canvas to a Blob (JPEG format), use .95 for quality
			const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95));
			if (!blob) {
				throw new Error('Failed to create blob from canvas');
			}

			const buf = await blob.bytes();
			return VSBuffer.wrap(buf);

		} catch (error) {
			console.error('Error taking screenshot:', error);
			return undefined;
		} finally {
			store.dispose();
			if (stream) {
				for (const track of stream.getTracks()) {
					track.stop();
				}
			}
		}
	}

	async getBrowserId(): Promise<string | undefined> {
		return undefined;
	}

	//#endregion

	//#region Native Handle

	async getNativeWindowHandle(_windowId: number) {
		return undefined;
	}

	//#endregion
}

registerSingleton(IHostService, BrowserHostService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/host/browser/host.ts]---
Location: vscode-main/src/vs/workbench/services/host/browser/host.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { FocusMode } from '../../../../platform/native/common/native.js';
import { IWindowOpenable, IOpenWindowOptions, IOpenEmptyWindowOptions, IPoint, IRectangle, IOpenedMainWindow, IOpenedAuxiliaryWindow } from '../../../../platform/window/common/window.js';

export const IHostService = createDecorator<IHostService>('hostService');

/**
 * A set of methods supported in both web and native environments.
 *
 * @see {@link INativeHostService} for methods that are specific to native
 * environments.
 */
export interface IHostService {

	readonly _serviceBrand: undefined;

	//#region Focus

	/**
	 * Emitted when the focus of the window changes.
	 *
	 * Note: this considers the main window as well as auxiliary windows
	 * when they are in focus. As long as the main window or any of its
	 * auxiliary windows have focus, this event fires with `true`. It will
	 * fire with `false` when neither the main window nor any of its
	 * auxiliary windows have focus.
	 */
	readonly onDidChangeFocus: Event<boolean>;

	/**
	 * Find out if the window or any of its auxiliary windows have focus.
	 */
	readonly hasFocus: boolean;

	/**
	 * Find out if the window had the last focus.
	 */
	hadLastFocus(): Promise<boolean>;

	/**
	 * Attempt to bring the window to the foreground and focus it.
	 *
	 * @param options How to focus the window, defaults to {@link FocusMode.Transfer}
	 */
	focus(targetWindow: Window, options?: { mode?: FocusMode }): Promise<void>;

	//#endregion

	//#region Window

	/**
	 * Emitted when the active window changes between main window
	 * and auxiliary windows.
	 */
	readonly onDidChangeActiveWindow: Event<number>;

	/**
	 * Emitted when the window with the given identifier changes
	 * its fullscreen state.
	 */
	readonly onDidChangeFullScreen: Event<{ windowId: number; fullscreen: boolean }>;

	/**
	 * Opens an empty window. The optional parameter allows to define if
	 * a new window should open or the existing one change to an empty.
	 */
	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;

	/**
	 * Opens the provided array of openables in a window with the provided options.
	 */
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;

	/**
	 * Switch between fullscreen and normal window.
	 */
	toggleFullScreen(targetWindow: Window): Promise<void>;

	/**
	 * Bring a window to the front and restore it if needed.
	 */
	moveTop(targetWindow: Window): Promise<void>;

	/**
	 * Get the location of the mouse cursor and its display bounds or `undefined` if unavailable.
	 */
	getCursorScreenPoint(): Promise<{ readonly point: IPoint; readonly display: IRectangle } | undefined>;

	/**
	 * Get the list of opened windows, optionally including auxiliary windows.
	 */
	getWindows(options: { includeAuxiliaryWindows: true }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>>;
	getWindows(options: { includeAuxiliaryWindows: false }): Promise<Array<IOpenedMainWindow>>;

	//#endregion

	//#region Lifecycle

	/**
	 * Restart the entire application.
	 */
	restart(): Promise<void>;

	/**
	 * Reload the currently active main window.
	 */
	reload(options?: { disableExtensions?: boolean }): Promise<void>;

	/**
	 * Attempt to close the active main window.
	 */
	close(): Promise<void>;

	/**
	 * Execute an asynchronous `expectedShutdownTask`. While this task is
	 * in progress, attempts to quit the application will not be vetoed with a dialog.
	 */
	withExpectedShutdown<T>(expectedShutdownTask: () => Promise<T>): Promise<T>;

	//#endregion

	//#region Screenshots

	/**
	 * Captures a screenshot.
	 */
	getScreenshot(rect?: IRectangle): Promise<VSBuffer | undefined>;

	//#endregion

	//#region Native Handle

	/**
	 * Get the native handle of the window.
	 */
	getNativeWindowHandle(windowId: number): Promise<VSBuffer | undefined>;

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/host/electron-browser/nativeHostService.ts]---
Location: vscode-main/src/vs/workbench/services/host/electron-browser/nativeHostService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { IHostService } from '../browser/host.js';
import { FocusMode, INativeHostService } from '../../../../platform/native/common/native.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILabelService, Verbosity } from '../../../../platform/label/common/label.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IWindowOpenable, IOpenWindowOptions, isFolderToOpen, isWorkspaceToOpen, IOpenEmptyWindowOptions, IPoint, IRectangle, IOpenedAuxiliaryWindow, IOpenedMainWindow } from '../../../../platform/window/common/window.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { NativeHostService } from '../../../../platform/native/common/nativeHostService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { disposableWindowInterval, getActiveDocument, getWindowId, getWindowsCount, hasWindow, onDidRegisterWindow } from '../../../../base/browser/dom.js';
import { memoize } from '../../../../base/common/decorators.js';
import { isAuxiliaryWindow } from '../../../../base/browser/window.js';
import { VSBuffer } from '../../../../base/common/buffer.js';

class WorkbenchNativeHostService extends NativeHostService {

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IMainProcessService mainProcessService: IMainProcessService
	) {
		super(environmentService.window.id, mainProcessService);
	}
}

class WorkbenchHostService extends Disposable implements IHostService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ILabelService private readonly labelService: ILabelService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService
	) {
		super();

		this.onDidChangeFocus = Event.latch(
			Event.any(
				Event.map(Event.filter(this.nativeHostService.onDidFocusMainOrAuxiliaryWindow, id => hasWindow(id), this._store), () => this.hasFocus, this._store),
				Event.map(Event.filter(this.nativeHostService.onDidBlurMainOrAuxiliaryWindow, id => hasWindow(id), this._store), () => this.hasFocus, this._store),
				Event.map(this.onDidChangeActiveWindow, () => this.hasFocus, this._store)
			), undefined, this._store
		);

		this.onDidChangeFullScreen = Event.filter(this.nativeHostService.onDidChangeWindowFullScreen, e => hasWindow(e.windowId), this._store);
	}

	//#region Focus

	readonly onDidChangeFocus: Event<boolean>;

	get hasFocus(): boolean {
		return getActiveDocument().hasFocus();
	}

	async hadLastFocus(): Promise<boolean> {
		const activeWindowId = await this.nativeHostService.getActiveWindowId();

		if (typeof activeWindowId === 'undefined') {
			return false;
		}

		return activeWindowId === this.nativeHostService.windowId;
	}

	//#endregion

	//#region Window

	@memoize
	get onDidChangeActiveWindow(): Event<number> {
		const emitter = this._register(new Emitter<number>());

		// Emit via native focus tracking
		this._register(Event.filter(this.nativeHostService.onDidFocusMainOrAuxiliaryWindow, id => hasWindow(id), this._store)(id => emitter.fire(id)));

		this._register(onDidRegisterWindow(({ window, disposables }) => {

			// Emit via interval: immediately when opening an auxiliary window,
			// it is possible that document focus has not yet changed, so we
			// poll for a while to ensure we catch the event.
			disposables.add(disposableWindowInterval(window, () => {
				const hasFocus = window.document.hasFocus();
				if (hasFocus) {
					emitter.fire(window.vscodeWindowId);
				}

				return hasFocus;
			}, 100, 20));
		}));

		return Event.latch(emitter.event, undefined, this._store);
	}

	readonly onDidChangeFullScreen: Event<{ readonly windowId: number; readonly fullscreen: boolean }>;

	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;
	openWindow(arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> {
		if (Array.isArray(arg1)) {
			return this.doOpenWindow(arg1, arg2);
		}

		return this.doOpenEmptyWindow(arg1);
	}

	private doOpenWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void> {
		const remoteAuthority = this.environmentService.remoteAuthority;
		if (remoteAuthority) {
			toOpen.forEach(openable => openable.label = openable.label || this.getRecentLabel(openable));

			if (options?.remoteAuthority === undefined) {
				// set the remoteAuthority of the window the request came from.
				// It will be used when the input is neither file nor vscode-remote.
				options = options ? { ...options, remoteAuthority } : { remoteAuthority };
			}
		}

		return this.nativeHostService.openWindow(toOpen, options);
	}

	private getRecentLabel(openable: IWindowOpenable): string {
		if (isFolderToOpen(openable)) {
			return this.labelService.getWorkspaceLabel(openable.folderUri, { verbose: Verbosity.LONG });
		}

		if (isWorkspaceToOpen(openable)) {
			return this.labelService.getWorkspaceLabel({ id: '', configPath: openable.workspaceUri }, { verbose: Verbosity.LONG });
		}

		return this.labelService.getUriLabel(openable.fileUri, { appendWorkspaceSuffix: true });
	}

	private doOpenEmptyWindow(options?: IOpenEmptyWindowOptions): Promise<void> {
		const remoteAuthority = this.environmentService.remoteAuthority;
		if (!!remoteAuthority && options?.remoteAuthority === undefined) {
			// set the remoteAuthority of the window the request came from
			options = options ? { ...options, remoteAuthority } : { remoteAuthority };
		}
		return this.nativeHostService.openWindow(options);
	}

	toggleFullScreen(targetWindow: Window): Promise<void> {
		return this.nativeHostService.toggleFullScreen({ targetWindowId: isAuxiliaryWindow(targetWindow) ? targetWindow.vscodeWindowId : undefined });
	}

	async moveTop(targetWindow: Window): Promise<void> {
		if (getWindowsCount() <= 1) {
			return; // does not apply when only one window is opened
		}

		return this.nativeHostService.moveWindowTop(isAuxiliaryWindow(targetWindow) ? { targetWindowId: targetWindow.vscodeWindowId } : undefined);
	}

	getCursorScreenPoint(): Promise<{ readonly point: IPoint; readonly display: IRectangle }> {
		return this.nativeHostService.getCursorScreenPoint();
	}

	getWindows(options: { includeAuxiliaryWindows: true }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>>;
	getWindows(options: { includeAuxiliaryWindows: false }): Promise<Array<IOpenedMainWindow>>;
	getWindows(options: { includeAuxiliaryWindows: boolean }): Promise<Array<IOpenedMainWindow | IOpenedAuxiliaryWindow>> {
		if (options.includeAuxiliaryWindows === false) {
			return this.nativeHostService.getWindows({ includeAuxiliaryWindows: false });
		}

		return this.nativeHostService.getWindows({ includeAuxiliaryWindows: true });
	}

	//#endregion

	//#region Lifecycle

	focus(targetWindow: Window, options?: { mode?: FocusMode }): Promise<void> {
		return this.nativeHostService.focusWindow({
			mode: options?.mode,
			targetWindowId: getWindowId(targetWindow)
		});
	}

	restart(): Promise<void> {
		return this.nativeHostService.relaunch();
	}

	reload(options?: { disableExtensions?: boolean }): Promise<void> {
		return this.nativeHostService.reload(options);
	}

	close(): Promise<void> {
		return this.nativeHostService.closeWindow();
	}

	async withExpectedShutdown<T>(expectedShutdownTask: () => Promise<T>): Promise<T> {
		return await expectedShutdownTask();
	}

	//#endregion

	//#region Screenshots

	getScreenshot(rect?: IRectangle): Promise<VSBuffer | undefined> {
		return this.nativeHostService.getScreenshot(rect);
	}

	//#endregion

	//#region Native Handle

	private _nativeWindowHandleCache = new Map<number, Promise<VSBuffer | undefined>>();
	async getNativeWindowHandle(windowId: number): Promise<VSBuffer | undefined> {
		if (!this._nativeWindowHandleCache.has(windowId)) {
			this._nativeWindowHandleCache.set(windowId, this.nativeHostService.getNativeWindowHandle(windowId));
		}
		return this._nativeWindowHandleCache.get(windowId)!;
	}

	//#endregion
}

registerSingleton(IHostService, WorkbenchHostService, InstantiationType.Delayed);
registerSingleton(INativeHostService, WorkbenchNativeHostService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/imageResize/browser/imageResizeService.ts]---
Location: vscode-main/src/vs/workbench/services/imageResize/browser/imageResizeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IImageResizeService } from '../../../../platform/imageResize/common/imageResizeService.js';
import { ImageResizeService } from '../../../../platform/imageResize/browser/imageResizeService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

registerSingleton(IImageResizeService, ImageResizeService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/imageResize/electron-browser/imageResizeService.ts]---
Location: vscode-main/src/vs/workbench/services/imageResize/electron-browser/imageResizeService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IImageResizeService } from '../../../../platform/imageResize/common/imageResizeService.js';
import { ImageResizeService } from '../../../../platform/imageResize/browser/imageResizeService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

registerSingleton(IImageResizeService, ImageResizeService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/inlineCompletions/common/inlineCompletionsUnification.ts]---
Location: vscode-main/src/vs/workbench/services/inlineCompletions/common/inlineCompletionsUnification.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../../base/common/arrays.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ExtensionType } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchAssignmentService } from '../../assignment/common/assignmentService.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../extensionManagement/common/extensionManagement.js';
import { IExtensionService } from '../../extensions/common/extensions.js';

export const IInlineCompletionsUnificationService = createDecorator<IInlineCompletionsUnificationService>('inlineCompletionsUnificationService');

export interface IInlineCompletionsUnificationState {
	codeUnification: boolean;
	modelUnification: boolean;
	extensionUnification: boolean;
	expAssignments: string[];
}

export interface IInlineCompletionsUnificationService {
	readonly _serviceBrand: undefined;

	readonly state: IInlineCompletionsUnificationState;
	readonly onDidStateChange: Event<void>;
}

const CODE_UNIFICATION_PREFIX = 'cmp-cht-';
const EXTENSION_UNIFICATION_PREFIX = 'cmp-ext-';
const CODE_UNIFICATION_FF = 'inlineCompletionsUnificationCode';
const MODEL_UNIFICATION_FF = 'inlineCompletionsUnificationModel';

export const isRunningUnificationExperiment = new RawContextKey<boolean>('isRunningUnificationExperiment', false);

const ExtensionUnificationSetting = 'chat.extensionUnification.enabled';

export class InlineCompletionsUnificationImpl extends Disposable implements IInlineCompletionsUnificationService {
	readonly _serviceBrand: undefined;

	private _state = new InlineCompletionsUnificationState(false, false, false, []);
	public get state(): IInlineCompletionsUnificationState { return this._state; }

	private isRunningUnificationExperiment;

	private readonly _onDidStateChange = this._register(new Emitter<void>());
	public readonly onDidStateChange = this._onDidStateChange.event;

	private readonly _onDidChangeExtensionUnificationState = this._register(new Emitter<void>());
	private readonly _onDidChangeExtensionUnificationSetting = this._register(new Emitter<void>());

	private readonly _completionsExtensionId: string | undefined;
	private readonly _chatExtensionId: string | undefined;

	constructor(
		@IWorkbenchAssignmentService private readonly _assignmentService: IWorkbenchAssignmentService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IWorkbenchExtensionEnablementService private readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IExtensionManagementService private readonly _extensionManagementService: IExtensionManagementService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IProductService productService: IProductService
	) {
		super();
		this._completionsExtensionId = productService.defaultChatAgent?.extensionId.toLowerCase();
		this._chatExtensionId = productService.defaultChatAgent?.chatExtensionId.toLowerCase();
		const relevantExtensions = [this._completionsExtensionId, this._chatExtensionId].filter((id): id is string => !!id);

		this.isRunningUnificationExperiment = isRunningUnificationExperiment.bindTo(this._contextKeyService);

		this._assignmentService.addTelemetryAssignmentFilter({
			exclude: (assignment) => assignment.startsWith(EXTENSION_UNIFICATION_PREFIX) && this._state.extensionUnification !== this._configurationService.getValue<boolean>(ExtensionUnificationSetting),
			onDidChange: Event.any(this._onDidChangeExtensionUnificationState.event, this._onDidChangeExtensionUnificationSetting.event)
		});

		this._register(this._extensionEnablementService.onEnablementChanged((extensions) => {
			if (extensions.some(ext => relevantExtensions.includes(ext.identifier.id.toLowerCase()))) {
				this._update();
			}
		}));
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(ExtensionUnificationSetting)) {
				this._update();
				this._onDidChangeExtensionUnificationSetting.fire();
			}
		}));
		this._register(this._extensionService.onDidChangeExtensions(({ added }) => {
			if (added.some(ext => relevantExtensions.includes(ext.identifier.value.toLowerCase()))) {
				this._update();
			}
		}));
		this._register(this._assignmentService.onDidRefetchAssignments(() => this._update()));
		this._update();
	}

	private async _update(): Promise<void> {
		const [codeUnificationFF, modelUnificationFF, extensionUnificationEnabled] = await Promise.all([
			this._assignmentService.getTreatment<boolean>(CODE_UNIFICATION_FF),
			this._assignmentService.getTreatment<boolean>(MODEL_UNIFICATION_FF),
			this._isExtensionUnificationActive()
		]);

		const extensionStatesMatchUnificationSetting = this._configurationService.getValue<boolean>(ExtensionUnificationSetting) === extensionUnificationEnabled;

		// Intentionally read the current experiments after fetching the treatments
		const currentExperiments = await this._assignmentService.getCurrentExperiments();
		const newState = new InlineCompletionsUnificationState(
			codeUnificationFF === true,
			modelUnificationFF === true,
			extensionUnificationEnabled,
			currentExperiments?.filter(exp => exp.startsWith(CODE_UNIFICATION_PREFIX) || (extensionStatesMatchUnificationSetting && exp.startsWith(EXTENSION_UNIFICATION_PREFIX))) ?? []
		);
		if (this._state.equals(newState)) {
			return;
		}

		const previousState = this._state;
		this._state = newState;
		this.isRunningUnificationExperiment.set(this._state.codeUnification || this._state.modelUnification || this._state.extensionUnification);
		this._onDidStateChange.fire();

		if (previousState.extensionUnification !== this._state.extensionUnification) {
			this._onDidChangeExtensionUnificationState.fire();
		}
	}

	private async _isExtensionUnificationActive(): Promise<boolean> {
		if (!this._configurationService.getValue<boolean>(ExtensionUnificationSetting)) {
			return false;
		}

		if (!this._completionsExtensionId || !this._chatExtensionId) {
			return false;
		}

		const [completionsExtension, chatExtension, installedExtensions] = await Promise.all([
			this._extensionService.getExtension(this._completionsExtensionId),
			this._extensionService.getExtension(this._chatExtensionId),
			this._extensionManagementService.getInstalled(ExtensionType.User)
		]);

		if (!chatExtension || completionsExtension) {
			return false;
		}

		// Extension might be installed on remote and local
		const completionExtensionInstalled = installedExtensions.filter(ext => ext.identifier.id.toLowerCase() === this._completionsExtensionId);
		if (completionExtensionInstalled.length === 0) {
			return false;
		}

		const completionsExtensionDisabledByUnification = completionExtensionInstalled.some(ext => this._extensionEnablementService.getEnablementState(ext) === EnablementState.DisabledByUnification);

		return !!chatExtension && completionsExtensionDisabledByUnification;
	}
}

class InlineCompletionsUnificationState implements IInlineCompletionsUnificationState {
	constructor(
		public readonly codeUnification: boolean,
		public readonly modelUnification: boolean,
		public readonly extensionUnification: boolean,
		public readonly expAssignments: string[]
	) {
	}

	equals(other: IInlineCompletionsUnificationState): boolean {
		return this.codeUnification === other.codeUnification
			&& this.modelUnification === other.modelUnification
			&& this.extensionUnification === other.extensionUnification
			&& equals(this.expAssignments, other.expAssignments);
	}
}

registerSingleton(IInlineCompletionsUnificationService, InlineCompletionsUnificationImpl, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/integrity/browser/integrityService.ts]---
Location: vscode-main/src/vs/workbench/services/integrity/browser/integrityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IIntegrityService, IntegrityTestResult } from '../common/integrity.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';

export class IntegrityService implements IIntegrityService {

	declare readonly _serviceBrand: undefined;

	async isPure(): Promise<IntegrityTestResult> {
		return { isPure: true, proof: [] };
	}
}

registerSingleton(IIntegrityService, IntegrityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/integrity/common/integrity.ts]---
Location: vscode-main/src/vs/workbench/services/integrity/common/integrity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IIntegrityService = createDecorator<IIntegrityService>('integrityService');

export interface ChecksumPair {
	uri: URI;
	actual: string;
	expected: string;
	isPure: boolean;
}

export interface IntegrityTestResult {
	isPure: boolean;
	proof: ChecksumPair[];
}

export interface IIntegrityService {
	readonly _serviceBrand: undefined;

	isPure(): Promise<IntegrityTestResult>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/integrity/electron-browser/integrityService.ts]---
Location: vscode-main/src/vs/workbench/services/integrity/electron-browser/integrityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import Severity from '../../../../base/common/severity.js';
import { URI } from '../../../../base/common/uri.js';
import { ChecksumPair, IIntegrityService, IntegrityTestResult } from '../common/integrity.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { INotificationService, NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { FileAccess, AppResourcePath } from '../../../../base/common/network.js';
import { IChecksumService } from '../../../../platform/checksum/common/checksumService.js';
import { ILogService } from '../../../../platform/log/common/log.js';

interface IStorageData {
	readonly dontShowPrompt: boolean;
	readonly commit: string | undefined;
}

class IntegrityStorage {

	private static readonly KEY = 'integrityService';

	private value: IStorageData | null;

	constructor(private readonly storageService: IStorageService) {
		this.value = this._read();
	}

	private _read(): IStorageData | null {
		const jsonValue = this.storageService.get(IntegrityStorage.KEY, StorageScope.APPLICATION);
		if (!jsonValue) {
			return null;
		}

		try {
			return JSON.parse(jsonValue);
		} catch (err) {
			return null;
		}
	}

	get(): IStorageData | null {
		return this.value;
	}

	set(data: IStorageData | null): void {
		this.value = data;
		this.storageService.store(IntegrityStorage.KEY, JSON.stringify(this.value), StorageScope.APPLICATION, StorageTarget.MACHINE);
	}
}

export class IntegrityService implements IIntegrityService {

	declare readonly _serviceBrand: undefined;

	private readonly storage: IntegrityStorage;

	private readonly isPurePromise: Promise<IntegrityTestResult>;
	isPure(): Promise<IntegrityTestResult> { return this.isPurePromise; }

	constructor(
		@INotificationService private readonly notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IProductService private readonly productService: IProductService,
		@IChecksumService private readonly checksumService: IChecksumService,
		@ILogService private readonly logService: ILogService
	) {
		this.storage = new IntegrityStorage(storageService);
		this.isPurePromise = this._isPure();

		this._compute();
	}

	private async _compute(): Promise<void> {
		const { isPure } = await this.isPure();
		if (isPure) {
			return; // all is good
		}

		this.logService.warn(`

----------------------------------------------
***	Installation has been modified on disk ***
----------------------------------------------

`);

		const storedData = this.storage.get();
		if (storedData?.dontShowPrompt && storedData.commit === this.productService.commit) {
			return; // Do not prompt
		}

		this._showNotification();
	}

	private async _isPure(): Promise<IntegrityTestResult> {
		const expectedChecksums = this.productService.checksums || {};

		await this.lifecycleService.when(LifecyclePhase.Eventually);

		const allResults = await Promise.all(Object.keys(expectedChecksums).map(filename => this._resolve(<AppResourcePath>filename, expectedChecksums[filename])));

		let isPure = true;
		for (let i = 0, len = allResults.length; i < len; i++) {
			if (!allResults[i].isPure) {
				isPure = false;
				break;
			}
		}

		return {
			isPure,
			proof: allResults
		};
	}

	private async _resolve(filename: AppResourcePath, expected: string): Promise<ChecksumPair> {
		const fileUri = FileAccess.asFileUri(filename);

		try {
			const checksum = await this.checksumService.checksum(fileUri);

			return IntegrityService._createChecksumPair(fileUri, checksum, expected);
		} catch (error) {
			return IntegrityService._createChecksumPair(fileUri, '', expected);
		}
	}

	private static _createChecksumPair(uri: URI, actual: string, expected: string): ChecksumPair {
		return {
			uri: uri,
			actual: actual,
			expected: expected,
			isPure: (actual === expected)
		};
	}

	private _showNotification(): void {
		const checksumFailMoreInfoUrl = this.productService.checksumFailMoreInfoUrl;
		const message = localize('integrity.prompt', "Your {0} installation appears to be corrupt. Please reinstall.", this.productService.nameShort);
		if (checksumFailMoreInfoUrl) {
			this.notificationService.prompt(
				Severity.Warning,
				message,
				[
					{
						label: localize('integrity.moreInformation', "More Information"),
						run: () => this.openerService.open(URI.parse(checksumFailMoreInfoUrl))
					},
					{
						label: localize('integrity.dontShowAgain', "Don't Show Again"),
						isSecondary: true,
						run: () => this.storage.set({ dontShowPrompt: true, commit: this.productService.commit })
					}
				],
				{
					sticky: true,
					priority: NotificationPriority.URGENT
				}
			);
		} else {
			this.notificationService.notify({
				severity: Severity.Warning,
				message,
				sticky: true,
				priority: NotificationPriority.URGENT
			});
		}
	}
}

registerSingleton(IIntegrityService, IntegrityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keybindingService.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keybindingService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

// base
import * as browser from '../../../../base/browser/browser.js';
import { BrowserFeatures, KeyboardSupport } from '../../../../base/browser/canIUse.js';
import * as dom from '../../../../base/browser/dom.js';
import { printKeyboardEvent, printStandardKeyboardEvent, StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { DeferredPromise, RunOnceScheduler } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { parse } from '../../../../base/common/json.js';
import { IJSONSchema, TypeFromJsonSchema } from '../../../../base/common/jsonSchema.js';
import { UserSettingsLabelProvider } from '../../../../base/common/keybindingLabels.js';
import { KeybindingParser } from '../../../../base/common/keybindingParser.js';
import { Keybinding, KeyCodeChord, ResolvedKeybinding, ScanCodeChord } from '../../../../base/common/keybindings.js';
import { IMMUTABLE_CODE_TO_KEY_CODE, KeyCode, KeyCodeUtils, KeyMod, ScanCode, ScanCodeUtils } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import * as objects from '../../../../base/common/objects.js';
import { isMacintosh, OperatingSystem, OS } from '../../../../base/common/platform.js';
import { dirname } from '../../../../base/common/resources.js';

// platform
import { ILocalizedString, isLocalizedString } from '../../../../platform/action/common/action.js';
import { MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { FileOperation, IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Extensions, IJSONContributionRegistry } from '../../../../platform/jsonschemas/common/jsonContributionRegistry.js';
import { AbstractKeybindingService } from '../../../../platform/keybinding/common/abstractKeybindingService.js';
import { IKeybindingService, IKeyboardEvent, KeybindingsSchemaContribution } from '../../../../platform/keybinding/common/keybinding.js';
import { KeybindingResolver } from '../../../../platform/keybinding/common/keybindingResolver.js';
import { IExtensionKeybindingRule, IKeybindingItem, KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ResolvedKeybindingItem } from '../../../../platform/keybinding/common/resolvedKeybindingItem.js';
import { IKeyboardLayoutService } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';
import { IKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

// workbench
import { remove } from '../../../../base/common/arrays.js';
import { commandsExtensionPoint } from '../../actions/common/menusExtensionPoint.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { ExtensionMessageCollector, ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { IHostService } from '../../host/browser/host.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserKeybindingItem, KeybindingIO, OutputBuilder } from '../common/keybindingIO.js';
import { IKeyboard, INavigatorWithKeyboard } from './navigatorKeyboard.js';
import { getAllUnboundCommands } from './unboundCommands.js';

function isValidContributedKeyBinding(keyBinding: ContributedKeyBinding, rejects: string[]): boolean {
	if (!keyBinding) {
		rejects.push(nls.localize('nonempty', "expected non-empty value."));
		return false;
	}
	if (typeof keyBinding.command !== 'string') {
		rejects.push(nls.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
		return false;
	}
	if (keyBinding.key && typeof keyBinding.key !== 'string') {
		rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'key'));
		return false;
	}
	if (keyBinding.when && typeof keyBinding.when !== 'string') {
		rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
		return false;
	}
	if (keyBinding.mac && typeof keyBinding.mac !== 'string') {
		rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'mac'));
		return false;
	}
	if (keyBinding.linux && typeof keyBinding.linux !== 'string') {
		rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'linux'));
		return false;
	}
	if (keyBinding.win && typeof keyBinding.win !== 'string') {
		rejects.push(nls.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'win'));
		return false;
	}
	return true;
}

const keybindingType = {
	type: 'object',
	default: { command: '', key: '' },
	required: ['command', 'key'],
	properties: {
		command: {
			description: nls.localize('vscode.extension.contributes.keybindings.command', 'Identifier of the command to run when keybinding is triggered.'),
			type: 'string'
		},
		args: {
			description: nls.localize('vscode.extension.contributes.keybindings.args', "Arguments to pass to the command to execute.")
		},
		key: {
			description: nls.localize('vscode.extension.contributes.keybindings.key', 'Key or key sequence (separate keys with plus-sign and sequences with space, e.g. Ctrl+O and Ctrl+L L for a chord).'),
			type: 'string'
		},
		mac: {
			description: nls.localize('vscode.extension.contributes.keybindings.mac', 'Mac specific key or key sequence.'),
			type: 'string'
		},
		linux: {
			description: nls.localize('vscode.extension.contributes.keybindings.linux', 'Linux specific key or key sequence.'),
			type: 'string'
		},
		win: {
			description: nls.localize('vscode.extension.contributes.keybindings.win', 'Windows specific key or key sequence.'),
			type: 'string'
		},
		when: {
			description: nls.localize('vscode.extension.contributes.keybindings.when', 'Condition when the key is active.'),
			type: 'string'
		},
	}
} as const satisfies IJSONSchema;

type ContributedKeyBinding = TypeFromJsonSchema<typeof keybindingType>;

const keybindingsExtPoint = ExtensionsRegistry.registerExtensionPoint<ContributedKeyBinding | ContributedKeyBinding[]>({
	extensionPoint: 'keybindings',
	deps: [commandsExtensionPoint],
	jsonSchema: {
		description: nls.localize('vscode.extension.contributes.keybindings', "Contributes keybindings."),
		oneOf: [
			keybindingType,
			{
				type: 'array',
				items: keybindingType
			}
		]
	}
});

const NUMPAD_PRINTABLE_SCANCODES = [
	ScanCode.NumpadDivide,
	ScanCode.NumpadMultiply,
	ScanCode.NumpadSubtract,
	ScanCode.NumpadAdd,
	ScanCode.Numpad1,
	ScanCode.Numpad2,
	ScanCode.Numpad3,
	ScanCode.Numpad4,
	ScanCode.Numpad5,
	ScanCode.Numpad6,
	ScanCode.Numpad7,
	ScanCode.Numpad8,
	ScanCode.Numpad9,
	ScanCode.Numpad0,
	ScanCode.NumpadDecimal
];

const otherMacNumpadMapping = new Map<ScanCode, KeyCode>();
otherMacNumpadMapping.set(ScanCode.Numpad1, KeyCode.Digit1);
otherMacNumpadMapping.set(ScanCode.Numpad2, KeyCode.Digit2);
otherMacNumpadMapping.set(ScanCode.Numpad3, KeyCode.Digit3);
otherMacNumpadMapping.set(ScanCode.Numpad4, KeyCode.Digit4);
otherMacNumpadMapping.set(ScanCode.Numpad5, KeyCode.Digit5);
otherMacNumpadMapping.set(ScanCode.Numpad6, KeyCode.Digit6);
otherMacNumpadMapping.set(ScanCode.Numpad7, KeyCode.Digit7);
otherMacNumpadMapping.set(ScanCode.Numpad8, KeyCode.Digit8);
otherMacNumpadMapping.set(ScanCode.Numpad9, KeyCode.Digit9);
otherMacNumpadMapping.set(ScanCode.Numpad0, KeyCode.Digit0);

export class WorkbenchKeybindingService extends AbstractKeybindingService {

	private _keyboardMapper: IKeyboardMapper;
	private _cachedResolver: KeybindingResolver | null;
	private userKeybindings: UserKeybindings;
	private isComposingGlobalContextKey: IContextKey<boolean>;
	private _keybindingHoldMode: DeferredPromise<void> | null;
	private readonly _contributions: Array<{
		readonly listener?: IDisposable;
		readonly contribution: KeybindingsSchemaContribution;
	}> = [];
	private readonly kbsJsonSchema: KeybindingsJsonSchema;

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@ICommandService commandService: ICommandService,
		@ITelemetryService telemetryService: ITelemetryService,
		@INotificationService notificationService: INotificationService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IHostService private readonly hostService: IHostService,
		@IExtensionService extensionService: IExtensionService,
		@IFileService fileService: IFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
		@IKeyboardLayoutService private readonly keyboardLayoutService: IKeyboardLayoutService
	) {
		super(contextKeyService, commandService, telemetryService, notificationService, logService);

		this.isComposingGlobalContextKey = contextKeyService.createKey('isComposing', false);

		this.kbsJsonSchema = new KeybindingsJsonSchema();
		this.updateKeybindingsJsonSchema();

		this._keyboardMapper = this.keyboardLayoutService.getKeyboardMapper();
		this._register(this.keyboardLayoutService.onDidChangeKeyboardLayout(() => {
			this._keyboardMapper = this.keyboardLayoutService.getKeyboardMapper();
			this.updateResolver();
		}));

		this._keybindingHoldMode = null;
		this._cachedResolver = null;

		this.userKeybindings = this._register(new UserKeybindings(userDataProfileService, uriIdentityService, fileService, logService));
		this.userKeybindings.initialize().then(() => {
			if (this.userKeybindings.keybindings.length) {
				this.updateResolver();
			}
		});
		this._register(this.userKeybindings.onDidChange(() => {
			logService.debug('User keybindings changed');
			this.updateResolver();
		}));

		keybindingsExtPoint.setHandler((extensions) => {

			const keybindings: IExtensionKeybindingRule[] = [];
			for (const extension of extensions) {
				this._handleKeybindingsExtensionPointUser(extension.description.identifier, extension.description.isBuiltin, extension.value, extension.collector, keybindings);
			}

			KeybindingsRegistry.setExtensionKeybindings(keybindings);
			this.updateResolver();
		});

		this.updateKeybindingsJsonSchema();
		this._register(extensionService.onDidRegisterExtensions(() => this.updateKeybindingsJsonSchema()));

		this._register(Event.runAndSubscribe(dom.onDidRegisterWindow, ({ window, disposables }) => disposables.add(this._registerKeyListeners(window)), { window: mainWindow, disposables: this._store }));

		this._register(browser.onDidChangeFullscreen(windowId => {
			if (windowId !== mainWindow.vscodeWindowId) {
				return;
			}

			const keyboard: IKeyboard | null = (<INavigatorWithKeyboard>navigator).keyboard;

			if (BrowserFeatures.keyboard === KeyboardSupport.None) {
				return;
			}

			if (browser.isFullscreen(mainWindow)) {
				keyboard?.lock(['Escape']);
			} else {
				keyboard?.unlock();
			}

			// update resolver which will bring back all unbound keyboard shortcuts
			this._cachedResolver = null;
			this._onDidUpdateKeybindings.fire();
		}));
	}

	public override dispose(): void {
		this._contributions.forEach(c => c.listener?.dispose());
		this._contributions.length = 0;

		super.dispose();
	}

	private _registerKeyListeners(window: Window): IDisposable {
		const disposables = new DisposableStore();

		// for standard keybindings
		disposables.add(dom.addDisposableListener(window, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			if (this._keybindingHoldMode) {
				return;
			}
			this.isComposingGlobalContextKey.set(e.isComposing);
			const keyEvent = new StandardKeyboardEvent(e);
			this._log(`/ Received  keydown event - ${printKeyboardEvent(e)}`);
			this._log(`| Converted keydown event - ${printStandardKeyboardEvent(keyEvent)}`);
			const shouldPreventDefault = this._dispatch(keyEvent, keyEvent.target);
			if (shouldPreventDefault) {
				keyEvent.preventDefault();
			}
			this.isComposingGlobalContextKey.set(false);
		}));

		// for single modifier chord keybindings (e.g. shift shift)
		disposables.add(dom.addDisposableListener(window, dom.EventType.KEY_UP, (e: KeyboardEvent) => {
			this._resetKeybindingHoldMode();
			this.isComposingGlobalContextKey.set(e.isComposing);
			const keyEvent = new StandardKeyboardEvent(e);
			const shouldPreventDefault = this._singleModifierDispatch(keyEvent, keyEvent.target);
			if (shouldPreventDefault) {
				keyEvent.preventDefault();
			}
			this.isComposingGlobalContextKey.set(false);
		}));

		return disposables;
	}

	public registerSchemaContribution(contribution: KeybindingsSchemaContribution): IDisposable {
		const listener = contribution.onDidChange?.(() => this.updateKeybindingsJsonSchema());
		const entry = { listener, contribution };
		this._contributions.push(entry);

		this.updateKeybindingsJsonSchema();

		return toDisposable(() => {
			listener?.dispose();
			remove(this._contributions, entry);
			this.updateKeybindingsJsonSchema();
		});
	}

	private updateKeybindingsJsonSchema() {
		this.kbsJsonSchema.updateSchema(this._contributions.flatMap(x => x.contribution.getSchemaAdditions()));
	}

	private _printKeybinding(keybinding: Keybinding): string {
		return UserSettingsLabelProvider.toLabel(OS, keybinding.chords, (chord) => {
			if (chord instanceof KeyCodeChord) {
				return KeyCodeUtils.toString(chord.keyCode);
			}
			return ScanCodeUtils.toString(chord.scanCode);
		}) || '[null]';
	}

	private _printResolvedKeybinding(resolvedKeybinding: ResolvedKeybinding): string {
		return resolvedKeybinding.getDispatchChords().map(x => x || '[null]').join(' ');
	}

	private _printResolvedKeybindings(output: string[], input: string, resolvedKeybindings: ResolvedKeybinding[]): void {
		const padLength = 35;
		const firstRow = `${input.padStart(padLength, ' ')} => `;
		if (resolvedKeybindings.length === 0) {
			// no binding found
			output.push(`${firstRow}${'[NO BINDING]'.padStart(padLength, ' ')}`);
			return;
		}

		const firstRowIndentation = firstRow.length;
		const isFirst = true;
		for (const resolvedKeybinding of resolvedKeybindings) {
			if (isFirst) {
				output.push(`${firstRow}${this._printResolvedKeybinding(resolvedKeybinding).padStart(padLength, ' ')}`);
			} else {
				output.push(`${' '.repeat(firstRowIndentation)}${this._printResolvedKeybinding(resolvedKeybinding).padStart(padLength, ' ')}`);
			}
		}
	}

	private _dumpResolveKeybindingDebugInfo(): string {

		const seenBindings = new Set<string>();
		const result: string[] = [];

		result.push(`Default Resolved Keybindings (unique only):`);
		for (const item of KeybindingsRegistry.getDefaultKeybindings()) {
			if (!item.keybinding) {
				continue;
			}
			const input = this._printKeybinding(item.keybinding);
			if (seenBindings.has(input)) {
				continue;
			}
			seenBindings.add(input);
			const resolvedKeybindings = this._keyboardMapper.resolveKeybinding(item.keybinding);
			this._printResolvedKeybindings(result, input, resolvedKeybindings);
		}

		result.push(`User Resolved Keybindings (unique only):`);
		for (const item of this.userKeybindings.keybindings) {
			if (!item.keybinding) {
				continue;
			}
			const input = item._sourceKey ?? 'Impossible: missing source key, but has keybinding';
			if (seenBindings.has(input)) {
				continue;
			}
			seenBindings.add(input);
			const resolvedKeybindings = this._keyboardMapper.resolveKeybinding(item.keybinding);
			this._printResolvedKeybindings(result, input, resolvedKeybindings);
		}

		return result.join('\n');
	}

	public _dumpDebugInfo(): string {
		const layoutInfo = JSON.stringify(this.keyboardLayoutService.getCurrentKeyboardLayout(), null, '\t');
		const mapperInfo = this._keyboardMapper.dumpDebugInfo();
		const resolvedKeybindings = this._dumpResolveKeybindingDebugInfo();
		const rawMapping = JSON.stringify(this.keyboardLayoutService.getRawKeyboardMapping(), null, '\t');
		return `Layout info:\n${layoutInfo}\n\n${resolvedKeybindings}\n\n${mapperInfo}\n\nRaw mapping:\n${rawMapping}`;
	}

	public _dumpDebugInfoJSON(): string {
		const info = {
			layout: this.keyboardLayoutService.getCurrentKeyboardLayout(),
			rawMapping: this.keyboardLayoutService.getRawKeyboardMapping()
		};
		return JSON.stringify(info, null, '\t');
	}

	public override enableKeybindingHoldMode(commandId: string): Promise<void> | undefined {
		if (this._currentlyDispatchingCommandId !== commandId) {
			return undefined;
		}
		this._keybindingHoldMode = new DeferredPromise<void>();
		const focusTracker = dom.trackFocus(dom.getWindow(undefined));
		const listener = focusTracker.onDidBlur(() => this._resetKeybindingHoldMode());
		this._keybindingHoldMode.p.finally(() => {
			listener.dispose();
			focusTracker.dispose();
		});
		this._log(`+ Enabled hold-mode for ${commandId}.`);
		return this._keybindingHoldMode.p;
	}

	private _resetKeybindingHoldMode(): void {
		if (this._keybindingHoldMode) {
			this._keybindingHoldMode?.complete();
			this._keybindingHoldMode = null;
		}
	}

	public override customKeybindingsCount(): number {
		return this.userKeybindings.keybindings.length;
	}

	private updateResolver(): void {
		this._cachedResolver = null;
		this._onDidUpdateKeybindings.fire();
	}

	protected _getResolver(): KeybindingResolver {
		if (!this._cachedResolver) {
			const defaults = this._resolveKeybindingItems(KeybindingsRegistry.getDefaultKeybindings(), true);
			const overrides = this._resolveUserKeybindingItems(this.userKeybindings.keybindings, false);
			this._cachedResolver = new KeybindingResolver(defaults, overrides, (str) => this._log(str));
		}
		return this._cachedResolver;
	}

	protected _documentHasFocus(): boolean {
		// it is possible that the document has lost focus, but the
		// window is still focused, e.g. when a <webview> element
		// has focus
		return this.hostService.hasFocus;
	}

	private _resolveKeybindingItems(items: IKeybindingItem[], isDefault: boolean): ResolvedKeybindingItem[] {
		const result: ResolvedKeybindingItem[] = [];
		let resultLen = 0;
		for (const item of items) {
			const when = item.when || undefined;
			const keybinding = item.keybinding;
			if (!keybinding) {
				// This might be a removal keybinding item in user settings => accept it
				result[resultLen++] = new ResolvedKeybindingItem(undefined, item.command, item.commandArgs, when, isDefault, item.extensionId, item.isBuiltinExtension);
			} else {
				if (this._assertBrowserConflicts(keybinding)) {
					continue;
				}

				const resolvedKeybindings = this._keyboardMapper.resolveKeybinding(keybinding);
				for (let i = resolvedKeybindings.length - 1; i >= 0; i--) {
					const resolvedKeybinding = resolvedKeybindings[i];
					result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybinding, item.command, item.commandArgs, when, isDefault, item.extensionId, item.isBuiltinExtension);
				}
			}
		}

		return result;
	}

	private _resolveUserKeybindingItems(items: IUserKeybindingItem[], isDefault: boolean): ResolvedKeybindingItem[] {
		const result: ResolvedKeybindingItem[] = [];
		let resultLen = 0;
		for (const item of items) {
			const when = item.when || undefined;
			if (!item.keybinding) {
				// This might be a removal keybinding item in user settings => accept it
				result[resultLen++] = new ResolvedKeybindingItem(undefined, item.command, item.commandArgs, when, isDefault, null, false);
			} else {
				const resolvedKeybindings = this._keyboardMapper.resolveKeybinding(item.keybinding);
				for (const resolvedKeybinding of resolvedKeybindings) {
					result[resultLen++] = new ResolvedKeybindingItem(resolvedKeybinding, item.command, item.commandArgs, when, isDefault, null, false);
				}
			}
		}

		return result;
	}

	private _assertBrowserConflicts(keybinding: Keybinding): boolean {
		if (BrowserFeatures.keyboard === KeyboardSupport.Always) {
			return false;
		}

		if (BrowserFeatures.keyboard === KeyboardSupport.FullScreen && browser.isFullscreen(mainWindow)) {
			return false;
		}

		for (const chord of keybinding.chords) {
			if (!chord.metaKey && !chord.altKey && !chord.ctrlKey && !chord.shiftKey) {
				continue;
			}

			const modifiersMask = KeyMod.CtrlCmd | KeyMod.Alt | KeyMod.Shift;

			let partModifiersMask = 0;
			if (chord.metaKey) {
				partModifiersMask |= KeyMod.CtrlCmd;
			}

			if (chord.shiftKey) {
				partModifiersMask |= KeyMod.Shift;
			}

			if (chord.altKey) {
				partModifiersMask |= KeyMod.Alt;
			}

			if (chord.ctrlKey && OS === OperatingSystem.Macintosh) {
				partModifiersMask |= KeyMod.WinCtrl;
			}

			if ((partModifiersMask & modifiersMask) === (KeyMod.CtrlCmd | KeyMod.Alt)) {
				if (chord instanceof ScanCodeChord && (chord.scanCode === ScanCode.ArrowLeft || chord.scanCode === ScanCode.ArrowRight)) {
					// console.warn('Ctrl/Cmd+Arrow keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
					return true;
				}
				if (chord instanceof KeyCodeChord && (chord.keyCode === KeyCode.LeftArrow || chord.keyCode === KeyCode.RightArrow)) {
					// console.warn('Ctrl/Cmd+Arrow keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
					return true;
				}
			}

			if ((partModifiersMask & modifiersMask) === KeyMod.CtrlCmd) {
				if (chord instanceof ScanCodeChord && (chord.scanCode >= ScanCode.Digit1 && chord.scanCode <= ScanCode.Digit0)) {
					// console.warn('Ctrl/Cmd+Num keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
					return true;
				}
				if (chord instanceof KeyCodeChord && (chord.keyCode >= KeyCode.Digit0 && chord.keyCode <= KeyCode.Digit9)) {
					// console.warn('Ctrl/Cmd+Num keybindings should not be used by default in web. Offender: ', kb.getHashCode(), ' for ', commandId);
					return true;
				}
			}
		}

		return false;
	}

	public resolveKeybinding(kb: Keybinding): ResolvedKeybinding[] {
		return this._keyboardMapper.resolveKeybinding(kb);
	}

	public resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding {
		this.keyboardLayoutService.validateCurrentKeyboardMapping(keyboardEvent);
		return this._keyboardMapper.resolveKeyboardEvent(keyboardEvent);
	}

	public resolveUserBinding(userBinding: string): ResolvedKeybinding[] {
		const keybinding = KeybindingParser.parseKeybinding(userBinding);
		return (keybinding ? this._keyboardMapper.resolveKeybinding(keybinding) : []);
	}

	private _handleKeybindingsExtensionPointUser(extensionId: ExtensionIdentifier, isBuiltin: boolean, keybindings: ContributedKeyBinding | ContributedKeyBinding[], collector: ExtensionMessageCollector, result: IExtensionKeybindingRule[]): void {
		if (Array.isArray(keybindings)) {
			for (let i = 0, len = keybindings.length; i < len; i++) {
				this._handleKeybinding(extensionId, isBuiltin, i + 1, keybindings[i], collector, result);
			}
		} else {
			this._handleKeybinding(extensionId, isBuiltin, 1, keybindings, collector, result);
		}
	}

	private _handleKeybinding(extensionId: ExtensionIdentifier, isBuiltin: boolean, idx: number, keybindings: ContributedKeyBinding, collector: ExtensionMessageCollector, result: IExtensionKeybindingRule[]): void {

		const rejects: string[] = [];

		if (isValidContributedKeyBinding(keybindings, rejects)) {
			const rule = this._asCommandRule(extensionId, isBuiltin, idx++, keybindings);
			if (rule) {
				result.push(rule);
			}
		}

		if (rejects.length > 0) {
			collector.error(nls.localize(
				'invalid.keybindings',
				"Invalid `contributes.{0}`: {1}",
				keybindingsExtPoint.name,
				rejects.join('\n')
			));
		}
	}

	private static bindToCurrentPlatform(key: string | undefined, mac: string | undefined, linux: string | undefined, win: string | undefined): string | undefined {
		if (OS === OperatingSystem.Windows && win) {
			if (win) {
				return win;
			}
		} else if (OS === OperatingSystem.Macintosh) {
			if (mac) {
				return mac;
			}
		} else {
			if (linux) {
				return linux;
			}
		}
		return key;
	}

	private _asCommandRule(extensionId: ExtensionIdentifier, isBuiltin: boolean, idx: number, binding: ContributedKeyBinding): IExtensionKeybindingRule | undefined {

		const { command, args, when, key, mac, linux, win } = binding;
		const keybinding = WorkbenchKeybindingService.bindToCurrentPlatform(key, mac, linux, win);
		if (!keybinding) {
			return undefined;
		}

		let weight: number;
		if (isBuiltin) {
			weight = KeybindingWeight.BuiltinExtension + idx;
		} else {
			weight = KeybindingWeight.ExternalExtension + idx;
		}

		const commandAction = MenuRegistry.getCommand(command);
		const precondition = commandAction && commandAction.precondition;
		let fullWhen: ContextKeyExpression | undefined;
		if (when && precondition) {
			fullWhen = ContextKeyExpr.and(precondition, ContextKeyExpr.deserialize(when));
		} else if (when) {
			fullWhen = ContextKeyExpr.deserialize(when);
		} else if (precondition) {
			fullWhen = precondition;
		}

		const desc: IExtensionKeybindingRule = {
			id: command,
			args,
			when: fullWhen,
			weight: weight,
			keybinding: KeybindingParser.parseKeybinding(keybinding),
			extensionId: extensionId.value,
			isBuiltinExtension: isBuiltin
		};
		return desc;
	}

	public override getDefaultKeybindingsContent(): string {
		const resolver = this._getResolver();
		const defaultKeybindings = resolver.getDefaultKeybindings();
		const boundCommands = resolver.getDefaultBoundCommands();
		return (
			WorkbenchKeybindingService._getDefaultKeybindings(defaultKeybindings)
			+ '\n\n'
			+ WorkbenchKeybindingService._getAllCommandsAsComment(boundCommands)
		);
	}

	private static _getDefaultKeybindings(defaultKeybindings: readonly ResolvedKeybindingItem[]): string {
		const out = new OutputBuilder();
		out.writeLine('[');

		const lastIndex = defaultKeybindings.length - 1;
		defaultKeybindings.forEach((k, index) => {
			KeybindingIO.writeKeybindingItem(out, k);
			if (index !== lastIndex) {
				out.writeLine(',');
			} else {
				out.writeLine();
			}
		});
		out.writeLine(']');
		return out.toString();
	}

	private static _getAllCommandsAsComment(boundCommands: Map<string, boolean>): string {
		const unboundCommands = getAllUnboundCommands(boundCommands);
		const pretty = unboundCommands.sort().join('\n// - ');
		return '// ' + nls.localize('unboundCommands', "Here are other available commands: ") + '\n// - ' + pretty;
	}

	override mightProducePrintableCharacter(event: IKeyboardEvent): boolean {
		if (event.ctrlKey || event.metaKey || event.altKey) {
			// ignore ctrl/cmd/alt-combination but not shift-combinatios
			return false;
		}
		const code = ScanCodeUtils.toEnum(event.code);

		if (NUMPAD_PRINTABLE_SCANCODES.indexOf(code) !== -1) {
			// This is a numpad key that might produce a printable character based on NumLock.
			// Let's check if NumLock is on or off based on the event's keyCode.
			// e.g.
			// - when NumLock is off, ScanCode.Numpad4 produces KeyCode.LeftArrow
			// - when NumLock is on, ScanCode.Numpad4 produces KeyCode.NUMPAD_4
			// However, ScanCode.NumpadAdd always produces KeyCode.NUMPAD_ADD
			if (event.keyCode === IMMUTABLE_CODE_TO_KEY_CODE[code]) {
				// NumLock is on or this is /, *, -, + on the numpad
				return true;
			}
			if (isMacintosh && event.keyCode === otherMacNumpadMapping.get(code)) {
				// on macOS, the numpad keys can also map to keys 1 - 0.
				return true;
			}
			return false;
		}

		const keycode = IMMUTABLE_CODE_TO_KEY_CODE[code];
		if (keycode !== -1) {
			// https://github.com/microsoft/vscode/issues/74934
			return false;
		}
		// consult the KeyboardMapperFactory to check the given event for
		// a printable value.
		const mapping = this.keyboardLayoutService.getRawKeyboardMapping();
		if (!mapping) {
			return false;
		}
		const keyInfo = mapping[event.code];
		if (!keyInfo) {
			return false;
		}
		if (!keyInfo.value || /\s/.test(keyInfo.value)) {
			return false;
		}
		return true;
	}
}

class UserKeybindings extends Disposable {

	private _rawKeybindings: Object[] = [];
	private _keybindings: IUserKeybindingItem[] = [];
	get keybindings(): IUserKeybindingItem[] { return this._keybindings; }

	private readonly reloadConfigurationScheduler: RunOnceScheduler;

	private readonly watchDisposables = this._register(new DisposableStore());

	private readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor(
		private readonly userDataProfileService: IUserDataProfileService,
		private readonly uriIdentityService: IUriIdentityService,
		private readonly fileService: IFileService,
		logService: ILogService,
	) {
		super();

		this.watch();

		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.reload().then(changed => {
			if (changed) {
				this._onDidChange.fire();
			}
		}), 50));

		this._register(Event.filter(this.fileService.onDidFilesChange, e => e.contains(this.userDataProfileService.currentProfile.keybindingsResource))(() => {
			logService.debug('Keybindings file changed');
			this.reloadConfigurationScheduler.schedule();
		}));

		this._register(this.fileService.onDidRunOperation((e) => {
			if (e.operation === FileOperation.WRITE && e.resource.toString() === this.userDataProfileService.currentProfile.keybindingsResource.toString()) {
				logService.debug('Keybindings file written');
				this.reloadConfigurationScheduler.schedule();
			}
		}));

		this._register(userDataProfileService.onDidChangeCurrentProfile(e => {
			if (!this.uriIdentityService.extUri.isEqual(e.previous.keybindingsResource, e.profile.keybindingsResource)) {
				e.join(this.whenCurrentProfileChanged());
			}
		}));
	}

	private async whenCurrentProfileChanged(): Promise<void> {
		this.watch();
		this.reloadConfigurationScheduler.schedule();
	}

	private watch(): void {
		this.watchDisposables.clear();
		this.watchDisposables.add(this.fileService.watch(dirname(this.userDataProfileService.currentProfile.keybindingsResource)));
		// Also listen to the resource incase the resource is a symlink - https://github.com/microsoft/vscode/issues/118134
		this.watchDisposables.add(this.fileService.watch(this.userDataProfileService.currentProfile.keybindingsResource));
	}

	async initialize(): Promise<void> {
		await this.reload();
	}

	private async reload(): Promise<boolean> {
		const newKeybindings = await this.readUserKeybindings();
		if (objects.equals(this._rawKeybindings, newKeybindings)) {
			// no change
			return false;
		}

		this._rawKeybindings = newKeybindings;
		this._keybindings = this._rawKeybindings.map((k) => KeybindingIO.readUserKeybindingItem(k));
		return true;
	}

	private async readUserKeybindings(): Promise<Object[]> {
		try {
			const content = await this.fileService.readFile(this.userDataProfileService.currentProfile.keybindingsResource);
			const value = parse(content.value.toString());
			return Array.isArray(value)
				? value.filter(v => v && typeof v === 'object' /* just typeof === object doesn't catch `null` */)
				: [];
		} catch (e) {
			return [];
		}
	}
}

/**
 * Registers the `keybindings.json`'s schema with the JSON schema registry. Allows updating the schema, e.g., when new commands are registered (e.g., by extensions).
 *
 * Lifecycle owned by `WorkbenchKeybindingService`. Must be instantiated only once.
 */
class KeybindingsJsonSchema {

	private static readonly schemaId = 'vscode://schemas/keybindings';

	private readonly commandsSchemas: IJSONSchema[] = [];
	private readonly commandsEnum: string[] = [];
	private readonly removalCommandsEnum: string[] = [];
	private readonly commandsEnumDescriptions: string[] = [];
	private readonly schema: IJSONSchema = {
		id: KeybindingsJsonSchema.schemaId,
		type: 'array',
		title: nls.localize('keybindings.json.title', "Keybindings configuration"),
		allowTrailingCommas: true,
		allowComments: true,
		definitions: {
			'editorGroupsSchema': {
				'type': 'array',
				'items': {
					'type': 'object',
					'properties': {
						'groups': {
							'$ref': '#/definitions/editorGroupsSchema',
							'default': [{}, {}]
						},
						'size': {
							'type': 'number',
							'default': 0.5
						}
					}
				}
			},
			'commandNames': {
				'type': 'string',
				'enum': this.commandsEnum,
				'enumDescriptions': this.commandsEnumDescriptions,
				'description': nls.localize('keybindings.json.command', "Name of the command to execute"),
			},
			'commandType': {
				'anyOf': [ // repetition of this clause here and below is intentional: one is for nice diagnostics & one is for code completion
					{
						$ref: '#/definitions/commandNames'
					},
					{
						'type': 'string',
						'enum': this.removalCommandsEnum,
						'enumDescriptions': this.commandsEnumDescriptions,
						'description': nls.localize('keybindings.json.removalCommand', "Name of the command to remove keyboard shortcut for"),
					},
					{
						'type': 'string'
					},
				]
			},
			'commandsSchemas': {
				'allOf': this.commandsSchemas
			}
		},
		items: {
			'required': ['key'],
			'type': 'object',
			'defaultSnippets': [{ 'body': { 'key': '$1', 'command': '$2', 'when': '$3' } }],
			'properties': {
				'key': {
					'type': 'string',
					'description': nls.localize('keybindings.json.key', "Key or key sequence (separated by space)"),
				},
				'command': {
					'anyOf': [
						{
							'if': {
								'type': 'array'
							},
							'then': {
								'not': {
									'type': 'array'
								},
								'errorMessage': nls.localize('keybindings.commandsIsArray', "Incorrect type. Expected \"{0}\". The field 'command' does not support running multiple commands. Use command 'runCommands' to pass it multiple commands to run.", 'string')
							},
							'else': {
								'$ref': '#/definitions/commandType'
							}
						},
						{
							'$ref': '#/definitions/commandType'
						}
					]
				},
				'when': {
					'type': 'string',
					'description': nls.localize('keybindings.json.when', "Condition when the key is active.")
				},
				'args': {
					'description': nls.localize('keybindings.json.args', "Arguments to pass to the command to execute.")
				}
			},
			'$ref': '#/definitions/commandsSchemas'
		}
	};

	private readonly schemaRegistry = Registry.as<IJSONContributionRegistry>(Extensions.JSONContribution);

	constructor() {
		this.schemaRegistry.registerSchema(KeybindingsJsonSchema.schemaId, this.schema);
	}

	// TODO@ulugbekna: can updates happen incrementally rather than rebuilding; concerns:
	// - is just appending additional schemas enough for the registry to pick them up?
	// - can `CommandsRegistry.getCommands` and `MenuRegistry.getCommands` return different values at different times? ie would just pushing new schemas from `additionalContributions` not be enough?
	updateSchema(additionalContributions: readonly IJSONSchema[]) {
		this.commandsSchemas.length = 0;
		this.commandsEnum.length = 0;
		this.removalCommandsEnum.length = 0;
		this.commandsEnumDescriptions.length = 0;

		const knownCommands = new Set<string>();
		const addKnownCommand = (commandId: string, description?: string | ILocalizedString | undefined) => {
			if (!/^_/.test(commandId)) {
				if (!knownCommands.has(commandId)) {
					knownCommands.add(commandId);

					this.commandsEnum.push(commandId);
					this.commandsEnumDescriptions.push(
						description === undefined
							? '' // `enumDescriptions` is an array of strings, so we can't use undefined
							: (isLocalizedString(description) ? description.value : description)
					);

					// Also add the negative form for keybinding removal
					this.removalCommandsEnum.push(`-${commandId}`);
				}
			}
		};

		const allCommands = CommandsRegistry.getCommands();
		for (const [commandId, command] of allCommands) {
			const commandMetadata = command.metadata;

			addKnownCommand(commandId, commandMetadata?.description ?? MenuRegistry.getCommand(commandId)?.title);

			if (!commandMetadata || !commandMetadata.args || commandMetadata.args.length !== 1 || !commandMetadata.args[0].schema) {
				continue;
			}

			const argsSchema = commandMetadata.args[0].schema;
			const argsRequired = (
				(typeof commandMetadata.args[0].isOptional !== 'undefined')
					? (!commandMetadata.args[0].isOptional)
					: (Array.isArray(argsSchema.required) && argsSchema.required.length > 0)
			);
			const addition = {
				'if': {
					'required': ['command'],
					'properties': {
						'command': { 'const': commandId }
					}
				},
				'then': {
					'required': (<string[]>[]).concat(argsRequired ? ['args'] : []),
					'properties': {
						'args': argsSchema
					}
				}
			};

			this.commandsSchemas.push(addition);
		}

		const menuCommands = MenuRegistry.getCommands();
		for (const commandId of menuCommands.keys()) {
			addKnownCommand(commandId);
		}

		this.commandsSchemas.push(...additionalContributions);
		this.schemaRegistry.notifySchemaChanged(KeybindingsJsonSchema.schemaId);
	}
}

registerSingleton(IKeybindingService, WorkbenchKeybindingService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayoutService.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayoutService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { AppResourcePath, FileAccess } from '../../../../base/common/network.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { KeymapInfo, IRawMixedKeyboardMapping, IKeymapInfo } from '../common/keymapInfo.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { DispatchConfig, readKeyboardConfig } from '../../../../platform/keyboardLayout/common/keyboardConfig.js';
import { IKeyboardMapper, CachedKeyboardMapper } from '../../../../platform/keyboardLayout/common/keyboardMapper.js';
import { OS, OperatingSystem, isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { WindowsKeyboardMapper } from '../common/windowsKeyboardMapper.js';
import { FallbackKeyboardMapper } from '../common/fallbackKeyboardMapper.js';
import { IKeyboardEvent } from '../../../../platform/keybinding/common/keybinding.js';
import { MacLinuxKeyboardMapper } from '../common/macLinuxKeyboardMapper.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { RunOnceScheduler } from '../../../../base/common/async.js';
import { parse, getNodeType } from '../../../../base/common/json.js';
import * as objects from '../../../../base/common/objects.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as ConfigExtensions, IConfigurationRegistry, IConfigurationNode } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { INavigatorWithKeyboard } from './navigatorKeyboard.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { getKeyboardLayoutId, IKeyboardLayoutInfo, IKeyboardLayoutService, IKeyboardMapping, IMacLinuxKeyboardMapping, IWindowsKeyboardMapping } from '../../../../platform/keyboardLayout/common/keyboardLayout.js';

export class BrowserKeyboardMapperFactoryBase extends Disposable {
	// keyboard mapper
	protected _initialized: boolean;
	protected _keyboardMapper: IKeyboardMapper | null;
	private readonly _onDidChangeKeyboardMapper = new Emitter<void>();
	public readonly onDidChangeKeyboardMapper: Event<void> = this._onDidChangeKeyboardMapper.event;

	// keymap infos
	protected _keymapInfos: KeymapInfo[];
	protected _mru: KeymapInfo[];
	private _activeKeymapInfo: KeymapInfo | null;
	private keyboardLayoutMapAllowed: boolean = (navigator as INavigatorWithKeyboard).keyboard !== undefined;

	get activeKeymap(): KeymapInfo | null {
		return this._activeKeymapInfo;
	}

	get keymapInfos(): KeymapInfo[] {
		return this._keymapInfos;
	}

	get activeKeyboardLayout(): IKeyboardLayoutInfo | null {
		if (!this._initialized) {
			return null;
		}

		return this._activeKeymapInfo?.layout ?? null;
	}

	get activeKeyMapping(): IKeyboardMapping | null {
		if (!this._initialized) {
			return null;
		}

		return this._activeKeymapInfo?.mapping ?? null;
	}

	get keyboardLayouts(): IKeyboardLayoutInfo[] {
		return this._keymapInfos.map(keymapInfo => keymapInfo.layout);
	}

	protected constructor(
		private readonly _configurationService: IConfigurationService,
		// private _notificationService: INotificationService,
		// private _storageService: IStorageService,
		// private _commandService: ICommandService
	) {
		super();
		this._keyboardMapper = null;
		this._initialized = false;
		this._keymapInfos = [];
		this._mru = [];
		this._activeKeymapInfo = null;

		if ((<INavigatorWithKeyboard>navigator).keyboard && (<INavigatorWithKeyboard>navigator).keyboard.addEventListener) {
			(<INavigatorWithKeyboard>navigator).keyboard.addEventListener!('layoutchange', () => {
				// Update user keyboard map settings
				this._getBrowserKeyMapping().then((mapping: IKeyboardMapping | null) => {
					if (this.isKeyMappingActive(mapping)) {
						return;
					}

					this.setLayoutFromBrowserAPI();
				});
			});
		}

		this._register(this._configurationService.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('keyboard')) {
				this._keyboardMapper = null;
				this._onDidChangeKeyboardMapper.fire();
			}
		}));
	}

	registerKeyboardLayout(layout: KeymapInfo) {
		this._keymapInfos.push(layout);
		this._mru = this._keymapInfos;
	}

	removeKeyboardLayout(layout: KeymapInfo): void {
		let index = this._mru.indexOf(layout);
		this._mru.splice(index, 1);
		index = this._keymapInfos.indexOf(layout);
		this._keymapInfos.splice(index, 1);
	}

	getMatchedKeymapInfo(keyMapping: IKeyboardMapping | null): { result: KeymapInfo; score: number } | null {
		if (!keyMapping) {
			return null;
		}

		const usStandard = this.getUSStandardLayout();

		if (usStandard) {
			let maxScore = usStandard.getScore(keyMapping);
			if (maxScore === 0) {
				return {
					result: usStandard,
					score: 0
				};
			}

			let result = usStandard;
			for (let i = 0; i < this._mru.length; i++) {
				const score = this._mru[i].getScore(keyMapping);
				if (score > maxScore) {
					if (score === 0) {
						return {
							result: this._mru[i],
							score: 0
						};
					}

					maxScore = score;
					result = this._mru[i];
				}
			}

			return {
				result,
				score: maxScore
			};
		}

		for (let i = 0; i < this._mru.length; i++) {
			if (this._mru[i].fuzzyEqual(keyMapping)) {
				return {
					result: this._mru[i],
					score: 0
				};
			}
		}

		return null;
	}

	getUSStandardLayout() {
		const usStandardLayouts = this._mru.filter(layout => layout.layout.isUSStandard);

		if (usStandardLayouts.length) {
			return usStandardLayouts[0];
		}

		return null;
	}

	isKeyMappingActive(keymap: IKeyboardMapping | null) {
		return this._activeKeymapInfo && keymap && this._activeKeymapInfo.fuzzyEqual(keymap);
	}

	setUSKeyboardLayout() {
		this._activeKeymapInfo = this.getUSStandardLayout();
	}

	setActiveKeyMapping(keymap: IKeyboardMapping | null) {
		let keymapUpdated = false;
		const matchedKeyboardLayout = this.getMatchedKeymapInfo(keymap);
		if (matchedKeyboardLayout) {
			// let score = matchedKeyboardLayout.score;

			// Due to https://bugs.chromium.org/p/chromium/issues/detail?id=977609, any key after a dead key will generate a wrong mapping,
			// we shoud avoid yielding the false error.
			// if (keymap && score < 0) {
			// const donotAskUpdateKey = 'missing.keyboardlayout.donotask';
			// if (this._storageService.getBoolean(donotAskUpdateKey, StorageScope.APPLICATION)) {
			// 	return;
			// }

			// the keyboard layout doesn't actually match the key event or the keymap from chromium
			// this._notificationService.prompt(
			// 	Severity.Info,
			// 	nls.localize('missing.keyboardlayout', 'Fail to find matching keyboard layout'),
			// 	[{
			// 		label: nls.localize('keyboardLayoutMissing.configure', "Configure"),
			// 		run: () => this._commandService.executeCommand('workbench.action.openKeyboardLayoutPicker')
			// 	}, {
			// 		label: nls.localize('neverAgain', "Don't Show Again"),
			// 		isSecondary: true,
			// 		run: () => this._storageService.store(donotAskUpdateKey, true, StorageScope.APPLICATION)
			// 	}]
			// );

			// console.warn('Active keymap/keyevent does not match current keyboard layout', JSON.stringify(keymap), this._activeKeymapInfo ? JSON.stringify(this._activeKeymapInfo.layout) : '');

			// return;
			// }

			if (!this._activeKeymapInfo) {
				this._activeKeymapInfo = matchedKeyboardLayout.result;
				keymapUpdated = true;
			} else if (keymap) {
				if (matchedKeyboardLayout.result.getScore(keymap) > this._activeKeymapInfo.getScore(keymap)) {
					this._activeKeymapInfo = matchedKeyboardLayout.result;
					keymapUpdated = true;
				}
			}
		}

		if (!this._activeKeymapInfo) {
			this._activeKeymapInfo = this.getUSStandardLayout();
			keymapUpdated = true;
		}

		if (!this._activeKeymapInfo || !keymapUpdated) {
			return;
		}

		const index = this._mru.indexOf(this._activeKeymapInfo);

		this._mru.splice(index, 1);
		this._mru.unshift(this._activeKeymapInfo);

		this._setKeyboardData(this._activeKeymapInfo);
	}

	setActiveKeymapInfo(keymapInfo: KeymapInfo) {
		this._activeKeymapInfo = keymapInfo;

		const index = this._mru.indexOf(this._activeKeymapInfo);

		if (index === 0) {
			return;
		}

		this._mru.splice(index, 1);
		this._mru.unshift(this._activeKeymapInfo);

		this._setKeyboardData(this._activeKeymapInfo);
	}

	public setLayoutFromBrowserAPI(): void {
		this._updateKeyboardLayoutAsync(this._initialized);
	}

	private _updateKeyboardLayoutAsync(initialized: boolean, keyboardEvent?: IKeyboardEvent) {
		if (!initialized) {
			return;
		}

		this._getBrowserKeyMapping(keyboardEvent).then(keyMap => {
			// might be false positive
			if (this.isKeyMappingActive(keyMap)) {
				return;
			}
			this.setActiveKeyMapping(keyMap);
		});
	}

	public getKeyboardMapper(): IKeyboardMapper {
		const config = readKeyboardConfig(this._configurationService);
		if (config.dispatch === DispatchConfig.KeyCode || !this._initialized || !this._activeKeymapInfo) {
			// Forcefully set to use keyCode
			return new FallbackKeyboardMapper(config.mapAltGrToCtrlAlt, OS);
		}
		if (!this._keyboardMapper) {
			this._keyboardMapper = new CachedKeyboardMapper(BrowserKeyboardMapperFactory._createKeyboardMapper(this._activeKeymapInfo, config.mapAltGrToCtrlAlt));
		}
		return this._keyboardMapper;
	}

	public validateCurrentKeyboardMapping(keyboardEvent: IKeyboardEvent): void {
		if (!this._initialized) {
			return;
		}

		const isCurrentKeyboard = this._validateCurrentKeyboardMapping(keyboardEvent);

		if (isCurrentKeyboard) {
			return;
		}

		this._updateKeyboardLayoutAsync(true, keyboardEvent);
	}

	public setKeyboardLayout(layoutName: string) {
		const matchedLayouts: KeymapInfo[] = this.keymapInfos.filter(keymapInfo => getKeyboardLayoutId(keymapInfo.layout) === layoutName);

		if (matchedLayouts.length > 0) {
			this.setActiveKeymapInfo(matchedLayouts[0]);
		}
	}

	private _setKeyboardData(keymapInfo: KeymapInfo): void {
		this._initialized = true;

		this._keyboardMapper = null;
		this._onDidChangeKeyboardMapper.fire();
	}

	private static _createKeyboardMapper(keymapInfo: KeymapInfo, mapAltGrToCtrlAlt: boolean): IKeyboardMapper {
		const rawMapping = keymapInfo.mapping;
		const isUSStandard = !!keymapInfo.layout.isUSStandard;
		if (OS === OperatingSystem.Windows) {
			return new WindowsKeyboardMapper(isUSStandard, <IWindowsKeyboardMapping>rawMapping, mapAltGrToCtrlAlt);
		}
		if (Object.keys(rawMapping).length === 0) {
			// Looks like reading the mappings failed (most likely Mac + Japanese/Chinese keyboard layouts)
			return new FallbackKeyboardMapper(mapAltGrToCtrlAlt, OS);
		}

		return new MacLinuxKeyboardMapper(isUSStandard, <IMacLinuxKeyboardMapping>rawMapping, mapAltGrToCtrlAlt, OS);
	}

	//#region Browser API
	private _validateCurrentKeyboardMapping(keyboardEvent: IKeyboardEvent): boolean {
		if (!this._initialized) {
			return true;
		}

		const standardKeyboardEvent = keyboardEvent as StandardKeyboardEvent;
		const currentKeymap = this._activeKeymapInfo;
		if (!currentKeymap) {
			return true;
		}

		if (standardKeyboardEvent.browserEvent.key === 'Dead' || standardKeyboardEvent.browserEvent.isComposing) {
			return true;
		}

		const mapping = currentKeymap.mapping[standardKeyboardEvent.code];

		if (!mapping) {
			return false;
		}

		if (mapping.value === '') {
			// The value is empty when the key is not a printable character, we skip validation.
			if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
				setTimeout(() => {
					this._getBrowserKeyMapping().then((keymap: IRawMixedKeyboardMapping | null) => {
						if (this.isKeyMappingActive(keymap)) {
							return;
						}

						this.setLayoutFromBrowserAPI();
					});
				}, 350);
			}
			return true;
		}

		const expectedValue = standardKeyboardEvent.altKey && standardKeyboardEvent.shiftKey ? mapping.withShiftAltGr :
			standardKeyboardEvent.altKey ? mapping.withAltGr :
				standardKeyboardEvent.shiftKey ? mapping.withShift : mapping.value;

		const isDead = (standardKeyboardEvent.altKey && standardKeyboardEvent.shiftKey && mapping.withShiftAltGrIsDeadKey) ||
			(standardKeyboardEvent.altKey && mapping.withAltGrIsDeadKey) ||
			(standardKeyboardEvent.shiftKey && mapping.withShiftIsDeadKey) ||
			mapping.valueIsDeadKey;

		if (isDead && standardKeyboardEvent.browserEvent.key !== 'Dead') {
			return false;
		}

		// TODO, this assumption is wrong as `browserEvent.key` doesn't necessarily equal expectedValue from real keymap
		if (!isDead && standardKeyboardEvent.browserEvent.key !== expectedValue) {
			return false;
		}

		return true;
	}

	private async _getBrowserKeyMapping(keyboardEvent?: IKeyboardEvent): Promise<IRawMixedKeyboardMapping | null> {
		if (this.keyboardLayoutMapAllowed) {
			try {
				return await (navigator as INavigatorWithKeyboard).keyboard.getLayoutMap().then((e: any) => {
					const ret: IKeyboardMapping = {};
					for (const key of e) {
						ret[key[0]] = {
							'value': key[1],
							'withShift': '',
							'withAltGr': '',
							'withShiftAltGr': ''
						};
					}

					return ret;

					// const matchedKeyboardLayout = this.getMatchedKeymapInfo(ret);

					// if (matchedKeyboardLayout) {
					// 	return matchedKeyboardLayout.result.mapping;
					// }

					// return null;
				});
			} catch {
				// getLayoutMap can throw if invoked from a nested browsing context
				this.keyboardLayoutMapAllowed = false;
			}
		}
		if (keyboardEvent && !keyboardEvent.shiftKey && !keyboardEvent.altKey && !keyboardEvent.metaKey && !keyboardEvent.metaKey) {
			const ret: IKeyboardMapping = {};
			const standardKeyboardEvent = keyboardEvent as StandardKeyboardEvent;
			ret[standardKeyboardEvent.browserEvent.code] = {
				'value': standardKeyboardEvent.browserEvent.key,
				'withShift': '',
				'withAltGr': '',
				'withShiftAltGr': ''
			};

			const matchedKeyboardLayout = this.getMatchedKeymapInfo(ret);

			if (matchedKeyboardLayout) {
				return ret;
			}

			return null;
		}

		return null;
	}

	//#endregion
}

export class BrowserKeyboardMapperFactory extends BrowserKeyboardMapperFactoryBase {
	constructor(configurationService: IConfigurationService, notificationService: INotificationService, storageService: IStorageService, commandService: ICommandService) {
		// super(notificationService, storageService, commandService);
		super(configurationService);

		const platform = isWindows ? 'win' : isMacintosh ? 'darwin' : 'linux';

		import(FileAccess.asBrowserUri(`vs/workbench/services/keybinding/browser/keyboardLayouts/layout.contribution.${platform}.js` satisfies AppResourcePath).path).then((m) => {
			const keymapInfos: IKeymapInfo[] = m.KeyboardLayoutContribution.INSTANCE.layoutInfos;
			this._keymapInfos.push(...keymapInfos.map(info => (new KeymapInfo(info.layout, info.secondaryLayouts, info.mapping, info.isUserKeyboardLayout))));
			this._mru = this._keymapInfos;
			this._initialized = true;
			this.setLayoutFromBrowserAPI();
		});
	}
}

class UserKeyboardLayout extends Disposable {

	private readonly reloadConfigurationScheduler: RunOnceScheduler;
	protected readonly _onDidChange: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private _keyboardLayout: KeymapInfo | null;
	get keyboardLayout(): KeymapInfo | null { return this._keyboardLayout; }

	constructor(
		private readonly keyboardLayoutResource: URI,
		private readonly fileService: IFileService
	) {
		super();

		this._keyboardLayout = null;

		this.reloadConfigurationScheduler = this._register(new RunOnceScheduler(() => this.reload().then(changed => {
			if (changed) {
				this._onDidChange.fire();
			}
		}), 50));

		this._register(Event.filter(this.fileService.onDidFilesChange, e => e.contains(this.keyboardLayoutResource))(() => this.reloadConfigurationScheduler.schedule()));
	}

	async initialize(): Promise<void> {
		await this.reload();
	}

	private async reload(): Promise<boolean> {
		const existing = this._keyboardLayout;
		try {
			const content = await this.fileService.readFile(this.keyboardLayoutResource);
			const value = parse(content.value.toString());
			if (getNodeType(value) === 'object') {
				const layoutInfo = value.layout;
				const mappings = value.rawMapping;
				this._keyboardLayout = KeymapInfo.createKeyboardLayoutFromDebugInfo(layoutInfo, mappings, true);
			} else {
				this._keyboardLayout = null;
			}
		} catch (e) {
			this._keyboardLayout = null;
		}

		return existing ? !objects.equals(existing, this._keyboardLayout) : true;
	}

}

export class BrowserKeyboardLayoutService extends Disposable implements IKeyboardLayoutService {
	public _serviceBrand: undefined;

	private readonly _onDidChangeKeyboardLayout = new Emitter<void>();
	public readonly onDidChangeKeyboardLayout: Event<void> = this._onDidChangeKeyboardLayout.event;

	private _userKeyboardLayout: UserKeyboardLayout;

	private readonly _factory: BrowserKeyboardMapperFactory;
	private _keyboardLayoutMode: string;

	constructor(
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@INotificationService notificationService: INotificationService,
		@IStorageService storageService: IStorageService,
		@ICommandService commandService: ICommandService,
		@IConfigurationService private configurationService: IConfigurationService,
	) {
		super();
		const keyboardConfig = configurationService.getValue<{ layout: string }>('keyboard');
		const layout = keyboardConfig.layout;
		this._keyboardLayoutMode = layout ?? 'autodetect';
		this._factory = new BrowserKeyboardMapperFactory(configurationService, notificationService, storageService, commandService);

		this._register(this._factory.onDidChangeKeyboardMapper(() => {
			this._onDidChangeKeyboardLayout.fire();
		}));

		if (layout && layout !== 'autodetect') {
			// set keyboard layout
			this._factory.setKeyboardLayout(layout);
		}

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('keyboard.layout')) {
				const keyboardConfig = configurationService.getValue<{ layout: string }>('keyboard');
				const layout = keyboardConfig.layout;
				this._keyboardLayoutMode = layout;

				if (layout === 'autodetect') {
					this._factory.setLayoutFromBrowserAPI();
				} else {
					this._factory.setKeyboardLayout(layout);
				}
			}
		}));

		this._userKeyboardLayout = new UserKeyboardLayout(environmentService.keyboardLayoutResource, fileService);
		this._userKeyboardLayout.initialize().then(() => {
			if (this._userKeyboardLayout.keyboardLayout) {
				this._factory.registerKeyboardLayout(this._userKeyboardLayout.keyboardLayout);

				this.setUserKeyboardLayoutIfMatched();
			}
		});

		this._register(this._userKeyboardLayout.onDidChange(() => {
			const userKeyboardLayouts = this._factory.keymapInfos.filter(layout => layout.isUserKeyboardLayout);

			if (userKeyboardLayouts.length) {
				if (this._userKeyboardLayout.keyboardLayout) {
					userKeyboardLayouts[0].update(this._userKeyboardLayout.keyboardLayout);
				} else {
					this._factory.removeKeyboardLayout(userKeyboardLayouts[0]);
				}
			} else {
				if (this._userKeyboardLayout.keyboardLayout) {
					this._factory.registerKeyboardLayout(this._userKeyboardLayout.keyboardLayout);
				}
			}

			this.setUserKeyboardLayoutIfMatched();
		}));
	}

	setUserKeyboardLayoutIfMatched() {
		const keyboardConfig = this.configurationService.getValue<{ layout: string }>('keyboard');
		const layout = keyboardConfig.layout;

		if (layout && this._userKeyboardLayout.keyboardLayout) {
			if (getKeyboardLayoutId(this._userKeyboardLayout.keyboardLayout.layout) === layout && this._factory.activeKeymap) {

				if (!this._userKeyboardLayout.keyboardLayout.equal(this._factory.activeKeymap)) {
					this._factory.setActiveKeymapInfo(this._userKeyboardLayout.keyboardLayout);
				}
			}
		}
	}

	getKeyboardMapper(): IKeyboardMapper {
		return this._factory.getKeyboardMapper();
	}

	public getCurrentKeyboardLayout(): IKeyboardLayoutInfo | null {
		return this._factory.activeKeyboardLayout;
	}

	public getAllKeyboardLayouts(): IKeyboardLayoutInfo[] {
		return this._factory.keyboardLayouts;
	}

	public getRawKeyboardMapping(): IKeyboardMapping | null {
		return this._factory.activeKeyMapping;
	}

	public validateCurrentKeyboardMapping(keyboardEvent: IKeyboardEvent): void {
		if (this._keyboardLayoutMode !== 'autodetect') {
			return;
		}

		this._factory.validateCurrentKeyboardMapping(keyboardEvent);
	}
}

registerSingleton(IKeyboardLayoutService, BrowserKeyboardLayoutService, InstantiationType.Delayed);

// Configuration
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigExtensions.Configuration);
const keyboardConfiguration: IConfigurationNode = {
	'id': 'keyboard',
	'order': 15,
	'type': 'object',
	'title': nls.localize('keyboardConfigurationTitle', "Keyboard"),
	'properties': {
		'keyboard.layout': {
			'type': 'string',
			'default': 'autodetect',
			'description': nls.localize('keyboard.layout.config', "Control the keyboard layout used in web.")
		}
	}
};

configurationRegistry.registerConfiguration(keyboardConfiguration);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/navigatorKeyboard.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/navigatorKeyboard.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IKeyboard {
	getLayoutMap(): Promise<Object>;
	lock(keyCodes?: string[]): Promise<void>;
	unlock(): void;
	addEventListener?(type: string, listener: () => void): void;

}
export type INavigatorWithKeyboard = Navigator & {
	keyboard: IKeyboard;
};
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/unboundCommands.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/unboundCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CommandsRegistry, ICommandMetadata } from '../../../../platform/commands/common/commands.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { MenuRegistry, MenuId, isIMenuItem } from '../../../../platform/actions/common/actions.js';

export function getAllUnboundCommands(boundCommands: Map<string, boolean>): string[] {
	const unboundCommands: string[] = [];
	const seenMap: Map<string, boolean> = new Map<string, boolean>();
	const addCommand = (id: string, includeCommandWithArgs: boolean) => {
		if (seenMap.has(id)) {
			return;
		}
		seenMap.set(id, true);
		if (id[0] === '_' || id.indexOf('vscode.') === 0) { // private command
			return;
		}
		if (boundCommands.get(id) === true) {
			return;
		}
		if (!includeCommandWithArgs) {
			const command = CommandsRegistry.getCommand(id);
			if (command && typeof command.metadata === 'object'
				&& isNonEmptyArray((<ICommandMetadata>command.metadata).args)) { // command with args
				return;
			}
		}
		unboundCommands.push(id);
	};

	// Add all commands from Command Palette
	for (const menuItem of MenuRegistry.getMenuItems(MenuId.CommandPalette)) {
		if (isIMenuItem(menuItem)) {
			addCommand(menuItem.command.id, true);
		}
	}

	// Add all editor actions
	for (const editorAction of EditorExtensionsRegistry.getEditorActions()) {
		addCommand(editorAction.id, true);
	}

	for (const id of CommandsRegistry.getCommands().keys()) {
		addCommand(id, false);
	}

	return unboundCommands;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/cz.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/cz.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';

KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000405', id: '', text: 'Czech' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '{', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '&', '', 0, 'VK_C'],
		KeyD: ['d', 'D', 'Đ', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '[', '', 0, 'VK_F'],
		KeyG: ['g', 'G', ']', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', 'ł', '', 0, 'VK_K'],
		KeyL: ['l', 'L', 'Ł', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '}', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '\\', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', 'đ', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '@', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '|', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '#', '', 0, 'VK_X'],
		KeyY: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyZ: ['y', 'Y', '', '', 0, 'VK_Y'],
		Digit1: ['+', '1', '~', '', 0, 'VK_1'],
		Digit2: ['ě', '2', 'ˇ', '', 0, 'VK_2'],
		Digit3: ['š', '3', '^', '', 0, 'VK_3'],
		Digit4: ['č', '4', '˘', '', 0, 'VK_4'],
		Digit5: ['ř', '5', '°', '', 0, 'VK_5'],
		Digit6: ['ž', '6', '˛', '', 0, 'VK_6'],
		Digit7: ['ý', '7', '`', '', 0, 'VK_7'],
		Digit8: ['á', '8', '˙', '', 0, 'VK_8'],
		Digit9: ['í', '9', '´', '', 0, 'VK_9'],
		Digit0: ['é', '0', '˝', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['=', '%', '¨', '', 0, 'VK_OEM_PLUS'],
		Equal: ['´', 'ˇ', '¸', '', 0, 'VK_OEM_2'],
		BracketLeft: ['ú', '/', '÷', '', 0, 'VK_OEM_4'],
		BracketRight: [')', '(', '×', '', 0, 'VK_OEM_6'],
		Backslash: ['¨', '\'', '¤', '', 0, 'VK_OEM_5'],
		Semicolon: ['ů', '"', '$', '', 0, 'VK_OEM_1'],
		Quote: ['§', '!', 'ß', '', 0, 'VK_OEM_7'],
		Backquote: [';', '°', '', '', 0, 'VK_OEM_3'],
		Comma: [',', '?', '<', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '>', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '*', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['\\', '|', '', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/de-swiss.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/de-swiss.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000807', id: '', text: 'Swiss German' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', '', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyZ: ['y', 'Y', '', '', 0, 'VK_Y'],
		Digit1: ['1', '+', '¦', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '*', '#', '', 0, 'VK_3'],
		Digit4: ['4', 'ç', '°', '', 0, 'VK_4'],
		Digit5: ['5', '%', '§', '', 0, 'VK_5'],
		Digit6: ['6', '&', '¬', '', 0, 'VK_6'],
		Digit7: ['7', '/', '|', '', 0, 'VK_7'],
		Digit8: ['8', '(', '¢', '', 0, 'VK_8'],
		Digit9: ['9', ')', '', '', 0, 'VK_9'],
		Digit0: ['0', '=', '', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['\'', '?', '´', '', 0, 'VK_OEM_4'],
		Equal: ['^', '`', '~', '', 0, 'VK_OEM_6'],
		BracketLeft: ['ü', 'è', '[', '', 0, 'VK_OEM_1'],
		BracketRight: ['¨', '!', ']', '', 0, 'VK_OEM_3'],
		Backslash: ['$', '£', '}', '', 0, 'VK_OEM_8'],
		Semicolon: ['ö', 'é', '', '', 0, 'VK_OEM_7'],
		Quote: ['ä', 'à', '{', '', 0, 'VK_OEM_5'],
		Backquote: ['§', '°', '', '', 0, 'VK_OEM_2'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '\\', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.darwin.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.darwin.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.German', lang: 'de', localizedName: 'German' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', '‹', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', '™', 0],
		KeyE: ['e', 'E', '€', '‰', 0],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', 'Ì', 0],
		KeyH: ['h', 'H', 'ª', 'Ó', 0],
		KeyI: ['i', 'I', '⁄', 'Û', 0],
		KeyJ: ['j', 'J', 'º', 'ı', 0],
		KeyK: ['k', 'K', '∆', 'ˆ', 0],
		KeyL: ['l', 'L', '@', 'ﬂ', 0],
		KeyM: ['m', 'M', 'µ', '˘', 0],
		KeyN: ['n', 'N', '~', '›', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', '«', '»', 0],
		KeyR: ['r', 'R', '®', '¸', 0],
		KeyS: ['s', 'S', '‚', 'Í', 0],
		KeyT: ['t', 'T', '†', '˝', 0],
		KeyU: ['u', 'U', '¨', 'Á', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', 'Ù', 0],
		KeyY: ['z', 'Z', 'Ω', 'ˇ', 0],
		KeyZ: ['y', 'Y', '¥', '‡', 0],
		Digit1: ['1', '!', '¡', '¬', 0],
		Digit2: ['2', '"', '“', '”', 0],
		Digit3: ['3', '§', '¶', '#', 0],
		Digit4: ['4', '$', '¢', '£', 0],
		Digit5: ['5', '%', '[', 'ﬁ', 0],
		Digit6: ['6', '&', ']', '^', 8],
		Digit7: ['7', '/', '|', '\\', 0],
		Digit8: ['8', '(', '{', '˜', 0],
		Digit9: ['9', ')', '}', '·', 0],
		Digit0: ['0', '=', '≠', '¯', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['ß', '?', '¿', '˙', 0],
		Equal: ['´', '`', '\'', '˚', 3],
		BracketLeft: ['ü', 'Ü', '•', '°', 0],
		BracketRight: ['+', '*', '±', '', 0],
		Backslash: ['#', '\'', '‘', '’', 0],
		Semicolon: ['ö', 'Ö', 'œ', 'Œ', 0],
		Quote: ['ä', 'Ä', 'æ', 'Æ', 0],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [',', ';', '∞', '˛', 0],
		Period: ['.', ':', '…', '÷', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', ',', '.', '.', 0],
		IntlBackslash: ['^', '°', '„', '“', 1],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.linux.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.linux.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { model: 'pc104', group: 0, layout: 'de', variant: '', options: '', rules: 'base' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', 'æ', 'Æ', 0],
		KeyB: ['b', 'B', '“', '‘', 0],
		KeyC: ['c', 'C', '¢', '©', 0],
		KeyD: ['d', 'D', 'ð', 'Ð', 0],
		KeyE: ['e', 'E', '€', '€', 0],
		KeyF: ['f', 'F', 'đ', 'ª', 0],
		KeyG: ['g', 'G', 'ŋ', 'Ŋ', 0],
		KeyH: ['h', 'H', 'ħ', 'Ħ', 0],
		KeyI: ['i', 'I', '→', 'ı', 0],
		KeyJ: ['j', 'J', '̣', '̇', 0],
		KeyK: ['k', 'K', 'ĸ', '&', 0],
		KeyL: ['l', 'L', 'ł', 'Ł', 0],
		KeyM: ['m', 'M', 'µ', 'º', 0],
		KeyN: ['n', 'N', '”', '’', 0],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'þ', 'Þ', 0],
		KeyQ: ['q', 'Q', '@', 'Ω', 0],
		KeyR: ['r', 'R', '¶', '®', 0],
		KeyS: ['s', 'S', 'ſ', 'ẞ', 0],
		KeyT: ['t', 'T', 'ŧ', 'Ŧ', 0],
		KeyU: ['u', 'U', '↓', '↑', 0],
		KeyV: ['v', 'V', '„', '‚', 0],
		KeyW: ['w', 'W', 'ł', 'Ł', 0],
		KeyX: ['x', 'X', '«', '‹', 0],
		KeyY: ['z', 'Z', '←', '¥', 0],
		KeyZ: ['y', 'Y', '»', '›', 0],
		Digit1: ['1', '!', '¹', '¡', 0],
		Digit2: ['2', '"', '²', '⅛', 0],
		Digit3: ['3', '§', '³', '£', 0],
		Digit4: ['4', '$', '¼', '¤', 0],
		Digit5: ['5', '%', '½', '⅜', 0],
		Digit6: ['6', '&', '¬', '⅝', 0],
		Digit7: ['7', '/', '{', '⅞', 0],
		Digit8: ['8', '(', '[', '™', 0],
		Digit9: ['9', ')', ']', '±', 0],
		Digit0: ['0', '=', '}', '°', 0],
		Enter: ['\r', '\r', '\r', '\r', 0],
		Escape: ['\u001b', '\u001b', '\u001b', '\u001b', 0],
		Backspace: ['\b', '\b', '\b', '\b', 0],
		Tab: ['\t', '', '\t', '', 0],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['ß', '?', '\\', '¿', 0],
		Equal: ['́', '̀', '̧', '̨', 0],
		BracketLeft: ['ü', 'Ü', '̈', '̊', 0],
		BracketRight: ['+', '*', '~', '¯', 0],
		Backslash: ['#', '\'', '’', '̆', 0],
		Semicolon: ['ö', 'Ö', '̋', '̣', 0],
		Quote: ['ä', 'Ä', '̂', '̌', 0],
		Backquote: ['̂', '°', '′', '″', 0],
		Comma: [',', ';', '·', '×', 0],
		Period: ['.', ':', '…', '÷', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: ['', '', '', '', 0],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: ['/', '/', '/', '/', 0],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: [],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['', '1', '', '1', 0],
		Numpad2: ['', '2', '', '2', 0],
		Numpad3: ['', '3', '', '3', 0],
		Numpad4: ['', '4', '', '4', 0],
		Numpad5: ['', '5', '', '5', 0],
		Numpad6: ['', '6', '', '6', 0],
		Numpad7: ['', '7', '', '7', 0],
		Numpad8: ['', '8', '', '8', 0],
		Numpad9: ['', '9', '', '9', 0],
		Numpad0: ['', '0', '', '0', 0],
		NumpadDecimal: ['', ',', '', ',', 0],
		IntlBackslash: ['<', '>', '|', '̱', 0],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Open: [],
		Help: [],
		Select: [],
		Again: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		Find: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		Lang5: [],
		NumpadParenLeft: [],
		NumpadParenRight: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: ['\r', '\r', '\r', '\r', 0],
		MetaRight: ['.', '.', '.', '.', 0],
		BrightnessUp: [],
		BrightnessDown: [],
		MediaPlay: [],
		MediaRecord: [],
		MediaFastForward: [],
		MediaRewind: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		SelectTask: [],
		LaunchScreenSaver: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: [],
		MailReply: [],
		MailForward: [],
		MailSend: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/de.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000407', id: '', text: 'German' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', 'µ', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '@', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['z', 'Z', '', '', 0, 'VK_Z'],
		KeyZ: ['y', 'Y', '', '', 0, 'VK_Y'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '²', '', 0, 'VK_2'],
		Digit3: ['3', '§', '³', '', 0, 'VK_3'],
		Digit4: ['4', '$', '', '', 0, 'VK_4'],
		Digit5: ['5', '%', '', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['ß', '?', '\\', 'ẞ', 0, 'VK_OEM_4'],
		Equal: ['´', '`', '', '', 0, 'VK_OEM_6'],
		BracketLeft: ['ü', 'Ü', '', '', 0, 'VK_OEM_1'],
		BracketRight: ['+', '*', '~', '', 0, 'VK_OEM_PLUS'],
		Backslash: ['#', '\'', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['ö', 'Ö', '', '', 0, 'VK_OEM_3'],
		Quote: ['ä', 'Ä', '', '', 0, 'VK_OEM_7'],
		Backquote: ['^', '°', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '|', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/keybinding/browser/keyboardLayouts/dk.win.ts]---
Location: vscode-main/src/vs/workbench/services/keybinding/browser/keyboardLayouts/dk.win.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from './_.contribution.js';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { name: '00000406', id: '', text: 'Danish' },
	secondaryLayouts: [],
	mapping: {
		Sleep: [],
		WakeUp: [],
		KeyA: ['a', 'A', '', '', 0, 'VK_A'],
		KeyB: ['b', 'B', '', '', 0, 'VK_B'],
		KeyC: ['c', 'C', '', '', 0, 'VK_C'],
		KeyD: ['d', 'D', '', '', 0, 'VK_D'],
		KeyE: ['e', 'E', '€', '', 0, 'VK_E'],
		KeyF: ['f', 'F', '', '', 0, 'VK_F'],
		KeyG: ['g', 'G', '', '', 0, 'VK_G'],
		KeyH: ['h', 'H', '', '', 0, 'VK_H'],
		KeyI: ['i', 'I', '', '', 0, 'VK_I'],
		KeyJ: ['j', 'J', '', '', 0, 'VK_J'],
		KeyK: ['k', 'K', '', '', 0, 'VK_K'],
		KeyL: ['l', 'L', '', '', 0, 'VK_L'],
		KeyM: ['m', 'M', 'µ', '', 0, 'VK_M'],
		KeyN: ['n', 'N', '', '', 0, 'VK_N'],
		KeyO: ['o', 'O', '', '', 0, 'VK_O'],
		KeyP: ['p', 'P', '', '', 0, 'VK_P'],
		KeyQ: ['q', 'Q', '', '', 0, 'VK_Q'],
		KeyR: ['r', 'R', '', '', 0, 'VK_R'],
		KeyS: ['s', 'S', '', '', 0, 'VK_S'],
		KeyT: ['t', 'T', '', '', 0, 'VK_T'],
		KeyU: ['u', 'U', '', '', 0, 'VK_U'],
		KeyV: ['v', 'V', '', '', 0, 'VK_V'],
		KeyW: ['w', 'W', '', '', 0, 'VK_W'],
		KeyX: ['x', 'X', '', '', 0, 'VK_X'],
		KeyY: ['y', 'Y', '', '', 0, 'VK_Y'],
		KeyZ: ['z', 'Z', '', '', 0, 'VK_Z'],
		Digit1: ['1', '!', '', '', 0, 'VK_1'],
		Digit2: ['2', '"', '@', '', 0, 'VK_2'],
		Digit3: ['3', '#', '£', '', 0, 'VK_3'],
		Digit4: ['4', '¤', '$', '', 0, 'VK_4'],
		Digit5: ['5', '%', '€', '', 0, 'VK_5'],
		Digit6: ['6', '&', '', '', 0, 'VK_6'],
		Digit7: ['7', '/', '{', '', 0, 'VK_7'],
		Digit8: ['8', '(', '[', '', 0, 'VK_8'],
		Digit9: ['9', ')', ']', '', 0, 'VK_9'],
		Digit0: ['0', '=', '}', '', 0, 'VK_0'],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', '', '', 0, 'VK_SPACE'],
		Minus: ['+', '?', '', '', 0, 'VK_OEM_PLUS'],
		Equal: ['´', '`', '|', '', 0, 'VK_OEM_4'],
		BracketLeft: ['å', 'Å', '', '', 0, 'VK_OEM_6'],
		BracketRight: ['¨', '^', '~', '', 0, 'VK_OEM_1'],
		Backslash: ['\'', '*', '', '', 0, 'VK_OEM_2'],
		Semicolon: ['æ', 'Æ', '', '', 0, 'VK_OEM_3'],
		Quote: ['ø', 'Ø', '', '', 0, 'VK_OEM_7'],
		Backquote: ['½', '§', '', '', 0, 'VK_OEM_5'],
		Comma: [',', ';', '', '', 0, 'VK_OEM_COMMA'],
		Period: ['.', ':', '', '', 0, 'VK_OEM_PERIOD'],
		Slash: ['-', '_', '', '', 0, 'VK_OEM_MINUS'],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		PrintScreen: [],
		ScrollLock: [],
		Pause: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '', '', 0, 'VK_DIVIDE'],
		NumpadMultiply: ['*', '*', '', '', 0, 'VK_MULTIPLY'],
		NumpadSubtract: ['-', '-', '', '', 0, 'VK_SUBTRACT'],
		NumpadAdd: ['+', '+', '', '', 0, 'VK_ADD'],
		NumpadEnter: [],
		Numpad1: [],
		Numpad2: [],
		Numpad3: [],
		Numpad4: [],
		Numpad5: [],
		Numpad6: [],
		Numpad7: [],
		Numpad8: [],
		Numpad9: [],
		Numpad0: [],
		NumpadDecimal: [],
		IntlBackslash: ['<', '>', '\\', '', 0, 'VK_OEM_102'],
		ContextMenu: [],
		Power: [],
		NumpadEqual: [],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		F21: [],
		F22: [],
		F23: [],
		F24: [],
		Help: [],
		Undo: [],
		Cut: [],
		Copy: [],
		Paste: [],
		AudioVolumeMute: [],
		AudioVolumeUp: [],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		Convert: [],
		NonConvert: [],
		Lang1: [],
		Lang2: [],
		Lang3: [],
		Lang4: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: [],
		MediaTrackNext: [],
		MediaTrackPrevious: [],
		MediaStop: [],
		Eject: [],
		MediaPlayPause: [],
		MediaSelect: [],
		LaunchMail: [],
		LaunchApp2: [],
		LaunchApp1: [],
		BrowserSearch: [],
		BrowserHome: [],
		BrowserBack: [],
		BrowserForward: [],
		BrowserStop: [],
		BrowserRefresh: [],
		BrowserFavorites: []
	}

});
```

--------------------------------------------------------------------------------

````
