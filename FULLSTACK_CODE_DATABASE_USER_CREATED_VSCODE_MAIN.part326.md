---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 326
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 326 of 552)

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

---[FILE: src/vs/workbench/browser/web.main.ts]---
Location: vscode-main/src/vs/workbench/browser/web.main.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { mark } from '../../base/common/performance.js';
import { domContentLoaded, detectFullscreen, getCookieValue, getWindow } from '../../base/browser/dom.js';
import { assertReturnsDefined } from '../../base/common/types.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { ILogService, ConsoleLogger, getLogLevel, ILoggerService, ILogger } from '../../platform/log/common/log.js';
import { ConsoleLogInAutomationLogger } from '../../platform/log/browser/log.js';
import { Disposable, DisposableStore, toDisposable } from '../../base/common/lifecycle.js';
import { BrowserWorkbenchEnvironmentService, IBrowserWorkbenchEnvironmentService } from '../services/environment/browser/environmentService.js';
import { Workbench } from './workbench.js';
import { RemoteFileSystemProviderClient } from '../services/remote/common/remoteFileSystemProviderClient.js';
import { IWorkbenchEnvironmentService } from '../services/environment/common/environmentService.js';
import { IProductService } from '../../platform/product/common/productService.js';
import product from '../../platform/product/common/product.js';
import { RemoteAgentService } from '../services/remote/browser/remoteAgentService.js';
import { RemoteAuthorityResolverService } from '../../platform/remote/browser/remoteAuthorityResolverService.js';
import { IRemoteAuthorityResolverService, RemoteConnectionType } from '../../platform/remote/common/remoteAuthorityResolver.js';
import { IRemoteAgentService } from '../services/remote/common/remoteAgentService.js';
import { IFileService } from '../../platform/files/common/files.js';
import { FileService } from '../../platform/files/common/fileService.js';
import { Schemas, connectionTokenCookieName } from '../../base/common/network.js';
import { IAnyWorkspaceIdentifier, IWorkspaceContextService, UNKNOWN_EMPTY_WINDOW_WORKSPACE, isTemporaryWorkspace, isWorkspaceIdentifier } from '../../platform/workspace/common/workspace.js';
import { IWorkbenchConfigurationService } from '../services/configuration/common/configuration.js';
import { onUnexpectedError } from '../../base/common/errors.js';
import { setFullscreen } from '../../base/browser/browser.js';
import { URI, UriComponents } from '../../base/common/uri.js';
import { WorkspaceService } from '../services/configuration/browser/configurationService.js';
import { ConfigurationCache } from '../services/configuration/common/configurationCache.js';
import { ISignService } from '../../platform/sign/common/sign.js';
import { SignService } from '../../platform/sign/browser/signService.js';
import { IWorkbenchConstructionOptions, IWorkbench, IWorkspace, ITunnel } from './web.api.js';
import { BrowserStorageService } from '../services/storage/browser/storageService.js';
import { IStorageService } from '../../platform/storage/common/storage.js';
import { toLocalISOString } from '../../base/common/date.js';
import { isWorkspaceToOpen, isFolderToOpen } from '../../platform/window/common/window.js';
import { getSingleFolderWorkspaceIdentifier, getWorkspaceIdentifier } from '../services/workspaces/browser/workspaces.js';
import { InMemoryFileSystemProvider } from '../../platform/files/common/inMemoryFilesystemProvider.js';
import { ICommandService } from '../../platform/commands/common/commands.js';
import { IndexedDBFileSystemProvider } from '../../platform/files/browser/indexedDBFileSystemProvider.js';
import { BrowserRequestService } from '../services/request/browser/requestService.js';
import { IRequestService } from '../../platform/request/common/request.js';
import { IUserDataInitializationService, IUserDataInitializer, UserDataInitializationService } from '../services/userData/browser/userDataInit.js';
import { UserDataSyncStoreManagementService } from '../../platform/userDataSync/common/userDataSyncStoreService.js';
import { IUserDataSyncStoreManagementService } from '../../platform/userDataSync/common/userDataSync.js';
import { ILifecycleService } from '../services/lifecycle/common/lifecycle.js';
import { Action2, MenuId, registerAction2 } from '../../platform/actions/common/actions.js';
import { IInstantiationService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { localize, localize2 } from '../../nls.js';
import { Categories } from '../../platform/action/common/actionCommonCategories.js';
import { IDialogService } from '../../platform/dialogs/common/dialogs.js';
import { IHostService } from '../services/host/browser/host.js';
import { IUriIdentityService } from '../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../platform/uriIdentity/common/uriIdentityService.js';
import { BrowserWindow } from './window.js';
import { ITimerService } from '../services/timer/browser/timerService.js';
import { WorkspaceTrustEnablementService, WorkspaceTrustManagementService } from '../services/workspaces/common/workspaceTrust.js';
import { IWorkspaceTrustEnablementService, IWorkspaceTrustManagementService } from '../../platform/workspace/common/workspaceTrust.js';
import { HTMLFileSystemProvider } from '../../platform/files/browser/htmlFileSystemProvider.js';
import { IOpenerService } from '../../platform/opener/common/opener.js';
import { mixin, safeStringify } from '../../base/common/objects.js';
import { IndexedDB } from '../../base/browser/indexedDB.js';
import { WebFileSystemAccess } from '../../platform/files/browser/webFileSystemAccess.js';
import { IProgressService } from '../../platform/progress/common/progress.js';
import { DelayedLogChannel } from '../services/output/common/delayedLogChannel.js';
import { dirname, joinPath } from '../../base/common/resources.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../platform/userDataProfile/common/userDataProfile.js';
import { IPolicyService } from '../../platform/policy/common/policy.js';
import { IRemoteExplorerService } from '../services/remote/common/remoteExplorerService.js';
import { DisposableTunnel, TunnelProtocol } from '../../platform/tunnel/common/tunnel.js';
import { ILabelService } from '../../platform/label/common/label.js';
import { UserDataProfileService } from '../services/userDataProfile/common/userDataProfileService.js';
import { IUserDataProfileService } from '../services/userDataProfile/common/userDataProfile.js';
import { BrowserUserDataProfilesService } from '../../platform/userDataProfile/browser/userDataProfile.js';
import { DeferredPromise, timeout } from '../../base/common/async.js';
import { windowLogGroup, windowLogId } from '../services/log/common/logConstants.js';
import { LogService } from '../../platform/log/common/logService.js';
import { IRemoteSocketFactoryService, RemoteSocketFactoryService } from '../../platform/remote/common/remoteSocketFactoryService.js';
import { BrowserSocketFactory } from '../../platform/remote/browser/browserSocketFactory.js';
import { VSBuffer } from '../../base/common/buffer.js';
import { IStoredWorkspace } from '../../platform/workspaces/common/workspaces.js';
import { UserDataProfileInitializer } from '../services/userDataProfile/browser/userDataProfileInit.js';
import { UserDataSyncInitializer } from '../services/userDataSync/browser/userDataSyncInit.js';
import { BrowserRemoteResourceLoader } from '../services/remote/browser/browserRemoteResourceHandler.js';
import { BufferLogger } from '../../platform/log/common/bufferLog.js';
import { FileLoggerService } from '../../platform/log/common/fileLog.js';
import { IEmbedderTerminalService } from '../services/terminal/common/embedderTerminalService.js';
import { BrowserSecretStorageService } from '../services/secrets/browser/secretStorageService.js';
import { EncryptionService } from '../services/encryption/browser/encryptionService.js';
import { IEncryptionService } from '../../platform/encryption/common/encryptionService.js';
import { ISecretStorageService } from '../../platform/secrets/common/secrets.js';
import { TunnelSource } from '../services/remote/common/tunnelModel.js';
import { mainWindow } from '../../base/browser/window.js';
import { INotificationService, Severity } from '../../platform/notification/common/notification.js';
import { IDefaultAccountService } from '../../platform/defaultAccount/common/defaultAccount.js';
import { DefaultAccountService } from '../services/accounts/common/defaultAccount.js';
import { AccountPolicyService } from '../services/policies/common/accountPolicyService.js';

export class BrowserMain extends Disposable {

	private readonly onWillShutdownDisposables = this._register(new DisposableStore());
	private readonly indexedDBFileSystemProviders: IndexedDBFileSystemProvider[] = [];

	constructor(
		private readonly domElement: HTMLElement,
		private readonly configuration: IWorkbenchConstructionOptions
	) {
		super();

		this.init();
	}

	private init(): void {

		// Browser config
		setFullscreen(!!detectFullscreen(mainWindow), mainWindow);
	}

	async open(): Promise<IWorkbench> {

		// Init services and wait for DOM to be ready in parallel
		const [services] = await Promise.all([this.initServices(), domContentLoaded(getWindow(this.domElement))]);

		// Create Workbench
		const workbench = new Workbench(this.domElement, undefined, services.serviceCollection, services.logService);

		// Listeners
		this.registerListeners(workbench);

		// Startup
		const instantiationService = workbench.startup();

		// Window
		this._register(instantiationService.createInstance(BrowserWindow));

		// Logging
		services.logService.trace('workbench#open with configuration', safeStringify(this.configuration));

		// Return API Facade
		return instantiationService.invokeFunction(accessor => {
			const commandService = accessor.get(ICommandService);
			const lifecycleService = accessor.get(ILifecycleService);
			const timerService = accessor.get(ITimerService);
			const openerService = accessor.get(IOpenerService);
			const productService = accessor.get(IProductService);
			const progressService = accessor.get(IProgressService);
			const environmentService = accessor.get(IBrowserWorkbenchEnvironmentService);
			const instantiationService = accessor.get(IInstantiationService);
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const labelService = accessor.get(ILabelService);
			const embedderTerminalService = accessor.get(IEmbedderTerminalService);
			const remoteAuthorityResolverService = accessor.get(IRemoteAuthorityResolverService);
			const notificationService = accessor.get(INotificationService);

			async function showMessage<T extends string>(severity: Severity, message: string, ...items: T[]): Promise<T | undefined> {
				const choice = new DeferredPromise<T | undefined>();
				const handle = notificationService.prompt(severity, message, items.map(item => ({
					label: item,
					run: () => choice.complete(item)
				})));
				const disposable = handle.onDidClose(() => {
					choice.complete(undefined);
					disposable.dispose();
				});
				const result = await choice.p;
				handle.close();
				return result;
			}

			let logger: DelayedLogChannel | undefined = undefined;

			return {
				commands: {
					executeCommand: (command, ...args) => commandService.executeCommand(command, ...args)
				},
				env: {
					async getUriScheme(): Promise<string> {
						return productService.urlProtocol;
					},
					async retrievePerformanceMarks() {
						await timerService.whenReady();

						return timerService.getPerformanceMarks();
					},
					async openUri(uri: URI | UriComponents): Promise<boolean> {
						return openerService.open(URI.isUri(uri) ? uri : URI.from(uri), {});
					}
				},
				logger: {
					log: (level, message) => {
						if (!logger) {
							logger = instantiationService.createInstance(DelayedLogChannel, 'webEmbedder', productService.embedderIdentifier || productService.nameShort, joinPath(dirname(environmentService.logFile), 'webEmbedder.log'));
						}

						logger.log(level, message);
					}
				},
				window: {
					withProgress: (options, task) => progressService.withProgress(options, task),
					createTerminal: async (options) => embedderTerminalService.createTerminal(options),
					showInformationMessage: (message, ...items) => showMessage(Severity.Info, message, ...items),
				},
				workspace: {
					didResolveRemoteAuthority: async () => {
						if (!this.configuration.remoteAuthority) {
							return;
						}

						await remoteAuthorityResolverService.resolveAuthority(this.configuration.remoteAuthority);
					},
					openTunnel: async tunnelOptions => {
						const tunnel = assertReturnsDefined(await remoteExplorerService.forward({
							remote: tunnelOptions.remoteAddress,
							local: tunnelOptions.localAddressPort,
							name: tunnelOptions.label,
							source: {
								source: TunnelSource.Extension,
								description: labelService.getHostLabel(Schemas.vscodeRemote, this.configuration.remoteAuthority)
							},
							elevateIfNeeded: false,
							privacy: tunnelOptions.privacy
						}, {
							label: tunnelOptions.label,
							elevateIfNeeded: undefined,
							onAutoForward: undefined,
							requireLocalPort: undefined,
							protocol: tunnelOptions.protocol === TunnelProtocol.Https ? tunnelOptions.protocol : TunnelProtocol.Http
						}));

						if (typeof tunnel === 'string') {
							throw new Error(tunnel);
						}

						return new class extends DisposableTunnel implements ITunnel {
							declare localAddress: string;
						}({
							port: tunnel.tunnelRemotePort,
							host: tunnel.tunnelRemoteHost
						}, tunnel.localAddress, () => tunnel.dispose());
					}
				},
				shutdown: () => lifecycleService.shutdown()
			} satisfies IWorkbench;
		});
	}

	private registerListeners(workbench: Workbench): void {

		// Workbench Lifecycle
		this._register(workbench.onWillShutdown(() => this.onWillShutdownDisposables.clear()));
		this._register(workbench.onDidShutdown(() => this.dispose()));
	}

	private async initServices(): Promise<{ serviceCollection: ServiceCollection; configurationService: IWorkbenchConfigurationService; logService: ILogService }> {
		const serviceCollection = new ServiceCollection();


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.web.main.ts` if the service
		//       is web only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		const workspace = this.resolveWorkspace();

		// Product
		const productService: IProductService = mixin({ _serviceBrand: undefined, ...product }, this.configuration.productConfiguration);
		serviceCollection.set(IProductService, productService);

		// Environment
		const logsPath = URI.file(toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '')).with({ scheme: 'vscode-log' });
		const environmentService = new BrowserWorkbenchEnvironmentService(workspace.id, logsPath, this.configuration, productService);
		serviceCollection.set(IBrowserWorkbenchEnvironmentService, environmentService);

		// Files
		const fileLogger = new BufferLogger();
		const fileService = this._register(new FileService(fileLogger));
		serviceCollection.set(IFileService, fileService);

		// Logger
		const loggerService = new FileLoggerService(getLogLevel(environmentService), logsPath, fileService);
		serviceCollection.set(ILoggerService, loggerService);

		// Log Service
		const otherLoggers: ILogger[] = [new ConsoleLogger(loggerService.getLogLevel())];
		if (environmentService.isExtensionDevelopment && !!environmentService.extensionTestsLocationURI) {
			otherLoggers.push(new ConsoleLogInAutomationLogger(loggerService.getLogLevel()));
		}
		const logger = loggerService.createLogger(environmentService.logFile, { id: windowLogId, name: windowLogGroup.name, group: windowLogGroup });
		const logService = new LogService(logger, otherLoggers);
		serviceCollection.set(ILogService, logService);

		// Set the logger of the fileLogger after the log service is ready.
		// This is to avoid cyclic dependency
		fileLogger.logger = logService;

		// Register File System Providers depending on IndexedDB support
		// Register them early because they are needed for the profiles initialization
		await this.registerIndexedDBFileSystemProviders(environmentService, fileService, logService, loggerService, logsPath);


		const connectionToken = environmentService.options.connectionToken || getCookieValue(connectionTokenCookieName);
		const remoteResourceLoader = this.configuration.remoteResourceProvider ? new BrowserRemoteResourceLoader(fileService, this.configuration.remoteResourceProvider) : undefined;
		const resourceUriProvider = this.configuration.resourceUriProvider ?? remoteResourceLoader?.getResourceUriProvider();
		const remoteAuthorityResolverService = new RemoteAuthorityResolverService(!environmentService.expectsResolverExtension, connectionToken, resourceUriProvider, this.configuration.serverBasePath, productService, logService);
		serviceCollection.set(IRemoteAuthorityResolverService, remoteAuthorityResolverService);

		// Signing
		const signService = new SignService(productService);
		serviceCollection.set(ISignService, signService);


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.web.main.ts` if the service
		//       is web only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		// URI Identity
		const uriIdentityService = new UriIdentityService(fileService);
		serviceCollection.set(IUriIdentityService, uriIdentityService);

		// User Data Profiles
		const userDataProfilesService = new BrowserUserDataProfilesService(environmentService, fileService, uriIdentityService, logService);
		serviceCollection.set(IUserDataProfilesService, userDataProfilesService);

		const currentProfile = await this.getCurrentProfile(workspace, userDataProfilesService, environmentService);
		await userDataProfilesService.setProfileForWorkspace(workspace, currentProfile);
		const userDataProfileService = new UserDataProfileService(currentProfile);
		serviceCollection.set(IUserDataProfileService, userDataProfileService);

		// Remote Agent
		const remoteSocketFactoryService = new RemoteSocketFactoryService();
		remoteSocketFactoryService.register(RemoteConnectionType.WebSocket, new BrowserSocketFactory(this.configuration.webSocketFactory));
		serviceCollection.set(IRemoteSocketFactoryService, remoteSocketFactoryService);
		const remoteAgentService = this._register(new RemoteAgentService(remoteSocketFactoryService, userDataProfileService, environmentService, productService, remoteAuthorityResolverService, signService, logService));
		serviceCollection.set(IRemoteAgentService, remoteAgentService);
		this._register(RemoteFileSystemProviderClient.register(remoteAgentService, fileService, logService));

		// Default Account
		const defaultAccountService = this._register(new DefaultAccountService());
		serviceCollection.set(IDefaultAccountService, defaultAccountService);

		// Policies
		const policyService = new AccountPolicyService(logService, defaultAccountService);
		serviceCollection.set(IPolicyService, policyService);

		// Long running services (workspace, config, storage)
		const [configurationService, storageService] = await Promise.all([
			this.createWorkspaceService(workspace, environmentService, userDataProfileService, userDataProfilesService, fileService, remoteAgentService, uriIdentityService, policyService, logService).then(service => {

				// Workspace
				serviceCollection.set(IWorkspaceContextService, service);

				// Configuration
				serviceCollection.set(IWorkbenchConfigurationService, service);

				return service;
			}),

			this.createStorageService(workspace, logService, userDataProfileService).then(service => {

				// Storage
				serviceCollection.set(IStorageService, service);

				return service;
			})
		]);

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.web.main.ts` if the service
		//       is web only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		// Workspace Trust Service
		const workspaceTrustEnablementService = new WorkspaceTrustEnablementService(configurationService, environmentService);
		serviceCollection.set(IWorkspaceTrustEnablementService, workspaceTrustEnablementService);

		const workspaceTrustManagementService = new WorkspaceTrustManagementService(configurationService, remoteAuthorityResolverService, storageService, uriIdentityService, environmentService, configurationService, workspaceTrustEnablementService, fileService);
		serviceCollection.set(IWorkspaceTrustManagementService, workspaceTrustManagementService);

		// Update workspace trust so that configuration is updated accordingly
		configurationService.updateWorkspaceTrust(workspaceTrustManagementService.isWorkspaceTrusted());
		this._register(workspaceTrustManagementService.onDidChangeTrust(() => configurationService.updateWorkspaceTrust(workspaceTrustManagementService.isWorkspaceTrusted())));

		// Request Service
		const requestService = new BrowserRequestService(remoteAgentService, configurationService, loggerService);
		serviceCollection.set(IRequestService, requestService);

		// Userdata Sync Store Management Service
		const userDataSyncStoreManagementService = new UserDataSyncStoreManagementService(productService, configurationService, storageService);
		serviceCollection.set(IUserDataSyncStoreManagementService, userDataSyncStoreManagementService);


		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.web.main.ts` if the service
		//       is web only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		const encryptionService = new EncryptionService();
		serviceCollection.set(IEncryptionService, encryptionService);
		const secretStorageService = new BrowserSecretStorageService(storageService, encryptionService, environmentService, logService);
		serviceCollection.set(ISecretStorageService, secretStorageService);

		// Userdata Initialize Service
		const userDataInitializers: IUserDataInitializer[] = [];
		userDataInitializers.push(new UserDataSyncInitializer(environmentService, secretStorageService, userDataSyncStoreManagementService, fileService, userDataProfilesService, storageService, productService, requestService, logService, uriIdentityService));
		if (environmentService.options.profile) {
			userDataInitializers.push(new UserDataProfileInitializer(environmentService, fileService, userDataProfileService, storageService, logService, uriIdentityService, requestService));
		}
		const userDataInitializationService = new UserDataInitializationService(userDataInitializers);
		serviceCollection.set(IUserDataInitializationService, userDataInitializationService);

		try {
			await Promise.race([
				// Do not block more than 5s
				timeout(5000),
				this.initializeUserData(userDataInitializationService, configurationService)]
			);
		} catch (error) {
			logService.error(error);
		}

		return { serviceCollection, configurationService, logService };
	}

	private async initializeUserData(userDataInitializationService: UserDataInitializationService, configurationService: WorkspaceService) {
		if (await userDataInitializationService.requiresInitialization()) {
			mark('code/willInitRequiredUserData');

			// Initialize required resources - settings & global state
			await userDataInitializationService.initializeRequiredResources();

			// Important: Reload only local user configuration after initializing
			// Reloading complete configuration blocks workbench until remote configuration is loaded.
			await configurationService.reloadLocalUserConfiguration();

			mark('code/didInitRequiredUserData');
		}
	}

	private async registerIndexedDBFileSystemProviders(environmentService: IWorkbenchEnvironmentService, fileService: IFileService, logService: ILogService, loggerService: ILoggerService, logsPath: URI): Promise<void> {

		// IndexedDB is used for logging and user data
		let indexedDB: IndexedDB | undefined;
		const userDataStore = 'vscode-userdata-store';
		const logsStore = 'vscode-logs-store';
		const handlesStore = 'vscode-filehandles-store';
		try {
			indexedDB = await IndexedDB.create('vscode-web-db', 3, [userDataStore, logsStore, handlesStore]);

			// Close onWillShutdown
			this.onWillShutdownDisposables.add(toDisposable(() => indexedDB?.close()));
		} catch (error) {
			logService.error('Error while creating IndexedDB', error);
		}

		// Logger
		if (indexedDB) {
			const logFileSystemProvider = new IndexedDBFileSystemProvider(logsPath.scheme, indexedDB, logsStore, false);
			this.indexedDBFileSystemProviders.push(logFileSystemProvider);
			fileService.registerProvider(logsPath.scheme, logFileSystemProvider);
		} else {
			fileService.registerProvider(logsPath.scheme, new InMemoryFileSystemProvider());
		}

		// User data
		let userDataProvider;
		if (indexedDB) {
			userDataProvider = new IndexedDBFileSystemProvider(Schemas.vscodeUserData, indexedDB, userDataStore, true);
			this.indexedDBFileSystemProviders.push(userDataProvider);
			this.registerDeveloperActions(userDataProvider);
		} else {
			logService.info('Using in-memory user data provider');
			userDataProvider = new InMemoryFileSystemProvider();
		}
		fileService.registerProvider(Schemas.vscodeUserData, userDataProvider);

		// Local file access (if supported by browser)
		if (WebFileSystemAccess.supported(mainWindow)) {
			fileService.registerProvider(Schemas.file, new HTMLFileSystemProvider(indexedDB, handlesStore, logService));
		}

		// In-memory
		fileService.registerProvider(Schemas.tmp, new InMemoryFileSystemProvider());
	}

	private registerDeveloperActions(provider: IndexedDBFileSystemProvider): void {
		this._register(registerAction2(class ResetUserDataAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.resetUserData',
					title: localize2('reset', "Reset User Data"),
					category: Categories.Developer,
					menu: {
						id: MenuId.CommandPalette
					}
				});
			}

			async run(accessor: ServicesAccessor): Promise<void> {
				const dialogService = accessor.get(IDialogService);
				const hostService = accessor.get(IHostService);
				const storageService = accessor.get(IStorageService);
				const logService = accessor.get(ILogService);
				const result = await dialogService.confirm({
					message: localize('reset user data message', "Would you like to reset your data (settings, keybindings, extensions, snippets and UI State) and reload?")
				});

				if (result.confirmed) {
					try {
						await provider?.reset();
						if (storageService instanceof BrowserStorageService) {
							await storageService.clear();
						}
					} catch (error) {
						logService.error(error);
						throw error;
					}
				}

				hostService.reload();
			}
		}));
	}

	private async createStorageService(workspace: IAnyWorkspaceIdentifier, logService: ILogService, userDataProfileService: IUserDataProfileService): Promise<IStorageService> {
		const storageService = new BrowserStorageService(workspace, userDataProfileService, logService);

		try {
			await storageService.initialize();

			// Register to close on shutdown
			this.onWillShutdownDisposables.add(toDisposable(() => storageService.close()));

			return storageService;
		} catch (error) {
			onUnexpectedError(error);
			logService.error(error);

			return storageService;
		}
	}

	private async createWorkspaceService(workspace: IAnyWorkspaceIdentifier, environmentService: IBrowserWorkbenchEnvironmentService, userDataProfileService: IUserDataProfileService, userDataProfilesService: IUserDataProfilesService, fileService: FileService, remoteAgentService: IRemoteAgentService, uriIdentityService: IUriIdentityService, policyService: IPolicyService, logService: ILogService): Promise<WorkspaceService> {

		// Temporary workspaces do not exist on startup because they are
		// just in memory. As such, detect this case and eagerly create
		// the workspace file empty so that it is a valid workspace.

		if (isWorkspaceIdentifier(workspace) && isTemporaryWorkspace(workspace.configPath)) {
			try {
				const emptyWorkspace: IStoredWorkspace = { folders: [] };
				await fileService.createFile(workspace.configPath, VSBuffer.fromString(JSON.stringify(emptyWorkspace, null, '\t')), { overwrite: false });
			} catch (error) {
				// ignore if workspace file already exists
			}
		}

		const configurationCache = new ConfigurationCache([Schemas.file, Schemas.vscodeUserData, Schemas.tmp] /* Cache all non native resources */, environmentService, fileService);
		const workspaceService = new WorkspaceService({ remoteAuthority: this.configuration.remoteAuthority, configurationCache }, environmentService, userDataProfileService, userDataProfilesService, fileService, remoteAgentService, uriIdentityService, logService, policyService);

		try {
			await workspaceService.initialize(workspace);

			return workspaceService;
		} catch (error) {
			onUnexpectedError(error);
			logService.error(error);

			return workspaceService;
		}
	}

	private async getCurrentProfile(workspace: IAnyWorkspaceIdentifier, userDataProfilesService: BrowserUserDataProfilesService, environmentService: BrowserWorkbenchEnvironmentService): Promise<IUserDataProfile> {
		const profileName = environmentService.options?.profile?.name ?? environmentService.profile;
		if (profileName) {
			const profile = userDataProfilesService.profiles.find(p => p.name === profileName);
			if (profile) {
				return profile;
			}
			return userDataProfilesService.createNamedProfile(profileName, undefined, workspace);
		}
		return userDataProfilesService.getProfileForWorkspace(workspace) ?? userDataProfilesService.defaultProfile;
	}

	private resolveWorkspace(): IAnyWorkspaceIdentifier {
		let workspace: IWorkspace | undefined = undefined;
		if (this.configuration.workspaceProvider) {
			workspace = this.configuration.workspaceProvider.workspace;
		}

		// Multi-root workspace
		if (workspace && isWorkspaceToOpen(workspace)) {
			return getWorkspaceIdentifier(workspace.workspaceUri);
		}

		// Single-folder workspace
		if (workspace && isFolderToOpen(workspace)) {
			return getSingleFolderWorkspaceIdentifier(workspace.folderUri);
		}

		// Empty window workspace
		return UNKNOWN_EMPTY_WINDOW_WORKSPACE;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/window.ts]---
