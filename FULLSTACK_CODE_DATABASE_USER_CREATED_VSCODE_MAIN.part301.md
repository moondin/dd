---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 301
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 301 of 552)

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

---[FILE: src/vs/workbench/api/browser/mainThreadCustomEditors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadCustomEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { multibyteAwareBtoa } from '../../../base/common/strings.js';
import { CancelablePromise, createCancelablePromise } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { isCancellationError, onUnexpectedError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IReference } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { basename } from '../../../base/common/path.js';
import { isEqual, isEqualOrParent, toLocalResource } from '../../../base/common/resources.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { localize } from '../../../nls.js';
import { IFileDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { FileOperation, IFileService } from '../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../../platform/label/common/label.js';
import { IStorageService } from '../../../platform/storage/common/storage.js';
import { IUndoRedoService, UndoRedoElementType } from '../../../platform/undoRedo/common/undoRedo.js';
import { MainThreadWebviewPanels } from './mainThreadWebviewPanels.js';
import { MainThreadWebviews, reviveWebviewExtension } from './mainThreadWebviews.js';
import * as extHostProtocol from '../common/extHost.protocol.js';
import { IRevertOptions, ISaveOptions } from '../../common/editor.js';
import { CustomEditorInput } from '../../contrib/customEditor/browser/customEditorInput.js';
import { CustomDocumentBackupData } from '../../contrib/customEditor/browser/customEditorInputFactory.js';
import { ICustomEditorModel, ICustomEditorService } from '../../contrib/customEditor/common/customEditor.js';
import { CustomTextEditorModel } from '../../contrib/customEditor/common/customTextEditorModel.js';
import { ExtensionKeyedWebviewOriginStore, WebviewExtensionDescription } from '../../contrib/webview/browser/webview.js';
import { WebviewInput } from '../../contrib/webviewPanel/browser/webviewEditorInput.js';
import { IWebviewWorkbenchService } from '../../contrib/webviewPanel/browser/webviewWorkbenchService.js';
import { editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { ResourceWorkingCopy } from '../../services/workingCopy/common/resourceWorkingCopy.js';
import { IWorkingCopy, IWorkingCopyBackup, IWorkingCopySaveEvent, NO_TYPE_ID, WorkingCopyCapabilities } from '../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyFileService, WorkingCopyFileEvent } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IWorkingCopyService } from '../../services/workingCopy/common/workingCopyService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';

const enum CustomEditorModelType {
	Custom,
	Text,
}

export class MainThreadCustomEditors extends Disposable implements extHostProtocol.MainThreadCustomEditorsShape {

	private readonly _proxyCustomEditors: extHostProtocol.ExtHostCustomEditorsShape;

	private readonly _editorProviders = this._register(new DisposableMap<string>());

	private readonly _editorRenameBackups = new Map<string, CustomDocumentBackupData>();

	private readonly _webviewOriginStore: ExtensionKeyedWebviewOriginStore;

	constructor(
		context: IExtHostContext,
		private readonly mainThreadWebview: MainThreadWebviews,
		private readonly mainThreadWebviewPanels: MainThreadWebviewPanels,
		@IExtensionService extensionService: IExtensionService,
		@IStorageService storageService: IStorageService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@ICustomEditorService private readonly _customEditorService: ICustomEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@IEditorService private readonly _editorService: IEditorService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWebviewWorkbenchService private readonly _webviewWorkbenchService: IWebviewWorkbenchService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
	) {
		super();

		this._webviewOriginStore = new ExtensionKeyedWebviewOriginStore('mainThreadCustomEditors.origins', storageService);

		this._proxyCustomEditors = context.getProxy(extHostProtocol.ExtHostContext.ExtHostCustomEditors);

		this._register(workingCopyFileService.registerWorkingCopyProvider((editorResource) => {
			const matchedWorkingCopies: IWorkingCopy[] = [];

			for (const workingCopy of workingCopyService.workingCopies) {
				if (workingCopy instanceof MainThreadCustomEditorModel) {
					if (isEqualOrParent(editorResource, workingCopy.editorResource)) {
						matchedWorkingCopies.push(workingCopy);
					}
				}
			}
			return matchedWorkingCopies;
		}));

		// This reviver's only job is to activate custom editor extensions.
		this._register(_webviewWorkbenchService.registerResolver({
			canResolve: (webview: WebviewInput) => {
				if (webview instanceof CustomEditorInput) {
					extensionService.activateByEvent(`onCustomEditor:${webview.viewType}`);
				}
				return false;
			},
			resolveWebview: () => { throw new Error('not implemented'); }
		}));

		// Working copy operations
		this._register(workingCopyFileService.onWillRunWorkingCopyFileOperation(async e => this.onWillRunWorkingCopyFileOperation(e)));
	}

	public $registerTextEditorProvider(extensionData: extHostProtocol.WebviewExtensionDescription, viewType: string, options: extHostProtocol.IWebviewPanelOptions, capabilities: extHostProtocol.CustomTextEditorCapabilities, serializeBuffersForPostMessage: boolean): void {
		this.registerEditorProvider(CustomEditorModelType.Text, reviveWebviewExtension(extensionData), viewType, options, capabilities, true, serializeBuffersForPostMessage);
	}

	public $registerCustomEditorProvider(extensionData: extHostProtocol.WebviewExtensionDescription, viewType: string, options: extHostProtocol.IWebviewPanelOptions, supportsMultipleEditorsPerDocument: boolean, serializeBuffersForPostMessage: boolean): void {
		this.registerEditorProvider(CustomEditorModelType.Custom, reviveWebviewExtension(extensionData), viewType, options, {}, supportsMultipleEditorsPerDocument, serializeBuffersForPostMessage);
	}

	private registerEditorProvider(
		modelType: CustomEditorModelType,
		extension: WebviewExtensionDescription,
		viewType: string,
		options: extHostProtocol.IWebviewPanelOptions,
		capabilities: extHostProtocol.CustomTextEditorCapabilities,
		supportsMultipleEditorsPerDocument: boolean,
		serializeBuffersForPostMessage: boolean,
	): void {
		if (this._editorProviders.has(viewType)) {
			throw new Error(`Provider for ${viewType} already registered`);
		}

		const disposables = new DisposableStore();

		disposables.add(this._customEditorService.registerCustomEditorCapabilities(viewType, {
			supportsMultipleEditorsPerDocument
		}));

		disposables.add(this._webviewWorkbenchService.registerResolver({
			canResolve: (webviewInput) => {
				return webviewInput instanceof CustomEditorInput && webviewInput.viewType === viewType;
			},
			resolveWebview: async (webviewInput: CustomEditorInput, cancellation: CancellationToken) => {
				const handle = generateUuid();
				const resource = webviewInput.resource;

				webviewInput.webview.origin = this._webviewOriginStore.getOrigin(viewType, extension.id);

				this.mainThreadWebviewPanels.addWebviewInput(handle, webviewInput, { serializeBuffersForPostMessage });
				webviewInput.webview.options = options;
				webviewInput.webview.extension = extension;

				// If there's an old resource this was a move and we must resolve the backup at the same time as the webview
				// This is because the backup must be ready upon model creation, and the input resolve method comes after
				let backupId = webviewInput.backupId;
				if (webviewInput.oldResource && !webviewInput.backupId) {
					const backup = this._editorRenameBackups.get(webviewInput.oldResource.toString());
					backupId = backup?.backupId;
					this._editorRenameBackups.delete(webviewInput.oldResource.toString());
				}

				let modelRef: IReference<ICustomEditorModel>;
				try {
					modelRef = await this.getOrCreateCustomEditorModel(modelType, resource, viewType, { backupId }, cancellation);
				} catch (error) {
					onUnexpectedError(error);
					webviewInput.webview.setHtml(this.mainThreadWebview.getWebviewResolvedFailedContent(viewType));
					return;
				}

				if (cancellation.isCancellationRequested) {
					modelRef.dispose();
					return;
				}

				const disposeSub = webviewInput.webview.onDidDispose(() => {
					disposeSub.dispose();

					// If the model is still dirty, make sure we have time to save it
					if (modelRef.object.isDirty()) {
						const sub = modelRef.object.onDidChangeDirty(() => {
							if (!modelRef.object.isDirty()) {
								sub.dispose();
								modelRef.dispose();
							}
						});
						return;
					}

					modelRef.dispose();
				});

				if (capabilities.supportsMove) {
					webviewInput.onMove(async (newResource: URI) => {
						const oldModel = modelRef;
						modelRef = await this.getOrCreateCustomEditorModel(modelType, newResource, viewType, {}, CancellationToken.None);
						this._proxyCustomEditors.$onMoveCustomEditor(handle, newResource, viewType);
						oldModel.dispose();
					});
				}

				try {
					const actualResource = modelType === CustomEditorModelType.Text ? this._uriIdentityService.asCanonicalUri(resource) : resource;
					await this._proxyCustomEditors.$resolveCustomEditor(actualResource, handle, viewType, {
						title: webviewInput.getTitle(),
						contentOptions: webviewInput.webview.contentOptions,
						options: webviewInput.webview.options,
						active: webviewInput === this._editorService.activeEditor,
					}, editorGroupToColumn(this._editorGroupService, webviewInput.group || 0), cancellation);
				} catch (error) {
					onUnexpectedError(error);
					webviewInput.webview.setHtml(this.mainThreadWebview.getWebviewResolvedFailedContent(viewType));
					modelRef.dispose();
					return;
				}
			}
		}));

		this._editorProviders.set(viewType, disposables);
	}

	public $unregisterEditorProvider(viewType: string): void {
		if (!this._editorProviders.has(viewType)) {
			throw new Error(`No provider for ${viewType} registered`);
		}

		this._editorProviders.deleteAndDispose(viewType);

		this._customEditorService.models.disposeAllModelsForView(viewType);
	}

	private async getOrCreateCustomEditorModel(
		modelType: CustomEditorModelType,
		resource: URI,
		viewType: string,
		options: { backupId?: string },
		cancellation: CancellationToken,
	): Promise<IReference<ICustomEditorModel>> {
		const existingModel = this._customEditorService.models.tryRetain(resource, viewType);
		if (existingModel) {
			return existingModel;
		}

		switch (modelType) {
			case CustomEditorModelType.Text:
				{
					const model = CustomTextEditorModel.create(this._instantiationService, viewType, resource);
					return this._customEditorService.models.add(resource, viewType, model);
				}
			case CustomEditorModelType.Custom:
				{
					const model = MainThreadCustomEditorModel.create(this._instantiationService, this._proxyCustomEditors, viewType, resource, options, () => {
						return Array.from(this.mainThreadWebviewPanels.webviewInputs)
							.filter(editor => editor instanceof CustomEditorInput && isEqual(editor.resource, resource)) as CustomEditorInput[];
					}, cancellation);
					return this._customEditorService.models.add(resource, viewType, model);
				}
		}
	}

	public async $onDidEdit(resourceComponents: UriComponents, viewType: string, editId: number, label: string | undefined): Promise<void> {
		const model = await this.getCustomEditorModel(resourceComponents, viewType);
		model.pushEdit(editId, label);
	}

	public async $onContentChange(resourceComponents: UriComponents, viewType: string): Promise<void> {
		const model = await this.getCustomEditorModel(resourceComponents, viewType);
		model.changeContent();
	}

	private async getCustomEditorModel(resourceComponents: UriComponents, viewType: string) {
		const resource = URI.revive(resourceComponents);
		const model = await this._customEditorService.models.get(resource, viewType);
		if (!model || !(model instanceof MainThreadCustomEditorModel)) {
			throw new Error('Could not find model for webview editor');
		}
		return model;
	}

	//#region Working Copy
	private async onWillRunWorkingCopyFileOperation(e: WorkingCopyFileEvent) {
		if (e.operation !== FileOperation.MOVE) {
			return;
		}
		e.waitUntil((async () => {
			const models = [];
			for (const file of e.files) {
				if (file.source) {
					models.push(...(await this._customEditorService.models.getAllModels(file.source)));
				}
			}
			for (const model of models) {
				if (model instanceof MainThreadCustomEditorModel && model.isDirty()) {
					const workingCopy = await model.backup(CancellationToken.None);
					if (workingCopy.meta) {
						// This cast is safe because we do an instanceof check above and a custom document backup data is always returned
						this._editorRenameBackups.set(model.editorResource.toString(), workingCopy.meta as CustomDocumentBackupData);
					}
				}
			}
		})());
	}
	//#endregion
}

namespace HotExitState {
	export const enum Type {
		Allowed,
		NotAllowed,
		Pending,
	}

	export const Allowed = Object.freeze({ type: Type.Allowed } as const);
	export const NotAllowed = Object.freeze({ type: Type.NotAllowed } as const);

	export class Pending {
		readonly type = Type.Pending;

		constructor(
			public readonly operation: CancelablePromise<string>,
		) { }
	}

	export type State = typeof Allowed | typeof NotAllowed | Pending;
}


class MainThreadCustomEditorModel extends ResourceWorkingCopy implements ICustomEditorModel {

	private _fromBackup: boolean = false;
	private _hotExitState: HotExitState.State = HotExitState.Allowed;
	private _backupId: string | undefined;

	private _currentEditIndex: number = -1;
	private _savePoint: number = -1;
	private readonly _edits: Array<number> = [];
	private _isDirtyFromContentChange = false;

	private _ongoingSave?: CancelablePromise<void>;

	// TODO@mjbvz consider to enable a `typeId` that is specific for custom
	// editors. Using a distinct `typeId` allows the working copy to have
	// any resource (including file based resources) even if other working
	// copies exist with the same resource.
	//
	// IMPORTANT: changing the `typeId` has an impact on backups for this
	// working copy. Any value that is not the empty string will be used
	// as seed to the backup. Only change the `typeId` if you have implemented
	// a fallback solution to resolve any existing backups that do not have
	// this seed.
	readonly typeId = NO_TYPE_ID;

	public static async create(
		instantiationService: IInstantiationService,
		proxy: extHostProtocol.ExtHostCustomEditorsShape,
		viewType: string,
		resource: URI,
		options: { backupId?: string },
		getEditors: () => CustomEditorInput[],
		cancellation: CancellationToken,
	): Promise<MainThreadCustomEditorModel> {
		const editors = getEditors();
		let untitledDocumentData: VSBuffer | undefined;
		if (editors.length !== 0) {
			untitledDocumentData = editors[0].untitledDocumentData;
		}
		const { editable } = await proxy.$createCustomDocument(resource, viewType, options.backupId, untitledDocumentData, cancellation);
		return instantiationService.createInstance(MainThreadCustomEditorModel, proxy, viewType, resource, !!options.backupId, editable, !!untitledDocumentData, getEditors);
	}

	constructor(
		private readonly _proxy: extHostProtocol.ExtHostCustomEditorsShape,
		private readonly _viewType: string,
		private readonly _editorResource: URI,
		fromBackup: boolean,
		private readonly _editable: boolean,
		startDirty: boolean,
		private readonly _getEditors: () => CustomEditorInput[],
		@IFileDialogService private readonly _fileDialogService: IFileDialogService,
		@IFileService fileService: IFileService,
		@ILabelService private readonly _labelService: ILabelService,
		@IUndoRedoService private readonly _undoService: IUndoRedoService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@IPathService private readonly _pathService: IPathService,
		@IExtensionService extensionService: IExtensionService,
	) {
		super(MainThreadCustomEditorModel.toWorkingCopyResource(_viewType, _editorResource), fileService);

		this._fromBackup = fromBackup;

		if (_editable) {
			this._register(workingCopyService.registerWorkingCopy(this));

			this._register(extensionService.onWillStop(e => {
				e.veto(true, localize('vetoExtHostRestart', "An extension provided editor for '{0}' is still open that would close otherwise.", this.name));
			}));
		}

		// Normally means we're re-opening an untitled file
		if (startDirty) {
			this._isDirtyFromContentChange = true;
		}
	}

	get editorResource() {
		return this._editorResource;
	}

	override dispose() {
		if (this._editable) {
			this._undoService.removeElements(this._editorResource);
		}

		this._proxy.$disposeCustomDocument(this._editorResource, this._viewType);

		super.dispose();
	}

	//#region IWorkingCopy

	// Make sure each custom editor has a unique resource for backup and edits
	private static toWorkingCopyResource(viewType: string, resource: URI) {
		const authority = viewType.replace(/[^a-z0-9\-_]/gi, '-');
		const path = `/${multibyteAwareBtoa(resource.with({ query: null, fragment: null }).toString(true))}`;
		return URI.from({
			scheme: Schemas.vscodeCustomEditor,
			authority: authority,
			path: path,
			query: JSON.stringify(resource.toJSON()),
		});
	}

	public get name() {
		return basename(this._labelService.getUriLabel(this._editorResource));
	}

	public get capabilities(): WorkingCopyCapabilities {
		return this.isUntitled() ? WorkingCopyCapabilities.Untitled : WorkingCopyCapabilities.None;
	}

	public isDirty(): boolean {
		if (this._isDirtyFromContentChange) {
			return true;
		}
		if (this._edits.length > 0) {
			return this._savePoint !== this._currentEditIndex;
		}
		return this._fromBackup;
	}

	private isUntitled() {
		return this._editorResource.scheme === Schemas.untitled;
	}

	private readonly _onDidChangeDirty: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeDirty: Event<void> = this._onDidChangeDirty.event;

	private readonly _onDidChangeContent: Emitter<void> = this._register(new Emitter<void>());
	readonly onDidChangeContent: Event<void> = this._onDidChangeContent.event;

	private readonly _onDidSave: Emitter<IWorkingCopySaveEvent> = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave: Event<IWorkingCopySaveEvent> = this._onDidSave.event;

	readonly onDidChangeReadonly = Event.None;

	//#endregion

	public isReadonly(): boolean {
		return !this._editable;
	}

	public get viewType() {
		return this._viewType;
	}

	public get backupId() {
		return this._backupId;
	}

	public pushEdit(editId: number, label: string | undefined) {
		if (!this._editable) {
			throw new Error('Document is not editable');
		}

		this.change(() => {
			this.spliceEdits(editId);
			this._currentEditIndex = this._edits.length - 1;
		});

		this._undoService.pushElement({
			type: UndoRedoElementType.Resource,
			resource: this._editorResource,
			label: label ?? localize('defaultEditLabel', "Edit"),
			code: 'undoredo.customEditorEdit',
			undo: () => this.undo(),
			redo: () => this.redo(),
		});
	}

	public changeContent() {
		this.change(() => {
			this._isDirtyFromContentChange = true;
		});
	}

	private async undo(): Promise<void> {
		if (!this._editable) {
			return;
		}

		if (this._currentEditIndex < 0) {
			// nothing to undo
			return;
		}

		const undoneEdit = this._edits[this._currentEditIndex];
		this.change(() => {
			--this._currentEditIndex;
		});
		await this._proxy.$undo(this._editorResource, this.viewType, undoneEdit, this.isDirty());
	}

	private async redo(): Promise<void> {
		if (!this._editable) {
			return;
		}

		if (this._currentEditIndex >= this._edits.length - 1) {
			// nothing to redo
			return;
		}

		const redoneEdit = this._edits[this._currentEditIndex + 1];
		this.change(() => {
			++this._currentEditIndex;
		});
		await this._proxy.$redo(this._editorResource, this.viewType, redoneEdit, this.isDirty());
	}

	private spliceEdits(editToInsert?: number) {
		const start = this._currentEditIndex + 1;
		const toRemove = this._edits.length - this._currentEditIndex;

		const removedEdits = typeof editToInsert === 'number'
			? this._edits.splice(start, toRemove, editToInsert)
			: this._edits.splice(start, toRemove);

		if (removedEdits.length) {
			this._proxy.$disposeEdits(this._editorResource, this._viewType, removedEdits);
		}
	}

	private change(makeEdit: () => void): void {
		const wasDirty = this.isDirty();
		makeEdit();
		this._onDidChangeContent.fire();

		if (this.isDirty() !== wasDirty) {
			this._onDidChangeDirty.fire();
		}
	}

	public async revert(options?: IRevertOptions) {
		if (!this._editable) {
			return;
		}

		if (this._currentEditIndex === this._savePoint && !this._isDirtyFromContentChange && !this._fromBackup) {
			return;
		}

		if (!options?.soft) {
			this._proxy.$revert(this._editorResource, this.viewType, CancellationToken.None);
		}

		this.change(() => {
			this._isDirtyFromContentChange = false;
			this._fromBackup = false;
			this._currentEditIndex = this._savePoint;
			this.spliceEdits();
		});
	}

	public async save(options?: ISaveOptions): Promise<boolean> {
		const result = !!await this.saveCustomEditor(options);

		// Emit Save Event
		if (result) {
			this._onDidSave.fire({ reason: options?.reason, source: options?.source });
		}

		return result;
	}

	public async saveCustomEditor(options?: ISaveOptions): Promise<URI | undefined> {
		if (!this._editable) {
			return undefined;
		}

		if (this.isUntitled()) {
			const targetUri = await this.suggestUntitledSavePath(options);
			if (!targetUri) {
				return undefined;
			}

			await this.saveCustomEditorAs(this._editorResource, targetUri, options);
			return targetUri;
		}

		const savePromise = createCancelablePromise(token => this._proxy.$onSave(this._editorResource, this.viewType, token));
		this._ongoingSave?.cancel();
		this._ongoingSave = savePromise;

		try {
			await savePromise;

			if (this._ongoingSave === savePromise) { // Make sure we are still doing the same save
				this.change(() => {
					this._isDirtyFromContentChange = false;
					this._savePoint = this._currentEditIndex;
					this._fromBackup = false;
				});
			}
		} finally {
			if (this._ongoingSave === savePromise) { // Make sure we are still doing the same save
				this._ongoingSave = undefined;
			}
		}

		return this._editorResource;
	}

	private suggestUntitledSavePath(options: ISaveOptions | undefined): Promise<URI | undefined> {
		if (!this.isUntitled()) {
			throw new Error('Resource is not untitled');
		}

		const remoteAuthority = this._environmentService.remoteAuthority;
		const localResource = toLocalResource(this._editorResource, remoteAuthority, this._pathService.defaultUriScheme);

		return this._fileDialogService.pickFileToSave(localResource, options?.availableFileSystems);
	}

	public async saveCustomEditorAs(resource: URI, targetResource: URI, _options?: ISaveOptions): Promise<boolean> {
		if (this._editable) {
			// TODO: handle cancellation
			await createCancelablePromise(token => this._proxy.$onSaveAs(this._editorResource, this.viewType, targetResource, token));
			this.change(() => {
				this._savePoint = this._currentEditIndex;
			});
			return true;
		} else {
			// Since the editor is readonly, just copy the file over
			await this.fileService.copy(resource, targetResource, false /* overwrite */);
			return true;
		}
	}

	public get canHotExit() { return typeof this._backupId === 'string' && this._hotExitState.type === HotExitState.Type.Allowed; }

	public async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
		const editors = this._getEditors();
		if (!editors.length) {
			throw new Error('No editors found for resource, cannot back up');
		}
		const primaryEditor = editors[0];

		const backupMeta: CustomDocumentBackupData = {
			viewType: this.viewType,
			editorResource: this._editorResource,
			customTitle: primaryEditor.getWebviewTitle(),
			iconPath: primaryEditor.iconPath,
			backupId: '',
			extension: primaryEditor.extension ? {
				id: primaryEditor.extension.id.value,
				location: primaryEditor.extension.location!,
			} : undefined,
			webview: {
				origin: primaryEditor.webview.origin,
				options: primaryEditor.webview.options,
				state: primaryEditor.webview.state,
			}
		};

		const backupData: IWorkingCopyBackup = {
			meta: backupMeta
		};

		if (!this._editable) {
			return backupData;
		}

		if (this._hotExitState.type === HotExitState.Type.Pending) {
			this._hotExitState.operation.cancel();
		}

		const pendingState = new HotExitState.Pending(
			createCancelablePromise(token =>
				this._proxy.$backup(this._editorResource.toJSON(), this.viewType, token)));
		this._hotExitState = pendingState;

		token.onCancellationRequested(() => {
			pendingState.operation.cancel();
		});

		let errorMessage = '';
		try {
			const backupId = await pendingState.operation;
			// Make sure state has not changed in the meantime
			if (this._hotExitState === pendingState) {
				this._hotExitState = HotExitState.Allowed;
				backupData.meta!.backupId = backupId;
				this._backupId = backupId;
			}
		} catch (e) {
			if (isCancellationError(e)) {
				// This is expected
				throw e;
			}

			// Otherwise it could be a real error. Make sure state has not changed in the meantime.
			if (this._hotExitState === pendingState) {
				this._hotExitState = HotExitState.NotAllowed;
			}
			if (e.message) {
				errorMessage = e.message;
			}
		}

		if (this._hotExitState === HotExitState.Allowed) {
			return backupData;
		}

		throw new Error(`Cannot backup in this state: ${errorMessage}`);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDataChannels.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDataChannels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { IDataChannelService } from '../../../platform/dataChannel/common/dataChannel.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostDataChannelsShape, MainContext, MainThreadDataChannelsShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadDataChannels)
export class MainThreadDataChannels extends Disposable implements MainThreadDataChannelsShape {

	private readonly _proxy: ExtHostDataChannelsShape;

	constructor(
		extHostContext: IExtHostContext,
		@IDataChannelService private readonly _dataChannelService: IDataChannelService
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDataChannels);

		this._register(this._dataChannelService.onDidSendData(e => {
			this._proxy.$onDidReceiveData(e.channelId, e.data);
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDebugService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDebugService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI as uri, UriComponents } from '../../../base/common/uri.js';
import { IDebugService, IConfig, IDebugConfigurationProvider, IBreakpoint, IFunctionBreakpoint, IBreakpointData, IDebugAdapter, IDebugAdapterDescriptorFactory, IDebugSession, IDebugAdapterFactory, IDataBreakpoint, IDebugSessionOptions, IInstructionBreakpoint, DebugConfigurationProviderTriggerKind, IDebugVisualization, DataBreakpointSetType } from '../../contrib/debug/common/debug.js';
import {
	ExtHostContext, ExtHostDebugServiceShape, MainThreadDebugServiceShape, DebugSessionUUID, MainContext,
	IBreakpointsDeltaDto, ISourceMultiBreakpointDto, ISourceBreakpointDto, IFunctionBreakpointDto, IDebugSessionDto, IDataBreakpointDto, IStartDebuggingOptions, IDebugConfiguration, IThreadFocusDto, IStackFrameFocusDto
} from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import severity from '../../../base/common/severity.js';
import { AbstractDebugAdapter } from '../../contrib/debug/common/abstractDebugAdapter.js';
import { IWorkspaceFolder } from '../../../platform/workspace/common/workspace.js';
import { convertToVSCPaths, convertToDAPaths, isSessionAttach } from '../../contrib/debug/common/debugUtils.js';
import { ErrorNoTelemetry } from '../../../base/common/errors.js';
import { IDebugVisualizerService } from '../../contrib/debug/common/debugVisualizers.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { Event } from '../../../base/common/event.js';
import { isDefined } from '../../../base/common/types.js';

@extHostNamedCustomer(MainContext.MainThreadDebugService)
export class MainThreadDebugService implements MainThreadDebugServiceShape, IDebugAdapterFactory {

	private readonly _proxy: ExtHostDebugServiceShape;
	private readonly _toDispose = new DisposableStore();
	private readonly _debugAdapters: Map<number, ExtensionHostDebugAdapter>;
	private _debugAdaptersHandleCounter = 1;
	private readonly _debugConfigurationProviders: Map<number, IDebugConfigurationProvider>;
	private readonly _debugAdapterDescriptorFactories: Map<number, IDebugAdapterDescriptorFactory>;
	private readonly _extHostKnownSessions: Set<DebugSessionUUID>;
	private readonly _visualizerHandles = new Map<string, IDisposable>();
	private readonly _visualizerTreeHandles = new Map<string, IDisposable>();

	constructor(
		extHostContext: IExtHostContext,
		@IDebugService private readonly debugService: IDebugService,
		@IDebugVisualizerService private readonly visualizerService: IDebugVisualizerService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDebugService);

		const sessionListeners = new DisposableMap<IDebugSession, DisposableStore>();
		this._toDispose.add(sessionListeners);
		this._toDispose.add(debugService.onDidNewSession(session => {
			this._proxy.$acceptDebugSessionStarted(this.getSessionDto(session));
			const store = sessionListeners.get(session);
			store?.add(session.onDidChangeName(name => {
				this._proxy.$acceptDebugSessionNameChanged(this.getSessionDto(session), name);
			}));
		}));
		// Need to start listening early to new session events because a custom event can come while a session is initialising
		this._toDispose.add(debugService.onWillNewSession(session => {
			let store = sessionListeners.get(session);
			if (!store) {
				store = new DisposableStore();
				sessionListeners.set(session, store);
			}
			store.add(session.onDidCustomEvent(event => this._proxy.$acceptDebugSessionCustomEvent(this.getSessionDto(session), event)));
		}));
		this._toDispose.add(debugService.onDidEndSession(({ session, restart }) => {
			this._proxy.$acceptDebugSessionTerminated(this.getSessionDto(session));
			this._extHostKnownSessions.delete(session.getId());

			// keep the session listeners around since we still will get events after they restart
			if (!restart) {
				sessionListeners.deleteAndDispose(session);
			}

			// any restarted session will create a new DA, so always throw the old one away.
			for (const [handle, value] of this._debugAdapters) {
				if (value.session === session) {
					this._debugAdapters.delete(handle);
					// break;
				}
			}
		}));
		this._toDispose.add(debugService.getViewModel().onDidFocusSession(session => {
			this._proxy.$acceptDebugSessionActiveChanged(this.getSessionDto(session));
		}));
		this._toDispose.add(toDisposable(() => {
			for (const [handle, da] of this._debugAdapters) {
				da.fireError(handle, new Error('Extension host shut down'));
			}
		}));

		this._debugAdapters = new Map();
		this._debugConfigurationProviders = new Map();
		this._debugAdapterDescriptorFactories = new Map();
		this._extHostKnownSessions = new Set();

		const viewModel = this.debugService.getViewModel();
		this._toDispose.add(Event.any(viewModel.onDidFocusStackFrame, viewModel.onDidFocusThread)(() => {
			const stackFrame = viewModel.focusedStackFrame;
			const thread = viewModel.focusedThread;
			if (stackFrame) {
				this._proxy.$acceptStackFrameFocus({
					kind: 'stackFrame',
					threadId: stackFrame.thread.threadId,
					frameId: stackFrame.frameId,
					sessionId: stackFrame.thread.session.getId(),
				} satisfies IStackFrameFocusDto);
			} else if (thread) {
				this._proxy.$acceptStackFrameFocus({
					kind: 'thread',
					threadId: thread.threadId,
					sessionId: thread.session.getId(),
				} satisfies IThreadFocusDto);
			} else {
				this._proxy.$acceptStackFrameFocus(undefined);
			}
		}));

		this.sendBreakpointsAndListen();
	}

	$registerDebugVisualizerTree(treeId: string, canEdit: boolean): void {
		this._visualizerTreeHandles.set(treeId, this.visualizerService.registerTree(treeId, {
			disposeItem: id => this._proxy.$disposeVisualizedTree(id),
			getChildren: e => this._proxy.$getVisualizerTreeItemChildren(treeId, e),
			getTreeItem: e => this._proxy.$getVisualizerTreeItem(treeId, e),
			editItem: canEdit ? ((e, v) => this._proxy.$editVisualizerTreeItem(e, v)) : undefined
		}));
	}

	$unregisterDebugVisualizerTree(treeId: string): void {
		this._visualizerTreeHandles.get(treeId)?.dispose();
		this._visualizerTreeHandles.delete(treeId);
	}

	$registerDebugVisualizer(extensionId: string, id: string): void {
		const handle = this.visualizerService.register({
			extensionId: new ExtensionIdentifier(extensionId),
			id,
			disposeDebugVisualizers: ids => this._proxy.$disposeDebugVisualizers(ids),
			executeDebugVisualizerCommand: id => this._proxy.$executeDebugVisualizerCommand(id),
			provideDebugVisualizers: (context, token) => this._proxy.$provideDebugVisualizers(extensionId, id, context, token).then(r => r.map(IDebugVisualization.deserialize)),
			resolveDebugVisualizer: (viz, token) => this._proxy.$resolveDebugVisualizer(viz.id, token),
		});
		this._visualizerHandles.set(`${extensionId}/${id}`, handle);
	}

	$unregisterDebugVisualizer(extensionId: string, id: string): void {
		const key = `${extensionId}/${id}`;
		this._visualizerHandles.get(key)?.dispose();
		this._visualizerHandles.delete(key);
	}

	private sendBreakpointsAndListen(): void {
		// set up a handler to send more
		this._toDispose.add(this.debugService.getModel().onDidChangeBreakpoints(e => {
			// Ignore session only breakpoint events since they should only reflect in the UI
			if (e && !e.sessionOnly) {
				const delta: IBreakpointsDeltaDto = {};
				if (e.added) {
					delta.added = this.convertToDto(e.added);
				}
				if (e.removed) {
					delta.removed = e.removed.map(x => x.getId());
				}
				if (e.changed) {
					delta.changed = this.convertToDto(e.changed);
				}

				if (delta.added || delta.removed || delta.changed) {
					this._proxy.$acceptBreakpointsDelta(delta);
				}
			}
		}));

		// send all breakpoints
		const bps = this.debugService.getModel().getBreakpoints();
		const fbps = this.debugService.getModel().getFunctionBreakpoints();
		const dbps = this.debugService.getModel().getDataBreakpoints();
		if (bps.length > 0 || fbps.length > 0) {
			this._proxy.$acceptBreakpointsDelta({
				added: this.convertToDto(bps).concat(this.convertToDto(fbps)).concat(this.convertToDto(dbps))
			});
		}
	}

	public dispose(): void {
		this._toDispose.dispose();
	}

	// interface IDebugAdapterProvider

	createDebugAdapter(session: IDebugSession): IDebugAdapter {
		const handle = this._debugAdaptersHandleCounter++;
		const da = new ExtensionHostDebugAdapter(this, handle, this._proxy, session);
		this._debugAdapters.set(handle, da);
		return da;
	}

	substituteVariables(folder: IWorkspaceFolder | undefined, config: IConfig): Promise<IConfig> {
		return Promise.resolve(this._proxy.$substituteVariables(folder ? folder.uri : undefined, config));
	}

	runInTerminal(args: DebugProtocol.RunInTerminalRequestArguments, sessionId: string): Promise<number | undefined> {
		return this._proxy.$runInTerminal(args, sessionId);
	}

	// RPC methods (MainThreadDebugServiceShape)

	public $registerDebugTypes(debugTypes: string[]) {
		this._toDispose.add(this.debugService.getAdapterManager().registerDebugAdapterFactory(debugTypes, this));
	}

	public $registerBreakpoints(DTOs: Array<ISourceMultiBreakpointDto | IFunctionBreakpointDto | IDataBreakpointDto>): Promise<void> {

		for (const dto of DTOs) {
			if (dto.type === 'sourceMulti') {
				const rawbps = dto.lines.map((l): IBreakpointData => ({
					id: l.id,
					enabled: l.enabled,
					lineNumber: l.line + 1,
					column: l.character > 0 ? l.character + 1 : undefined, // a column value of 0 results in an omitted column attribute; see #46784
					condition: l.condition,
					hitCondition: l.hitCondition,
					logMessage: l.logMessage,
					mode: l.mode,
				}));
				this.debugService.addBreakpoints(uri.revive(dto.uri), rawbps);
			} else if (dto.type === 'function') {
				this.debugService.addFunctionBreakpoint({
					name: dto.functionName,
					mode: dto.mode,
					condition: dto.condition,
					hitCondition: dto.hitCondition,
					enabled: dto.enabled,
					logMessage: dto.logMessage
				}, dto.id);
			} else if (dto.type === 'data') {
				this.debugService.addDataBreakpoint({
					description: dto.label,
					src: { type: DataBreakpointSetType.Variable, dataId: dto.dataId },
					canPersist: dto.canPersist,
					accessTypes: dto.accessTypes,
					accessType: dto.accessType,
					mode: dto.mode
				});
			}
		}
		return Promise.resolve();
	}

	public $unregisterBreakpoints(breakpointIds: string[], functionBreakpointIds: string[], dataBreakpointIds: string[]): Promise<void> {
		breakpointIds.forEach(id => this.debugService.removeBreakpoints(id));
		functionBreakpointIds.forEach(id => this.debugService.removeFunctionBreakpoints(id));
		dataBreakpointIds.forEach(id => this.debugService.removeDataBreakpoints(id));
		return Promise.resolve();
	}

	public $registerDebugConfigurationProvider(debugType: string, providerTriggerKind: DebugConfigurationProviderTriggerKind, hasProvide: boolean, hasResolve: boolean, hasResolve2: boolean, handle: number): Promise<void> {

		const provider: IDebugConfigurationProvider = {
			type: debugType,
			triggerKind: providerTriggerKind
		};
		if (hasProvide) {
			provider.provideDebugConfigurations = (folder, token) => {
				return this._proxy.$provideDebugConfigurations(handle, folder, token);
			};
		}
		if (hasResolve) {
			provider.resolveDebugConfiguration = (folder, config, token) => {
				return this._proxy.$resolveDebugConfiguration(handle, folder, config, token);
			};
		}
		if (hasResolve2) {
			provider.resolveDebugConfigurationWithSubstitutedVariables = (folder, config, token) => {
				return this._proxy.$resolveDebugConfigurationWithSubstitutedVariables(handle, folder, config, token);
			};
		}
		this._debugConfigurationProviders.set(handle, provider);
		this._toDispose.add(this.debugService.getConfigurationManager().registerDebugConfigurationProvider(provider));

		return Promise.resolve(undefined);
	}

	public $unregisterDebugConfigurationProvider(handle: number): void {
		const provider = this._debugConfigurationProviders.get(handle);
		if (provider) {
			this._debugConfigurationProviders.delete(handle);
			this.debugService.getConfigurationManager().unregisterDebugConfigurationProvider(provider);
		}
	}

	public $registerDebugAdapterDescriptorFactory(debugType: string, handle: number): Promise<void> {

		const provider: IDebugAdapterDescriptorFactory = {
			type: debugType,
			createDebugAdapterDescriptor: session => {
				return Promise.resolve(this._proxy.$provideDebugAdapter(handle, this.getSessionDto(session)));
			}
		};
		this._debugAdapterDescriptorFactories.set(handle, provider);
		this._toDispose.add(this.debugService.getAdapterManager().registerDebugAdapterDescriptorFactory(provider));

		return Promise.resolve(undefined);
	}

	public $unregisterDebugAdapterDescriptorFactory(handle: number): void {
		const provider = this._debugAdapterDescriptorFactories.get(handle);
		if (provider) {
			this._debugAdapterDescriptorFactories.delete(handle);
			this.debugService.getAdapterManager().unregisterDebugAdapterDescriptorFactory(provider);
		}
	}

	private getSession(sessionId: DebugSessionUUID | undefined): IDebugSession | undefined {
		if (sessionId) {
			return this.debugService.getModel().getSession(sessionId, true);
		}
		return undefined;
	}

	public async $startDebugging(folder: UriComponents | undefined, nameOrConfig: string | IDebugConfiguration, options: IStartDebuggingOptions): Promise<boolean> {
		const folderUri = folder ? uri.revive(folder) : undefined;
		const launch = this.debugService.getConfigurationManager().getLaunch(folderUri);
		const parentSession = this.getSession(options.parentSessionID);
		const saveBeforeStart = typeof options.suppressSaveBeforeStart === 'boolean' ? !options.suppressSaveBeforeStart : undefined;
		const debugOptions: IDebugSessionOptions = {
			noDebug: options.noDebug,
			parentSession,
			lifecycleManagedByParent: options.lifecycleManagedByParent,
			repl: options.repl,
			compact: options.compact,
			compoundRoot: parentSession?.compoundRoot,
			saveBeforeRestart: saveBeforeStart,
			testRun: options.testRun,

			suppressDebugStatusbar: options.suppressDebugStatusbar,
			suppressDebugToolbar: options.suppressDebugToolbar,
			suppressDebugView: options.suppressDebugView,
		};
		try {
			return this.debugService.startDebugging(launch, nameOrConfig, debugOptions, saveBeforeStart);
		} catch (err) {
			throw new ErrorNoTelemetry(err && err.message ? err.message : 'cannot start debugging');
		}
	}

	public $setDebugSessionName(sessionId: DebugSessionUUID, name: string): void {
		const session = this.debugService.getModel().getSession(sessionId);
		session?.setName(name);
	}

	public $customDebugAdapterRequest(sessionId: DebugSessionUUID, request: string, args: unknown): Promise<unknown> {
		const session = this.debugService.getModel().getSession(sessionId, true);
		if (session) {
			return session.customRequest(request, args).then(response => {
				if (response && response.success) {
					return response.body;
				} else {
					return Promise.reject(new ErrorNoTelemetry(response ? response.message : 'custom request failed'));
				}
			});
		}
		return Promise.reject(new ErrorNoTelemetry('debug session not found'));
	}

	public $getDebugProtocolBreakpoint(sessionId: DebugSessionUUID, breakpoinId: string): Promise<DebugProtocol.Breakpoint | undefined> {
		const session = this.debugService.getModel().getSession(sessionId, true);
		if (session) {
			return Promise.resolve(session.getDebugProtocolBreakpoint(breakpoinId));
		}
		return Promise.reject(new ErrorNoTelemetry('debug session not found'));
	}

	public $stopDebugging(sessionId: DebugSessionUUID | undefined): Promise<void> {
		if (sessionId) {
			const session = this.debugService.getModel().getSession(sessionId, true);
			if (session) {
				return this.debugService.stopSession(session, isSessionAttach(session));
			}
		} else {	// stop all
			return this.debugService.stopSession(undefined);
		}
		return Promise.reject(new ErrorNoTelemetry('debug session not found'));
	}

	public $appendDebugConsole(value: string): void {
		// Use warning as severity to get the orange color for messages coming from the debug extension
		const session = this.debugService.getViewModel().focusedSession;
		session?.appendToRepl({ output: value, sev: severity.Warning });
	}

	public $acceptDAMessage(handle: number, message: DebugProtocol.ProtocolMessage) {
		this.getDebugAdapter(handle).acceptMessage(convertToVSCPaths(message, false));
	}

	public $acceptDAError(handle: number, name: string, message: string, stack: string) {
		// don't use getDebugAdapter since an error can be expected on a post-close
		this._debugAdapters.get(handle)?.fireError(handle, new Error(`${name}: ${message}\n${stack}`));
	}

	public $acceptDAExit(handle: number, code: number, signal: string) {
		// don't use getDebugAdapter since an error can be expected on a post-close
		this._debugAdapters.get(handle)?.fireExit(handle, code, signal);
	}

	private getDebugAdapter(handle: number): ExtensionHostDebugAdapter {
		const adapter = this._debugAdapters.get(handle);
		if (!adapter) {
			throw new Error('Invalid debug adapter');
		}
		return adapter;
	}

	// dto helpers

	public $sessionCached(sessionID: string) {
		// remember that the EH has cached the session and we do not have to send it again
		this._extHostKnownSessions.add(sessionID);
	}


	getSessionDto(session: undefined): undefined;
	getSessionDto(session: IDebugSession): IDebugSessionDto;
	getSessionDto(session: IDebugSession | undefined): IDebugSessionDto | undefined;
	getSessionDto(session: IDebugSession | undefined): IDebugSessionDto | undefined {
		if (session) {
			const sessionID = session.getId();
			if (this._extHostKnownSessions.has(sessionID)) {
				return sessionID;
			} else {
				// this._sessions.add(sessionID); 	// #69534: see $sessionCached above
				return {
					id: sessionID,
					type: session.configuration.type,
					name: session.name,
					folderUri: session.root ? session.root.uri : undefined,
					configuration: session.configuration,
					parent: session.parentSession?.getId(),
				};
			}
		}
		return undefined;
	}

	private convertToDto(bps: (ReadonlyArray<IBreakpoint | IFunctionBreakpoint | IDataBreakpoint | IInstructionBreakpoint>)): Array<ISourceBreakpointDto | IFunctionBreakpointDto | IDataBreakpointDto> {
		return bps.map(bp => {
			if ('name' in bp) {
				const fbp: IFunctionBreakpoint = bp;
				return {
					type: 'function',
					id: fbp.getId(),
					enabled: fbp.enabled,
					condition: fbp.condition,
					hitCondition: fbp.hitCondition,
					logMessage: fbp.logMessage,
					functionName: fbp.name
				} satisfies IFunctionBreakpointDto;
			} else if ('src' in bp) {
				const dbp: IDataBreakpoint = bp;
				return {
					type: 'data',
					id: dbp.getId(),
					dataId: dbp.src.type === DataBreakpointSetType.Variable ? dbp.src.dataId : dbp.src.address,
					enabled: dbp.enabled,
					condition: dbp.condition,
					hitCondition: dbp.hitCondition,
					logMessage: dbp.logMessage,
					accessType: dbp.accessType,
					label: dbp.description,
					canPersist: dbp.canPersist
				} satisfies IDataBreakpointDto;
			} else if ('uri' in bp) {
				const sbp: IBreakpoint = bp;
				return {
					type: 'source',
					id: sbp.getId(),
					enabled: sbp.enabled,
					condition: sbp.condition,
					hitCondition: sbp.hitCondition,
					logMessage: sbp.logMessage,
					uri: sbp.uri,
					line: sbp.lineNumber > 0 ? sbp.lineNumber - 1 : 0,
					character: (typeof sbp.column === 'number' && sbp.column > 0) ? sbp.column - 1 : 0,
				} satisfies ISourceBreakpointDto;
			} else {
				return undefined;
			}
		}).filter(isDefined);
	}
}

/**
 * DebugAdapter that communicates via extension protocol with another debug adapter.
 */
class ExtensionHostDebugAdapter extends AbstractDebugAdapter {

	constructor(private readonly _ds: MainThreadDebugService, private _handle: number, private _proxy: ExtHostDebugServiceShape, readonly session: IDebugSession) {
		super();
	}

	fireError(handle: number, err: Error) {
		this._onError.fire(err);
	}

	fireExit(handle: number, code: number, signal: string) {
		this._onExit.fire(code);
	}

	startSession(): Promise<void> {
		return Promise.resolve(this._proxy.$startDASession(this._handle, this._ds.getSessionDto(this.session)));
	}

	sendMessage(message: DebugProtocol.ProtocolMessage): void {
		this._proxy.$sendDAMessage(this._handle, convertToDAPaths(message, true));
	}

	async stopSession(): Promise<void> {
		await this.cancelPendingRequests();
		return Promise.resolve(this._proxy.$stopDASession(this._handle));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDecorations.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import { Emitter } from '../../../base/common/event.js';
import { IDisposable, dispose } from '../../../base/common/lifecycle.js';
import { ExtHostContext, MainContext, MainThreadDecorationsShape, ExtHostDecorationsShape, DecorationData, DecorationRequest } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDecorationsService, IDecorationData } from '../../services/decorations/common/decorations.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { CancellationError } from '../../../base/common/errors.js';

class DecorationRequestsQueue {

	private _idPool = 0;
	private _requests = new Map<number, DecorationRequest>();
	private _resolver = new Map<number, DeferredPromise<DecorationData>>();

	private _timer: Timeout | undefined;

	constructor(
		private readonly _proxy: ExtHostDecorationsShape,
		private readonly _handle: number
	) {
		//
	}

	enqueue(uri: URI, token: CancellationToken): Promise<DecorationData> {
		const id = ++this._idPool;

		const defer = new DeferredPromise<DecorationData>();
		this._requests.set(id, { id, uri });
		this._resolver.set(id, defer);
		this._processQueue();

		const sub = token.onCancellationRequested(() => {
			this._requests.delete(id);
			this._resolver.delete(id);
			defer.error(new CancellationError());
		});
		return defer.p.finally(() => sub.dispose());
	}

	private _processQueue(): void {
		if (this._timer !== undefined) {
			// already queued
			return;
		}
		this._timer = setTimeout(() => {
			// make request
			const requests = this._requests;
			const resolver = this._resolver;
			this._proxy.$provideDecorations(this._handle, [...requests.values()], CancellationToken.None).then(data => {
				for (const [id, defer] of resolver) {
					defer.complete(data[id]);
				}
			});

			// reset
			this._requests = new Map();
			this._resolver = new Map();
			this._timer = undefined;
		}, 0);
	}
}

@extHostNamedCustomer(MainContext.MainThreadDecorations)
export class MainThreadDecorations implements MainThreadDecorationsShape {

	private readonly _provider = new Map<number, [Emitter<URI[]>, IDisposable]>();
	private readonly _proxy: ExtHostDecorationsShape;

	constructor(
		context: IExtHostContext,
		@IDecorationsService private readonly _decorationsService: IDecorationsService
	) {
		this._proxy = context.getProxy(ExtHostContext.ExtHostDecorations);
	}

	dispose() {
		this._provider.forEach(value => dispose(value));
		this._provider.clear();
	}

	$registerDecorationProvider(handle: number, label: string): void {
		const emitter = new Emitter<URI[]>();
		const queue = new DecorationRequestsQueue(this._proxy, handle);
		const registration = this._decorationsService.registerDecorationsProvider({
			label,
			onDidChange: emitter.event,
			provideDecorations: async (uri, token): Promise<IDecorationData | undefined> => {
				const data = await queue.enqueue(uri, token);
				if (!data) {
					return undefined;
				}
				const [bubble, tooltip, letter, themeColor] = data;
				return {
					weight: 10,
					bubble: bubble ?? false,
					color: themeColor?.id,
					tooltip,
					letter
				};
			}
		});
		this._provider.set(handle, [emitter, registration]);
	}

	$onDidChange(handle: number, resources: UriComponents[]): void {
		const provider = this._provider.get(handle);
		if (provider) {
			const [emitter] = provider;
			emitter.fire(resources && resources.map(r => URI.revive(r)));
		}
	}

	$unregisterDecorationProvider(handle: number): void {
		const provider = this._provider.get(handle);
		if (provider) {
			dispose(provider);
			this._provider.delete(handle);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDiagnostics.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDiagnostics.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkerService, IMarkerData, type IMarker } from '../../../platform/markers/common/markers.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { MainThreadDiagnosticsShape, MainContext, ExtHostDiagnosticsShape, ExtHostContext } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { ResourceMap } from '../../../base/common/map.js';

@extHostNamedCustomer(MainContext.MainThreadDiagnostics)
export class MainThreadDiagnostics implements MainThreadDiagnosticsShape {

	private readonly _activeOwners = new Set<string>();

	private readonly _proxy: ExtHostDiagnosticsShape;
	private readonly _markerListener: IDisposable;

	private static ExtHostCounter: number = 1;
	private readonly extHostId: string;

	constructor(
		extHostContext: IExtHostContext,
		@IMarkerService private readonly _markerService: IMarkerService,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDiagnostics);

		this._markerListener = this._markerService.onMarkerChanged(this._forwardMarkers, this);
		this.extHostId = `extHost${MainThreadDiagnostics.ExtHostCounter++}`;
	}

	dispose(): void {
		this._markerListener.dispose();
		for (const owner of this._activeOwners) {
			const markersData: ResourceMap<IMarker[]> = new ResourceMap<IMarker[]>();
			for (const marker of this._markerService.read({ owner })) {
				let data = markersData.get(marker.resource);
				if (data === undefined) {
					data = [];
					markersData.set(marker.resource, data);
				}
				if (marker.origin !== this.extHostId) {
					data.push(marker);
				}
			}
			for (const [resource, local] of markersData.entries()) {
				this._markerService.changeOne(owner, resource, local);
			}
		}
		this._activeOwners.clear();
	}

	private _forwardMarkers(resources: readonly URI[]): void {
		const data: [UriComponents, IMarkerData[]][] = [];
		for (const resource of resources) {
			const allMarkerData = this._markerService.read({ resource, ignoreResourceFilters: true });
			if (allMarkerData.length === 0) {
				data.push([resource, []]);
			} else {
				const foreignMarkerData = allMarkerData.filter(marker => marker?.origin !== this.extHostId);
				if (foreignMarkerData.length > 0) {
					data.push([resource, foreignMarkerData]);
				}
			}
		}
		if (data.length > 0) {
			this._proxy.$acceptMarkersChange(data);
		}
	}

	$changeMany(owner: string, entries: [UriComponents, IMarkerData[]][]): void {
		for (const entry of entries) {
			const [uri, markers] = entry;
			if (markers) {
				for (const marker of markers) {
					if (marker.relatedInformation) {
						for (const relatedInformation of marker.relatedInformation) {
							relatedInformation.resource = URI.revive(relatedInformation.resource);
						}
					}
					if (marker.code && typeof marker.code !== 'string') {
						marker.code.target = URI.revive(marker.code.target);
					}
					if (marker.origin === undefined) {
						marker.origin = this.extHostId;
					}
				}
			}
			this._markerService.changeOne(owner, this._uriIdentService.asCanonicalUri(URI.revive(uri)), markers);
		}
		this._activeOwners.add(owner);
	}

	$clear(owner: string): void {
		this._markerService.changeAll(owner, []);
		this._activeOwners.delete(owner);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDialogs.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDialogs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { MainThreadDiaglogsShape, MainContext, MainThreadDialogOpenOptions, MainThreadDialogSaveOptions } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IFileDialogService, IOpenDialogOptions, ISaveDialogOptions } from '../../../platform/dialogs/common/dialogs.js';

@extHostNamedCustomer(MainContext.MainThreadDialogs)
export class MainThreadDialogs implements MainThreadDiaglogsShape {

	constructor(
		context: IExtHostContext,
		@IFileDialogService private readonly _fileDialogService: IFileDialogService,
	) {
		//
	}

	dispose(): void {
		//
	}

	async $showOpenDialog(options?: MainThreadDialogOpenOptions): Promise<URI[] | undefined> {
		const convertedOptions = MainThreadDialogs._convertOpenOptions(options);
		if (!convertedOptions.defaultUri) {
			convertedOptions.defaultUri = await this._fileDialogService.defaultFilePath();
		}
		return Promise.resolve(this._fileDialogService.showOpenDialog(convertedOptions));
	}

	async $showSaveDialog(options?: MainThreadDialogSaveOptions): Promise<URI | undefined> {
		const convertedOptions = MainThreadDialogs._convertSaveOptions(options);
		if (!convertedOptions.defaultUri) {
			convertedOptions.defaultUri = await this._fileDialogService.defaultFilePath();
		}
		return Promise.resolve(this._fileDialogService.showSaveDialog(convertedOptions));
	}

	private static _convertOpenOptions(options?: MainThreadDialogOpenOptions): IOpenDialogOptions {
		const result: IOpenDialogOptions = {
			openLabel: options?.openLabel || undefined,
			canSelectFiles: options?.canSelectFiles || (!options?.canSelectFiles && !options?.canSelectFolders),
			canSelectFolders: options?.canSelectFolders,
			canSelectMany: options?.canSelectMany,
			defaultUri: options?.defaultUri ? URI.revive(options.defaultUri) : undefined,
			title: options?.title || undefined,
			availableFileSystems: []
		};
		if (options?.filters) {
			result.filters = [];
			for (const [key, value] of Object.entries(options.filters)) {
				result.filters.push({ name: key, extensions: value });
			}
		}
		return result;
	}

	private static _convertSaveOptions(options?: MainThreadDialogSaveOptions): ISaveDialogOptions {
		const result: ISaveDialogOptions = {
			defaultUri: options?.defaultUri ? URI.revive(options.defaultUri) : undefined,
			saveLabel: options?.saveLabel || undefined,
			title: options?.title || undefined
		};
		if (options?.filters) {
			result.filters = [];
			for (const [key, value] of Object.entries(options.filters)) {
				result.filters.push({ name: key, extensions: value });
			}
		}
		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDocumentContentProviders.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDocumentContentProviders.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../base/common/errors.js';
import { dispose, DisposableMap } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { EditOperation } from '../../../editor/common/core/editOperation.js';
import { Range } from '../../../editor/common/core/range.js';
import { ITextModel } from '../../../editor/common/model.js';
import { IEditorWorkerService } from '../../../editor/common/services/editorWorker.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostDocumentContentProvidersShape, MainContext, MainThreadDocumentContentProvidersShape } from '../common/extHost.protocol.js';
import { CancellationTokenSource } from '../../../base/common/cancellation.js';

@extHostNamedCustomer(MainContext.MainThreadDocumentContentProviders)
export class MainThreadDocumentContentProviders implements MainThreadDocumentContentProvidersShape {

	private readonly _resourceContentProvider = new DisposableMap<number>();
	private readonly _pendingUpdate = new Map<string, CancellationTokenSource>();
	private readonly _proxy: ExtHostDocumentContentProvidersShape;

	constructor(
		extHostContext: IExtHostContext,
		@ITextModelService private readonly _textModelResolverService: ITextModelService,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IModelService private readonly _modelService: IModelService,
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocumentContentProviders);
	}

	dispose(): void {
		this._resourceContentProvider.dispose();
		dispose(this._pendingUpdate.values());
	}

	$registerTextContentProvider(handle: number, scheme: string): void {
		const registration = this._textModelResolverService.registerTextModelContentProvider(scheme, {
			provideTextContent: (uri: URI): Promise<ITextModel | null> => {
				return this._proxy.$provideTextDocumentContent(handle, uri).then(value => {
					if (typeof value === 'string') {
						const firstLineText = value.substr(0, 1 + value.search(/\r?\n/));
						const languageSelection = this._languageService.createByFilepathOrFirstLine(uri, firstLineText);
						return this._modelService.createModel(value, languageSelection, uri);
					}
					return null;
				});
			}
		});
		this._resourceContentProvider.set(handle, registration);
	}

	$unregisterTextContentProvider(handle: number): void {
		this._resourceContentProvider.deleteAndDispose(handle);
	}

	async $onVirtualDocumentChange(uri: UriComponents, value: string): Promise<void> {
		const model = this._modelService.getModel(URI.revive(uri));
		if (!model) {
			return;
		}

		// cancel and dispose an existing update
		const pending = this._pendingUpdate.get(model.id);
		pending?.cancel();

		// create and keep update token
		const myToken = new CancellationTokenSource();
		this._pendingUpdate.set(model.id, myToken);

		try {
			const edits = await this._editorWorkerService.computeMoreMinimalEdits(model.uri, [{ text: value, range: model.getFullModelRange() }]);

			// remove token
			this._pendingUpdate.delete(model.id);

			if (myToken.token.isCancellationRequested) {
				// ignore this
				return;
			}

			if (model.isDisposed()) {
				// model was disposed during the async operation
				return;
			}
			if (edits && edits.length > 0) {
				// use the evil-edit as these models show in readonly-editor only
				model.applyEdits(edits.map(edit => EditOperation.replace(Range.lift(edit.range), edit.text)));
			}
		} catch (error) {
			onUnexpectedError(error);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDocuments.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDocuments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { IReference, dispose, Disposable } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ITextModel, shouldSynchronizeModel } from '../../../editor/common/model.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { IFileService, FileOperation } from '../../../platform/files/common/files.js';
import { ExtHostContext, ExtHostDocumentsShape, MainThreadDocumentsShape } from '../common/extHost.protocol.js';
import { EncodingMode, ITextFileEditorModel, ITextFileService, TextFileResolveReason } from '../../services/textfile/common/textfiles.js';
import { IUntitledTextEditorModel } from '../../services/untitled/common/untitledTextEditorModel.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { toLocalResource, extUri, IExtUri } from '../../../base/common/resources.js';
import { IWorkingCopyFileService } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { ResourceMap } from '../../../base/common/map.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ErrorNoTelemetry, onUnexpectedError } from '../../../base/common/errors.js';
import { ISerializedModelContentChangedEvent } from '../../../editor/common/textModelEvents.js';

export class BoundModelReferenceCollection {

	private _data = new Array<{ uri: URI; length: number; dispose(): void }>();
	private _length = 0;

	constructor(
		private readonly _extUri: IExtUri,
		private readonly _maxAge: number = 1000 * 60 * 3, // auto-dispse by age
		private readonly _maxLength: number = 1024 * 1024 * 80, // auto-dispose by total length
		private readonly _maxSize: number = 50 // auto-dispose by number of references
	) {
		//
	}

	dispose(): void {
		this._data = dispose(this._data);
	}

	remove(uri: URI): void {
		for (const entry of [...this._data] /* copy array because dispose will modify it */) {
			if (this._extUri.isEqualOrParent(entry.uri, uri)) {
				entry.dispose();
			}
		}
	}

	add(uri: URI, ref: IReference<unknown>, length: number = 0): void {
		// const length = ref.object.textEditorModel.getValueLength();
		const dispose = () => {
			const idx = this._data.indexOf(entry);
			if (idx >= 0) {
				this._length -= length;
				ref.dispose();
				clearTimeout(handle);
				this._data.splice(idx, 1);
			}
		};
		const handle = setTimeout(dispose, this._maxAge);
		const entry = { uri, length, dispose };

		this._data.push(entry);
		this._length += length;
		this._cleanup();
	}

	private _cleanup(): void {
		// clean-up wrt total length
		while (this._length > this._maxLength) {
			this._data[0].dispose();
		}
		// clean-up wrt number of documents
		const extraSize = Math.ceil(this._maxSize * 1.2);
		if (this._data.length >= extraSize) {
			dispose(this._data.slice(0, extraSize - this._maxSize));
		}
	}
}

class ModelTracker extends Disposable {

	private _knownVersionId: number;

	constructor(
		private readonly _model: ITextModel,
		private readonly _onIsCaughtUpWithContentChanges: Emitter<URI>,
		private readonly _proxy: ExtHostDocumentsShape,
		private readonly _textFileService: ITextFileService,
	) {
		super();
		this._knownVersionId = this._model.getVersionId();
		this._store.add(this._model.onDidChangeContent((e) => {
			this._knownVersionId = e.versionId;
			if (e.detailedReasonsChangeLengths.length !== 1) {
				onUnexpectedError(new Error(`Unexpected reasons: ${e.detailedReasons.map(r => r.toString())}`));
			}

			const evt: ISerializedModelContentChangedEvent = {
				changes: e.changes,
				isEolChange: e.isEolChange,
				isUndoing: e.isUndoing,
				isRedoing: e.isRedoing,
				isFlush: e.isFlush,
				eol: e.eol,
				versionId: e.versionId,
				detailedReason: e.detailedReasons[0].metadata,
			};
			this._proxy.$acceptModelChanged(this._model.uri, evt, this._textFileService.isDirty(this._model.uri));
			if (this.isCaughtUpWithContentChanges()) {
				this._onIsCaughtUpWithContentChanges.fire(this._model.uri);
			}
		}));
	}

	isCaughtUpWithContentChanges(): boolean {
		return (this._model.getVersionId() === this._knownVersionId);
	}
}

export class MainThreadDocuments extends Disposable implements MainThreadDocumentsShape {

	private _onIsCaughtUpWithContentChanges = this._store.add(new Emitter<URI>());
	readonly onIsCaughtUpWithContentChanges = this._onIsCaughtUpWithContentChanges.event;

	private readonly _proxy: ExtHostDocumentsShape;
	private readonly _modelTrackers = new ResourceMap<ModelTracker>();
	private readonly _modelReferenceCollection: BoundModelReferenceCollection;

	constructor(
		extHostContext: IExtHostContext,
		@IModelService private readonly _modelService: IModelService,
		@ITextFileService private readonly _textFileService: ITextFileService,
		@IFileService private readonly _fileService: IFileService,
		@ITextModelService private readonly _textModelResolverService: ITextModelService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IPathService private readonly _pathService: IPathService
	) {
		super();

		this._modelReferenceCollection = this._store.add(new BoundModelReferenceCollection(_uriIdentityService.extUri));

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocuments);

		this._store.add(_modelService.onModelLanguageChanged(this._onModelModeChanged, this));

		this._store.add(_textFileService.files.onDidSave(e => {
			if (this._shouldHandleFileEvent(e.model.resource)) {
				this._proxy.$acceptModelSaved(e.model.resource);
			}
		}));
		this._store.add(_textFileService.files.onDidChangeDirty(m => {
			if (this._shouldHandleFileEvent(m.resource)) {
				this._proxy.$acceptDirtyStateChanged(m.resource, m.isDirty());
			}
		}));
		this._store.add(Event.any<ITextFileEditorModel | IUntitledTextEditorModel>(_textFileService.files.onDidChangeEncoding, _textFileService.untitled.onDidChangeEncoding)(m => {
			if (this._shouldHandleFileEvent(m.resource)) {
				const encoding = m.getEncoding();
				if (encoding) {
					this._proxy.$acceptEncodingChanged(m.resource, encoding);
				}
			}
		}));

		this._store.add(workingCopyFileService.onDidRunWorkingCopyFileOperation(e => {
			const isMove = e.operation === FileOperation.MOVE;
			if (isMove || e.operation === FileOperation.DELETE) {
				for (const pair of e.files) {
					const removed = isMove ? pair.source : pair.target;
					if (removed) {
						this._modelReferenceCollection.remove(removed);
					}
				}
			}
		}));
	}

	override dispose(): void {
		dispose(this._modelTrackers.values());
		this._modelTrackers.clear();
		super.dispose();
	}

	isCaughtUpWithContentChanges(resource: URI): boolean {
		const tracker = this._modelTrackers.get(resource);
		if (tracker) {
			return tracker.isCaughtUpWithContentChanges();
		}
		return true;
	}

	private _shouldHandleFileEvent(resource: URI): boolean {
		const model = this._modelService.getModel(resource);
		return !!model && shouldSynchronizeModel(model);
	}

	handleModelAdded(model: ITextModel): void {
		// Same filter as in mainThreadEditorsTracker
		if (!shouldSynchronizeModel(model)) {
			// don't synchronize too large models
			return;
		}
		this._modelTrackers.set(model.uri, new ModelTracker(model, this._onIsCaughtUpWithContentChanges, this._proxy, this._textFileService));
	}

	private _onModelModeChanged(event: { model: ITextModel; oldLanguageId: string }): void {
		const { model } = event;
		if (!this._modelTrackers.has(model.uri)) {
			return;
		}
		this._proxy.$acceptModelLanguageChanged(model.uri, model.getLanguageId());
	}

	handleModelRemoved(modelUrl: URI): void {
		if (!this._modelTrackers.has(modelUrl)) {
			return;
		}
		this._modelTrackers.get(modelUrl)!.dispose();
		this._modelTrackers.delete(modelUrl);
	}

	// --- from extension host process

	async $trySaveDocument(uri: UriComponents): Promise<boolean> {
		const target = await this._textFileService.save(URI.revive(uri));
		return Boolean(target);
	}

	async $tryOpenDocument(uriData: UriComponents, options?: { encoding?: string }): Promise<URI> {
		const inputUri = URI.revive(uriData);
		if (!inputUri.scheme || !(inputUri.fsPath || inputUri.authority)) {
			throw new ErrorNoTelemetry(`Invalid uri. Scheme and authority or path must be set.`);
		}

		const canonicalUri = this._uriIdentityService.asCanonicalUri(inputUri);

		let promise: Promise<URI>;
		switch (canonicalUri.scheme) {
			case Schemas.untitled:
				promise = this._handleUntitledScheme(canonicalUri, options);
				break;
			case Schemas.file:
			default:
				promise = this._handleAsResourceInput(canonicalUri, options);
				break;
		}

		let documentUri: URI | undefined;
		try {
			documentUri = await promise;
		} catch (err) {
			throw new ErrorNoTelemetry(`cannot open ${canonicalUri.toString()}. Detail: ${toErrorMessage(err)}`);
		}
		if (!documentUri) {
			throw new ErrorNoTelemetry(`cannot open ${canonicalUri.toString()}`);
		} else if (!extUri.isEqual(documentUri, canonicalUri)) {
			throw new ErrorNoTelemetry(`cannot open ${canonicalUri.toString()}. Detail: Actual document opened as ${documentUri.toString()}`);
		} else if (!this._modelTrackers.has(canonicalUri)) {
			throw new ErrorNoTelemetry(`cannot open ${canonicalUri.toString()}. Detail: Files above 50MB cannot be synchronized with extensions.`);
		} else {
			return canonicalUri;
		}
	}

	$tryCreateDocument(options?: { language?: string; content?: string; encoding?: string }): Promise<URI> {
		return this._doCreateUntitled(undefined, options);
	}

	private async _handleAsResourceInput(uri: URI, options?: { encoding?: string }): Promise<URI> {
		if (options?.encoding) {
			const model = await this._textFileService.files.resolve(uri, { encoding: options.encoding, reason: TextFileResolveReason.REFERENCE });
			if (model.isDirty()) {
				throw new ErrorNoTelemetry(`Cannot re-open a dirty text document with different encoding. Save it first.`);
			}
			await model.setEncoding(options.encoding, EncodingMode.Decode);
		}

		const ref = await this._textModelResolverService.createModelReference(uri);
		this._modelReferenceCollection.add(uri, ref, ref.object.textEditorModel.getValueLength());
		return ref.object.textEditorModel.uri;
	}

	private async _handleUntitledScheme(uri: URI, options?: { encoding?: string }): Promise<URI> {
		const asLocalUri = toLocalResource(uri, this._environmentService.remoteAuthority, this._pathService.defaultUriScheme);
		const exists = await this._fileService.exists(asLocalUri);
		if (exists) {
			// don't create a new file ontop of an existing file
			return Promise.reject(new Error('file already exists'));
		}
		return await this._doCreateUntitled(Boolean(uri.path) ? uri : undefined, options);
	}

	private async _doCreateUntitled(associatedResource?: URI, options?: { language?: string; content?: string; encoding?: string }): Promise<URI> {
		const model = this._textFileService.untitled.create({
			associatedResource,
			languageId: options?.language,
			initialValue: options?.content,
			encoding: options?.encoding
		});
		if (options?.encoding) {
			await model.setEncoding(options.encoding);
		}
		const resource = model.resource;
		const ref = await this._textModelResolverService.createModelReference(resource);
		if (!this._modelTrackers.has(resource)) {
			ref.dispose();
			throw new Error(`expected URI ${resource.toString()} to have come to LIFE`);
		}
		this._modelReferenceCollection.add(resource, ref, ref.object.textEditorModel.getValueLength());
		Event.once(model.onDidRevert)(() => this._modelReferenceCollection.remove(resource));
		this._proxy.$acceptDirtyStateChanged(resource, true); // mark as dirty
		return resource;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDocumentsAndEditors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDocumentsAndEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { combinedDisposable, DisposableStore, DisposableMap } from '../../../base/common/lifecycle.js';
import { ICodeEditor, isCodeEditor, isDiffEditor, IActiveCodeEditor } from '../../../editor/browser/editorBrowser.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { IEditor } from '../../../editor/common/editorCommon.js';
import { ITextModel, shouldSynchronizeModel } from '../../../editor/common/model.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { MainThreadDocuments } from './mainThreadDocuments.js';
import { MainThreadTextEditor } from './mainThreadEditor.js';
import { IMainThreadEditorLocator, MainThreadTextEditors } from './mainThreadEditors.js';
import { ExtHostContext, ExtHostDocumentsAndEditorsShape, IDocumentsAndEditorsDelta, IModelAddedData, ITextEditorAddData, MainContext } from '../common/extHost.protocol.js';
import { AbstractTextEditor } from '../../browser/parts/editor/textEditor.js';
import { IEditorPane } from '../../common/editor.js';
import { EditorGroupColumn, editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { ITextFileService } from '../../services/textfile/common/textfiles.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { IWorkingCopyFileService } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { IPathService } from '../../services/path/common/pathService.js';
import { diffSets, diffMaps } from '../../../base/common/collections.js';
import { IPaneCompositePartService } from '../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../common/views.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IQuickDiffModelService } from '../../contrib/scm/browser/quickDiffModel.js';


class TextEditorSnapshot {

	readonly id: string;

	constructor(
		readonly editor: IActiveCodeEditor,
	) {
		this.id = `${editor.getId()},${editor.getModel().id}`;
	}
}

class DocumentAndEditorStateDelta {

	readonly isEmpty: boolean;

	constructor(
		readonly removedDocuments: ITextModel[],
		readonly addedDocuments: ITextModel[],
		readonly removedEditors: TextEditorSnapshot[],
		readonly addedEditors: TextEditorSnapshot[],
		readonly oldActiveEditor: string | null | undefined,
		readonly newActiveEditor: string | null | undefined,
	) {
		this.isEmpty = this.removedDocuments.length === 0
			&& this.addedDocuments.length === 0
			&& this.removedEditors.length === 0
			&& this.addedEditors.length === 0
			&& oldActiveEditor === newActiveEditor;
	}

	toString(): string {
		let ret = 'DocumentAndEditorStateDelta\n';
		ret += `\tRemoved Documents: [${this.removedDocuments.map(d => d.uri.toString(true)).join(', ')}]\n`;
		ret += `\tAdded Documents: [${this.addedDocuments.map(d => d.uri.toString(true)).join(', ')}]\n`;
		ret += `\tRemoved Editors: [${this.removedEditors.map(e => e.id).join(', ')}]\n`;
		ret += `\tAdded Editors: [${this.addedEditors.map(e => e.id).join(', ')}]\n`;
		ret += `\tNew Active Editor: ${this.newActiveEditor}\n`;
		return ret;
	}
}

class DocumentAndEditorState {

	static compute(before: DocumentAndEditorState | undefined, after: DocumentAndEditorState): DocumentAndEditorStateDelta {
		if (!before) {
			return new DocumentAndEditorStateDelta(
				[], [...after.documents.values()],
				[], [...after.textEditors.values()],
				undefined, after.activeEditor
			);
		}
		const documentDelta = diffSets(before.documents, after.documents);
		const editorDelta = diffMaps(before.textEditors, after.textEditors);
		const oldActiveEditor = before.activeEditor !== after.activeEditor ? before.activeEditor : undefined;
		const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;

		return new DocumentAndEditorStateDelta(
			documentDelta.removed, documentDelta.added,
			editorDelta.removed, editorDelta.added,
			oldActiveEditor, newActiveEditor
		);
	}

	constructor(
		readonly documents: Set<ITextModel>,
		readonly textEditors: Map<string, TextEditorSnapshot>,
		readonly activeEditor: string | null | undefined,
	) {
		//
	}
}

const enum ActiveEditorOrder {
	Editor, Panel
}

class MainThreadDocumentAndEditorStateComputer {

	private readonly _toDispose = new DisposableStore();
	private readonly _toDisposeOnEditorRemove = new DisposableMap<string>();
	private _currentState?: DocumentAndEditorState;
	private _activeEditorOrder: ActiveEditorOrder = ActiveEditorOrder.Editor;

	constructor(
		private readonly _onDidChangeState: (delta: DocumentAndEditorStateDelta) => void,
		@IModelService private readonly _modelService: IModelService,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IEditorService private readonly _editorService: IEditorService,
		@IPaneCompositePartService private readonly _paneCompositeService: IPaneCompositePartService,
	) {
		this._modelService.onModelAdded(this._updateStateOnModelAdd, this, this._toDispose);
		this._modelService.onModelRemoved(_ => this._updateState(), this, this._toDispose);
		this._editorService.onDidActiveEditorChange(_ => this._updateState(), this, this._toDispose);

		this._codeEditorService.onCodeEditorAdd(this._onDidAddEditor, this, this._toDispose);
		this._codeEditorService.onCodeEditorRemove(this._onDidRemoveEditor, this, this._toDispose);
		this._codeEditorService.listCodeEditors().forEach(this._onDidAddEditor, this);

		Event.filter(this._paneCompositeService.onDidPaneCompositeOpen, event => event.viewContainerLocation === ViewContainerLocation.Panel)(_ => this._activeEditorOrder = ActiveEditorOrder.Panel, undefined, this._toDispose);
		Event.filter(this._paneCompositeService.onDidPaneCompositeClose, event => event.viewContainerLocation === ViewContainerLocation.Panel)(_ => this._activeEditorOrder = ActiveEditorOrder.Editor, undefined, this._toDispose);
		this._editorService.onDidVisibleEditorsChange(_ => this._activeEditorOrder = ActiveEditorOrder.Editor, undefined, this._toDispose);

		this._updateState();
	}

	dispose(): void {
		this._toDispose.dispose();
		this._toDisposeOnEditorRemove.dispose();
	}

	private _onDidAddEditor(e: ICodeEditor): void {
		this._toDisposeOnEditorRemove.set(e.getId(), combinedDisposable(
			e.onDidChangeModel(() => this._updateState()),
			e.onDidFocusEditorText(() => this._updateState()),
			e.onDidFocusEditorWidget(() => this._updateState(e))
		));
		this._updateState();
	}

	private _onDidRemoveEditor(e: ICodeEditor): void {
		const id = e.getId();
		if (this._toDisposeOnEditorRemove.has(id)) {
			this._toDisposeOnEditorRemove.deleteAndDispose(id);
			this._updateState();
		}
	}

	private _updateStateOnModelAdd(model: ITextModel): void {
		if (!shouldSynchronizeModel(model)) {
			// ignore
			return;
		}

		if (!this._currentState) {
			// too early
			this._updateState();
			return;
		}

		// small (fast) delta
		this._currentState = new DocumentAndEditorState(
			this._currentState.documents.add(model),
			this._currentState.textEditors,
			this._currentState.activeEditor
		);

		this._onDidChangeState(new DocumentAndEditorStateDelta(
			[], [model],
			[], [],
			undefined, undefined
		));
	}

	private _updateState(widgetFocusCandidate?: ICodeEditor): void {

		// models: ignore too large models
		const models = new Set<ITextModel>();
		for (const model of this._modelService.getModels()) {
			if (shouldSynchronizeModel(model)) {
				models.add(model);
			}
		}

		// editor: only take those that have a not too large model
		const editors = new Map<string, TextEditorSnapshot>();
		let activeEditor: string | null = null; // Strict null work. This doesn't like being undefined!

		for (const editor of this._codeEditorService.listCodeEditors()) {
			if (editor.isSimpleWidget) {
				continue;
			}
			const model = editor.getModel();
			if (editor.hasModel() && model && shouldSynchronizeModel(model)
				&& !model.isDisposed() // model disposed
				&& Boolean(this._modelService.getModel(model.uri)) // model disposing, the flag didn't flip yet but the model service already removed it
			) {
				const apiEditor = new TextEditorSnapshot(editor);
				editors.set(apiEditor.id, apiEditor);
				if (editor.hasTextFocus() || (widgetFocusCandidate === editor && editor.hasWidgetFocus())) {
					// text focus has priority, widget focus is tricky because multiple
					// editors might claim widget focus at the same time. therefore we use a
					// candidate (which is the editor that has raised an widget focus event)
					// in addition to the widget focus check
					activeEditor = apiEditor.id;
				}
			}
		}

		// active editor: if none of the previous editors had focus we try
		// to match output panels or the active workbench editor with
		// one of editor we have just computed
		if (!activeEditor) {
			let candidate: IEditor | undefined;
			if (this._activeEditorOrder === ActiveEditorOrder.Editor) {
				candidate = this._getActiveEditorFromEditorPart() || this._getActiveEditorFromPanel();
			} else {
				candidate = this._getActiveEditorFromPanel() || this._getActiveEditorFromEditorPart();
			}

			if (candidate) {
				for (const snapshot of editors.values()) {
					if (candidate === snapshot.editor) {
						activeEditor = snapshot.id;
					}
				}
			}
		}

		// compute new state and compare against old
		const newState = new DocumentAndEditorState(models, editors, activeEditor);
		const delta = DocumentAndEditorState.compute(this._currentState, newState);
		if (!delta.isEmpty) {
			this._currentState = newState;
			this._onDidChangeState(delta);
		}
	}

	private _getActiveEditorFromPanel(): IEditor | undefined {
		const panel = this._paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel);
		if (panel instanceof AbstractTextEditor) {
			const control = panel.getControl();
			if (isCodeEditor(control)) {
				return control;
			}
		}

		return undefined;
	}

	private _getActiveEditorFromEditorPart(): IEditor | undefined {
		let activeTextEditorControl = this._editorService.activeTextEditorControl;
		if (isDiffEditor(activeTextEditorControl)) {
			activeTextEditorControl = activeTextEditorControl.getModifiedEditor();
		}
		return activeTextEditorControl;
	}
}

@extHostCustomer
export class MainThreadDocumentsAndEditors implements IMainThreadEditorLocator {

	private readonly _toDispose = new DisposableStore();
	private readonly _proxy: ExtHostDocumentsAndEditorsShape;
	private readonly _mainThreadDocuments: MainThreadDocuments;
	private readonly _mainThreadEditors: MainThreadTextEditors;
	private readonly _textEditors = new Map<string, MainThreadTextEditor>();

	constructor(
		extHostContext: IExtHostContext,
		@IModelService private readonly _modelService: IModelService,
		@ITextFileService private readonly _textFileService: ITextFileService,
		@IEditorService private readonly _editorService: IEditorService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IFileService fileService: IFileService,
		@ITextModelService textModelResolverService: ITextModelService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@IPaneCompositePartService paneCompositeService: IPaneCompositePartService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IClipboardService private readonly _clipboardService: IClipboardService,
		@IPathService pathService: IPathService,
		@IConfigurationService configurationService: IConfigurationService,
		@IQuickDiffModelService quickDiffModelService: IQuickDiffModelService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostDocumentsAndEditors);

		this._mainThreadDocuments = this._toDispose.add(new MainThreadDocuments(extHostContext, this._modelService, this._textFileService, fileService, textModelResolverService, environmentService, uriIdentityService, workingCopyFileService, pathService));
		extHostContext.set(MainContext.MainThreadDocuments, this._mainThreadDocuments);

		this._mainThreadEditors = this._toDispose.add(new MainThreadTextEditors(this, extHostContext, codeEditorService, this._editorService, this._editorGroupService, configurationService, quickDiffModelService, uriIdentityService));
		extHostContext.set(MainContext.MainThreadTextEditors, this._mainThreadEditors);

		// It is expected that the ctor of the state computer calls our `_onDelta`.
		this._toDispose.add(new MainThreadDocumentAndEditorStateComputer(delta => this._onDelta(delta), _modelService, codeEditorService, this._editorService, paneCompositeService));
	}

	dispose(): void {
		this._toDispose.dispose();
	}

	private _onDelta(delta: DocumentAndEditorStateDelta): void {

		const removedEditors: string[] = [];
		const addedEditors: MainThreadTextEditor[] = [];

		// removed models
		const removedDocuments = delta.removedDocuments.map(m => m.uri);

		// added editors
		for (const apiEditor of delta.addedEditors) {
			const mainThreadEditor = new MainThreadTextEditor(apiEditor.id, apiEditor.editor.getModel(),
				apiEditor.editor, { onGainedFocus() { }, onLostFocus() { } }, this._mainThreadDocuments, this._modelService, this._clipboardService);

			this._textEditors.set(apiEditor.id, mainThreadEditor);
			addedEditors.push(mainThreadEditor);
		}

		// removed editors
		for (const { id } of delta.removedEditors) {
			const mainThreadEditor = this._textEditors.get(id);
			if (mainThreadEditor) {
				mainThreadEditor.dispose();
				this._textEditors.delete(id);
				removedEditors.push(id);
			}
		}

		const extHostDelta: IDocumentsAndEditorsDelta = Object.create(null);
		let empty = true;
		if (delta.newActiveEditor !== undefined) {
			empty = false;
			extHostDelta.newActiveEditor = delta.newActiveEditor;
		}
		if (removedDocuments.length > 0) {
			empty = false;
			extHostDelta.removedDocuments = removedDocuments;
		}
		if (removedEditors.length > 0) {
			empty = false;
			extHostDelta.removedEditors = removedEditors;
		}
		if (delta.addedDocuments.length > 0) {
			empty = false;
			extHostDelta.addedDocuments = delta.addedDocuments.map(m => this._toModelAddData(m));
		}
		if (delta.addedEditors.length > 0) {
			empty = false;
			extHostDelta.addedEditors = addedEditors.map(e => this._toTextEditorAddData(e));
		}

		if (!empty) {
			// first update ext host
			this._proxy.$acceptDocumentsAndEditorsDelta(extHostDelta);

			// second update dependent document/editor states
			removedDocuments.forEach(this._mainThreadDocuments.handleModelRemoved, this._mainThreadDocuments);
			delta.addedDocuments.forEach(this._mainThreadDocuments.handleModelAdded, this._mainThreadDocuments);

			removedEditors.forEach(this._mainThreadEditors.handleTextEditorRemoved, this._mainThreadEditors);
			addedEditors.forEach(this._mainThreadEditors.handleTextEditorAdded, this._mainThreadEditors);
		}
	}

	private _toModelAddData(model: ITextModel): IModelAddedData {
		return {
			uri: model.uri,
			versionId: model.getVersionId(),
			lines: model.getLinesContent(),
			EOL: model.getEOL(),
			languageId: model.getLanguageId(),
			isDirty: this._textFileService.isDirty(model.uri),
			encoding: this._textFileService.getEncoding(model.uri)
		};
	}

	private _toTextEditorAddData(textEditor: MainThreadTextEditor): ITextEditorAddData {
		const props = textEditor.getProperties();
		return {
			id: textEditor.getId(),
			documentUri: textEditor.getModel().uri,
			options: props.options,
			selections: props.selections,
			visibleRanges: props.visibleRanges,
			editorPosition: this._findEditorPosition(textEditor)
		};
	}

	private _findEditorPosition(editor: MainThreadTextEditor): EditorGroupColumn | undefined {
		for (const editorPane of this._editorService.visibleEditorPanes) {
			if (editor.matches(editorPane)) {
				return editorGroupToColumn(this._editorGroupService, editorPane.group);
			}
		}
		return undefined;
	}

	findTextEditorIdFor(editorPane: IEditorPane): string | undefined {
		for (const [id, editor] of this._textEditors) {
			if (editor.matches(editorPane)) {
				return id;
			}
		}
		return undefined;
	}

	getIdOfCodeEditor(codeEditor: ICodeEditor): string | undefined {
		for (const [id, editor] of this._textEditors) {
			if (editor.getCodeEditor() === codeEditor) {
				return id;
			}
		}
		return undefined;
	}

	getEditor(id: string): MainThreadTextEditor | undefined {
		return this._textEditors.get(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadDownloadService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadDownloadService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { MainContext, MainThreadDownloadServiceShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDownloadService } from '../../../platform/download/common/download.js';
import { UriComponents, URI } from '../../../base/common/uri.js';

@extHostNamedCustomer(MainContext.MainThreadDownloadService)
export class MainThreadDownloadService extends Disposable implements MainThreadDownloadServiceShape {

	constructor(
		extHostContext: IExtHostContext,
		@IDownloadService private readonly downloadService: IDownloadService
	) {
		super();
	}

	$download(uri: UriComponents, to: UriComponents): Promise<void> {
		return this.downloadService.download(URI.revive(uri), URI.revive(to));
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadEditor.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ICodeEditor } from '../../../editor/browser/editorBrowser.js';
import { RenderLineNumbersType, TextEditorCursorStyle, cursorStyleToString, EditorOption } from '../../../editor/common/config/editorOptions.js';
import { IRange, Range } from '../../../editor/common/core/range.js';
import { ISelection, Selection } from '../../../editor/common/core/selection.js';
import { IDecorationOptions, ScrollType } from '../../../editor/common/editorCommon.js';
import { ITextModel, ITextModelUpdateOptions } from '../../../editor/common/model.js';
import { ISingleEditOperation } from '../../../editor/common/core/editOperation.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { SnippetController2 } from '../../../editor/contrib/snippet/browser/snippetController2.js';
import { IApplyEditsOptions, IEditorPropertiesChangeData, IResolvedTextEditorConfiguration, ISnippetOptions, ITextEditorConfigurationUpdate, TextEditorRevealType } from '../common/extHost.protocol.js';
import { IEditorPane } from '../../common/editor.js';
import { equals } from '../../../base/common/arrays.js';
import { CodeEditorStateFlag, EditorState } from '../../../editor/contrib/editorState/browser/editorState.js';
import { IClipboardService } from '../../../platform/clipboard/common/clipboardService.js';
import { SnippetParser } from '../../../editor/contrib/snippet/browser/snippetParser.js';
import { MainThreadDocuments } from './mainThreadDocuments.js';
import { ISnippetEdit } from '../../../editor/contrib/snippet/browser/snippetSession.js';

export interface IFocusTracker {
	onGainedFocus(): void;
	onLostFocus(): void;
}

export class MainThreadTextEditorProperties {

	public static readFromEditor(previousProperties: MainThreadTextEditorProperties | null, model: ITextModel, codeEditor: ICodeEditor | null): MainThreadTextEditorProperties {
		const selections = MainThreadTextEditorProperties._readSelectionsFromCodeEditor(previousProperties, codeEditor);
		const options = MainThreadTextEditorProperties._readOptionsFromCodeEditor(previousProperties, model, codeEditor);
		const visibleRanges = MainThreadTextEditorProperties._readVisibleRangesFromCodeEditor(previousProperties, codeEditor);
		return new MainThreadTextEditorProperties(selections, options, visibleRanges);
	}

	private static _readSelectionsFromCodeEditor(previousProperties: MainThreadTextEditorProperties | null, codeEditor: ICodeEditor | null): Selection[] {
		let result: Selection[] | null = null;
		if (codeEditor) {
			result = codeEditor.getSelections();
		}
		if (!result && previousProperties) {
			result = previousProperties.selections;
		}
		if (!result) {
			result = [new Selection(1, 1, 1, 1)];
		}
		return result;
	}

	private static _readOptionsFromCodeEditor(previousProperties: MainThreadTextEditorProperties | null, model: ITextModel, codeEditor: ICodeEditor | null): IResolvedTextEditorConfiguration {
		if (model.isDisposed()) {
			if (previousProperties) {
				// shutdown time
				return previousProperties.options;
			} else {
				throw new Error('No valid properties');
			}
		}

		let cursorStyle: TextEditorCursorStyle;
		let lineNumbers: RenderLineNumbersType;
		if (codeEditor) {
			const options = codeEditor.getOptions();
			const lineNumbersOpts = options.get(EditorOption.lineNumbers);
			cursorStyle = options.get(EditorOption.cursorStyle);
			lineNumbers = lineNumbersOpts.renderType;
		} else if (previousProperties) {
			cursorStyle = previousProperties.options.cursorStyle;
			lineNumbers = previousProperties.options.lineNumbers;
		} else {
			cursorStyle = TextEditorCursorStyle.Line;
			lineNumbers = RenderLineNumbersType.On;
		}

		const modelOptions = model.getOptions();
		return {
			insertSpaces: modelOptions.insertSpaces,
			tabSize: modelOptions.tabSize,
			indentSize: modelOptions.indentSize,
			originalIndentSize: modelOptions.originalIndentSize,
			cursorStyle: cursorStyle,
			lineNumbers: lineNumbers
		};
	}

	private static _readVisibleRangesFromCodeEditor(previousProperties: MainThreadTextEditorProperties | null, codeEditor: ICodeEditor | null): Range[] {
		if (codeEditor) {
			return codeEditor.getVisibleRanges();
		}
		return [];
	}

	constructor(
		public readonly selections: Selection[],
		public readonly options: IResolvedTextEditorConfiguration,
		public readonly visibleRanges: Range[]
	) {
	}

	public generateDelta(oldProps: MainThreadTextEditorProperties | null, selectionChangeSource: string | null): IEditorPropertiesChangeData | null {
		const delta: IEditorPropertiesChangeData = {
			options: null,
			selections: null,
			visibleRanges: null
		};

		if (!oldProps || !MainThreadTextEditorProperties._selectionsEqual(oldProps.selections, this.selections)) {
			delta.selections = {
				selections: this.selections,
				source: selectionChangeSource ?? undefined,
			};
		}

		if (!oldProps || !MainThreadTextEditorProperties._optionsEqual(oldProps.options, this.options)) {
			delta.options = this.options;
		}

		if (!oldProps || !MainThreadTextEditorProperties._rangesEqual(oldProps.visibleRanges, this.visibleRanges)) {
			delta.visibleRanges = this.visibleRanges;
		}

		if (delta.selections || delta.options || delta.visibleRanges) {
			// something changed
			return delta;
		}
		// nothing changed
		return null;
	}

	private static _selectionsEqual(a: readonly Selection[], b: readonly Selection[]): boolean {
		return equals(a, b, (aValue, bValue) => aValue.equalsSelection(bValue));
	}

	private static _rangesEqual(a: readonly Range[], b: readonly Range[]): boolean {
		return equals(a, b, (aValue, bValue) => aValue.equalsRange(bValue));
	}

	private static _optionsEqual(a: IResolvedTextEditorConfiguration, b: IResolvedTextEditorConfiguration): boolean {
		if (a && !b || !a && b) {
			return false;
		}
		if (!a && !b) {
			return true;
		}
		return (
			a.tabSize === b.tabSize
			&& a.indentSize === b.indentSize
			&& a.insertSpaces === b.insertSpaces
			&& a.cursorStyle === b.cursorStyle
			&& a.lineNumbers === b.lineNumbers
		);
	}
}

/**
 * Text Editor that is permanently bound to the same model.
 * It can be bound or not to a CodeEditor.
 */
export class MainThreadTextEditor {

	private readonly _id: string;
	private readonly _model: ITextModel;
	private readonly _mainThreadDocuments: MainThreadDocuments;
	private readonly _modelService: IModelService;
	private readonly _clipboardService: IClipboardService;
	private readonly _modelListeners = new DisposableStore();
	private _codeEditor: ICodeEditor | null;
	private readonly _focusTracker: IFocusTracker;
	private readonly _codeEditorListeners = new DisposableStore();

	private _properties: MainThreadTextEditorProperties | null;
	private readonly _onPropertiesChanged: Emitter<IEditorPropertiesChangeData>;

	constructor(
		id: string,
		model: ITextModel,
		codeEditor: ICodeEditor,
		focusTracker: IFocusTracker,
		mainThreadDocuments: MainThreadDocuments,
		modelService: IModelService,
		clipboardService: IClipboardService,
	) {
		this._id = id;
		this._model = model;
		this._codeEditor = null;
		this._properties = null;
		this._focusTracker = focusTracker;
		this._mainThreadDocuments = mainThreadDocuments;
		this._modelService = modelService;
		this._clipboardService = clipboardService;

		this._onPropertiesChanged = new Emitter<IEditorPropertiesChangeData>();

		this._modelListeners.add(this._model.onDidChangeOptions((e) => {
			this._updatePropertiesNow(null);
		}));

		this.setCodeEditor(codeEditor);
		this._updatePropertiesNow(null);
	}

	public dispose(): void {
		this._modelListeners.dispose();
		this._codeEditor = null;
		this._codeEditorListeners.dispose();
	}

	private _updatePropertiesNow(selectionChangeSource: string | null): void {
		this._setProperties(
			MainThreadTextEditorProperties.readFromEditor(this._properties, this._model, this._codeEditor),
			selectionChangeSource
		);
	}

	private _setProperties(newProperties: MainThreadTextEditorProperties, selectionChangeSource: string | null): void {
		const delta = newProperties.generateDelta(this._properties, selectionChangeSource);
		this._properties = newProperties;
		if (delta) {
			this._onPropertiesChanged.fire(delta);
		}
	}

	public getId(): string {
		return this._id;
	}

	public getModel(): ITextModel {
		return this._model;
	}

	public getCodeEditor(): ICodeEditor | null {
		return this._codeEditor;
	}

	public hasCodeEditor(codeEditor: ICodeEditor | null): boolean {
		return (this._codeEditor === codeEditor);
	}

	public setCodeEditor(codeEditor: ICodeEditor | null): void {
		if (this.hasCodeEditor(codeEditor)) {
			// Nothing to do...
			return;
		}
		this._codeEditorListeners.clear();

		this._codeEditor = codeEditor;
		if (this._codeEditor) {

			// Catch early the case that this code editor gets a different model set and disassociate from this model
			this._codeEditorListeners.add(this._codeEditor.onDidChangeModel(() => {
				this.setCodeEditor(null);
			}));

			this._codeEditorListeners.add(this._codeEditor.onDidFocusEditorWidget(() => {
				this._focusTracker.onGainedFocus();
			}));
			this._codeEditorListeners.add(this._codeEditor.onDidBlurEditorWidget(() => {
				this._focusTracker.onLostFocus();
			}));

			let nextSelectionChangeSource: string | null = null;
			this._codeEditorListeners.add(this._mainThreadDocuments.onIsCaughtUpWithContentChanges((uri) => {
				if (uri.toString() === this._model.uri.toString()) {
					const selectionChangeSource = nextSelectionChangeSource;
					nextSelectionChangeSource = null;
					this._updatePropertiesNow(selectionChangeSource);
				}
			}));

			const isValidCodeEditor = () => {
				// Due to event timings, it is possible that there is a model change event not yet delivered to us.
				// > e.g. a model change event is emitted to a listener which then decides to update editor options
				// > In this case the editor configuration change event reaches us first.
				// So simply check that the model is still attached to this code editor
				return (this._codeEditor && this._codeEditor.getModel() === this._model);
			};

			const updateProperties = (selectionChangeSource: string | null) => {
				// Some editor events get delivered faster than model content changes. This is
				// problematic, as this leads to editor properties reaching the extension host
				// too soon, before the model content change that was the root cause.
				//
				// If this case is identified, then let's update editor properties on the next model
				// content change instead.
				if (this._mainThreadDocuments.isCaughtUpWithContentChanges(this._model.uri)) {
					nextSelectionChangeSource = null;
					this._updatePropertiesNow(selectionChangeSource);
				} else {
					// update editor properties on the next model content change
					nextSelectionChangeSource = selectionChangeSource;
				}
			};

			this._codeEditorListeners.add(this._codeEditor.onDidChangeCursorSelection((e) => {
				// selection
				if (!isValidCodeEditor()) {
					return;
				}
				updateProperties(e.source);
			}));
			this._codeEditorListeners.add(this._codeEditor.onDidChangeConfiguration((e) => {
				// options
				if (!isValidCodeEditor()) {
					return;
				}
				updateProperties(null);
			}));
			this._codeEditorListeners.add(this._codeEditor.onDidLayoutChange(() => {
				// visibleRanges
				if (!isValidCodeEditor()) {
					return;
				}
				updateProperties(null);
			}));
			this._codeEditorListeners.add(this._codeEditor.onDidScrollChange(() => {
				// visibleRanges
				if (!isValidCodeEditor()) {
					return;
				}
				updateProperties(null);
			}));
			this._updatePropertiesNow(null);
		}
	}

	public isVisible(): boolean {
		return !!this._codeEditor;
	}

	public getProperties(): MainThreadTextEditorProperties {
		return this._properties!;
	}

	public get onPropertiesChanged(): Event<IEditorPropertiesChangeData> {
		return this._onPropertiesChanged.event;
	}

	public setSelections(selections: ISelection[]): void {
		if (this._codeEditor) {
			this._codeEditor.setSelections(selections);
			return;
		}

		const newSelections = selections.map(Selection.liftSelection);
		this._setProperties(
			new MainThreadTextEditorProperties(newSelections, this._properties!.options, this._properties!.visibleRanges),
			null
		);
	}

	private _setIndentConfiguration(newConfiguration: ITextEditorConfigurationUpdate): void {
		const creationOpts = this._modelService.getCreationOptions(this._model.getLanguageId(), this._model.uri, this._model.isForSimpleWidget);

		if (newConfiguration.tabSize === 'auto' || newConfiguration.insertSpaces === 'auto') {
			// one of the options was set to 'auto' => detect indentation
			let insertSpaces = creationOpts.insertSpaces;
			let tabSize = creationOpts.tabSize;

			if (newConfiguration.insertSpaces !== 'auto' && typeof newConfiguration.insertSpaces !== 'undefined') {
				insertSpaces = newConfiguration.insertSpaces;
			}

			if (newConfiguration.tabSize !== 'auto' && typeof newConfiguration.tabSize !== 'undefined') {
				tabSize = newConfiguration.tabSize;
			}

			this._model.detectIndentation(insertSpaces, tabSize);
			return;
		}

		const newOpts: ITextModelUpdateOptions = {};
		if (typeof newConfiguration.insertSpaces !== 'undefined') {
			newOpts.insertSpaces = newConfiguration.insertSpaces;
		}
		if (typeof newConfiguration.tabSize !== 'undefined') {
			newOpts.tabSize = newConfiguration.tabSize;
		}
		if (typeof newConfiguration.indentSize !== 'undefined') {
			newOpts.indentSize = newConfiguration.indentSize;
		}
		this._model.updateOptions(newOpts);
	}

	public setConfiguration(newConfiguration: ITextEditorConfigurationUpdate): void {
		this._setIndentConfiguration(newConfiguration);

		if (!this._codeEditor) {
			return;
		}

		if (newConfiguration.cursorStyle) {
			const newCursorStyle = cursorStyleToString(newConfiguration.cursorStyle);
			this._codeEditor.updateOptions({
				cursorStyle: newCursorStyle
			});
		}

		if (typeof newConfiguration.lineNumbers !== 'undefined') {
			let lineNumbers: 'on' | 'off' | 'relative' | 'interval';
			switch (newConfiguration.lineNumbers) {
				case RenderLineNumbersType.On:
					lineNumbers = 'on';
					break;
				case RenderLineNumbersType.Relative:
					lineNumbers = 'relative';
					break;
				case RenderLineNumbersType.Interval:
					lineNumbers = 'interval';
					break;
				default:
					lineNumbers = 'off';
			}
			this._codeEditor.updateOptions({
				lineNumbers: lineNumbers
			});
		}
	}

	public setDecorations(key: string, ranges: IDecorationOptions[]): void {
		if (!this._codeEditor) {
			return;
		}
		this._codeEditor.setDecorationsByType('exthost-api', key, ranges);
	}

	public setDecorationsFast(key: string, _ranges: number[]): void {
		if (!this._codeEditor) {
			return;
		}
		const ranges: Range[] = [];
		for (let i = 0, len = Math.floor(_ranges.length / 4); i < len; i++) {
			ranges[i] = new Range(_ranges[4 * i], _ranges[4 * i + 1], _ranges[4 * i + 2], _ranges[4 * i + 3]);
		}
		this._codeEditor.setDecorationsByTypeFast(key, ranges);
	}

	public revealRange(range: IRange, revealType: TextEditorRevealType): void {
		if (!this._codeEditor) {
			return;
		}
		switch (revealType) {
			case TextEditorRevealType.Default:
				this._codeEditor.revealRange(range, ScrollType.Smooth);
				break;
			case TextEditorRevealType.InCenter:
				this._codeEditor.revealRangeInCenter(range, ScrollType.Smooth);
				break;
			case TextEditorRevealType.InCenterIfOutsideViewport:
				this._codeEditor.revealRangeInCenterIfOutsideViewport(range, ScrollType.Smooth);
				break;
			case TextEditorRevealType.AtTop:
				this._codeEditor.revealRangeAtTop(range, ScrollType.Smooth);
				break;
			default:
				console.warn(`Unknown revealType: ${revealType}`);
				break;
		}
	}

	public isFocused(): boolean {
		if (this._codeEditor) {
			return this._codeEditor.hasTextFocus();
		}
		return false;
	}

	public matches(editor: IEditorPane): boolean {
		if (!editor) {
			return false;
		}
		return editor.getControl() === this._codeEditor;
	}

	public applyEdits(versionIdCheck: number, edits: ISingleEditOperation[], opts: IApplyEditsOptions): boolean {
		if (this._model.getVersionId() !== versionIdCheck) {
			// throw new Error('Model has changed in the meantime!');
			// model changed in the meantime
			return false;
		}

		if (!this._codeEditor) {
			// console.warn('applyEdits on invisible editor');
			return false;
		}

		if (typeof opts.setEndOfLine !== 'undefined') {
			this._model.pushEOL(opts.setEndOfLine);
		}

		const transformedEdits = edits.map((edit): ISingleEditOperation => {
			return {
				range: Range.lift(edit.range),
				text: edit.text,
				forceMoveMarkers: edit.forceMoveMarkers
			};
		});

		if (opts.undoStopBefore) {
			this._codeEditor.pushUndoStop();
		}
		this._codeEditor.executeEdits('MainThreadTextEditor', transformedEdits);
		if (opts.undoStopAfter) {
			this._codeEditor.pushUndoStop();
		}
		return true;
	}

	async insertSnippet(modelVersionId: number, template: string, ranges: readonly IRange[], opts: ISnippetOptions) {

		if (!this._codeEditor || !this._codeEditor.hasModel()) {
			return false;
		}

		// check if clipboard is required and only iff read it (async)
		let clipboardText: string | undefined;
		const needsTemplate = SnippetParser.guessNeedsClipboard(template);
		if (needsTemplate) {
			const state = new EditorState(this._codeEditor, CodeEditorStateFlag.Value | CodeEditorStateFlag.Position);
			clipboardText = await this._clipboardService.readText();
			if (!state.validate(this._codeEditor)) {
				return false;
			}
		}

		if (this._codeEditor.getModel().getVersionId() !== modelVersionId) {
			return false;
		}

		const snippetController = SnippetController2.get(this._codeEditor);
		if (!snippetController) {
			return false;
		}

		this._codeEditor.focus();

		// make modifications as snippet edit
		const edits: ISnippetEdit[] = ranges.map(range => ({ range: Range.lift(range), template }));
		snippetController.apply(edits, {
			overwriteBefore: 0, overwriteAfter: 0,
			undoStopBefore: opts.undoStopBefore, undoStopAfter: opts.undoStopAfter,
			adjustWhitespace: !opts.keepWhitespace,
			clipboardText
		});

		return true;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadEditors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { illegalArgument } from '../../../base/common/errors.js';
import { IDisposable, dispose, DisposableStore, IReference } from '../../../base/common/lifecycle.js';
import { equals as objectEquals } from '../../../base/common/objects.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { ICodeEditorService } from '../../../editor/browser/services/codeEditorService.js';
import { IRange } from '../../../editor/common/core/range.js';
import { ISelection } from '../../../editor/common/core/selection.js';
import { IDecorationOptions, IDecorationRenderOptions } from '../../../editor/common/editorCommon.js';
import { ISingleEditOperation } from '../../../editor/common/core/editOperation.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { ITextEditorOptions, IResourceEditorInput, EditorActivation, EditorResolution, ITextEditorDiffInformation, isTextEditorDiffInformationEqual, ITextEditorChange } from '../../../platform/editor/common/editor.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { MainThreadTextEditor } from './mainThreadEditor.js';
import { ExtHostContext, ExtHostEditorsShape, IApplyEditsOptions, ITextDocumentShowOptions, ITextEditorConfigurationUpdate, ITextEditorPositionData, IUndoStopOptions, MainThreadTextEditorsShape, TextEditorRevealType } from '../common/extHost.protocol.js';
import { editorGroupToColumn, columnToEditorGroup, EditorGroupColumn } from '../../services/editor/common/editorGroupColumn.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IWorkingCopyService } from '../../services/workingCopy/common/workingCopyService.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IChange } from '../../../editor/common/diff/legacyLinesDiffComputer.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IEditorControl } from '../../common/editor.js';
import { getCodeEditor, ICodeEditor } from '../../../editor/browser/editorBrowser.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { IQuickDiffModelService, QuickDiffModel } from '../../contrib/scm/browser/quickDiffModel.js';
import { autorun, constObservable, derived, derivedOpts, IObservable, observableFromEvent } from '../../../base/common/observable.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { isITextModel } from '../../../editor/common/model.js';
import { LineRangeMapping } from '../../../editor/common/diff/rangeMapping.js';
import { equals } from '../../../base/common/arrays.js';
import { DiffAlgorithmName } from '../../../editor/common/services/editorWorker.js';

export interface IMainThreadEditorLocator {
	getEditor(id: string): MainThreadTextEditor | undefined;
	findTextEditorIdFor(editorControl: IEditorControl): string | undefined;
	getIdOfCodeEditor(codeEditor: ICodeEditor): string | undefined;
}

export class MainThreadTextEditors implements MainThreadTextEditorsShape {

	private static INSTANCE_COUNT: number = 0;

	private readonly _instanceId: string;
	private readonly _proxy: ExtHostEditorsShape;
	private readonly _toDispose = new DisposableStore();
	private _textEditorsListenersMap: { [editorId: string]: IDisposable[] };
	private _editorPositionData: ITextEditorPositionData | null;
	private _registeredDecorationTypes: { [decorationType: string]: boolean };

	constructor(
		private readonly _editorLocator: IMainThreadEditorLocator,
		extHostContext: IExtHostContext,
		@ICodeEditorService private readonly _codeEditorService: ICodeEditorService,
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IQuickDiffModelService private readonly _quickDiffModelService: IQuickDiffModelService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService
	) {
		this._instanceId = String(++MainThreadTextEditors.INSTANCE_COUNT);
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostEditors);

		this._textEditorsListenersMap = Object.create(null);
		this._editorPositionData = null;

		this._toDispose.add(this._editorService.onDidVisibleEditorsChange(() => this._updateActiveAndVisibleTextEditors()));
		this._toDispose.add(this._editorGroupService.onDidRemoveGroup(() => this._updateActiveAndVisibleTextEditors()));
		this._toDispose.add(this._editorGroupService.onDidMoveGroup(() => this._updateActiveAndVisibleTextEditors()));

		this._registeredDecorationTypes = Object.create(null);
	}

	dispose(): void {
		Object.keys(this._textEditorsListenersMap).forEach((editorId) => {
			dispose(this._textEditorsListenersMap[editorId]);
		});
		this._textEditorsListenersMap = Object.create(null);
		this._toDispose.dispose();
		for (const decorationType in this._registeredDecorationTypes) {
			this._codeEditorService.removeDecorationType(decorationType);
		}
		this._registeredDecorationTypes = Object.create(null);
	}

	handleTextEditorAdded(textEditor: MainThreadTextEditor): void {
		const id = textEditor.getId();
		const toDispose: IDisposable[] = [];
		toDispose.push(textEditor.onPropertiesChanged((data) => {
			this._proxy.$acceptEditorPropertiesChanged(id, data);
		}));

		const diffInformationObs = this._getTextEditorDiffInformation(textEditor, toDispose);
		toDispose.push(autorun(reader => {
			const diffInformation = diffInformationObs.read(reader);
			this._proxy.$acceptEditorDiffInformation(id, diffInformation);
		}));

		this._textEditorsListenersMap[id] = toDispose;
	}

	handleTextEditorRemoved(id: string): void {
		dispose(this._textEditorsListenersMap[id]);
		delete this._textEditorsListenersMap[id];
	}

	private _updateActiveAndVisibleTextEditors(): void {

		// editor columns
		const editorPositionData = this._getTextEditorPositionData();
		if (!objectEquals(this._editorPositionData, editorPositionData)) {
			this._editorPositionData = editorPositionData;
			this._proxy.$acceptEditorPositionData(this._editorPositionData);
		}
	}

	private _getTextEditorPositionData(): ITextEditorPositionData {
		const result: ITextEditorPositionData = Object.create(null);
		for (const editorPane of this._editorService.visibleEditorPanes) {
			const id = this._editorLocator.findTextEditorIdFor(editorPane);
			if (id) {
				result[id] = editorGroupToColumn(this._editorGroupService, editorPane.group);
			}
		}
		return result;
	}

	private _getTextEditorDiffInformation(textEditor: MainThreadTextEditor, toDispose: IDisposable[]): IObservable<ITextEditorDiffInformation[] | undefined> {
		const codeEditor = textEditor.getCodeEditor();
		if (!codeEditor) {
			return constObservable(undefined);
		}

		// Check if the TextModel belongs to a DiffEditor
		const [diffEditor] = this._codeEditorService.listDiffEditors()
			.filter(d =>
				d.getOriginalEditor().getId() === codeEditor.getId() ||
				d.getModifiedEditor().getId() === codeEditor.getId());

		const editorModelObs = diffEditor
			? observableFromEvent(this, diffEditor.onDidChangeModel, () => diffEditor.getModel())
			: observableFromEvent(this, codeEditor.onDidChangeModel, () => codeEditor.getModel());

		const editorChangesObs = derived<IObservable<{ original: URI; modified: URI; changes: readonly LineRangeMapping[] }[] | undefined>>(reader => {
			const editorModel = editorModelObs.read(reader);
			const editorModelUri = codeEditor.getModel()?.uri;

			if (!editorModel || !editorModelUri) {
				return constObservable(undefined);
			}

			let quickDiffModelRef: IReference<QuickDiffModel> | undefined;
			if (isITextModel(editorModel)) {
				// TextEditor
				quickDiffModelRef = this._quickDiffModelService.createQuickDiffModelReference(editorModelUri);
			} else {
				// DiffEditor - we create a quick diff model (using the diff algorithm used by the diff editor)
				// even for diff editor so that we can provide multiple "original resources" to diff with the original
				// and modified resources.
				const diffAlgorithm = this._configurationService.getValue<DiffAlgorithmName>('diffEditor.diffAlgorithm');
				quickDiffModelRef = this._quickDiffModelService.createQuickDiffModelReference(editorModelUri, { algorithm: diffAlgorithm });
			}

			if (!quickDiffModelRef) {
				return constObservable(undefined);
			}

			toDispose.push(quickDiffModelRef);
			return observableFromEvent(this, quickDiffModelRef.object.onDidChange, () => {
				return quickDiffModelRef.object.getQuickDiffResults()
					.map(result => ({
						original: result.original,
						modified: result.modified,
						changes: result.changes2
					}));
			});
		});

		return derivedOpts({
			owner: this,
			equalsFn: (diff1, diff2) => equals(diff1, diff2, (a, b) => isTextEditorDiffInformationEqual(this._uriIdentityService, a, b))
		}, reader => {
			const editorModel = editorModelObs.read(reader);
			const editorChanges = editorChangesObs.read(reader).read(reader);
			if (!editorModel || !editorChanges) {
				return undefined;
			}

			const documentVersion = isITextModel(editorModel)
				? editorModel.getVersionId()
				: editorModel.modified.getVersionId();

			return editorChanges.map(change => {
				const changes: ITextEditorChange[] = change.changes
					.map(change => [
						change.original.startLineNumber,
						change.original.endLineNumberExclusive,
						change.modified.startLineNumber,
						change.modified.endLineNumberExclusive
					]);

				return {
					documentVersion,
					original: change.original,
					modified: change.modified,
					changes
				};
			});
		});
	}

	// --- from extension host process

	async $tryShowTextDocument(resource: UriComponents, options: ITextDocumentShowOptions): Promise<string | undefined> {
		const uri = URI.revive(resource);

		const editorOptions: ITextEditorOptions = {
			preserveFocus: options.preserveFocus,
			pinned: options.pinned,
			selection: options.selection,
			// preserve pre 1.38 behaviour to not make group active when preserveFocus: true
			// but make sure to restore the editor to fix https://github.com/microsoft/vscode/issues/79633
			activation: options.preserveFocus ? EditorActivation.RESTORE : undefined,
			override: EditorResolution.EXCLUSIVE_ONLY
		};

		const input: IResourceEditorInput = {
			resource: uri,
			options: editorOptions
		};

		const editor = await this._editorService.openEditor(input, columnToEditorGroup(this._editorGroupService, this._configurationService, options.position));
		if (!editor) {
			return undefined;
		}
		// Composite editors are made up of many editors so we return the active one at the time of opening
		const editorControl = editor.getControl();
		const codeEditor = getCodeEditor(editorControl);
		return codeEditor ? this._editorLocator.getIdOfCodeEditor(codeEditor) : undefined;
	}

	async $tryShowEditor(id: string, position?: EditorGroupColumn): Promise<void> {
		const mainThreadEditor = this._editorLocator.getEditor(id);
		if (mainThreadEditor) {
			const model = mainThreadEditor.getModel();
			await this._editorService.openEditor({
				resource: model.uri,
				options: { preserveFocus: false }
			}, columnToEditorGroup(this._editorGroupService, this._configurationService, position));
			return;
		}
	}

	async $tryHideEditor(id: string): Promise<void> {
		const mainThreadEditor = this._editorLocator.getEditor(id);
		if (mainThreadEditor) {
			const editorPanes = this._editorService.visibleEditorPanes;
			for (const editorPane of editorPanes) {
				if (mainThreadEditor.matches(editorPane)) {
					await editorPane.group.closeEditor(editorPane.input);
					return;
				}
			}
		}
	}

	$trySetSelections(id: string, selections: ISelection[]): Promise<void> {
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		editor.setSelections(selections);
		return Promise.resolve(undefined);
	}

	$trySetDecorations(id: string, key: string, ranges: IDecorationOptions[]): Promise<void> {
		key = `${this._instanceId}-${key}`;
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		editor.setDecorations(key, ranges);
		return Promise.resolve(undefined);
	}

	$trySetDecorationsFast(id: string, key: string, ranges: number[]): Promise<void> {
		key = `${this._instanceId}-${key}`;
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		editor.setDecorationsFast(key, ranges);
		return Promise.resolve(undefined);
	}

	$tryRevealRange(id: string, range: IRange, revealType: TextEditorRevealType): Promise<void> {
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		editor.revealRange(range, revealType);
		return Promise.resolve();
	}

	$trySetOptions(id: string, options: ITextEditorConfigurationUpdate): Promise<void> {
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		editor.setConfiguration(options);
		return Promise.resolve(undefined);
	}

	$tryApplyEdits(id: string, modelVersionId: number, edits: ISingleEditOperation[], opts: IApplyEditsOptions): Promise<boolean> {
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		return Promise.resolve(editor.applyEdits(modelVersionId, edits, opts));
	}

	$tryInsertSnippet(id: string, modelVersionId: number, template: string, ranges: readonly IRange[], opts: IUndoStopOptions): Promise<boolean> {
		const editor = this._editorLocator.getEditor(id);
		if (!editor) {
			return Promise.reject(illegalArgument(`TextEditor(${id})`));
		}
		return Promise.resolve(editor.insertSnippet(modelVersionId, template, ranges, opts));
	}

	$registerTextEditorDecorationType(extensionId: ExtensionIdentifier, key: string, options: IDecorationRenderOptions): void {
		key = `${this._instanceId}-${key}`;
		this._registeredDecorationTypes[key] = true;
		this._codeEditorService.registerDecorationType(`exthost-api-${extensionId}`, key, options);
	}

	$removeTextEditorDecorationType(key: string): void {
		key = `${this._instanceId}-${key}`;
		delete this._registeredDecorationTypes[key];
		this._codeEditorService.removeDecorationType(key);
	}

	$getDiffInformation(id: string): Promise<IChange[]> {
		const editor = this._editorLocator.getEditor(id);

		if (!editor) {
			return Promise.reject(new Error('No such TextEditor'));
		}

		const codeEditor = editor.getCodeEditor();
		if (!codeEditor) {
			return Promise.reject(new Error('No such CodeEditor'));
		}

		const codeEditorId = codeEditor.getId();
		const diffEditors = this._codeEditorService.listDiffEditors();
		const [diffEditor] = diffEditors.filter(d => d.getOriginalEditor().getId() === codeEditorId || d.getModifiedEditor().getId() === codeEditorId);

		if (diffEditor) {
			return Promise.resolve(diffEditor.getLineChanges() || []);
		}

		if (!codeEditor.hasModel()) {
			return Promise.resolve([]);
		}

		const quickDiffModelRef = this._quickDiffModelService.createQuickDiffModelReference(codeEditor.getModel().uri);
		if (!quickDiffModelRef) {
			return Promise.resolve([]);
		}

		try {
			const primaryQuickDiff = quickDiffModelRef.object.quickDiffs.find(quickDiff => quickDiff.kind === 'primary');
			const primaryQuickDiffChanges = quickDiffModelRef.object.changes.filter(change => change.providerId === primaryQuickDiff?.id);

			return Promise.resolve(primaryQuickDiffChanges.map(change => change.change) ?? []);
		} finally {
			quickDiffModelRef.dispose();
		}
	}
}

// --- commands

CommandsRegistry.registerCommand('_workbench.revertAllDirty', async function (accessor: ServicesAccessor) {
	const environmentService = accessor.get(IEnvironmentService);
	if (!environmentService.extensionTestsLocationURI) {
		throw new Error('Command is only available when running extension tests.');
	}

	const workingCopyService = accessor.get(IWorkingCopyService);
	for (const workingCopy of workingCopyService.dirtyWorkingCopies) {
		await workingCopy.revert({ soft: true });
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadEditorTabs.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadEditorTabs.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { DisposableMap, DisposableStore } from '../../../base/common/lifecycle.js';
import { isEqual } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { AnyInputDto, ExtHostContext, IEditorTabDto, IEditorTabGroupDto, IExtHostEditorTabsShape, MainContext, MainThreadEditorTabsShape, TabInputKind, TabModelOperationKind, TextDiffInputDto } from '../common/extHost.protocol.js';
import { EditorResourceAccessor, GroupModelChangeKind, SideBySideEditor } from '../../common/editor.js';
import { DiffEditorInput } from '../../common/editor/diffEditorInput.js';
import { isGroupEditorMoveEvent } from '../../common/editor/editorGroupModel.js';
import { EditorInput } from '../../common/editor/editorInput.js';
import { SideBySideEditorInput } from '../../common/editor/sideBySideEditorInput.js';
import { AbstractTextResourceEditorInput } from '../../common/editor/textResourceEditorInput.js';
import { ChatEditorInput } from '../../contrib/chat/browser/chatEditorInput.js';
import { CustomEditorInput } from '../../contrib/customEditor/browser/customEditorInput.js';
import { InteractiveEditorInput } from '../../contrib/interactive/browser/interactiveEditorInput.js';
import { MergeEditorInput } from '../../contrib/mergeEditor/browser/mergeEditorInput.js';
import { MultiDiffEditorInput } from '../../contrib/multiDiffEditor/browser/multiDiffEditorInput.js';
import { NotebookEditorInput } from '../../contrib/notebook/common/notebookEditorInput.js';
import { TerminalEditorInput } from '../../contrib/terminal/browser/terminalEditorInput.js';
import { WebviewInput } from '../../contrib/webviewPanel/browser/webviewEditorInput.js';
import { columnToEditorGroup, EditorGroupColumn, editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { GroupDirection, IEditorGroup, IEditorGroupsService, preferredSideBySideGroupDirection } from '../../services/editor/common/editorGroupsService.js';
import { IEditorsChangeEvent, IEditorService, SIDE_GROUP } from '../../services/editor/common/editorService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

interface TabInfo {
	tab: IEditorTabDto;
	group: IEditorGroup;
	editorInput: EditorInput;
}
@extHostNamedCustomer(MainContext.MainThreadEditorTabs)
export class MainThreadEditorTabs implements MainThreadEditorTabsShape {

	private readonly _dispoables = new DisposableStore();
	private readonly _proxy: IExtHostEditorTabsShape;
	// List of all groups and their corresponding tabs, this is **the** model
	private _tabGroupModel: IEditorTabGroupDto[] = [];
	// Lookup table for finding group by id
	private readonly _groupLookup: Map<number, IEditorTabGroupDto> = new Map();
	// Lookup table for finding tab by id
	private readonly _tabInfoLookup: Map<string, TabInfo> = new Map();
	// Tracks the currently open MultiDiffEditorInputs to listen to resource changes
	private readonly _multiDiffEditorInputListeners: DisposableMap<MultiDiffEditorInput> = new DisposableMap();

	constructor(
		extHostContext: IExtHostContext,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@IEditorService editorService: IEditorService
	) {

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostEditorTabs);

		// Main listener which responds to events from the editor service
		this._dispoables.add(editorService.onDidEditorsChange((event) => {
			try {
				this._updateTabsModel(event);
			} catch {
				this._logService.error('Failed to update model, rebuilding');
				this._createTabsModel();
			}
		}));

		this._dispoables.add(this._multiDiffEditorInputListeners);

		// Structural group changes (add, remove, move, etc) are difficult to patch.
		// Since they happen infrequently we just rebuild the entire model
		this._dispoables.add(this._editorGroupsService.onDidAddGroup(() => this._createTabsModel()));
		this._dispoables.add(this._editorGroupsService.onDidRemoveGroup(() => this._createTabsModel()));

		// Once everything is read go ahead and initialize the model
		this._editorGroupsService.whenReady.then(() => this._createTabsModel());
	}

	dispose(): void {
		this._groupLookup.clear();
		this._tabInfoLookup.clear();
		this._dispoables.dispose();
	}

	/**
	 * Creates a tab object with the correct properties
	 * @param editor The editor input represented by the tab
	 * @param group The group the tab is in
	 * @returns A tab object
	 */
	private _buildTabObject(group: IEditorGroup, editor: EditorInput, editorIndex: number): IEditorTabDto {
		const editorId = editor.editorId;
		const tab: IEditorTabDto = {
			id: this._generateTabId(editor, group.id),
			label: editor.getName(),
			editorId,
			input: this._editorInputToDto(editor),
			isPinned: group.isSticky(editorIndex),
			isPreview: !group.isPinned(editorIndex),
			isActive: group.isActive(editor),
			isDirty: editor.isDirty()
		};
		return tab;
	}

	private _editorInputToDto(editor: EditorInput): AnyInputDto {

		if (editor instanceof MergeEditorInput) {
			return {
				kind: TabInputKind.TextMergeInput,
				base: editor.base,
				input1: editor.input1.uri,
				input2: editor.input2.uri,
				result: editor.resource
			};
		}

		if (editor instanceof AbstractTextResourceEditorInput) {
			return {
				kind: TabInputKind.TextInput,
				uri: editor.resource
			};
		}

		if (editor instanceof SideBySideEditorInput && !(editor instanceof DiffEditorInput)) {
			const primaryResource = editor.primary.resource;
			const secondaryResource = editor.secondary.resource;
			// If side by side editor with same resource on both sides treat it as a singular tab kind
			if (editor.primary instanceof AbstractTextResourceEditorInput
				&& editor.secondary instanceof AbstractTextResourceEditorInput
				&& isEqual(primaryResource, secondaryResource)
				&& primaryResource
				&& secondaryResource
			) {
				return {
					kind: TabInputKind.TextInput,
					uri: primaryResource
				};
			}
			return { kind: TabInputKind.UnknownInput };
		}

		if (editor instanceof NotebookEditorInput) {
			return {
				kind: TabInputKind.NotebookInput,
				notebookType: editor.viewType,
				uri: editor.resource
			};
		}

		if (editor instanceof CustomEditorInput) {
			return {
				kind: TabInputKind.CustomEditorInput,
				viewType: editor.viewType,
				uri: editor.resource,
			};
		}

		if (editor instanceof WebviewInput) {
			return {
				kind: TabInputKind.WebviewEditorInput,
				viewType: editor.viewType
			};
		}

		if (editor instanceof TerminalEditorInput) {
			return {
				kind: TabInputKind.TerminalEditorInput
			};
		}

		if (editor instanceof DiffEditorInput) {
			if (editor.modified instanceof AbstractTextResourceEditorInput && editor.original instanceof AbstractTextResourceEditorInput) {
				return {
					kind: TabInputKind.TextDiffInput,
					modified: editor.modified.resource,
					original: editor.original.resource
				};
			}
			if (editor.modified instanceof NotebookEditorInput && editor.original instanceof NotebookEditorInput) {
				return {
					kind: TabInputKind.NotebookDiffInput,
					notebookType: editor.original.viewType,
					modified: editor.modified.resource,
					original: editor.original.resource
				};
			}
		}

		if (editor instanceof InteractiveEditorInput) {
			return {
				kind: TabInputKind.InteractiveEditorInput,
				uri: editor.resource,
				inputBoxUri: editor.inputResource
			};
		}

		if (editor instanceof ChatEditorInput) {
			return {
				kind: TabInputKind.ChatEditorInput,
			};
		}

		if (editor instanceof MultiDiffEditorInput) {
			const diffEditors: TextDiffInputDto[] = [];
			for (const resource of (editor?.resources.get() ?? [])) {
				if (resource.originalUri && resource.modifiedUri) {
					diffEditors.push({
						kind: TabInputKind.TextDiffInput,
						original: resource.originalUri,
						modified: resource.modifiedUri
					});
				}
			}

			return {
				kind: TabInputKind.MultiDiffEditorInput,
				diffEditors
			};
		}

		return { kind: TabInputKind.UnknownInput };
	}

	/**
	 * Generates a unique id for a tab
	 * @param editor The editor input
	 * @param groupId The group id
	 * @returns A unique identifier for a specific tab
	 */
	private _generateTabId(editor: EditorInput, groupId: number) {
		let resourceString: string | undefined;
		// Properly get the resource and account for side by side editors
		const resource = EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.BOTH });
		if (resource instanceof URI) {
			resourceString = resource.toString();
		} else {
			resourceString = `${resource?.primary?.toString()}-${resource?.secondary?.toString()}`;
		}
		return `${groupId}~${editor.editorId}-${editor.typeId}-${resourceString} `;
	}

	/**
	 * Called whenever a group activates, updates the model by marking the group as active an notifies the extension host
	 */
	private _onDidGroupActivate() {
		const activeGroupId = this._editorGroupsService.activeGroup.id;
		const activeGroup = this._groupLookup.get(activeGroupId);
		if (activeGroup) {
			// Ok not to loop as exthost accepts last active group
			activeGroup.isActive = true;
			this._proxy.$acceptTabGroupUpdate(activeGroup);
		}
	}

	/**
	 * Called when the tab label changes
	 * @param groupId The id of the group the tab exists in
	 * @param editorInput The editor input represented by the tab
	 */
	private _onDidTabLabelChange(groupId: number, editorInput: EditorInput, editorIndex: number) {
		const tabId = this._generateTabId(editorInput, groupId);
		const tabInfo = this._tabInfoLookup.get(tabId);
		// If tab is found patch, else rebuild
		if (tabInfo) {
			tabInfo.tab.label = editorInput.getName();
			this._proxy.$acceptTabOperation({
				groupId,
				index: editorIndex,
				tabDto: tabInfo.tab,
				kind: TabModelOperationKind.TAB_UPDATE
			});
		} else {
			this._logService.error('Invalid model for label change, rebuilding');
			this._createTabsModel();
		}
	}

	/**
	 * Called when a new tab is opened
	 * @param groupId The id of the group the tab is being created in
	 * @param editorInput The editor input being opened
	 * @param editorIndex The index of the editor within that group
	 */
	private _onDidTabOpen(groupId: number, editorInput: EditorInput, editorIndex: number) {
		const group = this._editorGroupsService.getGroup(groupId);
		// Even if the editor service knows about the group the group might not exist yet in our model
		const groupInModel = this._groupLookup.get(groupId) !== undefined;
		// Means a new group was likely created so we rebuild the model
		if (!group || !groupInModel) {
			this._createTabsModel();
			return;
		}
		const tabs = this._groupLookup.get(groupId)?.tabs;
		if (!tabs) {
			return;
		}
		// Splice tab into group at index editorIndex
		const tabObject = this._buildTabObject(group, editorInput, editorIndex);
		tabs.splice(editorIndex, 0, tabObject);
		// Update lookup
		const tabId = this._generateTabId(editorInput, groupId);
		this._tabInfoLookup.set(tabId, { group, editorInput, tab: tabObject });

		if (editorInput instanceof MultiDiffEditorInput) {
			this._multiDiffEditorInputListeners.set(editorInput, Event.fromObservableLight(editorInput.resources)(() => {
				const tabInfo = this._tabInfoLookup.get(tabId);
				if (!tabInfo) {
					return;
				}
				tabInfo.tab = this._buildTabObject(group, editorInput, editorIndex);
				this._proxy.$acceptTabOperation({
					groupId,
					index: editorIndex,
					tabDto: tabInfo.tab,
					kind: TabModelOperationKind.TAB_UPDATE
				});
			}));
		}

		this._proxy.$acceptTabOperation({
			groupId,
			index: editorIndex,
			tabDto: tabObject,
			kind: TabModelOperationKind.TAB_OPEN
		});
	}

	/**
	 * Called when a tab is closed
	 * @param groupId The id of the group the tab is being removed from
	 * @param editorIndex The index of the editor within that group
	 */
	private _onDidTabClose(groupId: number, editorIndex: number) {
		const group = this._editorGroupsService.getGroup(groupId);
		const tabs = this._groupLookup.get(groupId)?.tabs;
		// Something is wrong with the model state so we rebuild
		if (!group || !tabs) {
			this._createTabsModel();
			return;
		}
		// Splice tab into group at index editorIndex
		const removedTab = tabs.splice(editorIndex, 1);

		// Index must no longer be valid so we return prematurely
		if (removedTab.length === 0) {
			return;
		}

		// Update lookup
		this._tabInfoLookup.delete(removedTab[0]?.id ?? '');

		if (removedTab[0]?.input instanceof MultiDiffEditorInput) {
			this._multiDiffEditorInputListeners.deleteAndDispose(removedTab[0]?.input);
		}

		this._proxy.$acceptTabOperation({
			groupId,
			index: editorIndex,
			tabDto: removedTab[0],
			kind: TabModelOperationKind.TAB_CLOSE
		});
	}

	/**
	 * Called when the active tab changes
	 * @param groupId The id of the group the tab is contained in
	 * @param editorIndex The index of the tab
	 */
	private _onDidTabActiveChange(groupId: number, editorIndex: number) {
		// TODO @lramos15 use the tab lookup here if possible. Do we have an editor input?!
		const tabs = this._groupLookup.get(groupId)?.tabs;
		if (!tabs) {
			return;
		}
		const activeTab = tabs[editorIndex];
		// No need to loop over as the exthost uses the most recently marked active tab
		activeTab.isActive = true;
		// Send DTO update to the exthost
		this._proxy.$acceptTabOperation({
			groupId,
			index: editorIndex,
			tabDto: activeTab,
			kind: TabModelOperationKind.TAB_UPDATE
		});

	}

	/**
	 * Called when the dirty indicator on the tab changes
	 * @param groupId The id of the group the tab is in
	 * @param editorIndex The index of the tab
	 * @param editor The editor input represented by the tab
	 */
	private _onDidTabDirty(groupId: number, editorIndex: number, editor: EditorInput) {
		const tabId = this._generateTabId(editor, groupId);
		const tabInfo = this._tabInfoLookup.get(tabId);
		// Something wrong with the model state so we rebuild
		if (!tabInfo) {
			this._logService.error('Invalid model for dirty change, rebuilding');
			this._createTabsModel();
			return;
		}
		tabInfo.tab.isDirty = editor.isDirty();
		this._proxy.$acceptTabOperation({
			groupId,
			index: editorIndex,
			tabDto: tabInfo.tab,
			kind: TabModelOperationKind.TAB_UPDATE
		});
	}

	/**
	 * Called when the tab is pinned/unpinned
	 * @param groupId The id of the group the tab is in
	 * @param editorIndex The index of the tab
	 * @param editor The editor input represented by the tab
	 */
	private _onDidTabPinChange(groupId: number, editorIndex: number, editor: EditorInput) {
		const tabId = this._generateTabId(editor, groupId);
		const tabInfo = this._tabInfoLookup.get(tabId);
		const group = tabInfo?.group;
		const tab = tabInfo?.tab;
		// Something wrong with the model state so we rebuild
		if (!group || !tab) {
			this._logService.error('Invalid model for sticky change, rebuilding');
			this._createTabsModel();
			return;
		}
		// Whether or not the tab has the pin icon (internally it's called sticky)
		tab.isPinned = group.isSticky(editorIndex);
		this._proxy.$acceptTabOperation({
			groupId,
			index: editorIndex,
			tabDto: tab,
			kind: TabModelOperationKind.TAB_UPDATE
		});
	}

	/**
 * Called when the tab is preview / unpreviewed
 * @param groupId The id of the group the tab is in
 * @param editorIndex The index of the tab
 * @param editor The editor input represented by the tab
 */
	private _onDidTabPreviewChange(groupId: number, editorIndex: number, editor: EditorInput) {
		const tabId = this._generateTabId(editor, groupId);
		const tabInfo = this._tabInfoLookup.get(tabId);
		const group = tabInfo?.group;
		const tab = tabInfo?.tab;
		// Something wrong with the model state so we rebuild
		if (!group || !tab) {
			this._logService.error('Invalid model for sticky change, rebuilding');
			this._createTabsModel();
			return;
		}
		// Whether or not the tab has the pin icon (internally it's called pinned)
		tab.isPreview = !group.isPinned(editorIndex);
		this._proxy.$acceptTabOperation({
			kind: TabModelOperationKind.TAB_UPDATE,
			groupId,
			tabDto: tab,
			index: editorIndex
		});
	}

	private _onDidTabMove(groupId: number, editorIndex: number, oldEditorIndex: number, editor: EditorInput) {
		const tabs = this._groupLookup.get(groupId)?.tabs;
		// Something wrong with the model state so we rebuild
		if (!tabs) {
			this._logService.error('Invalid model for move change, rebuilding');
			this._createTabsModel();
			return;
		}

		// Move tab from old index to new index
		const removedTab = tabs.splice(oldEditorIndex, 1);
		if (removedTab.length === 0) {
			return;
		}
		tabs.splice(editorIndex, 0, removedTab[0]);

		// Notify exthost of move
		this._proxy.$acceptTabOperation({
			kind: TabModelOperationKind.TAB_MOVE,
			groupId,
			tabDto: removedTab[0],
			index: editorIndex,
			oldIndex: oldEditorIndex
		});
	}

	/**
	 * Builds the model from scratch based on the current state of the editor service.
	 */
	private _createTabsModel(): void {
		if (this._editorGroupsService.groups.length === 0) {
			return; // skip this invalid state, it may happen when the entire editor area is transitioning to other state ("editor working sets")
		}

		this._tabGroupModel = [];
		this._groupLookup.clear();
		this._tabInfoLookup.clear();
		let tabs: IEditorTabDto[] = [];
		for (const group of this._editorGroupsService.groups) {
			const currentTabGroupModel: IEditorTabGroupDto = {
				groupId: group.id,
				isActive: group.id === this._editorGroupsService.activeGroup.id,
				viewColumn: editorGroupToColumn(this._editorGroupsService, group),
				tabs: []
			};
			group.editors.forEach((editor, editorIndex) => {
				const tab = this._buildTabObject(group, editor, editorIndex);
				tabs.push(tab);
				// Add information about the tab to the lookup
				this._tabInfoLookup.set(this._generateTabId(editor, group.id), {
					group,
					tab,
					editorInput: editor
				});
			});
			currentTabGroupModel.tabs = tabs;
			this._tabGroupModel.push(currentTabGroupModel);
			this._groupLookup.set(group.id, currentTabGroupModel);
			tabs = [];
		}
		// notify the ext host of the new model
		this._proxy.$acceptEditorTabModel(this._tabGroupModel);
	}

	// TODOD @lramos15 Remove this after done finishing the tab model code
	// private _eventToString(event: IEditorsChangeEvent | IEditorsMoveEvent): string {
	// 	let eventString = '';
	// 	switch (event.kind) {
	// 		case GroupModelChangeKind.GROUP_INDEX: eventString += 'GROUP_INDEX'; break;
	// 		case GroupModelChangeKind.EDITOR_ACTIVE: eventString += 'EDITOR_ACTIVE'; break;
	// 		case GroupModelChangeKind.EDITOR_PIN: eventString += 'EDITOR_PIN'; break;
	// 		case GroupModelChangeKind.EDITOR_OPEN: eventString += 'EDITOR_OPEN'; break;
	// 		case GroupModelChangeKind.EDITOR_CLOSE: eventString += 'EDITOR_CLOSE'; break;
	// 		case GroupModelChangeKind.EDITOR_MOVE: eventString += 'EDITOR_MOVE'; break;
	// 		case GroupModelChangeKind.EDITOR_LABEL: eventString += 'EDITOR_LABEL'; break;
	// 		case GroupModelChangeKind.GROUP_ACTIVE: eventString += 'GROUP_ACTIVE'; break;
	// 		case GroupModelChangeKind.GROUP_LOCKED: eventString += 'GROUP_LOCKED'; break;
	// 		case GroupModelChangeKind.EDITOR_DIRTY: eventString += 'EDITOR_DIRTY'; break;
	// 		case GroupModelChangeKind.EDITOR_STICKY: eventString += 'EDITOR_STICKY'; break;
	// 		default: eventString += `UNKNOWN: ${event.kind}`; break;
	// 	}
	// 	return eventString;
	// }

	/**
	 * The main handler for the tab events
	 * @param events The list of events to process
	 */
	private _updateTabsModel(changeEvent: IEditorsChangeEvent): void {
		const event = changeEvent.event;
		const groupId = changeEvent.groupId;
		switch (event.kind) {
			case GroupModelChangeKind.GROUP_ACTIVE:
				if (groupId === this._editorGroupsService.activeGroup.id) {
					this._onDidGroupActivate();
					break;
				} else {
					return;
				}
			case GroupModelChangeKind.EDITOR_LABEL:
				if (event.editor !== undefined && event.editorIndex !== undefined) {
					this._onDidTabLabelChange(groupId, event.editor, event.editorIndex);
					break;
				}
			case GroupModelChangeKind.EDITOR_OPEN:
				if (event.editor !== undefined && event.editorIndex !== undefined) {
					this._onDidTabOpen(groupId, event.editor, event.editorIndex);
					break;
				}
			case GroupModelChangeKind.EDITOR_CLOSE:
				if (event.editorIndex !== undefined) {
					this._onDidTabClose(groupId, event.editorIndex);
					break;
				}
			case GroupModelChangeKind.EDITOR_ACTIVE:
				if (event.editorIndex !== undefined) {
					this._onDidTabActiveChange(groupId, event.editorIndex);
					break;
				}
			case GroupModelChangeKind.EDITOR_DIRTY:
				if (event.editorIndex !== undefined && event.editor !== undefined) {
					this._onDidTabDirty(groupId, event.editorIndex, event.editor);
					break;
				}
			case GroupModelChangeKind.EDITOR_STICKY:
				if (event.editorIndex !== undefined && event.editor !== undefined) {
					this._onDidTabPinChange(groupId, event.editorIndex, event.editor);
					break;
				}
			case GroupModelChangeKind.EDITOR_PIN:
				if (event.editorIndex !== undefined && event.editor !== undefined) {
					this._onDidTabPreviewChange(groupId, event.editorIndex, event.editor);
					break;
				}
			case GroupModelChangeKind.EDITOR_TRANSIENT:
				// Currently not exposed in the API
				break;
			case GroupModelChangeKind.EDITOR_MOVE:
				if (isGroupEditorMoveEvent(event) && event.editor && event.editorIndex !== undefined && event.oldEditorIndex !== undefined) {
					this._onDidTabMove(groupId, event.editorIndex, event.oldEditorIndex, event.editor);
					break;
				}
			default:
				// If it's not an optimized case we rebuild the tabs model from scratch
				this._createTabsModel();
		}
	}
	//#region Messages received from Ext Host
	$moveTab(tabId: string, index: number, viewColumn: EditorGroupColumn, preserveFocus?: boolean): void {
		const groupId = columnToEditorGroup(this._editorGroupsService, this._configurationService, viewColumn);
		const tabInfo = this._tabInfoLookup.get(tabId);
		const tab = tabInfo?.tab;
		if (!tab) {
			throw new Error(`Attempted to close tab with id ${tabId} which does not exist`);
		}
		let targetGroup: IEditorGroup | undefined;
		const sourceGroup = this._editorGroupsService.getGroup(tabInfo.group.id);
		if (!sourceGroup) {
			return;
		}
		// If group index is out of bounds then we make a new one that's to the right of the last group
		if (this._groupLookup.get(groupId) === undefined) {
			let direction = GroupDirection.RIGHT;
			// Make sure we respect the user's preferred side direction
			if (viewColumn === SIDE_GROUP) {
				direction = preferredSideBySideGroupDirection(this._configurationService);
			}
			targetGroup = this._editorGroupsService.addGroup(this._editorGroupsService.groups[this._editorGroupsService.groups.length - 1], direction);
		} else {
			targetGroup = this._editorGroupsService.getGroup(groupId);
		}
		if (!targetGroup) {
			return;
		}

		// Similar logic to if index is out of bounds we place it at the end
		if (index < 0 || index > targetGroup.editors.length) {
			index = targetGroup.editors.length;
		}
		// Find the correct EditorInput using the tab info
		const editorInput = tabInfo?.editorInput;
		if (!editorInput) {
			return;
		}
		// Move the editor to the target group
		sourceGroup.moveEditor(editorInput, targetGroup, { index, preserveFocus });
		return;
	}

	async $closeTab(tabIds: string[], preserveFocus?: boolean): Promise<boolean> {
		const groups: Map<IEditorGroup, EditorInput[]> = new Map();
		for (const tabId of tabIds) {
			const tabInfo = this._tabInfoLookup.get(tabId);
			const tab = tabInfo?.tab;
			const group = tabInfo?.group;
			const editorTab = tabInfo?.editorInput;
			// If not found skip
			if (!group || !tab || !tabInfo || !editorTab) {
				continue;
			}
			const groupEditors = groups.get(group);
			if (!groupEditors) {
				groups.set(group, [editorTab]);
			} else {
				groupEditors.push(editorTab);
			}
		}
		// Loop over keys of the groups map and call closeEditors
		const results: boolean[] = [];
		for (const [group, editors] of groups) {
			results.push(await group.closeEditors(editors, { preserveFocus }));
		}
		// TODO @jrieken This isn't quite right how can we say true for some but not others?
		return results.every(result => result);
	}

	async $closeGroup(groupIds: number[], preserveFocus?: boolean): Promise<boolean> {
		const groupCloseResults: boolean[] = [];
		for (const groupId of groupIds) {
			const group = this._editorGroupsService.getGroup(groupId);
			if (group) {
				groupCloseResults.push(await group.closeAllEditors());
				// Make sure group is empty but still there before removing it
				if (group.count === 0 && this._editorGroupsService.getGroup(group.id)) {
					this._editorGroupsService.removeGroup(group);
				}
			}
		}
		return groupCloseResults.every(result => result);
	}
	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadEditSessionIdentityParticipant.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadEditSessionIdentityParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { localize } from '../../../nls.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { raceCancellationError } from '../../../base/common/async.js';
import { IEditSessionIdentityCreateParticipant, IEditSessionIdentityService } from '../../../platform/workspace/common/editSessions.js';
import { ExtHostContext, ExtHostWorkspaceShape } from '../common/extHost.protocol.js';
import { WorkspaceFolder } from '../../../platform/workspace/common/workspace.js';

class ExtHostEditSessionIdentityCreateParticipant implements IEditSessionIdentityCreateParticipant {

	private readonly _proxy: ExtHostWorkspaceShape;
	private readonly timeout = 20000;

	constructor(extHostContext: IExtHostContext) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostWorkspace);
	}

	async participate(workspaceFolder: WorkspaceFolder, token: CancellationToken): Promise<void> {
		const p = new Promise<void>((resolve, reject) => {

			setTimeout(
				() => reject(new Error(localize('timeout.onWillCreateEditSessionIdentity', "Aborted onWillCreateEditSessionIdentity-event after 10000ms"))),
				this.timeout
			);
			this._proxy.$onWillCreateEditSessionIdentity(workspaceFolder.uri, token, this.timeout).then(resolve, reject);
		});

		return raceCancellationError(p, token);
	}
}

@extHostCustomer
export class EditSessionIdentityCreateParticipant {

	private _saveParticipantDisposable: IDisposable;

	constructor(
		extHostContext: IExtHostContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditSessionIdentityService private readonly _editSessionIdentityService: IEditSessionIdentityService
	) {
		this._saveParticipantDisposable = this._editSessionIdentityService.addEditSessionIdentityCreateParticipant(instantiationService.createInstance(ExtHostEditSessionIdentityCreateParticipant, extHostContext));
	}

	dispose(): void {
		this._saveParticipantDisposable.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadEmbeddings.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadEmbeddings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { DisposableMap, DisposableStore, IDisposable } from '../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../platform/instantiation/common/instantiation.js';
import { ExtHostContext, ExtHostEmbeddingsShape, MainContext, MainThreadEmbeddingsShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';


interface IEmbeddingsProvider {
	provideEmbeddings(input: string[], token: CancellationToken): Promise<{ values: number[] }[]>;
}

const IEmbeddingsService = createDecorator<IEmbeddingsService>('embeddingsService');

interface IEmbeddingsService {

	_serviceBrand: undefined;

	readonly onDidChange: Event<void>;

	allProviders: Iterable<string>;

	registerProvider(id: string, provider: IEmbeddingsProvider): IDisposable;

	computeEmbeddings(id: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]>;
}

class EmbeddingsService implements IEmbeddingsService {
	_serviceBrand: undefined;

	private providers: Map<string, IEmbeddingsProvider>;

	private readonly _onDidChange = new Emitter<void>();
	readonly onDidChange: Event<void> = this._onDidChange.event;

	constructor() {
		this.providers = new Map<string, IEmbeddingsProvider>();
	}

	get allProviders(): Iterable<string> {
		return this.providers.keys();
	}

	registerProvider(id: string, provider: IEmbeddingsProvider): IDisposable {
		this.providers.set(id, provider);
		this._onDidChange.fire();
		return {
			dispose: () => {
				this.providers.delete(id);
				this._onDidChange.fire();
			}
		};
	}

	computeEmbeddings(id: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		const provider = this.providers.get(id);
		if (provider) {
			return provider.provideEmbeddings(input, token);
		} else {
			return Promise.reject(new Error(`No embeddings provider registered with id: ${id}`));
		}
	}
}


registerSingleton(IEmbeddingsService, EmbeddingsService, InstantiationType.Delayed);

@extHostNamedCustomer(MainContext.MainThreadEmbeddings)
export class MainThreadEmbeddings implements MainThreadEmbeddingsShape {

	private readonly _store = new DisposableStore();
	private readonly _providers = this._store.add(new DisposableMap<number>);
	private readonly _proxy: ExtHostEmbeddingsShape;

	constructor(
		context: IExtHostContext,
		@IEmbeddingsService private readonly embeddingsService: IEmbeddingsService
	) {
		this._proxy = context.getProxy(ExtHostContext.ExtHostEmbeddings);

		this._store.add(embeddingsService.onDidChange((() => {
			this._proxy.$acceptEmbeddingModels(Array.from(embeddingsService.allProviders));
		})));
	}

	dispose(): void {
		this._store.dispose();
	}

	$registerEmbeddingProvider(handle: number, identifier: string): void {
		const registration = this.embeddingsService.registerProvider(identifier, {
			provideEmbeddings: (input: string[], token: CancellationToken): Promise<{ values: number[] }[]> => {
				return this._proxy.$provideEmbeddings(handle, input, token);
			}
		});
		this._providers.set(handle, registration);
	}

	$unregisterEmbeddingProvider(handle: number): void {
		this._providers.deleteAndDispose(handle);
	}

	$computeEmbeddings(embeddingsModel: string, input: string[], token: CancellationToken): Promise<{ values: number[] }[]> {
		return this.embeddingsService.computeEmbeddings(embeddingsModel, input, token);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadErrors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadErrors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SerializedError, onUnexpectedError, transformErrorFromSerialization } from '../../../base/common/errors.js';
import { extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { MainContext, MainThreadErrorsShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadErrors)
export class MainThreadErrors implements MainThreadErrorsShape {

	dispose(): void {
		//
	}

	$onUnexpectedError(err: unknown | SerializedError): void {
		if ((err as SerializedError | undefined)?.$isError) {
			err = transformErrorFromSerialization(err as SerializedError);
		}
		onUnexpectedError(err);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadExtensionService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toAction } from '../../../base/common/actions.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { SerializedError, transformErrorFromSerialization } from '../../../base/common/errors.js';
import { FileAccess } from '../../../base/common/network.js';
import Severity from '../../../base/common/severity.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ILocalExtension } from '../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../platform/extensions/common/extensions.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IRemoteConnectionData, ManagedRemoteConnection, RemoteConnection, RemoteConnectionType, ResolvedAuthority, WebSocketRemoteConnection } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { ExtHostContext, ExtHostExtensionServiceShape, MainContext, MainThreadExtensionServiceShape } from '../common/extHost.protocol.js';
import { IExtension, IExtensionsWorkbenchService } from '../../contrib/extensions/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../services/environment/common/environmentService.js';
import { EnablementState, IWorkbenchExtensionEnablementService } from '../../services/extensionManagement/common/extensionManagement.js';
import { ExtensionHostKind } from '../../services/extensions/common/extensionHostKind.js';
import { IExtensionDescriptionDelta } from '../../services/extensions/common/extensionHostProtocol.js';
import { IExtensionHostProxy, IResolveAuthorityResult } from '../../services/extensions/common/extensionHostProxy.js';
import { ActivationKind, ExtensionActivationReason, IExtensionService, IInternalExtensionService, MissingExtensionDependency } from '../../services/extensions/common/extensions.js';
import { extHostNamedCustomer, IExtHostContext, IInternalExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { Dto } from '../../services/extensions/common/proxyIdentifier.js';
import { IHostService } from '../../services/host/browser/host.js';
import { ITimerService } from '../../services/timer/browser/timerService.js';

@extHostNamedCustomer(MainContext.MainThreadExtensionService)
export class MainThreadExtensionService implements MainThreadExtensionServiceShape {

	private readonly _extensionHostKind: ExtensionHostKind;
	private readonly _internalExtensionService: IInternalExtensionService;

	constructor(
		extHostContext: IExtHostContext,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@INotificationService private readonly _notificationService: INotificationService,
		@IExtensionsWorkbenchService private readonly _extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IHostService private readonly _hostService: IHostService,
		@IWorkbenchExtensionEnablementService private readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@ITimerService private readonly _timerService: ITimerService,
		@ICommandService private readonly _commandService: ICommandService,
		@IWorkbenchEnvironmentService protected readonly _environmentService: IWorkbenchEnvironmentService,
	) {
		this._extensionHostKind = extHostContext.extensionHostKind;

		const internalExtHostContext = (<IInternalExtHostContext>extHostContext);
		this._internalExtensionService = internalExtHostContext.internalExtensionService;
		internalExtHostContext._setExtensionHostProxy(
			new ExtensionHostProxy(extHostContext.getProxy(ExtHostContext.ExtHostExtensionService))
		);
		// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
		internalExtHostContext._setAllMainProxyIdentifiers(Object.keys(MainContext).map((key) => (<any>MainContext)[key]));
	}

	public dispose(): void {
	}

	$getExtension(extensionId: string) {
		return this._extensionService.getExtension(extensionId);
	}
	$activateExtension(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		return this._internalExtensionService._activateById(extensionId, reason);
	}
	async $onWillActivateExtension(extensionId: ExtensionIdentifier): Promise<void> {
		this._internalExtensionService._onWillActivateExtension(extensionId);
	}
	$onDidActivateExtension(extensionId: ExtensionIdentifier, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason): void {
		this._internalExtensionService._onDidActivateExtension(extensionId, codeLoadingTime, activateCallTime, activateResolvedTime, activationReason);
	}
	$onExtensionRuntimeError(extensionId: ExtensionIdentifier, data: SerializedError): void {
		const error = transformErrorFromSerialization(data);
		this._internalExtensionService._onExtensionRuntimeError(extensionId, error);
		console.error(`[${extensionId.value}]${error.message}`);
		console.error(error.stack);
	}
	async $onExtensionActivationError(extensionId: ExtensionIdentifier, data: SerializedError, missingExtensionDependency: MissingExtensionDependency | null): Promise<void> {
		const error = transformErrorFromSerialization(data);

		this._internalExtensionService._onDidActivateExtensionError(extensionId, error);

		if (missingExtensionDependency) {
			const extension = await this._extensionService.getExtension(extensionId.value);
			if (extension) {
				const local = await this._extensionsWorkbenchService.queryLocal();
				const installedDependency = local.find(i => areSameExtensions(i.identifier, { id: missingExtensionDependency.dependency }));
				if (installedDependency?.local) {
					await this._handleMissingInstalledDependency(extension, installedDependency.local);
					return;
				} else {
					await this._handleMissingNotInstalledDependency(extension, missingExtensionDependency.dependency);
					return;
				}
			}
		}

		const isDev = !this._environmentService.isBuilt || this._environmentService.isExtensionDevelopment;
		if (isDev) {
			this._notificationService.error(error);
			return;
		}

		console.error(error.message);
	}

	private async _handleMissingInstalledDependency(extension: IExtensionDescription, missingInstalledDependency: ILocalExtension): Promise<void> {
		const extName = extension.displayName || extension.name;
		if (this._extensionEnablementService.isEnabled(missingInstalledDependency)) {
			this._notificationService.notify({
				severity: Severity.Error,
				message: localize('reload window', "Cannot activate the '{0}' extension because it depends on the '{1}' extension, which is not loaded. Would you like to reload the window to load the extension?", extName, missingInstalledDependency.manifest.displayName || missingInstalledDependency.manifest.name),
				actions: {
					primary: [toAction({ id: 'reload', label: localize('reload', "Reload Window"), run: () => this._hostService.reload() })]
				}
			});
		} else {
			const enablementState = this._extensionEnablementService.getEnablementState(missingInstalledDependency);
			if (enablementState === EnablementState.DisabledByVirtualWorkspace) {
				this._notificationService.notify({
					severity: Severity.Error,
					message: localize('notSupportedInWorkspace', "Cannot activate the '{0}' extension because it depends on the '{1}' extension which is not supported in the current workspace", extName, missingInstalledDependency.manifest.displayName || missingInstalledDependency.manifest.name),
				});
			} else if (enablementState === EnablementState.DisabledByTrustRequirement) {
				this._notificationService.notify({
					severity: Severity.Error,
					message: localize('restrictedMode', "Cannot activate the '{0}' extension because it depends on the '{1}' extension which is not supported in Restricted Mode", extName, missingInstalledDependency.manifest.displayName || missingInstalledDependency.manifest.name),
					actions: {
						primary: [toAction({ id: 'manageWorkspaceTrust', label: localize('manageWorkspaceTrust', "Manage Workspace Trust"), run: () => this._commandService.executeCommand('workbench.trust.manage') })]
					}
				});
			} else if (this._extensionEnablementService.canChangeEnablement(missingInstalledDependency)) {
				this._notificationService.notify({
					severity: Severity.Error,
					message: localize('disabledDep', "Cannot activate the '{0}' extension because it depends on the '{1}' extension which is disabled. Would you like to enable the extension and reload the window?", extName, missingInstalledDependency.manifest.displayName || missingInstalledDependency.manifest.name),
					actions: {
						primary: [toAction({
							id: 'enable', label: localize('enable dep', "Enable and Reload"), enabled: true,
							run: () => this._extensionEnablementService.setEnablement([missingInstalledDependency], enablementState === EnablementState.DisabledGlobally ? EnablementState.EnabledGlobally : EnablementState.EnabledWorkspace)
								.then(() => this._hostService.reload(), e => this._notificationService.error(e))
						})]
					}
				});
			} else {
				this._notificationService.notify({
					severity: Severity.Error,
					message: localize('disabledDepNoAction', "Cannot activate the '{0}' extension because it depends on the '{1}' extension which is disabled.", extName, missingInstalledDependency.manifest.displayName || missingInstalledDependency.manifest.name),
				});
			}
		}
	}

	private async _handleMissingNotInstalledDependency(extension: IExtensionDescription, missingDependency: string): Promise<void> {
		const extName = extension.displayName || extension.name;
		let dependencyExtension: IExtension | null = null;
		try {
			dependencyExtension = (await this._extensionsWorkbenchService.getExtensions([{ id: missingDependency }], CancellationToken.None))[0];
		} catch (err) {
		}
		if (dependencyExtension) {
			this._notificationService.notify({
				severity: Severity.Error,
				message: localize('uninstalledDep', "Cannot activate the '{0}' extension because it depends on the '{1}' extension from '{2}', which is not installed. Would you like to install the extension and reload the window?", extName, dependencyExtension.displayName, dependencyExtension.publisherDisplayName),
				actions: {
					primary: [toAction({
						id: 'install',
						label: localize('install missing dep', "Install and Reload"),
						run: () => this._extensionsWorkbenchService.install(dependencyExtension)
							.then(() => this._hostService.reload(), e => this._notificationService.error(e))
					})]
				}
			});
		} else {
			this._notificationService.error(localize('unknownDep', "Cannot activate the '{0}' extension because it depends on an unknown '{1}' extension.", extName, missingDependency));
		}
	}

	async $setPerformanceMarks(marks: PerformanceMark[]): Promise<void> {
		if (this._extensionHostKind === ExtensionHostKind.LocalProcess) {
			this._timerService.setPerformanceMarks('localExtHost', marks);
		} else if (this._extensionHostKind === ExtensionHostKind.LocalWebWorker) {
			this._timerService.setPerformanceMarks('workerExtHost', marks);
		} else {
			this._timerService.setPerformanceMarks('remoteExtHost', marks);
		}
	}

	async $asBrowserUri(uri: UriComponents): Promise<UriComponents> {
		return FileAccess.uriToBrowserUri(URI.revive(uri));
	}
}

class ExtensionHostProxy implements IExtensionHostProxy {
	constructor(
		private readonly _actual: ExtHostExtensionServiceShape
	) { }

	async resolveAuthority(remoteAuthority: string, resolveAttempt: number): Promise<IResolveAuthorityResult> {
		const resolved = reviveResolveAuthorityResult(await this._actual.$resolveAuthority(remoteAuthority, resolveAttempt));
		return resolved;
	}
	async getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI | null> {
		const uriComponents = await this._actual.$getCanonicalURI(remoteAuthority, uri);
		return (uriComponents ? URI.revive(uriComponents) : uriComponents);
	}
	startExtensionHost(extensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		return this._actual.$startExtensionHost(extensionsDelta);
	}
	extensionTestsExecute(): Promise<number> {
		return this._actual.$extensionTestsExecute();
	}
	activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		return this._actual.$activateByEvent(activationEvent, activationKind);
	}
	activate(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean> {
		return this._actual.$activate(extensionId, reason);
	}
	setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void> {
		return this._actual.$setRemoteEnvironment(env);
	}
	updateRemoteConnectionData(connectionData: IRemoteConnectionData): Promise<void> {
		return this._actual.$updateRemoteConnectionData(connectionData);
	}
	deltaExtensions(extensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		return this._actual.$deltaExtensions(extensionsDelta);
	}
	test_latency(n: number): Promise<number> {
		return this._actual.$test_latency(n);
	}
	test_up(b: VSBuffer): Promise<number> {
		return this._actual.$test_up(b);
	}
	test_down(size: number): Promise<VSBuffer> {
		return this._actual.$test_down(size);
	}
}

function reviveResolveAuthorityResult(result: Dto<IResolveAuthorityResult>): IResolveAuthorityResult {
	if (result.type === 'ok') {
		return {
			type: 'ok',
			value: {
				...result.value,
				authority: reviveResolvedAuthority(result.value.authority),
			}
		};
	} else {
		return result;
	}
}

function reviveResolvedAuthority(resolvedAuthority: Dto<ResolvedAuthority>): ResolvedAuthority {
	return {
		...resolvedAuthority,
		connectTo: reviveConnection(resolvedAuthority.connectTo),
	};
}

function reviveConnection(connection: Dto<RemoteConnection>): RemoteConnection {
	if (connection.type === RemoteConnectionType.WebSocket) {
		return new WebSocketRemoteConnection(connection.host, connection.port);
	}
	return new ManagedRemoteConnection(connection.id);
}
```

--------------------------------------------------------------------------------

````
