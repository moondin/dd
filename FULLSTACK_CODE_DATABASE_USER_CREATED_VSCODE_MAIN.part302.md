---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 302
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 302 of 552)

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

---[FILE: src/vs/workbench/api/browser/mainThreadFileSystem.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadFileSystem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, toDisposable, DisposableStore, DisposableMap } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IFileWriteOptions, FileSystemProviderCapabilities, IFileChange, IFileService, IStat, IWatchOptions, FileType, IFileOverwriteOptions, IFileDeleteOptions, IFileOpenOptions, FileOperationError, FileOperationResult, FileSystemProviderErrorCode, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithFileFolderCopyCapability, FilePermission, toFileSystemProviderErrorCode, IFileStatWithPartialMetadata, IFileStat } from '../../../platform/files/common/files.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostFileSystemShape, IFileChangeDto, MainContext, MainThreadFileSystemShape } from '../common/extHost.protocol.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { IMarkdownString } from '../../../base/common/htmlContent.js';

@extHostNamedCustomer(MainContext.MainThreadFileSystem)
export class MainThreadFileSystem implements MainThreadFileSystemShape {

	private readonly _proxy: ExtHostFileSystemShape;
	private readonly _fileProvider = new DisposableMap<number, RemoteFileSystemProvider>();
	private readonly _disposables = new DisposableStore();

	constructor(
		extHostContext: IExtHostContext,
		@IFileService private readonly _fileService: IFileService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostFileSystem);

		const infoProxy = extHostContext.getProxy(ExtHostContext.ExtHostFileSystemInfo);

