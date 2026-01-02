---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 529
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 529 of 552)

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

---[FILE: src/vs/workbench/services/secrets/electron-browser/secretStorageService.ts]---
Location: vscode-main/src/vs/workbench/services/secrets/electron-browser/secretStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { isLinux } from '../../../../base/common/platform.js';
import Severity from '../../../../base/common/severity.js';
import { localize } from '../../../../nls.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IEncryptionService, KnownStorageProvider, PasswordStoreCLIOption, isGnome, isKwallet } from '../../../../platform/encryption/common/encryptionService.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService, IPromptChoice } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { BaseSecretStorageService, ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IJSONEditingService } from '../../configuration/common/jsonEditing.js';

export class NativeSecretStorageService extends BaseSecretStorageService {

	constructor(
		@INotificationService private readonly _notificationService: INotificationService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IOpenerService private readonly _openerService: IOpenerService,
		@IJSONEditingService private readonly _jsonEditingService: IJSONEditingService,
		@INativeEnvironmentService private readonly _environmentService: INativeEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IEncryptionService encryptionService: IEncryptionService,
		@ILogService logService: ILogService
	) {
		super(
			!!_environmentService.useInMemorySecretStorage,
			storageService,
			encryptionService,
			logService
		);
	}

	override set(key: string, value: string): Promise<void> {
		this._sequencer.queue(key, async () => {
			await this.resolvedStorageService;

			if (this.type !== 'persisted' && !this._environmentService.useInMemorySecretStorage) {
				this._logService.trace('[NativeSecretStorageService] Notifying user that secrets are not being stored on disk.');
				await this.notifyOfNoEncryptionOnce();
			}

		});

		return super.set(key, value);
	}

	private notifyOfNoEncryptionOnce = createSingleCallFunction(() => this.notifyOfNoEncryption());
	private async notifyOfNoEncryption(): Promise<void> {
		const buttons: IPromptChoice[] = [];
		const troubleshootingButton: IPromptChoice = {
			label: localize('troubleshootingButton', "Open troubleshooting guide"),
			run: () => this._openerService.open('https://go.microsoft.com/fwlink/?linkid=2239490'),
			// doesn't close dialogs
			keepOpen: true
		};
		buttons.push(troubleshootingButton);

		let errorMessage = localize('encryptionNotAvailableJustTroubleshootingGuide', "An OS keyring couldn't be identified for storing the encryption related data in your current desktop environment.");

		if (!isLinux) {
			this._notificationService.prompt(Severity.Error, errorMessage, buttons);
			return;
		}

		const provider = await this._encryptionService.getKeyStorageProvider();
		if (provider === KnownStorageProvider.basicText) {
			const detail = localize('usePlainTextExtraSentence', "Open the troubleshooting guide to address this or you can use weaker encryption that doesn't use the OS keyring.");
			const usePlainTextButton: IPromptChoice = {
				label: localize('usePlainText', "Use weaker encryption"),
				run: async () => {
					await this._encryptionService.setUsePlainTextEncryption();
					await this._jsonEditingService.write(this._environmentService.argvResource, [{ path: ['password-store'], value: PasswordStoreCLIOption.basic }], true);
					this.reinitialize();
				}
			};
			buttons.unshift(usePlainTextButton);

			await this._dialogService.prompt({
				type: 'error',
				buttons,
				message: errorMessage,
				detail
			});
			return;
		}

		if (isGnome(provider)) {
			errorMessage = localize('isGnome', "You're running in a GNOME environment but the OS keyring is not available for encryption. Ensure you have gnome-keyring or another libsecret compatible implementation installed and running.");
		} else if (isKwallet(provider)) {
			errorMessage = localize('isKwallet', "You're running in a KDE environment but the OS keyring is not available for encryption. Ensure you have kwallet running.");
		}

		this._notificationService.prompt(Severity.Error, errorMessage, buttons);
	}
}

registerSingleton(ISecretStorageService, NativeSecretStorageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/sharedProcess/electron-browser/sharedProcessService.ts]---
Location: vscode-main/src/vs/workbench/services/sharedProcess/electron-browser/sharedProcessService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Client as MessagePortClient } from '../../../../base/parts/ipc/common/ipc.mp.js';
import { IChannel, IServerChannel, getDelayedChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { SharedProcessChannelConnection, SharedProcessRawConnection } from '../../../../platform/sharedProcess/common/sharedProcess.js';
import { mark } from '../../../../base/common/performance.js';
import { Barrier, timeout } from '../../../../base/common/async.js';
import { acquirePort } from '../../../../base/parts/ipc/electron-browser/ipc.mp.js';

export class SharedProcessService extends Disposable implements ISharedProcessService {

	declare readonly _serviceBrand: undefined;

	private readonly withSharedProcessConnection: Promise<MessagePortClient>;

	private readonly restoredBarrier = new Barrier();

	constructor(
		readonly windowId: number,
		@ILogService private readonly logService: ILogService
	) {
		super();

		this.withSharedProcessConnection = this.connect();
	}

	private async connect(): Promise<MessagePortClient> {
		this.logService.trace('Renderer->SharedProcess#connect');

		// Our performance tests show that a connection to the shared
		// process can have significant overhead to the startup time
		// of the window because the shared process could be created
		// as a result. As such, make sure we await the `Restored`
		// phase before making a connection attempt, but also add a
		// timeout to be safe against possible deadlocks.

		await Promise.race([this.restoredBarrier.wait(), timeout(2000)]);

		// Acquire a message port connected to the shared process
		mark('code/willConnectSharedProcess');
		this.logService.trace('Renderer->SharedProcess#connect: before acquirePort');
		const port = await acquirePort(SharedProcessChannelConnection.request, SharedProcessChannelConnection.response);
		mark('code/didConnectSharedProcess');
		this.logService.trace('Renderer->SharedProcess#connect: connection established');

		return this._register(new MessagePortClient(port, `window:${this.windowId}`));
	}

	notifyRestored(): void {
		if (!this.restoredBarrier.isOpen()) {
			this.restoredBarrier.open();
		}
	}

	getChannel(channelName: string): IChannel {
		return getDelayedChannel(this.withSharedProcessConnection.then(connection => connection.getChannel(channelName)));
	}

	registerChannel(channelName: string, channel: IServerChannel<string>): void {
		this.withSharedProcessConnection.then(connection => connection.registerChannel(channelName, channel));
	}

	async createRawConnection(): Promise<MessagePort> {

		// Await initialization of the shared process
		await this.withSharedProcessConnection;

		// Create a new port to the shared process
		this.logService.trace('Renderer->SharedProcess#createRawConnection: before acquirePort');
		const port = await acquirePort(SharedProcessRawConnection.request, SharedProcessRawConnection.response);
		this.logService.trace('Renderer->SharedProcess#createRawConnection: connection established');

		return port;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/statusbar/browser/statusbar.ts]---
Location: vscode-main/src/vs/workbench/services/statusbar/browser/statusbar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeColor } from '../../../../base/common/themables.js';
import { Command } from '../../../../editor/common/languages.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { IManagedHoverTooltipHTMLElement, IManagedHoverTooltipMarkdownString } from '../../../../base/browser/ui/hover/hover.js';
import { ColorIdentifier } from '../../../../platform/theme/common/colorRegistry.js';
import { IAuxiliaryStatusbarPart, IStatusbarEntryContainer } from '../../../browser/parts/statusbar/statusbarPart.js';

export const IStatusbarService = createDecorator<IStatusbarService>('statusbarService');

export interface IStatusbarService extends IStatusbarEntryContainer {

	readonly _serviceBrand: undefined;

	/**
	 * Get the status bar part that is rooted in the provided container.
	 */
	getPart(container: HTMLElement): IStatusbarEntryContainer;

	/**
	 * Creates a new auxililary status bar part in the provided container.
	 */
	createAuxiliaryStatusbarPart(container: HTMLElement, instantiationService: IInstantiationService): IAuxiliaryStatusbarPart;

	/**
	 * Create a scoped status bar service that only operates on the provided
	 * status entry container.
	 */
	createScoped(statusbarEntryContainer: IStatusbarEntryContainer, disposables: DisposableStore): IStatusbarService;
}

export const enum StatusbarAlignment {
	LEFT,
	RIGHT
}

export interface IStatusbarEntryLocation {

	/**
	 * The identifier and priority of another status bar
	 * entry to position relative to. If the referenced
	 * entry does not exist, the priority will be used.
	 */
	location: {
		id: string;
		priority: number;
	};

	/**
	 * The alignment of the status bar entry relative
	 * to the referenced entry.
	 */
	alignment: StatusbarAlignment;

	/**
	 * Whether to move the entry close to the location
	 * so that it appears as if both this entry and
	 * the location belong to each other.
	 */
	compact?: boolean;
}

export function isStatusbarEntryLocation(thing: unknown): thing is IStatusbarEntryLocation {
	const candidate = thing as IStatusbarEntryLocation | undefined;

	return typeof candidate?.location?.id === 'string' && typeof candidate.alignment === 'number';
}

export interface IStatusbarEntryPriority {

	/**
	 * The main priority of the entry that
	 * defines the order of appearance:
	 * either a number or a reference to
	 * another status bar entry to position
	 * relative to.
	 *
	 * May not be unique across all entries.
	 */
	readonly primary: number | IStatusbarEntryLocation;

	/**
	 * The secondary priority of the entry
	 * is used in case the main priority
	 * matches another one's priority.
	 *
	 * Should be unique across all entries.
	 */
	readonly secondary: number;
}

export function isStatusbarEntryPriority(thing: unknown): thing is IStatusbarEntryPriority {
	const candidate = thing as IStatusbarEntryPriority | undefined;

	return (typeof candidate?.primary === 'number' || isStatusbarEntryLocation(candidate?.primary)) && typeof candidate?.secondary === 'number';
}

export const ShowTooltipCommand: Command = {
	id: 'statusBar.entry.showTooltip',
	title: ''
};

export interface IStatusbarStyleOverride {
	readonly priority: number; // lower has higher priority
	readonly foreground?: ColorIdentifier;
	readonly background?: ColorIdentifier;
	readonly border?: ColorIdentifier;
}

export type StatusbarEntryKind = 'standard' | 'warning' | 'error' | 'prominent' | 'remote' | 'offline';
export const StatusbarEntryKinds: StatusbarEntryKind[] = ['standard', 'warning', 'error', 'prominent', 'remote', 'offline'];

export type TooltipContent = string | IMarkdownString | HTMLElement | IManagedHoverTooltipMarkdownString | IManagedHoverTooltipHTMLElement;

export interface ITooltipWithCommands {
	readonly content: TooltipContent;
	readonly commands: Command[];
}

export function isTooltipWithCommands(thing: unknown): thing is ITooltipWithCommands {
	const candidate = thing as ITooltipWithCommands | undefined;

	return !!candidate?.content && Array.isArray(candidate?.commands);
}

/**
 * A declarative way of describing a status bar entry
 */
export interface IStatusbarEntry {

	/**
	 * The (short) name to show for the entry like 'Language Indicator',
	 * 'Git Status' etc.
	 */
	readonly name: string;

	/**
	 * The text to show for the entry. You can embed icons in the text by leveraging the syntax:
	 *
	 * `My text $(icon name) contains icons like $(icon name) this one.`
	 */
	readonly text: string;

	/**
	 * Text to be read out by the screen reader.
	 */
	readonly ariaLabel: string;

	/**
	 * Role of the status bar entry which defines how a screen reader interacts with it.
	 * Default is 'button'.
	 */
	readonly role?: string;

	/**
	 * An optional tooltip text to show when you hover over the entry.
	 *
	 * Use `ITooltipWithCommands` to show a tooltip with commands in hover footer area.
	 */
	readonly tooltip?: TooltipContent | ITooltipWithCommands;

	/**
	 * An optional color to use for the entry.
	 *
	 * @deprecated Use `kind` instead to support themable hover styles.
	 */
	readonly color?: string | ThemeColor;

	/**
	 * An optional background color to use for the entry.
	 *
	 * @deprecated Use `kind` instead to support themable hover styles.
	 */
	readonly backgroundColor?: string | ThemeColor;

	/**
	 * An optional command to execute on click.
	 *
	 * Can use the special `ShowTooltipCommand` to
	 * show the tooltip on click if provided.
	 */
	readonly command?: string | Command | typeof ShowTooltipCommand;

	/**
	 * Whether to show a beak above the status bar entry.
	 */
	readonly showBeak?: boolean;

	/**
	 * Will enable a spinning icon in front of the text to indicate progress. When `true` is
	 * specified, `loading` will be used.
	 */
	readonly showProgress?: boolean | 'loading' | 'syncing';

	/**
	 * The kind of status bar entry. This applies different colors to the entry.
	 */
	readonly kind?: StatusbarEntryKind;

	/**
	 * Enables the status bar entry to appear in all opened windows. Automatically will add
	 * the entry to new auxiliary windows opening.
	 */
	readonly showInAllWindows?: boolean;

	/**
	 * If provided, signals what extension is providing the status bar entry. This allows for
	 * more actions to manage the extension from the status bar entry.
	 */
	readonly extensionId?: string;

	/**
	 * Allows to add content with custom rendering to the status bar entry.
	 * If possible, use `text` instead.
	*/
	readonly content?: HTMLElement;
}

export interface IStatusbarEntryAccessor extends IDisposable {

	/**
	 * Allows to update an existing status bar entry.
	 */
	update(properties: IStatusbarEntry): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/storage/browser/storageService.ts]---
Location: vscode-main/src/vs/workbench/services/storage/browser/storageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BroadcastDataChannel } from '../../../../base/browser/broadcast.js';
import { isSafari } from '../../../../base/browser/browser.js';
import { getActiveWindow } from '../../../../base/browser/dom.js';
import { IndexedDB } from '../../../../base/browser/indexedDB.js';
import { DeferredPromise, Promises } from '../../../../base/common/async.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../base/common/lifecycle.js';
import { assertReturnsDefined } from '../../../../base/common/types.js';
import { InMemoryStorageDatabase, isStorageItemsChangeEvent, IStorage, IStorageDatabase, IStorageItemsChangeEvent, IUpdateRequest, Storage } from '../../../../base/parts/storage/common/storage.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { AbstractStorageService, isProfileUsingDefaultStorage, IS_NEW_KEY, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { isUserDataProfile, IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export class BrowserStorageService extends AbstractStorageService {

	private static BROWSER_DEFAULT_FLUSH_INTERVAL = 5 * 1000; // every 5s because async operations are not permitted on shutdown

	private applicationStorage: IStorage | undefined;
	private applicationStorageDatabase: IIndexedDBStorageDatabase | undefined;
	private readonly applicationStoragePromise = new DeferredPromise<{ indexedDb: IIndexedDBStorageDatabase; storage: IStorage }>();

	private profileStorage: IStorage | undefined;
	private profileStorageDatabase: IIndexedDBStorageDatabase | undefined;
	private profileStorageProfile: IUserDataProfile;
	private readonly profileStorageDisposables = this._register(new DisposableStore());

	private workspaceStorage: IStorage | undefined;
	private workspaceStorageDatabase: IIndexedDBStorageDatabase | undefined;

	get hasPendingUpdate(): boolean {
		return Boolean(
			this.applicationStorageDatabase?.hasPendingUpdate ||
			this.profileStorageDatabase?.hasPendingUpdate ||
			this.workspaceStorageDatabase?.hasPendingUpdate
		);
	}

	constructor(
		private readonly workspace: IAnyWorkspaceIdentifier,
		private readonly userDataProfileService: IUserDataProfileService,
		@ILogService private readonly logService: ILogService,
	) {
		super({ flushInterval: BrowserStorageService.BROWSER_DEFAULT_FLUSH_INTERVAL });

		this.profileStorageProfile = this.userDataProfileService.currentProfile;

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(e => e.join(this.switchToProfile(e.profile))));
	}

	protected async doInitialize(): Promise<void> {

		// Init storages
		await Promises.settled([
			this.createApplicationStorage(),
			this.createProfileStorage(this.profileStorageProfile),
			this.createWorkspaceStorage()
		]);
	}

	private async createApplicationStorage(): Promise<void> {
		const applicationStorageIndexedDB = await IndexedDBStorageDatabase.createApplicationStorage(this.logService);

		this.applicationStorageDatabase = this._register(applicationStorageIndexedDB);
		this.applicationStorage = this._register(new Storage(this.applicationStorageDatabase));

		this._register(this.applicationStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.APPLICATION, e)));

		await this.applicationStorage.init();

		this.updateIsNew(this.applicationStorage);

		this.applicationStoragePromise.complete({ indexedDb: applicationStorageIndexedDB, storage: this.applicationStorage });
	}

	private async createProfileStorage(profile: IUserDataProfile): Promise<void> {

		// First clear any previously associated disposables
		this.profileStorageDisposables.clear();

		// Remember profile associated to profile storage
		this.profileStorageProfile = profile;

		if (isProfileUsingDefaultStorage(this.profileStorageProfile)) {

			// If we are using default profile storage, the profile storage is
			// actually the same as application storage. As such we
			// avoid creating the storage library a second time on
			// the same DB.

			const { indexedDb: applicationStorageIndexedDB, storage: applicationStorage } = await this.applicationStoragePromise.p;

			this.profileStorageDatabase = applicationStorageIndexedDB;
			this.profileStorage = applicationStorage;

			this.profileStorageDisposables.add(this.profileStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.PROFILE, e)));
		} else {
			const profileStorageIndexedDB = await IndexedDBStorageDatabase.createProfileStorage(this.profileStorageProfile, this.logService);

			this.profileStorageDatabase = this.profileStorageDisposables.add(profileStorageIndexedDB);
			this.profileStorage = this.profileStorageDisposables.add(new Storage(this.profileStorageDatabase));

			this.profileStorageDisposables.add(this.profileStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.PROFILE, e)));

			await this.profileStorage.init();

			this.updateIsNew(this.profileStorage);
		}
	}

	private async createWorkspaceStorage(): Promise<void> {
		const workspaceStorageIndexedDB = await IndexedDBStorageDatabase.createWorkspaceStorage(this.workspace.id, this.logService);

		this.workspaceStorageDatabase = this._register(workspaceStorageIndexedDB);
		this.workspaceStorage = this._register(new Storage(this.workspaceStorageDatabase));

		this._register(this.workspaceStorage.onDidChangeStorage(e => this.emitDidChangeValue(StorageScope.WORKSPACE, e)));

		await this.workspaceStorage.init();

		this.updateIsNew(this.workspaceStorage);
	}

	private updateIsNew(storage: IStorage): void {
		const firstOpen = storage.getBoolean(IS_NEW_KEY);
		if (firstOpen === undefined) {
			storage.set(IS_NEW_KEY, true);
		} else if (firstOpen) {
			storage.set(IS_NEW_KEY, false);
		}
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
				return this.applicationStorageDatabase?.name;
			case StorageScope.PROFILE:
				return this.profileStorageDatabase?.name;
			default:
				return this.workspaceStorageDatabase?.name;
		}
	}

	protected async switchToProfile(toProfile: IUserDataProfile): Promise<void> {
		if (!this.canSwitchProfile(this.profileStorageProfile, toProfile)) {
			return;
		}

		const oldProfileStorage = assertReturnsDefined(this.profileStorage);
		const oldItems = oldProfileStorage.items;

		// Close old profile storage but only if this is
		// different from application storage!
		if (oldProfileStorage !== this.applicationStorage) {
			await oldProfileStorage.close();
		}

		// Create new profile storage & init
		await this.createProfileStorage(toProfile);

		// Handle data switch and eventing
		this.switchData(oldItems, assertReturnsDefined(this.profileStorage), StorageScope.PROFILE);
	}

	protected async switchToWorkspace(toWorkspace: IAnyWorkspaceIdentifier, preserveData: boolean): Promise<void> {
		throw new Error('Migrating storage is currently unsupported in Web');
	}

	protected override shouldFlushWhenIdle(): boolean {
		// this flush() will potentially cause new state to be stored
		// since new state will only be created while the document
		// has focus, one optimization is to not run this when the
		// document has no focus, assuming that state has not changed
		//
		// another optimization is to not collect more state if we
		// have a pending update already running which indicates
		// that the connection is either slow or disconnected and
		// thus unhealthy.
		return getActiveWindow().document.hasFocus() && !this.hasPendingUpdate;
	}

	close(): void {

		// Safari: there is an issue where the page can hang on load when
		// a previous session has kept IndexedDB transactions running.
		// The only fix seems to be to cancel any pending transactions
		// (https://github.com/microsoft/vscode/issues/136295)
		//
		// On all other browsers, we keep the databases opened because
		// we expect data to be written when the unload happens.
		if (isSafari) {
			this.applicationStorage?.close();
			this.profileStorageDatabase?.close();
			this.workspaceStorageDatabase?.close();
		}

		// Always dispose to ensure that no timeouts or callbacks
		// get triggered in this phase.
		this.dispose();
	}

	async clear(): Promise<void> {

		// Clear key/values
		for (const scope of [StorageScope.APPLICATION, StorageScope.PROFILE, StorageScope.WORKSPACE]) {
			for (const target of [StorageTarget.USER, StorageTarget.MACHINE]) {
				for (const key of this.keys(scope, target)) {
					this.remove(key, scope);
				}
			}

			await this.getStorage(scope)?.whenFlushed();
		}

		// Clear databases
		await Promises.settled([
			this.applicationStorageDatabase?.clear() ?? Promise.resolve(),
			this.profileStorageDatabase?.clear() ?? Promise.resolve(),
			this.workspaceStorageDatabase?.clear() ?? Promise.resolve()
		]);
	}

	hasScope(scope: IAnyWorkspaceIdentifier | IUserDataProfile): boolean {
		if (isUserDataProfile(scope)) {
			return this.profileStorageProfile.id === scope.id;
		}

		return this.workspace.id === scope.id;
	}
}

