---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 422
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 422 of 552)

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

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../nls.js';
import { toAction } from '../../../../../base/common/actions.js';
import { createErrorWithActions } from '../../../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import * as glob from '../../../../../base/common/glob.js';
import { Iterable } from '../../../../../base/common/iterator.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { Schemas } from '../../../../../base/common/network.js';
import { basename, isEqual } from '../../../../../base/common/resources.js';
import { isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { IAccessibilityService } from '../../../../../platform/accessibility/common/accessibility.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IResourceEditorInput } from '../../../../../platform/editor/common/editor.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { Memento } from '../../../../common/memento.js';
import { INotebookEditorContribution, notebookPreloadExtensionPoint, notebookRendererExtensionPoint, notebooksExtensionPoint } from '../notebookExtensionPoint.js';
import { INotebookEditorOptions } from '../notebookBrowser.js';
import { NotebookDiffEditorInput } from '../../common/notebookDiffEditorInput.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { NotebookTextModel } from '../../common/model/notebookTextModel.js';
import { ACCESSIBLE_NOTEBOOK_DISPLAY_ORDER, CellUri, NotebookSetting, INotebookContributionData, INotebookExclusiveDocumentFilter, INotebookRendererInfo, INotebookTextModel, IOrderedMimeType, IOutputDto, MimeTypeDisplayOrder, NotebookEditorPriority, NotebookRendererMatch, NOTEBOOK_DISPLAY_ORDER, RENDERER_EQUIVALENT_EXTENSIONS, RENDERER_NOT_AVAILABLE, NotebookExtensionDescription, INotebookStaticPreloadInfo, NotebookData } from '../../common/notebookCommon.js';
import { NotebookEditorInput } from '../../common/notebookEditorInput.js';
import { INotebookEditorModelResolverService } from '../../common/notebookEditorModelResolverService.js';
import { NotebookOutputRendererInfo, NotebookStaticPreloadInfo as NotebookStaticPreloadInfo } from '../../common/notebookOutputRenderer.js';
import { NotebookEditorDescriptor, NotebookProviderInfo } from '../../common/notebookProvider.js';
import { INotebookSerializer, INotebookService, SimpleNotebookProviderInfo } from '../../common/notebookService.js';
import { DiffEditorInputFactoryFunction, EditorInputFactoryFunction, EditorInputFactoryObject, IEditorResolverService, IEditorType, RegisteredEditorInfo, RegisteredEditorPriority, UntitledEditorInputFactoryFunction, type MergeEditorInputFactoryFunction } from '../../../../services/editor/common/editorResolverService.js';
import { IExtensionService, isProposedApiEnabled } from '../../../../services/extensions/common/extensions.js';
import { IExtensionPointUser } from '../../../../services/extensions/common/extensionsRegistry.js';
import { InstallRecommendedExtensionAction } from '../../../extensions/browser/extensionsActions.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { INotebookDocument, INotebookDocumentService } from '../../../../services/notebook/common/notebookDocumentService.js';
import { MergeEditorInput } from '../../../mergeEditor/browser/mergeEditorInput.js';
import type { EditorInputWithOptions, IResourceDiffEditorInput, IResourceMergeEditorInput } from '../../../../common/editor.js';
import { bufferToStream, streamToBuffer, VSBuffer, VSBufferReadableStream } from '../../../../../base/common/buffer.js';
import type { IEditorGroup } from '../../../../services/editor/common/editorGroupsService.js';
import { NotebookMultiDiffEditorInput } from '../diff/notebookMultiDiffEditorInput.js';
import { SnapshotContext } from '../../../../services/workingCopy/common/fileWorkingCopy.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { CancellationError } from '../../../../../base/common/errors.js';
import { ICellRange } from '../../common/notebookRange.js';

interface NotebookProviderInfoStoreMemento {
	editors: NotebookProviderInfo[];
}

export class NotebookProviderInfoStore extends Disposable {

	private static readonly CUSTOM_EDITORS_STORAGE_ID = 'notebookEditors';
	private static readonly CUSTOM_EDITORS_ENTRY_ID = 'editors';

	private readonly _memento: Memento<NotebookProviderInfoStoreMemento>;
	private _handled: boolean = false;

	private readonly _contributedEditors = new Map<string, NotebookProviderInfo>();
	private readonly _contributedEditorDisposables = this._register(new DisposableStore());

	constructor(
		@IStorageService storageService: IStorageService,
		@IExtensionService extensionService: IExtensionService,
		@IEditorResolverService private readonly _editorResolverService: IEditorResolverService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IFileService private readonly _fileService: IFileService,
		@INotebookEditorModelResolverService private readonly _notebookEditorModelResolverService: INotebookEditorModelResolverService,
		@IUriIdentityService private readonly uriIdentService: IUriIdentityService,
	) {
		super();

		this._memento = new Memento(NotebookProviderInfoStore.CUSTOM_EDITORS_STORAGE_ID, storageService);

		const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		// Process the notebook contributions but buffer changes from the resolver
		this._editorResolverService.bufferChangeEvents(() => {
			for (const info of (mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] || []) as NotebookEditorDescriptor[]) {
				this.add(new NotebookProviderInfo(info), false);
			}
		});

		this._register(extensionService.onDidRegisterExtensions(() => {
			if (!this._handled) {
				// there is no extension point registered for notebook content provider
				// clear the memento and cache
				this._clear();
				mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] = [];
				this._memento.saveMemento();
			}
		}));

		notebooksExtensionPoint.setHandler(extensions => this._setupHandler(extensions));
	}

	override dispose(): void {
		this._clear();
		super.dispose();
	}

	private _setupHandler(extensions: readonly IExtensionPointUser<INotebookEditorContribution[]>[]) {
		this._handled = true;
		const builtins: NotebookProviderInfo[] = [...this._contributedEditors.values()].filter(info => !info.extension);
		this._clear();

		const builtinProvidersFromCache: Map<string, IDisposable> = new Map();
		builtins.forEach(builtin => {
			builtinProvidersFromCache.set(builtin.id, this.add(builtin));
		});

		for (const extension of extensions) {
			for (const notebookContribution of extension.value) {

				if (!notebookContribution.type) {
					extension.collector.error(`Notebook does not specify type-property`);
					continue;
				}

				const existing = this.get(notebookContribution.type);

				if (existing) {
					if (!existing.extension && extension.description.isBuiltin && builtins.find(builtin => builtin.id === notebookContribution.type)) {
						// we are registering an extension which is using the same view type which is already cached
						builtinProvidersFromCache.get(notebookContribution.type)?.dispose();
					} else {
						extension.collector.error(`Notebook type '${notebookContribution.type}' already used`);
						continue;
					}
				}

				this.add(new NotebookProviderInfo({
					extension: extension.description.identifier,
					id: notebookContribution.type,
					displayName: notebookContribution.displayName,
					selectors: notebookContribution.selector || [],
					priority: this._convertPriority(notebookContribution.priority),
					providerDisplayName: extension.description.displayName ?? extension.description.identifier.value,
				}));
			}
		}

		const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] = Array.from(this._contributedEditors.values());
		this._memento.saveMemento();
	}

	clearEditorCache() {
		const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
		mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] = [];
		this._memento.saveMemento();
	}

	private _convertPriority(priority?: string) {
		if (!priority) {
			return RegisteredEditorPriority.default;
		}

		if (priority === NotebookEditorPriority.default) {
			return RegisteredEditorPriority.default;
		}

		return RegisteredEditorPriority.option;

	}

	private _registerContributionPoint(notebookProviderInfo: NotebookProviderInfo): IDisposable {

		const disposables = new DisposableStore();

		for (const selector of notebookProviderInfo.selectors) {
			const globPattern = (selector as INotebookExclusiveDocumentFilter).include || selector as glob.IRelativePattern | string;
			const notebookEditorInfo: RegisteredEditorInfo = {
				id: notebookProviderInfo.id,
				label: notebookProviderInfo.displayName,
				detail: notebookProviderInfo.providerDisplayName,
				priority: notebookProviderInfo.priority,
			};
			const notebookEditorOptions = {
				canHandleDiff: () => !!this._configurationService.getValue(NotebookSetting.textDiffEditorPreview) && !this._accessibilityService.isScreenReaderOptimized(),
				canSupportResource: (resource: URI) => {
					if (resource.scheme === Schemas.vscodeNotebookCellOutput) {
						const params = new URLSearchParams(resource.query);
						return params.get('openIn') === 'notebook';
					}
					return resource.scheme === Schemas.untitled || resource.scheme === Schemas.vscodeNotebookCell || this._fileService.hasProvider(resource);
				}
			};
			const notebookEditorInputFactory: EditorInputFactoryFunction = async ({ resource, options }) => {
				let data;
				if (resource.scheme === Schemas.vscodeNotebookCellOutput) {
					const outputUriData = CellUri.parseCellOutputUri(resource);
					if (!outputUriData || !outputUriData.notebook || outputUriData.cellHandle === undefined) {
						throw new Error('Invalid cell output uri');
					}

					data = {
						notebook: outputUriData.notebook,
						handle: outputUriData.cellHandle
					};

				} else {
					data = CellUri.parse(resource);
				}

				let notebookUri: URI;

				let cellOptions: IResourceEditorInput | undefined;

				if (data) {
					// resource is a notebook cell
					notebookUri = this.uriIdentService.asCanonicalUri(data.notebook);
					cellOptions = { resource, options };
				} else {
					notebookUri = this.uriIdentService.asCanonicalUri(resource);
				}

				if (!cellOptions) {
					cellOptions = (options as INotebookEditorOptions | undefined)?.cellOptions;
				}

				let notebookOptions: INotebookEditorOptions;

				if (resource.scheme === Schemas.vscodeNotebookCellOutput) {
					if (data?.handle === undefined || !data?.notebook) {
						throw new Error('Invalid cell handle');
					}

					const cellUri = CellUri.generate(data.notebook, data.handle);

					cellOptions = { resource: cellUri, options };

					const cellIndex = await this._notebookEditorModelResolverService.resolve(notebookUri)
						.then(model => model.object.notebook.cells.findIndex(cell => cell.handle === data?.handle))
						.then(index => index >= 0 ? index : 0);

					const cellIndexesToRanges: ICellRange[] = [{ start: cellIndex, end: cellIndex + 1 }];

					notebookOptions = {
						...options,
						cellOptions,
						viewState: undefined,
						cellSelections: cellIndexesToRanges
					};
				} else {
					notebookOptions = {
						...options,
						cellOptions,
						viewState: undefined,
					};
				}
				const preferredResourceParam = cellOptions?.resource;
				const editor = NotebookEditorInput.getOrCreate(this._instantiationService, notebookUri, preferredResourceParam, notebookProviderInfo.id);
				return { editor, options: notebookOptions };
			};

			const notebookUntitledEditorFactory: UntitledEditorInputFactoryFunction = async ({ resource, options }) => {
				const ref = await this._notebookEditorModelResolverService.resolve({ untitledResource: resource }, notebookProviderInfo.id);

				// untitled notebooks are disposed when they get saved. we should not hold a reference
				// to such a disposed notebook and therefore dispose the reference as well
				Event.once(ref.object.notebook.onWillDispose)(() => {
					ref.dispose();
				});

				return { editor: NotebookEditorInput.getOrCreate(this._instantiationService, ref.object.resource, undefined, notebookProviderInfo.id), options };
			};
			const notebookDiffEditorInputFactory: DiffEditorInputFactoryFunction = (diffEditorInput: IResourceDiffEditorInput, group: IEditorGroup) => {
				const { modified, original, label, description } = diffEditorInput;

				if (this._configurationService.getValue('notebook.experimental.enableNewDiffEditor')) {
					return { editor: NotebookMultiDiffEditorInput.create(this._instantiationService, modified.resource!, label, description, original.resource!, notebookProviderInfo.id) };
				}
				return { editor: NotebookDiffEditorInput.create(this._instantiationService, modified.resource!, label, description, original.resource!, notebookProviderInfo.id) };
			};
			const mergeEditorInputFactory: MergeEditorInputFactoryFunction = (mergeEditor: IResourceMergeEditorInput): EditorInputWithOptions => {
				return {
					editor: this._instantiationService.createInstance(
						MergeEditorInput,
						mergeEditor.base.resource,
						{
							uri: mergeEditor.input1.resource,
							title: mergeEditor.input1.label ?? basename(mergeEditor.input1.resource),
							description: mergeEditor.input1.description ?? '',
							detail: mergeEditor.input1.detail
						},
						{
							uri: mergeEditor.input2.resource,
							title: mergeEditor.input2.label ?? basename(mergeEditor.input2.resource),
							description: mergeEditor.input2.description ?? '',
							detail: mergeEditor.input2.detail
						},
						mergeEditor.result.resource
					)
				};
			};

			const notebookFactoryObject: EditorInputFactoryObject = {
				createEditorInput: notebookEditorInputFactory,
				createDiffEditorInput: notebookDiffEditorInputFactory,
				createUntitledEditorInput: notebookUntitledEditorFactory,
				createMergeEditorInput: mergeEditorInputFactory
			};
			const notebookCellFactoryObject: EditorInputFactoryObject = {
				createEditorInput: notebookEditorInputFactory,
				createDiffEditorInput: notebookDiffEditorInputFactory,
			};

			// TODO @lramos15 find a better way to toggle handling diff editors than needing these listeners for every registration
			// This is a lot of event listeners especially if there are many notebooks
			disposables.add(this._configurationService.onDidChangeConfiguration(e => {
				if (e.affectsConfiguration(NotebookSetting.textDiffEditorPreview)) {
					const canHandleDiff = !!this._configurationService.getValue(NotebookSetting.textDiffEditorPreview) && !this._accessibilityService.isScreenReaderOptimized();
					if (canHandleDiff) {
						notebookFactoryObject.createDiffEditorInput = notebookDiffEditorInputFactory;
						notebookCellFactoryObject.createDiffEditorInput = notebookDiffEditorInputFactory;
					} else {
						notebookFactoryObject.createDiffEditorInput = undefined;
						notebookCellFactoryObject.createDiffEditorInput = undefined;
					}
				}
			}));

			disposables.add(this._accessibilityService.onDidChangeScreenReaderOptimized(() => {
				const canHandleDiff = !!this._configurationService.getValue(NotebookSetting.textDiffEditorPreview) && !this._accessibilityService.isScreenReaderOptimized();
				if (canHandleDiff) {
					notebookFactoryObject.createDiffEditorInput = notebookDiffEditorInputFactory;
					notebookCellFactoryObject.createDiffEditorInput = notebookDiffEditorInputFactory;
				} else {
					notebookFactoryObject.createDiffEditorInput = undefined;
					notebookCellFactoryObject.createDiffEditorInput = undefined;
				}
			}));

			// Register the notebook editor
			disposables.add(this._editorResolverService.registerEditor(
				globPattern,
				notebookEditorInfo,
				notebookEditorOptions,
				notebookFactoryObject,
			));
			// Then register the schema handler as exclusive for that notebook
			disposables.add(this._editorResolverService.registerEditor(
				`${Schemas.vscodeNotebookCell}:/**/${globPattern}`,
				{ ...notebookEditorInfo, priority: RegisteredEditorPriority.exclusive },
				notebookEditorOptions,
				notebookCellFactoryObject
			));
		}

		return disposables;
	}


	private _clear(): void {
		this._contributedEditors.clear();
		this._contributedEditorDisposables.clear();
	}

	get(viewType: string): NotebookProviderInfo | undefined {
		return this._contributedEditors.get(viewType);
	}

	add(info: NotebookProviderInfo, saveMemento = true): IDisposable {
		if (this._contributedEditors.has(info.id)) {
			throw new Error(`notebook type '${info.id}' ALREADY EXISTS`);
		}
		this._contributedEditors.set(info.id, info);
		let editorRegistration: IDisposable | undefined;

		// built-in notebook providers contribute their own editors
		if (info.extension) {
			editorRegistration = this._registerContributionPoint(info);
			this._contributedEditorDisposables.add(editorRegistration);
		}

		if (saveMemento) {
			const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
			mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] = Array.from(this._contributedEditors.values());
			this._memento.saveMemento();
		}

		return this._register(toDisposable(() => {
			const mementoObject = this._memento.getMemento(StorageScope.PROFILE, StorageTarget.MACHINE);
			mementoObject[NotebookProviderInfoStore.CUSTOM_EDITORS_ENTRY_ID] = Array.from(this._contributedEditors.values());
			this._memento.saveMemento();
			editorRegistration?.dispose();
			this._contributedEditors.delete(info.id);
		}));
	}

	getContributedNotebook(resource: URI): readonly NotebookProviderInfo[] {
		const result: NotebookProviderInfo[] = [];
		for (const info of this._contributedEditors.values()) {
			if (info.matches(resource)) {
				result.push(info);
			}
		}
		if (result.length === 0 && resource.scheme === Schemas.untitled) {
			// untitled resource and no path-specific match => all providers apply
			return Array.from(this._contributedEditors.values());
		}
		return result;
	}

	[Symbol.iterator](): Iterator<NotebookProviderInfo> {
		return this._contributedEditors.values();
	}
}

interface NotebookOutputRendererInfoStoreMemento {
	[notebookType: string]: { [mimeType: string]: string } | undefined;
}

export class NotebookOutputRendererInfoStore {
	private readonly contributedRenderers = new Map</* rendererId */ string, NotebookOutputRendererInfo>();
	private readonly preferredMimetypeMemento: Memento<NotebookOutputRendererInfoStoreMemento>;
	private readonly preferredMimetype = new Lazy<NotebookOutputRendererInfoStoreMemento>(
		() => this.preferredMimetypeMemento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE));

	constructor(
		@IStorageService storageService: IStorageService,
	) {
		this.preferredMimetypeMemento = new Memento('workbench.editor.notebook.preferredRenderer2', storageService);
	}

	clear() {
		this.contributedRenderers.clear();
	}

	get(rendererId: string): NotebookOutputRendererInfo | undefined {
		return this.contributedRenderers.get(rendererId);
	}

	getAll(): NotebookOutputRendererInfo[] {
		return Array.from(this.contributedRenderers.values());
	}

	add(info: NotebookOutputRendererInfo): void {
		if (this.contributedRenderers.has(info.id)) {
			return;
		}
		this.contributedRenderers.set(info.id, info);
	}

	/** Update and remember the preferred renderer for the given mimetype in this workspace */
	setPreferred(notebookProviderInfo: NotebookProviderInfo, mimeType: string, rendererId: string) {
		const mementoObj = this.preferredMimetype.value;
		const forNotebook = mementoObj[notebookProviderInfo.id];
		if (forNotebook) {
			forNotebook[mimeType] = rendererId;
		} else {
			mementoObj[notebookProviderInfo.id] = { [mimeType]: rendererId };
		}

		this.preferredMimetypeMemento.saveMemento();
	}

	findBestRenderers(notebookProviderInfo: NotebookProviderInfo | undefined, mimeType: string, kernelProvides: readonly string[] | undefined): IOrderedMimeType[] {

		const enum ReuseOrder {
			PreviouslySelected = 1 << 8,
			SameExtensionAsNotebook = 2 << 8,
			OtherRenderer = 3 << 8,
			BuiltIn = 4 << 8,
		}

		const preferred = notebookProviderInfo && this.preferredMimetype.value[notebookProviderInfo.id]?.[mimeType];
		const notebookExtId = notebookProviderInfo?.extension?.value;
		const notebookId = notebookProviderInfo?.id;
		const renderers: { ordered: IOrderedMimeType; score: number }[] = Array.from(this.contributedRenderers.values())
			.map(renderer => {
				const ownScore = kernelProvides === undefined
					? renderer.matchesWithoutKernel(mimeType)
					: renderer.matches(mimeType, kernelProvides);

				if (ownScore === NotebookRendererMatch.Never) {
					return undefined;
				}

				const rendererExtId = renderer.extensionId.value;
				const reuseScore = preferred === renderer.id
					? ReuseOrder.PreviouslySelected
					: rendererExtId === notebookExtId || RENDERER_EQUIVALENT_EXTENSIONS.get(rendererExtId)?.has(notebookId!)
						? ReuseOrder.SameExtensionAsNotebook
						: renderer.isBuiltin ? ReuseOrder.BuiltIn : ReuseOrder.OtherRenderer;
				return {
					ordered: { mimeType, rendererId: renderer.id, isTrusted: true },
					score: reuseScore | ownScore,
				};
			}).filter(isDefined);

		if (renderers.length === 0) {
			return [{ mimeType, rendererId: RENDERER_NOT_AVAILABLE, isTrusted: true }];
		}

		return renderers.sort((a, b) => a.score - b.score).map(r => r.ordered);
	}
}

class ModelData implements IDisposable, INotebookDocument {
	private readonly _modelEventListeners = new DisposableStore();
	get uri() { return this.model.uri; }

	constructor(
		readonly model: NotebookTextModel,
		onWillDispose: (model: INotebookTextModel) => void
	) {
		this._modelEventListeners.add(model.onWillDispose(() => onWillDispose(model)));
	}

	getCellIndex(cellUri: URI): number | undefined {
		return this.model.cells.findIndex(cell => isEqual(cell.uri, cellUri));
	}

	dispose(): void {
		this._modelEventListeners.dispose();
	}
}

interface NotebookServiceMemento {
	[viewType: string]: string | undefined;
}

export class NotebookService extends Disposable implements INotebookService {

	declare readonly _serviceBrand: undefined;
	private static _storageNotebookViewTypeProvider = 'notebook.viewTypeProvider';
	private readonly _memento: Memento<NotebookServiceMemento>;
	private readonly _viewTypeCache: NotebookServiceMemento;

	private readonly _notebookProviders;
	private _notebookProviderInfoStore: NotebookProviderInfoStore | undefined;
	private get notebookProviderInfoStore(): NotebookProviderInfoStore {
		if (!this._notebookProviderInfoStore) {
			this._notebookProviderInfoStore = this._register(this._instantiationService.createInstance(NotebookProviderInfoStore));
		}

		return this._notebookProviderInfoStore;
	}
	private readonly _notebookRenderersInfoStore;
	private readonly _onDidChangeOutputRenderers;
	readonly onDidChangeOutputRenderers;

	private readonly _notebookStaticPreloadInfoStore;

	private readonly _models;

	private readonly _onWillAddNotebookDocument;
	private readonly _onDidAddNotebookDocument;
	private readonly _onWillRemoveNotebookDocument;
	private readonly _onDidRemoveNotebookDocument;

