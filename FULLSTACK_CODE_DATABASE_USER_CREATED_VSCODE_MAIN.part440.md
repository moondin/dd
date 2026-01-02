---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 440
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 440 of 552)

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

---[FILE: src/vs/workbench/contrib/remote/browser/remoteIndicator.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteIndicator.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { IRemoteAgentService, remoteConnectionLatencyMeasurer } from '../../../services/remote/common/remoteAgentService.js';
import { RunOnceScheduler, retry } from '../../../../base/common/async.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { MenuId, IMenuService, MenuItemAction, MenuRegistry, registerAction2, Action2, SubmenuItemAction, IMenu } from '../../../../platform/actions/common/actions.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { StatusbarAlignment, IStatusbarService, IStatusbarEntryAccessor, IStatusbarEntry } from '../../../services/statusbar/browser/statusbar.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ContextKeyExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { Schemas } from '../../../../base/common/network.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { QuickPickItem, IQuickInputService, IQuickInputButton } from '../../../../platform/quickinput/common/quickInput.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { PersistentConnectionEventType } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { PlatformName, PlatformToString, isWeb, platform } from '../../../../base/common/platform.js';
import { truncate } from '../../../../base/common/strings.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { getRemoteName } from '../../../../platform/remote/common/remoteHosts.js';
import { getVirtualWorkspaceLocation } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { getCodiconAriaLabel } from '../../../../base/common/iconLabels.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { ReloadWindowAction } from '../../../browser/actions/windowActions.js';
import { EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT, IExtensionGalleryService, IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IExtensionsWorkbenchService, LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID } from '../../extensions/common/extensions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { RemoteNameContext, VirtualWorkspaceContext } from '../../../common/contextkeys.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../base/common/actions.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { DomEmitter } from '../../../../base/browser/event.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { infoIcon } from '../../extensions/browser/extensionsIcons.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { mainWindow } from '../../../../base/browser/window.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import Severity from '../../../../base/common/severity.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { ILifecycleService } from '../../../services/lifecycle/common/lifecycle.js';

type ActionGroup = [string, Array<MenuItemAction | SubmenuItemAction>];

interface RemoteExtensionMetadata {
	id: string;
	installed: boolean;
	dependencies: string[];
	isPlatformCompatible: boolean;
	helpLink: string;
	startConnectLabel: string;
	startCommand: string;
	priority: number;
	supportedPlatforms?: PlatformName[];
}

export class RemoteStatusIndicator extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.remoteStatusIndicator';

	private static readonly REMOTE_ACTIONS_COMMAND_ID = 'workbench.action.remote.showMenu';
	private static readonly CLOSE_REMOTE_COMMAND_ID = 'workbench.action.remote.close';
	private static readonly SHOW_CLOSE_REMOTE_COMMAND_ID = !isWeb; // web does not have a "Close Remote" command
	private static readonly INSTALL_REMOTE_EXTENSIONS_ID = 'workbench.action.remote.extensions';

	private static readonly DEFAULT_REMOTE_STATUS_LABEL = '$(remote)';

	private static readonly REMOTE_STATUS_LABEL_MAX_LENGTH = 40;

	private static readonly REMOTE_CONNECTION_LATENCY_SCHEDULER_DELAY = 60 * 1000;
	private static readonly REMOTE_CONNECTION_LATENCY_SCHEDULER_FIRST_RUN_DELAY = 10 * 1000;

	private remoteStatusEntry: IStatusbarEntryAccessor | undefined;

	private readonly remoteIndicatorMenu: IMenu; 				// filters its entries based on the current remote name of the window
	private readonly unrestrictedRemoteIndicatorMenu: IMenu; 	// does not filter its entries based on the current remote name of the window

	private remoteMenuActionsGroups: ActionGroup[] | undefined;

	private virtualWorkspaceLocation: { scheme: string; authority: string } | undefined = undefined;

	private connectionState: 'initializing' | 'connected' | 'reconnecting' | 'disconnected' | undefined = undefined;
	private connectionToken: string | undefined = undefined;
	private readonly connectionStateContextKey: IContextKey<'' | 'initializing' | 'disconnected' | 'connected'>;

	private networkState: 'online' | 'offline' | 'high-latency' | undefined = undefined;
	private measureNetworkConnectionLatencyScheduler: RunOnceScheduler | undefined = undefined;

	private loggedInvalidGroupNames: { [group: string]: boolean } = Object.create(null);

	private _remoteExtensionMetadata: RemoteExtensionMetadata[] | undefined = undefined;
	private get remoteExtensionMetadata(): RemoteExtensionMetadata[] {
		if (!this._remoteExtensionMetadata) {
			const remoteExtensionTips = { ...this.productService.remoteExtensionTips, ...this.productService.virtualWorkspaceExtensionTips };
			this._remoteExtensionMetadata = Object.values(remoteExtensionTips).filter(value => value.startEntry !== undefined).map(value => {
				return {
					id: value.extensionId,
					installed: false,
					friendlyName: value.friendlyName,
					isPlatformCompatible: false,
					dependencies: [],
					helpLink: value.startEntry?.helpLink ?? '',
					startConnectLabel: value.startEntry?.startConnectLabel ?? '',
					startCommand: value.startEntry?.startCommand ?? '',
					priority: value.startEntry?.priority ?? 10,
					supportedPlatforms: value.supportedPlatforms
				};
			});

			this.remoteExtensionMetadata.sort((ext1, ext2) => ext1.priority - ext2.priority);
		}

		return this._remoteExtensionMetadata;
	}

	private get remoteAuthority(): string | undefined {
		return this.environmentService.remoteAuthority;
	}

	private remoteMetadataInitialized: boolean = false;
	private readonly _onDidChangeEntries = this._register(new Emitter<void>());
	private readonly onDidChangeEntries: Event<void> = this._onDidChangeEntries.event;

	constructor(
		@IStatusbarService private readonly statusbarService: IStatusbarService,
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@ILabelService private readonly labelService: ILabelService,
		@IContextKeyService private contextKeyService: IContextKeyService,
		@IMenuService private menuService: IMenuService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@ICommandService private readonly commandService: ICommandService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IRemoteAuthorityResolverService private readonly remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IHostService private readonly hostService: IHostService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ILogService private readonly logService: ILogService,
		@IExtensionGalleryService private readonly extensionGalleryService: IExtensionGalleryService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IProductService private readonly productService: IProductService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@IDialogService private readonly dialogService: IDialogService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this.unrestrictedRemoteIndicatorMenu = this._register(this.menuService.createMenu(MenuId.StatusBarWindowIndicatorMenu, this.contextKeyService)); // to be removed once migration completed
		this.remoteIndicatorMenu = this._register(this.menuService.createMenu(MenuId.StatusBarRemoteIndicatorMenu, this.contextKeyService));

		this.connectionStateContextKey = new RawContextKey<'' | 'initializing' | 'disconnected' | 'connected'>('remoteConnectionState', '').bindTo(this.contextKeyService);

		// Set initial connection state
		if (this.remoteAuthority) {
			this.connectionState = 'initializing';
			this.connectionStateContextKey.set(this.connectionState);
		} else {
			this.updateVirtualWorkspaceLocation();
		}

		this.registerActions();
		this.registerListeners();

		this.updateWhenInstalledExtensionsRegistered();
		this.updateRemoteStatusIndicator();
	}

	private registerActions(): void {
		const category = nls.localize2('remote.category', "Remote");

		// Show Remote Menu
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteStatusIndicator.REMOTE_ACTIONS_COMMAND_ID,
					category,
					title: nls.localize2('remote.showMenu', "Show Remote Menu"),
					f1: true,
					keybinding: {
						weight: KeybindingWeight.WorkbenchContrib,
						primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyO,
					}
				});
			}
			run = () => that.showRemoteMenu();
		}));

		// Close Remote Connection
		if (RemoteStatusIndicator.SHOW_CLOSE_REMOTE_COMMAND_ID) {
			this._register(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: RemoteStatusIndicator.CLOSE_REMOTE_COMMAND_ID,
						category,
						title: nls.localize2('remote.close', "Close Remote Connection"),
						f1: true,
						precondition: ContextKeyExpr.or(RemoteNameContext, VirtualWorkspaceContext)
					});
				}
				run = () => that.hostService.openWindow({ forceReuseWindow: true, remoteAuthority: null });
			}));
			if (this.remoteAuthority) {
				MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
					group: '6_close',
					command: {
						id: RemoteStatusIndicator.CLOSE_REMOTE_COMMAND_ID,
						title: nls.localize({ key: 'miCloseRemote', comment: ['&& denotes a mnemonic'] }, "Close Re&&mote Connection")
					},
					order: 3.5
				});
			}
		}

		if (this.extensionGalleryService.isEnabled()) {
			this._register(registerAction2(class extends Action2 {
				constructor() {
					super({
						id: RemoteStatusIndicator.INSTALL_REMOTE_EXTENSIONS_ID,
						category,
						title: nls.localize2('remote.install', "Install Remote Development Extensions"),
						f1: true
					});
				}
				run = (accessor: ServicesAccessor, input: string) => {
					const extensionsWorkbenchService = accessor.get(IExtensionsWorkbenchService);
					return extensionsWorkbenchService.openSearch(`@recommended:remotes`);
				};
			}));
		}
	}

	private registerListeners(): void {

		// Menu changes
		const updateRemoteActions = () => {
			this.remoteMenuActionsGroups = undefined;
			this.updateRemoteStatusIndicator();
		};

		this._register(this.unrestrictedRemoteIndicatorMenu.onDidChange(updateRemoteActions));
		this._register(this.remoteIndicatorMenu.onDidChange(updateRemoteActions));

		// Update indicator when formatter changes as it may have an impact on the remote label
		this._register(this.labelService.onDidChangeFormatters(() => this.updateRemoteStatusIndicator()));

		// Update based on remote indicator changes if any
		const remoteIndicator = this.environmentService.options?.windowIndicator;
		if (remoteIndicator && remoteIndicator.onDidChange) {
			this._register(remoteIndicator.onDidChange(() => this.updateRemoteStatusIndicator()));
		}

		// Listen to changes of the connection
		if (this.remoteAuthority) {
			const connection = this.remoteAgentService.getConnection();
			if (connection) {
				this._register(connection.onDidStateChange((e) => {
					switch (e.type) {
						case PersistentConnectionEventType.ConnectionLost:
						case PersistentConnectionEventType.ReconnectionRunning:
						case PersistentConnectionEventType.ReconnectionWait:
							this.setConnectionState('reconnecting');
							break;
						case PersistentConnectionEventType.ReconnectionPermanentFailure:
							this.setConnectionState('disconnected');
							break;
						case PersistentConnectionEventType.ConnectionGain:
							this.setConnectionState('connected');
							break;
					}
				}));
			}
		} else {
			this._register(this.workspaceContextService.onDidChangeWorkbenchState(() => {
				this.updateVirtualWorkspaceLocation();
				this.updateRemoteStatusIndicator();
			}));
		}

		// Online / Offline changes (web only)
		if (isWeb) {
			this._register(Event.any(
				this._register(new DomEmitter(mainWindow, 'online')).event,
				this._register(new DomEmitter(mainWindow, 'offline')).event
			)(() => this.setNetworkState(navigator.onLine ? 'online' : 'offline')));
		}

		this._register(this.extensionService.onDidChangeExtensions(async (result) => {
			for (const ext of result.added) {
				const index = this.remoteExtensionMetadata.findIndex(value => ExtensionIdentifier.equals(value.id, ext.identifier));
				if (index > -1) {
					this.remoteExtensionMetadata[index].installed = true;
				}
			}
		}));

		this._register(this.extensionManagementService.onDidUninstallExtension(async (result) => {
			const index = this.remoteExtensionMetadata.findIndex(value => ExtensionIdentifier.equals(value.id, result.identifier.id));
			if (index > -1) {
				this.remoteExtensionMetadata[index].installed = false;
			}
		}));
	}

	private async initializeRemoteMetadata(): Promise<void> {

		if (this.remoteMetadataInitialized) {
			return;
		}

		const currentPlatform = PlatformToString(platform);
		for (let i = 0; i < this.remoteExtensionMetadata.length; i++) {
			const extensionId = this.remoteExtensionMetadata[i].id;
			const supportedPlatforms = this.remoteExtensionMetadata[i].supportedPlatforms;
			const isInstalled = (await this.extensionManagementService.getInstalled()).find(value => ExtensionIdentifier.equals(value.identifier.id, extensionId)) ? true : false;

			this.remoteExtensionMetadata[i].installed = isInstalled;
			if (isInstalled) {
				this.remoteExtensionMetadata[i].isPlatformCompatible = true;
			}
			else if (supportedPlatforms && !supportedPlatforms.includes(currentPlatform)) {
				this.remoteExtensionMetadata[i].isPlatformCompatible = false;
			}
			else {
				this.remoteExtensionMetadata[i].isPlatformCompatible = true;
			}
		}

		this.remoteMetadataInitialized = true;
		this._onDidChangeEntries.fire();
		this.updateRemoteStatusIndicator();
	}

	private updateVirtualWorkspaceLocation() {
		this.virtualWorkspaceLocation = getVirtualWorkspaceLocation(this.workspaceContextService.getWorkspace());
	}

	private async updateWhenInstalledExtensionsRegistered(): Promise<void> {
		await this.extensionService.whenInstalledExtensionsRegistered();

		const remoteAuthority = this.remoteAuthority;
		if (remoteAuthority) {

			// Try to resolve the authority to figure out connection state
			(async () => {
				try {
					const { authority } = await this.remoteAuthorityResolverService.resolveAuthority(remoteAuthority);
					this.connectionToken = authority.connectionToken;

					this.setConnectionState('connected');
				} catch (error) {
					this.setConnectionState('disconnected');
				}
			})();
		}

		this.updateRemoteStatusIndicator();
		this.initializeRemoteMetadata();
	}

	private setConnectionState(newState: 'disconnected' | 'connected' | 'reconnecting'): void {
		if (this.connectionState !== newState) {
			this.connectionState = newState;

			// simplify context key which doesn't support `connecting`
			if (this.connectionState === 'reconnecting') {
				this.connectionStateContextKey.set('disconnected');
			} else {
				this.connectionStateContextKey.set(this.connectionState);
			}

			// indicate status
			this.updateRemoteStatusIndicator();

			// start measuring connection latency once connected
			if (newState === 'connected') {
				this.scheduleMeasureNetworkConnectionLatency();
			}
		}
	}

	private scheduleMeasureNetworkConnectionLatency(): void {
		if (
			!this.remoteAuthority ||						// only when having a remote connection
			this.measureNetworkConnectionLatencyScheduler	// already scheduled
		) {
			return;
		}

		this.measureNetworkConnectionLatencyScheduler = this._register(new RunOnceScheduler(() => this.measureNetworkConnectionLatency(), RemoteStatusIndicator.REMOTE_CONNECTION_LATENCY_SCHEDULER_DELAY));
		this.measureNetworkConnectionLatencyScheduler.schedule(RemoteStatusIndicator.REMOTE_CONNECTION_LATENCY_SCHEDULER_FIRST_RUN_DELAY);
	}

	private async measureNetworkConnectionLatency(): Promise<void> {

		// Measure latency if we are online
		// but only when the window has focus to prevent constantly
		// waking up the connection to the remote

		if (this.hostService.hasFocus && this.networkState !== 'offline') {
			const measurement = await remoteConnectionLatencyMeasurer.measure(this.remoteAgentService);
			if (measurement) {
				if (measurement.high) {
					this.setNetworkState('high-latency');
				} else if (this.networkState === 'high-latency') {
					this.setNetworkState('online');
				}
			}
		}

		this.measureNetworkConnectionLatencyScheduler?.schedule();
	}

	private setNetworkState(newState: 'online' | 'offline' | 'high-latency'): void {
		if (this.networkState !== newState) {
			const oldState = this.networkState;
			this.networkState = newState;

			if (newState === 'high-latency') {
				this.logService.warn(`Remote network connection appears to have high latency (${remoteConnectionLatencyMeasurer.latency?.current?.toFixed(2)}ms last, ${remoteConnectionLatencyMeasurer.latency?.average?.toFixed(2)}ms average)`);
			}

			if (this.connectionToken) {
				if (newState === 'online' && oldState === 'high-latency') {
					this.logNetworkConnectionHealthTelemetry(this.connectionToken, 'good');
				} else if (newState === 'high-latency' && oldState === 'online') {
					this.logNetworkConnectionHealthTelemetry(this.connectionToken, 'poor');
				}
			}

			// update status
			this.updateRemoteStatusIndicator();
		}
	}

	private logNetworkConnectionHealthTelemetry(connectionToken: string, connectionHealth: 'good' | 'poor'): void {
		type RemoteConnectionHealthClassification = {
			owner: 'alexdima';
			comment: 'The remote connection health has changed (round trip time)';
			remoteName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the resolver.' };
			reconnectionToken: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The identifier of the connection.' };
			connectionHealth: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The health of the connection: good or poor.' };
		};
		type RemoteConnectionHealthEvent = {
			remoteName: string | undefined;
			reconnectionToken: string;
			connectionHealth: 'good' | 'poor';
		};
		this.telemetryService.publicLog2<RemoteConnectionHealthEvent, RemoteConnectionHealthClassification>('remoteConnectionHealth', {
			remoteName: getRemoteName(this.remoteAuthority),
			reconnectionToken: connectionToken,
			connectionHealth
		});
	}

	private validatedGroup(group: string) {
		if (!group.match(/^(remote|virtualfs)_(\d\d)_(([a-z][a-z0-9+.-]*)_(.*))$/)) {
			if (!this.loggedInvalidGroupNames[group]) {
				this.loggedInvalidGroupNames[group] = true;
				this.logService.warn(`Invalid group name used in "statusBar/remoteIndicator" menu contribution: ${group}. Entries ignored. Expected format: 'remote_$ORDER_$REMOTENAME_$GROUPING or 'virtualfs_$ORDER_$FILESCHEME_$GROUPING.`);
			}
			return false;
		}
		return true;
	}

	private getRemoteMenuActions(doNotUseCache?: boolean): ActionGroup[] {
		if (!this.remoteMenuActionsGroups || doNotUseCache) {
			this.remoteMenuActionsGroups = this.remoteIndicatorMenu.getActions().filter(a => this.validatedGroup(a[0])).concat(this.unrestrictedRemoteIndicatorMenu.getActions());
		}
		return this.remoteMenuActionsGroups;
	}

	private updateRemoteStatusIndicator(): void {

		// Remote Indicator: show if provided via options, e.g. by the web embedder API
		const remoteIndicator = this.environmentService.options?.windowIndicator;
		if (remoteIndicator) {
			let remoteIndicatorLabel = remoteIndicator.label.trim();
			if (!remoteIndicatorLabel.startsWith('$(')) {
				remoteIndicatorLabel = `$(remote) ${remoteIndicatorLabel}`; // ensure the indicator has a codicon
			}

			this.renderRemoteStatusIndicator(truncate(remoteIndicatorLabel, RemoteStatusIndicator.REMOTE_STATUS_LABEL_MAX_LENGTH), remoteIndicator.tooltip, remoteIndicator.command);
			return;
		}

		// Show for remote windows on the desktop
		if (this.remoteAuthority) {
			const hostLabel = this.labelService.getHostLabel(Schemas.vscodeRemote, this.remoteAuthority) || this.remoteAuthority;
			switch (this.connectionState) {
				case 'initializing':
					this.renderRemoteStatusIndicator(nls.localize('host.open', "Opening Remote..."), nls.localize('host.open', "Opening Remote..."), undefined, true /* progress */);
					break;
				case 'reconnecting':
					this.renderRemoteStatusIndicator(`${nls.localize('host.reconnecting', "Reconnecting to {0}...", truncate(hostLabel, RemoteStatusIndicator.REMOTE_STATUS_LABEL_MAX_LENGTH))}`, undefined, undefined, true /* progress */);
					break;
				case 'disconnected':
					this.renderRemoteStatusIndicator(`$(alert) ${nls.localize('disconnectedFrom', "Disconnected from {0}", truncate(hostLabel, RemoteStatusIndicator.REMOTE_STATUS_LABEL_MAX_LENGTH))}`);
					break;
				default: {
					const tooltip = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
					const hostNameTooltip = this.labelService.getHostTooltip(Schemas.vscodeRemote, this.remoteAuthority);
					if (hostNameTooltip) {
						tooltip.appendMarkdown(hostNameTooltip);
					} else {
						tooltip.appendText(nls.localize({ key: 'host.tooltip', comment: ['{0} is a remote host name, e.g. Dev Container'] }, "Editing on {0}", hostLabel));
					}
					this.renderRemoteStatusIndicator(`$(remote) ${truncate(hostLabel, RemoteStatusIndicator.REMOTE_STATUS_LABEL_MAX_LENGTH)}`, tooltip);
				}
			}
			return;
		}
		// Show when in a virtual workspace
		if (this.virtualWorkspaceLocation) {

			// Workspace with label: indicate editing source
			const workspaceLabel = this.labelService.getHostLabel(this.virtualWorkspaceLocation.scheme, this.virtualWorkspaceLocation.authority);
			if (workspaceLabel) {
				const tooltip = new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
				const hostNameTooltip = this.labelService.getHostTooltip(this.virtualWorkspaceLocation.scheme, this.virtualWorkspaceLocation.authority);
				if (hostNameTooltip) {
					tooltip.appendMarkdown(hostNameTooltip);
				} else {
					tooltip.appendText(nls.localize({ key: 'workspace.tooltip', comment: ['{0} is a remote workspace name, e.g. GitHub'] }, "Editing on {0}", workspaceLabel));
				}
				if (!isWeb || this.remoteAuthority) {
					tooltip.appendMarkdown('\n\n');
					tooltip.appendMarkdown(nls.localize(
						{ key: 'workspace.tooltip2', comment: ['[features are not available]({1}) is a link. Only translate `features are not available`. Do not change brackets and parentheses or {0}'] },
						"Some [features are not available]({0}) for resources located on a virtual file system.",
						`command:${LIST_WORKSPACE_UNSUPPORTED_EXTENSIONS_COMMAND_ID}`
					));
				}
				this.renderRemoteStatusIndicator(`$(remote) ${truncate(workspaceLabel, RemoteStatusIndicator.REMOTE_STATUS_LABEL_MAX_LENGTH)}`, tooltip);
				return;
			}
		}

		this.renderRemoteStatusIndicator(RemoteStatusIndicator.DEFAULT_REMOTE_STATUS_LABEL, nls.localize('noHost.tooltip', "Open a Remote Window"));
		return;
	}

	private renderRemoteStatusIndicator(initialText: string, initialTooltip?: string | MarkdownString, command?: string, showProgress?: boolean): void {
		const { text, tooltip, ariaLabel } = this.withNetworkStatus(initialText, initialTooltip, showProgress);

		const properties: IStatusbarEntry = {
			name: nls.localize('remoteHost', "Remote Host"),
			kind: this.networkState === 'offline' ? 'offline' : text !== RemoteStatusIndicator.DEFAULT_REMOTE_STATUS_LABEL ? 'remote' : undefined, // only emphasize when applicable
			ariaLabel,
			text,
			showProgress,
			tooltip,
			command: command ?? RemoteStatusIndicator.REMOTE_ACTIONS_COMMAND_ID
		};

		if (this.remoteStatusEntry) {
			this.remoteStatusEntry.update(properties);
		} else {
			this.remoteStatusEntry = this.statusbarService.addEntry(properties, 'status.host', StatusbarAlignment.LEFT, Number.POSITIVE_INFINITY /* first entry */);
		}
	}

	private withNetworkStatus(initialText: string, initialTooltip?: string | MarkdownString, showProgress?: boolean): { text: string; tooltip: string | IMarkdownString | undefined; ariaLabel: string } {
		let text = initialText;
		let tooltip = initialTooltip;
		let ariaLabel = getCodiconAriaLabel(text);

		function textWithAlert(): string {

			// `initialText` can have a codicon in the beginning that already
			// indicates some kind of status, or we may have been asked to
			// show progress, where a spinning codicon appears. we only want
			// to replace with an alert icon for when a normal remote indicator
			// is shown.

			if (!showProgress && initialText.startsWith(RemoteStatusIndicator.DEFAULT_REMOTE_STATUS_LABEL)) {
				return initialText.replace(RemoteStatusIndicator.DEFAULT_REMOTE_STATUS_LABEL, '$(alert)');
			}

			return initialText;
		}

		switch (this.networkState) {
			case 'offline': {
				const offlineMessage = nls.localize('networkStatusOfflineTooltip', "Network appears to be offline, certain features might be unavailable.");

				text = textWithAlert();
				tooltip = this.appendTooltipLine(tooltip, offlineMessage);
				ariaLabel = `${ariaLabel}, ${offlineMessage}`;
				break;
			}
			case 'high-latency':
				text = textWithAlert();
				tooltip = this.appendTooltipLine(tooltip, nls.localize('networkStatusHighLatencyTooltip', "Network appears to have high latency ({0}ms last, {1}ms average), certain features may be slow to respond.", remoteConnectionLatencyMeasurer.latency?.current?.toFixed(2), remoteConnectionLatencyMeasurer.latency?.average?.toFixed(2)));
				break;
		}

		return { text, tooltip, ariaLabel };
	}

	private appendTooltipLine(tooltip: string | MarkdownString | undefined, line: string): MarkdownString {
		let markdownTooltip: MarkdownString;
		if (typeof tooltip === 'string') {
			markdownTooltip = new MarkdownString(tooltip, { isTrusted: true, supportThemeIcons: true });
		} else {
			markdownTooltip = tooltip ?? new MarkdownString('', { isTrusted: true, supportThemeIcons: true });
		}

		if (markdownTooltip.value.length > 0) {
			markdownTooltip.appendMarkdown('\n\n');
		}

		markdownTooltip.appendMarkdown(line);

		return markdownTooltip;
	}

	private async installExtension(extensionId: string, remoteLabel: string): Promise<void> {
		try {
			await this.extensionsWorkbenchService.install(extensionId, {
				isMachineScoped: false,
				donotIncludePackAndDependencies: false,
				context: { [EXTENSION_INSTALL_SKIP_WALKTHROUGH_CONTEXT]: true }
			});
		} catch (error) {
			if (!this.lifecycleService.willShutdown) {
				const { confirmed } = await this.dialogService.confirm({
					type: Severity.Error,
					message: nls.localize('unknownSetupError', "An error occurred while setting up {0}. Would you like to try again?", remoteLabel),
					detail: error && !isCancellationError(error) ? toErrorMessage(error) : undefined,
					primaryButton: nls.localize('retry', "Retry")
				});
				if (confirmed) {
					return this.installExtension(extensionId, remoteLabel);
				}
			}
			throw error;
		}
	}

	private async runRemoteStartCommand(extensionId: string, startCommand: string) {

		// check to ensure the extension is installed
		await retry(async () => {
			const ext = await this.extensionService.getExtension(extensionId);
			if (!ext) {
				throw Error('Failed to find installed remote extension');
			}
			return ext;
		}, 300, 10);

		this.commandService.executeCommand(startCommand);
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
			id: 'remoteInstallAndRun',
			detail: extensionId,
			from: 'remote indicator'
		});
	}

	private showRemoteMenu() {
		const getCategoryLabel = (action: MenuItemAction) => {
			if (action.item.category) {
				return typeof action.item.category === 'string' ? action.item.category : action.item.category.value;
			}
			return undefined;
		};

		const matchCurrentRemote = () => {
			if (this.remoteAuthority) {
				return new RegExp(`^remote_\\d\\d_${getRemoteName(this.remoteAuthority)}_`);
			} else if (this.virtualWorkspaceLocation) {
				return new RegExp(`^virtualfs_\\d\\d_${this.virtualWorkspaceLocation.scheme}_`);
			}
			return undefined;
		};

		const computeItems = () => {
			let actionGroups = this.getRemoteMenuActions(true);

			const items: QuickPickItem[] = [];

			const currentRemoteMatcher = matchCurrentRemote();
			if (currentRemoteMatcher) {
				// commands for the current remote go first
				actionGroups = actionGroups.sort((g1, g2) => {
					const isCurrentRemote1 = currentRemoteMatcher.test(g1[0]);
					const isCurrentRemote2 = currentRemoteMatcher.test(g2[0]);
					if (isCurrentRemote1 !== isCurrentRemote2) {
						return isCurrentRemote1 ? -1 : 1;
					}
					// legacy indicator commands go last
					if (g1[0] !== '' && g2[0] === '') {
						return -1;
					} else if (g1[0] === '' && g2[0] !== '') {
						return 1;
					}
					return g1[0].localeCompare(g2[0]);
				});
			}

			let lastCategoryName: string | undefined = undefined;

			for (const actionGroup of actionGroups) {
				let hasGroupCategory = false;
				for (const action of actionGroup[1]) {
					if (action instanceof MenuItemAction) {
						if (!hasGroupCategory) {
							const category = getCategoryLabel(action);
							if (category !== lastCategoryName) {
								items.push({ type: 'separator', label: category });
								lastCategoryName = category;
							}
							hasGroupCategory = true;
						}
						const label = typeof action.item.title === 'string' ? action.item.title : action.item.title.value;
						items.push({
							type: 'item',
							id: action.item.id,
							label
						});
					}
				}
			}

			const showExtensionRecommendations = this.configurationService.getValue<boolean>('workbench.remoteIndicator.showExtensionRecommendations');
			if (showExtensionRecommendations && this.extensionGalleryService.isEnabled() && this.remoteMetadataInitialized) {

				const notInstalledItems: QuickPickItem[] = [];
				for (const metadata of this.remoteExtensionMetadata) {
					if (!metadata.installed && metadata.isPlatformCompatible) {
						// Create Install QuickPick with a help link
						const label = metadata.startConnectLabel;
						const buttons: IQuickInputButton[] = [{
							iconClass: ThemeIcon.asClassName(infoIcon),
							tooltip: nls.localize('remote.startActions.help', "Learn More")
						}];
						notInstalledItems.push({ type: 'item', id: metadata.id, label: label, buttons: buttons });
					}
				}

				items.push({
					type: 'separator', label: nls.localize('remote.startActions.install', 'Install')
				});
				items.push(...notInstalledItems);
			}

			items.push({
				type: 'separator'
			});

			const entriesBeforeConfig = items.length;

			if (RemoteStatusIndicator.SHOW_CLOSE_REMOTE_COMMAND_ID) {
				if (this.remoteAuthority) {
					items.push({
						type: 'item',
						id: RemoteStatusIndicator.CLOSE_REMOTE_COMMAND_ID,
						label: nls.localize('closeRemoteConnection.title', 'Close Remote Connection')
					});

					if (this.connectionState === 'disconnected') {
						items.push({
							type: 'item',
							id: ReloadWindowAction.ID,
							label: nls.localize('reloadWindow', 'Reload Window')
						});
					}
				} else if (this.virtualWorkspaceLocation) {
					items.push({
						type: 'item',
						id: RemoteStatusIndicator.CLOSE_REMOTE_COMMAND_ID,
						label: nls.localize('closeVirtualWorkspace.title', 'Close Remote Workspace')
					});
				}
			}

			if (items.length === entriesBeforeConfig) {
				items.pop(); // remove the separator again
			}

			return items;
		};

		const disposables = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick({ useSeparators: true }));
		quickPick.placeholder = nls.localize('remoteActions', "Select an option to open a Remote Window");
		quickPick.items = computeItems();
		quickPick.sortByLabel = false;
		quickPick.canSelectMany = false;
		disposables.add(Event.once(quickPick.onDidAccept)((async _ => {
			const selectedItems = quickPick.selectedItems;
			if (selectedItems.length === 1) {
				const commandId = selectedItems[0].id!;
				const remoteExtension = this.remoteExtensionMetadata.find(value => ExtensionIdentifier.equals(value.id, commandId));
				if (remoteExtension) {
					quickPick.items = [];
					quickPick.busy = true;
					quickPick.placeholder = nls.localize('remote.startActions.installingExtension', 'Installing extension... ');

					try {
						await this.installExtension(remoteExtension.id, selectedItems[0].label);
					} catch (error) {
						return;
					} finally {
						quickPick.hide();
					}
					await this.runRemoteStartCommand(remoteExtension.id, remoteExtension.startCommand);
				}
				else {
					this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
						id: commandId,
						from: 'remote indicator'
					});
					this.commandService.executeCommand(commandId);
					quickPick.hide();
				}
			}
		})));

		disposables.add(Event.once(quickPick.onDidTriggerItemButton)(async (e) => {
			const remoteExtension = this.remoteExtensionMetadata.find(value => ExtensionIdentifier.equals(value.id, e.item.id));
			if (remoteExtension) {
				await this.openerService.open(URI.parse(remoteExtension.helpLink));
			}
		}));

		// refresh the items when actions change
		disposables.add(this.unrestrictedRemoteIndicatorMenu.onDidChange(() => quickPick.items = computeItems()));
		disposables.add(this.remoteIndicatorMenu.onDidChange(() => quickPick.items = computeItems()));

		disposables.add(quickPick.onDidHide(() => disposables.dispose()));

		if (!this.remoteMetadataInitialized) {
			quickPick.busy = true;
			this._register(this.onDidChangeEntries(() => {
				// If quick pick is open, update the quick pick items after initialization.
				quickPick.busy = false;
				quickPick.items = computeItems();
			}));
		}

		quickPick.show();
	}
}

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		...workbenchConfigurationNodeBase,
		properties: {
			'workbench.remoteIndicator.showExtensionRecommendations': {
				type: 'boolean',
				markdownDescription: nls.localize('remote.showExtensionRecommendations', "When enabled, remote extensions recommendations will be shown in the Remote Indicator menu."),
				default: true
			},
		}
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remoteStartEntry.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteStartEntry.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { RemoteStartEntry } from './remoteStartEntry.js';

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(RemoteStartEntry, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/remoteStartEntry.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/remoteStartEntry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IExtensionManagementService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IWorkbenchExtensionEnablementService } from '../../../services/extensionManagement/common/extensionManagement.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { WorkbenchActionExecutedClassification, WorkbenchActionExecutedEvent } from '../../../../base/common/actions.js';

