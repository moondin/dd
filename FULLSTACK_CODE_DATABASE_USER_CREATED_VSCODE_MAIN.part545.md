---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 545
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 545 of 552)

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

---[FILE: src/vs/workbench/test/browser/parts/editor/resourceEditorInput.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/resourceEditorInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService } from '../../workbenchTestServices.js';
import { AbstractResourceEditorInput } from '../../../../common/editor/resourceEditorInput.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { EditorInputCapabilities, Verbosity } from '../../../../common/editor.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IFilesConfigurationService } from '../../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ITextResourceConfigurationService } from '../../../../../editor/common/services/textResourceConfiguration.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { CustomEditorLabelService, ICustomEditorLabelService } from '../../../../services/editor/common/customEditorLabelService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IWorkspaceContextService } from '../../../../../platform/workspace/common/workspace.js';

suite('ResourceEditorInput', () => {

	const disposables = new DisposableStore();

	class TestResourceEditorInput extends AbstractResourceEditorInput {

		readonly typeId = 'test.typeId';

		constructor(
			resource: URI,
			@ILabelService labelService: ILabelService,
			@IFileService fileService: IFileService,
			@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
			@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
			@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService
		) {
			super(resource, resource, labelService, fileService, filesConfigurationService, textResourceConfigurationService, customEditorLabelService);
		}
	}

	async function createServices(): Promise<[IInstantiationService, TestConfigurationService, CustomEditorLabelService]> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const testConfigurationService = new TestConfigurationService();
		instantiationService.stub(IConfigurationService, testConfigurationService);

		const customEditorLabelService = disposables.add(new CustomEditorLabelService(testConfigurationService, instantiationService.get(IWorkspaceContextService)));
		instantiationService.stub(ICustomEditorLabelService, customEditorLabelService);

		return [instantiationService, testConfigurationService, customEditorLabelService];
	}

	teardown(() => {
		disposables.clear();
	});

	test('basics', async () => {
		const [instantiationService] = await createServices();

		const resource = URI.from({ scheme: 'testResource', path: 'thePath/of/the/resource.txt' });

		const input = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource));

		assert.ok(input.getName().length > 0);

		assert.ok(input.getDescription(Verbosity.SHORT)!.length > 0);
		assert.ok(input.getDescription(Verbosity.MEDIUM)!.length > 0);
		assert.ok(input.getDescription(Verbosity.LONG)!.length > 0);

		assert.ok(input.getTitle(Verbosity.SHORT).length > 0);
		assert.ok(input.getTitle(Verbosity.MEDIUM).length > 0);
		assert.ok(input.getTitle(Verbosity.LONG).length > 0);

		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.isReadonly(), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Untitled), true);
	});

	test('custom editor name', async () => {
		const [instantiationService, testConfigurationService, customEditorLabelService] = await createServices();

		const resource1 = URI.from({ scheme: 'testResource', path: 'thePath/of/the/resource.txt' });
		const resource2 = URI.from({ scheme: 'testResource', path: 'theOtherPath/of/the/resource.md' });

		const input1 = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource1));
		const input2 = disposables.add(instantiationService.createInstance(TestResourceEditorInput, resource2));

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS, {
			'**/theOtherPath/**': 'Label 1',
			'**/*.txt': 'Label 2',
			'**/resource.txt': 'Label 3',
		});
		// eslint-disable-next-line local/code-no-any-casts
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_PATTERNS; }, source: ConfigurationTarget.USER } as any);

		let label1Name: string = '';
		let label2Name = '';
		disposables.add(customEditorLabelService.onDidChange(() => {
			label1Name = input1.getName();
			label2Name = input2.getName();
		}));

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, true);
		// eslint-disable-next-line local/code-no-any-casts
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'Label 3');
		assert.ok(label2Name === 'Label 1');

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, false);
		// eslint-disable-next-line local/code-no-any-casts
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'resource.txt' as string);
		assert.ok(label2Name === 'resource.md' as string);

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_ENABLED, true);
		// eslint-disable-next-line local/code-no-any-casts
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_ENABLED; }, source: ConfigurationTarget.USER } as any);

		await testConfigurationService.setUserConfiguration(CustomEditorLabelService.SETTING_ID_PATTERNS, {
			'thePath/**/resource.txt': 'Label 4',
			'thePath/of/*/resource.txt': 'Label 5',
		});
		// eslint-disable-next-line local/code-no-any-casts
		testConfigurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration(configuration: string) { return configuration === CustomEditorLabelService.SETTING_ID_PATTERNS; }, source: ConfigurationTarget.USER } as any);

		assert.ok(label1Name === 'Label 5' as string);
		assert.ok(label2Name === 'resource.md' as string);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/sideBySideEditorInput.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/sideBySideEditorInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { EditorResourceAccessor, IResourceSideBySideEditorInput, isResourceSideBySideEditorInput, isSideBySideEditorInput, IUntypedEditorInput } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../../../common/editor/sideBySideEditorInput.js';
import { TestFileEditorInput, workbenchInstantiationService } from '../../workbenchTestServices.js';

