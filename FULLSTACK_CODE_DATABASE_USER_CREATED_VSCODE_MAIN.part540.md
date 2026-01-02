---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 540
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 540 of 552)

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

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyEditorService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyEditorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { EditorsOrder, IEditorIdentifier } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IWorkingCopy, IWorkingCopyIdentifier } from './workingCopy.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IEditorService } from '../../editor/common/editorService.js';

export const IWorkingCopyEditorService = createDecorator<IWorkingCopyEditorService>('workingCopyEditorService');

export interface IWorkingCopyEditorHandler {

	/**
	 * Whether the handler is capable of opening the specific backup in
	 * an editor.
	 */
	handles(workingCopy: IWorkingCopyIdentifier): boolean | Promise<boolean>;

	/**
	 * Whether the provided working copy is opened in the provided editor.
	 */
	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean;

	/**
	 * Create an editor that is suitable of opening the provided working copy.
	 */
	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput | Promise<EditorInput>;
}

export interface IWorkingCopyEditorService {

	readonly _serviceBrand: undefined;

	/**
	 * An event fired whenever a handler is registered.
	 */
	readonly onDidRegisterHandler: Event<IWorkingCopyEditorHandler>;

	/**
	 * Register a handler to the working copy editor service.
	 */
	registerHandler(handler: IWorkingCopyEditorHandler): IDisposable;

	/**
	 * Finds the first editor that can handle the provided working copy.
	 */
	findEditor(workingCopy: IWorkingCopy): IEditorIdentifier | undefined;
}

export class WorkingCopyEditorService extends Disposable implements IWorkingCopyEditorService {

	declare readonly _serviceBrand: undefined;

	private readonly _onDidRegisterHandler = this._register(new Emitter<IWorkingCopyEditorHandler>());
	readonly onDidRegisterHandler = this._onDidRegisterHandler.event;

	private readonly handlers = new Set<IWorkingCopyEditorHandler>();

	constructor(@IEditorService private readonly editorService: IEditorService) {
		super();
	}

	registerHandler(handler: IWorkingCopyEditorHandler): IDisposable {

		// Add to registry and emit as event
		this.handlers.add(handler);
		this._onDidRegisterHandler.fire(handler);

		return toDisposable(() => this.handlers.delete(handler));
	}

	findEditor(workingCopy: IWorkingCopy): IEditorIdentifier | undefined {
		for (const editorIdentifier of this.editorService.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
			if (this.isOpen(workingCopy, editorIdentifier.editor)) {
				return editorIdentifier;
			}
		}

		return undefined;
	}

	private isOpen(workingCopy: IWorkingCopy, editor: EditorInput): boolean {
		for (const handler of this.handlers) {
			if (handler.isOpen(workingCopy, editor)) {
				return true;
			}
		}

		return false;
	}
}

// Register Service
registerSingleton(IWorkingCopyEditorService, WorkingCopyEditorService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyFileOperationParticipant.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyFileOperationParticipant.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IDisposable, Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IWorkingCopyFileOperationParticipant, SourceTargetPair, IFileOperationUndoRedoInfo } from './workingCopyFileService.js';
import { FileOperation } from '../../../../platform/files/common/files.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { LinkedList } from '../../../../base/common/linkedList.js';

export class WorkingCopyFileOperationParticipant extends Disposable {

	private readonly participants = new LinkedList<IWorkingCopyFileOperationParticipant>();

	constructor(
		@ILogService private readonly logService: ILogService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();
	}

	addFileOperationParticipant(participant: IWorkingCopyFileOperationParticipant): IDisposable {
		const remove = this.participants.push(participant);

		return toDisposable(() => remove());
	}

	async participate(files: SourceTargetPair[], operation: FileOperation, undoInfo: IFileOperationUndoRedoInfo | undefined, token: CancellationToken): Promise<void> {
		const timeout = this.configurationService.getValue<number>('files.participants.timeout');
		if (typeof timeout !== 'number' || timeout <= 0) {
			return; // disabled
		}

		// For each participant
		for (const participant of this.participants) {
			try {
				await participant.participate(files, operation, undoInfo, timeout, token);
			} catch (err) {
				this.logService.warn(err);
			}
		}
	}