Location: vscode-main/src/vs/workbench/browser/window.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isSafari, setFullscreen } from '../../base/browser/browser.js';
import { addDisposableListener, EventHelper, EventType, getActiveWindow, getWindow, getWindowById, getWindows, getWindowsCount, windowOpenNoOpener, windowOpenPopup, windowOpenWithSuccess } from '../../base/browser/dom.js';
import { DomEmitter } from '../../base/browser/event.js';
import { HidDeviceData, requestHidDevice, requestSerialPort, requestUsbDevice, SerialPortData, UsbDeviceData } from '../../base/browser/deviceAccess.js';
import { timeout } from '../../base/common/async.js';
import { Event } from '../../base/common/event.js';
import { Disposable, IDisposable, dispose, toDisposable } from '../../base/common/lifecycle.js';
import { matchesScheme, Schemas } from '../../base/common/network.js';
import { isIOS, isMacintosh } from '../../base/common/platform.js';
import Severity from '../../base/common/severity.js';
import { URI } from '../../base/common/uri.js';
import { localize } from '../../nls.js';
import { CommandsRegistry } from '../../platform/commands/common/commands.js';
import { IDialogService, IPromptButton } from '../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../platform/instantiation/common/instantiation.js';
import { ILabelService } from '../../platform/label/common/label.js';
import { IOpenerService } from '../../platform/opener/common/opener.js';
import { IProductService } from '../../platform/product/common/productService.js';
import { IBrowserWorkbenchEnvironmentService } from '../services/environment/browser/environmentService.js';
import { IWorkbenchLayoutService } from '../services/layout/browser/layoutService.js';
import { BrowserLifecycleService } from '../services/lifecycle/browser/lifecycleService.js';
import { ILifecycleService, ShutdownReason } from '../services/lifecycle/common/lifecycle.js';
import { IHostService } from '../services/host/browser/host.js';
import { registerWindowDriver } from '../services/driver/browser/driver.js';
import { CodeWindow, isAuxiliaryWindow, mainWindow } from '../../base/browser/window.js';
import { createSingleCallFunction } from '../../base/common/functional.js';
import { IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IWorkbenchEnvironmentService } from '../services/environment/common/environmentService.js';
import { MarkdownString } from '../../base/common/htmlContent.js';
import { IContextMenuService } from '../../platform/contextview/browser/contextView.js';

export abstract class BaseWindow extends Disposable {

	private static TIMEOUT_HANDLES = Number.MIN_SAFE_INTEGER; // try to not compete with the IDs of native `setTimeout`
	private static readonly TIMEOUT_DISPOSABLES = new Map<number, Set<IDisposable>>();

	constructor(
		targetWindow: CodeWindow,
		dom = { getWindowsCount, getWindows }, /* for testing */
		@IHostService protected readonly hostService: IHostService,
		@IWorkbenchEnvironmentService protected readonly environmentService: IWorkbenchEnvironmentService,
		@IContextMenuService protected readonly contextMenuService: IContextMenuService,
		@IWorkbenchLayoutService protected readonly layoutService: IWorkbenchLayoutService,
	) {
		super();

		this.enableWindowFocusOnElementFocus(targetWindow);
		this.enableMultiWindowAwareTimeout(targetWindow, dom);

		this.registerFullScreenListeners(targetWindow.vscodeWindowId);
		this.registerContextMenuListeners(targetWindow);
	}

	//#region focus handling in multi-window applications

	protected enableWindowFocusOnElementFocus(targetWindow: CodeWindow): void {
		const originalFocus = targetWindow.HTMLElement.prototype.focus;

		const that = this;
		targetWindow.HTMLElement.prototype.focus = function (this: HTMLElement, options?: FocusOptions | undefined): void {

			// Ensure the window the element belongs to is focused
			// in scenarios where auxiliary windows are present
			that.onElementFocus(getWindow(this));

			// Pass to original focus() method
			originalFocus.apply(this, [options]);
		};
	}

	private onElementFocus(targetWindow: CodeWindow): void {
		const activeWindow = getActiveWindow();
		if (activeWindow !== targetWindow && activeWindow.document.hasFocus()) {

			// Call original focus()
			targetWindow.focus();

			// In Electron, `window.focus()` fails to bring the window
			// to the front if multiple windows exist in the same process
			// group (floating windows). As such, we ask the host service
			// to focus the window which can take care of bringin the
			// window to the front.
			//
			// To minimise disruption by bringing windows to the front
			// by accident, we only do this if the window is not already
			// focused and the active window is not the target window
			// but has focus. This is an indication that multiple windows
			// are opened in the same process group while the target window
			// is not focused.

			if (
				!this.environmentService.extensionTestsLocationURI &&
				!targetWindow.document.hasFocus()
			) {
				this.hostService.focus(targetWindow);
			}
		}
	}

	//#endregion

	//#region timeout handling in multi-window applications

	protected enableMultiWindowAwareTimeout(targetWindow: Window, dom = { getWindowsCount, getWindows }): void {

		// Override `setTimeout` and `clearTimeout` on the provided window to make
		// sure timeouts are dispatched to all opened windows. Some browsers may decide
		// to throttle timeouts in minimized windows, so with this we can ensure the
		// timeout is scheduled without being throttled (unless all windows are minimized).

		const originalSetTimeout = targetWindow.setTimeout;
		Object.defineProperty(targetWindow, 'vscodeOriginalSetTimeout', { get: () => originalSetTimeout });

		const originalClearTimeout = targetWindow.clearTimeout;
		Object.defineProperty(targetWindow, 'vscodeOriginalClearTimeout', { get: () => originalClearTimeout });

		targetWindow.setTimeout = function (this: unknown, handler: TimerHandler, timeout = 0, ...args: unknown[]): number {
			if (dom.getWindowsCount() === 1 || typeof handler === 'string' || timeout === 0 /* immediates are never throttled */) {
				return originalSetTimeout.apply(this, [handler, timeout, ...args]);
			}

			const timeoutDisposables = new Set<IDisposable>();
			const timeoutHandle = BaseWindow.TIMEOUT_HANDLES++;
			BaseWindow.TIMEOUT_DISPOSABLES.set(timeoutHandle, timeoutDisposables);

			const handlerFn = createSingleCallFunction(handler, () => {
				dispose(timeoutDisposables);
				BaseWindow.TIMEOUT_DISPOSABLES.delete(timeoutHandle);
			});

			for (const { window, disposables } of dom.getWindows()) {
				if (isAuxiliaryWindow(window) && window.document.visibilityState === 'hidden') {
					continue; // skip over hidden windows (but never over main window)
				}

				// we track didClear in case the browser does not properly clear the timeout
				// this can happen for timeouts on unfocused windows
				let didClear = false;

				const handle = (window as { vscodeOriginalSetTimeout?: typeof window.setTimeout }).vscodeOriginalSetTimeout?.apply(this, [(...args: unknown[]) => {
					if (didClear) {
						return;
					}
					handlerFn(...args);
				}, timeout, ...args]);

				const timeoutDisposable = toDisposable(() => {
					didClear = true;
					(window as { vscodeOriginalClearTimeout?: typeof window.clearTimeout }).vscodeOriginalClearTimeout?.apply(this, [handle]);
					timeoutDisposables.delete(timeoutDisposable);
				});

				disposables.add(timeoutDisposable);
				timeoutDisposables.add(timeoutDisposable);
			}

			return timeoutHandle;
		};

		targetWindow.clearTimeout = function (this: unknown, timeoutHandle: number | undefined): void {
			const timeoutDisposables = typeof timeoutHandle === 'number' ? BaseWindow.TIMEOUT_DISPOSABLES.get(timeoutHandle) : undefined;
			if (timeoutDisposables) {
				dispose(timeoutDisposables);
				BaseWindow.TIMEOUT_DISPOSABLES.delete(timeoutHandle!);
			} else {
				originalClearTimeout.apply(this, [timeoutHandle]);
			}
		};
	}

	//#endregion

	//#region Confirm on Shutdown