		for (const entry of _fileService.listCapabilities()) {
			infoProxy.$acceptProviderInfos(URI.from({ scheme: entry.scheme, path: '/dummy' }), entry.capabilities);
		}
		this._disposables.add(_fileService.onDidChangeFileSystemProviderRegistrations(e => infoProxy.$acceptProviderInfos(URI.from({ scheme: e.scheme, path: '/dummy' }), e.provider?.capabilities ?? null)));
		this._disposables.add(_fileService.onDidChangeFileSystemProviderCapabilities(e => infoProxy.$acceptProviderInfos(URI.from({ scheme: e.scheme, path: '/dummy' }), e.provider.capabilities)));
	}

	dispose(): void {
		this._disposables.dispose();
		this._fileProvider.dispose();
	}

	async $registerFileSystemProvider(handle: number, scheme: string, capabilities: FileSystemProviderCapabilities, readonlyMessage?: IMarkdownString): Promise<void> {
		this._fileProvider.set(handle, new RemoteFileSystemProvider(this._fileService, scheme, capabilities, readonlyMessage, handle, this._proxy));
	}

	$unregisterProvider(handle: number): void {
		this._fileProvider.deleteAndDispose(handle);
	}

	$onFileSystemChange(handle: number, changes: IFileChangeDto[]): void {
		const fileProvider = this._fileProvider.get(handle);
		if (!fileProvider) {
			throw new Error('Unknown file provider');
		}
		fileProvider.$onFileSystemChange(changes);
	}


	// --- consumer fs, vscode.workspace.fs

	async $stat(uri: UriComponents): Promise<IStat> {
		try {
			const stat = await this._fileService.stat(URI.revive(uri));
			return {
				ctime: stat.ctime,
				mtime: stat.mtime,
				size: stat.size,
				permissions: stat.readonly ? FilePermission.Readonly : undefined,
				type: MainThreadFileSystem._asFileType(stat)
			};
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $readdir(uri: UriComponents): Promise<[string, FileType][]> {
		try {
			const stat = await this._fileService.resolve(URI.revive(uri), { resolveMetadata: false });
			if (!stat.isDirectory) {
				const err = new Error(stat.name);
				err.name = FileSystemProviderErrorCode.FileNotADirectory;
				throw err;
			}
			return !stat.children ? [] : stat.children.map(child => [child.name, MainThreadFileSystem._asFileType(child)] as [string, FileType]);
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	private static _asFileType(stat: IFileStat | IFileStatWithPartialMetadata): FileType {
		let res = 0;
		if (stat.isFile) {
			res += FileType.File;

		} else if (stat.isDirectory) {
			res += FileType.Directory;
		}
		if (stat.isSymbolicLink) {
			res += FileType.SymbolicLink;
		}
		return res;
	}

	async $readFile(uri: UriComponents): Promise<VSBuffer> {
		try {
			const file = await this._fileService.readFile(URI.revive(uri));
			return file.value;
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $writeFile(uri: UriComponents, content: VSBuffer): Promise<void> {
		try {
			await this._fileService.writeFile(URI.revive(uri), content);
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $rename(source: UriComponents, target: UriComponents, opts: IFileOverwriteOptions): Promise<void> {
		try {
			await this._fileService.move(URI.revive(source), URI.revive(target), opts.overwrite);
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $copy(source: UriComponents, target: UriComponents, opts: IFileOverwriteOptions): Promise<void> {
		try {
			await this._fileService.copy(URI.revive(source), URI.revive(target), opts.overwrite);
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $mkdir(uri: UriComponents): Promise<void> {
		try {
			await this._fileService.createFolder(URI.revive(uri));
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	async $delete(uri: UriComponents, opts: IFileDeleteOptions): Promise<void> {
		try {
			return await this._fileService.del(URI.revive(uri), opts);
		} catch (err) {
			return MainThreadFileSystem._handleError(err);
		}
	}

	private static _handleError(err: unknown): never {
		if (err instanceof FileOperationError) {
			switch (err.fileOperationResult) {
				case FileOperationResult.FILE_NOT_FOUND:
					err.name = FileSystemProviderErrorCode.FileNotFound;
					break;
				case FileOperationResult.FILE_IS_DIRECTORY:
					err.name = FileSystemProviderErrorCode.FileIsADirectory;
					break;
				case FileOperationResult.FILE_PERMISSION_DENIED:
					err.name = FileSystemProviderErrorCode.NoPermissions;
					break;
				case FileOperationResult.FILE_MOVE_CONFLICT:
					err.name = FileSystemProviderErrorCode.FileExists;
					break;
			}
		} else if (err instanceof Error) {
			const code = toFileSystemProviderErrorCode(err);
			if (code !== FileSystemProviderErrorCode.Unknown) {
				err.name = code;
			}
		}

		throw err;
	}

	$ensureActivation(scheme: string): Promise<void> {
		return this._fileService.activateProvider(scheme);
	}
}

class RemoteFileSystemProvider implements IFileSystemProviderWithFileReadWriteCapability, IFileSystemProviderWithOpenReadWriteCloseCapability, IFileSystemProviderWithFileFolderCopyCapability {

	private readonly _onDidChange = new Emitter<readonly IFileChange[]>();
	private readonly _registration: IDisposable;

	readonly onDidChangeFile: Event<readonly IFileChange[]> = this._onDidChange.event;

	readonly capabilities: FileSystemProviderCapabilities;
	readonly onDidChangeCapabilities: Event<void> = Event.None;

	constructor(
		fileService: IFileService,
		scheme: string,
		capabilities: FileSystemProviderCapabilities,
		public readonly readOnlyMessage: IMarkdownString | undefined,
		private readonly _handle: number,
		private readonly _proxy: ExtHostFileSystemShape
	) {
		this.capabilities = capabilities;
		this._registration = fileService.registerProvider(scheme, this);
	}

	dispose(): void {
		this._registration.dispose();
		this._onDidChange.dispose();
	}

	watch(resource: URI, opts: IWatchOptions) {
		const session = Math.random();
		this._proxy.$watch(this._handle, session, resource, opts);
		return toDisposable(() => {
			this._proxy.$unwatch(this._handle, session);
		});
	}

	$onFileSystemChange(changes: IFileChangeDto[]): void {
		this._onDidChange.fire(changes.map(RemoteFileSystemProvider._createFileChange));
	}

	private static _createFileChange(dto: IFileChangeDto): IFileChange {
		return { resource: URI.revive(dto.resource), type: dto.type };
	}

	// --- forwarding calls

	async stat(resource: URI): Promise<IStat> {
		try {
			return await this._proxy.$stat(this._handle, resource);
		} catch (err) {
			throw err;
		}
	}

	async readFile(resource: URI): Promise<Uint8Array> {
		const buffer = await this._proxy.$readFile(this._handle, resource);
		return buffer.buffer;
	}

	writeFile(resource: URI, content: Uint8Array, opts: IFileWriteOptions): Promise<void> {
		return this._proxy.$writeFile(this._handle, resource, VSBuffer.wrap(content), opts);
	}

	delete(resource: URI, opts: IFileDeleteOptions): Promise<void> {
		return this._proxy.$delete(this._handle, resource, opts);
	}

	mkdir(resource: URI): Promise<void> {
		return this._proxy.$mkdir(this._handle, resource);
	}

	readdir(resource: URI): Promise<[string, FileType][]> {
		return this._proxy.$readdir(this._handle, resource);
	}

	rename(resource: URI, target: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this._proxy.$rename(this._handle, resource, target, opts);
	}

	copy(resource: URI, target: URI, opts: IFileOverwriteOptions): Promise<void> {
		return this._proxy.$copy(this._handle, resource, target, opts);
	}

	open(resource: URI, opts: IFileOpenOptions): Promise<number> {
		return this._proxy.$open(this._handle, resource, opts);
	}

	close(fd: number): Promise<void> {
		return this._proxy.$close(this._handle, fd);
	}

	async read(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		const readData = await this._proxy.$read(this._handle, fd, pos, length);
		data.set(readData.buffer, offset);
		return readData.byteLength;
	}

	write(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number> {
		return this._proxy.$write(this._handle, fd, pos, VSBuffer.wrap(data).slice(offset, offset + length));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadFileSystemEventService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadFileSystemEventService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableMap, DisposableStore } from '../../../base/common/lifecycle.js';
import { FileOperation, IFileService, IWatchOptions } from '../../../platform/files/common/files.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostFileSystemEventServiceShape, MainContext, MainThreadFileSystemEventServiceShape } from '../common/extHost.protocol.js';
import { localize } from '../../../nls.js';
import { IWorkingCopyFileOperationParticipant, IWorkingCopyFileService, SourceTargetPair, IFileOperationUndoRedoInfo } from '../../services/workingCopy/common/workingCopyFileService.js';
import { IBulkEditService } from '../../../editor/browser/services/bulkEditService.js';
import { IProgressService, ProgressLocation } from '../../../platform/progress/common/progress.js';
import { raceCancellation } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import Severity from '../../../base/common/severity.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { Action2, registerAction2 } from '../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { reviveWorkspaceEditDto } from './mainThreadBulkEdits.js';
import { UriComponents, URI } from '../../../base/common/uri.js';

@extHostNamedCustomer(MainContext.MainThreadFileSystemEventService)
export class MainThreadFileSystemEventService implements MainThreadFileSystemEventServiceShape {

	static readonly MementoKeyAdditionalEdits = `file.particpants.additionalEdits`;

	private readonly _proxy: ExtHostFileSystemEventServiceShape;

	private readonly _listener = new DisposableStore();
	private readonly _watches = new DisposableMap<number>();

	constructor(
		extHostContext: IExtHostContext,
		@IFileService private readonly _fileService: IFileService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IBulkEditService bulkEditService: IBulkEditService,
		@IProgressService progressService: IProgressService,
		@IDialogService dialogService: IDialogService,
		@IStorageService storageService: IStorageService,
		@ILogService logService: ILogService,
		@IEnvironmentService envService: IEnvironmentService,
		@IUriIdentityService uriIdentService: IUriIdentityService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostFileSystemEventService);

		this._listener.add(_fileService.onDidFilesChange(event => {
			this._proxy.$onFileEvent({
				created: event.rawAdded,
				changed: event.rawUpdated,
				deleted: event.rawDeleted
			});
		}));

		const that = this;
		const fileOperationParticipant = new class implements IWorkingCopyFileOperationParticipant {
			async participate(files: SourceTargetPair[], operation: FileOperation, undoInfo: IFileOperationUndoRedoInfo | undefined, timeout: number, token: CancellationToken) {
				if (undoInfo?.isUndoing) {
					return;
				}

				const cts = new CancellationTokenSource(token);
				const timer = setTimeout(() => cts.cancel(), timeout);

				const data = await progressService.withProgress({
					location: ProgressLocation.Notification,
					title: this._progressLabel(operation),
					cancellable: true,
					delay: Math.min(timeout / 2, 3000)
				}, () => {
					// race extension host event delivery against timeout AND user-cancel
					const onWillEvent = that._proxy.$onWillRunFileOperation(operation, files, timeout, cts.token);
					return raceCancellation(onWillEvent, cts.token);
				}, () => {
					// user-cancel
					cts.cancel();

				}).finally(() => {
					cts.dispose();
					clearTimeout(timer);
				});

				if (!data || data.edit.edits.length === 0) {
					// cancelled, no reply, or no edits
					return;
				}

				const needsConfirmation = data.edit.edits.some(edit => edit.metadata?.needsConfirmation);
				let showPreview = storageService.getBoolean(MainThreadFileSystemEventService.MementoKeyAdditionalEdits, StorageScope.PROFILE);

				if (envService.extensionTestsLocationURI) {
					// don't show dialog in tests
					showPreview = false;
				}

				if (showPreview === undefined) {
					// show a user facing message

					let message: string;
					if (data.extensionNames.length === 1) {
						if (operation === FileOperation.CREATE) {
							message = localize('ask.1.create', "Extension '{0}' wants to make refactoring changes with this file creation", data.extensionNames[0]);
						} else if (operation === FileOperation.COPY) {
							message = localize('ask.1.copy', "Extension '{0}' wants to make refactoring changes with this file copy", data.extensionNames[0]);
						} else if (operation === FileOperation.MOVE) {
							message = localize('ask.1.move', "Extension '{0}' wants to make refactoring changes with this file move", data.extensionNames[0]);
						} else /* if (operation === FileOperation.DELETE) */ {
							message = localize('ask.1.delete', "Extension '{0}' wants to make refactoring changes with this file deletion", data.extensionNames[0]);
						}
					} else {
						if (operation === FileOperation.CREATE) {
							message = localize({ key: 'ask.N.create', comment: ['{0} is a number, e.g "3 extensions want..."'] }, "{0} extensions want to make refactoring changes with this file creation", data.extensionNames.length);
						} else if (operation === FileOperation.COPY) {
							message = localize({ key: 'ask.N.copy', comment: ['{0} is a number, e.g "3 extensions want..."'] }, "{0} extensions want to make refactoring changes with this file copy", data.extensionNames.length);
						} else if (operation === FileOperation.MOVE) {
							message = localize({ key: 'ask.N.move', comment: ['{0} is a number, e.g "3 extensions want..."'] }, "{0} extensions want to make refactoring changes with this file move", data.extensionNames.length);
						} else /* if (operation === FileOperation.DELETE) */ {
							message = localize({ key: 'ask.N.delete', comment: ['{0} is a number, e.g "3 extensions want..."'] }, "{0} extensions want to make refactoring changes with this file deletion", data.extensionNames.length);
						}
					}

					if (needsConfirmation) {
						// edit which needs confirmation -> always show dialog
						const { confirmed } = await dialogService.confirm({
							type: Severity.Info,
							message,
							primaryButton: localize('preview', "Show &&Preview"),
							cancelButton: localize('cancel', "Skip Changes")
						});
						showPreview = true;
						if (!confirmed) {
							// no changes wanted
							return;
						}
					} else {
						// choice
						enum Choice {
							OK = 0,
							Preview = 1,
							Cancel = 2
						}
						const { result, checkboxChecked } = await dialogService.prompt<Choice>({
							type: Severity.Info,
							message,
							buttons: [
								{
									label: localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
									run: () => Choice.OK
								},
								{
									label: localize({ key: 'preview', comment: ['&& denotes a mnemonic'] }, "Show &&Preview"),
									run: () => Choice.Preview
								}
							],
							cancelButton: {
								label: localize('cancel', "Skip Changes"),
								run: () => Choice.Cancel
							},
							checkbox: { label: localize('again', "Do not ask me again") }
						});
						if (result === Choice.Cancel) {
							// no changes wanted, don't persist cancel option
							return;
						}
						showPreview = result === Choice.Preview;
						if (checkboxChecked) {
							storageService.store(MainThreadFileSystemEventService.MementoKeyAdditionalEdits, showPreview, StorageScope.PROFILE, StorageTarget.USER);
						}
					}
				}

				logService.info('[onWill-handler] applying additional workspace edit from extensions', data.extensionNames);

				await bulkEditService.apply(
					reviveWorkspaceEditDto(data.edit, uriIdentService),
					{ undoRedoGroupId: undoInfo?.undoRedoGroupId, showPreview }
				);
			}

			private _progressLabel(operation: FileOperation): string {
				switch (operation) {
					case FileOperation.CREATE:
						return localize('msg-create', "Running 'File Create' participants...");
					case FileOperation.MOVE:
						return localize('msg-rename', "Running 'File Rename' participants...");
					case FileOperation.COPY:
						return localize('msg-copy', "Running 'File Copy' participants...");
					case FileOperation.DELETE:
						return localize('msg-delete', "Running 'File Delete' participants...");
					case FileOperation.WRITE:
						return localize('msg-write', "Running 'File Write' participants...");
				}
			}
		};

		// BEFORE file operation
		this._listener.add(workingCopyFileService.addFileOperationParticipant(fileOperationParticipant));

		// AFTER file operation
		this._listener.add(workingCopyFileService.onDidRunWorkingCopyFileOperation(e => this._proxy.$onDidRunFileOperation(e.operation, e.files)));
	}

	async $watch(extensionId: string, session: number, resource: UriComponents, unvalidatedOpts: IWatchOptions, correlate: boolean): Promise<void> {
		const uri = URI.revive(resource);

		const canHandleWatcher = await this._fileService.canHandleResource(uri);
		if (!canHandleWatcher) {
			this._logService.warn(`MainThreadFileSystemEventService#$watch(): cannot watch resource as its scheme is not handled by the file service (extension: ${extensionId}, path: ${uri.toString(true)})`);
		}

		const opts: IWatchOptions = {
			...unvalidatedOpts
		};

		// Convert a recursive watcher to a flat watcher if the path
		// turns out to not be a folder. Recursive watching is only
		// possible on folders, so we help all file watchers by checking
		// early.
		if (opts.recursive) {
			try {
				const stat = await this._fileService.stat(uri);
				if (!stat.isDirectory) {
					opts.recursive = false;
				}
			} catch (error) {
				// ignore
			}
		}

		// Correlated file watching: use an exclusive `createWatcher()`
		// Note: currently not enabled for extensions (but leaving in in case of future usage)
		if (correlate && !opts.recursive) {
			this._logService.trace(`MainThreadFileSystemEventService#$watch(): request to start watching correlated (extension: ${extensionId}, path: ${uri.toString(true)}, recursive: ${opts.recursive}, session: ${session}, excludes: ${JSON.stringify(opts.excludes)}, includes: ${JSON.stringify(opts.includes)})`);

			const watcherDisposables = new DisposableStore();
			const subscription = watcherDisposables.add(this._fileService.createWatcher(uri, { ...opts, recursive: false }));
			watcherDisposables.add(subscription.onDidChange(event => {
				this._proxy.$onFileEvent({
					session,
					created: event.rawAdded,
					changed: event.rawUpdated,
					deleted: event.rawDeleted
				});
			}));

			this._watches.set(session, watcherDisposables);
		}

		// Uncorrelated file watching: via shared `watch()`
		else {
			this._logService.trace(`MainThreadFileSystemEventService#$watch(): request to start watching uncorrelated (extension: ${extensionId}, path: ${uri.toString(true)}, recursive: ${opts.recursive}, session: ${session}, excludes: ${JSON.stringify(opts.excludes)}, includes: ${JSON.stringify(opts.includes)})`);

			const subscription = this._fileService.watch(uri, opts);
			this._watches.set(session, subscription);
		}
	}

	$unwatch(session: number): void {
		if (this._watches.has(session)) {
			this._logService.trace(`MainThreadFileSystemEventService#$unwatch(): request to stop watching (session: ${session})`);
			this._watches.deleteAndDispose(session);
		}
	}

	dispose(): void {
		this._listener.dispose();
		this._watches.dispose();
	}
}

registerAction2(class ResetMemento extends Action2 {
	constructor() {
		super({
			id: 'files.participants.resetChoice',
			title: {
				value: localize('label', "Reset choice for 'File operation needs preview'"),
				original: `Reset choice for 'File operation needs preview'`
			},
			f1: true
		});
	}
	run(accessor: ServicesAccessor) {
		accessor.get(IStorageService).remove(MainThreadFileSystemEventService.MementoKeyAdditionalEdits, StorageScope.PROFILE);
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadInteractive.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadInteractive.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../base/common/lifecycle.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../editor/common/languages/modesRegistry.js';
import { ExtHostContext, ExtHostInteractiveShape, MainContext, MainThreadInteractiveShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IInteractiveDocumentService } from '../../contrib/interactive/browser/interactiveDocumentService.js';

@extHostNamedCustomer(MainContext.MainThreadInteractive)
export class MainThreadInteractive implements MainThreadInteractiveShape {
	private readonly _proxy: ExtHostInteractiveShape;

	private readonly _disposables = new DisposableStore();

	constructor(
		extHostContext: IExtHostContext,
		@IInteractiveDocumentService interactiveDocumentService: IInteractiveDocumentService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostInteractive);

		this._disposables.add(interactiveDocumentService.onWillAddInteractiveDocument((e) => {
			this._proxy.$willAddInteractiveDocument(e.inputUri, '\n', PLAINTEXT_LANGUAGE_ID, e.notebookUri);
		}));

		this._disposables.add(interactiveDocumentService.onWillRemoveInteractiveDocument((e) => {
			this._proxy.$willRemoveInteractiveDocument(e.inputUri, e.notebookUri);
		}));
	}

	dispose(): void {
		this._disposables.dispose();

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLabelService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLabelService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { ILabelService, ResourceLabelFormatter } from '../../../platform/label/common/label.js';
import { MainContext, MainThreadLabelServiceShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadLabelService)
export class MainThreadLabelService extends Disposable implements MainThreadLabelServiceShape {

	private readonly _resourceLabelFormatters = this._register(new DisposableMap<number>());

	constructor(
		_: IExtHostContext,
		@ILabelService private readonly _labelService: ILabelService
	) {
		super();
	}

	$registerResourceLabelFormatter(handle: number, formatter: ResourceLabelFormatter): void {
		// Dynamicily registered formatters should have priority over those contributed via package.json
		formatter.priority = true;
		const disposable = this._labelService.registerCachedFormatter(formatter);
		this._resourceLabelFormatters.set(handle, disposable);
	}

	$unregisterResourceLabelFormatter(handle: number): void {
		this._resourceLabelFormatters.deleteAndDispose(handle);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLanguageFeatures.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLanguageFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { createStringDataTransferItem, IReadonlyVSDataTransfer, VSDataTransfer } from '../../../base/common/dataTransfer.js';
import { CancellationError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { HierarchicalKind } from '../../../base/common/hierarchicalKind.js';
import { combinedDisposable, Disposable, DisposableMap, toDisposable } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { revive } from '../../../base/common/marshalling.js';
import { mixin } from '../../../base/common/objects.js';
import { URI } from '../../../base/common/uri.js';
import { Position as EditorPosition, IPosition } from '../../../editor/common/core/position.js';
import { Range as EditorRange, IRange } from '../../../editor/common/core/range.js';
import { Selection } from '../../../editor/common/core/selection.js';
import * as languages from '../../../editor/common/languages.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IndentationRule, LanguageConfiguration, OnEnterRule } from '../../../editor/common/languages/languageConfiguration.js';
import { ILanguageConfigurationService } from '../../../editor/common/languages/languageConfigurationRegistry.js';
import { ITextModel } from '../../../editor/common/model.js';
import { ILanguageFeaturesService } from '../../../editor/common/services/languageFeatures.js';
import { decodeSemanticTokensDto } from '../../../editor/common/services/semanticTokensDto.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { reviveWorkspaceEditDto } from './mainThreadBulkEdits.js';
import * as typeConvert from '../common/extHostTypeConverters.js';
import { DataTransferFileCache } from '../common/shared/dataTransferCache.js';
import * as callh from '../../contrib/callHierarchy/common/callHierarchy.js';
import * as search from '../../contrib/search/common/search.js';
import * as typeh from '../../contrib/typeHierarchy/common/typeHierarchy.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostLanguageFeaturesShape, HoverWithId, ICallHierarchyItemDto, ICodeActionDto, ICodeActionProviderMetadataDto, IdentifiableInlineCompletion, IdentifiableInlineCompletions, IDocumentDropEditDto, IDocumentDropEditProviderMetadata, IDocumentFilterDto, IIndentationRuleDto, IInlayHintDto, IInlineCompletionModelInfoDto, ILanguageConfigurationDto, ILanguageWordDefinitionDto, ILinkDto, ILocationDto, ILocationLinkDto, IOnEnterRuleDto, IPasteEditDto, IPasteEditProviderMetadataDto, IRegExpDto, ISignatureHelpProviderMetadataDto, ISuggestDataDto, ISuggestDataDtoField, ISuggestResultDtoField, ITypeHierarchyItemDto, IWorkspaceSymbolDto, MainContext, MainThreadLanguageFeaturesShape } from '../common/extHost.protocol.js';
import { InlineCompletionEndOfLifeReasonKind } from '../common/extHostTypes.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { DataChannelForwardingTelemetryService, forwardToChannelIf, isCopilotLikeExtension } from '../../../platform/dataChannel/browser/forwardingTelemetryService.js';
import { IAiEditTelemetryService } from '../../contrib/editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { EditDeltaInfo } from '../../../editor/common/textModelEditSource.js';
import { IInlineCompletionsUnificationService } from '../../services/inlineCompletions/common/inlineCompletionsUnification.js';
import { InlineCompletionEndOfLifeEvent, sendInlineCompletionsEndOfLifeTelemetry } from '../../../editor/contrib/inlineCompletions/browser/telemetry.js';

@extHostNamedCustomer(MainContext.MainThreadLanguageFeatures)
export class MainThreadLanguageFeatures extends Disposable implements MainThreadLanguageFeaturesShape {

	private readonly _proxy: ExtHostLanguageFeaturesShape;
	private readonly _registrations = this._register(new DisposableMap<number>());

	constructor(
		extHostContext: IExtHostContext,
		@ILanguageService private readonly _languageService: ILanguageService,
		@ILanguageConfigurationService private readonly _languageConfigurationService: ILanguageConfigurationService,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IInlineCompletionsUnificationService private readonly _inlineCompletionsUnificationService: IInlineCompletionsUnificationService,
	) {
		super();

		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostLanguageFeatures);

		if (this._languageService) {
			const updateAllWordDefinitions = () => {
				const wordDefinitionDtos: ILanguageWordDefinitionDto[] = [];
				for (const languageId of _languageService.getRegisteredLanguageIds()) {
					const wordDefinition = this._languageConfigurationService.getLanguageConfiguration(languageId).getWordDefinition();
					wordDefinitionDtos.push({
						languageId: languageId,
						regexSource: wordDefinition.source,
						regexFlags: wordDefinition.flags
					});
				}
				this._proxy.$setWordDefinitions(wordDefinitionDtos);
			};
			this._register(this._languageConfigurationService.onDidChange((e) => {
				if (!e.languageId) {
					updateAllWordDefinitions();
				} else {
					const wordDefinition = this._languageConfigurationService.getLanguageConfiguration(e.languageId).getWordDefinition();
					this._proxy.$setWordDefinitions([{
						languageId: e.languageId,
						regexSource: wordDefinition.source,
						regexFlags: wordDefinition.flags
					}]);
				}
			}));
			updateAllWordDefinitions();
		}

		if (this._inlineCompletionsUnificationService) {
			this._register(this._inlineCompletionsUnificationService.onDidStateChange(() => {
				this._proxy.$acceptInlineCompletionsUnificationState(this._inlineCompletionsUnificationService.state);
			}));
			this._proxy.$acceptInlineCompletionsUnificationState(this._inlineCompletionsUnificationService.state);
		}
	}

	$unregister(handle: number): void {
		this._registrations.deleteAndDispose(handle);
	}

	//#region --- revive functions

	private static _reviveLocationDto(data?: ILocationDto): languages.Location;
	private static _reviveLocationDto(data?: ILocationDto[]): languages.Location[];
	private static _reviveLocationDto(data: ILocationDto | ILocationDto[] | undefined): languages.Location | languages.Location[] | undefined {
		if (!data) {
			return data;
		} else if (Array.isArray(data)) {
			data.forEach(l => MainThreadLanguageFeatures._reviveLocationDto(l));
			return <languages.Location[]>data;
		} else {
			data.uri = URI.revive(data.uri);
			return <languages.Location>data;
		}
	}

	private static _reviveLocationLinkDto(data: ILocationLinkDto): languages.LocationLink;
	private static _reviveLocationLinkDto(data: ILocationLinkDto[]): languages.LocationLink[];
	private static _reviveLocationLinkDto(data: ILocationLinkDto | ILocationLinkDto[]): languages.LocationLink | languages.LocationLink[] {
		if (!data) {
			return <languages.LocationLink>data;
		} else if (Array.isArray(data)) {
			data.forEach(l => MainThreadLanguageFeatures._reviveLocationLinkDto(l));
			return <languages.LocationLink[]>data;
		} else {
			data.uri = URI.revive(data.uri);
			return <languages.LocationLink>data;
		}
	}

	private static _reviveWorkspaceSymbolDto(data: IWorkspaceSymbolDto): search.IWorkspaceSymbol;
	private static _reviveWorkspaceSymbolDto(data: IWorkspaceSymbolDto[]): search.IWorkspaceSymbol[];
	private static _reviveWorkspaceSymbolDto(data: undefined): undefined;
	private static _reviveWorkspaceSymbolDto(data: IWorkspaceSymbolDto | IWorkspaceSymbolDto[] | undefined): search.IWorkspaceSymbol | search.IWorkspaceSymbol[] | undefined {
		if (!data) {
			return data;
		} else if (Array.isArray(data)) {
			data.forEach(MainThreadLanguageFeatures._reviveWorkspaceSymbolDto);
			return <search.IWorkspaceSymbol[]>data;
		} else {
			data.location = MainThreadLanguageFeatures._reviveLocationDto(data.location);
			return <search.IWorkspaceSymbol>data;
		}
	}

	private static _reviveCodeActionDto(data: ReadonlyArray<ICodeActionDto>, uriIdentService: IUriIdentityService): languages.CodeAction[] {
		data?.forEach(code => reviveWorkspaceEditDto(code.edit, uriIdentService));
		return <languages.CodeAction[]>data;
	}

	private static _reviveLinkDTO(data: ILinkDto): languages.ILink {
		if (data.url && typeof data.url !== 'string') {
			data.url = URI.revive(data.url);
		}
		return <languages.ILink>data;
	}

	private static _reviveCallHierarchyItemDto(data: ICallHierarchyItemDto | undefined): callh.CallHierarchyItem {
		if (data) {
			data.uri = URI.revive(data.uri);
		}
		return data as callh.CallHierarchyItem;
	}

	private static _reviveTypeHierarchyItemDto(data: ITypeHierarchyItemDto | undefined): typeh.TypeHierarchyItem {
		if (data) {
			data.uri = URI.revive(data.uri);
		}
		return data as typeh.TypeHierarchyItem;
	}

	//#endregion

	// --- outline

	$registerDocumentSymbolProvider(handle: number, selector: IDocumentFilterDto[], displayName: string): void {
		this._registrations.set(handle, this._languageFeaturesService.documentSymbolProvider.register(selector, {
			displayName,
			provideDocumentSymbols: (model: ITextModel, token: CancellationToken): Promise<languages.DocumentSymbol[] | undefined> => {
				return this._proxy.$provideDocumentSymbols(handle, model.uri, token);
			}
		}));
	}

	// --- code lens

	$registerCodeLensSupport(handle: number, selector: IDocumentFilterDto[], eventHandle: number | undefined): void {

		const provider: languages.CodeLensProvider = {
			provideCodeLenses: async (model: ITextModel, token: CancellationToken): Promise<languages.CodeLensList | undefined> => {
				const listDto = await this._proxy.$provideCodeLenses(handle, model.uri, token);
				if (!listDto) {
					return undefined;
				}
				return {
					lenses: listDto.lenses,
					dispose: () => listDto.cacheId && this._proxy.$releaseCodeLenses(handle, listDto.cacheId)
				};
			},
			resolveCodeLens: async (model: ITextModel, codeLens: languages.CodeLens, token: CancellationToken): Promise<languages.CodeLens | undefined> => {
				const result = await this._proxy.$resolveCodeLens(handle, codeLens, token);
				if (!result || token.isCancellationRequested) {
					return undefined;
				}

				return {
					...result,
					range: model.validateRange(result.range),
				};
			}
		};

		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<languages.CodeLensProvider>();
			this._registrations.set(eventHandle, emitter);
			provider.onDidChange = emitter.event;
		}

		this._registrations.set(handle, this._languageFeaturesService.codeLensProvider.register(selector, provider));
	}

	$emitCodeLensEvent(eventHandle: number, event?: unknown): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(event);
		}
	}

	// --- declaration

	$registerDefinitionSupport(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.definitionProvider.register(selector, {
			provideDefinition: (model, position, token): Promise<languages.LocationLink[]> => {
				return this._proxy.$provideDefinition(handle, model.uri, position, token).then(MainThreadLanguageFeatures._reviveLocationLinkDto);
			}
		}));
	}

	$registerDeclarationSupport(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.declarationProvider.register(selector, {
			provideDeclaration: (model, position, token) => {
				return this._proxy.$provideDeclaration(handle, model.uri, position, token).then(MainThreadLanguageFeatures._reviveLocationLinkDto);
			}
		}));
	}

	$registerImplementationSupport(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.implementationProvider.register(selector, {
			provideImplementation: (model, position, token): Promise<languages.LocationLink[]> => {
				return this._proxy.$provideImplementation(handle, model.uri, position, token).then(MainThreadLanguageFeatures._reviveLocationLinkDto);
			}
		}));
	}

	$registerTypeDefinitionSupport(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.typeDefinitionProvider.register(selector, {
			provideTypeDefinition: (model, position, token): Promise<languages.LocationLink[]> => {
				return this._proxy.$provideTypeDefinition(handle, model.uri, position, token).then(MainThreadLanguageFeatures._reviveLocationLinkDto);
			}
		}));
	}

	// --- extra info

	$registerHoverProvider(handle: number, selector: IDocumentFilterDto[]): void {
		/*
		const hoverFinalizationRegistry = new FinalizationRegistry((hoverId: number) => {
			this._proxy.$releaseHover(handle, hoverId);
		});
		*/
		this._registrations.set(handle, this._languageFeaturesService.hoverProvider.register(selector, {
			provideHover: async (model: ITextModel, position: EditorPosition, token: CancellationToken, context?: languages.HoverContext<HoverWithId>): Promise<HoverWithId | undefined> => {
				const serializedContext: languages.HoverContext<{ id: number }> = {
					verbosityRequest: context?.verbosityRequest ? {
						verbosityDelta: context.verbosityRequest.verbosityDelta,
						previousHover: { id: context.verbosityRequest.previousHover.id }
					} : undefined,
				};
				const hover = await this._proxy.$provideHover(handle, model.uri, position, serializedContext, token);
				// hoverFinalizationRegistry.register(hover, hover.id);
				return hover;
			}
		}));
	}

	// --- debug hover

	$registerEvaluatableExpressionProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.evaluatableExpressionProvider.register(selector, {
			provideEvaluatableExpression: (model: ITextModel, position: EditorPosition, token: CancellationToken): Promise<languages.EvaluatableExpression | undefined> => {
				return this._proxy.$provideEvaluatableExpression(handle, model.uri, position, token);
			}
		}));
	}

	// --- inline values

	$registerInlineValuesProvider(handle: number, selector: IDocumentFilterDto[], eventHandle: number | undefined): void {
		const provider: languages.InlineValuesProvider = {
			provideInlineValues: (model: ITextModel, viewPort: EditorRange, context: languages.InlineValueContext, token: CancellationToken): Promise<languages.InlineValue[] | undefined> => {
				return this._proxy.$provideInlineValues(handle, model.uri, viewPort, context, token);
			}
		};

		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._registrations.set(eventHandle, emitter);
			provider.onDidChangeInlineValues = emitter.event;
		}

		this._registrations.set(handle, this._languageFeaturesService.inlineValuesProvider.register(selector, provider));
	}

	$emitInlineValuesEvent(eventHandle: number, event?: unknown): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(event);
		}
	}

	// --- occurrences

	$registerDocumentHighlightProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.documentHighlightProvider.register(selector, {
			provideDocumentHighlights: (model: ITextModel, position: EditorPosition, token: CancellationToken): Promise<languages.DocumentHighlight[] | undefined> => {
				return this._proxy.$provideDocumentHighlights(handle, model.uri, position, token);
			}
		}));
	}

	$registerMultiDocumentHighlightProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.multiDocumentHighlightProvider.register(selector, {
			selector: selector,
			provideMultiDocumentHighlights: (model: ITextModel, position: EditorPosition, otherModels: ITextModel[], token: CancellationToken): Promise<Map<URI, languages.DocumentHighlight[]> | undefined> => {
				return this._proxy.$provideMultiDocumentHighlights(handle, model.uri, position, otherModels.map(model => model.uri), token).then(dto => {
					// dto should be non-null + non-undefined
					// dto length of 0 is valid, just no highlights, pass this through.
					if (dto === undefined || dto === null) {
						return undefined;
					}
					const result = new ResourceMap<languages.DocumentHighlight[]>();
					dto?.forEach(value => {
						// check if the URI exists already, if so, combine the highlights, otherwise create a new entry
						const uri = URI.revive(value.uri);
						if (result.has(uri)) {
							result.get(uri)!.push(...value.highlights);
						} else {
							result.set(uri, value.highlights);
						}
					});
					return result;
				});
			}
		}));
	}

	// --- linked editing

	$registerLinkedEditingRangeProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.linkedEditingRangeProvider.register(selector, {
			provideLinkedEditingRanges: async (model: ITextModel, position: EditorPosition, token: CancellationToken): Promise<languages.LinkedEditingRanges | undefined> => {
				const res = await this._proxy.$provideLinkedEditingRanges(handle, model.uri, position, token);
				if (res) {
					return {
						ranges: res.ranges,
						wordPattern: res.wordPattern ? MainThreadLanguageFeatures._reviveRegExp(res.wordPattern) : undefined
					};
				}
				return undefined;
			}
		}));
	}

	// --- references

	$registerReferenceSupport(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.referenceProvider.register(selector, {
			provideReferences: (model: ITextModel, position: EditorPosition, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[]> => {
				return this._proxy.$provideReferences(handle, model.uri, position, context, token).then(MainThreadLanguageFeatures._reviveLocationDto);
			}
		}));
	}

	// --- code actions

	$registerCodeActionSupport(handle: number, selector: IDocumentFilterDto[], metadata: ICodeActionProviderMetadataDto, displayName: string, extensionId: string, supportsResolve: boolean): void {
		const provider: languages.CodeActionProvider = {
			provideCodeActions: async (model: ITextModel, rangeOrSelection: EditorRange | Selection, context: languages.CodeActionContext, token: CancellationToken): Promise<languages.CodeActionList | undefined> => {
				const listDto = await this._proxy.$provideCodeActions(handle, model.uri, rangeOrSelection, context, token);
				if (!listDto) {
					return undefined;
				}
				return {
					actions: MainThreadLanguageFeatures._reviveCodeActionDto(listDto.actions, this._uriIdentService),
					dispose: () => {
						if (typeof listDto.cacheId === 'number') {
							this._proxy.$releaseCodeActions(handle, listDto.cacheId);
						}
					}
				};
			},
			providedCodeActionKinds: metadata.providedKinds,
			documentation: metadata.documentation,
			displayName,
			extensionId,
		};

		if (supportsResolve) {
			provider.resolveCodeAction = async (codeAction: languages.CodeAction, token: CancellationToken): Promise<languages.CodeAction> => {
				const resolved = await this._proxy.$resolveCodeAction(handle, (<ICodeActionDto>codeAction).cacheId!, token);
				if (resolved.edit) {
					codeAction.edit = reviveWorkspaceEditDto(resolved.edit, this._uriIdentService);
				}

				if (resolved.command) {
					codeAction.command = resolved.command;
				}

				return codeAction;
			};
		}

		this._registrations.set(handle, this._languageFeaturesService.codeActionProvider.register(selector, provider));
	}

	// --- copy paste action provider

	private readonly _pasteEditProviders = new Map<number, MainThreadPasteEditProvider>();

	$registerPasteEditProvider(handle: number, selector: IDocumentFilterDto[], metadata: IPasteEditProviderMetadataDto): void {
		const provider = new MainThreadPasteEditProvider(handle, this._proxy, metadata, this._uriIdentService);
		this._pasteEditProviders.set(handle, provider);
		this._registrations.set(handle, combinedDisposable(
			this._languageFeaturesService.documentPasteEditProvider.register(selector, provider),
			toDisposable(() => this._pasteEditProviders.delete(handle)),
		));
	}

	$resolvePasteFileData(handle: number, requestId: number, dataId: string): Promise<VSBuffer> {
		const provider = this._pasteEditProviders.get(handle);
		if (!provider) {
			throw new Error('Could not find provider');
		}
		return provider.resolveFileData(requestId, dataId);
	}

	// --- formatting

	$registerDocumentFormattingSupport(handle: number, selector: IDocumentFilterDto[], extensionId: ExtensionIdentifier, displayName: string): void {
		this._registrations.set(handle, this._languageFeaturesService.documentFormattingEditProvider.register(selector, {
			extensionId,
			displayName,
			provideDocumentFormattingEdits: (model: ITextModel, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> => {
				return this._proxy.$provideDocumentFormattingEdits(handle, model.uri, options, token);
			}
		}));
	}

	$registerRangeFormattingSupport(handle: number, selector: IDocumentFilterDto[], extensionId: ExtensionIdentifier, displayName: string, supportsRanges: boolean): void {
		this._registrations.set(handle, this._languageFeaturesService.documentRangeFormattingEditProvider.register(selector, {
			extensionId,
			displayName,
			provideDocumentRangeFormattingEdits: (model: ITextModel, range: EditorRange, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> => {
				return this._proxy.$provideDocumentRangeFormattingEdits(handle, model.uri, range, options, token);
			},
			provideDocumentRangesFormattingEdits: !supportsRanges
				? undefined
				: (model, ranges, options, token) => {
					return this._proxy.$provideDocumentRangesFormattingEdits(handle, model.uri, ranges, options, token);
				},
		}));
	}

	$registerOnTypeFormattingSupport(handle: number, selector: IDocumentFilterDto[], autoFormatTriggerCharacters: string[], extensionId: ExtensionIdentifier): void {
		this._registrations.set(handle, this._languageFeaturesService.onTypeFormattingEditProvider.register(selector, {
			extensionId,
			autoFormatTriggerCharacters,
			provideOnTypeFormattingEdits: (model: ITextModel, position: EditorPosition, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | undefined> => {
				return this._proxy.$provideOnTypeFormattingEdits(handle, model.uri, position, ch, options, token);
			}
		}));
	}

	// --- navigate type

	$registerNavigateTypeSupport(handle: number, supportsResolve: boolean): void {
		let lastResultId: number | undefined;

		const provider: search.IWorkspaceSymbolProvider = {
			provideWorkspaceSymbols: async (search: string, token: CancellationToken): Promise<search.IWorkspaceSymbol[]> => {
				const result = await this._proxy.$provideWorkspaceSymbols(handle, search, token);
				if (lastResultId !== undefined) {
					this._proxy.$releaseWorkspaceSymbols(handle, lastResultId);
				}
				lastResultId = result.cacheId;
				return MainThreadLanguageFeatures._reviveWorkspaceSymbolDto(result.symbols);
			}
		};
		if (supportsResolve) {
			provider.resolveWorkspaceSymbol = async (item: search.IWorkspaceSymbol, token: CancellationToken): Promise<search.IWorkspaceSymbol | undefined> => {
				const resolvedItem = await this._proxy.$resolveWorkspaceSymbol(handle, item, token);
				return resolvedItem && MainThreadLanguageFeatures._reviveWorkspaceSymbolDto(resolvedItem);
			};
		}
		this._registrations.set(handle, search.WorkspaceSymbolProviderRegistry.register(provider));
	}

	// --- rename

	$registerRenameSupport(handle: number, selector: IDocumentFilterDto[], supportResolveLocation: boolean): void {
		this._registrations.set(handle, this._languageFeaturesService.renameProvider.register(selector, {
			provideRenameEdits: (model: ITextModel, position: EditorPosition, newName: string, token: CancellationToken) => {
				return this._proxy.$provideRenameEdits(handle, model.uri, position, newName, token).then(data => reviveWorkspaceEditDto(data, this._uriIdentService));
			},
			resolveRenameLocation: supportResolveLocation
				? (model: ITextModel, position: EditorPosition, token: CancellationToken): Promise<languages.RenameLocation | undefined> => this._proxy.$resolveRenameLocation(handle, model.uri, position, token)
				: undefined
		}));
	}

	$registerNewSymbolNamesProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.newSymbolNamesProvider.register(selector, {
			supportsAutomaticNewSymbolNamesTriggerKind: this._proxy.$supportsAutomaticNewSymbolNamesTriggerKind(handle),
			provideNewSymbolNames: (model: ITextModel, range: IRange, triggerKind: languages.NewSymbolNameTriggerKind, token: CancellationToken): Promise<languages.NewSymbolName[] | undefined> => {
				return this._proxy.$provideNewSymbolNames(handle, model.uri, range, triggerKind, token);
			}
		} satisfies languages.NewSymbolNamesProvider));
	}

	// --- semantic tokens

	$registerDocumentSemanticTokensProvider(handle: number, selector: IDocumentFilterDto[], legend: languages.SemanticTokensLegend, eventHandle: number | undefined): void {
		let event: Event<void> | undefined = undefined;
		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._registrations.set(eventHandle, emitter);
			event = emitter.event;
		}
		this._registrations.set(handle, this._languageFeaturesService.documentSemanticTokensProvider.register(selector, new MainThreadDocumentSemanticTokensProvider(this._proxy, handle, legend, event)));
	}

	$emitDocumentSemanticTokensEvent(eventHandle: number): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(undefined);
		}
	}

	$emitDocumentRangeSemanticTokensEvent(eventHandle: number): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(undefined);
		}
	}

	$registerDocumentRangeSemanticTokensProvider(handle: number, selector: IDocumentFilterDto[], legend: languages.SemanticTokensLegend, eventHandle: number | undefined): void {
		let event: Event<void> | undefined = undefined;
		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._registrations.set(eventHandle, emitter);
			event = emitter.event;
		}
		this._registrations.set(handle, this._languageFeaturesService.documentRangeSemanticTokensProvider.register(selector, new MainThreadDocumentRangeSemanticTokensProvider(this._proxy, handle, legend, event)));
	}

	// --- suggest

	private static _inflateSuggestDto(defaultRange: IRange | { insert: IRange; replace: IRange }, data: ISuggestDataDto, extensionId: ExtensionIdentifier): languages.CompletionItem {

		const label = data[ISuggestDataDtoField.label];
		const commandId = data[ISuggestDataDtoField.commandId];
		const commandIdent = data[ISuggestDataDtoField.commandIdent];
		const commitChars = data[ISuggestDataDtoField.commitCharacters];

		type IdentCommand = languages.Command & { $ident: string | undefined };

		let command: IdentCommand | undefined;
		if (commandId) {
			command = {
				$ident: commandIdent,
				id: commandId,
				title: '',
				arguments: commandIdent ? [commandIdent] : data[ISuggestDataDtoField.commandArguments], // Automatically fill in ident as first argument
			};
		}

		return {
			label,
			extensionId,
			kind: data[ISuggestDataDtoField.kind] ?? languages.CompletionItemKind.Property,
			tags: data[ISuggestDataDtoField.kindModifier],
			detail: data[ISuggestDataDtoField.detail],
			documentation: data[ISuggestDataDtoField.documentation],
			sortText: data[ISuggestDataDtoField.sortText],
			filterText: data[ISuggestDataDtoField.filterText],
			preselect: data[ISuggestDataDtoField.preselect],
			insertText: data[ISuggestDataDtoField.insertText] ?? (typeof label === 'string' ? label : label.label),
			range: data[ISuggestDataDtoField.range] ?? defaultRange,
			insertTextRules: data[ISuggestDataDtoField.insertTextRules],
			commitCharacters: commitChars ? Array.from(commitChars) : undefined,
			additionalTextEdits: data[ISuggestDataDtoField.additionalTextEdits],
			command,
			// not-standard
			_id: data.x,
		};
	}

	$registerCompletionsProvider(handle: number, selector: IDocumentFilterDto[], triggerCharacters: string[], supportsResolveDetails: boolean, extensionId: ExtensionIdentifier): void {
		const provider: languages.CompletionItemProvider = {
			triggerCharacters,
			_debugDisplayName: `${extensionId.value}(${triggerCharacters.join('')})`,
			provideCompletionItems: async (model: ITextModel, position: EditorPosition, context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | undefined> => {
				const result = await this._proxy.$provideCompletionItems(handle, model.uri, position, context, token);
				if (!result) {
					return result;
				}
				return {
					suggestions: result[ISuggestResultDtoField.completions].map(d => MainThreadLanguageFeatures._inflateSuggestDto(result[ISuggestResultDtoField.defaultRanges], d, extensionId)),
					incomplete: result[ISuggestResultDtoField.isIncomplete] || false,
					duration: result[ISuggestResultDtoField.duration],
					dispose: () => {
						if (typeof result.x === 'number') {
							this._proxy.$releaseCompletionItems(handle, result.x);
						}
					}
				};
			}
		};
		if (supportsResolveDetails) {
			provider.resolveCompletionItem = (suggestion, token) => {
				return this._proxy.$resolveCompletionItem(handle, suggestion._id!, token).then(result => {
					if (!result) {
						return suggestion;
					}

					const newSuggestion = MainThreadLanguageFeatures._inflateSuggestDto(suggestion.range, result, extensionId);
					return mixin(suggestion, newSuggestion, true);
				});
			};
		}
		this._registrations.set(handle, this._languageFeaturesService.completionProvider.register(selector, provider));
	}

	$registerInlineCompletionsSupport(
		handle: number,
		selector: IDocumentFilterDto[],
		supportsHandleEvents: boolean,
		extensionId: string,
		extensionVersion: string,
		groupId: string | undefined,
		yieldsToExtensionIds: string[],
		displayName: string | undefined,
		debounceDelayMs: number | undefined,
		excludesExtensionIds: string[],
		supportsOnDidChange: boolean,
		supportsSetModelId: boolean,
		initialModelInfo: IInlineCompletionModelInfoDto | undefined,
		supportsOnDidChangeModelInfo: boolean,
	): void {
		const providerId = new languages.ProviderId(extensionId, extensionVersion, groupId);

		const provider = this._instantiationService.createInstance(
			ExtensionBackedInlineCompletionsProvider,
			handle,
			groupId ?? extensionId,
			providerId,
			yieldsToExtensionIds,
			excludesExtensionIds,
			debounceDelayMs,
			displayName,
			initialModelInfo,
			supportsHandleEvents,
			supportsSetModelId,
			supportsOnDidChange,
			supportsOnDidChangeModelInfo,
			selector,
			this._proxy,
		);

		this._registrations.set(handle, provider);
	}

	$emitInlineCompletionsChange(handle: number): void {
		const obj = this._registrations.get(handle);
		if (obj instanceof ExtensionBackedInlineCompletionsProvider) {
			obj._emitDidChange();
		}
	}

	$emitInlineCompletionModelInfoChange(handle: number, data: IInlineCompletionModelInfoDto | undefined): void {
		const obj = this._registrations.get(handle);
		if (obj instanceof ExtensionBackedInlineCompletionsProvider) {
			obj._setModelInfo(data);
		}
	}

	// --- parameter hints

	$registerSignatureHelpProvider(handle: number, selector: IDocumentFilterDto[], metadata: ISignatureHelpProviderMetadataDto): void {
		this._registrations.set(handle, this._languageFeaturesService.signatureHelpProvider.register(selector, {

			signatureHelpTriggerCharacters: metadata.triggerCharacters,
			signatureHelpRetriggerCharacters: metadata.retriggerCharacters,

			provideSignatureHelp: async (model: ITextModel, position: EditorPosition, token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | undefined> => {
				const result = await this._proxy.$provideSignatureHelp(handle, model.uri, position, context, token);
				if (!result) {
					return undefined;
				}
				return {
					value: result,
					dispose: () => {
						this._proxy.$releaseSignatureHelp(handle, result.id);
					}
				};
			}
		}));
	}

	// --- inline hints

	$registerInlayHintsProvider(handle: number, selector: IDocumentFilterDto[], supportsResolve: boolean, eventHandle: number | undefined, displayName: string | undefined): void {
		const provider: languages.InlayHintsProvider = {
			displayName,
			provideInlayHints: async (model: ITextModel, range: EditorRange, token: CancellationToken): Promise<languages.InlayHintList | undefined> => {
				const result = await this._proxy.$provideInlayHints(handle, model.uri, range, token);
				if (!result) {
					return;
				}
				return {
					hints: revive(result.hints),
					dispose: () => {
						if (result.cacheId) {
							this._proxy.$releaseInlayHints(handle, result.cacheId);
						}
					}
				};
			}
		};
		if (supportsResolve) {
			provider.resolveInlayHint = async (hint, token) => {
				const dto: IInlayHintDto = hint;
				if (!dto.cacheId) {
					return hint;
				}
				const result = await this._proxy.$resolveInlayHint(handle, dto.cacheId, token);
				if (token.isCancellationRequested) {
					throw new CancellationError();
				}
				if (!result) {
					return hint;
				}
				return {
					...hint,
					tooltip: result.tooltip,
					label: revive<string | languages.InlayHintLabelPart[]>(result.label),
					textEdits: result.textEdits
				};
			};
		}
		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._registrations.set(eventHandle, emitter);
			provider.onDidChangeInlayHints = emitter.event;
		}

		this._registrations.set(handle, this._languageFeaturesService.inlayHintsProvider.register(selector, provider));
	}

	$emitInlayHintsEvent(eventHandle: number): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(undefined);
		}
	}

	// --- links

	$registerDocumentLinkProvider(handle: number, selector: IDocumentFilterDto[], supportsResolve: boolean): void {
		const provider: languages.LinkProvider = {
			provideLinks: (model, token) => {
				return this._proxy.$provideDocumentLinks(handle, model.uri, token).then(dto => {
					if (!dto) {
						return undefined;
					}
					return {
						links: dto.links.map(MainThreadLanguageFeatures._reviveLinkDTO),
						dispose: () => {
							if (typeof dto.cacheId === 'number') {
								this._proxy.$releaseDocumentLinks(handle, dto.cacheId);
							}
						}
					};
				});
			}
		};
		if (supportsResolve) {
			provider.resolveLink = (link, token) => {
				const dto: ILinkDto = link;
				if (!dto.cacheId) {
					return link;
				}
				return this._proxy.$resolveDocumentLink(handle, dto.cacheId, token).then(obj => {
					return obj && MainThreadLanguageFeatures._reviveLinkDTO(obj);
				});
			};
		}
		this._registrations.set(handle, this._languageFeaturesService.linkProvider.register(selector, provider));
	}

	// --- colors

	$registerDocumentColorProvider(handle: number, selector: IDocumentFilterDto[]): void {
		const proxy = this._proxy;
		this._registrations.set(handle, this._languageFeaturesService.colorProvider.register(selector, {
			provideDocumentColors: (model, token) => {
				return proxy.$provideDocumentColors(handle, model.uri, token)
					.then(documentColors => {
						return documentColors.map(documentColor => {
							const [red, green, blue, alpha] = documentColor.color;
							const color = {
								red: red,
								green: green,
								blue: blue,
								alpha
							};

							return {
								color,
								range: documentColor.range
							};
						});
					});
			},

			provideColorPresentations: (model, colorInfo, token) => {
				return proxy.$provideColorPresentations(handle, model.uri, {
					color: [colorInfo.color.red, colorInfo.color.green, colorInfo.color.blue, colorInfo.color.alpha],
					range: colorInfo.range
				}, token);
			}
		}));
	}

	// --- folding

	$registerFoldingRangeProvider(handle: number, selector: IDocumentFilterDto[], extensionId: ExtensionIdentifier, eventHandle: number | undefined): void {
		const provider: languages.FoldingRangeProvider = {
			id: extensionId.value,
			provideFoldingRanges: (model, context, token) => {
				return this._proxy.$provideFoldingRanges(handle, model.uri, context, token);
			}
		};

		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<languages.FoldingRangeProvider>();
			this._registrations.set(eventHandle, emitter);
			provider.onDidChange = emitter.event;
		}

		this._registrations.set(handle, this._languageFeaturesService.foldingRangeProvider.register(selector, provider));
	}

	$emitFoldingRangeEvent(eventHandle: number, event?: unknown): void {
		const obj = this._registrations.get(eventHandle);
		if (obj instanceof Emitter) {
			obj.fire(event);
		}
	}

	// -- smart select

	$registerSelectionRangeProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, this._languageFeaturesService.selectionRangeProvider.register(selector, {
			provideSelectionRanges: (model, positions, token) => {
				return this._proxy.$provideSelectionRanges(handle, model.uri, positions, token);
			}
		}));
	}

	// --- call hierarchy

	$registerCallHierarchyProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, callh.CallHierarchyProviderRegistry.register(selector, {

			prepareCallHierarchy: async (document, position, token) => {
				const items = await this._proxy.$prepareCallHierarchy(handle, document.uri, position, token);
				if (!items || items.length === 0) {
					return undefined;
				}
				return {
					dispose: () => {
						for (const item of items) {
							this._proxy.$releaseCallHierarchy(handle, item._sessionId);
						}
					},
					roots: items.map(MainThreadLanguageFeatures._reviveCallHierarchyItemDto)
				};
			},

			provideOutgoingCalls: async (item, token) => {
				const outgoing = await this._proxy.$provideCallHierarchyOutgoingCalls(handle, item._sessionId, item._itemId, token);
				if (!outgoing) {
					return outgoing;
				}
				outgoing.forEach(value => {
					value.to = MainThreadLanguageFeatures._reviveCallHierarchyItemDto(value.to);
				});
				// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
				return <any>outgoing;
			},
			provideIncomingCalls: async (item, token) => {
				const incoming = await this._proxy.$provideCallHierarchyIncomingCalls(handle, item._sessionId, item._itemId, token);
				if (!incoming) {
					return incoming;
				}
				incoming.forEach(value => {
					value.from = MainThreadLanguageFeatures._reviveCallHierarchyItemDto(value.from);
				});
				// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
				return <any>incoming;
			}
		}));
	}

	// --- configuration

	private static _reviveRegExp(regExp: IRegExpDto): RegExp {
		return new RegExp(regExp.pattern, regExp.flags);
	}

	private static _reviveIndentationRule(indentationRule: IIndentationRuleDto): IndentationRule {
		return {
			decreaseIndentPattern: MainThreadLanguageFeatures._reviveRegExp(indentationRule.decreaseIndentPattern),
			increaseIndentPattern: MainThreadLanguageFeatures._reviveRegExp(indentationRule.increaseIndentPattern),
			indentNextLinePattern: indentationRule.indentNextLinePattern ? MainThreadLanguageFeatures._reviveRegExp(indentationRule.indentNextLinePattern) : undefined,
			unIndentedLinePattern: indentationRule.unIndentedLinePattern ? MainThreadLanguageFeatures._reviveRegExp(indentationRule.unIndentedLinePattern) : undefined,
		};
	}

	private static _reviveOnEnterRule(onEnterRule: IOnEnterRuleDto): OnEnterRule {
		return {
			beforeText: MainThreadLanguageFeatures._reviveRegExp(onEnterRule.beforeText),
			afterText: onEnterRule.afterText ? MainThreadLanguageFeatures._reviveRegExp(onEnterRule.afterText) : undefined,
			previousLineText: onEnterRule.previousLineText ? MainThreadLanguageFeatures._reviveRegExp(onEnterRule.previousLineText) : undefined,
			action: onEnterRule.action
		};
	}

	private static _reviveOnEnterRules(onEnterRules: IOnEnterRuleDto[]): OnEnterRule[] {
		return onEnterRules.map(MainThreadLanguageFeatures._reviveOnEnterRule);
	}

	$setLanguageConfiguration(handle: number, languageId: string, _configuration: ILanguageConfigurationDto): void {

		const configuration: LanguageConfiguration = {
			comments: _configuration.comments,
			brackets: _configuration.brackets,
			wordPattern: _configuration.wordPattern ? MainThreadLanguageFeatures._reviveRegExp(_configuration.wordPattern) : undefined,
			indentationRules: _configuration.indentationRules ? MainThreadLanguageFeatures._reviveIndentationRule(_configuration.indentationRules) : undefined,
			onEnterRules: _configuration.onEnterRules ? MainThreadLanguageFeatures._reviveOnEnterRules(_configuration.onEnterRules) : undefined,

			autoClosingPairs: undefined,
			surroundingPairs: undefined,
			__electricCharacterSupport: undefined
		};

		if (_configuration.autoClosingPairs) {
			configuration.autoClosingPairs = _configuration.autoClosingPairs;
		} else if (_configuration.__characterPairSupport) {
			// backwards compatibility
			configuration.autoClosingPairs = _configuration.__characterPairSupport.autoClosingPairs;
		}

		if (_configuration.__electricCharacterSupport && _configuration.__electricCharacterSupport.docComment) {
			configuration.__electricCharacterSupport = {
				docComment: {
					open: _configuration.__electricCharacterSupport.docComment.open,
					close: _configuration.__electricCharacterSupport.docComment.close
				}
			};
		}

		if (this._languageService.isRegisteredLanguageId(languageId)) {
			this._registrations.set(handle, this._languageConfigurationService.register(languageId, configuration, 100));
		}
	}

	// --- type hierarchy

	$registerTypeHierarchyProvider(handle: number, selector: IDocumentFilterDto[]): void {
		this._registrations.set(handle, typeh.TypeHierarchyProviderRegistry.register(selector, {

			prepareTypeHierarchy: async (document, position, token) => {
				const items = await this._proxy.$prepareTypeHierarchy(handle, document.uri, position, token);
				if (!items) {
					return undefined;
				}
				return {
					dispose: () => {
						for (const item of items) {
							this._proxy.$releaseTypeHierarchy(handle, item._sessionId);
						}
					},
					roots: items.map(MainThreadLanguageFeatures._reviveTypeHierarchyItemDto)
				};
			},

			provideSupertypes: async (item, token) => {
				const supertypes = await this._proxy.$provideTypeHierarchySupertypes(handle, item._sessionId, item._itemId, token);
				if (!supertypes) {
					return supertypes;
				}
				return supertypes.map(MainThreadLanguageFeatures._reviveTypeHierarchyItemDto);
			},
			provideSubtypes: async (item, token) => {
				const subtypes = await this._proxy.$provideTypeHierarchySubtypes(handle, item._sessionId, item._itemId, token);
				if (!subtypes) {
					return subtypes;
				}
				return subtypes.map(MainThreadLanguageFeatures._reviveTypeHierarchyItemDto);
			}
		}));
	}


	// --- document drop Edits

	private readonly _documentOnDropEditProviders = new Map<number, MainThreadDocumentOnDropEditProvider>();

	$registerDocumentOnDropEditProvider(handle: number, selector: IDocumentFilterDto[], metadata: IDocumentDropEditProviderMetadata): void {
		const provider = new MainThreadDocumentOnDropEditProvider(handle, this._proxy, metadata, this._uriIdentService);
		this._documentOnDropEditProviders.set(handle, provider);
		this._registrations.set(handle, combinedDisposable(
			this._languageFeaturesService.documentDropEditProvider.register(selector, provider),
			toDisposable(() => this._documentOnDropEditProviders.delete(handle)),
		));
	}

	async $resolveDocumentOnDropFileData(handle: number, requestId: number, dataId: string): Promise<VSBuffer> {
		const provider = this._documentOnDropEditProviders.get(handle);
		if (!provider) {
			throw new Error('Could not find provider');
		}
		return provider.resolveDocumentOnDropFileData(requestId, dataId);
	}
}

