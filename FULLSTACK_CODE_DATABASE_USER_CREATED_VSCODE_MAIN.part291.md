---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 291
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 291 of 552)

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

---[FILE: src/vs/platform/userDataSync/common/extensionsSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/extensionsSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Promises } from '../../../base/common/async.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import { toFormattedString } from '../../../base/common/jsonFormatter.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { compare } from '../../../base/common/strings.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { GlobalExtensionEnablementService } from '../../extensionManagement/common/extensionEnablementService.js';
import { IExtensionGalleryService, IExtensionManagementService, IGlobalExtensionEnablementService, ILocalExtension, ExtensionManagementError, ExtensionManagementErrorCode, IGalleryExtension, DISABLED_EXTENSIONS_STORAGE_PATH, EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT, EXTENSION_INSTALL_SOURCE_CONTEXT, InstallExtensionInfo, ExtensionInstallSource, EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT } from '../../extensionManagement/common/extensionManagement.js';
import { areSameExtensions } from '../../extensionManagement/common/extensionManagementUtil.js';
import { ExtensionStorageService, IExtensionStorageService } from '../../extensionManagement/common/extensionStorage.js';
import { ExtensionType, IExtensionIdentifier, isApplicationScopedExtension } from '../../extensions/common/extensions.js';
import { IFileService } from '../../files/common/files.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';
import { ServiceCollection } from '../../instantiation/common/serviceCollection.js';
import { ILogService } from '../../log/common/log.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractInitializer, AbstractSynchroniser, getSyncResourceLogLabel, IAcceptResult, IMergeResult, IResourcePreview } from './abstractSynchronizer.js';
import { IMergeResult as IExtensionMergeResult, merge } from './extensionsMerge.js';
import { IIgnoredExtensionsManagementService } from './ignoredExtensions.js';
import { Change, IRemoteUserData, ISyncData, ISyncExtension, IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource, USER_DATA_SYNC_SCHEME, ILocalSyncExtension } from './userDataSync.js';
import { IUserDataProfileStorageService } from '../../userDataProfile/common/userDataProfileStorageService.js';

type IExtensionResourceMergeResult = IAcceptResult & IExtensionMergeResult;

interface IExtensionResourcePreview extends IResourcePreview {
	readonly localExtensions: ILocalSyncExtension[];
	readonly remoteExtensions: ISyncExtension[] | null;
	readonly skippedExtensions: ISyncExtension[];
	readonly builtinExtensions: IExtensionIdentifier[] | null;
	readonly previewResult: IExtensionResourceMergeResult;
}

interface ILastSyncUserData extends IRemoteUserData {
	skippedExtensions: ISyncExtension[] | undefined;
	builtinExtensions: IExtensionIdentifier[] | undefined;
}

async function parseAndMigrateExtensions(syncData: ISyncData, extensionManagementService: IExtensionManagementService): Promise<ISyncExtension[]> {
	const extensions = JSON.parse(syncData.content);
	if (syncData.version === 1
		|| syncData.version === 2
	) {
		const builtinExtensions = (await extensionManagementService.getInstalled(ExtensionType.System)).filter(e => e.isBuiltin);
		for (const extension of extensions) {
			// #region Migration from v1 (enabled -> disabled)
			if (syncData.version === 1) {
				if (extension.enabled === false) {
					extension.disabled = true;
				}
				delete extension.enabled;
			}
			// #endregion

			// #region Migration from v2 (set installed property on extension)
			if (syncData.version === 2) {
				if (builtinExtensions.every(installed => !areSameExtensions(installed.identifier, extension.identifier))) {
					extension.installed = true;
				}
			}
			// #endregion
		}
	}
	return extensions;
}

export function parseExtensions(syncData: ISyncData): ISyncExtension[] {
	return JSON.parse(syncData.content);
}

export function stringify(extensions: ISyncExtension[], format: boolean): string {
	extensions.sort((e1, e2) => {
		if (!e1.identifier.uuid && e2.identifier.uuid) {
			return -1;
		}
		if (e1.identifier.uuid && !e2.identifier.uuid) {
			return 1;
		}
		return compare(e1.identifier.id, e2.identifier.id);
	});
	return format ? toFormattedString(extensions, {}) : JSON.stringify(extensions);
}

export class ExtensionsSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {

	/*
		Version 3 - Introduce installed property to skip installing built in extensions
		protected readonly version: number = 3;
	*/
	/* Version 4: Change settings from `sync.${setting}` to `settingsSync.{setting}` */
	/* Version 5: Introduce extension state */
	/* Version 6: Added isApplicationScoped property */
	protected readonly version: number = 6;

	private readonly previewResource: URI = this.extUri.joinPath(this.syncPreviewFolder, 'extensions.json');
	private readonly baseResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
	private readonly localResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
	private readonly remoteResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
	private readonly acceptedResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

	private readonly localExtensionsProvider: LocalExtensionsProvider;

	constructor(
		// profileLocation changes for default profile
		profile: IUserDataProfile,
		collection: string | undefined,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IIgnoredExtensionsManagementService private readonly ignoredExtensionsManagementService: IIgnoredExtensionsManagementService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IExtensionStorageService extensionStorageService: IExtensionStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IUserDataProfileStorageService userDataProfileStorageService: IUserDataProfileStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super({ syncResource: SyncResource.Extensions, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
		this.localExtensionsProvider = this.instantiationService.createInstance(LocalExtensionsProvider);
		this._register(
			Event.any<any>(
				Event.filter(this.extensionManagementService.onDidInstallExtensions, (e => e.some(({ local }) => !!local))),
				Event.filter(this.extensionManagementService.onDidUninstallExtension, (e => !e.error)),
				Event.filter(userDataProfileStorageService.onDidChange, e => e.valueChanges.some(({ profile, changes }) => this.syncResource.profile.id === profile.id && changes.some(change => change.key === DISABLED_EXTENSIONS_STORAGE_PATH))),
				extensionStorageService.onDidChangeExtensionStorageToSync)(() => this.triggerLocalChange()));
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: ILastSyncUserData | null): Promise<IExtensionResourcePreview[]> {
		const remoteExtensions = remoteUserData.syncData ? await parseAndMigrateExtensions(remoteUserData.syncData, this.extensionManagementService) : null;
		const skippedExtensions = lastSyncUserData?.skippedExtensions ?? [];
		const builtinExtensions = lastSyncUserData?.builtinExtensions ?? null;
		const lastSyncExtensions = lastSyncUserData?.syncData ? await parseAndMigrateExtensions(lastSyncUserData.syncData, this.extensionManagementService) : null;

		const { localExtensions, ignoredExtensions } = await this.localExtensionsProvider.getLocalExtensions(this.syncResource.profile);

		if (remoteExtensions) {
			this.logService.trace(`${this.syncResourceLogLabel}: Merging remote extensions with local extensions...`);
		} else {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote extensions does not exist. Synchronizing extensions for the first time.`);
		}

		const { local, remote } = merge(localExtensions, remoteExtensions, lastSyncExtensions, skippedExtensions, ignoredExtensions, builtinExtensions);
		const previewResult: IExtensionResourceMergeResult = {
			local, remote,
			content: this.getPreviewContent(localExtensions, local.added, local.updated, local.removed),
			localChange: local.added.length > 0 || local.removed.length > 0 || local.updated.length > 0 ? Change.Modified : Change.None,
			remoteChange: remote !== null ? Change.Modified : Change.None,
		};

		const localContent = this.stringify(localExtensions, false);
		return [{
			skippedExtensions,
			builtinExtensions,
			baseResource: this.baseResource,
			baseContent: lastSyncExtensions ? this.stringify(lastSyncExtensions, false) : localContent,
			localResource: this.localResource,
			localContent,
			localExtensions,
			remoteResource: this.remoteResource,
			remoteExtensions,
			remoteContent: remoteExtensions ? this.stringify(remoteExtensions, false) : null,
			previewResource: this.previewResource,
			previewResult,
			localChange: previewResult.localChange,
			remoteChange: previewResult.remoteChange,
			acceptedResource: this.acceptedResource,
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: ILastSyncUserData): Promise<boolean> {
		const lastSyncExtensions: ISyncExtension[] | null = lastSyncUserData.syncData ? await parseAndMigrateExtensions(lastSyncUserData.syncData, this.extensionManagementService) : null;
		const { localExtensions, ignoredExtensions } = await this.localExtensionsProvider.getLocalExtensions(this.syncResource.profile);
		const { remote } = merge(localExtensions, lastSyncExtensions, lastSyncExtensions, lastSyncUserData.skippedExtensions || [], ignoredExtensions, lastSyncUserData.builtinExtensions || []);
		return remote !== null;
	}

	private getPreviewContent(localExtensions: ISyncExtension[], added: ISyncExtension[], updated: ISyncExtension[], removed: IExtensionIdentifier[]): string {
		const preview: ISyncExtension[] = [...added, ...updated];

		const idsOrUUIDs: Set<string> = new Set<string>();
		const addIdentifier = (identifier: IExtensionIdentifier) => {
			idsOrUUIDs.add(identifier.id.toLowerCase());
			if (identifier.uuid) {
				idsOrUUIDs.add(identifier.uuid);
			}
		};
		preview.forEach(({ identifier }) => addIdentifier(identifier));
		removed.forEach(addIdentifier);

		for (const localExtension of localExtensions) {
			if (idsOrUUIDs.has(localExtension.identifier.id.toLowerCase()) || (localExtension.identifier.uuid && idsOrUUIDs.has(localExtension.identifier.uuid))) {
				// skip
				continue;
			}
			preview.push(localExtension);
		}

		return this.stringify(preview, false);
	}

	protected async getMergeResult(resourcePreview: IExtensionResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return { ...resourcePreview.previewResult, hasConflicts: false };
	}

	protected async getAcceptResult(resourcePreview: IExtensionResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IExtensionResourceMergeResult> {

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

	private async acceptLocal(resourcePreview: IExtensionResourcePreview): Promise<IExtensionResourceMergeResult> {
		const installedExtensions = await this.extensionManagementService.getInstalled(undefined, this.syncResource.profile.extensionsResource);
		const ignoredExtensions = this.ignoredExtensionsManagementService.getIgnoredExtensions(installedExtensions);
		const remoteExtensions = resourcePreview.remoteContent ? JSON.parse(resourcePreview.remoteContent) : null;
		const mergeResult = merge(resourcePreview.localExtensions, remoteExtensions, remoteExtensions, resourcePreview.skippedExtensions, ignoredExtensions, resourcePreview.builtinExtensions);
		const { local, remote } = mergeResult;
		return {
			content: resourcePreview.localContent,
			local,
			remote,
			localChange: local.added.length > 0 || local.removed.length > 0 || local.updated.length > 0 ? Change.Modified : Change.None,
			remoteChange: remote !== null ? Change.Modified : Change.None,
		};
	}

	private async acceptRemote(resourcePreview: IExtensionResourcePreview): Promise<IExtensionResourceMergeResult> {
		const installedExtensions = await this.extensionManagementService.getInstalled(undefined, this.syncResource.profile.extensionsResource);
		const ignoredExtensions = this.ignoredExtensionsManagementService.getIgnoredExtensions(installedExtensions);
		const remoteExtensions = resourcePreview.remoteContent ? JSON.parse(resourcePreview.remoteContent) : null;
		if (remoteExtensions !== null) {
			const mergeResult = merge(resourcePreview.localExtensions, remoteExtensions, resourcePreview.localExtensions, [], ignoredExtensions, resourcePreview.builtinExtensions);
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

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IExtensionResourcePreview, IExtensionResourceMergeResult][], force: boolean): Promise<void> {
		let { skippedExtensions, builtinExtensions, localExtensions } = resourcePreviews[0][0];
		const { local, remote, localChange, remoteChange } = resourcePreviews[0][1];

		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing extensions.`);
		}

		if (localChange !== Change.None) {
			await this.backupLocal(JSON.stringify(localExtensions));
			skippedExtensions = await this.localExtensionsProvider.updateLocalExtensions(local.added, local.removed, local.updated, skippedExtensions, this.syncResource.profile);
		}

		if (remote) {
			// update remote
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote extensions...`);
			const content = JSON.stringify(remote.all);
			remoteUserData = await this.updateRemoteUserData(content, force ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote extensions.${remote.added.length ? ` Added: ${JSON.stringify(remote.added.map(e => e.identifier.id))}.` : ''}${remote.updated.length ? ` Updated: ${JSON.stringify(remote.updated.map(e => e.identifier.id))}.` : ''}${remote.removed.length ? ` Removed: ${JSON.stringify(remote.removed.map(e => e.identifier.id))}.` : ''}`);
		}

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			// update last sync
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized extensions...`);
			builtinExtensions = this.computeBuiltinExtensions(localExtensions, builtinExtensions);
			await this.updateLastSyncUserData(remoteUserData, { skippedExtensions, builtinExtensions });
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized extensions.${skippedExtensions.length ? ` Skipped: ${JSON.stringify(skippedExtensions.map(e => e.identifier.id))}.` : ''}`);
		}
	}

	private computeBuiltinExtensions(localExtensions: ILocalSyncExtension[], previousBuiltinExtensions: IExtensionIdentifier[] | null): IExtensionIdentifier[] {
		const localExtensionsSet = new Set<string>();
		const builtinExtensions: IExtensionIdentifier[] = [];
		for (const localExtension of localExtensions) {
			localExtensionsSet.add(localExtension.identifier.id.toLowerCase());
			if (!localExtension.installed) {
				builtinExtensions.push(localExtension.identifier);
			}
		}
		if (previousBuiltinExtensions) {
			for (const builtinExtension of previousBuiltinExtensions) {
				// Add previous builtin extension if it does not exist in local extensions
				if (!localExtensionsSet.has(builtinExtension.id.toLowerCase())) {
					builtinExtensions.push(builtinExtension);
				}
			}
		}
		return builtinExtensions;
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
		) {
			const content = await this.resolvePreviewContent(uri);
			return content ? this.stringify(JSON.parse(content), true) : content;
		}
		return null;
	}

	private stringify(extensions: ISyncExtension[], format: boolean): string {
		return stringify(extensions, format);
	}

	async hasLocalData(): Promise<boolean> {
		try {
			const { localExtensions } = await this.localExtensionsProvider.getLocalExtensions(this.syncResource.profile);
			if (localExtensions.some(e => e.installed || e.disabled)) {
				return true;
			}
		} catch (error) {
			/* ignore error */
		}
		return false;
	}

}

export class LocalExtensionsProvider {

	constructor(
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IUserDataProfileStorageService private readonly userDataProfileStorageService: IUserDataProfileStorageService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IIgnoredExtensionsManagementService private readonly ignoredExtensionsManagementService: IIgnoredExtensionsManagementService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService,
	) { }

	async getLocalExtensions(profile: IUserDataProfile): Promise<{ localExtensions: ILocalSyncExtension[]; ignoredExtensions: string[] }> {
		const installedExtensions = await this.extensionManagementService.getInstalled(undefined, profile.extensionsResource);
		const ignoredExtensions = this.ignoredExtensionsManagementService.getIgnoredExtensions(installedExtensions);
		const localExtensions = await this.withProfileScopedServices(profile, async (extensionEnablementService, extensionStorageService) => {
			const disabledExtensions = extensionEnablementService.getDisabledExtensions();
			return installedExtensions
				.map(extension => {
					const { identifier, isBuiltin, manifest, preRelease, pinned, isApplicationScoped } = extension;
					const syncExntesion: ILocalSyncExtension = { identifier, preRelease, version: manifest.version, pinned: !!pinned };
					if (isApplicationScoped && !isApplicationScopedExtension(manifest)) {
						syncExntesion.isApplicationScoped = isApplicationScoped;
					}
					if (disabledExtensions.some(disabledExtension => areSameExtensions(disabledExtension, identifier))) {
						syncExntesion.disabled = true;
					}
					if (!isBuiltin) {
						syncExntesion.installed = true;
					}
					try {
						const keys = extensionStorageService.getKeysForSync({ id: identifier.id, version: manifest.version });
						if (keys) {
							const extensionStorageState = extensionStorageService.getExtensionState(extension, true) || {};
							syncExntesion.state = Object.keys(extensionStorageState).reduce((state: IStringDictionary<any>, key) => {
								if (keys.includes(key)) {
									state[key] = extensionStorageState[key];
								}
								return state;
							}, {});
						}
					} catch (error) {
						this.logService.info(`${getSyncResourceLogLabel(SyncResource.Extensions, profile)}: Error while parsing extension state`, getErrorMessage(error));
					}
					return syncExntesion;
				});
		});
		return { localExtensions, ignoredExtensions };
	}