	static async confirmOnShutdown(accessor: ServicesAccessor, reason: ShutdownReason): Promise<boolean> {
		const dialogService = accessor.get(IDialogService);
		const configurationService = accessor.get(IConfigurationService);

		const message = reason === ShutdownReason.QUIT ?
			(isMacintosh ? localize('quitMessageMac', "Are you sure you want to quit?") : localize('quitMessage', "Are you sure you want to exit?")) :
			localize('closeWindowMessage', "Are you sure you want to close the window?");
		const primaryButton = reason === ShutdownReason.QUIT ?
			(isMacintosh ? localize({ key: 'quitButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Quit") : localize({ key: 'exitButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Exit")) :
			localize({ key: 'closeWindowButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Close Window");

		const res = await dialogService.confirm({
			message,
			primaryButton,
			checkbox: {
				label: localize('doNotAskAgain', "Do not ask me again")
			}
		});

		// Update setting if checkbox checked
		if (res.confirmed && res.checkboxChecked) {
			await configurationService.updateValue('window.confirmBeforeClose', 'never');
		}

		return res.confirmed;
	}

	//#endregion

	private registerFullScreenListeners(targetWindowId: number): void {
		this._register(this.hostService.onDidChangeFullScreen(({ windowId, fullscreen }) => {
			if (windowId === targetWindowId) {
				const targetWindow = getWindowById(targetWindowId);
				if (targetWindow) {
					setFullscreen(fullscreen, targetWindow.window);
				}
			}
		}));
	}

	private registerContextMenuListeners(targetWindow: Window): void {
		if (targetWindow !== mainWindow) {
			// we only need to listen in the main window as the code
			// will go by the active container and update accordingly
			return;
		}

		const update = (visible: boolean) => this.layoutService.activeContainer.classList.toggle('context-menu-visible', visible);
		this._register(this.contextMenuService.onDidShowContextMenu(() => update(true)));
		this._register(this.contextMenuService.onDidHideContextMenu(() => update(false)));
	}
}

export class BrowserWindow extends BaseWindow {

	constructor(
		@IOpenerService private readonly openerService: IOpenerService,
		@ILifecycleService private readonly lifecycleService: BrowserLifecycleService,
		@IDialogService private readonly dialogService: IDialogService,
		@ILabelService private readonly labelService: ILabelService,
		@IProductService private readonly productService: IProductService,
		@IBrowserWorkbenchEnvironmentService private readonly browserEnvironmentService: IBrowserWorkbenchEnvironmentService,
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IHostService hostService: IHostService,
		@IContextMenuService contextMenuService: IContextMenuService,
	) {
		super(mainWindow, undefined, hostService, browserEnvironmentService, contextMenuService, layoutService);

		this.registerListeners();
		this.create();
	}

	private registerListeners(): void {

		// Lifecycle
		this._register(this.lifecycleService.onWillShutdown(() => this.onWillShutdown()));

		// Layout
		const viewport = isIOS && mainWindow.visualViewport ? mainWindow.visualViewport /** Visual viewport */ : mainWindow /** Layout viewport */;
		this._register(addDisposableListener(viewport, EventType.RESIZE, () => {
			this.layoutService.layout();

			// Sometimes the keyboard appearing scrolls the whole workbench out of view, as a workaround scroll back into view #121206
			if (isIOS) {
				mainWindow.scrollTo(0, 0);
			}
		}));

		// Prevent the back/forward gestures in macOS
		this._register(addDisposableListener(this.layoutService.mainContainer, EventType.WHEEL, e => e.preventDefault(), { passive: false }));

		// Prevent native context menus in web
		this._register(addDisposableListener(this.layoutService.mainContainer, EventType.CONTEXT_MENU, e => EventHelper.stop(e, true)));

		// Prevent default navigation on drop
		this._register(addDisposableListener(this.layoutService.mainContainer, EventType.DROP, e => EventHelper.stop(e, true)));
	}

	private onWillShutdown(): void {

		// Try to detect some user interaction with the workbench
		// when shutdown has happened to not show the dialog e.g.
		// when navigation takes a longer time.
		Event.toPromise(Event.any(
			Event.once(new DomEmitter(mainWindow.document.body, EventType.KEY_DOWN, true).event),
			Event.once(new DomEmitter(mainWindow.document.body, EventType.MOUSE_DOWN, true).event)
		)).then(async () => {

			// Delay the dialog in case the user interacted
			// with the page before it transitioned away
			await timeout(3000);

			// This should normally not happen, but if for some reason
			// the workbench was shutdown while the page is still there,
			// inform the user that only a reload can bring back a working
			// state.
			await this.dialogService.prompt({
				type: Severity.Error,
				message: localize('shutdownError', "An unexpected error occurred that requires a reload of this page."),
				detail: localize('shutdownErrorDetail', "The workbench was unexpectedly disposed while running."),
				buttons: [
					{
						label: localize({ key: 'reload', comment: ['&& denotes a mnemonic'] }, "&&Reload"),
						run: () => mainWindow.location.reload() // do not use any services at this point since they are likely not functional at this point
					}
				]
			});
		});
	}

	private create(): void {

		// Handle open calls
		this.setupOpenHandlers();

		// Label formatting
		this.registerLabelFormatters();

		// Commands
		this.registerCommands();

		// Smoke Test Driver
		this.setupDriver();
	}

	private setupDriver(): void {
		if (this.environmentService.enableSmokeTestDriver) {
			registerWindowDriver(this.instantiationService);
		}
	}

	private setupOpenHandlers(): void {

		// We need to ignore the `beforeunload` event while
		// we handle external links to open specifically for
		// the case of application protocols that e.g. invoke
		// vscode itself. We do not want to open these links
		// in a new window because that would leave a blank
		// window to the user, but using `window.location.href`
		// will trigger the `beforeunload`.
		this.openerService.setDefaultExternalOpener({
			openExternal: async (href: string) => {
				let isAllowedOpener = false;
				if (this.browserEnvironmentService.options?.openerAllowedExternalUrlPrefixes) {
					for (const trustedPopupPrefix of this.browserEnvironmentService.options.openerAllowedExternalUrlPrefixes) {
						if (href.startsWith(trustedPopupPrefix)) {
							isAllowedOpener = true;
							break;
						}
					}
				}

				// HTTP(s): open in new window and deal with potential popup blockers
				if (matchesScheme(href, Schemas.http) || matchesScheme(href, Schemas.https)) {
					if (isSafari) {
						const opened = windowOpenWithSuccess(href, !isAllowedOpener);
						if (!opened) {
							await this.dialogService.prompt({
								type: Severity.Warning,
								message: localize('unableToOpenExternal', "The browser blocked opening a new tab or window. Press 'Retry' to try again."),
								custom: {
									markdownDetails: [{ markdown: new MarkdownString(localize('unableToOpenWindowDetail', "Please allow pop-ups for this website in your [browser settings]({0}).", 'https://aka.ms/allow-vscode-popup'), true) }]
								},
								buttons: [
									{
										label: localize({ key: 'retry', comment: ['&& denotes a mnemonic'] }, "&&Retry"),
										run: () => isAllowedOpener ? windowOpenPopup(href) : windowOpenNoOpener(href)
									}
								],
								cancelButton: true
							});
						}
					} else {
						if (isAllowedOpener) {
							windowOpenPopup(href);
						} else {
							windowOpenNoOpener(href);
						}
					}
				}

				// Anything else: set location to trigger protocol handler in the browser
				// but make sure to signal this as an expected unload and disable unload
				// handling explicitly to prevent the workbench from going down.
				else {
					const invokeProtocolHandler = () => {
						this.lifecycleService.withExpectedShutdown({ disableShutdownHandling: true }, () => mainWindow.location.href = href);
					};

					invokeProtocolHandler();

					const showProtocolUrlOpenedDialog = async () => {
						const { downloadUrl } = this.productService;
						let detail: string;

						const buttons: IPromptButton<void>[] = [
							{
								label: localize({ key: 'openExternalDialogButtonRetry.v2', comment: ['&& denotes a mnemonic'] }, "&&Try Again"),
								run: () => invokeProtocolHandler()
							}
						];

						if (downloadUrl !== undefined) {
							detail = localize(
								'openExternalDialogDetail.v2',
								"We launched {0} on your computer.\n\nIf {1} did not launch, try again or install it below.",
								this.productService.nameLong,
								this.productService.nameLong
							);

							buttons.push({
								label: localize({ key: 'openExternalDialogButtonInstall.v3', comment: ['&& denotes a mnemonic'] }, "&&Install"),
								run: async () => {
									await this.openerService.open(URI.parse(downloadUrl));

									// Re-show the dialog so that the user can come back after installing and try again
									showProtocolUrlOpenedDialog();
								}
							});
						} else {
							detail = localize(
								'openExternalDialogDetailNoInstall',
								"We launched {0} on your computer.\n\nIf {1} did not launch, try again below.",
								this.productService.nameLong,
								this.productService.nameLong
							);
						}

						// While this dialog shows, closing the tab will not display a confirmation dialog
						// to avoid showing the user two dialogs at once
						await this.hostService.withExpectedShutdown(() => this.dialogService.prompt({
							type: Severity.Info,
							message: localize('openExternalDialogTitle', "All done. You can close this tab now."),
							detail,
							buttons,
							cancelButton: true
						}));
					};

					// We cannot know whether the protocol handler succeeded.
					// Display guidance in case it did not, e.g. the app is not installed locally.
					if (matchesScheme(href, this.productService.urlProtocol)) {
						await showProtocolUrlOpenedDialog();
					}
				}

				return true;
			}
		});
	}

	private registerLabelFormatters(): void {
		this._register(this.labelService.registerFormatter({
			scheme: Schemas.vscodeUserData,
			priority: true,
			formatting: {
				label: '(Settings) ${path}',
				separator: '/',
			}
		}));
	}

	private registerCommands(): void {

		// Allow extensions to request USB devices in Web
		CommandsRegistry.registerCommand('workbench.experimental.requestUsbDevice', async (_accessor: ServicesAccessor, options?: { filters?: unknown[] }): Promise<UsbDeviceData | undefined> => {
			return requestUsbDevice(options);
		});

		// Allow extensions to request Serial devices in Web
		CommandsRegistry.registerCommand('workbench.experimental.requestSerialPort', async (_accessor: ServicesAccessor, options?: { filters?: unknown[] }): Promise<SerialPortData | undefined> => {
			return requestSerialPort(options);
		});

		// Allow extensions to request HID devices in Web
		CommandsRegistry.registerCommand('workbench.experimental.requestHidDevice', async (_accessor: ServicesAccessor, options?: { filters?: unknown[] }): Promise<HidDeviceData | undefined> => {
			return requestHidDevice(options);
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/workbench.contribution.ts]---
Location: vscode-main/src/vs/workbench/browser/workbench.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isStandalone } from '../../base/browser/browser.js';
import { isLinux, isMacintosh, isNative, isWeb, isWindows } from '../../base/common/platform.js';
import { localize } from '../../nls.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationRegistry } from '../../platform/configuration/common/configurationRegistry.js';
import product from '../../platform/product/common/product.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { ConfigurationKeyValuePairs, ConfigurationMigrationWorkbenchContribution, DynamicWindowConfiguration, DynamicWorkbenchSecurityConfiguration, Extensions, IConfigurationMigrationRegistry, problemsConfigurationNodeBase, windowConfigurationNodeBase, workbenchConfigurationNodeBase } from '../common/configuration.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../common/contributions.js';
import { CustomEditorLabelService } from '../services/editor/common/customEditorLabelService.js';
import { ActivityBarPosition, EditorActionsLocation, EditorTabsMode, LayoutSettings } from '../services/layout/browser/layoutService.js';
import { defaultWindowTitle, defaultWindowTitleSeparator } from './parts/titlebar/windowTitle.js';

const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

// Configuration
(function registerConfiguration(): void {

	// Migration support
	registerWorkbenchContribution2(ConfigurationMigrationWorkbenchContribution.ID, ConfigurationMigrationWorkbenchContribution, WorkbenchPhase.Eventually);

	// Dynamic Configuration
	registerWorkbenchContribution2(DynamicWorkbenchSecurityConfiguration.ID, DynamicWorkbenchSecurityConfiguration, WorkbenchPhase.AfterRestored);

	// Workbench
	registry.registerConfiguration({
		...workbenchConfigurationNodeBase,
		'properties': {
			'workbench.externalBrowser': {
				type: 'string',
				markdownDescription: localize('browser', "Configure the browser to use for opening http or https links externally. This can either be the name of the browser (`edge`, `chrome`, `firefox`) or an absolute path to the browser's executable. Will use the system default if not set."),
				included: isNative,
				restricted: true
			},
			'workbench.editor.titleScrollbarSizing': {
				type: 'string',
				enum: ['default', 'large'],
				enumDescriptions: [
					localize('workbench.editor.titleScrollbarSizing.default', "The default size."),
					localize('workbench.editor.titleScrollbarSizing.large', "Increases the size, so it can be grabbed more easily with the mouse.")
				],
				description: localize('tabScrollbarHeight', "Controls the height of the scrollbars used for tabs and breadcrumbs in the editor title area."),
				default: 'default',
			},
			'workbench.editor.titleScrollbarVisibility': {
				type: 'string',
				enum: ['auto', 'visible', 'hidden'],
				enumDescriptions: [
					localize('workbench.editor.titleScrollbarVisibility.auto', "The horizontal scrollbar will be visible only when necessary."),
					localize('workbench.editor.titleScrollbarVisibility.visible', "The horizontal scrollbar will always be visible."),
					localize('workbench.editor.titleScrollbarVisibility.hidden', "The horizontal scrollbar will always be hidden.")
				],
				description: localize('titleScrollbarVisibility', "Controls the visibility of the scrollbars used for tabs and breadcrumbs in the editor title area."),
				default: 'auto',
			},
			[LayoutSettings.EDITOR_TABS_MODE]: {
				'type': 'string',
				'enum': [EditorTabsMode.MULTIPLE, EditorTabsMode.SINGLE, EditorTabsMode.NONE],
				'enumDescriptions': [
					localize('workbench.editor.showTabs.multiple', "Each editor is displayed as a tab in the editor title area."),
					localize('workbench.editor.showTabs.single', "The active editor is displayed as a single large tab in the editor title area."),
					localize('workbench.editor.showTabs.none', "The editor title area is not displayed."),
				],
				'description': localize('showEditorTabs', "Controls whether opened editors should show as individual tabs, one single large tab or if the title area should not be shown."),
				'default': 'multiple'
			},
			[LayoutSettings.EDITOR_ACTIONS_LOCATION]: {
				'type': 'string',
				'enum': [EditorActionsLocation.DEFAULT, EditorActionsLocation.TITLEBAR, EditorActionsLocation.HIDDEN],
				'markdownEnumDescriptions': [
					localize({ comment: ['{0} will be a setting name rendered as a link'], key: 'workbench.editor.editorActionsLocation.default' }, "Show editor actions in the window title bar when {0} is set to {1}. Otherwise, editor actions are shown in the editor tab bar.", '`#workbench.editor.showTabs#`', '`none`'),
					localize({ comment: ['{0} will be a setting name rendered as a link'], key: 'workbench.editor.editorActionsLocation.titleBar' }, "Show editor actions in the window title bar. If {0} is set to {1}, editor actions are hidden.", '`#window.customTitleBarVisibility#`', '`never`'),
					localize('workbench.editor.editorActionsLocation.hidden', "Editor actions are not shown."),
				],
				'markdownDescription': localize('editorActionsLocation', "Controls where the editor actions are shown."),
				'default': 'default'
			},
			'workbench.editor.alwaysShowEditorActions': {
				'type': 'boolean',
				'markdownDescription': localize('alwaysShowEditorActions', "Controls whether to always show the editor actions, even when the editor group is not active."),
				'default': false
			},
			'workbench.editor.wrapTabs': {
				'type': 'boolean',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'wrapTabs' }, "Controls whether tabs should be wrapped over multiple lines when exceeding available space or whether a scrollbar should appear instead. This value is ignored when {0} is not set to '{1}'.", '`#workbench.editor.showTabs#`', '`multiple`'),
				'default': false
			},
			'workbench.editor.scrollToSwitchTabs': {
				'type': 'boolean',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'scrollToSwitchTabs' }, "Controls whether scrolling over tabs will open them or not. By default tabs will only reveal upon scrolling, but not open. You can press and hold the Shift-key while scrolling to change this behavior for that duration. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`'),
				'default': false
			},
			'workbench.editor.highlightModifiedTabs': {
				'type': 'boolean',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'highlightModifiedTabs' }, "Controls whether a top border is drawn on tabs for editors that have unsaved changes. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', `multiple`),
				'default': false
			},
			'workbench.editor.decorations.badges': {
				'type': 'boolean',
				'markdownDescription': localize('decorations.badges', "Controls whether editor file decorations should use badges."),
				'default': true
			},
			'workbench.editor.decorations.colors': {
				'type': 'boolean',
				'markdownDescription': localize('decorations.colors', "Controls whether editor file decorations should use colors."),
				'default': true
			},
			[CustomEditorLabelService.SETTING_ID_ENABLED]: {
				'type': 'boolean',
				'markdownDescription': localize('workbench.editor.label.enabled', "Controls whether the custom workbench editor labels should be applied."),
				'default': true,
			},
			[CustomEditorLabelService.SETTING_ID_PATTERNS]: {
				'type': 'object',
				'markdownDescription': (() => {
					let customEditorLabelDescription = localize('workbench.editor.label.patterns', "Controls the rendering of the editor label. Each __Item__ is a pattern that matches a file path. Both relative and absolute file paths are supported. The relative path must include the WORKSPACE_FOLDER (e.g `WORKSPACE_FOLDER/src/**.tsx` or `*/src/**.tsx`). Absolute patterns must start with a `/`. In case multiple patterns match, the longest matching path will be picked. Each __Value__ is the template for the rendered editor when the __Item__ matches. Variables are substituted based on the context:");
					customEditorLabelDescription += '\n- ' + [
						localize('workbench.editor.label.dirname', "`${dirname}`: name of the folder in which the file is located (e.g. `WORKSPACE_FOLDER/folder/file.txt -> folder`)."),
						localize('workbench.editor.label.nthdirname', "`${dirname(N)}`: name of the nth parent folder in which the file is located (e.g. `N=2: WORKSPACE_FOLDER/static/folder/file.txt -> WORKSPACE_FOLDER`). Folders can be picked from the start of the path by using negative numbers (e.g. `N=-1: WORKSPACE_FOLDER/folder/file.txt -> WORKSPACE_FOLDER`). If the __Item__ is an absolute pattern path, the first folder (`N=-1`) refers to the first folder in the absolute path, otherwise it corresponds to the workspace folder."),
						localize('workbench.editor.label.filename', "`${filename}`: name of the file without the file extension (e.g. `WORKSPACE_FOLDER/folder/file.txt -> file`)."),
						localize('workbench.editor.label.extname', "`${extname}`: the file extension (e.g. `WORKSPACE_FOLDER/folder/file.txt -> txt`)."),
						localize('workbench.editor.label.nthextname', "`${extname(N)}`: the nth extension of the file separated by '.' (e.g. `N=2: WORKSPACE_FOLDER/folder/file.ext1.ext2.ext3 -> ext1`). Extension can be picked from the start of the extension by using negative numbers (e.g. `N=-1: WORKSPACE_FOLDER/folder/file.ext1.ext2.ext3 -> ext2`)."),
					].join('\n- '); // intentionally concatenated to not produce a string that is too long for translations
					customEditorLabelDescription += '\n\n' + localize('customEditorLabelDescriptionExample', "Example: `\"**/static/**/*.html\": \"${filename} - ${dirname} (${extname})\"` will render a file `WORKSPACE_FOLDER/static/folder/file.html` as `file - folder (html)`.");

					return customEditorLabelDescription;
				})(),
				additionalProperties:
				{
					type: ['string', 'null'],
					markdownDescription: localize('workbench.editor.label.template', "The template which should be rendered when the pattern matches. May include the variables ${dirname}, ${filename} and ${extname}."),
					minLength: 1,
					pattern: '.*[a-zA-Z0-9].*'
				},
				'default': {}
			},
			'workbench.editor.labelFormat': {
				'type': 'string',
				'enum': ['default', 'short', 'medium', 'long'],
				'enumDescriptions': [
					localize('workbench.editor.labelFormat.default', "Show the name of the file. When tabs are enabled and two files have the same name in one group the distinguishing sections of each file's path are added. When tabs are disabled, the path relative to the workspace folder is shown if the editor is active."),
					localize('workbench.editor.labelFormat.short', "Show the name of the file followed by its directory name."),
					localize('workbench.editor.labelFormat.medium', "Show the name of the file followed by its path relative to the workspace folder."),
					localize('workbench.editor.labelFormat.long', "Show the name of the file followed by its absolute path.")
				],
				'default': 'default',
				'description': localize('tabDescription', "Controls the format of the label for an editor."),
			},
			'workbench.editor.untitled.labelFormat': {
				'type': 'string',
				'enum': ['content', 'name'],
				'enumDescriptions': [
					localize('workbench.editor.untitled.labelFormat.content', "The name of the untitled file is derived from the contents of its first line unless it has an associated file path. It will fallback to the name in case the line is empty or contains no word characters."),
					localize('workbench.editor.untitled.labelFormat.name', "The name of the untitled file is not derived from the contents of the file."),
				],
				'default': 'content',
				'description': localize('untitledLabelFormat', "Controls the format of the label for an untitled editor."),
			},
			'workbench.editor.empty.hint': {
				'type': 'string',
				'enum': ['text', 'hidden'],
				'default': 'text',
				'markdownDescription': localize("workbench.editor.empty.hint", "Controls if the empty editor text hint should be visible in the editor.")
			},
			'workbench.editor.languageDetection': {
				type: 'boolean',
				default: true,
				description: localize('workbench.editor.languageDetection', "Controls whether the language in a text editor is automatically detected unless the language has been explicitly set by the language picker. This can also be scoped by language so you can specify which languages you do not want to be switched off of. This is useful for languages like Markdown that often contain other languages that might trick language detection into thinking it's the embedded language and not Markdown."),
				scope: ConfigurationScope.LANGUAGE_OVERRIDABLE
			},
			'workbench.editor.historyBasedLanguageDetection': {
				type: 'boolean',
				default: true,
				description: localize('workbench.editor.historyBasedLanguageDetection', "Enables use of editor history in language detection. This causes automatic language detection to favor languages that have been recently opened and allows for automatic language detection to operate with smaller inputs."),
			},
			'workbench.editor.preferHistoryBasedLanguageDetection': {
				type: 'boolean',
				default: false,
				description: localize('workbench.editor.preferBasedLanguageDetection', "When enabled, a language detection model that takes into account editor history will be given higher precedence."),
			},
			'workbench.editor.languageDetectionHints': {
				type: 'object',
				default: { 'untitledEditors': true, 'notebookEditors': true },
				description: localize('workbench.editor.showLanguageDetectionHints', "When enabled, shows a status bar Quick Fix when the editor language doesn't match detected content language."),
				additionalProperties: false,
				properties: {
					untitledEditors: {
						type: 'boolean',
						description: localize('workbench.editor.showLanguageDetectionHints.editors', "Show in untitled text editors"),
					},
					notebookEditors: {
						type: 'boolean',
						description: localize('workbench.editor.showLanguageDetectionHints.notebook', "Show in notebook editors"),
					}
				}
			},
			'workbench.editor.tabActionLocation': {
				type: 'string',
				enum: ['left', 'right'],
				default: 'right',
				markdownDescription: localize({ comment: ['{0} will be a setting name rendered as a link'], key: 'tabActionLocation' }, "Controls the position of the editor's tabs action buttons (close, unpin). This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`')
			},
			'workbench.editor.tabActionCloseVisibility': {
				type: 'boolean',
				default: true,
				description: localize('workbench.editor.tabActionCloseVisibility', "Controls the visibility of the tab close action button.")
			},
			'workbench.editor.tabActionUnpinVisibility': {
				type: 'boolean',
				default: true,
				description: localize('workbench.editor.tabActionUnpinVisibility', "Controls the visibility of the tab unpin action button.")
			},
			'workbench.editor.showTabIndex': {
				'type': 'boolean',
				'default': false,
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'showTabIndex' }, "When enabled, will show the tab index. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`')
			},
			'workbench.editor.tabSizing': {
				'type': 'string',
				'enum': ['fit', 'shrink', 'fixed'],
				'default': 'fit',
				'enumDescriptions': [
					localize('workbench.editor.tabSizing.fit', "Always keep tabs large enough to show the full editor label."),
					localize('workbench.editor.tabSizing.shrink', "Allow tabs to get smaller when the available space is not enough to show all tabs at once."),
					localize('workbench.editor.tabSizing.fixed', "Make all tabs the same size, while allowing them to get smaller when the available space is not enough to show all tabs at once.")
				],
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'tabSizing' }, "Controls the size of editor tabs. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`')
			},
			'workbench.editor.tabSizingFixedMinWidth': {
				'type': 'number',
				'default': 50,
				'minimum': 38,
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'workbench.editor.tabSizingFixedMinWidth' }, "Controls the minimum width of tabs when {0} size is set to {1}.", '`#workbench.editor.tabSizing#`', '`fixed`')
			},
			'workbench.editor.tabSizingFixedMaxWidth': {
				'type': 'number',
				'default': 160,
				'minimum': 38,
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'workbench.editor.tabSizingFixedMaxWidth' }, "Controls the maximum width of tabs when {0} size is set to {1}.", '`#workbench.editor.tabSizing#`', '`fixed`')
			},
			'window.density.editorTabHeight': {
				'type': 'string',
				'enum': ['default', 'compact'],
				'default': 'default',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'workbench.editor.tabHeight' }, "Controls the height of editor tabs. Also applies to the title control bar when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`')
			},
			'workbench.editor.pinnedTabSizing': {
				'type': 'string',
				'enum': ['normal', 'compact', 'shrink'],
				'default': 'normal',
				'enumDescriptions': [
					localize('workbench.editor.pinnedTabSizing.normal', "A pinned tab inherits the look of non pinned tabs."),
					localize('workbench.editor.pinnedTabSizing.compact', "A pinned tab will show in a compact form with only icon or first letter of the editor name."),
					localize('workbench.editor.pinnedTabSizing.shrink', "A pinned tab shrinks to a compact fixed size showing parts of the editor name.")
				],
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'pinnedTabSizing' }, "Controls the size of pinned editor tabs. Pinned tabs are sorted to the beginning of all opened tabs and typically do not close until unpinned. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`')
			},
			'workbench.editor.pinnedTabsOnSeparateRow': {
				'type': 'boolean',
				'default': false,
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'workbench.editor.pinnedTabsOnSeparateRow' }, "When enabled, displays pinned tabs in a separate row above all other tabs. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`'),
			},
			'workbench.editor.preventPinnedEditorClose': {
				'type': 'string',
				'enum': ['keyboardAndMouse', 'keyboard', 'mouse', 'never'],
				'default': 'keyboardAndMouse',
				'enumDescriptions': [
					localize('workbench.editor.preventPinnedEditorClose.always', "Always prevent closing the pinned editor when using mouse middle click or keyboard."),
					localize('workbench.editor.preventPinnedEditorClose.onlyKeyboard', "Prevent closing the pinned editor when using the keyboard."),
					localize('workbench.editor.preventPinnedEditorClose.onlyMouse', "Prevent closing the pinned editor when using mouse middle click."),
					localize('workbench.editor.preventPinnedEditorClose.never', "Never prevent closing a pinned editor.")
				],
				description: localize('workbench.editor.preventPinnedEditorClose', "Controls whether pinned editors should close when keyboard or middle mouse click is used for closing."),
			},
			'workbench.editor.splitSizing': {
				'type': 'string',
				'enum': ['auto', 'distribute', 'split'],
				'default': 'auto',
				'enumDescriptions': [
					localize('workbench.editor.splitSizingAuto', "Splits the active editor group to equal parts, unless all editor groups are already in equal parts. In that case, splits all the editor groups to equal parts."),
					localize('workbench.editor.splitSizingDistribute', "Splits all the editor groups to equal parts."),
					localize('workbench.editor.splitSizingSplit', "Splits the active editor group to equal parts.")
				],
				'description': localize('splitSizing', "Controls the size of editor groups when splitting them.")
			},
			'workbench.editor.splitOnDragAndDrop': {
				'type': 'boolean',
				'default': true,
				'description': localize('splitOnDragAndDrop', "Controls if editor groups can be split from drag and drop operations by dropping an editor or file on the edges of the editor area.")
			},
			'workbench.editor.dragToOpenWindow': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize('dragToOpenWindow', "Controls if editors can be dragged out of the window to open them in a new window. Press and hold the `Alt` key while dragging to toggle this dynamically.")
			},
			'workbench.editor.focusRecentEditorAfterClose': {
				'type': 'boolean',
				'description': localize('focusRecentEditorAfterClose', "Controls whether editors are closed in most recently used order or from left to right."),
				'default': true
			},
			'workbench.editor.showIcons': {
				'type': 'boolean',
				'description': localize('showIcons', "Controls whether opened editors should show with an icon or not. This requires a file icon theme to be enabled as well."),
				'default': true
			},
			'workbench.editor.enablePreview': {
				'type': 'boolean',
				'description': localize('enablePreview', "Controls whether preview mode is used when editors open. There is a maximum of one preview mode editor per editor group. This editor displays its filename in italics on its tab or title label and in the Open Editors view. Its contents will be replaced by the next editor opened in preview mode. Making a change in a preview mode editor will persist it, as will a double-click on its label, or the 'Keep Open' option in its label context menu. Opening a file from Explorer with a double-click persists its editor immediately."),
				'default': true
			},
			'workbench.editor.enablePreviewFromQuickOpen': {
				'type': 'boolean',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'enablePreviewFromQuickOpen' }, "Controls whether editors opened from Quick Open show as preview editors. Preview editors do not stay open, and are reused until explicitly set to be kept open (via double-click or editing). When enabled, hold Ctrl before selection to open an editor as a non-preview. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`'),
				'default': false
			},
			'workbench.editor.enablePreviewFromCodeNavigation': {
				'type': 'boolean',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'enablePreviewFromCodeNavigation' }, "Controls whether editors remain in preview when a code navigation is started from them. Preview editors do not stay open, and are reused until explicitly set to be kept open (via double-click or editing). This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`'),
				'default': false
			},
			'workbench.editor.closeOnFileDelete': {
				'type': 'boolean',
				'description': localize('closeOnFileDelete', "Controls whether editors showing a file that was opened during the session should close automatically when getting deleted or renamed by some other process. Disabling this will keep the editor open  on such an event. Note that deleting from within the application will always close the editor and that editors with unsaved changes will never close to preserve your data."),
				'default': false
			},
			'workbench.editor.openPositioning': {
				'type': 'string',
				'enum': ['left', 'right', 'first', 'last'],
				'default': 'right',
				'markdownDescription': localize({ comment: ['{0}, {1}, {2}, {3} will be a setting name rendered as a link'], key: 'editorOpenPositioning' }, "Controls where editors open. Select {0} or {1} to open editors to the left or right of the currently active one. Select {2} or {3} to open editors independently from the currently active one.", '`left`', '`right`', '`first`', '`last`')
			},
			'workbench.editor.openSideBySideDirection': {
				'type': 'string',
				'enum': ['right', 'down'],
				'default': 'right',
				'markdownDescription': localize('sideBySideDirection', "Controls the default direction of editors that are opened side by side (for example, from the Explorer). By default, editors will open on the right hand side of the currently active one. If changed to `down`, the editors will open below the currently active one. This also impacts the split editor action in the editor toolbar.")
			},
			'workbench.editor.closeEmptyGroups': {
				'type': 'boolean',
				'description': localize('closeEmptyGroups', "Controls the behavior of empty editor groups when the last tab in the group is closed. When enabled, empty groups will automatically close. When disabled, empty groups will remain part of the grid."),
				'default': true
			},
			'workbench.editor.revealIfOpen': {
				'type': 'boolean',
				'description': localize('revealIfOpen', "Controls whether an editor is revealed in any of the visible groups if opened. If disabled, an editor will prefer to open in the currently active editor group. If enabled, an already opened editor will be revealed instead of opened again in the currently active editor group. Note that there are some cases where this setting is ignored, such as when forcing an editor to open in a specific group or to the side of the currently active group."),
				'default': false
			},
			'workbench.editor.swipeToNavigate': {
				'type': 'boolean',
				'description': localize('swipeToNavigate', "Navigate between open files using three-finger swipe horizontally. Note that System Preferences > Trackpad > More Gestures > 'Swipe between pages' must be set to 'Swipe with two or three fingers'."),
				'default': false,
				'included': isMacintosh && !isWeb
			},
			'workbench.editor.mouseBackForwardToNavigate': {
				'type': 'boolean',
				'description': localize('mouseBackForwardToNavigate', "Enables the use of mouse buttons four and five for commands 'Go Back' and 'Go Forward'."),
				'default': true
			},
			'workbench.editor.navigationScope': {
				'type': 'string',
				'enum': ['default', 'editorGroup', 'editor'],
				'default': 'default',
				'markdownDescription': localize('navigationScope', "Controls the scope of history navigation in editors for commands such as 'Go Back' and 'Go Forward'."),
				'enumDescriptions': [
					localize('workbench.editor.navigationScopeDefault', "Navigate across all opened editors and editor groups."),
					localize('workbench.editor.navigationScopeEditorGroup', "Navigate only in editors of the active editor group."),
					localize('workbench.editor.navigationScopeEditor', "Navigate only in the active editor.")
				],
			},
			'workbench.editor.restoreViewState': {
				'type': 'boolean',
				'markdownDescription': localize('restoreViewState', "Restores the last editor view state (such as scroll position) when re-opening editors after they have been closed. Editor view state is stored per editor group and discarded when a group closes. Use the {0} setting to use the last known view state across all editor groups in case no previous view state was found for a editor group.", '`#workbench.editor.sharedViewState#`'),
				'default': true,
				'scope': ConfigurationScope.LANGUAGE_OVERRIDABLE
			},
			'workbench.editor.sharedViewState': {
				'type': 'boolean',
				'description': localize('sharedViewState', "Preserves the most recent editor view state (such as scroll position) across all editor groups and restores that if no specific editor view state is found for the editor group."),
				'default': false
			},
			'workbench.editor.splitInGroupLayout': {
				'type': 'string',
				'enum': ['vertical', 'horizontal'],
				'default': 'horizontal',
				'markdownDescription': localize('splitInGroupLayout', "Controls the layout for when an editor is split in an editor group to be either vertical or horizontal."),
				'enumDescriptions': [
					localize('workbench.editor.splitInGroupLayoutVertical', "Editors are positioned from top to bottom."),
					localize('workbench.editor.splitInGroupLayoutHorizontal', "Editors are positioned from left to right.")
				]
			},
			'workbench.editor.centeredLayoutAutoResize': {
				'type': 'boolean',
				'default': true,
				'description': localize('centeredLayoutAutoResize', "Controls if the centered layout should automatically resize to maximum width when more than one group is open. Once only one group is open it will resize back to the original centered width.")
			},
			'workbench.editor.centeredLayoutFixedWidth': {
				'type': 'boolean',
				'default': false,
				'description': localize('centeredLayoutDynamicWidth', "Controls whether the centered layout tries to maintain constant width when the window is resized.")
			},
			'workbench.editor.doubleClickTabToToggleEditorGroupSizes': {
				'type': 'string',
				'enum': ['maximize', 'expand', 'off'],
				'default': 'expand',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'doubleClickTabToToggleEditorGroupSizes' }, "Controls how the editor group is resized when double clicking on a tab. This value is ignored when {0} is not set to {1}.", '`#workbench.editor.showTabs#`', '`multiple`'),
				'enumDescriptions': [
					localize('workbench.editor.doubleClickTabToToggleEditorGroupSizes.maximize', "All other editor groups are hidden and the current editor group is maximized to take up the entire editor area."),
					localize('workbench.editor.doubleClickTabToToggleEditorGroupSizes.expand', "The editor group takes as much space as possible by making all other editor groups as small as possible."),
					localize('workbench.editor.doubleClickTabToToggleEditorGroupSizes.off', "No editor group is resized when double clicking on a tab.")
				]
			},
			'workbench.editor.limit.enabled': {
				'type': 'boolean',
				'default': false,
				'description': localize('limitEditorsEnablement', "Controls if the number of opened editors should be limited or not. When enabled, less recently used editors will close to make space for newly opening editors.")
			},
			'workbench.editor.limit.value': {
				'type': 'number',
				'default': 10,
				'exclusiveMinimum': 0,
				'markdownDescription': localize('limitEditorsMaximum', "Controls the maximum number of opened editors. Use the {0} setting to control this limit per editor group or across all groups.", '`#workbench.editor.limit.perEditorGroup#`')
			},
			'workbench.editor.limit.excludeDirty': {
				'type': 'boolean',
				'default': false,
				'description': localize('limitEditorsExcludeDirty', "Controls if the maximum number of opened editors should exclude dirty editors for counting towards the configured limit.")
			},
			'workbench.editor.limit.perEditorGroup': {
				'type': 'boolean',
				'default': false,
				'description': localize('perEditorGroup', "Controls if the limit of maximum opened editors should apply per editor group or across all editor groups.")
			},
			'workbench.localHistory.enabled': {
				'type': 'boolean',
				'default': true,
				'description': localize('localHistoryEnabled', "Controls whether local file history is enabled. When enabled, the file contents of an editor that is saved will be stored to a backup location to be able to restore or review the contents later. Changing this setting has no effect on existing local file history entries."),
				'scope': ConfigurationScope.RESOURCE
			},
			'workbench.localHistory.maxFileSize': {
				'type': 'number',
				'default': 256,
				'minimum': 1,
				'description': localize('localHistoryMaxFileSize', "Controls the maximum size of a file (in KB) to be considered for local file history. Files that are larger will not be added to the local file history. Changing this setting has no effect on existing local file history entries."),
				'scope': ConfigurationScope.RESOURCE
			},
			'workbench.localHistory.maxFileEntries': {
				'type': 'number',
				'default': 50,
				'minimum': 0,
				'description': localize('localHistoryMaxFileEntries', "Controls the maximum number of local file history entries per file. When the number of local file history entries exceeds this number for a file, the oldest entries will be discarded."),
				'scope': ConfigurationScope.RESOURCE
			},
			'workbench.localHistory.exclude': {
				'type': 'object',
				'patternProperties': {
					'.*': { 'type': 'boolean' }
				},
				'markdownDescription': localize('exclude', "Configure paths or [glob patterns](https://aka.ms/vscode-glob-patterns) for excluding files from the local file history. Glob patterns are always evaluated relative to the path of the workspace folder unless they are absolute paths. Changing this setting has no effect on existing local file history entries."),
				'scope': ConfigurationScope.RESOURCE
			},
			'workbench.localHistory.mergeWindow': {
				'type': 'number',
				'default': 10,
				'minimum': 1,
				'markdownDescription': localize('mergeWindow', "Configure an interval in seconds during which the last entry in local file history is replaced with the entry that is being added. This helps reduce the overall number of entries that are added, for example when auto save is enabled. This setting is only applied to entries that have the same source of origin. Changing this setting has no effect on existing local file history entries."),
				'scope': ConfigurationScope.RESOURCE
			},
			'workbench.commandPalette.history': {
				'type': 'number',
				'description': localize('commandHistory', "Controls the number of recently used commands to keep in history for the command palette. Set to 0 to disable command history."),
				'default': 50,
				'minimum': 0
			},
			'workbench.commandPalette.preserveInput': {
				'type': 'boolean',
				'description': localize('preserveInput', "Controls whether the last typed input to the command palette should be restored when opening it the next time."),
				'default': false
			},
			'workbench.commandPalette.experimental.suggestCommands': {
				'type': 'boolean',
				tags: ['experimental'],
				'description': localize('suggestCommands', "Controls whether the command palette should have a list of commonly used commands."),
				'default': false
			},
			'workbench.commandPalette.experimental.askChatLocation': {
				'type': 'string',
				tags: ['experimental'],
				'description': localize('askChatLocation', "Controls where the command palette should ask chat questions."),
				'default': 'chatView',
				enum: ['chatView', 'quickChat'],
				enumDescriptions: [
					localize('askChatLocation.chatView', "Ask chat questions in the Chat view."),
					localize('askChatLocation.quickChat', "Ask chat questions in Quick Chat.")
				]
			},
			'workbench.commandPalette.showAskInChat': {
				'type': 'boolean',
				tags: ['experimental'],
				'description': localize('showAskInChat', "Controls whether the command palette shows 'Ask in Chat' option at the bottom."),
				'default': true
			},
			'workbench.commandPalette.experimental.enableNaturalLanguageSearch': {
				'type': 'boolean',
				tags: ['experimental'],
				'description': localize('enableNaturalLanguageSearch', "Controls whether the command palette should include similar commands. You must have an extension installed that provides Natural Language support."),
				'default': true
			},
			'workbench.quickOpen.closeOnFocusLost': {
				'type': 'boolean',
				'description': localize('closeOnFocusLost', "Controls whether Quick Open should close automatically once it loses focus."),
				'default': true
			},
			'workbench.quickOpen.preserveInput': {
				'type': 'boolean',
				'description': localize('workbench.quickOpen.preserveInput', "Controls whether the last typed input to Quick Open should be restored when opening it the next time."),
				'default': false
			},
			'workbench.settings.openDefaultSettings': {
				'type': 'boolean',
				'description': localize('openDefaultSettings', "Controls whether opening settings also opens an editor showing all default settings."),
				'default': false
			},
			'workbench.settings.useSplitJSON': {
				'type': 'boolean',
				'markdownDescription': localize('useSplitJSON', "Controls whether to use the split JSON editor when editing settings as JSON."),
				'default': false
			},
			'workbench.settings.openDefaultKeybindings': {
				'type': 'boolean',
				'description': localize('openDefaultKeybindings', "Controls whether opening keybinding settings also opens an editor showing all default keybindings."),
				'default': false
			},
			'workbench.settings.alwaysShowAdvancedSettings': {
				'type': 'boolean',
				'description': localize('alwaysShowAdvancedSettings', "Controls whether advanced settings are always shown in the settings editor without requiring the `@tag:advanced` filter."),
				'default': product.quality !== 'stable'
			},
			'workbench.sideBar.location': {
				'type': 'string',
				'enum': ['left', 'right'],
				'default': 'left',
				'description': localize('sideBarLocation', "Controls the location of the primary side bar and activity bar. They can either show on the left or right of the workbench. The secondary side bar will show on the opposite side of the workbench.")
			},
			'workbench.panel.showLabels': {
				'type': 'boolean',
				'default': true,
				'description': localize('panelShowLabels', "Controls whether activity items in the panel title are shown as label or icon."),
			},
			'workbench.panel.defaultLocation': {
				'type': 'string',
				'enum': ['left', 'bottom', 'top', 'right'],
				'default': 'bottom',
				'description': localize('panelDefaultLocation', "Controls the default location of the panel (Terminal, Debug Console, Output, Problems) in a new workspace. It can either show at the bottom, top, right, or left of the editor area."),
			},
			'workbench.panel.opensMaximized': {
				'type': 'string',
				'enum': ['always', 'never', 'preserve'],
				'default': 'preserve',
				'description': localize('panelOpensMaximized', "Controls whether the panel opens maximized. It can either always open maximized, never open maximized, or open to the last state it was in before being closed."),
				'enumDescriptions': [
					localize('workbench.panel.opensMaximized.always', "Always maximize the panel when opening it."),
					localize('workbench.panel.opensMaximized.never', "Never maximize the panel when opening it."),
					localize('workbench.panel.opensMaximized.preserve', "Open the panel to the state that it was in, before it was closed.")
				]
			},
			'workbench.secondarySideBar.defaultVisibility': {
				'type': 'string',
				'enum': ['hidden', 'visibleInWorkspace', 'visible', 'maximizedInWorkspace', 'maximized'],
				'default': 'visibleInWorkspace',
				'description': localize('secondarySideBarDefaultVisibility', "Controls the default visibility of the secondary side bar in workspaces or empty windows that are opened for the first time."),
				'enumDescriptions': [
					localize('workbench.secondarySideBar.defaultVisibility.hidden', "The secondary side bar is hidden by default."),
					localize('workbench.secondarySideBar.defaultVisibility.visibleInWorkspace', "The secondary side bar is visible by default if a workspace is opened."),
					localize('workbench.secondarySideBar.defaultVisibility.visible', "The secondary side bar is visible by default."),
					localize('workbench.secondarySideBar.defaultVisibility.maximizedInWorkspace', "The secondary side bar is visible and maximized by default if a workspace is opened."),
					localize('workbench.secondarySideBar.defaultVisibility.maximized', "The secondary side bar is visible and maximized by default.")
				]
			},
			'workbench.secondarySideBar.showLabels': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': localize('secondarySideBarShowLabels', "Controls whether activity items in the secondary side bar title are shown as label or icon. This setting only has an effect when {0} is not set to {1}.", '`#workbench.activityBar.location#`', '`top`'),
			},
			'workbench.statusBar.visible': {
				'type': 'boolean',
				'default': true,
				'description': localize('statusBarVisibility', "Controls the visibility of the status bar at the bottom of the workbench.")
			},
			[LayoutSettings.ACTIVITY_BAR_LOCATION]: {
				'type': 'string',
				'enum': ['default', 'top', 'bottom', 'hidden'],
				'default': 'default',
				'markdownDescription': localize({ comment: ['This is the description for a setting'], key: 'activityBarLocation' }, "Controls the location of the Activity Bar relative to the Primary and Secondary Side Bars."),
				'enumDescriptions': [
					localize('workbench.activityBar.location.default', "Show the Activity Bar on the side of the Primary Side Bar and on top of the Secondary Side Bar."),
					localize('workbench.activityBar.location.top', "Show the Activity Bar on top of the Primary and Secondary Side Bars."),
					localize('workbench.activityBar.location.bottom', "Show the Activity Bar at the bottom of the Primary and Secondary Side Bars."),
					localize('workbench.activityBar.location.hide', "Hide the Activity Bar in the Primary and Secondary Side Bars.")
				],
			},
			'workbench.activityBar.iconClickBehavior': {
				'type': 'string',
				'enum': ['toggle', 'focus'],
				'default': 'toggle',
				'markdownDescription': localize({ comment: ['{0}, {1} will be a setting name rendered as a link'], key: 'activityBarIconClickBehavior' }, "Controls the behavior of clicking an Activity Bar icon in the workbench. This value is ignored when {0} is not set to {1}.", '`#workbench.activityBar.location#`', '`default`'),
				'enumDescriptions': [
					localize('workbench.activityBar.iconClickBehavior.toggle', "Hide the Primary Side Bar if the clicked item is already visible."),
					localize('workbench.activityBar.iconClickBehavior.focus', "Focus the Primary Side Bar if the clicked item is already visible.")
				]
			},
			'workbench.view.alwaysShowHeaderActions': {
				'type': 'boolean',
				'default': false,
				'description': localize('viewVisibility', "Controls the visibility of view header actions. View header actions may either be always visible, or only visible when that view is focused or hovered over.")
			},
			'workbench.view.showQuietly': {
				'type': 'object',
				'description': localize('workbench.view.showQuietly', "If an extension requests a hidden view to be shown, display a clickable status bar indicator instead."),
				'scope': ConfigurationScope.WINDOW,
				'properties': {
					'workbench.panel.output': {
						'type': 'boolean',
						'description': localize('workbench.panel.output', "Output view")
					}
				},
				'additionalProperties': false
			},
			'workbench.fontAliasing': {
				'type': 'string',
				'enum': ['default', 'antialiased', 'none', 'auto'],
				'default': 'default',
				'description':
					localize('fontAliasing', "Controls font aliasing method in the workbench."),
				'enumDescriptions': [
					localize('workbench.fontAliasing.default', "Sub-pixel font smoothing. On most non-retina displays this will give the sharpest text."),
					localize('workbench.fontAliasing.antialiased', "Smooth the font on the level of the pixel, as opposed to the subpixel. Can make the font appear lighter overall."),
					localize('workbench.fontAliasing.none', "Disables font smoothing. Text will show with jagged sharp edges."),
					localize('workbench.fontAliasing.auto', "Applies `default` or `antialiased` automatically based on the DPI of displays.")
				],
				'included': isMacintosh
			},
			'workbench.settings.editor': {
				'type': 'string',
				'enum': ['ui', 'json'],
				'enumDescriptions': [
					localize('settings.editor.ui', "Use the settings UI editor."),
					localize('settings.editor.json', "Use the JSON file editor."),
				],
				'description': localize('settings.editor.desc', "Determines which Settings editor to use by default."),
				'default': 'ui',
				'scope': ConfigurationScope.WINDOW
			},
			'workbench.settings.showAISearchToggle': {
				'type': 'boolean',
				'default': true,
				'description': localize('settings.showAISearchToggle', "Controls whether the AI search results toggle is shown in the search bar in the Settings editor after doing a search and once AI search results are available."),
			},
			'workbench.hover.delay': {
				'type': 'number',
				'description': localize('workbench.hover.delay', "Controls the delay in milliseconds after which the hover is shown for workbench items (ex. some extension provided tree view items). Already visible items may require a refresh before reflecting this setting change."),
				// Testing has indicated that on Windows and Linux 500 ms matches the native hovers most closely.
				// On Mac, the delay is 1500.
				'default': isMacintosh ? 1500 : 500,
				'minimum': 0
			},
			'workbench.reduceMotion': {
				type: 'string',
				description: localize('workbench.reduceMotion', "Controls whether the workbench should render with fewer animations."),
				'enumDescriptions': [
					localize('workbench.reduceMotion.on', "Always render with reduced motion."),
					localize('workbench.reduceMotion.off', "Do not render with reduced motion"),
					localize('workbench.reduceMotion.auto', "Render with reduced motion based on OS configuration."),
				],
				default: 'auto',
				tags: ['accessibility'],
				enum: ['on', 'off', 'auto']
			},
			'workbench.navigationControl.enabled': {
				'type': 'boolean',
				'default': true,
				'markdownDescription': isWeb ?
					localize('navigationControlEnabledWeb', "Controls whether the navigation control in the title bar is shown.") :
					localize({ key: 'navigationControlEnabled', comment: ['{0}, {1} is a placeholder for a setting identifier.'] }, "Controls whether the navigation control is shown in the custom title bar. This setting only has an effect when {0} is not set to {1}.", '`#window.customTitleBarVisibility#`', '`never`')
			},
			[LayoutSettings.LAYOUT_ACTIONS]: {
				'type': 'boolean',
				'default': true,
				'markdownDescription': isWeb ?
					localize('layoutControlEnabledWeb', "Controls whether the layout control in the title bar is shown.") :
					localize({ key: 'layoutControlEnabled', comment: ['{0}, {1} is a placeholder for a setting identifier.'] }, "Controls whether the layout control is shown in the custom title bar. This setting only has an effect when {0} is not set to {1}.", '`#window.customTitleBarVisibility#`', '`never`')
			},
			'workbench.layoutControl.type': {
				'type': 'string',
				'enum': ['menu', 'toggles', 'both'],
				'enumDescriptions': [
					localize('layoutcontrol.type.menu', "Shows a single button with a dropdown of layout options."),
					localize('layoutcontrol.type.toggles', "Shows several buttons for toggling the visibility of the panels and side bar."),
					localize('layoutcontrol.type.both', "Shows both the dropdown and toggle buttons."),
				],
				'default': 'both',
				'description': localize('layoutControlType', "Controls whether the layout control in the custom title bar is displayed as a single menu button or with multiple UI toggles."),
			},
			'workbench.tips.enabled': {
				'type': 'boolean',
				'default': true,
				'description': localize('tips.enabled', "When enabled, will show the watermark tips when no editor is open.")
			},
		}
	});

	// Window

	let windowTitleDescription = localize('windowTitle', "Controls the window title based on the current context such as the opened workspace or active editor. Variables are substituted based on the context:");
	windowTitleDescription += '\n- ' + [
		localize('activeEditorShort', "`${activeEditorShort}`: the file name (e.g. myFile.txt)."),
		localize('activeEditorMedium', "`${activeEditorMedium}`: the path of the file relative to the workspace folder (e.g. myFolder/myFileFolder/myFile.txt)."),
		localize('activeEditorLong', "`${activeEditorLong}`: the full path of the file (e.g. /Users/Development/myFolder/myFileFolder/myFile.txt)."),
		localize('activeFolderShort', "`${activeFolderShort}`: the name of the folder the file is contained in (e.g. myFileFolder)."),
		localize('activeFolderMedium', "`${activeFolderMedium}`: the path of the folder the file is contained in, relative to the workspace folder (e.g. myFolder/myFileFolder)."),
		localize('activeFolderLong', "`${activeFolderLong}`: the full path of the folder the file is contained in (e.g. /Users/Development/myFolder/myFileFolder)."),
		localize('folderName', "`${folderName}`: name of the workspace folder the file is contained in (e.g. myFolder)."),
		localize('folderPath', "`${folderPath}`: file path of the workspace folder the file is contained in (e.g. /Users/Development/myFolder)."),
		localize('rootName', "`${rootName}`: name of the workspace with optional remote name and workspace indicator if applicable (e.g. myFolder, myRemoteFolder [SSH] or myWorkspace (Workspace))."),
		localize('rootNameShort', "`${rootNameShort}`: shortened name of the workspace without suffixes (e.g. myFolder, myRemoteFolder or myWorkspace)."),
		localize('rootPath', "`${rootPath}`: file path of the opened workspace or folder (e.g. /Users/Development/myWorkspace)."),
		localize('profileName', "`${profileName}`: name of the profile in which the workspace is opened (e.g. Data Science (Profile)). Ignored if default profile is used."),
		localize('appName', "`${appName}`: e.g. VS Code."),
		localize('remoteName', "`${remoteName}`: e.g. SSH"),
		localize('dirty', "`${dirty}`: an indicator for when the active editor has unsaved changes."),
		localize('focusedView', "`${focusedView}`: the name of the view that is currently focused."),
		localize('activeRepositoryName', "`${activeRepositoryName}`: the name of the active repository (e.g. vscode)."),
		localize('activeRepositoryBranchName', "`${activeRepositoryBranchName}`: the name of the active branch in the active repository (e.g. main)."),
		localize('activeEditorState', "`${activeEditorState}`: provides information about the state of the active editor (e.g. modified). This will be appended by default when in screen reader mode with {0} enabled.", '`accessibility.windowTitleOptimized`'),
		localize('separator', "`${separator}`: a conditional separator (\" - \") that only shows when surrounded by variables with values or static text.")
	].join('\n- '); // intentionally concatenated to not produce a string that is too long for translations

	registry.registerConfiguration({
		...windowConfigurationNodeBase,
		'properties': {
			'window.title': {
				'type': 'string',
				'default': defaultWindowTitle,
				'markdownDescription': windowTitleDescription
			},
			'window.titleSeparator': {
				'type': 'string',
				'default': defaultWindowTitleSeparator,
				'markdownDescription': localize("window.titleSeparator", "Separator used by {0}.", '`#window.title#`')
			},
			[LayoutSettings.COMMAND_CENTER]: {
				type: 'boolean',
				default: true,
				markdownDescription: isWeb ?
					localize('window.commandCenterWeb', "Show command launcher together with the window title.") :
					localize({ key: 'window.commandCenter', comment: ['{0}, {1} is a placeholder for a setting identifier.'] }, "Show command launcher together with the window title. This setting only has an effect when {0} is not set to {1}.", '`#window.customTitleBarVisibility#`', '`never`')
			},
			'window.menuBarVisibility': {
				'type': 'string',
				'enum': ['classic', 'visible', 'toggle', 'hidden', 'compact'],
				'markdownEnumDescriptions': [
					localize('window.menuBarVisibility.classic', "Menu is displayed at the top of the window and only hidden in full screen mode."),
					localize('window.menuBarVisibility.visible', "Menu is always visible at the top of the window even in full screen mode."),
					isMacintosh ?
						localize('window.menuBarVisibility.toggle.mac', "Menu is hidden but can be displayed at the top of the window by executing the `Focus Application Menu` command.") :
						localize('window.menuBarVisibility.toggle', "Menu is hidden but can be displayed at the top of the window via the Alt key."),
					localize('window.menuBarVisibility.hidden', "Menu is always hidden."),
					isWeb ?
						localize('window.menuBarVisibility.compact.web', "Menu is displayed as a compact button in the side bar.") :
						localize({ key: 'window.menuBarVisibility.compact', comment: ['{0}, {1} is a placeholder for a setting identifier.'] }, "Menu is displayed as a compact button in the side bar. This value is ignored when {0} is {1} and {2} is either {3} or {4}.", '`#window.titleBarStyle#`', '`native`', '`#window.menuStyle#`', '`native`', '`inherit`')
				],
				'default': isWeb ? 'compact' : 'classic',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': isMacintosh ?
					localize('menuBarVisibility.mac', "Control the visibility of the menu bar. A setting of 'toggle' means that the menu bar is hidden and executing `Focus Application Menu` will show it. A setting of 'compact' will move the menu into the side bar.") :
					localize('menuBarVisibility', "Control the visibility of the menu bar. A setting of 'toggle' means that the menu bar is hidden and a single press of the Alt key will show it. A setting of 'compact' will move the menu into the side bar."),
				'included': isWindows || isLinux || isWeb
			},
			'window.enableMenuBarMnemonics': {
				'type': 'boolean',
				'default': true,
				'scope': ConfigurationScope.APPLICATION,
				'description': localize('enableMenuBarMnemonics', "Controls whether the main menus can be opened via Alt-key shortcuts. Disabling mnemonics allows to bind these Alt-key shortcuts to editor commands instead."),
				'included': isWindows || isLinux
			},
			'window.customMenuBarAltFocus': {
				'type': 'boolean',
				'default': true,
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('customMenuBarAltFocus', "Controls whether the menu bar will be focused by pressing the Alt-key. This setting has no effect on toggling the menu bar with the Alt-key."),
				'included': isWindows || isLinux
			},
			'window.openFilesInNewWindow': {
				'type': 'string',
				'enum': ['on', 'off', 'default'],
				'enumDescriptions': [
					localize('window.openFilesInNewWindow.on', "Files will open in a new window."),
					localize('window.openFilesInNewWindow.off', "Files will open in the window with the files' folder open or the last active window."),
					isMacintosh ?
						localize('window.openFilesInNewWindow.defaultMac', "Files will open in the window with the files' folder open or the last active window unless opened via the Dock or from Finder.") :
						localize('window.openFilesInNewWindow.default', "Files will open in a new window unless picked from within the application (e.g. via the File menu).")
				],
				'default': 'off',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription':
					isMacintosh ?
						localize('openFilesInNewWindowMac', "Controls whether files should open in a new window when using a command line or file dialog.\nNote that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).") :
						localize('openFilesInNewWindow', "Controls whether files should open in a new window when using a command line or file dialog.\nNote that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).")
			},
			'window.openFoldersInNewWindow': {
				'type': 'string',
				'enum': ['on', 'off', 'default'],
				'enumDescriptions': [
					localize('window.openFoldersInNewWindow.on', "Folders will open in a new window."),
					localize('window.openFoldersInNewWindow.off', "Folders will replace the last active window."),
					localize('window.openFoldersInNewWindow.default', "Folders will open in a new window unless a folder is picked from within the application (e.g. via the File menu).")
				],
				'default': 'default',
				'scope': ConfigurationScope.APPLICATION,
				'markdownDescription': localize('openFoldersInNewWindow', "Controls whether folders should open in a new window or replace the last active window.\nNote that there can still be cases where this setting is ignored (e.g. when using the `--new-window` or `--reuse-window` command line option).")
			},
			'window.confirmBeforeClose': {
				'type': 'string',
				'enum': ['always', 'keyboardOnly', 'never'],
				'enumDescriptions': [
					isWeb ?
						localize('window.confirmBeforeClose.always.web', "Always try to ask for confirmation. Note that browsers may still decide to close a tab or window without confirmation.") :
						localize('window.confirmBeforeClose.always', "Always ask for confirmation."),
					isWeb ?
						localize('window.confirmBeforeClose.keyboardOnly.web', "Only ask for confirmation if a keybinding was used to close the window. Note that detection may not be possible in some cases.") :
						localize('window.confirmBeforeClose.keyboardOnly', "Only ask for confirmation if a keybinding was used."),
					isWeb ?
						localize('window.confirmBeforeClose.never.web', "Never explicitly ask for confirmation unless data loss is imminent.") :
						localize('window.confirmBeforeClose.never', "Never explicitly ask for confirmation.")
				],
				'default': (isWeb && !isStandalone()) ? 'keyboardOnly' : 'never', // on by default in web, unless PWA, never on desktop
				'markdownDescription': isWeb ?
					localize('confirmBeforeCloseWeb', "Controls whether to show a confirmation dialog before closing the browser tab or window. Note that even if enabled, browsers may still decide to close a tab or window without confirmation and that this setting is only a hint that may not work in all cases.") :
					localize('confirmBeforeClose', "Controls whether to show a confirmation dialog before closing a window or quitting the application."),
				'scope': ConfigurationScope.APPLICATION
			}
		}
	});

	// Dynamic Window Configuration
	registerWorkbenchContribution2(DynamicWindowConfiguration.ID, DynamicWindowConfiguration, WorkbenchPhase.Eventually);

	// Problems
	registry.registerConfiguration({
		...problemsConfigurationNodeBase,
		'properties': {
			'problems.visibility': {
				'type': 'boolean',
				'default': true,
				'description': localize('problems.visibility', "Controls whether the problems are visible throughout the editor and workbench."),
			},
		}
	});

	// Zen Mode
	registry.registerConfiguration({
		'id': 'zenMode',
		'order': 9,
		'title': localize('zenModeConfigurationTitle', "Zen Mode"),
		'type': 'object',
		'properties': {
			'zenMode.fullScreen': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.fullScreen', "Controls whether turning on Zen Mode also puts the workbench into full screen mode.")
			},
			'zenMode.centerLayout': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.centerLayout', "Controls whether turning on Zen Mode also centers the layout.")
			},
			'zenMode.showTabs': {
				'type': 'string',
				'enum': ['multiple', 'single', 'none'],
				'description': localize('zenMode.showTabs', "Controls whether turning on Zen Mode should show multiple editor tabs, a single editor tab, or hide the editor title area completely."),
				'enumDescriptions': [
					localize('zenMode.showTabs.multiple', "Each editor is displayed as a tab in the editor title area."),
					localize('zenMode.showTabs.single', "The active editor is displayed as a single large tab in the editor title area."),
					localize('zenMode.showTabs.none', "The editor title area is not displayed."),
				],
				'default': 'multiple'
			},
			'zenMode.hideStatusBar': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.hideStatusBar', "Controls whether turning on Zen Mode also hides the status bar at the bottom of the workbench.")
			},
			'zenMode.hideActivityBar': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.hideActivityBar', "Controls whether turning on Zen Mode also hides the activity bar either at the left or right of the workbench.")
			},
			'zenMode.hideLineNumbers': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.hideLineNumbers', "Controls whether turning on Zen Mode also hides the editor line numbers.")
			},
			'zenMode.restore': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.restore', "Controls whether a window should restore to Zen Mode if it was exited in Zen Mode.")
			},
			'zenMode.silentNotifications': {
				'type': 'boolean',
				'default': true,
				'description': localize('zenMode.silentNotifications', "Controls whether notifications do not disturb mode should be enabled while in Zen Mode. If true, only error notifications will pop out.")
			}
		}
	});
})();

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'workbench.activityBar.visible', migrateFn: (value: unknown) => {
			const result: ConfigurationKeyValuePairs = [];
			if (value !== undefined) {
				result.push(['workbench.activityBar.visible', { value: undefined }]);
			}
			if (value === false) {
				result.push([LayoutSettings.ACTIVITY_BAR_LOCATION, { value: ActivityBarPosition.HIDDEN }]);
			}
			return result;
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: LayoutSettings.ACTIVITY_BAR_LOCATION, migrateFn: (value: unknown) => {
			const results: ConfigurationKeyValuePairs = [];
			if (value === 'side') {
				results.push([LayoutSettings.ACTIVITY_BAR_LOCATION, { value: ActivityBarPosition.DEFAULT }]);
			}
			return results;
		}
	}]);

