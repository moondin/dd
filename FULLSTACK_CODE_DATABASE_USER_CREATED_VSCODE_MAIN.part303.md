---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 303
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 303 of 552)

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

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookKernels.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookKernels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { NotebookDto } from './mainThreadNotebookDto.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { INotebookEditor } from '../../contrib/notebook/browser/notebookBrowser.js';
import { INotebookEditorService } from '../../contrib/notebook/browser/services/notebookEditorService.js';
import { INotebookCellExecution, INotebookExecution, INotebookExecutionStateService } from '../../contrib/notebook/common/notebookExecutionStateService.js';
import { IKernelSourceActionProvider, INotebookKernel, INotebookKernelChangeEvent, INotebookKernelDetectionTask, INotebookKernelService, VariablesResult } from '../../contrib/notebook/common/notebookKernelService.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostContext, ExtHostNotebookKernelsShape, ICellExecuteUpdateDto, ICellExecutionCompleteDto, INotebookKernelDto2, MainContext, MainThreadNotebookKernelsShape } from '../common/extHost.protocol.js';
import { INotebookService } from '../../contrib/notebook/common/notebookService.js';
import { AsyncIterableEmitter, AsyncIterableProducer } from '../../../base/common/async.js';

abstract class MainThreadKernel implements INotebookKernel {
	private readonly _onDidChange = new Emitter<INotebookKernelChangeEvent>();
	private readonly preloads: { uri: URI; provides: readonly string[] }[];
	readonly onDidChange: Event<INotebookKernelChangeEvent> = this._onDidChange.event;

	readonly id: string;
	readonly viewType: string;
	readonly extension: ExtensionIdentifier;

	implementsInterrupt: boolean;
	label: string;
	description?: string;
	detail?: string;
	supportedLanguages: string[];
	implementsExecutionOrder: boolean;
	hasVariableProvider: boolean;
	localResourceRoot: URI;

	public get preloadUris() {
		return this.preloads.map(p => p.uri);
	}

	public get preloadProvides() {
		return this.preloads.flatMap(p => p.provides);
	}

	constructor(data: INotebookKernelDto2, private _languageService: ILanguageService) {
		this.id = data.id;
		this.viewType = data.notebookType;
		this.extension = data.extensionId;

		this.implementsInterrupt = data.supportsInterrupt ?? false;
		this.label = data.label;
		this.description = data.description;
		this.detail = data.detail;
		this.supportedLanguages = isNonEmptyArray(data.supportedLanguages) ? data.supportedLanguages : _languageService.getRegisteredLanguageIds();
		this.implementsExecutionOrder = data.supportsExecutionOrder ?? false;
		this.hasVariableProvider = data.hasVariableProvider ?? false;
		this.localResourceRoot = URI.revive(data.extensionLocation);
		this.preloads = data.preloads?.map(u => ({ uri: URI.revive(u.uri), provides: u.provides })) ?? [];
	}


	update(data: Partial<INotebookKernelDto2>) {

		const event: INotebookKernelChangeEvent = Object.create(null);
		if (data.label !== undefined) {
			this.label = data.label;
			event.label = true;
		}
		if (data.description !== undefined) {
			this.description = data.description;
			event.description = true;
		}
		if (data.detail !== undefined) {
			this.detail = data.detail;
			event.detail = true;
		}
		if (data.supportedLanguages !== undefined) {
			this.supportedLanguages = isNonEmptyArray(data.supportedLanguages) ? data.supportedLanguages : this._languageService.getRegisteredLanguageIds();
			event.supportedLanguages = true;
		}
		if (data.supportsExecutionOrder !== undefined) {
			this.implementsExecutionOrder = data.supportsExecutionOrder;
			event.hasExecutionOrder = true;
		}
		if (data.supportsInterrupt !== undefined) {
			this.implementsInterrupt = data.supportsInterrupt;
			event.hasInterruptHandler = true;
		}
		if (data.hasVariableProvider !== undefined) {
			this.hasVariableProvider = data.hasVariableProvider;
			event.hasVariableProvider = true;
		}
		this._onDidChange.fire(event);
	}

	abstract executeNotebookCellsRequest(uri: URI, cellHandles: number[]): Promise<void>;
	abstract cancelNotebookCellExecution(uri: URI, cellHandles: number[]): Promise<void>;
	abstract provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult>;
}

class MainThreadKernelDetectionTask implements INotebookKernelDetectionTask {
	constructor(readonly notebookType: string) { }
}

@extHostNamedCustomer(MainContext.MainThreadNotebookKernels)
export class MainThreadNotebookKernels implements MainThreadNotebookKernelsShape {

	private readonly _editors = new DisposableMap<INotebookEditor>();
	private readonly _disposables = new DisposableStore();

	private readonly _kernels = new Map<number, [kernel: MainThreadKernel, registraion: IDisposable]>();
	private readonly _kernelDetectionTasks = new Map<number, [task: MainThreadKernelDetectionTask, registraion: IDisposable]>();
	private readonly _kernelSourceActionProviders = new Map<number, [provider: IKernelSourceActionProvider, registraion: IDisposable]>();
	private readonly _kernelSourceActionProvidersEventRegistrations = new Map<number, IDisposable>();

	private readonly _proxy: ExtHostNotebookKernelsShape;

	private readonly _executions = new Map<number, INotebookCellExecution>();
	private readonly _notebookExecutions = new Map<number, INotebookExecution>();

	constructor(
		extHostContext: IExtHostContext,
		@ILanguageService private readonly _languageService: ILanguageService,
		@INotebookKernelService private readonly _notebookKernelService: INotebookKernelService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookEditorService notebookEditorService: INotebookEditorService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebookKernels);

		notebookEditorService.listNotebookEditors().forEach(this._onEditorAdd, this);
		notebookEditorService.onDidAddNotebookEditor(this._onEditorAdd, this, this._disposables);
		notebookEditorService.onDidRemoveNotebookEditor(this._onEditorRemove, this, this._disposables);

		this._disposables.add(toDisposable(() => {
			// EH shut down, complete all executions started by this EH
			this._executions.forEach(e => {
				e.complete({});
			});
			this._notebookExecutions.forEach(e => e.complete());
		}));

		this._disposables.add(this._notebookKernelService.onDidChangeSelectedNotebooks(e => {
			for (const [handle, [kernel,]] of this._kernels) {
				if (e.oldKernel === kernel.id) {
					this._proxy.$acceptNotebookAssociation(handle, e.notebook, false);
				} else if (e.newKernel === kernel.id) {
					this._proxy.$acceptNotebookAssociation(handle, e.notebook, true);
				}
			}
		}));
	}

	dispose(): void {
		this._disposables.dispose();
		for (const [, registration] of this._kernels.values()) {
			registration.dispose();
		}
		for (const [, registration] of this._kernelDetectionTasks.values()) {
			registration.dispose();
		}
		for (const [, registration] of this._kernelSourceActionProviders.values()) {
			registration.dispose();
		}
		this._editors.dispose();
	}

	// --- kernel ipc

	private _onEditorAdd(editor: INotebookEditor) {

		const ipcListener = editor.onDidReceiveMessage(e => {
			if (!editor.hasModel()) {
				return;
			}
			const { selected } = this._notebookKernelService.getMatchingKernel(editor.textModel);
			if (!selected) {
				return;
			}
			for (const [handle, candidate] of this._kernels) {
				if (candidate[0] === selected) {
					this._proxy.$acceptKernelMessageFromRenderer(handle, editor.getId(), e.message);
					break;
				}
			}
		});
		this._editors.set(editor, ipcListener);
	}

	private _onEditorRemove(editor: INotebookEditor) {
		this._editors.deleteAndDispose(editor);
	}

	async $postMessage(handle: number, editorId: string | undefined, message: unknown): Promise<boolean> {
		const tuple = this._kernels.get(handle);
		if (!tuple) {
			throw new Error('kernel already disposed');
		}
		const [kernel] = tuple;
		let didSend = false;
		for (const [editor] of this._editors) {
			if (!editor.hasModel()) {
				continue;
			}
			if (this._notebookKernelService.getMatchingKernel(editor.textModel).selected !== kernel) {
				// different kernel
				continue;
			}
			if (editorId === undefined) {
				// all editors
				editor.postMessage(message);
				didSend = true;
			} else if (editor.getId() === editorId) {
				// selected editors
				editor.postMessage(message);
				didSend = true;
				break;
			}
		}
		return didSend;
	}

	private variableRequestIndex = 0;
	private variableRequestMap = new Map<string, AsyncIterableEmitter<VariablesResult>>();
	$receiveVariable(requestId: string, variable: VariablesResult) {
		const emitter = this.variableRequestMap.get(requestId);
		if (emitter) {
			emitter.emitOne(variable);
		}
	}

	// --- kernel adding/updating/removal

	async $addKernel(handle: number, data: INotebookKernelDto2): Promise<void> {
		const that = this;
		const kernel = new class extends MainThreadKernel {
			async executeNotebookCellsRequest(uri: URI, handles: number[]): Promise<void> {
				await that._proxy.$executeCells(handle, uri, handles);
			}
			async cancelNotebookCellExecution(uri: URI, handles: number[]): Promise<void> {
				await that._proxy.$cancelCells(handle, uri, handles);
			}
			provideVariables(notebookUri: URI, parentId: number | undefined, kind: 'named' | 'indexed', start: number, token: CancellationToken): AsyncIterableProducer<VariablesResult> {
				const requestId = `${handle}variables${that.variableRequestIndex++}`;

				return new AsyncIterableProducer<VariablesResult>(async emitter => {
					that.variableRequestMap.set(requestId, emitter);

					try {
						await that._proxy.$provideVariables(handle, requestId, notebookUri, parentId, kind, start, token);
					} finally {
						that.variableRequestMap.delete(requestId);
					}
				});
			}
		}(data, this._languageService);

		const disposables = this._disposables.add(new DisposableStore());
		// Ensure _kernels is up to date before we register a kernel.
		this._kernels.set(handle, [kernel, disposables]);
		disposables.add(this._notebookKernelService.registerKernel(kernel));
	}

	$updateKernel(handle: number, data: Partial<INotebookKernelDto2>): void {
		const tuple = this._kernels.get(handle);
		if (tuple) {
			tuple[0].update(data);
		}
	}

	$removeKernel(handle: number): void {
		const tuple = this._kernels.get(handle);
		if (tuple) {
			tuple[1].dispose();
			this._kernels.delete(handle);
		}
	}

	$updateNotebookPriority(handle: number, notebook: UriComponents, value: number | undefined): void {
		const tuple = this._kernels.get(handle);
		if (tuple) {
			this._notebookKernelService.updateKernelNotebookAffinity(tuple[0], URI.revive(notebook), value);
		}
	}

	// --- Cell execution

	$createExecution(handle: number, controllerId: string, rawUri: UriComponents, cellHandle: number): void {
		const uri = URI.revive(rawUri);
		const notebook = this._notebookService.getNotebookTextModel(uri);
		if (!notebook) {
			throw new Error(`Notebook not found: ${uri.toString()}`);
		}

		const kernel = this._notebookKernelService.getMatchingKernel(notebook);
		if (!kernel.selected || kernel.selected.id !== controllerId) {
			throw new Error(`Kernel is not selected: ${kernel.selected?.id} !== ${controllerId}`);
		}
		const execution = this._notebookExecutionStateService.createCellExecution(uri, cellHandle);
		execution.confirm();
		this._executions.set(handle, execution);
	}

	$updateExecution(handle: number, data: SerializableObjectWithBuffers<ICellExecuteUpdateDto[]>): void {
		const updates = data.value;
		try {
			const execution = this._executions.get(handle);
			execution?.update(updates.map(NotebookDto.fromCellExecuteUpdateDto));
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	$completeExecution(handle: number, data: SerializableObjectWithBuffers<ICellExecutionCompleteDto>): void {
		try {
			const execution = this._executions.get(handle);
			execution?.complete(NotebookDto.fromCellExecuteCompleteDto(data.value));
		} catch (e) {
			onUnexpectedError(e);
		} finally {
			this._executions.delete(handle);
		}
	}

	// --- Notebook execution

	$createNotebookExecution(handle: number, controllerId: string, rawUri: UriComponents): void {
		const uri = URI.revive(rawUri);
		const notebook = this._notebookService.getNotebookTextModel(uri);
		if (!notebook) {
			throw new Error(`Notebook not found: ${uri.toString()}`);
		}

		const kernel = this._notebookKernelService.getMatchingKernel(notebook);
		if (!kernel.selected || kernel.selected.id !== controllerId) {
			throw new Error(`Kernel is not selected: ${kernel.selected?.id} !== ${controllerId}`);
		}
		const execution = this._notebookExecutionStateService.createExecution(uri);
		execution.confirm();
		this._notebookExecutions.set(handle, execution);
	}

	$beginNotebookExecution(handle: number): void {
		try {
			const execution = this._notebookExecutions.get(handle);
			execution?.begin();
		} catch (e) {
			onUnexpectedError(e);
		}
	}

	$completeNotebookExecution(handle: number): void {
		try {
			const execution = this._notebookExecutions.get(handle);
			execution?.complete();
		} catch (e) {
			onUnexpectedError(e);
		} finally {
			this._notebookExecutions.delete(handle);
		}
	}

	// --- notebook kernel detection task
	async $addKernelDetectionTask(handle: number, notebookType: string): Promise<void> {
		const kernelDetectionTask = new MainThreadKernelDetectionTask(notebookType);
		const registration = this._notebookKernelService.registerNotebookKernelDetectionTask(kernelDetectionTask);
		this._kernelDetectionTasks.set(handle, [kernelDetectionTask, registration]);
	}

	$removeKernelDetectionTask(handle: number): void {
		const tuple = this._kernelDetectionTasks.get(handle);
		if (tuple) {
			tuple[1].dispose();
			this._kernelDetectionTasks.delete(handle);
		}
	}

	// --- notebook kernel source action provider

	async $addKernelSourceActionProvider(handle: number, eventHandle: number, notebookType: string): Promise<void> {
		const kernelSourceActionProvider: IKernelSourceActionProvider = {
			viewType: notebookType,
			provideKernelSourceActions: async () => {
				const actions = await this._proxy.$provideKernelSourceActions(handle, CancellationToken.None);

				return actions.map(action => {
					let documentation = action.documentation;
					if (action.documentation && typeof action.documentation !== 'string') {
						documentation = URI.revive(action.documentation);
					}

					return {
						label: action.label,
						command: action.command,
						description: action.description,
						detail: action.detail,
						documentation,
					};
				});
			}
		};

		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._kernelSourceActionProvidersEventRegistrations.set(eventHandle, emitter);
			kernelSourceActionProvider.onDidChangeSourceActions = emitter.event;
		}

		const registration = this._notebookKernelService.registerKernelSourceActionProvider(notebookType, kernelSourceActionProvider);
		this._kernelSourceActionProviders.set(handle, [kernelSourceActionProvider, registration]);
	}

	$removeKernelSourceActionProvider(handle: number, eventHandle: number): void {
		const tuple = this._kernelSourceActionProviders.get(handle);
		if (tuple) {
			tuple[1].dispose();
			this._kernelSourceActionProviders.delete(handle);
		}
		if (typeof eventHandle === 'number') {
			this._kernelSourceActionProvidersEventRegistrations.delete(eventHandle);
		}
	}

	$emitNotebookKernelSourceActionsChangeEvent(eventHandle: number): void {
		const emitter = this._kernelSourceActionProvidersEventRegistrations.get(eventHandle);
		if (emitter instanceof Emitter) {
			emitter.fire(undefined);
		}
	}

	$variablesUpdated(notebookUri: UriComponents): void {
		this._notebookKernelService.notifyVariablesChange(URI.revive(notebookUri));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookRenderers.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookRenderers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { ExtHostContext, ExtHostNotebookRenderersShape, MainContext, MainThreadNotebookRenderersShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { INotebookRendererMessagingService } from '../../contrib/notebook/common/notebookRendererMessagingService.js';

@extHostNamedCustomer(MainContext.MainThreadNotebookRenderers)
export class MainThreadNotebookRenderers extends Disposable implements MainThreadNotebookRenderersShape {
	private readonly proxy: ExtHostNotebookRenderersShape;

	constructor(
		extHostContext: IExtHostContext,
		@INotebookRendererMessagingService private readonly messaging: INotebookRendererMessagingService,
	) {
		super();
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebookRenderers);
		this._register(messaging.onShouldPostMessage(e => {
			this.proxy.$postRendererMessage(e.editorId, e.rendererId, e.message);
		}));
	}

	$postMessage(editorId: string | undefined, rendererId: string, message: unknown): Promise<boolean> {
		return this.messaging.receiveMessage(editorId, rendererId, message);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookSaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookSaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { localize } from '../../../nls.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IProgressStep, IProgress } from '../../../platform/progress/common/progress.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostNotebookDocumentSaveParticipantShape } from '../common/extHost.protocol.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { raceCancellationError } from '../../../base/common/async.js';
import { IStoredFileWorkingCopySaveParticipant, IStoredFileWorkingCopySaveParticipantContext, IWorkingCopyFileService } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel } from '../../services/workingCopy/common/storedFileWorkingCopy.js';
import { NotebookFileWorkingCopyModel } from '../../contrib/notebook/common/notebookEditorModel.js';

class ExtHostNotebookDocumentSaveParticipant implements IStoredFileWorkingCopySaveParticipant {

	private readonly _proxy: ExtHostNotebookDocumentSaveParticipantShape;

	constructor(extHostContext: IExtHostContext) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebookDocumentSaveParticipant);
	}

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, _progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {

		if (!workingCopy.model || !(workingCopy.model instanceof NotebookFileWorkingCopyModel)) {
			return undefined;
		}

		let _warningTimeout: Timeout;

		const p = new Promise<void>((resolve, reject) => {

			_warningTimeout = setTimeout(
				() => reject(new Error(localize('timeout.onWillSave', "Aborted onWillSaveNotebookDocument-event after 1750ms"))),
				1750
			);
			this._proxy.$participateInSave(workingCopy.resource, context.reason, token).then(_ => {
				clearTimeout(_warningTimeout);
				return undefined;
			}).then(resolve, reject);
		});

		return raceCancellationError(p, token);
	}
}

@extHostCustomer
export class SaveParticipant {

	private _saveParticipantDisposable: IDisposable;

	constructor(
		extHostContext: IExtHostContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService
	) {
		this._saveParticipantDisposable = this.workingCopyFileService.addSaveParticipant(instantiationService.createInstance(ExtHostNotebookDocumentSaveParticipant, extHostContext));
	}