	readonly onWillAddNotebookDocument;
	readonly onDidAddNotebookDocument;
	readonly onDidRemoveNotebookDocument;
	readonly onWillRemoveNotebookDocument;

	private readonly _onAddViewType;
	readonly onAddViewType;

	private readonly _onWillRemoveViewType;
	readonly onWillRemoveViewType;

	private readonly _onDidChangeEditorTypes;
	readonly onDidChangeEditorTypes: Event<void>;

	private _cutItems: NotebookCellTextModel[] | undefined;
	private _lastClipboardIsCopy: boolean;

	private _displayOrder!: MimeTypeDisplayOrder;

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStorageService private readonly _storageService: IStorageService,
		@INotebookDocumentService private readonly _notebookDocumentService: INotebookDocumentService
	) {
		super();
		this._notebookProviders = new Map<string, SimpleNotebookProviderInfo>();
		this._notebookProviderInfoStore = undefined;
		this._notebookRenderersInfoStore = this._instantiationService.createInstance(NotebookOutputRendererInfoStore);
		this._onDidChangeOutputRenderers = this._register(new Emitter<void>());
		this.onDidChangeOutputRenderers = this._onDidChangeOutputRenderers.event;
		this._notebookStaticPreloadInfoStore = new Set<NotebookStaticPreloadInfo>();
		this._models = new ResourceMap<ModelData>();
		this._onWillAddNotebookDocument = this._register(new Emitter<NotebookTextModel>());
		this._onDidAddNotebookDocument = this._register(new Emitter<NotebookTextModel>());
		this._onWillRemoveNotebookDocument = this._register(new Emitter<NotebookTextModel>());
		this._onDidRemoveNotebookDocument = this._register(new Emitter<NotebookTextModel>());
		this.onWillAddNotebookDocument = this._onWillAddNotebookDocument.event;
		this.onDidAddNotebookDocument = this._onDidAddNotebookDocument.event;
		this.onDidRemoveNotebookDocument = this._onDidRemoveNotebookDocument.event;
		this.onWillRemoveNotebookDocument = this._onWillRemoveNotebookDocument.event;
		this._onAddViewType = this._register(new Emitter<string>());
		this.onAddViewType = this._onAddViewType.event;
		this._onWillRemoveViewType = this._register(new Emitter<string>());
		this.onWillRemoveViewType = this._onWillRemoveViewType.event;
		this._onDidChangeEditorTypes = this._register(new Emitter<void>());
		this.onDidChangeEditorTypes = this._onDidChangeEditorTypes.event;
		this._lastClipboardIsCopy = true;

		notebookRendererExtensionPoint.setHandler((renderers) => {
			this._notebookRenderersInfoStore.clear();

			for (const extension of renderers) {
				for (const notebookContribution of extension.value) {
					if (!notebookContribution.entrypoint) { // avoid crashing
						extension.collector.error(`Notebook renderer does not specify entry point`);
						continue;
					}

					const id = notebookContribution.id;
					if (!id) {
						extension.collector.error(`Notebook renderer does not specify id-property`);
						continue;
					}

					this._notebookRenderersInfoStore.add(new NotebookOutputRendererInfo({
						id,
						extension: extension.description,
						entrypoint: notebookContribution.entrypoint,
						displayName: notebookContribution.displayName,
						mimeTypes: notebookContribution.mimeTypes || [],
						dependencies: notebookContribution.dependencies,
						optionalDependencies: notebookContribution.optionalDependencies,
						requiresMessaging: notebookContribution.requiresMessaging,
					}));
				}
			}

			this._onDidChangeOutputRenderers.fire();
		});

		notebookPreloadExtensionPoint.setHandler(extensions => {
			this._notebookStaticPreloadInfoStore.clear();

			for (const extension of extensions) {
				if (!isProposedApiEnabled(extension.description, 'contribNotebookStaticPreloads')) {
					continue;
				}

				for (const notebookContribution of extension.value) {
					if (!notebookContribution.entrypoint) { // avoid crashing
						extension.collector.error(`Notebook preload does not specify entry point`);
						continue;
					}

					const type = notebookContribution.type;
					if (!type) {
						extension.collector.error(`Notebook preload does not specify type-property`);
						continue;
					}

					this._notebookStaticPreloadInfoStore.add(new NotebookStaticPreloadInfo({
						type,
						extension: extension.description,
						entrypoint: notebookContribution.entrypoint,
						localResourceRoots: notebookContribution.localResourceRoots ?? [],
					}));
				}
			}
		});

		const updateOrder = () => {
			this._displayOrder = new MimeTypeDisplayOrder(
				this._configurationService.getValue<string[]>(NotebookSetting.displayOrder) || [],
				this._accessibilityService.isScreenReaderOptimized()
					? ACCESSIBLE_NOTEBOOK_DISPLAY_ORDER
					: NOTEBOOK_DISPLAY_ORDER,
			);
		};

		updateOrder();

		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(NotebookSetting.displayOrder)) {
				updateOrder();
			}
		}));

		this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => {
			updateOrder();
		}));

		this._memento = new Memento(NotebookService._storageNotebookViewTypeProvider, this._storageService);
		this._viewTypeCache = this._memento.getMemento(StorageScope.WORKSPACE, StorageTarget.MACHINE);
	}


	getEditorTypes(): IEditorType[] {
		return [...this.notebookProviderInfoStore].map(info => ({
			id: info.id,
			displayName: info.displayName,
			providerDisplayName: info.providerDisplayName
		}));
	}

	clearEditorCache(): void {
		this.notebookProviderInfoStore.clearEditorCache();
	}

	private _postDocumentOpenActivation(viewType: string) {
		// send out activations on notebook text model creation
		this._extensionService.activateByEvent(`onNotebook:${viewType}`);
		this._extensionService.activateByEvent(`onNotebook:*`);
	}

	async canResolve(viewType: string): Promise<boolean> {
		if (this._notebookProviders.has(viewType)) {
			return true;
		}

		await this._extensionService.whenInstalledExtensionsRegistered();
		await this._extensionService.activateByEvent(`onNotebookSerializer:${viewType}`);

		return this._notebookProviders.has(viewType);
	}

	registerContributedNotebookType(viewType: string, data: INotebookContributionData): IDisposable {

		const info = new NotebookProviderInfo({
			extension: data.extension,
			id: viewType,
			displayName: data.displayName,
			providerDisplayName: data.providerDisplayName,
			priority: data.priority || RegisteredEditorPriority.default,
			selectors: []
		});

		info.update({ selectors: data.filenamePattern });

		const reg = this.notebookProviderInfoStore.add(info);
		this._onDidChangeEditorTypes.fire();

		return toDisposable(() => {
			reg.dispose();
			this._onDidChangeEditorTypes.fire();
		});
	}

	private _registerProviderData(viewType: string, data: SimpleNotebookProviderInfo): IDisposable {
		if (this._notebookProviders.has(viewType)) {
			throw new Error(`notebook provider for viewtype '${viewType}' already exists`);
		}
		this._notebookProviders.set(viewType, data);
		this._onAddViewType.fire(viewType);
		return toDisposable(() => {
			this._onWillRemoveViewType.fire(viewType);
			this._notebookProviders.delete(viewType);
		});
	}

	registerNotebookSerializer(viewType: string, extensionData: NotebookExtensionDescription, serializer: INotebookSerializer): IDisposable {
		this.notebookProviderInfoStore.get(viewType)?.update({ options: serializer.options });
		this._viewTypeCache[viewType] = extensionData.id.value;
		this._persistMementos();
		return this._registerProviderData(viewType, new SimpleNotebookProviderInfo(viewType, serializer, extensionData));
	}

	async withNotebookDataProvider(viewType: string): Promise<SimpleNotebookProviderInfo> {
		const selected = this.notebookProviderInfoStore.get(viewType);
		if (!selected) {
			const knownProvider = this.getViewTypeProvider(viewType);

			const actions = knownProvider ? [
				toAction({
					id: 'workbench.notebook.action.installMissingViewType', label: localize('notebookOpenInstallMissingViewType', "Install extension for '{0}'", viewType), run: async () => {
						await this._instantiationService.createInstance(InstallRecommendedExtensionAction, knownProvider).run();
					}
				})
			] : [];

			throw createErrorWithActions(`UNKNOWN notebook type '${viewType}'`, actions);
		}
		await this.canResolve(selected.id);
		const result = this._notebookProviders.get(selected.id);
		if (!result) {
			throw new Error(`NO provider registered for view type: '${selected.id}'`);
		}
		return result;
	}

	tryGetDataProviderSync(viewType: string): SimpleNotebookProviderInfo | undefined {
		const selected = this.notebookProviderInfoStore.get(viewType);
		if (!selected) {
			return undefined;
		}
		return this._notebookProviders.get(selected.id);
	}


	private _persistMementos(): void {
		this._memento.saveMemento();
	}

	getViewTypeProvider(viewType: string): string | undefined {
		return this._viewTypeCache[viewType];
	}

	getRendererInfo(rendererId: string): INotebookRendererInfo | undefined {
		return this._notebookRenderersInfoStore.get(rendererId);
	}

	updateMimePreferredRenderer(viewType: string, mimeType: string, rendererId: string, otherMimetypes: readonly string[]): void {
		const info = this.notebookProviderInfoStore.get(viewType);
		if (info) {
			this._notebookRenderersInfoStore.setPreferred(info, mimeType, rendererId);
		}

		this._displayOrder.prioritize(mimeType, otherMimetypes);
	}

	saveMimeDisplayOrder(target: ConfigurationTarget) {
		this._configurationService.updateValue(NotebookSetting.displayOrder, this._displayOrder.toArray(), target);
	}

	getRenderers(): INotebookRendererInfo[] {
		return this._notebookRenderersInfoStore.getAll();
	}

	*getStaticPreloads(viewType: string): Iterable<INotebookStaticPreloadInfo> {
		for (const preload of this._notebookStaticPreloadInfoStore) {
			if (preload.type === viewType) {
				yield preload;
			}
		}
	}

	// --- notebook documents: create, destory, retrieve, enumerate

	async createNotebookTextModel(viewType: string, uri: URI, stream?: VSBufferReadableStream): Promise<NotebookTextModel> {
		if (this._models.has(uri)) {
			throw new Error(`notebook for ${uri} already exists`);
		}

		const info = await this.withNotebookDataProvider(viewType);
		if (!(info instanceof SimpleNotebookProviderInfo)) {
			throw new Error('CANNOT open file notebook with this provider');
		}


		const bytes = stream ? await streamToBuffer(stream) : VSBuffer.fromByteArray([]);
		const data = await info.serializer.dataToNotebook(bytes);


		const notebookModel = this._instantiationService.createInstance(NotebookTextModel, info.viewType, uri, data.cells, data.metadata, info.serializer.options);
		const modelData = new ModelData(notebookModel, this._onWillDisposeDocument.bind(this));
		this._models.set(uri, modelData);
		this._notebookDocumentService.addNotebookDocument(modelData);
		this._onWillAddNotebookDocument.fire(notebookModel);
		this._onDidAddNotebookDocument.fire(notebookModel);
		this._postDocumentOpenActivation(info.viewType);
		return notebookModel;
	}

	async createNotebookTextDocumentSnapshot(uri: URI, context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream> {
		const model = this.getNotebookTextModel(uri);

		if (!model) {
			throw new Error(`notebook for ${uri} doesn't exist`);
		}

		const info = await this.withNotebookDataProvider(model.viewType);

		if (!(info instanceof SimpleNotebookProviderInfo)) {
			throw new Error('CANNOT open file notebook with this provider');
		}

		const serializer = info.serializer;
		const outputSizeLimit = this._configurationService.getValue<number>(NotebookSetting.outputBackupSizeLimit) * 1024;
		const data: NotebookData = model.createSnapshot({ context: context, outputSizeLimit: outputSizeLimit, transientOptions: serializer.options });
		const indentAmount = model.metadata.indentAmount;
		if (typeof indentAmount === 'string' && indentAmount) {
			// This is required for ipynb serializer to preserve the whitespace in the notebook.
			data.metadata.indentAmount = indentAmount;
		}
		const bytes = await serializer.notebookToData(data);

		if (token.isCancellationRequested) {
			throw new CancellationError();
		}
		return bufferToStream(bytes);
	}

	async restoreNotebookTextModelFromSnapshot(uri: URI, viewType: string, snapshot: VSBufferReadableStream): Promise<NotebookTextModel> {
		const model = this.getNotebookTextModel(uri);

		if (!model) {
			throw new Error(`notebook for ${uri} doesn't exist`);
		}

		const info = await this.withNotebookDataProvider(model.viewType);

		if (!(info instanceof SimpleNotebookProviderInfo)) {
			throw new Error('CANNOT open file notebook with this provider');
		}

		const serializer = info.serializer;

		const bytes = await streamToBuffer(snapshot);
		const data = await info.serializer.dataToNotebook(bytes);
		model.restoreSnapshot(data, serializer.options);

		return model;
	}

	getNotebookTextModel(uri: URI): NotebookTextModel | undefined {
		return this._models.get(uri)?.model;
	}

	getNotebookTextModels(): Iterable<NotebookTextModel> {
		return Iterable.map(this._models.values(), data => data.model);
	}

	listNotebookDocuments(): NotebookTextModel[] {
		return [...this._models].map(e => e[1].model);
	}

	private _onWillDisposeDocument(model: INotebookTextModel): void {
		const modelData = this._models.get(model.uri);
		if (modelData) {
			this._onWillRemoveNotebookDocument.fire(modelData.model);
			this._models.delete(model.uri);
			this._notebookDocumentService.removeNotebookDocument(modelData);
			modelData.dispose();
			this._onDidRemoveNotebookDocument.fire(modelData.model);
		}
	}

	getOutputMimeTypeInfo(textModel: NotebookTextModel, kernelProvides: readonly string[] | undefined, output: IOutputDto): readonly IOrderedMimeType[] {
		const sorted = this._displayOrder.sort(new Set<string>(output.outputs.map(op => op.mime)));
		const notebookProviderInfo = this.notebookProviderInfoStore.get(textModel.viewType);

		return sorted
			.flatMap(mimeType => this._notebookRenderersInfoStore.findBestRenderers(notebookProviderInfo, mimeType, kernelProvides))
			.sort((a, b) => (a.rendererId === RENDERER_NOT_AVAILABLE ? 1 : 0) - (b.rendererId === RENDERER_NOT_AVAILABLE ? 1 : 0));
	}

	getContributedNotebookTypes(resource?: URI): readonly NotebookProviderInfo[] {
		if (resource) {
			return this.notebookProviderInfoStore.getContributedNotebook(resource);
		}

		return [...this.notebookProviderInfoStore];
	}

	hasSupportedNotebooks(resource: URI): boolean {
		if (this._models.has(resource)) {
			// it might be untitled
			return true;
		}

		const contribution = this.notebookProviderInfoStore.getContributedNotebook(resource);
		if (!contribution.length) {
			return false;
		}
		return contribution.some(info => info.matches(resource) &&
			(info.priority === RegisteredEditorPriority.default || info.priority === RegisteredEditorPriority.exclusive)
		);
	}

	getContributedNotebookType(viewType: string): NotebookProviderInfo | undefined {
		return this.notebookProviderInfoStore.get(viewType);
	}

	getNotebookProviderResourceRoots(): URI[] {
		const ret: URI[] = [];
		this._notebookProviders.forEach(val => {
			if (val.extensionData.location) {
				ret.push(URI.revive(val.extensionData.location));
			}
		});

		return ret;
	}

	// --- copy & paste

	setToCopy(items: NotebookCellTextModel[], isCopy: boolean) {
		this._cutItems = items;
		this._lastClipboardIsCopy = isCopy;
	}

	getToCopy(): { items: NotebookCellTextModel[]; isCopy: boolean } | undefined {
		if (this._cutItems) {
			return { items: this._cutItems, isCopy: this._lastClipboardIsCopy };
		}

		return undefined;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/services/notebookWorkerServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/services/notebookWorkerServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, dispose, IDisposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { URI } from '../../../../../base/common/uri.js';
import { IWebWorkerClient, Proxied } from '../../../../../base/common/worker/webWorker.js';
import { WebWorkerDescriptor } from '../../../../../platform/webWorker/browser/webWorkerDescriptor.js';
import { IWebWorkerService } from '../../../../../platform/webWorker/browser/webWorkerService.js';
import { NotebookCellTextModel } from '../../common/model/notebookCellTextModel.js';
import { CellUri, IMainCellDto, INotebookDiffResult, NotebookCellsChangeType, NotebookRawContentEventDto } from '../../common/notebookCommon.js';
import { INotebookService } from '../../common/notebookService.js';
import { NotebookWorker } from '../../common/services/notebookWebWorker.js';
import { INotebookEditorWorkerService } from '../../common/services/notebookWorkerService.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { TextModel } from '../../../../../editor/common/model/textModel.js';
import { FileAccess, Schemas } from '../../../../../base/common/network.js';
import { isEqual } from '../../../../../base/common/resources.js';

export class NotebookEditorWorkerServiceImpl extends Disposable implements INotebookEditorWorkerService {
	declare readonly _serviceBrand: undefined;

	private readonly _workerManager: WorkerManager;

	constructor(
		@INotebookService notebookService: INotebookService,
		@IModelService modelService: IModelService,
		@IWebWorkerService webWorkerService: IWebWorkerService,
	) {
		super();

		this._workerManager = this._register(new WorkerManager(notebookService, modelService, webWorkerService));
	}
	canComputeDiff(original: URI, modified: URI): boolean {
		throw new Error('Method not implemented.');
	}

	computeDiff(original: URI, modified: URI): Promise<INotebookDiffResult> {
		return this._workerManager.withWorker().then(client => {
			return client.computeDiff(original, modified);
		});
	}

	canPromptRecommendation(model: URI): Promise<boolean> {
		return this._workerManager.withWorker().then(client => {
			return client.canPromptRecommendation(model);
		});
	}
}

class WorkerManager extends Disposable {
	private _editorWorkerClient: NotebookWorkerClient | null;
	// private _lastWorkerUsedTime: number;

	constructor(
		private readonly _notebookService: INotebookService,
		private readonly _modelService: IModelService,
		private readonly _webWorkerService: IWebWorkerService,
	) {
		super();
		this._editorWorkerClient = null;
		// this._lastWorkerUsedTime = (new Date()).getTime();
	}

	withWorker(): Promise<NotebookWorkerClient> {
		// this._lastWorkerUsedTime = (new Date()).getTime();
		if (!this._editorWorkerClient) {
			this._editorWorkerClient = new NotebookWorkerClient(this._notebookService, this._modelService, this._webWorkerService);
			this._register(this._editorWorkerClient);
		}
		return Promise.resolve(this._editorWorkerClient);
	}
}

class NotebookEditorModelManager extends Disposable {
	private _syncedModels: { [modelUrl: string]: IDisposable } = Object.create(null);
	private _syncedModelsLastUsedTime: { [modelUrl: string]: number } = Object.create(null);

	constructor(
		private readonly _proxy: Proxied<NotebookWorker>,
		private readonly _notebookService: INotebookService,
		private readonly _modelService: IModelService,
	) {
		super();
	}

	public ensureSyncedResources(resources: URI[]): void {
		for (const resource of resources) {
			const resourceStr = resource.toString();

			if (!this._syncedModels[resourceStr]) {
				this._beginModelSync(resource);
			}
			if (this._syncedModels[resourceStr]) {
				this._syncedModelsLastUsedTime[resourceStr] = (new Date()).getTime();
			}
		}
	}

	private _beginModelSync(resource: URI): void {
		const model = this._notebookService.listNotebookDocuments().find(document => document.uri.toString() === resource.toString());
		if (!model) {
			return;
		}

		const modelUrl = resource.toString();

		this._proxy.$acceptNewModel(
			model.uri.toString(),
			model.metadata,
			model.transientOptions.transientDocumentMetadata,
			model.cells.map(cell => ({
				handle: cell.handle,
				url: cell.uri.toString(),
				source: cell.textBuffer.getLinesContent(),
				eol: cell.textBuffer.getEOL(),
				versionId: cell.textModel?.getVersionId() ?? 0,
				language: cell.language,
				mime: cell.mime,
				cellKind: cell.cellKind,
				outputs: cell.outputs.map(op => ({ outputId: op.outputId, outputs: op.outputs })),
				metadata: cell.metadata,
				internalMetadata: cell.internalMetadata,
			}))
		);

		const toDispose = new DisposableStore();

		const cellToDto = (cell: NotebookCellTextModel): IMainCellDto => {
			return {
				handle: cell.handle,
				url: cell.uri.toString(),
				source: cell.textBuffer.getLinesContent(),
				eol: cell.textBuffer.getEOL(),
				versionId: 0,
				language: cell.language,
				cellKind: cell.cellKind,
				outputs: cell.outputs.map(op => ({ outputId: op.outputId, outputs: op.outputs })),
				metadata: cell.metadata,
				internalMetadata: cell.internalMetadata,
			};
		};

		const cellHandlers = new Set<NotebookCellTextModel>();
		const addCellContentChangeHandler = (cell: NotebookCellTextModel) => {
			cellHandlers.add(cell);
			toDispose.add(cell.onDidChangeContent((e) => {
				if (typeof e === 'object' && e.type === 'model') {
					this._proxy.$acceptCellModelChanged(modelUrl, cell.handle, e.event);
				}
			}));
		};

		model.cells.forEach(cell => addCellContentChangeHandler(cell));
		// Possible some of the models have not yet been loaded.
		// If all have been loaded, for all cells, then no need to listen to model add events.
		if (model.cells.length !== cellHandlers.size) {
			toDispose.add(this._modelService.onModelAdded((textModel: ITextModel) => {
				if (textModel.uri.scheme !== Schemas.vscodeNotebookCell || !(textModel instanceof TextModel)) {
					return;
				}
				const cellUri = CellUri.parse(textModel.uri);
				if (!cellUri || !isEqual(cellUri.notebook, model.uri)) {
					return;
				}
				const cell = model.cells.find(cell => cell.handle === cellUri.handle);
				if (cell) {
					addCellContentChangeHandler(cell);
				}
			}));
		}

		toDispose.add(model.onDidChangeContent((event) => {
			const dto: NotebookRawContentEventDto[] = [];
			event.rawEvents
				.forEach(e => {
					switch (e.kind) {
						case NotebookCellsChangeType.ModelChange:
						case NotebookCellsChangeType.Initialize: {
							dto.push({
								kind: e.kind,
								changes: e.changes.map(diff => [diff[0], diff[1], diff[2].map(cell => cellToDto(cell as NotebookCellTextModel))] as [number, number, IMainCellDto[]])
							});

							for (const change of e.changes) {
								for (const cell of change[2]) {
									addCellContentChangeHandler(cell as NotebookCellTextModel);
								}
							}
							break;
						}
						case NotebookCellsChangeType.Move: {
							dto.push({
								kind: NotebookCellsChangeType.Move,
								index: e.index,
								length: e.length,
								newIdx: e.newIdx,
								cells: e.cells.map(cell => cellToDto(cell as NotebookCellTextModel))
							});
							break;
						}
						case NotebookCellsChangeType.ChangeCellContent:
							// Changes to cell content are handled by the cell model change listener.
							break;
						case NotebookCellsChangeType.ChangeDocumentMetadata:
							dto.push({
								kind: e.kind,
								metadata: e.metadata
							});
						default:
							dto.push(e);
					}
				});

			this._proxy.$acceptModelChanged(modelUrl.toString(), {
				rawEvents: dto,
				versionId: event.versionId
			});
		}));

		toDispose.add(model.onWillDispose(() => {
			this._stopModelSync(modelUrl);
		}));
		toDispose.add(toDisposable(() => {
			this._proxy.$acceptRemovedModel(modelUrl);
		}));

		this._syncedModels[modelUrl] = toDispose;
	}

	private _stopModelSync(modelUrl: string): void {
		const toDispose = this._syncedModels[modelUrl];
		delete this._syncedModels[modelUrl];
		delete this._syncedModelsLastUsedTime[modelUrl];
		dispose(toDispose);
	}
}

class NotebookWorkerClient extends Disposable {
	private _worker: IWebWorkerClient<NotebookWorker> | null;
	private _modelManager: NotebookEditorModelManager | null;


	constructor(
		private readonly _notebookService: INotebookService,
		private readonly _modelService: IModelService,
		private readonly _webWorkerService: IWebWorkerService,
	) {
		super();
		this._worker = null;
		this._modelManager = null;

	}

	computeDiff(original: URI, modified: URI) {
		const proxy = this._ensureSyncedResources([original, modified]);
		return proxy.$computeDiff(original.toString(), modified.toString());
	}

	canPromptRecommendation(modelUri: URI) {
		const proxy = this._ensureSyncedResources([modelUri]);
		return proxy.$canPromptRecommendation(modelUri.toString());
	}

	private _getOrCreateModelManager(proxy: Proxied<NotebookWorker>): NotebookEditorModelManager {
		if (!this._modelManager) {
			this._modelManager = this._register(new NotebookEditorModelManager(proxy, this._notebookService, this._modelService));
		}
		return this._modelManager;
	}

	protected _ensureSyncedResources(resources: URI[]): Proxied<NotebookWorker> {
		const proxy = this._getOrCreateWorker().proxy;
		this._getOrCreateModelManager(proxy).ensureSyncedResources(resources);
		return proxy;
	}

	private _getOrCreateWorker(): IWebWorkerClient<NotebookWorker> {
		if (!this._worker) {
			try {
				this._worker = this._register(this._webWorkerService.createWorkerClient<NotebookWorker>(
					new WebWorkerDescriptor({
						esmModuleLocation: FileAccess.asBrowserUri('vs/workbench/contrib/notebook/common/services/notebookWebWorkerMain.js'),
						label: 'NotebookEditorWorker'
					})
				));
			} catch (err) {
				throw (err);
			}
		}
		return this._worker;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellPart.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellPart.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { ICellViewModel } from '../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../notebookViewEvents.js';
import { ICellExecutionStateChangedEvent } from '../../common/notebookExecutionStateService.js';

/**
 * A content part is a non-floating element that is rendered inside a cell.
 * The rendering of the content part is synchronous to avoid flickering.
 */
export abstract class CellContentPart extends Disposable {
	protected currentCell: ICellViewModel | undefined;
	protected readonly cellDisposables = this._register(new DisposableStore());

	constructor() {
		super();
	}

	/**
	 * Prepare model for cell part rendering
	 * No DOM operations recommended within this operation
	 */
	prepareRenderCell(element: ICellViewModel): void { }

	/**
	 * Update the DOM for the cell `element`
	 */
	renderCell(element: ICellViewModel): void {
		this.currentCell = element;
		safeInvokeNoArg(() => this.didRenderCell(element));
	}

	didRenderCell(element: ICellViewModel): void { }

	/**
	 * Dispose any disposables generated from `didRenderCell`
	 */
	unrenderCell(element: ICellViewModel): void {
		this.currentCell = undefined;
		this.cellDisposables.clear();
	}

	/**
	 * Perform DOM read operations to prepare for the list/cell layout update.
	 */
	prepareLayout(): void { }

	/**
	 * Update internal DOM (top positions) per cell layout info change
	 * Note that a cell part doesn't need to call `DOM.scheduleNextFrame`,
	 * the list view will ensure that layout call is invoked in the right frame
	 */
	updateInternalLayoutNow(element: ICellViewModel): void { }

	/**
	 * Update per cell state change
	 */
	updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void { }

	/**
	 * Update per execution state change.
	 */
	updateForExecutionState(element: ICellViewModel, e: ICellExecutionStateChangedEvent): void { }
}

/**
 * An overlay part renders on top of other components.
 * The rendering of the overlay part might be postponed to the next animation frame to avoid forced reflow.
 */
export abstract class CellOverlayPart extends Disposable {
	protected currentCell: ICellViewModel | undefined;
	protected readonly cellDisposables = this._register(new DisposableStore());

	constructor() {
		super();
	}

	/**
	 * Prepare model for cell part rendering
	 * No DOM operations recommended within this operation
	 */
	prepareRenderCell(element: ICellViewModel): void { }

	/**
	 * Update the DOM for the cell `element`
	 */
	renderCell(element: ICellViewModel): void {
		this.currentCell = element;
		this.didRenderCell(element);
	}

	didRenderCell(element: ICellViewModel): void { }

	/**
	 * Dispose any disposables generated from `didRenderCell`
	 */
	unrenderCell(element: ICellViewModel): void {
		this.currentCell = undefined;
		this.cellDisposables.clear();
	}

	/**
	 * Update internal DOM (top positions) per cell layout info change
	 * Note that a cell part doesn't need to call `DOM.scheduleNextFrame`,
	 * the list view will ensure that layout call is invoked in the right frame
	 */
	updateInternalLayoutNow(element: ICellViewModel): void { }

	/**
	 * Update per cell state change
	 */
	updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void { }

	/**
	 * Update per execution state change.
	 */
	updateForExecutionState(element: ICellViewModel, e: ICellExecutionStateChangedEvent): void { }
}

function safeInvokeNoArg<T>(func: () => T): T | null {
	try {
		return func();
	} catch (e) {
		onUnexpectedError(e);
		return null;
	}
}

export class CellPartsCollection extends Disposable {
	private readonly _scheduledOverlayRendering = this._register(new MutableDisposable());
	private readonly _scheduledOverlayUpdateState = this._register(new MutableDisposable());
	private readonly _scheduledOverlayUpdateExecutionState = this._register(new MutableDisposable());

	constructor(
		private readonly targetWindow: Window,
		private readonly contentParts: readonly CellContentPart[],
		private readonly overlayParts: readonly CellOverlayPart[]
	) {
		super();
	}

	concatContentPart(other: readonly CellContentPart[], targetWindow: Window): CellPartsCollection {
		return new CellPartsCollection(targetWindow, this.contentParts.concat(other), this.overlayParts);
	}

	concatOverlayPart(other: readonly CellOverlayPart[], targetWindow: Window): CellPartsCollection {
		return new CellPartsCollection(targetWindow, this.contentParts, this.overlayParts.concat(other));
	}

	scheduleRenderCell(element: ICellViewModel): void {
		// prepare model
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.prepareRenderCell(element));
		}

		for (const part of this.overlayParts) {
			safeInvokeNoArg(() => part.prepareRenderCell(element));
		}

		// render content parts
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.renderCell(element));
		}

		this._scheduledOverlayRendering.value = DOM.modify(this.targetWindow, () => {
			for (const part of this.overlayParts) {
				safeInvokeNoArg(() => part.renderCell(element));
			}
		});
	}

	unrenderCell(element: ICellViewModel): void {
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.unrenderCell(element));
		}

		this._scheduledOverlayRendering.value = undefined;
		this._scheduledOverlayUpdateState.value = undefined;
		this._scheduledOverlayUpdateExecutionState.value = undefined;

		for (const part of this.overlayParts) {
			safeInvokeNoArg(() => part.unrenderCell(element));
		}
	}

	updateInternalLayoutNow(viewCell: ICellViewModel) {
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.updateInternalLayoutNow(viewCell));
		}

		for (const part of this.overlayParts) {
			safeInvokeNoArg(() => part.updateInternalLayoutNow(viewCell));
		}
	}

	prepareLayout() {
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.prepareLayout());
		}
	}

	updateState(viewCell: ICellViewModel, e: CellViewModelStateChangeEvent) {
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.updateState(viewCell, e));
		}

		this._scheduledOverlayUpdateState.value = DOM.modify(this.targetWindow, () => {
			for (const part of this.overlayParts) {
				safeInvokeNoArg(() => part.updateState(viewCell, e));
			}
		});
	}

	updateForExecutionState(viewCell: ICellViewModel, e: ICellExecutionStateChangedEvent) {
		for (const part of this.contentParts) {
			safeInvokeNoArg(() => part.updateForExecutionState(viewCell, e));
		}

		this._scheduledOverlayUpdateExecutionState.value = DOM.modify(this.targetWindow, () => {
			for (const part of this.overlayParts) {
				safeInvokeNoArg(() => part.updateForExecutionState(viewCell, e));
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/notebookCellAnchor.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/notebookCellAnchor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../../base/common/lifecycle.js';
import { CellFocusMode, ICellViewModel } from '../notebookBrowser.js';
import { CodeCellViewModel } from '../viewModel/codeCellViewModel.js';
import { CellKind, NotebookCellExecutionState, NotebookSetting } from '../../common/notebookCommon.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { Event } from '../../../../../base/common/event.js';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IListView } from '../../../../../base/browser/ui/list/listView.js';
import { CellViewModel } from '../viewModel/notebookViewModelImpl.js';


export class NotebookCellAnchor implements IDisposable {

	private stopAnchoring = false;
	private executionWatcher: IDisposable | undefined;
	private scrollWatcher: IDisposable | undefined;

	constructor(
		private readonly notebookExecutionStateService: INotebookExecutionStateService,
		private readonly configurationService: IConfigurationService,
		private readonly scrollEvent: Event<ScrollEvent>) {
	}

	public shouldAnchor(cellListView: IListView<CellViewModel>, focusedIndex: number, heightDelta: number, executingCellUri: ICellViewModel) {
		if (cellListView.element(focusedIndex).focusMode === CellFocusMode.Editor) {
			return true;
		}
		if (this.stopAnchoring) {
			return false;
		}

		const newFocusBottom = cellListView.elementTop(focusedIndex) + cellListView.elementHeight(focusedIndex) + heightDelta;
		const viewBottom = cellListView.renderHeight + cellListView.getScrollTop();
		const focusStillVisible = viewBottom > newFocusBottom;
		const allowScrolling = this.configurationService.getValue(NotebookSetting.scrollToRevealCell) !== 'none';
		const growing = heightDelta > 0;
		const autoAnchor = allowScrolling && growing && !focusStillVisible;

		if (autoAnchor) {
			this.watchAchorDuringExecution(executingCellUri);
			return true;
		}

		return false;
	}

	public watchAchorDuringExecution(executingCell: ICellViewModel) {
		// anchor while the cell is executing unless the user scrolls up.
		if (!this.executionWatcher && executingCell.cellKind === CellKind.Code) {
			const executionState = this.notebookExecutionStateService.getCellExecution(executingCell.uri);
			if (executionState && executionState.state === NotebookCellExecutionState.Executing) {
				this.executionWatcher = (executingCell as CodeCellViewModel).onDidStopExecution(() => {
					this.executionWatcher?.dispose();
					this.executionWatcher = undefined;
					this.scrollWatcher?.dispose();
					this.stopAnchoring = false;
				});
				this.scrollWatcher = this.scrollEvent((scrollEvent) => {
					if (scrollEvent.scrollTop < scrollEvent.oldScrollTop) {
						this.stopAnchoring = true;
						this.scrollWatcher?.dispose();
					}
				});
			}
		}
	}

	dispose(): void {
		this.executionWatcher?.dispose();
		this.scrollWatcher?.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/notebookCellEditorPool.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/notebookCellEditorPool.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import { CancelablePromise, createCancelablePromise } from '../../../../../base/common/async.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { EditorContextKeys } from '../../../../../editor/common/editorContextKeys.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService, IScopedContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { CellFocusMode, ICellViewModel, INotebookEditorDelegate } from '../notebookBrowser.js';
import { CellEditorOptions } from './cellParts/cellEditorOptions.js';

export class NotebookCellEditorPool extends Disposable {
	private readonly _focusedEditorDOM: HTMLElement;
	private readonly _editorDisposable = this._register(new MutableDisposable());
	private _editorContextKeyService!: IScopedContextKeyService;
	private _editor!: CodeEditorWidget;
	private _focusEditorCancellablePromise: CancelablePromise<void> | undefined;
	private _isInitialized = false;
	private _isDisposed = false;

	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		private readonly contextKeyServiceProvider: (container: HTMLElement) => IScopedContextKeyService,
		@ITextModelService private readonly textModelService: ITextModelService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._focusedEditorDOM = this.notebookEditor.getDomNode().appendChild(DOM.$('.cell-editor-part-cache'));
		this._focusedEditorDOM.style.position = 'absolute';
		this._focusedEditorDOM.style.top = '-50000px';
		this._focusedEditorDOM.style.width = '1px';
		this._focusedEditorDOM.style.height = '1px';
	}

	private _initializeEditor(cell: ICellViewModel) {
		this._editorContextKeyService = this._register(this.contextKeyServiceProvider(this._focusedEditorDOM));

		const editorContainer = DOM.prepend(this._focusedEditorDOM, DOM.$('.cell-editor-container'));
		const editorInstaService = this._register(this._instantiationService.createChild(new ServiceCollection([IContextKeyService, this._editorContextKeyService])));
		EditorContextKeys.inCompositeEditor.bindTo(this._editorContextKeyService).set(true);
		const editorOptions = new CellEditorOptions(this.notebookEditor.getBaseCellEditorOptions(cell.language), this.notebookEditor.notebookOptions, this._configurationService);

		this._editor = this._register(editorInstaService.createInstance(CodeEditorWidget, editorContainer, {
			...editorOptions.getDefaultValue(),
			dimension: {
				width: 0,
				height: 0
			},
			scrollbar: {
				vertical: 'hidden',
				horizontal: 'auto',
				handleMouseWheel: false,
				useShadows: false,
			},
			allowVariableLineHeights: false,
		}, {
			contributions: this.notebookEditor.creationOptions.cellEditorContributions
		}));
		editorOptions.dispose();
		this._isInitialized = true;
	}

	preserveFocusedEditor(cell: ICellViewModel): void {
		if (!this._isInitialized) {
			this._initializeEditor(cell);
		}

		this._editorDisposable.clear();
		this._focusEditorCancellablePromise?.cancel();

		this._focusEditorCancellablePromise = createCancelablePromise(async token => {
			const ref = await this.textModelService.createModelReference(cell.uri);

			if (this._isDisposed || token.isCancellationRequested) {
				ref.dispose();
				return;
			}

			const editorDisposable = new DisposableStore();
			editorDisposable.add(ref);
			this._editor.setModel(ref.object.textEditorModel);
			this._editor.setSelections(cell.getSelections());
			this._editor.focus();

			const _update = () => {
				const editorSelections = this._editor.getSelections();
				if (editorSelections) {
					cell.setSelections(editorSelections);
				}

				this.notebookEditor.revealInView(cell);
				this._editor.setModel(null);
				ref.dispose();
			};

			editorDisposable.add(this._editor.onDidChangeModelContent((e) => {
				_update();
			}));

			editorDisposable.add(this._editor.onDidChangeCursorSelection(e => {
				if (e.source === 'keyboard' || e.source === 'mouse') {
					_update();
				}
			}));

			editorDisposable.add(this.notebookEditor.onDidChangeActiveEditor(() => {
				const latestActiveCell = this.notebookEditor.getActiveCell();

				if (latestActiveCell !== cell || latestActiveCell.focusMode !== CellFocusMode.Editor) {
					// focus moves to another cell or cell container
					// we should stop preserving the editor
					this._editorDisposable.clear();
					this._editor.setModel(null);
					ref.dispose();
				}
			}));

			this._editorDisposable.value = editorDisposable;
		});
	}

	override dispose() {
		this._isDisposed = true;
		this._focusEditorCancellablePromise?.cancel();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/notebookCellList.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/notebookCellList.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../base/browser/dom.js';
import * as domStylesheetsJs from '../../../../../base/browser/domStylesheets.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { IListRenderer, IListVirtualDelegate, ListError } from '../../../../../base/browser/ui/list/list.js';
import { IListStyles, IStyleController } from '../../../../../base/browser/ui/list/listWidget.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, MutableDisposable } from '../../../../../base/common/lifecycle.js';
import { isMacintosh } from '../../../../../base/common/platform.js';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { TrackedRangeStickiness } from '../../../../../editor/common/model.js';
import { PrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IListService, IWorkbenchListOptions, WorkbenchList } from '../../../../../platform/list/browser/listService.js';
import { CursorAtBoundary, ICellViewModel, CellEditState, ICellOutputViewModel, CellRevealType, CellRevealRangeType, CursorAtLineBoundary, INotebookViewZoneChangeAccessor, INotebookCellOverlayChangeAccessor } from '../notebookBrowser.js';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';
import { diff, NOTEBOOK_EDITOR_CURSOR_BOUNDARY, CellKind, SelectionStateType, NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY } from '../../common/notebookCommon.js';
import { ICellRange, cellRangesToIndexes, reduceCellRanges, cellRangesEqual } from '../../common/notebookRange.js';
import { NOTEBOOK_CELL_LIST_FOCUSED } from '../../common/notebookContextKeys.js';
import { clamp } from '../../../../../base/common/numbers.js';
import { ISplice } from '../../../../../base/common/sequence.js';
import { BaseCellRenderTemplate, INotebookCellList } from './notebookRenderingCommon.js';
import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { MarkupCellViewModel } from '../viewModel/markupCellViewModel.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IListViewOptions, IListView } from '../../../../../base/browser/ui/list/listView.js';
import { NotebookCellListView } from './notebookCellListView.js';
import { NotebookOptions } from '../notebookOptions.js';
import { INotebookExecutionStateService } from '../../common/notebookExecutionStateService.js';
import { NotebookCellAnchor } from './notebookCellAnchor.js';
import { NotebookViewZones } from '../viewParts/notebookViewZones.js';
import { NotebookCellOverlays } from '../viewParts/notebookCellOverlays.js';

const enum CellRevealPosition {
	Top,
	Center,
	Bottom,
	NearTop
}

function getVisibleCells(cells: CellViewModel[], hiddenRanges: ICellRange[]) {
	if (!hiddenRanges.length) {
		return cells;
	}

	let start = 0;
	let hiddenRangeIndex = 0;
	const result: CellViewModel[] = [];

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

export const NOTEBOOK_WEBVIEW_BOUNDARY = 5000;

function validateWebviewBoundary(element: HTMLElement) {
	const webviewTop = 0 - (parseInt(element.style.top, 10) || 0);
	return webviewTop >= 0 && webviewTop <= NOTEBOOK_WEBVIEW_BOUNDARY * 2;
}

export class NotebookCellList extends WorkbenchList<CellViewModel> implements IDisposable, IStyleController, INotebookCellList {
	declare protected readonly view: NotebookCellListView<CellViewModel>;
	private viewZones!: NotebookViewZones;
	private cellOverlays!: NotebookCellOverlays;
	get onWillScroll(): Event<ScrollEvent> { return this.view.onWillScroll; }

	get rowsContainer(): HTMLElement {
		return this.view.containerDomNode;
	}

	get scrollableElement(): HTMLElement {
		return this.view.scrollableElementDomNode;
	}
	private _previousFocusedElements: readonly CellViewModel[] = [];
	private readonly _localDisposableStore = new DisposableStore();
	private readonly _viewModelStore = new DisposableStore();
	private styleElement?: HTMLStyleElement;
	private _notebookCellAnchor: NotebookCellAnchor;

	private readonly _onDidRemoveOutputs = this._localDisposableStore.add(new Emitter<readonly ICellOutputViewModel[]>());
	readonly onDidRemoveOutputs = this._onDidRemoveOutputs.event;

	private readonly _onDidHideOutputs = this._localDisposableStore.add(new Emitter<readonly ICellOutputViewModel[]>());
	readonly onDidHideOutputs = this._onDidHideOutputs.event;

	private readonly _onDidRemoveCellsFromView = this._localDisposableStore.add(new Emitter<readonly ICellViewModel[]>());
	readonly onDidRemoveCellsFromView = this._onDidRemoveCellsFromView.event;

	private _viewModel: NotebookViewModel | null = null;
	get viewModel(): NotebookViewModel | null {
		return this._viewModel;
	}
	private _hiddenRangeIds: string[] = [];
	private hiddenRangesPrefixSum: PrefixSumComputer | null = null;

	private readonly _onDidChangeVisibleRanges = this._localDisposableStore.add(new Emitter<void>());

	readonly onDidChangeVisibleRanges: Event<void> = this._onDidChangeVisibleRanges.event;
	private _visibleRanges: ICellRange[] = [];

	get visibleRanges() {
		return this._visibleRanges;
	}

	set visibleRanges(ranges: ICellRange[]) {
		if (cellRangesEqual(this._visibleRanges, ranges)) {
			return;
		}

		this._visibleRanges = ranges;
		this._onDidChangeVisibleRanges.fire();
	}

	private _isDisposed = false;

	get isDisposed() {
		return this._isDisposed;
	}

	private _isInLayout: boolean = false;

	private _webviewElement: FastDomNode<HTMLElement> | null = null;

	get webviewElement() {
		return this._webviewElement;
	}

	get inRenderingTransaction() {
		return this.view.inRenderingTransaction;
	}

	constructor(
		private listUser: string,
		container: HTMLElement,
		private readonly notebookOptions: NotebookOptions,
		delegate: IListVirtualDelegate<CellViewModel>,
		renderers: IListRenderer<CellViewModel, BaseCellRenderTemplate>[],
		contextKeyService: IContextKeyService,
		options: IWorkbenchListOptions<CellViewModel>,
		@IListService listService: IListService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookExecutionStateService notebookExecutionStateService: INotebookExecutionStateService,
	) {
		super(listUser, container, delegate, renderers, options, contextKeyService, listService, configurationService, instantiationService);
		NOTEBOOK_CELL_LIST_FOCUSED.bindTo(this.contextKeyService).set(true);
		this._previousFocusedElements = this.getFocusedElements();
		this._localDisposableStore.add(this.onDidChangeFocus((e) => {
			this._previousFocusedElements.forEach(element => {
				if (e.elements.indexOf(element) < 0) {
					element.onDeselect();
				}
			});
			this._previousFocusedElements = e.elements;
		}));

		const notebookEditorCursorAtBoundaryContext = NOTEBOOK_EDITOR_CURSOR_BOUNDARY.bindTo(contextKeyService);
		notebookEditorCursorAtBoundaryContext.set('none');

		const notebookEditorCursorAtLineBoundaryContext = NOTEBOOK_EDITOR_CURSOR_LINE_BOUNDARY.bindTo(contextKeyService);
		notebookEditorCursorAtLineBoundaryContext.set('none');

		const cursorSelectionListener = this._localDisposableStore.add(new MutableDisposable());
		const textEditorAttachListener = this._localDisposableStore.add(new MutableDisposable());

		this._notebookCellAnchor = new NotebookCellAnchor(notebookExecutionStateService, configurationService, this.onDidScroll);

		const recomputeContext = (element: CellViewModel) => {
			switch (element.cursorAtBoundary()) {
				case CursorAtBoundary.Both:
					notebookEditorCursorAtBoundaryContext.set('both');
					break;
				case CursorAtBoundary.Top:
					notebookEditorCursorAtBoundaryContext.set('top');
					break;
				case CursorAtBoundary.Bottom:
					notebookEditorCursorAtBoundaryContext.set('bottom');
					break;
				default:
					notebookEditorCursorAtBoundaryContext.set('none');
					break;
			}

			switch (element.cursorAtLineBoundary()) {
				case CursorAtLineBoundary.Both:
					notebookEditorCursorAtLineBoundaryContext.set('both');
					break;
				case CursorAtLineBoundary.Start:
					notebookEditorCursorAtLineBoundaryContext.set('start');
					break;
				case CursorAtLineBoundary.End:
					notebookEditorCursorAtLineBoundaryContext.set('end');
					break;
				default:
					notebookEditorCursorAtLineBoundaryContext.set('none');
					break;
			}

			return;
		};

		// Cursor Boundary context
		this._localDisposableStore.add(this.onDidChangeFocus((e) => {
			if (e.elements.length) {
				// we only validate the first focused element
				const focusedElement = e.elements[0];

				cursorSelectionListener.value = focusedElement.onDidChangeState((e) => {
					if (e.selectionChanged) {
						recomputeContext(focusedElement);
					}
				});

				textEditorAttachListener.value = focusedElement.onDidChangeEditorAttachState(() => {
					if (focusedElement.editorAttached) {
						recomputeContext(focusedElement);
					}
				});

				recomputeContext(focusedElement);
				return;
			}

			// reset context
			notebookEditorCursorAtBoundaryContext.set('none');
		}));

		// update visibleRanges
		const updateVisibleRanges = () => {
			if (!this.view.length) {
				return;
			}

			const top = this.getViewScrollTop();
			const bottom = this.getViewScrollBottom();
			if (top >= bottom) {
				return;
			}

			const topViewIndex = clamp(this.view.indexAt(top), 0, this.view.length - 1);
			const topElement = this.view.element(topViewIndex);
			const topModelIndex = this._viewModel!.getCellIndex(topElement);
			const bottomViewIndex = clamp(this.view.indexAt(bottom), 0, this.view.length - 1);
			const bottomElement = this.view.element(bottomViewIndex);
			const bottomModelIndex = this._viewModel!.getCellIndex(bottomElement);

			if (bottomModelIndex - topModelIndex === bottomViewIndex - topViewIndex) {
				this.visibleRanges = [{ start: topModelIndex, end: bottomModelIndex + 1 }];
			} else {
				this.visibleRanges = this._getVisibleRangesFromIndex(topViewIndex, topModelIndex, bottomViewIndex, bottomModelIndex);
			}
		};

		this._localDisposableStore.add(this.view.onDidChangeContentHeight(() => {
			if (this._isInLayout) {
				DOM.scheduleAtNextAnimationFrame(DOM.getWindow(container), () => {
					updateVisibleRanges();
				});
			}
			updateVisibleRanges();
		}));
		this._localDisposableStore.add(this.view.onDidScroll(() => {
			if (this._isInLayout) {
				DOM.scheduleAtNextAnimationFrame(DOM.getWindow(container), () => {
					updateVisibleRanges();
				});
			}
			updateVisibleRanges();
		}));
	}

	protected override createListView(container: HTMLElement, virtualDelegate: IListVirtualDelegate<CellViewModel>, renderers: IListRenderer<any, any>[], viewOptions: IListViewOptions<CellViewModel>): IListView<CellViewModel> {
		const listView = new NotebookCellListView(container, virtualDelegate, renderers, viewOptions);
		this.viewZones = new NotebookViewZones(listView, this);
		this.cellOverlays = new NotebookCellOverlays(listView);
		return listView;
	}

	/**
	 * Test Only
	 */
	_getView() {
		return this.view;
	}

	attachWebview(element: HTMLElement) {
		element.style.top = `-${NOTEBOOK_WEBVIEW_BOUNDARY}px`;
		this.rowsContainer.insertAdjacentElement('afterbegin', element);
		this._webviewElement = new FastDomNode<HTMLElement>(element);
	}

	elementAt(position: number): ICellViewModel | undefined {
		if (!this.view.length) {
			return undefined;
		}

		const idx = this.view.indexAt(position);
		const clamped = clamp(idx, 0, this.view.length - 1);
		return this.element(clamped);
	}

	elementHeight(element: ICellViewModel): number {
		const index = this._getViewIndexUpperBound(element);
		if (index === undefined || index < 0 || index >= this.length) {
			this._getViewIndexUpperBound(element);
			throw new ListError(this.listUser, `Invalid index ${index}`);
		}

		return this.view.elementHeight(index);
	}

	detachViewModel() {
		this._viewModelStore.clear();
		this._viewModel = null;
		this.hiddenRangesPrefixSum = null;
	}

	attachViewModel(model: NotebookViewModel) {
		this._viewModel = model;
		this._viewModelStore.add(model.onDidChangeViewCells((e) => {
			if (this._isDisposed) {
				return;
			}

			// update whitespaces which are anchored to the model indexes
			this.viewZones.onCellsChanged(e);
			this.cellOverlays.onCellsChanged(e);

			const currentRanges = this._hiddenRangeIds.map(id => this._viewModel!.getTrackedRange(id)).filter(range => range !== null) as ICellRange[];
			const newVisibleViewCells: CellViewModel[] = getVisibleCells(this._viewModel!.viewCells as CellViewModel[], currentRanges);

			const oldVisibleViewCells: CellViewModel[] = [];
			const oldViewCellMapping = new Set<string>();
			for (let i = 0; i < this.length; i++) {
				oldVisibleViewCells.push(this.element(i));
				oldViewCellMapping.add(this.element(i).uri.toString());
			}

			const viewDiffs = diff<CellViewModel>(oldVisibleViewCells, newVisibleViewCells, a => {
				return oldViewCellMapping.has(a.uri.toString());
			});

			if (e.synchronous) {
				this._updateElementsInWebview(viewDiffs);
			} else {
				this._viewModelStore.add(DOM.scheduleAtNextAnimationFrame(DOM.getWindow(this.rowsContainer), () => {
					if (this._isDisposed) {
						return;
					}

					this._updateElementsInWebview(viewDiffs);
				}));
			}
		}));

		this._viewModelStore.add(model.onDidChangeSelection((e) => {
			if (e === 'view') {
				return;
			}

			// convert model selections to view selections
			const viewSelections = cellRangesToIndexes(model.getSelections()).map(index => model.cellAt(index)).filter(cell => !!cell).map(cell => this._getViewIndexUpperBound(cell!));
			this.setSelection(viewSelections, undefined, true);
			const primary = cellRangesToIndexes([model.getFocus()]).map(index => model.cellAt(index)).filter(cell => !!cell).map(cell => this._getViewIndexUpperBound(cell!));

			if (primary.length) {
				this.setFocus(primary, undefined, true);
			}
		}));

		const hiddenRanges = model.getHiddenRanges();
		this.setHiddenAreas(hiddenRanges, false);
		const newRanges = reduceCellRanges(hiddenRanges);
		const viewCells = model.viewCells.slice(0) as CellViewModel[];
		newRanges.reverse().forEach(range => {
			const removedCells = viewCells.splice(range.start, range.end - range.start + 1);
			this._onDidRemoveCellsFromView.fire(removedCells);
		});

		this.splice2(0, 0, viewCells);
	}

	private _updateElementsInWebview(viewDiffs: ISplice<CellViewModel>[]) {
		viewDiffs.reverse().forEach((diff) => {
			const hiddenOutputs: ICellOutputViewModel[] = [];
			const deletedOutputs: ICellOutputViewModel[] = [];
			const removedMarkdownCells: ICellViewModel[] = [];

			for (let i = diff.start; i < diff.start + diff.deleteCount; i++) {
				const cell = this.element(i);
				if (cell.cellKind === CellKind.Code) {
					if (this._viewModel!.hasCell(cell)) {
						hiddenOutputs.push(...cell?.outputsViewModels);
					} else {
						deletedOutputs.push(...cell?.outputsViewModels);
					}
				} else {
					removedMarkdownCells.push(cell);
				}
			}

			this.splice2(diff.start, diff.deleteCount, diff.toInsert);

			this._onDidHideOutputs.fire(hiddenOutputs);
			this._onDidRemoveOutputs.fire(deletedOutputs);
			this._onDidRemoveCellsFromView.fire(removedMarkdownCells);
		});
	}

	clear() {
		super.splice(0, this.length);
	}

	setHiddenAreas(_ranges: ICellRange[], triggerViewUpdate: boolean): boolean {
		if (!this._viewModel) {
			return false;
		}

		const newRanges = reduceCellRanges(_ranges);
		// delete old tracking ranges
		const oldRanges = this._hiddenRangeIds.map(id => this._viewModel!.getTrackedRange(id)).filter(range => range !== null) as ICellRange[];
		if (newRanges.length === oldRanges.length) {
			let hasDifference = false;
			for (let i = 0; i < newRanges.length; i++) {
				if (!(newRanges[i].start === oldRanges[i].start && newRanges[i].end === oldRanges[i].end)) {
					hasDifference = true;
					break;
				}
			}

			if (!hasDifference) {
				// they call 'setHiddenAreas' for a reason, even if the ranges are still the same, it's possible that the hiddenRangeSum is not update to date
				this._updateHiddenRangePrefixSum(newRanges);
				this.viewZones.onHiddenRangesChange();
				this.viewZones.layout();
				this.cellOverlays.onHiddenRangesChange();
				this.cellOverlays.layout();
				return false;
			}
		}

		this._hiddenRangeIds.forEach(id => this._viewModel!.setTrackedRange(id, null, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter));
		const hiddenAreaIds = newRanges.map(range => this._viewModel!.setTrackedRange(null, range, TrackedRangeStickiness.GrowsOnlyWhenTypingAfter)).filter(id => id !== null) as string[];

		this._hiddenRangeIds = hiddenAreaIds;

		// set hidden ranges prefix sum
		this._updateHiddenRangePrefixSum(newRanges);
		// Update view zone positions after hidden ranges change
		this.viewZones.onHiddenRangesChange();
		this.cellOverlays.onHiddenRangesChange();

		if (triggerViewUpdate) {
			this.updateHiddenAreasInView(oldRanges, newRanges);
		}

		this.viewZones.layout();
		this.cellOverlays.layout();
		return true;
	}

	private _updateHiddenRangePrefixSum(newRanges: ICellRange[]) {
		let start = 0;
		let index = 0;
		const ret: number[] = [];

		while (index < newRanges.length) {
			for (let j = start; j < newRanges[index].start - 1; j++) {
				ret.push(1);
			}

			ret.push(newRanges[index].end - newRanges[index].start + 1 + 1);
			start = newRanges[index].end + 1;
			index++;
		}

		for (let i = start; i < this._viewModel!.length; i++) {
			ret.push(1);
		}

		const values = new Uint32Array(ret.length);
		for (let i = 0; i < ret.length; i++) {
			values[i] = ret[i];
		}

		this.hiddenRangesPrefixSum = new PrefixSumComputer(values);
	}

	/**
	 * oldRanges and newRanges are all reduced and sorted.
	 */
	updateHiddenAreasInView(oldRanges: ICellRange[], newRanges: ICellRange[]) {
		const oldViewCellEntries: CellViewModel[] = getVisibleCells(this._viewModel!.viewCells as CellViewModel[], oldRanges);
		const oldViewCellMapping = new Set<string>();
		oldViewCellEntries.forEach(cell => {
			oldViewCellMapping.add(cell.uri.toString());
		});

		const newViewCellEntries: CellViewModel[] = getVisibleCells(this._viewModel!.viewCells as CellViewModel[], newRanges);

		const viewDiffs = diff<CellViewModel>(oldViewCellEntries, newViewCellEntries, a => {
			return oldViewCellMapping.has(a.uri.toString());
		});

		this._updateElementsInWebview(viewDiffs);
	}

	splice2(start: number, deleteCount: number, elements: readonly CellViewModel[] = []): void {
		// we need to convert start and delete count based on hidden ranges
		if (start < 0 || start > this.view.length) {
			return;
		}

		const focusInside = DOM.isAncestorOfActiveElement(this.rowsContainer);
		super.splice(start, deleteCount, elements);
		if (focusInside) {
			this.domFocus();
		}

		const selectionsLeft = [];
		this.getSelectedElements().forEach(el => {
			if (this._viewModel!.hasCell(el)) {
				selectionsLeft.push(el.handle);
			}
		});

		if (!selectionsLeft.length && this._viewModel!.viewCells.length) {
			// after splice, the selected cells are deleted
			this._viewModel!.updateSelectionsState({ kind: SelectionStateType.Index, focus: { start: 0, end: 1 }, selections: [{ start: 0, end: 1 }] });
		}

		this.viewZones.layout();
		this.cellOverlays.layout();
	}

	getModelIndex(cell: CellViewModel): number | undefined {
		const viewIndex = this.indexOf(cell);
		return this.getModelIndex2(viewIndex);
	}

	getModelIndex2(viewIndex: number): number | undefined {
		if (!this.hiddenRangesPrefixSum) {
			return viewIndex;
		}

		const modelIndex = this.hiddenRangesPrefixSum.getPrefixSum(viewIndex - 1);
		return modelIndex;
	}

	getViewIndex(cell: ICellViewModel) {
		const modelIndex = this._viewModel!.getCellIndex(cell);
		return this.getViewIndex2(modelIndex);
	}

	getViewIndex2(modelIndex: number): number | undefined {
		if (!this.hiddenRangesPrefixSum) {
			return modelIndex;
		}

		const viewIndexInfo = this.hiddenRangesPrefixSum.getIndexOf(modelIndex);

		if (viewIndexInfo.remainder !== 0) {
			if (modelIndex >= this.hiddenRangesPrefixSum.getTotalSum()) {
				// it's already after the last hidden range
				return modelIndex - (this.hiddenRangesPrefixSum.getTotalSum() - this.hiddenRangesPrefixSum.getCount());
			}
			return undefined;
		} else {
			return viewIndexInfo.index;
		}
	}

	convertModelIndexToViewIndex(modelIndex: number): number {
		if (!this.hiddenRangesPrefixSum) {
			return modelIndex;
		}

		if (modelIndex >= this.hiddenRangesPrefixSum.getTotalSum()) {
			// it's already after the last hidden range
			return Math.min(this.length, this.hiddenRangesPrefixSum.getTotalSum());
		}

		return this.hiddenRangesPrefixSum.getIndexOf(modelIndex).index;
	}

	modelIndexIsVisible(modelIndex: number): boolean {
		if (!this.hiddenRangesPrefixSum) {
			return true;
		}

		const viewIndexInfo = this.hiddenRangesPrefixSum.getIndexOf(modelIndex);
		if (viewIndexInfo.remainder !== 0) {
			if (modelIndex >= this.hiddenRangesPrefixSum.getTotalSum()) {
				// it's already after the last hidden range
				return true;
			}
			return false;
		} else {
			return true;
		}
	}

	private _getVisibleRangesFromIndex(topViewIndex: number, topModelIndex: number, bottomViewIndex: number, bottomModelIndex: number) {
		const stack: number[] = [];
		const ranges: ICellRange[] = [];
		// there are hidden ranges
		let index = topViewIndex;
		let modelIndex = topModelIndex;

		while (index <= bottomViewIndex) {
			const accu = this.hiddenRangesPrefixSum!.getPrefixSum(index);
			if (accu === modelIndex + 1) {
				// no hidden area after it
				if (stack.length) {
					if (stack[stack.length - 1] === modelIndex - 1) {
						ranges.push({ start: stack[stack.length - 1], end: modelIndex + 1 });
					} else {
						ranges.push({ start: stack[stack.length - 1], end: stack[stack.length - 1] + 1 });
					}
				}

				stack.push(modelIndex);
				index++;
				modelIndex++;
			} else {
				// there are hidden ranges after it
				if (stack.length) {
					if (stack[stack.length - 1] === modelIndex - 1) {
						ranges.push({ start: stack[stack.length - 1], end: modelIndex + 1 });
					} else {
						ranges.push({ start: stack[stack.length - 1], end: stack[stack.length - 1] + 1 });
					}
				}

				stack.push(modelIndex);
				index++;
				modelIndex = accu;
			}
		}

		if (stack.length) {
			ranges.push({ start: stack[stack.length - 1], end: stack[stack.length - 1] + 1 });
		}

		return reduceCellRanges(ranges);
	}

	getVisibleRangesPlusViewportAboveAndBelow() {
		if (this.view.length <= 0) {
			return [];
		}

		const top = Math.max(this.getViewScrollTop() - this.renderHeight, 0);
		const topViewIndex = this.view.indexAt(top);
		const topElement = this.view.element(topViewIndex);
		const topModelIndex = this._viewModel!.getCellIndex(topElement);
		const bottom = clamp(this.getViewScrollBottom() + this.renderHeight, 0, this.scrollHeight);
		const bottomViewIndex = clamp(this.view.indexAt(bottom), 0, this.view.length - 1);
		const bottomElement = this.view.element(bottomViewIndex);
		const bottomModelIndex = this._viewModel!.getCellIndex(bottomElement);

		if (bottomModelIndex - topModelIndex === bottomViewIndex - topViewIndex) {
			return [{ start: topModelIndex, end: bottomModelIndex }];
		} else {
			return this._getVisibleRangesFromIndex(topViewIndex, topModelIndex, bottomViewIndex, bottomModelIndex);
		}
	}

	private _getViewIndexUpperBound(cell: ICellViewModel): number {
		if (!this._viewModel) {
			return -1;
		}

		const modelIndex = this._viewModel.getCellIndex(cell);
		if (modelIndex === -1) {
			return -1;
		}

		if (!this.hiddenRangesPrefixSum) {
			return modelIndex;
		}

		const viewIndexInfo = this.hiddenRangesPrefixSum.getIndexOf(modelIndex);

		if (viewIndexInfo.remainder !== 0) {
			if (modelIndex >= this.hiddenRangesPrefixSum.getTotalSum()) {
				return modelIndex - (this.hiddenRangesPrefixSum.getTotalSum() - this.hiddenRangesPrefixSum.getCount());
			}
		}

		return viewIndexInfo.index;
	}

	private _getViewIndexUpperBound2(modelIndex: number) {
		if (!this.hiddenRangesPrefixSum) {
			return modelIndex;
		}

		const viewIndexInfo = this.hiddenRangesPrefixSum.getIndexOf(modelIndex);

		if (viewIndexInfo.remainder !== 0) {
			if (modelIndex >= this.hiddenRangesPrefixSum.getTotalSum()) {
				return modelIndex - (this.hiddenRangesPrefixSum.getTotalSum() - this.hiddenRangesPrefixSum.getCount());
			}
		}

		return viewIndexInfo.index;
	}

	focusElement(cell: ICellViewModel) {
		const index = this._getViewIndexUpperBound(cell);

		if (index >= 0 && this._viewModel) {
			// update view model first, which will update both `focus` and `selection` in a single transaction
			const focusedElementHandle = this.element(index).handle;
			this._viewModel.updateSelectionsState({
				kind: SelectionStateType.Handle,
				primary: focusedElementHandle,
				selections: [focusedElementHandle]
			}, 'view');

			// update the view as previous model update will not trigger event
			this.setFocus([index], undefined, false);
		}
	}

	selectElements(elements: ICellViewModel[]) {
		const indices = elements.map(cell => this._getViewIndexUpperBound(cell)).filter(index => index >= 0);
		this.setSelection(indices);
	}

	getCellViewScrollTop(cell: ICellViewModel) {
		const index = this._getViewIndexUpperBound(cell);
		if (index === undefined || index < 0 || index >= this.length) {
			throw new ListError(this.listUser, `Invalid index ${index}`);
		}

		return this.view.elementTop(index);
	}

	getCellViewScrollBottom(cell: ICellViewModel) {
		const index = this._getViewIndexUpperBound(cell);
		if (index === undefined || index < 0 || index >= this.length) {
			throw new ListError(this.listUser, `Invalid index ${index}`);
		}

		const top = this.view.elementTop(index);
		const height = this.view.elementHeight(index);
		return top + height;
	}

	override setFocus(indexes: number[], browserEvent?: UIEvent, ignoreTextModelUpdate?: boolean): void {
		if (ignoreTextModelUpdate) {
			super.setFocus(indexes, browserEvent);
			return;
		}

		if (!indexes.length) {
			if (this._viewModel) {
				if (this.length) {
					// Don't allow clearing focus, #121129
					return;
				}

				this._viewModel.updateSelectionsState({
					kind: SelectionStateType.Handle,
					primary: null,
					selections: []
				}, 'view');
			}
		} else {
			if (this._viewModel) {
				const focusedElementHandle = this.element(indexes[0]).handle;
				this._viewModel.updateSelectionsState({
					kind: SelectionStateType.Handle,
					primary: focusedElementHandle,
					selections: this.getSelection().map(selection => this.element(selection).handle)
				}, 'view');
			}
		}

		super.setFocus(indexes, browserEvent);
	}

	override setSelection(indexes: number[], browserEvent?: UIEvent | undefined, ignoreTextModelUpdate?: boolean) {
		if (ignoreTextModelUpdate) {
			super.setSelection(indexes, browserEvent);
			return;
		}

		if (!indexes.length) {
			if (this._viewModel) {
				this._viewModel.updateSelectionsState({
					kind: SelectionStateType.Handle,
					primary: this.getFocusedElements()[0]?.handle ?? null,
					selections: []
				}, 'view');
			}
		} else {
			if (this._viewModel) {
				this._viewModel.updateSelectionsState({
					kind: SelectionStateType.Handle,
					primary: this.getFocusedElements()[0]?.handle ?? null,
					selections: indexes.map(index => this.element(index)).map(cell => cell.handle)
				}, 'view');
			}
		}

		super.setSelection(indexes, browserEvent);
	}

	/**
	 * The range will be revealed with as little scrolling as possible.
	 */
	revealCells(range: ICellRange) {
		const startIndex = this._getViewIndexUpperBound2(range.start);

		if (startIndex < 0) {
			return;
		}

		const endIndex = this._getViewIndexUpperBound2(range.end - 1);

		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();
		const elementTop = this.view.elementTop(startIndex);
		if (elementTop >= scrollTop
			&& elementTop < wrapperBottom) {
			// start element is visible
			// check end

			const endElementTop = this.view.elementTop(endIndex);
			const endElementHeight = this.view.elementHeight(endIndex);

			if (endElementTop + endElementHeight <= wrapperBottom) {
				// fully visible
				return;
			}

			if (endElementTop >= wrapperBottom) {
				return this._revealInternal(endIndex, false, CellRevealPosition.Bottom);
			}

			if (endElementTop < wrapperBottom) {
				// end element partially visible
				if (endElementTop + endElementHeight - wrapperBottom < elementTop - scrollTop) {
					// there is enough space to just scroll up a little bit to make the end element visible
					return this.view.setScrollTop(scrollTop + endElementTop + endElementHeight - wrapperBottom);
				} else {
					// don't even try it
					return this._revealInternal(startIndex, false, CellRevealPosition.Top);
				}
			}
		}

		this._revealInViewWithMinimalScrolling(startIndex);
	}

	private _revealInViewWithMinimalScrolling(viewIndex: number, firstLine?: boolean) {
		const firstIndex = this.view.firstMostlyVisibleIndex;
		const elementHeight = this.view.elementHeight(viewIndex);

		if (viewIndex <= firstIndex || (!firstLine && elementHeight >= this.view.renderHeight)) {
			this._revealInternal(viewIndex, true, CellRevealPosition.Top);
		} else {
			this._revealInternal(viewIndex, true, CellRevealPosition.Bottom, firstLine);
		}
	}

	scrollToBottom() {
		const scrollHeight = this.view.scrollHeight;
		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();

		this.view.setScrollTop(scrollHeight - (wrapperBottom - scrollTop));
	}

	/**
	 * Reveals the given cell in the notebook cell list. The cell will come into view syncronously
	 * but the cell's editor will be attached asyncronously if it was previously out of view.
	 * @returns The promise to await for the cell editor to be attached
	 */
	async revealCell(cell: ICellViewModel, revealType: CellRevealType): Promise<void> {
		const index = this._getViewIndexUpperBound(cell);

		if (index < 0) {
			return;
		}

		switch (revealType) {
			case CellRevealType.Top:
				this._revealInternal(index, false, CellRevealPosition.Top);
				break;
			case CellRevealType.Center:
				this._revealInternal(index, false, CellRevealPosition.Center);
				break;
			case CellRevealType.CenterIfOutsideViewport:
				this._revealInternal(index, true, CellRevealPosition.Center);
				break;
			case CellRevealType.NearTopIfOutsideViewport:
				this._revealInternal(index, true, CellRevealPosition.NearTop);
				break;
			case CellRevealType.FirstLineIfOutsideViewport:
				this._revealInViewWithMinimalScrolling(index, true);
				break;
			case CellRevealType.Default:
				this._revealInViewWithMinimalScrolling(index);
				break;
		}

		if ((
			// wait for the editor to be created if the cell is in editing mode
			cell.getEditState() === CellEditState.Editing
			// wait for the editor to be created if we are revealing the first line of the cell
			|| (revealType === CellRevealType.FirstLineIfOutsideViewport && cell.cellKind === CellKind.Code)
		) && !cell.editorAttached) {
			return getEditorAttachedPromise(cell);
		}

		return;
	}

	private _revealInternal(viewIndex: number, ignoreIfInsideViewport: boolean, revealPosition: CellRevealPosition, firstLine?: boolean) {
		if (viewIndex >= this.view.length) {
			return;
		}

		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();
		const elementTop = this.view.elementTop(viewIndex);
		const elementBottom = this.view.elementHeight(viewIndex) + elementTop;

		if (ignoreIfInsideViewport) {
			if (elementTop >= scrollTop && elementBottom < wrapperBottom) {
				// element is already fully visible
				return;
			}
		}

		switch (revealPosition) {
			case CellRevealPosition.Top:
				this.view.setScrollTop(elementTop);
				this.view.setScrollTop(this.view.elementTop(viewIndex));
				break;
			case CellRevealPosition.Center:
			case CellRevealPosition.NearTop:
				{
					// reveal the cell top in the viewport center initially
					this.view.setScrollTop(elementTop - this.view.renderHeight / 2);
					// cell rendered already, we now have a more accurate cell height
					const newElementTop = this.view.elementTop(viewIndex);
					const newElementHeight = this.view.elementHeight(viewIndex);
					const renderHeight = this.getViewScrollBottom() - this.getViewScrollTop();
					if (newElementHeight >= renderHeight) {
						// cell is larger than viewport, reveal top
						this.view.setScrollTop(newElementTop);
					} else if (revealPosition === CellRevealPosition.Center) {
						this.view.setScrollTop(newElementTop + (newElementHeight / 2) - (renderHeight / 2));
					} else if (revealPosition === CellRevealPosition.NearTop) {
						this.view.setScrollTop(newElementTop - (renderHeight / 5));
					}
				}
				break;
			case CellRevealPosition.Bottom:
				if (firstLine) {
					const lineHeight = this.viewModel?.layoutInfo?.fontInfo.lineHeight ?? 15;
					const padding = this.notebookOptions.getLayoutConfiguration().cellTopMargin + this.notebookOptions.getLayoutConfiguration().editorTopPadding;
					const firstLineLocation = elementTop + lineHeight + padding;
					if (firstLineLocation < wrapperBottom) {
						// first line is already visible
						return;
					}

					this.view.setScrollTop(this.scrollTop + (firstLineLocation - wrapperBottom));
					break;
				}
				this.view.setScrollTop(this.scrollTop + (elementBottom - wrapperBottom));
				this.view.setScrollTop(this.scrollTop + (this.view.elementTop(viewIndex) + this.view.elementHeight(viewIndex) - this.getViewScrollBottom()));
				break;
			default:
				break;
		}
	}

	//#region Reveal Cell Editor Range asynchronously
	async revealRangeInCell(cell: ICellViewModel, range: Selection | Range, revealType: CellRevealRangeType): Promise<void> {
		const index = this._getViewIndexUpperBound(cell);

		if (index < 0) {
			return;
		}

		switch (revealType) {
			case CellRevealRangeType.Default:
				return this._revealRangeInternalAsync(index, range);
			case CellRevealRangeType.Center:
				return this._revealRangeInCenterInternalAsync(index, range);
			case CellRevealRangeType.CenterIfOutsideViewport:
				return this._revealRangeInCenterIfOutsideViewportInternalAsync(index, range);
		}
	}

	// List items have real dynamic heights, which means after we set `scrollTop` based on the `elementTop(index)`, the element at `index` might still be removed from the view once all relayouting tasks are done.
	// For example, we scroll item 10 into the view upwards, in the first round, items 7, 8, 9, 10 are all in the viewport. Then item 7 and 8 resize themselves to be larger and finally item 10 is removed from the view.
	// To ensure that item 10 is always there, we need to scroll item 10 to the top edge of the viewport.
	private async _revealRangeInternalAsync(viewIndex: number, range: Selection | Range): Promise<void> {
		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();
		const elementTop = this.view.elementTop(viewIndex);
		const element = this.view.element(viewIndex);

		if (element.editorAttached) {
			this._revealRangeCommon(viewIndex, range);
		} else {
			const elementHeight = this.view.elementHeight(viewIndex);
			let alignHint: 'top' | 'bottom' | undefined = undefined;

			if (elementTop + elementHeight <= scrollTop) {
				// scroll up
				this.view.setScrollTop(elementTop);
				alignHint = 'top';
			} else if (elementTop >= wrapperBottom) {
				// scroll down
				this.view.setScrollTop(elementTop - this.view.renderHeight / 2);
				alignHint = 'bottom';
			}

			const editorAttachedPromise = new Promise<void>((resolve, reject) => {
				Event.once(element.onDidChangeEditorAttachState)(() => {
					element.editorAttached ? resolve() : reject();
				});
			});

			return editorAttachedPromise.then(() => {
				this._revealRangeCommon(viewIndex, range, alignHint);
			});
		}
	}

	private async _revealRangeInCenterInternalAsync(viewIndex: number, range: Selection | Range): Promise<void> {
		const reveal = (viewIndex: number, range: Range) => {
			const element = this.view.element(viewIndex);
			const positionOffset = element.getPositionScrollTopOffset(range);
			const positionOffsetInView = this.view.elementTop(viewIndex) + positionOffset;
			this.view.setScrollTop(positionOffsetInView - this.view.renderHeight / 2);
			element.revealRangeInCenter(range);
		};

		const elementTop = this.view.elementTop(viewIndex);
		const viewItemOffset = elementTop;
		this.view.setScrollTop(viewItemOffset - this.view.renderHeight / 2);
		const element = this.view.element(viewIndex);

		if (!element.editorAttached) {
			return getEditorAttachedPromise(element).then(() => reveal(viewIndex, range));
		} else {
			reveal(viewIndex, range);
		}
	}

	private async _revealRangeInCenterIfOutsideViewportInternalAsync(viewIndex: number, range: Selection | Range): Promise<void> {
		const reveal = (viewIndex: number, range: Range) => {
			const element = this.view.element(viewIndex);
			const positionOffset = element.getPositionScrollTopOffset(range);
			const positionOffsetInView = this.view.elementTop(viewIndex) + positionOffset;
			this.view.setScrollTop(positionOffsetInView - this.view.renderHeight / 2);

			element.revealRangeInCenter(range);
		};

		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();
		const elementTop = this.view.elementTop(viewIndex);
		const viewItemOffset = elementTop;
		const element = this.view.element(viewIndex);
		const positionOffset = viewItemOffset + element.getPositionScrollTopOffset(range);

		if (positionOffset < scrollTop || positionOffset > wrapperBottom) {
			// let it render
			this.view.setScrollTop(positionOffset - this.view.renderHeight / 2);

			// after rendering, it might be pushed down due to markdown cell dynamic height
			const newPositionOffset = this.view.elementTop(viewIndex) + element.getPositionScrollTopOffset(range);
			this.view.setScrollTop(newPositionOffset - this.view.renderHeight / 2);

			// reveal editor
			if (!element.editorAttached) {
				return getEditorAttachedPromise(element).then(() => reveal(viewIndex, range));
			} else {
				// for example markdown
			}
		} else {
			if (element.editorAttached) {
				element.revealRangeInCenter(range);
			} else {
				// for example, markdown cell in preview mode
				return getEditorAttachedPromise(element).then(() => reveal(viewIndex, range));
			}
		}
	}

	private _revealRangeCommon(viewIndex: number, range: Selection | Range, alignHint?: 'top' | 'bottom' | undefined) {
		const element = this.view.element(viewIndex);
		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();
		const positionOffset = element.getPositionScrollTopOffset(range);
		const elementOriginalHeight = this.view.elementHeight(viewIndex);
		if (positionOffset >= elementOriginalHeight) {
			// we are revealing a range that is beyond current element height
			// if we don't update the element height now, and directly `setTop` to reveal the range
			// the element might be scrolled out of view
			// next frame, when we update the element height, the element will never be scrolled back into view
			const newTotalHeight = element.layoutInfo.totalHeight;
			this.updateElementHeight(viewIndex, newTotalHeight);
		}
		const elementTop = this.view.elementTop(viewIndex);
		const positionTop = elementTop + positionOffset;

		// TODO@rebornix 30 ---> line height * 1.5
		if (positionTop < scrollTop) {
			this.view.setScrollTop(positionTop - 30);
		} else if (positionTop > wrapperBottom) {
			this.view.setScrollTop(scrollTop + positionTop - wrapperBottom + 30);
		} else if (alignHint === 'bottom') {
			// Scrolled into view from below
			this.view.setScrollTop(scrollTop + positionTop - wrapperBottom + 30);
		} else if (alignHint === 'top') {
			// Scrolled into view from above
			this.view.setScrollTop(positionTop - 30);
		}
	}
	//#endregion



	/**
	 * Reveals the specified offset of the given cell in the center of the viewport.
	 * This enables revealing locations in the output as well as the input.
	 */
	revealCellOffsetInCenter(cell: ICellViewModel, offset: number) {
		const viewIndex = this._getViewIndexUpperBound(cell);

		if (viewIndex >= 0) {
			const element = this.view.element(viewIndex);
			const elementTop = this.view.elementTop(viewIndex);
			if (element instanceof MarkupCellViewModel) {
				return this._revealInCenterIfOutsideViewport(viewIndex);
			} else {
				const rangeOffset = element.layoutInfo.outputContainerOffset + Math.min(offset, element.layoutInfo.outputTotalHeight);
				this.view.setScrollTop(elementTop - this.view.renderHeight / 2);
				this.view.setScrollTop(elementTop + rangeOffset - this.view.renderHeight / 2);
			}
		}
	}

	revealOffsetInCenterIfOutsideViewport(offset: number) {
		const scrollTop = this.getViewScrollTop();
		const wrapperBottom = this.getViewScrollBottom();

		if (offset < scrollTop || offset > wrapperBottom) {
			const newTop = Math.max(0, offset - this.view.renderHeight / 2);
			this.view.setScrollTop(newTop);
		}
	}

	private _revealInCenterIfOutsideViewport(viewIndex: number) {
		this._revealInternal(viewIndex, true, CellRevealPosition.Center);
	}

	domElementOfElement(element: ICellViewModel): HTMLElement | null {
		const index = this._getViewIndexUpperBound(element);
		if (index >= 0 && index < this.length) {
			return this.view.domElement(index);
		}

		return null;
	}

	focusView() {
		this.view.domNode.focus();
	}

	triggerScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent) {
		this.view.delegateScrollFromMouseWheelEvent(browserEvent);
	}

	delegateVerticalScrollbarPointerDown(browserEvent: PointerEvent) {
		this.view.delegateVerticalScrollbarPointerDown(browserEvent);
	}

	private isElementAboveViewport(index: number) {
		const elementTop = this.view.elementTop(index);
		const elementBottom = elementTop + this.view.elementHeight(index);

		return elementBottom < this.scrollTop;
	}

	updateElementHeight2(element: ICellViewModel, size: number, anchorElementIndex: number | null = null): void {
		const index = this._getViewIndexUpperBound(element);
		if (index === undefined || index < 0 || index >= this.length) {
			return;
		}

		if (this.isElementAboveViewport(index)) {
			// update element above viewport
			const oldHeight = this.elementHeight(element);
			const delta = oldHeight - size;
			if (this._webviewElement) {
				Event.once(this.view.onWillScroll)(() => {
					const webviewTop = parseInt(this._webviewElement!.domNode.style.top, 10);
					if (validateWebviewBoundary(this._webviewElement!.domNode)) {
						this._webviewElement!.setTop(webviewTop - delta);
					} else {
						// When the webview top boundary is below the list view scrollable element top boundary, then we can't insert a markdown cell at the top
						// or when its bottom boundary is above the list view bottom boundary, then we can't insert a markdown cell at the end
						// thus we have to revert the webview element position to initial state `-NOTEBOOK_WEBVIEW_BOUNDARY`.
						// this will trigger one visual flicker (as we need to update element offsets in the webview)
						// but as long as NOTEBOOK_WEBVIEW_BOUNDARY is large enough, it will happen less often
						this._webviewElement!.setTop(-NOTEBOOK_WEBVIEW_BOUNDARY);
					}
				});
			}
			this.view.updateElementHeight(index, size, anchorElementIndex);
			this.viewZones.layout();
			this.cellOverlays.layout();
			return;
		}

		if (anchorElementIndex !== null) {
			this.view.updateElementHeight(index, size, anchorElementIndex);
			this.viewZones.layout();
			this.cellOverlays.layout();
			return;
		}

		const focused = this.getFocus();
		const focus = focused.length ? focused[0] : null;

		if (focus) {
			// If the cell is growing, we should favor anchoring to the focused cell
			const heightDelta = size - this.view.elementHeight(index);

			if (this._notebookCellAnchor.shouldAnchor(this.view, focus, heightDelta, this.element(index))) {
				this.view.updateElementHeight(index, size, focus);
				this.viewZones.layout();
				this.cellOverlays.layout();
				return;
			}
		}

		this.view.updateElementHeight(index, size, null);
		this.viewZones.layout();
		this.cellOverlays.layout();
		return;
	}

	changeViewZones(callback: (accessor: INotebookViewZoneChangeAccessor) => void): void {
		if (this.viewZones.changeViewZones(callback)) {
			this.viewZones.layout();
		}
	}

	changeCellOverlays(callback: (accessor: INotebookCellOverlayChangeAccessor) => void): void {
		if (this.cellOverlays.changeCellOverlays(callback)) {
			this.cellOverlays.layout();
		}
	}

	getViewZoneLayoutInfo(viewZoneId: string): { height: number; top: number } | null {
		return this.viewZones.getViewZoneLayoutInfo(viewZoneId);
	}

	// override
	override domFocus() {
		const focused = this.getFocusedElements()[0];
		const focusedDomElement = focused && this.domElementOfElement(focused);

		if (this.view.domNode.ownerDocument.activeElement && focusedDomElement && focusedDomElement.contains(this.view.domNode.ownerDocument.activeElement)) {
			// for example, when focus goes into monaco editor, if we refocus the list view, the editor will lose focus.
			return;
		}

		if (!isMacintosh && this.view.domNode.ownerDocument.activeElement && !!DOM.findParentWithClass(<HTMLElement>this.view.domNode.ownerDocument.activeElement, 'context-view')) {
			return;
		}

		super.domFocus();
	}

	focusContainer(clearSelection: boolean) {
		if (clearSelection) {
			// allow focus to be between cells
			this._viewModel?.updateSelectionsState({
				kind: SelectionStateType.Handle,
				primary: null,
				selections: []
			}, 'view');
			this.setFocus([], undefined, true);
			this.setSelection([], undefined, true);
		}

		super.domFocus();
	}

	getViewScrollTop() {
		return this.view.getScrollTop();
	}

	getViewScrollBottom() {
		return this.getViewScrollTop() + this.view.renderHeight;
	}

	setCellEditorSelection(cell: ICellViewModel, range: Range) {
		const element = cell as CellViewModel;
		if (element.editorAttached) {
			element.setSelection(range);
		} else {
			getEditorAttachedPromise(element).then(() => { element.setSelection(range); });
		}
	}

	override style(styles: IListStyles) {
		const selectorSuffix = this.view.domId;
		if (!this.styleElement) {
			this.styleElement = domStylesheetsJs.createStyleSheet(this.view.domNode);
		}
		const suffix = selectorSuffix && `.${selectorSuffix}`;
		const content: string[] = [];

		if (styles.listBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows { background: ${styles.listBackground}; }`);
		}

		if (styles.listFocusBackground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { background-color: ${styles.listFocusBackground}; }`);
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused:hover { background-color: ${styles.listFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listFocusForeground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { color: ${styles.listFocusForeground}; }`);
		}

		if (styles.listActiveSelectionBackground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { background-color: ${styles.listActiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected:hover { background-color: ${styles.listActiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listActiveSelectionForeground) {
			content.push(`.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { color: ${styles.listActiveSelectionForeground}; }`);
		}

		if (styles.listFocusAndSelectionBackground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected.focused { background-color: ${styles.listFocusAndSelectionBackground}; }
			`);
		}

		if (styles.listFocusAndSelectionForeground) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected.focused { color: ${styles.listFocusAndSelectionForeground}; }
			`);
		}

		if (styles.listInactiveFocusBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { background-color:  ${styles.listInactiveFocusBackground}; }`);
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused:hover { background-color:  ${styles.listInactiveFocusBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionBackground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { background-color:  ${styles.listInactiveSelectionBackground}; }`);
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected:hover { background-color:  ${styles.listInactiveSelectionBackground}; }`); // overwrite :hover style in this case!
		}

		if (styles.listInactiveSelectionForeground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { color: ${styles.listInactiveSelectionForeground}; }`);
		}

		if (styles.listHoverBackground) {
			content.push(`.monaco-list${suffix}:not(.drop-target) > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover:not(.selected):not(.focused) { background-color:  ${styles.listHoverBackground}; }`);
		}

		if (styles.listHoverForeground) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover:not(.selected):not(.focused) { color:  ${styles.listHoverForeground}; }`);
		}

		if (styles.listSelectionOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.selected { outline: 1px dotted ${styles.listSelectionOutline}; outline-offset: -1px; }`);
		}

		if (styles.listFocusOutline) {
			content.push(`
				.monaco-drag-image${suffix},
				.monaco-list${suffix}:focus > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { outline: 1px solid ${styles.listFocusOutline}; outline-offset: -1px; }
			`);
		}

		if (styles.listInactiveFocusOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row.focused { outline: 1px dotted ${styles.listInactiveFocusOutline}; outline-offset: -1px; }`);
		}

		if (styles.listHoverOutline) {
			content.push(`.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows > .monaco-list-row:hover { outline: 1px dashed ${styles.listHoverOutline}; outline-offset: -1px; }`);
		}

		if (styles.listDropOverBackground) {
			content.push(`
				.monaco-list${suffix}.drop-target,
				.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-rows.drop-target,
				.monaco-list${suffix} > div.monaco-scrollable-element > .monaco-list-row.drop-target { background-color: ${styles.listDropOverBackground} !important; color: inherit !important; }
			`);
		}

		const newStyles = content.join('\n');
		if (newStyles !== this.styleElement.textContent) {
			this.styleElement.textContent = newStyles;
		}
	}

	getRenderHeight() {
		return this.view.renderHeight;
	}

	getScrollHeight() {
		return this.view.scrollHeight;
	}

	override layout(height?: number, width?: number): void {
		this._isInLayout = true;
		super.layout(height, width);
		if (this.renderHeight === 0) {
			this.view.domNode.style.visibility = 'hidden';
		} else {
			this.view.domNode.style.visibility = 'initial';
		}
		this._isInLayout = false;
	}

	override dispose() {
		this._isDisposed = true;
		this._viewModelStore.dispose();
		this._localDisposableStore.dispose();
		this._notebookCellAnchor.dispose();
		this.viewZones.dispose();
		this.cellOverlays.dispose();
		super.dispose();

		// un-ref
		this._previousFocusedElements = [];
		this._viewModel = null;
		this._hiddenRangeIds = [];
		this.hiddenRangesPrefixSum = null;
		this._visibleRanges = [];
	}
}


export class ListViewInfoAccessor extends Disposable {
	constructor(
		readonly list: INotebookCellList
	) {
		super();
	}

	getViewIndex(cell: ICellViewModel): number {
		return this.list.getViewIndex(cell) ?? -1;
	}

	getViewHeight(cell: ICellViewModel): number {
		if (!this.list.viewModel) {
			return -1;
		}

		return this.list.elementHeight(cell);
	}

	getCellRangeFromViewRange(startIndex: number, endIndex: number): ICellRange | undefined {
		if (!this.list.viewModel) {
			return undefined;
		}

		const modelIndex = this.list.getModelIndex2(startIndex);
		if (modelIndex === undefined) {
			throw new Error(`startIndex ${startIndex} out of boundary`);
		}

		if (endIndex >= this.list.length) {
			// it's the end
			const endModelIndex = this.list.viewModel.length;
			return { start: modelIndex, end: endModelIndex };
		} else {
			const endModelIndex = this.list.getModelIndex2(endIndex);
			if (endModelIndex === undefined) {
				throw new Error(`endIndex ${endIndex} out of boundary`);
			}
			return { start: modelIndex, end: endModelIndex };
		}
	}

	getCellsFromViewRange(startIndex: number, endIndex: number): ReadonlyArray<ICellViewModel> {
		if (!this.list.viewModel) {
			return [];
		}

		const range = this.getCellRangeFromViewRange(startIndex, endIndex);
		if (!range) {
			return [];
		}

		return this.list.viewModel.getCellsInRange(range);
	}

	getCellsInRange(range?: ICellRange): ReadonlyArray<ICellViewModel> {
		return this.list.viewModel?.getCellsInRange(range) ?? [];
	}

	getVisibleRangesPlusViewportAboveAndBelow(): ICellRange[] {
		return this.list?.getVisibleRangesPlusViewportAboveAndBelow() ?? [];
	}
}

function getEditorAttachedPromise(element: ICellViewModel) {
	return new Promise<void>((resolve, reject) => {
		Event.once(element.onDidChangeEditorAttachState)(() => element.editorAttached ? resolve() : reject());
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/notebookCellListView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/notebookCellListView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IRange } from '../../../../../base/common/range.js';
import { ListView } from '../../../../../base/browser/ui/list/listView.js';
import { IItem, IRangeMap } from '../../../../../base/browser/ui/list/rangeMap.js';
import { ConstantTimePrefixSumComputer } from '../../../../../editor/common/model/prefixSumComputer.js';

export interface IWhitespace {
	id: string;
	/**
	 * To insert whitespace before the first item, use afterPosition 0.
	 * In other cases, afterPosition is 1-based.
	 */
	afterPosition: number;
	size: number;
	priority: number;
}
export class NotebookCellsLayout implements IRangeMap {
	private _items: IItem[] = [];
	private _whitespace: IWhitespace[] = [];
	protected _prefixSumComputer: ConstantTimePrefixSumComputer = new ConstantTimePrefixSumComputer([]);
	private _size = 0;
	private _paddingTop = 0;

	get paddingTop() {
		return this._paddingTop;
	}

	set paddingTop(paddingTop: number) {
		this._size = this._size + paddingTop - this._paddingTop;
		this._paddingTop = paddingTop;
	}

	get count(): number {
		return this._items.length;
	}

	/**
	 * Returns the sum of the sizes of all items in the range map.
	 */
	get size(): number {
		return this._size;
	}

	constructor(topPadding?: number) {
		this._paddingTop = topPadding ?? 0;
		this._size = this._paddingTop;
	}

	getWhitespaces(): IWhitespace[] {
		return this._whitespace;
	}

	restoreWhitespace(items: IWhitespace[]) {
		this._whitespace = items;
		this._size = this._paddingTop + this._items.reduce((total, item) => total + item.size, 0) + this._whitespace.reduce((total, ws) => total + ws.size, 0);
	}

	/**
	 */
	splice(index: number, deleteCount: number, items?: IItem[] | undefined): void {
		const inserts = items ?? [];
		// Perform the splice operation on the items array.
		this._items.splice(index, deleteCount, ...inserts);

		this._size = this._paddingTop + this._items.reduce((total, item) => total + item.size, 0) + this._whitespace.reduce((total, ws) => total + ws.size, 0);
		this._prefixSumComputer.removeValues(index, deleteCount);

		// inserts should also include whitespaces
		const newSizes = [];
		for (let i = 0; i < inserts.length; i++) {
			const insertIndex = i + index;
			const existingWhitespaces = this._whitespace.filter(ws => ws.afterPosition === insertIndex + 1);


			if (existingWhitespaces.length > 0) {
				newSizes.push(inserts[i].size + existingWhitespaces.reduce((acc, ws) => acc + ws.size, 0));
			} else {
				newSizes.push(inserts[i].size);
			}
		}
		this._prefixSumComputer.insertValues(index, newSizes);

		// Now that the items array has been updated, and the whitespaces are updated elsewhere, if an item is removed/inserted, the accumlated size of the items are all updated.
		// Loop through all items from the index where the splice started, to the end
		for (let i = index; i < this._items.length; i++) {
			const existingWhitespaces = this._whitespace.filter(ws => ws.afterPosition === i + 1);
			if (existingWhitespaces.length > 0) {
				this._prefixSumComputer.setValue(i, this._items[i].size + existingWhitespaces.reduce((acc, ws) => acc + ws.size, 0));
			} else {
				this._prefixSumComputer.setValue(i, this._items[i].size);
			}
		}
	}

	insertWhitespace(id: string, afterPosition: number, size: number): void {
		let priority = 0;
		const existingWhitespaces = this._whitespace.filter(ws => ws.afterPosition === afterPosition);
		if (existingWhitespaces.length > 0) {
			priority = Math.max(...existingWhitespaces.map(ws => ws.priority)) + 1;
		}

		this._whitespace.push({ id, afterPosition: afterPosition, size, priority });
		this._size += size; // Update the total size to include the whitespace
		this._whitespace.sort((a, b) => {
			if (a.afterPosition === b.afterPosition) {
				return a.priority - b.priority;
			}
			return a.afterPosition - b.afterPosition;
		});

		// find item size of index
		if (afterPosition > 0) {
			const index = afterPosition - 1;
			const itemSize = this._items[index].size;
			const accSize = itemSize + size;
			this._prefixSumComputer.setValue(index, accSize);
		}
	}

	changeOneWhitespace(id: string, afterPosition: number, size: number): void {
		const whitespaceIndex = this._whitespace.findIndex(ws => ws.id === id);
		if (whitespaceIndex !== -1) {
			const whitespace = this._whitespace[whitespaceIndex];
			const oldAfterPosition = whitespace.afterPosition;
			whitespace.afterPosition = afterPosition;
			const oldSize = whitespace.size;
			const delta = size - oldSize;
			whitespace.size = size;
			this._size += delta;

			if (oldAfterPosition > 0 && oldAfterPosition <= this._items.length) {
				const index = oldAfterPosition - 1;
				const itemSize = this._items[index].size;
				const accSize = itemSize;
				this._prefixSumComputer.setValue(index, accSize);
			}

			if (afterPosition > 0 && afterPosition <= this._items.length) {
				const index = afterPosition - 1;
				const itemSize = this._items[index].size;
				const accSize = itemSize + size;
				this._prefixSumComputer.setValue(index, accSize);
			}
		}
	}

	removeWhitespace(id: string): void {
		const whitespaceIndex = this._whitespace.findIndex(ws => ws.id === id);
		if (whitespaceIndex !== -1) {
			const whitespace = this._whitespace[whitespaceIndex];
			this._whitespace.splice(whitespaceIndex, 1);
			this._size -= whitespace.size; // Reduce the total size by the size of the removed whitespace

			if (whitespace.afterPosition > 0) {
				const index = whitespace.afterPosition - 1;
				const itemSize = this._items[index].size;
				const remainingWhitespaces = this._whitespace.filter(ws => ws.afterPosition === whitespace.afterPosition);
				const accSize = itemSize + remainingWhitespaces.reduce((acc, ws) => acc + ws.size, 0);
				this._prefixSumComputer.setValue(index, accSize);
			}
		}
	}

	/**
	 * find position of whitespace
	 * @param id: id of the whitespace
	 * @returns: position in the list view
	 */
	getWhitespacePosition(id: string): number {
		const whitespace = this._whitespace.find(ws => ws.id === id);
		if (!whitespace) {
			throw new Error('Whitespace not found');
		}

		const afterPosition = whitespace.afterPosition;
		if (afterPosition === 0) {
			// find all whitespaces at the same position but with higher priority (smaller number)
			const whitespaces = this._whitespace.filter(ws => ws.afterPosition === afterPosition && ws.priority < whitespace.priority);
			return whitespaces.reduce((acc, ws) => acc + ws.size, 0) + this.paddingTop;
		}

		const whitespaceBeforeFirstItem = this._whitespace.filter(ws => ws.afterPosition === 0).reduce((acc, ws) => acc + ws.size, 0);

		// previous item index
		const index = afterPosition - 1;
		const previousItemPosition = this._prefixSumComputer.getPrefixSum(index);
		const previousItemSize = this._items[index].size;
		return previousItemPosition + previousItemSize + whitespaceBeforeFirstItem + this.paddingTop;
	}

	indexAt(position: number): number {
		if (position < 0) {
			return -1;
		}

		const whitespaceBeforeFirstItem = this._whitespace.filter(ws => ws.afterPosition === 0).reduce((acc, ws) => acc + ws.size, 0);

		const offset = position - (this._paddingTop + whitespaceBeforeFirstItem);
		if (offset <= 0) {
			return 0;
		}

		if (offset >= (this._size - this._paddingTop - whitespaceBeforeFirstItem)) {
			return this.count;
		}

		return this._prefixSumComputer.getIndexOf(Math.trunc(offset)).index;
	}

	indexAfter(position: number): number {
		const index = this.indexAt(position);
		return Math.min(index + 1, this._items.length);
	}

	positionAt(index: number): number {
		if (index < 0) {
			return -1;
		}

		if (this.count === 0) {
			return -1;
		}

		// index is zero based, if index+1 > this.count, then it points to the fictitious element after the last element of this array.
		if (index >= this.count) {
			return -1;
		}

		const whitespaceBeforeFirstItem = this._whitespace.filter(ws => ws.afterPosition === 0).reduce((acc, ws) => acc + ws.size, 0);
		return this._prefixSumComputer.getPrefixSum(index/** count */) + this._paddingTop + whitespaceBeforeFirstItem;
	}
}

export class NotebookCellListView<T> extends ListView<T> {
	private _lastWhitespaceId: number = 0;
	private _renderingStack = 0;

	get inRenderingTransaction(): boolean {
		return this._renderingStack > 0;
	}

	get notebookRangeMap(): NotebookCellsLayout {
		return this.rangeMap as NotebookCellsLayout;
	}

	protected override render(previousRenderRange: IRange, renderTop: number, renderHeight: number, renderLeft: number | undefined, scrollWidth: number | undefined, updateItemsInDOM?: boolean): void {
		this._renderingStack++;
		super.render(previousRenderRange, renderTop, renderHeight, renderLeft, scrollWidth, updateItemsInDOM);
		this._renderingStack--;
	}

	protected override _rerender(renderTop: number, renderHeight: number, inSmoothScrolling?: boolean | undefined): void {
		this._renderingStack++;
		super._rerender(renderTop, renderHeight, inSmoothScrolling);
		this._renderingStack--;
	}

	protected override createRangeMap(paddingTop: number): IRangeMap {
		const existingMap = this.rangeMap as NotebookCellsLayout | undefined;
		if (existingMap) {
			const layout = new NotebookCellsLayout(paddingTop);
			layout.restoreWhitespace(existingMap.getWhitespaces());
			return layout;
		} else {
			return new NotebookCellsLayout(paddingTop);
		}

	}

	insertWhitespace(afterPosition: number, size: number): string {
		const scrollTop = this.scrollTop;
		const id = `${++this._lastWhitespaceId}`;
		const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
		const elementPosition = this.elementTop(afterPosition);
		const aboveScrollTop = scrollTop > elementPosition;
		this.notebookRangeMap.insertWhitespace(id, afterPosition, size);

		const newScrolltop = aboveScrollTop ? scrollTop + size : scrollTop;
		this.render(previousRenderRange, newScrolltop, this.lastRenderHeight, undefined, undefined, false);
		this._rerender(newScrolltop, this.renderHeight, false);
		this.eventuallyUpdateScrollDimensions();

		return id;
	}

	changeOneWhitespace(id: string, newAfterPosition: number, newSize: number) {
		const scrollTop = this.scrollTop;
		const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
		const currentPosition = this.notebookRangeMap.getWhitespacePosition(id);

		if (currentPosition > scrollTop) {
			this.notebookRangeMap.changeOneWhitespace(id, newAfterPosition, newSize);
			this.render(previousRenderRange, scrollTop, this.lastRenderHeight, undefined, undefined, false);
			this._rerender(scrollTop, this.renderHeight, false);
			this.eventuallyUpdateScrollDimensions();
		} else {
			this.notebookRangeMap.changeOneWhitespace(id, newAfterPosition, newSize);
			this.eventuallyUpdateScrollDimensions();
		}
	}

	removeWhitespace(id: string): void {
		const scrollTop = this.scrollTop;
		const previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);

		this.notebookRangeMap.removeWhitespace(id);
		this.render(previousRenderRange, scrollTop, this.lastRenderHeight, undefined, undefined, false);
		this._rerender(scrollTop, this.renderHeight, false);
		this.eventuallyUpdateScrollDimensions();
	}

	getWhitespacePosition(id: string): number {
		return this.notebookRangeMap.getWhitespacePosition(id);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/notebookRenderingCommon.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/notebookRenderingCommon.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FastDomNode } from '../../../../../base/browser/fastDomNode.js';
import { IMouseWheelEvent } from '../../../../../base/browser/mouseEvent.js';
import { IListContextMenuEvent, IListEvent, IListMouseEvent } from '../../../../../base/browser/ui/list/list.js';
import { IListStyles } from '../../../../../base/browser/ui/list/listWidget.js';
import { Event } from '../../../../../base/common/event.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ScrollEvent } from '../../../../../base/common/scrollable.js';
import { ICodeEditor } from '../../../../../editor/browser/editorBrowser.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { Selection } from '../../../../../editor/common/core/selection.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IWorkbenchListOptionsUpdate } from '../../../../../platform/list/browser/listService.js';
import { CellRevealRangeType, CellRevealType, ICellOutputViewModel, ICellViewModel, INotebookCellOverlayChangeAccessor, INotebookViewZoneChangeAccessor } from '../notebookBrowser.js';
import { CellPartsCollection } from './cellPart.js';
import { CellViewModel, NotebookViewModel } from '../viewModel/notebookViewModelImpl.js';
import { ICellRange } from '../../common/notebookRange.js';
import { createTrustedTypesPolicy } from '../../../../../base/browser/trustedTypes.js';


export interface INotebookCellList extends ICoordinatesConverter {
	isDisposed: boolean;
	inRenderingTransaction: boolean;
	viewModel: NotebookViewModel | null;
	webviewElement: FastDomNode<HTMLElement> | null;
	readonly contextKeyService: IContextKeyService;
	element(index: number): ICellViewModel | undefined;
	elementAt(position: number): ICellViewModel | undefined;
	elementHeight(element: ICellViewModel): number;
	readonly onWillScroll: Event<ScrollEvent>;
	readonly onDidScroll: Event<ScrollEvent>;
	readonly onDidChangeFocus: Event<IListEvent<ICellViewModel>>;
	readonly onDidChangeContentHeight: Event<number>;
	readonly onDidChangeVisibleRanges: Event<void>;
	visibleRanges: ICellRange[];
	scrollTop: number;
	scrollHeight: number;
	scrollLeft: number;
	length: number;
	rowsContainer: HTMLElement;
	scrollableElement: HTMLElement;
	ariaLabel: string;
	readonly onDidRemoveOutputs: Event<readonly ICellOutputViewModel[]>;
	readonly onDidHideOutputs: Event<readonly ICellOutputViewModel[]>;
	readonly onDidRemoveCellsFromView: Event<readonly ICellViewModel[]>;
	readonly onMouseUp: Event<IListMouseEvent<CellViewModel>>;
	readonly onMouseDown: Event<IListMouseEvent<CellViewModel>>;
	readonly onContextMenu: Event<IListContextMenuEvent<CellViewModel>>;
	detachViewModel(): void;
	attachViewModel(viewModel: NotebookViewModel): void;
	attachWebview(element: HTMLElement): void;
	clear(): void;
	focusElement(element: ICellViewModel): void;
	selectElements(elements: ICellViewModel[]): void;
	getFocusedElements(): ICellViewModel[];
	getSelectedElements(): ICellViewModel[];
	scrollToBottom(): void;
	revealCell(cell: ICellViewModel, revealType: CellRevealType): Promise<void>;
	revealCells(range: ICellRange): void;
	revealRangeInCell(cell: ICellViewModel, range: Selection | Range, revealType: CellRevealRangeType): Promise<void>;
	revealCellOffsetInCenter(element: ICellViewModel, offset: number): void;
	revealOffsetInCenterIfOutsideViewport(offset: number): void;
	setHiddenAreas(_ranges: ICellRange[], triggerViewUpdate: boolean): boolean;
	changeViewZones(callback: (accessor: INotebookViewZoneChangeAccessor) => void): void;
	changeCellOverlays(callback: (accessor: INotebookCellOverlayChangeAccessor) => void): void;
	getViewZoneLayoutInfo(viewZoneId: string): { height: number; top: number } | null;
	domElementOfElement(element: ICellViewModel): HTMLElement | null;
	focusView(): void;
	triggerScrollFromMouseWheelEvent(browserEvent: IMouseWheelEvent): void;
	updateElementHeight2(element: ICellViewModel, size: number, anchorElementIndex?: number | null): void;
	domFocus(): void;
	focusContainer(clearSelection: boolean): void;
	setCellEditorSelection(element: ICellViewModel, range: Range): void;
	style(styles: IListStyles): void;
	getRenderHeight(): number;
	getScrollHeight(): number;
	updateOptions(options: IWorkbenchListOptionsUpdate): void;
	layout(height?: number, width?: number): void;
	dispose(): void;
}

export interface BaseCellRenderTemplate {
	readonly rootContainer: HTMLElement;
	readonly editorPart: HTMLElement;
	readonly cellInputCollapsedContainer: HTMLElement;
	readonly instantiationService: IInstantiationService;
	readonly container: HTMLElement;
	readonly cellContainer: HTMLElement;
	readonly templateDisposables: DisposableStore;
	readonly elementDisposables: DisposableStore;
	currentRenderedCell?: ICellViewModel;
	cellParts: CellPartsCollection;
	toJSON: () => object;
}

export interface MarkdownCellRenderTemplate extends BaseCellRenderTemplate {
	readonly editorContainer: HTMLElement;
	readonly foldingIndicator: HTMLElement;
	currentEditor?: ICodeEditor;
}

export interface CodeCellRenderTemplate extends BaseCellRenderTemplate {
	outputContainer: FastDomNode<HTMLElement>;
	cellOutputCollapsedContainer: HTMLElement;
	outputShowMoreContainer: FastDomNode<HTMLElement>;
	focusSinkElement: HTMLElement;
	editor: ICodeEditor;
}

export interface ICoordinatesConverter {
	getCellViewScrollTop(cell: ICellViewModel): number;
	getCellViewScrollBottom(cell: ICellViewModel): number;
	getViewIndex(cell: ICellViewModel): number | undefined;
	getViewIndex2(modelIndex: number): number | undefined;
	getModelIndex(cell: CellViewModel): number | undefined;
	getModelIndex2(viewIndex: number): number | undefined;
	getVisibleRangesPlusViewportAboveAndBelow(): ICellRange[];
	modelIndexIsVisible(modelIndex: number): boolean;
	convertModelIndexToViewIndex(modelIndex: number): number;
}

export const collapsedCellTTPolicy = createTrustedTypesPolicy('collapsedCellPreview', { createHTML: value => value });
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellActionView.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellActionView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import * as types from '../../../../../../base/common/types.js';
import { EventType as TouchEventType } from '../../../../../../base/browser/touch.js';
import { IActionViewItemProvider } from '../../../../../../base/browser/ui/actionbar/actionbar.js';
import { IActionProvider } from '../../../../../../base/browser/ui/dropdown/dropdown.js';
import { getDefaultHoverDelegate } from '../../../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { renderLabelWithIcons } from '../../../../../../base/browser/ui/iconLabel/iconLabels.js';
import { IAction } from '../../../../../../base/common/actions.js';
import { ThemeIcon } from '../../../../../../base/common/themables.js';
import { IMenuEntryActionViewItemOptions, MenuEntryActionViewItem, SubmenuEntryActionViewItem } from '../../../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { MenuItemAction, SubmenuItemAction } from '../../../../../../platform/actions/common/actions.js';
import { IContextMenuService } from '../../../../../../platform/contextview/browser/contextView.js';
import { IKeybindingService } from '../../../../../../platform/keybinding/common/keybinding.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import type { IManagedHover } from '../../../../../../base/browser/ui/hover/hover.js';
import { IHoverService } from '../../../../../../platform/hover/browser/hover.js';

export class CodiconActionViewItem extends MenuEntryActionViewItem {

	protected override updateLabel(): void {
		if (this.options.label && this.label) {
			DOM.reset(this.label, ...renderLabelWithIcons(this._commandAction.label ?? ''));
		}
	}
}

export class ActionViewWithLabel extends MenuEntryActionViewItem {
	private _actionLabel?: HTMLAnchorElement;

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('notebook-action-view-item');
		this._actionLabel = document.createElement('a');
		container.appendChild(this._actionLabel);
		this.updateLabel();
	}

	protected override updateLabel() {
		if (this._actionLabel) {
			this._actionLabel.classList.add('notebook-label');
			this._actionLabel.innerText = this._action.label;
		}
	}
}
export class UnifiedSubmenuActionView extends SubmenuEntryActionViewItem {
	private _actionLabel?: HTMLAnchorElement;
	private _hover?: IManagedHover;
	private _primaryAction: IAction | undefined;

	constructor(
		action: SubmenuItemAction,
		options: IMenuEntryActionViewItemOptions | undefined,
		private readonly _renderLabel: boolean,
		readonly subActionProvider: IActionProvider,
		readonly subActionViewItemProvider: IActionViewItemProvider | undefined,
		@IKeybindingService _keybindingService: IKeybindingService,
		@IContextMenuService _contextMenuService: IContextMenuService,
		@IThemeService _themeService: IThemeService,
		@IHoverService private readonly _hoverService: IHoverService
	) {
		super(action, { ...options, hoverDelegate: options?.hoverDelegate ?? getDefaultHoverDelegate('element') }, _keybindingService, _contextMenuService, _themeService);
	}

	override render(container: HTMLElement): void {
		super.render(container);
		container.classList.add('notebook-action-view-item');
		container.classList.add('notebook-action-view-item-unified');
		this._actionLabel = document.createElement('a');
		container.appendChild(this._actionLabel);

		this._hover = this._register(this._hoverService.setupManagedHover(this.options.hoverDelegate ?? getDefaultHoverDelegate('element'), this._actionLabel, ''));

		this.updateLabel();

		for (const event of [DOM.EventType.CLICK, DOM.EventType.MOUSE_DOWN, TouchEventType.Tap]) {
			this._register(DOM.addDisposableListener(container, event, e => this.onClick(e, true)));
		}
	}

	override onClick(event: DOM.EventLike, preserveFocus = false): void {
		DOM.EventHelper.stop(event, true);
		const context = types.isUndefinedOrNull(this._context) ? this.options?.useEventAsContext ? event : { preserveFocus } : this._context;
		this.actionRunner.run(this._primaryAction ?? this._action, context);
	}

	protected override updateLabel() {
		const actions = this.subActionProvider.getActions();
		if (this._actionLabel) {
			const primaryAction = actions[0];
			this._primaryAction = primaryAction;

			if (primaryAction && primaryAction instanceof MenuItemAction) {
				const element = this.element;

				if (element && primaryAction.item.icon && ThemeIcon.isThemeIcon(primaryAction.item.icon)) {
					const iconClasses = ThemeIcon.asClassNameArray(primaryAction.item.icon);
					// remove all classes started with 'codicon-'
					element.classList.forEach((cl) => {
						if (cl.startsWith('codicon-')) {
							element.classList.remove(cl);
						}
					});
					element.classList.add(...iconClasses);
				}

				if (this._renderLabel) {
					this._actionLabel.classList.add('notebook-label');
					this._actionLabel.innerText = this._action.label;
					this._hover?.update(primaryAction.tooltip.length ? primaryAction.tooltip : primaryAction.label);
				}
			} else {
				if (this._renderLabel) {
					this._actionLabel.classList.add('notebook-label');
					this._actionLabel.innerText = this._action.label;
					this._hover?.update(this._action.tooltip.length ? this._action.tooltip : this._action.label);
				}
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellComments.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellComments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { coalesce } from '../../../../../../base/common/arrays.js';
import { DisposableMap, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import * as languages from '../../../../../../editor/common/languages.js';
import { IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { IThemeService } from '../../../../../../platform/theme/common/themeService.js';
import { ICommentService, INotebookCommentInfo } from '../../../../comments/browser/commentService.js';
import { CommentThreadWidget } from '../../../../comments/browser/commentThreadWidget.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';
import { ICellRange } from '../../../common/notebookRange.js';

export class CellComments extends CellContentPart {
	// keyed by threadId
	private readonly _commentThreadWidgets: DisposableMap<string, { widget: CommentThreadWidget<ICellRange>; dispose: () => void }>;
	private currentElement: ICellViewModel | undefined;

	constructor(
		private readonly notebookEditor: INotebookEditorDelegate,
		private readonly container: HTMLElement,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IThemeService private readonly themeService: IThemeService,
		@ICommentService private readonly commentService: ICommentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
		this.container.classList.add('review-widget');

		this._register(this._commentThreadWidgets = new DisposableMap<string, { widget: CommentThreadWidget<ICellRange>; dispose: () => void }>());

		this._register(this.themeService.onDidColorThemeChange(this._applyTheme, this));
		// TODO @rebornix onDidChangeLayout (font change)
		// this._register(this.notebookEditor.onDidchangeLa)
		this._applyTheme();
	}

	private async initialize(element: ICellViewModel) {
		if (this.currentElement === element) {
			return;
		}

		this.currentElement = element;
		await this._updateThread();
	}

	private async _createCommentTheadWidget(owner: string, commentThread: languages.CommentThread<ICellRange>) {
		const widgetDisposables = new DisposableStore();
		const widget = this.instantiationService.createInstance(
			CommentThreadWidget,
			this.container,
			this.notebookEditor,
			owner,
			this.notebookEditor.textModel!.uri,
			this.contextKeyService,
			this.instantiationService,
			commentThread,
			undefined,
			undefined,
			{},
			undefined,
			{
				actionRunner: () => {
				},
				collapse: async () => { return true; }
			}
		) as unknown as CommentThreadWidget<ICellRange>;
		widgetDisposables.add(widget);
		this._commentThreadWidgets.set(commentThread.threadId, { widget, dispose: () => widgetDisposables.dispose() });

		const layoutInfo = this.notebookEditor.getLayoutInfo();

		await widget.display(layoutInfo.fontInfo.lineHeight, true);
		this._applyTheme();

		widgetDisposables.add(widget.onDidResize(() => {
			if (this.currentElement) {
				this.currentElement.commentHeight = this._calculateCommentThreadHeight(widget.getDimensions().height);
			}
		}));
	}

	private _bindListeners() {
		this.cellDisposables.add(this.commentService.onDidUpdateCommentThreads(async () => this._updateThread()));
	}

	private async _updateThread() {
		if (!this.currentElement) {
			return;
		}
		const infos = await this._getCommentThreadsForCell(this.currentElement);
		const widgetsToDelete = new Set(this._commentThreadWidgets.keys());
		const layoutInfo = this.currentElement.layoutInfo;
		this.container.style.top = `${layoutInfo.commentOffset}px`;
		for (const info of infos) {
			if (!info) { continue; }
			for (const thread of info.threads) {
				widgetsToDelete.delete(thread.threadId);
				const widget = this._commentThreadWidgets.get(thread.threadId)?.widget;
				if (widget) {
					await widget.updateCommentThread(thread);
				} else {
					await this._createCommentTheadWidget(info.uniqueOwner, thread);
				}
			}
		}
		for (const threadId of widgetsToDelete) {
			this._commentThreadWidgets.deleteAndDispose(threadId);
		}
		this._updateHeight();

	}

	private _calculateCommentThreadHeight(bodyHeight: number) {
		const layoutInfo = this.notebookEditor.getLayoutInfo();

		const headHeight = Math.ceil(layoutInfo.fontInfo.lineHeight * 1.2);
		const lineHeight = layoutInfo.fontInfo.lineHeight;
		const arrowHeight = Math.round(lineHeight / 3);
		const frameThickness = Math.round(lineHeight / 9) * 2;

		const computedHeight = headHeight + bodyHeight + arrowHeight + frameThickness + 8 /** margin bottom to avoid margin collapse */;
		return computedHeight;
	}

	private _updateHeight() {
		if (!this.currentElement) {
			return;
		}
		let height = 0;
		for (const { widget } of this._commentThreadWidgets.values()) {
			height += this._calculateCommentThreadHeight(widget.getDimensions().height);
		}
		this.currentElement.commentHeight = height;
	}

	private async _getCommentThreadsForCell(element: ICellViewModel): Promise<(INotebookCommentInfo | null)[]> {
		if (this.notebookEditor.hasModel()) {
			return coalesce(await this.commentService.getNotebookComments(element.uri));
		}

		return [];
	}

	private _applyTheme() {
		const fontInfo = this.notebookEditor.getLayoutInfo().fontInfo;
		for (const { widget } of this._commentThreadWidgets.values()) {
			widget.applyTheme(fontInfo);
		}
	}

	override didRenderCell(element: ICellViewModel): void {
		this.initialize(element);
		this._bindListeners();
	}

	override prepareLayout(): void {
		this._updateHeight();
	}

	override updateInternalLayoutNow(element: ICellViewModel): void {
		if (this.currentElement) {
			this.container.style.top = `${element.layoutInfo.commentOffset}px`;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellContextKeys.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellContextKeys.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../../../base/common/lifecycle.js';
import { autorun } from '../../../../../../base/common/observable.js';
import { IContextKey, IContextKeyService } from '../../../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { CellEditState, CellFocusMode, ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../../notebookViewEvents.js';
import { CellContentPart } from '../cellPart.js';
import { CodeCellViewModel } from '../../viewModel/codeCellViewModel.js';
import { MarkupCellViewModel } from '../../viewModel/markupCellViewModel.js';
import { NotebookCellExecutionState } from '../../../common/notebookCommon.js';
import { NotebookCellExecutionStateContext, NOTEBOOK_CELL_EDITABLE, NOTEBOOK_CELL_EDITOR_FOCUSED, NOTEBOOK_CELL_EXECUTING, NOTEBOOK_CELL_EXECUTION_STATE, NOTEBOOK_CELL_FOCUSED, NOTEBOOK_CELL_HAS_OUTPUTS, NOTEBOOK_CELL_INPUT_COLLAPSED, NOTEBOOK_CELL_LINE_NUMBERS, NOTEBOOK_CELL_MARKDOWN_EDIT_MODE, NOTEBOOK_CELL_OUTPUT_COLLAPSED, NOTEBOOK_CELL_RESOURCE, NOTEBOOK_CELL_TYPE, NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS } from '../../../common/notebookContextKeys.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../../common/notebookExecutionStateService.js';

export class CellContextKeyPart extends CellContentPart {
	private cellContextKeyManager: CellContextKeyManager;

	constructor(
		notebookEditor: INotebookEditorDelegate,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.cellContextKeyManager = this._register(this.instantiationService.createInstance(CellContextKeyManager, notebookEditor, undefined));
	}

	override didRenderCell(element: ICellViewModel): void {
		this.cellContextKeyManager.updateForElement(element);
	}
}

export class CellContextKeyManager extends Disposable {

	private cellType!: IContextKey<'code' | 'markup'>;
	private cellEditable!: IContextKey<boolean>;
	private cellFocused!: IContextKey<boolean>;
	private cellEditorFocused!: IContextKey<boolean>;
	private cellRunState!: IContextKey<NotebookCellExecutionStateContext>;
	private cellExecuting!: IContextKey<boolean>;
	private cellHasOutputs!: IContextKey<boolean>;
	private cellContentCollapsed!: IContextKey<boolean>;
	private cellOutputCollapsed!: IContextKey<boolean>;
	private cellLineNumbers!: IContextKey<'on' | 'off' | 'inherit'>;
	private cellResource!: IContextKey<string>;
	private cellHasErrorDiagnostics!: IContextKey<boolean>;

	private markdownEditMode!: IContextKey<boolean>;

	private readonly elementDisposables = this._register(new DisposableStore());

	constructor(
		private readonly notebookEditor: INotebookEditorDelegate,
		private element: ICellViewModel | undefined,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
		@INotebookExecutionStateService private readonly _notebookExecutionStateService: INotebookExecutionStateService,
	) {
		super();

		this._contextKeyService.bufferChangeEvents(() => {
			this.cellType = NOTEBOOK_CELL_TYPE.bindTo(this._contextKeyService);
			this.cellEditable = NOTEBOOK_CELL_EDITABLE.bindTo(this._contextKeyService);
			this.cellFocused = NOTEBOOK_CELL_FOCUSED.bindTo(this._contextKeyService);
			this.cellEditorFocused = NOTEBOOK_CELL_EDITOR_FOCUSED.bindTo(this._contextKeyService);
			this.markdownEditMode = NOTEBOOK_CELL_MARKDOWN_EDIT_MODE.bindTo(this._contextKeyService);
			this.cellRunState = NOTEBOOK_CELL_EXECUTION_STATE.bindTo(this._contextKeyService);
			this.cellExecuting = NOTEBOOK_CELL_EXECUTING.bindTo(this._contextKeyService);
			this.cellHasOutputs = NOTEBOOK_CELL_HAS_OUTPUTS.bindTo(this._contextKeyService);
			this.cellContentCollapsed = NOTEBOOK_CELL_INPUT_COLLAPSED.bindTo(this._contextKeyService);
			this.cellOutputCollapsed = NOTEBOOK_CELL_OUTPUT_COLLAPSED.bindTo(this._contextKeyService);
			this.cellLineNumbers = NOTEBOOK_CELL_LINE_NUMBERS.bindTo(this._contextKeyService);
			this.cellResource = NOTEBOOK_CELL_RESOURCE.bindTo(this._contextKeyService);
			this.cellHasErrorDiagnostics = NOTEBOOK_CELL_HAS_ERROR_DIAGNOSTICS.bindTo(this._contextKeyService);

			if (element) {
				this.updateForElement(element);
			}
		});

		this._register(this._notebookExecutionStateService.onDidChangeExecution(e => {
			if (e.type === NotebookExecutionType.cell && this.element && e.affectsCell(this.element.uri)) {
				this.updateForExecutionState();
			}
		}));
	}

	public updateForElement(element: ICellViewModel | undefined) {
		this.elementDisposables.clear();
		this.element = element;

		if (!element) {
			return;
		}

		this.elementDisposables.add(element.onDidChangeState(e => this.onDidChangeState(e)));

		if (element instanceof CodeCellViewModel) {
			this.elementDisposables.add(element.onDidChangeOutputs(() => this.updateForOutputs()));
			this.elementDisposables.add(autorun(reader => {
				this.cellHasErrorDiagnostics.set(!!reader.readObservable(element.executionErrorDiagnostic));
			}));
		}

		this.elementDisposables.add(this.notebookEditor.onDidChangeActiveCell(() => this.updateForFocusState()));

		if (this.element instanceof MarkupCellViewModel) {
			this.cellType.set('markup');
		} else if (this.element instanceof CodeCellViewModel) {
			this.cellType.set('code');
		}

		this._contextKeyService.bufferChangeEvents(() => {
			this.updateForFocusState();
			this.updateForExecutionState();
			this.updateForEditState();
			this.updateForCollapseState();
			this.updateForOutputs();

			this.cellLineNumbers.set(this.element!.lineNumbers);
			this.cellResource.set(this.element!.uri.toString());
		});
	}

	private onDidChangeState(e: CellViewModelStateChangeEvent) {
		this._contextKeyService.bufferChangeEvents(() => {
			if (e.internalMetadataChanged) {
				this.updateForExecutionState();
			}

			if (e.editStateChanged) {
				this.updateForEditState();
			}

			if (e.focusModeChanged) {
				this.updateForFocusState();
			}

			if (e.cellLineNumberChanged) {
				this.cellLineNumbers.set(this.element!.lineNumbers);
			}

			if (e.inputCollapsedChanged || e.outputCollapsedChanged) {
				this.updateForCollapseState();
			}
		});
	}

	private updateForFocusState() {
		if (!this.element) {
			return;
		}

		const activeCell = this.notebookEditor.getActiveCell();
		this.cellFocused.set(this.notebookEditor.getActiveCell() === this.element);

		if (activeCell === this.element) {
			this.cellEditorFocused.set(this.element.focusMode === CellFocusMode.Editor);
		} else {
			this.cellEditorFocused.set(false);
		}

	}

	private updateForExecutionState() {
		if (!this.element) {
			return;
		}

		const internalMetadata = this.element.internalMetadata;
		this.cellEditable.set(!this.notebookEditor.isReadOnly);

		const exeState = this._notebookExecutionStateService.getCellExecution(this.element.uri);
		if (this.element instanceof MarkupCellViewModel) {
			this.cellRunState.reset();
			this.cellExecuting.reset();
		} else if (exeState?.state === NotebookCellExecutionState.Executing) {
			this.cellRunState.set('executing');
			this.cellExecuting.set(true);
		} else if (exeState?.state === NotebookCellExecutionState.Pending || exeState?.state === NotebookCellExecutionState.Unconfirmed) {
			this.cellRunState.set('pending');
			this.cellExecuting.set(true);
		} else if (internalMetadata.lastRunSuccess === true) {
			this.cellRunState.set('succeeded');
			this.cellExecuting.set(false);
		} else if (internalMetadata.lastRunSuccess === false) {
			this.cellRunState.set('failed');
			this.cellExecuting.set(false);
		} else {
			this.cellRunState.set('idle');
			this.cellExecuting.set(false);
		}
	}

	private updateForEditState() {
		if (!this.element) {
			return;
		}

		if (this.element instanceof MarkupCellViewModel) {
			this.markdownEditMode.set(this.element.getEditState() === CellEditState.Editing);
		} else {
			this.markdownEditMode.set(false);
		}
	}

	private updateForCollapseState() {
		if (!this.element) {
			return;
		}

		this.cellContentCollapsed.set(!!this.element.isInputCollapsed);
		this.cellOutputCollapsed.set(!!this.element.isOutputCollapsed);
	}

	private updateForOutputs() {
		if (this.element instanceof CodeCellViewModel) {
			this.cellHasOutputs.set(this.element.outputsViewModels.length > 0);
		} else {
			this.cellHasOutputs.set(false);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDecorations.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDecorations.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellContentPart } from '../cellPart.js';

export class CellDecorations extends CellContentPart {
	constructor(
		readonly notebookEditor: INotebookEditorDelegate,
		readonly rootContainer: HTMLElement,
		readonly decorationContainer: HTMLElement,
	) {
		super();
	}

	override didRenderCell(element: ICellViewModel): void {
		const removedClassNames: string[] = [];
		this.rootContainer.classList.forEach(className => {
			if (/^nb\-.*$/.test(className)) {
				removedClassNames.push(className);
			}
		});

		removedClassNames.forEach(className => {
			this.rootContainer.classList.remove(className);
		});

		this.decorationContainer.innerText = '';

		const generateCellTopDecorations = () => {
			this.decorationContainer.innerText = '';

			element.getCellDecorations().filter(options => options.topClassName !== undefined).forEach(options => {
				this.decorationContainer.append(DOM.$(`.${options.topClassName!}`));
			});
		};

		this.cellDisposables.add(element.onCellDecorationsChanged((e) => {
			const modified = e.added.find(e => e.topClassName) || e.removed.find(e => e.topClassName);

			if (modified) {
				generateCellTopDecorations();
			}
		}));

		generateCellTopDecorations();
		this.registerDecorations();
	}

	private registerDecorations() {
		if (!this.currentCell) {
			return;
		}

		this.cellDisposables.add(this.currentCell.onCellDecorationsChanged((e) => {
			e.added.forEach(options => {
				if (options.className && this.currentCell) {
					this.rootContainer.classList.add(options.className);
				}
			});

			e.removed.forEach(options => {
				if (options.className && this.currentCell) {
					this.rootContainer.classList.remove(options.className);
				}
			});
		}));

		this.currentCell.getCellDecorations().forEach(options => {
			if (options.className && this.currentCell) {
				this.rootContainer.classList.add(options.className);
				this.notebookEditor.deltaCellContainerClassNames(this.currentCell.id, [options.className], [], this.currentCell.cellKind);
			}

			if (options.outputClassName && this.currentCell) {
				this.notebookEditor.deltaCellContainerClassNames(this.currentCell.id, [options.outputClassName], [], this.currentCell.cellKind);
			}
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDnd.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDnd.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { Delayer } from '../../../../../../base/common/async.js';
import { Disposable, MutableDisposable } from '../../../../../../base/common/lifecycle.js';
import * as platform from '../../../../../../base/common/platform.js';
import { expandCellRangesWithHiddenCells, ICellViewModel, INotebookEditorDelegate } from '../../notebookBrowser.js';
import { CellViewModelStateChangeEvent } from '../../notebookViewEvents.js';
import { CellContentPart } from '../cellPart.js';
import { BaseCellRenderTemplate, INotebookCellList } from '../notebookRenderingCommon.js';
import { cloneNotebookCellTextModel } from '../../../common/model/notebookCellTextModel.js';
import { CellEditType, ICellMoveEdit, SelectionStateType } from '../../../common/notebookCommon.js';
import { cellRangesToIndexes, ICellRange } from '../../../common/notebookRange.js';

const $ = DOM.$;

const DRAGGING_CLASS = 'cell-dragging';
const GLOBAL_DRAG_CLASS = 'global-drag-active';

type DragImageProvider = () => HTMLElement;

interface CellDragEvent {
	browserEvent: DragEvent;
	draggedOverCell: ICellViewModel;
	cellTop: number;
	cellHeight: number;
	dragPosRatio: number;
}

export class CellDragAndDropPart extends CellContentPart {
	constructor(
		private readonly container: HTMLElement
	) {
		super();
	}

	override didRenderCell(element: ICellViewModel): void {
		this.update(element);
	}

	override updateState(element: ICellViewModel, e: CellViewModelStateChangeEvent): void {
		if (e.dragStateChanged) {
			this.update(element);
		}
	}

	private update(element: ICellViewModel) {
		this.container.classList.toggle(DRAGGING_CLASS, element.dragging);
	}
}

export class CellDragAndDropController extends Disposable {
	// TODO@roblourens - should probably use dataTransfer here, but any dataTransfer set makes the editor think I am dropping a file, need
	// to figure out how to prevent that
	private currentDraggedCell: ICellViewModel | undefined;
	private draggedCells: ICellViewModel[] = [];

	private listInsertionIndicator: HTMLElement;

	private list!: INotebookCellList;

	private isScrolling = false;
	private readonly scrollingDelayer: Delayer<void>;

	private readonly listOnWillScrollListener = this._register(new MutableDisposable());

	constructor(
		private notebookEditor: INotebookEditorDelegate,
		private readonly notebookListContainer: HTMLElement
	) {
		super();

		this.listInsertionIndicator = DOM.append(notebookListContainer, $('.cell-list-insertion-indicator'));

		this._register(DOM.addDisposableListener(notebookListContainer.ownerDocument.body, DOM.EventType.DRAG_START, this.onGlobalDragStart.bind(this), true));
		this._register(DOM.addDisposableListener(notebookListContainer.ownerDocument.body, DOM.EventType.DRAG_END, this.onGlobalDragEnd.bind(this), true));

		const addCellDragListener = (eventType: string, handler: (e: CellDragEvent) => void, useCapture = false) => {
			this._register(DOM.addDisposableListener(
				notebookEditor.getDomNode(),
				eventType,
				e => {
					const cellDragEvent = this.toCellDragEvent(e);
					if (cellDragEvent) {
						handler(cellDragEvent);
					}
				}, useCapture));
		};

		addCellDragListener(DOM.EventType.DRAG_OVER, event => {
			if (!this.currentDraggedCell) {
				return;
			}
			event.browserEvent.preventDefault();
			this.onCellDragover(event);
		}, true);
		addCellDragListener(DOM.EventType.DROP, event => {
			if (!this.currentDraggedCell) {
				return;
			}
			event.browserEvent.preventDefault();
			this.onCellDrop(event);
		});
		addCellDragListener(DOM.EventType.DRAG_LEAVE, event => {
			event.browserEvent.preventDefault();
			this.onCellDragLeave(event);
		});

		this.scrollingDelayer = this._register(new Delayer(200));
	}

	setList(value: INotebookCellList) {
		this.list = value;

		this.listOnWillScrollListener.value = this.list.onWillScroll(e => {
			if (!e.scrollTopChanged) {
				return;
			}

			this.setInsertIndicatorVisibility(false);
			this.isScrolling = true;
			this.scrollingDelayer.trigger(() => {
				this.isScrolling = false;
			});
		});
	}

	private setInsertIndicatorVisibility(visible: boolean) {
		this.listInsertionIndicator.style.opacity = visible ? '1' : '0';
	}

	private toCellDragEvent(event: DragEvent): CellDragEvent | undefined {
		const targetTop = this.notebookListContainer.getBoundingClientRect().top;
		const dragOffset = this.list.scrollTop + event.clientY - targetTop;
		const draggedOverCell = this.list.elementAt(dragOffset);
		if (!draggedOverCell) {
			return undefined;
		}

		const cellTop = this.list.getCellViewScrollTop(draggedOverCell);
		const cellHeight = this.list.elementHeight(draggedOverCell);

		const dragPosInElement = dragOffset - cellTop;
		const dragPosRatio = dragPosInElement / cellHeight;

		return {
			browserEvent: event,
			draggedOverCell,
			cellTop,
			cellHeight,
			dragPosRatio
		};
	}

	clearGlobalDragState() {
		this.notebookEditor.getDomNode().classList.remove(GLOBAL_DRAG_CLASS);
	}

	private onGlobalDragStart() {
		this.notebookEditor.getDomNode().classList.add(GLOBAL_DRAG_CLASS);
	}

	private onGlobalDragEnd() {
		this.notebookEditor.getDomNode().classList.remove(GLOBAL_DRAG_CLASS);
	}

	private onCellDragover(event: CellDragEvent): void {
		if (!event.browserEvent.dataTransfer) {
			return;
		}

		if (!this.currentDraggedCell) {
			event.browserEvent.dataTransfer.dropEffect = 'none';
			return;
		}

		if (this.isScrolling || this.currentDraggedCell === event.draggedOverCell) {
			this.setInsertIndicatorVisibility(false);
			return;
		}

		const dropDirection = this.getDropInsertDirection(event.dragPosRatio);
		const insertionIndicatorAbsolutePos = dropDirection === 'above' ? event.cellTop : event.cellTop + event.cellHeight;
		this.updateInsertIndicator(dropDirection, insertionIndicatorAbsolutePos);
	}

	private updateInsertIndicator(dropDirection: string, insertionIndicatorAbsolutePos: number) {
		const { bottomToolbarGap } = this.notebookEditor.notebookOptions.computeBottomToolbarDimensions(this.notebookEditor.textModel?.viewType);
		const insertionIndicatorTop = insertionIndicatorAbsolutePos - this.list.scrollTop + bottomToolbarGap / 2;
		if (insertionIndicatorTop >= 0) {
			this.listInsertionIndicator.style.top = `${insertionIndicatorTop}px`;
			this.setInsertIndicatorVisibility(true);
		} else {
			this.setInsertIndicatorVisibility(false);
		}
	}

	private getDropInsertDirection(dragPosRatio: number): 'above' | 'below' {
		return dragPosRatio < 0.5 ? 'above' : 'below';
	}

	private onCellDrop(event: CellDragEvent): void {
		const draggedCell = this.currentDraggedCell!;

		if (this.isScrolling || this.currentDraggedCell === event.draggedOverCell) {
			return;
		}

		this.dragCleanup();

		const dropDirection = this.getDropInsertDirection(event.dragPosRatio);
		this._dropImpl(draggedCell, dropDirection, event.browserEvent, event.draggedOverCell);
	}

	private getCellRangeAroundDragTarget(draggedCellIndex: number) {
		const selections = this.notebookEditor.getSelections();
		const modelRanges = expandCellRangesWithHiddenCells(this.notebookEditor, selections);
		const nearestRange = modelRanges.find(range => range.start <= draggedCellIndex && draggedCellIndex < range.end);

		if (nearestRange) {
			return nearestRange;
		} else {
			return { start: draggedCellIndex, end: draggedCellIndex + 1 };
		}
	}

	private _dropImpl(draggedCell: ICellViewModel, dropDirection: 'above' | 'below', ctx: { ctrlKey: boolean; altKey: boolean }, draggedOverCell: ICellViewModel) {
		const cellTop = this.list.getCellViewScrollTop(draggedOverCell);
		const cellHeight = this.list.elementHeight(draggedOverCell);
		const insertionIndicatorAbsolutePos = dropDirection === 'above' ? cellTop : cellTop + cellHeight;
		const { bottomToolbarGap } = this.notebookEditor.notebookOptions.computeBottomToolbarDimensions(this.notebookEditor.textModel?.viewType);
		const insertionIndicatorTop = insertionIndicatorAbsolutePos - this.list.scrollTop + bottomToolbarGap / 2;
		const editorHeight = this.notebookEditor.getDomNode().getBoundingClientRect().height;
		if (insertionIndicatorTop < 0 || insertionIndicatorTop > editorHeight) {
			// Ignore drop, insertion point is off-screen
			return;
		}

		const isCopy = (ctx.ctrlKey && !platform.isMacintosh) || (ctx.altKey && platform.isMacintosh);

		if (!this.notebookEditor.hasModel()) {
			return;
		}

		const textModel = this.notebookEditor.textModel;

		if (isCopy) {
			const draggedCellIndex = this.notebookEditor.getCellIndex(draggedCell);
			const range = this.getCellRangeAroundDragTarget(draggedCellIndex);

			let originalToIdx = this.notebookEditor.getCellIndex(draggedOverCell);
			if (dropDirection === 'below') {
				const relativeToIndex = this.notebookEditor.getCellIndex(draggedOverCell);
				const newIdx = this.notebookEditor.getNextVisibleCellIndex(relativeToIndex);
				originalToIdx = newIdx;
			}

			let finalSelection: ICellRange;
			let finalFocus: ICellRange;

			if (originalToIdx <= range.start) {
				finalSelection = { start: originalToIdx, end: originalToIdx + range.end - range.start };
				finalFocus = { start: originalToIdx + draggedCellIndex - range.start, end: originalToIdx + draggedCellIndex - range.start + 1 };
			} else {
				const delta = (originalToIdx - range.start);
				finalSelection = { start: range.start + delta, end: range.end + delta };
				finalFocus = { start: draggedCellIndex + delta, end: draggedCellIndex + delta + 1 };
			}

			textModel.applyEdits([
				{
					editType: CellEditType.Replace,
					index: originalToIdx,
					count: 0,
					cells: cellRangesToIndexes([range]).map(index => cloneNotebookCellTextModel(this.notebookEditor.cellAt(index)!.model))
				}
			], true, { kind: SelectionStateType.Index, focus: this.notebookEditor.getFocus(), selections: this.notebookEditor.getSelections() }, () => ({ kind: SelectionStateType.Index, focus: finalFocus, selections: [finalSelection] }), undefined, true);
			this.notebookEditor.revealCellRangeInView(finalSelection);
		} else {
			performCellDropEdits(this.notebookEditor, draggedCell, dropDirection, draggedOverCell);
		}
	}

	private onCellDragLeave(event: CellDragEvent): void {
		if (!event.browserEvent.relatedTarget || !DOM.isAncestor(event.browserEvent.relatedTarget as HTMLElement, this.notebookEditor.getDomNode())) {
			this.setInsertIndicatorVisibility(false);
		}
	}

	private dragCleanup(): void {
		if (this.currentDraggedCell) {
			this.draggedCells.forEach(cell => cell.dragging = false);
			this.currentDraggedCell = undefined;
			this.draggedCells = [];
		}

		this.setInsertIndicatorVisibility(false);
	}

	registerDragHandle(templateData: BaseCellRenderTemplate, cellRoot: HTMLElement, dragHandles: HTMLElement[], dragImageProvider: DragImageProvider): void {
		const container = templateData.container;
		for (const dragHandle of dragHandles) {
			dragHandle.setAttribute('draggable', 'true');
		}

		const onDragEnd = () => {
			if (!this.notebookEditor.notebookOptions.getDisplayOptions().dragAndDropEnabled || !!this.notebookEditor.isReadOnly) {
				return;
			}

			// Note, templateData may have a different element rendered into it by now
			container.classList.remove(DRAGGING_CLASS);
			this.dragCleanup();
		};
		for (const dragHandle of dragHandles) {
			templateData.templateDisposables.add(DOM.addDisposableListener(dragHandle, DOM.EventType.DRAG_END, onDragEnd));
		}

		const onDragStart = (event: DragEvent) => {
			if (!event.dataTransfer) {
				return;
			}

			if (!this.notebookEditor.notebookOptions.getDisplayOptions().dragAndDropEnabled || !!this.notebookEditor.isReadOnly) {
				return;
			}

			this.currentDraggedCell = templateData.currentRenderedCell!;
			this.draggedCells = this.notebookEditor.getSelections().map(range => this.notebookEditor.getCellsInRange(range)).flat();
			this.draggedCells.forEach(cell => cell.dragging = true);

			const dragImage = dragImageProvider();
			cellRoot.parentElement!.appendChild(dragImage);
			event.dataTransfer.setDragImage(dragImage, 0, 0);
			setTimeout(() => dragImage.remove(), 0); // Comment this out to debug drag image layout
		};
		for (const dragHandle of dragHandles) {
			templateData.templateDisposables.add(DOM.addDisposableListener(dragHandle, DOM.EventType.DRAG_START, onDragStart));
		}
	}

	public startExplicitDrag(cell: ICellViewModel, _dragOffsetY: number) {
		if (!this.notebookEditor.notebookOptions.getDisplayOptions().dragAndDropEnabled || !!this.notebookEditor.isReadOnly) {
			return;
		}

		this.currentDraggedCell = cell;
		this.setInsertIndicatorVisibility(true);
	}

	public explicitDrag(cell: ICellViewModel, dragOffsetY: number) {
		if (!this.notebookEditor.notebookOptions.getDisplayOptions().dragAndDropEnabled || !!this.notebookEditor.isReadOnly) {
			return;
		}

		const target = this.list.elementAt(dragOffsetY);
		if (target && target !== cell) {
			const cellTop = this.list.getCellViewScrollTop(target);
			const cellHeight = this.list.elementHeight(target);

			const dropDirection = this.getExplicitDragDropDirection(dragOffsetY, cellTop, cellHeight);
			const insertionIndicatorAbsolutePos = dropDirection === 'above' ? cellTop : cellTop + cellHeight;
			this.updateInsertIndicator(dropDirection, insertionIndicatorAbsolutePos);
		}

		// Try scrolling list if needed
		if (this.currentDraggedCell !== cell) {
			return;
		}

		const notebookViewRect = this.notebookEditor.getDomNode().getBoundingClientRect();
		const eventPositionInView = dragOffsetY - this.list.scrollTop;

		// Percentage from the top/bottom of the screen where we start scrolling while dragging
		const notebookViewScrollMargins = 0.2;

		const maxScrollDeltaPerFrame = 20;

		const eventPositionRatio = eventPositionInView / notebookViewRect.height;
		if (eventPositionRatio < notebookViewScrollMargins) {
			this.list.scrollTop -= maxScrollDeltaPerFrame * (1 - eventPositionRatio / notebookViewScrollMargins);
		} else if (eventPositionRatio > 1 - notebookViewScrollMargins) {
			this.list.scrollTop += maxScrollDeltaPerFrame * (1 - ((1 - eventPositionRatio) / notebookViewScrollMargins));
		}
	}

	public endExplicitDrag(_cell: ICellViewModel) {
		this.setInsertIndicatorVisibility(false);
	}

	public explicitDrop(cell: ICellViewModel, ctx: { dragOffsetY: number; ctrlKey: boolean; altKey: boolean }) {
		this.currentDraggedCell = undefined;
		this.setInsertIndicatorVisibility(false);

		const target = this.list.elementAt(ctx.dragOffsetY);
		if (!target || target === cell) {
			return;
		}

		const cellTop = this.list.getCellViewScrollTop(target);
		const cellHeight = this.list.elementHeight(target);
		const dropDirection = this.getExplicitDragDropDirection(ctx.dragOffsetY, cellTop, cellHeight);
		this._dropImpl(cell, dropDirection, ctx, target);
	}

	private getExplicitDragDropDirection(clientY: number, cellTop: number, cellHeight: number) {
		const dragPosInElement = clientY - cellTop;
		const dragPosRatio = dragPosInElement / cellHeight;

		return this.getDropInsertDirection(dragPosRatio);
	}

	override dispose() {
		this.notebookEditor = null!;
		super.dispose();
	}
}

export function performCellDropEdits(editor: INotebookEditorDelegate, draggedCell: ICellViewModel, dropDirection: 'above' | 'below', draggedOverCell: ICellViewModel): void {
	const draggedCellIndex = editor.getCellIndex(draggedCell)!;
	let originalToIdx = editor.getCellIndex(draggedOverCell)!;

	if (typeof draggedCellIndex !== 'number' || typeof originalToIdx !== 'number') {
		return;
	}

	// If dropped on a folded markdown range, insert after the folding range
	if (dropDirection === 'below') {
		const newIdx = editor.getNextVisibleCellIndex(originalToIdx) ?? originalToIdx;
		originalToIdx = newIdx;
	}

	let selections = editor.getSelections();
	if (!selections.length) {
		selections = [editor.getFocus()];
	}

	let originalFocusIdx = editor.getFocus().start;

	// If the dragged cell is not focused/selected, ignore the current focus/selection and use the dragged idx
	if (!selections.some(s => s.start <= draggedCellIndex && s.end > draggedCellIndex)) {
		selections = [{ start: draggedCellIndex, end: draggedCellIndex + 1 }];
		originalFocusIdx = draggedCellIndex;
	}

	const droppedInSelection = selections.find(range => range.start <= originalToIdx && range.end > originalToIdx);
	if (droppedInSelection) {
		originalToIdx = droppedInSelection.start;
	}


	let numCells = 0;
	let focusNewIdx = originalToIdx;
	let newInsertionIdx = originalToIdx;

	// Compute a set of edits which will be applied in reverse order by the notebook text model.
	// `index`: the starting index of the range, after previous edits have been applied
	// `newIdx`: the destination index, after this edit's range has been removed
	selections.sort((a, b) => b.start - a.start);
	const edits = selections.map(range => {
		const length = range.end - range.start;

		// If this range is before the insertion point, subtract the cells in this range from the "to" index
		let toIndexDelta = 0;
		if (range.end <= newInsertionIdx) {
			toIndexDelta = -length;
		}

		const newIdx = newInsertionIdx + toIndexDelta;

		// If this range contains the focused cell, set the new focus index to the new index of the cell
		if (originalFocusIdx >= range.start && originalFocusIdx <= range.end) {
			const offset = originalFocusIdx - range.start;
			focusNewIdx = newIdx + offset;
		}

		// If below the insertion point, the original index will have been shifted down
		const fromIndexDelta = range.start >= originalToIdx ? numCells : 0;

		const edit: ICellMoveEdit = {
			editType: CellEditType.Move,
			index: range.start + fromIndexDelta,
			length,
			newIdx
		};
		numCells += length;

		// If a range was moved down, the insertion index needs to be adjusted
		if (range.end < newInsertionIdx) {
			newInsertionIdx -= length;
		}

		return edit;
	});

	const lastEdit = edits[edits.length - 1];
	const finalSelection = { start: lastEdit.newIdx, end: lastEdit.newIdx + numCells };
	const finalFocus = { start: focusNewIdx, end: focusNewIdx + 1 };

	editor.textModel!.applyEdits(
		edits,
		true,
		{ kind: SelectionStateType.Index, focus: editor.getFocus(), selections: editor.getSelections() },
		() => ({ kind: SelectionStateType.Index, focus: finalFocus, selections: [finalSelection] }),
		undefined, true);
	editor.revealCellRangeInView(finalSelection);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDragRenderer.ts]---
Location: vscode-main/src/vs/workbench/contrib/notebook/browser/view/cellParts/cellDragRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../../../base/browser/dom.js';
import { createTrustedTypesPolicy } from '../../../../../../base/browser/trustedTypes.js';
import { Color } from '../../../../../../base/common/color.js';
import * as platform from '../../../../../../base/common/platform.js';
import { ICodeEditor } from '../../../../../../editor/browser/editorBrowser.js';
import { EditorOption } from '../../../../../../editor/common/config/editorOptions.js';
import { Range } from '../../../../../../editor/common/core/range.js';
import { ColorId } from '../../../../../../editor/common/encodedTokenAttributes.js';
import * as languages from '../../../../../../editor/common/languages.js';
import { tokenizeLineToHTML } from '../../../../../../editor/common/languages/textToHtmlTokenizer.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { BaseCellRenderTemplate } from '../notebookRenderingCommon.js';

class EditorTextRenderer {

	private static _ttPolicy = createTrustedTypesPolicy('cellRendererEditorText', {
		createHTML(input) { return input; }
	});

	getRichText(editor: ICodeEditor, modelRange: Range): HTMLElement | null {
		const model = editor.getModel();
		if (!model) {
			return null;
		}

		const colorMap = this.getDefaultColorMap();
		const fontInfo = editor.getOptions().get(EditorOption.fontInfo);
		const fontFamilyVar = '--notebook-editor-font-family';
		const fontSizeVar = '--notebook-editor-font-size';
		const fontWeightVar = '--notebook-editor-font-weight';

		const style = ``
			+ `color: ${colorMap[ColorId.DefaultForeground]};`
			+ `background-color: ${colorMap[ColorId.DefaultBackground]};`
			+ `font-family: var(${fontFamilyVar});`
			+ `font-weight: var(${fontWeightVar});`
			+ `font-size: var(${fontSizeVar});`
			+ `line-height: ${fontInfo.lineHeight}px;`
			+ `white-space: pre;`;

		const element = DOM.$('div', { style });

		const fontSize = fontInfo.fontSize;
		const fontWeight = fontInfo.fontWeight;
		element.style.setProperty(fontFamilyVar, fontInfo.fontFamily);
		element.style.setProperty(fontSizeVar, `${fontSize}px`);
		element.style.setProperty(fontWeightVar, fontWeight);

		const linesHtml = this.getRichTextLinesAsHtml(model, modelRange, colorMap);
		element.innerHTML = linesHtml as string;
		return element;
	}

	private getRichTextLinesAsHtml(model: ITextModel, modelRange: Range, colorMap: string[]): string | TrustedHTML {
		const startLineNumber = modelRange.startLineNumber;
		const startColumn = modelRange.startColumn;
		const endLineNumber = modelRange.endLineNumber;
		const endColumn = modelRange.endColumn;

		const tabSize = model.getOptions().tabSize;

		let result = '';

		for (let lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
			const lineTokens = model.tokenization.getLineTokens(lineNumber);
			const lineContent = lineTokens.getLineContent();
			const startOffset = (lineNumber === startLineNumber ? startColumn - 1 : 0);
			const endOffset = (lineNumber === endLineNumber ? endColumn - 1 : lineContent.length);

			if (lineContent === '') {
				result += '<br>';
			} else {
				result += tokenizeLineToHTML(lineContent, lineTokens.inflate(), colorMap, startOffset, endOffset, tabSize, platform.isWindows);
			}
		}

		return EditorTextRenderer._ttPolicy?.createHTML(result) ?? result;
	}

	private getDefaultColorMap(): string[] {
		const colorMap = languages.TokenizationRegistry.getColorMap();
		const result: string[] = ['#000000'];
		if (colorMap) {
			for (let i = 1, len = colorMap.length; i < len; i++) {
				result[i] = Color.Format.CSS.formatHex(colorMap[i]);
			}
		}
		return result;
	}
}

export class CodeCellDragImageRenderer {
	getDragImage(templateData: BaseCellRenderTemplate, editor: ICodeEditor, type: 'code' | 'markdown'): HTMLElement {
		let dragImage = this.getDragImageImpl(templateData, editor, type);
		if (!dragImage) {
			// TODO@roblourens I don't think this can happen
			dragImage = document.createElement('div');
			dragImage.textContent = '1 cell';
		}

		return dragImage;
	}

	private getDragImageImpl(templateData: BaseCellRenderTemplate, editor: ICodeEditor, type: 'code' | 'markdown'): HTMLElement | null {
		const dragImageContainer = templateData.container.cloneNode(true) as HTMLElement;
		dragImageContainer.classList.forEach(c => dragImageContainer.classList.remove(c));
		dragImageContainer.classList.add('cell-drag-image', 'monaco-list-row', 'focused', `${type}-cell-row`);

		// eslint-disable-next-line no-restricted-syntax
		const editorContainer: HTMLElement | null = dragImageContainer.querySelector('.cell-editor-container');
		if (!editorContainer) {
			return null;
		}

		const richEditorText = new EditorTextRenderer().getRichText(editor, new Range(1, 1, 1, 1000));
		if (!richEditorText) {
			return null;
		}
		DOM.reset(editorContainer, richEditorText);

		return dragImageContainer;
	}
}
```

--------------------------------------------------------------------------------

````