	async updateLocalExtensions(added: ISyncExtension[], removed: IExtensionIdentifier[], updated: ISyncExtension[], skippedExtensions: ISyncExtension[], profile: IUserDataProfile): Promise<ISyncExtension[]> {
		const syncResourceLogLabel = getSyncResourceLogLabel(SyncResource.Extensions, profile);
		const extensionsToInstall: InstallExtensionInfo[] = [];
		const syncExtensionsToInstall = new Map<string, ISyncExtension>();
		const removeFromSkipped: IExtensionIdentifier[] = [];
		const addToSkipped: ISyncExtension[] = [];
		const installedExtensions = await this.extensionManagementService.getInstalled(undefined, profile.extensionsResource);

		// 1. Sync extensions state first so that the storage is flushed and updated in all opened windows
		if (added.length || updated.length) {
			await this.withProfileScopedServices(profile, async (extensionEnablementService, extensionStorageService) => {
				await Promises.settled([...added, ...updated].map(async e => {
					const installedExtension = installedExtensions.find(installed => areSameExtensions(installed.identifier, e.identifier));

					// Builtin Extension Sync: Enablement & State
					if (installedExtension && installedExtension.isBuiltin) {
						if (e.state && installedExtension.manifest.version === e.version) {
							this.updateExtensionState(e.state, installedExtension, installedExtension.manifest.version, extensionStorageService);
						}
						const isDisabled = extensionEnablementService.getDisabledExtensions().some(disabledExtension => areSameExtensions(disabledExtension, e.identifier));
						if (isDisabled !== !!e.disabled) {
							if (e.disabled) {
								this.logService.trace(`${syncResourceLogLabel}: Disabling extension...`, e.identifier.id);
								await extensionEnablementService.disableExtension(e.identifier);
								this.logService.info(`${syncResourceLogLabel}: Disabled extension`, e.identifier.id);
							} else {
								this.logService.trace(`${syncResourceLogLabel}: Enabling extension...`, e.identifier.id);
								await extensionEnablementService.enableExtension(e.identifier);
								this.logService.info(`${syncResourceLogLabel}: Enabled extension`, e.identifier.id);
							}
						}
						removeFromSkipped.push(e.identifier);
						return;
					}

					// User Extension Sync: Install/Update, Enablement & State
					const version = e.pinned ? e.version : undefined;
					const extension = (await this.extensionGalleryService.getExtensions([{ ...e.identifier, version, preRelease: version ? undefined : e.preRelease }], CancellationToken.None))[0];

					/* Update extension state only if
					 *	extension is installed and version is same as synced version or
					 *	extension is not installed and installable
					 */
					if (e.state &&
						(installedExtension ? installedExtension.manifest.version === e.version /* Installed and remote has same version */
							: !!extension /* Installable */)
					) {
						this.updateExtensionState(e.state, installedExtension || extension, installedExtension?.manifest.version, extensionStorageService);
					}

					if (extension) {
						try {
							const isDisabled = extensionEnablementService.getDisabledExtensions().some(disabledExtension => areSameExtensions(disabledExtension, e.identifier));
							if (isDisabled !== !!e.disabled) {
								if (e.disabled) {
									this.logService.trace(`${syncResourceLogLabel}: Disabling extension...`, e.identifier.id, extension.version);
									await extensionEnablementService.disableExtension(extension.identifier);
									this.logService.info(`${syncResourceLogLabel}: Disabled extension`, e.identifier.id, extension.version);
								} else {
									this.logService.trace(`${syncResourceLogLabel}: Enabling extension...`, e.identifier.id, extension.version);
									await extensionEnablementService.enableExtension(extension.identifier);
									this.logService.info(`${syncResourceLogLabel}: Enabled extension`, e.identifier.id, extension.version);
								}
							}

							if (!installedExtension // Install if the extension does not exist
								|| installedExtension.preRelease !== e.preRelease // Install if the extension pre-release preference has changed
								|| installedExtension.pinned !== e.pinned  // Install if the extension pinned preference has changed
								|| (version && installedExtension.manifest.version !== version)  // Install if the extension version has changed
							) {
								if (await this.extensionManagementService.canInstall(extension) === true) {
									extensionsToInstall.push({
										extension, options: {
											isMachineScoped: false /* set isMachineScoped value to prevent install and sync dialog in web */,
											donotIncludePackAndDependencies: true,
											installGivenVersion: e.pinned && !!e.version,
											pinned: e.pinned,
											installPreReleaseVersion: e.preRelease,
											preRelease: e.preRelease,
											profileLocation: profile.extensionsResource,
											isApplicationScoped: e.isApplicationScoped,
											context: { [EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT]: true, [EXTENSION_INSTALL_SOURCE_CONTEXT]: ExtensionInstallSource.SETTINGS_SYNC, [EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT]: true }
										}
									});
									syncExtensionsToInstall.set(extension.identifier.id.toLowerCase(), e);
								} else {
									this.logService.info(`${syncResourceLogLabel}: Skipped synchronizing extension because it cannot be installed.`, extension.displayName || extension.identifier.id);
									addToSkipped.push(e);
								}
							}
						} catch (error) {
							addToSkipped.push(e);
							this.logService.error(error);
							this.logService.info(`${syncResourceLogLabel}: Skipped synchronizing extension`, extension.displayName || extension.identifier.id);
						}
					} else {
						addToSkipped.push(e);
						this.logService.info(`${syncResourceLogLabel}: Skipped synchronizing extension because the extension is not found.`, e.identifier.id);
					}
				}));
			});
		}

		// 2. Next uninstall the removed extensions
		if (removed.length) {
			const extensionsToRemove = installedExtensions.filter(({ identifier, isBuiltin }) => !isBuiltin && removed.some(r => areSameExtensions(identifier, r)));
			await Promises.settled(extensionsToRemove.map(async extensionToRemove => {
				this.logService.trace(`${syncResourceLogLabel}: Uninstalling local extension...`, extensionToRemove.identifier.id);
				await this.extensionManagementService.uninstall(extensionToRemove, { donotIncludePack: true, donotCheckDependents: true, profileLocation: profile.extensionsResource });
				this.logService.info(`${syncResourceLogLabel}: Uninstalled local extension.`, extensionToRemove.identifier.id);
				removeFromSkipped.push(extensionToRemove.identifier);
			}));
		}

		// 3. Install extensions at the end
		const results = await this.extensionManagementService.installGalleryExtensions(extensionsToInstall);
		for (const { identifier, local, error, source } of results) {
			const gallery = source as IGalleryExtension;
			if (local) {
				this.logService.info(`${syncResourceLogLabel}: Installed extension.`, identifier.id, gallery.version);
				removeFromSkipped.push(identifier);
			} else {
				const e = syncExtensionsToInstall.get(identifier.id.toLowerCase());
				if (e) {
					addToSkipped.push(e);
					this.logService.info(`${syncResourceLogLabel}: Skipped synchronizing extension`, gallery.displayName || gallery.identifier.id);
				}
				if (error instanceof ExtensionManagementError && [ExtensionManagementErrorCode.Incompatible, ExtensionManagementErrorCode.IncompatibleApi, ExtensionManagementErrorCode.IncompatibleTargetPlatform].includes(error.code)) {
					this.logService.info(`${syncResourceLogLabel}: Skipped synchronizing extension because the compatible extension is not found.`, gallery.displayName || gallery.identifier.id);
				} else if (error) {
					this.logService.error(error);
				}
			}
		}

		const newSkippedExtensions: ISyncExtension[] = [];
		for (const skippedExtension of skippedExtensions) {
			if (!removeFromSkipped.some(e => areSameExtensions(e, skippedExtension.identifier))) {
				newSkippedExtensions.push(skippedExtension);
			}
		}
		for (const skippedExtension of addToSkipped) {
			if (!newSkippedExtensions.some(e => areSameExtensions(e.identifier, skippedExtension.identifier))) {
				newSkippedExtensions.push(skippedExtension);
			}
		}
		return newSkippedExtensions;
	}

	private updateExtensionState(state: IStringDictionary<any>, extension: ILocalExtension | IGalleryExtension, version: string | undefined, extensionStorageService: IExtensionStorageService): void {
		const extensionState = extensionStorageService.getExtensionState(extension, true) || {};
		const keys = version ? extensionStorageService.getKeysForSync({ id: extension.identifier.id, version }) : undefined;
		if (keys) {
			keys.forEach(key => { extensionState[key] = state[key]; });
		} else {
			Object.keys(state).forEach(key => extensionState[key] = state[key]);
		}
		extensionStorageService.setExtensionState(extension, extensionState, true);
	}

	private async withProfileScopedServices<T>(profile: IUserDataProfile, fn: (extensionEnablementService: IGlobalExtensionEnablementService, extensionStorageService: IExtensionStorageService) => Promise<T>): Promise<T> {
		return this.userDataProfileStorageService.withProfileScopedStorageService(profile,
			async storageService => {
				const disposables = new DisposableStore();
				const instantiationService = disposables.add(this.instantiationService.createChild(new ServiceCollection([IStorageService, storageService])));
				const extensionEnablementService = disposables.add(instantiationService.createInstance(GlobalExtensionEnablementService));
				const extensionStorageService = disposables.add(instantiationService.createInstance(ExtensionStorageService));
				try {
					return await fn(extensionEnablementService, extensionStorageService);
				} finally {
					disposables.dispose();
				}
			});
	}

}

export interface IExtensionsInitializerPreviewResult {
	readonly installedExtensions: ILocalExtension[];
	readonly disabledExtensions: IExtensionIdentifier[];
	readonly newExtensions: (IExtensionIdentifier & { preRelease: boolean })[];
	readonly remoteExtensions: ISyncExtension[];
}

export abstract class AbstractExtensionsInitializer extends AbstractInitializer {

