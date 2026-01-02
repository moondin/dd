---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 284
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 284 of 552)

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

---[FILE: src/vs/platform/storage/common/storageService.ts]---
Location: vscode-main/src/vs/platform/storage/common/storageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { Schemas } from '../../../base/common/network.js';
import { joinPath } from '../../../base/common/resources.js';
import { IStorage, Storage } from '../../../base/parts/storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IRemoteService } from '../../ipc/common/services.js';
import { AbstractStorageService, isProfileUsingDefaultStorage, StorageScope, WillSaveStateReason } from './storage.js';
import { ApplicationStorageDatabaseClient, ProfileStorageDatabaseClient, WorkspaceStorageDatabaseClient } from './storageIpc.js';
import { isUserDataProfile, IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export class RemoteStorageService extends AbstractStorageService {

	private readonly applicationStorageProfile: IUserDataProfile;
	private readonly applicationStorage: IStorage;

	private profileStorageProfile: IUserDataProfile;
	private readonly profileStorageDisposables = this._register(new DisposableStore());
	private profileStorage: IStorage;

	private workspaceStorageId: string | undefined;
	private readonly workspaceStorageDisposables = this._register(new DisposableStore());
	private workspaceStorage: IStorage | undefined;

	constructor(
		initialWorkspace: IAnyWorkspaceIdentifier | undefined,
		initialProfiles: { defaultProfile: IUserDataProfile; currentProfile: IUserDataProfile },
		private readonly remoteService: IRemoteService,
		private readonly environmentService: IEnvironmentService
	) {
		super();

		this.applicationStorageProfile = initialProfiles.defaultProfile;
		this.applicationStorage = this.createApplicationStorage();

		this.profileStorageProfile = initialProfiles.currentProfile;
		this.profileStorage = this.createProfileStorage(this.profileStorageProfile);

		this.workspaceStorageId = initialWorkspace?.id;
		this.workspaceStorage = this.createWorkspaceStorage(initialWorkspace);
	}

	private createApplicationStorage(): IStorage {
		const storageDataBaseClient = this._register(new ApplicationStorageDatabaseClient(this.remoteService.getChannel('storage')));
		const applicationStorage = this._register(new Storage(storageDataBaseClient));

		this._register(applicationStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.APPLICATION, e)));

		return applicationStorage;
	}

	private createProfileStorage(profile: IUserDataProfile): IStorage {

		// First clear any previously associated disposables
		this.profileStorageDisposables.clear();

		// Remember profile associated to profile storage
		this.profileStorageProfile = profile;

		let profileStorage: IStorage;
		if (isProfileUsingDefaultStorage(profile)) {

			// If we are using default profile storage, the profile storage is
			// actually the same as application storage. As such we
			// avoid creating the storage library a second time on
			// the same DB.

			profileStorage = this.applicationStorage;
		} else {
			const storageDataBaseClient = this.profileStorageDisposables.add(new ProfileStorageDatabaseClient(this.remoteService.getChannel('storage'), profile));
			profileStorage = this.profileStorageDisposables.add(new Storage(storageDataBaseClient));
		}

		this.profileStorageDisposables.add(profileStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.PROFILE, e)));

		return profileStorage;
	}

	private createWorkspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorage;
	private createWorkspaceStorage(workspace: IAnyWorkspaceIdentifier | undefined): IStorage | undefined;
	private createWorkspaceStorage(workspace: IAnyWorkspaceIdentifier | undefined): IStorage | undefined {

		// First clear any previously associated disposables
		this.workspaceStorageDisposables.clear();

		// Remember workspace ID for logging later
		this.workspaceStorageId = workspace?.id;

		let workspaceStorage: IStorage | undefined = undefined;
		if (workspace) {
			const storageDataBaseClient = this.workspaceStorageDisposables.add(new WorkspaceStorageDatabaseClient(this.remoteService.getChannel('storage'), workspace));
			workspaceStorage = this.workspaceStorageDisposables.add(new Storage(storageDataBaseClient));

			this.workspaceStorageDisposables.add(workspaceStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.WORKSPACE, e)));
		}

		return workspaceStorage;
	}

	protected async doInitialize(): Promise<void> {

		// Init all storage locations
		await Promises.settled([
			this.applicationStorage.init(),
			this.profileStorage.init(),
			this.workspaceStorage?.init() ?? Promise.resolve()
		]);
	}

	protected getStorage(scope: StorageScope): IStorage | undefined {
		switch (scope) {
			case StorageScope.APPLICATION:
				return this.applicationStorage;
			case StorageScope.PROFILE:
				return this.profileStorage;
			default:
				return this.workspaceStorage;
		}
	}

	protected getLogDetails(scope: StorageScope): string | undefined {
		switch (scope) {
			case StorageScope.APPLICATION:
				return this.applicationStorageProfile.globalStorageHome.with({ scheme: Schemas.file }).fsPath;
			case StorageScope.PROFILE:
				return this.profileStorageProfile?.globalStorageHome.with({ scheme: Schemas.file }).fsPath;
			default:
				return this.workspaceStorageId ? `${joinPath(this.environmentService.workspaceStorageHome, this.workspaceStorageId, 'state.vscdb').with({ scheme: Schemas.file }).fsPath}` : undefined;
		}
	}

	async close(): Promise<void> {

		// Stop periodic scheduler and idle runner as we now collect state normally
		this.stopFlushWhenIdle();

		// Signal as event so that clients can still store data
		this.emitWillSaveState(WillSaveStateReason.SHUTDOWN);

		// Do it
		await Promises.settled([
			this.applicationStorage.close(),
			this.profileStorage.close(),
			this.workspaceStorage?.close() ?? Promise.resolve()
		]);
	}

	protected async switchToProfile(toProfile: IUserDataProfile): Promise<void> {
		if (!this.canSwitchProfile(this.profileStorageProfile, toProfile)) {
			return;
		}

		const oldProfileStorage = this.profileStorage;
		const oldItems = oldProfileStorage.items;

		// Close old profile storage but only if this is
		// different from application storage!
		if (oldProfileStorage !== this.applicationStorage) {
			await oldProfileStorage.close();
		}

		// Create new profile storage & init
		this.profileStorage = this.createProfileStorage(toProfile);
		await this.profileStorage.init();

		// Handle data switch and eventing
		this.switchData(oldItems, this.profileStorage, StorageScope.PROFILE);
	}

	protected async switchToWorkspace(toWorkspace: IAnyWorkspaceIdentifier, preserveData: boolean): Promise<void> {
		const oldWorkspaceStorage = this.workspaceStorage;
		const oldItems = oldWorkspaceStorage?.items ?? new Map();

		// Close old workspace storage
		await oldWorkspaceStorage?.close();

		// Create new workspace storage & init
		this.workspaceStorage = this.createWorkspaceStorage(toWorkspace);
		await this.workspaceStorage.init();

		// Handle data switch and eventing
		this.switchData(oldItems, this.workspaceStorage, StorageScope.WORKSPACE);
	}

	hasScope(scope: IAnyWorkspaceIdentifier | IUserDataProfile): boolean {
		if (isUserDataProfile(scope)) {
			return this.profileStorageProfile.id === scope.id;
		}

		return this.workspaceStorageId === scope.id;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/electron-main/storageIpc.ts]---
Location: vscode-main/src/vs/platform/storage/electron-main/storageIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { revive } from '../../../base/common/marshalling.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IBaseSerializableStorageRequest, ISerializableItemsChangeEvent, ISerializableUpdateRequest, Key, Value } from '../common/storageIpc.js';
import { IStorageChangeEvent, IStorageMain } from './storageMain.js';
import { IStorageMainService } from './storageMainService.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { reviveIdentifier, IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';

export class StorageDatabaseChannel extends Disposable implements IServerChannel {

	private static readonly STORAGE_CHANGE_DEBOUNCE_TIME = 100;

	private readonly onDidChangeApplicationStorageEmitter = this._register(new Emitter<ISerializableItemsChangeEvent>());

	private readonly mapProfileToOnDidChangeProfileStorageEmitter = new Map<string /* profile ID */, Emitter<ISerializableItemsChangeEvent>>();

	constructor(
		private readonly logService: ILogService,
		private readonly storageMainService: IStorageMainService
	) {
		super();

		this.registerStorageChangeListeners(storageMainService.applicationStorage, this.onDidChangeApplicationStorageEmitter);
	}

	//#region Storage Change Events

	private registerStorageChangeListeners(storage: IStorageMain, emitter: Emitter<ISerializableItemsChangeEvent>): void {

		// Listen for changes in provided storage to send to listeners
		// that are listening. Use a debouncer to reduce IPC traffic.

		this._register(Event.debounce(storage.onDidChangeStorage, (prev: IStorageChangeEvent[] | undefined, cur: IStorageChangeEvent) => {
			if (!prev) {
				prev = [cur];
			} else {
				prev.push(cur);
			}

			return prev;
		}, StorageDatabaseChannel.STORAGE_CHANGE_DEBOUNCE_TIME)(events => {
			if (events.length) {
				emitter.fire(this.serializeStorageChangeEvents(events, storage));
			}
		}));
	}