	dispose(): void {
		this._saveParticipantDisposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadOutputService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadOutputService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../platform/registry/common/platform.js';
import { Extensions, IOutputChannelRegistry, IOutputService, IOutputChannel, OUTPUT_VIEW_ID, OutputChannelUpdateMode } from '../../services/output/common/output.js';
import { MainThreadOutputServiceShape, MainContext, ExtHostOutputServiceShape, ExtHostContext } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { UriComponents, URI } from '../../../base/common/uri.js';
import { Disposable, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { Event } from '../../../base/common/event.js';
import { IViewsService } from '../../services/views/common/viewsService.js';
import { isNumber } from '../../../base/common/types.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IStatusbarEntry, IStatusbarEntryAccessor, IStatusbarService, StatusbarAlignment } from '../../services/statusbar/browser/statusbar.js';
import { localize } from '../../../nls.js';

@extHostNamedCustomer(MainContext.MainThreadOutputService)
export class MainThreadOutputService extends Disposable implements MainThreadOutputServiceShape {

	private static _extensionIdPool = new Map<string, number>();

	private readonly _proxy: ExtHostOutputServiceShape;
	private readonly _outputService: IOutputService;
	private readonly _viewsService: IViewsService;
	private readonly _configurationService: IConfigurationService;
	private readonly _statusbarService: IStatusbarService;

	private readonly _outputStatusItem = this._register(new MutableDisposable<IStatusbarEntryAccessor>());

	constructor(
		extHostContext: IExtHostContext,
		@IOutputService outputService: IOutputService,
		@IViewsService viewsService: IViewsService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStatusbarService statusbarService: IStatusbarService,
	) {
		super();
		this._outputService = outputService;
		this._viewsService = viewsService;
		this._configurationService = configurationService;
		this._statusbarService = statusbarService;

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostOutputService);

		const setVisibleChannel = () => {
			const visibleChannel = this._viewsService.isViewVisible(OUTPUT_VIEW_ID) ? this._outputService.getActiveChannel() : undefined;
			this._proxy.$setVisibleChannel(visibleChannel ? visibleChannel.id : null);
			this._outputStatusItem.value = undefined;
		};
		this._register(Event.any<unknown>(this._outputService.onActiveOutputChannel, Event.filter(this._viewsService.onDidChangeViewVisibility, ({ id }) => id === OUTPUT_VIEW_ID))(() => setVisibleChannel()));
		setVisibleChannel();
	}

	public async $register(label: string, file: UriComponents, languageId: string | undefined, extensionId: string): Promise<string> {
		const idCounter = (MainThreadOutputService._extensionIdPool.get(extensionId) || 0) + 1;
		MainThreadOutputService._extensionIdPool.set(extensionId, idCounter);
		const id = `extension-output-${extensionId}-#${idCounter}-${label}`;
		const resource = URI.revive(file);

		Registry.as<IOutputChannelRegistry>(Extensions.OutputChannels).registerChannel({ id, label, source: { resource }, log: false, languageId, extensionId });
		this._register(toDisposable(() => this.$dispose(id)));
		return id;
	}

	public async $update(channelId: string, mode: OutputChannelUpdateMode, till?: number): Promise<void> {
		const channel = this._getChannel(channelId);
		if (channel) {
			if (mode === OutputChannelUpdateMode.Append) {
				channel.update(mode);
			} else if (isNumber(till)) {
				channel.update(mode, till);
			}
		}
	}

	public async $reveal(channelId: string, preserveFocus: boolean): Promise<void> {
		const channel = this._getChannel(channelId);
		if (!channel) {
			return;
		}

		const viewsToShowQuietly = this._configurationService.getValue<Record<string, boolean> | undefined>('workbench.view.showQuietly') ?? {};
		if (!this._viewsService.isViewVisible(OUTPUT_VIEW_ID) && viewsToShowQuietly[OUTPUT_VIEW_ID]) {
			this._showChannelQuietly(channel);
			return;
		}

		this._outputService.showChannel(channel.id, preserveFocus);
	}

	// Show status bar indicator
	private _showChannelQuietly(channel: IOutputChannel) {
		const statusProperties: IStatusbarEntry = {
			name: localize('status.showOutput', "Show Output"),
			text: '$(output)',
			ariaLabel: localize('status.showOutputAria', "Show {0} Output Channel", channel.label),
			command: `workbench.action.output.show.${channel.id}`,
			tooltip: localize('status.showOutputTooltip', "Show {0} Output Channel", channel.label),
			kind: 'prominent'
		};

		if (!this._outputStatusItem.value) {
			this._outputStatusItem.value = this._statusbarService.addEntry(
				statusProperties,
				'status.view.showQuietly',
				StatusbarAlignment.RIGHT,
				{ location: { id: 'status.notifications', priority: Number.NEGATIVE_INFINITY }, alignment: StatusbarAlignment.LEFT }
			);
		} else {
			this._outputStatusItem.value.update(statusProperties);
		}
	}

	public async $close(channelId: string): Promise<void> {
		if (this._viewsService.isViewVisible(OUTPUT_VIEW_ID)) {
			const activeChannel = this._outputService.getActiveChannel();
			if (activeChannel && channelId === activeChannel.id) {
				this._viewsService.closeView(OUTPUT_VIEW_ID);
			}
		}
	}

	public async $dispose(channelId: string): Promise<void> {
		const channel = this._getChannel(channelId);
		channel?.dispose();
	}

	private _getChannel(channelId: string): IOutputChannel | undefined {
		return this._outputService.getChannel(channelId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadProfileContentHandlers.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadProfileContentHandlers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap, IDisposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { URI } from '../../../base/common/uri.js';
import { ExtHostContext, ExtHostProfileContentHandlersShape, MainContext, MainThreadProfileContentHandlersShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ISaveProfileResult, IUserDataProfileImportExportService } from '../../services/userDataProfile/common/userDataProfile.js';

@extHostNamedCustomer(MainContext.MainThreadProfileContentHandlers)
export class MainThreadProfileContentHandlers extends Disposable implements MainThreadProfileContentHandlersShape {

	private readonly proxy: ExtHostProfileContentHandlersShape;

	private readonly registeredHandlers = this._register(new DisposableMap<string, IDisposable>());

	constructor(
		context: IExtHostContext,
		@IUserDataProfileImportExportService private readonly userDataProfileImportExportService: IUserDataProfileImportExportService,
	) {
		super();
		this.proxy = context.getProxy(ExtHostContext.ExtHostProfileContentHandlers);
	}

	async $registerProfileContentHandler(id: string, name: string, description: string | undefined, extensionId: string): Promise<void> {
		this.registeredHandlers.set(id, this.userDataProfileImportExportService.registerProfileContentHandler(id, {
			name,
			description,
			extensionId,
			saveProfile: async (name: string, content: string, token: CancellationToken) => {
				const result = await this.proxy.$saveProfile(id, name, content, token);
				return result ? revive<ISaveProfileResult>(result) : null;
			},
			readProfile: async (uri: URI, token: CancellationToken) => {
				return this.proxy.$readProfile(id, uri, token);
			},
		}));
	}

	async $unregisterProfileContentHandler(id: string): Promise<void> {
		this.registeredHandlers.deleteAndDispose(id);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadProgress.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadProgress.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProgress, IProgressService, IProgressStep, ProgressLocation, IProgressOptions, IProgressNotificationOptions } from '../../../platform/progress/common/progress.js';
import { MainThreadProgressShape, MainContext, ExtHostProgressShape, ExtHostContext } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { localize } from '../../../nls.js';
import { onUnexpectedExternalError } from '../../../base/common/errors.js';
import { toAction } from '../../../base/common/actions.js';
import { NotificationPriority } from '../../../platform/notification/common/notification.js';

@extHostNamedCustomer(MainContext.MainThreadProgress)
export class MainThreadProgress implements MainThreadProgressShape {

	private static readonly URGENT_PROGRESS_SOURCES = [
		'vscode.github-authentication',
		'vscode.microsoft-authentication'
	];

	private readonly _progressService: IProgressService;
	private _progress = new Map<number, { resolve: () => void; progress: IProgress<IProgressStep> }>();
	private readonly _proxy: ExtHostProgressShape;

	constructor(
		extHostContext: IExtHostContext,
		@IProgressService progressService: IProgressService,
		@ICommandService private readonly _commandService: ICommandService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostProgress);
		this._progressService = progressService;
	}

	dispose(): void {
		this._progress.forEach(handle => handle.resolve());
		this._progress.clear();
	}

	async $startProgress(handle: number, options: IProgressOptions, extensionId?: string): Promise<void> {
		const task = this._createTask(handle);

		if (options.location === ProgressLocation.Notification && extensionId) {
			const sourceIsUrgent = MainThreadProgress.URGENT_PROGRESS_SOURCES.includes(extensionId);
			const notificationOptions: IProgressNotificationOptions = {
				...options,
				priority: sourceIsUrgent ? NotificationPriority.URGENT : NotificationPriority.DEFAULT,
				location: ProgressLocation.Notification,
				secondaryActions: [toAction({
					id: extensionId,
					label: localize('manageExtension', "Manage Extension"),
					run: () => this._commandService.executeCommand('_extensions.manage', extensionId)
				})]
			};

			options = notificationOptions;
		}

		try {
			this._progressService.withProgress(options, task, () => this._proxy.$acceptProgressCanceled(handle));
		} catch (err) {
			// the withProgress-method will throw synchronously when invoked with bad options
			// which is then an enternal/extension error
			onUnexpectedExternalError(err);
		}
	}

	$progressReport(handle: number, message: IProgressStep): void {
		const entry = this._progress.get(handle);
		entry?.progress.report(message);
	}

	$progressEnd(handle: number): void {
		const entry = this._progress.get(handle);
		if (entry) {
			entry.resolve();
			this._progress.delete(handle);
		}
	}

	private _createTask(handle: number) {
		return (progress: IProgress<IProgressStep>) => {
			return new Promise<void>(resolve => {
				this._progress.set(handle, { resolve, progress });
			});
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadQuickDiff.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadQuickDiff.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { DisposableMap, IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ExtHostContext, ExtHostQuickDiffShape, IDocumentFilterDto, MainContext, MainThreadQuickDiffShape } from '../common/extHost.protocol.js';
import { IQuickDiffService, QuickDiffProvider } from '../../contrib/scm/common/quickDiff.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadQuickDiff)
export class MainThreadQuickDiff implements MainThreadQuickDiffShape {

	private readonly proxy: ExtHostQuickDiffShape;
	private providerDisposables = new DisposableMap<number, IDisposable>();

	constructor(
		extHostContext: IExtHostContext,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostQuickDiff);
	}

	async $registerQuickDiffProvider(handle: number, selector: IDocumentFilterDto[], id: string, label: string, rootUri: UriComponents | undefined): Promise<void> {
		const provider: QuickDiffProvider = {
			id,
			label,
			rootUri: URI.revive(rootUri),
			selector,
			kind: 'contributed',
			getOriginalResource: async (uri: URI) => {
				return URI.revive(await this.proxy.$provideOriginalResource(handle, uri, CancellationToken.None));
			}
		};
		const disposable = this.quickDiffService.addQuickDiffProvider(provider);
		this.providerDisposables.set(handle, disposable);
	}

	async $unregisterQuickDiffProvider(handle: number): Promise<void> {
		if (this.providerDisposables.has(handle)) {
			this.providerDisposables.deleteAndDispose(handle);
		}
	}

	dispose(): void {
		this.providerDisposables.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadQuickOpen.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadQuickOpen.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Toggle } from '../../../base/browser/ui/toggle/toggle.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Lazy } from '../../../base/common/lazy.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { basenameOrAuthority, dirname, hasTrailingPathSeparator } from '../../../base/common/resources.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { isUriComponents, URI } from '../../../base/common/uri.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { FileKind } from '../../../platform/files/common/files.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { IInputOptions, IPickOptions, IQuickInput, IQuickInputService, IQuickPick, IQuickPickItem, QuickInputButtonLocation } from '../../../platform/quickinput/common/quickInput.js';
import { asCssVariable, inputActiveOptionBackground, inputActiveOptionBorder, inputActiveOptionForeground } from '../../../platform/theme/common/colorRegistry.js';
import { ICustomEditorLabelService } from '../../services/editor/common/customEditorLabelService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostQuickOpenShape, IInputBoxOptions, MainContext, MainThreadQuickOpenShape, TransferQuickInput, TransferQuickInputButton, TransferQuickPickItem, TransferQuickPickItemOrSeparator } from '../common/extHost.protocol.js';

interface QuickInputSession {
	input: IQuickInput;
	handlesToItems: Map<number, TransferQuickPickItem>;
	handlesToToggles: Map<number, { toggle: Toggle; listener: IDisposable }>;
	store: DisposableStore;
}

@extHostNamedCustomer(MainContext.MainThreadQuickOpen)
export class MainThreadQuickOpen implements MainThreadQuickOpenShape {

	private readonly _proxy: ExtHostQuickOpenShape;
	private readonly _quickInputService: IQuickInputService;
	private readonly _items: Record<number, {
		resolve(items: TransferQuickPickItemOrSeparator[]): void;
		reject(error: Error): void;
	}> = {};

	constructor(
		extHostContext: IExtHostContext,
		@IQuickInputService quickInputService: IQuickInputService,
		@ILabelService private readonly labelService: ILabelService,
		@ICustomEditorLabelService private readonly customEditorLabelService: ICustomEditorLabelService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostQuickOpen);
		this._quickInputService = quickInputService;
	}

	public dispose(): void {
		for (const [_id, session] of this.sessions) {
			session.store.dispose();
		}
	}

	$show(instance: number, options: IPickOptions<TransferQuickPickItem>, token: CancellationToken): Promise<number | number[] | undefined> {
		const contents = new Promise<TransferQuickPickItemOrSeparator[]>((resolve, reject) => {
			this._items[instance] = { resolve, reject };
		});

		options = {
			...options,
			onDidFocus: el => {
				if (el) {
					this._proxy.$onItemSelected(el.handle);
				}
			}
		};

		if (options.canPickMany) {
			return this._quickInputService.pick(contents, options as { canPickMany: true }, token).then(items => {
				if (items) {
					return items.map(item => item.handle);
				}
				return undefined;
			});
		} else {
			return this._quickInputService.pick(contents, options, token).then(item => {
				if (item) {
					return item.handle;
				}
				return undefined;
			});
		}
	}

	$setItems(instance: number, items: TransferQuickPickItemOrSeparator[]): Promise<void> {
		if (this._items[instance]) {
			items.forEach(item => this.expandItemProps(item));
			this._items[instance].resolve(items);
			delete this._items[instance];
		}
		return Promise.resolve();
	}

	$setError(instance: number, error: Error): Promise<void> {
		if (this._items[instance]) {
			this._items[instance].reject(error);
			delete this._items[instance];
		}
		return Promise.resolve();
	}

	// ---- input

	$input(options: IInputBoxOptions | undefined, validateInput: boolean, token: CancellationToken): Promise<string | undefined> {
		const inputOptions: IInputOptions = Object.create(null);

		if (options) {
			inputOptions.title = options.title;
			inputOptions.password = options.password;
			inputOptions.placeHolder = options.placeHolder;
			inputOptions.valueSelection = options.valueSelection;
			inputOptions.prompt = options.prompt;
			inputOptions.value = options.value;
			inputOptions.ignoreFocusLost = options.ignoreFocusOut;
		}

		if (validateInput) {
			inputOptions.validateInput = (value) => {
				return this._proxy.$validateInput(value);
			};
		}

		return this._quickInputService.input(inputOptions, token);
	}

	// ---- QuickInput

	private sessions = new Map<number, QuickInputSession>();

	$createOrUpdate(params: TransferQuickInput): Promise<void> {
		const sessionId = params.id;
		let session = this.sessions.get(sessionId);
		if (!session) {
			const store = new DisposableStore();
			const input = params.type === 'quickPick' ? this._quickInputService.createQuickPick() : this._quickInputService.createInputBox();
			store.add(input);
			store.add(input.onDidAccept(() => {
				this._proxy.$onDidAccept(sessionId);
			}));
			store.add(input.onDidTriggerButton(button => {
				this._proxy.$onDidTriggerButton(sessionId, (button as TransferQuickInputButton).handle);
			}));
			store.add(input.onDidChangeValue(value => {
				this._proxy.$onDidChangeValue(sessionId, value);
			}));
			store.add(input.onDidHide(() => {
				this._proxy.$onDidHide(sessionId);
			}));

			if (params.type === 'quickPick') {
				// Add extra events specific for quickpick
				const quickpick = input as IQuickPick<IQuickPickItem>;
				store.add(quickpick.onDidChangeActive(items => {
					this._proxy.$onDidChangeActive(sessionId, items.map(item => (item as TransferQuickPickItem).handle));
				}));
				store.add(quickpick.onDidChangeSelection(items => {
					this._proxy.$onDidChangeSelection(sessionId, items.map(item => (item as TransferQuickPickItem).handle));
				}));
				store.add(quickpick.onDidTriggerItemButton((e) => {
					this._proxy.$onDidTriggerItemButton(sessionId, (e.item as TransferQuickPickItem).handle, (e.button as TransferQuickInputButton).handle);
				}));
			}

			session = {
				input,
				handlesToItems: new Map(),
				handlesToToggles: new Map(),
				store
			};
			this.sessions.set(sessionId, session);
		}

		const { input, handlesToItems } = session;
		const quickPick = input as IQuickPick<IQuickPickItem>;
		for (const param in params) {
			switch (param) {
				case 'id':
				case 'type':
					continue;

				case 'visible':
					if (params.visible) {
						input.show();
					} else {
						input.hide();
					}
					break;

				case 'items': {
					handlesToItems.clear();
					params.items?.forEach((item: TransferQuickPickItemOrSeparator) => {
						this.expandItemProps(item);
						if (item.type !== 'separator') {
							item.buttons?.forEach(button => this.expandIconPath(button));
							handlesToItems.set(item.handle, item);
						}
					});
					quickPick.items = params.items;
					break;
				}

				case 'activeItems':
					quickPick.activeItems = params.activeItems
						?.map((handle: number) => handlesToItems.get(handle))
						.filter(Boolean);
					break;

				case 'selectedItems':
					quickPick.selectedItems = params.selectedItems
						?.map((handle: number) => handlesToItems.get(handle))
						.filter(Boolean);
					break;

				case 'buttons': {
					const buttons = [], toggles = [];
					for (const button of params.buttons!) {
						if (button.handle === -1) {
							buttons.push(this._quickInputService.backButton);
						} else {
							this.expandIconPath(button);

							// Currently buttons are only supported outside of the input box
							// and toggles only inside. When/if that changes, this will need to be updated.
							if (button.location === QuickInputButtonLocation.Input) {
								toggles.push(button);
							} else {
								buttons.push(button);
							}
						}
					}
					input.buttons = buttons;
					this.updateToggles(sessionId, session, toggles);
					break;
				}

				default:
					// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
					(input as any)[param] = params[param];
					break;
			}
		}
		return Promise.resolve(undefined);
	}

	$dispose(sessionId: number): Promise<void> {
		const session = this.sessions.get(sessionId);
		if (session) {
			session.store.dispose();
			this.sessions.delete(sessionId);
		}
		return Promise.resolve(undefined);
	}

	/**
	* Derives icon, label and description for Quick Pick items that represent a resource URI.
	*/
	private expandItemProps(item: TransferQuickPickItemOrSeparator) {
		if (item.type === 'separator') {
			return;
		}

		if (!item.resourceUri) {
			this.expandIconPath(item);
			return;
		}

		// Derive missing label and description from resourceUri.
		const resourceUri = URI.from(item.resourceUri);
		item.label ??= this.customEditorLabelService.getName(resourceUri) || '';
		if (item.label) {
			item.description ??= this.labelService.getUriLabel(resourceUri, { relative: true });
		} else {
			item.label = basenameOrAuthority(resourceUri);
			item.description ??= this.labelService.getUriLabel(dirname(resourceUri), { relative: true });
		}

		// Derive icon props from resourceUri if icon is set to ThemeIcon.File or ThemeIcon.Folder.
		const icon = item.iconPathDto;
		if (ThemeIcon.isThemeIcon(icon) && (ThemeIcon.isFile(icon) || ThemeIcon.isFolder(icon))) {
			const fileKind = ThemeIcon.isFolder(icon) || hasTrailingPathSeparator(resourceUri) ? FileKind.FOLDER : FileKind.FILE;
			const iconClasses = new Lazy(() => getIconClasses(this.modelService, this.languageService, resourceUri, fileKind));
			Object.defineProperty(item, 'iconClasses', { get: () => iconClasses.value });
		} else {
			this.expandIconPath(item);
		}
	}

	/**
	* Converts IconPath DTO into iconPath/iconClass properties.
	*/
	private expandIconPath(target: Pick<TransferQuickPickItem, 'iconPathDto' | 'iconPath' | 'iconClass'>) {
		const icon = target.iconPathDto;
		if (!icon) {
			return;
		} else if (ThemeIcon.isThemeIcon(icon)) {
			// TODO: Since IQuickPickItem and IQuickInputButton do not support ThemeIcon directly, the color ID is lost here.
			// We should consider changing changing iconPath/iconClass to IconPath in both interfaces.
			// Request for color support: https://github.com/microsoft/vscode/issues/185356..
			target.iconClass = ThemeIcon.asClassName(icon);
		} else if (isUriComponents(icon)) {
			const uri = URI.from(icon);
			target.iconPath = { dark: uri, light: uri };
		} else {
			const { dark, light } = icon;
			target.iconPath = { dark: URI.from(dark), light: URI.from(light) };
		}
	}

	/**
	* Updates the toggles for a given quick input session by creating new {@link Toggle}-s
	* from buttons, updating existing toggles props and removing old ones.
	*/
	private updateToggles(sessionId: number, session: QuickInputSession, buttons: TransferQuickInputButton[]) {
		const { input, handlesToToggles, store } = session;

		// Add new or update existing toggles.
		const toggles = [];
		for (const button of buttons) {
			const title = button.tooltip || '';
			const isChecked = !!button.checked;

			// TODO: Toggle class only supports ThemeIcon at the moment, but not other formats of IconPath.
			// We should consider adding support for the full IconPath to Toggle, in this code should be updated.
			const icon = ThemeIcon.isThemeIcon(button.iconPathDto) ? button.iconPathDto : undefined;

			let { toggle } = handlesToToggles.get(button.handle) || {};
			if (toggle) {
				// Toggle already exists, update its props.
				toggle.setTitle(title);
				toggle.setIcon(icon);
				toggle.checked = isChecked;
			} else {
				// Create a new toggle from the button.
				toggle = store.add(new Toggle({
					title,
					icon,
					isChecked,
					inputActiveOptionBorder: asCssVariable(inputActiveOptionBorder),
					inputActiveOptionForeground: asCssVariable(inputActiveOptionForeground),
					inputActiveOptionBackground: asCssVariable(inputActiveOptionBackground)
				}));

				const listener = store.add(toggle.onChange(() => {
					this._proxy.$onDidTriggerButton(sessionId, button.handle, toggle!.checked);
				}));

				handlesToToggles.set(button.handle, { toggle, listener });
			}
			toggles.push(toggle);
		}

		// Remove toggles that are no longer present from the session map.
		for (const [handle, { toggle, listener }] of handlesToToggles) {
			if (!buttons.some(button => button.handle === handle)) {
				handlesToToggles.delete(handle);
				store.delete(toggle);
				store.delete(listener);
			}
		}

		// Update toggle interfaces on the input widget.
		input.toggles = toggles;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadRemoteConnectionData.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadRemoteConnectionData.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostExtensionServiceShape } from '../common/extHost.protocol.js';
import { IRemoteAuthorityResolverService } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';

@extHostCustomer
export class MainThreadRemoteConnectionData extends Disposable {

	private readonly _proxy: ExtHostExtensionServiceShape;

	constructor(
		extHostContext: IExtHostContext,
		@IWorkbenchEnvironmentService protected readonly _environmentService: IWorkbenchEnvironmentService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostExtensionService);

		const remoteAuthority = this._environmentService.remoteAuthority;
		if (remoteAuthority) {
			this._register(remoteAuthorityResolverService.onDidChangeConnectionData(() => {
				const connectionData = remoteAuthorityResolverService.getConnectionData(remoteAuthority);
				if (connectionData) {
					this._proxy.$updateRemoteConnectionData(connectionData);
				}
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadSaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadSaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { shouldSynchronizeModel } from '../../../editor/common/model.js';
import { localize } from '../../../nls.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { IProgressStep, IProgress } from '../../../platform/progress/common/progress.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ITextFileSaveParticipant, ITextFileService, ITextFileEditorModel, ITextFileSaveParticipantContext } from '../../services/textfile/common/textfiles.js';
import { ExtHostContext, ExtHostDocumentSaveParticipantShape } from '../common/extHost.protocol.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { raceCancellationError } from '../../../base/common/async.js';

class ExtHostSaveParticipant implements ITextFileSaveParticipant {

	private readonly _proxy: ExtHostDocumentSaveParticipantShape;

	constructor(extHostContext: IExtHostContext) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocumentSaveParticipant);
	}

	async participate(editorModel: ITextFileEditorModel, context: ITextFileSaveParticipantContext, _progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {

		if (!editorModel.textEditorModel || !shouldSynchronizeModel(editorModel.textEditorModel)) {
			// the model never made it to the extension
			// host meaning we cannot participate in its save
			return undefined;
		}

		const p = new Promise<void>((resolve, reject) => {

			setTimeout(
				() => reject(new Error(localize('timeout.onWillSave', "Aborted onWillSaveTextDocument-event after 1750ms"))),
				1750
			);
			this._proxy.$participateInSave(editorModel.resource, context.reason).then(values => {
				if (!values.every(success => success)) {
					return Promise.reject(new Error('listener failed'));
				}
				return undefined;
			}).then(resolve, reject);
		});

		return raceCancellationError(p, token);
	}
}

// The save participant can change a model before its saved to support various scenarios like trimming trailing whitespace
@extHostCustomer
export class SaveParticipant {

	private _saveParticipantDisposable: IDisposable;

	constructor(
		extHostContext: IExtHostContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@ITextFileService private readonly _textFileService: ITextFileService
	) {
		this._saveParticipantDisposable = this._textFileService.files.addSaveParticipant(instantiationService.createInstance(ExtHostSaveParticipant, extHostContext));
	}

	dispose(): void {
		this._saveParticipantDisposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadSCM.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadSCM.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier } from '../../../base/common/async.js';
import { isUriComponents, URI, UriComponents } from '../../../base/common/uri.js';
import { Event, Emitter } from '../../../base/common/event.js';
import { IObservable, observableValue, observableValueOpts, transaction } from '../../../base/common/observable.js';
import { IDisposable, DisposableStore, combinedDisposable, dispose, Disposable } from '../../../base/common/lifecycle.js';
import { ISCMService, ISCMRepository, ISCMProvider, ISCMResource, ISCMResourceGroup, ISCMResourceDecorations, IInputValidation, ISCMViewService, InputValidationType, ISCMActionButtonDescriptor } from '../../contrib/scm/common/scm.js';
import { ExtHostContext, MainThreadSCMShape, ExtHostSCMShape, SCMProviderFeatures, SCMRawResourceSplices, SCMGroupFeatures, MainContext, SCMHistoryItemDto, SCMHistoryItemRefsChangeEventDto, SCMHistoryItemRefDto } from '../common/extHost.protocol.js';
import { Command } from '../../../editor/common/languages.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { MarshalledId } from '../../../base/common/marshallingIds.js';
import { ThemeIcon } from '../../../base/common/themables.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IQuickDiffService } from '../../contrib/scm/common/quickDiff.js';
import { ISCMHistoryItem, ISCMHistoryItemChange, ISCMHistoryItemRef, ISCMHistoryItemRefsChangeEvent, ISCMHistoryOptions, ISCMHistoryProvider } from '../../contrib/scm/common/history.js';
import { ResourceTree } from '../../../base/common/resourceTree.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkspaceContextService } from '../../../platform/workspace/common/workspace.js';
import { basename } from '../../../base/common/resources.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ITextModelContentProvider, ITextModelService } from '../../../editor/common/services/resolverService.js';
import { Schemas } from '../../../base/common/network.js';
import { ITextModel } from '../../../editor/common/model.js';
import { structuralEquals } from '../../../base/common/equals.js';
import { historyItemBaseRefColor, historyItemRefColor, historyItemRemoteRefColor } from '../../contrib/scm/browser/scmHistory.js';
import { ColorIdentifier } from '../../../platform/theme/common/colorUtils.js';
import { ISCMArtifact, ISCMArtifactGroup, ISCMArtifactProvider } from '../../contrib/scm/common/artifact.js';

function getIconFromIconDto(iconDto?: UriComponents | { light: UriComponents; dark: UriComponents } | ThemeIcon): URI | { light: URI; dark: URI } | ThemeIcon | undefined {
	if (iconDto === undefined) {
		return undefined;
	} else if (ThemeIcon.isThemeIcon(iconDto)) {
		return iconDto;
	} else if (isUriComponents(iconDto)) {
		return URI.revive(iconDto);
	} else {
		const icon = iconDto as { light: UriComponents; dark: UriComponents };
		return { light: URI.revive(icon.light), dark: URI.revive(icon.dark) };
	}
}

function toISCMHistoryItem(historyItemDto: SCMHistoryItemDto): ISCMHistoryItem {
	const authorIcon = getIconFromIconDto(historyItemDto.authorIcon);

	const references = historyItemDto.references?.map(r => ({
		...r, icon: getIconFromIconDto(r.icon)
	}));

	return { ...historyItemDto, authorIcon, references };
}

function toISCMHistoryItemRef(historyItemRefDto?: SCMHistoryItemRefDto, color?: ColorIdentifier): ISCMHistoryItemRef | undefined {
	return historyItemRefDto ? { ...historyItemRefDto, icon: getIconFromIconDto(historyItemRefDto.icon), color: color } : undefined;
}

class SCMInputBoxContentProvider extends Disposable implements ITextModelContentProvider {
	constructor(
		textModelService: ITextModelService,
		private readonly modelService: IModelService,
		private readonly languageService: ILanguageService,
	) {
		super();
		this._register(textModelService.registerTextModelContentProvider(Schemas.vscodeSourceControl, this));
	}

	async provideTextContent(resource: URI): Promise<ITextModel | null> {
		const existing = this.modelService.getModel(resource);
		if (existing) {
			return existing;
		}
		return this.modelService.createModel('', this.languageService.createById('scminput'), resource);
	}
}

class MainThreadSCMResourceGroup implements ISCMResourceGroup {

	readonly resources: ISCMResource[] = [];

	private _resourceTree: ResourceTree<ISCMResource, ISCMResourceGroup> | undefined;
	get resourceTree(): ResourceTree<ISCMResource, ISCMResourceGroup> {
		if (!this._resourceTree) {
			const rootUri = this.provider.rootUri ?? URI.file('/');
			this._resourceTree = new ResourceTree<ISCMResource, ISCMResourceGroup>(this, rootUri, this._uriIdentService.extUri);
			for (const resource of this.resources) {
				this._resourceTree.add(resource.sourceUri, resource);
			}
		}

		return this._resourceTree;
	}

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	private readonly _onDidChangeResources = new Emitter<void>();
	readonly onDidChangeResources = this._onDidChangeResources.event;

	get hideWhenEmpty(): boolean { return !!this.features.hideWhenEmpty; }

	get contextValue(): string | undefined { return this.features.contextValue; }

	constructor(
		private readonly sourceControlHandle: number,
		private readonly handle: number,
		public provider: ISCMProvider,
		public features: SCMGroupFeatures,
		public label: string,
		public id: string,
		public readonly multiDiffEditorEnableViewChanges: boolean,
		private readonly _uriIdentService: IUriIdentityService
	) { }

	toJSON() {
		return {
			$mid: MarshalledId.ScmResourceGroup,
			sourceControlHandle: this.sourceControlHandle,
			groupHandle: this.handle
		};
	}

	splice(start: number, deleteCount: number, toInsert: ISCMResource[]) {
		this.resources.splice(start, deleteCount, ...toInsert);
		this._resourceTree = undefined;

		this._onDidChangeResources.fire();
	}

	$updateGroup(features: SCMGroupFeatures): void {
		this.features = { ...this.features, ...features };
		this._onDidChange.fire();
	}

	$updateGroupLabel(label: string): void {
		this.label = label;
		this._onDidChange.fire();
	}
}

class MainThreadSCMResource implements ISCMResource {

	constructor(
		private readonly proxy: ExtHostSCMShape,
		private readonly sourceControlHandle: number,
		private readonly groupHandle: number,
		private readonly handle: number,
		readonly sourceUri: URI,
		readonly resourceGroup: ISCMResourceGroup,
		readonly decorations: ISCMResourceDecorations,
		readonly contextValue: string | undefined,
		readonly command: Command | undefined,
		readonly multiDiffEditorOriginalUri: URI | undefined,
		readonly multiDiffEditorModifiedUri: URI | undefined,
	) { }

	open(preserveFocus: boolean): Promise<void> {
		return this.proxy.$executeResourceCommand(this.sourceControlHandle, this.groupHandle, this.handle, preserveFocus);
	}

	toJSON() {
		return {
			$mid: MarshalledId.ScmResource,
			sourceControlHandle: this.sourceControlHandle,
			groupHandle: this.groupHandle,
			handle: this.handle
		};
	}
}

class MainThreadSCMArtifactProvider implements ISCMArtifactProvider {
	private readonly _onDidChangeArtifacts = new Emitter<string[]>();
	readonly onDidChangeArtifacts = this._onDidChangeArtifacts.event;

	private readonly _disposables = new DisposableStore();

	constructor(private readonly proxy: ExtHostSCMShape, private readonly handle: number) {
		this._disposables.add(this._onDidChangeArtifacts);
	}

	async provideArtifactGroups(token?: CancellationToken): Promise<ISCMArtifactGroup[] | undefined> {
		const artifactGroups = await this.proxy.$provideArtifactGroups(this.handle, token ?? CancellationToken.None);
		return artifactGroups?.map(group => ({ ...group, icon: getIconFromIconDto(group.icon) }));
	}

	async provideArtifacts(group: string, token?: CancellationToken): Promise<ISCMArtifact[] | undefined> {
		const artifacts = await this.proxy.$provideArtifacts(this.handle, group, token ?? CancellationToken.None);
		return artifacts?.map(artifact => ({ ...artifact, icon: getIconFromIconDto(artifact.icon) }));
	}

	$onDidChangeArtifacts(groups: string[]): void {
		this._onDidChangeArtifacts.fire(groups);
	}

	dispose(): void {
		this._disposables.dispose();
	}
}

class MainThreadSCMHistoryProvider implements ISCMHistoryProvider {
	private readonly _historyItemRef = observableValueOpts<ISCMHistoryItemRef | undefined>({
		owner: this,
		equalsFn: structuralEquals
	}, undefined);
	get historyItemRef(): IObservable<ISCMHistoryItemRef | undefined> { return this._historyItemRef; }

	private readonly _historyItemRemoteRef = observableValueOpts<ISCMHistoryItemRef | undefined>({
		owner: this,
		equalsFn: structuralEquals
	}, undefined);
	get historyItemRemoteRef(): IObservable<ISCMHistoryItemRef | undefined> { return this._historyItemRemoteRef; }

	private readonly _historyItemBaseRef = observableValueOpts<ISCMHistoryItemRef | undefined>({
		owner: this,
		equalsFn: structuralEquals
	}, undefined);
	get historyItemBaseRef(): IObservable<ISCMHistoryItemRef | undefined> { return this._historyItemBaseRef; }

	private readonly _historyItemRefChanges = observableValue<ISCMHistoryItemRefsChangeEvent>(this, { added: [], modified: [], removed: [], silent: false });
	get historyItemRefChanges(): IObservable<ISCMHistoryItemRefsChangeEvent> { return this._historyItemRefChanges; }

	constructor(private readonly proxy: ExtHostSCMShape, private readonly handle: number) { }

	async resolveHistoryItem(historyItemId: string, token?: CancellationToken): Promise<ISCMHistoryItem | undefined> {
		const historyItem = await this.proxy.$resolveHistoryItem(this.handle, historyItemId, token ?? CancellationToken.None);
		return historyItem ? toISCMHistoryItem(historyItem) : undefined;
	}

	async resolveHistoryItemChatContext(historyItemId: string, token?: CancellationToken): Promise<string | undefined> {
		return this.proxy.$resolveHistoryItemChatContext(this.handle, historyItemId, token ?? CancellationToken.None);
	}

	async resolveHistoryItemChangeRangeChatContext(historyItemId: string, historyItemParentId: string, path: string, token?: CancellationToken): Promise<string | undefined> {
		return this.proxy.$resolveHistoryItemChangeRangeChatContext(this.handle, historyItemId, historyItemParentId, path, token ?? CancellationToken.None);
	}

	async resolveHistoryItemRefsCommonAncestor(historyItemRefs: string[], token: CancellationToken): Promise<string | undefined> {
		return this.proxy.$resolveHistoryItemRefsCommonAncestor(this.handle, historyItemRefs, token ?? CancellationToken.None);
	}

	async provideHistoryItemRefs(historyItemsRefs?: string[], token?: CancellationToken): Promise<ISCMHistoryItemRef[] | undefined> {
		const historyItemRefs = await this.proxy.$provideHistoryItemRefs(this.handle, historyItemsRefs, token ?? CancellationToken.None);
		return historyItemRefs?.map(ref => ({ ...ref, icon: getIconFromIconDto(ref.icon) }));
	}

	async provideHistoryItems(options: ISCMHistoryOptions, token?: CancellationToken): Promise<ISCMHistoryItem[] | undefined> {
		const historyItems = await this.proxy.$provideHistoryItems(this.handle, options, token ?? CancellationToken.None);
		return historyItems?.map(historyItem => toISCMHistoryItem(historyItem));
	}

	async provideHistoryItemChanges(historyItemId: string, historyItemParentId: string | undefined, token?: CancellationToken): Promise<ISCMHistoryItemChange[] | undefined> {
		const changes = await this.proxy.$provideHistoryItemChanges(this.handle, historyItemId, historyItemParentId, token ?? CancellationToken.None);
		return changes?.map(change => ({
			uri: URI.revive(change.uri),
			originalUri: change.originalUri && URI.revive(change.originalUri),
			modifiedUri: change.modifiedUri && URI.revive(change.modifiedUri)
		}));
	}

	$onDidChangeCurrentHistoryItemRefs(historyItemRef?: SCMHistoryItemRefDto, historyItemRemoteRef?: SCMHistoryItemRefDto, historyItemBaseRef?: SCMHistoryItemRefDto): void {
		transaction(tx => {
			this._historyItemRef.set(toISCMHistoryItemRef(historyItemRef, historyItemRefColor), tx);
			this._historyItemRemoteRef.set(toISCMHistoryItemRef(historyItemRemoteRef, historyItemRemoteRefColor), tx);
			this._historyItemBaseRef.set(toISCMHistoryItemRef(historyItemBaseRef, historyItemBaseRefColor), tx);
		});
	}

	$onDidChangeHistoryItemRefs(historyItemRefs: SCMHistoryItemRefsChangeEventDto): void {
		const added = historyItemRefs.added.map(ref => toISCMHistoryItemRef(ref)!);
		const modified = historyItemRefs.modified.map(ref => toISCMHistoryItemRef(ref)!);
		const removed = historyItemRefs.removed.map(ref => toISCMHistoryItemRef(ref)!);

		this._historyItemRefChanges.set({ added, modified, removed, silent: historyItemRefs.silent }, undefined);
	}
}

class MainThreadSCMProvider implements ISCMProvider {

	get id(): string { return `scm${this._handle}`; }
	get parentId(): string | undefined {
		return this._parentHandle !== undefined
			? `scm${this._parentHandle}`
			: undefined;
	}
	get providerId(): string { return this._providerId; }

	readonly groups: MainThreadSCMResourceGroup[] = [];
	private readonly _onDidChangeResourceGroups = new Emitter<void>();
	readonly onDidChangeResourceGroups = this._onDidChangeResourceGroups.event;

	private readonly _onDidChangeResources = new Emitter<void>();
	readonly onDidChangeResources = this._onDidChangeResources.event;

	private readonly _groupsByHandle: { [handle: number]: MainThreadSCMResourceGroup } = Object.create(null);

	// get groups(): ISequence<ISCMResourceGroup> {
	// 	return {
	// 		elements: this._groups,
	// 		onDidSplice: this._onDidSplice.event
	// 	};

	// 	// return this._groups
	// 	// 	.filter(g => g.resources.elements.length > 0 || !g.features.hideWhenEmpty);
	// }


	private features: SCMProviderFeatures = {};

	get handle(): number { return this._handle; }
	get label(): string { return this._label; }
	get rootUri(): URI | undefined { return this._rootUri; }
	get iconPath(): URI | { light: URI; dark: URI } | ThemeIcon | undefined { return this._iconPath; }
	get inputBoxTextModel(): ITextModel { return this._inputBoxTextModel; }

	private readonly _contextValue = observableValue<string | undefined>(this, undefined);
	get contextValue(): IObservable<string | undefined> { return this._contextValue; }

	get acceptInputCommand(): Command | undefined { return this.features.acceptInputCommand; }

	private readonly _count = observableValue<number | undefined>(this, undefined);
	get count() { return this._count; }

	private readonly _statusBarCommands = observableValue<readonly Command[] | undefined>(this, undefined);
	get statusBarCommands() { return this._statusBarCommands; }

	private readonly _name: string | undefined;
	get name(): string { return this._name ?? this._label; }

	private readonly _commitTemplate = observableValue<string>(this, '');
	get commitTemplate() { return this._commitTemplate; }

	private readonly _actionButton = observableValue<ISCMActionButtonDescriptor | undefined>(this, undefined);
	get actionButton(): IObservable<ISCMActionButtonDescriptor | undefined> { return this._actionButton; }

	private _quickDiff: IDisposable | undefined;
	private _stagedQuickDiff: IDisposable | undefined;

	private readonly _artifactProvider = observableValue<MainThreadSCMArtifactProvider | undefined>(this, undefined);
	get artifactProvider() { return this._artifactProvider; }

	private readonly _historyProvider = observableValue<MainThreadSCMHistoryProvider | undefined>(this, undefined);
	get historyProvider() { return this._historyProvider; }

	constructor(
		private readonly proxy: ExtHostSCMShape,
		private readonly _handle: number,
		private readonly _parentHandle: number | undefined,
		private readonly _providerId: string,
		private readonly _label: string,
		private readonly _rootUri: URI | undefined,
		private readonly _iconPath: URI | { light: URI; dark: URI } | ThemeIcon | undefined,
		private readonly _inputBoxTextModel: ITextModel,
		private readonly _quickDiffService: IQuickDiffService,
		private readonly _uriIdentService: IUriIdentityService,
		private readonly _workspaceContextService: IWorkspaceContextService
	) {
		if (_rootUri) {
			const folder = this._workspaceContextService.getWorkspaceFolder(_rootUri);
			if (folder?.uri.toString() === _rootUri.toString()) {
				this._name = folder.name;
			} else if (_rootUri.path !== '/') {
				this._name = basename(_rootUri);
			}
		}
	}

	$updateSourceControl(features: SCMProviderFeatures): void {
		this.features = { ...this.features, ...features };

		if (typeof features.commitTemplate !== 'undefined') {
			this._commitTemplate.set(features.commitTemplate, undefined);
		}

		if (typeof features.actionButton !== 'undefined') {
			this._actionButton.set(features.actionButton ?? undefined, undefined);
		}

		if (typeof features.contextValue !== 'undefined') {
			this._contextValue.set(features.contextValue, undefined);
		}

		if (typeof features.count !== 'undefined') {
			this._count.set(features.count, undefined);
		}

		if (typeof features.statusBarCommands !== 'undefined') {
			this._statusBarCommands.set(features.statusBarCommands, undefined);
		}

		if (features.hasQuickDiffProvider && !this._quickDiff) {
			this._quickDiff = this._quickDiffService.addQuickDiffProvider({
				id: `${this._providerId}.quickDiffProvider`,
				label: features.quickDiffLabel ?? this.label,
				rootUri: this.rootUri,
				kind: 'primary',
				getOriginalResource: async (uri: URI) => {
					if (!this.features.hasQuickDiffProvider) {
						return null;
					}

					const result = await this.proxy.$provideOriginalResource(this.handle, uri, CancellationToken.None);
					return result && URI.revive(result);
				}
			});
		} else if (features.hasQuickDiffProvider === false && this._quickDiff) {
			this._quickDiff.dispose();
			this._quickDiff = undefined;
		}

		if (features.hasSecondaryQuickDiffProvider && !this._stagedQuickDiff) {
			this._stagedQuickDiff = this._quickDiffService.addQuickDiffProvider({
				id: `${this._providerId}.secondaryQuickDiffProvider`,
				label: features.secondaryQuickDiffLabel ?? this.label,
				rootUri: this.rootUri,
				kind: 'secondary',
				getOriginalResource: async (uri: URI) => {
					if (!this.features.hasSecondaryQuickDiffProvider) {
						return null;
					}

					const result = await this.proxy.$provideSecondaryOriginalResource(this.handle, uri, CancellationToken.None);
					return result && URI.revive(result);
				}
			});
		} else if (features.hasSecondaryQuickDiffProvider === false && this._stagedQuickDiff) {
			this._stagedQuickDiff.dispose();
			this._stagedQuickDiff = undefined;
		}

		if (features.hasArtifactProvider && !this.artifactProvider.get()) {
			const artifactProvider = new MainThreadSCMArtifactProvider(this.proxy, this.handle);
			this._artifactProvider.set(artifactProvider, undefined);
		} else if (features.hasArtifactProvider === false && this.artifactProvider.get()) {
			this._artifactProvider.set(undefined, undefined);
		}

		if (features.hasHistoryProvider && !this.historyProvider.get()) {
			const historyProvider = new MainThreadSCMHistoryProvider(this.proxy, this.handle);
			this._historyProvider.set(historyProvider, undefined);
		} else if (features.hasHistoryProvider === false && this.historyProvider.get()) {
			this._historyProvider.set(undefined, undefined);
		}
	}

	$registerGroups(_groups: [number /*handle*/, string /*id*/, string /*label*/, SCMGroupFeatures, /* multiDiffEditorEnableViewChanges */ boolean][]): void {
		const groups = _groups.map(([handle, id, label, features, multiDiffEditorEnableViewChanges]) => {
			const group = new MainThreadSCMResourceGroup(
				this.handle,
				handle,
				this,
				features,
				label,
				id,
				multiDiffEditorEnableViewChanges,
				this._uriIdentService
			);

			this._groupsByHandle[handle] = group;
			return group;
		});

		this.groups.splice(this.groups.length, 0, ...groups);
		this._onDidChangeResourceGroups.fire();
	}

	$updateGroup(handle: number, features: SCMGroupFeatures): void {
		const group = this._groupsByHandle[handle];

		if (!group) {
			return;
		}

		group.$updateGroup(features);
	}

	$updateGroupLabel(handle: number, label: string): void {
		const group = this._groupsByHandle[handle];

		if (!group) {
			return;
		}

		group.$updateGroupLabel(label);
	}

	$spliceGroupResourceStates(splices: SCMRawResourceSplices[]): void {
		for (const [groupHandle, groupSlices] of splices) {
			const group = this._groupsByHandle[groupHandle];

			if (!group) {
				console.warn(`SCM group ${groupHandle} not found in provider ${this.label}`);
				continue;
			}

			// reverse the splices sequence in order to apply them correctly
			groupSlices.reverse();

			for (const [start, deleteCount, rawResources] of groupSlices) {
				const resources = rawResources.map(rawResource => {
					const [handle, sourceUri, icons, tooltip, strikeThrough, faded, contextValue, command, multiDiffEditorOriginalUri, multiDiffEditorModifiedUri] = rawResource;

					const [light, dark] = icons;
					const icon = ThemeIcon.isThemeIcon(light) ? light : URI.revive(light);
					const iconDark = (ThemeIcon.isThemeIcon(dark) ? dark : URI.revive(dark)) || icon;

					const decorations = {
						icon: icon,
						iconDark: iconDark,
						tooltip,
						strikeThrough,
						faded
					};

					return new MainThreadSCMResource(
						this.proxy,
						this.handle,
						groupHandle,
						handle,
						URI.revive(sourceUri),
						group,
						decorations,
						contextValue || undefined,
						command,
						URI.revive(multiDiffEditorOriginalUri),
						URI.revive(multiDiffEditorModifiedUri),
					);
				});

				group.splice(start, deleteCount, resources);
			}
		}

		this._onDidChangeResources.fire();
	}

	$unregisterGroup(handle: number): void {
		const group = this._groupsByHandle[handle];

		if (!group) {
			return;
		}

		delete this._groupsByHandle[handle];
		this.groups.splice(this.groups.indexOf(group), 1);
		this._onDidChangeResourceGroups.fire();
	}

	async getOriginalResource(uri: URI): Promise<URI | null> {
		if (!this.features.hasQuickDiffProvider) {
			return null;
		}

		const result = await this.proxy.$provideOriginalResource(this.handle, uri, CancellationToken.None);
		return result && URI.revive(result);
	}

	$onDidChangeHistoryProviderCurrentHistoryItemRefs(historyItemRef?: SCMHistoryItemRefDto, historyItemRemoteRef?: SCMHistoryItemRefDto, historyItemBaseRef?: SCMHistoryItemRefDto): void {
		const provider = this.historyProvider.get();
		if (!provider) {
			return;
		}

		provider.$onDidChangeCurrentHistoryItemRefs(historyItemRef, historyItemRemoteRef, historyItemBaseRef);
	}

	$onDidChangeHistoryProviderHistoryItemRefs(historyItemRefs: SCMHistoryItemRefsChangeEventDto): void {
		const provider = this.historyProvider.get();
		if (!provider) {
			return;
		}

		provider.$onDidChangeHistoryItemRefs(historyItemRefs);
	}

	$onDidChangeArtifacts(groups: string[]): void {
		const provider = this.artifactProvider.get();
		if (!provider) {
			return;
		}

		provider.$onDidChangeArtifacts(groups);
	}

	toJSON() {
		return {
			$mid: MarshalledId.ScmProvider,
			handle: this.handle
		};
	}

	dispose(): void {
		this._stagedQuickDiff?.dispose();
		this._quickDiff?.dispose();
	}
}

@extHostNamedCustomer(MainContext.MainThreadSCM)
export class MainThreadSCM implements MainThreadSCMShape {

	private readonly _proxy: ExtHostSCMShape;
	private _repositories = new Map<number, ISCMRepository>();
	private _repositoryBarriers = new Map<number, Barrier>();
	private _repositoryDisposables = new Map<number, IDisposable>();
	private readonly _disposables = new DisposableStore();

	constructor(
		extHostContext: IExtHostContext,
		@ISCMService private readonly scmService: ISCMService,
		@ISCMViewService private readonly scmViewService: ISCMViewService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostSCM);

		this._disposables.add(new SCMInputBoxContentProvider(this.textModelService, this.modelService, this.languageService));
	}

	dispose(): void {
		dispose(this._repositories.values());
		this._repositories.clear();

		dispose(this._repositoryDisposables.values());
		this._repositoryDisposables.clear();

		this._disposables.dispose();
	}

	async $registerSourceControl(handle: number, parentHandle: number | undefined, id: string, label: string, rootUri: UriComponents | undefined, iconPath: UriComponents | { light: UriComponents; dark: UriComponents } | ThemeIcon | undefined, inputBoxDocumentUri: UriComponents): Promise<void> {
		this._repositoryBarriers.set(handle, new Barrier());

		const inputBoxTextModelRef = await this.textModelService.createModelReference(URI.revive(inputBoxDocumentUri));
		const provider = new MainThreadSCMProvider(this._proxy, handle, parentHandle, id, label, rootUri ? URI.revive(rootUri) : undefined, getIconFromIconDto(iconPath), inputBoxTextModelRef.object.textEditorModel, this.quickDiffService, this._uriIdentService, this.workspaceContextService);
		const repository = this.scmService.registerSCMProvider(provider);
		this._repositories.set(handle, repository);

		const disposable = combinedDisposable(
			inputBoxTextModelRef,
			Event.filter(this.scmViewService.onDidFocusRepository, r => r === repository)(_ => this._proxy.$setSelectedSourceControl(handle)),
			repository.input.onDidChange(({ value }) => this._proxy.$onInputBoxValueChange(handle, value))
		);
		this._repositoryDisposables.set(handle, disposable);

		if (this.scmViewService.focusedRepository === repository) {
			setTimeout(() => this._proxy.$setSelectedSourceControl(handle), 0);
		}

		if (repository.input.value) {
			setTimeout(() => this._proxy.$onInputBoxValueChange(handle, repository.input.value), 0);
		}

		this._repositoryBarriers.get(handle)?.open();
	}

	async $updateSourceControl(handle: number, features: SCMProviderFeatures): Promise<void> {
		await this._repositoryBarriers.get(handle)?.wait();
		const repository = this._repositories.get(handle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$updateSourceControl(features);
	}

	async $unregisterSourceControl(handle: number): Promise<void> {
		await this._repositoryBarriers.get(handle)?.wait();
		const repository = this._repositories.get(handle);

		if (!repository) {
			return;
		}

		this._repositoryDisposables.get(handle)!.dispose();
		this._repositoryDisposables.delete(handle);

		repository.dispose();
		this._repositories.delete(handle);
	}

	async $registerGroups(sourceControlHandle: number, groups: [number /*handle*/, string /*id*/, string /*label*/, SCMGroupFeatures, /* multiDiffEditorEnableViewChanges */ boolean][], splices: SCMRawResourceSplices[]): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$registerGroups(groups);
		provider.$spliceGroupResourceStates(splices);
	}

	async $updateGroup(sourceControlHandle: number, groupHandle: number, features: SCMGroupFeatures): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$updateGroup(groupHandle, features);
	}

	async $updateGroupLabel(sourceControlHandle: number, groupHandle: number, label: string): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$updateGroupLabel(groupHandle, label);
	}

	async $spliceResourceStates(sourceControlHandle: number, splices: SCMRawResourceSplices[]): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$spliceGroupResourceStates(splices);
	}

	async $unregisterGroup(sourceControlHandle: number, handle: number): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$unregisterGroup(handle);
	}

	async $setInputBoxValue(sourceControlHandle: number, value: string): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		repository.input.setValue(value, false);
	}

	async $setInputBoxPlaceholder(sourceControlHandle: number, placeholder: string): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		repository.input.placeholder = placeholder;
	}

	async $setInputBoxEnablement(sourceControlHandle: number, enabled: boolean): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		repository.input.enabled = enabled;
	}

	async $setInputBoxVisibility(sourceControlHandle: number, visible: boolean): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		repository.input.visible = visible;
	}

	async $showValidationMessage(sourceControlHandle: number, message: string | IMarkdownString, type: InputValidationType): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);
		if (!repository) {
			return;
		}

		repository.input.showValidationMessage(message, type);
	}

	async $setValidationProviderIsEnabled(sourceControlHandle: number, enabled: boolean): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		if (enabled) {
			repository.input.validateInput = async (value, pos): Promise<IInputValidation | undefined> => {
				const result = await this._proxy.$validateInput(sourceControlHandle, value, pos);
				return result && { message: result[0], type: result[1] };
			};
		} else {
			repository.input.validateInput = async () => undefined;
		}
	}

