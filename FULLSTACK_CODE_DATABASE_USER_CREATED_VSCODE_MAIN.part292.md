---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 292
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 292 of 552)

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

---[FILE: src/vs/platform/userDataSync/common/userDataAutoSyncService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataAutoSyncService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancelablePromise, createCancelablePromise, disposableTimeout, ThrottledDelayer, timeout } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { toLocalISOString } from '../../../base/common/date.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { isCancellationError } from '../../../base/common/errors.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, IDisposable, MutableDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { isWeb } from '../../../base/common/platform.js';
import { isEqual } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IProductService } from '../../product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUserDataSyncTask, IUserDataAutoSyncService, IUserDataManifest, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncService, IUserDataSyncStoreManagementService, IUserDataSyncStoreService, UserDataAutoSyncError, UserDataSyncError, UserDataSyncErrorCode, SyncOptions } from './userDataSync.js';
import { IUserDataSyncAccountService } from './userDataSyncAccount.js';
import { IUserDataSyncMachinesService } from './userDataSyncMachines.js';

const disableMachineEventuallyKey = 'sync.disableMachineEventually';
const sessionIdKey = 'sync.sessionId';
const storeUrlKey = 'sync.storeUrl';
const productQualityKey = 'sync.productQuality';

export class UserDataAutoSyncService extends Disposable implements IUserDataAutoSyncService {

	_serviceBrand: undefined;

	private readonly autoSync = this._register(new MutableDisposable<AutoSync>());
	private successiveFailures: number = 0;
	private lastSyncTriggerTime: number | undefined = undefined;
	private readonly syncTriggerDelayer: ThrottledDelayer<void>;
	private suspendUntilRestart: boolean = false;

	private readonly _onError: Emitter<UserDataSyncError> = this._register(new Emitter<UserDataSyncError>());
	readonly onError: Event<UserDataSyncError> = this._onError.event;