	private serializeStorageChangeEvents(events: IStorageChangeEvent[], storage: IStorageMain): ISerializableItemsChangeEvent {
		const changed = new Map<Key, Value>();
		const deleted = new Set<Key>();
		events.forEach(event => {
			const existing = storage.get(event.key);
			if (typeof existing === 'string') {
				changed.set(event.key, existing);
			} else {
				deleted.add(event.key);
			}
		});

		return {
			changed: Array.from(changed.entries()),
			deleted: Array.from(deleted.values())
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listen(_: unknown, event: string, arg: IBaseSerializableStorageRequest): Event<any> {
		switch (event) {
			case 'onDidChangeStorage': {
				const profile = arg.profile ? revive<IUserDataProfile>(arg.profile) : undefined;

				// Without profile: application scope
				if (!profile) {
					return this.onDidChangeApplicationStorageEmitter.event;
				}

				// With profile: profile scope for the profile
				let profileStorageChangeEmitter = this.mapProfileToOnDidChangeProfileStorageEmitter.get(profile.id);
				if (!profileStorageChangeEmitter) {
					profileStorageChangeEmitter = this._register(new Emitter<ISerializableItemsChangeEvent>());
					this.registerStorageChangeListeners(this.storageMainService.profileStorage(profile), profileStorageChangeEmitter);
					this.mapProfileToOnDidChangeProfileStorageEmitter.set(profile.id, profileStorageChangeEmitter);
				}

				return profileStorageChangeEmitter.event;
			}
		}

		throw new Error(`Event not found: ${event}`);
	}

	//#endregion

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async call(_: unknown, command: string, arg: IBaseSerializableStorageRequest): Promise<any> {
		const profile = arg.profile ? revive<IUserDataProfile>(arg.profile) : undefined;
		const workspace = reviveIdentifier(arg.workspace);

		// Get storage to be ready
		const storage = await this.withStorageInitialized(profile, workspace);

		// handle call
		switch (command) {
			case 'getItems': {
				return Array.from(storage.items.entries());
			}

			case 'updateItems': {
				const items: ISerializableUpdateRequest = arg;

				if (items.insert) {
					for (const [key, value] of items.insert) {
						storage.set(key, value);
					}
				}

				items.delete?.forEach(key => storage.delete(key));

				break;
			}

			case 'optimize': {
				return storage.optimize();
			}

			case 'isUsed': {
				const path = arg.payload as string | undefined;
				if (typeof path === 'string') {
					return this.storageMainService.isUsed(path);
				}
				return false;
			}

			default:
				throw new Error(`Call not found: ${command}`);
		}
	}

	private async withStorageInitialized(profile: IUserDataProfile | undefined, workspace: IAnyWorkspaceIdentifier | undefined): Promise<IStorageMain> {
		let storage: IStorageMain;
		if (workspace) {
			storage = this.storageMainService.workspaceStorage(workspace);
		} else if (profile) {
			storage = this.storageMainService.profileStorage(profile);
		} else {
			storage = this.storageMainService.applicationStorage;
		}

		try {
			await storage.init();
		} catch (error) {
			this.logService.error(`StorageIPC#init: Unable to init ${workspace ? 'workspace' : profile ? 'profile' : 'application'} storage due to ${error}`);
		}

		return storage;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/electron-main/storageMain.ts]---
Location: vscode-main/src/vs/platform/storage/electron-main/storageMain.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { top } from '../../../base/common/arrays.js';
import { DeferredPromise } from '../../../base/common/async.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../base/common/lifecycle.js';
import { join } from '../../../base/common/path.js';
import { StopWatch } from '../../../base/common/stopwatch.js';
import { URI } from '../../../base/common/uri.js';
import { Promises } from '../../../base/node/pfs.js';
import { InMemoryStorageDatabase, IStorage, Storage, StorageHint, StorageState } from '../../../base/parts/storage/common/storage.js';
import { ISQLiteStorageDatabaseLoggingOptions, SQLiteStorageDatabase } from '../../../base/parts/storage/node/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService, LogLevel } from '../../log/common/log.js';
import { IS_NEW_KEY } from '../common/storage.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { currentSessionDateStorageKey, firstSessionDateStorageKey, lastSessionDateStorageKey } from '../../telemetry/common/telemetry.js';
import { isSingleFolderWorkspaceIdentifier, isWorkspaceIdentifier, IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { Schemas } from '../../../base/common/network.js';

export interface IStorageMainOptions {

	/**
	 * If enabled, storage will not persist to disk
	 * but into memory.
	 */
	readonly useInMemoryStorage?: boolean;
}

/**
 * Provides access to application, profile and workspace storage from
 * the electron-main side that is the owner of all storage connections.
 */
export interface IStorageMain extends IDisposable {

	/**
	 * Emitted whenever data is updated or deleted.
	 */
	readonly onDidChangeStorage: Event<IStorageChangeEvent>;

	/**
	 * Emitted when the storage is closed.
	 */
	readonly onDidCloseStorage: Event<void>;

	/**
	 * Access to all cached items of this storage service.
	 */
	readonly items: Map<string, string>;

	/**
	 * Allows to join on the `init` call having completed
	 * to be able to safely use the storage.
	 */
	readonly whenInit: Promise<void>;

	/**
	 * Provides access to the `IStorage` implementation which will be
	 * in-memory for as long as the storage has not been initialized.
	 */
	readonly storage: IStorage;

	/**
	 * The file path of the underlying storage file if any.
	 */
	readonly path: string | undefined;

	/**
	 * Required call to ensure the service can be used.
	 */
	init(): Promise<void>;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided defaultValue if the element is null or undefined.
	 */
	get(key: string, fallbackValue: string): string;
	get(key: string, fallbackValue?: string): string | undefined;

	/**
	 * Store a string value under the given key to storage. The value will
	 * be converted to a string.
	 */
	set(key: string, value: string | boolean | number | undefined | null): void;

	/**
	 * Delete an element stored under the provided key from storage.
	 */
	delete(key: string): void;

	/**
	 * Whether the storage is using in-memory persistence or not.
	 */
	isInMemory(): boolean;

	/**
	 * Attempts to reduce the DB size via optimization commands if supported.
	 */
	optimize(): Promise<void>;

	/**
	 * Close the storage connection.
	 */
	close(): Promise<void>;
}

export interface IStorageChangeEvent {
	readonly key: string;
}

abstract class BaseStorageMain extends Disposable implements IStorageMain {

	private static readonly LOG_SLOW_CLOSE_THRESHOLD = 2000;

	protected readonly _onDidChangeStorage = this._register(new Emitter<IStorageChangeEvent>());
	readonly onDidChangeStorage = this._onDidChangeStorage.event;

	private readonly _onDidCloseStorage = this._register(new Emitter<void>());
	readonly onDidCloseStorage = this._onDidCloseStorage.event;

	private _storage = this._register(new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY })); // storage is in-memory until initialized
	get storage(): IStorage { return this._storage; }

	abstract get path(): string | undefined;

	private initializePromise: Promise<void> | undefined = undefined;

	private readonly whenInitPromise = new DeferredPromise<void>();
	readonly whenInit = this.whenInitPromise.p;

	private state = StorageState.None;

	constructor(
		protected readonly logService: ILogService,
		private readonly fileService: IFileService
	) {
		super();
	}

	isInMemory(): boolean {
		return this._storage.isInMemory();
	}

	init(): Promise<void> {
		if (!this.initializePromise) {
			this.initializePromise = (async () => {
				if (this.state !== StorageState.None) {
					return; // either closed or already initialized
				}

				try {

					// Create storage via subclasses
					const storage = this._register(await this.doCreate());

					// Replace our in-memory storage with the real
					// once as soon as possible without awaiting
					// the init call.
					this._storage.dispose();
					this._storage = storage;

					// Re-emit storage changes via event
					this._register(storage.onDidChangeStorage(e => this._onDidChangeStorage.fire(e)));

					// Await storage init
					await this.doInit(storage);

					// Ensure we track whether storage is new or not
					const isNewStorage = storage.getBoolean(IS_NEW_KEY);
					if (isNewStorage === undefined) {
						storage.set(IS_NEW_KEY, true);
					} else if (isNewStorage) {
						storage.set(IS_NEW_KEY, false);
					}
				} catch (error) {
					this.logService.error(`[storage main] initialize(): Unable to init storage due to ${error}`);
				} finally {

					// Update state
					this.state = StorageState.Initialized;

					// Mark init promise as completed
					this.whenInitPromise.complete();
				}
			})();
		}

		return this.initializePromise;
	}

	protected createLoggingOptions(): ISQLiteStorageDatabaseLoggingOptions {
		return {
			logTrace: (this.logService.getLevel() === LogLevel.Trace) ? msg => this.logService.trace(msg) : undefined,
			logError: error => this.logService.error(error)
		};
	}

	protected doInit(storage: IStorage): Promise<void> {
		return storage.init();
	}

	protected abstract doCreate(): Promise<Storage>;

	get items(): Map<string, string> { return this._storage.items; }

	get(key: string, fallbackValue: string): string;
	get(key: string, fallbackValue?: string): string | undefined;
	get(key: string, fallbackValue?: string): string | undefined {
		return this._storage.get(key, fallbackValue);
	}

	set(key: string, value: string | boolean | number | undefined | null): Promise<void> {
		return this._storage.set(key, value);
	}

	delete(key: string): Promise<void> {
		return this._storage.delete(key);
	}

	optimize(): Promise<void> {
		return this._storage.optimize();
	}

	async close(): Promise<void> {

		// Measure how long it takes to close storage
		const watch = new StopWatch(false);
		await this.doClose();
		watch.stop();

		// If close() is taking a long time, there is
		// a chance that the underlying DB is large
		// either on disk or in general. In that case
		// log some additional info to further diagnose
		if (watch.elapsed() > BaseStorageMain.LOG_SLOW_CLOSE_THRESHOLD) {
			await this.logSlowClose(watch);
		}

		// Signal as event
		this._onDidCloseStorage.fire();
	}

	private async logSlowClose(watch: StopWatch) {
		if (!this.path) {
			return;
		}

		try {
			const largestEntries = top(Array.from(this._storage.items.entries())
				.map(([key, value]) => ({ key, length: value.length })), (entryA, entryB) => entryB.length - entryA.length, 5)
				.map(entry => `${entry.key}:${entry.length}`).join(', ');
			const dbSize = (await this.fileService.stat(URI.file(this.path))).size;

			this.logService.warn(`[storage main] detected slow close() operation: Time: ${watch.elapsed()}ms, DB size: ${dbSize}b, Large Keys: ${largestEntries}`);
		} catch (error) {
			this.logService.error('[storage main] figuring out stats for slow DB on close() resulted in an error', error);
		}
	}

	private async doClose(): Promise<void> {

		// Ensure we are not accidentally leaving
		// a pending initialized storage behind in
		// case `close()` was called before `init()`
		// finishes.
		if (this.initializePromise) {
			await this.initializePromise;
		}

		// Update state
		this.state = StorageState.Closed;

		// Propagate to storage lib
		await this._storage.close();
	}
}

class BaseProfileAwareStorageMain extends BaseStorageMain {

	private static readonly STORAGE_NAME = 'state.vscdb';

	get path(): string | undefined {
		if (!this.options.useInMemoryStorage) {
			return join(this.profile.globalStorageHome.with({ scheme: Schemas.file }).fsPath, BaseProfileAwareStorageMain.STORAGE_NAME);
		}

		return undefined;
	}

	constructor(
		private readonly profile: IUserDataProfile,
		private readonly options: IStorageMainOptions,
		logService: ILogService,
		fileService: IFileService
	) {
		super(logService, fileService);
	}

	protected async doCreate(): Promise<Storage> {
		return new Storage(new SQLiteStorageDatabase(this.path ?? SQLiteStorageDatabase.IN_MEMORY_PATH, {
			logging: this.createLoggingOptions()
		}), !this.path ? { hint: StorageHint.STORAGE_IN_MEMORY } : undefined);
	}
}

export class ProfileStorageMain extends BaseProfileAwareStorageMain {

}

export class ApplicationStorageMain extends BaseProfileAwareStorageMain {

	constructor(
		options: IStorageMainOptions,
		userDataProfileService: IUserDataProfilesService,
		logService: ILogService,
		fileService: IFileService
	) {
		super(userDataProfileService.defaultProfile, options, logService, fileService);
	}

	protected override async doInit(storage: IStorage): Promise<void> {
		await super.doInit(storage);

		// Apply telemetry values as part of the application storage initialization
		this.updateTelemetryState(storage);
	}

	private updateTelemetryState(storage: IStorage): void {

		// First session date (once)
		const firstSessionDate = storage.get(firstSessionDateStorageKey, undefined);
		if (firstSessionDate === undefined) {
			storage.set(firstSessionDateStorageKey, new Date().toUTCString());
		}

		// Last / current session (always)
		// previous session date was the "current" one at that time
		// current session date is "now"
		const lastSessionDate = storage.get(currentSessionDateStorageKey, undefined);
		const currentSessionDate = new Date().toUTCString();
		storage.set(lastSessionDateStorageKey, typeof lastSessionDate === 'undefined' ? null : lastSessionDate);
		storage.set(currentSessionDateStorageKey, currentSessionDate);
	}
}

export class WorkspaceStorageMain extends BaseStorageMain {

	private static readonly WORKSPACE_STORAGE_NAME = 'state.vscdb';
	private static readonly WORKSPACE_META_NAME = 'workspace.json';

	get path(): string | undefined {
		if (!this.options.useInMemoryStorage) {
			return join(this.environmentService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath, this.workspace.id, WorkspaceStorageMain.WORKSPACE_STORAGE_NAME);
		}

		return undefined;
	}

	constructor(
		private workspace: IAnyWorkspaceIdentifier,
		private readonly options: IStorageMainOptions,
		logService: ILogService,
		private readonly environmentService: IEnvironmentService,
		fileService: IFileService
	) {
		super(logService, fileService);
	}

	protected async doCreate(): Promise<Storage> {
		const { storageFilePath, wasCreated } = await this.prepareWorkspaceStorageFolder();

		return new Storage(new SQLiteStorageDatabase(storageFilePath, {
			logging: this.createLoggingOptions()
		}), { hint: this.options.useInMemoryStorage ? StorageHint.STORAGE_IN_MEMORY : wasCreated ? StorageHint.STORAGE_DOES_NOT_EXIST : undefined });
	}

	private async prepareWorkspaceStorageFolder(): Promise<{ storageFilePath: string; wasCreated: boolean }> {

		// Return early if using inMemory storage
		if (this.options.useInMemoryStorage) {
			return { storageFilePath: SQLiteStorageDatabase.IN_MEMORY_PATH, wasCreated: true };
		}

		// Otherwise, ensure the storage folder exists on disk
		const workspaceStorageFolderPath = join(this.environmentService.workspaceStorageHome.with({ scheme: Schemas.file }).fsPath, this.workspace.id);
		const workspaceStorageDatabasePath = join(workspaceStorageFolderPath, WorkspaceStorageMain.WORKSPACE_STORAGE_NAME);

		const storageExists = await Promises.exists(workspaceStorageFolderPath);
		if (storageExists) {
			return { storageFilePath: workspaceStorageDatabasePath, wasCreated: false };
		}

		// Ensure storage folder exists
		await fs.promises.mkdir(workspaceStorageFolderPath, { recursive: true });

		// Write metadata into folder (but do not await)
		this.ensureWorkspaceStorageFolderMeta(workspaceStorageFolderPath);

		return { storageFilePath: workspaceStorageDatabasePath, wasCreated: true };
	}

	private async ensureWorkspaceStorageFolderMeta(workspaceStorageFolderPath: string): Promise<void> {
		let meta: object | undefined = undefined;
		if (isSingleFolderWorkspaceIdentifier(this.workspace)) {
			meta = { folder: this.workspace.uri.toString() };
		} else if (isWorkspaceIdentifier(this.workspace)) {
			meta = { workspace: this.workspace.configPath.toString() };
		}

		if (meta) {
			try {
				const workspaceStorageMetaPath = join(workspaceStorageFolderPath, WorkspaceStorageMain.WORKSPACE_META_NAME);
				const storageExists = await Promises.exists(workspaceStorageMetaPath);
				if (!storageExists) {
					await Promises.writeFile(workspaceStorageMetaPath, JSON.stringify(meta, undefined, 2));
				}
			} catch (error) {
				this.logService.error(`[storage main] ensureWorkspaceStorageFolderMeta(): Unable to create workspace storage metadata due to ${error}`);
			}
		}
	}
}

export class InMemoryStorageMain extends BaseStorageMain {

	get path(): string | undefined {
		return undefined; // in-memory has no path
	}

	protected async doCreate(): Promise<Storage> {
		return new Storage(new InMemoryStorageDatabase(), { hint: StorageHint.STORAGE_IN_MEMORY });
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/electron-main/storageMainService.ts]---
Location: vscode-main/src/vs/platform/storage/electron-main/storageMainService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../base/common/uri.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IStorage } from '../../../base/parts/storage/common/storage.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ILifecycleMainService, LifecycleMainPhase, ShutdownReason } from '../../lifecycle/electron-main/lifecycleMainService.js';
import { ILogService } from '../../log/common/log.js';
import { AbstractStorageService, isProfileUsingDefaultStorage, IStorageService, StorageScope, StorageTarget } from '../common/storage.js';
import { ApplicationStorageMain, ProfileStorageMain, InMemoryStorageMain, IStorageMain, IStorageMainOptions, WorkspaceStorageMain, IStorageChangeEvent } from './storageMain.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesMainService } from '../../userDataProfile/electron-main/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../workspace/common/workspace.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { Schemas } from '../../../base/common/network.js';

//#region Storage Main Service (intent: make application, profile and workspace storage accessible to windows from main process)

export const IStorageMainService = createDecorator<IStorageMainService>('storageMainService');

export interface IProfileStorageChangeEvent extends IStorageChangeEvent {
	readonly storage: IStorageMain;
	readonly profile: IUserDataProfile;
}

export interface IStorageMainService {

	readonly _serviceBrand: undefined;

	/**
	 * Provides access to the application storage shared across all
	 * windows and all profiles.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       Rather use `IApplicationStorageMainService` for that purpose.
	 */
	readonly applicationStorage: IStorageMain;

	/**
	 * Emitted whenever data is updated or deleted in profile scoped storage.
	 */
	readonly onDidChangeProfileStorage: Event<IProfileStorageChangeEvent>;

	/**
	 * Provides access to the profile storage shared across all windows
	 * for the provided profile.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       This is currently not supported.
	 */
	profileStorage(profile: IUserDataProfile): IStorageMain;

	/**
	 * Provides access to the workspace storage specific to a single window.
	 *
	 * Note: DO NOT use this for reading/writing from the main process!
	 *       This is currently not supported.
	 */
	workspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain;

	/**
	 * Checks if the provided path is currently in use for a storage database.
	 *
	 * @param path the path to the storage file or parent folder
	 */
	isUsed(path: string): boolean;
}

export class StorageMainService extends Disposable implements IStorageMainService {

	declare readonly _serviceBrand: undefined;

	private shutdownReason: ShutdownReason | undefined = undefined;

	private readonly _onDidChangeProfileStorage = this._register(new Emitter<IProfileStorageChangeEvent>());
	readonly onDidChangeProfileStorage = this._onDidChangeProfileStorage.event;

	constructor(
		@ILogService private readonly logService: ILogService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IUserDataProfilesMainService private readonly userDataProfilesService: IUserDataProfilesMainService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		this.applicationStorage = this._register(this.createApplicationStorage());

		this.registerListeners();
	}

	protected getStorageOptions(): IStorageMainOptions {
		return {
			useInMemoryStorage: !!this.environmentService.extensionTestsLocationURI // no storage during extension tests!
		};
	}

	private registerListeners(): void {

		// Application Storage: Warmup when any window opens
		(async () => {
			await this.lifecycleMainService.when(LifecycleMainPhase.AfterWindowOpen);

			this.applicationStorage.init();
		})();

		this._register(this.lifecycleMainService.onWillLoadWindow(e => {

			// Profile Storage: Warmup when related window with profile loads
			if (e.window.profile) {
				this.profileStorage(e.window.profile).init();
			}

			// Workspace Storage: Warmup when related window with workspace loads
			if (e.workspace) {
				this.workspaceStorage(e.workspace).init();
			}
		}));

		// All Storage: Close when shutting down
		this._register(this.lifecycleMainService.onWillShutdown(e => {
			this.logService.trace('storageMainService#onWillShutdown()');

			// Remember shutdown reason
			this.shutdownReason = e.reason;

			// Application Storage
			e.join('applicationStorage', this.applicationStorage.close());

			// Profile Storage(s)
			for (const [, profileStorage] of this.mapProfileToStorage) {
				e.join('profileStorage', profileStorage.close());
			}

			// Workspace Storage(s)
			for (const [, workspaceStorage] of this.mapWorkspaceToStorage) {
				e.join('workspaceStorage', workspaceStorage.close());
			}
		}));

		// Prepare storage location as needed
		this._register(this.userDataProfilesService.onWillCreateProfile(e => {
			e.join((async () => {
				if (!(await this.fileService.exists(e.profile.globalStorageHome))) {
					await this.fileService.createFolder(e.profile.globalStorageHome);
				}
			})());
		}));

		// Close the storage of the profile that is being removed
		this._register(this.userDataProfilesService.onWillRemoveProfile(e => {
			const storage = this.mapProfileToStorage.get(e.profile.id);
			if (storage) {
				e.join(storage.close());
			}
		}));
	}

	//#region Application Storage

	readonly applicationStorage: IStorageMain;

	private createApplicationStorage(): IStorageMain {
		this.logService.trace(`StorageMainService: creating application storage`);

		const applicationStorage = new ApplicationStorageMain(this.getStorageOptions(), this.userDataProfilesService, this.logService, this.fileService);

		this._register(Event.once(applicationStorage.onDidCloseStorage)(() => {
			this.logService.trace(`StorageMainService: closed application storage`);
		}));

		return applicationStorage;
	}

	//#endregion

	//#region Profile Storage

	private readonly mapProfileToStorage = new Map<string /* profile ID */, IStorageMain>();

	profileStorage(profile: IUserDataProfile): IStorageMain {
		if (isProfileUsingDefaultStorage(profile)) {
			return this.applicationStorage; // for profiles using default storage, use application storage
		}

		let profileStorage = this.mapProfileToStorage.get(profile.id);
		if (!profileStorage) {
			this.logService.trace(`StorageMainService: creating profile storage (${profile.name})`);

			profileStorage = this._register(this.createProfileStorage(profile));
			this.mapProfileToStorage.set(profile.id, profileStorage);

			const listener = this._register(profileStorage.onDidChangeStorage(e => this._onDidChangeProfileStorage.fire({
				...e,
				storage: profileStorage!,
				profile
			})));

			this._register(Event.once(profileStorage.onDidCloseStorage)(() => {
				this.logService.trace(`StorageMainService: closed profile storage (${profile.name})`);

				this.mapProfileToStorage.delete(profile.id);
				listener.dispose();
			}));
		}

		return profileStorage;
	}

	private createProfileStorage(profile: IUserDataProfile): IStorageMain {
		if (this.shutdownReason === ShutdownReason.KILL) {

			// Workaround for native crashes that we see when
			// SQLite DBs are being created even after shutdown
			// https://github.com/microsoft/vscode/issues/143186

			return new InMemoryStorageMain(this.logService, this.fileService);
		}

		return new ProfileStorageMain(profile, this.getStorageOptions(), this.logService, this.fileService);
	}

	//#endregion


	//#region Workspace Storage

	private readonly mapWorkspaceToStorage = new Map<string /* workspace ID */, IStorageMain>();

	workspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain {
		let workspaceStorage = this.mapWorkspaceToStorage.get(workspace.id);
		if (!workspaceStorage) {
			this.logService.trace(`StorageMainService: creating workspace storage (${workspace.id})`);

			workspaceStorage = this._register(this.createWorkspaceStorage(workspace));
			this.mapWorkspaceToStorage.set(workspace.id, workspaceStorage);

			this._register(Event.once(workspaceStorage.onDidCloseStorage)(() => {
				this.logService.trace(`StorageMainService: closed workspace storage (${workspace.id})`);

				this.mapWorkspaceToStorage.delete(workspace.id);
			}));
		}

		return workspaceStorage;
	}

	private createWorkspaceStorage(workspace: IAnyWorkspaceIdentifier): IStorageMain {
		if (this.shutdownReason === ShutdownReason.KILL) {

			// Workaround for native crashes that we see when
			// SQLite DBs are being created even after shutdown
			// https://github.com/microsoft/vscode/issues/143186

			return new InMemoryStorageMain(this.logService, this.fileService);
		}

		return new WorkspaceStorageMain(workspace, this.getStorageOptions(), this.logService, this.environmentService, this.fileService);
	}

	//#endregion

	isUsed(path: string): boolean {
		const pathUri = URI.file(path);

		for (const storage of [this.applicationStorage, ...this.mapProfileToStorage.values(), ...this.mapWorkspaceToStorage.values()]) {
			if (!storage.path) {
				continue;
			}

			if (this.uriIdentityService.extUri.isEqualOrParent(URI.file(storage.path), pathUri)) {
				return true;
			}
		}

		return false;
	}
}

//#endregion


//#region Application Main Storage Service (intent: use application storage from main process)

export const IApplicationStorageMainService = createDecorator<IStorageMainService>('applicationStorageMainService');

/**
 * A specialized `IStorageService` interface that only allows
 * access to the `StorageScope.APPLICATION` scope.
 */
export interface IApplicationStorageMainService extends IStorageService {

	/**
	 * Important: unlike other storage services in the renderer, the
	 * main process does not await the storage to be ready, rather
	 * storage is being initialized while a window opens to reduce
	 * pressure on startup.
	 *
	 * As such, any client wanting to access application storage from the
	 * main process needs to wait for `whenReady`, otherwise there is
	 * a chance that the service operates on an in-memory store that
	 * is not backed by any persistent DB.
	 */
	readonly whenReady: Promise<void>;

	get(key: string, scope: StorageScope.APPLICATION, fallbackValue: string): string;
	get(key: string, scope: StorageScope.APPLICATION, fallbackValue?: string): string | undefined;

	getBoolean(key: string, scope: StorageScope.APPLICATION, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope.APPLICATION, fallbackValue?: boolean): boolean | undefined;

	getNumber(key: string, scope: StorageScope.APPLICATION, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope.APPLICATION, fallbackValue?: number): number | undefined;

	store(key: string, value: string | boolean | number | undefined | null, scope: StorageScope.APPLICATION, target: StorageTarget): void;

	remove(key: string, scope: StorageScope.APPLICATION): void;

	keys(scope: StorageScope.APPLICATION, target: StorageTarget): string[];

	switch(): never;

	isNew(scope: StorageScope.APPLICATION): boolean;
}

export class ApplicationStorageMainService extends AbstractStorageService implements IApplicationStorageMainService {

	declare readonly _serviceBrand: undefined;

	readonly whenReady: Promise<void>;

	constructor(
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IStorageMainService private readonly storageMainService: IStorageMainService
	) {
		super();

		this.whenReady = this.storageMainService.applicationStorage.whenInit;
	}

	protected doInitialize(): Promise<void> {

		// application storage is being initialized as part
		// of the first window opening, so we do not trigger
		// it here but can join it
		return this.storageMainService.applicationStorage.whenInit;
	}

	protected getStorage(scope: StorageScope): IStorage | undefined {
		if (scope === StorageScope.APPLICATION) {
			return this.storageMainService.applicationStorage.storage;
		}

		return undefined; // any other scope is unsupported from main process
	}

	protected getLogDetails(scope: StorageScope): string | undefined {
		if (scope === StorageScope.APPLICATION) {
			return this.userDataProfilesService.defaultProfile.globalStorageHome.with({ scheme: Schemas.file }).fsPath;
		}

		return undefined; // any other scope is unsupported from main process
	}

	protected override shouldFlushWhenIdle(): boolean {
		return false; // not needed here, will be triggered from any window that is opened
	}

	override switch(): never {
		throw new Error('Migrating storage is unsupported from main process');
	}

	protected switchToProfile(): never {
		throw new Error('Switching storage profile is unsupported from main process');
	}

	protected switchToWorkspace(): never {
		throw new Error('Switching storage workspace is unsupported from main process');
	}

	hasScope(): never {
		throw new Error('Main process is never profile or workspace scoped');
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/test/common/storageService.test.ts]---
Location: vscode-main/src/vs/platform/storage/test/common/storageService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { deepStrictEqual, ok, strictEqual } from 'assert';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { InMemoryStorageService, IStorageService, IStorageTargetChangeEvent, IStorageValueChangeEvent, StorageScope, StorageTarget } from '../../common/storage.js';

export function createSuite<T extends IStorageService>(params: { setup: () => Promise<T>; teardown: (service: T) => Promise<void> }): void {

	let storageService: T;

	const disposables = new DisposableStore();

	setup(async () => {
		storageService = await params.setup();
	});

	teardown(() => {
		disposables.clear();
		return params.teardown(storageService);
	});

	test('Get Data, Integer, Boolean (application)', () => {
		storeData(StorageScope.APPLICATION);
	});

	test('Get Data, Integer, Boolean (profile)', () => {
		storeData(StorageScope.PROFILE);
	});

	test('Get Data, Integer, Boolean, Object (workspace)', () => {
		storeData(StorageScope.WORKSPACE);
	});

	test('Storage change source', () => {
		const storageValueChangeEvents: IStorageValueChangeEvent[] = [];
		storageService.onDidChangeValue(StorageScope.WORKSPACE, undefined, disposables)(e => storageValueChangeEvents.push(e), undefined, disposables);

		// Explicit external source
		storageService.storeAll([{ key: 'testExternalChange', value: 'foobar', scope: StorageScope.WORKSPACE, target: StorageTarget.MACHINE }], true);
		let storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'testExternalChange');
		strictEqual(storageValueChangeEvent?.external, true);

		// Default source
		storageService.storeAll([{ key: 'testChange', value: 'barfoo', scope: StorageScope.WORKSPACE, target: StorageTarget.MACHINE }], false);
		storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'testChange');
		strictEqual(storageValueChangeEvent?.external, false);

		storageService.store('testChange', 'foobar', StorageScope.WORKSPACE, StorageTarget.MACHINE);
		storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'testChange');
		strictEqual(storageValueChangeEvent?.external, false);
	});