	async $onDidChangeHistoryProviderCurrentHistoryItemRefs(sourceControlHandle: number, historyItemRef?: SCMHistoryItemRefDto, historyItemRemoteRef?: SCMHistoryItemRefDto, historyItemBaseRef?: SCMHistoryItemRefDto): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$onDidChangeHistoryProviderCurrentHistoryItemRefs(historyItemRef, historyItemRemoteRef, historyItemBaseRef);
	}

	async $onDidChangeHistoryProviderHistoryItemRefs(sourceControlHandle: number, historyItemRefs: SCMHistoryItemRefsChangeEventDto): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$onDidChangeHistoryProviderHistoryItemRefs(historyItemRefs);
	}

	async $onDidChangeArtifacts(sourceControlHandle: number, groups: string[]): Promise<void> {
		await this._repositoryBarriers.get(sourceControlHandle)?.wait();
		const repository = this._repositories.get(sourceControlHandle);

		if (!repository) {
			return;
		}

		const provider = repository.provider as MainThreadSCMProvider;
		provider.$onDidChangeArtifacts(groups);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadSearch.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { DisposableStore, dispose, IDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ITelemetryData, ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IFileMatch, IFileQuery, IRawFileMatch2, ISearchComplete, ISearchCompleteStats, ISearchProgressItem, ISearchQuery, ISearchResultProvider, ISearchService, ITextQuery, QueryType, SearchProviderType } from '../../services/search/common/search.js';
import { ExtHostContext, ExtHostSearchShape, MainContext, MainThreadSearchShape } from '../common/extHost.protocol.js';
import { revive } from '../../../base/common/marshalling.js';
import * as Constants from '../../contrib/search/common/constants.js';
import { IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { AISearchKeyword } from '../../services/search/common/searchExtTypes.js';

@extHostNamedCustomer(MainContext.MainThreadSearch)
export class MainThreadSearch implements MainThreadSearchShape {

	private readonly _proxy: ExtHostSearchShape;
	private readonly _searchProvider = new Map<number, RemoteSearchProvider>();

	constructor(
		extHostContext: IExtHostContext,
		@ISearchService private readonly _searchService: ISearchService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IConfigurationService _configurationService: IConfigurationService,
		@IContextKeyService protected contextKeyService: IContextKeyService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostSearch);
		this._proxy.$enableExtensionHostSearch();
	}

	dispose(): void {
		this._searchProvider.forEach(value => value.dispose());
		this._searchProvider.clear();
	}

	$registerTextSearchProvider(handle: number, scheme: string): void {
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.text, scheme, handle, this._proxy));
	}

	$registerAITextSearchProvider(handle: number, scheme: string): void {
		Constants.SearchContext.hasAIResultProvider.bindTo(this.contextKeyService).set(true);
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.aiText, scheme, handle, this._proxy));
	}

	$registerFileSearchProvider(handle: number, scheme: string): void {
		this._searchProvider.set(handle, new RemoteSearchProvider(this._searchService, SearchProviderType.file, scheme, handle, this._proxy));
	}

	$unregisterProvider(handle: number): void {
		dispose(this._searchProvider.get(handle));
		this._searchProvider.delete(handle);
	}

	$handleFileMatch(handle: number, session: number, data: UriComponents[]): void {
		const provider = this._searchProvider.get(handle);
		if (!provider) {
			throw new Error('Got result for unknown provider');
		}

		provider.handleFindMatch(session, data);
	}

	$handleTextMatch(handle: number, session: number, data: IRawFileMatch2[]): void {
		const provider = this._searchProvider.get(handle);
		if (!provider) {
			throw new Error('Got result for unknown provider');
		}

		provider.handleFindMatch(session, data);
	}

	$handleKeywordResult(handle: number, session: number, data: AISearchKeyword): void {
		const provider = this._searchProvider.get(handle);
		if (!provider) {
			throw new Error('Got result for unknown provider');
		}

		provider.handleKeywordResult(session, data);
	}

	$handleTelemetry(eventName: string, data: ITelemetryData | undefined): void {
		this._telemetryService.publicLog(eventName, data);
	}
}

