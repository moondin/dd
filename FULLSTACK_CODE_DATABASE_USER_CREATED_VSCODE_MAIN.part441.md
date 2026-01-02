---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 441
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 441 of 552)

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

---[FILE: src/vs/workbench/contrib/remoteTunnel/electron-browser/remoteTunnel.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remoteTunnel/electron-browser/remoteTunnel.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toAction } from '../../../../base/common/actions.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { ITunnelApplicationConfig } from '../../../../base/common/product.js';
import { joinPath } from '../../../../base/common/resources.js';
import { isNumber, isObject, isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../nls.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { INativeEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator, QuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { CONFIGURATION_KEY_HOST_NAME, CONFIGURATION_KEY_PREFIX, CONFIGURATION_KEY_PREVENT_SLEEP, ConnectionInfo, INACTIVE_TUNNEL_MODE, IRemoteTunnelService, IRemoteTunnelSession, LOGGER_NAME, LOG_ID, TunnelStatus } from '../../../../platform/remoteTunnel/common/remoteTunnel.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkspaceContextService, isUntitledWorkspace } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, Extensions as WorkbenchExtensions } from '../../../common/contributions.js';
import { AuthenticationSession, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';

export const REMOTE_TUNNEL_CATEGORY = localize2('remoteTunnel.category', 'Remote Tunnels');

type CONTEXT_KEY_STATES = 'connected' | 'connecting' | 'disconnected';

export const REMOTE_TUNNEL_CONNECTION_STATE_KEY = 'remoteTunnelConnection';
export const REMOTE_TUNNEL_CONNECTION_STATE = new RawContextKey<CONTEXT_KEY_STATES>(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'disconnected');

const REMOTE_TUNNEL_USED_STORAGE_KEY = 'remoteTunnelServiceUsed';
const REMOTE_TUNNEL_PROMPTED_PREVIEW_STORAGE_KEY = 'remoteTunnelServicePromptedPreview';
const REMOTE_TUNNEL_EXTENSION_RECOMMENDED_KEY = 'remoteTunnelExtensionRecommended';
const REMOTE_TUNNEL_HAS_USED_BEFORE = 'remoteTunnelHasUsed';
const REMOTE_TUNNEL_EXTENSION_TIMEOUT = 4 * 60 * 1000; // show the recommendation that a machine started using tunnels if it joined less than 4 minutes ago

const INVALID_TOKEN_RETRIES = 2;

interface UsedOnHostMessage { hostName: string; timeStamp: number }

type ExistingSessionItem = { session: AuthenticationSession; providerId: string; label: string; description: string };
type IAuthenticationProvider = { id: string; scopes: string[] };
type AuthenticationProviderOption = IQuickPickItem & { provider: IAuthenticationProvider };

enum RemoteTunnelCommandIds {
	turnOn = 'workbench.remoteTunnel.actions.turnOn',
	turnOff = 'workbench.remoteTunnel.actions.turnOff',
	connecting = 'workbench.remoteTunnel.actions.connecting',
	manage = 'workbench.remoteTunnel.actions.manage',
	showLog = 'workbench.remoteTunnel.actions.showLog',
	configure = 'workbench.remoteTunnel.actions.configure',
	copyToClipboard = 'workbench.remoteTunnel.actions.copyToClipboard',
	learnMore = 'workbench.remoteTunnel.actions.learnMore',
}

// name shown in nofications
namespace RemoteTunnelCommandLabels {
	export const turnOn = localize('remoteTunnel.actions.turnOn', 'Turn on Remote Tunnel Access...');
	export const turnOff = localize('remoteTunnel.actions.turnOff', 'Turn off Remote Tunnel Access...');
	export const showLog = localize('remoteTunnel.actions.showLog', 'Show Remote Tunnel Service Log');
	export const configure = localize('remoteTunnel.actions.configure', 'Configure Tunnel Name...');
	export const copyToClipboard = localize('remoteTunnel.actions.copyToClipboard', 'Copy Browser URI to Clipboard');
	export const learnMore = localize('remoteTunnel.actions.learnMore', 'Get Started with Tunnels');
}


export class RemoteTunnelWorkbenchContribution extends Disposable implements IWorkbenchContribution {

	private readonly connectionStateContext: IContextKey<CONTEXT_KEY_STATES>;

	private readonly serverConfiguration: ITunnelApplicationConfig;

	private connectionInfo: ConnectionInfo | undefined;

	private readonly logger: ILogger;

	private expiredSessions: Set<string> = new Set();

	constructor(
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IProductService productService: IProductService,
		@IStorageService private readonly storageService: IStorageService,
		@ILoggerService loggerService: ILoggerService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INativeEnvironmentService private environmentService: INativeEnvironmentService,
		@IRemoteTunnelService private remoteTunnelService: IRemoteTunnelService,
		@ICommandService private commandService: ICommandService,
		@IWorkspaceContextService private workspaceContextService: IWorkspaceContextService,
		@IProgressService private progressService: IProgressService,
		@INotificationService private notificationService: INotificationService
	) {
		super();

		this.logger = this._register(loggerService.createLogger(joinPath(environmentService.logsHome, `${LOG_ID}.log`), { id: LOG_ID, name: LOGGER_NAME }));

		this.connectionStateContext = REMOTE_TUNNEL_CONNECTION_STATE.bindTo(this.contextKeyService);

		const serverConfiguration = productService.tunnelApplicationConfig;
		if (!serverConfiguration || !productService.tunnelApplicationName) {
			this.logger.error('Missing \'tunnelApplicationConfig\' or \'tunnelApplicationName\' in product.json. Remote tunneling is not available.');
			this.serverConfiguration = { authenticationProviders: {}, editorWebUrl: '', extension: { extensionId: '', friendlyName: '' } };
			return;
		}
		this.serverConfiguration = serverConfiguration;

		this._register(this.remoteTunnelService.onDidChangeTunnelStatus(s => this.handleTunnelStatusUpdate(s)));

		this.registerCommands();

		this.initialize();

		this.recommendRemoteExtensionIfNeeded();
	}

	private handleTunnelStatusUpdate(status: TunnelStatus) {
		this.connectionInfo = undefined;
		if (status.type === 'disconnected') {
			if (status.onTokenFailed) {
				this.expiredSessions.add(status.onTokenFailed.sessionId);
			}
			this.connectionStateContext.set('disconnected');
		} else if (status.type === 'connecting') {
			this.connectionStateContext.set('connecting');
		} else if (status.type === 'connected') {
			this.connectionInfo = status.info;
			this.connectionStateContext.set('connected');
		}
	}

	private async recommendRemoteExtensionIfNeeded() {
		await this.extensionService.whenInstalledExtensionsRegistered();

		const remoteExtension = this.serverConfiguration.extension;
		const shouldRecommend = async () => {
			if (this.storageService.getBoolean(REMOTE_TUNNEL_EXTENSION_RECOMMENDED_KEY, StorageScope.APPLICATION)) {
				return false;
			}
			if (await this.extensionService.getExtension(remoteExtension.extensionId)) {
				return false;
			}
			const usedOnHostMessage = this.storageService.get(REMOTE_TUNNEL_USED_STORAGE_KEY, StorageScope.APPLICATION);
			if (!usedOnHostMessage) {
				return false;
			}
			let usedTunnelName: string | undefined;
			try {
				const message = JSON.parse(usedOnHostMessage);
				if (!isObject(message)) {
					return false;
				}
				const { hostName, timeStamp } = message as UsedOnHostMessage;
				if (!isString(hostName)! || !isNumber(timeStamp) || new Date().getTime() > timeStamp + REMOTE_TUNNEL_EXTENSION_TIMEOUT) {
					return false;
				}
				usedTunnelName = hostName;
			} catch (_) {
				// problems parsing the message, likly the old message format
				return false;
			}
			const currentTunnelName = await this.remoteTunnelService.getTunnelName();
			if (!currentTunnelName || currentTunnelName === usedTunnelName) {
				return false;
			}
			return usedTunnelName;
		};
		const recommed = async () => {
			const usedOnHost = await shouldRecommend();
			if (!usedOnHost) {
				return false;
			}
			this.notificationService.notify({
				severity: Severity.Info,
				priority: NotificationPriority.OPTIONAL,
				message:
					localize(
						{
							key: 'recommend.remoteExtension',
							comment: ['{0} will be a tunnel name, {1} will the link address to the web UI, {6} an extension name. [label](command:commandId) is a markdown link. Only translate the label, do not modify the format']
						},
						"Tunnel '{0}' is avaiable for remote access. The {1} extension can be used to connect to it.",
						usedOnHost, remoteExtension.friendlyName
					),
				actions: {
					primary: [
						toAction({
							id: 'showExtension', label: localize('action.showExtension', "Show Extension"), run: () => {
								return this.commandService.executeCommand('workbench.extensions.action.showExtensionsWithIds', [remoteExtension.extensionId]);
							}
						}),
						toAction({
							id: 'doNotShowAgain', label: localize('action.doNotShowAgain', "Do not show again"), run: () => {
								this.storageService.store(REMOTE_TUNNEL_EXTENSION_RECOMMENDED_KEY, true, StorageScope.APPLICATION, StorageTarget.USER);
							}
						}),
					]
				}
			});
			return true;
		};
		if (await shouldRecommend()) {
			const disposables = this._register(new DisposableStore());
			disposables.add(this.storageService.onDidChangeValue(StorageScope.APPLICATION, REMOTE_TUNNEL_USED_STORAGE_KEY, disposables)(async () => {
				const success = await recommed();
				if (success) {
					disposables.dispose();
				}
			}));
		}
	}

	private async initialize(): Promise<void> {
		const [mode, status] = await Promise.all([
			this.remoteTunnelService.getMode(),
			this.remoteTunnelService.getTunnelStatus(),
		]);

		this.handleTunnelStatusUpdate(status);

		if (mode.active && mode.session.token) {
			return; // already initialized, token available
		}

		const doInitialStateDiscovery = async (progress?: IProgress<IProgressStep>) => {
			const listener = progress && this.remoteTunnelService.onDidChangeTunnelStatus(status => {
				switch (status.type) {
					case 'connecting':
						if (status.progress) {
							progress.report({ message: status.progress });
						}
						break;
				}
			});
			let newSession: IRemoteTunnelSession | undefined;
			if (mode.active) {
				const token = await this.getSessionToken(mode.session);
				if (token) {
					newSession = { ...mode.session, token };
				}
			}
			const status = await this.remoteTunnelService.initialize(mode.active && newSession ? { ...mode, session: newSession } : INACTIVE_TUNNEL_MODE);
			listener?.dispose();

			if (status.type === 'connected') {
				this.connectionInfo = status.info;
				this.connectionStateContext.set('connected');
				return;
			}
		};


		const hasUsed = this.storageService.getBoolean(REMOTE_TUNNEL_HAS_USED_BEFORE, StorageScope.APPLICATION, false);

		if (hasUsed) {
			await this.progressService.withProgress(
				{
					location: ProgressLocation.Window,
					title: localize({ key: 'initialize.progress.title', comment: ['Only translate \'Looking for remote tunnel\', do not change the format of the rest (markdown link format)'] }, "[Looking for remote tunnel](command:{0})", RemoteTunnelCommandIds.showLog),
				},
				doInitialStateDiscovery
			);
		} else {
			doInitialStateDiscovery(undefined);
		}
	}

	private getPreferredTokenFromSession(session: ExistingSessionItem) {
		return session.session.accessToken || session.session.idToken;
	}

	private async startTunnel(asService: boolean): Promise<ConnectionInfo | undefined> {
		if (this.connectionInfo) {
			return this.connectionInfo;
		}

		this.storageService.store(REMOTE_TUNNEL_HAS_USED_BEFORE, true, StorageScope.APPLICATION, StorageTarget.MACHINE);

		let tokenProblems = false;
		for (let i = 0; i < INVALID_TOKEN_RETRIES; i++) {
			tokenProblems = false;

			const authenticationSession = await this.getAuthenticationSession();
			if (authenticationSession === undefined) {
				this.logger.info('No authentication session available, not starting tunnel');
				return undefined;
			}

			const result = await this.progressService.withProgress(
				{
					location: ProgressLocation.Notification,
					title: localize({ key: 'startTunnel.progress.title', comment: ['Only translate \'Starting remote tunnel\', do not change the format of the rest (markdown link format)'] }, "[Starting remote tunnel](command:{0})", RemoteTunnelCommandIds.showLog),
				},
				(progress: IProgress<IProgressStep>) => {
					return new Promise<ConnectionInfo | undefined>((s, e) => {
						let completed = false;
						const listener = this.remoteTunnelService.onDidChangeTunnelStatus(status => {
							switch (status.type) {
								case 'connecting':
									if (status.progress) {
										progress.report({ message: status.progress });
									}
									break;
								case 'connected':
									listener.dispose();
									completed = true;
									s(status.info);
									if (status.serviceInstallFailed) {
										this.notificationService.notify({
											severity: Severity.Warning,
											message: localize(
												{
													key: 'remoteTunnel.serviceInstallFailed',
													comment: ['{Locked="](command:{0})"}']
												},
												"Installation as a service failed, and we fell back to running the tunnel for this session. See the [error log](command:{0}) for details.",
												RemoteTunnelCommandIds.showLog,
											),
										});
									}
									break;
								case 'disconnected':
									listener.dispose();
									completed = true;
									tokenProblems = !!status.onTokenFailed;
									s(undefined);
									break;
							}
						});
						const token = this.getPreferredTokenFromSession(authenticationSession);
						const account: IRemoteTunnelSession = { sessionId: authenticationSession.session.id, token, providerId: authenticationSession.providerId, accountLabel: authenticationSession.session.account.label };
						this.remoteTunnelService.startTunnel({ active: true, asService, session: account }).then(status => {
							if (!completed && (status.type === 'connected' || status.type === 'disconnected')) {
								listener.dispose();
								if (status.type === 'connected') {
									s(status.info);
								} else {
									tokenProblems = !!status.onTokenFailed;
									s(undefined);
								}
							}
						});
					});
				}
			);
			if (result || !tokenProblems) {
				return result;
			}
		}
		return undefined;
	}

	private async getAuthenticationSession(): Promise<ExistingSessionItem | undefined> {
		const sessions = await this.getAllSessions();
		const disposables = new DisposableStore();
		const quickpick = disposables.add(this.quickInputService.createQuickPick<ExistingSessionItem | AuthenticationProviderOption | IQuickPickItem>({ useSeparators: true }));
		quickpick.ok = false;
		quickpick.placeholder = localize('accountPreference.placeholder', "Sign in to an account to enable remote access");
		quickpick.ignoreFocusOut = true;
		quickpick.items = await this.createQuickpickItems(sessions);

		return new Promise((resolve, reject) => {
			disposables.add(quickpick.onDidHide((e) => {
				resolve(undefined);
				disposables.dispose();
			}));

			disposables.add(quickpick.onDidAccept(async (e) => {
				const selection = quickpick.selectedItems[0];
				if ('provider' in selection) {
					const session = await this.authenticationService.createSession(selection.provider.id, selection.provider.scopes);
					resolve(this.createExistingSessionItem(session, selection.provider.id));
				} else if ('session' in selection) {
					resolve(selection);
				} else {
					resolve(undefined);
				}
				quickpick.hide();
			}));

			quickpick.show();
		});
	}

	private createExistingSessionItem(session: AuthenticationSession, providerId: string): ExistingSessionItem {
		return {
			label: session.account.label,
			description: this.authenticationService.getProvider(providerId).label,
			session,
			providerId
		};
	}

	private async createQuickpickItems(sessions: ExistingSessionItem[]): Promise<(ExistingSessionItem | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[]> {
		const options: (ExistingSessionItem | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[] = [];

		if (sessions.length) {
			options.push({ type: 'separator', label: localize('signed in', "Signed In") });
			options.push(...sessions);
			options.push({ type: 'separator', label: localize('others', "Others") });
		}

		for (const authenticationProvider of (await this.getAuthenticationProviders())) {
			const signedInForProvider = sessions.some(account => account.providerId === authenticationProvider.id);
			const provider = this.authenticationService.getProvider(authenticationProvider.id);
			if (!signedInForProvider || provider.supportsMultipleAccounts) {
				options.push({ label: localize({ key: 'sign in using account', comment: ['{0} will be a auth provider (e.g. Github)'] }, "Sign in with {0}", provider.label), provider: authenticationProvider });
			}
		}

		return options;
	}

	/**
	 * Returns all authentication sessions available from {@link getAuthenticationProviders}.
	 */
	private async getAllSessions(): Promise<ExistingSessionItem[]> {
		const authenticationProviders = await this.getAuthenticationProviders();
		const accounts = new Map<string, ExistingSessionItem>();
		const currentAccount = await this.remoteTunnelService.getMode();
		let currentSession: ExistingSessionItem | undefined;

		for (const provider of authenticationProviders) {
			const sessions = await this.authenticationService.getSessions(provider.id, provider.scopes);

			for (const session of sessions) {
				if (!this.expiredSessions.has(session.id)) {
					const item = this.createExistingSessionItem(session, provider.id);
					accounts.set(item.session.account.id, item);
					if (currentAccount.active && currentAccount.session.sessionId === session.id) {
						currentSession = item;
					}
				}
			}
		}

		if (currentSession !== undefined) {
			accounts.set(currentSession.session.account.id, currentSession);
		}

		return [...accounts.values()];
	}

	private async getSessionToken(session: IRemoteTunnelSession | undefined): Promise<string | undefined> {
		if (session) {
			const sessionItem = (await this.getAllSessions()).find(s => s.session.id === session.sessionId);
			if (sessionItem) {
				return this.getPreferredTokenFromSession(sessionItem);
			}
		}
		return undefined;
	}

	/**
	 * Returns all authentication providers which can be used to authenticate
	 * to the remote storage service, based on product.json configuration
	 * and registered authentication providers.
	 */
	private async getAuthenticationProviders(): Promise<IAuthenticationProvider[]> {
		// Get the list of authentication providers configured in product.json
		const authenticationProviders = this.serverConfiguration.authenticationProviders;
		const configuredAuthenticationProviders = Object.keys(authenticationProviders).reduce<IAuthenticationProvider[]>((result, id) => {
			result.push({ id, scopes: authenticationProviders[id].scopes });
			return result;
		}, []);

		// Filter out anything that isn't currently available through the authenticationService
		const availableAuthenticationProviders = this.authenticationService.declaredProviders;

		return configuredAuthenticationProviders.filter(({ id }) => availableAuthenticationProviders.some(provider => provider.id === id));
	}

	private registerCommands() {
		const that = this;

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.turnOn,
					title: RemoteTunnelCommandLabels.turnOn,
					category: REMOTE_TUNNEL_CATEGORY,
					precondition: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'disconnected'),
					menu: [{
						id: MenuId.CommandPalette,
					},
					{
						id: MenuId.AccountsContext,
						group: '2_remoteTunnel',
						when: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'disconnected'),
					}]
				});
			}

			async run(accessor: ServicesAccessor) {
				const notificationService = accessor.get(INotificationService);
				const clipboardService = accessor.get(IClipboardService);
				const commandService = accessor.get(ICommandService);
				const storageService = accessor.get(IStorageService);
				const dialogService = accessor.get(IDialogService);
				const quickInputService = accessor.get(IQuickInputService);
				const productService = accessor.get(IProductService);

				const didNotifyPreview = storageService.getBoolean(REMOTE_TUNNEL_PROMPTED_PREVIEW_STORAGE_KEY, StorageScope.APPLICATION, false);
				if (!didNotifyPreview) {
					const { confirmed } = await dialogService.confirm({
						message: localize('tunnel.preview', 'Remote Tunnels is currently in preview. Please report any problems using the "Help: Report Issue" command.'),
						primaryButton: localize({ key: 'enable', comment: ['&& denotes a mnemonic'] }, '&&Enable')
					});
					if (!confirmed) {
						return;
					}

					storageService.store(REMOTE_TUNNEL_PROMPTED_PREVIEW_STORAGE_KEY, true, StorageScope.APPLICATION, StorageTarget.USER);
				}

				const disposables = new DisposableStore();
				const quickPick = quickInputService.createQuickPick<IQuickPickItem & { service: boolean }>();
				quickPick.placeholder = localize('tunnel.enable.placeholder', 'Select how you want to enable access');
				quickPick.items = [
					{ service: false, label: localize('tunnel.enable.session', 'Turn on for this session'), description: localize('tunnel.enable.session.description', 'Run whenever {0} is open', productService.nameShort) },
					{ service: true, label: localize('tunnel.enable.service', 'Install as a service'), description: localize('tunnel.enable.service.description', 'Run whenever you\'re logged in') }
				];

				const asService = await new Promise<boolean | undefined>(resolve => {
					disposables.add(quickPick.onDidAccept(() => resolve(quickPick.selectedItems[0]?.service)));
					disposables.add(quickPick.onDidHide(() => resolve(undefined)));
					quickPick.show();
				});

				quickPick.dispose();

				if (asService === undefined) {
					return; // no-op
				}

				const connectionInfo = await that.startTunnel(/* installAsService= */ asService);

				if (connectionInfo) {
					const linkToOpen = that.getLinkToOpen(connectionInfo);
					const remoteExtension = that.serverConfiguration.extension;
					const linkToOpenForMarkdown = linkToOpen.toString(false).replace(/\)/g, '%29');
					notificationService.notify({
						severity: Severity.Info,
						message:
							localize(
								{
									key: 'progress.turnOn.final',
									comment: ['{0} will be the tunnel name, {1} will the link address to the web UI, {6} an extension name, {7} a link to the extension documentation. [label](command:commandId) is a markdown link. Only translate the label, do not modify the format']
								},
								"You can now access this machine anywhere via the secure tunnel [{0}](command:{4}). To connect via a different machine, use the generated [{1}]({2}) link or use the [{6}]({7}) extension in the desktop or web. You can [configure](command:{3}) or [turn off](command:{5}) this access via the VS Code Accounts menu.",
								connectionInfo.tunnelName, connectionInfo.domain, linkToOpenForMarkdown, RemoteTunnelCommandIds.manage, RemoteTunnelCommandIds.configure, RemoteTunnelCommandIds.turnOff, remoteExtension.friendlyName, 'https://code.visualstudio.com/docs/remote/tunnels'
							),
						actions: {
							primary: [
								toAction({ id: 'copyToClipboard', label: localize('action.copyToClipboard', "Copy Browser Link to Clipboard"), run: () => clipboardService.writeText(linkToOpen.toString(true)) }),
								toAction({
									id: 'showExtension', label: localize('action.showExtension', "Show Extension"), run: () => {
										return commandService.executeCommand('workbench.extensions.action.showExtensionsWithIds', [remoteExtension.extensionId]);
									}
								})
							]
						}
					});
					const usedOnHostMessage: UsedOnHostMessage = { hostName: connectionInfo.tunnelName, timeStamp: new Date().getTime() };
					storageService.store(REMOTE_TUNNEL_USED_STORAGE_KEY, JSON.stringify(usedOnHostMessage), StorageScope.APPLICATION, StorageTarget.USER);
				} else {
					notificationService.notify({
						severity: Severity.Info,
						message: localize('progress.turnOn.failed',
							"Unable to turn on the remote tunnel access. Check the Remote Tunnel Service log for details."),
					});
					await commandService.executeCommand(RemoteTunnelCommandIds.showLog);
				}
			}

		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.manage,
					title: localize('remoteTunnel.actions.manage.on.v2', 'Remote Tunnel Access is On'),
					category: REMOTE_TUNNEL_CATEGORY,
					menu: [{
						id: MenuId.AccountsContext,
						group: '2_remoteTunnel',
						when: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'connected'),
					}]
				});
			}

			async run() {
				that.showManageOptions();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.connecting,
					title: localize('remoteTunnel.actions.manage.connecting', 'Remote Tunnel Access is Connecting'),
					category: REMOTE_TUNNEL_CATEGORY,
					menu: [{
						id: MenuId.AccountsContext,
						group: '2_remoteTunnel',
						when: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'connecting'),
					}]
				});
			}

			async run() {
				that.showManageOptions();
			}
		}));


		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.turnOff,
					title: RemoteTunnelCommandLabels.turnOff,
					category: REMOTE_TUNNEL_CATEGORY,
					precondition: ContextKeyExpr.notEquals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'disconnected'),
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.notEquals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, ''),
					}]
				});
			}

			async run() {
				const message =
					that.connectionInfo?.isAttached ?
						localize('remoteTunnel.turnOffAttached.confirm', 'Do you want to turn off Remote Tunnel Access? This will also stop the service that was started externally.') :
						localize('remoteTunnel.turnOff.confirm', 'Do you want to turn off Remote Tunnel Access?');

				const { confirmed } = await that.dialogService.confirm({ message });
				if (confirmed) {
					that.remoteTunnelService.stopTunnel();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.showLog,
					title: RemoteTunnelCommandLabels.showLog,
					category: REMOTE_TUNNEL_CATEGORY,
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.notEquals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, ''),
					}]
				});
			}

			async run(accessor: ServicesAccessor) {
				const outputService = accessor.get(IOutputService);
				outputService.showChannel(LOG_ID);
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.configure,
					title: RemoteTunnelCommandLabels.configure,
					category: REMOTE_TUNNEL_CATEGORY,
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.notEquals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, ''),
					}]
				});
			}

			async run(accessor: ServicesAccessor) {
				const preferencesService = accessor.get(IPreferencesService);
				preferencesService.openSettings({ query: CONFIGURATION_KEY_PREFIX });
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.copyToClipboard,
					title: RemoteTunnelCommandLabels.copyToClipboard,
					category: REMOTE_TUNNEL_CATEGORY,
					precondition: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'connected'),
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.equals(REMOTE_TUNNEL_CONNECTION_STATE_KEY, 'connected'),
					}]
				});
			}

			async run(accessor: ServicesAccessor) {
				const clipboardService = accessor.get(IClipboardService);
				if (that.connectionInfo) {
					const linkToOpen = that.getLinkToOpen(that.connectionInfo);
					clipboardService.writeText(linkToOpen.toString(true));
				}

			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteTunnelCommandIds.learnMore,
					title: RemoteTunnelCommandLabels.learnMore,
					category: REMOTE_TUNNEL_CATEGORY,
					menu: []
				});
			}

			async run(accessor: ServicesAccessor) {
				const openerService = accessor.get(IOpenerService);
				await openerService.open('https://aka.ms/vscode-server-doc');
			}
		}));
	}

	private getLinkToOpen(connectionInfo: ConnectionInfo): URI {
		const workspace = this.workspaceContextService.getWorkspace();
		const folders = workspace.folders;
		let resource;
		if (folders.length === 1) {
			resource = folders[0].uri;
		} else if (workspace.configuration && !isUntitledWorkspace(workspace.configuration, this.environmentService)) {
			resource = workspace.configuration;
		}
		const link = URI.parse(connectionInfo.link);
		if (resource?.scheme === Schemas.file) {
			return joinPath(link, resource.path);
		}
		return joinPath(link, this.environmentService.userHome.path);
	}


	private async showManageOptions() {
		const account = await this.remoteTunnelService.getMode();

		return new Promise<void>((c, e) => {
			const disposables = new DisposableStore();
			const quickPick = this.quickInputService.createQuickPick({ useSeparators: true });
			quickPick.placeholder = localize('manage.placeholder', 'Select a command to invoke');
			disposables.add(quickPick);
			const items: Array<QuickPickItem> = [];
			items.push({ id: RemoteTunnelCommandIds.learnMore, label: RemoteTunnelCommandLabels.learnMore });
			if (this.connectionInfo) {
				quickPick.title =
					this.connectionInfo.isAttached ?
						localize({ key: 'manage.title.attached', comment: ['{0} is the tunnel name'] }, 'Remote Tunnel Access enabled for {0} (launched externally)', this.connectionInfo.tunnelName) :
						localize({ key: 'manage.title.orunning', comment: ['{0} is the tunnel name'] }, 'Remote Tunnel Access enabled for {0}', this.connectionInfo.tunnelName);

				items.push({ id: RemoteTunnelCommandIds.copyToClipboard, label: RemoteTunnelCommandLabels.copyToClipboard, description: this.connectionInfo.domain });
			} else {
				quickPick.title = localize('manage.title.off', 'Remote Tunnel Access not enabled');
			}
			items.push({ id: RemoteTunnelCommandIds.showLog, label: localize('manage.showLog', 'Show Log') });
			items.push({ type: 'separator' });
			items.push({ id: RemoteTunnelCommandIds.configure, label: localize('manage.tunnelName', 'Change Tunnel Name'), description: this.connectionInfo?.tunnelName });
			items.push({ id: RemoteTunnelCommandIds.turnOff, label: RemoteTunnelCommandLabels.turnOff, description: account.active ? `${account.session.accountLabel} (${account.session.providerId})` : undefined });

			quickPick.items = items;
			disposables.add(quickPick.onDidAccept(() => {
				if (quickPick.selectedItems[0] && quickPick.selectedItems[0].id) {
					this.commandService.executeCommand(quickPick.selectedItems[0].id);
				}
				quickPick.hide();
			}));
			disposables.add(quickPick.onDidHide(() => {
				disposables.dispose();
				c();
			}));
			quickPick.show();
		});
	}
}