interface IIndexedDBStorageDatabase extends IStorageDatabase, IDisposable {

	/**
	 * Name of the database.
	 */
	readonly name: string;

	/**
	 * Whether an update in the DB is currently pending
	 * (either update or delete operation).
	 */
	readonly hasPendingUpdate: boolean;

	/**
	 * For testing only.
	 */
	clear(): Promise<void>;
}

class InMemoryIndexedDBStorageDatabase extends InMemoryStorageDatabase implements IIndexedDBStorageDatabase {

	readonly hasPendingUpdate = false;
	readonly name = 'in-memory-indexedb-storage';

	async clear(): Promise<void> {
		(await this.getItems()).clear();
	}

	dispose(): void {
		// No-op
	}
}

interface IndexedDBStorageDatabaseOptions {
	id: string;
	broadcastChanges?: boolean;
}

export class IndexedDBStorageDatabase extends Disposable implements IIndexedDBStorageDatabase {

	static async createApplicationStorage(logService: ILogService): Promise<IIndexedDBStorageDatabase> {
		return IndexedDBStorageDatabase.create({ id: 'global', broadcastChanges: true }, logService);
	}

	static async createProfileStorage(profile: IUserDataProfile, logService: ILogService): Promise<IIndexedDBStorageDatabase> {
		return IndexedDBStorageDatabase.create({ id: `global-${profile.id}`, broadcastChanges: true }, logService);
	}

	static async createWorkspaceStorage(workspaceId: string, logService: ILogService): Promise<IIndexedDBStorageDatabase> {
		return IndexedDBStorageDatabase.create({ id: workspaceId }, logService);
	}

	static async create(options: IndexedDBStorageDatabaseOptions, logService: ILogService): Promise<IIndexedDBStorageDatabase> {
		try {
			const database = new IndexedDBStorageDatabase(options, logService);
			await database.whenConnected;

			return database;
		} catch (error) {
			logService.error(`[IndexedDB Storage ${options.id}] create(): ${toErrorMessage(error, true)}`);

			return new InMemoryIndexedDBStorageDatabase();
		}
	}

	private static readonly STORAGE_DATABASE_PREFIX = 'vscode-web-state-db-';
	private static readonly STORAGE_OBJECT_STORE = 'ItemTable';

	private readonly _onDidChangeItemsExternal = this._register(new Emitter<IStorageItemsChangeEvent>());
	readonly onDidChangeItemsExternal = this._onDidChangeItemsExternal.event;

	private broadcastChannel: BroadcastDataChannel<IStorageItemsChangeEvent> | undefined;

	private pendingUpdate: Promise<boolean> | undefined = undefined;
	get hasPendingUpdate(): boolean { return !!this.pendingUpdate; }

	readonly name: string;
	private readonly whenConnected: Promise<IndexedDB>;

	private constructor(
		options: IndexedDBStorageDatabaseOptions,
		private readonly logService: ILogService
	) {
		super();

		this.name = `${IndexedDBStorageDatabase.STORAGE_DATABASE_PREFIX}${options.id}`;
		this.broadcastChannel = options.broadcastChanges ? this._register(new BroadcastDataChannel<IStorageItemsChangeEvent>(this.name)) : undefined;

		this.whenConnected = this.connect();

		this.registerListeners();
	}

	private registerListeners(): void {

		// Check for storage change events from other
		// windows/tabs via `BroadcastChannel` mechanisms.
		if (this.broadcastChannel) {
			this._register(this.broadcastChannel.onDidReceiveData(data => {
				if (isStorageItemsChangeEvent(data)) {
					this._onDidChangeItemsExternal.fire(data);
				}
			}));
		}
	}

	private async connect(): Promise<IndexedDB> {
		try {
			return await IndexedDB.create(this.name, undefined, [IndexedDBStorageDatabase.STORAGE_OBJECT_STORE]);
		} catch (error) {
			this.logService.error(`[IndexedDB Storage ${this.name}] connect() error: ${toErrorMessage(error)}`);

			throw error;
		}
	}

	async getItems(): Promise<Map<string, string>> {
		const db = await this.whenConnected;

		function isValid(value: unknown): value is string {
			return typeof value === 'string';
		}

		return db.getKeyValues<string>(IndexedDBStorageDatabase.STORAGE_OBJECT_STORE, isValid);
	}

	async updateItems(request: IUpdateRequest): Promise<void> {

		// Run the update
		let didUpdate = false;
		this.pendingUpdate = this.doUpdateItems(request);
		try {
			didUpdate = await this.pendingUpdate;
		} finally {
			this.pendingUpdate = undefined;
		}

		// Broadcast changes to other windows/tabs if enabled
		// and only if we actually did update storage items.
		if (this.broadcastChannel && didUpdate) {
			const event: IStorageItemsChangeEvent = {
				changed: request.insert,
				deleted: request.delete
			};

			this.broadcastChannel.postData(event);
		}
	}

	private async doUpdateItems(request: IUpdateRequest): Promise<boolean> {

		// Return early if the request is empty
		const toInsert = request.insert;
		const toDelete = request.delete;
		if ((!toInsert && !toDelete) || (toInsert?.size === 0 && toDelete?.size === 0)) {
			return false;
		}

		const db = await this.whenConnected;

		// Update `ItemTable` with inserts and/or deletes
		await db.runInTransaction(IndexedDBStorageDatabase.STORAGE_OBJECT_STORE, 'readwrite', objectStore => {
			const requests: IDBRequest[] = [];

			// Inserts
			if (toInsert) {
				for (const [key, value] of toInsert) {
					requests.push(objectStore.put(value, key));
				}
			}

			// Deletes
			if (toDelete) {
				for (const key of toDelete) {
					requests.push(objectStore.delete(key));
				}
			}

			return requests;
		});

		return true;
	}

	async optimize(): Promise<void> {
		// not suported in IndexedDB
	}

	async close(): Promise<void> {
		const db = await this.whenConnected;

		// Wait for pending updates to having finished
		await this.pendingUpdate;

		// Finally, close IndexedDB
		return db.close();
	}

	async clear(): Promise<void> {
		const db = await this.whenConnected;

		await db.runInTransaction(IndexedDBStorageDatabase.STORAGE_OBJECT_STORE, 'readwrite', objectStore => objectStore.clear());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/storage/electron-browser/storageService.ts]---
Location: vscode-main/src/vs/workbench/services/storage/electron-browser/storageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IMainProcessService } from '../../../../platform/ipc/common/mainProcessService.js';
import { RemoteStorageService } from '../../../../platform/storage/common/storageService.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IAnyWorkspaceIdentifier } from '../../../../platform/workspace/common/workspace.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';

export class NativeWorkbenchStorageService extends RemoteStorageService {

	constructor(
		workspace: IAnyWorkspaceIdentifier | undefined,
		private readonly userDataProfileService: IUserDataProfileService,
		userDataProfilesService: IUserDataProfilesService,
		mainProcessService: IMainProcessService,
		environmentService: IEnvironmentService
	) {
		super(workspace, { currentProfile: userDataProfileService.currentProfile, defaultProfile: userDataProfilesService.defaultProfile }, mainProcessService, environmentService);

		this.registerListeners();
	}

	private registerListeners(): void {
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(e => e.join(this.switchToProfile(e.profile))));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/storage/test/browser/storageService.test.ts]---
Location: vscode-main/src/vs/workbench/services/storage/test/browser/storageService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { strictEqual } from 'assert';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../../base/common/network.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { URI } from '../../../../../base/common/uri.js';
import { IStorageChangeEvent, Storage } from '../../../../../base/parts/storage/common/storage.js';
import { flakySuite } from '../../../../../base/test/common/testUtils.js';
import { runWithFakedTimers } from '../../../../../base/test/common/timeTravelScheduler.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { createSuite } from '../../../../../platform/storage/test/common/storageService.test.js';
import { IUserDataProfile } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { BrowserStorageService, IndexedDBStorageDatabase } from '../../browser/storageService.js';
import { UserDataProfileService } from '../../../userDataProfile/common/userDataProfileService.js';

async function createStorageService(): Promise<[DisposableStore, BrowserStorageService]> {
	const disposables = new DisposableStore();
	const logService = new NullLogService();

	const fileService = disposables.add(new FileService(logService));

	const userDataProvider = disposables.add(new InMemoryFileSystemProvider());
	disposables.add(fileService.registerProvider(Schemas.vscodeUserData, userDataProvider));

	const profilesRoot = URI.file('/profiles').with({ scheme: Schemas.inMemory });

	const inMemoryExtraProfileRoot = joinPath(profilesRoot, 'extra');
	const inMemoryExtraProfile: IUserDataProfile = {
		id: 'id',
		name: 'inMemory',
		isDefault: false,
		location: inMemoryExtraProfileRoot,
		globalStorageHome: joinPath(inMemoryExtraProfileRoot, 'globalStorageHome'),
		settingsResource: joinPath(inMemoryExtraProfileRoot, 'settingsResource'),
		keybindingsResource: joinPath(inMemoryExtraProfileRoot, 'keybindingsResource'),
		tasksResource: joinPath(inMemoryExtraProfileRoot, 'tasksResource'),
		mcpResource: joinPath(inMemoryExtraProfileRoot, 'mcp.json'),
		snippetsHome: joinPath(inMemoryExtraProfileRoot, 'snippetsHome'),
		promptsHome: joinPath(inMemoryExtraProfileRoot, 'promptsHome'),
		extensionsResource: joinPath(inMemoryExtraProfileRoot, 'extensionsResource'),
		cacheHome: joinPath(inMemoryExtraProfileRoot, 'cache')
	};

	const storageService = disposables.add(new BrowserStorageService({ id: 'workspace-storage-test' }, disposables.add(new UserDataProfileService(inMemoryExtraProfile)), logService));

	await storageService.initialize();

	return [disposables, storageService];
}