export const showStartEntryInWeb = new RawContextKey<boolean>('showRemoteStartEntryInWeb', false);
export class RemoteStartEntry extends Disposable implements IWorkbenchContribution {

	private static readonly REMOTE_WEB_START_ENTRY_ACTIONS_COMMAND_ID = 'workbench.action.remote.showWebStartEntryActions';

	private readonly remoteExtensionId: string;
	private readonly startCommand: string;

	constructor(
		@ICommandService private readonly commandService: ICommandService,
		@IProductService private readonly productService: IProductService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IWorkbenchExtensionEnablementService private readonly extensionEnablementService: IWorkbenchExtensionEnablementService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService) {

		super();

		const remoteExtensionTips = this.productService.remoteExtensionTips?.['tunnel'];
		this.startCommand = remoteExtensionTips?.startEntry?.startCommand ?? '';
		this.remoteExtensionId = remoteExtensionTips?.extensionId ?? '';

		this._init();
		this.registerActions();
		this.registerListeners();
	}

	private registerActions(): void {
		const category = nls.localize2('remote.category', "Remote");

		// Show Remote Start Action
		const startEntry = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: RemoteStartEntry.REMOTE_WEB_START_ENTRY_ACTIONS_COMMAND_ID,
					category,
					title: nls.localize2('remote.showWebStartEntryActions', "Show Remote Start Entry for web"),
					f1: false
				});
			}

			async run(): Promise<void> {
				await startEntry.showWebRemoteStartActions();
			}
		}));
	}

	private registerListeners(): void {
		this._register(this.extensionEnablementService.onEnablementChanged(async (result) => {

			for (const ext of result) {
				if (ExtensionIdentifier.equals(this.remoteExtensionId, ext.identifier.id)) {
					if (this.extensionEnablementService.isEnabled(ext)) {
						showStartEntryInWeb.bindTo(this.contextKeyService).set(true);
					} else {
						showStartEntryInWeb.bindTo(this.contextKeyService).set(false);
					}
				}
			}
		}));
	}

	private async _init(): Promise<void> {

		// Check if installed and enabled
		const installed = (await this.extensionManagementService.getInstalled()).find(value => ExtensionIdentifier.equals(value.identifier.id, this.remoteExtensionId));
		if (installed) {
			if (this.extensionEnablementService.isEnabled(installed)) {
				showStartEntryInWeb.bindTo(this.contextKeyService).set(true);
			}
		}
	}

	private async showWebRemoteStartActions() {
		this.commandService.executeCommand(this.startCommand);
		this.telemetryService.publicLog2<WorkbenchActionExecutedEvent, WorkbenchActionExecutedClassification>('workbenchActionExecuted', {
			id: this.startCommand,
			from: 'remote start entry'
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/showCandidate.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/showCandidate.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IRemoteExplorerService } from '../../../services/remote/common/remoteExplorerService.js';
import { CandidatePort } from '../../../services/remote/common/tunnelModel.js';

export class ShowCandidateContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.showPortCandidate';

	constructor(
		@IRemoteExplorerService remoteExplorerService: IRemoteExplorerService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
	) {
		super();
		const showPortCandidate = environmentService.options?.tunnelProvider?.showPortCandidate;
		if (showPortCandidate) {
			this._register(remoteExplorerService.setCandidateFilter(async (candidates: CandidatePort[]): Promise<CandidatePort[]> => {
				const filters: boolean[] = await Promise.all(candidates.map(candidate => showPortCandidate(candidate.host, candidate.port, candidate.detail ?? '')));
				const filteredCandidates: CandidatePort[] = [];
				if (filters.length !== candidates.length) {
					return candidates;
				}
				for (let i = 0; i < candidates.length; i++) {
					if (filters[i]) {
						filteredCandidates.push(candidates[i]);
					}
				}
				return filteredCandidates;
			}));
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/tunnelFactory.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/tunnelFactory.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ITunnelService, TunnelOptions, RemoteTunnel, TunnelCreationOptions, ITunnel, TunnelProtocol, TunnelPrivacyId } from '../../../../platform/tunnel/common/tunnel.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { URI } from '../../../../base/common/uri.js';
import { IRemoteExplorerService } from '../../../services/remote/common/remoteExplorerService.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { forwardedPortsFeaturesEnabled } from '../../../services/remote/common/tunnelModel.js';

export class TunnelFactoryContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.tunnelFactory';

	constructor(
		@ITunnelService tunnelService: ITunnelService,
		@IBrowserWorkbenchEnvironmentService environmentService: IBrowserWorkbenchEnvironmentService,
		@IOpenerService private openerService: IOpenerService,
		@IRemoteExplorerService remoteExplorerService: IRemoteExplorerService,
		@ILogService logService: ILogService,
		@IContextKeyService contextKeyService: IContextKeyService
	) {
		super();
		const tunnelFactory = environmentService.options?.tunnelProvider?.tunnelFactory;
		if (tunnelFactory) {
			// At this point we clearly want the ports view/features since we have a tunnel factory
			contextKeyService.createKey(forwardedPortsFeaturesEnabled.key, true);
			let privacyOptions = environmentService.options?.tunnelProvider?.features?.privacyOptions ?? [];
			if (environmentService.options?.tunnelProvider?.features?.public
				&& (privacyOptions.length === 0)) {
				privacyOptions = [
					{
						id: 'private',
						label: nls.localize('tunnelPrivacy.private', "Private"),
						themeIcon: 'lock'
					},
					{
						id: 'public',
						label: nls.localize('tunnelPrivacy.public', "Public"),
						themeIcon: 'eye'
					}
				];
			}

			this._register(tunnelService.setTunnelProvider({
				forwardPort: async (tunnelOptions: TunnelOptions, tunnelCreationOptions: TunnelCreationOptions): Promise<RemoteTunnel | string | undefined> => {
					let tunnelPromise: Promise<ITunnel> | undefined;
					try {
						tunnelPromise = tunnelFactory(tunnelOptions, tunnelCreationOptions);
					} catch (e) {
						logService.trace('tunnelFactory: tunnel provider error');
					}

					if (!tunnelPromise) {
						return undefined;
					}
					let tunnel: ITunnel;
					try {
						tunnel = await tunnelPromise;
					} catch (e) {
						logService.trace('tunnelFactory: tunnel provider promise error');
						if (e instanceof Error) {
							return e.message;
						}
						return undefined;
					}
					const localAddress = tunnel.localAddress.startsWith('http') ? tunnel.localAddress : `http://${tunnel.localAddress}`;
					const remoteTunnel: RemoteTunnel = {
						tunnelRemotePort: tunnel.remoteAddress.port,
						tunnelRemoteHost: tunnel.remoteAddress.host,
						// The tunnel factory may give us an inaccessible local address.
						// To make sure this doesn't happen, resolve the uri immediately.
						localAddress: await this.resolveExternalUri(localAddress),
						privacy: tunnel.privacy ?? (tunnel.public ? TunnelPrivacyId.Public : TunnelPrivacyId.Private),
						protocol: tunnel.protocol ?? TunnelProtocol.Http,
						dispose: async () => { await tunnel.dispose(); }
					};
					return remoteTunnel;
				}
			}));
			const tunnelInformation = environmentService.options?.tunnelProvider?.features ?
				{
					features: {
						elevation: !!environmentService.options?.tunnelProvider?.features?.elevation,
						public: !!environmentService.options?.tunnelProvider?.features?.public,
						privacyOptions,
						protocol: environmentService.options?.tunnelProvider?.features?.protocol === undefined ? true : !!environmentService.options?.tunnelProvider?.features?.protocol
					}
				} : undefined;
			remoteExplorerService.setTunnelInformation(tunnelInformation);
		}
	}

	private async resolveExternalUri(uri: string): Promise<string> {
		try {
			return (await this.openerService.resolveExternalUri(URI.parse(uri))).resolved.toString();
		} catch {
			return uri;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/tunnelView.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/tunnelView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/tunnelView.css';
import * as nls from '../../../../nls.js';
import * as dom from '../../../../base/browser/dom.js';
import { IViewDescriptor, IEditableData, IViewDescriptorService } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IContextKeyService, IContextKey, RawContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from '../../../../platform/quickinput/common/quickInput.js';
import { ICommandService, ICommandHandler, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { Event } from '../../../../base/common/event.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { Disposable, IDisposable, toDisposable, dispose, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ActionBar } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { IconLabel } from '../../../../base/browser/ui/iconLabel/iconLabel.js';
import { ActionRunner, IAction } from '../../../../base/common/actions.js';
import { IMenuService, MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { createActionViewItem, getFlatActionBarActions } from '../../../../platform/actions/browser/menuEntryActionViewItem.js';
import { IRemoteExplorerService, TunnelType, ITunnelItem, TUNNEL_VIEW_ID, TunnelEditId } from '../../../services/remote/common/remoteExplorerService.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { InputBox, MessageType } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ViewPane, IViewPaneOptions } from '../../../browser/parts/views/viewPane.js';
import { URI } from '../../../../base/common/uri.js';
import { isAllInterfaces, isLocalhost, isRemoteTunnel, ITunnelService, RemoteTunnel, TunnelPrivacyId, TunnelProtocol } from '../../../../platform/tunnel/common/tunnel.js';
import { TunnelPrivacy } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ActionViewItem } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import { copyAddressIcon, forwardedPortWithoutProcessIcon, forwardedPortWithProcessIcon, forwardPortIcon, labelPortIcon, openBrowserIcon, openPreviewIcon, portsViewIcon, privatePortIcon, stopForwardIcon } from './remoteIcons.js';
import { IExternalUriOpenerService } from '../../externalUriOpener/common/externalUriOpenerService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isMacintosh } from '../../../../base/common/platform.js';
import { ITableColumn, ITableContextMenuEvent, ITableEvent, ITableMouseEvent, ITableRenderer, ITableVirtualDelegate } from '../../../../base/browser/ui/table/table.js';
import { WorkbenchTable } from '../../../../platform/list/browser/listService.js';
import { Button } from '../../../../base/browser/ui/button/button.js';
import { registerColor } from '../../../../platform/theme/common/colorRegistry.js';
import { IMarkdownString, MarkdownString } from '../../../../base/common/htmlContent.js';
import { IHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegate.js';
import { STATUS_BAR_REMOTE_ITEM_BACKGROUND } from '../../../common/theme.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { defaultButtonStyles, defaultInputBoxStyles } from '../../../../platform/theme/browser/defaultStyles.js';
import { Attributes, CandidatePort, Tunnel, TunnelCloseReason, TunnelModel, TunnelSource, forwardedPortsViewEnabled, makeAddress, mapHasAddressLocalhostOrAllInterfaces, parseAddress } from '../../../services/remote/common/tunnelModel.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';

export const openPreviewEnabledContext = new RawContextKey<boolean>('openPreviewEnabled', false);

class TunnelTreeVirtualDelegate implements ITableVirtualDelegate<ITunnelItem> {

	readonly headerRowHeight: number = 22;

	constructor(private readonly remoteExplorerService: IRemoteExplorerService) { }

	getHeight(row: ITunnelItem): number {
		return (row.tunnelType === TunnelType.Add && !this.remoteExplorerService.getEditableData(undefined)) ? 30 : 22;
	}
}

interface ITunnelViewModel {
	readonly onForwardedPortsChanged: Event<void>;
	readonly all: TunnelItem[];
	readonly input: TunnelItem;
	isEmpty(): boolean;
}

export class TunnelViewModel implements ITunnelViewModel {

	readonly onForwardedPortsChanged: Event<void>;
	private model: TunnelModel;
	private _candidates: Map<string, CandidatePort> = new Map();

	readonly input = {
		label: nls.localize('remote.tunnelsView.addPort', "Add Port"),
		icon: undefined,
		tunnelType: TunnelType.Add,
		hasRunningProcess: false,
		remoteHost: '',
		remotePort: 0,
		processDescription: '',
		tooltipPostfix: '',
		iconTooltip: '',
		portTooltip: '',
		processTooltip: '',
		originTooltip: '',
		privacyTooltip: '',
		source: { source: TunnelSource.User, description: '' },
		protocol: TunnelProtocol.Http,
		privacy: {
			id: TunnelPrivacyId.Private,
			themeIcon: privatePortIcon.id,
			label: nls.localize('tunnelPrivacy.private', "Private")
		},
		strip: () => undefined
	};

	constructor(
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@ITunnelService private readonly tunnelService: ITunnelService
	) {
		this.model = remoteExplorerService.tunnelModel;
		this.onForwardedPortsChanged = Event.any(this.model.onForwardPort, this.model.onClosePort, this.model.onPortName, this.model.onCandidatesChanged);
	}

	get all(): TunnelItem[] {
		const result: TunnelItem[] = [];
		this._candidates = new Map();
		this.model.candidates.forEach(candidate => {
			this._candidates.set(makeAddress(candidate.host, candidate.port), candidate);
		});
		if ((this.model.forwarded.size > 0) || this.remoteExplorerService.getEditableData(undefined)) {
			result.push(...this.forwarded);
		}
		if (this.model.detected.size > 0) {
			result.push(...this.detected);
		}

		result.push(this.input);
		return result;
	}

	private addProcessInfoFromCandidate(tunnelItem: ITunnelItem) {
		const key = makeAddress(tunnelItem.remoteHost, tunnelItem.remotePort);
		if (this._candidates.has(key)) {
			tunnelItem.processDescription = this._candidates.get(key)!.detail;
		}
	}

	private get forwarded(): TunnelItem[] {
		const forwarded = Array.from(this.model.forwarded.values()).map(tunnel => {
			const tunnelItem = TunnelItem.createFromTunnel(this.remoteExplorerService, this.tunnelService, tunnel);
			this.addProcessInfoFromCandidate(tunnelItem);
			return tunnelItem;
		}).sort((a: TunnelItem, b: TunnelItem) => {
			if (a.remotePort === b.remotePort) {
				return a.remoteHost < b.remoteHost ? -1 : 1;
			} else {
				return a.remotePort < b.remotePort ? -1 : 1;
			}
		});
		return forwarded;
	}

	private get detected(): TunnelItem[] {
		return Array.from(this.model.detected.values()).map(tunnel => {
			const tunnelItem = TunnelItem.createFromTunnel(this.remoteExplorerService, this.tunnelService, tunnel, TunnelType.Detected, false);
			this.addProcessInfoFromCandidate(tunnelItem);
			return tunnelItem;
		});
	}

	isEmpty(): boolean {
		return (this.detected.length === 0) &&
			((this.forwarded.length === 0) || (this.forwarded.length === 1 &&
				(this.forwarded[0].tunnelType === TunnelType.Add) && !this.remoteExplorerService.getEditableData(undefined)));
	}
}

function emptyCell(item: ITunnelItem): ActionBarCell {
	return { label: '', tunnel: item, editId: TunnelEditId.None, tooltip: '' };
}

class IconColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = '';
	readonly tooltip: string = '';
	readonly weight: number = 1;
	readonly minimumWidth = 40;
	readonly maximumWidth = 40;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		if (row.tunnelType === TunnelType.Add) {
			return emptyCell(row);
		}

		const icon = row.processDescription ? forwardedPortWithProcessIcon : forwardedPortWithoutProcessIcon;
		let tooltip: string = '';
		if (row instanceof TunnelItem) {
			tooltip = `${row.iconTooltip} ${row.tooltipPostfix}`;
		}
		return {
			label: '', icon, tunnel: row, editId: TunnelEditId.None, tooltip
		};
	}
}

class PortColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = nls.localize('tunnel.portColumn.label', "Port");
	readonly tooltip: string = nls.localize('tunnel.portColumn.tooltip', "The label and remote port number of the forwarded port.");
	readonly weight: number = 1;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		const isAdd = row.tunnelType === TunnelType.Add;
		const label = row.label;
		let tooltip: string = '';
		if (row instanceof TunnelItem && !isAdd) {
			tooltip = `${row.portTooltip} ${row.tooltipPostfix}`;
		} else {
			tooltip = label;
		}
		return {
			label, tunnel: row, menuId: MenuId.TunnelPortInline,
			editId: row.tunnelType === TunnelType.Add ? TunnelEditId.New : TunnelEditId.Label, tooltip
		};
	}
}

class LocalAddressColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = nls.localize('tunnel.addressColumn.label', "Forwarded Address");
	readonly tooltip: string = nls.localize('tunnel.addressColumn.tooltip', "The address that the forwarded port is available at.");
	readonly weight: number = 1;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		if (row.tunnelType === TunnelType.Add) {
			return emptyCell(row);
		}

		const label = row.localAddress ?? '';
		let tooltip: string = label;
		if (row instanceof TunnelItem) {
			tooltip = row.tooltipPostfix;
		}
		return {
			label,
			menuId: MenuId.TunnelLocalAddressInline,
			tunnel: row,
			editId: TunnelEditId.LocalPort,
			tooltip,
			markdownTooltip: label ? LocalAddressColumn.getHoverText(label) : undefined
		};
	}

	private static getHoverText(localAddress: string) {
		return function (configurationService: IConfigurationService) {
			const editorConf = configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');

			let clickLabel = '';
			if (editorConf.multiCursorModifier === 'ctrlCmd') {
				if (isMacintosh) {
					clickLabel = nls.localize('portsLink.followLinkAlt.mac', "option + click");
				} else {
					clickLabel = nls.localize('portsLink.followLinkAlt', "alt + click");
				}
			} else {
				if (isMacintosh) {
					clickLabel = nls.localize('portsLink.followLinkCmd', "cmd + click");
				} else {
					clickLabel = nls.localize('portsLink.followLinkCtrl', "ctrl + click");
				}
			}

			const markdown = new MarkdownString('', true);
			const uri = localAddress.startsWith('http') ? localAddress : `http://${localAddress}`;
			return markdown.appendLink(uri, 'Follow link').appendMarkdown(` (${clickLabel})`);
		};
	}
}

class RunningProcessColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = nls.localize('tunnel.processColumn.label', "Running Process");
	readonly tooltip: string = nls.localize('tunnel.processColumn.tooltip', "The command line of the process that is using the port.");
	readonly weight: number = 2;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		if (row.tunnelType === TunnelType.Add) {
			return emptyCell(row);
		}

		const label = row.processDescription ?? '';
		return { label, tunnel: row, editId: TunnelEditId.None, tooltip: row instanceof TunnelItem ? row.processTooltip : '' };
	}
}

class OriginColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = nls.localize('tunnel.originColumn.label', "Origin");
	readonly tooltip: string = nls.localize('tunnel.originColumn.tooltip', "The source that a forwarded port originates from. Can be an extension, user forwarded, statically forwarded, or automatically forwarded.");
	readonly weight: number = 1;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		if (row.tunnelType === TunnelType.Add) {
			return emptyCell(row);
		}

		const label = row.source.description;
		const tooltip = `${row instanceof TunnelItem ? row.originTooltip : ''}. ${row instanceof TunnelItem ? row.tooltipPostfix : ''}`;
		return { label, menuId: MenuId.TunnelOriginInline, tunnel: row, editId: TunnelEditId.None, tooltip };
	}
}

class PrivacyColumn implements ITableColumn<ITunnelItem, ActionBarCell> {
	readonly label: string = nls.localize('tunnel.privacyColumn.label', "Visibility");
	readonly tooltip: string = nls.localize('tunnel.privacyColumn.tooltip', "The availability of the forwarded port.");
	readonly weight: number = 1;
	readonly templateId: string = 'actionbar';
	project(row: ITunnelItem): ActionBarCell {
		if (row.tunnelType === TunnelType.Add) {
			return emptyCell(row);
		}

		const label = row.privacy?.label;
		let tooltip: string = '';
		if (row instanceof TunnelItem) {
			tooltip = `${row.privacy.label} ${row.tooltipPostfix}`;
		}
		return { label, tunnel: row, icon: { id: row.privacy.themeIcon }, editId: TunnelEditId.None, tooltip };
	}
}

interface IActionBarTemplateData {
	elementDisposable: IDisposable;
	container: HTMLElement;
	label: IconLabel;
	button?: Button;
	icon: HTMLElement;
	actionBar: ActionBar;
}

interface ActionBarCell {
	label: string;
	icon?: ThemeIcon;
	tooltip: string;
	markdownTooltip?: (configurationService: IConfigurationService) => IMarkdownString;
	menuId?: MenuId;
	tunnel: ITunnelItem;
	editId: TunnelEditId;
}

class ActionBarRenderer extends Disposable implements ITableRenderer<ActionBarCell, IActionBarTemplateData> {
	readonly templateId = 'actionbar';
	private inputDone?: (success: boolean, finishEditing: boolean) => void;
	private _actionRunner: ActionRunner | undefined;
	private readonly _hoverDelegate: IHoverDelegate;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IMenuService private readonly menuService: IMenuService,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@ICommandService private readonly commandService: ICommandService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();