	private lastSyncUrl: URI | undefined;
	private get syncUrl(): URI | undefined {
		const value = this.storageService.get(storeUrlKey, StorageScope.APPLICATION);
		return value ? URI.parse(value) : undefined;
	}
	private set syncUrl(syncUrl: URI | undefined) {
		if (syncUrl) {
			this.storageService.store(storeUrlKey, syncUrl.toString(), StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(storeUrlKey, StorageScope.APPLICATION);
		}
	}

	private previousProductQuality: string | undefined;
	private get productQuality(): string | undefined {
		return this.storageService.get(productQualityKey, StorageScope.APPLICATION);
	}
	private set productQuality(productQuality: string | undefined) {
		if (productQuality) {
			this.storageService.store(productQualityKey, productQuality, StorageScope.APPLICATION, StorageTarget.MACHINE);
		} else {
			this.storageService.remove(productQualityKey, StorageScope.APPLICATION);
		}
	}

	constructor(
		@IProductService productService: IProductService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IUserDataSyncStoreService private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@IUserDataSyncAccountService private readonly userDataSyncAccountService: IUserDataSyncAccountService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IUserDataSyncMachinesService private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
		@IStorageService private readonly storageService: IStorageService,
	) {
		super();
		this.syncTriggerDelayer = this._register(new ThrottledDelayer<void>(this.getSyncTriggerDelayTime()));

		this.lastSyncUrl = this.syncUrl;
		this.syncUrl = userDataSyncStoreManagementService.userDataSyncStore?.url;

		this.previousProductQuality = this.productQuality;
		this.productQuality = productService.quality;

		if (this.syncUrl) {

			this.logService.info('[AutoSync] Using settings sync service', this.syncUrl.toString());
			this._register(userDataSyncStoreManagementService.onDidChangeUserDataSyncStore(() => {
				if (!isEqual(this.syncUrl, userDataSyncStoreManagementService.userDataSyncStore?.url)) {
					this.lastSyncUrl = this.syncUrl;
					this.syncUrl = userDataSyncStoreManagementService.userDataSyncStore?.url;
					if (this.syncUrl) {
						this.logService.info('[AutoSync] Using settings sync service', this.syncUrl.toString());
					}
				}
			}));

			if (this.userDataSyncEnablementService.isEnabled()) {
				this.logService.info('[AutoSync] Enabled.');
			} else {
				this.logService.info('[AutoSync] Disabled.');
			}
			this.updateAutoSync();

			if (this.hasToDisableMachineEventually()) {
				this.disableMachineEventually();
			}

			this._register(userDataSyncAccountService.onDidChangeAccount(() => this.updateAutoSync()));
			this._register(userDataSyncStoreService.onDidChangeDonotMakeRequestsUntil(() => this.updateAutoSync()));
			this._register(userDataSyncService.onDidChangeLocal(source => this.triggerSync([source])));
			this._register(Event.filter(this.userDataSyncEnablementService.onDidChangeResourceEnablement, ([, enabled]) => enabled)(() => this.triggerSync(['resourceEnablement'])));
			this._register(this.userDataSyncStoreManagementService.onDidChangeUserDataSyncStore(() => this.triggerSync(['userDataSyncStoreChanged'])));
		}
	}

	private updateAutoSync(): void {
		const { enabled, message } = this.isAutoSyncEnabled();
		if (enabled) {
			if (this.autoSync.value === undefined) {
				this.autoSync.value = new AutoSync(this.lastSyncUrl, 1000 * 60 * 5 /* 5 miutes */, this.userDataSyncStoreManagementService, this.userDataSyncStoreService, this.userDataSyncService, this.userDataSyncMachinesService, this.logService, this.telemetryService, this.storageService);
				this.autoSync.value.register(this.autoSync.value.onDidStartSync(() => this.lastSyncTriggerTime = new Date().getTime()));
				this.autoSync.value.register(this.autoSync.value.onDidFinishSync(e => this.onDidFinishSync(e)));
				if (this.startAutoSync()) {
					this.autoSync.value.start();
				}
			}
		} else {
			this.syncTriggerDelayer.cancel();
			if (this.autoSync.value !== undefined) {
				if (message) {
					this.logService.info(message);
				}
				this.autoSync.clear();
			}

			/* log message when auto sync is not disabled by user */
			else if (message && this.userDataSyncEnablementService.isEnabled()) {
				this.logService.info(message);
			}
		}
	}

	// For tests purpose only
	protected startAutoSync(): boolean { return true; }

	private isAutoSyncEnabled(): { enabled: boolean; message?: string } {
		if (!this.userDataSyncEnablementService.isEnabled()) {
			return { enabled: false, message: '[AutoSync] Disabled.' };
		}
		if (!this.userDataSyncAccountService.account) {
			return { enabled: false, message: '[AutoSync] Suspended until auth token is available.' };
		}
		if (this.userDataSyncStoreService.donotMakeRequestsUntil) {
			return { enabled: false, message: `[AutoSync] Suspended until ${toLocalISOString(this.userDataSyncStoreService.donotMakeRequestsUntil)} because server is not accepting requests until then.` };
		}
		if (this.suspendUntilRestart) {
			return { enabled: false, message: '[AutoSync] Suspended until restart.' };
		}
		return { enabled: true };
	}

	async turnOn(): Promise<void> {
		this.stopDisableMachineEventually();
		this.lastSyncUrl = this.syncUrl;
		this.updateEnablement(true);
	}

	async turnOff(everywhere: boolean, softTurnOffOnError?: boolean, donotRemoveMachine?: boolean): Promise<void> {
		try {

			// Remove machine
			if (this.userDataSyncAccountService.account && !donotRemoveMachine) {
				await this.userDataSyncMachinesService.removeCurrentMachine();
			}

			// Disable Auto Sync
			this.updateEnablement(false);

			// Reset Session
			this.storageService.remove(sessionIdKey, StorageScope.APPLICATION);

			// Reset
			if (everywhere) {
				await this.userDataSyncService.reset();
			} else {
				await this.userDataSyncService.resetLocal();
			}
		} catch (error) {
			this.logService.error(error);
			if (softTurnOffOnError) {
				this.updateEnablement(false);
			} else {
				throw error;
			}
		}
	}

	private updateEnablement(enabled: boolean): void {
		if (this.userDataSyncEnablementService.isEnabled() !== enabled) {
			this.userDataSyncEnablementService.setEnablement(enabled);
			this.updateAutoSync();
		}
	}

	private hasProductQualityChanged(): boolean {
		return !!this.previousProductQuality && !!this.productQuality && this.previousProductQuality !== this.productQuality;
	}

	private async onDidFinishSync(error: Error | undefined): Promise<void> {
		this.logService.debug('[AutoSync] Sync Finished');
		if (!error) {
			// Sync finished without errors
			this.successiveFailures = 0;
			return;
		}

		// Error while syncing
		const userDataSyncError = UserDataSyncError.toUserDataSyncError(error);

		// Session got expired
		if (userDataSyncError.code === UserDataSyncErrorCode.SessionExpired) {
			await this.turnOff(false, true /* force soft turnoff on error */);
			this.logService.info('[AutoSync] Turned off sync because current session is expired');
		}

		// Turned off from another device
		else if (userDataSyncError.code === UserDataSyncErrorCode.TurnedOff) {
			await this.turnOff(false, true /* force soft turnoff on error */);
			this.logService.info('[AutoSync] Turned off sync because sync is turned off in the cloud');
		}

		// Exceeded Rate Limit on Client
		else if (userDataSyncError.code === UserDataSyncErrorCode.LocalTooManyRequests) {
			this.suspendUntilRestart = true;
			this.logService.info('[AutoSync] Suspended sync because of making too many requests to server');
			this.updateAutoSync();
		}

		// Exceeded Rate Limit on Server
		else if (userDataSyncError.code === UserDataSyncErrorCode.TooManyRequests) {
			await this.turnOff(false, true /* force soft turnoff on error */,
				true /* do not disable machine because disabling a machine makes request to server and can fail with TooManyRequests */);
			this.disableMachineEventually();
			this.logService.info('[AutoSync] Turned off sync because of making too many requests to server');
		}

		// Method Not Found
		else if (userDataSyncError.code === UserDataSyncErrorCode.MethodNotFound) {
			await this.turnOff(false, true /* force soft turnoff on error */);
			this.logService.info('[AutoSync] Turned off sync because current client is making requests to server that are not supported');
		}

		// Upgrade Required or Gone
		else if (userDataSyncError.code === UserDataSyncErrorCode.UpgradeRequired || userDataSyncError.code === UserDataSyncErrorCode.Gone) {
			await this.turnOff(false, true /* force soft turnoff on error */,
				true /* do not disable machine because disabling a machine makes request to server and can fail with upgrade required or gone */);
			this.disableMachineEventually();
			this.logService.info('[AutoSync] Turned off sync because current client is not compatible with server. Requires client upgrade.');
		}

		// Incompatible Local Content
		else if (userDataSyncError.code === UserDataSyncErrorCode.IncompatibleLocalContent) {
			await this.turnOff(false, true /* force soft turnoff on error */);
			this.logService.info(`[AutoSync] Turned off sync because server has ${userDataSyncError.resource} content with newer version than of client. Requires client upgrade.`);
		}

		// Incompatible Remote Content
		else if (userDataSyncError.code === UserDataSyncErrorCode.IncompatibleRemoteContent) {
			await this.turnOff(false, true /* force soft turnoff on error */);
			this.logService.info(`[AutoSync] Turned off sync because server has ${userDataSyncError.resource} content with older version than of client. Requires server reset.`);
		}

		// Service changed
		else if (userDataSyncError.code === UserDataSyncErrorCode.ServiceChanged || userDataSyncError.code === UserDataSyncErrorCode.DefaultServiceChanged) {

			// Check if default settings sync service has changed in web without changing the product quality
			// Then turn off settings sync and ask user to turn on again
			if (isWeb && userDataSyncError.code === UserDataSyncErrorCode.DefaultServiceChanged && !this.hasProductQualityChanged()) {
				await this.turnOff(false, true /* force soft turnoff on error */);
				this.logService.info('[AutoSync] Turned off sync because default sync service is changed.');
			}

			// Service has changed by the user. So turn off and turn on sync.
			// Show a prompt to the user about service change.
			else {
				await this.turnOff(false, true /* force soft turnoff on error */, true /* do not disable machine */);
				await this.turnOn();
				this.logService.info('[AutoSync] Sync Service changed. Turned off auto sync, reset local state and turned on auto sync.');
			}

		}

		else {
			this.logService.error(userDataSyncError);
			this.successiveFailures++;
		}

		this._onError.fire(userDataSyncError);
	}

	private async disableMachineEventually(): Promise<void> {
		this.storageService.store(disableMachineEventuallyKey, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
		await timeout(1000 * 60 * 10);

		// Return if got stopped meanwhile.
		if (!this.hasToDisableMachineEventually()) {
			return;
		}

		this.stopDisableMachineEventually();

		// disable only if sync is disabled
		if (!this.userDataSyncEnablementService.isEnabled() && this.userDataSyncAccountService.account) {
			await this.userDataSyncMachinesService.removeCurrentMachine();
		}
	}

	private hasToDisableMachineEventually(): boolean {
		return this.storageService.getBoolean(disableMachineEventuallyKey, StorageScope.APPLICATION, false);
	}

	private stopDisableMachineEventually(): void {
		this.storageService.remove(disableMachineEventuallyKey, StorageScope.APPLICATION);
	}

	private sources: string[] = [];
	async triggerSync(sources: string[], options?: SyncOptions): Promise<void> {
		if (this.autoSync.value === undefined) {
			return this.syncTriggerDelayer.cancel();
		}

		if (options?.skipIfSyncedRecently && this.lastSyncTriggerTime && new Date().getTime() - this.lastSyncTriggerTime < 10_000) {
			this.logService.debug('[AutoSync] Skipping because sync was triggered recently.', sources);
			return;
		}

		this.sources.push(...sources);
		return this.syncTriggerDelayer.trigger(async () => {
			this.logService.trace('[AutoSync] Activity sources', ...this.sources);
			this.sources = [];
			if (this.autoSync.value) {
				await this.autoSync.value.sync('Activity', !!options?.disableCache);
			}
		}, this.successiveFailures
			? Math.min(this.getSyncTriggerDelayTime() * this.successiveFailures, 60_000) /* Delay linearly until max 1 minute */
			: options?.immediately ? 0 : this.getSyncTriggerDelayTime());

	}

	protected getSyncTriggerDelayTime(): number {
		if (this.lastSyncTriggerTime && new Date().getTime() - this.lastSyncTriggerTime > 10_000) {
			this.logService.debug('[AutoSync] Sync immediately because last sync was triggered more than 10 seconds ago.');
			return 0;
		}
		return 3_000; /* Debounce for 3 seconds if there are no failures */
	}

}

class AutoSync extends Disposable {

	private static readonly INTERVAL_SYNCING = 'Interval';

	private readonly intervalHandler = this._register(new MutableDisposable<IDisposable>());

	private readonly _onDidStartSync = this._register(new Emitter<void>());
	readonly onDidStartSync = this._onDidStartSync.event;

	private readonly _onDidFinishSync = this._register(new Emitter<Error | undefined>());
	readonly onDidFinishSync = this._onDidFinishSync.event;

	private manifest: IUserDataManifest | null = null;
	private syncTask: IUserDataSyncTask | undefined;
	private syncPromise: CancelablePromise<void> | undefined;

	constructor(
		private readonly lastSyncUrl: URI | undefined,
		private readonly interval: number /* in milliseconds */,
		private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		private readonly userDataSyncService: IUserDataSyncService,
		private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
		private readonly logService: IUserDataSyncLogService,
		private readonly telemetryService: ITelemetryService,
		private readonly storageService: IStorageService,
	) {
		super();
	}

	start(): void {
		this._register(this.onDidFinishSync(() => this.waitUntilNextIntervalAndSync()));
		this._register(toDisposable(() => {
			if (this.syncPromise) {
				this.syncPromise.cancel();
				this.logService.info('[AutoSync] Cancelled sync that is in progress');
				this.syncPromise = undefined;
			}
			this.syncTask?.stop();
			this.logService.info('[AutoSync] Stopped');
		}));
		this.sync(AutoSync.INTERVAL_SYNCING, false);
	}

	private waitUntilNextIntervalAndSync(): void {
		this.intervalHandler.value = disposableTimeout(() => {
			this.sync(AutoSync.INTERVAL_SYNCING, false);
			this.intervalHandler.value = undefined;
		}, this.interval);
	}

	sync(reason: string, disableCache: boolean): Promise<void> {
		const syncPromise = createCancelablePromise(async token => {
			if (this.syncPromise) {
				try {
					// Wait until existing sync is finished
					this.logService.debug('[AutoSync] Waiting until sync is finished.');
					await this.syncPromise;
				} catch (error) {
					if (isCancellationError(error)) {
						// Cancelled => Disposed. Donot continue sync.
						return;
					}
				}
			}
			return this.doSync(reason, disableCache, token);
		});
		this.syncPromise = syncPromise;
		this.syncPromise.finally(() => this.syncPromise = undefined);
		return this.syncPromise;
	}

	private hasSyncServiceChanged(): boolean {
		return this.lastSyncUrl !== undefined && !isEqual(this.lastSyncUrl, this.userDataSyncStoreManagementService.userDataSyncStore?.url);
	}

	private async hasDefaultServiceChanged(): Promise<boolean> {
		const previous = await this.userDataSyncStoreManagementService.getPreviousUserDataSyncStore();
		const current = this.userDataSyncStoreManagementService.userDataSyncStore;
		// check if defaults changed
		return !!current && !!previous &&
			(!isEqual(current.defaultUrl, previous.defaultUrl) ||
				!isEqual(current.insidersUrl, previous.insidersUrl) ||
				!isEqual(current.stableUrl, previous.stableUrl));
	}

	private async doSync(reason: string, disableCache: boolean, token: CancellationToken): Promise<void> {
		this.logService.info(`[AutoSync] Triggered by ${reason}`);
		this._onDidStartSync.fire();

		let error: Error | undefined;
		try {
			await this.createAndRunSyncTask(disableCache, token);
		} catch (e) {
			this.logService.error(e);
			error = e;
			if (UserDataSyncError.toUserDataSyncError(e).code === UserDataSyncErrorCode.MethodNotFound) {
				try {
					this.logService.info('[AutoSync] Client is making invalid requests. Cleaning up data...');
					await this.userDataSyncService.cleanUpRemoteData();
					this.logService.info('[AutoSync] Retrying sync...');
					await this.createAndRunSyncTask(disableCache, token);
					error = undefined;
				} catch (e1) {
					this.logService.error(e1);
					error = e1;
				}
			}
		}

		this._onDidFinishSync.fire(error);
	}

	private async createAndRunSyncTask(disableCache: boolean, token: CancellationToken): Promise<void> {
		this.syncTask = await this.userDataSyncService.createSyncTask(this.manifest, disableCache);
		if (token.isCancellationRequested) {
			return;
		}
		this.manifest = this.syncTask.manifest;

		// Server has no data but this machine was synced before
		if (this.manifest === null && await this.userDataSyncService.hasPreviouslySynced()) {
			if (this.hasSyncServiceChanged()) {
				if (await this.hasDefaultServiceChanged()) {
					throw new UserDataAutoSyncError(localize('default service changed', "Cannot sync because default service has changed"), UserDataSyncErrorCode.DefaultServiceChanged);
				} else {
					throw new UserDataAutoSyncError(localize('service changed', "Cannot sync because sync service has changed"), UserDataSyncErrorCode.ServiceChanged);
				}
			} else {
				// Sync was turned off in the cloud
				throw new UserDataAutoSyncError(localize('turned off', "Cannot sync because syncing is turned off in the cloud"), UserDataSyncErrorCode.TurnedOff);
			}
		}

		const sessionId = this.storageService.get(sessionIdKey, StorageScope.APPLICATION);
		// Server session is different from client session
		if (sessionId && this.manifest && sessionId !== this.manifest.session) {
			if (this.hasSyncServiceChanged()) {
				if (await this.hasDefaultServiceChanged()) {
					throw new UserDataAutoSyncError(localize('default service changed', "Cannot sync because default service has changed"), UserDataSyncErrorCode.DefaultServiceChanged);
				} else {
					throw new UserDataAutoSyncError(localize('service changed', "Cannot sync because sync service has changed"), UserDataSyncErrorCode.ServiceChanged);
				}
			} else {
				throw new UserDataAutoSyncError(localize('session expired', "Cannot sync because current session is expired"), UserDataSyncErrorCode.SessionExpired);
			}
		}

		const machines = await this.userDataSyncMachinesService.getMachines(this.manifest || undefined);
		// Return if cancellation is requested
		if (token.isCancellationRequested) {
			return;
		}

		const currentMachine = machines.find(machine => machine.isCurrent);
		// Check if sync was turned off from other machine
		if (currentMachine?.disabled) {
			// Throw TurnedOff error
			throw new UserDataAutoSyncError(localize('turned off machine', "Cannot sync because syncing is turned off on this machine from another machine."), UserDataSyncErrorCode.TurnedOff);
		}

		const startTime = new Date().getTime();
		await this.syncTask.run();
		this.telemetryService.publicLog2<{
			duration: number;
		}, {
			owner: 'sandy081';
			comment: 'Report when running a sync operation';
			duration: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Time taken to run sync operation' };
		}>('settingsSync:sync', { duration: new Date().getTime() - startTime });

		// After syncing, get the manifest if it was not available before
		if (this.manifest === null) {
			try {
				this.manifest = await this.userDataSyncStoreService.manifest(null);
			} catch (error) {
				throw new UserDataAutoSyncError(toErrorMessage(error), error instanceof UserDataSyncError ? error.code : UserDataSyncErrorCode.Unknown);
			}
		}

		// Update local session id
		if (this.manifest && this.manifest.session !== sessionId) {
			this.storageService.store(sessionIdKey, this.manifest.session, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}

		// Return if cancellation is requested
		if (token.isCancellationRequested) {
			return;
		}

		// Add current machine
		if (!currentMachine) {
			await this.userDataSyncMachinesService.addCurrentMachine(this.manifest || undefined);
		}
	}

	register<T extends IDisposable>(t: T): T {
		return super._register(t);
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataProfilesManifestMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataProfilesManifestMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../base/common/objects.js';
import { IUserDataProfile, UseDefaultProfileFlags } from '../../userDataProfile/common/userDataProfile.js';
import { ISyncUserDataProfile } from './userDataSync.js';

interface IRelaxedMergeResult {
	local: { added: ISyncUserDataProfile[]; removed: IUserDataProfile[]; updated: ISyncUserDataProfile[] };
	remote: { added: IUserDataProfile[]; removed: ISyncUserDataProfile[]; updated: IUserDataProfile[] } | null;
}

export type IMergeResult = Required<IRelaxedMergeResult>;

interface IUserDataProfileInfo {
	readonly id: string;
	readonly name: string;
	readonly icon?: string;
	readonly useDefaultFlags?: UseDefaultProfileFlags;
}

export function merge(local: IUserDataProfile[], remote: ISyncUserDataProfile[] | null, lastSync: ISyncUserDataProfile[] | null, ignored: string[]): IMergeResult {
	const localResult: { added: ISyncUserDataProfile[]; removed: IUserDataProfile[]; updated: ISyncUserDataProfile[] } = { added: [], removed: [], updated: [] };
	let remoteResult: { added: IUserDataProfile[]; removed: ISyncUserDataProfile[]; updated: IUserDataProfile[] } | null = { added: [], removed: [], updated: [] };

	if (!remote) {
		const added = local.filter(({ id }) => !ignored.includes(id));
		if (added.length) {
			remoteResult.added = added;
		} else {
			remoteResult = null;
		}
		return {
			local: localResult,
			remote: remoteResult
		};
	}

	const localToRemote = compare(local, remote, ignored);
	if (localToRemote.added.length > 0 || localToRemote.removed.length > 0 || localToRemote.updated.length > 0) {

		const baseToLocal = compare(lastSync, local, ignored);
		const baseToRemote = compare(lastSync, remote, ignored);

		// Remotely removed profiles
		for (const id of baseToRemote.removed) {
			const e = local.find(profile => profile.id === id);
			if (e) {
				localResult.removed.push(e);
			}
		}

		// Remotely added profiles
		for (const id of baseToRemote.added) {
			const remoteProfile = remote.find(profile => profile.id === id)!;
			// Got added in local
			if (baseToLocal.added.includes(id)) {
				// Is different from local to remote
				if (localToRemote.updated.includes(id)) {
					// Remote wins always
					localResult.updated.push(remoteProfile);
				}
			} else {
				localResult.added.push(remoteProfile);
			}
		}

		// Remotely updated profiles
		for (const id of baseToRemote.updated) {
			// Remote wins always
			localResult.updated.push(remote.find(profile => profile.id === id)!);
		}

		// Locally added profiles
		for (const id of baseToLocal.added) {
			// Not there in remote
			if (!baseToRemote.added.includes(id)) {
				remoteResult.added.push(local.find(profile => profile.id === id)!);
			}
		}

		// Locally updated profiles
		for (const id of baseToLocal.updated) {
			// If removed in remote
			if (baseToRemote.removed.includes(id)) {
				continue;
			}

			// If not updated in remote
			if (!baseToRemote.updated.includes(id)) {
				remoteResult.updated.push(local.find(profile => profile.id === id)!);
			}
		}

		// Locally removed profiles
		for (const id of baseToLocal.removed) {
			const removedProfile = remote.find(profile => profile.id === id);
			if (removedProfile) {
				remoteResult.removed.push(removedProfile);
			}
		}
	}

	if (remoteResult.added.length === 0 && remoteResult.removed.length === 0 && remoteResult.updated.length === 0) {
		remoteResult = null;
	}

	return { local: localResult, remote: remoteResult };
}

function compare(from: IUserDataProfileInfo[] | null, to: IUserDataProfileInfo[], ignoredProfiles: string[]): { added: string[]; removed: string[]; updated: string[] } {
	from = from ? from.filter(({ id }) => !ignoredProfiles.includes(id)) : [];
	to = to.filter(({ id }) => !ignoredProfiles.includes(id));
	const fromKeys = from.map(({ id }) => id);
	const toKeys = to.map(({ id }) => id);
	const added = toKeys.filter(key => !fromKeys.includes(key));
	const removed = fromKeys.filter(key => !toKeys.includes(key));
	const updated: string[] = [];

	for (const { id, name, icon, useDefaultFlags } of from) {
		if (removed.includes(id)) {
			continue;
		}
		const toProfile = to.find(p => p.id === id);
		if (!toProfile
			|| toProfile.name !== name
			|| toProfile.icon !== icon
			|| !equals(toProfile.useDefaultFlags, useDefaultFlags)
		) {
			updated.push(id);
		}
	}

	return { added, removed, updated };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataProfilesManifestSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataProfilesManifestSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { toFormattedString } from '../../../base/common/jsonFormatter.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractSynchroniser, IAcceptResult, IMergeResult, IResourcePreview } from './abstractSynchronizer.js';
import { merge } from './userDataProfilesManifestMerge.js';
import { Change, IRemoteUserData, ISyncData, ISyncUserDataProfile, IUserData, IUserDataSyncEnablementService, IUserDataSynchroniser, IUserDataSyncLocalStoreService, IUserDataSyncLogService, IUserDataSyncStoreService, SyncResource, USER_DATA_SYNC_SCHEME, UserDataSyncError, UserDataSyncErrorCode } from './userDataSync.js';

interface IUserDataProfileManifestResourceMergeResult extends IAcceptResult {
	readonly local: { added: ISyncUserDataProfile[]; removed: IUserDataProfile[]; updated: ISyncUserDataProfile[] };
	readonly remote: { added: IUserDataProfile[]; removed: ISyncUserDataProfile[]; updated: IUserDataProfile[] } | null;
}

interface IUserDataProfilesManifestResourcePreview extends IResourcePreview {
	readonly previewResult: IUserDataProfileManifestResourceMergeResult;
	readonly remoteProfiles: ISyncUserDataProfile[] | null;
}

export class UserDataProfilesManifestSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {

	protected readonly version: number = 2;
	readonly previewResource: URI = this.extUri.joinPath(this.syncPreviewFolder, 'profiles.json');
	readonly baseResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
	readonly localResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
	readonly remoteResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
	readonly acceptedResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super({ syncResource: SyncResource.Profiles, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
		this._register(userDataProfilesService.onDidChangeProfiles(() => this.triggerLocalChange()));
	}

	async getLastSyncedProfiles(): Promise<ISyncUserDataProfile[] | null> {
		const lastSyncUserData = await this.getLastSyncUserData();
		return lastSyncUserData?.syncData ? parseUserDataProfilesManifest(lastSyncUserData.syncData) : null;
	}

	async getRemoteSyncedProfiles(refOrLatestData: string | IUserData | null): Promise<ISyncUserDataProfile[] | null> {
		const lastSyncUserData = await this.getLastSyncUserData();
		const remoteUserData = await this.getLatestRemoteUserData(refOrLatestData, lastSyncUserData);
		return remoteUserData?.syncData ? parseUserDataProfilesManifest(remoteUserData.syncData) : null;
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean): Promise<IUserDataProfilesManifestResourcePreview[]> {
		const remoteProfiles: ISyncUserDataProfile[] | null = remoteUserData.syncData ? parseUserDataProfilesManifest(remoteUserData.syncData) : null;
		const lastSyncProfiles: ISyncUserDataProfile[] | null = lastSyncUserData?.syncData ? parseUserDataProfilesManifest(lastSyncUserData.syncData) : null;
		const localProfiles = this.getLocalUserDataProfiles();

		const { local, remote } = merge(localProfiles, remoteProfiles, lastSyncProfiles, []);
		const previewResult: IUserDataProfileManifestResourceMergeResult = {
			local, remote,
			content: lastSyncProfiles ? this.stringifyRemoteProfiles(lastSyncProfiles) : null,
			localChange: local.added.length > 0 || local.removed.length > 0 || local.updated.length > 0 ? Change.Modified : Change.None,
			remoteChange: remote !== null ? Change.Modified : Change.None,
		};

		const localContent = stringifyLocalProfiles(localProfiles, false);
		return [{
			baseResource: this.baseResource,
			baseContent: lastSyncProfiles ? this.stringifyRemoteProfiles(lastSyncProfiles) : null,
			localResource: this.localResource,
			localContent,
			remoteResource: this.remoteResource,
			remoteContent: remoteProfiles ? this.stringifyRemoteProfiles(remoteProfiles) : null,
			remoteProfiles,
			previewResource: this.previewResource,
			previewResult,
			localChange: previewResult.localChange,
			remoteChange: previewResult.remoteChange,
			acceptedResource: this.acceptedResource
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSyncProfiles: ISyncUserDataProfile[] | null = lastSyncUserData?.syncData ? parseUserDataProfilesManifest(lastSyncUserData.syncData) : null;
		const localProfiles = this.getLocalUserDataProfiles();
		const { remote } = merge(localProfiles, lastSyncProfiles, lastSyncProfiles, []);
		return !!remote?.added.length || !!remote?.removed.length || !!remote?.updated.length;
	}

	protected async getMergeResult(resourcePreview: IUserDataProfilesManifestResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return { ...resourcePreview.previewResult, hasConflicts: false };
	}

	protected async getAcceptResult(resourcePreview: IUserDataProfilesManifestResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {
		/* Accept local resource */
		if (this.extUri.isEqual(resource, this.localResource)) {
			return this.acceptLocal(resourcePreview);
		}

		/* Accept remote resource */
		if (this.extUri.isEqual(resource, this.remoteResource)) {
			return this.acceptRemote(resourcePreview);
		}

		/* Accept preview resource */
		if (this.extUri.isEqual(resource, this.previewResource)) {
			return resourcePreview.previewResult;
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	private async acceptLocal(resourcePreview: IUserDataProfilesManifestResourcePreview): Promise<IUserDataProfileManifestResourceMergeResult> {
		const localProfiles = this.getLocalUserDataProfiles();
		const mergeResult = merge(localProfiles, null, null, []);
		const { local, remote } = mergeResult;
		return {
			content: resourcePreview.localContent,
			local,
			remote,
			localChange: local.added.length > 0 || local.removed.length > 0 || local.updated.length > 0 ? Change.Modified : Change.None,
			remoteChange: remote !== null ? Change.Modified : Change.None,
		};
	}

	private async acceptRemote(resourcePreview: IUserDataProfilesManifestResourcePreview): Promise<IUserDataProfileManifestResourceMergeResult> {
		const remoteProfiles: ISyncUserDataProfile[] = resourcePreview.remoteContent ? JSON.parse(resourcePreview.remoteContent) : null;
		const lastSyncProfiles: ISyncUserDataProfile[] = [];
		const localProfiles: IUserDataProfile[] = [];
		for (const profile of this.getLocalUserDataProfiles()) {
			const remoteProfile = remoteProfiles?.find(remoteProfile => remoteProfile.id === profile.id);
			if (remoteProfile) {
				lastSyncProfiles.push({ id: profile.id, name: profile.name, collection: remoteProfile.collection });
				localProfiles.push(profile);
			}
		}
		if (remoteProfiles !== null) {
			const mergeResult = merge(localProfiles, remoteProfiles, lastSyncProfiles, []);
			const { local, remote } = mergeResult;
			return {
				content: resourcePreview.remoteContent,
				local,
				remote,
				localChange: local.added.length > 0 || local.removed.length > 0 || local.updated.length > 0 ? Change.Modified : Change.None,
				remoteChange: remote !== null ? Change.Modified : Change.None,
			};
		} else {
			return {
				content: resourcePreview.remoteContent,
				local: { added: [], removed: [], updated: [] },
				remote: null,
				localChange: Change.None,
				remoteChange: Change.None,
			};
		}
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IUserDataProfilesManifestResourcePreview, IUserDataProfileManifestResourceMergeResult][], force: boolean): Promise<void> {
		const { local, remote, localChange, remoteChange } = resourcePreviews[0][1];
		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing profiles.`);
		}

		const remoteProfiles = resourcePreviews[0][0].remoteProfiles || [];
		if (remoteProfiles.length + (remote?.added.length ?? 0) - (remote?.removed.length ?? 0) > 20) {
			throw new UserDataSyncError('Too many profiles to sync. Please remove some profiles and try again.', UserDataSyncErrorCode.LocalTooManyProfiles);
		}

		if (localChange !== Change.None) {
			await this.backupLocal(stringifyLocalProfiles(this.getLocalUserDataProfiles(), false));
			await Promise.all(local.removed.map(async profile => {
				this.logService.trace(`${this.syncResourceLogLabel}: Removing '${profile.name}' profile...`);
				await this.userDataProfilesService.removeProfile(profile);
				this.logService.info(`${this.syncResourceLogLabel}: Removed profile '${profile.name}'.`);
			}));
			await Promise.all(local.added.map(async profile => {
				this.logService.trace(`${this.syncResourceLogLabel}: Creating '${profile.name}' profile...`);
				await this.userDataProfilesService.createProfile(profile.id, profile.name, { icon: profile.icon, useDefaultFlags: profile.useDefaultFlags });
				this.logService.info(`${this.syncResourceLogLabel}: Created profile '${profile.name}'.`);
			}));
			await Promise.all(local.updated.map(async profile => {
				const localProfile = this.userDataProfilesService.profiles.find(p => p.id === profile.id);
				if (localProfile) {
					this.logService.trace(`${this.syncResourceLogLabel}: Updating '${profile.name}' profile...`);
					await this.userDataProfilesService.updateProfile(localProfile, { name: profile.name, icon: profile.icon, useDefaultFlags: profile.useDefaultFlags });
					this.logService.info(`${this.syncResourceLogLabel}: Updated profile '${profile.name}'.`);
				} else {
					this.logService.info(`${this.syncResourceLogLabel}: Could not find profile with id '${profile.id}' to update.`);
				}
			}));
		}

		if (remoteChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote profiles...`);
			const addedCollections: string[] = [];
			const canAddRemoteProfiles = remoteProfiles.length + (remote?.added.length ?? 0) <= 20;
			if (canAddRemoteProfiles) {
				for (const profile of remote?.added || []) {
					const collection = await this.userDataSyncStoreService.createCollection(this.syncHeaders);
					this.logService.trace(`${this.syncResourceLogLabel}: Created collection "${collection}" for "${profile.name}".`);
					addedCollections.push(collection);
					remoteProfiles.push({ id: profile.id, name: profile.name, collection, icon: profile.icon, useDefaultFlags: profile.useDefaultFlags });
				}
			} else {
				this.logService.info(`${this.syncResourceLogLabel}: Could not create remote profiles as there are too many profiles.`);
			}
			for (const profile of remote?.removed || []) {
				remoteProfiles.splice(remoteProfiles.findIndex(({ id }) => profile.id === id), 1);
			}
			for (const profile of remote?.updated || []) {
				const profileToBeUpdated = remoteProfiles.find(({ id }) => profile.id === id);
				if (profileToBeUpdated) {
					remoteProfiles.splice(remoteProfiles.indexOf(profileToBeUpdated), 1, { ...profileToBeUpdated, id: profile.id, name: profile.name, icon: profile.icon, useDefaultFlags: profile.useDefaultFlags });
				}
			}

			try {
				remoteUserData = await this.updateRemoteProfiles(remoteProfiles, force ? null : remoteUserData.ref);
				this.logService.info(`${this.syncResourceLogLabel}: Updated remote profiles.${canAddRemoteProfiles && remote?.added.length ? ` Added: ${JSON.stringify(remote.added.map(e => e.name))}.` : ''}${remote?.updated.length ? ` Updated: ${JSON.stringify(remote.updated.map(e => e.name))}.` : ''}${remote?.removed.length ? ` Removed: ${JSON.stringify(remote.removed.map(e => e.name))}.` : ''}`);
			} catch (error) {
				if (addedCollections.length) {
					this.logService.info(`${this.syncResourceLogLabel}: Failed to update remote profiles. Cleaning up added collections...`);
					for (const collection of addedCollections) {
						await this.userDataSyncStoreService.deleteCollection(collection, this.syncHeaders);
					}
				}
				throw error;
			}

			for (const profile of remote?.removed || []) {
				await this.userDataSyncStoreService.deleteCollection(profile.collection, this.syncHeaders);
			}
		}

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			// update last sync
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized profiles...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized profiles.`);
		}
	}

	async updateRemoteProfiles(profiles: ISyncUserDataProfile[], ref: string | null): Promise<IRemoteUserData> {
		return this.updateRemoteUserData(this.stringifyRemoteProfiles(profiles), ref);
	}

	async hasLocalData(): Promise<boolean> {
		return this.getLocalUserDataProfiles().length > 0;
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
		) {
			const content = await this.resolvePreviewContent(uri);
			return content ? toFormattedString(JSON.parse(content), {}) : content;
		}
		return null;
	}

	private getLocalUserDataProfiles(): IUserDataProfile[] {
		return this.userDataProfilesService.profiles.filter(p => !p.isDefault && !p.isTransient);
	}

	private stringifyRemoteProfiles(profiles: ISyncUserDataProfile[]): string {
		return JSON.stringify([...profiles].sort((a, b) => a.name.localeCompare(b.name)));
	}

}

export function stringifyLocalProfiles(profiles: IUserDataProfile[], format: boolean): string {
	const result = [...profiles].sort((a, b) => a.name.localeCompare(b.name)).map(p => ({ id: p.id, name: p.name }));
	return format ? toFormattedString(result, {}) : JSON.stringify(result);
}

export function parseUserDataProfilesManifest(syncData: ISyncData): ISyncUserDataProfile[] {
	return JSON.parse(syncData.content);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { VSBufferReadableStream } from '../../../base/common/buffer.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import { IJSONSchema } from '../../../base/common/jsonSchema.js';
import { IDisposable } from '../../../base/common/lifecycle.js';
import { IExtUri } from '../../../base/common/resources.js';
import { isObject, isString } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { IHeaders } from '../../../base/parts/request/common/request.js';
import { localize } from '../../../nls.js';
import { allSettings, ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry, IRegisteredConfigurationPropertySchema, getAllConfigurationProperties, parseScope } from '../../configuration/common/configurationRegistry.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { EXTENSION_IDENTIFIER_PATTERN, IExtensionIdentifier } from '../../extensionManagement/common/extensionManagement.js';
import { IExtensionManifest } from '../../extensions/common/extensions.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from '../../jsonschemas/common/jsonContributionRegistry.js';
import { ILogService } from '../../log/common/log.js';
import { Registry } from '../../registry/common/platform.js';
import { IUserDataProfile, UseDefaultProfileFlags } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataSyncMachine } from './userDataSyncMachines.js';

export function getDisallowedIgnoredSettings(): string[] {
	const allSettings = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
	return Object.keys(allSettings).filter(setting => !!allSettings[setting].disallowSyncIgnore);
}

export function getDefaultIgnoredSettings(excludeExtensions: boolean = false): string[] {
	const allSettings = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
	const ignoredSettings = getIgnoredSettings(allSettings, excludeExtensions);
	const disallowedSettings = getDisallowedIgnoredSettings();
	return distinct([...ignoredSettings, ...disallowedSettings]);
}

export function getIgnoredSettingsForExtension(manifest: IExtensionManifest): string[] {
	if (!manifest.contributes?.configuration) {
		return [];
	}
	const configurations = Array.isArray(manifest.contributes.configuration) ? manifest.contributes.configuration : [manifest.contributes.configuration];
	if (!configurations.length) {
		return [];
	}
	const properties = getAllConfigurationProperties(configurations);
	return getIgnoredSettings(properties, false);
}

function getIgnoredSettings(properties: IStringDictionary<IRegisteredConfigurationPropertySchema>, excludeExtensions: boolean): string[] {
	const ignoredSettings = new Set<string>();
	for (const key in properties) {
		if (excludeExtensions && !!properties[key].source) {
			continue;
		}
		const scope = isString(properties[key].scope) ? parseScope(properties[key].scope) : properties[key].scope;
		if (properties[key].ignoreSync
			|| scope === ConfigurationScope.MACHINE
			|| scope === ConfigurationScope.MACHINE_OVERRIDABLE
		) {
			ignoredSettings.add(key);
		}
	}
	return [...ignoredSettings.values()];
}

export const USER_DATA_SYNC_CONFIGURATION_SCOPE = 'settingsSync';

export interface IUserDataSyncConfiguration {
	keybindingsPerPlatform?: boolean;
	ignoredExtensions?: string[];
	ignoredSettings?: string[];
}

export const CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM = 'settingsSync.keybindingsPerPlatform';

export function registerConfiguration(): IDisposable {
	const ignoredSettingsSchemaId = 'vscode://schemas/ignoredSettings';
	const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
	configurationRegistry.registerConfiguration({
		id: 'settingsSync',
		order: 30,
		title: localize('settings sync', "Settings Sync"),
		type: 'object',
		properties: {
			[CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM]: {
				type: 'boolean',
				description: localize('settingsSync.keybindingsPerPlatform', "Synchronize keybindings for each platform."),
				default: true,
				scope: ConfigurationScope.APPLICATION,
				tags: ['sync', 'usesOnlineServices']
			},
			'settingsSync.ignoredExtensions': {
				'type': 'array',
				markdownDescription: localize('settingsSync.ignoredExtensions', "List of extensions to be ignored while synchronizing. The identifier of an extension is always `${publisher}.${name}`. For example: `vscode.csharp`."),
				items: [{
					type: 'string',
					pattern: EXTENSION_IDENTIFIER_PATTERN,
					errorMessage: localize('app.extension.identifier.errorMessage', "Expected format '${publisher}.${name}'. Example: 'vscode.csharp'.")
				}],
				'default': [],
				'scope': ConfigurationScope.APPLICATION,
				uniqueItems: true,
				disallowSyncIgnore: true,
				tags: ['sync', 'usesOnlineServices']
			},
			'settingsSync.ignoredSettings': {
				'type': 'array',
				description: localize('settingsSync.ignoredSettings', "Configure settings to be ignored while synchronizing."),
				'default': [],
				'scope': ConfigurationScope.APPLICATION,
				$ref: ignoredSettingsSchemaId,
				additionalProperties: true,
				uniqueItems: true,
				disallowSyncIgnore: true,
				tags: ['sync', 'usesOnlineServices']
			}
		}
	});
	const jsonRegistry = Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution);
	const registerIgnoredSettingsSchema = () => {
		const disallowedIgnoredSettings = getDisallowedIgnoredSettings();
		const defaultIgnoredSettings = getDefaultIgnoredSettings();
		const settings = Object.keys(allSettings.properties).filter(setting => !defaultIgnoredSettings.includes(setting));
		const ignoredSettings = defaultIgnoredSettings.filter(setting => !disallowedIgnoredSettings.includes(setting));
		const ignoredSettingsSchema: IJSONSchema = {
			items: {
				type: 'string',
				enum: [...settings, ...ignoredSettings.map(setting => `-${setting}`)]
			},
		};
		jsonRegistry.registerSchema(ignoredSettingsSchemaId, ignoredSettingsSchema);
	};
	return configurationRegistry.onDidUpdateConfiguration(() => registerIgnoredSettingsSchema());
}

// #region User Data Sync Store

export const NON_EXISTING_RESOURCE_REF = '0';

export interface IUserData {
	ref: string;
	content: string | null;
}

export type IAuthenticationProvider = { id: string; scopes: string[] };

export interface IUserDataSyncStore {
	readonly url: URI;
	readonly type: UserDataSyncStoreType;
	readonly defaultUrl: URI;
	readonly stableUrl: URI;
	readonly insidersUrl: URI;
	readonly canSwitch: boolean;
	readonly authenticationProviders: IAuthenticationProvider[];
}

export function isAuthenticationProvider(thing: any): thing is IAuthenticationProvider {
	return thing
		&& isObject(thing)
		&& isString(thing.id)
		&& Array.isArray(thing.scopes);
}

export const enum SyncResource {
	Settings = 'settings',
	Keybindings = 'keybindings',
	Snippets = 'snippets',
	Prompts = 'prompts',
	Tasks = 'tasks',
	Mcp = 'mcp',
	Extensions = 'extensions',
	GlobalState = 'globalState',
	Profiles = 'profiles',
	WorkspaceState = 'workspaceState',
}
export const ALL_SYNC_RESOURCES: SyncResource[] = [SyncResource.Settings, SyncResource.Keybindings, SyncResource.Snippets, SyncResource.Prompts, SyncResource.Tasks, SyncResource.Extensions, SyncResource.GlobalState, SyncResource.Profiles, SyncResource.Mcp];

export function getPathSegments(collection: string | undefined, ...paths: string[]): string[] {
	return collection ? [collection, ...paths] : paths;
}

export function getLastSyncResourceUri(collection: string | undefined, syncResource: SyncResource, environmentService: IEnvironmentService, extUri: IExtUri): URI {
	return extUri.joinPath(environmentService.userDataSyncHome, ...getPathSegments(collection, syncResource, `lastSync${syncResource}.json`));
}

export type IUserDataResourceManifest = Record<ServerResource, string>;

export interface IUserDataCollectionManifest {
	[collectionId: string]: {
		readonly latest?: IUserDataResourceManifest;
	};
}

export interface IUserDataManifest {
	readonly latest?: IUserDataResourceManifest;
	readonly session: string;
	readonly ref: string;
	readonly collections?: IUserDataCollectionManifest;
}

export function isUserDataManifest(thing: any): thing is IUserDataManifest {
	return thing
		&& isString(thing.session)
		&& isString(thing.ref)
		&& (isObject(thing.latest) || thing.latest === undefined)
		&& (isObject(thing.collections) || thing.collections === undefined);
}

export interface IUserDataSyncActivityData {
	resources?: {
		[resourceId: string]: { created: number; content: string }[];
	};
	collections?: {
		[collectionId: string]: {
			resources?: {
				[resourceId: string]: { created: number; content: string }[];
			} | undefined;
		};
	};
}

export interface IUserDataSyncLatestData {
	resources?: IStringDictionary<IUserData>;
	collections?: {
		[collectionId: string]: {
			resources?: IStringDictionary<IUserData>;
		};
	};
}

export interface IResourceRefHandle {
	ref: string;
	created: number;
}

export type ServerResource = SyncResource | 'machines' | 'editSessions' | 'workspaceState';
export type UserDataSyncStoreType = 'insiders' | 'stable';

export const IUserDataSyncStoreManagementService = createDecorator<IUserDataSyncStoreManagementService>('IUserDataSyncStoreManagementService');
export interface IUserDataSyncStoreManagementService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeUserDataSyncStore: Event<void>;
	readonly userDataSyncStore: IUserDataSyncStore | undefined;
	switch(type: UserDataSyncStoreType): Promise<void>;
	getPreviousUserDataSyncStore(): Promise<IUserDataSyncStore | undefined>;
}

export const IUserDataSyncStoreService = createDecorator<IUserDataSyncStoreService>('IUserDataSyncStoreService');
export interface IUserDataSyncStoreService {
	readonly _serviceBrand: undefined;
	readonly onDidChangeDonotMakeRequestsUntil: Event<void>;
	readonly donotMakeRequestsUntil: Date | undefined;

	readonly onTokenFailed: Event<UserDataSyncErrorCode>;
	readonly onTokenSucceed: Event<void>;
	setAuthToken(token: string, type: string): void;

	manifest(oldValue: IUserDataManifest | null, headers?: IHeaders): Promise<IUserDataManifest | null>;
	readResource(resource: ServerResource, oldValue: IUserData | null, collection?: string, headers?: IHeaders): Promise<IUserData>;
	writeResource(resource: ServerResource, content: string, ref: string | null, collection?: string, headers?: IHeaders): Promise<string>;
	deleteResource(resource: ServerResource, ref: string | null, collection?: string): Promise<void>;
	getAllResourceRefs(resource: ServerResource, collection?: string): Promise<IResourceRefHandle[]>;
	resolveResourceContent(resource: ServerResource, ref: string, collection?: string, headers?: IHeaders): Promise<string | null>;

	getAllCollections(headers?: IHeaders): Promise<string[]>;
	createCollection(headers?: IHeaders): Promise<string>;
	deleteCollection(collection?: string, headers?: IHeaders): Promise<void>;

	getLatestData(headers?: IHeaders): Promise<IUserDataSyncLatestData | null>;
	getActivityData(): Promise<VSBufferReadableStream>;

	clear(): Promise<void>;
}

export const IUserDataSyncLocalStoreService = createDecorator<IUserDataSyncLocalStoreService>('IUserDataSyncLocalStoreService');
export interface IUserDataSyncLocalStoreService {
	readonly _serviceBrand: undefined;
	writeResource(resource: ServerResource, content: string, cTime: Date, collection?: string, root?: URI): Promise<void>;
	getAllResourceRefs(resource: ServerResource, collection?: string, root?: URI): Promise<IResourceRefHandle[]>;
	resolveResourceContent(resource: ServerResource, ref: string, collection?: string, root?: URI): Promise<string | null>;
}

//#endregion

// #region User Data Sync Headers

export const HEADER_OPERATION_ID = 'x-operation-id';
export const HEADER_EXECUTION_ID = 'X-Execution-Id';

export function createSyncHeaders(executionId: string): IHeaders {
	const headers: IHeaders = {};
	headers[HEADER_EXECUTION_ID] = executionId;
	return headers;
}

//#endregion

// #region User Data Sync Error

export const enum UserDataSyncErrorCode {
	// Client Errors (>= 400 )
	Unauthorized = 'Unauthorized', /* 401 */
	Forbidden = 'Forbidden', /* 403 */
	NotFound = 'NotFound', /* 404 */
	MethodNotFound = 'MethodNotFound', /* 405 */
	Conflict = 'Conflict', /* 409 */
	Gone = 'Gone', /* 410 */
	PreconditionFailed = 'PreconditionFailed', /* 412 */
	TooLarge = 'TooLarge', /* 413 */
	UpgradeRequired = 'UpgradeRequired', /* 426 */
	PreconditionRequired = 'PreconditionRequired', /* 428 */
	TooManyRequests = 'RemoteTooManyRequests', /* 429 */
	TooManyRequestsAndRetryAfter = 'TooManyRequestsAndRetryAfter', /* 429 + Retry-After */

	// Local Errors
	RequestFailed = 'RequestFailed',
	RequestCanceled = 'RequestCanceled',
	RequestTimeout = 'RequestTimeout',
	RequestProtocolNotSupported = 'RequestProtocolNotSupported',
	RequestPathNotEscaped = 'RequestPathNotEscaped',
	RequestHeadersNotObject = 'RequestHeadersNotObject',
	NoCollection = 'NoCollection',
	NoRef = 'NoRef',
	EmptyResponse = 'EmptyResponse',
	TurnedOff = 'TurnedOff',
	SessionExpired = 'SessionExpired',
	ServiceChanged = 'ServiceChanged',
	DefaultServiceChanged = 'DefaultServiceChanged',
	LocalTooManyProfiles = 'LocalTooManyProfiles',
	LocalTooManyRequests = 'LocalTooManyRequests',
	LocalPreconditionFailed = 'LocalPreconditionFailed',
	LocalInvalidContent = 'LocalInvalidContent',
	LocalError = 'LocalError',
	IncompatibleLocalContent = 'IncompatibleLocalContent',
	IncompatibleRemoteContent = 'IncompatibleRemoteContent',

	Unknown = 'Unknown',
}

export class UserDataSyncError extends Error {

	constructor(
		message: string,
		readonly code: UserDataSyncErrorCode,
		readonly resource?: SyncResource,
		readonly operationId?: string
	) {
		super(message);
		this.name = `${this.code} (UserDataSyncError) syncResource:${this.resource || 'unknown'} operationId:${this.operationId || 'unknown'}`;
	}

}

export class UserDataSyncStoreError extends UserDataSyncError {
	constructor(message: string, readonly url: string, code: UserDataSyncErrorCode, readonly serverCode: number | undefined, operationId: string | undefined) {
		super(message, code, undefined, operationId);
	}
}

export class UserDataAutoSyncError extends UserDataSyncError {
	constructor(message: string, code: UserDataSyncErrorCode) {
		super(message, code);
	}
}

export namespace UserDataSyncError {

	export function toUserDataSyncError(error: Error): UserDataSyncError {
		if (error instanceof UserDataSyncError) {
			return error;
		}
		const match = /^(.+) \(UserDataSyncError\) syncResource:(.+) operationId:(.+)$/.exec(error.name);
		if (match && match[1]) {
			const syncResource = match[2] === 'unknown' ? undefined : match[2] as SyncResource;
			const operationId = match[3] === 'unknown' ? undefined : match[3];
			return new UserDataSyncError(error.message, <UserDataSyncErrorCode>match[1], syncResource, operationId);
		}
		return new UserDataSyncError(error.message, UserDataSyncErrorCode.Unknown);
	}

}

//#endregion

// #region User Data Synchroniser

export interface ISyncUserDataProfile {
	readonly id: string;
	readonly collection: string;
	readonly name: string;
	readonly icon?: string;
	readonly useDefaultFlags?: UseDefaultProfileFlags;
}

export type ISyncExtension = ILocalSyncExtension | IRemoteSyncExtension;

export interface ILocalSyncExtension {
	identifier: IExtensionIdentifier;
	pinned: boolean;
	version: string;
	preRelease: boolean;
	disabled?: boolean;
	installed?: boolean;
	isApplicationScoped?: boolean;
	state?: IStringDictionary<any>;
}

export interface IRemoteSyncExtension {
	identifier: IExtensionIdentifier;
	version: string;
	pinned?: boolean;
	preRelease?: boolean;
	disabled?: boolean;
	installed?: boolean;
	isApplicationScoped?: boolean;
	state?: IStringDictionary<any>;
}

export interface IStorageValue {
	version: number;
	value: string;
}

export interface IGlobalState {
	storage: IStringDictionary<IStorageValue>;
}

export interface IWorkspaceState {
	folders: IWorkspaceStateFolder[];
	storage: IStringDictionary<string>;
	version: number;
}

export interface IWorkspaceStateFolder {
	resourceUri: string;
	workspaceFolderIdentity: string;
}

export const enum SyncStatus {
	Uninitialized = 'uninitialized',
	Idle = 'idle',
	Syncing = 'syncing',
	HasConflicts = 'hasConflicts',
}

export interface ISyncResourceHandle {
	created: number;
	uri: URI;
}

export interface IRemoteUserData {
	ref: string;
	syncData: ISyncData | null;
}

export interface ISyncData {
	version: number;
	machineId?: string;
	content: string;
}

export const enum Change {
	None,
	Added,
	Modified,
	Deleted,
}

export const enum MergeState {
	Preview = 'preview',
	Conflict = 'conflict',
	Accepted = 'accepted',
}

export interface IResourcePreview {
	readonly baseResource: URI;
	readonly remoteResource: URI;
	readonly localResource: URI;
	readonly previewResource: URI;
	readonly acceptedResource: URI;
	readonly localChange: Change;
	readonly remoteChange: Change;
	readonly mergeState: MergeState;
}

export interface IUserDataSyncResource {
	readonly syncResource: SyncResource;
	readonly profile: IUserDataProfile;
}

export interface IUserDataSyncResourceConflicts extends IUserDataSyncResource {
	readonly conflicts: IResourcePreview[];
}

export interface IUserDataSyncResourcePreview extends IUserDataSyncResource {
	readonly isLastSyncFromCurrentMachine: boolean;
	readonly resourcePreviews: IResourcePreview[];
}

export interface IUserDataSyncResourceError extends IUserDataSyncResource {
	readonly error: UserDataSyncError;
}

export interface IUserDataSyncResourceInitializer {
	initialize(userData: IUserData): Promise<void>;
}

export interface IUserDataSynchroniser {

	readonly resource: SyncResource;
	readonly status: SyncStatus;
	readonly onDidChangeStatus: Event<SyncStatus>;

	readonly conflicts: IUserDataSyncResourceConflicts;
	readonly onDidChangeConflicts: Event<IUserDataSyncResourceConflicts>;

	readonly onDidChangeLocal: Event<void>;

	sync(refOrUserData: string | IUserData | null, preview: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, headers: IHeaders): Promise<IUserDataSyncResourcePreview | null>;
	accept(resource: URI, content?: string | null): Promise<IUserDataSyncResourcePreview | null>;
	apply(force: boolean, headers: IHeaders): Promise<IUserDataSyncResourcePreview | null>;
	stop(): Promise<void>;

	hasPreviouslySynced(): Promise<boolean>;
	hasLocalData(): Promise<boolean>;
	resetLocal(): Promise<void>;

	resolveContent(resource: URI): Promise<string | null>;
	replace(content: string): Promise<boolean>;
}

//#endregion

// #region keys synced only in web

export const SYNC_SERVICE_URL_TYPE = 'sync.store.url.type';
export function getEnablementKey(resource: SyncResource) { return `sync.enable.${resource}`; }

// #endregion

// #region User Data Sync Services
export const IUserDataSyncEnablementService = createDecorator<IUserDataSyncEnablementService>('IUserDataSyncEnablementService');
export interface IUserDataSyncEnablementService {
	_serviceBrand: undefined;

	readonly onDidChangeEnablement: Event<boolean>;
	isEnabled(): boolean;
	canToggleEnablement(): boolean;
	setEnablement(enabled: boolean): void;

	readonly onDidChangeResourceEnablement: Event<[SyncResource, boolean]>;
	isResourceEnabled(resource: SyncResource, defaultValue?: boolean): boolean;
	setResourceEnablement(resource: SyncResource, enabled: boolean): void;

	getResourceSyncStateVersion(resource: SyncResource): string | undefined;

	/**
	 * Checks if resource enabled was explicitly configured before,
	 * ignoring its default enablement value used in {@link isResourceEnabled}.
	 */
	isResourceEnablementConfigured(resource: SyncResource): boolean;
}

export interface IUserDataSyncTask {
	readonly manifest: IUserDataManifest | null;
	run(): Promise<void>;
	stop(): Promise<void>;
}

export interface IUserDataManualSyncTask {
	readonly id: string;
	merge(): Promise<void>;
	apply(): Promise<void>;
	stop(): Promise<void>;
}

export const IUserDataSyncService = createDecorator<IUserDataSyncService>('IUserDataSyncService');
export interface IUserDataSyncService {
	_serviceBrand: undefined;

	readonly status: SyncStatus;
	readonly onDidChangeStatus: Event<SyncStatus>;

	readonly conflicts: IUserDataSyncResourceConflicts[];
	readonly onDidChangeConflicts: Event<IUserDataSyncResourceConflicts[]>;

	readonly onDidChangeLocal: Event<SyncResource>;
	readonly onSyncErrors: Event<IUserDataSyncResourceError[]>;

	readonly lastSyncTime: number | undefined;
	readonly onDidChangeLastSyncTime: Event<number>;

	readonly onDidResetRemote: Event<void>;
	readonly onDidResetLocal: Event<void>;

	createSyncTask(manifest: IUserDataManifest | null, disableCache?: boolean): Promise<IUserDataSyncTask>;
	createManualSyncTask(): Promise<IUserDataManualSyncTask>;
	resolveContent(resource: URI): Promise<string | null>;
	accept(syncResource: IUserDataSyncResource, resource: URI, content: string | null | undefined, apply: boolean | { force: boolean }): Promise<void>;

	reset(): Promise<void>;
	resetRemote(): Promise<void>;
	cleanUpRemoteData(): Promise<void>;
	resetLocal(): Promise<void>;
	hasLocalData(): Promise<boolean>;
	hasPreviouslySynced(): Promise<boolean>;

	replace(syncResourceHandle: ISyncResourceHandle): Promise<void>;

	saveRemoteActivityData(location: URI): Promise<void>;
	extractActivityData(activityDataResource: URI, location: URI): Promise<void>;
}

export const IUserDataSyncResourceProviderService = createDecorator<IUserDataSyncResourceProviderService>('IUserDataSyncResourceProviderService');
export interface IUserDataSyncResourceProviderService {
	_serviceBrand: undefined;
	getRemoteSyncedProfiles(): Promise<ISyncUserDataProfile[]>;
	getLocalSyncedProfiles(location?: URI): Promise<ISyncUserDataProfile[]>;
	getRemoteSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile): Promise<ISyncResourceHandle[]>;
	getLocalSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile, location?: URI): Promise<ISyncResourceHandle[]>;
	getAssociatedResources(syncResourceHandle: ISyncResourceHandle): Promise<{ resource: URI; comparableResource: URI }[]>;
	getMachineId(syncResourceHandle: ISyncResourceHandle): Promise<string | undefined>;
	getLocalSyncedMachines(location?: URI): Promise<IUserDataSyncMachine[]>;
	resolveContent(resource: URI): Promise<string | null>;
	resolveUserDataSyncResource(syncResourceHandle: ISyncResourceHandle): IUserDataSyncResource | undefined;
}

export type SyncOptions = { immediately?: boolean; skipIfSyncedRecently?: boolean; disableCache?: boolean };

export const IUserDataAutoSyncService = createDecorator<IUserDataAutoSyncService>('IUserDataAutoSyncService');
export interface IUserDataAutoSyncService {
	_serviceBrand: undefined;
	readonly onError: Event<UserDataSyncError>;
	turnOn(): Promise<void>;
	turnOff(everywhere: boolean): Promise<void>;
	triggerSync(sources: string[], options?: SyncOptions): Promise<void>;
}

export const IUserDataSyncUtilService = createDecorator<IUserDataSyncUtilService>('IUserDataSyncUtilService');
export interface IUserDataSyncUtilService {
	readonly _serviceBrand: undefined;
	resolveUserBindings(userbindings: string[]): Promise<IStringDictionary<string>>;
	resolveFormattingOptions(resource: URI): Promise<FormattingOptions>;
	resolveDefaultCoreIgnoredSettings(): Promise<string[]>;
}

export const IUserDataSyncLogService = createDecorator<IUserDataSyncLogService>('IUserDataSyncLogService');
export interface IUserDataSyncLogService extends ILogService { }

export interface IConflictSetting {
	key: string;
	localValue: any | undefined;
	remoteValue: any | undefined;
}

//#endregion

export const USER_DATA_SYNC_LOG_ID = 'userDataSync';
export const USER_DATA_SYNC_SCHEME = 'vscode-userdata-sync';
export const PREVIEW_DIR_NAME = 'preview';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncAccount.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncAccount.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IUserDataSyncLogService, IUserDataSyncStoreService, UserDataSyncErrorCode } from './userDataSync.js';

export interface IUserDataSyncAccount {
	readonly authenticationProviderId: string;
	readonly token: string;
}

export const IUserDataSyncAccountService = createDecorator<IUserDataSyncAccountService>('IUserDataSyncAccountService');
export interface IUserDataSyncAccountService {
	readonly _serviceBrand: undefined;

	readonly onTokenFailed: Event<boolean/*bail out*/>;
	readonly account: IUserDataSyncAccount | undefined;
	readonly onDidChangeAccount: Event<IUserDataSyncAccount | undefined>;
	updateAccount(account: IUserDataSyncAccount | undefined): Promise<void>;

}

export class UserDataSyncAccountService extends Disposable implements IUserDataSyncAccountService {

	_serviceBrand: undefined;

	private _account: IUserDataSyncAccount | undefined;
	get account(): IUserDataSyncAccount | undefined { return this._account; }
	private _onDidChangeAccount = this._register(new Emitter<IUserDataSyncAccount | undefined>());
	readonly onDidChangeAccount = this._onDidChangeAccount.event;

	private _onTokenFailed: Emitter<boolean> = this._register(new Emitter<boolean>());
	readonly onTokenFailed: Event<boolean> = this._onTokenFailed.event;

	private wasTokenFailed: boolean = false;

	constructor(
		@IUserDataSyncStoreService private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
	) {
		super();
		this._register(userDataSyncStoreService.onTokenFailed(code => {
			this.logService.info('Settings Sync auth token failed', this.account?.authenticationProviderId, this.wasTokenFailed, code);
			this.updateAccount(undefined);
			if (code === UserDataSyncErrorCode.Forbidden) {
				this._onTokenFailed.fire(true /*bail out immediately*/);
			} else {
				this._onTokenFailed.fire(this.wasTokenFailed /* bail out if token failed before */);
			}
			this.wasTokenFailed = true;
		}));
		this._register(userDataSyncStoreService.onTokenSucceed(() => this.wasTokenFailed = false));
	}

	async updateAccount(account: IUserDataSyncAccount | undefined): Promise<void> {
		if (account && this._account ? account.token !== this._account.token || account.authenticationProviderId !== this._account.authenticationProviderId : account !== this._account) {
			this._account = account;
			if (this._account) {
				this.userDataSyncStoreService.setAuthToken(this._account.token, this._account.authenticationProviderId);
			}
			this._onDidChangeAccount.fire(account);
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncEnablementService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncEnablementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isWeb } from '../../../base/common/platform.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IApplicationStorageValueChangeEvent, IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ALL_SYNC_RESOURCES, getEnablementKey, IUserDataSyncEnablementService, IUserDataSyncStoreManagementService, SyncResource } from './userDataSync.js';

const enablementKey = 'sync.enable';

export class UserDataSyncEnablementService extends Disposable implements IUserDataSyncEnablementService {

	_serviceBrand: undefined;

	private _onDidChangeEnablement = new Emitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _onDidChangeResourceEnablement = new Emitter<[SyncResource, boolean]>();
	readonly onDidChangeResourceEnablement: Event<[SyncResource, boolean]> = this._onDidChangeResourceEnablement.event;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IEnvironmentService protected readonly environmentService: IEnvironmentService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
	) {
		super();
		this._register(storageService.onDidChangeValue(StorageScope.APPLICATION, undefined, this._store)(e => this.onDidStorageChange(e)));
	}

	isEnabled(): boolean {
		switch (this.environmentService.sync) {
			case 'on':
				return true;
			case 'off':
				return false;
		}
		return this.storageService.getBoolean(enablementKey, StorageScope.APPLICATION, false);
	}

	canToggleEnablement(): boolean {
		return this.userDataSyncStoreManagementService.userDataSyncStore !== undefined && this.environmentService.sync === undefined;
	}

	setEnablement(enabled: boolean): void {
		if (enabled && !this.canToggleEnablement()) {
			return;
		}
		this.storageService.store(enablementKey, enabled, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	isResourceEnabled(resource: SyncResource, defaultValue?: boolean): boolean {
		const storedValue = this.storageService.getBoolean(getEnablementKey(resource), StorageScope.APPLICATION);
		defaultValue = defaultValue ?? resource !== SyncResource.Prompts;
		return storedValue ?? defaultValue;
	}

	isResourceEnablementConfigured(resource: SyncResource): boolean {
		const storedValue = this.storageService.getBoolean(getEnablementKey(resource), StorageScope.APPLICATION);

		return (storedValue !== undefined);
	}

	setResourceEnablement(resource: SyncResource, enabled: boolean): void {
		if (this.isResourceEnabled(resource) !== enabled) {
			const resourceEnablementKey = getEnablementKey(resource);
			this.storeResourceEnablement(resourceEnablementKey, enabled);
		}
	}

	getResourceSyncStateVersion(resource: SyncResource): string | undefined {
		return undefined;
	}

	private storeResourceEnablement(resourceEnablementKey: string, enabled: boolean): void {
		this.storageService.store(resourceEnablementKey, enabled, StorageScope.APPLICATION, isWeb ? StorageTarget.USER /* sync in web */ : StorageTarget.MACHINE);
	}

	private onDidStorageChange(storageChangeEvent: IApplicationStorageValueChangeEvent): void {
		if (enablementKey === storageChangeEvent.key) {
			this._onDidChangeEnablement.fire(this.isEnabled());
			return;
		}

		const resourceKey = ALL_SYNC_RESOURCES.filter(resourceKey => getEnablementKey(resourceKey) === storageChangeEvent.key)[0];
		if (resourceKey) {
			this._onDidChangeResourceEnablement.fire([resourceKey, this.isResourceEnabled(resourceKey)]);
			return;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncIpc.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IProductService } from '../../product/common/productService.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IUserDataSyncStore, IUserDataSyncStoreManagementService, UserDataSyncStoreType } from './userDataSync.js';
import { IUserDataSyncAccount, IUserDataSyncAccountService } from './userDataSyncAccount.js';
import { AbstractUserDataSyncStoreManagementService } from './userDataSyncStoreService.js';

export class UserDataSyncAccountServiceChannel implements IServerChannel {
	constructor(private readonly service: IUserDataSyncAccountService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onDidChangeAccount': return this.service.onDidChangeAccount;
			case 'onTokenFailed': return this.service.onTokenFailed;
		}
		throw new Error(`[UserDataSyncAccountServiceChannel] Event not found: ${event}`);
	}

	call(context: any, command: string, args?: any): Promise<any> {
		switch (command) {
			case '_getInitialData': return Promise.resolve(this.service.account);
			case 'updateAccount': return this.service.updateAccount(args);
		}
		throw new Error('Invalid call');
	}
}

export class UserDataSyncAccountServiceChannelClient extends Disposable implements IUserDataSyncAccountService {

	declare readonly _serviceBrand: undefined;

	private _account: IUserDataSyncAccount | undefined;
	get account(): IUserDataSyncAccount | undefined { return this._account; }

	get onTokenFailed(): Event<boolean> { return this.channel.listen<boolean>('onTokenFailed'); }

	private _onDidChangeAccount = this._register(new Emitter<IUserDataSyncAccount | undefined>());
	readonly onDidChangeAccount = this._onDidChangeAccount.event;

	constructor(private readonly channel: IChannel) {
		super();
		this.channel.call<IUserDataSyncAccount | undefined>('_getInitialData').then(account => {
			this._account = account;
			this._register(this.channel.listen<IUserDataSyncAccount | undefined>('onDidChangeAccount')(account => {
				this._account = account;
				this._onDidChangeAccount.fire(account);
			}));
		});
	}

	updateAccount(account: IUserDataSyncAccount | undefined): Promise<undefined> {
		return this.channel.call('updateAccount', account);
	}

}

export class UserDataSyncStoreManagementServiceChannel implements IServerChannel {
	constructor(private readonly service: IUserDataSyncStoreManagementService) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			case 'onDidChangeUserDataSyncStore': return this.service.onDidChangeUserDataSyncStore;
		}
		throw new Error(`[UserDataSyncStoreManagementServiceChannel] Event not found: ${event}`);
	}

	call(context: any, command: string, args?: any): Promise<any> {
		switch (command) {
			case 'switch': return this.service.switch(args[0]);
			case 'getPreviousUserDataSyncStore': return this.service.getPreviousUserDataSyncStore();
		}
		throw new Error('Invalid call');
	}
}

export class UserDataSyncStoreManagementServiceChannelClient extends AbstractUserDataSyncStoreManagementService implements IUserDataSyncStoreManagementService {

	constructor(
		private readonly channel: IChannel,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
	) {
		super(productService, configurationService, storageService);
		this._register(this.channel.listen<void>('onDidChangeUserDataSyncStore')(() => this.updateUserDataSyncStore()));
	}

	async switch(type: UserDataSyncStoreType): Promise<void> {
		return this.channel.call('switch', [type]);
	}

	async getPreviousUserDataSyncStore(): Promise<IUserDataSyncStore> {
		const userDataSyncStore = await this.channel.call<IUserDataSyncStore>('getPreviousUserDataSyncStore');
		return this.revive(userDataSyncStore);
	}

	private revive(userDataSyncStore: IUserDataSyncStore): IUserDataSyncStore {
		return {
			url: URI.revive(userDataSyncStore.url),
			type: userDataSyncStore.type,
			defaultUrl: URI.revive(userDataSyncStore.defaultUrl),
			insidersUrl: URI.revive(userDataSyncStore.insidersUrl),
			stableUrl: URI.revive(userDataSyncStore.stableUrl),
			canSwitch: userDataSyncStore.canSwitch,
			authenticationProviders: userDataSyncStore.authenticationProviders,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncLocalStoreService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncLocalStoreService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { toLocalISOString } from '../../../base/common/date.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { joinPath } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileOperationResult, IFileService, IFileStat, toFileOperationResult } from '../../files/common/files.js';
import { IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { ALL_SYNC_RESOURCES, IResourceRefHandle, IUserDataSyncLocalStoreService, IUserDataSyncLogService, SyncResource } from './userDataSync.js';

export class UserDataSyncLocalStoreService extends Disposable implements IUserDataSyncLocalStoreService {

	_serviceBrand: undefined;

	constructor(
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();
		this.cleanUp();
	}

	private async cleanUp(): Promise<void> {
		for (const profile of this.userDataProfilesService.profiles) {
			for (const resource of ALL_SYNC_RESOURCES) {
				try {
					await this.cleanUpBackup(this.getResourceBackupHome(resource, profile.isDefault ? undefined : profile.id));
				} catch (error) {
					this.logService.error(error);
				}
			}
		}

		let stat: IFileStat;
		try {
			stat = await this.fileService.resolve(this.environmentService.userDataSyncHome);
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				this.logService.error(error);
			}
			return;
		}

		if (stat.children) {
			for (const child of stat.children) {
				if (child.isDirectory && !ALL_SYNC_RESOURCES.includes(<SyncResource>child.name) && !this.userDataProfilesService.profiles.some(profile => profile.id === child.name)) {
					try {
						this.logService.info('Deleting non existing profile from backup', child.resource.path);
						await this.fileService.del(child.resource, { recursive: true });
					} catch (error) {
						this.logService.error(error);
					}
				}
			}
		}
	}

	async getAllResourceRefs(resource: SyncResource, collection?: string, root?: URI): Promise<IResourceRefHandle[]> {
		const folder = this.getResourceBackupHome(resource, collection, root);
		try {
			const stat = await this.fileService.resolve(folder);
			if (stat.children) {
				const all = stat.children.filter(stat => stat.isFile && !stat.name.startsWith('lastSync')).sort().reverse();
				return all.map(stat => ({
					ref: stat.name,
					created: this.getCreationTime(stat)
				}));
			}
		} catch (error) {
			if (toFileOperationResult(error) !== FileOperationResult.FILE_NOT_FOUND) {
				throw error;
			}
		}
		return [];
	}

	async resolveResourceContent(resourceKey: SyncResource, ref: string, collection?: string, root?: URI): Promise<string | null> {
		const folder = this.getResourceBackupHome(resourceKey, collection, root);
		const file = joinPath(folder, ref);
		try {
			const content = await this.fileService.readFile(file);
			return content.value.toString();
		} catch (error) {
			this.logService.error(error);
			return null;
		}
	}

	async writeResource(resourceKey: SyncResource, content: string, cTime: Date, collection?: string, root?: URI): Promise<void> {
		const folder = this.getResourceBackupHome(resourceKey, collection, root);
		const resource = joinPath(folder, `${toLocalISOString(cTime).replace(/-|:|\.\d+Z$/g, '')}.json`);
		try {
			await this.fileService.writeFile(resource, VSBuffer.fromString(content));
		} catch (e) {
			this.logService.error(e);
		}
	}

	private getResourceBackupHome(resource: SyncResource, collection?: string, root: URI = this.environmentService.userDataSyncHome): URI {
		return joinPath(root, ...(collection ? [collection, resource] : [resource]));
	}

	private async cleanUpBackup(folder: URI): Promise<void> {
		try {
			try {
				if (!(await this.fileService.exists(folder))) {
					return;
				}
			} catch (e) {
				return;
			}
			const stat = await this.fileService.resolve(folder);
			if (stat.children) {
				const all = stat.children.filter(stat => stat.isFile && /^\d{8}T\d{6}(\.json)?$/.test(stat.name)).sort();
				const backUpMaxAge = 1000 * 60 * 60 * 24 * (this.configurationService.getValue<number>('sync.localBackupDuration') || 30 /* Default 30 days */);
				let toDelete = all.filter(stat => Date.now() - this.getCreationTime(stat) > backUpMaxAge);
				const remaining = all.length - toDelete.length;
				if (remaining < 10) {
					toDelete = toDelete.slice(10 - remaining);
				}
				await Promises.settled(toDelete.map(async stat => {
					this.logService.info('Deleting from backup', stat.resource.path);
					await this.fileService.del(stat.resource);
				}));
			}
		} catch (e) {
			this.logService.error(e);
		}
	}

	private getCreationTime(stat: IFileStat) {
		return new Date(
			parseInt(stat.name.substring(0, 4)),
			parseInt(stat.name.substring(4, 6)) - 1,
			parseInt(stat.name.substring(6, 8)),
			parseInt(stat.name.substring(9, 11)),
			parseInt(stat.name.substring(11, 13)),
			parseInt(stat.name.substring(13, 15))
		).getTime();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncLog.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncLog.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { joinPath } from '../../../base/common/resources.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { AbstractLogger, ILogger, ILoggerService } from '../../log/common/log.js';
import { IUserDataSyncLogService, USER_DATA_SYNC_LOG_ID } from './userDataSync.js';

export class UserDataSyncLogService extends AbstractLogger implements IUserDataSyncLogService {

	declare readonly _serviceBrand: undefined;
	private readonly logger: ILogger;

	constructor(
		@ILoggerService loggerService: ILoggerService,
		@IEnvironmentService environmentService: IEnvironmentService,
	) {
		super();
		this.logger = this._register(loggerService.createLogger(joinPath(environmentService.logsHome, `${USER_DATA_SYNC_LOG_ID}.log`), { id: USER_DATA_SYNC_LOG_ID, name: localize('userDataSyncLog', "Settings Sync") }));
	}

	trace(message: string, ...args: unknown[]): void {
		this.logger.trace(message, ...args);
	}

	debug(message: string, ...args: unknown[]): void {
		this.logger.debug(message, ...args);
	}

	info(message: string, ...args: unknown[]): void {
		this.logger.info(message, ...args);
	}

	warn(message: string, ...args: unknown[]): void {
		this.logger.warn(message, ...args);
	}

	error(message: string | Error, ...args: unknown[]): void {
		this.logger.error(message, ...args);
	}

	flush(): void {
		this.logger.flush();
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncMachines.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncMachines.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { isAndroid, isChrome, isEdge, isFirefox, isSafari, isWeb, Platform, platform, PlatformToString } from '../../../base/common/platform.js';
import { escapeRegExpCharacters } from '../../../base/common/strings.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';
import { IProductService } from '../../product/common/productService.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { IUserData, IUserDataManifest, IUserDataSyncLogService, IUserDataSyncStoreService } from './userDataSync.js';

export interface IMachineData {
	id: string;
	name: string;
	disabled?: boolean;
	platform?: string;
}

export interface IMachinesData {
	version: number;
	machines: IMachineData[];
}

export type IUserDataSyncMachine = Readonly<IMachineData> & { readonly isCurrent: boolean };

export const IUserDataSyncMachinesService = createDecorator<IUserDataSyncMachinesService>('IUserDataSyncMachinesService');
export interface IUserDataSyncMachinesService {
	_serviceBrand: undefined;

	readonly onDidChange: Event<void>;

	getMachines(manifest?: IUserDataManifest): Promise<IUserDataSyncMachine[]>;

	addCurrentMachine(manifest?: IUserDataManifest): Promise<void>;
	removeCurrentMachine(manifest?: IUserDataManifest): Promise<void>;
	renameMachine(machineId: string, name: string): Promise<void>;
	setEnablements(enbalements: [string, boolean][]): Promise<void>;
}

const currentMachineNameKey = 'sync.currentMachineName';

const Safari = 'Safari';
const Chrome = 'Chrome';
const Edge = 'Edge';
const Firefox = 'Firefox';
const Android = 'Android';

export function isWebPlatform(platform: string) {
	switch (platform) {
		case Safari:
		case Chrome:
		case Edge:
		case Firefox:
		case Android:
		case PlatformToString(Platform.Web):
			return true;
	}
	return false;
}

function getPlatformName(): string {
	if (isSafari) { return Safari; }
	if (isChrome) { return Chrome; }
	if (isEdge) { return Edge; }
	if (isFirefox) { return Firefox; }
	if (isAndroid) { return Android; }
	return PlatformToString(isWeb ? Platform.Web : platform);
}

export class UserDataSyncMachinesService extends Disposable implements IUserDataSyncMachinesService {

	private static readonly VERSION = 1;
	private static readonly RESOURCE = 'machines';

	_serviceBrand: undefined;

	private readonly _onDidChange = this._register(new Emitter<void>());
	readonly onDidChange = this._onDidChange.event;

	private readonly currentMachineIdPromise: Promise<string>;
	private userData: IUserData | null = null;

	constructor(
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService private readonly storageService: IStorageService,
		@IUserDataSyncStoreService private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@IProductService private readonly productService: IProductService,
	) {
		super();
		this.currentMachineIdPromise = getServiceMachineId(environmentService, fileService, storageService);
	}

	async getMachines(manifest?: IUserDataManifest): Promise<IUserDataSyncMachine[]> {
		const currentMachineId = await this.currentMachineIdPromise;
		const machineData = await this.readMachinesData(manifest);
		return machineData.machines.map<IUserDataSyncMachine>(machine => ({ ...machine, ...{ isCurrent: machine.id === currentMachineId } }));
	}

	async addCurrentMachine(manifest?: IUserDataManifest): Promise<void> {
		const currentMachineId = await this.currentMachineIdPromise;
		const machineData = await this.readMachinesData(manifest);
		if (!machineData.machines.some(({ id }) => id === currentMachineId)) {
			machineData.machines.push({ id: currentMachineId, name: this.computeCurrentMachineName(machineData.machines), platform: getPlatformName() });
			await this.writeMachinesData(machineData);
		}
	}

	async removeCurrentMachine(manifest?: IUserDataManifest): Promise<void> {
		const currentMachineId = await this.currentMachineIdPromise;
		const machineData = await this.readMachinesData(manifest);
		const updatedMachines = machineData.machines.filter(({ id }) => id !== currentMachineId);
		if (updatedMachines.length !== machineData.machines.length) {
			machineData.machines = updatedMachines;
			await this.writeMachinesData(machineData);
		}
	}

	async renameMachine(machineId: string, name: string, manifest?: IUserDataManifest): Promise<void> {
		const machineData = await this.readMachinesData(manifest);
		const machine = machineData.machines.find(({ id }) => id === machineId);
		if (machine) {
			machine.name = name;
			await this.writeMachinesData(machineData);
			const currentMachineId = await this.currentMachineIdPromise;
			if (machineId === currentMachineId) {
				this.storageService.store(currentMachineNameKey, name, StorageScope.APPLICATION, StorageTarget.MACHINE);
			}
		}
	}

	async setEnablements(enablements: [string, boolean][]): Promise<void> {
		const machineData = await this.readMachinesData();
		for (const [machineId, enabled] of enablements) {
			const machine = machineData.machines.find(machine => machine.id === machineId);
			if (machine) {
				machine.disabled = enabled ? undefined : true;
			}
		}
		await this.writeMachinesData(machineData);
	}

	private computeCurrentMachineName(machines: IMachineData[]): string {
		const previousName = this.storageService.get(currentMachineNameKey, StorageScope.APPLICATION);
		if (previousName) {
			if (!machines.some(machine => machine.name === previousName)) {
				return previousName;
			}
			this.storageService.remove(currentMachineNameKey, StorageScope.APPLICATION);
		}

		const namePrefix = `${this.productService.embedderIdentifier ? `${this.productService.embedderIdentifier} - ` : ''}${getPlatformName()} (${this.productService.nameShort})`;
		const nameRegEx = new RegExp(`${escapeRegExpCharacters(namePrefix)}\\s#(\\d+)`);
		let nameIndex = 0;
		for (const machine of machines) {
			const matches = nameRegEx.exec(machine.name);
			const index = matches ? parseInt(matches[1]) : 0;
			nameIndex = index > nameIndex ? index : nameIndex;
		}
		return `${namePrefix} #${nameIndex + 1}`;
	}

	private async readMachinesData(manifest?: IUserDataManifest): Promise<IMachinesData> {
		this.userData = await this.readUserData(manifest);
		const machinesData = this.parse(this.userData);
		if (machinesData.version !== UserDataSyncMachinesService.VERSION) {
			throw new Error(localize('error incompatible', "Cannot read machines data as the current version is incompatible. Please update {0} and try again.", this.productService.nameLong));
		}
		return machinesData;
	}

	private async writeMachinesData(machinesData: IMachinesData): Promise<void> {
		const content = JSON.stringify(machinesData);
		const ref = await this.userDataSyncStoreService.writeResource(UserDataSyncMachinesService.RESOURCE, content, this.userData?.ref || null);
		this.userData = { ref, content };
		this._onDidChange.fire();
	}

	private async readUserData(manifest?: IUserDataManifest): Promise<IUserData> {
		if (this.userData) {

			const latestRef = manifest && manifest.latest ? manifest.latest[UserDataSyncMachinesService.RESOURCE] : undefined;

			// Last time synced resource and latest resource on server are same
			if (this.userData.ref === latestRef) {
				return this.userData;
			}

			// There is no resource on server and last time it was synced with no resource
			if (latestRef === undefined && this.userData.content === null) {
				return this.userData;
			}
		}

		return this.userDataSyncStoreService.readResource(UserDataSyncMachinesService.RESOURCE, this.userData);
	}

	private parse(userData: IUserData): IMachinesData {
		if (userData.content !== null) {
			try {
				return JSON.parse(userData.content);
			} catch (e) {
				this.logService.error(e);
			}
		}
		return {
			version: UserDataSyncMachinesService.VERSION,
			machines: []
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncResourceProvider.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncResourceProvider.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtUri } from '../../../base/common/resources.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageService } from '../../storage/common/storage.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { ISyncData, ISyncResourceHandle, IUserData, IUserDataSyncLocalStoreService, IUserDataSyncLogService, IUserDataSyncStoreService, SyncResource, UserDataSyncError, UserDataSyncErrorCode, USER_DATA_SYNC_SCHEME, IUserDataSyncResourceProviderService, ISyncUserDataProfile, CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM, IUserDataSyncResource } from './userDataSync.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { isSyncData } from './abstractSynchronizer.js';
import { parseSnippets } from './snippetsSync.js';
import { parseSettingsSyncContent } from './settingsSync.js';
import { getKeybindingsContentFromSyncContent } from './keybindingsSync.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { getTasksContentFromSyncContent } from './tasksSync.js';
import { getMcpContentFromSyncContent } from './mcpSync.js';
import { LocalExtensionsProvider, parseExtensions, stringify as stringifyExtensions } from './extensionsSync.js';
import { LocalGlobalStateProvider, stringify as stringifyGlobalState } from './globalStateSync.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { parseUserDataProfilesManifest, stringifyLocalProfiles } from './userDataProfilesManifestSync.js';
import { toFormattedString } from '../../../base/common/jsonFormatter.js';
import { trim } from '../../../base/common/strings.js';
import { IMachinesData, IUserDataSyncMachine } from './userDataSyncMachines.js';
import { parsePrompts } from './promptsSync/promptsSync.js';

interface ISyncResourceUriInfo {
	readonly remote: boolean;
	readonly syncResource: SyncResource;
	readonly profile: string;
	readonly collection: string | undefined;
	readonly ref: string | undefined;
	readonly node: string | undefined;
	readonly location: URI | undefined;
}

export class UserDataSyncResourceProviderService implements IUserDataSyncResourceProviderService {

	_serviceBrand: undefined;

	private static readonly NOT_EXISTING_RESOURCE = 'not-existing-resource';
	private static readonly REMOTE_BACKUP_AUTHORITY = 'remote-backup';
	private static readonly LOCAL_BACKUP_AUTHORITY = 'local-backup';

	private readonly extUri: IExtUri;

	constructor(
		@IUserDataSyncStoreService private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService private readonly userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService protected readonly logService: IUserDataSyncLogService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IStorageService private readonly storageService: IStorageService,
		@IFileService private readonly fileService: IFileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		this.extUri = uriIdentityService.extUri;
	}

	async getRemoteSyncedProfiles(): Promise<ISyncUserDataProfile[]> {
		const userData = await this.userDataSyncStoreService.readResource(SyncResource.Profiles, null, undefined);
		if (userData.content) {
			const syncData = this.parseSyncData(userData.content, SyncResource.Profiles);
			return parseUserDataProfilesManifest(syncData);
		}
		return [];
	}

	async getLocalSyncedProfiles(location?: URI): Promise<ISyncUserDataProfile[]> {
		const refs = await this.userDataSyncLocalStoreService.getAllResourceRefs(SyncResource.Profiles, undefined, location);
		if (refs.length) {
			const content = await this.userDataSyncLocalStoreService.resolveResourceContent(SyncResource.Profiles, refs[0].ref, undefined, location);
			if (content) {
				const syncData = this.parseSyncData(content, SyncResource.Profiles);
				return parseUserDataProfilesManifest(syncData);
			}
		}
		return [];
	}

	async getLocalSyncedMachines(location?: URI): Promise<IUserDataSyncMachine[]> {
		const refs = await this.userDataSyncLocalStoreService.getAllResourceRefs('machines', undefined, location);
		if (refs.length) {
			const content = await this.userDataSyncLocalStoreService.resolveResourceContent('machines', refs[0].ref, undefined, location);
			if (content) {
				const machinesData: IMachinesData = JSON.parse(content);
				return machinesData.machines.map(m => ({ ...m, isCurrent: false }));
			}
		}
		return [];
	}

	async getRemoteSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile): Promise<ISyncResourceHandle[]> {
		const handles = await this.userDataSyncStoreService.getAllResourceRefs(syncResource, profile?.collection);
		return handles.map(({ created, ref }) => ({
			created,
			uri: this.toUri({
				remote: true,
				syncResource,
				profile: profile?.id ?? this.userDataProfilesService.defaultProfile.id,
				location: undefined,
				collection: profile?.collection,
				ref,
				node: undefined,
			})
		}));
	}

	async getLocalSyncResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile, location?: URI): Promise<ISyncResourceHandle[]> {
		const handles = await this.userDataSyncLocalStoreService.getAllResourceRefs(syncResource, profile?.collection, location);
		return handles.map(({ created, ref }) => ({
			created,
			uri: this.toUri({
				remote: false,
				syncResource,
				profile: profile?.id ?? this.userDataProfilesService.defaultProfile.id,
				collection: profile?.collection,
				ref,
				node: undefined,
				location,
			})
		}));
	}

	resolveUserDataSyncResource({ uri }: ISyncResourceHandle): IUserDataSyncResource | undefined {
		const resolved = this.resolveUri(uri);
		const profile = resolved ? this.userDataProfilesService.profiles.find(p => p.id === resolved.profile) : undefined;
		return resolved && profile ? { profile, syncResource: resolved?.syncResource } : undefined;
	}

	async getAssociatedResources({ uri }: ISyncResourceHandle): Promise<{ resource: URI; comparableResource: URI }[]> {
		const resolved = this.resolveUri(uri);
		if (!resolved) {
			return [];
		}

		const profile = this.userDataProfilesService.profiles.find(p => p.id === resolved.profile);
		switch (resolved.syncResource) {
			case SyncResource.Settings: return this.getSettingsAssociatedResources(uri, profile);
			case SyncResource.Keybindings: return this.getKeybindingsAssociatedResources(uri, profile);
			case SyncResource.Tasks: return this.getTasksAssociatedResources(uri, profile);
			case SyncResource.Mcp: return this.getMcpAssociatedResources(uri, profile);
			case SyncResource.Snippets: return this.getSnippetsAssociatedResources(uri, profile);
			case SyncResource.Prompts: return this.getPromptsAssociatedResources(uri, profile);
			case SyncResource.GlobalState: return this.getGlobalStateAssociatedResources(uri, profile);
			case SyncResource.Extensions: return this.getExtensionsAssociatedResources(uri, profile);
			case SyncResource.Profiles: return this.getProfilesAssociatedResources(uri, profile);
			case SyncResource.WorkspaceState: return [];
		}
	}

	async getMachineId({ uri }: ISyncResourceHandle): Promise<string | undefined> {
		const resolved = this.resolveUri(uri);
		if (!resolved) {
			return undefined;
		}
		if (resolved.remote) {
			if (resolved.ref) {
				const { content } = await this.getUserData(resolved.syncResource, resolved.ref, resolved.collection);
				if (content) {
					const syncData = this.parseSyncData(content, resolved.syncResource);
					return syncData?.machineId;
				}
			}
			return undefined;
		}

		if (resolved.location) {
			if (resolved.ref) {
				const content = await this.userDataSyncLocalStoreService.resolveResourceContent(resolved.syncResource, resolved.ref, resolved.collection, resolved.location);
				if (content) {
					const syncData = this.parseSyncData(content, resolved.syncResource);
					return syncData?.machineId;
				}
			}
			return undefined;
		}

		return getServiceMachineId(this.environmentService, this.fileService, this.storageService);
	}

	async resolveContent(uri: URI): Promise<string | null> {
		const resolved = this.resolveUri(uri);
		if (!resolved) {
			return null;
		}

		if (resolved.node === UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE) {
			return null;
		}

		if (resolved.ref) {
			const content = await this.getContentFromStore(resolved.remote, resolved.syncResource, resolved.collection, resolved.ref, resolved.location);
			if (resolved.node && content) {
				return this.resolveNodeContent(resolved.syncResource, content, resolved.node);
			}
			return content;
		}

		if (!resolved.remote && !resolved.node) {
			return this.resolveLatestContent(resolved.syncResource, resolved.profile);
		}

		return null;
	}

	private async getContentFromStore(remote: boolean, syncResource: SyncResource, collection: string | undefined, ref: string, location?: URI): Promise<string | null> {
		if (remote) {
			const { content } = await this.getUserData(syncResource, ref, collection);
			return content;
		}
		return this.userDataSyncLocalStoreService.resolveResourceContent(syncResource, ref, collection, location);
	}

	private resolveNodeContent(syncResource: SyncResource, content: string, node: string): string | null {
		const syncData = this.parseSyncData(content, syncResource);
		switch (syncResource) {
			case SyncResource.Settings: return this.resolveSettingsNodeContent(syncData, node);
			case SyncResource.Keybindings: return this.resolveKeybindingsNodeContent(syncData, node);
			case SyncResource.Tasks: return this.resolveTasksNodeContent(syncData, node);
			case SyncResource.Mcp: return this.resolveMcpNodeContent(syncData, node);
			case SyncResource.Snippets: return this.resolveSnippetsNodeContent(syncData, node);
			case SyncResource.Prompts: return this.resolvePromptsNodeContent(syncData, node);
			case SyncResource.GlobalState: return this.resolveGlobalStateNodeContent(syncData, node);
			case SyncResource.Extensions: return this.resolveExtensionsNodeContent(syncData, node);
			case SyncResource.Profiles: return this.resolveProfileNodeContent(syncData, node);
			case SyncResource.WorkspaceState: return null;
		}
	}

	private async resolveLatestContent(syncResource: SyncResource, profileId: string): Promise<string | null> {
		const profile = this.userDataProfilesService.profiles.find(p => p.id === profileId);
		if (!profile) {
			return null;
		}
		switch (syncResource) {
			case SyncResource.GlobalState: return this.resolveLatestGlobalStateContent(profile);
			case SyncResource.Extensions: return this.resolveLatestExtensionsContent(profile);
			case SyncResource.Profiles: return this.resolveLatestProfilesContent(profile);
			case SyncResource.Settings: return null;
			case SyncResource.Keybindings: return null;
			case SyncResource.Tasks: return null;
			case SyncResource.Mcp: return null;
			case SyncResource.Snippets: return null;
			case SyncResource.Prompts: return null;
			case SyncResource.WorkspaceState: return null;
		}
	}

	private getSettingsAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'settings.json');
		const comparableResource = profile ? profile.settingsResource : this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveSettingsNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'settings.json':
				return parseSettingsSyncContent(syncData.content).settings;
		}
		return null;
	}

	private getKeybindingsAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'keybindings.json');
		const comparableResource = profile ? profile.keybindingsResource : this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveKeybindingsNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'keybindings.json':
				return getKeybindingsContentFromSyncContent(syncData.content, !!this.configurationService.getValue(CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM), this.logService);
		}
		return null;
	}

	private getTasksAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'tasks.json');
		const comparableResource = profile ? profile.tasksResource : this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveTasksNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'tasks.json':
				return getTasksContentFromSyncContent(syncData.content, this.logService);
		}
		return null;
	}