	constructor(
		@IExtensionManagementService protected readonly extensionManagementService: IExtensionManagementService,
		@IIgnoredExtensionsManagementService private readonly ignoredExtensionsManagementService: IIgnoredExtensionsManagementService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ILogService logService: ILogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.Extensions, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async parseExtensions(remoteUserData: IRemoteUserData): Promise<ISyncExtension[] | null> {
		return remoteUserData.syncData ? await parseAndMigrateExtensions(remoteUserData.syncData, this.extensionManagementService) : null;
	}

	protected generatePreview(remoteExtensions: ISyncExtension[], localExtensions: ILocalExtension[]): IExtensionsInitializerPreviewResult {
		const installedExtensions: ILocalExtension[] = [];
		const newExtensions: (IExtensionIdentifier & { preRelease: boolean })[] = [];
		const disabledExtensions: IExtensionIdentifier[] = [];
		for (const extension of remoteExtensions) {
			if (this.ignoredExtensionsManagementService.hasToNeverSyncExtension(extension.identifier.id)) {
				// Skip extension ignored to sync
				continue;
			}

			const installedExtension = localExtensions.find(i => areSameExtensions(i.identifier, extension.identifier));
			if (installedExtension) {
				installedExtensions.push(installedExtension);
				if (extension.disabled) {
					disabledExtensions.push(extension.identifier);
				}
			} else if (extension.installed) {
				newExtensions.push({ ...extension.identifier, preRelease: !!extension.preRelease });
				if (extension.disabled) {
					disabledExtensions.push(extension.identifier);
				}
			}
		}
		return { installedExtensions, newExtensions, disabledExtensions, remoteExtensions };
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/globalStateMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/globalStateMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';
import * as objects from '../../../base/common/objects.js';
import { ILogService } from '../../log/common/log.js';
import { IStorageValue, SYNC_SERVICE_URL_TYPE } from './userDataSync.js';

export interface IMergeResult {
	local: { added: IStringDictionary<IStorageValue>; removed: string[]; updated: IStringDictionary<IStorageValue> };
	remote: { added: string[]; removed: string[]; updated: string[]; all: IStringDictionary<IStorageValue> | null };
}

export function merge(localStorage: IStringDictionary<IStorageValue>, remoteStorage: IStringDictionary<IStorageValue> | null, baseStorage: IStringDictionary<IStorageValue> | null, storageKeys: { machine: ReadonlyArray<string>; unregistered: ReadonlyArray<string> }, logService: ILogService): IMergeResult {
	if (!remoteStorage) {
		return { remote: { added: Object.keys(localStorage), removed: [], updated: [], all: Object.keys(localStorage).length > 0 ? localStorage : null }, local: { added: {}, removed: [], updated: {} } };
	}

	const localToRemote = compare(localStorage, remoteStorage);
	if (localToRemote.added.size === 0 && localToRemote.removed.size === 0 && localToRemote.updated.size === 0) {
		// No changes found between local and remote.
		return { remote: { added: [], removed: [], updated: [], all: null }, local: { added: {}, removed: [], updated: {} } };
	}

	const baseToRemote = baseStorage ? compare(baseStorage, remoteStorage) : { added: Object.keys(remoteStorage).reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	const baseToLocal = baseStorage ? compare(baseStorage, localStorage) : { added: Object.keys(localStorage).reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };

	const local: { added: IStringDictionary<IStorageValue>; removed: string[]; updated: IStringDictionary<IStorageValue> } = { added: {}, removed: [], updated: {} };
	const remote: IStringDictionary<IStorageValue> = objects.deepClone(remoteStorage);

	const isFirstTimeSync = !baseStorage;

	// Added in local
	for (const key of baseToLocal.added.values()) {
		// If syncing for first time remote value gets precedence always,
		// except for sync service type key - local value takes precedence for this key
		if (key !== SYNC_SERVICE_URL_TYPE && isFirstTimeSync && baseToRemote.added.has(key)) {
			continue;
		}

		remote[key] = localStorage[key];
	}

	// Updated in local
	for (const key of baseToLocal.updated.values()) {
		remote[key] = localStorage[key];
	}

	// Removed in local
	for (const key of baseToLocal.removed.values()) {
		// Do not remove from remote if key is not registered.
		if (storageKeys.unregistered.includes(key)) {
			continue;
		}
		delete remote[key];
	}

	// Added in remote
	for (const key of baseToRemote.added.values()) {
		const remoteValue = remoteStorage[key];
		if (storageKeys.machine.includes(key)) {
			logService.info(`GlobalState: Skipped adding ${key} in local storage because it is declared as machine scoped.`);
			continue;
		}
		// Skip if the value is also added in local from the time it is last synced
		if (baseStorage && baseToLocal.added.has(key)) {
			continue;
		}
		const localValue = localStorage[key];
		if (localValue && localValue.value === remoteValue.value) {
			continue;
		}

		// Local sync service type value takes precedence if syncing for first time
		if (key === SYNC_SERVICE_URL_TYPE && isFirstTimeSync && baseToLocal.added.has(key)) {
			continue;
		}

		if (localValue) {
			local.updated[key] = remoteValue;
		} else {
			local.added[key] = remoteValue;
		}
	}

	// Updated in Remote
	for (const key of baseToRemote.updated.values()) {
		const remoteValue = remoteStorage[key];
		if (storageKeys.machine.includes(key)) {
			logService.info(`GlobalState: Skipped updating ${key} in local storage because it is declared as machine scoped.`);
			continue;
		}
		// Skip if the value is also updated or removed in local
		if (baseToLocal.updated.has(key) || baseToLocal.removed.has(key)) {
			continue;
		}
		const localValue = localStorage[key];
		if (localValue && localValue.value === remoteValue.value) {
			continue;
		}
		local.updated[key] = remoteValue;
	}

	// Removed in remote
	for (const key of baseToRemote.removed.values()) {
		if (storageKeys.machine.includes(key)) {
			logService.trace(`GlobalState: Skipped removing ${key} in local storage because it is declared as machine scoped.`);
			continue;
		}
		// Skip if the value is also updated or removed in local
		if (baseToLocal.updated.has(key) || baseToLocal.removed.has(key)) {
			continue;
		}
		local.removed.push(key);
	}

	const result = compare(remoteStorage, remote);
	return { local, remote: { added: [...result.added], updated: [...result.updated], removed: [...result.removed], all: result.added.size === 0 && result.removed.size === 0 && result.updated.size === 0 ? null : remote } };
}

function compare(from: IStringDictionary<any>, to: IStringDictionary<any>): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = Object.keys(from);
	const toKeys = Object.keys(to);
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const value1 = from[key];
		const value2 = to[key];
		if (!objects.equals(value1, value2)) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/globalStateSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/globalStateSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { getErrorMessage } from '../../../base/common/errors.js';
import { Event } from '../../../base/common/event.js';
import { parse } from '../../../base/common/json.js';
import { toFormattedString } from '../../../base/common/jsonFormatter.js';
import { isWeb } from '../../../base/common/platform.js';
import { URI } from '../../../base/common/uri.js';
import { generateUuid } from '../../../base/common/uuid.js';
import { IHeaders } from '../../../base/parts/request/common/request.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { getServiceMachineId } from '../../externalServices/common/serviceMachineId.js';
import { IStorageEntry, IStorageService, StorageScope, StorageTarget } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { AbstractInitializer, AbstractSynchroniser, getSyncResourceLogLabel, IAcceptResult, IMergeResult, IResourcePreview, isSyncData } from './abstractSynchronizer.js';
import { edit } from './content.js';
import { merge } from './globalStateMerge.js';
import { ALL_SYNC_RESOURCES, Change, createSyncHeaders, getEnablementKey, IGlobalState, IRemoteUserData, IStorageValue, ISyncData, IUserData, IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource, SYNC_SERVICE_URL_TYPE, UserDataSyncError, UserDataSyncErrorCode, UserDataSyncStoreType, USER_DATA_SYNC_SCHEME } from './userDataSync.js';
import { UserDataSyncStoreClient } from './userDataSyncStoreService.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfileStorageService } from '../../userDataProfile/common/userDataProfileStorageService.js';
import { IInstantiationService } from '../../instantiation/common/instantiation.js';

const argvStoragePrefx = 'globalState.argv.';
const argvProperties: string[] = ['locale'];

type StorageKeys = { machine: string[]; user: string[]; unregistered: string[] };

interface IGlobalStateResourceMergeResult extends IAcceptResult {
	readonly local: { added: IStringDictionary<IStorageValue>; removed: string[]; updated: IStringDictionary<IStorageValue> };
	readonly remote: { added: string[]; removed: string[]; updated: string[]; all: IStringDictionary<IStorageValue> | null };
}

interface IGlobalStateResourcePreview extends IResourcePreview {
	readonly localUserData: IGlobalState;
	readonly previewResult: IGlobalStateResourceMergeResult;
	readonly storageKeys: StorageKeys;
}

export function stringify(globalState: IGlobalState, format: boolean): string {
	const storageKeys = globalState.storage ? Object.keys(globalState.storage).sort() : [];
	const storage: IStringDictionary<IStorageValue> = {};
	storageKeys.forEach(key => storage[key] = globalState.storage[key]);
	globalState.storage = storage;
	return format ? toFormattedString(globalState, {}) : JSON.stringify(globalState);
}

const GLOBAL_STATE_DATA_VERSION = 1;

/**
 * Synchronises global state that includes
 * 	- Global storage with user scope
 * 	- Locale from argv properties
 *
 * Global storage is synced without checking version just like other resources (settings, keybindings).
 * If there is a change in format of the value of a storage key which requires migration then
 * 		Owner of that key should remove that key from user scope and replace that with new user scoped key.
 */
export class GlobalStateSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {

	protected readonly version: number = GLOBAL_STATE_DATA_VERSION;
	private readonly previewResource: URI = this.extUri.joinPath(this.syncPreviewFolder, 'globalState.json');
	private readonly baseResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
	private readonly localResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
	private readonly remoteResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
	private readonly acceptedResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

	private readonly localGlobalStateProvider: LocalGlobalStateProvider;

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IUserDataProfileStorageService private readonly userDataProfileStorageService: IUserDataProfileStorageService,
		@IFileService fileService: IFileService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super({ syncResource: SyncResource.GlobalState, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
		this.localGlobalStateProvider = instantiationService.createInstance(LocalGlobalStateProvider);
		this._register(fileService.watch(this.extUri.dirname(this.environmentService.argvResource)));
		this._register(
			Event.any(
				/* Locale change */
				Event.filter(fileService.onDidFilesChange, e => e.contains(this.environmentService.argvResource)),
				Event.filter(userDataProfileStorageService.onDidChange, e => {
					/* StorageTarget has changed in profile storage */
					if (e.targetChanges.some(profile => this.syncResource.profile.id === profile.id)) {
						return true;
					}
					/* User storage data has changed in profile storage */
					if (e.valueChanges.some(({ profile, changes }) => this.syncResource.profile.id === profile.id && changes.some(change => change.target === StorageTarget.USER))) {
						return true;
					}
					return false;
				}),
			)((() => this.triggerLocalChange()))
		);
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean): Promise<IGlobalStateResourcePreview[]> {
		const remoteGlobalState: IGlobalState = remoteUserData.syncData ? JSON.parse(remoteUserData.syncData.content) : null;

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSyncGlobalState: IGlobalState | null = lastSyncUserData && lastSyncUserData.syncData ? JSON.parse(lastSyncUserData.syncData.content) : null;

		const localGlobalState = await this.localGlobalStateProvider.getLocalGlobalState(this.syncResource.profile);

		if (remoteGlobalState) {
			this.logService.trace(`${this.syncResourceLogLabel}: Merging remote ui state with local ui state...`);
		} else {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote ui state does not exist. Synchronizing ui state for the first time.`);
		}

		const storageKeys = await this.getStorageKeys(lastSyncGlobalState);
		const { local, remote } = merge(localGlobalState.storage, remoteGlobalState ? remoteGlobalState.storage : null, lastSyncGlobalState ? lastSyncGlobalState.storage : null, storageKeys, this.logService);
		const previewResult: IGlobalStateResourceMergeResult = {
			content: null,
			local,
			remote,
			localChange: Object.keys(local.added).length > 0 || Object.keys(local.updated).length > 0 || local.removed.length > 0 ? Change.Modified : Change.None,
			remoteChange: remote.all !== null ? Change.Modified : Change.None,
		};

		const localContent = stringify(localGlobalState, false);
		return [{
			baseResource: this.baseResource,
			baseContent: lastSyncGlobalState ? stringify(lastSyncGlobalState, false) : localContent,
			localResource: this.localResource,
			localContent,
			localUserData: localGlobalState,
			remoteResource: this.remoteResource,
			remoteContent: remoteGlobalState ? stringify(remoteGlobalState, false) : null,
			previewResource: this.previewResource,
			previewResult,
			localChange: previewResult.localChange,
			remoteChange: previewResult.remoteChange,
			acceptedResource: this.acceptedResource,
			storageKeys
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSyncGlobalState: IGlobalState | null = lastSyncUserData.syncData ? JSON.parse(lastSyncUserData.syncData.content) : null;
		if (lastSyncGlobalState === null) {
			return true;
		}
		const localGlobalState = await this.localGlobalStateProvider.getLocalGlobalState(this.syncResource.profile);
		const storageKeys = await this.getStorageKeys(lastSyncGlobalState);
		const { remote } = merge(localGlobalState.storage, lastSyncGlobalState.storage, lastSyncGlobalState.storage, storageKeys, this.logService);
		return remote.all !== null;
	}

	protected async getMergeResult(resourcePreview: IGlobalStateResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return { ...resourcePreview.previewResult, hasConflicts: false };
	}

	protected async getAcceptResult(resourcePreview: IGlobalStateResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IGlobalStateResourceMergeResult> {

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

	private async acceptLocal(resourcePreview: IGlobalStateResourcePreview): Promise<IGlobalStateResourceMergeResult> {
		if (resourcePreview.remoteContent !== null) {
			const remoteGlobalState: IGlobalState = JSON.parse(resourcePreview.remoteContent);
			const { local, remote } = merge(resourcePreview.localUserData.storage, remoteGlobalState.storage, remoteGlobalState.storage, resourcePreview.storageKeys, this.logService);
			return {
				content: resourcePreview.remoteContent,
				local,
				remote,
				localChange: Change.None,
				remoteChange: remote.all !== null ? Change.Modified : Change.None,
			};
		} else {
			return {
				content: resourcePreview.localContent,
				local: { added: {}, removed: [], updated: {} },
				remote: { added: Object.keys(resourcePreview.localUserData.storage), removed: [], updated: [], all: resourcePreview.localUserData.storage },
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
		}
	}

	private async acceptRemote(resourcePreview: IGlobalStateResourcePreview): Promise<IGlobalStateResourceMergeResult> {
		if (resourcePreview.remoteContent !== null) {
			const remoteGlobalState: IGlobalState = JSON.parse(resourcePreview.remoteContent);
			const { local, remote } = merge(resourcePreview.localUserData.storage, remoteGlobalState.storage, resourcePreview.localUserData.storage, resourcePreview.storageKeys, this.logService);
			return {
				content: resourcePreview.remoteContent,
				local,
				remote,
				localChange: Object.keys(local.added).length > 0 || Object.keys(local.updated).length > 0 || local.removed.length > 0 ? Change.Modified : Change.None,
				remoteChange: Change.None,
			};
		} else {
			return {
				content: resourcePreview.remoteContent,
				local: { added: {}, removed: [], updated: {} },
				remote: { added: [], removed: [], updated: [], all: null },
				localChange: Change.None,
				remoteChange: Change.None,
			};
		}
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IGlobalStateResourcePreview, IGlobalStateResourceMergeResult][], force: boolean): Promise<void> {
		const { localUserData } = resourcePreviews[0][0];
		const { local, remote, localChange, remoteChange } = resourcePreviews[0][1];

		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing ui state.`);
		}

		if (localChange !== Change.None) {
			// update local
			this.logService.trace(`${this.syncResourceLogLabel}: Updating local ui state...`);
			await this.backupLocal(JSON.stringify(localUserData));
			await this.localGlobalStateProvider.writeLocalGlobalState(local, this.syncResource.profile);
			this.logService.info(`${this.syncResourceLogLabel}: Updated local ui state`);
		}

		if (remoteChange !== Change.None) {
			// update remote
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote ui state...`);
			const content = JSON.stringify({ storage: remote.all });
			remoteUserData = await this.updateRemoteUserData(content, force ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote ui state.${remote.added.length ? ` Added: ${remote.added}.` : ''}${remote.updated.length ? ` Updated: ${remote.updated}.` : ''}${remote.removed.length ? ` Removed: ${remote.removed}.` : ''}`);
		}

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			// update last sync
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized ui state...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized ui state`);
		}
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
		) {
			const content = await this.resolvePreviewContent(uri);
			return content ? stringify(JSON.parse(content), true) : content;
		}
		return null;
	}

	async hasLocalData(): Promise<boolean> {
		try {
			const { storage } = await this.localGlobalStateProvider.getLocalGlobalState(this.syncResource.profile);
			if (Object.keys(storage).length > 1 || storage[`${argvStoragePrefx}.locale`]?.value !== 'en') {
				return true;
			}
		} catch (error) {
			/* ignore error */
		}
		return false;
	}

	private async getStorageKeys(lastSyncGlobalState: IGlobalState | null): Promise<StorageKeys> {
		const storageData = await this.userDataProfileStorageService.readStorageData(this.syncResource.profile);
		const user: string[] = [], machine: string[] = [];
		for (const [key, value] of storageData) {
			if (value.target === StorageTarget.USER) {
				user.push(key);
			} else if (value.target === StorageTarget.MACHINE) {
				machine.push(key);
			}
		}
		const registered = [...user, ...machine];
		const unregistered = lastSyncGlobalState?.storage ? Object.keys(lastSyncGlobalState.storage).filter(key => !key.startsWith(argvStoragePrefx) && !registered.includes(key) && storageData.get(key) !== undefined) : [];

		if (!isWeb) {
			// Following keys are synced only in web. Do not sync these keys in other platforms
			const keysSyncedOnlyInWeb = [...ALL_SYNC_RESOURCES.map(resource => getEnablementKey(resource)), SYNC_SERVICE_URL_TYPE];
			unregistered.push(...keysSyncedOnlyInWeb);
			machine.push(...keysSyncedOnlyInWeb);
		}

		return { user, machine, unregistered };
	}
}

export class LocalGlobalStateProvider {
	constructor(
		@IFileService private readonly fileService: IFileService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IUserDataProfileStorageService private readonly userDataProfileStorageService: IUserDataProfileStorageService,
		@IUserDataSyncLogService private readonly logService: IUserDataSyncLogService
	) { }

	async getLocalGlobalState(profile: IUserDataProfile): Promise<IGlobalState> {
		const storage: IStringDictionary<IStorageValue> = {};
		if (profile.isDefault) {
			const argvContent: string = await this.getLocalArgvContent();
			const argvValue: IStringDictionary<any> = parse(argvContent);
			for (const argvProperty of argvProperties) {
				if (argvValue[argvProperty] !== undefined) {
					storage[`${argvStoragePrefx}${argvProperty}`] = { version: 1, value: argvValue[argvProperty] };
				}
			}
		}
		const storageData = await this.userDataProfileStorageService.readStorageData(profile);
		for (const [key, value] of storageData) {
			if (value.value && value.target === StorageTarget.USER) {
				storage[key] = { version: 1, value: value.value };
			}
		}
		return { storage };
	}

	private async getLocalArgvContent(): Promise<string> {
		try {
			this.logService.debug('GlobalStateSync#getLocalArgvContent', this.environmentService.argvResource);
			const content = await this.fileService.readFile(this.environmentService.argvResource);
			this.logService.debug('GlobalStateSync#getLocalArgvContent - Resolved', this.environmentService.argvResource);
			return content.value.toString();
		} catch (error) {
			this.logService.debug(getErrorMessage(error));
		}
		return '{}';
	}

	async writeLocalGlobalState({ added, removed, updated }: { added: IStringDictionary<IStorageValue>; updated: IStringDictionary<IStorageValue>; removed: string[] }, profile: IUserDataProfile): Promise<void> {
		const syncResourceLogLabel = getSyncResourceLogLabel(SyncResource.GlobalState, profile);
		const argv: IStringDictionary<any> = {};
		const updatedStorage = new Map<string, string | undefined>();
		const storageData = await this.userDataProfileStorageService.readStorageData(profile);
		const handleUpdatedStorage = (keys: string[], storage?: IStringDictionary<IStorageValue>): void => {
			for (const key of keys) {
				if (key.startsWith(argvStoragePrefx)) {
					argv[key.substring(argvStoragePrefx.length)] = storage ? storage[key].value : undefined;
					continue;
				}
				if (storage) {
					const storageValue = storage[key];
					if (storageValue.value !== storageData.get(key)?.value) {
						updatedStorage.set(key, storageValue.value);
					}
				} else {
					if (storageData.get(key) !== undefined) {
						updatedStorage.set(key, undefined);
					}
				}
			}
		};
		handleUpdatedStorage(Object.keys(added), added);
		handleUpdatedStorage(Object.keys(updated), updated);
		handleUpdatedStorage(removed);

		if (Object.keys(argv).length) {
			this.logService.trace(`${syncResourceLogLabel}: Updating locale...`);
			const argvContent = await this.getLocalArgvContent();
			let content = argvContent;
			for (const argvProperty of Object.keys(argv)) {
				content = edit(content, [argvProperty], argv[argvProperty], {});
			}
			if (argvContent !== content) {
				this.logService.trace(`${syncResourceLogLabel}: Updating locale...`);
				await this.fileService.writeFile(this.environmentService.argvResource, VSBuffer.fromString(content));
				this.logService.info(`${syncResourceLogLabel}: Updated locale.`);
			}
			this.logService.info(`${syncResourceLogLabel}: Updated locale`);
		}

		if (updatedStorage.size) {
			this.logService.trace(`${syncResourceLogLabel}: Updating global state...`);
			await this.userDataProfileStorageService.updateStorageData(profile, updatedStorage, StorageTarget.USER);
			this.logService.info(`${syncResourceLogLabel}: Updated global state`, [...updatedStorage.keys()]);
		}
	}
}

export class GlobalStateInitializer extends AbstractInitializer {

	constructor(
		@IStorageService storageService: IStorageService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.GlobalState, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const remoteGlobalState: IGlobalState = remoteUserData.syncData ? JSON.parse(remoteUserData.syncData.content) : null;
		if (!remoteGlobalState) {
			this.logService.info('Skipping initializing global state because remote global state does not exist.');
			return;
		}

		const argv: IStringDictionary<any> = {};
		const storage: IStringDictionary<any> = {};
		for (const key of Object.keys(remoteGlobalState.storage)) {
			if (key.startsWith(argvStoragePrefx)) {
				argv[key.substring(argvStoragePrefx.length)] = remoteGlobalState.storage[key].value;
			} else {
				if (this.storageService.get(key, StorageScope.PROFILE) === undefined) {
					storage[key] = remoteGlobalState.storage[key].value;
				}
			}
		}

		if (Object.keys(argv).length) {
			let content = '{}';
			try {
				const fileContent = await this.fileService.readFile(this.environmentService.argvResource);
				content = fileContent.value.toString();
			} catch (error) { }
			for (const argvProperty of Object.keys(argv)) {
				content = edit(content, [argvProperty], argv[argvProperty], {});
			}
			await this.fileService.writeFile(this.environmentService.argvResource, VSBuffer.fromString(content));
		}

		if (Object.keys(storage).length) {
			const storageEntries: Array<IStorageEntry> = [];
			for (const key of Object.keys(storage)) {
				storageEntries.push({ key, value: storage[key], scope: StorageScope.PROFILE, target: StorageTarget.USER });
			}
			this.storageService.storeAll(storageEntries, true);
		}
	}

}

export class UserDataSyncStoreTypeSynchronizer {

	constructor(
		private readonly userDataSyncStoreClient: UserDataSyncStoreClient,
		@IStorageService private readonly storageService: IStorageService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
	) {
	}

	getSyncStoreType(userData: IUserData): UserDataSyncStoreType | undefined {
		const remoteGlobalState = this.parseGlobalState(userData);
		return remoteGlobalState?.storage[SYNC_SERVICE_URL_TYPE]?.value as UserDataSyncStoreType;
	}

	async sync(userDataSyncStoreType: UserDataSyncStoreType): Promise<void> {
		const syncHeaders = createSyncHeaders(generateUuid());
		try {
			return await this.doSync(userDataSyncStoreType, syncHeaders);
		} catch (e) {
			if (e instanceof UserDataSyncError) {
				switch (e.code) {
					case UserDataSyncErrorCode.PreconditionFailed:
						this.logService.info(`Failed to synchronize UserDataSyncStoreType as there is a new remote version available. Synchronizing again...`);
						return this.doSync(userDataSyncStoreType, syncHeaders);
				}
			}
			throw e;
		}
	}

	private async doSync(userDataSyncStoreType: UserDataSyncStoreType, syncHeaders: IHeaders): Promise<void> {
		// Read the global state from remote
		const globalStateUserData = await this.userDataSyncStoreClient.readResource(SyncResource.GlobalState, null, undefined, syncHeaders);
		const remoteGlobalState = this.parseGlobalState(globalStateUserData) || { storage: {} };

		// Update the sync store type
		remoteGlobalState.storage[SYNC_SERVICE_URL_TYPE] = { value: userDataSyncStoreType, version: GLOBAL_STATE_DATA_VERSION };

		// Write the global state to remote
		const machineId = await getServiceMachineId(this.environmentService, this.fileService, this.storageService);
		const syncDataToUpdate: ISyncData = { version: GLOBAL_STATE_DATA_VERSION, machineId, content: stringify(remoteGlobalState, false) };
		await this.userDataSyncStoreClient.writeResource(SyncResource.GlobalState, JSON.stringify(syncDataToUpdate), globalStateUserData.ref, undefined, syncHeaders);
	}

	private parseGlobalState({ content }: IUserData): IGlobalState | null {
		if (!content) {
			return null;
		}
		const syncData = JSON.parse(content);
		if (isSyncData(syncData)) {
			return syncData ? JSON.parse(syncData.content) : null;
		}
		throw new Error('Invalid remote data');
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/ignoredExtensions.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/ignoredExtensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { ConfigurationTarget, IConfigurationService } from '../../configuration/common/configuration.js';
import { ILocalExtension } from '../../extensionManagement/common/extensionManagement.js';
import { createDecorator } from '../../instantiation/common/instantiation.js';

export const IIgnoredExtensionsManagementService = createDecorator<IIgnoredExtensionsManagementService>('IIgnoredExtensionsManagementService');
export interface IIgnoredExtensionsManagementService {
	readonly _serviceBrand: undefined;

	getIgnoredExtensions(installed: ILocalExtension[]): string[];

	hasToNeverSyncExtension(extensionId: string): boolean;
	hasToAlwaysSyncExtension(extensionId: string): boolean;
	updateIgnoredExtensions(ignoredExtensionId: string, ignore: boolean): Promise<void>;
	updateSynchronizedExtensions(ignoredExtensionId: string, sync: boolean): Promise<void>;
}

export class IgnoredExtensionsManagementService implements IIgnoredExtensionsManagementService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
	}

	hasToNeverSyncExtension(extensionId: string): boolean {
		const configuredIgnoredExtensions = this.getConfiguredIgnoredExtensions();
		return configuredIgnoredExtensions.includes(extensionId.toLowerCase());
	}

	hasToAlwaysSyncExtension(extensionId: string): boolean {
		const configuredIgnoredExtensions = this.getConfiguredIgnoredExtensions();
		return configuredIgnoredExtensions.includes(`-${extensionId.toLowerCase()}`);
	}

	updateIgnoredExtensions(ignoredExtensionId: string, ignore: boolean): Promise<void> {
		// first remove the extension completely from ignored extensions
		let currentValue = [...this.configurationService.getValue<string[]>('settingsSync.ignoredExtensions')].map(id => id.toLowerCase());
		currentValue = currentValue.filter(v => v !== ignoredExtensionId && v !== `-${ignoredExtensionId}`);

		// Add only if ignored
		if (ignore) {
			currentValue.push(ignoredExtensionId.toLowerCase());
		}

		return this.configurationService.updateValue('settingsSync.ignoredExtensions', currentValue.length ? currentValue : undefined, ConfigurationTarget.USER);
	}

	updateSynchronizedExtensions(extensionId: string, sync: boolean): Promise<void> {
		// first remove the extension completely from ignored extensions
		let currentValue = [...this.configurationService.getValue<string[]>('settingsSync.ignoredExtensions')].map(id => id.toLowerCase());
		currentValue = currentValue.filter(v => v !== extensionId && v !== `-${extensionId}`);

		// Add only if synced
		if (sync) {
			currentValue.push(`-${extensionId.toLowerCase()}`);
		}

		return this.configurationService.updateValue('settingsSync.ignoredExtensions', currentValue.length ? currentValue : undefined, ConfigurationTarget.USER);
	}

	getIgnoredExtensions(installed: ILocalExtension[]): string[] {
		const defaultIgnoredExtensions = installed.filter(i => i.isMachineScoped).map(i => i.identifier.id.toLowerCase());
		const value = this.getConfiguredIgnoredExtensions().map(id => id.toLowerCase());
		const added: string[] = [], removed: string[] = [];
		if (Array.isArray(value)) {
			for (const key of value) {
				if (key.startsWith('-')) {
					removed.push(key.substring(1));
				} else {
					added.push(key);
				}
			}
		}
		return distinct([...defaultIgnoredExtensions, ...added,].filter(setting => !removed.includes(setting)));
	}

	private getConfiguredIgnoredExtensions(): ReadonlyArray<string> {
		return (this.configurationService.getValue<string[]>('settingsSync.ignoredExtensions') || []).map(id => id.toLowerCase());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/keybindingsMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/keybindingsMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { equals } from '../../../base/common/arrays.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { parse } from '../../../base/common/json.js';
import { FormattingOptions } from '../../../base/common/jsonFormatter.js';
import * as objects from '../../../base/common/objects.js';
import { ContextKeyExpr } from '../../contextkey/common/contextkey.js';
import { IUserFriendlyKeybinding } from '../../keybinding/common/keybinding.js';
import * as contentUtil from './content.js';
import { IUserDataSyncUtilService } from './userDataSync.js';

interface ICompareResult {
	added: Set<string>;
	removed: Set<string>;
	updated: Set<string>;
}

interface IMergeResult {
	hasLocalForwarded: boolean;
	hasRemoteForwarded: boolean;
	added: Set<string>;
	removed: Set<string>;
	updated: Set<string>;
	conflicts: Set<string>;
}

function parseKeybindings(content: string): IUserFriendlyKeybinding[] {
	return parse(content) || [];
}

export async function merge(localContent: string, remoteContent: string, baseContent: string | null, formattingOptions: FormattingOptions, userDataSyncUtilService: IUserDataSyncUtilService): Promise<{ mergeContent: string; hasChanges: boolean; hasConflicts: boolean }> {
	const local = parseKeybindings(localContent);
	const remote = parseKeybindings(remoteContent);
	const base = baseContent ? parseKeybindings(baseContent) : null;

	const userbindings: string[] = [...local, ...remote, ...(base || [])].map(keybinding => keybinding.key);
	const normalizedKeys = await userDataSyncUtilService.resolveUserBindings(userbindings);
	const keybindingsMergeResult = computeMergeResultByKeybinding(local, remote, base, normalizedKeys);

	if (!keybindingsMergeResult.hasLocalForwarded && !keybindingsMergeResult.hasRemoteForwarded) {
		// No changes found between local and remote.
		return { mergeContent: localContent, hasChanges: false, hasConflicts: false };
	}

	if (!keybindingsMergeResult.hasLocalForwarded && keybindingsMergeResult.hasRemoteForwarded) {
		return { mergeContent: remoteContent, hasChanges: true, hasConflicts: false };
	}

	if (keybindingsMergeResult.hasLocalForwarded && !keybindingsMergeResult.hasRemoteForwarded) {
		// Local has moved forward and remote has not. Return local.
		return { mergeContent: localContent, hasChanges: true, hasConflicts: false };
	}

	// Both local and remote has moved forward.
	const localByCommand = byCommand(local);
	const remoteByCommand = byCommand(remote);
	const baseByCommand = base ? byCommand(base) : null;
	const localToRemoteByCommand = compareByCommand(localByCommand, remoteByCommand, normalizedKeys);
	const baseToLocalByCommand = baseByCommand ? compareByCommand(baseByCommand, localByCommand, normalizedKeys) : { added: [...localByCommand.keys()].reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	const baseToRemoteByCommand = baseByCommand ? compareByCommand(baseByCommand, remoteByCommand, normalizedKeys) : { added: [...remoteByCommand.keys()].reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };

	const commandsMergeResult = computeMergeResult(localToRemoteByCommand, baseToLocalByCommand, baseToRemoteByCommand);
	let mergeContent = localContent;

	// Removed commands in Remote
	for (const command of commandsMergeResult.removed.values()) {
		if (commandsMergeResult.conflicts.has(command)) {
			continue;
		}
		mergeContent = removeKeybindings(mergeContent, command, formattingOptions);
	}

	// Added commands in remote
	for (const command of commandsMergeResult.added.values()) {
		if (commandsMergeResult.conflicts.has(command)) {
			continue;
		}
		const keybindings = remoteByCommand.get(command)!;
		// Ignore negated commands
		if (keybindings.some(keybinding => keybinding.command !== `-${command}` && keybindingsMergeResult.conflicts.has(normalizedKeys[keybinding.key]))) {
			commandsMergeResult.conflicts.add(command);
			continue;
		}
		mergeContent = addKeybindings(mergeContent, keybindings, formattingOptions);
	}

	// Updated commands in Remote
	for (const command of commandsMergeResult.updated.values()) {
		if (commandsMergeResult.conflicts.has(command)) {
			continue;
		}
		const keybindings = remoteByCommand.get(command)!;
		// Ignore negated commands
		if (keybindings.some(keybinding => keybinding.command !== `-${command}` && keybindingsMergeResult.conflicts.has(normalizedKeys[keybinding.key]))) {
			commandsMergeResult.conflicts.add(command);
			continue;
		}
		mergeContent = updateKeybindings(mergeContent, command, keybindings, formattingOptions);
	}

	return { mergeContent, hasChanges: true, hasConflicts: commandsMergeResult.conflicts.size > 0 };
}

function computeMergeResult(localToRemote: ICompareResult, baseToLocal: ICompareResult, baseToRemote: ICompareResult): { added: Set<string>; removed: Set<string>; updated: Set<string>; conflicts: Set<string> } {
	const added: Set<string> = new Set<string>();
	const removed: Set<string> = new Set<string>();
	const updated: Set<string> = new Set<string>();
	const conflicts: Set<string> = new Set<string>();

	// Removed keys in Local
	for (const key of baseToLocal.removed.values()) {
		// Got updated in remote
		if (baseToRemote.updated.has(key)) {
			conflicts.add(key);
		}
	}

	// Removed keys in Remote
	for (const key of baseToRemote.removed.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in local
		if (baseToLocal.updated.has(key)) {
			conflicts.add(key);
		} else {
			// remove the key
			removed.add(key);
		}
	}

	// Added keys in Local
	for (const key of baseToLocal.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in remote
		if (baseToRemote.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		}
	}

	// Added keys in remote
	for (const key of baseToRemote.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in local
		if (baseToLocal.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			added.add(key);
		}
	}

	// Updated keys in Local
	for (const key of baseToLocal.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in remote
		if (baseToRemote.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		}
	}

	// Updated keys in Remote
	for (const key of baseToRemote.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in local
		if (baseToLocal.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			// updated key
			updated.add(key);
		}
	}
	return { added, removed, updated, conflicts };
}

function computeMergeResultByKeybinding(local: IUserFriendlyKeybinding[], remote: IUserFriendlyKeybinding[], base: IUserFriendlyKeybinding[] | null, normalizedKeys: IStringDictionary<string>): IMergeResult {
	const empty = new Set<string>();
	const localByKeybinding = byKeybinding(local, normalizedKeys);
	const remoteByKeybinding = byKeybinding(remote, normalizedKeys);
	const baseByKeybinding = base ? byKeybinding(base, normalizedKeys) : null;

	const localToRemoteByKeybinding = compareByKeybinding(localByKeybinding, remoteByKeybinding);
	if (localToRemoteByKeybinding.added.size === 0 && localToRemoteByKeybinding.removed.size === 0 && localToRemoteByKeybinding.updated.size === 0) {
		return { hasLocalForwarded: false, hasRemoteForwarded: false, added: empty, removed: empty, updated: empty, conflicts: empty };
	}

	const baseToLocalByKeybinding = baseByKeybinding ? compareByKeybinding(baseByKeybinding, localByKeybinding) : { added: [...localByKeybinding.keys()].reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	if (baseToLocalByKeybinding.added.size === 0 && baseToLocalByKeybinding.removed.size === 0 && baseToLocalByKeybinding.updated.size === 0) {
		// Remote has moved forward and local has not.
		return { hasLocalForwarded: false, hasRemoteForwarded: true, added: empty, removed: empty, updated: empty, conflicts: empty };
	}

	const baseToRemoteByKeybinding = baseByKeybinding ? compareByKeybinding(baseByKeybinding, remoteByKeybinding) : { added: [...remoteByKeybinding.keys()].reduce((r, k) => { r.add(k); return r; }, new Set<string>()), removed: new Set<string>(), updated: new Set<string>() };
	if (baseToRemoteByKeybinding.added.size === 0 && baseToRemoteByKeybinding.removed.size === 0 && baseToRemoteByKeybinding.updated.size === 0) {
		return { hasLocalForwarded: true, hasRemoteForwarded: false, added: empty, removed: empty, updated: empty, conflicts: empty };
	}

	const { added, removed, updated, conflicts } = computeMergeResult(localToRemoteByKeybinding, baseToLocalByKeybinding, baseToRemoteByKeybinding);
	return { hasLocalForwarded: true, hasRemoteForwarded: true, added, removed, updated, conflicts };
}

function byKeybinding(keybindings: IUserFriendlyKeybinding[], keys: IStringDictionary<string>) {
	const map: Map<string, IUserFriendlyKeybinding[]> = new Map<string, IUserFriendlyKeybinding[]>();
	for (const keybinding of keybindings) {
		const key = keys[keybinding.key];
		let value = map.get(key);
		if (!value) {
			value = [];
			map.set(key, value);
		}
		value.push(keybinding);

	}
	return map;
}

function byCommand(keybindings: IUserFriendlyKeybinding[]): Map<string, IUserFriendlyKeybinding[]> {
	const map: Map<string, IUserFriendlyKeybinding[]> = new Map<string, IUserFriendlyKeybinding[]>();
	for (const keybinding of keybindings) {
		const command = keybinding.command[0] === '-' ? keybinding.command.substring(1) : keybinding.command;
		let value = map.get(command);
		if (!value) {
			value = [];
			map.set(command, value);
		}
		value.push(keybinding);
	}
	return map;
}


function compareByKeybinding(from: Map<string, IUserFriendlyKeybinding[]>, to: Map<string, IUserFriendlyKeybinding[]>): ICompareResult {
	const fromKeys = [...from.keys()];
	const toKeys = [...to.keys()];
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const value1: IUserFriendlyKeybinding[] = from.get(key)!.map(keybinding => ({ ...keybinding, ...{ key } }));
		const value2: IUserFriendlyKeybinding[] = to.get(key)!.map(keybinding => ({ ...keybinding, ...{ key } }));
		if (!equals(value1, value2, (a, b) => isSameKeybinding(a, b))) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

function compareByCommand(from: Map<string, IUserFriendlyKeybinding[]>, to: Map<string, IUserFriendlyKeybinding[]>, normalizedKeys: IStringDictionary<string>): ICompareResult {
	const fromKeys = [...from.keys()];
	const toKeys = [...to.keys()];
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const value1: IUserFriendlyKeybinding[] = from.get(key)!.map(keybinding => ({ ...keybinding, ...{ key: normalizedKeys[keybinding.key] } }));
		const value2: IUserFriendlyKeybinding[] = to.get(key)!.map(keybinding => ({ ...keybinding, ...{ key: normalizedKeys[keybinding.key] } }));
		if (!areSameKeybindingsWithSameCommand(value1, value2)) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

function areSameKeybindingsWithSameCommand(value1: IUserFriendlyKeybinding[], value2: IUserFriendlyKeybinding[]): boolean {
	// Compare entries adding keybindings
	if (!equals(value1.filter(({ command }) => command[0] !== '-'), value2.filter(({ command }) => command[0] !== '-'), (a, b) => isSameKeybinding(a, b))) {
		return false;
	}
	// Compare entries removing keybindings
	if (!equals(value1.filter(({ command }) => command[0] === '-'), value2.filter(({ command }) => command[0] === '-'), (a, b) => isSameKeybinding(a, b))) {
		return false;
	}
	return true;
}

function isSameKeybinding(a: IUserFriendlyKeybinding, b: IUserFriendlyKeybinding): boolean {
	if (a.command !== b.command) {
		return false;
	}
	if (a.key !== b.key) {
		return false;
	}
	const whenA = ContextKeyExpr.deserialize(a.when);
	const whenB = ContextKeyExpr.deserialize(b.when);
	if ((whenA && !whenB) || (!whenA && whenB)) {
		return false;
	}
	if (whenA && whenB && !whenA.equals(whenB)) {
		return false;
	}
	if (!objects.equals(a.args, b.args)) {
		return false;
	}
	return true;
}

function addKeybindings(content: string, keybindings: IUserFriendlyKeybinding[], formattingOptions: FormattingOptions): string {
	for (const keybinding of keybindings) {
		content = contentUtil.edit(content, [-1], keybinding, formattingOptions);
	}
	return content;
}

function removeKeybindings(content: string, command: string, formattingOptions: FormattingOptions): string {
	const keybindings = parseKeybindings(content);
	for (let index = keybindings.length - 1; index >= 0; index--) {
		if (keybindings[index].command === command || keybindings[index].command === `-${command}`) {
			content = contentUtil.edit(content, [index], undefined, formattingOptions);
		}
	}
	return content;
}

function updateKeybindings(content: string, command: string, keybindings: IUserFriendlyKeybinding[], formattingOptions: FormattingOptions): string {
	const allKeybindings = parseKeybindings(content);
	const location = allKeybindings.findIndex(keybinding => keybinding.command === command || keybinding.command === `-${command}`);
	// Remove all entries with this command
	for (let index = allKeybindings.length - 1; index >= 0; index--) {
		if (allKeybindings[index].command === command || allKeybindings[index].command === `-${command}`) {
			content = contentUtil.edit(content, [index], undefined, formattingOptions);
		}
	}
	// add all entries at the same location where the entry with this command was located.
	for (let index = keybindings.length - 1; index >= 0; index--) {
		content = contentUtil.edit(content, [location], keybindings[index], formattingOptions);
	}
	return content;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/keybindingsSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/keybindingsSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../base/common/arrays.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { parse } from '../../../base/common/json.js';
import { OperatingSystem, OS } from '../../../base/common/platform.js';
import { isUndefined } from '../../../base/common/types.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractInitializer, AbstractJsonFileSynchroniser, IAcceptResult, IFileResourcePreview, IMergeResult } from './abstractSynchronizer.js';
import { merge } from './keybindingsMerge.js';
import { Change, IRemoteUserData, IUserDataSyncLocalStoreService, IUserDataSyncConfiguration, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, IUserDataSyncUtilService, SyncResource, UserDataSyncError, UserDataSyncErrorCode, USER_DATA_SYNC_SCHEME, CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM } from './userDataSync.js';

interface ISyncContent {
	mac?: string;
	linux?: string;
	windows?: string;
	all?: string;
}

interface IKeybindingsResourcePreview extends IFileResourcePreview {
	previewResult: IMergeResult;
}

interface ILastSyncUserData extends IRemoteUserData {
	platformSpecific?: boolean;
}

export function getKeybindingsContentFromSyncContent(syncContent: string, platformSpecific: boolean, logService: ILogService): string | null {
	try {
		const parsed = <ISyncContent>JSON.parse(syncContent);
		if (!platformSpecific) {
			return isUndefined(parsed.all) ? null : parsed.all;
		}
		switch (OS) {
			case OperatingSystem.Macintosh:
				return isUndefined(parsed.mac) ? null : parsed.mac;
			case OperatingSystem.Linux:
				return isUndefined(parsed.linux) ? null : parsed.linux;
			case OperatingSystem.Windows:
				return isUndefined(parsed.windows) ? null : parsed.windows;
		}
	} catch (e) {
		logService.error(e);
		return null;
	}
}

export class KeybindingsSynchroniser extends AbstractJsonFileSynchroniser implements IUserDataSynchroniser {

	/* Version 2: Change settings from `sync.${setting}` to `settingsSync.{setting}` */
	protected readonly version: number = 2;
	private readonly previewResource: URI = this.extUri.joinPath(this.syncPreviewFolder, 'keybindings.json');
	private readonly baseResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
	private readonly localResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
	private readonly remoteResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
	private readonly acceptedResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncUtilService userDataSyncUtilService: IUserDataSyncUtilService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(profile.keybindingsResource, { syncResource: SyncResource.Keybindings, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, userDataSyncUtilService, configurationService, uriIdentityService);
		this._register(Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('settingsSync.keybindingsPerPlatform'))(() => this.triggerLocalChange()));
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: ILastSyncUserData | null, isRemoteDataFromCurrentMachine: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration): Promise<IKeybindingsResourcePreview[]> {
		const remoteContent = remoteUserData.syncData ? getKeybindingsContentFromSyncContent(remoteUserData.syncData.content, userDataSyncConfiguration.keybindingsPerPlatform ?? this.syncKeybindingsPerPlatform(), this.logService) : null;

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSyncContent: string | null = lastSyncUserData ? this.getKeybindingsContentFromLastSyncUserData(lastSyncUserData) : null;

		// Get file content last to get the latest
		const fileContent = await this.getLocalFileContent();
		const formattingOptions = await this.getFormattingOptions();

		let mergedContent: string | null = null;
		let hasLocalChanged: boolean = false;
		let hasRemoteChanged: boolean = false;
		let hasConflicts: boolean = false;

		if (remoteContent) {
			let localContent: string = fileContent ? fileContent.value.toString() : '[]';
			localContent = localContent || '[]';
			if (this.hasErrors(localContent, true)) {
				throw new UserDataSyncError(localize('errorInvalidSettings', "Unable to sync keybindings because the content in the file is not valid. Please open the file and correct it."), UserDataSyncErrorCode.LocalInvalidContent, this.resource);
			}

			if (!lastSyncContent // First time sync
				|| lastSyncContent !== localContent // Local has forwarded
				|| lastSyncContent !== remoteContent // Remote has forwarded
			) {
				this.logService.trace(`${this.syncResourceLogLabel}: Merging remote keybindings with local keybindings...`);
				const result = await merge(localContent, remoteContent, lastSyncContent, formattingOptions, this.userDataSyncUtilService);
				// Sync only if there are changes
				if (result.hasChanges) {
					mergedContent = result.mergeContent;
					hasConflicts = result.hasConflicts;
					hasLocalChanged = hasConflicts || result.mergeContent !== localContent;
					hasRemoteChanged = hasConflicts || result.mergeContent !== remoteContent;
				}
			}
		}

		// First time syncing to remote
		else if (fileContent) {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote keybindings does not exist. Synchronizing keybindings for the first time.`);
			mergedContent = fileContent.value.toString();
			hasRemoteChanged = true;
		}

		const previewResult: IMergeResult = {
			content: hasConflicts ? lastSyncContent : mergedContent,
			localChange: hasLocalChanged ? fileContent ? Change.Modified : Change.Added : Change.None,
			remoteChange: hasRemoteChanged ? Change.Modified : Change.None,
			hasConflicts
		};

		const localContent = fileContent ? fileContent.value.toString() : null;
		return [{
			fileContent,

			baseResource: this.baseResource,
			baseContent: lastSyncContent,

			localResource: this.localResource,
			localContent,
			localChange: previewResult.localChange,

			remoteResource: this.remoteResource,
			remoteContent,
			remoteChange: previewResult.remoteChange,

			previewResource: this.previewResource,
			previewResult,
			acceptedResource: this.acceptedResource,
		}];

	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSyncContent = this.getKeybindingsContentFromLastSyncUserData(lastSyncUserData);
		if (lastSyncContent === null) {
			return true;
		}

		const fileContent = await this.getLocalFileContent();
		const localContent: string = fileContent ? fileContent.value.toString() : '';
		const formattingOptions = await this.getFormattingOptions();
		const result = await merge(localContent || '[]', lastSyncContent, lastSyncContent, formattingOptions, this.userDataSyncUtilService);
		return result.hasConflicts || result.mergeContent !== lastSyncContent;
	}

	protected async getMergeResult(resourcePreview: IKeybindingsResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return resourcePreview.previewResult;
	}

	protected async getAcceptResult(resourcePreview: IKeybindingsResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		/* Accept local resource */
		if (this.extUri.isEqual(resource, this.localResource)) {
			return {
				content: resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : null,
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
		}

		/* Accept remote resource */
		if (this.extUri.isEqual(resource, this.remoteResource)) {
			return {
				content: resourcePreview.remoteContent,
				localChange: Change.Modified,
				remoteChange: Change.None,
			};
		}

		/* Accept preview resource */
		if (this.extUri.isEqual(resource, this.previewResource)) {
			if (content === undefined) {
				return {
					content: resourcePreview.previewResult.content,
					localChange: resourcePreview.previewResult.localChange,
					remoteChange: resourcePreview.previewResult.remoteChange,
				};
			} else {
				return {
					content,
					localChange: Change.Modified,
					remoteChange: Change.Modified,
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [IKeybindingsResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		const { fileContent } = resourcePreviews[0][0];
		let { content, localChange, remoteChange } = resourcePreviews[0][1];

		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing keybindings.`);
		}

		if (content !== null) {
			content = content.trim();
			content = content || '[]';
			if (this.hasErrors(content, true)) {
				throw new UserDataSyncError(localize('errorInvalidSettings', "Unable to sync keybindings because the content in the file is not valid. Please open the file and correct it."), UserDataSyncErrorCode.LocalInvalidContent, this.resource);
			}
		}

		if (localChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating local keybindings...`);
			if (fileContent) {
				await this.backupLocal(this.toSyncContent(fileContent.value.toString()));
			}
			await this.updateLocalFileContent(content || '[]', fileContent, force);
			this.logService.info(`${this.syncResourceLogLabel}: Updated local keybindings`);
		}

		if (remoteChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote keybindings...`);
			const remoteContents = this.toSyncContent(content || '[]', remoteUserData.syncData?.content);
			remoteUserData = await this.updateRemoteUserData(remoteContents, force ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote keybindings`);
		}

		// Delete the preview
		try {
			await this.fileService.del(this.previewResource);
		} catch (e) { /* ignore */ }

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized keybindings...`);
			await this.updateLastSyncUserData(remoteUserData, { platformSpecific: this.syncKeybindingsPerPlatform() });
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized keybindings`);
		}

	}

	async hasLocalData(): Promise<boolean> {
		try {
			const localFileContent = await this.getLocalFileContent();
			if (localFileContent) {
				const keybindings = parse(localFileContent.value.toString());
				if (isNonEmptyArray(keybindings)) {
					return true;
				}
			}
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				return true;
			}
		}
		return false;
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
		) {
			return this.resolvePreviewContent(uri);
		}
		return null;
	}

	private getKeybindingsContentFromLastSyncUserData(lastSyncUserData: ILastSyncUserData): string | null {
		if (!lastSyncUserData.syncData) {
			return null;
		}

		// Return null if there is a change in platform specific property from last time sync.
		if (lastSyncUserData.platformSpecific !== undefined && lastSyncUserData.platformSpecific !== this.syncKeybindingsPerPlatform()) {
			return null;
		}

		return getKeybindingsContentFromSyncContent(lastSyncUserData.syncData.content, this.syncKeybindingsPerPlatform(), this.logService);
	}

	private toSyncContent(keybindingsContent: string, syncContent?: string): string {
		let parsed: ISyncContent = {};
		try {
			parsed = JSON.parse(syncContent || '{}');
		} catch (e) {
			this.logService.error(e);
		}
		if (this.syncKeybindingsPerPlatform()) {
			delete parsed.all;
		} else {
			parsed.all = keybindingsContent;
		}
		switch (OS) {
			case OperatingSystem.Macintosh:
				parsed.mac = keybindingsContent;
				break;
			case OperatingSystem.Linux:
				parsed.linux = keybindingsContent;
				break;
			case OperatingSystem.Windows:
				parsed.windows = keybindingsContent;
				break;
		}
		return JSON.stringify(parsed);
	}

	private syncKeybindingsPerPlatform(): boolean {
		return !!this.configurationService.getValue(CONFIG_SYNC_KEYBINDINGS_PER_PLATFORM);
	}

}