const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(RemoteTunnelWorkbenchContribution, LifecyclePhase.Restored);

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	type: 'object',
	properties: {
		[CONFIGURATION_KEY_HOST_NAME]: {
			description: localize('remoteTunnelAccess.machineName', "The name under which the remote tunnel access is registered. If not set, the host name is used."),
			type: 'string',
			scope: ConfigurationScope.APPLICATION,
			ignoreSync: true,
			pattern: '^(\\w[\\w-]*)?$',
			patternErrorMessage: localize('remoteTunnelAccess.machineNameRegex', "The name must only consist of letters, numbers, underscore and dash. It must not start with a dash."),
			maxLength: 20,
			default: ''
		},
		[CONFIGURATION_KEY_PREVENT_SLEEP]: {
			description: localize('remoteTunnelAccess.preventSleep', "Prevent this computer from sleeping when remote tunnel access is turned on."),
			type: 'boolean',
			scope: ConfigurationScope.APPLICATION,
			default: false,
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/interactiveEditor.css]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/interactiveEditor.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-editor .input-cell-container:focus-within .input-editor-container>.monaco-editor {
	outline: solid 1px var(--vscode-notebook-focusedCellBorder);
}

.interactive-editor .input-cell-container .input-editor-container>.monaco-editor {
	outline: solid 1px var(--vscode-notebook-inactiveFocusedCellBorder);
}

.interactive-editor .input-cell-container .input-focus-indicator {
	top: 8px;
}

.interactive-editor .input-cell-container .monaco-editor-background,
.interactive-editor .input-cell-container .margin-view-overlays {
	background-color: var(--vscode-notebook-cellEditorBackground, var(--vscode-editor-background));
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/repl.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/repl.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { parse } from '../../../../base/common/marshalling.js';
import { isEqual } from '../../../../base/common/resources.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import { assertType } from '../../../../base/common/types.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { IBulkEditService } from '../../../../editor/browser/services/bulkEditService.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../editor/common/languages/modesRegistry.js';
import { localize2 } from '../../../../nls.js';
import { AccessibleViewRegistry } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { EditorExtensions, IEditorControl, IEditorFactoryRegistry, IEditorSerializer } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorResolverService, RegisteredEditorPriority } from '../../../services/editor/common/editorResolverService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IWorkingCopyIdentifier } from '../../../services/workingCopy/common/workingCopy.js';
import { IWorkingCopyEditorHandler, IWorkingCopyEditorService } from '../../../services/workingCopy/common/workingCopyEditorService.js';
import { ResourceNotebookCellEdit } from '../../bulkEdit/browser/bulkCellEdits.js';
import { getReplView } from '../../debug/browser/repl.js';
import { REPL_VIEW_ID } from '../../debug/common/debug.js';
import { InlineChatController } from '../../inlineChat/browser/inlineChatController.js';
import { IInteractiveHistoryService } from '../../interactive/browser/interactiveHistoryService.js';
import { NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT } from '../../notebook/browser/controller/coreActions.js';
import { INotebookEditorOptions } from '../../notebook/browser/notebookBrowser.js';
import { NotebookEditorWidget } from '../../notebook/browser/notebookEditorWidget.js';
import * as icons from '../../notebook/browser/notebookIcons.js';
import { ReplEditorAccessibleView } from '../../notebook/browser/replEditorAccessibleView.js';
import { INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { CellEditType, CellKind, NotebookSetting, NotebookWorkingCopyTypeIdentifier, REPL_EDITOR_ID } from '../../notebook/common/notebookCommon.js';
import { IS_COMPOSITE_NOTEBOOK, MOST_RECENT_REPL_EDITOR, NOTEBOOK_CELL_LIST_FOCUSED, NOTEBOOK_EDITOR_FOCUSED } from '../../notebook/common/notebookContextKeys.js';
import { NotebookEditorInputOptions } from '../../notebook/common/notebookEditorInput.js';
import { INotebookEditorModelResolverService } from '../../notebook/common/notebookEditorModelResolverService.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { isReplEditorControl, ReplEditor, ReplEditorControl } from './replEditor.js';
import { ReplEditorHistoryAccessibilityHelp, ReplEditorInputAccessibilityHelp } from './replEditorAccessibilityHelp.js';
import { ReplEditorInput } from './replEditorInput.js';

type SerializedNotebookEditorData = { resource: URI; preferredResource: URI; viewType: string; options?: NotebookEditorInputOptions; label?: string };
class ReplEditorSerializer implements IEditorSerializer {
	canSerialize(input: EditorInput): boolean {
		return input.typeId === ReplEditorInput.ID;
	}
	serialize(input: EditorInput): string {
		assertType(input instanceof ReplEditorInput);
		const data: SerializedNotebookEditorData = {
			resource: input.resource,
			preferredResource: input.preferredResource,
			viewType: input.viewType,
			options: input.options,
			label: input.getName()
		};
		return JSON.stringify(data);
	}
	deserialize(instantiationService: IInstantiationService, raw: string) {
		const data = <SerializedNotebookEditorData>parse(raw);
		if (!data) {
			return undefined;
		}
		const { resource, viewType } = data;
		if (!data || !URI.isUri(resource) || typeof viewType !== 'string') {
			return undefined;
		}

		const input = instantiationService.createInstance(ReplEditorInput, resource, data.label);
		return input;
	}
}

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		ReplEditor,
		REPL_EDITOR_ID,
		'REPL Editor'
	),
	[
		new SyncDescriptor(ReplEditorInput)
	]
);

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(
	ReplEditorInput.ID,
	ReplEditorSerializer
);

export class ReplDocumentContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.replDocument';

	private readonly editorInputCache = new ResourceMap<ReplEditorInput>();

	constructor(
		@INotebookService notebookService: INotebookService,
		@IEditorResolverService editorResolverService: IEditorResolverService,
		@INotebookEditorModelResolverService private readonly notebookEditorModelResolverService: INotebookEditorModelResolverService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		editorResolverService.registerEditor(
			// don't match anything, we don't need to support re-opening files as REPL editor at this point
			` `,
			{
				id: 'repl',
				label: 'repl Editor',
				priority: RegisteredEditorPriority.option
			},
			{
				// We want to support all notebook types which could have any file extension,
				// so we just check if the resource corresponds to a notebook
				canSupportResource: uri => notebookService.getNotebookTextModel(uri) !== undefined,
				singlePerResource: true
			},
			{
				createUntitledEditorInput: async ({ resource, options }) => {
					if (resource) {
						const editor = this.editorInputCache.get(resource);
						if (editor && !editor.isDisposed()) {
							return { editor, options };
						} else if (editor) {
							this.editorInputCache.delete(resource);
						}
					}
					const scratchpad = this.configurationService.getValue<boolean>(NotebookSetting.InteractiveWindowPromptToSave) !== true;
					const ref = await this.notebookEditorModelResolverService.resolve({ untitledResource: resource }, 'jupyter-notebook', { scratchpad, viewType: 'repl' });

					const notebookUri = ref.object.notebook.uri;

					// untitled notebooks are disposed when they get saved. we should not hold a reference
					// to such a disposed notebook and therefore dispose the reference as well
					Event.once(ref.object.notebook.onWillDispose)(() => {
						ref.dispose();
					});
					const label = (options as INotebookEditorOptions)?.label ?? undefined;
					const editor = this.instantiationService.createInstance(ReplEditorInput, notebookUri, label);
					this.editorInputCache.set(notebookUri, editor);
					Event.once(editor.onWillDispose)(() => this.editorInputCache.delete(notebookUri));

					return { editor, options };
				},
				createEditorInput: async ({ resource, options }) => {
					if (this.editorInputCache.has(resource)) {
						return { editor: this.editorInputCache.get(resource)!, options };
					}

					const label = (options as INotebookEditorOptions)?.label ?? undefined;
					const editor = this.instantiationService.createInstance(ReplEditorInput, resource, label);
					this.editorInputCache.set(resource, editor);
					Event.once(editor.onWillDispose)(() => this.editorInputCache.delete(resource));

					return { editor, options };
				}
			}
		);
	}
}

class ReplWindowWorkingCopyEditorHandler extends Disposable implements IWorkbenchContribution, IWorkingCopyEditorHandler {