suite('SideBySideEditorInput', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	class MyEditorInput extends EditorInput {

		constructor(public resource: URI | undefined = undefined) {
			super();
		}

		fireCapabilitiesChangeEvent(): void {
			this._onDidChangeCapabilities.fire();
		}

		fireDirtyChangeEvent(): void {
			this._onDidChangeDirty.fire();
		}

		fireLabelChangeEvent(): void {
			this._onDidChangeLabel.fire();
		}

		override get typeId(): string { return 'myEditorInput'; }
		override resolve(): any { return null; }

		override toUntyped() {
			return { resource: this.resource, options: { override: this.typeId } };
		}

		override matches(otherInput: EditorInput | IUntypedEditorInput): boolean {
			if (super.matches(otherInput)) {
				return true;
			}

			const resource = EditorResourceAccessor.getCanonicalUri(otherInput);
			return resource?.toString() === this.resource?.toString();
		}
	}

	test('basics', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		let counter = 0;
		const input = disposables.add(new MyEditorInput(URI.file('/fake')));
		disposables.add(input.onWillDispose(() => {
			assert(true);
			counter++;
		}));

		const otherInput = disposables.add(new MyEditorInput(URI.file('/fake2')));
		disposables.add(otherInput.onWillDispose(() => {
			assert(true);
			counter++;
		}));

		const sideBySideInput = disposables.add(instantiationService.createInstance(SideBySideEditorInput, 'name', 'description', input, otherInput));
		assert.strictEqual(sideBySideInput.getName(), 'name');
		assert.strictEqual(sideBySideInput.getDescription(), 'description');

		assert.ok(isSideBySideEditorInput(sideBySideInput));
		assert.ok(!isSideBySideEditorInput(input));

		assert.strictEqual(sideBySideInput.secondary, input);
		assert.strictEqual(sideBySideInput.primary, otherInput);
		assert(sideBySideInput.matches(sideBySideInput));
		assert(!sideBySideInput.matches(otherInput));

		sideBySideInput.dispose();
		assert.strictEqual(counter, 0);

		const sideBySideInputSame = disposables.add(instantiationService.createInstance(SideBySideEditorInput, undefined, undefined, input, input));
		assert.strictEqual(sideBySideInputSame.getName(), input.getName());
		assert.strictEqual(sideBySideInputSame.getDescription(), input.getDescription());
		assert.strictEqual(sideBySideInputSame.getTitle(), input.getTitle());
		assert.strictEqual(sideBySideInputSame.resource?.toString(), input.resource?.toString());
	});

	test('events dispatching', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const input = disposables.add(new MyEditorInput());
		const otherInput = disposables.add(new MyEditorInput());

		const sideBySideInut = disposables.add(instantiationService.createInstance(SideBySideEditorInput, 'name', 'description', otherInput, input));

		assert.ok(isSideBySideEditorInput(sideBySideInut));

		let capabilitiesChangeCounter = 0;
		disposables.add(sideBySideInut.onDidChangeCapabilities(() => capabilitiesChangeCounter++));

		let dirtyChangeCounter = 0;
		disposables.add(sideBySideInut.onDidChangeDirty(() => dirtyChangeCounter++));

		let labelChangeCounter = 0;
		disposables.add(sideBySideInut.onDidChangeLabel(() => labelChangeCounter++));

		input.fireCapabilitiesChangeEvent();
		assert.strictEqual(capabilitiesChangeCounter, 1);

		otherInput.fireCapabilitiesChangeEvent();
		assert.strictEqual(capabilitiesChangeCounter, 2);

		input.fireDirtyChangeEvent();
		otherInput.fireDirtyChangeEvent();
		assert.strictEqual(dirtyChangeCounter, 1);

		input.fireLabelChangeEvent();
		otherInput.fireLabelChangeEvent();
		assert.strictEqual(labelChangeCounter, 2);
	});

	test('toUntyped', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const primaryInput = disposables.add(new MyEditorInput(URI.file('/fake')));
		const secondaryInput = disposables.add(new MyEditorInput(URI.file('/fake2')));

		const sideBySideInput = disposables.add(instantiationService.createInstance(SideBySideEditorInput, 'Side By Side Test', undefined, secondaryInput, primaryInput));

		const untypedSideBySideInput = sideBySideInput.toUntyped();
		assert.ok(isResourceSideBySideEditorInput(untypedSideBySideInput));
	});

	test('untyped matches', () => {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const primaryInput = disposables.add(new TestFileEditorInput(URI.file('/fake'), 'primaryId'));
		const secondaryInput = disposables.add(new TestFileEditorInput(URI.file('/fake2'), 'secondaryId'));
		const sideBySideInput = disposables.add(instantiationService.createInstance(SideBySideEditorInput, 'Side By Side Test', undefined, secondaryInput, primaryInput));

		const primaryUntypedInput = { resource: URI.file('/fake'), options: { override: 'primaryId' } };
		const secondaryUntypedInput = { resource: URI.file('/fake2'), options: { override: 'secondaryId' } };
		const sideBySideUntyped: IResourceSideBySideEditorInput = { primary: primaryUntypedInput, secondary: secondaryUntypedInput };

		assert.ok(sideBySideInput.matches(sideBySideUntyped));

		const primaryUntypedInput2 = { resource: URI.file('/fake'), options: { override: 'primaryIdWrong' } };
		const secondaryUntypedInput2 = { resource: URI.file('/fake2'), options: { override: 'secondaryId' } };
		const sideBySideUntyped2: IResourceSideBySideEditorInput = { primary: primaryUntypedInput2, secondary: secondaryUntypedInput2 };

		assert.ok(!sideBySideInput.matches(sideBySideUntyped2));

		const primaryUntypedInput3 = { resource: URI.file('/fake'), options: { override: 'primaryId' } };
		const secondaryUntypedInput3 = { resource: URI.file('/fake2Wrong'), options: { override: 'secondaryId' } };
		const sideBySideUntyped3: IResourceSideBySideEditorInput = { primary: primaryUntypedInput3, secondary: secondaryUntypedInput3 };

		assert.ok(!sideBySideInput.matches(sideBySideUntyped3));
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/textEditorPane.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/textEditorPane.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite, toResource } from '../../../../../base/test/common/utils.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { workbenchInstantiationService, TestServiceAccessor, registerTestFileEditor, createEditorPart, TestTextFileEditor } from '../../workbenchTestServices.js';
import { IResolvedTextFileEditorModel } from '../../../../services/textfile/common/textfiles.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { EditorService } from '../../../../services/editor/browser/editorService.js';
import { EditorPaneSelectionChangeReason, EditorPaneSelectionCompareResult, IEditorPaneSelectionChangeEvent, isEditorPaneWithSelection } from '../../../../common/editor.js';
import { DeferredPromise } from '../../../../../base/common/async.js';
import { TextEditorPaneSelection } from '../../../../browser/parts/editor/textEditor.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { IEditorOptions } from '../../../../../platform/editor/common/editor.js';

suite('TextEditorPane', () => {

	const disposables = new DisposableStore();

	setup(() => {
		disposables.add(registerTestFileEditor());
	});

	teardown(() => {
		disposables.clear();
	});

	async function createServices(): Promise<TestServiceAccessor> {
		const instantiationService = workbenchInstantiationService(undefined, disposables);

		const part = await createEditorPart(instantiationService, disposables);
		instantiationService.stub(IEditorGroupsService, part);

		const editorService = disposables.add(instantiationService.createInstance(EditorService, undefined));
		instantiationService.stub(IEditorService, editorService);

		return instantiationService.createInstance(TestServiceAccessor);
	}

	test('editor pane selection', async function () {
		const accessor = await createServices();

		const resource = toResource.call(this, '/path/index.txt');
		let pane = (await accessor.editorService.openEditor({ resource }) as TestTextFileEditor);

		assert.ok(pane && isEditorPaneWithSelection(pane));

		const onDidFireSelectionEventOfEditType = new DeferredPromise<IEditorPaneSelectionChangeEvent>();
		disposables.add(pane.onDidChangeSelection(e => {
			if (e.reason === EditorPaneSelectionChangeReason.EDIT) {
				onDidFireSelectionEventOfEditType.complete(e);
			}
		}));

		// Changing model reports selection change
		// of EDIT kind

		const model = disposables.add(await accessor.textFileService.files.resolve(resource) as IResolvedTextFileEditorModel);
		model.textEditorModel.setValue('Hello World');

		const event = await onDidFireSelectionEventOfEditType.p;
		assert.strictEqual(event.reason, EditorPaneSelectionChangeReason.EDIT);

		// getSelection() works and can be restored
		//
		// Note: this is a bit bogus because in tests our code editors have
		//       no view and no cursor can be set as such. So the selection
		//       will always report for the first line and column.

		pane.setSelection(new Selection(1, 1, 1, 1), EditorPaneSelectionChangeReason.USER);
		const selection = pane.getSelection();
		assert.ok(selection);
		await pane.group.closeAllEditors();
		const options = selection.restore({});
		pane = (await accessor.editorService.openEditor({ resource, options }) as TestTextFileEditor);

		assert.ok(pane && isEditorPaneWithSelection(pane));

		const newSelection = pane.getSelection();
		assert.ok(newSelection);
		assert.strictEqual(newSelection.compare(selection), EditorPaneSelectionCompareResult.IDENTICAL);

		await model.revert();
		await pane.group.closeAllEditors();
	});

	test('TextEditorPaneSelection', function () {
		const sel1 = new TextEditorPaneSelection(new Selection(1, 1, 2, 2));
		const sel2 = new TextEditorPaneSelection(new Selection(5, 5, 6, 6));
		const sel3 = new TextEditorPaneSelection(new Selection(50, 50, 60, 60));
		const sel4 = { compare: () => { throw new Error(); }, restore: (options: IEditorOptions) => options };

		assert.strictEqual(sel1.compare(sel1), EditorPaneSelectionCompareResult.IDENTICAL);
		assert.strictEqual(sel1.compare(sel2), EditorPaneSelectionCompareResult.SIMILAR);
		assert.strictEqual(sel1.compare(sel3), EditorPaneSelectionCompareResult.DIFFERENT);
		assert.strictEqual(sel1.compare(sel4), EditorPaneSelectionCompareResult.DIFFERENT);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/editor/textResourceEditorInput.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/editor/textResourceEditorInput.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { TextResourceEditorInput } from '../../../../common/editor/textResourceEditorInput.js';
import { TextResourceEditorModel } from '../../../../common/editor/textResourceEditorModel.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor } from '../../workbenchTestServices.js';
import { snapshotToString } from '../../../../services/textfile/common/textfiles.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('TextResourceEditorInput', () => {

	const disposables = new DisposableStore();

	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	teardown(() => {
		disposables.clear();
	});

	test('basics', async () => {
		const resource = URI.from({ scheme: 'inmemory', authority: null!, path: 'thePath' });
		accessor.modelService.createModel('function test() {}', accessor.languageService.createById(PLAINTEXT_LANGUAGE_ID), resource);

		const input = disposables.add(instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', undefined, undefined));

		const model = disposables.add(await input.resolve());

		assert.ok(model);
		assert.strictEqual(snapshotToString(((model as TextResourceEditorModel).createSnapshot()!)), 'function test() {}');
	});

	test('preferred language (via ctor)', async () => {
		const registration = accessor.languageService.registerLanguage({
			id: 'resource-input-test',
		});

		const resource = URI.from({ scheme: 'inmemory', authority: null!, path: 'thePath' });
		accessor.modelService.createModel('function test() {}', accessor.languageService.createById(PLAINTEXT_LANGUAGE_ID), resource);

		const input = disposables.add(instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', 'resource-input-test', undefined));

		const model = disposables.add(await input.resolve());
		assert.ok(model);
		assert.strictEqual(model.textEditorModel?.getLanguageId(), 'resource-input-test');

		input.setLanguageId('text');
		assert.strictEqual(model.textEditorModel?.getLanguageId(), PLAINTEXT_LANGUAGE_ID);

		disposables.add(await input.resolve());
		assert.strictEqual(model.textEditorModel?.getLanguageId(), PLAINTEXT_LANGUAGE_ID);
		registration.dispose();
	});

	test('preferred language (via setPreferredLanguageId)', async () => {
		const registration = accessor.languageService.registerLanguage({
			id: 'resource-input-test',
		});

		const resource = URI.from({ scheme: 'inmemory', authority: null!, path: 'thePath' });
		accessor.modelService.createModel('function test() {}', accessor.languageService.createById(PLAINTEXT_LANGUAGE_ID), resource);

		const input = disposables.add(instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', undefined, undefined));
		input.setPreferredLanguageId('resource-input-test');

		const model = disposables.add(await input.resolve());
		assert.ok(model);
		assert.strictEqual(model.textEditorModel?.getLanguageId(), 'resource-input-test');
		registration.dispose();
	});

	test('preferred contents (via ctor)', async () => {
		const resource = URI.from({ scheme: 'inmemory', authority: null!, path: 'thePath' });
		accessor.modelService.createModel('function test() {}', accessor.languageService.createById(PLAINTEXT_LANGUAGE_ID), resource);

		const input = disposables.add(instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', undefined, 'My Resource Input Contents'));

		const model = disposables.add(await input.resolve());
		assert.ok(model);
		assert.strictEqual(model.textEditorModel?.getValue(), 'My Resource Input Contents');

		model.textEditorModel.setValue('Some other contents');
		assert.strictEqual(model.textEditorModel?.getValue(), 'Some other contents');

		disposables.add(await input.resolve());
		assert.strictEqual(model.textEditorModel?.getValue(), 'Some other contents'); // preferred contents only used once
	});

	test('preferred contents (via setPreferredContents)', async () => {
		const resource = URI.from({ scheme: 'inmemory', authority: null!, path: 'thePath' });
		accessor.modelService.createModel('function test() {}', accessor.languageService.createById(PLAINTEXT_LANGUAGE_ID), resource);

		const input = disposables.add(instantiationService.createInstance(TextResourceEditorInput, resource, 'The Name', 'The Description', undefined, undefined));
		input.setPreferredContents('My Resource Input Contents');

		const model = disposables.add(await input.resolve());
		assert.ok(model);
		assert.strictEqual(model.textEditorModel?.getValue(), 'My Resource Input Contents');

		model.textEditorModel.setValue('Some other contents');
		assert.strictEqual(model.textEditorModel?.getValue(), 'Some other contents');

		disposables.add(await input.resolve());
		assert.strictEqual(model.textEditorModel?.getValue(), 'Some other contents'); // preferred contents only used once
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/browser/parts/statusbar/statusbarModel.test.ts]---
Location: vscode-main/src/vs/workbench/test/browser/parts/statusbar/statusbarModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { IStatusbarViewModelEntry, StatusbarViewModel } from '../../../../browser/parts/statusbar/statusbarModel.js';
import { TestStorageService } from '../../../common/workbenchTestServices.js';
import { StatusbarAlignment } from '../../../../services/statusbar/browser/statusbar.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('Workbench status bar model', () => {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	test('basics', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		assert.strictEqual(model.entries.length, 0);

		const entry1: IStatusbarViewModelEntry = { id: '3', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: 3, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry1);
		const entry2: IStatusbarViewModelEntry = { id: '2', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry2);
		const entry3: IStatusbarViewModelEntry = { id: '1', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry3);
		const entry4: IStatusbarViewModelEntry = { id: '1-right', alignment: StatusbarAlignment.RIGHT, name: '1-right', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry4);

		assert.strictEqual(model.entries.length, 4);

		const leftEntries = model.getEntries(StatusbarAlignment.LEFT);
		assert.strictEqual(leftEntries.length, 3);
		assert.strictEqual(model.getEntries(StatusbarAlignment.RIGHT).length, 1);

		assert.strictEqual(leftEntries[0].id, '3');
		assert.strictEqual(leftEntries[1].id, '2');
		assert.strictEqual(leftEntries[2].id, '1');

		const entries = model.entries;
		assert.strictEqual(entries[0].id, '3');
		assert.strictEqual(entries[1].id, '2');
		assert.strictEqual(entries[2].id, '1');
		assert.strictEqual(entries[3].id, '1-right');

		assert.ok(model.findEntry(container));

		let didChangeEntryVisibility: { id: string; visible: boolean } = { id: '', visible: false };
		disposables.add(model.onDidChangeEntryVisibility(e => {
			didChangeEntryVisibility = e;
		}));

		assert.strictEqual(model.isHidden('1'), false);
		model.hide('1');
		assert.strictEqual(didChangeEntryVisibility.id, '1');
		assert.strictEqual(didChangeEntryVisibility.visible, false);
		assert.strictEqual(model.isHidden('1'), true);

		didChangeEntryVisibility = { id: '', visible: false };

		model.show('1');
		assert.strictEqual(didChangeEntryVisibility.id, '1');
		assert.strictEqual(didChangeEntryVisibility.visible, true);
		assert.strictEqual(model.isHidden('1'), false);

		model.remove(entry1);
		model.remove(entry4);
		assert.strictEqual(model.entries.length, 2);

		model.remove(entry2);
		model.remove(entry3);
		assert.strictEqual(model.entries.length, 0);
	});

	test('sorting with infinity and max number', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		assert.strictEqual(model.entries.length, 0);

		model.add({ id: '3', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: Number.MAX_VALUE, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '2', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: Number.MIN_VALUE, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '1', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: Number.POSITIVE_INFINITY, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '0', alignment: StatusbarAlignment.LEFT, name: '0', priority: { primary: Number.NEGATIVE_INFINITY, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '4', alignment: StatusbarAlignment.LEFT, name: '4', priority: { primary: 100, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		const entries = model.entries;
		assert.strictEqual(entries[0].id, '1');
		assert.strictEqual(entries[1].id, '3');
		assert.strictEqual(entries[2].id, '4');
		assert.strictEqual(entries[3].id, '2');
		assert.strictEqual(entries[4].id, '0');
	});

	test('secondary priority used when primary is same', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		assert.strictEqual(model.entries.length, 0);

		model.add({ id: '1', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '2', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 1, secondary: 2 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '3', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: 1, secondary: 3 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		const entries = model.entries;
		assert.strictEqual(entries[0].id, '3');
		assert.strictEqual(entries[1].id, '2');
		assert.strictEqual(entries[2].id, '1');
	});

	test('insertion order preserved when priorites are the same', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		assert.strictEqual(model.entries.length, 0);

		model.add({ id: '1', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '2', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '3', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		const entries = model.entries;
		assert.strictEqual(entries[0].id, '1');
		assert.strictEqual(entries[1].id, '2');
		assert.strictEqual(entries[2].id, '3');
	});

	test('entry with reference to other entry (existing)', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		// Existing reference, Alignment: left
		model.add({ id: 'a', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'b', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		let entry = { id: 'c', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: { location: { id: 'a', priority: 2 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		let entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'c');
		assert.strictEqual(entries[1].id, 'a');
		assert.strictEqual(entries[2].id, 'b');

		model.remove(entry);

		// Existing reference, Alignment: right
		entry = { id: 'c', alignment: StatusbarAlignment.RIGHT, name: '3', priority: { primary: { location: { id: 'a', priority: 2 }, alignment: StatusbarAlignment.RIGHT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'a');
		assert.strictEqual(entries[1].id, 'c');
		assert.strictEqual(entries[2].id, 'b');
	});

	test('entry with reference to other entry (nonexistent)', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		// Nonexistent reference, Alignment: left
		model.add({ id: 'a', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'b', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		let entry = { id: 'c', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: { location: { id: 'not-existing', priority: 0 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		let entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'a');
		assert.strictEqual(entries[1].id, 'b');
		assert.strictEqual(entries[2].id, 'c');

		model.remove(entry);

		// Nonexistent reference, Alignment: different fallback priority
		entry = { id: 'c', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: { location: { id: 'not-existing', priority: 3 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'c');
		assert.strictEqual(entries[1].id, 'a');
		assert.strictEqual(entries[2].id, 'b');

		model.remove(entry);

		// Nonexistent reference, Alignment: right
		entry = { id: 'c', alignment: StatusbarAlignment.RIGHT, name: '3', priority: { primary: { location: { id: 'not-existing', priority: 3 }, alignment: StatusbarAlignment.RIGHT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'a');
		assert.strictEqual(entries[1].id, 'b');
		assert.strictEqual(entries[2].id, 'c');
	});

	test('entry with reference to other entry resorts based on other entry being there or not', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		model.add({ id: 'a', alignment: StatusbarAlignment.LEFT, name: '1', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'b', alignment: StatusbarAlignment.LEFT, name: '2', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'c', alignment: StatusbarAlignment.LEFT, name: '3', priority: { primary: { location: { id: 'not-existing', priority: 0 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		let entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'a');
		assert.strictEqual(entries[1].id, 'b');
		assert.strictEqual(entries[2].id, 'c');

		const entry = { id: 'not-existing', alignment: StatusbarAlignment.LEFT, name: 'not-existing', priority: { primary: 3, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(entry);

		entries = model.entries;
		assert.strictEqual(entries.length, 4);
		assert.strictEqual(entries[0].id, 'c');
		assert.strictEqual(entries[1].id, 'not-existing');
		assert.strictEqual(entries[2].id, 'a');
		assert.strictEqual(entries[3].id, 'b');

		model.remove(entry);

		entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'a');
		assert.strictEqual(entries[1].id, 'b');
		assert.strictEqual(entries[2].id, 'c');
	});

	test('entry with reference to other entry but different alignment does not explode', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		model.add({ id: '1-left', alignment: StatusbarAlignment.LEFT, name: '1-left', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '2-left', alignment: StatusbarAlignment.LEFT, name: '2-left', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		model.add({ id: '1-right', alignment: StatusbarAlignment.RIGHT, name: '1-right', priority: { primary: 2, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: '2-right', alignment: StatusbarAlignment.RIGHT, name: '2-right', priority: { primary: 1, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		assert.strictEqual(model.getEntries(StatusbarAlignment.LEFT).length, 2);
		assert.strictEqual(model.getEntries(StatusbarAlignment.RIGHT).length, 2);

		const relativeEntryLeft = { id: 'relative', alignment: StatusbarAlignment.LEFT, name: 'relative', priority: { primary: { location: { id: '1-right', priority: 2 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(relativeEntryLeft);

		assert.strictEqual(model.getEntries(StatusbarAlignment.LEFT).length, 3);
		assert.strictEqual(model.getEntries(StatusbarAlignment.LEFT)[2], relativeEntryLeft);
		assert.strictEqual(model.getEntries(StatusbarAlignment.RIGHT).length, 2);

		model.remove(relativeEntryLeft);

		const relativeEntryRight = { id: 'relative', alignment: StatusbarAlignment.RIGHT, name: 'relative', priority: { primary: { location: { id: '1-right', priority: 2 }, alignment: StatusbarAlignment.LEFT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined };
		model.add(relativeEntryRight);

		assert.strictEqual(model.getEntries(StatusbarAlignment.LEFT).length, 2);
		assert.strictEqual(model.getEntries(StatusbarAlignment.RIGHT).length, 3);
	});

	test('entry with reference to other entry respects secondary sorting (existent)', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		model.add({ id: 'ref', alignment: StatusbarAlignment.LEFT, name: 'ref', priority: { primary: 0, secondary: 0 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'entry2', alignment: StatusbarAlignment.RIGHT, name: '2', priority: { primary: { location: { id: 'ref', priority: 0 }, alignment: StatusbarAlignment.RIGHT }, secondary: 2 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'entry1', alignment: StatusbarAlignment.RIGHT, name: '1', priority: { primary: { location: { id: 'ref', priority: 0 }, alignment: StatusbarAlignment.RIGHT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'entry3', alignment: StatusbarAlignment.RIGHT, name: '3', priority: { primary: { location: { id: 'ref', priority: 0 }, alignment: StatusbarAlignment.RIGHT }, secondary: 3 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		const entries = model.entries;
		assert.strictEqual(entries.length, 4);
		assert.strictEqual(entries[0].id, 'ref');
		assert.strictEqual(entries[1].id, 'entry3');
		assert.strictEqual(entries[2].id, 'entry2');
		assert.strictEqual(entries[3].id, 'entry1');
	});

	test('entry with reference to other entry respects secondary sorting (nonexistent)', () => {
		const container = document.createElement('div');
		const model = disposables.add(new StatusbarViewModel(disposables.add(new TestStorageService())));

		model.add({ id: 'entry2', alignment: StatusbarAlignment.RIGHT, name: '2', priority: { primary: { location: { id: 'ref', priority: 1 }, alignment: StatusbarAlignment.RIGHT }, secondary: 2 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'entry1', alignment: StatusbarAlignment.RIGHT, name: '1', priority: { primary: { location: { id: 'ref', priority: 1 }, alignment: StatusbarAlignment.RIGHT }, secondary: 1 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });
		model.add({ id: 'entry3', alignment: StatusbarAlignment.RIGHT, name: '3', priority: { primary: { location: { id: 'ref', priority: 1 }, alignment: StatusbarAlignment.RIGHT }, secondary: 3 }, container, labelContainer: container, hasCommand: false, extensionId: undefined });

		const entries = model.entries;
		assert.strictEqual(entries.length, 3);
		assert.strictEqual(entries[0].id, 'entry3');
		assert.strictEqual(entries[1].id, 'entry2');
		assert.strictEqual(entries[2].id, 'entry1');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/common/memento.test.ts]---
Location: vscode-main/src/vs/workbench/test/common/memento.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { StorageScope, IStorageService, StorageTarget } from '../../../platform/storage/common/storage.js';
import { Memento } from '../../common/memento.js';
import { TestStorageService } from './workbenchTestServices.js';

suite('Memento', () => {
	const disposables = new DisposableStore();
	let storage: IStorageService;

	setup(() => {
		storage = disposables.add(new TestStorageService());
		Memento.clear(StorageScope.APPLICATION);
		Memento.clear(StorageScope.PROFILE);
		Memento.clear(StorageScope.WORKSPACE);
	});

	teardown(() => {
		disposables.clear();
	});

	test('Loading and Saving Memento with Scopes', () => {
		const myMemento = new Memento<{ foo: number[] | string }>('memento.test', storage);

		// Application
		let memento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		memento.foo = [1, 2, 3];
		let applicationMemento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		assert.deepStrictEqual(applicationMemento, memento);

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		memento.foo = [4, 5, 6];
		let profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert(memento);
		memento.foo = 'Hello World';

		myMemento.saveMemento();

		// Application
		memento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [1, 2, 3] });
		applicationMemento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		assert.deepStrictEqual(applicationMemento, memento);

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [4, 5, 6] });
		profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: 'Hello World' });

		// Assert the Mementos are stored properly in storage
		assert.deepStrictEqual(JSON.parse(storage.get('memento/memento.test', StorageScope.APPLICATION)!), { foo: [1, 2, 3] });
		assert.deepStrictEqual(JSON.parse(storage.get('memento/memento.test', StorageScope.PROFILE)!), { foo: [4, 5, 6] });
		assert.deepStrictEqual(JSON.parse(storage.get('memento/memento.test', StorageScope.WORKSPACE)!), { foo: 'Hello World' });

		// Delete Application
		memento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		delete memento.foo;

		// Delete Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		delete memento.foo;

		// Delete Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		delete memento.foo;

		myMemento.saveMemento();

		// Application
		memento = myMemento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, {});

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, {});

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, {});

		// Assert the Mementos are also removed from storage
		assert.strictEqual(storage.get('memento/memento.test', StorageScope.APPLICATION, null!), null);
		assert.strictEqual(storage.get('memento/memento.test', StorageScope.PROFILE, null!), null);
		assert.strictEqual(storage.get('memento/memento.test', StorageScope.WORKSPACE, null!), null);
	});

	test('Save and Load', () => {
		const myMemento = new Memento<{ foo: number[] | string }>('memento.test', storage);

		// Profile
		let memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		memento.foo = [1, 2, 3];

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert(memento);
		memento.foo = 'Hello World';

		myMemento.saveMemento();

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [1, 2, 3] });
		let profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: 'Hello World' });

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		memento.foo = [4, 5, 6];

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert(memento);
		memento.foo = 'World Hello';

		myMemento.saveMemento();

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [4, 5, 6] });
		profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: 'World Hello' });

		// Delete Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		delete memento.foo;

		// Delete Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		delete memento.foo;

		myMemento.saveMemento();

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, {});

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, {});
	});

	test('Save and Load - 2 Components with same id', () => {
		const myMemento = new Memento<any>('memento.test', storage);
		const myMemento2 = new Memento<any>('memento.test', storage);

		// Profile
		let memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		memento.foo = [1, 2, 3];

		memento = myMemento2.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		memento.bar = [1, 2, 3];

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert(memento);
		memento.foo = 'Hello World';

		memento = myMemento2.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert(memento);
		memento.bar = 'Hello World';

		myMemento.saveMemento();
		myMemento2.saveMemento();

		// Profile
		memento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [1, 2, 3], bar: [1, 2, 3] });
		let profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		memento = myMemento2.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: [1, 2, 3], bar: [1, 2, 3] });
		profileMemento = myMemento2.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		assert.deepStrictEqual(profileMemento, memento);

		// Workspace
		memento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: 'Hello World', bar: 'Hello World' });

		memento = myMemento2.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		assert.deepStrictEqual(memento, { foo: 'Hello World', bar: 'Hello World' });
	});

	test('Clear Memento', () => {
		let myMemento = new Memento<{ foo: string; bar: string }>('memento.test', storage);

		// Profile
		let profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		profileMemento.foo = 'Hello World';

		// Workspace
		let workspaceMemento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
		workspaceMemento.bar = 'Hello World';

		myMemento.saveMemento();

		// Clear
		storage = disposables.add(new TestStorageService());
		Memento.clear(StorageScope.PROFILE);
		Memento.clear(StorageScope.WORKSPACE);

		myMemento = new Memento('memento.test', storage);
		profileMemento = myMemento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		workspaceMemento = myMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);

		assert.deepStrictEqual(profileMemento, {});
		assert.deepStrictEqual(workspaceMemento, {});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/common/notifications.test.ts]---
Location: vscode-main/src/vs/workbench/test/common/notifications.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { NotificationsModel, NotificationViewItem, INotificationChangeEvent, NotificationChangeType, NotificationViewItemContentChangeKind, IStatusMessageChangeEvent, StatusMessageChangeType, INotificationsFilter } from '../../common/notifications.js';
import { Action } from '../../../base/common/actions.js';
import { INotification, Severity, NotificationsFilter, NotificationPriority } from '../../../platform/notification/common/notification.js';
import { createErrorWithActions } from '../../../base/common/errorMessage.js';
import { timeout } from '../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';

suite('Notifications', () => {

	const disposables = new DisposableStore();
	const noFilter: INotificationsFilter = { global: NotificationsFilter.OFF, sources: new Map() };

	teardown(() => {
		disposables.clear();
	});

	test('Items', () => {

		// Invalid
		assert.ok(!NotificationViewItem.create({ severity: Severity.Error, message: '' }, noFilter));
		assert.ok(!NotificationViewItem.create({ severity: Severity.Error, message: null! }, noFilter));

		// Duplicates
		const item1 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message' }, noFilter)!;
		const item2 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message' }, noFilter)!;
		const item3 = NotificationViewItem.create({ severity: Severity.Info, message: 'Info Message' }, noFilter)!;
		const item4 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message', source: 'Source' }, noFilter)!;
		const item5 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message', actions: { primary: [disposables.add(new Action('id', 'label'))] } }, noFilter)!;
		const item6 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message', actions: { primary: [disposables.add(new Action('id', 'label'))] }, progress: { infinite: true } }, noFilter)!;

		assert.strictEqual(item1.equals(item1), true);
		assert.strictEqual(item2.equals(item2), true);
		assert.strictEqual(item3.equals(item3), true);
		assert.strictEqual(item4.equals(item4), true);
		assert.strictEqual(item5.equals(item5), true);

		assert.strictEqual(item1.equals(item2), true);
		assert.strictEqual(item1.equals(item3), false);
		assert.strictEqual(item1.equals(item4), false);
		assert.strictEqual(item1.equals(item5), false);

		const itemId1 = NotificationViewItem.create({ id: 'same', message: 'Info Message', severity: Severity.Info }, noFilter)!;
		const itemId2 = NotificationViewItem.create({ id: 'same', message: 'Error Message', severity: Severity.Error }, noFilter)!;

		assert.strictEqual(itemId1.equals(itemId2), true);
		assert.strictEqual(itemId1.equals(item3), false);

		// Progress
		assert.strictEqual(item1.hasProgress, false);
		assert.strictEqual(item6.hasProgress, true);

		// Message Box
		assert.strictEqual(item5.canCollapse, false);
		assert.strictEqual(item5.expanded, true);

		// Events
		let called = 0;
		disposables.add(item1.onDidChangeExpansion(() => {
			called++;
		}));

		item1.expand();
		item1.expand();
		item1.collapse();
		item1.collapse();

		assert.strictEqual(called, 2);

		called = 0;
		disposables.add(item1.onDidChangeContent(e => {
			if (e.kind === NotificationViewItemContentChangeKind.PROGRESS) {
				called++;
			}
		}));

		item1.progress.infinite();
		item1.progress.done();

		assert.strictEqual(called, 2);

		called = 0;
		disposables.add(item1.onDidChangeContent(e => {
			if (e.kind === NotificationViewItemContentChangeKind.MESSAGE) {
				called++;
			}
		}));

		item1.updateMessage('message update');

		called = 0;
		disposables.add(item1.onDidChangeContent(e => {
			if (e.kind === NotificationViewItemContentChangeKind.SEVERITY) {
				called++;
			}
		}));

		item1.updateSeverity(Severity.Error);

		called = 0;
		disposables.add(item1.onDidChangeContent(e => {
			if (e.kind === NotificationViewItemContentChangeKind.ACTIONS) {
				called++;
			}
		}));

		item1.updateActions({ primary: [disposables.add(new Action('id2', 'label'))] });

		assert.strictEqual(called, 1);

		called = 0;
		disposables.add(item1.onDidChangeVisibility(e => {
			called++;
		}));

		item1.updateVisibility(true);
		item1.updateVisibility(false);
		item1.updateVisibility(false);

		assert.strictEqual(called, 2);

		called = 0;
		disposables.add(item1.onDidClose(() => {
			called++;
		}));

		item1.close();
		assert.strictEqual(called, 1);

		// Error with Action
		const item7 = NotificationViewItem.create({ severity: Severity.Error, message: createErrorWithActions('Hello Error', [disposables.add(new Action('id', 'label'))]) }, noFilter)!;
		assert.strictEqual(item7.actions!.primary!.length, 1);

		// Filter
		const item8 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message' }, { global: NotificationsFilter.OFF, sources: new Map() })!;
		assert.strictEqual(item8.priority, NotificationPriority.DEFAULT);

		const item9 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message' }, { global: NotificationsFilter.ERROR, sources: new Map() })!;
		assert.strictEqual(item9.priority, NotificationPriority.DEFAULT);

		const item10 = NotificationViewItem.create({ severity: Severity.Warning, message: 'Error Message' }, { global: NotificationsFilter.ERROR, sources: new Map() })!;
		assert.strictEqual(item10.priority, NotificationPriority.SILENT);

		const sources = new Map<string, NotificationsFilter>();
		sources.set('test.source', NotificationsFilter.ERROR);
		const item11 = NotificationViewItem.create({ severity: Severity.Warning, message: 'Error Message', source: 'test.source' }, { global: NotificationsFilter.OFF, sources })!;
		assert.strictEqual(item11.priority, NotificationPriority.DEFAULT);
		const item12 = NotificationViewItem.create({ severity: Severity.Warning, message: 'Error Message', source: { id: 'test.source', label: 'foo' } }, { global: NotificationsFilter.OFF, sources })!;
		assert.strictEqual(item12.priority, NotificationPriority.SILENT);
		const item13 = NotificationViewItem.create({ severity: Severity.Warning, message: 'Error Message', source: { id: 'test.source2', label: 'foo' } }, { global: NotificationsFilter.OFF, sources })!;
		assert.strictEqual(item13.priority, NotificationPriority.DEFAULT);

		for (const item of [item1, item2, item3, item4, item5, item6, itemId1, itemId2, item7, item8, item9, item10, item11, item12, item13]) {
			item.close();
		}
	});

	test('Items - does not fire changed when message did not change (content, severity)', async () => {
		const item1 = NotificationViewItem.create({ severity: Severity.Error, message: 'Error Message' }, noFilter)!;

		let fired = false;
		disposables.add(item1.onDidChangeContent(() => {
			fired = true;
		}));

		item1.updateMessage('Error Message');
		await timeout(0);
		assert.ok(!fired, 'Expected onDidChangeContent to not be fired');

		item1.updateSeverity(Severity.Error);
		await timeout(0);
		assert.ok(!fired, 'Expected onDidChangeContent to not be fired');

		for (const item of [item1]) {
			item.close();
		}
	});

	test('Model', () => {
		const model = disposables.add(new NotificationsModel());

		let lastNotificationEvent!: INotificationChangeEvent;
		disposables.add(model.onDidChangeNotification(e => {
			lastNotificationEvent = e;
		}));

		let lastStatusMessageEvent!: IStatusMessageChangeEvent;
		disposables.add(model.onDidChangeStatusMessage(e => {
			lastStatusMessageEvent = e;
		}));

		const item1: INotification = { severity: Severity.Error, message: 'Error Message', actions: { primary: [disposables.add(new Action('id', 'label'))] } };
		const item2: INotification = { severity: Severity.Warning, message: 'Warning Message', source: 'Some Source' };
		const item2Duplicate: INotification = { severity: Severity.Warning, message: 'Warning Message', source: 'Some Source' };
		const item3: INotification = { severity: Severity.Info, message: 'Info Message' };

		const item1Handle = model.addNotification(item1);
		assert.strictEqual(lastNotificationEvent.item.severity, item1.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item1.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.ADD);

		item1Handle.updateMessage('Different Error Message');
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.CHANGE);
		assert.strictEqual(lastNotificationEvent.detail, NotificationViewItemContentChangeKind.MESSAGE);

		item1Handle.updateSeverity(Severity.Warning);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.CHANGE);
		assert.strictEqual(lastNotificationEvent.detail, NotificationViewItemContentChangeKind.SEVERITY);

		item1Handle.updateActions({ primary: [], secondary: [] });
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.CHANGE);
		assert.strictEqual(lastNotificationEvent.detail, NotificationViewItemContentChangeKind.ACTIONS);

		item1Handle.progress.infinite();
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.CHANGE);
		assert.strictEqual(lastNotificationEvent.detail, NotificationViewItemContentChangeKind.PROGRESS);

		const item2Handle = model.addNotification(item2);
		assert.strictEqual(lastNotificationEvent.item.severity, item2.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item2.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.ADD);

		const item3Handle = model.addNotification(item3);
		assert.strictEqual(lastNotificationEvent.item.severity, item3.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item3.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.ADD);

		assert.strictEqual(model.notifications.length, 3);

		let called = 0;
		disposables.add(item1Handle.onDidClose(() => {
			called++;
		}));

		item1Handle.close();
		assert.strictEqual(called, 1);
		assert.strictEqual(model.notifications.length, 2);
		assert.strictEqual(lastNotificationEvent.item.severity, Severity.Warning);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), 'Different Error Message');
		assert.strictEqual(lastNotificationEvent.index, 2);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.REMOVE);

		const item2DuplicateHandle = model.addNotification(item2Duplicate);
		assert.strictEqual(model.notifications.length, 2);
		assert.strictEqual(lastNotificationEvent.item.severity, item2Duplicate.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item2Duplicate.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.ADD);

		item2Handle.close();
		assert.strictEqual(model.notifications.length, 1);
		assert.strictEqual(lastNotificationEvent.item.severity, item2Duplicate.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item2Duplicate.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.REMOVE);

		model.notifications[0].expand();
		assert.strictEqual(lastNotificationEvent.item.severity, item3.severity);
		assert.strictEqual(lastNotificationEvent.item.message.linkedText.toString(), item3.message);
		assert.strictEqual(lastNotificationEvent.index, 0);
		assert.strictEqual(lastNotificationEvent.kind, NotificationChangeType.EXPAND_COLLAPSE);

		const disposable = model.showStatusMessage('Hello World');
		assert.strictEqual(model.statusMessage!.message, 'Hello World');
		assert.strictEqual(lastStatusMessageEvent.item.message, model.statusMessage!.message);
		assert.strictEqual(lastStatusMessageEvent.kind, StatusMessageChangeType.ADD);
		disposable.close();
		assert.ok(!model.statusMessage);
		assert.strictEqual(lastStatusMessageEvent.kind, StatusMessageChangeType.REMOVE);

		const disposable2 = model.showStatusMessage('Hello World 2');
		const disposable3 = model.showStatusMessage('Hello World 3');

		assert.strictEqual(model.statusMessage!.message, 'Hello World 3');

		disposable2.close();
		assert.strictEqual(model.statusMessage!.message, 'Hello World 3');

		disposable3.close();
		assert.ok(!model.statusMessage);

		item2DuplicateHandle.close();
		item3Handle.close();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/common/resources.test.ts]---
Location: vscode-main/src/vs/workbench/test/common/resources.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { ResourceGlobMatcher } from '../../common/resources.js';
import { TestContextService } from './workbenchTestServices.js';

suite('ResourceGlobMatcher', () => {

	const SETTING = 'test.matcher';

	let contextService: IWorkspaceContextService;
	let configurationService: TestConfigurationService;

	const disposables = new DisposableStore();

	setup(() => {
		contextService = new TestContextService();
		configurationService = new TestConfigurationService({
			[SETTING]: {
				'**/*.md': true,
				'**/*.txt': false
			}
		});
	});

	teardown(() => {
		disposables.clear();
	});

	test('Basics', async () => {
		const matcher = disposables.add(new ResourceGlobMatcher(() => configurationService.getValue(SETTING), e => e.affectsConfiguration(SETTING), contextService, configurationService));

		// Matching
		assert.equal(matcher.matches(URI.file('/foo/bar')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.md')), true);
		assert.equal(matcher.matches(URI.file('/foo/bar.txt')), false);

		// Events
		let eventCounter = 0;
		disposables.add(matcher.onExpressionChange(() => eventCounter++));

		await configurationService.setUserConfiguration(SETTING, { '**/*.foo': true });
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);
		assert.equal(eventCounter, 1);

		assert.equal(matcher.matches(URI.file('/foo/bar.md')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.foo')), true);

		await configurationService.setUserConfiguration(SETTING, undefined);
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);
		assert.equal(eventCounter, 2);

		assert.equal(matcher.matches(URI.file('/foo/bar.md')), false);
		assert.equal(matcher.matches(URI.file('/foo/bar.foo')), false);

		await configurationService.setUserConfiguration(SETTING, {
			'**/*.md': true,
			'**/*.txt': false,
			'C:/bar/**': true,
			'/bar/**': true
		});
		// eslint-disable-next-line local/code-no-any-casts
		configurationService.onDidChangeConfigurationEmitter.fire({ affectsConfiguration: (key: string) => key === SETTING } as any);

		assert.equal(matcher.matches(URI.file('/bar/foo.1')), true);
		assert.equal(matcher.matches(URI.file('C:/bar/foo.1')), true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/common/utils.ts]---
Location: vscode-main/src/vs/workbench/test/common/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { LanguagesRegistry } from '../../../editor/common/services/languagesRegistry.js';

/**
 * This function is called before test running and also again at the end of test running
 * and can be used to add assertions. e.g. that registries are empty, etc.
 *
 * !! This is called directly by the testing framework.
 *
 * @skipMangle
 */
export function assertCleanState(): void {
	// If this test fails, it is a clear indication that
	// your test or suite is leaking services (e.g. via leaking text models)
	// assert.strictEqual(LanguageService.instanceCount, 0, 'No leaking ILanguageService');
	assert.strictEqual(LanguagesRegistry.instanceCount, 0, 'Error: Test run should not leak in LanguagesRegistry.');
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/common/workbenchTestServices.ts]---
Location: vscode-main/src/vs/workbench/test/common/workbenchTestServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../base/common/async.js';
import { bufferToStream, readableToBuffer, VSBuffer, VSBufferReadable } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Iterable } from '../../../base/common/iterator.js';
import { Disposable, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { Schemas } from '../../../base/common/network.js';
import { observableValue } from '../../../base/common/observable.js';
import { join } from '../../../base/common/path.js';
import { isLinux, isMacintosh } from '../../../base/common/platform.js';
import { basename, isEqual, isEqualOrParent } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { ITextResourcePropertiesService } from '../../../editor/common/services/textResourceConfiguration.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IResourceEditorInput } from '../../../platform/editor/common/editor.js';
import { FileChangesEvent, FileOperationEvent, FileSystemProviderCapabilities, IBaseFileStat, ICreateFileOptions, IFileContent, IFileService, IFileStat, IFileStatResult, IFileStatWithMetadata, IFileStatWithPartialMetadata, IFileStreamContent, IFileSystemProvider, IFileSystemProviderActivationEvent, IFileSystemProviderCapabilitiesChangeEvent, IFileSystemWatcher, IReadFileOptions, IReadFileStreamOptions, IResolveFileOptions, IResolveMetadataFileOptions, IWatchOptions, IWatchOptionsWithCorrelation, IWriteFileOptions } from '../../../platform/files/common/files.js';
import { AbstractLoggerService, ILogger, LogLevel, NullLogger } from '../../../platform/log/common/log.js';
import { IMarker, IMarkerData, IMarkerService, IResourceMarker, MarkerStatistics } from '../../../platform/markers/common/markers.js';
import product from '../../../platform/product/common/product.js';
import { IProgress, IProgressStep } from '../../../platform/progress/common/progress.js';
import { InMemoryStorageService, WillSaveStateReason } from '../../../platform/storage/common/storage.js';
import { toUserDataProfile } from '../../../platform/userDataProfile/common/userDataProfile.js';
import { ISingleFolderWorkspaceIdentifier, IWorkspace, IWorkspaceContextService, IWorkspaceFolder, IWorkspaceFoldersChangeEvent, IWorkspaceFoldersWillChangeEvent, IWorkspaceIdentifier, WorkbenchState, Workspace } from '../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustEnablementService, IWorkspaceTrustManagementService, IWorkspaceTrustRequestService, IWorkspaceTrustTransitionParticipant, IWorkspaceTrustUriInfo, WorkspaceTrustRequestOptions, WorkspaceTrustUriResponse } from '../../../platform/workspace/common/workspaceTrust.js';
import { TestWorkspace } from '../../../platform/workspace/test/common/testWorkspace.js';
import { GroupIdentifier, IRevertOptions, ISaveOptions, SaveReason } from '../../common/editor.js';
import { EditorInput } from '../../common/editor/editorInput.js';
import { IActivity, IActivityService } from '../../services/activity/common/activity.js';
import { ChatEntitlement, IChatEntitlementService } from '../../services/chat/common/chatEntitlementService.js';
import { NullExtensionService } from '../../services/extensions/common/extensions.js';
import { IAutoSaveConfiguration, IAutoSaveMode, IFilesConfigurationService } from '../../services/filesConfiguration/common/filesConfigurationService.js';
import { IHistoryService } from '../../services/history/common/history.js';
import { IResourceEncoding } from '../../services/textfile/common/textfiles.js';
import { IUserDataProfileService } from '../../services/userDataProfile/common/userDataProfile.js';
import { IStoredFileWorkingCopySaveEvent } from '../../services/workingCopy/common/storedFileWorkingCopy.js';
import { IWorkingCopy, IWorkingCopyBackup, WorkingCopyCapabilities } from '../../services/workingCopy/common/workingCopy.js';
import { ICopyOperation, ICreateFileOperation, ICreateOperation, IDeleteOperation, IFileOperationUndoRedoInfo, IMoveOperation, IStoredFileWorkingCopySaveParticipant, IStoredFileWorkingCopySaveParticipantContext, IWorkingCopyFileOperationParticipant, IWorkingCopyFileService, WorkingCopyFileEvent } from '../../services/workingCopy/common/workingCopyFileService.js';

export class TestLoggerService extends AbstractLoggerService {
	constructor(logsHome?: URI) {
		super(LogLevel.Info, logsHome ?? URI.file('tests').with({ scheme: 'vscode-tests' }));
	}
	protected doCreateLogger(): ILogger { return new NullLogger(); }
}

export class TestTextResourcePropertiesService implements ITextResourcePropertiesService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
	}

	getEOL(resource: URI, language?: string): string {
		const eol = this.configurationService.getValue('files.eol', { overrideIdentifier: language, resource });
		if (eol && typeof eol === 'string' && eol !== 'auto') {
			return eol;
		}
		return (isLinux || isMacintosh) ? '\n' : '\r\n';
	}
}

export class TestUserDataProfileService implements IUserDataProfileService {

	readonly _serviceBrand: undefined;
	readonly onDidChangeCurrentProfile = Event.None;
	readonly currentProfile = toUserDataProfile('test', 'test', URI.file('tests').with({ scheme: 'vscode-tests' }), URI.file('tests').with({ scheme: 'vscode-tests' }));
	async updateCurrentProfile(): Promise<void> { }
}

export class TestContextService implements IWorkspaceContextService {

	declare readonly _serviceBrand: undefined;

	private workspace: Workspace;
	private options: object;

	private readonly _onDidChangeWorkspaceName: Emitter<void>;
	get onDidChangeWorkspaceName(): Event<void> { return this._onDidChangeWorkspaceName.event; }

	private readonly _onWillChangeWorkspaceFolders: Emitter<IWorkspaceFoldersWillChangeEvent>;
	get onWillChangeWorkspaceFolders(): Event<IWorkspaceFoldersWillChangeEvent> { return this._onWillChangeWorkspaceFolders.event; }

	private readonly _onDidChangeWorkspaceFolders: Emitter<IWorkspaceFoldersChangeEvent>;
	get onDidChangeWorkspaceFolders(): Event<IWorkspaceFoldersChangeEvent> { return this._onDidChangeWorkspaceFolders.event; }

	private readonly _onDidChangeWorkbenchState: Emitter<WorkbenchState>;
	get onDidChangeWorkbenchState(): Event<WorkbenchState> { return this._onDidChangeWorkbenchState.event; }

	constructor(workspace = TestWorkspace, options = null) {
		this.workspace = workspace;
		this.options = options || Object.create(null);
		this._onDidChangeWorkspaceName = new Emitter<void>();
		this._onWillChangeWorkspaceFolders = new Emitter<IWorkspaceFoldersWillChangeEvent>();
		this._onDidChangeWorkspaceFolders = new Emitter<IWorkspaceFoldersChangeEvent>();
		this._onDidChangeWorkbenchState = new Emitter<WorkbenchState>();
	}

	getFolders(): IWorkspaceFolder[] {
		return this.workspace ? this.workspace.folders : [];
	}

	getWorkbenchState(): WorkbenchState {
		if (this.workspace.configuration) {
			return WorkbenchState.WORKSPACE;
		}

		if (this.workspace.folders.length) {
			return WorkbenchState.FOLDER;
		}

		return WorkbenchState.EMPTY;
	}

	getCompleteWorkspace(): Promise<IWorkspace> {
		return Promise.resolve(this.getWorkspace());
	}

	getWorkspace(): IWorkspace {
		return this.workspace;
	}

	getWorkspaceFolder(resource: URI): IWorkspaceFolder | null {
		return this.workspace.getFolder(resource);
	}

	setWorkspace(workspace: any): void {
		this.workspace = workspace;
	}

	getOptions() {
		return this.options;
	}

	updateOptions() { }

	isInsideWorkspace(resource: URI): boolean {
		if (resource && this.workspace) {
			return isEqualOrParent(resource, this.workspace.folders[0].uri);
		}

		return false;
	}

	toResource(workspaceRelativePath: string): URI {
		return URI.file(join('C:\\', workspaceRelativePath));
	}

	isCurrentWorkspace(workspaceIdOrFolder: IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier | URI): boolean {
		return URI.isUri(workspaceIdOrFolder) && isEqual(this.workspace.folders[0].uri, workspaceIdOrFolder);
	}
}

export class TestStorageService extends InMemoryStorageService {

	testEmitWillSaveState(reason: WillSaveStateReason): void {
		super.emitWillSaveState(reason);
	}
}

export class TestHistoryService implements IHistoryService {

	declare readonly _serviceBrand: undefined;

	constructor(private root?: URI) { }

	async reopenLastClosedEditor(): Promise<void> { }
	async goForward(): Promise<void> { }
	async goBack(): Promise<void> { }
	async goPrevious(): Promise<void> { }
	async goLast(): Promise<void> { }
	removeFromHistory(_input: EditorInput | IResourceEditorInput): void { }
	clear(): void { }
	clearRecentlyOpened(): void { }
	getHistory(): readonly (EditorInput | IResourceEditorInput)[] { return []; }
	async openNextRecentlyUsedEditor(group?: GroupIdentifier): Promise<void> { }
	async openPreviouslyUsedEditor(group?: GroupIdentifier): Promise<void> { }
	getLastActiveWorkspaceRoot(_schemeFilter: string): URI | undefined { return this.root; }
	getLastActiveFile(_schemeFilter: string): URI | undefined { return undefined; }
}

export class TestWorkingCopy extends Disposable implements IWorkingCopy {

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidSave = this._register(new Emitter<IStoredFileWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	readonly capabilities = WorkingCopyCapabilities.None;

	readonly name;

	private dirty = false;

	constructor(readonly resource: URI, isDirty = false, readonly typeId = 'testWorkingCopyType') {
		super();

		this.name = basename(this.resource);
		this.dirty = isDirty;
	}

	setDirty(dirty: boolean): void {
		if (this.dirty !== dirty) {
			this.dirty = dirty;
			this._onDidChangeDirty.fire();
		}
	}

	setContent(content: string): void {
		this._onDidChangeContent.fire();
	}

	isDirty(): boolean {
		return this.dirty;
	}

	isModified(): boolean {
		return this.isDirty();
	}

	async save(options?: ISaveOptions, stat?: IFileStatWithMetadata): Promise<boolean> {
		this._onDidSave.fire({ reason: options?.reason ?? SaveReason.EXPLICIT, stat: stat ?? createFileStat(this.resource), source: options?.source });

		return true;
	}

	async revert(options?: IRevertOptions): Promise<void> {
		this.setDirty(false);
	}

	async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
		return {};
	}
}

export function createFileStat(resource: URI, readonly = false, isFile?: boolean, isDirectory?: boolean, isSymbolicLink?: boolean, children?: { resource: URI; isFile?: boolean; isDirectory?: boolean; isSymbolicLink?: boolean }[] | undefined): IFileStatWithMetadata {
	return {
		resource,
		etag: Date.now().toString(),
		mtime: Date.now(),
		ctime: Date.now(),
		size: 42,
		isFile: isFile ?? true,
		isDirectory: isDirectory ?? false,
		isSymbolicLink: isSymbolicLink ?? false,
		readonly,
		locked: false,
		name: basename(resource),
		children: children?.map(c => createFileStat(c.resource, false, c.isFile, c.isDirectory, c.isSymbolicLink)),
	};
}

export class TestWorkingCopyFileService implements IWorkingCopyFileService {

	declare readonly _serviceBrand: undefined;

	readonly onWillRunWorkingCopyFileOperation: Event<WorkingCopyFileEvent> = Event.None;
	readonly onDidFailWorkingCopyFileOperation: Event<WorkingCopyFileEvent> = Event.None;
	readonly onDidRunWorkingCopyFileOperation: Event<WorkingCopyFileEvent> = Event.None;

	addFileOperationParticipant(participant: IWorkingCopyFileOperationParticipant): IDisposable { return Disposable.None; }

	readonly hasSaveParticipants = false;
	addSaveParticipant(participant: IStoredFileWorkingCopySaveParticipant): IDisposable { return Disposable.None; }
	async runSaveParticipants(workingCopy: IWorkingCopy, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> { }

	async delete(operations: IDeleteOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<void> { }

	registerWorkingCopyProvider(provider: (resourceOrFolder: URI) => IWorkingCopy[]): IDisposable { return Disposable.None; }

	getDirty(resource: URI): IWorkingCopy[] { return []; }

	create(operations: ICreateFileOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> { throw new Error('Method not implemented.'); }
	createFolder(operations: ICreateOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> { throw new Error('Method not implemented.'); }

	move(operations: IMoveOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> { throw new Error('Method not implemented.'); }

	copy(operations: ICopyOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> { throw new Error('Method not implemented.'); }
}

export function mock<T>(): Ctor<T> {
	// eslint-disable-next-line local/code-no-any-casts
	return function () { } as any;
}

export interface Ctor<T> {
	new(): T;
}

export class TestExtensionService extends NullExtensionService { }

export const TestProductService = { _serviceBrand: undefined, ...product };

export class TestActivityService implements IActivityService {
	_serviceBrand: undefined;
	onDidChangeActivity = Event.None;
	getViewContainerActivities(viewContainerId: string): IActivity[] {
		return [];
	}
	getActivity(id: string): IActivity[] {
		return [];
	}
	showViewContainerActivity(viewContainerId: string, badge: IActivity): IDisposable {
		return this;
	}
	showViewActivity(viewId: string, badge: IActivity): IDisposable {
		return this;
	}
	showAccountsActivity(activity: IActivity): IDisposable {
		return this;
	}
	showGlobalActivity(activity: IActivity): IDisposable {
		return this;
	}

	dispose() { }
}

export const NullFilesConfigurationService = new class implements IFilesConfigurationService {

	_serviceBrand: undefined;

	readonly onDidChangeAutoSaveConfiguration = Event.None;
	readonly onDidChangeAutoSaveDisabled = Event.None;
	readonly onDidChangeReadonly = Event.None;
	readonly onDidChangeFilesAssociation = Event.None;

	readonly isHotExitEnabled = false;
	readonly hotExitConfiguration = undefined;

	getAutoSaveConfiguration(): IAutoSaveConfiguration { throw new Error('Method not implemented.'); }
	getAutoSaveMode(): IAutoSaveMode { throw new Error('Method not implemented.'); }
	hasShortAutoSaveDelay(): boolean { throw new Error('Method not implemented.'); }
	toggleAutoSave(): Promise<void> { throw new Error('Method not implemented.'); }
	enableAutoSaveAfterShortDelay(resourceOrEditor: URI | EditorInput): IDisposable { throw new Error('Method not implemented.'); }
	disableAutoSave(resourceOrEditor: URI | EditorInput): IDisposable { throw new Error('Method not implemented.'); }
	isReadonly(resource: URI, stat?: IBaseFileStat | undefined): boolean { return false; }
	async updateReadonly(resource: URI, readonly: boolean | 'toggle' | 'reset'): Promise<void> { }
	preventSaveConflicts(resource: URI, language?: string | undefined): boolean { throw new Error('Method not implemented.'); }
};

export class TestWorkspaceTrustEnablementService implements IWorkspaceTrustEnablementService {
	_serviceBrand: undefined;

	constructor(private isEnabled: boolean = true) { }

	isWorkspaceTrustEnabled(): boolean {
		return this.isEnabled;
	}
}

export class TestWorkspaceTrustManagementService extends Disposable implements IWorkspaceTrustManagementService {
	_serviceBrand: undefined;

	private _onDidChangeTrust = this._register(new Emitter<boolean>());
	onDidChangeTrust = this._onDidChangeTrust.event;

	private _onDidChangeTrustedFolders = this._register(new Emitter<void>());
	onDidChangeTrustedFolders = this._onDidChangeTrustedFolders.event;

	private _onDidInitiateWorkspaceTrustRequestOnStartup = this._register(new Emitter<void>());
	onDidInitiateWorkspaceTrustRequestOnStartup = this._onDidInitiateWorkspaceTrustRequestOnStartup.event;


	constructor(
		private trusted: boolean = true
	) {
		super();
	}

	get acceptsOutOfWorkspaceFiles(): boolean {
		throw new Error('Method not implemented.');
	}

	set acceptsOutOfWorkspaceFiles(value: boolean) {
		throw new Error('Method not implemented.');
	}

	addWorkspaceTrustTransitionParticipant(participant: IWorkspaceTrustTransitionParticipant): IDisposable {
		throw new Error('Method not implemented.');
	}

	getTrustedUris(): URI[] {
		throw new Error('Method not implemented.');
	}

	setParentFolderTrust(trusted: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	getUriTrustInfo(uri: URI): Promise<IWorkspaceTrustUriInfo> {
		throw new Error('Method not implemented.');
	}

	async setTrustedUris(folders: URI[]): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async setUrisTrust(uris: URI[], trusted: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	canSetParentFolderTrust(): boolean {
		throw new Error('Method not implemented.');
	}

	canSetWorkspaceTrust(): boolean {
		throw new Error('Method not implemented.');
	}

	isWorkspaceTrusted(): boolean {
		return this.trusted;
	}

	isWorkspaceTrustForced(): boolean {
		return false;
	}

	get workspaceTrustInitialized(): Promise<void> {
		return Promise.resolve();
	}

	get workspaceResolved(): Promise<void> {
		return Promise.resolve();
	}

	async setWorkspaceTrust(trusted: boolean): Promise<void> {
		if (this.trusted !== trusted) {
			this.trusted = trusted;
			this._onDidChangeTrust.fire(this.trusted);
		}
	}
}

export class TestWorkspaceTrustRequestService extends Disposable implements IWorkspaceTrustRequestService {
	_serviceBrand: any;

	private readonly _onDidInitiateOpenFilesTrustRequest = this._register(new Emitter<void>());
	readonly onDidInitiateOpenFilesTrustRequest = this._onDidInitiateOpenFilesTrustRequest.event;

	private readonly _onDidInitiateWorkspaceTrustRequest = this._register(new Emitter<WorkspaceTrustRequestOptions>());
	readonly onDidInitiateWorkspaceTrustRequest = this._onDidInitiateWorkspaceTrustRequest.event;

	private readonly _onDidInitiateWorkspaceTrustRequestOnStartup = this._register(new Emitter<void>());
	readonly onDidInitiateWorkspaceTrustRequestOnStartup = this._onDidInitiateWorkspaceTrustRequestOnStartup.event;

	constructor(private readonly _trusted: boolean) {
		super();
	}

	requestOpenUrisHandler = async (uris: URI[]) => {
		return WorkspaceTrustUriResponse.Open;
	};

	requestOpenFilesTrust(uris: URI[]): Promise<WorkspaceTrustUriResponse> {
		return this.requestOpenUrisHandler(uris);
	}

	async completeOpenFilesTrustRequest(result: WorkspaceTrustUriResponse, saveResponse: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	cancelWorkspaceTrustRequest(): void {
		throw new Error('Method not implemented.');
	}

	async completeWorkspaceTrustRequest(trusted?: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async requestWorkspaceTrust(options?: WorkspaceTrustRequestOptions): Promise<boolean> {
		return this._trusted;
	}

	requestWorkspaceTrustOnStartup(): void {
		throw new Error('Method not implemented.');
	}
}

export class TestMarkerService implements IMarkerService {

	_serviceBrand: undefined;

	onMarkerChanged = Event.None;

	getStatistics(): MarkerStatistics { throw new Error('Method not implemented.'); }
	changeOne(owner: string, resource: URI, markers: IMarkerData[]): void { }
	changeAll(owner: string, data: IResourceMarker[]): void { }
	remove(owner: string, resources: URI[]): void { }
	read(filter?: { owner?: string | undefined; resource?: URI | undefined; severities?: number | undefined; take?: number | undefined } | undefined): IMarker[] { return []; }
	installResourceFilter(resource: URI, reason: string): IDisposable {
		return { dispose: () => { /* TODO: Implement cleanup logic */ } };
	}
}

export class TestFileService implements IFileService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidFilesChange = new Emitter<FileChangesEvent>();
	get onDidFilesChange(): Event<FileChangesEvent> { return this._onDidFilesChange.event; }
	fireFileChanges(event: FileChangesEvent): void { this._onDidFilesChange.fire(event); }

	private readonly _onDidRunOperation = new Emitter<FileOperationEvent>();
	get onDidRunOperation(): Event<FileOperationEvent> { return this._onDidRunOperation.event; }
	fireAfterOperation(event: FileOperationEvent): void { this._onDidRunOperation.fire(event); }

	private readonly _onDidChangeFileSystemProviderCapabilities = new Emitter<IFileSystemProviderCapabilitiesChangeEvent>();
	get onDidChangeFileSystemProviderCapabilities(): Event<IFileSystemProviderCapabilitiesChangeEvent> { return this._onDidChangeFileSystemProviderCapabilities.event; }
	fireFileSystemProviderCapabilitiesChangeEvent(event: IFileSystemProviderCapabilitiesChangeEvent): void { this._onDidChangeFileSystemProviderCapabilities.fire(event); }

	private _onWillActivateFileSystemProvider = new Emitter<IFileSystemProviderActivationEvent>();
	readonly onWillActivateFileSystemProvider = this._onWillActivateFileSystemProvider.event;
	readonly onDidWatchError = Event.None;

	protected content = 'Hello Html';
	protected lastReadFileUri!: URI;

	readonly = false;

	// Tracking functionality for tests
	readonly writeOperations: Array<{ resource: URI; content: string }> = [];
	readonly readOperations: Array<{ resource: URI }> = [];

	setContent(content: string): void { this.content = content; }
	getContent(): string { return this.content; }
	getLastReadFileUri(): URI { return this.lastReadFileUri; }

	// Clear tracking data for tests
	clearTracking(): void {
		this.writeOperations.length = 0;
		this.readOperations.length = 0;
	}

	resolve(resource: URI, _options: IResolveMetadataFileOptions): Promise<IFileStatWithMetadata>;
	resolve(resource: URI, _options?: IResolveFileOptions): Promise<IFileStat>;
	async resolve(resource: URI, _options?: IResolveFileOptions): Promise<IFileStat> {
		return createFileStat(resource, this.readonly);
	}

	stat(resource: URI): Promise<IFileStatWithPartialMetadata> {
		return this.resolve(resource, { resolveMetadata: true });
	}

	async realpath(resource: URI): Promise<URI> {
		return resource;
	}

	async resolveAll(toResolve: { resource: URI; options?: IResolveFileOptions }[]): Promise<IFileStatResult[]> {
		const stats = await Promise.all(toResolve.map(resourceAndOption => this.resolve(resourceAndOption.resource, resourceAndOption.options)));

		return stats.map(stat => ({ stat, success: true }));
	}

	readonly notExistsSet = new ResourceMap<boolean>();

	async exists(_resource: URI): Promise<boolean> { return !this.notExistsSet.has(_resource); }

	readShouldThrowError: Error | undefined = undefined;

	async readFile(resource: URI, options?: IReadFileOptions | undefined): Promise<IFileContent> {
		if (this.readShouldThrowError) {
			throw this.readShouldThrowError;
		}

		this.lastReadFileUri = resource;
		this.readOperations.push({ resource });

		return {
			...createFileStat(resource, this.readonly),
			value: VSBuffer.fromString(this.content)
		};
	}

	async readFileStream(resource: URI, options?: IReadFileStreamOptions | undefined): Promise<IFileStreamContent> {
		if (this.readShouldThrowError) {
			throw this.readShouldThrowError;
		}

		this.lastReadFileUri = resource;

		return {
			...createFileStat(resource, this.readonly),
			value: bufferToStream(VSBuffer.fromString(this.content))
		};
	}

	writeShouldThrowError: Error | undefined = undefined;

	async writeFile(resource: URI, bufferOrReadable: VSBuffer | VSBufferReadable, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		await timeout(0);

		if (this.writeShouldThrowError) {
			throw this.writeShouldThrowError;
		}

		let content: VSBuffer | undefined;
		if (bufferOrReadable instanceof VSBuffer) {
			content = bufferOrReadable;
		} else {
			try {
				content = readableToBuffer(bufferOrReadable);
			} catch {
				// Some preexisting tests are writing with invalid objects
			}
		}

		if (content) {
			this.writeOperations.push({ resource, content: content.toString() });
		}

		return createFileStat(resource, this.readonly);
	}

	move(_source: URI, _target: URI, _overwrite?: boolean): Promise<IFileStatWithMetadata> { return Promise.resolve(null!); }
	copy(_source: URI, _target: URI, _overwrite?: boolean): Promise<IFileStatWithMetadata> { return Promise.resolve(null!); }
	async cloneFile(_source: URI, _target: URI): Promise<void> { }
	createFile(_resource: URI, _content?: VSBuffer | VSBufferReadable, _options?: ICreateFileOptions): Promise<IFileStatWithMetadata> { return Promise.resolve(null!); }
	createFolder(_resource: URI): Promise<IFileStatWithMetadata> { return Promise.resolve(null!); }

	onDidChangeFileSystemProviderRegistrations = Event.None;

	private providers = new Map<string, IFileSystemProvider>();

	registerProvider(scheme: string, provider: IFileSystemProvider) {
		this.providers.set(scheme, provider);

		return toDisposable(() => this.providers.delete(scheme));
	}

	getProvider(scheme: string) {
		return this.providers.get(scheme);
	}

	async activateProvider(_scheme: string): Promise<void> {
		this._onWillActivateFileSystemProvider.fire({ scheme: _scheme, join: () => { } });
	}
	async canHandleResource(resource: URI): Promise<boolean> { return this.hasProvider(resource); }
	hasProvider(resource: URI): boolean { return resource.scheme === Schemas.file || this.providers.has(resource.scheme); }
	listCapabilities() {
		return [
			{ scheme: Schemas.file, capabilities: FileSystemProviderCapabilities.FileOpenReadWriteClose },
			...Iterable.map(this.providers, ([scheme, p]) => { return { scheme, capabilities: p.capabilities }; })
		];
	}
	hasCapability(resource: URI, capability: FileSystemProviderCapabilities): boolean {
		if (capability === FileSystemProviderCapabilities.PathCaseSensitive && isLinux) {
			return true;
		}

		const provider = this.getProvider(resource.scheme);

		return !!(provider && (provider.capabilities & capability));
	}

	async del(_resource: URI, _options?: { useTrash?: boolean; recursive?: boolean }): Promise<void> { }

	createWatcher(resource: URI, options: IWatchOptions): IFileSystemWatcher {
		return {
			onDidChange: Event.None,
			dispose: () => { }
		};
	}


	readonly watches: URI[] = [];
	watch(_resource: URI, options: IWatchOptionsWithCorrelation): IFileSystemWatcher;
	watch(_resource: URI): IDisposable;
	watch(_resource: URI): IDisposable {
		this.watches.push(_resource);

		return toDisposable(() => this.watches.splice(this.watches.indexOf(_resource), 1));
	}

	getWriteEncoding(_resource: URI): IResourceEncoding { return { encoding: 'utf8', hasBOM: false }; }
	dispose(): void { }

	async canCreateFile(source: URI, options?: ICreateFileOptions): Promise<Error | true> { return true; }
	async canMove(source: URI, target: URI, overwrite?: boolean | undefined): Promise<Error | true> { return true; }
	async canCopy(source: URI, target: URI, overwrite?: boolean | undefined): Promise<Error | true> { return true; }
	async canDelete(resource: URI, options?: { useTrash?: boolean | undefined; recursive?: boolean | undefined } | undefined): Promise<Error | true> { return true; }
}

/**
 * TestFileService with in-memory file storage.
 * Use this when your test needs to write files and read them back.
 */
export class InMemoryTestFileService extends TestFileService {

	private files = new Map<string, VSBuffer>();

	override clearTracking(): void {
		super.clearTracking();
		this.files.clear();
	}

	override async readFile(resource: URI, options?: IReadFileOptions | undefined): Promise<IFileContent> {
		if (this.readShouldThrowError) {
			throw this.readShouldThrowError;
		}

		this.lastReadFileUri = resource;
		this.readOperations.push({ resource });

		// Check if we have content in our in-memory store
		const content = this.files.get(resource.toString());
		if (content) {
			return {
				...createFileStat(resource, this.readonly),
				value: content
			};
		}

		return {
			...createFileStat(resource, this.readonly),
			value: VSBuffer.fromString(this.content)
		};
	}

	override async writeFile(resource: URI, bufferOrReadable: VSBuffer | VSBufferReadable, options?: IWriteFileOptions): Promise<IFileStatWithMetadata> {
		await timeout(0);

		if (this.writeShouldThrowError) {
			throw this.writeShouldThrowError;
		}

		let content: VSBuffer;
		if (bufferOrReadable instanceof VSBuffer) {
			content = bufferOrReadable;
		} else {
			content = readableToBuffer(bufferOrReadable);
		}

		// Store in memory and track
		this.files.set(resource.toString(), content);
		this.writeOperations.push({ resource, content: content.toString() });

		return createFileStat(resource, this.readonly);
	}
}

export class TestChatEntitlementService implements IChatEntitlementService {

	_serviceBrand: undefined;

	readonly organisations: undefined;
	readonly isInternal = false;
	readonly sku = undefined;

	readonly onDidChangeQuotaExceeded = Event.None;
	readonly onDidChangeQuotaRemaining = Event.None;
	readonly quotas = {};

	update(token: CancellationToken): Promise<void> {
		throw new Error('Method not implemented.');
	}

	readonly onDidChangeSentiment = Event.None;
	readonly sentimentObs = observableValue({}, {});
	readonly sentiment = {};

	readonly onDidChangeEntitlement = Event.None;
	entitlement: ChatEntitlement = ChatEntitlement.Unknown;
	readonly entitlementObs = observableValue({}, ChatEntitlement.Unknown);

	readonly anonymous = false;
	onDidChangeAnonymous = Event.None;
	readonly anonymousObs = observableValue({}, false);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/electron-browser/resolveExternal.test.ts]---
Location: vscode-main/src/vs/workbench/test/electron-browser/resolveExternal.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { NativeWindow } from '../../electron-browser/window.js';
import { ITunnelService, RemoteTunnel } from '../../../platform/tunnel/common/tunnel.js';
import { URI } from '../../../base/common/uri.js';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IAddressProvider } from '../../../platform/remote/common/remoteAgentConnection.js';
import { workbenchInstantiationService } from './workbenchTestServices.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';

type PortMap = Record<number, number>;

class TunnelMock implements Partial<ITunnelService> {
	private assignedPorts: PortMap = {};
	private expectedDispose = false;

	reset(ports: PortMap) {
		this.assignedPorts = ports;
	}

	expectDispose() {
		this.expectedDispose = true;
	}

	getExistingTunnel(): Promise<string | RemoteTunnel | undefined> {
		return Promise.resolve(undefined);
	}

	openTunnel(_addressProvider: IAddressProvider | undefined, _host: string | undefined, port: number): Promise<RemoteTunnel | string | undefined> | undefined {
		if (!this.assignedPorts[port]) {
			return Promise.reject(new Error('Unexpected tunnel request'));
		}
		const res: RemoteTunnel = {
			localAddress: `localhost:${this.assignedPorts[port]}`,
			tunnelRemoteHost: '4.3.2.1',
			tunnelRemotePort: this.assignedPorts[port],
			privacy: '',
			dispose: () => {
				assert(this.expectedDispose, 'Unexpected dispose');
				this.expectedDispose = false;
				return Promise.resolve();
			}
		};
		delete this.assignedPorts[port];
		return Promise.resolve(res);
	}

	validate() {
		try {
			assert(Object.keys(this.assignedPorts).length === 0, 'Expected tunnel to be used');
			assert(!this.expectedDispose, 'Expected dispose to be called');
		} finally {
			this.expectedDispose = false;
		}
	}
}

class TestNativeWindow extends NativeWindow {
	protected override create(): void { }
	protected override registerListeners(): void { }
	protected override enableMultiWindowAwareTimeout(): void { }
}

suite.skip('NativeWindow:resolveExternal', () => {
	const disposables = new DisposableStore();
	const tunnelMock = new TunnelMock();
	let window: TestNativeWindow;

	setup(() => {
		const instantiationService: TestInstantiationService = <TestInstantiationService>workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(ITunnelService, tunnelMock);
		window = disposables.add(instantiationService.createInstance(TestNativeWindow));
	});

	teardown(() => {
		disposables.clear();
	});

	async function doTest(uri: string, ports: PortMap = {}, expectedUri?: string) {
		tunnelMock.reset(ports);
		const res = await window.resolveExternalUri(URI.parse(uri), {
			allowTunneling: true,
			openExternal: true
		});
		assert.strictEqual(!expectedUri, !res, `Expected URI ${expectedUri} but got ${res}`);
		if (expectedUri && res) {
			assert.strictEqual(res.resolved.toString(), URI.parse(expectedUri).toString());
		}
		tunnelMock.validate();
	}

	test('invalid', async () => {
		await doTest('file:///foo.bar/baz');
		await doTest('http://foo.bar/path');
	});
	test('simple', async () => {
		await doTest('http://localhost:1234/path', { 1234: 1234 }, 'http://localhost:1234/path');
	});
	test('all interfaces', async () => {
		await doTest('http://0.0.0.0:1234/path', { 1234: 1234 }, 'http://localhost:1234/path');
	});
	test('changed port', async () => {
		await doTest('http://localhost:1234/path', { 1234: 1235 }, 'http://localhost:1235/path');
	});
	test('query', async () => {
		await doTest('http://foo.bar/path?a=b&c=http%3a%2f%2flocalhost%3a4455', { 4455: 4455 }, 'http://foo.bar/path?a=b&c=http%3a%2f%2flocalhost%3a4455');
	});
	test('query with different port', async () => {
		tunnelMock.expectDispose();
		await doTest('http://foo.bar/path?a=b&c=http%3a%2f%2flocalhost%3a4455', { 4455: 4567 });
	});
	test('both url and query', async () => {
		await doTest('http://localhost:1234/path?a=b&c=http%3a%2f%2flocalhost%3a4455',
			{ 1234: 4321, 4455: 4455 },
			'http://localhost:4321/path?a=b&c=http%3a%2f%2flocalhost%3a4455');
	});
	test('both url and query, query rejected', async () => {
		tunnelMock.expectDispose();
		await doTest('http://localhost:1234/path?a=b&c=http%3a%2f%2flocalhost%3a4455',
			{ 1234: 4321, 4455: 5544 },
			'http://localhost:4321/path?a=b&c=http%3a%2f%2flocalhost%3a4455');
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/electron-browser/treeSitterTokenizationFeature.test.ts]---
Location: vscode-main/src/vs/workbench/test/electron-browser/treeSitterTokenizationFeature.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { TestInstantiationService } from '../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../base/test/common/utils.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { ILogService, NullLogService } from '../../../platform/log/common/log.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel } from '../../../platform/telemetry/common/telemetry.js';
import { ClassifiedEvent, OmitMetadata, IGDPRProperty, StrictPropertyCheck } from '../../../platform/telemetry/common/gdprTypings.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { ModelService } from '../../../editor/common/services/modelService.js';

import { FileService } from '../../../platform/files/common/fileService.js';
import { Schemas } from '../../../base/common/network.js';
import { TestIPCFileSystemProvider } from './workbenchTestServices.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { LanguageService } from '../../../editor/common/services/languageService.js';
import { TestColorTheme, TestThemeService } from '../../../platform/theme/test/common/testThemeService.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { ITextResourcePropertiesService } from '../../../editor/common/services/textResourceConfiguration.js';
import { TestTextResourcePropertiesService } from '../common/workbenchTestServices.js';
import { TestLanguageConfigurationService } from '../../../editor/test/common/modes/testLanguageConfigurationService.js';
import { ILanguageConfigurationService } from '../../../editor/common/languages/languageConfigurationRegistry.js';
import { IUndoRedoService } from '../../../platform/undoRedo/common/undoRedo.js';
import { UndoRedoService } from '../../../platform/undoRedo/common/undoRedoService.js';
import { TestDialogService } from '../../../platform/dialogs/test/common/testDialogService.js';
import { TestNotificationService } from '../../../platform/notification/test/common/testNotificationService.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ProbeScope, TokenStyle } from '../../../platform/theme/common/tokenClassificationRegistry.js';
import { TextMateThemingRuleDefinitions } from '../../services/themes/common/colorThemeData.js';
import { Color } from '../../../base/common/color.js';
import { Range } from '../../../editor/common/core/range.js';
import { TokenUpdate } from '../../../editor/common/model/tokens/treeSitter/tokenStore.js';
import { ITreeSitterLibraryService } from '../../../editor/common/services/treeSitter/treeSitterLibraryService.js';
import { TreeSitterLibraryService } from '../../services/treeSitter/browser/treeSitterLibraryService.js';
import { TokenizationTextModelPart } from '../../../editor/common/model/tokens/tokenizationTextModelPart.js';
import { TreeSitterSyntaxTokenBackend } from '../../../editor/common/model/tokens/treeSitter/treeSitterSyntaxTokenBackend.js';
import { TreeParseUpdateEvent, TreeSitterTree } from '../../../editor/common/model/tokens/treeSitter/treeSitterTree.js';
import { ITextModel } from '../../../editor/common/model.js';
import { TreeSitterTokenizationImpl } from '../../../editor/common/model/tokens/treeSitter/treeSitterTokenizationImpl.js';
import { autorunHandleChanges, recordChanges, waitForState } from '../../../base/common/observable.js';
import { ITreeSitterThemeService } from '../../../editor/common/services/treeSitter/treeSitterThemeService.js';
import { TreeSitterThemeService } from '../../services/treeSitter/browser/treeSitterThemeService.js';

class MockTelemetryService implements ITelemetryService {
	_serviceBrand: undefined;
	telemetryLevel: TelemetryLevel = TelemetryLevel.NONE;
	sessionId: string = '';
	machineId: string = '';
	sqmId: string = '';
	devDeviceId: string = '';
	firstSessionDate: string = '';
	sendErrorTelemetry: boolean = false;
	publicLog(eventName: string, data?: ITelemetryData): void {
	}
	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
	}
	publicLogError(errorEventName: string, data?: ITelemetryData): void {
	}
	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
	}
	setExperimentProperty(name: string, value: string): void {
	}
}


class TestTreeSitterColorTheme extends TestColorTheme {
	public resolveScopes(scopes: ProbeScope[], definitions?: TextMateThemingRuleDefinitions): TokenStyle | undefined {
		return new TokenStyle(Color.red, undefined, undefined, undefined, undefined);
	}
	public getTokenColorIndex(): { get: () => number } {
		return { get: () => 10 };
	}
}

suite('Tree Sitter TokenizationFeature', function () {

	let instantiationService: TestInstantiationService;
	let modelService: IModelService;
	let fileService: IFileService;
	let textResourcePropertiesService: ITextResourcePropertiesService;
	let languageConfigurationService: ILanguageConfigurationService;
	let telemetryService: ITelemetryService;
	let logService: ILogService;
	let configurationService: IConfigurationService;
	let themeService: IThemeService;
	let languageService: ILanguageService;
	let environmentService: IEnvironmentService;

	let disposables: DisposableStore;

	setup(async () => {
		disposables = new DisposableStore();
		instantiationService = disposables.add(new TestInstantiationService());

		telemetryService = new MockTelemetryService();
		logService = new NullLogService();
		configurationService = new TestConfigurationService({ 'editor.experimental.preferTreeSitter.typescript': true });
		themeService = new TestThemeService(new TestTreeSitterColorTheme());
		environmentService = {} as IEnvironmentService;

		instantiationService.set(IEnvironmentService, environmentService);
		instantiationService.set(IConfigurationService, configurationService);
		instantiationService.set(ILogService, logService);
		instantiationService.set(ITelemetryService, telemetryService);
		languageService = disposables.add(instantiationService.createInstance(LanguageService));
		instantiationService.set(ILanguageService, languageService);
		instantiationService.set(IThemeService, themeService);
		textResourcePropertiesService = instantiationService.createInstance(TestTextResourcePropertiesService);
		instantiationService.set(ITextResourcePropertiesService, textResourcePropertiesService);
		languageConfigurationService = disposables.add(instantiationService.createInstance(TestLanguageConfigurationService));
		instantiationService.set(ILanguageConfigurationService, languageConfigurationService);

		fileService = disposables.add(instantiationService.createInstance(FileService));
		const fileSystemProvider = new TestIPCFileSystemProvider();
		disposables.add(fileService.registerProvider(Schemas.file, fileSystemProvider));
		instantiationService.set(IFileService, fileService);

		const libraryService = disposables.add(instantiationService.createInstance(TreeSitterLibraryService));
		libraryService.isTest = true;
		instantiationService.set(ITreeSitterLibraryService, libraryService);

		instantiationService.set(ITreeSitterThemeService, instantiationService.createInstance(TreeSitterThemeService));

		const dialogService = new TestDialogService();
		const notificationService = new TestNotificationService();
		const undoRedoService = new UndoRedoService(dialogService, notificationService);
		instantiationService.set(IUndoRedoService, undoRedoService);
		modelService = new ModelService(
			configurationService,
			textResourcePropertiesService,
			undoRedoService,
			instantiationService
		);
		instantiationService.set(IModelService, modelService);
	});

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	function tokensContentSize(tokens: TokenUpdate[]) {
		return tokens[tokens.length - 1].startOffsetInclusive + tokens[tokens.length - 1].length;
	}

	let nameNumber = 1;
	async function getModelAndPrepTree(content: string): Promise<{ model: ITextModel; treeSitterTree: TreeSitterTree; tokenizationImpl: TreeSitterTokenizationImpl }> {
		const model = disposables.add(modelService.createModel(content, { languageId: 'typescript', onDidChange: Event.None }, URI.file(`file${nameNumber++}.ts`)));
		const treeSitterTreeObs = disposables.add((model.tokenization as TokenizationTextModelPart).tokens.get() as TreeSitterSyntaxTokenBackend).tree;
		const tokenizationImplObs = disposables.add((model.tokenization as TokenizationTextModelPart).tokens.get() as TreeSitterSyntaxTokenBackend).tokenizationImpl;
		const treeSitterTree = treeSitterTreeObs.get() ?? await waitForState(treeSitterTreeObs);
		if (!treeSitterTree.tree.get()) {
			await waitForState(treeSitterTree.tree);
		}
		const tokenizationImpl = tokenizationImplObs.get() ?? await waitForState(tokenizationImplObs);

		assert.ok(treeSitterTree);
		return { model, treeSitterTree, tokenizationImpl };
	}

	function verifyTokens(tokens: TokenUpdate[] | undefined) {
		assert.ok(tokens);
		for (let i = 1; i < tokens.length; i++) {
			const previousToken: TokenUpdate = tokens[i - 1];
			const token: TokenUpdate = tokens[i];
			assert.deepStrictEqual(previousToken.startOffsetInclusive + previousToken.length, token.startOffsetInclusive);
		}
	}

	test('Three changes come back to back ', async () => {
		const content = `/**
**/
class x {
}




class y {
}`;
		const { model, treeSitterTree } = await getModelAndPrepTree(content);

		let updateListener: IDisposable | undefined;
		const changePromise = new Promise<TreeParseUpdateEvent | undefined>(resolve => {
			updateListener = autorunHandleChanges({
				owner: this,
				changeTracker: recordChanges({ tree: treeSitterTree.tree }),
			}, (reader, ctx) => {
				const changeEvent = ctx.changes.at(0)?.change;
				if (changeEvent) {
					resolve(changeEvent);
				}
			});
		});

		const edit1 = new Promise<void>(resolve => {
			model.applyEdits([{ range: new Range(7, 1, 8, 1), text: '' }]);
			resolve();
		});
		const edit2 = new Promise<void>(resolve => {
			model.applyEdits([{ range: new Range(6, 1, 7, 1), text: '' }]);
			resolve();
		});
		const edit3 = new Promise<void>(resolve => {
			model.applyEdits([{ range: new Range(5, 1, 6, 1), text: '' }]);
			resolve();
		});
		const edits = Promise.all([edit1, edit2, edit3]);
		const change = await changePromise;
		await edits;
		assert.ok(change);

		assert.strictEqual(change.versionId, 4);
		assert.strictEqual(change.ranges[0].newRangeStartOffset, 0);
		assert.strictEqual(change.ranges[0].newRangeEndOffset, 32);
		assert.strictEqual(change.ranges[0].newRange.startLineNumber, 1);
		assert.strictEqual(change.ranges[0].newRange.endLineNumber, 7);

		updateListener?.dispose();
		modelService.destroyModel(model.uri);
	});

	test('File single line file', async () => {
		const content = `console.log('x');`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 1, 18), 0, 17);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 9);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with new lines at beginning and end', async () => {
		const content = `
console.log('x');
`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 3, 1), 0, 19);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 11);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with new lines at beginning and end \\r\\n', async () => {
		const content = '\r\nconsole.log(\'x\');\r\n';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 3, 1), 0, 21);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 11);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with empty lines in the middle', async () => {
		const content = `
console.log('x');

console.log('7');
`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 5, 1), 0, 38);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 21);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with empty lines in the middle \\r\\n', async () => {
		const content = '\r\nconsole.log(\'x\');\r\n\r\nconsole.log(\'7\');\r\n';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 5, 1), 0, 42);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 21);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with non-empty lines that match no scopes', async () => {
		const content = `console.log('x');
;
{
}
`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 5, 1), 0, 24);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 16);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with non-empty lines that match no scopes \\r\\n', async () => {
		const content = 'console.log(\'x\');\r\n;\r\n{\r\n}\r\n';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 5, 1), 0, 28);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 16);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with tree-sitter token that spans multiple lines', async () => {
		const content = `/**
**/

console.log('x');

`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 6, 1), 0, 28);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 12);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with tree-sitter token that spans multiple lines \\r\\n', async () => {
		const content = '/**\r\n**/\r\n\r\nconsole.log(\'x\');\r\n\r\n';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 6, 1), 0, 33);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 12);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with tabs', async () => {
		const content = `function x() {
	return true;
}

class Y {
	private z = false;
}`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 7, 1), 0, 63);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 30);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('File with tabs \\r\\n', async () => {
		const content = 'function x() {\r\n\treturn true;\r\n}\r\n\r\nclass Y {\r\n\tprivate z = false;\r\n}';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 7, 1), 0, 69);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 30);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('Template string', async () => {
		const content = '`t ${6}`';
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 1, 8), 0, 8);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 6);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

	test('Many nested scopes', async () => {
		const content = `y = new x(ttt({
	message: '{0} i\\n\\n [commandName]({1}).',
	args: ['Test', \`command:\${openSettingsCommand}?\${encodeURIComponent('["SettingName"]')}\`],
	// To make sure the translators don't break the link
	comment: ["{Locked=']({'}"]
}));`;
		const { model, tokenizationImpl } = await getModelAndPrepTree(content);
		const tokens = tokenizationImpl.getTokensInRange(new Range(1, 1, 6, 5), 0, 238);
		verifyTokens(tokens);
		assert.deepStrictEqual(tokens?.length, 65);
		assert.deepStrictEqual(tokensContentSize(tokens), content.length);
		modelService.destroyModel(model.uri);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/test/electron-browser/workbenchTestServices.ts]---
Location: vscode-main/src/vs/workbench/test/electron-browser/workbenchTestServices.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { insert } from '../../../base/common/arrays.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI } from '../../../base/common/uri.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ModelService } from '../../../editor/common/services/modelService.js';
import { TestConfigurationService } from '../../../platform/configuration/test/common/testConfigurationService.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IFileDialogService, INativeOpenDialogOptions } from '../../../platform/dialogs/common/dialogs.js';
import { IEnvironmentService, INativeEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IExtensionManagementService } from '../../../platform/extensionManagement/common/extensionManagement.js';
import { AbstractNativeExtensionTipsService } from '../../../platform/extensionManagement/common/extensionTipsService.js';
import { IExtensionRecommendationNotificationService } from '../../../platform/extensionRecommendations/common/extensionRecommendations.js';
import { IFileService, IFileSystemProvider, FileSystemProviderCapabilities, IFileReadStreamOptions, IFileWriteOptions, IFileOpenOptions, IFileDeleteOptions, IFileOverwriteOptions, IStat, FileType, IWatchOptions } from '../../../platform/files/common/files.js';
import { FileService } from '../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../platform/files/common/inMemoryFilesystemProvider.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ISharedProcessService } from '../../../platform/ipc/electron-browser/services.js';
import { NullLogService } from '../../../platform/log/common/log.js';
import { INativeHostOptions, INativeHostService, IOSProperties, IOSStatistics } from '../../../platform/native/common/native.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { AuthInfo, Credentials } from '../../../platform/request/common/request.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { IPartsSplash } from '../../../platform/theme/common/themeService.js';
import { UriIdentityService } from '../../../platform/uriIdentity/common/uriIdentityService.js';
import { FileUserDataProvider } from '../../../platform/userData/common/fileUserDataProvider.js';
import { UserDataProfilesService } from '../../../platform/userDataProfile/common/userDataProfile.js';
import { IColorScheme, IOpenedMainWindow, IOpenEmptyWindowOptions, IOpenWindowOptions, IPoint, IRectangle, IWindowOpenable } from '../../../platform/window/common/window.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IFilesConfigurationService } from '../../services/filesConfiguration/common/filesConfigurationService.js';
import { ILifecycleService } from '../../services/lifecycle/common/lifecycle.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { ITextEditorService } from '../../services/textfile/common/textEditorService.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { NativeTextFileService } from '../../services/textfile/electron-browser/nativeTextFileService.js';
import { IWorkingCopyIdentifier } from '../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyBackupService } from '../../services/workingCopy/common/workingCopyBackup.js';
import { IWorkingCopyService } from '../../services/workingCopy/common/workingCopyService.js';
import { NativeWorkingCopyBackupService } from '../../services/workingCopy/electron-browser/workingCopyBackupService.js';
import { workbenchInstantiationService as browserWorkbenchInstantiationService, ITestInstantiationService, TestEncodingOracle, TestEnvironmentService, TestFileDialogService, TestFilesConfigurationService, TestLifecycleService, TestTextFileService } from '../browser/workbenchTestServices.js';
import { TestContextService, TestFileService } from '../common/workbenchTestServices.js';
import { ReadableStreamEvents } from '../../../base/common/stream.js';

export class TestSharedProcessService implements ISharedProcessService {

	declare readonly _serviceBrand: undefined;

	createRawConnection(): never { throw new Error('Not Implemented'); }
	getChannel(channelName: string): any { return undefined; }
	registerChannel(channelName: string, channel: any): void { }
	notifyRestored(): void { }
}

export class TestNativeHostService implements INativeHostService {
	declare readonly _serviceBrand: undefined;

	readonly windowId = -1;

	readonly onDidOpenMainWindow: Event<number> = Event.None;
	readonly onDidMaximizeWindow: Event<number> = Event.None;
	readonly onDidUnmaximizeWindow: Event<number> = Event.None;
	readonly onDidFocusMainWindow: Event<number> = Event.None;
	readonly onDidBlurMainWindow: Event<number> = Event.None;
	readonly onDidFocusMainOrAuxiliaryWindow: Event<number> = Event.None;
	readonly onDidBlurMainOrAuxiliaryWindow: Event<number> = Event.None;
	readonly onDidResumeOS: Event<unknown> = Event.None;
	onDidChangeColorScheme = Event.None;
	onDidChangePassword = Event.None;
	readonly onDidTriggerWindowSystemContextMenu: Event<{ windowId: number; x: number; y: number }> = Event.None;
	onDidChangeWindowFullScreen = Event.None;
	onDidChangeWindowAlwaysOnTop = Event.None;
	onDidChangeDisplay = Event.None;

	windowCount = Promise.resolve(1);
	getWindowCount(): Promise<number> { return this.windowCount; }

	async getWindows(): Promise<IOpenedMainWindow[]> { return []; }
	async getActiveWindowId(): Promise<number | undefined> { return undefined; }
	async getActiveWindowPosition(): Promise<IRectangle | undefined> { return undefined; }
	async getNativeWindowHandle(windowId: number): Promise<VSBuffer | undefined> { return undefined; }

	openWindow(options?: IOpenEmptyWindowOptions): Promise<void>;
	openWindow(toOpen: IWindowOpenable[], options?: IOpenWindowOptions): Promise<void>;
	openWindow(arg1?: IOpenEmptyWindowOptions | IWindowOpenable[], arg2?: IOpenWindowOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async toggleFullScreen(): Promise<void> { }
	async isMaximized(): Promise<boolean> { return true; }
	async isFullScreen(): Promise<boolean> { return true; }
	async maximizeWindow(): Promise<void> { }
	async unmaximizeWindow(): Promise<void> { }
	async minimizeWindow(): Promise<void> { }
	async moveWindowTop(options?: INativeHostOptions): Promise<void> { }
	async isWindowAlwaysOnTop(options?: INativeHostOptions): Promise<boolean> { return false; }
	async toggleWindowAlwaysOnTop(options?: INativeHostOptions): Promise<void> { }
	async setWindowAlwaysOnTop(alwaysOnTop: boolean, options?: INativeHostOptions): Promise<void> { }
	async getCursorScreenPoint(): Promise<{ readonly point: IPoint; readonly display: IRectangle }> { throw new Error('Method not implemented.'); }
	async positionWindow(position: IRectangle, options?: INativeHostOptions): Promise<void> { }
	async updateWindowControls(options: { height?: number; backgroundColor?: string; foregroundColor?: string }): Promise<void> { }
	async updateWindowAccentColor(color: string): Promise<void> { }
	async setMinimumSize(width: number | undefined, height: number | undefined): Promise<void> { }
	async saveWindowSplash(value: IPartsSplash): Promise<void> { }
	async setBackgroundThrottling(throttling: boolean): Promise<void> { }
	async focusWindow(options?: INativeHostOptions): Promise<void> { }
	async showMessageBox(options: Electron.MessageBoxOptions): Promise<Electron.MessageBoxReturnValue> { throw new Error('Method not implemented.'); }
	async showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue> { throw new Error('Method not implemented.'); }
	async showOpenDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> { throw new Error('Method not implemented.'); }
	async pickFileFolderAndOpen(options: INativeOpenDialogOptions): Promise<void> { }
	async pickFileAndOpen(options: INativeOpenDialogOptions): Promise<void> { }
	async pickFolderAndOpen(options: INativeOpenDialogOptions): Promise<void> { }
	async pickWorkspaceAndOpen(options: INativeOpenDialogOptions): Promise<void> { }
	async showItemInFolder(path: string): Promise<void> { }
	async setRepresentedFilename(path: string): Promise<void> { }
	async isAdmin(): Promise<boolean> { return false; }
	async writeElevated(source: URI, target: URI): Promise<void> { }
	async isRunningUnderARM64Translation(): Promise<boolean> { return false; }
	async getOSProperties(): Promise<IOSProperties> { return Object.create(null); }
	async getOSStatistics(): Promise<IOSStatistics> { return Object.create(null); }
	async getOSVirtualMachineHint(): Promise<number> { return 0; }
	async getOSColorScheme(): Promise<IColorScheme> { return { dark: true, highContrast: false }; }
	async hasWSLFeatureInstalled(): Promise<boolean> { return false; }
	async getProcessId(): Promise<number> { throw new Error('Method not implemented.'); }
	async killProcess(): Promise<void> { }
	async setDocumentEdited(edited: boolean): Promise<void> { }
	async openExternal(url: string, defaultApplication?: string): Promise<boolean> { return false; }
	async updateTouchBar(): Promise<void> { }
	async moveItemToTrash(): Promise<void> { }
	async newWindowTab(): Promise<void> { }
	async showPreviousWindowTab(): Promise<void> { }
	async showNextWindowTab(): Promise<void> { }
	async moveWindowTabToNewWindow(): Promise<void> { }
	async mergeAllWindowTabs(): Promise<void> { }
	async toggleWindowTabsBar(): Promise<void> { }
	async installShellCommand(): Promise<void> { }
	async uninstallShellCommand(): Promise<void> { }
	async notifyReady(): Promise<void> { }
	async relaunch(options?: { addArgs?: string[] | undefined; removeArgs?: string[] | undefined } | undefined): Promise<void> { }
	async reload(): Promise<void> { }
	async closeWindow(): Promise<void> { }
	async quit(): Promise<void> { }
	async exit(code: number): Promise<void> { }
	async openDevTools(options?: Partial<Electron.OpenDevToolsOptions> & INativeHostOptions | undefined): Promise<void> { }
	async toggleDevTools(): Promise<void> { }
	async stopTracing(): Promise<void> { }
	async openDevToolsWindow(url: string): Promise<void> { }
	async openGPUInfoWindow(): Promise<void> { }
	async openContentTracingWindow(): Promise<void> { }
	async resolveProxy(url: string): Promise<string | undefined> { return undefined; }
	async lookupAuthorization(authInfo: AuthInfo): Promise<Credentials | undefined> { return undefined; }
	async lookupKerberosAuthorization(url: string): Promise<string | undefined> { return undefined; }
	async loadCertificates(): Promise<string[]> { return []; }
	async isPortFree() { return Promise.resolve(true); }
	async findFreePort(startPort: number, giveUpAfter: number, timeout: number, stride?: number): Promise<number> { return -1; }
	async readClipboardText(type?: 'selection' | 'clipboard' | undefined): Promise<string> { return ''; }
	async writeClipboardText(text: string, type?: 'selection' | 'clipboard' | undefined): Promise<void> { }
	async readClipboardFindText(): Promise<string> { return ''; }
	async writeClipboardFindText(text: string): Promise<void> { }
	async writeClipboardBuffer(format: string, buffer: VSBuffer, type?: 'selection' | 'clipboard' | undefined): Promise<void> { }
	async triggerPaste(options?: INativeHostOptions): Promise<void> { }
	async readImage(): Promise<Uint8Array> { return Uint8Array.from([]); }
	async readClipboardBuffer(format: string): Promise<VSBuffer> { return VSBuffer.wrap(Uint8Array.from([])); }
	async hasClipboard(format: string, type?: 'selection' | 'clipboard' | undefined): Promise<boolean> { return false; }
	async windowsGetStringRegKey(hive: 'HKEY_CURRENT_USER' | 'HKEY_LOCAL_MACHINE' | 'HKEY_CLASSES_ROOT' | 'HKEY_USERS' | 'HKEY_CURRENT_CONFIG', path: string, name: string): Promise<string | undefined> { return undefined; }
	async profileRenderer(): Promise<any> { throw new Error(); }
	async getScreenshot(rect?: IRectangle): Promise<VSBuffer | undefined> { return undefined; }
}

export class TestExtensionTipsService extends AbstractNativeExtensionTipsService {

	constructor(
		@INativeEnvironmentService environmentService: INativeEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IExtensionManagementService extensionManagementService: IExtensionManagementService,
		@IStorageService storageService: IStorageService,
		@INativeHostService nativeHostService: INativeHostService,
		@IExtensionRecommendationNotificationService extensionRecommendationNotificationService: IExtensionRecommendationNotificationService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
	) {
		super(environmentService.userHome, nativeHostService, telemetryService, extensionManagementService, storageService, extensionRecommendationNotificationService, fileService, productService);
	}
}

export function workbenchInstantiationService(overrides?: {
	environmentService?: (instantiationService: IInstantiationService) => IEnvironmentService;
	fileService?: (instantiationService: IInstantiationService) => IFileService;
	configurationService?: (instantiationService: IInstantiationService) => TestConfigurationService;
	textFileService?: (instantiationService: IInstantiationService) => ITextFileService;
	pathService?: (instantiationService: IInstantiationService) => IPathService;
	editorService?: (instantiationService: IInstantiationService) => IEditorService;
	contextKeyService?: (instantiationService: IInstantiationService) => IContextKeyService;
	textEditorService?: (instantiationService: IInstantiationService) => ITextEditorService;
}, disposables = new DisposableStore()): ITestInstantiationService {
	const instantiationService = browserWorkbenchInstantiationService({
		workingCopyBackupService: () => disposables.add(new TestNativeWorkingCopyBackupService()),
		...overrides
	}, disposables);

	instantiationService.stub(INativeHostService, new TestNativeHostService());

	return instantiationService;
}

export class TestServiceAccessor {
	constructor(
		@ILifecycleService public lifecycleService: TestLifecycleService,
		@ITextFileService public textFileService: TestTextFileService,
		@IFilesConfigurationService public filesConfigurationService: TestFilesConfigurationService,
		@IWorkspaceContextService public contextService: TestContextService,
		@IModelService public modelService: ModelService,
		@IFileService public fileService: TestFileService,
		@INativeHostService public nativeHostService: TestNativeHostService,
		@IFileDialogService public fileDialogService: TestFileDialogService,
		@IWorkingCopyBackupService public workingCopyBackupService: TestNativeWorkingCopyBackupService,
		@IWorkingCopyService public workingCopyService: IWorkingCopyService,
		@IEditorService public editorService: IEditorService
	) {
	}
}

export class TestNativeTextFileServiceWithEncodingOverrides extends NativeTextFileService {

	private _testEncoding: TestEncodingOracle | undefined;
	override get encoding(): TestEncodingOracle {
		if (!this._testEncoding) {
			this._testEncoding = this._register(this.instantiationService.createInstance(TestEncodingOracle));
		}

		return this._testEncoding;
	}
}

export class TestNativeWorkingCopyBackupService extends NativeWorkingCopyBackupService implements IDisposable {

	private backupResourceJoiners: Function[];
	private discardBackupJoiners: Function[];
	discardedBackups: IWorkingCopyIdentifier[];
	discardedAllBackups: boolean;
	private pendingBackupsArr: Promise<void>[];

	constructor() {
		const environmentService = TestEnvironmentService;
		const logService = new NullLogService();
		const fileService = new FileService(logService);
		const lifecycleService = new TestLifecycleService();
		// eslint-disable-next-line local/code-no-any-casts
		super(environmentService as any, fileService, logService, lifecycleService);

		const inMemoryFileSystemProvider = this._register(new InMemoryFileSystemProvider());
		this._register(fileService.registerProvider(Schemas.inMemory, inMemoryFileSystemProvider));
		const uriIdentityService = this._register(new UriIdentityService(fileService));
		const userDataProfilesService = this._register(new UserDataProfilesService(environmentService, fileService, uriIdentityService, logService));
		this._register(fileService.registerProvider(Schemas.vscodeUserData, this._register(new FileUserDataProvider(Schemas.file, inMemoryFileSystemProvider, Schemas.vscodeUserData, userDataProfilesService, uriIdentityService, logService))));

		this.backupResourceJoiners = [];
		this.discardBackupJoiners = [];
		this.discardedBackups = [];
		this.pendingBackupsArr = [];
		this.discardedAllBackups = false;

		this._register(fileService);
		this._register(lifecycleService);
	}

	testGetFileService(): IFileService {
		return this.fileService;
	}

	async waitForAllBackups(): Promise<void> {
		await Promise.all(this.pendingBackupsArr);
	}

	joinBackupResource(): Promise<void> {
		return new Promise(resolve => this.backupResourceJoiners.push(resolve));
	}

	override async backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadableStream | VSBufferReadable, versionId?: number, meta?: any, token?: CancellationToken): Promise<void> {
		const p = super.backup(identifier, content, versionId, meta, token);
		const removeFromPendingBackups = insert(this.pendingBackupsArr, p.then(undefined, undefined));

		try {
			await p;
		} finally {
			removeFromPendingBackups();
		}

		while (this.backupResourceJoiners.length) {
			this.backupResourceJoiners.pop()!();
		}
	}

	joinDiscardBackup(): Promise<void> {
		return new Promise(resolve => this.discardBackupJoiners.push(resolve));
	}

	override async discardBackup(identifier: IWorkingCopyIdentifier): Promise<void> {
		await super.discardBackup(identifier);
		this.discardedBackups.push(identifier);

		while (this.discardBackupJoiners.length) {
			this.discardBackupJoiners.pop()!();
		}
	}

	override async discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void> {
		this.discardedAllBackups = true;

		return super.discardBackups(filter);
	}

	async getBackupContents(identifier: IWorkingCopyIdentifier): Promise<string> {
		const backupResource = this.toBackupResource(identifier);

		const fileContents = await this.fileService.readFile(backupResource);

		return fileContents.value.toString();
	}
}

export class TestIPCFileSystemProvider implements IFileSystemProvider {

	readonly capabilities = FileSystemProviderCapabilities.FileReadWrite | FileSystemProviderCapabilities.PathCaseSensitive;

	readonly onDidChangeCapabilities = Event.None;
	readonly onDidChangeFile = Event.None;

	async stat(resource: URI): Promise<IStat> {
		const { ipcRenderer } = require('electron');
		const stats = await ipcRenderer.invoke('vscode:statFile', resource.fsPath);
		return {
			type: stats.isDirectory ? FileType.Directory : (stats.isFile ? FileType.File : FileType.Unknown),
			ctime: stats.ctimeMs,
			mtime: stats.mtimeMs,
			size: stats.size,
			permissions: stats.isReadonly ? 1 /* FilePermission.Readonly */ : undefined
		};
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		const { ipcRenderer } = require('electron');
		const result = await ipcRenderer.invoke('vscode:readFile', resource.fsPath);
		return VSBuffer.wrap(result).buffer;
	}

	watch(resource: URI, opts: IWatchOptions): IDisposable { return { dispose: () => { } }; }
	mkdir(resource: URI): Promise<void> { throw new Error('mkdir not implemented in test provider'); }
	readdir(resource: URI): Promise<[string, FileType][]> { throw new Error('readdir not implemented in test provider'); }
	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> { throw new Error('delete not implemented in test provider'); }
	rename(from: URI, to: URI, opts: IFileOverwriteOptions): Promise<void> { throw new Error('rename not implemented in test provider'); }
	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> { throw new Error('writeFile not implemented in test provider'); }
	readFileStream?(resource: URI, opts: IFileReadStreamOptions, token: CancellationToken): ReadableStreamEvents<Uint8Array> { throw new Error('readFileStream not implemented in test provider'); }
	open?(resource: URI, opts: IFileOpenOptions): Promise<number> { throw new Error('open not implemented in test provider'); }
	close?(fd: number): Promise<void> { throw new Error('close not implemented in test provider'); }
	read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { throw new Error('read not implemented in test provider'); }
	write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> { throw new Error('write not implemented in test provider'); }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vscode-dts/README.md]---
Location: vscode-main/src/vscode-dts/README.md

```markdown

# vscode-dts

This is the place for the stable API and for API proposals.

## Consume a proposal

1. find a proposal you are interested in
1. add its name to your extensions `package.json#enabledApiProposals` property
1. run `npx vscode-dts dev` to download the `d.ts` files into your project
1. don't forget that extension using proposed API cannot be published
1. learn more here: <https://code.visualstudio.com/api/advanced-topics/using-proposed-api>

## Add a new proposal

1. create a _new_ file in this directory, its name must follow this pattern `vscode.proposed.[a-zA-Z]+.d.ts`
1. creating the proposal-file will automatically update `src/vs/platform/extensions/common/extensionsApiProposals.ts` (make sure to run `npm run watch`)
1. declare and implement your proposal
1. make sure to use the `checkProposedApiEnabled` and/or `isProposedApiEnabled`-utils to enforce the API being proposed. Make sure to invoke them with your proposal's name which got generated into `extensionsApiProposals.ts`
1. Most likely will need to add your proposed api to vscode-api-tests as well
```

--------------------------------------------------------------------------------

````
