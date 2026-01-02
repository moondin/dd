---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 506
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 506 of 552)

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

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event, EventMultiplexer } from '../../../../base/common/event.js';
import {
	ILocalExtension, IGalleryExtension, IExtensionIdentifier, IExtensionsControlManifest, IExtensionGalleryService, InstallOptions, UninstallOptions, InstallExtensionResult, ExtensionManagementError, ExtensionManagementErrorCode, Metadata, InstallOperation, EXTENSION_INSTALL_SOURCE_CONTEXT, InstallExtensionInfo,
	IProductVersion,
	ExtensionInstallSource,
	DidUpdateExtensionMetadata,
	UninstallExtensionInfo,
	IAllowedExtensionsService,
	EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT,
} from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { DidChangeProfileForServerEvent, DidUninstallExtensionOnServerEvent, IExtensionManagementServer, IExtensionManagementServerService, InstallExtensionOnServerEvent, IPublisherInfo, IResourceExtension, IWorkbenchExtensionManagementService, UninstallExtensionOnServerEvent } from './extensionManagement.js';
import { ExtensionType, isLanguagePackExtension, IExtensionManifest, getWorkspaceSupportTypeMessage, TargetPlatform } from '../../../../platform/extensions/common/extensions.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { areSameExtensions, computeTargetPlatform } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { localize } from '../../../../nls.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Schemas } from '../../../../base/common/network.js';
import { IDownloadService } from '../../../../platform/download/common/download.js';
import { coalesce, distinct, isNonEmptyArray } from '../../../../base/common/arrays.js';
import { IDialogService, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import Severity from '../../../../base/common/severity.js';
import { IUserDataSyncEnablementService, SyncResource } from '../../../../platform/userDataSync/common/userDataSync.js';
import { Promises } from '../../../../base/common/async.js';
import { IWorkspaceTrustRequestService, WorkspaceTrustRequestButton } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { isString, isUndefined } from '../../../../base/common/types.js';
import { FileChangesEvent, IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationError, getErrorMessage } from '../../../../base/common/errors.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IExtensionsScannerService, IScannedExtension } from '../../../../platform/extensionManagement/common/extensionsScannerService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { createCommandUri, IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { verifiedPublisherIcon } from './extensionsIcons.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { CommontExtensionManagementService } from '../../../../platform/extensionManagement/common/abstractExtensionManagementService.js';

const TrustedPublishersStorageKey = 'extensions.trustedPublishers';

function isGalleryExtension(extension: IResourceExtension | IGalleryExtension): extension is IGalleryExtension {
	return extension.type === 'gallery';
}

export class ExtensionManagementService extends CommontExtensionManagementService implements IWorkbenchExtensionManagementService {

	declare readonly _serviceBrand: undefined;

	private readonly defaultTrustedPublishers: readonly string[];

	private readonly _onInstallExtension = this._register(new Emitter<InstallExtensionOnServerEvent>());
	readonly onInstallExtension: Event<InstallExtensionOnServerEvent>;

	private readonly _onDidInstallExtensions = this._register(new Emitter<readonly InstallExtensionResult[]>());
	readonly onDidInstallExtensions: Event<readonly InstallExtensionResult[]>;

	private readonly _onUninstallExtension = this._register(new Emitter<UninstallExtensionOnServerEvent>());
	readonly onUninstallExtension: Event<UninstallExtensionOnServerEvent>;

	private readonly _onDidUninstallExtension = this._register(new Emitter<DidUninstallExtensionOnServerEvent>());
	readonly onDidUninstallExtension: Event<DidUninstallExtensionOnServerEvent>;

	readonly onDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;

	private readonly _onDidProfileAwareInstallExtensions = this._register(new Emitter<readonly InstallExtensionResult[]>());
	readonly onProfileAwareDidInstallExtensions: Event<readonly InstallExtensionResult[]>;

	private readonly _onDidProfileAwareUninstallExtension = this._register(new Emitter<DidUninstallExtensionOnServerEvent>());
	readonly onProfileAwareDidUninstallExtension: Event<DidUninstallExtensionOnServerEvent>;

	readonly onProfileAwareDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;

	readonly onDidChangeProfile: Event<DidChangeProfileForServerEvent>;

	readonly onDidEnableExtensions: Event<ILocalExtension[]>;

	protected readonly servers: IExtensionManagementServer[] = [];

	private readonly workspaceExtensionManagementService: WorkspaceExtensionsManagementService;

	constructor(
		@IExtensionManagementServerService protected readonly extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IConfigurationService protected readonly configurationService: IConfigurationService,
		@IProductService productService: IProductService,
		@IDownloadService protected readonly downloadService: IDownloadService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IExtensionsScannerService private readonly extensionsScannerService: IExtensionsScannerService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IStorageService private readonly storageService: IStorageService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super(productService, allowedExtensionsService);

		this.defaultTrustedPublishers = productService.trustedExtensionPublishers ?? [];
		this.workspaceExtensionManagementService = this._register(this.instantiationService.createInstance(WorkspaceExtensionsManagementService));
		this.onDidEnableExtensions = this.workspaceExtensionManagementService.onDidChangeInvalidExtensions;

		if (this.extensionManagementServerService.localExtensionManagementServer) {
			this.servers.push(this.extensionManagementServerService.localExtensionManagementServer);
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			this.servers.push(this.extensionManagementServerService.remoteExtensionManagementServer);
		}
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			this.servers.push(this.extensionManagementServerService.webExtensionManagementServer);
		}

		const onInstallExtensionEventMultiplexer = this._register(new EventMultiplexer<InstallExtensionOnServerEvent>());
		this._register(onInstallExtensionEventMultiplexer.add(this._onInstallExtension.event));
		this.onInstallExtension = onInstallExtensionEventMultiplexer.event;

		const onDidInstallExtensionsEventMultiplexer = this._register(new EventMultiplexer<readonly InstallExtensionResult[]>());
		this._register(onDidInstallExtensionsEventMultiplexer.add(this._onDidInstallExtensions.event));
		this.onDidInstallExtensions = onDidInstallExtensionsEventMultiplexer.event;

		const onDidProfileAwareInstallExtensionsEventMultiplexer = this._register(new EventMultiplexer<readonly InstallExtensionResult[]>());
		this._register(onDidProfileAwareInstallExtensionsEventMultiplexer.add(this._onDidProfileAwareInstallExtensions.event));
		this.onProfileAwareDidInstallExtensions = onDidProfileAwareInstallExtensionsEventMultiplexer.event;

		const onUninstallExtensionEventMultiplexer = this._register(new EventMultiplexer<UninstallExtensionOnServerEvent>());
		this._register(onUninstallExtensionEventMultiplexer.add(this._onUninstallExtension.event));
		this.onUninstallExtension = onUninstallExtensionEventMultiplexer.event;

		const onDidUninstallExtensionEventMultiplexer = this._register(new EventMultiplexer<DidUninstallExtensionOnServerEvent>());
		this._register(onDidUninstallExtensionEventMultiplexer.add(this._onDidUninstallExtension.event));
		this.onDidUninstallExtension = onDidUninstallExtensionEventMultiplexer.event;

		const onDidProfileAwareUninstallExtensionEventMultiplexer = this._register(new EventMultiplexer<DidUninstallExtensionOnServerEvent>());
		this._register(onDidProfileAwareUninstallExtensionEventMultiplexer.add(this._onDidProfileAwareUninstallExtension.event));
		this.onProfileAwareDidUninstallExtension = onDidProfileAwareUninstallExtensionEventMultiplexer.event;

		const onDidUpdateExtensionMetadaEventMultiplexer = this._register(new EventMultiplexer<DidUpdateExtensionMetadata>());
		this.onDidUpdateExtensionMetadata = onDidUpdateExtensionMetadaEventMultiplexer.event;

		const onDidProfileAwareUpdateExtensionMetadaEventMultiplexer = this._register(new EventMultiplexer<DidUpdateExtensionMetadata>());
		this.onProfileAwareDidUpdateExtensionMetadata = onDidProfileAwareUpdateExtensionMetadaEventMultiplexer.event;

		const onDidChangeProfileEventMultiplexer = this._register(new EventMultiplexer<DidChangeProfileForServerEvent>());
		this.onDidChangeProfile = onDidChangeProfileEventMultiplexer.event;

		for (const server of this.servers) {
			this._register(onInstallExtensionEventMultiplexer.add(Event.map(server.extensionManagementService.onInstallExtension, e => ({ ...e, server }))));
			this._register(onDidInstallExtensionsEventMultiplexer.add(server.extensionManagementService.onDidInstallExtensions));
			this._register(onDidProfileAwareInstallExtensionsEventMultiplexer.add(server.extensionManagementService.onProfileAwareDidInstallExtensions));
			this._register(onUninstallExtensionEventMultiplexer.add(Event.map(server.extensionManagementService.onUninstallExtension, e => ({ ...e, server }))));
			this._register(onDidUninstallExtensionEventMultiplexer.add(Event.map(server.extensionManagementService.onDidUninstallExtension, e => ({ ...e, server }))));
			this._register(onDidProfileAwareUninstallExtensionEventMultiplexer.add(Event.map(server.extensionManagementService.onProfileAwareDidUninstallExtension, e => ({ ...e, server }))));
			this._register(onDidUpdateExtensionMetadaEventMultiplexer.add(server.extensionManagementService.onDidUpdateExtensionMetadata));
			this._register(onDidProfileAwareUpdateExtensionMetadaEventMultiplexer.add(server.extensionManagementService.onProfileAwareDidUpdateExtensionMetadata));
			this._register(onDidChangeProfileEventMultiplexer.add(Event.map(server.extensionManagementService.onDidChangeProfile, e => ({ ...e, server }))));
		}

		this._register(this.onProfileAwareDidInstallExtensions(results => {
			const untrustedPublishers = new Map<string, IPublisherInfo>();
			for (const result of results) {
				if (result.local && result.source && !URI.isUri(result.source) && !this.isPublisherTrusted(result.source)) {
					untrustedPublishers.set(result.source.publisher, { publisher: result.source.publisher, publisherDisplayName: result.source.publisherDisplayName });
				}
			}
			if (untrustedPublishers.size) {
				this.trustPublishers(...untrustedPublishers.values());
			}
		}));
	}

	async getInstalled(type?: ExtensionType, profileLocation?: URI, productVersion?: IProductVersion): Promise<ILocalExtension[]> {
		const result: ILocalExtension[] = [];
		await Promise.all(this.servers.map(async server => {
			const installed = await server.extensionManagementService.getInstalled(type, profileLocation, productVersion);
			if (server === this.getWorkspaceExtensionsServer()) {
				const workspaceExtensions = await this.getInstalledWorkspaceExtensions(true);
				installed.push(...workspaceExtensions);
			}
			result.push(...installed);
		}));
		return result;
	}

	uninstall(extension: ILocalExtension, options: UninstallOptions): Promise<void> {
		return this.uninstallExtensions([{ extension, options }]);
	}

	async uninstallExtensions(extensions: UninstallExtensionInfo[]): Promise<void> {
		const workspaceExtensions: ILocalExtension[] = [];
		const groupedExtensions = new Map<IExtensionManagementServer, UninstallExtensionInfo[]>();

		const addExtensionToServer = (server: IExtensionManagementServer, extension: ILocalExtension, options?: UninstallOptions) => {
			let extensions = groupedExtensions.get(server);
			if (!extensions) {
				groupedExtensions.set(server, extensions = []);
			}
			extensions.push({ extension, options });
		};

		for (const { extension, options } of extensions) {
			if (extension.isWorkspaceScoped) {
				workspaceExtensions.push(extension);
				continue;
			}

			const server = this.getServer(extension);
			if (!server) {
				throw new Error(`Invalid location ${extension.location.toString()}`);
			}
			addExtensionToServer(server, extension, options);
			if (this.servers.length > 1 && isLanguagePackExtension(extension.manifest)) {
				const otherServers: IExtensionManagementServer[] = this.servers.filter(s => s !== server);
				for (const otherServer of otherServers) {
					const installed = await otherServer.extensionManagementService.getInstalled();
					const extensionInOtherServer = installed.find(i => !i.isBuiltin && areSameExtensions(i.identifier, extension.identifier));
					if (extensionInOtherServer) {
						addExtensionToServer(otherServer, extensionInOtherServer, options);
					}
				}
			}
		}

		const promises: Promise<void>[] = [];
		for (const workspaceExtension of workspaceExtensions) {
			promises.push(this.uninstallExtensionFromWorkspace(workspaceExtension));
		}
		for (const [server, extensions] of groupedExtensions.entries()) {
			promises.push(this.uninstallInServer(server, extensions));
		}

		const result = await Promise.allSettled(promises);
		const errors = result.filter(r => r.status === 'rejected').map(r => r.reason);
		if (errors.length) {
			throw new Error(errors.map(e => e.message).join('\n'));
		}
	}

	private async uninstallInServer(server: IExtensionManagementServer, extensions: UninstallExtensionInfo[]): Promise<void> {
		if (server === this.extensionManagementServerService.localExtensionManagementServer && this.extensionManagementServerService.remoteExtensionManagementServer) {
			for (const { extension } of extensions) {
				const installedExtensions = await this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.getInstalled(ExtensionType.User);
				const dependentNonUIExtensions = installedExtensions.filter(i => !this.extensionManifestPropertiesService.prefersExecuteOnUI(i.manifest)
					&& i.manifest.extensionDependencies && i.manifest.extensionDependencies.some(id => areSameExtensions({ id }, extension.identifier)));
				if (dependentNonUIExtensions.length) {
					throw (new Error(this.getDependentsErrorMessage(extension, dependentNonUIExtensions)));
				}
			}
		}
		return server.extensionManagementService.uninstallExtensions(extensions);
	}

	private getDependentsErrorMessage(extension: ILocalExtension, dependents: ILocalExtension[]): string {
		if (dependents.length === 1) {
			return localize('singleDependentError', "Cannot uninstall extension '{0}'. Extension '{1}' depends on this.",
				extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name);
		}
		if (dependents.length === 2) {
			return localize('twoDependentsError', "Cannot uninstall extension '{0}'. Extensions '{1}' and '{2}' depend on this.",
				extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
		}
		return localize('multipleDependentsError', "Cannot uninstall extension '{0}'. Extensions '{1}', '{2}' and others depend on this.",
			extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);

	}

	updateMetadata(extension: ILocalExtension, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		const server = this.getServer(extension);
		if (server) {
			const profile = extension.isApplicationScoped ? this.userDataProfilesService.defaultProfile : this.userDataProfileService.currentProfile;
			return server.extensionManagementService.updateMetadata(extension, metadata, profile.extensionsResource);
		}
		return Promise.reject(`Invalid location ${extension.location.toString()}`);
	}

	async resetPinnedStateForAllUserExtensions(pinned: boolean): Promise<void> {
		await Promise.allSettled(this.servers.map(server => server.extensionManagementService.resetPinnedStateForAllUserExtensions(pinned)));
	}

	zip(extension: ILocalExtension): Promise<URI> {
		const server = this.getServer(extension);
		if (server) {
			return server.extensionManagementService.zip(extension);
		}
		return Promise.reject(`Invalid location ${extension.location.toString()}`);
	}

	download(extension: IGalleryExtension, operation: InstallOperation, donotVerifySignature: boolean): Promise<URI> {
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.download(extension, operation, donotVerifySignature);
		}
		throw new Error('Cannot download extension');
	}

	async install(vsix: URI, options?: InstallOptions): Promise<ILocalExtension> {
		const manifest = await this.getManifest(vsix);
		return this.installVSIX(vsix, manifest, options);
	}

	async installVSIX(vsix: URI, manifest: IExtensionManifest, options?: InstallOptions): Promise<ILocalExtension> {
		const serversToInstall = this.getServersToInstall(manifest);
		if (serversToInstall?.length) {
			await this.checkForWorkspaceTrust(manifest, false);
			const [local] = await Promises.settled(serversToInstall.map(server => this.installVSIXInServer(vsix, server, options)));
			return local;
		}
		return Promise.reject('No Servers to Install');
	}

	private getServersToInstall(manifest: IExtensionManifest): IExtensionManagementServer[] | undefined {
		if (this.extensionManagementServerService.localExtensionManagementServer && this.extensionManagementServerService.remoteExtensionManagementServer) {
			if (isLanguagePackExtension(manifest)) {
				// Install on both servers
				return [this.extensionManagementServerService.localExtensionManagementServer, this.extensionManagementServerService.remoteExtensionManagementServer];
			}
			if (this.extensionManifestPropertiesService.prefersExecuteOnUI(manifest)) {
				// Install only on local server
				return [this.extensionManagementServerService.localExtensionManagementServer];
			}
			// Install only on remote server
			return [this.extensionManagementServerService.remoteExtensionManagementServer];
		}
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return [this.extensionManagementServerService.localExtensionManagementServer];
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			return [this.extensionManagementServerService.remoteExtensionManagementServer];
		}
		return undefined;
	}

	async installFromLocation(location: URI): Promise<ILocalExtension> {
		if (location.scheme === Schemas.file) {
			if (this.extensionManagementServerService.localExtensionManagementServer) {
				return this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.installFromLocation(location, this.userDataProfileService.currentProfile.extensionsResource);
			}
			throw new Error('Local extension management server is not found');
		}
		if (location.scheme === Schemas.vscodeRemote) {
			if (this.extensionManagementServerService.remoteExtensionManagementServer) {
				return this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.installFromLocation(location, this.userDataProfileService.currentProfile.extensionsResource);
			}
			throw new Error('Remote extension management server is not found');
		}
		if (!this.extensionManagementServerService.webExtensionManagementServer) {
			throw new Error('Web extension management server is not found');
		}
		return this.extensionManagementServerService.webExtensionManagementServer.extensionManagementService.installFromLocation(location, this.userDataProfileService.currentProfile.extensionsResource);
	}

	protected installVSIXInServer(vsix: URI, server: IExtensionManagementServer, options: InstallOptions | undefined): Promise<ILocalExtension> {
		return server.extensionManagementService.install(vsix, options);
	}

	getManifest(vsix: URI): Promise<IExtensionManifest> {
		if (vsix.scheme === Schemas.file && this.extensionManagementServerService.localExtensionManagementServer) {
			return this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.getManifest(vsix);
		}
		if (vsix.scheme === Schemas.file && this.extensionManagementServerService.remoteExtensionManagementServer) {
			return this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.getManifest(vsix);
		}
		if (vsix.scheme === Schemas.vscodeRemote && this.extensionManagementServerService.remoteExtensionManagementServer) {
			return this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.getManifest(vsix);
		}
		return Promise.reject('No Servers');
	}

	override async canInstall(extension: IGalleryExtension | IResourceExtension): Promise<true | IMarkdownString> {
		if (isGalleryExtension(extension)) {
			return this.canInstallGalleryExtension(extension);
		}
		return this.canInstallResourceExtension(extension);
	}

	private async canInstallGalleryExtension(gallery: IGalleryExtension): Promise<true | IMarkdownString> {
		if (this.extensionManagementServerService.localExtensionManagementServer
			&& await this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.canInstall(gallery) === true) {
			return true;
		}
		const manifest = await this.extensionGalleryService.getManifest(gallery, CancellationToken.None);
		if (!manifest) {
			return new MarkdownString().appendText(localize('manifest is not found', "Manifest is not found"));
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer
			&& await this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.canInstall(gallery) === true
			&& this.extensionManifestPropertiesService.canExecuteOnWorkspace(manifest)) {
			return true;
		}
		if (this.extensionManagementServerService.webExtensionManagementServer
			&& await this.extensionManagementServerService.webExtensionManagementServer.extensionManagementService.canInstall(gallery) === true
			&& this.extensionManifestPropertiesService.canExecuteOnWeb(manifest)) {
			return true;
		}
		return new MarkdownString().appendText(localize('cannot be installed', "Cannot install the '{0}' extension because it is not available in this setup.", gallery.displayName || gallery.name));
	}

	private async canInstallResourceExtension(extension: IResourceExtension): Promise<true | IMarkdownString> {
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return true;
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer && this.extensionManifestPropertiesService.canExecuteOnWorkspace(extension.manifest)) {
			return true;
		}
		if (this.extensionManagementServerService.webExtensionManagementServer && this.extensionManifestPropertiesService.canExecuteOnWeb(extension.manifest)) {
			return true;
		}
		return new MarkdownString().appendText(localize('cannot be installed', "Cannot install the '{0}' extension because it is not available in this setup.", extension.manifest.displayName ?? extension.identifier.id));
	}

	async updateFromGallery(gallery: IGalleryExtension, extension: ILocalExtension, installOptions?: InstallOptions): Promise<ILocalExtension> {
		const server = this.getServer(extension);
		if (!server) {
			return Promise.reject(`Invalid location ${extension.location.toString()}`);
		}

		const servers: IExtensionManagementServer[] = [];

		// Update Language pack on local and remote servers
		if (isLanguagePackExtension(extension.manifest)) {
			servers.push(...this.servers.filter(server => server !== this.extensionManagementServerService.webExtensionManagementServer));
		} else {
			servers.push(server);
		}

		installOptions = { ...(installOptions || {}), isApplicationScoped: extension.isApplicationScoped };
		return Promises.settled(servers.map(server => server.extensionManagementService.installFromGallery(gallery, installOptions))).then(([local]) => local);
	}

	async installGalleryExtensions(extensions: InstallExtensionInfo[]): Promise<InstallExtensionResult[]> {
		const results = new Map<string, InstallExtensionResult>();

		const extensionsByServer = new Map<IExtensionManagementServer, InstallExtensionInfo[]>();
		const manifests = await Promise.all(extensions.map(async ({ extension }) => {
			const manifest = await this.extensionGalleryService.getManifest(extension, CancellationToken.None);
			if (!manifest) {
				throw new Error(localize('Manifest is not found', "Installing Extension {0} failed: Manifest is not found.", extension.displayName || extension.name));
			}
			return manifest;
		}));

		if (extensions.some(e => e.options?.context?.[EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT] !== true)) {
			await this.checkForTrustedPublishers(extensions.map((e, index) => ({ extension: e.extension, manifest: manifests[index], checkForPackAndDependencies: !e.options?.donotIncludePackAndDependencies })));
		}

		await Promise.all(extensions.map(async ({ extension, options }) => {
			try {
				const manifest = await this.extensionGalleryService.getManifest(extension, CancellationToken.None);
				if (!manifest) {
					throw new Error(localize('Manifest is not found', "Installing Extension {0} failed: Manifest is not found.", extension.displayName || extension.name));
				}

				if (options?.context?.[EXTENSION_INSTALL_SOURCE_CONTEXT] !== ExtensionInstallSource.SETTINGS_SYNC) {
					await this.checkForWorkspaceTrust(manifest, false);

					if (!options?.donotIncludePackAndDependencies) {
						await this.checkInstallingExtensionOnWeb(extension, manifest);
					}
				}

				const servers = await this.getExtensionManagementServersToInstall(extension, manifest);
				if (!options.isMachineScoped && this.isExtensionsSyncEnabled()) {
					if (this.extensionManagementServerService.localExtensionManagementServer
						&& !servers.includes(this.extensionManagementServerService.localExtensionManagementServer)
						&& await this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.canInstall(extension) === true) {
						servers.push(this.extensionManagementServerService.localExtensionManagementServer);
					}
				}
				for (const server of servers) {
					let exensions = extensionsByServer.get(server);
					if (!exensions) {
						extensionsByServer.set(server, exensions = []);
					}
					exensions.push({ extension, options });
				}
			} catch (error) {
				results.set(extension.identifier.id.toLowerCase(), {
					identifier: extension.identifier,
					source: extension, error,
					operation: InstallOperation.Install,
					profileLocation: options.profileLocation ?? this.userDataProfileService.currentProfile.extensionsResource
				});
			}
		}));

		await Promise.all([...extensionsByServer.entries()].map(async ([server, extensions]) => {
			const serverResults = await server.extensionManagementService.installGalleryExtensions(extensions);
			for (const result of serverResults) {
				results.set(result.identifier.id.toLowerCase(), result);
			}
		}));

		return [...results.values()];
	}

	async installFromGallery(gallery: IGalleryExtension, installOptions?: InstallOptions, servers?: IExtensionManagementServer[]): Promise<ILocalExtension> {
		const manifest = await this.extensionGalleryService.getManifest(gallery, CancellationToken.None);
		if (!manifest) {
			throw new Error(localize('Manifest is not found', "Installing Extension {0} failed: Manifest is not found.", gallery.displayName || gallery.name));
		}

		if (installOptions?.context?.[EXTENSION_INSTALL_SKIP_PUBLISHER_TRUST_CONTEXT] !== true) {
			await this.checkForTrustedPublishers([{ extension: gallery, manifest, checkForPackAndDependencies: !installOptions?.donotIncludePackAndDependencies }],);
		}

		if (installOptions?.context?.[EXTENSION_INSTALL_SOURCE_CONTEXT] !== ExtensionInstallSource.SETTINGS_SYNC) {

			await this.checkForWorkspaceTrust(manifest, false);

			if (!installOptions?.donotIncludePackAndDependencies) {
				await this.checkInstallingExtensionOnWeb(gallery, manifest);
			}
		}

		servers = servers?.length ? this.validServers(gallery, manifest, servers) : await this.getExtensionManagementServersToInstall(gallery, manifest);
		if (!installOptions || isUndefined(installOptions.isMachineScoped)) {
			const isMachineScoped = await this.hasToFlagExtensionsMachineScoped([gallery]);
			installOptions = { ...(installOptions || {}), isMachineScoped };
		}

		if (!installOptions.isMachineScoped && this.isExtensionsSyncEnabled()) {
			if (this.extensionManagementServerService.localExtensionManagementServer
				&& !servers.includes(this.extensionManagementServerService.localExtensionManagementServer)
				&& await this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.canInstall(gallery) === true) {
				servers.push(this.extensionManagementServerService.localExtensionManagementServer);
			}
		}

		return Promises.settled(servers.map(server => server.extensionManagementService.installFromGallery(gallery, installOptions))).then(([local]) => local);
	}

	async getExtensions(locations: URI[]): Promise<IResourceExtension[]> {
		const scannedExtensions = await this.extensionsScannerService.scanMultipleExtensions(locations, ExtensionType.User, { includeInvalid: true });
		const result: IResourceExtension[] = [];
		await Promise.all(scannedExtensions.map(async scannedExtension => {
			const workspaceExtension = await this.workspaceExtensionManagementService.toLocalWorkspaceExtension(scannedExtension);
			if (workspaceExtension) {
				result.push({
					type: 'resource',
					identifier: workspaceExtension.identifier,
					location: workspaceExtension.location,
					manifest: workspaceExtension.manifest,
					changelogUri: workspaceExtension.changelogUrl,
					readmeUri: workspaceExtension.readmeUrl,
				});
			}
		}));
		return result;
	}

	getInstalledWorkspaceExtensionLocations(): URI[] {
		return this.workspaceExtensionManagementService.getInstalledWorkspaceExtensionsLocations();
	}

	async getInstalledWorkspaceExtensions(includeInvalid: boolean): Promise<ILocalExtension[]> {
		return this.workspaceExtensionManagementService.getInstalled(includeInvalid);
	}

	async installResourceExtension(extension: IResourceExtension, installOptions: InstallOptions): Promise<ILocalExtension> {
		if (!this.canInstallResourceExtension(extension)) {
			throw new Error('This extension cannot be installed in the current workspace.');
		}
		if (!installOptions.isWorkspaceScoped) {
			return this.installFromLocation(extension.location);
		}

		this.logService.info(`Installing the extension ${extension.identifier.id} from ${extension.location.toString()} in workspace`);
		const server = this.getWorkspaceExtensionsServer();
		this._onInstallExtension.fire({
			identifier: extension.identifier,
			source: extension.location,
			server,
			applicationScoped: false,
			profileLocation: this.userDataProfileService.currentProfile.extensionsResource,
			workspaceScoped: true
		});

		try {
			await this.checkForWorkspaceTrust(extension.manifest, true);

			const workspaceExtension = await this.workspaceExtensionManagementService.install(extension);

			this.logService.info(`Successfully installed the extension ${workspaceExtension.identifier.id} from ${extension.location.toString()} in the workspace`);
			this._onDidInstallExtensions.fire([{
				identifier: workspaceExtension.identifier,
				source: extension.location,
				operation: InstallOperation.Install,
				applicationScoped: false,
				profileLocation: this.userDataProfileService.currentProfile.extensionsResource,
				local: workspaceExtension,
				workspaceScoped: true
			}]);
			return workspaceExtension;
		} catch (error) {
			this.logService.error(`Failed to install the extension ${extension.identifier.id} from ${extension.location.toString()} in the workspace`, getErrorMessage(error));
			this._onDidInstallExtensions.fire([{
				identifier: extension.identifier,
				source: extension.location,
				operation: InstallOperation.Install,
				applicationScoped: false,
				profileLocation: this.userDataProfileService.currentProfile.extensionsResource,
				error,
				workspaceScoped: true
			}]);
			throw error;
		}
	}

	async getInstallableServers(gallery: IGalleryExtension): Promise<IExtensionManagementServer[]> {
		const manifest = await this.extensionGalleryService.getManifest(gallery, CancellationToken.None);
		if (!manifest) {
			return Promise.reject(localize('Manifest is not found', "Installing Extension {0} failed: Manifest is not found.", gallery.displayName || gallery.name));
		}
		return this.getInstallableExtensionManagementServers(manifest);
	}

	private async uninstallExtensionFromWorkspace(extension: ILocalExtension): Promise<void> {
		if (!extension.isWorkspaceScoped) {
			throw new Error('The extension is not a workspace extension');
		}

		this.logService.info(`Uninstalling the workspace extension ${extension.identifier.id} from ${extension.location.toString()}`);
		const server = this.getWorkspaceExtensionsServer();
		this._onUninstallExtension.fire({
			identifier: extension.identifier,
			server,
			applicationScoped: false,
			workspaceScoped: true,
			profileLocation: this.userDataProfileService.currentProfile.extensionsResource
		});

		try {
			await this.workspaceExtensionManagementService.uninstall(extension);
			this.logService.info(`Successfully uninstalled the workspace extension ${extension.identifier.id} from ${extension.location.toString()}`);
			this.telemetryService.publicLog2<{}, {
				owner: 'sandy081';
				comment: 'Uninstall workspace extension';
			}>('workspaceextension:uninstall');
			this._onDidUninstallExtension.fire({
				identifier: extension.identifier,
				server,
				applicationScoped: false,
				workspaceScoped: true,
				profileLocation: this.userDataProfileService.currentProfile.extensionsResource
			});
		} catch (error) {
			this.logService.error(`Failed to uninstall the workspace extension ${extension.identifier.id} from ${extension.location.toString()}`, getErrorMessage(error));
			this._onDidUninstallExtension.fire({
				identifier: extension.identifier,
				server,
				error,
				applicationScoped: false,
				workspaceScoped: true,
				profileLocation: this.userDataProfileService.currentProfile.extensionsResource
			});
			throw error;
		}
	}

	private validServers(gallery: IGalleryExtension, manifest: IExtensionManifest, servers: IExtensionManagementServer[]): IExtensionManagementServer[] {
		const installableServers = this.getInstallableExtensionManagementServers(manifest);
		for (const server of servers) {
			if (!installableServers.includes(server)) {
				const error = new Error(localize('cannot be installed in server', "Cannot install the '{0}' extension because it is not available in the '{1}' setup.", gallery.displayName || gallery.name, server.label));
				error.name = ExtensionManagementErrorCode.Unsupported;
				throw error;
			}
		}
		return servers;
	}

	private async getExtensionManagementServersToInstall(gallery: IGalleryExtension, manifest: IExtensionManifest): Promise<IExtensionManagementServer[]> {
		const servers: IExtensionManagementServer[] = [];

		// Language packs should be installed on both local and remote servers
		if (isLanguagePackExtension(manifest)) {
			servers.push(...this.servers.filter(server => server !== this.extensionManagementServerService.webExtensionManagementServer));
		}

		else {
			const [server] = this.getInstallableExtensionManagementServers(manifest);
			if (server) {
				servers.push(server);
			}
		}

		if (!servers.length) {
			const error = new Error(localize('cannot be installed', "Cannot install the '{0}' extension because it is not available in this setup.", gallery.displayName || gallery.name));
			error.name = ExtensionManagementErrorCode.Unsupported;
			throw error;
		}

		return servers;
	}

	private getInstallableExtensionManagementServers(manifest: IExtensionManifest): IExtensionManagementServer[] {
		// Only local server
		if (this.servers.length === 1 && this.extensionManagementServerService.localExtensionManagementServer) {
			return [this.extensionManagementServerService.localExtensionManagementServer];
		}

		const servers: IExtensionManagementServer[] = [];

		const extensionKind = this.extensionManifestPropertiesService.getExtensionKind(manifest);
		for (const kind of extensionKind) {
			if (kind === 'ui' && this.extensionManagementServerService.localExtensionManagementServer) {
				servers.push(this.extensionManagementServerService.localExtensionManagementServer);
			}
			if (kind === 'workspace' && this.extensionManagementServerService.remoteExtensionManagementServer) {
				servers.push(this.extensionManagementServerService.remoteExtensionManagementServer);
			}
			if (kind === 'web' && this.extensionManagementServerService.webExtensionManagementServer) {
				servers.push(this.extensionManagementServerService.webExtensionManagementServer);
			}
		}

		// Local server can accept any extension.
		if (this.extensionManagementServerService.localExtensionManagementServer && !servers.includes(this.extensionManagementServerService.localExtensionManagementServer)) {
			servers.push(this.extensionManagementServerService.localExtensionManagementServer);
		}

		return servers;
	}

	private isExtensionsSyncEnabled(): boolean {
		return this.userDataSyncEnablementService.isEnabled() && this.userDataSyncEnablementService.isResourceEnabled(SyncResource.Extensions);
	}

	private async hasToFlagExtensionsMachineScoped(extensions: IGalleryExtension[]): Promise<boolean> {
		if (this.isExtensionsSyncEnabled()) {
			const { result } = await this.dialogService.prompt<boolean>({
				type: Severity.Info,
				message: extensions.length === 1 ? localize('install extension', "Install Extension") : localize('install extensions', "Install Extensions"),
				detail: extensions.length === 1
					? localize('install single extension', "Would you like to install and synchronize '{0}' extension across your devices?", extensions[0].displayName)
					: localize('install multiple extensions', "Would you like to install and synchronize extensions across your devices?"),
				buttons: [
					{
						label: localize({ key: 'install', comment: ['&& denotes a mnemonic'] }, "&&Install"),
						run: () => false
					},
					{
						label: localize({ key: 'install and do no sync', comment: ['&& denotes a mnemonic'] }, "Install (Do &&not sync)"),
						run: () => true
					}
				],
				cancelButton: {
					run: () => {
						throw new CancellationError();
					}
				}
			});

			return result;
		}
		return false;
	}

	getExtensionsControlManifest(): Promise<IExtensionsControlManifest> {
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.getExtensionsControlManifest();
		}
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			return this.extensionManagementServerService.remoteExtensionManagementServer.extensionManagementService.getExtensionsControlManifest();
		}
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			return this.extensionManagementServerService.webExtensionManagementServer.extensionManagementService.getExtensionsControlManifest();
		}
		return this.extensionGalleryService.getExtensionsControlManifest();
	}

	private getServer(extension: ILocalExtension): IExtensionManagementServer | null {
		if (extension.isWorkspaceScoped) {
			return this.getWorkspaceExtensionsServer();
		}
		return this.extensionManagementServerService.getExtensionManagementServer(extension);
	}

	private getWorkspaceExtensionsServer(): IExtensionManagementServer {
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			return this.extensionManagementServerService.remoteExtensionManagementServer;
		}
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return this.extensionManagementServerService.localExtensionManagementServer;
		}
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			return this.extensionManagementServerService.webExtensionManagementServer;
		}
		throw new Error('No extension server found');
	}

	async requestPublisherTrust(extensions: InstallExtensionInfo[]): Promise<void> {
		const manifests = await Promise.all(extensions.map(async ({ extension }) => {
			const manifest = await this.extensionGalleryService.getManifest(extension, CancellationToken.None);
			if (!manifest) {
				throw new Error(localize('Manifest is not found', "Installing Extension {0} failed: Manifest is not found.", extension.displayName || extension.name));
			}
			return manifest;
		}));

		await this.checkForTrustedPublishers(extensions.map((e, index) => ({ extension: e.extension, manifest: manifests[index], checkForPackAndDependencies: !e.options?.donotIncludePackAndDependencies })));
	}

	private async checkForTrustedPublishers(extensions: { extension: IGalleryExtension; manifest: IExtensionManifest; checkForPackAndDependencies: boolean }[]): Promise<void> {
		const untrustedExtensions: IGalleryExtension[] = [];
		const untrustedExtensionManifests: IExtensionManifest[] = [];
		const manifestsToGetOtherUntrustedPublishers: IExtensionManifest[] = [];
		for (const { extension, manifest, checkForPackAndDependencies } of extensions) {
			if (!extension.private && !this.isPublisherTrusted(extension)) {
				untrustedExtensions.push(extension);
				untrustedExtensionManifests.push(manifest);
				if (checkForPackAndDependencies) {
					manifestsToGetOtherUntrustedPublishers.push(manifest);
				}
			}
		}

		if (!untrustedExtensions.length) {
			return;
		}

		const otherUntrustedPublishers = manifestsToGetOtherUntrustedPublishers.length ? await this.getOtherUntrustedPublishers(manifestsToGetOtherUntrustedPublishers) : [];
		const allPublishers = [...distinct(untrustedExtensions, e => e.publisher), ...otherUntrustedPublishers];
		const unverfiiedPublishers = allPublishers.filter(p => !p.publisherDomain?.verified);
		const verifiedPublishers = allPublishers.filter(p => p.publisherDomain?.verified);

		type TrustPublisherClassification = {
			owner: 'sandy081';
			comment: 'Report the action taken by the user on the publisher trust dialog';
			action: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The action taken by the user on the publisher trust dialog. Can be trust, learn more or cancel.' };
			extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The identifiers of the extension for which the publisher trust dialog was shown.' };
		};
		type TrustPublisherEvent = {
			action: string;
			extensionId: string;
		};

		const installButton: IPromptButton<void> = {
			label: allPublishers.length > 1 ? localize({ key: 'trust publishers and install', comment: ['&& denotes a mnemonic'] }, "Trust Publishers & &&Install") : localize({ key: 'trust and install', comment: ['&& denotes a mnemonic'] }, "Trust Publisher & &&Install"),
			run: () => {
				this.telemetryService.publicLog2<TrustPublisherEvent, TrustPublisherClassification>('extensions:trustPublisher', { action: 'trust', extensionId: untrustedExtensions.map(e => e.identifier.id).join(',') });
				this.trustPublishers(...allPublishers.map(p => ({ publisher: p.publisher, publisherDisplayName: p.publisherDisplayName })));
			}
		};

		const learnMoreButton: IPromptButton<void> = {
			label: localize({ key: 'learnMore', comment: ['&& denotes a mnemonic'] }, "&&Learn More"),
			run: () => {
				this.telemetryService.publicLog2<TrustPublisherEvent, TrustPublisherClassification>('extensions:trustPublisher', { action: 'learn', extensionId: untrustedExtensions.map(e => e.identifier.id).join(',') });
				this.instantiationService.invokeFunction(accessor => accessor.get(ICommandService).executeCommand('vscode.open', URI.parse('https://aka.ms/vscode-extension-security')));
				throw new CancellationError();
			}
		};

		const getPublisherLink = ({ publisherDisplayName, publisherLink }: { publisherDisplayName: string; publisherLink?: string }) => {
			return publisherLink ? `[${publisherDisplayName}](${publisherLink})` : publisherDisplayName;
		};

		const unverifiedLink = 'https://aka.ms/vscode-verify-publisher';

		const title = allPublishers.length === 1
			? localize('checkTrustedPublisherTitle', "Do you trust the publisher \"{0}\"?", allPublishers[0].publisherDisplayName)
			: allPublishers.length === 2
				? localize('checkTwoTrustedPublishersTitle', "Do you trust publishers \"{0}\" and \"{1}\"?", allPublishers[0].publisherDisplayName, allPublishers[1].publisherDisplayName)
				: localize('checkAllTrustedPublishersTitle', "Do you trust the publisher \"{0}\" and {1} others?", allPublishers[0].publisherDisplayName, allPublishers.length - 1);

		const customMessage = new MarkdownString('', { supportThemeIcons: true, isTrusted: true });

		if (untrustedExtensions.length === 1) {
			const extension = untrustedExtensions[0];
			const manifest = untrustedExtensionManifests[0];
			if (otherUntrustedPublishers.length) {
				customMessage.appendMarkdown(localize('extension published by message', "The extension {0} is published by {1}.", `[${extension.displayName}](${extension.detailsLink})`, getPublisherLink(extension)));
				customMessage.appendMarkdown('&nbsp;');
				const commandUri = createCommandUri('extension.open', extension.identifier.id, manifest.extensionPack?.length ? 'extensionPack' : 'dependencies').toString();
				if (otherUntrustedPublishers.length === 1) {
					customMessage.appendMarkdown(localize('singleUntrustedPublisher', "Installing this extension will also install [extensions]({0}) published by {1}.", commandUri, getPublisherLink(otherUntrustedPublishers[0])));
				} else {
					customMessage.appendMarkdown(localize('message3', "Installing this extension will also install [extensions]({0}) published by {1} and {2}.", commandUri, otherUntrustedPublishers.slice(0, otherUntrustedPublishers.length - 1).map(p => getPublisherLink(p)).join(', '), getPublisherLink(otherUntrustedPublishers[otherUntrustedPublishers.length - 1])));
				}
				customMessage.appendMarkdown('&nbsp;');
				customMessage.appendMarkdown(localize('firstTimeInstallingMessage', "This is the first time you're installing extensions from these publishers."));
			} else {
				customMessage.appendMarkdown(localize('message1', "The extension {0} is published by {1}. This is the first extension you're installing from this publisher.", `[${extension.displayName}](${extension.detailsLink})`, getPublisherLink(extension)));
			}
		} else {
			customMessage.appendMarkdown(localize('multiInstallMessage', "This is the first time you're installing extensions from publishers {0} and {1}.", getPublisherLink(allPublishers[0]), getPublisherLink(allPublishers[allPublishers.length - 1])));
		}

		if (verifiedPublishers.length || unverfiiedPublishers.length === 1) {
			for (const publisher of verifiedPublishers) {
				customMessage.appendText('\n');
				const publisherVerifiedMessage = localize('verifiedPublisherWithName', "{0} has verified ownership of {1}.", getPublisherLink(publisher), `[$(link-external) ${URI.parse(publisher.publisherDomain!.link).authority}](${publisher.publisherDomain!.link})`);
				customMessage.appendMarkdown(`$(${verifiedPublisherIcon.id})&nbsp;${publisherVerifiedMessage}`);
			}
			if (unverfiiedPublishers.length) {
				customMessage.appendText('\n');
				if (unverfiiedPublishers.length === 1) {
					customMessage.appendMarkdown(`$(${Codicon.unverified.id})&nbsp;${localize('unverifiedPublisherWithName', "{0} is [**not** verified]({1}).", getPublisherLink(unverfiiedPublishers[0]), unverifiedLink)}`);
				} else {
					customMessage.appendMarkdown(`$(${Codicon.unverified.id})&nbsp;${localize('unverifiedPublishers', "{0} and {1} are [**not** verified]({2}).", unverfiiedPublishers.slice(0, unverfiiedPublishers.length - 1).map(p => getPublisherLink(p)).join(', '), getPublisherLink(unverfiiedPublishers[unverfiiedPublishers.length - 1]), unverifiedLink)}`);
				}
			}
		} else {
			customMessage.appendText('\n');
			customMessage.appendMarkdown(`$(${Codicon.unverified.id})&nbsp;${localize('allUnverifed', "All publishers are [**not** verified]({0}).", unverifiedLink)}`);
		}

		customMessage.appendText('\n');
		if (allPublishers.length > 1) {
			customMessage.appendMarkdown(localize('message4', "{0} has no control over the behavior of third-party extensions, including how they manage your personal data. Proceed only if you trust the publishers.", this.productService.nameLong));
		} else {
			customMessage.appendMarkdown(localize('message2', "{0} has no control over the behavior of third-party extensions, including how they manage your personal data. Proceed only if you trust the publisher.", this.productService.nameLong));
		}

		await this.dialogService.prompt({
			message: title,
			type: Severity.Warning,
			buttons: [installButton, learnMoreButton],
			cancelButton: {
				run: () => {
					this.telemetryService.publicLog2<TrustPublisherEvent, TrustPublisherClassification>('extensions:trustPublisher', { action: 'cancel', extensionId: untrustedExtensions.map(e => e.identifier.id).join(',') });
					throw new CancellationError();
				}
			},
			custom: {
				markdownDetails: [{ markdown: customMessage, classes: ['extensions-management-publisher-trust-dialog'] }],
			}
		});

	}

	private async getOtherUntrustedPublishers(manifests: IExtensionManifest[]): Promise<{ publisher: string; publisherDisplayName: string; publisherLink?: string; publisherDomain?: { link: string; verified: boolean } }[]> {
		const extensionIds = new Set<string>();
		for (const manifest of manifests) {
			for (const id of [...(manifest.extensionPack ?? []), ...(manifest.extensionDependencies ?? [])]) {
				const [publisherId] = id.split('.');
				if (publisherId.toLowerCase() === manifest.publisher.toLowerCase()) {
					continue;
				}
				if (this.isPublisherUserTrusted(publisherId.toLowerCase())) {
					continue;
				}
				extensionIds.add(id.toLowerCase());
			}
		}
		if (!extensionIds.size) {
			return [];
		}
		const extensions = new Map<string, IGalleryExtension>();
		await this.getDependenciesAndPackedExtensionsRecursively([...extensionIds], extensions, CancellationToken.None);
		const publishers = new Map<string, IGalleryExtension>();
		for (const [, extension] of extensions) {
			if (extension.private || this.isPublisherTrusted(extension)) {
				continue;
			}
			publishers.set(extension.publisherDisplayName, extension);
		}
		return [...publishers.values()];
	}

	private async getDependenciesAndPackedExtensionsRecursively(toGet: string[], result: Map<string, IGalleryExtension>, token: CancellationToken): Promise<void> {
		if (toGet.length === 0) {
			return;
		}

		const extensions = await this.extensionGalleryService.getExtensions(toGet.map(id => ({ id })), token);
		for (let idx = 0; idx < extensions.length; idx++) {
			const extension = extensions[idx];
			result.set(extension.identifier.id.toLowerCase(), extension);
		}
		toGet = [];
		for (const extension of extensions) {
			if (isNonEmptyArray(extension.properties.dependencies)) {
				for (const id of extension.properties.dependencies) {
					if (!result.has(id.toLowerCase())) {
						toGet.push(id);
					}
				}
			}
			if (isNonEmptyArray(extension.properties.extensionPack)) {
				for (const id of extension.properties.extensionPack) {
					if (!result.has(id.toLowerCase())) {
						toGet.push(id);
					}
				}
			}
		}
		return this.getDependenciesAndPackedExtensionsRecursively(toGet, result, token);
	}

	private async checkForWorkspaceTrust(manifest: IExtensionManifest, requireTrust: boolean): Promise<void> {
		if (requireTrust || this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(manifest) === false) {
			const buttons: WorkspaceTrustRequestButton[] = [];
			buttons.push({ label: localize('extensionInstallWorkspaceTrustButton', "Trust Workspace & Install"), type: 'ContinueWithTrust' });
			if (!requireTrust) {
				buttons.push({ label: localize('extensionInstallWorkspaceTrustContinueButton', "Install"), type: 'ContinueWithoutTrust' });
			}
			buttons.push({ label: localize('extensionInstallWorkspaceTrustManageButton', "Learn More"), type: 'Manage' });
			const trustState = await this.workspaceTrustRequestService.requestWorkspaceTrust({
				message: localize('extensionInstallWorkspaceTrustMessage', "Enabling this extension requires a trusted workspace."),
				buttons
			});

			if (trustState === undefined) {
				throw new CancellationError();
			}
		}
	}

	private async checkInstallingExtensionOnWeb(extension: IGalleryExtension, manifest: IExtensionManifest): Promise<void> {
		if (this.servers.length !== 1 || this.servers[0] !== this.extensionManagementServerService.webExtensionManagementServer) {
			return;
		}

		const nonWebExtensions = [];
		if (manifest.extensionPack?.length) {
			const extensions = await this.extensionGalleryService.getExtensions(manifest.extensionPack.map(id => ({ id })), CancellationToken.None);
			for (const extension of extensions) {
				if (await this.servers[0].extensionManagementService.canInstall(extension) !== true) {
					nonWebExtensions.push(extension);
				}
			}
			if (nonWebExtensions.length && nonWebExtensions.length === extensions.length) {
				throw new ExtensionManagementError('Not supported in Web', ExtensionManagementErrorCode.Unsupported);
			}
		}

		const productName = localize('VS Code for Web', "{0} for the Web", this.productService.nameLong);
		const virtualWorkspaceSupport = this.extensionManifestPropertiesService.getExtensionVirtualWorkspaceSupportType(manifest);
		const virtualWorkspaceSupportReason = getWorkspaceSupportTypeMessage(manifest.capabilities?.virtualWorkspaces);
		const hasLimitedSupport = virtualWorkspaceSupport === 'limited' || !!virtualWorkspaceSupportReason;

		if (!nonWebExtensions.length && !hasLimitedSupport) {
			return;
		}

		const limitedSupportMessage = localize('limited support', "'{0}' has limited functionality in {1}.", extension.displayName || extension.identifier.id, productName);
		let message: string;
		let buttons: IPromptButton<void>[] = [];
		let detail: string | undefined;

		const installAnywayButton: IPromptButton<void> = {
			label: localize({ key: 'install anyways', comment: ['&& denotes a mnemonic'] }, "&&Install Anyway"),
			run: () => { }
		};

		const showExtensionsButton: IPromptButton<void> = {
			label: localize({ key: 'showExtensions', comment: ['&& denotes a mnemonic'] }, "&&Show Extensions"),
			run: () => this.instantiationService.invokeFunction(accessor => accessor.get(ICommandService).executeCommand('extension.open', extension.identifier.id, 'extensionPack'))
		};

		if (nonWebExtensions.length && hasLimitedSupport) {
			message = limitedSupportMessage;
			detail = `${virtualWorkspaceSupportReason ? `${virtualWorkspaceSupportReason}\n` : ''}${localize('non web extensions detail', "Contains extensions which are not supported.")}`;
			buttons = [
				installAnywayButton,
				showExtensionsButton
			];
		}

		else if (hasLimitedSupport) {
			message = limitedSupportMessage;
			detail = virtualWorkspaceSupportReason || undefined;
			buttons = [installAnywayButton];
		}

		else {
			message = localize('non web extensions', "'{0}' contains extensions which are not supported in {1}.", extension.displayName || extension.identifier.id, productName);
			buttons = [
				installAnywayButton,
				showExtensionsButton
			];
		}

		await this.dialogService.prompt({
			type: Severity.Info,
			message,
			detail,
			buttons,
			cancelButton: {
				run: () => { throw new CancellationError(); }
			}
		});
	}

	private _targetPlatformPromise: Promise<TargetPlatform> | undefined;
	getTargetPlatform(): Promise<TargetPlatform> {
		if (!this._targetPlatformPromise) {
			this._targetPlatformPromise = computeTargetPlatform(this.fileService, this.logService);
		}
		return this._targetPlatformPromise;
	}

	async cleanUp(): Promise<void> {
		await Promise.allSettled(this.servers.map(server => server.extensionManagementService.cleanUp()));
	}

	toggleApplicationScope(extension: ILocalExtension, fromProfileLocation: URI): Promise<ILocalExtension> {
		const server = this.getServer(extension);
		if (server) {
			return server.extensionManagementService.toggleApplicationScope(extension, fromProfileLocation);
		}
		throw new Error('Not Supported');
	}

	copyExtensions(from: URI, to: URI): Promise<void> {
		if (this.extensionManagementServerService.remoteExtensionManagementServer) {
			throw new Error('Not Supported');
		}
		if (this.extensionManagementServerService.localExtensionManagementServer) {
			return this.extensionManagementServerService.localExtensionManagementServer.extensionManagementService.copyExtensions(from, to);
		}
		if (this.extensionManagementServerService.webExtensionManagementServer) {
			return this.extensionManagementServerService.webExtensionManagementServer.extensionManagementService.copyExtensions(from, to);
		}
		return Promise.resolve();
	}

	registerParticipant() { throw new Error('Not Supported'); }
	installExtensionsFromProfile(extensions: IExtensionIdentifier[], fromProfileLocation: URI, toProfileLocation: URI): Promise<ILocalExtension[]> { throw new Error('Not Supported'); }

	isPublisherTrusted(extension: IGalleryExtension): boolean {
		const publisher = extension.publisher.toLowerCase();
		if (this.defaultTrustedPublishers.includes(publisher) || this.defaultTrustedPublishers.includes(extension.publisherDisplayName.toLowerCase())) {
			return true;
		}

		// Check if the extension is allowed by publisher or extension id
		if (this.allowedExtensionsService.allowedExtensionsConfigValue && this.allowedExtensionsService.isAllowed(extension)) {
			return true;
		}

		return this.isPublisherUserTrusted(publisher);
	}

	private isPublisherUserTrusted(publisher: string): boolean {
		const trustedPublishers = this.getTrustedPublishersFromStorage();
		return !!trustedPublishers[publisher];
	}

	getTrustedPublishers(): IPublisherInfo[] {
		const trustedPublishers = this.getTrustedPublishersFromStorage();
		return Object.keys(trustedPublishers).map(publisher => trustedPublishers[publisher]);
	}

	trustPublishers(...publishers: IPublisherInfo[]): void {
		const trustedPublishers = this.getTrustedPublishersFromStorage();
		for (const publisher of publishers) {
			trustedPublishers[publisher.publisher.toLowerCase()] = publisher;
		}
		this.storageService.store(TrustedPublishersStorageKey, JSON.stringify(trustedPublishers), StorageScope.APPLICATION, StorageTarget.USER);
	}

	untrustPublishers(...publishers: string[]): void {
		const trustedPublishers = this.getTrustedPublishersFromStorage();
		for (const publisher of publishers) {
			delete trustedPublishers[publisher.toLowerCase()];
		}
		this.storageService.store(TrustedPublishersStorageKey, JSON.stringify(trustedPublishers), StorageScope.APPLICATION, StorageTarget.USER);
	}

	private getTrustedPublishersFromStorage(): IStringDictionary<IPublisherInfo> {
		const trustedPublishers = this.storageService.getObject<IStringDictionary<IPublisherInfo>>(TrustedPublishersStorageKey, StorageScope.APPLICATION, {});
		if (Array.isArray(trustedPublishers)) {
			this.storageService.remove(TrustedPublishersStorageKey, StorageScope.APPLICATION);
			return {};
		}
		return Object.keys(trustedPublishers).reduce<IStringDictionary<IPublisherInfo>>((result, publisher) => {
			result[publisher.toLowerCase()] = trustedPublishers[publisher];
			return result;
		}, {});
	}
}