	private async getSnippetsAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): Promise<{ resource: URI; comparableResource: URI }[]> {
		const content = await this.resolveContent(uri);
		if (content) {
			const syncData = this.parseSyncData(content, SyncResource.Snippets);
			if (syncData) {
				const snippets = parseSnippets(syncData);
				const result = [];
				for (const snippet of Object.keys(snippets)) {
					const resource = this.extUri.joinPath(uri, snippet);
					const comparableResource = profile ? this.extUri.joinPath(profile.snippetsHome, snippet) : this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
					result.push({ resource, comparableResource });
				}
				return result;
			}
		}
		return [];
	}

	private resolveSnippetsNodeContent(syncData: ISyncData, node: string): string | null {
		return parseSnippets(syncData)[node] || null;
	}

	private async getPromptsAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): Promise<{ resource: URI; comparableResource: URI }[]> {
		const content = await this.resolveContent(uri);
		if (content) {
			const syncData = this.parseSyncData(content, SyncResource.Prompts);
			if (syncData) {
				const prompts = parsePrompts(syncData);
				const result = [];
				for (const prompt of Object.keys(prompts)) {
					const resource = this.extUri.joinPath(uri, prompt);
					const comparableResource = (profile)
						? this.extUri.joinPath(profile.promptsHome, prompt)
						: this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
					result.push({ resource, comparableResource });
				}
				return result;
			}
		}
		return [];
	}

	private resolvePromptsNodeContent(syncData: ISyncData, node: string): string | null {
		return parsePrompts(syncData)[node] || null;
	}

	private getExtensionsAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'extensions.json');
		const comparableResource = profile
			? this.toUri({
				remote: false,
				syncResource: SyncResource.Extensions,
				profile: profile.id,
				location: undefined,
				collection: undefined,
				ref: undefined,
				node: undefined,
			})
			: this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveExtensionsNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'extensions.json':
				return stringifyExtensions(parseExtensions(syncData), true);
		}
		return null;
	}

	private async resolveLatestExtensionsContent(profile: IUserDataProfile): Promise<string | null> {
		const { localExtensions } = await this.instantiationService.createInstance(LocalExtensionsProvider).getLocalExtensions(profile);
		return stringifyExtensions(localExtensions, true);
	}

	private getGlobalStateAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'globalState.json');
		const comparableResource = profile
			? this.toUri({
				remote: false,
				syncResource: SyncResource.GlobalState,
				profile: profile.id,
				location: undefined,
				collection: undefined,
				ref: undefined,
				node: undefined,
			})
			: this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveGlobalStateNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'globalState.json':
				return stringifyGlobalState(JSON.parse(syncData.content), true);
		}
		return null;
	}

	private async resolveLatestGlobalStateContent(profile: IUserDataProfile): Promise<string | null> {
		const localGlobalState = await this.instantiationService.createInstance(LocalGlobalStateProvider).getLocalGlobalState(profile);
		return stringifyGlobalState(localGlobalState, true);
	}

	private getProfilesAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'profiles.json');
		const comparableResource = this.toUri({
			remote: false,
			syncResource: SyncResource.Profiles,
			profile: this.userDataProfilesService.defaultProfile.id,
			location: undefined,
			collection: undefined,
			ref: undefined,
			node: undefined,
		});
		return [{ resource, comparableResource }];
	}

	private resolveProfileNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'profiles.json':
				return toFormattedString(JSON.parse(syncData.content), {});
		}
		return null;
	}

	private async resolveLatestProfilesContent(profile: IUserDataProfile): Promise<string | null> {
		return stringifyLocalProfiles(this.userDataProfilesService.profiles.filter(p => !p.isDefault && !p.isTransient), true);
	}

	private toUri(syncResourceUriInfo: ISyncResourceUriInfo): URI {
		const authority = syncResourceUriInfo.remote ? UserDataSyncResourceProviderService.REMOTE_BACKUP_AUTHORITY : UserDataSyncResourceProviderService.LOCAL_BACKUP_AUTHORITY;
		const paths = [];
		if (syncResourceUriInfo.location) {
			paths.push(`scheme:${syncResourceUriInfo.location.scheme}`);
			paths.push(`authority:${syncResourceUriInfo.location.authority}`);
			paths.push(trim(syncResourceUriInfo.location.path, '/'));
		}
		paths.push(`syncResource:${syncResourceUriInfo.syncResource}`);
		paths.push(`profile:${syncResourceUriInfo.profile}`);
		if (syncResourceUriInfo.collection) {
			paths.push(`collection:${syncResourceUriInfo.collection}`);
		}
		if (syncResourceUriInfo.ref) {
			paths.push(`ref:${syncResourceUriInfo.ref}`);
		}
		if (syncResourceUriInfo.node) {
			paths.push(syncResourceUriInfo.node);
		}
		return this.extUri.joinPath(URI.from({ scheme: USER_DATA_SYNC_SCHEME, authority, path: `/`, query: syncResourceUriInfo.location?.query, fragment: syncResourceUriInfo.location?.fragment }), ...paths);
	}

	private resolveUri(uri: URI): ISyncResourceUriInfo | undefined {
		if (uri.scheme !== USER_DATA_SYNC_SCHEME) {
			return undefined;
		}
		const paths: string[] = [];
		while (uri.path !== '/') {
			paths.unshift(this.extUri.basename(uri));
			uri = this.extUri.dirname(uri);
		}
		if (paths.length < 2) {
			return undefined;
		}
		const remote = uri.authority === UserDataSyncResourceProviderService.REMOTE_BACKUP_AUTHORITY;
		let scheme: string | undefined;
		let authority: string | undefined;
		const locationPaths: string[] = [];
		let syncResource: SyncResource | undefined;
		let profile: string | undefined;
		let collection: string | undefined;
		let ref: string | undefined;
		let node: string | undefined;
		while (paths.length) {
			const path = paths.shift()!;
			if (path.startsWith('scheme:')) {
				scheme = path.substring('scheme:'.length);
			} else if (path.startsWith('authority:')) {
				authority = path.substring('authority:'.length);
			} else if (path.startsWith('syncResource:')) {
				syncResource = path.substring('syncResource:'.length) as SyncResource;
			} else if (path.startsWith('profile:')) {
				profile = path.substring('profile:'.length);
			} else if (path.startsWith('collection:')) {
				collection = path.substring('collection:'.length);
			} else if (path.startsWith('ref:')) {
				ref = path.substring('ref:'.length);
			} else if (!syncResource) {
				locationPaths.push(path);
			} else {
				node = path;
			}
		}
		return {
			remote,
			syncResource: syncResource!,
			profile: profile!,
			collection,
			ref,
			node,
			location: scheme && authority !== undefined ? this.extUri.joinPath(URI.from({ scheme, authority, query: uri.query, fragment: uri.fragment, path: '/' }), ...locationPaths) : undefined
		};
	}

	private parseSyncData(content: string, syncResource: SyncResource): ISyncData {
		try {
			const syncData: ISyncData = JSON.parse(content);
			if (isSyncData(syncData)) {
				return syncData;
			}
		} catch (error) {
			this.logService.error(error);
		}
		throw new UserDataSyncError(localize('incompatible sync data', "Cannot parse sync data as it is not compatible with the current version."), UserDataSyncErrorCode.IncompatibleRemoteContent, syncResource);
	}

	private async getUserData(syncResource: SyncResource, ref: string, collection?: string): Promise<IUserData> {
		const content = await this.userDataSyncStoreService.resolveResourceContent(syncResource, ref, collection);
		return { ref, content };
	}

	private getMcpAssociatedResources(uri: URI, profile: IUserDataProfile | undefined): { resource: URI; comparableResource: URI }[] {
		const resource = this.extUri.joinPath(uri, 'mcp.json');
		const comparableResource = profile ? profile.mcpResource : this.extUri.joinPath(uri, UserDataSyncResourceProviderService.NOT_EXISTING_RESOURCE);
		return [{ resource, comparableResource }];
	}

	private resolveMcpNodeContent(syncData: ISyncData, node: string): string | null {
		switch (node) {
			case 'mcp.json':
				return getMcpContentFromSyncContent(syncData.content, this.logService);
		}
		return null;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncService.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../base/common/arrays.js';
import { CancelablePromise, createCancelablePromise, RunOnceScheduler } from '../../../base/common/async.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { toErrorMessage } from '../../../base/common/errorMessage.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable, DisposableStore, IDisposable, toDisposable } from '../../../base/common/lifecycle.js';
import { isEqual } from '../../../base/common/resources.js';
import { isBoolean, isUndefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IExtensionGalleryService } from '../../extensionManagement/common/extensionManagement.js';
import { IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { ExtensionsSynchroniser } from './extensionsSync.js';
import { GlobalStateSynchroniser } from './globalStateSync.js';
import { KeybindingsSynchroniser } from './keybindingsSync.js';
import { PromptsSynchronizer } from './promptsSync/promptsSync.js';
import { SettingsSynchroniser } from './settingsSync.js';
import { SnippetsSynchroniser } from './snippetsSync.js';
import { TasksSynchroniser } from './tasksSync.js';
import { McpSynchroniser } from './mcpSync.js';
import { UserDataProfilesManifestSynchroniser } from './userDataProfilesManifestSync.js';
import {
	ALL_SYNC_RESOURCES, createSyncHeaders, IUserDataManualSyncTask, IUserDataSyncResourceConflicts, IUserDataSyncResourceError,
	IUserDataSyncResource, ISyncResourceHandle, IUserDataSyncTask, ISyncUserDataProfile, IUserDataManifest, IUserDataSyncConfiguration,
	IUserDataSyncEnablementService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncService, IUserDataSyncStoreManagementService, IUserDataSyncStoreService,
	SyncResource, SyncStatus, UserDataSyncError, UserDataSyncErrorCode, UserDataSyncStoreError, USER_DATA_SYNC_CONFIGURATION_SCOPE, IUserDataSyncResourceProviderService, IUserDataSyncActivityData, IUserDataSyncLocalStoreService,
	IUserDataSyncLatestData,
	IUserData,
	isUserDataManifest,
} from './userDataSync.js';

type SyncErrorClassification = {
	owner: 'sandy081';
	comment: 'Information about the error that occurred while syncing';
	code: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'error code' };
	service: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Settings Sync service for which this error has occurred' };
	serverCode?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Settings Sync service error code' };
	url?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Settings Sync resource URL for which this error has occurred' };
	resource?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Settings Sync resource for which this error has occurred' };
	executionId?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Settings Sync execution id for which this error has occurred' };
};