class SearchOperation {

	private static _idPool = 0;

	constructor(
		readonly progress?: (match: IFileMatch | AISearchKeyword) => unknown,
		readonly id: number = ++SearchOperation._idPool,
		readonly matches = new Map<string, IFileMatch>(),
		readonly keywords: AISearchKeyword[] = []
	) {
		//
	}

	addMatch(match: IFileMatch): void {
		const existingMatch = this.matches.get(match.resource.toString());
		if (existingMatch) {
			// TODO@rob clean up text/file result types
			// If a file search returns the same file twice, we would enter this branch.
			// It's possible that could happen, #90813
			if (existingMatch.results && match.results) {
				existingMatch.results.push(...match.results);
			}
		} else {
			this.matches.set(match.resource.toString(), match);
		}

		this.progress?.(match);
	}

	addKeyword(result: AISearchKeyword): void {
		this.keywords.push(result);
		this.progress?.(result);
	}
}

class RemoteSearchProvider implements ISearchResultProvider, IDisposable {

	private readonly _registrations = new DisposableStore();
	private readonly _searches = new Map<number, SearchOperation>();
	private cachedAIName: string | undefined;

	constructor(
		searchService: ISearchService,
		type: SearchProviderType,
		private readonly _scheme: string,
		private readonly _handle: number,
		private readonly _proxy: ExtHostSearchShape
	) {
		this._registrations.add(searchService.registerSearchResultProvider(this._scheme, type, this));
	}

	async getAIName(): Promise<string | undefined> {
		if (this.cachedAIName === undefined) {
			this.cachedAIName = await this._proxy.$getAIName(this._handle);
		}
		return this.cachedAIName;
	}