class WorkspaceExtensionsManagementService extends Disposable {

	private static readonly WORKSPACE_EXTENSIONS_KEY = 'workspaceExtensions.locations';

	private readonly _onDidChangeInvalidExtensions = this._register(new Emitter<ILocalExtension[]>());
	readonly onDidChangeInvalidExtensions = this._onDidChangeInvalidExtensions.event;

	private readonly extensions: ILocalExtension[] = [];
	private readonly initializePromise: Promise<void>;

	private readonly invalidExtensionWatchers = this._register(new DisposableStore());

	constructor(
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IWorkspaceContextService private readonly workspaceService: IWorkspaceContextService,
		@IExtensionsScannerService private readonly extensionsScannerService: IExtensionsScannerService,
		@IStorageService private readonly storageService: IStorageService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
	) {
		super();

		this._register(Event.debounce<FileChangesEvent, FileChangesEvent[]>(this.fileService.onDidFilesChange, (last, e) => {
			(last = last ?? []).push(e);
			return last;
		}, 1000)(events => {
			const changedInvalidExtensions = this.extensions.filter(extension => !extension.isValid && events.some(e => e.affects(extension.location)));
			if (changedInvalidExtensions.length) {
				this.checkExtensionsValidity(changedInvalidExtensions);
			}
		}));

		this.initializePromise = this.initialize();
	}

