---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 539
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 539 of 552)

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

---[FILE: src/vs/workbench/services/workingCopy/browser/workingCopyHistoryService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/browser/workingCopyHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IFileService } from '../../../../platform/files/common/files.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkingCopyHistoryModelOptions, WorkingCopyHistoryService } from '../common/workingCopyHistoryService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkingCopyHistoryService } from '../common/workingCopyHistory.js';

export class BrowserWorkingCopyHistoryService extends WorkingCopyHistoryService {

	constructor(
		@IFileService fileService: IFileService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILabelService labelService: ILabelService,
		@ILogService logService: ILogService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(fileService, remoteAgentService, environmentService, uriIdentityService, labelService, logService, configurationService);
	}

	protected getModelOptions(): IWorkingCopyHistoryModelOptions {
		return { flushOnChange: true /* because browsers support no long running shutdown */ };
	}
}

// Register Service
registerSingleton(IWorkingCopyHistoryService, BrowserWorkingCopyHistoryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/abstractFileWorkingCopyManager.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/abstractFileWorkingCopyManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Promises } from '../../../../base/common/async.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { IFileWorkingCopy, IFileWorkingCopyModel } from './fileWorkingCopy.js';

export interface IBaseFileWorkingCopyManager<M extends IFileWorkingCopyModel, W extends IFileWorkingCopy<M>> extends IDisposable {

	/**
	 * An event for when a file working copy was created.
	 */
	readonly onDidCreate: Event<W>;

	/**
	 * Access to all known file working copies within the manager.
	 */
	readonly workingCopies: readonly W[];

	/**
	 * Returns the file working copy for the provided resource
	 * or `undefined` if none.
	 */
	get(resource: URI): W | undefined;

	/**
	 * Disposes all working copies of the manager and disposes the manager. This
	 * method is different from `dispose` in that it will unregister any working
	 * copy from the `IWorkingCopyService`. Since this impact things like backups,
	 * the method is `async` because it needs to trigger `save` for any dirty
	 * working copy to preserve the data.
	 *
	 * Callers should make sure to e.g. close any editors associated with the
	 * working copy.
	 */
	destroy(): Promise<void>;
}

export abstract class BaseFileWorkingCopyManager<M extends IFileWorkingCopyModel, W extends IFileWorkingCopy<M>> extends Disposable implements IBaseFileWorkingCopyManager<M, W> {

	private readonly _onDidCreate = this._register(new Emitter<W>());
	readonly onDidCreate = this._onDidCreate.event;

	private readonly mapResourceToWorkingCopy = new ResourceMap<W>();
	private readonly mapResourceToDisposeListener = new ResourceMap<IDisposable>();

	constructor(
		@IFileService protected readonly fileService: IFileService,
		@ILogService protected readonly logService: ILogService,
		@IWorkingCopyBackupService protected readonly workingCopyBackupService: IWorkingCopyBackupService
	) {
		super();
	}

	protected has(resource: URI): boolean {
		return this.mapResourceToWorkingCopy.has(resource);
	}

	protected add(resource: URI, workingCopy: W): void {
		const knownWorkingCopy = this.get(resource);
		if (knownWorkingCopy === workingCopy) {
			return; // already cached
		}

		// Add to our working copy map
		this.mapResourceToWorkingCopy.set(resource, workingCopy);

		// Update our dispose listener to remove it on dispose
		this.mapResourceToDisposeListener.get(resource)?.dispose();
		this.mapResourceToDisposeListener.set(resource, workingCopy.onWillDispose(() => this.remove(resource)));

		// Signal creation event
		this._onDidCreate.fire(workingCopy);
	}

	protected remove(resource: URI): boolean {

		// Dispose any existing listener
		const disposeListener = this.mapResourceToDisposeListener.get(resource);
		if (disposeListener) {
			dispose(disposeListener);
			this.mapResourceToDisposeListener.delete(resource);
		}

		// Remove from our working copy map
		return this.mapResourceToWorkingCopy.delete(resource);
	}

	//#region Get / Get all

	get workingCopies(): W[] {
		return [...this.mapResourceToWorkingCopy.values()];
	}

	get(resource: URI): W | undefined {
		return this.mapResourceToWorkingCopy.get(resource);
	}

	//#endregion

	//#region Lifecycle

	override dispose(): void {
		super.dispose();

		// Clear working copy caches
		//
		// Note: we are not explicitly disposing the working copies
		// known to the manager because this can have unwanted side
		// effects such as backups getting discarded once the working
		// copy unregisters. We have an explicit `destroy`
		// for that purpose (https://github.com/microsoft/vscode/pull/123555)
		//
		this.mapResourceToWorkingCopy.clear();

		// Dispose the dispose listeners
		dispose(this.mapResourceToDisposeListener.values());
		this.mapResourceToDisposeListener.clear();
	}

	async destroy(): Promise<void> {

		// Make sure all dirty working copies are saved to disk
		try {
			await Promises.settled(this.workingCopies.map(async workingCopy => {
				if (workingCopy.isDirty()) {
					await this.saveWithFallback(workingCopy);
				}
			}));
		} catch (error) {
			this.logService.error(error);
		}

		// Dispose all working copies
		dispose(this.mapResourceToWorkingCopy.values());

		// Finally dispose manager
		this.dispose();
	}

	private async saveWithFallback(workingCopy: W): Promise<void> {

		// First try regular save
		let saveSuccess = false;
		try {
			saveSuccess = await workingCopy.save();
		} catch (error) {
			// Ignore
		}

		// Then fallback to backup if that exists
		if (!saveSuccess || workingCopy.isDirty()) {
			const backup = await this.workingCopyBackupService.resolve(workingCopy);
			if (backup) {
				await this.fileService.writeFile(workingCopy.resource, backup.value, { unlock: true });
			}
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/fileWorkingCopy.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/fileWorkingCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDisposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkingCopy } from './workingCopy.js';

export interface IFileWorkingCopyModelFactory<M extends IFileWorkingCopyModel> {

	/**
	 * Create a model for the untitled or stored working copy
	 * from the given content under the provided resource.
	 *
	 * @param resource the `URI` of the model
	 * @param contents the content of the model to create it
	 * @param token support for cancellation
	 */
	createModel(resource: URI, contents: VSBufferReadableStream, token: CancellationToken): Promise<M>;
}

export interface IFileWorkingCopyModelConfiguration {

	/**
	 * The delay in milliseconds to wait before triggering
	 * a backup after the content of the model has changed.
	 *
	 * If not configured, a sensible default will be taken
	 * based on user settings.
	 */
	readonly backupDelay?: number;
}

export const enum SnapshotContext {
	Save = 1,
	Backup = 2
}

/**
 * A generic file working copy model to be reused by untitled
 * and stored file working copies.
 */
export interface IFileWorkingCopyModel extends IDisposable {

	/**
	 * This event signals ANY changes to the contents, for example:
	 * - through the user typing into the editor
	 * - from API usage (e.g. bulk edits)
	 * - when `IFileWorkingCopyModel#update` is invoked with contents
	 *   that are different from the current contents
	 *
	 * The file working copy will listen to these changes and may mark
	 * the working copy as dirty whenever this event fires.
	 *
	 * Note: ONLY report changes to the model but not the underlying
	 * file. The file working copy is tracking changes to the file
	 * automatically.
	 */
	readonly onDidChangeContent: Event<unknown>;

	/**
	 * An event emitted right before disposing the model.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * Optional additional configuration for the model that drives
	 * some of the working copy behaviour.
	 */
	readonly configuration?: IFileWorkingCopyModelConfiguration;

	/**
	 * Snapshots the model's current content for writing. This must include
	 * any changes that were made to the model that are in memory.
	 *
	 * @param context indicates in what context the snapshot is used
	 * @param token support for cancellation
	 */
	snapshot(context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream>;

	/**
	 * Updates the model with the provided contents. The implementation should
	 * behave in a similar fashion as `IFileWorkingCopyModelFactory#createModel`
	 * except that here the model already exists and just needs to update to
	 * the provided contents.
	 *
	 * Note: it is expected that the model fires a `onDidChangeContent` event
	 * as part of the update.
	 *
	 * @param contents the contents to use for the model
	 * @param token support for cancellation
	 */
	update(contents: VSBufferReadableStream, token: CancellationToken): Promise<void>;
}

export interface IFileWorkingCopy<M extends IFileWorkingCopyModel> extends IWorkingCopy, IDisposable {

	/**
	 * An event for when the file working copy has been reverted.
	 */
	readonly onDidRevert: Event<void>;

	/**
	 * An event for when the file working copy has been disposed.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * Provides access to the underlying model of this file
	 * based working copy. As long as the file working copy
	 * has not been resolved, the model is `undefined`.
	 */
	readonly model: M | undefined;

	/**
	 * Resolves the file working copy and thus makes the `model`
	 * available.
	 */
	resolve(): Promise<void>;

	/**
	 * Whether we have a resolved model or not.
	 */
	isResolved(): this is IResolvedFileWorkingCopy<M>;
}

export interface IResolvedFileWorkingCopy<M extends IFileWorkingCopyModel> extends IFileWorkingCopy<M> {

	/**
	 * A resolved file working copy has a resolved model.
	 */
	readonly model: M;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/fileWorkingCopyManager.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/fileWorkingCopyManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Promises } from '../../../../base/common/async.js';
import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { toLocalResource, joinPath, isEqual, basename, dirname } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { IFileDialogService, IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ISaveOptions, SaveSourceRegistry } from '../../../common/editor.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IPathService } from '../../path/common/pathService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel, IStoredFileWorkingCopyModelFactory, IStoredFileWorkingCopyResolveOptions, StoredFileWorkingCopyState } from './storedFileWorkingCopy.js';
import { StoredFileWorkingCopyManager, IStoredFileWorkingCopyManager, IStoredFileWorkingCopyManagerResolveOptions } from './storedFileWorkingCopyManager.js';
import { IUntitledFileWorkingCopy, IUntitledFileWorkingCopyModel, IUntitledFileWorkingCopyModelFactory, UntitledFileWorkingCopy } from './untitledFileWorkingCopy.js';
import { INewOrExistingUntitledFileWorkingCopyOptions, INewUntitledFileWorkingCopyOptions, INewUntitledFileWorkingCopyWithAssociatedResourceOptions, IUntitledFileWorkingCopyManager, UntitledFileWorkingCopyManager } from './untitledFileWorkingCopyManager.js';
import { IWorkingCopyFileService } from './workingCopyFileService.js';
import { IBaseFileWorkingCopyManager } from './abstractFileWorkingCopyManager.js';
import { IFileWorkingCopy, SnapshotContext } from './fileWorkingCopy.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { IWorkingCopyEditorService } from './workingCopyEditorService.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { Schemas } from '../../../../base/common/network.js';
import { IDecorationData, IDecorationsProvider, IDecorationsService } from '../../decorations/common/decorations.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { listErrorForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';

export interface IFileWorkingCopyManager<S extends IStoredFileWorkingCopyModel, U extends IUntitledFileWorkingCopyModel> extends IBaseFileWorkingCopyManager<S | U, IFileWorkingCopy<S | U>> {

	/**
	 * Provides access to the manager for stored file working copies.
	 */
	readonly stored: IStoredFileWorkingCopyManager<S>;

	/**
	 * Provides access to the manager for untitled file working copies.
	 */
	readonly untitled: IUntitledFileWorkingCopyManager<U>;

	/**
	 * Allows to resolve a stored file working copy. If the manager already knows
	 * about a stored file working copy with the same `URI`, it will return that
	 * existing stored file working copy. There will never be more than one
	 * stored file working copy per `URI` until the stored file working copy is
	 * disposed.
	 *
	 * Use the `IStoredFileWorkingCopyResolveOptions.reload` option to control the
	 * behaviour for when a stored file working copy was previously already resolved
	 * with regards to resolving it again from the underlying file resource
	 * or not.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 *
	 * @param resource used as unique identifier of the stored file working copy in
	 * case one is already known for this `URI`.
	 * @param options
	 */
	resolve(resource: URI, options?: IStoredFileWorkingCopyManagerResolveOptions): Promise<IStoredFileWorkingCopy<S>>;

	/**
	 * Create a new untitled file working copy with optional initial contents.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<U>>;

	/**
	 * Create a new untitled file working copy with optional initial contents
	 * and associated resource. The associated resource will be used when
	 * saving and will not require to ask the user for a file path.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewUntitledFileWorkingCopyWithAssociatedResourceOptions): Promise<IUntitledFileWorkingCopy<U>>;

	/**
	 * Creates a new untitled file working copy with optional initial contents
	 * with the provided resource or return an existing untitled file working
	 * copy otherwise.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewOrExistingUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<U>>;

	/**
	 * Implements "Save As" for file based working copies. The API is `URI` based
	 * because it works even without resolved file working copies. If a file working
	 * copy exists for any given `URI`, the implementation will deal with them properly
	 * (e.g. dirty contents of the source will be written to the target and the source
	 * will be reverted).
	 *
	 * Note: it is possible that the returned file working copy has a different `URI`
	 * than the `target` that was passed in. Based on URI identity, the file working
	 * copy may chose to return an existing file working copy with different casing
	 * to respect file systems that are case insensitive.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 *
	 * Note: Untitled file working copies are being disposed when saved.
	 *
	 * @param source the source resource to save as
	 * @param target the optional target resource to save to. if not defined, the user
	 * will be asked for input
	 * @returns the target stored working copy that was saved to or `undefined` in case of
	 * cancellation
	 */
	saveAs(source: URI, target: URI, options?: ISaveOptions): Promise<IStoredFileWorkingCopy<S> | undefined>;
	saveAs(source: URI, target: undefined, options?: IFileWorkingCopySaveAsOptions): Promise<IStoredFileWorkingCopy<S> | undefined>;
}

export interface IFileWorkingCopySaveAsOptions extends ISaveOptions {

	/**
	 * Optional target resource to suggest to the user in case
	 * no target resource is provided to save to.
	 */
	suggestedTarget?: URI;
}

export class FileWorkingCopyManager<S extends IStoredFileWorkingCopyModel, U extends IUntitledFileWorkingCopyModel> extends Disposable implements IFileWorkingCopyManager<S, U> {

	readonly onDidCreate: Event<IFileWorkingCopy<S | U>>;

	private static readonly FILE_WORKING_COPY_SAVE_CREATE_SOURCE = SaveSourceRegistry.registerSource('fileWorkingCopyCreate.source', localize('fileWorkingCopyCreate.source', "File Created"));
	private static readonly FILE_WORKING_COPY_SAVE_REPLACE_SOURCE = SaveSourceRegistry.registerSource('fileWorkingCopyReplace.source', localize('fileWorkingCopyReplace.source', "File Replaced"));

	readonly stored: IStoredFileWorkingCopyManager<S>;
	readonly untitled: IUntitledFileWorkingCopyManager<U>;

	constructor(
		private readonly workingCopyTypeId: string,
		private readonly storedWorkingCopyModelFactory: IStoredFileWorkingCopyModelFactory<S>,
		private readonly untitledWorkingCopyModelFactory: IUntitledFileWorkingCopyModelFactory<U>,
		@IFileService private readonly fileService: IFileService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@ILabelService labelService: ILabelService,
		@ILogService private readonly logService: ILogService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService,
		@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@INotificationService notificationService: INotificationService,
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
		@IEditorService editorService: IEditorService,
		@IElevatedFileService elevatedFileService: IElevatedFileService,
		@IPathService private readonly pathService: IPathService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IDialogService private readonly dialogService: IDialogService,
		@IDecorationsService private readonly decorationsService: IDecorationsService,
		@IProgressService progressService: IProgressService
	) {
		super();

		// Stored file working copies manager
		this.stored = this._register(new StoredFileWorkingCopyManager(
			this.workingCopyTypeId,
			this.storedWorkingCopyModelFactory,
			fileService, lifecycleService, labelService, logService, workingCopyFileService,
			workingCopyBackupService, uriIdentityService, filesConfigurationService, workingCopyService,
			notificationService, workingCopyEditorService, editorService, elevatedFileService, progressService
		));

		// Untitled file working copies manager
		this.untitled = this._register(new UntitledFileWorkingCopyManager(
			this.workingCopyTypeId,
			this.untitledWorkingCopyModelFactory,
			async (workingCopy, options) => {
				const result = await this.saveAs(workingCopy.resource, undefined, options);

				return !!result;
			},
			fileService, labelService, logService, workingCopyBackupService, workingCopyService
		));

		// Events
		this.onDidCreate = Event.any<IFileWorkingCopy<S | U>>(this.stored.onDidCreate, this.untitled.onDidCreate);

		// Decorations
		this.provideDecorations();
	}

	//#region decorations

	private provideDecorations(): void {

		// File working copy decorations
		const provider = this._register(new class extends Disposable implements IDecorationsProvider {

			readonly label = localize('fileWorkingCopyDecorations', "File Working Copy Decorations");

			private readonly _onDidChange = this._register(new Emitter<URI[]>());
			readonly onDidChange = this._onDidChange.event;

			constructor(private readonly stored: IStoredFileWorkingCopyManager<S>) {
				super();

				this.registerListeners();
			}

			private registerListeners(): void {

				// Creates
				this._register(this.stored.onDidResolve(workingCopy => {
					if (workingCopy.isReadonly() || workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN)) {
						this._onDidChange.fire([workingCopy.resource]);
					}
				}));

				// Removals: once a stored working copy is no longer
				// under our control, make sure to signal this as
				// decoration change because from this point on we
				// have no way of updating the decoration anymore.
				this._register(this.stored.onDidRemove(workingCopyUri => this._onDidChange.fire([workingCopyUri])));

				// Changes
				this._register(this.stored.onDidChangeReadonly(workingCopy => this._onDidChange.fire([workingCopy.resource])));
				this._register(this.stored.onDidChangeOrphaned(workingCopy => this._onDidChange.fire([workingCopy.resource])));
			}

			provideDecorations(uri: URI): IDecorationData | undefined {
				const workingCopy = this.stored.get(uri);
				if (!workingCopy || workingCopy.isDisposed()) {
					return undefined;
				}

				const isReadonly = workingCopy.isReadonly();
				const isOrphaned = workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN);

				// Readonly + Orphaned
				if (isReadonly && isOrphaned) {
					return {
						color: listErrorForeground,
						letter: Codicon.lockSmall,
						strikethrough: true,
						tooltip: localize('readonlyAndDeleted', "Deleted, Read-only"),
					};
				}

				// Readonly
				else if (isReadonly) {
					return {
						letter: Codicon.lockSmall,
						tooltip: localize('readonly', "Read-only"),
					};
				}

				// Orphaned
				else if (isOrphaned) {
					return {
						color: listErrorForeground,
						strikethrough: true,
						tooltip: localize('deleted', "Deleted"),
					};
				}

				return undefined;
			}
		}(this.stored));

		this._register(this.decorationsService.registerDecorationsProvider(provider));
	}

	//#endregion

	//#region get / get all

	get workingCopies(): (IUntitledFileWorkingCopy<U> | IStoredFileWorkingCopy<S>)[] {
		return [...this.stored.workingCopies, ...this.untitled.workingCopies];
	}

	get(resource: URI): IUntitledFileWorkingCopy<U> | IStoredFileWorkingCopy<S> | undefined {
		return this.stored.get(resource) ?? this.untitled.get(resource);
	}

	//#endregion

	//#region resolve