	dispose(): void {
		this._registrations.dispose();
	}

	fileSearch(query: IFileQuery, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		return this.doSearch(query, undefined, token);
	}

	textSearch(query: ITextQuery, onProgress?: (p: ISearchProgressItem) => void, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		return this.doSearch(query, onProgress, token);
	}

	doSearch(query: ISearchQuery, onProgress?: (p: ISearchProgressItem) => void, token: CancellationToken = CancellationToken.None): Promise<ISearchComplete> {
		if (!query.folderQueries.length) {
			throw new Error('Empty folderQueries');
		}

		const search = new SearchOperation(onProgress);
		this._searches.set(search.id, search);

		const searchP = this._provideSearchResults(query, search.id, token);

		return Promise.resolve(searchP).then((result: ISearchCompleteStats) => {
			this._searches.delete(search.id);
			return { results: Array.from(search.matches.values()), aiKeywords: Array.from(search.keywords), stats: result.stats, limitHit: result.limitHit, messages: result.messages };
		}, err => {
			this._searches.delete(search.id);
			return Promise.reject(err);
		});
	}

	clearCache(cacheKey: string): Promise<void> {
		return Promise.resolve(this._proxy.$clearCache(cacheKey));
	}

	handleFindMatch(session: number, dataOrUri: Array<UriComponents | IRawFileMatch2>): void {
		const searchOp = this._searches.get(session);

		if (!searchOp) {
			// ignore...
			return;
		}

		dataOrUri.forEach(result => {
			if ((<IRawFileMatch2>result).results) {
				searchOp.addMatch(revive((<IRawFileMatch2>result)));
			} else {
				searchOp.addMatch({
					resource: URI.revive(<UriComponents>result)
				});
			}
		});
	}

	handleKeywordResult(session: number, data: AISearchKeyword): void {
		const searchOp = this._searches.get(session);

		if (!searchOp) {
			// ignore...
			return;
		}
		searchOp.addKeyword(data);
	}