Registry.as<IConfigurationMigrationRegistry>(Extensions.ConfigurationMigration)
	.registerConfigurationMigrations([{
		key: 'workbench.editor.doubleClickTabToToggleEditorGroupSizes', migrateFn: (value: unknown) => {
			const results: ConfigurationKeyValuePairs = [];
			if (typeof value === 'boolean') {
				value = value ? 'expand' : 'off';
				results.push(['workbench.editor.doubleClickTabToToggleEditorGroupSizes', { value }]);
			}
			return results;
		}
	}, {
		key: LayoutSettings.EDITOR_TABS_MODE, migrateFn: (value: unknown) => {
			const results: ConfigurationKeyValuePairs = [];
			if (typeof value === 'boolean') {
				value = value ? EditorTabsMode.MULTIPLE : EditorTabsMode.SINGLE;
				results.push([LayoutSettings.EDITOR_TABS_MODE, { value }]);
			}
			return results;
		}
	}, {
		key: 'workbench.editor.tabCloseButton', migrateFn: (value: unknown) => {
			const result: ConfigurationKeyValuePairs = [];
			if (value === 'left' || value === 'right') {
				result.push(['workbench.editor.tabActionLocation', { value }]);
			} else if (value === 'off') {
				result.push(['workbench.editor.tabActionCloseVisibility', { value: false }]);
			}
			return result;
		}
	}, {
		key: 'zenMode.hideTabs', migrateFn: (value: unknown) => {
			const result: ConfigurationKeyValuePairs = [['zenMode.hideTabs', { value: undefined }]];
			if (value === true) {
				result.push(['zenMode.showTabs', { value: 'single' }]);
			}
			return result;
		}
	}]);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/workbench.ts]---