		this._hoverDelegate = getDefaultHoverDelegate('mouse');
	}

	set actionRunner(actionRunner: ActionRunner) {
		this._actionRunner = actionRunner;
	}

	renderTemplate(container: HTMLElement): IActionBarTemplateData {
		const cell = dom.append(container, dom.$('.ports-view-actionbar-cell'));
		const icon = dom.append(cell, dom.$('.ports-view-actionbar-cell-icon'));
		const label = new IconLabel(cell,
			{
				supportHighlights: true,
				hoverDelegate: this._hoverDelegate
			});
		const actionsContainer = dom.append(cell, dom.$('.actions'));
		const actionBar = new ActionBar(actionsContainer, {
			actionViewItemProvider: createActionViewItem.bind(undefined, this.instantiationService),
			hoverDelegate: this._hoverDelegate
		});
		return { label, icon, actionBar, container: cell, elementDisposable: Disposable.None };
	}

	renderElement(element: ActionBarCell, index: number, templateData: IActionBarTemplateData): void {
		// reset
		templateData.actionBar.clear();
		templateData.icon.className = 'ports-view-actionbar-cell-icon';
		templateData.icon.style.display = 'none';
		templateData.label.setLabel('');
		templateData.label.element.style.display = 'none';
		templateData.container.style.height = '22px';
		if (templateData.button) {
			templateData.button.element.style.display = 'none';
			templateData.button.dispose();
		}
		templateData.container.style.paddingLeft = '0px';
		templateData.elementDisposable.dispose();

		let editableData: IEditableData | undefined;
		if (element.editId === TunnelEditId.New && (editableData = this.remoteExplorerService.getEditableData(undefined))) {
			this.renderInputBox(templateData.container, editableData);
		} else {
			editableData = this.remoteExplorerService.getEditableData(element.tunnel, element.editId);
			if (editableData) {
				this.renderInputBox(templateData.container, editableData);
			} else if ((element.tunnel.tunnelType === TunnelType.Add) && (element.menuId === MenuId.TunnelPortInline)) {
				this.renderButton(element, templateData);
			} else {
				this.renderActionBarItem(element, templateData);
			}
		}
	}

	renderButton(element: ActionBarCell, templateData: IActionBarTemplateData): void {
		templateData.container.style.paddingLeft = '7px';
		templateData.container.style.height = '28px';
		templateData.button = this._register(new Button(templateData.container, defaultButtonStyles));
		templateData.button.label = element.label;
		templateData.button.element.title = element.tooltip;
		this._register(templateData.button.onDidClick(() => {
			this.commandService.executeCommand(ForwardPortAction.INLINE_ID);
		}));
	}

	private tunnelContext(tunnel: ITunnelItem): ITunnelItem {
		let context: ITunnelItem | undefined;
		if (tunnel instanceof TunnelItem) {
			context = tunnel.strip();
		}
		if (!context) {
			context = {
				tunnelType: tunnel.tunnelType,
				remoteHost: tunnel.remoteHost,
				remotePort: tunnel.remotePort,
				localAddress: tunnel.localAddress,
				protocol: tunnel.protocol,
				localUri: tunnel.localUri,
				localPort: tunnel.localPort,
				name: tunnel.name,
				closeable: tunnel.closeable,
				source: tunnel.source,
				privacy: tunnel.privacy,
				processDescription: tunnel.processDescription,
				label: tunnel.label
			};
		}
		return context;
	}

	renderActionBarItem(element: ActionBarCell, templateData: IActionBarTemplateData): void {
		templateData.label.element.style.display = 'flex';
		templateData.label.setLabel(element.label, undefined,
			{
				title: element.markdownTooltip ?
					{ markdown: element.markdownTooltip(this.configurationService), markdownNotSupportedFallback: element.tooltip }
					: element.tooltip,
				extraClasses: element.menuId === MenuId.TunnelLocalAddressInline ? ['ports-view-actionbar-cell-localaddress'] : undefined
			});
		templateData.actionBar.context = this.tunnelContext(element.tunnel);
		templateData.container.style.paddingLeft = '10px';
		const context: [string, any][] =
			[
				['view', TUNNEL_VIEW_ID],
				[TunnelTypeContextKey.key, element.tunnel.tunnelType],
				[TunnelCloseableContextKey.key, element.tunnel.closeable],
				[TunnelPrivacyContextKey.key, element.tunnel.privacy.id],
				[TunnelProtocolContextKey.key, element.tunnel.protocol]
			];
		const contextKeyService = this.contextKeyService.createOverlay(context);
		const disposableStore = new DisposableStore();
		templateData.elementDisposable = disposableStore;
		if (element.menuId) {
			const menu = disposableStore.add(this.menuService.createMenu(element.menuId, contextKeyService));
			let actions = getFlatActionBarActions(menu.getActions({ shouldForwardArgs: true }));
			if (actions) {
				const labelActions = actions.filter(action => action.id.toLowerCase().indexOf('label') >= 0);
				if (labelActions.length > 1) {
					labelActions.sort((a, b) => a.label.length - b.label.length);
					labelActions.pop();
					actions = actions.filter(action => labelActions.indexOf(action) < 0);
				}
				templateData.actionBar.push(actions, { icon: true, label: false });
				if (this._actionRunner) {
					templateData.actionBar.actionRunner = this._actionRunner;
				}
			}
		}
		if (element.icon) {
			templateData.icon.className = `ports-view-actionbar-cell-icon ${ThemeIcon.asClassName(element.icon)}`;
			templateData.icon.title = element.tooltip;
			templateData.icon.style.display = 'inline';
		}
	}

	private renderInputBox(container: HTMLElement, editableData: IEditableData): IDisposable {
		// Required for FireFox. The blur event doesn't fire on FireFox when you just mash the "+" button to forward a port.
		if (this.inputDone) {
			this.inputDone(false, false);
			this.inputDone = undefined;
		}
		container.style.paddingLeft = '5px';
		const value = editableData.startingValue || '';
		const inputBox = new InputBox(container, this.contextViewService, {
			ariaLabel: nls.localize('remote.tunnelsView.input', "Press Enter to confirm or Escape to cancel."),
			validationOptions: {
				validation: (value) => {
					const message = editableData.validationMessage(value);
					if (!message) {
						return null;
					}

					return {
						content: message.content,
						formatContent: true,
						type: message.severity === Severity.Error ? MessageType.ERROR : MessageType.INFO
					};
				}
			},
			placeholder: editableData.placeholder || '',
			inputBoxStyles: defaultInputBoxStyles
		});
		inputBox.value = value;
		inputBox.focus();
		inputBox.select({ start: 0, end: editableData.startingValue ? editableData.startingValue.length : 0 });

		const done = createSingleCallFunction(async (success: boolean, finishEditing: boolean) => {
			dispose(toDispose);
			if (this.inputDone) {
				this.inputDone = undefined;
			}
			inputBox.element.style.display = 'none';
			const inputValue = inputBox.value;
			if (finishEditing) {
				return editableData.onFinish(inputValue, success);
			}
		});
		this.inputDone = done;

		const toDispose = [
			inputBox,
			dom.addStandardDisposableListener(inputBox.inputElement, dom.EventType.KEY_DOWN, async (e: IKeyboardEvent) => {
				if (e.equals(KeyCode.Enter)) {
					e.stopPropagation();
					if (inputBox.validate() !== MessageType.ERROR) {
						return done(true, true);
					} else {
						return done(false, true);
					}
				} else if (e.equals(KeyCode.Escape)) {
					e.preventDefault();
					e.stopPropagation();
					return done(false, true);
				}
			}),
			dom.addDisposableListener(inputBox.inputElement, dom.EventType.BLUR, () => {
				return done(inputBox.validate() !== MessageType.ERROR, true);
			})
		];

		return toDisposable(() => {
			done(false, false);
		});
	}

	disposeElement(element: ActionBarCell, index: number, templateData: IActionBarTemplateData) {
		templateData.elementDisposable.dispose();
	}

	disposeTemplate(templateData: IActionBarTemplateData): void {
		templateData.label.dispose();
		templateData.actionBar.dispose();
		templateData.elementDisposable.dispose();
		templateData.button?.dispose();
	}
}

class TunnelItem implements ITunnelItem {
	static createFromTunnel(remoteExplorerService: IRemoteExplorerService, tunnelService: ITunnelService,
		tunnel: Tunnel, type: TunnelType = TunnelType.Forwarded, closeable?: boolean) {
		return new TunnelItem(type,
			tunnel.remoteHost,
			tunnel.remotePort,
			tunnel.source,
			!!tunnel.hasRunningProcess,
			tunnel.protocol,
			tunnel.localUri,
			tunnel.localAddress,
			tunnel.localPort,
			closeable === undefined ? tunnel.closeable : closeable,
			tunnel.name,
			tunnel.runningProcess,
			tunnel.pid,
			tunnel.privacy,
			remoteExplorerService,
			tunnelService);
	}

	/**
	 * Removes all non-serializable properties from the tunnel
	 * @returns A new TunnelItem without any services
	 */
	public strip(): TunnelItem | undefined {
		return new TunnelItem(
			this.tunnelType,
			this.remoteHost,
			this.remotePort,
			this.source,
			this.hasRunningProcess,
			this.protocol,
			this.localUri,
			this.localAddress,
			this.localPort,
			this.closeable,
			this.name,
			this.runningProcess,
			this.pid,
			this._privacy
		);
	}

	constructor(
		public tunnelType: TunnelType,
		public remoteHost: string,
		public remotePort: number,
		public source: { source: TunnelSource; description: string },
		public hasRunningProcess: boolean,
		public protocol: TunnelProtocol,
		public localUri?: URI,
		public localAddress?: string,
		public localPort?: number,
		public closeable?: boolean,
		public name?: string,
		private runningProcess?: string,
		private pid?: number,
		private _privacy?: TunnelPrivacyId | string,
		private remoteExplorerService?: IRemoteExplorerService,
		private tunnelService?: ITunnelService
	) { }

	get label(): string {
		if (this.tunnelType === TunnelType.Add && this.name) {
			return this.name;
		}
		const portNumberLabel = (isLocalhost(this.remoteHost) || isAllInterfaces(this.remoteHost))
			? `${this.remotePort}`
			: `${this.remoteHost}:${this.remotePort}`;
		if (this.name) {
			return `${this.name} (${portNumberLabel})`;
		} else {
			return portNumberLabel;
		}
	}

	set processDescription(description: string | undefined) {
		this.runningProcess = description;
	}

	get processDescription(): string | undefined {
		let description: string = '';
		if (this.runningProcess) {
			if (this.pid && this.remoteExplorerService?.namedProcesses.has(this.pid)) {
				// This is a known process. Give it a friendly name.
				description = this.remoteExplorerService.namedProcesses.get(this.pid)!;
			} else {
				description = this.runningProcess.replace(/\0/g, ' ').trim();
			}
			if (this.pid) {
				description += ` (${this.pid})`;
			}
		} else if (this.hasRunningProcess) {
			description = nls.localize('tunnelView.runningProcess.inacessable', "Process information unavailable");
		}

		return description;
	}

	get tooltipPostfix(): string {
		let information: string;
		if (this.localAddress) {
			information = nls.localize('remote.tunnel.tooltipForwarded', "Remote port {0}:{1} forwarded to local address {2}. ", this.remoteHost, this.remotePort, this.localAddress);
		} else {
			information = nls.localize('remote.tunnel.tooltipCandidate', "Remote port {0}:{1} not forwarded. ", this.remoteHost, this.remotePort);
		}

		return information;
	}

	get iconTooltip(): string {
		const isAdd = this.tunnelType === TunnelType.Add;
		if (!isAdd) {
			return `${this.processDescription ? nls.localize('tunnel.iconColumn.running', "Port has running process.") :
				nls.localize('tunnel.iconColumn.notRunning', "No running process.")}`;
		} else {
			return this.label;
		}
	}

	get portTooltip(): string {
		const isAdd = this.tunnelType === TunnelType.Add;
		if (!isAdd) {
			return `${this.name ? nls.localize('remote.tunnel.tooltipName', "Port labeled {0}. ", this.name) : ''}`;
		} else {
			return '';
		}
	}

	get processTooltip(): string {
		return this.processDescription ?? '';
	}

	get originTooltip(): string {
		return this.source.description;
	}

	get privacy(): TunnelPrivacy {
		if (this.tunnelService?.privacyOptions) {
			return this.tunnelService?.privacyOptions.find(element => element.id === this._privacy) ??
			{
				id: '',
				themeIcon: Codicon.question.id,
				label: nls.localize('tunnelPrivacy.unknown', "Unknown")
			};
		} else {
			return {
				id: TunnelPrivacyId.Private,
				themeIcon: privatePortIcon.id,
				label: nls.localize('tunnelPrivacy.private', "Private")
			};
		}
	}
}

const TunnelTypeContextKey = new RawContextKey<TunnelType>('tunnelType', TunnelType.Add, true);
const TunnelCloseableContextKey = new RawContextKey<boolean>('tunnelCloseable', false, true);
const TunnelPrivacyContextKey = new RawContextKey<TunnelPrivacyId | string | undefined>('tunnelPrivacy', undefined, true);
const TunnelPrivacyEnabledContextKey = new RawContextKey<boolean>('tunnelPrivacyEnabled', false, true);
const TunnelProtocolContextKey = new RawContextKey<TunnelProtocol | undefined>('tunnelProtocol', TunnelProtocol.Http, true);
const TunnelViewFocusContextKey = new RawContextKey<boolean>('tunnelViewFocus', false, nls.localize('tunnel.focusContext', "Whether the Ports view has focus."));
const TunnelViewSelectionKeyName = 'tunnelViewSelection';
// host:port
const TunnelViewSelectionContextKey = new RawContextKey<string | undefined>(TunnelViewSelectionKeyName, undefined, true);
const TunnelViewMultiSelectionKeyName = 'tunnelViewMultiSelection';
// host:port[]
const TunnelViewMultiSelectionContextKey = new RawContextKey<string[] | undefined>(TunnelViewMultiSelectionKeyName, undefined, true);
const PortChangableContextKey = new RawContextKey<boolean>('portChangable', false, true);
const ProtocolChangeableContextKey = new RawContextKey<boolean>('protocolChangable', true, true);

export class TunnelPanel extends ViewPane {

	static readonly ID = TUNNEL_VIEW_ID;
	static readonly TITLE: ILocalizedString = nls.localize2('remote.tunnel', "Ports");

	private panelContainer: HTMLElement | undefined;
	private table: WorkbenchTable<ITunnelItem> | undefined;
	private readonly tableDisposables: DisposableStore = this._register(new DisposableStore());
	private tunnelTypeContext: IContextKey<TunnelType>;
	private tunnelCloseableContext: IContextKey<boolean>;
	private tunnelPrivacyContext: IContextKey<TunnelPrivacyId | string | undefined>;
	private tunnelPrivacyEnabledContext: IContextKey<boolean>;
	private tunnelProtocolContext: IContextKey<TunnelProtocol | undefined>;
	private tunnelViewFocusContext: IContextKey<boolean>;
	private tunnelViewSelectionContext: IContextKey<string | undefined>;
	private tunnelViewMultiSelectionContext: IContextKey<string[] | undefined>;
	private portChangableContextKey: IContextKey<boolean>;
	private protocolChangableContextKey: IContextKey<boolean>;
	private isEditing: boolean = false;
	// TODO: Should this be removed?
	//@ts-expect-error
	private titleActions: IAction[] = [];
	private lastFocus: number[] = [];

	constructor(
		protected viewModel: ITunnelViewModel,
		options: IViewPaneOptions,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IOpenerService openerService: IOpenerService,
		@IQuickInputService protected quickInputService: IQuickInputService,
		@ICommandService protected commandService: ICommandService,
		@IMenuService private readonly menuService: IMenuService,
		@IThemeService themeService: IThemeService,
		@IRemoteExplorerService private readonly remoteExplorerService: IRemoteExplorerService,
		@IHoverService hoverService: IHoverService,
		@ITunnelService private readonly tunnelService: ITunnelService,
		@IContextViewService private readonly contextViewService: IContextViewService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, hoverService);
		this.tunnelTypeContext = TunnelTypeContextKey.bindTo(contextKeyService);
		this.tunnelCloseableContext = TunnelCloseableContextKey.bindTo(contextKeyService);
		this.tunnelPrivacyContext = TunnelPrivacyContextKey.bindTo(contextKeyService);
		this.tunnelPrivacyEnabledContext = TunnelPrivacyEnabledContextKey.bindTo(contextKeyService);
		this.tunnelPrivacyEnabledContext.set(tunnelService.canChangePrivacy);
		this.protocolChangableContextKey = ProtocolChangeableContextKey.bindTo(contextKeyService);
		this.protocolChangableContextKey.set(tunnelService.canChangeProtocol);
		this.tunnelProtocolContext = TunnelProtocolContextKey.bindTo(contextKeyService);
		this.tunnelViewFocusContext = TunnelViewFocusContextKey.bindTo(contextKeyService);
		this.tunnelViewSelectionContext = TunnelViewSelectionContextKey.bindTo(contextKeyService);
		this.tunnelViewMultiSelectionContext = TunnelViewMultiSelectionContextKey.bindTo(contextKeyService);
		this.portChangableContextKey = PortChangableContextKey.bindTo(contextKeyService);

		const overlayContextKeyService = this.contextKeyService.createOverlay([['view', TunnelPanel.ID]]);
		const titleMenu = this._register(this.menuService.createMenu(MenuId.TunnelTitle, overlayContextKeyService));
		const updateActions = () => {
			this.titleActions = getFlatActionBarActions(titleMenu.getActions());
			this.updateActions();
		};

		this._register(titleMenu.onDidChange(updateActions));
		updateActions();

		this._register(toDisposable(() => {
			this.titleActions = [];
		}));