	static readonly ID = 'workbench.contrib.replWorkingCopyEditorHandler';

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkingCopyEditorService private readonly workingCopyEditorService: IWorkingCopyEditorService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@INotebookService private readonly notebookService: INotebookService
	) {
		super();

		this._installHandler();
	}

	async handles(workingCopy: IWorkingCopyIdentifier) {
		const notebookType = this._getNotebookType(workingCopy);
		if (!notebookType) {
			return false;
		}

		return !!notebookType && notebookType.viewType === 'repl' && await this.notebookService.canResolve(notebookType.notebookType);
	}

	isOpen(workingCopy: IWorkingCopyIdentifier, editor: EditorInput): boolean {
		if (!this.handles(workingCopy)) {
			return false;
		}

		return editor instanceof ReplEditorInput && isEqual(workingCopy.resource, editor.resource);
	}

	createEditor(workingCopy: IWorkingCopyIdentifier): EditorInput {
		return this.instantiationService.createInstance(ReplEditorInput, workingCopy.resource, undefined);
	}

	private async _installHandler(): Promise<void> {
		await this.extensionService.whenInstalledExtensionsRegistered();

		this._register(this.workingCopyEditorService.registerHandler(this));
	}

	private _getNotebookType(workingCopy: IWorkingCopyIdentifier) {
		return NotebookWorkingCopyTypeIdentifier.parse(workingCopy.typeId);
	}
}

registerWorkbenchContribution2(ReplWindowWorkingCopyEditorHandler.ID, ReplWindowWorkingCopyEditorHandler, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(ReplDocumentContribution.ID, ReplDocumentContribution, WorkbenchPhase.BlockRestore);

AccessibleViewRegistry.register(new ReplEditorInputAccessibilityHelp());
AccessibleViewRegistry.register(new ReplEditorHistoryAccessibilityHelp());

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'repl.focusLastItemExecuted',
			title: localize2('repl.focusLastReplOutput', 'Focus Most Recent REPL Execution'),
			category: 'REPL',
			menu: {
				id: MenuId.CommandPalette,
				when: MOST_RECENT_REPL_EDITOR,
			},
			keybinding: [{
				primary: KeyChord(KeyMod.Alt | KeyCode.End, KeyMod.Alt | KeyCode.End),
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT,
				when: ContextKeyExpr.or(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_CELL_LIST_FOCUSED.negate())
			}],
			precondition: MOST_RECENT_REPL_EDITOR
		});
	}

	async run(accessor: ServicesAccessor, context?: UriComponents): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();
		const contextKeyService = accessor.get(IContextKeyService);

		let notebookEditor: NotebookEditorWidget | undefined;
		if (editorControl && isReplEditorControl(editorControl)) {
			notebookEditor = editorControl.notebookEditor;
		} else {
			const uriString = MOST_RECENT_REPL_EDITOR.getValue(contextKeyService);
			const uri = uriString ? URI.parse(uriString) : undefined;

			if (!uri) {
				return;
			}
			const replEditor = editorService.findEditors(uri)[0];

			if (replEditor) {
				const editor = await editorService.openEditor(replEditor.editor, replEditor.groupId);
				const editorControl = editor?.getControl();

				if (editorControl && isReplEditorControl(editorControl)) {
					notebookEditor = editorControl.notebookEditor;
				}
			}
		}

		const viewModel = notebookEditor?.getViewModel();
		if (notebookEditor && viewModel) {
			// last cell of the viewmodel is the last cell history
			const lastCellIndex = viewModel.length - 1;
			if (lastCellIndex >= 0) {
				const cell = viewModel.viewCells[lastCellIndex];
				notebookEditor.focusNotebookCell(cell, 'container');
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'repl.input.focus',
			title: localize2('repl.input.focus', 'Focus Input Editor'),
			category: 'REPL',
			menu: {
				id: MenuId.CommandPalette,
				when: MOST_RECENT_REPL_EDITOR,
			},
			keybinding: [{
				when: ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_EDITOR_FOCUSED),
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT,
				primary: KeyMod.CtrlCmd | KeyCode.DownArrow
			}, {
				when: ContextKeyExpr.and(MOST_RECENT_REPL_EDITOR),
				weight: KeybindingWeight.WorkbenchContrib + 5,
				primary: KeyChord(KeyMod.Alt | KeyCode.Home, KeyMod.Alt | KeyCode.Home),
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const editorControl = editorService.activeEditorPane?.getControl();
		const contextKeyService = accessor.get(IContextKeyService);

		if (editorControl && isReplEditorControl(editorControl) && editorControl.notebookEditor) {
			editorService.activeEditorPane?.focus();
		}
		else {
			const uriString = MOST_RECENT_REPL_EDITOR.getValue(contextKeyService);
			const uri = uriString ? URI.parse(uriString) : undefined;

			if (!uri) {
				return;
			}
			const replEditor = editorService.findEditors(uri)[0];

			if (replEditor) {
				await editorService.openEditor({ resource: uri, options: { preserveFocus: false } }, replEditor.groupId);
			}
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'repl.execute',
			title: localize2('repl.execute', 'Execute REPL input'),
			category: 'REPL',
			keybinding: [{
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.repl'),
					NOTEBOOK_CELL_LIST_FOCUSED.negate()
				),
				primary: KeyMod.CtrlCmd | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}, {
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.repl'),
					ContextKeyExpr.equals('config.interactiveWindow.executeWithShiftEnter', true),
					NOTEBOOK_CELL_LIST_FOCUSED.negate()
				),
				primary: KeyMod.Shift | KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}, {
				when: ContextKeyExpr.and(
					IS_COMPOSITE_NOTEBOOK,
					ContextKeyExpr.equals('activeEditor', 'workbench.editor.repl'),
					ContextKeyExpr.equals('config.interactiveWindow.executeWithShiftEnter', false),
					NOTEBOOK_CELL_LIST_FOCUSED.negate()
				),
				primary: KeyCode.Enter,
				weight: NOTEBOOK_EDITOR_WIDGET_ACTION_WEIGHT
			}],
			menu: [
				{
					id: MenuId.ReplInputExecute
				}
			],
			icon: icons.executeIcon,
			f1: false,
			metadata: {
				description: 'Execute the Contents of the Input Box',
				args: [
					{
						name: 'resource',
						description: 'Interactive resource Uri',
						isOptional: true
					}
				]
			}
		});
	}

	async run(accessor: ServicesAccessor, context?: UriComponents): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const bulkEditService = accessor.get(IBulkEditService);
		const historyService = accessor.get(IInteractiveHistoryService);
		const notebookEditorService = accessor.get(INotebookEditorService);
		let editorControl: IEditorControl | undefined;
		if (context) {
			const resourceUri = URI.revive(context);
			const editors = editorService.findEditors(resourceUri);
			for (const found of editors) {
				if (found.editor.typeId === ReplEditorInput.ID) {
					const editor = await editorService.openEditor(found.editor, found.groupId);
					editorControl = editor?.getControl();
					break;
				}
			}
		}
		else {
			editorControl = editorService.activeEditorPane?.getControl() as { notebookEditor: NotebookEditorWidget | undefined; codeEditor: CodeEditorWidget } | undefined;
		}

		if (isReplEditorControl(editorControl)) {
			executeReplInput(bulkEditService, historyService, notebookEditorService, editorControl);
		}
	}
});

async function executeReplInput(
	bulkEditService: IBulkEditService,
	historyService: IInteractiveHistoryService,
	notebookEditorService: INotebookEditorService,
	editorControl: ReplEditorControl) {

	if (editorControl && editorControl.notebookEditor && editorControl.activeCodeEditor) {
		const notebookDocument = editorControl.notebookEditor.textModel;
		const textModel = editorControl.activeCodeEditor.getModel();
		const activeKernel = editorControl.notebookEditor.activeKernel;
		const language = activeKernel?.supportedLanguages[0] ?? PLAINTEXT_LANGUAGE_ID;

		if (notebookDocument && textModel) {
			const index = notebookDocument.length - 1;
			const value = textModel.getValue();

			if (isFalsyOrWhitespace(value)) {
				return;
			}

			// Just accept any existing inline chat hunk
			const ctrl = InlineChatController.get(editorControl.activeCodeEditor);
			if (ctrl) {
				ctrl.acceptSession();
			}

			historyService.replaceLast(notebookDocument.uri, value);
			historyService.addToHistory(notebookDocument.uri, '');
			textModel.setValue('');
			notebookDocument.cells[index].resetTextBuffer(textModel.getTextBuffer());

			const collapseState = editorControl.notebookEditor.notebookOptions.getDisplayOptions().interactiveWindowCollapseCodeCells === 'fromEditor' ?
				{
					inputCollapsed: false,
					outputCollapsed: false
				} :
				undefined;

			await bulkEditService.apply([
				new ResourceNotebookCellEdit(notebookDocument.uri,
					{
						editType: CellEditType.Replace,
						index: index,
						count: 0,
						cells: [{
							cellKind: CellKind.Code,
							mime: undefined,
							language,
							source: value,
							outputs: [],
							metadata: {},
							collapseState
						}]
					}
				)
			]);

			// reveal the cell into view first
			const range = { start: index, end: index + 1 };
			editorControl.notebookEditor.revealCellRangeInView(range);
			await editorControl.notebookEditor.executeNotebookCells(editorControl.notebookEditor.getCellsInRange({ start: index, end: index + 1 }));

			// update the selection and focus in the extension host model
			const editor = notebookEditorService.getNotebookEditor(editorControl.notebookEditor.getId());
			if (editor) {
				editor.setSelections([range]);
				editor.setFocus(range);
			}
		}
	}
}