type SyncErrorEvent = {
	code: string;
	service: string;
	serverCode?: string;
	url?: string;
	resource?: string;
	executionId?: string;
};

const LAST_SYNC_TIME_KEY = 'sync.lastSyncTime';

export class UserDataSyncService extends Disposable implements IUserDataSyncService {

	_serviceBrand: undefined;

	private _status: SyncStatus = SyncStatus.Uninitialized;
	get status(): SyncStatus { return this._status; }
	private _onDidChangeStatus: Emitter<SyncStatus> = this._register(new Emitter<SyncStatus>());
	readonly onDidChangeStatus: Event<SyncStatus> = this._onDidChangeStatus.event;

	private _onDidChangeLocal = this._register(new Emitter<SyncResource>());
	readonly onDidChangeLocal = this._onDidChangeLocal.event;

	private _conflicts: IUserDataSyncResourceConflicts[] = [];
	get conflicts(): IUserDataSyncResourceConflicts[] { return this._conflicts; }
	private _onDidChangeConflicts = this._register(new Emitter<IUserDataSyncResourceConflicts[]>());
	readonly onDidChangeConflicts = this._onDidChangeConflicts.event;

	private _syncErrors: IUserDataSyncResourceError[] = [];
	private _onSyncErrors = this._register(new Emitter<IUserDataSyncResourceError[]>());
	readonly onSyncErrors = this._onSyncErrors.event;