Location: vscode-main/src/vs/workbench/browser/workbench.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './style.js';
import { runWhenWindowIdle } from '../../base/browser/dom.js';
import { Event, Emitter, setGlobalLeakWarningThreshold } from '../../base/common/event.js';
import { RunOnceScheduler, timeout } from '../../base/common/async.js';
import { isFirefox, isSafari, isChrome } from '../../base/browser/browser.js';
import { mark } from '../../base/common/performance.js';
import { onUnexpectedError, setUnexpectedErrorHandler } from '../../base/common/errors.js';
import { Registry } from '../../platform/registry/common/platform.js';
import { isWindows, isLinux, isWeb, isNative, isMacintosh } from '../../base/common/platform.js';
import { IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../common/contributions.js';
import { IEditorFactoryRegistry, EditorExtensions } from '../common/editor.js';
import { getSingletonServiceDescriptors } from '../../platform/instantiation/common/extensions.js';
import { Position, Parts, IWorkbenchLayoutService, positionToString } from '../services/layout/browser/layoutService.js';
import { IStorageService, WillSaveStateReason, StorageScope, StorageTarget } from '../../platform/storage/common/storage.js';
import { IConfigurationChangeEvent, IConfigurationService } from '../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../platform/instantiation/common/serviceCollection.js';
import { LifecyclePhase, ILifecycleService, WillShutdownEvent } from '../services/lifecycle/common/lifecycle.js';
import { INotificationService } from '../../platform/notification/common/notification.js';
import { NotificationService } from '../services/notification/common/notificationService.js';
import { NotificationsCenter } from './parts/notifications/notificationsCenter.js';
import { NotificationsAlerts } from './parts/notifications/notificationsAlerts.js';
import { NotificationsStatus } from './parts/notifications/notificationsStatus.js';
import { registerNotificationCommands } from './parts/notifications/notificationsCommands.js';
import { NotificationsToasts } from './parts/notifications/notificationsToasts.js';
import { setARIAContainer } from '../../base/browser/ui/aria/aria.js';
import { FontMeasurements } from '../../editor/browser/config/fontMeasurements.js';
import { createBareFontInfoFromRawSettings } from '../../editor/common/config/fontInfoFromSettings.js';
import { ILogService } from '../../platform/log/common/log.js';
import { toErrorMessage } from '../../base/common/errorMessage.js';
import { WorkbenchContextKeysHandler } from './contextkeys.js';
import { coalesce } from '../../base/common/arrays.js';
import { InstantiationService } from '../../platform/instantiation/common/instantiationService.js';
import { Layout } from './layout.js';
import { IHostService } from '../services/host/browser/host.js';
import { IDialogService } from '../../platform/dialogs/common/dialogs.js';
import { mainWindow } from '../../base/browser/window.js';
import { PixelRatio } from '../../base/browser/pixelRatio.js';
import { IHoverService, WorkbenchHoverDelegate } from '../../platform/hover/browser/hover.js';
import { setHoverDelegateFactory } from '../../base/browser/ui/hover/hoverDelegateFactory.js';
import { setBaseLayerHoverDelegate } from '../../base/browser/ui/hover/hoverDelegate2.js';
import { AccessibilityProgressSignalScheduler } from '../../platform/accessibilitySignal/browser/progressAccessibilitySignalScheduler.js';
import { setProgressAccessibilitySignalScheduler } from '../../base/browser/ui/progressbar/progressAccessibilitySignal.js';
import { AccessibleViewRegistry } from '../../platform/accessibility/browser/accessibleViewRegistry.js';
import { NotificationAccessibleView } from './parts/notifications/notificationAccessibleView.js';
import { IMarkdownRendererService } from '../../platform/markdown/browser/markdownRenderer.js';
import { EditorMarkdownCodeBlockRenderer } from '../../editor/browser/widget/markdownRenderer/browser/editorMarkdownCodeBlockRenderer.js';

export interface IWorkbenchOptions {

	/**
	 * Extra classes to be added to the workbench container.
	 */
	extraClasses?: string[];

	/**
	 * Whether to reset the workbench parts layout on startup.
	 */
	resetLayout?: boolean;
}

export class Workbench extends Layout {

	private readonly _onWillShutdown = this._register(new Emitter<WillShutdownEvent>());
	readonly onWillShutdown = this._onWillShutdown.event;

	private readonly _onDidShutdown = this._register(new Emitter<void>());
	readonly onDidShutdown = this._onDidShutdown.event;

	constructor(
		parent: HTMLElement,
		private readonly options: IWorkbenchOptions | undefined,
		private readonly serviceCollection: ServiceCollection,
		logService: ILogService
	) {
		super(parent, { resetLayout: Boolean(options?.resetLayout) });

		// Perf: measure workbench startup time
		mark('code/willStartWorkbench');

		this.registerErrorHandler(logService);
	}

	private registerErrorHandler(logService: ILogService): void {

		// Listen on unhandled rejection events
		// Note: intentionally not registered as disposable to handle
		//       errors that can occur during shutdown phase.
		mainWindow.addEventListener('unhandledrejection', (event) => {

			// See https://developer.mozilla.org/en-US/docs/Web/API/PromiseRejectionEvent
			onUnexpectedError(event.reason);

			// Prevent the printing of this event to the console
			event.preventDefault();
		});

		// Install handler for unexpected errors
		setUnexpectedErrorHandler(error => this.handleUnexpectedError(error, logService));
	}

	private previousUnexpectedError: { message: string | undefined; time: number } = { message: undefined, time: 0 };
	private handleUnexpectedError(error: unknown, logService: ILogService): void {
		const message = toErrorMessage(error, true);
		if (!message) {
			return;
		}

		const now = Date.now();
		if (message === this.previousUnexpectedError.message && now - this.previousUnexpectedError.time <= 1000) {
			return; // Return if error message identical to previous and shorter than 1 second
		}

		this.previousUnexpectedError.time = now;
		this.previousUnexpectedError.message = message;

		// Log it
		logService.error(message);
	}

	startup(): IInstantiationService {
		try {

			// Configure emitter leak warning threshold
			this._register(setGlobalLeakWarningThreshold(175));

			// Services
			const instantiationService = this.initServices(this.serviceCollection);

			instantiationService.invokeFunction(accessor => {
				const lifecycleService = accessor.get(ILifecycleService);
				const storageService = accessor.get(IStorageService);
				const configurationService = accessor.get(IConfigurationService);
				const hostService = accessor.get(IHostService);
				const hoverService = accessor.get(IHoverService);
				const dialogService = accessor.get(IDialogService);
				const notificationService = accessor.get(INotificationService) as NotificationService;
				const markdownRendererService = accessor.get(IMarkdownRendererService);

				// Set code block renderer for markdown rendering
				markdownRendererService.setDefaultCodeBlockRenderer(instantiationService.createInstance(EditorMarkdownCodeBlockRenderer));

				// Default Hover Delegate must be registered before creating any workbench/layout components
				// as these possibly will use the default hover delegate
				setHoverDelegateFactory((placement, enableInstantHover) => instantiationService.createInstance(WorkbenchHoverDelegate, placement, { instantHover: enableInstantHover }, {}));
				setBaseLayerHoverDelegate(hoverService);

				// Layout
				this.initLayout(accessor);

				// Registries
				Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).start(accessor);
				Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).start(accessor);

				// Context Keys
				this._register(instantiationService.createInstance(WorkbenchContextKeysHandler));

				// Register Listeners
				this.registerListeners(lifecycleService, storageService, configurationService, hostService, dialogService);

				// Render Workbench
				this.renderWorkbench(instantiationService, notificationService, storageService, configurationService);

				// Workbench Layout
				this.createWorkbenchLayout();

				// Layout
				this.layout();

				// Restore
				this.restore(lifecycleService);
			});

			return instantiationService;
		} catch (error) {
			onUnexpectedError(error);

			throw error; // rethrow because this is a critical issue we cannot handle properly here
		}
	}

	private initServices(serviceCollection: ServiceCollection): IInstantiationService {

		// Layout Service
		serviceCollection.set(IWorkbenchLayoutService, this);

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//
		// NOTE: Please do NOT register services here. Use `registerSingleton()`
		//       from `workbench.common.main.ts` if the service is shared between
		//       desktop and web or `workbench.desktop.main.ts` if the service
		//       is desktop only.
		//
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		// All Contributed Services
		const contributedServices = getSingletonServiceDescriptors();
		for (const [id, descriptor] of contributedServices) {
			serviceCollection.set(id, descriptor);
		}

		const instantiationService = new InstantiationService(serviceCollection, true);

		// Wrap up
		instantiationService.invokeFunction(accessor => {
			const lifecycleService = accessor.get(ILifecycleService);

			// TODO@Sandeep debt around cyclic dependencies
			const configurationService = accessor.get(IConfigurationService);
			if (configurationService && 'acquireInstantiationService' in configurationService) {
				(configurationService as { acquireInstantiationService: (instantiationService: unknown) => void }).acquireInstantiationService(instantiationService);
			}

			// Signal to lifecycle that services are set
			lifecycleService.phase = LifecyclePhase.Ready;
		});

		return instantiationService;
	}

	private registerListeners(lifecycleService: ILifecycleService, storageService: IStorageService, configurationService: IConfigurationService, hostService: IHostService, dialogService: IDialogService): void {

		// Configuration changes
		this._register(configurationService.onDidChangeConfiguration(e => this.updateFontAliasing(e, configurationService)));

		// Font Info
		if (isNative) {
			this._register(storageService.onWillSaveState(e => {
				if (e.reason === WillSaveStateReason.SHUTDOWN) {
					this.storeFontInfo(storageService);
				}
			}));
		} else {
			this._register(lifecycleService.onWillShutdown(() => this.storeFontInfo(storageService)));
		}

		// Lifecycle
		this._register(lifecycleService.onWillShutdown(event => this._onWillShutdown.fire(event)));
		this._register(lifecycleService.onDidShutdown(() => {
			this._onDidShutdown.fire();
			this.dispose();
		}));

		// In some environments we do not get enough time to persist state on shutdown.
		// In other cases, VSCode might crash, so we periodically save state to reduce
		// the chance of loosing any state.
		// The window loosing focus is a good indication that the user has stopped working
		// in that window so we pick that at a time to collect state.
		this._register(hostService.onDidChangeFocus(focus => {
			if (!focus) {
				storageService.flush();
			}
		}));

		// Dialogs showing/hiding
		this._register(dialogService.onWillShowDialog(() => this.mainContainer.classList.add('modal-dialog-visible')));
		this._register(dialogService.onDidShowDialog(() => this.mainContainer.classList.remove('modal-dialog-visible')));
	}

	private fontAliasing: 'default' | 'antialiased' | 'none' | 'auto' | undefined;
	private updateFontAliasing(e: IConfigurationChangeEvent | undefined, configurationService: IConfigurationService) {
		if (!isMacintosh) {
			return; // macOS only
		}

		if (e && !e.affectsConfiguration('workbench.fontAliasing')) {
			return;
		}

		const aliasing = configurationService.getValue<'default' | 'antialiased' | 'none' | 'auto'>('workbench.fontAliasing');
		if (this.fontAliasing === aliasing) {
			return;
		}

		this.fontAliasing = aliasing;

		// Remove all
		const fontAliasingValues: (typeof aliasing)[] = ['antialiased', 'none', 'auto'];
		this.mainContainer.classList.remove(...fontAliasingValues.map(value => `monaco-font-aliasing-${value}`));

		// Add specific
		if (fontAliasingValues.some(option => option === aliasing)) {
			this.mainContainer.classList.add(`monaco-font-aliasing-${aliasing}`);
		}
	}

	private restoreFontInfo(storageService: IStorageService, configurationService: IConfigurationService): void {
		const storedFontInfoRaw = storageService.get('editorFontInfo', StorageScope.APPLICATION);
		if (storedFontInfoRaw) {
			try {
				const storedFontInfo = JSON.parse(storedFontInfoRaw);
				if (Array.isArray(storedFontInfo)) {
					FontMeasurements.restoreFontInfo(mainWindow, storedFontInfo);
				}
			} catch (err) {
				/* ignore */
			}
		}

		FontMeasurements.readFontInfo(mainWindow, createBareFontInfoFromRawSettings(configurationService.getValue('editor'), PixelRatio.getInstance(mainWindow).value));
	}

	private storeFontInfo(storageService: IStorageService): void {
		const serializedFontInfo = FontMeasurements.serializeFontInfo(mainWindow);
		if (serializedFontInfo) {
			storageService.store('editorFontInfo', JSON.stringify(serializedFontInfo), StorageScope.APPLICATION, StorageTarget.MACHINE);
		}
	}

	private renderWorkbench(instantiationService: IInstantiationService, notificationService: NotificationService, storageService: IStorageService, configurationService: IConfigurationService): void {

		// ARIA & Signals
		setARIAContainer(this.mainContainer);
		setProgressAccessibilitySignalScheduler((msDelayTime: number, msLoopTime?: number) => instantiationService.createInstance(AccessibilityProgressSignalScheduler, msDelayTime, msLoopTime));

		// State specific classes
		const platformClass = isWindows ? 'windows' : isLinux ? 'linux' : 'mac';
		const workbenchClasses = coalesce([
			'monaco-workbench',
			platformClass,
			isWeb ? 'web' : undefined,
			isChrome ? 'chromium' : isFirefox ? 'firefox' : isSafari ? 'safari' : undefined,
			...this.getLayoutClasses(),
			...(this.options?.extraClasses ? this.options.extraClasses : [])
		]);

		this.mainContainer.classList.add(...workbenchClasses);

		// Apply font aliasing
		this.updateFontAliasing(undefined, configurationService);

		// Warm up font cache information before building up too many dom elements
		this.restoreFontInfo(storageService, configurationService);

		// Create Parts
		for (const { id, role, classes, options } of [
			{ id: Parts.TITLEBAR_PART, role: 'none', classes: ['titlebar'] },
			{ id: Parts.BANNER_PART, role: 'banner', classes: ['banner'] },
			{ id: Parts.ACTIVITYBAR_PART, role: 'none', classes: ['activitybar', this.getSideBarPosition() === Position.LEFT ? 'left' : 'right'] }, // Use role 'none' for some parts to make screen readers less chatty #114892
			{ id: Parts.SIDEBAR_PART, role: 'none', classes: ['sidebar', this.getSideBarPosition() === Position.LEFT ? 'left' : 'right'] },
			{ id: Parts.EDITOR_PART, role: 'main', classes: ['editor'], options: { restorePreviousState: this.willRestoreEditors() } },
			{ id: Parts.PANEL_PART, role: 'none', classes: ['panel', 'basepanel', positionToString(this.getPanelPosition())] },
			{ id: Parts.AUXILIARYBAR_PART, role: 'none', classes: ['auxiliarybar', 'basepanel', this.getSideBarPosition() === Position.LEFT ? 'right' : 'left'] },
			{ id: Parts.STATUSBAR_PART, role: 'status', classes: ['statusbar'] }
		]) {
			const partContainer = this.createPart(id, role, classes);

			mark(`code/willCreatePart/${id}`);
			this.getPart(id).create(partContainer, options);
			mark(`code/didCreatePart/${id}`);
		}

		// Notification Handlers
		this.createNotificationsHandlers(instantiationService, notificationService);

		// Add Workbench to DOM
		this.parent.appendChild(this.mainContainer);
	}

	private createPart(id: string, role: string, classes: string[]): HTMLElement {
		const part = document.createElement(role === 'status' ? 'footer' /* Use footer element for status bar #98376 */ : 'div');
		part.classList.add('part', ...classes);
		part.id = id;
		part.setAttribute('role', role);
		if (role === 'status') {
			part.setAttribute('aria-live', 'off');
		}

		return part;
	}

	private createNotificationsHandlers(instantiationService: IInstantiationService, notificationService: NotificationService): void {

		// Instantiate Notification components
		const notificationsCenter = this._register(instantiationService.createInstance(NotificationsCenter, this.mainContainer, notificationService.model));
		const notificationsToasts = this._register(instantiationService.createInstance(NotificationsToasts, this.mainContainer, notificationService.model));
		this._register(instantiationService.createInstance(NotificationsAlerts, notificationService.model));
		const notificationsStatus = instantiationService.createInstance(NotificationsStatus, notificationService.model);

		// Visibility
		this._register(notificationsCenter.onDidChangeVisibility(() => {
			notificationsStatus.update(notificationsCenter.isVisible, notificationsToasts.isVisible);
			notificationsToasts.update(notificationsCenter.isVisible);
		}));

		this._register(notificationsToasts.onDidChangeVisibility(() => {
			notificationsStatus.update(notificationsCenter.isVisible, notificationsToasts.isVisible);
		}));

		// Register Commands
		registerNotificationCommands(notificationsCenter, notificationsToasts, notificationService.model);

		// Register notification accessible view
		AccessibleViewRegistry.register(new NotificationAccessibleView());

		// Register with Layout
		this.registerNotifications({
			onDidChangeNotificationsVisibility: Event.map(Event.any(notificationsToasts.onDidChangeVisibility, notificationsCenter.onDidChangeVisibility), () => notificationsToasts.isVisible || notificationsCenter.isVisible)
		});
	}

	private restore(lifecycleService: ILifecycleService): void {

		// Ask each part to restore
		try {
			this.restoreParts();
		} catch (error) {
			onUnexpectedError(error);
		}

		// Transition into restored phase after layout has restored
		// but do not wait indefinitely on this to account for slow
		// editors restoring. Since the workbench is fully functional
		// even when the visible editors have not resolved, we still
		// want contributions on the `Restored` phase to work before
		// slow editors have resolved. But we also do not want fast
		// editors to resolve slow when too many contributions get
		// instantiated, so we find a middle ground solution via
		// `Promise.race`
		this.whenReady.finally(() =>
			Promise.race([
				this.whenRestored,
				timeout(2000)
			]).finally(() => {

				// Update perf marks only when the layout is fully
				// restored. We want the time it takes to restore
				// editors to be included in these numbers

				function markDidStartWorkbench() {
					mark('code/didStartWorkbench');
					performance.measure('perf: workbench create & restore', 'code/didLoadWorkbenchMain', 'code/didStartWorkbench');
				}

				if (this.isRestored()) {
					markDidStartWorkbench();
				} else {
					this.whenRestored.finally(() => markDidStartWorkbench());
				}

				// Set lifecycle phase to `Restored`
				lifecycleService.phase = LifecyclePhase.Restored;

				// Set lifecycle phase to `Eventually` after a short delay and when idle (min 2.5sec, max 5sec)
				const eventuallyPhaseScheduler = this._register(new RunOnceScheduler(() => {
					this._register(runWhenWindowIdle(mainWindow, () => lifecycleService.phase = LifecyclePhase.Eventually, 2500));
				}, 2500));
				eventuallyPhaseScheduler.schedule();
			})
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/developerActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/developerActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/actions.css';

import { localize, localize2 } from '../../../nls.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { DomEmitter } from '../../../base/browser/event.js';
import { Color } from '../../../base/common/color.js';
import { Emitter, Event } from '../../../base/common/event.js';
import { IDisposable, toDisposable, dispose, DisposableStore, setDisposableTracker, DisposableTracker, DisposableInfo } from '../../../base/common/lifecycle.js';
import { getDomNodePagePosition, append, $, getActiveDocument, onDidRegisterWindow, getWindows } from '../../../base/browser/dom.js';
import { createCSSRule, createStyleSheet } from '../../../base/browser/domStylesheets.js';
import { IConfigurationService } from '../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { Context } from '../../../platform/contextkey/browser/contextKeyService.js';
import { StandardKeyboardEvent } from '../../../base/browser/keyboardEvent.js';
import { RunOnceScheduler } from '../../../base/common/async.js';
import { ILayoutService } from '../../../platform/layout/browser/layoutService.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { registerAction2, Action2, MenuRegistry } from '../../../platform/actions/common/actions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../platform/storage/common/storage.js';
import { clamp } from '../../../base/common/numbers.js';
import { KeyCode } from '../../../base/common/keyCodes.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IWorkingCopyService } from '../../services/workingCopy/common/workingCopyService.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { IWorkingCopyBackupService } from '../../services/workingCopy/common/workingCopyBackup.js';
import { ResolutionResult, ResultKind } from '../../../platform/keybinding/common/keybindingResolver.js';
import { IDialogService } from '../../../platform/dialogs/common/dialogs.js';
import { IOutputService } from '../../services/output/common/output.js';
import { windowLogId } from '../../services/log/common/logConstants.js';
import { ByteSize } from '../../../platform/files/common/files.js';
import { IQuickInputService, IQuickPickItem } from '../../../platform/quickinput/common/quickInput.js';
import { IUserDataProfileService } from '../../services/userDataProfile/common/userDataProfile.js';
import { IEditorService } from '../../services/editor/common/editorService.js';
import product from '../../../platform/product/common/product.js';
import { CommandsRegistry } from '../../../platform/commands/common/commands.js';
import { IEnvironmentService } from '../../../platform/environment/common/environment.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { IDefaultAccountService } from '../../../platform/defaultAccount/common/defaultAccount.js';
import { IAuthenticationService } from '../../services/authentication/common/authentication.js';
import { IAuthenticationAccessService } from '../../services/authentication/browser/authenticationAccessService.js';
import { IPolicyService } from '../../../platform/policy/common/policy.js';

class InspectContextKeysAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.inspectContextKeys',
			title: localize2('inspect context keys', 'Inspect Context Keys'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const contextKeyService = accessor.get(IContextKeyService);

		const disposables = new DisposableStore();

		const stylesheet = createStyleSheet(undefined, undefined, disposables);
		createCSSRule('*', 'cursor: crosshair !important;', stylesheet);

		const hoverFeedback = document.createElement('div');
		const activeDocument = getActiveDocument();
		activeDocument.body.appendChild(hoverFeedback);
		disposables.add(toDisposable(() => hoverFeedback.remove()));

		hoverFeedback.style.position = 'absolute';
		hoverFeedback.style.pointerEvents = 'none';
		hoverFeedback.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
		hoverFeedback.style.zIndex = '1000';

		const onMouseMove = disposables.add(new DomEmitter(activeDocument, 'mousemove', true));
		disposables.add(onMouseMove.event(e => {
			const target = e.target as HTMLElement;
			const position = getDomNodePagePosition(target);

			hoverFeedback.style.top = `${position.top}px`;
			hoverFeedback.style.left = `${position.left}px`;
			hoverFeedback.style.width = `${position.width}px`;
			hoverFeedback.style.height = `${position.height}px`;
		}));

		const onMouseDown = disposables.add(new DomEmitter(activeDocument, 'mousedown', true));
		Event.once(onMouseDown.event)(e => { e.preventDefault(); e.stopPropagation(); }, null, disposables);

		const onMouseUp = disposables.add(new DomEmitter(activeDocument, 'mouseup', true));
		Event.once(onMouseUp.event)(e => {
			e.preventDefault();
			e.stopPropagation();

			const context = contextKeyService.getContext(e.target as HTMLElement) as Context;
			console.log(context.collectAllValues());

			dispose(disposables);
		}, null, disposables);
	}
}

interface IScreencastKeyboardOptions {
	readonly showKeys?: boolean;
	readonly showKeybindings?: boolean;
	readonly showCommands?: boolean;
	readonly showCommandGroups?: boolean;
	readonly showSingleEditorCursorMoves?: boolean;
}

class ToggleScreencastModeAction extends Action2 {

	static disposable: IDisposable | undefined;

	constructor() {
		super({
			id: 'workbench.action.toggleScreencastMode',
			title: localize2('toggle screencast mode', 'Toggle Screencast Mode'),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		if (ToggleScreencastModeAction.disposable) {
			ToggleScreencastModeAction.disposable.dispose();
			ToggleScreencastModeAction.disposable = undefined;
			return;
		}

		const layoutService = accessor.get(ILayoutService);
		const configurationService = accessor.get(IConfigurationService);
		const keybindingService = accessor.get(IKeybindingService);

		const disposables = new DisposableStore();

		const container = layoutService.activeContainer;

		const mouseMarker = append(container, $('.screencast-mouse'));
		disposables.add(toDisposable(() => mouseMarker.remove()));

		const keyboardMarker = append(container, $('.screencast-keyboard'));
		disposables.add(toDisposable(() => keyboardMarker.remove()));

		const onMouseDown = disposables.add(new Emitter<MouseEvent>());
		const onMouseUp = disposables.add(new Emitter<MouseEvent>());
		const onMouseMove = disposables.add(new Emitter<MouseEvent>());

		function registerContainerListeners(container: HTMLElement, windowDisposables: DisposableStore): void {
			const listeners = new DisposableStore();

			listeners.add(listeners.add(new DomEmitter(container, 'mousedown', true)).event(e => onMouseDown.fire(e)));
			listeners.add(listeners.add(new DomEmitter(container, 'mouseup', true)).event(e => onMouseUp.fire(e)));
			listeners.add(listeners.add(new DomEmitter(container, 'mousemove', true)).event(e => onMouseMove.fire(e)));

			windowDisposables.add(listeners);
			disposables.add(toDisposable(() => windowDisposables.delete(listeners)));

			disposables.add(listeners);
		}

		for (const { window, disposables } of getWindows()) {
			registerContainerListeners(layoutService.getContainer(window), disposables);
		}

		disposables.add(onDidRegisterWindow(({ window, disposables }) => registerContainerListeners(layoutService.getContainer(window), disposables)));

		disposables.add(layoutService.onDidChangeActiveContainer(() => {
			layoutService.activeContainer.appendChild(mouseMarker);
			layoutService.activeContainer.appendChild(keyboardMarker);
		}));

		const updateMouseIndicatorColor = () => {
			mouseMarker.style.borderColor = Color.fromHex(configurationService.getValue<string>('screencastMode.mouseIndicatorColor')).toString();
		};

		let mouseIndicatorSize: number;
		const updateMouseIndicatorSize = () => {
			mouseIndicatorSize = clamp(configurationService.getValue<number>('screencastMode.mouseIndicatorSize') || 20, 20, 100);

			mouseMarker.style.height = `${mouseIndicatorSize}px`;
			mouseMarker.style.width = `${mouseIndicatorSize}px`;
		};

		updateMouseIndicatorColor();
		updateMouseIndicatorSize();

		disposables.add(onMouseDown.event(e => {
			mouseMarker.style.top = `${e.clientY - mouseIndicatorSize / 2}px`;
			mouseMarker.style.left = `${e.clientX - mouseIndicatorSize / 2}px`;
			mouseMarker.style.display = 'block';
			mouseMarker.style.transform = `scale(${1})`;
			mouseMarker.style.transition = 'transform 0.1s';

			const mouseMoveListener = onMouseMove.event(e => {
				mouseMarker.style.top = `${e.clientY - mouseIndicatorSize / 2}px`;
				mouseMarker.style.left = `${e.clientX - mouseIndicatorSize / 2}px`;
				mouseMarker.style.transform = `scale(${.8})`;
			});

			Event.once(onMouseUp.event)(() => {
				mouseMarker.style.display = 'none';
				mouseMoveListener.dispose();
			});
		}));

		const updateKeyboardFontSize = () => {
			keyboardMarker.style.fontSize = `${clamp(configurationService.getValue<number>('screencastMode.fontSize') || 56, 20, 100)}px`;
		};

		const updateKeyboardMarker = () => {
			keyboardMarker.style.bottom = `${clamp(configurationService.getValue<number>('screencastMode.verticalOffset') || 0, 0, 90)}%`;
		};

		let keyboardMarkerTimeout!: number;
		const updateKeyboardMarkerTimeout = () => {
			keyboardMarkerTimeout = clamp(configurationService.getValue<number>('screencastMode.keyboardOverlayTimeout') || 800, 500, 5000);
		};

		updateKeyboardFontSize();
		updateKeyboardMarker();
		updateKeyboardMarkerTimeout();

		disposables.add(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('screencastMode.verticalOffset')) {
				updateKeyboardMarker();
			}

			if (e.affectsConfiguration('screencastMode.fontSize')) {
				updateKeyboardFontSize();
			}

			if (e.affectsConfiguration('screencastMode.keyboardOverlayTimeout')) {
				updateKeyboardMarkerTimeout();
			}

			if (e.affectsConfiguration('screencastMode.mouseIndicatorColor')) {
				updateMouseIndicatorColor();
			}

			if (e.affectsConfiguration('screencastMode.mouseIndicatorSize')) {
				updateMouseIndicatorSize();
			}
		}));

		const onKeyDown = disposables.add(new Emitter<KeyboardEvent>());
		const onCompositionStart = disposables.add(new Emitter<CompositionEvent>());
		const onCompositionUpdate = disposables.add(new Emitter<CompositionEvent>());
		const onCompositionEnd = disposables.add(new Emitter<CompositionEvent>());

		function registerWindowListeners(window: Window, windowDisposables: DisposableStore): void {
			const listeners = new DisposableStore();

			listeners.add(listeners.add(new DomEmitter(window, 'keydown', true)).event(e => onKeyDown.fire(e)));
			listeners.add(listeners.add(new DomEmitter(window, 'compositionstart', true)).event(e => onCompositionStart.fire(e)));
			listeners.add(listeners.add(new DomEmitter(window, 'compositionupdate', true)).event(e => onCompositionUpdate.fire(e)));
			listeners.add(listeners.add(new DomEmitter(window, 'compositionend', true)).event(e => onCompositionEnd.fire(e)));

			windowDisposables.add(listeners);
			disposables.add(toDisposable(() => windowDisposables.delete(listeners)));

			disposables.add(listeners);
		}

		for (const { window, disposables } of getWindows()) {
			registerWindowListeners(window, disposables);
		}

		disposables.add(onDidRegisterWindow(({ window, disposables }) => registerWindowListeners(window, disposables)));

		let length = 0;
		let composing: Element | undefined = undefined;
		let imeBackSpace = false;

		const clearKeyboardScheduler = disposables.add(new RunOnceScheduler(() => {
			keyboardMarker.textContent = '';
			composing = undefined;
			length = 0;
		}, keyboardMarkerTimeout));

		disposables.add(onCompositionStart.event(e => {
			imeBackSpace = true;
		}));

		disposables.add(onCompositionUpdate.event(e => {
			if (e.data && imeBackSpace) {
				if (length > 20) {
					keyboardMarker.innerText = '';
					length = 0;
				}
				composing = composing ?? append(keyboardMarker, $('span.key'));
				composing.textContent = e.data;
			} else if (imeBackSpace) {
				keyboardMarker.innerText = '';
				append(keyboardMarker, $('span.key', {}, `Backspace`));
			}
			clearKeyboardScheduler.schedule();
		}));

		disposables.add(onCompositionEnd.event(e => {
			composing = undefined;
			length++;
		}));

		disposables.add(onKeyDown.event(e => {
			if (e.key === 'Process' || /[\uac00-\ud787\u3131-\u314e\u314f-\u3163\u3041-\u3094\u30a1-\u30f4\u30fc\u3005\u3006\u3024\u4e00-\u9fa5]/u.test(e.key)) {
				if (e.code === 'Backspace') {
					imeBackSpace = true;
				} else if (!e.code.includes('Key')) {
					composing = undefined;
					imeBackSpace = false;
				} else {
					imeBackSpace = true;
				}
				clearKeyboardScheduler.schedule();
				return;
			}

			if (e.isComposing) {
				return;
			}

			const options = configurationService.getValue<IScreencastKeyboardOptions>('screencastMode.keyboardOptions');
			const event = new StandardKeyboardEvent(e);
			const shortcut = keybindingService.softDispatch(event, event.target);

			// Hide the single arrow key pressed
			if (shortcut.kind === ResultKind.KbFound && shortcut.commandId && !(options.showSingleEditorCursorMoves ?? true) && (
				['cursorLeft', 'cursorRight', 'cursorUp', 'cursorDown'].includes(shortcut.commandId))
			) {
				return;
			}

			if (
				event.ctrlKey || event.altKey || event.metaKey || event.shiftKey
				|| length > 20
				|| event.keyCode === KeyCode.Backspace || event.keyCode === KeyCode.Escape
				|| event.keyCode === KeyCode.UpArrow || event.keyCode === KeyCode.DownArrow
				|| event.keyCode === KeyCode.LeftArrow || event.keyCode === KeyCode.RightArrow
			) {
				keyboardMarker.innerText = '';
				length = 0;
			}

			const keybinding = keybindingService.resolveKeyboardEvent(event);
			const commandDetails = (this._isKbFound(shortcut) && shortcut.commandId) ? this.getCommandDetails(shortcut.commandId) : undefined;

			let commandAndGroupLabel = commandDetails?.title;
			let keyLabel: string | undefined | null = keybinding.getLabel();

			if (commandDetails) {
				if ((options.showCommandGroups ?? false) && commandDetails.category) {
					commandAndGroupLabel = `${commandDetails.category}: ${commandAndGroupLabel} `;
				}

				if (this._isKbFound(shortcut) && shortcut.commandId) {
					const keybindings = keybindingService.lookupKeybindings(shortcut.commandId)
						.filter(k => k.getLabel()?.endsWith(keyLabel ?? ''));

					if (keybindings.length > 0) {
						keyLabel = keybindings[keybindings.length - 1].getLabel();
					}
				}
			}

			if ((options.showCommands ?? true) && commandAndGroupLabel) {
				append(keyboardMarker, $('span.title', {}, `${commandAndGroupLabel} `));
			}

			if ((options.showKeys ?? true) || ((options.showKeybindings ?? true) && this._isKbFound(shortcut))) {
				// Fix label for arrow keys
				keyLabel = keyLabel?.replace('UpArrow', '↑')
					?.replace('DownArrow', '↓')
					?.replace('LeftArrow', '←')
					?.replace('RightArrow', '→');

				append(keyboardMarker, $('span.key', {}, keyLabel ?? ''));
			}

			length++;
			clearKeyboardScheduler.schedule();
		}));

		ToggleScreencastModeAction.disposable = disposables;
	}

	private _isKbFound(resolutionResult: ResolutionResult): resolutionResult is { kind: ResultKind.KbFound; commandId: string | null; commandArgs: unknown; isBubble: boolean } {
		return resolutionResult.kind === ResultKind.KbFound;
	}

	private getCommandDetails(commandId: string): { title: string; category?: string } | undefined {
		const fromMenuRegistry = MenuRegistry.getCommand(commandId);

		if (fromMenuRegistry) {
			return {
				title: typeof fromMenuRegistry.title === 'string' ? fromMenuRegistry.title : fromMenuRegistry.title.value,
				category: fromMenuRegistry.category ? (typeof fromMenuRegistry.category === 'string' ? fromMenuRegistry.category : fromMenuRegistry.category.value) : undefined
			};
		}

		const fromCommandsRegistry = CommandsRegistry.getCommand(commandId);

		if (fromCommandsRegistry?.metadata?.description) {
			return { title: typeof fromCommandsRegistry.metadata.description === 'string' ? fromCommandsRegistry.metadata.description : fromCommandsRegistry.metadata.description.value };
		}

		return undefined;
	}
}

class LogStorageAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.logStorage',
			title: localize2({ key: 'logStorage', comment: ['A developer only action to log the contents of the storage for the current window.'] }, "Log Storage Database Contents"),
			category: Categories.Developer,
			f1: true
		});
	}

	run(accessor: ServicesAccessor): void {
		const storageService = accessor.get(IStorageService);
		const dialogService = accessor.get(IDialogService);

		storageService.log();

		dialogService.info(localize('storageLogDialogMessage', "The storage database contents have been logged to the developer tools."), localize('storageLogDialogDetails', "Open developer tools from the menu and select the Console tab."));
	}
}

class LogWorkingCopiesAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.logWorkingCopies',
			title: localize2({ key: 'logWorkingCopies', comment: ['A developer only action to log the working copies that exist.'] }, "Log Working Copies"),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const workingCopyService = accessor.get(IWorkingCopyService);
		const workingCopyBackupService = accessor.get(IWorkingCopyBackupService);
		const logService = accessor.get(ILogService);
		const outputService = accessor.get(IOutputService);

		const backups = await workingCopyBackupService.getBackups();

		const msg = [
			``,
			`[Working Copies]`,
			...(workingCopyService.workingCopies.length > 0) ?
				workingCopyService.workingCopies.map(workingCopy => `${workingCopy.isDirty() ? '● ' : ''}${workingCopy.resource.toString(true)} (typeId: ${workingCopy.typeId || '<no typeId>'})`) :
				['<none>'],
			``,
			`[Backups]`,
			...(backups.length > 0) ?
				backups.map(backup => `${backup.resource.toString(true)} (typeId: ${backup.typeId || '<no typeId>'})`) :
				['<none>'],
		];

		logService.info(msg.join('\n'));

		outputService.showChannel(windowLogId, true);
	}
}