AccessibleViewRegistry.register(new ReplEditorAccessibleView());

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'list.find.replInputFocus',
	weight: KeybindingWeight.WorkbenchContrib + 1,
	when: ContextKeyExpr.equals('view', REPL_VIEW_ID),
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyF,
	secondary: [KeyCode.F3],
	handler: (accessor) => {
		getReplView(accessor.get(IViewsService))?.openFind();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/replEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/replEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/interactive.css';
import * as DOM from '../../../../base/browser/dom.js';
import * as domStylesheets from '../../../../base/browser/domStylesheets.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { CodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { ICodeEditorViewState, ICompositeCodeEditor } from '../../../../editor/common/editorCommon.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { EditorPaneSelectionChangeReason, IEditorMemento, IEditorOpenContext, IEditorPaneScrollPosition, IEditorPaneSelectionChangeEvent, IEditorPaneWithScrolling } from '../../../common/editor.js';
import { getSimpleEditorOptions } from '../../codeEditor/browser/simpleEditorOptions.js';
import { ICellViewModel, INotebookEditorOptions, INotebookEditorViewState, INotebookViewCellsUpdateEvent } from '../../notebook/browser/notebookBrowser.js';
import { NotebookEditorExtensionsRegistry } from '../../notebook/browser/notebookEditorExtensions.js';
import { IBorrowValue, INotebookEditorService } from '../../notebook/browser/services/notebookEditorService.js';
import { getDefaultNotebookCreationOptions, NotebookEditorWidget } from '../../notebook/browser/notebookEditorWidget.js';
import { GroupsOrder, IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { ExecutionStateCellStatusBarContrib, TimerCellStatusBarContrib } from '../../notebook/browser/contrib/cellStatusBar/executionStatusBarItemController.js';
import { INotebookKernelService } from '../../notebook/common/notebookKernelService.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IMenuService, MenuId } from '../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ReplEditorSettings, INTERACTIVE_INPUT_CURSOR_BOUNDARY } from '../../interactive/browser/interactiveCommon.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { NotebookOptions } from '../../notebook/browser/notebookOptions.js';
import { ToolBar } from '../../../../base/browser/ui/toolbar/toolbar.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { createActionViewItem, getActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { SelectionClipboardContributionID } from '../../codeEditor/browser/selectionClipboard.js';
import { ContextMenuController } from '../../../../editor/contrib/contextmenu/browser/contextmenu.js';
import { SuggestController } from '../../../../editor/contrib/suggest/browser/suggestController.js';
import { MarkerController } from '../../../../editor/contrib/gotoError/browser/gotoError.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { ITextEditorOptions, TextEditorSelectionSource } from '../../../../platform/editor/common/editor.js';
import { INotebookExecutionStateService, NotebookExecutionType } from '../../notebook/common/notebookExecutionStateService.js';
import { NOTEBOOK_KERNEL } from '../../notebook/common/notebookContextKeys.js';
import { ICursorPositionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { isEqual } from '../../../../base/common/resources.js';
import { NotebookFindContrib } from '../../notebook/browser/contrib/find/notebookFindWidget.js';
import { REPL_EDITOR_ID } from '../../notebook/common/notebookCommon.js';
import './interactiveEditor.css';
import { IEditorOptions } from '../../../../editor/common/config/editorOptions.js';
import { deepClone } from '../../../../base/common/objects.js';
import { GlyphHoverController } from '../../../../editor/contrib/hover/browser/glyphHoverController.js';
import { ContentHoverController } from '../../../../editor/contrib/hover/browser/contentHoverController.js';
import { ReplEditorInput } from './replEditorInput.js';
import { ReplInputHintContentWidget } from '../../interactive/browser/replInputHintContentWidget.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { localize } from '../../../../nls.js';
import { NotebookViewModel } from '../../notebook/browser/viewModel/notebookViewModelImpl.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';

const INTERACTIVE_EDITOR_VIEW_STATE_PREFERENCE_KEY = 'InteractiveEditorViewState';

const INPUT_CELL_VERTICAL_PADDING = 8;
const INPUT_CELL_HORIZONTAL_PADDING_RIGHT = 10;
const INPUT_EDITOR_PADDING = 8;

export interface InteractiveEditorViewState {
	readonly notebook?: INotebookEditorViewState;
	readonly input?: ICodeEditorViewState | null;
}

export interface InteractiveEditorOptions extends ITextEditorOptions {
	readonly viewState?: InteractiveEditorViewState;
}

export class ReplEditor extends EditorPane implements IEditorPaneWithScrolling {
	private _rootElement!: HTMLElement;
	private _styleElement!: HTMLStyleElement;
	private _notebookEditorContainer!: HTMLElement;
	private _notebookWidget: IBorrowValue<NotebookEditorWidget> = { value: undefined };
	private _inputCellContainer!: HTMLElement;
	private _inputFocusIndicator!: HTMLElement;
	private _inputRunButtonContainer!: HTMLElement;
	private _inputEditorContainer!: HTMLElement;
	private _codeEditorWidget!: CodeEditorWidget;
	private _notebookWidgetService: INotebookEditorService;
	private _instantiationService: IInstantiationService;
	private _languageService: ILanguageService;
	private _contextKeyService: IContextKeyService;
	private _configurationService: IConfigurationService;
	private _notebookKernelService: INotebookKernelService;
	private _keybindingService: IKeybindingService;
	private _menuService: IMenuService;
	private _contextMenuService: IContextMenuService;
	private _editorGroupService: IEditorGroupsService;
	private _extensionService: IExtensionService;
	private readonly _widgetDisposableStore: DisposableStore = this._register(new DisposableStore());
	private _lastLayoutDimensions?: { readonly dimension: DOM.Dimension; readonly position: DOM.IDomPosition };
	private _editorOptions: IEditorOptions;
	private _notebookOptions: NotebookOptions;
	private _editorMemento: IEditorMemento<InteractiveEditorViewState>;
	private readonly _groupListener = this._register(new MutableDisposable());
	private _runbuttonToolbar: ToolBar | undefined;
	private _hintElement: ReplInputHintContentWidget | undefined;

	private _onDidFocusWidget = this._register(new Emitter<void>());
	override get onDidFocus(): Event<void> { return this._onDidFocusWidget.event; }
	private _onDidChangeSelection = this._register(new Emitter<IEditorPaneSelectionChangeEvent>());
	readonly onDidChangeSelection = this._onDidChangeSelection.event;
	private _onDidChangeScroll = this._register(new Emitter<void>());
	readonly onDidChangeScroll = this._onDidChangeScroll.event;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService instantiationService: IInstantiationService,
		@INotebookEditorService notebookWidgetService: INotebookEditorService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@INotebookKernelService notebookKernelService: INotebookKernelService,
		@ILanguageService languageService: ILanguageService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IConfigurationService configurationService: IConfigurationService,
		@IMenuService menuService: IMenuService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IEditorGroupsService editorGroupService: IEditorGroupsService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@INotebookExecutionStateService notebookExecutionStateService: INotebookExecutionStateService,
		@IExtensionService extensionService: IExtensionService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService
	) {
		super(
			REPL_EDITOR_ID,
			group,
			telemetryService,
			themeService,
			storageService
		);
		this._notebookWidgetService = notebookWidgetService;
		this._configurationService = configurationService;
		this._notebookKernelService = notebookKernelService;
		this._languageService = languageService;
		this._keybindingService = keybindingService;
		this._menuService = menuService;
		this._contextMenuService = contextMenuService;
		this._editorGroupService = editorGroupService;
		this._extensionService = extensionService;

		this._rootElement = DOM.$('.interactive-editor');
		this._contextKeyService = this._register(contextKeyService.createScoped(this._rootElement));
		this._contextKeyService.createKey('isCompositeNotebook', true);
		this._instantiationService = this._register(instantiationService.createChild(new ServiceCollection([IContextKeyService, this._contextKeyService])));

		this._editorOptions = this._computeEditorOptions();
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('editor') || e.affectsConfiguration('notebook')) {
				this._editorOptions = this._computeEditorOptions();
			}
		}));
		this._notebookOptions = instantiationService.createInstance(NotebookOptions, this.window, true, { cellToolbarInteraction: 'hover', globalToolbar: true, stickyScrollEnabled: false, dragAndDropEnabled: false, disableRulers: true });
		this._editorMemento = this.getEditorMemento<InteractiveEditorViewState>(editorGroupService, textResourceConfigurationService, INTERACTIVE_EDITOR_VIEW_STATE_PREFERENCE_KEY);

		this._register(this._keybindingService.onDidUpdateKeybindings(this._updateInputHint, this));
		this._register(notebookExecutionStateService.onDidChangeExecution((e) => {
			if (e.type === NotebookExecutionType.cell && isEqual(e.notebook, this._notebookWidget.value?.viewModel?.notebookDocument.uri)) {
				const cell = this._notebookWidget.value?.getCellByHandle(e.cellHandle);
				if (cell && e.changed?.state) {
					this._scrollIfNecessary(cell);
				}
			}
		}));
	}

	private get inputCellContainerHeight() {
		return 19 + 2 + INPUT_CELL_VERTICAL_PADDING * 2 + INPUT_EDITOR_PADDING * 2;
	}

	private get inputCellEditorHeight() {
		return 19 + INPUT_EDITOR_PADDING * 2;
	}

	protected createEditor(parent: HTMLElement): void {
		DOM.append(parent, this._rootElement);
		this._rootElement.style.position = 'relative';
		this._notebookEditorContainer = DOM.append(this._rootElement, DOM.$('.notebook-editor-container'));
		this._inputCellContainer = DOM.append(this._rootElement, DOM.$('.input-cell-container'));
		this._inputCellContainer.style.position = 'absolute';
		this._inputCellContainer.style.height = `${this.inputCellContainerHeight}px`;
		this._inputFocusIndicator = DOM.append(this._inputCellContainer, DOM.$('.input-focus-indicator'));
		this._inputRunButtonContainer = DOM.append(this._inputCellContainer, DOM.$('.run-button-container'));
		this._setupRunButtonToolbar(this._inputRunButtonContainer);
		this._inputEditorContainer = DOM.append(this._inputCellContainer, DOM.$('.input-editor-container'));
		this._createLayoutStyles();
	}

	private _setupRunButtonToolbar(runButtonContainer: HTMLElement) {
		const menu = this._register(this._menuService.createMenu(MenuId.ReplInputExecute, this._contextKeyService));
		this._runbuttonToolbar = this._register(new ToolBar(runButtonContainer, this._contextMenuService, {
			getKeyBinding: action => this._keybindingService.lookupKeybinding(action.id),
			actionViewItemProvider: (action, options) => {
				return createActionViewItem(this._instantiationService, action, options);
			},
			renderDropdownAsChildElement: true
		}));

		const { primary, secondary } = getActionBarActions(menu.getActions({ shouldForwardArgs: true }));
		this._runbuttonToolbar.setActions([...primary, ...secondary]);
	}

	private _createLayoutStyles(): void {
		this._styleElement = domStylesheets.createStyleSheet(this._rootElement);
		const styleSheets: string[] = [];

		const {
			codeCellLeftMargin,
			cellRunGutter
		} = this._notebookOptions.getLayoutConfiguration();
		const {
			focusIndicator
		} = this._notebookOptions.getDisplayOptions();
		const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();

		styleSheets.push(`
			.interactive-editor .input-cell-container {
				padding: ${INPUT_CELL_VERTICAL_PADDING}px ${INPUT_CELL_HORIZONTAL_PADDING_RIGHT}px ${INPUT_CELL_VERTICAL_PADDING}px ${leftMargin}px;
			}
		`);
		if (focusIndicator === 'gutter') {
			styleSheets.push(`
				.interactive-editor .input-cell-container:focus-within .input-focus-indicator::before {
					border-color: var(--vscode-notebook-focusedCellBorder) !important;
				}
				.interactive-editor .input-focus-indicator::before {
					border-color: var(--vscode-notebook-inactiveFocusedCellBorder) !important;
				}
				.interactive-editor .input-cell-container .input-focus-indicator {
					display: block;
					top: ${INPUT_CELL_VERTICAL_PADDING}px;
				}
				.interactive-editor .input-cell-container {
					border-top: 1px solid var(--vscode-notebook-inactiveFocusedCellBorder);
				}
			`);
		} else {
			// border
			styleSheets.push(`
				.interactive-editor .input-cell-container {
					border-top: 1px solid var(--vscode-notebook-inactiveFocusedCellBorder);
				}
				.interactive-editor .input-cell-container .input-focus-indicator {
					display: none;
				}
			`);
		}

		styleSheets.push(`
			.interactive-editor .input-cell-container .run-button-container {
				width: ${cellRunGutter}px;
				left: ${codeCellLeftMargin}px;
				margin-top: ${INPUT_EDITOR_PADDING - 2}px;
			}
		`);

		this._styleElement.textContent = styleSheets.join('\n');
	}

	private _computeEditorOptions(): IEditorOptions {
		let overrideIdentifier: string | undefined = undefined;
		if (this._codeEditorWidget) {
			overrideIdentifier = this._codeEditorWidget.getModel()?.getLanguageId();
		}
		const editorOptions = deepClone(this._configurationService.getValue<IEditorOptions>('editor', { overrideIdentifier }));
		const editorOptionsOverride = getSimpleEditorOptions(this._configurationService);
		const computed = Object.freeze({
			...editorOptions,
			...editorOptionsOverride,
			...{
				ariaLabel: localize('replEditorInput', "REPL Input"),
				glyphMargin: true,
				padding: {
					top: INPUT_EDITOR_PADDING,
					bottom: INPUT_EDITOR_PADDING
				},
				hover: {
					enabled: 'on' as const
				},
				rulers: []
			}
		});

		return computed;
	}

	protected override saveState(): void {
		this._saveEditorViewState(this.input);
		super.saveState();
	}

	override getViewState(): InteractiveEditorViewState | undefined {
		const input = this.input;
		if (!(input instanceof ReplEditorInput)) {
			return undefined;
		}

		this._saveEditorViewState(input);
		return this._loadNotebookEditorViewState(input);
	}

	private _saveEditorViewState(input: EditorInput | undefined): void {
		if (this._notebookWidget.value && input instanceof ReplEditorInput) {
			if (this._notebookWidget.value.isDisposed) {
				return;
			}

			const state = this._notebookWidget.value.getEditorViewState();
			const editorState = this._codeEditorWidget.saveViewState();
			this._editorMemento.saveEditorState(this.group, input.resource, {
				notebook: state,
				input: editorState
			});
		}
	}

	private _loadNotebookEditorViewState(input: ReplEditorInput): InteractiveEditorViewState | undefined {
		const result = this._editorMemento.loadEditorState(this.group, input.resource);
		if (result) {
			return result;
		}
		// when we don't have a view state for the group/input-tuple then we try to use an existing
		// editor for the same resource.
		for (const group of this._editorGroupService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE)) {
			if (group.activeEditorPane !== this && group.activeEditorPane === this && group.activeEditor?.matches(input)) {
				const notebook = this._notebookWidget.value?.getEditorViewState();
				const input = this._codeEditorWidget.saveViewState();
				return {
					notebook,
					input
				};
			}
		}
		return;
	}

	override async setInput(input: ReplEditorInput, options: InteractiveEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		// there currently is a widget which we still own so
		// we need to hide it before getting a new widget
		this._notebookWidget.value?.onWillHide();

		this._codeEditorWidget?.dispose();

		this._widgetDisposableStore.clear();

		this._notebookWidget = <IBorrowValue<NotebookEditorWidget>>this._instantiationService.invokeFunction(this._notebookWidgetService.retrieveWidget, this.group.id, input, {
			isReplHistory: true,
			isReadOnly: true,
			contributions: NotebookEditorExtensionsRegistry.getSomeEditorContributions([
				ExecutionStateCellStatusBarContrib.id,
				TimerCellStatusBarContrib.id,
				NotebookFindContrib.id
			]),
			menuIds: {
				notebookToolbar: MenuId.InteractiveToolbar,
				cellTitleToolbar: MenuId.InteractiveCellTitle,
				cellDeleteToolbar: MenuId.InteractiveCellDelete,
				cellInsertToolbar: MenuId.NotebookCellBetween,
				cellTopInsertToolbar: MenuId.NotebookCellListTop,
				cellExecuteToolbar: MenuId.InteractiveCellExecute,
				cellExecutePrimary: undefined
			},
			cellEditorContributions: EditorExtensionsRegistry.getSomeEditorContributions([
				SelectionClipboardContributionID,
				ContextMenuController.ID,
				ContentHoverController.ID,
				GlyphHoverController.ID,
				MarkerController.ID
			]),
			options: this._notebookOptions,
			codeWindow: this.window
		}, undefined, this.window);

		const skipContributions = [
			'workbench.notebook.cellToolbar',
			'editor.contrib.inlineCompletionsController'
		];

		const inputContributions = getDefaultNotebookCreationOptions().cellEditorContributions?.filter(c => skipContributions.indexOf(c.id) === -1);
		this._codeEditorWidget = this._instantiationService.createInstance(CodeEditorWidget, this._inputEditorContainer, this._editorOptions, {
			...{
				isSimpleWidget: false,
				contributions: inputContributions,
			}
		});

		if (this._lastLayoutDimensions) {
			this._notebookEditorContainer.style.height = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
			this._notebookWidget.value!.layout(new DOM.Dimension(this._lastLayoutDimensions.dimension.width, this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight), this._notebookEditorContainer);
			const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();
			const maxHeight = Math.min(this._lastLayoutDimensions.dimension.height / 2, this.inputCellEditorHeight);
			this._codeEditorWidget.layout(this._validateDimension(this._lastLayoutDimensions.dimension.width - leftMargin - INPUT_CELL_HORIZONTAL_PADDING_RIGHT, maxHeight));
			this._inputFocusIndicator.style.height = `${this.inputCellEditorHeight}px`;
			this._inputCellContainer.style.top = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
			this._inputCellContainer.style.width = `${this._lastLayoutDimensions.dimension.width}px`;
		}

		await super.setInput(input, options, context, token);
		const model = await input.resolve();
		if (this._runbuttonToolbar) {
			this._runbuttonToolbar.context = input.resource;
		}

		if (model === null) {
			throw new Error('The REPL model could not be resolved');
		}

		this._notebookWidget.value?.setParentContextKeyService(this._contextKeyService);

		const viewState = options?.viewState ?? this._loadNotebookEditorViewState(input);
		await this._extensionService.whenInstalledExtensionsRegistered();
		await this._notebookWidget.value!.setModel(model.notebook, viewState?.notebook, undefined, 'repl');
		model.notebook.setCellCollapseDefault(this._notebookOptions.getCellCollapseDefault());
		this._notebookWidget.value!.setOptions({
			isReadOnly: true
		});
		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidResizeOutput((cvm) => {
			this._scrollIfNecessary(cvm);
		}));
		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidFocusWidget(() => this._onDidFocusWidget.fire()));
		this._widgetDisposableStore.add(this._notebookOptions.onDidChangeOptions(e => {
			if (e.compactView || e.focusIndicator) {
				// update the styling
				this._styleElement?.remove();
				this._createLayoutStyles();
			}

			if (this._lastLayoutDimensions && this.isVisible()) {
				this.layout(this._lastLayoutDimensions.dimension, this._lastLayoutDimensions.position);
			}

			if (e.interactiveWindowCollapseCodeCells) {
				model.notebook.setCellCollapseDefault(this._notebookOptions.getCellCollapseDefault());
			}
		}));

		const editorModel = await input.resolveInput(model.notebook);
		this._codeEditorWidget.setModel(editorModel);
		if (viewState?.input) {
			this._codeEditorWidget.restoreViewState(viewState.input);
		}
		this._editorOptions = this._computeEditorOptions();
		this._codeEditorWidget.updateOptions(this._editorOptions);

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidFocusEditorWidget(() => this._onDidFocusWidget.fire()));
		this._widgetDisposableStore.add(this._codeEditorWidget.onDidContentSizeChange(e => {
			if (!e.contentHeightChanged) {
				return;
			}

			if (this._lastLayoutDimensions) {
				this._layoutWidgets(this._lastLayoutDimensions.dimension, this._lastLayoutDimensions.position);
			}
		}));

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeCursorPosition(e => this._onDidChangeSelection.fire({ reason: this._toEditorPaneSelectionChangeReason(e) })));
		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModelContent(() => this._onDidChangeSelection.fire({ reason: EditorPaneSelectionChangeReason.EDIT })));


		this._widgetDisposableStore.add(this._notebookKernelService.onDidChangeNotebookAffinity(this._syncWithKernel, this));
		this._widgetDisposableStore.add(this._notebookKernelService.onDidChangeSelectedNotebooks(this._syncWithKernel, this));

		this._widgetDisposableStore.add(this.themeService.onDidColorThemeChange(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		}));

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModelContent(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		}));

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeModelDecorations(() => {
			if (this.isVisible()) {
				this._updateInputHint();
			}
		}));

		const cursorAtBoundaryContext = INTERACTIVE_INPUT_CURSOR_BOUNDARY.bindTo(this._contextKeyService);
		if (input.resource && input.historyService.has(input.resource)) {
			cursorAtBoundaryContext.set('top');
		} else {
			cursorAtBoundaryContext.set('none');
		}

		this._widgetDisposableStore.add(this._codeEditorWidget.onDidChangeCursorPosition(({ position }) => {
			const viewModel = this._codeEditorWidget._getViewModel()!;
			const lastLineNumber = viewModel.getLineCount();
			const lastLineCol = viewModel.getLineLength(lastLineNumber) + 1;
			const viewPosition = viewModel.coordinatesConverter.convertModelPositionToViewPosition(position);
			const firstLine = viewPosition.lineNumber === 1 && viewPosition.column === 1;
			const lastLine = viewPosition.lineNumber === lastLineNumber && viewPosition.column === lastLineCol;

			if (firstLine) {
				if (lastLine) {
					cursorAtBoundaryContext.set('both');
				} else {
					cursorAtBoundaryContext.set('top');
				}
			} else {
				if (lastLine) {
					cursorAtBoundaryContext.set('bottom');
				} else {
					cursorAtBoundaryContext.set('none');
				}
			}
		}));

		this._widgetDisposableStore.add(editorModel.onDidChangeContent(() => {
			const value = editorModel.getValue();
			if (this.input?.resource && value !== '') {
				const historyService = (this.input as ReplEditorInput).historyService;
				if (!historyService.matchesCurrent(this.input.resource, value)) {
					historyService.replaceLast(this.input.resource, value);
				}
			}
		}));

		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidScroll(() => this._onDidChangeScroll.fire()));


		this._widgetDisposableStore.add(this._notebookWidget.value!.onDidChangeViewCells(this.handleViewCellChange, this));

		this._updateInputHint();
		this._syncWithKernel();
	}

	private handleViewCellChange(e: INotebookViewCellsUpdateEvent) {
		const notebookWidget = this._notebookWidget.value;
		if (!notebookWidget) {
			return;
		}

		for (const splice of e.splices) {
			const [_start, _delete, addedCells] = splice;
			if (addedCells.length) {
				const viewModel = notebookWidget.viewModel;
				if (viewModel) {
					this.handleAppend(notebookWidget, viewModel);
					break;
				}
			}
		}
	}

	private handleAppend(notebookWidget: NotebookEditorWidget, viewModel: NotebookViewModel) {
		this._notebookWidgetService.updateReplContextKey(viewModel.notebookDocument.uri.toString());
		const navigateToCell = this._configurationService.getValue('accessibility.replEditor.autoFocusReplExecution');
		if (this._accessibilityService.isScreenReaderOptimized()) {
			if (navigateToCell === 'lastExecution') {
				setTimeout(() => {
					const lastCellIndex = viewModel.length - 1;
					if (lastCellIndex >= 0) {
						const cell = viewModel.viewCells[lastCellIndex];
						notebookWidget.focusNotebookCell(cell, 'container');
					}
				}, 0);
			} else if (navigateToCell === 'input') {
				this._codeEditorWidget.focus();
			}
		}
	}

	override setOptions(options: INotebookEditorOptions | undefined): void {
		this._notebookWidget.value?.setOptions(options);
		super.setOptions(options);
	}

	private _toEditorPaneSelectionChangeReason(e: ICursorPositionChangedEvent): EditorPaneSelectionChangeReason {
		switch (e.source) {
			case TextEditorSelectionSource.PROGRAMMATIC: return EditorPaneSelectionChangeReason.PROGRAMMATIC;
			case TextEditorSelectionSource.NAVIGATION: return EditorPaneSelectionChangeReason.NAVIGATION;
			case TextEditorSelectionSource.JUMP: return EditorPaneSelectionChangeReason.JUMP;
			default: return EditorPaneSelectionChangeReason.USER;
		}
	}

	private _cellAtBottom(cell: ICellViewModel): boolean {
		const visibleRanges = this._notebookWidget.value?.visibleRanges || [];
		const cellIndex = this._notebookWidget.value?.getCellIndex(cell);
		if (cellIndex === Math.max(...visibleRanges.map(range => range.end - 1))) {
			return true;
		}
		return false;
	}

	private _scrollIfNecessary(cvm: ICellViewModel) {
		const index = this._notebookWidget.value!.getCellIndex(cvm);
		if (index === this._notebookWidget.value!.getLength() - 1) {
			// If we're already at the bottom or auto scroll is enabled, scroll to the bottom
			if (this._configurationService.getValue<boolean>(ReplEditorSettings.interactiveWindowAlwaysScrollOnNewCell) || this._cellAtBottom(cvm)) {
				this._notebookWidget.value!.scrollToBottom();
			}
		}
	}

	private _syncWithKernel() {
		const notebook = this._notebookWidget.value?.textModel;
		const textModel = this._codeEditorWidget.getModel();

		if (notebook && textModel) {
			const info = this._notebookKernelService.getMatchingKernel(notebook);
			const selectedOrSuggested = info.selected
				?? (info.suggestions.length === 1 ? info.suggestions[0] : undefined)
				?? (info.all.length === 1 ? info.all[0] : undefined);

			if (selectedOrSuggested) {
				const language = selectedOrSuggested.supportedLanguages[0];
				// All kernels will initially list plaintext as the supported language before they properly initialized.
				if (language && language !== 'plaintext') {
					const newMode = this._languageService.createById(language).languageId;
					textModel.setLanguage(newMode);
				}

				NOTEBOOK_KERNEL.bindTo(this._contextKeyService).set(selectedOrSuggested.id);
			}
		}
	}

	layout(dimension: DOM.Dimension, position: DOM.IDomPosition): void {
		this._rootElement.classList.toggle('mid-width', dimension.width < 1000 && dimension.width >= 600);
		this._rootElement.classList.toggle('narrow-width', dimension.width < 600);
		const editorHeightChanged = dimension.height !== this._lastLayoutDimensions?.dimension.height;
		this._lastLayoutDimensions = { dimension, position };

		if (!this._notebookWidget.value) {
			return;
		}

		if (editorHeightChanged && this._codeEditorWidget) {
			SuggestController.get(this._codeEditorWidget)?.cancelSuggestWidget();
		}

		this._notebookEditorContainer.style.height = `${this._lastLayoutDimensions.dimension.height - this.inputCellContainerHeight}px`;
		this._layoutWidgets(dimension, position);
	}

	private _layoutWidgets(dimension: DOM.Dimension, position: DOM.IDomPosition) {
		const contentHeight = this._codeEditorWidget.hasModel() ? this._codeEditorWidget.getContentHeight() : this.inputCellEditorHeight;
		const maxHeight = Math.min(dimension.height / 2, contentHeight);
		const leftMargin = this._notebookOptions.getCellEditorContainerLeftMargin();

		const inputCellContainerHeight = maxHeight + INPUT_CELL_VERTICAL_PADDING * 2;
		this._notebookEditorContainer.style.height = `${dimension.height - inputCellContainerHeight}px`;

		this._notebookWidget.value!.layout(dimension.with(dimension.width, dimension.height - inputCellContainerHeight), this._notebookEditorContainer, position);
		this._codeEditorWidget.layout(this._validateDimension(dimension.width - leftMargin - INPUT_CELL_HORIZONTAL_PADDING_RIGHT, maxHeight));
		this._inputFocusIndicator.style.height = `${contentHeight}px`;
		this._inputCellContainer.style.top = `${dimension.height - inputCellContainerHeight}px`;
		this._inputCellContainer.style.width = `${dimension.width}px`;
	}

	private _validateDimension(width: number, height: number) {
		return new DOM.Dimension(Math.max(0, width), Math.max(0, height));
	}

	private _hasConflictingDecoration() {
		return Boolean(this._codeEditorWidget.getLineDecorations(1)?.find((d) =>
			d.options.beforeContentClassName
			|| d.options.afterContentClassName
			|| d.options.before?.content
			|| d.options.after?.content
		));
	}

	private _updateInputHint(): void {
		if (!this._codeEditorWidget) {
			return;
		}

		const shouldHide =
			!this._codeEditorWidget.hasModel() ||
			this._configurationService.getValue<boolean>(ReplEditorSettings.showExecutionHint) === false ||
			this._codeEditorWidget.getModel()!.getValueLength() !== 0 ||
			this._hasConflictingDecoration();

		if (!this._hintElement && !shouldHide) {
			this._hintElement = this._instantiationService.createInstance(ReplInputHintContentWidget, this._codeEditorWidget);
		} else if (this._hintElement && shouldHide) {
			this._hintElement.dispose();
			this._hintElement = undefined;
		}
	}

	getScrollPosition(): IEditorPaneScrollPosition {
		return {
			scrollTop: this._notebookWidget.value?.scrollTop ?? 0,
			scrollLeft: 0
		};
	}

	setScrollPosition(position: IEditorPaneScrollPosition): void {
		this._notebookWidget.value?.setScrollTop(position.scrollTop);
	}

	override focus() {
		super.focus();

		this._notebookWidget.value?.onShow();
		this._codeEditorWidget.focus();
	}

	focusHistory() {
		this._notebookWidget.value!.focus();
	}

	protected override setEditorVisible(visible: boolean): void {
		super.setEditorVisible(visible);
		this._groupListener.value = this.group.onWillCloseEditor(e => this._saveEditorViewState(e.editor));

		if (!visible) {
			this._saveEditorViewState(this.input);
			if (this.input && this._notebookWidget.value) {
				this._notebookWidget.value.onWillHide();
			}
		}

		this._updateInputHint();
	}

	override clearInput() {
		if (this._notebookWidget.value) {
			this._saveEditorViewState(this.input);
			this._notebookWidget.value.onWillHide();
		}

		this._codeEditorWidget?.dispose();

		this._notebookWidget = { value: undefined };
		this._widgetDisposableStore.clear();

		super.clearInput();
	}

	override getControl(): ReplEditorControl & ICompositeCodeEditor {
		return {
			notebookEditor: this._notebookWidget.value,
			activeCodeEditor: this.getActiveCodeEditor(),
			onDidChangeActiveEditor: Event.None
		};
	}

	private getActiveCodeEditor() {
		if (!this._codeEditorWidget) {
			return undefined;
		}
		return this._codeEditorWidget.hasWidgetFocus() || !this._notebookWidget.value?.activeCodeEditor ?
			this._codeEditorWidget :
			this._notebookWidget.value.activeCodeEditor;
	}
}