	private _lastSyncTime: number | undefined = undefined;
	get lastSyncTime(): number | undefined { return this._lastSyncTime; }
	private _onDidChangeLastSyncTime: Emitter<number> = this._register(new Emitter<number>());
	readonly onDidChangeLastSyncTime: Event<number> = this._onDidChangeLastSyncTime.event;

	private _onDidResetLocal = this._register(new Emitter<void>());
	readonly onDidResetLocal = this._onDidResetLocal.event;

	private _onDidResetRemote = this._register(new Emitter<void>());
	readonly onDidResetRemote = this._onDidResetRemote.event;

	private activeProfileSynchronizers = new Map<string, [ProfileSynchronizer, IDisposable]>();

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IUserDataSyncStoreService private readonly userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IStorageService private readonly storageService: IStorageService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUserDataSyncResourceProviderService private readonly userDataSyncResourceProviderService: IUserDataSyncResourceProviderService,
		@IUserDataSyncLocalStoreService private readonly userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
	) {
		super();
		this._status = userDataSyncStoreManagementService.userDataSyncStore ? SyncStatus.Idle : SyncStatus.Uninitialized;
		this._lastSyncTime = this.storageService.getNumber(LAST_SYNC_TIME_KEY, StorageScope.APPLICATION, undefined);
		this._register(toDisposable(() => this.clearActiveProfileSynchronizers()));

		this._register(new RunOnceScheduler(() => this.cleanUpStaleStorageData(), 5 * 1000 /* after 5s */)).schedule();
	}

	async createSyncTask(manifest: IUserDataManifest | null, disableCache?: boolean): Promise<IUserDataSyncTask> {
		this.checkEnablement();

		this.logService.info('Sync started.');
		const startTime = new Date().getTime();
		const executionId = generateUuid();
		try {
			const syncHeaders = createSyncHeaders(executionId);
			if (disableCache) {
				syncHeaders['Cache-Control'] = 'no-cache';
			}
			manifest = await this.userDataSyncStoreService.manifest(manifest, syncHeaders);
		} catch (error) {
			const userDataSyncError = UserDataSyncError.toUserDataSyncError(error);
			reportUserDataSyncError(userDataSyncError, executionId, this.userDataSyncStoreManagementService, this.telemetryService);
			throw userDataSyncError;
		}

		const executed = false;
		const that = this;
		let cancellablePromise: CancelablePromise<void> | undefined;
		return {
			manifest,
			async run(): Promise<void> {
				if (executed) {
					throw new Error('Can run a task only once');
				}
				cancellablePromise = createCancelablePromise(token => that.sync(manifest, false, executionId, token));
				await cancellablePromise.finally(() => cancellablePromise = undefined);
				that.logService.info(`Sync done. Took ${new Date().getTime() - startTime}ms`);
				that.updateLastSyncTime();
			},
			stop(): Promise<void> {
				cancellablePromise?.cancel();
				return that.stop();
			}
		};
	}

	async createManualSyncTask(): Promise<IUserDataManualSyncTask> {
		this.checkEnablement();

		if (this.userDataSyncEnablementService.isEnabled()) {
			throw new UserDataSyncError('Cannot start manual sync when sync is enabled', UserDataSyncErrorCode.LocalError);
		}

		this.logService.info('Sync started.');
		const startTime = new Date().getTime();
		const executionId = generateUuid();
		const syncHeaders = createSyncHeaders(executionId);
		let latestUserDataOrManifest: IUserDataSyncLatestData | IUserDataManifest | null;
		try {
			latestUserDataOrManifest = await this.userDataSyncStoreService.getLatestData(syncHeaders);
		} catch (error) {
			const userDataSyncError = UserDataSyncError.toUserDataSyncError(error);
			this.telemetryService.publicLog2<SyncErrorEvent, SyncErrorClassification>('sync.download.latest',
				{
					code: userDataSyncError.code,
					serverCode: userDataSyncError instanceof UserDataSyncStoreError ? String(userDataSyncError.serverCode) : undefined,
					url: userDataSyncError instanceof UserDataSyncStoreError ? userDataSyncError.url : undefined,
					resource: userDataSyncError.resource,
					executionId,
					service: this.userDataSyncStoreManagementService.userDataSyncStore!.url.toString()
				});

			// Fallback to manifest in stable
			try {
				latestUserDataOrManifest = await this.userDataSyncStoreService.manifest(null, syncHeaders);
			} catch (error) {
				const userDataSyncError = UserDataSyncError.toUserDataSyncError(error);
				reportUserDataSyncError(userDataSyncError, executionId, this.userDataSyncStoreManagementService, this.telemetryService);
				throw userDataSyncError;
			}
		}

		/* Manual sync shall start on clean local state */
		await this.resetLocal();

		const that = this;
		const cancellableToken = new CancellationTokenSource();
		return {
			id: executionId,
			async merge(): Promise<void> {
				return that.sync(latestUserDataOrManifest, true, executionId, cancellableToken.token);
			},
			async apply(): Promise<void> {
				try {
					try {
						await that.applyManualSync(latestUserDataOrManifest, executionId, cancellableToken.token);
					} catch (error) {
						if (UserDataSyncError.toUserDataSyncError(error).code === UserDataSyncErrorCode.MethodNotFound) {
							that.logService.info('Client is making invalid requests. Cleaning up data...');
							await that.cleanUpRemoteData();
							that.logService.info('Applying manual sync again...');
							await that.applyManualSync(latestUserDataOrManifest, executionId, cancellableToken.token);
						} else {
							throw error;
						}
					}
				} catch (error) {
					that.logService.error(error);
					throw error;
				}
				that.logService.info(`Sync done. Took ${new Date().getTime() - startTime}ms`);
				that.updateLastSyncTime();
			},
			async stop(): Promise<void> {
				cancellableToken.cancel();
				await that.stop();
				await that.resetLocal();
			}
		};
	}

	private async sync(manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null, preview: boolean, executionId: string, token: CancellationToken): Promise<void> {
		this._syncErrors = [];
		try {
			if (this.status !== SyncStatus.HasConflicts) {
				this.setStatus(SyncStatus.Syncing);
			}

			// Sync Default Profile First
			const defaultProfileSynchronizer = this.getOrCreateActiveProfileSynchronizer(this.userDataProfilesService.defaultProfile, undefined);
			this._syncErrors.push(...await this.syncProfile(defaultProfileSynchronizer, manifestOrLatestData, preview, executionId, token));

			// Sync other profiles
			const userDataProfileManifestSynchronizer = defaultProfileSynchronizer.enabled.find(s => s.resource === SyncResource.Profiles);
			if (userDataProfileManifestSynchronizer) {
				const syncProfiles = (await (userDataProfileManifestSynchronizer as UserDataProfilesManifestSynchroniser).getLastSyncedProfiles()) || [];
				if (token.isCancellationRequested) {
					return;
				}
				await this.syncRemoteProfiles(syncProfiles, manifestOrLatestData, preview, executionId, token);
			}
		} finally {
			if (this.status !== SyncStatus.HasConflicts) {
				this.setStatus(SyncStatus.Idle);
			}
			this._onSyncErrors.fire(this._syncErrors);
		}
	}

	private async syncRemoteProfiles(remoteProfiles: ISyncUserDataProfile[], manifest: IUserDataManifest | IUserDataSyncLatestData | null, preview: boolean, executionId: string, token: CancellationToken): Promise<void> {
		for (const syncProfile of remoteProfiles) {
			if (token.isCancellationRequested) {
				return;
			}
			const profile = this.userDataProfilesService.profiles.find(p => p.id === syncProfile.id);
			if (!profile) {
				this.logService.error(`Profile with id:${syncProfile.id} and name: ${syncProfile.name} does not exist locally to sync.`);
				continue;
			}
			this.logService.info('Syncing profile.', syncProfile.name);
			const profileSynchronizer = this.getOrCreateActiveProfileSynchronizer(profile, syncProfile);
			this._syncErrors.push(...await this.syncProfile(profileSynchronizer, manifest, preview, executionId, token));
		}
		// Dispose & Delete profile synchronizers which do not exist anymore
		for (const [key, profileSynchronizerItem] of this.activeProfileSynchronizers.entries()) {
			if (this.userDataProfilesService.profiles.some(p => p.id === profileSynchronizerItem[0].profile.id)) {
				continue;
			}
			await profileSynchronizerItem[0].resetLocal();
			profileSynchronizerItem[1].dispose();
			this.activeProfileSynchronizers.delete(key);
		}
	}

	private async applyManualSync(manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null, executionId: string, token: CancellationToken): Promise<void> {
		try {
			this.setStatus(SyncStatus.Syncing);
			const profileSynchronizers = this.getActiveProfileSynchronizers();
			for (const profileSynchronizer of profileSynchronizers) {
				if (token.isCancellationRequested) {
					return;
				}
				await profileSynchronizer.apply(executionId, token);
			}

			const defaultProfileSynchronizer = profileSynchronizers.find(s => s.profile.isDefault);
			if (!defaultProfileSynchronizer) {
				return;
			}

			const userDataProfileManifestSynchronizer = defaultProfileSynchronizer.enabled.find(s => s.resource === SyncResource.Profiles);
			if (!userDataProfileManifestSynchronizer) {
				return;
			}

			// Sync remote profiles which are not synced locally
			const remoteProfiles = (await (userDataProfileManifestSynchronizer as UserDataProfilesManifestSynchroniser).getRemoteSyncedProfiles(getRefOrUserData(manifestOrLatestData, undefined, SyncResource.Profiles) ?? null)) || [];
			const remoteProfilesToSync = remoteProfiles.filter(remoteProfile => profileSynchronizers.every(s => s.profile.id !== remoteProfile.id));
			if (remoteProfilesToSync.length) {
				await this.syncRemoteProfiles(remoteProfilesToSync, manifestOrLatestData, false, executionId, token);
			}
		} finally {
			this.setStatus(SyncStatus.Idle);
		}
	}

	private async syncProfile(profileSynchronizer: ProfileSynchronizer, manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null, preview: boolean, executionId: string, token: CancellationToken): Promise<IUserDataSyncResourceError[]> {
		const errors = await profileSynchronizer.sync(manifestOrLatestData, preview, executionId, token);
		return errors.map(([syncResource, error]) => ({ profile: profileSynchronizer.profile, syncResource, error }));
	}

	private async stop(): Promise<void> {
		if (this.status !== SyncStatus.Idle) {
			await Promise.allSettled(this.getActiveProfileSynchronizers().map(profileSynchronizer => profileSynchronizer.stop()));
		}
	}

	async resolveContent(resource: URI): Promise<string | null> {
		const content = await this.userDataSyncResourceProviderService.resolveContent(resource);
		if (content) {
			return content;
		}
		for (const profileSynchronizer of this.getActiveProfileSynchronizers()) {
			for (const synchronizer of profileSynchronizer.enabled) {
				const content = await synchronizer.resolveContent(resource);
				if (content) {
					return content;
				}
			}
		}
		return null;
	}

	async replace(syncResourceHandle: ISyncResourceHandle): Promise<void> {
		this.checkEnablement();

		const profileSyncResource = this.userDataSyncResourceProviderService.resolveUserDataSyncResource(syncResourceHandle);
		if (!profileSyncResource) {
			return;
		}

		const content = await this.resolveContent(syncResourceHandle.uri);
		if (!content) {
			return;
		}

		await this.performAction(profileSyncResource.profile, async synchronizer => {
			if (profileSyncResource.syncResource === synchronizer.resource) {
				await synchronizer.replace(content);
				return true;
			}
			return undefined;
		});

		return;
	}

	async accept(syncResource: IUserDataSyncResource, resource: URI, content: string | null | undefined, apply: boolean | { force: boolean }): Promise<void> {
		this.checkEnablement();

		await this.performAction(syncResource.profile, async synchronizer => {
			if (syncResource.syncResource === synchronizer.resource) {
				await synchronizer.accept(resource, content);
				if (apply) {
					await synchronizer.apply(isBoolean(apply) ? false : apply.force, createSyncHeaders(generateUuid()));
				}
				return true;
			}
			return undefined;
		});
	}

	async hasLocalData(): Promise<boolean> {
		const result = await this.performAction(this.userDataProfilesService.defaultProfile, async synchronizer => {
			// skip global state synchronizer
			if (synchronizer.resource !== SyncResource.GlobalState && await synchronizer.hasLocalData()) {
				return true;
			}
			return undefined;
		});
		return !!result;
	}

	async hasPreviouslySynced(): Promise<boolean> {
		const result = await this.performAction(this.userDataProfilesService.defaultProfile, async synchronizer => {
			if (await synchronizer.hasPreviouslySynced()) {
				return true;
			}
			return undefined;
		});
		return !!result;
	}

	async reset(): Promise<void> {
		this.checkEnablement();
		await this.resetRemote();
		await this.resetLocal();
	}

	async resetRemote(): Promise<void> {
		this.checkEnablement();
		try {
			await this.userDataSyncStoreService.clear();
			this.logService.info('Cleared data on server');
		} catch (e) {
			this.logService.error(e);
		}
		this._onDidResetRemote.fire();
	}

	async resetLocal(): Promise<void> {
		this.checkEnablement();
		this._lastSyncTime = undefined;
		this.storageService.remove(LAST_SYNC_TIME_KEY, StorageScope.APPLICATION);
		for (const [synchronizer] of this.activeProfileSynchronizers.values()) {
			try {
				await synchronizer.resetLocal();
			} catch (e) {
				this.logService.error(e);
			}
		}
		this.clearActiveProfileSynchronizers();
		this._onDidResetLocal.fire();
		this.logService.info('Did reset the local sync state.');
	}

	private async cleanUpStaleStorageData(): Promise<void> {
		const allKeys = this.storageService.keys(StorageScope.APPLICATION, StorageTarget.MACHINE);
		const lastSyncProfileKeys: [string, string][] = [];
		for (const key of allKeys) {
			if (!key.endsWith('.lastSyncUserData')) {
				continue;
			}
			const segments = key.split('.');
			if (segments.length === 3) {
				lastSyncProfileKeys.push([key, segments[0]]);
			}
		}
		if (!lastSyncProfileKeys.length) {
			return;
		}

		const disposables = new DisposableStore();

		try {
			let defaultProfileSynchronizer = this.activeProfileSynchronizers.get(this.userDataProfilesService.defaultProfile.id)?.[0];
			if (!defaultProfileSynchronizer) {
				defaultProfileSynchronizer = disposables.add(this.instantiationService.createInstance(ProfileSynchronizer, this.userDataProfilesService.defaultProfile, undefined));
			}
			const userDataProfileManifestSynchronizer = defaultProfileSynchronizer.enabled.find(s => s.resource === SyncResource.Profiles) as UserDataProfilesManifestSynchroniser;
			if (!userDataProfileManifestSynchronizer) {
				return;
			}
			const lastSyncedProfiles = await userDataProfileManifestSynchronizer.getLastSyncedProfiles();
			const lastSyncedCollections = lastSyncedProfiles?.map(p => p.collection) ?? [];
			for (const [key, collection] of lastSyncProfileKeys) {
				if (!lastSyncedCollections.includes(collection)) {
					this.logService.info(`Removing last sync state for stale profile: ${collection}`);
					this.storageService.remove(key, StorageScope.APPLICATION);
				}
			}
		} finally {
			disposables.dispose();
		}
	}

	async cleanUpRemoteData(): Promise<void> {
		const remoteProfiles = await this.userDataSyncResourceProviderService.getRemoteSyncedProfiles();
		const remoteProfileCollections = remoteProfiles.map(profile => profile.collection);
		const allCollections = await this.userDataSyncStoreService.getAllCollections();
		const redundantCollections = allCollections.filter(c => !remoteProfileCollections.includes(c));
		if (redundantCollections.length) {
			this.logService.info(`Deleting ${redundantCollections.length} redundant collections on server`);
			await Promise.allSettled(redundantCollections.map(collectionId => this.userDataSyncStoreService.deleteCollection(collectionId)));
			this.logService.info(`Deleted redundant collections on server`);
		}
		const updatedRemoteProfiles = remoteProfiles.filter(profile => allCollections.includes(profile.collection));
		if (updatedRemoteProfiles.length !== remoteProfiles.length) {
			const profileManifestSynchronizer = this.instantiationService.createInstance(UserDataProfilesManifestSynchroniser, this.userDataProfilesService.defaultProfile, undefined);
			try {
				this.logService.info('Resetting the last synced state of profiles');
				await profileManifestSynchronizer.resetLocal();
				this.logService.info('Did reset the last synced state of profiles');
				this.logService.info(`Updating remote profiles with invalid collections on server`);
				await profileManifestSynchronizer.updateRemoteProfiles(updatedRemoteProfiles, null);
				this.logService.info(`Updated remote profiles on server`);
			} finally {
				profileManifestSynchronizer.dispose();
			}
		}
	}

	async saveRemoteActivityData(location: URI): Promise<void> {
		this.checkEnablement();
		const data = await this.userDataSyncStoreService.getActivityData();
		await this.fileService.writeFile(location, data);
	}

	async extractActivityData(activityDataResource: URI, location: URI): Promise<void> {
		const content = (await this.fileService.readFile(activityDataResource)).value.toString();
		const activityData: IUserDataSyncActivityData = JSON.parse(content);

		if (activityData.resources) {
			for (const resource in activityData.resources) {
				for (const version of activityData.resources[resource]) {
					await this.userDataSyncLocalStoreService.writeResource(resource as SyncResource, version.content, new Date(version.created * 1000), undefined, location);
				}
			}
		}

		if (activityData.collections) {
			for (const collection in activityData.collections) {
				for (const resource in activityData.collections[collection].resources) {
					for (const version of activityData.collections[collection].resources?.[resource] ?? []) {
						await this.userDataSyncLocalStoreService.writeResource(resource as SyncResource, version.content, new Date(version.created * 1000), collection, location);
					}
				}
			}
		}
	}

	private async performAction<T>(profile: IUserDataProfile, action: (synchroniser: IUserDataSynchroniser) => Promise<T | undefined>): Promise<T | null> {
		const disposables = new DisposableStore();
		try {
			const activeProfileSyncronizer = this.activeProfileSynchronizers.get(profile.id);
			if (activeProfileSyncronizer) {
				const result = await this.performActionWithProfileSynchronizer(activeProfileSyncronizer[0], action, disposables);
				return isUndefined(result) ? null : result;
			}

			if (profile.isDefault) {
				const defaultProfileSynchronizer = disposables.add(this.instantiationService.createInstance(ProfileSynchronizer, profile, undefined));
				const result = await this.performActionWithProfileSynchronizer(defaultProfileSynchronizer, action, disposables);
				return isUndefined(result) ? null : result;
			}

			const userDataProfileManifestSynchronizer = disposables.add(this.instantiationService.createInstance(UserDataProfilesManifestSynchroniser, profile, undefined));
			const manifest = await this.userDataSyncStoreService.manifest(null);
			const syncProfiles = (await userDataProfileManifestSynchronizer.getRemoteSyncedProfiles(manifest?.latest?.profiles ?? null)) || [];
			const syncProfile = syncProfiles.find(syncProfile => syncProfile.id === profile.id);
			if (syncProfile) {
				const profileSynchronizer = disposables.add(this.instantiationService.createInstance(ProfileSynchronizer, profile, syncProfile.collection));
				const result = await this.performActionWithProfileSynchronizer(profileSynchronizer, action, disposables);
				return isUndefined(result) ? null : result;
			}

			return null;
		} finally {
			disposables.dispose();
		}
	}

	private async performActionWithProfileSynchronizer<T>(profileSynchronizer: ProfileSynchronizer, action: (synchroniser: IUserDataSynchroniser) => Promise<T | undefined>, disposables: DisposableStore): Promise<T | undefined> {
		const allSynchronizers = [...profileSynchronizer.enabled, ...profileSynchronizer.disabled.reduce<(IUserDataSynchroniser & IDisposable)[]>((synchronizers, syncResource) => {
			if (syncResource !== SyncResource.WorkspaceState) {
				synchronizers.push(disposables.add(profileSynchronizer.createSynchronizer(syncResource)));
			}
			return synchronizers;
		}, [])];
		for (const synchronizer of allSynchronizers) {
			const result = await action(synchronizer);
			if (!isUndefined(result)) {
				return result;
			}
		}
		return undefined;
	}

	private setStatus(status: SyncStatus): void {
		const oldStatus = this._status;
		if (this._status !== status) {
			this._status = status;
			this._onDidChangeStatus.fire(status);
			if (oldStatus === SyncStatus.HasConflicts) {
				this.updateLastSyncTime();
			}
		}
	}

	private updateConflicts(): void {
		const conflicts = this.getActiveProfileSynchronizers().map(synchronizer => synchronizer.conflicts).flat();
		if (!equals(this._conflicts, conflicts, (a, b) => a.profile.id === b.profile.id && a.syncResource === b.syncResource && equals(a.conflicts, b.conflicts, (a, b) => isEqual(a.previewResource, b.previewResource)))) {
			this._conflicts = conflicts;
			this._onDidChangeConflicts.fire(conflicts);
		}
	}

	private updateLastSyncTime(): void {
		if (this.status === SyncStatus.Idle) {
			this._lastSyncTime = new Date().getTime();
			this.storageService.store(LAST_SYNC_TIME_KEY, this._lastSyncTime, StorageScope.APPLICATION, StorageTarget.MACHINE);
			this._onDidChangeLastSyncTime.fire(this._lastSyncTime);
		}
	}

	getOrCreateActiveProfileSynchronizer(profile: IUserDataProfile, syncProfile: ISyncUserDataProfile | undefined): ProfileSynchronizer {
		let activeProfileSynchronizer = this.activeProfileSynchronizers.get(profile.id);
		if (activeProfileSynchronizer && activeProfileSynchronizer[0].collection !== syncProfile?.collection) {
			this.logService.error('Profile synchronizer collection does not match with the remote sync profile collection');
			activeProfileSynchronizer[1].dispose();
			activeProfileSynchronizer = undefined;
			this.activeProfileSynchronizers.delete(profile.id);
		}
		if (!activeProfileSynchronizer) {
			const disposables = new DisposableStore();
			const profileSynchronizer = disposables.add(this.instantiationService.createInstance(ProfileSynchronizer, profile, syncProfile?.collection));
			disposables.add(profileSynchronizer.onDidChangeStatus(e => this.setStatus(e)));
			disposables.add(profileSynchronizer.onDidChangeConflicts(conflicts => this.updateConflicts()));
			disposables.add(profileSynchronizer.onDidChangeLocal(e => this._onDidChangeLocal.fire(e)));
			this.activeProfileSynchronizers.set(profile.id, activeProfileSynchronizer = [profileSynchronizer, disposables]);
		}
		return activeProfileSynchronizer[0];
	}

	private getActiveProfileSynchronizers(): ProfileSynchronizer[] {
		const profileSynchronizers: ProfileSynchronizer[] = [];
		for (const [profileSynchronizer] of this.activeProfileSynchronizers.values()) {
			profileSynchronizers.push(profileSynchronizer);
		}
		return profileSynchronizers;
	}

	private clearActiveProfileSynchronizers(): void {
		this.activeProfileSynchronizers.forEach(([, disposable]) => disposable.dispose());
		this.activeProfileSynchronizers.clear();
	}

	private checkEnablement(): void {
		if (!this.userDataSyncStoreManagementService.userDataSyncStore) {
			throw new Error('Not enabled');
		}
	}

}


