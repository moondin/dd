---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 429
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 429 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookEditorModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookEditorModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { bufferToStream, VSBuffer, VSBufferReadableStream } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { IFileStatWithMetadata } from '../../../../../platform/files/common/files.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellKind, IOutputDto, NotebookData, NotebookSetting, TransientOptions } from '../../common/notebookCommon.js';
import { NotebookFileWorkingCopyModel } from '../../common/notebookEditorModel.js';
import { INotebookSerializer, INotebookService, SimpleNotebookProviderInfo } from '../../common/notebookService.js';
import { setupInstantiationService } from './testNotebookEditor.js';
import { SnapshotContext } from '../../../../services/workingCopy/common/fileWorkingCopy.js';

suite('NotebookFileWorkingCopyModel', function () {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	const configurationService = new TestConfigurationService();
	const telemetryService = new class extends mock<ITelemetryService>() {
		override publicLogError2() { }
	};
	const logservice = new class extends mock<ILogService>() { };

	teardown(() => disposables.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
	});

	test('no transient output is send to serializer', async function () {

		const notebook = instantiationService.createInstance(NotebookTextModel,
			'notebook',
			URI.file('test'),
			[{ cellKind: CellKind.Code, language: 'foo', mime: 'foo', source: 'foo', outputs: [{ outputId: 'id', outputs: [{ mime: Mimes.text, data: VSBuffer.fromString('Hello Out') }] }] }],
			{},
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false }
		);

		{ // transient output
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: true, transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.cells.length, 1);
							assert.strictEqual(notebook.cells[0].outputs.length, 0);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice
			));

			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}

		{ // NOT transient output
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: false, transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.cells.length, 1);
							assert.strictEqual(notebook.cells[0].outputs.length, 1);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice
			));
			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}
	});

	test('no transient metadata is send to serializer', async function () {

		const notebook = instantiationService.createInstance(NotebookTextModel,
			'notebook',
			URI.file('test'),
			[{ cellKind: CellKind.Code, language: 'foo', mime: 'foo', source: 'foo', outputs: [] }],
			{ foo: 123, bar: 456 },
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false }
		);

		disposables.add(notebook);

		{ // transient
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: true, transientCellMetadata: {}, transientDocumentMetadata: { bar: true }, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.metadata.foo, 123);
							assert.strictEqual(notebook.metadata.bar, undefined);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice
			));

			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}

		{ // NOT transient
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: false, transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.metadata.foo, 123);
							assert.strictEqual(notebook.metadata.bar, 456);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice

			));
			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}
	});

	test('no transient cell metadata is send to serializer', async function () {

		const notebook = instantiationService.createInstance(NotebookTextModel,
			'notebook',
			URI.file('test'),
			[{ cellKind: CellKind.Code, language: 'foo', mime: 'foo', source: 'foo', outputs: [], metadata: { foo: 123, bar: 456 } }],
			{},
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false, }
		);
		disposables.add(notebook);

		{ // transient
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: true, transientDocumentMetadata: {}, transientCellMetadata: { bar: true }, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.cells[0].metadata!.foo, 123);
							assert.strictEqual(notebook.cells[0].metadata!.bar, undefined);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice
			));

			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}

		{ // NOT transient
			let callCount = 0;
			const model = disposables.add(new NotebookFileWorkingCopyModel(
				notebook,
				mockNotebookService(notebook,
					new class extends mock<INotebookSerializer>() {
						override options: TransientOptions = { transientOutputs: false, transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {} };
						override async notebookToData(notebook: NotebookData) {
							callCount += 1;
							assert.strictEqual(notebook.cells[0].metadata!.foo, 123);
							assert.strictEqual(notebook.cells[0].metadata!.bar, 456);
							return VSBuffer.fromString('');
						}
					}
				),
				configurationService,
				telemetryService,
				logservice
			));
			await model.snapshot(SnapshotContext.Save, CancellationToken.None);
			assert.strictEqual(callCount, 1);
		}
	});

	test('Notebooks with outputs beyond the size threshold will throw for backup snapshots', async function () {
		const outputLimit = 100;
		await configurationService.setUserConfiguration(NotebookSetting.outputBackupSizeLimit, outputLimit * 1.0 / 1024);
		const largeOutput: IOutputDto = { outputId: '123', outputs: [{ mime: Mimes.text, data: VSBuffer.fromString('a'.repeat(outputLimit + 1)) }] };
		const notebook = instantiationService.createInstance(NotebookTextModel,
			'notebook',
			URI.file('test'),
			[{ cellKind: CellKind.Code, language: 'foo', mime: 'foo', source: 'foo', outputs: [largeOutput], metadata: { foo: 123, bar: 456 } }],
			{},
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false, }
		);
		disposables.add(notebook);

		let callCount = 0;
		const model = disposables.add(new NotebookFileWorkingCopyModel(
			notebook,
			mockNotebookService(notebook,
				new class extends mock<INotebookSerializer>() {
					override options: TransientOptions = { transientOutputs: true, transientDocumentMetadata: {}, transientCellMetadata: { bar: true }, cellContentMetadata: {} };
					override async notebookToData(notebook: NotebookData) {
						callCount += 1;
						assert.strictEqual(notebook.cells[0].metadata!.foo, 123);
						assert.strictEqual(notebook.cells[0].metadata!.bar, undefined);
						return VSBuffer.fromString('');
					}
				},
				configurationService
			),
			configurationService,
			telemetryService,
			logservice
		));

		try {
			await model.snapshot(SnapshotContext.Backup, CancellationToken.None);
			assert.fail('Expected snapshot to throw an error for large output');
		} catch (e) {
			assert.notEqual(e.code, 'ERR_ASSERTION', e.message);
		}

		await model.snapshot(SnapshotContext.Save, CancellationToken.None);
		assert.strictEqual(callCount, 1);

	});

	test('Notebook model will not return a save delegate if the serializer has not been retreived', async function () {
		const notebook = instantiationService.createInstance(NotebookTextModel,
			'notebook',
			URI.file('test'),
			[{ cellKind: CellKind.Code, language: 'foo', mime: 'foo', source: 'foo', outputs: [], metadata: { foo: 123, bar: 456 } }],
			{},
			{ transientCellMetadata: {}, transientDocumentMetadata: {}, cellContentMetadata: {}, transientOutputs: false, }
		);
		disposables.add(notebook);

		const serializer = new class extends mock<INotebookSerializer>() {
			override save(): Promise<IFileStatWithMetadata> {
				return Promise.resolve({ name: 'savedFile' } as IFileStatWithMetadata);
			}
		};

		let resolveSerializer: (serializer: INotebookSerializer) => void = () => { };
		const serializerPromise = new Promise<INotebookSerializer>(resolve => {
			resolveSerializer = resolve;
		});
		const notebookService = mockNotebookService(notebook, serializerPromise);
		configurationService.setUserConfiguration(NotebookSetting.remoteSaving, true);

		const model = disposables.add(new NotebookFileWorkingCopyModel(
			notebook,
			notebookService,
			configurationService,
			telemetryService,
			logservice
		));

		// the save method should not be set if the serializer is not yet resolved
		const notExist = model.save;
		assert.strictEqual(notExist, undefined);

		resolveSerializer(serializer);
		await model.getNotebookSerializer();
		const result = await model.save?.({} as IFileStatWithMetadata, {} as CancellationToken);

		assert.strictEqual(result!.name, 'savedFile');
	});
});