export type ReplEditorControl = { activeCodeEditor: ICodeEditor | undefined; notebookEditor: NotebookEditorWidget | undefined };

export function isReplEditorControl(control: unknown): control is ReplEditorControl {
	const candidate = control as ReplEditorControl;
	return candidate?.activeCodeEditor instanceof CodeEditorWidget && candidate?.notebookEditor instanceof NotebookEditorWidget;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/replEditorAccessibilityHelp.ts]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/replEditorAccessibilityHelp.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IAccessibleViewImplementation } from '../../../../platform/accessibility/browser/accessibleViewRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { localize } from '../../../../nls.js';
import { AccessibleViewProviderId, AccessibleViewType, AccessibleContentProvider } from '../../../../platform/accessibility/browser/accessibleView.js';
import { AccessibilityVerbositySettingId } from '../../accessibility/browser/accessibilityConfiguration.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { IS_COMPOSITE_NOTEBOOK, NOTEBOOK_CELL_LIST_FOCUSED } from '../../notebook/common/notebookContextKeys.js';

export class ReplEditorInputAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 105;
	readonly name = 'REPL Editor Input';
	readonly when = ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_CELL_LIST_FOCUSED.negate());
	readonly type: AccessibleViewType = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		return getAccessibilityHelpProvider(accessor.get(ICodeEditorService), getAccessibilityInputHelpText());
	}
}

function getAccessibilityInputHelpText(): string {
	return [
		localize('replEditor.inputOverview', 'You are in a REPL Editor Input box which will accept code to be executed in the REPL.'),
		localize('replEditor.execute', 'The Execute command{0} will evaluate the expression in the input box.', '<keybinding:repl.execute>'),
		localize('replEditor.configReadExecution', 'The setting `accessibility.replEditor.readLastExecutionOutput` controls if output will be automatically read when execution completes.'),
		localize('replEditor.autoFocusRepl', 'The setting `accessibility.replEditor.autoFocusReplExecution` controls if focus will automatically move to the REPL after executing code.'),
		localize('replEditor.focusLastItemAdded', 'The Focus Last executed command{0} will move focus to the last executed item in the REPL history.', '<keybinding:repl.focusLastItemExecuted>'),
		localize('replEditor.inputAccessibilityView', 'When you run the Open Accessbility View command{0} from this input box, the output from the last execution will be shown in the accessibility view.', '<keybinding:editor.action.accessibleView>'),
		localize('replEditor.focusReplInput', 'The Focus Input Editor command{0} will bring the focus back to this editor.', '<keybinding:repl.input.focus>'),
	].join('\n');
}

export class ReplEditorHistoryAccessibilityHelp implements IAccessibleViewImplementation {
	readonly priority = 105;
	readonly name = 'REPL Editor History';
	readonly when = ContextKeyExpr.and(IS_COMPOSITE_NOTEBOOK, NOTEBOOK_CELL_LIST_FOCUSED);
	readonly type: AccessibleViewType = AccessibleViewType.Help;
	getProvider(accessor: ServicesAccessor) {
		return getAccessibilityHelpProvider(accessor.get(ICodeEditorService), getAccessibilityHistoryHelpText());
	}
}

function getAccessibilityHistoryHelpText(): string {
	return [
		localize('replEditor.historyOverview', 'You are in a REPL History which is a list of cells that have been executed in the REPL. Each cell has an input, an output, and the cell container.'),
		localize('replEditor.focusCellEditor', 'The Edit Cell command{0} will move focus to the read-only editor for the input of the cell.', '<keybinding:notebook.cell.edit>'),
		localize('replEditor.cellNavigation', 'The Quit Edit command{0} will move focus to the cell container, where the up and down arrows will also move focus between cells in the history.', '<keybinding:notebook.cell.quitEdit>'),
		localize('replEditor.accessibilityView', 'Run the Open Accessbility View command{0} while navigating the history for an accessible view of the item\'s output.', '<keybinding:editor.action.accessibleView>'),
		localize('replEditor.focusInOutput', 'The Focus Output command{0} will set focus on the output when focused on a previously executed item.', '<keybinding:notebook.cell.focusInOutput>'),
		localize('replEditor.focusReplInputFromHistory', 'The Focus Input Editor command{0} will move focus to the REPL input box.', '<keybinding:repl.input.focus>'),
		localize('replEditor.focusLastItemAdded', 'The Focus Last executed command{0} will move focus to the last executed item in the REPL history.', '<keybinding:repl.focusLastItemExecuted>'),
	].join('\n');
}

function getAccessibilityHelpProvider(editorService: ICodeEditorService, helpText: string) {
	const activeEditor = editorService.getActiveCodeEditor()
		|| editorService.getFocusedCodeEditor();

	if (!activeEditor) {
		return;
	}

	return new AccessibleContentProvider(
		AccessibleViewProviderId.ReplEditor,
		{ type: AccessibleViewType.Help },
		() => helpText,
		() => activeEditor.focus(),
		AccessibilityVerbositySettingId.ReplEditor,
	);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/replEditorInput.ts]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/replEditorInput.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITextResourceConfigurationService } from '../../../../editor/common/services/textResourceConfiguration.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { EditorInputCapabilities } from '../../../common/editor.js';
import { IInteractiveHistoryService } from '../../interactive/browser/interactiveHistoryService.js';
import { NotebookTextModel } from '../../notebook/common/model/notebookTextModel.js';
import { CellEditType, CellKind, NotebookSetting } from '../../notebook/common/notebookCommon.js';
import { ICompositeNotebookEditorInput, NotebookEditorInput } from '../../notebook/common/notebookEditorInput.js';
import { INotebookEditorModelResolverService } from '../../notebook/common/notebookEditorModelResolverService.js';
import { INotebookService } from '../../notebook/common/notebookService.js';
import { ICustomEditorLabelService } from '../../../services/editor/common/customEditorLabelService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IPathService } from '../../../services/path/common/pathService.js';

const replTabIcon = registerIcon('repl-editor-label-icon', Codicon.debugLineByLine, localize('replEditorLabelIcon', 'Icon of the REPL editor label.'));

export class ReplEditorInput extends NotebookEditorInput implements ICompositeNotebookEditorInput {
	static override ID: string = 'workbench.editorinputs.replEditorInput';

	private inputModelRef: IReference<IResolvedTextEditorModel> | undefined;
	private isScratchpad: boolean;
	private label: string;
	private isDisposing = false;

	constructor(
		resource: URI,
		label: string | undefined,
		@INotebookService _notebookService: INotebookService,
		@INotebookEditorModelResolverService _notebookModelResolverService: INotebookEditorModelResolverService,
		@IFileDialogService _fileDialogService: IFileDialogService,
		@ILabelService labelService: ILabelService,
		@IFileService fileService: IFileService,
		@IFilesConfigurationService filesConfigurationService: IFilesConfigurationService,
		@IExtensionService extensionService: IExtensionService,
		@IEditorService editorService: IEditorService,
		@ITextResourceConfigurationService textResourceConfigurationService: ITextResourceConfigurationService,
		@ICustomEditorLabelService customEditorLabelService: ICustomEditorLabelService,
		@IInteractiveHistoryService public readonly historyService: IInteractiveHistoryService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IConfigurationService configurationService: IConfigurationService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IPathService pathService: IPathService
	) {
		super(resource, undefined, 'jupyter-notebook', {}, _notebookService, _notebookModelResolverService, _fileDialogService, labelService, fileService, filesConfigurationService, extensionService, editorService, textResourceConfigurationService, customEditorLabelService, environmentService, pathService);
		this.isScratchpad = resource.scheme === 'untitled' && configurationService.getValue<boolean>(NotebookSetting.InteractiveWindowPromptToSave) !== true;
		this.label = label ?? this.createEditorLabel(resource);
	}

	override getIcon(): ThemeIcon | undefined {
		return replTabIcon;
	}

	private createEditorLabel(resource: URI | undefined): string {
		if (!resource) {
			return 'REPL';
		}

		if (resource.scheme === 'untitled') {
			const match = new RegExp('Untitled-(\\d+)\.').exec(resource.path);
			if (match?.length === 2) {
				return `REPL - ${match[1]}`;
			}
		}

		const filename = resource.path.split('/').pop();
		return filename ? `REPL - ${filename}` : 'REPL';
	}

	override get typeId(): string {
		return ReplEditorInput.ID;
	}

	override get editorId(): string | undefined {
		return 'repl';
	}

	override getName() {
		return this.label;
	}

	get editorInputs() {
		return [this];
	}

	override get capabilities() {
		const capabilities = super.capabilities;
		const scratchPad = this.isScratchpad ? EditorInputCapabilities.Scratchpad : 0;

		return capabilities
			| EditorInputCapabilities.Readonly
			| scratchPad;
	}

	override async resolve() {
		const model = await super.resolve();
		if (model) {
			this.ensureInputBoxCell(model.notebook);
		}

		return model;
	}

	private ensureInputBoxCell(notebook: NotebookTextModel) {
		const lastCell = notebook.cells[notebook.cells.length - 1];

		if (!lastCell || lastCell.cellKind === CellKind.Markup || lastCell.outputs.length > 0 || lastCell.internalMetadata.executionOrder !== undefined) {
			notebook.applyEdits([
				{
					editType: CellEditType.Replace,
					index: notebook.cells.length,
					count: 0,
					cells: [
						{
							cellKind: CellKind.Code,
							language: 'python',
							mime: undefined,
							outputs: [],
							source: ''
						}
					]
				}
			], true, undefined, () => undefined, undefined, false);
		}
	}

	async resolveInput(notebook: NotebookTextModel) {
		if (this.inputModelRef) {
			return this.inputModelRef.object.textEditorModel;
		}
		const lastCell = notebook.cells[notebook.cells.length - 1];
		if (!lastCell) {
			throw new Error('The REPL editor requires at least one cell for the input box.');
		}

		this.inputModelRef = await this._textModelService.createModelReference(lastCell.uri);
		return this.inputModelRef.object.textEditorModel;
	}

	override dispose() {
		if (!this.isDisposing) {
			this.isDisposing = true;
			this.editorModelReference?.object.revert({ soft: true });
			this.inputModelRef?.dispose();
			super.dispose();
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/replNotebook/browser/media/interactive.css]---
Location: vscode-main/src/vs/workbench/contrib/replNotebook/browser/media/interactive.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.interactive-editor .input-cell-container {
	box-sizing: border-box;
}

.interactive-editor .input-cell-container .input-focus-indicator {
	position: absolute;
	left: 0px;
	height: 19px;
}

.interactive-editor .input-cell-container .input-focus-indicator::before {
	border-left: 3px solid transparent;
	border-radius: 2px;
	margin-left: 4px;
	content: "";
	position: absolute;
	width: 0px;
	height: 100%;
	z-index: 10;
	left: 0px;
	top: 0px;
	height: 100%;
}

.interactive-editor .input-cell-container .run-button-container {
	position: absolute;
}

.interactive-editor .input-cell-container .run-button-container .monaco-toolbar .actions-container {
	justify-content: center;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/sash/browser/sash.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/sash/browser/sash.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isIOS } from '../../../../base/common/platform.js';
import { localize } from '../../../../nls.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { SashSettingsController } from './sash.js';

// Sash size contribution
registerWorkbenchContribution2(SashSettingsController.ID, SashSettingsController, WorkbenchPhase.AfterRestored);

// Sash size configuration contribution
Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		...workbenchConfigurationNodeBase,
		properties: {
			'workbench.sash.size': {
				type: 'number',
				default: isIOS ? 20 : 4,
				minimum: 1,
				maximum: 20,
				description: localize('sashSize', "Controls the feedback area size in pixels of the dragging area in between views/editors. Set it to a larger value if you feel it's hard to resize views using the mouse.")
			},
			'workbench.sash.hoverDelay': {
				type: 'number',
				default: 300,
				minimum: 0,
				maximum: 2000,
				description: localize('sashHoverDelay', "Controls the hover feedback delay in milliseconds of the dragging area in between views/editors.")
			},
		}
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/sash/browser/sash.ts]---
Location: vscode-main/src/vs/workbench/contrib/sash/browser/sash.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { clamp } from '../../../../base/common/numbers.js';
import { setGlobalSashSize, setGlobalHoverDelay } from '../../../../base/browser/ui/sash/sash.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { createStyleSheet } from '../../../../base/browser/domStylesheets.js';

export const minSize = 1;
export const maxSize = 20; // see also https://ux.stackexchange.com/questions/39023/what-is-the-optimum-button-size-of-touch-screen-applications

export class SashSettingsController extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.sash';