class ProfileSynchronizer extends Disposable {

	private _enabled: [IUserDataSynchroniser, number, IDisposable][] = [];
	get enabled(): IUserDataSynchroniser[] { return this._enabled.sort((a, b) => a[1] - b[1]).map(([synchronizer]) => synchronizer); }

	get disabled(): SyncResource[] { return ALL_SYNC_RESOURCES.filter(syncResource => !this.userDataSyncEnablementService.isResourceEnabled(syncResource)); }

	private _status: SyncStatus = SyncStatus.Idle;
	get status(): SyncStatus { return this._status; }
	private _onDidChangeStatus: Emitter<SyncStatus> = this._register(new Emitter<SyncStatus>());
	readonly onDidChangeStatus: Event<SyncStatus> = this._onDidChangeStatus.event;

	private _onDidChangeLocal = this._register(new Emitter<SyncResource>());
	readonly onDidChangeLocal = this._onDidChangeLocal.event;

	private _conflicts: IUserDataSyncResourceConflicts[] = [];
	get conflicts(): IUserDataSyncResourceConflicts[] { return this._conflicts; }
	private _onDidChangeConflicts = this._register(new Emitter<IUserDataSyncResourceConflicts[]>());
	readonly onDidChangeConflicts = this._onDidChangeConflicts.event;

