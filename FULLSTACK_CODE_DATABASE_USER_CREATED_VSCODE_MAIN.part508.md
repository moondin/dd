---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 508
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 508 of 552)

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

---[FILE: src/vs/workbench/services/extensions/common/abstractExtensionService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/abstractExtensionService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Barrier } from '../../../../base/common/async.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Emitter } from '../../../../base/common/event.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import * as perf from '../../../../base/common/performance.js';
import { isCI } from '../../../../base/common/platform.js';
import { isEqualOrParent } from '../../../../base/common/resources.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { isDefined } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import * as nls from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstallOperation } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ImplicitActivationEvents } from '../../../../platform/extensionManagement/common/implicitActivationEvents.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, IExtension, IExtensionContributions, IExtensionDescription, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { handleVetos } from '../../../../platform/lifecycle/common/lifecycle.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IRemoteAuthorityResolverService, RemoteAuthorityResolverError, RemoteAuthorityResolverErrorCode, ResolverResult, getRemoteAuthorityPrefix } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteExtensionsScannerService } from '../../../../platform/remote/common/remoteExtensionsScanner.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IExtensionFeaturesRegistry, Extensions as ExtensionFeaturesExtensions, IExtensionFeatureMarkdownRenderer, IRenderedData, } from '../../extensionManagement/common/extensionFeatures.js';
import { IWorkbenchExtensionEnablementService, IWorkbenchExtensionManagementService } from '../../extensionManagement/common/extensionManagement.js';
import { ExtensionDescriptionRegistryLock, ExtensionDescriptionRegistrySnapshot, IActivationEventsReader, LockableExtensionDescriptionRegistry } from './extensionDescriptionRegistry.js';
import { parseExtensionDevOptions } from './extensionDevOptions.js';
import { ExtensionHostKind, ExtensionRunningPreference, IExtensionHostKindPicker } from './extensionHostKind.js';
import { ExtensionHostManager } from './extensionHostManager.js';
import { IExtensionHostManager } from './extensionHostManagers.js';
import { IResolveAuthorityErrorResult } from './extensionHostProxy.js';
import { IExtensionManifestPropertiesService } from './extensionManifestPropertiesService.js';
import { ExtensionRunningLocation, LocalProcessRunningLocation, LocalWebWorkerRunningLocation, RemoteRunningLocation } from './extensionRunningLocation.js';
import { ExtensionRunningLocationTracker, filterExtensionIdentifiers } from './extensionRunningLocationTracker.js';
import { ActivationKind, ActivationTimes, ExtensionActivationReason, ExtensionHostStartup, ExtensionPointContribution, IExtensionHost, IExtensionInspectInfo, IExtensionService, IExtensionsStatus, IInternalExtensionService, IMessage, IResponsiveStateChangeEvent, IWillActivateEvent, WillStopExtensionHostsEvent, toExtension, toExtensionDescription } from './extensions.js';
import { ExtensionsProposedApi } from './extensionsProposedApi.js';
import { ExtensionMessageCollector, ExtensionPoint, ExtensionsRegistry, IExtensionPoint, IExtensionPointUser } from './extensionsRegistry.js';
import { LazyCreateExtensionHostManager } from './lazyCreateExtensionHostManager.js';
import { ResponsiveState } from './rpcProtocol.js';
import { IExtensionActivationHost as IWorkspaceContainsActivationHost, checkActivateWorkspaceContainsExtension, checkGlobFileExists } from './workspaceContains.js';
import { ILifecycleService, WillShutdownJoinerOrder } from '../../lifecycle/common/lifecycle.js';
import { IExtensionHostExitInfo, IRemoteAgentService } from '../../remote/common/remoteAgentService.js';

const hasOwnProperty = Object.hasOwnProperty;
const NO_OP_VOID_PROMISE = Promise.resolve<void>(undefined);

export abstract class AbstractExtensionService extends Disposable implements IExtensionService {

	public _serviceBrand: undefined;

	private readonly _hasLocalProcess: boolean;
	private readonly _allowRemoteExtensionsInLocalWebWorker: boolean;

	private readonly _onDidRegisterExtensions = this._register(new Emitter<void>());
	public readonly onDidRegisterExtensions = this._onDidRegisterExtensions.event;

	private readonly _onDidChangeExtensionsStatus = this._register(new Emitter<ExtensionIdentifier[]>());
	public readonly onDidChangeExtensionsStatus = this._onDidChangeExtensionsStatus.event;

	private readonly _onDidChangeExtensions = this._register(new Emitter<{ readonly added: ReadonlyArray<IExtensionDescription>; readonly removed: ReadonlyArray<IExtensionDescription> }>({ leakWarningThreshold: 400 }));
	public readonly onDidChangeExtensions = this._onDidChangeExtensions.event;

	private readonly _onWillActivateByEvent = this._register(new Emitter<IWillActivateEvent>());
	public readonly onWillActivateByEvent = this._onWillActivateByEvent.event;

	private readonly _onDidChangeResponsiveChange = this._register(new Emitter<IResponsiveStateChangeEvent>());
	public readonly onDidChangeResponsiveChange = this._onDidChangeResponsiveChange.event;

	private readonly _onWillStop = this._register(new Emitter<WillStopExtensionHostsEvent>());
	public readonly onWillStop = this._onWillStop.event;

	private readonly _activationEventReader = new ImplicitActivationAwareReader();
	private readonly _registry = new LockableExtensionDescriptionRegistry(this._activationEventReader);
	private readonly _installedExtensionsReady = new Barrier();
	private readonly _extensionStatus = new ExtensionIdentifierMap<ExtensionStatus>();
	private readonly _allRequestedActivateEvents = new Set<string>();
	private readonly _runningLocations: ExtensionRunningLocationTracker;
	private readonly _remoteCrashTracker = new ExtensionHostCrashTracker();

	private _deltaExtensionsQueue: DeltaExtensionsQueueItem[] = [];
	private _inHandleDeltaExtensions = false;

	private readonly _extensionHostManagers = this._register(new ExtensionHostCollection());

	private _resolveAuthorityAttempt: number = 0;

	constructor(
		options: { hasLocalProcess: boolean; allowRemoteExtensionsInLocalWebWorker: boolean },
		private readonly _extensionsProposedApi: ExtensionsProposedApi,
		private readonly _extensionHostFactory: IExtensionHostFactory,
		private readonly _extensionHostKindPicker: IExtensionHostKindPicker,
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
		@INotificationService protected readonly _notificationService: INotificationService,
		@IWorkbenchEnvironmentService protected readonly _environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService protected readonly _telemetryService: ITelemetryService,
		@IWorkbenchExtensionEnablementService protected readonly _extensionEnablementService: IWorkbenchExtensionEnablementService,
		@IFileService protected readonly _fileService: IFileService,
		@IProductService protected readonly _productService: IProductService,
		@IWorkbenchExtensionManagementService protected readonly _extensionManagementService: IWorkbenchExtensionManagementService,
		@IWorkspaceContextService private readonly _contextService: IWorkspaceContextService,
		@IConfigurationService protected readonly _configurationService: IConfigurationService,
		@IExtensionManifestPropertiesService private readonly _extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@ILogService protected readonly _logService: ILogService,
		@IRemoteAgentService protected readonly _remoteAgentService: IRemoteAgentService,
		@IRemoteExtensionsScannerService protected readonly _remoteExtensionsScannerService: IRemoteExtensionsScannerService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@IRemoteAuthorityResolverService protected readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IDialogService private readonly _dialogService: IDialogService,
	) {
		super();

		this._hasLocalProcess = options.hasLocalProcess;
		this._allowRemoteExtensionsInLocalWebWorker = options.allowRemoteExtensionsInLocalWebWorker;

		// help the file service to activate providers by activating extensions by file system event
		this._register(this._fileService.onWillActivateFileSystemProvider(e => {
			if (e.scheme !== Schemas.vscodeRemote) {
				e.join(this.activateByEvent(`onFileSystem:${e.scheme}`));
			}
		}));

		this._runningLocations = new ExtensionRunningLocationTracker(
			this._registry,
			this._extensionHostKindPicker,
			this._environmentService,
			this._configurationService,
			this._logService,
			this._extensionManifestPropertiesService
		);

		this._register(this._extensionEnablementService.onEnablementChanged((extensions) => {
			const toAdd: IExtension[] = [];
			const toRemove: IExtension[] = [];
			for (const extension of extensions) {
				if (this._safeInvokeIsEnabled(extension)) {
					// an extension has been enabled
					toAdd.push(extension);
				} else {
					// an extension has been disabled
					toRemove.push(extension);
				}
			}
			if (isCI) {
				this._logService.info(`AbstractExtensionService.onEnablementChanged fired for ${extensions.map(e => e.identifier.id).join(', ')}`);
			}
			this._handleDeltaExtensions(new DeltaExtensionsQueueItem(toAdd, toRemove));
		}));

		this._register(this._extensionManagementService.onDidChangeProfile(({ added, removed }) => {
			if (added.length || removed.length) {
				if (isCI) {
					this._logService.info(`AbstractExtensionService.onDidChangeProfile fired`);
				}
				this._handleDeltaExtensions(new DeltaExtensionsQueueItem(added, removed));
			}
		}));

		this._register(this._extensionManagementService.onDidEnableExtensions(extensions => {
			if (extensions.length) {
				if (isCI) {
					this._logService.info(`AbstractExtensionService.onDidEnableExtensions fired`);
				}
				this._handleDeltaExtensions(new DeltaExtensionsQueueItem(extensions, []));
			}
		}));

		this._register(this._extensionManagementService.onDidInstallExtensions((result) => {
			const extensions: IExtension[] = [];
			const toRemove: string[] = [];
			for (const { local, operation } of result) {
				if (local && local.isValid && operation !== InstallOperation.Migrate && this._safeInvokeIsEnabled(local)) {
					extensions.push(local);
					if (operation === InstallOperation.Update) {
						toRemove.push(local.identifier.id);
					}
				}
			}
			if (extensions.length) {
				if (isCI) {
					this._logService.info(`AbstractExtensionService.onDidInstallExtensions fired for ${extensions.map(e => e.identifier.id).join(', ')}`);
				}
				this._handleDeltaExtensions(new DeltaExtensionsQueueItem(extensions, toRemove));
			}
		}));

		this._register(this._extensionManagementService.onDidUninstallExtension((event) => {
			if (!event.error) {
				// an extension has been uninstalled
				if (isCI) {
					this._logService.info(`AbstractExtensionService.onDidUninstallExtension fired for ${event.identifier.id}`);
				}
				this._handleDeltaExtensions(new DeltaExtensionsQueueItem([], [event.identifier.id]));
			}
		}));

		this._register(this._lifecycleService.onWillShutdown(event => {
			if (this._remoteAgentService.getConnection()) {
				event.join(async () => {
					// We need to disconnect the management connection before killing the local extension host.
					// Otherwise, the local extension host might terminate the underlying tunnel before the
					// management connection has a chance to send its disconnection message.
					try {
						await this._remoteAgentService.endConnection();
						await this._doStopExtensionHosts();
						this._remoteAgentService.getConnection()?.dispose();
					} catch {
						this._logService.warn('Error while disconnecting remote agent');
					}
				}, {
					id: 'join.disconnectRemote',
					label: nls.localize('disconnectRemote', "Disconnect Remote Agent"),
					order: WillShutdownJoinerOrder.Last // after others have joined that might depend on a remote connection
				});
			} else {
				event.join(this._doStopExtensionHosts(), {
					id: 'join.stopExtensionHosts',
					label: nls.localize('stopExtensionHosts', "Stopping Extension Hosts"),
				});
			}
		}));
	}

	protected _getExtensionHostManagers(kind: ExtensionHostKind): IExtensionHostManager[] {
		return this._extensionHostManagers.getByKind(kind);
	}

	//#region deltaExtensions

	private async _handleDeltaExtensions(item: DeltaExtensionsQueueItem): Promise<void> {
		this._deltaExtensionsQueue.push(item);
		if (this._inHandleDeltaExtensions) {
			// Let the current item finish, the new one will be picked up
			return;
		}

		let lock: ExtensionDescriptionRegistryLock | null = null;
		try {
			this._inHandleDeltaExtensions = true;

			// wait for _initialize to finish before hanlding any delta extension events
			await this._installedExtensionsReady.wait();

			lock = await this._registry.acquireLock('handleDeltaExtensions');
			while (this._deltaExtensionsQueue.length > 0) {
				const item = this._deltaExtensionsQueue.shift()!;
				await this._deltaExtensions(lock, item.toAdd, item.toRemove);
			}
		} finally {
			this._inHandleDeltaExtensions = false;
			lock?.dispose();
		}
	}

	private async _deltaExtensions(lock: ExtensionDescriptionRegistryLock, _toAdd: IExtension[], _toRemove: string[] | IExtension[]): Promise<void> {
		if (isCI) {
			this._logService.info(`AbstractExtensionService._deltaExtensions: toAdd: [${_toAdd.map(e => e.identifier.id).join(',')}] toRemove: [${_toRemove.map(e => typeof e === 'string' ? e : e.identifier.id).join(',')}]`);
		}
		let toRemove: IExtensionDescription[] = [];
		for (let i = 0, len = _toRemove.length; i < len; i++) {
			const extensionOrId = _toRemove[i];
			const extensionId = (typeof extensionOrId === 'string' ? extensionOrId : extensionOrId.identifier.id);
			const extension = (typeof extensionOrId === 'string' ? null : extensionOrId);
			const extensionDescription = this._registry.getExtensionDescription(extensionId);
			if (!extensionDescription) {
				// ignore disabling/uninstalling an extension which is not running
				continue;
			}

			if (extension && extensionDescription.extensionLocation.scheme !== extension.location.scheme) {
				// this event is for a different extension than mine (maybe for the local extension, while I have the remote extension)
				continue;
			}

			if (!this.canRemoveExtension(extensionDescription)) {
				// uses non-dynamic extension point or is activated
				continue;
			}

			toRemove.push(extensionDescription);
		}

		const toAdd: IExtensionDescription[] = [];
		for (let i = 0, len = _toAdd.length; i < len; i++) {
			const extension = _toAdd[i];

			const extensionDescription = toExtensionDescription(extension, false);
			if (!extensionDescription) {
				// could not scan extension...
				continue;
			}

			if (!this._canAddExtension(extensionDescription, toRemove)) {
				continue;
			}

			toAdd.push(extensionDescription);
		}

		if (toAdd.length === 0 && toRemove.length === 0) {
			return;
		}

		// Update the local registry
		const result = this._registry.deltaExtensions(lock, toAdd, toRemove.map(e => e.identifier));
		this._onDidChangeExtensions.fire({ added: toAdd, removed: toRemove });

		toRemove = toRemove.concat(result.removedDueToLooping);
		if (result.removedDueToLooping.length > 0) {
			this._notificationService.notify({
				severity: Severity.Error,
				message: nls.localize('looping', "The following extensions contain dependency loops and have been disabled: {0}", result.removedDueToLooping.map(e => `'${e.identifier.value}'`).join(', '))
			});
		}

		// enable or disable proposed API per extension
		this._extensionsProposedApi.updateEnabledApiProposals(toAdd);

		// Update extension points
		this._doHandleExtensionPoints((<IExtensionDescription[]>[]).concat(toAdd).concat(toRemove), false);

		// Update the extension host
		await this._updateExtensionsOnExtHosts(result.versionId, toAdd, toRemove.map(e => e.identifier));

		for (let i = 0; i < toAdd.length; i++) {
			this._activateAddedExtensionIfNeeded(toAdd[i]);
		}
	}

	private async _updateExtensionsOnExtHosts(versionId: number, toAdd: IExtensionDescription[], toRemove: ExtensionIdentifier[]): Promise<void> {
		const removedRunningLocation = this._runningLocations.deltaExtensions(toAdd, toRemove);
		const promises = this._extensionHostManagers.map(
			extHostManager => this._updateExtensionsOnExtHost(extHostManager, versionId, toAdd, toRemove, removedRunningLocation)
		);
		await Promise.all(promises);
	}

	private async _updateExtensionsOnExtHost(extensionHostManager: IExtensionHostManager, versionId: number, toAdd: IExtensionDescription[], toRemove: ExtensionIdentifier[], removedRunningLocation: ExtensionIdentifierMap<ExtensionRunningLocation | null>): Promise<void> {
		const myToAdd = this._runningLocations.filterByExtensionHostManager(toAdd, extensionHostManager);
		const myToRemove = filterExtensionIdentifiers(toRemove, removedRunningLocation, extRunningLocation => extensionHostManager.representsRunningLocation(extRunningLocation));
		const addActivationEvents = ImplicitActivationEvents.createActivationEventsMap(toAdd);
		if (isCI) {
			const printExtIds = (extensions: IExtensionDescription[]) => extensions.map(e => e.identifier.value).join(',');
			const printIds = (extensions: ExtensionIdentifier[]) => extensions.map(e => e.value).join(',');
			this._logService.info(`AbstractExtensionService: Calling deltaExtensions: toRemove: [${printIds(toRemove)}], toAdd: [${printExtIds(toAdd)}], myToRemove: [${printIds(myToRemove)}], myToAdd: [${printExtIds(myToAdd)}],`);
		}
		await extensionHostManager.deltaExtensions({ versionId, toRemove, toAdd, addActivationEvents, myToRemove, myToAdd: myToAdd.map(extension => extension.identifier) });
	}

	public canAddExtension(extension: IExtensionDescription): boolean {
		return this._canAddExtension(extension, []);
	}

	private _canAddExtension(extension: IExtensionDescription, extensionsBeingRemoved: IExtensionDescription[]): boolean {
		// (Also check for renamed extensions)
		const existing = this._registry.getExtensionDescriptionByIdOrUUID(extension.identifier, extension.id);
		if (existing) {
			// This extension is already known (most likely at a different version)
			// so it cannot be added again unless it is removed first
			const isBeingRemoved = extensionsBeingRemoved.some((extensionDescription) => ExtensionIdentifier.equals(extension.identifier, extensionDescription.identifier));
			if (!isBeingRemoved) {
				return false;
			}
		}

		const extensionKinds = this._runningLocations.readExtensionKinds(extension);
		const isRemote = extension.extensionLocation.scheme === Schemas.vscodeRemote;
		const extensionHostKind = this._extensionHostKindPicker.pickExtensionHostKind(extension.identifier, extensionKinds, !isRemote, isRemote, ExtensionRunningPreference.None);
		if (extensionHostKind === null) {
			return false;
		}

		return true;
	}

	public canRemoveExtension(extension: IExtensionDescription): boolean {
		const extensionDescription = this._registry.getExtensionDescription(extension.identifier);
		if (!extensionDescription) {
			// Can't remove an extension that is unknown!
			return false;
		}

		if (this._extensionStatus.get(extensionDescription.identifier)?.activationStarted) {
			// Extension is running, cannot remove it safely
			return false;
		}

		return true;
	}

	private async _activateAddedExtensionIfNeeded(extensionDescription: IExtensionDescription): Promise<void> {
		let shouldActivate = false;
		let shouldActivateReason: string | null = null;
		let hasWorkspaceContains = false;
		const activationEvents = this._activationEventReader.readActivationEvents(extensionDescription);
		for (const activationEvent of activationEvents) {
			if (this._allRequestedActivateEvents.has(activationEvent)) {
				// This activation event was fired before the extension was added
				shouldActivate = true;
				shouldActivateReason = activationEvent;
				break;
			}

			if (activationEvent === '*') {
				shouldActivate = true;
				shouldActivateReason = activationEvent;
				break;
			}

			if (/^workspaceContains/.test(activationEvent)) {
				hasWorkspaceContains = true;
			}

			if (activationEvent === 'onStartupFinished') {
				shouldActivate = true;
				shouldActivateReason = activationEvent;
				break;
			}
		}

		if (shouldActivate) {
			await Promise.all(
				this._extensionHostManagers.map(extHostManager => extHostManager.activate(extensionDescription.identifier, { startup: false, extensionId: extensionDescription.identifier, activationEvent: shouldActivateReason! }))
			).then(() => { });
		} else if (hasWorkspaceContains) {
			const workspace = await this._contextService.getCompleteWorkspace();
			const forceUsingSearch = !!this._environmentService.remoteAuthority;
			const host: IWorkspaceContainsActivationHost = {
				logService: this._logService,
				folders: workspace.folders.map(folder => folder.uri),
				forceUsingSearch: forceUsingSearch,
				exists: (uri) => this._fileService.exists(uri),
				checkExists: (folders, includes, token) => this._instantiationService.invokeFunction((accessor) => checkGlobFileExists(accessor, folders, includes, token))
			};

			const result = await checkActivateWorkspaceContainsExtension(host, extensionDescription);
			if (!result) {
				return;
			}

			await Promise.all(
				this._extensionHostManagers.map(extHostManager => extHostManager.activate(extensionDescription.identifier, { startup: false, extensionId: extensionDescription.identifier, activationEvent: result.activationEvent }))
			).then(() => { });
		}
	}

	//#endregion

	protected async _initialize(): Promise<void> {
		perf.mark('code/willLoadExtensions');
		this._startExtensionHostsIfNecessary(true, []);

		const lock = await this._registry.acquireLock('_initialize');
		try {
			await this._resolveAndProcessExtensions(lock);
			// Start extension hosts which are not automatically started
			this._startOnDemandExtensionHosts();
		} finally {
			lock.dispose();
		}

		this._releaseBarrier();
		perf.mark('code/didLoadExtensions');
		await this._handleExtensionTests();
	}