	test('Storage change event scope (all keys)', () => {
		const storageValueChangeEvents: IStorageValueChangeEvent[] = [];
		storageService.onDidChangeValue(StorageScope.WORKSPACE, undefined, disposables)(e => storageValueChangeEvents.push(e), undefined, disposables);

		storageService.store('testChange', 'foobar', StorageScope.WORKSPACE, StorageTarget.MACHINE);
		storageService.store('testChange2', 'foobar', StorageScope.WORKSPACE, StorageTarget.MACHINE);
		storageService.store('testChange', 'foobar', StorageScope.APPLICATION, StorageTarget.MACHINE);
		storageService.store('testChange', 'foobar', StorageScope.PROFILE, StorageTarget.MACHINE);
		storageService.store('testChange2', 'foobar', StorageScope.PROFILE, StorageTarget.MACHINE);
		strictEqual(storageValueChangeEvents.length, 2);
	});

	test('Storage change event scope (specific key)', () => {
		const storageValueChangeEvents: IStorageValueChangeEvent[] = [];
		storageService.onDidChangeValue(StorageScope.WORKSPACE, 'testChange', disposables)(e => storageValueChangeEvents.push(e), undefined, disposables);

		storageService.store('testChange', 'foobar', StorageScope.WORKSPACE, StorageTarget.MACHINE);
		storageService.store('testChange', 'foobar', StorageScope.PROFILE, StorageTarget.USER);
		storageService.store('testChange', 'foobar', StorageScope.APPLICATION, StorageTarget.MACHINE);
		storageService.store('testChange2', 'foobar', StorageScope.WORKSPACE, StorageTarget.MACHINE);
		const storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'testChange');
		ok(storageValueChangeEvent);
		strictEqual(storageValueChangeEvents.length, 1);
	});

	function storeData(scope: StorageScope): void {
		let storageValueChangeEvents: IStorageValueChangeEvent[] = [];
		storageService.onDidChangeValue(scope, undefined, disposables)(e => storageValueChangeEvents.push(e), undefined, disposables);

		strictEqual(storageService.get('test.get', scope, 'foobar'), 'foobar');
		strictEqual(storageService.get('test.get', scope, ''), '');
		strictEqual(storageService.getNumber('test.getNumber', scope, 5), 5);
		strictEqual(storageService.getNumber('test.getNumber', scope, 0), 0);
		strictEqual(storageService.getBoolean('test.getBoolean', scope, true), true);
		strictEqual(storageService.getBoolean('test.getBoolean', scope, false), false);
		deepStrictEqual(storageService.getObject('test.getObject', scope, { 'foo': 'bar' }), { 'foo': 'bar' });
		deepStrictEqual(storageService.getObject('test.getObject', scope, {}), {});
		deepStrictEqual(storageService.getObject('test.getObject', scope, []), []);

		storageService.store('test.get', 'foobar', scope, StorageTarget.MACHINE);
		strictEqual(storageService.get('test.get', scope, (undefined)!), 'foobar');
		let storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'test.get');
		strictEqual(storageValueChangeEvent?.scope, scope);
		strictEqual(storageValueChangeEvent?.key, 'test.get');
		storageValueChangeEvents = [];

		storageService.store('test.get', '', scope, StorageTarget.MACHINE);
		strictEqual(storageService.get('test.get', scope, (undefined)!), '');
		storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'test.get');
		strictEqual(storageValueChangeEvent!.scope, scope);
		strictEqual(storageValueChangeEvent!.key, 'test.get');

		storageService.store('test.getNumber', 5, scope, StorageTarget.MACHINE);
		strictEqual(storageService.getNumber('test.getNumber', scope, (undefined)!), 5);

		storageService.store('test.getNumber', 0, scope, StorageTarget.MACHINE);
		strictEqual(storageService.getNumber('test.getNumber', scope, (undefined)!), 0);

		storageService.store('test.getBoolean', true, scope, StorageTarget.MACHINE);
		strictEqual(storageService.getBoolean('test.getBoolean', scope, (undefined)!), true);

		storageService.store('test.getBoolean', false, scope, StorageTarget.MACHINE);
		strictEqual(storageService.getBoolean('test.getBoolean', scope, (undefined)!), false);

		storageService.store('test.getObject', {}, scope, StorageTarget.MACHINE);
		deepStrictEqual(storageService.getObject('test.getObject', scope, (undefined)!), {});

		storageService.store('test.getObject', [42], scope, StorageTarget.MACHINE);
		deepStrictEqual(storageService.getObject('test.getObject', scope, (undefined)!), [42]);

		storageService.store('test.getObject', { 'foo': {} }, scope, StorageTarget.MACHINE);
		deepStrictEqual(storageService.getObject('test.getObject', scope, (undefined)!), { 'foo': {} });

		strictEqual(storageService.get('test.getDefault', scope, 'getDefault'), 'getDefault');
		strictEqual(storageService.getNumber('test.getNumberDefault', scope, 5), 5);
		strictEqual(storageService.getBoolean('test.getBooleanDefault', scope, true), true);
		deepStrictEqual(storageService.getObject('test.getObjectDefault', scope, { 'foo': 42 }), { 'foo': 42 });

		storageService.storeAll([
			{ key: 'test.storeAll1', value: 'foobar', scope, target: StorageTarget.MACHINE },
			{ key: 'test.storeAll2', value: 4, scope, target: StorageTarget.MACHINE },
			{ key: 'test.storeAll3', value: null, scope, target: StorageTarget.MACHINE }
		], false);

		strictEqual(storageService.get('test.storeAll1', scope, 'foobar'), 'foobar');
		strictEqual(storageService.get('test.storeAll2', scope, '4'), '4');
		strictEqual(storageService.get('test.storeAll3', scope, 'null'), 'null');
	}

	test('Remove Data (application)', () => {
		removeData(StorageScope.APPLICATION);
	});

	test('Remove Data (profile)', () => {
		removeData(StorageScope.PROFILE);
	});

	test('Remove Data (workspace)', () => {
		removeData(StorageScope.WORKSPACE);
	});

	function removeData(scope: StorageScope): void {
		const storageValueChangeEvents: IStorageValueChangeEvent[] = [];
		storageService.onDidChangeValue(scope, undefined, disposables)(e => storageValueChangeEvents.push(e), undefined, disposables);

		storageService.store('test.remove', 'foobar', scope, StorageTarget.MACHINE);
		strictEqual('foobar', storageService.get('test.remove', scope, (undefined)!));

		storageService.remove('test.remove', scope);
		ok(!storageService.get('test.remove', scope, (undefined)!));
		const storageValueChangeEvent = storageValueChangeEvents.find(e => e.key === 'test.remove');
		strictEqual(storageValueChangeEvent?.scope, scope);
		strictEqual(storageValueChangeEvent?.key, 'test.remove');
	}

	test('Keys (in-memory)', () => {
		let storageTargetEvent: IStorageTargetChangeEvent | undefined = undefined;
		storageService.onDidChangeTarget(e => storageTargetEvent = e, undefined, disposables);

		// Empty
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				strictEqual(storageService.keys(scope, target).length, 0);
			}
		}

		let storageValueChangeEvent: IStorageValueChangeEvent | undefined = undefined;

		// Add values
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			storageService.onDidChangeValue(scope, undefined, disposables)(e => storageValueChangeEvent = e, undefined, disposables);

			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				storageTargetEvent = Object.create(null);
				storageValueChangeEvent = Object.create(null);

				storageService.store('test.target1', 'value1', scope, target);
				strictEqual(storageService.keys(scope, target).length, 1);
				strictEqual(storageTargetEvent?.scope, scope);
				strictEqual(storageValueChangeEvent?.key, 'test.target1');
				strictEqual(storageValueChangeEvent?.scope, scope);
				strictEqual(storageValueChangeEvent?.target, target);

				storageTargetEvent = undefined;
				storageValueChangeEvent = Object.create(null);

				storageService.store('test.target1', 'otherValue1', scope, target);
				strictEqual(storageService.keys(scope, target).length, 1);
				strictEqual(storageTargetEvent, undefined);
				strictEqual(storageValueChangeEvent?.key, 'test.target1');
				strictEqual(storageValueChangeEvent?.scope, scope);
				strictEqual(storageValueChangeEvent?.target, target);

				storageService.store('test.target2', 'value2', scope, target);
				storageService.store('test.target3', 'value3', scope, target);

				strictEqual(storageService.keys(scope, target).length, 3);
			}
		}

		// Remove values
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				const keysLength = storageService.keys(scope, target).length;

				storageService.store('test.target4', 'value1', scope, target);
				strictEqual(storageService.keys(scope, target).length, keysLength + 1);

				storageTargetEvent = Object.create(null);
				storageValueChangeEvent = Object.create(null);

				storageService.remove('test.target4', scope);
				strictEqual(storageService.keys(scope, target).length, keysLength);
				strictEqual(storageTargetEvent?.scope, scope);
				strictEqual(storageValueChangeEvent?.key, 'test.target4');
				strictEqual(storageValueChangeEvent?.scope, scope);
			}
		}

		// Remove all
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				const keys = storageService.keys(scope, target);

				for (const key of keys) {
					storageService.remove(key, scope);
				}

				strictEqual(storageService.keys(scope, target).length, 0);
			}
		}

		// Adding undefined or null removes value
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				storageService.store('test.target1', 'value1', scope, target);
				strictEqual(storageService.keys(scope, target).length, 1);

				storageTargetEvent = Object.create(null);

				storageService.store('test.target1', undefined, scope, target);
				strictEqual(storageService.keys(scope, target).length, 0);
				strictEqual(storageTargetEvent?.scope, scope);

				storageService.store('test.target1', '', scope, target);
				strictEqual(storageService.keys(scope, target).length, 1);

				storageService.store('test.target1', null, scope, target);
				strictEqual(storageService.keys(scope, target).length, 0);
			}
		}

		// Target change
		for (const scope of [StorageScope.WORKSPACE, StorageScope.PROFILE, StorageScope.APPLICATION]) {
			storageTargetEvent = undefined;
			storageService.store('test.target5', 'value1', scope, StorageTarget.MACHINE);
			ok(storageTargetEvent);
			storageTargetEvent = undefined;
			storageService.store('test.target5', 'value1', scope, StorageTarget.USER);
			ok(storageTargetEvent);
			storageTargetEvent = undefined;
			storageService.store('test.target5', 'value1', scope, StorageTarget.MACHINE);
			ok(storageTargetEvent);
			storageTargetEvent = undefined;
			storageService.store('test.target5', 'value1', scope, StorageTarget.MACHINE);
			ok(!storageTargetEvent); // no change in target
		}
	});
}