	private _provideSearchResults(query: ISearchQuery, session: number, token: CancellationToken): Promise<ISearchCompleteStats> {
		switch (query.type) {
			case QueryType.File:
				return this._proxy.$provideFileSearchResults(this._handle, session, query, token);
			case QueryType.Text:
				return this._proxy.$provideTextSearchResults(this._handle, session, query, token);
			default:
				return this._proxy.$provideAITextSearchResults(this._handle, session, query, token);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadSecretState.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadSecretState.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostSecretStateShape, MainContext, MainThreadSecretStateShape } from '../common/extHost.protocol.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { SequencerByKey } from '../../../base/common/async.js';
import { ISecretStorageService } from '../../../platform/secrets/common/secrets.js';
import { IBrowserWorkbenchEnvironmentService } from '../../services/environment/browser/environmentService.js';

@extHostNamedCustomer(MainContext.MainThreadSecretState)
export class MainThreadSecretState extends Disposable implements MainThreadSecretStateShape {
	private readonly _proxy: ExtHostSecretStateShape;

	private readonly _sequencer = new SequencerByKey<string>();

	constructor(
		extHostContext: IExtHostContext,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@ILogService private readonly logService: ILogService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService
	) {
		super();

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostSecretState);

		this._register(this.secretStorageService.onDidChangeSecret((e: string) => {
			const parsedKey = this.parseKey(e);
			if (parsedKey) {
				this._proxy.$onDidChangePassword(parsedKey);
			}
		}));
	}

	$getPassword(extensionId: string, key: string): Promise<string | undefined> {
		this.logService.trace(`[mainThreadSecretState] Getting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doGetPassword(extensionId, key));
	}

	private async doGetPassword(extensionId: string, key: string): Promise<string | undefined> {
		const fullKey = this.getKey(extensionId, key);
		const password = await this.secretStorageService.get(fullKey);
		this.logService.trace(`[mainThreadSecretState] ${password ? 'P' : 'No p'}assword found for: `, extensionId, key);
		return password;
	}

	$setPassword(extensionId: string, key: string, value: string): Promise<void> {
		this.logService.trace(`[mainThreadSecretState] Setting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doSetPassword(extensionId, key, value));
	}

	private async doSetPassword(extensionId: string, key: string, value: string): Promise<void> {
		const fullKey = this.getKey(extensionId, key);
		await this.secretStorageService.set(fullKey, value);
		this.logService.trace('[mainThreadSecretState] Password set for: ', extensionId, key);
	}

	$deletePassword(extensionId: string, key: string): Promise<void> {
		this.logService.trace(`[mainThreadSecretState] Deleting password for ${extensionId} extension: `, key);
		return this._sequencer.queue(extensionId, () => this.doDeletePassword(extensionId, key));
	}

	private async doDeletePassword(extensionId: string, key: string): Promise<void> {
		const fullKey = this.getKey(extensionId, key);
		await this.secretStorageService.delete(fullKey);
		this.logService.trace('[mainThreadSecretState] Password deleted for: ', extensionId, key);
	}

	$getKeys(extensionId: string): Promise<string[]> {
		this.logService.trace(`[mainThreadSecretState] Getting keys for ${extensionId} extension: `);
		return this._sequencer.queue(extensionId, () => this.doGetKeys(extensionId));
	}

	private async doGetKeys(extensionId: string): Promise<string[]> {
		if (!this.secretStorageService.keys) {
			throw new Error('Secret storage service does not support keys() method');
		}
		const allKeys = await this.secretStorageService.keys();
		const keys = allKeys
			.map(key => this.parseKey(key))
			.filter((parsedKey): parsedKey is { extensionId: string; key: string } => parsedKey !== undefined && parsedKey.extensionId === extensionId)
			.map(({ key }) => key); // Return only my keys
		this.logService.trace(`[mainThreadSecretState] Got ${keys.length}key(s) for: `, extensionId);
		return keys;
	}

	private getKey(extensionId: string, key: string): string {
		return JSON.stringify({ extensionId, key });
	}

	private parseKey(key: string): { extensionId: string; key: string } | undefined {
		try {
			return JSON.parse(key);
		} catch {
			return undefined;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadShare.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadShare.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { IDisposable, dispose } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { ExtHostContext, ExtHostShareShape, IDocumentFilterDto, MainContext, MainThreadShareShape } from '../common/extHost.protocol.js';
import { IShareProvider, IShareService, IShareableItem } from '../../contrib/share/common/share.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadShare)
export class MainThreadShare implements MainThreadShareShape {

	private readonly proxy: ExtHostShareShape;
	private providers = new Map<number, IShareProvider>();
	private providerDisposables = new Map<number, IDisposable>();

	constructor(
		extHostContext: IExtHostContext,
		@IShareService private readonly shareService: IShareService
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostShare);
	}

	$registerShareProvider(handle: number, selector: IDocumentFilterDto[], id: string, label: string, priority: number): void {
		const provider: IShareProvider = {
			id,
			label,
			selector,
			priority,
			provideShare: async (item: IShareableItem) => {
				const result = await this.proxy.$provideShare(handle, item, CancellationToken.None);
				return typeof result === 'string' ? result : URI.revive(result);
			}
		};
		this.providers.set(handle, provider);
		const disposable = this.shareService.registerShareProvider(provider);
		this.providerDisposables.set(handle, disposable);
	}

	$unregisterShareProvider(handle: number): void {
		this.providers.delete(handle);
		this.providerDisposables.delete(handle);
	}

	dispose(): void {
		this.providers.clear();
		dispose(this.providerDisposables.values());
		this.providerDisposables.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadSpeech.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadSpeech.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceCancellation } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { ExtHostContext, ExtHostSpeechShape, MainContext, MainThreadSpeechShape } from '../common/extHost.protocol.js';
import { IKeywordRecognitionEvent, ISpeechProviderMetadata, ISpeechService, ISpeechToTextEvent, ITextToSpeechEvent, TextToSpeechStatus } from '../../contrib/speech/common/speechService.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

type SpeechToTextSession = {
	readonly onDidChange: Emitter<ISpeechToTextEvent>;
};

type TextToSpeechSession = {
	readonly onDidChange: Emitter<ITextToSpeechEvent>;
};

type KeywordRecognitionSession = {
	readonly onDidChange: Emitter<IKeywordRecognitionEvent>;
};

@extHostNamedCustomer(MainContext.MainThreadSpeech)
export class MainThreadSpeech implements MainThreadSpeechShape {

	private readonly proxy: ExtHostSpeechShape;

	private readonly providerRegistrations = new Map<number, IDisposable>();

	private readonly speechToTextSessions = new Map<number, SpeechToTextSession>();
	private readonly textToSpeechSessions = new Map<number, TextToSpeechSession>();
	private readonly keywordRecognitionSessions = new Map<number, KeywordRecognitionSession>();

	constructor(
		extHostContext: IExtHostContext,
		@ISpeechService private readonly speechService: ISpeechService,
		@ILogService private readonly logService: ILogService
	) {
		this.proxy = extHostContext.getProxy(ExtHostContext.ExtHostSpeech);
	}

	$registerProvider(handle: number, identifier: string, metadata: ISpeechProviderMetadata): void {
		this.logService.trace('[Speech] extension registered provider', metadata.extension.value);

		const registration = this.speechService.registerSpeechProvider(identifier, {
			metadata,
			createSpeechToTextSession: (token, options) => {
				if (token.isCancellationRequested) {
					return {
						onDidChange: Event.None
					};
				}

				const disposables = new DisposableStore();
				const session = Math.random();

				this.proxy.$createSpeechToTextSession(handle, session, options?.language);

				const onDidChange = disposables.add(new Emitter<ISpeechToTextEvent>());
				this.speechToTextSessions.set(session, { onDidChange });

				disposables.add(token.onCancellationRequested(() => {
					this.proxy.$cancelSpeechToTextSession(session);
					this.speechToTextSessions.delete(session);
					disposables.dispose();
				}));

				return {
					onDidChange: onDidChange.event
				};
			},
			createTextToSpeechSession: (token, options) => {
				if (token.isCancellationRequested) {
					return {
						onDidChange: Event.None,
						synthesize: async () => { }
					};
				}

				const disposables = new DisposableStore();
				const session = Math.random();

				this.proxy.$createTextToSpeechSession(handle, session, options?.language);

				const onDidChange = disposables.add(new Emitter<ITextToSpeechEvent>());
				this.textToSpeechSessions.set(session, { onDidChange });

				disposables.add(token.onCancellationRequested(() => {
					this.proxy.$cancelTextToSpeechSession(session);
					this.textToSpeechSessions.delete(session);
					disposables.dispose();
				}));

				return {
					onDidChange: onDidChange.event,
					synthesize: async text => {
						await this.proxy.$synthesizeSpeech(session, text);
						const disposable = new DisposableStore();
						try {
							await raceCancellation(Event.toPromise(Event.filter(onDidChange.event, e => e.status === TextToSpeechStatus.Stopped, disposable), disposable), token);
						} finally {
							disposable.dispose();
						}
					}
				};
			},
			createKeywordRecognitionSession: token => {
				if (token.isCancellationRequested) {
					return {
						onDidChange: Event.None
					};
				}

				const disposables = new DisposableStore();
				const session = Math.random();

				this.proxy.$createKeywordRecognitionSession(handle, session);

				const onDidChange = disposables.add(new Emitter<IKeywordRecognitionEvent>());
				this.keywordRecognitionSessions.set(session, { onDidChange });

				disposables.add(token.onCancellationRequested(() => {
					this.proxy.$cancelKeywordRecognitionSession(session);
					this.keywordRecognitionSessions.delete(session);
					disposables.dispose();
				}));

				return {
					onDidChange: onDidChange.event
				};
			}
		});
		this.providerRegistrations.set(handle, {
			dispose: () => {
				registration.dispose();
			}
		});
	}

	$unregisterProvider(handle: number): void {
		const registration = this.providerRegistrations.get(handle);
		if (registration) {
			registration.dispose();
			this.providerRegistrations.delete(handle);
		}
	}

	$emitSpeechToTextEvent(session: number, event: ISpeechToTextEvent): void {
		const providerSession = this.speechToTextSessions.get(session);
		providerSession?.onDidChange.fire(event);
	}

	$emitTextToSpeechEvent(session: number, event: ITextToSpeechEvent): void {
		const providerSession = this.textToSpeechSessions.get(session);
		providerSession?.onDidChange.fire(event);
	}

	$emitKeywordRecognitionEvent(session: number, event: IKeywordRecognitionEvent): void {
		const providerSession = this.keywordRecognitionSessions.get(session);
		providerSession?.onDidChange.fire(event);
	}

	dispose(): void {
		this.providerRegistrations.forEach(disposable => disposable.dispose());
		this.providerRegistrations.clear();

		this.speechToTextSessions.forEach(session => session.onDidChange.dispose());
		this.speechToTextSessions.clear();

		this.textToSpeechSessions.forEach(session => session.onDidChange.dispose());
		this.textToSpeechSessions.clear();

		this.keywordRecognitionSessions.forEach(session => session.onDidChange.dispose());
		this.keywordRecognitionSessions.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadStatusBar.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadStatusBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainThreadStatusBarShape, MainContext, ExtHostContext, StatusBarItemDto, ExtHostStatusBarShape } from '../common/extHost.protocol.js';
import { ThemeColor } from '../../../base/common/themables.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { DisposableMap, toDisposable, Disposable } from '../../../base/common/lifecycle.js';
import { Command } from '../../../editor/common/languages.js';
import { IAccessibilityInformation } from '../../../platform/accessibility/common/accessibility.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';
import { IExtensionStatusBarItemService, StatusBarUpdateKind } from './statusBarExtensionPoint.js';
import { IStatusbarEntry, StatusbarAlignment } from '../../services/statusbar/browser/statusbar.js';
import { IManagedHoverTooltipMarkdownString } from '../../../base/browser/ui/hover/hover.js';
import { CancellationToken } from '../../../base/common/cancellation.js';

@extHostNamedCustomer(MainContext.MainThreadStatusBar)
export class MainThreadStatusBar extends Disposable implements MainThreadStatusBarShape {

	private readonly _proxy: ExtHostStatusBarShape;
	private readonly _entryDisposables = this._register(new DisposableMap<string>());

	constructor(
		extHostContext: IExtHostContext,
		@IExtensionStatusBarItemService private readonly statusbarService: IExtensionStatusBarItemService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostStatusBar);

		// once, at startup read existing items and send them over
		const entries: StatusBarItemDto[] = [];
		for (const [entryId, item] of statusbarService.getEntries()) {
			entries.push(asDto(entryId, item));
		}

		this._proxy.$acceptStaticEntries(entries);

		this._register(statusbarService.onDidChange(e => {
			if (e.added) {
				this._proxy.$acceptStaticEntries([asDto(e.added[0], e.added[1])]);
			}
		}));

		function asDto(entryId: string, item: { entry: IStatusbarEntry; alignment: StatusbarAlignment; priority: number }): StatusBarItemDto {
			return {
				entryId,
				name: item.entry.name,
				text: item.entry.text,
				tooltip: item.entry.tooltip as string | undefined,
				command: typeof item.entry.command === 'string' ? item.entry.command : typeof item.entry.command === 'object' ? item.entry.command.id : undefined,
				priority: item.priority,
				alignLeft: item.alignment === StatusbarAlignment.LEFT,
				accessibilityInformation: item.entry.ariaLabel ? { label: item.entry.ariaLabel, role: item.entry.role } : undefined
			};
		}
	}

	$setEntry(entryId: string, id: string, extensionId: string | undefined, name: string, text: string, tooltip: IMarkdownString | string | undefined, hasTooltipProvider: boolean, command: Command | undefined, color: string | ThemeColor | undefined, backgroundColor: ThemeColor | undefined, alignLeft: boolean, priority: number | undefined, accessibilityInformation: IAccessibilityInformation | undefined): void {
		const tooltipOrTooltipProvider = hasTooltipProvider
			? {
				markdown: (cancellation: CancellationToken) => {
					return this._proxy.$provideTooltip(entryId, cancellation);
				},
				markdownNotSupportedFallback: undefined
			} satisfies IManagedHoverTooltipMarkdownString
			: tooltip;

		const kind = this.statusbarService.setOrUpdateEntry(entryId, id, extensionId, name, text, tooltipOrTooltipProvider, command, color, backgroundColor, alignLeft, priority, accessibilityInformation);
		if (kind === StatusBarUpdateKind.DidDefine) {
			const disposable = toDisposable(() => this.statusbarService.unsetEntry(entryId));
			this._entryDisposables.set(entryId, disposable);
		}
	}

	$disposeEntry(entryId: string) {
		this._entryDisposables.deleteAndDispose(entryId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadStorage.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadStorage.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope } from '../../../platform/storage/common/storage.js';
import { MainThreadStorageShape, MainContext, ExtHostStorageShape, ExtHostContext } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { isWeb } from '../../../base/common/platform.js';
import { IExtensionIdWithVersion, IExtensionStorageService } from '../../../platform/extensionManagement/common/extensionStorage.js';
import { migrateExtensionStorage } from '../../services/extensions/common/extensionStorageMigration.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';

@extHostNamedCustomer(MainContext.MainThreadStorage)
export class MainThreadStorage implements MainThreadStorageShape {

	private readonly _proxy: ExtHostStorageShape;
	private readonly _storageListener = new DisposableStore();
	private readonly _sharedStorageKeysToWatch: Map<string, boolean> = new Map<string, boolean>();

	constructor(
		extHostContext: IExtHostContext,
		@IExtensionStorageService private readonly _extensionStorageService: IExtensionStorageService,
		@IStorageService private readonly _storageService: IStorageService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostStorage);

		this._storageListener.add(this._storageService.onDidChangeValue(StorageScope.PROFILE, undefined, this._storageListener)(e => {
			if (this._sharedStorageKeysToWatch.has(e.key)) {
				const rawState = this._extensionStorageService.getExtensionStateRaw(e.key, true);
				if (typeof rawState === 'string') {
					this._proxy.$acceptValue(true, e.key, rawState);
				}
			}
		}));
	}

	dispose(): void {
		this._storageListener.dispose();
	}

	async $initializeExtensionStorage(shared: boolean, extensionId: string): Promise<string | undefined> {

		await this.checkAndMigrateExtensionStorage(extensionId, shared);

		if (shared) {
			this._sharedStorageKeysToWatch.set(extensionId, true);
		}
		return this._extensionStorageService.getExtensionStateRaw(extensionId, shared);
	}

	async $setValue(shared: boolean, key: string, value: object): Promise<void> {
		this._extensionStorageService.setExtensionState(key, value, shared);
	}

	$registerExtensionStorageKeysToSync(extension: IExtensionIdWithVersion, keys: string[]): void {
		this._extensionStorageService.setKeysForSync(extension, keys);
	}

	private async checkAndMigrateExtensionStorage(extensionId: string, shared: boolean): Promise<void> {
		try {
			let sourceExtensionId = this._extensionStorageService.getSourceExtensionToMigrate(extensionId);

			// TODO: @sandy081 - Remove it after 6 months
			// If current extension does not have any migration requested
			// Then check if the extension has to be migrated for using lower case in web
			// If so, migrate the extension state from lower case id to its normal id.
			if (!sourceExtensionId && isWeb && extensionId !== extensionId.toLowerCase()) {
				sourceExtensionId = extensionId.toLowerCase();
			}

			if (sourceExtensionId) {
				// TODO: @sandy081 - Remove it after 6 months
				// In Web, extension state was used to be stored in lower case extension id.
				// Hence check that if the lower cased source extension was not yet migrated in web
				// If not take the lower cased source extension id for migration
				if (isWeb && sourceExtensionId !== sourceExtensionId.toLowerCase() && this._extensionStorageService.getExtensionState(sourceExtensionId.toLowerCase(), shared) && !this._extensionStorageService.getExtensionState(sourceExtensionId, shared)) {
					sourceExtensionId = sourceExtensionId.toLowerCase();
				}
				await migrateExtensionStorage(sourceExtensionId, extensionId, shared, this._instantiationService);
			}
		} catch (error) {
			this._logService.error(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTask.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTask.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';

import { URI, UriComponents } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import * as Types from '../../../base/common/types.js';
import * as Platform from '../../../base/common/platform.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';

import { IWorkspace, IWorkspaceContextService, IWorkspaceFolder } from '../../../platform/workspace/common/workspace.js';

import {
	ContributedTask, ConfiguringTask, KeyedTaskIdentifier, ITaskExecution, Task, ITaskEvent,
	IPresentationOptions, CommandOptions, ICommandConfiguration, RuntimeType, CustomTask, TaskScope, TaskSource,
	TaskSourceKind, IExtensionTaskSource, IRunOptions, ITaskSet, TaskGroup, TaskDefinition, PresentationOptions, RunOptions
} from '../../contrib/tasks/common/tasks.js';


import { IResolveSet, IResolvedVariables } from '../../contrib/tasks/common/taskSystem.js';
import { ITaskService, ITaskFilter, ITaskProvider } from '../../contrib/tasks/common/taskService.js';

import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, MainThreadTaskShape, ExtHostTaskShape, MainContext } from '../common/extHost.protocol.js';
import {
	ITaskDefinitionDTO, ITaskExecutionDTO, IProcessExecutionOptionsDTO, ITaskPresentationOptionsDTO,
	IProcessExecutionDTO, IShellExecutionDTO, IShellExecutionOptionsDTO, ICustomExecutionDTO, ITaskDTO, ITaskSourceDTO, ITaskHandleDTO, ITaskFilterDTO, ITaskProcessStartedDTO, ITaskProcessEndedDTO, ITaskSystemInfoDTO,
	IRunOptionsDTO, ITaskGroupDTO,
	ITaskProblemMatcherStarted,
	ITaskProblemMatcherEnded,
	TaskEventKind
} from '../common/shared/tasks.js';
import { IConfigurationResolverService } from '../../services/configurationResolver/common/configurationResolver.js';
import { ConfigurationTarget } from '../../../platform/configuration/common/configuration.js';
import { ErrorNoTelemetry } from '../../../base/common/errors.js';
import { IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { ConfigurationResolverExpression } from '../../services/configurationResolver/common/configurationResolverExpression.js';

namespace TaskExecutionDTO {
	export function from(value: ITaskExecution): ITaskExecutionDTO {
		return {
			id: value.id,
			task: TaskDTO.from(value.task)
		};
	}
}

export interface ITaskProblemMatcherStartedDto {
	execution: ITaskExecutionDTO;
}

export namespace TaskProblemMatcherStartedDto {
	export function from(value: ITaskProblemMatcherStarted): ITaskProblemMatcherStartedDto {
		return {
			execution: {
				id: value.execution.id,
				task: TaskDTO.from(value.execution.task)
			},
		};
	}
}

export interface ITaskProblemMatcherEndedDto {
	execution: ITaskExecutionDTO;
	hasErrors: boolean;
}

export namespace TaskProblemMatcherEndedDto {
	export function from(value: ITaskProblemMatcherEnded): ITaskProblemMatcherEndedDto {
		return {
			execution: {
				id: value.execution.id,
				task: TaskDTO.from(value.execution.task)
			},
			hasErrors: value.hasErrors
		};
	}
}



namespace TaskProcessStartedDTO {
	export function from(value: ITaskExecution, processId: number): ITaskProcessStartedDTO {
		return {
			id: value.id,
			processId
		};
	}
}

namespace TaskProcessEndedDTO {
	export function from(value: ITaskExecution, exitCode: number | undefined): ITaskProcessEndedDTO {
		return {
			id: value.id,
			exitCode
		};
	}
}

namespace TaskDefinitionDTO {
	export function from(value: KeyedTaskIdentifier): ITaskDefinitionDTO {
		const result = Object.assign(Object.create(null), value);
		delete result._key;
		return result;
	}
	export function to(value: ITaskDefinitionDTO, executeOnly: boolean): KeyedTaskIdentifier | undefined {
		let result = TaskDefinition.createTaskIdentifier(value, console);
		if (result === undefined && executeOnly) {
			result = {
				_key: generateUuid(),
				type: '$executeOnly'
			};
		}
		return result;
	}
}

namespace TaskPresentationOptionsDTO {
	export function from(value: IPresentationOptions | undefined): ITaskPresentationOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return Object.assign(Object.create(null), value);
	}
	export function to(value: ITaskPresentationOptionsDTO | undefined): IPresentationOptions {
		if (value === undefined || value === null) {
			return PresentationOptions.defaults;
		}
		return Object.assign(Object.create(null), PresentationOptions.defaults, value);
	}
}

namespace RunOptionsDTO {
	export function from(value: IRunOptions): IRunOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return Object.assign(Object.create(null), value);
	}
	export function to(value: IRunOptionsDTO | undefined): IRunOptions {
		if (value === undefined || value === null) {
			return RunOptions.defaults;
		}
		return Object.assign(Object.create(null), RunOptions.defaults, value);
	}
}

namespace ProcessExecutionOptionsDTO {
	export function from(value: CommandOptions): IProcessExecutionOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		return {
			cwd: value.cwd,
			env: value.env
		};
	}
	export function to(value: IProcessExecutionOptionsDTO | undefined): CommandOptions {
		if (value === undefined || value === null) {
			return CommandOptions.defaults;
		}
		return {
			cwd: value.cwd || CommandOptions.defaults.cwd,
			env: value.env
		};
	}
}

namespace ProcessExecutionDTO {
	export function is(value: IShellExecutionDTO | IProcessExecutionDTO | ICustomExecutionDTO): value is IProcessExecutionDTO {
		const candidate = value as IProcessExecutionDTO;
		return candidate && !!candidate.process;
	}
	export function from(value: ICommandConfiguration): IProcessExecutionDTO {
		const process: string = Types.isString(value.name) ? value.name : value.name!.value;
		const args: string[] = value.args ? value.args.map(value => Types.isString(value) ? value : value.value) : [];
		const result: IProcessExecutionDTO = {
			process: process,
			args: args
		};
		if (value.options) {
			result.options = ProcessExecutionOptionsDTO.from(value.options);
		}
		return result;
	}
	export function to(value: IProcessExecutionDTO): ICommandConfiguration {
		const result: ICommandConfiguration = {
			runtime: RuntimeType.Process,
			name: value.process,
			args: value.args,
			presentation: undefined
		};
		result.options = ProcessExecutionOptionsDTO.to(value.options);
		return result;
	}
}

namespace ShellExecutionOptionsDTO {
	export function from(value: CommandOptions): IShellExecutionOptionsDTO | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		const result: IShellExecutionOptionsDTO = {
			cwd: value.cwd || CommandOptions.defaults.cwd,
			env: value.env
		};
		if (value.shell) {
			result.executable = value.shell.executable;
			result.shellArgs = value.shell.args;
			result.shellQuoting = value.shell.quoting;
		}
		return result;
	}
	export function to(value: IShellExecutionOptionsDTO): CommandOptions | undefined {
		if (value === undefined || value === null) {
			return undefined;
		}
		const result: CommandOptions = {
			cwd: value.cwd,
			env: value.env
		};
		if (value.executable) {
			result.shell = {
				executable: value.executable
			};
			if (value.shellArgs) {
				result.shell.args = value.shellArgs;
			}
			if (value.shellQuoting) {
				result.shell.quoting = value.shellQuoting;
			}
		}
		return result;
	}
}

namespace ShellExecutionDTO {
	export function is(value: IShellExecutionDTO | IProcessExecutionDTO | ICustomExecutionDTO): value is IShellExecutionDTO {
		const candidate = value as IShellExecutionDTO;
		return candidate && (!!candidate.commandLine || !!candidate.command);
	}
	export function from(value: ICommandConfiguration): IShellExecutionDTO {
		const result: IShellExecutionDTO = {};
		if (value.name && Types.isString(value.name) && (value.args === undefined || value.args === null || value.args.length === 0)) {
			result.commandLine = value.name;
		} else {
			result.command = value.name;
			result.args = value.args;
		}
		if (value.options) {
			result.options = ShellExecutionOptionsDTO.from(value.options);
		}
		return result;
	}
	export function to(value: IShellExecutionDTO): ICommandConfiguration {
		const result: ICommandConfiguration = {
			runtime: RuntimeType.Shell,
			name: value.commandLine ? value.commandLine : value.command,
			args: value.args,
			presentation: undefined
		};
		if (value.options) {
			result.options = ShellExecutionOptionsDTO.to(value.options);
		}
		return result;
	}
}

namespace CustomExecutionDTO {
	export function is(value: IShellExecutionDTO | IProcessExecutionDTO | ICustomExecutionDTO): value is ICustomExecutionDTO {
		const candidate = value as ICustomExecutionDTO;
		return candidate && candidate.customExecution === 'customExecution';
	}

	export function from(value: ICommandConfiguration): ICustomExecutionDTO {
		return {
			customExecution: 'customExecution'
		};
	}

	export function to(value: ICustomExecutionDTO): ICommandConfiguration {
		return {
			runtime: RuntimeType.CustomExecution,
			presentation: undefined
		};
	}
}

namespace TaskSourceDTO {
	export function from(value: TaskSource): ITaskSourceDTO {
		const result: ITaskSourceDTO = {
			label: value.label
		};
		if (value.kind === TaskSourceKind.Extension) {
			result.extensionId = value.extension;
			if (value.workspaceFolder) {
				result.scope = value.workspaceFolder.uri;
			} else {
				result.scope = value.scope;
			}
		} else if (value.kind === TaskSourceKind.Workspace) {
			result.extensionId = '$core';
			result.scope = value.config.workspaceFolder ? value.config.workspaceFolder.uri : TaskScope.Global;
		}
		return result;
	}
	export function to(value: ITaskSourceDTO, workspace: IWorkspaceContextService): IExtensionTaskSource {
		let scope: TaskScope;
		let workspaceFolder: IWorkspaceFolder | undefined;
		if ((value.scope === undefined) || ((typeof value.scope === 'number') && (value.scope !== TaskScope.Global))) {
			if (workspace.getWorkspace().folders.length === 0) {
				scope = TaskScope.Global;
				workspaceFolder = undefined;
			} else {
				scope = TaskScope.Folder;
				workspaceFolder = workspace.getWorkspace().folders[0];
			}
		} else if (typeof value.scope === 'number') {
			scope = value.scope;
		} else {
			scope = TaskScope.Folder;
			workspaceFolder = workspace.getWorkspaceFolder(URI.revive(value.scope)) ?? undefined;
		}
		const result: IExtensionTaskSource = {
			kind: TaskSourceKind.Extension,
			label: value.label,
			extension: value.extensionId,
			scope,
			workspaceFolder
		};
		return result;
	}
}

namespace TaskHandleDTO {
	export function is(value: unknown): value is ITaskHandleDTO {
		const candidate = value as ITaskHandleDTO | undefined;
		return !!candidate && Types.isString(candidate.id) && !!candidate.workspaceFolder;
	}
}

namespace TaskDTO {
	export function from(task: Task | ConfiguringTask): ITaskDTO | undefined {
		if (task === undefined || task === null || (!CustomTask.is(task) && !ContributedTask.is(task) && !ConfiguringTask.is(task))) {
			return undefined;
		}
		const result: ITaskDTO = {
			_id: task._id,
			name: task.configurationProperties.name,
			definition: TaskDefinitionDTO.from(task.getDefinition(true)),
			source: TaskSourceDTO.from(task._source),
			execution: undefined,
			presentationOptions: !ConfiguringTask.is(task) && task.command ? TaskPresentationOptionsDTO.from(task.command.presentation) : undefined,
			isBackground: task.configurationProperties.isBackground,
			problemMatchers: [],
			hasDefinedMatchers: ContributedTask.is(task) ? task.hasDefinedMatchers : false,
			runOptions: RunOptionsDTO.from(task.runOptions),
		};
		result.group = TaskGroupDTO.from(task.configurationProperties.group);

		if (task.configurationProperties.detail) {
			result.detail = task.configurationProperties.detail;
		}
		if (!ConfiguringTask.is(task) && task.command) {
			switch (task.command.runtime) {
				case RuntimeType.Process: result.execution = ProcessExecutionDTO.from(task.command); break;
				case RuntimeType.Shell: result.execution = ShellExecutionDTO.from(task.command); break;
				case RuntimeType.CustomExecution: result.execution = CustomExecutionDTO.from(task.command); break;
			}
		}
		if (task.configurationProperties.problemMatchers) {
			for (const matcher of task.configurationProperties.problemMatchers) {
				if (Types.isString(matcher)) {
					result.problemMatchers.push(matcher);
				}
			}
		}
		return result;
	}

	export function to(task: ITaskDTO | undefined, workspace: IWorkspaceContextService, executeOnly: boolean, icon?: { id?: string; color?: string }, hide?: boolean): ContributedTask | undefined {
		if (!task || (typeof task.name !== 'string')) {
			return undefined;
		}

		let command: ICommandConfiguration | undefined;
		if (task.execution) {
			if (ShellExecutionDTO.is(task.execution)) {
				command = ShellExecutionDTO.to(task.execution);
			} else if (ProcessExecutionDTO.is(task.execution)) {
				command = ProcessExecutionDTO.to(task.execution);
			} else if (CustomExecutionDTO.is(task.execution)) {
				command = CustomExecutionDTO.to(task.execution);
			}
		}

		if (!command) {
			return undefined;
		}
		command.presentation = TaskPresentationOptionsDTO.to(task.presentationOptions);
		const source = TaskSourceDTO.to(task.source, workspace);

		const label = nls.localize('task.label', '{0}: {1}', source.label, task.name);
		const definition = TaskDefinitionDTO.to(task.definition, executeOnly)!;
		const id = (CustomExecutionDTO.is(task.execution!) && task._id) ? task._id : `${task.source.extensionId}.${definition._key}`;
		const result: ContributedTask = new ContributedTask(
			id, // uuidMap.getUUID(identifier)
			source,
			label,
			definition.type,
			definition,
			command,
			task.hasDefinedMatchers,
			RunOptionsDTO.to(task.runOptions),
			{
				name: task.name,
				identifier: label,
				group: task.group,
				isBackground: !!task.isBackground,
				problemMatchers: task.problemMatchers.slice(),
				detail: task.detail,
				icon,
				hide
			}
		);
		return result;
	}
}

namespace TaskGroupDTO {
	export function from(value: string | TaskGroup | undefined): ITaskGroupDTO | undefined {
		if (value === undefined) {
			return undefined;
		}
		return {
			_id: (typeof value === 'string') ? value : value._id,
			isDefault: (typeof value === 'string') ? false : ((typeof value.isDefault === 'string') ? false : value.isDefault)
		};
	}
}

namespace TaskFilterDTO {
	export function from(value: ITaskFilter): ITaskFilterDTO {
		return value;
	}
	export function to(value: ITaskFilterDTO | undefined): ITaskFilter | undefined {
		return value;
	}
}

@extHostNamedCustomer(MainContext.MainThreadTask)
export class MainThreadTask extends Disposable implements MainThreadTaskShape {

	private readonly _extHostContext: IExtHostContext | undefined;
	private readonly _proxy: ExtHostTaskShape;
	private readonly _providers: Map<number, { disposable: IDisposable; provider: ITaskProvider }>;

	constructor(
		extHostContext: IExtHostContext,
		@ITaskService private readonly _taskService: ITaskService,
		@IWorkspaceContextService private readonly _workspaceContextServer: IWorkspaceContextService,
		@IConfigurationResolverService private readonly _configurationResolverService: IConfigurationResolverService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTask);
		this._providers = new Map();
		this._register(this._taskService.onDidStateChange(async (event: ITaskEvent) => {
			if (event.kind === TaskEventKind.Changed) {
				return;
			}

			const task = event.__task;
			if (event.kind === TaskEventKind.Start) {
				const execution = TaskExecutionDTO.from(task.getTaskExecution());
				let resolvedDefinition: ITaskDefinitionDTO = execution.task!.definition;
				if (execution.task?.execution && CustomExecutionDTO.is(execution.task.execution) && event.resolvedVariables) {
					const expr = ConfigurationResolverExpression.parse(execution.task.definition);
					for (const replacement of expr.unresolved()) {
						const value = event.resolvedVariables.get(replacement.inner);
						if (value !== undefined) {
							expr.resolve(replacement, value);
						}
					}

					resolvedDefinition = await this._configurationResolverService.resolveAsync(task.getWorkspaceFolder(), expr);
				}
				this._proxy.$onDidStartTask(execution, event.terminalId, resolvedDefinition);
			} else if (event.kind === TaskEventKind.ProcessStarted) {
				this._proxy.$onDidStartTaskProcess(TaskProcessStartedDTO.from(task.getTaskExecution(), event.processId));
			} else if (event.kind === TaskEventKind.ProcessEnded) {
				this._proxy.$onDidEndTaskProcess(TaskProcessEndedDTO.from(task.getTaskExecution(), event.exitCode));
			} else if (event.kind === TaskEventKind.End) {
				this._proxy.$OnDidEndTask(TaskExecutionDTO.from(task.getTaskExecution()));
			} else if (event.kind === TaskEventKind.ProblemMatcherStarted) {
				this._proxy.$onDidStartTaskProblemMatchers(TaskProblemMatcherStartedDto.from({ execution: task.getTaskExecution() }));
			} else if (event.kind === TaskEventKind.ProblemMatcherEnded) {
				this._proxy.$onDidEndTaskProblemMatchers(TaskProblemMatcherEndedDto.from({ execution: task.getTaskExecution(), hasErrors: false }));
			} else if (event.kind === TaskEventKind.ProblemMatcherFoundErrors) {
				this._proxy.$onDidEndTaskProblemMatchers(TaskProblemMatcherEndedDto.from({ execution: task.getTaskExecution(), hasErrors: true }));
			}

		}));
	}

	public override dispose(): void {
		for (const value of this._providers.values()) {
			value.disposable.dispose();
		}
		this._providers.clear();
		super.dispose();
	}

	$createTaskId(taskDTO: ITaskDTO): Promise<string> {
		return new Promise((resolve, reject) => {
			const task = TaskDTO.to(taskDTO, this._workspaceContextServer, true);
			if (task) {
				resolve(task._id);
			} else {
				reject(new Error('Task could not be created from DTO'));
			}
		});
	}

	public $registerTaskProvider(handle: number, type: string): Promise<void> {
		const provider: ITaskProvider = {
			provideTasks: (validTypes: IStringDictionary<boolean>) => {
				return Promise.resolve(this._proxy.$provideTasks(handle, validTypes)).then((value) => {
					const tasks: Task[] = [];
					for (const dto of value.tasks) {
						const task = TaskDTO.to(dto, this._workspaceContextServer, true);
						if (task) {
							tasks.push(task);
						} else {
							console.error(`Task System: can not convert task: ${JSON.stringify(dto.definition, undefined, 0)}. Task will be dropped`);
						}
					}
					const processedExtension: IExtensionDescription = {
						...value.extension,
						extensionLocation: URI.revive(value.extension.extensionLocation)
					};
					return {
						tasks,
						extension: processedExtension
					} satisfies ITaskSet;
				});
			},
			resolveTask: (task: ConfiguringTask) => {
				const dto = TaskDTO.from(task);

				if (dto) {
					dto.name = ((dto.name === undefined) ? '' : dto.name); // Using an empty name causes the name to default to the one given by the provider.
					return Promise.resolve(this._proxy.$resolveTask(handle, dto)).then(resolvedTask => {
						if (resolvedTask) {
							return TaskDTO.to(resolvedTask, this._workspaceContextServer, true, task.configurationProperties.icon, task.configurationProperties.hide);
						}

						return undefined;
					});
				}
				return Promise.resolve<ContributedTask | undefined>(undefined);
			}
		};
		const disposable = this._taskService.registerTaskProvider(provider, type);
		this._providers.set(handle, { disposable, provider });
		return Promise.resolve(undefined);
	}

	public $unregisterTaskProvider(handle: number): Promise<void> {
		const provider = this._providers.get(handle);
		if (provider) {
			provider.disposable.dispose();
			this._providers.delete(handle);
		}
		return Promise.resolve(undefined);
	}

	public $fetchTasks(filter?: ITaskFilterDTO): Promise<ITaskDTO[]> {
		return this._taskService.tasks(TaskFilterDTO.to(filter)).then((tasks) => {
			const result: ITaskDTO[] = [];
			for (const task of tasks) {
				const item = TaskDTO.from(task);
				if (item) {
					result.push(item);
				}
			}
			return result;
		});
	}

	private getWorkspace(value: UriComponents | string): string | IWorkspace | IWorkspaceFolder | null {
		let workspace;
		if (typeof value === 'string') {
			workspace = value;
		} else {
			const workspaceObject = this._workspaceContextServer.getWorkspace();
			const uri = URI.revive(value);
			if (workspaceObject.configuration?.toString() === uri.toString()) {
				workspace = workspaceObject;
			} else {
				workspace = this._workspaceContextServer.getWorkspaceFolder(uri);
			}
		}
		return workspace;
	}

	public async $getTaskExecution(value: ITaskHandleDTO | ITaskDTO): Promise<ITaskExecutionDTO> {
		if (TaskHandleDTO.is(value)) {
			const workspace = this.getWorkspace(value.workspaceFolder);
			if (workspace) {
				const task = await this._taskService.getTask(workspace, value.id, true);
				if (task) {
					return {
						id: task._id,
						task: TaskDTO.from(task)
					};
				}
				throw new Error('Task not found');
			} else {
				throw new Error('No workspace folder');
			}
		} else {
			const task = TaskDTO.to(value, this._workspaceContextServer, true)!;
			return {
				id: task._id,
				task: TaskDTO.from(task)
			};
		}
	}

	// Passing in a TaskHandleDTO will cause the task to get re-resolved, which is important for tasks are coming from the core,
	// such as those gotten from a fetchTasks, since they can have missing configuration properties.
	public $executeTask(value: ITaskHandleDTO | ITaskDTO): Promise<ITaskExecutionDTO> {
		return new Promise<ITaskExecutionDTO>((resolve, reject) => {
			if (TaskHandleDTO.is(value)) {
				const workspace = this.getWorkspace(value.workspaceFolder);
				if (workspace) {
					this._taskService.getTask(workspace, value.id, true).then((task: Task | undefined) => {
						if (!task) {
							reject(new Error('Task not found'));
						} else {
							const result: ITaskExecutionDTO = {
								id: value.id,
								task: TaskDTO.from(task)
							};
							this._taskService.run(task).then(summary => {
								// Ensure that the task execution gets cleaned up if the exit code is undefined
								// This can happen when the task has dependent tasks and one of them failed
								if ((summary?.exitCode === undefined) || (summary.exitCode !== 0)) {
									this._proxy.$OnDidEndTask(result);
								}
							}, reason => {
								// eat the error, it has already been surfaced to the user and we don't care about it here
							});
							resolve(result);
						}
					}, (_error) => {
						reject(new Error('Task not found'));
					});
				} else {
					reject(new Error('No workspace folder'));
				}
			} else {
				const task = TaskDTO.to(value, this._workspaceContextServer, true)!;
				this._taskService.run(task).then(undefined, reason => {
					// eat the error, it has already been surfaced to the user and we don't care about it here
				});
				const result: ITaskExecutionDTO = {
					id: task._id,
					task: TaskDTO.from(task)
				};
				resolve(result);
			}
		});
	}


	public $customExecutionComplete(id: string, result?: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._taskService.getActiveTasks().then((tasks) => {
				for (const task of tasks) {
					if (id === task._id) {
						this._taskService.extensionCallbackTaskComplete(task, result).then((value) => {
							resolve(undefined);
						}, (error) => {
							reject(error);
						});
						return;
					}
				}
				reject(new Error('Task to mark as complete not found'));
			});
		});
	}

	public $terminateTask(id: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._taskService.getActiveTasks().then((tasks) => {
				for (const task of tasks) {
					if (id === task._id) {
						this._taskService.terminate(task).then((value) => {
							resolve(undefined);
						}, (error) => {
							reject(undefined);
						});
						return;
					}
				}
				reject(new ErrorNoTelemetry('Task to terminate not found'));
			});
		});
	}