class RemoveLargeStorageEntriesAction extends Action2 {

	private static SIZE_THRESHOLD = 1024 * 16; // 16kb

	constructor() {
		super({
			id: 'workbench.action.removeLargeStorageDatabaseEntries',
			title: localize2('removeLargeStorageDatabaseEntries', 'Remove Large Storage Database Entries...'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const storageService = accessor.get(IStorageService);
		const quickInputService = accessor.get(IQuickInputService);
		const userDataProfileService = accessor.get(IUserDataProfileService);
		const dialogService = accessor.get(IDialogService);
		const environmentService = accessor.get(IEnvironmentService);

		interface IStorageItem extends IQuickPickItem {
			readonly key: string;
			readonly scope: StorageScope;
			readonly target: StorageTarget;
			readonly size: number;
		}

		const items: IStorageItem[] = [];

		for (const scope of [StorageScope.APPLICATION, StorageScope.PROFILE, StorageScope.WORKSPACE]) {
			if (scope === StorageScope.PROFILE && userDataProfileService.currentProfile.isDefault) {
				continue; // avoid duplicates
			}

			for (const target of [StorageTarget.MACHINE, StorageTarget.USER]) {
				for (const key of storageService.keys(scope, target)) {
					const value = storageService.get(key, scope);
					if (value && (!environmentService.isBuilt /* show all keys in dev */ || value.length > RemoveLargeStorageEntriesAction.SIZE_THRESHOLD)) {
						items.push({
							key,
							scope,
							target,
							size: value.length,
							label: key,
							description: ByteSize.formatSize(value.length),
							detail: localize('largeStorageItemDetail', "Scope: {0}, Target: {1}", scope === StorageScope.APPLICATION ? localize('global', "Global") : scope === StorageScope.PROFILE ? localize('profile', "Profile") : localize('workspace', "Workspace"), target === StorageTarget.MACHINE ? localize('machine', "Machine") : localize('user', "User")),
						});
					}
				}
			}
		}

		items.sort((itemA, itemB) => itemB.size - itemA.size);

		const selectedItems = await new Promise<readonly IStorageItem[]>(resolve => {
			const disposables = new DisposableStore();

			const picker = disposables.add(quickInputService.createQuickPick<IStorageItem>());
			picker.items = items;
			picker.canSelectMany = true;
			picker.ok = false;
			picker.customButton = true;
			picker.hideCheckAll = true;
			picker.customLabel = localize('removeLargeStorageEntriesPickerButton', "Remove");
			picker.placeholder = localize('removeLargeStorageEntriesPickerPlaceholder', "Select large entries to remove from storage");

			if (items.length === 0) {
				picker.description = localize('removeLargeStorageEntriesPickerDescriptionNoEntries', "There are no large storage entries to remove.");
			}

			picker.show();

			disposables.add(picker.onDidCustom(() => {
				resolve(picker.selectedItems);
				picker.hide();
			}));

			disposables.add(picker.onDidHide(() => disposables.dispose()));
		});

		if (selectedItems.length === 0) {
			return;
		}

		const { confirmed } = await dialogService.confirm({
			type: 'warning',
			message: localize('removeLargeStorageEntriesConfirmRemove', "Do you want to remove the selected storage entries from the database?"),
			detail: localize('removeLargeStorageEntriesConfirmRemoveDetail', "{0}\n\nThis action is irreversible and may result in data loss!", selectedItems.map(item => item.label).join('\n')),
			primaryButton: localize({ key: 'removeLargeStorageEntriesButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Remove")
		});

		if (!confirmed) {
			return;
		}

		const scopesToOptimize = new Set<StorageScope>();
		for (const item of selectedItems) {
			storageService.remove(item.key, item.scope);
			scopesToOptimize.add(item.scope);
		}

		for (const scope of scopesToOptimize) {
			await storageService.optimize(scope);
		}
	}
}

let tracker: DisposableTracker | undefined = undefined;
let trackedDisposables = new Set<IDisposable>();

const DisposablesSnapshotStateContext = new RawContextKey<'started' | 'pending' | 'stopped'>('dirtyWorkingCopies', 'stopped');

class StartTrackDisposables extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.startTrackDisposables',
			title: localize2('startTrackDisposables', 'Start Tracking Disposables'),
			category: Categories.Developer,
			f1: true,
			precondition: ContextKeyExpr.and(DisposablesSnapshotStateContext.isEqualTo('pending').negate(), DisposablesSnapshotStateContext.isEqualTo('started').negate())
		});
	}

	run(accessor: ServicesAccessor): void {
		const disposablesSnapshotStateContext = DisposablesSnapshotStateContext.bindTo(accessor.get(IContextKeyService));
		disposablesSnapshotStateContext.set('started');

		trackedDisposables.clear();

		tracker = new DisposableTracker();
		setDisposableTracker(tracker);
	}
}

class SnapshotTrackedDisposables extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.snapshotTrackedDisposables',
			title: localize2('snapshotTrackedDisposables', 'Snapshot Tracked Disposables'),
			category: Categories.Developer,
			f1: true,
			precondition: DisposablesSnapshotStateContext.isEqualTo('started')
		});
	}

	run(accessor: ServicesAccessor): void {
		const disposablesSnapshotStateContext = DisposablesSnapshotStateContext.bindTo(accessor.get(IContextKeyService));
		disposablesSnapshotStateContext.set('pending');

		trackedDisposables = new Set(tracker?.computeLeakingDisposables(1000)?.leaks.map(disposable => disposable.value));
	}
}

class StopTrackDisposables extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.stopTrackDisposables',
			title: localize2('stopTrackDisposables', 'Stop Tracking Disposables'),
			category: Categories.Developer,
			f1: true,
			precondition: DisposablesSnapshotStateContext.isEqualTo('pending')
		});
	}

	run(accessor: ServicesAccessor): void {
		const editorService = accessor.get(IEditorService);

		const disposablesSnapshotStateContext = DisposablesSnapshotStateContext.bindTo(accessor.get(IContextKeyService));
		disposablesSnapshotStateContext.set('stopped');

		if (tracker) {
			const disposableLeaks = new Set<DisposableInfo>();

			for (const disposable of new Set(tracker.computeLeakingDisposables(1000)?.leaks) ?? []) {
				if (trackedDisposables.has(disposable.value)) {
					disposableLeaks.add(disposable);
				}
			}

			const leaks = tracker.computeLeakingDisposables(1000, Array.from(disposableLeaks));
			if (leaks) {
				editorService.openEditor({ resource: undefined, contents: leaks.details });
			}
		}

		setDisposableTracker(null);
		tracker = undefined;
		trackedDisposables.clear();
	}
}

class PolicyDiagnosticsAction extends Action2 {