export class KeybindingsInitializer extends AbstractInitializer {

	constructor(
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.Keybindings, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const keybindingsContent = remoteUserData.syncData ? this.getKeybindingsContentFromSyncContent(remoteUserData.syncData.content) : null;
		if (!keybindingsContent) {
			this.logService.info('Skipping initializing keybindings because remote keybindings does not exist.');
			return;
		}

		const isEmpty = await this.isEmpty();
		if (!isEmpty) {
			this.logService.info('Skipping initializing keybindings because local keybindings exist.');
			return;
		}

		await this.fileService.writeFile(this.userDataProfilesService.defaultProfile.keybindingsResource, VSBuffer.fromString(keybindingsContent));

		await this.updateLastSyncUserData(remoteUserData);
	}

	private async isEmpty(): Promise<boolean> {
		try {
			const fileContent = await this.fileService.readFile(this.userDataProfilesService.defaultProfile.settingsResource);
			const keybindings = parse(fileContent.value.toString());
			return !isNonEmptyArray(keybindings);
		} catch (error) {
			return (<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND;
		}
	}

	private getKeybindingsContentFromSyncContent(syncContent: string): string | null {
		try {
			return getKeybindingsContentFromSyncContent(syncContent, true, this.logService);
		} catch (e) {
			this.logService.error(e);
			return null;
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/mcpSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/mcpSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractJsonSynchronizer } from './abstractJsonSynchronizer.js';
import { IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource } from './userDataSync.js';

interface IMcpSyncContent {
	mcp?: string;
}

export function getMcpContentFromSyncContent(syncContent: string, logService: ILogService): string | null {
	try {
		const parsed = <IMcpSyncContent>JSON.parse(syncContent);
		return parsed.mcp ?? null;
	} catch (e) {
		logService.error(e);
		return null;
	}
}

export class McpSynchroniser extends AbstractJsonSynchronizer implements IUserDataSynchroniser {

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(profile.mcpResource, { syncResource: SyncResource.Mcp, profile }, collection, 'mcp.json', fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
	}

	protected getContentFromSyncContent(syncContent: string): string | null {
		return getMcpContentFromSyncContent(syncContent, this.logService);
	}

	protected toSyncContent(mcp: string | null): IMcpSyncContent {
		return mcp ? { mcp } : {};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/settingsMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/settingsMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { JSONVisitor, parse, visit } from '../../../base/common/json.js';
import { applyEdits, setProperty, withFormatting } from '../../../base/common/jsonEdit.js';
import { Edit, FormattingOptions, getEOL } from '../../../base/common/jsonFormatter.js';
import * as objects from '../../../base/common/objects.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import * as contentUtil from './content.js';
import { getDisallowedIgnoredSettings, IConflictSetting } from './userDataSync.js';

export interface IMergeResult {
	localContent: string | null;
	remoteContent: string | null;
	hasConflicts: boolean;
	conflictsSettings: IConflictSetting[];
}

export function getIgnoredSettings(defaultIgnoredSettings: string[], configurationService: IConfigurationService, settingsContent?: string): string[] {
	let value: ReadonlyArray<string> = [];
	if (settingsContent) {
		value = getIgnoredSettingsFromContent(settingsContent);
	} else {
		value = getIgnoredSettingsFromConfig(configurationService);
	}
	const added: string[] = [], removed: string[] = [...getDisallowedIgnoredSettings()];
	if (Array.isArray(value)) {
		for (const key of value) {
			if (key.startsWith('-')) {
				removed.push(key.substring(1));
			} else {
				added.push(key);
			}
		}
	}
	return distinct([...defaultIgnoredSettings, ...added,].filter(setting => !removed.includes(setting)));
}

function getIgnoredSettingsFromConfig(configurationService: IConfigurationService): ReadonlyArray<string> {
	let userValue = configurationService.inspect<string[]>('settingsSync.ignoredSettings').userValue;
	if (userValue !== undefined) {
		return userValue;
	}
	userValue = configurationService.inspect<string[]>('sync.ignoredSettings').userValue;
	if (userValue !== undefined) {
		return userValue;
	}
	return configurationService.getValue<string[]>('settingsSync.ignoredSettings') || [];
}

function getIgnoredSettingsFromContent(settingsContent: string): string[] {
	const parsed = parse(settingsContent);
	return parsed ? parsed['settingsSync.ignoredSettings'] || parsed['sync.ignoredSettings'] || [] : [];
}

export function removeComments(content: string, formattingOptions: FormattingOptions): string {
	const source = parse(content) || {};
	let result = '{}';
	for (const key of Object.keys(source)) {
		const edits = setProperty(result, [key], source[key], formattingOptions);
		result = applyEdits(result, edits);
	}
	return result;
}

export function updateIgnoredSettings(targetContent: string, sourceContent: string, ignoredSettings: string[], formattingOptions: FormattingOptions): string {
	if (ignoredSettings.length) {
		const sourceTree = parseSettings(sourceContent);
		const source = parse(sourceContent) || {};
		const target = parse(targetContent);
		if (!target) {
			return targetContent;
		}
		const settingsToAdd: INode[] = [];
		for (const key of ignoredSettings) {
			const sourceValue = source[key];
			const targetValue = target[key];

			// Remove in target
			if (sourceValue === undefined) {
				targetContent = contentUtil.edit(targetContent, [key], undefined, formattingOptions);
			}

			// Update in target
			else if (targetValue !== undefined) {
				targetContent = contentUtil.edit(targetContent, [key], sourceValue, formattingOptions);
			}

			else {
				settingsToAdd.push(findSettingNode(key, sourceTree)!);
			}
		}

		settingsToAdd.sort((a, b) => a.startOffset - b.startOffset);
		settingsToAdd.forEach(s => targetContent = addSetting(s.setting!.key, sourceContent, targetContent, formattingOptions));
	}
	return targetContent;
}

export function merge(originalLocalContent: string, originalRemoteContent: string, baseContent: string | null, ignoredSettings: string[], resolvedConflicts: { key: string; value: any | undefined }[], formattingOptions: FormattingOptions): IMergeResult {

	const localContentWithoutIgnoredSettings = updateIgnoredSettings(originalLocalContent, originalRemoteContent, ignoredSettings, formattingOptions);
	const localForwarded = baseContent !== localContentWithoutIgnoredSettings;
	const remoteForwarded = baseContent !== originalRemoteContent;

	/* no changes */
	if (!localForwarded && !remoteForwarded) {
		return { conflictsSettings: [], localContent: null, remoteContent: null, hasConflicts: false };
	}

	/* local has changed and remote has not */
	if (localForwarded && !remoteForwarded) {
		return { conflictsSettings: [], localContent: null, remoteContent: localContentWithoutIgnoredSettings, hasConflicts: false };
	}

	/* remote has changed and local has not */
	if (remoteForwarded && !localForwarded) {
		return { conflictsSettings: [], localContent: updateIgnoredSettings(originalRemoteContent, originalLocalContent, ignoredSettings, formattingOptions), remoteContent: null, hasConflicts: false };
	}

	/* local is empty and not synced before */
	if (baseContent === null && isEmpty(originalLocalContent)) {
		const localContent = areSame(originalLocalContent, originalRemoteContent, ignoredSettings) ? null : updateIgnoredSettings(originalRemoteContent, originalLocalContent, ignoredSettings, formattingOptions);
		return { conflictsSettings: [], localContent, remoteContent: null, hasConflicts: false };
	}

	/* remote and local has changed */
	let localContent = originalLocalContent;
	let remoteContent = originalRemoteContent;
	const local = parse(originalLocalContent);
	const remote = parse(originalRemoteContent);
	const base = baseContent ? parse(baseContent) : null;

	const ignored = ignoredSettings.reduce((set, key) => { set.add(key); return set; }, new Set<string>());
	const localToRemote = compare(local, remote, ignored);
	const baseToLocal = compare(base, local, ignored);
	const baseToRemote = compare(base, remote, ignored);

	const conflicts: Map<string, IConflictSetting> = new Map<string, IConflictSetting>();
	const handledConflicts: Set<string> = new Set<string>();
	const handleConflict = (conflictKey: string): void => {
		handledConflicts.add(conflictKey);
		const resolvedConflict = resolvedConflicts.filter(({ key }) => key === conflictKey)[0];
		if (resolvedConflict) {
			localContent = contentUtil.edit(localContent, [conflictKey], resolvedConflict.value, formattingOptions);
			remoteContent = contentUtil.edit(remoteContent, [conflictKey], resolvedConflict.value, formattingOptions);
		} else {
			conflicts.set(conflictKey, { key: conflictKey, localValue: local[conflictKey], remoteValue: remote[conflictKey] });
		}
	};

	// Removed settings in Local
	for (const key of baseToLocal.removed.values()) {
		// Conflict - Got updated in remote.
		if (baseToRemote.updated.has(key)) {
			handleConflict(key);
		}
		// Also remove in remote
		else {
			remoteContent = contentUtil.edit(remoteContent, [key], undefined, formattingOptions);
		}
	}

	// Removed settings in Remote
	for (const key of baseToRemote.removed.values()) {
		if (handledConflicts.has(key)) {
			continue;
		}
		// Conflict - Got updated in local
		if (baseToLocal.updated.has(key)) {
			handleConflict(key);
		}
		// Also remove in locals
		else {
			localContent = contentUtil.edit(localContent, [key], undefined, formattingOptions);
		}
	}

	// Updated settings in Local
	for (const key of baseToLocal.updated.values()) {
		if (handledConflicts.has(key)) {
			continue;
		}
		// Got updated in remote
		if (baseToRemote.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				handleConflict(key);
			}
		} else {
			remoteContent = contentUtil.edit(remoteContent, [key], local[key], formattingOptions);
		}
	}

	// Updated settings in Remote
	for (const key of baseToRemote.updated.values()) {
		if (handledConflicts.has(key)) {
			continue;
		}
		// Got updated in local
		if (baseToLocal.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				handleConflict(key);
			}
		} else {
			localContent = contentUtil.edit(localContent, [key], remote[key], formattingOptions);
		}
	}

	// Added settings in Local
	for (const key of baseToLocal.added.values()) {
		if (handledConflicts.has(key)) {
			continue;
		}
		// Got added in remote
		if (baseToRemote.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				handleConflict(key);
			}
		} else {
			remoteContent = addSetting(key, localContent, remoteContent, formattingOptions);
		}
	}

	// Added settings in remote
	for (const key of baseToRemote.added.values()) {
		if (handledConflicts.has(key)) {
			continue;
		}
		// Got added in local
		if (baseToLocal.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				handleConflict(key);
			}
		} else {
			localContent = addSetting(key, remoteContent, localContent, formattingOptions);
		}
	}

	const hasConflicts = conflicts.size > 0 || !areSame(localContent, remoteContent, ignoredSettings);
	const hasLocalChanged = hasConflicts || !areSame(localContent, originalLocalContent, []);
	const hasRemoteChanged = hasConflicts || !areSame(remoteContent, originalRemoteContent, []);
	return { localContent: hasLocalChanged ? localContent : null, remoteContent: hasRemoteChanged ? remoteContent : null, conflictsSettings: [...conflicts.values()], hasConflicts };
}

function areSame(localContent: string, remoteContent: string, ignoredSettings: string[]): boolean {
	if (localContent === remoteContent) {
		return true;
	}

	const local = parse(localContent);
	const remote = parse(remoteContent);
	const ignored = ignoredSettings.reduce((set, key) => { set.add(key); return set; }, new Set<string>());
	const localTree = parseSettings(localContent).filter(node => !(node.setting && ignored.has(node.setting.key)));
	const remoteTree = parseSettings(remoteContent).filter(node => !(node.setting && ignored.has(node.setting.key)));

	if (localTree.length !== remoteTree.length) {
		return false;
	}

	for (let index = 0; index < localTree.length; index++) {
		const localNode = localTree[index];
		const remoteNode = remoteTree[index];
		if (localNode.setting && remoteNode.setting) {
			if (localNode.setting.key !== remoteNode.setting.key) {
				return false;
			}
			if (!objects.equals(local[localNode.setting.key], remote[localNode.setting.key])) {
				return false;
			}
		} else if (!localNode.setting && !remoteNode.setting) {
			if (localNode.value !== remoteNode.value) {
				return false;
			}
		} else {
			return false;
		}
	}

	return true;
}

export function isEmpty(content: string): boolean {
	if (content) {
		const nodes = parseSettings(content);
		return nodes.length === 0;
	}
	return true;
}

function compare(from: IStringDictionary<any> | null, to: IStringDictionary<any>, ignored: Set<string>): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = from ? Object.keys(from).filter(key => !ignored.has(key)) : [];
	const toKeys = Object.keys(to).filter(key => !ignored.has(key));
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	if (from) {
		for (const key of fromKeys) {
			if (removed.has(key)) {
				continue;
			}
			const value1 = from[key];
			const value2 = to[key];
			if (!objects.equals(value1, value2)) {
				updated.add(key);
			}
		}
	}