class MainThreadPasteEditProvider implements languages.DocumentPasteEditProvider {

	private readonly dataTransfers = new DataTransferFileCache();

	public readonly copyMimeTypes: readonly string[];
	public readonly pasteMimeTypes: readonly string[];
	public readonly providedPasteEditKinds: readonly HierarchicalKind[];

	readonly prepareDocumentPaste?: languages.DocumentPasteEditProvider['prepareDocumentPaste'];
	readonly provideDocumentPasteEdits?: languages.DocumentPasteEditProvider['provideDocumentPasteEdits'];
	readonly resolveDocumentPasteEdit?: languages.DocumentPasteEditProvider['resolveDocumentPasteEdit'];

	constructor(
		private readonly _handle: number,
		private readonly _proxy: ExtHostLanguageFeaturesShape,
		metadata: IPasteEditProviderMetadataDto,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService
	) {
		this.copyMimeTypes = metadata.copyMimeTypes ?? [];
		this.pasteMimeTypes = metadata.pasteMimeTypes ?? [];
		this.providedPasteEditKinds = metadata.providedPasteEditKinds?.map(kind => new HierarchicalKind(kind)) ?? [];

		if (metadata.supportsCopy) {
			this.prepareDocumentPaste = async (model: ITextModel, selections: readonly IRange[], dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<IReadonlyVSDataTransfer | undefined> => {
				const dataTransferDto = await typeConvert.DataTransfer.fromList(dataTransfer);
				if (token.isCancellationRequested) {
					return undefined;
				}

				const newDataTransfer = await this._proxy.$prepareDocumentPaste(_handle, model.uri, selections, dataTransferDto, token);
				if (!newDataTransfer) {
					return undefined;
				}

				const dataTransferOut = new VSDataTransfer();
				for (const [type, item] of newDataTransfer.items) {
					dataTransferOut.replace(type, createStringDataTransferItem(item.asString, item.id));
				}
				return dataTransferOut;
			};
		}

		if (metadata.supportsPaste) {
			this.provideDocumentPasteEdits = async (model: ITextModel, selections: Selection[], dataTransfer: IReadonlyVSDataTransfer, context: languages.DocumentPasteContext, token: CancellationToken) => {
				const request = this.dataTransfers.add(dataTransfer);
				try {
					const dataTransferDto = await typeConvert.DataTransfer.fromList(dataTransfer);
					if (token.isCancellationRequested) {
						return;
					}

					const edits = await this._proxy.$providePasteEdits(this._handle, request.id, model.uri, selections, dataTransferDto, {
						only: context.only?.value,
						triggerKind: context.triggerKind,
					}, token);
					if (!edits) {
						return;
					}

					return {
						edits: edits.map((edit): languages.DocumentPasteEdit => {
							return {
								...edit,
								kind: edit.kind ? new HierarchicalKind(edit.kind.value) : new HierarchicalKind(''),
								yieldTo: edit.yieldTo?.map(x => ({ kind: new HierarchicalKind(x) })),
								additionalEdit: edit.additionalEdit ? reviveWorkspaceEditDto(edit.additionalEdit, this._uriIdentService, dataId => this.resolveFileData(request.id, dataId)) : undefined,
							};
						}),
						dispose: () => {
							this._proxy.$releasePasteEdits(this._handle, request.id);
						},
					};
				} finally {
					request.dispose();
				}
			};
		}
		if (metadata.supportsResolve) {
			this.resolveDocumentPasteEdit = async (edit: languages.DocumentPasteEdit, token: CancellationToken) => {
				const resolved = await this._proxy.$resolvePasteEdit(this._handle, (<IPasteEditDto>edit)._cacheId!, token);
				if (typeof resolved.insertText !== 'undefined') {
					edit.insertText = resolved.insertText;
				}

				if (resolved.additionalEdit) {
					edit.additionalEdit = reviveWorkspaceEditDto(resolved.additionalEdit, this._uriIdentService);
				}
				return edit;
			};
		}
	}

	resolveFileData(requestId: number, dataId: string): Promise<VSBuffer> {
		return this.dataTransfers.resolveFileData(requestId, dataId);
	}
}

class MainThreadDocumentOnDropEditProvider implements languages.DocumentDropEditProvider {