	private async _resolveAndProcessExtensions(lock: ExtensionDescriptionRegistryLock,): Promise<void> {
		let resolverExtensions: IExtensionDescription[] = [];
		let localExtensions: IExtensionDescription[] = [];
		let remoteExtensions: IExtensionDescription[] = [];

		for await (const extensions of this._resolveExtensions()) {
			if (extensions instanceof ResolverExtensions) {
				resolverExtensions = checkEnabledAndProposedAPI(this._logService, this._extensionEnablementService, this._extensionsProposedApi, extensions.extensions, false);
				this._registry.deltaExtensions(lock, resolverExtensions, []);
				this._doHandleExtensionPoints(resolverExtensions, true);
			}
			if (extensions instanceof LocalExtensions) {
				localExtensions = checkEnabledAndProposedAPI(this._logService, this._extensionEnablementService, this._extensionsProposedApi, extensions.extensions, false);
			}
			if (extensions instanceof RemoteExtensions) {
				remoteExtensions = checkEnabledAndProposedAPI(this._logService, this._extensionEnablementService, this._extensionsProposedApi, extensions.extensions, false);
			}
		}

		// `initializeRunningLocation` will look at the complete picture (e.g. an extension installed on both sides),
		// takes care of duplicates and picks a running location for each extension
		this._runningLocations.initializeRunningLocation(localExtensions, remoteExtensions);

		this._startExtensionHostsIfNecessary(true, []);

		// Some remote extensions could run locally in the web worker, so store them
		const remoteExtensionsThatNeedToRunLocally = (this._allowRemoteExtensionsInLocalWebWorker ? this._runningLocations.filterByExtensionHostKind(remoteExtensions, ExtensionHostKind.LocalWebWorker) : []);
		const localProcessExtensions = (this._hasLocalProcess ? this._runningLocations.filterByExtensionHostKind(localExtensions, ExtensionHostKind.LocalProcess) : []);
		const localWebWorkerExtensions = this._runningLocations.filterByExtensionHostKind(localExtensions, ExtensionHostKind.LocalWebWorker);
		remoteExtensions = this._runningLocations.filterByExtensionHostKind(remoteExtensions, ExtensionHostKind.Remote);

		// Add locally the remote extensions that need to run locally in the web worker
		for (const ext of remoteExtensionsThatNeedToRunLocally) {
			if (!includes(localWebWorkerExtensions, ext.identifier)) {
				localWebWorkerExtensions.push(ext);
			}
		}

		const allExtensions = remoteExtensions.concat(localProcessExtensions).concat(localWebWorkerExtensions);
		let toAdd = allExtensions;

		if (resolverExtensions.length) {
			// Add extensions that are not registered as resolvers but are in the final resolved set
			toAdd = allExtensions.filter(extension => !resolverExtensions.some(e => ExtensionIdentifier.equals(e.identifier, extension.identifier) && e.extensionLocation.toString() === extension.extensionLocation.toString()));
			// Remove extensions that are registered as resolvers but are not in the final resolved set
			if (allExtensions.length < toAdd.length + resolverExtensions.length) {
				const toRemove = resolverExtensions.filter(registered => !allExtensions.some(e => ExtensionIdentifier.equals(e.identifier, registered.identifier) && e.extensionLocation.toString() === registered.extensionLocation.toString()));
				if (toRemove.length) {
					this._registry.deltaExtensions(lock, [], toRemove.map(e => e.identifier));
					this._doHandleExtensionPoints(toRemove, true);
				}
			}
		}

		const result = this._registry.deltaExtensions(lock, toAdd, []);
		if (result.removedDueToLooping.length > 0) {
			this._notificationService.notify({
				severity: Severity.Error,
				message: nls.localize('looping', "The following extensions contain dependency loops and have been disabled: {0}", result.removedDueToLooping.map(e => `'${e.identifier.value}'`).join(', '))
			});
		}

		this._doHandleExtensionPoints(this._registry.getAllExtensionDescriptions(), false);
	}

	private async _handleExtensionTests(): Promise<void> {
		if (!this._environmentService.isExtensionDevelopment || !this._environmentService.extensionTestsLocationURI) {
			return;
		}

		const extensionHostManager = this.findTestExtensionHost(this._environmentService.extensionTestsLocationURI);
		if (!extensionHostManager) {
			const msg = nls.localize('extensionTestError', "No extension host found that can launch the test runner at {0}.", this._environmentService.extensionTestsLocationURI.toString());
			console.error(msg);
			this._notificationService.error(msg);
			return;
		}


		let exitCode: number;
		try {
			exitCode = await extensionHostManager.extensionTestsExecute();
			if (isCI) {
				this._logService.info(`Extension host test runner exit code: ${exitCode}`);
			}
		} catch (err) {
			if (isCI) {
				this._logService.error(`Extension host test runner error`, err);
			}
			console.error(err);
			exitCode = 1 /* ERROR */;
		}

		this._onExtensionHostExit(exitCode);
	}

	private findTestExtensionHost(testLocation: URI): IExtensionHostManager | null {
		let runningLocation: ExtensionRunningLocation | null = null;

		for (const extension of this._registry.getAllExtensionDescriptions()) {
			if (isEqualOrParent(testLocation, extension.extensionLocation)) {
				runningLocation = this._runningLocations.getRunningLocation(extension.identifier);
				break;
			}
		}
		if (runningLocation === null) {
			// not sure if we should support that, but it was possible to have an test outside an extension

			if (testLocation.scheme === Schemas.vscodeRemote) {
				runningLocation = new RemoteRunningLocation();
			} else {
				// When a debugger attaches to the extension host, it will surface all console.log messages from the extension host,
				// but not necessarily from the window. So it would be best if any errors get printed to the console of the extension host.
				// That is why here we use the local process extension host even for non-file URIs
				runningLocation = new LocalProcessRunningLocation(0);
			}
		}
		if (runningLocation !== null) {
			return this._extensionHostManagers.getByRunningLocation(runningLocation);
		}
		return null;
	}

	private _releaseBarrier(): void {
		this._installedExtensionsReady.open();
		this._onDidRegisterExtensions.fire(undefined);
		this._onDidChangeExtensionsStatus.fire(this._registry.getAllExtensionDescriptions().map(e => e.identifier));
	}

	//#region remote authority resolving

	protected async _resolveAuthorityInitial(remoteAuthority: string): Promise<ResolverResult> {
		const MAX_ATTEMPTS = 5;

		for (let attempt = 1; ; attempt++) {
			try {
				return this._resolveAuthorityWithLogging(remoteAuthority);
			} catch (err) {
				if (RemoteAuthorityResolverError.isNoResolverFound(err)) {
					// There is no point in retrying if there is no resolver found
					throw err;
				}

				if (RemoteAuthorityResolverError.isNotAvailable(err)) {
					// The resolver is not available and asked us to not retry
					throw err;
				}

				if (attempt >= MAX_ATTEMPTS) {
					// Too many failed attempts, give up
					throw err;
				}
			}
		}
	}

	protected async _resolveAuthorityAgain(): Promise<void> {
		const remoteAuthority = this._environmentService.remoteAuthority;
		if (!remoteAuthority) {
			return;
		}

		this._remoteAuthorityResolverService._clearResolvedAuthority(remoteAuthority);
		try {
			const result = await this._resolveAuthorityWithLogging(remoteAuthority);
			this._remoteAuthorityResolverService._setResolvedAuthority(result.authority, result.options);
		} catch (err) {
			this._remoteAuthorityResolverService._setResolvedAuthorityError(remoteAuthority, err);
		}
	}

	private async _resolveAuthorityWithLogging(remoteAuthority: string): Promise<ResolverResult> {
		const authorityPrefix = getRemoteAuthorityPrefix(remoteAuthority);
		const sw = StopWatch.create(false);
		this._logService.info(`Invoking resolveAuthority(${authorityPrefix})...`);
		try {
			perf.mark(`code/willResolveAuthority/${authorityPrefix}`);
			const result = await this._resolveAuthority(remoteAuthority);
			perf.mark(`code/didResolveAuthorityOK/${authorityPrefix}`);
			this._logService.info(`resolveAuthority(${authorityPrefix}) returned '${result.authority.connectTo}' after ${sw.elapsed()} ms`);
			return result;
		} catch (err) {
			perf.mark(`code/didResolveAuthorityError/${authorityPrefix}`);
			this._logService.error(`resolveAuthority(${authorityPrefix}) returned an error after ${sw.elapsed()} ms`, err);
			throw err;
		}
	}

	protected async _resolveAuthorityOnExtensionHosts(kind: ExtensionHostKind, remoteAuthority: string): Promise<ResolverResult> {

		const extensionHosts = this._getExtensionHostManagers(kind);
		if (extensionHosts.length === 0) {
			// no local process extension hosts
			throw new Error(`Cannot resolve authority`);
		}

		this._resolveAuthorityAttempt++;
		const results = await Promise.all(extensionHosts.map(extHost => extHost.resolveAuthority(remoteAuthority, this._resolveAuthorityAttempt)));

		let bestErrorResult: IResolveAuthorityErrorResult | null = null;
		for (const result of results) {
			if (result.type === 'ok') {
				return result.value;
			}
			if (!bestErrorResult) {
				bestErrorResult = result;
				continue;
			}
			const bestErrorIsUnknown = (bestErrorResult.error.code === RemoteAuthorityResolverErrorCode.Unknown);
			const errorIsUnknown = (result.error.code === RemoteAuthorityResolverErrorCode.Unknown);
			if (bestErrorIsUnknown && !errorIsUnknown) {
				bestErrorResult = result;
			}
		}

		// we can only reach this if there is an error
		throw new RemoteAuthorityResolverError(bestErrorResult!.error.message, bestErrorResult!.error.code, bestErrorResult!.error.detail);
	}

	//#endregion

	//#region Stopping / Starting / Restarting

	public stopExtensionHosts(reason: string, auto?: boolean): Promise<boolean> {
		return this._doStopExtensionHostsWithVeto(reason, auto);
	}

	protected async _doStopExtensionHosts(): Promise<void> {
		const previouslyActivatedExtensionIds: ExtensionIdentifier[] = [];
		for (const extensionStatus of this._extensionStatus.values()) {
			if (extensionStatus.activationStarted) {
				previouslyActivatedExtensionIds.push(extensionStatus.id);
			}
		}

		await this._extensionHostManagers.stopAllInReverse();
		for (const extensionStatus of this._extensionStatus.values()) {
			extensionStatus.clearRuntimeStatus();
		}

		if (previouslyActivatedExtensionIds.length > 0) {
			this._onDidChangeExtensionsStatus.fire(previouslyActivatedExtensionIds);
		}
	}

	private async _doStopExtensionHostsWithVeto(reason: string, auto: boolean = false): Promise<boolean> {
		if (auto && this._environmentService.isExtensionDevelopment) {
			return false;
		}

		const vetos: (boolean | Promise<boolean>)[] = [];
		const vetoReasons = new Set<string>();

		this._onWillStop.fire({
			reason,
			auto,
			veto(value, reason) {
				vetos.push(value);

				if (typeof value === 'boolean') {
					if (value === true) {
						vetoReasons.add(reason);
					}
				} else {
					value.then(value => {
						if (value) {
							vetoReasons.add(reason);
						}
					}).catch(error => {
						vetoReasons.add(nls.localize('extensionStopVetoError', "{0} (Error: {1})", reason, toErrorMessage(error)));
					});
				}
			}
		});

		const veto = await handleVetos(vetos, error => this._logService.error(error));
		if (!veto) {
			await this._doStopExtensionHosts();
		} else {
			if (!auto) {
				const vetoReasonsArray = Array.from(vetoReasons);

				this._logService.warn(`Extension host was not stopped because of veto (stop reason: ${reason}, veto reason: ${vetoReasonsArray.join(', ')})`);

				const { confirmed } = await this._dialogService.confirm({
					type: Severity.Warning,
					message: nls.localize('extensionStopVetoMessage', "Please confirm restart of extensions."),
					detail: vetoReasonsArray.length === 1 ?
						vetoReasonsArray[0] :
						vetoReasonsArray.join('\n -'),
					primaryButton: nls.localize('proceedAnyways', "Restart Anyway")
				});

				if (confirmed) {
					return true;
				}
			}

		}

		return !veto;
	}

	private _startExtensionHostsIfNecessary(isInitialStart: boolean, initialActivationEvents: string[]): void {
		const locations: ExtensionRunningLocation[] = [];
		for (let affinity = 0; affinity <= this._runningLocations.maxLocalProcessAffinity; affinity++) {
			locations.push(new LocalProcessRunningLocation(affinity));
		}
		for (let affinity = 0; affinity <= this._runningLocations.maxLocalWebWorkerAffinity; affinity++) {
			locations.push(new LocalWebWorkerRunningLocation(affinity));
		}
		locations.push(new RemoteRunningLocation());
		for (const location of locations) {
			if (this._extensionHostManagers.getByRunningLocation(location)) {
				// already running
				continue;
			}
			const res = this._createExtensionHostManager(location, isInitialStart, initialActivationEvents);
			if (res) {
				const [extHostManager, disposableStore] = res;
				this._extensionHostManagers.add(extHostManager, disposableStore);
			}
		}
	}

	private _createExtensionHostManager(runningLocation: ExtensionRunningLocation, isInitialStart: boolean, initialActivationEvents: string[]): null | [IExtensionHostManager, DisposableStore] {
		const extensionHost = this._extensionHostFactory.createExtensionHost(this._runningLocations, runningLocation, isInitialStart);
		if (!extensionHost) {
			return null;
		}

		const processManager: IExtensionHostManager = this._doCreateExtensionHostManager(extensionHost, initialActivationEvents);
		const disposableStore = new DisposableStore();
		disposableStore.add(processManager.onDidExit(([code, signal]) => this._onExtensionHostCrashOrExit(processManager, code, signal)));
		disposableStore.add(processManager.onDidChangeResponsiveState((responsiveState) => {
			this._logService.info(`Extension host (${processManager.friendyName}) is ${responsiveState === ResponsiveState.Responsive ? 'responsive' : 'unresponsive'}.`);
			this._onDidChangeResponsiveChange.fire({
				extensionHostKind: processManager.kind,
				isResponsive: responsiveState === ResponsiveState.Responsive,
				getInspectListener: (tryEnableInspector: boolean) => {
					return processManager.getInspectPort(tryEnableInspector);
				}
			});
		}));
		return [processManager, disposableStore];
	}

	protected _doCreateExtensionHostManager(extensionHost: IExtensionHost, initialActivationEvents: string[]): IExtensionHostManager {
		const internalExtensionService = this._acquireInternalAPI(extensionHost);
		if (extensionHost.startup === ExtensionHostStartup.LazyAutoStart) {
			return this._instantiationService.createInstance(LazyCreateExtensionHostManager, extensionHost, initialActivationEvents, internalExtensionService);
		}
		return this._instantiationService.createInstance(ExtensionHostManager, extensionHost, initialActivationEvents, internalExtensionService);
	}

	private _onExtensionHostCrashOrExit(extensionHost: IExtensionHostManager, code: number, signal: string | null): void {

		// Unexpected termination
		const isExtensionDevHost = parseExtensionDevOptions(this._environmentService).isExtensionDevHost;
		if (!isExtensionDevHost) {
			this._onExtensionHostCrashed(extensionHost, code, signal);
			return;
		}

		this._onExtensionHostExit(code);
	}

	protected _onExtensionHostCrashed(extensionHost: IExtensionHostManager, code: number, signal: string | null): void {
		console.error(`Extension host (${extensionHost.friendyName}) terminated unexpectedly. Code: ${code}, Signal: ${signal}`);
		if (extensionHost.kind === ExtensionHostKind.LocalProcess) {
			this._doStopExtensionHosts();
		} else if (extensionHost.kind === ExtensionHostKind.Remote) {
			if (signal) {
				this._onRemoteExtensionHostCrashed(extensionHost, signal);
			}
			this._extensionHostManagers.stopOne(extensionHost);
		}
	}

	private _getExtensionHostExitInfoWithTimeout(reconnectionToken: string): Promise<IExtensionHostExitInfo | null> {
		return new Promise((resolve, reject) => {
			const timeoutHandle = setTimeout(() => {
				reject(new Error('getExtensionHostExitInfo timed out'));
			}, 2000);
			this._remoteAgentService.getExtensionHostExitInfo(reconnectionToken).then(
				(r) => {
					clearTimeout(timeoutHandle);
					resolve(r);
				},
				reject
			);
		});
	}

	private async _onRemoteExtensionHostCrashed(extensionHost: IExtensionHostManager, reconnectionToken: string): Promise<void> {
		try {
			const info = await this._getExtensionHostExitInfoWithTimeout(reconnectionToken);
			if (info) {
				this._logService.error(`Extension host (${extensionHost.friendyName}) terminated unexpectedly with code ${info.code}.`);
			}

			this._logExtensionHostCrash(extensionHost);
			this._remoteCrashTracker.registerCrash();

			if (this._remoteCrashTracker.shouldAutomaticallyRestart()) {
				this._logService.info(`Automatically restarting the remote extension host.`);
				this._notificationService.status(nls.localize('extensionService.autoRestart', "The remote extension host terminated unexpectedly. Restarting..."), { hideAfter: 5000 });
				this._startExtensionHostsIfNecessary(false, Array.from(this._allRequestedActivateEvents.keys()));
			} else {
				this._notificationService.prompt(Severity.Error, nls.localize('extensionService.crash', "Remote Extension host terminated unexpectedly 3 times within the last 5 minutes."),
					[{
						label: nls.localize('restart', "Restart Remote Extension Host"),
						run: () => {
							this._startExtensionHostsIfNecessary(false, Array.from(this._allRequestedActivateEvents.keys()));
						}
					}]
				);
			}
		} catch (err) {
			// maybe this wasn't an extension host crash and it was a permanent disconnection
		}
	}

	protected _logExtensionHostCrash(extensionHost: IExtensionHostManager): void {

		const activatedExtensions: ExtensionIdentifier[] = [];
		for (const extensionStatus of this._extensionStatus.values()) {
			if (extensionStatus.activationStarted && extensionHost.containsExtension(extensionStatus.id)) {
				activatedExtensions.push(extensionStatus.id);
			}
		}

		if (activatedExtensions.length > 0) {
			this._logService.error(`Extension host (${extensionHost.friendyName}) terminated unexpectedly. The following extensions were running: ${activatedExtensions.map(id => id.value).join(', ')}`);
		} else {
			this._logService.error(`Extension host (${extensionHost.friendyName}) terminated unexpectedly. No extensions were activated.`);
		}
	}

	public async startExtensionHosts(updates?: { toAdd: IExtension[]; toRemove: string[] }): Promise<void> {
		await this._doStopExtensionHosts();

		if (updates) {
			await this._handleDeltaExtensions(new DeltaExtensionsQueueItem(updates.toAdd, updates.toRemove));
		}

		const lock = await this._registry.acquireLock('startExtensionHosts');
		try {
			this._startExtensionHostsIfNecessary(false, Array.from(this._allRequestedActivateEvents.keys()));
			this._startOnDemandExtensionHosts();

			const localProcessExtensionHosts = this._getExtensionHostManagers(ExtensionHostKind.LocalProcess);
			await Promise.all(localProcessExtensionHosts.map(extHost => extHost.ready()));
		} finally {
			lock.dispose();
		}
	}

	private _startOnDemandExtensionHosts(): void {
		const snapshot = this._registry.getSnapshot();
		for (const extHostManager of this._extensionHostManagers) {
			if (extHostManager.startup !== ExtensionHostStartup.EagerAutoStart) {
				const extensions = this._runningLocations.filterByExtensionHostManager(snapshot.extensions, extHostManager);
				extHostManager.start(snapshot.versionId, snapshot.extensions, extensions.map(extension => extension.identifier));
			}
		}
	}

	//#endregion

	//#region IExtensionService

	public activateByEvent(activationEvent: string, activationKind: ActivationKind = ActivationKind.Normal): Promise<void> {
		if (this._installedExtensionsReady.isOpen()) {
			// Extensions have been scanned and interpreted

			// Record the fact that this activationEvent was requested (in case of a restart)
			this._allRequestedActivateEvents.add(activationEvent);

			if (!this._registry.containsActivationEvent(activationEvent)) {
				// There is no extension that is interested in this activation event
				return NO_OP_VOID_PROMISE;
			}

			return this._activateByEvent(activationEvent, activationKind);
		} else {
			// Extensions have not been scanned yet.

			// Record the fact that this activationEvent was requested (in case of a restart)
			this._allRequestedActivateEvents.add(activationEvent);

			if (activationKind === ActivationKind.Immediate) {
				// Do not wait for the normal start-up of the extension host(s)
				return this._activateByEvent(activationEvent, activationKind);
			}

			return this._installedExtensionsReady.wait().then(() => this._activateByEvent(activationEvent, activationKind));
		}
	}