function mockNotebookService(notebook: NotebookTextModel, notebookSerializer: Promise<INotebookSerializer> | INotebookSerializer, configurationService: TestConfigurationService = new TestConfigurationService()): INotebookService {
	return new class extends mock<INotebookService>() {
		private serializer: INotebookSerializer | undefined = undefined;
		override async withNotebookDataProvider(viewType: string): Promise<SimpleNotebookProviderInfo> {
			this.serializer = await notebookSerializer;
			return new SimpleNotebookProviderInfo(
				notebook.viewType,
				this.serializer,
				{
					id: new ExtensionIdentifier('test'),
					location: undefined
				}
			);
		}
		override tryGetDataProviderSync(viewType: string): SimpleNotebookProviderInfo | undefined {
			if (!this.serializer) {
				return undefined;
			}
			return new SimpleNotebookProviderInfo(
				notebook.viewType,
				this.serializer,
				{
					id: new ExtensionIdentifier('test'),
					location: undefined
				}
			);
		}
		override async createNotebookTextDocumentSnapshot(uri: URI, context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream> {
			const info = await this.withNotebookDataProvider(notebook.viewType);
			const serializer = info.serializer;
			const outputSizeLimit = configurationService.getValue<number>(NotebookSetting.outputBackupSizeLimit) ?? 1024;
			const data: NotebookData = notebook.createSnapshot({ context: context, outputSizeLimit: outputSizeLimit, transientOptions: serializer.options });
			const bytes = await serializer.notebookToData(data);

			return bufferToStream(bytes);
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/NotebookEditorWidgetService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/NotebookEditorWidgetService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import assert from 'assert';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { GroupIdentifier, IEditorCloseEvent, IEditorWillMoveEvent } from '../../../../common/editor.js';
import { NotebookEditorWidget } from '../../browser/notebookEditorWidget.js';
import { NotebookEditorWidgetService } from '../../browser/services/notebookEditorServiceImpl.js';
import { NotebookEditorInput } from '../../common/notebookEditorInput.js';
import { setupInstantiationService } from './testNotebookEditor.js';
import { IEditorGroup, IEditorGroupsService, IEditorPart } from '../../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';

class TestNotebookEditorWidgetService extends NotebookEditorWidgetService {
	constructor(
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@IEditorService editorService: IEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(editorGroupService, editorService, contextKeyService, instantiationService);
	}

	protected override createWidget(): NotebookEditorWidget {
		return new class extends mock<NotebookEditorWidget>() {
			override onWillHide = () => { };
			override getDomNode = () => { return { remove: () => { } } as HTMLElement; };
			override dispose = () => { };
		};
	}
}

function createNotebookInput(path: string, editorType: string) {
	return new class extends mock<NotebookEditorInput>() {
		override resource = URI.parse(path);
		override get typeId() { return editorType; }
	};
}

suite('NotebookEditorWidgetService', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let editorGroup1: IEditorGroup;
	let editorGroup2: IEditorGroup;

	let ondidRemoveGroup: Emitter<IEditorGroup>;
	let onDidCloseEditor: Emitter<IEditorCloseEvent>;
	let onWillMoveEditor: Emitter<IEditorWillMoveEvent>;
	teardown(() => disposables.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();

		ondidRemoveGroup = new Emitter<IEditorGroup>();
		onDidCloseEditor = new Emitter<IEditorCloseEvent>();
		onWillMoveEditor = new Emitter<IEditorWillMoveEvent>();

		editorGroup1 = new class extends mock<IEditorGroup>() {
			override id = 1;
			override onDidCloseEditor = onDidCloseEditor.event;
			override onWillMoveEditor = onWillMoveEditor.event;
		};
		editorGroup2 = new class extends mock<IEditorGroup>() {
			override id = 2;
			override onDidCloseEditor = Event.None;
			override onWillMoveEditor = Event.None;
		};

		instantiationService = setupInstantiationService(disposables);
		instantiationService.stub(IEditorGroupsService, new class extends mock<IEditorGroupsService>() {
			override onDidRemoveGroup = ondidRemoveGroup.event;
			override onDidAddGroup = Event.None;
			override whenReady = Promise.resolve();
			override groups = [editorGroup1, editorGroup2];
			override getPart(group: IEditorGroup | GroupIdentifier): IEditorPart;
			override getPart(container: unknown): IEditorPart;
			override getPart(container: unknown): IEditorPart {
				return { windowId: 0 } as IEditorPart;
			}
		});
		instantiationService.stub(IEditorService, new class extends mock<IEditorService>() {
			override onDidEditorsChange = Event.None;
		});
	});

	test('Retrieve widget within group', async function () {
		const notebookEditorInput = createNotebookInput('/test.np', 'type1');
		const notebookEditorService = disposables.add(instantiationService.createInstance(TestNotebookEditorWidgetService));
		const widget = notebookEditorService.retrieveWidget(instantiationService, 1, notebookEditorInput);
		const value = widget.value;
		const widget2 = notebookEditorService.retrieveWidget(instantiationService, 1, notebookEditorInput);

		assert.notStrictEqual(widget2.value, undefined, 'should create a widget');
		assert.strictEqual(value, widget2.value, 'should return the same widget');
		assert.strictEqual(widget.value, undefined, 'initial borrow should no longer have widget');
	});

	test('Retrieve independent widgets', async function () {
		const inputType1 = createNotebookInput('/test.np', 'type1');
		const inputType2 = createNotebookInput('/test.np', 'type2');
		const notebookEditorService = disposables.add(instantiationService.createInstance(TestNotebookEditorWidgetService));
		const widget = notebookEditorService.retrieveWidget(instantiationService, 1, inputType1);
		const widgetDiffGroup = notebookEditorService.retrieveWidget(instantiationService, 2, inputType1);
		const widgetDiffType = notebookEditorService.retrieveWidget(instantiationService, 1, inputType2);

		assert.notStrictEqual(widget.value, undefined, 'should create a widget');
		assert.notStrictEqual(widgetDiffGroup.value, undefined, 'should create a widget');
		assert.notStrictEqual(widgetDiffType.value, undefined, 'should create a widget');
		assert.notStrictEqual(widget.value, widgetDiffGroup.value, 'should return a different widget');
		assert.notStrictEqual(widget.value, widgetDiffType.value, 'should return a different widget');
	});

	test('Only relevant widgets get disposed', async function () {
		const inputType1 = createNotebookInput('/test.np', 'type1');
		const inputType2 = createNotebookInput('/test.np', 'type2');
		const notebookEditorService = disposables.add(instantiationService.createInstance(TestNotebookEditorWidgetService));
		const widget = notebookEditorService.retrieveWidget(instantiationService, 1, inputType1);
		const widgetDiffType = notebookEditorService.retrieveWidget(instantiationService, 1, inputType2);
		const widgetDiffGroup = notebookEditorService.retrieveWidget(instantiationService, 2, inputType1);

		ondidRemoveGroup.fire(editorGroup1);

		assert.strictEqual(widget.value, undefined, 'widgets in group should get disposed');
		assert.strictEqual(widgetDiffType.value, undefined, 'widgets in group should get disposed');
		assert.notStrictEqual(widgetDiffGroup.value, undefined, 'other group should not be disposed');

		notebookEditorService.dispose();
	});

	test('Widget should move between groups when editor is moved', async function () {
		const inputType1 = createNotebookInput('/test.np', NotebookEditorInput.ID);
		const notebookEditorService = disposables.add(instantiationService.createInstance(TestNotebookEditorWidgetService));
		const initialValue = notebookEditorService.retrieveWidget(instantiationService, 1, inputType1).value;

		await new Promise(resolve => setTimeout(resolve, 0));

		onWillMoveEditor.fire({
			editor: inputType1,
			groupId: 1,
			target: 2,
		});

		const widgetDiffGroup = notebookEditorService.retrieveWidget(instantiationService, 2, inputType1);
		const widgetFirstGroup = notebookEditorService.retrieveWidget(instantiationService, 1, inputType1);

		assert.notStrictEqual(initialValue, undefined, 'valid widget');
		assert.strictEqual(widgetDiffGroup.value, initialValue, 'widget should be reused in new group');
		assert.notStrictEqual(widgetFirstGroup.value, initialValue, 'should create a new widget in the first group');
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookExecutionService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookExecutionService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { AsyncIterableProducer } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { assertThrowsAsync, ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { insertCellAtIndex } from '../../browser/controller/cellOperations.js';
import { NotebookExecutionService } from '../../browser/services/notebookExecutionServiceImpl.js';
import { NotebookKernelService } from '../../browser/services/notebookKernelServiceImpl.js';
import { NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellKind, IOutputDto, NotebookCellMetadata } from '../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { INotebookKernel, INotebookKernelHistoryService, INotebookKernelService, INotebookTextModelLike, VariablesResult } from '../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';
import { INotebookService } from '../../common/notebookService.js';
import { setupInstantiationService, withTestNotebook as _withTestNotebook } from './testNotebookEditor.js';

suite('NotebookExecutionService', () => {

	let instantiationService: TestInstantiationService;
	let contextKeyService: IContextKeyService;
	let kernelService: INotebookKernelService;
	let disposables: DisposableStore;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {

		disposables = new DisposableStore();

		instantiationService = setupInstantiationService(disposables);

		instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override onDidAddNotebookDocument = Event.None;
			override onWillRemoveNotebookDocument = Event.None;
			override getNotebookTextModels() { return []; }
		});

		instantiationService.stub(INotebookLoggingService, new class extends mock<INotebookLoggingService>() {
			override debug(category: string, output: string): void {
				//
			}
		});

		instantiationService.stub(IMenuService, new class extends mock<IMenuService>() {
			override createMenu() {
				return new class extends mock<IMenu>() {
					override onDidChange = Event.None;
					override getActions() { return []; }
					override dispose() { }
				};
			}
		});

		instantiationService.stub(INotebookKernelHistoryService, new class extends mock<INotebookKernelHistoryService>() {
			override getKernels(notebook: INotebookTextModelLike) {
				return kernelService.getMatchingKernel(notebook);
			}
			override addMostRecentKernel(kernel: INotebookKernel): void { }
		});

		instantiationService.stub(ICommandService, new class extends mock<ICommandService>() {
			override executeCommand(_commandId: string, ..._args: unknown[]) {
				return Promise.resolve(undefined);
			}
		});

		kernelService = disposables.add(instantiationService.createInstance(NotebookKernelService));
		instantiationService.set(INotebookKernelService, kernelService);
		contextKeyService = instantiationService.get(IContextKeyService);
	});

	async function withTestNotebook(cells: [string, string, CellKind, IOutputDto[], NotebookCellMetadata][], callback: (viewModel: NotebookViewModel, textModel: NotebookTextModel, disposables: DisposableStore) => void | Promise<void>) {
		return _withTestNotebook(cells, (editor, viewModel, disposables) => callback(viewModel, viewModel.notebookDocument, disposables));
	}

	// test('ctor', () => {
	// 	instantiationService.createInstance(NotebookEditorKernelManager, { activeKernel: undefined, viewModel: undefined });
	// 	const contextKeyService = instantiationService.get(IContextKeyService);

	// 	assert.strictEqual(contextKeyService.getContextKeyValue(NOTEBOOK_KERNEL_COUNT.key), 0);
	// });

	test('cell is not runnable when no kernel is selected', async () => {
		await withTestNotebook(
			[],
			async (viewModel, textModel, disposables) => {
				const executionService = instantiationService.createInstance(NotebookExecutionService);

				const cell = insertCellAtIndex(viewModel, 1, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true);
				await assertThrowsAsync(async () => await executionService.executeNotebookCells(textModel, [cell.model], contextKeyService));
			});
	});

	test('cell is not runnable when kernel does not support the language', async () => {
		await withTestNotebook(
			[],
			async (viewModel, textModel) => {

				disposables.add(kernelService.registerKernel(new TestNotebookKernel({ languages: ['testlang'] })));
				const executionService = disposables.add(instantiationService.createInstance(NotebookExecutionService));
				const cell = disposables.add(insertCellAtIndex(viewModel, 1, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
				await assertThrowsAsync(async () => await executionService.executeNotebookCells(textModel, [cell.model], contextKeyService));

			});
	});

	test('cell is runnable when kernel does support the language', async () => {
		await withTestNotebook(
			[],
			async (viewModel, textModel) => {
				const kernel = new TestNotebookKernel({ languages: ['javascript'] });
				disposables.add(kernelService.registerKernel(kernel));
				kernelService.selectKernelForNotebook(kernel, textModel);
				const executionService = disposables.add(instantiationService.createInstance(NotebookExecutionService));
				const executeSpy = sinon.spy();
				kernel.executeNotebookCellsRequest = executeSpy;

				const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
				await executionService.executeNotebookCells(viewModel.notebookDocument, [cell.model], contextKeyService);
				assert.strictEqual(executeSpy.calledOnce, true);
			});
	});

	test('Completes unconfirmed executions', async function () {

		return withTestNotebook([], async (viewModel, textModel) => {
			let didExecute = false;
			const kernel = new class extends TestNotebookKernel {
				constructor() {
					super({ languages: ['javascript'] });
					this.id = 'mySpecialId';
				}

				override async executeNotebookCellsRequest() {
					didExecute = true;
					return;
				}
			};

			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, textModel);
			const executionService = disposables.add(instantiationService.createInstance(NotebookExecutionService));
			const exeStateService = instantiationService.get(INotebookExecutionStateService);

			const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			await executionService.executeNotebookCells(textModel, [cell.model], contextKeyService);

			assert.strictEqual(didExecute, true);
			assert.strictEqual(exeStateService.getCellExecution(cell.uri), undefined);
		});
	});
});

class TestNotebookKernel implements INotebookKernel {
	id: string = 'test';
	label: string = '';
	viewType = '*';
	onDidChange = Event.None;
	extension: ExtensionIdentifier = new ExtensionIdentifier('test');
	localResourceRoot: URI = URI.file('/test');
	description?: string | undefined;
	detail?: string | undefined;
	preloadUris: URI[] = [];
	preloadProvides: string[] = [];
	supportedLanguages: string[] = [];
	provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult> {
		return AsyncIterableProducer.EMPTY;
	}
	executeNotebookCellsRequest(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	cancelNotebookCellExecution(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	constructor(opts?: { languages: string[] }) {
		this.supportedLanguages = opts?.languages ?? [PLAINTEXT_LANGUAGE_ID];
	}
	implementsInterrupt?: boolean | undefined;
	implementsExecutionOrder?: boolean | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookExecutionStateService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookExecutionStateService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { AsyncIterableProducer, DeferredPromise } from '../../../../../base/common/async.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { insertCellAtIndex } from '../../browser/controller/cellOperations.js';
import { NotebookExecutionService } from '../../browser/services/notebookExecutionServiceImpl.js';
import { NotebookExecutionStateService } from '../../browser/services/notebookExecutionStateServiceImpl.js';
import { NotebookKernelService } from '../../browser/services/notebookKernelServiceImpl.js';
import { NotebookViewModel } from '../../browser/viewModel/notebookViewModelImpl.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellEditType, CellKind, CellUri, IOutputDto, NotebookCellMetadata, NotebookExecutionState } from '../../common/notebookCommon.js';
import { CellExecutionUpdateType, INotebookExecutionService } from '../../common/notebookExecutionService.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../common/notebookExecutionStateService.js';
import { INotebookKernel, INotebookKernelService, VariablesResult } from '../../common/notebookKernelService.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';
import { INotebookService } from '../../common/notebookService.js';
import { setupInstantiationService, withTestNotebook as _withTestNotebook } from './testNotebookEditor.js';

suite('NotebookExecutionStateService', () => {

	let instantiationService: TestInstantiationService;
	let kernelService: INotebookKernelService;
	let disposables: DisposableStore;
	let testNotebookModel: NotebookTextModel | undefined;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {

		disposables = new DisposableStore();

		instantiationService = setupInstantiationService(disposables);

		instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override onDidAddNotebookDocument = Event.None;
			override onWillRemoveNotebookDocument = Event.None;
			override getNotebookTextModels() { return []; }
			override getNotebookTextModel(uri: URI): NotebookTextModel | undefined {
				return testNotebookModel;
			}
		});

		instantiationService.stub(IMenuService, new class extends mock<IMenuService>() {
			override createMenu() {
				return new class extends mock<IMenu>() {
					override onDidChange = Event.None;
					override getActions() { return []; }
					override dispose() { }
				};
			}
		});
		instantiationService.stub(INotebookLoggingService, new class extends mock<INotebookLoggingService>() {
			override debug(category: string, output: string): void {
				//
			}
		});

		kernelService = disposables.add(instantiationService.createInstance(NotebookKernelService));
		instantiationService.set(INotebookKernelService, kernelService);
		instantiationService.set(INotebookExecutionService, disposables.add(instantiationService.createInstance(NotebookExecutionService)));
		instantiationService.set(INotebookExecutionStateService, disposables.add(instantiationService.createInstance(NotebookExecutionStateService)));
	});

	async function withTestNotebook(cells: [string, string, CellKind, IOutputDto[], NotebookCellMetadata][], callback: (viewModel: NotebookViewModel, textModel: NotebookTextModel, disposables: DisposableStore) => void | Promise<void>) {
		return _withTestNotebook(cells, (editor, viewModel) => callback(viewModel, viewModel.notebookDocument, disposables));
	}

	function testCancelOnDelete(expectedCancels: number, implementsInterrupt: boolean) {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			let cancels = 0;
			const kernel = new class extends TestNotebookKernel {
				implementsInterrupt = implementsInterrupt;

				constructor() {
					super({ languages: ['javascript'] });
				}

				override async executeNotebookCellsRequest(): Promise<void> { }

				override async cancelNotebookCellExecution(_uri: URI, handles: number[]): Promise<void> {
					cancels += handles.length;
				}
			};
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);

			// Should cancel executing and pending cells, when kernel does not implement interrupt
			const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			const cell2 = disposables.add(insertCellAtIndex(viewModel, 1, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			const cell3 = disposables.add(insertCellAtIndex(viewModel, 2, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			insertCellAtIndex(viewModel, 3, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true); // Not deleted
			const exe = executionStateService.createCellExecution(viewModel.uri, cell.handle); // Executing
			exe.confirm();
			exe.update([{ editType: CellExecutionUpdateType.ExecutionState, executionOrder: 1 }]);
			const exe2 = executionStateService.createCellExecution(viewModel.uri, cell2.handle); // Pending
			exe2.confirm();
			executionStateService.createCellExecution(viewModel.uri, cell3.handle); // Unconfirmed
			assert.strictEqual(cancels, 0);
			viewModel.notebookDocument.applyEdits([{
				editType: CellEditType.Replace, index: 0, count: 3, cells: []
			}], true, undefined, () => undefined, undefined, false);
			assert.strictEqual(cancels, expectedCancels);
		});

	}

	// TODO@roblou Could be a test just for NotebookExecutionListeners, which can be a standalone contribution
	test('cancel execution when cell is deleted', async function () {
		return testCancelOnDelete(3, false);
	});

	test('cancel execution when cell is deleted in interrupt-type kernel', async function () {
		return testCancelOnDelete(1, true);
	});

	test('fires onDidChangeCellExecution when cell is completed while deleted', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			const cell = insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true);
			const exe = executionStateService.createCellExecution(viewModel.uri, cell.handle);

			let didFire = false;
			disposables.add(executionStateService.onDidChangeExecution(e => {
				if (e.type === NotebookExecutionType.cell) {
					didFire = !e.changed;
				}
			}));

			viewModel.notebookDocument.applyEdits([{
				editType: CellEditType.Replace, index: 0, count: 1, cells: []
			}], true, undefined, () => undefined, undefined, false);
			exe.complete({});
			assert.strictEqual(didFire, true);
		});
	});

	test('does not fire onDidChangeCellExecution for output updates', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			const exe = executionStateService.createCellExecution(viewModel.uri, cell.handle);

			let didFire = false;
			disposables.add(executionStateService.onDidChangeExecution(e => {
				if (e.type === NotebookExecutionType.cell) {
					didFire = true;
				}
			}));

			exe.update([{ editType: CellExecutionUpdateType.OutputItems, items: [], outputId: '1' }]);
			assert.strictEqual(didFire, false);
			exe.update([{ editType: CellExecutionUpdateType.ExecutionState, executionOrder: 123 }]);
			assert.strictEqual(didFire, true);
			exe.complete({});
		});
	});

	// #142466
	test('getCellExecution and onDidChangeCellExecution', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));

			const deferred = new DeferredPromise<void>();
			disposables.add(executionStateService.onDidChangeExecution(e => {
				if (e.type === NotebookExecutionType.cell) {
					const cellUri = CellUri.generate(e.notebook, e.cellHandle);
					const exe = executionStateService.getCellExecution(cellUri);
					assert.ok(exe);
					assert.strictEqual(e.notebook.toString(), exe.notebook.toString());
					assert.strictEqual(e.cellHandle, exe.cellHandle);

					assert.strictEqual(exe.notebook.toString(), e.changed?.notebook.toString());
					assert.strictEqual(exe.cellHandle, e.changed?.cellHandle);

					deferred.complete();
				}
			}));

			executionStateService.createCellExecution(viewModel.uri, cell.handle);

			return deferred.p;
		});
	});
	test('getExecution and onDidChangeExecution', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const eventRaisedWithExecution: boolean[] = [];
			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			executionStateService.onDidChangeExecution(e => eventRaisedWithExecution.push(e.type === NotebookExecutionType.notebook && !!e.changed), this, disposables);

			const deferred = new DeferredPromise<void>();
			disposables.add(executionStateService.onDidChangeExecution(e => {
				if (e.type === NotebookExecutionType.notebook) {
					const exe = executionStateService.getExecution(viewModel.uri);
					assert.ok(exe);
					assert.strictEqual(e.notebook.toString(), exe.notebook.toString());
					assert.ok(e.affectsNotebook(viewModel.uri));
					assert.deepStrictEqual(eventRaisedWithExecution, [true]);
					deferred.complete();
				}
			}));

			executionStateService.createExecution(viewModel.uri);

			return deferred.p;
		});
	});

	test('getExecution and onDidChangeExecution 2', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);

			const deferred = new DeferredPromise<void>();
			const expectedNotebookEventStates: (NotebookExecutionState | undefined)[] = [NotebookExecutionState.Unconfirmed, NotebookExecutionState.Pending, NotebookExecutionState.Executing, undefined];
			executionStateService.onDidChangeExecution(e => {
				if (e.type === NotebookExecutionType.notebook) {
					const expectedState = expectedNotebookEventStates.shift();
					if (typeof expectedState === 'number') {
						const exe = executionStateService.getExecution(viewModel.uri);
						assert.ok(exe);
						assert.strictEqual(e.notebook.toString(), exe.notebook.toString());
						assert.strictEqual(e.changed?.state, expectedState);
					} else {
						assert.ok(e.changed === undefined);
					}

					assert.ok(e.affectsNotebook(viewModel.uri));
					if (expectedNotebookEventStates.length === 0) {
						deferred.complete();
					}
				}
			}, this, disposables);

			const execution = executionStateService.createExecution(viewModel.uri);
			execution.confirm();
			execution.begin();
			execution.complete();

			return deferred.p;
		});
	});

	test('force-cancel works for Cell Execution', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			const cell = disposables.add(insertCellAtIndex(viewModel, 0, 'var c = 3', 'javascript', CellKind.Code, {}, [], true, true));
			executionStateService.createCellExecution(viewModel.uri, cell.handle);
			const exe = executionStateService.getCellExecution(cell.uri);
			assert.ok(exe);

			executionStateService.forceCancelNotebookExecutions(viewModel.uri);
			const exe2 = executionStateService.getCellExecution(cell.uri);
			assert.strictEqual(exe2, undefined);
		});
	});
	test('force-cancel works for Notebook Execution', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);
			const eventRaisedWithExecution: boolean[] = [];

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			executionStateService.onDidChangeExecution(e => eventRaisedWithExecution.push(e.type === NotebookExecutionType.notebook && !!e.changed), this, disposables);
			executionStateService.createExecution(viewModel.uri);
			const exe = executionStateService.getExecution(viewModel.uri);
			assert.ok(exe);
			assert.deepStrictEqual(eventRaisedWithExecution, [true]);

			executionStateService.forceCancelNotebookExecutions(viewModel.uri);
			const exe2 = executionStateService.getExecution(viewModel.uri);
			assert.deepStrictEqual(eventRaisedWithExecution, [true, false]);
			assert.strictEqual(exe2, undefined);
		});
	});
	test('force-cancel works for Cell and Notebook Execution', async function () {
		return withTestNotebook([], async (viewModel, _document, disposables) => {
			testNotebookModel = viewModel.notebookDocument;

			const kernel = new TestNotebookKernel();
			disposables.add(kernelService.registerKernel(kernel));
			kernelService.selectKernelForNotebook(kernel, viewModel.notebookDocument);

			const executionStateService: INotebookExecutionStateService = instantiationService.get(INotebookExecutionStateService);
			executionStateService.createExecution(viewModel.uri);
			executionStateService.createExecution(viewModel.uri);
			const cellExe = executionStateService.getExecution(viewModel.uri);
			const exe = executionStateService.getExecution(viewModel.uri);
			assert.ok(cellExe);
			assert.ok(exe);

			executionStateService.forceCancelNotebookExecutions(viewModel.uri);
			const cellExe2 = executionStateService.getExecution(viewModel.uri);
			const exe2 = executionStateService.getExecution(viewModel.uri);
			assert.strictEqual(cellExe2, undefined);
			assert.strictEqual(exe2, undefined);
		});
	});
});