	private readonly dataTransfers = new DataTransferFileCache();

	readonly dropMimeTypes?: readonly string[];

	readonly providedDropEditKinds: readonly HierarchicalKind[] | undefined;

	readonly resolveDocumentDropEdit?: languages.DocumentDropEditProvider['resolveDocumentDropEdit'];

	constructor(
		private readonly _handle: number,
		private readonly _proxy: ExtHostLanguageFeaturesShape,
		metadata: IDocumentDropEditProviderMetadata | undefined,
		@IUriIdentityService private readonly _uriIdentService: IUriIdentityService
	) {
		this.dropMimeTypes = metadata?.dropMimeTypes ?? ['*/*'];
		this.providedDropEditKinds = metadata?.providedDropKinds?.map(kind => new HierarchicalKind(kind));

		if (metadata?.supportsResolve) {
			this.resolveDocumentDropEdit = async (edit, token) => {
				const resolved = await this._proxy.$resolvePasteEdit(this._handle, (<IDocumentDropEditDto>edit)._cacheId!, token);
				if (resolved.additionalEdit) {
					edit.additionalEdit = reviveWorkspaceEditDto(resolved.additionalEdit, this._uriIdentService);
				}
				return edit;
			};
		}
	}

	async provideDocumentDropEdits(model: ITextModel, position: IPosition, dataTransfer: IReadonlyVSDataTransfer, token: CancellationToken): Promise<languages.DocumentDropEditsSession | undefined> {
		const request = this.dataTransfers.add(dataTransfer);
		try {
			const dataTransferDto = await typeConvert.DataTransfer.fromList(dataTransfer);
			if (token.isCancellationRequested) {
				return;
			}

			const edits = await this._proxy.$provideDocumentOnDropEdits(this._handle, request.id, model.uri, position, dataTransferDto, token);
			if (!edits) {
				return;
			}

			return {
				edits: edits.map(edit => {
					return {
						...edit,
						yieldTo: edit.yieldTo?.map(x => ({ kind: new HierarchicalKind(x) })),
						kind: edit.kind ? new HierarchicalKind(edit.kind) : undefined,
						additionalEdit: reviveWorkspaceEditDto(edit.additionalEdit, this._uriIdentService, dataId => this.resolveDocumentOnDropFileData(request.id, dataId)),
					};
				}),
				dispose: () => {
					this._proxy.$releaseDocumentOnDropEdits(this._handle, request.id);
				},
			};
		} finally {
			request.dispose();
		}
	}

	public resolveDocumentOnDropFileData(requestId: number, dataId: string): Promise<VSBuffer> {
		return this.dataTransfers.resolveFileData(requestId, dataId);
	}
}

export class MainThreadDocumentSemanticTokensProvider implements languages.DocumentSemanticTokensProvider {

	constructor(
		private readonly _proxy: ExtHostLanguageFeaturesShape,
		private readonly _handle: number,
		private readonly _legend: languages.SemanticTokensLegend,
		public readonly onDidChange: Event<void> | undefined,
	) {
	}

	public releaseDocumentSemanticTokens(resultId: string | undefined): void {
		if (resultId) {
			this._proxy.$releaseDocumentSemanticTokens(this._handle, parseInt(resultId, 10));
		}
	}

	public getLegend(): languages.SemanticTokensLegend {
		return this._legend;
	}

	async provideDocumentSemanticTokens(model: ITextModel, lastResultId: string | null, token: CancellationToken): Promise<languages.SemanticTokens | languages.SemanticTokensEdits | null> {
		const nLastResultId = lastResultId ? parseInt(lastResultId, 10) : 0;
		const encodedDto = await this._proxy.$provideDocumentSemanticTokens(this._handle, model.uri, nLastResultId, token);
		if (!encodedDto) {
			return null;
		}
		if (token.isCancellationRequested) {
			return null;
		}
		const dto = decodeSemanticTokensDto(encodedDto);
		if (dto.type === 'full') {
			return {
				resultId: String(dto.id),
				data: dto.data
			};
		}
		return {
			resultId: String(dto.id),
			edits: dto.deltas
		};
	}
}

export class MainThreadDocumentRangeSemanticTokensProvider implements languages.DocumentRangeSemanticTokensProvider {

	constructor(
		private readonly _proxy: ExtHostLanguageFeaturesShape,
		private readonly _handle: number,
		private readonly _legend: languages.SemanticTokensLegend,
		public readonly onDidChange: Event<void> | undefined,
	) {
	}

	public getLegend(): languages.SemanticTokensLegend {
		return this._legend;
	}

	async provideDocumentRangeSemanticTokens(model: ITextModel, range: EditorRange, token: CancellationToken): Promise<languages.SemanticTokens | null> {
		const encodedDto = await this._proxy.$provideDocumentRangeSemanticTokens(this._handle, model.uri, range, token);
		if (!encodedDto) {
			return null;
		}
		if (token.isCancellationRequested) {
			return null;
		}
		const dto = decodeSemanticTokensDto(encodedDto);
		if (dto.type === 'full') {
			return {
				resultId: String(dto.id),
				data: dto.data
			};
		}
		throw new Error(`Unexpected`);
	}
}

class ExtensionBackedInlineCompletionsProvider extends Disposable implements languages.InlineCompletionsProvider<IdentifiableInlineCompletions> {
	public readonly setModelId: ((modelId: string) => Promise<void>) | undefined;
	public readonly _onDidChangeEmitter = new Emitter<void>();
	public readonly onDidChangeInlineCompletions: Event<void> | undefined;

	public readonly _onDidChangeModelInfoEmitter = new Emitter<void>();
	public readonly onDidChangeModelInfo: Event<void> | undefined;

	constructor(
		public readonly handle: number,
		public readonly groupId: string,
		public readonly providerId: languages.ProviderId,
		public readonly yieldsToGroupIds: string[],
		public readonly excludesGroupIds: string[],
		public readonly debounceDelayMs: number | undefined,
		public readonly displayName: string | undefined,
		public modelInfo: languages.IInlineCompletionModelInfo | undefined,
		private readonly _supportsHandleEvents: boolean,
		private readonly _supportsSetModelId: boolean,
		private readonly _supportsOnDidChange: boolean,
		private readonly _supportsOnDidChangeModelInfo: boolean,
		private readonly _selector: IDocumentFilterDto[],
		private readonly _proxy: ExtHostLanguageFeaturesShape,
		@ILanguageFeaturesService private readonly _languageFeaturesService: ILanguageFeaturesService,
		@IAiEditTelemetryService private readonly _aiEditTelemetryService: IAiEditTelemetryService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this.setModelId = this._supportsSetModelId ? async (modelId: string) => {
			await this._proxy.$handleInlineCompletionSetCurrentModelId(this.handle, modelId);
		} : undefined;

		this.onDidChangeInlineCompletions = this._supportsOnDidChange ? this._onDidChangeEmitter.event : undefined;
		this.onDidChangeModelInfo = this._supportsOnDidChangeModelInfo ? this._onDidChangeModelInfoEmitter.event : undefined;

		this._register(this._languageFeaturesService.inlineCompletionsProvider.register(this._selector, this));
	}

	public _setModelInfo(newModelInfo: languages.IInlineCompletionModelInfo | undefined) {
		this.modelInfo = newModelInfo;
		if (this._supportsOnDidChangeModelInfo) {
			this._onDidChangeModelInfoEmitter.fire();
		}
	}

	public _emitDidChange() {
		if (this._supportsOnDidChange) {
			this._onDidChangeEmitter.fire();
		}
	}

	public async provideInlineCompletions(model: ITextModel, position: EditorPosition, context: languages.InlineCompletionContext, token: CancellationToken): Promise<IdentifiableInlineCompletions | undefined> {
		const result = await this._proxy.$provideInlineCompletions(this.handle, model.uri, position, context, token);
		return result;
	}

	public async handleItemDidShow(completions: IdentifiableInlineCompletions, item: IdentifiableInlineCompletion, updatedInsertText: string, editDeltaInfo: EditDeltaInfo): Promise<void> {
		if (item.suggestionId === undefined) {
			item.suggestionId = this._aiEditTelemetryService.createSuggestionId({
				applyCodeBlockSuggestionId: undefined,
				feature: 'inlineSuggestion',
				source: this.providerId,
				languageId: completions.languageId,
				editDeltaInfo: editDeltaInfo,
				modeId: undefined,
				modelId: undefined,
				presentation: item.isInlineEdit ? 'nextEditSuggestion' : 'inlineCompletion',
			});
		}

		if (this._supportsHandleEvents) {
			await this._proxy.$handleInlineCompletionDidShow(this.handle, completions.pid, item.idx, updatedInsertText);
		}
	}

	public async handlePartialAccept(completions: IdentifiableInlineCompletions, item: IdentifiableInlineCompletion, acceptedCharacters: number, info: languages.PartialAcceptInfo): Promise<void> {
		if (this._supportsHandleEvents) {
			await this._proxy.$handleInlineCompletionPartialAccept(this.handle, completions.pid, item.idx, acceptedCharacters, info);
		}
	}

	public async handleEndOfLifetime(completions: IdentifiableInlineCompletions, item: IdentifiableInlineCompletion, reason: languages.InlineCompletionEndOfLifeReason<IdentifiableInlineCompletion>, lifetimeSummary: languages.LifetimeSummary): Promise<void> {
		function mapReason<T1, T2>(reason: languages.InlineCompletionEndOfLifeReason<T1>, f: (reason: T1) => T2): languages.InlineCompletionEndOfLifeReason<T2> {
			if (reason.kind === languages.InlineCompletionEndOfLifeReasonKind.Ignored) {
				return {
					...reason,
					supersededBy: reason.supersededBy ? f(reason.supersededBy) : undefined,
				};
			}
			return reason;
		}

		if (this._supportsHandleEvents) {
			await this._proxy.$handleInlineCompletionEndOfLifetime(this.handle, completions.pid, item.idx, mapReason(reason, i => ({ pid: completions.pid, idx: i.idx })));
		}

		if (reason.kind === languages.InlineCompletionEndOfLifeReasonKind.Accepted) {
			if (item.suggestionId !== undefined) {
				this._aiEditTelemetryService.handleCodeAccepted({
					suggestionId: item.suggestionId,
					feature: 'inlineSuggestion',
					source: this.providerId,
					languageId: completions.languageId,
					editDeltaInfo: EditDeltaInfo.tryCreate(
						lifetimeSummary.lineCountModified,
						lifetimeSummary.lineCountOriginal,
						lifetimeSummary.characterCountModified,
						lifetimeSummary.characterCountOriginal,
					),
					modeId: undefined,
					modelId: undefined,
					presentation: item.isInlineEdit ? 'nextEditSuggestion' : 'inlineCompletion',
					acceptanceMethod: 'accept',
					applyCodeBlockSuggestionId: undefined,
				});
			}
		}

		const endOfLifeSummary: InlineCompletionEndOfLifeEvent = {
			opportunityId: lifetimeSummary.requestUuid,
			correlationId: lifetimeSummary.correlationId,
			shown: lifetimeSummary.shown,
			shownDuration: lifetimeSummary.shownDuration,
			shownDurationUncollapsed: lifetimeSummary.shownDurationUncollapsed,
			timeUntilShown: lifetimeSummary.timeUntilShown,
			timeUntilProviderRequest: lifetimeSummary.timeUntilProviderRequest,
			timeUntilProviderResponse: lifetimeSummary.timeUntilProviderResponse,
			editorType: lifetimeSummary.editorType,
			viewKind: lifetimeSummary.viewKind,
			preceeded: lifetimeSummary.preceeded,
			requestReason: lifetimeSummary.requestReason,
			typingInterval: lifetimeSummary.typingInterval,
			typingIntervalCharacterCount: lifetimeSummary.typingIntervalCharacterCount,
			languageId: lifetimeSummary.languageId,
			cursorColumnDistance: lifetimeSummary.cursorColumnDistance,
			cursorLineDistance: lifetimeSummary.cursorLineDistance,
			lineCountOriginal: lifetimeSummary.lineCountOriginal,
			lineCountModified: lifetimeSummary.lineCountModified,
			characterCountOriginal: lifetimeSummary.characterCountOriginal,
			characterCountModified: lifetimeSummary.characterCountModified,
			disjointReplacements: lifetimeSummary.disjointReplacements,
			sameShapeReplacements: lifetimeSummary.sameShapeReplacements,
			selectedSuggestionInfo: lifetimeSummary.selectedSuggestionInfo,
			extensionId: this.providerId.extensionId!,
			extensionVersion: this.providerId.extensionVersion!,
			groupId: extractEngineFromCorrelationId(lifetimeSummary.correlationId) ?? this.groupId,
			skuPlan: lifetimeSummary.skuPlan,
			skuType: lifetimeSummary.skuType,
			performanceMarkers: lifetimeSummary.performanceMarkers,
			availableProviders: lifetimeSummary.availableProviders,
			partiallyAccepted: lifetimeSummary.partiallyAccepted,
			partiallyAcceptedCountSinceOriginal: lifetimeSummary.partiallyAcceptedCountSinceOriginal,
			partiallyAcceptedRatioSinceOriginal: lifetimeSummary.partiallyAcceptedRatioSinceOriginal,
			partiallyAcceptedCharactersSinceOriginal: lifetimeSummary.partiallyAcceptedCharactersSinceOriginal,
			superseded: reason.kind === InlineCompletionEndOfLifeReasonKind.Ignored && !!reason.supersededBy,
			reason: reason.kind === InlineCompletionEndOfLifeReasonKind.Accepted ? 'accepted'
				: reason.kind === InlineCompletionEndOfLifeReasonKind.Rejected ? 'rejected'
					: reason.kind === InlineCompletionEndOfLifeReasonKind.Ignored ? 'ignored' : undefined,
			acceptedAlternativeAction: reason.kind === InlineCompletionEndOfLifeReasonKind.Accepted && reason.alternativeAction,
			noSuggestionReason: undefined,
			notShownReason: lifetimeSummary.notShownReason,
			renameCreated: lifetimeSummary.renameCreated,
			renameDuration: lifetimeSummary.renameDuration,
			renameTimedOut: lifetimeSummary.renameTimedOut,
			renameDroppedOtherEdits: lifetimeSummary.renameDroppedOtherEdits,
			renameDroppedRenameEdits: lifetimeSummary.renameDroppedRenameEdits,
			editKind: lifetimeSummary.editKind,
			longDistanceHintVisible: lifetimeSummary.longDistanceHintVisible,
			longDistanceHintDistance: lifetimeSummary.longDistanceHintDistance,
			...forwardToChannelIf(isCopilotLikeExtension(this.providerId.extensionId!)),
		};

		const dataChannelForwardingTelemetryService = this._instantiationService.createInstance(DataChannelForwardingTelemetryService);
		sendInlineCompletionsEndOfLifeTelemetry(dataChannelForwardingTelemetryService, endOfLifeSummary);
	}

	public disposeInlineCompletions(completions: IdentifiableInlineCompletions, reason: languages.InlineCompletionsDisposeReason): void {
		this._proxy.$freeInlineCompletionsList(this.handle, completions.pid, reason);
	}

	public async handleRejection(completions: IdentifiableInlineCompletions, item: IdentifiableInlineCompletion): Promise<void> {
		if (this._supportsHandleEvents) {
			await this._proxy.$handleInlineCompletionRejection(this.handle, completions.pid, item.idx);
		}
	}