	public $registerTaskSystem(key: string, info: ITaskSystemInfoDTO): void {
		let platform: Platform.Platform;
		switch (info.platform) {
			case 'Web':
				platform = Platform.Platform.Web;
				break;
			case 'win32':
				platform = Platform.Platform.Windows;
				break;
			case 'darwin':
				platform = Platform.Platform.Mac;
				break;
			case 'linux':
				platform = Platform.Platform.Linux;
				break;
			default:
				platform = Platform.platform;
		}
		this._taskService.registerTaskSystem(key, {
			platform: platform,
			uriProvider: (path: string): URI => {
				return URI.from({ scheme: info.scheme, authority: info.authority, path });
			},
			context: this._extHostContext,
			resolveVariables: (workspaceFolder: IWorkspaceFolder, toResolve: IResolveSet, target: ConfigurationTarget): Promise<IResolvedVariables | undefined> => {
				const vars: string[] = [];
				toResolve.variables.forEach(item => vars.push(item));
				return Promise.resolve(this._proxy.$resolveVariables(workspaceFolder.uri, { process: toResolve.process, variables: vars })).then(values => {
					const partiallyResolvedVars = Array.from(Object.values(values.variables));
					return new Promise<IResolvedVariables | undefined>((resolve, reject) => {
						this._configurationResolverService.resolveWithInteraction(workspaceFolder, partiallyResolvedVars, 'tasks', undefined, target).then(resolvedVars => {
							if (!resolvedVars) {
								resolve(undefined);
							}

							const result: IResolvedVariables = {
								process: undefined,
								variables: new Map<string, string>()
							};
							for (let i = 0; i < partiallyResolvedVars.length; i++) {
								const variableName = vars[i].substring(2, vars[i].length - 1);
								if (resolvedVars && values.variables[vars[i]] === vars[i]) {
									const resolved = resolvedVars.get(variableName);
									if (typeof resolved === 'string') {
										result.variables.set(variableName, resolved);
									}
								} else {
									result.variables.set(variableName, partiallyResolvedVars[i]);
								}
							}
							if (Types.isString(values.process)) {
								result.process = values.process;
							}
							resolve(result);
						}, reason => {
							reject(reason);
						});
					});
				});
			},
			findExecutable: (command: string, cwd?: string, paths?: string[]): Promise<string | undefined> => {
				return this._proxy.$findExecutable(command, cwd, paths);
			}
		});
	}