		this.registerPrivacyActions();
		this._register(Event.once(this.tunnelService.onAddedTunnelProvider)(() => {
			let updated = false;
			if (this.tunnelPrivacyEnabledContext.get() === false) {
				this.tunnelPrivacyEnabledContext.set(tunnelService.canChangePrivacy);
				updated = true;
			}
			if (this.protocolChangableContextKey.get() === true) {
				this.protocolChangableContextKey.set(tunnelService.canChangeProtocol);
				updated = true;
			}
			if (updated) {
				updateActions();
				this.registerPrivacyActions();
				this.createTable();
				this.table?.layout(this.height, this.width);
			}
		}));
	}

	private registerPrivacyActions() {
		for (const privacyOption of this.tunnelService.privacyOptions) {
			const optionId = `remote.tunnel.privacy${privacyOption.id}`;
			CommandsRegistry.registerCommand(optionId, ChangeTunnelPrivacyAction.handler(privacyOption.id));
			MenuRegistry.appendMenuItem(MenuId.TunnelPrivacy, ({
				order: 0,
				command: {
					id: optionId,
					title: privacyOption.label,
					toggled: TunnelPrivacyContextKey.isEqualTo(privacyOption.id)
				}
			}));
		}
	}

	get portCount(): number {
		return this.remoteExplorerService.tunnelModel.forwarded.size + this.remoteExplorerService.tunnelModel.detected.size;
	}

	private createTable(): void {
		if (!this.panelContainer) {
			return;
		}
		this.tableDisposables.clear();

		dom.clearNode(this.panelContainer);

		const widgetContainer = dom.append(this.panelContainer, dom.$('.customview-tree'));
		widgetContainer.classList.add('ports-view');
		widgetContainer.classList.add('file-icon-themable-tree', 'show-file-icons');

		const actionBarRenderer = new ActionBarRenderer(this.instantiationService, this.contextKeyService,
			this.menuService, this.contextViewService, this.remoteExplorerService, this.commandService,
			this.configurationService);
		const columns = [new IconColumn(), new PortColumn(), new LocalAddressColumn(), new RunningProcessColumn()];
		if (this.tunnelService.canChangePrivacy) {
			columns.push(new PrivacyColumn());
		}
		columns.push(new OriginColumn());

		this.table = this.instantiationService.createInstance(WorkbenchTable,
			'RemoteTunnels',
			widgetContainer,
			new TunnelTreeVirtualDelegate(this.remoteExplorerService),
			columns,
			[actionBarRenderer],
			{
				keyboardNavigationLabelProvider: {
					getKeyboardNavigationLabel: (item: ITunnelItem) => {
						return item.label;
					}
				},
				multipleSelectionSupport: true,
				accessibilityProvider: {
					getAriaLabel: (item: ITunnelItem) => {
						if (item instanceof TunnelItem) {
							return `${item.tooltipPostfix} ${item.portTooltip} ${item.iconTooltip} ${item.processTooltip} ${item.originTooltip} ${this.tunnelService.canChangePrivacy ? item.privacy.label : ''}`;
						} else {
							return item.label;
						}
					},
					getWidgetAriaLabel: () => nls.localize('tunnelView', "Tunnel View")
				},
				openOnSingleClick: true
			}
		) as WorkbenchTable<ITunnelItem>;

		const actionRunner: ActionRunner = this.tableDisposables.add(new ActionRunner());
		actionBarRenderer.actionRunner = actionRunner;

		this.tableDisposables.add(this.table);
		this.tableDisposables.add(this.table.onContextMenu(e => this.onContextMenu(e, actionRunner)));
		this.tableDisposables.add(this.table.onMouseDblClick(e => this.onMouseDblClick(e)));
		this.tableDisposables.add(this.table.onDidChangeFocus(e => this.onFocusChanged(e)));
		this.tableDisposables.add(this.table.onDidChangeSelection(e => this.onSelectionChanged(e)));
		this.tableDisposables.add(this.table.onDidFocus(() => this.tunnelViewFocusContext.set(true)));
		this.tableDisposables.add(this.table.onDidBlur(() => this.tunnelViewFocusContext.set(false)));

		const rerender = () => this.table?.splice(0, Number.POSITIVE_INFINITY, this.viewModel.all);

		rerender();
		let lastPortCount = this.portCount;
		this.tableDisposables.add(Event.debounce(this.viewModel.onForwardedPortsChanged, (_last, e) => e, 50)(() => {
			const newPortCount = this.portCount;
			if (((lastPortCount === 0) || (newPortCount === 0)) && (lastPortCount !== newPortCount)) {
				this._onDidChangeViewWelcomeState.fire();
			}
			lastPortCount = newPortCount;
			rerender();
		}));

		this.tableDisposables.add(this.table.onMouseClick(e => {
			if (this.hasOpenLinkModifier(e.browserEvent) && this.table) {
				const selection = this.table.getSelectedElements();
				if ((selection.length === 0) ||
					((selection.length === 1) && (selection[0] === e.element))) {
					this.commandService.executeCommand(OpenPortInBrowserAction.ID, e.element);
				}
			}
		}));

		this.tableDisposables.add(this.table.onDidOpen(e => {
			if (!e.element || (e.element.tunnelType !== TunnelType.Forwarded)) {
				return;
			}
			if (e.browserEvent?.type === 'dblclick') {
				this.commandService.executeCommand(LabelTunnelAction.ID);
			}
		}));

		this.tableDisposables.add(this.remoteExplorerService.onDidChangeEditable(e => {
			this.isEditing = !!this.remoteExplorerService.getEditableData(e?.tunnel, e?.editId);
			this._onDidChangeViewWelcomeState.fire();

			if (!this.isEditing) {
				widgetContainer.classList.remove('highlight');
			}

			rerender();

			if (this.isEditing) {
				widgetContainer.classList.add('highlight');
				if (!e) {
					// When we are in editing mode for a new forward, rather than updating an existing one we need to reveal the input box since it might be out of view.
					this.table?.reveal(this.table.indexOf(this.viewModel.input));
				}
			} else {
				if (e && (e.tunnel.tunnelType !== TunnelType.Add)) {
					this.table?.setFocus(this.lastFocus);
				}
				this.focus();
			}
		}));
	}

	protected override renderBody(container: HTMLElement): void {
		super.renderBody(container);

		this.panelContainer = dom.append(container, dom.$('.tree-explorer-viewlet-tree-view'));
		this.createTable();
	}

	override shouldShowWelcome(): boolean {
		return this.viewModel.isEmpty() && !this.isEditing;
	}

	override focus(): void {
		super.focus();
		this.table?.domFocus();
	}

	private onFocusChanged(event: ITableEvent<ITunnelItem>) {
		if (event.indexes.length > 0 && event.elements.length > 0) {
			this.lastFocus = [...event.indexes];
		}
		const elements = event.elements;
		const item = elements && elements.length ? elements[0] : undefined;
		if (item) {
			this.tunnelViewSelectionContext.set(makeAddress(item.remoteHost, item.remotePort));
			this.tunnelTypeContext.set(item.tunnelType);
			this.tunnelCloseableContext.set(!!item.closeable);
			this.tunnelPrivacyContext.set(item.privacy.id);
			this.tunnelProtocolContext.set(item.protocol === TunnelProtocol.Https ? TunnelProtocol.Https : TunnelProtocol.Https);
			this.portChangableContextKey.set(!!item.localPort);
		} else {
			this.tunnelTypeContext.reset();
			this.tunnelViewSelectionContext.reset();
			this.tunnelCloseableContext.reset();
			this.tunnelPrivacyContext.reset();
			this.tunnelProtocolContext.reset();
			this.portChangableContextKey.reset();
		}
	}

	private hasOpenLinkModifier(e: MouseEvent): boolean {
		const editorConf = this.configurationService.getValue<{ multiCursorModifier: 'ctrlCmd' | 'alt' }>('editor');

		let modifierKey = false;
		if (editorConf.multiCursorModifier === 'ctrlCmd') {
			modifierKey = e.altKey;
		} else {
			if (isMacintosh) {
				modifierKey = e.metaKey;
			} else {
				modifierKey = e.ctrlKey;
			}
		}
		return modifierKey;
	}

	private onSelectionChanged(event: ITableEvent<ITunnelItem>) {
		const elements = event.elements;
		if (elements.length > 1) {
			this.tunnelViewMultiSelectionContext.set(elements.map(element => makeAddress(element.remoteHost, element.remotePort)));
		} else {
			this.tunnelViewMultiSelectionContext.set(undefined);
		}
	}

	private onContextMenu(event: ITableContextMenuEvent<ITunnelItem>, actionRunner: ActionRunner): void {
		if ((event.element !== undefined) && !(event.element instanceof TunnelItem)) {
			return;
		}

		event.browserEvent.preventDefault();
		event.browserEvent.stopPropagation();

		const node: TunnelItem | undefined = event.element;

		if (node) {
			this.table?.setFocus([this.table.indexOf(node)]);
			this.tunnelTypeContext.set(node.tunnelType);
			this.tunnelCloseableContext.set(!!node.closeable);
			this.tunnelPrivacyContext.set(node.privacy.id);
			this.tunnelProtocolContext.set(node.protocol);
			this.portChangableContextKey.set(!!node.localPort);
		} else {
			this.tunnelTypeContext.set(TunnelType.Add);
			this.tunnelCloseableContext.set(false);
			this.tunnelPrivacyContext.set(undefined);
			this.tunnelProtocolContext.set(undefined);
			this.portChangableContextKey.set(false);
		}

		this.contextMenuService.showContextMenu({
			menuId: MenuId.TunnelContext,
			menuActionOptions: { shouldForwardArgs: true },
			contextKeyService: this.table?.contextKeyService,
			getAnchor: () => event.anchor,
			getActionViewItem: (action) => {
				const keybinding = this.keybindingService.lookupKeybinding(action.id);
				if (keybinding) {
					return new ActionViewItem(action, action, { label: true, keybinding: keybinding.getLabel() });
				}
				return undefined;
			},
			onHide: (wasCancelled?: boolean) => {
				if (wasCancelled) {
					this.table?.domFocus();
				}
			},
			getActionsContext: () => node?.strip(),
			actionRunner
		});
	}

	private onMouseDblClick(e: ITableMouseEvent<ITunnelItem>): void {
		if (!e.element) {
			this.commandService.executeCommand(ForwardPortAction.INLINE_ID);
		}
	}

	private height = 0;
	private width = 0;
	protected override layoutBody(height: number, width: number): void {
		this.height = height;
		this.width = width;
		super.layoutBody(height, width);
		this.table?.layout(height, width);
	}
}

export class TunnelPanelDescriptor implements IViewDescriptor {
	readonly id = TunnelPanel.ID;
	readonly name: ILocalizedString = TunnelPanel.TITLE;
	readonly ctorDescriptor: SyncDescriptor<TunnelPanel>;
	readonly canToggleVisibility = true;
	readonly hideByDefault = false;
	// group is not actually used for views that are not extension contributed. Use order instead.
	readonly group = 'details@0';
	// -500 comes from the remote explorer viewOrderDelegate
	readonly order = -500;
	readonly remoteAuthority?: string | string[];
	readonly canMoveView = true;
	readonly containerIcon = portsViewIcon;

	constructor(viewModel: ITunnelViewModel, environmentService: IWorkbenchEnvironmentService) {
		this.ctorDescriptor = new SyncDescriptor(TunnelPanel, [viewModel]);
		this.remoteAuthority = environmentService.remoteAuthority ? environmentService.remoteAuthority.split('+')[0] : undefined;
	}
}

function isITunnelItem(item: any): item is ITunnelItem {
	return item && item.tunnelType && item.remoteHost && item.source;
}

namespace LabelTunnelAction {
	export const ID = 'remote.tunnel.label';
	export const LABEL = nls.localize('remote.tunnel.label', "Set Port Label");
	export const COMMAND_ID_KEYWORD = 'label';

	export function handler(): ICommandHandler {
		return async (accessor, arg): Promise<{ port: number; label: string } | undefined> => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			let tunnelContext: ITunnelItem | undefined;
			if (isITunnelItem(arg)) {
				tunnelContext = arg;
			} else {
				const context = accessor.get(IContextKeyService).getContextKeyValue<string | undefined>(TunnelViewSelectionKeyName);
				const tunnel = context ? remoteExplorerService.tunnelModel.forwarded.get(context) : undefined;
				if (tunnel) {
					const tunnelService = accessor.get(ITunnelService);
					tunnelContext = TunnelItem.createFromTunnel(remoteExplorerService, tunnelService, tunnel);
				}
			}
			if (tunnelContext) {
				const tunnelItem: ITunnelItem = tunnelContext;
				return new Promise(resolve => {
					const startingValue = tunnelItem.name ? tunnelItem.name : `${tunnelItem.remotePort}`;
					remoteExplorerService.setEditable(tunnelItem, TunnelEditId.Label, {
						onFinish: async (value, success) => {
							value = value.trim();
							remoteExplorerService.setEditable(tunnelItem, TunnelEditId.Label, null);
							const changed = success && (value !== startingValue);
							if (changed) {
								await remoteExplorerService.tunnelModel.name(tunnelItem.remoteHost, tunnelItem.remotePort, value);
							}
							resolve(changed ? { port: tunnelItem.remotePort, label: value } : undefined);
						},
						validationMessage: () => null,
						placeholder: nls.localize('remote.tunnelsView.labelPlaceholder', "Port label"),
						startingValue
					});
				});
			}
			return undefined;
		};
	}
}

const invalidPortString: string = nls.localize('remote.tunnelsView.portNumberValid', "Forwarded port should be a number or a host:port.");
const maxPortNumber: number = 65536;
const invalidPortNumberString: string = nls.localize('remote.tunnelsView.portNumberToHigh', "Port number must be \u2265 0 and < {0}.", maxPortNumber);
const requiresSudoString: string = nls.localize('remote.tunnelView.inlineElevationMessage', "May Require Sudo");
const alreadyForwarded: string = nls.localize('remote.tunnelView.alreadyForwarded', "Port is already forwarded");

export namespace ForwardPortAction {
	export const INLINE_ID = 'remote.tunnel.forwardInline';
	export const COMMANDPALETTE_ID = 'remote.tunnel.forwardCommandPalette';
	export const LABEL: ILocalizedString = nls.localize2('remote.tunnel.forward', "Forward a Port");
	export const TREEITEM_LABEL = nls.localize('remote.tunnel.forwardItem', "Forward Port");
	const forwardPrompt = nls.localize('remote.tunnel.forwardPrompt', "Port number or address (eg. 3000 or 10.10.10.10:2000).");

	function validateInput(remoteExplorerService: IRemoteExplorerService, tunnelService: ITunnelService, value: string, canElevate: boolean): { content: string; severity: Severity } | null {
		const parsed = parseAddress(value);
		if (!parsed) {
			return { content: invalidPortString, severity: Severity.Error };
		} else if (parsed.port >= maxPortNumber) {
			return { content: invalidPortNumberString, severity: Severity.Error };
		} else if (canElevate && tunnelService.isPortPrivileged(parsed.port)) {
			return { content: requiresSudoString, severity: Severity.Info };
		} else if (mapHasAddressLocalhostOrAllInterfaces(remoteExplorerService.tunnelModel.forwarded, parsed.host, parsed.port)) {
			return { content: alreadyForwarded, severity: Severity.Error };
		}
		return null;
	}

	function error(notificationService: INotificationService, tunnelOrError: RemoteTunnel | string | void, host: string, port: number) {
		if (!tunnelOrError) {
			notificationService.warn(nls.localize('remote.tunnel.forwardError', "Unable to forward {0}:{1}. The host may not be available or that remote port may already be forwarded", host, port));
		} else if (typeof tunnelOrError === 'string') {
			notificationService.warn(nls.localize('remote.tunnel.forwardErrorProvided', "Unable to forward {0}:{1}. {2}", host, port, tunnelOrError));
		}
	}

	export function inlineHandler(): ICommandHandler {
		return async (accessor, arg) => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const notificationService = accessor.get(INotificationService);
			const tunnelService = accessor.get(ITunnelService);
			remoteExplorerService.setEditable(undefined, TunnelEditId.New, {
				onFinish: async (value, success) => {
					remoteExplorerService.setEditable(undefined, TunnelEditId.New, null);
					let parsed: { host: string; port: number } | undefined;
					if (success && (parsed = parseAddress(value))) {
						remoteExplorerService.forward({
							remote: { host: parsed.host, port: parsed.port },
							elevateIfNeeded: true
						}).then(tunnelOrError => error(notificationService, tunnelOrError, parsed!.host, parsed!.port));
					}
				},
				validationMessage: (value) => validateInput(remoteExplorerService, tunnelService, value, tunnelService.canElevate),
				placeholder: forwardPrompt
			});
		};
	}

	export function commandPaletteHandler(): ICommandHandler {
		return async (accessor, arg) => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const notificationService = accessor.get(INotificationService);
			const viewsService = accessor.get(IViewsService);
			const quickInputService = accessor.get(IQuickInputService);
			const tunnelService = accessor.get(ITunnelService);
			await viewsService.openView(TunnelPanel.ID, true);
			const value = await quickInputService.input({
				prompt: forwardPrompt,
				validateInput: (value) => Promise.resolve(validateInput(remoteExplorerService, tunnelService, value, tunnelService.canElevate))
			});
			let parsed: { host: string; port: number } | undefined;
			if (value && (parsed = parseAddress(value))) {
				remoteExplorerService.forward({
					remote: { host: parsed.host, port: parsed.port },
					elevateIfNeeded: true
				}).then(tunnel => error(notificationService, tunnel, parsed!.host, parsed!.port));
			}
		};
	}
}

interface QuickPickTunnel extends IQuickPickItem {
	tunnel?: ITunnelItem;
}

function makeTunnelPicks(tunnels: Tunnel[], remoteExplorerService: IRemoteExplorerService, tunnelService: ITunnelService): QuickPickInput<QuickPickTunnel>[] {
	const picks: QuickPickInput<QuickPickTunnel>[] = tunnels.map(forwarded => {
		const item = TunnelItem.createFromTunnel(remoteExplorerService, tunnelService, forwarded);
		return {
			label: item.label,
			description: item.processDescription,
			tunnel: item
		};
	});
	if (picks.length === 0) {
		picks.push({
			label: nls.localize('remote.tunnel.closeNoPorts', "No ports currently forwarded. Try running the {0} command", ForwardPortAction.LABEL.value)
		});
	}
	return picks;
}

namespace ClosePortAction {
	export const INLINE_ID = 'remote.tunnel.closeInline';
	export const COMMANDPALETTE_ID = 'remote.tunnel.closeCommandPalette';
	export const LABEL: ILocalizedString = nls.localize2('remote.tunnel.close', "Stop Forwarding Port");

	export function inlineHandler(): ICommandHandler {
		return async (accessor, arg) => {
			const contextKeyService = accessor.get(IContextKeyService);
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			let ports: (ITunnelItem | Tunnel)[] = [];
			const multiSelectContext = contextKeyService.getContextKeyValue<string[] | undefined>(TunnelViewMultiSelectionKeyName);
			if (multiSelectContext) {
				multiSelectContext.forEach(context => {
					const tunnel = remoteExplorerService.tunnelModel.forwarded.get(context);
					if (tunnel) {
						ports?.push(tunnel);
					}
				});
			} else if (isITunnelItem(arg)) {
				ports = [arg];
			} else {
				const context = contextKeyService.getContextKeyValue<string | undefined>(TunnelViewSelectionKeyName);
				const tunnel = context ? remoteExplorerService.tunnelModel.forwarded.get(context) : undefined;
				if (tunnel) {
					ports = [tunnel];
				}
			}

			if (!ports || ports.length === 0) {
				return;
			}
			return Promise.all(ports.map(port => remoteExplorerService.close({ host: port.remoteHost, port: port.remotePort }, TunnelCloseReason.User)));
		};
	}

	export function commandPaletteHandler(): ICommandHandler {
		return async (accessor) => {
			const quickInputService = accessor.get(IQuickInputService);
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const tunnelService = accessor.get(ITunnelService);
			const commandService = accessor.get(ICommandService);

			const picks: QuickPickInput<QuickPickTunnel>[] = makeTunnelPicks(Array.from(remoteExplorerService.tunnelModel.forwarded.values()).filter(tunnel => tunnel.closeable), remoteExplorerService, tunnelService);
			const result = await quickInputService.pick(picks, { placeHolder: nls.localize('remote.tunnel.closePlaceholder', "Choose a port to stop forwarding") });
			if (result && result.tunnel) {
				await remoteExplorerService.close({ host: result.tunnel.remoteHost, port: result.tunnel.remotePort }, TunnelCloseReason.User);
			} else if (result) {
				await commandService.executeCommand(ForwardPortAction.COMMANDPALETTE_ID);
			}
		};
	}
}

export namespace OpenPortInBrowserAction {
	export const ID = 'remote.tunnel.open';
	export const LABEL = nls.localize('remote.tunnel.open', "Open in Browser");

	export function handler(): ICommandHandler {
		return async (accessor, arg) => {
			let key: string | undefined;
			if (isITunnelItem(arg)) {
				key = makeAddress(arg.remoteHost, arg.remotePort);
			} else if (isRemoteTunnel(arg)) {
				key = makeAddress(arg.tunnelRemoteHost, arg.tunnelRemotePort);
			}
			if (key) {
				const model = accessor.get(IRemoteExplorerService).tunnelModel;
				const openerService = accessor.get(IOpenerService);
				return run(model, openerService, key);
			}
		};
	}

	export function run(model: TunnelModel, openerService: IOpenerService, key: string) {
		const tunnel = model.forwarded.get(key) || model.detected.get(key);
		if (tunnel) {
			return openerService.open(tunnel.localUri, { allowContributedOpeners: false });
		}
		return Promise.resolve();
	}
}

export namespace OpenPortInPreviewAction {
	export const ID = 'remote.tunnel.openPreview';
	export const LABEL = nls.localize('remote.tunnel.openPreview', "Preview in Editor");

	export function handler(): ICommandHandler {
		return async (accessor, arg) => {
			let key: string | undefined;
			if (isITunnelItem(arg)) {
				key = makeAddress(arg.remoteHost, arg.remotePort);
			} else if (isRemoteTunnel(arg)) {
				key = makeAddress(arg.tunnelRemoteHost, arg.tunnelRemotePort);
			}
			if (key) {
				const model = accessor.get(IRemoteExplorerService).tunnelModel;
				const openerService = accessor.get(IOpenerService);
				const externalOpenerService = accessor.get(IExternalUriOpenerService);
				return run(model, openerService, externalOpenerService, key);
			}
		};
	}

	export async function run(model: TunnelModel, openerService: IOpenerService, externalOpenerService: IExternalUriOpenerService, key: string) {
		const tunnel = model.forwarded.get(key) || model.detected.get(key);
		if (tunnel) {
			const remoteHost = tunnel.remoteHost.includes(':') ? `[${tunnel.remoteHost}]` : tunnel.remoteHost;
			const sourceUri = URI.parse(`http://${remoteHost}:${tunnel.remotePort}`);
			const opener = await externalOpenerService.getOpener(tunnel.localUri, { sourceUri }, CancellationToken.None);
			if (opener) {
				return opener.openExternalUri(tunnel.localUri, { sourceUri }, CancellationToken.None);
			}
			return openerService.open(tunnel.localUri);
		}
		return Promise.resolve();
	}
}

namespace OpenPortInBrowserCommandPaletteAction {
	export const ID = 'remote.tunnel.openCommandPalette';
	export const LABEL = nls.localize('remote.tunnel.openCommandPalette', "Open Port in Browser");

	interface QuickPickTunnel extends IQuickPickItem {
		tunnel?: TunnelItem;
	}

	export function handler(): ICommandHandler {
		return async (accessor, arg) => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const tunnelService = accessor.get(ITunnelService);
			const model = remoteExplorerService.tunnelModel;
			const quickPickService = accessor.get(IQuickInputService);
			const openerService = accessor.get(IOpenerService);
			const commandService = accessor.get(ICommandService);
			const options: QuickPickTunnel[] = [...model.forwarded, ...model.detected].map(value => {
				const tunnelItem = TunnelItem.createFromTunnel(remoteExplorerService, tunnelService, value[1]);
				return {
					label: tunnelItem.label,
					description: tunnelItem.processDescription,
					tunnel: tunnelItem
				};
			});
			if (options.length === 0) {
				options.push({
					label: nls.localize('remote.tunnel.openCommandPaletteNone', "No ports currently forwarded. Open the Ports view to get started.")
				});
			} else {
				options.push({
					label: nls.localize('remote.tunnel.openCommandPaletteView', "Open the Ports view...")
				});
			}
			const picked = await quickPickService.pick<QuickPickTunnel>(options, { placeHolder: nls.localize('remote.tunnel.openCommandPalettePick', "Choose the port to open") });
			if (picked && picked.tunnel) {
				return OpenPortInBrowserAction.run(model, openerService, makeAddress(picked.tunnel.remoteHost, picked.tunnel.remotePort));
			} else if (picked) {
				return commandService.executeCommand(`${TUNNEL_VIEW_ID}.focus`);
			}
		};
	}
}