	return { added, removed, updated };
}

export function addSetting(key: string, sourceContent: string, targetContent: string, formattingOptions: FormattingOptions): string {
	const source = parse(sourceContent);
	const sourceTree = parseSettings(sourceContent);
	const targetTree = parseSettings(targetContent);
	const insertLocation = getInsertLocation(key, sourceTree, targetTree);
	return insertAtLocation(targetContent, key, source[key], insertLocation, targetTree, formattingOptions);
}

interface InsertLocation {
	index: number;
	insertAfter: boolean;
}

function getInsertLocation(key: string, sourceTree: INode[], targetTree: INode[]): InsertLocation {

	const sourceNodeIndex = sourceTree.findIndex(node => node.setting?.key === key);

	const sourcePreviousNode: INode = sourceTree[sourceNodeIndex - 1];
	if (sourcePreviousNode) {
		/*
			Previous node in source is a setting.
			Find the same setting in the target.
			Insert it after that setting
		*/
		if (sourcePreviousNode.setting) {
			const targetPreviousSetting = findSettingNode(sourcePreviousNode.setting.key, targetTree);
			if (targetPreviousSetting) {
				/* Insert after target's previous setting */
				return { index: targetTree.indexOf(targetPreviousSetting), insertAfter: true };
			}
		}
		/* Previous node in source is a comment */
		else {
			const sourcePreviousSettingNode = findPreviousSettingNode(sourceNodeIndex, sourceTree);
			/*
				Source has a setting defined before the setting to be added.
				Find the same previous setting in the target.
				If found, insert before its next setting so that comments are retrieved.
				Otherwise, insert at the end.
			*/
			if (sourcePreviousSettingNode) {
				const targetPreviousSetting = findSettingNode(sourcePreviousSettingNode.setting!.key, targetTree);
				if (targetPreviousSetting) {
					const targetNextSetting = findNextSettingNode(targetTree.indexOf(targetPreviousSetting), targetTree);
					const sourceCommentNodes = findNodesBetween(sourceTree, sourcePreviousSettingNode, sourceTree[sourceNodeIndex]);
					if (targetNextSetting) {
						const targetCommentNodes = findNodesBetween(targetTree, targetPreviousSetting, targetNextSetting);
						const targetCommentNode = findLastMatchingTargetCommentNode(sourceCommentNodes, targetCommentNodes);
						if (targetCommentNode) {
							return { index: targetTree.indexOf(targetCommentNode), insertAfter: true }; /* Insert after comment */
						} else {
							return { index: targetTree.indexOf(targetNextSetting), insertAfter: false }; /* Insert before target next setting */
						}
					} else {
						const targetCommentNodes = findNodesBetween(targetTree, targetPreviousSetting, targetTree[targetTree.length - 1]);
						const targetCommentNode = findLastMatchingTargetCommentNode(sourceCommentNodes, targetCommentNodes);
						if (targetCommentNode) {
							return { index: targetTree.indexOf(targetCommentNode), insertAfter: true }; /* Insert after comment */
						} else {
							return { index: targetTree.length - 1, insertAfter: true }; /* Insert at the end */
						}
					}
				}
			}
		}

		const sourceNextNode = sourceTree[sourceNodeIndex + 1];
		if (sourceNextNode) {
			/*
				Next node in source is a setting.
				Find the same setting in the target.
				Insert it before that setting
			*/
			if (sourceNextNode.setting) {
				const targetNextSetting = findSettingNode(sourceNextNode.setting.key, targetTree);
				if (targetNextSetting) {
					/* Insert before target's next setting */
					return { index: targetTree.indexOf(targetNextSetting), insertAfter: false };
				}
			}
			/* Next node in source is a comment */
			else {
				const sourceNextSettingNode = findNextSettingNode(sourceNodeIndex, sourceTree);
				/*
					Source has a setting defined after the setting to be added.
					Find the same next setting in the target.
					If found, insert after its previous setting so that comments are retrieved.
					Otherwise, insert at the beginning.
				*/
				if (sourceNextSettingNode) {
					const targetNextSetting = findSettingNode(sourceNextSettingNode.setting!.key, targetTree);
					if (targetNextSetting) {
						const targetPreviousSetting = findPreviousSettingNode(targetTree.indexOf(targetNextSetting), targetTree);
						const sourceCommentNodes = findNodesBetween(sourceTree, sourceTree[sourceNodeIndex], sourceNextSettingNode);
						if (targetPreviousSetting) {
							const targetCommentNodes = findNodesBetween(targetTree, targetPreviousSetting, targetNextSetting);
							const targetCommentNode = findLastMatchingTargetCommentNode(sourceCommentNodes.reverse(), targetCommentNodes.reverse());
							if (targetCommentNode) {
								return { index: targetTree.indexOf(targetCommentNode), insertAfter: false }; /* Insert before comment */
							} else {
								return { index: targetTree.indexOf(targetPreviousSetting), insertAfter: true }; /* Insert after target previous setting */
							}
						} else {
							const targetCommentNodes = findNodesBetween(targetTree, targetTree[0], targetNextSetting);
							const targetCommentNode = findLastMatchingTargetCommentNode(sourceCommentNodes.reverse(), targetCommentNodes.reverse());
							if (targetCommentNode) {
								return { index: targetTree.indexOf(targetCommentNode), insertAfter: false }; /* Insert before comment */
							} else {
								return { index: 0, insertAfter: false }; /* Insert at the beginning */
							}
						}
					}
				}
			}
		}
	}
	/* Insert at the end */
	return { index: targetTree.length - 1, insertAfter: true };
}