class TestNotebookKernel implements INotebookKernel {
	id: string = 'test';
	label: string = '';
	viewType = '*';
	onDidChange = Event.None;
	extension: ExtensionIdentifier = new ExtensionIdentifier('test');
	localResourceRoot: URI = URI.file('/test');
	description?: string | undefined;
	detail?: string | undefined;
	preloadUris: URI[] = [];
	preloadProvides: string[] = [];
	supportedLanguages: string[] = [];
	async executeNotebookCellsRequest(): Promise<void> { }
	async cancelNotebookCellExecution(uri: URI, cellHandles: number[]): Promise<void> { }
	provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult> {
		return AsyncIterableProducer.EMPTY;
	}

	constructor(opts?: { languages?: string[]; id?: string }) {
		this.supportedLanguages = opts?.languages ?? [PLAINTEXT_LANGUAGE_ID];
		if (opts?.id) {
			this.id = opts?.id;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookFolding.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookFolding.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CellKind } from '../../common/notebookCommon.js';
import { setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { FoldingModel, updateFoldingStateAtIndex } from '../../browser/viewModel/foldingModel.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('Notebook Folding', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	teardown(() => disposables.dispose());

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		instantiationService.spy(IUndoRedoService, 'pushElement');
	});


	test('Folding based on markdown cells', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['## header 2.1', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingController = ds.add(new FoldingModel());
				foldingController.attachViewModel(viewModel);

				assert.strictEqual(foldingController.regions.findRange(1), 0);
				assert.strictEqual(foldingController.regions.findRange(2), 0);
				assert.strictEqual(foldingController.regions.findRange(3), 1);
				assert.strictEqual(foldingController.regions.findRange(4), 1);
				assert.strictEqual(foldingController.regions.findRange(5), 1);
				assert.strictEqual(foldingController.regions.findRange(6), 2);
				assert.strictEqual(foldingController.regions.findRange(7), 2);
			}
		);
	});

	test('Folding not based on code cells', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# comment 1', 'python', CellKind.Code, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3\n```\n## comment 2\n```', 'markdown', CellKind.Markup, [], {}],
				['body 4', 'markdown', CellKind.Markup, [], {}],
				['## header 2.1', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'python', CellKind.Code, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingController = ds.add(new FoldingModel());
				foldingController.attachViewModel(viewModel);

				assert.strictEqual(foldingController.regions.findRange(1), 0);
				assert.strictEqual(foldingController.regions.findRange(2), 0);
				assert.strictEqual(foldingController.regions.findRange(3), 0);
				assert.strictEqual(foldingController.regions.findRange(4), 0);
				assert.strictEqual(foldingController.regions.findRange(5), 0);
				assert.strictEqual(foldingController.regions.findRange(6), 0);
				assert.strictEqual(foldingController.regions.findRange(7), 1);
				assert.strictEqual(foldingController.regions.findRange(8), 1);
			}
		);
	});

	test('Top level header in a cell wins', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['## header 2.1\n# header3', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingController = ds.add(new FoldingModel());
				foldingController.attachViewModel(viewModel);

				assert.strictEqual(foldingController.regions.findRange(1), 0);
				assert.strictEqual(foldingController.regions.findRange(2), 0);
				assert.strictEqual(foldingController.regions.getEndLineNumber(0), 2);

				assert.strictEqual(foldingController.regions.findRange(3), 1);
				assert.strictEqual(foldingController.regions.findRange(4), 1);
				assert.strictEqual(foldingController.regions.findRange(5), 1);
				assert.strictEqual(foldingController.regions.getEndLineNumber(1), 7);

				assert.strictEqual(foldingController.regions.findRange(6), 2);
				assert.strictEqual(foldingController.regions.findRange(7), 2);
				assert.strictEqual(foldingController.regions.getEndLineNumber(2), 7);
			}
		);
	});

	test('Folding', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['## header 2.1', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 0, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 1, end: 6 }
				]);
			}
		);

		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['## header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);

				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 3, end: 4 }
				]);
			}
		);

		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);

				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 3, end: 6 }
				]);
			}
		);
	});

	test('Nested Folding', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				updateFoldingStateAtIndex(foldingModel, 0, true);
				viewModel.updateFoldingRanges(foldingModel.regions);

				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 1, end: 1 }
				]);

				updateFoldingStateAtIndex(foldingModel, 5, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);

				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 1, end: 1 },
					{ start: 3, end: 6 }
				]);

				updateFoldingStateAtIndex(foldingModel, 2, false);
				viewModel.updateFoldingRanges(foldingModel.regions);
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 1, end: 1 },
					{ start: 6, end: 6 }
				]);

				// viewModel.insertCell(7, new TestCell(viewModel.viewType, 7, ['var c = 8;'], 'markdown', CellKind.Code, []), true);

				// assert.deepStrictEqual(viewModel.getHiddenRanges(), [
				// 	{ start: 1, end: 1 },
				// 	{ start: 6, end: 7 }
				// ]);

				// viewModel.insertCell(1, new TestCell(viewModel.viewType, 8, ['var c = 9;'], 'markdown', CellKind.Code, []), true);
				// assert.deepStrictEqual(viewModel.getHiddenRanges(), [
				// 	// the first collapsed range is now expanded as we insert content into it.
				// 	// { start: 1,},
				// 	{ start: 7, end: 8 }
				// ]);
			}
		);
	});

	test('Folding Memento', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				foldingModel.applyMemento([{ start: 2, end: 6 }]);
				viewModel.updateFoldingRanges(foldingModel.regions);

				// Note that hidden ranges !== folding ranges
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 3, end: 6 }
				]);
			}
		);

		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				foldingModel.applyMemento([
					{ start: 5, end: 6 },
					{ start: 10, end: 11 },
				]);
				viewModel.updateFoldingRanges(foldingModel.regions);

				// Note that hidden ranges !== folding ranges
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 6, end: 6 },
					{ start: 11, end: 11 }
				]);
			}
		);

		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				foldingModel.applyMemento([
					{ start: 5, end: 6 },
					{ start: 7, end: 11 },
				]);
				viewModel.updateFoldingRanges(foldingModel.regions);

				// Note that hidden ranges !== folding ranges
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 6, end: 6 },
					{ start: 8, end: 11 }
				]);
			}
		);
	});

	test('View Index', async function () {
		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				foldingModel.applyMemento([{ start: 2, end: 6 }]);
				viewModel.updateFoldingRanges(foldingModel.regions);

				// Note that hidden ranges !== folding ranges
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 3, end: 6 }
				]);

				assert.strictEqual(viewModel.getNextVisibleCellIndex(1), 2);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(2), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(3), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(4), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(5), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(6), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(7), 8);
			}
		);

		await withTestNotebook(
			[
				['# header 1', 'markdown', CellKind.Markup, [], {}],
				['body', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
				['# header 2.1\n', 'markdown', CellKind.Markup, [], {}],
				['body 2', 'markdown', CellKind.Markup, [], {}],
				['body 3', 'markdown', CellKind.Markup, [], {}],
				['## header 2.2', 'markdown', CellKind.Markup, [], {}],
				['var e = 7;', 'markdown', CellKind.Markup, [], {}],
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);
				foldingModel.applyMemento([
					{ start: 5, end: 6 },
					{ start: 10, end: 11 },
				]);

				viewModel.updateFoldingRanges(foldingModel.regions);

				// Note that hidden ranges !== folding ranges
				assert.deepStrictEqual(viewModel.getHiddenRanges(), [
					{ start: 6, end: 6 },
					{ start: 11, end: 11 }
				]);

				// folding ranges
				// [5, 6]
				// [10, 11]
				assert.strictEqual(viewModel.getNextVisibleCellIndex(4), 5);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(5), 7);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(6), 7);

				assert.strictEqual(viewModel.getNextVisibleCellIndex(9), 10);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(10), 12);
				assert.strictEqual(viewModel.getNextVisibleCellIndex(11), 12);
			}
		);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookKernelHistory.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookKernelHistory.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { setupInstantiationService } from './testNotebookEditor.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { INotebookKernel, INotebookKernelService, VariablesResult } from '../../common/notebookKernelService.js';