namespace CopyAddressAction {
	export const INLINE_ID = 'remote.tunnel.copyAddressInline';
	export const COMMANDPALETTE_ID = 'remote.tunnel.copyAddressCommandPalette';
	export const INLINE_LABEL = nls.localize('remote.tunnel.copyAddressInline', "Copy Local Address");
	export const COMMANDPALETTE_LABEL = nls.localize('remote.tunnel.copyAddressCommandPalette', "Copy Forwarded Port Address");

	async function copyAddress(remoteExplorerService: IRemoteExplorerService, clipboardService: IClipboardService, tunnelItem: { remoteHost: string; remotePort: number }) {
		const address = remoteExplorerService.tunnelModel.address(tunnelItem.remoteHost, tunnelItem.remotePort);
		if (address) {
			await clipboardService.writeText(address.toString());
		}
	}

	export function inlineHandler(): ICommandHandler {
		return async (accessor, arg) => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			let tunnelItem: ITunnelItem | Tunnel | undefined;
			if (isITunnelItem(arg)) {
				tunnelItem = arg;
			} else {
				const context = accessor.get(IContextKeyService).getContextKeyValue<string | undefined>(TunnelViewSelectionKeyName);
				tunnelItem = context ? remoteExplorerService.tunnelModel.forwarded.get(context) : undefined;
			}
			if (tunnelItem) {
				return copyAddress(remoteExplorerService, accessor.get(IClipboardService), tunnelItem);
			}
		};
	}

	export function commandPaletteHandler(): ICommandHandler {
		return async (accessor, arg) => {
			const quickInputService = accessor.get(IQuickInputService);
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const tunnelService = accessor.get(ITunnelService);
			const commandService = accessor.get(ICommandService);
			const clipboardService = accessor.get(IClipboardService);

			const tunnels = Array.from(remoteExplorerService.tunnelModel.forwarded.values()).concat(Array.from(remoteExplorerService.tunnelModel.detected.values()));
			const result = await quickInputService.pick(makeTunnelPicks(tunnels, remoteExplorerService, tunnelService), { placeHolder: nls.localize('remote.tunnel.copyAddressPlaceholdter', "Choose a forwarded port") });
			if (result && result.tunnel) {
				await copyAddress(remoteExplorerService, clipboardService, result.tunnel);
			} else if (result) {
				await commandService.executeCommand(ForwardPortAction.COMMANDPALETTE_ID);
			}
		};
	}
}

namespace ChangeLocalPortAction {
	export const ID = 'remote.tunnel.changeLocalPort';
	export const LABEL = nls.localize('remote.tunnel.changeLocalPort', "Change Local Address Port");

	function validateInput(tunnelService: ITunnelService, value: string, canElevate: boolean): { content: string; severity: Severity } | null {
		if (!value.match(/^[0-9]+$/)) {
			return { content: nls.localize('remote.tunnelsView.portShouldBeNumber', "Local port should be a number."), severity: Severity.Error };
		} else if (Number(value) >= maxPortNumber) {
			return { content: invalidPortNumberString, severity: Severity.Error };
		} else if (canElevate && tunnelService.isPortPrivileged(Number(value))) {
			return { content: requiresSudoString, severity: Severity.Info };
		}
		return null;
	}

	export function handler(): ICommandHandler {
		return async (accessor, arg) => {
			const remoteExplorerService = accessor.get(IRemoteExplorerService);
			const notificationService = accessor.get(INotificationService);
			const tunnelService = accessor.get(ITunnelService);
			let tunnelContext: ITunnelItem | undefined;
			if (isITunnelItem(arg)) {
				tunnelContext = arg;
			} else {
				const context = accessor.get(IContextKeyService).getContextKeyValue<string | undefined>(TunnelViewSelectionKeyName);
				const tunnel = context ? remoteExplorerService.tunnelModel.forwarded.get(context) : undefined;
				if (tunnel) {
					const tunnelService = accessor.get(ITunnelService);
					tunnelContext = TunnelItem.createFromTunnel(remoteExplorerService, tunnelService, tunnel);
				}
			}

			if (tunnelContext) {
				const tunnelItem: ITunnelItem = tunnelContext;
				remoteExplorerService.setEditable(tunnelItem, TunnelEditId.LocalPort, {
					onFinish: async (value, success) => {
						remoteExplorerService.setEditable(tunnelItem, TunnelEditId.LocalPort, null);
						if (success) {
							await remoteExplorerService.close({ host: tunnelItem.remoteHost, port: tunnelItem.remotePort }, TunnelCloseReason.Other);
							const numberValue = Number(value);
							const newForward = await remoteExplorerService.forward({
								remote: { host: tunnelItem.remoteHost, port: tunnelItem.remotePort },
								local: numberValue,
								name: tunnelItem.name,
								elevateIfNeeded: true,
								source: tunnelItem.source
							});
							if (newForward && (typeof newForward !== 'string') && newForward.tunnelLocalPort !== numberValue) {
								notificationService.warn(nls.localize('remote.tunnel.changeLocalPortNumber', "The local port {0} is not available. Port number {1} has been used instead", value, newForward.tunnelLocalPort ?? newForward.localAddress));
							}
						}
					},
					validationMessage: (value) => validateInput(tunnelService, value, tunnelService.canElevate),
					placeholder: nls.localize('remote.tunnelsView.changePort', "New local port")
				});
			}
		};
	}
}

namespace ChangeTunnelPrivacyAction {
	export function handler(privacyId: string): ICommandHandler {
		return async (accessor, arg) => {
			if (isITunnelItem(arg)) {
				const remoteExplorerService = accessor.get(IRemoteExplorerService);
				await remoteExplorerService.close({ host: arg.remoteHost, port: arg.remotePort }, TunnelCloseReason.Other);
				return remoteExplorerService.forward({
					remote: { host: arg.remoteHost, port: arg.remotePort },
					local: arg.localPort,
					name: arg.name,
					elevateIfNeeded: true,
					privacy: privacyId,
					source: arg.source
				});
			}

			return undefined;
		};
	}
}

namespace SetTunnelProtocolAction {
	export const ID_HTTP = 'remote.tunnel.setProtocolHttp';
	export const ID_HTTPS = 'remote.tunnel.setProtocolHttps';
	export const LABEL_HTTP = nls.localize('remote.tunnel.protocolHttp', "HTTP");
	export const LABEL_HTTPS = nls.localize('remote.tunnel.protocolHttps', "HTTPS");

	async function handler(arg: any, protocol: TunnelProtocol, remoteExplorerService: IRemoteExplorerService, environmentService: IWorkbenchEnvironmentService) {
		if (isITunnelItem(arg)) {
			const attributes: Partial<Attributes> = {
				protocol
			};
			const target = environmentService.remoteAuthority ? ConfigurationTarget.USER_REMOTE : ConfigurationTarget.USER_LOCAL;
			return remoteExplorerService.tunnelModel.configPortsAttributes.addAttributes(arg.remotePort, attributes, target);
		}
	}

	export function handlerHttp(): ICommandHandler {
		return async (accessor, arg) => {
			return handler(arg, TunnelProtocol.Http, accessor.get(IRemoteExplorerService), accessor.get(IWorkbenchEnvironmentService));
		};
	}

	export function handlerHttps(): ICommandHandler {
		return async (accessor, arg) => {
			return handler(arg, TunnelProtocol.Https, accessor.get(IRemoteExplorerService), accessor.get(IWorkbenchEnvironmentService));
		};
	}
}

const tunnelViewCommandsWeightBonus = 10; // give our commands a little bit more weight over other default list/tree commands

const isForwardedExpr = TunnelTypeContextKey.isEqualTo(TunnelType.Forwarded);
const isForwardedOrDetectedExpr = ContextKeyExpr.or(isForwardedExpr, TunnelTypeContextKey.isEqualTo(TunnelType.Detected));
const isNotMultiSelectionExpr = TunnelViewMultiSelectionContextKey.isEqualTo(undefined);

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: LabelTunnelAction.ID,
	weight: KeybindingWeight.WorkbenchContrib + tunnelViewCommandsWeightBonus,
	when: ContextKeyExpr.and(TunnelViewFocusContextKey, isForwardedExpr, isNotMultiSelectionExpr),
	primary: KeyCode.F2,
	mac: {
		primary: KeyCode.Enter
	},
	handler: LabelTunnelAction.handler()
});
CommandsRegistry.registerCommand(ForwardPortAction.INLINE_ID, ForwardPortAction.inlineHandler());
CommandsRegistry.registerCommand(ForwardPortAction.COMMANDPALETTE_ID, ForwardPortAction.commandPaletteHandler());
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: ClosePortAction.INLINE_ID,
	weight: KeybindingWeight.WorkbenchContrib + tunnelViewCommandsWeightBonus,
	when: ContextKeyExpr.and(TunnelCloseableContextKey, TunnelViewFocusContextKey),
	primary: KeyCode.Delete,
	mac: {
		primary: KeyMod.CtrlCmd | KeyCode.Backspace,
		secondary: [KeyCode.Delete]
	},
	handler: ClosePortAction.inlineHandler()
});

CommandsRegistry.registerCommand(ClosePortAction.COMMANDPALETTE_ID, ClosePortAction.commandPaletteHandler());
CommandsRegistry.registerCommand(OpenPortInBrowserAction.ID, OpenPortInBrowserAction.handler());
CommandsRegistry.registerCommand(OpenPortInPreviewAction.ID, OpenPortInPreviewAction.handler());
CommandsRegistry.registerCommand(OpenPortInBrowserCommandPaletteAction.ID, OpenPortInBrowserCommandPaletteAction.handler());
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CopyAddressAction.INLINE_ID,
	weight: KeybindingWeight.WorkbenchContrib + tunnelViewCommandsWeightBonus,
	when: ContextKeyExpr.and(TunnelViewFocusContextKey, isForwardedOrDetectedExpr, isNotMultiSelectionExpr),
	primary: KeyMod.CtrlCmd | KeyCode.KeyC,
	handler: CopyAddressAction.inlineHandler()
});
CommandsRegistry.registerCommand(CopyAddressAction.COMMANDPALETTE_ID, CopyAddressAction.commandPaletteHandler());
CommandsRegistry.registerCommand(ChangeLocalPortAction.ID, ChangeLocalPortAction.handler());
CommandsRegistry.registerCommand(SetTunnelProtocolAction.ID_HTTP, SetTunnelProtocolAction.handlerHttp());
CommandsRegistry.registerCommand(SetTunnelProtocolAction.ID_HTTPS, SetTunnelProtocolAction.handlerHttps());

MenuRegistry.appendMenuItem(MenuId.CommandPalette, ({
	command: {
		id: ClosePortAction.COMMANDPALETTE_ID,
		title: ClosePortAction.LABEL
	},
	when: forwardedPortsViewEnabled
}));
MenuRegistry.appendMenuItem(MenuId.CommandPalette, ({
	command: {
		id: ForwardPortAction.COMMANDPALETTE_ID,
		title: ForwardPortAction.LABEL
	},
	when: forwardedPortsViewEnabled
}));
MenuRegistry.appendMenuItem(MenuId.CommandPalette, ({
	command: {
		id: CopyAddressAction.COMMANDPALETTE_ID,
		title: CopyAddressAction.COMMANDPALETTE_LABEL
	},
	when: forwardedPortsViewEnabled
}));
MenuRegistry.appendMenuItem(MenuId.CommandPalette, ({
	command: {
		id: OpenPortInBrowserCommandPaletteAction.ID,
		title: OpenPortInBrowserCommandPaletteAction.LABEL
	},
	when: forwardedPortsViewEnabled
}));

MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '._open',
	order: 0,
	command: {
		id: OpenPortInBrowserAction.ID,
		title: OpenPortInBrowserAction.LABEL,
	},
	when: ContextKeyExpr.and(isForwardedOrDetectedExpr, isNotMultiSelectionExpr)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '._open',
	order: 1,
	command: {
		id: OpenPortInPreviewAction.ID,
		title: OpenPortInPreviewAction.LABEL,
	},
	when: ContextKeyExpr.and(
		isForwardedOrDetectedExpr,
		isNotMultiSelectionExpr)
}));
// The group 0_manage is used by extensions, so try not to change it
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '0_manage',
	order: 1,
	command: {
		id: LabelTunnelAction.ID,
		title: LabelTunnelAction.LABEL,
		icon: labelPortIcon
	},
	when: ContextKeyExpr.and(isForwardedExpr, isNotMultiSelectionExpr)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '2_localaddress',
	order: 0,
	command: {
		id: CopyAddressAction.INLINE_ID,
		title: CopyAddressAction.INLINE_LABEL,
	},
	when: ContextKeyExpr.and(isForwardedOrDetectedExpr, isNotMultiSelectionExpr)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '2_localaddress',
	order: 1,
	command: {
		id: ChangeLocalPortAction.ID,
		title: ChangeLocalPortAction.LABEL,
	},
	when: ContextKeyExpr.and(isForwardedExpr, PortChangableContextKey, isNotMultiSelectionExpr)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '2_localaddress',
	order: 2,
	submenu: MenuId.TunnelPrivacy,
	title: nls.localize('tunnelContext.privacyMenu', "Port Visibility"),
	when: ContextKeyExpr.and(isForwardedExpr, TunnelPrivacyEnabledContextKey)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '2_localaddress',
	order: 3,
	submenu: MenuId.TunnelProtocol,
	title: nls.localize('tunnelContext.protocolMenu', "Change Port Protocol"),
	when: ContextKeyExpr.and(isForwardedExpr, isNotMultiSelectionExpr, ProtocolChangeableContextKey)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '3_forward',
	order: 0,
	command: {
		id: ClosePortAction.INLINE_ID,
		title: ClosePortAction.LABEL,
	},
	when: TunnelCloseableContextKey
}));
MenuRegistry.appendMenuItem(MenuId.TunnelContext, ({
	group: '3_forward',
	order: 1,
	command: {
		id: ForwardPortAction.INLINE_ID,
		title: ForwardPortAction.LABEL,
	},
}));

MenuRegistry.appendMenuItem(MenuId.TunnelProtocol, ({
	order: 0,
	command: {
		id: SetTunnelProtocolAction.ID_HTTP,
		title: SetTunnelProtocolAction.LABEL_HTTP,
		toggled: TunnelProtocolContextKey.isEqualTo(TunnelProtocol.Http)
	}
}));
MenuRegistry.appendMenuItem(MenuId.TunnelProtocol, ({
	order: 1,
	command: {
		id: SetTunnelProtocolAction.ID_HTTPS,
		title: SetTunnelProtocolAction.LABEL_HTTPS,
		toggled: TunnelProtocolContextKey.isEqualTo(TunnelProtocol.Https)
	}
}));


MenuRegistry.appendMenuItem(MenuId.TunnelPortInline, ({
	group: '0_manage',
	order: 0,
	command: {
		id: ForwardPortAction.INLINE_ID,
		title: ForwardPortAction.TREEITEM_LABEL,
		icon: forwardPortIcon
	},
	when: TunnelTypeContextKey.isEqualTo(TunnelType.Candidate)
}));
MenuRegistry.appendMenuItem(MenuId.TunnelPortInline, ({
	group: '0_manage',
	order: 4,
	command: {
		id: LabelTunnelAction.ID,
		title: LabelTunnelAction.LABEL,
		icon: labelPortIcon
	},
	when: isForwardedExpr
}));
MenuRegistry.appendMenuItem(MenuId.TunnelPortInline, ({
	group: '0_manage',
	order: 5,
	command: {
		id: ClosePortAction.INLINE_ID,
		title: ClosePortAction.LABEL,
		icon: stopForwardIcon
	},
	when: TunnelCloseableContextKey
}));

MenuRegistry.appendMenuItem(MenuId.TunnelLocalAddressInline, ({
	order: -1,
	command: {
		id: CopyAddressAction.INLINE_ID,
		title: CopyAddressAction.INLINE_LABEL,
		icon: copyAddressIcon
	},
	when: isForwardedOrDetectedExpr
}));
MenuRegistry.appendMenuItem(MenuId.TunnelLocalAddressInline, ({
	order: 0,
	command: {
		id: OpenPortInBrowserAction.ID,
		title: OpenPortInBrowserAction.LABEL,
		icon: openBrowserIcon
	},
	when: isForwardedOrDetectedExpr
}));
MenuRegistry.appendMenuItem(MenuId.TunnelLocalAddressInline, ({
	order: 1,
	command: {
		id: OpenPortInPreviewAction.ID,
		title: OpenPortInPreviewAction.LABEL,
		icon: openPreviewIcon
	},
	when: isForwardedOrDetectedExpr
}));

registerColor('ports.iconRunningProcessForeground', STATUS_BAR_REMOTE_ITEM_BACKGROUND, nls.localize('portWithRunningProcess.foreground', "The color of the icon for a port that has an associated running process."));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/urlFinder.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/urlFinder.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITerminalInstance, ITerminalService } from '../../terminal/browser/terminal.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { IDebugService, IDebugSession, IReplElement } from '../../debug/common/debug.js';
import { removeAnsiEscapeCodes } from '../../../../base/common/strings.js';