	private async initialize(): Promise<void> {
		const existingLocations = this.getInstalledWorkspaceExtensionsLocations();
		if (!existingLocations.length) {
			return;
		}

		await Promise.allSettled(existingLocations.map(async location => {
			if (!this.workspaceService.isInsideWorkspace(location)) {
				this.logService.info(`Removing the workspace extension ${location.toString()} as it is not inside the workspace`);
				return;
			}
			if (!(await this.fileService.exists(location))) {
				this.logService.info(`Removing the workspace extension ${location.toString()} as it does not exist`);
				return;
			}
			try {
				const extension = await this.scanWorkspaceExtension(location);
				if (extension) {
					this.extensions.push(extension);
				} else {
					this.logService.info(`Skipping workspace extension ${location.toString()} as it does not exist`);
				}
			} catch (error) {
				this.logService.error('Skipping the workspace extension', location.toString(), error);
			}
		}));

		this.saveWorkspaceExtensions();
	}

	private watchInvalidExtensions(): void {
		this.invalidExtensionWatchers.clear();
		for (const extension of this.extensions) {
			if (!extension.isValid) {
				this.invalidExtensionWatchers.add(this.fileService.watch(extension.location));
			}
		}
	}

	private async checkExtensionsValidity(extensions: ILocalExtension[]): Promise<void> {
		const validExtensions: ILocalExtension[] = [];
		await Promise.all(extensions.map(async extension => {
			const newExtension = await this.scanWorkspaceExtension(extension.location);
			if (newExtension?.isValid) {
				validExtensions.push(newExtension);
			}
		}));

		let changed = false;
		for (const extension of validExtensions) {
			const index = this.extensions.findIndex(e => this.uriIdentityService.extUri.isEqual(e.location, extension.location));
			if (index !== -1) {
				changed = true;
				this.extensions.splice(index, 1, extension);
			}
		}

		if (changed) {
			this.saveWorkspaceExtensions();
			this._onDidChangeInvalidExtensions.fire(validExtensions);
		}
	}