suite('StorageService (in-memory)', function () {

	const disposables = new DisposableStore();

	teardown(() => {
		disposables.clear();
	});

	createSuite<InMemoryStorageService>({
		setup: async () => disposables.add(new InMemoryStorageService()),
		teardown: async () => { }
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/storage/test/electron-main/storageMainService.test.ts]---
Location: vscode-main/src/vs/platform/storage/test/electron-main/storageMainService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { notStrictEqual, strictEqual } from 'assert';
import { Schemas } from '../../../../base/common/network.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { OPTIONS, parseArgs } from '../../../environment/node/argv.js';
import { NativeEnvironmentService } from '../../../environment/node/environmentService.js';
import { FileService } from '../../../files/common/fileService.js';
import { ILifecycleMainService } from '../../../lifecycle/electron-main/lifecycleMainService.js';
import { NullLogService } from '../../../log/common/log.js';
import product from '../../../product/common/product.js';
import { IProductService } from '../../../product/common/productService.js';
import { SaveStrategy, StateService } from '../../../state/node/stateService.js';
import { IS_NEW_KEY, StorageScope } from '../../common/storage.js';
import { IStorageChangeEvent, IStorageMain, IStorageMainOptions } from '../../electron-main/storageMain.js';
import { StorageMainService } from '../../electron-main/storageMainService.js';
import { currentSessionDateStorageKey, firstSessionDateStorageKey } from '../../../telemetry/common/telemetry.js';
import { UriIdentityService } from '../../../uriIdentity/common/uriIdentityService.js';
import { IUserDataProfile } from '../../../userDataProfile/common/userDataProfile.js';
import { UserDataProfilesMainService } from '../../../userDataProfile/electron-main/userDataProfile.js';
import { TestLifecycleMainService } from '../../../test/electron-main/workbenchTestServices.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

suite('StorageMainService', function () {

	const disposables = new DisposableStore();

	const productService: IProductService = { _serviceBrand: undefined, ...product };

	const inMemoryProfileRoot = URI.file('/location').with({ scheme: Schemas.inMemory });
	const inMemoryProfile: IUserDataProfile = {
		id: 'id',
		name: 'inMemory',
		isDefault: false,
		location: inMemoryProfileRoot,
		globalStorageHome: joinPath(inMemoryProfileRoot, 'globalStorageHome'),
		settingsResource: joinPath(inMemoryProfileRoot, 'settingsResource'),
		keybindingsResource: joinPath(inMemoryProfileRoot, 'keybindingsResource'),
		tasksResource: joinPath(inMemoryProfileRoot, 'tasksResource'),
		mcpResource: joinPath(inMemoryProfileRoot, 'mcp.json'),
		snippetsHome: joinPath(inMemoryProfileRoot, 'snippetsHome'),
		promptsHome: joinPath(inMemoryProfileRoot, 'promptsHome'),
		extensionsResource: joinPath(inMemoryProfileRoot, 'extensionsResource'),
		cacheHome: joinPath(inMemoryProfileRoot, 'cache'),
	};

	class TestStorageMainService extends StorageMainService {

		protected override getStorageOptions(): IStorageMainOptions {
			return {
				useInMemoryStorage: true
			};
		}
	}

	async function testStorage(storage: IStorageMain, scope: StorageScope): Promise<void> {
		strictEqual(storage.isInMemory(), true);

		// Telemetry: added after init unless workspace/profile scoped
		if (scope === StorageScope.APPLICATION) {
			strictEqual(storage.items.size, 0);
			await storage.init();
			strictEqual(typeof storage.get(firstSessionDateStorageKey), 'string');
			strictEqual(typeof storage.get(currentSessionDateStorageKey), 'string');
		} else {
			await storage.init();
		}

		let storageChangeEvent: IStorageChangeEvent | undefined = undefined;
		disposables.add(storage.onDidChangeStorage(e => {
			storageChangeEvent = e;
		}));

		let storageDidClose = false;
		disposables.add(storage.onDidCloseStorage(() => storageDidClose = true));

		// Basic store/get/remove
		const size = storage.items.size;

		storage.set('bar', 'foo');
		strictEqual(storageChangeEvent!.key, 'bar');
		storage.set('barNumber', 55);
		storage.set('barBoolean', true);

		strictEqual(storage.get('bar'), 'foo');
		strictEqual(storage.get('barNumber'), '55');
		strictEqual(storage.get('barBoolean'), 'true');

		strictEqual(storage.items.size, size + 3);

		storage.delete('bar');
		strictEqual(storage.get('bar'), undefined);

		strictEqual(storage.items.size, size + 2);

		// IS_NEW
		strictEqual(storage.get(IS_NEW_KEY), 'true');

		// Close
		await storage.close();

		strictEqual(storageDidClose, true);
	}

	teardown(() => {
		disposables.clear();
	});

	function createStorageService(lifecycleMainService: ILifecycleMainService = new TestLifecycleMainService()): TestStorageMainService {
		const environmentService = new NativeEnvironmentService(parseArgs(process.argv, OPTIONS), productService);
		const fileService = disposables.add(new FileService(new NullLogService()));
		const uriIdentityService = disposables.add(new UriIdentityService(fileService));
		const testStorageService = disposables.add(new TestStorageMainService(new NullLogService(), environmentService, disposables.add(new UserDataProfilesMainService(disposables.add(new StateService(SaveStrategy.DELAYED, environmentService, new NullLogService(), fileService)), disposables.add(uriIdentityService), environmentService, fileService, new NullLogService())), lifecycleMainService, fileService, uriIdentityService));

		disposables.add(testStorageService.applicationStorage);

		return testStorageService;
	}

	test('basics (application)', function () {
		const storageMainService = createStorageService();

		return testStorage(storageMainService.applicationStorage, StorageScope.APPLICATION);
	});

	test('basics (profile)', function () {
		const storageMainService = createStorageService();
		const profile = inMemoryProfile;

		return testStorage(storageMainService.profileStorage(profile), StorageScope.PROFILE);
	});

	test('basics (workspace)', function () {
		const workspace = { id: generateUuid() };
		const storageMainService = createStorageService();

		return testStorage(storageMainService.workspaceStorage(workspace), StorageScope.WORKSPACE);
	});

	test('storage closed onWillShutdown', async function () {
		const lifecycleMainService = new TestLifecycleMainService();
		const storageMainService = createStorageService(lifecycleMainService);

		const profile = inMemoryProfile;
		const workspace = { id: generateUuid() };

		const workspaceStorage = storageMainService.workspaceStorage(workspace);
		let didCloseWorkspaceStorage = false;
		disposables.add(workspaceStorage.onDidCloseStorage(() => {
			didCloseWorkspaceStorage = true;
		}));

		const profileStorage = storageMainService.profileStorage(profile);
		let didCloseProfileStorage = false;
		disposables.add(profileStorage.onDidCloseStorage(() => {
			didCloseProfileStorage = true;
		}));

		const applicationStorage = storageMainService.applicationStorage;
		let didCloseApplicationStorage = false;
		disposables.add(applicationStorage.onDidCloseStorage(() => {
			didCloseApplicationStorage = true;
		}));

		strictEqual(applicationStorage, storageMainService.applicationStorage); // same instance as long as not closed
		strictEqual(profileStorage, storageMainService.profileStorage(profile)); // same instance as long as not closed
		strictEqual(workspaceStorage, storageMainService.workspaceStorage(workspace)); // same instance as long as not closed

		await applicationStorage.init();
		await profileStorage.init();
		await workspaceStorage.init();

		await lifecycleMainService.fireOnWillShutdown();

		strictEqual(didCloseApplicationStorage, true);
		strictEqual(didCloseProfileStorage, true);
		strictEqual(didCloseWorkspaceStorage, true);

		const profileStorage2 = storageMainService.profileStorage(profile);
		notStrictEqual(profileStorage, profileStorage2);

		const workspaceStorage2 = storageMainService.workspaceStorage(workspace);
		notStrictEqual(workspaceStorage, workspaceStorage2);

		await workspaceStorage2.close();
	});

	test('storage closed before init works', async function () {
		const storageMainService = createStorageService();
		const profile = inMemoryProfile;
		const workspace = { id: generateUuid() };

		const workspaceStorage = storageMainService.workspaceStorage(workspace);
		let didCloseWorkspaceStorage = false;
		disposables.add(workspaceStorage.onDidCloseStorage(() => {
			didCloseWorkspaceStorage = true;
		}));

		const profileStorage = storageMainService.profileStorage(profile);
		let didCloseProfileStorage = false;
		disposables.add(profileStorage.onDidCloseStorage(() => {
			didCloseProfileStorage = true;
		}));

		const applicationStorage = storageMainService.applicationStorage;
		let didCloseApplicationStorage = false;
		disposables.add(applicationStorage.onDidCloseStorage(() => {
			didCloseApplicationStorage = true;
		}));

		await applicationStorage.close();
		await profileStorage.close();
		await workspaceStorage.close();

		strictEqual(didCloseApplicationStorage, true);
		strictEqual(didCloseProfileStorage, true);
		strictEqual(didCloseWorkspaceStorage, true);
	});

	test('storage closed before init awaits works', async function () {
		const storageMainService = createStorageService();
		const profile = inMemoryProfile;
		const workspace = { id: generateUuid() };

		const workspaceStorage = storageMainService.workspaceStorage(workspace);
		let didCloseWorkspaceStorage = false;
		disposables.add(workspaceStorage.onDidCloseStorage(() => {
			didCloseWorkspaceStorage = true;
		}));

		const profileStorage = storageMainService.profileStorage(profile);
		let didCloseProfileStorage = false;
		disposables.add(profileStorage.onDidCloseStorage(() => {
			didCloseProfileStorage = true;
		}));

		const applicationtorage = storageMainService.applicationStorage;
		let didCloseApplicationStorage = false;
		disposables.add(applicationtorage.onDidCloseStorage(() => {
			didCloseApplicationStorage = true;
		}));

		applicationtorage.init();
		profileStorage.init();
		workspaceStorage.init();

		await applicationtorage.close();
		await profileStorage.close();
		await workspaceStorage.close();

		strictEqual(didCloseApplicationStorage, true);
		strictEqual(didCloseProfileStorage, true);
		strictEqual(didCloseWorkspaceStorage, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/browser/1dsAppender.ts]---
Location: vscode-main/src/vs/platform/telemetry/browser/1dsAppender.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractOneDataSystemAppender, IAppInsightsCore } from '../common/1dsAppender.js';


export class OneDataSystemWebAppender extends AbstractOneDataSystemAppender {
	constructor(
		isInternalTelemetry: boolean,
		eventPrefix: string,
		defaultData: { [key: string]: unknown } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
	) {
		super(isInternalTelemetry, eventPrefix, defaultData, iKeyOrClientFactory);

		// If we cannot fetch the endpoint it means it is down and we should not send any telemetry.
		// This is most likely due to ad blockers
		fetch(this.endPointHealthUrl, { method: 'GET' }).catch(err => {
			this._aiCoreOrKey = undefined;
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/browser/errorTelemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/browser/errorTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mainWindow } from '../../../base/browser/window.js';
import { ErrorNoTelemetry } from '../../../base/common/errors.js';
import { toDisposable } from '../../../base/common/lifecycle.js';
import BaseErrorTelemetry, { ErrorEvent } from '../common/errorTelemetry.js';

export default class ErrorTelemetry extends BaseErrorTelemetry {
	protected override installErrorListeners(): void {
		let oldOnError: OnErrorEventHandler;
		const that = this;
		if (typeof mainWindow.onerror === 'function') {
			oldOnError = mainWindow.onerror;
		}
		mainWindow.onerror = function (message: Event | string, filename?: string, line?: number, column?: number, error?: Error) {
			that._onUncaughtError(message as string, filename as string, line as number, column, error);
			oldOnError?.apply(this, [message, filename, line, column, error]);
		};
		this._disposables.add(toDisposable(() => {
			if (oldOnError) {
				mainWindow.onerror = oldOnError;
			}
		}));
	}

	private _onUncaughtError(msg: string, file: string, line: number, column?: number, err?: any): void {
		const data: ErrorEvent = {
			callstack: msg,
			msg,
			file,
			line,
			column
		};

		if (err) {
			// If it's the no telemetry error it doesn't get logged
			if (ErrorNoTelemetry.isErrorNoTelemetry(err)) {
				return;
			}

			const { name, message, stack } = err;
			data.uncaught_error_name = name;
			if (message) {
				data.uncaught_error_msg = message;
			}
			if (stack) {
				data.callstack = Array.isArray(err.stack)
					? err.stack = err.stack.join('\n')
					: err.stack;
			}
		}

		this._enqueue(data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/1dsAppender.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/1dsAppender.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IExtendedConfiguration, IExtendedTelemetryItem, ITelemetryItem, ITelemetryUnloadState } from '@microsoft/1ds-core-js';
import type { IChannelConfiguration, IXHROverride, PostChannel } from '@microsoft/1ds-post-js';
import { importAMDNodeModule } from '../../../amdX.js';
import { onUnexpectedError } from '../../../base/common/errors.js';
import { mixin } from '../../../base/common/objects.js';
import { isWeb } from '../../../base/common/platform.js';
import { ITelemetryAppender, validateTelemetryData } from './telemetryUtils.js';

// Interface type which is a subset of @microsoft/1ds-core-js AppInsightsCore.
// Allows us to more easily build mock objects for testing as the interface is quite large and we only need a few properties.
export interface IAppInsightsCore {
	pluginVersionString: string;
	track(item: ITelemetryItem | IExtendedTelemetryItem): void;
	unload(isAsync: boolean, unloadComplete: (unloadState: ITelemetryUnloadState) => void): void;
}

const endpointUrl = 'https://mobile.events.data.microsoft.com/OneCollector/1.0';
const endpointHealthUrl = 'https://mobile.events.data.microsoft.com/ping';

async function getClient(instrumentationKey: string, addInternalFlag?: boolean, xhrOverride?: IXHROverride): Promise<IAppInsightsCore> {
	// eslint-disable-next-line local/code-amd-node-module
	const oneDs = isWeb ? await importAMDNodeModule<typeof import('@microsoft/1ds-core-js')>('@microsoft/1ds-core-js', 'bundle/ms.core.min.js') : await import('@microsoft/1ds-core-js');
	// eslint-disable-next-line local/code-amd-node-module
	const postPlugin = isWeb ? await importAMDNodeModule<typeof import('@microsoft/1ds-post-js')>('@microsoft/1ds-post-js', 'bundle/ms.post.min.js') : await import('@microsoft/1ds-post-js');

	const appInsightsCore = new oneDs.AppInsightsCore();
	const collectorChannelPlugin: PostChannel = new postPlugin.PostChannel();
	// Configure the app insights core to send to collector++ and disable logging of debug info
	const coreConfig: IExtendedConfiguration = {
		instrumentationKey,
		endpointUrl,
		loggingLevelTelemetry: 0,
		loggingLevelConsole: 0,
		disableCookiesUsage: true,
		disableDbgExt: true,
		disableInstrumentationKeyValidation: true,
		channels: [[
			collectorChannelPlugin
		]]
	};

	if (xhrOverride) {
		coreConfig.extensionConfig = {};
		// Configure the channel to use a XHR Request override since it's not available in node
		const channelConfig: IChannelConfiguration = {
			alwaysUseXhrOverride: true,
			ignoreMc1Ms0CookieProcessing: true,
			httpXHROverride: xhrOverride
		};
		coreConfig.extensionConfig[collectorChannelPlugin.identifier] = channelConfig;
	}

	appInsightsCore.initialize(coreConfig, []);

	appInsightsCore.addTelemetryInitializer((envelope) => {
		// Opt the user out of 1DS data sharing
		envelope['ext'] = envelope['ext'] ?? {};
		envelope['ext']['web'] = envelope['ext']['web'] ?? {};
		envelope['ext']['web']['consentDetails'] = '{"GPC_DataSharingOptIn":false}';

		if (addInternalFlag) {
			envelope['ext']['utc'] = envelope['ext']['utc'] ?? {};
			// Sets it to be internal only based on Windows UTC flagging
			envelope['ext']['utc']['flags'] = 0x0000811ECD;
		}
	});

	return appInsightsCore;
}

// TODO @lramos15 maybe make more in line with src/vs/platform/telemetry/browser/appInsightsAppender.ts with caching support
export abstract class AbstractOneDataSystemAppender implements ITelemetryAppender {

	protected _aiCoreOrKey: IAppInsightsCore | string | undefined;
	private _asyncAiCore: Promise<IAppInsightsCore> | null;
	protected readonly endPointUrl = endpointUrl;
	protected readonly endPointHealthUrl = endpointHealthUrl;

	constructor(
		private readonly _isInternalTelemetry: boolean,
		private _eventPrefix: string,
		private _defaultData: { [key: string]: unknown } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
		private _xhrOverride?: IXHROverride
	) {
		if (!this._defaultData) {
			this._defaultData = {};
		}

		if (typeof iKeyOrClientFactory === 'function') {
			this._aiCoreOrKey = iKeyOrClientFactory();
		} else {
			this._aiCoreOrKey = iKeyOrClientFactory;
		}
		this._asyncAiCore = null;
	}

	private _withAIClient(callback: (aiCore: IAppInsightsCore) => void): void {
		if (!this._aiCoreOrKey) {
			return;
		}

		if (typeof this._aiCoreOrKey !== 'string') {
			callback(this._aiCoreOrKey);
			return;
		}

		if (!this._asyncAiCore) {
			this._asyncAiCore = getClient(this._aiCoreOrKey, this._isInternalTelemetry, this._xhrOverride);
		}

		this._asyncAiCore.then(
			(aiClient) => {
				callback(aiClient);
			},
			(err) => {
				onUnexpectedError(err);
				console.error(err);
			}
		);
	}

	log(eventName: string, data?: unknown): void {
		if (!this._aiCoreOrKey) {
			return;
		}
		data = mixin(data, this._defaultData);
		const validatedData = validateTelemetryData(data);
		const name = this._eventPrefix + '/' + eventName;

		try {
			this._withAIClient((aiClient) => {
				aiClient.pluginVersionString = validatedData?.properties.version ?? 'Unknown';
				aiClient.track({
					name,
					baseData: { name, properties: validatedData?.properties, measurements: validatedData?.measurements }
				});
			});
		} catch { }
	}

	flush(): Promise<void> {
		if (this._aiCoreOrKey) {
			return new Promise(resolve => {
				this._withAIClient((aiClient) => {
					aiClient.unload(true, () => {
						this._aiCoreOrKey = undefined;
						resolve(undefined);
					});
				});
			});
		}
		return Promise.resolve(undefined);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/commonProperties.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/commonProperties.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isLinuxSnap, platform, Platform, PlatformToString } from '../../../base/common/platform.js';
import { env, platform as nodePlatform } from '../../../base/common/process.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { ICommonProperties } from './telemetry.js';

function getPlatformDetail(hostname: string): string | undefined {
	if (platform === Platform.Linux && /^penguin(\.|$)/i.test(hostname)) {
		return 'chromebook';
	}

	return undefined;
}

export function resolveCommonProperties(
	release: string,
	hostname: string,
	arch: string,
	commit: string | undefined,
	version: string | undefined,
	machineId: string | undefined,
	sqmId: string | undefined,
	devDeviceId: string | undefined,
	isInternalTelemetry: boolean,
	releaseDate: string | undefined,
	product?: string,
): ICommonProperties {
	const result: ICommonProperties = Object.create(null);

	// __GDPR__COMMON__ "common.machineId" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
	result['common.machineId'] = machineId;
	// __GDPR__COMMON__ "common.sqmId" : { "endPoint": "SqmMachineId", "classification": "EndUserPseudonymizedInformation", "purpose": "BusinessInsight" }
	result['common.sqmId'] = sqmId;
	// __GDPR__COMMON__ "common.devDeviceId" : { "endPoint": "SqmMachineId", "classification": "EndUserPseudonymizedInformation", "purpose": "BusinessInsight" }
	result['common.devDeviceId'] = devDeviceId;
	// __GDPR__COMMON__ "sessionID" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['sessionID'] = generateUuid() + Date.now();
	// __GDPR__COMMON__ "commitHash" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['commitHash'] = commit;
	// __GDPR__COMMON__ "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['version'] = version;
	// __GDPR__COMMON__ "common.releaseDate" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.releaseDate'] = releaseDate;
	// __GDPR__COMMON__ "common.platformVersion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.platformVersion'] = (release || '').replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, '$1$2$3');
	// __GDPR__COMMON__ "common.platform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.platform'] = PlatformToString(platform);
	// __GDPR__COMMON__ "common.nodePlatform" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.nodePlatform'] = nodePlatform;
	// __GDPR__COMMON__ "common.nodeArch" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.nodeArch'] = arch;
	// __GDPR__COMMON__ "common.product" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.product'] = product || 'desktop';

	if (isInternalTelemetry) {
		// __GDPR__COMMON__ "common.msftInternal" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		result['common.msftInternal'] = isInternalTelemetry;
	}

	// dynamic properties which value differs on each call
	let seq = 0;
	const startTime = Date.now();
	Object.defineProperties(result, {
		// __GDPR__COMMON__ "timestamp" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		'timestamp': {
			get: () => new Date(),
			enumerable: true
		},
		// __GDPR__COMMON__ "common.timesincesessionstart" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		'common.timesincesessionstart': {
			get: () => Date.now() - startTime,
			enumerable: true
		},
		// __GDPR__COMMON__ "common.sequence" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
		'common.sequence': {
			get: () => seq++,
			enumerable: true
		}
	});

	if (isLinuxSnap) {
		// __GDPR__COMMON__ "common.snap" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		result['common.snap'] = 'true';
	}

	const platformDetail = getPlatformDetail(hostname);

	if (platformDetail) {
		// __GDPR__COMMON__ "common.platformDetail" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
		result['common.platformDetail'] = platformDetail;
	}

	return result;
}

export function verifyMicrosoftInternalDomain(domainList: readonly string[]): boolean {
	const userDnsDomain = env['USERDNSDOMAIN'];
	if (!userDnsDomain) {
		return false;
	}

	const domain = userDnsDomain.toLowerCase();
	return domainList.some(msftDomain => domain === msftDomain);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/errorTelemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/errorTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { binarySearch } from '../../../base/common/arrays.js';
import { errorHandler, ErrorNoTelemetry, PendingMigrationError } from '../../../base/common/errors.js';
import { DisposableStore, toDisposable } from '../../../base/common/lifecycle.js';
import { safeStringify } from '../../../base/common/objects.js';
import { FileOperationError } from '../../files/common/files.js';
import { ITelemetryService } from './telemetry.js';

type ErrorEventFragment = {
	owner: 'lramos15, sbatten';
	comment: 'Whenever an error in VS Code is thrown.';
	callstack: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The callstack of the error.' };
	msg?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The message of the error. Normally the first line int the callstack.' };
	file?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The file the error originated from.' };
	line?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The line the error originate on.' };
	column?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The column of the line which the error orginated on.' };
	uncaught_error_name?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'If the error is uncaught what is the error type' };
	uncaught_error_msg?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'If the error is uncaught this is just msg but for uncaught errors.' };
	count?: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'How many times this error has been thrown' };
};
export interface ErrorEvent {
	callstack: string;
	msg?: string;
	file?: string;
	line?: number;
	column?: number;
	uncaught_error_name?: string;
	uncaught_error_msg?: string;
	count?: number;
}

export namespace ErrorEvent {
	export function compare(a: ErrorEvent, b: ErrorEvent) {
		if (a.callstack < b.callstack) {
			return -1;
		} else if (a.callstack > b.callstack) {
			return 1;
		}
		return 0;
	}
}

export default abstract class BaseErrorTelemetry {

	public static ERROR_FLUSH_TIMEOUT: number = 5 * 1000;

	private _telemetryService: ITelemetryService;
	private _flushDelay: number;
	private _flushHandle: Timeout | undefined = undefined;
	private _buffer: ErrorEvent[] = [];
	protected readonly _disposables = new DisposableStore();

	constructor(telemetryService: ITelemetryService, flushDelay = BaseErrorTelemetry.ERROR_FLUSH_TIMEOUT) {
		this._telemetryService = telemetryService;
		this._flushDelay = flushDelay;

		// (1) check for unexpected but handled errors
		const unbind = errorHandler.addListener((err) => this._onErrorEvent(err));
		this._disposables.add(toDisposable(unbind));

		// (2) install implementation-specific error listeners
		this.installErrorListeners();
	}

	dispose() {
		clearTimeout(this._flushHandle);
		this._flushBuffer();
		this._disposables.dispose();
	}

	protected installErrorListeners(): void {
		// to override
	}

	private _onErrorEvent(err: any): void {

		if (!err || err.code) {
			return;
		}

		// unwrap nested errors from loader
		if (err.detail && err.detail.stack) {
			err = err.detail;
		}

		// If it's the no telemetry error it doesn't get logged
		// TOOD @lramos15 hacking in FileOperation error because it's too messy to adopt ErrorNoTelemetry. A better solution should be found
		//
		// Explicitly filter out PendingMigrationError for https://github.com/microsoft/vscode/issues/250648#issuecomment-3394040431
		// We don't inherit from ErrorNoTelemetry to preserve the name used in reporting for exthostdeprecatedapiusage event.
		// TODO(deepak1556): remove when PendingMigrationError is no longer needed.
		if (ErrorNoTelemetry.isErrorNoTelemetry(err) || err instanceof FileOperationError || PendingMigrationError.is(err) || (typeof err?.message === 'string' && err.message.includes('Unable to read file'))) {
			return;
		}

		// work around behavior in workerServer.ts that breaks up Error.stack
		const callstack = Array.isArray(err.stack) ? err.stack.join('\n') : err.stack;
		const msg = err.message ? err.message : safeStringify(err);

		// errors without a stack are not useful telemetry
		if (!callstack) {
			return;
		}

		this._enqueue({ msg, callstack });
	}

	protected _enqueue(e: ErrorEvent): void {

		const idx = binarySearch(this._buffer, e, ErrorEvent.compare);
		if (idx < 0) {
			e.count = 1;
			this._buffer.splice(~idx, 0, e);
		} else {
			if (!this._buffer[idx].count) {
				this._buffer[idx].count = 0;
			}
			this._buffer[idx].count += 1;
		}

		if (this._flushHandle === undefined) {
			this._flushHandle = setTimeout(() => {
				this._flushBuffer();
				this._flushHandle = undefined;
			}, this._flushDelay);
		}
	}

	private _flushBuffer(): void {
		for (const error of this._buffer) {
			type UnhandledErrorClassification = {} & ErrorEventFragment;
			this._telemetryService.publicLogError2<ErrorEvent, UnhandledErrorClassification>('UnhandledError', error);
		}
		this._buffer.length = 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/gdprTypings.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/gdprTypings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface IPropertyData {
	classification: 'SystemMetaData' | 'CallstackOrException' | 'CustomerContent' | 'PublicNonPersonalData' | 'EndUserPseudonymizedInformation';
	purpose: 'PerformanceAndHealth' | 'FeatureInsight' | 'BusinessInsight';
	comment: string;
	expiration?: string;
	endpoint?: string;
}

export interface IGDPRProperty {
	owner: string;
	comment: string;
	expiration?: string;
	readonly [name: string]: IPropertyData | undefined | IGDPRProperty | string;
}

type IGDPRPropertyWithoutMetadata = Omit<IGDPRProperty, 'owner' | 'comment' | 'expiration'>;
export type OmitMetadata<T> = Omit<T, 'owner' | 'comment' | 'expiration'>;

export type ClassifiedEvent<T extends IGDPRPropertyWithoutMetadata> = {
	[k in keyof T]: unknown;
};

export type StrictPropertyChecker<TEvent, TClassification, TError> = keyof TEvent extends keyof OmitMetadata<TClassification> ? keyof OmitMetadata<TClassification> extends keyof TEvent ? TEvent : TError : TError;

export type StrictPropertyCheckError = { error: 'Type of classified event does not match event properties' };

export type StrictPropertyCheck<T extends IGDPRProperty, E> = StrictPropertyChecker<E, ClassifiedEvent<OmitMetadata<T>>, StrictPropertyCheckError>;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/remoteTelemetryChannel.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/remoteTelemetryChannel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { TelemetryLevel } from './telemetry.js';
import { ITelemetryAppender } from './telemetryUtils.js';
import { IServerTelemetryService } from './serverTelemetryService.js';

export class ServerTelemetryChannel extends Disposable implements IServerChannel {
	constructor(
		private readonly telemetryService: IServerTelemetryService,
		private readonly telemetryAppender: ITelemetryAppender | null
	) {
		super();
	}


	async call(_: any, command: string, arg?: any): Promise<any> {
		switch (command) {
			case 'updateTelemetryLevel': {
				const { telemetryLevel } = arg;
				return this.telemetryService.updateInjectedTelemetryLevel(telemetryLevel);
			}

			case 'logTelemetry': {
				const { eventName, data } = arg;
				// Logging is done directly to the appender instead of through the telemetry service
				// as the data sent from the client has already had common properties added to it and
				// has already been sent to the telemetry output channel
				if (this.telemetryAppender) {
					return this.telemetryAppender.log(eventName, data);
				}

				return Promise.resolve();
			}

			case 'flushTelemetry': {
				if (this.telemetryAppender) {
					return this.telemetryAppender.flush();
				}

				return Promise.resolve();
			}

			case 'ping': {
				return;
			}
		}
		// Command we cannot handle so we throw an error
		throw new Error(`IPC Command ${command} not found`);
	}

	listen(_: any, event: string, arg: any): Event<any> {
		throw new Error('Not supported');
	}

	/**
	 * Disposing the channel also disables the telemetryService as there is
	 * no longer a way to control it
	 */
	public override dispose(): void {
		this.telemetryService.updateInjectedTelemetryLevel(TelemetryLevel.NONE);
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/serverTelemetryService.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/serverTelemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../configuration/common/configuration.js';
import { refineServiceDecorator } from '../../instantiation/common/instantiation.js';
import { IProductService } from '../../product/common/productService.js';
import { ClassifiedEvent, IGDPRProperty, OmitMetadata, StrictPropertyCheck } from './gdprTypings.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel } from './telemetry.js';
import { ITelemetryServiceConfig, TelemetryService } from './telemetryService.js';
import { NullTelemetryServiceShape } from './telemetryUtils.js';

export interface IServerTelemetryService extends ITelemetryService {
	updateInjectedTelemetryLevel(telemetryLevel: TelemetryLevel): Promise<void>;
}

export class ServerTelemetryService extends TelemetryService implements IServerTelemetryService {
	// Because we cannot read the workspace config on the remote site
	// the ServerTelemetryService is responsible for knowing its telemetry level
	// this is done through IPC calls and initial value injections
	private _injectedTelemetryLevel: TelemetryLevel;
	constructor(
		config: ITelemetryServiceConfig,
		injectedTelemetryLevel: TelemetryLevel,
		@IConfigurationService _configurationService: IConfigurationService,
		@IProductService _productService: IProductService
	) {
		super(config, _configurationService, _productService);
		this._injectedTelemetryLevel = injectedTelemetryLevel;
	}

	override publicLog(eventName: string, data?: ITelemetryData) {
		if (this._injectedTelemetryLevel < TelemetryLevel.USAGE) {
			return;
		}
		return super.publicLog(eventName, data);
	}

	override publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		return this.publicLog(eventName, data as ITelemetryData | undefined);
	}

	override publicLogError(errorEventName: string, data?: ITelemetryData) {
		if (this._injectedTelemetryLevel < TelemetryLevel.ERROR) {
			return Promise.resolve(undefined);
		}
		return super.publicLogError(errorEventName, data);
	}

	override publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		return this.publicLogError(eventName, data as ITelemetryData | undefined);
	}

	async updateInjectedTelemetryLevel(telemetryLevel: TelemetryLevel): Promise<void> {
		if (telemetryLevel === undefined) {
			this._injectedTelemetryLevel = TelemetryLevel.NONE;
			throw new Error('Telemetry level cannot be undefined. This will cause infinite looping!');
		}
		// We always take the most restrictive level because we don't want multiple clients to connect and send data when one client does not consent
		this._injectedTelemetryLevel = this._injectedTelemetryLevel ? Math.min(this._injectedTelemetryLevel, telemetryLevel) : telemetryLevel;
		if (this._injectedTelemetryLevel === TelemetryLevel.NONE) {
			this.dispose();
		}
	}
}

export const ServerNullTelemetryService = new class extends NullTelemetryServiceShape implements IServerTelemetryService {
	async updateInjectedTelemetryLevel(): Promise<void> { return; } // No-op, telemetry is already disabled
};

export const IServerTelemetryService = refineServiceDecorator<ITelemetryService, IServerTelemetryService>(ITelemetryService);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/telemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/telemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../instantiation/common/instantiation.js';
import { ClassifiedEvent, IGDPRProperty, OmitMetadata, StrictPropertyCheck } from './gdprTypings.js';

export const ITelemetryService = createDecorator<ITelemetryService>('telemetryService');

export interface ITelemetryData {
	from?: string;
	target?: string;
	[key: string]: string | unknown | undefined;
}

export interface ITelemetryService {

	readonly _serviceBrand: undefined;

	readonly telemetryLevel: TelemetryLevel;

	readonly sessionId: string;
	readonly machineId: string;
	readonly sqmId: string;
	readonly devDeviceId: string;
	readonly firstSessionDate: string;
	readonly msftInternal?: boolean;

	/**
	 * Whether error telemetry will get sent. If false, `publicLogError` will no-op.
	 */
	readonly sendErrorTelemetry: boolean;

	/**
	 * @deprecated Use publicLog2 and the typescript GDPR annotation where possible
	 */
	publicLog(eventName: string, data?: ITelemetryData): void;

	/**
	 * Sends a telemetry event that has been privacy approved.
	 * Do not call this unless you have been given approval.
	 */
	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void;

	/**
	 * @deprecated Use publicLogError2 and the typescript GDPR annotation where possible
	 */
	publicLogError(errorEventName: string, data?: ITelemetryData): void;

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>): void;

	setExperimentProperty(name: string, value: string): void;
}

export function telemetryLevelEnabled(service: ITelemetryService, level: TelemetryLevel): boolean {
	return service.telemetryLevel >= level;
}

export interface ITelemetryEndpoint {
	id: string;
	aiKey: string;
	sendErrorTelemetry: boolean;
}

export const ICustomEndpointTelemetryService = createDecorator<ICustomEndpointTelemetryService>('customEndpointTelemetryService');

export interface ICustomEndpointTelemetryService {
	readonly _serviceBrand: undefined;

	publicLog(endpoint: ITelemetryEndpoint, eventName: string, data?: ITelemetryData): void;
	publicLogError(endpoint: ITelemetryEndpoint, errorEventName: string, data?: ITelemetryData): void;
}

// Keys
export const currentSessionDateStorageKey = 'telemetry.currentSessionDate';
export const firstSessionDateStorageKey = 'telemetry.firstSessionDate';
export const lastSessionDateStorageKey = 'telemetry.lastSessionDate';
export const machineIdKey = 'telemetry.machineId';
export const sqmIdKey = 'telemetry.sqmId';
export const devDeviceIdKey = 'telemetry.devDeviceId';

// Configuration Keys
export const TELEMETRY_SECTION_ID = 'telemetry';
export const TELEMETRY_SETTING_ID = 'telemetry.telemetryLevel';
export const TELEMETRY_CRASH_REPORTER_SETTING_ID = 'telemetry.enableCrashReporter';
export const TELEMETRY_OLD_SETTING_ID = 'telemetry.enableTelemetry';

export const enum TelemetryLevel {
	NONE = 0,
	CRASH = 1,
	ERROR = 2,
	USAGE = 3
}

export const enum TelemetryConfiguration {
	OFF = 'off',
	CRASH = 'crash',
	ERROR = 'error',
	ON = 'all'
}

export interface ICommonProperties {
	[name: string]: string | boolean | undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/telemetryIpc.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/telemetryIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../base/common/event.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ITelemetryData } from './telemetry.js';
import { ITelemetryAppender } from './telemetryUtils.js';

export interface ITelemetryLog {
	eventName: string;
	data?: ITelemetryData;
}

export class TelemetryAppenderChannel implements IServerChannel {

	constructor(private appenders: ITelemetryAppender[]) { }

	listen<T>(_: unknown, event: string): Event<T> {
		throw new Error(`Event not found: ${event}`);
	}

	call<T>(_: unknown, command: string, { eventName, data }: ITelemetryLog) {
		this.appenders.forEach(a => a.log(eventName, data ?? {}));
		return Promise.resolve(null as unknown as T);
	}
}

export class TelemetryAppenderClient implements ITelemetryAppender {

	constructor(private channel: IChannel) { }

	log(eventName: string, data?: unknown): unknown {
		this.channel.call('log', { eventName, data })
			.then(undefined, err => `Failed to log telemetry: ${console.warn(err)}`);

		return Promise.resolve(null);
	}

	flush(): Promise<void> {
		// TODO
		return Promise.resolve();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/telemetryLogAppender.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/telemetryLogAppender.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../base/common/lifecycle.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { ILogger, ILoggerService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { ITelemetryAppender, TelemetryLogGroup, isLoggingOnly, telemetryLogId, validateTelemetryData } from './telemetryUtils.js';

export class TelemetryLogAppender extends Disposable implements ITelemetryAppender {

	private readonly logger: ILogger;

	constructor(
		private readonly prefix: string,
		remote: boolean,
		@ILoggerService loggerService: ILoggerService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IProductService productService: IProductService,
	) {
		super();

		const id = remote ? 'remoteTelemetry' : telemetryLogId;
		const logger = loggerService.getLogger(id);
		if (logger) {
			this.logger = this._register(logger);
		} else {
			// Not a perfect check, but a nice way to indicate if we only have logging enabled for debug purposes and nothing is actually being sent
			const justLoggingAndNotSending = isLoggingOnly(productService, environmentService);
			const logSuffix = justLoggingAndNotSending ? ' (Not Sent)' : '';
			this.logger = this._register(loggerService.createLogger(id,
				{
					name: localize('telemetryLog', "Telemetry{0}", logSuffix),
					group: TelemetryLogGroup,
					hidden: true
				}));
		}
	}

	flush(): Promise<void> {
		return Promise.resolve();
	}

	log(eventName: string, data: unknown): void {
		this.logger.trace(`${this.prefix}telemetry/${eventName}`, validateTelemetryData(data));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/telemetryService.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/telemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../base/common/lifecycle.js';
import { mixin } from '../../../base/common/objects.js';
import { isWeb } from '../../../base/common/platform.js';
import { PolicyCategory } from '../../../base/common/policy.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { localize } from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { ConfigurationScope, Extensions, IConfigurationRegistry } from '../../configuration/common/configurationRegistry.js';
import product from '../../product/common/product.js';
import { IProductService } from '../../product/common/productService.js';
import { Registry } from '../../registry/common/platform.js';
import { ClassifiedEvent, IGDPRProperty, OmitMetadata, StrictPropertyCheck } from './gdprTypings.js';
import { ITelemetryData, ITelemetryService, TelemetryConfiguration, TelemetryLevel, TELEMETRY_CRASH_REPORTER_SETTING_ID, TELEMETRY_OLD_SETTING_ID, TELEMETRY_SECTION_ID, TELEMETRY_SETTING_ID, ICommonProperties } from './telemetry.js';
import { cleanData, getTelemetryLevel, ITelemetryAppender } from './telemetryUtils.js';

export interface ITelemetryServiceConfig {
	appenders: ITelemetryAppender[];
	sendErrorTelemetry?: boolean;
	commonProperties?: ICommonProperties;
	piiPaths?: string[];
}

export class TelemetryService implements ITelemetryService {

	static readonly IDLE_START_EVENT_NAME = 'UserIdleStart';
	static readonly IDLE_STOP_EVENT_NAME = 'UserIdleStop';

	declare readonly _serviceBrand: undefined;

	readonly sessionId: string;
	readonly machineId: string;
	readonly sqmId: string;
	readonly devDeviceId: string;
	readonly firstSessionDate: string;
	readonly msftInternal: boolean | undefined;

	private _appenders: ITelemetryAppender[];
	private _commonProperties: ICommonProperties;
	private _experimentProperties: { [name: string]: string } = {};
	private _piiPaths: string[];
	private _telemetryLevel: TelemetryLevel;
	private _sendErrorTelemetry: boolean;

	private readonly _disposables = new DisposableStore();
	private _cleanupPatterns: RegExp[] = [];

	constructor(
		config: ITelemetryServiceConfig,
		@IConfigurationService private _configurationService: IConfigurationService,
		@IProductService private _productService: IProductService
	) {
		this._appenders = config.appenders;
		this._commonProperties = config.commonProperties ?? Object.create(null);

		this.sessionId = this._commonProperties['sessionID'] as string;
		this.machineId = this._commonProperties['common.machineId'] as string;
		this.sqmId = this._commonProperties['common.sqmId'] as string;
		this.devDeviceId = this._commonProperties['common.devDeviceId'] as string;
		this.firstSessionDate = this._commonProperties['common.firstSessionDate'] as string;
		this.msftInternal = this._commonProperties['common.msftInternal'] as boolean | undefined;

		this._piiPaths = config.piiPaths || [];
		this._telemetryLevel = TelemetryLevel.USAGE;
		this._sendErrorTelemetry = !!config.sendErrorTelemetry;

		// static cleanup pattern for: `vscode-file:///DANGEROUS/PATH/resources/app/Useful/Information`
		this._cleanupPatterns = [/(vscode-)?file:\/\/.*?\/resources\/app\//gi];

		for (const piiPath of this._piiPaths) {
			this._cleanupPatterns.push(new RegExp(escapeRegExpCharacters(piiPath), 'gi'));

			if (piiPath.indexOf('\\') >= 0) {
				this._cleanupPatterns.push(new RegExp(escapeRegExpCharacters(piiPath.replace(/\\/g, '/')), 'gi'));
			}
		}

		this._updateTelemetryLevel();
		this._disposables.add(this._configurationService.onDidChangeConfiguration(e => {
			// Check on the telemetry settings and update the state if changed
			const affectsTelemetryConfig =
				e.affectsConfiguration(TELEMETRY_SETTING_ID)
				|| e.affectsConfiguration(TELEMETRY_OLD_SETTING_ID)
				|| e.affectsConfiguration(TELEMETRY_CRASH_REPORTER_SETTING_ID);
			if (affectsTelemetryConfig) {
				this._updateTelemetryLevel();
			}
		}));
	}

	setExperimentProperty(name: string, value: string): void {
		this._experimentProperties[name] = value;
	}

	private _updateTelemetryLevel(): void {
		let level = getTelemetryLevel(this._configurationService);
		const collectableTelemetry = this._productService.enabledTelemetryLevels;
		// Also ensure that error telemetry is respecting the product configuration for collectable telemetry
		if (collectableTelemetry) {
			this._sendErrorTelemetry = this.sendErrorTelemetry ? collectableTelemetry.error : false;
			// Make sure the telemetry level from the service is the minimum of the config and product
			const maxCollectableTelemetryLevel = collectableTelemetry.usage ? TelemetryLevel.USAGE : collectableTelemetry.error ? TelemetryLevel.ERROR : TelemetryLevel.NONE;
			level = Math.min(level, maxCollectableTelemetryLevel);
		}

		this._telemetryLevel = level;
	}

	get sendErrorTelemetry(): boolean {
		return this._sendErrorTelemetry;
	}

	get telemetryLevel(): TelemetryLevel {
		return this._telemetryLevel;
	}

	dispose(): void {
		this._disposables.dispose();
	}

	private _log(eventName: string, eventLevel: TelemetryLevel, data?: ITelemetryData) {
		// don't send events when the user is optout
		if (this._telemetryLevel < eventLevel) {
			return;
		}

		// add experiment properties
		data = mixin(data, this._experimentProperties);

		// remove all PII from data
		data = cleanData(data, this._cleanupPatterns);

		// add common properties
		data = mixin(data, this._commonProperties);

		// Log to the appenders of sufficient level
		this._appenders.forEach(a => a.log(eventName, data ?? {}));
	}

	publicLog(eventName: string, data?: ITelemetryData) {
		this._log(eventName, TelemetryLevel.USAGE, data);
	}

	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLog(eventName, data as ITelemetryData);
	}

	publicLogError(errorEventName: string, data?: ITelemetryData) {
		if (!this._sendErrorTelemetry) {
			return;
		}

		// Send error event and anonymize paths
		this._log(errorEventName, TelemetryLevel.ERROR, data);
	}

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLogError(eventName, data as ITelemetryData);
	}
}

function getTelemetryLevelSettingDescription(): string {
	const telemetryText = localize('telemetry.telemetryLevelMd', "Controls {0} telemetry, first-party extension telemetry, and participating third-party extension telemetry. Some third party extensions might not respect this setting. Consult the specific extension's documentation to be sure. Telemetry helps us better understand how {0} is performing, where improvements need to be made, and how features are being used.", product.nameLong);
	const externalLinksStatement = !product.privacyStatementUrl ?
		localize("telemetry.docsStatement", "Read more about the [data we collect]({0}).", 'https://aka.ms/vscode-telemetry') :
		localize("telemetry.docsAndPrivacyStatement", "Read more about the [data we collect]({0}) and our [privacy statement]({1}).", 'https://aka.ms/vscode-telemetry', product.privacyStatementUrl);
	const restartString = !isWeb ? localize('telemetry.restart', 'A full restart of the application is necessary for crash reporting changes to take effect.') : '';

	const crashReportsHeader = localize('telemetry.crashReports', "Crash Reports");
	const errorsHeader = localize('telemetry.errors', "Error Telemetry");
	const usageHeader = localize('telemetry.usage', "Usage Data");

	const telemetryTableDescription = localize('telemetry.telemetryLevel.tableDescription', "The following table outlines the data sent with each setting:");
	const telemetryTable = `
|       | ${crashReportsHeader} | ${errorsHeader} | ${usageHeader} |
|:------|:-------------:|:---------------:|:----------:|
| all   |       ✓       |        ✓        |     ✓      |
| error |       ✓       |        ✓        |     -      |
| crash |       ✓       |        -        |     -      |
| off   |       -       |        -        |     -      |
`;

	const deprecatedSettingNote = localize('telemetry.telemetryLevel.deprecated', "****Note:*** If this setting is 'off', no telemetry will be sent regardless of other telemetry settings. If this setting is set to anything except 'off' and telemetry is disabled with deprecated settings, no telemetry will be sent.*");
	const telemetryDescription = `
${telemetryText} ${externalLinksStatement} ${restartString}

&nbsp;

${telemetryTableDescription}
${telemetryTable}

&nbsp;

${deprecatedSettingNote}
`;

	return telemetryDescription;
}

const configurationRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
configurationRegistry.registerConfiguration({
	'id': TELEMETRY_SECTION_ID,
	'order': 1,
	'type': 'object',
	'title': localize('telemetryConfigurationTitle', "Telemetry"),
	'properties': {
		[TELEMETRY_SETTING_ID]: {
			'type': 'string',
			'enum': [TelemetryConfiguration.ON, TelemetryConfiguration.ERROR, TelemetryConfiguration.CRASH, TelemetryConfiguration.OFF],
			'enumDescriptions': [
				localize('telemetry.telemetryLevel.default', "Sends usage data, errors, and crash reports."),
				localize('telemetry.telemetryLevel.error', "Sends general error telemetry and crash reports."),
				localize('telemetry.telemetryLevel.crash', "Sends OS level crash reports."),
				localize('telemetry.telemetryLevel.off', "Disables all product telemetry.")
			],
			'markdownDescription': getTelemetryLevelSettingDescription(),
			'default': TelemetryConfiguration.ON,
			'restricted': true,
			'scope': ConfigurationScope.APPLICATION,
			'tags': ['usesOnlineServices', 'telemetry'],
			'policy': {
				name: 'TelemetryLevel',
				category: PolicyCategory.Telemetry,
				minimumVersion: '1.99',
				localization: {
					description: {
						key: 'telemetry.telemetryLevel.policyDescription',
						value: localize('telemetry.telemetryLevel.policyDescription', "Controls the level of telemetry."),
					},
					enumDescriptions: [
						{
							key: 'telemetry.telemetryLevel.default',
							value: localize('telemetry.telemetryLevel.default', "Sends usage data, errors, and crash reports."),
						},
						{
							key: 'telemetry.telemetryLevel.error',
							value: localize('telemetry.telemetryLevel.error', "Sends general error telemetry and crash reports."),
						},
						{
							key: 'telemetry.telemetryLevel.crash',
							value: localize('telemetry.telemetryLevel.crash', "Sends OS level crash reports."),
						},
						{
							key: 'telemetry.telemetryLevel.off',
							value: localize('telemetry.telemetryLevel.off', "Disables all product telemetry."),
						}
					]
				}
			}
		},
		'telemetry.feedback.enabled': {
			type: 'boolean',
			default: true,
			description: localize('telemetry.feedback.enabled', "Enable feedback mechanisms such as the issue reporter, surveys, and other feedback options."),
			policy: {
				name: 'EnableFeedback',
				category: PolicyCategory.Telemetry,
				minimumVersion: '1.99',
				localization: { description: { key: 'telemetry.feedback.enabled', value: localize('telemetry.feedback.enabled', "Enable feedback mechanisms such as the issue reporter, surveys, and other feedback options.") } },
			}
		},
		// Deprecated telemetry setting
		[TELEMETRY_OLD_SETTING_ID]: {
			'type': 'boolean',
			'markdownDescription':
				!product.privacyStatementUrl ?
					localize('telemetry.enableTelemetry', "Enable diagnostic data to be collected. This helps us to better understand how {0} is performing and where improvements need to be made.", product.nameLong) :
					localize('telemetry.enableTelemetryMd', "Enable diagnostic data to be collected. This helps us to better understand how {0} is performing and where improvements need to be made. [Read more]({1}) about what we collect and our privacy statement.", product.nameLong, product.privacyStatementUrl),
			'default': true,
			'restricted': true,
			'markdownDeprecationMessage': localize('enableTelemetryDeprecated', "If this setting is false, no telemetry will be sent regardless of the new setting's value. Deprecated in favor of the {0} setting.", `\`#${TELEMETRY_SETTING_ID}#\``),
			'scope': ConfigurationScope.APPLICATION,
			'tags': ['usesOnlineServices', 'telemetry']
		}
	},
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/common/telemetryUtils.ts]---
Location: vscode-main/src/vs/platform/telemetry/common/telemetryUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { cloneAndChange, safeStringify } from '../../../base/common/objects.js';
import { isObject } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { LoggerGroup } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { getRemoteName } from '../../remote/common/remoteHosts.js';
import { verifyMicrosoftInternalDomain } from './commonProperties.js';
import { ICustomEndpointTelemetryService, ITelemetryData, ITelemetryEndpoint, ITelemetryService, TelemetryConfiguration, TelemetryLevel, TELEMETRY_CRASH_REPORTER_SETTING_ID, TELEMETRY_OLD_SETTING_ID, TELEMETRY_SETTING_ID } from './telemetry.js';

/**
 * A special class used to denoting a telemetry value which should not be clean.
 * This is because that value is "Trusted" not to contain identifiable information such as paths.
 * NOTE: This is used as an API type as well, and should not be changed.
 */
export class TelemetryTrustedValue<T> {
	// This is merely used as an identifier as the instance will be lost during serialization over the exthost
	public readonly isTrustedTelemetryValue = true;
	constructor(public readonly value: T) { }
}

export class NullTelemetryServiceShape implements ITelemetryService {
	declare readonly _serviceBrand: undefined;
	readonly telemetryLevel = TelemetryLevel.NONE;
	readonly sessionId = 'someValue.sessionId';
	readonly machineId = 'someValue.machineId';
	readonly sqmId = 'someValue.sqmId';
	readonly devDeviceId = 'someValue.devDeviceId';
	readonly firstSessionDate = 'someValue.firstSessionDate';
	readonly sendErrorTelemetry = false;
	publicLog() { }
	publicLog2() { }
	publicLogError() { }
	publicLogError2() { }
	setExperimentProperty() { }
}

export const NullTelemetryService = new NullTelemetryServiceShape();

export class NullEndpointTelemetryService implements ICustomEndpointTelemetryService {
	_serviceBrand: undefined;

	async publicLog(_endpoint: ITelemetryEndpoint, _eventName: string, _data?: ITelemetryData): Promise<void> {
		// noop
	}

	async publicLogError(_endpoint: ITelemetryEndpoint, _errorEventName: string, _data?: ITelemetryData): Promise<void> {
		// noop
	}
}

export const telemetryLogId = 'telemetry';
export const TelemetryLogGroup: LoggerGroup = { id: telemetryLogId, name: localize('telemetryLogName', "Telemetry") };

export interface ITelemetryAppender {
	log(eventName: string, data: ITelemetryData): void;
	flush(): Promise<void>;
}

export const NullAppender: ITelemetryAppender = { log: () => null, flush: () => Promise.resolve(undefined) };


/* __GDPR__FRAGMENT__
	"URIDescriptor" : {
		"mimeType" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"scheme": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"ext": { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"path": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	}
*/
export interface URIDescriptor {
	mimeType?: string;
	scheme?: string;
	ext?: string;
	path?: string;
}

/**
 * Determines whether or not we support logging telemetry.
 * This checks if the product is capable of collecting telemetry but not whether or not it can send it
 * For checking the user setting and what telemetry you can send please check `getTelemetryLevel`.
 * This returns true if `--disable-telemetry` wasn't used, the product.json allows for telemetry, and we're not testing an extension
 * If false telemetry is disabled throughout the product
 * @param productService
 * @param environmentService
 * @returns false - telemetry is completely disabled, true - telemetry is logged locally, but may not be sent
 */
export function supportsTelemetry(productService: IProductService, environmentService: IEnvironmentService): boolean {
	// If it's OSS and telemetry isn't disabled via the CLI we will allow it for logging only purposes
	if (!environmentService.isBuilt && !environmentService.disableTelemetry) {
		return true;
	}
	return !(environmentService.disableTelemetry || !productService.enableTelemetry);
}

/**
 * Checks to see if we're in logging only mode to debug telemetry.
 * This is if telemetry is enabled and we're in OSS, but no telemetry key is provided so it's not being sent just logged.
 * @param productService
 * @param environmentService
 * @returns True if telemetry is actually disabled and we're only logging for debug purposes
 */
export function isLoggingOnly(productService: IProductService, environmentService: IEnvironmentService): boolean {
	// If we're testing an extension, log telemetry for debug purposes
	if (environmentService.extensionTestsLocationURI) {
		return true;
	}
	// Logging only mode is only for OSS
	if (environmentService.isBuilt) {
		return false;
	}

	if (environmentService.disableTelemetry) {
		return false;
	}

	if (productService.enableTelemetry && productService.aiConfig?.ariaKey) {
		return false;
	}

	return true;
}

/**
 * Determines how telemetry is handled based on the user's configuration.
 *
 * @param configurationService
 * @returns OFF, ERROR, ON
 */
export function getTelemetryLevel(configurationService: IConfigurationService): TelemetryLevel {
	const newConfig = configurationService.getValue<TelemetryConfiguration>(TELEMETRY_SETTING_ID);
	const crashReporterConfig = configurationService.getValue<boolean | undefined>(TELEMETRY_CRASH_REPORTER_SETTING_ID);
	const oldConfig = configurationService.getValue<boolean | undefined>(TELEMETRY_OLD_SETTING_ID);

	// If `telemetry.enableCrashReporter` is false or `telemetry.enableTelemetry' is false, disable telemetry
	if (oldConfig === false || crashReporterConfig === false) {
		return TelemetryLevel.NONE;
	}

	// Maps new telemetry setting to a telemetry level
	switch (newConfig ?? TelemetryConfiguration.ON) {
		case TelemetryConfiguration.ON:
			return TelemetryLevel.USAGE;
		case TelemetryConfiguration.ERROR:
			return TelemetryLevel.ERROR;
		case TelemetryConfiguration.CRASH:
			return TelemetryLevel.CRASH;
		case TelemetryConfiguration.OFF:
			return TelemetryLevel.NONE;
	}
}

export interface Properties {
	[key: string]: string;
}

export interface Measurements {
	[key: string]: number;
}

export function validateTelemetryData(data?: unknown): { properties: Properties; measurements: Measurements } {

	const properties: Properties = {};
	const measurements: Measurements = {};

	const flat: Record<string, unknown> = {};
	flatten(data, flat);

	for (let prop in flat) {
		// enforce property names less than 150 char, take the last 150 char
		prop = prop.length > 150 ? prop.substr(prop.length - 149) : prop;
		const value = flat[prop];

		if (typeof value === 'number') {
			measurements[prop] = value;

		} else if (typeof value === 'boolean') {
			measurements[prop] = value ? 1 : 0;

		} else if (typeof value === 'string') {
			if (value.length > 8192) {
				console.warn(`Telemetry property: ${prop} has been trimmed to 8192, the original length is ${value.length}`);
			}
			//enforce property value to be less than 8192 char, take the first 8192 char
			// https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics#limits
			properties[prop] = value.substring(0, 8191);

		} else if (typeof value !== 'undefined' && value !== null) {
			properties[prop] = String(value);
		}
	}

	return {
		properties,
		measurements
	};
}

const telemetryAllowedAuthorities = new Set(['ssh-remote', 'dev-container', 'attached-container', 'wsl', 'tunnel', 'codespaces', 'amlext']);

export function cleanRemoteAuthority(remoteAuthority?: string): string {
	if (!remoteAuthority) {
		return 'none';
	}
	const remoteName = getRemoteName(remoteAuthority);
	return telemetryAllowedAuthorities.has(remoteName) ? remoteName : 'other';
}

function flatten(obj: unknown, result: Record<string, unknown>, order: number = 0, prefix?: string): void {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		return;
	}

	const source = obj as Record<string, unknown>;
	for (const item of Object.getOwnPropertyNames(source)) {
		const value = source[item];
		const index = prefix ? prefix + item : item;

		if (Array.isArray(value)) {
			result[index] = safeStringify(value);

		} else if (value instanceof Date) {
			// TODO unsure why this is here and not in _getData
			result[index] = value.toISOString();

		} else if (isObject(value)) {
			if (order < 2) {
				flatten(value, result, order + 1, index + '.');
			} else {
				result[index] = safeStringify(value);
			}
		} else {
			result[index] = value;
		}
	}
}

/**
 * Whether or not this is an internal user
 * @param productService The product service
 * @param configService The config servivce
 * @returns true if internal, false otherwise
 */
export function isInternalTelemetry(productService: IProductService, configService: IConfigurationService) {
	const msftInternalDomains = productService.msftInternalDomains || [];
	const internalTesting = configService.getValue<boolean>('telemetry.internalTesting');
	return verifyMicrosoftInternalDomain(msftInternalDomains) || internalTesting;
}

interface IPathEnvironment {
	appRoot: string;
	extensionsPath: string;
	userDataPath: string;
	userHome: URI;
	tmpDir: URI;
}

export function getPiiPathsFromEnvironment(paths: IPathEnvironment): string[] {
	return [paths.appRoot, paths.extensionsPath, paths.userHome.fsPath, paths.tmpDir.fsPath, paths.userDataPath];
}

//#region Telemetry Cleaning

/**
 * Cleans a given stack of possible paths
 * @param stack The stack to sanitize
 * @param cleanupPatterns Cleanup patterns to remove from the stack
 * @returns The cleaned stack
 */
function anonymizeFilePaths(stack: string, cleanupPatterns: RegExp[]): string {

	// Fast check to see if it is a file path to avoid doing unnecessary heavy regex work
	if (!stack || (!stack.includes('/') && !stack.includes('\\'))) {
		return stack;
	}

	let updatedStack = stack;

	const cleanUpIndexes: [number, number][] = [];
	for (const regexp of cleanupPatterns) {
		while (true) {
			const result = regexp.exec(stack);
			if (!result) {
				break;
			}
			cleanUpIndexes.push([result.index, regexp.lastIndex]);
		}
	}

	const nodeModulesRegex = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
	const fileRegex = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
	let lastIndex = 0;
	updatedStack = '';

	while (true) {
		const result = fileRegex.exec(stack);
		if (!result) {
			break;
		}

		// Check to see if the any cleanupIndexes partially overlap with this match
		const overlappingRange = cleanUpIndexes.some(([start, end]) => result.index < end && start < fileRegex.lastIndex);

		// anoynimize user file paths that do not need to be retained or cleaned up.
		if (!nodeModulesRegex.test(result[0]) && !overlappingRange) {
			updatedStack += stack.substring(lastIndex, result.index) + '<REDACTED: user-file-path>';
			lastIndex = fileRegex.lastIndex;
		}
	}
	if (lastIndex < stack.length) {
		updatedStack += stack.substr(lastIndex);
	}

	return updatedStack;
}

/**
 * Attempts to remove commonly leaked PII
 * @param property The property which will be removed if it contains user data
 * @returns The new value for the property
 */
function removePropertiesWithPossibleUserInfo(property: string): string {
	// If for some reason it is undefined we skip it (this shouldn't be possible);
	if (!property) {
		return property;
	}

	const userDataRegexes = [
		{ label: 'URL', regex: /[a-zA-Z][a-zA-Z0-9+.-]*:\/\/[^\s]*/ },
		{ label: 'Google API Key', regex: /AIza[A-Za-z0-9_\\\-]{35}/ },
		{ label: 'JWT', regex: /eyJ[0eXAiOiJKV1Qi|hbGci|a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/ },
		{ label: 'Slack Token', regex: /xox[pbar]\-[A-Za-z0-9]/ },
		{ label: 'GitHub Token', regex: /(gh[psuro]_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59})/ },
		{ label: 'Generic Secret', regex: /(key|token|sig|secret|signature|password|passwd|pwd|android:value)[^a-zA-Z0-9]/i },
		{ label: 'CLI Credentials', regex: /((login|psexec|(certutil|psexec)\.exe).{1,50}(\s-u(ser(name)?)?\s+.{3,100})?\s-(admin|user|vm|root)?p(ass(word)?)?\s+["']?[^$\-\/\s]|(^|[\s\r\n\\])net(\.exe)?.{1,5}(user\s+|share\s+\/user:| user -? secrets ? set) \s + [^ $\s \/])/ },
		{ label: 'Microsoft Entra ID', regex: /eyJ(?:0eXAiOiJKV1Qi|hbGci|[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.)/ },
		{ label: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ }
	];

	// Check for common user data in the telemetry events
	for (const secretRegex of userDataRegexes) {
		if (secretRegex.regex.test(property)) {
			return `<REDACTED: ${secretRegex.label}>`;
		}
	}

	return property;
}


/**
 * Does a best possible effort to clean a data object from any possible PII.
 * @param data The data object to clean
 * @param paths Any additional patterns that should be removed from the data set
 * @returns A new object with the PII removed
 */
export function cleanData(data: ITelemetryData | undefined, cleanUpPatterns: RegExp[]): Record<string, unknown> {
	if (!data) {
		return {};
	}
	return cloneAndChange(data, value => {

		// If it's a trusted value it means it's okay to skip cleaning so we don't clean it
		if (value instanceof TelemetryTrustedValue || Object.hasOwnProperty.call(value, 'isTrustedTelemetryValue')) {
			return value.value;
		}

		// We only know how to clean strings
		if (typeof value === 'string') {
			let updatedProperty = value.replaceAll('%20', ' ');

			// First we anonymize any possible file paths
			updatedProperty = anonymizeFilePaths(updatedProperty, cleanUpPatterns);

			// Then we do a simple regex replace with the defined patterns
			for (const regexp of cleanUpPatterns) {
				updatedProperty = updatedProperty.replace(regexp, '');
			}

			// Lastly, remove commonly leaked PII
			updatedProperty = removePropertiesWithPossibleUserInfo(updatedProperty);

			return updatedProperty;
		}
		return undefined;
	});
}

//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/electron-browser/customEndpointTelemetryService.ts]---
Location: vscode-main/src/vs/platform/telemetry/electron-browser/customEndpointTelemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { registerSharedProcessRemoteService } from '../../ipc/electron-browser/services.js';
import { ICustomEndpointTelemetryService } from '../common/telemetry.js';

registerSharedProcessRemoteService(ICustomEndpointTelemetryService, 'customEndpointTelemetry');
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/electron-main/errorTelemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/electron-main/errorTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isSigPipeError, onUnexpectedError, setUnexpectedErrorHandler } from '../../../base/common/errors.js';
import BaseErrorTelemetry from '../common/errorTelemetry.js';
import { ITelemetryService } from '../common/telemetry.js';
import { ILogService } from '../../../platform/log/common/log.js';

export default class ErrorTelemetry extends BaseErrorTelemetry {
	constructor(
		private readonly logService: ILogService,
		@ITelemetryService telemetryService: ITelemetryService
	) {
		super(telemetryService);
	}

	protected override installErrorListeners(): void {
		// We handle uncaught exceptions here to prevent electron from opening a dialog to the user
		setUnexpectedErrorHandler(error => this.onUnexpectedError(error));

		process.on('uncaughtException', error => {
			if (!isSigPipeError(error)) {
				onUnexpectedError(error);
			}
		});

		process.on('unhandledRejection', (reason: unknown) => onUnexpectedError(reason));
	}

	private onUnexpectedError(error: Error): void {
		this.logService.error(`[uncaught exception in main]: ${error}`);
		if (error.stack) {
			this.logService.error(error.stack);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/electron-main/telemetryUtils.ts]---
Location: vscode-main/src/vs/platform/telemetry/electron-main/telemetryUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getDevDeviceId } from '../../../base/node/id.js';
import { ILogService } from '../../log/common/log.js';
import { IStateService } from '../../state/node/state.js';
import { machineIdKey, sqmIdKey, devDeviceIdKey } from '../common/telemetry.js';
import { resolveMachineId as resolveNodeMachineId, resolveSqmId as resolveNodeSqmId, resolveDevDeviceId as resolveNodeDevDeviceId } from '../node/telemetryUtils.js';

export async function resolveMachineId(stateService: IStateService, logService: ILogService): Promise<string> {
	logService.trace('Resolving machine identifier...');
	const machineId = await resolveNodeMachineId(stateService, logService);
	stateService.setItem(machineIdKey, machineId);
	logService.trace(`Resolved machine identifier: ${machineId}`);
	return machineId;
}

export async function resolveSqmId(stateService: IStateService, logService: ILogService): Promise<string> {
	logService.trace('Resolving SQM identifier...');
	const sqmId = await resolveNodeSqmId(stateService, logService);
	stateService.setItem(sqmIdKey, sqmId);
	logService.trace(`Resolved SQM identifier: ${sqmId}`);
	return sqmId;
}

export async function resolveDevDeviceId(stateService: IStateService, logService: ILogService): Promise<string> {
	logService.trace('Resolving devDevice identifier...');
	const devDeviceId = await resolveNodeDevDeviceId(stateService, logService);
	stateService.setItem(devDeviceIdKey, devDeviceId);
	logService.trace(`Resolved devDevice identifier: ${devDeviceId}`);
	return devDeviceId;
}

export async function validateDevDeviceId(stateService: IStateService, logService: ILogService): Promise<void> {
	const actualDeviceId = await getDevDeviceId(logService.error.bind(logService));
	const currentDeviceId = await resolveNodeDevDeviceId(stateService, logService);
	if (actualDeviceId !== currentDeviceId) {
		stateService.setItem(devDeviceIdKey, actualDeviceId);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/node/1dsAppender.ts]---
Location: vscode-main/src/vs/platform/telemetry/node/1dsAppender.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IPayloadData, IXHROverride } from '@microsoft/1ds-post-js';
import { streamToBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IRequestOptions } from '../../../base/parts/request/common/request.js';
import { IRequestService } from '../../request/common/request.js';
import { AbstractOneDataSystemAppender, IAppInsightsCore } from '../common/1dsAppender.js';

type OnCompleteFunc = (status: number, headers: { [headerName: string]: string }, response?: string) => void;

interface IResponseData {
	headers: { [headerName: string]: string };
	statusCode: number;
	responseData: string;
}

/**
 * Completes a request to submit telemetry to the server utilizing the request service
 * @param options The options which will be used to make the request
 * @param requestService The request service
 * @returns An object containing the headers, statusCode, and responseData
 */
async function makeTelemetryRequest(options: IRequestOptions, requestService: IRequestService): Promise<IResponseData> {
	const response = await requestService.request(options, CancellationToken.None);
	const responseData = (await streamToBuffer(response.stream)).toString();
	const statusCode = response.res.statusCode ?? 200;
	const headers = response.res.headers as Record<string, string>;
	return {
		headers,
		statusCode,
		responseData
	};
}

/**
 * Complete a request to submit telemetry to the server utilizing the https module. Only used when the request service is not available
 * @param options The options which will be used to make the request
 * @returns An object containing the headers, statusCode, and responseData
 */
async function makeLegacyTelemetryRequest(options: IRequestOptions): Promise<IResponseData> {
	const https = await import('https'); // Lazy due to https://github.com/nodejs/node/issues/59686
	const httpsOptions = {
		method: options.type,
		headers: options.headers
	};
	const responsePromise = new Promise<IResponseData>((resolve, reject) => {
		const req = https.request(options.url ?? '', httpsOptions, res => {
			res.on('data', function (responseData) {
				resolve({
					headers: res.headers as Record<string, string>,
					statusCode: res.statusCode ?? 200,
					responseData: responseData.toString()
				});
			});
			// On response with error send status of 0 and a blank response to oncomplete so we can retry events
			res.on('error', function (err) {
				reject(err);
			});
		});
		req.write(options.data, (err) => {
			if (err) {
				reject(err);
			}
		});
		req.end();
	});
	return responsePromise;
}

async function sendPostAsync(requestService: IRequestService | undefined, payload: IPayloadData, oncomplete: OnCompleteFunc) {
	const telemetryRequestData = typeof payload.data === 'string' ? payload.data : new TextDecoder().decode(payload.data);
	const requestOptions: IRequestOptions = {
		type: 'POST',
		headers: {
			...payload.headers,
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(payload.data).toString()
		},
		url: payload.urlString,
		data: telemetryRequestData
	};

	try {
		const responseData = requestService ? await makeTelemetryRequest(requestOptions, requestService) : await makeLegacyTelemetryRequest(requestOptions);
		oncomplete(responseData.statusCode, responseData.headers, responseData.responseData);
	} catch {
		// If it errors out, send status of 0 and a blank response to oncomplete so we can retry events
		oncomplete(0, {});
	}
}


export class OneDataSystemAppender extends AbstractOneDataSystemAppender {

	constructor(
		requestService: IRequestService | undefined,
		isInternalTelemetry: boolean,
		eventPrefix: string,
		defaultData: { [key: string]: unknown } | null,
		iKeyOrClientFactory: string | (() => IAppInsightsCore), // allow factory function for testing
	) {
		// Override the way events get sent since node doesn't have XHTMLRequest
		const customHttpXHROverride: IXHROverride = {
			sendPOST: (payload: IPayloadData, oncomplete: OnCompleteFunc) => {
				// Fire off the async request without awaiting it
				sendPostAsync(requestService, payload, oncomplete);
			}
		};

		super(isInternalTelemetry, eventPrefix, defaultData, iKeyOrClientFactory, customHttpXHROverride);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/node/customEndpointTelemetryService.ts]---
Location: vscode-main/src/vs/platform/telemetry/node/customEndpointTelemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FileAccess } from '../../../base/common/network.js';
import { Client as TelemetryClient } from '../../../base/parts/ipc/node/ipc.cp.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { ILoggerService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { ICustomEndpointTelemetryService, ITelemetryData, ITelemetryEndpoint, ITelemetryService } from '../common/telemetry.js';
import { TelemetryAppenderClient } from '../common/telemetryIpc.js';
import { TelemetryLogAppender } from '../common/telemetryLogAppender.js';
import { TelemetryService } from '../common/telemetryService.js';

export class CustomEndpointTelemetryService implements ICustomEndpointTelemetryService {
	declare readonly _serviceBrand: undefined;

	private customTelemetryServices = new Map<string, ITelemetryService>();

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@ILoggerService private readonly loggerService: ILoggerService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IProductService private readonly productService: IProductService
	) { }

	private getCustomTelemetryService(endpoint: ITelemetryEndpoint): ITelemetryService {
		if (!this.customTelemetryServices.has(endpoint.id)) {
			const telemetryInfo: { [key: string]: string } = Object.create(null);
			telemetryInfo['common.vscodemachineid'] = this.telemetryService.machineId;
			telemetryInfo['common.vscodesessionid'] = this.telemetryService.sessionId;
			const args = [endpoint.id, JSON.stringify(telemetryInfo), endpoint.aiKey];
			const client = new TelemetryClient(
				FileAccess.asFileUri('bootstrap-fork').fsPath,
				{
					serverName: 'Debug Telemetry',
					timeout: 1000 * 60 * 5,
					args,
					env: {
						ELECTRON_RUN_AS_NODE: 1,
						VSCODE_PIPE_LOGGING: 'true',
						VSCODE_ESM_ENTRYPOINT: 'vs/workbench/contrib/debug/node/telemetryApp'
					}
				}
			);

			const channel = client.getChannel('telemetryAppender');
			const appenders = [
				new TelemetryAppenderClient(channel),
				new TelemetryLogAppender(`[${endpoint.id}] `, false, this.loggerService, this.environmentService, this.productService),
			];

			this.customTelemetryServices.set(endpoint.id, new TelemetryService({
				appenders,
				sendErrorTelemetry: endpoint.sendErrorTelemetry
			}, this.configurationService, this.productService));
		}

		return this.customTelemetryServices.get(endpoint.id)!;
	}

	publicLog(telemetryEndpoint: ITelemetryEndpoint, eventName: string, data?: ITelemetryData) {
		const customTelemetryService = this.getCustomTelemetryService(telemetryEndpoint);
		customTelemetryService.publicLog(eventName, data);
	}

	publicLogError(telemetryEndpoint: ITelemetryEndpoint, errorEventName: string, data?: ITelemetryData) {
		const customTelemetryService = this.getCustomTelemetryService(telemetryEndpoint);
		customTelemetryService.publicLogError(errorEventName, data);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/node/errorTelemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/node/errorTelemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isCancellationError, isSigPipeError, onUnexpectedError, setUnexpectedErrorHandler } from '../../../base/common/errors.js';
import BaseErrorTelemetry from '../common/errorTelemetry.js';

export default class ErrorTelemetry extends BaseErrorTelemetry {
	protected override installErrorListeners(): void {
		setUnexpectedErrorHandler(err => console.error(err));

		// Print a console message when rejection isn't handled within N seconds. For details:
		// see https://nodejs.org/api/process.html#process_event_unhandledrejection
		// and https://nodejs.org/api/process.html#process_event_rejectionhandled
		const unhandledPromises: Promise<unknown>[] = [];
		process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
			unhandledPromises.push(promise);
			setTimeout(() => {
				const idx = unhandledPromises.indexOf(promise);
				if (idx >= 0) {
					promise.catch(e => {
						unhandledPromises.splice(idx, 1);
						if (!isCancellationError(e)) {
							console.warn(`rejected promise not handled within 1 second: ${e}`);
							if (e.stack) {
								console.warn(`stack trace: ${e.stack}`);
							}
							if (reason) {
								onUnexpectedError(reason);
							}
						}
					});
				}
			}, 1000);
		});

		process.on('rejectionHandled', (promise: Promise<unknown>) => {
			const idx = unhandledPromises.indexOf(promise);
			if (idx >= 0) {
				unhandledPromises.splice(idx, 1);
			}
		});

		// Print a console message when an exception isn't handled.
		process.on('uncaughtException', (err: Error | NodeJS.ErrnoException) => {
			if (isSigPipeError(err)) {
				return;
			}

			onUnexpectedError(err);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/node/telemetry.ts]---
Location: vscode-main/src/vs/platform/telemetry/node/telemetry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import { join } from '../../../base/common/path.js';
import { Promises } from '../../../base/node/pfs.js';

export async function buildTelemetryMessage(appRoot: string, extensionsPath?: string): Promise<string> {
	const mergedTelemetry = Object.create(null);

	// Simple function to merge the telemetry into one json object
	const mergeTelemetry = (contents: string, dirName: string) => {
		const telemetryData = JSON.parse(contents);
		mergedTelemetry[dirName] = telemetryData;
	};

	if (extensionsPath) {
		const dirs: string[] = [];

		const files = await Promises.readdir(extensionsPath);
		for (const file of files) {
			try {
				const fileStat = await fs.promises.stat(join(extensionsPath, file));
				if (fileStat.isDirectory()) {
					dirs.push(file);
				}
			} catch {
				// This handles case where broken symbolic links can cause statSync to throw and error
			}
		}

		const telemetryJsonFolders: string[] = [];
		for (const dir of dirs) {
			const files = (await Promises.readdir(join(extensionsPath, dir))).filter(file => file === 'telemetry.json');
			if (files.length === 1) {
				telemetryJsonFolders.push(dir); // // We know it contains a telemetry.json file so we add it to the list of folders which have one
			}
		}

		for (const folder of telemetryJsonFolders) {
			const contents = (await fs.promises.readFile(join(extensionsPath, folder, 'telemetry.json'))).toString();
			mergeTelemetry(contents, folder);
		}
	}

	let contents = (await fs.promises.readFile(join(appRoot, 'telemetry-core.json'))).toString();
	mergeTelemetry(contents, 'vscode-core');

	contents = (await fs.promises.readFile(join(appRoot, 'telemetry-extensions.json'))).toString();
	mergeTelemetry(contents, 'vscode-extensions');

	return JSON.stringify(mergedTelemetry, null, 4);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/node/telemetryUtils.ts]---
Location: vscode-main/src/vs/platform/telemetry/node/telemetryUtils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isMacintosh } from '../../../base/common/platform.js';
import { getMachineId, getSqmMachineId, getDevDeviceId } from '../../../base/node/id.js';
import { ILogService } from '../../log/common/log.js';
import { IStateReadService } from '../../state/node/state.js';
import { machineIdKey, sqmIdKey, devDeviceIdKey } from '../common/telemetry.js';


export async function resolveMachineId(stateService: IStateReadService, logService: ILogService): Promise<string> {
	// We cache the machineId for faster lookups
	// and resolve it only once initially if not cached or we need to replace the macOS iBridge device
	let machineId = stateService.getItem<string>(machineIdKey);
	if (typeof machineId !== 'string' || (isMacintosh && machineId === '6c9d2bc8f91b89624add29c0abeae7fb42bf539fa1cdb2e3e57cd668fa9bcead')) {
		machineId = await getMachineId(logService.error.bind(logService));
	}

	return machineId;
}

export async function resolveSqmId(stateService: IStateReadService, logService: ILogService): Promise<string> {
	let sqmId = stateService.getItem<string>(sqmIdKey);
	if (typeof sqmId !== 'string') {
		sqmId = await getSqmMachineId(logService.error.bind(logService));
	}

	return sqmId;
}

export async function resolveDevDeviceId(stateService: IStateReadService, logService: ILogService): Promise<string> {
	let devDeviceId = stateService.getItem<string>(devDeviceIdKey);
	if (typeof devDeviceId !== 'string') {
		devDeviceId = await getDevDeviceId(logService.error.bind(logService));
	}

	return devDeviceId;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/telemetry/test/browser/1dsAppender.test.ts]---
Location: vscode-main/src/vs/platform/telemetry/test/browser/1dsAppender.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import type { ITelemetryItem, ITelemetryUnloadState } from '@microsoft/1ds-core-js';
import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { OneDataSystemWebAppender } from '../../browser/1dsAppender.js';
import { IAppInsightsCore } from '../../common/1dsAppender.js';

class AppInsightsCoreMock implements IAppInsightsCore {
	pluginVersionString: string = 'Test Runner';
	public events: any[] = [];
	public IsTrackingPageView: boolean = false;
	public exceptions: any[] = [];

	public track(event: ITelemetryItem) {
		this.events.push(event.baseData);
	}

	public unload(isAsync: boolean, unloadComplete: (unloadState: ITelemetryUnloadState) => void): void {
		// No-op
	}
}

suite('AIAdapter', () => {
	let appInsightsMock: AppInsightsCoreMock;
	let adapter: OneDataSystemWebAppender;
	const prefix = 'prefix';


	teardown(() => {
		adapter.flush();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		appInsightsMock = new AppInsightsCoreMock();
		adapter = new OneDataSystemWebAppender(false, prefix, undefined!, () => appInsightsMock);
	});


	test('Simple event', () => {
		adapter.log('testEvent');

		assert.strictEqual(appInsightsMock.events.length, 1);
		assert.strictEqual(appInsightsMock.events[0].name, `${prefix}/testEvent`);
	});

	test('addional data', () => {
		adapter = new OneDataSystemWebAppender(false, prefix, { first: '1st', second: 2, third: true }, () => appInsightsMock);
		adapter.log('testEvent');

		assert.strictEqual(appInsightsMock.events.length, 1);
		const [first] = appInsightsMock.events;
		assert.strictEqual(first.name, `${prefix}/testEvent`);
		assert.strictEqual(first.properties!['first'], '1st');
		assert.strictEqual(first.measurements!['second'], 2);
		assert.strictEqual(first.measurements!['third'], 1);
	});

	test('property limits', () => {
		let reallyLongPropertyName = 'abcdefghijklmnopqrstuvwxyz';
		for (let i = 0; i < 6; i++) {
			reallyLongPropertyName += 'abcdefghijklmnopqrstuvwxyz';
		}
		assert(reallyLongPropertyName.length > 150);

		let reallyLongPropertyValue = 'abcdefghijklmnopqrstuvwxyz012345678901234567890123';
		for (let i = 0; i < 400; i++) {
			reallyLongPropertyValue += 'abcdefghijklmnopqrstuvwxyz012345678901234567890123';
		}
		assert(reallyLongPropertyValue.length > 8192);

		const data = Object.create(null);
		data[reallyLongPropertyName] = '1234';
		data['reallyLongPropertyValue'] = reallyLongPropertyValue;
		adapter.log('testEvent', data);

		assert.strictEqual(appInsightsMock.events.length, 1);

		for (const prop in appInsightsMock.events[0].properties!) {
			assert(prop.length < 150);
			assert(appInsightsMock.events[0].properties![prop].length < 8192);
		}
	});

	test('Different data types', () => {
		const date = new Date();
		adapter.log('testEvent', { favoriteDate: date, likeRed: false, likeBlue: true, favoriteNumber: 1, favoriteColor: 'blue', favoriteCars: ['bmw', 'audi', 'ford'] });

		assert.strictEqual(appInsightsMock.events.length, 1);
		assert.strictEqual(appInsightsMock.events[0].name, `${prefix}/testEvent`);
		assert.strictEqual(appInsightsMock.events[0].properties!['favoriteColor'], 'blue');
		assert.strictEqual(appInsightsMock.events[0].measurements!['likeRed'], 0);
		assert.strictEqual(appInsightsMock.events[0].measurements!['likeBlue'], 1);
		assert.strictEqual(appInsightsMock.events[0].properties!['favoriteDate'], date.toISOString());
		assert.strictEqual(appInsightsMock.events[0].properties!['favoriteCars'], JSON.stringify(['bmw', 'audi', 'ford']));
		assert.strictEqual(appInsightsMock.events[0].measurements!['favoriteNumber'], 1);
	});

	test('Nested data', () => {
		adapter.log('testEvent', {
			window: {
				title: 'some title',
				measurements: {
					width: 100,
					height: 200
				}
			},
			nestedObj: {
				nestedObj2: {
					nestedObj3: {
						testProperty: 'test',
					}
				},
				testMeasurement: 1
			}
		});

		assert.strictEqual(appInsightsMock.events.length, 1);
		assert.strictEqual(appInsightsMock.events[0].name, `${prefix}/testEvent`);

		assert.strictEqual(appInsightsMock.events[0].properties!['window.title'], 'some title');
		assert.strictEqual(appInsightsMock.events[0].measurements!['window.measurements.width'], 100);
		assert.strictEqual(appInsightsMock.events[0].measurements!['window.measurements.height'], 200);

		assert.strictEqual(appInsightsMock.events[0].properties!['nestedObj.nestedObj2.nestedObj3'], JSON.stringify({ 'testProperty': 'test' }));
		assert.strictEqual(appInsightsMock.events[0].measurements!['nestedObj.testMeasurement'], 1);
	});

});
```

--------------------------------------------------------------------------------

````