	constructor(
		readonly profile: IUserDataProfile,
		readonly collection: string | undefined,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
		this._register(userDataSyncEnablementService.onDidChangeResourceEnablement(([syncResource, enablement]) => this.onDidChangeResourceEnablement(syncResource, enablement)));
		this._register(toDisposable(() => this._enabled.splice(0, this._enabled.length).forEach(([, , disposable]) => disposable.dispose())));
		for (const syncResource of ALL_SYNC_RESOURCES) {
			if (userDataSyncEnablementService.isResourceEnabled(syncResource)) {
				this.registerSynchronizer(syncResource);
			}
		}
	}

	private onDidChangeResourceEnablement(syncResource: SyncResource, enabled: boolean): void {
		if (enabled) {
			this.registerSynchronizer(syncResource);
		} else {
			this.deRegisterSynchronizer(syncResource);
		}
	}

	protected registerSynchronizer(syncResource: SyncResource): void {
		if (this._enabled.some(([synchronizer]) => synchronizer.resource === syncResource)) {
			return;
		}
		if (syncResource === SyncResource.Extensions && !this.extensionGalleryService.isEnabled()) {
			this.logService.info('Skipping extensions sync because gallery is not configured');
			return;
		}
		if (syncResource === SyncResource.Profiles) {
			if (!this.profile.isDefault) {
				return;
			}
		}
		if (syncResource === SyncResource.WorkspaceState) {
			return;
		}
		if (syncResource !== SyncResource.Profiles && this.profile.useDefaultFlags?.[syncResource]) {
			this.logService.debug(`Skipping syncing ${syncResource} in ${this.profile.name} because it is already synced by default profile`);
			return;
		}
		const disposables = new DisposableStore();
		const synchronizer = disposables.add(this.createSynchronizer(syncResource));
		disposables.add(synchronizer.onDidChangeStatus(() => this.updateStatus()));
		disposables.add(synchronizer.onDidChangeConflicts(() => this.updateConflicts()));
		disposables.add(synchronizer.onDidChangeLocal(() => this._onDidChangeLocal.fire(syncResource)));
		const order = this.getOrder(syncResource);
		this._enabled.push([synchronizer, order, disposables]);
	}

	private deRegisterSynchronizer(syncResource: SyncResource): void {
		const index = this._enabled.findIndex(([synchronizer]) => synchronizer.resource === syncResource);
		if (index !== -1) {
			const [[synchronizer, , disposable]] = this._enabled.splice(index, 1);
			disposable.dispose();
			this.updateStatus();
			synchronizer.stop().then(null, error => this.logService.error(error));
		}
	}

	createSynchronizer(syncResource: Exclude<SyncResource, SyncResource.WorkspaceState>): IUserDataSynchroniser & IDisposable {
		switch (syncResource) {
			case SyncResource.Settings: return this.instantiationService.createInstance(SettingsSynchroniser, this.profile, this.collection);
			case SyncResource.Keybindings: return this.instantiationService.createInstance(KeybindingsSynchroniser, this.profile, this.collection);
			case SyncResource.Snippets: return this.instantiationService.createInstance(SnippetsSynchroniser, this.profile, this.collection);
			case SyncResource.Prompts: return this.instantiationService.createInstance(PromptsSynchronizer, this.profile, this.collection);
			case SyncResource.Tasks: return this.instantiationService.createInstance(TasksSynchroniser, this.profile, this.collection);
			case SyncResource.Mcp: return this.instantiationService.createInstance(McpSynchroniser, this.profile, this.collection);
			case SyncResource.GlobalState: return this.instantiationService.createInstance(GlobalStateSynchroniser, this.profile, this.collection);
			case SyncResource.Extensions: return this.instantiationService.createInstance(ExtensionsSynchroniser, this.profile, this.collection);
			case SyncResource.Profiles: return this.instantiationService.createInstance(UserDataProfilesManifestSynchroniser, this.profile, this.collection);
		}
	}