	private _activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		const result = Promise.all(
			this._extensionHostManagers.map(extHostManager => extHostManager.activateByEvent(activationEvent, activationKind))
		).then(() => { });
		this._onWillActivateByEvent.fire({
			event: activationEvent,
			activation: result
		});
		return result;
	}

	public activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		return this._activateById(extensionId, reason);
	}

	public activationEventIsDone(activationEvent: string): boolean {
		if (!this._installedExtensionsReady.isOpen()) {
			return false;
		}
		if (!this._registry.containsActivationEvent(activationEvent)) {
			// There is no extension that is interested in this activation event
			return true;
		}
		return this._extensionHostManagers.every(manager => manager.activationEventIsDone(activationEvent));
	}

	public whenInstalledExtensionsRegistered(): Promise<boolean> {
		return this._installedExtensionsReady.wait();
	}

	get extensions(): IExtensionDescription[] {
		return this._registry.getAllExtensionDescriptions();
	}

	protected _getExtensionRegistrySnapshotWhenReady(): Promise<ExtensionDescriptionRegistrySnapshot> {
		return this._installedExtensionsReady.wait().then(() => this._registry.getSnapshot());
	}

	public getExtension(id: string): Promise<IExtensionDescription | undefined> {
		return this._installedExtensionsReady.wait().then(() => {
			return this._registry.getExtensionDescription(id);
		});
	}

	public readExtensionPointContributions<T extends IExtensionContributions[keyof IExtensionContributions]>(extPoint: IExtensionPoint<T>): Promise<ExtensionPointContribution<T>[]> {
		return this._installedExtensionsReady.wait().then(() => {
			const availableExtensions = this._registry.getAllExtensionDescriptions();

			const result: ExtensionPointContribution<T>[] = [];
			for (const desc of availableExtensions) {
				if (desc.contributes && hasOwnProperty.call(desc.contributes, extPoint.name)) {
					result.push(new ExtensionPointContribution<T>(desc, desc.contributes[extPoint.name as keyof typeof desc.contributes] as T));
				}
			}

			return result;
		});
	}

	public getExtensionsStatus(): { [id: string]: IExtensionsStatus } {
		const result: { [id: string]: IExtensionsStatus } = Object.create(null);
		if (this._registry) {
			const extensions = this._registry.getAllExtensionDescriptions();
			for (const extension of extensions) {
				const extensionStatus = this._extensionStatus.get(extension.identifier);
				result[extension.identifier.value] = {
					id: extension.identifier,
					messages: extensionStatus?.messages ?? [],
					activationStarted: extensionStatus?.activationStarted ?? false,
					activationTimes: extensionStatus?.activationTimes ?? undefined,
					runtimeErrors: extensionStatus?.runtimeErrors ?? [],
					runningLocation: this._runningLocations.getRunningLocation(extension.identifier),
				};
			}
		}
		return result;
	}

	public async getInspectPorts(extensionHostKind: ExtensionHostKind, tryEnableInspector: boolean): Promise<IExtensionInspectInfo[]> {
		const result = await Promise.all(
			this._getExtensionHostManagers(extensionHostKind).map(async extHost => {
				let portInfo = await extHost.getInspectPort(tryEnableInspector);
				if (portInfo !== undefined) {
					portInfo = { ...portInfo, devtoolsLabel: extHost.friendyName };
				}
				return portInfo;
			})
		);
		// remove 0s:
		return result.filter(isDefined);
	}

	public async setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void> {
		await this._extensionHostManagers
			.map(manager => manager.setRemoteEnvironment(env));
	}

	//#endregion

	// --- impl

	private _safeInvokeIsEnabled(extension: IExtension): boolean {
		try {
			return this._extensionEnablementService.isEnabled(extension);
		} catch (err) {
			return false;
		}
	}

	private _doHandleExtensionPoints(affectedExtensions: IExtensionDescription[], onlyResolverExtensionPoints: boolean): void {
		const affectedExtensionPoints: { [extPointName: string]: boolean } = Object.create(null);
		for (const extensionDescription of affectedExtensions) {
			if (extensionDescription.contributes) {
				for (const extPointName in extensionDescription.contributes) {
					if (hasOwnProperty.call(extensionDescription.contributes, extPointName)) {
						affectedExtensionPoints[extPointName] = true;
					}
				}
			}
		}

		const messageHandler = (msg: IMessage) => this._handleExtensionPointMessage(msg);
		const availableExtensions = this._registry.getAllExtensionDescriptions();
		const extensionPoints = ExtensionsRegistry.getExtensionPoints();
		perf.mark(onlyResolverExtensionPoints ? 'code/willHandleResolverExtensionPoints' : 'code/willHandleExtensionPoints');
		for (const extensionPoint of extensionPoints) {
			if (affectedExtensionPoints[extensionPoint.name] && (!onlyResolverExtensionPoints || extensionPoint.canHandleResolver)) {
				perf.mark(`code/willHandleExtensionPoint/${extensionPoint.name}`);
				AbstractExtensionService._handleExtensionPoint(extensionPoint, availableExtensions, messageHandler);
				perf.mark(`code/didHandleExtensionPoint/${extensionPoint.name}`);
			}
		}
		perf.mark(onlyResolverExtensionPoints ? 'code/didHandleResolverExtensionPoints' : 'code/didHandleExtensionPoints');
	}

	private _getOrCreateExtensionStatus(extensionId: ExtensionIdentifier): ExtensionStatus {
		if (!this._extensionStatus.has(extensionId)) {
			this._extensionStatus.set(extensionId, new ExtensionStatus(extensionId));
		}
		return this._extensionStatus.get(extensionId)!;
	}

	private _handleExtensionPointMessage(msg: IMessage) {
		const extensionStatus = this._getOrCreateExtensionStatus(msg.extensionId);
		extensionStatus.addMessage(msg);

		const extension = this._registry.getExtensionDescription(msg.extensionId);
		const strMsg = `[${msg.extensionId.value}]: ${msg.message}`;

		if (msg.type === Severity.Error) {
			if (extension && extension.isUnderDevelopment) {
				// This message is about the extension currently being developed
				this._notificationService.notify({ severity: Severity.Error, message: strMsg });
			}
			this._logService.error(strMsg);
		} else if (msg.type === Severity.Warning) {
			if (extension && extension.isUnderDevelopment) {
				// This message is about the extension currently being developed
				this._notificationService.notify({ severity: Severity.Warning, message: strMsg });
			}
			this._logService.warn(strMsg);
		} else {
			this._logService.info(strMsg);
		}

		if (msg.extensionId && this._environmentService.isBuilt && !this._environmentService.isExtensionDevelopment) {
			const { type, extensionId, extensionPointId, message } = msg;
			type ExtensionsMessageClassification = {
				owner: 'alexdima';
				comment: 'A validation message for an extension';
				type: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Severity of problem.' };
				extensionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the extension that has a problem.' };
				extensionPointId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The extension point that has a problem.' };
				message: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The message of the problem.' };
			};
			type ExtensionsMessageEvent = {
				type: Severity;
				extensionId: string;
				extensionPointId: string;
				message: string;
			};
			this._telemetryService.publicLog2<ExtensionsMessageEvent, ExtensionsMessageClassification>('extensionsMessage', {
				type, extensionId: extensionId.value, extensionPointId, message
			});
		}
	}

	private static _handleExtensionPoint<T extends IExtensionContributions[keyof IExtensionContributions]>(extensionPoint: ExtensionPoint<T>, availableExtensions: IExtensionDescription[], messageHandler: (msg: IMessage) => void): void {
		const users: IExtensionPointUser<T>[] = [];
		for (const desc of availableExtensions) {
			if (desc.contributes && hasOwnProperty.call(desc.contributes, extensionPoint.name)) {
				users.push({
					description: desc,
					value: desc.contributes[extensionPoint.name as keyof typeof desc.contributes] as T,
					collector: new ExtensionMessageCollector(messageHandler, desc, extensionPoint.name)
				});
			}
		}
		extensionPoint.acceptUsers(users);
	}

	//#region Called by extension host

	private _acquireInternalAPI(extensionHost: IExtensionHost): IInternalExtensionService {
		return {
			_activateById: (extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> => {
				return this._activateById(extensionId, reason);
			},
			_onWillActivateExtension: (extensionId: ExtensionIdentifier): void => {
				return this._onWillActivateExtension(extensionId, extensionHost.runningLocation);
			},
			_onDidActivateExtension: (extensionId: ExtensionIdentifier, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason): void => {
				return this._onDidActivateExtension(extensionId, codeLoadingTime, activateCallTime, activateResolvedTime, activationReason);
			},
			_onDidActivateExtensionError: (extensionId: ExtensionIdentifier, error: Error): void => {
				return this._onDidActivateExtensionError(extensionId, error);
			},
			_onExtensionRuntimeError: (extensionId: ExtensionIdentifier, err: Error): void => {
				return this._onExtensionRuntimeError(extensionId, err);
			}
		};
	}

	public async _activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> {
		const results = await Promise.all(
			this._extensionHostManagers.map(manager => manager.activate(extensionId, reason))
		);
		const activated = results.some(e => e);
		if (!activated) {
			throw new Error(`Unknown extension ${extensionId.value}`);
		}
	}

	private _onWillActivateExtension(extensionId: ExtensionIdentifier, runningLocation: ExtensionRunningLocation): void {
		this._runningLocations.set(extensionId, runningLocation);
		const extensionStatus = this._getOrCreateExtensionStatus(extensionId);
		extensionStatus.onWillActivate();
	}

	private _onDidActivateExtension(extensionId: ExtensionIdentifier, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason): void {
		const extensionStatus = this._getOrCreateExtensionStatus(extensionId);
		extensionStatus.setActivationTimes(new ActivationTimes(codeLoadingTime, activateCallTime, activateResolvedTime, activationReason));
		this._onDidChangeExtensionsStatus.fire([extensionId]);
	}

	private _onDidActivateExtensionError(extensionId: ExtensionIdentifier, error: Error): void {
		type ExtensionActivationErrorClassification = {
			owner: 'alexdima';
			comment: 'An extension failed to activate';
			extensionId: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the extension.' };
			error: { classification: 'CallstackOrException'; purpose: 'PerformanceAndHealth'; comment: 'The error message.' };
		};
		type ExtensionActivationErrorEvent = {
			extensionId: string;
			error: string;
		};
		this._telemetryService.publicLog2<ExtensionActivationErrorEvent, ExtensionActivationErrorClassification>('extensionActivationError', {
			extensionId: extensionId.value,
			error: error.message
		});
	}

	private _onExtensionRuntimeError(extensionId: ExtensionIdentifier, err: Error): void {
		const extensionStatus = this._getOrCreateExtensionStatus(extensionId);
		extensionStatus.addRuntimeError(err);
		this._onDidChangeExtensionsStatus.fire([extensionId]);
	}

	//#endregion

	protected abstract _resolveExtensions(): AsyncIterable<ResolvedExtensions>;
	protected abstract _onExtensionHostExit(code: number): Promise<void>;
	protected abstract _resolveAuthority(remoteAuthority: string): Promise<ResolverResult>;
}

class ExtensionHostCollection extends Disposable {

	private _extensionHostManagers: ExtensionHostManagerData[] = [];

	public override dispose() {
		for (let i = this._extensionHostManagers.length - 1; i >= 0; i--) {
			const manager = this._extensionHostManagers[i];
			manager.extensionHost.disconnect();
			manager.dispose();
		}
		this._extensionHostManagers = [];
		super.dispose();
	}

	public add(extensionHostManager: IExtensionHostManager, disposableStore: DisposableStore): void {
		this._extensionHostManagers.push(new ExtensionHostManagerData(extensionHostManager, disposableStore));
	}

	public async stopAllInReverse(): Promise<void> {
		// See https://github.com/microsoft/vscode/issues/152204
		// Dispose extension hosts in reverse creation order because the local extension host
		// might be critical in sustaining a connection to the remote extension host
		for (let i = this._extensionHostManagers.length - 1; i >= 0; i--) {
			const manager = this._extensionHostManagers[i];
			await manager.extensionHost.disconnect();
			manager.dispose();
		}
		this._extensionHostManagers = [];
	}

	public async stopOne(extensionHostManager: IExtensionHostManager): Promise<void> {
		const index = this._extensionHostManagers.findIndex(el => el.extensionHost === extensionHostManager);
		if (index >= 0) {
			this._extensionHostManagers.splice(index, 1);
			await extensionHostManager.disconnect();
			extensionHostManager.dispose();
		}
	}

	public getByKind(kind: ExtensionHostKind): IExtensionHostManager[] {
		return this.filter(el => el.kind === kind);
	}

	public getByRunningLocation(runningLocation: ExtensionRunningLocation): IExtensionHostManager | null {
		for (const el of this._extensionHostManagers) {
			if (el.extensionHost.representsRunningLocation(runningLocation)) {
				return el.extensionHost;
			}
		}
		return null;
	}

	*[Symbol.iterator]() {
		for (const extensionHostManager of this._extensionHostManagers) {
			yield extensionHostManager.extensionHost;
		}
	}

	public map<T>(callback: (extHostManager: IExtensionHostManager) => T): T[] {
		return this._extensionHostManagers.map(el => callback(el.extensionHost));
	}

	public every(callback: (extHostManager: IExtensionHostManager) => unknown): boolean {
		return this._extensionHostManagers.every(el => callback(el.extensionHost));
	}

	public filter(callback: (extHostManager: IExtensionHostManager) => unknown): IExtensionHostManager[] {
		return this._extensionHostManagers.filter(el => callback(el.extensionHost)).map(el => el.extensionHost);
	}
}

class ExtensionHostManagerData {
	constructor(
		public readonly extensionHost: IExtensionHostManager,
		public readonly disposableStore: DisposableStore
	) { }

	public dispose(): void {
		this.disposableStore.dispose();
		this.extensionHost.dispose();
	}
}

export class ResolverExtensions {
	constructor(
		public readonly extensions: IExtensionDescription[],
	) { }
}

export class LocalExtensions {
	constructor(
		public readonly extensions: IExtensionDescription[],
	) { }
}

export class RemoteExtensions {
	constructor(
		public readonly extensions: IExtensionDescription[],
	) { }
}

export type ResolvedExtensions = ResolverExtensions | LocalExtensions | RemoteExtensions;

export interface IExtensionHostFactory {
	createExtensionHost(runningLocations: ExtensionRunningLocationTracker, runningLocation: ExtensionRunningLocation, isInitialStart: boolean): IExtensionHost | null;
}

class DeltaExtensionsQueueItem {
	constructor(
		public readonly toAdd: IExtension[],
		public readonly toRemove: string[] | IExtension[]
	) { }
}

export function isResolverExtension(extension: IExtensionDescription): boolean {
	return !!extension.activationEvents?.some(activationEvent => activationEvent.startsWith('onResolveRemoteAuthority:'));
}

/**
 * @argument extensions The extensions to be checked.
 * @argument ignoreWorkspaceTrust Do not take workspace trust into account.
 */
export function checkEnabledAndProposedAPI(logService: ILogService, extensionEnablementService: IWorkbenchExtensionEnablementService, extensionsProposedApi: ExtensionsProposedApi, extensions: IExtensionDescription[], ignoreWorkspaceTrust: boolean): IExtensionDescription[] {
	// enable or disable proposed API per extension
	extensionsProposedApi.updateEnabledApiProposals(extensions);

	// keep only enabled extensions
	return filterEnabledExtensions(logService, extensionEnablementService, extensions, ignoreWorkspaceTrust);
}

/**
 * Return the subset of extensions that are enabled.
 * @argument ignoreWorkspaceTrust Do not take workspace trust into account.
 */
export function filterEnabledExtensions(logService: ILogService, extensionEnablementService: IWorkbenchExtensionEnablementService, extensions: IExtensionDescription[], ignoreWorkspaceTrust: boolean): IExtensionDescription[] {
	const enabledExtensions: IExtensionDescription[] = [], extensionsToCheck: IExtensionDescription[] = [], mappedExtensions: IExtension[] = [];
	for (const extension of extensions) {
		if (extension.isUnderDevelopment) {
			// Never disable extensions under development
			enabledExtensions.push(extension);
		} else {
			extensionsToCheck.push(extension);
			mappedExtensions.push(toExtension(extension));
		}
	}

	const enablementStates = extensionEnablementService.getEnablementStates(mappedExtensions, ignoreWorkspaceTrust ? { trusted: true } : undefined);
	for (let index = 0; index < enablementStates.length; index++) {
		if (extensionEnablementService.isEnabledEnablementState(enablementStates[index])) {
			enabledExtensions.push(extensionsToCheck[index]);
		} else {
			if (isCI) {
				logService.info(`filterEnabledExtensions: extension '${extensionsToCheck[index].identifier.value}' is disabled`);
			}
		}
	}

	return enabledExtensions;
}

/**
 * @argument extension The extension to be checked.
 * @argument ignoreWorkspaceTrust Do not take workspace trust into account.
 */
export function extensionIsEnabled(logService: ILogService, extensionEnablementService: IWorkbenchExtensionEnablementService, extension: IExtensionDescription, ignoreWorkspaceTrust: boolean): boolean {
	return filterEnabledExtensions(logService, extensionEnablementService, [extension], ignoreWorkspaceTrust).includes(extension);
}

function includes(extensions: IExtensionDescription[], identifier: ExtensionIdentifier): boolean {
	for (const extension of extensions) {
		if (ExtensionIdentifier.equals(extension.identifier, identifier)) {
			return true;
		}
	}
	return false;
}

export class ExtensionStatus {

	private readonly _messages: IMessage[] = [];
	public get messages(): IMessage[] {
		return this._messages;
	}

	private _activationTimes: ActivationTimes | null = null;
	public get activationTimes(): ActivationTimes | null {
		return this._activationTimes;
	}

	private _runtimeErrors: Error[] = [];
	public get runtimeErrors(): Error[] {
		return this._runtimeErrors;
	}

	private _activationStarted: boolean = false;
	public get activationStarted(): boolean {
		return this._activationStarted;
	}

	constructor(
		public readonly id: ExtensionIdentifier,
	) { }

	public clearRuntimeStatus(): void {
		this._activationStarted = false;
		this._activationTimes = null;
		this._runtimeErrors = [];
	}

	public addMessage(msg: IMessage): void {
		this._messages.push(msg);
	}

	public setActivationTimes(activationTimes: ActivationTimes) {
		this._activationTimes = activationTimes;
	}

	public addRuntimeError(err: Error): void {
		this._runtimeErrors.push(err);
	}

	public onWillActivate() {
		this._activationStarted = true;
	}
}

interface IExtensionHostCrashInfo {
	timestamp: number;
}

export class ExtensionHostCrashTracker {

	private static _TIME_LIMIT = 5 * 60 * 1000; // 5 minutes
	private static _CRASH_LIMIT = 3;

	private readonly _recentCrashes: IExtensionHostCrashInfo[] = [];

	private _removeOldCrashes(): void {
		const limit = Date.now() - ExtensionHostCrashTracker._TIME_LIMIT;
		while (this._recentCrashes.length > 0 && this._recentCrashes[0].timestamp < limit) {
			this._recentCrashes.shift();
		}
	}

	public registerCrash(): void {
		this._removeOldCrashes();
		this._recentCrashes.push({ timestamp: Date.now() });
	}

	public shouldAutomaticallyRestart(): boolean {
		this._removeOldCrashes();
		return (this._recentCrashes.length < ExtensionHostCrashTracker._CRASH_LIMIT);
	}
}

/**
 * This can run correctly only on the renderer process because that is the only place
 * where all extension points and all implicit activation events generators are known.
 */
export class ImplicitActivationAwareReader implements IActivationEventsReader {
	public readActivationEvents(extensionDescription: IExtensionDescription): string[] {
		return ImplicitActivationEvents.readActivationEvents(extensionDescription);
	}
}

class ActivationFeatureMarkdowneRenderer extends Disposable implements IExtensionFeatureMarkdownRenderer {