function insertAtLocation(content: string, key: string, value: any, location: InsertLocation, tree: INode[], formattingOptions: FormattingOptions): string {
	let edits: Edit[];
	/* Insert at the end */
	if (location.index === -1) {
		edits = setProperty(content, [key], value, formattingOptions);
	} else {
		edits = getEditToInsertAtLocation(content, key, value, location, tree, formattingOptions).map(edit => withFormatting(content, edit, formattingOptions)[0]);
	}
	return applyEdits(content, edits);
}

function getEditToInsertAtLocation(content: string, key: string, value: any, location: InsertLocation, tree: INode[], formattingOptions: FormattingOptions): Edit[] {
	const newProperty = `${JSON.stringify(key)}: ${JSON.stringify(value)}`;
	const eol = getEOL(formattingOptions, content);
	const node = tree[location.index];

	if (location.insertAfter) {

		const edits: Edit[] = [];

		/* Insert after a setting */
		if (node.setting) {
			edits.push({ offset: node.endOffset, length: 0, content: ',' + newProperty });
		}

		/* Insert after a comment */
		else {

			const nextSettingNode = findNextSettingNode(location.index, tree);
			const previousSettingNode = findPreviousSettingNode(location.index, tree);
			const previousSettingCommaOffset = previousSettingNode?.setting?.commaOffset;

			/* If there is a previous setting and it does not has comma then add it */
			if (previousSettingNode && previousSettingCommaOffset === undefined) {
				edits.push({ offset: previousSettingNode.endOffset, length: 0, content: ',' });
			}

			const isPreviouisSettingIncludesComment = previousSettingCommaOffset !== undefined && previousSettingCommaOffset > node.endOffset;
			edits.push({
				offset: isPreviouisSettingIncludesComment ? previousSettingCommaOffset + 1 : node.endOffset,
				length: 0,
				content: nextSettingNode ? eol + newProperty + ',' : eol + newProperty
			});
		}


		return edits;
	}

	else {

		/* Insert before a setting */
		if (node.setting) {
			return [{ offset: node.startOffset, length: 0, content: newProperty + ',' }];
		}

		/* Insert before a comment */
		const content = (tree[location.index - 1] && !tree[location.index - 1].setting /* previous node is comment */ ? eol : '')
			+ newProperty
			+ (findNextSettingNode(location.index, tree) ? ',' : '')
			+ eol;
		return [{ offset: node.startOffset, length: 0, content }];
	}

}

function findSettingNode(key: string, tree: INode[]): INode | undefined {
	return tree.filter(node => node.setting?.key === key)[0];
}

function findPreviousSettingNode(index: number, tree: INode[]): INode | undefined {
	for (let i = index - 1; i >= 0; i--) {
		if (tree[i].setting) {
			return tree[i];
		}
	}
	return undefined;
}

function findNextSettingNode(index: number, tree: INode[]): INode | undefined {
	for (let i = index + 1; i < tree.length; i++) {
		if (tree[i].setting) {
			return tree[i];
		}
	}
	return undefined;
}

function findNodesBetween(nodes: INode[], from: INode, till: INode): INode[] {
	const fromIndex = nodes.indexOf(from);
	const tillIndex = nodes.indexOf(till);
	return nodes.filter((node, index) => fromIndex < index && index < tillIndex);
}

function findLastMatchingTargetCommentNode(sourceComments: INode[], targetComments: INode[]): INode | undefined {
	if (sourceComments.length && targetComments.length) {
		let index = 0;
		for (; index < targetComments.length && index < sourceComments.length; index++) {
			if (sourceComments[index].value !== targetComments[index].value) {
				return targetComments[index - 1];
			}
		}
		return targetComments[index - 1];
	}
	return undefined;
}

interface INode {
	readonly startOffset: number;
	readonly endOffset: number;
	readonly value: string;
	readonly setting?: {
		readonly key: string;
		readonly commaOffset: number | undefined;
	};
	readonly comment?: string;
}

function parseSettings(content: string): INode[] {
	const nodes: INode[] = [];
	let hierarchyLevel = -1;
	let startOffset: number;
	let key: string;

	const visitor: JSONVisitor = {
		onObjectBegin: (offset: number) => {
			hierarchyLevel++;
		},
		onObjectProperty: (name: string, offset: number, length: number) => {
			if (hierarchyLevel === 0) {
				// this is setting key
				startOffset = offset;
				key = name;
			}
		},
		onObjectEnd: (offset: number, length: number) => {
			hierarchyLevel--;
			if (hierarchyLevel === 0) {
				nodes.push({
					startOffset,
					endOffset: offset + length,
					value: content.substring(startOffset, offset + length),
					setting: {
						key,
						commaOffset: undefined
					}
				});
			}
		},
		onArrayBegin: (offset: number, length: number) => {
			hierarchyLevel++;
		},
		onArrayEnd: (offset: number, length: number) => {
			hierarchyLevel--;
			if (hierarchyLevel === 0) {
				nodes.push({
					startOffset,
					endOffset: offset + length,
					value: content.substring(startOffset, offset + length),
					setting: {
						key,
						commaOffset: undefined
					}
				});
			}
		},
		onLiteralValue: (value: any, offset: number, length: number) => {
			if (hierarchyLevel === 0) {
				nodes.push({
					startOffset,
					endOffset: offset + length,
					value: content.substring(startOffset, offset + length),
					setting: {
						key,
						commaOffset: undefined
					}
				});
			}
		},
		onSeparator: (sep: string, offset: number, length: number) => {
			if (hierarchyLevel === 0) {
				if (sep === ',') {
					let index = nodes.length - 1;
					for (; index >= 0; index--) {
						if (nodes[index].setting) {
							break;
						}
					}
					const node = nodes[index];
					if (node) {
						nodes.splice(index, 1, {
							startOffset: node.startOffset,
							endOffset: node.endOffset,
							value: node.value,
							setting: {
								key: node.setting!.key,
								commaOffset: offset
							}
						});
					}
				}
			}
		},
		onComment: (offset: number, length: number) => {
			if (hierarchyLevel === 0) {
				nodes.push({
					startOffset: offset,
					endOffset: offset + length,
					value: content.substring(offset, offset + length),
				});
			}
		}
	};
	visit(content, visitor);
	return nodes;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/settingsSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/settingsSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../base/common/arrays.js';
import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { Event } from '../../../base/common/event.js';
import { URI } from '../../../base/common/uri.js';
import { localize } from '../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../configuration/common/configuration.js';
import { ConfigurationModelParser } from '../../configuration/common/configurationModels.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { ExtensionType } from '../../extensions/common/extensions.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../files/common/files.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractInitializer, AbstractJsonFileSynchroniser, IAcceptResult, IFileResourcePreview, IMergeResult } from './abstractSynchronizer.js';
import { getIgnoredSettings, isEmpty, merge, updateIgnoredSettings } from './settingsMerge.js';
import { Change, IRemoteUserData, IUserDataSyncLocalStoreService, IUserDataSyncConfiguration, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, IUserDataSyncUtilService, SyncResource, UserDataSyncError, UserDataSyncErrorCode, USER_DATA_SYNC_CONFIGURATION_SCOPE, USER_DATA_SYNC_SCHEME, getIgnoredSettingsForExtension, IUserData } from './userDataSync.js';

interface ISettingsResourcePreview extends IFileResourcePreview {
	previewResult: IMergeResult;
}

export interface ISettingsSyncContent {
	settings: string;
}

function isSettingsSyncContent(thing: any): thing is ISettingsSyncContent {
	return thing
		&& (thing.settings && typeof thing.settings === 'string')
		&& Object.keys(thing).length === 1;
}

export function parseSettingsSyncContent(syncContent: string): ISettingsSyncContent {
	const parsed = <ISettingsSyncContent>JSON.parse(syncContent);
	return isSettingsSyncContent(parsed) ? parsed : /* migrate */ { settings: syncContent };
}

export class SettingsSynchroniser extends AbstractJsonFileSynchroniser implements IUserDataSynchroniser {

	/* Version 2: Change settings from `sync.${setting}` to `settingsSync.{setting}` */
	protected readonly version: number = 2;
	readonly previewResource: URI = this.extUri.joinPath(this.syncPreviewFolder, 'settings.json');
	readonly baseResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' });
	readonly localResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' });
	readonly remoteResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' });
	readonly acceptedResource: URI = this.previewResource.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' });

