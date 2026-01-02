---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 505
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 505 of 552)

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

---[FILE: src/vs/workbench/services/extensionManagement/browser/extensionBisect.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/browser/extensionBisect.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import { IExtensionManagementService, IGlobalExtensionEnablementService, ILocalExtension } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ExtensionType, IExtension, isResolverExtension } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { INotificationService, IPromptChoice, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IHostService } from '../../host/browser/host.js';
import { createDecorator, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Action2, MenuId, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { areSameExtensions } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IWorkbenchExtensionEnablementService } from '../common/extensionManagement.js';

// --- bisect service

export const IExtensionBisectService = createDecorator<IExtensionBisectService>('IExtensionBisectService');

export interface IExtensionBisectService {

	readonly _serviceBrand: undefined;

	isDisabledByBisect(extension: IExtension): boolean;
	isActive: boolean;
	disabledCount: number;
	start(extensions: ILocalExtension[]): Promise<void>;
	next(seeingBad: boolean): Promise<{ id: string; bad: boolean } | undefined>;
	reset(): Promise<void>;
}

class BisectState {

	static fromJSON(raw: string | undefined): BisectState | undefined {
		if (!raw) {
			return undefined;
		}
		try {
			interface Raw extends BisectState { }
			const data: Raw = JSON.parse(raw);
			return new BisectState(data.extensions, data.low, data.high, data.mid);
		} catch {
			return undefined;
		}
	}

	constructor(
		readonly extensions: string[],
		readonly low: number,
		readonly high: number,
		readonly mid: number = ((low + high) / 2) | 0
	) { }
}

class ExtensionBisectService implements IExtensionBisectService {

	declare readonly _serviceBrand: undefined;

	private static readonly _storageKey = 'extensionBisectState';

	private readonly _state: BisectState | undefined;
	private readonly _disabled = new Map<string, boolean>();

	constructor(
		@ILogService logService: ILogService,
		@IStorageService private readonly _storageService: IStorageService,
		@IWorkbenchEnvironmentService private readonly _envService: IWorkbenchEnvironmentService
	) {
		const raw = _storageService.get(ExtensionBisectService._storageKey, StorageScope.APPLICATION);
		this._state = BisectState.fromJSON(raw);

		if (this._state) {
			const { mid, high } = this._state;
			for (let i = 0; i < this._state.extensions.length; i++) {
				const isDisabled = i >= mid && i < high;
				this._disabled.set(this._state.extensions[i], isDisabled);
			}
			logService.warn('extension BISECT active', [...this._disabled]);
		}
	}

	get isActive() {
		return !!this._state;
	}

	get disabledCount() {
		return this._state ? this._state.high - this._state.mid : -1;
	}

	isDisabledByBisect(extension: IExtension): boolean {
		if (!this._state) {
			// bisect isn't active
			return false;
		}
		if (isResolverExtension(extension.manifest, this._envService.remoteAuthority)) {
			// the current remote resolver extension cannot be disabled
			return false;
		}
		if (this._isEnabledInEnv(extension)) {
			// Extension enabled in env cannot be disabled
			return false;
		}
		const disabled = this._disabled.get(extension.identifier.id);
		return disabled ?? false;
	}

	private _isEnabledInEnv(extension: IExtension): boolean {
		return Array.isArray(this._envService.enableExtensions) && this._envService.enableExtensions.some(id => areSameExtensions({ id }, extension.identifier));
	}

	async start(extensions: ILocalExtension[]): Promise<void> {
		if (this._state) {
			throw new Error('invalid state');
		}
		const extensionIds = extensions.map(ext => ext.identifier.id);
		const newState = new BisectState(extensionIds, 0, extensionIds.length, 0);
		this._storageService.store(ExtensionBisectService._storageKey, JSON.stringify(newState), StorageScope.APPLICATION, StorageTarget.MACHINE);
		await this._storageService.flush();
	}

	async next(seeingBad: boolean): Promise<{ id: string; bad: boolean } | undefined> {
		if (!this._state) {
			throw new Error('invalid state');
		}
		// check if bad when all extensions are disabled
		if (seeingBad && this._state.mid === 0 && this._state.high === this._state.extensions.length) {
			return { bad: true, id: '' };
		}
		// check if there is only one left
		if (this._state.low === this._state.high - 1) {
			await this.reset();
			return { id: this._state.extensions[this._state.low], bad: seeingBad };
		}
		// the second half is disabled so if there is still bad it must be
		// in the first half
		const nextState = new BisectState(
			this._state.extensions,
			seeingBad ? this._state.low : this._state.mid,
			seeingBad ? this._state.mid : this._state.high,
		);
		this._storageService.store(ExtensionBisectService._storageKey, JSON.stringify(nextState), StorageScope.APPLICATION, StorageTarget.MACHINE);
		await this._storageService.flush();
		return undefined;
	}

	async reset(): Promise<void> {
		this._storageService.remove(ExtensionBisectService._storageKey, StorageScope.APPLICATION);
		await this._storageService.flush();
	}
}

registerSingleton(IExtensionBisectService, ExtensionBisectService, InstantiationType.Delayed);

// --- bisect UI

class ExtensionBisectUi {

	static ctxIsBisectActive = new RawContextKey<boolean>('isExtensionBisectActive', false);

	constructor(
		@IContextKeyService contextKeyService: IContextKeyService,
		@IExtensionBisectService private readonly _extensionBisectService: IExtensionBisectService,
		@INotificationService private readonly _notificationService: INotificationService,
		@ICommandService private readonly _commandService: ICommandService,
	) {
		if (_extensionBisectService.isActive) {
			ExtensionBisectUi.ctxIsBisectActive.bindTo(contextKeyService).set(true);
			this._showBisectPrompt();
		}
	}

	private _showBisectPrompt(): void {

		const goodPrompt: IPromptChoice = {
			label: localize('I cannot reproduce', "I can't reproduce"),
			run: () => this._commandService.executeCommand('extension.bisect.next', false)
		};
		const badPrompt: IPromptChoice = {
			label: localize('This is Bad', "I can reproduce"),
			run: () => this._commandService.executeCommand('extension.bisect.next', true)
		};
		const stop: IPromptChoice = {
			label: 'Stop Bisect',
			run: () => this._commandService.executeCommand('extension.bisect.stop')
		};

		const message = this._extensionBisectService.disabledCount === 1
			? localize('bisect.singular', "Extension Bisect is active and has disabled 1 extension. Check if you can still reproduce the problem and proceed by selecting from these options.")
			: localize('bisect.plural', "Extension Bisect is active and has disabled {0} extensions. Check if you can still reproduce the problem and proceed by selecting from these options.", this._extensionBisectService.disabledCount);

		this._notificationService.prompt(
			Severity.Info,
			message,
			[goodPrompt, badPrompt, stop],
			{ sticky: true, priority: NotificationPriority.URGENT }
		);
	}
}

Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(
	ExtensionBisectUi,
	LifecyclePhase.Restored
);

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'extension.bisect.start',
			title: localize2('title.start', 'Start Extension Bisect'),
			category: Categories.Help,
			f1: true,
			precondition: ExtensionBisectUi.ctxIsBisectActive.negate(),
			menu: {
				id: MenuId.ViewContainerTitle,
				when: ContextKeyExpr.equals('viewContainer', 'workbench.view.extensions'),
				group: '2_enablement',
				order: 4
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const dialogService = accessor.get(IDialogService);
		const hostService = accessor.get(IHostService);
		const extensionManagement = accessor.get(IExtensionManagementService);
		const extensionEnablementService = accessor.get(IWorkbenchExtensionEnablementService);
		const extensionsBisect = accessor.get(IExtensionBisectService);

		const extensions = (await extensionManagement.getInstalled(ExtensionType.User)).filter(ext => extensionEnablementService.isEnabled(ext));

		const res = await dialogService.confirm({
			message: localize('msg.start', "Extension Bisect"),
			detail: localize('detail.start', "Extension Bisect will use binary search to find an extension that causes a problem. During the process the window reloads repeatedly (~{0} times). Each time you must confirm if you are still seeing problems.", 2 + Math.log2(extensions.length) | 0),
			primaryButton: localize({ key: 'msg2', comment: ['&& denotes a mnemonic'] }, "&&Start Extension Bisect")
		});

		if (res.confirmed) {
			await extensionsBisect.start(extensions);
			hostService.reload();
		}
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'extension.bisect.next',
			title: localize2('title.isBad', 'Continue Extension Bisect'),
			category: Categories.Help,
			f1: true,
			precondition: ExtensionBisectUi.ctxIsBisectActive
		});
	}

	async run(accessor: ServicesAccessor, seeingBad: boolean | undefined): Promise<void> {
		const dialogService = accessor.get(IDialogService);
		const hostService = accessor.get(IHostService);
		const bisectService = accessor.get(IExtensionBisectService);
		const productService = accessor.get(IProductService);
		const extensionEnablementService = accessor.get(IGlobalExtensionEnablementService);
		const commandService = accessor.get(ICommandService);

		if (!bisectService.isActive) {
			return;
		}
		if (seeingBad === undefined) {
			const goodBadStopCancel = await this._checkForBad(dialogService, bisectService);
			if (goodBadStopCancel === null) {
				return;
			}
			seeingBad = goodBadStopCancel;
		}
		if (seeingBad === undefined) {
			await bisectService.reset();
			hostService.reload();
			return;
		}
		const done = await bisectService.next(seeingBad);
		if (!done) {
			hostService.reload();
			return;
		}

		if (done.bad) {
			// DONE but nothing found
			await dialogService.info(
				localize('done.msg', "Extension Bisect"),
				localize('done.detail2', "Extension Bisect is done but no extension has been identified. This might be a problem with {0}.", productService.nameShort)
			);

		} else {
			// DONE and identified extension
			const res = await dialogService.confirm({
				type: Severity.Info,
				message: localize('done.msg', "Extension Bisect"),
				primaryButton: localize({ key: 'report', comment: ['&& denotes a mnemonic'] }, "&&Report Issue & Continue"),
				cancelButton: localize('continue', "Continue"),
				detail: localize('done.detail', "Extension Bisect is done and has identified {0} as the extension causing the problem.", done.id),
				checkbox: { label: localize('done.disbale', "Keep this extension disabled"), checked: true }
			});
			if (res.checkboxChecked) {
				await extensionEnablementService.disableExtension({ id: done.id }, undefined);
			}
			if (res.confirmed) {
				await commandService.executeCommand('workbench.action.openIssueReporter', done.id);
			}
		}
		await bisectService.reset();
		hostService.reload();
	}

	private async _checkForBad(dialogService: IDialogService, bisectService: IExtensionBisectService): Promise<boolean | undefined | null> {
		const { result } = await dialogService.prompt<boolean | undefined | null>({
			type: Severity.Info,
			message: localize('msg.next', "Extension Bisect"),
			detail: localize('bisect', "Extension Bisect is active and has disabled {0} extensions. Check if you can still reproduce the problem and proceed by selecting from these options.", bisectService.disabledCount),
			buttons: [
				{
					label: localize({ key: 'next.good', comment: ['&& denotes a mnemonic'] }, "I ca&&n't reproduce"),
					run: () => false // good now
				},
				{
					label: localize({ key: 'next.bad', comment: ['&& denotes a mnemonic'] }, "I can &&reproduce"),
					run: () => true // bad
				},
				{
					label: localize({ key: 'next.stop', comment: ['&& denotes a mnemonic'] }, "&&Stop Bisect"),
					run: () => undefined // stop
				}
			],
			cancelButton: {
				label: localize({ key: 'next.cancel', comment: ['&& denotes a mnemonic'] }, "&&Cancel Bisect"),
				run: () => null // cancel
			}
		});
		return result;
	}
});