import { NotebookKernelService } from '../../browser/services/notebookKernelServiceImpl.js';
import { INotebookService } from '../../common/notebookService.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { NotebookKernelHistoryService } from '../../browser/services/notebookKernelHistoryServiceImpl.js';
import { IApplicationStorageValueChangeEvent, IProfileStorageValueChangeEvent, IStorageService, IStorageValueChangeEvent, IWillSaveStateEvent, IWorkspaceStorageValueChangeEvent, StorageScope } from '../../../../../platform/storage/common/storage.js';
import { INotebookLoggingService } from '../../common/notebookLoggingService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { AsyncIterableProducer } from '../../../../../base/common/async.js';

suite('NotebookKernelHistoryService', () => {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let kernelService: INotebookKernelService;

	let onDidAddNotebookDocument: Emitter<NotebookTextModel>;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {
		disposables = new DisposableStore();
		onDidAddNotebookDocument = new Emitter();
		disposables.add(onDidAddNotebookDocument);

		instantiationService = setupInstantiationService(disposables);
		instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override onDidAddNotebookDocument = onDidAddNotebookDocument.event;
			override onWillRemoveNotebookDocument = Event.None;
			override getNotebookTextModels() { return []; }
		});
		instantiationService.stub(IMenuService, new class extends mock<IMenuService>() {
			override createMenu() {
				return new class extends mock<IMenu>() {
					override onDidChange = Event.None;
					override getActions() { return []; }
					override dispose() { }
				};
			}
		});
		kernelService = disposables.add(instantiationService.createInstance(NotebookKernelService));
		instantiationService.set(INotebookKernelService, kernelService);
	});

	test('notebook kernel empty history', function () {

		const u1 = URI.parse('foo:///one');

		const k1 = new TestNotebookKernel({ label: 'z', notebookType: 'foo' });
		const k2 = new TestNotebookKernel({ label: 'a', notebookType: 'foo' });

		disposables.add(kernelService.registerKernel(k1));
		disposables.add(kernelService.registerKernel(k2));

		instantiationService.stub(IStorageService, new class extends mock<IStorageService>() {
			override onWillSaveState: Event<IWillSaveStateEvent> = Event.None;
			override onDidChangeValue(scope: StorageScope.WORKSPACE, key: string | undefined, disposable: DisposableStore): Event<IWorkspaceStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope.PROFILE, key: string | undefined, disposable: DisposableStore): Event<IProfileStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope.APPLICATION, key: string | undefined, disposable: DisposableStore): Event<IApplicationStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope, key: string | undefined, disposable: DisposableStore): Event<IStorageValueChangeEvent> {
				return Event.None;
			}
			override get(key: string, scope: StorageScope, fallbackValue: string): string;
			override get(key: string, scope: StorageScope, fallbackValue?: string | undefined): string | undefined;
			override get(key: unknown, scope: unknown, fallbackValue?: unknown): string | undefined {
				if (key === 'notebook.kernelHistory') {
					return JSON.stringify({
						'foo': {
							'entries': []
						}
					});
				}

				return undefined;
			}
		});

		instantiationService.stub(INotebookLoggingService, new class extends mock<INotebookLoggingService>() {
			override info() { }
			override debug() { }
		});

		const kernelHistoryService = disposables.add(instantiationService.createInstance(NotebookKernelHistoryService));

		let info = kernelHistoryService.getKernels({ uri: u1, notebookType: 'foo' });
		assert.equal(info.all.length, 0);
		assert.ok(!info.selected);

		// update priorities for u1 notebook
		kernelService.updateKernelNotebookAffinity(k2, u1, 2);

		info = kernelHistoryService.getKernels({ uri: u1, notebookType: 'foo' });
		assert.equal(info.all.length, 0);
		// MRU only auto selects kernel if there is only one
		assert.deepStrictEqual(info.selected, undefined);
	});

	test('notebook kernel history restore', function () {

		const u1 = URI.parse('foo:///one');

		const k1 = new TestNotebookKernel({ label: 'z', notebookType: 'foo' });
		const k2 = new TestNotebookKernel({ label: 'a', notebookType: 'foo' });
		const k3 = new TestNotebookKernel({ label: 'b', notebookType: 'foo' });

		disposables.add(kernelService.registerKernel(k1));
		disposables.add(kernelService.registerKernel(k2));
		disposables.add(kernelService.registerKernel(k3));

		instantiationService.stub(IStorageService, new class extends mock<IStorageService>() {
			override onWillSaveState: Event<IWillSaveStateEvent> = Event.None;
			override onDidChangeValue(scope: StorageScope.WORKSPACE, key: string | undefined, disposable: DisposableStore): Event<IWorkspaceStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope.PROFILE, key: string | undefined, disposable: DisposableStore): Event<IProfileStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope.APPLICATION, key: string | undefined, disposable: DisposableStore): Event<IApplicationStorageValueChangeEvent>;
			override onDidChangeValue(scope: StorageScope, key: string | undefined, disposable: DisposableStore): Event<IStorageValueChangeEvent> {
				return Event.None;
			}
			override get(key: string, scope: StorageScope, fallbackValue: string): string;
			override get(key: string, scope: StorageScope, fallbackValue?: string | undefined): string | undefined;
			override get(key: unknown, scope: unknown, fallbackValue?: unknown): string | undefined {
				if (key === 'notebook.kernelHistory') {
					return JSON.stringify({
						'foo': {
							'entries': [
								k2.id
							]
						}
					});
				}

				return undefined;
			}
		});

		instantiationService.stub(INotebookLoggingService, new class extends mock<INotebookLoggingService>() {
			override info() { }
			override debug() { }
		});

		const kernelHistoryService = disposables.add(instantiationService.createInstance(NotebookKernelHistoryService));
		let info = kernelHistoryService.getKernels({ uri: u1, notebookType: 'foo' });
		assert.equal(info.all.length, 1);
		assert.deepStrictEqual(info.selected, undefined);

		kernelHistoryService.addMostRecentKernel(k3);
		info = kernelHistoryService.getKernels({ uri: u1, notebookType: 'foo' });
		assert.deepStrictEqual(info.all, [k3, k2]);
	});
});