	async getInstalled(includeInvalid: boolean): Promise<ILocalExtension[]> {
		await this.initializePromise;
		return this.extensions.filter(e => includeInvalid || e.isValid);
	}

	async install(extension: IResourceExtension): Promise<ILocalExtension> {
		await this.initializePromise;

		const workspaceExtension = await this.scanWorkspaceExtension(extension.location);
		if (!workspaceExtension) {
			throw new Error('Cannot install the extension as it does not exist.');
		}

		const existingExtensionIndex = this.extensions.findIndex(e => areSameExtensions(e.identifier, extension.identifier));
		if (existingExtensionIndex === -1) {
			this.extensions.push(workspaceExtension);
		} else {
			this.extensions.splice(existingExtensionIndex, 1, workspaceExtension);
		}

		this.saveWorkspaceExtensions();
		this.telemetryService.publicLog2<{}, {
			owner: 'sandy081';
			comment: 'Install workspace extension';
		}>('workspaceextension:install');

		return workspaceExtension;
	}

	async uninstall(extension: ILocalExtension): Promise<void> {
		await this.initializePromise;

		const existingExtensionIndex = this.extensions.findIndex(e => areSameExtensions(e.identifier, extension.identifier));
		if (existingExtensionIndex !== -1) {
			this.extensions.splice(existingExtensionIndex, 1);
			this.saveWorkspaceExtensions();
		}

		this.telemetryService.publicLog2<{}, {
			owner: 'sandy081';
			comment: 'Uninstall workspace extension';
		}>('workspaceextension:uninstall');
	}