	override dispose(): void {
		this.participants.clear();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyFileService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Event, AsyncEmitter, IWaitUntil } from '../../../../base/common/event.js';
import { Promises } from '../../../../base/common/async.js';
import { insert } from '../../../../base/common/arrays.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IFileService, FileOperation, IFileStatWithMetadata } from '../../../../platform/files/common/files.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IWorkingCopyService } from './workingCopyService.js';
import { IWorkingCopy } from './workingCopy.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { WorkingCopyFileOperationParticipant } from './workingCopyFileOperationParticipant.js';
import { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { SaveReason } from '../../../common/editor.js';
import { IProgress, IProgressStep } from '../../../../platform/progress/common/progress.js';
import { StoredFileWorkingCopySaveParticipant } from './storedFileWorkingCopySaveParticipant.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel } from './storedFileWorkingCopy.js';

export const IWorkingCopyFileService = createDecorator<IWorkingCopyFileService>('workingCopyFileService');

export interface SourceTargetPair {

	/**
	 * The source resource that is defined for move operations.
	 */
	readonly source?: URI;

	/**
	 * The target resource the event is about.
	 */
	readonly target: URI;
}

export interface IFileOperationUndoRedoInfo {

	/**
	 * Id of the undo group that the file operation belongs to.
	 */
	undoRedoGroupId?: number;

	/**
	 * Flag indicates if the operation is an undo.
	 */
	isUndoing?: boolean;
}

export interface WorkingCopyFileEvent extends IWaitUntil {

	/**
	 * An identifier to correlate the operation through the
	 * different event types (before, after, error).
	 */
	readonly correlationId: number;

	/**
	 * The file operation that is taking place.
	 */
	readonly operation: FileOperation;

	/**
	 * The array of source/target pair of files involved in given operation.
	 */
	readonly files: readonly SourceTargetPair[];
}

export interface IWorkingCopyFileOperationParticipant {

	/**
	 * Participate in a file operation of working copies. Allows to
	 * change the working copies before they are being saved to disk.
	 */
	participate(
		files: SourceTargetPair[],
		operation: FileOperation,
		undoInfo: IFileOperationUndoRedoInfo | undefined,
		timeout: number,
		token: CancellationToken
	): Promise<void>;
}

export interface IStoredFileWorkingCopySaveParticipantContext {
	/**
	 * The reason why the save was triggered.
	 */
	readonly reason: SaveReason;

	/**
	 * Only applies to when a text file was saved as, for
	 * example when starting with untitled and saving. This
	 * provides access to the initial resource the text
	 * file had before.
	 */
	readonly savedFrom?: URI;
}

export interface IStoredFileWorkingCopySaveParticipant {

	/**
	 * The ordinal number which determines the order of participation.
	 * Lower values mean to participant sooner
	 */
	readonly ordinal?: number;

	/**
	 * Participate in a save operation of file stored working copies.
	 * Allows to make changes before content is being saved to disk.
	 */
	participate(
		workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>,
		context: IStoredFileWorkingCopySaveParticipantContext,
		progress: IProgress<IProgressStep>,
		token: CancellationToken
	): Promise<void>;
}

export interface ICreateOperation {
	resource: URI;
	overwrite?: boolean;
}

export interface ICreateFileOperation extends ICreateOperation {
	contents?: VSBuffer | VSBufferReadable | VSBufferReadableStream;
}

export interface IDeleteOperation {
	resource: URI;
	useTrash?: boolean;
	recursive?: boolean;
}

export interface IMoveOperation {
	file: Required<SourceTargetPair>;
	overwrite?: boolean;
}

export interface ICopyOperation extends IMoveOperation { }

/**
 * Returns the working copies for a given resource.
 */
type WorkingCopyProvider = (resourceOrFolder: URI) => IWorkingCopy[];

/**
 * A service that allows to perform file operations with working copy support.
 * Any operation that would leave a stale dirty working copy behind will make
 * sure to revert the working copy first.
 *
 * On top of that events are provided to participate in each state of the
 * operation to perform additional work.
 */
export interface IWorkingCopyFileService {

	readonly _serviceBrand: undefined;

	//#region Events

	/**
	 * An event that is fired when a certain working copy IO operation is about to run.
	 *
	 * Participants can join this event with a long running operation to keep some state
	 * before the operation is started, but working copies should not be changed at this
	 * point in time. For that purpose, use the `IWorkingCopyFileOperationParticipant` API.
	 */
	readonly onWillRunWorkingCopyFileOperation: Event<WorkingCopyFileEvent>;

	/**
	 * An event that is fired after a working copy IO operation has failed.
	 *
	 * Participants can join this event with a long running operation to clean up as needed.
	 */
	readonly onDidFailWorkingCopyFileOperation: Event<WorkingCopyFileEvent>;

	/**
	 * An event that is fired after a working copy IO operation has been performed.
	 *
	 * Participants can join this event with a long running operation to make changes
	 * after the operation has finished.
	 */
	readonly onDidRunWorkingCopyFileOperation: Event<WorkingCopyFileEvent>;

	//#endregion


	//#region File operation participants

	/**
	 * Adds a participant for file operations on working copies.
	 */
	addFileOperationParticipant(participant: IWorkingCopyFileOperationParticipant): IDisposable;

	//#endregion


	//#region Stored File Working Copy save participants

	/**
	 * Whether save participants are present for stored file working copies.
	 */
	get hasSaveParticipants(): boolean;

	/**
	 * Adds a participant for save operations on stored file working copies.
	 */
	addSaveParticipant(participant: IStoredFileWorkingCopySaveParticipant): IDisposable;

	/**
	 * Runs all available save participants for stored file working copies.
	 */
	runSaveParticipants(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void>;

	//#endregion


	//#region File operations

	/**
	 * Will create a resource with the provided optional contents, optionally overwriting any target.
	 *
	 * Working copy owners can listen to the `onWillRunWorkingCopyFileOperation` and
	 * `onDidRunWorkingCopyFileOperation` events to participate.
	 */
	create(operations: ICreateFileOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]>;

	/**
	 * Will create a folder and any parent folder that needs to be created.
	 *
	 * Working copy owners can listen to the `onWillRunWorkingCopyFileOperation` and
	 * `onDidRunWorkingCopyFileOperation` events to participate.
	 *
	 * Note: events will only be emitted for the provided resource, but not any
	 * parent folders that are being created as part of the operation.
	 */
	createFolder(operations: ICreateOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]>;

	/**
	 * Will move working copies matching the provided resources and corresponding children
	 * to the target resources using the associated file service for those resources.
	 *
	 * Working copy owners can listen to the `onWillRunWorkingCopyFileOperation` and
	 * `onDidRunWorkingCopyFileOperation` events to participate.
	 */
	move(operations: IMoveOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]>;

	/**
	 * Will copy working copies matching the provided resources and corresponding children
	 * to the target resources using the associated file service for those resources.
	 *
	 * Working copy owners can listen to the `onWillRunWorkingCopyFileOperation` and
	 * `onDidRunWorkingCopyFileOperation` events to participate.
	 */
	copy(operations: ICopyOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<readonly IFileStatWithMetadata[]>;

	/**
	 * Will delete working copies matching the provided resources and children
	 * using the associated file service for those resources.
	 *
	 * Working copy owners can listen to the `onWillRunWorkingCopyFileOperation` and
	 * `onDidRunWorkingCopyFileOperation` events to participate.
	 */
	delete(operations: IDeleteOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<void>;

	//#endregion


	//#region Path related

	/**
	 * Register a new provider for working copies based on a resource.
	 *
	 * @return a disposable that unregisters the provider.
	 */
	registerWorkingCopyProvider(provider: WorkingCopyProvider): IDisposable;

	/**
	 * Will return all working copies that are dirty matching the provided resource.
	 * If the resource is a folder and the scheme supports file operations, a working
	 * copy that is dirty and is a child of that folder will also be returned.
	 */
	getDirty(resource: URI): readonly IWorkingCopy[];

	//#endregion
}

export class WorkingCopyFileService extends Disposable implements IWorkingCopyFileService {

	declare readonly _serviceBrand: undefined;

	//#region Events

	private readonly _onWillRunWorkingCopyFileOperation = this._register(new AsyncEmitter<WorkingCopyFileEvent>());
	readonly onWillRunWorkingCopyFileOperation = this._onWillRunWorkingCopyFileOperation.event;

	private readonly _onDidFailWorkingCopyFileOperation = this._register(new AsyncEmitter<WorkingCopyFileEvent>());
	readonly onDidFailWorkingCopyFileOperation = this._onDidFailWorkingCopyFileOperation.event;

	private readonly _onDidRunWorkingCopyFileOperation = this._register(new AsyncEmitter<WorkingCopyFileEvent>());
	readonly onDidRunWorkingCopyFileOperation = this._onDidRunWorkingCopyFileOperation.event;

	//#endregion

	private correlationIds = 0;

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this.fileOperationParticipants = this._register(instantiationService.createInstance(WorkingCopyFileOperationParticipant));
		this.saveParticipants = this._register(instantiationService.createInstance(StoredFileWorkingCopySaveParticipant));

		// register a default working copy provider that uses the working copy service
		this._register(this.registerWorkingCopyProvider(resource => {
			return this.workingCopyService.workingCopies.filter(workingCopy => {
				if (this.fileService.hasProvider(resource)) {
					// only check for parents if the resource can be handled
					// by the file system where we then assume a folder like
					// path structure
					return this.uriIdentityService.extUri.isEqualOrParent(workingCopy.resource, resource);
				}

				return this.uriIdentityService.extUri.isEqual(workingCopy.resource, resource);
			});
		}));
	}


	//#region File operations

	create(operations: ICreateFileOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		return this.doCreateFileOrFolder(operations, true, token, undoInfo);
	}

	createFolder(operations: ICreateOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		return this.doCreateFileOrFolder(operations, false, token, undoInfo);
	}

	async doCreateFileOrFolder(operations: (ICreateFileOperation | ICreateOperation)[], isFile: boolean, token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		if (operations.length === 0) {
			return [];
		}

		// validate create operation before starting
		if (isFile) {
			const validateCreates = await Promises.settled(operations.map(operation => this.fileService.canCreateFile(operation.resource, { overwrite: operation.overwrite })));
			const error = validateCreates.find(validateCreate => validateCreate instanceof Error);
			if (error instanceof Error) {
				throw error;
			}
		}

		// file operation participant
		const files = operations.map(operation => ({ target: operation.resource }));
		await this.runFileOperationParticipants(files, FileOperation.CREATE, undoInfo, token);

		// before events
		const event = { correlationId: this.correlationIds++, operation: FileOperation.CREATE, files };
		await this._onWillRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

		// now actually create on disk
		let stats: IFileStatWithMetadata[];
		try {
			if (isFile) {
				stats = await Promises.settled(operations.map(operation => this.fileService.createFile(operation.resource, (operation as ICreateFileOperation).contents, { overwrite: operation.overwrite })));
			} else {
				stats = await Promises.settled(operations.map(operation => this.fileService.createFolder(operation.resource)));
			}
		} catch (error) {

			// error event
			await this._onDidFailWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

			throw error;
		}

		// after event
		await this._onDidRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

		return stats;
	}

	async move(operations: IMoveOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		return this.doMoveOrCopy(operations, true, token, undoInfo);
	}

	async copy(operations: ICopyOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		return this.doMoveOrCopy(operations, false, token, undoInfo);
	}

	private async doMoveOrCopy(operations: IMoveOperation[] | ICopyOperation[], move: boolean, token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<IFileStatWithMetadata[]> {
		const stats: IFileStatWithMetadata[] = [];

		// validate move/copy operation before starting
		for (const { file: { source, target }, overwrite } of operations) {
			const validateMoveOrCopy = await (move ? this.fileService.canMove(source, target, overwrite) : this.fileService.canCopy(source, target, overwrite));
			if (validateMoveOrCopy instanceof Error) {
				throw validateMoveOrCopy;
			}
		}

		// file operation participant
		const files = operations.map(o => o.file);
		await this.runFileOperationParticipants(files, move ? FileOperation.MOVE : FileOperation.COPY, undoInfo, token);

		// before event
		const event = { correlationId: this.correlationIds++, operation: move ? FileOperation.MOVE : FileOperation.COPY, files };
		await this._onWillRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

		try {
			for (const { file: { source, target }, overwrite } of operations) {
				// if source and target are not equal, handle dirty working copies
				// depending on the operation:
				// - move: revert both source and target (if any)
				// - copy: revert target (if any)
				if (!this.uriIdentityService.extUri.isEqual(source, target)) {
					const dirtyWorkingCopies = (move ? [...this.getDirty(source), ...this.getDirty(target)] : this.getDirty(target));
					await Promises.settled(dirtyWorkingCopies.map(dirtyWorkingCopy => dirtyWorkingCopy.revert({ soft: true })));
				}

				// now we can rename the source to target via file operation
				if (move) {
					stats.push(await this.fileService.move(source, target, overwrite));
				} else {
					stats.push(await this.fileService.copy(source, target, overwrite));
				}
			}
		} catch (error) {

			// error event
			await this._onDidFailWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

			throw error;
		}

		// after event
		await this._onDidRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

		return stats;
	}

	async delete(operations: IDeleteOperation[], token: CancellationToken, undoInfo?: IFileOperationUndoRedoInfo): Promise<void> {

		// validate delete operation before starting
		for (const operation of operations) {
			const validateDelete = await this.fileService.canDelete(operation.resource, { recursive: operation.recursive, useTrash: operation.useTrash });
			if (validateDelete instanceof Error) {
				throw validateDelete;
			}
		}

		// file operation participant
		const files = operations.map(operation => ({ target: operation.resource }));
		await this.runFileOperationParticipants(files, FileOperation.DELETE, undoInfo, token);

		// before events
		const event = { correlationId: this.correlationIds++, operation: FileOperation.DELETE, files };
		await this._onWillRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

		// check for any existing dirty working copies for the resource
		// and do a soft revert before deleting to be able to close
		// any opened editor with these working copies
		for (const operation of operations) {
			const dirtyWorkingCopies = this.getDirty(operation.resource);
			await Promises.settled(dirtyWorkingCopies.map(dirtyWorkingCopy => dirtyWorkingCopy.revert({ soft: true })));
		}

		// now actually delete from disk
		try {
			for (const operation of operations) {
				await this.fileService.del(operation.resource, { recursive: operation.recursive, useTrash: operation.useTrash });
			}
		} catch (error) {

			// error event
			await this._onDidFailWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);

			throw error;
		}

		// after event
		await this._onDidRunWorkingCopyFileOperation.fireAsync(event, CancellationToken.None /* intentional: we currently only forward cancellation to participants */);
	}

	//#endregion


	//#region File operation participants

	private readonly fileOperationParticipants: WorkingCopyFileOperationParticipant;

	addFileOperationParticipant(participant: IWorkingCopyFileOperationParticipant): IDisposable {
		return this.fileOperationParticipants.addFileOperationParticipant(participant);
	}

	private runFileOperationParticipants(files: SourceTargetPair[], operation: FileOperation, undoInfo: IFileOperationUndoRedoInfo | undefined, token: CancellationToken): Promise<void> {
		return this.fileOperationParticipants.participate(files, operation, undoInfo, token);
	}

	//#endregion

	//#region Save participants (stored file working copies only)

	private readonly saveParticipants: StoredFileWorkingCopySaveParticipant;

	get hasSaveParticipants(): boolean { return this.saveParticipants.length > 0; }

	addSaveParticipant(participant: IStoredFileWorkingCopySaveParticipant): IDisposable {
		return this.saveParticipants.addSaveParticipant(participant);
	}

	runSaveParticipants(workingCopy: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>, context: IStoredFileWorkingCopySaveParticipantContext, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		return this.saveParticipants.participate(workingCopy, context, progress, token);
	}

	//#endregion


	//#region Path related

	private readonly workingCopyProviders: WorkingCopyProvider[] = [];

	registerWorkingCopyProvider(provider: WorkingCopyProvider): IDisposable {
		const remove = insert(this.workingCopyProviders, provider);

		return toDisposable(remove);
	}

	getDirty(resource: URI): IWorkingCopy[] {
		const dirtyWorkingCopies = new Set<IWorkingCopy>();
		for (const provider of this.workingCopyProviders) {
			for (const workingCopy of provider(resource)) {
				if (workingCopy.isDirty()) {
					dirtyWorkingCopies.add(workingCopy);
				}
			}
		}

		return Array.from(dirtyWorkingCopies);
	}

	//#endregion
}

registerSingleton(IWorkingCopyFileService, WorkingCopyFileService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyHistory.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyHistory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { URI } from '../../../../base/common/uri.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { SaveSource } from '../../../common/editor.js';

export const IWorkingCopyHistoryService = createDecorator<IWorkingCopyHistoryService>('workingCopyHistoryService');

export interface IWorkingCopyHistoryEvent {

	/**
	 * The entry this event is about.
	 */
	readonly entry: IWorkingCopyHistoryEntry;
}

export interface IWorkingCopyHistoryEntry {

	/**
	 * Unique identifier of this entry for the working copy.
	 */
	readonly id: string;

	/**
	 * The associated working copy of this entry.
	 */
	readonly workingCopy: {
		readonly resource: URI;
		readonly name: string;
	};

	/**
	 * The location on disk of this history entry.
	 */
	readonly location: URI;

	/**
	 * The time when this history entry was created.
	 */
	timestamp: number;

	/**
	 * Associated source with the history entry.
	 */
	source: SaveSource;

	/**
	 * Optional additional metadata associated with the
	 * source that can help to describe the source.
	 */
	sourceDescription: string | undefined;
}

export interface IWorkingCopyHistoryEntryDescriptor {

	/**
	 * The associated resource of this history entry.
	 */
	readonly resource: URI;

	/**
	 * Optional associated timestamp to use for the
	 * history entry. If not provided, the current
	 * time will be used.
	 */
	readonly timestamp?: number;

	/**
	 * Optional source why the entry was added.
	 */
	readonly source?: SaveSource;
}

export interface IWorkingCopyHistoryService {

	readonly _serviceBrand: undefined;

	/**
	 * An event when an entry is added to the history.
	 */
	readonly onDidAddEntry: Event<IWorkingCopyHistoryEvent>;

	/**
	 * An event when an entry is changed in the history.
	 */
	readonly onDidChangeEntry: Event<IWorkingCopyHistoryEvent>;

	/**
	 * An event when an entry is replaced in the history.
	 */
	readonly onDidReplaceEntry: Event<IWorkingCopyHistoryEvent>;

	/**
	 * An event when an entry is removed from the history.
	 */
	readonly onDidRemoveEntry: Event<IWorkingCopyHistoryEvent>;

	/**
	 * An event when entries are moved in history.
	 */
	readonly onDidMoveEntries: Event<void>;

	/**
	 * An event when all entries are removed from the history.
	 */
	readonly onDidRemoveEntries: Event<void>;

	/**
	 * Adds a new entry to the history for the given working copy
	 * with an optional associated descriptor.
	 */
	addEntry(descriptor: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken): Promise<IWorkingCopyHistoryEntry | undefined>;

	/**
	 * Updates an entry in the local history if found.
	 */
	updateEntry(entry: IWorkingCopyHistoryEntry, properties: { source: SaveSource }, token: CancellationToken): Promise<void>;

	/**
	 * Removes an entry from the local history if found.
	 */
	removeEntry(entry: IWorkingCopyHistoryEntry, token: CancellationToken): Promise<boolean>;

	/**
	 * Moves entries that either match the `source` or are a child
	 * of `source` to the `target`.
	 *
	 * @returns a list of resources for entries that have moved.
	 */
	moveEntries(source: URI, target: URI): Promise<URI[]>;

	/**
	 * Gets all history entries for the provided resource.
	 */
	getEntries(resource: URI, token: CancellationToken): Promise<readonly IWorkingCopyHistoryEntry[]>;

	/**
	 * Returns all resources for which history entries exist.
	 */
	getAll(token: CancellationToken): Promise<readonly URI[]>;

	/**
	 * Removes all entries from all of local history.
	 */
	removeAll(token: CancellationToken): Promise<void>;
}

/**
 * A limit on how many I/O operations we allow to run in parallel.
 * We do not want to spam the file system with too many requests
 * at the same time, so we limit to a maximum degree of parallellism.
 */
export const MAX_PARALLEL_HISTORY_IO_OPS = 20;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyHistoryService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { ILifecycleService, LifecyclePhase, WillShutdownEvent } from '../../lifecycle/common/lifecycle.js';
import { WorkingCopyHistoryTracker } from './workingCopyHistoryTracker.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkingCopyHistoryEntry, IWorkingCopyHistoryEntryDescriptor, IWorkingCopyHistoryEvent, IWorkingCopyHistoryService, MAX_PARALLEL_HISTORY_IO_OPS } from './workingCopyHistory.js';
import { FileOperationError, FileOperationResult, IFileService, IFileStatWithMetadata } from '../../../../platform/files/common/files.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { URI } from '../../../../base/common/uri.js';
import { DeferredPromise, Limiter, RunOnceScheduler } from '../../../../base/common/async.js';
import { dirname, extname, isEqual, joinPath } from '../../../../base/common/resources.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { hash } from '../../../../base/common/hash.js';
import { indexOfPath, randomPath } from '../../../../base/common/extpath.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { SaveSource, SaveSourceRegistry } from '../../../common/editor.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { distinct } from '../../../../base/common/arrays.js';
import { escapeRegExpCharacters } from '../../../../base/common/strings.js';

interface ISerializedWorkingCopyHistoryModel {
	readonly version: number;
	readonly resource: string;
	readonly entries: ISerializedWorkingCopyHistoryModelEntry[];
}

interface ISerializedWorkingCopyHistoryModelEntry {
	readonly id: string;
	readonly timestamp: number;
	readonly source?: SaveSource;
	readonly sourceDescription?: string;
}

export interface IWorkingCopyHistoryModelOptions {

	/**
	 * Whether to flush when the model changes. If not
	 * configured, `model.store()` has to be called
	 * explicitly.
	 */
	flushOnChange: boolean;
}

export class WorkingCopyHistoryModel {

	static readonly ENTRIES_FILE = 'entries.json';

	private static readonly FILE_SAVED_SOURCE = SaveSourceRegistry.registerSource('default.source', localize('default.source', "File Saved"));

	private static readonly SETTINGS = {
		MAX_ENTRIES: 'workbench.localHistory.maxFileEntries',
		MERGE_PERIOD: 'workbench.localHistory.mergeWindow'
	};

	private entries: IWorkingCopyHistoryEntry[] = [];

	private whenResolved: Promise<void> | undefined = undefined;

	private workingCopyResource: URI | undefined = undefined;
	private workingCopyName: string | undefined = undefined;

	private historyEntriesFolder: URI | undefined = undefined;
	private historyEntriesListingFile: URI | undefined = undefined;

	private historyEntriesNameMatcher: RegExp | undefined = undefined;

	private versionId = 0;
	private storedVersionId = this.versionId;

	private readonly storeLimiter = new Limiter(1);

	constructor(
		workingCopyResource: URI,
		private readonly historyHome: URI,
		private readonly entryAddedEmitter: Emitter<IWorkingCopyHistoryEvent>,
		private readonly entryChangedEmitter: Emitter<IWorkingCopyHistoryEvent>,
		private readonly entryReplacedEmitter: Emitter<IWorkingCopyHistoryEvent>,
		private readonly entryRemovedEmitter: Emitter<IWorkingCopyHistoryEvent>,
		private readonly options: IWorkingCopyHistoryModelOptions,
		private readonly fileService: IFileService,
		private readonly labelService: ILabelService,
		private readonly logService: ILogService,
		private readonly configurationService: IConfigurationService
	) {
		this.setWorkingCopy(workingCopyResource);
	}

	private setWorkingCopy(workingCopyResource: URI): void {

		// Update working copy
		this.workingCopyResource = workingCopyResource;
		this.workingCopyName = this.labelService.getUriBasenameLabel(workingCopyResource);

		this.historyEntriesNameMatcher = new RegExp(`[A-Za-z0-9]{4}${escapeRegExpCharacters(extname(workingCopyResource))}`);

		// Update locations
		this.historyEntriesFolder = this.toHistoryEntriesFolder(this.historyHome, workingCopyResource);
		this.historyEntriesListingFile = joinPath(this.historyEntriesFolder, WorkingCopyHistoryModel.ENTRIES_FILE);

		// Reset entries and resolved cache
		this.entries = [];
		this.whenResolved = undefined;
	}

	private toHistoryEntriesFolder(historyHome: URI, workingCopyResource: URI): URI {
		return joinPath(historyHome, hash(workingCopyResource.toString()).toString(16));
	}

	async addEntry(source = WorkingCopyHistoryModel.FILE_SAVED_SOURCE, sourceDescription: string | undefined = undefined, timestamp = Date.now(), token: CancellationToken): Promise<IWorkingCopyHistoryEntry> {
		let entryToReplace: IWorkingCopyHistoryEntry | undefined = undefined;

		// Figure out if the last entry should be replaced based
		// on settings that can define a interval for when an
		// entry is not added as new entry but should replace.
		// However, when save source is different, never replace.
		const lastEntry = this.entries.at(-1);
		if (lastEntry && lastEntry.source === source) {
			const configuredReplaceInterval = this.configurationService.getValue<number>(WorkingCopyHistoryModel.SETTINGS.MERGE_PERIOD, { resource: this.workingCopyResource });
			if (timestamp - lastEntry.timestamp <= (configuredReplaceInterval * 1000 /* convert to millies */)) {
				entryToReplace = lastEntry;
			}
		}

		let entry: IWorkingCopyHistoryEntry;

		// Replace lastest entry in history
		if (entryToReplace) {
			entry = await this.doReplaceEntry(entryToReplace, source, sourceDescription, timestamp, token);
		}

		// Add entry to history
		else {
			entry = await this.doAddEntry(source, sourceDescription, timestamp, token);
		}

		// Flush now if configured
		if (this.options.flushOnChange && !token.isCancellationRequested) {
			await this.store(token);
		}

		return entry;
	}

	private async doAddEntry(source: SaveSource, sourceDescription: string | undefined = undefined, timestamp: number, token: CancellationToken): Promise<IWorkingCopyHistoryEntry> {
		const workingCopyResource = assertReturnsDefined(this.workingCopyResource);
		const workingCopyName = assertReturnsDefined(this.workingCopyName);
		const historyEntriesFolder = assertReturnsDefined(this.historyEntriesFolder);

		// Perform a fast clone operation with minimal overhead to a new random location
		const id = `${randomPath(undefined, undefined, 4)}${extname(workingCopyResource)}`;
		const location = joinPath(historyEntriesFolder, id);
		await this.fileService.cloneFile(workingCopyResource, location);

		// Add to list of entries
		const entry: IWorkingCopyHistoryEntry = {
			id,
			workingCopy: { resource: workingCopyResource, name: workingCopyName },
			location,
			timestamp,
			source,
			sourceDescription
		};
		this.entries.push(entry);

		// Update version ID of model to use for storing later
		this.versionId++;

		// Events
		this.entryAddedEmitter.fire({ entry });

		return entry;
	}

	private async doReplaceEntry(entry: IWorkingCopyHistoryEntry, source: SaveSource, sourceDescription: string | undefined = undefined, timestamp: number, token: CancellationToken): Promise<IWorkingCopyHistoryEntry> {
		const workingCopyResource = assertReturnsDefined(this.workingCopyResource);

		// Perform a fast clone operation with minimal overhead to the existing location
		await this.fileService.cloneFile(workingCopyResource, entry.location);

		// Update entry
		entry.source = source;
		entry.sourceDescription = sourceDescription;
		entry.timestamp = timestamp;

		// Update version ID of model to use for storing later
		this.versionId++;

		// Events
		this.entryReplacedEmitter.fire({ entry });

		return entry;
	}

	async removeEntry(entry: IWorkingCopyHistoryEntry, token: CancellationToken): Promise<boolean> {

		// Make sure to await resolving when removing entries
		await this.resolveEntriesOnce();

		if (token.isCancellationRequested) {
			return false;
		}

		const index = this.entries.indexOf(entry);
		if (index === -1) {
			return false;
		}

		// Delete from disk
		await this.deleteEntry(entry);

		// Remove from model
		this.entries.splice(index, 1);

		// Update version ID of model to use for storing later
		this.versionId++;

		// Events
		this.entryRemovedEmitter.fire({ entry });

		// Flush now if configured
		if (this.options.flushOnChange && !token.isCancellationRequested) {
			await this.store(token);
		}

		return true;
	}

	async updateEntry(entry: IWorkingCopyHistoryEntry, properties: { source: SaveSource }, token: CancellationToken): Promise<void> {

		// Make sure to await resolving when updating entries
		await this.resolveEntriesOnce();

		if (token.isCancellationRequested) {
			return;
		}

		const index = this.entries.indexOf(entry);
		if (index === -1) {
			return;
		}

		// Update entry
		entry.source = properties.source;

		// Update version ID of model to use for storing later
		this.versionId++;

		// Events
		this.entryChangedEmitter.fire({ entry });

		// Flush now if configured
		if (this.options.flushOnChange && !token.isCancellationRequested) {
			await this.store(token);
		}
	}

	async getEntries(): Promise<readonly IWorkingCopyHistoryEntry[]> {

		// Make sure to await resolving when all entries are asked for
		await this.resolveEntriesOnce();

		// Return as many entries as configured by user settings
		const configuredMaxEntries = this.configurationService.getValue<number>(WorkingCopyHistoryModel.SETTINGS.MAX_ENTRIES, { resource: this.workingCopyResource });
		if (this.entries.length > configuredMaxEntries) {
			return this.entries.slice(this.entries.length - configuredMaxEntries);
		}

		return this.entries;
	}

	async hasEntries(skipResolve: boolean): Promise<boolean> {

		// Make sure to await resolving unless explicitly skipped
		if (!skipResolve) {
			await this.resolveEntriesOnce();
		}

		return this.entries.length > 0;
	}

	private resolveEntriesOnce(): Promise<void> {
		if (!this.whenResolved) {
			this.whenResolved = this.doResolveEntries();
		}

		return this.whenResolved;
	}

	private async doResolveEntries(): Promise<void> {

		// Resolve from disk
		const entries = await this.resolveEntriesFromDisk();

		// We now need to merge our in-memory entries with the
		// entries we have found on disk because it is possible
		// that new entries have been added before the entries
		// listing file was updated
		for (const entry of this.entries) {
			entries.set(entry.id, entry);
		}

		// Set as entries, sorted by timestamp
		this.entries = Array.from(entries.values()).sort((entryA, entryB) => entryA.timestamp - entryB.timestamp);
	}

	private async resolveEntriesFromDisk(): Promise<Map<string /* ID */, IWorkingCopyHistoryEntry>> {
		const workingCopyResource = assertReturnsDefined(this.workingCopyResource);
		const workingCopyName = assertReturnsDefined(this.workingCopyName);

		const [entryListing, entryStats] = await Promise.all([

			// Resolve entries listing file
			this.readEntriesFile(),

			// Resolve children of history folder
			this.readEntriesFolder()
		]);

		// Add from raw folder children
		const entries = new Map<string, IWorkingCopyHistoryEntry>();
		if (entryStats) {
			for (const entryStat of entryStats) {
				entries.set(entryStat.name, {
					id: entryStat.name,
					workingCopy: { resource: workingCopyResource, name: workingCopyName },
					location: entryStat.resource,
					timestamp: entryStat.mtime,
					source: WorkingCopyHistoryModel.FILE_SAVED_SOURCE,
					sourceDescription: undefined
				});
			}
		}

		// Update from listing (to have more specific metadata)
		if (entryListing) {
			for (const entry of entryListing.entries) {
				const existingEntry = entries.get(entry.id);
				if (existingEntry) {
					entries.set(entry.id, {
						...existingEntry,
						timestamp: entry.timestamp,
						source: entry.source ?? existingEntry.source,
						sourceDescription: entry.sourceDescription ?? existingEntry.sourceDescription
					});
				}
			}
		}

		return entries;
	}

	async moveEntries(target: WorkingCopyHistoryModel, source: SaveSource, token: CancellationToken): Promise<void> {
		const timestamp = Date.now();
		const sourceDescription = this.labelService.getUriLabel(assertReturnsDefined(this.workingCopyResource));

		// Move all entries into the target folder so that we preserve
		// any existing history entries that might already be present

		const sourceHistoryEntriesFolder = assertReturnsDefined(this.historyEntriesFolder);
		const targetHistoryEntriesFolder = assertReturnsDefined(target.historyEntriesFolder);
		try {
			for (const entry of this.entries) {
				await this.fileService.move(entry.location, joinPath(targetHistoryEntriesFolder, entry.id), true);
			}
			await this.fileService.del(sourceHistoryEntriesFolder, { recursive: true });
		} catch (error) {
			if (!this.isFileNotFound(error)) {
				try {
					// In case of an error (unless not found), fallback to moving the entire folder
					await this.fileService.move(sourceHistoryEntriesFolder, targetHistoryEntriesFolder, true);
				} catch (error) {
					if (!this.isFileNotFound(error)) {
						this.traceError(error);
					}
				}
			}
		}

		// Merge our entries with target entries before updating associated working copy
		const allEntries = distinct([...this.entries, ...target.entries], entry => entry.id).sort((entryA, entryB) => entryA.timestamp - entryB.timestamp);

		// Update our associated working copy
		const targetWorkingCopyResource = assertReturnsDefined(target.workingCopyResource);
		this.setWorkingCopy(targetWorkingCopyResource);

		// Restore our entries and ensure correct metadata
		const targetWorkingCopyName = assertReturnsDefined(target.workingCopyName);
		for (const entry of allEntries) {
			this.entries.push({
				id: entry.id,
				location: joinPath(targetHistoryEntriesFolder, entry.id),
				source: entry.source,
				sourceDescription: entry.sourceDescription,
				timestamp: entry.timestamp,
				workingCopy: {
					resource: targetWorkingCopyResource,
					name: targetWorkingCopyName
				}
			});
		}

		// Add entry for the move
		await this.addEntry(source, sourceDescription, timestamp, token);

		// Store model again to updated location
		await this.store(token);
	}

	async store(token: CancellationToken): Promise<void> {
		if (!this.shouldStore()) {
			return;
		}

		// Use a `Limiter` to prevent multiple `store` operations
		// potentially running at the same time

		await this.storeLimiter.queue(async () => {
			if (token.isCancellationRequested || !this.shouldStore()) {
				return;
			}

			return this.doStore(token);
		});
	}

	private shouldStore(): boolean {
		return this.storedVersionId !== this.versionId;
	}

	private async doStore(token: CancellationToken): Promise<void> {
		const historyEntriesFolder = assertReturnsDefined(this.historyEntriesFolder);

		// Make sure to await resolving when persisting
		await this.resolveEntriesOnce();

		if (token.isCancellationRequested) {
			return undefined;
		}

		// Cleanup based on max-entries setting
		await this.cleanUpEntries();

		// Without entries, remove the history folder
		const storedVersion = this.versionId;
		if (this.entries.length === 0) {
			try {
				await this.fileService.del(historyEntriesFolder, { recursive: true });
			} catch (error) {
				this.traceError(error);
			}
		}

		// If we still have entries, update the entries meta file
		else {
			await this.writeEntriesFile();
		}

		// Mark as stored version
		this.storedVersionId = storedVersion;
	}

	private async cleanUpEntries(): Promise<void> {
		const configuredMaxEntries = this.configurationService.getValue<number>(WorkingCopyHistoryModel.SETTINGS.MAX_ENTRIES, { resource: this.workingCopyResource });
		if (this.entries.length <= configuredMaxEntries) {
			return; // nothing to cleanup
		}

		const entriesToDelete = this.entries.slice(0, this.entries.length - configuredMaxEntries);
		const entriesToKeep = this.entries.slice(this.entries.length - configuredMaxEntries);

		// Delete entries from disk as instructed
		for (const entryToDelete of entriesToDelete) {
			await this.deleteEntry(entryToDelete);
		}

		// Make sure to update our in-memory model as well
		// because it will be persisted right after
		this.entries = entriesToKeep;

		// Events
		for (const entry of entriesToDelete) {
			this.entryRemovedEmitter.fire({ entry });
		}
	}

	private async deleteEntry(entry: IWorkingCopyHistoryEntry): Promise<void> {
		try {
			await this.fileService.del(entry.location);
		} catch (error) {
			this.traceError(error);
		}
	}

	private async writeEntriesFile(): Promise<void> {
		const workingCopyResource = assertReturnsDefined(this.workingCopyResource);
		const historyEntriesListingFile = assertReturnsDefined(this.historyEntriesListingFile);

		const serializedModel: ISerializedWorkingCopyHistoryModel = {
			version: 1,
			resource: workingCopyResource.toString(),
			entries: this.entries.map(entry => {
				return {
					id: entry.id,
					source: entry.source !== WorkingCopyHistoryModel.FILE_SAVED_SOURCE ? entry.source : undefined,
					sourceDescription: entry.sourceDescription,
					timestamp: entry.timestamp
				};
			})
		};

		await this.fileService.writeFile(historyEntriesListingFile, VSBuffer.fromString(JSON.stringify(serializedModel)));
	}

	private async readEntriesFile(): Promise<ISerializedWorkingCopyHistoryModel | undefined> {
		const historyEntriesListingFile = assertReturnsDefined(this.historyEntriesListingFile);

		let serializedModel: ISerializedWorkingCopyHistoryModel | undefined = undefined;
		try {
			serializedModel = JSON.parse((await this.fileService.readFile(historyEntriesListingFile)).value.toString());
		} catch (error) {
			if (!this.isFileNotFound(error)) {
				this.traceError(error);
			}
		}

		return serializedModel;
	}

	private async readEntriesFolder(): Promise<IFileStatWithMetadata[] | undefined> {
		const historyEntriesFolder = assertReturnsDefined(this.historyEntriesFolder);
		const historyEntriesNameMatcher = assertReturnsDefined(this.historyEntriesNameMatcher);

		let rawEntries: IFileStatWithMetadata[] | undefined = undefined;

		// Resolve children of folder on disk
		try {
			rawEntries = (await this.fileService.resolve(historyEntriesFolder, { resolveMetadata: true })).children;
		} catch (error) {
			if (!this.isFileNotFound(error)) {
				this.traceError(error);
			}
		}

		if (!rawEntries) {
			return undefined;
		}

		// Skip entries that do not seem to have valid file name
		return rawEntries.filter(entry =>
			!isEqual(entry.resource, this.historyEntriesListingFile) && // not the listings file
			historyEntriesNameMatcher.test(entry.name)					// matching our expected file pattern for entries
		);
	}

	private isFileNotFound(error: unknown): boolean {
		return error instanceof FileOperationError && error.fileOperationResult === FileOperationResult.FILE_NOT_FOUND;
	}

	private traceError(error: Error): void {
		this.logService.trace('[Working Copy History Service]', error);
	}
}

export abstract class WorkingCopyHistoryService extends Disposable implements IWorkingCopyHistoryService {

	private static readonly FILE_MOVED_SOURCE = SaveSourceRegistry.registerSource('moved.source', localize('moved.source', "File Moved"));
	private static readonly FILE_RENAMED_SOURCE = SaveSourceRegistry.registerSource('renamed.source', localize('renamed.source', "File Renamed"));

	declare readonly _serviceBrand: undefined;

	protected readonly _onDidAddEntry = this._register(new Emitter<IWorkingCopyHistoryEvent>());
	readonly onDidAddEntry = this._onDidAddEntry.event;

	protected readonly _onDidChangeEntry = this._register(new Emitter<IWorkingCopyHistoryEvent>());
	readonly onDidChangeEntry = this._onDidChangeEntry.event;

	protected readonly _onDidReplaceEntry = this._register(new Emitter<IWorkingCopyHistoryEvent>());
	readonly onDidReplaceEntry = this._onDidReplaceEntry.event;

	private readonly _onDidMoveEntries = this._register(new Emitter<void>());
	readonly onDidMoveEntries = this._onDidMoveEntries.event;

	protected readonly _onDidRemoveEntry = this._register(new Emitter<IWorkingCopyHistoryEvent>());
	readonly onDidRemoveEntry = this._onDidRemoveEntry.event;

	private readonly _onDidRemoveEntries = this._register(new Emitter<void>());
	readonly onDidRemoveEntries = this._onDidRemoveEntries.event;

	private readonly localHistoryHome = new DeferredPromise<URI>();

	protected readonly models = new ResourceMap<WorkingCopyHistoryModel>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	constructor(
		@IFileService protected readonly fileService: IFileService,
		@IRemoteAgentService protected readonly remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService protected readonly uriIdentityService: IUriIdentityService,
		@ILabelService protected readonly labelService: ILabelService,
		@ILogService protected readonly logService: ILogService,
		@IConfigurationService protected readonly configurationService: IConfigurationService
	) {
		super();

		this.resolveLocalHistoryHome();
	}

	private async resolveLocalHistoryHome(): Promise<void> {
		let historyHome: URI | undefined = undefined;

		// Prefer history to be stored in the remote if we are connected to a remote
		try {
			const remoteEnv = await this.remoteAgentService.getEnvironment();
			if (remoteEnv) {
				historyHome = remoteEnv.localHistoryHome;
			}
		} catch (error) {
			this.logService.trace(error); // ignore and fallback to local
		}

		// But fallback to local if there is no remote
		if (!historyHome) {
			historyHome = this.environmentService.localHistoryHome;
		}

		this.localHistoryHome.complete(historyHome);
	}

	async moveEntries(source: URI, target: URI): Promise<URI[]> {
		const limiter = new Limiter<URI>(MAX_PARALLEL_HISTORY_IO_OPS);
		const promises: Promise<URI>[] = [];

		for (const [resource, model] of this.models) {
			if (!this.uriIdentityService.extUri.isEqualOrParent(resource, source)) {
				continue; // model does not match moved resource
			}

			// Determine new resulting target resource
			let targetResource: URI;
			if (this.uriIdentityService.extUri.isEqual(source, resource)) {
				targetResource = target; // file got moved
			} else {
				const index = indexOfPath(resource.path, source.path);
				targetResource = joinPath(target, resource.path.substr(index + source.path.length + 1)); // parent folder got moved
			}

			// Figure out save source
			let saveSource: SaveSource;
			if (this.uriIdentityService.extUri.isEqual(dirname(resource), dirname(targetResource))) {
				saveSource = WorkingCopyHistoryService.FILE_RENAMED_SOURCE;
			} else {
				saveSource = WorkingCopyHistoryService.FILE_MOVED_SOURCE;
			}

			// Move entries to target queued
			promises.push(limiter.queue(() => this.doMoveEntries(model, saveSource, resource, targetResource)));
		}

		if (!promises.length) {
			return [];
		}

		// Await move operations
		const resources = await Promise.all(promises);

		// Events
		this._onDidMoveEntries.fire();

		return resources;
	}

	private async doMoveEntries(source: WorkingCopyHistoryModel, saveSource: SaveSource, sourceWorkingCopyResource: URI, targetWorkingCopyResource: URI): Promise<URI> {

		// Move to target via model
		const target = await this.getModel(targetWorkingCopyResource);
		await source.moveEntries(target, saveSource, CancellationToken.None);

		// Update model in our map
		this.models.delete(sourceWorkingCopyResource);
		this.models.set(targetWorkingCopyResource, source);

		return targetWorkingCopyResource;
	}

	async addEntry({ resource, source, timestamp }: IWorkingCopyHistoryEntryDescriptor, token: CancellationToken): Promise<IWorkingCopyHistoryEntry | undefined> {
		if (!this.fileService.hasProvider(resource)) {
			return undefined; // we require the working copy resource to be file service accessible
		}

		// Resolve history model for working copy
		const model = await this.getModel(resource);
		if (token.isCancellationRequested) {
			return undefined;
		}

		// Add to model
		return model.addEntry(source, undefined, timestamp, token);
	}

	async updateEntry(entry: IWorkingCopyHistoryEntry, properties: { source: SaveSource }, token: CancellationToken): Promise<void> {

		// Resolve history model for working copy
		const model = await this.getModel(entry.workingCopy.resource);
		if (token.isCancellationRequested) {
			return;
		}

		// Rename in model
		return model.updateEntry(entry, properties, token);
	}

	async removeEntry(entry: IWorkingCopyHistoryEntry, token: CancellationToken): Promise<boolean> {

		// Resolve history model for working copy
		const model = await this.getModel(entry.workingCopy.resource);
		if (token.isCancellationRequested) {
			return false;
		}

		// Remove from model
		return model.removeEntry(entry, token);
	}

	async removeAll(token: CancellationToken): Promise<void> {
		const historyHome = await this.localHistoryHome.p;
		if (token.isCancellationRequested) {
			return;
		}

		// Clear models
		this.models.clear();

		// Remove from disk
		await this.fileService.del(historyHome, { recursive: true });

		// Events
		this._onDidRemoveEntries.fire();
	}

	async getEntries(resource: URI, token: CancellationToken): Promise<readonly IWorkingCopyHistoryEntry[]> {
		const model = await this.getModel(resource);
		if (token.isCancellationRequested) {
			return [];
		}

		const entries = await model.getEntries();
		return entries ?? [];
	}

	async getAll(token: CancellationToken): Promise<readonly URI[]> {
		const historyHome = await this.localHistoryHome.p;
		if (token.isCancellationRequested) {
			return [];
		}

		const all = new ResourceMap<true>();

		// Fill in all known model resources (they might not have yet persisted to disk)
		for (const [resource, model] of this.models) {
			const hasInMemoryEntries = await model.hasEntries(true /* skip resolving because we resolve below from disk */);
			if (hasInMemoryEntries) {
				all.set(resource, true);
			}
		}

		// Resolve all other resources by iterating the history home folder
		try {
			const resolvedHistoryHome = await this.fileService.resolve(historyHome);
			if (resolvedHistoryHome.children) {
				const limiter = new Limiter(MAX_PARALLEL_HISTORY_IO_OPS);
				const promises = [];

				for (const child of resolvedHistoryHome.children) {
					promises.push(limiter.queue(async () => {
						if (token.isCancellationRequested) {
							return;
						}

						try {
							const serializedModel: ISerializedWorkingCopyHistoryModel = JSON.parse((await this.fileService.readFile(joinPath(child.resource, WorkingCopyHistoryModel.ENTRIES_FILE))).value.toString());
							if (serializedModel.entries.length > 0) {
								all.set(URI.parse(serializedModel.resource), true);
							}
						} catch (error) {
							// ignore - model might be missing or corrupt, but we need it
						}
					}));
				}

				await Promise.all(promises);
			}
		} catch (error) {
			// ignore - history might be entirely empty
		}

		return Array.from(all.keys());
	}

	private async getModel(resource: URI): Promise<WorkingCopyHistoryModel> {
		const historyHome = await this.localHistoryHome.p;

		let model = this.models.get(resource);
		if (!model) {
			model = new WorkingCopyHistoryModel(resource, historyHome, this._onDidAddEntry, this._onDidChangeEntry, this._onDidReplaceEntry, this._onDidRemoveEntry, this.getModelOptions(), this.fileService, this.labelService, this.logService, this.configurationService);
			this.models.set(resource, model);
		}

		return model;
	}

	protected abstract getModelOptions(): IWorkingCopyHistoryModelOptions;

}

export class NativeWorkingCopyHistoryService extends WorkingCopyHistoryService {

	private static readonly STORE_ALL_INTERVAL = 5 * 60 * 1000; // 5min

	private readonly isRemotelyStored = typeof this.environmentService.remoteAuthority === 'string';

	private readonly storeAllCts = this._register(new CancellationTokenSource());
	private readonly storeAllScheduler = this._register(new RunOnceScheduler(() => this.storeAll(this.storeAllCts.token), NativeWorkingCopyHistoryService.STORE_ALL_INTERVAL));

	constructor(
		@IFileService fileService: IFileService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILabelService labelService: ILabelService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@ILogService logService: ILogService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super(fileService, remoteAgentService, environmentService, uriIdentityService, labelService, logService, configurationService);

		this.registerListeners();
	}

	private registerListeners(): void {
		if (!this.isRemotelyStored) {

			// Local: persist all on shutdown
			this._register(this.lifecycleService.onWillShutdown(e => this.onWillShutdown(e)));

			// Local: schedule persist on change
			this._register(Event.any(this.onDidAddEntry, this.onDidChangeEntry, this.onDidReplaceEntry, this.onDidRemoveEntry)(() => this.onDidChangeModels()));
		}
	}

	protected getModelOptions(): IWorkingCopyHistoryModelOptions {
		return { flushOnChange: this.isRemotelyStored /* because the connection might drop anytime */ };
	}

	private onWillShutdown(e: WillShutdownEvent): void {

		// Dispose the scheduler...
		this.storeAllScheduler.dispose();
		this.storeAllCts.dispose(true);

		// ...because we now explicitly store all models
		e.join(this.storeAll(e.token), { id: 'join.workingCopyHistory', label: localize('join.workingCopyHistory', "Saving local history") });
	}

	private onDidChangeModels(): void {
		if (!this.storeAllScheduler.isScheduled()) {
			this.storeAllScheduler.schedule();
		}
	}

	private async storeAll(token: CancellationToken): Promise<void> {
		const limiter = new Limiter(MAX_PARALLEL_HISTORY_IO_OPS);
		const promises = [];

		const models = Array.from(this.models.values());
		for (const model of models) {
			promises.push(limiter.queue(async () => {
				if (token.isCancellationRequested) {
					return;
				}

				try {
					await model.store(token);
				} catch (error) {
					this.logService.trace(error);
				}
			}));
		}

		await Promise.all(promises);
	}
}

// Register History Tracker
Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(WorkingCopyHistoryTracker, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyHistoryTracker.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyHistoryTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { GlobalIdleValue, Limiter } from '../../../../base/common/async.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IUndoRedoService } from '../../../../platform/undoRedo/common/undoRedo.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { SaveSource, SaveSourceRegistry } from '../../../common/editor.js';
import { IPathService } from '../../path/common/pathService.js';
import { isStoredFileWorkingCopySaveEvent, IStoredFileWorkingCopyModel } from './storedFileWorkingCopy.js';
import { IStoredFileWorkingCopySaveEvent } from './storedFileWorkingCopyManager.js';
import { IWorkingCopy } from './workingCopy.js';
import { IWorkingCopyHistoryService, MAX_PARALLEL_HISTORY_IO_OPS } from './workingCopyHistory.js';
import { IWorkingCopySaveEvent, IWorkingCopyService } from './workingCopyService.js';
import { Schemas } from '../../../../base/common/network.js';
import { ResourceGlobMatcher } from '../../../common/resources.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { FileOperation, FileOperationEvent, IFileOperationEventWithMetadata, IFileService, IFileStatWithMetadata } from '../../../../platform/files/common/files.js';

export class WorkingCopyHistoryTracker extends Disposable implements IWorkbenchContribution {

	private static readonly SETTINGS = {
		ENABLED: 'workbench.localHistory.enabled',
		SIZE_LIMIT: 'workbench.localHistory.maxFileSize',
		EXCLUDES: 'workbench.localHistory.exclude'
	};

	private static readonly UNDO_REDO_SAVE_SOURCE = SaveSourceRegistry.registerSource('undoRedo.source', localize('undoRedo.source', "Undo / Redo"));

	private readonly limiter = this._register(new Limiter(MAX_PARALLEL_HISTORY_IO_OPS));

	private readonly resourceExcludeMatcher = this._register(new GlobalIdleValue(() => {
		const matcher = this._register(new ResourceGlobMatcher(
			root => this.configurationService.getValue(WorkingCopyHistoryTracker.SETTINGS.EXCLUDES, { resource: root }),
			event => event.affectsConfiguration(WorkingCopyHistoryTracker.SETTINGS.EXCLUDES),
			this.contextService,
			this.configurationService
		));

		return matcher;
	}));

	private readonly pendingAddHistoryEntryOperations = new ResourceMap<CancellationTokenSource>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	private readonly workingCopyContentVersion = new ResourceMap<number>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));
	private readonly historyEntryContentVersion = new ResourceMap<number>(resource => this.uriIdentityService.extUri.getComparisonKey(resource));

	constructor(
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService,
		@IWorkingCopyHistoryService private readonly workingCopyHistoryService: IWorkingCopyHistoryService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IPathService private readonly pathService: IPathService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUndoRedoService private readonly undoRedoService: IUndoRedoService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService
	) {
		super();

		this.registerListeners();
	}

	private registerListeners() {

		// File Events
		this._register(this.fileService.onDidRunOperation(e => this.onDidRunFileOperation(e)));

		// Working Copy Events
		this._register(this.workingCopyService.onDidChangeContent(workingCopy => this.onDidChangeContent(workingCopy)));
		this._register(this.workingCopyService.onDidSave(e => this.onDidSave(e)));
	}

	private async onDidRunFileOperation(e: FileOperationEvent): Promise<void> {
		if (!this.shouldTrackHistoryFromFileOperationEvent(e)) {
			return; // return early for working copies we are not interested in
		}

		const source = e.resource;
		const target = e.target.resource;

		// Move working copy history entries for this file move event
		const resources = await this.workingCopyHistoryService.moveEntries(source, target);

		// Make sure to track the content version of each entry that
		// was moved in our map. This ensures that a subsequent save
		// without a content change does not add a redundant entry
		// (https://github.com/microsoft/vscode/issues/145881)
		for (const resource of resources) {
			const contentVersion = this.getContentVersion(resource);
			this.historyEntryContentVersion.set(resource, contentVersion);
		}
	}

	private onDidChangeContent(workingCopy: IWorkingCopy): void {

		// Increment content version ID for resource
		const contentVersionId = this.getContentVersion(workingCopy.resource);
		this.workingCopyContentVersion.set(workingCopy.resource, contentVersionId + 1);
	}

	private getContentVersion(resource: URI): number {
		return this.workingCopyContentVersion.get(resource) || 0;
	}

	private onDidSave(e: IWorkingCopySaveEvent): void {
		if (!this.shouldTrackHistoryFromSaveEvent(e)) {
			return; // return early for working copies we are not interested in
		}

		const contentVersion = this.getContentVersion(e.workingCopy.resource);
		if (this.historyEntryContentVersion.get(e.workingCopy.resource) === contentVersion) {
			return; // return early when content version already has associated history entry
		}

		// Cancel any previous operation for this resource
		this.pendingAddHistoryEntryOperations.get(e.workingCopy.resource)?.dispose(true);

		// Create new cancellation token support and remember
		const cts = new CancellationTokenSource();
		this.pendingAddHistoryEntryOperations.set(e.workingCopy.resource, cts);

		// Queue new operation to add to history
		this.limiter.queue(async () => {
			if (cts.token.isCancellationRequested) {
				return;
			}

			const contentVersion = this.getContentVersion(e.workingCopy.resource);

			// Figure out source of save operation if not provided already
			let source = e.source;
			if (!e.source) {
				source = this.resolveSourceFromUndoRedo(e);
			}

			// Add entry
			await this.workingCopyHistoryService.addEntry({ resource: e.workingCopy.resource, source, timestamp: e.stat.mtime }, cts.token);

			// Remember content version as being added to history
			this.historyEntryContentVersion.set(e.workingCopy.resource, contentVersion);

			if (cts.token.isCancellationRequested) {
				return;
			}

			// Finally remove from pending operations
			this.pendingAddHistoryEntryOperations.delete(e.workingCopy.resource);
		});
	}

	private resolveSourceFromUndoRedo(e: IWorkingCopySaveEvent): SaveSource | undefined {
		const lastStackElement = this.undoRedoService.getLastElement(e.workingCopy.resource);
		if (lastStackElement) {
			if (lastStackElement.code === 'undoredo.textBufferEdit') {
				return undefined; // ignore any unspecific stack element that resulted just from typing
			}

			return lastStackElement.label;
		}

		const allStackElements = this.undoRedoService.getElements(e.workingCopy.resource);
		if (allStackElements.future.length > 0 || allStackElements.past.length > 0) {
			return WorkingCopyHistoryTracker.UNDO_REDO_SAVE_SOURCE;
		}

		return undefined;
	}

	private shouldTrackHistoryFromSaveEvent(e: IWorkingCopySaveEvent): e is IStoredFileWorkingCopySaveEvent<IStoredFileWorkingCopyModel> {
		if (!isStoredFileWorkingCopySaveEvent(e)) {
			return false; // only support working copies that are backed by stored files
		}

		return this.shouldTrackHistory(e.workingCopy.resource, e.stat);
	}

	private shouldTrackHistoryFromFileOperationEvent(e: FileOperationEvent): e is IFileOperationEventWithMetadata {
		if (!e.isOperation(FileOperation.MOVE)) {
			return false; // only interested in move operations
		}

		return this.shouldTrackHistory(e.target.resource, e.target);
	}

	private shouldTrackHistory(resource: URI, stat: IFileStatWithMetadata): boolean {
		if (
			resource.scheme !== this.pathService.defaultUriScheme && 	// track history for all workspace resources
			resource.scheme !== Schemas.vscodeUserData &&				// track history for all settings
			resource.scheme !== Schemas.inMemory	 					// track history for tests that use in-memory
		) {
			return false; // do not support unknown resources
		}

		const configuredMaxFileSizeInBytes = 1024 * this.configurationService.getValue<number>(WorkingCopyHistoryTracker.SETTINGS.SIZE_LIMIT, { resource });
		if (stat.size > configuredMaxFileSizeInBytes) {
			return false; // only track files that are not too large
		}

		if (this.configurationService.getValue(WorkingCopyHistoryTracker.SETTINGS.ENABLED, { resource }) === false) {
			return false; // do not track when history is disabled
		}

		// Finally check for exclude setting
		return !this.resourceExcludeMatcher.value.matches(resource);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/common/workingCopyService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/common/workingCopyService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, IDisposable, toDisposable, DisposableStore, DisposableMap } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IWorkingCopy, IWorkingCopyIdentifier, IWorkingCopySaveEvent as IBaseWorkingCopySaveEvent } from './workingCopy.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';

export const IWorkingCopyService = createDecorator<IWorkingCopyService>('workingCopyService');

export interface IWorkingCopySaveEvent extends IBaseWorkingCopySaveEvent {

	/**
	 * The working copy that was saved.
	 */
	readonly workingCopy: IWorkingCopy;
}

export interface IWorkingCopyService {

	readonly _serviceBrand: undefined;


	//#region Events

	/**
	 * An event for when a working copy was registered.
	 */
	readonly onDidRegister: Event<IWorkingCopy>;

	/**
	 * An event for when a working copy was unregistered.
	 */
	readonly onDidUnregister: Event<IWorkingCopy>;

	/**
	 * An event for when a working copy dirty state changed.
	 */
	readonly onDidChangeDirty: Event<IWorkingCopy>;

	/**
	 * An event for when a working copy's content changed.
	 */
	readonly onDidChangeContent: Event<IWorkingCopy>;

	/**
	 * An event for when a working copy was saved.
	 */
	readonly onDidSave: Event<IWorkingCopySaveEvent>;

	//#endregion


	//#region Dirty Tracking

	/**
	 * The number of dirty working copies that are registered.
	 */
	readonly dirtyCount: number;

	/**
	 * All dirty working copies that are registered.
	 */
	readonly dirtyWorkingCopies: readonly IWorkingCopy[];

	/**
	 * The number of modified working copies that are registered,
	 * including scratchpads, which are never dirty.
	 */
	readonly modifiedCount: number;

	/**
	 * All working copies with unsaved changes,
	 * including scratchpads, which are never dirty.
	 */
	readonly modifiedWorkingCopies: readonly IWorkingCopy[];

	/**
	 * Whether there is any registered working copy that is dirty.
	 */
	readonly hasDirty: boolean;

	/**
	 * Figure out if working copies with the given
	 * resource are dirty or not.
	 *
	 * @param resource the URI of the working copy
	 * @param typeId optional type identifier to only
	 * consider working copies of that type.
	 */
	isDirty(resource: URI, typeId?: string): boolean;

	//#endregion


	//#region Registry

	/**
	 * All working copies that are registered.
	 */
	readonly workingCopies: readonly IWorkingCopy[];

	/**
	 * Register a new working copy with the service. This method will
	 * throw if you try to register a working copy on a resource that
	 * has already been registered.
	 *
	 * Overall there can only ever be 1 working copy with the same
	 * resource.
	 */
	registerWorkingCopy(workingCopy: IWorkingCopy): IDisposable;

	/**
	 * Whether a working copy with the given resource or identifier
	 * exists.
	 */
	has(identifier: IWorkingCopyIdentifier): boolean;
	has(resource: URI): boolean;

	/**
	 * Returns a working copy with the given identifier or `undefined`
	 * if no such working copy exists.
	 */
	get(identifier: IWorkingCopyIdentifier): IWorkingCopy | undefined;

	/**
	 * Returns all working copies with the given resource or `undefined`
	 * if no such working copy exists.
	 */
	getAll(resource: URI): readonly IWorkingCopy[] | undefined;

	//#endregion
}

class WorkingCopyLeakError extends Error {

	constructor(message: string, stack: string) {
		super(message);

		this.name = 'WorkingCopyLeakError';
		this.stack = stack;
	}
}

export class WorkingCopyService extends Disposable implements IWorkingCopyService {

	declare readonly _serviceBrand: undefined;

	//#region Events

	private readonly _onDidRegister = this._register(new Emitter<IWorkingCopy>());
	readonly onDidRegister = this._onDidRegister.event;

	private readonly _onDidUnregister = this._register(new Emitter<IWorkingCopy>());
	readonly onDidUnregister = this._onDidUnregister.event;

	private readonly _onDidChangeDirty = this._register(new Emitter<IWorkingCopy>());
	readonly onDidChangeDirty = this._onDidChangeDirty.event;

	private readonly _onDidChangeContent = this._register(new Emitter<IWorkingCopy>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onDidSave = this._register(new Emitter<IWorkingCopySaveEvent>());
	readonly onDidSave = this._onDidSave.event;

	//#endregion


	//#region Registry

	get workingCopies(): IWorkingCopy[] { return Array.from(this._workingCopies.values()); }
	private _workingCopies = new Set<IWorkingCopy>();

	private readonly mapResourceToWorkingCopies = new ResourceMap<Map<string, IWorkingCopy>>();
	private readonly mapWorkingCopyToListeners = this._register(new DisposableMap<IWorkingCopy>());

	registerWorkingCopy(workingCopy: IWorkingCopy): IDisposable {
		let workingCopiesForResource = this.mapResourceToWorkingCopies.get(workingCopy.resource);
		if (workingCopiesForResource?.has(workingCopy.typeId)) {
			throw new Error(`Cannot register more than one working copy with the same resource ${workingCopy.resource.toString()} and type ${workingCopy.typeId}.`);
		}

		// Registry (all)
		this._workingCopies.add(workingCopy);

		// Registry (type based)
		if (!workingCopiesForResource) {
			workingCopiesForResource = new Map();
			this.mapResourceToWorkingCopies.set(workingCopy.resource, workingCopiesForResource);
		}
		workingCopiesForResource.set(workingCopy.typeId, workingCopy);

		// Wire in Events
		const disposables = new DisposableStore();
		disposables.add(workingCopy.onDidChangeContent(() => this._onDidChangeContent.fire(workingCopy)));
		disposables.add(workingCopy.onDidChangeDirty(() => this._onDidChangeDirty.fire(workingCopy)));
		disposables.add(workingCopy.onDidSave(e => this._onDidSave.fire({ workingCopy, ...e })));
		this.mapWorkingCopyToListeners.set(workingCopy, disposables);

		// Send some initial events
		this._onDidRegister.fire(workingCopy);
		if (workingCopy.isDirty()) {
			this._onDidChangeDirty.fire(workingCopy);
		}

		// Track Leaks
		const leakId = this.trackLeaks(workingCopy);

		return toDisposable(() => {

			// Untrack Leaks
			if (leakId) {
				this.untrackLeaks(leakId);
			}

			// Unregister working copy
			this.unregisterWorkingCopy(workingCopy);

			// Signal as event
			this._onDidUnregister.fire(workingCopy);
		});
	}

	protected unregisterWorkingCopy(workingCopy: IWorkingCopy): void {

		// Registry (all)
		this._workingCopies.delete(workingCopy);

		// Registry (type based)
		const workingCopiesForResource = this.mapResourceToWorkingCopies.get(workingCopy.resource);
		if (workingCopiesForResource?.delete(workingCopy.typeId) && workingCopiesForResource.size === 0) {
			this.mapResourceToWorkingCopies.delete(workingCopy.resource);
		}

		// If copy is dirty, ensure to fire an event to signal the dirty change
		// (a disposed working copy cannot account for being dirty in our model)
		if (workingCopy.isDirty()) {
			this._onDidChangeDirty.fire(workingCopy);
		}

		// Remove all listeners associated to working copy
		this.mapWorkingCopyToListeners.deleteAndDispose(workingCopy);
	}

	has(identifier: IWorkingCopyIdentifier): boolean;
	has(resource: URI): boolean;
	has(resourceOrIdentifier: URI | IWorkingCopyIdentifier): boolean {
		if (URI.isUri(resourceOrIdentifier)) {
			return this.mapResourceToWorkingCopies.has(resourceOrIdentifier);
		}

		return this.mapResourceToWorkingCopies.get(resourceOrIdentifier.resource)?.has(resourceOrIdentifier.typeId) ?? false;
	}

	get(identifier: IWorkingCopyIdentifier): IWorkingCopy | undefined {
		return this.mapResourceToWorkingCopies.get(identifier.resource)?.get(identifier.typeId);
	}

	getAll(resource: URI): readonly IWorkingCopy[] | undefined {
		const workingCopies = this.mapResourceToWorkingCopies.get(resource);
		if (!workingCopies) {
			return undefined;
		}

		return Array.from(workingCopies.values());
	}

	//#endregion

	//#region Leak Monitoring

	private static readonly LEAK_TRACKING_THRESHOLD = 256;
	private static readonly LEAK_REPORTING_THRESHOLD = 2 * WorkingCopyService.LEAK_TRACKING_THRESHOLD;
	private static LEAK_REPORTED = false;

	private readonly mapLeakToCounter = new Map<string, number>();

	private trackLeaks(workingCopy: IWorkingCopy): string | undefined {
		if (WorkingCopyService.LEAK_REPORTED || this._workingCopies.size < WorkingCopyService.LEAK_TRACKING_THRESHOLD) {
			return undefined;
		}

		const leakId = `${workingCopy.resource.scheme}#${workingCopy.typeId || '<no typeId>'}\n${new Error().stack?.split('\n').slice(2).join('\n') ?? ''}`;
		const leakCounter = (this.mapLeakToCounter.get(leakId) ?? 0) + 1;
		this.mapLeakToCounter.set(leakId, leakCounter);

		if (this._workingCopies.size > WorkingCopyService.LEAK_REPORTING_THRESHOLD) {
			WorkingCopyService.LEAK_REPORTED = true;

			const [topLeak, topCount] = Array.from(this.mapLeakToCounter.entries()).reduce(
				([topLeak, topCount], [key, val]) => val > topCount ? [key, val] : [topLeak, topCount]
			);

			const message = `Potential working copy LEAK detected, having ${this._workingCopies.size} working copies already. Most frequent owner (${topCount})`;
			onUnexpectedError(new WorkingCopyLeakError(message, topLeak));
		}

		return leakId;
	}

	private untrackLeaks(leakId: string): void {
		const stackCounter = (this.mapLeakToCounter.get(leakId) ?? 1) - 1;
		this.mapLeakToCounter.set(leakId, stackCounter);

		if (stackCounter === 0) {
			this.mapLeakToCounter.delete(leakId);
		}
	}

	//#endregion

	//#region Dirty Tracking

	get hasDirty(): boolean {
		for (const workingCopy of this._workingCopies) {
			if (workingCopy.isDirty()) {
				return true;
			}
		}

		return false;
	}

	get dirtyCount(): number {
		let totalDirtyCount = 0;

		for (const workingCopy of this._workingCopies) {
			if (workingCopy.isDirty()) {
				totalDirtyCount++;
			}
		}

		return totalDirtyCount;
	}

	get dirtyWorkingCopies(): IWorkingCopy[] {
		return this.workingCopies.filter(workingCopy => workingCopy.isDirty());
	}

	get modifiedCount(): number {
		let totalModifiedCount = 0;

		for (const workingCopy of this._workingCopies) {
			if (workingCopy.isModified()) {
				totalModifiedCount++;
			}
		}

		return totalModifiedCount;
	}

	get modifiedWorkingCopies(): IWorkingCopy[] {
		return this.workingCopies.filter(workingCopy => workingCopy.isModified());
	}

	isDirty(resource: URI, typeId?: string): boolean {
		const workingCopies = this.mapResourceToWorkingCopies.get(resource);
		if (workingCopies) {

			// For a specific type
			if (typeof typeId === 'string') {
				return workingCopies.get(typeId)?.isDirty() ?? false;
			}

			// Across all working copies
			else {
				for (const [, workingCopy] of workingCopies) {
					if (workingCopy.isDirty()) {
						return true;
					}
				}
			}
		}

		return false;
	}

	//#endregion
}

registerSingleton(IWorkingCopyService, WorkingCopyService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/electron-browser/workingCopyBackupService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/electron-browser/workingCopyBackupService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { WorkingCopyBackupService } from '../common/workingCopyBackupService.js';
import { URI } from '../../../../base/common/uri.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkingCopyBackupService } from '../common/workingCopyBackup.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { NativeWorkingCopyBackupTracker } from './workingCopyBackupTracker.js';

export class NativeWorkingCopyBackupService extends WorkingCopyBackupService {

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService
	) {
		super(environmentService.backupPath ? URI.file(environmentService.backupPath).with({ scheme: environmentService.userRoamingDataHome.scheme }) : undefined, fileService, logService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle: ensure to prolong the shutdown for as long
		// as pending backup operations have not finished yet.
		// Otherwise, we risk writing partial backups to disk.
		this._register(this.lifecycleService.onWillShutdown(event => event.join(this.joinBackups(), { id: 'join.workingCopyBackups', label: localize('join.workingCopyBackups', "Backup working copies") })));
	}
}

// Register Service
registerSingleton(IWorkingCopyBackupService, NativeWorkingCopyBackupService, InstantiationType.Eager);

// Register Backup Tracker
registerWorkbenchContribution2(NativeWorkingCopyBackupTracker.ID, NativeWorkingCopyBackupTracker, WorkbenchPhase.BlockStartup);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/electron-browser/workingCopyBackupTracker.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/electron-browser/workingCopyBackupTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { IWorkingCopyBackupService } from '../common/workingCopyBackup.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IFilesConfigurationService, AutoSaveMode } from '../../filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyService } from '../common/workingCopyService.js';
import { IWorkingCopy, IWorkingCopyIdentifier, WorkingCopyCapabilities } from '../common/workingCopy.js';
import { ILifecycleService, ShutdownReason } from '../../lifecycle/common/lifecycle.js';
import { ConfirmResult, IFileDialogService, IDialogService, getFileNamesMessage } from '../../../../platform/dialogs/common/dialogs.js';
import { WorkbenchState, IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { HotExitConfiguration } from '../../../../platform/files/common/files.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { WorkingCopyBackupTracker } from '../common/workingCopyBackupTracker.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { SaveReason } from '../../../common/editor.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { Promises, raceCancellation } from '../../../../base/common/async.js';
import { IWorkingCopyEditorService } from '../common/workingCopyEditorService.js';
import { IEditorGroupsService } from '../../editor/common/editorGroupsService.js';

export class NativeWorkingCopyBackupTracker extends WorkingCopyBackupTracker implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.nativeWorkingCopyBackupTracker';

	constructor(
		@IWorkingCopyBackupService workingCopyBackupService: IWorkingCopyBackupService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@IWorkingCopyService workingCopyService: IWorkingCopyService,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@INativeHostService private readonly nativeHostService: INativeHostService,
		@ILogService logService: ILogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IProgressService private readonly progressService: IProgressService,
		@IWorkingCopyEditorService workingCopyEditorService: IWorkingCopyEditorService,
		@IEditorService editorService: IEditorService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService
	) {
		super(workingCopyBackupService, workingCopyService, logService, lifecycleService, filesConfigurationService, workingCopyEditorService, editorService, editorGroupService);
	}

	protected async onFinalBeforeShutdown(reason: ShutdownReason): Promise<boolean> {

		// Important: we are about to shutdown and handle modified working copies
		// and backups. We do not want any pending backup ops to interfer with
		// this because there is a risk of a backup being scheduled after we have
		// acknowledged to shutdown and then might end up with partial backups
		// written to disk, or even empty backups or deletes after writes.
		// (https://github.com/microsoft/vscode/issues/138055)

		this.cancelBackupOperations();

		// For the duration of the shutdown handling, suspend backup operations
		// and only resume after we have handled backups. Similar to above, we
		// do not want to trigger backup tracking during our shutdown handling
		// but we must resume, in case of a veto afterwards.

		const { resume } = this.suspendBackupOperations();

		try {

			// Modified working copies need treatment on shutdown
			const modifiedWorkingCopies = this.workingCopyService.modifiedWorkingCopies;
			if (modifiedWorkingCopies.length) {
				return await this.onBeforeShutdownWithModified(reason, modifiedWorkingCopies);
			}

			// No modified working copies
			else {
				return await this.onBeforeShutdownWithoutModified();
			}
		} finally {
			resume();
		}
	}

	protected async onBeforeShutdownWithModified(reason: ShutdownReason, modifiedWorkingCopies: readonly IWorkingCopy[]): Promise<boolean> {

		// If auto save is enabled, save all non-untitled working copies
		// and then check again for modified copies

		const workingCopiesToAutoSave = modifiedWorkingCopies.filter(wc => !(wc.capabilities & WorkingCopyCapabilities.Untitled) && this.filesConfigurationService.getAutoSaveMode(wc.resource).mode !== AutoSaveMode.OFF);
		if (workingCopiesToAutoSave.length > 0) {

			// Save all modified working copies that can be auto-saved
			try {
				await this.doSaveAllBeforeShutdown(workingCopiesToAutoSave, SaveReason.AUTO);
			} catch (error) {
				this.logService.error(`[backup tracker] error saving modified working copies: ${error}`); // guard against misbehaving saves, we handle remaining modified below
			}

			// If we still have modified working copies, we either have untitled ones or working copies that cannot be saved
			const remainingModifiedWorkingCopies = this.workingCopyService.modifiedWorkingCopies;
			if (remainingModifiedWorkingCopies.length) {
				return this.handleModifiedBeforeShutdown(remainingModifiedWorkingCopies, reason);
			}

			return this.noVeto([...modifiedWorkingCopies]); // no veto (modified auto-saved)
		}

		// Auto save is not enabled
		return this.handleModifiedBeforeShutdown(modifiedWorkingCopies, reason);
	}

	private async handleModifiedBeforeShutdown(modifiedWorkingCopies: readonly IWorkingCopy[], reason: ShutdownReason): Promise<boolean> {

		// Trigger backup if configured and enabled for shutdown reason
		let backups: IWorkingCopy[] = [];
		let backupError: Error | undefined = undefined;
		const modifiedWorkingCopiesToBackup = await this.shouldBackupBeforeShutdown(reason, modifiedWorkingCopies);
		if (modifiedWorkingCopiesToBackup.length > 0) {
			try {
				const backupResult = await this.backupBeforeShutdown(modifiedWorkingCopiesToBackup);
				backups = backupResult.backups;
				backupError = backupResult.error;

				if (backups.length === modifiedWorkingCopies.length) {
					return false; // no veto (backup was successful for all working copies)
				}
			} catch (error) {
				backupError = error;
			}
		}

		const remainingModifiedWorkingCopies = modifiedWorkingCopies.filter(workingCopy => !backups.includes(workingCopy));

		// We ran a backup but received an error that we show to the user
		if (backupError) {
			if (this.environmentService.isExtensionDevelopment) {
				this.logService.error(`[backup tracker] error creating backups: ${backupError}`);

				return false; // do not block shutdown during extension development (https://github.com/microsoft/vscode/issues/115028)
			}

			return this.showErrorDialog(localize('backupTrackerBackupFailed', "The following editors with unsaved changes could not be saved to the backup location."), remainingModifiedWorkingCopies, backupError, reason);
		}

		// Since a backup did not happen, we have to confirm for
		// the working copies that did not successfully backup

		try {
			return await this.confirmBeforeShutdown(remainingModifiedWorkingCopies);
		} catch (error) {
			if (this.environmentService.isExtensionDevelopment) {
				this.logService.error(`[backup tracker] error saving or reverting modified working copies: ${error}`);

				return false; // do not block shutdown during extension development (https://github.com/microsoft/vscode/issues/115028)
			}

			return this.showErrorDialog(localize('backupTrackerConfirmFailed', "The following editors with unsaved changes could not be saved or reverted."), remainingModifiedWorkingCopies, error, reason);
		}
	}

	private async shouldBackupBeforeShutdown(reason: ShutdownReason, modifiedWorkingCopies: readonly IWorkingCopy[]): Promise<readonly IWorkingCopy[]> {
		if (!this.filesConfigurationService.isHotExitEnabled) {
			return []; // never backup when hot exit is disabled via settings
		}

		if (this.environmentService.isExtensionDevelopment) {
			return modifiedWorkingCopies; // always backup closing extension development window without asking to speed up debugging
		}

		switch (reason) {

			// Window Close
			case ShutdownReason.CLOSE:
				if (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY && this.filesConfigurationService.hotExitConfiguration === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
					return modifiedWorkingCopies; // backup if a workspace/folder is open and onExitAndWindowClose is configured
				}

				if (isMacintosh || await this.nativeHostService.getWindowCount() > 1) {
					if (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY) {
						return modifiedWorkingCopies.filter(modifiedWorkingCopy => modifiedWorkingCopy.capabilities & WorkingCopyCapabilities.Scratchpad); // backup scratchpads automatically to avoid user confirmation
					}

					return []; // do not backup if a window is closed that does not cause quitting of the application
				}

				return modifiedWorkingCopies; // backup if last window is closed on win/linux where the application quits right after

			// Application Quit
			case ShutdownReason.QUIT:
				return modifiedWorkingCopies; // backup because next start we restore all backups

			// Window Reload
			case ShutdownReason.RELOAD:
				return modifiedWorkingCopies; // backup because after window reload, backups restore

			// Workspace Change
			case ShutdownReason.LOAD:
				if (this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY) {
					if (this.filesConfigurationService.hotExitConfiguration === HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
						return modifiedWorkingCopies; // backup if a workspace/folder is open and onExitAndWindowClose is configured
					}

					return modifiedWorkingCopies.filter(modifiedWorkingCopy => modifiedWorkingCopy.capabilities & WorkingCopyCapabilities.Scratchpad); // backup scratchpads automatically to avoid user confirmation
				}

				return []; // do not backup because we are switching contexts with no workspace/folder open
		}
	}

	private async showErrorDialog(message: string, workingCopies: readonly IWorkingCopy[], error: Error, reason: ShutdownReason): Promise<boolean> {
		this.logService.error(`[backup tracker] ${message}: ${error}`);

		const modifiedWorkingCopies = workingCopies.filter(workingCopy => workingCopy.isModified());

		const advice = localize('backupErrorDetails', "Try saving or reverting the editors with unsaved changes first and then try again.");
		const detail = modifiedWorkingCopies.length
			? `${getFileNamesMessage(modifiedWorkingCopies.map(x => x.name))}\n${advice}`
			: advice;

		const { result } = await this.dialogService.prompt({
			type: 'error',
			message,
			detail,
			buttons: [
				{
					label: localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
					run: () => true // veto
				},
				{
					label: this.toForceShutdownLabel(reason),
					run: () => false // no veto
				}
			],
		});

		return result ?? true;
	}

	private toForceShutdownLabel(reason: ShutdownReason): string {
		switch (reason) {
			case ShutdownReason.CLOSE:
			case ShutdownReason.LOAD:
				return localize('shutdownForceClose', "Close Anyway");
			case ShutdownReason.QUIT:
				return localize('shutdownForceQuit', "Quit Anyway");
			case ShutdownReason.RELOAD:
				return localize('shutdownForceReload', "Reload Anyway");
		}
	}

	private async backupBeforeShutdown(modifiedWorkingCopies: readonly IWorkingCopy[]): Promise<{ backups: IWorkingCopy[]; error?: Error }> {
		const backups: IWorkingCopy[] = [];
		let error: Error | undefined = undefined;

		await this.withProgressAndCancellation(async token => {

			// Perform a backup of all modified working copies unless a backup already exists
			try {
				await Promises.settled(modifiedWorkingCopies.map(async workingCopy => {

					// Backup exists
					const contentVersion = this.getContentVersion(workingCopy);
					if (this.workingCopyBackupService.hasBackupSync(workingCopy, contentVersion)) {
						backups.push(workingCopy);
					}

					// Backup does not exist
					else {
						const backup = await workingCopy.backup(token);
						if (token.isCancellationRequested) {
							return;
						}

						await this.workingCopyBackupService.backup(workingCopy, backup.content, contentVersion, backup.meta, token);
						if (token.isCancellationRequested) {
							return;
						}

						backups.push(workingCopy);
					}
				}));
			} catch (backupError) {
				error = backupError;
			}
		},
			localize('backupBeforeShutdownMessage', "Backing up editors with unsaved changes is taking a bit longer..."),
			localize('backupBeforeShutdownDetail', "Click 'Cancel' to stop waiting and to save or revert editors with unsaved changes.")
		);

		return { backups, error };
	}

	private async confirmBeforeShutdown(modifiedWorkingCopies: IWorkingCopy[]): Promise<boolean> {

		// Save
		const confirm = await this.fileDialogService.showSaveConfirm(modifiedWorkingCopies.map(workingCopy => workingCopy.name));
		if (confirm === ConfirmResult.SAVE) {
			const modifiedCountBeforeSave = this.workingCopyService.modifiedCount;

			try {
				await this.doSaveAllBeforeShutdown(modifiedWorkingCopies, SaveReason.EXPLICIT);
			} catch (error) {
				this.logService.error(`[backup tracker] error saving modified working copies: ${error}`); // guard against misbehaving saves, we handle remaining modified below
			}

			const savedWorkingCopies = modifiedCountBeforeSave - this.workingCopyService.modifiedCount;
			if (savedWorkingCopies < modifiedWorkingCopies.length) {
				return true; // veto (save failed or was canceled)
			}

			return this.noVeto(modifiedWorkingCopies); // no veto (modified saved)
		}

		// Don't Save
		else if (confirm === ConfirmResult.DONT_SAVE) {
			try {
				await this.doRevertAllBeforeShutdown(modifiedWorkingCopies);
			} catch (error) {
				this.logService.error(`[backup tracker] error reverting modified working copies: ${error}`); // do not block the shutdown on errors from revert
			}

			return this.noVeto(modifiedWorkingCopies); // no veto (modified reverted)
		}

		// Cancel
		return true; // veto (user canceled)
	}

	private doSaveAllBeforeShutdown(workingCopies: IWorkingCopy[], reason: SaveReason): Promise<void> {
		return this.withProgressAndCancellation(async () => {

			// Skip save participants on shutdown for performance reasons
			const saveOptions = { skipSaveParticipants: true, reason };

			// First save through the editor service if we save all to benefit
			// from some extras like switching to untitled modified editors before saving.
			let result: boolean | undefined = undefined;
			if (workingCopies.length === this.workingCopyService.modifiedCount) {
				result = (await this.editorService.saveAll({
					includeUntitled: { includeScratchpad: true },
					...saveOptions
				})).success;
			}

			// If we still have modified working copies, save those directly
			// unless the save was not successful (e.g. cancelled)
			if (result !== false) {
				await Promises.settled(workingCopies.map(workingCopy => workingCopy.isModified() ? workingCopy.save(saveOptions) : Promise.resolve(true)));
			}
		},
			localize('saveBeforeShutdown', "Saving editors with unsaved changes is taking a bit longer..."),
			undefined,
			// Do not pick `Dialog` as location for reporting progress if it is likely
			// that the save operation will itself open a dialog for asking for the
			// location to save to for untitled or scratchpad working copies.
			// https://github.com/microsoft/vscode-internalbacklog/issues/4943
			workingCopies.some(workingCopy => workingCopy.capabilities & WorkingCopyCapabilities.Untitled || workingCopy.capabilities & WorkingCopyCapabilities.Scratchpad) ? ProgressLocation.Window : ProgressLocation.Dialog);
	}

	private doRevertAllBeforeShutdown(modifiedWorkingCopies: IWorkingCopy[]): Promise<void> {
		return this.withProgressAndCancellation(async () => {

			// Soft revert is good enough on shutdown
			const revertOptions = { soft: true };

			// First revert through the editor service if we revert all
			if (modifiedWorkingCopies.length === this.workingCopyService.modifiedCount) {
				await this.editorService.revertAll(revertOptions);
			}

			// If we still have modified working copies, revert those directly
			await Promises.settled(modifiedWorkingCopies.map(workingCopy => workingCopy.isModified() ? workingCopy.revert(revertOptions) : Promise.resolve()));
		}, localize('revertBeforeShutdown', "Reverting editors with unsaved changes is taking a bit longer..."));
	}

	private onBeforeShutdownWithoutModified(): Promise<boolean> {

		// We are about to shutdown without modified editors
		// and will discard any backups that are still
		// around that have not been handled depending
		// on the window state.
		//
		// Empty window: discard even unrestored backups to
		// prevent empty windows from restoring that cannot
		// be closed (workaround for not having implemented
		// https://github.com/microsoft/vscode/issues/127163
		// and a fix for what users have reported in issue
		// https://github.com/microsoft/vscode/issues/126725)
		//
		// Workspace/Folder window: do not discard unrestored
		// backups to give a chance to restore them in the
		// future. Since we do not restore workspace/folder
		// windows with backups, this is fine.

		return this.noVeto({ except: this.contextService.getWorkbenchState() === WorkbenchState.EMPTY ? [] : Array.from(this.unrestoredBackups) });
	}

	private noVeto(backupsToDiscard: IWorkingCopyIdentifier[]): Promise<boolean>;
	private noVeto(backupsToKeep: { except: IWorkingCopyIdentifier[] }): Promise<boolean>;
	private async noVeto(arg1: IWorkingCopyIdentifier[] | { except: IWorkingCopyIdentifier[] }): Promise<boolean> {

		// Discard backups from working copies the
		// user either saved or reverted

		await this.discardBackupsBeforeShutdown(arg1);

		return false; // no veto (no modified)
	}

	private discardBackupsBeforeShutdown(backupsToDiscard: IWorkingCopyIdentifier[]): Promise<void>;
	private discardBackupsBeforeShutdown(backupsToKeep: { except: IWorkingCopyIdentifier[] }): Promise<void>;
	private discardBackupsBeforeShutdown(backupsToDiscardOrKeep: IWorkingCopyIdentifier[] | { except: IWorkingCopyIdentifier[] }): Promise<void>;
	private async discardBackupsBeforeShutdown(arg1: IWorkingCopyIdentifier[] | { except: IWorkingCopyIdentifier[] }): Promise<void> {

		// We never discard any backups before we are ready
		// and have resolved all backups that exist. This
		// is important to not loose backups that have not
		// been handled.

		if (!this.isReady) {
			return;
		}

		await this.withProgressAndCancellation(async () => {

			// When we shutdown either with no modified working copies left
			// or with some handled, we start to discard these backups
			// to free them up. This helps to get rid of stale backups
			// as reported in https://github.com/microsoft/vscode/issues/92962
			//
			// However, we never want to discard backups that we know
			// were not restored in the session.

			try {
				if (Array.isArray(arg1)) {
					await Promises.settled(arg1.map(workingCopy => this.workingCopyBackupService.discardBackup(workingCopy)));
				} else {
					await this.workingCopyBackupService.discardBackups(arg1);
				}
			} catch (error) {
				this.logService.error(`[backup tracker] error discarding backups: ${error}`);
			}
		}, localize('discardBackupsBeforeShutdown', "Discarding backups is taking a bit longer..."));
	}

	private withProgressAndCancellation(promiseFactory: (token: CancellationToken) => Promise<void>, title: string, detail?: string, location = ProgressLocation.Dialog): Promise<void> {
		const cts = new CancellationTokenSource();

		return this.progressService.withProgress({
			location, 			// by default use a dialog to prevent the user from making any more changes now (https://github.com/microsoft/vscode/issues/122774)
			cancellable: true, 	// allow to cancel (https://github.com/microsoft/vscode/issues/112278)
			delay: 800, 		// delay so that it only appears when operation takes a long time
			title,
			detail
		}, () => raceCancellation(promiseFactory(cts.token), cts.token), () => cts.dispose(true));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/electron-browser/workingCopyHistoryService.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/electron-browser/workingCopyHistoryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NativeWorkingCopyHistoryService } from '../common/workingCopyHistoryService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkingCopyHistoryService } from '../common/workingCopyHistory.js';

// Register Service
registerSingleton(IWorkingCopyHistoryService, NativeWorkingCopyHistoryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/fileWorkingCopyManager.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/fileWorkingCopyManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor, TestInMemoryFileSystemProvider } from '../../../../test/browser/workbenchTestServices.js';
import { StoredFileWorkingCopy, IStoredFileWorkingCopy } from '../../common/storedFileWorkingCopy.js';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { TestStoredFileWorkingCopyModel, TestStoredFileWorkingCopyModelFactory } from './storedFileWorkingCopy.test.js';
import { Schemas } from '../../../../../base/common/network.js';
import { IFileWorkingCopyManager, FileWorkingCopyManager } from '../../common/fileWorkingCopyManager.js';
import { TestUntitledFileWorkingCopyModel, TestUntitledFileWorkingCopyModelFactory } from './untitledFileWorkingCopy.test.js';
import { UntitledFileWorkingCopy } from '../../common/untitledFileWorkingCopy.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('FileWorkingCopyManager', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	let manager: IFileWorkingCopyManager<TestStoredFileWorkingCopyModel, TestUntitledFileWorkingCopyModel>;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		accessor.fileService.registerProvider(Schemas.file, new TestInMemoryFileSystemProvider());
		accessor.fileService.registerProvider(Schemas.vscodeRemote, new TestInMemoryFileSystemProvider());

		manager = disposables.add(new FileWorkingCopyManager(
			'testFileWorkingCopyType',
			new TestStoredFileWorkingCopyModelFactory(),
			new TestUntitledFileWorkingCopyModelFactory(),
			accessor.fileService, accessor.lifecycleService, accessor.labelService, accessor.logService,
			accessor.workingCopyFileService, accessor.workingCopyBackupService, accessor.uriIdentityService, accessor.fileDialogService,
			accessor.filesConfigurationService, accessor.workingCopyService, accessor.notificationService,
			accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.pathService,
			accessor.environmentService, accessor.dialogService, accessor.decorationsService, accessor.progressService,
		));
	});

	teardown(() => {
		disposables.clear();
	});

	test('onDidCreate, get, workingCopies', async () => {
		let createCounter = 0;
		disposables.add(manager.onDidCreate(e => {
			createCounter++;
		}));

		const fileUri = URI.file('/test.html');

		assert.strictEqual(manager.workingCopies.length, 0);
		assert.strictEqual(manager.get(fileUri), undefined);

		const fileWorkingCopy = await manager.resolve(fileUri);
		const untitledFileWorkingCopy = await manager.resolve();

		assert.strictEqual(manager.workingCopies.length, 2);
		assert.strictEqual(createCounter, 2);
		assert.strictEqual(manager.get(fileWorkingCopy.resource), fileWorkingCopy);
		assert.strictEqual(manager.get(untitledFileWorkingCopy.resource), untitledFileWorkingCopy);

		const sameFileWorkingCopy = disposables.add(await manager.resolve(fileUri));
		const sameUntitledFileWorkingCopy = disposables.add(await manager.resolve({ untitledResource: untitledFileWorkingCopy.resource }));
		assert.strictEqual(sameFileWorkingCopy, fileWorkingCopy);
		assert.strictEqual(sameUntitledFileWorkingCopy, untitledFileWorkingCopy);
		assert.strictEqual(manager.workingCopies.length, 2);
		assert.strictEqual(createCounter, 2);
	});

	test('resolve', async () => {
		const fileWorkingCopy = disposables.add(await manager.resolve(URI.file('/test.html')));
		assert.ok(fileWorkingCopy instanceof StoredFileWorkingCopy);
		assert.strictEqual(await manager.stored.resolve(fileWorkingCopy.resource), fileWorkingCopy);

		const untitledFileWorkingCopy = disposables.add(await manager.resolve());
		assert.ok(untitledFileWorkingCopy instanceof UntitledFileWorkingCopy);
		assert.strictEqual(await manager.untitled.resolve({ untitledResource: untitledFileWorkingCopy.resource }), untitledFileWorkingCopy);
		assert.strictEqual(await manager.resolve(untitledFileWorkingCopy.resource), untitledFileWorkingCopy);
	});

	test('destroy', async () => {
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);

		await manager.resolve(URI.file('/test.html'));
		await manager.resolve({ contents: { value: bufferToStream(VSBuffer.fromString('Hello Untitled')) } });

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 2);
		assert.strictEqual(manager.stored.workingCopies.length, 1);
		assert.strictEqual(manager.untitled.workingCopies.length, 1);

		await manager.destroy();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.stored.workingCopies.length, 0);
		assert.strictEqual(manager.untitled.workingCopies.length, 0);
	});

	test('saveAs - file (same target, unresolved source, unresolved target)', () => {
		const source = URI.file('/path/source.txt');

		return testSaveAsFile(source, source, false, false);
	});

	test('saveAs - file (same target, different case, unresolved source, unresolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/SOURCE.txt');

		return testSaveAsFile(source, target, false, false);
	});

	test('saveAs - file (different target, unresolved source, unresolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/target.txt');

		return testSaveAsFile(source, target, false, false);
	});

	test('saveAs - file (same target, resolved source, unresolved target)', () => {
		const source = URI.file('/path/source.txt');

		return testSaveAsFile(source, source, true, false);
	});

	test('saveAs - file (same target, different case, resolved source, unresolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/SOURCE.txt');

		return testSaveAsFile(source, target, true, false);
	});

	test('saveAs - file (different target, resolved source, unresolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/target.txt');

		return testSaveAsFile(source, target, true, false);
	});

	test('saveAs - file (same target, unresolved source, resolved target)', () => {
		const source = URI.file('/path/source.txt');

		return testSaveAsFile(source, source, false, true);
	});

	test('saveAs - file (same target, different case, unresolved source, resolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/SOURCE.txt');

		return testSaveAsFile(source, target, false, true);
	});

	test('saveAs - file (different target, unresolved source, resolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/target.txt');

		return testSaveAsFile(source, target, false, true);
	});

	test('saveAs - file (same target, resolved source, resolved target)', () => {
		const source = URI.file('/path/source.txt');

		return testSaveAsFile(source, source, true, true);
	});

	test('saveAs - file (different target, resolved source, resolved target)', async () => {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/target.txt');

		return testSaveAsFile(source, target, true, true);
	});

	async function testSaveAsFile(source: URI, target: URI, resolveSource: boolean, resolveTarget: boolean) {
		let sourceWorkingCopy: IStoredFileWorkingCopy<TestStoredFileWorkingCopyModel> | undefined = undefined;
		if (resolveSource) {
			sourceWorkingCopy = disposables.add(await manager.resolve(source));
			sourceWorkingCopy.model?.updateContents('hello world');
			assert.ok(sourceWorkingCopy.isDirty());
		}

		let targetWorkingCopy: IStoredFileWorkingCopy<TestStoredFileWorkingCopyModel> | undefined = undefined;
		if (resolveTarget) {
			targetWorkingCopy = disposables.add(await manager.resolve(target));
			targetWorkingCopy.model?.updateContents('hello world');
			assert.ok(targetWorkingCopy.isDirty());
		}

		const result = await manager.saveAs(source, target);
		if (accessor.uriIdentityService.extUri.isEqual(source, target) && resolveSource) {
			// if the uris are considered equal (different case on macOS/Windows)
			// and the source is to be resolved, the resulting working copy resource
			// will be the source resource because we consider file working copies
			// the same in that case
			assert.strictEqual(source.toString(), result?.resource.toString());
		} else {
			if (resolveSource || resolveTarget) {
				assert.strictEqual(target.toString(), result?.resource.toString());
			} else {
				if (accessor.uriIdentityService.extUri.isEqual(source, target)) {
					assert.strictEqual(undefined, result);
				} else {
					assert.strictEqual(target.toString(), result?.resource.toString());
				}
			}
		}

		if (resolveSource) {
			assert.strictEqual(sourceWorkingCopy?.isDirty(), false);
		}

		if (resolveTarget) {
			assert.strictEqual(targetWorkingCopy?.isDirty(), false);
		}

		result?.dispose();
	}

	test('saveAs - untitled (without associated resource)', async () => {
		const workingCopy = disposables.add(await manager.resolve());
		workingCopy.model?.updateContents('Simple Save As');

		const target = URI.file('simple/file.txt');
		accessor.fileDialogService.setPickFileToSave(target);

		const result = await manager.saveAs(workingCopy.resource, undefined);
		assert.strictEqual(result?.resource.toString(), target.toString());

		assert.strictEqual((result?.model as TestStoredFileWorkingCopyModel).contents, 'Simple Save As');

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);

		result?.dispose();
	});

	test('saveAs - untitled (with associated resource)', async () => {
		const workingCopy = disposables.add(await manager.resolve({ associatedResource: { path: '/some/associated.txt' } }));
		workingCopy.model?.updateContents('Simple Save As with associated resource');

		const target = URI.from({ scheme: Schemas.file, path: '/some/associated.txt' });

		accessor.fileService.notExistsSet.set(target, true);

		const result = await manager.saveAs(workingCopy.resource, undefined);
		assert.strictEqual(result?.resource.toString(), target.toString());

		assert.strictEqual((result?.model as TestStoredFileWorkingCopyModel).contents, 'Simple Save As with associated resource');

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);

		result?.dispose();
	});

	test('saveAs - untitled (target exists and is resolved)', async () => {
		const workingCopy = disposables.add(await manager.resolve());
		workingCopy.model?.updateContents('Simple Save As');

		const target = URI.file('simple/file.txt');
		const targetFileWorkingCopy = await manager.resolve(target);
		accessor.fileDialogService.setPickFileToSave(target);

		const result = await manager.saveAs(workingCopy.resource, undefined);
		assert.strictEqual(result, targetFileWorkingCopy);

		assert.strictEqual((result?.model as TestStoredFileWorkingCopyModel).contents, 'Simple Save As');

		assert.strictEqual(manager.untitled.get(workingCopy.resource), undefined);

		result?.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/resourceWorkingCopy.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/resourceWorkingCopy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { FileChangesEvent, FileChangeType } from '../../../../../platform/files/common/files.js';
import { IRevertOptions, ISaveOptions } from '../../../../common/editor.js';
import { ResourceWorkingCopy } from '../../common/resourceWorkingCopy.js';
import { WorkingCopyCapabilities, IWorkingCopyBackup } from '../../common/workingCopy.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('ResourceWorkingCopy', function () {

	class TestResourceWorkingCopy extends ResourceWorkingCopy {
		name = 'testName';
		typeId = 'testTypeId';
		capabilities = WorkingCopyCapabilities.None;
		onDidChangeDirty = Event.None;
		onDidChangeContent = Event.None;
		onDidSave = Event.None;
		isDirty(): boolean { return false; }
		async backup(token: CancellationToken): Promise<IWorkingCopyBackup> { throw new Error('Method not implemented.'); }
		async save(options?: ISaveOptions): Promise<boolean> { return false; }
		async revert(options?: IRevertOptions): Promise<void> { }

	}

	const disposables = new DisposableStore();
	const resource = URI.file('test/resource');
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: TestResourceWorkingCopy;

	function createWorkingCopy(uri: URI = resource) {
		return new TestResourceWorkingCopy(uri, accessor.fileService);
	}

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		workingCopy = disposables.add(createWorkingCopy());
	});

	teardown(() => {
		disposables.clear();
	});

	test('orphaned tracking', async () => {
		return runWithFakedTimers({}, async () => {
			assert.strictEqual(workingCopy.isOrphaned(), false);

			let onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.isOrphaned(), true);

			onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.delete(resource);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.ADDED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.isOrphaned(), false);
		});
	});

	test('dispose, isDisposed', async () => {
		assert.strictEqual(workingCopy.isDisposed(), false);

		let disposedEvent = false;
		disposables.add(workingCopy.onWillDispose(() => {
			disposedEvent = true;
		}));

		workingCopy.dispose();

		assert.strictEqual(workingCopy.isDisposed(), true);
		assert.strictEqual(disposedEvent, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/storedFileWorkingCopy.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/storedFileWorkingCopy.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { Event, Emitter } from '../../../../../base/common/event.js';
import { URI } from '../../../../../base/common/uri.js';
import { StoredFileWorkingCopy, StoredFileWorkingCopyState, IStoredFileWorkingCopyModel, IStoredFileWorkingCopyModelContentChangedEvent, IStoredFileWorkingCopyModelFactory, isStoredFileWorkingCopySaveEvent, IStoredFileWorkingCopySaveEvent } from '../../common/storedFileWorkingCopy.js';
import { bufferToStream, newWriteableBufferStream, streamToBuffer, VSBuffer, VSBufferReadableStream } from '../../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { getLastResolvedFileStat, TestServiceAccessor, workbenchInstantiationService } from '../../../../test/browser/workbenchTestServices.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { basename } from '../../../../../base/common/resources.js';
import { FileChangesEvent, FileChangeType, FileOperationError, FileOperationResult, IFileStatWithMetadata, IWriteFileOptions, NotModifiedSinceFileOperationError } from '../../../../../platform/files/common/files.js';
import { SaveReason, SaveSourceRegistry } from '../../../../common/editor.js';
import { Promises, timeout } from '../../../../../base/common/async.js';
import { consumeReadable, consumeStream, isReadableStream } from '../../../../../base/common/stream.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { SnapshotContext } from '../../common/fileWorkingCopy.js';
import { assertReturnsDefined } from '../../../../../base/common/types.js';

export class TestStoredFileWorkingCopyModel extends Disposable implements IStoredFileWorkingCopyModel {

	private readonly _onDidChangeContent = this._register(new Emitter<IStoredFileWorkingCopyModelContentChangedEvent>());
	readonly onDidChangeContent = this._onDidChangeContent.event;

	private readonly _onWillDispose = this._register(new Emitter<void>());
	readonly onWillDispose = this._onWillDispose.event;

	constructor(readonly resource: URI, public contents: string) {
		super();
	}

	fireContentChangeEvent(event: IStoredFileWorkingCopyModelContentChangedEvent): void {
		this._onDidChangeContent.fire(event);
	}

	updateContents(newContents: string): void {
		this.doUpdate(newContents);
	}

	private throwOnSnapshot = false;
	setThrowOnSnapshot(): void {
		this.throwOnSnapshot = true;
	}

	async snapshot(context: SnapshotContext, token: CancellationToken): Promise<VSBufferReadableStream> {
		if (this.throwOnSnapshot) {
			throw new Error('Fail');
		}

		const stream = newWriteableBufferStream();
		stream.end(VSBuffer.fromString(this.contents));

		return stream;
	}

	async update(contents: VSBufferReadableStream, token: CancellationToken): Promise<void> {
		this.doUpdate((await streamToBuffer(contents)).toString());
	}

	private doUpdate(newContents: string): void {
		this.contents = newContents;

		this.versionId++;

		this._onDidChangeContent.fire({ isRedoing: false, isUndoing: false });
	}

	versionId = 0;

	pushedStackElement = false;

	pushStackElement(): void {
		this.pushedStackElement = true;
	}

	override dispose(): void {
		this._onWillDispose.fire();

		super.dispose();
	}
}

export class TestStoredFileWorkingCopyModelWithCustomSave extends TestStoredFileWorkingCopyModel {

	saveCounter = 0;
	throwOnSave = false;
	saveOperation: Promise<void> | undefined = undefined;

	async save(options: IWriteFileOptions, token: CancellationToken): Promise<IFileStatWithMetadata> {
		if (this.throwOnSave) {
			throw new Error('Fail');
		}

		if (this.saveOperation) {
			await this.saveOperation;
		}

		if (token.isCancellationRequested) {
			throw new Error('Canceled');
		}

		this.saveCounter++;

		return {
			resource: this.resource,
			ctime: 0,
			etag: '',
			isDirectory: false,
			isFile: true,
			mtime: 0,
			name: 'resource2',
			size: 0,
			isSymbolicLink: false,
			readonly: false,
			locked: false,
			children: undefined
		};
	}
}

export class TestStoredFileWorkingCopyModelFactory implements IStoredFileWorkingCopyModelFactory<TestStoredFileWorkingCopyModel> {

	async createModel(resource: URI, contents: VSBufferReadableStream, token: CancellationToken): Promise<TestStoredFileWorkingCopyModel> {
		return new TestStoredFileWorkingCopyModel(resource, (await streamToBuffer(contents)).toString());
	}
}

export class TestStoredFileWorkingCopyModelWithCustomSaveFactory implements IStoredFileWorkingCopyModelFactory<TestStoredFileWorkingCopyModelWithCustomSave> {

	async createModel(resource: URI, contents: VSBufferReadableStream, token: CancellationToken): Promise<TestStoredFileWorkingCopyModelWithCustomSave> {
		return new TestStoredFileWorkingCopyModelWithCustomSave(resource, (await streamToBuffer(contents)).toString());
	}
}

suite('StoredFileWorkingCopy (with custom save)', function () {

	const factory = new TestStoredFileWorkingCopyModelWithCustomSaveFactory();

	const disposables = new DisposableStore();

	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: StoredFileWorkingCopy<TestStoredFileWorkingCopyModelWithCustomSave>;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		const resource = URI.file('test/resource');
		workingCopy = disposables.add(new StoredFileWorkingCopy<TestStoredFileWorkingCopyModelWithCustomSave>('testStoredFileWorkingCopyType', resource, basename(resource), factory, options => workingCopy.resolve(options), accessor.fileService, accessor.logService, accessor.workingCopyFileService, accessor.filesConfigurationService, accessor.workingCopyBackupService, accessor.workingCopyService, accessor.notificationService, accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.progressService));
	});

	teardown(() => {
		disposables.clear();
	});

	test('save (custom implemented)', async () => {
		let savedCounter = 0;
		let lastSaveEvent: IStoredFileWorkingCopySaveEvent | undefined = undefined;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
			lastSaveEvent = e;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// unresolved
		await workingCopy.save();
		assert.strictEqual(savedCounter, 0);
		assert.strictEqual(saveErrorCounter, 0);

		// simple
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello save');
		await workingCopy.save();

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(lastSaveEvent!.reason, SaveReason.EXPLICIT);
		assert.ok(lastSaveEvent!.stat);
		assert.ok(isStoredFileWorkingCopySaveEvent(lastSaveEvent!));
		assert.strictEqual(workingCopy.model?.pushedStackElement, true);
		assert.strictEqual((workingCopy.model as TestStoredFileWorkingCopyModelWithCustomSave).saveCounter, 1);

		// error
		workingCopy.model?.updateContents('hello save error');
		(workingCopy.model as TestStoredFileWorkingCopyModelWithCustomSave).throwOnSave = true;
		await workingCopy.save();

		assert.strictEqual(saveErrorCounter, 1);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), true);
	});

	test('save cancelled (custom implemented)', async () => {
		let savedCounter = 0;
		let lastSaveEvent: IStoredFileWorkingCopySaveEvent | undefined = undefined;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
			lastSaveEvent = e;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		await workingCopy.resolve();
		let resolve: () => void;
		(workingCopy.model as TestStoredFileWorkingCopyModelWithCustomSave).saveOperation = new Promise(r => resolve = r);

		workingCopy.model?.updateContents('first');
		const firstSave = workingCopy.save();
		// cancel the first save by requesting a second while it is still mid operation
		workingCopy.model?.updateContents('second');
		const secondSave = workingCopy.save();
		resolve!();
		await firstSave;
		await secondSave;

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(lastSaveEvent!.reason, SaveReason.EXPLICIT);
		assert.ok(lastSaveEvent!.stat);
		assert.ok(isStoredFileWorkingCopySaveEvent(lastSaveEvent!));
		assert.strictEqual(workingCopy.model?.pushedStackElement, true);
		assert.strictEqual((workingCopy.model as TestStoredFileWorkingCopyModelWithCustomSave).saveCounter, 1);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

suite('StoredFileWorkingCopy', function () {

	const factory = new TestStoredFileWorkingCopyModelFactory();

	const disposables = new DisposableStore();
	const resource = URI.file('test/resource');
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;
	let workingCopy: StoredFileWorkingCopy<TestStoredFileWorkingCopyModel>;

	function createWorkingCopy(uri: URI = resource) {
		const workingCopy: StoredFileWorkingCopy<TestStoredFileWorkingCopyModel> = new StoredFileWorkingCopy<TestStoredFileWorkingCopyModel>('testStoredFileWorkingCopyType', uri, basename(uri), factory, options => workingCopy.resolve(options), accessor.fileService, accessor.logService, accessor.workingCopyFileService, accessor.filesConfigurationService, accessor.workingCopyBackupService, accessor.workingCopyService, accessor.notificationService, accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService, accessor.progressService);

		return workingCopy;
	}

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		workingCopy = disposables.add(createWorkingCopy());
	});

	teardown(() => {
		workingCopy.dispose();

		for (const workingCopy of accessor.workingCopyService.workingCopies) {
			(workingCopy as StoredFileWorkingCopy<TestStoredFileWorkingCopyModel>).dispose();
		}

		disposables.clear();
	});

	test('registers with working copy service', async () => {
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 1);

		workingCopy.dispose();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
	});

	test('orphaned tracking', async () => {
		return runWithFakedTimers({}, async () => {
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), false);

			let onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);

			onDidChangeOrphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);
			accessor.fileService.notExistsSet.delete(resource);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.ADDED }], false));

			await onDidChangeOrphanedPromise;
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), false);
		});
	});

	test('dirty / modified', async () => {
		assert.strictEqual(workingCopy.isModified(), false);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);

		await workingCopy.resolve();
		assert.strictEqual(workingCopy.isResolved(), true);

		let changeDirtyCounter = 0;
		disposables.add(workingCopy.onDidChangeDirty(() => {
			changeDirtyCounter++;
		}));

		let contentChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeContent(() => {
			contentChangeCounter++;
		}));

		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(() => {
			savedCounter++;
		}));

		// Dirty from: Model content change
		workingCopy.model?.updateContents('hello dirty');
		assert.strictEqual(contentChangeCounter, 1);

		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), true);
		assert.strictEqual(changeDirtyCounter, 1);

		await workingCopy.save();

		assert.strictEqual(workingCopy.isModified(), false);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);
		assert.strictEqual(changeDirtyCounter, 2);
		assert.strictEqual(savedCounter, 1);

		// Dirty from: Initial contents
		await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello dirty stream')) });

		assert.strictEqual(contentChangeCounter, 2); // content of model did not change
		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), true);
		assert.strictEqual(changeDirtyCounter, 3);

		await workingCopy.revert({ soft: true });

		assert.strictEqual(workingCopy.isModified(), false);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);
		assert.strictEqual(changeDirtyCounter, 4);

		// Modified from: API
		workingCopy.markModified();

		assert.strictEqual(workingCopy.isModified(), true);
		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), true);
		assert.strictEqual(changeDirtyCounter, 5);

		await workingCopy.revert();

		assert.strictEqual(workingCopy.isModified(), false);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);
		assert.strictEqual(changeDirtyCounter, 6);
	});

	test('dirty - working copy marks non-dirty when undo reaches saved version ID', async () => {
		await workingCopy.resolve();

		workingCopy.model?.updateContents('hello saved state');
		await workingCopy.save();
		assert.strictEqual(workingCopy.isDirty(), false);

		workingCopy.model?.updateContents('changing content once');
		assert.strictEqual(workingCopy.isDirty(), true);

		// Simulate an undo that goes back to the last (saved) version ID
		workingCopy.model!.versionId--;

		workingCopy.model?.fireContentChangeEvent({ isRedoing: false, isUndoing: true });
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('resolve (without backup)', async () => {
		let onDidResolveCounter = 0;
		disposables.add(workingCopy.onDidResolve(() => {
			onDidResolveCounter++;
		}));

		// resolve from file
		await workingCopy.resolve();
		assert.strictEqual(workingCopy.isResolved(), true);
		assert.strictEqual(onDidResolveCounter, 1);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Html');

		// dirty resolve returns early
		workingCopy.model?.updateContents('hello resolve');
		assert.strictEqual(workingCopy.isDirty(), true);
		await workingCopy.resolve();
		assert.strictEqual(onDidResolveCounter, 1);
		assert.strictEqual(workingCopy.model?.contents, 'hello resolve');

		// dirty resolve with contents updates contents
		await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello initial contents')) });
		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.model?.contents, 'hello initial contents');
		assert.strictEqual(onDidResolveCounter, 2);

		// resolve with pending save returns directly
		const pendingSave = workingCopy.save();
		await workingCopy.resolve();
		await pendingSave;
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.model?.contents, 'hello initial contents');
		assert.strictEqual(onDidResolveCounter, 2);

		// disposed resolve is not throwing an error
		workingCopy.dispose();
		await workingCopy.resolve();
		assert.strictEqual(workingCopy.isDisposed(), true);
		assert.strictEqual(onDidResolveCounter, 2);
	});

	test('resolve (with backup)', async () => {
		await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello backup')) });

		const backup = await workingCopy.backup(CancellationToken.None);
		await accessor.workingCopyBackupService.backup(workingCopy, backup.content, undefined, backup.meta);

		assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(workingCopy), true);

		workingCopy.dispose();

		// first resolve loads from backup
		workingCopy = createWorkingCopy();
		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.isReadonly(), false);
		assert.strictEqual(workingCopy.model?.contents, 'hello backup');

		workingCopy.model.updateContents('hello updated');
		await workingCopy.save();

		// subsequent resolve ignores any backups
		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Html');
	});

	test('resolve (with backup, preserves metadata and orphaned state)', async () => {
		return runWithFakedTimers({}, async () => {
			await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello backup')) });

			const orphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);

			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await orphanedPromise;
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);

			const backup = await workingCopy.backup(CancellationToken.None);
			await accessor.workingCopyBackupService.backup(workingCopy, backup.content, undefined, backup.meta);

			assert.strictEqual(accessor.workingCopyBackupService.hasBackupSync(workingCopy), true);

			workingCopy.dispose();

			workingCopy = createWorkingCopy();
			await workingCopy.resolve();

			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);

			const backup2 = await workingCopy.backup(CancellationToken.None);
			assert.deepStrictEqual(backup.meta, backup2.meta);
		});
	});

	test('resolve (updates orphaned state accordingly)', async () => {
		return runWithFakedTimers({}, async () => {
			await workingCopy.resolve();

			const orphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);

			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await orphanedPromise;
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);

			// resolving clears orphaned state when successful
			accessor.fileService.notExistsSet.delete(resource);
			await workingCopy.resolve({ forceReadFromFile: true });
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), false);

			// resolving adds orphaned state when fail to read
			try {
				accessor.fileService.readShouldThrowError = new FileOperationError('file not found', FileOperationResult.FILE_NOT_FOUND);
				await workingCopy.resolve();
				assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);
			} finally {
				accessor.fileService.readShouldThrowError = undefined;
			}
		});
	});

	test('stat.readonly and stat.locked can change when decreased mtime is ignored', async function () {

		await workingCopy.resolve();

		const stat = assertReturnsDefined(getLastResolvedFileStat(workingCopy));
		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('error', { ...stat, mtime: stat.mtime - 1, readonly: !stat.readonly, locked: !stat.locked });
			await workingCopy.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(getLastResolvedFileStat(workingCopy)?.mtime, stat.mtime, 'mtime should not decrease');
		assert.notStrictEqual(getLastResolvedFileStat(workingCopy)?.readonly, stat.readonly, 'readonly should have changed despite simultaneous attempt to decrease mtime');
		assert.notStrictEqual(getLastResolvedFileStat(workingCopy)?.locked, stat.locked, 'locked should have changed despite simultaneous attempt to decrease mtime');
	});

	test('resolve (FILE_NOT_MODIFIED_SINCE can be handled for resolved working copies)', async () => {
		await workingCopy.resolve();

		try {
			accessor.fileService.readShouldThrowError = new FileOperationError('file not modified since', FileOperationResult.FILE_NOT_MODIFIED_SINCE);
			await workingCopy.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(workingCopy.model?.contents, 'Hello Html');
	});

	test('resolve (FILE_NOT_MODIFIED_SINCE still updates readonly state)', async () => {
		let readonlyChangeCounter = 0;
		disposables.add(workingCopy.onDidChangeReadonly(() => readonlyChangeCounter++));

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isReadonly(), false);

		const stat = await accessor.fileService.resolve(workingCopy.resource, { resolveMetadata: true });

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: true });
			await workingCopy.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(!!workingCopy.isReadonly(), true);
		assert.strictEqual(readonlyChangeCounter, 1);

		try {
			accessor.fileService.readShouldThrowError = new NotModifiedSinceFileOperationError('file not modified since', { ...stat, readonly: false });
			await workingCopy.resolve();
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(workingCopy.isReadonly(), false);
		assert.strictEqual(readonlyChangeCounter, 2);
	});

	test('resolve does not alter content when model content changed in parallel', async () => {
		await workingCopy.resolve();

		const resolvePromise = workingCopy.resolve();

		workingCopy.model?.updateContents('changed content');

		await resolvePromise;

		assert.strictEqual(workingCopy.isDirty(), true);
		assert.strictEqual(workingCopy.model?.contents, 'changed content');
	});

	test('backup', async () => {
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello backup');

		const backup = await workingCopy.backup(CancellationToken.None);

		assert.ok(backup.meta);

		let backupContents: string | undefined = undefined;
		if (backup.content instanceof VSBuffer) {
			backupContents = backup.content.toString();
		} else if (isReadableStream(backup.content)) {
			backupContents = (await consumeStream(backup.content, chunks => VSBuffer.concat(chunks))).toString();
		} else if (backup.content) {
			backupContents = consumeReadable(backup.content, chunks => VSBuffer.concat(chunks)).toString();
		}

		assert.strictEqual(backupContents, 'hello backup');
	});

	test('save (no errors) - simple', async () => {
		let savedCounter = 0;
		let lastSaveEvent: IStoredFileWorkingCopySaveEvent | undefined = undefined;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
			lastSaveEvent = e;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// unresolved
		await workingCopy.save();
		assert.strictEqual(savedCounter, 0);
		assert.strictEqual(saveErrorCounter, 0);

		// simple
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello save');
		await workingCopy.save();

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(lastSaveEvent!.reason, SaveReason.EXPLICIT);
		assert.ok(lastSaveEvent!.stat);
		assert.ok(isStoredFileWorkingCopySaveEvent(lastSaveEvent!));
		assert.strictEqual(workingCopy.model?.pushedStackElement, true);
	});

	test('save (no errors) - save reason', async () => {
		let savedCounter = 0;
		let lastSaveEvent: IStoredFileWorkingCopySaveEvent | undefined = undefined;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
			lastSaveEvent = e;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// save reason
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello save');

		const source = SaveSourceRegistry.registerSource('testSource', 'Hello Save');
		await workingCopy.save({ reason: SaveReason.AUTO, source });

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(lastSaveEvent!.reason, SaveReason.AUTO);
		assert.strictEqual(lastSaveEvent!.source, source);
	});

	test('save (no errors) - multiple', async () => {
		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// multiple saves in parallel are fine and result
		// in a single save when content does not change
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello save');
		await Promises.settled([
			workingCopy.save({ reason: SaveReason.AUTO }),
			workingCopy.save({ reason: SaveReason.EXPLICIT }),
			workingCopy.save({ reason: SaveReason.WINDOW_CHANGE })
		]);

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('save (no errors) - multiple, cancellation', async () => {
		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// multiple saves in parallel are fine and result
		// in just one save operation (the second one
		// cancels the first)
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello save');
		const firstSave = workingCopy.save();
		workingCopy.model?.updateContents('hello save more');
		const secondSave = workingCopy.save();

		await Promises.settled([firstSave, secondSave]);
		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('save (no errors) - not forced but not dirty', async () => {
		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// no save when not forced and not dirty
		await workingCopy.resolve();
		await workingCopy.save();
		assert.strictEqual(savedCounter, 0);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('save (no errors) - forced but not dirty', async () => {
		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(e => {
			savedCounter++;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		// save when forced even when not dirty
		await workingCopy.resolve();
		await workingCopy.save({ force: true });
		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 0);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('save (no errors) - save clears orphaned', async () => {
		return runWithFakedTimers({}, async () => {
			let savedCounter = 0;
			disposables.add(workingCopy.onDidSave(e => {
				savedCounter++;
			}));

			let saveErrorCounter = 0;
			disposables.add(workingCopy.onDidSaveError(() => {
				saveErrorCounter++;
			}));

			await workingCopy.resolve();

			// save clears orphaned
			const orphanedPromise = Event.toPromise(workingCopy.onDidChangeOrphaned);

			accessor.fileService.notExistsSet.set(resource, true);
			accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.DELETED }], false));

			await orphanedPromise;
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), true);

			await workingCopy.save({ force: true });
			assert.strictEqual(savedCounter, 1);
			assert.strictEqual(saveErrorCounter, 0);
			assert.strictEqual(workingCopy.isDirty(), false);
			assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ORPHAN), false);
		});
	});

	test('save (errors)', async () => {
		let savedCounter = 0;
		disposables.add(workingCopy.onDidSave(reason => {
			savedCounter++;
		}));

		let saveErrorCounter = 0;
		disposables.add(workingCopy.onDidSaveError(() => {
			saveErrorCounter++;
		}));

		await workingCopy.resolve();

		// save error: any error marks working copy dirty
		try {
			accessor.fileService.writeShouldThrowError = new FileOperationError('write error', FileOperationResult.FILE_PERMISSION_DENIED);

			await workingCopy.save({ force: true });
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		assert.strictEqual(savedCounter, 0);
		assert.strictEqual(saveErrorCounter, 1);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.CONFLICT), false);
		assert.strictEqual(workingCopy.isDirty(), true);

		// save is a no-op unless forced when in error case
		await workingCopy.save({ reason: SaveReason.AUTO });
		assert.strictEqual(savedCounter, 0);
		assert.strictEqual(saveErrorCounter, 1);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.CONFLICT), false);
		assert.strictEqual(workingCopy.isDirty(), true);

		// save clears error flags when successful
		await workingCopy.save({ reason: SaveReason.EXPLICIT });
		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 1);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.CONFLICT), false);
		assert.strictEqual(workingCopy.isDirty(), false);

		// save error: conflict
		try {
			accessor.fileService.writeShouldThrowError = new FileOperationError('write error conflict', FileOperationResult.FILE_MODIFIED_SINCE);

			await workingCopy.save({ force: true });
		} catch (error) {
			// error is expected
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(saveErrorCounter, 2);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.CONFLICT), true);
		assert.strictEqual(workingCopy.isDirty(), true);

		// save clears error flags when successful
		await workingCopy.save({ reason: SaveReason.EXPLICIT });
		assert.strictEqual(savedCounter, 2);
		assert.strictEqual(saveErrorCounter, 2);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.ERROR), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.CONFLICT), false);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('save (errors, bubbles up with `ignoreErrorHandler`)', async () => {
		await workingCopy.resolve();

		let error: Error | undefined = undefined;
		try {
			accessor.fileService.writeShouldThrowError = new FileOperationError('write error', FileOperationResult.FILE_PERMISSION_DENIED);

			await workingCopy.save({ force: true, ignoreErrorHandler: true });
		} catch (e) {
			error = e;
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		assert.ok(error);
	});

	test('save - returns false when save fails', async function () {
		await workingCopy.resolve();

		try {
			accessor.fileService.writeShouldThrowError = new FileOperationError('write error', FileOperationResult.FILE_PERMISSION_DENIED);

			const res = await workingCopy.save({ force: true });
			assert.strictEqual(res, false);
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		const res = await workingCopy.save({ force: true });
		assert.strictEqual(res, true);
	});

	test('save participant', async () => {
		await workingCopy.resolve();

		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, false);

		let participationCounter = 0;
		const disposable = accessor.workingCopyFileService.addSaveParticipant({
			participate: async (wc) => {
				if (workingCopy === wc) {
					participationCounter++;
				}
			}
		});

		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, true);

		await workingCopy.save({ force: true });
		assert.strictEqual(participationCounter, 1);

		await workingCopy.save({ force: true, skipSaveParticipants: true });
		assert.strictEqual(participationCounter, 1);

		disposable.dispose();
		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, false);

		await workingCopy.save({ force: true });
		assert.strictEqual(participationCounter, 1);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (sync save)', async function () {
		await workingCopy.resolve();

		await testSaveFromSaveParticipant(workingCopy, false);
	});

	test('Save Participant, calling save from within is unsupported but does not explode (async save)', async function () {
		await workingCopy.resolve();

		await testSaveFromSaveParticipant(workingCopy, true);
	});

	async function testSaveFromSaveParticipant(workingCopy: StoredFileWorkingCopy<TestStoredFileWorkingCopyModel>, async: boolean): Promise<void> {
		const from = URI.file('testFrom');
		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, false);

		const disposable = accessor.workingCopyFileService.addSaveParticipant({
			participate: async (wc, context) => {

				if (async) {
					await timeout(10);
				}

				await workingCopy.save({ force: true });
			}
		});

		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, true);

		await workingCopy.save({ force: true, from });

		disposable.dispose();
	}

	test('Save Participant carries context', async function () {
		await workingCopy.resolve();

		const from = URI.file('testFrom');
		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, false);

		let e: Error | undefined = undefined;
		const disposable = accessor.workingCopyFileService.addSaveParticipant({
			participate: async (wc, context) => {
				try {
					assert.strictEqual(context.reason, SaveReason.EXPLICIT);
					assert.strictEqual(context.savedFrom?.toString(), from.toString());
				} catch (error) {
					e = error;
				}
			}
		});

		assert.strictEqual(accessor.workingCopyFileService.hasSaveParticipants, true);

		await workingCopy.save({ force: true, from });

		if (e) {
			throw e;
		}

		disposable.dispose();
	});

	test('revert', async () => {
		await workingCopy.resolve();
		workingCopy.model?.updateContents('hello revert');

		let revertedCounter = 0;
		disposables.add(workingCopy.onDidRevert(() => {
			revertedCounter++;
		}));

		// revert: soft
		await workingCopy.revert({ soft: true });

		assert.strictEqual(revertedCounter, 1);
		assert.strictEqual(workingCopy.isDirty(), false);
		assert.strictEqual(workingCopy.model?.contents, 'hello revert');

		// revert: not forced
		await workingCopy.revert();
		assert.strictEqual(revertedCounter, 1);
		assert.strictEqual(workingCopy.model?.contents, 'hello revert');

		// revert: forced
		await workingCopy.revert({ force: true });
		assert.strictEqual(revertedCounter, 2);
		assert.strictEqual(workingCopy.model?.contents, 'Hello Html');

		// revert: forced, error
		try {
			workingCopy.model?.updateContents('hello revert');
			accessor.fileService.readShouldThrowError = new FileOperationError('error', FileOperationResult.FILE_PERMISSION_DENIED);

			await workingCopy.revert({ force: true });
		} catch (error) {
			// expected (our error)
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(revertedCounter, 2);
		assert.strictEqual(workingCopy.isDirty(), true);

		// revert: forced, file not found error is ignored
		try {
			workingCopy.model?.updateContents('hello revert');
			accessor.fileService.readShouldThrowError = new FileOperationError('error', FileOperationResult.FILE_NOT_FOUND);

			await workingCopy.revert({ force: true });
		} catch (error) {
			// expected (our error)
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}

		assert.strictEqual(revertedCounter, 3);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('state', async () => {
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), true);

		await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello state')) });
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), true);

		const savePromise = workingCopy.save();
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), true);

		await savePromise;

		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
	});

	test('joinState', async () => {
		await workingCopy.resolve({ contents: bufferToStream(VSBuffer.fromString('hello state')) });

		workingCopy.save();
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), true);

		await workingCopy.joinState(StoredFileWorkingCopyState.PENDING_SAVE);

		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.DIRTY), false);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.SAVED), true);
		assert.strictEqual(workingCopy.hasState(StoredFileWorkingCopyState.PENDING_SAVE), false);
	});

	test('isReadonly, isResolved, dispose, isDisposed', async () => {
		assert.strictEqual(workingCopy.isResolved(), false);
		assert.strictEqual(workingCopy.isReadonly(), false);
		assert.strictEqual(workingCopy.isDisposed(), false);

		await workingCopy.resolve();

		assert.ok(workingCopy.model);
		assert.strictEqual(workingCopy.isResolved(), true);
		assert.strictEqual(workingCopy.isReadonly(), false);
		assert.strictEqual(workingCopy.isDisposed(), false);

		let disposedEvent = false;
		disposables.add(workingCopy.onWillDispose(() => {
			disposedEvent = true;
		}));

		let disposedModelEvent = false;
		disposables.add(workingCopy.model.onWillDispose(() => {
			disposedModelEvent = true;
		}));

		workingCopy.dispose();

		assert.strictEqual(workingCopy.isDisposed(), true);
		assert.strictEqual(disposedEvent, true);
		assert.strictEqual(disposedModelEvent, true);
	});

	test('readonly change event', async () => {
		accessor.fileService.readonly = true;

		await workingCopy.resolve();

		assert.strictEqual(!!workingCopy.isReadonly(), true);

		accessor.fileService.readonly = false;

		let readonlyEvent = false;
		disposables.add(workingCopy.onDidChangeReadonly(() => {
			readonlyEvent = true;
		}));

		await workingCopy.resolve();

		assert.strictEqual(workingCopy.isReadonly(), false);
		assert.strictEqual(readonlyEvent, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/workingCopy/test/browser/storedFileWorkingCopyManager.test.ts]---
Location: vscode-main/src/vs/workbench/services/workingCopy/test/browser/storedFileWorkingCopyManager.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { workbenchInstantiationService, TestServiceAccessor, TestWillShutdownEvent } from '../../../../test/browser/workbenchTestServices.js';
import { StoredFileWorkingCopyManager, IStoredFileWorkingCopyManager, IStoredFileWorkingCopySaveEvent } from '../../common/storedFileWorkingCopyManager.js';
import { IStoredFileWorkingCopy, IStoredFileWorkingCopyModel } from '../../common/storedFileWorkingCopy.js';
import { bufferToStream, VSBuffer } from '../../../../../base/common/buffer.js';
import { FileChangesEvent, FileChangeType, FileOperationError, FileOperationResult } from '../../../../../platform/files/common/files.js';
import { timeout } from '../../../../../base/common/async.js';
import { TestStoredFileWorkingCopyModel, TestStoredFileWorkingCopyModelFactory } from './storedFileWorkingCopy.test.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { isWeb } from '../../../../../base/common/platform.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('StoredFileWorkingCopyManager', () => {

	const disposables = new DisposableStore();
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	let manager: IStoredFileWorkingCopyManager<TestStoredFileWorkingCopyModel>;

	setup(() => {
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);

		manager = disposables.add(new StoredFileWorkingCopyManager<TestStoredFileWorkingCopyModel>(
			'testStoredFileWorkingCopyType',
			new TestStoredFileWorkingCopyModelFactory(),
			accessor.fileService, accessor.lifecycleService, accessor.labelService, accessor.logService,
			accessor.workingCopyFileService, accessor.workingCopyBackupService, accessor.uriIdentityService,
			accessor.filesConfigurationService, accessor.workingCopyService, accessor.notificationService,
			accessor.workingCopyEditorService, accessor.editorService, accessor.elevatedFileService,
			accessor.progressService
		));
	});

	teardown(() => {
		for (const workingCopy of manager.workingCopies) {
			workingCopy.dispose();
		}

		disposables.clear();
	});

	test('resolve', async () => {
		const resource = URI.file('/test.html');

		const events: IStoredFileWorkingCopy<IStoredFileWorkingCopyModel>[] = [];
		const listener = manager.onDidCreate(workingCopy => {
			events.push(workingCopy);
		});

		const resolvePromise = manager.resolve(resource);
		assert.ok(manager.get(resource)); // working copy known even before resolved()
		assert.strictEqual(manager.workingCopies.length, 1);

		const workingCopy1 = await resolvePromise;
		assert.ok(workingCopy1);
		assert.ok(workingCopy1.model);
		assert.strictEqual(workingCopy1.typeId, 'testStoredFileWorkingCopyType');
		assert.strictEqual(workingCopy1.resource.toString(), resource.toString());
		assert.strictEqual(manager.get(resource), workingCopy1);

		const workingCopy2 = await manager.resolve(resource);
		assert.strictEqual(workingCopy2, workingCopy1);
		assert.strictEqual(manager.workingCopies.length, 1);
		workingCopy1.dispose();

		const workingCopy3 = await manager.resolve(resource);
		assert.notStrictEqual(workingCopy3, workingCopy2);
		assert.strictEqual(manager.workingCopies.length, 1);
		assert.strictEqual(manager.get(resource), workingCopy3);
		workingCopy3.dispose();

		assert.strictEqual(manager.workingCopies.length, 0);

		assert.strictEqual(events.length, 2);
		assert.strictEqual(events[0].resource.toString(), workingCopy1.resource.toString());
		assert.strictEqual(events[1].resource.toString(), workingCopy2.resource.toString());

		listener.dispose();

		workingCopy1.dispose();
		workingCopy2.dispose();
		workingCopy3.dispose();
	});

	test('resolve (async)', async () => {
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		let didResolve = false;
		let onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model?.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		const resolve = manager.resolve(resource, { reload: { async: true } });

		await onDidResolve;

		assert.strictEqual(didResolve, true);

		didResolve = false;

		onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model?.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		manager.resolve(resource, { reload: { async: true, force: true } });

		await onDidResolve;

		assert.strictEqual(didResolve, true);

		disposables.add(await resolve);
	});

	test('resolve (sync)', async () => {
		const resource = URI.file('/path/index.txt');

		await manager.resolve(resource);

		let didResolve = false;
		disposables.add(manager.onDidResolve(({ model }) => {
			if (model?.resource.toString() === resource.toString()) {
				didResolve = true;
			}
		}));

		disposables.add(await manager.resolve(resource, { reload: { async: false } }));
		assert.strictEqual(didResolve, true);

		didResolve = false;

		disposables.add(await manager.resolve(resource, { reload: { async: false, force: true } }));
		assert.strictEqual(didResolve, true);
	});

	test('resolve (sync) - model disposed when error and first call to resolve', async () => {
		const resource = URI.file('/path/index.txt');

		accessor.fileService.readShouldThrowError = new FileOperationError('fail', FileOperationResult.FILE_OTHER_ERROR);

		try {
			let error: Error | undefined = undefined;
			try {
				await manager.resolve(resource);
			} catch (e) {
				error = e;
			}

			assert.ok(error);
			assert.strictEqual(manager.workingCopies.length, 0);
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}
	});

	test('resolve (sync) - model not disposed when error and model existed before', async () => {
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		accessor.fileService.readShouldThrowError = new FileOperationError('fail', FileOperationResult.FILE_OTHER_ERROR);

		try {
			let error: Error | undefined = undefined;
			try {
				await manager.resolve(resource, { reload: { async: false } });
			} catch (e) {
				error = e;
			}

			assert.ok(error);
			assert.strictEqual(manager.workingCopies.length, 1);
		} finally {
			accessor.fileService.readShouldThrowError = undefined;
		}
	});

	test('resolve with initial contents', async () => {
		const resource = URI.file('/test.html');

		const workingCopy = await manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('Hello World')) });
		assert.strictEqual(workingCopy.model?.contents, 'Hello World');
		assert.strictEqual(workingCopy.isDirty(), true);

		await manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('More Changes')) });
		assert.strictEqual(workingCopy.model?.contents, 'More Changes');
		assert.strictEqual(workingCopy.isDirty(), true);

		workingCopy.dispose();
	});

	test('multiple resolves execute in sequence (same resources)', async () => {
		const resource = URI.file('/test.html');

		const firstPromise = manager.resolve(resource);
		const secondPromise = manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('Hello World')) });
		const thirdPromise = manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('More Changes')) });

		await firstPromise;
		await secondPromise;
		const workingCopy = await thirdPromise;

		assert.strictEqual(workingCopy.model?.contents, 'More Changes');
		assert.strictEqual(workingCopy.isDirty(), true);

		workingCopy.dispose();
	});

	test('multiple resolves execute in parallel (different resources)', async () => {
		const resource1 = URI.file('/test1.html');
		const resource2 = URI.file('/test2.html');
		const resource3 = URI.file('/test3.html');

		const firstPromise = manager.resolve(resource1);
		const secondPromise = manager.resolve(resource2);
		const thirdPromise = manager.resolve(resource3);

		const [workingCopy1, workingCopy2, workingCopy3] = await Promise.all([firstPromise, secondPromise, thirdPromise]);

		assert.strictEqual(manager.workingCopies.length, 3);
		assert.strictEqual(workingCopy1.resource.toString(), resource1.toString());
		assert.strictEqual(workingCopy2.resource.toString(), resource2.toString());
		assert.strictEqual(workingCopy3.resource.toString(), resource3.toString());

		workingCopy1.dispose();
		workingCopy2.dispose();
		workingCopy3.dispose();
	});

	test('removed from cache when working copy or model gets disposed', async () => {
		const resource = URI.file('/test.html');

		let workingCopy = await manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('Hello World')) });

		assert.strictEqual(manager.get(URI.file('/test.html')), workingCopy);

		workingCopy.dispose();
		assert(!manager.get(URI.file('/test.html')));

		workingCopy = await manager.resolve(resource, { contents: bufferToStream(VSBuffer.fromString('Hello World')) });

		assert.strictEqual(manager.get(URI.file('/test.html')), workingCopy);

		workingCopy.model?.dispose();
		assert(!manager.get(URI.file('/test.html')));
	});

	test('events', async () => {
		const resource1 = URI.file('/path/index.txt');
		const resource2 = URI.file('/path/other.txt');

		let createdCounter = 0;
		let resolvedCounter = 0;
		let removedCounter = 0;
		let gotDirtyCounter = 0;
		let gotNonDirtyCounter = 0;
		let revertedCounter = 0;
		let savedCounter = 0;
		let saveErrorCounter = 0;

		disposables.add(manager.onDidCreate(() => {
			createdCounter++;
		}));

		disposables.add(manager.onDidRemove(resource => {
			if (resource.toString() === resource1.toString() || resource.toString() === resource2.toString()) {
				removedCounter++;
			}
		}));

		disposables.add(manager.onDidResolve(workingCopy => {
			if (workingCopy.resource.toString() === resource1.toString()) {
				resolvedCounter++;
			}
		}));

		disposables.add(manager.onDidChangeDirty(workingCopy => {
			if (workingCopy.resource.toString() === resource1.toString()) {
				if (workingCopy.isDirty()) {
					gotDirtyCounter++;
				} else {
					gotNonDirtyCounter++;
				}
			}
		}));

		disposables.add(manager.onDidRevert(workingCopy => {
			if (workingCopy.resource.toString() === resource1.toString()) {
				revertedCounter++;
			}
		}));

		let lastSaveEvent: IStoredFileWorkingCopySaveEvent<TestStoredFileWorkingCopyModel> | undefined = undefined;
		disposables.add(manager.onDidSave((e) => {
			if (e.workingCopy.resource.toString() === resource1.toString()) {
				lastSaveEvent = e;
				savedCounter++;
			}
		}));

		disposables.add(manager.onDidSaveError(workingCopy => {
			if (workingCopy.resource.toString() === resource1.toString()) {
				saveErrorCounter++;
			}
		}));

		const workingCopy1 = disposables.add(await manager.resolve(resource1));
		assert.strictEqual(resolvedCounter, 1);
		assert.strictEqual(createdCounter, 1);

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource: resource1, type: FileChangeType.DELETED }], false));
		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource: resource1, type: FileChangeType.ADDED }], false));

		const workingCopy2 = disposables.add(await manager.resolve(resource2));
		assert.strictEqual(resolvedCounter, 2);
		assert.strictEqual(createdCounter, 2);

		workingCopy1.model?.updateContents('changed');

		await workingCopy1.revert();
		workingCopy1.model?.updateContents('changed again');

		await workingCopy1.save();

		try {
			accessor.fileService.writeShouldThrowError = new FileOperationError('write error', FileOperationResult.FILE_PERMISSION_DENIED);

			await workingCopy1.save({ force: true });
		} finally {
			accessor.fileService.writeShouldThrowError = undefined;
		}

		workingCopy1.dispose();
		workingCopy2.dispose();

		await workingCopy1.revert();
		assert.strictEqual(removedCounter, 2);
		assert.strictEqual(gotDirtyCounter, 3);
		assert.strictEqual(gotNonDirtyCounter, 2);
		assert.strictEqual(revertedCounter, 1);
		assert.strictEqual(savedCounter, 1);
		assert.strictEqual(lastSaveEvent!.workingCopy, workingCopy1);
		assert.ok(lastSaveEvent!.stat);
		assert.strictEqual(saveErrorCounter, 1);
		assert.strictEqual(createdCounter, 2);

		workingCopy1.dispose();
		workingCopy2.dispose();
	});

	test('resolve registers as working copy and dispose clears', async () => {
		const resource1 = URI.file('/test1.html');
		const resource2 = URI.file('/test2.html');
		const resource3 = URI.file('/test3.html');

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);

		const firstPromise = manager.resolve(resource1);
		const secondPromise = manager.resolve(resource2);
		const thirdPromise = manager.resolve(resource3);

		await Promise.all([firstPromise, secondPromise, thirdPromise]);

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 3);
		assert.strictEqual(manager.workingCopies.length, 3);

		manager.dispose();

		assert.strictEqual(manager.workingCopies.length, 0);

		// dispose does not remove from working copy service, only `destroy` should
		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 3);

		disposables.add(await firstPromise);
		disposables.add(await secondPromise);
		disposables.add(await thirdPromise);
	});

	test('destroy', async () => {
		const resource1 = URI.file('/test1.html');
		const resource2 = URI.file('/test2.html');
		const resource3 = URI.file('/test3.html');

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);

		const firstPromise = manager.resolve(resource1);
		const secondPromise = manager.resolve(resource2);
		const thirdPromise = manager.resolve(resource3);

		await Promise.all([firstPromise, secondPromise, thirdPromise]);

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 3);
		assert.strictEqual(manager.workingCopies.length, 3);

		await manager.destroy();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.workingCopies.length, 0);
	});

	test('destroy saves dirty working copies', async () => {
		const resource = URI.file('/path/source.txt');

		const workingCopy = await manager.resolve(resource);

		let saved = false;
		disposables.add(workingCopy.onDidSave(() => {
			saved = true;
		}));

		workingCopy.model?.updateContents('hello create');
		assert.strictEqual(workingCopy.isDirty(), true);

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 1);
		assert.strictEqual(manager.workingCopies.length, 1);

		await manager.destroy();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.workingCopies.length, 0);

		assert.strictEqual(saved, true);
	});

	test('destroy falls back to using backup when save fails', async () => {
		const resource = URI.file('/path/source.txt');

		const workingCopy = await manager.resolve(resource);
		workingCopy.model?.setThrowOnSnapshot();

		let unexpectedSave = false;
		disposables.add(workingCopy.onDidSave(() => {
			unexpectedSave = true;
		}));

		workingCopy.model?.updateContents('hello create');
		assert.strictEqual(workingCopy.isDirty(), true);

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 1);
		assert.strictEqual(manager.workingCopies.length, 1);

		assert.strictEqual(accessor.workingCopyBackupService.resolved.has(workingCopy), true);

		await manager.destroy();

		assert.strictEqual(accessor.workingCopyService.workingCopies.length, 0);
		assert.strictEqual(manager.workingCopies.length, 0);

		assert.strictEqual(unexpectedSave, false);
	});

	test('file change event triggers working copy resolve', async () => {
		const resource = URI.file('/path/index.txt');

		await manager.resolve(resource);

		let didResolve = false;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model?.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.UPDATED }], false));

		await onDidResolve;

		assert.strictEqual(didResolve, true);
	});

	test('file change event triggers working copy resolve (when working copy is pending to resolve)', async () => {
		const resource = URI.file('/path/index.txt');

		manager.resolve(resource);

		let didResolve = false;
		let resolvedCounter = 0;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model?.resource.toString() === resource.toString()) {
					resolvedCounter++;
					if (resolvedCounter === 2) {
						didResolve = true;
						resolve();
					}
				}
			}));
		});

		accessor.fileService.fireFileChanges(new FileChangesEvent([{ resource, type: FileChangeType.UPDATED }], false));

		await onDidResolve;

		assert.strictEqual(didResolve, true);
	});

	test('file system provider change triggers working copy resolve', async () => {
		const resource = URI.file('/path/index.txt');

		disposables.add(await manager.resolve(resource));

		let didResolve = false;
		const onDidResolve = new Promise<void>(resolve => {
			disposables.add(manager.onDidResolve(({ model }) => {
				if (model?.resource.toString() === resource.toString()) {
					didResolve = true;
					resolve();
				}
			}));
		});

		accessor.fileService.fireFileSystemProviderCapabilitiesChangeEvent({ provider: disposables.add(new InMemoryFileSystemProvider()), scheme: resource.scheme });

		await onDidResolve;

		assert.strictEqual(didResolve, true);
	});

	test('working copy file event handling: create', async () => {
		const resource = URI.file('/path/source.txt');

		const workingCopy = await manager.resolve(resource);
		workingCopy.model?.updateContents('hello create');
		assert.strictEqual(workingCopy.isDirty(), true);

		await accessor.workingCopyFileService.create([{ resource }], CancellationToken.None);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('working copy file event handling: move', () => {
		return testMoveCopyFileWorkingCopy(true);
	});

	test('working copy file event handling: copy', () => {
		return testMoveCopyFileWorkingCopy(false);
	});

	async function testMoveCopyFileWorkingCopy(move: boolean) {
		const source = URI.file('/path/source.txt');
		const target = URI.file('/path/other.txt');

		const sourceWorkingCopy = await manager.resolve(source);
		sourceWorkingCopy.model?.updateContents('hello move or copy');
		assert.strictEqual(sourceWorkingCopy.isDirty(), true);

		if (move) {
			await accessor.workingCopyFileService.move([{ file: { source, target } }], CancellationToken.None);
		} else {
			await accessor.workingCopyFileService.copy([{ file: { source, target } }], CancellationToken.None);
		}

		const targetWorkingCopy = await manager.resolve(target);
		assert.strictEqual(targetWorkingCopy.isDirty(), true);
		assert.strictEqual(targetWorkingCopy.model?.contents, 'hello move or copy');
	}

	test('working copy file event handling: delete', async () => {
		const resource = URI.file('/path/source.txt');

		const workingCopy = await manager.resolve(resource);
		workingCopy.model?.updateContents('hello delete');
		assert.strictEqual(workingCopy.isDirty(), true);

		await accessor.workingCopyFileService.delete([{ resource }], CancellationToken.None);
		assert.strictEqual(workingCopy.isDirty(), false);
	});

	test('working copy file event handling: move to same resource', async () => {
		const source = URI.file('/path/source.txt');

		const sourceWorkingCopy = await manager.resolve(source);
		sourceWorkingCopy.model?.updateContents('hello move');
		assert.strictEqual(sourceWorkingCopy.isDirty(), true);

		await accessor.workingCopyFileService.move([{ file: { source, target: source } }], CancellationToken.None);

		assert.strictEqual(sourceWorkingCopy.isDirty(), true);
		assert.strictEqual(sourceWorkingCopy.model?.contents, 'hello move');
	});

	test('canDispose with dirty working copy', async () => {
		const resource = URI.file('/path/index_something.txt');

		const workingCopy = await manager.resolve(resource);
		workingCopy.model?.updateContents('make dirty');

		const canDisposePromise = manager.canDispose(workingCopy);
		assert.ok(canDisposePromise instanceof Promise);

		let canDispose = false;
		(async () => {
			canDispose = await canDisposePromise;
		})();

		assert.strictEqual(canDispose, false);
		workingCopy.revert({ soft: true });

		await timeout(0);

		assert.strictEqual(canDispose, true);

		const canDispose2 = manager.canDispose(workingCopy);
		assert.strictEqual(canDispose2, true);
	});

	(isWeb ? test.skip : test)('pending saves join on shutdown', async () => {
		const resource1 = URI.file('/path/index_something1.txt');
		const resource2 = URI.file('/path/index_something2.txt');

		const workingCopy1 = disposables.add(await manager.resolve(resource1));
		workingCopy1.model?.updateContents('make dirty');

		const workingCopy2 = disposables.add(await manager.resolve(resource2));
		workingCopy2.model?.updateContents('make dirty');

		let saved1 = false;
		workingCopy1.save().then(() => {
			saved1 = true;
		});

		let saved2 = false;
		workingCopy2.save().then(() => {
			saved2 = true;
		});

		const event = new TestWillShutdownEvent();
		accessor.lifecycleService.fireWillShutdown(event);

		assert.ok(event.value.length > 0);
		await Promise.all(event.value);

		assert.strictEqual(saved1, true);
		assert.strictEqual(saved2, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

````