	constructor(
		private readonly profile: IUserDataProfile,
		collection: string | undefined,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IUserDataSyncUtilService userDataSyncUtilService: IUserDataSyncUtilService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(profile.settingsResource, { syncResource: SyncResource.Settings, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, userDataSyncUtilService, configurationService, uriIdentityService);
	}

	async getRemoteUserDataSyncConfiguration(refOrLatestData: string | IUserData | null): Promise<IUserDataSyncConfiguration> {
		const lastSyncUserData = await this.getLastSyncUserData();
		const remoteUserData = await this.getLatestRemoteUserData(refOrLatestData, lastSyncUserData);
		const remoteSettingsSyncContent = this.getSettingsSyncContent(remoteUserData);
		const parser = new ConfigurationModelParser(USER_DATA_SYNC_CONFIGURATION_SCOPE, this.logService);
		if (remoteSettingsSyncContent?.settings) {
			parser.parse(remoteSettingsSyncContent.settings);
		}
		return parser.configurationModel.getValue(USER_DATA_SYNC_CONFIGURATION_SCOPE) || {};
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean): Promise<ISettingsResourcePreview[]> {
		const fileContent = await this.getLocalFileContent();
		const formattingOptions = await this.getFormattingOptions();
		const remoteSettingsSyncContent = this.getSettingsSyncContent(remoteUserData);

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSettingsSyncContent: ISettingsSyncContent | null = lastSyncUserData ? this.getSettingsSyncContent(lastSyncUserData) : null;
		const ignoredSettings = await this.getIgnoredSettings();

		let mergedContent: string | null = null;
		let hasLocalChanged: boolean = false;
		let hasRemoteChanged: boolean = false;
		let hasConflicts: boolean = false;

		if (remoteSettingsSyncContent) {
			let localContent: string = fileContent ? fileContent.value.toString().trim() : '{}';
			localContent = localContent || '{}';
			this.validateContent(localContent);
			this.logService.trace(`${this.syncResourceLogLabel}: Merging remote settings with local settings...`);
			const result = merge(localContent, remoteSettingsSyncContent.settings, lastSettingsSyncContent ? lastSettingsSyncContent.settings : null, ignoredSettings, [], formattingOptions);
			mergedContent = result.localContent || result.remoteContent;
			hasLocalChanged = result.localContent !== null;
			hasRemoteChanged = result.remoteContent !== null;
			hasConflicts = result.hasConflicts;
		}

		// First time syncing to remote
		else if (fileContent) {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote settings does not exist. Synchronizing settings for the first time.`);
			mergedContent = fileContent.value.toString().trim() || '{}';
			this.validateContent(mergedContent);
			hasRemoteChanged = true;
		}

		const localContent = fileContent ? fileContent.value.toString() : null;
		const baseContent = lastSettingsSyncContent?.settings ?? null;

		const previewResult = {
			content: hasConflicts ? baseContent : mergedContent,
			localChange: hasLocalChanged ? Change.Modified : Change.None,
			remoteChange: hasRemoteChanged ? Change.Modified : Change.None,
			hasConflicts
		};

		return [{
			fileContent,

			baseResource: this.baseResource,
			baseContent,

			localResource: this.localResource,
			localContent,
			localChange: previewResult.localChange,

			remoteResource: this.remoteResource,
			remoteContent: remoteSettingsSyncContent ? remoteSettingsSyncContent.settings : null,
			remoteChange: previewResult.remoteChange,

			previewResource: this.previewResource,
			previewResult,
			acceptedResource: this.acceptedResource,
		}];
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSettingsSyncContent: ISettingsSyncContent | null = this.getSettingsSyncContent(lastSyncUserData);
		if (lastSettingsSyncContent === null) {
			return true;
		}

		const fileContent = await this.getLocalFileContent();
		const localContent: string = fileContent ? fileContent.value.toString().trim() : '';
		const ignoredSettings = await this.getIgnoredSettings();
		const formattingOptions = await this.getFormattingOptions();
		const result = merge(localContent || '{}', lastSettingsSyncContent.settings, lastSettingsSyncContent.settings, ignoredSettings, [], formattingOptions);
		return result.remoteContent !== null;
	}

	protected async getMergeResult(resourcePreview: ISettingsResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		const formatUtils = await this.getFormattingOptions();
		const ignoredSettings = await this.getIgnoredSettings();
		return {
			...resourcePreview.previewResult,

			// remove ignored settings from the preview content
			content: resourcePreview.previewResult.content ? updateIgnoredSettings(resourcePreview.previewResult.content, '{}', ignoredSettings, formatUtils) : null
		};
	}

	protected async getAcceptResult(resourcePreview: ISettingsResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		const formattingOptions = await this.getFormattingOptions();
		const ignoredSettings = await this.getIgnoredSettings();

		/* Accept local resource */
		if (this.extUri.isEqual(resource, this.localResource)) {
			return {
				/* Remove ignored settings */
				content: resourcePreview.fileContent ? updateIgnoredSettings(resourcePreview.fileContent.value.toString(), '{}', ignoredSettings, formattingOptions) : null,
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
		}

		/* Accept remote resource */
		if (this.extUri.isEqual(resource, this.remoteResource)) {
			return {
				/* Update ignored settings from local file content */
				content: resourcePreview.remoteContent !== null ? updateIgnoredSettings(resourcePreview.remoteContent, resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : '{}', ignoredSettings, formattingOptions) : null,
				localChange: Change.Modified,
				remoteChange: Change.None,
			};
		}

		/* Accept preview resource */
		if (this.extUri.isEqual(resource, this.previewResource)) {
			if (content === undefined) {
				return {
					content: resourcePreview.previewResult.content,
					localChange: resourcePreview.previewResult.localChange,
					remoteChange: resourcePreview.previewResult.remoteChange,
				};
			} else {
				return {
					/* Add ignored settings from local file content */
					content: content !== null ? updateIgnoredSettings(content, resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : '{}', ignoredSettings, formattingOptions) : null,
					localChange: Change.Modified,
					remoteChange: Change.Modified,
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [ISettingsResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		const { fileContent } = resourcePreviews[0][0];
		let { content, localChange, remoteChange } = resourcePreviews[0][1];

		if (localChange === Change.None && remoteChange === Change.None) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing settings.`);
		}

		content = content ? content.trim() : '{}';
		content = content || '{}';
		this.validateContent(content);

		if (localChange !== Change.None) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating local settings...`);
			if (fileContent) {
				await this.backupLocal(JSON.stringify(this.toSettingsSyncContent(fileContent.value.toString())));
			}
			await this.updateLocalFileContent(content, fileContent, force);
			await this.configurationService.reloadConfiguration(ConfigurationTarget.USER_LOCAL);
			this.logService.info(`${this.syncResourceLogLabel}: Updated local settings`);
		}

		if (remoteChange !== Change.None) {
			const formatUtils = await this.getFormattingOptions();
			// Update ignored settings from remote
			const remoteSettingsSyncContent = this.getSettingsSyncContent(remoteUserData);
			const ignoredSettings = await this.getIgnoredSettings(content);
			content = updateIgnoredSettings(content, remoteSettingsSyncContent ? remoteSettingsSyncContent.settings : '{}', ignoredSettings, formatUtils);
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote settings...`);
			remoteUserData = await this.updateRemoteUserData(JSON.stringify(this.toSettingsSyncContent(content)), force ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote settings`);
		}

		// Delete the preview
		try {
			await this.fileService.del(this.previewResource);
		} catch (e) { /* ignore */ }

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized settings...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized settings`);
		}

	}

	async hasLocalData(): Promise<boolean> {
		try {
			const localFileContent = await this.getLocalFileContent();
			if (localFileContent) {
				return !isEmpty(localFileContent.value.toString());
			}
		} catch (error) {
			if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
				return true;
			}
		}
		return false;
	}

	async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqual(this.remoteResource, uri)
			|| this.extUri.isEqual(this.localResource, uri)
			|| this.extUri.isEqual(this.acceptedResource, uri)
			|| this.extUri.isEqual(this.baseResource, uri)
		) {
			return this.resolvePreviewContent(uri);
		}
		return null;
	}

	protected override async resolvePreviewContent(resource: URI): Promise<string | null> {
		let content = await super.resolvePreviewContent(resource);
		if (content) {
			const formatUtils = await this.getFormattingOptions();
			// remove ignored settings from the preview content
			const ignoredSettings = await this.getIgnoredSettings();
			content = updateIgnoredSettings(content, '{}', ignoredSettings, formatUtils);
		}
		return content;
	}

	private getSettingsSyncContent(remoteUserData: IRemoteUserData): ISettingsSyncContent | null {
		return remoteUserData.syncData ? this.parseSettingsSyncContent(remoteUserData.syncData.content) : null;
	}

	private parseSettingsSyncContent(syncContent: string): ISettingsSyncContent | null {
		try {
			return parseSettingsSyncContent(syncContent);
		} catch (e) {
			this.logService.error(e);
		}
		return null;
	}

	private toSettingsSyncContent(settings: string): ISettingsSyncContent {
		return { settings };
	}

	private coreIgnoredSettings: Promise<string[]> | undefined = undefined;
	private systemExtensionsIgnoredSettings: Promise<string[]> | undefined = undefined;
	private userExtensionsIgnoredSettings: Promise<string[]> | undefined = undefined;
	private async getIgnoredSettings(content?: string): Promise<string[]> {
		if (!this.coreIgnoredSettings) {
			this.coreIgnoredSettings = this.userDataSyncUtilService.resolveDefaultCoreIgnoredSettings();
		}
		if (!this.systemExtensionsIgnoredSettings) {
			this.systemExtensionsIgnoredSettings = this.getIgnoredSettingForSystemExtensions();
		}
		if (!this.userExtensionsIgnoredSettings) {
			this.userExtensionsIgnoredSettings = this.getIgnoredSettingForUserExtensions();
			const disposable = this._register(Event.any<any>(
				Event.filter(this.extensionManagementService.onDidInstallExtensions, (e => e.some(({ local }) => !!local))),
				Event.filter(this.extensionManagementService.onDidUninstallExtension, (e => !e.error)))(() => {
					disposable.dispose();
					this.userExtensionsIgnoredSettings = undefined;
				}));
		}
		const defaultIgnoredSettings = (await Promise.all([this.coreIgnoredSettings, this.systemExtensionsIgnoredSettings, this.userExtensionsIgnoredSettings])).flat();
		return getIgnoredSettings(defaultIgnoredSettings, this.configurationService, content);
	}

	private async getIgnoredSettingForSystemExtensions(): Promise<string[]> {
		const systemExtensions = await this.extensionManagementService.getInstalled(ExtensionType.System);
		return distinct(systemExtensions.map(e => getIgnoredSettingsForExtension(e.manifest)).flat());
	}

	private async getIgnoredSettingForUserExtensions(): Promise<string[]> {
		const userExtensions = await this.extensionManagementService.getInstalled(ExtensionType.User, this.profile.extensionsResource);
		return distinct(userExtensions.map(e => getIgnoredSettingsForExtension(e.manifest)).flat());
	}

	private validateContent(content: string): void {
		if (this.hasErrors(content, false)) {
			throw new UserDataSyncError(localize('errorInvalidSettings', "Unable to sync settings as there are errors/warning in settings file."), UserDataSyncErrorCode.LocalInvalidContent, this.resource);
		}
	}

}

export class SettingsInitializer extends AbstractInitializer {

	constructor(
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.Settings, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const settingsSyncContent = remoteUserData.syncData ? this.parseSettingsSyncContent(remoteUserData.syncData.content) : null;
		if (!settingsSyncContent) {
			this.logService.info('Skipping initializing settings because remote settings does not exist.');
			return;
		}

		const isEmpty = await this.isEmpty();
		if (!isEmpty) {
			this.logService.info('Skipping initializing settings because local settings exist.');
			return;
		}

		await this.fileService.writeFile(this.userDataProfilesService.defaultProfile.settingsResource, VSBuffer.fromString(settingsSyncContent.settings));

		await this.updateLastSyncUserData(remoteUserData);
	}