	getInstalledWorkspaceExtensionsLocations(): URI[] {
		const locations: URI[] = [];
		try {
			const parsed = JSON.parse(this.storageService.get(WorkspaceExtensionsManagementService.WORKSPACE_EXTENSIONS_KEY, StorageScope.WORKSPACE, '[]'));
			if (Array.isArray(locations)) {
				for (const location of parsed) {
					if (isString(location)) {
						if (this.workspaceService.getWorkbenchState() === WorkbenchState.FOLDER) {
							locations.push(this.workspaceService.getWorkspace().folders[0].toResource(location));
						} else {
							this.logService.warn(`Invalid value for 'extensions' in workspace storage: ${location}`);
						}
					} else {
						locations.push(URI.revive(location));
					}
				}
			} else {
				this.logService.warn(`Invalid value for 'extensions' in workspace storage: ${locations}`);
			}
		} catch (error) {
			this.logService.warn(`Error parsing workspace extensions locations: ${getErrorMessage(error)}`);
		}
		return locations;
	}

	private saveWorkspaceExtensions(): void {
		const locations = this.extensions.map(extension => extension.location);
		if (this.workspaceService.getWorkbenchState() === WorkbenchState.FOLDER) {
			this.storageService.store(WorkspaceExtensionsManagementService.WORKSPACE_EXTENSIONS_KEY,
				JSON.stringify(coalesce(locations
					.map(location => this.uriIdentityService.extUri.relativePath(this.workspaceService.getWorkspace().folders[0].uri, location)))),
				StorageScope.WORKSPACE, StorageTarget.MACHINE);
		} else {
			this.storageService.store(WorkspaceExtensionsManagementService.WORKSPACE_EXTENSIONS_KEY, JSON.stringify(locations), StorageScope.WORKSPACE, StorageTarget.MACHINE);
		}
		this.watchInvalidExtensions();
	}

	async scanWorkspaceExtension(location: URI): Promise<ILocalExtension | null> {
		const scannedExtension = await this.extensionsScannerService.scanExistingExtension(location, ExtensionType.User, { includeInvalid: true });
		return scannedExtension ? this.toLocalWorkspaceExtension(scannedExtension) : null;
	}

	async toLocalWorkspaceExtension(extension: IScannedExtension): Promise<ILocalExtension> {
		const stat = await this.fileService.resolve(extension.location);
		let readmeUrl: URI | undefined;
		let changelogUrl: URI | undefined;
		if (stat.children) {
			readmeUrl = stat.children.find(({ name }) => /^readme(\.txt|\.md|)$/i.test(name))?.resource;
			changelogUrl = stat.children.find(({ name }) => /^changelog(\.txt|\.md|)$/i.test(name))?.resource;
		}
		const validations: [Severity, string][] = [...extension.validations];
		let isValid = extension.isValid;
		if (extension.manifest.main) {
			if (!(await this.fileService.exists(this.uriIdentityService.extUri.joinPath(extension.location, extension.manifest.main)))) {
				isValid = false;
				validations.push([Severity.Error, localize('main.notFound', "Cannot activate because {0} not found", extension.manifest.main)]);
			}
		}
		return {
			identifier: extension.identifier,
			type: extension.type,
			isBuiltin: extension.isBuiltin || !!extension.metadata?.isBuiltin,
			location: extension.location,
			manifest: extension.manifest,
			targetPlatform: extension.targetPlatform,
			validations,
			isValid,
			readmeUrl,
			changelogUrl,
			publisherDisplayName: extension.metadata?.publisherDisplayName,
			publisherId: extension.metadata?.publisherId || null,
			isApplicationScoped: !!extension.metadata?.isApplicationScoped,
			isMachineScoped: !!extension.metadata?.isMachineScoped,
			isPreReleaseVersion: !!extension.metadata?.isPreReleaseVersion,
			hasPreReleaseVersion: !!extension.metadata?.hasPreReleaseVersion,
			preRelease: !!extension.metadata?.preRelease,
			installedTimestamp: extension.metadata?.installedTimestamp,
			updated: !!extension.metadata?.updated,
			pinned: !!extension.metadata?.pinned,
			isWorkspaceScoped: true,
			private: false,
			source: 'resource',
			size: extension.metadata?.size ?? 0,
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionsIcons.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionsIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerColor, textLinkForeground } from '../../../../platform/theme/common/colorRegistry.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const extensionDefaultIcon = registerIcon('extension-default-icon', Codicon.extensionsLarge, localize('extensionDefault', 'Icon used for the default extension in the extensions view and editor.'));
export const verifiedPublisherIcon = registerIcon('extensions-verified-publisher', Codicon.verifiedFilled, localize('verifiedPublisher', 'Icon used for the verified extension publisher in the extensions view and editor.'));
export const extensionVerifiedPublisherIconColor = registerColor('extensionIcon.verifiedForeground', textLinkForeground, localize('extensionIconVerifiedForeground', "The icon color for extension verified publisher."), false);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/remoteExtensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/remoteExtensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { URI } from '../../../../base/common/uri.js';
import { DidChangeProfileEvent, IProfileAwareExtensionManagementService } from './extensionManagement.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { ProfileAwareExtensionManagementChannelClient } from './extensionManagementChannelClient.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IAllowedExtensionsService } from '../../../../platform/extensionManagement/common/extensionManagement.js';

export class RemoteExtensionManagementService extends ProfileAwareExtensionManagementChannelClient implements IProfileAwareExtensionManagementService {

	constructor(
		channel: IChannel,
		@IProductService productService: IProductService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IRemoteUserDataProfilesService private readonly remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService
	) {
		super(channel, productService, allowedExtensionsService, userDataProfileService, uriIdentityService);
	}

	protected async filterEvent(profileLocation: URI, applicationScoped: boolean): Promise<boolean> {
		if (applicationScoped) {
			return true;
		}
		if (!profileLocation && this.userDataProfileService.currentProfile.isDefault) {
			return true;
		}
		const currentRemoteProfile = await this.remoteUserDataProfilesService.getRemoteProfile(this.userDataProfileService.currentProfile);
		if (this.uriIdentityService.extUri.isEqual(currentRemoteProfile.extensionsResource, profileLocation)) {
			return true;
		}
		return false;
	}

	protected override getProfileLocation(profileLocation: URI): Promise<URI>;
	protected override getProfileLocation(profileLocation?: URI): Promise<URI | undefined>;
	protected override async getProfileLocation(profileLocation?: URI): Promise<URI | undefined> {
		if (!profileLocation && this.userDataProfileService.currentProfile.isDefault) {
			return undefined;
		}
		profileLocation = await super.getProfileLocation(profileLocation);
		let profile = this.userDataProfilesService.profiles.find(p => this.uriIdentityService.extUri.isEqual(p.extensionsResource, profileLocation));
		if (profile) {
			profile = await this.remoteUserDataProfilesService.getRemoteProfile(profile);
		} else {
			profile = (await this.remoteUserDataProfilesService.getRemoteProfiles()).find(p => this.uriIdentityService.extUri.isEqual(p.extensionsResource, profileLocation));
		}
		return profile?.extensionsResource;
	}