flakySuite('StorageService (browser)', function () {
	const disposables = new DisposableStore();
	let storageService: BrowserStorageService;

	createSuite<BrowserStorageService>({
		setup: async () => {
			const res = await createStorageService();
			disposables.add(res[0]);
			storageService = res[1];

			return storageService;
		},
		teardown: async () => {
			await storageService.clear();
			disposables.clear();
		}
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

flakySuite('StorageService (browser specific)', () => {
	const disposables = new DisposableStore();
	let storageService: BrowserStorageService;

	setup(async () => {
		const res = await createStorageService();
		disposables.add(res[0]);

		storageService = res[1];
	});

	teardown(async () => {
		await storageService.clear();
		disposables.clear();
	});

	test.skip('clear', () => { // slow test and also only ever being used as a developer action
		return runWithFakedTimers({ useFakeTimers: true }, async () => {
			storageService.store('bar', 'foo', StorageScope.APPLICATION, StorageTarget.MACHINE);
			storageService.store('bar', 3, StorageScope.APPLICATION, StorageTarget.USER);
			storageService.store('bar', 'foo', StorageScope.PROFILE, StorageTarget.MACHINE);
			storageService.store('bar', 3, StorageScope.PROFILE, StorageTarget.USER);
			storageService.store('bar', 'foo', StorageScope.WORKSPACE, StorageTarget.MACHINE);
			storageService.store('bar', 3, StorageScope.WORKSPACE, StorageTarget.USER);

			await storageService.clear();

			for (const scope of [StorageScope.APPLICATION, StorageScope.PROFILE, StorageScope.WORKSPACE]) {
				for (const target of [StorageTarget.USER, StorageTarget.MACHINE]) {
					strictEqual(storageService.get('bar', scope), undefined);
					strictEqual(storageService.keys(scope, target).length, 0);
				}
			}
		});
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});

flakySuite('IndexDBStorageDatabase (browser)', () => {

	const id = 'workspace-storage-db-test';
	const logService = new NullLogService();

	const disposables = new DisposableStore();

	teardown(async () => {
		const storage = disposables.add(await IndexedDBStorageDatabase.create({ id }, logService));
		await storage.clear();

		disposables.clear();
	});

	test('Basics', async () => {
		let storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		// Insert initial data
		storage.set('bar', 'foo');
		storage.set('barNumber', 55);
		storage.set('barBoolean', true);
		storage.set('barUndefined', undefined);
		storage.set('barNull', null);

		strictEqual(storage.get('bar'), 'foo');
		strictEqual(storage.get('barNumber'), '55');
		strictEqual(storage.get('barBoolean'), 'true');
		strictEqual(storage.get('barUndefined'), undefined);
		strictEqual(storage.get('barNull'), undefined);

		strictEqual(storage.size, 3);
		strictEqual(storage.items.size, 3);

		await storage.close();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		// Check initial data still there
		strictEqual(storage.get('bar'), 'foo');
		strictEqual(storage.get('barNumber'), '55');
		strictEqual(storage.get('barBoolean'), 'true');
		strictEqual(storage.get('barUndefined'), undefined);
		strictEqual(storage.get('barNull'), undefined);

		strictEqual(storage.size, 3);
		strictEqual(storage.items.size, 3);

		// Update data
		storage.set('bar', 'foo2');
		storage.set('barNumber', 552);

		strictEqual(storage.get('bar'), 'foo2');
		strictEqual(storage.get('barNumber'), '552');

		await storage.close();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		// Check initial data still there
		strictEqual(storage.get('bar'), 'foo2');
		strictEqual(storage.get('barNumber'), '552');
		strictEqual(storage.get('barBoolean'), 'true');
		strictEqual(storage.get('barUndefined'), undefined);
		strictEqual(storage.get('barNull'), undefined);

		strictEqual(storage.size, 3);
		strictEqual(storage.items.size, 3);

		// Delete data
		storage.delete('bar');
		storage.delete('barNumber');
		storage.delete('barBoolean');

		strictEqual(storage.get('bar', 'undefined'), 'undefined');
		strictEqual(storage.get('barNumber', 'undefinedNumber'), 'undefinedNumber');
		strictEqual(storage.get('barBoolean', 'undefinedBoolean'), 'undefinedBoolean');

		strictEqual(storage.size, 0);
		strictEqual(storage.items.size, 0);

		await storage.close();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		strictEqual(storage.get('bar', 'undefined'), 'undefined');
		strictEqual(storage.get('barNumber', 'undefinedNumber'), 'undefinedNumber');
		strictEqual(storage.get('barBoolean', 'undefinedBoolean'), 'undefinedBoolean');

		strictEqual(storage.size, 0);
		strictEqual(storage.items.size, 0);
	});

	test('Clear', async () => {
		let storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		storage.set('bar', 'foo');
		storage.set('barNumber', 55);
		storage.set('barBoolean', true);

		await storage.close();

		const db = disposables.add(await IndexedDBStorageDatabase.create({ id }, logService));
		storage = disposables.add(new Storage(db));

		await storage.init();
		await db.clear();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		strictEqual(storage.get('bar'), undefined);
		strictEqual(storage.get('barNumber'), undefined);
		strictEqual(storage.get('barBoolean'), undefined);

		strictEqual(storage.size, 0);
		strictEqual(storage.items.size, 0);
	});

	test('Inserts and Deletes at the same time', async () => {
		let storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		storage.set('bar', 'foo');
		storage.set('barNumber', 55);
		storage.set('barBoolean', true);

		await storage.close();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		storage.set('bar', 'foobar');
		const largeItem = JSON.stringify({ largeItem: 'Hello World'.repeat(1000) });
		storage.set('largeItem', largeItem);
		storage.delete('barNumber');
		storage.delete('barBoolean');

		await storage.close();

		storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));

		await storage.init();

		strictEqual(storage.get('bar'), 'foobar');
		strictEqual(storage.get('largeItem'), largeItem);
		strictEqual(storage.get('barNumber'), undefined);
		strictEqual(storage.get('barBoolean'), undefined);
	});

	test('Storage change event', async () => {
		const storage = disposables.add(new Storage(disposables.add(await IndexedDBStorageDatabase.create({ id }, logService))));
		let storageChangeEvents: IStorageChangeEvent[] = [];
		disposables.add(storage.onDidChangeStorage(e => storageChangeEvents.push(e)));

		await storage.init();

		storage.set('notExternal', 42);
		let storageValueChangeEvent = storageChangeEvents.find(e => e.key === 'notExternal');
		strictEqual(storageValueChangeEvent?.external, false);
		storageChangeEvents = [];

		storage.set('isExternal', 42, true);
		storageValueChangeEvent = storageChangeEvents.find(e => e.key === 'isExternal');
		strictEqual(storageValueChangeEvent?.external, true);

		storage.delete('notExternal');
		storageValueChangeEvent = storageChangeEvents.find(e => e.key === 'notExternal');
		strictEqual(storageValueChangeEvent?.external, false);

		storage.delete('isExternal', true);
		storageValueChangeEvent = storageChangeEvents.find(e => e.key === 'isExternal');
		strictEqual(storageValueChangeEvent?.external, true);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/simpleCompletionItem.ts]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/simpleCompletionItem.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FuzzyScore } from '../../../../base/common/filters.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export interface CompletionItemLabel {
	label: string;
	detail?: string;
	description?: string;
}

export interface ISimpleCompletion {
	/**
	 * The completion's label which appears on the left beside the icon.
	 */
	label: string | CompletionItemLabel;

	/**
	 * The ID of the provider the completion item came from
	 */
	provider: string;

	/**
	 * The completion's icon to show on the left of the suggest widget.
	 */
	icon?: ThemeIcon;

	/**
	 * The completion item's kind that will be included in the aria label.
	 */
	kindLabel?: string;

	/**
	 * The completion's detail which appears on the right of the list.
	 */
	detail?: string;

	/**
	 * A human-readable string that represents a doc-comment.
	 */
	documentation?: string | IMarkdownString;

	/**
	 * Replacement range (inclusive start, exclusive end) of text in the line to be replaced when
	 * this completion is applied.
	 */
	replacementRange: readonly [number, number] | undefined;
}

export class SimpleCompletionItem {
	/**
	 * The lowercase label, normalized to `\` path separators on Windows.
	 */
	labelLow: string;
	textLabel: string;

	// sorting, filtering
	score: FuzzyScore = FuzzyScore.Default;
	idx?: number;
	word?: string;

	// validation
	isInvalid: boolean = false;

	constructor(
		readonly completion: ISimpleCompletion
	) {
		// ensure lower-variants (perf)
		this.textLabel = typeof completion.label === 'string'
			? completion.label
			: completion.label?.label;
		this.labelLow = this.textLabel.toLowerCase();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/simpleCompletionModel.ts]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/simpleCompletionModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { SimpleCompletionItem } from './simpleCompletionItem.js';
import { quickSelect } from '../../../../base/common/arrays.js';
import { CharCode } from '../../../../base/common/charCode.js';
import { FuzzyScore, fuzzyScore, fuzzyScoreGracefulAggressive, FuzzyScoreOptions, FuzzyScorer } from '../../../../base/common/filters.js';

export interface ISimpleCompletionStats {
	pLabelLen: number;
}

export class LineContext {
	constructor(
		readonly leadingLineContent: string,
		readonly characterCountDelta: number,
	) { }
}

const enum Refilter {
	Nothing = 0,
	All = 1,
	Incr = 2
}

export class SimpleCompletionModel<T extends SimpleCompletionItem> {
	private _stats?: ISimpleCompletionStats;
	private _filteredItems?: T[];
	private _refilterKind: Refilter = Refilter.All;
	private _fuzzyScoreOptions: FuzzyScoreOptions | undefined = {
		...FuzzyScoreOptions.default,
		firstMatchCanBeWeak: true
	};

	// TODO: Pass in options
	private _options: {
		filterGraceful?: boolean;
	} = {};

	constructor(
		private readonly _items: T[],
		private _lineContext: LineContext,
		private readonly _rawCompareFn?: (leadingLineContent: string, a: T, b: T) => number,
	) {
	}

	get items(): T[] {
		this._ensureCachedState();
		return this._filteredItems!;
	}

	get stats(): ISimpleCompletionStats {
		this._ensureCachedState();
		return this._stats!;
	}


	get lineContext(): LineContext {
		return this._lineContext;
	}

	set lineContext(value: LineContext) {
		if (this._lineContext.leadingLineContent !== value.leadingLineContent
			|| this._lineContext.characterCountDelta !== value.characterCountDelta
		) {
			this._refilterKind = this._lineContext.characterCountDelta < value.characterCountDelta && this._filteredItems ? Refilter.Incr : Refilter.All;
			this._lineContext = value;
		}
	}

	forceRefilterAll() {
		this._refilterKind = Refilter.All;
	}

	private _ensureCachedState(): void {
		if (this._refilterKind !== Refilter.Nothing) {
			this._createCachedState();
		}
	}
	private _createCachedState(): void {

		// this._providerInfo = new Map();

		const labelLengths: number[] = [];

		const { leadingLineContent, characterCountDelta } = this._lineContext;
		let word = '';
		let wordLow = '';

		// incrementally filter less
		const source = this._refilterKind === Refilter.All ? this._items : this._filteredItems!;
		const target: T[] = [];

		// picks a score function based on the number of
		// items that we have to score/filter and based on the
		// user-configuration
		const scoreFn: FuzzyScorer = (!this._options.filterGraceful || source.length > 2000) ? fuzzyScore : fuzzyScoreGracefulAggressive;

		for (let i = 0; i < source.length; i++) {

			const item = source[i];

			if (item.isInvalid) {
				continue; // SKIP invalid items
			}

			// collect all support, know if their result is incomplete
			// this._providerInfo.set(item.provider, Boolean(item.container.incomplete));

			// 'word' is that remainder of the current line that we
			// filter and score against. In theory each suggestion uses a
			// different word, but in practice not - that's why we cache

			const overwriteBefore = item.completion.replacementRange ? (item.completion.replacementRange[1] - item.completion.replacementRange[0]) : 0;
			const wordLen = overwriteBefore + characterCountDelta;
			if (word.length !== wordLen) {
				word = wordLen === 0 ? '' : leadingLineContent.slice(-wordLen);
				wordLow = word.toLowerCase();
			}

			// remember the word against which this item was
			// scored. If word is undefined, then match against the empty string.
			item.word = word;
			if (wordLen === 0) {
				// when there is nothing to score against, don't
				// event try to do. Use a const rank and rely on
				// the fallback-sort using the initial sort order.
				// use a score of `-100` because that is out of the
				// bound of values `fuzzyScore` will return
				item.score = FuzzyScore.Default;

			} else {
				// skip word characters that are whitespace until
				// we have hit the replace range (overwriteBefore)
				let wordPos = 0;
				while (wordPos < overwriteBefore) {
					const ch = word.charCodeAt(wordPos);
					if (ch === CharCode.Space || ch === CharCode.Tab) {
						wordPos += 1;
					} else {
						break;
					}
				}

				if (wordPos >= wordLen) {
					// the wordPos at which scoring starts is the whole word
					// and therefore the same rules as not having a word apply
					item.score = FuzzyScore.Default;

					// } else if (typeof item.completion.filterText === 'string') {
					// 	// when there is a `filterText` it must match the `word`.
					// 	// if it matches we check with the label to compute highlights
					// 	// and if that doesn't yield a result we have no highlights,
					// 	// despite having the match
					// 	const match = scoreFn(word, wordLow, wordPos, item.completion.filterText, item.filterTextLow!, 0, this._fuzzyScoreOptions);
					// 	if (!match) {
					// 		continue; // NO match
					// 	}
					// 	if (compareIgnoreCase(item.completion.filterText, item.textLabel) === 0) {
					// 		// filterText and label are actually the same -> use good highlights
					// 		item.score = match;
					// 	} else {
					// 		// re-run the scorer on the label in the hope of a result BUT use the rank
					// 		// of the filterText-match
					// 		item.score = anyScore(word, wordLow, wordPos, item.textLabel, item.labelLow, 0);
					// 		item.score[0] = match[0]; // use score from filterText
					// 	}

				} else {
					// by default match `word` against the `label`
					const match = scoreFn(word, wordLow, wordPos, item.textLabel, item.labelLow, 0, this._fuzzyScoreOptions);
					if (!match && word !== '') {
						continue; // NO match
					}
					// Use default sorting when word is empty
					item.score = match || FuzzyScore.Default;
				}
			}
			item.idx = i;
			target.push(item);

			// update stats
			labelLengths.push(item.textLabel.length);
		}

		this._filteredItems = target.sort(this._rawCompareFn?.bind(undefined, leadingLineContent));
		this._refilterKind = Refilter.Nothing;

		this._stats = {
			pLabelLen: labelLengths.length ?
				quickSelect(labelLengths.length - .85, labelLengths, (a, b) => a - b)
				: 0
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/simpleSuggestWidget.ts]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/simpleSuggestWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/suggest.css';
import * as dom from '../../../../base/browser/dom.js';
import { IListEvent, IListGestureEvent, IListMouseEvent } from '../../../../base/browser/ui/list/list.js';
import { IListStyles, List } from '../../../../base/browser/ui/list/listWidget.js';
import { ResizableHTMLElement } from '../../../../base/browser/ui/resizable/resizable.js';
import { SimpleCompletionItem } from './simpleCompletionItem.js';
import { LineContext, SimpleCompletionModel } from './simpleCompletionModel.js';
import { getAriaId, SimpleSuggestWidgetItemRenderer, type ISimpleSuggestWidgetFontInfo } from './simpleSuggestWidgetRenderer.js';
import { CancelablePromise, createCancelablePromise, disposableTimeout, TimeoutTimer } from '../../../../base/common/async.js';
import { Emitter, Event, PauseableEmitter } from '../../../../base/common/event.js';
import { MutableDisposable, Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { clamp } from '../../../../base/common/numbers.js';
import { localize } from '../../../../nls.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { SuggestWidgetStatus } from '../../../../editor/contrib/suggest/browser/suggestWidgetStatus.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { canExpandCompletionItem, SimpleSuggestDetailsOverlay, SimpleSuggestDetailsWidget, type SimpleSuggestDetailsPlacement } from './simpleSuggestWidgetDetails.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import * as strings from '../../../../base/common/strings.js';
import { status } from '../../../../base/browser/ui/aria/aria.js';
import { isWindows } from '../../../../base/common/platform.js';
import { editorSuggestWidgetForeground, editorSuggestWidgetSelectedBackground } from '../../../../editor/contrib/suggest/browser/suggestWidget.js';
import { getListStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { activeContrastBorder, focusBorder } from '../../../../platform/theme/common/colorRegistry.js';

const $ = dom.$;

const enum State {
	Hidden,
	Loading,
	Empty,
	Open,
	Frozen,
	Details
}

export interface ISimpleSelectedSuggestion<T extends SimpleCompletionItem> {
	item: T;
	index: number;
	model: SimpleCompletionModel<T>;
}

interface IPersistedWidgetSizeDelegate {
	restore(): dom.Dimension | undefined;
	store(size: dom.Dimension): void;
	reset(): void;
}

const enum WidgetPositionPreference {
	Above,
	Below
}

export const SimpleSuggestContext = {
	HasFocusedSuggestion: new RawContextKey<boolean>('simpleSuggestWidgetHasFocusedSuggestion', false, localize('simpleSuggestWidgetHasFocusedSuggestion', "Whether any simple suggestion is focused")),
	HasNavigated: new RawContextKey<boolean>('simpleSuggestWidgetHasNavigated', false, localize('simpleSuggestWidgetHasNavigated', "Whether the simple suggestion widget has been navigated downwards")),
	FirstSuggestionFocused: new RawContextKey<boolean>('simpleSuggestWidgetFirstSuggestionFocused', false, localize('simpleSuggestWidgetFirstSuggestionFocused', "Whether the first simple suggestion is focused")),
};

export interface IWorkbenchSuggestWidgetOptions {
	/**
	 * The {@link MenuId} to use for the status bar. Items on the menu must use the groups `'left'`
	 * and `'right'`.
	 */
	statusBarMenuId?: MenuId;

	/**
	 * The setting for showing the status bar.
	 */
	showStatusBarSettingId?: string;

	/**
	 * The setting for selection mode.
	 */
	selectionModeSettingId?: string;

	/**
	 * Disables specific detail placements when positioning the details overlay.
	 */
	preventDetailsPlacements?: readonly SimpleSuggestDetailsPlacement[];
}

/**
 * Controls how suggest selection works
*/
export const enum SuggestSelectionMode {
	/**
	 * Default. Will show a border and only accept via Tab until navigation has occurred. After that, it will show selection and accept via Enter or Tab.
	 */
	Partial = 'partial',
	/**
	 * Always select, what enter does depends on runOnEnter.
	 */
	Always = 'always',
	/**
	 * User needs to press down to select.
	 */
	Never = 'never'
}

const enum Classes {
	PartialSelection = 'partial-selection',
}

export class SimpleSuggestWidget<TModel extends SimpleCompletionModel<TItem>, TItem extends SimpleCompletionItem> extends Disposable {

	private static LOADING_MESSAGE: string = localize('suggestWidget.loading', "Loading...");
	private static NO_SUGGESTIONS_MESSAGE: string = localize('suggestWidget.noSuggestions', "No suggestions.");

	private _state: State = State.Hidden;
	private _explicitlyInvoked: boolean = false;
	private _loadingTimeout?: IDisposable;
	private _completionModel?: TModel;
	private _cappedHeight?: { wanted: number; capped: number };
	private _forceRenderingAbove: boolean = false;
	private _explainMode: boolean = false;

	private _preference?: WidgetPositionPreference;
	private readonly _pendingShowDetails = this._register(new MutableDisposable());
	private readonly _pendingLayout = this._register(new MutableDisposable());
	private _currentSuggestionDetails?: CancelablePromise<void>;
	private _focusedItem?: TItem;
	private _ignoreFocusEvents: boolean = false;
	readonly element: ResizableHTMLElement;
	private readonly _messageElement: HTMLElement;
	private readonly _listElement: HTMLElement;
	private readonly _list: List<TItem>;
	private _status?: SuggestWidgetStatus;
	private readonly _details: SimpleSuggestDetailsOverlay;

	private readonly _showTimeout = this._register(new TimeoutTimer());

	private readonly _onDidSelect = this._register(new Emitter<ISimpleSelectedSuggestion<TItem>>());
	readonly onDidSelect: Event<ISimpleSelectedSuggestion<TItem>> = this._onDidSelect.event;
	private readonly _onDidHide = this._register(new Emitter<this>());
	readonly onDidHide: Event<this> = this._onDidHide.event;
	private readonly _onDidShow = this._register(new Emitter<this>());
	readonly onDidShow: Event<this> = this._onDidShow.event;
	private readonly _onDidFocus = new PauseableEmitter<ISimpleSelectedSuggestion<TItem>>();
	readonly onDidFocus: Event<ISimpleSelectedSuggestion<TItem>> = this._onDidFocus.event;
	private readonly _onDidBlurDetails = this._register(new Emitter<FocusEvent>());
	readonly onDidBlurDetails = this._onDidBlurDetails.event;

	get list(): List<TItem> { return this._list; }

	private readonly _ctxSuggestWidgetHasFocusedSuggestion: IContextKey<boolean>;
	private readonly _ctxSuggestWidgetHasBeenNavigated: IContextKey<boolean>;
	private readonly _ctxFirstSuggestionFocused: IContextKey<boolean>;

	constructor(
		private readonly _container: HTMLElement,
		private readonly _persistedSize: IPersistedWidgetSizeDelegate,
		private readonly _options: IWorkbenchSuggestWidgetOptions,
		private readonly _getFontInfo: () => ISimpleSuggestWidgetFontInfo,
		private readonly _onDidFontConfigurationChange: Event<void>,
		private readonly _getAdvancedExplainModeDetails: () => string | undefined,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService _contextKeyService: IContextKeyService
	) {
		super();

		this.element = this._register(new ResizableHTMLElement());
		this.element.domNode.classList.add('workbench-suggest-widget');
		this._container.appendChild(this.element.domNode);
		this._ctxSuggestWidgetHasFocusedSuggestion = SimpleSuggestContext.HasFocusedSuggestion.bindTo(_contextKeyService);
		this._ctxSuggestWidgetHasBeenNavigated = SimpleSuggestContext.HasNavigated.bindTo(_contextKeyService);
		this._ctxFirstSuggestionFocused = SimpleSuggestContext.FirstSuggestionFocused.bindTo(_contextKeyService);

		class ResizeState {
			constructor(
				readonly persistedSize: dom.Dimension | undefined,
				readonly currentSize: dom.Dimension,
				public persistHeight = false,
				public persistWidth = false,
			) { }
		}

		let state: ResizeState | undefined;
		this._register(this.element.onDidWillResize(() => {
			// this._preferenceLocked = true;
			state = new ResizeState(this._persistedSize.restore(), this.element.size);
		}));
		this._register(this.element.onDidResize(e => {

			this._resize(e.dimension.width, e.dimension.height);

			if (state) {
				state.persistHeight = state.persistHeight || !!e.north || !!e.south;
				state.persistWidth = state.persistWidth || !!e.east || !!e.west;
			}

			if (!e.done) {
				return;
			}

			if (state) {
				// only store width or height value that have changed and also
				// only store changes that are above a certain threshold
				const { itemHeight, defaultSize } = this._getLayoutInfo();
				const threshold = Math.round(itemHeight / 2);
				let { width, height } = this.element.size;
				if (!state.persistHeight || Math.abs(state.currentSize.height - height) <= threshold) {
					height = state.persistedSize?.height ?? defaultSize.height;
				}
				if (!state.persistWidth || Math.abs(state.currentSize.width - width) <= threshold) {
					width = state.persistedSize?.width ?? defaultSize.width;
				}
				this._persistedSize.store(new dom.Dimension(width, height));
			}

			// reset working state
			// this._preferenceLocked = false;
			state = undefined;
		}));

		const applyIconStyle = () => this.element.domNode.classList.toggle('no-icons', !_configurationService.getValue('editor.suggest.showIcons'));
		applyIconStyle();

		const renderer = this._instantiationService.createInstance(SimpleSuggestWidgetItemRenderer, this._getFontInfo.bind(this), this._onDidFontConfigurationChange.bind(this));
		this._register(renderer);
		this._listElement = dom.append(this.element.domNode, $('.tree'));
		this._list = this._register(new List<TItem>('SuggestWidget', this._listElement, {
			getHeight: (): number => this._getLayoutInfo().itemHeight,
			getTemplateId: (): string => 'suggestion'
		}, [renderer], {
			alwaysConsumeMouseWheel: true,
			useShadows: false,
			mouseSupport: false,
			multipleSelectionSupport: false,
			accessibilityProvider: {
				getRole: () => isWindows ? 'listitem' : 'option',
				getWidgetAriaLabel: () => localize('suggest', "Suggest"),
				getWidgetRole: () => 'listbox',
				getAriaLabel: (item: SimpleCompletionItem) => {
					let label = item.textLabel;
					const kindLabel = item.completion.kindLabel ?? '';
					if (typeof item.completion.label !== 'string') {
						const { detail, description } = item.completion.label;
						if (detail && description) {
							label = localize('label.full', '{0}{1}, {2} {3}', label, detail, description, kindLabel);
						} else if (detail) {
							label = localize('label.detail', '{0}{1} {2}', label, detail, kindLabel);
						} else if (description) {
							label = localize('label.desc', '{0}, {1} {2}', label, description, kindLabel);
						}
					} else {
						label = localize('label', '{0}, {1}', label, kindLabel);
					}
					const { documentation, detail } = item.completion;
					const docs = strings.format(
						'{0}{1}',
						detail || '',
						documentation ? (typeof documentation === 'string' ? documentation : documentation.value) : '');

					return localize('ariaCurrenttSuggestionReadDetails', "{0}, docs: {1}", label, docs);
				},
			}
		}));
		this._register(this._list.onDidChangeFocus(e => {
			if (e.indexes.length && e.indexes[0] !== 0) {
				this._ctxSuggestWidgetHasBeenNavigated.set(true);
			}
		}));
		this._messageElement = dom.append(this.element.domNode, dom.$('.message'));

		const details: SimpleSuggestDetailsWidget = this._register(_instantiationService.createInstance(SimpleSuggestDetailsWidget, this._getFontInfo.bind(this), this._onDidFontConfigurationChange.bind(this), this._getAdvancedExplainModeDetails.bind(this)));
		this._register(details.onDidClose(() => this.toggleDetails()));
		this._details = this._register(new SimpleSuggestDetailsOverlay(details, this._listElement, this._options.preventDetailsPlacements));
		this._register(dom.addDisposableListener(this._details.widget.domNode, 'blur', (e) => this._onDidBlurDetails.fire(e)));

		if (_options.statusBarMenuId && _options.showStatusBarSettingId && _configurationService.getValue(_options.showStatusBarSettingId)) {
			this._status = this._register(_instantiationService.createInstance(SuggestWidgetStatus, this.element.domNode, _options.statusBarMenuId));
			this.element.domNode.classList.toggle('with-status-bar', true);
		}

		this._register(this._list.onMouseDown(e => this._onListMouseDownOrTap(e)));
		this._register(this._list.onTap(e => this._onListMouseDownOrTap(e)));
		this._register(this._list.onDidChangeFocus(e => this._onListFocus(e)));
		this._register(this._list.onDidChangeSelection(e => this._onListSelection(e)));
		this._register(this._onDidFontConfigurationChange(() => {
			if (this._completionModel) {
				this._list.splice(0, this._completionModel.items.length, this._completionModel!.items);
			}
		}));
		this._register(_configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor.suggest.showIcons')) {
				applyIconStyle();
			}
			if (_options.statusBarMenuId && _options.showStatusBarSettingId && e.affectsConfiguration(_options.showStatusBarSettingId)) {
				const showStatusBar: boolean = _configurationService.getValue(_options.showStatusBarSettingId);
				if (showStatusBar && !this._status) {
					this._status = this._register(_instantiationService.createInstance(SuggestWidgetStatus, this.element.domNode, _options.statusBarMenuId));
					this._status.show();
				} else if (showStatusBar && this._status) {
					this._status.show();
				} else if (this._status) {
					this._status.element.remove();
					this._status.dispose();
					this._status = undefined;
					this._layout(undefined);
				}
				this.element.domNode.classList.toggle('with-status-bar', showStatusBar);
			}
		}));
	}

	private _onListFocus(e: IListEvent<TItem>): void {
		if (this._ignoreFocusEvents) {
			return;
		}

		if (this._state === State.Details) {
			// This can happen when focus is in the details-panel and when
			// arrow keys are pressed to select next/prev items
			this._setState(State.Open);
		}

		if (!e.elements.length) {
			if (this._currentSuggestionDetails) {
				this._currentSuggestionDetails.cancel();
				this._currentSuggestionDetails = undefined;
				this._focusedItem = undefined;
				this._ctxSuggestWidgetHasFocusedSuggestion.set(false);
			}
			this._clearAriaActiveDescendant();
			return;
		}

		if (!this._completionModel) {
			return;
		}

		this._ctxSuggestWidgetHasFocusedSuggestion.set(true);
		const item = e.elements[0];
		const index = e.indexes[0];

		if (item !== this._focusedItem) {

			this._currentSuggestionDetails?.cancel();
			this._currentSuggestionDetails = undefined;

			this._focusedItem = item;

			this._list.reveal(index);

			const id = getAriaId(index);
			const node = dom.getActiveWindow().document.activeElement;
			if (node && id) {
				node.setAttribute('aria-haspopup', 'true');
				node.setAttribute('aria-autocomplete', 'list');
				node.setAttribute('aria-activedescendant', id);
			} else {
				this._clearAriaActiveDescendant();
			}

			this._currentSuggestionDetails = createCancelablePromise(async token => {
				const loading = disposableTimeout(() => {
					if (this._isDetailsVisible()) {
						this._showDetails(true, false);
					}
				}, 250);
				const sub = token.onCancellationRequested(() => loading.dispose());
				try {
					return await Promise.resolve();
				} finally {
					loading.dispose();
					sub.dispose();
				}
			});

			this._currentSuggestionDetails.then(() => {
				if (index >= this._list.length || item !== this._list.element(index)) {
					return;
				}

				// item can have extra information, so re-render
				this._ignoreFocusEvents = true;
				this._list.splice(index, 1, [item]);
				this._list.setFocus([index]);
				this._ignoreFocusEvents = false;

				if (this._isDetailsVisible()) {
					this._showDetails(false, false);
				} else {
					this.element.domNode.classList.remove('docs-side');
				}

			}).catch();
		}

		this._ctxFirstSuggestionFocused.set(index === 0);
		// emit an event
		this._onDidFocus.fire({ item, index, model: this._completionModel });
	}

	private _clearAriaActiveDescendant(): void {
		const node = dom.getActiveWindow().document.activeElement;
		if (!node) {
			return;
		}
		node.setAttribute('aria-haspopup', 'false');
		node.setAttribute('aria-autocomplete', 'both');
		node.removeAttribute('aria-activedescendant');
	}

	private _cursorPosition?: { top: number; left: number; height: number };

	setCompletionModel(completionModel: TModel) {
		this._completionModel = completionModel;
	}

	hasCompletions(): boolean {
		return this._completionModel?.items.length !== 0;
	}

	resetWidgetSize(): void {
		this._persistedSize.reset();
	}

	relayout(cursorPosition: { top: number; left: number; height: number }): void {
		if (this._state === State.Hidden) {
			return;
		}
		this._cursorPosition = cursorPosition;
		this._layout(this.element.size);
		this._afterRender();
	}

	showTriggered(explicitlyInvoked: boolean, cursorPosition: { top: number; left: number; height: number }) {
		if (this._state !== State.Hidden) {
			return;
		}
		this._cursorPosition = cursorPosition;
		this._explicitlyInvoked = !!explicitlyInvoked;

		if (this._explicitlyInvoked) {
			this._loadingTimeout = disposableTimeout(() => this._setState(State.Loading), 250);
		}
	}

	showSuggestions(selectionIndex: number, isFrozen: boolean, isAuto: boolean, cursorPosition: { top: number; left: number; height: number }): void {
		this._cursorPosition = cursorPosition;

		this._loadingTimeout?.dispose();

		const selectionMode = this._options?.selectionModeSettingId ? this._configurationService.getValue<SuggestSelectionMode>(this._options.selectionModeSettingId) : undefined;
		const noFocus = selectionMode === SuggestSelectionMode.Never;

		// this._currentSuggestionDetails?.cancel();
		// this._currentSuggestionDetails = undefined;

		if (isFrozen && this._state !== State.Empty && this._state !== State.Hidden) {
			this._setState(State.Frozen);
			return;
		}

		const visibleCount = this._completionModel?.items.length ?? 0;
		const isEmpty = visibleCount === 0;
		// this._ctxSuggestWidgetMultipleSuggestions.set(visibleCount > 1);

		if (isEmpty) {
			this._setState(isAuto ? State.Hidden : State.Empty);
			this._completionModel = undefined;
			return;
		}

		// this._focusedItem = undefined;

		// calling list.splice triggers focus event which this widget forwards. That can lead to
		// suggestions being cancelled and the widget being cleared (and hidden). All this happens
		// before revealing and focusing is done which means revealing and focusing will fail when
		// they get run.
		// this._onDidFocus.pause();
		// this._onDidSelect.pause();
		try {
			this._list.splice(0, this._list.length, this._completionModel?.items ?? []);
			this._setState(isFrozen ? State.Frozen : State.Open);
			this._list.reveal(selectionIndex, 0);
			this._list.setFocus(noFocus ? [] : [selectionIndex]);
		} finally {
			// this._onDidFocus.resume();
			// this._onDidSelect.resume();
		}

		this._pendingLayout.value = dom.runAtThisOrScheduleAtNextAnimationFrame(dom.getWindow(this.element.domNode), () => {
			this._pendingLayout.clear();
			this._layout(this.element.size);
			// Reset focus border
			// this._details.widget.domNode.classList.remove('focused');
		});
		this._updateListStyles();
		this._afterRender();
	}

	private _updateListStyles(): void {
		if (this._options.selectionModeSettingId) {
			const selectionMode = this._configurationService.getValue<SuggestSelectionMode>(this._options.selectionModeSettingId);
			this._list.style(getListStylesWithMode(selectionMode === SuggestSelectionMode.Partial));
			this.element.domNode.classList.toggle(Classes.PartialSelection, selectionMode === SuggestSelectionMode.Partial);
		}
	}

	setLineContext(lineContext: LineContext): void {
		if (this._completionModel) {
			this._completionModel.lineContext = lineContext;
		}
	}

	private _setState(state: State): void {
		if (this._state === state) {
			return;
		}
		this._state = state;

		this.element.domNode.classList.toggle('frozen', state === State.Frozen);
		this.element.domNode.classList.remove('message');

		switch (state) {
			case State.Hidden:
				if (this._status) {
					dom.hide(this._status.element);
				}
				dom.hide(this._listElement);
				dom.hide(this._messageElement);
				dom.hide(this.element.domNode);
				this._details.hide(true);
				this._status?.hide();
				// this._contentWidget.hide();
				// this._ctxSuggestWidgetVisible.reset();
				// this._ctxSuggestWidgetMultipleSuggestions.reset();
				this._ctxSuggestWidgetHasFocusedSuggestion.reset();
				this._showTimeout.cancel();
				this.element.domNode.classList.remove('visible');
				this._list.splice(0, this._list.length);
				this._focusedItem = undefined;
				this._cappedHeight = undefined;
				this._explainMode = false;
				break;
			case State.Loading:
				this.element.domNode.classList.add('message');
				this._messageElement.textContent = SimpleSuggestWidget.LOADING_MESSAGE;
				dom.hide(this._listElement);
				if (this._status) {
					dom.hide(this._status.element);
				}
				dom.show(this._messageElement);
				this._details.hide();
				this._show();
				this._focusedItem = undefined;
				status(SimpleSuggestWidget.LOADING_MESSAGE);
				break;
			case State.Empty:
				this.element.domNode.classList.add('message');
				this._messageElement.textContent = SimpleSuggestWidget.NO_SUGGESTIONS_MESSAGE;
				dom.hide(this._listElement);
				if (this._status) {
					dom.hide(this._status.element);
				}
				dom.show(this._messageElement);
				this._details.hide();
				this._show();
				this._focusedItem = undefined;
				status(SimpleSuggestWidget.NO_SUGGESTIONS_MESSAGE);
				break;
			case State.Open:
				dom.hide(this._messageElement);
				this._showListAndStatus();
				this._show();
				break;
			case State.Frozen:
				dom.hide(this._messageElement);
				this._showListAndStatus();
				this._show();
				break;
			case State.Details:
				dom.hide(this._messageElement);
				this._showListAndStatus();
				this._details.show();
				this._show();
				break;
		}
	}

	private _showListAndStatus(): void {
		if (this._status) {
			dom.show(this._listElement, this._status.element);
		} else {
			dom.show(this._listElement);
		}
	}

	private _show(): void {
		// this._layout(this._persistedSize.restore());
		// dom.show(this.element.domNode);
		// this._onDidShow.fire();


		this._status?.show();
		// this._contentWidget.show();
		dom.show(this.element.domNode);
		this._layout(this._persistedSize.restore());
		// this._ctxSuggestWidgetVisible.set(true);

		this._onDidShow.fire(this);
		this._showTimeout.cancelAndSet(() => {
			this.element.domNode.classList.add('visible');
		}, 100);
	}


	toggleDetailsFocus(): void {
		if (this._state === State.Details) {
			// Should return the focus to the list item.
			this._list.setFocus(this._list.getFocus());
			this._setState(State.Open);
		} else if (this._state === State.Open) {
			this._setState(State.Details);
			if (!this._isDetailsVisible()) {
				this.toggleDetails(true);
			} else {
				this._details.widget.focus();
			}
		}
	}

	toggleDetails(focused: boolean = false): void {
		if (this._isDetailsVisible()) {
			// hide details widget
			this._pendingShowDetails.clear();
			// this._ctxSuggestWidgetDetailsVisible.set(false);

			this._setDetailsVisible(false);
			this._details.hide();
			this.element.domNode.classList.remove('shows-details');

		} else if ((canExpandCompletionItem(this._list.getFocusedElements()[0]) || this._explainMode) && (this._state === State.Open || this._state === State.Details || this._state === State.Frozen)) {
			// show details widget (iff possible)
			// this._ctxSuggestWidgetDetailsVisible.set(true);

			this._setDetailsVisible(true);
			this._showDetails(false, focused);
		}
	}

	private _showDetails(loading: boolean, focused: boolean): void {
		this._pendingShowDetails.value = dom.runAtThisOrScheduleAtNextAnimationFrame(dom.getWindow(this.element.domNode), () => {
			this._pendingShowDetails.clear();
			this._details.show();
			let didFocusDetails = false;
			if (loading) {
				this._details.widget.renderLoading();
			} else {
				this._details.widget.renderItem(this._list.getFocusedElements()[0], this._explainMode);
			}
			if (!this._details.widget.isEmpty) {
				this._positionDetails();
				this.element.domNode.classList.add('shows-details');
				if (focused) {
					this._details.widget.focus();
					didFocusDetails = true;
				}
			} else {
				this._details.hide();
			}
			if (!didFocusDetails) {
				// this.editor.focus();
			}
		});
	}

	toggleExplainMode(): void {
		if (this._list.getFocusedElements()[0]) {
			this._explainMode = !this._explainMode;
			if (!this._isDetailsVisible()) {
				this.toggleDetails();
			} else {
				this._showDetails(false, false);
			}
		}
	}

	hide(): void {
		this._pendingLayout.clear();
		this._pendingShowDetails.clear();
		this._loadingTimeout?.dispose();
		this._ctxSuggestWidgetHasBeenNavigated.reset();
		this._ctxFirstSuggestionFocused.reset();
		this._setState(State.Hidden);
		this._onDidHide.fire(this);
		dom.hide(this.element.domNode);
		this.element.clearSashHoverState();
		// ensure that a reasonable widget height is persisted so that
		// accidential "resize-to-single-items" cases aren't happening
		const dim = this._persistedSize.restore();
		const minPersistedHeight = Math.ceil(this._getLayoutInfo().itemHeight * 4.3);
		if (dim && dim.height < minPersistedHeight) {
			this._persistedSize.store(dim.with(undefined, minPersistedHeight));
		}
	}

	private _layout(size: dom.Dimension | undefined): void {
		if (!this._cursorPosition) {
			return;
		}
		// if (!this.editor.hasModel()) {
		// 	return;
		// }
		// if (!this.editor.getDomNode()) {
		// 	// happens when running tests
		// 	return;
		// }

		const bodyBox = dom.getClientArea(this._container.ownerDocument.body);
		const info = this._getLayoutInfo();

		if (!size) {
			size = info.defaultSize;
		}

		let height = size.height;
		let width = size.width;

		// status bar
		if (this._status) {
			this._status.element.style.height = `${info.itemHeight}px`;
		}

		// if (this._state === State.Empty || this._state === State.Loading) {
		// 	// showing a message only
		// 	height = info.itemHeight + info.borderHeight;
		// 	width = info.defaultSize.width / 2;
		// 	this.element.enableSashes(false, false, false, false);
		// 	this.element.minSize = this.element.maxSize = new dom.Dimension(width, height);
		// 	this._preference = WidgetPositionPreference.Below;

		// } else {
		// showing items

		// width math
		const maxWidth = bodyBox.width - info.borderHeight - 2 * info.horizontalPadding;
		if (width > maxWidth) {
			width = maxWidth;
		}
		const preferredWidth = this._completionModel ? this._completionModel.stats.pLabelLen * info.typicalHalfwidthCharacterWidth : width;

		// height math
		// Cap list content height to a reasonable maximum (12 items worth), matching suggestWidget behavior
		const cappedListContentHeight = Math.min(this._list.contentHeight, info.itemHeight * 12);
		const fullHeight = info.statusBarHeight + cappedListContentHeight + this._messageElement.clientHeight + info.borderHeight;
		const minHeight = info.itemHeight + info.statusBarHeight;
		// const editorBox = dom.getDomNodePagePosition(this.editor.getDomNode());
		// const cursorBox = this.editor.getScrolledVisiblePosition(this.editor.getPosition());
		const editorBox = dom.getDomNodePagePosition(this._container);
		// Convert absolute cursor position to relative position (relative to container)
		const cursorBox = {
			top: this._cursorPosition.top - editorBox.top,
			left: this._cursorPosition.left,
			height: this._cursorPosition.height
		};
		const cursorBottom = editorBox.top + cursorBox.top + cursorBox.height;
		const maxHeightBelow = Math.min(bodyBox.height - cursorBottom - info.verticalPadding, fullHeight);
		const availableSpaceAbove = editorBox.top + cursorBox.top - info.verticalPadding;
		const maxHeightAbove = Math.min(availableSpaceAbove, fullHeight);
		let maxHeight = Math.min(Math.max(maxHeightAbove, maxHeightBelow) + info.borderHeight, fullHeight);

		if (height === this._cappedHeight?.capped) {
			// Restore the old (wanted) height when the current
			// height is capped to fit
			height = this._cappedHeight.wanted;
		}

		if (height < minHeight) {
			height = minHeight;
		}
		if (height > maxHeight) {
			height = maxHeight;
		}

		const forceRenderingAboveRequiredSpace = 150;
		if ((height > maxHeightBelow && maxHeightAbove > maxHeightBelow) || (this._forceRenderingAbove && availableSpaceAbove > forceRenderingAboveRequiredSpace)) {
			this._preference = WidgetPositionPreference.Above;
			this.element.enableSashes(true, true, false, false);
			maxHeight = maxHeightAbove;
		} else {
			this._preference = WidgetPositionPreference.Below;
			this.element.enableSashes(false, true, true, false);
			maxHeight = maxHeightBelow;
		}
		this.element.preferredSize = new dom.Dimension(preferredWidth, info.defaultSize.height);
		this.element.maxSize = new dom.Dimension(maxWidth, maxHeight);
		this.element.minSize = new dom.Dimension(220, minHeight);

		// Know when the height was capped to fit and remember
		// the wanted height for later. This is required when going
		// left to widen suggestions.
		this._cappedHeight = height === fullHeight
			? { wanted: this._cappedHeight?.wanted ?? size.height, capped: height }
			: undefined;
		// }
		// Horizontal positioning: Position widget at cursor, flip to left if would overflow right
		let anchorLeft = this._cursorPosition.left;
		const wouldOverflowRight = anchorLeft + width > bodyBox.width;

		if (wouldOverflowRight) {
			// Position right edge at cursor (extends left)
			anchorLeft = this._cursorPosition.left - width;
		}

		this.element.domNode.style.left = `${anchorLeft}px`;
		if (this._preference === WidgetPositionPreference.Above) {
			this.element.domNode.style.top = `${this._cursorPosition.top - height - info.borderHeight}px`;
		} else {
			this.element.domNode.style.top = `${this._cursorPosition.top + this._cursorPosition.height}px`;
		}
		// }
		this._resize(width, height);
	}

	_afterRender() {
		// if (position === null) {
		// 	if (this._isDetailsVisible()) {
		// 		this._details.hide(); //todo@jrieken soft-hide
		// 	}
		// 	return;
		// }
		if (this._state === State.Empty || this._state === State.Loading) {
			// no special positioning when widget isn't showing list
			return;
		}
		if (this._isDetailsVisible() && !this._details.widget.isEmpty) {
			this._details.show();
		}
		this._positionDetails();
	}

	private _resize(width: number, height: number): void {
		const { width: maxWidth, height: maxHeight } = this.element.maxSize;
		width = Math.min(maxWidth, width);
		if (maxHeight) {
			height = Math.min(maxHeight, height);
		}

		const { statusBarHeight } = this._getLayoutInfo();
		this._list.layout(height - statusBarHeight, width);
		this._listElement.style.height = `${height - statusBarHeight}px`;

		this._listElement.style.width = `${width}px`;
		this.element.layout(height, width);
		if (this._cursorPosition && this._preference === WidgetPositionPreference.Above) {
			this.element.domNode.style.top = `${this._cursorPosition.top - height}px`;
		}
		this._positionDetails();
	}

	private _positionDetails(): void {
		if (this._isDetailsVisible()) {
			this._details.placeAtAnchor(this.element.domNode);
		}
	}

	private _getLayoutInfo() {
		const fontInfo = this._getFontInfo();
		const itemHeight = clamp(fontInfo.lineHeight, 8, 1000);
		const statusBarHeight = !this._options.statusBarMenuId || !this._options.showStatusBarSettingId || !this._configurationService.getValue(this._options.showStatusBarSettingId) || this._state === State.Empty || this._state === State.Loading ? 0 : itemHeight;
		const borderWidth = this._details.widget.borderWidth;
		const borderHeight = 2 * borderWidth;

		return {
			itemHeight,
			statusBarHeight,
			borderWidth,
			borderHeight,
			typicalHalfwidthCharacterWidth: 10,
			verticalPadding: 22,
			horizontalPadding: 14,
			defaultSize: new dom.Dimension(430, statusBarHeight + 12 * itemHeight + borderHeight)
		};
	}

	private _onListMouseDownOrTap(e: IListMouseEvent<TItem> | IListGestureEvent<TItem>): void {
		if (typeof e.element === 'undefined' || typeof e.index === 'undefined') {
			return;
		}

		// prevent stealing browser focus from the terminal
		e.browserEvent.preventDefault();
		e.browserEvent.stopPropagation();

		this._select(e.element, e.index);
	}

	private _onListSelection(e: IListEvent<TItem>): void {
		if (e.elements.length) {
			this._select(e.elements[0], e.indexes[0]);
		}
	}

	private _select(item: TItem, index: number): void {
		const completionModel = this._completionModel;
		if (completionModel) {
			this._onDidSelect.fire({ item, index, model: completionModel });
		}
	}

	selectNext(): boolean {
		this._clearPartialSelectionState();
		this._list.focusNext(1, true);
		const focus = this._list.getFocus();
		if (focus.length > 0) {
			this._list.reveal(focus[0]);
		}
		return true;
	}

	selectNextPage(): boolean {
		this._clearPartialSelectionState();
		this._list.focusNextPage();
		const focus = this._list.getFocus();
		if (focus.length > 0) {
			this._list.reveal(focus[0]);
		}
		return true;
	}

	selectPrevious(): boolean {
		this._clearPartialSelectionState();
		this._list.focusPrevious(1, true);
		const focus = this._list.getFocus();
		if (focus.length > 0) {
			this._list.reveal(focus[0]);
		}
		return true;
	}

	selectPreviousPage(): boolean {
		this._clearPartialSelectionState();
		this._list.focusPreviousPage();
		const focus = this._list.getFocus();
		if (focus.length > 0) {
			this._list.reveal(focus[0]);
		}
		return true;
	}

	private _clearPartialSelectionState(): void {
		this._list.style(getListStylesWithMode(false));
		this.element.domNode.classList.remove(Classes.PartialSelection);
	}

	getFocusedItem(): ISimpleSelectedSuggestion<TItem> | undefined {
		if (this._completionModel) {
			return {
				item: this._list.getFocusedElements()[0],
				index: this._list.getFocus()[0],
				model: this._completionModel
			};
		}
		return undefined;
	}

	private _isDetailsVisible(): boolean {
		return this._storageService.getBoolean('expandSuggestionDocs', StorageScope.PROFILE, false);
	}

	private _setDetailsVisible(value: boolean) {
		this._storageService.store('expandSuggestionDocs', value, StorageScope.PROFILE, StorageTarget.USER);
	}

	forceRenderingAbove() {
		if (!this._forceRenderingAbove) {
			this._forceRenderingAbove = true;
			this._layout(this._persistedSize.restore());
		}
	}

	stopForceRenderingAbove() {
		this._forceRenderingAbove = false;
	}
}

function getListStylesWithMode(partial?: boolean): IListStyles {
	// The suggest widget uses the list's inactive focus to mean selection since it's not actually
	// focused.
	if (partial) {
		return getListStyles({
			listInactiveFocusOutline: focusBorder,
			listInactiveFocusForeground: editorSuggestWidgetForeground,
		});
	} else {
		return getListStyles({
			listInactiveFocusBackground: editorSuggestWidgetSelectedBackground,
			listInactiveFocusOutline: activeContrastBorder
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/simpleSuggestWidgetDetails.ts]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/simpleSuggestWidgetDetails.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as dom from '../../../../base/browser/dom.js';
import { DomScrollableElement } from '../../../../base/browser/ui/scrollbar/scrollableElement.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ResizableHTMLElement } from '../../../../base/browser/ui/resizable/resizable.js';
import * as nls from '../../../../nls.js';
import { SimpleCompletionItem } from './simpleCompletionItem.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { IMarkdownRendererService } from '../../../../platform/markdown/browser/markdownRenderer.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ISimpleSuggestWidgetFontInfo } from './simpleSuggestWidgetRenderer.js';

export function canExpandCompletionItem(item: SimpleCompletionItem | undefined): boolean {
	return !!item && Boolean(item.completion.documentation || item.completion.detail && item.completion.detail !== item.completion.label);
}

export const SuggestDetailsClassName = 'suggest-details';

export const enum SimpleSuggestDetailsPlacement {
	East = 0,
	West = 1,
	South = 2,
	North = 3
}

export class SimpleSuggestDetailsWidget {

	readonly domNode: HTMLDivElement;

	private readonly _onDidClose = new Emitter<void>();
	readonly onDidClose: Event<void> = this._onDidClose.event;

	private readonly _onDidChangeContents = new Emitter<this>();
	readonly onDidChangeContents: Event<this> = this._onDidChangeContents.event;

	private readonly _close: HTMLElement;
	private readonly _scrollbar: DomScrollableElement;
	private readonly _body: HTMLElement;
	private readonly _header: HTMLElement;
	private readonly _type: HTMLElement;
	private readonly _docs: HTMLElement;
	private readonly _disposables = new DisposableStore();

	private readonly _renderDisposeable = this._disposables.add(new DisposableStore());
	private _borderWidth: number = 1;
	private _size = new dom.Dimension(330, 0);

	constructor(
		private readonly _getFontInfo: () => ISimpleSuggestWidgetFontInfo,
		onDidFontInfoChange: Event<void>,
		private readonly _getAdvancedExplainModeDetails: () => string | undefined,
		@IInstantiationService instaService: IInstantiationService,
		@IMarkdownRendererService private readonly markdownRendererService: IMarkdownRendererService,
	) {
		this.domNode = dom.$('.suggest-details');
		this.domNode.classList.add('no-docs');

		this._body = dom.$('.body');

		this._scrollbar = new DomScrollableElement(this._body, {
			alwaysConsumeMouseWheel: true,
		});
		dom.append(this.domNode, this._scrollbar.getDomNode());
		this._disposables.add(this._scrollbar);

		this._header = dom.append(this._body, dom.$('.header'));
		this._close = dom.append(this._header, dom.$('span' + ThemeIcon.asCSSSelector(Codicon.close)));
		this._close.title = nls.localize('details.close', "Close");
		this._close.role = 'button';
		this._close.tabIndex = -1;
		this._type = dom.append(this._header, dom.$('p.type'));

		this._docs = dom.append(this._body, dom.$('p.docs'));

		this._configureFont();

		this._disposables.add(onDidFontInfoChange(() => this._configureFont()));
	}

	private _configureFont(): void {
		const fontInfo = this._getFontInfo();
		const fontFamily = fontInfo.fontFamily;

		const fontSize = fontInfo.fontSize;
		const lineHeight = fontInfo.lineHeight;
		const fontWeight = fontInfo.fontWeight;
		const fontSizePx = `${fontSize}px`;
		const lineHeightPx = `${lineHeight}px`;

		this.domNode.style.fontSize = fontSizePx;
		this.domNode.style.lineHeight = `${lineHeight / fontSize}`;
		this.domNode.style.fontWeight = fontWeight;
		// this.domNode.style.fontFeatureSettings = fontInfo.fontFeatureSettings;
		this._type.style.fontFamily = fontFamily;
		this._close.style.height = lineHeightPx;
		this._close.style.width = lineHeightPx;

	}

	dispose(): void {
		this._disposables.dispose();
		this._onDidClose.dispose();
		this._onDidChangeContents.dispose();
	}

	getLayoutInfo() {
		const lineHeight = this._getFontInfo().lineHeight;
		const borderWidth = this._borderWidth;
		const borderHeight = borderWidth * 2;
		return {
			lineHeight,
			borderWidth,
			borderHeight,
			verticalPadding: 22,
			horizontalPadding: 14
		};
	}

	renderLoading(): void {
		this._type.textContent = nls.localize('loading', "Loading...");
		this._docs.textContent = '';
		this.domNode.classList.remove('no-docs', 'no-type');
		this.layout(this.size.width, this.getLayoutInfo().lineHeight * 2);
		this._onDidChangeContents.fire(this);
	}

	renderItem(item: SimpleCompletionItem, explainMode: boolean): void {
		this._renderDisposeable.clear();

		let { detail, documentation } = item.completion;

		let md = '';

		if (explainMode) {
			md += `score: ${item.score[0]}\n`;
			md += `prefix: ${item.word ?? '(no prefix)'}\n`;
			const vs = item.completion.replacementRange;
			md += `valueSelection: ${vs ? `[${vs[0]}, ${vs[1]}]` : 'undefined'}\\n`;
			md += `index: ${item.idx}\n`;
			if (this._getAdvancedExplainModeDetails) {
				const advancedDetails = this._getAdvancedExplainModeDetails();
				if (advancedDetails) {
					md += `${advancedDetails}\n`;
				}
			}
			detail = `Provider: ${item.completion.provider}`;
			documentation = new MarkdownString().appendCodeblock('empty', md);
		}

		const hasDetail = typeof detail === 'string' ? detail.trim().length > 0 : !!detail;
		const hasDocs = typeof documentation === 'string'
			? documentation.trim().length > 0
			: !!(documentation && documentation.value?.trim().length > 0);

		const updateSize = () => {
			this.layout(this._size.width, this._type.clientHeight + this._docs.clientHeight);
			this._onDidChangeContents.fire(this);
		};

		if (!explainMode && (!canExpandCompletionItem(item) || (!hasDetail && !hasDocs))) {
			this.clearContents();
			return;
		}

		this.domNode.classList.remove('no-docs', 'no-type');

		// --- details

		if (hasDetail && detail) {
			const cappedDetail = detail.length > 100000 ? `${detail.substr(0, 100000)}…` : detail;
			this._type.textContent = cappedDetail;
			this._type.title = cappedDetail;
			dom.show(this._type);
			this._type.classList.toggle('auto-wrap', !/\r?\n^\s+/gmi.test(cappedDetail));
		} else {
			dom.clearNode(this._type);
			this._type.title = '';
			dom.hide(this._type);
			this.domNode.classList.add('no-type');
		}

		// // --- documentation

		dom.clearNode(this._docs);
		if (hasDocs && typeof documentation === 'string') {
			this._docs.classList.remove('markdown-docs');
			this._docs.textContent = documentation;

		} else if (hasDocs && documentation && typeof documentation !== 'string') {
			this._docs.classList.add('markdown-docs');
			dom.clearNode(this._docs);
			const renderedContents = this.markdownRendererService.render(documentation, {
				asyncRenderCallback: () => {
					updateSize();
				}
			});
			this._docs.appendChild(renderedContents.element);
			this._renderDisposeable.add(renderedContents);
		} else {
			this._docs.classList.remove('markdown-docs');
		}

		this.domNode.classList.toggle('detail-and-doc', hasDetail && hasDocs);

		this.domNode.style.userSelect = 'text';
		this.domNode.tabIndex = -1;

		this._close.onmousedown = e => {
			e.preventDefault();
			e.stopPropagation();
		};
		this._close.onclick = e => {
			e.preventDefault();
			e.stopPropagation();
			this._onDidClose.fire();
		};

		this._body.scrollTop = 0;

		updateSize();
	}

	clearContents() {
		this.domNode.classList.add('no-docs');
		this._type.textContent = '';
		this._docs.textContent = '';
	}

	get isEmpty(): boolean {
		return this.domNode.classList.contains('no-docs');
	}

	get size() {
		return this._size;
	}

	layout(width: number, height: number): void {
		const newSize = new dom.Dimension(width, height);
		if (!dom.Dimension.equals(newSize, this._size)) {
			this._size = newSize;
			dom.size(this.domNode, width, height);
		}
		this._scrollbar.scanDomNode();
	}

	scrollDown(much = 8): void {
		this._body.scrollTop += much;
	}

	scrollUp(much = 8): void {
		this._body.scrollTop -= much;
	}

	scrollTop(): void {
		this._body.scrollTop = 0;
	}

	scrollBottom(): void {
		this._body.scrollTop = this._body.scrollHeight;
	}

	pageDown(): void {
		this.scrollDown(80);
	}

	pageUp(): void {
		this.scrollUp(80);
	}

	set borderWidth(width: number) {
		this._borderWidth = width;
	}

	get borderWidth() {
		return this._borderWidth;
	}

	focus() {
		this.domNode.focus();
	}
}

export class SimpleSuggestDetailsOverlay {

	private readonly _disposables = new DisposableStore();
	private readonly _resizable: ResizableHTMLElement;

	private _added: boolean = false;
	private _anchorBox?: dom.IDomNodePagePosition;
	// private _preferAlignAtTop: boolean = true;
	private _userSize?: dom.Dimension;
	private _topLeft?: TopLeftPosition;
	private readonly _preventPlacements?: ReadonlySet<SimpleSuggestDetailsPlacement>;

	constructor(
		readonly widget: SimpleSuggestDetailsWidget,
		private _container: HTMLElement,
		preventPlacements?: readonly SimpleSuggestDetailsPlacement[]
	) {

		this._resizable = this._disposables.add(new ResizableHTMLElement());
		this._resizable.domNode.classList.add('suggest-details-container');
		this._resizable.domNode.appendChild(widget.domNode);
		this._resizable.enableSashes(false, true, true, false);
		this._preventPlacements = preventPlacements && preventPlacements.length ? new Set(preventPlacements) : undefined;

		let topLeftNow: TopLeftPosition | undefined;
		let sizeNow: dom.Dimension | undefined;
		let deltaTop: number = 0;
		let deltaLeft: number = 0;
		this._disposables.add(this._resizable.onDidWillResize(() => {
			topLeftNow = this._topLeft;
			sizeNow = this._resizable.size;
		}));

		this._disposables.add(this._resizable.onDidResize(e => {
			if (topLeftNow && sizeNow) {
				this.widget.layout(e.dimension.width, e.dimension.height);

				let updateTopLeft = false;
				if (e.west) {
					deltaLeft = sizeNow.width - e.dimension.width;
					updateTopLeft = true;
				}
				if (e.north) {
					deltaTop = sizeNow.height - e.dimension.height;
					updateTopLeft = true;
				}
				if (updateTopLeft) {
					this._applyTopLeft({
						top: topLeftNow.top + deltaTop,
						left: topLeftNow.left + deltaLeft,
					});
				}
			}
			if (e.done) {
				topLeftNow = undefined;
				sizeNow = undefined;
				deltaTop = 0;
				deltaLeft = 0;
				this._userSize = e.dimension;
			}
		}));

		this._disposables.add(this.widget.onDidChangeContents(() => {
			if (this._anchorBox) {
				this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size);
			}
		}));
	}

	dispose(): void {
		this.widget.dispose();
		this._disposables.dispose();
		this.hide();
	}

	getId(): string {
		return 'suggest.details';
	}

	getDomNode(): HTMLElement {
		return this._resizable.domNode;
	}

	show(): void {
		if (!this._added) {
			this._container.appendChild(this._resizable.domNode);
			this._added = true;
		}
	}

	hide(sessionEnded: boolean = false): void {
		this._resizable.clearSashHoverState();

		if (this._added) {
			this._container.removeChild(this._resizable.domNode);
			this._added = false;
			this._anchorBox = undefined;
			// this._topLeft = undefined;
		}
		if (sessionEnded) {
			this._userSize = undefined;
			this.widget.clearContents();
		}
	}

	placeAtAnchor(anchor: HTMLElement) {
		const anchorBox = anchor.getBoundingClientRect();
		this._anchorBox = anchorBox;
		this.widget.layout(this._resizable.size.width, this._resizable.size.height);
		this._placeAtAnchor(this._anchorBox, this._userSize ?? this.widget.size);
	}

	_placeAtAnchor(anchorBox: dom.IDomNodePagePosition, size: dom.Dimension) {
		const bodyBox = dom.getClientArea(this.getDomNode().ownerDocument.body);

		const info = this.widget.getLayoutInfo();

		const defaultMinSize = new dom.Dimension(220, 2 * info.lineHeight);
		const defaultTop = anchorBox.top;

		type Placement = { top: number; left: number; fit: number; maxSizeTop: dom.Dimension; maxSizeBottom: dom.Dimension; minSize: dom.Dimension };

		// EAST
		const eastPlacement: Placement = (function () {
			const width = bodyBox.width - (anchorBox.left + anchorBox.width + info.borderWidth + info.horizontalPadding);
			const left = -info.borderWidth + anchorBox.left + anchorBox.width;
			const maxSizeTop = new dom.Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
			const maxSizeBottom = maxSizeTop.with(undefined, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
			return { top: defaultTop, left, fit: width - size.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
		})();

		// WEST
		const westPlacement: Placement = (function () {
			const width = anchorBox.left - info.borderWidth - info.horizontalPadding;
			const left = Math.max(info.horizontalPadding, anchorBox.left - size.width - info.borderWidth);
			const maxSizeTop = new dom.Dimension(width, bodyBox.height - anchorBox.top - info.borderHeight - info.verticalPadding);
			const maxSizeBottom = maxSizeTop.with(undefined, anchorBox.top + anchorBox.height - info.borderHeight - info.verticalPadding);
			return { top: defaultTop, left, fit: width - size.width, maxSizeTop, maxSizeBottom, minSize: defaultMinSize.with(Math.min(width, defaultMinSize.width)) };
		})();

		// SOUTH
		const southPlacement: Placement = (function () {
			const left = anchorBox.left;
			const top = -info.borderWidth + anchorBox.top + anchorBox.height;
			const maxSizeBottom = new dom.Dimension(anchorBox.width - info.borderHeight, bodyBox.height - anchorBox.top - anchorBox.height - info.verticalPadding);
			return { top, left, fit: maxSizeBottom.height - size.height, maxSizeBottom, maxSizeTop: maxSizeBottom, minSize: defaultMinSize.with(maxSizeBottom.width) };
		})();

		// NORTH
		const northPlacement: Placement = (function () {
			const width = Math.max(anchorBox.width - info.borderHeight, 0);
			const left = anchorBox.left;
			const maxHeightAbove = Math.max(anchorBox.top - info.verticalPadding, 0);
			const heightForTop = Math.min(size.height, maxHeightAbove);
			const top = anchorBox.top - info.borderWidth - heightForTop;
			const maxSize = new dom.Dimension(width, Math.max(maxHeightAbove, 0));
			return { top, left, fit: maxSize.height - size.height, maxSizeTop: maxSize, maxSizeBottom: maxSize, minSize: defaultMinSize.with(maxSize.width) };
		})();

		// take first placement that fits or the first with "least bad" fit
		const placementEntries: [SimpleSuggestDetailsPlacement, Placement][] = [
			[SimpleSuggestDetailsPlacement.East, eastPlacement],
			[SimpleSuggestDetailsPlacement.South, southPlacement],
			[SimpleSuggestDetailsPlacement.North, northPlacement],
			[SimpleSuggestDetailsPlacement.West, westPlacement]
		];
		const orientations = (this._preventPlacements
			? placementEntries.filter(([direction]) => !this._preventPlacements!.has(direction))
			: placementEntries).map(([, entry]) => entry);
		const candidates = orientations.length ? orientations : placementEntries.map(([, entry]) => entry);
		const placement = candidates.find(p => p.fit >= 0)
			?? candidates.reduce<Placement | undefined>((best, current) => !best || current.fit > best.fit ? current : best, undefined)
			?? eastPlacement;

		// top/bottom placement
		const bottom = anchorBox.top + anchorBox.height - info.borderHeight;
		let alignAtTop: boolean;
		let height = size.height;
		const maxHeight = Math.max(placement.maxSizeTop.height, placement.maxSizeBottom.height);
		if (height > maxHeight) {
			height = maxHeight;
		}
		let maxSize: dom.Dimension;
		// if (preferAlignAtTop) {
		if (height <= placement.maxSizeTop.height) {
			alignAtTop = true;
			maxSize = placement.maxSizeTop;
		} else {
			alignAtTop = false;
			maxSize = placement.maxSizeBottom;
		}
		// } else {
		// 	if (height <= placement.maxSizeBottom.height) {
		// 		alignAtTop = false;
		// 		maxSize = placement.maxSizeBottom;
		// 	} else {
		// 		alignAtTop = true;
		// 		maxSize = placement.maxSizeTop;
		// 	}
		// }

		let { top, left } = placement;
		if (!alignAtTop && height > anchorBox.height) {
			top = bottom - height;
		}
		const editorDomNode = this._container;
		if (editorDomNode) {
			// get bounding rectangle of the suggest widget relative to the editor
			const editorBoundingBox = editorDomNode.getBoundingClientRect();
			top -= editorBoundingBox.top;
			left -= editorBoundingBox.left;
		}
		this._applyTopLeft({ left, top });

		this._resizable.enableSashes(!alignAtTop, placement === eastPlacement, alignAtTop, placement !== eastPlacement);

		this._resizable.minSize = placement.minSize;
		this._resizable.maxSize = maxSize;
		this._resizable.layout(height, Math.min(maxSize.width, size.width));
		this.widget.layout(this._resizable.size.width, this._resizable.size.height);
	}

	private _applyTopLeft(topLeft: { left: number; top: number }): void {
		this._topLeft = topLeft;
		// this._editor.layoutOverlayWidget(this);
		this._resizable.domNode.style.top = `${topLeft.top}px`;
		this._resizable.domNode.style.left = `${topLeft.left}px`;
		this._resizable.domNode.style.position = 'absolute';
	}
}

interface TopLeftPosition {
	top: number;
	left: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/simpleSuggestWidgetRenderer.ts]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/simpleSuggestWidgetRenderer.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { $, append, show } from '../../../../base/browser/dom.js';
import { IconLabel, IIconLabelValueOptions } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { IListRenderer } from '../../../../base/browser/ui/list/list.js';
import { SimpleCompletionItem } from './simpleCompletionItem.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { createMatches } from '../../../../base/common/filters.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { URI } from '../../../../base/common/uri.js';
import { FileKind } from '../../../../platform/files/common/files.js';

export function getAriaId(index: number): string {
	return `simple-suggest-aria-id-${index}`;
}

export interface ISimpleSuggestionTemplateData {
	readonly root: HTMLElement;

	/**
	 * Flexbox
	 * < ------------- left ------------ >     < --- right -- >
	 * <icon><label><signature><qualifier>     <type><readmore>
	 */
	readonly left: HTMLElement;
	readonly right: HTMLElement;

	readonly icon: HTMLElement;
	readonly colorspan: HTMLElement;
	readonly iconLabel: IconLabel;
	readonly iconContainer: HTMLElement;
	readonly parametersLabel: HTMLElement;
	readonly qualifierLabel: HTMLElement;
	/**
	 * Showing either `CompletionItem#details` or `CompletionItemLabel#type`
	 */
	readonly detailsLabel: HTMLElement;
	// readonly readMore: HTMLElement;
	readonly disposables: DisposableStore;
}

export interface ISimpleSuggestWidgetFontInfo {
	fontFamily: string;
	fontSize: number;
	lineHeight: number;
	fontWeight: string;
	letterSpacing: number;
}

export class SimpleSuggestWidgetItemRenderer implements IListRenderer<SimpleCompletionItem, ISimpleSuggestionTemplateData> {

	private readonly _onDidToggleDetails = new Emitter<void>();
	readonly onDidToggleDetails: Event<void> = this._onDidToggleDetails.event;

	private readonly _disposables = new DisposableStore();

	readonly templateId = 'suggestion';

	constructor(
		private readonly _getFontInfo: () => ISimpleSuggestWidgetFontInfo,
		private readonly _onDidFontConfigurationChange: Event<void>,
		@IThemeService private readonly _themeService: IThemeService,
		@IModelService private readonly _modelService: IModelService,
		@ILanguageService private readonly _languageService: ILanguageService) { }

	dispose(): void {
		this._onDidToggleDetails.dispose();
		this._disposables.dispose();
	}

	renderTemplate(container: HTMLElement): ISimpleSuggestionTemplateData {
		const disposables = new DisposableStore();

		const root = container;
		root.classList.add('show-file-icons');

		const icon = append(container, $('.icon'));
		const colorspan = append(icon, $('span.colorspan'));

		const text = append(container, $('.contents'));
		const main = append(text, $('.main'));

		const iconContainer = append(main, $('.icon-label.codicon'));
		const left = append(main, $('span.left'));
		const right = append(main, $('span.right'));

		const iconLabel = new IconLabel(left, { supportHighlights: true, supportIcons: true });
		disposables.add(iconLabel);

		const parametersLabel = append(left, $('span.signature-label'));
		const qualifierLabel = append(left, $('span.qualifier-label'));
		const detailsLabel = append(right, $('span.details-label'));

		// const readMore = append(right, $('span.readMore' + ThemeIcon.asCSSSelector(suggestMoreInfoIcon)));
		// readMore.title = nls.localize('readMore', "Read More");

		const configureFont = () => {
			const fontFeatureSettings = '';
			const { fontFamily, fontSize, lineHeight, fontWeight, letterSpacing } = this._getFontInfo();
			const fontSizePx = `${fontSize}px`;
			const lineHeightPx = `${lineHeight}px`;
			const letterSpacingPx = `${letterSpacing}px`;

			root.style.fontSize = fontSizePx;
			root.style.fontWeight = fontWeight;
			root.style.letterSpacing = letterSpacingPx;
			main.style.fontFamily = fontFamily;
			main.style.fontFeatureSettings = fontFeatureSettings;
			main.style.lineHeight = lineHeightPx;
			icon.style.height = lineHeightPx;
			icon.style.width = lineHeightPx;
			// readMore.style.height = lineHeightPx;
			// readMore.style.width = lineHeightPx;
		};

		configureFont();
		this._disposables.add(this._onDidFontConfigurationChange(() => configureFont()));
		return { root, left, right, icon, colorspan, iconLabel, iconContainer, parametersLabel, qualifierLabel, detailsLabel, disposables };
	}

	renderElement(element: SimpleCompletionItem, index: number, data: ISimpleSuggestionTemplateData): void {
		const { completion } = element;
		data.root.id = getAriaId(index);
		data.colorspan.style.backgroundColor = '';

		const labelOptions: IIconLabelValueOptions = {
			labelEscapeNewLines: true,
			matches: createMatches(element.score)
		};

		// const color: string[] = [];
		// if (completion.kind === CompletionItemKind.Color && _completionItemColor.extract(element, color)) {
		// 	// special logic for 'color' completion items
		// 	data.icon.className = 'icon customcolor';
		// 	data.iconContainer.className = 'icon hide';
		// 	data.colorspan.style.backgroundColor = color[0];

		// } else
		if (completion.kindLabel === 'File' && this._themeService.getFileIconTheme().hasFileIcons) {
			// special logic for 'file' completion items
			data.icon.className = 'icon hide';
			data.iconContainer.className = 'icon hide';
			const labelClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: element.textLabel }), FileKind.FILE);
			const detailClasses = getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: completion.detail }), FileKind.FILE);
			labelOptions.extraClasses = labelClasses.length > detailClasses.length ? labelClasses : detailClasses;

		} else if (completion.kindLabel === 'Folder' && this._themeService.getFileIconTheme().hasFolderIcons) {
			// special logic for 'folder' completion items
			data.icon.className = 'icon hide';
			data.iconContainer.className = 'icon hide';
			labelOptions.extraClasses = [
				getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: element.textLabel }), FileKind.FOLDER),
				getIconClasses(this._modelService, this._languageService, URI.from({ scheme: 'fake', path: completion.detail }), FileKind.FOLDER)
			].flat();
		} else {
			// normal icon
			data.icon.className = 'icon hide';
			data.iconContainer.className = '';
			data.iconContainer.classList.add('suggest-icon', ...ThemeIcon.asClassNameArray(completion.icon || Codicon.symbolText));
		}

		// if (completion.tags && completion.tags.indexOf(CompletionItemTag.Deprecated) >= 0) {
		// 	labelOptions.extraClasses = (labelOptions.extraClasses || []).concat(['deprecated']);
		// 	labelOptions.matches = [];
		// }

		data.iconLabel.setLabel(element.textLabel, undefined, labelOptions);
		if (typeof completion.label === 'string') {
			data.parametersLabel.textContent = '';
			data.detailsLabel.textContent = stripNewLines(completion.detail || '');
			data.root.classList.add('string-label');
		} else {
			const labelDetail = stripNewLines(completion.label.detail || '');
			data.parametersLabel.textContent = normalizeLabelDetail(labelDetail);
			data.detailsLabel.textContent = stripNewLines(completion.label.description || '');
			data.root.classList.remove('string-label');
		}

		// if (this._editor.getOption(EditorOption.suggest).showInlineDetails) {
		show(data.detailsLabel);
		// } else {
		// 	hide(data.detailsLabel);
		// }

		// if (canExpandCompletionItem(element)) {
		// 	data.right.classList.add('can-expand-details');
		// 	show(data.readMore);
		// 	data.readMore.onmousedown = e => {
		// 		e.stopPropagation();
		// 		e.preventDefault();
		// 	};
		// 	data.readMore.onclick = e => {
		// 		e.stopPropagation();
		// 		e.preventDefault();
		// 		this._onDidToggleDetails.fire();
		// 	};
		// } else {
		data.right.classList.remove('can-expand-details');
		// hide(data.readMore);
		// data.readMore.onmousedown = null;
		// data.readMore.onclick = null;
		// }
	}

	disposeTemplate(templateData: ISimpleSuggestionTemplateData): void {
		templateData.disposables.dispose();
	}
}

function stripNewLines(str: string): string {
	return str.replace(/\r\n|\r|\n/g, '');
}

const LEADING_PUNCTUATION_OR_SPACE = /^[\s()[\]{}<>"'`~!@#$%^&*+=,.:;?/\\|-]/;

function normalizeLabelDetail(detail: string): string {
	if (!detail) {
		return '';
	}
	return LEADING_PUNCTUATION_OR_SPACE.test(detail) ? detail : ` ${detail}`;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/suggest/browser/media/suggest.css]---
Location: vscode-main/src/vs/workbench/services/suggest/browser/media/suggest.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * This file is mostly a mirror of the editor's suggest but scoped to .monaco-workbench to avoid
 * layer breakers and shipping with the standalone monaco editor.
 */

.workbench-suggest-widget {
	position: fixed;
	left: 0;
	top: 0;
	border-style: solid;
	border-width: 1px;
	border-color: var(--vscode-editorSuggestWidget-border);
	background-color: var(--vscode-editorSuggestWidget-background);
}

.workbench-suggest-widget .suggest-details {
	border-style: solid;
	border-width: 1px;
	border-color: var(--vscode-editorSuggestWidget-border);
	background-color: var(--vscode-editorSuggestWidget-background);
}

/* Suggest widget*/

.workbench-suggest-widget {
	width: 430px;
	z-index: 40;
	display: flex;
	flex-direction: column;
	border-radius: 3px;
}

.workbench-suggest-widget.message {
	flex-direction: row;
	align-items: center;
}

.workbench-suggest-widget,
.monaco-workbench .suggest-details {
	flex: 0 1 auto;
	width: 100%;
	border-style: solid;
	border-width: 1px;
	border-color: var(--vscode-editorSuggestWidget-border);
	background-color: var(--vscode-editorSuggestWidget-background);
}

.monaco-workbench.hc-black .workbench-suggest-widget,
.monaco-workbench.hc-black .suggest-details,
.monaco-workbench.hc-light .workbench-suggest-widget,
.monaco-workbench.hc-light .suggest-details {
	border-width: 2px;
}

/* Styles for status bar part */

.monaco-workbench .workbench-suggest-widget.with-status-bar .suggest-status-bar {
	display: flex;
}

.monaco-workbench .workbench-suggest-widget .suggest-status-bar {
	box-sizing: border-box;
	display: none;
	flex-flow: row nowrap;
	justify-content: space-between;
	width: 100%;
	font-size: 80%;
	padding: 0 4px 0 4px;
	border-top: 1px solid var(--vscode-editorSuggestWidget-border);
	overflow: hidden;
}

.monaco-workbench .workbench-suggest-widget .suggest-status-bar .left {
	padding-right: 8px;
}

.monaco-workbench .workbench-suggest-widget.with-status-bar .suggest-status-bar .action-label {
	color: var(--vscode-editorSuggestWidgetStatus-foreground);
}

.monaco-workbench .workbench-suggest-widget.with-status-bar .suggest-status-bar .action-item:not(:last-of-type) .action-label {
	margin-right: 0;
}

.monaco-workbench .workbench-suggest-widget.increased-discoverability.with-status-bar .suggest-status-bar .monaco-action-bar.right .actions-container .action-item:first-child .action-label {
	color: var(--vscode-button-foreground);
	background-color: var(--vscode-button-background);
}


.monaco-workbench .workbench-suggest-widget.with-status-bar .monaco-list .monaco-list-row > .contents > .main > .right > .readMore,
.monaco-workbench .workbench-suggest-widget.with-status-bar .monaco-list .monaco-list-row.focused.string-label > .contents > .main > .right > .readMore {
	display: none;
}

/* Styles for Message element for when widget is loading or is empty */

.monaco-workbench .workbench-suggest-widget > .message {
	padding-left: 22px;
}

/** Styles for each row in the list element **/

.workbench-suggest-widget .monaco-list .monaco-list-row {
	display: flex;
	-mox-box-sizing: border-box;
	box-sizing: border-box;
	padding-right: 10px;
	background-repeat: no-repeat;
	background-position: 2px 2px;
	white-space: nowrap;
	cursor: pointer;
	touch-action: none;
}

.workbench-suggest-widget .monaco-list .monaco-list-row.focused {
	color: var(--vscode-editorSuggestWidget-selectedForeground);
}

.workbench-suggest-widget .monaco-list .monaco-list-row.focused .codicon {
	color: var(--vscode-editorSuggestWidget-selectedIconForeground);
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents {
	flex: 1;
	height: 100%;
	overflow: hidden;
	padding-left: 2px;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main {
	display: flex;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: pre;
	justify-content: space-between;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left,
.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
	display: flex;
}

.workbench-suggest-widget .monaco-list .monaco-list-row:not(.focused) > .contents > .main .monaco-icon-label {
	color: var(--vscode-editorSuggestWidget-foreground);
}

.workbench-suggest-widget:not(.frozen) .monaco-highlighted-label .highlight {
	font-weight: bold;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main .monaco-highlighted-label .highlight {
	color: var(--vscode-editorSuggestWidget-highlightForeground);
}

.workbench-suggest-widget:not(.partial-selection) .monaco-list .monaco-list-row.focused > .contents > .main .monaco-highlighted-label .highlight {
	color: var(--vscode-editorSuggestWidget-focusHighlightForeground);
}

/** Styles for each row in the list **/

.workbench-suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated {
	opacity: 0.66;
	text-decoration: unset;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .monaco-icon-label.deprecated > .monaco-icon-label-container > .monaco-icon-name-container {
	text-decoration: line-through;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .monaco-icon-label::before {
	height: 100%;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .icon {
	display: block;
	height: 16px;
	width: 16px;
	margin-left: 2px;
	background-repeat: no-repeat;
	background-size: 80%;
	background-position: center;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .icon.hide {
	display: none;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .suggest-icon {
	display: flex;
	align-items: center;
	margin-right: 4px;
}

.workbench-suggest-widget.no-icons .monaco-list .monaco-list-row .icon,
.workbench-suggest-widget.no-icons .monaco-list .monaco-list-row .suggest-icon::before {
	display: none;
}

.workbench-suggest-widget .monaco-list .monaco-list-row .icon.customcolor .colorspan {
	margin: 0 0 0 0.3em;
	border: 0.1em solid #000;
	width: 0.7em;
	height: 0.7em;
	display: inline-block;
}

/** ReadMore Icon styles **/

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close,
.workbench-suggest-widget .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore::before {
	color: inherit;
	opacity: 1;
	font-size: 14px;
	cursor: pointer;
}

.monaco-workbench .workbench-suggest-widget .suggest-details .codicon.codicon-close {
	position: absolute;
	top: 6px;
	right: 2px;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .header > .codicon-close:hover,
.workbench-suggest-widget .suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore:hover {
	opacity: 1;
}

/** signature, qualifier, type/details opacity **/

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	opacity: 0.7;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .signature-label {
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.6;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .qualifier-label {
	margin-left: 12px;
	opacity: 0.4;
	font-size: 85%;
	line-height: initial;
	text-overflow: ellipsis;
	overflow: hidden;
	align-self: center;
}

/** Type Info and icon next to the label in the focused completion item **/

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	font-size: 85%;
	margin-left: 1.1em;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label > .monaco-tokenized-source {
	display: inline;
}

/** Details: if using CompletionItem#details, show on focus **/

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .details-label {
	display: none;
}

.workbench-suggest-widget:not(.shows-details) .monaco-list .monaco-list-row.focused > .contents > .main > .right > .details-label {
	display: inline;
}

/** Details: if using CompletionItemLabel#details, always show **/

.workbench-suggest-widget .monaco-list .monaco-list-row:not(.string-label) > .contents > .main > .right > .details-label,
.workbench-suggest-widget.docs-side .monaco-list .monaco-list-row.focused:not(.string-label) > .contents > .main > .right > .details-label {
	display: inline;
}


/** Ellipsis on hover **/

.workbench-suggest-widget:not(.docs-side) .monaco-list .monaco-list-row.focused:hover > .contents > .main > .right.can-expand-details > .details-label {
	width: calc(100% - 26px);
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left {
	flex-shrink: 0;
	flex-grow: 10;
	overflow: hidden;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .left > .monaco-icon-label {
	flex-shrink: 0;
}

.workbench-suggest-widget .monaco-list .monaco-list-row:not(.string-label) > .contents > .main > .left > .monaco-icon-label {
	max-width: 100%;
}

.workbench-suggest-widget .monaco-list .monaco-list-row.string-label > .contents > .main > .left > .monaco-icon-label {
	flex-shrink: 1;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right {
	overflow: hidden;
	flex-shrink: 10;
	max-width: 70%;
}

.workbench-suggest-widget .monaco-list .monaco-list-row > .contents > .main > .right > .readMore {
	display: inline-block;
	position: absolute;
	right: 10px;
	width: 18px;
	height: 18px;
	visibility: hidden;
}

.workbench-suggest-widget .suggest-details {
	display: flex;
	flex-direction: column;
	cursor: default;
	color: var(--vscode-editorSuggestWidget-foreground);
}

.workbench-suggest-widget .suggest-details:focus {
	border-color: var(--vscode-focusBorder);
}

.workbench-suggest-widget .suggest-details a {
	color: var(--vscode-textLink-foreground);
}

.workbench-suggest-widget .suggest-details a:hover {
	color: var(--vscode-textLink-activeForeground);
}

.workbench-suggest-widget .suggest-details code {
	background-color: var(--vscode-textCodeBlock-background);
}

.workbench-suggest-widget .suggest-details.no-docs {
	display: none;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element {
	flex: 1;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body {
	box-sizing: border-box;
	height: 100%;
	width: 100%;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .header > .type {
	flex: 2;
	overflow: hidden;
	text-overflow: ellipsis;
	opacity: 0.7;
	white-space: pre;
	margin: 0 24px 0 0;
	padding: 4px 0 4px 5px;
}

.workbench-suggest-widget .suggest-details.detail-and-doc > .monaco-scrollable-element > .body > .header > .type {
	padding-bottom: 12px;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .header > .type.auto-wrap {
	white-space: normal;
	word-break: break-all;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs {
	margin: 0;
	padding: 4px 5px;
	white-space: pre-wrap;
}

.workbench-suggest-widget .suggest-details.no-type > .monaco-scrollable-element > .body > .docs {
	margin-right: 24px;
	overflow: hidden;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs {
	padding: 0;
	white-space: initial;
	min-height: calc(1rem + 8px);
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div,
.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > span:not(:empty) {
	padding: 4px 5px;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:first-child {
	margin-top: 0;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs > div > p:last-child {
	margin-bottom: 0;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .monaco-tokenized-source {
	white-space: pre;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs .code {
	white-space: pre-wrap;
	word-wrap: break-word;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > .docs.markdown-docs .codicon {
	vertical-align: sub;
}

.workbench-suggest-widget .suggest-details > .monaco-scrollable-element > .body > p:empty {
	display: none;
}

.workbench-suggest-widget .suggest-details code {
	border-radius: 3px;
	padding: 0 0.4em;
}

.workbench-suggest-widget .suggest-details ul {
	padding-left: 20px;
}

.workbench-suggest-widget .suggest-details ol {
	padding-left: 20px;
}

.workbench-suggest-widget .suggest-details p code {
	font-family: var(--monaco-monospace-font);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/browser/telemetryService.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/browser/telemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILogService, ILoggerService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { OneDataSystemWebAppender } from '../../../../platform/telemetry/browser/1dsAppender.js';
import { ClassifiedEvent, IGDPRProperty, OmitMetadata, StrictPropertyCheck } from '../../../../platform/telemetry/common/gdprTypings.js';
import { ITelemetryData, ITelemetryService, TelemetryLevel, TELEMETRY_SETTING_ID } from '../../../../platform/telemetry/common/telemetry.js';
import { TelemetryLogAppender } from '../../../../platform/telemetry/common/telemetryLogAppender.js';
import { ITelemetryServiceConfig, TelemetryService as BaseTelemetryService } from '../../../../platform/telemetry/common/telemetryService.js';
import { getTelemetryLevel, isInternalTelemetry, isLoggingOnly, ITelemetryAppender, NullTelemetryService, supportsTelemetry } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { resolveWorkbenchCommonProperties } from './workbenchCommonProperties.js';

export class TelemetryService extends Disposable implements ITelemetryService {

	declare readonly _serviceBrand: undefined;

	private impl: ITelemetryService = NullTelemetryService;
	public readonly sendErrorTelemetry = true;

	get sessionId(): string { return this.impl.sessionId; }
	get machineId(): string { return this.impl.machineId; }
	get sqmId(): string { return this.impl.sqmId; }
	get devDeviceId(): string { return this.impl.devDeviceId; }
	get firstSessionDate(): string { return this.impl.firstSessionDate; }
	get msftInternal(): boolean | undefined { return this.impl.msftInternal; }

	constructor(
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@ILogService logService: ILogService,
		@ILoggerService loggerService: ILoggerService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IProductService productService: IProductService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService
	) {
		super();

		this.impl = this.initializeService(environmentService, logService, loggerService, configurationService, storageService, productService, remoteAgentService);

		// When the level changes it could change from off to on and we want to make sure telemetry is properly intialized
		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TELEMETRY_SETTING_ID)) {
				this.impl = this.initializeService(environmentService, logService, loggerService, configurationService, storageService, productService, remoteAgentService);
			}
		}));
	}

	/**
	 * Initializes the telemetry service to be a full fledged service.
	 * This is only done once and only when telemetry is enabled as this will also ping the endpoint to
	 * ensure its not adblocked and we can send telemetry
	 */
	private initializeService(
		environmentService: IBrowserWorkbenchEnvironmentService,
		logService: ILogService,
		loggerService: ILoggerService,
		configurationService: IConfigurationService,
		storageService: IStorageService,
		productService: IProductService,
		remoteAgentService: IRemoteAgentService
	) {
		const telemetrySupported = supportsTelemetry(productService, environmentService) && productService.aiConfig?.ariaKey;
		if (telemetrySupported && getTelemetryLevel(configurationService) !== TelemetryLevel.NONE && this.impl === NullTelemetryService) {
			// If remote server is present send telemetry through that, else use the client side appender
			const appenders: ITelemetryAppender[] = [];
			const isInternal = isInternalTelemetry(productService, configurationService);
			if (!isLoggingOnly(productService, environmentService)) {
				if (remoteAgentService.getConnection() !== null) {
					const remoteTelemetryProvider = {
						log: remoteAgentService.logTelemetry.bind(remoteAgentService),
						flush: remoteAgentService.flushTelemetry.bind(remoteAgentService)
					};
					appenders.push(remoteTelemetryProvider);
				} else {
					appenders.push(new OneDataSystemWebAppender(isInternal, 'monacoworkbench', null, productService.aiConfig?.ariaKey));
				}
			}
			appenders.push(new TelemetryLogAppender('', false, loggerService, environmentService, productService));
			const config: ITelemetryServiceConfig = {
				appenders,
				commonProperties: resolveWorkbenchCommonProperties(storageService, productService.commit, productService.version, isInternal, environmentService.remoteAuthority, productService.embedderIdentifier, productService.removeTelemetryMachineId, environmentService.options && environmentService.options.resolveCommonTelemetryProperties),
				sendErrorTelemetry: this.sendErrorTelemetry,
			};

			return this._register(new BaseTelemetryService(config, configurationService, productService));
		}
		return this.impl;
	}

	setExperimentProperty(name: string, value: string): void {
		return this.impl.setExperimentProperty(name, value);
	}

	get telemetryLevel(): TelemetryLevel {
		return this.impl.telemetryLevel;
	}

	publicLog(eventName: string, data?: ITelemetryData) {
		this.impl.publicLog(eventName, data);
	}

	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLog(eventName, data as ITelemetryData);
	}

	publicLogError(errorEventName: string, data?: ITelemetryData) {
		this.impl.publicLog(errorEventName, data);
	}

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLogError(eventName, data as ITelemetryData);
	}
}

registerSingleton(ITelemetryService, TelemetryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/browser/workbenchCommonProperties.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/browser/workbenchCommonProperties.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import * as Platform from '../../../../base/common/platform.js';
import * as uuid from '../../../../base/common/uuid.js';
import { cleanRemoteAuthority } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { mixin } from '../../../../base/common/objects.js';
import { ICommonProperties, firstSessionDateStorageKey, lastSessionDateStorageKey, machineIdKey } from '../../../../platform/telemetry/common/telemetry.js';
import { Gesture } from '../../../../base/browser/touch.js';

/**
 * General function to help reduce the individuality of user agents
 * @param userAgent userAgent from browser window
 * @returns A simplified user agent with less detail
 */
function cleanUserAgent(userAgent: string): string {
	return userAgent.replace(/(\d+\.\d+)(\.\d+)+/g, '$1');
}

export function resolveWorkbenchCommonProperties(
	storageService: IStorageService,
	commit: string | undefined,
	version: string | undefined,
	isInternalTelemetry: boolean,
	remoteAuthority?: string,
	productIdentifier?: string,
	removeMachineId?: boolean,
	resolveAdditionalProperties?: () => { [key: string]: unknown }
): ICommonProperties {
	const result: ICommonProperties = Object.create(null);
	const firstSessionDate = storageService.get(firstSessionDateStorageKey, StorageScope.APPLICATION)!;
	const lastSessionDate = storageService.get(lastSessionDateStorageKey, StorageScope.APPLICATION)!;

	let machineId: string | undefined;
	if (!removeMachineId) {
		machineId = storageService.get(machineIdKey, StorageScope.APPLICATION);
		if (!machineId) {
			machineId = uuid.generateUuid();
			storageService.store(machineIdKey, machineId, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}
	} else {
		machineId = `Redacted-${productIdentifier ?? 'web'}`;
	}


	/**
	 * Note: In the web, session date information is fetched from browser storage, so these dates are tied to a specific
	 * browser and not the machine overall.
	 */
	// __GDPR__COMMON__ "common.firstSessionDate" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.firstSessionDate'] = firstSessionDate;
	// __GDPR__COMMON__ "common.lastSessionDate" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.lastSessionDate'] = lastSessionDate || '';
	// __GDPR__COMMON__ "common.isNewSession" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.isNewSession'] = !lastSessionDate ? '1' : '0';
	// __GDPR__COMMON__ "common.remoteAuthority" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.remoteAuthority'] = cleanRemoteAuthority(remoteAuthority);

	// __GDPR__COMMON__ "common.machineId" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
	result['common.machineId'] = machineId;
	// __GDPR__COMMON__ "sessionID" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['sessionID'] = uuid.generateUuid() + Date.now();
	// __GDPR__COMMON__ "commitHash" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['commitHash'] = commit;
	// __GDPR__COMMON__ "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['version'] = version;
	// __GDPR__COMMON__ "common.platform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.platform'] = Platform.PlatformToString(Platform.platform);
	// __GDPR__COMMON__ "common.product" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.product'] = productIdentifier ?? 'web';
	// __GDPR__COMMON__ "common.userAgent" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.userAgent'] = Platform.userAgent ? cleanUserAgent(Platform.userAgent) : undefined;
	// __GDPR__COMMON__ "common.isTouchDevice" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.isTouchDevice'] = String(Gesture.isTouchDevice());

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

	if (resolveAdditionalProperties) {
		mixin(result, resolveAdditionalProperties());
	}

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/common/workbenchCommonProperties.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/common/workbenchCommonProperties.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStorageService, StorageScope } from '../../../../platform/storage/common/storage.js';
import { resolveCommonProperties } from '../../../../platform/telemetry/common/commonProperties.js';
import { ICommonProperties, firstSessionDateStorageKey, lastSessionDateStorageKey } from '../../../../platform/telemetry/common/telemetry.js';
import { cleanRemoteAuthority } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { INodeProcess } from '../../../../base/common/platform.js';

export function resolveWorkbenchCommonProperties(
	storageService: IStorageService,
	release: string,
	hostname: string,
	commit: string | undefined,
	version: string | undefined,
	machineId: string,
	sqmId: string,
	devDeviceId: string,
	isInternalTelemetry: boolean,
	process: INodeProcess,
	releaseDate: string | undefined,
	remoteAuthority?: string,
): ICommonProperties {
	const result = resolveCommonProperties(release, hostname, process.arch, commit, version, machineId, sqmId, devDeviceId, isInternalTelemetry, releaseDate);
	const firstSessionDate = storageService.get(firstSessionDateStorageKey, StorageScope.APPLICATION)!;
	const lastSessionDate = storageService.get(lastSessionDateStorageKey, StorageScope.APPLICATION)!;

	// __GDPR__COMMON__ "common.version.shell" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.version.shell'] = process.versions?.['electron'];
	// __GDPR__COMMON__ "common.version.renderer" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.version.renderer'] = process.versions?.['chrome'];
	// __GDPR__COMMON__ "common.firstSessionDate" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.firstSessionDate'] = firstSessionDate;
	// __GDPR__COMMON__ "common.lastSessionDate" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.lastSessionDate'] = lastSessionDate || '';
	// __GDPR__COMMON__ "common.isNewSession" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.isNewSession'] = !lastSessionDate ? '1' : '0';
	// __GDPR__COMMON__ "common.remoteAuthority" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
	result['common.remoteAuthority'] = cleanRemoteAuthority(remoteAuthority);
	// __GDPR__COMMON__ "common.cli" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	result['common.cli'] = !!process.env['VSCODE_CLI'];

	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/electron-browser/telemetryService.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/electron-browser/telemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITelemetryService, ITelemetryData, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { supportsTelemetry, NullTelemetryService, getPiiPathsFromEnvironment, isInternalTelemetry } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { TelemetryAppenderClient } from '../../../../platform/telemetry/common/telemetryIpc.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { resolveWorkbenchCommonProperties } from '../common/workbenchCommonProperties.js';
import { TelemetryService as BaseTelemetryService, ITelemetryServiceConfig } from '../../../../platform/telemetry/common/telemetryService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ClassifiedEvent, StrictPropertyCheck, OmitMetadata, IGDPRProperty } from '../../../../platform/telemetry/common/gdprTypings.js';
import { process } from '../../../../base/parts/sandbox/electron-browser/globals.js';

export class TelemetryService extends Disposable implements ITelemetryService {

	declare readonly _serviceBrand: undefined;

	private impl: ITelemetryService;
	public readonly sendErrorTelemetry: boolean;

	get sessionId(): string { return this.impl.sessionId; }
	get machineId(): string { return this.impl.machineId; }
	get sqmId(): string { return this.impl.sqmId; }
	get devDeviceId(): string { return this.impl.devDeviceId; }
	get firstSessionDate(): string { return this.impl.firstSessionDate; }
	get msftInternal(): boolean | undefined { return this.impl.msftInternal; }

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IProductService productService: IProductService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService
	) {
		super();

		if (supportsTelemetry(productService, environmentService)) {
			const isInternal = isInternalTelemetry(productService, configurationService);
			const channel = sharedProcessService.getChannel('telemetryAppender');
			const config: ITelemetryServiceConfig = {
				appenders: [new TelemetryAppenderClient(channel)],
				commonProperties: resolveWorkbenchCommonProperties(storageService, environmentService.os.release, environmentService.os.hostname, productService.commit, productService.version, environmentService.machineId, environmentService.sqmId, environmentService.devDeviceId, isInternal, process, productService.date, environmentService.remoteAuthority),
				piiPaths: getPiiPathsFromEnvironment(environmentService),
				sendErrorTelemetry: true
			};

			this.impl = this._register(new BaseTelemetryService(config, configurationService, productService));
		} else {
			this.impl = NullTelemetryService;
		}

		this.sendErrorTelemetry = this.impl.sendErrorTelemetry;
	}

	setExperimentProperty(name: string, value: string): void {
		return this.impl.setExperimentProperty(name, value);
	}

	get telemetryLevel(): TelemetryLevel {
		return this.impl.telemetryLevel;
	}

	publicLog(eventName: string, data?: ITelemetryData) {
		this.impl.publicLog(eventName, data);
	}

	publicLog2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLog(eventName, data as ITelemetryData);
	}

	publicLogError(errorEventName: string, data?: ITelemetryData) {
		this.impl.publicLogError(errorEventName, data);
	}

	publicLogError2<E extends ClassifiedEvent<OmitMetadata<T>> = never, T extends IGDPRProperty = never>(eventName: string, data?: StrictPropertyCheck<T, E>) {
		this.publicLogError(eventName, data as ITelemetryData);
	}
}

registerSingleton(ITelemetryService, TelemetryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/test/browser/commonProperties.test.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/test/browser/commonProperties.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import assert from 'assert';
import { resolveWorkbenchCommonProperties } from '../../browser/workbenchCommonProperties.js';
import { InMemoryStorageService } from '../../../../../platform/storage/common/storage.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { hasKey } from '../../../../../base/common/types.js';

suite('Browser Telemetry - common properties', function () {

	const commit: string = (undefined)!;
	const version: string = (undefined)!;
	let testStorageService: InMemoryStorageService;

	teardown(() => {
		testStorageService.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		testStorageService = new InMemoryStorageService();
	});

	test('mixes in additional properties', async function () {
		const resolveCommonTelemetryProperties = () => {
			return {
				'userId': '1'
			};
		};

		const props = resolveWorkbenchCommonProperties(testStorageService, commit, version, false, undefined, undefined, false, resolveCommonTelemetryProperties);

		assert.ok(hasKey(props, {
			commitHash: true,
			sessionID: true,
			timestamp: true,
			'common.platform': true,
			'common.timesincesessionstart': true,
			'common.sequence': true,
			version: true,
			'common.firstSessionDate': true,
			'common.lastSessionDate': true,
			'common.isNewSession': true,
			'common.machineId': true
		}));
		assert.strictEqual(props['userId'], '1');
	});

	test('mixes in additional dyanmic properties', async function () {
		let i = 1;
		const resolveCommonTelemetryProperties = () => {
			return Object.defineProperties({}, {
				'userId': {
					get: () => {
						return i++;
					},
					enumerable: true
				}
			});
		};

		const props = resolveWorkbenchCommonProperties(testStorageService, commit, version, false, undefined, undefined, false, resolveCommonTelemetryProperties);
		assert.strictEqual(props['userId'], 1);

		const props2 = resolveWorkbenchCommonProperties(testStorageService, commit, version, false, undefined, undefined, false, resolveCommonTelemetryProperties);
		assert.strictEqual(props2['userId'], 2);
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/telemetry/test/node/commonProperties.test.ts]---
Location: vscode-main/src/vs/workbench/services/telemetry/test/node/commonProperties.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { release, hostname } from 'os';
import { resolveWorkbenchCommonProperties } from '../../common/workbenchCommonProperties.js';
import { StorageScope, InMemoryStorageService, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { timeout } from '../../../../../base/common/async.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { hasKey } from '../../../../../base/common/types.js';

suite('Telemetry - common properties', function () {
	const commit: string = (undefined)!;
	const version: string = (undefined)!;
	const date = undefined;
	let testStorageService: InMemoryStorageService;

	teardown(() => {
		testStorageService.dispose();
	});

	ensureNoDisposablesAreLeakedInTestSuite();

	setup(() => {
		testStorageService = new InMemoryStorageService();
	});

	test('default', function () {
		const props = resolveWorkbenchCommonProperties(testStorageService, release(), hostname(), commit, version, 'someMachineId', 'someSqmId', 'somedevDeviceId', false, process, date);
		assert.ok(hasKey(props, {
			commitHash: true,
			sessionID: true,
			timestamp: true,
			'common.platform': true,
			'common.nodePlatform': true,
			'common.nodeArch': true,
			'common.timesincesessionstart': true,
			'common.sequence': true,
			// 'common.version.shell': true, // only when running on electron
			// 'common.version.renderer': true,
			'common.platformVersion': true,
			version: true,
			'common.releaseDate': true,
			'common.firstSessionDate': true,
			'common.lastSessionDate': true,
			'common.isNewSession': true,
			'common.machineId': true
		}));
	});

	test('lastSessionDate when available', function () {

		testStorageService.store('telemetry.lastSessionDate', new Date().toUTCString(), StorageScope.APPLICATION, StorageTarget.MACHINE);

		const props = resolveWorkbenchCommonProperties(testStorageService, release(), hostname(), commit, version, 'someMachineId', 'someSqmId', 'somedevDeviceId', false, process, date);
		assert.ok(props['common.lastSessionDate']); // conditional, see below
		assert.ok(props['common.isNewSession']);
		assert.strictEqual(props['common.isNewSession'], '0');
	});

	test('values chance on ask', async function () {
		const props = resolveWorkbenchCommonProperties(testStorageService, release(), hostname(), commit, version, 'someMachineId', 'someSqmId', 'somedevDeviceId', false, process, date);
		let value1 = props['common.sequence'];
		let value2 = props['common.sequence'];
		assert.ok(value1 !== value2, 'seq');

		value1 = props['timestamp'];
		value2 = props['timestamp'];
		assert.ok(value1 !== value2, 'timestamp');

		value1 = props['common.timesincesessionstart'];
		await timeout(10);
		value2 = props['common.timesincesessionstart'];
		assert.ok(value1 !== value2, 'timesincesessionstart');
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/terminal/common/embedderTerminalService.ts]---
Location: vscode-main/src/vs/workbench/services/terminal/common/embedderTerminalService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IProcessDataEvent, IProcessProperty, IProcessPropertyMap, IProcessReadyEvent, IShellLaunchConfig, ITerminalChildProcess, ITerminalLaunchError, ProcessPropertyType } from '../../../../platform/terminal/common/terminal.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export const IEmbedderTerminalService = createDecorator<IEmbedderTerminalService>('embedderTerminalService');

/**
 * Manages terminals that the embedder can create before the terminal contrib is available.
 */
export interface IEmbedderTerminalService {
	readonly _serviceBrand: undefined;

	readonly onDidCreateTerminal: Event<IShellLaunchConfig>;

	createTerminal(options: IEmbedderTerminalOptions): void;
}

export type EmbedderTerminal = IShellLaunchConfig & Required<Pick<IShellLaunchConfig, 'customPtyImplementation'>>;

export interface IEmbedderTerminalOptions {
	name: string;
	pty: IEmbedderTerminalPty;

	// Extension APIs that have not been implemented for embedders:
	//   iconPath?: URI | { light: URI; dark: URI } | ThemeIcon;
	//   color?: ThemeColor;
	//   location?: TerminalLocation | TerminalEditorLocationOptions | TerminalSplitLocationOptions;
	//   isTransient?: boolean;
}

/**
 * See Pseudoterminal on the vscode API for usage.
 */
export interface IEmbedderTerminalPty {
	readonly onDidWrite: Event<string>;
	readonly onDidClose?: Event<void | number>;
	readonly onDidChangeName?: Event<string>;

	open(): void;
	close(): void;

	// Extension APIs that have not been implemented for embedders:
	//   onDidOverrideDimensions?: Event<TerminalDimensions | undefined>;
	//   handleInput?(data: string): void;
	//   setDimensions?(dimensions: TerminalDimensions): void;
}

class EmbedderTerminalService implements IEmbedderTerminalService {
	declare _serviceBrand: undefined;

	private readonly _onDidCreateTerminal = new Emitter<IShellLaunchConfig>();
	readonly onDidCreateTerminal = Event.buffer(this._onDidCreateTerminal.event);

	createTerminal(options: IEmbedderTerminalOptions): void {
		const slc: EmbedderTerminal = {
			name: options.name,
			isFeatureTerminal: true,
			customPtyImplementation(terminalId, cols, rows) {
				return new EmbedderTerminalProcess(terminalId, options.pty);
			},
		};
		this._onDidCreateTerminal.fire(slc);
	}
}


class EmbedderTerminalProcess extends Disposable implements ITerminalChildProcess {
	private readonly _pty: IEmbedderTerminalPty;

	readonly shouldPersist = false;

	readonly onProcessData: Event<IProcessDataEvent | string>;
	private readonly _onProcessReady = this._register(new Emitter<IProcessReadyEvent>());
	readonly onProcessReady = this._onProcessReady.event;
	private readonly _onDidChangeProperty = this._register(new Emitter<IProcessProperty>());
	readonly onDidChangeProperty = this._onDidChangeProperty.event;
	private readonly _onProcessExit = this._register(new Emitter<number | undefined>());
	readonly onProcessExit = this._onProcessExit.event;

	constructor(
		readonly id: number,
		pty: IEmbedderTerminalPty
	) {
		super();

		this._pty = pty;
		this.onProcessData = this._pty.onDidWrite;
		if (this._pty.onDidClose) {
			this._register(this._pty.onDidClose(e => this._onProcessExit.fire(e || undefined)));
		}
		if (this._pty.onDidChangeName) {
			this._register(this._pty.onDidChangeName(e => this._onDidChangeProperty.fire({
				type: ProcessPropertyType.Title,
				value: e
			})));
		}
	}

	async start(): Promise<ITerminalLaunchError | undefined> {
		this._onProcessReady.fire({ pid: -1, cwd: '', windowsPty: undefined });
		this._pty.open();
		return undefined;
	}
	shutdown(): void {
		this._pty.close();
	}

	// TODO: A lot of these aren't useful for some implementations of ITerminalChildProcess, should
	// they be optional? Should there be a base class for "external" consumers to implement?

	input(): void {
		// not supported
	}
	sendSignal(): void {
		// not supported
	}
	async processBinary(): Promise<void> {
		// not supported
	}
	resize(): void {
		// no-op
	}
	clearBuffer(): void {
		// no-op
	}
	acknowledgeDataEvent(): void {
		// no-op, flow control not currently implemented
	}
	async setUnicodeVersion(): Promise<void> {
		// no-op
	}
	async getInitialCwd(): Promise<string> {
		return '';
	}
	async getCwd(): Promise<string> {
		return '';
	}
	refreshProperty<T extends ProcessPropertyType>(property: ProcessPropertyType): Promise<IProcessPropertyMap[T]> {
		throw new Error(`refreshProperty is not suppported in EmbedderTerminalProcess. property: ${property}`);
	}

	updateProperty(property: ProcessPropertyType, value: unknown): Promise<void> {
		throw new Error(`updateProperty is not suppported in EmbedderTerminalProcess. property: ${property}, value: ${value}`);
	}
}

registerSingleton(IEmbedderTerminalService, EmbedderTerminalService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/textfile/browser/browserTextFileService.ts]---
Location: vscode-main/src/vs/workbench/services/textfile/browser/browserTextFileService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AbstractTextFileService } from './textFileService.js';
import { ITextFileService, TextFileEditorModelState } from '../common/textfiles.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IElevatedFileService } from '../../files/common/elevatedFileService.js';
import { IFilesConfigurationService } from '../../filesConfiguration/common/filesConfigurationService.js';
import { ILifecycleService } from '../../lifecycle/common/lifecycle.js';
import { IPathService } from '../../path/common/pathService.js';
import { IUntitledTextEditorModelManager, IUntitledTextEditorService } from '../../untitled/common/untitledTextEditorService.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IWorkingCopyFileService } from '../../workingCopy/common/workingCopyFileService.js';
import { IDecorationsService } from '../../decorations/common/decorations.js';

export class BrowserTextFileService extends AbstractTextFileService {

	constructor(
		@IFileService fileService: IFileService,
		@IUntitledTextEditorService untitledTextEditorService: IUntitledTextEditorModelManager,
		@ILifecycleService lifecycleService: ILifecycleService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IModelService modelService: IModelService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IDialogService dialogService: IDialogService,
		@IFileDialogService fileDialogService: IFileDialogService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@IPathService pathService: IPathService,
		@IWorkingCopyFileService workingCopyFileService: IWorkingCopyFileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILanguageService languageService: ILanguageService,
		@IElevatedFileService elevatedFileService: IElevatedFileService,
		@ILogService logService: ILogService,
		@IDecorationsService decorationsService: IDecorationsService
	) {
		super(fileService, untitledTextEditorService, lifecycleService, instantiationService, modelService, environmentService, dialogService, fileDialogService, textResourceConfigurationService, filesConfigurationService, codeEditorService, pathService, workingCopyFileService, uriIdentityService, languageService, logService, elevatedFileService, decorationsService);

		this.registerListeners();
	}

	private registerListeners(): void {

		// Lifecycle
		this._register(this.lifecycleService.onBeforeShutdown(event => event.veto(this.onBeforeShutdown(), 'veto.textFiles')));
	}

	private onBeforeShutdown(): boolean {
		if (this.files.models.some(model => model.hasState(TextFileEditorModelState.PENDING_SAVE))) {
			return true; // files are pending to be saved: veto (as there is no support for long running operations on shutdown)
		}

		return false;
	}
}

registerSingleton(ITextFileService, BrowserTextFileService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

````