	private async isEmpty(): Promise<boolean> {
		try {
			const fileContent = await this.fileService.readFile(this.userDataProfilesService.defaultProfile.settingsResource);
			return isEmpty(fileContent.value.toString().trim());
		} catch (error) {
			return (<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND;
		}
	}

	private parseSettingsSyncContent(syncContent: string): ISettingsSyncContent | null {
		try {
			return parseSettingsSyncContent(syncContent);
		} catch (e) {
			this.logService.error(e);
		}
		return null;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/snippetsMerge.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/snippetsMerge.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IStringDictionary } from '../../../base/common/collections.js';

export interface IMergeResult {
	local: {
		added: IStringDictionary<string>;
		updated: IStringDictionary<string>;
		removed: string[];
	};
	remote: {
		added: IStringDictionary<string>;
		updated: IStringDictionary<string>;
		removed: string[];
	};
	conflicts: string[];
}

export function merge(local: IStringDictionary<string>, remote: IStringDictionary<string> | null, base: IStringDictionary<string> | null): IMergeResult {
	const localAdded: IStringDictionary<string> = {};
	const localUpdated: IStringDictionary<string> = {};
	const localRemoved: Set<string> = new Set<string>();

	if (!remote) {
		return {
			local: { added: localAdded, updated: localUpdated, removed: [...localRemoved.values()] },
			remote: { added: local, updated: {}, removed: [] },
			conflicts: []
		};
	}

	const localToRemote = compare(local, remote);
	if (localToRemote.added.size === 0 && localToRemote.removed.size === 0 && localToRemote.updated.size === 0) {
		// No changes found between local and remote.
		return {
			local: { added: localAdded, updated: localUpdated, removed: [...localRemoved.values()] },
			remote: { added: {}, updated: {}, removed: [] },
			conflicts: []
		};
	}

	const baseToLocal = compare(base, local);
	const baseToRemote = compare(base, remote);

	const remoteAdded: IStringDictionary<string> = {};
	const remoteUpdated: IStringDictionary<string> = {};
	const remoteRemoved: Set<string> = new Set<string>();

	const conflicts: Set<string> = new Set<string>();

	// Removed snippets in Local
	for (const key of baseToLocal.removed.values()) {
		// Conflict - Got updated in remote.
		if (baseToRemote.updated.has(key)) {
			// Add to local
			localAdded[key] = remote[key];
		}
		// Remove it in remote
		else {
			remoteRemoved.add(key);
		}
	}

	// Removed snippets in Remote
	for (const key of baseToRemote.removed.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Conflict - Got updated in local
		if (baseToLocal.updated.has(key)) {
			conflicts.add(key);
		}
		// Also remove in Local
		else {
			localRemoved.add(key);
		}
	}

	// Updated snippets in Local
	for (const key of baseToLocal.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in remote
		if (baseToRemote.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			remoteUpdated[key] = local[key];
		}
	}

	// Updated snippets in Remote
	for (const key of baseToRemote.updated.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got updated in local
		if (baseToLocal.updated.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else if (local[key] !== undefined) {
			localUpdated[key] = remote[key];
		}
	}

	// Added snippets in Local
	for (const key of baseToLocal.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in remote
		if (baseToRemote.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			remoteAdded[key] = local[key];
		}
	}

	// Added snippets in remote
	for (const key of baseToRemote.added.values()) {
		if (conflicts.has(key)) {
			continue;
		}
		// Got added in local
		if (baseToLocal.added.has(key)) {
			// Has different value
			if (localToRemote.updated.has(key)) {
				conflicts.add(key);
			}
		} else {
			localAdded[key] = remote[key];
		}
	}

	return {
		local: { added: localAdded, removed: [...localRemoved.values()], updated: localUpdated },
		remote: { added: remoteAdded, removed: [...remoteRemoved.values()], updated: remoteUpdated },
		conflicts: [...conflicts.values()],
	};
}

function compare(from: IStringDictionary<string> | null, to: IStringDictionary<string> | null): { added: Set<string>; removed: Set<string>; updated: Set<string> } {
	const fromKeys = from ? Object.keys(from) : [];
	const toKeys = to ? Object.keys(to) : [];
	const added = toKeys.filter(key => !fromKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const removed = fromKeys.filter(key => !toKeys.includes(key)).reduce((r, key) => { r.add(key); return r; }, new Set<string>());
	const updated: Set<string> = new Set<string>();

	for (const key of fromKeys) {
		if (removed.has(key)) {
			continue;
		}
		const fromSnippet = from![key];
		const toSnippet = to![key];
		if (fromSnippet !== toSnippet) {
			updated.add(key);
		}
	}

	return { added, removed, updated };
}

export function areSame(a: IStringDictionary<string>, b: IStringDictionary<string>): boolean {
	const { added, removed, updated } = compare(a, b);
	return added.size === 0 && removed.size === 0 && updated.size === 0;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/snippetsSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/snippetsSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { CancellationToken } from '../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../base/common/collections.js';
import { Event } from '../../../base/common/event.js';
import { deepClone } from '../../../base/common/objects.js';
import { URI } from '../../../base/common/uri.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { FileOperationError, FileOperationResult, IFileContent, IFileService, IFileStat } from '../../files/common/files.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractInitializer, AbstractSynchroniser, IAcceptResult, IFileResourcePreview, IMergeResult } from './abstractSynchronizer.js';
import { areSame, IMergeResult as ISnippetsMergeResult, merge } from './snippetsMerge.js';
import { Change, IRemoteUserData, ISyncData, IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource, USER_DATA_SYNC_SCHEME } from './userDataSync.js';

interface ISnippetsResourcePreview extends IFileResourcePreview {
	previewResult: IMergeResult;
}

interface ISnippetsAcceptedResourcePreview extends IFileResourcePreview {
	acceptResult: IAcceptResult;
}

export function parseSnippets(syncData: ISyncData): IStringDictionary<string> {
	return JSON.parse(syncData.content);
}

export class SnippetsSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {

	protected readonly version: number = 1;
	private readonly snippetsFolder: URI;

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@IStorageService storageService: IStorageService,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super({ syncResource: SyncResource.Snippets, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
		this.snippetsFolder = profile.snippetsHome;
		this._register(this.fileService.watch(environmentService.userRoamingDataHome));
		this._register(this.fileService.watch(this.snippetsFolder));
		this._register(Event.filter(this.fileService.onDidFilesChange, e => e.affects(this.snippetsFolder))(() => this.triggerLocalChange()));
	}

	protected async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean): Promise<ISnippetsResourcePreview[]> {
		const local = await this.getSnippetsFileContents();
		const localSnippets = this.toSnippetsContents(local);
		const remoteSnippets: IStringDictionary<string> | null = remoteUserData.syncData ? this.parseSnippets(remoteUserData.syncData) : null;

		// Use remote data as last sync data if last sync data does not exist and remote data is from same machine
		lastSyncUserData = lastSyncUserData === null && isRemoteDataFromCurrentMachine ? remoteUserData : lastSyncUserData;
		const lastSyncSnippets: IStringDictionary<string> | null = lastSyncUserData && lastSyncUserData.syncData ? this.parseSnippets(lastSyncUserData.syncData) : null;

		if (remoteSnippets) {
			this.logService.trace(`${this.syncResourceLogLabel}: Merging remote snippets with local snippets...`);
		} else {
			this.logService.trace(`${this.syncResourceLogLabel}: Remote snippets does not exist. Synchronizing snippets for the first time.`);
		}

		const mergeResult = merge(localSnippets, remoteSnippets, lastSyncSnippets);
		return this.getResourcePreviews(mergeResult, local, remoteSnippets || {}, lastSyncSnippets || {});
	}

	protected async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		const lastSyncSnippets: IStringDictionary<string> | null = lastSyncUserData.syncData ? this.parseSnippets(lastSyncUserData.syncData) : null;
		if (lastSyncSnippets === null) {
			return true;
		}
		const local = await this.getSnippetsFileContents();
		const localSnippets = this.toSnippetsContents(local);
		const mergeResult = merge(localSnippets, lastSyncSnippets, lastSyncSnippets);
		return Object.keys(mergeResult.remote.added).length > 0 || Object.keys(mergeResult.remote.updated).length > 0 || mergeResult.remote.removed.length > 0 || mergeResult.conflicts.length > 0;
	}

	protected async getMergeResult(resourcePreview: ISnippetsResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		return resourcePreview.previewResult;
	}

	protected async getAcceptResult(resourcePreview: ISnippetsResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {

		/* Accept local resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }))) {
			return {
				content: resourcePreview.fileContent ? resourcePreview.fileContent.value.toString() : null,
				localChange: Change.None,
				remoteChange: resourcePreview.fileContent
					? resourcePreview.remoteContent !== null ? Change.Modified : Change.Added
					: Change.Deleted
			};
		}

		/* Accept remote resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }))) {
			return {
				content: resourcePreview.remoteContent,
				localChange: resourcePreview.remoteContent !== null
					? resourcePreview.fileContent ? Change.Modified : Change.Added
					: Change.Deleted,
				remoteChange: Change.None,
			};
		}

		/* Accept preview resource */
		if (this.extUri.isEqualOrParent(resource, this.syncPreviewFolder)) {
			if (content === undefined) {
				return {
					content: resourcePreview.previewResult.content,
					localChange: resourcePreview.previewResult.localChange,
					remoteChange: resourcePreview.previewResult.remoteChange,
				};
			} else {
				return {
					content,
					localChange: content === null
						? resourcePreview.fileContent !== null ? Change.Deleted : Change.None
						: Change.Modified,
					remoteChange: content === null
						? resourcePreview.remoteContent !== null ? Change.Deleted : Change.None
						: Change.Modified
				};
			}
		}

		throw new Error(`Invalid Resource: ${resource.toString()}`);
	}

	protected async applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, resourcePreviews: [ISnippetsResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		const accptedResourcePreviews: ISnippetsAcceptedResourcePreview[] = resourcePreviews.map(([resourcePreview, acceptResult]) => ({ ...resourcePreview, acceptResult }));
		if (accptedResourcePreviews.every(({ localChange, remoteChange }) => localChange === Change.None && remoteChange === Change.None)) {
			this.logService.info(`${this.syncResourceLogLabel}: No changes found during synchronizing snippets.`);
		}

		if (accptedResourcePreviews.some(({ localChange }) => localChange !== Change.None)) {
			// back up all snippets
			await this.updateLocalBackup(accptedResourcePreviews);
			await this.updateLocalSnippets(accptedResourcePreviews, force);
		}

		if (accptedResourcePreviews.some(({ remoteChange }) => remoteChange !== Change.None)) {
			remoteUserData = await this.updateRemoteSnippets(accptedResourcePreviews, remoteUserData, force);
		}

		if (lastSyncUserData?.ref !== remoteUserData.ref) {
			// update last sync
			this.logService.trace(`${this.syncResourceLogLabel}: Updating last synchronized snippets...`);
			await this.updateLastSyncUserData(remoteUserData);
			this.logService.info(`${this.syncResourceLogLabel}: Updated last synchronized snippets`);
		}

		for (const { previewResource } of accptedResourcePreviews) {
			// Delete the preview
			try {
				await this.fileService.del(previewResource);
			} catch (e) { /* ignore */ }
		}

	}

	private getResourcePreviews(snippetsMergeResult: ISnippetsMergeResult, localFileContent: IStringDictionary<IFileContent>, remoteSnippets: IStringDictionary<string>, baseSnippets: IStringDictionary<string>): ISnippetsResourcePreview[] {
		const resourcePreviews: Map<string, ISnippetsResourcePreview> = new Map<string, ISnippetsResourcePreview>();

		/* Snippets added remotely -> add locally */
		for (const key of Object.keys(snippetsMergeResult.local.added)) {
			const previewResult: IMergeResult = {
				content: snippetsMergeResult.local.added[key],
				hasConflicts: false,
				localChange: Change.Added,
				remoteChange: Change.None,
			};
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: null,
				fileContent: null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				localContent: null,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remoteSnippets[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets updated remotely -> update locally */
		for (const key of Object.keys(snippetsMergeResult.local.updated)) {
			const previewResult: IMergeResult = {
				content: snippetsMergeResult.local.updated[key],
				hasConflicts: false,
				localChange: Change.Modified,
				remoteChange: Change.None,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remoteSnippets[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets removed remotely -> remove locally */
		for (const key of snippetsMergeResult.local.removed) {
			const previewResult: IMergeResult = {
				content: null,
				hasConflicts: false,
				localChange: Change.Deleted,
				remoteChange: Change.None,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets added locally -> add remotely */
		for (const key of Object.keys(snippetsMergeResult.remote.added)) {
			const previewResult: IMergeResult = {
				content: snippetsMergeResult.remote.added[key],
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Added,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets updated locally -> update remotely */
		for (const key of Object.keys(snippetsMergeResult.remote.updated)) {
			const previewResult: IMergeResult = {
				content: snippetsMergeResult.remote.updated[key],
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Modified,
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key],
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remoteSnippets[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets removed locally -> remove remotely */
		for (const key of snippetsMergeResult.remote.removed) {
			const previewResult: IMergeResult = {
				content: null,
				hasConflicts: false,
				localChange: Change.None,
				remoteChange: Change.Deleted,
			};
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: null,
				localContent: null,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remoteSnippets[key],
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Snippets with conflicts */
		for (const key of snippetsMergeResult.conflicts) {
			const previewResult: IMergeResult = {
				content: baseSnippets[key] ?? null,
				hasConflicts: true,
				localChange: localFileContent[key] ? Change.Modified : Change.Added,
				remoteChange: remoteSnippets[key] ? Change.Modified : Change.Added
			};
			const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
			resourcePreviews.set(key, {
				baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
				baseContent: baseSnippets[key] ?? null,
				localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
				fileContent: localFileContent[key] || null,
				localContent,
				remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
				remoteContent: remoteSnippets[key] || null,
				previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
				previewResult,
				localChange: previewResult.localChange,
				remoteChange: previewResult.remoteChange,
				acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
			});
		}

		/* Unmodified Snippets */
		for (const key of Object.keys(localFileContent)) {
			if (!resourcePreviews.has(key)) {
				const previewResult: IMergeResult = {
					content: localFileContent[key] ? localFileContent[key].value.toString() : null,
					hasConflicts: false,
					localChange: Change.None,
					remoteChange: Change.None
				};
				const localContent = localFileContent[key] ? localFileContent[key].value.toString() : null;
				resourcePreviews.set(key, {
					baseResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }),
					baseContent: baseSnippets[key] ?? null,
					localResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }),
					fileContent: localFileContent[key] || null,
					localContent,
					remoteResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }),
					remoteContent: remoteSnippets[key] || null,
					previewResource: this.extUri.joinPath(this.syncPreviewFolder, key),
					previewResult,
					localChange: previewResult.localChange,
					remoteChange: previewResult.remoteChange,
					acceptedResource: this.extUri.joinPath(this.syncPreviewFolder, key).with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' })
				});
			}
		}

		return [...resourcePreviews.values()];
	}

	override async resolveContent(uri: URI): Promise<string | null> {
		if (this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'remote' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'local' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'base' }))
			|| this.extUri.isEqualOrParent(uri, this.syncPreviewFolder.with({ scheme: USER_DATA_SYNC_SCHEME, authority: 'accepted' }))) {
			return this.resolvePreviewContent(uri);
		}
		return null;
	}

	async hasLocalData(): Promise<boolean> {
		try {
			const localSnippets = await this.getSnippetsFileContents();
			if (Object.keys(localSnippets).length) {
				return true;
			}
		} catch (error) {
			/* ignore error */
		}
		return false;
	}

	private async updateLocalBackup(resourcePreviews: IFileResourcePreview[]): Promise<void> {
		const local: IStringDictionary<IFileContent> = {};
		for (const resourcePreview of resourcePreviews) {
			if (resourcePreview.fileContent) {
				local[this.extUri.basename(resourcePreview.localResource)] = resourcePreview.fileContent;
			}
		}
		await this.backupLocal(JSON.stringify(this.toSnippetsContents(local)));
	}

	private async updateLocalSnippets(resourcePreviews: ISnippetsAcceptedResourcePreview[], force: boolean): Promise<void> {
		for (const { fileContent, acceptResult, localResource, remoteResource, localChange } of resourcePreviews) {
			if (localChange !== Change.None) {
				const key = remoteResource ? this.extUri.basename(remoteResource) : this.extUri.basename(localResource);
				const resource = this.extUri.joinPath(this.snippetsFolder, key);

				// Removed
				if (localChange === Change.Deleted) {
					this.logService.trace(`${this.syncResourceLogLabel}: Deleting snippet...`, this.extUri.basename(resource));
					await this.fileService.del(resource);
					this.logService.info(`${this.syncResourceLogLabel}: Deleted snippet`, this.extUri.basename(resource));
				}

				// Added
				else if (localChange === Change.Added) {
					this.logService.trace(`${this.syncResourceLogLabel}: Creating snippet...`, this.extUri.basename(resource));
					await this.fileService.createFile(resource, VSBuffer.fromString(acceptResult.content!), { overwrite: force });
					this.logService.info(`${this.syncResourceLogLabel}: Created snippet`, this.extUri.basename(resource));
				}

				// Updated
				else {
					this.logService.trace(`${this.syncResourceLogLabel}: Updating snippet...`, this.extUri.basename(resource));
					await this.fileService.writeFile(resource, VSBuffer.fromString(acceptResult.content!), force ? undefined : fileContent!);
					this.logService.info(`${this.syncResourceLogLabel}: Updated snippet`, this.extUri.basename(resource));
				}
			}
		}
	}

	private async updateRemoteSnippets(resourcePreviews: ISnippetsAcceptedResourcePreview[], remoteUserData: IRemoteUserData, forcePush: boolean): Promise<IRemoteUserData> {
		const currentSnippets: IStringDictionary<string> = remoteUserData.syncData ? this.parseSnippets(remoteUserData.syncData) : {};
		const newSnippets: IStringDictionary<string> = deepClone(currentSnippets);

		for (const { acceptResult, localResource, remoteResource, remoteChange } of resourcePreviews) {
			if (remoteChange !== Change.None) {
				const key = localResource ? this.extUri.basename(localResource) : this.extUri.basename(remoteResource);
				if (remoteChange === Change.Deleted) {
					delete newSnippets[key];
				} else {
					newSnippets[key] = acceptResult.content!;
				}
			}
		}

		if (!areSame(currentSnippets, newSnippets)) {
			// update remote
			this.logService.trace(`${this.syncResourceLogLabel}: Updating remote snippets...`);
			remoteUserData = await this.updateRemoteUserData(JSON.stringify(newSnippets), forcePush ? null : remoteUserData.ref);
			this.logService.info(`${this.syncResourceLogLabel}: Updated remote snippets`);
		}
		return remoteUserData;
	}

	private parseSnippets(syncData: ISyncData): IStringDictionary<string> {
		return parseSnippets(syncData);
	}

	private toSnippetsContents(snippetsFileContents: IStringDictionary<IFileContent>): IStringDictionary<string> {
		const snippets: IStringDictionary<string> = {};
		for (const key of Object.keys(snippetsFileContents)) {
			snippets[key] = snippetsFileContents[key].value.toString();
		}
		return snippets;
	}

	private async getSnippetsFileContents(): Promise<IStringDictionary<IFileContent>> {
		const snippets: IStringDictionary<IFileContent> = {};
		let stat: IFileStat;
		try {
			stat = await this.fileService.resolve(this.snippetsFolder);
		} catch (e) {
			// No snippets
			if (e instanceof FileOperationError && e.fileOperationResult === FileOperationResult.FILE_NOT_FOUND) {
				return snippets;
			} else {
				throw e;
			}
		}
		for (const entry of stat.children || []) {
			const resource = entry.resource;
			const extension = this.extUri.extname(resource);
			if (extension === '.json' || extension === '.code-snippets') {
				const key = this.extUri.relativePath(this.snippetsFolder, resource)!;
				const content = await this.fileService.readFile(resource);
				snippets[key] = content;
			}
		}
		return snippets;
	}
}

export class SnippetsInitializer extends AbstractInitializer {

	constructor(
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.Snippets, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const remoteSnippets: IStringDictionary<string> | null = remoteUserData.syncData ? JSON.parse(remoteUserData.syncData.content) : null;
		if (!remoteSnippets) {
			this.logService.info('Skipping initializing snippets because remote snippets does not exist.');
			return;
		}

		const isEmpty = await this.isEmpty();
		if (!isEmpty) {
			this.logService.info('Skipping initializing snippets because local snippets exist.');
			return;
		}

		for (const key of Object.keys(remoteSnippets)) {
			const content = remoteSnippets[key];
			if (content) {
				const resource = this.extUri.joinPath(this.userDataProfilesService.defaultProfile.snippetsHome, key);
				await this.fileService.createFile(resource, VSBuffer.fromString(content));
				this.logService.info('Created snippet', this.extUri.basename(resource));
			}
		}

		await this.updateLastSyncUserData(remoteUserData);
	}

	private async isEmpty(): Promise<boolean> {
		try {
			const stat = await this.fileService.resolve(this.userDataProfilesService.defaultProfile.snippetsHome);
			return !stat.children?.length;
		} catch (error) {
			return (<FileOperationError>error).fileOperationResult === FileOperationResult.FILE_NOT_FOUND;
		}
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/platform/userDataSync/common/tasksSync.ts]---
Location: vscode-main/src/vs/platform/userDataSync/common/tasksSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../base/common/buffer.js';
import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { IFileService } from '../../files/common/files.js';
import { ILogService } from '../../log/common/log.js';
import { IStorageService } from '../../storage/common/storage.js';
import { ITelemetryService } from '../../telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../uriIdentity/common/uriIdentity.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../userDataProfile/common/userDataProfile.js';
import { AbstractJsonSynchronizer } from './abstractJsonSynchronizer.js';
import { AbstractInitializer } from './abstractSynchronizer.js';
import { IRemoteUserData, IUserDataSyncLocalStoreService, IUserDataSynchroniser, IUserDataSyncLogService, IUserDataSyncEnablementService, IUserDataSyncStoreService, SyncResource } from './userDataSync.js';

interface ITasksSyncContent {
	tasks?: string;
}

export function getTasksContentFromSyncContent(syncContent: string, logService: ILogService): string | null {
	try {
		const parsed = <ITasksSyncContent>JSON.parse(syncContent);
		return parsed.tasks ?? null;
	} catch (e) {
		logService.error(e);
		return null;
	}
}

export class TasksSynchroniser extends AbstractJsonSynchronizer implements IUserDataSynchroniser {

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		@IUserDataSyncStoreService userDataSyncStoreService: IUserDataSyncStoreService,
		@IUserDataSyncLocalStoreService userDataSyncLocalStoreService: IUserDataSyncLocalStoreService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IConfigurationService configurationService: IConfigurationService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IStorageService storageService: IStorageService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(profile.tasksResource, { syncResource: SyncResource.Tasks, profile }, collection, 'tasks.json', fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
	}

	protected getContentFromSyncContent(syncContent: string): string | null {
		return getTasksContentFromSyncContent(syncContent, this.logService);
	}

	protected toSyncContent(tasks: string | null): ITasksSyncContent {
		return tasks ? { tasks } : {};
	}
}

export class TasksInitializer extends AbstractInitializer {

	private tasksResource = this.userDataProfilesService.defaultProfile.tasksResource;

	constructor(
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IUserDataSyncLogService logService: IUserDataSyncLogService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(SyncResource.Tasks, userDataProfilesService, environmentService, logService, fileService, storageService, uriIdentityService);
	}

	protected async doInitialize(remoteUserData: IRemoteUserData): Promise<void> {
		const tasksContent = remoteUserData.syncData ? getTasksContentFromSyncContent(remoteUserData.syncData.content, this.logService) : null;
		if (!tasksContent) {
			this.logService.info('Skipping initializing tasks because remote tasks does not exist.');
			return;
		}

		const isEmpty = await this.isEmpty();
		if (!isEmpty) {
			this.logService.info('Skipping initializing tasks because local tasks exist.');
			return;
		}

		await this.fileService.writeFile(this.tasksResource, VSBuffer.fromString(tasksContent));

		await this.updateLastSyncUserData(remoteUserData);
	}

	private async isEmpty(): Promise<boolean> {
		return this.fileService.exists(this.tasksResource);
	}

}
```

--------------------------------------------------------------------------------

````