	protected override async switchExtensionsProfile(previousProfileLocation: URI, currentProfileLocation: URI, preserveExtensions?: ExtensionIdentifier[]): Promise<DidChangeProfileEvent> {
		const remoteProfiles = await this.remoteUserDataProfilesService.getRemoteProfiles();
		const previousProfile = remoteProfiles.find(p => this.uriIdentityService.extUri.isEqual(p.extensionsResource, previousProfileLocation));
		const currentProfile = remoteProfiles.find(p => this.uriIdentityService.extUri.isEqual(p.extensionsResource, currentProfileLocation));
		if (previousProfile?.id === currentProfile?.id) {
			return { added: [], removed: [] };
		}
		return super.switchExtensionsProfile(previousProfileLocation, currentProfileLocation, preserveExtensions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/webExtensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/webExtensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionIdentifier, ExtensionType, IExtension, IExtensionIdentifier, IExtensionManifest, TargetPlatform } from '../../../../platform/extensions/common/extensions.js';
import { ILocalExtension, IGalleryExtension, InstallOperation, IExtensionGalleryService, Metadata, InstallOptions, IProductVersion, IAllowedExtensionsService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { areSameExtensions, getGalleryExtensionId } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IProfileAwareExtensionManagementService, IScannedExtension, IWebExtensionsScannerService } from './extensionManagement.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { AbstractExtensionManagementService, AbstractExtensionTask, IInstallExtensionTask, InstallExtensionTaskOptions, IUninstallExtensionTask, toExtensionManagementError, UninstallExtensionTaskOptions } from '../../../../platform/extensionManagement/common/abstractExtensionManagementService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { isBoolean, isUndefined } from '../../../../base/common/types.js';
import { DidChangeUserDataProfileEvent, IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { delta } from '../../../../base/common/arrays.js';
import { compare } from '../../../../base/common/strings.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';

export class WebExtensionManagementService extends AbstractExtensionManagementService implements IProfileAwareExtensionManagementService {

	declare readonly _serviceBrand: undefined;

	private readonly disposables = this._register(new DisposableStore());

	get onProfileAwareInstallExtension() { return super.onInstallExtension; }
	override get onInstallExtension() { return Event.filter(this.onProfileAwareInstallExtension, e => this.filterEvent(e), this.disposables); }

	get onProfileAwareDidInstallExtensions() { return super.onDidInstallExtensions; }
	override get onDidInstallExtensions() {
		return Event.filter(
			Event.map(this.onProfileAwareDidInstallExtensions, results => results.filter(e => this.filterEvent(e)), this.disposables),
			results => results.length > 0, this.disposables);
	}

	get onProfileAwareUninstallExtension() { return super.onUninstallExtension; }
	override get onUninstallExtension() { return Event.filter(this.onProfileAwareUninstallExtension, e => this.filterEvent(e), this.disposables); }

	get onProfileAwareDidUninstallExtension() { return super.onDidUninstallExtension; }
	override get onDidUninstallExtension() { return Event.filter(this.onProfileAwareDidUninstallExtension, e => this.filterEvent(e), this.disposables); }

	private readonly _onDidChangeProfile = this._register(new Emitter<{ readonly added: ILocalExtension[]; readonly removed: ILocalExtension[] }>());
	readonly onDidChangeProfile = this._onDidChangeProfile.event;

	get onProfileAwareDidUpdateExtensionMetadata() { return super.onDidUpdateExtensionMetadata; }

	constructor(
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@ITelemetryService telemetryService: ITelemetryService,
		@ILogService logService: ILogService,
		@IWebExtensionsScannerService private readonly webExtensionsScannerService: IWebExtensionsScannerService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IProductService productService: IProductService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
	) {
		super(extensionGalleryService, telemetryService, uriIdentityService, logService, productService, allowedExtensionsService, userDataProfilesService);
		this._register(userDataProfileService.onDidChangeCurrentProfile(e => {
			if (!this.uriIdentityService.extUri.isEqual(e.previous.extensionsResource, e.profile.extensionsResource)) {
				e.join(this.whenProfileChanged(e));
			}
		}));
	}

	private filterEvent({ profileLocation, applicationScoped }: { profileLocation?: URI; applicationScoped?: boolean }): boolean {
		profileLocation = profileLocation ?? this.userDataProfileService.currentProfile.extensionsResource;
		return applicationScoped || this.uriIdentityService.extUri.isEqual(this.userDataProfileService.currentProfile.extensionsResource, profileLocation);
	}

	async getTargetPlatform(): Promise<TargetPlatform> {
		return TargetPlatform.WEB;
	}

	protected override async isExtensionPlatformCompatible(extension: IGalleryExtension): Promise<boolean> {
		if (this.isConfiguredToExecuteOnWeb(extension)) {
			return true;
		}
		return super.isExtensionPlatformCompatible(extension);
	}

	async getInstalled(type?: ExtensionType, profileLocation?: URI): Promise<ILocalExtension[]> {
		const extensions = [];
		if (type === undefined || type === ExtensionType.System) {
			const systemExtensions = await this.webExtensionsScannerService.scanSystemExtensions();
			extensions.push(...systemExtensions);
		}
		if (type === undefined || type === ExtensionType.User) {
			const userExtensions = await this.webExtensionsScannerService.scanUserExtensions(profileLocation ?? this.userDataProfileService.currentProfile.extensionsResource);
			extensions.push(...userExtensions);
		}
		return extensions.map(e => toLocalExtension(e));
	}

	async install(location: URI, options: InstallOptions = {}): Promise<ILocalExtension> {
		this.logService.trace('ExtensionManagementService#install', location.toString());
		const manifest = await this.webExtensionsScannerService.scanExtensionManifest(location);
		if (!manifest || !manifest.name || !manifest.version) {
			throw new Error(`Cannot find a valid extension from the location ${location.toString()}`);
		}
		const result = await this.installExtensions([{ manifest, extension: location, options }]);
		if (result[0]?.local) {
			return result[0]?.local;
		}
		if (result[0]?.error) {
			throw result[0].error;
		}
		throw toExtensionManagementError(new Error(`Unknown error while installing extension ${getGalleryExtensionId(manifest.publisher, manifest.name)}`));
	}

	installFromLocation(location: URI, profileLocation: URI): Promise<ILocalExtension> {
		return this.install(location, { profileLocation });
	}

	protected async deleteExtension(extension: ILocalExtension): Promise<void> {
		// do nothing
	}

	protected async copyExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		const target = await this.webExtensionsScannerService.scanExistingExtension(extension.location, extension.type, toProfileLocation);
		const source = await this.webExtensionsScannerService.scanExistingExtension(extension.location, extension.type, fromProfileLocation);
		metadata = { ...source?.metadata, ...metadata };

		let scanned;
		if (target) {
			scanned = await this.webExtensionsScannerService.updateMetadata(extension, { ...target.metadata, ...metadata }, toProfileLocation);
		} else {
			scanned = await this.webExtensionsScannerService.addExtension(extension.location, metadata, toProfileLocation);
		}
		return toLocalExtension(scanned);
	}

	protected async moveExtension(extension: ILocalExtension, fromProfileLocation: URI, toProfileLocation: URI, metadata: Partial<Metadata>): Promise<ILocalExtension> {
		const target = await this.webExtensionsScannerService.scanExistingExtension(extension.location, extension.type, toProfileLocation);
		const source = await this.webExtensionsScannerService.scanExistingExtension(extension.location, extension.type, fromProfileLocation);
		metadata = { ...source?.metadata, ...metadata };

		let scanned;
		if (target) {
			scanned = await this.webExtensionsScannerService.updateMetadata(extension, { ...target.metadata, ...metadata }, toProfileLocation);
		} else {
			scanned = await this.webExtensionsScannerService.addExtension(extension.location, metadata, toProfileLocation);
			if (source) {
				await this.webExtensionsScannerService.removeExtension(source, fromProfileLocation);
			}
		}
		return toLocalExtension(scanned);
	}

	protected async removeExtension(extension: ILocalExtension, fromProfileLocation: URI): Promise<void> {
		const source = await this.webExtensionsScannerService.scanExistingExtension(extension.location, extension.type, fromProfileLocation);
		if (source) {
			await this.webExtensionsScannerService.removeExtension(source, fromProfileLocation);
		}
	}

	async installExtensionsFromProfile(extensions: IExtensionIdentifier[], fromProfileLocation: URI, toProfileLocation: URI): Promise<ILocalExtension[]> {
		const result: ILocalExtension[] = [];
		const extensionsToInstall = (await this.webExtensionsScannerService.scanUserExtensions(fromProfileLocation))
			.filter(e => extensions.some(id => areSameExtensions(id, e.identifier)));
		if (extensionsToInstall.length) {
			await Promise.allSettled(extensionsToInstall.map(async e => {
				let local = await this.installFromLocation(e.location, toProfileLocation);
				if (e.metadata) {
					local = await this.updateMetadata(local, e.metadata, fromProfileLocation);
				}
				result.push(local);
			}));
		}
		return result;
	}

	async updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, profileLocation: URI): Promise<ILocalExtension> {
		// unset if false
		if (metadata.isMachineScoped === false) {
			metadata.isMachineScoped = undefined;
		}
		if (metadata.isBuiltin === false) {
			metadata.isBuiltin = undefined;
		}
		if (metadata.pinned === false) {
			metadata.pinned = undefined;
		}
		const updatedExtension = await this.webExtensionsScannerService.updateMetadata(local, metadata, profileLocation);
		const updatedLocalExtension = toLocalExtension(updatedExtension);
		this._onDidUpdateExtensionMetadata.fire({ local: updatedLocalExtension, profileLocation });
		return updatedLocalExtension;
	}

	override async copyExtensions(fromProfileLocation: URI, toProfileLocation: URI): Promise<void> {
		await this.webExtensionsScannerService.copyExtensions(fromProfileLocation, toProfileLocation, e => !e.metadata?.isApplicationScoped);
	}

	protected override async getCompatibleVersion(extension: IGalleryExtension, sameVersion: boolean, includePreRelease: boolean, productVersion: IProductVersion): Promise<IGalleryExtension | null> {
		const compatibleExtension = await super.getCompatibleVersion(extension, sameVersion, includePreRelease, productVersion);
		if (compatibleExtension) {
			return compatibleExtension;
		}
		if (this.isConfiguredToExecuteOnWeb(extension)) {
			return extension;
		}
		return null;
	}

	private isConfiguredToExecuteOnWeb(gallery: IGalleryExtension): boolean {
		const configuredExtensionKind = this.extensionManifestPropertiesService.getUserConfiguredExtensionKind(gallery.identifier);
		return !!configuredExtensionKind && configuredExtensionKind.includes('web');
	}

	protected getCurrentExtensionsManifestLocation(): URI {
		return this.userDataProfileService.currentProfile.extensionsResource;
	}

	protected createInstallExtensionTask(manifest: IExtensionManifest, extension: URI | IGalleryExtension, options: InstallExtensionTaskOptions): IInstallExtensionTask {
		return new InstallExtensionTask(manifest, extension, options, this.webExtensionsScannerService, this.userDataProfilesService);
	}

	protected createUninstallExtensionTask(extension: ILocalExtension, options: UninstallExtensionTaskOptions): IUninstallExtensionTask {
		return new UninstallExtensionTask(extension, options, this.webExtensionsScannerService);
	}

	zip(extension: ILocalExtension): Promise<URI> { throw new Error('unsupported'); }
	getManifest(vsix: URI): Promise<IExtensionManifest> { throw new Error('unsupported'); }
	download(): Promise<URI> { throw new Error('unsupported'); }

	async cleanUp(): Promise<void> { }

	private async whenProfileChanged(e: DidChangeUserDataProfileEvent): Promise<void> {
		const previousProfileLocation = e.previous.extensionsResource;
		const currentProfileLocation = e.profile.extensionsResource;
		if (!previousProfileLocation || !currentProfileLocation) {
			throw new Error('This should not happen');
		}
		const oldExtensions = await this.webExtensionsScannerService.scanUserExtensions(previousProfileLocation);
		const newExtensions = await this.webExtensionsScannerService.scanUserExtensions(currentProfileLocation);
		const { added, removed } = delta(oldExtensions, newExtensions, (a, b) => compare(`${ExtensionIdentifier.toKey(a.identifier.id)}@${a.manifest.version}`, `${ExtensionIdentifier.toKey(b.identifier.id)}@${b.manifest.version}`));
		this._onDidChangeProfile.fire({ added: added.map(e => toLocalExtension(e)), removed: removed.map(e => toLocalExtension(e)) });
	}
}

function toLocalExtension(extension: IExtension): ILocalExtension {
	const metadata = getMetadata(undefined, extension);
	return {
		...extension,
		identifier: { id: extension.identifier.id, uuid: metadata.id ?? extension.identifier.uuid },
		isMachineScoped: !!metadata.isMachineScoped,
		isApplicationScoped: !!metadata.isApplicationScoped,
		publisherId: metadata.publisherId || null,
		publisherDisplayName: metadata.publisherDisplayName,
		installedTimestamp: metadata.installedTimestamp,
		isPreReleaseVersion: !!metadata.isPreReleaseVersion,
		hasPreReleaseVersion: !!metadata.hasPreReleaseVersion,
		preRelease: extension.preRelease,
		targetPlatform: TargetPlatform.WEB,
		updated: !!metadata.updated,
		pinned: !!metadata?.pinned,
		private: !!metadata.private,
		isWorkspaceScoped: false,
		source: metadata?.source ?? (extension.identifier.uuid ? 'gallery' : 'resource'),
		size: metadata.size ?? 0,
	};
}

function getMetadata(options?: InstallOptions, existingExtension?: IExtension): Metadata {
	const metadata: Metadata = { ...((<IScannedExtension>existingExtension)?.metadata || {}) };
	metadata.isMachineScoped = options?.isMachineScoped || metadata.isMachineScoped;
	return metadata;
}

class InstallExtensionTask extends AbstractExtensionTask<ILocalExtension> implements IInstallExtensionTask {

	readonly identifier: IExtensionIdentifier;
	readonly source: URI | IGalleryExtension;

	private _profileLocation: URI;
	get profileLocation() { return this._profileLocation; }

	private _operation = InstallOperation.Install;
	get operation() { return isUndefined(this.options.operation) ? this._operation : this.options.operation; }

	constructor(
		readonly manifest: IExtensionManifest,
		private readonly extension: URI | IGalleryExtension,
		readonly options: InstallExtensionTaskOptions,
		private readonly webExtensionsScannerService: IWebExtensionsScannerService,
		private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();
		this._profileLocation = options.profileLocation;
		this.identifier = URI.isUri(extension) ? { id: getGalleryExtensionId(manifest.publisher, manifest.name) } : extension.identifier;
		this.source = extension;
	}

	protected async doRun(token: CancellationToken): Promise<ILocalExtension> {
		const userExtensions = await this.webExtensionsScannerService.scanUserExtensions(this.options.profileLocation);
		const existingExtension = userExtensions.find(e => areSameExtensions(e.identifier, this.identifier));
		if (existingExtension) {
			this._operation = InstallOperation.Update;
		}

		const metadata = getMetadata(this.options, existingExtension);
		if (!URI.isUri(this.extension)) {
			metadata.id = this.extension.identifier.uuid;
			metadata.publisherDisplayName = this.extension.publisherDisplayName;
			metadata.publisherId = this.extension.publisherId;
			metadata.installedTimestamp = Date.now();
			metadata.isPreReleaseVersion = this.extension.properties.isPreReleaseVersion;
			metadata.hasPreReleaseVersion = metadata.hasPreReleaseVersion || this.extension.properties.isPreReleaseVersion;
			metadata.isBuiltin = this.options.isBuiltin || existingExtension?.isBuiltin;
			metadata.isSystem = existingExtension?.type === ExtensionType.System ? true : undefined;
			metadata.updated = !!existingExtension;
			metadata.isApplicationScoped = this.options.isApplicationScoped || metadata.isApplicationScoped;
			metadata.private = this.extension.private;
			metadata.preRelease = isBoolean(this.options.preRelease)
				? this.options.preRelease
				: this.options.installPreReleaseVersion || this.extension.properties.isPreReleaseVersion || metadata.preRelease;
			metadata.source = URI.isUri(this.extension) ? 'resource' : 'gallery';
		}
		metadata.pinned = this.options.installGivenVersion ? true : (this.options.pinned ?? metadata.pinned);

		this._profileLocation = metadata.isApplicationScoped ? this.userDataProfilesService.defaultProfile.extensionsResource : this.options.profileLocation;
		const scannedExtension = URI.isUri(this.extension) ? await this.webExtensionsScannerService.addExtension(this.extension, metadata, this.profileLocation)
			: await this.webExtensionsScannerService.addExtensionFromGallery(this.extension, metadata, this.profileLocation);
		return toLocalExtension(scannedExtension);
	}
}

class UninstallExtensionTask extends AbstractExtensionTask<void> implements IUninstallExtensionTask {

	constructor(
		readonly extension: ILocalExtension,
		readonly options: UninstallExtensionTaskOptions,
		private readonly webExtensionsScannerService: IWebExtensionsScannerService,
	) {
		super();
	}