	async sync(manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null, preview: boolean, executionId: string, token: CancellationToken): Promise<[SyncResource, UserDataSyncError][]> {

		// Return if cancellation is requested
		if (token.isCancellationRequested) {
			return [];
		}

		const synchronizers = this.enabled;
		if (!synchronizers.length) {
			return [];
		}

		try {
			const syncErrors: [SyncResource, UserDataSyncError][] = [];
			const syncHeaders = createSyncHeaders(executionId);
			const userDataSyncConfiguration = preview ? await this.getUserDataSyncConfiguration(manifestOrLatestData) : this.getLocalUserDataSyncConfiguration();
			for (const synchroniser of synchronizers) {
				// Return if cancellation is requested
				if (token.isCancellationRequested) {
					return [];
				}

				// Return if resource is not enabled
				if (!this.userDataSyncEnablementService.isResourceEnabled(synchroniser.resource)) {
					return [];
				}

				try {
					const refOrUserData = getRefOrUserData(manifestOrLatestData, this.collection, synchroniser.resource) ?? null;
					await synchroniser.sync(refOrUserData, preview, userDataSyncConfiguration, syncHeaders);
				} catch (e) {
					const userDataSyncError = UserDataSyncError.toUserDataSyncError(e);
					reportUserDataSyncError(userDataSyncError, executionId, this.userDataSyncStoreManagementService, this.telemetryService);
					if (canBailout(e)) {
						throw userDataSyncError;
					}

					// Log and and continue
					this.logService.error(e);
					this.logService.error(`${synchroniser.resource}: ${toErrorMessage(e)}`);
					syncErrors.push([synchroniser.resource, userDataSyncError]);
				}
			}

			return syncErrors;
		} finally {
			this.updateStatus();
		}
	}

	async apply(executionId: string, token: CancellationToken): Promise<void> {
		const syncHeaders = createSyncHeaders(executionId);
		for (const synchroniser of this.enabled) {
			if (token.isCancellationRequested) {
				return;
			}
			try {
				await synchroniser.apply(false, syncHeaders);
			} catch (e) {
				const userDataSyncError = UserDataSyncError.toUserDataSyncError(e);
				reportUserDataSyncError(userDataSyncError, executionId, this.userDataSyncStoreManagementService, this.telemetryService);
				if (canBailout(e)) {
					throw userDataSyncError;
				}

				// Log and and continue
				this.logService.error(e);
				this.logService.error(`${synchroniser.resource}: ${toErrorMessage(e)}`);
			}
		}
	}

	async stop(): Promise<void> {
		for (const synchroniser of this.enabled) {
			try {
				if (synchroniser.status !== SyncStatus.Idle) {
					await synchroniser.stop();
				}
			} catch (e) {
				this.logService.error(e);
			}
		}
	}

	async resetLocal(): Promise<void> {
		for (const synchroniser of this.enabled) {
			try {
				await synchroniser.resetLocal();
			} catch (e) {
				this.logService.error(`${synchroniser.resource}: ${toErrorMessage(e)}`);
				this.logService.error(e);
			}
		}
	}

	private async getUserDataSyncConfiguration(manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null): Promise<IUserDataSyncConfiguration> {
		if (!this.profile.isDefault) {
			return {};
		}
		const local = this.getLocalUserDataSyncConfiguration();
		const settingsSynchronizer = this.enabled.find(synchronizer => synchronizer instanceof SettingsSynchroniser);
		if (settingsSynchronizer) {
			const remote = await settingsSynchronizer.getRemoteUserDataSyncConfiguration(getRefOrUserData(manifestOrLatestData, this.collection, SyncResource.Settings) ?? null);
			return { ...local, ...remote };
		}
		return local;
	}

	private getLocalUserDataSyncConfiguration(): IUserDataSyncConfiguration {
		return this.configurationService.getValue(USER_DATA_SYNC_CONFIGURATION_SCOPE);
	}

	private setStatus(status: SyncStatus): void {
		if (this._status !== status) {
			this._status = status;
			this._onDidChangeStatus.fire(status);
		}
	}

	private updateStatus(): void {
		this.updateConflicts();
		if (this.enabled.some(s => s.status === SyncStatus.HasConflicts)) {
			return this.setStatus(SyncStatus.HasConflicts);
		}
		if (this.enabled.some(s => s.status === SyncStatus.Syncing)) {
			return this.setStatus(SyncStatus.Syncing);
		}
		return this.setStatus(SyncStatus.Idle);
	}

	private updateConflicts(): void {
		const conflicts = this.enabled.filter(s => s.status === SyncStatus.HasConflicts)
			.filter(s => s.conflicts.conflicts.length > 0)
			.map(s => s.conflicts);
		if (!equals(this._conflicts, conflicts, (a, b) => a.syncResource === b.syncResource && equals(a.conflicts, b.conflicts, (a, b) => isEqual(a.previewResource, b.previewResource)))) {
			this._conflicts = conflicts;
			this._onDidChangeConflicts.fire(conflicts);
		}
	}

	private getOrder(syncResource: SyncResource): number {
		switch (syncResource) {
			case SyncResource.Settings: return 0;
			case SyncResource.Keybindings: return 1;
			case SyncResource.Snippets: return 2;
			case SyncResource.Tasks: return 3;
			case SyncResource.Mcp: return 4;
			case SyncResource.GlobalState: return 5;
			case SyncResource.Extensions: return 6;
			case SyncResource.Prompts: return 7;
			case SyncResource.Profiles: return 8;
			case SyncResource.WorkspaceState: return 9;
		}
	}
}

function canBailout(e: unknown): boolean {
	if (e instanceof UserDataSyncError) {
		switch (e.code) {
			case UserDataSyncErrorCode.MethodNotFound:
			case UserDataSyncErrorCode.TooLarge:
			case UserDataSyncErrorCode.TooManyRequests:
			case UserDataSyncErrorCode.TooManyRequestsAndRetryAfter:
			case UserDataSyncErrorCode.LocalTooManyRequests:
			case UserDataSyncErrorCode.LocalTooManyProfiles:
			case UserDataSyncErrorCode.Gone:
			case UserDataSyncErrorCode.UpgradeRequired:
			case UserDataSyncErrorCode.IncompatibleRemoteContent:
			case UserDataSyncErrorCode.IncompatibleLocalContent:
				return true;
		}
	}
	return false;
}

function reportUserDataSyncError(userDataSyncError: UserDataSyncError, executionId: string, userDataSyncStoreManagementService: IUserDataSyncStoreManagementService, telemetryService: ITelemetryService): void {
	telemetryService.publicLog2<SyncErrorEvent, SyncErrorClassification>('sync/error',
		{
			code: userDataSyncError.code,
			serverCode: userDataSyncError instanceof UserDataSyncStoreError ? String(userDataSyncError.serverCode) : undefined,
			url: userDataSyncError instanceof UserDataSyncStoreError ? userDataSyncError.url : undefined,
			resource: userDataSyncError.resource,
			executionId,
			service: userDataSyncStoreManagementService.userDataSyncStore!.url.toString()
		});
}

function getRefOrUserData(manifestOrLatestData: IUserDataManifest | IUserDataSyncLatestData | null, collection: string | undefined, resource: SyncResource): string | IUserData | undefined {
	if (isUserDataManifest(manifestOrLatestData)) {
		if (collection) {
			return manifestOrLatestData?.collections?.[collection]?.latest?.[resource];
		}
		return manifestOrLatestData?.latest?.[resource];
	}
	if (collection) {
		return manifestOrLatestData?.collections?.[collection]?.resources?.[resource];
	}
	return manifestOrLatestData?.resources?.[resource];
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/userDataSyncServiceIpc.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/userDataSyncServiceIpc.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { URI } from '../../../base/common/uri.js';
import { IChannel, IServerChannel } from '../../../base/parts/ipc/common/ipc.js';
import { ILogService } from '../../log/common/log.js';
import { IUserDataProfilesService, reviveProfile } from '../../userDataProfile/common/userDataProfile.js';
import {
	IUserDataManualSyncTask, IUserDataSyncResourceConflicts, IUserDataSyncResourceError, IUserDataSyncResource, ISyncResourceHandle, IUserDataSyncTask, IUserDataSyncService,
	SyncResource, SyncStatus, UserDataSyncError
} from './userDataSync.js';

type ManualSyncTaskEvent<T> = { manualSyncTaskId: string; data: T };

function reviewSyncResource(syncResource: IUserDataSyncResource, userDataProfilesService: IUserDataProfilesService): IUserDataSyncResource {
	return { ...syncResource, profile: reviveProfile(syncResource.profile, userDataProfilesService.profilesHome.scheme) };
}

function reviewSyncResourceHandle(syncResourceHandle: ISyncResourceHandle): ISyncResourceHandle {
	return { created: syncResourceHandle.created, uri: URI.revive(syncResourceHandle.uri) };
}

export class UserDataSyncServiceChannel implements IServerChannel {

	private readonly manualSyncTasks = new Map<string, IUserDataManualSyncTask>();
	private readonly onManualSynchronizeResources = new Emitter<ManualSyncTaskEvent<[SyncResource, URI[]][]>>();

	constructor(
		private readonly service: IUserDataSyncService,
		private readonly userDataProfilesService: IUserDataProfilesService,
		private readonly logService: ILogService
	) { }

	listen(_: unknown, event: string): Event<any> {
		switch (event) {
			// sync
			case 'onDidChangeStatus': return this.service.onDidChangeStatus;
			case 'onDidChangeConflicts': return this.service.onDidChangeConflicts;
			case 'onDidChangeLocal': return this.service.onDidChangeLocal;
			case 'onDidChangeLastSyncTime': return this.service.onDidChangeLastSyncTime;
			case 'onSyncErrors': return this.service.onSyncErrors;
			case 'onDidResetLocal': return this.service.onDidResetLocal;
			case 'onDidResetRemote': return this.service.onDidResetRemote;

			// manual sync
			case 'manualSync/onSynchronizeResources': return this.onManualSynchronizeResources.event;
		}

		throw new Error(`[UserDataSyncServiceChannel] Event not found: ${event}`);
	}

	async call(context: any, command: string, args?: any): Promise<any> {
		try {
			const result = await this._call(context, command, args);
			return result;
		} catch (e) {
			this.logService.error(e);
			throw e;
		}
	}

	private async _call(context: any, command: string, args?: any): Promise<any> {
		switch (command) {

			// sync
			case '_getInitialData': return Promise.resolve([this.service.status, this.service.conflicts, this.service.lastSyncTime]);
			case 'reset': return this.service.reset();
			case 'resetRemote': return this.service.resetRemote();
			case 'resetLocal': return this.service.resetLocal();
			case 'hasPreviouslySynced': return this.service.hasPreviouslySynced();
			case 'hasLocalData': return this.service.hasLocalData();
			case 'resolveContent': return this.service.resolveContent(URI.revive(args[0]));
			case 'accept': return this.service.accept(reviewSyncResource(args[0], this.userDataProfilesService), URI.revive(args[1]), args[2], args[3]);
			case 'replace': return this.service.replace(reviewSyncResourceHandle(args[0]));
			case 'cleanUpRemoteData': return this.service.cleanUpRemoteData();
			case 'getRemoteActivityData': return this.service.saveRemoteActivityData(URI.revive(args[0]));
			case 'extractActivityData': return this.service.extractActivityData(URI.revive(args[0]), URI.revive(args[1]));

			case 'createManualSyncTask': return this.createManualSyncTask();
		}

		// manual sync
		if (command.startsWith('manualSync/')) {
			const manualSyncTaskCommand = command.substring('manualSync/'.length);
			const manualSyncTaskId = args[0];
			const manualSyncTask = this.getManualSyncTask(manualSyncTaskId);
			args = (<Array<any>>args).slice(1);

			switch (manualSyncTaskCommand) {
				case 'merge': return manualSyncTask.merge();
				case 'apply': return manualSyncTask.apply().then(() => this.manualSyncTasks.delete(this.createKey(manualSyncTask.id)));
				case 'stop': return manualSyncTask.stop().finally(() => this.manualSyncTasks.delete(this.createKey(manualSyncTask.id)));
			}
		}

		throw new Error('Invalid call');
	}

	private getManualSyncTask(manualSyncTaskId: string): IUserDataManualSyncTask {
		const manualSyncTask = this.manualSyncTasks.get(this.createKey(manualSyncTaskId));
		if (!manualSyncTask) {
			throw new Error(`Manual sync taks not found: ${manualSyncTaskId}`);
		}
		return manualSyncTask;
	}

	private async createManualSyncTask(): Promise<string> {
		const manualSyncTask = await this.service.createManualSyncTask();
		this.manualSyncTasks.set(this.createKey(manualSyncTask.id), manualSyncTask);
		return manualSyncTask.id;
	}

	private createKey(manualSyncTaskId: string): string { return `manualSyncTask-${manualSyncTaskId}`; }

}

export class UserDataSyncServiceChannelClient extends Disposable implements IUserDataSyncService {

	declare readonly _serviceBrand: undefined;

	private readonly channel: IChannel;

	private _status: SyncStatus = SyncStatus.Uninitialized;
	get status(): SyncStatus { return this._status; }
	private _onDidChangeStatus: Emitter<SyncStatus> = this._register(new Emitter<SyncStatus>());
	readonly onDidChangeStatus: Event<SyncStatus> = this._onDidChangeStatus.event;

	get onDidChangeLocal(): Event<SyncResource> { return this.channel.listen<SyncResource>('onDidChangeLocal'); }

	private _conflicts: IUserDataSyncResourceConflicts[] = [];
	get conflicts(): IUserDataSyncResourceConflicts[] { return this._conflicts; }
	private _onDidChangeConflicts = this._register(new Emitter<IUserDataSyncResourceConflicts[]>());
	readonly onDidChangeConflicts = this._onDidChangeConflicts.event;

	private _lastSyncTime: number | undefined = undefined;
	get lastSyncTime(): number | undefined { return this._lastSyncTime; }
	private _onDidChangeLastSyncTime: Emitter<number> = this._register(new Emitter<number>());
	readonly onDidChangeLastSyncTime: Event<number> = this._onDidChangeLastSyncTime.event;

	private _onSyncErrors = this._register(new Emitter<IUserDataSyncResourceError[]>());
	readonly onSyncErrors = this._onSyncErrors.event;

	get onDidResetLocal(): Event<void> { return this.channel.listen<void>('onDidResetLocal'); }
	get onDidResetRemote(): Event<void> { return this.channel.listen<void>('onDidResetRemote'); }

	constructor(
		userDataSyncChannel: IChannel,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();
		this.channel = {
			call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
				return userDataSyncChannel.call(command, arg, cancellationToken)
					.then(null, error => { throw UserDataSyncError.toUserDataSyncError(error); });
			},
			listen<T>(event: string, arg?: any): Event<T> {
				return userDataSyncChannel.listen(event, arg);
			}
		};
		this.channel.call<[SyncStatus, IUserDataSyncResourceConflicts[], number | undefined]>('_getInitialData').then(([status, conflicts, lastSyncTime]) => {
			this.updateStatus(status);
			this.updateConflicts(conflicts);
			if (lastSyncTime) {
				this.updateLastSyncTime(lastSyncTime);
			}
			this._register(this.channel.listen<SyncStatus>('onDidChangeStatus')(status => this.updateStatus(status)));
			this._register(this.channel.listen<number>('onDidChangeLastSyncTime')(lastSyncTime => this.updateLastSyncTime(lastSyncTime)));
		});
		this._register(this.channel.listen<IUserDataSyncResourceConflicts[]>('onDidChangeConflicts')(conflicts => this.updateConflicts(conflicts)));
		this._register(this.channel.listen<IUserDataSyncResourceError[]>('onSyncErrors')(errors => this._onSyncErrors.fire(errors.map(syncError => ({ ...syncError, error: UserDataSyncError.toUserDataSyncError(syncError.error) })))));
	}

	createSyncTask(): Promise<IUserDataSyncTask> {
		throw new Error('not supported');
	}

	async createManualSyncTask(): Promise<IUserDataManualSyncTask> {
		const id = await this.channel.call<string>('createManualSyncTask');
		const that = this;
		const manualSyncTaskChannelClient = new ManualSyncTaskChannelClient(id, {
			async call<T>(command: string, arg?: any, cancellationToken?: CancellationToken): Promise<T> {
				return that.channel.call<T>(`manualSync/${command}`, [id, ...(Array.isArray(arg) ? arg : [arg])], cancellationToken);
			},
			listen<T>(): Event<T> {
				throw new Error('not supported');
			}
		});
		return manualSyncTaskChannelClient;
	}

	reset(): Promise<void> {
		return this.channel.call('reset');
	}

	resetRemote(): Promise<void> {
		return this.channel.call('resetRemote');
	}

	resetLocal(): Promise<void> {
		return this.channel.call('resetLocal');
	}

	hasPreviouslySynced(): Promise<boolean> {
		return this.channel.call('hasPreviouslySynced');
	}

	hasLocalData(): Promise<boolean> {
		return this.channel.call('hasLocalData');
	}

	accept(syncResource: IUserDataSyncResource, resource: URI, content: string | null, apply: boolean | { force: boolean }): Promise<void> {
		return this.channel.call('accept', [syncResource, resource, content, apply]);
	}

	resolveContent(resource: URI): Promise<string | null> {
		return this.channel.call('resolveContent', [resource]);
	}

	cleanUpRemoteData(): Promise<void> {
		return this.channel.call('cleanUpRemoteData');
	}

	replace(syncResourceHandle: ISyncResourceHandle): Promise<void> {
		return this.channel.call('replace', [syncResourceHandle]);
	}

	saveRemoteActivityData(location: URI): Promise<void> {
		return this.channel.call('getRemoteActivityData', [location]);
	}

	extractActivityData(activityDataResource: URI, location: URI): Promise<void> {
		return this.channel.call('extractActivityData', [activityDataResource, location]);
	}

	private async updateStatus(status: SyncStatus): Promise<void> {
		this._status = status;
		this._onDidChangeStatus.fire(status);
	}

	private async updateConflicts(conflicts: IUserDataSyncResourceConflicts[]): Promise<void> {
		// Revive URIs
		this._conflicts = conflicts.map(syncConflict =>
		({
			syncResource: syncConflict.syncResource,
			profile: reviveProfile(syncConflict.profile, this.userDataProfilesService.profilesHome.scheme),
			conflicts: syncConflict.conflicts.map(r =>
			({
				...r,
				baseResource: URI.revive(r.baseResource),
				localResource: URI.revive(r.localResource),
				remoteResource: URI.revive(r.remoteResource),
				previewResource: URI.revive(r.previewResource),
			}))
		}));
		this._onDidChangeConflicts.fire(this._conflicts);
	}

	private updateLastSyncTime(lastSyncTime: number): void {
		if (this._lastSyncTime !== lastSyncTime) {
			this._lastSyncTime = lastSyncTime;
			this._onDidChangeLastSyncTime.fire(lastSyncTime);
		}
	}
}

class ManualSyncTaskChannelClient extends Disposable implements IUserDataManualSyncTask {

	constructor(
		readonly id: string,
		private readonly channel: IChannel,
	) {
		super();
	}

	async merge(): Promise<void> {
		return this.channel.call('merge');
	}

	async apply(): Promise<void> {
		return this.channel.call('apply');
	}

	stop(): Promise<void> {
		return this.channel.call('stop');
	}

	override dispose(): void {
		this.channel.call('dispose');
		super.dispose();
	}

}
```

--------------------------------------------------------------------------------

````