	readonly type = 'markdown';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.activationEvents;
	}

	render(manifest: IExtensionManifest): IRenderedData<IMarkdownString> {
		const activationEvents = manifest.activationEvents || [];
		const data = new MarkdownString();
		if (activationEvents.length) {
			for (const activationEvent of activationEvents) {
				data.appendMarkdown(`- \`${activationEvent}\`\n`);
			}
		}
		return {
			data,
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'activationEvents',
	label: nls.localize('activation', "Activation Events"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ActivationFeatureMarkdowneRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionDescriptionRegistry.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionDescriptionRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionIdentifier, ExtensionIdentifierMap, ExtensionIdentifierSet, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { Emitter } from '../../../../base/common/event.js';
import * as path from '../../../../base/common/path.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { promiseWithResolvers } from '../../../../base/common/async.js';

export class DeltaExtensionsResult {
	constructor(
		public readonly versionId: number,
		public readonly removedDueToLooping: IExtensionDescription[]
	) { }
}

export interface IReadOnlyExtensionDescriptionRegistry {
	containsActivationEvent(activationEvent: string): boolean;
	containsExtension(extensionId: ExtensionIdentifier): boolean;
	getExtensionDescriptionsForActivationEvent(activationEvent: string): IExtensionDescription[];
	getAllExtensionDescriptions(): IExtensionDescription[];
	getExtensionDescription(extensionId: ExtensionIdentifier | string): IExtensionDescription | undefined;
	getExtensionDescriptionByUUID(uuid: string): IExtensionDescription | undefined;
	getExtensionDescriptionByIdOrUUID(extensionId: ExtensionIdentifier | string, uuid: string | undefined): IExtensionDescription | undefined;
}

export class ExtensionDescriptionRegistry extends Disposable implements IReadOnlyExtensionDescriptionRegistry {

	public static isHostExtension(extensionId: ExtensionIdentifier | string, myRegistry: ExtensionDescriptionRegistry, globalRegistry: ExtensionDescriptionRegistry): boolean {
		if (myRegistry.getExtensionDescription(extensionId)) {
			// I have this extension
			return false;
		}
		const extensionDescription = globalRegistry.getExtensionDescription(extensionId);
		if (!extensionDescription) {
			// unknown extension
			return false;
		}
		if ((extensionDescription.main || extensionDescription.browser) && extensionDescription.api === 'none') {
			return true;
		}
		return false;
	}

	private readonly _onDidChange = this._register(new Emitter<void>());
	public readonly onDidChange = this._onDidChange.event;

	private _versionId: number = 0;
	private _extensionDescriptions: IExtensionDescription[];
	private _extensionsMap!: ExtensionIdentifierMap<IExtensionDescription>;
	private _extensionsArr!: IExtensionDescription[];
	private _activationMap!: Map<string, IExtensionDescription[]>;

	constructor(
		private readonly _activationEventsReader: IActivationEventsReader,
		extensionDescriptions: IExtensionDescription[]
	) {
		super();
		this._extensionDescriptions = extensionDescriptions;
		this._initialize();
	}

	private _initialize(): void {
		// Ensure extensions are stored in the order: builtin, user, under development
		this._extensionDescriptions.sort(extensionCmp);

		this._extensionsMap = new ExtensionIdentifierMap<IExtensionDescription>();
		this._extensionsArr = [];
		this._activationMap = new Map<string, IExtensionDescription[]>();

		for (const extensionDescription of this._extensionDescriptions) {
			if (this._extensionsMap.has(extensionDescription.identifier)) {
				// No overwriting allowed!
				console.error('Extension `' + extensionDescription.identifier.value + '` is already registered');
				continue;
			}

			this._extensionsMap.set(extensionDescription.identifier, extensionDescription);
			this._extensionsArr.push(extensionDescription);

			const activationEvents = this._activationEventsReader.readActivationEvents(extensionDescription);
			for (const activationEvent of activationEvents) {
				if (!this._activationMap.has(activationEvent)) {
					this._activationMap.set(activationEvent, []);
				}
				this._activationMap.get(activationEvent)!.push(extensionDescription);
			}
		}
	}

	public set(extensionDescriptions: IExtensionDescription[]): { versionId: number } {
		this._extensionDescriptions = extensionDescriptions;
		this._initialize();
		this._versionId++;
		this._onDidChange.fire(undefined);
		return {
			versionId: this._versionId
		};
	}

	public deltaExtensions(toAdd: IExtensionDescription[], toRemove: ExtensionIdentifier[]): DeltaExtensionsResult {
		// It is possible that an extension is removed, only to be added again at a different version
		// so we will first handle removals
		this._extensionDescriptions = removeExtensions(this._extensionDescriptions, toRemove);

		// Then, handle the extensions to add
		this._extensionDescriptions = this._extensionDescriptions.concat(toAdd);

		// Immediately remove looping extensions!
		const looping = ExtensionDescriptionRegistry._findLoopingExtensions(this._extensionDescriptions);
		this._extensionDescriptions = removeExtensions(this._extensionDescriptions, looping.map(ext => ext.identifier));

		this._initialize();
		this._versionId++;
		this._onDidChange.fire(undefined);
		return new DeltaExtensionsResult(this._versionId, looping);
	}

	private static _findLoopingExtensions(extensionDescriptions: IExtensionDescription[]): IExtensionDescription[] {
		const G = new class {

			private _arcs = new Map<string, string[]>();
			private _nodesSet = new Set<string>();
			private _nodesArr: string[] = [];

			addNode(id: string): void {
				if (!this._nodesSet.has(id)) {
					this._nodesSet.add(id);
					this._nodesArr.push(id);
				}
			}

			addArc(from: string, to: string): void {
				this.addNode(from);
				this.addNode(to);
				if (this._arcs.has(from)) {
					this._arcs.get(from)!.push(to);
				} else {
					this._arcs.set(from, [to]);
				}
			}

			getArcs(id: string): string[] {
				if (this._arcs.has(id)) {
					return this._arcs.get(id)!;
				}
				return [];
			}

			hasOnlyGoodArcs(id: string, good: Set<string>): boolean {
				const dependencies = G.getArcs(id);
				for (let i = 0; i < dependencies.length; i++) {
					if (!good.has(dependencies[i])) {
						return false;
					}
				}
				return true;
			}

			getNodes(): string[] {
				return this._nodesArr;
			}
		};

		const descs = new ExtensionIdentifierMap<IExtensionDescription>();
		for (const extensionDescription of extensionDescriptions) {
			descs.set(extensionDescription.identifier, extensionDescription);
			if (extensionDescription.extensionDependencies) {
				for (const depId of extensionDescription.extensionDependencies) {
					G.addArc(ExtensionIdentifier.toKey(extensionDescription.identifier), ExtensionIdentifier.toKey(depId));
				}
			}
		}

		// initialize with all extensions with no dependencies.
		const good = new Set<string>();
		G.getNodes().filter(id => G.getArcs(id).length === 0).forEach(id => good.add(id));

		// all other extensions will be processed below.
		const nodes = G.getNodes().filter(id => !good.has(id));

		let madeProgress: boolean;
		do {
			madeProgress = false;

			// find one extension which has only good deps
			for (let i = 0; i < nodes.length; i++) {
				const id = nodes[i];

				if (G.hasOnlyGoodArcs(id, good)) {
					nodes.splice(i, 1);
					i--;
					good.add(id);
					madeProgress = true;
				}
			}
		} while (madeProgress);

		// The remaining nodes are bad and have loops
		return nodes.map(id => descs.get(id)!);
	}

	public containsActivationEvent(activationEvent: string): boolean {
		return this._activationMap.has(activationEvent);
	}

	public containsExtension(extensionId: ExtensionIdentifier): boolean {
		return this._extensionsMap.has(extensionId);
	}

	public getExtensionDescriptionsForActivationEvent(activationEvent: string): IExtensionDescription[] {
		const extensions = this._activationMap.get(activationEvent);
		return extensions ? extensions.slice(0) : [];
	}

	public getAllExtensionDescriptions(): IExtensionDescription[] {
		return this._extensionsArr.slice(0);
	}

	public getSnapshot(): ExtensionDescriptionRegistrySnapshot {
		return new ExtensionDescriptionRegistrySnapshot(
			this._versionId,
			this.getAllExtensionDescriptions()
		);
	}

	public getExtensionDescription(extensionId: ExtensionIdentifier | string): IExtensionDescription | undefined {
		const extension = this._extensionsMap.get(extensionId);
		return extension ? extension : undefined;
	}

	public getExtensionDescriptionByUUID(uuid: string): IExtensionDescription | undefined {
		for (const extensionDescription of this._extensionsArr) {
			if (extensionDescription.uuid === uuid) {
				return extensionDescription;
			}
		}
		return undefined;
	}

	public getExtensionDescriptionByIdOrUUID(extensionId: ExtensionIdentifier | string, uuid: string | undefined): IExtensionDescription | undefined {
		return (
			this.getExtensionDescription(extensionId)
			?? (uuid ? this.getExtensionDescriptionByUUID(uuid) : undefined)
		);
	}
}

export class ExtensionDescriptionRegistrySnapshot {
	constructor(
		public readonly versionId: number,
		public readonly extensions: readonly IExtensionDescription[]
	) { }
}

export interface IActivationEventsReader {
	readActivationEvents(extensionDescription: IExtensionDescription): string[];
}

export class LockableExtensionDescriptionRegistry implements IReadOnlyExtensionDescriptionRegistry {

	private readonly _actual: ExtensionDescriptionRegistry;
	private readonly _lock = new Lock();

	constructor(activationEventsReader: IActivationEventsReader) {
		this._actual = new ExtensionDescriptionRegistry(activationEventsReader, []);
	}

	public async acquireLock(customerName: string): Promise<ExtensionDescriptionRegistryLock> {
		const lock = await this._lock.acquire(customerName);
		return new ExtensionDescriptionRegistryLock(this, lock);
	}

	public deltaExtensions(acquiredLock: ExtensionDescriptionRegistryLock, toAdd: IExtensionDescription[], toRemove: ExtensionIdentifier[]): DeltaExtensionsResult {
		if (!acquiredLock.isAcquiredFor(this)) {
			throw new Error('Lock is not held');
		}
		return this._actual.deltaExtensions(toAdd, toRemove);
	}

	public containsActivationEvent(activationEvent: string): boolean {
		return this._actual.containsActivationEvent(activationEvent);
	}
	public containsExtension(extensionId: ExtensionIdentifier): boolean {
		return this._actual.containsExtension(extensionId);
	}
	public getExtensionDescriptionsForActivationEvent(activationEvent: string): IExtensionDescription[] {
		return this._actual.getExtensionDescriptionsForActivationEvent(activationEvent);
	}
	public getAllExtensionDescriptions(): IExtensionDescription[] {
		return this._actual.getAllExtensionDescriptions();
	}
	public getSnapshot(): ExtensionDescriptionRegistrySnapshot {
		return this._actual.getSnapshot();
	}
	public getExtensionDescription(extensionId: ExtensionIdentifier | string): IExtensionDescription | undefined {
		return this._actual.getExtensionDescription(extensionId);
	}
	public getExtensionDescriptionByUUID(uuid: string): IExtensionDescription | undefined {
		return this._actual.getExtensionDescriptionByUUID(uuid);
	}
	public getExtensionDescriptionByIdOrUUID(extensionId: ExtensionIdentifier | string, uuid: string | undefined): IExtensionDescription | undefined {
		return this._actual.getExtensionDescriptionByIdOrUUID(extensionId, uuid);
	}
}

export class ExtensionDescriptionRegistryLock extends Disposable {

	private _isDisposed = false;

	constructor(
		private readonly _registry: LockableExtensionDescriptionRegistry,
		lock: IDisposable
	) {
		super();
		this._register(lock);
	}

	public isAcquiredFor(registry: LockableExtensionDescriptionRegistry): boolean {
		return !this._isDisposed && this._registry === registry;
	}
}

class LockCustomer {
	public readonly promise: Promise<IDisposable>;
	private readonly _resolve: (value: IDisposable) => void;

	constructor(
		public readonly name: string
	) {
		const withResolvers = promiseWithResolvers<IDisposable>();
		this.promise = withResolvers.promise;
		this._resolve = withResolvers.resolve;
	}

	resolve(value: IDisposable): void {
		this._resolve(value);
	}
}

class Lock {
	private readonly _pendingCustomers: LockCustomer[] = [];
	private _isLocked = false;

	public async acquire(customerName: string): Promise<IDisposable> {
		const customer = new LockCustomer(customerName);
		this._pendingCustomers.push(customer);
		this._advance();
		return customer.promise;
	}

	private _advance(): void {
		if (this._isLocked) {
			// cannot advance yet
			return;
		}
		if (this._pendingCustomers.length === 0) {
			// no more waiting customers
			return;
		}

		const customer = this._pendingCustomers.shift()!;

		this._isLocked = true;
		let customerHoldsLock = true;

		const logLongRunningCustomerTimeout = setTimeout(() => {
			if (customerHoldsLock) {
				console.warn(`The customer named ${customer.name} has been holding on to the lock for 30s. This might be a problem.`);
			}
		}, 30 * 1000 /* 30 seconds */);

		const releaseLock = () => {
			if (!customerHoldsLock) {
				return;
			}
			clearTimeout(logLongRunningCustomerTimeout);
			customerHoldsLock = false;
			this._isLocked = false;
			this._advance();
		};

		customer.resolve(toDisposable(releaseLock));
	}
}

const enum SortBucket {
	Builtin = 0,
	User = 1,
	Dev = 2
}

/**
 * Ensure that:
 * - first are builtin extensions
 * - second are user extensions
 * - third are extensions under development
 *
 * In each bucket, extensions must be sorted alphabetically by their folder name.
 */
function extensionCmp(a: IExtensionDescription, b: IExtensionDescription): number {
	const aSortBucket = (a.isBuiltin ? SortBucket.Builtin : a.isUnderDevelopment ? SortBucket.Dev : SortBucket.User);
	const bSortBucket = (b.isBuiltin ? SortBucket.Builtin : b.isUnderDevelopment ? SortBucket.Dev : SortBucket.User);
	if (aSortBucket !== bSortBucket) {
		return aSortBucket - bSortBucket;
	}
	const aLastSegment = path.posix.basename(a.extensionLocation.path);
	const bLastSegment = path.posix.basename(b.extensionLocation.path);
	if (aLastSegment < bLastSegment) {
		return -1;
	}
	if (aLastSegment > bLastSegment) {
		return 1;
	}
	return 0;
}

function removeExtensions(arr: IExtensionDescription[], toRemove: ExtensionIdentifier[]): IExtensionDescription[] {
	const toRemoveSet = new ExtensionIdentifierSet(toRemove);
	return arr.filter(extension => !toRemoveSet.has(extension.identifier));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionDevOptions.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionDevOptions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';

export interface IExtensionDevOptions {
	readonly isExtensionDevHost: boolean;
	readonly isExtensionDevDebug: boolean;
	readonly isExtensionDevDebugBrk: boolean;
	readonly isExtensionDevTestFromCli: boolean;
}

export function parseExtensionDevOptions(environmentService: IEnvironmentService): IExtensionDevOptions {
	// handle extension host lifecycle a bit special when we know we are developing an extension that runs inside
	const isExtensionDevHost = environmentService.isExtensionDevelopment;

	let debugOk = true;
	const extDevLocs = environmentService.extensionDevelopmentLocationURI;
	if (extDevLocs) {
		for (const x of extDevLocs) {
			if (x.scheme !== Schemas.file) {
				debugOk = false;
			}
		}
	}

	const isExtensionDevDebug = debugOk && typeof environmentService.debugExtensionHost.port === 'number';
	const isExtensionDevDebugBrk = debugOk && !!environmentService.debugExtensionHost.break;
	const isExtensionDevTestFromCli = isExtensionDevHost && !!environmentService.extensionTestsLocationURI && !environmentService.debugExtensionHost.debugId;
	return {
		isExtensionDevHost,
		isExtensionDevDebug,
		isExtensionDevDebugBrk,
		isExtensionDevTestFromCli
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostEnv.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostEnv.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IProcessEnvironment } from '../../../../base/common/platform.js';

export const enum ExtHostConnectionType {
	IPC = 1,
	Socket = 2,
	MessagePort = 3
}

/**
 * The extension host will connect via named pipe / domain socket to its renderer.
 */
export class IPCExtHostConnection {
	public static ENV_KEY = 'VSCODE_EXTHOST_IPC_HOOK';

	public readonly type = ExtHostConnectionType.IPC;

	constructor(
		public readonly pipeName: string
	) { }

	public serialize(env: IProcessEnvironment): void {
		env[IPCExtHostConnection.ENV_KEY] = this.pipeName;
	}
}

/**
 * The extension host will receive via nodejs IPC the socket to its renderer.
 */
export class SocketExtHostConnection {
	public static ENV_KEY = 'VSCODE_EXTHOST_WILL_SEND_SOCKET';

	public readonly type = ExtHostConnectionType.Socket;

	public serialize(env: IProcessEnvironment): void {
		env[SocketExtHostConnection.ENV_KEY] = '1';
	}
}

/**
 * The extension host will receive via nodejs IPC the MessagePort to its renderer.
 */
export class MessagePortExtHostConnection {
	public static ENV_KEY = 'VSCODE_WILL_SEND_MESSAGE_PORT';

	public readonly type = ExtHostConnectionType.MessagePort;

	public serialize(env: IProcessEnvironment): void {
		env[MessagePortExtHostConnection.ENV_KEY] = '1';
	}
}

export type ExtHostConnection = IPCExtHostConnection | SocketExtHostConnection | MessagePortExtHostConnection;

function clean(env: IProcessEnvironment): void {
	delete env[IPCExtHostConnection.ENV_KEY];
	delete env[SocketExtHostConnection.ENV_KEY];
	delete env[MessagePortExtHostConnection.ENV_KEY];
}

/**
 * Write `connection` into `env` and clean up `env`.
 */
export function writeExtHostConnection(connection: ExtHostConnection, env: IProcessEnvironment): void {
	// Avoid having two different keys that might introduce amiguity or problems.
	clean(env);
	connection.serialize(env);
}

/**
 * Read `connection` from `env` and clean up `env`.
 */
export function readExtHostConnection(env: IProcessEnvironment): ExtHostConnection {
	if (env[IPCExtHostConnection.ENV_KEY]) {
		return cleanAndReturn(env, new IPCExtHostConnection(env[IPCExtHostConnection.ENV_KEY]!));
	}
	if (env[SocketExtHostConnection.ENV_KEY]) {
		return cleanAndReturn(env, new SocketExtHostConnection());
	}
	if (env[MessagePortExtHostConnection.ENV_KEY]) {
		return cleanAndReturn(env, new MessagePortExtHostConnection());
	}
	throw new Error(`No connection information defined in environment!`);
}

function cleanAndReturn(env: IProcessEnvironment, result: ExtHostConnection): ExtHostConnection {
	clean(env);
	return result;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostKind.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostKind.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';

export const enum ExtensionHostKind {
	LocalProcess = 1,
	LocalWebWorker = 2,
	Remote = 3
}

export function extensionHostKindToString(kind: ExtensionHostKind | null): string {
	if (kind === null) {
		return 'None';
	}
	switch (kind) {
		case ExtensionHostKind.LocalProcess: return 'LocalProcess';
		case ExtensionHostKind.LocalWebWorker: return 'LocalWebWorker';
		case ExtensionHostKind.Remote: return 'Remote';
	}
}

export const enum ExtensionRunningPreference {
	None,
	Local,
	Remote
}

export function extensionRunningPreferenceToString(preference: ExtensionRunningPreference) {
	switch (preference) {
		case ExtensionRunningPreference.None:
			return 'None';
		case ExtensionRunningPreference.Local:
			return 'Local';
		case ExtensionRunningPreference.Remote:
			return 'Remote';
	}
}

export interface IExtensionHostKindPicker {
	pickExtensionHostKind(extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference): ExtensionHostKind | null;
}

export function determineExtensionHostKinds(
	_localExtensions: IExtensionDescription[],
	_remoteExtensions: IExtensionDescription[],
	getExtensionKind: (extensionDescription: IExtensionDescription) => ExtensionKind[],
	pickExtensionHostKind: (extensionId: ExtensionIdentifier, extensionKinds: ExtensionKind[], isInstalledLocally: boolean, isInstalledRemotely: boolean, preference: ExtensionRunningPreference) => ExtensionHostKind | null
): Map<string, ExtensionHostKind | null> {
	const localExtensions = toExtensionWithKind(_localExtensions, getExtensionKind);
	const remoteExtensions = toExtensionWithKind(_remoteExtensions, getExtensionKind);

	const allExtensions = new Map<string, ExtensionInfo>();
	const collectExtension = (ext: ExtensionWithKind) => {
		if (allExtensions.has(ext.key)) {
			return;
		}
		const local = localExtensions.get(ext.key) || null;
		const remote = remoteExtensions.get(ext.key) || null;
		const info = new ExtensionInfo(local, remote);
		allExtensions.set(info.key, info);
	};
	localExtensions.forEach((ext) => collectExtension(ext));
	remoteExtensions.forEach((ext) => collectExtension(ext));

	const extensionHostKinds = new Map<string, ExtensionHostKind | null>();
	allExtensions.forEach((ext) => {
		const isInstalledLocally = Boolean(ext.local);
		const isInstalledRemotely = Boolean(ext.remote);

		const isLocallyUnderDevelopment = Boolean(ext.local && ext.local.isUnderDevelopment);
		const isRemotelyUnderDevelopment = Boolean(ext.remote && ext.remote.isUnderDevelopment);

		let preference = ExtensionRunningPreference.None;
		if (isLocallyUnderDevelopment && !isRemotelyUnderDevelopment) {
			preference = ExtensionRunningPreference.Local;
		} else if (isRemotelyUnderDevelopment && !isLocallyUnderDevelopment) {
			preference = ExtensionRunningPreference.Remote;
		}

		extensionHostKinds.set(ext.key, pickExtensionHostKind(ext.identifier, ext.kind, isInstalledLocally, isInstalledRemotely, preference));
	});

	return extensionHostKinds;
}

function toExtensionWithKind(
	extensions: IExtensionDescription[],
	getExtensionKind: (extensionDescription: IExtensionDescription) => ExtensionKind[]
): Map<string, ExtensionWithKind> {
	const result = new Map<string, ExtensionWithKind>();
	extensions.forEach((desc) => {
		const ext = new ExtensionWithKind(desc, getExtensionKind(desc));
		result.set(ext.key, ext);
	});
	return result;
}

class ExtensionWithKind {

	constructor(
		public readonly desc: IExtensionDescription,
		public readonly kind: ExtensionKind[]
	) { }

	public get key(): string {
		return ExtensionIdentifier.toKey(this.desc.identifier);
	}

	public get isUnderDevelopment(): boolean {
		return this.desc.isUnderDevelopment;
	}
}

class ExtensionInfo {

	constructor(
		public readonly local: ExtensionWithKind | null,
		public readonly remote: ExtensionWithKind | null,
	) { }

	public get key(): string {
		if (this.local) {
			return this.local.key;
		}
		return this.remote!.key;
	}

	public get identifier(): ExtensionIdentifier {
		if (this.local) {
			return this.local.desc.identifier;
		}
		return this.remote!.desc.identifier;
	}

	public get kind(): ExtensionKind[] {
		// in case of disagreements between extension kinds, it is always
		// better to pick the local extension because it has a much higher
		// chance of being up-to-date
		if (this.local) {
			return this.local.kind;
		}
		return this.remote!.kind;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostManager.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostManager.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IntervalTimer } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import * as errors from '../../../../base/common/errors.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { URI } from '../../../../base/common/uri.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import * as nls from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { RemoteAuthorityResolverErrorCode, getRemoteAuthorityPrefix } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ExtHostCustomersRegistry, IInternalExtHostContext } from './extHostCustomers.js';
import { ExtensionHostKind, extensionHostKindToString } from './extensionHostKind.js';
import { IExtensionHostManager } from './extensionHostManagers.js';
import { IExtensionDescriptionDelta } from './extensionHostProtocol.js';
import { IExtensionHostProxy, IResolveAuthorityResult } from './extensionHostProxy.js';
import { ExtensionRunningLocation } from './extensionRunningLocation.js';
import { ActivationKind, ExtensionActivationReason, ExtensionHostStartup, IExtensionHost, IExtensionInspectInfo, IInternalExtensionService } from './extensions.js';
import { Proxied, ProxyIdentifier } from './proxyIdentifier.js';
import { IRPCProtocolLogger, RPCProtocol, RequestInitiator, ResponsiveState } from './rpcProtocol.js';

// Enable to see detailed message communication between window and extension host
const LOG_EXTENSION_HOST_COMMUNICATION = false;
const LOG_USE_COLORS = true;

type ExtensionHostStartupClassification = {
	owner: 'alexdima';
	comment: 'The startup state of the extension host';
	time: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The time reported by Date.now().' };
	action: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The action: starting, success or error.' };
	kind: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The extension host kind: LocalProcess, LocalWebWorker or Remote.' };
	errorName?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error name.' };
	errorMessage?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error message.' };
	errorStack?: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The error stack.' };
};

type ExtensionHostStartupEvent = {
	time: number;
	action: 'starting' | 'success' | 'error';
	kind: string;
	errorName?: string;
	errorMessage?: string;
	errorStack?: string;
};

export class ExtensionHostManager extends Disposable implements IExtensionHostManager {

	public readonly onDidExit: Event<[number, string | null]>;

	private readonly _onDidChangeResponsiveState: Emitter<ResponsiveState> = this._register(new Emitter<ResponsiveState>());
	public readonly onDidChangeResponsiveState: Event<ResponsiveState> = this._onDidChangeResponsiveState.event;

	/**
	 * A map of already requested activation events to speed things up if the same activation event is triggered multiple times.
	 */
	private readonly _cachedActivationEvents: Map<string, Promise<void>>;
	private readonly _resolvedActivationEvents: Set<string>;
	private _rpcProtocol: RPCProtocol | null;
	private readonly _customers: IDisposable[];
	private readonly _extensionHost: IExtensionHost;
	private _proxy: Promise<IExtensionHostProxy | null> | null;
	private _hasStarted = false;

	public get pid(): number | null {
		return this._extensionHost.pid;
	}

	public get kind(): ExtensionHostKind {
		return this._extensionHost.runningLocation.kind;
	}

	public get startup(): ExtensionHostStartup {
		return this._extensionHost.startup;
	}

	public get friendyName(): string {
		return friendlyExtHostName(this.kind, this.pid);
	}

	constructor(
		extensionHost: IExtensionHost,
		initialActivationEvents: string[],
		private readonly _internalExtensionService: IInternalExtensionService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@ILogService private readonly _logService: ILogService,
	) {
		super();
		this._cachedActivationEvents = new Map<string, Promise<void>>();
		this._resolvedActivationEvents = new Set<string>();
		this._rpcProtocol = null;
		this._customers = [];

		this._extensionHost = extensionHost;
		this.onDidExit = this._extensionHost.onExit;

		const startingTelemetryEvent: ExtensionHostStartupEvent = {
			time: Date.now(),
			action: 'starting',
			kind: extensionHostKindToString(this.kind)
		};
		this._telemetryService.publicLog2<ExtensionHostStartupEvent, ExtensionHostStartupClassification>('extensionHostStartup', startingTelemetryEvent);

		this._proxy = this._extensionHost.start().then(
			(protocol) => {
				this._hasStarted = true;

				// Track healthy extension host startup
				const successTelemetryEvent: ExtensionHostStartupEvent = {
					time: Date.now(),
					action: 'success',
					kind: extensionHostKindToString(this.kind)
				};
				this._telemetryService.publicLog2<ExtensionHostStartupEvent, ExtensionHostStartupClassification>('extensionHostStartup', successTelemetryEvent);

				return this._createExtensionHostCustomers(this.kind, protocol);
			},
			(err) => {
				this._logService.error(`Error received from starting extension host (kind: ${extensionHostKindToString(this.kind)})`);
				this._logService.error(err);

				// Track errors during extension host startup
				const failureTelemetryEvent: ExtensionHostStartupEvent = {
					time: Date.now(),
					action: 'error',
					kind: extensionHostKindToString(this.kind)
				};

				if (err && err.name) {
					failureTelemetryEvent.errorName = err.name;
				}
				if (err && err.message) {
					failureTelemetryEvent.errorMessage = err.message;
				}
				if (err && err.stack) {
					failureTelemetryEvent.errorStack = err.stack;
				}
				this._telemetryService.publicLog2<ExtensionHostStartupEvent, ExtensionHostStartupClassification>('extensionHostStartup', failureTelemetryEvent);

				return null;
			}
		);
		this._proxy.then(() => {
			initialActivationEvents.forEach((activationEvent) => this.activateByEvent(activationEvent, ActivationKind.Normal));
			this._register(registerLatencyTestProvider({
				measure: () => this.measure()
			}));
		});
	}

	public async disconnect(): Promise<void> {
		await this._extensionHost?.disconnect?.();
	}

	public override dispose(): void {
		this._extensionHost?.dispose();
		this._rpcProtocol?.dispose();

		for (let i = 0, len = this._customers.length; i < len; i++) {
			const customer = this._customers[i];
			try {
				customer.dispose();
			} catch (err) {
				errors.onUnexpectedError(err);
			}
		}
		this._proxy = null;

		super.dispose();
	}

	private async measure(): Promise<ExtHostLatencyResult | null> {
		const proxy = await this._proxy;
		if (!proxy) {
			return null;
		}
		const latency = await this._measureLatency(proxy);
		const down = await this._measureDown(proxy);
		const up = await this._measureUp(proxy);
		return {
			remoteAuthority: this._extensionHost.remoteAuthority,
			latency,
			down,
			up
		};
	}

	public async ready(): Promise<void> {
		await this._proxy;
	}

	private async _measureLatency(proxy: IExtensionHostProxy): Promise<number> {
		const COUNT = 10;

		let sum = 0;
		for (let i = 0; i < COUNT; i++) {
			const sw = StopWatch.create();
			await proxy.test_latency(i);
			sw.stop();
			sum += sw.elapsed();
		}
		return (sum / COUNT);
	}

	private static _convert(byteCount: number, elapsedMillis: number): number {
		return (byteCount * 1000 * 8) / elapsedMillis;
	}

	private async _measureUp(proxy: IExtensionHostProxy): Promise<number> {
		const SIZE = 10 * 1024 * 1024; // 10MB

		const buff = VSBuffer.alloc(SIZE);
		const value = Math.ceil(Math.random() * 256);
		for (let i = 0; i < buff.byteLength; i++) {
			buff.writeUInt8(i, value);
		}
		const sw = StopWatch.create();
		await proxy.test_up(buff);
		sw.stop();
		return ExtensionHostManager._convert(SIZE, sw.elapsed());
	}

	private async _measureDown(proxy: IExtensionHostProxy): Promise<number> {
		const SIZE = 10 * 1024 * 1024; // 10MB

		const sw = StopWatch.create();
		await proxy.test_down(SIZE);
		sw.stop();
		return ExtensionHostManager._convert(SIZE, sw.elapsed());
	}

	private _createExtensionHostCustomers(kind: ExtensionHostKind, protocol: IMessagePassingProtocol): IExtensionHostProxy {

		let logger: IRPCProtocolLogger | null = null;
		if (LOG_EXTENSION_HOST_COMMUNICATION || this._environmentService.logExtensionHostCommunication) {
			logger = new RPCLogger(kind);
		} else if (TelemetryRPCLogger.isEnabled()) {
			logger = new TelemetryRPCLogger(this._telemetryService);
		}

		this._rpcProtocol = new RPCProtocol(protocol, logger);
		this._register(this._rpcProtocol.onDidChangeResponsiveState((responsiveState: ResponsiveState) => this._onDidChangeResponsiveState.fire(responsiveState)));
		let extensionHostProxy: IExtensionHostProxy | null = null as IExtensionHostProxy | null;
		let mainProxyIdentifiers: ProxyIdentifier<any>[] = [];
		const extHostContext: IInternalExtHostContext = {
			remoteAuthority: this._extensionHost.remoteAuthority,
			extensionHostKind: this.kind,
			getProxy: <T>(identifier: ProxyIdentifier<T>): Proxied<T> => this._rpcProtocol!.getProxy(identifier),
			set: <T, R extends T>(identifier: ProxyIdentifier<T>, instance: R): R => this._rpcProtocol!.set(identifier, instance),
			dispose: (): void => this._rpcProtocol!.dispose(),
			assertRegistered: (identifiers: ProxyIdentifier<any>[]): void => this._rpcProtocol!.assertRegistered(identifiers),
			drain: (): Promise<void> => this._rpcProtocol!.drain(),

			//#region internal
			internalExtensionService: this._internalExtensionService,
			_setExtensionHostProxy: (value: IExtensionHostProxy): void => {
				extensionHostProxy = value;
			},
			_setAllMainProxyIdentifiers: (value: ProxyIdentifier<any>[]): void => {
				mainProxyIdentifiers = value;
			},
			//#endregion
		};

		// Named customers
		const namedCustomers = ExtHostCustomersRegistry.getNamedCustomers();
		for (let i = 0, len = namedCustomers.length; i < len; i++) {
			const [id, ctor] = namedCustomers[i];
			try {
				const instance = this._instantiationService.createInstance(ctor, extHostContext);
				this._customers.push(instance);
				this._rpcProtocol.set(id, instance);
			} catch (err) {
				this._logService.error(`Cannot instantiate named customer: '${id.sid}'`);
				this._logService.error(err);
				errors.onUnexpectedError(err);
			}
		}

		// Customers
		const customers = ExtHostCustomersRegistry.getCustomers();
		for (const ctor of customers) {
			try {
				const instance = this._instantiationService.createInstance(ctor, extHostContext);
				this._customers.push(instance);
			} catch (err) {
				this._logService.error(err);
				errors.onUnexpectedError(err);
			}
		}

		if (!extensionHostProxy) {
			throw new Error(`Missing IExtensionHostProxy!`);
		}

		// Check that no named customers are missing
		this._rpcProtocol.assertRegistered(mainProxyIdentifiers);

		return extensionHostProxy;
	}

	public async activate(extension: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean> {
		const proxy = await this._proxy;
		if (!proxy) {
			return false;
		}
		return proxy.activate(extension, reason);
	}

	public activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		if (activationKind === ActivationKind.Immediate && !this._hasStarted) {
			return Promise.resolve();
		}

		if (!this._cachedActivationEvents.has(activationEvent)) {
			this._cachedActivationEvents.set(activationEvent, this._activateByEvent(activationEvent, activationKind));
		}
		return this._cachedActivationEvents.get(activationEvent)!;
	}

	public activationEventIsDone(activationEvent: string): boolean {
		return this._resolvedActivationEvents.has(activationEvent);
	}

	private async _activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void> {
		if (!this._proxy) {
			return;
		}
		const proxy = await this._proxy;
		if (!proxy) {
			// this case is already covered above and logged.
			// i.e. the extension host could not be started
			return;
		}

		if (!this._extensionHost.extensions!.containsActivationEvent(activationEvent)) {
			this._resolvedActivationEvents.add(activationEvent);
			return;
		}

		await proxy.activateByEvent(activationEvent, activationKind);
		this._resolvedActivationEvents.add(activationEvent);
	}

	public async getInspectPort(tryEnableInspector: boolean): Promise<IExtensionInspectInfo | undefined> {
		if (this._extensionHost) {
			if (tryEnableInspector) {
				await this._extensionHost.enableInspectPort();
			}
			const port = this._extensionHost.getInspectPort();
			if (port) {
				return port;
			}
		}

		return undefined;
	}

	public async resolveAuthority(remoteAuthority: string, resolveAttempt: number): Promise<IResolveAuthorityResult> {
		const sw = StopWatch.create(false);
		const prefix = () => `[${extensionHostKindToString(this._extensionHost.runningLocation.kind)}${this._extensionHost.runningLocation.affinity}][resolveAuthority(${getRemoteAuthorityPrefix(remoteAuthority)},${resolveAttempt})][${sw.elapsed()}ms] `;
		const logInfo = (msg: string) => this._logService.info(`${prefix()}${msg}`);
		const logError = (msg: string, err: any = undefined) => this._logService.error(`${prefix()}${msg}`, err);

		logInfo(`obtaining proxy...`);
		const proxy = await this._proxy;
		if (!proxy) {
			logError(`no proxy`);
			return {
				type: 'error',
				error: {
					message: `Cannot resolve authority`,
					code: RemoteAuthorityResolverErrorCode.Unknown,
					detail: undefined
				}
			};
		}
		logInfo(`invoking...`);
		const intervalLogger = new IntervalTimer();
		try {
			intervalLogger.cancelAndSet(() => logInfo('waiting...'), 1000);
			const resolverResult = await proxy.resolveAuthority(remoteAuthority, resolveAttempt);
			intervalLogger.dispose();
			if (resolverResult.type === 'ok') {
				logInfo(`returned ${resolverResult.value.authority.connectTo}`);
			} else {
				logError(`returned an error`, resolverResult.error);
			}
			return resolverResult;
		} catch (err) {
			intervalLogger.dispose();
			logError(`returned an error`, err);
			return {
				type: 'error',
				error: {
					message: err.message,
					code: RemoteAuthorityResolverErrorCode.Unknown,
					detail: err
				}
			};
		}
	}

	public async getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI | null> {
		const proxy = await this._proxy;
		if (!proxy) {
			throw new Error(`Cannot resolve canonical URI`);
		}
		return proxy.getCanonicalURI(remoteAuthority, uri);
	}

	public async start(extensionRegistryVersionId: number, allExtensions: IExtensionDescription[], myExtensions: ExtensionIdentifier[]): Promise<void> {
		const proxy = await this._proxy;
		if (!proxy) {
			return;
		}
		const deltaExtensions = this._extensionHost.extensions!.set(extensionRegistryVersionId, allExtensions, myExtensions);
		return proxy.startExtensionHost(deltaExtensions);
	}

	public async extensionTestsExecute(): Promise<number> {
		const proxy = await this._proxy;
		if (!proxy) {
			throw new Error('Could not obtain Extension Host Proxy');
		}
		return proxy.extensionTestsExecute();
	}

	public representsRunningLocation(runningLocation: ExtensionRunningLocation): boolean {
		return this._extensionHost.runningLocation.equals(runningLocation);
	}

	public async deltaExtensions(incomingExtensionsDelta: IExtensionDescriptionDelta): Promise<void> {
		const proxy = await this._proxy;
		if (!proxy) {
			return;
		}
		const outgoingExtensionsDelta = this._extensionHost.extensions!.delta(incomingExtensionsDelta);
		if (!outgoingExtensionsDelta) {
			// The extension host already has this version of the extensions.
			return;
		}
		return proxy.deltaExtensions(outgoingExtensionsDelta);
	}

	public containsExtension(extensionId: ExtensionIdentifier): boolean {
		return this._extensionHost.extensions?.containsExtension(extensionId) ?? false;
	}

	public async setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void> {
		const proxy = await this._proxy;
		if (!proxy) {
			return;
		}

		return proxy.setRemoteEnvironment(env);
	}
}

export function friendlyExtHostName(kind: ExtensionHostKind, pid: number | null) {
	if (pid) {
		return `${extensionHostKindToString(kind)} pid: ${pid}`;
	}
	return `${extensionHostKindToString(kind)}`;
}

const colorTables = [
	['#2977B1', '#FC802D', '#34A13A', '#D3282F', '#9366BA'],
	['#8B564C', '#E177C0', '#7F7F7F', '#BBBE3D', '#2EBECD']
];

function prettyWithoutArrays(data: any): any {
	if (Array.isArray(data)) {
		return data;
	}
	if (data && typeof data === 'object' && typeof data.toString === 'function') {
		const result = data.toString();
		if (result !== '[object Object]') {
			return result;
		}
	}
	return data;
}

function pretty(data: any): any {
	if (Array.isArray(data)) {
		return data.map(prettyWithoutArrays);
	}
	return prettyWithoutArrays(data);
}

class RPCLogger implements IRPCProtocolLogger {

	private _totalIncoming = 0;
	private _totalOutgoing = 0;

	constructor(
		private readonly _kind: ExtensionHostKind
	) { }

	private _log(direction: string, totalLength: number, msgLength: number, req: number, initiator: RequestInitiator, str: string, data: any): void {
		data = pretty(data);

		const colorTable = colorTables[initiator];
		const color = LOG_USE_COLORS ? colorTable[req % colorTable.length] : '#000000';
		let args = [`%c[${extensionHostKindToString(this._kind)}][${direction}]%c[${String(totalLength).padStart(7)}]%c[len: ${String(msgLength).padStart(5)}]%c${String(req).padStart(5)} - ${str}`, 'color: darkgreen', 'color: grey', 'color: grey', `color: ${color}`];
		if (/\($/.test(str)) {
			args = args.concat(data);
			args.push(')');
		} else {
			args.push(data);
		}
		console.log.apply(console, args as [string, ...string[]]);
	}

	logIncoming(msgLength: number, req: number, initiator: RequestInitiator, str: string, data?: any): void {
		this._totalIncoming += msgLength;
		this._log('Ext \u2192 Win', this._totalIncoming, msgLength, req, initiator, str, data);
	}

	logOutgoing(msgLength: number, req: number, initiator: RequestInitiator, str: string, data?: any): void {
		this._totalOutgoing += msgLength;
		this._log('Win \u2192 Ext', this._totalOutgoing, msgLength, req, initiator, str, data);
	}
}

interface RPCTelemetryData {
	type: string;
	length: number;
}

type RPCTelemetryDataClassification = {
	owner: 'jrieken';
	comment: 'Insights about RPC message sizes';
	type: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The type of the RPC message' };
	length: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The byte-length of the RPC message' };
};

class TelemetryRPCLogger implements IRPCProtocolLogger {

	static isEnabled(): boolean {
		return Math.random() < 0.0001; // 0.01% of users
	}

	private readonly _pendingRequests = new Map<number, string>();

	constructor(@ITelemetryService private readonly _telemetryService: ITelemetryService) { }

	logIncoming(msgLength: number, req: number, initiator: RequestInitiator, str: string): void {

		if (initiator === RequestInitiator.LocalSide && /^receiveReply(Err)?:/.test(str)) {
			// log the size of reply messages
			const requestStr = this._pendingRequests.get(req) ?? 'unknown_reply';
			this._pendingRequests.delete(req);
			this._telemetryService.publicLog2<RPCTelemetryData, RPCTelemetryDataClassification>('extensionhost.incoming', {
				type: `${str} ${requestStr}`,
				length: msgLength
			});
		}

		if (initiator === RequestInitiator.OtherSide && /^receiveRequest /.test(str)) {
			// incoming request
			this._telemetryService.publicLog2<RPCTelemetryData, RPCTelemetryDataClassification>('extensionhost.incoming', {
				type: `${str}`,
				length: msgLength
			});
		}
	}

	logOutgoing(msgLength: number, req: number, initiator: RequestInitiator, str: string): void {

		if (initiator === RequestInitiator.LocalSide && str.startsWith('request: ')) {
			this._pendingRequests.set(req, str);
			this._telemetryService.publicLog2<RPCTelemetryData, RPCTelemetryDataClassification>('extensionhost.outgoing', {
				type: str,
				length: msgLength
			});
		}
	}
}

interface ExtHostLatencyResult {
	remoteAuthority: string | null;
	up: number;
	down: number;
	latency: number;
}

interface ExtHostLatencyProvider {
	measure(): Promise<ExtHostLatencyResult | null>;
}

const providers: ExtHostLatencyProvider[] = [];
function registerLatencyTestProvider(provider: ExtHostLatencyProvider): IDisposable {
	providers.push(provider);
	return {
		dispose: () => {
			for (let i = 0; i < providers.length; i++) {
				if (providers[i] === provider) {
					providers.splice(i, 1);
					return;
				}
			}
		}
	};
}

function getLatencyTestProviders(): ExtHostLatencyProvider[] {
	return providers.slice(0);
}

registerAction2(class MeasureExtHostLatencyAction extends Action2 {

	constructor() {
		super({
			id: 'editor.action.measureExtHostLatency',
			title: nls.localize2('measureExtHostLatency', "Measure Extension Host Latency"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor) {

		const editorService = accessor.get(IEditorService);

		const measurements = await Promise.all(getLatencyTestProviders().map(provider => provider.measure()));
		editorService.openEditor({ resource: undefined, contents: measurements.map(MeasureExtHostLatencyAction._print).join('\n\n'), options: { pinned: true } });
	}

	private static _print(m: ExtHostLatencyResult | null): string {
		if (!m) {
			return '';
		}
		return `${m.remoteAuthority ? `Authority: ${m.remoteAuthority}\n` : ``}Roundtrip latency: ${m.latency.toFixed(3)}ms\nUp: ${MeasureExtHostLatencyAction._printSpeed(m.up)}\nDown: ${MeasureExtHostLatencyAction._printSpeed(m.down)}\n`;
	}

	private static _printSpeed(n: number): string {
		if (n <= 1024) {
			return `${n} bps`;
		}
		if (n < 1024 * 1024) {
			return `${(n / 1024).toFixed(1)} kbps`;
		}
		return `${(n / 1024 / 1024).toFixed(1)} Mbps`;
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostManagers.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostManagers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ExtensionHostKind } from './extensionHostKind.js';
import { IExtensionDescriptionDelta } from './extensionHostProtocol.js';
import { IResolveAuthorityResult } from './extensionHostProxy.js';
import { ExtensionRunningLocation } from './extensionRunningLocation.js';
import { ActivationKind, ExtensionActivationReason, ExtensionHostStartup, IExtensionInspectInfo } from './extensions.js';
import { ResponsiveState } from './rpcProtocol.js';

export interface IExtensionHostManager {
	readonly pid: number | null;
	readonly kind: ExtensionHostKind;
	readonly startup: ExtensionHostStartup;
	readonly friendyName: string;
	readonly onDidExit: Event<[number, string | null]>;
	readonly onDidChangeResponsiveState: Event<ResponsiveState>;
	disconnect(): Promise<void>;
	dispose(): void;
	ready(): Promise<void>;
	representsRunningLocation(runningLocation: ExtensionRunningLocation): boolean;
	deltaExtensions(extensionsDelta: IExtensionDescriptionDelta): Promise<void>;
	containsExtension(extensionId: ExtensionIdentifier): boolean;
	activate(extension: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean>;
	activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void>;
	activationEventIsDone(activationEvent: string): boolean;
	getInspectPort(tryEnableInspector: boolean): Promise<IExtensionInspectInfo | undefined>;
	resolveAuthority(remoteAuthority: string, resolveAttempt: number): Promise<IResolveAuthorityResult>;
	/**
	 * Returns `null` if no resolver for `remoteAuthority` is found.
	 */
	getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI | null>;
	start(extensionRegistryVersionId: number, allExtensions: readonly IExtensionDescription[], myExtensions: ExtensionIdentifier[]): Promise<void>;
	extensionTestsExecute(): Promise<number>;
	setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostProtocol.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostProtocol.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { URI, UriComponents, UriDto } from '../../../../base/common/uri.js';
import { ExtensionIdentifier, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ILoggerResource, LogLevel } from '../../../../platform/log/common/log.js';
import { IRemoteConnectionData } from '../../../../platform/remote/common/remoteAuthorityResolver.js';

export interface IExtensionDescriptionSnapshot {
	readonly versionId: number;
	readonly allExtensions: IExtensionDescription[];
	readonly activationEvents: { [extensionId: string]: string[] };
	readonly myExtensions: ExtensionIdentifier[];
}

export interface IExtensionDescriptionDelta {
	readonly versionId: number;
	readonly toRemove: ExtensionIdentifier[];
	readonly toAdd: IExtensionDescription[];
	readonly addActivationEvents: { [extensionId: string]: string[] };
	readonly myToRemove: ExtensionIdentifier[];
	readonly myToAdd: ExtensionIdentifier[];
}

export interface IExtensionHostInitData {
	version: string;
	quality: string | undefined;
	commit?: string;
	date?: string;
	/**
	 * When set to `0`, no polling for the parent process still running will happen.
	 */
	parentPid: number | 0;
	environment: IEnvironment;
	workspace?: IStaticWorkspaceData | null;
	extensions: IExtensionDescriptionSnapshot;
	nlsBaseUrl?: URI;
	telemetryInfo: {
		readonly sessionId: string;
		readonly machineId: string;
		readonly sqmId: string;
		readonly devDeviceId: string;
		readonly firstSessionDate: string;
		readonly msftInternal?: boolean;
	};
	logLevel: LogLevel;
	loggers: UriDto<ILoggerResource>[];
	logsLocation: URI;
	autoStart: boolean;
	remote: { isRemote: boolean; authority: string | undefined; connectionData: IRemoteConnectionData | null };
	consoleForward: { includeStack: boolean; logNative: boolean };
	uiKind: UIKind;
	messagePorts?: ReadonlyMap<string, MessagePortLike>;
	handle?: string;
}

export interface IEnvironment {
	isExtensionDevelopmentDebug: boolean;
	appName: string;
	appHost: string;
	appRoot?: URI;
	appLanguage: string;
	isExtensionTelemetryLoggingOnly: boolean;
	appUriScheme: string;
	extensionDevelopmentLocationURI?: URI[];
	extensionTestsLocationURI?: URI;
	globalStorageHome: URI;
	workspaceStorageHome: URI;
	useHostProxy?: boolean;
	skipWorkspaceStorageLock?: boolean;
	extensionLogLevel?: [string, string][];
}

export interface IStaticWorkspaceData {
	id: string;
	name: string;
	transient?: boolean;
	configuration?: UriComponents | null;
	isUntitled?: boolean | null;
}

export interface MessagePortLike {
	postMessage(message: unknown, transfer?: Transferable[]): void;
	addEventListener(type: 'message', listener: (e: MessageEvent<unknown>) => unknown): void;
	removeEventListener(type: 'message', listener: (e: MessageEvent<unknown>) => unknown): void;
	start(): void;
}

export enum UIKind {
	Desktop = 1,
	Web = 2
}

export const enum ExtensionHostExitCode {
	// nodejs uses codes 1-13 and exit codes >128 are signal exits
	VersionMismatch = 55,
	UnexpectedError = 81,
}

export interface IExtHostReadyMessage {
	type: 'VSCODE_EXTHOST_IPC_READY';
}

export interface IExtHostSocketMessage {
	type: 'VSCODE_EXTHOST_IPC_SOCKET';
	initialDataChunk: string;
	skipWebSocketFrames: boolean;
	permessageDeflate: boolean;
	inflateBytes: string;
}

export interface IExtHostReduceGraceTimeMessage {
	type: 'VSCODE_EXTHOST_IPC_REDUCE_GRACE_TIME';
}

export const enum MessageType {
	Initialized,
	Ready,
	Terminate
}

export function createMessageOfType(type: MessageType): VSBuffer {
	const result = VSBuffer.alloc(1);

	switch (type) {
		case MessageType.Initialized: result.writeUInt8(1, 0); break;
		case MessageType.Ready: result.writeUInt8(2, 0); break;
		case MessageType.Terminate: result.writeUInt8(3, 0); break;
	}

	return result;
}

export function isMessageOfType(message: VSBuffer, type: MessageType): boolean {
	if (message.byteLength !== 1) {
		return false;
	}

	switch (message.readUInt8(0)) {
		case 1: return type === MessageType.Initialized;
		case 2: return type === MessageType.Ready;
		case 3: return type === MessageType.Terminate;
		default: return false;
	}
}

export const enum NativeLogMarkers {
	Start = 'START_NATIVE_LOG',
	End = 'END_NATIVE_LOG',
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionHostProxy.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionHostProxy.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBuffer } from '../../../../base/common/buffer.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IRemoteConnectionData, RemoteAuthorityResolverErrorCode, ResolverResult } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IExtensionDescriptionDelta } from './extensionHostProtocol.js';
import { ActivationKind, ExtensionActivationReason } from './extensions.js';

export interface IResolveAuthorityErrorResult {
	type: 'error';
	error: {
		message: string | undefined;
		code: RemoteAuthorityResolverErrorCode;
		detail: unknown;
	};
}

export interface IResolveAuthorityOKResult {
	type: 'ok';
	value: ResolverResult;
}

export type IResolveAuthorityResult = IResolveAuthorityErrorResult | IResolveAuthorityOKResult;

export interface IExtensionHostProxy {
	resolveAuthority(remoteAuthority: string, resolveAttempt: number): Promise<IResolveAuthorityResult>;
	/**
	 * Returns `null` if no resolver for `remoteAuthority` is found.
	 */
	getCanonicalURI(remoteAuthority: string, uri: URI): Promise<URI | null>;
	startExtensionHost(extensionsDelta: IExtensionDescriptionDelta): Promise<void>;
	extensionTestsExecute(): Promise<number>;
	activateByEvent(activationEvent: string, activationKind: ActivationKind): Promise<void>;
	activate(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<boolean>;
	setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void>;
	updateRemoteConnectionData(connectionData: IRemoteConnectionData): Promise<void>;
	deltaExtensions(extensionsDelta: IExtensionDescriptionDelta): Promise<void>;
	test_latency(n: number): Promise<number>;
	test_up(b: VSBuffer): Promise<number>;
	test_down(size: number): Promise<VSBuffer>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionManifestPropertiesService.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionManifestPropertiesService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IExtensionManifest, ExtensionUntrustedWorkspaceSupportType, ExtensionVirtualWorkspaceSupportType, IExtensionIdentifier, ALL_EXTENSION_KINDS, ExtensionIdentifierMap } from '../../../../platform/extensions/common/extensions.js';
import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { ExtensionsRegistry } from './extensionsRegistry.js';
import { getGalleryExtensionId } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ExtensionUntrustedWorkspaceSupport } from '../../../../base/common/product.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { WORKSPACE_TRUST_EXTENSION_SUPPORT } from '../../workspaces/common/workspaceTrust.js';
import { isBoolean } from '../../../../base/common/types.js';
import { IWorkspaceTrustEnablementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { isWeb } from '../../../../base/common/platform.js';

export const IExtensionManifestPropertiesService = createDecorator<IExtensionManifestPropertiesService>('extensionManifestPropertiesService');

export interface IExtensionManifestPropertiesService {
	readonly _serviceBrand: undefined;

	prefersExecuteOnUI(manifest: IExtensionManifest): boolean;
	prefersExecuteOnWorkspace(manifest: IExtensionManifest): boolean;
	prefersExecuteOnWeb(manifest: IExtensionManifest): boolean;

	canExecuteOnUI(manifest: IExtensionManifest): boolean;
	canExecuteOnWorkspace(manifest: IExtensionManifest): boolean;
	canExecuteOnWeb(manifest: IExtensionManifest): boolean;

	getExtensionKind(manifest: IExtensionManifest): ExtensionKind[];
	getUserConfiguredExtensionKind(extensionIdentifier: IExtensionIdentifier): ExtensionKind[] | undefined;
	getExtensionUntrustedWorkspaceSupportType(manifest: IExtensionManifest): ExtensionUntrustedWorkspaceSupportType;
	getExtensionVirtualWorkspaceSupportType(manifest: IExtensionManifest): ExtensionVirtualWorkspaceSupportType;
}

export class ExtensionManifestPropertiesService extends Disposable implements IExtensionManifestPropertiesService {

	readonly _serviceBrand: undefined;

	private _extensionPointExtensionKindsMap: Map<string, ExtensionKind[]> | null = null;
	private _productExtensionKindsMap: ExtensionIdentifierMap<ExtensionKind[]> | null = null;
	private _configuredExtensionKindsMap: ExtensionIdentifierMap<ExtensionKind | ExtensionKind[]> | null = null;

	private _productVirtualWorkspaceSupportMap: ExtensionIdentifierMap<{ default?: boolean; override?: boolean }> | null = null;
	private _configuredVirtualWorkspaceSupportMap: ExtensionIdentifierMap<boolean> | null = null;

	private readonly _configuredExtensionWorkspaceTrustRequestMap: ExtensionIdentifierMap<{ supported: ExtensionUntrustedWorkspaceSupportType; version?: string }>;
	private readonly _productExtensionWorkspaceTrustRequestMap: Map<string, ExtensionUntrustedWorkspaceSupport>;

	constructor(
		@IProductService private readonly productService: IProductService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspaceTrustEnablementService private readonly workspaceTrustEnablementService: IWorkspaceTrustEnablementService,
		@ILogService private readonly logService: ILogService,
	) {
		super();

		// Workspace trust request type (settings.json)
		this._configuredExtensionWorkspaceTrustRequestMap = new ExtensionIdentifierMap<{ supported: ExtensionUntrustedWorkspaceSupportType; version?: string }>();
		const configuredExtensionWorkspaceTrustRequests = configurationService.inspect<{ [key: string]: { supported: ExtensionUntrustedWorkspaceSupportType; version?: string } }>(WORKSPACE_TRUST_EXTENSION_SUPPORT).userValue || {};
		for (const id of Object.keys(configuredExtensionWorkspaceTrustRequests)) {
			this._configuredExtensionWorkspaceTrustRequestMap.set(id, configuredExtensionWorkspaceTrustRequests[id]);
		}

		// Workspace trust request type (product.json)
		this._productExtensionWorkspaceTrustRequestMap = new Map<string, ExtensionUntrustedWorkspaceSupport>();
		if (productService.extensionUntrustedWorkspaceSupport) {
			for (const id of Object.keys(productService.extensionUntrustedWorkspaceSupport)) {
				this._productExtensionWorkspaceTrustRequestMap.set(id, productService.extensionUntrustedWorkspaceSupport[id]);
			}
		}
	}

	prefersExecuteOnUI(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return (extensionKind.length > 0 && extensionKind[0] === 'ui');
	}

	prefersExecuteOnWorkspace(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return (extensionKind.length > 0 && extensionKind[0] === 'workspace');
	}

	prefersExecuteOnWeb(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return (extensionKind.length > 0 && extensionKind[0] === 'web');
	}

	canExecuteOnUI(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return extensionKind.some(kind => kind === 'ui');
	}

	canExecuteOnWorkspace(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return extensionKind.some(kind => kind === 'workspace');
	}

	canExecuteOnWeb(manifest: IExtensionManifest): boolean {
		const extensionKind = this.getExtensionKind(manifest);
		return extensionKind.some(kind => kind === 'web');
	}

	getExtensionKind(manifest: IExtensionManifest): ExtensionKind[] {
		const deducedExtensionKind = this.deduceExtensionKind(manifest);
		const configuredExtensionKind = this.getConfiguredExtensionKind(manifest);

		if (configuredExtensionKind && configuredExtensionKind.length > 0) {
			const result: ExtensionKind[] = [];
			for (const extensionKind of configuredExtensionKind) {
				if (extensionKind !== '-web') {
					result.push(extensionKind);
				}
			}

			// If opted out from web without specifying other extension kinds then default to ui, workspace
			if (configuredExtensionKind.includes('-web') && !result.length) {
				result.push('ui');
				result.push('workspace');
			}

			// Add web kind if not opted out from web and can run in web
			if (isWeb && !configuredExtensionKind.includes('-web') && !configuredExtensionKind.includes('web') && deducedExtensionKind.includes('web')) {
				result.push('web');
			}

			return result;
		}

		return deducedExtensionKind;
	}

	getUserConfiguredExtensionKind(extensionIdentifier: IExtensionIdentifier): ExtensionKind[] | undefined {
		if (this._configuredExtensionKindsMap === null) {
			const configuredExtensionKindsMap = new ExtensionIdentifierMap<ExtensionKind | ExtensionKind[]>();
			const configuredExtensionKinds = this.configurationService.getValue<{ [key: string]: ExtensionKind | ExtensionKind[] }>('remote.extensionKind') || {};
			for (const id of Object.keys(configuredExtensionKinds)) {
				configuredExtensionKindsMap.set(id, configuredExtensionKinds[id]);
			}
			this._configuredExtensionKindsMap = configuredExtensionKindsMap;
		}

		const userConfiguredExtensionKind = this._configuredExtensionKindsMap.get(extensionIdentifier.id);
		return userConfiguredExtensionKind ? this.toArray(userConfiguredExtensionKind) : undefined;
	}

	getExtensionUntrustedWorkspaceSupportType(manifest: IExtensionManifest): ExtensionUntrustedWorkspaceSupportType {
		// Workspace trust feature is disabled, or extension has no entry point
		if (!this.workspaceTrustEnablementService.isWorkspaceTrustEnabled() || !manifest.main) {
			return true;
		}

		// Get extension workspace trust requirements from settings.json
		const configuredWorkspaceTrustRequest = this.getConfiguredExtensionWorkspaceTrustRequest(manifest);

		// Get extension workspace trust requirements from product.json
		const productWorkspaceTrustRequest = this.getProductExtensionWorkspaceTrustRequest(manifest);

		// Use settings.json override value if it exists
		if (configuredWorkspaceTrustRequest !== undefined) {
			return configuredWorkspaceTrustRequest;
		}

		// Use product.json override value if it exists
		if (productWorkspaceTrustRequest?.override !== undefined) {
			return productWorkspaceTrustRequest.override;
		}

		// Use extension manifest value if it exists
		if (manifest.capabilities?.untrustedWorkspaces?.supported !== undefined) {
			return manifest.capabilities.untrustedWorkspaces.supported;
		}

		// Use product.json default value if it exists
		if (productWorkspaceTrustRequest?.default !== undefined) {
			return productWorkspaceTrustRequest.default;
		}

		return false;
	}

	getExtensionVirtualWorkspaceSupportType(manifest: IExtensionManifest): ExtensionVirtualWorkspaceSupportType {
		// check user configured
		const userConfiguredVirtualWorkspaceSupport = this.getConfiguredVirtualWorkspaceSupport(manifest);
		if (userConfiguredVirtualWorkspaceSupport !== undefined) {
			return userConfiguredVirtualWorkspaceSupport;
		}

		const productConfiguredWorkspaceSchemes = this.getProductVirtualWorkspaceSupport(manifest);

		// check override from product
		if (productConfiguredWorkspaceSchemes?.override !== undefined) {
			return productConfiguredWorkspaceSchemes.override;
		}

		// check the manifest
		const virtualWorkspaces = manifest.capabilities?.virtualWorkspaces;
		if (isBoolean(virtualWorkspaces)) {
			return virtualWorkspaces;
		} else if (virtualWorkspaces) {
			const supported = virtualWorkspaces.supported;
			if (isBoolean(supported) || supported === 'limited') {
				return supported;
			}
		}

		// check default from product
		if (productConfiguredWorkspaceSchemes?.default !== undefined) {
			return productConfiguredWorkspaceSchemes.default;
		}

		// Default - supports virtual workspace
		return true;
	}

	private deduceExtensionKind(manifest: IExtensionManifest): ExtensionKind[] {
		// Not an UI extension if it has main
		if (manifest.main) {
			if (manifest.browser) {
				return isWeb ? ['workspace', 'web'] : ['workspace'];
			}
			return ['workspace'];
		}

		if (manifest.browser) {
			return ['web'];
		}

		let result = [...ALL_EXTENSION_KINDS];

		if (isNonEmptyArray(manifest.extensionPack) || isNonEmptyArray(manifest.extensionDependencies)) {
			// Extension pack defaults to [workspace, web] in web and only [workspace] in desktop
			result = isWeb ? ['workspace', 'web'] : ['workspace'];
		}

		if (manifest.contributes) {
			for (const contribution of Object.keys(manifest.contributes)) {
				const supportedExtensionKinds = this.getSupportedExtensionKindsForExtensionPoint(contribution);
				if (supportedExtensionKinds.length) {
					result = result.filter(extensionKind => supportedExtensionKinds.includes(extensionKind));
				}
			}
		}

		if (!result.length) {
			this.logService.warn('Cannot deduce extensionKind for extension', getGalleryExtensionId(manifest.publisher, manifest.name));
		}

		return result;
	}

	private getSupportedExtensionKindsForExtensionPoint(extensionPoint: string): ExtensionKind[] {
		if (this._extensionPointExtensionKindsMap === null) {
			const extensionPointExtensionKindsMap = new Map<string, ExtensionKind[]>();
			ExtensionsRegistry.getExtensionPoints().forEach(e => extensionPointExtensionKindsMap.set(e.name, e.defaultExtensionKind || [] /* supports all */));
			this._extensionPointExtensionKindsMap = extensionPointExtensionKindsMap;
		}

		let extensionPointExtensionKind = this._extensionPointExtensionKindsMap.get(extensionPoint);
		if (extensionPointExtensionKind) {
			return extensionPointExtensionKind;
		}

		extensionPointExtensionKind = this.productService.extensionPointExtensionKind ? this.productService.extensionPointExtensionKind[extensionPoint] : undefined;
		if (extensionPointExtensionKind) {
			return extensionPointExtensionKind;
		}

		/* Unknown extension point */
		return isWeb ? ['workspace', 'web'] : ['workspace'];
	}

	private getConfiguredExtensionKind(manifest: IExtensionManifest): (ExtensionKind | '-web')[] | null {
		const extensionIdentifier = { id: getGalleryExtensionId(manifest.publisher, manifest.name) };

		// check in config
		let result: ExtensionKind | ExtensionKind[] | undefined = this.getUserConfiguredExtensionKind(extensionIdentifier);
		if (typeof result !== 'undefined') {
			return this.toArray(result);
		}

		// check product.json
		result = this.getProductExtensionKind(manifest);
		if (typeof result !== 'undefined') {
			return result;
		}

		// check the manifest itself
		result = manifest.extensionKind;
		if (typeof result !== 'undefined') {
			result = this.toArray(result);
			return result.filter(r => ['ui', 'workspace'].includes(r));
		}

		return null;
	}

	private getProductExtensionKind(manifest: IExtensionManifest): ExtensionKind[] | undefined {
		if (this._productExtensionKindsMap === null) {
			const productExtensionKindsMap = new ExtensionIdentifierMap<ExtensionKind[]>();
			if (this.productService.extensionKind) {
				for (const id of Object.keys(this.productService.extensionKind)) {
					productExtensionKindsMap.set(id, this.productService.extensionKind[id]);
				}
			}
			this._productExtensionKindsMap = productExtensionKindsMap;
		}

		const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
		return this._productExtensionKindsMap.get(extensionId);
	}

	private getProductVirtualWorkspaceSupport(manifest: IExtensionManifest): { default?: boolean; override?: boolean } | undefined {
		if (this._productVirtualWorkspaceSupportMap === null) {
			const productWorkspaceSchemesMap = new ExtensionIdentifierMap<{ default?: boolean; override?: boolean }>();
			if (this.productService.extensionVirtualWorkspacesSupport) {
				for (const id of Object.keys(this.productService.extensionVirtualWorkspacesSupport)) {
					productWorkspaceSchemesMap.set(id, this.productService.extensionVirtualWorkspacesSupport[id]);
				}
			}
			this._productVirtualWorkspaceSupportMap = productWorkspaceSchemesMap;
		}

		const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
		return this._productVirtualWorkspaceSupportMap.get(extensionId);
	}

	private getConfiguredVirtualWorkspaceSupport(manifest: IExtensionManifest): boolean | undefined {
		if (this._configuredVirtualWorkspaceSupportMap === null) {
			const configuredWorkspaceSchemesMap = new ExtensionIdentifierMap<boolean>();
			const configuredWorkspaceSchemes = this.configurationService.getValue<{ [key: string]: boolean }>('extensions.supportVirtualWorkspaces') || {};
			for (const id of Object.keys(configuredWorkspaceSchemes)) {
				if (configuredWorkspaceSchemes[id] !== undefined) {
					configuredWorkspaceSchemesMap.set(id, configuredWorkspaceSchemes[id]);
				}
			}
			this._configuredVirtualWorkspaceSupportMap = configuredWorkspaceSchemesMap;
		}

		const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
		return this._configuredVirtualWorkspaceSupportMap.get(extensionId);
	}

	private getConfiguredExtensionWorkspaceTrustRequest(manifest: IExtensionManifest): ExtensionUntrustedWorkspaceSupportType | undefined {
		const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
		const extensionWorkspaceTrustRequest = this._configuredExtensionWorkspaceTrustRequestMap.get(extensionId);

		if (extensionWorkspaceTrustRequest && (extensionWorkspaceTrustRequest.version === undefined || extensionWorkspaceTrustRequest.version === manifest.version)) {
			return extensionWorkspaceTrustRequest.supported;
		}

		return undefined;
	}

	private getProductExtensionWorkspaceTrustRequest(manifest: IExtensionManifest): ExtensionUntrustedWorkspaceSupport | undefined {
		const extensionId = getGalleryExtensionId(manifest.publisher, manifest.name);
		return this._productExtensionWorkspaceTrustRequestMap.get(extensionId);
	}

	private toArray(extensionKind: ExtensionKind | ExtensionKind[]): ExtensionKind[] {
		if (Array.isArray(extensionKind)) {
			return extensionKind;
		}
		return extensionKind === 'ui' ? ['ui', 'workspace'] : [extensionKind];
	}
}

registerSingleton(IExtensionManifestPropertiesService, ExtensionManifestPropertiesService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionRunningLocation.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionRunningLocation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionHostKind } from './extensionHostKind.js';

export class LocalProcessRunningLocation {
	public readonly kind = ExtensionHostKind.LocalProcess;
	constructor(
		public readonly affinity: number
	) { }
	public equals(other: ExtensionRunningLocation) {
		return (this.kind === other.kind && this.affinity === other.affinity);
	}
	public asString(): string {
		if (this.affinity === 0) {
			return 'LocalProcess';
		}
		return `LocalProcess${this.affinity}`;
	}
}

export class LocalWebWorkerRunningLocation {
	public readonly kind = ExtensionHostKind.LocalWebWorker;
	constructor(
		public readonly affinity: number
	) { }
	public equals(other: ExtensionRunningLocation) {
		return (this.kind === other.kind && this.affinity === other.affinity);
	}
	public asString(): string {
		if (this.affinity === 0) {
			return 'LocalWebWorker';
		}
		return `LocalWebWorker${this.affinity}`;
	}
}

export class RemoteRunningLocation {
	public readonly kind = ExtensionHostKind.Remote;
	public readonly affinity = 0;
	public equals(other: ExtensionRunningLocation) {
		return (this.kind === other.kind);
	}
	public asString(): string {
		return 'Remote';
	}
}

export type ExtensionRunningLocation = LocalProcessRunningLocation | LocalWebWorkerRunningLocation | RemoteRunningLocation;
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionRunningLocationTracker.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionRunningLocationTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from '../../../../base/common/network.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ExtensionKind } from '../../../../platform/environment/common/environment.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, IExtensionDescription } from '../../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { IReadOnlyExtensionDescriptionRegistry } from './extensionDescriptionRegistry.js';
import { ExtensionHostKind, ExtensionRunningPreference, IExtensionHostKindPicker, determineExtensionHostKinds } from './extensionHostKind.js';
import { IExtensionHostManager } from './extensionHostManagers.js';
import { IExtensionManifestPropertiesService } from './extensionManifestPropertiesService.js';
import { ExtensionRunningLocation, LocalProcessRunningLocation, LocalWebWorkerRunningLocation, RemoteRunningLocation } from './extensionRunningLocation.js';

export class ExtensionRunningLocationTracker {

	private _runningLocation = new ExtensionIdentifierMap<ExtensionRunningLocation | null>();
	private _maxLocalProcessAffinity: number = 0;
	private _maxLocalWebWorkerAffinity: number = 0;

	public get maxLocalProcessAffinity(): number {
		return this._maxLocalProcessAffinity;
	}

	public get maxLocalWebWorkerAffinity(): number {
		return this._maxLocalWebWorkerAffinity;
	}

	constructor(
		private readonly _registry: IReadOnlyExtensionDescriptionRegistry,
		private readonly _extensionHostKindPicker: IExtensionHostKindPicker,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ILogService private readonly _logService: ILogService,
		@IExtensionManifestPropertiesService private readonly _extensionManifestPropertiesService: IExtensionManifestPropertiesService,
	) { }

	public set(extensionId: ExtensionIdentifier, runningLocation: ExtensionRunningLocation) {
		this._runningLocation.set(extensionId, runningLocation);
	}

	public readExtensionKinds(extensionDescription: IExtensionDescription): ExtensionKind[] {
		if (extensionDescription.isUnderDevelopment && this._environmentService.extensionDevelopmentKind) {
			return this._environmentService.extensionDevelopmentKind;
		}

		return this._extensionManifestPropertiesService.getExtensionKind(extensionDescription);
	}

	public getRunningLocation(extensionId: ExtensionIdentifier): ExtensionRunningLocation | null {
		return this._runningLocation.get(extensionId) || null;
	}

	public filterByRunningLocation(extensions: readonly IExtensionDescription[], desiredRunningLocation: ExtensionRunningLocation): IExtensionDescription[] {
		return filterExtensionDescriptions(extensions, this._runningLocation, extRunningLocation => desiredRunningLocation.equals(extRunningLocation));
	}

	public filterByExtensionHostKind(extensions: readonly IExtensionDescription[], desiredExtensionHostKind: ExtensionHostKind): IExtensionDescription[] {
		return filterExtensionDescriptions(extensions, this._runningLocation, extRunningLocation => extRunningLocation.kind === desiredExtensionHostKind);
	}

	public filterByExtensionHostManager(extensions: readonly IExtensionDescription[], extensionHostManager: IExtensionHostManager): IExtensionDescription[] {
		return filterExtensionDescriptions(extensions, this._runningLocation, extRunningLocation => extensionHostManager.representsRunningLocation(extRunningLocation));
	}

	private _computeAffinity(inputExtensions: IExtensionDescription[], extensionHostKind: ExtensionHostKind, isInitialAllocation: boolean): { affinities: ExtensionIdentifierMap<number>; maxAffinity: number } {
		// Only analyze extensions that can execute
		const extensions = new ExtensionIdentifierMap<IExtensionDescription>();
		for (const extension of inputExtensions) {
			if (extension.main || extension.browser) {
				extensions.set(extension.identifier, extension);
			}
		}
		// Also add existing extensions of the same kind that can execute
		for (const extension of this._registry.getAllExtensionDescriptions()) {
			if (extension.main || extension.browser) {
				const runningLocation = this._runningLocation.get(extension.identifier);
				if (runningLocation && runningLocation.kind === extensionHostKind) {
					extensions.set(extension.identifier, extension);
				}
			}
		}

		// Initially, each extension belongs to its own group
		const groups = new ExtensionIdentifierMap<number>();
		let groupNumber = 0;
		for (const [_, extension] of extensions) {
			groups.set(extension.identifier, ++groupNumber);
		}

		const changeGroup = (from: number, to: number) => {
			for (const [key, group] of groups) {
				if (group === from) {
					groups.set(key, to);
				}
			}
		};

		// We will group things together when there are dependencies
		for (const [_, extension] of extensions) {
			if (!extension.extensionDependencies) {
				continue;
			}
			const myGroup = groups.get(extension.identifier)!;
			for (const depId of extension.extensionDependencies) {
				const depGroup = groups.get(depId);
				if (!depGroup) {
					// probably can't execute, so it has no impact
					continue;
				}

				if (depGroup === myGroup) {
					// already in the same group
					continue;
				}

				changeGroup(depGroup, myGroup);
			}
		}

		// Initialize with existing affinities
		const resultingAffinities = new Map<number, number>();
		let lastAffinity = 0;
		for (const [_, extension] of extensions) {
			const runningLocation = this._runningLocation.get(extension.identifier);
			if (runningLocation) {
				const group = groups.get(extension.identifier)!;
				resultingAffinities.set(group, runningLocation.affinity);
				lastAffinity = Math.max(lastAffinity, runningLocation.affinity);
			}
		}

		// When doing extension host debugging, we will ignore the configured affinity
		// because we can currently debug a single extension host
		if (!this._environmentService.isExtensionDevelopment) {
			// Go through each configured affinity and try to accomodate it
			const configuredAffinities = this._configurationService.getValue<{ [extensionId: string]: number } | undefined>('extensions.experimental.affinity') || {};
			const configuredExtensionIds = Object.keys(configuredAffinities);
			const configuredAffinityToResultingAffinity = new Map<number, number>();
			for (const extensionId of configuredExtensionIds) {
				const configuredAffinity = configuredAffinities[extensionId];
				if (typeof configuredAffinity !== 'number' || configuredAffinity <= 0 || Math.floor(configuredAffinity) !== configuredAffinity) {
					this._logService.info(`Ignoring configured affinity for '${extensionId}' because the value is not a positive integer.`);
					continue;
				}
				const group = groups.get(extensionId);
				if (!group) {
					// The extension is not known or cannot execute for this extension host kind
					continue;
				}

				const affinity1 = resultingAffinities.get(group);
				if (affinity1) {
					// Affinity for this group is already established
					configuredAffinityToResultingAffinity.set(configuredAffinity, affinity1);
					continue;
				}

				const affinity2 = configuredAffinityToResultingAffinity.get(configuredAffinity);
				if (affinity2) {
					// Affinity for this configuration is already established
					resultingAffinities.set(group, affinity2);
					continue;
				}

				if (!isInitialAllocation) {
					this._logService.info(`Ignoring configured affinity for '${extensionId}' because extension host(s) are already running. Reload window.`);
					continue;
				}

				const affinity3 = ++lastAffinity;
				configuredAffinityToResultingAffinity.set(configuredAffinity, affinity3);
				resultingAffinities.set(group, affinity3);
			}
		}

		const result = new ExtensionIdentifierMap<number>();
		for (const extension of inputExtensions) {
			const group = groups.get(extension.identifier) || 0;
			const affinity = resultingAffinities.get(group) || 0;
			result.set(extension.identifier, affinity);
		}

		if (lastAffinity > 0 && isInitialAllocation) {
			for (let affinity = 1; affinity <= lastAffinity; affinity++) {
				const extensionIds: ExtensionIdentifier[] = [];
				for (const extension of inputExtensions) {
					if (result.get(extension.identifier) === affinity) {
						extensionIds.push(extension.identifier);
					}
				}
				this._logService.info(`Placing extension(s) ${extensionIds.map(e => e.value).join(', ')} on a separate extension host.`);
			}
		}

		return { affinities: result, maxAffinity: lastAffinity };
	}

	public computeRunningLocation(localExtensions: IExtensionDescription[], remoteExtensions: IExtensionDescription[], isInitialAllocation: boolean): ExtensionIdentifierMap<ExtensionRunningLocation | null> {
		return this._doComputeRunningLocation(this._runningLocation, localExtensions, remoteExtensions, isInitialAllocation).runningLocation;
	}

	private _doComputeRunningLocation(existingRunningLocation: ExtensionIdentifierMap<ExtensionRunningLocation | null>, localExtensions: IExtensionDescription[], remoteExtensions: IExtensionDescription[], isInitialAllocation: boolean): { runningLocation: ExtensionIdentifierMap<ExtensionRunningLocation | null>; maxLocalProcessAffinity: number; maxLocalWebWorkerAffinity: number } {
		// Skip extensions that have an existing running location
		localExtensions = localExtensions.filter(extension => !existingRunningLocation.has(extension.identifier));
		remoteExtensions = remoteExtensions.filter(extension => !existingRunningLocation.has(extension.identifier));

		const extensionHostKinds = determineExtensionHostKinds(
			localExtensions,
			remoteExtensions,
			(extension) => this.readExtensionKinds(extension),
			(extensionId, extensionKinds, isInstalledLocally, isInstalledRemotely, preference) => this._extensionHostKindPicker.pickExtensionHostKind(extensionId, extensionKinds, isInstalledLocally, isInstalledRemotely, preference)
		);

		const extensions = new ExtensionIdentifierMap<IExtensionDescription>();
		for (const extension of localExtensions) {
			extensions.set(extension.identifier, extension);
		}
		for (const extension of remoteExtensions) {
			extensions.set(extension.identifier, extension);
		}

		const result = new ExtensionIdentifierMap<ExtensionRunningLocation | null>();
		const localProcessExtensions: IExtensionDescription[] = [];
		const localWebWorkerExtensions: IExtensionDescription[] = [];
		for (const [extensionIdKey, extensionHostKind] of extensionHostKinds) {
			let runningLocation: ExtensionRunningLocation | null = null;
			if (extensionHostKind === ExtensionHostKind.LocalProcess) {
				const extensionDescription = extensions.get(extensionIdKey);
				if (extensionDescription) {
					localProcessExtensions.push(extensionDescription);
				}
			} else if (extensionHostKind === ExtensionHostKind.LocalWebWorker) {
				const extensionDescription = extensions.get(extensionIdKey);
				if (extensionDescription) {
					localWebWorkerExtensions.push(extensionDescription);
				}
			} else if (extensionHostKind === ExtensionHostKind.Remote) {
				runningLocation = new RemoteRunningLocation();
			}
			result.set(extensionIdKey, runningLocation);
		}

		const { affinities, maxAffinity } = this._computeAffinity(localProcessExtensions, ExtensionHostKind.LocalProcess, isInitialAllocation);
		for (const extension of localProcessExtensions) {
			const affinity = affinities.get(extension.identifier) || 0;
			result.set(extension.identifier, new LocalProcessRunningLocation(affinity));
		}
		const { affinities: localWebWorkerAffinities, maxAffinity: maxLocalWebWorkerAffinity } = this._computeAffinity(localWebWorkerExtensions, ExtensionHostKind.LocalWebWorker, isInitialAllocation);
		for (const extension of localWebWorkerExtensions) {
			const affinity = localWebWorkerAffinities.get(extension.identifier) || 0;
			result.set(extension.identifier, new LocalWebWorkerRunningLocation(affinity));
		}

		// Add extensions that already have an existing running location
		for (const [extensionIdKey, runningLocation] of existingRunningLocation) {
			if (runningLocation) {
				result.set(extensionIdKey, runningLocation);
			}
		}

		return { runningLocation: result, maxLocalProcessAffinity: maxAffinity, maxLocalWebWorkerAffinity: maxLocalWebWorkerAffinity };
	}

	public initializeRunningLocation(localExtensions: IExtensionDescription[], remoteExtensions: IExtensionDescription[]): void {
		const { runningLocation, maxLocalProcessAffinity, maxLocalWebWorkerAffinity } = this._doComputeRunningLocation(this._runningLocation, localExtensions, remoteExtensions, true);
		this._runningLocation = runningLocation;
		this._maxLocalProcessAffinity = maxLocalProcessAffinity;
		this._maxLocalWebWorkerAffinity = maxLocalWebWorkerAffinity;
	}

	/**
	 * Returns the running locations for the removed extensions.
	 */
	public deltaExtensions(toAdd: IExtensionDescription[], toRemove: ExtensionIdentifier[]): ExtensionIdentifierMap<ExtensionRunningLocation | null> {
		// Remove old running location
		const removedRunningLocation = new ExtensionIdentifierMap<ExtensionRunningLocation | null>();
		for (const extensionId of toRemove) {
			const extensionKey = extensionId;
			removedRunningLocation.set(extensionKey, this._runningLocation.get(extensionKey) || null);
			this._runningLocation.delete(extensionKey);
		}

		// Determine new running location
		this._updateRunningLocationForAddedExtensions(toAdd);

		return removedRunningLocation;
	}

	/**
	 * Update `this._runningLocation` with running locations for newly enabled/installed extensions.
	 */
	private _updateRunningLocationForAddedExtensions(toAdd: IExtensionDescription[]): void {
		// Determine new running location
		const localProcessExtensions: IExtensionDescription[] = [];
		const localWebWorkerExtensions: IExtensionDescription[] = [];
		for (const extension of toAdd) {
			const extensionKind = this.readExtensionKinds(extension);
			const isRemote = extension.extensionLocation.scheme === Schemas.vscodeRemote;
			const extensionHostKind = this._extensionHostKindPicker.pickExtensionHostKind(extension.identifier, extensionKind, !isRemote, isRemote, ExtensionRunningPreference.None);
			let runningLocation: ExtensionRunningLocation | null = null;
			if (extensionHostKind === ExtensionHostKind.LocalProcess) {
				localProcessExtensions.push(extension);
			} else if (extensionHostKind === ExtensionHostKind.LocalWebWorker) {
				localWebWorkerExtensions.push(extension);
			} else if (extensionHostKind === ExtensionHostKind.Remote) {
				runningLocation = new RemoteRunningLocation();
			}
			this._runningLocation.set(extension.identifier, runningLocation);
		}

		const { affinities } = this._computeAffinity(localProcessExtensions, ExtensionHostKind.LocalProcess, false);
		for (const extension of localProcessExtensions) {
			const affinity = affinities.get(extension.identifier) || 0;
			this._runningLocation.set(extension.identifier, new LocalProcessRunningLocation(affinity));
		}

		const { affinities: webWorkerExtensionsAffinities } = this._computeAffinity(localWebWorkerExtensions, ExtensionHostKind.LocalWebWorker, false);
		for (const extension of localWebWorkerExtensions) {
			const affinity = webWorkerExtensionsAffinities.get(extension.identifier) || 0;
			this._runningLocation.set(extension.identifier, new LocalWebWorkerRunningLocation(affinity));
		}
	}
}

export function filterExtensionDescriptions(extensions: readonly IExtensionDescription[], runningLocation: ExtensionIdentifierMap<ExtensionRunningLocation | null>, predicate: (extRunningLocation: ExtensionRunningLocation) => boolean): IExtensionDescription[] {
	return extensions.filter((ext) => {
		const extRunningLocation = runningLocation.get(ext.identifier);
		return extRunningLocation && predicate(extRunningLocation);
	});
}

export function filterExtensionIdentifiers(extensions: readonly ExtensionIdentifier[], runningLocation: ExtensionIdentifierMap<ExtensionRunningLocation | null>, predicate: (extRunningLocation: ExtensionRunningLocation) => boolean): ExtensionIdentifier[] {
	return extensions.filter((ext) => {
		const extRunningLocation = runningLocation.get(ext);
		return extRunningLocation && predicate(extRunningLocation);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensions.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import Severity from '../../../../base/common/severity.js';
import { URI } from '../../../../base/common/uri.js';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc.js';
import { getExtensionId, getGalleryExtensionId } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { ImplicitActivationEvents } from '../../../../platform/extensionManagement/common/implicitActivationEvents.js';
import { ExtensionIdentifier, ExtensionIdentifierMap, ExtensionIdentifierSet, ExtensionType, IExtension, IExtensionContributions, IExtensionDescription, TargetPlatform } from '../../../../platform/extensions/common/extensions.js';
import { ApiProposalName } from '../../../../platform/extensions/common/extensionsApiProposals.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IV8Profile } from '../../../../platform/profiling/common/profiling.js';
import { ExtensionHostKind } from './extensionHostKind.js';
import { IExtensionDescriptionDelta, IExtensionDescriptionSnapshot } from './extensionHostProtocol.js';
import { ExtensionRunningLocation } from './extensionRunningLocation.js';
import { IExtensionPoint } from './extensionsRegistry.js';

export const nullExtensionDescription = Object.freeze<IExtensionDescription>({
	identifier: new ExtensionIdentifier('nullExtensionDescription'),
	name: 'Null Extension Description',
	version: '0.0.0',
	publisher: 'vscode',
	engines: { vscode: '' },
	extensionLocation: URI.parse('void:location'),
	isBuiltin: false,
	targetPlatform: TargetPlatform.UNDEFINED,
	isUserBuiltin: false,
	isUnderDevelopment: false,
	preRelease: false,
});

export type WebWorkerExtHostConfigValue = boolean | 'auto';
export const webWorkerExtHostConfig = 'extensions.webWorker';

export const IExtensionService = createDecorator<IExtensionService>('extensionService');

export interface IMessage {
	type: Severity;
	message: string;
	extensionId: ExtensionIdentifier;
	extensionPointId: string;
}

export interface IExtensionsStatus {
	id: ExtensionIdentifier;
	messages: IMessage[];
	activationStarted: boolean;
	activationTimes: ActivationTimes | undefined;
	runtimeErrors: Error[];
	runningLocation: ExtensionRunningLocation | null;
}

export class MissingExtensionDependency {
	constructor(readonly dependency: string) { }
}

/**
 * e.g.
 * ```
 * {
 *    startTime: 1511954813493000,
 *    endTime: 1511954835590000,
 *    deltas: [ 100, 1500, 123456, 1500, 100000 ],
 *    ids: [ 'idle', 'self', 'extension1', 'self', 'idle' ]
 * }
 * ```
 */
export interface IExtensionHostProfile {
	/**
	 * Profiling start timestamp in microseconds.
	 */
	startTime: number;
	/**
	 * Profiling end timestamp in microseconds.
	 */
	endTime: number;
	/**
	 * Duration of segment in microseconds.
	 */
	deltas: number[];
	/**
	 * Segment identifier: extension id or one of the four known strings.
	 */
	ids: ProfileSegmentId[];

	/**
	 * Get the information as a .cpuprofile.
	 */
	data: IV8Profile;

	/**
	 * Get the aggregated time per segmentId
	 */
	getAggregatedTimes(): Map<ProfileSegmentId, number>;
}

export const enum ExtensionHostStartup {
	/**
	 * The extension host should be launched immediately and doesn't require a `$startExtensionHost` call.
	 */
	EagerAutoStart = 1,
	/**
	 * The extension host should be launched immediately and needs a `$startExtensionHost` call.
	 */
	EagerManualStart = 2,
	/**
	 * The extension host should be launched lazily and only when it has extensions it needs to host. It doesn't require a `$startExtensionHost` call.
	 */
	LazyAutoStart = 3,
}

export interface IExtensionInspectInfo {
	readonly port: number;
	readonly host: string;
	readonly devtoolsUrl?: string;
	readonly devtoolsLabel?: string;
}

export interface IExtensionHost {
	readonly pid: number | null;
	readonly runningLocation: ExtensionRunningLocation;
	readonly remoteAuthority: string | null;
	readonly startup: ExtensionHostStartup;
	/**
	 * A collection of extensions which includes information about which
	 * extension will execute or is executing on this extension host.
	 * **NOTE**: this will reflect extensions correctly only after `start()` resolves.
	 */
	readonly extensions: ExtensionHostExtensions | null;
	readonly onExit: Event<[number, string | null]>;

	start(): Promise<IMessagePassingProtocol>;
	getInspectPort(): IExtensionInspectInfo | undefined;
	enableInspectPort(): Promise<boolean>;
	disconnect?(): Promise<void>;
	dispose(): void;
}

export class ExtensionHostExtensions {
	private _versionId: number;
	private _allExtensions: IExtensionDescription[];
	private _myExtensions: ExtensionIdentifier[];
	private _myActivationEvents: Set<string> | null;

	public get versionId(): number {
		return this._versionId;
	}

	public get allExtensions(): IExtensionDescription[] {
		return this._allExtensions;
	}

	public get myExtensions(): ExtensionIdentifier[] {
		return this._myExtensions;
	}

	constructor(versionId: number, allExtensions: readonly IExtensionDescription[], myExtensions: ExtensionIdentifier[]) {
		this._versionId = versionId;
		this._allExtensions = allExtensions.slice(0);
		this._myExtensions = myExtensions.slice(0);
		this._myActivationEvents = null;
	}

	toSnapshot(): IExtensionDescriptionSnapshot {
		return {
			versionId: this._versionId,
			allExtensions: this._allExtensions,
			myExtensions: this._myExtensions,
			activationEvents: ImplicitActivationEvents.createActivationEventsMap(this._allExtensions)
		};
	}

	public set(versionId: number, allExtensions: IExtensionDescription[], myExtensions: ExtensionIdentifier[]): IExtensionDescriptionDelta {
		if (this._versionId > versionId) {
			throw new Error(`ExtensionHostExtensions: invalid versionId ${versionId} (current: ${this._versionId})`);
		}
		const toRemove: ExtensionIdentifier[] = [];
		const toAdd: IExtensionDescription[] = [];
		const myToRemove: ExtensionIdentifier[] = [];
		const myToAdd: ExtensionIdentifier[] = [];

		const oldExtensionsMap = extensionDescriptionArrayToMap(this._allExtensions);
		const newExtensionsMap = extensionDescriptionArrayToMap(allExtensions);
		const extensionsAreTheSame = (a: IExtensionDescription, b: IExtensionDescription) => {
			return (
				(a.extensionLocation.toString() === b.extensionLocation.toString())
				|| (a.isBuiltin === b.isBuiltin)
				|| (a.isUserBuiltin === b.isUserBuiltin)
				|| (a.isUnderDevelopment === b.isUnderDevelopment)
			);
		};

		for (const oldExtension of this._allExtensions) {
			const newExtension = newExtensionsMap.get(oldExtension.identifier);
			if (!newExtension) {
				toRemove.push(oldExtension.identifier);
				oldExtensionsMap.delete(oldExtension.identifier);
				continue;
			}
			if (!extensionsAreTheSame(oldExtension, newExtension)) {
				// The new extension is different than the old one
				// (e.g. maybe it executes in a different location)
				toRemove.push(oldExtension.identifier);
				oldExtensionsMap.delete(oldExtension.identifier);
				continue;
			}
		}
		for (const newExtension of allExtensions) {
			const oldExtension = oldExtensionsMap.get(newExtension.identifier);
			if (!oldExtension) {
				toAdd.push(newExtension);
				continue;
			}
			if (!extensionsAreTheSame(oldExtension, newExtension)) {
				// The new extension is different than the old one
				// (e.g. maybe it executes in a different location)
				toRemove.push(oldExtension.identifier);
				oldExtensionsMap.delete(oldExtension.identifier);
				continue;
			}
		}

		const myOldExtensionsSet = new ExtensionIdentifierSet(this._myExtensions);
		const myNewExtensionsSet = new ExtensionIdentifierSet(myExtensions);
		for (const oldExtensionId of this._myExtensions) {
			if (!myNewExtensionsSet.has(oldExtensionId)) {
				myToRemove.push(oldExtensionId);
			}
		}
		for (const newExtensionId of myExtensions) {
			if (!myOldExtensionsSet.has(newExtensionId)) {
				myToAdd.push(newExtensionId);
			}
		}

		const addActivationEvents = ImplicitActivationEvents.createActivationEventsMap(toAdd);
		const delta = { versionId, toRemove, toAdd, addActivationEvents, myToRemove, myToAdd };
		this.delta(delta);
		return delta;
	}

	public delta(extensionsDelta: IExtensionDescriptionDelta): IExtensionDescriptionDelta | null {
		if (this._versionId >= extensionsDelta.versionId) {
			// ignore older deltas
			return null;
		}

		const { toRemove, toAdd, myToRemove, myToAdd } = extensionsDelta;
		// First handle removals
		const toRemoveSet = new ExtensionIdentifierSet(toRemove);
		const myToRemoveSet = new ExtensionIdentifierSet(myToRemove);
		for (let i = 0; i < this._allExtensions.length; i++) {
			if (toRemoveSet.has(this._allExtensions[i].identifier)) {
				this._allExtensions.splice(i, 1);
				i--;
			}
		}
		for (let i = 0; i < this._myExtensions.length; i++) {
			if (myToRemoveSet.has(this._myExtensions[i])) {
				this._myExtensions.splice(i, 1);
				i--;
			}
		}
		// Then handle additions
		for (const extension of toAdd) {
			this._allExtensions.push(extension);
		}
		for (const extensionId of myToAdd) {
			this._myExtensions.push(extensionId);
		}

		// clear cached activation events
		this._myActivationEvents = null;

		return extensionsDelta;
	}

	public containsExtension(extensionId: ExtensionIdentifier): boolean {
		for (const myExtensionId of this._myExtensions) {
			if (ExtensionIdentifier.equals(myExtensionId, extensionId)) {
				return true;
			}
		}
		return false;
	}

	public containsActivationEvent(activationEvent: string): boolean {
		if (!this._myActivationEvents) {
			this._myActivationEvents = this._readMyActivationEvents();
		}
		return this._myActivationEvents.has(activationEvent);
	}

	private _readMyActivationEvents(): Set<string> {
		const result = new Set<string>();

		for (const extensionDescription of this._allExtensions) {
			if (!this.containsExtension(extensionDescription.identifier)) {
				continue;
			}

			const activationEvents = ImplicitActivationEvents.readActivationEvents(extensionDescription);
			for (const activationEvent of activationEvents) {
				result.add(activationEvent);
			}
		}

		return result;
	}
}

function extensionDescriptionArrayToMap(extensions: IExtensionDescription[]): ExtensionIdentifierMap<IExtensionDescription> {
	const result = new ExtensionIdentifierMap<IExtensionDescription>();
	for (const extension of extensions) {
		result.set(extension.identifier, extension);
	}
	return result;
}

export function isProposedApiEnabled(extension: IExtensionDescription, proposal: ApiProposalName): boolean {
	if (!extension.enabledApiProposals) {
		return false;
	}
	return extension.enabledApiProposals.includes(proposal);
}

export function checkProposedApiEnabled(extension: IExtensionDescription, proposal: ApiProposalName): void {
	if (!isProposedApiEnabled(extension, proposal)) {
		throw new Error(`Extension '${extension.identifier.value}' CANNOT use API proposal: ${proposal}.\nIts package.json#enabledApiProposals-property declares: ${extension.enabledApiProposals?.join(', ') ?? '[]'} but NOT ${proposal}.\n The missing proposal MUST be added and you must start in extension development mode or use the following command line switch: --enable-proposed-api ${extension.identifier.value}`);
	}
}


/**
 * Extension id or one of the four known program states.
 */
export type ProfileSegmentId = string | 'idle' | 'program' | 'gc' | 'self';

export interface ExtensionActivationReason {
	readonly startup: boolean;
	readonly extensionId: ExtensionIdentifier;
	readonly activationEvent: string;
}

export class ActivationTimes {
	constructor(
		public readonly codeLoadingTime: number,
		public readonly activateCallTime: number,
		public readonly activateResolvedTime: number,
		public readonly activationReason: ExtensionActivationReason
	) {
	}
}

export class ExtensionPointContribution<T> {
	readonly description: IExtensionDescription;
	readonly value: T;

	constructor(description: IExtensionDescription, value: T) {
		this.description = description;
		this.value = value;
	}
}

export interface IWillActivateEvent {
	readonly event: string;
	readonly activation: Promise<void>;
}

export interface IResponsiveStateChangeEvent {
	extensionHostKind: ExtensionHostKind;
	isResponsive: boolean;
	/**
	 * Return the inspect port or `0`. `0` means inspection is not possible.
	 */
	getInspectListener(tryEnableInspector: boolean): Promise<IExtensionInspectInfo | undefined>;
}

export const enum ActivationKind {
	Normal = 0,
	Immediate = 1
}

export interface WillStopExtensionHostsEvent {

	/**
	 * A human readable reason for stopping the extension hosts
	 * that e.g. can be shown in a confirmation dialog to the
	 * user.
	 */
	readonly reason: string;

	/**
	 * A flag to indicate if the operation was triggered automatically
	 */
	readonly auto: boolean;

	/**
	 * Allows to veto the stopping of extension hosts. The veto can be a long running
	 * operation.
	 *
	 * @param reason a human readable reason for vetoing the extension host stop in case
	 * where the resolved `value: true`.
	 */
	veto(value: boolean | Promise<boolean>, reason: string): void;
}

export interface IExtensionService {
	readonly _serviceBrand: undefined;

	/**
	 * An event emitted when extensions are registered after their extension points got handled.
	 *
	 * This event will also fire on startup to signal the installed extensions.
	 *
	 * @returns the extensions that got registered
	 */
	readonly onDidRegisterExtensions: Event<void>;

	/**
	 * @event
	 * Fired when extensions status changes.
	 * The event contains the ids of the extensions that have changed.
	 */
	readonly onDidChangeExtensionsStatus: Event<ExtensionIdentifier[]>;

	/**
	 * Fired when the available extensions change (i.e. when extensions are added or removed).
	 */
	readonly onDidChangeExtensions: Event<{ readonly added: readonly IExtensionDescription[]; readonly removed: readonly IExtensionDescription[] }>;

	/**
	 * All registered extensions.
	 * - List will be empty initially during workbench startup and will be filled with extensions as they are registered
	 * - Listen to `onDidChangeExtensions` event for any changes to the extensions list. It will change as extensions get registered or de-reigstered.
	 * - Listen to `onDidRegisterExtensions` event or wait for `whenInstalledExtensionsRegistered` promise to get the initial list of registered extensions.
	 */
	readonly extensions: readonly IExtensionDescription[];

	/**
	 * An event that is fired when activation happens.
	 */
	readonly onWillActivateByEvent: Event<IWillActivateEvent>;

	/**
	 * An event that is fired when an extension host changes its
	 * responsive-state.
	 */
	readonly onDidChangeResponsiveChange: Event<IResponsiveStateChangeEvent>;

	/**
	 * Fired before stop of extension hosts happens. Allows listeners to veto against the
	 * stop to prevent it from happening.
	 */
	readonly onWillStop: Event<WillStopExtensionHostsEvent>;

	/**
	 * Send an activation event and activate interested extensions.
	 *
	 * This will wait for the normal startup of the extension host(s).
	 *
	 * In extraordinary circumstances, if the activation event needs to activate
	 * one or more extensions before the normal startup is finished, then you can use
	 * `ActivationKind.Immediate`. Please do not use this flag unless really necessary
	 * and you understand all consequences.
	 */
	activateByEvent(activationEvent: string, activationKind?: ActivationKind): Promise<void>;

	/**
	 * Send an activation ID and activate interested extensions.
	 *
	 */
	activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void>;

	/**
	 * Determine if `activateByEvent(activationEvent)` has resolved already.
	 *
	 * i.e. the activation event is finished and all interested extensions are already active.
	 */
	activationEventIsDone(activationEvent: string): boolean;

	/**
	 * An promise that resolves when the installed extensions are registered after
	 * their extension points got handled.
	 */
	whenInstalledExtensionsRegistered(): Promise<boolean>;

	/**
	 * Return a specific extension
	 * @param id An extension id
	 */
	getExtension(id: string): Promise<IExtensionDescription | undefined>;

	/**
	 * Returns `true` if the given extension can be added. Otherwise `false`.
	 * @param extension An extension
	 */
	canAddExtension(extension: IExtensionDescription): boolean;

	/**
	 * Returns `true` if the given extension can be removed. Otherwise `false`.
	 * @param extension An extension
	 */
	canRemoveExtension(extension: IExtensionDescription): boolean;

	/**
	 * Read all contributions to an extension point.
	 */
	readExtensionPointContributions<T extends IExtensionContributions[keyof IExtensionContributions]>(extPoint: IExtensionPoint<T>): Promise<ExtensionPointContribution<T>[]>;

	/**
	 * Get information about extensions status.
	 */
	getExtensionsStatus(): { [id: string]: IExtensionsStatus };

	/**
	 * Return the inspect ports (if inspection is possible) for extension hosts of kind `extensionHostKind`.
	 */
	getInspectPorts(extensionHostKind: ExtensionHostKind, tryEnableInspector: boolean): Promise<IExtensionInspectInfo[]>;

	/**
	 * Stops the extension hosts.
	 *
	 * @param reason a human readable reason for stopping the extension hosts. This maybe
	 * can be presented to the user when showing dialogs.
	 *
	 * @param auto indicates if the operation was triggered by an automatic action
	 *
	 * @returns a promise that resolves to `true` if the extension hosts were stopped, `false`
	 * if the operation was vetoed by listeners of the `onWillStop` event.
	 */
	stopExtensionHosts(reason: string, auto?: boolean): Promise<boolean>;

	/**
	 * Starts the extension hosts. If updates are provided, the extension hosts are started with the given updates.
	 */
	startExtensionHosts(updates?: { readonly toAdd: readonly IExtension[]; readonly toRemove: readonly string[] }): Promise<void>;

	/**
	 * Modify the environment of the remote extension host
	 * @param env New properties for the remote extension host
	 */
	setRemoteEnvironment(env: { [key: string]: string | null }): Promise<void>;
}

export interface IInternalExtensionService {
	_activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void>;
	_onWillActivateExtension(extensionId: ExtensionIdentifier): void;
	_onDidActivateExtension(extensionId: ExtensionIdentifier, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason): void;
	_onDidActivateExtensionError(extensionId: ExtensionIdentifier, error: Error): void;
	_onExtensionRuntimeError(extensionId: ExtensionIdentifier, err: Error): void;
}

export interface ProfileSession {
	stop(): Promise<IExtensionHostProfile>;
}

export function toExtension(extensionDescription: IExtensionDescription): IExtension {
	return {
		type: extensionDescription.isBuiltin ? ExtensionType.System : ExtensionType.User,
		isBuiltin: extensionDescription.isBuiltin || extensionDescription.isUserBuiltin,
		identifier: { id: getGalleryExtensionId(extensionDescription.publisher, extensionDescription.name), uuid: extensionDescription.uuid },
		manifest: extensionDescription,
		location: extensionDescription.extensionLocation,
		targetPlatform: extensionDescription.targetPlatform,
		validations: [],
		isValid: true,
		preRelease: extensionDescription.preRelease,
		publisherDisplayName: extensionDescription.publisherDisplayName,
	};
}

export function toExtensionDescription(extension: IExtension, isUnderDevelopment?: boolean): IExtensionDescription {
	const id = getExtensionId(extension.manifest.publisher, extension.manifest.name);
	return {
		id,
		identifier: new ExtensionIdentifier(id),
		isBuiltin: extension.type === ExtensionType.System,
		isUserBuiltin: extension.type === ExtensionType.User && extension.isBuiltin,
		isUnderDevelopment: !!isUnderDevelopment,
		extensionLocation: extension.location,
		uuid: extension.identifier.uuid,
		targetPlatform: extension.targetPlatform,
		publisherDisplayName: extension.publisherDisplayName,
		preRelease: extension.preRelease,
		...extension.manifest
	};
}


export class NullExtensionService implements IExtensionService {
	declare readonly _serviceBrand: undefined;
	readonly onDidRegisterExtensions: Event<void> = Event.None;
	readonly onDidChangeExtensionsStatus: Event<ExtensionIdentifier[]> = Event.None;
	onDidChangeExtensions = Event.None;
	readonly onWillActivateByEvent: Event<IWillActivateEvent> = Event.None;
	readonly onDidChangeResponsiveChange: Event<IResponsiveStateChangeEvent> = Event.None;
	readonly onWillStop: Event<WillStopExtensionHostsEvent> = Event.None;
	readonly extensions = [];
	activateByEvent(_activationEvent: string): Promise<void> { return Promise.resolve(undefined); }
	activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void> { return Promise.resolve(undefined); }
	activationEventIsDone(_activationEvent: string): boolean { return false; }
	whenInstalledExtensionsRegistered(): Promise<boolean> { return Promise.resolve(true); }
	getExtension() { return Promise.resolve(undefined); }
	readExtensionPointContributions<T>(_extPoint: IExtensionPoint<T>): Promise<ExtensionPointContribution<T>[]> { return Promise.resolve(Object.create(null)); }
	getExtensionsStatus(): { [id: string]: IExtensionsStatus } { return Object.create(null); }
	getInspectPorts(_extensionHostKind: ExtensionHostKind, _tryEnableInspector: boolean): Promise<IExtensionInspectInfo[]> { return Promise.resolve([]); }
	async stopExtensionHosts(): Promise<boolean> { return true; }
	async startExtensionHosts(): Promise<void> { }
	async setRemoteEnvironment(_env: { [key: string]: string | null }): Promise<void> { }
	canAddExtension(): boolean { return false; }
	canRemoveExtension(): boolean { return false; }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensions/common/extensionsProposedApi.ts]---
Location: vscode-main/src/vs/workbench/services/extensions/common/extensionsProposedApi.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { localize } from '../../../../nls.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ExtensionIdentifier, IExtensionDescription, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { allApiProposals, ApiProposalName } from '../../../../platform/extensions/common/extensionsApiProposals.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { Extensions, IExtensionFeatureMarkdownRenderer, IExtensionFeaturesRegistry, IRenderedData } from '../../extensionManagement/common/extensionFeatures.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { Mutable } from '../../../../base/common/types.js';

export class ExtensionsProposedApi {

	private readonly _envEnablesProposedApiForAll: boolean;
	private readonly _envEnabledExtensions: Set<string>;
	private readonly _productEnabledExtensions: Map<string, string[]>;

	constructor(
		@ILogService private readonly _logService: ILogService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IProductService productService: IProductService
	) {

		this._envEnabledExtensions = new Set((_environmentService.extensionEnabledProposedApi ?? []).map(id => ExtensionIdentifier.toKey(id)));

		this._envEnablesProposedApiForAll =
			!_environmentService.isBuilt || // always allow proposed API when running out of sources
			(_environmentService.isExtensionDevelopment && productService.quality !== 'stable') || // do not allow proposed API against stable builds when developing an extension
			(this._envEnabledExtensions.size === 0 && Array.isArray(_environmentService.extensionEnabledProposedApi)); // always allow proposed API if --enable-proposed-api is provided without extension ID

		this._productEnabledExtensions = new Map<string, ApiProposalName[]>();


		// NEW world - product.json spells out what proposals each extension can use
		if (productService.extensionEnabledApiProposals) {
			for (const [k, value] of Object.entries(productService.extensionEnabledApiProposals)) {
				const key = ExtensionIdentifier.toKey(k);
				const proposalNames = value.filter(name => {
					if (!allApiProposals[<ApiProposalName>name]) {
						_logService.warn(`Via 'product.json#extensionEnabledApiProposals' extension '${key}' wants API proposal '${name}' but that proposal DOES NOT EXIST. Likely, the proposal has been finalized (check 'vscode.d.ts') or was abandoned.`);
						return false;
					}
					return true;
				});
				this._productEnabledExtensions.set(key, proposalNames);
			}
		}
	}

	updateEnabledApiProposals(extensions: IExtensionDescription[]): void {
		for (const extension of extensions) {
			this.doUpdateEnabledApiProposals(extension);
		}
	}

	private doUpdateEnabledApiProposals(extension: Mutable<IExtensionDescription>): void {

		const key = ExtensionIdentifier.toKey(extension.identifier);

		// warn about invalid proposal and remove them from the list
		if (isNonEmptyArray(extension.enabledApiProposals)) {
			extension.enabledApiProposals = extension.enabledApiProposals.filter(name => {
				const result = Boolean(allApiProposals[<ApiProposalName>name]);
				if (!result) {
					this._logService.error(`Extension '${key}' wants API proposal '${name}' but that proposal DOES NOT EXIST. Likely, the proposal has been finalized (check 'vscode.d.ts') or was abandoned.`);
				}
				return result;
			});
		}


		if (this._productEnabledExtensions.has(key)) {
			// NOTE that proposals that are listed in product.json override whatever is declared in the extension
			// itself. This is needed for us to know what proposals are used "in the wild". Merging product.json-proposals
			// and extension-proposals would break that.

			const productEnabledProposals = this._productEnabledExtensions.get(key)!;

			// check for difference between product.json-declaration and package.json-declaration
			const productSet = new Set(productEnabledProposals);
			const extensionSet = new Set(extension.enabledApiProposals);
			const diff = new Set([...extensionSet].filter(a => !productSet.has(a)));
			if (diff.size > 0) {
				this._logService.error(`Extension '${key}' appears in product.json but enables LESS API proposals than the extension wants.\npackage.json (LOSES): ${[...extensionSet].join(', ')}\nproduct.json (WINS): ${[...productSet].join(', ')}`);

				if (this._environmentService.isExtensionDevelopment) {
					this._logService.error(`Proceeding with EXTRA proposals (${[...diff].join(', ')}) because extension is in development mode. Still, this EXTENSION WILL BE BROKEN unless product.json is updated.`);
					productEnabledProposals.push(...diff);
				}
			}

			extension.enabledApiProposals = productEnabledProposals;
			return;
		}

		if (this._envEnablesProposedApiForAll || this._envEnabledExtensions.has(key)) {
			// proposed API usage is not restricted and allowed just like the extension
			// has declared it
			return;
		}

		if (!extension.isBuiltin && isNonEmptyArray(extension.enabledApiProposals)) {
			// restrictive: extension cannot use proposed API in this context and its declaration is nulled
			this._logService.error(`Extension '${extension.identifier.value} CANNOT USE these API proposals '${extension.enabledApiProposals?.join(', ') || '*'}'. You MUST start in extension development mode or use the --enable-proposed-api command line flag`);
			extension.enabledApiProposals = [];
		}
	}
}

class ApiProposalsMarkdowneRenderer extends Disposable implements IExtensionFeatureMarkdownRenderer {

	readonly type = 'markdown';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.originalEnabledApiProposals?.length || !!manifest.enabledApiProposals?.length;
	}

	render(manifest: IExtensionManifest): IRenderedData<IMarkdownString> {
		const enabledApiProposals = manifest.originalEnabledApiProposals ?? manifest.enabledApiProposals ?? [];
		const data = new MarkdownString();
		if (enabledApiProposals.length) {
			for (const proposal of enabledApiProposals) {
				data.appendMarkdown(`- \`${proposal}\`\n`);
			}
		}
		return {
			data,
			dispose: () => { }
		};
	}
}

Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'enabledApiProposals',
	label: localize('enabledProposedAPIs', "API Proposals"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(ApiProposalsMarkdowneRenderer),
});
```

--------------------------------------------------------------------------------

````