	protected doRun(token: CancellationToken): Promise<void> {
		return this.webExtensionsScannerService.removeExtension(this.extension, this.options.profileLocation);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/extensionGalleryManifestService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/extensionGalleryManifestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter } from '../../../../base/common/event.js';
import { IHeaders } from '../../../../base/parts/request/common/request.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IExtensionGalleryManifestService, IExtensionGalleryManifest, ExtensionGalleryServiceUrlConfigKey, ExtensionGalleryManifestStatus } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestService as ExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifestService.js';
import { resolveMarketplaceHeaders } from '../../../../platform/externalServices/common/marketplace.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asJson, IRequestService } from '../../../../platform/request/common/request.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IDefaultAccountService } from '../../../../platform/defaultAccount/common/defaultAccount.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IHostService } from '../../host/browser/host.js';
import { IDefaultAccount } from '../../../../base/common/defaultAccount.js';

export class WorkbenchExtensionGalleryManifestService extends ExtensionGalleryManifestService implements IExtensionGalleryManifestService {

	private readonly commonHeadersPromise: Promise<IHeaders>;
	private extensionGalleryManifest: IExtensionGalleryManifest | null = null;

	private _onDidChangeExtensionGalleryManifest = this._register(new Emitter<IExtensionGalleryManifest | null>());
	override readonly onDidChangeExtensionGalleryManifest = this._onDidChangeExtensionGalleryManifest.event;

	private currentStatus: ExtensionGalleryManifestStatus = ExtensionGalleryManifestStatus.Unavailable;
	override get extensionGalleryManifestStatus(): ExtensionGalleryManifestStatus { return this.currentStatus; }
	private _onDidChangeExtensionGalleryManifestStatus = this._register(new Emitter<ExtensionGalleryManifestStatus>());
	override readonly onDidChangeExtensionGalleryManifestStatus = this._onDidChangeExtensionGalleryManifestStatus.event;

	constructor(
		@IProductService productService: IProductService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IFileService fileService: IFileService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IRequestService private readonly requestService: IRequestService,
		@IDefaultAccountService private readonly defaultAccountService: IDefaultAccountService,
		@ILogService private readonly logService: ILogService,
		@IDialogService private readonly dialogService: IDialogService,
		@IHostService private readonly hostService: IHostService,
	) {
		super(productService);
		this.commonHeadersPromise = resolveMarketplaceHeaders(
			productService.version,
			productService,
			environmentService,
			configurationService,
			fileService,
			storageService,
			telemetryService);

		const channels = [sharedProcessService.getChannel('extensionGalleryManifest')];
		const remoteConnection = remoteAgentService.getConnection();
		if (remoteConnection) {
			channels.push(remoteConnection.getChannel('extensionGalleryManifest'));
		}
		this.getExtensionGalleryManifest().then(manifest => {
			channels.forEach(channel => channel.call('setExtensionGalleryManifest', [manifest]));
		});
	}

	private extensionGalleryManifestPromise: Promise<void> | undefined;
	override async getExtensionGalleryManifest(): Promise<IExtensionGalleryManifest | null> {
		if (!this.extensionGalleryManifestPromise) {
			this.extensionGalleryManifestPromise = this.doGetExtensionGalleryManifest();
		}
		await this.extensionGalleryManifestPromise;
		return this.extensionGalleryManifest;
	}

	private async doGetExtensionGalleryManifest(): Promise<void> {
		const defaultServiceUrl = this.productService.extensionsGallery?.serviceUrl;
		if (!defaultServiceUrl) {
			return;
		}

		const configuredServiceUrl = this.configurationService.getValue<string>(ExtensionGalleryServiceUrlConfigKey);
		if (configuredServiceUrl) {
			await this.handleDefaultAccountAccess(configuredServiceUrl);
			this._register(this.defaultAccountService.onDidChangeDefaultAccount(() => this.handleDefaultAccountAccess(configuredServiceUrl)));
		} else {
			const defaultExtensionGalleryManifest = await super.getExtensionGalleryManifest();
			this.update(defaultExtensionGalleryManifest);
		}

		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (!e.affectsConfiguration(ExtensionGalleryServiceUrlConfigKey)) {
				return;
			}
			this.requestRestart();
		}));
	}

	private async handleDefaultAccountAccess(configuredServiceUrl: string): Promise<void> {
		const account = await this.defaultAccountService.getDefaultAccount();

		if (!account) {
			this.logService.debug('[Marketplace] Enterprise marketplace configured but user not signed in');
			this.update(null, ExtensionGalleryManifestStatus.RequiresSignIn);
		} else if (!this.checkAccess(account)) {
			this.logService.debug('[Marketplace] User signed in but lacks access to enterprise marketplace');
			this.update(null, ExtensionGalleryManifestStatus.AccessDenied);
		} else if (this.currentStatus !== ExtensionGalleryManifestStatus.Available) {
			try {
				const manifest = await this.getExtensionGalleryManifestFromServiceUrl(configuredServiceUrl);
				this.update(manifest);
				this.telemetryService.publicLog2<
					{},
					{
						owner: 'sandy081';
						comment: 'Reports when a user successfully accesses a custom marketplace';
					}>('galleryservice:custom:marketplace');
			} catch (error) {
				this.logService.error('[Marketplace] Error retrieving enterprise gallery manifest', error);
				this.update(null, ExtensionGalleryManifestStatus.AccessDenied);
			}
		}
	}

	private update(manifest: IExtensionGalleryManifest | null, status?: ExtensionGalleryManifestStatus): void {
		if (this.extensionGalleryManifest !== manifest) {
			this.extensionGalleryManifest = manifest;
			this._onDidChangeExtensionGalleryManifest.fire(manifest);
		}
		this.updateStatus(status ?? (this.extensionGalleryManifest ? ExtensionGalleryManifestStatus.Available : ExtensionGalleryManifestStatus.Unavailable));
	}

	private updateStatus(status: ExtensionGalleryManifestStatus): void {
		if (this.currentStatus !== status) {
			this.currentStatus = status;
			this._onDidChangeExtensionGalleryManifestStatus.fire(status);
		}
	}

	private checkAccess(account: IDefaultAccount): boolean {
		this.logService.debug('[Marketplace] Checking Account SKU access for configured gallery', account.access_type_sku);
		if (account.access_type_sku && this.productService.extensionsGallery?.accessSKUs?.includes(account.access_type_sku)) {
			this.logService.debug('[Marketplace] Account has access to configured gallery');
			return true;
		}
		this.logService.debug('[Marketplace] Checking enterprise account access for configured gallery', account.enterprise);
		return account.enterprise;
	}

	private async requestRestart(): Promise<void> {
		const confirmation = await this.dialogService.confirm({
			message: localize('extensionGalleryManifestService.accountChange', "{0} is now configured to a different Marketplace. Please restart to apply the changes.", this.productService.nameLong),
			primaryButton: localize({ key: 'restart', comment: ['&& denotes a mnemonic'] }, "&&Restart")
		});
		if (confirmation.confirmed) {
			return this.hostService.restart();
		}
	}

	private async getExtensionGalleryManifestFromServiceUrl(url: string): Promise<IExtensionGalleryManifest> {
		const commonHeaders = await this.commonHeadersPromise;
		const headers = {
			...commonHeaders,
			'Content-Type': 'application/json',
			'Accept-Encoding': 'gzip',
		};

		try {
			const context = await this.requestService.request({
				type: 'GET',
				url,
				headers,
			}, CancellationToken.None);

			const extensionGalleryManifest = await asJson<IExtensionGalleryManifest>(context);

			if (!extensionGalleryManifest) {
				throw new Error('Unable to retrieve extension gallery manifest.');
			}

			return extensionGalleryManifest;
		} catch (error) {
			this.logService.error('[Marketplace] Error retrieving extension gallery manifest', error);
			throw error;
		}
	}
}

registerSingleton(IExtensionGalleryManifestService, WorkbenchExtensionGalleryManifestService, InstantiationType.Eager);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/extensionManagementServerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/extensionManagementServerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Schemas } from '../../../../base/common/network.js';
import { ExtensionInstallLocation, IExtensionManagementServer, IExtensionManagementServerService } from '../common/extensionManagement.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { NativeRemoteExtensionManagementService } from './remoteExtensionManagementService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IExtension } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { NativeExtensionManagementService } from './nativeExtensionManagementService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

export class ExtensionManagementServerService extends Disposable implements IExtensionManagementServerService {

	declare readonly _serviceBrand: undefined;

	readonly localExtensionManagementServer: IExtensionManagementServer;
	readonly remoteExtensionManagementServer: IExtensionManagementServer | null = null;
	readonly webExtensionManagementServer: IExtensionManagementServer | null = null;

	constructor(
		@ISharedProcessService sharedProcessService: ISharedProcessService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ILabelService labelService: ILabelService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		super();
		const localExtensionManagementService = this._register(instantiationService.createInstance(NativeExtensionManagementService, sharedProcessService.getChannel('extensions')));
		this.localExtensionManagementServer = { extensionManagementService: localExtensionManagementService, id: 'local', label: localize('local', "Local") };
		const remoteAgentConnection = remoteAgentService.getConnection();
		if (remoteAgentConnection) {
			const extensionManagementService = instantiationService.createInstance(NativeRemoteExtensionManagementService, remoteAgentConnection.getChannel<IChannel>('extensions'), this.localExtensionManagementServer);
			this.remoteExtensionManagementServer = {
				id: 'remote',
				extensionManagementService,
				get label() { return labelService.getHostLabel(Schemas.vscodeRemote, remoteAgentConnection.remoteAuthority) || localize('remote', "Remote"); },
			};
		}

	}

	getExtensionManagementServer(extension: IExtension): IExtensionManagementServer {
		if (extension.location.scheme === Schemas.file) {
			return this.localExtensionManagementServer;
		}
		if (this.remoteExtensionManagementServer && extension.location.scheme === Schemas.vscodeRemote) {
			return this.remoteExtensionManagementServer;
		}
		throw new Error(`Invalid Extension ${extension.location}`);
	}

	getExtensionInstallLocation(extension: IExtension): ExtensionInstallLocation | null {
		const server = this.getExtensionManagementServer(extension);
		return server === this.remoteExtensionManagementServer ? ExtensionInstallLocation.Remote : ExtensionInstallLocation.Local;
	}
}

registerSingleton(IExtensionManagementServerService, ExtensionManagementServerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/extensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/extensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { generateUuid } from '../../../../base/common/uuid.js';
import { ILocalExtension, IExtensionGalleryService, InstallOptions, IAllowedExtensionsService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionManagementService as BaseExtensionManagementService } from '../common/extensionManagementService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IExtensionManagementServer, IExtensionManagementServerService, IWorkbenchExtensionManagementService } from '../common/extensionManagement.js';
import { Schemas } from '../../../../base/common/network.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDownloadService } from '../../../../platform/download/common/download.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IExtensionsScannerService } from '../../../../platform/extensionManagement/common/extensionsScannerService.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';

export class ExtensionManagementService extends BaseExtensionManagementService {

	constructor(
		@INativeWorkbenchEnvironmentService private readonly environmentService: INativeWorkbenchEnvironmentService,
		@IExtensionManagementServerService extensionManagementServerService: IExtensionManagementServerService,
		@IExtensionGalleryService extensionGalleryService: IExtensionGalleryService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IConfigurationService configurationService: IConfigurationService,
		@IProductService productService: IProductService,
		@IDownloadService downloadService: IDownloadService,
		@IUserDataSyncEnablementService userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IDialogService dialogService: IDialogService,
		@IWorkspaceTrustRequestService workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IExtensionManifestPropertiesService extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IFileService fileService: IFileService,
		@ILogService logService: ILogService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IExtensionsScannerService extensionsScannerService: IExtensionsScannerService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IStorageService storageService: IStorageService,
		@ITelemetryService telemetryService: ITelemetryService,
	) {
		super(
			extensionManagementServerService,
			extensionGalleryService,
			userDataProfileService,
			userDataProfilesService,
			configurationService,
			productService,
			downloadService,
			userDataSyncEnablementService,
			dialogService,
			workspaceTrustRequestService,
			extensionManifestPropertiesService,
			fileService,
			logService,
			instantiationService,
			extensionsScannerService,
			allowedExtensionsService,
			storageService,
			telemetryService
		);
	}

	protected override async installVSIXInServer(vsix: URI, server: IExtensionManagementServer, options: InstallOptions | undefined): Promise<ILocalExtension> {
		if (vsix.scheme === Schemas.vscodeRemote && server === this.extensionManagementServerService.localExtensionManagementServer) {
			const downloadedLocation = joinPath(this.environmentService.tmpDir, generateUuid());
			await this.downloadService.download(vsix, downloadedLocation);
			vsix = downloadedLocation;
		}
		return super.installVSIXInServer(vsix, server, options);
	}
}

registerSingleton(IWorkbenchExtensionManagementService, ExtensionManagementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/extensionTipsService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/extensionTipsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { IExtensionTipsService, IExecutableBasedExtensionTip, IConfigBasedExtensionTip } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionTipsService } from '../../../../platform/extensionManagement/common/extensionTipsService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Schemas } from '../../../../base/common/network.js';

class NativeExtensionTipsService extends ExtensionTipsService implements IExtensionTipsService {

	private readonly channel: IChannel;

	constructor(
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@ISharedProcessService sharedProcessService: ISharedProcessService
	) {
		super(fileService, productService);
		this.channel = sharedProcessService.getChannel('extensionTipsService');
	}

	override getConfigBasedTips(folder: URI): Promise<IConfigBasedExtensionTip[]> {
		if (folder.scheme === Schemas.file) {
			return this.channel.call<IConfigBasedExtensionTip[]>('getConfigBasedTips', [folder]);
		}
		return super.getConfigBasedTips(folder);
	}

	override getImportantExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		return this.channel.call<IExecutableBasedExtensionTip[]>('getImportantExecutableBasedTips');
	}

	override getOtherExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]> {
		return this.channel.call<IExecutableBasedExtensionTip[]>('getOtherExecutableBasedTips');
	}

}