	constructor() {
		super({
			id: 'workbench.action.showPolicyDiagnostics',
			title: localize2('policyDiagnostics', 'Policy Diagnostics'),
			category: Categories.Developer,
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const configurationService = accessor.get(IConfigurationService);
		const productService = accessor.get(IProductService);
		const defaultAccountService = accessor.get(IDefaultAccountService);
		const authenticationService = accessor.get(IAuthenticationService);
		const authenticationAccessService = accessor.get(IAuthenticationAccessService);
		const policyService = accessor.get(IPolicyService);

		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);

		let content = '# VS Code Policy Diagnostics\n\n';
		content += '*WARNING: This file may contain sensitive information.*\n\n';
		content += '## System Information\n\n';
		content += '| Property | Value |\n';
		content += '|----------|-------|\n';
		content += `| Generated | ${new Date().toISOString()} |\n`;
		content += `| Product | ${productService.nameLong} ${productService.version} |\n`;
		content += `| Commit | ${productService.commit || 'n/a'} |\n\n`;

		// Account information
		content += '## Account Information\n\n';
		try {
			const account = await defaultAccountService.getDefaultAccount();
			const sensitiveKeys = ['sessionId', 'analytics_tracking_id'];
			if (account) {
				// Try to get username/display info from the authentication session
				let username = 'Unknown';
				let accountLabel = 'Unknown';
				try {
					const providerIds = authenticationService.getProviderIds();
					for (const providerId of providerIds) {
						const sessions = await authenticationService.getSessions(providerId);
						const matchingSession = sessions.find(session => session.id === account.sessionId);
						if (matchingSession) {
							username = matchingSession.account.id;
							accountLabel = matchingSession.account.label;
							break;
						}
					}
				} catch (error) {
					// Fallback to just session info
				}

				content += '### Default Account Summary\n\n';
				content += `**Account ID/Username**: ${username}\n\n`;
				content += `**Account Label**: ${accountLabel}\n\n`;

				content += '### Detailed Account Properties\n\n';
				content += '| Property | Value |\n';
				content += '|----------|-------|\n';

				// Iterate through all properties of the account object
				for (const [key, value] of Object.entries(account)) {
					if (value !== undefined && value !== null) {
						let displayValue: string;

						// Mask sensitive information
						if (sensitiveKeys.includes(key)) {
							displayValue = '***';
						} else if (typeof value === 'object') {
							displayValue = JSON.stringify(value);
						} else {
							displayValue = String(value);
						}

						content += `| ${key} | ${displayValue} |\n`;
					}
				}
				content += '\n';
			} else {
				content += '*No default account configured*\n\n';
			}
		} catch (error) {
			content += `*Error retrieving account information: ${error}*\n\n`;
		}

		content += '## Policy-Controlled Settings\n\n';

		const policyConfigurations = configurationRegistry.getPolicyConfigurations();
		const configurationProperties = configurationRegistry.getConfigurationProperties();
		const excludedProperties = configurationRegistry.getExcludedConfigurationProperties();

		if (policyConfigurations.size > 0) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const appliedPolicy: Array<{ name: string; key: string; property: any; inspection: any }> = [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const notAppliedPolicy: Array<{ name: string; key: string; property: any; inspection: any }> = [];

			for (const [policyName, settingKey] of policyConfigurations) {
				const property = configurationProperties[settingKey] ?? excludedProperties[settingKey];
				if (property) {
					const inspectValue = configurationService.inspect(settingKey);
					const settingInfo = {
						name: policyName,
						key: settingKey,
						property,
						inspection: inspectValue
					};

					if (inspectValue.policyValue !== undefined) {
						appliedPolicy.push(settingInfo);
					} else {
						notAppliedPolicy.push(settingInfo);
					}
				}
			}

			// Try to detect where the policy came from
			const policySourceMemo = new Map<string, string>();
			const getPolicySource = (policyName: string): string => {
				if (policySourceMemo.has(policyName)) {
					return policySourceMemo.get(policyName)!;
				}
				try {
					const policyServiceConstructorName = policyService.constructor.name;
					if (policyServiceConstructorName === 'MultiplexPolicyService') {
						// eslint-disable-next-line local/code-no-any-casts, @typescript-eslint/no-explicit-any
						const multiplexService = policyService as any;
						if (multiplexService.policyServices) {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const componentServices = multiplexService.policyServices as ReadonlyArray<any>;
							for (const service of componentServices) {
								if (service.getPolicyValue && service.getPolicyValue(policyName) !== undefined) {
									policySourceMemo.set(policyName, service.constructor.name);
									return service.constructor.name;
								}
							}
						}
					}
					return '';
				} catch {
					return 'Unknown';
				}
			};

			content += '### Applied Policy\n\n';
			appliedPolicy.sort((a, b) => getPolicySource(a.name).localeCompare(getPolicySource(b.name)) || a.name.localeCompare(b.name));
			if (appliedPolicy.length > 0) {
				content += '| Setting Key | Policy Name | Policy Source | Default Value | Current Value | Policy Value |\n';
				content += '|-------------|-------------|---------------|---------------|---------------|-------------|\n';

				for (const setting of appliedPolicy) {
					const defaultValue = JSON.stringify(setting.property.default);
					const currentValue = JSON.stringify(setting.inspection.value);
					const policyValue = JSON.stringify(setting.inspection.policyValue);
					const policySource = getPolicySource(setting.name);

					content += `| ${setting.key} | ${setting.name} | ${policySource} | \`${defaultValue}\` | \`${currentValue}\` | \`${policyValue}\` |\n`;
				}
				content += '\n';
			} else {
				content += '*No settings are currently controlled by policies*\n\n';
			}

			content += '###  Non-applied Policy\n\n';
			if (notAppliedPolicy.length > 0) {
				content += '| Setting Key | Policy Name  \n';
				content += '|-------------|-------------|\n';

				for (const setting of notAppliedPolicy) {

					content += `| ${setting.key} | ${setting.name}|\n`;
				}
				content += '\n';
			} else {
				content += '*All policy-controllable settings are currently being enforced*\n\n';
			}
		} else {
			content += '*No policy-controlled settings found*\n\n';
		}

		// Authentication diagnostics
		content += '## Authentication Information\n\n';
		try {
			const providerIds = authenticationService.getProviderIds();

			if (providerIds.length > 0) {
				content += '### Authentication Providers\n\n';
				content += '| Provider ID | Sessions | Accounts |\n';
				content += '|-------------|----------|----------|\n';

				for (const providerId of providerIds) {
					try {
						const sessions = await authenticationService.getSessions(providerId);
						const accounts = sessions.map(session => session.account);
						const uniqueAccounts = Array.from(new Set(accounts.map(account => account.label)));

						content += `| ${providerId} | ${sessions.length} | ${uniqueAccounts.join(', ') || 'None'} |\n`;
					} catch (error) {
						content += `| ${providerId} | Error | ${error} |\n`;
					}
				}
				content += '\n';

				// Detailed session information
				content += '### Detailed Session Information\n\n';
				for (const providerId of providerIds) {
					try {
						const sessions = await authenticationService.getSessions(providerId);

						if (sessions.length > 0) {
							content += `#### ${providerId}\n\n`;
							content += '| Account | Scopes | Extensions with Access |\n';
							content += '|---------|--------|------------------------|\n';

							for (const session of sessions) {
								const accountName = session.account.label;
								const scopes = session.scopes.join(', ') || 'Default';

								// Get extensions with access to this account
								try {
									const allowedExtensions = authenticationAccessService.readAllowedExtensions(providerId, accountName);
									const extensionNames = allowedExtensions
										.filter(ext => ext.allowed !== false)
										.map(ext => `${ext.name}${ext.trusted ? ' (trusted)' : ''}`)
										.join(', ') || 'None';

									content += `| ${accountName} | ${scopes} | ${extensionNames} |\n`;
								} catch (error) {
									content += `| ${accountName} | ${scopes} | Error: ${error} |\n`;
								}
							}
							content += '\n';
						}
					} catch (error) {
						content += `#### ${providerId}\n*Error retrieving sessions: ${error}*\n\n`;
					}
				}
			} else {
				content += '*No authentication providers found*\n\n';
			}
		} catch (error) {
			content += `*Error retrieving authentication information: ${error}*\n\n`;
		}

		await editorService.openEditor({
			resource: undefined,
			contents: content,
			languageId: 'markdown',
			options: { pinned: true, }
		});
	}
}

// --- Actions Registration
registerAction2(InspectContextKeysAction);
registerAction2(ToggleScreencastModeAction);
registerAction2(LogStorageAction);
registerAction2(LogWorkingCopiesAction);
registerAction2(RemoveLargeStorageEntriesAction);
registerAction2(PolicyDiagnosticsAction);
if (!product.commit) {
	registerAction2(StartTrackDisposables);
	registerAction2(SnapshotTrackedDisposables);
	registerAction2(StopTrackDisposables);
}

// --- Configuration

// Screen Cast Mode
const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'screencastMode',
	order: 9,
	title: localize('screencastModeConfigurationTitle', "Screencast Mode"),
	type: 'object',
	properties: {
		'screencastMode.verticalOffset': {
			type: 'number',
			default: 20,
			minimum: 0,
			maximum: 90,
			description: localize('screencastMode.location.verticalPosition', "Controls the vertical offset of the screencast mode overlay from the bottom as a percentage of the workbench height.")
		},
		'screencastMode.fontSize': {
			type: 'number',
			default: 56,
			minimum: 20,
			maximum: 100,
			description: localize('screencastMode.fontSize', "Controls the font size (in pixels) of the screencast mode keyboard.")
		},
		'screencastMode.keyboardOptions': {
			type: 'object',
			description: localize('screencastMode.keyboardOptions.description', "Options for customizing the keyboard overlay in screencast mode."),
			properties: {
				'showKeys': {
					type: 'boolean',
					default: true,
					description: localize('screencastMode.keyboardOptions.showKeys', "Show raw keys.")
				},
				'showKeybindings': {
					type: 'boolean',
					default: true,
					description: localize('screencastMode.keyboardOptions.showKeybindings', "Show keyboard shortcuts.")
				},
				'showCommands': {
					type: 'boolean',
					default: true,
					description: localize('screencastMode.keyboardOptions.showCommands', "Show command names.")
				},
				'showCommandGroups': {
					type: 'boolean',
					default: false,
					description: localize('screencastMode.keyboardOptions.showCommandGroups', "Show command group names, when commands are also shown.")
				},
				'showSingleEditorCursorMoves': {
					type: 'boolean',
					default: true,
					description: localize('screencastMode.keyboardOptions.showSingleEditorCursorMoves', "Show single editor cursor move commands.")
				}
			},
			default: {
				'showKeys': true,
				'showKeybindings': true,
				'showCommands': true,
				'showCommandGroups': false,
				'showSingleEditorCursorMoves': true
			},
			additionalProperties: false
		},
		'screencastMode.keyboardOverlayTimeout': {
			type: 'number',
			default: 800,
			minimum: 500,
			maximum: 5000,
			description: localize('screencastMode.keyboardOverlayTimeout', "Controls how long (in milliseconds) the keyboard overlay is shown in screencast mode.")
		},
		'screencastMode.mouseIndicatorColor': {
			type: 'string',
			format: 'color-hex',
			default: '#FF0000',
			description: localize('screencastMode.mouseIndicatorColor', "Controls the color in hex (#RGB, #RGBA, #RRGGBB or #RRGGBBAA) of the mouse indicator in screencast mode.")
		},
		'screencastMode.mouseIndicatorSize': {
			type: 'number',
			default: 20,
			minimum: 20,
			maximum: 100,
			description: localize('screencastMode.mouseIndicatorSize', "Controls the size (in pixels) of the mouse indicator in screencast mode.")
		},
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/browser/actions/helpActions.ts]---
Location: vscode-main/src/vs/workbench/browser/actions/helpActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../nls.js';
import product from '../../../platform/product/common/product.js';
import { isMacintosh, isLinux, language, isWeb } from '../../../base/common/platform.js';
import { ITelemetryService } from '../../../platform/telemetry/common/telemetry.js';
import { IOpenerService } from '../../../platform/opener/common/opener.js';
import { URI } from '../../../base/common/uri.js';
import { MenuId, Action2, registerAction2, MenuRegistry } from '../../../platform/actions/common/actions.js';
import { KeyChord, KeyMod, KeyCode } from '../../../base/common/keyCodes.js';
import { IProductService } from '../../../platform/product/common/productService.js';
import { ServicesAccessor } from '../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight } from '../../../platform/keybinding/common/keybindingsRegistry.js';
import { Categories } from '../../../platform/action/common/actionCommonCategories.js';
import { ICommandService } from '../../../platform/commands/common/commands.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';

class KeybindingsReferenceAction extends Action2 {

	static readonly ID = 'workbench.action.keybindingsReference';
	static readonly AVAILABLE = !!(isLinux ? product.keyboardShortcutsUrlLinux : isMacintosh ? product.keyboardShortcutsUrlMac : product.keyboardShortcutsUrlWin);

	constructor() {
		super({
			id: KeybindingsReferenceAction.ID,
			title: {
				...localize2('keybindingsReference', "Keyboard Shortcuts Reference"),
				mnemonicTitle: localize({ key: 'miKeyboardShortcuts', comment: ['&& denotes a mnemonic'] }, "&&Keyboard Shortcuts Reference"),
			},
			category: Categories.Help,
			f1: true,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: null,
				primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyR)
			},
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '2_reference',
				order: 1
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		const url = isLinux ? productService.keyboardShortcutsUrlLinux : isMacintosh ? productService.keyboardShortcutsUrlMac : productService.keyboardShortcutsUrlWin;
		if (url) {
			openerService.open(URI.parse(url));
		}
	}
}

class OpenIntroductoryVideosUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openVideoTutorialsUrl';
	static readonly AVAILABLE = !!product.introductoryVideosUrl;

	constructor() {
		super({
			id: OpenIntroductoryVideosUrlAction.ID,
			title: {
				...localize2('openVideoTutorialsUrl', "Video Tutorials"),
				mnemonicTitle: localize({ key: 'miVideoTutorials', comment: ['&& denotes a mnemonic'] }, "&&Video Tutorials"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '2_reference',
				order: 2
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.introductoryVideosUrl) {
			openerService.open(URI.parse(productService.introductoryVideosUrl));
		}
	}
}

class OpenTipsAndTricksUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openTipsAndTricksUrl';
	static readonly AVAILABLE = !!product.tipsAndTricksUrl;

	constructor() {
		super({
			id: OpenTipsAndTricksUrlAction.ID,
			title: {
				...localize2('openTipsAndTricksUrl', "Tips and Tricks"),
				mnemonicTitle: localize({ key: 'miTipsAndTricks', comment: ['&& denotes a mnemonic'] }, "Tips and Tri&&cks"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '2_reference',
				order: 3
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.tipsAndTricksUrl) {
			openerService.open(URI.parse(productService.tipsAndTricksUrl));
		}
	}
}

class OpenDocumentationUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openDocumentationUrl';
	static readonly AVAILABLE = !!(isWeb ? product.serverDocumentationUrl : product.documentationUrl);

	constructor() {
		super({
			id: OpenDocumentationUrlAction.ID,
			title: {
				...localize2('openDocumentationUrl', "Documentation"),
				mnemonicTitle: localize({ key: 'miDocumentation', comment: ['&& denotes a mnemonic'] }, "&&Documentation"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 3
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);
		const url = isWeb ? productService.serverDocumentationUrl : productService.documentationUrl;

		if (url) {
			openerService.open(URI.parse(url));
		}
	}
}

class OpenNewsletterSignupUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openNewsletterSignupUrl';
	static readonly AVAILABLE = !!product.newsletterSignupUrl;

	constructor() {
		super({
			id: OpenNewsletterSignupUrlAction.ID,
			title: localize2('newsletterSignup', 'Signup for the VS Code Newsletter'),
			category: Categories.Help,
			f1: true
		});
	}

	run(accessor: ServicesAccessor) {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);
		const telemetryService = accessor.get(ITelemetryService);
		openerService.open(URI.parse(`${productService.newsletterSignupUrl}?machineId=${encodeURIComponent(telemetryService.machineId)}`));
	}
}

class OpenYouTubeUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openYouTubeUrl';
	static readonly AVAILABLE = !!product.youTubeUrl;

	constructor() {
		super({
			id: OpenYouTubeUrlAction.ID,
			title: {
				...localize2('openYouTubeUrl', "Join Us on YouTube"),
				mnemonicTitle: localize({ key: 'miYouTube', comment: ['&& denotes a mnemonic'] }, "&&Join Us on YouTube"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '3_feedback',
				order: 1
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.youTubeUrl) {
			openerService.open(URI.parse(productService.youTubeUrl));
		}
	}
}

class OpenRequestFeatureUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openRequestFeatureUrl';
	static readonly AVAILABLE = !!product.requestFeatureUrl;

	constructor() {
		super({
			id: OpenRequestFeatureUrlAction.ID,
			title: {
				...localize2('openUserVoiceUrl', "Search Feature Requests"),
				mnemonicTitle: localize({ key: 'miUserVoice', comment: ['&& denotes a mnemonic'] }, "&&Search Feature Requests"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '3_feedback',
				order: 2
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.requestFeatureUrl) {
			openerService.open(URI.parse(productService.requestFeatureUrl));
		}
	}
}

class OpenLicenseUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openLicenseUrl';
	static readonly AVAILABLE = !!(isWeb ? product.serverLicense : product.licenseUrl);

	constructor() {
		super({
			id: OpenLicenseUrlAction.ID,
			title: {
				...localize2('openLicenseUrl', "View License"),
				mnemonicTitle: localize({ key: 'miLicense', comment: ['&& denotes a mnemonic'] }, "View &&License"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '4_legal',
				order: 1
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);
		const url = isWeb ? productService.serverLicenseUrl : productService.licenseUrl;

		if (url) {
			if (language) {
				const queryArgChar = url.indexOf('?') > 0 ? '&' : '?';
				openerService.open(URI.parse(`${url}${queryArgChar}lang=${language}`));
			} else {
				openerService.open(URI.parse(url));
			}
		}
	}
}

class OpenPrivacyStatementUrlAction extends Action2 {

	static readonly ID = 'workbench.action.openPrivacyStatementUrl';
	static readonly AVAILABLE = !!product.privacyStatementUrl;

	constructor() {
		super({
			id: OpenPrivacyStatementUrlAction.ID,
			title: {
				...localize2('openPrivacyStatement', "Privacy Statement"),
				mnemonicTitle: localize({ key: 'miPrivacyStatement', comment: ['&& denotes a mnemonic'] }, "Privac&&y Statement"),
			},
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '4_legal',
				order: 2
			}
		});
	}

	run(accessor: ServicesAccessor): void {
		const productService = accessor.get(IProductService);
		const openerService = accessor.get(IOpenerService);

		if (productService.privacyStatementUrl) {
			openerService.open(URI.parse(productService.privacyStatementUrl));
		}
	}
}

class GetStartedWithAccessibilityFeatures extends Action2 {

	static readonly ID = 'workbench.action.getStartedWithAccessibilityFeatures';

	constructor() {
		super({
			id: GetStartedWithAccessibilityFeatures.ID,
			title: localize2('getStartedWithAccessibilityFeatures', 'Get Started with Accessibility Features'),
			category: Categories.Help,
			f1: true,
			menu: {
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 6
			}
		});
	}
	run(accessor: ServicesAccessor): void {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand('workbench.action.openWalkthrough', 'SetupAccessibility');
	}
}

class AskVSCodeCopilot extends Action2 {
	static readonly ID = 'workbench.action.askVScode';

	constructor() {
		super({
			id: AskVSCodeCopilot.ID,
			title: localize2('askVScode', 'Ask @vscode'),
			category: Categories.Help,
			f1: true,
			precondition: ContextKeyExpr.equals('chatSetupHidden', false)
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		commandService.executeCommand('workbench.action.chat.open', { mode: 'ask', query: '@vscode ', isPartialQuery: true });
	}
}

MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
	command: {
		id: AskVSCodeCopilot.ID,
		title: localize2('askVScode', 'Ask @vscode'),
	},
	order: 7,
	group: '1_welcome',
	when: ContextKeyExpr.equals('chatSetupHidden', false)
});

// --- Actions Registration

if (KeybindingsReferenceAction.AVAILABLE) {
	registerAction2(KeybindingsReferenceAction);
}

if (OpenIntroductoryVideosUrlAction.AVAILABLE) {
	registerAction2(OpenIntroductoryVideosUrlAction);
}

if (OpenTipsAndTricksUrlAction.AVAILABLE) {
	registerAction2(OpenTipsAndTricksUrlAction);
}

if (OpenDocumentationUrlAction.AVAILABLE) {
	registerAction2(OpenDocumentationUrlAction);
}

if (OpenNewsletterSignupUrlAction.AVAILABLE) {
	registerAction2(OpenNewsletterSignupUrlAction);
}

if (OpenYouTubeUrlAction.AVAILABLE) {
	registerAction2(OpenYouTubeUrlAction);
}

if (OpenRequestFeatureUrlAction.AVAILABLE) {
	registerAction2(OpenRequestFeatureUrlAction);
}

if (OpenLicenseUrlAction.AVAILABLE) {
	registerAction2(OpenLicenseUrlAction);
}

if (OpenPrivacyStatementUrlAction.AVAILABLE) {
	registerAction2(OpenPrivacyStatementUrlAction);
}

registerAction2(GetStartedWithAccessibilityFeatures);

registerAction2(AskVSCodeCopilot);
```

--------------------------------------------------------------------------------

````