	override toString() {
		return `InlineCompletionsProvider(${this.providerId.toString()})`;
	}
}

function extractEngineFromCorrelationId(correlationId: string | undefined): string | undefined {
	if (!correlationId) {
		return undefined;
	}
	try {
		const parsed = JSON.parse(correlationId);
		if (typeof parsed === 'object' && parsed !== null && typeof parsed.engine === 'string') {
			return parsed.engine;
		}
		return undefined;
	} catch {
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLanguageModels.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLanguageModels.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableSource, DeferredPromise } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { SerializedError, transformErrorForSerialization, transformErrorFromSerialization } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { resizeImage } from '../../contrib/chat/browser/chatImageUtils.js';
import { ILanguageModelIgnoredFilesService } from '../../contrib/chat/common/ignoredFiles.js';
import { IChatMessage, IChatResponsePart, ILanguageModelChatResponse, ILanguageModelChatSelector, ILanguageModelsService } from '../../contrib/chat/common/languageModels.js';
import { IAuthenticationAccessService } from '../../services/authentication/browser/authenticationAccessService.js';
import { AuthenticationSession, AuthenticationSessionsChangeEvent, IAuthenticationProvider, IAuthenticationService, INTERNAL_AUTH_PROVIDER_PREFIX } from '../../services/authentication/common/authentication.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostContext, ExtHostLanguageModelsShape, MainContext, MainThreadLanguageModelsShape } from '../common/extHost.protocol.js';
import { LanguageModelError } from '../common/extHostTypes.js';

@extHostNamedCustomer(MainContext.MainThreadLanguageModels)
export class MainThreadLanguageModels implements MainThreadLanguageModelsShape {

	private readonly _proxy: ExtHostLanguageModelsShape;
	private readonly _store = new DisposableStore();
	private readonly _providerRegistrations = new DisposableMap<string>();
	private readonly _lmProviderChange = new Emitter<{ vendor: string }>();
	private readonly _pendingProgress = new Map<number, { defer: DeferredPromise<unknown>; stream: AsyncIterableSource<IChatResponsePart | IChatResponsePart[]> }>();
	private readonly _ignoredFileProviderRegistrations = new DisposableMap<number>();

	constructor(
		extHostContext: IExtHostContext,
		@ILanguageModelsService private readonly _chatProviderService: ILanguageModelsService,
		@ILogService private readonly _logService: ILogService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IAuthenticationAccessService private readonly _authenticationAccessService: IAuthenticationAccessService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILanguageModelIgnoredFilesService private readonly _ignoredFilesService: ILanguageModelIgnoredFilesService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostChatProvider);
	}

	dispose(): void {
		this._lmProviderChange.dispose();
		this._providerRegistrations.dispose();
		this._ignoredFileProviderRegistrations.dispose();
		this._store.dispose();
	}

	$registerLanguageModelProvider(vendor: string): void {
		const disposables = new DisposableStore();
		try {
			disposables.add(this._chatProviderService.registerLanguageModelProvider(vendor, {
				onDidChange: Event.filter(this._lmProviderChange.event, e => e.vendor === vendor, disposables) as unknown as Event<void>,
				provideLanguageModelChatInfo: async (options, token) => {
					const modelsAndIdentifiers = await this._proxy.$provideLanguageModelChatInfo(vendor, options, token);
					modelsAndIdentifiers.forEach(m => {
						if (m.metadata.auth) {
							disposables.add(this._registerAuthenticationProvider(m.metadata.extension, m.metadata.auth));
						}
					});
					return modelsAndIdentifiers;
				},
				sendChatRequest: async (modelId, messages, from, options, token) => {
					const requestId = (Math.random() * 1e6) | 0;
					const defer = new DeferredPromise<unknown>();
					const stream = new AsyncIterableSource<IChatResponsePart | IChatResponsePart[]>();

					try {
						this._pendingProgress.set(requestId, { defer, stream });
						await Promise.all(
							messages.flatMap(msg => msg.content)
								.filter(part => part.type === 'image_url')
								.map(async part => {
									part.value.data = VSBuffer.wrap(await resizeImage(part.value.data.buffer));
								})
						);
						await this._proxy.$startChatRequest(modelId, requestId, from, new SerializableObjectWithBuffers(messages), options, token);
					} catch (err) {
						this._pendingProgress.delete(requestId);
						throw err;
					}

					return {
						result: defer.p,
						stream: stream.asyncIterable
					} satisfies ILanguageModelChatResponse;
				},
				provideTokenCount: (modelId, str, token) => {
					return this._proxy.$provideTokenLength(modelId, str, token);
				},
			}));
			this._providerRegistrations.set(vendor, disposables);
		} catch (err) {
			disposables.dispose();
			throw err;
		}
	}

	$onLMProviderChange(vendor: string): void {
		this._lmProviderChange.fire({ vendor });
	}

	async $reportResponsePart(requestId: number, chunk: SerializableObjectWithBuffers<IChatResponsePart | IChatResponsePart[]>): Promise<void> {
		const data = this._pendingProgress.get(requestId);
		this._logService.trace('[LM] report response PART', Boolean(data), requestId, chunk);
		if (data) {
			data.stream.emitOne(chunk.value);
		}
	}

	async $reportResponseDone(requestId: number, err: SerializedError | undefined): Promise<void> {
		const data = this._pendingProgress.get(requestId);
		this._logService.trace('[LM] report response DONE', Boolean(data), requestId, err);
		if (data) {
			this._pendingProgress.delete(requestId);
			if (err) {
				const error = LanguageModelError.tryDeserialize(err) ?? transformErrorFromSerialization(err);
				data.stream.reject(error);
				data.defer.error(error);
			} else {
				data.stream.resolve();
				data.defer.complete(undefined);
			}
		}
	}

	$unregisterProvider(vendor: string): void {
		this._providerRegistrations.deleteAndDispose(vendor);
	}

	$selectChatModels(selector: ILanguageModelChatSelector): Promise<string[]> {
		return this._chatProviderService.selectLanguageModels(selector);
	}

	async $tryStartChatRequest(extension: ExtensionIdentifier, modelIdentifier: string, requestId: number, messages: SerializableObjectWithBuffers<IChatMessage[]>, options: {}, token: CancellationToken): Promise<void> {
		this._logService.trace('[CHAT] request STARTED', extension.value, requestId);

		let response: ILanguageModelChatResponse;
		try {
			response = await this._chatProviderService.sendChatRequest(modelIdentifier, extension, messages.value, options, token);
		} catch (err) {
			this._logService.error('[CHAT] request FAILED', extension.value, requestId, err);
			throw err;
		}

		// !!! IMPORTANT !!!
		// This method must return before the response is done (has streamed all parts)
		// and because of that we consume the stream without awaiting
		// !!! IMPORTANT !!!
		const streaming = (async () => {
			try {
				for await (const part of response.stream) {
					this._logService.trace('[CHAT] request PART', extension.value, requestId, part);
					await this._proxy.$acceptResponsePart(requestId, new SerializableObjectWithBuffers(part));
				}
				this._logService.trace('[CHAT] request DONE', extension.value, requestId);
			} catch (err) {
				this._logService.error('[CHAT] extension request ERRORED in STREAM', toErrorMessage(err, true), extension.value, requestId);
				this._proxy.$acceptResponseDone(requestId, transformErrorForSerialization(err));
			}
		})();

		// When the response is done (signaled via its result) we tell the EH
		Promise.allSettled([response.result, streaming]).then(() => {
			this._logService.debug('[CHAT] extension request DONE', extension.value, requestId);
			this._proxy.$acceptResponseDone(requestId, undefined);
		}, err => {
			this._logService.error('[CHAT] extension request ERRORED', toErrorMessage(err, true), extension.value, requestId);
			this._proxy.$acceptResponseDone(requestId, transformErrorForSerialization(err));
		});
	}


	$countTokens(modelId: string, value: string | IChatMessage, token: CancellationToken): Promise<number> {
		return this._chatProviderService.computeTokenLength(modelId, value, token);
	}

	private _registerAuthenticationProvider(extension: ExtensionIdentifier, auth: { providerLabel: string; accountLabel?: string | undefined }): IDisposable {
		// This needs to be done in both MainThread & ExtHost ChatProvider
		const authProviderId = INTERNAL_AUTH_PROVIDER_PREFIX + extension.value;

		// Only register one auth provider per extension
		if (this._authenticationService.getProviderIds().includes(authProviderId)) {
			return Disposable.None;
		}

		const accountLabel = auth.accountLabel ?? localize('languageModelsAccountId', 'Language Models');
		const disposables = new DisposableStore();
		this._authenticationService.registerAuthenticationProvider(authProviderId, new LanguageModelAccessAuthProvider(authProviderId, auth.providerLabel, accountLabel));
		disposables.add(toDisposable(() => {
			this._authenticationService.unregisterAuthenticationProvider(authProviderId);
		}));
		disposables.add(this._authenticationAccessService.onDidChangeExtensionSessionAccess(async (e) => {
			const allowedExtensions = this._authenticationAccessService.readAllowedExtensions(authProviderId, accountLabel);
			const accessList = [];
			for (const allowedExtension of allowedExtensions) {
				const from = await this._extensionService.getExtension(allowedExtension.id);
				if (from) {
					accessList.push({
						from: from.identifier,
						to: extension,
						enabled: allowedExtension.allowed ?? true
					});
				}
			}
			this._proxy.$updateModelAccesslist(accessList);
		}));
		return disposables;
	}

	$fileIsIgnored(uri: UriComponents, token: CancellationToken): Promise<boolean> {
		return this._ignoredFilesService.fileIsIgnored(URI.revive(uri), token);
	}

	$registerFileIgnoreProvider(handle: number): void {
		this._ignoredFileProviderRegistrations.set(handle, this._ignoredFilesService.registerIgnoredFileProvider({
			isFileIgnored: async (uri: URI, token: CancellationToken) => this._proxy.$isFileIgnored(handle, uri, token)
		}));
	}

	$unregisterFileIgnoreProvider(handle: number): void {
		this._ignoredFileProviderRegistrations.deleteAndDispose(handle);
	}
}

// The fake AuthenticationProvider that will be used to gate access to the Language Model. There will be one per provider.
class LanguageModelAccessAuthProvider implements IAuthenticationProvider {
	supportsMultipleAccounts = false;

	// Important for updating the UI
	private _onDidChangeSessions: Emitter<AuthenticationSessionsChangeEvent> = new Emitter<AuthenticationSessionsChangeEvent>();
	readonly onDidChangeSessions: Event<AuthenticationSessionsChangeEvent> = this._onDidChangeSessions.event;

	private _session: AuthenticationSession | undefined;

	constructor(readonly id: string, readonly label: string, private readonly _accountLabel: string) { }

	async getSessions(scopes?: string[] | undefined): Promise<readonly AuthenticationSession[]> {
		// If there are no scopes and no session that means no extension has requested a session yet
		// and the user is simply opening the Account menu. In that case, we should not return any "sessions".
		if (scopes === undefined && !this._session) {
			return [];
		}
		if (this._session) {
			return [this._session];
		}
		return [await this.createSession(scopes || [])];
	}
	async createSession(scopes: string[]): Promise<AuthenticationSession> {
		this._session = this._createFakeSession(scopes);
		this._onDidChangeSessions.fire({ added: [this._session], changed: [], removed: [] });
		return this._session;
	}
	removeSession(sessionId: string): Promise<void> {
		if (this._session) {
			this._onDidChangeSessions.fire({ added: [], changed: [], removed: [this._session] });
			this._session = undefined;
		}
		return Promise.resolve();
	}

	confirmation(extensionName: string, _recreatingSession: boolean): string {
		return localize('confirmLanguageModelAccess', "The extension '{0}' wants to access the language models provided by {1}.", extensionName, this.label);
	}