registerSingleton(IExtensionTipsService, NativeExtensionTipsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/nativeExtensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/nativeExtensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { DidChangeProfileEvent, IProfileAwareExtensionManagementService } from '../common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { IAllowedExtensionsService, ILocalExtension, InstallOptions } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { joinPath } from '../../../../base/common/resources.js';
import { Schemas } from '../../../../base/common/network.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IDownloadService } from '../../../../platform/download/common/download.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { ProfileAwareExtensionManagementChannelClient } from '../common/extensionManagementChannelClient.js';
import { ExtensionIdentifier, ExtensionType, isResolverExtension } from '../../../../platform/extensions/common/extensions.js';
import { INativeWorkbenchEnvironmentService } from '../../environment/electron-browser/environmentService.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export class NativeExtensionManagementService extends ProfileAwareExtensionManagementChannelClient implements IProfileAwareExtensionManagementService {

	constructor(
		channel: IChannel,
		@IProductService productService: IProductService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IFileService private readonly fileService: IFileService,
		@IDownloadService private readonly downloadService: IDownloadService,
		@INativeWorkbenchEnvironmentService private readonly nativeEnvironmentService: INativeWorkbenchEnvironmentService,
		@ILogService private readonly logService: ILogService,
	) {
		super(channel, productService, allowedExtensionsService, userDataProfileService, uriIdentityService);
	}

	protected filterEvent(profileLocation: URI, isApplicationScoped: boolean): boolean {
		return isApplicationScoped || this.uriIdentityService.extUri.isEqual(this.userDataProfileService.currentProfile.extensionsResource, profileLocation);
	}

	override async install(vsix: URI, options?: InstallOptions): Promise<ILocalExtension> {
		const { location, cleanup } = await this.downloadVsix(vsix);
		try {
			return await super.install(location, options);
		} finally {
			await cleanup();
		}
	}

	private async downloadVsix(vsix: URI): Promise<{ location: URI; cleanup: () => Promise<void> }> {
		if (vsix.scheme === Schemas.file) {
			return { location: vsix, async cleanup() { } };
		}
		this.logService.trace('Downloading extension from', vsix.toString());
		const location = joinPath(this.nativeEnvironmentService.extensionsDownloadLocation, generateUuid());
		await this.downloadService.download(vsix, location);
		this.logService.info('Downloaded extension to', location.toString());
		const cleanup = async () => {
			try {
				await this.fileService.del(location);
			} catch (error) {
				this.logService.error(error);
			}
		};
		return { location, cleanup };
	}

	protected override async switchExtensionsProfile(previousProfileLocation: URI, currentProfileLocation: URI, preserveExtensions?: ExtensionIdentifier[]): Promise<DidChangeProfileEvent> {
		if (this.nativeEnvironmentService.remoteAuthority) {
			const previousInstalledExtensions = await this.getInstalled(ExtensionType.User, previousProfileLocation);
			const resolverExtension = previousInstalledExtensions.find(e => isResolverExtension(e.manifest, this.nativeEnvironmentService.remoteAuthority));
			if (resolverExtension) {
				if (!preserveExtensions) {
					preserveExtensions = [];
				}
				preserveExtensions.push(new ExtensionIdentifier(resolverExtension.identifier.id));
			}
		}
		return super.switchExtensionsProfile(previousProfileLocation, currentProfileLocation, preserveExtensions);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/electron-browser/remoteExtensionManagementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/electron-browser/remoteExtensionManagementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { ILocalExtension, IGalleryExtension, IExtensionGalleryService, InstallOperation, InstallOptions, ExtensionManagementError, ExtensionManagementErrorCode, EXTENSION_INSTALL_CLIENT_TARGET_PLATFORM_CONTEXT, IAllowedExtensionsService, VerifyExtensionSignatureConfigKey } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionType, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { localize } from '../../../../nls.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IExtensionManagementServer } from '../common/extensionManagement.js';
import { Promises } from '../../../../base/common/async.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { RemoteExtensionManagementService } from '../common/remoteExtensionManagementService.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IRemoteUserDataProfilesService } from '../../userDataProfile/common/remoteUserDataProfiles.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { areApiProposalsCompatible } from '../../../../platform/extensions/common/extensionValidator.js';
import { isBoolean, isUndefined } from '../../../../base/common/types.js';

export class NativeRemoteExtensionManagementService extends RemoteExtensionManagementService {

	constructor(
		channel: IChannel,
		private readonly localExtensionManagementServer: IExtensionManagementServer,
		@IProductService productService: IProductService,
		@IUserDataProfileService userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IRemoteUserDataProfilesService remoteUserDataProfilesService: IRemoteUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService private readonly logService: ILogService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IFileService private readonly fileService: IFileService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
	) {
		super(channel, productService, allowedExtensionsService, userDataProfileService, userDataProfilesService, remoteUserDataProfilesService, uriIdentityService);
	}

	override async install(vsix: URI, options?: InstallOptions): Promise<ILocalExtension> {
		const local = await super.install(vsix, options);
		await this.installUIDependenciesAndPackedExtensions(local);
		return local;
	}

	override async installFromGallery(extension: IGalleryExtension, installOptions: InstallOptions = {}): Promise<ILocalExtension> {
		if (isUndefined(installOptions.donotVerifySignature)) {
			const value = this.configurationService.getValue(VerifyExtensionSignatureConfigKey);
			installOptions.donotVerifySignature = isBoolean(value) ? !value : undefined;
		}
		const local = await this.doInstallFromGallery(extension, installOptions);
		await this.installUIDependenciesAndPackedExtensions(local);
		return local;
	}

	private async doInstallFromGallery(extension: IGalleryExtension, installOptions: InstallOptions): Promise<ILocalExtension> {
		if (installOptions.downloadExtensionsLocally || this.configurationService.getValue('remote.downloadExtensionsLocally')) {
			return this.downloadAndInstall(extension, installOptions);
		}
		try {
			const clientTargetPlatform = await this.localExtensionManagementServer.extensionManagementService.getTargetPlatform();
			return await super.installFromGallery(extension, { ...installOptions, context: { ...installOptions?.context, [EXTENSION_INSTALL_CLIENT_TARGET_PLATFORM_CONTEXT]: clientTargetPlatform } });
		} catch (error) {
			switch (error.name) {
				case ExtensionManagementErrorCode.Download:
				case ExtensionManagementErrorCode.DownloadSignature:
				case ExtensionManagementErrorCode.Gallery:
				case ExtensionManagementErrorCode.Internal:
				case ExtensionManagementErrorCode.Unknown:
					try {
						this.logService.error(`Error while installing '${extension.identifier.id}' extension in the remote server.`, toErrorMessage(error));
						return await this.downloadAndInstall(extension, installOptions);
					} catch (e) {
						this.logService.error(e);
						throw e;
					}
				default:
					this.logService.debug('Remote Install Error Name', error.name);
					throw error;
			}
		}
	}

	private async downloadAndInstall(extension: IGalleryExtension, installOptions: InstallOptions): Promise<ILocalExtension> {
		this.logService.info(`Downloading the '${extension.identifier.id}' extension locally and install`);
		const compatible = await this.checkAndGetCompatible(extension, !!installOptions.installPreReleaseVersion);
		installOptions = { ...installOptions, donotIncludePackAndDependencies: true };
		const installed = await this.getInstalled(ExtensionType.User, undefined, installOptions.productVersion);
		const workspaceExtensions = await this.getAllWorkspaceDependenciesAndPackedExtensions(compatible, CancellationToken.None);
		if (workspaceExtensions.length) {
			this.logService.info(`Downloading the workspace dependencies and packed extensions of '${compatible.identifier.id}' locally and install`);
			for (const workspaceExtension of workspaceExtensions) {
				await this.downloadCompatibleAndInstall(workspaceExtension, installed, installOptions);
			}
		}
		return await this.downloadCompatibleAndInstall(compatible, installed, installOptions);
	}

	private async downloadCompatibleAndInstall(extension: IGalleryExtension, installed: ILocalExtension[], installOptions: InstallOptions): Promise<ILocalExtension> {
		const compatible = await this.checkAndGetCompatible(extension, !!installOptions.installPreReleaseVersion);
		this.logService.trace('Downloading extension:', compatible.identifier.id);
		const location = await this.localExtensionManagementServer.extensionManagementService.download(compatible, installed.filter(i => areSameExtensions(i.identifier, compatible.identifier))[0] ? InstallOperation.Update : InstallOperation.Install, !!installOptions.donotVerifySignature);
		this.logService.info('Downloaded extension:', compatible.identifier.id, location.path);
		try {
			const local = await super.install(location, { ...installOptions, keepExisting: true });
			this.logService.info(`Successfully installed '${compatible.identifier.id}' extension`);
			return local;
		} finally {
			try {
				await this.fileService.del(location);
			} catch (error) {
				this.logService.error(error);
			}
		}
	}

	private async checkAndGetCompatible(extension: IGalleryExtension, includePreRelease: boolean): Promise<IGalleryExtension> {
		const targetPlatform = await this.getTargetPlatform();
		let compatibleExtension: IGalleryExtension | null = null;

		if (extension.hasPreReleaseVersion && extension.properties.isPreReleaseVersion !== includePreRelease) {
			compatibleExtension = (await this.galleryService.getExtensions([{ ...extension.identifier, preRelease: includePreRelease }], { targetPlatform, compatible: true }, CancellationToken.None))[0] || null;
		}

		if (!compatibleExtension && await this.galleryService.isExtensionCompatible(extension, includePreRelease, targetPlatform)) {
			compatibleExtension = extension;
		}

		if (!compatibleExtension) {
			compatibleExtension = await this.galleryService.getCompatibleExtension(extension, includePreRelease, targetPlatform);
		}

		if (!compatibleExtension) {
			const incompatibleApiProposalsMessages: string[] = [];
			if (!areApiProposalsCompatible(extension.properties.enabledApiProposals ?? [], incompatibleApiProposalsMessages)) {
				throw new ExtensionManagementError(localize('incompatibleAPI', "Can't install '{0}' extension. {1}", extension.displayName ?? extension.identifier.id, incompatibleApiProposalsMessages[0]), ExtensionManagementErrorCode.IncompatibleApi);
			}
			/** If no compatible release version is found, check if the extension has a release version or not and throw relevant error */
			if (!includePreRelease && extension.properties.isPreReleaseVersion && (await this.galleryService.getExtensions([extension.identifier], CancellationToken.None))[0]) {
				throw new ExtensionManagementError(localize('notFoundReleaseExtension', "Can't install release version of '{0}' extension because it has no release version.", extension.identifier.id), ExtensionManagementErrorCode.ReleaseVersionNotFound);
			}
			throw new ExtensionManagementError(localize('notFoundCompatibleDependency', "Can't install '{0}' extension because it is not compatible with the current version of {1} (version {2}).", extension.identifier.id, this.productService.nameLong, this.productService.version), ExtensionManagementErrorCode.Incompatible);
		}

		return compatibleExtension;
	}

	private async installUIDependenciesAndPackedExtensions(local: ILocalExtension): Promise<void> {
		const uiExtensions = await this.getAllUIDependenciesAndPackedExtensions(local.manifest, CancellationToken.None);
		const installed = await this.localExtensionManagementServer.extensionManagementService.getInstalled();
		const toInstall = uiExtensions.filter(e => installed.every(i => !areSameExtensions(i.identifier, e.identifier)));
		if (toInstall.length) {
			this.logService.info(`Installing UI dependencies and packed extensions of '${local.identifier.id}' locally`);
			await Promises.settled(toInstall.map(d => this.localExtensionManagementServer.extensionManagementService.installFromGallery(d)));
		}
	}

	private async getAllUIDependenciesAndPackedExtensions(manifest: IExtensionManifest, token: CancellationToken): Promise<IGalleryExtension[]> {
		const result = new Map<string, IGalleryExtension>();
		const extensions = [...(manifest.extensionPack || []), ...(manifest.extensionDependencies || [])];
		await this.getDependenciesAndPackedExtensionsRecursively(extensions, result, true, token);
		return [...result.values()];
	}

	private async getAllWorkspaceDependenciesAndPackedExtensions(extension: IGalleryExtension, token: CancellationToken): Promise<IGalleryExtension[]> {
		const result = new Map<string, IGalleryExtension>();
		result.set(extension.identifier.id.toLowerCase(), extension);
		const manifest = await this.galleryService.getManifest(extension, token);
		if (manifest) {
			const extensions = [...(manifest.extensionPack || []), ...(manifest.extensionDependencies || [])];
			await this.getDependenciesAndPackedExtensionsRecursively(extensions, result, false, token);
		}
		result.delete(extension.identifier.id);
		return [...result.values()];
	}

	private async getDependenciesAndPackedExtensionsRecursively(toGet: string[], result: Map<string, IGalleryExtension>, uiExtension: boolean, token: CancellationToken): Promise<void> {
		if (toGet.length === 0) {
			return Promise.resolve();
		}

		const extensions = await this.galleryService.getExtensions(toGet.map(id => ({ id })), token);
		const manifests = await Promise.all(extensions.map(e => this.galleryService.getManifest(e, token)));
		const extensionsManifests: IExtensionManifest[] = [];
		for (let idx = 0; idx < extensions.length; idx++) {
			const extension = extensions[idx];
			const manifest = manifests[idx];
			if (manifest && this.extensionManifestPropertiesService.prefersExecuteOnUI(manifest) === uiExtension) {
				result.set(extension.identifier.id.toLowerCase(), extension);
				extensionsManifests.push(manifest);
			}
		}
		toGet = [];
		for (const extensionManifest of extensionsManifests) {
			if (isNonEmptyArray(extensionManifest.extensionDependencies)) {
				for (const id of extensionManifest.extensionDependencies) {
					if (!result.has(id.toLowerCase())) {
						toGet.push(id);
					}
				}
			}
			if (isNonEmptyArray(extensionManifest.extensionPack)) {
				for (const id of extensionManifest.extensionPack) {
					if (!result.has(id.toLowerCase())) {
						toGet.push(id);
					}
				}
			}
		}
		return this.getDependenciesAndPackedExtensionsRecursively(toGet, result, uiExtension, token);
	}
}
```

--------------------------------------------------------------------------------

````