export class UrlFinder extends Disposable {
	/**
	 * Local server url pattern matching following urls:
	 * http://localhost:3000/ - commonly used across multiple frameworks
	 * https://127.0.0.1:5001/ - ASP.NET
	 * http://:8080 - Beego Golang
	 * http://0.0.0.0:4000 - Elixir Phoenix
	 */
	private static readonly localUrlRegex = /\b\w{0,20}(?::\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|:\d{2,5})[\w\-\.\~:\/\?\#[\]\@!\$&\(\)\*\+\,\;\=]*/gim;
	private static readonly extractPortRegex = /(localhost|127\.0\.0\.1|0\.0\.0\.0):(\d{1,5})/;
	/**
	 * https://github.com/microsoft/vscode-remote-release/issues/3949
	 */
	private static readonly localPythonServerRegex = /HTTP\son\s(127\.0\.0\.1|0\.0\.0\.0)\sport\s(\d+)/;

	private static readonly excludeTerminals = ['Dev Containers'];

	private _onDidMatchLocalUrl: Emitter<{ host: string; port: number }> = new Emitter();
	public readonly onDidMatchLocalUrl = this._onDidMatchLocalUrl.event;
	private listeners: Map<ITerminalInstance | string, IDisposable> = new Map();

	constructor(terminalService: ITerminalService, debugService: IDebugService) {
		super();
		// Terminal
		terminalService.instances.forEach(instance => {
			this.registerTerminalInstance(instance);
		});
		this._register(terminalService.onDidCreateInstance(instance => {
			this.registerTerminalInstance(instance);
		}));
		this._register(terminalService.onDidDisposeInstance(instance => {
			this.listeners.get(instance)?.dispose();
			this.listeners.delete(instance);
		}));

		// Debug
		this._register(debugService.onDidNewSession(session => {
			if (!session.parentSession || (session.parentSession && session.hasSeparateRepl())) {
				this.listeners.set(session.getId(), session.onDidChangeReplElements(() => {
					this.processNewReplElements(session);
				}));
			}
		}));
		this._register(debugService.onDidEndSession(({ session }) => {
			if (this.listeners.has(session.getId())) {
				this.listeners.get(session.getId())?.dispose();
				this.listeners.delete(session.getId());
			}
		}));
	}

	private registerTerminalInstance(instance: ITerminalInstance) {
		if (!UrlFinder.excludeTerminals.includes(instance.title)) {
			this.listeners.set(instance, instance.onData(data => {
				this.processData(data);
			}));
		}
	}

	private replPositions: Map<string, { position: number; tail: IReplElement }> = new Map();
	private processNewReplElements(session: IDebugSession) {
		const oldReplPosition = this.replPositions.get(session.getId());
		const replElements = session.getReplElements();
		this.replPositions.set(session.getId(), { position: replElements.length - 1, tail: replElements[replElements.length - 1] });

		if (!oldReplPosition && replElements.length > 0) {
			replElements.forEach(element => this.processData(element.toString()));
		} else if (oldReplPosition && (replElements.length - 1 !== oldReplPosition.position)) {
			// Process lines until we reach the old "tail"
			for (let i = replElements.length - 1; i >= 0; i--) {
				const element = replElements[i];
				if (element === oldReplPosition.tail) {
					break;
				} else {
					this.processData(element.toString());
				}
			}
		}
	}

	override dispose() {
		super.dispose();
		const listeners = this.listeners.values();
		for (const listener of listeners) {
			listener.dispose();
		}
	}

	private processData(data: string) {
		// strip ANSI terminal codes
		data = removeAnsiEscapeCodes(data);
		const urlMatches = data.match(UrlFinder.localUrlRegex) || [];
		if (urlMatches && urlMatches.length > 0) {
			urlMatches.forEach((match) => {
				// check if valid url
				let serverUrl;
				try {
					serverUrl = new URL(match);
				} catch (e) {
					// Not a valid URL
				}
				if (serverUrl) {
					// check if the port is a valid integer value
					const portMatch = match.match(UrlFinder.extractPortRegex);
					const port = parseFloat(serverUrl.port ? serverUrl.port : (portMatch ? portMatch[2] : 'NaN'));
					if (!isNaN(port) && Number.isInteger(port) && port > 0 && port <= 65535) {
						// normalize the host name
						let host = serverUrl.hostname;
						if (host !== '0.0.0.0' && host !== '127.0.0.1') {
							host = 'localhost';
						}
						// Exclude node inspect, except when using default port
						if (port !== 9229 && data.startsWith('Debugger listening on')) {
							return;
						}
						this._onDidMatchLocalUrl.fire({ port, host });
					}
				}
			});
		} else {
			// Try special python case
			const pythonMatch = data.match(UrlFinder.localPythonServerRegex);
			if (pythonMatch && pythonMatch.length === 3) {
				this._onDidMatchLocalUrl.fire({ host: pythonMatch[1], port: Number(pythonMatch[2]) });
			}
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/media/remoteViewlet.css]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/media/remoteViewlet.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.remote-help-content .monaco-list .monaco-list-row .remote-help-tree-node-item {
	display: flex;
	height: 22px;
	line-height: 22px;
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
	flex-wrap: nowrap;
}

.remote-help-content .monaco-list .monaco-list-row .remote-help-tree-node-item > .remote-help-tree-node-item-icon {
	background-size: 16px;
	background-position: left center;
	background-repeat: no-repeat;
	padding-right: 6px;
	padding-top: 3px;
	width: 16px;
	height: 22px;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.remote-help-content .monaco-list .monaco-list-row .monaco-tl-twistie {
	width: 0px !important;
}

.remote-help-tree-node-item-icon .monaco-icon-label-container > .monaco-icon-name-container {
	padding-left: 22px;
}

.remote-help-content .monaco-list .monaco-list-row .monaco-tl-twistie {
	width: 0px !important;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/browser/media/tunnelView.css]---
Location: vscode-main/src/vs/workbench/contrib/remote/browser/media/tunnelView.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.ports-view .monaco-icon-label,
.ports-view .monaco-icon-label {
	flex: 1;
}

.ports-view .monaco-list .monaco-list-row:hover:not(.highlighted) .monaco-icon-label,
.ports-view .monaco-list .monaco-list-row.focused .monaco-icon-label {
	flex: 1;
}

.ports-view .monaco-list .monaco-list-row .actionBarContainer {
	flex: 1 0 auto;
}

.ports-view .monaco-list .monaco-list-row .actionBarContainer {
	flex: 0 0 auto;
}

.ports-view .monaco-list .monaco-list-row .actionBarContainer {
	text-align: right;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell {
	display: flex;
	flex: 1;
	text-overflow: ellipsis;
	overflow: hidden;
	flex-wrap: nowrap;
	height: 22px;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .monaco-inputbox {
	line-height: 19px;
	height: 22px;
	flex: 1;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .monaco-inputbox input {
	margin-top: -40px;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .ports-view-actionbar-cell-localaddress {
	color: var(--vscode-textLink-foreground);
	text-decoration: var(--text-link-decoration);
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .ports-view-actionbar-cell-localaddress:hover {
	text-decoration: underline;
}

.ports-view .monaco-table-th {
	padding-left: 10px;
}

.ports-view .monaco-table-th[data-col-index="0"],
.ports-view .monaco-table-td[data-col-index="0"] {
	padding-left: 10px;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .monaco-button {
	width: initial;
	padding: 2px 14px;
	line-height: 1.4em;
	margin-top: 4px;
	margin-bottom: 3px;
	margin-left: 3px;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell > .ports-view-actionbar-cell-icon.codicon {
	margin-top: 3px;
	padding-right: 3px;
}

.ports-view .monaco-list .monaco-list-row.selected .ports-view-actionbar-cell > .ports-view-actionbar-cell-icon.codicon {
	color: currentColor !important;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .ports-view-actionbar-cell-resourceLabel .monaco-icon-label-container > .monaco-icon-name-container {
	flex: 1;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .ports-view-actionbar-cell-resourceLabel::after {
	padding-right: 0px;
}

.ports-view .monaco-list .monaco-list-row .ports-view-actionbar-cell .actions {
	display: none;
}

.ports-view .monaco-list .monaco-list-row:hover .ports-view-actionbar-cell .actions,
.ports-view .monaco-list .monaco-list-row.selected .ports-view-actionbar-cell .actions,
.ports-view .monaco-list .monaco-list-row.focused .ports-view-actionbar-cell .actions {
	display: block;
}

.ports-view .monaco-list .ports-view-actionbar-cell .actions .action-label {
	width: 16px;
	height: 100%;
	background-size: 16px;
	background-position: 50% 50%;
	background-repeat: no-repeat;
	padding: 2px;
}

.monaco-workbench .codicon.codicon-ports-forwarded-with-process-icon {
	color: var(--vscode-ports-iconRunningProcessForeground);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/common/remote.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/common/remote.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { ILabelService, ResourceLabelFormatting } from '../../../../platform/label/common/label.js';
import { OperatingSystem, isWeb, OS } from '../../../../base/common/platform.js';
import { Schemas } from '../../../../base/common/network.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { ILoggerService } from '../../../../platform/log/common/log.js';
import { localize, localize2 } from '../../../../nls.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { PersistentConnection } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IDownloadService } from '../../../../platform/download/common/download.js';
import { DownloadServiceChannel } from '../../../../platform/download/common/downloadIpc.js';
import { RemoteLoggerChannelClient } from '../../../../platform/log/common/logIpc.js';
import { REMOTE_DEFAULT_IF_LOCAL_EXTENSIONS } from '../../../../platform/remote/common/remote.js';
import product from '../../../../platform/product/common/product.js';


const EXTENSION_IDENTIFIER_PATTERN = '([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$';

export class LabelContribution implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.remoteLabel';

	constructor(
		@ILabelService private readonly labelService: ILabelService,
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService) {
		this.registerFormatters();
	}

	private registerFormatters(): void {
		this.remoteAgentService.getEnvironment().then(remoteEnvironment => {
			const os = remoteEnvironment?.os || OS;
			const formatting: ResourceLabelFormatting = {
				label: '${path}',
				separator: os === OperatingSystem.Windows ? '\\' : '/',
				tildify: os !== OperatingSystem.Windows,
				normalizeDriveLetter: os === OperatingSystem.Windows,
				workspaceSuffix: isWeb ? undefined : Schemas.vscodeRemote
			};
			this.labelService.registerFormatter({
				scheme: Schemas.vscodeRemote,
				formatting
			});

			if (remoteEnvironment) {
				this.labelService.registerFormatter({
					scheme: Schemas.vscodeUserData,
					formatting
				});
			}
		});
	}
}

class RemoteChannelsContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IDownloadService downloadService: IDownloadService,
		@ILoggerService loggerService: ILoggerService,
	) {
		super();
		const connection = remoteAgentService.getConnection();
		if (connection) {
			connection.registerChannel('download', new DownloadServiceChannel(downloadService));
			connection.withChannel('logger', async channel => this._register(new RemoteLoggerChannelClient(loggerService, channel)));
		}
	}
}

class RemoteInvalidWorkspaceDetector extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.remoteInvalidWorkspaceDetector';

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService
	) {
		super();

		// When connected to a remote workspace, we currently cannot
		// validate that the workspace exists before actually opening
		// it. As such, we need to check on that after startup and guide
		// the user to a valid workspace.
		// (see https://github.com/microsoft/vscode/issues/133872)
		if (this.environmentService.remoteAuthority) {
			remoteAgentService.getEnvironment().then(remoteEnv => {
				if (remoteEnv) {
					// we use the presence of `remoteEnv` to figure out
					// if we got a healthy remote connection
					// (see https://github.com/microsoft/vscode/issues/135331)
					this.validateRemoteWorkspace();
				}
			});
		}
	}

	private async validateRemoteWorkspace(): Promise<void> {
		const workspace = this.contextService.getWorkspace();
		const workspaceUriToStat = workspace.configuration ?? workspace.folders.at(0)?.uri;
		if (!workspaceUriToStat) {
			return; // only when in workspace
		}

		const exists = await this.fileService.exists(workspaceUriToStat);
		if (exists) {
			return; // all good!
		}

		const res = await this.dialogService.confirm({
			type: 'warning',
			message: localize('invalidWorkspaceMessage', "Workspace does not exist"),
			detail: localize('invalidWorkspaceDetail', "Please select another workspace to open."),
			primaryButton: localize({ key: 'invalidWorkspacePrimary', comment: ['&& denotes a mnemonic'] }, "&&Open Workspace...")
		});

		if (res.confirmed) {

			// Pick Workspace
			if (workspace.configuration) {
				return this.fileDialogService.pickWorkspaceAndOpen({});
			}

			// Pick Folder
			return this.fileDialogService.pickFolderAndOpen({});
		}
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
registerWorkbenchContribution2(LabelContribution.ID, LabelContribution, WorkbenchPhase.BlockStartup);
workbenchContributionsRegistry.registerWorkbenchContribution(RemoteChannelsContribution, LifecyclePhase.Restored);
registerWorkbenchContribution2(RemoteInvalidWorkspaceDetector.ID, RemoteInvalidWorkspaceDetector, WorkbenchPhase.BlockStartup);

const enableDiagnostics = true;

if (enableDiagnostics) {
	class TriggerReconnectAction extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.triggerReconnect',
				title: localize2('triggerReconnect', 'Connection: Trigger Reconnect'),
				category: Categories.Developer,
				f1: true,
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			PersistentConnection.debugTriggerReconnection();
		}
	}

	class PauseSocketWriting extends Action2 {
		constructor() {
			super({
				id: 'workbench.action.pauseSocketWriting',
				title: localize2('pauseSocketWriting', 'Connection: Pause socket writing'),
				category: Categories.Developer,
				f1: true,
			});
		}

		async run(accessor: ServicesAccessor): Promise<void> {
			PersistentConnection.debugPauseSocketWriting();
		}
	}

	registerAction2(TriggerReconnectAction);
	registerAction2(PauseSocketWriting);
}

const extensionKindSchema: IJSONSchema = {
	type: 'string',
	enum: [
		'ui',
		'workspace'
	],
	enumDescriptions: [
		localize('ui', "UI extension kind. In a remote window, such extensions are enabled only when available on the local machine."),
		localize('workspace', "Workspace extension kind. In a remote window, such extensions are enabled only when available on the remote.")
	],
};

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		id: 'remote',
		title: localize('remote', "Remote"),
		type: 'object',
		properties: {
			'remote.extensionKind': {
				type: 'object',
				markdownDescription: localize('remote.extensionKind', "Override the kind of an extension. `ui` extensions are installed and run on the local machine while `workspace` extensions are run on the remote. By overriding an extension's default kind using this setting, you specify if that extension should be installed and enabled locally or remotely."),
				patternProperties: {
					[EXTENSION_IDENTIFIER_PATTERN]: {
						oneOf: [{ type: 'array', items: extensionKindSchema }, extensionKindSchema],
						default: ['ui'],
					},
				},
				default: {
					'pub.name': ['ui']
				}
			},
			'remote.restoreForwardedPorts': {
				type: 'boolean',
				markdownDescription: localize('remote.restoreForwardedPorts', "Restores the ports you forwarded in a workspace."),
				default: true
			},
			'remote.autoForwardPorts': {
				type: 'boolean',
				markdownDescription: localize('remote.autoForwardPorts', "When enabled, new running processes are detected and ports that they listen on are automatically forwarded. Disabling this setting will not prevent all ports from being forwarded. Even when disabled, extensions will still be able to cause ports to be forwarded, and opening some URLs will still cause ports to forwarded. Also see {0}.", '`#remote.autoForwardPortsSource#`'),
				default: true
			},
			'remote.autoForwardPortsSource': {
				type: 'string',
				markdownDescription: localize('remote.autoForwardPortsSource', "Sets the source from which ports are automatically forwarded when {0} is true. When {0} is false, {1} will be used to find information about ports that have already been forwarded. On Windows and macOS remotes, the `process` and `hybrid` options have no effect and `output` will be used.", '`#remote.autoForwardPorts#`', '`#remote.autoForwardPortsSource#`'),
				enum: ['process', 'output', 'hybrid'],
				enumDescriptions: [
					localize('remote.autoForwardPortsSource.process', "Ports will be automatically forwarded when discovered by watching for processes that are started and include a port."),
					localize('remote.autoForwardPortsSource.output', "Ports will be automatically forwarded when discovered by reading terminal and debug output. Not all processes that use ports will print to the integrated terminal or debug console, so some ports will be missed. Ports forwarded based on output will not be \"un-forwarded\" until reload or until the port is closed by the user in the Ports view."),
					localize('remote.autoForwardPortsSource.hybrid', "Ports will be automatically forwarded when discovered by reading terminal and debug output. Not all processes that use ports will print to the integrated terminal or debug console, so some ports will be missed. Ports will be \"un-forwarded\" by watching for processes that listen on that port to be terminated.")
				],
				default: 'process'
			},
			'remote.autoForwardPortsFallback': {
				type: 'number',
				default: 20,
				markdownDescription: localize('remote.autoForwardPortFallback', "The number of auto forwarded ports that will trigger the switch from `process` to `hybrid` when automatically forwarding ports and `remote.autoForwardPortsSource` is set to `process` by default. Set to `0` to disable the fallback. When `remote.autoForwardPortsFallback` hasn't been configured, but `remote.autoForwardPortsSource` has, `remote.autoForwardPortsFallback` will be treated as though it's set to `0`.")
			},
			'remote.forwardOnOpen': {
				type: 'boolean',
				description: localize('remote.forwardOnClick', "Controls whether local URLs with a port will be forwarded when opened from the terminal and the debug console."),
				default: true
			},
			// Consider making changes to extensions\configuration-editing\schemas\devContainer.schema.src.json
			// and extensions\configuration-editing\schemas\attachContainer.schema.json
			// to keep in sync with devcontainer.json schema.
			'remote.portsAttributes': {
				type: 'object',
				patternProperties: {
					'(^\\d+(-\\d+)?$)|(.+)': {
						type: 'object',
						description: localize('remote.portsAttributes.port', "A port, range of ports (ex. \"40000-55000\"), host and port (ex. \"db:1234\"), or regular expression (ex. \".+\\\\/server.js\").  For a port number or range, the attributes will apply to that port number or range of port numbers. Attributes which use a regular expression will apply to ports whose associated process command line matches the expression."),
						properties: {
							'onAutoForward': {
								type: 'string',
								enum: ['notify', 'openBrowser', 'openBrowserOnce', 'openPreview', 'silent', 'ignore'],
								enumDescriptions: [
									localize('remote.portsAttributes.notify', "Shows a notification when a port is automatically forwarded."),
									localize('remote.portsAttributes.openBrowser', "Opens the browser when the port is automatically forwarded. Depending on your settings, this could open an embedded browser."),
									localize('remote.portsAttributes.openBrowserOnce', "Opens the browser when the port is automatically forwarded, but only the first time the port is forward during a session. Depending on your settings, this could open an embedded browser."),
									localize('remote.portsAttributes.openPreview', "Opens a preview in the same window when the port is automatically forwarded."),
									localize('remote.portsAttributes.silent', "Shows no notification and takes no action when this port is automatically forwarded."),
									localize('remote.portsAttributes.ignore', "This port will not be automatically forwarded.")
								],
								description: localize('remote.portsAttributes.onForward', "Defines the action that occurs when the port is discovered for automatic forwarding"),
								default: 'notify'
							},
							'elevateIfNeeded': {
								type: 'boolean',
								description: localize('remote.portsAttributes.elevateIfNeeded', "Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port."),
								default: false
							},
							'label': {
								type: 'string',
								description: localize('remote.portsAttributes.label', "Label that will be shown in the UI for this port."),
								default: localize('remote.portsAttributes.labelDefault', "Application")
							},
							'requireLocalPort': {
								type: 'boolean',
								markdownDescription: localize('remote.portsAttributes.requireLocalPort', "When true, a modal dialog will show if the chosen local port isn't used for forwarding."),
								default: false
							},
							'protocol': {
								type: 'string',
								enum: ['http', 'https'],
								description: localize('remote.portsAttributes.protocol', "The protocol to use when forwarding this port.")
							}
						},
						default: {
							'label': localize('remote.portsAttributes.labelDefault', "Application"),
							'onAutoForward': 'notify'
						}
					}
				},
				markdownDescription: localize('remote.portsAttributes', "Set properties that are applied when a specific port number is forwarded. For example:\n\n```\n\"3000\": {\n  \"label\": \"Application\"\n},\n\"40000-55000\": {\n  \"onAutoForward\": \"ignore\"\n},\n\".+\\\\/server.js\": {\n \"onAutoForward\": \"openPreview\"\n}\n```"),
				defaultSnippets: [{ body: { '${1:3000}': { label: '${2:Application}', onAutoForward: 'openPreview' } } }],
				errorMessage: localize('remote.portsAttributes.patternError', "Must be a port number, range of port numbers, or regular expression."),
				additionalProperties: false,
				default: {
					'443': {
						'protocol': 'https'
					},
					'8443': {
						'protocol': 'https'
					}
				}
			},
			'remote.otherPortsAttributes': {
				type: 'object',
				properties: {
					'onAutoForward': {
						type: 'string',
						enum: ['notify', 'openBrowser', 'openPreview', 'silent', 'ignore'],
						enumDescriptions: [
							localize('remote.portsAttributes.notify', "Shows a notification when a port is automatically forwarded."),
							localize('remote.portsAttributes.openBrowser', "Opens the browser when the port is automatically forwarded. Depending on your settings, this could open an embedded browser."),
							localize('remote.portsAttributes.openPreview', "Opens a preview in the same window when the port is automatically forwarded."),
							localize('remote.portsAttributes.silent', "Shows no notification and takes no action when this port is automatically forwarded."),
							localize('remote.portsAttributes.ignore', "This port will not be automatically forwarded.")
						],
						description: localize('remote.portsAttributes.onForward', "Defines the action that occurs when the port is discovered for automatic forwarding"),
						default: 'notify'
					},
					'elevateIfNeeded': {
						type: 'boolean',
						description: localize('remote.portsAttributes.elevateIfNeeded', "Automatically prompt for elevation (if needed) when this port is forwarded. Elevate is required if the local port is a privileged port."),
						default: false
					},
					'label': {
						type: 'string',
						description: localize('remote.portsAttributes.label', "Label that will be shown in the UI for this port."),
						default: localize('remote.portsAttributes.labelDefault', "Application")
					},
					'requireLocalPort': {
						type: 'boolean',
						markdownDescription: localize('remote.portsAttributes.requireLocalPort', "When true, a modal dialog will show if the chosen local port isn't used for forwarding."),
						default: false
					},
					'protocol': {
						type: 'string',
						enum: ['http', 'https'],
						description: localize('remote.portsAttributes.protocol', "The protocol to use when forwarding this port.")
					}
				},
				defaultSnippets: [{ body: { onAutoForward: 'ignore' } }],
				markdownDescription: localize('remote.portsAttributes.defaults', "Set default properties that are applied to all ports that don't get properties from the setting {0}. For example:\n\n```\n{\n  \"onAutoForward\": \"ignore\"\n}\n```", '`#remote.portsAttributes#`'),
				additionalProperties: false
			},
			'remote.localPortHost': {
				type: 'string',
				enum: ['localhost', 'allInterfaces'],
				default: 'localhost',
				description: localize('remote.localPortHost', "Specifies the local host name that will be used for port forwarding.")
			},
			[REMOTE_DEFAULT_IF_LOCAL_EXTENSIONS]: {
				type: 'array',
				markdownDescription: localize('remote.defaultExtensionsIfInstalledLocally.markdownDescription', 'List of extensions to install upon connection to a remote when already installed locally.'),
				default: product?.remoteDefaultExtensionsIfInstalledLocally || [],
				items: {
					type: 'string',
					pattern: EXTENSION_IDENTIFIER_PATTERN,
					patternErrorMessage: localize('remote.defaultExtensionsIfInstalledLocally.invalidFormat', 'Extension identifier must be in format "publisher.name".')
				},
			}
		}
	});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remote/electron-browser/remote.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remote/electron-browser/remote.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IRemoteAgentService, remoteConnectionLatencyMeasurer } from '../../../services/remote/common/remoteAgentService.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isMacintosh, isWindows } from '../../../../base/common/platform.js';
import { KeyMod, KeyChord, KeyCode } from '../../../../base/common/keyCodes.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { IWorkbenchContribution, IWorkbenchContributionsRegistry, WorkbenchPhase, Extensions as WorkbenchContributionsExtensions, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { ILifecycleService, LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { Schemas } from '../../../../base/common/network.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { ipcRenderer } from '../../../../base/parts/sandbox/electron-browser/globals.js';
import { IDiagnosticInfoOptions, IRemoteDiagnosticInfo } from '../../../../platform/diagnostics/common/diagnostics.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { PersistentConnectionEventType } from '../../../../platform/remote/common/remoteAgentConnection.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { OpenLocalFileFolderCommand, OpenLocalFileCommand, OpenLocalFolderCommand, SaveLocalFileCommand, RemoteFileDialogContext } from '../../../services/dialogs/browser/simpleFileDialog.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { TELEMETRY_SETTING_ID } from '../../../../platform/telemetry/common/telemetry.js';
import { getTelemetryLevel } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { IContextKeyService, RawContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IRemoteExplorerService, PORT_AUTO_SOURCE_SETTING, PORT_AUTO_SOURCE_SETTING_OUTPUT } from '../../../services/remote/common/remoteExplorerService.js';
import { Tunnel, TunnelCloseReason } from '../../../services/remote/common/tunnelModel.js';
import { localize } from '../../../../nls.js';
import { RemoteNameContext } from '../../../common/contextkeys.js';

class RemoteAgentDiagnosticListener implements IWorkbenchContribution {
	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ILabelService labelService: ILabelService
	) {
		ipcRenderer.on('vscode:getDiagnosticInfo', (event: unknown, ...args: unknown[]): void => {
			const request = args[0] as { replyChannel: string; args: IDiagnosticInfoOptions };
			const connection = remoteAgentService.getConnection();
			if (connection) {
				const hostName = labelService.getHostLabel(Schemas.vscodeRemote, connection.remoteAuthority);
				remoteAgentService.getDiagnosticInfo(request.args)
					.then(info => {
						if (info) {
							(info as IRemoteDiagnosticInfo).hostName = hostName;
							if (remoteConnectionLatencyMeasurer.latency?.high) {
								(info as IRemoteDiagnosticInfo).latency = {
									average: remoteConnectionLatencyMeasurer.latency.average,
									current: remoteConnectionLatencyMeasurer.latency.current
								};
							}
						}

						ipcRenderer.send(request.replyChannel, info);
					})
					.catch(e => {
						const errorMessage = e && e.message ? `Connection to '${hostName}' could not be established  ${e.message}` : `Connection to '${hostName}' could not be established `;
						ipcRenderer.send(request.replyChannel, { hostName, errorMessage });
					});
			} else {
				ipcRenderer.send(request.replyChannel);
			}
		});
	}
}

class RemoteExtensionHostEnvironmentUpdater extends Disposable implements IWorkbenchContribution {
	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@IRemoteAuthorityResolverService remoteResolverService: IRemoteAuthorityResolverService,
		@IExtensionService extensionService: IExtensionService
	) {
		super();

		const connection = remoteAgentService.getConnection();
		if (connection) {
			this._register(connection.onDidStateChange(async e => {
				if (e.type === PersistentConnectionEventType.ConnectionGain) {
					const resolveResult = await remoteResolverService.resolveAuthority(connection.remoteAuthority);
					if (resolveResult.options && resolveResult.options.extensionHostEnv) {
						await extensionService.setRemoteEnvironment(resolveResult.options.extensionHostEnv);
					}
				}
			}));
		}
	}
}

class RemoteTelemetryEnablementUpdater extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.remoteTelemetryEnablementUpdater';

	constructor(
		@IRemoteAgentService private readonly remoteAgentService: IRemoteAgentService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		super();

		this.updateRemoteTelemetryEnablement();

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(TELEMETRY_SETTING_ID)) {
				this.updateRemoteTelemetryEnablement();
			}
		}));
	}

	private updateRemoteTelemetryEnablement(): Promise<void> {
		return this.remoteAgentService.updateTelemetryLevel(getTelemetryLevel(this.configurationService));
	}
}