class TestNotebookKernel implements INotebookKernel {
	id: string = Math.random() + 'kernel';
	label: string = 'test-label';
	viewType = '*';
	onDidChange = Event.None;
	extension: ExtensionIdentifier = new ExtensionIdentifier('test');
	localResourceRoot: URI = URI.file('/test');
	description?: string | undefined;
	detail?: string | undefined;
	preloadUris: URI[] = [];
	preloadProvides: string[] = [];
	supportedLanguages: string[] = [];
	executeNotebookCellsRequest(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	cancelNotebookCellExecution(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult> {
		return AsyncIterableProducer.EMPTY;
	}

	constructor(opts?: { languages?: string[]; label?: string; notebookType?: string }) {
		this.supportedLanguages = opts?.languages ?? [PLAINTEXT_LANGUAGE_ID];
		this.label = opts?.label ?? this.label;
		this.viewType = opts?.notebookType ?? this.viewType;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookKernelService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookKernelService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../../platform/extensions/common/extensions.js';
import { setupInstantiationService } from './testNotebookEditor.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { INotebookKernel, INotebookKernelService, VariablesResult } from '../../common/notebookKernelService.js';
import { NotebookKernelService } from '../../browser/services/notebookKernelServiceImpl.js';
import { INotebookService } from '../../common/notebookService.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { IMenu, IMenuService } from '../../../../../platform/actions/common/actions.js';
import { TransientOptions } from '../../common/notebookCommon.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { AsyncIterableProducer } from '../../../../../base/common/async.js';

suite('NotebookKernelService', () => {

	let instantiationService: TestInstantiationService;
	let kernelService: INotebookKernelService;
	let disposables: DisposableStore;

	let onDidAddNotebookDocument: Emitter<NotebookTextModel>;
	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(function () {
		disposables = new DisposableStore();

		onDidAddNotebookDocument = new Emitter();
		disposables.add(onDidAddNotebookDocument);

		instantiationService = setupInstantiationService(disposables);
		instantiationService.stub(INotebookService, new class extends mock<INotebookService>() {
			override onDidAddNotebookDocument = onDidAddNotebookDocument.event;
			override onWillRemoveNotebookDocument = Event.None;
			override getNotebookTextModels() { return []; }
		});
		instantiationService.stub(IMenuService, new class extends mock<IMenuService>() {
			override createMenu() {
				return new class extends mock<IMenu>() {
					override onDidChange = Event.None;
					override getActions() { return []; }
					override dispose() { }
				};
			}
		});
		kernelService = disposables.add(instantiationService.createInstance(NotebookKernelService));
		instantiationService.set(INotebookKernelService, kernelService);
	});

	test('notebook priorities', function () {

		const u1 = URI.parse('foo:///one');
		const u2 = URI.parse('foo:///two');

		const k1 = new TestNotebookKernel({ label: 'z' });
		const k2 = new TestNotebookKernel({ label: 'a' });

		disposables.add(kernelService.registerKernel(k1));
		disposables.add(kernelService.registerKernel(k2));

		// equal priorities -> sort by name
		let info = kernelService.getMatchingKernel({ uri: u1, notebookType: 'foo' });
		assert.ok(info.all[0] === k2);
		assert.ok(info.all[1] === k1);

		// update priorities for u1 notebook
		kernelService.updateKernelNotebookAffinity(k2, u1, 2);
		kernelService.updateKernelNotebookAffinity(k2, u2, 1);

		// updated
		info = kernelService.getMatchingKernel({ uri: u1, notebookType: 'foo' });
		assert.ok(info.all[0] === k2);
		assert.ok(info.all[1] === k1);

		// NOT updated
		info = kernelService.getMatchingKernel({ uri: u2, notebookType: 'foo' });
		assert.ok(info.all[0] === k2);
		assert.ok(info.all[1] === k1);

		// reset
		kernelService.updateKernelNotebookAffinity(k2, u1, undefined);
		info = kernelService.getMatchingKernel({ uri: u1, notebookType: 'foo' });
		assert.ok(info.all[0] === k2);
		assert.ok(info.all[1] === k1);
	});

	test('new kernel with higher affinity wins, https://github.com/microsoft/vscode/issues/122028', function () {
		const notebook = URI.parse('foo:///one');

		const kernel = new TestNotebookKernel();
		disposables.add(kernelService.registerKernel(kernel));

		let info = kernelService.getMatchingKernel({ uri: notebook, notebookType: 'foo' });
		assert.strictEqual(info.all.length, 1);
		assert.ok(info.all[0] === kernel);

		const betterKernel = new TestNotebookKernel();
		disposables.add(kernelService.registerKernel(betterKernel));

		info = kernelService.getMatchingKernel({ uri: notebook, notebookType: 'foo' });
		assert.strictEqual(info.all.length, 2);

		kernelService.updateKernelNotebookAffinity(betterKernel, notebook, 2);
		info = kernelService.getMatchingKernel({ uri: notebook, notebookType: 'foo' });
		assert.strictEqual(info.all.length, 2);
		assert.ok(info.all[0] === betterKernel);
		assert.ok(info.all[1] === kernel);
	});

	test('onDidChangeSelectedNotebooks not fired on initial notebook open #121904', function () {

		const uri = URI.parse('foo:///one');
		const jupyter = { uri, viewType: 'jupyter', notebookType: 'jupyter' };
		const dotnet = { uri, viewType: 'dotnet', notebookType: 'dotnet' };

		const jupyterKernel = new TestNotebookKernel({ viewType: jupyter.viewType });
		const dotnetKernel = new TestNotebookKernel({ viewType: dotnet.viewType });
		disposables.add(kernelService.registerKernel(jupyterKernel));
		disposables.add(kernelService.registerKernel(dotnetKernel));

		kernelService.selectKernelForNotebook(jupyterKernel, jupyter);
		kernelService.selectKernelForNotebook(dotnetKernel, dotnet);

		let info = kernelService.getMatchingKernel(dotnet);
		assert.strictEqual(info.selected === dotnetKernel, true);

		info = kernelService.getMatchingKernel(jupyter);
		assert.strictEqual(info.selected === jupyterKernel, true);
	});

	test('onDidChangeSelectedNotebooks not fired on initial notebook open #121904, p2', async function () {

		const uri = URI.parse('foo:///one');
		const jupyter = { uri, viewType: 'jupyter', notebookType: 'jupyter' };
		const dotnet = { uri, viewType: 'dotnet', notebookType: 'dotnet' };

		const jupyterKernel = new TestNotebookKernel({ viewType: jupyter.viewType });
		const dotnetKernel = new TestNotebookKernel({ viewType: dotnet.viewType });
		disposables.add(kernelService.registerKernel(jupyterKernel));
		disposables.add(kernelService.registerKernel(dotnetKernel));

		kernelService.selectKernelForNotebook(jupyterKernel, jupyter);
		kernelService.selectKernelForNotebook(dotnetKernel, dotnet);

		const transientOptions: TransientOptions = {
			transientOutputs: false,
			transientCellMetadata: {},
			transientDocumentMetadata: {},
			cellContentMetadata: {},
		};

		{
			// open as jupyter -> bind event
			const p1 = Event.toPromise(kernelService.onDidChangeSelectedNotebooks);
			const d1 = disposables.add(instantiationService.createInstance(NotebookTextModel, jupyter.viewType, jupyter.uri, [], {}, transientOptions));
			onDidAddNotebookDocument.fire(d1);
			const event = await p1;
			assert.strictEqual(event.newKernel, jupyterKernel.id);
		}
		{
			// RE-open as dotnet -> bind event
			const p2 = Event.toPromise(kernelService.onDidChangeSelectedNotebooks);
			const d2 = disposables.add(instantiationService.createInstance(NotebookTextModel, dotnet.viewType, dotnet.uri, [], {}, transientOptions));
			onDidAddNotebookDocument.fire(d2);
			const event2 = await p2;
			assert.strictEqual(event2.newKernel, dotnetKernel.id);
		}
	});
});

class TestNotebookKernel implements INotebookKernel {
	id: string = Math.random() + 'kernel';
	label: string = 'test-label';
	viewType = '*';
	onDidChange = Event.None;
	extension: ExtensionIdentifier = new ExtensionIdentifier('test');
	localResourceRoot: URI = URI.file('/test');
	description?: string | undefined;
	detail?: string | undefined;
	preloadUris: URI[] = [];
	preloadProvides: string[] = [];
	supportedLanguages: string[] = [];
	executeNotebookCellsRequest(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	cancelNotebookCellExecution(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult> {
		return AsyncIterableProducer.EMPTY;
	}

	constructor(opts?: { languages?: string[]; label?: string; viewType?: string }) {
		this.supportedLanguages = opts?.languages ?? [PLAINTEXT_LANGUAGE_ID];
		this.label = opts?.label ?? this.label;
		this.viewType = opts?.viewType ?? this.viewType;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookRendererMessagingService.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookRendererMessagingService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NullExtensionService } from '../../../../services/extensions/common/extensions.js';
import { stub } from 'sinon';
import { NotebookRendererMessagingService } from '../../browser/services/notebookRendererMessagingServiceImpl.js';
import assert from 'assert';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('NotebookRendererMessaging', () => {
	let extService: NullExtensionService;
	let m: NotebookRendererMessagingService;
	let sent: unknown[] = [];

	const ds = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		sent = [];
		extService = new NullExtensionService();
		m = ds.add(new NotebookRendererMessagingService(extService));
		ds.add(m.onShouldPostMessage(e => sent.push(e)));
	});

	test('activates on prepare', () => {
		const activate = stub(extService, 'activateByEvent').returns(Promise.resolve());
		m.prepare('foo');
		m.prepare('foo');
		m.prepare('foo');

		assert.deepStrictEqual(activate.args, [['onRenderer:foo']]);
	});

	test('buffers and then plays events', async () => {
		stub(extService, 'activateByEvent').returns(Promise.resolve());

		const scoped = m.getScoped('some-editor');
		scoped.postMessage('foo', 1);
		scoped.postMessage('foo', 2);
		assert.deepStrictEqual(sent, []);

		await timeout(0);

		const expected = [
			{ editorId: 'some-editor', rendererId: 'foo', message: 1 },
			{ editorId: 'some-editor', rendererId: 'foo', message: 2 }
		];

		assert.deepStrictEqual(sent, expected);

		scoped.postMessage('foo', 3);

		assert.deepStrictEqual(sent, [
			...expected,
			{ editorId: 'some-editor', rendererId: 'foo', message: 3 }
		]);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookSelection.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookSelection.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { FoldingModel, updateFoldingStateAtIndex } from '../../browser/viewModel/foldingModel.js';
import { runDeleteAction } from '../../browser/controller/cellOperations.js';
import { NotebookCellSelectionCollection } from '../../browser/viewModel/cellSelectionCollection.js';
import { CellEditType, CellKind, SelectionStateType } from '../../common/notebookCommon.js';
import { createNotebookCellList, setupInstantiationService, TestCell, withTestNotebook } from './testNotebookEditor.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';

suite('NotebookSelection', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	test('focus is never empty', function () {
		const selectionCollection = new NotebookCellSelectionCollection();
		assert.deepStrictEqual(selectionCollection.focus, { start: 0, end: 0 });

		selectionCollection.setState(null, [], true, 'model');
		assert.deepStrictEqual(selectionCollection.focus, { start: 0, end: 0 });
		selectionCollection.dispose();
	});

	test('selection is never empty', function () {
		const selectionCollection = new NotebookCellSelectionCollection();
		assert.deepStrictEqual(selectionCollection.selections, [{ start: 0, end: 0 }]);

		selectionCollection.setState(null, [], true, 'model');
		assert.deepStrictEqual(selectionCollection.selections, [{ start: 0, end: 0 }]);
		selectionCollection.dispose();
	});

	test('selections does not change when setting to empty', function () {
		const selectionCollection = new NotebookCellSelectionCollection();
		let changed = false;
		store.add(selectionCollection.onDidChangeSelection(() => {
			changed = true;
		}));

		selectionCollection.setState(null, [], false, 'model');
		assert.strictEqual(changed, false);
		selectionCollection.setState({ start: 0, end: 0 }, [], false, 'model');
		assert.strictEqual(changed, false);
		selectionCollection.setState({ start: 0, end: 0 }, [{ start: 0, end: 0 }], false, 'model');
		assert.strictEqual(changed, false);
		selectionCollection.setState(null, [], false, 'model');
		assert.strictEqual(changed, false);
		selectionCollection.dispose();
	});

	test('event fires when selection or focus changes', function () {
		const selectionCollection = new NotebookCellSelectionCollection();
		let eventCount = 0;
		store.add(selectionCollection.onDidChangeSelection(() => {
			eventCount++;
		}));

		// Change focus
		selectionCollection.setState({ start: 1, end: 1 }, [{ start: 1, end: 2 }], false, 'model');
		assert.strictEqual(eventCount, 1);

		// Change selections
		selectionCollection.setState({ start: 1, end: 1 }, [{ start: 1, end: 2 }, { start: 2, end: 3 }], false, 'model');
		assert.strictEqual(eventCount, 2);

		// no change
		selectionCollection.setState({ start: 1, end: 1 }, [{ start: 1, end: 2 }, { start: 2, end: 3 }], false, 'model');
		assert.strictEqual(eventCount, 2);

		// change to empty focus
		selectionCollection.setState({ start: 0, end: 0 }, [{ start: 4, end: 5 }], false, 'model');
		assert.strictEqual(eventCount, 3);

		// change to empty selections
		selectionCollection.setState({ start: 0, end: 0 }, [], false, 'model');
		assert.strictEqual(eventCount, 4);

		selectionCollection.dispose();
	});

});

suite('NotebookCellList focus/selection', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;

	teardown(() => {
		disposables.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		languageService = instantiationService.get(ILanguageService);
	});


	test('notebook cell list setFocus', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel, ds) => {
				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);

				assert.strictEqual(cellList.length, 2);
				cellList.setFocus([0]);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });

				cellList.setFocus([1]);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });
				cellList.detachViewModel();
			});
	});

	test('notebook cell list setSelections', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel, ds) => {
				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);