	private readonly styleSheet = createStyleSheet();

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		const onDidChangeSize = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('workbench.sash.size'));
		onDidChangeSize(this.onDidChangeSize, this, this._store);
		this.onDidChangeSize();

		const onDidChangeHoverDelay = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('workbench.sash.hoverDelay'));
		onDidChangeHoverDelay(this.onDidChangeHoverDelay, this, this._store);
		this.onDidChangeHoverDelay();
	}

	private onDidChangeSize(): void {
		const configuredSize = this.configurationService.getValue<number>('workbench.sash.size');
		const size = clamp(configuredSize, 4, 20);
		const hoverSize = clamp(configuredSize, 1, 8);

		this.styleSheet.textContent = `
			.monaco-workbench {
				--vscode-sash-size: ${size}px;
				--vscode-sash-hover-size: ${hoverSize}px;
			}
		`;

		setGlobalSashSize(size);
	}

	private onDidChangeHoverDelay(): void {
		setGlobalHoverDelay(this.configurationService.getValue<number>('workbench.sash.hoverDelay'));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/activity.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/activity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { basename } from '../../../../base/common/resources.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { VIEW_PANE_ID, ISCMService, ISCMRepository, ISCMViewService, ISCMProvider } from '../common/scm.js';
import { IActivityService, NumberBadge } from '../../../services/activity/common/activity.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IStatusbarEntry, IStatusbarService, StatusbarAlignment as MainThreadStatusBarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { EditorResourceAccessor } from '../../../common/editor.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { ITitleService } from '../../../services/title/browser/titleService.js';
import { IEditorGroupContextKeyProvider, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { getRepositoryResourceCount, getSCMRepositoryIcon, getStatusBarCommandGenericName } from './util.js';
import { autorun, derived, IObservable, observableFromEvent } from '../../../../base/common/observable.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { Command } from '../../../../editor/common/languages.js';

const ActiveRepositoryContextKeys = {
	ActiveRepositoryName: new RawContextKey<string>('scmActiveRepositoryName', ''),
	ActiveRepositoryBranchName: new RawContextKey<string>('scmActiveRepositoryBranchName', ''),
};

export class SCMActiveRepositoryController extends Disposable implements IWorkbenchContribution {
	private readonly _repositories: IObservable<Iterable<ISCMRepository>>;
	private readonly _activeRepositoryHistoryItemRefName: IObservable<string | undefined>;
	private readonly _countBadgeConfig: IObservable<'all' | 'focused' | 'off'>;
	private readonly _countBadgeRepositories: IObservable<readonly { provider: ISCMProvider; resourceCount: IObservable<number> }[]>;
	private readonly _countBadge: IObservable<number>;

	private _activeRepositoryNameContextKey: IContextKey<string>;
	private _activeRepositoryBranchNameContextKey: IContextKey<string>;

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@ISCMService private readonly scmService: ISCMService,
		@ISCMViewService private readonly scmViewService: ISCMViewService,
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@ITitleService private readonly titleService: ITitleService
	) {
		super();

		this._activeRepositoryNameContextKey = ActiveRepositoryContextKeys.ActiveRepositoryName.bindTo(this.contextKeyService);
		this._activeRepositoryBranchNameContextKey = ActiveRepositoryContextKeys.ActiveRepositoryBranchName.bindTo(this.contextKeyService);

		this.titleService.registerVariables([
			{ name: 'activeRepositoryName', contextKey: ActiveRepositoryContextKeys.ActiveRepositoryName.key },
			{ name: 'activeRepositoryBranchName', contextKey: ActiveRepositoryContextKeys.ActiveRepositoryBranchName.key, }
		]);

		this._countBadgeConfig = observableConfigValue<'all' | 'focused' | 'off'>('scm.countBadge', 'all', this.configurationService);

		this._repositories = observableFromEvent(this,
			Event.any(this.scmService.onDidAddRepository, this.scmService.onDidRemoveRepository),
			() => this.scmService.repositories);

		this._activeRepositoryHistoryItemRefName = derived(reader => {
			const activeRepository = this.scmViewService.activeRepository.read(reader);
			const historyProvider = activeRepository?.repository.provider.historyProvider.read(reader);
			const historyItemRef = historyProvider?.historyItemRef.read(reader);

			return historyItemRef?.name;
		});

		this._countBadgeRepositories = derived(this, reader => {
			switch (this._countBadgeConfig.read(reader)) {
				case 'all': {
					const repositories = this._repositories.read(reader);
					return [...Iterable.map(repositories, r => ({ provider: r.provider, resourceCount: this._getRepositoryResourceCount(r) }))];
				}
				case 'focused': {
					const activeRepository = this.scmViewService.activeRepository.read(reader);
					return activeRepository ? [{ provider: activeRepository.repository.provider, resourceCount: this._getRepositoryResourceCount(activeRepository.repository) }] : [];
				}
				case 'off':
					return [];
				default:
					throw new Error('Invalid countBadge setting');
			}
		});

		this._countBadge = derived(this, reader => {
			let total = 0;

			for (const repository of this._countBadgeRepositories.read(reader)) {
				const count = repository.provider.count?.read(reader);
				const resourceCount = repository.resourceCount.read(reader);

				total = total + (count ?? resourceCount);
			}

			return total;
		});

		this._register(autorun(reader => {
			const countBadge = this._countBadge.read(reader);
			this._updateActivityCountBadge(countBadge, reader.store);
		}));

		this._register(autorun(reader => {
			const activeRepository = this.scmViewService.activeRepository.read(reader);
			const commands = activeRepository?.repository.provider.statusBarCommands.read(reader);

			this._updateStatusBar(activeRepository, commands ?? [], reader.store);
		}));

		this._register(autorun(reader => {
			const activeRepository = this.scmViewService.activeRepository.read(reader);
			const historyItemRefName = this._activeRepositoryHistoryItemRefName.read(reader);

			this._updateActiveRepositoryContextKeys(activeRepository?.repository.provider.name, historyItemRefName);
		}));
	}

	private _getRepositoryResourceCount(repository: ISCMRepository): IObservable<number> {
		return observableFromEvent(this, repository.provider.onDidChangeResources, () => /** @description repositoryResourceCount */ getRepositoryResourceCount(repository.provider));
	}

	private _updateActivityCountBadge(count: number, store: DisposableStore): void {
		if (count === 0) {
			return;
		}

		const badge = new NumberBadge(count, num => localize('scmPendingChangesBadge', '{0} pending changes', num));
		store.add(this.activityService.showViewActivity(VIEW_PANE_ID, { badge }));
	}

	private _updateStatusBar(activeRepository: { repository: ISCMRepository; pinned: boolean } | undefined, commands: readonly Command[], store: DisposableStore): void {
		if (!activeRepository) {
			return;
		}

		const label = activeRepository.repository.provider.rootUri
			? `${basename(activeRepository.repository.provider.rootUri)} (${activeRepository.repository.provider.label})`
			: activeRepository.repository.provider.label;

		for (let index = 0; index < commands.length; index++) {
			const command = commands[index];
			const tooltip = `${label}${command.tooltip ? ` - ${command.tooltip}` : ''}`;
			const genericCommandName = getStatusBarCommandGenericName(command);

			const statusbarEntry: IStatusbarEntry = {
				name: localize('status.scm', "Source Control") + (genericCommandName ? ` ${genericCommandName}` : ''),
				text: command.title,
				ariaLabel: tooltip,
				tooltip,
				command: command.id ? command : undefined
			};

			store.add(index === 0 ?
				this.statusbarService.addEntry(statusbarEntry, `status.scm.${index}`, MainThreadStatusBarAlignment.LEFT, 10000) :
				this.statusbarService.addEntry(statusbarEntry, `status.scm.${index}`, MainThreadStatusBarAlignment.LEFT, { location: { id: `status.scm.${index - 1}`, priority: 10000 }, alignment: MainThreadStatusBarAlignment.RIGHT, compact: true })
			);
		}

		// Source control provider status bar entry
		if (this.scmService.repositoryCount > 1) {
			const icon = getSCMRepositoryIcon(activeRepository, activeRepository.repository);
			const repositoryStatusbarEntry: IStatusbarEntry = {
				name: localize('status.scm.provider', "Source Control Provider"),
				text: `$(${icon.id}) ${activeRepository.repository.provider.name}`,
				ariaLabel: label,
				tooltip: label,
				command: 'scm.setActiveProvider'
			};

			store.add(this.statusbarService.addEntry(repositoryStatusbarEntry, 'status.scm.provider', MainThreadStatusBarAlignment.LEFT, { location: { id: `status.scm.0`, priority: 10000 }, alignment: MainThreadStatusBarAlignment.LEFT, compact: true }));
		}
	}

	private _updateActiveRepositoryContextKeys(repositoryName: string | undefined, branchName: string | undefined): void {
		this._activeRepositoryNameContextKey.set(repositoryName ?? '');
		this._activeRepositoryBranchNameContextKey.set(branchName ?? '');
	}
}

export class SCMActiveResourceContextKeyController extends Disposable implements IWorkbenchContribution {
	private readonly _repositories: IObservable<Iterable<ISCMRepository>>;

	private readonly _onDidRepositoryChange = new Emitter<void>();

	constructor(
		@IEditorGroupsService editorGroupsService: IEditorGroupsService,
		@ISCMService private readonly scmService: ISCMService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		super();

		const activeResourceHasChangesContextKey = new RawContextKey<boolean>('scmActiveResourceHasChanges', false, localize('scmActiveResourceHasChanges', "Whether the active resource has changes"));
		const activeResourceRepositoryContextKey = new RawContextKey<string | undefined>('scmActiveResourceRepository', undefined, localize('scmActiveResourceRepository', "The active resource's repository"));

		this._repositories = observableFromEvent(this,
			Event.any(this.scmService.onDidAddRepository, this.scmService.onDidRemoveRepository),
			() => this.scmService.repositories);

		this._register(autorun((reader) => {
			for (const repository of this._repositories.read(reader)) {
				reader.store.add(Event.runAndSubscribe(repository.provider.onDidChangeResources, () => {
					this._onDidRepositoryChange.fire();
				}));
			}
		}));

		// Create context key providers which will update the context keys based on each groups active editor
		const hasChangesContextKeyProvider: IEditorGroupContextKeyProvider<boolean> = {
			contextKey: activeResourceHasChangesContextKey,
			getGroupContextKeyValue: (group) => this._getEditorHasChanges(group.activeEditor),
			onDidChange: this._onDidRepositoryChange.event
		};

		const repositoryContextKeyProvider: IEditorGroupContextKeyProvider<string | undefined> = {
			contextKey: activeResourceRepositoryContextKey,
			getGroupContextKeyValue: (group) => this._getEditorRepositoryId(group.activeEditor),
			onDidChange: this._onDidRepositoryChange.event
		};

		this._store.add(editorGroupsService.registerContextKeyProvider(hasChangesContextKeyProvider));
		this._store.add(editorGroupsService.registerContextKeyProvider(repositoryContextKeyProvider));
	}

	private _getEditorHasChanges(activeEditor: EditorInput | null): boolean {
		const activeResource = EditorResourceAccessor.getOriginalUri(activeEditor);
		if (!activeResource) {
			return false;
		}

		const activeResourceRepository = this.scmService.getRepository(activeResource);
		for (const resourceGroup of activeResourceRepository?.provider.groups ?? []) {
			if (resourceGroup.resources
				.some(scmResource =>
					this.uriIdentityService.extUri.isEqual(activeResource, scmResource.sourceUri))) {
				return true;
			}
		}

		return false;
	}

	private _getEditorRepositoryId(activeEditor: EditorInput | null): string | undefined {
		const activeResource = EditorResourceAccessor.getOriginalUri(activeEditor);
		if (!activeResource) {
			return undefined;
		}

		const activeResourceRepository = this.scmService.getRepository(activeResource);
		return activeResourceRepository?.id;
	}

	override dispose(): void {
		this._onDidRepositoryChange.dispose();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/menus.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/menus.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAction } from '../../../../base/common/actions.js';
import { equals } from '../../../../base/common/arrays.js';
import { Emitter } from '../../../../base/common/event.js';
import { DisposableStore, IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import './media/scm.css';
import { localize } from '../../../../nls.js';
import { getActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IMenu, IMenuService, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../platform/instantiation/common/serviceCollection.js';
import { ISCMMenus, ISCMProvider, ISCMRepository, ISCMRepositoryMenus, ISCMResource, ISCMResourceGroup, ISCMService } from '../common/scm.js';
import { ISCMArtifact, ISCMArtifactGroup } from '../common/artifact.js';

function actionEquals(a: IAction, b: IAction): boolean {
	return a.id === b.id;
}

export class SCMTitleMenu implements IDisposable {

	private _actions: IAction[] = [];
	get actions(): IAction[] { return this._actions; }

	private _secondaryActions: IAction[] = [];
	get secondaryActions(): IAction[] { return this._secondaryActions; }

	private readonly _onDidChangeTitle = new Emitter<void>();
	readonly onDidChangeTitle = this._onDidChangeTitle.event;

	readonly menu: IMenu;
	private readonly disposables = new DisposableStore();

	constructor(
		@IMenuService menuService: IMenuService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		this.menu = menuService.createMenu(MenuId.SCMTitle, contextKeyService);
		this.disposables.add(this.menu);

		this.menu.onDidChange(this.updateTitleActions, this, this.disposables);
		this.updateTitleActions();
	}

	private updateTitleActions(): void {
		const { primary, secondary } = getActionBarActions(this.menu.getActions({ shouldForwardArgs: true }));

		if (equals(primary, this._actions, actionEquals) && equals(secondary, this._secondaryActions, actionEquals)) {
			return;
		}

		this._actions = primary;
		this._secondaryActions = secondary;

		this._onDidChangeTitle.fire();
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

interface IContextualMenuItem {
	readonly menu: IMenu;
	dispose(): void;
}

class SCMMenusItem implements IDisposable {

	private _resourceFolderMenu: IMenu | undefined;
	get resourceFolderMenu(): IMenu {
		if (!this._resourceFolderMenu) {
			this._resourceFolderMenu = this.menuService.createMenu(MenuId.SCMResourceFolderContext, this.contextKeyService);
		}

		return this._resourceFolderMenu;
	}

	private genericResourceGroupMenu: IMenu | undefined;
	private contextualResourceGroupMenus: Map<string /* contextValue */, IContextualMenuItem> | undefined;

	private genericResourceMenu: IMenu | undefined;
	private contextualResourceMenus: Map<string /* contextValue */, IContextualMenuItem> | undefined;

	constructor(
		private readonly contextKeyService: IContextKeyService,
		private readonly menuService: IMenuService
	) { }

	getResourceGroupMenu(resourceGroup: ISCMResourceGroup): IMenu {
		if (typeof resourceGroup.contextValue === 'undefined') {
			if (!this.genericResourceGroupMenu) {
				this.genericResourceGroupMenu = this.menuService.createMenu(MenuId.SCMResourceGroupContext, this.contextKeyService);
			}

			return this.genericResourceGroupMenu;
		}

		if (!this.contextualResourceGroupMenus) {
			this.contextualResourceGroupMenus = new Map<string, IContextualMenuItem>();
		}

		let item = this.contextualResourceGroupMenus.get(resourceGroup.contextValue);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([['scmResourceGroupState', resourceGroup.contextValue]]);
			const menu = this.menuService.createMenu(MenuId.SCMResourceGroupContext, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.contextualResourceGroupMenus.set(resourceGroup.contextValue, item);
		}

		return item.menu;
	}

	getResourceMenu(resource: ISCMResource): IMenu {
		if (typeof resource.contextValue === 'undefined') {
			if (!this.genericResourceMenu) {
				this.genericResourceMenu = this.menuService.createMenu(MenuId.SCMResourceContext, this.contextKeyService);
			}

			return this.genericResourceMenu;
		}

		if (!this.contextualResourceMenus) {
			this.contextualResourceMenus = new Map<string, IContextualMenuItem>();
		}

		let item = this.contextualResourceMenus.get(resource.contextValue);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([['scmResourceState', resource.contextValue]]);
			const menu = this.menuService.createMenu(MenuId.SCMResourceContext, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.contextualResourceMenus.set(resource.contextValue, item);
		}

		return item.menu;
	}

	dispose(): void {
		this.genericResourceGroupMenu?.dispose();
		this.genericResourceMenu?.dispose();
		this._resourceFolderMenu?.dispose();

		if (this.contextualResourceGroupMenus) {
			dispose(this.contextualResourceGroupMenus.values());
			this.contextualResourceGroupMenus.clear();
			this.contextualResourceGroupMenus = undefined;
		}

		if (this.contextualResourceMenus) {
			dispose(this.contextualResourceMenus.values());
			this.contextualResourceMenus.clear();
			this.contextualResourceMenus = undefined;
		}
	}
}

export class SCMRepositoryMenus implements ISCMRepositoryMenus, IDisposable {

	private contextKeyService: IContextKeyService;

	readonly titleMenu: SCMTitleMenu;

	private genericRepositoryMenu: IMenu | undefined;
	private contextualRepositoryMenus: Map<string /* contextValue */, IContextualMenuItem> | undefined;

	private genericRepositoryContextMenu: IMenu | undefined;
	private contextualRepositoryContextMenus: Map<string /* contextValue */, IContextualMenuItem> | undefined;

	private artifactGroupMenus = new Map<string /* artifactGroupId */, IContextualMenuItem>();
	private artifactMenus = new Map<string /* artifactGroupId */, IContextualMenuItem>();

	private readonly resourceGroupMenusItems = new Map<ISCMResourceGroup, SCMMenusItem>();

	private readonly disposables = new DisposableStore();

	constructor(
		private readonly provider: ISCMProvider,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IMenuService private readonly menuService: IMenuService
	) {
		this.contextKeyService = contextKeyService.createOverlay([
			['scmProvider', provider.providerId],
			['scmProviderRootUri', provider.rootUri?.toString()],
			['scmProviderHasRootUri', !!provider.rootUri],
		]);

		const serviceCollection = new ServiceCollection([IContextKeyService, this.contextKeyService]);
		instantiationService = instantiationService.createChild(serviceCollection, this.disposables);
		this.titleMenu = instantiationService.createInstance(SCMTitleMenu);
		this.disposables.add(this.titleMenu);

		provider.onDidChangeResourceGroups(this.onDidChangeResourceGroups, this, this.disposables);
		this.onDidChangeResourceGroups();
	}

	getArtifactGroupMenu(artifactGroup: ISCMArtifactGroup): IMenu {
		let item = this.artifactGroupMenus.get(artifactGroup.id);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([['scmArtifactGroup', artifactGroup.id]]);
			const menu = this.menuService.createMenu(MenuId.SCMArtifactGroupContext, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.artifactGroupMenus.set(artifactGroup.id, item);
		}

		return item.menu;
	}

	getArtifactMenu(artifactGroup: ISCMArtifactGroup, artifact: ISCMArtifact): IMenu {
		const historyProvider = this.provider.historyProvider.get();
		const historyItemRef = historyProvider?.historyItemRef.get();
		const isHistoryItemRef = artifact.id === historyItemRef?.id;

		const key = isHistoryItemRef ? `${artifactGroup.id}|historyItemRef` : artifactGroup.id;
		let item = this.artifactMenus.get(key);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([
				['scmArtifactGroupId', artifactGroup.id],
				['scmArtifactIsHistoryItemRef', isHistoryItemRef]]);
			const menu = this.menuService.createMenu(MenuId.SCMArtifactContext, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.artifactMenus.set(key, item);
		}

		return item.menu;
	}

	getRepositoryMenu(repository: ISCMRepository): IMenu {
		const contextValue = repository.provider.contextValue.get();
		if (typeof contextValue === 'undefined') {
			if (!this.genericRepositoryMenu) {
				this.genericRepositoryMenu = this.menuService.createMenu(MenuId.SCMSourceControlInline, this.contextKeyService);
			}

			return this.genericRepositoryMenu;
		}

		if (!this.contextualRepositoryMenus) {
			this.contextualRepositoryMenus = new Map<string, IContextualMenuItem>();
		}

		let item = this.contextualRepositoryMenus.get(contextValue);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([['scmProviderContext', contextValue]]);
			const menu = this.menuService.createMenu(MenuId.SCMSourceControlInline, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.contextualRepositoryMenus.set(contextValue, item);
		}

		return item.menu;
	}

	getRepositoryContextMenu(repository: ISCMRepository): IMenu {
		const contextValue = repository.provider.contextValue.get();
		if (typeof contextValue === 'undefined') {
			if (!this.genericRepositoryContextMenu) {
				this.genericRepositoryContextMenu = this.menuService.createMenu(MenuId.SCMSourceControl, this.contextKeyService);
			}

			return this.genericRepositoryContextMenu;
		}

		if (!this.contextualRepositoryContextMenus) {
			this.contextualRepositoryContextMenus = new Map<string, IContextualMenuItem>();
		}

		let item = this.contextualRepositoryContextMenus.get(contextValue);

		if (!item) {
			const contextKeyService = this.contextKeyService.createOverlay([['scmProviderContext', contextValue]]);
			const menu = this.menuService.createMenu(MenuId.SCMSourceControl, contextKeyService);

			item = {
				menu, dispose() {
					menu.dispose();
				}
			};

			this.contextualRepositoryContextMenus.set(contextValue, item);
		}

		return item.menu;
	}

	getResourceGroupMenu(group: ISCMResourceGroup): IMenu {
		return this.getOrCreateResourceGroupMenusItem(group).getResourceGroupMenu(group);
	}

	getResourceMenu(resource: ISCMResource): IMenu {
		return this.getOrCreateResourceGroupMenusItem(resource.resourceGroup).getResourceMenu(resource);
	}

	getResourceFolderMenu(group: ISCMResourceGroup): IMenu {
		return this.getOrCreateResourceGroupMenusItem(group).resourceFolderMenu;
	}

	private getOrCreateResourceGroupMenusItem(group: ISCMResourceGroup): SCMMenusItem {
		let result = this.resourceGroupMenusItems.get(group);

		if (!result) {
			const contextKeyService = this.contextKeyService.createOverlay([
				['scmResourceGroup', group.id],
				['multiDiffEditorEnableViewChanges', group.multiDiffEditorEnableViewChanges],
			]);

			result = new SCMMenusItem(contextKeyService, this.menuService);
			this.resourceGroupMenusItems.set(group, result);
		}

		return result;
	}

	private onDidChangeResourceGroups(): void {
		for (const resourceGroup of this.resourceGroupMenusItems.keys()) {
			if (!this.provider.groups.includes(resourceGroup)) {
				this.resourceGroupMenusItems.get(resourceGroup)?.dispose();
				this.resourceGroupMenusItems.delete(resourceGroup);
			}
		}
	}

	dispose(): void {
		this.genericRepositoryMenu?.dispose();
		if (this.contextualRepositoryMenus) {
			dispose(this.contextualRepositoryMenus.values());
			this.contextualRepositoryMenus.clear();
			this.contextualRepositoryMenus = undefined;
		}
		this.resourceGroupMenusItems.forEach(item => item.dispose());
		this.disposables.dispose();
	}
}

export class SCMMenus implements ISCMMenus, IDisposable {

	readonly titleMenu: SCMTitleMenu;
	private readonly disposables = new DisposableStore();
	private readonly menus = new Map<ISCMProvider, { menus: SCMRepositoryMenus; dispose: () => void }>();

	constructor(
		@ISCMService scmService: ISCMService,
		@IInstantiationService private instantiationService: IInstantiationService
	) {
		this.titleMenu = instantiationService.createInstance(SCMTitleMenu);
		scmService.onDidRemoveRepository(this.onDidRemoveRepository, this, this.disposables);
	}

	private onDidRemoveRepository(repository: ISCMRepository): void {
		const menus = this.menus.get(repository.provider);
		menus?.dispose();
		this.menus.delete(repository.provider);
	}

	getRepositoryMenus(provider: ISCMProvider): SCMRepositoryMenus {
		let result = this.menus.get(provider);

		if (!result) {
			const menus = this.instantiationService.createInstance(SCMRepositoryMenus, provider);
			const dispose = () => {
				menus.dispose();
				this.menus.delete(provider);
			};

			result = { menus, dispose };
			this.menus.set(provider, result);
		}

		return result.menus;
	}

	dispose(): void {
		this.disposables.dispose();
	}
}

MenuRegistry.appendMenuItem(MenuId.SCMResourceContext, {
	title: localize('miShare', "Share"),
	submenu: MenuId.SCMResourceContextShare,
	group: '45_share',
	order: 3,
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/quickDiffDecorator.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/quickDiffDecorator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';

import './media/dirtydiffDecorator.css';
import { Disposable, DisposableStore, DisposableMap, IReference } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { themeColorFromId } from '../../../../platform/theme/common/themeService.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { OverviewRulerLane, IModelDecorationOptions, MinimapPosition, IModelDeltaDecoration } from '../../../../editor/common/model.js';
import * as domStylesheetsJs from '../../../../base/browser/domStylesheets.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ChangeType, getChangeType, IQuickDiffService, QuickDiffProvider, minimapGutterAddedBackground, minimapGutterDeletedBackground, minimapGutterModifiedBackground, overviewRulerAddedForeground, overviewRulerDeletedForeground, overviewRulerModifiedForeground } from '../common/quickDiff.js';
import { QuickDiffModel, IQuickDiffModelService } from './quickDiffModel.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ContextKeyTrueExpr, ContextKeyFalseExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { autorun, IObservable, observableFromEvent } from '../../../../base/common/observable.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';

export const quickDiffDecorationCount = new RawContextKey<number>('quickDiffDecorationCount', 0);

class QuickDiffDecorator extends Disposable {

	static createDecoration(className: string, tooltip: string | null, options: { gutter: boolean; overview: { active: boolean; color: string }; minimap: { active: boolean; color: string }; isWholeLine: boolean }): ModelDecorationOptions {
		const decorationOptions: IModelDecorationOptions = {
			description: 'dirty-diff-decoration',
			isWholeLine: options.isWholeLine,
		};

		if (options.gutter) {
			decorationOptions.linesDecorationsClassName = `dirty-diff-glyph ${className}`;
			decorationOptions.linesDecorationsTooltip = tooltip;
		}

		if (options.overview.active) {
			decorationOptions.overviewRuler = {
				color: themeColorFromId(options.overview.color),
				position: OverviewRulerLane.Left
			};
		}

		if (options.minimap.active) {
			decorationOptions.minimap = {
				color: themeColorFromId(options.minimap.color),
				position: MinimapPosition.Gutter
			};
		}

		return ModelDecorationOptions.createDynamic(decorationOptions);
	}

	private addedOptions: ModelDecorationOptions;
	private addedSecondaryOptions: ModelDecorationOptions;
	private addedPatternOptions: ModelDecorationOptions;
	private addedSecondaryPatternOptions: ModelDecorationOptions;
	private modifiedOptions: ModelDecorationOptions;
	private modifiedSecondaryOptions: ModelDecorationOptions;
	private modifiedPatternOptions: ModelDecorationOptions;
	private modifiedSecondaryPatternOptions: ModelDecorationOptions;
	private deletedOptions: ModelDecorationOptions;
	private deletedSecondaryOptions: ModelDecorationOptions;
	private decorationsCollection: IEditorDecorationsCollection | undefined;

	constructor(
		private readonly codeEditor: ICodeEditor,
		private readonly quickDiffModelRef: IReference<QuickDiffModel>,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService
	) {
		super();

		const decorations = configurationService.getValue<string>('scm.diffDecorations');
		const gutter = decorations === 'all' || decorations === 'gutter';
		const overview = decorations === 'all' || decorations === 'overview';
		const minimap = decorations === 'all' || decorations === 'minimap';

		const diffAdded = nls.localize('diffAdded', 'Added lines');
		const diffAddedOptions = {
			gutter,
			overview: { active: overview, color: overviewRulerAddedForeground },
			minimap: { active: minimap, color: minimapGutterAddedBackground },
			isWholeLine: true
		};
		this.addedOptions = QuickDiffDecorator.createDecoration('dirty-diff-added primary', diffAdded, diffAddedOptions);
		this.addedPatternOptions = QuickDiffDecorator.createDecoration('dirty-diff-added primary pattern', diffAdded, diffAddedOptions);
		this.addedSecondaryOptions = QuickDiffDecorator.createDecoration('dirty-diff-added secondary', diffAdded, diffAddedOptions);
		this.addedSecondaryPatternOptions = QuickDiffDecorator.createDecoration('dirty-diff-added secondary pattern', diffAdded, diffAddedOptions);

		const diffModified = nls.localize('diffModified', 'Changed lines');
		const diffModifiedOptions = {
			gutter,
			overview: { active: overview, color: overviewRulerModifiedForeground },
			minimap: { active: minimap, color: minimapGutterModifiedBackground },
			isWholeLine: true
		};
		this.modifiedOptions = QuickDiffDecorator.createDecoration('dirty-diff-modified primary', diffModified, diffModifiedOptions);
		this.modifiedPatternOptions = QuickDiffDecorator.createDecoration('dirty-diff-modified primary pattern', diffModified, diffModifiedOptions);
		this.modifiedSecondaryOptions = QuickDiffDecorator.createDecoration('dirty-diff-modified secondary', diffModified, diffModifiedOptions);
		this.modifiedSecondaryPatternOptions = QuickDiffDecorator.createDecoration('dirty-diff-modified secondary pattern', diffModified, diffModifiedOptions);

		const diffDeleted = nls.localize('diffDeleted', 'Removed lines');
		const diffDeletedOptions = {
			gutter,
			overview: { active: overview, color: overviewRulerDeletedForeground },
			minimap: { active: minimap, color: minimapGutterDeletedBackground },
			isWholeLine: false
		};
		this.deletedOptions = QuickDiffDecorator.createDecoration('dirty-diff-deleted primary', diffDeleted, diffDeletedOptions);
		this.deletedSecondaryOptions = QuickDiffDecorator.createDecoration('dirty-diff-deleted secondary', diffDeleted, diffDeletedOptions);

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('scm.diffDecorationsGutterPattern')) {
				this.onDidChange();
			}
		}));

		this._register(Event.runAndSubscribe(this.quickDiffModelRef.object.onDidChange, () => this.onDidChange()));
	}

	private onDidChange(): void {
		if (!this.codeEditor.hasModel()) {
			return;
		}

		const pattern = this.configurationService.getValue<{ added: boolean; modified: boolean }>('scm.diffDecorationsGutterPattern');

		const primaryQuickDiff = this.quickDiffModelRef.object.quickDiffs.find(quickDiff => quickDiff.kind === 'primary');
		const primaryQuickDiffChanges = this.quickDiffModelRef.object.changes.filter(change => change.providerId === primaryQuickDiff?.id);

		const decorations: IModelDeltaDecoration[] = [];
		for (const change of this.quickDiffModelRef.object.changes) {
			const quickDiff = this.quickDiffModelRef.object.quickDiffs
				.find(quickDiff => quickDiff.id === change.providerId);

			// Skip quick diffs that are not visible
			if (!quickDiff || !this.quickDiffService.isQuickDiffProviderVisible(quickDiff.id)) {
				continue;
			}

			if (quickDiff.kind !== 'primary' && primaryQuickDiffChanges.some(c => c.change2.modified.intersectsOrTouches(change.change2.modified))) {
				// Overlap with primary quick diff changes
				continue;
			}

			const changeType = getChangeType(change.change);
			const startLineNumber = change.change.modifiedStartLineNumber;
			const endLineNumber = change.change.modifiedEndLineNumber || startLineNumber;

			switch (changeType) {
				case ChangeType.Add:
					decorations.push({
						range: {
							startLineNumber: startLineNumber, startColumn: 1,
							endLineNumber: endLineNumber, endColumn: 1
						},
						options: quickDiff.kind === 'primary' || quickDiff.kind === 'contributed'
							? pattern.added ? this.addedPatternOptions : this.addedOptions
							: pattern.added ? this.addedSecondaryPatternOptions : this.addedSecondaryOptions
					});
					break;
				case ChangeType.Delete:
					decorations.push({
						range: {
							startLineNumber: startLineNumber, startColumn: Number.MAX_VALUE,
							endLineNumber: startLineNumber, endColumn: Number.MAX_VALUE
						},
						options: quickDiff.kind === 'primary' || quickDiff.kind === 'contributed'
							? this.deletedOptions
							: this.deletedSecondaryOptions
					});
					break;
				case ChangeType.Modify:
					decorations.push({
						range: {
							startLineNumber: startLineNumber, startColumn: 1,
							endLineNumber: endLineNumber, endColumn: 1
						},
						options: quickDiff.kind === 'primary' || quickDiff.kind === 'contributed'
							? pattern.modified ? this.modifiedPatternOptions : this.modifiedOptions
							: pattern.modified ? this.modifiedSecondaryPatternOptions : this.modifiedSecondaryOptions
					});
					break;
			}
		}

		if (!this.decorationsCollection) {
			this.decorationsCollection = this.codeEditor.createDecorationsCollection(decorations);
		} else {
			this.decorationsCollection.set(decorations);
		}
	}

	override dispose(): void {
		if (this.decorationsCollection) {
			this.decorationsCollection.clear();
		}
		this.decorationsCollection = undefined;
		this.quickDiffModelRef.dispose();
		super.dispose();
	}
}

interface QuickDiffWorkbenchControllerViewState {
	readonly width: number;
	readonly visibility: 'always' | 'hover';
}

export class QuickDiffWorkbenchController extends Disposable implements IWorkbenchContribution {

	private enabled = false;
	private readonly quickDiffDecorationCount: IContextKey<number>;

	private readonly activeEditor: IObservable<EditorInput | undefined>;
	private readonly quickDiffProviders: IObservable<readonly QuickDiffProvider[]>;

	// Resource URI -> Code Editor Id -> Decoration (Disposable)
	private readonly decorators = new ResourceMap<DisposableMap<string>>();
	private viewState: QuickDiffWorkbenchControllerViewState = { width: 3, visibility: 'always' };
	private readonly transientDisposables = this._register(new DisposableStore());
	private readonly stylesheet: HTMLStyleElement;

	constructor(
		@IEditorService private readonly editorService: IEditorService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IQuickDiffModelService private readonly quickDiffModelService: IQuickDiffModelService,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super();
		this.stylesheet = domStylesheetsJs.createStyleSheet(undefined, undefined, this._store);

		this.quickDiffDecorationCount = quickDiffDecorationCount.bindTo(contextKeyService);

		this.activeEditor = observableFromEvent(this,
			this.editorService.onDidActiveEditorChange, () => this.editorService.activeEditor);

		this.quickDiffProviders = observableFromEvent(this,
			this.quickDiffService.onDidChangeQuickDiffProviders, () => this.quickDiffService.providers);

		const onDidChangeConfiguration = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('scm.diffDecorations'));
		this._register(onDidChangeConfiguration(this.onDidChangeConfiguration, this));
		this.onDidChangeConfiguration();

		const onDidChangeDiffWidthConfiguration = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('scm.diffDecorationsGutterWidth'));
		this._register(onDidChangeDiffWidthConfiguration(this.onDidChangeDiffWidthConfiguration, this));
		this.onDidChangeDiffWidthConfiguration();

		const onDidChangeDiffVisibilityConfiguration = Event.filter(configurationService.onDidChangeConfiguration, e => e.affectsConfiguration('scm.diffDecorationsGutterVisibility'));
		this._register(onDidChangeDiffVisibilityConfiguration(this.onDidChangeDiffVisibilityConfiguration, this));
		this.onDidChangeDiffVisibilityConfiguration();
	}

	private onDidChangeConfiguration(): void {
		const enabled = this.configurationService.getValue<string>('scm.diffDecorations') !== 'none';

		if (enabled) {
			this.enable();
		} else {
			this.disable();
		}
	}

	private onDidChangeDiffWidthConfiguration(): void {
		let width = this.configurationService.getValue<number>('scm.diffDecorationsGutterWidth');

		if (isNaN(width) || width <= 0 || width > 5) {
			width = 3;
		}

		this.setViewState({ ...this.viewState, width });
	}

	private onDidChangeDiffVisibilityConfiguration(): void {
		const visibility = this.configurationService.getValue<'always' | 'hover'>('scm.diffDecorationsGutterVisibility');
		this.setViewState({ ...this.viewState, visibility });
	}

	private setViewState(state: QuickDiffWorkbenchControllerViewState): void {
		this.viewState = state;
		this.stylesheet.textContent = `
			.monaco-editor .dirty-diff-added,
			.monaco-editor .dirty-diff-modified {
				border-left-width:${state.width}px;
			}
			.monaco-editor .dirty-diff-added.pattern,
			.monaco-editor .dirty-diff-added.pattern:before,
			.monaco-editor .dirty-diff-modified.pattern,
			.monaco-editor .dirty-diff-modified.pattern:before {
				background-size: ${state.width}px ${state.width}px;
			}
			.monaco-editor .dirty-diff-added,
			.monaco-editor .dirty-diff-modified,
			.monaco-editor .dirty-diff-deleted {
				opacity: ${state.visibility === 'always' ? 1 : 0};
			}
		`;
	}

	private enable(): void {
		if (this.enabled) {
			this.disable();
		}

		this.transientDisposables.add(Event.any(this.editorService.onDidCloseEditor, this.editorService.onDidVisibleEditorsChange)(() => this.onEditorsChanged()));
		this.onEditorsChanged();

		this.onDidActiveEditorChange();
		this.onDidChangeQuickDiffProviders();

		this.enabled = true;
	}

	private disable(): void {
		if (!this.enabled) {
			return;
		}

		this.transientDisposables.clear();
		this.quickDiffDecorationCount.set(0);

		for (const [uri, decoratorMap] of this.decorators.entries()) {
			decoratorMap.dispose();
			this.decorators.delete(uri);
		}

		this.enabled = false;
	}

	private onDidActiveEditorChange(): void {
		this.transientDisposables.add(autorun(reader => {
			const activeEditor = this.activeEditor.read(reader);
			const activeTextEditorControl = this.editorService.activeTextEditorControl;

			if (!isCodeEditor(activeTextEditorControl) || !activeEditor?.resource) {
				this.quickDiffDecorationCount.set(0);
				return;
			}

			const quickDiffModelRef = this.quickDiffModelService.createQuickDiffModelReference(activeEditor.resource);
			if (!quickDiffModelRef) {
				this.quickDiffDecorationCount.set(0);
				return;
			}

			reader.store.add(quickDiffModelRef);

			const visibleDecorationCount = observableFromEvent(this,
				quickDiffModelRef.object.onDidChange, () => {
					const visibleQuickDiffs = quickDiffModelRef.object.quickDiffs.filter(quickDiff => this.quickDiffService.isQuickDiffProviderVisible(quickDiff.id));
					return quickDiffModelRef.object.changes.filter(change => visibleQuickDiffs.some(quickDiff => quickDiff.id === change.providerId)).length;
				});

			reader.store.add(autorun(reader => {
				const count = visibleDecorationCount.read(reader);
				this.quickDiffDecorationCount.set(count);
			}));
		}));
	}

	private onDidChangeQuickDiffProviders(): void {
		this.transientDisposables.add(autorun(reader => {
			const providers = this.quickDiffProviders.read(reader);

			const labels: string[] = [];
			for (let index = 0; index < providers.length; index++) {
				const provider = providers[index];
				if (labels.includes(provider.label)) {
					continue;
				}

				const visible = this.quickDiffService.isQuickDiffProviderVisible(provider.id);
				const group = provider.kind !== 'contributed' ? '0_scm' : '1_contributed';
				const order = index + 1;

				reader.store.add(registerAction2(class extends Action2 {
					constructor() {
						super({
							id: `workbench.scm.action.toggleQuickDiffVisibility.${provider.id}`,
							title: provider.label,
							toggled: visible ? ContextKeyTrueExpr.INSTANCE : ContextKeyFalseExpr.INSTANCE,
							menu: {
								id: MenuId.SCMQuickDiffDecorations, group, order
							},
							f1: false
						});
					}
					override run(accessor: ServicesAccessor): void {
						const quickDiffService = accessor.get(IQuickDiffService);
						quickDiffService.toggleQuickDiffProviderVisibility(provider.id);
					}
				}));
				labels.push(provider.label);
			}
		}));
	}

	private onEditorsChanged(): void {
		for (const editor of this.editorService.visibleTextEditorControls) {
			if (!isCodeEditor(editor)) {
				continue;
			}

			const textModel = editor.getModel();
			if (!textModel) {
				continue;
			}

			const editorId = editor.getId();
			if (this.decorators.get(textModel.uri)?.has(editorId)) {
				continue;
			}

			const quickDiffModelRef = this.quickDiffModelService.createQuickDiffModelReference(textModel.uri);
			if (!quickDiffModelRef) {
				continue;
			}

			if (!this.decorators.has(textModel.uri)) {
				this.decorators.set(textModel.uri, new DisposableMap<string>());
			}

			this.decorators.get(textModel.uri)!.set(editorId, new QuickDiffDecorator(editor, quickDiffModelRef, this.configurationService, this.quickDiffService));
		}

		// Dispose decorators for editors that are no longer visible.
		for (const [uri, decoratorMap] of this.decorators.entries()) {
			for (const editorId of decoratorMap.keys()) {
				const codeEditor = this.editorService.visibleTextEditorControls
					.find(editor => isCodeEditor(editor) && editor.getId() === editorId &&
						this.uriIdentityService.extUri.isEqual(editor.getModel()?.uri, uri));

				if (!codeEditor) {
					decoratorMap.deleteAndDispose(editorId);
				}
			}

			if (decoratorMap.size === 0) {
				decoratorMap.dispose();
				this.decorators.delete(uri);
			}
		}
	}

	override dispose(): void {
		this.disable();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/scm/browser/quickDiffModel.ts]---
Location: vscode-main/src/vs/workbench/contrib/scm/browser/quickDiffModel.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ResourceMap } from '../../../../base/common/map.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { EncodingMode, IResolvedTextFileEditorModel, isTextFileEditorModel, ITextFileEditorModel, ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { Disposable, DisposableMap, DisposableStore, IReference, ReferenceCollection } from '../../../../base/common/lifecycle.js';
import { DiffAlgorithmName, IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { URI } from '../../../../base/common/uri.js';
import { IChange } from '../../../../editor/common/diff/legacyLinesDiffComputer.js';
import { IResolvedTextEditorModel, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { ITextModel, shouldSynchronizeModel } from '../../../../editor/common/model.js';
import { compareChanges, getModifiedEndLineNumber, IQuickDiffService, QuickDiff, QuickDiffChange, QuickDiffResult } from '../common/quickDiff.js';
import { ThrottledDelayer } from '../../../../base/common/async.js';
import { ISCMRepository, ISCMService } from '../common/scm.js';
import { sortedDiff, equals } from '../../../../base/common/arrays.js';
import { onUnexpectedError } from '../../../../base/common/errors.js';
import { Iterable } from '../../../../base/common/iterator.js';
import { ISplice } from '../../../../base/common/sequence.js';
import { DiffState } from '../../../../editor/browser/widget/diffEditor/diffEditorViewModel.js';
import { toLineChanges } from '../../../../editor/browser/widget/diffEditor/diffEditorWidget.js';
import { LineRangeMapping } from '../../../../editor/common/diff/rangeMapping.js';
import { IDiffEditorModel } from '../../../../editor/common/editorCommon.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IChatEditingService, ModifiedFileEntryState } from '../../chat/common/chatEditingService.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { autorun } from '../../../../base/common/observable.js';

export const IQuickDiffModelService = createDecorator<IQuickDiffModelService>('IQuickDiffModelService');

export interface QuickDiffModelOptions {
	readonly algorithm: DiffAlgorithmName;
	readonly maxComputationTimeMs?: number;
}

const decoratorQuickDiffModelOptions: QuickDiffModelOptions = {
	algorithm: 'advanced',
	maxComputationTimeMs: 1000
};

export interface IQuickDiffModelService {
	_serviceBrand: undefined;

	/**
	 * Returns `undefined` if the editor model is not resolved.
	 * Model refrence has to be disposed once not needed anymore.
	 * @param resource
	 * @param options
	 */
	createQuickDiffModelReference(resource: URI, options?: QuickDiffModelOptions): IReference<QuickDiffModel> | undefined;
}

class QuickDiffModelReferenceCollection extends ReferenceCollection<QuickDiffModel> {
	constructor(@IInstantiationService private readonly _instantiationService: IInstantiationService) {
		super();
	}

	protected override createReferencedObject(_key: string, textFileModel: IResolvedTextFileEditorModel, options: QuickDiffModelOptions): QuickDiffModel {
		return this._instantiationService.createInstance(QuickDiffModel, textFileModel, options);
	}

	protected override destroyReferencedObject(_key: string, object: QuickDiffModel): void {
		object.dispose();
	}
}

export class QuickDiffModelService implements IQuickDiffModelService {
	_serviceBrand: undefined;

	private readonly _references: QuickDiffModelReferenceCollection;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@ITextFileService private readonly textFileService: ITextFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService
	) {
		this._references = this.instantiationService.createInstance(QuickDiffModelReferenceCollection);
	}

	createQuickDiffModelReference(resource: URI, options: QuickDiffModelOptions = decoratorQuickDiffModelOptions): IReference<QuickDiffModel> | undefined {
		const textFileModel = this.textFileService.files.get(resource);
		if (!textFileModel?.isResolved()) {
			return undefined;
		}

		resource = this.uriIdentityService.asCanonicalUri(resource).with({ query: JSON.stringify(options) });
		return this._references.acquire(resource.toString(), textFileModel, options);
	}
}

export class QuickDiffModel extends Disposable {

	private readonly _model: ITextFileEditorModel;
	private readonly _originalEditorModels = new ResourceMap<IResolvedTextEditorModel>();
	private readonly _originalEditorModelsDisposables = this._register(new DisposableStore());
	get originalTextModels(): Iterable<ITextModel> {
		return Iterable.map(this._originalEditorModels.values(), editorModel => editorModel.textEditorModel);
	}

	private _disposed = false;
	private _quickDiffs: QuickDiff[] = [];
	private _quickDiffsPromise?: Promise<QuickDiff[]>;
	private _diffDelayer = this._register(new ThrottledDelayer<void>(200));

	private readonly _onDidChange = this._register(new Emitter<{ changes: QuickDiffChange[]; diff: ISplice<QuickDiffChange>[] }>());
	readonly onDidChange: Event<{ changes: QuickDiffChange[]; diff: ISplice<QuickDiffChange>[] }> = this._onDidChange.event;

	private _allChanges: QuickDiffChange[] = [];
	get allChanges(): QuickDiffChange[] { return this._allChanges; }

	private _changes: QuickDiffChange[] = [];
	get changes(): QuickDiffChange[] { return this._changes; }

	/**
	 * Map of quick diff name to the index of the change in `this.changes`
	 */
	private _quickDiffChanges: Map<string, number[]> = new Map();
	get quickDiffChanges(): Map<string, number[]> { return this._quickDiffChanges; }

	private readonly _repositoryDisposables = new DisposableMap<ISCMRepository>();

	constructor(
		textFileModel: IResolvedTextFileEditorModel,
		private readonly options: QuickDiffModelOptions,
		@ISCMService private readonly scmService: ISCMService,
		@IQuickDiffService private readonly quickDiffService: IQuickDiffService,
		@IEditorWorkerService private readonly editorWorkerService: IEditorWorkerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@ITextModelService private readonly textModelResolverService: ITextModelService,
		@IChatEditingService private readonly _chatEditingService: IChatEditingService,
		@IProgressService private readonly progressService: IProgressService,
	) {
		super();
		this._model = textFileModel;

		this._register(textFileModel.textEditorModel.onDidChangeContent(() => this.triggerDiff()));
		this._register(
			Event.filter(configurationService.onDidChangeConfiguration,
				e => e.affectsConfiguration('scm.diffDecorationsIgnoreTrimWhitespace') || e.affectsConfiguration('diffEditor.ignoreTrimWhitespace')
			)(this.triggerDiff, this)
		);
		this._register(scmService.onDidAddRepository(this.onDidAddRepository, this));
		for (const r of scmService.repositories) {
			this.onDidAddRepository(r);
		}

		this._register(this._model.onDidChangeEncoding(() => {
			this._diffDelayer.cancel();
			this._quickDiffs = [];
			this._originalEditorModels.clear();
			this._quickDiffsPromise = undefined;
			this.setChanges([], [], new Map());
			this.triggerDiff();
		}));

		this._register(this.quickDiffService.onDidChangeQuickDiffProviders(() => this.triggerDiff()));

		this._register(autorun(reader => {
			for (const session of this._chatEditingService.editingSessionsObs.read(reader)) {
				reader.store.add(autorun(r => {
					for (const entry of session.entries.read(r)) {
						entry.state.read(r); // signal
					}
					this.triggerDiff();
				}));
			}
		}));

		this.triggerDiff();
	}

	get quickDiffs(): readonly QuickDiff[] {
		return this._quickDiffs;
	}

	public getQuickDiffResults(): QuickDiffResult[] {
		return this._quickDiffs.map(quickDiff => {
			const changes = this.allChanges
				.filter(change => change.providerId === quickDiff.id);

			return {
				original: quickDiff.originalResource,
				modified: this._model.resource,
				changes: changes.map(change => change.change),
				changes2: changes.map(change => change.change2)
			} satisfies QuickDiffResult;
		});
	}

	public getDiffEditorModel(originalUri: URI): IDiffEditorModel | undefined {
		const editorModel = this._originalEditorModels.get(originalUri);
		return editorModel ?
			{
				modified: this._model.textEditorModel!,
				original: editorModel.textEditorModel
			} : undefined;
	}

	private onDidAddRepository(repository: ISCMRepository): void {
		const disposables = new DisposableStore();

		disposables.add(repository.provider.onDidChangeResources(this.triggerDiff, this));

		const onDidRemoveRepository = Event.filter(this.scmService.onDidRemoveRepository, r => r === repository);
		disposables.add(onDidRemoveRepository(() => this._repositoryDisposables.deleteAndDispose(repository)));

		this._repositoryDisposables.set(repository, disposables);

		this.triggerDiff();
	}

	private triggerDiff(): void {
		if (!this._diffDelayer) {
			return;
		}

		this._diffDelayer
			.trigger(async () => {
				const result: { allChanges: QuickDiffChange[]; changes: QuickDiffChange[]; mapChanges: Map<string, number[]> } | null = await this.diff();

				const editorModels = Array.from(this._originalEditorModels.values());
				if (!result || this._disposed || this._model.isDisposed() || editorModels.some(editorModel => editorModel.isDisposed())) {
					return; // disposed
				}

				this.setChanges(result.allChanges, result.changes, result.mapChanges);
			})
			.catch(err => onUnexpectedError(err));
	}

	private setChanges(allChanges: QuickDiffChange[], changes: QuickDiffChange[], mapChanges: Map<string, number[]>): void {
		const diff = sortedDiff(this.changes, changes, (a, b) => compareChanges(a.change, b.change));
		this._allChanges = allChanges;
		this._changes = changes;
		this._quickDiffChanges = mapChanges;
		this._onDidChange.fire({ changes, diff });
	}

	private diff(): Promise<{ allChanges: QuickDiffChange[]; changes: QuickDiffChange[]; mapChanges: Map<string, number[]> } | null> {
		return this.progressService.withProgress({ location: ProgressLocation.Scm, delay: 250 }, async () => {
			const originalURIs = await this.getQuickDiffsPromise();
			if (this._disposed || this._model.isDisposed() || (originalURIs.length === 0)) {
				// Disposed
				return Promise.resolve({ allChanges: [], changes: [], mapChanges: new Map() });
			}

			const quickDiffs = originalURIs
				.filter(quickDiff => this.editorWorkerService.canComputeDirtyDiff(quickDiff.originalResource, this._model.resource));
			if (quickDiffs.length === 0) {
				// All files are too large
				return Promise.resolve({ allChanges: [], changes: [], mapChanges: new Map() });
			}

			const quickDiffPrimary = quickDiffs.find(quickDiff => quickDiff.kind === 'primary');

			const ignoreTrimWhitespaceSetting = this.configurationService.getValue<'true' | 'false' | 'inherit'>('scm.diffDecorationsIgnoreTrimWhitespace');
			const ignoreTrimWhitespace = ignoreTrimWhitespaceSetting === 'inherit'
				? this.configurationService.getValue<boolean>('diffEditor.ignoreTrimWhitespace')
				: ignoreTrimWhitespaceSetting !== 'false';

			const diffs: QuickDiffChange[] = [];
			const secondaryDiffs: QuickDiffChange[] = [];

			for (const quickDiff of quickDiffs) {
				const diff = await this._diff(quickDiff.originalResource, this._model.resource, ignoreTrimWhitespace);
				if (diff.changes && diff.changes2 && diff.changes.length === diff.changes2.length) {
					for (let index = 0; index < diff.changes.length; index++) {
						const change2 = diff.changes2[index];

						// The secondary diffs are complimentary to the primary diffs, and
						// they can overlap. We need to remove the secondary quick diffs that
						// overlap for the UI, but we need to expose all diffs through the API.
						if (quickDiffPrimary && quickDiff.kind === 'secondary') {
							// Check whether the:
							// 1. the modified line range is equal
							// 2. the original line range length is equal
							const primaryQuickDiffChange = diffs
								.find(d => d.change2.modified.equals(change2.modified) &&
									d.change2.original.length === change2.original.length);

							if (primaryQuickDiffChange) {
								// Check whether the original content matches
								const primaryModel = this._originalEditorModels.get(quickDiffPrimary.originalResource)?.textEditorModel;
								const primaryContent = primaryModel?.getValueInRange(primaryQuickDiffChange.change2.toRangeMapping().originalRange);

								const secondaryModel = this._originalEditorModels.get(quickDiff.originalResource)?.textEditorModel;
								const secondaryContent = secondaryModel?.getValueInRange(change2.toRangeMapping().originalRange);
								if (primaryContent === secondaryContent) {
									secondaryDiffs.push({
										providerId: quickDiff.id,
										original: quickDiff.originalResource,
										modified: this._model.resource,
										change: diff.changes[index],
										change2: diff.changes2[index]
									});

									continue;
								}
							}
						}

						diffs.push({
							providerId: quickDiff.id,
							original: quickDiff.originalResource,
							modified: this._model.resource,
							change: diff.changes[index],
							change2: diff.changes2[index]
						});
					}
				}
			}

			const diffsSorted = diffs.sort((a, b) => compareChanges(a.change, b.change));
			const allDiffsSorted = [...diffs, ...secondaryDiffs].sort((a, b) => compareChanges(a.change, b.change));

			const map: Map<string, number[]> = new Map();
			for (let i = 0; i < diffsSorted.length; i++) {
				const providerId = diffsSorted[i].providerId;
				if (!map.has(providerId)) {
					map.set(providerId, []);
				}
				map.get(providerId)!.push(i);
			}

			return { allChanges: allDiffsSorted, changes: diffsSorted, mapChanges: map };
		});
	}

	private async _diff(original: URI, modified: URI, ignoreTrimWhitespace: boolean): Promise<{ changes: readonly IChange[] | null; changes2: readonly LineRangeMapping[] | null }> {
		const maxComputationTimeMs = this.options.maxComputationTimeMs ?? Number.MAX_SAFE_INTEGER;

		const result = await this.editorWorkerService.computeDiff(original, modified, {
			computeMoves: false, ignoreTrimWhitespace, maxComputationTimeMs
		}, this.options.algorithm);

		return { changes: result ? toLineChanges(DiffState.fromDiffResult(result)) : null, changes2: result?.changes ?? null };
	}

	private getQuickDiffsPromise(): Promise<QuickDiff[]> {
		if (this._quickDiffsPromise) {
			return this._quickDiffsPromise;
		}

		this._quickDiffsPromise = this.getOriginalResource().then(async (quickDiffs) => {
			if (this._disposed) { // disposed
				return [];
			}

			if (quickDiffs.length === 0) {
				this._quickDiffs = [];
				this._originalEditorModels.clear();
				return [];
			}

			if (equals(this._quickDiffs, quickDiffs, (a, b) =>
				a.id === b.id &&
				a.originalResource.toString() === b.originalResource.toString() &&
				this.quickDiffService.isQuickDiffProviderVisible(a.id) === this.quickDiffService.isQuickDiffProviderVisible(b.id))
			) {
				return quickDiffs;
			}

			this._quickDiffs = quickDiffs;

			this._originalEditorModels.clear();
			this._originalEditorModelsDisposables.clear();
			return (await Promise.all(quickDiffs.map(async (quickDiff) => {
				try {
					const ref = await this.textModelResolverService.createModelReference(quickDiff.originalResource);
					if (this._disposed) { // disposed
						ref.dispose();
						return [];
					}

					this._originalEditorModels.set(quickDiff.originalResource, ref.object);

					if (isTextFileEditorModel(ref.object) && !ref.object.isDirty()) {
						const encoding = this._model.getEncoding();

						if (encoding) {
							(ref.object as ITextFileEditorModel).setEncoding(encoding, EncodingMode.Decode);
						}
					}

					this._originalEditorModelsDisposables.add(ref);
					this._originalEditorModelsDisposables.add(ref.object.textEditorModel.onDidChangeContent(() => this.triggerDiff()));

					return quickDiff;
				} catch (error) {
					return []; // possibly invalid reference
				}
			}))).flat();
		});

		return this._quickDiffsPromise.finally(() => {
			this._quickDiffsPromise = undefined;
		});
	}

	private async getOriginalResource(): Promise<QuickDiff[]> {
		if (this._disposed) {
			return Promise.resolve([]);
		}
		const uri = this._model.resource;

		// disable dirty diff when doing chat edits
		const isBeingModifiedByChatEdits = this._chatEditingService.editingSessionsObs.get()
			.some(session => session.getEntry(uri)?.state.get() === ModifiedFileEntryState.Modified);
		if (isBeingModifiedByChatEdits) {
			return Promise.resolve([]);
		}

		const isSynchronized = this._model.textEditorModel ? shouldSynchronizeModel(this._model.textEditorModel) : undefined;
		return this.quickDiffService.getQuickDiffs(uri, this._model.getLanguageId(), isSynchronized);
	}

	findNextClosestChange(lineNumber: number, inclusive = true, providerId?: string): number {
		const visibleQuickDiffIds = new Set(this.quickDiffs
			.filter(quickDiff => this.quickDiffService.isQuickDiffProviderVisible(quickDiff.id))
			.map(quickDiff => quickDiff.id));

		for (let i = 0; i < this.changes.length; i++) {
			if (providerId && this.changes[i].providerId !== providerId) {
				continue;
			}

			// Skip quick diffs that are not visible
			if (!visibleQuickDiffIds.has(this.changes[i].providerId)) {
				continue;
			}

			const change = this.changes[i].change;

			if (inclusive) {
				if (getModifiedEndLineNumber(change) >= lineNumber) {
					return i;
				}
			} else {
				if (change.modifiedStartLineNumber > lineNumber) {
					return i;
				}
			}
		}

		return 0;
	}

	findPreviousClosestChange(lineNumber: number, inclusive = true, providerId?: string): number {
		const visibleQuickDiffIds = new Set(this.quickDiffs
			.filter(quickDiff => this.quickDiffService.isQuickDiffProviderVisible(quickDiff.id))
			.map(quickDiff => quickDiff.id));

		for (let i = this.changes.length - 1; i >= 0; i--) {
			if (providerId && this.changes[i].providerId !== providerId) {
				continue;
			}

			// Skip quick diffs that are not visible
			if (!visibleQuickDiffIds.has(this.changes[i].providerId)) {
				continue;
			}

			const change = this.changes[i].change;

			if (inclusive) {
				if (change.modifiedStartLineNumber <= lineNumber) {
					return i;
				}
			} else {
				if (getModifiedEndLineNumber(change) < lineNumber) {
					return i;
				}
			}
		}

		return this.changes.length - 1;
	}

	override dispose(): void {
		this._disposed = true;

		this._quickDiffs = [];
		this._diffDelayer.cancel();
		this._originalEditorModels.clear();
		this._repositoryDisposables.dispose();

		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

````