	resolve(options?: INewUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<U>>;
	resolve(options?: INewUntitledFileWorkingCopyWithAssociatedResourceOptions): Promise<IUntitledFileWorkingCopy<U>>;
	resolve(options?: INewOrExistingUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<U>>;
	resolve(resource: URI, options?: IStoredFileWorkingCopyResolveOptions): Promise<IStoredFileWorkingCopy<S>>;
	resolve(arg1?: URI | INewUntitledFileWorkingCopyOptions | INewUntitledFileWorkingCopyWithAssociatedResourceOptions | INewOrExistingUntitledFileWorkingCopyOptions, arg2?: IStoredFileWorkingCopyResolveOptions): Promise<IUntitledFileWorkingCopy<U> | IStoredFileWorkingCopy<S>> {
		if (URI.isUri(arg1)) {

			// Untitled: via untitled manager
			if (arg1.scheme === Schemas.untitled) {
				return this.untitled.resolve({ untitledResource: arg1 });
			}

			// else: via stored file manager
			else {
				return this.stored.resolve(arg1, arg2);
			}
		}

		return this.untitled.resolve(arg1);
	}

	//#endregion

	//#region Save

	async saveAs(source: URI, target?: URI, options?: IFileWorkingCopySaveAsOptions): Promise<IStoredFileWorkingCopy<S> | undefined> {

		// Get to target resource
		if (!target) {
			const workingCopy = this.get(source);
			if (workingCopy instanceof UntitledFileWorkingCopy && workingCopy.hasAssociatedFilePath) {
				target = await this.suggestSavePath(source);
			} else {
				target = await this.fileDialogService.pickFileToSave(await this.suggestSavePath(options?.suggestedTarget ?? source), options?.availableFileSystems);
			}
		}

		if (!target) {
			return; // user canceled
		}

		// Ensure target is not marked as readonly and prompt otherwise
		if (this.filesConfigurationService.isReadonly(target)) {
			const confirmed = await this.confirmMakeWriteable(target);
			if (!confirmed) {
				return;
			} else {
				this.filesConfigurationService.updateReadonly(target, false);
			}
		}

		// Just save if target is same as working copies own resource
		// and we are not saving an untitled file working copy
		if (this.fileService.hasProvider(source) && isEqual(source, target)) {
			return this.doSave(source, { ...options, force: true  /* force to save, even if not dirty (https://github.com/microsoft/vscode/issues/99619) */ });
		}

		// If the target is different but of same identity, we
		// move the source to the target, knowing that the
		// underlying file system cannot have both and then save.
		// However, this will only work if the source exists
		// and is not orphaned, so we need to check that too.
		if (this.fileService.hasProvider(source) && this.uriIdentityService.extUri.isEqual(source, target) && (await this.fileService.exists(source))) {

			// Move via working copy file service to enable participants
			await this.workingCopyFileService.move([{ file: { source, target } }], CancellationToken.None);

			// At this point we don't know whether we have a
			// working copy for the source or the target URI so we
			// simply try to save with both resources.
			return (await this.doSave(source, options)) ?? (await this.doSave(target, options));
		}

		// Perform normal "Save As"
		return this.doSaveAs(source, target, options);
	}

	private async doSave(resource: URI, options?: ISaveOptions): Promise<IStoredFileWorkingCopy<S> | undefined> {

		// Save is only possible with stored file working copies,
		// any other have to go via `saveAs` flow.
		const storedFileWorkingCopy = this.stored.get(resource);
		if (storedFileWorkingCopy) {
			const success = await storedFileWorkingCopy.save(options);
			if (success) {
				return storedFileWorkingCopy;
			}
		}

		return undefined;
	}

	private async doSaveAs(source: URI, target: URI, options?: IFileWorkingCopySaveAsOptions): Promise<IStoredFileWorkingCopy<S> | undefined> {
		let sourceContents: VSBufferReadableStream;

		// If the source is an existing file working copy, we can directly
		// use that to copy the contents to the target destination
		const sourceWorkingCopy = this.get(source);
		if (sourceWorkingCopy?.isResolved()) {
			sourceContents = await sourceWorkingCopy.model.snapshot(SnapshotContext.Save, CancellationToken.None);
		}

		// Otherwise we resolve the contents from the underlying file
		else {
			sourceContents = (await this.fileService.readFileStream(source)).value;
		}

		// Resolve target
		const { targetFileExists, targetStoredFileWorkingCopy } = await this.doResolveSaveTarget(source, target);

		// Confirm to overwrite if we have an untitled file working copy with associated path where
		// the file actually exists on disk and we are instructed to save to that file path.
		// This can happen if the file was created after the untitled file was opened.
		// See https://github.com/microsoft/vscode/issues/67946
		if (
			sourceWorkingCopy instanceof UntitledFileWorkingCopy &&
			sourceWorkingCopy.hasAssociatedFilePath &&
			targetFileExists &&
			this.uriIdentityService.extUri.isEqual(target, toLocalResource(sourceWorkingCopy.resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme))
		) {
			const overwrite = await this.confirmOverwrite(target);
			if (!overwrite) {
				return undefined;
			}
		}

		// Take over content from source to target
		await targetStoredFileWorkingCopy.model?.update(sourceContents, CancellationToken.None);

		// Set source options depending on target exists or not
		if (!options?.source) {
			options = {
				...options,
				source: targetFileExists ? FileWorkingCopyManager.FILE_WORKING_COPY_SAVE_REPLACE_SOURCE : FileWorkingCopyManager.FILE_WORKING_COPY_SAVE_CREATE_SOURCE
			};
		}

		// Save target
		const success = await targetStoredFileWorkingCopy.save({
			...options,
			from: source,
			force: true  /* force to save, even if not dirty (https://github.com/microsoft/vscode/issues/99619) */
		});
		if (!success) {
			return undefined;
		}

		// Revert the source
		try {
			await sourceWorkingCopy?.revert();
		} catch (error) {

			// It is possible that reverting the source fails, for example
			// when a remote is disconnected and we cannot read it anymore.
			// However, this should not interrupt the "Save As" flow, so
			// we gracefully catch the error and just log it.

			this.logService.error(error);
		}

		// Events
		if (source.scheme === Schemas.untitled) {
			this.untitled.notifyDidSave(source, target);
		}

		return targetStoredFileWorkingCopy;
	}

	private async doResolveSaveTarget(source: URI, target: URI): Promise<{ targetFileExists: boolean; targetStoredFileWorkingCopy: IStoredFileWorkingCopy<S> }> {

		// Prefer an existing stored file working copy if it is already resolved
		// for the given target resource
		let targetFileExists = false;
		let targetStoredFileWorkingCopy = this.stored.get(target);
		if (targetStoredFileWorkingCopy?.isResolved()) {
			targetFileExists = true;
		}

		// Otherwise create the target working copy empty if
		// it does not exist already and resolve it from there
		else {
			targetFileExists = await this.fileService.exists(target);

			// Create target file adhoc if it does not exist yet
			if (!targetFileExists) {
				await this.workingCopyFileService.create([{ resource: target }], CancellationToken.None);
			}

			// At this point we need to resolve the target working copy
			// and we have to do an explicit check if the source URI
			// equals the target via URI identity. If they match and we
			// have had an existing working copy with the source, we
			// prefer that one over resolving the target. Otherwise we
			// would potentially introduce a
			if (this.uriIdentityService.extUri.isEqual(source, target) && this.get(source)) {
				targetStoredFileWorkingCopy = await this.stored.resolve(source);
			} else {
				targetStoredFileWorkingCopy = await this.stored.resolve(target);
			}
		}

		return { targetFileExists, targetStoredFileWorkingCopy };
	}

	private async confirmOverwrite(resource: URI): Promise<boolean> {
		const { confirmed } = await this.dialogService.confirm({
			type: 'warning',
			message: localize('confirmOverwrite', "'{0}' already exists. Do you want to replace it?", basename(resource)),
			detail: localize('overwriteIrreversible', "A file or folder with the name '{0}' already exists in the folder '{1}'. Replacing it will overwrite its current contents.", basename(resource), basename(dirname(resource))),
			primaryButton: localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace")
		});

		return confirmed;
	}

	private async confirmMakeWriteable(resource: URI): Promise<boolean> {
		const { confirmed } = await this.dialogService.confirm({
			type: 'warning',
			message: localize('confirmMakeWriteable', "'{0}' is marked as read-only. Do you want to save anyway?", basename(resource)),
			detail: localize('confirmMakeWriteableDetail', "Paths can be configured as read-only via settings."),
			primaryButton: localize({ key: 'makeWriteableButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Save Anyway")
		});

		return confirmed;
	}

	private async suggestSavePath(resource: URI): Promise<URI> {

		// 1.) Just take the resource as is if the file service can handle it
		if (this.fileService.hasProvider(resource)) {
			return resource;
		}

		// 2.) Pick the associated file path for untitled working copies if any
		const workingCopy = this.get(resource);
		if (workingCopy instanceof UntitledFileWorkingCopy && workingCopy.hasAssociatedFilePath) {
			return toLocalResource(resource, this.environmentService.remoteAuthority, this.pathService.defaultUriScheme);
		}

		const defaultFilePath = await this.fileDialogService.defaultFilePath();

		// 3.) Pick the working copy name if valid joined with default path
		if (workingCopy) {
			const candidatePath = joinPath(defaultFilePath, workingCopy.name);
			if (await this.pathService.hasValidBasename(candidatePath, workingCopy.name)) {
				return candidatePath;
			}
		}

		// 4.) Finally fallback to the name of the resource joined with default path
		return joinPath(defaultFilePath, basename(resource));
	}

	//#endregion

	//#region Lifecycle

	async destroy(): Promise<void> {
		await Promises.settled([
			this.stored.destroy(),
			this.untitled.destroy()
		]);
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/resourceWorkingCopy.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/resourceWorkingCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { timeout } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { FileChangesEvent, FileChangeType, IFileService } from '../../../../platform/files/common/files.js';
import { ISaveOptions, IRevertOptions } from '../../../common/editor.js';
import { IWorkingCopy, IWorkingCopyBackup, IWorkingCopySaveEvent, WorkingCopyCapabilities } from './workingCopy.js';

/**
 * A resource based `IWorkingCopy` is backed by a `URI` from a
 * known file system provider.
 */
export interface IResourceWorkingCopy extends IWorkingCopy, IDisposable {

	/**
	 * An event for when the orphaned state of the resource working copy changes.
	 */
	readonly onDidChangeOrphaned: Event<void>;

	/**
	 * Whether the resource working copy is orphaned or not.
	 */
	isOrphaned(): boolean;

	/**
	 * An event for when the file working copy has been disposed.
	 */
	readonly onWillDispose: Event<void>;

	/**
	 * Whether the file working copy has been disposed or not.
	 */
	isDisposed(): boolean;
}

export abstract class ResourceWorkingCopy extends Disposable implements IResourceWorkingCopy {

	constructor(
		readonly resource: URI,
		@IFileService protected readonly fileService: IFileService
	) {
		super();

		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));
	}

	//#region Orphaned Tracking

	private readonly _onDidChangeOrphaned = this._register(new Emitter<void>());
	readonly onDidChangeOrphaned = this._onDidChangeOrphaned.event;

	private orphaned = false;

	isOrphaned(): boolean {
		return this.orphaned;
	}

	private async onDidFilesChange(e: FileChangesEvent): Promise<void> {
		let fileEventImpactsUs = false;
		let newInOrphanModeGuess: boolean | undefined;

		// If we are currently orphaned, we check if the file was added back
		if (this.orphaned) {
			const fileWorkingCopyResourceAdded = e.contains(this.resource, FileChangeType.ADDED);
			if (fileWorkingCopyResourceAdded) {
				newInOrphanModeGuess = false;
				fileEventImpactsUs = true;
			}
		}

		// Otherwise we check if the file was deleted
		else {
			const fileWorkingCopyResourceDeleted = e.contains(this.resource, FileChangeType.DELETED);
			if (fileWorkingCopyResourceDeleted) {
				newInOrphanModeGuess = true;
				fileEventImpactsUs = true;
			}
		}

		if (fileEventImpactsUs && this.orphaned !== newInOrphanModeGuess) {
			let newInOrphanModeValidated = false;
			if (newInOrphanModeGuess) {

				// We have received reports of users seeing delete events even though the file still
				// exists (network shares issue: https://github.com/microsoft/vscode/issues/13665).
				// Since we do not want to mark the working copy as orphaned, we have to check if the
				// file is really gone and not just a faulty file event.
				await timeout(100, CancellationToken.None);

				if (this.isDisposed()) {
					newInOrphanModeValidated = true;
				} else {
					const exists = await this.fileService.exists(this.resource);
					newInOrphanModeValidated = !exists;
				}
			}

			if (this.orphaned !== newInOrphanModeValidated && !this.isDisposed()) {
				this.setOrphaned(newInOrphanModeValidated);
			}
		}
	}

	protected setOrphaned(orphaned: boolean): void {
		if (this.orphaned !== orphaned) {
			this.orphaned = orphaned;

			this._onDidChangeOrphaned.fire();
		}
	}

	//#endregion


	//#region Dispose

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	isDisposed(): boolean {
		return this._store.isDisposed;
	}

	override dispose(): void {

		// State
		this.orphaned = false;

		// Event
		this._onWillDispose.fire();

		super.dispose();
	}

	//#endregion

	//#region Modified Tracking

	isModified(): boolean {
		return this.isDirty();
	}

	//#endregion

	//#region Abstract

	abstract typeId: string;
	abstract name: string;
	abstract capabilities: WorkingCopyCapabilities;

	abstract onDidChangeDirty: Event<void>;
	abstract onDidChangeContent: Event<void>;
	abstract onDidSave: Event<IWorkingCopySaveEvent>;

	abstract isDirty(): boolean;

	abstract backup(token: CancellationToken): Promise<IWorkingCopyBackup>;
	abstract save(options?: ISaveOptions): Promise<boolean>;
	abstract revert(options?: IRevertOptions): Promise<void>;

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/storedFileWorkingCopy.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/storedFileWorkingCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ETAG_DISABLED, FileOperationError, FileOperationResult, IFileReadLimits, IFileService, IFileStatWithMetadata, IFileStreamContent, IWriteFileOptions, NotModifiedSinceFileOperationError } from '../../../../platform/files/common/files.js';
import { ISaveOptions, IRevertOptions, SaveReason } from '../../../common/editor.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { IWorkingCopyBackup, IWorkingCopyBackupMeta, IWorkingCopySaveEvent, WorkingCopyCapabilities } from './workingCopy.js';
import { raceCancellation, TaskSequentializer, timeout } from '../../../../base/common/async.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { IWorkingCopyFileService } from './workingCopyFileService.js';
import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyBackupService, IResolvedWorkingCopyBackup } from './workingCopyBackup.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { hash } from '../../../../base/common/hash.js';
import { isErrorWithActions, toErrorMessage } from '../../../../base/common/errorMessage.js';
import { IAction, toAction } from '../../../../base/common/actions.js';
import { isWindows } from '../../../../base/common/platform.js';
import { IWorkingCopyEditorService } from './workingCopyEditorService.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { IResourceWorkingCopy, ResourceWorkingCopy } from './resourceWorkingCopy.js';
import { IFileWorkingCopy, IFileWorkingCopyModel, IFileWorkingCopyModelFactory, SnapshotContext } from './fileWorkingCopy.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { isCancellationError } from '../../../../base/common/errors.js';

/**
 * Stored file specific working copy model factory.
 */
export interface IStoredFileWorkingCopyModelFactory<M extends IStoredFileWorkingCopyModel> extends IFileWorkingCopyModelFactory<M> { }

/**
 * The underlying model of a stored file working copy provides some
 * methods for the stored file working copy to function. The model is
 * typically only available after the working copy has been
 * resolved via it's `resolve()` method.
 */
export interface IStoredFileWorkingCopyModel extends IFileWorkingCopyModel {

	readonly onDidChangeContent: Event<IStoredFileWorkingCopyModelContentChangedEvent>;

	/**
	 * A version ID of the model. If a `onDidChangeContent` is fired
	 * from the model and the last known saved `versionId` matches
	 * with the `model.versionId`, the stored file working copy will
	 * discard any dirty state.
	 *
	 * A use case is the following:
	 * - a stored file working copy gets edited and thus dirty
	 * - the user triggers undo to revert the changes
	 * - at this point the `versionId` should match the one we had saved
	 *
	 * This requires the model to be aware of undo/redo operations.
	 */
	readonly versionId: unknown;

	/**
	 * Close the current undo-redo element. This offers a way
	 * to create an undo/redo stop point.
	 *
	 * This method may for example be called right before the
	 * save is triggered so that the user can always undo back
	 * to the state before saving.
	 */
	pushStackElement(): void;

	/**
	 * Optionally allows a stored file working copy model to
	 * implement the `save` method. This allows to implement
	 * a more efficient save logic compared to the default
	 * which is to ask the model for a `snapshot` and then
	 * writing that to the model's resource.
	 */
	save?(options: IWriteFileOptions, token: CancellationToken): Promise<IFileStatWithMetadata>;
}

export interface IStoredFileWorkingCopyModelContentChangedEvent {

	/**
	 * Flag that indicates that this event was generated while undoing.
	 */
	readonly isUndoing: boolean;

	/**
	 * Flag that indicates that this event was generated while redoing.
	 */
	readonly isRedoing: boolean;
}

/**
 * A stored file based `IWorkingCopy` is backed by a `URI` from a
 * known file system provider. Given this assumption, a lot
 * of functionality can be built on top, such as saving in
 * a secure way to prevent data loss.
 */
export interface IStoredFileWorkingCopy<M extends IStoredFileWorkingCopyModel> extends IResourceWorkingCopy, IFileWorkingCopy<M> {

	/**
	 * An event for when a stored file working copy was resolved.
	 */
	readonly onDidResolve: Event<void>;

	/**
	 * An event for when a stored file working copy was saved successfully.
	 */
	readonly onDidSave: Event<IStoredFileWorkingCopySaveEvent>;

	/**
	 * An event indicating that a stored file working copy save operation failed.
	 */
	readonly onDidSaveError: Event<void>;

	/**
	 * An event for when the readonly state of the stored file working copy changes.
	 */
	readonly onDidChangeReadonly: Event<void>;

	/**
	 * Resolves a stored file working copy.
	 */
	resolve(options?: IStoredFileWorkingCopyResolveOptions): Promise<void>;

	/**
	 * Explicitly sets the working copy to be modified.
	 */
	markModified(): void;

	/**
	 * Whether the stored file working copy is in the provided `state`
	 * or not.
	 *
	 * @param state the `FileWorkingCopyState` to check on.
	 */
	hasState(state: StoredFileWorkingCopyState): boolean;

	/**
	 * Allows to join a state change away from the provided `state`.
	 *
	 * @param state currently only `FileWorkingCopyState.PENDING_SAVE`
	 * can be awaited on to resolve.
	 */
	joinState(state: StoredFileWorkingCopyState.PENDING_SAVE): Promise<void>;

	/**
	 * Whether we have a resolved model or not.
	 */
	isResolved(): this is IResolvedStoredFileWorkingCopy<M>;

	/**
	 * Whether the stored file working copy is readonly or not.
	 */
	isReadonly(): boolean | IMarkdownString;

	/**
	 * Asks the stored file working copy to save. If the stored file
	 * working copy was dirty, it is expected to be non-dirty after
	 * this operation has finished.
	 *
	 * @returns `true` if the operation was successful and `false` otherwise.
	 */
	save(options?: IStoredFileWorkingCopySaveAsOptions): Promise<boolean>;
}

export interface IResolvedStoredFileWorkingCopy<M extends IStoredFileWorkingCopyModel> extends IStoredFileWorkingCopy<M> {

	/**
	 * A resolved stored file working copy has a resolved model.
	 */
	readonly model: M;
}

/**
 * States the stored file working copy can be in.
 */
export const enum StoredFileWorkingCopyState {

	/**
	 * A stored file working copy is saved.
	 */
	SAVED,

	/**
	 * A stored file working copy is dirty.
	 */
	DIRTY,

	/**
	 * A stored file working copy is currently being saved but
	 * this operation has not completed yet.
	 */
	PENDING_SAVE,

	/**
	 * A stored file working copy is in conflict mode when changes
	 * cannot be saved because the underlying file has changed.
	 * Stored file working copies in conflict mode are always dirty.
	 */
	CONFLICT,

	/**
	 * A stored file working copy is in orphan state when the underlying
	 * file has been deleted.
	 */
	ORPHAN,

	/**
	 * Any error that happens during a save that is not causing
	 * the `StoredFileWorkingCopyState.CONFLICT` state.
	 * Stored file working copies in error mode are always dirty.
	 */
	ERROR
}

export interface IStoredFileWorkingCopySaveOptions extends ISaveOptions {

	/**
	 * Save the stored file working copy with an attempt to unlock it.
	 */
	readonly writeUnlock?: boolean;

	/**
	 * Save the stored file working copy with elevated privileges.
	 *
	 * Note: This may not be supported in all environments.
	 */
	readonly writeElevated?: boolean;

	/**
	 * Allows to write to a stored file working copy even if it has been
	 * modified on disk. This should only be triggered from an
	 * explicit user action.
	 */
	readonly ignoreModifiedSince?: boolean;

	/**
	 * If set, will bubble up the stored file working copy save error to
	 * the caller instead of handling it.
	 */
	readonly ignoreErrorHandler?: boolean;
}

export interface IStoredFileWorkingCopySaveAsOptions extends IStoredFileWorkingCopySaveOptions {

	/**
	 * Optional URI of the resource the text file is saved from if known.
	 */
	readonly from?: URI;
}

export interface IStoredFileWorkingCopyResolver {

	/**
	 * Resolves the working copy in a safe way from an external
	 * working copy manager that can make sure multiple parallel
	 * resolves execute properly.
	 */
	(options?: IStoredFileWorkingCopyResolveOptions): Promise<void>;
}

export interface IStoredFileWorkingCopyResolveOptions {

	/**
	 * The contents to use for the stored file working copy if known. If not
	 * provided, the contents will be retrieved from the underlying
	 * resource or backup if present.
	 *
	 * If contents are provided, the stored file working copy will be marked
	 * as dirty right from the beginning.
	 */
	readonly contents?: VSBufferReadableStream;

	/**
	 * Go to disk bypassing any cache of the stored file working copy if any.
	 */
	readonly forceReadFromFile?: boolean;

	/**
	 * If provided, the size of the file will be checked against the limits
	 * and an error will be thrown if any limit is exceeded.
	 */
	readonly limits?: IFileReadLimits;
}

/**
 * Metadata associated with a stored file working copy backup.
 */
interface IStoredFileWorkingCopyBackupMetaData extends IWorkingCopyBackupMeta {
	readonly mtime: number;
	readonly ctime: number;
	readonly size: number;
	readonly etag: string;
	readonly orphaned: boolean;
}

export interface IStoredFileWorkingCopySaveEvent extends IWorkingCopySaveEvent {

	/**
	 * The resolved stat from the save operation.
	 */
	readonly stat: IFileStatWithMetadata;
}

export function isStoredFileWorkingCopySaveEvent(e: IWorkingCopySaveEvent): e is IStoredFileWorkingCopySaveEvent {
	const candidate = e as IStoredFileWorkingCopySaveEvent;

	return !!candidate.stat;
}

export class StoredFileWorkingCopy<M extends IStoredFileWorkingCopyModel> extends ResourceWorkingCopy implements IStoredFileWorkingCopy<M> {

	readonly capabilities: WorkingCopyCapabilities = WorkingCopyCapabilities.None;

	private _model: M | undefined = undefined;
	get model(): M | undefined { return this._model; }

	//#region events

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidResolve = this._register(new Emitter<void>());
	readonly onDidResolve = this._onDidResolve.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidSaveError = this._register(new Emitter<void>());
	readonly onDidSaveError = this._onDidSaveError.event;

	private readonly _onDidSave = this._register(new Emitter<IStoredFileWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<void>());
	readonly onDidRevert = this._onDidRevert.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<void>());
	readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	//#endregion

	constructor(
		readonly typeId: string,
		resource: URI,
		readonly name: string,
		private readonly modelFactory: IStoredFileWorkingCopyModelFactory<M>,
		private readonly externalResolver: IStoredFileWorkingCopyResolver,
		@IFileService fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyBackupService private readonly workingCopyBackupService: IWorkingCopyBackupService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@INotificationService private readonly notificationService: INotificationService,
		@IWorkingCopyEditorService private readonly workingCopyEditorService: IWorkingCopyEditorService,
		@IEditorService private readonly editorService: IEditorService,
		@IElevatedFileService private readonly elevatedFileService: IElevatedFileService,
		@IProgressService private readonly progressService: IProgressService
	) {
		super(resource, fileService);

		// Make known to working copy service
		this._register(workingCopyService.registerWorkingCopy(this));

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.filesConfigurationService.onDidChangeReadonly(() => this._onDidChangeReadonly.fire()));
	}

	//#region Dirty

	private dirty = false;
	private savedVersionId: unknown;

	isDirty(): this is IResolvedStoredFileWorkingCopy<M> {
		return this.dirty;
	}

	markModified(): void {
		this.setDirty(true); // stored file working copy tracks modified via dirty
	}

	private setDirty(dirty: boolean): void {
		if (!this.isResolved()) {
			return; // only resolved working copies can be marked dirty
		}

		// Track dirty state and version id
		const wasDirty = this.dirty;
		this.doSetDirty(dirty);

		// Emit as Event if dirty changed
		if (dirty !== wasDirty) {
			this._onDidChangeDirty.fire();
		}
	}

	private doSetDirty(dirty: boolean): () => void {
		const wasDirty = this.dirty;
		const wasInConflictMode = this.inConflictMode;
		const wasInErrorMode = this.inErrorMode;
		const oldSavedVersionId = this.savedVersionId;

		if (!dirty) {
			this.dirty = false;
			this.inConflictMode = false;
			this.inErrorMode = false;

			// we remember the models alternate version id to remember when the version
			// of the model matches with the saved version on disk. we need to keep this
			// in order to find out if the model changed back to a saved version (e.g.
			// when undoing long enough to reach to a version that is saved and then to
			// clear the dirty flag)
			if (this.isResolved()) {
				this.savedVersionId = this.model.versionId;
			}
		} else {
			this.dirty = true;
		}

		// Return function to revert this call
		return () => {
			this.dirty = wasDirty;
			this.inConflictMode = wasInConflictMode;
			this.inErrorMode = wasInErrorMode;
			this.savedVersionId = oldSavedVersionId;
		};
	}

	//#endregion

	//#region Resolve

	lastResolvedFileStat: IFileStatWithMetadata | undefined; // !!! DO NOT MARK PRIVATE! USED IN TESTS !!!

	isResolved(): this is IResolvedStoredFileWorkingCopy<M> {
		return !!this.model;
	}

	async resolve(options?: IStoredFileWorkingCopyResolveOptions): Promise<void> {
		this.trace('resolve() - enter');

		// Return early if we are disposed
		if (this.isDisposed()) {
			this.trace('resolve() - exit - without resolving because file working copy is disposed');

			return;
		}

		// Unless there are explicit contents provided, it is important that we do not
		// resolve a working copy that is dirty or is in the process of saving to prevent
		// data loss.
		if (!options?.contents && (this.dirty || this.saveSequentializer.isRunning())) {
			this.trace('resolve() - exit - without resolving because file working copy is dirty or being saved');

			return;
		}

		return this.doResolve(options);
	}

	private async doResolve(options?: IStoredFileWorkingCopyResolveOptions): Promise<void> {

		// First check if we have contents to use for the working copy
		if (options?.contents) {
			return this.resolveFromBuffer(options.contents);
		}

		// Second, check if we have a backup to resolve from (only for new working copies)
		const isNew = !this.isResolved();
		if (isNew) {
			const resolvedFromBackup = await this.resolveFromBackup();
			if (resolvedFromBackup) {
				return;
			}
		}

		// Finally, resolve from file resource
		return this.resolveFromFile(options);
	}

	private async resolveFromBuffer(buffer: VSBufferReadableStream): Promise<void> {
		this.trace('resolveFromBuffer()');

		// Try to resolve metdata from disk
		let mtime: number;
		let ctime: number;
		let size: number;
		let etag: string;
		try {
			const metadata = await this.fileService.stat(this.resource);
			mtime = metadata.mtime;
			ctime = metadata.ctime;
			size = metadata.size;
			etag = metadata.etag;

			// Clear orphaned state when resolving was successful
			this.setOrphaned(false);
		} catch (error) {

			// Put some fallback values in error case
			mtime = Date.now();
			ctime = Date.now();
			size = 0;
			etag = ETAG_DISABLED;

			// Apply orphaned state based on error code
			this.setOrphaned(error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND);
		}

		// Resolve with buffer
		return this.resolveFromContent({
			resource: this.resource,
			name: this.name,
			mtime,
			ctime,
			size,
			etag,
			value: buffer,
			readonly: false,
			locked: false
		}, true /* dirty (resolved from buffer) */);
	}

	private async resolveFromBackup(): Promise<boolean> {

		// Resolve backup if any
		const backup = await this.workingCopyBackupService.resolve<IStoredFileWorkingCopyBackupMetaData>(this);

		// Abort if someone else managed to resolve the working copy by now
		const isNew = !this.isResolved();
		if (!isNew) {
			this.trace('resolveFromBackup() - exit - withoutresolving because previously new file working copy got created meanwhile');

			return true; // imply that resolving has happened in another operation
		}

		// Try to resolve from backup if we have any
		if (backup) {
			await this.doResolveFromBackup(backup);

			return true;
		}

		// Otherwise signal back that resolving did not happen
		return false;
	}

	private async doResolveFromBackup(backup: IResolvedWorkingCopyBackup<IStoredFileWorkingCopyBackupMetaData>): Promise<void> {
		this.trace('doResolveFromBackup()');

		// Resolve with backup
		await this.resolveFromContent({
			resource: this.resource,
			name: this.name,
			mtime: backup.meta ? backup.meta.mtime : Date.now(),
			ctime: backup.meta ? backup.meta.ctime : Date.now(),
			size: backup.meta ? backup.meta.size : 0,
			etag: backup.meta ? backup.meta.etag : ETAG_DISABLED, // etag disabled if unknown!
			value: backup.value,
			readonly: false,
			locked: false
		}, true /* dirty (resolved from backup) */);

		// Restore orphaned flag based on state
		if (backup.meta?.orphaned) {
			this.setOrphaned(true);
		}
	}

	private async resolveFromFile(options?: IStoredFileWorkingCopyResolveOptions): Promise<void> {
		this.trace('resolveFromFile()');

		const forceReadFromFile = options?.forceReadFromFile;

		// Decide on etag
		let etag: string | undefined;
		if (forceReadFromFile) {
			etag = ETAG_DISABLED; // disable ETag if we enforce to read from disk
		} else if (this.lastResolvedFileStat) {
			etag = this.lastResolvedFileStat.etag; // otherwise respect etag to support caching
		}

		// Remember current version before doing any long running operation
		// to ensure we are not changing a working copy that was changed
		// meanwhile
		const currentVersionId = this.versionId;

		// Resolve Content
		try {
			const content = await this.fileService.readFileStream(this.resource, {
				etag,
				limits: options?.limits
			});

			// Clear orphaned state when resolving was successful
			this.setOrphaned(false);

			// Return early if the working copy content has changed
			// meanwhile to prevent loosing any changes
			if (currentVersionId !== this.versionId) {
				this.trace('resolveFromFile() - exit - without resolving because file working copy content changed');

				return;
			}

			await this.resolveFromContent(content, false /* not dirty (resolved from file) */);
		} catch (error) {
			const result = error.fileOperationResult;

			// Apply orphaned state based on error code
			this.setOrphaned(result === FileOperationResult.FILE_NOT_FOUND);

			// NotModified status is expected and can be handled gracefully
			// if we are resolved. We still want to update our last resolved
			// stat to e.g. detect changes to the file's readonly state
			if (this.isResolved() && result === FileOperationResult.FILE_NOT_MODIFIED_SINCE) {
				if (error instanceof NotModifiedSinceFileOperationError) {
					this.updateLastResolvedFileStat(error.stat);
				}

				return;
			}

			// Unless we are forced to read from the file, ignore when a working copy has
			// been resolved once and the file was deleted meanwhile. Since we already have
			// the working copy resolved, we can return to this state and update the orphaned
			// flag to indicate that this working copy has no version on disk anymore.
			if (this.isResolved() && result === FileOperationResult.FILE_NOT_FOUND && !forceReadFromFile) {
				return;
			}

			// Otherwise bubble up the error
			throw error;
		}
	}

	private async resolveFromContent(content: IFileStreamContent, dirty: boolean): Promise<void> {
		this.trace('resolveFromContent() - enter');

		// Return early if we are disposed
		if (this.isDisposed()) {
			this.trace('resolveFromContent() - exit - because working copy is disposed');

			return;
		}

		// Update our resolved disk stat
		this.updateLastResolvedFileStat({
			resource: this.resource,
			name: content.name,
			mtime: content.mtime,
			ctime: content.ctime,
			size: content.size,
			etag: content.etag,
			readonly: content.readonly,
			locked: content.locked,
			isFile: true,
			isDirectory: false,
			isSymbolicLink: false,
			children: undefined
		});

		// Update existing model if we had been resolved
		if (this.isResolved()) {
			await this.doUpdateModel(content.value);
		}

		// Create new model otherwise
		else {
			await this.doCreateModel(content.value);
		}

		// Update working copy dirty flag. This is very important to call
		// in both cases of dirty or not because it conditionally updates
		// the `savedVersionId` to determine the version when to consider
		// the working copy as saved again (e.g. when undoing back to the
		// saved state)
		this.setDirty(!!dirty);

		// Emit as event
		this._onDidResolve.fire();
	}

	private async doCreateModel(contents: VSBufferReadableStream): Promise<void> {
		this.trace('doCreateModel()');

		// Create model and dispose it when we get disposed
		this._model = this._register(await this.modelFactory.createModel(this.resource, contents, CancellationToken.None));

		// Model listeners
		this.installModelListeners(this._model);
	}

	private ignoreDirtyOnModelContentChange = false;

	private async doUpdateModel(contents: VSBufferReadableStream): Promise<void> {
		this.trace('doUpdateModel()');

		// Update model value in a block that ignores content change events for dirty tracking
		this.ignoreDirtyOnModelContentChange = true;
		try {
			await this.model?.update(contents, CancellationToken.None);
		} finally {
			this.ignoreDirtyOnModelContentChange = false;
		}
	}

	private installModelListeners(model: M): void {

		// See https://github.com/microsoft/vscode/issues/30189
		// This code has been extracted to a different method because it caused a memory leak
		// where `value` was captured in the content change listener closure scope.

		// Content Change
		this._register(model.onDidChangeContent(e => this.onModelContentChanged(model, e.isUndoing || e.isRedoing)));

		// Lifecycle
		this._register(model.onWillDispose(() => this.dispose()));
	}

	private onModelContentChanged(model: M, isUndoingOrRedoing: boolean): void {
		this.trace(`onModelContentChanged() - enter`);

		// In any case increment the version id because it tracks the content state of the model at all times
		this.versionId++;
		this.trace(`onModelContentChanged() - new versionId ${this.versionId}`);

		// Remember when the user changed the model through a undo/redo operation.
		// We need this information to throttle save participants to fix
		// https://github.com/microsoft/vscode/issues/102542
		if (isUndoingOrRedoing) {
			this.lastContentChangeFromUndoRedo = Date.now();
		}

		// We mark check for a dirty-state change upon model content change, unless:
		// - explicitly instructed to ignore it (e.g. from model.resolve())
		// - the model is readonly (in that case we never assume the change was done by the user)
		if (!this.ignoreDirtyOnModelContentChange && !this.isReadonly()) {

			// The contents changed as a matter of Undo and the version reached matches the saved one
			// In this case we clear the dirty flag and emit a SAVED event to indicate this state.
			if (model.versionId === this.savedVersionId) {
				this.trace('onModelContentChanged() - model content changed back to last saved version');

				// Clear flags
				const wasDirty = this.dirty;
				this.setDirty(false);

				// Emit revert event if we were dirty
				if (wasDirty) {
					this._onDidRevert.fire();
				}
			}

			// Otherwise the content has changed and we signal this as becoming dirty
			else {
				this.trace('onModelContentChanged() - model content changed and marked as dirty');

				// Mark as dirty
				this.setDirty(true);
			}
		}

		// Emit as event
		this._onDidChangeContent.fire();
	}

	private async forceResolveFromFile(): Promise<void> {
		if (this.isDisposed()) {
			return; // return early when the working copy is invalid
		}

		// We go through the resolver to make
		// sure this kind of `resolve` is properly
		// running in sequence with any other running
		// `resolve` if any, including subsequent runs
		// that are triggered right after.

		await this.externalResolver({
			forceReadFromFile: true
		});
	}

	//#endregion

	//#region Backup

	get backupDelay(): number | undefined {
		return this.model?.configuration?.backupDelay;
	}

	async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {

		// Fill in metadata if we are resolved
		let meta: IStoredFileWorkingCopyBackupMetaData | undefined = undefined;
		if (this.lastResolvedFileStat) {
			meta = {
				mtime: this.lastResolvedFileStat.mtime,
				ctime: this.lastResolvedFileStat.ctime,
				size: this.lastResolvedFileStat.size,
				etag: this.lastResolvedFileStat.etag,
				orphaned: this.isOrphaned()
			};
		}

		// Fill in content if we are resolved
		let content: VSBufferReadableStream | undefined = undefined;
		if (this.isResolved()) {
			content = await raceCancellation(this.model.snapshot(SnapshotContext.Backup, token), token);
		}

		return { meta, content };
	}

	//#endregion

	//#region Save

	private versionId = 0;

	private static readonly UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD = 500;
	private lastContentChangeFromUndoRedo: number | undefined = undefined;

	private readonly saveSequentializer = new TaskSequentializer();

	private ignoreSaveFromSaveParticipants = false;

	async save(options: IStoredFileWorkingCopySaveAsOptions = Object.create(null)): Promise<boolean> {
		if (!this.isResolved()) {
			return false;
		}

		if (this.isReadonly()) {
			this.trace('save() - ignoring request for readonly resource');

			return false; // if working copy is readonly we do not attempt to save at all
		}

		if (
			(this.hasState(StoredFileWorkingCopyState.CONFLICT) || this.hasState(StoredFileWorkingCopyState.ERROR)) &&
			(options.reason === SaveReason.AUTO || options.reason === SaveReason.FOCUS_CHANGE || options.reason === SaveReason.WINDOW_CHANGE)
		) {
			this.trace('save() - ignoring auto save request for file working copy that is in conflict or error');

			return false; // if working copy is in save conflict or error, do not save unless save reason is explicit
		}

		// Actually do save
		this.trace('save() - enter');
		await this.doSave(options);
		this.trace('save() - exit');

		return this.hasState(StoredFileWorkingCopyState.SAVED);
	}

	private async doSave(options: IStoredFileWorkingCopySaveAsOptions): Promise<void> {
		if (typeof options.reason !== 'number') {
			options.reason = SaveReason.EXPLICIT;
		}

		const versionId = this.versionId;
		this.trace(`doSave(${versionId}) - enter with versionId ${versionId}`);

		// Return early if saved from within save participant to break recursion
		//
		// Scenario: a save participant triggers a save() on the working copy
		if (this.ignoreSaveFromSaveParticipants) {
			this.trace(`doSave(${versionId}) - exit - refusing to save() recursively from save participant`);

			return;
		}

		// Lookup any running save for this versionId and return it if found
		//
		// Scenario: user invoked the save action multiple times quickly for the same contents
		//           while the save was not yet finished to disk
		//
		if (this.saveSequentializer.isRunning(versionId)) {
			this.trace(`doSave(${versionId}) - exit - found a running save for versionId ${versionId}`);

			return this.saveSequentializer.running;
		}

		// Return early if not dirty (unless forced)
		//
		// Scenario: user invoked save action even though the working copy is not dirty
		if (!options.force && !this.dirty) {
			this.trace(`doSave(${versionId}) - exit - because not dirty and/or versionId is different (this.isDirty: ${this.dirty}, this.versionId: ${this.versionId})`);

			return;
		}

		// Return if currently saving by storing this save request as the next save that should happen.
		// Never ever must 2 saves execute at the same time because this can lead to dirty writes and race conditions.
		//
		// Scenario A: auto save was triggered and is currently busy saving to disk. this takes long enough that another auto save
		//             kicks in.
		// Scenario B: save is very slow (e.g. network share) and the user manages to change the working copy and trigger another save
		//             while the first save has not returned yet.
		//
		if (this.saveSequentializer.isRunning()) {
			this.trace(`doSave(${versionId}) - exit - because busy saving`);

			// Indicate to the save sequentializer that we want to
			// cancel the running operation so that ours can run
			// before the running one finishes.
			// Currently this will try to cancel running save
			// participants and running snapshots from the
			// save operation, but not the actual save which does
			// not support cancellation yet.
			this.saveSequentializer.cancelRunning();

			// Queue this as the upcoming save and return
			return this.saveSequentializer.queue(() => this.doSave(options));
		}

		// Push all edit operations to the undo stack so that the user has a chance to
		// Ctrl+Z back to the saved version.
		if (this.isResolved()) {
			this.model.pushStackElement();
		}

		const saveCancellation = new CancellationTokenSource();

		return this.progressService.withProgress({
			title: localize('saveParticipants', "Saving '{0}'", this.name),
			location: ProgressLocation.Window,
			cancellable: true,
			delay: this.isDirty() ? 3000 : 5000
		}, progress => {
			return this.doSaveSequential(versionId, options, progress, saveCancellation);
		}, () => {
			saveCancellation.cancel();
		}).finally(() => {
			saveCancellation.dispose();
		});
	}

	private doSaveSequential(versionId: number, options: IStoredFileWorkingCopySaveAsOptions, progress: IProgress<IProgressStep>, saveCancellation: CancellationTokenSource): Promise<void> {
		return this.saveSequentializer.run(versionId, (async () => {

			// A save participant can still change the working copy now
			// and since we are so close to saving we do not want to trigger
			// another auto save or similar, so we block this
			// In addition we update our version right after in case it changed
			// because of a working copy change
			// Save participants can also be skipped through API.
			if (this.isResolved() && !options.skipSaveParticipants && this.workingCopyFileService.hasSaveParticipants) {
				try {

					// Measure the time it took from the last undo/redo operation to this save. If this
					// time is below `UNDO_REDO_SAVE_PARTICIPANTS_THROTTLE_THRESHOLD`, we make sure to
					// delay the save participant for the remaining time if the reason is auto save.
					//
					// This fixes the following issue:
					// - the user has configured auto save with delay of 100ms or shorter
					// - the user has a save participant enabled that modifies the file on each save
					// - the user types into the file and the file gets saved
					// - the user triggers undo operation
					// - this will undo the save participant change but trigger the save participant right after
					// - the user has no chance to undo over the save participant
					//
					// Reported as: https://github.com/microsoft/vscode/issues/102542
					if (options.reason === SaveReason.AUTO && typeof this.lastContentChangeFromUndoRedo === 'number') {
						const timeFromUndoRedoToSave = Date.now() - this.lastContentChangeFromUndoRedo;
						if (timeFromUndoRedoToSave < StoredFileWorkingCopy.UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD) {
							await timeout(StoredFileWorkingCopy.UNDO_REDO_SAVE_PARTICIPANTS_AUTO_SAVE_THROTTLE_THRESHOLD - timeFromUndoRedoToSave);
						}
					}

					// Run save participants unless save was cancelled meanwhile
					if (!saveCancellation.token.isCancellationRequested) {
						this.ignoreSaveFromSaveParticipants = true;
						try {
							await this.workingCopyFileService.runSaveParticipants(this, { reason: options.reason ?? SaveReason.EXPLICIT, savedFrom: options.from }, progress, saveCancellation.token);
						} catch (err) {
							if (isCancellationError(err) && !saveCancellation.token.isCancellationRequested) {
								// participant wants to cancel this operation
								saveCancellation.cancel();
							}
						} finally {
							this.ignoreSaveFromSaveParticipants = false;
						}
					}
				} catch (error) {
					this.logService.error(`[stored file working copy] runSaveParticipants(${versionId}) - resulted in an error: ${error.toString()}`, this.resource.toString(), this.typeId);
				}
			}

			// It is possible that a subsequent save is cancelling this
			// running save. As such we return early when we detect that.
			if (saveCancellation.token.isCancellationRequested) {
				return;
			}

			// We have to protect against being disposed at this point. It could be that the save() operation
			// was triggerd followed by a dispose() operation right after without waiting. Typically we cannot
			// be disposed if we are dirty, but if we are not dirty, save() and dispose() can still be triggered
			// one after the other without waiting for the save() to complete. If we are disposed(), we risk
			// saving contents to disk that are stale (see https://github.com/microsoft/vscode/issues/50942).
			// To fix this issue, we will not store the contents to disk when we got disposed.
			if (this.isDisposed()) {
				return;
			}

			// We require a resolved working copy from this point on, since we are about to write data to disk.
			if (!this.isResolved()) {
				return;
			}

			// update versionId with its new value (if pre-save changes happened)
			versionId = this.versionId;

			// Clear error flag since we are trying to save again
			this.inErrorMode = false;

			// Save to Disk. We mark the save operation as currently running with
			// the latest versionId because it might have changed from a save
			// participant triggering
			progress.report({ message: localize('saveTextFile', "Writing into file...") });
			this.trace(`doSave(${versionId}) - before write()`);
			const lastResolvedFileStat = assertReturnsDefined(this.lastResolvedFileStat);
			const resolvedFileWorkingCopy = this;
			return this.saveSequentializer.run(versionId, (async () => {
				try {
					const writeFileOptions: IWriteFileOptions = {
						mtime: lastResolvedFileStat.mtime,
						etag: (options.ignoreModifiedSince || !this.filesConfigurationService.preventSaveConflicts(lastResolvedFileStat.resource)) ? ETAG_DISABLED : lastResolvedFileStat.etag,
						unlock: options.writeUnlock
					};

					let stat: IFileStatWithMetadata;

					// Delegate to working copy model save method if any
					if (typeof resolvedFileWorkingCopy.model.save === 'function') {
						try {
							stat = await resolvedFileWorkingCopy.model.save(writeFileOptions, saveCancellation.token);
						} catch (error) {
							if (saveCancellation.token.isCancellationRequested) {
								return undefined; // save was cancelled
							}

							throw error;
						}
					}

					// Otherwise ask for a snapshot and save via file services
					else {

						// Snapshot working copy model contents
						const snapshot = await raceCancellation(resolvedFileWorkingCopy.model.snapshot(SnapshotContext.Save, saveCancellation.token), saveCancellation.token);

						// It is possible that a subsequent save is cancelling this
						// running save. As such we return early when we detect that
						// However, we do not pass the token into the file service
						// because that is an atomic operation currently without
						// cancellation support, so we dispose the cancellation if
						// it was not cancelled yet.
						if (saveCancellation.token.isCancellationRequested) {
							return;
						} else {
							saveCancellation.dispose();
						}

						// Write them to disk
						if (options?.writeElevated && this.elevatedFileService.isSupported(lastResolvedFileStat.resource)) {
							stat = await this.elevatedFileService.writeFileElevated(lastResolvedFileStat.resource, assertReturnsDefined(snapshot), writeFileOptions);
						} else {
							stat = await this.fileService.writeFile(lastResolvedFileStat.resource, assertReturnsDefined(snapshot), writeFileOptions);
						}
					}

					this.handleSaveSuccess(stat, versionId, options);
				} catch (error) {
					this.handleSaveError(error, versionId, options);
				}
			})(), () => saveCancellation.cancel());
		})(), () => saveCancellation.cancel());
	}

	private handleSaveSuccess(stat: IFileStatWithMetadata, versionId: number, options: IStoredFileWorkingCopySaveAsOptions): void {

		// Updated resolved stat with updated stat
		this.updateLastResolvedFileStat(stat);

		// Update dirty state unless working copy has changed meanwhile
		if (versionId === this.versionId) {
			this.trace(`handleSaveSuccess(${versionId}) - setting dirty to false because versionId did not change`);
			this.setDirty(false);
		} else {
			this.trace(`handleSaveSuccess(${versionId}) - not setting dirty to false because versionId did change meanwhile`);
		}

		// Update orphan state given save was successful
		this.setOrphaned(false);

		// Emit Save Event
		this._onDidSave.fire({ reason: options.reason, stat, source: options.source });
	}

	private handleSaveError(error: Error, versionId: number, options: IStoredFileWorkingCopySaveAsOptions): void {
		(options.ignoreErrorHandler ? this.logService.trace : this.logService.error).apply(this.logService, [`[stored file working copy] handleSaveError(${versionId}) - exit - resulted in a save error: ${error.toString()}`, this.resource.toString(), this.typeId]);

		// Return early if the save() call was made asking to
		// handle the save error itself.
		if (options.ignoreErrorHandler) {
			throw error;
		}

		// In any case of an error, we mark the working copy as dirty to prevent data loss
		// It could be possible that the write corrupted the file on disk (e.g. when
		// an error happened after truncating the file) and as such we want to preserve
		// the working copy contents to prevent data loss.
		this.setDirty(true);

		// Flag as error state
		this.inErrorMode = true;

		// Look out for a save conflict
		if ((error as FileOperationError).fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE) {
			this.inConflictMode = true;
		}

		// Show save error to user for handling
		this.doHandleSaveError(error, options);

		// Emit as event
		this._onDidSaveError.fire();
	}

	private doHandleSaveError(error: Error, options: IStoredFileWorkingCopySaveAsOptions): void {
		const fileOperationError = error as FileOperationError;
		const primaryActions: IAction[] = [];

		let message: string;

		// Dirty write prevention
		if (fileOperationError.fileOperationResult === FileOperationResult.FILE_MODIFIED_SINCE) {
			message = localize('staleSaveError', "Failed to save '{0}': The content of the file is newer. Do you want to overwrite the file with your changes?", this.name);

			primaryActions.push(toAction({ id: 'fileWorkingCopy.overwrite', label: localize('overwrite', "Overwrite"), run: () => this.save({ ...options, ignoreModifiedSince: true, reason: SaveReason.EXPLICIT }) }));
			primaryActions.push(toAction({ id: 'fileWorkingCopy.revert', label: localize('revert', "Revert"), run: () => this.revert() }));
		}

		// Any other save error
		else {
			const isWriteLocked = fileOperationError.fileOperationResult === FileOperationResult.FILE_WRITE_LOCKED;
			const triedToUnlock = isWriteLocked && (fileOperationError.options as IWriteFileOptions | undefined)?.unlock;
			const isPermissionDenied = fileOperationError.fileOperationResult === FileOperationResult.FILE_PERMISSION_DENIED;
			const canSaveElevated = this.elevatedFileService.isSupported(this.resource);

			// Error with Actions
			if (isErrorWithActions(error)) {
				primaryActions.push(...error.actions);
			}

			// Save Elevated
			if (canSaveElevated && (isPermissionDenied || triedToUnlock)) {
				primaryActions.push(toAction({
					id: 'fileWorkingCopy.saveElevated',
					label: triedToUnlock ?
						isWindows ? localize('overwriteElevated', "Overwrite as Admin...") : localize('overwriteElevatedSudo', "Overwrite as Sudo...") :
						isWindows ? localize('saveElevated', "Retry as Admin...") : localize('saveElevatedSudo', "Retry as Sudo..."),
					run: () => {
						this.save({ ...options, writeElevated: true, writeUnlock: triedToUnlock, reason: SaveReason.EXPLICIT });
					}
				}));
			}

			// Unlock
			else if (isWriteLocked) {
				primaryActions.push(toAction({ id: 'fileWorkingCopy.unlock', label: localize('overwrite', "Overwrite"), run: () => this.save({ ...options, writeUnlock: true, reason: SaveReason.EXPLICIT }) }));
			}

			// Retry
			else {
				primaryActions.push(toAction({ id: 'fileWorkingCopy.retry', label: localize('retry', "Retry"), run: () => this.save({ ...options, reason: SaveReason.EXPLICIT }) }));
			}

			// Save As
			primaryActions.push(toAction({
				id: 'fileWorkingCopy.saveAs',
				label: localize('saveAs', "Save As..."),
				run: async () => {
					const editor = this.workingCopyEditorService.findEditor(this);
					if (editor) {
						const result = await this.editorService.save(editor, { saveAs: true, reason: SaveReason.EXPLICIT });
						if (!result.success) {
							this.doHandleSaveError(error, options); // show error again given the operation failed
						}
					}
				}
			}));

			// Revert
			primaryActions.push(toAction({ id: 'fileWorkingCopy.revert', label: localize('revert', "Revert"), run: () => this.revert() }));

			// Message
			if (isWriteLocked) {
				if (triedToUnlock && canSaveElevated) {
					message = isWindows ?
						localize('readonlySaveErrorAdmin', "Failed to save '{0}': File is read-only. Select 'Overwrite as Admin' to retry as administrator.", this.name) :
						localize('readonlySaveErrorSudo', "Failed to save '{0}': File is read-only. Select 'Overwrite as Sudo' to retry as superuser.", this.name);
				} else {
					message = localize('readonlySaveError', "Failed to save '{0}': File is read-only. Select 'Overwrite' to attempt to make it writeable.", this.name);
				}
			} else if (canSaveElevated && isPermissionDenied) {
				message = isWindows ?
					localize('permissionDeniedSaveError', "Failed to save '{0}': Insufficient permissions. Select 'Retry as Admin' to retry as administrator.", this.name) :
					localize('permissionDeniedSaveErrorSudo', "Failed to save '{0}': Insufficient permissions. Select 'Retry as Sudo' to retry as superuser.", this.name);
			} else {
				message = localize({ key: 'genericSaveError', comment: ['{0} is the resource that failed to save and {1} the error message'] }, "Failed to save '{0}': {1}", this.name, toErrorMessage(error, false));
			}
		}

		// Show to the user as notification
		const handle = this.notificationService.notify({ id: `${hash(this.resource.toString())}`, severity: Severity.Error, message, actions: { primary: primaryActions } });

		// Remove automatically when we get saved/reverted
		const listener = this._register(Event.once(Event.any(this.onDidSave, this.onDidRevert))(() => handle.close()));
		this._register(Event.once(handle.onDidClose)(() => listener.dispose()));
	}

	private updateLastResolvedFileStat(newFileStat: IFileStatWithMetadata): void {
		const oldReadonly = this.isReadonly();

		// First resolve - just take
		if (!this.lastResolvedFileStat) {
			this.lastResolvedFileStat = newFileStat;
		}

		// Subsequent resolve - make sure that we only assign it if the mtime
		// is equal or has advanced.
		// This prevents race conditions from resolving and saving. If a save
		// comes in late after a revert was called, the mtime could be out of
		// sync.
		else if (this.lastResolvedFileStat.mtime <= newFileStat.mtime) {
			this.lastResolvedFileStat = newFileStat;
		}

		// In all other cases update only the readonly and locked flags
		else {
			this.lastResolvedFileStat = { ...this.lastResolvedFileStat, readonly: newFileStat.readonly, locked: newFileStat.locked };
		}

		// Signal that the readonly state changed
		if (this.isReadonly() !== oldReadonly) {
			this._onDidChangeReadonly.fire();
		}
	}

	//#endregion

	//#region Revert

	async revert(options?: IRevertOptions): Promise<void> {
		if (!this.isResolved() || (!this.dirty && !options?.force)) {
			return; // ignore if not resolved or not dirty and not enforced
		}

		this.trace('revert()');

		// Unset flags
		const wasDirty = this.dirty;
		const undoSetDirty = this.doSetDirty(false);

		// Force read from disk unless reverting soft
		const softUndo = options?.soft;
		if (!softUndo) {
			try {
				await this.forceResolveFromFile();
			} catch (error) {

				// FileNotFound means the file got deleted meanwhile, so ignore it
				if ((error as FileOperationError).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {

					// Set flags back to previous values, we are still dirty if revert failed
					undoSetDirty();

					throw error;
				}
			}
		}

		// Emit file change event
		this._onDidRevert.fire();

		// Emit dirty change event
		if (wasDirty) {
			this._onDidChangeDirty.fire();
		}
	}

	//#endregion

	//#region State

	private inConflictMode = false;
	private inErrorMode = false;

	hasState(state: StoredFileWorkingCopyState): boolean {
		switch (state) {
			case StoredFileWorkingCopyState.CONFLICT:
				return this.inConflictMode;
			case StoredFileWorkingCopyState.DIRTY:
				return this.dirty;
			case StoredFileWorkingCopyState.ERROR:
				return this.inErrorMode;
			case StoredFileWorkingCopyState.ORPHAN:
				return this.isOrphaned();
			case StoredFileWorkingCopyState.PENDING_SAVE:
				return this.saveSequentializer.isRunning();
			case StoredFileWorkingCopyState.SAVED:
				return !this.dirty;
		}
	}

	async joinState(state: StoredFileWorkingCopyState.PENDING_SAVE): Promise<void> {
		return this.saveSequentializer.running;
	}

	//#endregion

	//#region Utilities

	isReadonly(): boolean | IMarkdownString {
		return this.filesConfigurationService.isReadonly(this.resource, this.lastResolvedFileStat);
	}

	private trace(msg: string): void {
		this.logService.trace(`[stored file working copy] ${msg}`, this.resource.toString(), this.typeId);
	}

	//#endregion

	//#region Dispose

	override dispose(): void {
		this.trace('dispose()');

		// State
		this.inConflictMode = false;
		this.inErrorMode = false;

		// Free up model for GC
		this._model = undefined;

		super.dispose();
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/storedFileWorkingCopyManager.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/storedFileWorkingCopyManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { StoredFileWorkingCopy, StoredFileWorkingCopyState, IStoredFileWorkingCopy, IStoredFileWorkingCopyModel, IStoredFileWorkingCopyModelFactory, IStoredFileWorkingCopyResolveOptions, IStoredFileWorkingCopySaveEvent as IBaseStoredFileWorkingCopySaveEvent } from './storedFileWorkingCopy.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { Promises, ResourceQueue } from '../../../../base/common/async.js';
import { FileChangesEvent, FileChangeType, FileOperation, IFileService, IFileSystemProviderCapabilitiesChangeEvent, IFileSystemProviderRegistrationEvent } from '../../../../platform/files/common/files.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IWorkingCopyFileService, WorkingCopyFileEvent } from './workingCopyFileService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { BaseFileWorkingCopyManager, IBaseFileWorkingCopyManager } from './abstractFileWorkingCopyManager.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyEditorService } from './workingCopyEditorService.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { isWeb } from '../../../../base/common/platform.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { SnapshotContext } from './fileWorkingCopy.js';
import { IProgressService } from '../../../../platform/progress/common/progress.js';

/**
 * The only one that should be dealing with `IStoredFileWorkingCopy` and handle all
 * operations that are working copy related, such as save/revert, backup
 * and resolving.
 */
export interface IStoredFileWorkingCopyManager<M extends IStoredFileWorkingCopyModel> extends IBaseFileWorkingCopyManager<M, IStoredFileWorkingCopy<M>> {

	/**
	 * An event for when a stored file working copy was resolved.
	 */
	readonly onDidResolve: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy changed it's dirty state.
	 */
	readonly onDidChangeDirty: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy changed it's readonly state.
	 */
	readonly onDidChangeReadonly: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy changed it's orphaned state.
	 */
	readonly onDidChangeOrphaned: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy failed to save.
	 */
	readonly onDidSaveError: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy successfully saved.
	 */
	readonly onDidSave: Event<IStoredFileWorkingCopySaveEvent<M>>;

	/**
	 * An event for when a stored file working copy was reverted.
	 */
	readonly onDidRevert: Event<IStoredFileWorkingCopy<M>>;

	/**
	 * An event for when a stored file working copy is removed from the manager.
	 */
	readonly onDidRemove: Event<URI>;

	/**
	 * Allows to resolve a stored file working copy. If the manager already knows
	 * about a stored file working copy with the same `URI`, it will return that
	 * existing stored file working copy. There will never be more than one
	 * stored file working copy per `URI` until the stored file working copy is
	 * disposed.
	 *
	 * Use the `IStoredFileWorkingCopyResolveOptions.reload` option to control the
	 * behaviour for when a stored file working copy was previously already resolved
	 * with regards to resolving it again from the underlying file resource
	 * or not.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 *
	 * @param resource used as unique identifier of the stored file working copy in
	 * case one is already known for this `URI`.
	 * @param options
	 */
	resolve(resource: URI, options?: IStoredFileWorkingCopyManagerResolveOptions): Promise<IStoredFileWorkingCopy<M>>;

	/**
	 * Waits for the stored file working copy to be ready to be disposed. There may be
	 * conditions under which the stored file working copy cannot be disposed, e.g. when
	 * it is dirty. Once the promise is settled, it is safe to dispose.
	 */
	canDispose(workingCopy: IStoredFileWorkingCopy<M>): true | Promise<true>;
}

export interface IStoredFileWorkingCopySaveEvent<M extends IStoredFileWorkingCopyModel> extends IBaseStoredFileWorkingCopySaveEvent {

	/**
	 * The stored file working copy that was successfully saved.
	 */
	readonly workingCopy: IStoredFileWorkingCopy<M>;
}

export interface IStoredFileWorkingCopyManagerResolveOptions extends IStoredFileWorkingCopyResolveOptions {

	/**
	 * If the stored file working copy was already resolved before,
	 * allows to trigger a reload of it to fetch the latest contents.
	 */
	readonly reload?: {

		/**
		 * Controls whether the reload happens in the background
		 * or whether `resolve` will await the reload to happen.
		 */
		readonly async: boolean;

		/**
		 * Controls whether to force reading the contents from the
		 * underlying resource even if the resource did not change.
		 */
		readonly force?: boolean;
	};
}

export class StoredFileWorkingCopyManager<M extends IStoredFileWorkingCopyModel> extends BaseFileWorkingCopyManager<M, IStoredFileWorkingCopy<M>> implements IStoredFileWorkingCopyManager<M> {

	//#region Events

	private readonly _onDidResolve = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidResolve = this._onDidResolve.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeReadonly = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidChangeReadonly = this._onDidChangeReadonly.event;

	private readonly _onDidChangeOrphaned = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidChangeOrphaned = this._onDidChangeOrphaned.event;

	private readonly _onDidSaveError = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidSaveError = this._onDidSaveError.event;

	private readonly _onDidSave = this._register(new Emitter<IStoredFileWorkingCopySaveEvent<M>>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<IStoredFileWorkingCopy<M>>());
	readonly onDidRevert = this._onDidRevert.event;

	private readonly _onDidRemove = this._register(new Emitter<URI>());
	readonly onDidRemove = this._onDidRemove.event;

	//#endregion

	private readonly mapResourceToWorkingCopyListeners = new ResourceMap<IDisposable>();
	private readonly mapResourceToPendingWorkingCopyResolve = new ResourceMap<Promise<void>>();

	private readonly workingCopyResolveQueue = this._register(new ResourceQueue());

	constructor(
		private readonly workingCopyTypeId: string,
		private readonly modelFactory: IStoredFileWorkingCopyModelFactory<M>,
		@IFileService fileService: IFileService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ILabelService private readonly labelService: ILabelService,
		@ILogService logService: ILogService,
		@IWorkingCopyFileService private readonly workingCopyFileService: IWorkingCopyFileService,
		@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IFilesConfigurationService private readonly filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@INotificationService private readonly notificationService: INotificationService,
		@IWorkingCopyEditorService private readonly workingCopyEditorService: IWorkingCopyEditorService,
		@IEditorService private readonly editorService: IEditorService,
		@IElevatedFileService private readonly elevatedFileService: IElevatedFileService,
		@IProgressService private readonly progressService: IProgressService
	) {
		super(fileService, logService, workingCopyBackupService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Update working copies from file change events
		this._register(this.fileService.onDidFilesChange(e => this.onDidFilesChange(e)));

		// File system provider changes
		this._register(this.fileService.onDidChangeFileSystemProviderCapabilities(e => this.onDidChangeFileSystemProviderCapabilities(e)));
		this._register(this.fileService.onDidChangeFileSystemProviderRegistrations(e => this.onDidChangeFileSystemProviderRegistrations(e)));

		// Working copy operations
		this._register(this.workingCopyFileService.onWillRunWorkingCopyFileOperation(e => this.onWillRunWorkingCopyFileOperation(e)));
		this._register(this.workingCopyFileService.onDidFailWorkingCopyFileOperation(e => this.onDidFailWorkingCopyFileOperation(e)));
		this._register(this.workingCopyFileService.onDidRunWorkingCopyFileOperation(e => this.onDidRunWorkingCopyFileOperation(e)));

		// Lifecycle
		if (isWeb) {
			this._register(this.lifecycleService.onBeforeShutdown(event => event.veto(this.onBeforeShutdownWeb(), 'veto.fileWorkingCopyManager')));
		} else {
			this._register(this.lifecycleService.onWillShutdown(event => event.join(this.onWillShutdownDesktop(), { id: 'join.fileWorkingCopyManager', label: localize('join.fileWorkingCopyManager', "Saving working copies") })));
		}
	}

	private onBeforeShutdownWeb(): boolean {
		if (this.workingCopies.some(workingCopy => workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE))) {
			// stored file working copies are pending to be saved:
			// veto because web does not support long running shutdown
			return true;
		}

		return false;
	}

	private async onWillShutdownDesktop(): Promise<void> {
		let pendingSavedWorkingCopies: IStoredFileWorkingCopy<M>[];

		// As long as stored file working copies are pending to be saved, we prolong the shutdown
		// until that has happened to ensure we are not shutting down in the middle of
		// writing to the working copy (https://github.com/microsoft/vscode/issues/116600).
		while ((pendingSavedWorkingCopies = this.workingCopies.filter(workingCopy => workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE))).length > 0) {
			await Promises.settled(pendingSavedWorkingCopies.map(workingCopy => workingCopy.joinState(StoredFileWorkingCopyState.PENDING_SAVE)));
		}
	}

	//#region Resolve from file or file provider changes

	private onDidChangeFileSystemProviderCapabilities(e: IFileSystemProviderCapabilitiesChangeEvent): void {

		// Resolve working copies again for file systems that changed
		// capabilities to fetch latest metadata (e.g. readonly)
		// into all working copies.
		this.queueWorkingCopyReloads(e.scheme);
	}

	private onDidChangeFileSystemProviderRegistrations(e: IFileSystemProviderRegistrationEvent): void {
		if (!e.added) {
			return; // only if added
		}

		// Resolve working copies again for file systems that registered
		// to account for capability changes: extensions may unregister
		// and register the same provider with different capabilities,
		// so we want to ensure to fetch latest metadata (e.g. readonly)
		// into all working copies.
		this.queueWorkingCopyReloads(e.scheme);
	}

	private onDidFilesChange(e: FileChangesEvent): void {

		// Trigger a resolve for any update or add event that impacts
		// the working copy. We also consider the added event
		// because it could be that a file was added and updated
		// right after.
		this.queueWorkingCopyReloads(e);
	}

	private queueWorkingCopyReloads(scheme: string): void;
	private queueWorkingCopyReloads(e: FileChangesEvent): void;
	private queueWorkingCopyReloads(schemeOrEvent: string | FileChangesEvent): void {
		for (const workingCopy of this.workingCopies) {
			if (workingCopy.isDirty()) {
				continue; // never reload dirty working copies
			}

			let resolveWorkingCopy = false;
			if (typeof schemeOrEvent === 'string') {
				resolveWorkingCopy = schemeOrEvent === workingCopy.resource.scheme;
			} else {
				resolveWorkingCopy = schemeOrEvent.contains(workingCopy.resource, FileChangeType.UPDATED, FileChangeType.ADDED);
			}

			if (resolveWorkingCopy) {
				this.queueWorkingCopyReload(workingCopy);
			}
		}
	}

	private queueWorkingCopyReload(workingCopy: IStoredFileWorkingCopy<M>): void {

		// Resolves a working copy to update (use a queue to prevent accumulation of
		// resolve when the resolving actually takes long. At most we only want the
		// queue to have a size of 2 (1 running resolve and 1 queued resolve).
		const queueSize = this.workingCopyResolveQueue.queueSize(workingCopy.resource);
		if (queueSize <= 1) {
			this.workingCopyResolveQueue.queueFor(workingCopy.resource, async () => {
				try {
					await this.reload(workingCopy);
				} catch (error) {
					this.logService.error(error);
				}
			});
		}
	}

	//#endregion

	//#region Working Copy File Events

	private readonly mapCorrelationIdToWorkingCopiesToRestore = new Map<number, { source: URI; target: URI; snapshot?: VSBufferReadableStream }[]>();

	private onWillRunWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {

		// Move / Copy: remember working copies to restore after the operation
		if (e.operation === FileOperation.MOVE || e.operation === FileOperation.COPY) {
			e.waitUntil((async () => {
				const workingCopiesToRestore: { source: URI; target: URI; snapshot?: VSBufferReadableStream }[] = [];

				for (const { source, target } of e.files) {
					if (source) {
						if (this.uriIdentityService.extUri.isEqual(source, target)) {
							continue; // ignore if resources are considered equal
						}

						// Find all working copies that related to source (can be many if resource is a folder)
						const sourceWorkingCopies: IStoredFileWorkingCopy<M>[] = [];
						for (const workingCopy of this.workingCopies) {
							if (this.uriIdentityService.extUri.isEqualOrParent(workingCopy.resource, source)) {
								sourceWorkingCopies.push(workingCopy);
							}
						}

						// Remember each source working copy to load again after move is done
						// with optional content to restore if it was dirty
						for (const sourceWorkingCopy of sourceWorkingCopies) {
							const sourceResource = sourceWorkingCopy.resource;

							// If the source is the actual working copy, just use target as new resource
							let targetResource: URI;
							if (this.uriIdentityService.extUri.isEqual(sourceResource, source)) {
								targetResource = target;
							}

							// Otherwise a parent folder of the source is being moved, so we need
							// to compute the target resource based on that
							else {
								targetResource = joinPath(target, sourceResource.path.substr(source.path.length + 1));
							}

							workingCopiesToRestore.push({
								source: sourceResource,
								target: targetResource,
								snapshot: sourceWorkingCopy.isDirty() ? await sourceWorkingCopy.model?.snapshot(SnapshotContext.Save, CancellationToken.None) : undefined
							});
						}
					}
				}

				this.mapCorrelationIdToWorkingCopiesToRestore.set(e.correlationId, workingCopiesToRestore);
			})());
		}
	}

	private onDidFailWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {

		// Move / Copy: restore dirty flag on working copies to restore that were dirty
		if ((e.operation === FileOperation.MOVE || e.operation === FileOperation.COPY)) {
			const workingCopiesToRestore = this.mapCorrelationIdToWorkingCopiesToRestore.get(e.correlationId);
			if (workingCopiesToRestore) {
				this.mapCorrelationIdToWorkingCopiesToRestore.delete(e.correlationId);

				for (const workingCopy of workingCopiesToRestore) {

					// Snapshot presence means this working copy used to be modified and so we restore that
					// flag. we do NOT have to restore the content because the working copy was only soft
					// reverted and did not loose its original modified contents.

					if (workingCopy.snapshot) {
						this.get(workingCopy.source)?.markModified();
					}
				}
			}
		}
	}

	private onDidRunWorkingCopyFileOperation(e: WorkingCopyFileEvent): void {
		switch (e.operation) {

			// Create: Revert existing working copies
			case FileOperation.CREATE:
				e.waitUntil((async () => {
					for (const { target } of e.files) {
						const workingCopy = this.get(target);
						if (workingCopy && !workingCopy.isDisposed()) {
							await workingCopy.revert();
						}
					}
				})());
				break;

			// Move/Copy: restore working copies that were loaded before the operation took place
			case FileOperation.MOVE:
			case FileOperation.COPY:
				e.waitUntil((async () => {
					const workingCopiesToRestore = this.mapCorrelationIdToWorkingCopiesToRestore.get(e.correlationId);
					if (workingCopiesToRestore) {
						this.mapCorrelationIdToWorkingCopiesToRestore.delete(e.correlationId);

						await Promises.settled(workingCopiesToRestore.map(async workingCopyToRestore => {

							// From this moment on, only operate on the canonical resource
							// to fix a potential data loss issue:
							// https://github.com/microsoft/vscode/issues/211374
							const target = this.uriIdentityService.asCanonicalUri(workingCopyToRestore.target);

							// Restore the working copy at the target. if we have previous dirty content, we pass it
							// over to be used, otherwise we force a reload from disk. this is important
							// because we know the file has changed on disk after the move and the working copy might
							// have still existed with the previous state. this ensures that the working copy is not
							// tracking a stale state.
							await this.resolve(target, {
								reload: { async: false }, // enforce a reload
								contents: workingCopyToRestore.snapshot
							});
						}));
					}
				})());
				break;
		}
	}

	//#endregion

	//#region Reload & Resolve

	private async reload(workingCopy: IStoredFileWorkingCopy<M>): Promise<void> {

		// Await a pending working copy resolve first before proceeding
		// to ensure that we never resolve a working copy more than once
		// in parallel.
		await this.joinPendingResolves(workingCopy.resource);

		if (workingCopy.isDirty() || workingCopy.isDisposed() || !this.has(workingCopy.resource)) {
			return; // the working copy possibly got dirty or disposed, so return early then
		}

		// Trigger reload
		await this.doResolve(workingCopy, { reload: { async: false } });
	}

	async resolve(resource: URI, options?: IStoredFileWorkingCopyManagerResolveOptions): Promise<IStoredFileWorkingCopy<M>> {

		// Await a pending working copy resolve first before proceeding
		// to ensure that we never resolve a working copy more than once
		// in parallel.
		const pendingResolve = this.joinPendingResolves(resource);
		if (pendingResolve) {
			await pendingResolve;
		}

		// Trigger resolve
		return this.doResolve(resource, options);
	}

	private async doResolve(resourceOrWorkingCopy: URI | IStoredFileWorkingCopy<M>, options?: IStoredFileWorkingCopyManagerResolveOptions): Promise<IStoredFileWorkingCopy<M>> {
		let workingCopy: IStoredFileWorkingCopy<M> | undefined;
		let resource: URI;
		if (URI.isUri(resourceOrWorkingCopy)) {
			resource = resourceOrWorkingCopy;
			workingCopy = this.get(resource);
		} else {
			resource = resourceOrWorkingCopy.resource;
			workingCopy = resourceOrWorkingCopy;
		}

		let workingCopyResolve: Promise<void>;
		let didCreateWorkingCopy = false;

		const resolveOptions: IStoredFileWorkingCopyResolveOptions = {
			contents: options?.contents,
			forceReadFromFile: options?.reload?.force,
			limits: options?.limits
		};

		// Working copy exists
		if (workingCopy) {

			// Always reload if contents are provided
			if (options?.contents) {
				workingCopyResolve = workingCopy.resolve(resolveOptions);
			}

			// Reload async or sync based on options
			else if (options?.reload) {

				// Async reload: trigger a reload but return immediately
				if (options.reload.async) {
					workingCopyResolve = Promise.resolve();
					(async () => {
						try {
							await workingCopy.resolve(resolveOptions);
						} catch (error) {
							if (!workingCopy.isDisposed()) {
								onUnexpectedError(error); // only log if the working copy is still around
							}
						}
					})();
				}

				// Sync reload: do not return until working copy reloaded
				else {
					workingCopyResolve = workingCopy.resolve(resolveOptions);
				}
			}

			// Do not reload
			else {
				workingCopyResolve = Promise.resolve();
			}
		}

		// Stored file working copy does not exist
		else {
			didCreateWorkingCopy = true;

			workingCopy = new StoredFileWorkingCopy(
				this.workingCopyTypeId,
				resource,
				this.labelService.getUriBasenameLabel(resource),
				this.modelFactory,
				async options => { await this.resolve(resource, { ...options, reload: { async: false } }); },
				this.fileService, this.logService, this.workingCopyFileService, this.filesConfigurationService,
				this.workingCopyBackupService, this.workingCopyService, this.notificationService, this.workingCopyEditorService,
				this.editorService, this.elevatedFileService, this.progressService
			);

			workingCopyResolve = workingCopy.resolve(resolveOptions);

			this.registerWorkingCopy(workingCopy);
		}

		// Store pending resolve to avoid race conditions
		this.mapResourceToPendingWorkingCopyResolve.set(resource, workingCopyResolve);

		// Make known to manager (if not already known)
		this.add(resource, workingCopy);

		// Emit some events if we created the working copy
		if (didCreateWorkingCopy) {

			// If the working copy is dirty right from the beginning,
			// make sure to emit this as an event
			if (workingCopy.isDirty()) {
				this._onDidChangeDirty.fire(workingCopy);
			}
		}

		try {
			await workingCopyResolve;
		} catch (error) {

			// Automatically dispose the working copy if we created
			// it because we cannot dispose a working copy we do not
			// own (https://github.com/microsoft/vscode/issues/138850)
			if (didCreateWorkingCopy) {
				workingCopy.dispose();
			}

			throw error;
		} finally {

			// Remove from pending resolves
			this.mapResourceToPendingWorkingCopyResolve.delete(resource);
		}

		// Stored file working copy can be dirty if a backup was restored, so we make sure to
		// have this event delivered if we created the working copy here
		if (didCreateWorkingCopy && workingCopy.isDirty()) {
			this._onDidChangeDirty.fire(workingCopy);
		}

		return workingCopy;
	}

	private joinPendingResolves(resource: URI): Promise<void> | undefined {
		const pendingWorkingCopyResolve = this.mapResourceToPendingWorkingCopyResolve.get(resource);
		if (!pendingWorkingCopyResolve) {
			return;
		}

		return this.doJoinPendingResolves(resource);
	}

	private async doJoinPendingResolves(resource: URI): Promise<void> {

		// While we have pending working copy resolves, ensure
		// to await the last one finishing before returning.
		// This prevents a race when multiple clients await
		// the pending resolve and then all trigger the resolve
		// at the same time.
		let currentWorkingCopyResolve: Promise<void> | undefined;
		while (this.mapResourceToPendingWorkingCopyResolve.has(resource)) {
			const nextPendingWorkingCopyResolve = this.mapResourceToPendingWorkingCopyResolve.get(resource);
			if (nextPendingWorkingCopyResolve === currentWorkingCopyResolve) {
				return; // already awaited on - return
			}

			currentWorkingCopyResolve = nextPendingWorkingCopyResolve;
			try {
				await nextPendingWorkingCopyResolve;
			} catch (error) {
				// ignore any error here, it will bubble to the original requestor
			}
		}
	}

	private registerWorkingCopy(workingCopy: IStoredFileWorkingCopy<M>): void {

		// Install working copy listeners
		const workingCopyListeners = new DisposableStore();
		workingCopyListeners.add(workingCopy.onDidResolve(() => this._onDidResolve.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onDidChangeDirty(() => this._onDidChangeDirty.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onDidChangeReadonly(() => this._onDidChangeReadonly.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onDidChangeOrphaned(() => this._onDidChangeOrphaned.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onDidSaveError(() => this._onDidSaveError.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onDidSave(e => this._onDidSave.fire({ workingCopy, ...e })));
		workingCopyListeners.add(workingCopy.onDidRevert(() => this._onDidRevert.fire(workingCopy)));

		// Keep for disposal
		this.mapResourceToWorkingCopyListeners.set(workingCopy.resource, workingCopyListeners);
	}

	protected override remove(resource: URI): boolean {
		const removed = super.remove(resource);

		// Dispose any existing working copy listeners
		const workingCopyListener = this.mapResourceToWorkingCopyListeners.get(resource);
		if (workingCopyListener) {
			dispose(workingCopyListener);
			this.mapResourceToWorkingCopyListeners.delete(resource);
		}

		if (removed) {
			this._onDidRemove.fire(resource);
		}

		return removed;
	}

	//#endregion

	//#region Lifecycle

	canDispose(workingCopy: IStoredFileWorkingCopy<M>): true | Promise<true> {

		// Quick return if working copy already disposed or not dirty and not resolving
		if (
			workingCopy.isDisposed() ||
			(!this.mapResourceToPendingWorkingCopyResolve.has(workingCopy.resource) && !workingCopy.isDirty())
		) {
			return true;
		}

		// Promise based return in all other cases
		return this.doCanDispose(workingCopy);
	}

	private async doCanDispose(workingCopy: IStoredFileWorkingCopy<M>): Promise<true> {

		// Await any pending resolves first before proceeding
		const pendingResolve = this.joinPendingResolves(workingCopy.resource);
		if (pendingResolve) {
			await pendingResolve;

			return this.canDispose(workingCopy);
		}

		// Dirty working copy: we do not allow to dispose dirty working copys
		// to prevent data loss cases. dirty working copys can only be disposed when
		// they are either saved or reverted
		if (workingCopy.isDirty()) {
			await Event.toPromise(workingCopy.onDidChangeDirty);

			return this.canDispose(workingCopy);
		}

		return true;
	}

	override dispose(): void {
		super.dispose();

		// Clear pending working copy resolves
		this.mapResourceToPendingWorkingCopyResolve.clear();

		// Dispose the working copy change listeners
		dispose(this.mapResourceToWorkingCopyListeners.values());
		this.mapResourceToWorkingCopyListeners.clear();
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/storedFileWorkingCopySaveParticipant.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/storedFileWorkingCopySaveParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IDisposable, Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IStoredFileWorkingCopySaveParticipant, IStoredFileWorkingCopySaveParticipantContext } from './workingCopyFileService.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel } from './storedFileWorkingCopy.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { CancellationError, isCancellationError } from '../../../../base/common/errors.js';
import { NotificationPriority } from '../../../../platform/notification/common/notification.js';
import { localize } from '../../../../nls.js';

export class StoredFileWorkingCopySaveParticipant extends Disposable {

	private readonly saveParticipants = new LinkedList<IStoredFileWorkingCopySaveParticipant>();

	get length(): number { return this.saveParticipants.size; }

	constructor(
		@ILogService private readonly logService: ILogService,
		@IProgressService private readonly progressService: IProgressService,
	) {
		super();
	}

	addSaveParticipant(participant: IStoredFileWorkingCopySaveParticipant): IDisposable {
		const remove = this.saveParticipants.push(participant);

		return toDisposable(() => remove());
	}

	async participate(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		const cts = new CancellationTokenSource(token);

		// undoStop before participation
		workingCopy.model?.pushStackElement();

		// report to the "outer" progress
		progress.report({
			message: localize('saveParticipants1', "Running Code Actions and Formatters...")
		});

		let bubbleCancel = false;

		// create an "inner" progress to allow to skip over long running save participants
		await this.progressService.withProgress({
			priority: NotificationPriority.URGENT,
			location: ProgressLocation.Notification,
			cancellable: localize('skip', "Skip"),
			delay: workingCopy.isDirty() ? 5000 : 3000
		}, async progress => {

			const participants = Array.from(this.saveParticipants).sort((a, b) => {
				const aValue = a.ordinal ?? 0;
				const bValue = b.ordinal ?? 0;
				return aValue - bValue;
			});

			for (const saveParticipant of participants) {
				if (cts.token.isCancellationRequested || workingCopy.isDisposed()) {
					break;
				}

				try {
					const promise = saveParticipant.participate(workingCopy, context, progress, cts.token);
					await raceCancellation(promise, cts.token);
				} catch (err) {
					if (!isCancellationError(err)) {
						this.logService.error(err);
					} else if (!cts.token.isCancellationRequested) {
						// we see a cancellation error BUT the token didn't signal it
						// this means the participant wants the save operation to be cancelled
						cts.cancel();
						bubbleCancel = true;
					}
				}
			}
		}, () => {
			cts.cancel();
		});

		// undoStop after participation
		workingCopy.model?.pushStackElement();

		cts.dispose();

		if (bubbleCancel) {
			throw new CancellationError();
		}
	}

	override dispose(): void {
		this.saveParticipants.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/untitledFileWorkingCopy.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/untitledFileWorkingCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event, Emitter } from '../../../../base/common/event.js';
import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { IWorkingCopyBackup, IWorkingCopySaveEvent, WorkingCopyCapabilities } from './workingCopy.js';
import { IFileWorkingCopy, IFileWorkingCopyModel, IFileWorkingCopyModelFactory, SnapshotContext } from './fileWorkingCopy.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ISaveOptions } from '../../../common/editor.js';
import { raceCancellation } from '../../../../base/common/async.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { emptyStream } from '../../../../base/common/stream.js';

/**
 * Untitled file specific working copy model factory.
 */
export interface IUntitledFileWorkingCopyModelFactory<M extends IUntitledFileWorkingCopyModel> extends IFileWorkingCopyModelFactory<M> { }

/**
 * The underlying model of a untitled file working copy provides
 * some methods for the untitled file working copy to function.
 * The model is typically only available after the working copy
 * has been resolved via it's `resolve()` method.
 */
export interface IUntitledFileWorkingCopyModel extends IFileWorkingCopyModel {

	readonly onDidChangeContent: Event<IUntitledFileWorkingCopyModelContentChangedEvent>;
}

export interface IUntitledFileWorkingCopyModelContentChangedEvent {

	/**
	 * Flag that indicates that the content change should
	 * clear the dirty/modified flags, e.g. because the contents are
	 * back to being empty or back to an initial state that
	 * should not be considered as modified.
	 */
	readonly isInitial: boolean;
}

export interface IUntitledFileWorkingCopy<M extends IUntitledFileWorkingCopyModel> extends IFileWorkingCopy<M> {

	/**
	 * Whether this untitled file working copy model has an associated file path.
	 */
	readonly hasAssociatedFilePath: boolean;

	/**
	 * Whether we have a resolved model or not.
	 */
	isResolved(): this is IResolvedUntitledFileWorkingCopy<M>;
}

export interface IResolvedUntitledFileWorkingCopy<M extends IUntitledFileWorkingCopyModel> extends IUntitledFileWorkingCopy<M> {

	/**
	 * A resolved untitled file working copy has a resolved model.
	 */
	readonly model: M;
}

export interface IUntitledFileWorkingCopySaveDelegate<M extends IUntitledFileWorkingCopyModel> {

	/**
	 * A delegate to enable saving of untitled file working copies.
	 */
	(workingCopy: IUntitledFileWorkingCopy<M>, options?: ISaveOptions): Promise<boolean>;
}

export interface IUntitledFileWorkingCopyInitialContents {

	/**
	 * The initial contents of the untitled file working copy.
	 */
	readonly value: VSBufferReadableStream;

	/**
	 * If not provided, the untitled file working copy will be marked
	 * modified by default given initial contents are provided.
	 *
	 * Note: if the untitled file working copy has an associated path
	 * the modified state will always be set.
	 */
	readonly markModified?: boolean;
}

export class UntitledFileWorkingCopy<M extends IUntitledFileWorkingCopyModel> extends Disposable implements IUntitledFileWorkingCopy<M> {

	readonly capabilities: WorkingCopyCapabilities;

	private _model: M | undefined = undefined;
	get model(): M | undefined { return this._model; }

	//#region Events

	private readonly _onDidChangeContent = this._register(new Emitter<void>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<void>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidRevert = this._register(new Emitter<void>());
	readonly onDidRevert = this._onDidRevert.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	//#endregion

	constructor(
		readonly typeId: string,
		readonly resource: URI,
		readonly name: string,
		readonly hasAssociatedFilePath: boolean,
		private readonly isScratchpad: boolean,
		private readonly initialContents: IUntitledFileWorkingCopyInitialContents | undefined,
		private readonly modelFactory: IUntitledFileWorkingCopyModelFactory<M>,
		private readonly saveDelegate: IUntitledFileWorkingCopySaveDelegate<M>,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@IWorkingCopyBackupService private readonly workingCopyBackupService: IWorkingCopyBackupService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.capabilities = this.isScratchpad ? WorkingCopyCapabilities.Untitled | WorkingCopyCapabilities.Scratchpad : WorkingCopyCapabilities.Untitled;
		this.modified = this.hasAssociatedFilePath || Boolean(this.initialContents && this.initialContents.markModified !== false);

		// Make known to working copy service
		this._register(workingCopyService.registerWorkingCopy(this));
	}

	//#region Dirty/Modified

	private modified: boolean;

	isDirty(): boolean {
		return this.modified && !this.isScratchpad; // Scratchpad working copies are never dirty
	}

	isModified(): boolean {
		return this.modified;
	}

	private setModified(modified: boolean): void {
		if (this.modified === modified) {
			return;
		}

		this.modified = modified;
		if (!this.isScratchpad) {
			this._onDidChangeDirty.fire();
		}
	}

	//#endregion


	//#region Resolve

	async resolve(): Promise<void> {
		this.trace('resolve()');

		if (this.isResolved()) {
			this.trace('resolve() - exit (already resolved)');

			// return early if the untitled file working copy is already
			// resolved assuming that the contents have meanwhile changed
			// in the underlying model. we only resolve untitled once.
			return;
		}

		let untitledContents: VSBufferReadableStream;

		// Check for backups or use initial value or empty
		const backup = await this.workingCopyBackupService.resolve(this);
		if (backup) {
			this.trace('resolve() - with backup');

			untitledContents = backup.value;
		} else if (this.initialContents?.value) {
			this.trace('resolve() - with initial contents');

			untitledContents = this.initialContents.value;
		} else {
			this.trace('resolve() - empty');

			untitledContents = emptyStream();
		}

		// Create model
		await this.doCreateModel(untitledContents);

		// Untitled associated to file path are modified right away as well as untitled with content
		this.setModified(this.hasAssociatedFilePath || !!backup || Boolean(this.initialContents && this.initialContents.markModified !== false));

		// If we have initial contents, make sure to emit this
		// as the appropriate events to the outside.
		if (!!backup || this.initialContents) {
			this._onDidChangeContent.fire();
		}
	}

	private async doCreateModel(contents: VSBufferReadableStream): Promise<void> {
		this.trace('doCreateModel()');

		// Create model and dispose it when we get disposed
		this._model = this._register(await this.modelFactory.createModel(this.resource, contents, CancellationToken.None));

		// Model listeners
		this.installModelListeners(this._model);
	}

	private installModelListeners(model: M): void {

		// Content Change
		this._register(model.onDidChangeContent(e => this.onModelContentChanged(e)));

		// Lifecycle
		this._register(model.onWillDispose(() => this.dispose()));
	}

	private onModelContentChanged(e: IUntitledFileWorkingCopyModelContentChangedEvent): void {

		// Mark the untitled file working copy as non-modified once its
		// in case provided by the change event and in case we do not
		// have an associated path set
		if (!this.hasAssociatedFilePath && e.isInitial) {
			this.setModified(false);
		}

		// Turn modified otherwise
		else {
			this.setModified(true);
		}

		// Emit as general content change event
		this._onDidChangeContent.fire();
	}

	isResolved(): this is IResolvedUntitledFileWorkingCopy<M> {
		return !!this.model;
	}

	//#endregion


	//#region Backup

	get backupDelay(): number | undefined {
		return this.model?.configuration?.backupDelay;
	}

	async backup(token: CancellationToken): Promise<IWorkingCopyBackup> {
		let content: VSBufferReadableStream | undefined = undefined;

		// Make sure to check whether this working copy has been
		// resolved or not and fallback to the initial value -
		// if any - to prevent backing up an unresolved working
		// copy and loosing the initial value.
		if (this.isResolved()) {
			content = await raceCancellation(this.model.snapshot(SnapshotContext.Backup, token), token);
		} else if (this.initialContents) {
			content = this.initialContents.value;
		}

		return { content };
	}

	//#endregion


	//#region Save

	async save(options?: ISaveOptions): Promise<boolean> {
		this.trace('save()');

		const result = await this.saveDelegate(this, options);

		// Emit Save Event
		if (result) {
			this._onDidSave.fire({ reason: options?.reason, source: options?.source });
		}

		return result;
	}

	//#endregion


	//#region Revert

	async revert(): Promise<void> {
		this.trace('revert()');

		// No longer modified
		this.setModified(false);

		// Emit as event
		this._onDidRevert.fire();

		// A reverted untitled file working copy is invalid
		// because it has no actual source on disk to revert to.
		// As such we dispose the model.
		this.dispose();
	}

	//#endregion

	override dispose(): void {
		this.trace('dispose()');

		this._onWillDispose.fire();

		super.dispose();
	}

	private trace(msg: string): void {
		this.logService.trace(`[untitled file working copy] ${msg}`, this.resource.toString(), this.typeId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/untitledFileWorkingCopyManager.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/untitledFileWorkingCopyManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IUntitledFileWorkingCopy, IUntitledFileWorkingCopyInitialContents, IUntitledFileWorkingCopyModel, IUntitledFileWorkingCopyModelFactory, IUntitledFileWorkingCopySaveDelegate, UntitledFileWorkingCopy } from './untitledFileWorkingCopy.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Schemas } from '../../../../base/common/network.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { BaseFileWorkingCopyManager, IBaseFileWorkingCopyManager } from './abstractFileWorkingCopyManager.js';
import { ResourceMap } from '../../../../base/common/map.js';

export interface IUntitledFileWorkingCopySaveEvent {

	/**
	 * The source untitled file working copy that was saved. It is disposed at this point.
	 */
	readonly source: URI;

	/**
	 * The target file working copy the untitled was saved to. Is never untitled.
	 */
	readonly target: URI;
}

/**
 * The only one that should be dealing with `IUntitledFileWorkingCopy` and
 * handle all operations that are working copy related, such as save/revert,
 * backup and resolving.
 */
export interface IUntitledFileWorkingCopyManager<M extends IUntitledFileWorkingCopyModel> extends IBaseFileWorkingCopyManager<M, IUntitledFileWorkingCopy<M>> {

	/**
	 * An event for when an untitled file working copy was saved.
	 * At the point the event fires, the untitled file working copy is
	 * disposed.
	 */
	readonly onDidSave: Event<IUntitledFileWorkingCopySaveEvent>;

	/**
	 * An event for when a untitled file working copy changed it's dirty state.
	 */
	readonly onDidChangeDirty: Event<IUntitledFileWorkingCopy<M>>;

	/**
	 * An event for when a untitled file working copy is about to be disposed.
	 */
	readonly onWillDispose: Event<IUntitledFileWorkingCopy<M>>;

	/**
	 * Create a new untitled file working copy with optional initial contents.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<M>>;

	/**
	 * Create a new untitled file working copy with optional initial contents
	 * and associated resource. The associated resource will be used when
	 * saving and will not require to ask the user for a file path.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewUntitledFileWorkingCopyWithAssociatedResourceOptions): Promise<IUntitledFileWorkingCopy<M>>;

	/**
	 * Creates a new untitled file working copy with optional initial contents
	 * with the provided resource or return an existing untitled file working
	 * copy otherwise.
	 *
	 * Note: Callers must `dispose` the working copy when no longer needed.
	 */
	resolve(options?: INewOrExistingUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<M>>;

	/**
	 * Internal method: triggers the onDidSave event.
	 */
	notifyDidSave(source: URI, target: URI): void;
}

export interface INewUntitledFileWorkingCopyOptions {

	/**
	 * Initial value of the untitled file working copy
	 * with support to indicate whether this should turn
	 * the working copy dirty or not.
	 */
	contents?: IUntitledFileWorkingCopyInitialContents;
}

export interface INewUntitledFileWorkingCopyWithAssociatedResourceOptions extends INewUntitledFileWorkingCopyOptions {

	/**
	 * Resource components to associate with the untitled file working copy.
	 * When saving, the associated components will be used and the user
	 * is not being asked to provide a file path.
	 *
	 * Note: currently it is not possible to specify the `scheme` to use. The
	 * untitled file working copy will saved to the default local or remote resource.
	 */
	associatedResource: { authority?: string; path?: string; query?: string; fragment?: string };
}

export interface INewOrExistingUntitledFileWorkingCopyOptions extends INewUntitledFileWorkingCopyOptions {

	/**
	 * A resource to identify the untitled file working copy
	 * to create or return if already existing.
	 *
	 * Note: the resource will not be used unless the scheme is `untitled`.
	 */
	untitledResource: URI;

	/**
	 * A flag that will prevent the working copy from appearing dirty in the UI
	 * and not show a confirmation dialog when closed with unsaved content.
	 */
	isScratchpad?: boolean;
}

type IInternalUntitledFileWorkingCopyOptions = INewUntitledFileWorkingCopyOptions & INewUntitledFileWorkingCopyWithAssociatedResourceOptions & INewOrExistingUntitledFileWorkingCopyOptions;

export class UntitledFileWorkingCopyManager<M extends IUntitledFileWorkingCopyModel> extends BaseFileWorkingCopyManager<M, IUntitledFileWorkingCopy<M>> implements IUntitledFileWorkingCopyManager<M> {

	//#region Events

	private readonly _onDidSave = this._register(new Emitter<IUntitledFileWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<IUntitledFileWorkingCopy<M>>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onWillDispose = this._register(new Emitter<IUntitledFileWorkingCopy<M>>());
	readonly onWillDispose = this._onWillDispose.event;

	//#endregion

	private readonly mapResourceToWorkingCopyListeners = new ResourceMap<IDisposable>();

	constructor(
		private readonly workingCopyTypeId: string,
		private readonly modelFactory: IUntitledFileWorkingCopyModelFactory<M>,
		private readonly saveDelegate: IUntitledFileWorkingCopySaveDelegate<M>,
		@IFileService fileService: IFileService,
		@ILabelService private readonly labelService: ILabelService,
		@ILogService logService: ILogService,
		@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService
	) {
		super(fileService, logService, workingCopyBackupService);
	}

	//#region Resolve

	resolve(options?: INewUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<M>>;
	resolve(options?: INewUntitledFileWorkingCopyWithAssociatedResourceOptions): Promise<IUntitledFileWorkingCopy<M>>;
	resolve(options?: INewOrExistingUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<M>>;
	async resolve(options?: IInternalUntitledFileWorkingCopyOptions): Promise<IUntitledFileWorkingCopy<M>> {
		const workingCopy = this.doCreateOrGet(options);
		await workingCopy.resolve();

		return workingCopy;
	}

	private doCreateOrGet(options: IInternalUntitledFileWorkingCopyOptions = Object.create(null)): IUntitledFileWorkingCopy<M> {
		const massagedOptions = this.massageOptions(options);

		// Return existing instance if asked for it
		if (massagedOptions.untitledResource) {
			const existingWorkingCopy = this.get(massagedOptions.untitledResource);
			if (existingWorkingCopy) {
				return existingWorkingCopy;
			}
		}

		// Create new instance otherwise
		return this.doCreate(massagedOptions);
	}

	private massageOptions(options: IInternalUntitledFileWorkingCopyOptions): IInternalUntitledFileWorkingCopyOptions {
		const massagedOptions: IInternalUntitledFileWorkingCopyOptions = Object.create(null);

		// Handle associated resource
		if (options.associatedResource) {
			massagedOptions.untitledResource = URI.from({
				scheme: Schemas.untitled,
				authority: options.associatedResource.authority,
				fragment: options.associatedResource.fragment,
				path: options.associatedResource.path,
				query: options.associatedResource.query
			});
			massagedOptions.associatedResource = options.associatedResource;
		}

		// Handle untitled resource
		else {
			if (options.untitledResource?.scheme === Schemas.untitled) {
				massagedOptions.untitledResource = options.untitledResource;
			}
			massagedOptions.isScratchpad = options.isScratchpad;
		}

		// Take over initial value
		massagedOptions.contents = options.contents;

		return massagedOptions;
	}

	private doCreate(options: IInternalUntitledFileWorkingCopyOptions): IUntitledFileWorkingCopy<M> {

		// Create a new untitled resource if none is provided
		let untitledResource = options.untitledResource;
		if (!untitledResource) {
			let counter = 1;
			do {
				untitledResource = URI.from({
					scheme: Schemas.untitled,
					path: options.isScratchpad ? `Scratchpad-${counter}` : `Untitled-${counter}`,
					query: this.workingCopyTypeId ?
						`typeId=${this.workingCopyTypeId}` : // distinguish untitled resources among others by encoding the `typeId` as query param
						undefined							 // keep untitled resources for text files as they are (when `typeId === ''`)
				});
				counter++;
			} while (this.has(untitledResource));
		}

		// Create new working copy with provided options
		const workingCopy = new UntitledFileWorkingCopy(
			this.workingCopyTypeId,
			untitledResource,
			this.labelService.getUriBasenameLabel(untitledResource),
			!!options.associatedResource,
			!!options.isScratchpad,
			options.contents,
			this.modelFactory,
			this.saveDelegate,
			this.workingCopyService,
			this.workingCopyBackupService,
			this.logService
		);

		// Register
		this.registerWorkingCopy(workingCopy);

		return workingCopy;
	}

	private registerWorkingCopy(workingCopy: IUntitledFileWorkingCopy<M>): void {

		// Install working copy listeners
		const workingCopyListeners = new DisposableStore();
		workingCopyListeners.add(workingCopy.onDidChangeDirty(() => this._onDidChangeDirty.fire(workingCopy)));
		workingCopyListeners.add(workingCopy.onWillDispose(() => this._onWillDispose.fire(workingCopy)));

		// Keep for disposal
		this.mapResourceToWorkingCopyListeners.set(workingCopy.resource, workingCopyListeners);

		// Add to cache
		this.add(workingCopy.resource, workingCopy);

		// If the working copy is dirty right from the beginning,
		// make sure to emit this as an event
		if (workingCopy.isDirty()) {
			this._onDidChangeDirty.fire(workingCopy);
		}
	}

	protected override remove(resource: URI): boolean {
		const removed = super.remove(resource);

		// Dispose any existing working copy listeners
		const workingCopyListener = this.mapResourceToWorkingCopyListeners.get(resource);
		if (workingCopyListener) {
			dispose(workingCopyListener);
			this.mapResourceToWorkingCopyListeners.delete(resource);
		}

		return removed;
	}

	//#endregion

	//#region Lifecycle

	override dispose(): void {
		super.dispose();

		// Dispose the working copy change listeners
		dispose(this.mapResourceToWorkingCopyListeners.values());
		this.mapResourceToWorkingCopyListeners.clear();
	}

	//#endregion

	notifyDidSave(source: URI, target: URI): void {
		this._onDidSave.fire({ source, target });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopy.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { ISaveOptions, IRevertOptions, SaveReason, SaveSource } from '../../../common/editor.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';

export const enum WorkingCopyCapabilities {

	/**
	 * Signals no specific capability for the working copy.
	 */
	None = 0,

	/**
	 * Signals that the working copy requires
	 * additional input when saving, e.g. an
	 * associated path to save to.
	 */
	Untitled = 1 << 1,

	/**
	 * The working copy will not indicate that
	 * it is dirty and unsaved content will be
	 * discarded without prompting if closed.
	 */
	Scratchpad = 1 << 2
}

/**
 * Data to be associated with working copy backups. Use
 * `IWorkingCopyBackupService.resolve(workingCopy)` to
 * retrieve the backup when loading the working copy.
 */
export interface IWorkingCopyBackup {

	/**
	 * Any serializable metadata to be associated with the backup.
	 */
	meta?: IWorkingCopyBackupMeta;

	/**
	 * The actual snapshot of the contents of the working copy at
	 * the time the backup was made.
	 */
	content?: VSBufferReadable | VSBufferReadableStream;
}

/**
 * Working copy backup metadata that can be associated
 * with the backup.
 *
 * Some properties may be reserved as outlined here and
 * cannot be used.
 */
export interface IWorkingCopyBackupMeta {

	/**
	 * Any property needs to be serializable through JSON.
	 */
	[key: string]: unknown;

	/**
	 * `typeId` is a reserved property that cannot be used
	 * as backup metadata.
	 */
	typeId?: never;
}

/**
 * @deprecated it is important to provide a type identifier
 * for working copies to enable all capabilities.
 */
export const NO_TYPE_ID = '';

/**
 * Every working copy has in common that it is identified by
 * a resource `URI` and a `typeId`. There can only be one
 * working copy registered with the same `URI` and `typeId`.
 */
export interface IWorkingCopyIdentifier {

	/**
	 * The type identifier of the working copy for grouping
	 * working copies of the same domain together.
	 *
	 * There can only be one working copy for a given resource
	 * and type identifier.
	 */
	readonly typeId: string;

	/**
	 * The resource of the working copy must be unique for
	 * working copies of the same `typeId`.
	 */
	readonly resource: URI;
}

export interface IWorkingCopySaveEvent {

	/**
	 * The reason why the working copy was saved.
	 */
	readonly reason?: SaveReason;

	/**
	 * The source of the working copy save request.
	 */
	readonly source?: SaveSource;
}

/**
 * A working copy is an abstract concept to unify handling of
 * data that can be worked on (e.g. edited) in an editor.
 *
 *
 * A working copy resource may be the backing store of the data
 * (e.g. a file on disk), but that is not a requirement. If
 * your working copy is file based, consider to use the
 * `IFileWorkingCopy` instead that simplifies a lot of things
 * when working with file based working copies.
 */
export interface IWorkingCopy extends IWorkingCopyIdentifier {

	/**
	 * Human readable name of the working copy.
	 */
	readonly name: string;

	/**
	 * The capabilities of the working copy.
	 */
	readonly capabilities: WorkingCopyCapabilities;


	//#region Events

	/**
	 * Used by the workbench to signal if the working copy
	 * is dirty or not. Typically a working copy is dirty
	 * once changed until saved or reverted.
	 */
	readonly onDidChangeDirty: Event<void>;

	/**
	 * Used by the workbench e.g. to trigger auto-save
	 * (unless this working copy is untitled) and backups.
	 */
	readonly onDidChangeContent: Event<void>;

	/**
	 * Used by the workbench e.g. to track local history
	 * (unless this working copy is untitled).
	 */
	readonly onDidSave: Event<IWorkingCopySaveEvent>;

	//#endregion


	//#region Dirty Tracking

	/**
	 * Indicates that the file has unsaved changes
	 * and should confirm before closing.
	 */
	isDirty(): boolean;

	/**
	 * Indicates that the file has unsaved changes.
	 * Used for backup tracking and accounts for
	 * working copies that are never dirty e.g.
	 * scratchpads.
	 */
	isModified(): boolean;

	//#endregion


	//#region Save / Backup

	/**
	 * The delay in milliseconds to wait before triggering
	 * a backup after the content of the model has changed.
	 *
	 * If not configured, a sensible default will be taken
	 * based on user settings.
	 */
	readonly backupDelay?: number;

	/**
	 * The workbench may call this method often after it receives
	 * the `onDidChangeContent` event for the working copy. The motivation
	 * is to allow to quit VSCode with dirty working copies present.
	 *
	 * Providers of working copies should use `IWorkingCopyBackupService.resolve(workingCopy)`
	 * to retrieve the backup metadata associated when loading the working copy.
	 *
	 * @param token support for cancellation
	 */
	backup(token: CancellationToken): Promise<IWorkingCopyBackup>;

	/**
	 * Asks the working copy to save. If the working copy was dirty, it is
	 * expected to be non-dirty after this operation has finished.
	 *
	 * @returns `true` if the operation was successful and `false` otherwise.
	 */
	save(options?: ISaveOptions): Promise<boolean>;

	/**
	 * Asks the working copy to revert. If the working copy was dirty, it is
	 * expected to be non-dirty after this operation has finished.
	 */
	revert(options?: IRevertOptions): Promise<void>;

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyBackup.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyBackup.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IWorkingCopyBackupMeta, IWorkingCopyIdentifier } from './workingCopy.js';

export const IWorkingCopyBackupService = createDecorator<IWorkingCopyBackupService>('workingCopyBackupService');

/**
 * A resolved working copy backup carries the backup value
 * as well as associated metadata with it.
 */
export interface IResolvedWorkingCopyBackup<T extends IWorkingCopyBackupMeta> {

	/**
	 * The content of the working copy backup.
	 */
	readonly value: VSBufferReadableStream;

	/**
	 * Additional metadata that is associated with
	 * the working copy backup.
	 */
	readonly meta?: T;
}

/**
 * The working copy backup service is the main service to handle backups
 * for working copies.
 * Methods allow to persist and resolve working copy backups from the file
 * system.
 */
export interface IWorkingCopyBackupService {

	readonly _serviceBrand: undefined;

	/**
	 * Finds out if a working copy backup with the given identifier
	 * and optional version exists.
	 *
	 * Note: if the backup service has not been initialized yet, this may return
	 * the wrong result. Always use `resolve()` if you can do a long running
	 * operation.
	 */
	hasBackupSync(identifier: IWorkingCopyIdentifier, versionId?: number): boolean;

	/**
	 * Gets a list of working copy backups for the current workspace.
	 */
	getBackups(): Promise<readonly IWorkingCopyIdentifier[]>;

	/**
	 * Resolves the working copy backup for the given identifier if that exists.
	 */
	resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined>;

	/**
	 * Stores a new working copy backup for the given identifier.
	 */
	backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadable | VSBufferReadableStream, versionId?: number, meta?: IWorkingCopyBackupMeta, token?: CancellationToken): Promise<void>;

	/**
	 * Discards the working copy backup associated with the identifier if it exists.
	 */
	discardBackup(identifier: IWorkingCopyIdentifier, token?: CancellationToken): Promise<void>;

	/**
	 * Discards all working copy backups.
	 *
	 * The optional set of identifiers in the filter can be
	 * provided to discard all but the provided ones.
	 */
	discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyBackupService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyBackupService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { equals, deepClone } from '../../../../base/common/objects.js';
import { Promises, ResourceQueue } from '../../../../base/common/async.js';
import { IResolvedWorkingCopyBackup, IWorkingCopyBackupService } from './workingCopyBackup.js';
import { IFileService, FileOperationError, FileOperationResult } from '../../../../platform/files/common/files.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { isReadableStream, peekStream } from '../../../../base/common/stream.js';
import { bufferToStream, prefixedBufferReadable, prefixedBufferStream, readableToBuffer, streamToBuffer, VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Schemas } from '../../../../base/common/network.js';
import { hash } from '../../../../base/common/hash.js';
import { isEmptyObject } from '../../../../base/common/types.js';
import { IWorkingCopyBackupMeta, IWorkingCopyIdentifier, NO_TYPE_ID } from './workingCopy.js';

export class WorkingCopyBackupsModel {

	private readonly cache = new ResourceMap<{ versionId?: number; meta?: IWorkingCopyBackupMeta }>();

	static async create(backupRoot: URI, fileService: IFileService): Promise<WorkingCopyBackupsModel> {
		const model = new WorkingCopyBackupsModel(backupRoot, fileService);

		await model.resolve();

		return model;
	}

	private constructor(private backupRoot: URI, private fileService: IFileService) { }

	private async resolve(): Promise<void> {
		try {
			const backupRootStat = await this.fileService.resolve(this.backupRoot);
			if (backupRootStat.children) {
				await Promises.settled(backupRootStat.children
					.filter(child => child.isDirectory)
					.map(async backupSchemaFolder => {

						// Read backup directory for backups
						const backupSchemaFolderStat = await this.fileService.resolve(backupSchemaFolder.resource);

						// Remember known backups in our caches
						//
						// Note: this does NOT account for resolving
						// associated meta data because that requires
						// opening the backup and reading the meta
						// preamble. Instead, when backups are actually
						// resolved, the meta data will be added via
						// additional `update` calls.
						if (backupSchemaFolderStat.children) {
							for (const backupForSchema of backupSchemaFolderStat.children) {
								if (!backupForSchema.isDirectory) {
									this.add(backupForSchema.resource);
								}
							}
						}
					}));
			}
		} catch (error) {
			// ignore any errors
		}
	}

	add(resource: URI, versionId = 0, meta?: IWorkingCopyBackupMeta): void {
		this.cache.set(resource, {
			versionId,
			meta: deepClone(meta)
		});
	}

	update(resource: URI, meta?: IWorkingCopyBackupMeta): void {
		const entry = this.cache.get(resource);
		if (entry) {
			entry.meta = deepClone(meta);
		}
	}

	count(): number {
		return this.cache.size;
	}

	has(resource: URI, versionId?: number, meta?: IWorkingCopyBackupMeta): boolean {
		const entry = this.cache.get(resource);
		if (!entry) {
			return false; // unknown resource
		}

		if (typeof versionId === 'number' && versionId !== entry.versionId) {
			return false; // different versionId
		}

		if (meta && !equals(meta, entry.meta)) {
			return false; // different metadata
		}

		return true;
	}

	get(): URI[] {
		return Array.from(this.cache.keys());
	}

	remove(resource: URI): void {
		this.cache.delete(resource);
	}

	clear(): void {
		this.cache.clear();
	}
}

export abstract class WorkingCopyBackupService extends Disposable implements IWorkingCopyBackupService {

	declare readonly _serviceBrand: undefined;

	private impl: WorkingCopyBackupServiceImpl | InMemoryWorkingCopyBackupService;

	constructor(
		backupWorkspaceHome: URI | undefined,
		@IFileService protected fileService: IFileService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.impl = this._register(this.initialize(backupWorkspaceHome));
	}

	private initialize(backupWorkspaceHome: URI | undefined): WorkingCopyBackupServiceImpl | InMemoryWorkingCopyBackupService {
		if (backupWorkspaceHome) {
			return new WorkingCopyBackupServiceImpl(backupWorkspaceHome, this.fileService, this.logService);
		}

		return new InMemoryWorkingCopyBackupService();
	}

	reinitialize(backupWorkspaceHome: URI | undefined): void {

		// Re-init implementation (unless we are running in-memory)
		if (this.impl instanceof WorkingCopyBackupServiceImpl) {
			if (backupWorkspaceHome) {
				this.impl.initialize(backupWorkspaceHome);
			} else {
				this.impl = new InMemoryWorkingCopyBackupService();
			}
		}
	}

	hasBackupSync(identifier: IWorkingCopyIdentifier, versionId?: number, meta?: IWorkingCopyBackupMeta): boolean {
		return this.impl.hasBackupSync(identifier, versionId, meta);
	}

	backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadableStream | VSBufferReadable, versionId?: number, meta?: IWorkingCopyBackupMeta, token?: CancellationToken): Promise<void> {
		return this.impl.backup(identifier, content, versionId, meta, token);
	}

	discardBackup(identifier: IWorkingCopyIdentifier, token?: CancellationToken): Promise<void> {
		return this.impl.discardBackup(identifier, token);
	}

	discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void> {
		return this.impl.discardBackups(filter);
	}

	getBackups(): Promise<IWorkingCopyIdentifier[]> {
		return this.impl.getBackups();
	}

	resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined> {
		return this.impl.resolve(identifier);
	}

	toBackupResource(identifier: IWorkingCopyIdentifier): URI {
		return this.impl.toBackupResource(identifier);
	}

	joinBackups(): Promise<void> {
		return this.impl.joinBackups();
	}
}

class WorkingCopyBackupServiceImpl extends Disposable implements IWorkingCopyBackupService {

	private static readonly PREAMBLE_END_MARKER = '\n';
	private static readonly PREAMBLE_END_MARKER_CHARCODE = '\n'.charCodeAt(0);
	private static readonly PREAMBLE_META_SEPARATOR = ' '; // using a character that is know to be escaped in a URI as separator
	private static readonly PREAMBLE_MAX_LENGTH = 10000;

	declare readonly _serviceBrand: undefined;

	private readonly ioOperationQueues = this._register(new ResourceQueue()); // queue IO operations to ensure write/delete file order

	private ready!: Promise<WorkingCopyBackupsModel>;
	private model: WorkingCopyBackupsModel | undefined = undefined;

	constructor(
		private backupWorkspaceHome: URI,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.initialize(backupWorkspaceHome);
	}

	initialize(backupWorkspaceResource: URI): void {
		this.backupWorkspaceHome = backupWorkspaceResource;

		this.ready = this.doInitialize();
	}

	private async doInitialize(): Promise<WorkingCopyBackupsModel> {

		// Create backup model
		this.model = await WorkingCopyBackupsModel.create(this.backupWorkspaceHome, this.fileService);

		return this.model;
	}

	hasBackupSync(identifier: IWorkingCopyIdentifier, versionId?: number, meta?: IWorkingCopyBackupMeta): boolean {
		if (!this.model) {
			return false;
		}

		const backupResource = this.toBackupResource(identifier);

		return this.model.has(backupResource, versionId, meta);
	}

	async backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadable | VSBufferReadableStream, versionId?: number, meta?: IWorkingCopyBackupMeta, token?: CancellationToken): Promise<void> {
		const model = await this.ready;
		if (token?.isCancellationRequested) {
			return;
		}

		const backupResource = this.toBackupResource(identifier);
		if (model.has(backupResource, versionId, meta)) {
			// return early if backup version id matches requested one
			return;
		}

		return this.ioOperationQueues.queueFor(backupResource, async () => {
			if (token?.isCancellationRequested) {
				return;
			}

			if (model.has(backupResource, versionId, meta)) {
				// return early if backup version id matches requested one
				// this can happen when multiple backup IO operations got
				// scheduled, racing against each other.
				return;
			}

			// Encode as: Resource + META-START + Meta + END
			// and respect max length restrictions in case
			// meta is too large.
			let preamble = this.createPreamble(identifier, meta);
			if (preamble.length >= WorkingCopyBackupServiceImpl.PREAMBLE_MAX_LENGTH) {
				preamble = this.createPreamble(identifier);
			}

			// Update backup with value
			const preambleBuffer = VSBuffer.fromString(preamble);
			let backupBuffer: VSBuffer | VSBufferReadableStream | VSBufferReadable;
			if (isReadableStream(content)) {
				backupBuffer = prefixedBufferStream(preambleBuffer, content);
			} else if (content) {
				backupBuffer = prefixedBufferReadable(preambleBuffer, content);
			} else {
				backupBuffer = VSBuffer.concat([preambleBuffer, VSBuffer.fromString('')]);
			}

			// Write backup via file service
			await this.fileService.writeFile(backupResource, backupBuffer);

			//
			// Update model
			//
			// Note: not checking for cancellation here because a successful
			// write into the backup file should be noted in the model to
			// prevent the model being out of sync with the backup file
			model.add(backupResource, versionId, meta);
		});
	}

	private createPreamble(identifier: IWorkingCopyIdentifier, meta?: IWorkingCopyBackupMeta): string {
		return `${identifier.resource.toString()}${WorkingCopyBackupServiceImpl.PREAMBLE_META_SEPARATOR}${JSON.stringify({ ...meta, typeId: identifier.typeId })}${WorkingCopyBackupServiceImpl.PREAMBLE_END_MARKER}`;
	}

	async discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void> {
		const model = await this.ready;

		// Discard all but some backups
		const except = filter?.except;
		if (Array.isArray(except) && except.length > 0) {
			const exceptMap = new ResourceMap<boolean>();
			for (const exceptWorkingCopy of except) {
				exceptMap.set(this.toBackupResource(exceptWorkingCopy), true);
			}

			await Promises.settled(model.get().map(async backupResource => {
				if (!exceptMap.has(backupResource)) {
					await this.doDiscardBackup(backupResource);
				}
			}));
		}

		// Discard all backups
		else {
			await this.deleteIgnoreFileNotFound(this.backupWorkspaceHome);

			model.clear();
		}
	}

	discardBackup(identifier: IWorkingCopyIdentifier, token?: CancellationToken): Promise<void> {
		const backupResource = this.toBackupResource(identifier);

		return this.doDiscardBackup(backupResource, token);
	}

	private async doDiscardBackup(backupResource: URI, token?: CancellationToken): Promise<void> {
		const model = await this.ready;
		if (token?.isCancellationRequested) {
			return;
		}

		return this.ioOperationQueues.queueFor(backupResource, async () => {
			if (token?.isCancellationRequested) {
				return;
			}

			// Delete backup file ignoring any file not found errors
			await this.deleteIgnoreFileNotFound(backupResource);

			//
			// Update model
			//
			// Note: not checking for cancellation here because a successful
			// delete of the backup file should be noted in the model to
			// prevent the model being out of sync with the backup file
			model.remove(backupResource);
		});
	}

	private async deleteIgnoreFileNotFound(backupResource: URI): Promise<void> {
		try {
			await this.fileService.del(backupResource, { recursive: true });
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				throw error; // re-throw any other error than file not found which is OK
			}
		}
	}

	async getBackups(): Promise<IWorkingCopyIdentifier[]> {
		const model = await this.ready;

		// Ensure to await any pending backup operations
		await this.joinBackups();

		const backups = await Promise.all(model.get().map(backupResource => this.resolveIdentifier(backupResource, model)));

		return coalesce(backups);
	}

	private async resolveIdentifier(backupResource: URI, model: WorkingCopyBackupsModel): Promise<IWorkingCopyIdentifier | undefined> {
		let res: IWorkingCopyIdentifier | undefined = undefined;

		await this.ioOperationQueues.queueFor(backupResource, async () => {
			if (!model.has(backupResource)) {
				return; // require backup to be present
			}

			// Read the entire backup preamble by reading up to
			// `PREAMBLE_MAX_LENGTH` in the backup file until
			// the `PREAMBLE_END_MARKER` is found
			const backupPreamble = await this.readToMatchingString(backupResource, WorkingCopyBackupServiceImpl.PREAMBLE_END_MARKER, WorkingCopyBackupServiceImpl.PREAMBLE_MAX_LENGTH);
			if (!backupPreamble) {
				return;
			}

			// Figure out the offset in the preamble where meta
			// information possibly starts. This can be `-1` for
			// older backups without meta.
			const metaStartIndex = backupPreamble.indexOf(WorkingCopyBackupServiceImpl.PREAMBLE_META_SEPARATOR);

			// Extract the preamble content for resource and meta
			let resourcePreamble: string;
			let metaPreamble: string | undefined;
			if (metaStartIndex > 0) {
				resourcePreamble = backupPreamble.substring(0, metaStartIndex);
				metaPreamble = backupPreamble.substr(metaStartIndex + 1);
			} else {
				resourcePreamble = backupPreamble;
				metaPreamble = undefined;
			}

			// Try to parse the meta preamble for figuring out
			// `typeId` and `meta` if defined.
			const { typeId, meta } = this.parsePreambleMeta(metaPreamble);

			// Update model entry with now resolved meta
			model.update(backupResource, meta);

			res = {
				typeId: typeId ?? NO_TYPE_ID,
				resource: URI.parse(resourcePreamble)
			};
		});

		return res;
	}

	private async readToMatchingString(backupResource: URI, matchingString: string, maximumBytesToRead: number): Promise<string | undefined> {
		const contents = (await this.fileService.readFile(backupResource, { length: maximumBytesToRead })).value.toString();

		const matchingStringIndex = contents.indexOf(matchingString);
		if (matchingStringIndex >= 0) {
			return contents.substr(0, matchingStringIndex);
		}

		// Unable to find matching string in file
		return undefined;
	}

	async resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined> {
		const backupResource = this.toBackupResource(identifier);

		const model = await this.ready;

		let res: IResolvedWorkingCopyBackup<T> | undefined = undefined;

		await this.ioOperationQueues.queueFor(backupResource, async () => {
			if (!model.has(backupResource)) {
				return; // require backup to be present
			}

			// Load the backup content and peek into the first chunk
			// to be able to resolve the meta data
			const backupStream = await this.fileService.readFileStream(backupResource);
			const peekedBackupStream = await peekStream(backupStream.value, 1);
			const firstBackupChunk = VSBuffer.concat(peekedBackupStream.buffer);

			// We have seen reports (e.g. https://github.com/microsoft/vscode/issues/78500) where
			// if VSCode goes down while writing the backup file, the file can turn empty because
			// it always first gets truncated and then written to. In this case, we will not find
			// the meta-end marker ('\n') and as such the backup can only be invalid. We bail out
			// here if that is the case.
			const preambleEndIndex = firstBackupChunk.buffer.indexOf(WorkingCopyBackupServiceImpl.PREAMBLE_END_MARKER_CHARCODE);
			if (preambleEndIndex === -1) {
				this.logService.trace(`Backup: Could not find meta end marker in ${backupResource}. The file is probably corrupt (filesize: ${backupStream.size}).`);

				return undefined;
			}

			const preambelRaw = firstBackupChunk.slice(0, preambleEndIndex).toString();

			// Extract meta data (if any)
			let meta: T | undefined;
			const metaStartIndex = preambelRaw.indexOf(WorkingCopyBackupServiceImpl.PREAMBLE_META_SEPARATOR);
			if (metaStartIndex !== -1) {
				meta = this.parsePreambleMeta(preambelRaw.substr(metaStartIndex + 1)).meta as T;
			}

			// Update model entry with now resolved meta
			model.update(backupResource, meta);

			// Build a new stream without the preamble
			const firstBackupChunkWithoutPreamble = firstBackupChunk.slice(preambleEndIndex + 1);
			let value: VSBufferReadableStream;
			if (peekedBackupStream.ended) {
				value = bufferToStream(firstBackupChunkWithoutPreamble);
			} else {
				value = prefixedBufferStream(firstBackupChunkWithoutPreamble, peekedBackupStream.stream);
			}

			res = { value, meta };
		});

		return res;
	}

	private parsePreambleMeta<T extends IWorkingCopyBackupMeta>(preambleMetaRaw: string | undefined): { typeId: string | undefined; meta: T | undefined } {
		let typeId: string | undefined = undefined;
		let meta: T | undefined = undefined;

		if (preambleMetaRaw) {
			try {
				meta = JSON.parse(preambleMetaRaw);
				typeId = meta?.typeId;

				// `typeId` is a property that we add so we
				// remove it when returning to clients.
				if (typeof meta?.typeId === 'string') {
					delete meta.typeId;

					if (isEmptyObject(meta)) {
						meta = undefined;
					}
				}
			} catch (error) {
				// ignore JSON parse errors
			}
		}

		return { typeId, meta };
	}

	toBackupResource(identifier: IWorkingCopyIdentifier): URI {
		return joinPath(this.backupWorkspaceHome, identifier.resource.scheme, hashIdentifier(identifier));
	}

	joinBackups(): Promise<void> {
		return this.ioOperationQueues.whenDrained();
	}
}

export class InMemoryWorkingCopyBackupService extends Disposable implements IWorkingCopyBackupService {

	declare readonly _serviceBrand: undefined;

	private backups = new ResourceMap<{ typeId: string; content: VSBuffer; meta?: IWorkingCopyBackupMeta }>();

	hasBackupSync(identifier: IWorkingCopyIdentifier, versionId?: number): boolean {
		const backupResource = this.toBackupResource(identifier);

		return this.backups.has(backupResource);
	}

	async backup(identifier: IWorkingCopyIdentifier, content?: VSBufferReadable | VSBufferReadableStream, versionId?: number, meta?: IWorkingCopyBackupMeta, token?: CancellationToken): Promise<void> {
		const backupResource = this.toBackupResource(identifier);
		this.backups.set(backupResource, {
			typeId: identifier.typeId,
			content: content instanceof VSBuffer ? content : content ? isReadableStream(content) ? await streamToBuffer(content) : readableToBuffer(content) : VSBuffer.fromString(''),
			meta
		});
	}

	async resolve<T extends IWorkingCopyBackupMeta>(identifier: IWorkingCopyIdentifier): Promise<IResolvedWorkingCopyBackup<T> | undefined> {
		const backupResource = this.toBackupResource(identifier);
		const backup = this.backups.get(backupResource);
		if (backup) {
			return { value: bufferToStream(backup.content), meta: backup.meta as T | undefined };
		}

		return undefined;
	}

	async getBackups(): Promise<IWorkingCopyIdentifier[]> {
		return Array.from(this.backups.entries()).map(([resource, backup]) => ({ typeId: backup.typeId, resource }));
	}

	async discardBackup(identifier: IWorkingCopyIdentifier): Promise<void> {
		this.backups.delete(this.toBackupResource(identifier));
	}

	async discardBackups(filter?: { except: IWorkingCopyIdentifier[] }): Promise<void> {
		const except = filter?.except;
		if (Array.isArray(except) && except.length > 0) {
			const exceptMap = new ResourceMap<boolean>();
			for (const exceptWorkingCopy of except) {
				exceptMap.set(this.toBackupResource(exceptWorkingCopy), true);
			}

			for (const backup of await this.getBackups()) {
				if (!exceptMap.has(this.toBackupResource(backup))) {
					await this.discardBackup(backup);
				}
			}
		} else {
			this.backups.clear();
		}
	}

	toBackupResource(identifier: IWorkingCopyIdentifier): URI {
		return URI.from({ scheme: Schemas.inMemory, path: hashIdentifier(identifier) });
	}

	async joinBackups(): Promise<void> {
		return;
	}
}

/*
 * Exported only for testing
 */
export function hashIdentifier(identifier: IWorkingCopyIdentifier): string {

	// IMPORTANT: for backwards compatibility, ensure that
	// we ignore the `typeId` unless a value is provided.
	// To preserve previous backups without type id, we
	// need to just hash the resource. Otherwise we use
	// the type id as a seed to the resource path.
	let resource: URI;
	if (identifier.typeId.length > 0) {
		const typeIdHash = hashString(identifier.typeId);
		if (identifier.resource.path) {
			resource = joinPath(identifier.resource, typeIdHash);
		} else {
			resource = identifier.resource.with({ path: typeIdHash });
		}
	} else {
		resource = identifier.resource;
	}

	return hashPath(resource);
}

function hashPath(resource: URI): string {
	const str = resource.scheme === Schemas.file || resource.scheme === Schemas.untitled ? resource.fsPath : resource.toString();

	return hashString(str);
}

function hashString(str: string): string {
	return hash(str).toString(16);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyBackupTracker.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyBackupTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkingCopyBackupService } from './workingCopyBackup.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { IWorkingCopy, IWorkingCopyIdentifier, WorkingCopyCapabilities } from './workingCopy.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ShutdownReason, ILifecycleService, LifecyclePhase, InternalBeforeShutdownEvent } from '../../lifecycle/common/lifecycle.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from './workingCopyEditorService.js';
import { Promises } from '../../../../base/common/async.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { EditorsOrder } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroupsService } from '../../editor/common/editorGroupsService.js';

/**
 * The working copy backup tracker deals with:
 * - restoring backups that exist
 * - creating backups for modified working copies
 * - deleting backups for saved working copies
 * - handling backups on shutdown
 */
export abstract class WorkingCopyBackupTracker extends Disposable {

	constructor(
		protected readonly workingCopyBackupService: IWorkingCopyBackupService,
		protected readonly workingCopyService: IWorkingCopyService,
		protected readonly logService: ILogService,
		private readonly lifecycleService: ILifecycleService,
		protected readonly filesConfigurationService: IFilesConfigurationService,
		private readonly workingCopyEditorService: IWorkingCopyEditorService,
		protected readonly editorService: IEditorService,
		private readonly editorGroupService: IEditorGroupsService
	) {
		super();

		this.whenReady = this.resolveBackupsToRestore();

		// Fill in initial modified working copies
		for (const workingCopy of this.workingCopyService.modifiedWorkingCopies) {
			this.onDidRegister(workingCopy);
		}

		this.registerListeners();
	}

	private registerListeners() {

		// Working Copy events
		this._register(this.workingCopyService.onDidRegister(workingCopy => this.onDidRegister(workingCopy)));
		this._register(this.workingCopyService.onDidUnregister(workingCopy => this.onDidUnregister(workingCopy)));
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.onDidChangeDirty(workingCopy)));
		this._register(this.workingCopyService.onDidChangeContent(workingCopy => this.onDidChangeContent(workingCopy)));

		// Lifecycle
		this._register(this.lifecycleService.onBeforeShutdown(event => (event as InternalBeforeShutdownEvent).finalVeto(() => this.onFinalBeforeShutdown(event.reason), 'veto.backups')));
		this._register(this.lifecycleService.onWillShutdown(() => this.onWillShutdown()));

		// Once a handler registers, restore backups
		this._register(this.workingCopyEditorService.onDidRegisterHandler(handler => this.restoreBackups(handler)));
	}

	protected abstract onFinalBeforeShutdown(reason: ShutdownReason): boolean | Promise<boolean>;

	private onWillShutdown(): void {

		// Here we know that we will shutdown. Any backup operation that is
		// already scheduled or being scheduled from this moment on runs
		// at the risk of corrupting a backup because the backup operation
		// might terminate at any given time now. As such, we need to disable
		// this tracker from performing more backups by cancelling pending
		// operations and suspending the tracker without resuming.

		this.cancelBackupOperations();
		this.suspendBackupOperations();
	}


	//#region Backup Creator

	// Delay creation of backups when content changes to avoid too much
	// load on the backup service when the user is typing into the editor
	// Since we always schedule a backup, even when auto save is on, we
	// have different scheduling delays based on auto save configuration.
	// With 'delayed' we avoid a (not critical but also not really wanted)
	// race between saving (after 1s per default) and making a backup of
	// the working copy.
	private static readonly DEFAULT_BACKUP_SCHEDULE_DELAYS = {
		['default']: 1000,
		['delayed']: 2000
	};

	// A map from working copy to a version ID we compute on each content
	// change. This version ID allows to e.g. ask if a backup for a specific
	// content has been made before closing.
	private readonly mapWorkingCopyToContentVersion = new Map<IWorkingCopy, number>();

	// A map of scheduled pending backup operations for working copies
	// Given https://github.com/microsoft/vscode/issues/158038, we explicitly
	// do not store `IWorkingCopy` but the identifier in the map, since it
	// looks like GC is not running for the working copy otherwise.
	protected readonly pendingBackupOperations = new Map<IWorkingCopyIdentifier, { disposable: IDisposable; cancel: () => void }>();

	private suspended = false;

	private onDidRegister(workingCopy: IWorkingCopy): void {
		if (this.suspended) {
			this.logService.warn(`[backup tracker] suspended, ignoring register event`, workingCopy.resource.toString(), workingCopy.typeId);
			return;
		}

		if (workingCopy.isModified()) {
			this.scheduleBackup(workingCopy);
		}
	}

	private onDidUnregister(workingCopy: IWorkingCopy): void {

		// Remove from content version map
		this.mapWorkingCopyToContentVersion.delete(workingCopy);

		// Check suspended
		if (this.suspended) {
			this.logService.warn(`[backup tracker] suspended, ignoring unregister event`, workingCopy.resource.toString(), workingCopy.typeId);
			return;
		}

		// Discard backup
		this.discardBackup(workingCopy);
	}

	private onDidChangeDirty(workingCopy: IWorkingCopy): void {
		if (this.suspended) {
			this.logService.warn(`[backup tracker] suspended, ignoring dirty change event`, workingCopy.resource.toString(), workingCopy.typeId);
			return;
		}

		if (workingCopy.isDirty()) {
			this.scheduleBackup(workingCopy);
		} else {
			this.discardBackup(workingCopy);
		}
	}

	private onDidChangeContent(workingCopy: IWorkingCopy): void {

		// Increment content version ID
		const contentVersionId = this.getContentVersion(workingCopy);
		this.mapWorkingCopyToContentVersion.set(workingCopy, contentVersionId + 1);

		// Check suspended
		if (this.suspended) {
			this.logService.warn(`[backup tracker] suspended, ignoring content change event`, workingCopy.resource.toString(), workingCopy.typeId);
			return;
		}

		// Schedule backup for modified working copies
		if (workingCopy.isModified()) {
			// this listener will make sure that the backup is
			// pushed out for as long as the user is still changing
			// the content of the working copy.
			this.scheduleBackup(workingCopy);
		}
	}

	private scheduleBackup(workingCopy: IWorkingCopy): void {

		// Clear any running backup operation
		this.cancelBackupOperation(workingCopy);

		this.logService.trace(`[backup tracker] scheduling backup`, workingCopy.resource.toString(), workingCopy.typeId);

		// Schedule new backup
		const workingCopyIdentifier = { resource: workingCopy.resource, typeId: workingCopy.typeId };
		const cts = new CancellationTokenSource();
		const handle = setTimeout(async () => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			// Backup if modified
			if (workingCopy.isModified()) {
				this.logService.trace(`[backup tracker] creating backup`, workingCopy.resource.toString(), workingCopy.typeId);

				try {
					const backup = await workingCopy.backup(cts.token);
					if (cts.token.isCancellationRequested) {
						return;
					}

					if (workingCopy.isModified()) {
						this.logService.trace(`[backup tracker] storing backup`, workingCopy.resource.toString(), workingCopy.typeId);

						await this.workingCopyBackupService.backup(workingCopy, backup.content, this.getContentVersion(workingCopy), backup.meta, cts.token);
					}
				} catch (error) {
					this.logService.error(error);
				}
			}

			// Clear disposable unless we got canceled which would
			// indicate another operation has started meanwhile
			if (!cts.token.isCancellationRequested) {
				this.doClearPendingBackupOperation(workingCopyIdentifier);
			}
		}, this.getBackupScheduleDelay(workingCopy));

		// Keep in map for disposal as needed
		this.pendingBackupOperations.set(workingCopyIdentifier, {
			cancel: () => {
				this.logService.trace(`[backup tracker] clearing pending backup creation`, workingCopy.resource.toString(), workingCopy.typeId);

				cts.cancel();
			},
			disposable: toDisposable(() => {
				cts.dispose();
				clearTimeout(handle);
			})
		});
	}

	protected getBackupScheduleDelay(workingCopy: IWorkingCopy): number {
		if (typeof workingCopy.backupDelay === 'number') {
			return workingCopy.backupDelay; // respect working copy override
		}

		let backupScheduleDelay: 'default' | 'delayed';
		if (workingCopy.capabilities & WorkingCopyCapabilities.Untitled) {
			backupScheduleDelay = 'default'; // auto-save is never on for untitled working copies
		} else {
			backupScheduleDelay = this.filesConfigurationService.hasShortAutoSaveDelay(workingCopy.resource) ? 'delayed' : 'default';
		}

		return WorkingCopyBackupTracker.DEFAULT_BACKUP_SCHEDULE_DELAYS[backupScheduleDelay];
	}

	protected getContentVersion(workingCopy: IWorkingCopy): number {
		return this.mapWorkingCopyToContentVersion.get(workingCopy) || 0;
	}

	private discardBackup(workingCopy: IWorkingCopy): void {

		// Clear any running backup operation
		this.cancelBackupOperation(workingCopy);

		// Schedule backup discard asap
		const workingCopyIdentifier = { resource: workingCopy.resource, typeId: workingCopy.typeId };
		const cts = new CancellationTokenSource();
		this.doDiscardBackup(workingCopyIdentifier, cts);

		// Keep in map for disposal as needed
		this.pendingBackupOperations.set(workingCopyIdentifier, {
			cancel: () => {
				this.logService.trace(`[backup tracker] clearing pending backup discard`, workingCopy.resource.toString(), workingCopy.typeId);

				cts.cancel();
			},
			disposable: cts
		});
	}

	private async doDiscardBackup(workingCopyIdentifier: IWorkingCopyIdentifier, cts: CancellationTokenSource) {
		this.logService.trace(`[backup tracker] discarding backup`, workingCopyIdentifier.resource.toString(), workingCopyIdentifier.typeId);

		// Discard backup
		try {
			await this.workingCopyBackupService.discardBackup(workingCopyIdentifier, cts.token);
		} catch (error) {
			this.logService.error(error);
		}

		// Clear disposable unless we got canceled which would
		// indicate another operation has started meanwhile
		if (!cts.token.isCancellationRequested) {
			this.doClearPendingBackupOperation(workingCopyIdentifier);
		}
	}

	private cancelBackupOperation(workingCopy: IWorkingCopy): void {

		// Given a working copy we want to find the matching
		// identifier in our pending operations map because
		// we cannot use the working copy directly, as the
		// identifier might have different object identity.

		let workingCopyIdentifier: IWorkingCopyIdentifier | undefined = undefined;
		for (const [identifier] of this.pendingBackupOperations) {
			if (identifier.resource.toString() === workingCopy.resource.toString() && identifier.typeId === workingCopy.typeId) {
				workingCopyIdentifier = identifier;
				break;
			}
		}

		if (workingCopyIdentifier) {
			this.doClearPendingBackupOperation(workingCopyIdentifier, { cancel: true });
		}
	}

	private doClearPendingBackupOperation(workingCopyIdentifier: IWorkingCopyIdentifier, options?: { cancel: boolean }): void {
		const pendingBackupOperation = this.pendingBackupOperations.get(workingCopyIdentifier);
		if (!pendingBackupOperation) {
			return;
		}

		if (options?.cancel) {
			pendingBackupOperation.cancel();
		}

		pendingBackupOperation.disposable.dispose();

		this.pendingBackupOperations.delete(workingCopyIdentifier);
	}

	protected cancelBackupOperations(): void {
		for (const [, operation] of this.pendingBackupOperations) {
			operation.cancel();
			operation.disposable.dispose();
		}

		this.pendingBackupOperations.clear();
	}

	protected suspendBackupOperations(): { resume: () => void } {
		this.suspended = true;

		return { resume: () => this.suspended = false };
	}

	//#endregion


	//#region Backup Restorer

	protected readonly unrestoredBackups = new Set<IWorkingCopyIdentifier>();
	protected readonly whenReady: Promise<void>;

	private _isReady = false;
	protected get isReady(): boolean { return this._isReady; }

	private async resolveBackupsToRestore(): Promise<void> {

		// Wait for resolving backups until we are restored to reduce startup pressure
		await this.lifecycleService.when(LifecyclePhase.Restored);

		// Remember each backup that needs to restore
		for (const backup of await this.workingCopyBackupService.getBackups()) {
			this.unrestoredBackups.add(backup);
		}

		this._isReady = true;
	}

	protected async restoreBackups(handler: IWorkingCopyEditorHandler): Promise<void> {

		// Wait for backups to be resolved
		await this.whenReady;

		// Figure out already opened editors for backups vs
		// non-opened.
		const openedEditorsForBackups = new Set<EditorInput>();
		const nonOpenedEditorsForBackups = new Set<EditorInput>();

		// Ensure each backup that can be handled has an
		// associated editor.
		const restoredBackups = new Set<IWorkingCopyIdentifier>();
		for (const unrestoredBackup of this.unrestoredBackups) {
			const canHandleUnrestoredBackup = await handler.handles(unrestoredBackup);
			if (!canHandleUnrestoredBackup) {
				continue;
			}

			// Collect already opened editors for backup
			let hasOpenedEditorForBackup = false;
			for (const { editor } of this.editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
				const isUnrestoredBackupOpened = handler.isOpen(unrestoredBackup, editor);
				if (isUnrestoredBackupOpened) {
					openedEditorsForBackups.add(editor);
					hasOpenedEditorForBackup = true;
				}
			}

			// Otherwise, make sure to create at least one editor
			// for the backup to show
			if (!hasOpenedEditorForBackup) {
				nonOpenedEditorsForBackups.add(await handler.createEditor(unrestoredBackup));
			}

			// Remember as (potentially) restored
			restoredBackups.add(unrestoredBackup);
		}

		// Ensure editors are opened for each backup without editor
		// in the background without stealing focus
		if (nonOpenedEditorsForBackups.size > 0) {
			await this.editorGroupService.activeGroup.openEditors([...nonOpenedEditorsForBackups].map(nonOpenedEditorForBackup => ({
				editor: nonOpenedEditorForBackup,
				options: {
					pinned: true,
					preserveFocus: true,
					inactive: true
				}
			})));

			for (const nonOpenedEditorForBackup of nonOpenedEditorsForBackups) {
				openedEditorsForBackups.add(nonOpenedEditorForBackup);
			}
		}

		// Then, resolve each opened editor to make sure the working copy
		// is loaded and the modified editor appears properly.
		// We only do that for editors that are not active in a group
		// already to prevent calling `resolve` twice!
		await Promises.settled([...openedEditorsForBackups].map(async openedEditorForBackup => {
			if (this.editorService.isVisible(openedEditorForBackup)) {
				return;
			}

			return openedEditorForBackup.resolve();
		}));

		// Finally, remove all handled backups from the list
		for (const restoredBackup of restoredBackups) {
			this.unrestoredBackups.delete(restoredBackup);
		}
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

````