				assert.strictEqual(cellList.length, 2);
				cellList.setSelection([0]);
				// the only selection is also the focus
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);

				// set selection does not modify focus
				cellList.setSelection([1]);
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);
			});
	});

	test('notebook cell list setFocus2', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel, ds) => {
				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);

				assert.strictEqual(cellList.length, 2);
				cellList.setFocus([0]);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });

				cellList.setFocus([1]);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });

				cellList.setSelection([1]);
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);
				cellList.detachViewModel();
			});
	});


	test('notebook cell list focus/selection from UI', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel, ds) => {
				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);

				// arrow down, move both focus and selections
				cellList.setFocus([1], new KeyboardEvent('keydown'), undefined);
				cellList.setSelection([1], new KeyboardEvent('keydown'), undefined);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);

				// shift+arrow down, expands selection
				cellList.setFocus([2], new KeyboardEvent('keydown'), undefined);
				cellList.setSelection([1, 2]);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 3 }]);

				// arrow down, will move focus but not expand selection
				cellList.setFocus([3], new KeyboardEvent('keydown'), undefined);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 3, end: 4 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 3 }]);
			});
	});


	test('notebook cell list focus/selection with folding regions', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);

				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);
				assert.strictEqual(cellList.length, 5);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);
				cellList.setFocus([0]);

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
				assert.strictEqual(cellList.length, 3);

				// currently, focus on a folded cell will only focus the cell itself, excluding its "inner" cells
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);

				cellList.focusNext(1, false);
				// focus next should skip the folded items
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);

				// unfold
				updateFoldingStateAtIndex(foldingModel, 2, false);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
				assert.strictEqual(cellList.length, 4);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 2, end: 3 });
			});
	});

	test('notebook cell list focus/selection with folding regions and applyEdits', async function () {
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
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);

				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);
				cellList.setFocus([0]);
				cellList.setSelection([0]);

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
				assert.strictEqual(cellList.getModelIndex2(0), 0);
				assert.strictEqual(cellList.getModelIndex2(1), 2);

				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 2, cells: []
				}], true, undefined, () => undefined, undefined, false);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);

				assert.strictEqual(cellList.getModelIndex2(0), 0);
				assert.strictEqual(cellList.getModelIndex2(1), 3);

				// mimic undo
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace, index: 0, count: 0, cells: [
						ds.add(new TestCell(viewModel.viewType, 7, '# header f', 'markdown', CellKind.Code, [], languageService)),
						ds.add(new TestCell(viewModel.viewType, 8, 'var g = 5;', 'javascript', CellKind.Code, [], languageService))
					]
				}], true, undefined, () => undefined, undefined, false);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);
				assert.strictEqual(cellList.getModelIndex2(0), 0);
				assert.strictEqual(cellList.getModelIndex2(1), 1);
				assert.strictEqual(cellList.getModelIndex2(2), 2);
			});
	});

	test('notebook cell list getModelIndex', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['# header c', 'markdown', CellKind.Markup, [], {}]
			],
			(editor, viewModel, ds) => {
				const foldingModel = ds.add(new FoldingModel());
				foldingModel.attachViewModel(viewModel);

				const cellList = createNotebookCellList(instantiationService, ds);
				cellList.attachViewModel(viewModel);

				updateFoldingStateAtIndex(foldingModel, 0, true);
				updateFoldingStateAtIndex(foldingModel, 2, true);
				viewModel.updateFoldingRanges(foldingModel.regions);
				cellList.setHiddenAreas(viewModel.getHiddenRanges(), true);

				assert.deepStrictEqual(cellList.getModelIndex2(-1), 0);
				assert.deepStrictEqual(cellList.getModelIndex2(0), 0);
				assert.deepStrictEqual(cellList.getModelIndex2(1), 2);
				assert.deepStrictEqual(cellList.getModelIndex2(2), 4);
			});
	});


	test('notebook validate range', async () => {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				assert.deepStrictEqual(viewModel.validateRange(null), null);
				assert.deepStrictEqual(viewModel.validateRange(undefined), null);
				assert.deepStrictEqual(viewModel.validateRange({ start: 0, end: 0 }), { start: 0, end: 0 });
				assert.deepStrictEqual(viewModel.validateRange({ start: 0, end: 2 }), { start: 0, end: 2 });
				assert.deepStrictEqual(viewModel.validateRange({ start: 0, end: 3 }), { start: 0, end: 2 });
				assert.deepStrictEqual(viewModel.validateRange({ start: -1, end: 3 }), { start: 0, end: 2 });
				assert.deepStrictEqual(viewModel.validateRange({ start: -1, end: 1 }), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.validateRange({ start: 2, end: 1 }), { start: 1, end: 2 });
				assert.deepStrictEqual(viewModel.validateRange({ start: 2, end: -1 }), { start: 0, end: 2 });
			});
	});

	test('notebook updateSelectionState', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }, { start: -1, end: 0 }] });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);
			});
	});

	test('notebook cell selection w/ cell deletion', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				runDeleteAction(editor, viewModel.cellAt(1)!);
				// viewModel.deleteCell(1, true, false);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 1 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 1 }]);
				runDeleteAction(editor, viewModel.cellAt(0)!);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 0, end: 0 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 0, end: 0 }]);
			});
	});

	test('notebook cell selection w/ cell deletion from applyEdits', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 1, end: 2 }, selections: [{ start: 1, end: 2 }] });
				editor.textModel.applyEdits([{
					editType: CellEditType.Replace,
					index: 1,
					count: 1,
					cells: []
				}], true, undefined, () => undefined, undefined, true);
				assert.deepStrictEqual(viewModel.getFocus(), { start: 1, end: 2 });
				assert.deepStrictEqual(viewModel.getSelections(), [{ start: 1, end: 2 }]);
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookServiceImpl.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookServiceImpl.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { NotebookProviderInfoStore } from '../../browser/services/notebookServiceImpl.js';
import { INotebookEditorModelResolverService } from '../../common/notebookEditorModelResolverService.js';
import { NotebookProviderInfo } from '../../common/notebookProvider.js';
import { EditorResolverService } from '../../../../services/editor/browser/editorResolverService.js';
import { RegisteredEditorPriority } from '../../../../services/editor/common/editorResolverService.js';
import { IExtensionService, nullExtensionDescription } from '../../../../services/extensions/common/extensions.js';
import { workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';

suite('NotebookProviderInfoStore', function () {
	const disposables = ensureNoDisposablesAreLeakedInTestSuite() as Pick<DisposableStore, 'add'>;

	test('Can\'t open untitled notebooks in test #119363', function () {
		const instantiationService = workbenchInstantiationService(undefined, disposables);
		const store = new NotebookProviderInfoStore(
			new class extends mock<IStorageService>() {
				override get() { return ''; }
				override store() { }
				override getObject() { return {}; }
			},
			new class extends mock<IExtensionService>() {
				override onDidRegisterExtensions = Event.None;
			},
			disposables.add(instantiationService.createInstance(EditorResolverService)),
			new TestConfigurationService(),
			new class extends mock<IAccessibilityService>() {
				override onDidChangeScreenReaderOptimized: Event<void> = Event.None;
			},
			instantiationService,
			new class extends mock<IFileService>() {
				override hasProvider() { return true; }
			},
			new class extends mock<INotebookEditorModelResolverService>() { },
			new class extends mock<IUriIdentityService>() { }
		);
		disposables.add(store);

		const fooInfo = new NotebookProviderInfo({
			extension: nullExtensionDescription.identifier,
			id: 'foo',
			displayName: 'foo',
			selectors: [{ filenamePattern: '*.foo' }],
			priority: RegisteredEditorPriority.default,
			providerDisplayName: 'foo',
		});
		const barInfo = new NotebookProviderInfo({
			extension: nullExtensionDescription.identifier,
			id: 'bar',
			displayName: 'bar',
			selectors: [{ filenamePattern: '*.bar' }],
			priority: RegisteredEditorPriority.default,
			providerDisplayName: 'bar',
		});

		store.add(fooInfo);
		store.add(barInfo);

		assert.ok(store.get('foo'));
		assert.ok(store.get('bar'));
		assert.ok(!store.get('barfoo'));

		let providers = store.getContributedNotebook(URI.parse('file:///test/nb.foo'));
		assert.strictEqual(providers.length, 1);
		assert.strictEqual(providers[0] === fooInfo, true);

		providers = store.getContributedNotebook(URI.parse('file:///test/nb.bar'));
		assert.strictEqual(providers.length, 1);
		assert.strictEqual(providers[0] === barInfo, true);

		providers = store.getContributedNotebook(URI.parse('untitled:///Untitled-1'));
		assert.strictEqual(providers.length, 2);
		assert.strictEqual(providers[0] === fooInfo, true);
		assert.strictEqual(providers[1] === barInfo, true);

		providers = store.getContributedNotebook(URI.parse('untitled:///test/nb.bar'));
		assert.strictEqual(providers.length, 1);
		assert.strictEqual(providers[0] === barInfo, true);
	});

});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookStickyScroll.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookStickyScroll.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { mock } from '../../../../../base/test/common/mock.js';
import { assertSnapshot } from '../../../../../base/test/common/snapshot.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { ILanguageFeaturesService } from '../../../../../editor/common/services/languageFeatures.js';
import { LanguageFeaturesService } from '../../../../../editor/common/services/languageFeaturesService.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IEditorPaneSelectionChangeEvent } from '../../../../common/editor.js';
import { NotebookCellOutline } from '../../browser/contrib/outline/notebookOutline.js';
import { INotebookEditor, INotebookEditorPane } from '../../browser/notebookBrowser.js';
import { INotebookCellList } from '../../browser/view/notebookRenderingCommon.js';
import { OutlineEntry } from '../../browser/viewModel/OutlineEntry.js';
import { NotebookStickyLine, computeContent } from '../../browser/viewParts/notebookEditorStickyScroll.js';
import { CellKind } from '../../common/notebookCommon.js';
import { createNotebookCellList, setupInstantiationService, withTestNotebook } from './testNotebookEditor.js';
import { OutlineTarget } from '../../../../services/outline/browser/outline.js';

suite('NotebookEditorStickyScroll', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;

	const domNode: HTMLElement = document.createElement('div');

	teardown(() => {
		disposables.dispose();
	});

	const store = ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		instantiationService.set(ILanguageFeaturesService, new LanguageFeaturesService());
	});

	function getOutline(editor: any) {
		if (!editor.hasModel()) {
			assert.ok(false, 'MUST have active text editor');
		}
		const outline = store.add(instantiationService.createInstance(NotebookCellOutline, new class extends mock<INotebookEditorPane>() {
			override getControl() {
				return editor;
			}
			override onDidChangeModel: Event<void> = Event.None;
			override onDidChangeSelection: Event<IEditorPaneSelectionChangeEvent> = Event.None;
		}, OutlineTarget.QuickPick));
		return outline;
	}

	function nbStickyTestHelper(domNode: HTMLElement, notebookEditor: INotebookEditor, notebookCellList: INotebookCellList, notebookOutlineEntries: OutlineEntry[], disposables: Pick<DisposableStore, 'add'>) {
		const output = computeContent(notebookEditor, notebookCellList, notebookOutlineEntries, 0);
		for (const stickyLine of output.values()) {
			disposables.add(stickyLine.line);
		}
		return createStickyTestElement(output.values());
	}

	function createStickyTestElement(stickyLines: IterableIterator<{ line: NotebookStickyLine; rendered: boolean }>) {
		const outputElements = [];
		for (const stickyLine of stickyLines) {
			if (stickyLine.rendered) {
				outputElements.unshift(stickyLine.line.element.innerText);
			}
		}
		return outputElements;
	}

	test('test0: should render empty, 	scrollTop at 0', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['## header aa', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 8 }, () => false),
					editorViewStates: Array.from({ length: 8 }, () => null),
					cellTotalHeights: Array.from({ length: 8 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = disposables.add(createNotebookCellList(instantiationService, disposables));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(0);
				editor.visibleRanges = [{ start: 0, end: 8 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, disposables);
				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test1: should render 0->1, 	visible range 3->8', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],	// 0
				['## header aa', 'markdown', CellKind.Markup, [], {}],	// 50
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 100
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 150
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 200
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 250
				['# header b', 'markdown', CellKind.Markup, [], {}],	// 300
				['var c = 2;', 'javascript', CellKind.Code, [], {}]		// 350
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 8 }, () => false),
					editorViewStates: Array.from({ length: 8 }, () => null),
					cellTotalHeights: Array.from({ length: 8 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(175);
				editor.visibleRanges = [{ start: 3, end: 8 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test2: should render 0, 		visible range 6->9 so collapsing next 2 against following section', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],	// 0
				['## header aa', 'markdown', CellKind.Markup, [], {}],	// 50
				['### header aaa', 'markdown', CellKind.Markup, [], {}],// 100
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 150
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 200
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 250
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 300
				['# header b', 'markdown', CellKind.Markup, [], {}],	// 350
				['var c = 2;', 'javascript', CellKind.Code, [], {}]		// 400
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 9 }, () => false),
					editorViewStates: Array.from({ length: 9 }, () => null),
					cellTotalHeights: Array.from({ length: 9 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(325); // room for a single header
				editor.visibleRanges = [{ start: 6, end: 9 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test3: should render 0->2, 	collapsing against equivalent level header', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],	// 0
				['## header aa', 'markdown', CellKind.Markup, [], {}],	// 50
				['### header aaa', 'markdown', CellKind.Markup, [], {}],// 100
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 150
				['### header aab', 'markdown', CellKind.Markup, [], {}],// 200
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 250
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 300
				['var b = 1;', 'javascript', CellKind.Code, [], {}],	// 350
				['# header b', 'markdown', CellKind.Markup, [], {}],	// 400
				['var c = 2;', 'javascript', CellKind.Code, [], {}]		// 450
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 10 }, () => false),
					editorViewStates: Array.from({ length: 10 }, () => null),
					cellTotalHeights: Array.from({ length: 10 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(175); // room for a single header
				editor.visibleRanges = [{ start: 3, end: 10 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	// outdated/improper behavior
	test('test4: should render 0, 		scrolltop halfway through cell 0', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['## header aa', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 8 }, () => false),
					editorViewStates: Array.from({ length: 8 }, () => null),
					cellTotalHeights: Array.from({ length: 8 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(50);
				editor.visibleRanges = [{ start: 0, end: 8 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test5: should render 0->2, 	scrolltop halfway through cell 2', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['## header aa', 'markdown', CellKind.Markup, [], {}],
				['### header aaa', 'markdown', CellKind.Markup, [], {}],
				['#### header aaaa', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 10 }, () => false),
					editorViewStates: Array.from({ length: 10 }, () => null),
					cellTotalHeights: Array.from({ length: 10 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(125);
				editor.visibleRanges = [{ start: 2, end: 10 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test6: should render 6->7, 	scrolltop halfway through cell 7', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}],
				['## header aa', 'markdown', CellKind.Markup, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 1;', 'javascript', CellKind.Code, [], {}],
				['# header b', 'markdown', CellKind.Markup, [], {}],
				['## header bb', 'markdown', CellKind.Markup, [], {}],
				['### header bbb', 'markdown', CellKind.Markup, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 10 }, () => false),
					editorViewStates: Array.from({ length: 10 }, () => null),
					cellTotalHeights: Array.from({ length: 10 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(375);
				editor.visibleRanges = [{ start: 7, end: 10 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});

	test('test7: should render 0->1, 	collapsing against next section', async function () {
		await withTestNotebook(
			[
				['# header a', 'markdown', CellKind.Markup, [], {}], 		//0
				['## header aa', 'markdown', CellKind.Markup, [], {}], 		//50
				['### header aaa', 'markdown', CellKind.Markup, [], {}], 	//100
				['#### header aaaa', 'markdown', CellKind.Markup, [], {}], 	//150
				['var b = 1;', 'javascript', CellKind.Code, [], {}], 		//200
				['var b = 1;', 'javascript', CellKind.Code, [], {}], 		//250
				['var b = 1;', 'javascript', CellKind.Code, [], {}], 		//300
				['var b = 1;', 'javascript', CellKind.Code, [], {}], 		//350
				['# header b', 'markdown', CellKind.Markup, [], {}], 		//400
				['## header bb', 'markdown', CellKind.Markup, [], {}], 		//450
				['### header bbb', 'markdown', CellKind.Markup, [], {}],
				['var c = 2;', 'javascript', CellKind.Code, [], {}]
			],
			async (editor, viewModel, ds) => {
				viewModel.restoreEditorViewState({
					editingCells: Array.from({ length: 12 }, () => false),
					editorViewStates: Array.from({ length: 12 }, () => null),
					cellTotalHeights: Array.from({ length: 12 }, () => 50),
					cellLineNumberStates: {},
					collapsedInputCells: {},
					collapsedOutputCells: {},
				});

				const cellList = ds.add(createNotebookCellList(instantiationService, ds));
				cellList.attachViewModel(viewModel);
				cellList.layout(400, 100);

				editor.setScrollTop(350);
				editor.visibleRanges = [{ start: 7, end: 12 }];

				const outline = getOutline(editor);
				const notebookOutlineEntries = outline.entries;
				const resultingMap = nbStickyTestHelper(domNode, editor, cellList, notebookOutlineEntries, ds);

				await assertSnapshot(resultingMap);
				outline.dispose();
			});
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/test/browser/notebookTextModel.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/test/browser/notebookTextModel.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { VSBuffer } from '../../../../../base/common/buffer.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Mimes } from '../../../../../base/common/mime.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { Position } from '../../../../../editor/common/core/position.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { IUndoRedoService } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { CellEditType, CellKind, ICellEditOperation, MOVE_CURSOR_1_LINE_COMMAND, NotebookTextModelChangedEvent, NotebookTextModelWillAddRemoveEvent, SelectionStateType } from '../../common/notebookCommon.js';
import { setupInstantiationService, TestCell, valueBytesFromString, withTestNotebook } from './testNotebookEditor.js';

suite('NotebookTextModel', () => {
	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let languageService: ILanguageService;

	ensureNoDisposablesAreLeakedInTestSuite();

	suiteSetup(() => {
		disposables = new DisposableStore();
		instantiationService = setupInstantiationService(disposables);
		languageService = instantiationService.get(ILanguageService);
		instantiationService.spy(IUndoRedoService, 'pushElement');
	});

	suiteTeardown(() => disposables.dispose());

	test('insert', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
					{ editType: CellEditType.Replace, index: 3, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 6, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 6);

				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[4].getValue(), 'var f = 6;');
			}
		);
	});

	test('multiple inserts at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 6, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 6);

				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var f = 6;');
			}
		);
	});

	test('delete', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 3, count: 1, cells: [] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var c = 3;');
			}
		);
	});

	test('delete + insert', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 3, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(textModel.cells.length, 4);

				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var e = 5;');
			}
		);
	});

	test('delete + insert at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');
			}
		);
	});

	test('(replace) delete + insert at same position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');
			}
		);
	});

	test('output', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// invalid index 1
				assert.throws(() => {
					textModel.applyEdits([{
						index: Number.MAX_VALUE,
						editType: CellEditType.Output,
						outputs: []
					}], true, undefined, () => undefined, undefined, true);
				});

				// invalid index 2
				assert.throws(() => {
					textModel.applyEdits([{
						index: -1,
						editType: CellEditType.Output,
						outputs: []
					}], true, undefined, () => undefined, undefined, true);
				});

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello_') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1);

				// append
				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					append: true,
					outputs: [{
						outputId: 'someId2',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello2_') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 2);
				let [first, second] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'someId');
				assert.strictEqual(second.outputId, 'someId2');

				// replace all
				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Output,
					outputs: [{
						outputId: 'someId3',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('Last, replaced output') }]
					}]
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1);
				[first] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'someId3');
			}
		);
	});

	test('multiple append output in one position', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// append
				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 1') }]
						}]
					},
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append2',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 2') }]
						}]
					}
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 2);
				const [first, second] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'append1');
				assert.strictEqual(second.outputId, 'append2');
			}
		);
	});

	test('append to output created in same batch', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('append 1') }]
						}]
					},
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: Mimes.markdown, data: valueBytesFromString('append 2')
						}]
					}
				], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1, 'has 1 output');
				const [first] = textModel.cells[0].outputs;
				assert.strictEqual(first.outputId, 'append1');
				assert.strictEqual(first.outputs.length, 2, 'has 2 items');
			}
		);
	});

	const stdOutMime = 'application/vnd.code.notebook.stdout';
	const stdErrMime = 'application/vnd.code.notebook.stderr';

	test('appending streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: stdOutMime, data: valueBytesFromString('append 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('append 2') },
							{ mime: stdOutMime, data: valueBytesFromString('append 3') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('append 4') },
							{ mime: stdOutMime, data: valueBytesFromString('append 5') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 2, 'version should bump per append');

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].outputs.length, 1, 'has 1 output');
				assert.strictEqual(output.outputId, 'append1');
				assert.strictEqual(output.outputs.length, 1, 'outputs are compressed');
				assert.strictEqual(output.outputs[0].data.toString(), 'append 1append 2append 3append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime)?.toString(), 'append 2append 3append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(1, stdOutMime)?.toString(), 'append 4append 5');
				assert.strictEqual(output.appendedSinceVersion(2, stdOutMime), undefined);
				assert.strictEqual(output.appendedSinceVersion(2, stdErrMime), undefined);
			}
		);
	});

	test('replacing streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [{ mime: stdOutMime, data: valueBytesFromString('append 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('append 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: false,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('replace 3')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 2, 'version should bump per replace');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('append 4')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 3, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'replace 3append 4');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'replacing output should clear out previous versioned output buffers');
				assert.strictEqual(output.appendedSinceVersion(1, stdOutMime), undefined,
					'replacing output should clear out previous versioned output buffers');
				assert.strictEqual(output.appendedSinceVersion(2, stdOutMime)?.toString(), 'append 4');
			}
		);
	});

	test('appending streaming outputs with move cursor compression', async function () {

		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('append 1') },
								{ mime: stdOutMime, data: valueBytesFromString('\nappend 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString(MOVE_CURSOR_1_LINE_COMMAND + '\nappend 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'append 1\nappend 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'compressing outputs should clear out previous versioned output buffers');
			}
		);
	});

	test('appending streaming outputs with carraige return compression', async function () {

		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('append 1') },
								{ mime: stdOutMime, data: valueBytesFromString('\nappend 1') }]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [{
							mime: stdOutMime, data: valueBytesFromString('\rappend 2')
						}]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per append');

				assert.strictEqual(output.outputs[0].data.toString(), 'append 1\nappend 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime), undefined,
					'compressing outputs should clear out previous versioned output buffers');
			}
		);
	});

	test('appending multiple different mime streaming outputs', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([
					{
						index: 0,
						editType: CellEditType.Output,
						append: true,
						outputs: [{
							outputId: 'append1',
							outputs: [
								{ mime: stdOutMime, data: valueBytesFromString('stdout 1') },
								{ mime: stdErrMime, data: valueBytesFromString('stderr 1') }
							]
						}]
					}], true, undefined, () => undefined, undefined, true);
				const [output] = textModel.cells[0].outputs;
				assert.strictEqual(output.versionId, 0, 'initial output version should be 0');

				textModel.applyEdits([
					{
						editType: CellEditType.OutputItems,
						append: true,
						outputId: 'append1',
						items: [
							{ mime: stdOutMime, data: valueBytesFromString('stdout 2') },
							{ mime: stdErrMime, data: valueBytesFromString('stderr 2') }
						]
					}], true, undefined, () => undefined, undefined, true);
				assert.strictEqual(output.versionId, 1, 'version should bump per replace');

				assert.strictEqual(output.appendedSinceVersion(0, stdErrMime)?.toString(), 'stderr 2');
				assert.strictEqual(output.appendedSinceVersion(0, stdOutMime)?.toString(), 'stdout 2');
			}
		);
	});

	test('metadata', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				// invalid index 1
				assert.throws(() => {
					textModel.applyEdits([{
						index: Number.MAX_VALUE,
						editType: CellEditType.Metadata,
						metadata: {}
					}], true, undefined, () => undefined, undefined, true);
				});

				// invalid index 2
				assert.throws(() => {
					textModel.applyEdits([{
						index: -1,
						editType: CellEditType.Metadata,
						metadata: {}
					}], true, undefined, () => undefined, undefined, true);
				});

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: { customProperty: 15 },
				}], true, undefined, () => undefined, undefined, true);

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: {},
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].metadata.customProperty, undefined);
			}
		);
	});

	test('partial metadata', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
			],
			(editor) => {
				const textModel = editor.textModel;

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.PartialMetadata,
					metadata: { customProperty: 15 },
				}], true, undefined, () => undefined, undefined, true);

				textModel.applyEdits([{
					index: 0,
					editType: CellEditType.PartialMetadata,
					metadata: {},
				}], true, undefined, () => undefined, undefined, true);

				assert.strictEqual(textModel.cells.length, 1);
				assert.strictEqual(textModel.cells[0].metadata.customProperty, 15);
			}
		);
	});

	test('multiple inserts in one edit', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, _viewModel, ds) => {
				const textModel = editor.textModel;
				let changeEvent: NotebookTextModelChangedEvent | undefined = undefined;
				const eventListener = textModel.onDidChangeContent(e => {
					changeEvent = e;
				});
				const willChangeEvents: NotebookTextModelWillAddRemoveEvent[] = [];
				const willChangeListener = textModel.onWillAddRemoveCells(e => {
					willChangeEvents.push(e);
				});
				const version = textModel.versionId;

				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{ editType: CellEditType.Replace, index: 1, count: 0, cells: [ds.add(new TestCell(textModel.viewType, 5, 'var e = 5;', 'javascript', CellKind.Code, [], languageService))] },
				], true, undefined, () => ({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }), undefined, true);

				assert.strictEqual(textModel.cells.length, 4);
				assert.strictEqual(textModel.cells[0].getValue(), 'var a = 1;');
				assert.strictEqual(textModel.cells[1].getValue(), 'var e = 5;');
				assert.strictEqual(textModel.cells[2].getValue(), 'var c = 3;');

				assert.notStrictEqual(changeEvent, undefined);
				assert.strictEqual(changeEvent!.rawEvents.length, 2);
				assert.deepStrictEqual(changeEvent!.endSelectionState?.selections, [{ start: 0, end: 1 }]);
				assert.strictEqual(willChangeEvents.length, 2);
				assert.strictEqual(textModel.versionId, version + 1);
				eventListener.dispose();
				willChangeListener.dispose();
			}
		);
	});

	test('insert and metadata change in one edit', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor) => {
				const textModel = editor.textModel;
				let changeEvent: NotebookTextModelChangedEvent | undefined = undefined;
				const eventListener = textModel.onDidChangeContent(e => {
					changeEvent = e;
				});
				const willChangeEvents: NotebookTextModelWillAddRemoveEvent[] = [];
				const willChangeListener = textModel.onWillAddRemoveCells(e => {
					willChangeEvents.push(e);
				});

				const version = textModel.versionId;

				textModel.applyEdits([
					{ editType: CellEditType.Replace, index: 1, count: 1, cells: [] },
					{
						index: 0,
						editType: CellEditType.Metadata,
						metadata: {},
					}
				], true, undefined, () => ({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] }), undefined, true);

				assert.notStrictEqual(changeEvent, undefined);
				assert.strictEqual(changeEvent!.rawEvents.length, 2);
				assert.deepStrictEqual(changeEvent!.endSelectionState?.selections, [{ start: 0, end: 1 }]);
				assert.strictEqual(willChangeEvents.length, 1);
				assert.strictEqual(textModel.versionId, version + 1);
				eventListener.dispose();
				willChangeListener.dispose();
			}
		);
	});


	test('Updating appending/updating output in Notebooks does not work as expected #117273', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;

			assert.strictEqual(model.cells.length, 1);
			assert.strictEqual(model.cells[0].outputs.length, 0);

			const success1 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success1);
			assert.strictEqual(model.cells[0].outputs.length, 1);

			const success2 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out2', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
					],
					append: true
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success2);
			assert.strictEqual(model.cells[0].outputs.length, 2);
		});
	});

	test('Clearing output of an empty notebook makes it dirty #119608', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], (editor, _, ds) => {
			const model = editor.textModel;

			let event: NotebookTextModelChangedEvent | undefined;

			ds.add(model.onDidChangeContent(e => { event = e; }));

			{
				// 1: add ouput -> event
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output, index: 0, outputs: [
							{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: VSBuffer.wrap(new Uint8Array([1])) }] }
						],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);

				assert.ok(success);
				assert.strictEqual(model.cells[0].outputs.length, 1);
				assert.ok(event);
			}

			{
				// 2: clear all output w/ output -> event
				event = undefined;
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output,
						index: 0,
						outputs: [],
						append: false
					}, {
						editType: CellEditType.Output,
						index: 1,
						outputs: [],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);
				assert.ok(success);
				assert.ok(event);
			}

			{
				// 2: clear all output wo/ output -> NO event
				event = undefined;
				const success = model.applyEdits(
					[{
						editType: CellEditType.Output,
						index: 0,
						outputs: [],
						append: false
					}, {
						editType: CellEditType.Output,
						index: 1,
						outputs: [],
						append: false
					}], true, undefined, () => undefined, undefined, false
				);

				assert.ok(success);
				assert.ok(event === undefined);
			}
		});
	});

	test('Cell metadata/output change should update version id and alternative id #121807', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 2;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel) => {
			assert.strictEqual(editor.textModel.versionId, 0);
			const firstAltVersion = '0_0,1;1,1';
			assert.strictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			editor.textModel.applyEdits([
				{
					index: 0,
					editType: CellEditType.Metadata,
					metadata: {
						inputCollapsed: true
					}
				}
			], true, undefined, () => undefined, undefined, true);
			assert.strictEqual(editor.textModel.versionId, 1);
			assert.notStrictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			const secondAltVersion = '1_0,1;1,1';
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

			await viewModel.undo();
			assert.strictEqual(editor.textModel.versionId, 2);
			assert.strictEqual(editor.textModel.alternativeVersionId, firstAltVersion);

			await viewModel.redo();
			assert.strictEqual(editor.textModel.versionId, 3);
			assert.notStrictEqual(editor.textModel.alternativeVersionId, firstAltVersion);
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

			editor.textModel.applyEdits([
				{
					index: 1,
					editType: CellEditType.Metadata,
					metadata: {
						inputCollapsed: true
					}
				}
			], true, undefined, () => undefined, undefined, true);
			assert.strictEqual(editor.textModel.versionId, 4);
			assert.strictEqual(editor.textModel.alternativeVersionId, '4_0,1;1,1');

			await viewModel.undo();
			assert.strictEqual(editor.textModel.versionId, 5);
			assert.strictEqual(editor.textModel.alternativeVersionId, secondAltVersion);

		});
	});

	test('metadata changes on newly added cells should combine their undo operations', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel, ds) => {
			const textModel = editor.textModel;
			editor.textModel.applyEdits([
				{
					editType: CellEditType.Replace, index: 1, count: 0, cells: [
						ds.add(new TestCell(textModel.viewType, 1, 'var e = 5;', 'javascript', CellKind.Code, [], languageService)),
						ds.add(new TestCell(textModel.viewType, 2, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))
					]
				},
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells.length, 3);

			editor.textModel.applyEdits([
				{ editType: CellEditType.Metadata, index: 1, metadata: { id: '123' } },
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells[1].metadata.id, '123');

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 1);

			await viewModel.redo();

			assert.strictEqual(textModel.cells.length, 3);
		});
	});

	test('changes with non-metadata edit should not combine their undo operations', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], async (editor, viewModel, ds) => {
			const textModel = editor.textModel;
			editor.textModel.applyEdits([
				{
					editType: CellEditType.Replace, index: 1, count: 0, cells: [
						ds.add(new TestCell(textModel.viewType, 1, 'var e = 5;', 'javascript', CellKind.Code, [], languageService)),
						ds.add(new TestCell(textModel.viewType, 2, 'var f = 6;', 'javascript', CellKind.Code, [], languageService))
					]
				},
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells.length, 3);

			editor.textModel.applyEdits([
				{ editType: CellEditType.Metadata, index: 1, metadata: { id: '123' } },
				{
					editType: CellEditType.Output, handle: 0, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			], true, undefined, () => undefined, undefined, true);

			assert.strictEqual(textModel.cells[1].metadata.id, '123');

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 3);

			await viewModel.undo();

			assert.strictEqual(textModel.cells.length, 1);
		});
	});

	test('Destructive sorting in _doApplyEdits #121994', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {

			const notebook = editor.textModel;

			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[0].outputs[0].outputs.length, 1);
			assert.deepStrictEqual(notebook.cells[0].outputs[0].outputs[0].data, valueBytesFromString('test'));

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, handle: 0, outputs: []
				},
				{
					editType: CellEditType.Output, handle: 0, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[0].outputs[0].outputs.length, 2);
		});
	});

	test('Destructive sorting in _doApplyEdits #121994. cell splice between output changes', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var b = 2;', 'javascript', CellKind.Code, [{ outputId: 'i43', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var c = 3;', 'javascript', CellKind.Code, [{ outputId: 'i44', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {
			const notebook = editor.textModel;

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, index: 0, outputs: []
				},
				{
					editType: CellEditType.Replace, index: 1, count: 1, cells: []
				},
				{
					editType: CellEditType.Output, index: 2, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells.length, 2);
			assert.strictEqual(notebook.cells[0].outputs.length, 0);
			assert.strictEqual(notebook.cells[1].outputs.length, 2);
			assert.strictEqual(notebook.cells[1].outputs[0].outputId, 'i44');
			assert.strictEqual(notebook.cells[1].outputs[1].outputId, 'newOutput');
		});
	});

	test('Destructive sorting in _doApplyEdits #121994. cell splice between output changes 2', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{ outputId: 'i42', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var b = 2;', 'javascript', CellKind.Code, [{ outputId: 'i43', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}],
			['var c = 3;', 'javascript', CellKind.Code, [{ outputId: 'i44', outputs: [{ mime: 'm/ime', data: valueBytesFromString('test') }] }], {}]
		], async (editor) => {
			const notebook = editor.textModel;

			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.Output, index: 1, append: true, outputs: [{
						outputId: 'newOutput',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				},
				{
					editType: CellEditType.Replace, index: 1, count: 1, cells: []
				},
				{
					editType: CellEditType.Output, index: 1, append: true, outputs: [{
						outputId: 'newOutput2',
						outputs: [{ mime: Mimes.text, data: valueBytesFromString('cba') }, { mime: 'application/foo', data: valueBytesFromString('cba') }]
					}]
				}
			];

			editor.textModel.applyEdits(edits, true, undefined, () => undefined, undefined, true);

			assert.strictEqual(notebook.cells.length, 2);
			assert.strictEqual(notebook.cells[0].outputs.length, 1);
			assert.strictEqual(notebook.cells[1].outputs.length, 1);
			assert.strictEqual(notebook.cells[1].outputs[0].outputId, 'i44');
		});
	});

	test('Output edits splice', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;

			assert.strictEqual(model.cells.length, 1);
			assert.strictEqual(model.cells[0].outputs.length, 0);

			const success1 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('1') }] },
						{ outputId: 'out2', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('2') }] },
						{ outputId: 'out3', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('3') }] },
						{ outputId: 'out4', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('4') }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success1);
			assert.strictEqual(model.cells[0].outputs.length, 4);

			const success2 = model.applyEdits(
				[{
					editType: CellEditType.Output, index: 0, outputs: [
						{ outputId: 'out1', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('1') }] },
						{ outputId: 'out5', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('5') }] },
						{ outputId: 'out3', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('3') }] },
						{ outputId: 'out6', outputs: [{ mime: 'application/x.notebook.stream', data: valueBytesFromString('6') }] }
					],
					append: false
				}], true, undefined, () => undefined, undefined, false
			);

			assert.ok(success2);
			assert.strictEqual(model.cells[0].outputs.length, 4);
			assert.strictEqual(model.cells[0].outputs[0].outputId, 'out1');
			assert.strictEqual(model.cells[0].outputs[1].outputId, 'out5');
			assert.strictEqual(model.cells[0].outputs[2].outputId, 'out3');
			assert.strictEqual(model.cells[0].outputs[3].outputId, 'out6');
		});
	});

	test('computeEdits no insert', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits = NotebookTextModel.computeEdits(model, [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} }
			]);
		});
	});

	test('computeEdits cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells },
			]);
		});
	});

	test('computeEdits last cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) },
			]);
		});
	});
	test('computeEdits first cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits middle cell content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}],
			['var c = 1;', 'javascript', CellKind.Code, [], {}],
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var c = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1, 2) },
				{ editType: CellEditType.Metadata, index: 2, metadata: {} },
			]);
		});
	});

	test('computeEdits cell metadata changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'foo' } },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: { name: 'foo' } },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell language changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'typescript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell kind changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Markup, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) },
			]);
		});
	});

	test('computeEdits cell metadata & content changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'foo' } },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { name: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: { name: 'foo' } },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) }
			]);
		});
	});

	test('computeEdits cell content changed while executing', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} },
				{ source: 'var b = 2;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} }
			];
			const edits = NotebookTextModel.computeEdits(model, cells, [model.cells[1].handle]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 1, cells: cells.slice(1) }
			]);
		});
	});

	test('computeEdits cell internal metadata changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, internalMetadata: { executionOrder: 1 } },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Replace, index: 0, count: 1, cells: cells.slice(0, 1) },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell internal metadata changed while executing', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {} },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: {}, internalMetadata: { executionOrder: 1 } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells, [model.cells[1].handle]);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Metadata, index: 1, metadata: {} },
			]);
		});
	});

	test('computeEdits cell insertion', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{ source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, },
				{ source: 'var c = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: undefined, },
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.Replace, index: 1, count: 0, cells: cells.slice(1, 2) },
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 3);
			assert.equal(model.cells[1].getValue(), 'var c = 1;');
			assert.equal(model.cells[2].getValue(), 'var b = 1;');
			assert.deepStrictEqual(model.cells[2].metadata, { foo: 'bar' });
		});
	});

	test('computeEdits output changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{
					source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], metadata: undefined,
				},
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{
					editType: CellEditType.Output, index: 0, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], append: false
				},
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 2);
			assert.strictEqual(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputId, 'someId');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), '_World_');
		});
	});

	test('computeEdits output items changed', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: 'someId',
				outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_Hello_') }]
			}], {}],
			['var b = 1;', 'javascript', CellKind.Code, [], {}]
		], (editor) => {
			const model = editor.textModel;
			const cells = [
				{
					source: 'var a = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [{
						outputId: 'someId',
						outputs: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }]
					}], metadata: undefined,
				},
				{ source: 'var b = 1;', language: 'javascript', cellKind: CellKind.Code, mime: undefined, outputs: [], metadata: { foo: 'bar' } }
			];
			const edits = NotebookTextModel.computeEdits(model, cells);

			assert.deepStrictEqual(edits, [
				{ editType: CellEditType.Metadata, index: 0, metadata: {} },
				{ editType: CellEditType.OutputItems, outputId: 'someId', items: [{ mime: Mimes.markdown, data: valueBytesFromString('_World_') }], append: false },
				{ editType: CellEditType.Metadata, index: 1, metadata: { foo: 'bar' } },
			]);

			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 2);
			assert.strictEqual(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputId, 'someId');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), '_World_');
		});
	});
	test('Append multiple text/plain output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'text/plain', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'text/plain', data: VSBuffer.fromString('bar') }, { mime: 'text/plain', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 3);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foo');
			assert.equal(model.cells[0].outputs[0].outputs[1].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[1].data.toString(), 'bar');
			assert.equal(model.cells[0].outputs[0].outputs[2].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[2].data.toString(), 'baz');
		});
	});
	test('Append multiple stdout stream output items to an output with another mime', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'text/plain', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 3);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'text/plain');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foo');
			assert.equal(model.cells[0].outputs[0].outputs[1].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[1].data.toString(), 'bar');
			assert.equal(model.cells[0].outputs[0].outputs[2].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[2].data.toString(), 'baz');
		});
	});
	test('Compress multiple stdout stream output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'application/vnd.code.notebook.stdout', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stdout', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'application/vnd.code.notebook.stdout');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foobarbaz');
		});

	});
	test('Compress multiple stderr stream output items', async function () {
		await withTestNotebook([
			['var a = 1;', 'javascript', CellKind.Code, [{
				outputId: '1',
				outputs: [{ mime: 'application/vnd.code.notebook.stderr', data: valueBytesFromString('foo') }]
			}], {}]
		], (editor) => {
			const model = editor.textModel;
			const edits: ICellEditOperation[] = [
				{
					editType: CellEditType.OutputItems,
					outputId: '1',
					append: true,
					items: [{ mime: 'application/vnd.code.notebook.stderr', data: VSBuffer.fromString('bar') }, { mime: 'application/vnd.code.notebook.stderr', data: VSBuffer.fromString('baz') }]
				}
			];
			model.applyEdits(edits, true, undefined, () => undefined, undefined, true);
			assert.equal(model.cells.length, 1);
			assert.equal(model.cells[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs.length, 1);
			assert.equal(model.cells[0].outputs[0].outputs[0].mime, 'application/vnd.code.notebook.stderr');
			assert.equal(model.cells[0].outputs[0].outputs[0].data.toString(), 'foobarbaz');
		});

	});

	test('findNextMatch', async function () {
		await withTestNotebook(
			[
				['var a = 1;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const notebookModel = viewModel.notebookDocument;

				// Test case 1: Find 'var' starting from the first cell
				let findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				// Test case 2: Find 'b' starting from the second cell
				findMatch = notebookModel.findNextMatch('b', { cellIndex: 1, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 3: Find 'c' starting from the third cell
				findMatch = notebookModel.findNextMatch('c', { cellIndex: 2, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 4: Find 'd' starting from the fourth cell
				findMatch = notebookModel.findNextMatch('d', { cellIndex: 3, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 5: No match found
				findMatch = notebookModel.findNextMatch('e', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.strictEqual(findMatch, null);
			}
		);
	});

	test('findNextMatch 2', async function () {
		await withTestNotebook(
			[
				['var a = 1; var a = 2;', 'javascript', CellKind.Code, [], {}],
				['var b = 2;', 'javascript', CellKind.Code, [], {}],
				['var c = 3;', 'javascript', CellKind.Code, [], {}],
				['var d = 4;', 'javascript', CellKind.Code, [], {}]
			],
			(editor, viewModel) => {
				const notebookModel = viewModel.notebookDocument;

				// Test case 1: Find 'var' starting from the first cell
				let findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				// Test case 2: Find 'b' starting from the second cell
				findMatch = notebookModel.findNextMatch('b', { cellIndex: 1, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 3: Find 'c' starting from the third cell
				findMatch = notebookModel.findNextMatch('c', { cellIndex: 2, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 4: Find 'd' starting from the fourth cell
				findMatch = notebookModel.findNextMatch('d', { cellIndex: 3, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 5);

				// Test case 5: No match found
				findMatch = notebookModel.findNextMatch('e', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.strictEqual(findMatch, null);

				// Test case 6: Same keywords in the same cell
				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 1) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);

				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 5) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 12);

				// Test case 7: Search from the middle of a cell with keyword before and after
				findMatch = notebookModel.findNextMatch('a', { cellIndex: 0, position: new Position(1, 10) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 13);

				// Test case 8: Search from a cell and next match is in another cell below
				findMatch = notebookModel.findNextMatch('var', { cellIndex: 0, position: new Position(1, 20) }, false, false, null);
				assert.ok(findMatch);
				assert.strictEqual(findMatch!.match.range.startLineNumber, 1);
				assert.strictEqual(findMatch!.match.range.startColumn, 1);
				// assert.strictEqual(match!.cellIndex, 1);
			}
		);
	});
});
```

--------------------------------------------------------------------------------

````