registerAction2(class extends Action2 {
	constructor() {
		super({
			id: 'extension.bisect.stop',
			title: localize2('title.stop', 'Stop Extension Bisect'),
			category: Categories.Help,
			f1: true,
			precondition: ExtensionBisectUi.ctxIsBisectActive
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const extensionsBisect = accessor.get(IExtensionBisectService);
		const hostService = accessor.get(IHostService);
		await extensionsBisect.reset();
		hostService.reload();
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/browser/extensionEnablementService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/browser/extensionEnablementService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { IExtensionManagementService, IExtensionIdentifier, IGlobalExtensionEnablementService, ENABLED_EXTENSIONS_STORAGE_PATH, DISABLED_EXTENSIONS_STORAGE_PATH, InstallOperation, IAllowedExtensionsService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IWorkbenchExtensionEnablementService, EnablementState, IExtensionManagementServerService, IWorkbenchExtensionManagementService, IExtensionManagementServer, ExtensionInstallLocation } from '../common/extensionManagement.js';
import { areSameExtensions, BetterMergeId, getExtensionDependencies, isMalicious } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { ExtensionType, IExtension, isAuthenticationProviderExtension, isLanguagePackExtension, isResolverExtension } from '../../../../platform/extensions/common/extensions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { StorageManager } from '../../../../platform/extensionManagement/common/extensionEnablementService.js';
import { webWorkerExtHostConfig, WebWorkerExtHostConfigValue } from '../../extensions/common/extensions.js';
import { IUserDataSyncAccountService } from '../../../../platform/userDataSync/common/userDataSyncAccount.js';
import { IUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IHostService } from '../../host/browser/host.js';
import { IExtensionBisectService } from './extensionBisect.js';
import { IWorkspaceTrustManagementService, IWorkspaceTrustRequestService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { isVirtualWorkspace } from '../../../../platform/workspace/common/virtualWorkspace.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { equals } from '../../../../base/common/arrays.js';
import { isString } from '../../../../base/common/types.js';
import { Delayer } from '../../../../base/common/async.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { isWeb } from '../../../../base/common/platform.js';

const SOURCE = 'IWorkbenchExtensionEnablementService';

type WorkspaceType = { readonly virtual: boolean; readonly trusted: boolean };

const EXTENSION_UNIFICATION_SETTING = 'chat.extensionUnification.enabled';

export class ExtensionEnablementService extends Disposable implements IWorkbenchExtensionEnablementService {

	declare readonly _serviceBrand: undefined;

	private readonly _onEnablementChanged = new Emitter<readonly IExtension[]>();
	public readonly onEnablementChanged: Event<readonly IExtension[]> = this._onEnablementChanged.event;

	protected readonly extensionsManager: ExtensionsManager;
	private readonly storageManager: StorageManager;
	private extensionsDisabledExtensions: IExtension[] = [];
	private readonly delayer = this._register(new Delayer<void>(0));

	// Extension unification
	private readonly _completionsExtensionId: string | undefined;
	private readonly _chatExtensionId: string | undefined;
	private _extensionUnificationEnabled: boolean;

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IGlobalExtensionEnablementService protected readonly globalExtensionEnablementService: IGlobalExtensionEnablementService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IExtensionManagementService private readonly extensionManagementService: IExtensionManagementService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncAccountService private readonly userDataSyncAccountService: IUserDataSyncAccountService,
		@ILifecycleService private readonly lifecycleService: ILifecycleService,
		@INotificationService private readonly notificationService: INotificationService,
		@IHostService hostService: IHostService,
		@IExtensionBisectService private readonly extensionBisectService: IExtensionBisectService,
		@IAllowedExtensionsService private readonly allowedExtensionsService: IAllowedExtensionsService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IWorkspaceTrustRequestService private readonly workspaceTrustRequestService: IWorkspaceTrustRequestService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IInstantiationService instantiationService: IInstantiationService,
		@ILogService private readonly logService: ILogService,
		@IProductService productService: IProductService
	) {
		super();
		this.storageManager = this._register(new StorageManager(storageService));

		const uninstallDisposable = this._register(Event.filter(extensionManagementService.onDidUninstallExtension, e => !e.error)(({ identifier }) => this._reset(identifier)));
		let isDisposed = false;
		this._register(toDisposable(() => isDisposed = true));
		this.extensionsManager = this._register(instantiationService.createInstance(ExtensionsManager));
		this.extensionsManager.whenInitialized().then(() => {
			if (!isDisposed) {
				uninstallDisposable.dispose();
				this._onDidChangeExtensions([], [], false);
				this._register(this.extensionsManager.onDidChangeExtensions(({ added, removed, isProfileSwitch }) => this._onDidChangeExtensions(added, removed, isProfileSwitch)));
				this.loopCheckForMaliciousExtensions();
			}
		});

		this._register(this.globalExtensionEnablementService.onDidChangeEnablement(({ extensions, source }) => this._onDidChangeGloballyDisabledExtensions(extensions, source)));
		this._register(allowedExtensionsService.onDidChangeAllowedExtensionsConfigValue(() => this._onDidChangeExtensions([], [], false)));

		// Extension unification
		this._completionsExtensionId = productService.defaultChatAgent?.extensionId.toLowerCase();
		this._chatExtensionId = productService.defaultChatAgent?.chatExtensionId.toLowerCase();
		const unificationExtensions = [this._completionsExtensionId, this._chatExtensionId].filter(id => !!id);

		// Disabling extension unification should immediately disable the unified extension flow
		// Enabling extension unification will only take effect after restart
		// Extension Unification is disabled in web when there is no remote authority
		if (isWeb && this.environmentService.remoteAuthority === undefined) {
			this._extensionUnificationEnabled = false;
		} else {
			this._extensionUnificationEnabled = this.configurationService.getValue<boolean>(EXTENSION_UNIFICATION_SETTING);
		}
		this._register(this.configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration(EXTENSION_UNIFICATION_SETTING)) {
				const extensionUnificationEnabled = this.configurationService.getValue<boolean>(EXTENSION_UNIFICATION_SETTING);
				if (!extensionUnificationEnabled) {
					this._extensionUnificationEnabled = false;
					this._onEnablementChanged.fire(this.extensionsManager.extensions.filter(ext => unificationExtensions.includes(ext.identifier.id.toLowerCase())));
				}
			}
		}));

		// delay notification for extensions disabled until workbench restored
		if (this.allUserExtensionsDisabled) {
			this.lifecycleService.when(LifecyclePhase.Eventually).then(() => {
				this.notificationService.prompt(Severity.Info, localize('extensionsDisabled', "All installed extensions are temporarily disabled."), [{
					label: localize('Reload', "Reload and Enable Extensions"),
					run: () => hostService.reload({ disableExtensions: false })
				}], {
					sticky: true,
					priority: NotificationPriority.URGENT
				});
			});
		}
	}

	private get hasWorkspace(): boolean {
		return this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY;
	}

	private get allUserExtensionsDisabled(): boolean {
		return this.environmentService.disableExtensions === true;
	}

	getEnablementState(extension: IExtension): EnablementState {
		return this._computeEnablementState(extension, this.extensionsManager.extensions, this.getWorkspaceType());
	}

	getEnablementStates(extensions: IExtension[], workspaceTypeOverrides: Partial<WorkspaceType> = {}): EnablementState[] {
		const extensionsEnablements = new Map<IExtension, EnablementState>();
		const workspaceType = { ...this.getWorkspaceType(), ...workspaceTypeOverrides };
		return extensions.map(extension => this._computeEnablementState(extension, extensions, workspaceType, extensionsEnablements));
	}

	getDependenciesEnablementStates(extension: IExtension): [IExtension, EnablementState][] {
		return getExtensionDependencies(this.extensionsManager.extensions, extension).map(e => [e, this.getEnablementState(e)]);
	}

	canChangeEnablement(extension: IExtension): boolean {
		try {
			this.throwErrorIfCannotChangeEnablement(extension);
			return true;
		} catch (error) {
			return false;
		}
	}

	canChangeWorkspaceEnablement(extension: IExtension): boolean {
		if (!this.canChangeEnablement(extension)) {
			return false;
		}

		try {
			this.throwErrorIfCannotChangeWorkspaceEnablement(extension);
			return true;
		} catch (error) {
			return false;
		}
	}

	private throwErrorIfCannotChangeEnablement(extension: IExtension, donotCheckDependencies?: boolean): void {
		if (isLanguagePackExtension(extension.manifest)) {
			throw new Error(localize('cannot disable language pack extension', "Cannot change enablement of {0} extension because it contributes language packs.", extension.manifest.displayName || extension.identifier.id));
		}

		if (this.userDataSyncEnablementService.isEnabled() && this.userDataSyncAccountService.account &&
			isAuthenticationProviderExtension(extension.manifest) && extension.manifest.contributes!.authentication!.some(a => a.id === this.userDataSyncAccountService.account!.authenticationProviderId)) {
			throw new Error(localize('cannot disable auth extension', "Cannot change enablement {0} extension because Settings Sync depends on it.", extension.manifest.displayName || extension.identifier.id));
		}

		if (this._isEnabledInEnv(extension)) {
			throw new Error(localize('cannot change enablement environment', "Cannot change enablement of {0} extension because it is enabled in environment", extension.manifest.displayName || extension.identifier.id));
		}

		this.throwErrorIfEnablementStateCannotBeChanged(extension, this.getEnablementState(extension), donotCheckDependencies);
	}

	private throwErrorIfEnablementStateCannotBeChanged(extension: IExtension, enablementStateOfExtension: EnablementState, donotCheckDependencies?: boolean): void {
		switch (enablementStateOfExtension) {
			case EnablementState.DisabledByEnvironment:
				throw new Error(localize('cannot change disablement environment', "Cannot change enablement of {0} extension because it is disabled in environment", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByMalicious:
				throw new Error(localize('cannot change enablement malicious', "Cannot change enablement of {0} extension because it is malicious", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByVirtualWorkspace:
				throw new Error(localize('cannot change enablement virtual workspace', "Cannot change enablement of {0} extension because it does not support virtual workspaces", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByExtensionKind:
				throw new Error(localize('cannot change enablement extension kind', "Cannot change enablement of {0} extension because of its extension kind", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByAllowlist:
				throw new Error(localize('cannot change disallowed extension enablement', "Cannot change enablement of {0} extension because it is disallowed", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByInvalidExtension:
				throw new Error(localize('cannot change invalid extension enablement', "Cannot change enablement of {0} extension because of it is invalid", extension.manifest.displayName || extension.identifier.id));
			case EnablementState.DisabledByExtensionDependency:
				if (donotCheckDependencies) {
					break;
				}
				// Can be changed only when all its dependencies enablements can be changed
				for (const dependency of getExtensionDependencies(this.extensionsManager.extensions, extension)) {
					if (this.isEnabled(dependency)) {
						continue;
					}
					throw new Error(localize('cannot change enablement dependency', "Cannot enable '{0}' extension because it depends on '{1}' extension that cannot be enabled", extension.manifest.displayName || extension.identifier.id, dependency.manifest.displayName || dependency.identifier.id));
				}
		}
	}

	private throwErrorIfCannotChangeWorkspaceEnablement(extension: IExtension): void {
		if (!this.hasWorkspace) {
			throw new Error(localize('noWorkspace', "No workspace."));
		}
		if (isAuthenticationProviderExtension(extension.manifest)) {
			throw new Error(localize('cannot disable auth extension in workspace', "Cannot change enablement of {0} extension in workspace because it contributes authentication providers", extension.manifest.displayName || extension.identifier.id));
		}
	}

	async setEnablement(extensions: IExtension[], newState: EnablementState): Promise<boolean[]> {
		await this.extensionsManager.whenInitialized();

		if (newState === EnablementState.EnabledGlobally || newState === EnablementState.EnabledWorkspace) {
			extensions.push(...this.getExtensionsToEnableRecursively(extensions, this.extensionsManager.extensions, newState, { dependencies: true, pack: true }));
		}

		const workspace = newState === EnablementState.DisabledWorkspace || newState === EnablementState.EnabledWorkspace;
		for (const extension of extensions) {
			if (workspace) {
				this.throwErrorIfCannotChangeWorkspaceEnablement(extension);
			} else {
				this.throwErrorIfCannotChangeEnablement(extension);
			}
		}

		const result: boolean[] = [];
		for (const extension of extensions) {
			const enablementState = this.getEnablementState(extension);
			if (enablementState === EnablementState.DisabledByTrustRequirement
				/* All its disabled dependencies are disabled by Trust Requirement */
				|| (enablementState === EnablementState.DisabledByExtensionDependency && this.getDependenciesEnablementStates(extension).every(([, e]) => this.isEnabledEnablementState(e) || e === EnablementState.DisabledByTrustRequirement))
			) {
				const trustState = await this.workspaceTrustRequestService.requestWorkspaceTrust();
				result.push(trustState ?? false);
			} else {
				result.push(await this._setUserEnablementState(extension, newState));
			}
		}

		const changedExtensions = extensions.filter((e, index) => result[index]);
		if (changedExtensions.length) {
			this._onEnablementChanged.fire(changedExtensions);
		}
		return result;
	}

	private getExtensionsToEnableRecursively(extensions: IExtension[], allExtensions: ReadonlyArray<IExtension>, enablementState: EnablementState, options: { dependencies: boolean; pack: boolean }, checked: IExtension[] = []): IExtension[] {
		if (!options.dependencies && !options.pack) {
			return [];
		}

		const toCheck = extensions.filter(e => checked.indexOf(e) === -1);
		if (!toCheck.length) {
			return [];
		}

		for (const extension of toCheck) {
			checked.push(extension);
		}

		const extensionsToEnable: IExtension[] = [];
		for (const extension of allExtensions) {
			// Extension is already checked
			if (checked.some(e => areSameExtensions(e.identifier, extension.identifier))) {
				continue;
			}

			const enablementStateOfExtension = this.getEnablementState(extension);
			// Extension is enabled
			if (this.isEnabledEnablementState(enablementStateOfExtension)) {
				continue;
			}

			// Skip if dependency extension is disabled by extension kind
			if (enablementStateOfExtension === EnablementState.DisabledByExtensionKind) {
				continue;
			}

			// Check if the extension is a dependency or in extension pack
			if (extensions.some(e =>
				(options.dependencies && e.manifest.extensionDependencies?.some(id => areSameExtensions({ id }, extension.identifier)))
				|| (options.pack && e.manifest.extensionPack?.some(id => areSameExtensions({ id }, extension.identifier))))) {

				const index = extensionsToEnable.findIndex(e => areSameExtensions(e.identifier, extension.identifier));

				// Extension is not added to the disablement list so add it
				if (index === -1) {
					extensionsToEnable.push(extension);
				}

				// Extension is there already in the disablement list.
				else {
					try {
						// Replace only if the enablement state can be changed
						this.throwErrorIfEnablementStateCannotBeChanged(extension, enablementStateOfExtension, true);
						extensionsToEnable.splice(index, 1, extension);
					} catch (error) { /*Do not add*/ }
				}
			}
		}

		if (extensionsToEnable.length) {
			extensionsToEnable.push(...this.getExtensionsToEnableRecursively(extensionsToEnable, allExtensions, enablementState, options, checked));
		}

		return extensionsToEnable;
	}

	private _setUserEnablementState(extension: IExtension, newState: EnablementState): Promise<boolean> {

		const currentState = this._getUserEnablementState(extension.identifier);

		if (currentState === newState) {
			return Promise.resolve(false);
		}

		switch (newState) {
			case EnablementState.EnabledGlobally:
				this._enableExtension(extension.identifier);
				break;
			case EnablementState.DisabledGlobally:
				this._disableExtension(extension.identifier);
				break;
			case EnablementState.EnabledWorkspace:
				this._enableExtensionInWorkspace(extension.identifier);
				break;
			case EnablementState.DisabledWorkspace:
				this._disableExtensionInWorkspace(extension.identifier);
				break;
		}

		return Promise.resolve(true);
	}

	isEnabled(extension: IExtension): boolean {
		const enablementState = this.getEnablementState(extension);
		return this.isEnabledEnablementState(enablementState);
	}

	isEnabledEnablementState(enablementState: EnablementState): boolean {
		return enablementState === EnablementState.EnabledByEnvironment || enablementState === EnablementState.EnabledWorkspace || enablementState === EnablementState.EnabledGlobally;
	}

	isDisabledGlobally(extension: IExtension): boolean {
		return this._isDisabledGlobally(extension.identifier);
	}

	private _computeEnablementState(extension: IExtension, extensions: ReadonlyArray<IExtension>, workspaceType: WorkspaceType, computedEnablementStates?: Map<IExtension, EnablementState>): EnablementState {
		computedEnablementStates = computedEnablementStates ?? new Map<IExtension, EnablementState>();
		let enablementState = computedEnablementStates.get(extension);
		if (enablementState !== undefined) {
			return enablementState;
		}

		enablementState = this._getUserEnablementState(extension.identifier);
		const isEnabled = this.isEnabledEnablementState(enablementState);

		if (isMalicious(extension.identifier, this.getMaliciousExtensions().map(e => ({ extensionOrPublisher: e })))) {
			enablementState = EnablementState.DisabledByMalicious;
		}

		else if (isEnabled && extension.type === ExtensionType.User && this.allowedExtensionsService.isAllowed(extension) !== true) {
			enablementState = EnablementState.DisabledByAllowlist;
		}

		else if (isEnabled && !extension.isValid) {
			enablementState = EnablementState.DisabledByInvalidExtension;
		}

		else if (this.extensionBisectService.isDisabledByBisect(extension)) {
			enablementState = EnablementState.DisabledByEnvironment;
		}

		else if (this._isDisabledInEnv(extension)) {
			enablementState = EnablementState.DisabledByEnvironment;
		}

		else if (this._isDisabledByVirtualWorkspace(extension, workspaceType)) {
			enablementState = EnablementState.DisabledByVirtualWorkspace;
		}

		else if (isEnabled && this._isDisabledByWorkspaceTrust(extension, workspaceType)) {
			enablementState = EnablementState.DisabledByTrustRequirement;
		}

		else if (this._isDisabledByExtensionKind(extension)) {
			enablementState = EnablementState.DisabledByExtensionKind;
		}

		else if (isEnabled && this._isDisabledByExtensionDependency(extension, extensions, workspaceType, computedEnablementStates)) {
			enablementState = EnablementState.DisabledByExtensionDependency;
		}

		else if (this._isDisabledByUnification(extension.identifier)) {
			enablementState = EnablementState.DisabledByUnification;
		}

		else if (!isEnabled && this._isEnabledInEnv(extension)) {
			enablementState = EnablementState.EnabledByEnvironment;
		}

		computedEnablementStates.set(extension, enablementState);
		return enablementState;
	}

	private _isDisabledInEnv(extension: IExtension): boolean {
		if (this.allUserExtensionsDisabled) {
			return !extension.isBuiltin && !isResolverExtension(extension.manifest, this.environmentService.remoteAuthority);
		}

		const disabledExtensions = this.environmentService.disableExtensions;
		if (Array.isArray(disabledExtensions)) {
			return disabledExtensions.some(id => areSameExtensions({ id }, extension.identifier));
		}

		// Check if this is the better merge extension which was migrated to a built-in extension
		if (areSameExtensions({ id: BetterMergeId.value }, extension.identifier)) {
			return true;
		}

		return false;
	}

	private _isEnabledInEnv(extension: IExtension): boolean {
		const enabledExtensions = this.environmentService.enableExtensions;
		if (Array.isArray(enabledExtensions)) {
			return enabledExtensions.some(id => areSameExtensions({ id }, extension.identifier));
		}
		return false;
	}

	private _isDisabledByVirtualWorkspace(extension: IExtension, workspaceType: WorkspaceType): boolean {
		// Not a virtual workspace
		if (!workspaceType.virtual) {
			return false;
		}

		// Supports virtual workspace
		if (this.extensionManifestPropertiesService.getExtensionVirtualWorkspaceSupportType(extension.manifest) !== false) {
			return false;
		}

		// Web extension from web extension management server
		if (this.extensionManagementServerService.getExtensionManagementServer(extension) === this.extensionManagementServerService.webExtensionManagementServer && this.extensionManifestPropertiesService.canExecuteOnWeb(extension.manifest)) {
			return false;
		}

		return true;
	}

	private _isDisabledByExtensionKind(extension: IExtension): boolean {
		if (this.extensionManagementServerService.remoteExtensionManagementServer || this.extensionManagementServerService.webExtensionManagementServer) {
			const installLocation = this.extensionManagementServerService.getExtensionInstallLocation(extension);
			for (const extensionKind of this.extensionManifestPropertiesService.getExtensionKind(extension.manifest)) {
				if (extensionKind === 'ui') {
					if (installLocation === ExtensionInstallLocation.Local) {
						return false;
					}
				}
				if (extensionKind === 'workspace') {
					if (installLocation === ExtensionInstallLocation.Remote) {
						return false;
					}
				}
				if (extensionKind === 'web') {
					if (this.extensionManagementServerService.webExtensionManagementServer /* web */) {
						if (installLocation === ExtensionInstallLocation.Web || installLocation === ExtensionInstallLocation.Remote) {
							return false;
						}
					} else if (installLocation === ExtensionInstallLocation.Local) {
						const enableLocalWebWorker = this.configurationService.getValue<WebWorkerExtHostConfigValue>(webWorkerExtHostConfig);
						if (enableLocalWebWorker === true || enableLocalWebWorker === 'auto') {
							// Web extensions are enabled on all configurations
							return false;
						}
					}
				}
			}
			return true;
		}
		return false;
	}

	private _isDisabledByWorkspaceTrust(extension: IExtension, workspaceType: WorkspaceType): boolean {
		if (workspaceType.trusted) {
			return false;
		}

		if (this.contextService.isInsideWorkspace(extension.location)) {
			return true;
		}

		return this.extensionManifestPropertiesService.getExtensionUntrustedWorkspaceSupportType(extension.manifest) === false;
	}

	private _isDisabledByExtensionDependency(extension: IExtension, extensions: ReadonlyArray<IExtension>, workspaceType: WorkspaceType, computedEnablementStates: Map<IExtension, EnablementState>): boolean {

		if (!extension.manifest.extensionDependencies) {
			return false;
		}

		// Find dependency that is from the same server or does not exports any API
		const dependencyExtensions = extensions.filter(e =>
			extension.manifest.extensionDependencies?.some(id => areSameExtensions(e.identifier, { id })
				&& (this.extensionManagementServerService.getExtensionManagementServer(e) === this.extensionManagementServerService.getExtensionManagementServer(extension) || ((e.manifest.main || e.manifest.browser) && e.manifest.api === 'none'))));

		if (!dependencyExtensions.length) {
			return false;
		}

		const hasEnablementState = computedEnablementStates.has(extension);
		if (!hasEnablementState) {
			// Placeholder to handle cyclic deps
			computedEnablementStates.set(extension, EnablementState.EnabledGlobally);
		}
		try {
			for (const dependencyExtension of dependencyExtensions) {
				const enablementState = this._computeEnablementState(dependencyExtension, extensions, workspaceType, computedEnablementStates);
				if (!this.isEnabledEnablementState(enablementState) && enablementState !== EnablementState.DisabledByExtensionKind) {
					return true;
				}
			}
		} finally {
			if (!hasEnablementState) {
				// remove the placeholder
				computedEnablementStates.delete(extension);
			}
		}

		return false;
	}

	private _getUserEnablementState(identifier: IExtensionIdentifier): EnablementState {
		if (this.hasWorkspace) {
			if (this._getWorkspaceEnabledExtensions().filter(e => areSameExtensions(e, identifier))[0]) {
				return EnablementState.EnabledWorkspace;
			}

			if (this._getWorkspaceDisabledExtensions().filter(e => areSameExtensions(e, identifier))[0]) {
				return EnablementState.DisabledWorkspace;
			}
		}
		if (this._isDisabledGlobally(identifier)) {
			return EnablementState.DisabledGlobally;
		}
		return EnablementState.EnabledGlobally;
	}

	private _isDisabledGlobally(identifier: IExtensionIdentifier): boolean {
		return this.globalExtensionEnablementService.getDisabledExtensions().some(e => areSameExtensions(e, identifier));
	}

	private _isDisabledByUnification(identifier: IExtensionIdentifier): boolean {
		return this._extensionUnificationEnabled && identifier.id.toLowerCase() === this._completionsExtensionId;
	}

	private _enableExtension(identifier: IExtensionIdentifier): Promise<boolean> {
		this._removeFromWorkspaceDisabledExtensions(identifier);
		this._removeFromWorkspaceEnabledExtensions(identifier);
		return this.globalExtensionEnablementService.enableExtension(identifier, SOURCE);
	}

	private _disableExtension(identifier: IExtensionIdentifier): Promise<boolean> {
		this._removeFromWorkspaceDisabledExtensions(identifier);
		this._removeFromWorkspaceEnabledExtensions(identifier);
		return this.globalExtensionEnablementService.disableExtension(identifier, SOURCE);
	}

	private _enableExtensionInWorkspace(identifier: IExtensionIdentifier): void {
		this._removeFromWorkspaceDisabledExtensions(identifier);
		this._addToWorkspaceEnabledExtensions(identifier);
	}

	private _disableExtensionInWorkspace(identifier: IExtensionIdentifier): void {
		this._addToWorkspaceDisabledExtensions(identifier);
		this._removeFromWorkspaceEnabledExtensions(identifier);
	}

	private _addToWorkspaceDisabledExtensions(identifier: IExtensionIdentifier): Promise<boolean> {
		if (!this.hasWorkspace) {
			return Promise.resolve(false);
		}
		const disabledExtensions = this._getWorkspaceDisabledExtensions();
		if (disabledExtensions.every(e => !areSameExtensions(e, identifier))) {
			disabledExtensions.push(identifier);
			this._setDisabledExtensions(disabledExtensions);
			return Promise.resolve(true);
		}
		return Promise.resolve(false);
	}

	private async _removeFromWorkspaceDisabledExtensions(identifier: IExtensionIdentifier): Promise<boolean> {
		if (!this.hasWorkspace) {
			return false;
		}
		const disabledExtensions = this._getWorkspaceDisabledExtensions();
		for (let index = 0; index < disabledExtensions.length; index++) {
			const disabledExtension = disabledExtensions[index];
			if (areSameExtensions(disabledExtension, identifier)) {
				disabledExtensions.splice(index, 1);
				this._setDisabledExtensions(disabledExtensions);
				return true;
			}
		}
		return false;
	}

	private _addToWorkspaceEnabledExtensions(identifier: IExtensionIdentifier): boolean {
		if (!this.hasWorkspace) {
			return false;
		}
		const enabledExtensions = this._getWorkspaceEnabledExtensions();
		if (enabledExtensions.every(e => !areSameExtensions(e, identifier))) {
			enabledExtensions.push(identifier);
			this._setEnabledExtensions(enabledExtensions);
			return true;
		}
		return false;
	}

	private _removeFromWorkspaceEnabledExtensions(identifier: IExtensionIdentifier): boolean {
		if (!this.hasWorkspace) {
			return false;
		}
		const enabledExtensions = this._getWorkspaceEnabledExtensions();
		for (let index = 0; index < enabledExtensions.length; index++) {
			const disabledExtension = enabledExtensions[index];
			if (areSameExtensions(disabledExtension, identifier)) {
				enabledExtensions.splice(index, 1);
				this._setEnabledExtensions(enabledExtensions);
				return true;
			}
		}
		return false;
	}

	protected _getWorkspaceEnabledExtensions(): IExtensionIdentifier[] {
		return this._getExtensions(ENABLED_EXTENSIONS_STORAGE_PATH);
	}

	private _setEnabledExtensions(enabledExtensions: IExtensionIdentifier[]): void {
		this._setExtensions(ENABLED_EXTENSIONS_STORAGE_PATH, enabledExtensions);
	}

	protected _getWorkspaceDisabledExtensions(): IExtensionIdentifier[] {
		return this._getExtensions(DISABLED_EXTENSIONS_STORAGE_PATH);
	}

	private _setDisabledExtensions(disabledExtensions: IExtensionIdentifier[]): void {
		this._setExtensions(DISABLED_EXTENSIONS_STORAGE_PATH, disabledExtensions);
	}

	private _getExtensions(storageId: string): IExtensionIdentifier[] {
		if (!this.hasWorkspace) {
			return [];
		}
		return this.storageManager.get(storageId, StorageScope.WORKSPACE);
	}

	private _setExtensions(storageId: string, extensions: IExtensionIdentifier[]): void {
		this.storageManager.set(storageId, extensions, StorageScope.WORKSPACE);
	}

	private async _onDidChangeGloballyDisabledExtensions(extensionIdentifiers: ReadonlyArray<IExtensionIdentifier>, source?: string): Promise<void> {
		if (source !== SOURCE) {
			await this.extensionsManager.whenInitialized();
			const extensions = this.extensionsManager.extensions.filter(installedExtension => extensionIdentifiers.some(identifier => areSameExtensions(identifier, installedExtension.identifier)));
			this._onEnablementChanged.fire(extensions);
		}
	}

	private _onDidChangeExtensions(added: ReadonlyArray<IExtension>, removed: ReadonlyArray<IExtension>, isProfileSwitch: boolean): void {
		const changedExtensions: IExtension[] = added.filter(e => !this.isEnabledEnablementState(this.getEnablementState(e)));
		const existingDisabledExtensions = this.extensionsDisabledExtensions;
		this.extensionsDisabledExtensions = this.extensionsManager.extensions.filter(extension => {
			const enablementState = this.getEnablementState(extension);
			return enablementState === EnablementState.DisabledByExtensionDependency || enablementState === EnablementState.DisabledByAllowlist || enablementState === EnablementState.DisabledByMalicious;
		});
		for (const extension of existingDisabledExtensions) {
			if (this.extensionsDisabledExtensions.every(e => !areSameExtensions(e.identifier, extension.identifier))) {
				changedExtensions.push(extension);
			}
		}
		for (const extension of this.extensionsDisabledExtensions) {
			if (existingDisabledExtensions.every(e => !areSameExtensions(e.identifier, extension.identifier))) {
				changedExtensions.push(extension);
			}
		}
		if (changedExtensions.length) {
			this._onEnablementChanged.fire(changedExtensions);
		}
		if (!isProfileSwitch) {
			removed.forEach(({ identifier }) => this._reset(identifier));
		}
	}

	public async updateExtensionsEnablementsWhenWorkspaceTrustChanges(): Promise<void> {
		await this.extensionsManager.whenInitialized();

		const computeEnablementStates = (workspaceType: WorkspaceType): [IExtension, EnablementState][] => {
			const extensionsEnablements = new Map<IExtension, EnablementState>();
			return this.extensionsManager.extensions.map(extension => [extension, this._computeEnablementState(extension, this.extensionsManager.extensions, workspaceType, extensionsEnablements)]);
		};

		const workspaceType = this.getWorkspaceType();
		const enablementStatesWithTrustedWorkspace = computeEnablementStates({ ...workspaceType, trusted: true });
		const enablementStatesWithUntrustedWorkspace = computeEnablementStates({ ...workspaceType, trusted: false });
		const enablementChangedExtensionsBecauseOfTrust = enablementStatesWithTrustedWorkspace.filter(([, enablementState], index) => enablementState !== enablementStatesWithUntrustedWorkspace[index][1]).map(([extension]) => extension);

		if (enablementChangedExtensionsBecauseOfTrust.length) {
			this._onEnablementChanged.fire(enablementChangedExtensionsBecauseOfTrust);
		}
	}

	private getWorkspaceType(): WorkspaceType {
		return { trusted: this.workspaceTrustManagementService.isWorkspaceTrusted(), virtual: isVirtualWorkspace(this.contextService.getWorkspace()) };
	}

	private _reset(extension: IExtensionIdentifier) {
		this._removeFromWorkspaceDisabledExtensions(extension);
		this._removeFromWorkspaceEnabledExtensions(extension);
		this.globalExtensionEnablementService.enableExtension(extension);
	}

	private loopCheckForMaliciousExtensions(): void {
		this.checkForMaliciousExtensions()
			.then(() => this.delayer.trigger(() => { }, 1000 * 60 * 5)) // every five minutes
			.then(() => this.loopCheckForMaliciousExtensions());
	}

	private async checkForMaliciousExtensions(): Promise<void> {
		try {
			const extensionsControlManifest = await this.extensionManagementService.getExtensionsControlManifest();
			const changed = this.storeMaliciousExtensions(extensionsControlManifest.malicious.map(({ extensionOrPublisher }) => extensionOrPublisher));
			if (changed) {
				this._onDidChangeExtensions([], [], false);
			}
		} catch (err) {
			this.logService.error(err);
		}
	}

	private getMaliciousExtensions(): ReadonlyArray<IExtensionIdentifier | string> {
		return this.storageService.getObject('extensionsEnablement/malicious', StorageScope.APPLICATION, []);
	}

	private storeMaliciousExtensions(extensions: ReadonlyArray<IExtensionIdentifier | string>): boolean {
		const existing = this.getMaliciousExtensions();
		if (equals(existing, extensions, (a, b) => !isString(a) && !isString(b) ? areSameExtensions(a, b) : a === b)) {
			return false;
		}
		this.storageService.store('extensionsEnablement/malicious', JSON.stringify(extensions), StorageScope.APPLICATION, StorageTarget.MACHINE);
		return true;
	}
}

class ExtensionsManager extends Disposable {

	private _extensions: IExtension[] = [];
	get extensions(): readonly IExtension[] { return this._extensions; }

	private _onDidChangeExtensions = this._register(new Emitter<{ added: readonly IExtension[]; removed: readonly IExtension[]; readonly isProfileSwitch: boolean }>());
	readonly onDidChangeExtensions = this._onDidChangeExtensions.event;

	private readonly initializePromise;
	private disposed: boolean = false;

	constructor(
		@IWorkbenchExtensionManagementService private readonly extensionManagementService: IWorkbenchExtensionManagementService,
		@IExtensionManagementServerService private readonly extensionManagementServerService: IExtensionManagementServerService,
		@ILogService private readonly logService: ILogService
	) {
		super();
		this._register(toDisposable(() => this.disposed = true));
		this.initializePromise = this.initialize();
	}

	whenInitialized(): Promise<void> {
		return this.initializePromise;
	}

	private async initialize(): Promise<void> {
		try {
			this._extensions = [
				...await this.extensionManagementService.getInstalled(),
				...await this.extensionManagementService.getInstalledWorkspaceExtensions(true)
			];
			if (this.disposed) {
				return;
			}
			this._onDidChangeExtensions.fire({ added: this.extensions, removed: [], isProfileSwitch: false });
		} catch (error) {
			this.logService.error(error);
		}
		this._register(this.extensionManagementService.onDidInstallExtensions(e =>
			this.updateExtensions(e.reduce<IExtension[]>((result, { local, operation }) => {
				if (local && operation !== InstallOperation.Migrate) { result.push(local); } return result;
			}, []), [], undefined, false)));
		this._register(Event.filter(this.extensionManagementService.onDidUninstallExtension, (e => !e.error))(e => this.updateExtensions([], [e.identifier], e.server, false)));
		this._register(this.extensionManagementService.onDidChangeProfile(({ added, removed, server }) => {
			this.updateExtensions(added, removed.map(({ identifier }) => identifier), server, true);
		}));
	}

	private updateExtensions(added: IExtension[], identifiers: IExtensionIdentifier[], server: IExtensionManagementServer | undefined, isProfileSwitch: boolean): void {
		if (added.length) {
			for (const extension of added) {
				const extensionServer = this.extensionManagementServerService.getExtensionManagementServer(extension);
				const index = this._extensions.findIndex(e => areSameExtensions(e.identifier, extension.identifier) && this.extensionManagementServerService.getExtensionManagementServer(e) === extensionServer);
				if (index !== -1) {
					this._extensions.splice(index, 1);
				}
			}
			this._extensions.push(...added);
		}
		const removed: IExtension[] = [];
		for (const identifier of identifiers) {
			const index = this._extensions.findIndex(e => areSameExtensions(e.identifier, identifier) && this.extensionManagementServerService.getExtensionManagementServer(e) === server);
			if (index !== -1) {
				removed.push(...this._extensions.splice(index, 1));
			}
		}
		if (added.length || removed.length) {
			this._onDidChangeExtensions.fire({ added, removed, isProfileSwitch });
		}
	}
}

registerSingleton(IWorkbenchExtensionEnablementService, ExtensionEnablementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/browser/extensionGalleryManifestService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/browser/extensionGalleryManifestService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';
import { ExtensionGalleryManifestService as ExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifestService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';

class WebExtensionGalleryManifestService extends ExtensionGalleryManifestService implements IExtensionGalleryManifestService {

	constructor(
		@IProductService productService: IProductService,
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
	) {
		super(productService);
		const remoteConnection = remoteAgentService.getConnection();
		if (remoteConnection) {
			const channel = remoteConnection.getChannel('extensionGalleryManifest');
			this.getExtensionGalleryManifest().then(manifest => {
				channel.call('setExtensionGalleryManifest', [manifest]);
				this._register(this.onDidChangeExtensionGalleryManifest(manifest => channel.call('setExtensionGalleryManifest', [manifest])));
			});
		}
	}

}

registerSingleton(IExtensionGalleryManifestService, WebExtensionGalleryManifestService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/browser/extensionsProfileScannerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/browser/extensionsProfileScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILogService } from '../../../../platform/log/common/log.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { AbstractExtensionsProfileScannerService, IExtensionsProfileScannerService } from '../../../../platform/extensionManagement/common/extensionsProfileScannerService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';

export class ExtensionsProfileScannerService extends AbstractExtensionsProfileScannerService {
	constructor(
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IFileService fileService: IFileService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@ILogService logService: ILogService,
	) {
		super(environmentService.userRoamingDataHome, fileService, userDataProfilesService, uriIdentityService, logService);
	}
}

registerSingleton(IExtensionsProfileScannerService, ExtensionsProfileScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/browser/webExtensionsScannerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/browser/webExtensionsScannerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IBuiltinExtensionsScannerService, ExtensionType, IExtensionIdentifier, IExtension, IExtensionManifest, TargetPlatform, IRelaxedExtensionManifest, parseEnabledApiProposalNames } from '../../../../platform/extensions/common/extensions.js';
import { IBrowserWorkbenchEnvironmentService } from '../../environment/browser/environmentService.js';
import { IScannedExtension, IWebExtensionsScannerService, ScanOptions } from '../common/extensionManagement.js';
import { isWeb, Language } from '../../../../base/common/platform.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { joinPath } from '../../../../base/common/resources.js';
import { URI, UriComponents } from '../../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IFileService } from '../../../../platform/files/common/files.js';
import { Queue } from '../../../../base/common/async.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IExtensionGalleryService, IExtensionInfo, IGalleryExtension, IGalleryMetadata, Metadata } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { areSameExtensions, getGalleryExtensionId, getExtensionId, isMalicious } from '../../../../platform/extensionManagement/common/extensionManagementUtil.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ITranslations, localizeManifest } from '../../../../platform/extensionManagement/common/extensionNls.js';
import { localize, localize2 } from '../../../../nls.js';
import * as semver from '../../../../base/common/semver/semver.js';
import { isString, isUndefined } from '../../../../base/common/types.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IExtensionManifestPropertiesService } from '../../extensions/common/extensionManifestPropertiesService.js';
import { IExtensionResourceLoaderService, migratePlatformSpecificExtensionGalleryResourceURL } from '../../../../platform/extensionResourceLoader/common/extensionResourceLoader.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { IEditorService } from '../../editor/common/editorService.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { basename } from '../../../../base/common/path.js';
import { IExtensionStorageService } from '../../../../platform/extensionManagement/common/extensionStorage.js';
import { isNonEmptyArray } from '../../../../base/common/arrays.js';
import { ILifecycleService, LifecyclePhase } from '../../lifecycle/common/lifecycle.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { validateExtensionManifest } from '../../../../platform/extensions/common/extensionValidator.js';
import Severity from '../../../../base/common/severity.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';

type GalleryExtensionInfo = { readonly id: string; preRelease?: boolean; migrateStorageFrom?: string };
type ExtensionInfo = { readonly id: string; preRelease: boolean };

function isGalleryExtensionInfo(obj: unknown): obj is GalleryExtensionInfo {
	const galleryExtensionInfo = obj as GalleryExtensionInfo | undefined;
	return typeof galleryExtensionInfo?.id === 'string'
		&& (galleryExtensionInfo.preRelease === undefined || typeof galleryExtensionInfo.preRelease === 'boolean')
		&& (galleryExtensionInfo.migrateStorageFrom === undefined || typeof galleryExtensionInfo.migrateStorageFrom === 'string');
}

function isUriComponents(obj: unknown): obj is UriComponents {
	if (!obj) {
		return false;
	}
	const thing = obj as UriComponents | undefined;
	return typeof thing?.path === 'string' &&
		typeof thing?.scheme === 'string';
}

interface IStoredWebExtension {
	readonly identifier: IExtensionIdentifier;
	readonly version: string;
	readonly location: UriComponents;
	readonly manifest?: IExtensionManifest;
	readonly readmeUri?: UriComponents;
	readonly changelogUri?: UriComponents;
	// deprecated in favor of packageNLSUris & fallbackPackageNLSUri
	readonly packageNLSUri?: UriComponents;
	readonly packageNLSUris?: IStringDictionary<UriComponents>;
	readonly fallbackPackageNLSUri?: UriComponents;
	readonly defaultManifestTranslations?: ITranslations | null;
	readonly metadata?: Metadata;
}

interface IWebExtension {
	identifier: IExtensionIdentifier;
	version: string;
	location: URI;
	manifest?: IExtensionManifest;
	readmeUri?: URI;
	changelogUri?: URI;
	// deprecated in favor of packageNLSUris & fallbackPackageNLSUri
	packageNLSUri?: URI;
	packageNLSUris?: Map<string, URI>;
	fallbackPackageNLSUri?: URI;
	defaultManifestTranslations?: ITranslations | null;
	metadata?: Metadata;
}

export class WebExtensionsScannerService extends Disposable implements IWebExtensionsScannerService {

	declare readonly _serviceBrand: undefined;

	private readonly systemExtensionsCacheResource: URI | undefined = undefined;
	private readonly customBuiltinExtensionsCacheResource: URI | undefined = undefined;
	private readonly resourcesAccessQueueMap = new ResourceMap<Queue<IWebExtension[]>>();
	private readonly extensionsEnabledWithApiProposalVersion: string[];

	constructor(
		@IBrowserWorkbenchEnvironmentService private readonly environmentService: IBrowserWorkbenchEnvironmentService,
		@IBuiltinExtensionsScannerService private readonly builtinExtensionsScannerService: IBuiltinExtensionsScannerService,
		@IFileService private readonly fileService: IFileService,
		@ILogService private readonly logService: ILogService,
		@IExtensionGalleryService private readonly galleryService: IExtensionGalleryService,
		@IExtensionManifestPropertiesService private readonly extensionManifestPropertiesService: IExtensionManifestPropertiesService,
		@IExtensionResourceLoaderService private readonly extensionResourceLoaderService: IExtensionResourceLoaderService,
		@IExtensionStorageService private readonly extensionStorageService: IExtensionStorageService,
		@IStorageService private readonly storageService: IStorageService,
		@IProductService private readonly productService: IProductService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILifecycleService lifecycleService: ILifecycleService,
	) {
		super();
		if (isWeb) {
			this.systemExtensionsCacheResource = joinPath(environmentService.userRoamingDataHome, 'systemExtensionsCache.json');
			this.customBuiltinExtensionsCacheResource = joinPath(environmentService.userRoamingDataHome, 'customBuiltinExtensionsCache.json');

			// Eventually update caches
			lifecycleService.when(LifecyclePhase.Eventually).then(() => this.updateCaches());
		}
		this.extensionsEnabledWithApiProposalVersion = productService.extensionsEnabledWithApiProposalVersion?.map(id => id.toLowerCase()) ?? [];
	}

	private _customBuiltinExtensionsInfoPromise: Promise<{ extensions: ExtensionInfo[]; extensionsToMigrate: [string, string][]; extensionLocations: URI[]; extensionGalleryResources: URI[] }> | undefined;
	private readCustomBuiltinExtensionsInfoFromEnv(): Promise<{ extensions: ExtensionInfo[]; extensionsToMigrate: [string, string][]; extensionLocations: URI[]; extensionGalleryResources: URI[] }> {
		if (!this._customBuiltinExtensionsInfoPromise) {
			this._customBuiltinExtensionsInfoPromise = (async () => {
				let extensions: ExtensionInfo[] = [];
				const extensionLocations: URI[] = [];
				const extensionGalleryResources: URI[] = [];
				const extensionsToMigrate: [string, string][] = [];
				const customBuiltinExtensionsInfo = this.environmentService.options && Array.isArray(this.environmentService.options.additionalBuiltinExtensions)
					? this.environmentService.options.additionalBuiltinExtensions.map(additionalBuiltinExtension => isString(additionalBuiltinExtension) ? { id: additionalBuiltinExtension } : additionalBuiltinExtension)
					: [];
				for (const e of customBuiltinExtensionsInfo) {
					if (isGalleryExtensionInfo(e)) {
						extensions.push({ id: e.id, preRelease: !!e.preRelease });
						if (e.migrateStorageFrom) {
							extensionsToMigrate.push([e.migrateStorageFrom, e.id]);
						}
					} else if (isUriComponents(e)) {
						const extensionLocation = URI.revive(e);
						if (await this.extensionResourceLoaderService.isExtensionGalleryResource(extensionLocation)) {
							extensionGalleryResources.push(extensionLocation);
						} else {
							extensionLocations.push(extensionLocation);
						}
					}
				}
				if (extensions.length) {
					extensions = await this.checkAdditionalBuiltinExtensions(extensions);
				}
				if (extensions.length) {
					this.logService.info('Found additional builtin gallery extensions in env', extensions);
				}
				if (extensionLocations.length) {
					this.logService.info('Found additional builtin location extensions in env', extensionLocations.map(e => e.toString()));
				}
				if (extensionGalleryResources.length) {
					this.logService.info('Found additional builtin extension gallery resources in env', extensionGalleryResources.map(e => e.toString()));
				}
				return { extensions, extensionsToMigrate, extensionLocations, extensionGalleryResources };
			})();
		}
		return this._customBuiltinExtensionsInfoPromise;
	}

	private async checkAdditionalBuiltinExtensions(extensions: ExtensionInfo[]): Promise<ExtensionInfo[]> {
		const extensionsControlManifest = await this.galleryService.getExtensionsControlManifest();
		const result: ExtensionInfo[] = [];
		for (const extension of extensions) {
			if (isMalicious({ id: extension.id }, extensionsControlManifest.malicious)) {
				this.logService.info(`Checking additional builtin extensions: Ignoring '${extension.id}' because it is reported to be malicious.`);
				continue;
			}
			const deprecationInfo = extensionsControlManifest.deprecated[extension.id.toLowerCase()];
			if (deprecationInfo?.extension?.autoMigrate) {
				const preReleaseExtensionId = deprecationInfo.extension.id;
				this.logService.info(`Checking additional builtin extensions: '${extension.id}' is deprecated, instead using '${preReleaseExtensionId}'`);
				result.push({ id: preReleaseExtensionId, preRelease: !!extension.preRelease });
			} else {
				result.push(extension);
			}
		}
		return result;
	}

	/**
	 * All system extensions bundled with the product
	 */
	private async readSystemExtensions(): Promise<IExtension[]> {
		const systemExtensions = await this.builtinExtensionsScannerService.scanBuiltinExtensions();
		const cachedSystemExtensions = await Promise.all((await this.readSystemExtensionsCache()).map(e => this.toScannedExtension(e, true, ExtensionType.System)));

		const result = new Map<string, IExtension>();
		for (const extension of [...systemExtensions, ...cachedSystemExtensions]) {
			const existing = result.get(extension.identifier.id.toLowerCase());
			if (existing) {
				// Incase there are duplicates always take the latest version
				if (semver.gt(existing.manifest.version, extension.manifest.version)) {
					continue;
				}
			}
			result.set(extension.identifier.id.toLowerCase(), extension);
		}
		return [...result.values()];
	}

	/**
	 * All extensions defined via `additionalBuiltinExtensions` API
	 */
	private async readCustomBuiltinExtensions(scanOptions?: ScanOptions): Promise<IScannedExtension[]> {
		const [customBuiltinExtensionsFromLocations, customBuiltinExtensionsFromGallery] = await Promise.all([
			this.getCustomBuiltinExtensionsFromLocations(scanOptions),
			this.getCustomBuiltinExtensionsFromGallery(scanOptions),
		]);
		const customBuiltinExtensions: IScannedExtension[] = [...customBuiltinExtensionsFromLocations, ...customBuiltinExtensionsFromGallery];
		await this.migrateExtensionsStorage(customBuiltinExtensions);
		return customBuiltinExtensions;
	}

	private async getCustomBuiltinExtensionsFromLocations(scanOptions?: ScanOptions): Promise<IScannedExtension[]> {
		const { extensionLocations } = await this.readCustomBuiltinExtensionsInfoFromEnv();
		if (!extensionLocations.length) {
			return [];
		}
		const result: IScannedExtension[] = [];
		await Promise.allSettled(extensionLocations.map(async extensionLocation => {
			try {
				const webExtension = await this.toWebExtension(extensionLocation);
				const extension = await this.toScannedExtension(webExtension, true);
				if (extension.isValid || !scanOptions?.skipInvalidExtensions) {
					result.push(extension);
				} else {
					this.logService.info(`Skipping invalid additional builtin extension ${webExtension.identifier.id}`);
				}
			} catch (error) {
				this.logService.info(`Error while fetching the additional builtin extension ${extensionLocation.toString()}.`, getErrorMessage(error));
			}
		}));
		return result;
	}

	private async getCustomBuiltinExtensionsFromGallery(scanOptions?: ScanOptions): Promise<IScannedExtension[]> {
		if (!this.galleryService.isEnabled()) {
			this.logService.info('Ignoring fetching additional builtin extensions from gallery as it is disabled.');
			return [];
		}
		const result: IScannedExtension[] = [];
		const { extensions, extensionGalleryResources } = await this.readCustomBuiltinExtensionsInfoFromEnv();
		try {
			const cacheValue = JSON.stringify({
				extensions: extensions.sort((a, b) => a.id.localeCompare(b.id)),
				extensionGalleryResources: extensionGalleryResources.map(e => e.toString()).sort()
			});
			const useCache = this.storageService.get('additionalBuiltinExtensions', StorageScope.APPLICATION, '{}') === cacheValue;
			const webExtensions = await (useCache ? this.getCustomBuiltinExtensionsFromCache() : this.updateCustomBuiltinExtensionsCache());
			if (webExtensions.length) {
				await Promise.all(webExtensions.map(async webExtension => {
					try {
						const extension = await this.toScannedExtension(webExtension, true);
						if (extension.isValid || !scanOptions?.skipInvalidExtensions) {
							result.push(extension);
						} else {
							this.logService.info(`Skipping invalid additional builtin gallery extension ${webExtension.identifier.id}`);
						}
					} catch (error) {
						this.logService.info(`Ignoring additional builtin extension ${webExtension.identifier.id} because there is an error while converting it into scanned extension`, getErrorMessage(error));
					}
				}));
			}
			this.storageService.store('additionalBuiltinExtensions', cacheValue, StorageScope.APPLICATION, StorageTarget.MACHINE);
		} catch (error) {
			this.logService.info('Ignoring following additional builtin extensions as there is an error while fetching them from gallery', extensions.map(({ id }) => id), getErrorMessage(error));
		}
		return result;
	}

	private async getCustomBuiltinExtensionsFromCache(): Promise<IWebExtension[]> {
		const cachedCustomBuiltinExtensions = await this.readCustomBuiltinExtensionsCache();
		const webExtensionsMap = new Map<string, IWebExtension>();
		for (const webExtension of cachedCustomBuiltinExtensions) {
			const existing = webExtensionsMap.get(webExtension.identifier.id.toLowerCase());
			if (existing) {
				// Incase there are duplicates always take the latest version
				if (semver.gt(existing.version, webExtension.version)) {
					continue;
				}
			}
			/* Update preRelease flag in the cache - https://github.com/microsoft/vscode/issues/142831 */
			if (webExtension.metadata?.isPreReleaseVersion && !webExtension.metadata?.preRelease) {
				webExtension.metadata.preRelease = true;
			}
			webExtensionsMap.set(webExtension.identifier.id.toLowerCase(), webExtension);
		}
		return [...webExtensionsMap.values()];
	}

	private _migrateExtensionsStoragePromise: Promise<void> | undefined;
	private async migrateExtensionsStorage(customBuiltinExtensions: IExtension[]): Promise<void> {
		if (!this._migrateExtensionsStoragePromise) {
			this._migrateExtensionsStoragePromise = (async () => {
				const { extensionsToMigrate } = await this.readCustomBuiltinExtensionsInfoFromEnv();
				if (!extensionsToMigrate.length) {
					return;
				}
				const fromExtensions = await this.galleryService.getExtensions(extensionsToMigrate.map(([id]) => ({ id })), CancellationToken.None);
				try {
					await Promise.allSettled(extensionsToMigrate.map(async ([from, to]) => {
						const toExtension = customBuiltinExtensions.find(extension => areSameExtensions(extension.identifier, { id: to }));
						if (toExtension) {
							const fromExtension = fromExtensions.find(extension => areSameExtensions(extension.identifier, { id: from }));
							const fromExtensionManifest = fromExtension ? await this.galleryService.getManifest(fromExtension, CancellationToken.None) : null;
							const fromExtensionId = fromExtensionManifest ? getExtensionId(fromExtensionManifest.publisher, fromExtensionManifest.name) : from;
							const toExtensionId = getExtensionId(toExtension.manifest.publisher, toExtension.manifest.name);
							this.extensionStorageService.addToMigrationList(fromExtensionId, toExtensionId);
						} else {
							this.logService.info(`Skipped migrating extension storage from '${from}' to '${to}', because the '${to}' extension is not found.`);
						}
					}));
				} catch (error) {
					this.logService.error(error);
				}
			})();
		}
		return this._migrateExtensionsStoragePromise;
	}

	private async updateCaches(): Promise<void> {
		await this.updateSystemExtensionsCache();
		await this.updateCustomBuiltinExtensionsCache();
	}

	private async updateSystemExtensionsCache(): Promise<void> {
		const systemExtensions = await this.builtinExtensionsScannerService.scanBuiltinExtensions();
		const cachedSystemExtensions = (await this.readSystemExtensionsCache())
			.filter(cached => {
				const systemExtension = systemExtensions.find(e => areSameExtensions(e.identifier, cached.identifier));
				return systemExtension && semver.gt(cached.version, systemExtension.manifest.version);
			});
		await this.writeSystemExtensionsCache(() => cachedSystemExtensions);
	}

	private _updateCustomBuiltinExtensionsCachePromise: Promise<IWebExtension[]> | undefined;
	private async updateCustomBuiltinExtensionsCache(): Promise<IWebExtension[]> {
		if (!this._updateCustomBuiltinExtensionsCachePromise) {
			this._updateCustomBuiltinExtensionsCachePromise = (async () => {
				this.logService.info('Updating additional builtin extensions cache');
				const { extensions, extensionGalleryResources } = await this.readCustomBuiltinExtensionsInfoFromEnv();
				const [galleryWebExtensions, extensionGalleryResourceWebExtensions] = await Promise.all([
					this.resolveBuiltinGalleryExtensions(extensions),
					this.resolveBuiltinExtensionGalleryResources(extensionGalleryResources)
				]);
				const webExtensionsMap = new Map<string, IWebExtension>();
				for (const webExtension of [...galleryWebExtensions, ...extensionGalleryResourceWebExtensions]) {
					webExtensionsMap.set(webExtension.identifier.id.toLowerCase(), webExtension);
				}
				await this.resolveDependenciesAndPackedExtensions(extensionGalleryResourceWebExtensions, webExtensionsMap);
				const webExtensions = [...webExtensionsMap.values()];
				await this.writeCustomBuiltinExtensionsCache(() => webExtensions);
				return webExtensions;
			})();
		}
		return this._updateCustomBuiltinExtensionsCachePromise;
	}

	private async resolveBuiltinExtensionGalleryResources(extensionGalleryResources: URI[]): Promise<IWebExtension[]> {
		if (extensionGalleryResources.length === 0) {
			return [];
		}
		const result = new Map<string, IWebExtension>();
		const extensionInfos: IExtensionInfo[] = [];
		await Promise.all(extensionGalleryResources.map(async extensionGalleryResource => {
			try {
				const webExtension = await this.toWebExtensionFromExtensionGalleryResource(extensionGalleryResource);
				result.set(webExtension.identifier.id.toLowerCase(), webExtension);
				extensionInfos.push({ id: webExtension.identifier.id, version: webExtension.version });
			} catch (error) {
				this.logService.info(`Ignoring additional builtin extension from gallery resource ${extensionGalleryResource.toString()} because there is an error while converting it into web extension`, getErrorMessage(error));
			}
		}));
		const galleryExtensions = await this.galleryService.getExtensions(extensionInfos, CancellationToken.None);
		for (const galleryExtension of galleryExtensions) {
			const webExtension = result.get(galleryExtension.identifier.id.toLowerCase());
			if (webExtension) {
				result.set(galleryExtension.identifier.id.toLowerCase(), {
					...webExtension,
					identifier: { id: webExtension.identifier.id, uuid: galleryExtension.identifier.uuid },
					readmeUri: galleryExtension.assets.readme ? URI.parse(galleryExtension.assets.readme.uri) : undefined,
					changelogUri: galleryExtension.assets.changelog ? URI.parse(galleryExtension.assets.changelog.uri) : undefined,
					metadata: { isPreReleaseVersion: galleryExtension.properties.isPreReleaseVersion, preRelease: galleryExtension.properties.isPreReleaseVersion, isBuiltin: true, pinned: true }
				});
			}
		}
		return [...result.values()];
	}

	private async resolveBuiltinGalleryExtensions(extensions: IExtensionInfo[]): Promise<IWebExtension[]> {
		if (extensions.length === 0) {
			return [];
		}
		const webExtensions: IWebExtension[] = [];
		const galleryExtensionsMap = await this.getExtensionsWithDependenciesAndPackedExtensions(extensions);
		const missingExtensions = extensions.filter(({ id }) => !galleryExtensionsMap.has(id.toLowerCase()));
		if (missingExtensions.length) {
			this.logService.info('Skipping the additional builtin extensions because their compatible versions are not found.', missingExtensions);
		}
		await Promise.all([...galleryExtensionsMap.values()].map(async gallery => {
			try {
				const webExtension = await this.toWebExtensionFromGallery(gallery, { isPreReleaseVersion: gallery.properties.isPreReleaseVersion, preRelease: gallery.properties.isPreReleaseVersion, isBuiltin: true });
				webExtensions.push(webExtension);
			} catch (error) {
				this.logService.info(`Ignoring additional builtin extension ${gallery.identifier.id} because there is an error while converting it into web extension`, getErrorMessage(error));
			}
		}));
		return webExtensions;
	}

	private async resolveDependenciesAndPackedExtensions(webExtensions: IWebExtension[], result: Map<string, IWebExtension>): Promise<void> {
		const extensionInfos: IExtensionInfo[] = [];
		for (const webExtension of webExtensions) {
			for (const e of [...(webExtension.manifest?.extensionDependencies ?? []), ...(webExtension.manifest?.extensionPack ?? [])]) {
				if (!result.has(e.toLowerCase())) {
					extensionInfos.push({ id: e, version: webExtension.version });
				}
			}
		}
		if (extensionInfos.length === 0) {
			return;
		}
		const galleryExtensions = await this.getExtensionsWithDependenciesAndPackedExtensions(extensionInfos, new Set<string>([...result.keys()]));
		await Promise.all([...galleryExtensions.values()].map(async gallery => {
			try {
				const webExtension = await this.toWebExtensionFromGallery(gallery, { isPreReleaseVersion: gallery.properties.isPreReleaseVersion, preRelease: gallery.properties.isPreReleaseVersion, isBuiltin: true });
				result.set(webExtension.identifier.id.toLowerCase(), webExtension);
			} catch (error) {
				this.logService.info(`Ignoring additional builtin extension ${gallery.identifier.id} because there is an error while converting it into web extension`, getErrorMessage(error));
			}
		}));
	}

	private async getExtensionsWithDependenciesAndPackedExtensions(toGet: IExtensionInfo[], seen: Set<string> = new Set<string>(), result: Map<string, IGalleryExtension> = new Map<string, IGalleryExtension>()): Promise<Map<string, IGalleryExtension>> {
		if (toGet.length === 0) {
			return result;
		}
		const extensions = await this.galleryService.getExtensions(toGet, { compatible: true, targetPlatform: TargetPlatform.WEB }, CancellationToken.None);
		const packsAndDependencies = new Map<string, IExtensionInfo>();
		for (const extension of extensions) {
			result.set(extension.identifier.id.toLowerCase(), extension);
			for (const id of [...(isNonEmptyArray(extension.properties.dependencies) ? extension.properties.dependencies : []), ...(isNonEmptyArray(extension.properties.extensionPack) ? extension.properties.extensionPack : [])]) {
				if (!result.has(id.toLowerCase()) && !packsAndDependencies.has(id.toLowerCase()) && !seen.has(id.toLowerCase())) {
					const extensionInfo = toGet.find(e => areSameExtensions(e, extension.identifier));
					packsAndDependencies.set(id.toLowerCase(), { id, preRelease: extensionInfo?.preRelease });
				}
			}
		}
		return this.getExtensionsWithDependenciesAndPackedExtensions([...packsAndDependencies.values()].filter(({ id }) => !result.has(id.toLowerCase())), seen, result);
	}

	async scanSystemExtensions(): Promise<IExtension[]> {
		return this.readSystemExtensions();
	}

	async scanUserExtensions(profileLocation: URI, scanOptions?: ScanOptions): Promise<IScannedExtension[]> {
		const extensions = new Map<string, IScannedExtension>();

		// Custom builtin extensions defined through `additionalBuiltinExtensions` API
		const customBuiltinExtensions = await this.readCustomBuiltinExtensions(scanOptions);
		for (const extension of customBuiltinExtensions) {
			extensions.set(extension.identifier.id.toLowerCase(), extension);
		}

		// User Installed extensions
		const installedExtensions = await this.scanInstalledExtensions(profileLocation, scanOptions);
		for (const extension of installedExtensions) {
			extensions.set(extension.identifier.id.toLowerCase(), extension);
		}

		return [...extensions.values()];
	}

	async scanExtensionsUnderDevelopment(): Promise<IExtension[]> {
		const devExtensions = this.environmentService.options?.developmentOptions?.extensions;
		const result: IExtension[] = [];
		if (Array.isArray(devExtensions)) {
			await Promise.allSettled(devExtensions.map(async devExtension => {
				try {
					const location = URI.revive(devExtension);
					if (URI.isUri(location)) {
						const webExtension = await this.toWebExtension(location);
						result.push(await this.toScannedExtension(webExtension, false));
					} else {
						this.logService.info(`Skipping the extension under development ${devExtension} as it is not URI type.`);
					}
				} catch (error) {
					this.logService.info(`Error while fetching the extension under development ${devExtension.toString()}.`, getErrorMessage(error));
				}
			}));
		}
		return result;
	}

	async scanExistingExtension(extensionLocation: URI, extensionType: ExtensionType, profileLocation: URI): Promise<IScannedExtension | null> {
		if (extensionType === ExtensionType.System) {
			const systemExtensions = await this.scanSystemExtensions();
			return systemExtensions.find(e => e.location.toString() === extensionLocation.toString()) || null;
		}
		const userExtensions = await this.scanUserExtensions(profileLocation);
		return userExtensions.find(e => e.location.toString() === extensionLocation.toString()) || null;
	}

	async scanExtensionManifest(extensionLocation: URI): Promise<IExtensionManifest | null> {
		try {
			return await this.getExtensionManifest(extensionLocation);
		} catch (error) {
			this.logService.warn(`Error while fetching manifest from ${extensionLocation.toString()}`, getErrorMessage(error));
			return null;
		}
	}

	async addExtensionFromGallery(galleryExtension: IGalleryExtension, metadata: Metadata, profileLocation: URI): Promise<IScannedExtension> {
		const webExtension = await this.toWebExtensionFromGallery(galleryExtension, metadata);
		return this.addWebExtension(webExtension, profileLocation);
	}

	async addExtension(location: URI, metadata: Metadata, profileLocation: URI): Promise<IScannedExtension> {
		const webExtension = await this.toWebExtension(location, undefined, undefined, undefined, undefined, undefined, undefined, metadata);
		const extension = await this.toScannedExtension(webExtension, false);
		await this.addToInstalledExtensions([webExtension], profileLocation);
		return extension;
	}

	async removeExtension(extension: IScannedExtension, profileLocation: URI): Promise<void> {
		await this.writeInstalledExtensions(profileLocation, installedExtensions => installedExtensions.filter(installedExtension => !areSameExtensions(installedExtension.identifier, extension.identifier)));
	}

	async updateMetadata(extension: IScannedExtension, metadata: Partial<Metadata>, profileLocation: URI): Promise<IScannedExtension> {
		let updatedExtension: IWebExtension | undefined = undefined;
		await this.writeInstalledExtensions(profileLocation, installedExtensions => {
			const result: IWebExtension[] = [];
			for (const installedExtension of installedExtensions) {
				if (areSameExtensions(extension.identifier, installedExtension.identifier)) {
					installedExtension.metadata = { ...installedExtension.metadata, ...metadata };
					updatedExtension = installedExtension;
					result.push(installedExtension);
				} else {
					result.push(installedExtension);
				}
			}
			return result;
		});
		if (!updatedExtension) {
			throw new Error('Extension not found');
		}
		return this.toScannedExtension(updatedExtension, extension.isBuiltin);
	}

	async copyExtensions(fromProfileLocation: URI, toProfileLocation: URI, filter: (extension: IScannedExtension) => boolean): Promise<void> {
		const extensionsToCopy: IWebExtension[] = [];
		const fromWebExtensions = await this.readInstalledExtensions(fromProfileLocation);
		await Promise.all(fromWebExtensions.map(async webExtension => {
			const scannedExtension = await this.toScannedExtension(webExtension, false);
			if (filter(scannedExtension)) {
				extensionsToCopy.push(webExtension);
			}
		}));
		if (extensionsToCopy.length) {
			await this.addToInstalledExtensions(extensionsToCopy, toProfileLocation);
		}
	}

	private async addWebExtension(webExtension: IWebExtension, profileLocation: URI): Promise<IScannedExtension> {
		const isSystem = !!(await this.scanSystemExtensions()).find(e => areSameExtensions(e.identifier, webExtension.identifier));
		const isBuiltin = !!webExtension.metadata?.isBuiltin;
		const extension = await this.toScannedExtension(webExtension, isBuiltin);

		if (isSystem) {
			await this.writeSystemExtensionsCache(systemExtensions => {
				// Remove the existing extension to avoid duplicates
				systemExtensions = systemExtensions.filter(extension => !areSameExtensions(extension.identifier, webExtension.identifier));
				systemExtensions.push(webExtension);
				return systemExtensions;
			});
			return extension;
		}

		// Update custom builtin extensions to custom builtin extensions cache
		if (isBuiltin) {
			await this.writeCustomBuiltinExtensionsCache(customBuiltinExtensions => {
				// Remove the existing extension to avoid duplicates
				customBuiltinExtensions = customBuiltinExtensions.filter(extension => !areSameExtensions(extension.identifier, webExtension.identifier));
				customBuiltinExtensions.push(webExtension);
				return customBuiltinExtensions;
			});

			const installedExtensions = await this.readInstalledExtensions(profileLocation);
			// Also add to installed extensions if it is installed to update its version
			if (installedExtensions.some(e => areSameExtensions(e.identifier, webExtension.identifier))) {
				await this.addToInstalledExtensions([webExtension], profileLocation);
			}
			return extension;
		}

		// Add to installed extensions
		await this.addToInstalledExtensions([webExtension], profileLocation);
		return extension;
	}

	private async addToInstalledExtensions(webExtensions: IWebExtension[], profileLocation: URI): Promise<void> {
		await this.writeInstalledExtensions(profileLocation, installedExtensions => {
			// Remove the existing extension to avoid duplicates
			installedExtensions = installedExtensions.filter(installedExtension => webExtensions.some(extension => !areSameExtensions(installedExtension.identifier, extension.identifier)));
			installedExtensions.push(...webExtensions);
			return installedExtensions;
		});
	}

	private async scanInstalledExtensions(profileLocation: URI, scanOptions?: ScanOptions): Promise<IScannedExtension[]> {
		let installedExtensions = await this.readInstalledExtensions(profileLocation);

		// If current profile is not a default profile, then add the application extensions to the list
		if (!this.uriIdentityService.extUri.isEqual(profileLocation, this.userDataProfilesService.defaultProfile.extensionsResource)) {
			// Remove application extensions from the non default profile
			installedExtensions = installedExtensions.filter(i => !i.metadata?.isApplicationScoped);
			// Add application extensions from the default profile to the list
			const defaultProfileExtensions = await this.readInstalledExtensions(this.userDataProfilesService.defaultProfile.extensionsResource);
			installedExtensions.push(...defaultProfileExtensions.filter(i => i.metadata?.isApplicationScoped));
		}

		installedExtensions.sort((a, b) => a.identifier.id < b.identifier.id ? -1 : a.identifier.id > b.identifier.id ? 1 : semver.rcompare(a.version, b.version));
		const result = new Map<string, IScannedExtension>();
		for (const webExtension of installedExtensions) {
			const existing = result.get(webExtension.identifier.id.toLowerCase());
			if (existing && semver.gt(existing.manifest.version, webExtension.version)) {
				continue;
			}
			const extension = await this.toScannedExtension(webExtension, false);
			if (extension.isValid || !scanOptions?.skipInvalidExtensions) {
				result.set(extension.identifier.id.toLowerCase(), extension);
			} else {
				this.logService.info(`Skipping invalid installed extension ${webExtension.identifier.id}`);
			}
		}
		return [...result.values()];
	}

	private async toWebExtensionFromGallery(galleryExtension: IGalleryExtension, metadata?: Metadata): Promise<IWebExtension> {
		const extensionLocation = await this.extensionResourceLoaderService.getExtensionGalleryResourceURL({
			publisher: galleryExtension.publisher,
			name: galleryExtension.name,
			version: galleryExtension.version,
			targetPlatform: galleryExtension.properties.targetPlatform === TargetPlatform.WEB ? TargetPlatform.WEB : undefined
		}, 'extension');

		if (!extensionLocation) {
			throw new Error('No extension gallery service configured.');
		}

		return this.toWebExtensionFromExtensionGalleryResource(extensionLocation,
			galleryExtension.identifier,
			galleryExtension.assets.readme ? URI.parse(galleryExtension.assets.readme.uri) : undefined,
			galleryExtension.assets.changelog ? URI.parse(galleryExtension.assets.changelog.uri) : undefined,
			metadata);
	}

	private async toWebExtensionFromExtensionGalleryResource(extensionLocation: URI, identifier?: IExtensionIdentifier, readmeUri?: URI, changelogUri?: URI, metadata?: Metadata): Promise<IWebExtension> {
		const extensionResources = await this.listExtensionResources(extensionLocation);
		const packageNLSResources = this.getPackageNLSResourceMapFromResources(extensionResources);

		// The fallback, in English, will fill in any gaps missing in the localized file.
		const fallbackPackageNLSResource = extensionResources.find(e => basename(e) === 'package.nls.json');
		return this.toWebExtension(
			extensionLocation,
			identifier,
			undefined,
			packageNLSResources,
			fallbackPackageNLSResource ? URI.parse(fallbackPackageNLSResource) : null,
			readmeUri,
			changelogUri,
			metadata);
	}

	private getPackageNLSResourceMapFromResources(extensionResources: string[]): Map<string, URI> {
		const packageNLSResources = new Map<string, URI>();
		extensionResources.forEach(e => {
			// Grab all package.nls.{language}.json files
			const regexResult = /package\.nls\.([\w-]+)\.json/.exec(basename(e));
			if (regexResult?.[1]) {
				packageNLSResources.set(regexResult[1], URI.parse(e));
			}
		});
		return packageNLSResources;
	}

	private async toWebExtension(extensionLocation: URI, identifier?: IExtensionIdentifier, manifest?: IExtensionManifest, packageNLSUris?: Map<string, URI>, fallbackPackageNLSUri?: URI | ITranslations | null, readmeUri?: URI, changelogUri?: URI, metadata?: Metadata): Promise<IWebExtension> {
		if (!manifest) {
			try {
				manifest = await this.getExtensionManifest(extensionLocation);
			} catch (error) {
				throw new Error(`Error while fetching manifest from the location '${extensionLocation.toString()}'. ${getErrorMessage(error)}`);
			}
		}

		if (!this.extensionManifestPropertiesService.canExecuteOnWeb(manifest)) {
			throw new Error(localize('not a web extension', "Cannot add '{0}' because this extension is not a web extension.", manifest.displayName || manifest.name));
		}

		if (fallbackPackageNLSUri === undefined) {
			try {
				fallbackPackageNLSUri = joinPath(extensionLocation, 'package.nls.json');
				await this.extensionResourceLoaderService.readExtensionResource(fallbackPackageNLSUri);
			} catch (error) {
				fallbackPackageNLSUri = undefined;
			}
		}
		const defaultManifestTranslations: ITranslations | null | undefined = fallbackPackageNLSUri ? URI.isUri(fallbackPackageNLSUri) ? await this.getTranslations(fallbackPackageNLSUri) : fallbackPackageNLSUri : null;

		return {
			identifier: { id: getGalleryExtensionId(manifest.publisher, manifest.name), uuid: identifier?.uuid },
			version: manifest.version,
			location: extensionLocation,
			manifest,
			readmeUri,
			changelogUri,
			packageNLSUris,
			fallbackPackageNLSUri: URI.isUri(fallbackPackageNLSUri) ? fallbackPackageNLSUri : undefined,
			defaultManifestTranslations,
			metadata,
		};
	}

	private async toScannedExtension(webExtension: IWebExtension, isBuiltin: boolean, type: ExtensionType = ExtensionType.User): Promise<IScannedExtension> {
		const validations: [Severity, string][] = [];
		let manifest: IRelaxedExtensionManifest | undefined = webExtension.manifest;

		if (!manifest) {
			try {
				manifest = await this.getExtensionManifest(webExtension.location);
			} catch (error) {
				validations.push([Severity.Error, `Error while fetching manifest from the location '${webExtension.location}'. ${getErrorMessage(error)}`]);
			}
		}

		if (!manifest) {
			const [publisher, name] = webExtension.identifier.id.split('.');
			manifest = {
				name,
				publisher,
				version: webExtension.version,
				engines: { vscode: '*' },
			};
		}

		const packageNLSUri = webExtension.packageNLSUris?.get(Language.value().toLowerCase());
		const fallbackPackageNLS = webExtension.defaultManifestTranslations ?? webExtension.fallbackPackageNLSUri;

		if (packageNLSUri) {
			manifest = await this.translateManifest(manifest, packageNLSUri, fallbackPackageNLS);
		} else if (fallbackPackageNLS) {
			manifest = await this.translateManifest(manifest, fallbackPackageNLS);
		}

		const uuid = (<IGalleryMetadata | undefined>webExtension.metadata)?.id;

		const validateApiVersion = this.extensionsEnabledWithApiProposalVersion.includes(webExtension.identifier.id.toLowerCase());
		validations.push(...validateExtensionManifest(this.productService.version, this.productService.date, webExtension.location, manifest, false, validateApiVersion));
		let isValid = true;
		for (const [severity, message] of validations) {
			if (severity === Severity.Error) {
				isValid = false;
				this.logService.error(message);
			}
		}

		if (manifest.enabledApiProposals && validateApiVersion) {
			manifest.enabledApiProposals = parseEnabledApiProposalNames([...manifest.enabledApiProposals]);
		}

		return {
			identifier: { id: webExtension.identifier.id, uuid: webExtension.identifier.uuid || uuid },
			location: webExtension.location,
			manifest,
			type,
			isBuiltin,
			readmeUrl: webExtension.readmeUri,
			changelogUrl: webExtension.changelogUri,
			metadata: webExtension.metadata,
			targetPlatform: TargetPlatform.WEB,
			validations,
			isValid,
			preRelease: !!webExtension.metadata?.preRelease,
		};
	}

	private async listExtensionResources(extensionLocation: URI): Promise<string[]> {
		try {
			const result = await this.extensionResourceLoaderService.readExtensionResource(extensionLocation);
			return JSON.parse(result);
		} catch (error) {
			this.logService.warn('Error while fetching extension resources list', getErrorMessage(error));
		}
		return [];
	}

	private async translateManifest(manifest: IExtensionManifest, nlsURL: ITranslations | URI, fallbackNLS?: ITranslations | URI): Promise<IRelaxedExtensionManifest> {
		try {
			const translations = URI.isUri(nlsURL) ? await this.getTranslations(nlsURL) : nlsURL;
			const fallbackTranslations = URI.isUri(fallbackNLS) ? await this.getTranslations(fallbackNLS) : fallbackNLS;
			if (translations) {
				manifest = localizeManifest(this.logService, manifest, translations, fallbackTranslations);
			}
		} catch (error) { /* ignore */ }
		return manifest;
	}

	private async getExtensionManifest(location: URI): Promise<IExtensionManifest> {
		const url = joinPath(location, 'package.json');
		const content = await this.extensionResourceLoaderService.readExtensionResource(url);
		return JSON.parse(content);
	}

	private async getTranslations(nlsUrl: URI): Promise<ITranslations | undefined> {
		try {
			const content = await this.extensionResourceLoaderService.readExtensionResource(nlsUrl);
			return JSON.parse(content);
		} catch (error) {
			this.logService.error(`Error while fetching translations of an extension`, nlsUrl.toString(), getErrorMessage(error));
		}
		return undefined;
	}

	private async readInstalledExtensions(profileLocation: URI): Promise<IWebExtension[]> {
		return this.withWebExtensions(profileLocation);
	}

	private writeInstalledExtensions(profileLocation: URI, updateFn: (extensions: IWebExtension[]) => IWebExtension[]): Promise<IWebExtension[]> {
		return this.withWebExtensions(profileLocation, updateFn);
	}

	private readCustomBuiltinExtensionsCache(): Promise<IWebExtension[]> {
		return this.withWebExtensions(this.customBuiltinExtensionsCacheResource);
	}

	private writeCustomBuiltinExtensionsCache(updateFn: (extensions: IWebExtension[]) => IWebExtension[]): Promise<IWebExtension[]> {
		return this.withWebExtensions(this.customBuiltinExtensionsCacheResource, updateFn);
	}

	private readSystemExtensionsCache(): Promise<IWebExtension[]> {
		return this.withWebExtensions(this.systemExtensionsCacheResource);
	}

	private writeSystemExtensionsCache(updateFn: (extensions: IWebExtension[]) => IWebExtension[]): Promise<IWebExtension[]> {
		return this.withWebExtensions(this.systemExtensionsCacheResource, updateFn);
	}

	private async withWebExtensions(file: URI | undefined, updateFn?: (extensions: IWebExtension[]) => IWebExtension[]): Promise<IWebExtension[]> {
		if (!file) {
			return [];
		}
		return this.getResourceAccessQueue(file).queue(async () => {
			let webExtensions: IWebExtension[] = [];

			// Read
			try {
				const content = await this.fileService.readFile(file);
				const storedWebExtensions: IStoredWebExtension[] = JSON.parse(content.value.toString());
				for (const e of storedWebExtensions) {
					if (!e.location || !e.identifier || !e.version) {
						this.logService.info('Ignoring invalid extension while scanning', storedWebExtensions);
						continue;
					}
					let packageNLSUris: Map<string, URI> | undefined;
					if (e.packageNLSUris) {
						packageNLSUris = new Map<string, URI>();
						Object.entries(e.packageNLSUris).forEach(([key, value]) => packageNLSUris!.set(key, URI.revive(value)));
					}

					webExtensions.push({
						identifier: e.identifier,
						version: e.version,
						location: URI.revive(e.location),
						manifest: e.manifest,
						readmeUri: URI.revive(e.readmeUri),
						changelogUri: URI.revive(e.changelogUri),
						packageNLSUris,
						fallbackPackageNLSUri: URI.revive(e.fallbackPackageNLSUri),
						defaultManifestTranslations: e.defaultManifestTranslations,
						packageNLSUri: URI.revive(e.packageNLSUri),
						metadata: e.metadata,
					});
				}

				try {
					webExtensions = await this.migrateWebExtensions(webExtensions, file);
				} catch (error) {
					this.logService.error(`Error while migrating scanned extensions in ${file.toString()}`, getErrorMessage(error));
				}

			} catch (error) {
				/* Ignore */
				if ((<FileOperationError>error).fileOperationResult !== FileOperationResult.FILE_NOT_FOUND) {
					this.logService.error(error);
				}
			}

			// Update
			if (updateFn) {
				await this.storeWebExtensions(webExtensions = updateFn(webExtensions), file);
			}

			return webExtensions;
		});
	}

	private async migrateWebExtensions(webExtensions: IWebExtension[], file: URI): Promise<IWebExtension[]> {
		let update = false;
		webExtensions = await Promise.all(webExtensions.map(async webExtension => {
			if (!webExtension.manifest) {
				try {
					webExtension.manifest = await this.getExtensionManifest(webExtension.location);
					update = true;
				} catch (error) {
					this.logService.error(`Error while updating manifest of an extension in ${file.toString()}`, webExtension.identifier.id, getErrorMessage(error));
				}
			}
			if (isUndefined(webExtension.defaultManifestTranslations)) {
				if (webExtension.fallbackPackageNLSUri) {
					try {
						const content = await this.extensionResourceLoaderService.readExtensionResource(webExtension.fallbackPackageNLSUri);
						webExtension.defaultManifestTranslations = JSON.parse(content);
						update = true;
					} catch (error) {
						this.logService.error(`Error while fetching default manifest translations of an extension`, webExtension.identifier.id, getErrorMessage(error));
					}
				} else {
					update = true;
					webExtension.defaultManifestTranslations = null;
				}
			}
			const migratedLocation = migratePlatformSpecificExtensionGalleryResourceURL(webExtension.location, TargetPlatform.WEB);
			if (migratedLocation) {
				update = true;
				webExtension.location = migratedLocation;
			}
			if (isUndefined(webExtension.metadata?.hasPreReleaseVersion) && webExtension.metadata?.preRelease) {
				update = true;
				webExtension.metadata.hasPreReleaseVersion = true;
			}
			return webExtension;
		}));
		if (update) {
			await this.storeWebExtensions(webExtensions, file);
		}
		return webExtensions;
	}

	private async storeWebExtensions(webExtensions: IWebExtension[], file: URI): Promise<void> {
		function toStringDictionary(dictionary: Map<string, URI> | undefined): IStringDictionary<UriComponents> | undefined {
			if (!dictionary) {
				return undefined;
			}
			const result: IStringDictionary<UriComponents> = Object.create(null);
			dictionary.forEach((value, key) => result[key] = value.toJSON());
			return result;
		}
		const storedWebExtensions: IStoredWebExtension[] = webExtensions.map(e => ({
			identifier: e.identifier,
			version: e.version,
			manifest: e.manifest,
			location: e.location.toJSON(),
			readmeUri: e.readmeUri?.toJSON(),
			changelogUri: e.changelogUri?.toJSON(),
			packageNLSUris: toStringDictionary(e.packageNLSUris),
			defaultManifestTranslations: e.defaultManifestTranslations,
			fallbackPackageNLSUri: e.fallbackPackageNLSUri?.toJSON(),
			metadata: e.metadata
		}));
		await this.fileService.writeFile(file, VSBuffer.fromString(JSON.stringify(storedWebExtensions)));
	}

	private getResourceAccessQueue(file: URI): Queue<IWebExtension[]> {
		let resourceQueue = this.resourcesAccessQueueMap.get(file);
		if (!resourceQueue) {
			this.resourcesAccessQueueMap.set(file, resourceQueue = new Queue<IWebExtension[]>());
		}
		return resourceQueue;
	}

}

if (isWeb) {
	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: 'workbench.extensions.action.openInstalledWebExtensionsResource',
				title: localize2('openInstalledWebExtensionsResource', 'Open Installed Web Extensions Resource'),
				category: Categories.Developer,
				f1: true,
				precondition: IsWebContext
			});
		}
		run(serviceAccessor: ServicesAccessor): void {
			const editorService = serviceAccessor.get(IEditorService);
			const userDataProfileService = serviceAccessor.get(IUserDataProfileService);
			editorService.openEditor({ resource: userDataProfileService.currentProfile.extensionsResource });
		}
	});
}

registerSingleton(IWebExtensionsScannerService, WebExtensionsScannerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionFeatures.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionFeatures.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IMarkdownString } from '../../../../base/common/htmlContent.js';
import { Event } from '../../../../base/common/event.js';
import { ExtensionIdentifier, IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import Severity from '../../../../base/common/severity.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { Color } from '../../../../base/common/color.js';
import { ThemeIcon } from '../../../../base/common/themables.js';

export namespace Extensions {
	export const ExtensionFeaturesRegistry = 'workbench.registry.extensionFeatures';
}

export interface IExtensionFeatureRenderer extends IDisposable {
	type: string;
	shouldRender(manifest: IExtensionManifest): boolean;
	render(manifest: IExtensionManifest): IDisposable;
}

export interface IRenderedData<T> extends IDisposable {
	readonly data: T;
	readonly onDidChange?: Event<T>;
}

export interface IExtensionFeatureMarkdownRenderer extends IExtensionFeatureRenderer {
	type: 'markdown';
	render(manifest: IExtensionManifest): IRenderedData<IMarkdownString>;
}

export type IRowData = string | IMarkdownString | ResolvedKeybinding | Color | ReadonlyArray<ResolvedKeybinding | IMarkdownString | Color>;

export interface ITableData {
	headers: string[];
	rows: IRowData[][];
}

export interface IExtensionFeatureTableRenderer extends IExtensionFeatureRenderer {
	type: 'table';
	render(manifest: IExtensionManifest): IRenderedData<ITableData>;
}

export interface IExtensionFeatureMarkdownAndTableRenderer extends IExtensionFeatureRenderer {
	type: 'markdown+table';
	render(manifest: IExtensionManifest): IRenderedData<Array<IMarkdownString | ITableData>>;
}

export interface IExtensionFeatureDescriptor {
	readonly id: string;
	readonly label: string;
	// label of the access data, if different from the feature title.
	// This is useful when the feature is a part of a larger feature and the access data is not about the larger feature.
	// This is shown in the access chart like "There were ${accessCount} ${accessLabel} requests from this extension".
	readonly accessDataLabel?: string;
	readonly description?: string;
	readonly icon?: ThemeIcon;
	readonly access: {
		readonly canToggle?: boolean;
		readonly requireUserConsent?: boolean;
		readonly extensionsList?: IStringDictionary<boolean>;
	};
	readonly renderer?: SyncDescriptor<IExtensionFeatureRenderer>;
}

export interface IExtensionFeaturesRegistry {

	registerExtensionFeature(descriptor: IExtensionFeatureDescriptor): IDisposable;
	getExtensionFeature(id: string): IExtensionFeatureDescriptor | undefined;
	getExtensionFeatures(): ReadonlyArray<IExtensionFeatureDescriptor>;
}

export interface IExtensionFeatureAccessData {
	readonly current?: {
		readonly accessTimes: Date[];
		readonly lastAccessed: Date;
		readonly status?: { readonly severity: Severity; readonly message: string };
	};
	readonly accessTimes: Date[];
}

export const IExtensionFeaturesManagementService = createDecorator<IExtensionFeaturesManagementService>('IExtensionFeaturesManagementService');
export interface IExtensionFeaturesManagementService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeEnablement: Event<{ readonly extension: ExtensionIdentifier; readonly featureId: string; readonly enabled: boolean }>;
	isEnabled(extension: ExtensionIdentifier, featureId: string): boolean;
	setEnablement(extension: ExtensionIdentifier, featureId: string, enabled: boolean): void;
	getEnablementData(featureId: string): { readonly extension: ExtensionIdentifier; readonly enabled: boolean }[];

	getAccess(extension: ExtensionIdentifier, featureId: string, justification?: string): Promise<boolean>;

	readonly onDidChangeAccessData: Event<{ readonly extension: ExtensionIdentifier; readonly featureId: string; readonly accessData: IExtensionFeatureAccessData }>;
	getAllAccessDataForExtension(extension: ExtensionIdentifier): Map<string, IExtensionFeatureAccessData>;
	getAccessData(extension: ExtensionIdentifier, featureId: string): IExtensionFeatureAccessData | undefined;
	setStatus(extension: ExtensionIdentifier, featureId: string, status: { readonly severity: Severity; readonly message: string } | undefined): void;
}

class ExtensionFeaturesRegistry implements IExtensionFeaturesRegistry {

	private readonly extensionFeatures = new Map<string, IExtensionFeatureDescriptor>();

	registerExtensionFeature(descriptor: IExtensionFeatureDescriptor): IDisposable {
		if (this.extensionFeatures.has(descriptor.id)) {
			throw new Error(`Extension feature with id '${descriptor.id}' already exists`);
		}
		this.extensionFeatures.set(descriptor.id, descriptor);
		return {
			dispose: () => this.extensionFeatures.delete(descriptor.id)
		};
	}

	getExtensionFeature(id: string): IExtensionFeatureDescriptor | undefined {
		return this.extensionFeatures.get(id);
	}

	getExtensionFeatures(): ReadonlyArray<IExtensionFeatureDescriptor> {
		return Array.from(this.extensionFeatures.values());
	}
}

Registry.add(Extensions.ExtensionFeaturesRegistry, new ExtensionFeaturesRegistry());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionFeaturesManagemetService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionFeaturesManagemetService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import Severity from '../../../../base/common/severity.js';
import { Extensions, IExtensionFeatureAccessData, IExtensionFeaturesManagementService, IExtensionFeaturesRegistry } from './extensionFeatures.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Mutable, isBoolean } from '../../../../base/common/types.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { localize } from '../../../../nls.js';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { IStorageChangeEvent } from '../../../../base/parts/storage/common/storage.js';
import { distinct } from '../../../../base/common/arrays.js';
import { equals } from '../../../../base/common/objects.js';

interface IExtensionFeatureState {
	disabled?: boolean;
	accessData: Mutable<IExtensionFeatureAccessData>;
}

const FEATURES_STATE_KEY = 'extension.features.state';

class ExtensionFeaturesManagementService extends Disposable implements IExtensionFeaturesManagementService {
	declare readonly _serviceBrand: undefined;

	private readonly _onDidChangeEnablement = this._register(new Emitter<{ extension: ExtensionIdentifier; featureId: string; enabled: boolean }>());
	readonly onDidChangeEnablement = this._onDidChangeEnablement.event;

	private readonly _onDidChangeAccessData = this._register(new Emitter<{ extension: ExtensionIdentifier; featureId: string; accessData: IExtensionFeatureAccessData }>());
	readonly onDidChangeAccessData = this._onDidChangeAccessData.event;

	private readonly registry: IExtensionFeaturesRegistry;
	private extensionFeaturesState = new Map<string, Map<string, IExtensionFeatureState>>();

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IDialogService private readonly dialogService: IDialogService,
		@IExtensionService private readonly extensionService: IExtensionService,
	) {
		super();
		this.registry = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry);
		this.extensionFeaturesState = this.loadState();
		this.garbageCollectOldRequests();
		this._register(storageService.onDidChangeValue(StorageScope.PROFILE, FEATURES_STATE_KEY, this._store)(e => this.onDidStorageChange(e)));
	}

	isEnabled(extension: ExtensionIdentifier, featureId: string): boolean {
		const feature = this.registry.getExtensionFeature(featureId);
		if (!feature) {
			return false;
		}
		const isDisabled = this.getExtensionFeatureState(extension, featureId)?.disabled;
		if (isBoolean(isDisabled)) {
			return !isDisabled;
		}
		const defaultExtensionAccess = feature.access.extensionsList?.[extension._lower];
		if (isBoolean(defaultExtensionAccess)) {
			return defaultExtensionAccess;
		}
		return !feature.access.requireUserConsent;
	}

	setEnablement(extension: ExtensionIdentifier, featureId: string, enabled: boolean): void {
		const feature = this.registry.getExtensionFeature(featureId);
		if (!feature) {
			throw new Error(`No feature with id '${featureId}'`);
		}
		const featureState = this.getAndSetIfNotExistsExtensionFeatureState(extension, featureId);
		if (featureState.disabled !== !enabled) {
			featureState.disabled = !enabled;
			this._onDidChangeEnablement.fire({ extension, featureId, enabled });
			this.saveState();
		}
	}

	getEnablementData(featureId: string): { readonly extension: ExtensionIdentifier; readonly enabled: boolean }[] {
		const result: { readonly extension: ExtensionIdentifier; readonly enabled: boolean }[] = [];
		const feature = this.registry.getExtensionFeature(featureId);
		if (feature) {
			for (const [extension, featuresStateMap] of this.extensionFeaturesState) {
				const featureState = featuresStateMap.get(featureId);
				if (featureState?.disabled !== undefined) {
					result.push({ extension: new ExtensionIdentifier(extension), enabled: !featureState.disabled });
				}
			}
		}
		return result;
	}

	async getAccess(extension: ExtensionIdentifier, featureId: string, justification?: string): Promise<boolean> {
		const feature = this.registry.getExtensionFeature(featureId);
		if (!feature) {
			return false;
		}
		const featureState = this.getAndSetIfNotExistsExtensionFeatureState(extension, featureId);
		if (featureState.disabled) {
			return false;
		}

		if (featureState.disabled === undefined) {
			let enabled = true;
			if (feature.access.requireUserConsent) {
				const extensionDescription = this.extensionService.extensions.find(e => ExtensionIdentifier.equals(e.identifier, extension));
				const confirmationResult = await this.dialogService.confirm({
					title: localize('accessExtensionFeature', "Access '{0}' Feature", feature.label),
					message: localize('accessExtensionFeatureMessage', "'{0}' extension would like to access the '{1}' feature.", extensionDescription?.displayName ?? extension._lower, feature.label),
					detail: justification ?? feature.description,
					custom: true,
					primaryButton: localize('allow', "Allow"),
					cancelButton: localize('disallow', "Don't Allow"),
				});
				enabled = confirmationResult.confirmed;
			}
			this.setEnablement(extension, featureId, enabled);
			if (!enabled) {
				return false;
			}
		}

		const accessTime = new Date();
		featureState.accessData.current = {
			accessTimes: [accessTime].concat(featureState.accessData.current?.accessTimes ?? []),
			lastAccessed: accessTime,
			status: featureState.accessData.current?.status
		};
		featureState.accessData.accessTimes = (featureState.accessData.accessTimes ?? []).concat(accessTime);
		this.saveState();
		this._onDidChangeAccessData.fire({ extension, featureId, accessData: featureState.accessData });
		return true;
	}

	getAllAccessDataForExtension(extension: ExtensionIdentifier): Map<string, IExtensionFeatureAccessData> {
		const result = new Map<string, IExtensionFeatureAccessData>();
		const extensionState = this.extensionFeaturesState.get(extension._lower);
		if (extensionState) {
			for (const [featureId, featureState] of extensionState) {
				result.set(featureId, featureState.accessData);
			}
		}
		return result;
	}

	getAccessData(extension: ExtensionIdentifier, featureId: string): IExtensionFeatureAccessData | undefined {
		const feature = this.registry.getExtensionFeature(featureId);
		if (!feature) {
			return;
		}
		return this.getExtensionFeatureState(extension, featureId)?.accessData;
	}

	setStatus(extension: ExtensionIdentifier, featureId: string, status: { readonly severity: Severity; readonly message: string } | undefined): void {
		const feature = this.registry.getExtensionFeature(featureId);
		if (!feature) {
			throw new Error(`No feature with id '${featureId}'`);
		}
		const featureState = this.getAndSetIfNotExistsExtensionFeatureState(extension, featureId);
		featureState.accessData.current = {
			accessTimes: featureState.accessData.current?.accessTimes ?? [],
			lastAccessed: featureState.accessData.current?.lastAccessed ?? new Date(),
			status
		};
		this._onDidChangeAccessData.fire({ extension, featureId, accessData: this.getAccessData(extension, featureId)! });
	}

	private getExtensionFeatureState(extension: ExtensionIdentifier, featureId: string): IExtensionFeatureState | undefined {
		return this.extensionFeaturesState.get(extension._lower)?.get(featureId);
	}

	private getAndSetIfNotExistsExtensionFeatureState(extension: ExtensionIdentifier, featureId: string): Mutable<IExtensionFeatureState> {
		let extensionState = this.extensionFeaturesState.get(extension._lower);
		if (!extensionState) {
			extensionState = new Map<string, IExtensionFeatureState>();
			this.extensionFeaturesState.set(extension._lower, extensionState);
		}
		let featureState = extensionState.get(featureId);
		if (!featureState) {
			featureState = { accessData: { accessTimes: [] } };
			extensionState.set(featureId, featureState);
		}
		return featureState;
	}

	private onDidStorageChange(e: IStorageChangeEvent): void {
		if (e.external) {
			const oldState = this.extensionFeaturesState;
			this.extensionFeaturesState = this.loadState();
			for (const extensionId of distinct([...oldState.keys(), ...this.extensionFeaturesState.keys()])) {
				const extension = new ExtensionIdentifier(extensionId);
				const oldExtensionFeaturesState = oldState.get(extensionId);
				const newExtensionFeaturesState = this.extensionFeaturesState.get(extensionId);
				for (const featureId of distinct([...oldExtensionFeaturesState?.keys() ?? [], ...newExtensionFeaturesState?.keys() ?? []])) {
					const isEnabled = this.isEnabled(extension, featureId);
					const wasEnabled = !oldExtensionFeaturesState?.get(featureId)?.disabled;
					if (isEnabled !== wasEnabled) {
						this._onDidChangeEnablement.fire({ extension, featureId, enabled: isEnabled });
					}
					const newAccessData = this.getAccessData(extension, featureId);
					const oldAccessData = oldExtensionFeaturesState?.get(featureId)?.accessData;
					if (!equals(newAccessData, oldAccessData)) {
						this._onDidChangeAccessData.fire({ extension, featureId, accessData: newAccessData ?? { accessTimes: [] } });
					}
				}
			}
		}
	}

	private loadState(): Map<string, Map<string, IExtensionFeatureState>> {
		let data: IStringDictionary<IStringDictionary<{ disabled?: boolean; accessTimes?: number[] }>> = {};
		const raw = this.storageService.get(FEATURES_STATE_KEY, StorageScope.PROFILE, '{}');
		try {
			data = JSON.parse(raw);
		} catch (e) {
			// ignore
		}
		const result = new Map<string, Map<string, IExtensionFeatureState>>();
		for (const extensionId in data) {
			const extensionFeatureState = new Map<string, IExtensionFeatureState>();
			const extensionFeatures = data[extensionId];
			for (const featureId in extensionFeatures) {
				const extensionFeature = extensionFeatures[featureId];
				extensionFeatureState.set(featureId, {
					disabled: extensionFeature.disabled,
					accessData: {
						accessTimes: (extensionFeature.accessTimes ?? []).map(time => new Date(time)),
					}
				});
			}
			result.set(extensionId.toLowerCase(), extensionFeatureState);
		}
		return result;
	}

	private saveState(): void {
		const data: IStringDictionary<IStringDictionary<{ disabled?: boolean; accessTimes: number[] }>> = {};
		this.extensionFeaturesState.forEach((extensionState, extensionId) => {
			const extensionFeatures: IStringDictionary<{ disabled?: boolean; accessTimes: number[] }> = {};
			extensionState.forEach((featureState, featureId) => {
				extensionFeatures[featureId] = {
					disabled: featureState.disabled,
					accessTimes: featureState.accessData.accessTimes.map(time => time.getTime()),
				};
			});
			data[extensionId] = extensionFeatures;
		});
		this.storageService.store(FEATURES_STATE_KEY, JSON.stringify(data), StorageScope.PROFILE, StorageTarget.USER);
	}

	private garbageCollectOldRequests(): void {
		const now = new Date();
		const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
		let modified = false;

		for (const [, featuresStateMap] of this.extensionFeaturesState) {
			for (const [, featureState] of featuresStateMap) {
				const originalLength = featureState.accessData.accessTimes.length;
				featureState.accessData.accessTimes = featureState.accessData.accessTimes.filter(accessTime => accessTime > thirtyDaysAgo);
				if (featureState.accessData.accessTimes.length !== originalLength) {
					modified = true;
				}
			}
		}

		if (modified) {
			this.saveState();
		}
	}
}

registerSingleton(IExtensionFeaturesManagementService, ExtensionFeaturesManagementService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionGalleryService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionGalleryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAllowedExtensionsService, IExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IRequestService } from '../../../../platform/request/common/request.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { AbstractExtensionGalleryService } from '../../../../platform/extensionManagement/common/extensionGalleryService.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IExtensionGalleryManifestService } from '../../../../platform/extensionManagement/common/extensionGalleryManifest.js';

export class WorkbenchExtensionGalleryService extends AbstractExtensionGalleryService {
	constructor(
		@IStorageService storageService: IStorageService,
		@IRequestService requestService: IRequestService,
		@ILogService logService: ILogService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IFileService fileService: IFileService,
		@IProductService productService: IProductService,
		@IConfigurationService configurationService: IConfigurationService,
		@IAllowedExtensionsService allowedExtensionsService: IAllowedExtensionsService,
		@IExtensionGalleryManifestService extensionGalleryManifestService: IExtensionGalleryManifestService,
	) {
		super(storageService, requestService, logService, environmentService, telemetryService, fileService, productService, configurationService, allowedExtensionsService, extensionGalleryManifestService);
	}
}

registerSingleton(IExtensionGalleryService, WorkbenchExtensionGalleryService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionManagement.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionManagement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { createDecorator, refineServiceDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtension, ExtensionType, IExtensionManifest, IExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IExtensionManagementService, IGalleryExtension, ILocalExtension, InstallOptions, InstallExtensionEvent, DidUninstallExtensionEvent, InstallExtensionResult, Metadata, UninstallExtensionEvent, DidUpdateExtensionMetadata, InstallExtensionInfo } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { IMarkdownString } from '../../../../base/common/htmlContent.js';

export type DidChangeProfileEvent = { readonly added: ILocalExtension[]; readonly removed: ILocalExtension[] };

export const IProfileAwareExtensionManagementService = refineServiceDecorator<IExtensionManagementService, IProfileAwareExtensionManagementService>(IExtensionManagementService);
export interface IProfileAwareExtensionManagementService extends IExtensionManagementService {
	readonly onProfileAwareDidInstallExtensions: Event<readonly InstallExtensionResult[]>;
	readonly onProfileAwareDidUninstallExtension: Event<DidUninstallExtensionEvent>;
	readonly onProfileAwareDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;
	readonly onDidChangeProfile: Event<DidChangeProfileEvent>;
}

export interface IExtensionManagementServer {
	readonly id: string;
	readonly label: string;
	readonly extensionManagementService: IProfileAwareExtensionManagementService;
}

export const enum ExtensionInstallLocation {
	Local = 1,
	Remote,
	Web
}

export const IExtensionManagementServerService = createDecorator<IExtensionManagementServerService>('extensionManagementServerService');
export interface IExtensionManagementServerService {
	readonly _serviceBrand: undefined;
	readonly localExtensionManagementServer: IExtensionManagementServer | null;
	readonly remoteExtensionManagementServer: IExtensionManagementServer | null;
	readonly webExtensionManagementServer: IExtensionManagementServer | null;
	getExtensionManagementServer(extension: IExtension): IExtensionManagementServer | null;
	getExtensionInstallLocation(extension: IExtension): ExtensionInstallLocation | null;
}

export interface IResourceExtension {
	readonly type: 'resource';
	readonly identifier: IExtensionIdentifier;
	readonly location: URI;
	readonly manifest: IExtensionManifest;
	readonly readmeUri?: URI;
	readonly changelogUri?: URI;
}

export type InstallExtensionOnServerEvent = InstallExtensionEvent & { server: IExtensionManagementServer };
export type UninstallExtensionOnServerEvent = UninstallExtensionEvent & { server: IExtensionManagementServer };
export type DidUninstallExtensionOnServerEvent = DidUninstallExtensionEvent & { server: IExtensionManagementServer };
export type DidChangeProfileForServerEvent = DidChangeProfileEvent & { server: IExtensionManagementServer };

export interface IPublisherInfo {
	readonly publisher: string;
	readonly publisherDisplayName: string;
}

export const IWorkbenchExtensionManagementService = refineServiceDecorator<IProfileAwareExtensionManagementService, IWorkbenchExtensionManagementService>(IProfileAwareExtensionManagementService);
export interface IWorkbenchExtensionManagementService extends IProfileAwareExtensionManagementService {
	readonly _serviceBrand: undefined;

	readonly onInstallExtension: Event<InstallExtensionOnServerEvent>;
	readonly onDidInstallExtensions: Event<readonly InstallExtensionResult[]>;
	readonly onUninstallExtension: Event<UninstallExtensionOnServerEvent>;
	readonly onDidUninstallExtension: Event<DidUninstallExtensionOnServerEvent>;
	readonly onDidChangeProfile: Event<DidChangeProfileForServerEvent>;
	readonly onDidEnableExtensions: Event<IExtension[]>;

	readonly onProfileAwareDidInstallExtensions: Event<readonly InstallExtensionResult[]>;
	readonly onProfileAwareDidUninstallExtension: Event<DidUninstallExtensionOnServerEvent>;
	readonly onProfileAwareDidUpdateExtensionMetadata: Event<DidUpdateExtensionMetadata>;

	getExtensions(locations: URI[]): Promise<IResourceExtension[]>;
	getInstalledWorkspaceExtensionLocations(): URI[];
	getInstalledWorkspaceExtensions(includeInvalid: boolean): Promise<ILocalExtension[]>;

	canInstall(extension: IGalleryExtension | IResourceExtension): Promise<true | IMarkdownString>;

	getInstallableServers(extension: IGalleryExtension): Promise<IExtensionManagementServer[]>;
	installVSIX(location: URI, manifest: IExtensionManifest, installOptions?: InstallOptions): Promise<ILocalExtension>;
	installFromGallery(gallery: IGalleryExtension, installOptions?: InstallOptions, servers?: IExtensionManagementServer[]): Promise<ILocalExtension>;
	installFromLocation(location: URI): Promise<ILocalExtension>;
	installResourceExtension(extension: IResourceExtension, installOptions: InstallOptions): Promise<ILocalExtension>;

	updateFromGallery(gallery: IGalleryExtension, extension: ILocalExtension, installOptions?: InstallOptions): Promise<ILocalExtension>;
	updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>): Promise<ILocalExtension>;

	requestPublisherTrust(extensions: InstallExtensionInfo[]): Promise<void>;
	isPublisherTrusted(extension: IGalleryExtension): boolean;
	getTrustedPublishers(): IPublisherInfo[];
	trustPublishers(...publishers: IPublisherInfo[]): void;
	untrustPublishers(...publishers: string[]): void;
}

export const enum EnablementState {
	DisabledByTrustRequirement,
	DisabledByExtensionKind,
	DisabledByEnvironment,
	EnabledByEnvironment,
	DisabledByMalicious,
	DisabledByVirtualWorkspace,
	DisabledByInvalidExtension,
	DisabledByAllowlist,
	DisabledByExtensionDependency,
	DisabledByUnification, // Temporary TODO@benibenj remove when unification transition is complete
	DisabledGlobally,
	DisabledWorkspace,
	EnabledGlobally,
	EnabledWorkspace
}

export const IWorkbenchExtensionEnablementService = createDecorator<IWorkbenchExtensionEnablementService>('extensionEnablementService');

export interface IWorkbenchExtensionEnablementService {
	readonly _serviceBrand: undefined;

	/**
	 * Event to listen on for extension enablement changes
	 */
	readonly onEnablementChanged: Event<readonly IExtension[]>;

	/**
	 * Returns the enablement state for the given extension
	 */
	getEnablementState(extension: IExtension): EnablementState;

	/**
	 * Returns the enablement states for the given extensions
	 * @param extensions list of extensions
	 * @param workspaceTypeOverrides Workspace type overrides
	 */
	getEnablementStates(extensions: IExtension[], workspaceTypeOverrides?: { trusted?: boolean }): EnablementState[];

	/**
	 * Returns the enablement states for the dependencies of the given extension
	 */
	getDependenciesEnablementStates(extension: IExtension): [IExtension, EnablementState][];

	/**
	 * Returns `true` if the enablement can be changed.
	 */
	canChangeEnablement(extension: IExtension): boolean;

	/**
	 * Returns `true` if the enablement can be changed.
	 */
	canChangeWorkspaceEnablement(extension: IExtension): boolean;

	/**
	 * Returns `true` if the given extension is enabled.
	 */
	isEnabled(extension: IExtension): boolean;

	/**
	 * Returns `true` if the given enablement state is enabled enablement state.
	 */
	isEnabledEnablementState(enablementState: EnablementState): boolean;

	/**
	 * Returns `true` if the given extension identifier is disabled globally.
	 * Extensions can be disabled globally or in workspace or both.
	 * If an extension is disabled in both then enablement state shows only workspace.
	 * This will
	 */
	isDisabledGlobally(extension: IExtension): boolean;

	/**
	 * Enable or disable the given extension.
	 * if `workspace` is `true` then enablement is done for workspace, otherwise globally.
	 *
	 * Returns a promise that resolves to boolean value.
	 * if resolves to `true` then requires restart for the change to take effect.
	 *
	 * Throws error if enablement is requested for workspace and there is no workspace
	 */
	setEnablement(extensions: IExtension[], state: EnablementState): Promise<boolean[]>;

	/**
	 * Updates the enablement state of the extensions when workspace trust changes.
	 */
	updateExtensionsEnablementsWhenWorkspaceTrustChanges(): Promise<void>;
}

export interface IScannedExtension extends IExtension {
	readonly metadata?: Metadata;
}

export type ScanOptions = { readonly skipInvalidExtensions?: boolean };

export const IWebExtensionsScannerService = createDecorator<IWebExtensionsScannerService>('IWebExtensionsScannerService');
export interface IWebExtensionsScannerService {
	readonly _serviceBrand: undefined;

	scanSystemExtensions(): Promise<IExtension[]>;
	scanUserExtensions(profileLocation: URI, options?: ScanOptions): Promise<IScannedExtension[]>;
	scanExtensionsUnderDevelopment(): Promise<IExtension[]>;
	scanExistingExtension(extensionLocation: URI, extensionType: ExtensionType, profileLocation: URI): Promise<IScannedExtension | null>;

	addExtension(location: URI, metadata: Metadata, profileLocation: URI): Promise<IScannedExtension>;
	addExtensionFromGallery(galleryExtension: IGalleryExtension, metadata: Metadata, profileLocation: URI): Promise<IScannedExtension>;
	removeExtension(extension: IScannedExtension, profileLocation: URI): Promise<void>;
	copyExtensions(fromProfileLocation: URI, toProfileLocation: URI, filter: (extension: IScannedExtension) => boolean): Promise<void>;

	updateMetadata(extension: IScannedExtension, metaData: Partial<Metadata>, profileLocation: URI): Promise<IScannedExtension>;

	scanExtensionManifest(extensionLocation: URI): Promise<IExtensionManifest | null>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionManagementChannelClient.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionManagementChannelClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ILocalExtension, IGalleryExtension, InstallOptions, UninstallOptions, Metadata, InstallExtensionResult, InstallExtensionInfo, IProductVersion, UninstallExtensionInfo, DidUninstallExtensionEvent, DidUpdateExtensionMetadata, InstallExtensionEvent, UninstallExtensionEvent, IAllowedExtensionsService } from '../../../../platform/extensionManagement/common/extensionManagement.js';
import { URI } from '../../../../base/common/uri.js';
import { ExtensionIdentifier, ExtensionType, IExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ExtensionManagementChannelClient as BaseExtensionManagementChannelClient } from '../../../../platform/extensionManagement/common/extensionManagementIpc.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { DidChangeUserDataProfileEvent, IUserDataProfileService } from '../../userDataProfile/common/userDataProfile.js';
import { Emitter } from '../../../../base/common/event.js';
import { delta } from '../../../../base/common/arrays.js';
import { compare } from '../../../../base/common/strings.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { DidChangeProfileEvent, IProfileAwareExtensionManagementService } from './extensionManagement.js';
import { IProductService } from '../../../../platform/product/common/productService.js';

export abstract class ProfileAwareExtensionManagementChannelClient extends BaseExtensionManagementChannelClient implements IProfileAwareExtensionManagementService {

	private readonly _onDidChangeProfile = this._register(new Emitter<{ readonly added: ILocalExtension[]; readonly removed: ILocalExtension[] }>());
	readonly onDidChangeProfile = this._onDidChangeProfile.event;

	private readonly _onDidProfileAwareInstallExtensions = this._register(new Emitter<readonly InstallExtensionResult[]>());
	get onProfileAwareDidInstallExtensions() { return this._onDidProfileAwareInstallExtensions.event; }

	private readonly _onDidProfileAwareUninstallExtension = this._register(new Emitter<DidUninstallExtensionEvent>());
	get onProfileAwareDidUninstallExtension() { return this._onDidProfileAwareUninstallExtension.event; }

	private readonly _onDidProfileAwareUpdateExtensionMetadata = this._register(new Emitter<DidUpdateExtensionMetadata>());
	get onProfileAwareDidUpdateExtensionMetadata() { return this._onDidProfileAwareUpdateExtensionMetadata.event; }

	constructor(channel: IChannel,
		productService: IProductService,
		allowedExtensionsService: IAllowedExtensionsService,
		protected readonly userDataProfileService: IUserDataProfileService,
		protected readonly uriIdentityService: IUriIdentityService,
	) {
		super(channel, productService, allowedExtensionsService);
		this._register(userDataProfileService.onDidChangeCurrentProfile(e => {
			if (!this.uriIdentityService.extUri.isEqual(e.previous.extensionsResource, e.profile.extensionsResource)) {
				e.join(this.whenProfileChanged(e));
			}
		}));
	}

	protected override async onInstallExtensionEvent(data: InstallExtensionEvent): Promise<void> {
		const result = this.filterEvent(data.profileLocation, data.applicationScoped ?? false);
		if (result instanceof Promise ? await result : result) {
			this._onInstallExtension.fire(data);
		}
	}

	protected override async onDidInstallExtensionsEvent(results: readonly InstallExtensionResult[]): Promise<void> {
		const filtered = [];
		for (const e of results) {
			const result = this.filterEvent(e.profileLocation, e.applicationScoped ?? e.local?.isApplicationScoped ?? false);
			if (result instanceof Promise ? await result : result) {
				filtered.push(e);
			}
		}
		if (filtered.length) {
			this._onDidInstallExtensions.fire(filtered);
		}
		this._onDidProfileAwareInstallExtensions.fire(results);
	}

	protected override async onUninstallExtensionEvent(data: UninstallExtensionEvent): Promise<void> {
		const result = this.filterEvent(data.profileLocation, data.applicationScoped ?? false);
		if (result instanceof Promise ? await result : result) {
			this._onUninstallExtension.fire(data);
		}
	}

	protected override async onDidUninstallExtensionEvent(data: DidUninstallExtensionEvent): Promise<void> {
		const result = this.filterEvent(data.profileLocation, data.applicationScoped ?? false);
		if (result instanceof Promise ? await result : result) {
			this._onDidUninstallExtension.fire(data);
		}
		this._onDidProfileAwareUninstallExtension.fire(data);
	}

	protected override async onDidUpdateExtensionMetadataEvent(data: DidUpdateExtensionMetadata): Promise<void> {
		const result = this.filterEvent(data.profileLocation, data.local?.isApplicationScoped ?? false);
		if (result instanceof Promise ? await result : result) {
			this._onDidUpdateExtensionMetadata.fire(data);
		}
		this._onDidProfileAwareUpdateExtensionMetadata.fire(data);
	}

	override async install(vsix: URI, installOptions?: InstallOptions): Promise<ILocalExtension> {
		installOptions = { ...installOptions, profileLocation: await this.getProfileLocation(installOptions?.profileLocation) };
		return super.install(vsix, installOptions);
	}

	override async installFromLocation(location: URI, profileLocation: URI): Promise<ILocalExtension> {
		return super.installFromLocation(location, await this.getProfileLocation(profileLocation));
	}

	override async installFromGallery(extension: IGalleryExtension, installOptions?: InstallOptions): Promise<ILocalExtension> {
		installOptions = { ...installOptions, profileLocation: await this.getProfileLocation(installOptions?.profileLocation) };
		return super.installFromGallery(extension, installOptions);
	}

	override async installGalleryExtensions(extensions: InstallExtensionInfo[]): Promise<InstallExtensionResult[]> {
		const infos: InstallExtensionInfo[] = [];
		for (const extension of extensions) {
			infos.push({ ...extension, options: { ...extension.options, profileLocation: await this.getProfileLocation(extension.options?.profileLocation) } });
		}
		return super.installGalleryExtensions(infos);
	}

	override async uninstall(extension: ILocalExtension, options?: UninstallOptions): Promise<void> {
		options = { ...options, profileLocation: await this.getProfileLocation(options?.profileLocation) };
		return super.uninstall(extension, options);
	}

	override async uninstallExtensions(extensions: UninstallExtensionInfo[]): Promise<void> {
		const infos: UninstallExtensionInfo[] = [];
		for (const { extension, options } of extensions) {
			infos.push({ extension, options: { ...options, profileLocation: await this.getProfileLocation(options?.profileLocation) } });
		}
		return super.uninstallExtensions(infos);
	}

	override async getInstalled(type: ExtensionType | null = null, extensionsProfileResource?: URI, productVersion?: IProductVersion): Promise<ILocalExtension[]> {
		return super.getInstalled(type, await this.getProfileLocation(extensionsProfileResource), productVersion);
	}

	override async updateMetadata(local: ILocalExtension, metadata: Partial<Metadata>, extensionsProfileResource?: URI): Promise<ILocalExtension> {
		return super.updateMetadata(local, metadata, await this.getProfileLocation(extensionsProfileResource));
	}

	override async toggleApplicationScope(local: ILocalExtension, fromProfileLocation: URI): Promise<ILocalExtension> {
		return super.toggleApplicationScope(local, await this.getProfileLocation(fromProfileLocation));
	}

	override async copyExtensions(fromProfileLocation: URI, toProfileLocation: URI): Promise<void> {
		return super.copyExtensions(await this.getProfileLocation(fromProfileLocation), await this.getProfileLocation(toProfileLocation));
	}

	private async whenProfileChanged(e: DidChangeUserDataProfileEvent): Promise<void> {
		const previousProfileLocation = await this.getProfileLocation(e.previous.extensionsResource);
		const currentProfileLocation = await this.getProfileLocation(e.profile.extensionsResource);

		if (this.uriIdentityService.extUri.isEqual(previousProfileLocation, currentProfileLocation)) {
			return;
		}

		const eventData = await this.switchExtensionsProfile(previousProfileLocation, currentProfileLocation);
		this._onDidChangeProfile.fire(eventData);
	}

	protected async switchExtensionsProfile(previousProfileLocation: URI, currentProfileLocation: URI, preserveExtensions?: ExtensionIdentifier[]): Promise<DidChangeProfileEvent> {
		const oldExtensions = await this.getInstalled(ExtensionType.User, previousProfileLocation);
		const newExtensions = await this.getInstalled(ExtensionType.User, currentProfileLocation);
		if (preserveExtensions?.length) {
			const extensionsToInstall: IExtensionIdentifier[] = [];
			for (const extension of oldExtensions) {
				if (preserveExtensions.some(id => ExtensionIdentifier.equals(extension.identifier.id, id)) &&
					!newExtensions.some(e => ExtensionIdentifier.equals(e.identifier.id, extension.identifier.id))) {
					extensionsToInstall.push(extension.identifier);
				}
			}
			if (extensionsToInstall.length) {
				await this.installExtensionsFromProfile(extensionsToInstall, previousProfileLocation, currentProfileLocation);
			}
		}
		return delta(oldExtensions, newExtensions, (a, b) => compare(`${ExtensionIdentifier.toKey(a.identifier.id)}@${a.manifest.version}`, `${ExtensionIdentifier.toKey(b.identifier.id)}@${b.manifest.version}`));
	}

	protected getProfileLocation(profileLocation: URI): Promise<URI>;
	protected getProfileLocation(profileLocation?: URI): Promise<URI | undefined>;
	protected async getProfileLocation(profileLocation?: URI): Promise<URI | undefined> {
		return profileLocation ?? this.userDataProfileService.currentProfile.extensionsResource;
	}

	protected abstract filterEvent(profileLocation: URI, isApplicationScoped: boolean): boolean | Promise<boolean>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/extensionManagement/common/extensionManagementServerService.ts]---
Location: vscode-main/src/vs/workbench/services/extensionManagement/common/extensionManagementServerService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { ExtensionInstallLocation, IExtensionManagementServer, IExtensionManagementServerService } from './extensionManagement.js';
import { IRemoteAgentService } from '../../remote/common/remoteAgentService.js';
import { Schemas } from '../../../../base/common/network.js';
import { IChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { WebExtensionManagementService } from './webExtensionManagementService.js';
import { IExtension } from '../../../../platform/extensions/common/extensions.js';
import { RemoteExtensionManagementService } from './remoteExtensionManagementService.js';

export class ExtensionManagementServerService implements IExtensionManagementServerService {

	declare readonly _serviceBrand: undefined;

	readonly localExtensionManagementServer: IExtensionManagementServer | null = null;
	readonly remoteExtensionManagementServer: IExtensionManagementServer | null = null;
	readonly webExtensionManagementServer: IExtensionManagementServer | null = null;

	constructor(
		@IRemoteAgentService remoteAgentService: IRemoteAgentService,
		@ILabelService labelService: ILabelService,
		@IInstantiationService instantiationService: IInstantiationService,
	) {
		const remoteAgentConnection = remoteAgentService.getConnection();
		if (remoteAgentConnection) {
			const extensionManagementService = instantiationService.createInstance(RemoteExtensionManagementService, remoteAgentConnection.getChannel<IChannel>('extensions'));
			this.remoteExtensionManagementServer = {
				id: 'remote',
				extensionManagementService,
				get label() { return labelService.getHostLabel(Schemas.vscodeRemote, remoteAgentConnection.remoteAuthority) || localize('remote', "Remote"); },
			};
		}
		if (isWeb) {
			const extensionManagementService = instantiationService.createInstance(WebExtensionManagementService);
			this.webExtensionManagementServer = {
				id: 'web',
				extensionManagementService,
				label: localize('browser', "Browser"),
			};
		}
	}

	getExtensionManagementServer(extension: IExtension): IExtensionManagementServer {
		if (extension.location.scheme === Schemas.vscodeRemote) {
			return this.remoteExtensionManagementServer!;
		}
		if (this.webExtensionManagementServer) {
			return this.webExtensionManagementServer;
		}
		throw new Error(`Invalid Extension ${extension.location}`);
	}

	getExtensionInstallLocation(extension: IExtension): ExtensionInstallLocation | null {
		const server = this.getExtensionManagementServer(extension);
		return server === this.remoteExtensionManagementServer ? ExtensionInstallLocation.Remote : ExtensionInstallLocation.Web;
	}
}

registerSingleton(IExtensionManagementServerService, ExtensionManagementServerService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