	private _createFakeSession(scopes: string[]): AuthenticationSession {
		return {
			id: 'fake-session',
			account: {
				id: this.id,
				label: this._accountLabel,
			},
			accessToken: 'fake-access-token',
			scopes,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLanguageModelTools.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLanguageModelTools.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { CountTokensCallback, ILanguageModelToolsService, IToolInvocation, IToolProgressStep, IToolResult, ToolProgress, toolResultHasBuffers } from '../../contrib/chat/common/languageModelToolsService.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { Dto, SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostContext, ExtHostLanguageModelToolsShape, IToolDataDto, MainContext, MainThreadLanguageModelToolsShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadLanguageModelTools)
export class MainThreadLanguageModelTools extends Disposable implements MainThreadLanguageModelToolsShape {

	private readonly _proxy: ExtHostLanguageModelToolsShape;
	private readonly _tools = this._register(new DisposableMap<string>());
	private readonly _runningToolCalls = new Map</* call ID */string, {
		countTokens: CountTokensCallback;
		progress: ToolProgress;
	}>();

	constructor(
		extHostContext: IExtHostContext,
		@ILanguageModelToolsService private readonly _languageModelToolsService: ILanguageModelToolsService,
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostLanguageModelTools);

		this._register(this._languageModelToolsService.onDidChangeTools(e => this._proxy.$onDidChangeTools(this.getToolDtos())));
	}

	private getToolDtos(): IToolDataDto[] {
		return Array.from(this._languageModelToolsService.getTools())
			.map(tool => ({
				id: tool.id,
				displayName: tool.displayName,
				toolReferenceName: tool.toolReferenceName,
				legacyToolReferenceFullNames: tool.legacyToolReferenceFullNames,
				tags: tool.tags,
				userDescription: tool.userDescription,
				modelDescription: tool.modelDescription,
				inputSchema: tool.inputSchema,
				source: tool.source,
			} satisfies IToolDataDto));
	}

	async $getTools(): Promise<IToolDataDto[]> {
		return this.getToolDtos();
	}

	async $invokeTool(dto: Dto<IToolInvocation>, token?: CancellationToken): Promise<Dto<IToolResult> | SerializableObjectWithBuffers<Dto<IToolResult>>> {
		const result = await this._languageModelToolsService.invokeTool(
			revive<IToolInvocation>(dto),
			(input, token) => this._proxy.$countTokensForInvocation(dto.callId, input, token),
			token ?? CancellationToken.None,
		);

		// Only return content and metadata to EH
		const out: Dto<IToolResult> = {
			content: result.content,
			toolMetadata: result.toolMetadata
		};
		return toolResultHasBuffers(result) ? new SerializableObjectWithBuffers(out) : out;
	}

	$acceptToolProgress(callId: string, progress: IToolProgressStep): void {
		this._runningToolCalls.get(callId)?.progress.report(progress);
	}

	$countTokensForInvocation(callId: string, input: string, token: CancellationToken): Promise<number> {
		const fn = this._runningToolCalls.get(callId);
		if (!fn) {
			throw new Error(`Tool invocation call ${callId} not found`);
		}

		return fn.countTokens(input, token);
	}

	$registerTool(id: string): void {
		const disposable = this._languageModelToolsService.registerToolImplementation(
			id,
			{
				invoke: async (dto, countTokens, progress, token) => {
					try {
						this._runningToolCalls.set(dto.callId, { countTokens, progress });
						const resultSerialized = await this._proxy.$invokeTool(dto, token);
						const resultDto: Dto<IToolResult> = resultSerialized instanceof SerializableObjectWithBuffers ? resultSerialized.value : resultSerialized;
						return revive<IToolResult>(resultDto);
					} finally {
						this._runningToolCalls.delete(dto.callId);
					}
				},
				prepareToolInvocation: (context, token) => this._proxy.$prepareToolInvocation(id, context, token),
			});
		this._tools.set(id, disposable);
	}

	$unregisterTool(name: string): void {
		this._tools.deleteAndDispose(name);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLanguages.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLanguages.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI, UriComponents } from '../../../base/common/uri.js';
import { ILanguageService } from '../../../editor/common/languages/language.js';
import { IModelService } from '../../../editor/common/services/model.js';
import { MainThreadLanguagesShape, MainContext, ExtHostContext, ExtHostLanguagesShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IPosition } from '../../../editor/common/core/position.js';
import { IRange, Range } from '../../../editor/common/core/range.js';
import { StandardTokenType } from '../../../editor/common/encodedTokenAttributes.js';
import { ITextModelService } from '../../../editor/common/services/resolverService.js';
import { ILanguageStatus, ILanguageStatusService } from '../../services/languageStatus/common/languageStatusService.js';
import { Disposable, DisposableMap } from '../../../base/common/lifecycle.js';

@extHostNamedCustomer(MainContext.MainThreadLanguages)
export class MainThreadLanguages extends Disposable implements MainThreadLanguagesShape {

	private readonly _proxy: ExtHostLanguagesShape;

	private readonly _status = this._register(new DisposableMap<number>());

	constructor(
		_extHostContext: IExtHostContext,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private _resolverService: ITextModelService,
		@ILanguageStatusService private readonly _languageStatusService: ILanguageStatusService,
	) {
		super();
		this._proxy = _extHostContext.getProxy(ExtHostContext.ExtHostLanguages);

		this._proxy.$acceptLanguageIds(_languageService.getRegisteredLanguageIds());
		this._register(_languageService.onDidChange(_ => {
			this._proxy.$acceptLanguageIds(_languageService.getRegisteredLanguageIds());
		}));
	}

	async $changeLanguage(resource: UriComponents, languageId: string): Promise<void> {

		if (!this._languageService.isRegisteredLanguageId(languageId)) {
			return Promise.reject(new Error(`Unknown language id: ${languageId}`));
		}

		const uri = URI.revive(resource);
		const ref = await this._resolverService.createModelReference(uri);
		try {
			ref.object.textEditorModel.setLanguage(this._languageService.createById(languageId));
		} finally {
			ref.dispose();
		}
	}

	async $tokensAtPosition(resource: UriComponents, position: IPosition): Promise<undefined | { type: StandardTokenType; range: IRange }> {
		const uri = URI.revive(resource);
		const model = this._modelService.getModel(uri);
		if (!model) {
			return undefined;
		}
		model.tokenization.tokenizeIfCheap(position.lineNumber);
		const tokens = model.tokenization.getLineTokens(position.lineNumber);
		const idx = tokens.findTokenIndexAtOffset(position.column - 1);
		return {
			type: tokens.getStandardTokenType(idx),
			range: new Range(position.lineNumber, 1 + tokens.getStartOffset(idx), position.lineNumber, 1 + tokens.getEndOffset(idx))
		};
	}

	// --- language status

	$setLanguageStatus(handle: number, status: ILanguageStatus): void {
		this._status.set(handle, this._languageStatusService.addStatus(status));
	}

	$removeLanguageStatus(handle: number): void {
		this._status.deleteAndDispose(handle);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLocalization.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLocalization.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainContext, MainThreadLocalizationShape } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IFileService } from '../../../platform/files/common/files.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { ILanguagePackService } from '../../../platform/languagePacks/common/languagePacks.js';

@extHostNamedCustomer(MainContext.MainThreadLocalization)
export class MainThreadLocalization extends Disposable implements MainThreadLocalizationShape {

	constructor(
		extHostContext: IExtHostContext,
		@IFileService private readonly fileService: IFileService,
		@ILanguagePackService private readonly languagePackService: ILanguagePackService
	) {
		super();
	}

	async $fetchBuiltInBundleUri(id: string, language: string): Promise<URI | undefined> {
		try {
			const uri = await this.languagePackService.getBuiltInExtensionTranslationsUri(id, language);
			return uri;
		} catch (e) {
			return undefined;
		}
	}

	async $fetchBundleContents(uriComponents: UriComponents): Promise<string> {
		const contents = await this.fileService.readFile(URI.revive(uriComponents));
		return contents.value.toString();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadLogService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadLogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ILoggerOptions, ILoggerResource, ILoggerService, ILogService, isLogLevel, log, LogLevel, LogLevelToString, parseLogLevel } from '../../../platform/log/common/log.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { ExtHostContext, MainThreadLoggerShape, MainContext } from '../common/extHost.protocol.js';
import { UriComponents, URI, UriDto } from '../../../base/common/uri.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';

@extHostNamedCustomer(MainContext.MainThreadLogger)
export class MainThreadLoggerService implements MainThreadLoggerShape {

	private readonly disposables = new DisposableStore();

	constructor(
		extHostContext: IExtHostContext,
		@ILoggerService private readonly loggerService: ILoggerService,
	) {
		const proxy = extHostContext.getProxy(ExtHostContext.ExtHostLogLevelServiceShape);
		this.disposables.add(loggerService.onDidChangeLogLevel(arg => {
			if (isLogLevel(arg)) {
				proxy.$setLogLevel(arg);
			} else {
				proxy.$setLogLevel(arg[1], arg[0]);
			}
		}));
	}

	$log(file: UriComponents, messages: [LogLevel, string][]): void {
		const logger = this.loggerService.getLogger(URI.revive(file));
		if (!logger) {
			throw new Error('Create the logger before logging');
		}
		for (const [level, message] of messages) {
			log(logger, level, message);
		}
	}

	async $createLogger(file: UriComponents, options?: ILoggerOptions): Promise<void> {
		this.loggerService.createLogger(URI.revive(file), options);
	}

	async $registerLogger(logResource: UriDto<ILoggerResource>): Promise<void> {
		this.loggerService.registerLogger({
			...logResource,
			resource: URI.revive(logResource.resource)
		});
	}

	async $deregisterLogger(resource: UriComponents): Promise<void> {
		this.loggerService.deregisterLogger(URI.revive(resource));
	}

	async $setVisibility(resource: UriComponents, visible: boolean): Promise<void> {
		this.loggerService.setVisibility(URI.revive(resource), visible);
	}

	$flush(file: UriComponents): void {
		const logger = this.loggerService.getLogger(URI.revive(file));
		if (!logger) {
			throw new Error('Create the logger before flushing');
		}
		logger.flush();
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

// --- Internal commands to improve extension test runs

CommandsRegistry.registerCommand('_extensionTests.setLogLevel', function (accessor: ServicesAccessor, level: string) {
	const loggerService = accessor.get(ILoggerService);
	const environmentService = accessor.get(IEnvironmentService);

	if (environmentService.isExtensionDevelopment && !!environmentService.extensionTestsLocationURI) {
		const logLevel = parseLogLevel(level);
		if (logLevel !== undefined) {
			loggerService.setLogLevel(logLevel);
		}
	}
});

CommandsRegistry.registerCommand('_extensionTests.getLogLevel', function (accessor: ServicesAccessor) {
	const logService = accessor.get(ILogService);

	return LogLevelToString(logService.getLevel());
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadManagedSockets.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadManagedSockets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { ISocket, SocketCloseEventType } from '../../../base/parts/ipc/common/ipc.net.js';
import { ManagedSocket, RemoteSocketHalf, connectManagedSocket } from '../../../platform/remote/common/managedSocket.js';
import { ManagedRemoteConnection, RemoteConnectionType } from '../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteSocketFactoryService, ISocketFactory } from '../../../platform/remote/common/remoteSocketFactoryService.js';
import { ExtHostContext, ExtHostManagedSocketsShape, MainContext, MainThreadManagedSocketsShape } from '../common/extHost.protocol.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';

@extHostNamedCustomer(MainContext.MainThreadManagedSockets)
export class MainThreadManagedSockets extends Disposable implements MainThreadManagedSocketsShape {

	private readonly _proxy: ExtHostManagedSocketsShape;
	private readonly _registrations = new Map<number, IDisposable>();
	private readonly _remoteSockets = new Map<number, RemoteSocketHalf>();

	constructor(
		extHostContext: IExtHostContext,
		@IRemoteSocketFactoryService private readonly _remoteSocketFactoryService: IRemoteSocketFactoryService,
	) {
		super();
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostManagedSockets);
	}

	async $registerSocketFactory(socketFactoryId: number): Promise<void> {
		const that = this;
		const socketFactory = new class implements ISocketFactory<RemoteConnectionType.Managed> {

			supports(connectTo: ManagedRemoteConnection): boolean {
				return (connectTo.id === socketFactoryId);
			}

			connect(connectTo: ManagedRemoteConnection, path: string, query: string, debugLabel: string): Promise<ISocket> {
				return new Promise<ISocket>((resolve, reject) => {
					if (connectTo.id !== socketFactoryId) {
						return reject(new Error('Invalid connectTo'));
					}

					const factoryId = connectTo.id;
					that._proxy.$openRemoteSocket(factoryId).then(socketId => {
						const half: RemoteSocketHalf = {
							onClose: new Emitter(),
							onData: new Emitter(),
							onEnd: new Emitter(),
						};
						that._remoteSockets.set(socketId, half);

						MainThreadManagedSocket.connect(socketId, that._proxy, path, query, debugLabel, half)
							.then(
								socket => {
									socket.onDidDispose(() => that._remoteSockets.delete(socketId));
									resolve(socket);
								},
								err => {
									that._remoteSockets.delete(socketId);
									reject(err);
								});
					}).catch(reject);
				});
			}
		};
		this._registrations.set(socketFactoryId, this._remoteSocketFactoryService.register(RemoteConnectionType.Managed, socketFactory));

	}

	async $unregisterSocketFactory(socketFactoryId: number): Promise<void> {
		this._registrations.get(socketFactoryId)?.dispose();
	}

	$onDidManagedSocketHaveData(socketId: number, data: VSBuffer): void {
		this._remoteSockets.get(socketId)?.onData.fire(data);
	}

	$onDidManagedSocketClose(socketId: number, error: string | undefined): void {
		this._remoteSockets.get(socketId)?.onClose.fire({
			type: SocketCloseEventType.NodeSocketCloseEvent,
			error: error ? new Error(error) : undefined,
			hadError: !!error
		});
		this._remoteSockets.delete(socketId);
	}

	$onDidManagedSocketEnd(socketId: number): void {
		this._remoteSockets.get(socketId)?.onEnd.fire();
	}
}

export class MainThreadManagedSocket extends ManagedSocket {
	public static connect(
		socketId: number,
		proxy: ExtHostManagedSocketsShape,
		path: string, query: string, debugLabel: string,
		half: RemoteSocketHalf
	): Promise<MainThreadManagedSocket> {
		const socket = new MainThreadManagedSocket(socketId, proxy, debugLabel, half);
		return connectManagedSocket(socket, path, query, debugLabel, half);
	}

	private constructor(
		private readonly socketId: number,
		private readonly proxy: ExtHostManagedSocketsShape,
		debugLabel: string,
		half: RemoteSocketHalf,
	) {
		super(debugLabel, half);
	}

	public override write(buffer: VSBuffer): void {
		this.proxy.$remoteSocketWrite(this.socketId, buffer);
	}

	protected override  closeRemote(): void {
		this.proxy.$remoteSocketEnd(this.socketId);
	}

	public override drain(): Promise<void> {
		return this.proxy.$remoteSocketDrain(this.socketId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadMcp.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadMcp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mapFindFirst } from '../../../base/common/arraysFind.js';
import { disposableTimeout } from '../../../base/common/async.js';
import { CancellationError } from '../../../base/common/errors.js';
import { Emitter } from '../../../base/common/event.js';
import { Disposable, DisposableMap, DisposableStore, MutableDisposable } from '../../../base/common/lifecycle.js';
import { ISettableObservable, observableValue } from '../../../base/common/observable.js';
import Severity from '../../../base/common/severity.js';
import { URI } from '../../../base/common/uri.js';
import * as nls from '../../../nls.js';
import { ContextKeyExpr, IContextKeyService } from '../../../platform/contextkey/common/contextkey.js';
import { IDialogService, IPromptButton } from '../../../platform/dialogs/common/dialogs.js';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions.js';
import { LogLevel } from '../../../platform/log/common/log.js';
import { IMcpMessageTransport, IMcpRegistry } from '../../contrib/mcp/common/mcpRegistryTypes.js';
import { extensionPrefixedIdentifier, McpCollectionDefinition, McpConnectionState, McpServerDefinition, McpServerLaunch, McpServerTransportType, McpServerTrust, UserInteractionRequiredError } from '../../contrib/mcp/common/mcpTypes.js';
import { MCP } from '../../contrib/mcp/common/modelContextProtocol.js';
import { IAuthenticationMcpAccessService } from '../../services/authentication/browser/authenticationMcpAccessService.js';
import { IAuthenticationMcpService } from '../../services/authentication/browser/authenticationMcpService.js';
import { IAuthenticationMcpUsageService } from '../../services/authentication/browser/authenticationMcpUsageService.js';
import { AuthenticationSession, AuthenticationSessionAccount, IAuthenticationService } from '../../services/authentication/common/authentication.js';
import { IDynamicAuthenticationProviderStorageService } from '../../services/authentication/common/dynamicAuthenticationProviderStorage.js';
import { ExtensionHostKind, extensionHostKindToString } from '../../services/extensions/common/extensionHostKind.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { IExtHostContext, extHostNamedCustomer } from '../../services/extensions/common/extHostCustomers.js';
import { Proxied } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostContext, ExtHostMcpShape, IMcpAuthenticationDetails, IMcpAuthenticationOptions, MainContext, MainThreadMcpShape } from '../common/extHost.protocol.js';

@extHostNamedCustomer(MainContext.MainThreadMcp)
export class MainThreadMcp extends Disposable implements MainThreadMcpShape {

	private _serverIdCounter = 0;

	private readonly _servers = new Map<number, ExtHostMcpServerLaunch>();
	private readonly _serverDefinitions = new Map<number, McpServerDefinition>();
	private readonly _serverAuthTracking = new McpServerAuthTracker();
	private readonly _proxy: Proxied<ExtHostMcpShape>;
	private readonly _collectionDefinitions = this._register(new DisposableMap<string, {
		servers: ISettableObservable<readonly McpServerDefinition[]>;
		dispose(): void;
	}>());

	constructor(
		private readonly _extHostContext: IExtHostContext,
		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
		@IDialogService private readonly dialogService: IDialogService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IAuthenticationMcpService private readonly authenticationMcpServersService: IAuthenticationMcpService,
		@IAuthenticationMcpAccessService private readonly authenticationMCPServerAccessService: IAuthenticationMcpAccessService,
		@IAuthenticationMcpUsageService private readonly authenticationMCPServerUsageService: IAuthenticationMcpUsageService,
		@IDynamicAuthenticationProviderStorageService private readonly _dynamicAuthenticationProviderStorageService: IDynamicAuthenticationProviderStorageService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IContextKeyService private readonly _contextKeyService: IContextKeyService,
	) {
		super();
		this._register(_authenticationService.onDidChangeSessions(e => this._onDidChangeAuthSessions(e.providerId, e.label)));
		const proxy = this._proxy = _extHostContext.getProxy(ExtHostContext.ExtHostMcp);
		this._register(this._mcpRegistry.registerDelegate({
			// Prefer Node.js extension hosts when they're available. No CORS issues etc.
			priority: _extHostContext.extensionHostKind === ExtensionHostKind.LocalWebWorker ? 0 : 1,
			waitForInitialProviderPromises() {
				return proxy.$waitForInitialCollectionProviders();
			},
			canStart(collection, serverDefinition) {
				if (collection.remoteAuthority !== _extHostContext.remoteAuthority) {
					return false;
				}
				if (serverDefinition.launch.type === McpServerTransportType.Stdio && _extHostContext.extensionHostKind === ExtensionHostKind.LocalWebWorker) {
					return false;
				}
				return true;
			},
			async substituteVariables(serverDefinition, launch) {
				const ser = await proxy.$substituteVariables(serverDefinition.variableReplacement?.folder?.uri, McpServerLaunch.toSerialized(launch));
				return McpServerLaunch.fromSerialized(ser);
			},
			start: (_collection, serverDefiniton, resolveLaunch, options) => {
				const id = ++this._serverIdCounter;
				const launch = new ExtHostMcpServerLaunch(
					_extHostContext.extensionHostKind,
					() => proxy.$stopMcp(id),
					msg => proxy.$sendMessage(id, JSON.stringify(msg)),
				);
				this._servers.set(id, launch);
				this._serverDefinitions.set(id, serverDefiniton);
				proxy.$startMcp(id, {
					launch: resolveLaunch,
					defaultCwd: serverDefiniton.variableReplacement?.folder?.uri,
					errorOnUserInteraction: options?.errorOnUserInteraction,
				});

				return launch;
			},
		}));
	}

	$upsertMcpCollection(collection: McpCollectionDefinition.FromExtHost, serversDto: McpServerDefinition.Serialized[]): void {
		const servers = serversDto.map(McpServerDefinition.fromSerialized);
		const existing = this._collectionDefinitions.get(collection.id);
		if (existing) {
			existing.servers.set(servers, undefined);
		} else {
			const serverDefinitions = observableValue<readonly McpServerDefinition[]>('mcpServers', servers);
			const extensionId = new ExtensionIdentifier(collection.extensionId);
			const store = new DisposableStore();
			const handle = store.add(new MutableDisposable());
			const register = () => {
				handle.value ??= this._mcpRegistry.registerCollection({
					...collection,
					source: extensionId,
					resolveServerLanch: collection.canResolveLaunch ? (async def => {
						const r = await this._proxy.$resolveMcpLaunch(collection.id, def.label);
						return r ? McpServerLaunch.fromSerialized(r) : undefined;
					}) : undefined,
					trustBehavior: collection.isTrustedByDefault ? McpServerTrust.Kind.Trusted : McpServerTrust.Kind.TrustedOnNonce,
					remoteAuthority: this._extHostContext.remoteAuthority,
					serverDefinitions,
				});
			};

			const whenClauseStr = mapFindFirst(this._extensionService.extensions, e =>
				ExtensionIdentifier.equals(extensionId, e.identifier)
					? e.contributes?.mcpServerDefinitionProviders?.find(p => extensionPrefixedIdentifier(extensionId, p.id) === collection.id)?.when
					: undefined);
			const whenClause = whenClauseStr && ContextKeyExpr.deserialize(whenClauseStr);

			if (!whenClause) {
				register();
			} else {
				const evaluate = () => {
					if (this._contextKeyService.contextMatchesRules(whenClause)) {
						register();
					} else {
						handle.clear();
					}
				};

				store.add(this._contextKeyService.onDidChangeContext(evaluate));
				evaluate();
			}

			this._collectionDefinitions.set(collection.id, {
				servers: serverDefinitions,
				dispose: () => store.dispose(),
			});
		}
	}

	$deleteMcpCollection(collectionId: string): void {
		this._collectionDefinitions.deleteAndDispose(collectionId);
	}

	$onDidChangeState(id: number, update: McpConnectionState): void {
		const server = this._servers.get(id);
		if (!server) {
			return;
		}

		server.state.set(update, undefined);
		if (!McpConnectionState.isRunning(update)) {
			server.dispose();
			this._servers.delete(id);
			this._serverDefinitions.delete(id);
			this._serverAuthTracking.untrack(id);
		}
	}

	$onDidPublishLog(id: number, level: LogLevel, log: string): void {
		if (typeof level === 'string') {
			level = LogLevel.Info;
			log = level as unknown as string;
		}

		this._servers.get(id)?.pushLog(level, log);
	}

	$onDidReceiveMessage(id: number, message: string): void {
		this._servers.get(id)?.pushMessage(message);
	}

	async $getTokenForProviderId(id: number, providerId: string, scopes: string[], options: IMcpAuthenticationOptions = {}): Promise<string | undefined> {
		const server = this._serverDefinitions.get(id);
		if (!server) {
			return undefined;
		}
		return this._getSessionForProvider(id, server, providerId, scopes, undefined, options.errorOnUserInteraction);
	}

	async $getTokenFromServerMetadata(id: number, authDetails: IMcpAuthenticationDetails, { errorOnUserInteraction, forceNewRegistration }: IMcpAuthenticationOptions = {}): Promise<string | undefined> {
		const server = this._serverDefinitions.get(id);
		if (!server) {
			return undefined;
		}
		const authorizationServer = URI.revive(authDetails.authorizationServer);
		const resourceServer = authDetails.resourceMetadata?.resource ? URI.parse(authDetails.resourceMetadata.resource) : undefined;
		const resolvedScopes = authDetails.scopes ?? authDetails.resourceMetadata?.scopes_supported ?? authDetails.authorizationServerMetadata.scopes_supported ?? [];
		let providerId = await this._authenticationService.getOrActivateProviderIdForServer(authorizationServer, resourceServer);
		if (forceNewRegistration && providerId) {
			if (!this._authenticationService.isDynamicAuthenticationProvider(providerId)) {
				throw new Error('Cannot force new registration for a non-dynamic authentication provider.');
			}
			this._authenticationService.unregisterAuthenticationProvider(providerId);
			// TODO: Encapsulate this and the unregister in one call in the auth service
			await this._dynamicAuthenticationProviderStorageService.removeDynamicProvider(providerId);
			providerId = undefined;
		}

		if (!providerId) {
			const provider = await this._authenticationService.createDynamicAuthenticationProvider(authorizationServer, authDetails.authorizationServerMetadata, authDetails.resourceMetadata);
			if (!provider) {
				return undefined;
			}
			providerId = provider.id;
		}

		return this._getSessionForProvider(id, server, providerId, resolvedScopes, authorizationServer, errorOnUserInteraction);
	}

	private async _getSessionForProvider(
		serverId: number,
		server: McpServerDefinition,
		providerId: string,
		scopes: string[],
		authorizationServer?: URI,
		errorOnUserInteraction: boolean = false
	): Promise<string | undefined> {
		const sessions = await this._authenticationService.getSessions(providerId, scopes, { authorizationServer }, true);
		const accountNamePreference = this.authenticationMcpServersService.getAccountPreference(server.id, providerId);
		let matchingAccountPreferenceSession: AuthenticationSession | undefined;
		if (accountNamePreference) {
			matchingAccountPreferenceSession = sessions.find(session => session.account.label === accountNamePreference);
		}
		const provider = this._authenticationService.getProvider(providerId);
		let session: AuthenticationSession;
		if (sessions.length) {
			// If we have an existing session preference, use that. If not, we'll return any valid session at the end of this function.
			if (matchingAccountPreferenceSession && this.authenticationMCPServerAccessService.isAccessAllowed(providerId, matchingAccountPreferenceSession.account.label, server.id)) {
				this.authenticationMCPServerUsageService.addAccountUsage(providerId, matchingAccountPreferenceSession.account.label, scopes, server.id, server.label);
				this._serverAuthTracking.track(providerId, serverId, scopes);
				return matchingAccountPreferenceSession.accessToken;
			}
			// If we only have one account for a single auth provider, lets just check if it's allowed and return it if it is.
			if (!provider.supportsMultipleAccounts && this.authenticationMCPServerAccessService.isAccessAllowed(providerId, sessions[0].account.label, server.id)) {
				this.authenticationMCPServerUsageService.addAccountUsage(providerId, sessions[0].account.label, scopes, server.id, server.label);
				this._serverAuthTracking.track(providerId, serverId, scopes);
				return sessions[0].accessToken;
			}
		}

		if (errorOnUserInteraction) {
			throw new UserInteractionRequiredError('authentication');
		}

		const isAllowed = await this.loginPrompt(server.label, provider.label, false);
		if (!isAllowed) {
			throw new Error('User did not consent to login.');
		}

		if (sessions.length) {
			if (provider.supportsMultipleAccounts && errorOnUserInteraction) {
				throw new UserInteractionRequiredError('authentication');
			}
			session = provider.supportsMultipleAccounts
				? await this.authenticationMcpServersService.selectSession(providerId, server.id, server.label, scopes, sessions)
				: sessions[0];
		}
		else {
			if (errorOnUserInteraction) {
				throw new UserInteractionRequiredError('authentication');
			}
			const accountToCreate: AuthenticationSessionAccount | undefined = matchingAccountPreferenceSession?.account;
			do {
				session = await this._authenticationService.createSession(
					providerId,
					scopes,
					{
						activateImmediate: true,
						account: accountToCreate,
						authorizationServer
					});
			} while (
				accountToCreate
				&& accountToCreate.label !== session.account.label
				&& !await this.continueWithIncorrectAccountPrompt(session.account.label, accountToCreate.label)
			);
		}

		this.authenticationMCPServerAccessService.updateAllowedMcpServers(providerId, session.account.label, [{ id: server.id, name: server.label, allowed: true }]);
		this.authenticationMcpServersService.updateAccountPreference(server.id, providerId, session.account);
		this.authenticationMCPServerUsageService.addAccountUsage(providerId, session.account.label, scopes, server.id, server.label);
		this._serverAuthTracking.track(providerId, serverId, scopes);
		return session.accessToken;
	}

	private async continueWithIncorrectAccountPrompt(chosenAccountLabel: string, requestedAccountLabel: string): Promise<boolean> {
		const result = await this.dialogService.prompt({
			message: nls.localize('incorrectAccount', "Incorrect account detected"),
			detail: nls.localize('incorrectAccountDetail', "The chosen account, {0}, does not match the requested account, {1}.", chosenAccountLabel, requestedAccountLabel),
			type: Severity.Warning,
			cancelButton: true,
			buttons: [
				{
					label: nls.localize('keep', 'Keep {0}', chosenAccountLabel),
					run: () => chosenAccountLabel
				},
				{
					label: nls.localize('loginWith', 'Login with {0}', requestedAccountLabel),
					run: () => requestedAccountLabel
				}
			],
		});

		if (!result.result) {
			throw new CancellationError();
		}

		return result.result === chosenAccountLabel;
	}

	private async _onDidChangeAuthSessions(providerId: string, providerLabel: string): Promise<void> {
		const serversUsingProvider = this._serverAuthTracking.get(providerId);
		if (!serversUsingProvider) {
			return;
		}

		for (const { serverId, scopes } of serversUsingProvider) {
			const server = this._servers.get(serverId);
			const serverDefinition = this._serverDefinitions.get(serverId);

			if (!server || !serverDefinition) {
				continue;
			}

			// Only validate servers that are running
			const state = server.state.get();
			if (state.state !== McpConnectionState.Kind.Running) {
				continue;
			}

			// Validate if the session is still available
			try {
				await this._getSessionForProvider(serverId, serverDefinition, providerId, scopes, undefined, true);
			} catch (e) {
				if (UserInteractionRequiredError.is(e)) {
					// Session is no longer valid, stop the server
					server.pushLog(LogLevel.Warning, nls.localize('mcpAuthSessionRemoved', "Authentication session for {0} removed, stopping server", providerLabel));
					server.stop();
				}
				// Ignore other errors to avoid disrupting other servers
			}
		}
	}

	private async loginPrompt(mcpLabel: string, providerLabel: string, recreatingSession: boolean): Promise<boolean> {
		const message = recreatingSession
			? nls.localize('confirmRelogin', "The MCP Server Definition '{0}' wants you to authenticate to {1}.", mcpLabel, providerLabel)
			: nls.localize('confirmLogin', "The MCP Server Definition '{0}' wants to authenticate to {1}.", mcpLabel, providerLabel);

		const buttons: IPromptButton<boolean | undefined>[] = [
			{
				label: nls.localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
				run() {
					return true;
				},
			}
		];
		const { result } = await this.dialogService.prompt({
			type: Severity.Info,
			message,
			buttons,
			cancelButton: true,
		});

		return result ?? false;
	}

	override dispose(): void {
		for (const server of this._servers.values()) {
			server.extHostDispose();
		}
		this._servers.clear();
		this._serverDefinitions.clear();
		this._serverAuthTracking.clear();
		super.dispose();
	}
}


class ExtHostMcpServerLaunch extends Disposable implements IMcpMessageTransport {
	public readonly state = observableValue<McpConnectionState>('mcpServerState', { state: McpConnectionState.Kind.Starting });

	private readonly _onDidLog = this._register(new Emitter<{ level: LogLevel; message: string }>());
	public readonly onDidLog = this._onDidLog.event;

	private readonly _onDidReceiveMessage = this._register(new Emitter<MCP.JSONRPCMessage>());
	public readonly onDidReceiveMessage = this._onDidReceiveMessage.event;

	pushLog(level: LogLevel, message: string): void {
		this._onDidLog.fire({ message, level });
	}

	pushMessage(message: string): void {
		let parsed: MCP.JSONRPCMessage | undefined;
		try {
			parsed = JSON.parse(message);
		} catch (e) {
			this.pushLog(LogLevel.Warning, `Failed to parse message: ${JSON.stringify(message)}`);
		}

		if (parsed) {
			if (Array.isArray(parsed)) { // streamable HTTP supports batching
				parsed.forEach(p => this._onDidReceiveMessage.fire(p));
			} else {
				this._onDidReceiveMessage.fire(parsed);
			}
		}
	}

	constructor(
		extHostKind: ExtensionHostKind,
		public readonly stop: () => void,
		public readonly send: (message: MCP.JSONRPCMessage) => void,
	) {
		super();

		this._register(disposableTimeout(() => {
			this.pushLog(LogLevel.Info, `Starting server from ${extensionHostKindToString(extHostKind)} extension host`);
		}));
	}

	public extHostDispose() {
		if (McpConnectionState.isRunning(this.state.get())) {
			this.pushLog(LogLevel.Warning, 'Extension host shut down, server will stop.');
			this.state.set({ state: McpConnectionState.Kind.Stopped }, undefined);
		}
		this.dispose();
	}

	public override dispose(): void {
		if (McpConnectionState.isRunning(this.state.get())) {
			this.stop();
		}

		super.dispose();
	}
}

/**
 * Tracks which MCP servers are using which authentication providers.
 * Organized by provider ID for efficient lookup when auth sessions change.
 */
class McpServerAuthTracker {
	// Provider ID -> Array of serverId and scopes used
	private readonly _tracking = new Map<string, Array<{ serverId: number; scopes: string[] }>>();

	/**
	 * Track authentication for a server with a specific provider.
	 * Replaces any existing tracking for this server/provider combination.
	 */
	track(providerId: string, serverId: number, scopes: string[]): void {
		const servers = this._tracking.get(providerId) || [];
		const filtered = servers.filter(s => s.serverId !== serverId);
		filtered.push({ serverId, scopes });
		this._tracking.set(providerId, filtered);
	}

	/**
	 * Remove all authentication tracking for a server across all providers.
	 */
	untrack(serverId: number): void {
		for (const [providerId, servers] of this._tracking.entries()) {
			const filtered = servers.filter(s => s.serverId !== serverId);
			if (filtered.length === 0) {
				this._tracking.delete(providerId);
			} else {
				this._tracking.set(providerId, filtered);
			}
		}
	}

	/**
	 * Get all servers using a specific authentication provider.
	 */
	get(providerId: string): ReadonlyArray<{ serverId: number; scopes: string[] }> | undefined {
		return this._tracking.get(providerId);
	}

	/**
	 * Clear all tracking data.
	 */
	clear(): void {
		this._tracking.clear();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadMessageService.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadMessageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../nls.js';
import Severity from '../../../base/common/severity.js';
import { IAction, toAction } from '../../../base/common/actions.js';
import { MainThreadMessageServiceShape, MainContext, MainThreadMessageOptions } from '../common/extHost.protocol.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { IDialogService, IPromptButton } from '../../../platform/dialogs/common/dialogs.js';
import { INotificationService, INotificationSource, NotificationPriority } from '../../../platform/notification/common/notification.js';
import { Event } from '../../../base/common/event.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { IExtensionService } from '../../services/extensions/common/extensions.js';
import { IDisposable } from '../../../base/common/lifecycle.js';

@extHostNamedCustomer(MainContext.MainThreadMessageService)
export class MainThreadMessageService implements MainThreadMessageServiceShape {

	private extensionsListener: IDisposable;

	private static readonly URGENT_NOTIFICATION_SOURCES = [
		'vscode.github-authentication',
		'vscode.microsoft-authentication'
	];

	constructor(
		extHostContext: IExtHostContext,
		@INotificationService private readonly _notificationService: INotificationService,
		@ICommandService private readonly _commandService: ICommandService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IExtensionService extensionService: IExtensionService
	) {
		this.extensionsListener = extensionService.onDidChangeExtensions(e => {
			for (const extension of e.removed) {
				this._notificationService.removeFilter(extension.identifier.value);
			}
		});
	}

	dispose(): void {
		this.extensionsListener.dispose();
	}

	$showMessage(severity: Severity, message: string, options: MainThreadMessageOptions, commands: { title: string; isCloseAffordance: boolean; handle: number }[]): Promise<number | undefined> {
		if (options.modal) {
			return this._showModalMessage(severity, message, options.detail, commands, options.useCustom);
		} else {
			return this._showMessage(severity, message, commands, options);
		}
	}

	private _showMessage(severity: Severity, message: string, commands: { title: string; isCloseAffordance: boolean; handle: number }[], options: MainThreadMessageOptions): Promise<number | undefined> {

		return new Promise<number | undefined>(resolve => {

			const primaryActions: IAction[] = commands.map(command => toAction({
				id: `_extension_message_handle_${command.handle}`,
				label: command.title,
				enabled: true,
				run: () => {
					resolve(command.handle);
					return Promise.resolve();
				}
			}));

			let source: string | INotificationSource | undefined;
			let sourceIsUrgent = false;
			if (options.source) {
				source = {
					label: options.source.label,
					id: options.source.identifier.value
				};
				sourceIsUrgent = MainThreadMessageService.URGENT_NOTIFICATION_SOURCES.includes(source.id);
			}

			if (!source) {
				source = nls.localize('defaultSource', "Extension");
			}

			const secondaryActions: IAction[] = [];
			if (options.source) {
				secondaryActions.push(toAction({
					id: options.source.identifier.value,
					label: nls.localize('manageExtension', "Manage Extension"),
					run: () => {
						return this._commandService.executeCommand('_extensions.manage', options.source!.identifier.value);
					}
				}));
			}

			const messageHandle = this._notificationService.notify({
				severity,
				message,
				actions: { primary: primaryActions, secondary: secondaryActions },
				source,
				priority: sourceIsUrgent ? NotificationPriority.URGENT : NotificationPriority.DEFAULT,
				sticky: sourceIsUrgent
			});

			// if promise has not been resolved yet, now is the time to ensure a return value
			// otherwise if already resolved it means the user clicked one of the buttons
			Event.once(messageHandle.onDidClose)(() => {
				resolve(undefined);
			});
		});
	}

	private async _showModalMessage(severity: Severity, message: string, detail: string | undefined, commands: { title: string; isCloseAffordance: boolean; handle: number }[], useCustom?: boolean): Promise<number | undefined> {
		const buttons: IPromptButton<number>[] = [];
		let cancelButton: IPromptButton<number | undefined> | undefined = undefined;

		for (const command of commands) {
			const button: IPromptButton<number> = {
				label: command.title,
				run: () => command.handle
			};

			if (command.isCloseAffordance) {
				cancelButton = button;
			} else {
				buttons.push(button);
			}
		}

		if (!cancelButton) {
			if (buttons.length > 0) {
				cancelButton = {
					label: nls.localize('cancel', "Cancel"),
					run: () => undefined
				};
			} else {
				cancelButton = {
					label: nls.localize({ key: 'ok', comment: ['&& denotes a mnemonic'] }, "&&OK"),
					run: () => undefined
				};
			}
		}

		const { result } = await this._dialogService.prompt({
			type: severity,
			message,
			detail,
			buttons,
			cancelButton,
			custom: useCustom
		});

		return result;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebook.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebook.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter } from '../../../base/common/event.js';
import { DisposableStore, dispose, IDisposable } from '../../../base/common/lifecycle.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { assertType } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { NotebookDto } from './mainThreadNotebookDto.js';
import { INotebookCellStatusBarService } from '../../contrib/notebook/common/notebookCellStatusBarService.js';
import { INotebookCellStatusBarItemProvider, INotebookContributionData, INotebookExclusiveDocumentFilter, NotebookData, NotebookExtensionDescription, TransientOptions } from '../../contrib/notebook/common/notebookCommon.js';
import { INotebookService, SimpleNotebookProviderInfo } from '../../contrib/notebook/common/notebookService.js';
import { extHostNamedCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { ExtHostContext, ExtHostNotebookShape, MainContext, MainThreadNotebookShape, NotebookDataDto } from '../common/extHost.protocol.js';
import { IRelativePattern } from '../../../base/common/glob.js';
import { revive } from '../../../base/common/marshalling.js';
import { INotebookFileMatchNoModel } from '../../contrib/search/common/searchNotebookHelpers.js';
import { NotebookPriorityInfo } from '../../contrib/search/common/search.js';
import { coalesce } from '../../../base/common/arrays.js';
import { FileOperationError } from '../../../platform/files/common/files.js';

@extHostNamedCustomer(MainContext.MainThreadNotebook)
export class MainThreadNotebooks implements MainThreadNotebookShape {

	private readonly _disposables = new DisposableStore();

	private readonly _proxy: ExtHostNotebookShape;
	private readonly _notebookSerializer = new Map<number, IDisposable>();
	private readonly _notebookCellStatusBarRegistrations = new Map<number, IDisposable>();

	constructor(
		extHostContext: IExtHostContext,
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookCellStatusBarService private readonly _cellStatusBarService: INotebookCellStatusBarService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebook);
	}

	dispose(): void {
		this._disposables.dispose();
		dispose(this._notebookSerializer.values());
	}

	$registerNotebookSerializer(handle: number, extension: NotebookExtensionDescription, viewType: string, options: TransientOptions, data: INotebookContributionData | undefined): void {
		const disposables = new DisposableStore();

		disposables.add(this._notebookService.registerNotebookSerializer(viewType, extension, {
			options,
			dataToNotebook: async (data: VSBuffer): Promise<NotebookData> => {
				const sw = new StopWatch();
				let result: NotebookData;
				if (data.byteLength === 0 && viewType === 'interactive') {
					// we don't want any starting cells for an empty interactive window.
					result = NotebookDto.fromNotebookDataDto({ cells: [], metadata: {} });
				} else {
					const dto = await this._proxy.$dataToNotebook(handle, data, CancellationToken.None);
					result = NotebookDto.fromNotebookDataDto(dto.value);
				}
				this._logService.trace(`[NotebookSerializer] dataToNotebook DONE after ${sw.elapsed()}ms`, {
					viewType,
					extensionId: extension.id.value,
				});
				return result;
			},
			notebookToData: (data: NotebookData): Promise<VSBuffer> => {
				const sw = new StopWatch();
				const result = this._proxy.$notebookToData(handle, new SerializableObjectWithBuffers(NotebookDto.toNotebookDataDto(data)), CancellationToken.None);
				this._logService.trace(`[NotebookSerializer] notebookToData DONE after ${sw.elapsed()}`, {
					viewType,
					extensionId: extension.id.value,
				});
				return result;
			},
			save: async (uri, versionId, options, token) => {
				const stat = await this._proxy.$saveNotebook(handle, uri, versionId, options, token);
				if (isFileOperationError(stat)) {
					throw new FileOperationError(stat.message, stat.fileOperationResult, stat.options);
				}
				return {
					...stat,
					children: undefined,
					resource: uri
				};
			},
			searchInNotebooks: async (textQuery, token, allPriorityInfo): Promise<{ results: INotebookFileMatchNoModel<URI>[]; limitHit: boolean }> => {
				const contributedType = this._notebookService.getContributedNotebookType(viewType);
				if (!contributedType) {
					return { results: [], limitHit: false };
				}
				const fileNames = contributedType.selectors;

				const includes = fileNames.map((selector) => {
					const globPattern = (selector as INotebookExclusiveDocumentFilter).include || selector as IRelativePattern | string;
					return globPattern.toString();
				});

				if (!includes.length) {
					return {
						results: [], limitHit: false
					};
				}

				const thisPriorityInfo = coalesce<NotebookPriorityInfo>([{ isFromSettings: false, filenamePatterns: includes }, ...allPriorityInfo.get(viewType) ?? []]);
				const otherEditorsPriorityInfo = Array.from(allPriorityInfo.keys())
					.flatMap(key => {
						if (key !== viewType) {
							return allPriorityInfo.get(key) ?? [];
						}
						return [];
					});

				const searchComplete = await this._proxy.$searchInNotebooks(handle, textQuery, thisPriorityInfo, otherEditorsPriorityInfo, token);
				const revivedResults: INotebookFileMatchNoModel<URI>[] = searchComplete.results.map(result => {
					const resource = URI.revive(result.resource);
					return {
						resource,
						cellResults: result.cellResults.map(e => revive(e))
					};
				});
				return { results: revivedResults, limitHit: searchComplete.limitHit };
			}
		}));

		if (data) {
			disposables.add(this._notebookService.registerContributedNotebookType(viewType, data));
		}
		this._notebookSerializer.set(handle, disposables);

		this._logService.trace('[NotebookSerializer] registered notebook serializer', {
			viewType,
			extensionId: extension.id.value,
		});
	}

	$unregisterNotebookSerializer(handle: number): void {
		this._notebookSerializer.get(handle)?.dispose();
		this._notebookSerializer.delete(handle);
	}

	$emitCellStatusBarEvent(eventHandle: number): void {
		const emitter = this._notebookCellStatusBarRegistrations.get(eventHandle);
		if (emitter instanceof Emitter) {
			emitter.fire(undefined);
		}
	}

	async $registerNotebookCellStatusBarItemProvider(handle: number, eventHandle: number | undefined, viewType: string): Promise<void> {
		const that = this;
		const provider: INotebookCellStatusBarItemProvider = {
			async provideCellStatusBarItems(uri: URI, index: number, token: CancellationToken) {
				const result = await that._proxy.$provideNotebookCellStatusBarItems(handle, uri, index, token);
				return {
					items: result?.items ?? [],
					dispose() {
						if (result) {
							that._proxy.$releaseNotebookCellStatusBarItems(result.cacheId);
						}
					}
				};
			},
			viewType
		};

		if (typeof eventHandle === 'number') {
			const emitter = new Emitter<void>();
			this._notebookCellStatusBarRegistrations.set(eventHandle, emitter);
			provider.onDidChangeStatusBarItems = emitter.event;
		}

		const disposable = this._cellStatusBarService.registerCellStatusBarItemProvider(provider);
		this._notebookCellStatusBarRegistrations.set(handle, disposable);
	}

	async $unregisterNotebookCellStatusBarItemProvider(handle: number, eventHandle: number | undefined): Promise<void> {
		const unregisterThing = (handle: number) => {
			const entry = this._notebookCellStatusBarRegistrations.get(handle);
			if (entry) {
				this._notebookCellStatusBarRegistrations.get(handle)?.dispose();
				this._notebookCellStatusBarRegistrations.delete(handle);
			}
		};
		unregisterThing(handle);
		if (typeof eventHandle === 'number') {
			unregisterThing(eventHandle);
		}
	}
}

CommandsRegistry.registerCommand('_executeDataToNotebook', async (accessor, ...args) => {

	const [notebookType, bytes] = args;
	assertType(typeof notebookType === 'string', 'string');
	assertType(bytes instanceof VSBuffer, 'VSBuffer');

	const notebookService = accessor.get(INotebookService);
	const info = await notebookService.withNotebookDataProvider(notebookType);
	if (!(info instanceof SimpleNotebookProviderInfo)) {
		return;
	}

	const dto = await info.serializer.dataToNotebook(bytes);
	return new SerializableObjectWithBuffers(NotebookDto.toNotebookDataDto(dto));
});

CommandsRegistry.registerCommand('_executeNotebookToData', async (accessor, notebookType: string, dto: SerializableObjectWithBuffers<NotebookDataDto>) => {
	assertType(typeof notebookType === 'string', 'string');

	const notebookService = accessor.get(INotebookService);
	const info = await notebookService.withNotebookDataProvider(notebookType);
	if (!(info instanceof SimpleNotebookProviderInfo)) {
		return;
	}

	const data = NotebookDto.fromNotebookDataDto(dto.value);
	const bytes = await info.serializer.notebookToData(data);
	return bytes;
});

function isFileOperationError(error: unknown): error is FileOperationError {
	const candidate = error as FileOperationError | undefined;
	return typeof candidate?.fileOperationResult === 'number' && typeof candidate?.message === 'string';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookDocuments.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookDocuments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { DisposableStore, dispose } from '../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../base/common/map.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { BoundModelReferenceCollection } from './mainThreadDocuments.js';
import { NotebookTextModel } from '../../contrib/notebook/common/model/notebookTextModel.js';
import { NotebookCellsChangeType } from '../../contrib/notebook/common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../contrib/notebook/common/notebookEditorModelResolverService.js';
import { IUriIdentityService } from '../../../platform/uriIdentity/common/uriIdentity.js';
import { ExtHostContext, ExtHostNotebookDocumentsShape, MainThreadNotebookDocumentsShape, NotebookCellDto, NotebookCellsChangedEventDto, NotebookDataDto } from '../common/extHost.protocol.js';
import { NotebookDto } from './mainThreadNotebookDto.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';

export class MainThreadNotebookDocuments implements MainThreadNotebookDocumentsShape {

	private readonly _disposables = new DisposableStore();

	private readonly _proxy: ExtHostNotebookDocumentsShape;
	private readonly _documentEventListenersMapping = new ResourceMap<DisposableStore>();
	private readonly _modelReferenceCollection: BoundModelReferenceCollection;

	constructor(
		extHostContext: IExtHostContext,
		@INotebookEditorModelResolverService private readonly _notebookEditorModelResolverService: INotebookEditorModelResolverService,
		@IUriIdentityService private readonly _uriIdentityService: IUriIdentityService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebookDocuments);
		this._modelReferenceCollection = new BoundModelReferenceCollection(this._uriIdentityService.extUri);

		// forward dirty and save events
		this._disposables.add(this._notebookEditorModelResolverService.onDidChangeDirty(model => this._proxy.$acceptDirtyStateChanged(model.resource, model.isDirty())));
		this._disposables.add(this._notebookEditorModelResolverService.onDidSaveNotebook(e => this._proxy.$acceptModelSaved(e)));

		// when a conflict is going to happen RELEASE references that are held by extensions
		this._disposables.add(_notebookEditorModelResolverService.onWillFailWithConflict(e => {
			this._modelReferenceCollection.remove(e.resource);
		}));
	}

	dispose(): void {
		this._disposables.dispose();
		this._modelReferenceCollection.dispose();
		dispose(this._documentEventListenersMapping.values());
	}

	handleNotebooksAdded(notebooks: readonly NotebookTextModel[]): void {

		for (const textModel of notebooks) {
			const disposableStore = new DisposableStore();
			disposableStore.add(textModel.onDidChangeContent(event => {

				const eventDto: NotebookCellsChangedEventDto = {
					versionId: event.versionId,
					rawEvents: []
				};

				for (const e of event.rawEvents) {

					switch (e.kind) {
						case NotebookCellsChangeType.ModelChange:
							eventDto.rawEvents.push({
								kind: e.kind,
								changes: e.changes.map(diff => [diff[0], diff[1], diff[2].map(cell => NotebookDto.toNotebookCellDto(cell))] as [number, number, NotebookCellDto[]])
							});
							break;
						case NotebookCellsChangeType.Move:
							eventDto.rawEvents.push({
								kind: e.kind,
								index: e.index,
								length: e.length,
								newIdx: e.newIdx,
							});
							break;
						case NotebookCellsChangeType.Output:
							eventDto.rawEvents.push({
								kind: e.kind,
								index: e.index,
								outputs: e.outputs.map(NotebookDto.toNotebookOutputDto)
							});
							break;
						case NotebookCellsChangeType.OutputItem:
							eventDto.rawEvents.push({
								kind: e.kind,
								index: e.index,
								outputId: e.outputId,
								outputItems: e.outputItems.map(NotebookDto.toNotebookOutputItemDto),
								append: e.append
							});
							break;
						case NotebookCellsChangeType.ChangeCellLanguage:
						case NotebookCellsChangeType.ChangeCellContent:
						case NotebookCellsChangeType.ChangeCellMetadata:
						case NotebookCellsChangeType.ChangeCellInternalMetadata:
							eventDto.rawEvents.push(e);
							break;
					}
				}

				const hasDocumentMetadataChangeEvent = event.rawEvents.find(e => e.kind === NotebookCellsChangeType.ChangeDocumentMetadata);

				// using the model resolver service to know if the model is dirty or not.
				// assuming this is the first listener it can mean that at first the model
				// is marked as dirty and that another event is fired
				this._proxy.$acceptModelChanged(
					textModel.uri,
					new SerializableObjectWithBuffers(eventDto),
					this._notebookEditorModelResolverService.isDirty(textModel.uri),
					hasDocumentMetadataChangeEvent ? textModel.metadata : undefined
				);
			}));

			this._documentEventListenersMapping.set(textModel.uri, disposableStore);
		}
	}

	handleNotebooksRemoved(uris: URI[]): void {
		for (const uri of uris) {
			this._documentEventListenersMapping.get(uri)?.dispose();
			this._documentEventListenersMapping.delete(uri);
		}
	}

	async $tryCreateNotebook(options: { viewType: string; content?: NotebookDataDto }): Promise<UriComponents> {
		if (options.content) {
			const ref = await this._notebookEditorModelResolverService.resolve({ untitledResource: undefined }, options.viewType);

			// untitled notebooks are disposed when they get saved. we should not hold a reference
			// to such a disposed notebook and therefore dispose the reference as well
			Event.once(ref.object.notebook.onWillDispose)(() => {
				ref.dispose();
			});

			// untitled notebooks with content are dirty by default
			this._proxy.$acceptDirtyStateChanged(ref.object.resource, true);

			// apply content changes... slightly HACKY -> this triggers a change event
			if (options.content) {
				const data = NotebookDto.fromNotebookDataDto(options.content);
				ref.object.notebook.reset(data.cells, data.metadata, ref.object.notebook.transientOptions);
			}
			return ref.object.notebook.uri;
		} else {
			// If we aren't adding content, we don't need to resolve the full editor model yet.
			// This will allow us to adjust settings when the editor is opened, e.g. scratchpad
			const notebook = await this._notebookEditorModelResolverService.createUntitledNotebookTextModel(options.viewType);
			return notebook.uri;
		}
	}

	async $tryOpenNotebook(uriComponents: UriComponents): Promise<URI> {
		const uri = URI.revive(uriComponents);
		const ref = await this._notebookEditorModelResolverService.resolve(uri, undefined);

		if (uriComponents.scheme === 'untitled') {
			// untitled notebooks are disposed when they get saved. we should not hold a reference
			// to such a disposed notebook and therefore dispose the reference as well
			ref.object.notebook.onWillDispose(() => {
				ref.dispose();
			});
		}

		this._modelReferenceCollection.add(uri, ref);
		return uri;
	}

	async $trySaveNotebook(uriComponents: UriComponents) {
		const uri = URI.revive(uriComponents);

		const ref = await this._notebookEditorModelResolverService.resolve(uri);
		const saveResult = await ref.object.save();
		ref.dispose();
		return saveResult;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookDocumentsAndEditors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookDocumentsAndEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { diffMaps, diffSets } from '../../../base/common/collections.js';
import { combinedDisposable, DisposableStore, DisposableMap } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { MainThreadNotebookDocuments } from './mainThreadNotebookDocuments.js';
import { NotebookDto } from './mainThreadNotebookDto.js';
import { MainThreadNotebookEditors } from './mainThreadNotebookEditors.js';
import { extHostCustomer, IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { getNotebookEditorFromEditorPane, IActiveNotebookEditor, INotebookEditor } from '../../contrib/notebook/browser/notebookBrowser.js';
import { INotebookEditorService } from '../../contrib/notebook/browser/services/notebookEditorService.js';
import { NotebookTextModel } from '../../contrib/notebook/common/model/notebookTextModel.js';
import { INotebookService } from '../../contrib/notebook/common/notebookService.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { ExtHostContext, ExtHostNotebookShape, INotebookDocumentsAndEditorsDelta, INotebookEditorAddData, INotebookModelAddedData, MainContext } from '../common/extHost.protocol.js';
import { SerializableObjectWithBuffers } from '../../services/extensions/common/proxyIdentifier.js';

interface INotebookAndEditorDelta {
	removedDocuments: URI[];
	addedDocuments: NotebookTextModel[];
	removedEditors: string[];
	addedEditors: IActiveNotebookEditor[];
	newActiveEditor?: string | null;
	visibleEditors?: string[];
}

class NotebookAndEditorState {
	static delta(before: NotebookAndEditorState | undefined, after: NotebookAndEditorState): INotebookAndEditorDelta {
		if (!before) {
			return {
				addedDocuments: [...after.documents],
				removedDocuments: [],
				addedEditors: [...after.textEditors.values()],
				removedEditors: [],
				visibleEditors: [...after.visibleEditors].map(editor => editor[0])
			};
		}
		const documentDelta = diffSets(before.documents, after.documents);
		const editorDelta = diffMaps(before.textEditors, after.textEditors);

		const newActiveEditor = before.activeEditor !== after.activeEditor ? after.activeEditor : undefined;
		const visibleEditorDelta = diffMaps(before.visibleEditors, after.visibleEditors);

		return {
			addedDocuments: documentDelta.added,
			removedDocuments: documentDelta.removed.map(e => e.uri),
			addedEditors: editorDelta.added,
			removedEditors: editorDelta.removed.map(removed => removed.getId()),
			newActiveEditor: newActiveEditor,
			visibleEditors: visibleEditorDelta.added.length === 0 && visibleEditorDelta.removed.length === 0
				? undefined
				: [...after.visibleEditors].map(editor => editor[0])
		};
	}

	constructor(
		readonly documents: Set<NotebookTextModel>,
		readonly textEditors: Map<string, IActiveNotebookEditor>,
		readonly activeEditor: string | null | undefined,
		readonly visibleEditors: Map<string, IActiveNotebookEditor>
	) {
		//
	}
}

@extHostCustomer
export class MainThreadNotebooksAndEditors {

	// private readonly _onDidAddNotebooks = new Emitter<NotebookTextModel[]>();
	// private readonly _onDidRemoveNotebooks = new Emitter<URI[]>();
	// private readonly _onDidAddEditors = new Emitter<IActiveNotebookEditor[]>();
	// private readonly _onDidRemoveEditors = new Emitter<string[]>();

	// readonly onDidAddNotebooks: Event<NotebookTextModel[]> = this._onDidAddNotebooks.event;
	// readonly onDidRemoveNotebooks: Event<URI[]> = this._onDidRemoveNotebooks.event;
	// readonly onDidAddEditors: Event<IActiveNotebookEditor[]> = this._onDidAddEditors.event;
	// readonly onDidRemoveEditors: Event<string[]> = this._onDidRemoveEditors.event;

	private readonly _proxy: Pick<ExtHostNotebookShape, '$acceptDocumentAndEditorsDelta'>;
	private readonly _disposables = new DisposableStore();

	private readonly _editorListeners = new DisposableMap<string>();

	private _currentState?: NotebookAndEditorState;

	private readonly _mainThreadNotebooks: MainThreadNotebookDocuments;
	private readonly _mainThreadEditors: MainThreadNotebookEditors;

	constructor(
		extHostContext: IExtHostContext,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookService private readonly _notebookService: INotebookService,
		@INotebookEditorService private readonly _notebookEditorService: INotebookEditorService,
		@IEditorService private readonly _editorService: IEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@ILogService private readonly _logService: ILogService,
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebook);

		this._mainThreadNotebooks = instantiationService.createInstance(MainThreadNotebookDocuments, extHostContext);
		this._mainThreadEditors = instantiationService.createInstance(MainThreadNotebookEditors, extHostContext);

		extHostContext.set(MainContext.MainThreadNotebookDocuments, this._mainThreadNotebooks);
		extHostContext.set(MainContext.MainThreadNotebookEditors, this._mainThreadEditors);

		this._notebookService.onWillAddNotebookDocument(() => this._updateState(), this, this._disposables);
		this._notebookService.onDidRemoveNotebookDocument(() => this._updateState(), this, this._disposables);
		this._editorService.onDidActiveEditorChange(() => this._updateState(), this, this._disposables);
		this._editorService.onDidVisibleEditorsChange(() => this._updateState(), this, this._disposables);
		this._notebookEditorService.onDidAddNotebookEditor(this._handleEditorAdd, this, this._disposables);
		this._notebookEditorService.onDidRemoveNotebookEditor(this._handleEditorRemove, this, this._disposables);
		this._updateState();
	}

	dispose() {
		this._mainThreadNotebooks.dispose();
		this._mainThreadEditors.dispose();
		this._disposables.dispose();
		this._editorListeners.dispose();
	}

	private _handleEditorAdd(editor: INotebookEditor): void {
		this._editorListeners.set(editor.getId(), combinedDisposable(
			editor.onDidChangeModel(() => this._updateState()),
			editor.onDidFocusWidget(() => this._updateState(editor)),
		));
		this._updateState();
	}

	private _handleEditorRemove(editor: INotebookEditor): void {
		this._editorListeners.deleteAndDispose(editor.getId());
		this._updateState();
	}

	private _updateState(focusedEditor?: INotebookEditor): void {

		const editors = new Map<string, IActiveNotebookEditor>();
		const visibleEditorsMap = new Map<string, IActiveNotebookEditor>();

		for (const editor of this._notebookEditorService.listNotebookEditors()) {
			if (editor.hasModel()) {
				editors.set(editor.getId(), editor);
			}
		}

		const activeNotebookEditor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
		let activeEditor: string | null = null;
		if (activeNotebookEditor) {
			activeEditor = activeNotebookEditor.getId();
		} else if (focusedEditor?.textModel) {
			activeEditor = focusedEditor.getId();
		}
		if (activeEditor && !editors.has(activeEditor)) {
			this._logService.trace('MainThreadNotebooksAndEditors#_updateState: active editor is not in editors list', activeEditor, editors.keys());
			activeEditor = null;
		}

		for (const editorPane of this._editorService.visibleEditorPanes) {
			const notebookEditor = getNotebookEditorFromEditorPane(editorPane);
			if (notebookEditor?.hasModel() && editors.has(notebookEditor.getId())) {
				visibleEditorsMap.set(notebookEditor.getId(), notebookEditor);
			}
		}

		const newState = new NotebookAndEditorState(new Set(this._notebookService.listNotebookDocuments()), editors, activeEditor, visibleEditorsMap);
		this._onDelta(NotebookAndEditorState.delta(this._currentState, newState));
		this._currentState = newState;
	}

	private _onDelta(delta: INotebookAndEditorDelta): void {
		if (MainThreadNotebooksAndEditors._isDeltaEmpty(delta)) {
			return;
		}

		const dto: INotebookDocumentsAndEditorsDelta = {
			removedDocuments: delta.removedDocuments,
			removedEditors: delta.removedEditors,
			newActiveEditor: delta.newActiveEditor,
			visibleEditors: delta.visibleEditors,
			addedDocuments: delta.addedDocuments.map(MainThreadNotebooksAndEditors._asModelAddData),
			addedEditors: delta.addedEditors.map(this._asEditorAddData, this),
		};

		// send to extension FIRST
		this._proxy.$acceptDocumentAndEditorsDelta(new SerializableObjectWithBuffers(dto));

		// handle internally
		this._mainThreadEditors.handleEditorsRemoved(delta.removedEditors);
		this._mainThreadNotebooks.handleNotebooksRemoved(delta.removedDocuments);
		this._mainThreadNotebooks.handleNotebooksAdded(delta.addedDocuments);
		this._mainThreadEditors.handleEditorsAdded(delta.addedEditors);
	}

	private static _isDeltaEmpty(delta: INotebookAndEditorDelta): boolean {
		if (delta.addedDocuments !== undefined && delta.addedDocuments.length > 0) {
			return false;
		}
		if (delta.removedDocuments !== undefined && delta.removedDocuments.length > 0) {
			return false;
		}
		if (delta.addedEditors !== undefined && delta.addedEditors.length > 0) {
			return false;
		}
		if (delta.removedEditors !== undefined && delta.removedEditors.length > 0) {
			return false;
		}
		if (delta.visibleEditors !== undefined && delta.visibleEditors.length > 0) {
			return false;
		}
		if (delta.newActiveEditor !== undefined) {
			return false;
		}
		return true;
	}

	private static _asModelAddData(e: NotebookTextModel): INotebookModelAddedData {
		return {
			viewType: e.viewType,
			uri: e.uri,
			metadata: e.metadata,
			versionId: e.versionId,
			cells: e.cells.map(NotebookDto.toNotebookCellDto)
		};
	}

	private _asEditorAddData(add: IActiveNotebookEditor): INotebookEditorAddData {

		const pane = this._editorService.visibleEditorPanes.find(pane => getNotebookEditorFromEditorPane(pane) === add);

		return {
			id: add.getId(),
			documentUri: add.textModel.uri,
			selections: add.getSelections(),
			visibleRanges: add.visibleRanges,
			viewColumn: pane && editorGroupToColumn(this._editorGroupService, pane.group),
			viewType: add.getViewModel().viewType
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookDto.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookDto.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as extHostProtocol from '../common/extHost.protocol.js';
import * as notebookCommon from '../../contrib/notebook/common/notebookCommon.js';
import { CellExecutionUpdateType } from '../../contrib/notebook/common/notebookExecutionService.js';
import { ICellExecuteUpdate, ICellExecutionComplete } from '../../contrib/notebook/common/notebookExecutionStateService.js';

export namespace NotebookDto {

	export function toNotebookOutputItemDto(item: notebookCommon.IOutputItemDto): extHostProtocol.NotebookOutputItemDto {
		return {
			mime: item.mime,
			valueBytes: item.data
		};
	}

	export function toNotebookOutputDto(output: notebookCommon.IOutputDto): extHostProtocol.NotebookOutputDto {
		return {
			outputId: output.outputId,
			metadata: output.metadata,
			items: output.outputs.map(toNotebookOutputItemDto)
		};
	}

	export function toNotebookCellDataDto(cell: notebookCommon.ICellDto2): extHostProtocol.NotebookCellDataDto {
		return {
			cellKind: cell.cellKind,
			language: cell.language,
			mime: cell.mime,
			source: cell.source,
			internalMetadata: cell.internalMetadata,
			metadata: cell.metadata,
			outputs: cell.outputs.map(toNotebookOutputDto)
		};
	}

	export function toNotebookDataDto(data: notebookCommon.NotebookData): extHostProtocol.NotebookDataDto {
		return {
			metadata: data.metadata,
			cells: data.cells.map(toNotebookCellDataDto)
		};
	}

	export function fromNotebookOutputItemDto(item: extHostProtocol.NotebookOutputItemDto): notebookCommon.IOutputItemDto {
		return {
			mime: item.mime,
			data: item.valueBytes
		};
	}

	export function fromNotebookOutputDto(output: extHostProtocol.NotebookOutputDto): notebookCommon.IOutputDto {
		return {
			outputId: output.outputId,
			metadata: output.metadata,
			outputs: output.items.map(fromNotebookOutputItemDto)
		};
	}

	export function fromNotebookCellDataDto(cell: extHostProtocol.NotebookCellDataDto): notebookCommon.ICellDto2 {
		return {
			cellKind: cell.cellKind,
			language: cell.language,
			mime: cell.mime,
			source: cell.source,
			outputs: cell.outputs.map(fromNotebookOutputDto),
			metadata: cell.metadata,
			internalMetadata: cell.internalMetadata
		};
	}

	export function fromNotebookDataDto(data: extHostProtocol.NotebookDataDto): notebookCommon.NotebookData {
		return {
			metadata: data.metadata,
			cells: data.cells.map(fromNotebookCellDataDto)
		};
	}

	export function toNotebookCellDto(cell: notebookCommon.ICell): extHostProtocol.NotebookCellDto {
		return {
			handle: cell.handle,
			uri: cell.uri,
			source: cell.textBuffer.getLinesContent(),
			eol: cell.textBuffer.getEOL(),
			language: cell.language,
			cellKind: cell.cellKind,
			outputs: cell.outputs.map(toNotebookOutputDto),
			metadata: cell.metadata,
			internalMetadata: cell.internalMetadata,
		};
	}

	export function fromCellExecuteUpdateDto(data: extHostProtocol.ICellExecuteUpdateDto): ICellExecuteUpdate {
		if (data.editType === CellExecutionUpdateType.Output) {
			return {
				editType: data.editType,
				cellHandle: data.cellHandle,
				append: data.append,
				outputs: data.outputs.map(fromNotebookOutputDto)
			};
		} else if (data.editType === CellExecutionUpdateType.OutputItems) {
			return {
				editType: data.editType,
				append: data.append,
				outputId: data.outputId,
				items: data.items.map(fromNotebookOutputItemDto)
			};
		} else {
			return data;
		}
	}

	export function fromCellExecuteCompleteDto(data: extHostProtocol.ICellExecutionCompleteDto): ICellExecutionComplete {
		return data;
	}

	export function fromCellEditOperationDto(edit: extHostProtocol.ICellEditOperationDto): notebookCommon.ICellEditOperation {
		if (edit.editType === notebookCommon.CellEditType.Replace) {
			return {
				editType: edit.editType,
				index: edit.index,
				count: edit.count,
				cells: edit.cells.map(fromNotebookCellDataDto)
			};
		} else {
			return edit;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/api/browser/mainThreadNotebookEditors.ts]---
Location: vscode-main/src/vs/workbench/api/browser/mainThreadNotebookEditors.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, dispose } from '../../../base/common/lifecycle.js';
import { equals } from '../../../base/common/objects.js';
import { URI, UriComponents } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { EditorActivation } from '../../../platform/editor/common/editor.js';
import { getNotebookEditorFromEditorPane, INotebookEditor, INotebookEditorOptions } from '../../contrib/notebook/browser/notebookBrowser.js';
import { INotebookEditorService } from '../../contrib/notebook/browser/services/notebookEditorService.js';
import { ICellRange } from '../../contrib/notebook/common/notebookRange.js';
import { columnToEditorGroup, editorGroupToColumn } from '../../services/editor/common/editorGroupColumn.js';
import { IEditorGroupsService } from '../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import { IExtHostContext } from '../../services/extensions/common/extHostCustomers.js';
import { ExtHostContext, ExtHostNotebookEditorsShape, INotebookDocumentShowOptions, INotebookEditorViewColumnInfo, MainThreadNotebookEditorsShape, NotebookEditorRevealType } from '../common/extHost.protocol.js';

class MainThreadNotebook {

	constructor(
		readonly editor: INotebookEditor,
		readonly disposables: DisposableStore
	) { }

	dispose() {
		this.disposables.dispose();
	}
}

export class MainThreadNotebookEditors implements MainThreadNotebookEditorsShape {

	private readonly _disposables = new DisposableStore();

	private readonly _proxy: ExtHostNotebookEditorsShape;
	private readonly _mainThreadEditors = new Map<string, MainThreadNotebook>();

	private _currentViewColumnInfo?: INotebookEditorViewColumnInfo;

	constructor(
		extHostContext: IExtHostContext,
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookEditorService private readonly _notebookEditorService: INotebookEditorService,
		@IEditorGroupsService private readonly _editorGroupService: IEditorGroupsService,
		@IConfigurationService private readonly _configurationService: IConfigurationService
	) {
		this._proxy = extHostContext.getProxy(ExtHostContext.ExtHostNotebookEditors);

		this._editorService.onDidActiveEditorChange(() => this._updateEditorViewColumns(), this, this._disposables);
		this._editorGroupService.onDidRemoveGroup(() => this._updateEditorViewColumns(), this, this._disposables);
		this._editorGroupService.onDidMoveGroup(() => this._updateEditorViewColumns(), this, this._disposables);
	}

	dispose(): void {
		this._disposables.dispose();
		dispose(this._mainThreadEditors.values());
	}

	handleEditorsAdded(editors: readonly INotebookEditor[]): void {

		for (const editor of editors) {

			const editorDisposables = new DisposableStore();
			editorDisposables.add(editor.onDidChangeVisibleRanges(() => {
				this._proxy.$acceptEditorPropertiesChanged(editor.getId(), { visibleRanges: { ranges: editor.visibleRanges } });
			}));

			editorDisposables.add(editor.onDidChangeSelection(() => {
				this._proxy.$acceptEditorPropertiesChanged(editor.getId(), { selections: { selections: editor.getSelections() } });
			}));

			const wrapper = new MainThreadNotebook(editor, editorDisposables);
			this._mainThreadEditors.set(editor.getId(), wrapper);
		}
	}

	handleEditorsRemoved(editorIds: readonly string[]): void {
		for (const id of editorIds) {
			this._mainThreadEditors.get(id)?.dispose();
			this._mainThreadEditors.delete(id);
		}
	}

	private _updateEditorViewColumns(): void {
		const result: INotebookEditorViewColumnInfo = Object.create(null);
		for (const editorPane of this._editorService.visibleEditorPanes) {
			const candidate = getNotebookEditorFromEditorPane(editorPane);
			if (candidate && this._mainThreadEditors.has(candidate.getId())) {
				result[candidate.getId()] = editorGroupToColumn(this._editorGroupService, editorPane.group);
			}
		}
		if (!equals(result, this._currentViewColumnInfo)) {
			this._currentViewColumnInfo = result;
			this._proxy.$acceptEditorViewColumns(result);
		}
	}

	async $tryShowNotebookDocument(resource: UriComponents, viewType: string, options: INotebookDocumentShowOptions): Promise<string> {
		const editorOptions: INotebookEditorOptions = {
			cellSelections: options.selections,
			preserveFocus: options.preserveFocus,
			pinned: options.pinned,
			// selection: options.selection,
			// preserve pre 1.38 behaviour to not make group active when preserveFocus: true
			// but make sure to restore the editor to fix https://github.com/microsoft/vscode/issues/79633
			activation: options.preserveFocus ? EditorActivation.RESTORE : undefined,
			label: options.label,
			override: viewType
		};

		const editorPane = await this._editorService.openEditor({ resource: URI.revive(resource), options: editorOptions }, columnToEditorGroup(this._editorGroupService, this._configurationService, options.position));
		const notebookEditor = getNotebookEditorFromEditorPane(editorPane);

		if (notebookEditor) {
			return notebookEditor.getId();
		} else {
			throw new Error(`Notebook Editor creation failure for document ${JSON.stringify(resource)}`);
		}
	}

	async $tryRevealRange(id: string, range: ICellRange, revealType: NotebookEditorRevealType): Promise<void> {
		const editor = this._notebookEditorService.getNotebookEditor(id);
		if (!editor) {
			return;
		}
		const notebookEditor = editor;
		if (!notebookEditor.hasModel()) {
			return;
		}

		if (range.start >= notebookEditor.getLength()) {
			return;
		}

		const cell = notebookEditor.cellAt(range.start);

		switch (revealType) {
			case NotebookEditorRevealType.Default:
				return notebookEditor.revealCellRangeInView(range);
			case NotebookEditorRevealType.InCenter:
				return notebookEditor.revealInCenter(cell);
			case NotebookEditorRevealType.InCenterIfOutsideViewport:
				return notebookEditor.revealInCenterIfOutsideViewport(cell);
			case NotebookEditorRevealType.AtTop:
				return notebookEditor.revealInViewAtTop(cell);
		}
	}

	$trySetSelections(id: string, ranges: ICellRange[]): void {
		const editor = this._notebookEditorService.getNotebookEditor(id);
		if (!editor) {
			return;
		}

		editor.setSelections(ranges);

		if (ranges.length) {
			editor.setFocus({ start: ranges[0].start, end: ranges[0].start + 1 });
		}
	}
}
```

--------------------------------------------------------------------------------

````