class RemoteEmptyWorkbenchPresentation extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.remoteEmptyWorkbenchPresentation';

	constructor(
		@INativeWorkbenchEnvironmentService environmentService: INativeWorkbenchEnvironmentService,
		@IRemoteAuthorityResolverService remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@IConfigurationService configurationService: IConfigurationService,
		@ICommandService commandService: ICommandService,
		@IWorkspaceContextService contextService: IWorkspaceContextService
	) {
		super();

		function shouldShowExplorer(): boolean {
			const startupEditor = configurationService.getValue<string>('workbench.startupEditor');
			return startupEditor !== 'welcomePage' && startupEditor !== 'welcomePageInEmptyWorkbench';
		}

		function shouldShowTerminal(): boolean {
			return shouldShowExplorer();
		}

		const { remoteAuthority, filesToDiff, filesToMerge, filesToOpenOrCreate, filesToWait } = environmentService;
		if (remoteAuthority && contextService.getWorkbenchState() === WorkbenchState.EMPTY && !filesToDiff?.length && !filesToMerge?.length && !filesToOpenOrCreate?.length && !filesToWait) {
			remoteAuthorityResolverService.resolveAuthority(remoteAuthority).then(() => {
				if (shouldShowExplorer()) {
					commandService.executeCommand('workbench.view.explorer');
				}
				if (shouldShowTerminal()) {
					commandService.executeCommand('workbench.action.terminal.toggleTerminal');
				}
			});
		}
	}
}

/**
 * Sets the 'wslFeatureInstalled' context key if the WSL feature is or was installed on this machine.
 */
class WSLContextKeyInitializer extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.wslContextKeyInitializer';

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@INativeHostService nativeHostService: INativeHostService,
		@IStorageService storageService: IStorageService,
		@ILifecycleService lifecycleService: ILifecycleService
	) {
		super();

		const contextKeyId = 'wslFeatureInstalled';
		const storageKey = 'remote.wslFeatureInstalled';

		const defaultValue = storageService.getBoolean(storageKey, StorageScope.APPLICATION, undefined);

		const hasWSLFeatureContext = new RawContextKey<boolean>(contextKeyId, !!defaultValue, nls.localize('wslFeatureInstalled', "Whether the platform has the WSL feature installed"));
		const contextKey = hasWSLFeatureContext.bindTo(contextKeyService);

		if (defaultValue === undefined) {
			lifecycleService.when(LifecyclePhase.Eventually).then(async () => {
				nativeHostService.hasWSLFeatureInstalled().then(res => {
					if (res) {
						contextKey.set(true);
						// once detected, set to true
						storageService.store(storageKey, true, StorageScope.APPLICATION, StorageTarget.MACHINE);
					}
				});
			});
		}
	}
}

const workbenchContributionsRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchContributionsExtensions.Workbench);
workbenchContributionsRegistry.registerWorkbenchContribution(RemoteAgentDiagnosticListener, LifecyclePhase.Eventually);
workbenchContributionsRegistry.registerWorkbenchContribution(RemoteExtensionHostEnvironmentUpdater, LifecyclePhase.Eventually);
registerWorkbenchContribution2(RemoteTelemetryEnablementUpdater.ID, RemoteTelemetryEnablementUpdater, WorkbenchPhase.BlockRestore);
registerWorkbenchContribution2(RemoteEmptyWorkbenchPresentation.ID, RemoteEmptyWorkbenchPresentation, WorkbenchPhase.BlockRestore);
if (isWindows) {
	registerWorkbenchContribution2(WSLContextKeyInitializer.ID, WSLContextKeyInitializer, WorkbenchPhase.BlockRestore);
}

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration)
	.registerConfiguration({
		id: 'remote',
		title: nls.localize('remote', "Remote"),
		type: 'object',
		properties: {
			'remote.downloadExtensionsLocally': {
				type: 'boolean',
				markdownDescription: nls.localize('remote.downloadExtensionsLocally', "When enabled extensions are downloaded locally and installed on remote."),
				default: false
			},
		}
	});

if (isMacintosh) {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: OpenLocalFileFolderCommand.ID,
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyCode.KeyO,
		when: RemoteFileDialogContext,
		metadata: { description: OpenLocalFileFolderCommand.LABEL, args: [] },
		handler: OpenLocalFileFolderCommand.handler()
	});
} else {
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: OpenLocalFileCommand.ID,
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyMod.CtrlCmd | KeyCode.KeyO,
		when: RemoteFileDialogContext,
		metadata: { description: OpenLocalFileCommand.LABEL, args: [] },
		handler: OpenLocalFileCommand.handler()
	});
	KeybindingsRegistry.registerCommandAndKeybindingRule({
		id: OpenLocalFolderCommand.ID,
		weight: KeybindingWeight.WorkbenchContrib,
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyO),
		when: RemoteFileDialogContext,
		metadata: { description: OpenLocalFolderCommand.LABEL, args: [] },
		handler: OpenLocalFolderCommand.handler()
	});
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: SaveLocalFileCommand.ID,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyS,
	when: RemoteFileDialogContext,
	metadata: { description: SaveLocalFileCommand.LABEL, args: [] },
	handler: SaveLocalFileCommand.handler()
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'workbench.remote.action.closeUnusedPorts',
			title: localize('remote.actions.closeUnusedPorts', 'Close Unused Forwarded Ports'),
			category: localize('remote.category', 'Remote'),
			menu: [{
				id: MenuId.CommandPalette
			}],
			precondition: ContextKeyExpr.and(ContextKeyExpr.notEquals(`config.${PORT_AUTO_SOURCE_SETTING}`, PORT_AUTO_SOURCE_SETTING_OUTPUT), RemoteNameContext)
		});
	}

	async run(accessor: ServicesAccessor) {
		const remoteExplorerService = accessor.get(IRemoteExplorerService);
		const ports: Tunnel[] = [];
		// collect all forwarded ports and filter out those who do not have a process running
		const forwarded = remoteExplorerService.tunnelModel.forwarded;
		for (const [_, tunnel] of forwarded) {
			if (tunnel.hasRunningProcess === false) {
				ports.push(tunnel);
			}
		}

		// Close the collected unused ports
		if (ports.length) {
			for (const port of ports) {
				await remoteExplorerService.close({
					host: port.remoteHost,
					port: port.remotePort
				}, TunnelCloseReason.User);
			}
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remoteCodingAgents/browser/remoteCodingAgents.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/remoteCodingAgents/browser/remoteCodingAgents.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { MenuRegistry } from '../../../../platform/actions/common/actions.js';

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { isProposedApiEnabled } from '../../../services/extensions/common/extensions.js';
import { ExtensionsRegistry } from '../../../services/extensions/common/extensionsRegistry.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';
import { IRemoteCodingAgent, IRemoteCodingAgentsService } from '../common/remoteCodingAgentsService.js';

interface IRemoteCodingAgentExtensionPoint {
	id: string;
	command: string;
	displayName: string;
	description?: string;
	followUpRegex?: string;
	when?: string;
}

const extensionPoint = ExtensionsRegistry.registerExtensionPoint<IRemoteCodingAgentExtensionPoint[]>({
	extensionPoint: 'remoteCodingAgents',
	jsonSchema: {
		description: localize('remoteCodingAgentsExtPoint', 'Contributes remote coding agent integrations to the chat widget.'),
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					description: localize('remoteCodingAgentsExtPoint.id', 'A unique identifier for this item.'),
					type: 'string',
				},
				command: {
					description: localize('remoteCodingAgentsExtPoint.command', 'Identifier of the command to execute. The command must be declared in the "commands" section.'),
					type: 'string'
				},
				displayName: {
					description: localize('remoteCodingAgentsExtPoint.displayName', 'A user-friendly name for this item which is used for display in menus.'),
					type: 'string'
				},
				description: {
					description: localize('remoteCodingAgentsExtPoint.description', 'Description of the remote agent for use in menus and tooltips.'),
					type: 'string'
				},
				followUpRegex: {
					description: localize('remoteCodingAgentsExtPoint.followUpRegex', 'The last occurrence of pattern in an existing chat conversation is sent to the contributing extension to facilitate follow-up responses.'),
					type: 'string',
				},
				when: {
					description: localize('remoteCodingAgentsExtPoint.when', 'Condition which must be true to show this item.'),
					type: 'string'
				},
			},
			required: ['command', 'displayName'],
		}
	}
});

export class RemoteCodingAgentsContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IRemoteCodingAgentsService private readonly remoteCodingAgentsService: IRemoteCodingAgentsService
	) {
		super();
		extensionPoint.setHandler(extensions => {
			for (const ext of extensions) {
				if (!isProposedApiEnabled(ext.description, 'remoteCodingAgents')) {
					continue;
				}
				if (!Array.isArray(ext.value)) {
					continue;
				}
				for (const contribution of ext.value) {
					const command = MenuRegistry.getCommand(contribution.command);
					if (!command) {
						continue;
					}

					const agent: IRemoteCodingAgent = {
						id: contribution.id,
						command: contribution.command,
						displayName: contribution.displayName,
						description: contribution.description,
						followUpRegex: contribution.followUpRegex,
						when: contribution.when
					};
					this.remoteCodingAgentsService.registerAgent(agent);
				}
			}
		});
	}
}

const workbenchRegistry = Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench);
workbenchRegistry.registerWorkbenchContribution(RemoteCodingAgentsContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/remoteCodingAgents/common/remoteCodingAgentsService.ts]---
Location: vscode-main/src/vs/workbench/contrib/remoteCodingAgents/common/remoteCodingAgentsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { Event } from '../../../../base/common/event.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ChatContextKeys } from '../../chat/common/chatContextKeys.js';

export interface IRemoteCodingAgent {
	id: string;
	command: string;
	displayName: string;
	description?: string;
	followUpRegex?: string;
	when?: string;
}

export interface IRemoteCodingAgentsService {
	readonly _serviceBrand: undefined;
	getRegisteredAgents(): IRemoteCodingAgent[];
	getAvailableAgents(): IRemoteCodingAgent[];
	registerAgent(agent: IRemoteCodingAgent): void;
}

export const IRemoteCodingAgentsService = createDecorator<IRemoteCodingAgentsService>('remoteCodingAgentsService');

export class RemoteCodingAgentsService extends Disposable implements IRemoteCodingAgentsService {
	readonly _serviceBrand: undefined;
	private readonly _ctxHasRemoteCodingAgent: IContextKey<boolean>;
	private readonly agents: IRemoteCodingAgent[] = [];
	private readonly contextKeys = new Set<string>();

	constructor(
		@IContextKeyService private readonly contextKeyService: IContextKeyService
	) {
		super();
		this._ctxHasRemoteCodingAgent = ChatContextKeys.hasRemoteCodingAgent.bindTo(this.contextKeyService);

		// Listen for context changes and re-evaluate agent availability
		this._register(Event.filter(contextKeyService.onDidChangeContext, e => e.affectsSome(this.contextKeys))(() => {
			this.updateContextKeys();
		}));
	}

	getRegisteredAgents(): IRemoteCodingAgent[] {
		return [...this.agents];
	}

	getAvailableAgents(): IRemoteCodingAgent[] {
		return this.agents.filter(agent => this.isAgentAvailable(agent));
	}

	registerAgent(agent: IRemoteCodingAgent): void {
		// Check if agent already exists
		const existingIndex = this.agents.findIndex(a => a.id === agent.id);
		if (existingIndex >= 0) {
			// Update existing agent
			this.agents[existingIndex] = agent;
		} else {
			// Add new agent
			this.agents.push(agent);
		}

		// Track context keys from the when condition
		if (agent.when) {
			const whenExpr = ContextKeyExpr.deserialize(agent.when);
			if (whenExpr) {
				for (const key of whenExpr.keys()) {
					this.contextKeys.add(key);
				}
			}
		}

		this.updateContextKeys();
	}

	private isAgentAvailable(agent: IRemoteCodingAgent): boolean {
		if (!agent.when) {
			return true;
		}

		const whenExpr = ContextKeyExpr.deserialize(agent.when);
		return !whenExpr || this.contextKeyService.contextMatchesRules(whenExpr);
	}

	private updateContextKeys(): void {
		const hasAvailableAgent = this.getAvailableAgents().length > 0;
		this._ctxHasRemoteCodingAgent.set(hasAvailableAgent);
	}
}

registerSingleton(IRemoteCodingAgentsService, RemoteCodingAgentsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