	async $registerSupportedExecutions(custom?: boolean, shell?: boolean, process?: boolean): Promise<void> {
		return this._taskService.registerSupportedExecutions(custom, shell, process);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTelemetry.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { ClassifiedEvent, IGDPRProperty, OmitMetadata, StrictPropertyCheck } from '../../../platform/telemetry/common/gdprTypings.js';
import { ITelemetryService, TelemetryLevel, TELEMETRY_OLD_SETTING_ID, TELEMETRY_SETTING_ID, ITelemetryData } from '../../../platform/telemetry/common/telemetry.js';
import { supportsTelemetry } from '../../../platform/telemetry/common/telemetryUtils.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostTelemetryShape, MainContext, MainThreadTelemetryShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadTelemetry)
export class MainThreadTelemetry extends Disposable implements MainThreadTelemetryShape {
	private readonly _proxy: ExtHostTelemetryShape;

	private static readonly _name = 'pluginHostTelemetry';

	constructor(
		extHostContext: IExtHostContext,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IEnvironmentService private readonly _environmentService: IEnvironmentService,
		@IProductService private readonly _productService: IProductService,
	) {
		super();

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTelemetry);

		if (supportsTelemetry(this._productService, this._environmentService)) {
			this._register(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(TELEMETRY_SETTING_ID) || e.affectsConfiguration(TELEMETRY_OLD_SETTING_ID)) {
					this._proxy.$onDidChangeTelemetryLevel(this.telemetryLevel);
				}
			}));
		}
		this._proxy.$initializeTelemetryLevel(this.telemetryLevel, supportsTelemetry(this._productService, this._environmentService), this._productService.enabledTelemetryLevels);
	}

	private get telemetryLevel(): TelemetryLevel {
		if (!supportsTelemetry(this._productService, this._environmentService)) {
			return TelemetryLevel.NONE;
		}

		return this._telemetryService.telemetryLevel;
	}

	$publicLog(eventName: string, data: ITelemetryData = Object.create(null)): void {
		// __GDPR__COMMON__ "pluginHostTelemetry" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		data[MainThreadTelemetry._name] = true;
		this._telemetryService.publicLog(eventName, data);
	}

	$publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void {
		this.$publicLog(eventName, data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTerminalService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, Disposable, IDisposable, MutableDisposable, combinedDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { ExtHostContext, ExtHostTerminalServiceShape, MainThreadTerminalServiceShape, MainContext, TerminalLaunchConfig, ITerminalDimensionsDto, ExtHostTerminalIdentifier, TerminalQuickFix, ITerminalCommandDto } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { URI } from '../../../base/common/uri.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IProcessProperty, IProcessReadyWindowsPty, IShellLaunchConfig, IShellLaunchConfigDto, ITerminalOutputMatch, ITerminalOutputMatcher, ProcessPropertyType, TerminalExitReason, TerminalLocation, type IProcessPropertyMap } from '../../../platform/terminal/common/terminal.js';
import { TerminalDataBufferer } from '../../../platform/terminal/common/terminalDataBuffering.js';
import { ITerminalEditorService, ITerminalExternalLinkProvider, ITerminalGroupService, ITerminalInstance, ITerminalLink, ITerminalService } from '../../contrib/terminal/browser/terminal.js';
import { TerminalProcessExtHostProxy } from '../../contrib/terminal/browser/terminalProcessExtHostProxy.js';
import { IEnvironmentVariableService } from '../../contrib/terminal/common/environmentVariable.js';
import { deserializeEnvironmentDescriptionMap, deserializeEnvironmentVariableCollection, serializeEnvironmentVariableCollection } from '../../../platform/terminal/common/environmentVariableShared.js';
import { IStartExtensionTerminalRequest, ITerminalProcessExtHostProxy, ITerminalProfileResolverService, ITerminalProfileService } from '../../contrib/terminal/common/terminal.js';
import { IRemoteAgentService } from '../../services/remote/common/remoteAgentService.js';
import { OperatingSystem, OS } from '../../../base/common/platform.js';
import { TerminalEditorLocationOptions } from 'vscode';
import { Promises } from '../../../base/common/async.js';
import { ISerializableEnvironmentDescriptionMap, ISerializableEnvironmentVariableCollection } from '../../../platform/terminal/common/environmentVariable.js';
import { ITerminalLinkProviderService } from '../../contrib/terminalContrib/links/browser/links.js';
import { ITerminalQuickFixService, ITerminalQuickFix, TerminalQuickFixType } from '../../contrib/terminalContrib/quickFix/browser/quickFix.js';
import { TerminalCapability } from '../../../platform/terminal/common/capabilities/capabilities.js';
import { ITerminalCompletionService } from '../../contrib/terminalContrib/suggest/browser/terminalCompletionService.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { hasKey } from '../../../base/common/types.js';

@extHostNamedCustomer(MainContext.MainThreadTerminalService)
export class MainThreadTerminalService extends Disposable implements MainThreadTerminalServiceShape {

	private readonly _proxy: ExtHostTerminalServiceShape;

	/**
	 * Stores a map from a temporary terminal id (a UUID generated on the extension host side)
	 * to a numeric terminal id (an id generated on the renderer side)
	 * This comes in play only when dealing with terminals created on the extension host side
	 */
	private readonly _extHostTerminals = new Map<string, Promise<ITerminalInstance>>();
	private readonly _terminalProcessProxies = new Map<number, { proxy: ITerminalProcessExtHostProxy; store: DisposableStore }>();
	private readonly _profileProviders = new Map<string, IDisposable>();
	private readonly _completionProviders = new Map<string, IDisposable>();
	private readonly _quickFixProviders = new Map<string, IDisposable>();
	private readonly _dataEventTracker = this._register(new MutableDisposable<TerminalDataEventTracker>());
	private readonly _sendCommandEventListener = this._register(new MutableDisposable());

	/**
	 * A single shared terminal link provider for the exthost. When an ext registers a link
	 * provider, this is registered with the terminal on the renderer side and all links are
	 * provided through this, even from multiple ext link providers. Xterm should remove lower
	 * priority intersecting links itself.
	 */
	private readonly _linkProvider = this._register(new MutableDisposable());

	private _os: OperatingSystem = OS;

	constructor(
		_extHostContext: IExtHostContext,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@ITerminalLinkProviderService private readonly _terminalLinkProviderService: ITerminalLinkProviderService,
		@ITerminalQuickFixService private readonly _terminalQuickFixService: ITerminalQuickFixService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IEnvironmentVariableService private readonly _environmentVariableService: IEnvironmentVariableService,
		@ILogService private readonly _logService: ILogService,
		@ITerminalProfileResolverService private readonly _terminalProfileResolverService: ITerminalProfileResolverService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ITerminalGroupService private readonly _terminalGroupService: ITerminalGroupService,
		@ITerminalEditorService private readonly _terminalEditorService: ITerminalEditorService,
		@ITerminalProfileService private readonly _terminalProfileService: ITerminalProfileService,
		@ITerminalCompletionService private readonly _terminalCompletionService: ITerminalCompletionService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
	) {
		super();
		this._proxy = _extHostContext.getProxy(ExtHostContext.ExtHostTerminalService);

		// ITerminalService listeners
		this._register(_terminalService.onDidCreateInstance((instance) => {
			this._onTerminalOpened(instance);
			this._onInstanceDimensionsChanged(instance);
		}));

		this._register(_terminalService.onDidDisposeInstance(instance => this._onTerminalDisposed(instance)));
		this._register(_terminalService.onAnyInstanceProcessIdReady(instance => this._onTerminalProcessIdReady(instance)));
		this._register(_terminalService.onDidChangeInstanceDimensions(instance => this._onInstanceDimensionsChanged(instance)));
		this._register(_terminalService.onAnyInstanceMaximumDimensionsChange(instance => this._onInstanceMaximumDimensionsChanged(instance)));
		this._register(_terminalService.onDidRequestStartExtensionTerminal(e => this._onRequestStartExtensionTerminal(e)));
		this._register(_terminalService.onDidChangeActiveInstance(instance => this._onActiveTerminalChanged(instance ? instance.instanceId : null)));
		this._register(_terminalService.onAnyInstanceTitleChange(instance => instance && this._onTitleChanged(instance.instanceId, instance.title)));
		this._register(_terminalService.onAnyInstanceDataInput(instance => this._proxy.$acceptTerminalInteraction(instance.instanceId)));
		this._register(_terminalService.onAnyInstanceSelectionChange(instance => this._proxy.$acceptTerminalSelection(instance.instanceId, instance.selection)));
		this._register(_terminalService.onAnyInstanceShellTypeChanged(instance => this._onShellTypeChanged(instance.instanceId)));

		// Set initial ext host state
		for (const instance of this._terminalService.instances) {
			this._onTerminalOpened(instance);
			instance.processReady.then(() => this._onTerminalProcessIdReady(instance));
			if (instance.shellType) {
				this._proxy.$acceptTerminalShellType(instance.instanceId, instance.shellType);
			}
		}
		const activeInstance = this._terminalService.activeInstance;
		if (activeInstance) {
			this._proxy.$acceptActiveTerminalChanged(activeInstance.instanceId);
		}
		if (this._environmentVariableService.collections.size > 0) {
			const collectionAsArray = [...this._environmentVariableService.collections.entries()];
			const serializedCollections: [string, ISerializableEnvironmentVariableCollection][] = collectionAsArray.map(e => {
				return [e[0], serializeEnvironmentVariableCollection(e[1].map)];
			});
			this._proxy.$initEnvironmentVariableCollections(serializedCollections);
		}

		this._store.add(toDisposable(() => {
			for (const e of this._terminalProcessProxies.values()) {
				e.proxy.dispose();
				e.store.dispose();
			}
			this._terminalProcessProxies.clear();
		}));

		remoteAgentService.getEnvironment().then(async env => {
			this._os = env?.os || OS;
			this._updateDefaultProfile();
		});
		this._register(this._terminalProfileService.onDidChangeAvailableProfiles(() => this._updateDefaultProfile()));

		this._register(toDisposable(() => {
			for (const provider of this._profileProviders.values()) {
				provider.dispose();
			}
			for (const provider of this._quickFixProviders.values()) {
				provider.dispose();
			}
		}));
	}

	private async _updateDefaultProfile() {
		const remoteAuthority = this._environmentService.remoteAuthority;
		const defaultProfile = this._terminalProfileResolverService.getDefaultProfile({ remoteAuthority, os: this._os });
		const defaultAutomationProfile = this._terminalProfileResolverService.getDefaultProfile({ remoteAuthority, os: this._os, allowAutomationShell: true });
		this._proxy.$acceptDefaultProfile(...await Promise.all([defaultProfile, defaultAutomationProfile]));
	}

	private async _getTerminalInstance(id: ExtHostTerminalIdentifier): Promise<ITerminalInstance | undefined> {
		if (typeof id === 'string') {
			return this._extHostTerminals.get(id);
		}
		return this._terminalService.getInstanceFromId(id);
	}

	public async $createTerminal(extHostTerminalId: string, launchConfig: TerminalLaunchConfig): Promise<void> {
		const shellLaunchConfig: IShellLaunchConfig = {
			name: launchConfig.name,
			executable: launchConfig.shellPath,
			args: launchConfig.shellArgs,
			cwd: typeof launchConfig.cwd === 'string' ? launchConfig.cwd : URI.revive(launchConfig.cwd),
			icon: launchConfig.icon,
			color: launchConfig.color,
			initialText: launchConfig.initialText,
			waitOnExit: launchConfig.waitOnExit,
			ignoreConfigurationCwd: true,
			env: launchConfig.env,
			strictEnv: launchConfig.strictEnv,
			hideFromUser: launchConfig.hideFromUser,
			customPtyImplementation: launchConfig.isExtensionCustomPtyTerminal
				? (id, cols, rows) => new TerminalProcessExtHostProxy(id, cols, rows, this._terminalService)
				: undefined,
			extHostTerminalId,
			forceShellIntegration: launchConfig.forceShellIntegration,
			isFeatureTerminal: launchConfig.isFeatureTerminal,
			isExtensionOwnedTerminal: launchConfig.isExtensionOwnedTerminal,
			useShellEnvironment: launchConfig.useShellEnvironment,
			isTransient: launchConfig.isTransient,
			shellIntegrationNonce: launchConfig.shellIntegrationNonce
		};
		const terminal = Promises.withAsyncBody<ITerminalInstance>(async r => {
			const terminal = await this._terminalService.createTerminal({
				config: shellLaunchConfig,
				location: await this._deserializeParentTerminal(launchConfig.location)
			});
			r(terminal);
		});
		this._extHostTerminals.set(extHostTerminalId, terminal);
		const terminalInstance = await terminal;
		this._register(terminalInstance.onDisposed(() => {
			this._extHostTerminals.delete(extHostTerminalId);
		}));
	}

	private async _deserializeParentTerminal(location?: TerminalLocation | TerminalEditorLocationOptions | { parentTerminal: ExtHostTerminalIdentifier } | { splitActiveTerminal: boolean; location?: TerminalLocation }): Promise<TerminalLocation | TerminalEditorLocationOptions | { parentTerminal: ITerminalInstance } | { splitActiveTerminal: boolean } | undefined> {
		if (typeof location === 'object' && hasKey(location, { parentTerminal: true })) {
			const parentTerminal = await this._extHostTerminals.get(location.parentTerminal.toString());
			return parentTerminal ? { parentTerminal } : undefined;
		}
		return location;
	}

	public async $show(id: ExtHostTerminalIdentifier, preserveFocus: boolean): Promise<void> {
		const terminalInstance = await this._getTerminalInstance(id);
		if (terminalInstance) {
			this._terminalService.setActiveInstance(terminalInstance);
			if (terminalInstance.target === TerminalLocation.Editor) {
				await this._terminalEditorService.revealActiveEditor(preserveFocus);
			} else {
				await this._terminalGroupService.showPanel(!preserveFocus);
			}
		}
	}

	public async $hide(id: ExtHostTerminalIdentifier): Promise<void> {
		const instanceToHide = await this._getTerminalInstance(id);
		const activeInstance = this._terminalService.activeInstance;
		if (activeInstance && activeInstance.instanceId === instanceToHide?.instanceId && activeInstance.target !== TerminalLocation.Editor) {
			this._terminalGroupService.hidePanel();
		}
	}

	public async $dispose(id: ExtHostTerminalIdentifier): Promise<void> {
		(await this._getTerminalInstance(id))?.dispose(TerminalExitReason.Extension);
	}

	public async $sendText(id: ExtHostTerminalIdentifier, text: string, shouldExecute: boolean): Promise<void> {
		const instance = await this._getTerminalInstance(id);
		await instance?.sendText(text, shouldExecute);
	}

	public $sendProcessExit(terminalId: number, exitCode: number | undefined): void {
		this._terminalProcessProxies.get(terminalId)?.proxy.emitExit(exitCode);
	}

	public $startSendingDataEvents(): void {
		if (!this._dataEventTracker.value) {
			this._dataEventTracker.value = this._instantiationService.createInstance(TerminalDataEventTracker, (id, data) => {
				this._onTerminalData(id, data);
			});
			// Send initial events if they exist
			for (const instance of this._terminalService.instances) {
				for (const data of instance.initialDataEvents || []) {
					this._onTerminalData(instance.instanceId, data);
				}
			}
		}
	}

	public $stopSendingDataEvents(): void {
		this._dataEventTracker.clear();
	}

	public $startSendingCommandEvents(): void {
		if (this._sendCommandEventListener.value) {
			return;
		}

		const multiplexer = this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.CommandDetection, capability => capability.onCommandFinished);
		const sub = multiplexer.event(e => {
			this._onDidExecuteCommand(e.instance.instanceId, {
				commandLine: e.data.command,
				// TODO: Convert to URI if possible
				cwd: e.data.cwd,
				exitCode: e.data.exitCode,
				output: e.data.getOutput()
			});
		});
		this._sendCommandEventListener.value = combinedDisposable(multiplexer, sub);
	}

	public $stopSendingCommandEvents(): void {
		this._sendCommandEventListener.clear();
	}

	public $startLinkProvider(): void {
		this._linkProvider.value = this._terminalLinkProviderService.registerLinkProvider(new ExtensionTerminalLinkProvider(this._proxy));
	}

	public $stopLinkProvider(): void {
		this._linkProvider.clear();
	}

	public $registerProcessSupport(isSupported: boolean): void {
		this._terminalService.registerProcessSupport(isSupported);
	}

	public $registerCompletionProvider(id: string, extensionIdentifier: string, ...triggerCharacters: string[]): void {
		this._completionProviders.set(id, this._terminalCompletionService.registerTerminalCompletionProvider(extensionIdentifier, id, {
			id,
			provideCompletions: async (commandLine, cursorIndex, token) => {
				const completions = await this._proxy.$provideTerminalCompletions(id, { commandLine, cursorIndex }, token);
				if (!completions) {
					return undefined;
				}
				if (completions.resourceOptions) {
					const { cwd, globPattern, ...rest } = completions.resourceOptions;
					return {
						items: completions.items?.map(c => ({
							provider: `ext:${id}`,
							...c,
						})),
						resourceOptions: {
							...rest,
							cwd,
							globPattern
						}
					};
				}
				return completions.items?.map(c => ({
					provider: `ext:${id}`,
					...c,
				}));
			}
		}, ...triggerCharacters));
	}

	public $unregisterCompletionProvider(id: string): void {
		this._completionProviders.get(id)?.dispose();
		this._completionProviders.delete(id);
	}

	public $registerProfileProvider(id: string, extensionIdentifier: string): void {
		// Proxy profile provider requests through the extension host
		this._profileProviders.set(id, this._terminalProfileService.registerTerminalProfileProvider(extensionIdentifier, id, {
			createContributedTerminalProfile: async (options) => {
				return this._proxy.$createContributedProfileTerminal(id, options);
			}
		}));
	}

	public $unregisterProfileProvider(id: string): void {
		this._profileProviders.get(id)?.dispose();
		this._profileProviders.delete(id);
	}

	public async $registerQuickFixProvider(id: string, extensionId: string): Promise<void> {
		this._quickFixProviders.set(id, this._terminalQuickFixService.registerQuickFixProvider(id, {
			provideTerminalQuickFixes: async (terminalCommand, lines, options, token) => {
				if (token.isCancellationRequested) {
					return;
				}
				if (options.outputMatcher?.length && options.outputMatcher.length > 40) {
					options.outputMatcher.length = 40;
					this._logService.warn('Cannot exceed output matcher length of 40');
				}
				const commandLineMatch = terminalCommand.command.match(options.commandLineMatcher);
				if (!commandLineMatch || !lines) {
					return;
				}
				const outputMatcher = options.outputMatcher;
				let outputMatch;
				if (outputMatcher) {
					outputMatch = getOutputMatchForLines(lines, outputMatcher);
				}
				if (!outputMatch) {
					return;
				}
				const matchResult = { commandLineMatch, outputMatch, commandLine: terminalCommand.command };

				if (matchResult) {
					const result = await this._proxy.$provideTerminalQuickFixes(id, matchResult, token);
					if (result && Array.isArray(result)) {
						return result.map(r => parseQuickFix(id, extensionId, r));
					} else if (result) {
						return parseQuickFix(id, extensionId, result);
					}
				}
				return;
			}
		}));
	}

	public $unregisterQuickFixProvider(id: string): void {
		this._quickFixProviders.get(id)?.dispose();
		this._quickFixProviders.delete(id);
	}

	private _onActiveTerminalChanged(terminalId: number | null): void {
		this._proxy.$acceptActiveTerminalChanged(terminalId);
	}

	private _onTerminalData(terminalId: number, data: string): void {
		this._proxy.$acceptTerminalProcessData(terminalId, data);
	}

	private _onDidExecuteCommand(terminalId: number, command: ITerminalCommandDto): void {
		this._proxy.$acceptDidExecuteCommand(terminalId, command);
	}

	private _onTitleChanged(terminalId: number, name: string): void {
		this._proxy.$acceptTerminalTitleChange(terminalId, name);
	}

	private _onShellTypeChanged(terminalId: number): void {
		const terminalInstance = this._terminalService.getInstanceFromId(terminalId);
		if (terminalInstance) {
			this._proxy.$acceptTerminalShellType(terminalId, terminalInstance.shellType);
		}
	}

	private _onTerminalDisposed(terminalInstance: ITerminalInstance): void {
		this._proxy.$acceptTerminalClosed(terminalInstance.instanceId, terminalInstance.exitCode, terminalInstance.exitReason ?? TerminalExitReason.Unknown);
		const proxy = this._terminalProcessProxies.get(terminalInstance.instanceId);
		if (proxy) {
			proxy.proxy.dispose();
			proxy.store.dispose();
			this._terminalProcessProxies.delete(terminalInstance.instanceId);
		}
	}

	private _onTerminalOpened(terminalInstance: ITerminalInstance): void {
		const extHostTerminalId = terminalInstance.shellLaunchConfig.extHostTerminalId;
		const shellLaunchConfigDto: IShellLaunchConfigDto = {
			name: terminalInstance.shellLaunchConfig.name,
			executable: terminalInstance.shellLaunchConfig.executable,
			args: terminalInstance.shellLaunchConfig.args,
			cwd: terminalInstance.shellLaunchConfig.cwd,
			env: terminalInstance.shellLaunchConfig.env,
			hideFromUser: terminalInstance.shellLaunchConfig.hideFromUser,
			tabActions: terminalInstance.shellLaunchConfig.tabActions
		};
		this._proxy.$acceptTerminalOpened(terminalInstance.instanceId, extHostTerminalId, terminalInstance.title, shellLaunchConfigDto);
	}

	private _onTerminalProcessIdReady(terminalInstance: ITerminalInstance): void {
		if (terminalInstance.processId === undefined) {
			return;
		}
		this._proxy.$acceptTerminalProcessId(terminalInstance.instanceId, terminalInstance.processId);
	}

	private _onInstanceDimensionsChanged(instance: ITerminalInstance): void {
		this._proxy.$acceptTerminalDimensions(instance.instanceId, instance.cols, instance.rows);
	}

	private _onInstanceMaximumDimensionsChanged(instance: ITerminalInstance): void {
		this._proxy.$acceptTerminalMaximumDimensions(instance.instanceId, instance.maxCols, instance.maxRows);
	}

	private _onRequestStartExtensionTerminal(request: IStartExtensionTerminalRequest): void {
		const proxy = request.proxy;
		const store = new DisposableStore();
		this._terminalProcessProxies.set(proxy.instanceId, { proxy, store });

		// Note that onResize is not being listened to here as it needs to fire when max dimensions
		// change, excluding the dimension override
		const initialDimensions: ITerminalDimensionsDto | undefined = request.cols && request.rows ? {
			columns: request.cols,
			rows: request.rows
		} : undefined;

		this._proxy.$startExtensionTerminal(
			proxy.instanceId,
			initialDimensions
		).then(request.callback);

		store.add(proxy.onInput(data => this._proxy.$acceptProcessInput(proxy.instanceId, data)));
		store.add(proxy.onShutdown(immediate => this._proxy.$acceptProcessShutdown(proxy.instanceId, immediate)));
		store.add(proxy.onRequestCwd(() => this._proxy.$acceptProcessRequestCwd(proxy.instanceId)));
		store.add(proxy.onRequestInitialCwd(() => this._proxy.$acceptProcessRequestInitialCwd(proxy.instanceId)));
	}

	public $sendProcessData(terminalId: number, data: string): void {
		this._terminalProcessProxies.get(terminalId)?.proxy.emitData(data);
	}

	public $sendProcessReady(terminalId: number, pid: number, cwd: string, windowsPty: IProcessReadyWindowsPty | undefined): void {
		this._terminalProcessProxies.get(terminalId)?.proxy.emitReady(pid, cwd, windowsPty);
	}

	public $sendProcessProperty(terminalId: number, property: IProcessProperty): void {
		if (property.type === ProcessPropertyType.Title) {
			const instance = this._terminalService.getInstanceFromId(terminalId);
			instance?.rename(property.value as IProcessPropertyMap[ProcessPropertyType.Title]);
		}
		this._terminalProcessProxies.get(terminalId)?.proxy.emitProcessProperty(property);
	}

	$setEnvironmentVariableCollection(extensionIdentifier: string, persistent: boolean, collection: ISerializableEnvironmentVariableCollection | undefined, descriptionMap: ISerializableEnvironmentDescriptionMap): void {
		if (collection) {
			const translatedCollection = {
				persistent,
				map: deserializeEnvironmentVariableCollection(collection),
				descriptionMap: deserializeEnvironmentDescriptionMap(descriptionMap)
			};
			this._environmentVariableService.set(extensionIdentifier, translatedCollection);
		} else {
			this._environmentVariableService.delete(extensionIdentifier);
		}
	}
}

/**
 * Encapsulates temporary tracking of data events from terminal instances, once disposed all
 * listeners are removed.
 */
class TerminalDataEventTracker extends Disposable {
	private readonly _bufferer: TerminalDataBufferer;

	constructor(
		private readonly _callback: (id: number, data: string) => void,
		@ITerminalService private readonly _terminalService: ITerminalService
	) {
		super();

		this._register(this._bufferer = new TerminalDataBufferer(this._callback));

		for (const instance of this._terminalService.instances) {
			this._registerInstance(instance);
		}
		this._register(this._terminalService.onDidCreateInstance(instance => this._registerInstance(instance)));
		this._register(this._terminalService.onDidDisposeInstance(instance => this._bufferer.stopBuffering(instance.instanceId)));
	}

	private _registerInstance(instance: ITerminalInstance): void {
		// Buffer data events to reduce the amount of messages going to the extension host
		this._register(this._bufferer.startBuffering(instance.instanceId, instance.onData));
	}
}

class ExtensionTerminalLinkProvider implements ITerminalExternalLinkProvider {
	constructor(
		private readonly _proxy: ExtHostTerminalServiceShape
	) {
	}

	async provideLinks(instance: ITerminalInstance, line: string): Promise<ITerminalLink[] | undefined> {
		const proxy = this._proxy;
		const extHostLinks = await proxy.$provideLinks(instance.instanceId, line);
		return extHostLinks.map(dto => ({
			id: dto.id,
			startIndex: dto.startIndex,
			length: dto.length,
			label: dto.label,
			activate: () => proxy.$activateLink(instance.instanceId, dto.id)
		}));
	}
}

export function getOutputMatchForLines(lines: string[], outputMatcher: ITerminalOutputMatcher): ITerminalOutputMatch | undefined {
	const match: RegExpMatchArray | null | undefined = lines.join('\n').match(outputMatcher.lineMatcher);
	return match ? { regexMatch: match, outputLines: lines } : undefined;
}

function parseQuickFix(id: string, source: string, fix: TerminalQuickFix): ITerminalQuickFix {
	let type = TerminalQuickFixType.TerminalCommand;
	if (hasKey(fix, { uri: true })) {
		fix.uri = URI.revive(fix.uri);
		type = TerminalQuickFixType.Opener;
	} else if (hasKey(fix, { id: true })) {
		type = TerminalQuickFixType.VscodeCommand;
	}
	return { id, type, source, ...fix };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadTerminalShellIntegration.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadTerminalShellIntegration.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { Disposable, toDisposable, type IDisposable } from '../../../base/common/lifecycle.js';
import { TerminalCapability, type ITerminalCommand } from '../../../platform/terminal/common/capabilities/capabilities.js';
import { ExtHostContext, MainContext, type ExtHostTerminalShellIntegrationShape, type MainThreadTerminalShellIntegrationShape } from '../common/extHost.protocol.js';
import { ITerminalService, type ITerminalInstance } from '../../contrib/terminal/browser/terminal.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { extHostNamedCustomer, type IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { TerminalShellExecutionCommandLineConfidence } from '../common/extHostTypes.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';

@extHostNamedCustomer(MainContext.MainThreadTerminalShellIntegration)
export class MainThreadTerminalShellIntegration extends Disposable implements MainThreadTerminalShellIntegrationShape {
	private readonly _proxy: ExtHostTerminalShellIntegrationShape;

	constructor(
		extHostContext: IExtHostContext,
		@ITerminalService private readonly _terminalService: ITerminalService,
		@IWorkbenchEnvironmentService workbenchEnvironmentService: IWorkbenchEnvironmentService,
		@IExtensionService private readonly _extensionService: IExtensionService
	) {
		super();

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostTerminalShellIntegration);

		const instanceDataListeners: Map<number, IDisposable> = new Map();
		this._register(toDisposable(() => {
			for (const listener of instanceDataListeners.values()) {
				listener.dispose();
			}
		}));

		// onDidChangeTerminalShellIntegration initial state
		for (const terminal of this._terminalService.instances) {
			const cmdDetection = terminal.capabilities.get(TerminalCapability.CommandDetection);
			if (cmdDetection) {
				this._enableShellIntegration(terminal);
			}
		}

		// onDidChangeTerminalShellIntegration via command detection
		const onDidAddCommandDetection = this._store.add(this._terminalService.createOnInstanceEvent(instance => {
			return Event.map(
				instance.capabilities.onDidAddCommandDetectionCapability,
				() => instance
			);
		})).event;
		this._store.add(onDidAddCommandDetection(e => this._enableShellIntegration(e)));

		// onDidChangeTerminalShellIntegration via cwd
		const cwdChangeEvent = this._store.add(this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.CwdDetection, e => e.onDidChangeCwd));
		this._store.add(cwdChangeEvent.event(e => {
			this._proxy.$cwdChange(e.instance.instanceId, e.data);
		}));

		// onDidChangeTerminalShellIntegration via env
		const envChangeEvent = this._store.add(this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.ShellEnvDetection, e => e.onDidChangeEnv));
		this._store.add(envChangeEvent.event(e => {
			if (e.data.value && typeof e.data.value === 'object') {
				const envValue = e.data.value as { [key: string]: string | undefined };

				// Extract keys and values
				const keysArr = Object.keys(envValue);
				const valuesArr = Object.values(envValue);
				this._proxy.$shellEnvChange(e.instance.instanceId, keysArr, valuesArr as string[], e.data.isTrusted);
			}
		}));

		// onDidStartTerminalShellExecution
		const commandDetectionStartEvent = this._store.add(this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.CommandDetection, e => e.onCommandExecuted));
		let currentCommand: ITerminalCommand | undefined;
		this._store.add(commandDetectionStartEvent.event(e => {
			// Prevent duplicate events from being sent in case command detection double fires the
			// event
			if (e.data === currentCommand) {
				return;
			}
			// String paths are not exposed in the extension API
			currentCommand = e.data;
			const instanceId = e.instance.instanceId;
			this._proxy.$shellExecutionStart(instanceId, instanceSupportsExecuteCommandApi(e.instance), e.data.command, convertToExtHostCommandLineConfidence(e.data), e.data.isTrusted, e.data.cwd);

			// TerminalShellExecution.createDataStream
			// Debounce events to reduce the message count - when this listener is disposed the events will be flushed
			instanceDataListeners.get(instanceId)?.dispose();
			instanceDataListeners.set(instanceId, Event.accumulate(e.instance.onData, 50, true, this._store)(events => {
				this._proxy.$shellExecutionData(instanceId, events.join(''));
			}));
		}));

		// onDidEndTerminalShellExecution
		const commandDetectionEndEvent = this._store.add(this._terminalService.createOnInstanceCapabilityEvent(TerminalCapability.CommandDetection, e => e.onCommandFinished));
		this._store.add(commandDetectionEndEvent.event(e => {
			currentCommand = undefined;
			const instanceId = e.instance.instanceId;
			instanceDataListeners.get(instanceId)?.dispose();
			// Shell integration C (executed) and D (command finished) sequences should always be in
			// their own events, so send this immediately. This means that the D sequence will not
			// be included as it's currently being parsed when the command finished event fires.
			this._proxy.$shellExecutionEnd(instanceId, e.data.command, convertToExtHostCommandLineConfidence(e.data), e.data.isTrusted, e.data.exitCode);
		}));

		// Clean up after dispose
		this._store.add(this._terminalService.onDidDisposeInstance(e => this._proxy.$closeTerminal(e.instanceId)));
	}

	$executeCommand(terminalId: number, commandLine: string): void {
		this._terminalService.getInstanceFromId(terminalId)?.runCommand(commandLine, true);
	}

	private _enableShellIntegration(instance: ITerminalInstance): void {
		this._extensionService.activateByEvent('onTerminalShellIntegration:*');
		if (instance.shellType) {
			this._extensionService.activateByEvent(`onTerminalShellIntegration:${instance.shellType}`);
		}
		this._proxy.$shellIntegrationChange(instance.instanceId, instanceSupportsExecuteCommandApi(instance));
		const cwdDetection = instance.capabilities.get(TerminalCapability.CwdDetection);
		if (cwdDetection) {
			this._proxy.$cwdChange(instance.instanceId, cwdDetection.getCwd());
		}
	}
}

function convertToExtHostCommandLineConfidence(command: ITerminalCommand): TerminalShellExecutionCommandLineConfidence {
	switch (command.commandLineConfidence) {
		case 'high':
			return TerminalShellExecutionCommandLineConfidence.High;
		case 'medium':
			return TerminalShellExecutionCommandLineConfidence.Medium;
		case 'low':
		default:
			return TerminalShellExecutionCommandLineConfidence.Low;
	}
}

function instanceSupportsExecuteCommandApi(instance: ITerminalInstance): boolean {
	return instance.shellLaunchConfig.type !== 'Task';
}
```

--------------------------------------------------------------------------------

````
