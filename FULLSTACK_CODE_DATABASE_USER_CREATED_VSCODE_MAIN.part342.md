---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:26Z
part: 342
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 342 of 552)

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

---[FILE: src/vs/workbench/contrib/authentication/browser/authentication.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/authentication.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IExtensionManifest } from '../../../../platform/extensions/common/extensions.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { SignOutOfAccountAction } from './actions/signOutOfAccountAction.js';
import { IBrowserWorkbenchEnvironmentService } from '../../../services/environment/browser/environmentService.js';
import { Extensions, IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData } from '../../../services/extensionManagement/common/extensionFeatures.js';
import { ManageTrustedExtensionsForAccountAction } from './actions/manageTrustedExtensionsForAccountAction.js';
import { ManageAccountPreferencesForExtensionAction } from './actions/manageAccountPreferencesForExtensionAction.js';
import { IAuthenticationUsageService } from '../../../services/authentication/browser/authenticationUsageService.js';
import { ManageAccountPreferencesForMcpServerAction } from './actions/manageAccountPreferencesForMcpServerAction.js';
import { ManageTrustedMcpServersForAccountAction } from './actions/manageTrustedMcpServersForAccountAction.js';
import { RemoveDynamicAuthenticationProvidersAction } from './actions/manageDynamicAuthenticationProvidersAction.js';
import { ManageAccountsAction } from './actions/manageAccountsAction.js';

const codeExchangeProxyCommand = CommandsRegistry.registerCommand('workbench.getCodeExchangeProxyEndpoints', function (accessor, _) {
	const environmentService = accessor.get(IBrowserWorkbenchEnvironmentService);
	return environmentService.options?.codeExchangeProxyEndpoints;
});

class AuthenticationDataRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.authentication;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const authentication = manifest.contributes?.authentication || [];
		if (!authentication.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('authenticationlabel', "Label"),
			localize('authenticationid', "ID"),
			localize('authenticationMcpAuthorizationServers', "MCP Authorization Servers")
		];

		const rows: IRowData[][] = authentication
			.sort((a, b) => a.label.localeCompare(b.label))
			.map(auth => {
				return [
					auth.label,
					auth.id,
					(auth.authorizationServerGlobs ?? []).join(',\n')
				];
			});

		return {
			data: {
				headers,
				rows
			},
			dispose: () => { }
		};
	}
}

const extensionFeature = Registry.as<IExtensionFeaturesRegistry>(Extensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'authentication',
	label: localize('authentication', "Authentication"),
	access: {
		canToggle: false
	},
	renderer: new SyncDescriptor(AuthenticationDataRenderer),
});

class AuthenticationContribution extends Disposable implements IWorkbenchContribution {
	static ID = 'workbench.contrib.authentication';

	constructor() {
		super();
		this._register(codeExchangeProxyCommand);
		this._register(extensionFeature);

		this._registerActions();
	}

	private _registerActions(): void {
		this._register(registerAction2(ManageAccountsAction));
		this._register(registerAction2(SignOutOfAccountAction));
		this._register(registerAction2(ManageTrustedExtensionsForAccountAction));
		this._register(registerAction2(ManageAccountPreferencesForExtensionAction));
		this._register(registerAction2(ManageTrustedMcpServersForAccountAction));
		this._register(registerAction2(ManageAccountPreferencesForMcpServerAction));
		this._register(registerAction2(RemoveDynamicAuthenticationProvidersAction));
	}
}

class AuthenticationUsageContribution implements IWorkbenchContribution {
	static ID = 'workbench.contrib.authenticationUsage';

	constructor(
		@IAuthenticationUsageService private readonly _authenticationUsageService: IAuthenticationUsageService,
	) {
		this._initializeExtensionUsageCache();
	}

	private async _initializeExtensionUsageCache() {
		await this._authenticationUsageService.initializeExtensionUsageCache();
	}
}

// class AuthenticationExtensionsContribution extends Disposable implements IWorkbenchContribution {
// 	static ID = 'workbench.contrib.authenticationExtensions';

// 	constructor(
// 		@IExtensionService private readonly _extensionService: IExtensionService,
// 		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
// 		@IAuthenticationService private readonly _authenticationService: IAuthenticationService
// 	) {
// 		super();
// 		void this.run();
// 		this._register(this._extensionService.onDidChangeExtensions(this._onDidChangeExtensions, this));
// 		this._register(
// 			Event.any(
// 				this._authenticationService.onDidChangeDeclaredProviders,
// 				this._authenticationService.onDidRegisterAuthenticationProvider
// 			)(() => this._cleanupRemovedExtensions())
// 		);
// 	}

// 	async run(): Promise<void> {
// 		await this._extensionService.whenInstalledExtensionsRegistered();
// 		this._cleanupRemovedExtensions();
// 	}

// 	private _onDidChangeExtensions(delta: { readonly added: readonly IExtensionDescription[]; readonly removed: readonly IExtensionDescription[] }): void {
// 		if (delta.removed.length > 0) {
// 			this._cleanupRemovedExtensions(delta.removed);
// 		}
// 	}

// 	private _cleanupRemovedExtensions(removedExtensions?: readonly IExtensionDescription[]): void {
// 		const extensionIdsToRemove = removedExtensions
// 			? new Set(removedExtensions.map(e => e.identifier.value))
// 			: new Set(this._extensionService.extensions.map(e => e.identifier.value));

// 		// If we are cleaning up specific removed extensions, we only remove those.
// 		const isTargetedCleanup = !!removedExtensions;

// 		const providerIds = this._authenticationQueryService.getProviderIds();
// 		for (const providerId of providerIds) {
// 			this._authenticationQueryService.provider(providerId).forEachAccount(account => {
// 				account.extensions().forEach(extension => {
// 					const shouldRemove = isTargetedCleanup
// 						? extensionIdsToRemove.has(extension.extensionId)
// 						: !extensionIdsToRemove.has(extension.extensionId);

// 					if (shouldRemove) {
// 						extension.removeUsage();
// 						extension.setAccessAllowed(false);
// 					}
// 				});
// 			});
// 		}
// 	}
// }

// class AuthenticationMcpContribution extends Disposable implements IWorkbenchContribution {
// 	static ID = 'workbench.contrib.authenticationMcp';

// 	constructor(
// 		@IMcpRegistry private readonly _mcpRegistry: IMcpRegistry,
// 		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
// 		@IAuthenticationService private readonly _authenticationService: IAuthenticationService
// 	) {
// 		super();
// 		this._cleanupRemovedMcpServers();

// 		// Listen for MCP collections changes using autorun with observables
// 		this._register(autorun(reader => {
// 			// Read the collections observable to register dependency
// 			this._mcpRegistry.collections.read(reader);
// 			// Schedule cleanup for next tick to avoid running during observable updates
// 			queueMicrotask(() => this._cleanupRemovedMcpServers());
// 		}));
// 		this._register(
// 			Event.any(
// 				this._authenticationService.onDidChangeDeclaredProviders,
// 				this._authenticationService.onDidRegisterAuthenticationProvider
// 			)(() => this._cleanupRemovedMcpServers())
// 		);
// 	}

// 	private _cleanupRemovedMcpServers(): void {
// 		const currentServerIds = new Set(this._mcpRegistry.collections.get().flatMap(c => c.serverDefinitions.get()).map(s => s.id));
// 		const providerIds = this._authenticationQueryService.getProviderIds();
// 		for (const providerId of providerIds) {
// 			this._authenticationQueryService.provider(providerId).forEachAccount(account => {
// 				account.mcpServers().forEach(server => {
// 					if (!currentServerIds.has(server.mcpServerId)) {
// 						server.removeUsage();
// 						server.setAccessAllowed(false);
// 					}
// 				});
// 			});
// 		}
// 	}
// }

registerWorkbenchContribution2(AuthenticationContribution.ID, AuthenticationContribution, WorkbenchPhase.AfterRestored);
registerWorkbenchContribution2(AuthenticationUsageContribution.ID, AuthenticationUsageContribution, WorkbenchPhase.Eventually);
// registerWorkbenchContribution2(AuthenticationExtensionsContribution.ID, AuthenticationExtensionsContribution, WorkbenchPhase.Eventually);
// registerWorkbenchContribution2(AuthenticationMcpContribution.ID, AuthenticationMcpContribution, WorkbenchPhase.Eventually);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageAccountPreferencesForExtensionAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageAccountPreferencesForExtensionAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2, MenuId } from '../../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IQuickInputService, IQuickPick, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { AuthenticationSessionAccount, IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { IAuthenticationQueryService } from '../../../../services/authentication/common/authenticationQuery.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';

export class ManageAccountPreferencesForExtensionAction extends Action2 {
	constructor() {
		super({
			id: '_manageAccountPreferencesForExtension',
			title: localize2('manageAccountPreferenceForExtension', "Manage Extension Account Preferences..."),
			category: localize2('accounts', "Accounts"),
			f1: true,
			menu: [{
				id: MenuId.AccountsContext,
				order: 100,
			}],
		});
	}

	override run(accessor: ServicesAccessor, extensionId?: string, providerId?: string): Promise<void> {
		return accessor.get(IInstantiationService).createInstance(ManageAccountPreferenceForExtensionActionImpl).run(extensionId, providerId);
	}
}

type AccountPreferenceQuickPickItem = NewAccountQuickPickItem | ExistingAccountQuickPickItem;

interface NewAccountQuickPickItem extends IQuickPickItem {
	account?: undefined;
	scopes: readonly string[];
	providerId: string;
}

interface ExistingAccountQuickPickItem extends IQuickPickItem {
	account: AuthenticationSessionAccount;
	scopes?: undefined;
	providerId: string;
}

class ManageAccountPreferenceForExtensionActionImpl {
	constructor(
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService
	) { }

	async run(extensionId?: string, providerId?: string) {
		if (!extensionId) {
			const extensions = this._extensionService.extensions
				.filter(ext => this._authenticationQueryService.extension(ext.identifier.value).getAllAccountPreferences().size > 0)
				.sort((a, b) => (a.displayName ?? a.name).localeCompare((b.displayName ?? b.name)));

			const result = await this._quickInputService.pick(extensions.map(ext => ({
				label: ext.displayName ?? ext.name,
				id: ext.identifier.value
			})), {
				placeHolder: localize('selectExtension', "Select an extension to manage account preferences for"),
				title: localize('pickAProviderTitle', "Manage Extension Account Preferences")
			});
			extensionId = result?.id;
		}
		if (!extensionId) {
			return;
		}
		const extension = await this._extensionService.getExtension(extensionId);
		if (!extension) {
			throw new Error(`No extension with id ${extensionId}`);
		}

		if (!providerId) {
			// Use the query service's extension-centric approach to find providers that have been used
			const extensionQuery = this._authenticationQueryService.extension(extensionId);
			const providersWithAccess = await extensionQuery.getProvidersWithAccess();
			if (!providersWithAccess.length) {
				await this._dialogService.info(localize('noAccountUsage', "This extension has not used any accounts yet."));
				return;
			}
			providerId = providersWithAccess[0]; // Default to the first provider
			if (providersWithAccess.length > 1) {
				const result = await this._quickInputService.pick(
					providersWithAccess.map(providerId => ({
						label: this._authenticationService.getProvider(providerId).label,
						id: providerId,
					})),
					{
						placeHolder: localize('selectProvider', "Select an authentication provider to manage account preferences for"),
						title: localize('pickAProviderTitle', "Manage Extension Account Preferences")
					}
				);
				if (!result) {
					return; // User cancelled
				}
				providerId = result.id;
			}
		}

		// Only fetch accounts for the chosen provider
		const accounts = await this._authenticationService.getAccounts(providerId);
		const currentAccountNamePreference = this._authenticationQueryService.provider(providerId).extension(extensionId).getPreferredAccount();
		const items: Array<QuickPickInput<AccountPreferenceQuickPickItem>> = this._getItems(accounts, providerId, currentAccountNamePreference);

		// If the provider supports multiple accounts, add an option to use a new account
		const provider = this._authenticationService.getProvider(providerId);
		if (provider.supportsMultipleAccounts) {
			// Get the last used scopes for the last used account. This will be used to pre-fill the scopes when adding a new account.
			// If there's no scopes, then don't add this option.
			const lastUsedScopes = accounts
				.flatMap(account => this._authenticationQueryService.provider(providerId).account(account.label).extension(extensionId).getUsage())
				.sort((a, b) => b.lastUsed - a.lastUsed)[0]?.scopes; // Sort by timestamp and take the most recent
			if (lastUsedScopes) {
				items.push({ type: 'separator' });
				items.push({
					providerId,
					scopes: lastUsedScopes,
					label: localize('use new account', "Use a new account..."),
				});
			}
		}

		const disposables = new DisposableStore();
		const picker = this._createQuickPick(disposables, extensionId, extension.displayName ?? extension.name, provider.label);
		if (items.length === 0) {
			// We would only get here if we went through the Command Palette
			disposables.add(this._handleNoAccounts(picker));
			return;
		}
		picker.items = items;
		picker.show();
	}

	private _createQuickPick(disposableStore: DisposableStore, extensionId: string, extensionLabel: string, providerLabel: string) {
		const picker = disposableStore.add(this._quickInputService.createQuickPick<AccountPreferenceQuickPickItem>({ useSeparators: true }));
		disposableStore.add(picker.onDidHide(() => {
			disposableStore.dispose();
		}));
		picker.placeholder = localize('placeholder v2', "Manage '{0}' account preferences for {1}...", extensionLabel, providerLabel);
		picker.title = localize('title', "'{0}' Account Preferences For This Workspace", extensionLabel);
		picker.sortByLabel = false;
		disposableStore.add(picker.onDidAccept(async () => {
			picker.hide();
			await this._accept(extensionId, picker.selectedItems);
		}));
		return picker;
	}

	private _getItems(accounts: ReadonlyArray<AuthenticationSessionAccount>, providerId: string, currentAccountNamePreference: string | undefined): Array<QuickPickInput<AccountPreferenceQuickPickItem>> {
		return accounts.map<QuickPickInput<AccountPreferenceQuickPickItem>>(a => currentAccountNamePreference === a.label
			? {
				label: a.label,
				account: a,
				providerId,
				description: localize('currentAccount', "Current account"),
				picked: true
			}
			: {
				label: a.label,
				account: a,
				providerId,
			}
		);
	}

	private _handleNoAccounts(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>): IDisposable {
		picker.validationMessage = localize('noAccounts', "No accounts are currently used by this extension.");
		picker.buttons = [this._quickInputService.backButton];
		picker.show();
		return Event.filter(picker.onDidTriggerButton, (e) => e === this._quickInputService.backButton)(() => this.run());
	}

	private async _accept(extensionId: string, selectedItems: ReadonlyArray<AccountPreferenceQuickPickItem>) {
		for (const item of selectedItems) {
			let account: AuthenticationSessionAccount;
			if (!item.account) {
				try {
					const session = await this._authenticationService.createSession(item.providerId, [...item.scopes]);
					account = session.account;
				} catch (e) {
					this._logService.error(e);
					continue;
				}
			} else {
				account = item.account;
			}
			const providerId = item.providerId;
			const extensionQuery = this._authenticationQueryService.provider(providerId).extension(extensionId);
			const currentAccountName = extensionQuery.getPreferredAccount();
			if (currentAccountName === account.label) {
				// This account is already the preferred account
				continue;
			}
			extensionQuery.setPreferredAccount(account);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageAccountPreferencesForMcpServerAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageAccountPreferencesForMcpServerAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../../platform/log/common/log.js';
import { IQuickInputService, IQuickPick, IQuickPickItem, QuickPickInput } from '../../../../../platform/quickinput/common/quickInput.js';
import { AuthenticationSessionAccount, IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { IAuthenticationQueryService } from '../../../../services/authentication/common/authenticationQuery.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';

export class ManageAccountPreferencesForMcpServerAction extends Action2 {
	constructor() {
		super({
			id: '_manageAccountPreferencesForMcpServer',
			title: localize2('manageAccountPreferenceForMcpServer', "Manage MCP Server Account Preferences"),
			category: localize2('accounts', "Accounts"),
			f1: false
		});
	}

	override run(accessor: ServicesAccessor, mcpServerId?: string, providerId?: string): Promise<void> {
		return accessor.get(IInstantiationService).createInstance(ManageAccountPreferenceForMcpServerActionImpl).run(mcpServerId, providerId);
	}
}

type AccountPreferenceQuickPickItem = NewAccountQuickPickItem | ExistingAccountQuickPickItem;

interface NewAccountQuickPickItem extends IQuickPickItem {
	account?: undefined;
	scopes: readonly string[];
	providerId: string;
}

interface ExistingAccountQuickPickItem extends IQuickPickItem {
	account: AuthenticationSessionAccount;
	scopes?: undefined;
	providerId: string;
}

class ManageAccountPreferenceForMcpServerActionImpl {
	constructor(
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
		@IMcpService private readonly _mcpService: IMcpService,
		@ILogService private readonly _logService: ILogService
	) { }

	async run(mcpServerId?: string, providerId?: string) {
		if (!mcpServerId) {
			return;
		}
		const mcpServer = this._mcpService.servers.get().find(s => s.definition.id === mcpServerId);
		if (!mcpServer) {
			throw new Error(`No MCP server with id ${mcpServerId}`);
		}

		if (!providerId) {
			// Use the query service's MCP server-centric approach to find providers that have been used
			const mcpServerQuery = this._authenticationQueryService.mcpServer(mcpServerId);
			const providersWithAccess = await mcpServerQuery.getProvidersWithAccess();
			if (!providersWithAccess.length) {
				await this._dialogService.info(localize('noAccountUsage', "This MCP server has not used any accounts yet."));
				return;
			}
			providerId = providersWithAccess[0]; // Default to the first provider
			if (providersWithAccess.length > 1) {
				const result = await this._quickInputService.pick(
					providersWithAccess.map(providerId => ({
						label: this._authenticationService.getProvider(providerId).label,
						id: providerId,
					})),
					{
						placeHolder: localize('selectProvider', "Select an authentication provider to manage account preferences for"),
						title: localize('pickAProviderTitle', "Manage MCP Server Account Preferences")
					}
				);
				if (!result) {
					return; // User cancelled
				}
				providerId = result.id;
			}
		}

		// Only fetch accounts for the chosen provider
		const accounts = await this._authenticationService.getAccounts(providerId);
		const currentAccountNamePreference = this._authenticationQueryService.provider(providerId).mcpServer(mcpServerId).getPreferredAccount();
		const items: Array<QuickPickInput<AccountPreferenceQuickPickItem>> = this._getItems(accounts, providerId, currentAccountNamePreference);

		// If the provider supports multiple accounts, add an option to use a new account
		const provider = this._authenticationService.getProvider(providerId);
		if (provider.supportsMultipleAccounts) {
			// Get the last used scopes for the last used account. This will be used to pre-fill the scopes when adding a new account.
			// If there's no scopes, then don't add this option.
			const lastUsedScopes = accounts
				.flatMap(account => this._authenticationQueryService.provider(providerId).account(account.label).mcpServer(mcpServerId).getUsage())
				.sort((a, b) => b.lastUsed - a.lastUsed)[0]?.scopes; // Sort by timestamp and take the most recent
			if (lastUsedScopes) {
				items.push({ type: 'separator' });
				items.push({
					providerId: providerId,
					scopes: lastUsedScopes,
					label: localize('use new account', "Use a new account..."),
				});
			}
		}

		const disposables = new DisposableStore();
		const picker = this._createQuickPick(disposables, mcpServerId, mcpServer.definition.label, provider.label);
		if (items.length === 0) {
			// We would only get here if we went through the Command Palette
			disposables.add(this._handleNoAccounts(picker));
			return;
		}
		picker.items = items;
		picker.show();
	}

	private _createQuickPick(disposableStore: DisposableStore, mcpServerId: string, mcpServerLabel: string, providerLabel: string) {
		const picker = disposableStore.add(this._quickInputService.createQuickPick<AccountPreferenceQuickPickItem>({ useSeparators: true }));
		disposableStore.add(picker.onDidHide(() => {
			disposableStore.dispose();
		}));
		picker.placeholder = localize('placeholder v2', "Manage '{0}' account preferences for {1}...", mcpServerLabel, providerLabel);
		picker.title = localize('title', "'{0}' Account Preferences For This Workspace", mcpServerLabel);
		picker.sortByLabel = false;
		disposableStore.add(picker.onDidAccept(async () => {
			picker.hide();
			await this._accept(mcpServerId, picker.selectedItems);
		}));
		return picker;
	}

	private _getItems(accounts: ReadonlyArray<AuthenticationSessionAccount>, providerId: string, currentAccountNamePreference: string | undefined): Array<QuickPickInput<AccountPreferenceQuickPickItem>> {
		return accounts.map<QuickPickInput<AccountPreferenceQuickPickItem>>(a => currentAccountNamePreference === a.label
			? {
				label: a.label,
				account: a,
				providerId,
				description: localize('currentAccount', "Current account"),
				picked: true
			}
			: {
				label: a.label,
				account: a,
				providerId,
			}
		);
	}

	private _handleNoAccounts(picker: IQuickPick<IQuickPickItem, { useSeparators: true }>): IDisposable {
		picker.validationMessage = localize('noAccounts', "No accounts are currently used by this MCP server.");
		picker.buttons = [this._quickInputService.backButton];
		picker.show();
		return Event.filter(picker.onDidTriggerButton, (e) => e === this._quickInputService.backButton)(() => this.run());
	}

	private async _accept(mcpServerId: string, selectedItems: ReadonlyArray<AccountPreferenceQuickPickItem>) {
		for (const item of selectedItems) {
			let account: AuthenticationSessionAccount;
			if (!item.account) {
				try {
					const session = await this._authenticationService.createSession(item.providerId, [...item.scopes]);
					account = session.account;
				} catch (e) {
					this._logService.error(e);
					continue;
				}
			} else {
				account = item.account;
			}
			const providerId = item.providerId;
			const mcpQuery = this._authenticationQueryService.provider(providerId).mcpServer(mcpServerId);
			const currentAccountName = mcpQuery.getPreferredAccount();
			if (currentAccountName === account.label) {
				// This account is already the preferred account
				continue;
			}
			mcpQuery.setPreferredAccount(account);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageAccountsAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageAccountsAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Lazy } from '../../../../../base/common/lazy.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { ISecretStorageService } from '../../../../../platform/secrets/common/secrets.js';
import { AuthenticationSessionInfo, getCurrentAuthenticationSessionInfo } from '../../../../services/authentication/browser/authenticationService.js';
import { IAuthenticationProvider, IAuthenticationService } from '../../../../services/authentication/common/authentication.js';

export class ManageAccountsAction extends Action2 {
	constructor() {
		super({
			id: 'workbench.action.manageAccounts',
			title: localize2('manageAccounts', "Manage Accounts"),
			category: localize2('accounts', "Accounts"),
			f1: true
		});
	}

	public override run(accessor: ServicesAccessor): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		return instantiationService.createInstance(ManageAccountsActionImpl).run();
	}
}

interface AccountQuickPickItem extends IQuickPickItem {
	providerId: string;
	canUseMcp: boolean;
	canSignOut: () => Promise<boolean>;
}

interface AccountActionQuickPickItem extends IQuickPickItem {
	action: () => void;
}

class ManageAccountsActionImpl {
	constructor(
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@ICommandService private readonly commandService: ICommandService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService,
		@IProductService private readonly productService: IProductService,
	) { }

	public async run() {
		const placeHolder = localize('pickAccount', "Select an account to manage");

		const accounts = await this.listAccounts();
		if (!accounts.length) {
			await this.quickInputService.pick([{ label: localize('noActiveAccounts', "There are no active accounts.") }], { placeHolder });
			return;
		}

		const account = await this.quickInputService.pick(accounts, { placeHolder, matchOnDescription: true });
		if (!account) {
			return;
		}

		await this.showAccountActions(account);
	}

	private async listAccounts(): Promise<AccountQuickPickItem[]> {
		const activeSession = new Lazy(() => getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService));
		const accounts: AccountQuickPickItem[] = [];
		for (const providerId of this.authenticationService.getProviderIds()) {
			const provider = this.authenticationService.getProvider(providerId);
			for (const { label, id } of await this.authenticationService.getAccounts(providerId)) {
				accounts.push({
					label,
					description: provider.label,
					providerId,
					canUseMcp: !!provider.authorizationServers?.length,
					canSignOut: async () => this.canSignOut(provider, id, await activeSession.value)
				});
			}
		}
		return accounts;
	}

	private async canSignOut(provider: IAuthenticationProvider, accountId: string, session?: AuthenticationSessionInfo): Promise<boolean> {
		if (session && !session.canSignOut && session.providerId === provider.id) {
			const sessions = await this.authenticationService.getSessions(provider.id);
			return !sessions.some(o => o.id === session.id && o.account.id === accountId);
		}
		return true;
	}

	private async showAccountActions(account: AccountQuickPickItem): Promise<void> {
		const { providerId, label: accountLabel, canUseMcp, canSignOut } = account;

		const store = new DisposableStore();
		const quickPick = store.add(this.quickInputService.createQuickPick<AccountActionQuickPickItem>());

		quickPick.title = localize('manageAccount', "Manage '{0}'", accountLabel);
		quickPick.placeholder = localize('selectAction', "Select an action");
		quickPick.buttons = [this.quickInputService.backButton];

		const items: AccountActionQuickPickItem[] = [{
			label: localize('manageTrustedExtensions', "Manage Trusted Extensions"),
			action: () => this.commandService.executeCommand('_manageTrustedExtensionsForAccount', { providerId, accountLabel })
		}];

		if (canUseMcp) {
			items.push({
				label: localize('manageTrustedMCPServers', "Manage Trusted MCP Servers"),
				action: () => this.commandService.executeCommand('_manageTrustedMCPServersForAccount', { providerId, accountLabel })
			});
		}

		if (await canSignOut()) {
			items.push({
				label: localize('signOut', "Sign Out"),
				action: () => this.commandService.executeCommand('_signOutOfAccount', { providerId, accountLabel })
			});
		}

		quickPick.items = items;

		store.add(quickPick.onDidAccept(() => {
			const selected = quickPick.selectedItems[0];
			if (selected) {
				quickPick.hide();
				selected.action();
			}
		}));

		store.add(quickPick.onDidTriggerButton((button) => {
			if (button === this.quickInputService.backButton) {
				void this.run();
			}
		}));

		store.add(quickPick.onDidHide(() => store.dispose()));

		quickPick.show();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageDynamicAuthenticationProvidersAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageDynamicAuthenticationProvidersAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../../platform/quickinput/common/quickInput.js';
import { IDynamicAuthenticationProviderStorageService, DynamicAuthenticationProviderInfo } from '../../../../services/authentication/common/dynamicAuthenticationProviderStorage.js';
import { IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';

interface IDynamicProviderQuickPickItem extends IQuickPickItem {
	provider: DynamicAuthenticationProviderInfo;
}

export class RemoveDynamicAuthenticationProvidersAction extends Action2 {

	static readonly ID = 'workbench.action.removeDynamicAuthenticationProviders';

	constructor() {
		super({
			id: RemoveDynamicAuthenticationProvidersAction.ID,
			title: localize2('removeDynamicAuthProviders', 'Remove Dynamic Authentication Providers'),
			category: localize2('authenticationCategory', 'Authentication'),
			f1: true
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const dynamicAuthStorageService = accessor.get(IDynamicAuthenticationProviderStorageService);
		const authenticationService = accessor.get(IAuthenticationService);
		const dialogService = accessor.get(IDialogService);

		const interactedProviders = dynamicAuthStorageService.getInteractedProviders();

		if (interactedProviders.length === 0) {
			await dialogService.info(
				localize('noDynamicProviders', 'No dynamic authentication providers'),
				localize('noDynamicProvidersDetail', 'No dynamic authentication providers have been used yet.')
			);
			return;
		}

		const items: IDynamicProviderQuickPickItem[] = interactedProviders.map(provider => ({
			label: provider.label,
			description: localize('clientId', 'Client ID: {0}', provider.clientId),
			provider
		}));

		const selected = await quickInputService.pick(items, {
			placeHolder: localize('selectProviderToRemove', 'Select a dynamic authentication provider to remove'),
			canPickMany: true
		});

		if (!selected || selected.length === 0) {
			return;
		}

		// Confirm deletion
		const providerNames = selected.map(item => item.provider.label).join(', ');
		const message = selected.length === 1
			? localize('confirmDeleteSingleProvider', 'Are you sure you want to remove the dynamic authentication provider "{0}"?', providerNames)
			: localize('confirmDeleteMultipleProviders', 'Are you sure you want to remove {0} dynamic authentication providers: {1}?', selected.length, providerNames);

		const result = await dialogService.confirm({
			message,
			detail: localize('confirmDeleteDetail', 'This will remove all stored authentication data for the selected provider(s). You will need to re-authenticate if you use these providers again.'),
			primaryButton: localize('remove', 'Remove'),
			type: 'warning'
		});

		if (!result.confirmed) {
			return;
		}

		// Remove the selected providers
		for (const item of selected) {
			const providerId = item.provider.providerId;

			// Unregister from authentication service if still registered
			if (authenticationService.isAuthenticationProviderRegistered(providerId)) {
				authenticationService.unregisterAuthenticationProvider(providerId);
			}

			// Remove from dynamic storage service
			await dynamicAuthStorageService.removeDynamicProvider(providerId);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageTrustedExtensionsForAccountAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageTrustedExtensionsForAccountAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { fromNow } from '../../../../../base/common/date.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { AllowedExtension, IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { IAuthenticationQueryService, IAccountQuery } from '../../../../services/authentication/common/authenticationQuery.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IExtensionsWorkbenchService } from '../../../extensions/common/extensions.js';

export class ManageTrustedExtensionsForAccountAction extends Action2 {
	constructor() {
		super({
			id: '_manageTrustedExtensionsForAccount',
			title: localize2('manageTrustedExtensionsForAccount', "Manage Trusted Extensions For Account"),
			category: localize2('accounts', "Accounts"),
			f1: true
		});
	}

	override run(accessor: ServicesAccessor, options?: { providerId: string; accountLabel: string }): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		return instantiationService.createInstance(ManageTrustedExtensionsForAccountActionImpl).run(options);
	}
}

interface TrustedExtensionsQuickPickItem extends IQuickPickItem {
	extension: AllowedExtension;
	lastUsed?: number;
}

class ManageTrustedExtensionsForAccountActionImpl {
	private readonly _viewDetailsButton = {
		tooltip: localize('viewExtensionDetails', "View extension details"),
		iconClass: ThemeIcon.asClassName(Codicon.info),
	};

	private readonly _managePreferencesButton = {
		tooltip: localize('accountPreferences', "Manage account preferences for this extension"),
		iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
	};

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
		@ICommandService private readonly _commandService: ICommandService,
		@IExtensionsWorkbenchService private readonly _extensionsWorkbenchService: IExtensionsWorkbenchService
	) { }

	async run(options?: { providerId: string; accountLabel: string }) {
		const accountQuery = await this._resolveAccountQuery(options?.providerId, options?.accountLabel);
		if (!accountQuery) {
			return;
		}

		const items = await this._getItems(accountQuery);
		if (!items.length) {
			return;
		}
		const picker = this._createQuickPick(accountQuery);
		picker.items = items;
		picker.selectedItems = items.filter((i): i is TrustedExtensionsQuickPickItem => i.type !== 'separator' && !!i.picked);
		picker.show();
	}

	//#region Account Query Resolution

	private async _resolveAccountQuery(providerId: string | undefined, accountLabel: string | undefined): Promise<IAccountQuery | undefined> {
		if (providerId && accountLabel) {
			return this._authenticationQueryService.provider(providerId).account(accountLabel);
		}

		const accounts = await this._getAllAvailableAccounts();
		const pick = await this._quickInputService.pick(accounts, {
			placeHolder: localize('pickAccount', "Pick an account to manage trusted extensions for"),
			matchOnDescription: true,
		});

		return pick ? this._authenticationQueryService.provider(pick.providerId).account(pick.label) : undefined;
	}

	private async _getAllAvailableAccounts() {
		const accounts = [];
		for (const providerId of this._authenticationService.getProviderIds()) {
			const provider = this._authenticationService.getProvider(providerId);
			const sessions = await this._authenticationService.getSessions(providerId);
			const uniqueLabels = new Set<string>();

			for (const session of sessions) {
				if (!uniqueLabels.has(session.account.label)) {
					uniqueLabels.add(session.account.label);
					accounts.push({
						providerId,
						label: session.account.label,
						description: provider.label
					});
				}
			}
		}
		return accounts;
	}

	//#endregion

	//#region Item Retrieval and Quick Pick Creation

	private async _getItems(accountQuery: IAccountQuery) {
		const allowedExtensions = accountQuery.extensions().getAllowedExtensions();
		const extensionIdToDisplayName = new Map<string, string>();

		// Get display names for all allowed extensions
		const resolvedExtensions = await Promise.all(allowedExtensions.map(ext => this._extensionService.getExtension(ext.id)));
		resolvedExtensions.forEach((resolved, i) => {
			if (resolved) {
				extensionIdToDisplayName.set(allowedExtensions[i].id, resolved.displayName || resolved.name);
			}
		});

		// Filter out extensions that are not currently installed and enrich with display names
		const filteredExtensions = allowedExtensions
			.filter(ext => extensionIdToDisplayName.has(ext.id))
			.map(ext => {
				const usage = accountQuery.extension(ext.id).getUsage();
				return {
					...ext,
					// Use the extension display name from the extension service
					name: extensionIdToDisplayName.get(ext.id)!,
					lastUsed: usage.length > 0 ? Math.max(...usage.map(u => u.lastUsed)) : ext.lastUsed
				};
			});

		if (!filteredExtensions.length) {
			this._dialogService.info(localize('noTrustedExtensions', "This account has not been used by any extensions."));
			return [];
		}

		const trustedExtensions = filteredExtensions.filter(e => e.trusted);
		const otherExtensions = filteredExtensions.filter(e => !e.trusted);
		const sortByLastUsed = (a: AllowedExtension, b: AllowedExtension) => (b.lastUsed || 0) - (a.lastUsed || 0);

		const _toQuickPickItem = this._toQuickPickItem.bind(this);
		return [
			...otherExtensions.sort(sortByLastUsed).map(_toQuickPickItem),
			{ type: 'separator', label: localize('trustedExtensions', "Trusted by Microsoft") } satisfies IQuickPickSeparator,
			...trustedExtensions.sort(sortByLastUsed).map(_toQuickPickItem)
		];
	}

	private _toQuickPickItem(extension: AllowedExtension): TrustedExtensionsQuickPickItem {
		const lastUsed = extension.lastUsed;
		const description = lastUsed
			? localize({ key: 'accountLastUsedDate', comment: ['The placeholder {0} is a string with time information, such as "3 days ago"'] }, "Last used this account {0}", fromNow(lastUsed, true))
			: localize('notUsed', "Has not used this account");
		let tooltip: string | undefined;
		let disabled: boolean | undefined;
		if (extension.trusted) {
			tooltip = localize('trustedExtensionTooltip', "This extension is trusted by Microsoft and\nalways has access to this account");
			disabled = true;
		}
		return {
			label: extension.name,
			extension,
			description,
			tooltip,
			disabled,
			buttons: [this._viewDetailsButton, this._managePreferencesButton],
			picked: extension.allowed === undefined || extension.allowed
		};
	}

	private _createQuickPick(accountQuery: IAccountQuery) {
		const disposableStore = new DisposableStore();
		const quickPick = disposableStore.add(this._quickInputService.createQuickPick<TrustedExtensionsQuickPickItem>({ useSeparators: true }));

		// Configure quick pick
		quickPick.canSelectMany = true;
		quickPick.customButton = true;
		quickPick.customLabel = localize('manageTrustedExtensions.cancel', 'Cancel');
		quickPick.customButtonSecondary = true;
		quickPick.title = localize('manageTrustedExtensions', "Manage Trusted Extensions");
		quickPick.placeholder = localize('manageExtensions', "Choose which extensions can access this account");

		// Set up event handlers
		disposableStore.add(quickPick.onDidAccept(() => {
			const updatedAllowedList = quickPick.items
				.filter((item): item is TrustedExtensionsQuickPickItem => item.type !== 'separator')
				.map(i => i.extension);

			const allowedExtensionsSet = new Set(quickPick.selectedItems.map(i => i.extension));
			for (const extension of updatedAllowedList) {
				const allowed = allowedExtensionsSet.has(extension);
				accountQuery.extension(extension.id).setAccessAllowed(allowed, extension.name);
			}
			quickPick.hide();
		}));

		disposableStore.add(quickPick.onDidHide(() => disposableStore.dispose()));
		disposableStore.add(quickPick.onDidCustom(() => quickPick.hide()));
		disposableStore.add(quickPick.onDidTriggerItemButton(e => {
			if (e.button === this._managePreferencesButton) {
				this._commandService.executeCommand('_manageAccountPreferencesForExtension', e.item.extension.id, accountQuery.providerId);
			} else if (e.button === this._viewDetailsButton) {
				this._extensionsWorkbenchService.open(e.item.extension.id);
			}
		}));

		return quickPick;
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/manageTrustedMcpServersForAccountAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/manageTrustedMcpServersForAccountAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../../base/common/codicons.js';
import { fromNow } from '../../../../../base/common/date.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize, localize2 } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService, ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../../platform/quickinput/common/quickInput.js';
import { AllowedMcpServer } from '../../../../services/authentication/browser/authenticationMcpAccessService.js';
import { IAuthenticationService } from '../../../../services/authentication/common/authentication.js';
import { IAuthenticationQueryService, IAccountQuery } from '../../../../services/authentication/common/authenticationQuery.js';
import { ChatContextKeys } from '../../../chat/common/chatContextKeys.js';
import { IMcpService } from '../../../mcp/common/mcpTypes.js';

export class ManageTrustedMcpServersForAccountAction extends Action2 {
	constructor() {
		super({
			id: '_manageTrustedMCPServersForAccount',
			title: localize2('manageTrustedMcpServersForAccount', "Manage Trusted MCP Servers For Account"),
			category: localize2('accounts', "Accounts"),
			f1: true,
			precondition: ChatContextKeys.Setup.hidden.negate()
		});
	}

	override run(accessor: ServicesAccessor, options?: { providerId: string; accountLabel: string }): Promise<void> {
		const instantiationService = accessor.get(IInstantiationService);
		return instantiationService.createInstance(ManageTrustedMcpServersForAccountActionImpl).run(options);
	}
}

interface TrustedMcpServersQuickPickItem extends IQuickPickItem {
	mcpServer: AllowedMcpServer;
	lastUsed?: number;
}

class ManageTrustedMcpServersForAccountActionImpl {
	constructor(
		@IMcpService private readonly _mcpServerService: IMcpService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IQuickInputService private readonly _quickInputService: IQuickInputService,
		@IAuthenticationService private readonly _mcpServerAuthenticationService: IAuthenticationService,
		@IAuthenticationQueryService private readonly _authenticationQueryService: IAuthenticationQueryService,
		@ICommandService private readonly _commandService: ICommandService
	) { }

	async run(options?: { providerId: string; accountLabel: string }) {
		const accountQuery = await this._resolveAccountQuery(options?.providerId, options?.accountLabel);
		if (!accountQuery) {
			return;
		}

		const items = await this._getItems(accountQuery);
		if (!items.length) {
			return;
		}
		const picker = this._createQuickPick(accountQuery);
		picker.items = items;
		picker.selectedItems = items.filter((i): i is TrustedMcpServersQuickPickItem => i.type !== 'separator' && !!i.picked);
		picker.show();
	}

	//#region Account Query Resolution

	private async _resolveAccountQuery(providerId: string | undefined, accountLabel: string | undefined): Promise<IAccountQuery | undefined> {
		if (providerId && accountLabel) {
			return this._authenticationQueryService.provider(providerId).account(accountLabel);
		}

		const accounts = await this._getAllAvailableAccounts();
		const pick = await this._quickInputService.pick(accounts, {
			placeHolder: localize('pickAccount', "Pick an account to manage trusted MCP servers for"),
			matchOnDescription: true,
		});

		return pick ? this._authenticationQueryService.provider(pick.providerId).account(pick.label) : undefined;
	}

	private async _getAllAvailableAccounts() {
		const accounts = [];
		for (const providerId of this._mcpServerAuthenticationService.getProviderIds()) {
			const provider = this._mcpServerAuthenticationService.getProvider(providerId);
			const sessions = await this._mcpServerAuthenticationService.getSessions(providerId);
			const uniqueLabels = new Set<string>();

			for (const session of sessions) {
				if (!uniqueLabels.has(session.account.label)) {
					uniqueLabels.add(session.account.label);
					accounts.push({
						providerId,
						label: session.account.label,
						description: provider.label
					});
				}
			}
		}
		return accounts;
	}

	//#endregion

	//#region Item Retrieval and Quick Pick Creation

	private async _getItems(accountQuery: IAccountQuery) {
		const allowedMcpServers = accountQuery.mcpServers().getAllowedMcpServers();
		const serverIdToLabel = new Map<string, string>(this._mcpServerService.servers.get().map(s => [s.definition.id, s.definition.label]));
		const filteredMcpServers = allowedMcpServers
			// Filter out MCP servers that are not in the current list of servers
			.filter(server => serverIdToLabel.has(server.id))
			.map(server => {
				const usage = accountQuery.mcpServer(server.id).getUsage();
				return {
					...server,
					// Use the server name from the MCP service
					name: serverIdToLabel.get(server.id)!,
					lastUsed: usage.length > 0 ? Math.max(...usage.map(u => u.lastUsed)) : server.lastUsed
				};
			});

		if (!filteredMcpServers.length) {
			this._dialogService.info(localize('noTrustedMcpServers', "This account has not been used by any MCP servers."));
			return [];
		}

		const trustedServers = filteredMcpServers.filter(s => s.trusted);
		const otherServers = filteredMcpServers.filter(s => !s.trusted);
		const sortByLastUsed = (a: AllowedMcpServer, b: AllowedMcpServer) => (b.lastUsed || 0) - (a.lastUsed || 0);

		return [
			...otherServers.sort(sortByLastUsed).map(this._toQuickPickItem),
			{ type: 'separator', label: localize('trustedMcpServers', "Trusted by Microsoft") } satisfies IQuickPickSeparator,
			...trustedServers.sort(sortByLastUsed).map(this._toQuickPickItem)
		];
	}

	private _toQuickPickItem(mcpServer: AllowedMcpServer): TrustedMcpServersQuickPickItem {
		const lastUsed = mcpServer.lastUsed;
		const description = lastUsed
			? localize({ key: 'accountLastUsedDate', comment: ['The placeholder {0} is a string with time information, such as "3 days ago"'] }, "Last used this account {0}", fromNow(lastUsed, true))
			: localize('notUsed', "Has not used this account");
		let tooltip: string | undefined;
		let disabled: boolean | undefined;
		if (mcpServer.trusted) {
			tooltip = localize('trustedMcpServerTooltip', "This MCP server is trusted by Microsoft and\nalways has access to this account");
			disabled = true;
		}
		return {
			label: mcpServer.name,
			mcpServer,
			description,
			tooltip,
			disabled,
			buttons: [{
				tooltip: localize('accountPreferences', "Manage account preferences for this MCP server"),
				iconClass: ThemeIcon.asClassName(Codicon.settingsGear),
			}],
			picked: mcpServer.allowed === undefined || mcpServer.allowed
		};
	}

	private _createQuickPick(accountQuery: IAccountQuery) {
		const disposableStore = new DisposableStore();
		const quickPick = disposableStore.add(this._quickInputService.createQuickPick<TrustedMcpServersQuickPickItem>({ useSeparators: true }));

		// Configure quick pick
		quickPick.canSelectMany = true;
		quickPick.customButton = true;
		quickPick.customLabel = localize('manageTrustedMcpServers.cancel', 'Cancel');
		quickPick.customButtonSecondary = true;
		quickPick.title = localize('manageTrustedMcpServers', "Manage Trusted MCP Servers");
		quickPick.placeholder = localize('manageMcpServers', "Choose which MCP servers can access this account");

		// Set up event handlers
		disposableStore.add(quickPick.onDidAccept(() => {
			quickPick.hide();
			const allServers = quickPick.items
				.filter((item: any): item is TrustedMcpServersQuickPickItem => item.type !== 'separator')
				.map((i: any) => i.mcpServer);

			const selectedServers = new Set(quickPick.selectedItems.map((i: any) => i.mcpServer));

			for (const mcpServer of allServers) {
				const isAllowed = selectedServers.has(mcpServer);
				accountQuery.mcpServer(mcpServer.id).setAccessAllowed(isAllowed, mcpServer.name);
			}
		}));
		disposableStore.add(quickPick.onDidHide(() => disposableStore.dispose()));
		disposableStore.add(quickPick.onDidCustom(() => quickPick.hide()));
		disposableStore.add(quickPick.onDidTriggerItemButton((e: any) =>
			this._commandService.executeCommand('_manageAccountPreferencesForMcpServer', e.item.mcpServer.id, accountQuery.providerId)
		));

		return quickPick;
	}

	//#endregion
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/authentication/browser/actions/signOutOfAccountAction.ts]---
Location: vscode-main/src/vs/workbench/contrib/authentication/browser/actions/signOutOfAccountAction.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Severity from '../../../../../base/common/severity.js';
import { localize } from '../../../../../nls.js';
import { Action2 } from '../../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { IAuthenticationAccessService } from '../../../../services/authentication/browser/authenticationAccessService.js';
import { IAuthenticationUsageService } from '../../../../services/authentication/browser/authenticationUsageService.js';
import { IAuthenticationService } from '../../../../services/authentication/common/authentication.js';

export class SignOutOfAccountAction extends Action2 {
	constructor() {
		super({
			id: '_signOutOfAccount',
			title: localize('signOutOfAccount', "Sign out of account"),
			f1: false
		});
	}

	override async run(accessor: ServicesAccessor, { providerId, accountLabel }: { providerId: string; accountLabel: string }): Promise<void> {
		const authenticationService = accessor.get(IAuthenticationService);
		const authenticationUsageService = accessor.get(IAuthenticationUsageService);
		const authenticationAccessService = accessor.get(IAuthenticationAccessService);
		const dialogService = accessor.get(IDialogService);

		if (!providerId || !accountLabel) {
			throw new Error('Invalid arguments. Expected: { providerId: string; accountLabel: string }');
		}

		const allSessions = await authenticationService.getSessions(providerId);
		const sessions = allSessions.filter(s => s.account.label === accountLabel);

		const accountUsages = authenticationUsageService.readAccountUsages(providerId, accountLabel);

		const { confirmed } = await dialogService.confirm({
			type: Severity.Info,
			message: accountUsages.length
				? localize('signOutMessage', "The account '{0}' has been used by: \n\n{1}\n\n Sign out from these extensions?", accountLabel, accountUsages.map(usage => usage.extensionName).join('\n'))
				: localize('signOutMessageSimple', "Sign out of '{0}'?", accountLabel),
			primaryButton: localize({ key: 'signOut', comment: ['&& denotes a mnemonic'] }, "&&Sign Out")
		});

		if (confirmed) {
			const removeSessionPromises = sessions.map(session => authenticationService.removeSession(providerId, session.id));
			await Promise.all(removeSessionPromises);
			authenticationUsageService.removeAccountUsage(providerId, accountLabel);
			authenticationAccessService.removeAllowedExtensions(providerId, accountLabel);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bracketPairColorizer2Telemetry/browser/bracketPairColorizer2Telemetry.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/bracketPairColorizer2Telemetry/browser/bracketPairColorizer2Telemetry.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../base/common/errors.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Extensions as WorkbenchExtensions, IWorkbenchContributionsRegistry } from '../../../common/contributions.js';
import { IExtensionsWorkbenchService } from '../../extensions/common/extensions.js';
import { EnablementState } from '../../../services/extensionManagement/common/extensionManagement.js';
import { LifecyclePhase } from '../../../services/lifecycle/common/lifecycle.js';

class BracketPairColorizer2TelemetryContribution {
	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IExtensionsWorkbenchService private readonly extensionsWorkbenchService: IExtensionsWorkbenchService,
		@ITelemetryService private readonly telemetryService: ITelemetryService
	) {
		this.init().catch(onUnexpectedError);
	}

	private async init(): Promise<void> {
		const bracketPairColorizerId = 'coenraads.bracket-pair-colorizer-2';

		await this.extensionsWorkbenchService.queryLocal();
		const extension = this.extensionsWorkbenchService.installed.find(e => e.identifier.id === bracketPairColorizerId);
		if (
			!extension ||
			((extension.enablementState !== EnablementState.EnabledGlobally) &&
				(extension.enablementState !== EnablementState.EnabledWorkspace))
		) {
			return;
		}

		const nativeBracketPairColorizationEnabledKey = 'editor.bracketPairColorization.enabled';
		const nativeColorizationEnabled = !!this.configurationService.getValue(nativeBracketPairColorizationEnabledKey);

		type BracketPairColorizer2InstalledClassification = {
			owner: 'hediet';
			nativeColorizationEnabled: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Whether or not built-in bracket pair colorization is being used' };
			comment: 'We use this to understand how many users have the bracket pair colorizer extension installed (and how many of them have native bracket pair colorization enabled), as the extension does not do anything if native bracket pair colorization is enabled.';
		};
		type BracketPairColorizer2Event = {
			nativeColorizationEnabled: boolean;
		};
		this.telemetryService.publicLog2<BracketPairColorizer2Event, BracketPairColorizer2InstalledClassification>('bracketPairColorizerTwoUsage', {
			nativeColorizationEnabled
		});
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench).registerWorkbenchContribution(BracketPairColorizer2TelemetryContribution, LifecyclePhase.Restored);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/bulkCellEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/bulkCellEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { groupBy } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { compare } from '../../../../base/common/strings.js';
import { isObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ResourceEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { WorkspaceEditMetadata } from '../../../../editor/common/languages.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { UndoRedoGroup, UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';
import { getNotebookEditorFromEditorPane } from '../../notebook/browser/notebookBrowser.js';
import { CellUri, ICellPartialMetadataEdit, ICellReplaceEdit, IDocumentMetadataEdit, ISelectionState, IWorkspaceNotebookCellEdit, SelectionStateType } from '../../notebook/common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../notebook/common/notebookEditorModelResolverService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';

export class ResourceNotebookCellEdit extends ResourceEdit implements IWorkspaceNotebookCellEdit {

	static is(candidate: unknown): candidate is IWorkspaceNotebookCellEdit {
		if (candidate instanceof ResourceNotebookCellEdit) {
			return true;
		}
		return URI.isUri((<IWorkspaceNotebookCellEdit>candidate).resource)
			&& isObject((<IWorkspaceNotebookCellEdit>candidate).cellEdit);
	}

	static lift(edit: IWorkspaceNotebookCellEdit): ResourceNotebookCellEdit {
		if (edit instanceof ResourceNotebookCellEdit) {
			return edit;
		}
		return new ResourceNotebookCellEdit(edit.resource, edit.cellEdit, edit.notebookVersionId, edit.metadata);
	}

	constructor(
		readonly resource: URI,
		readonly cellEdit: ICellPartialMetadataEdit | IDocumentMetadataEdit | ICellReplaceEdit,
		readonly notebookVersionId: number | undefined = undefined,
		metadata?: WorkspaceEditMetadata
	) {
		super(metadata);
	}
}

export class BulkCellEdits {

	constructor(
		private readonly _undoRedoGroup: UndoRedoGroup,
		undoRedoSource: UndoRedoSource | undefined,
		private readonly _progress: IProgress<void>,
		private readonly _token: CancellationToken,
		private readonly _edits: ResourceNotebookCellEdit[],
		@IEditorService private readonly _editorService: IEditorService,
		@INotebookEditorModelResolverService private readonly _notebookModelService: INotebookEditorModelResolverService,
	) {
		this._edits = this._edits.map(e => {
			if (e.resource.scheme === CellUri.scheme) {
				const uri = CellUri.parse(e.resource)?.notebook;
				if (!uri) {
					throw new Error(`Invalid notebook URI: ${e.resource}`);
				}

				return new ResourceNotebookCellEdit(uri, e.cellEdit, e.notebookVersionId, e.metadata);
			} else {
				return e;
			}
		});
	}

	async apply(): Promise<readonly URI[]> {
		const resources: URI[] = [];
		const editsByNotebook = groupBy(this._edits, (a, b) => compare(a.resource.toString(), b.resource.toString()));

		for (const group of editsByNotebook) {
			if (this._token.isCancellationRequested) {
				break;
			}
			const [first] = group;
			const ref = await this._notebookModelService.resolve(first.resource);

			// check state
			if (typeof first.notebookVersionId === 'number' && ref.object.notebook.versionId !== first.notebookVersionId) {
				ref.dispose();
				throw new Error(`Notebook '${first.resource}' has changed in the meantime`);
			}

			// apply edits
			const edits = group.map(entry => entry.cellEdit);
			const computeUndo = !ref.object.isReadonly();
			const editor = getNotebookEditorFromEditorPane(this._editorService.activeEditorPane);
			const initialSelectionState: ISelectionState | undefined = editor?.textModel?.uri.toString() === ref.object.notebook.uri.toString() ? {
				kind: SelectionStateType.Index,
				focus: editor.getFocus(),
				selections: editor.getSelections()
			} : undefined;
			ref.object.notebook.applyEdits(edits, true, initialSelectionState, () => undefined, this._undoRedoGroup, computeUndo);
			ref.dispose();

			this._progress.report(undefined);

			resources.push(first.resource);
		}

		return resources;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/bulkEditService.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/bulkEditService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { LinkedList } from '../../../../base/common/linkedList.js';
import { ResourceMap, ResourceSet } from '../../../../base/common/map.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor, isCodeEditor, isDiffEditor } from '../../../../editor/browser/editorBrowser.js';
import { IBulkEditOptions, IBulkEditPreviewHandler, IBulkEditResult, IBulkEditService, ResourceEdit, ResourceFileEdit, ResourceTextEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { WorkspaceEdit } from '../../../../editor/common/languages.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProgress, IProgressStep, Progress } from '../../../../platform/progress/common/progress.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { UndoRedoGroup, UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';
import { BulkCellEdits, ResourceNotebookCellEdit } from './bulkCellEdits.js';
import { BulkFileEdits } from './bulkFileEdits.js';
import { BulkTextEdits } from './bulkTextEdits.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { ILifecycleService, ShutdownReason } from '../../../services/lifecycle/common/lifecycle.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { OpaqueEdits, ResourceAttachmentEdit } from './opaqueEdits.js';
import { TextModelEditSource } from '../../../../editor/common/textModelEditSource.js';
import { isMacintosh } from '../../../../base/common/platform.js';

function liftEdits(edits: ResourceEdit[]): ResourceEdit[] {
	return edits.map(edit => {
		if (ResourceTextEdit.is(edit)) {
			return ResourceTextEdit.lift(edit);
		}
		if (ResourceFileEdit.is(edit)) {
			return ResourceFileEdit.lift(edit);
		}
		if (ResourceNotebookCellEdit.is(edit)) {
			return ResourceNotebookCellEdit.lift(edit);
		}

		if (ResourceAttachmentEdit.is(edit)) {
			return ResourceAttachmentEdit.lift(edit);
		}

		throw new Error('Unsupported edit');
	});
}

class BulkEdit {

	constructor(
		private readonly _label: string | undefined,
		private readonly _code: string | undefined,
		private readonly _editor: ICodeEditor | undefined,
		private readonly _progress: IProgress<IProgressStep>,
		private readonly _token: CancellationToken,
		private readonly _edits: ResourceEdit[],
		private readonly _undoRedoGroup: UndoRedoGroup,
		private readonly _undoRedoSource: UndoRedoSource | undefined,
		private readonly _confirmBeforeUndo: boolean,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
	) {

	}

	ariaMessage(): string {

		const otherResources = new ResourceMap<boolean>();
		const textEditResources = new ResourceMap<boolean>();
		let textEditCount = 0;
		for (const edit of this._edits) {
			if (edit instanceof ResourceTextEdit) {
				textEditCount += 1;
				textEditResources.set(edit.resource, true);
			} else if (edit instanceof ResourceFileEdit) {
				otherResources.set(edit.oldResource ?? edit.newResource!, true);
			}
		}
		if (this._edits.length === 0) {
			return localize('summary.0', "Made no edits");
		} else if (otherResources.size === 0) {
			if (textEditCount > 1 && textEditResources.size > 1) {
				return localize('summary.nm', "Made {0} text edits in {1} files", textEditCount, textEditResources.size);
			} else {
				return localize('summary.n0', "Made {0} text edits in one file", textEditCount);
			}
		} else {
			return localize('summary.textFiles', "Made {0} text edits in {1} files, also created or deleted {2} files", textEditCount, textEditResources.size, otherResources.size);
		}
	}

	async perform(reason?: TextModelEditSource): Promise<readonly URI[]> {

		if (this._edits.length === 0) {
			return [];
		}

		const ranges: number[] = [1];
		for (let i = 1; i < this._edits.length; i++) {
			if (Object.getPrototypeOf(this._edits[i - 1]) === Object.getPrototypeOf(this._edits[i])) {
				ranges[ranges.length - 1]++;
			} else {
				ranges.push(1);
			}
		}

		// Show infinte progress when there is only 1 item since we do not know how long it takes
		const increment = this._edits.length > 1 ? 0 : undefined;
		this._progress.report({ increment, total: 100 });
		// Increment by percentage points since progress API expects that
		const progress: IProgress<void> = { report: _ => this._progress.report({ increment: 100 / this._edits.length }) };

		const resources: (readonly URI[])[] = [];
		let index = 0;
		for (const range of ranges) {
			if (this._token.isCancellationRequested) {
				break;
			}
			const group = this._edits.slice(index, index + range);
			if (group[0] instanceof ResourceFileEdit) {
				resources.push(await this._performFileEdits(<ResourceFileEdit[]>group, this._undoRedoGroup, this._undoRedoSource, this._confirmBeforeUndo, progress));
			} else if (group[0] instanceof ResourceTextEdit) {
				resources.push(await this._performTextEdits(<ResourceTextEdit[]>group, this._undoRedoGroup, this._undoRedoSource, progress, reason));
			} else if (group[0] instanceof ResourceNotebookCellEdit) {
				resources.push(await this._performCellEdits(<ResourceNotebookCellEdit[]>group, this._undoRedoGroup, this._undoRedoSource, progress));
			} else if (group[0] instanceof ResourceAttachmentEdit) {
				resources.push(await this._performOpaqueEdits(<ResourceAttachmentEdit[]>group, this._undoRedoGroup, this._undoRedoSource, progress));
			} else {
				console.log('UNKNOWN EDIT');
			}
			index = index + range;
		}

		return resources.flat();
	}

	private async _performFileEdits(edits: ResourceFileEdit[], undoRedoGroup: UndoRedoGroup, undoRedoSource: UndoRedoSource | undefined, confirmBeforeUndo: boolean, progress: IProgress<void>): Promise<readonly URI[]> {
		this._logService.debug('_performFileEdits', JSON.stringify(edits));
		const model = this._instaService.createInstance(BulkFileEdits, this._label || localize('workspaceEdit', "Workspace Edit"), this._code || 'undoredo.workspaceEdit', undoRedoGroup, undoRedoSource, confirmBeforeUndo, progress, this._token, edits);
		return await model.apply();
	}

	private async _performTextEdits(edits: ResourceTextEdit[], undoRedoGroup: UndoRedoGroup, undoRedoSource: UndoRedoSource | undefined, progress: IProgress<void>, reason: TextModelEditSource | undefined): Promise<readonly URI[]> {
		this._logService.debug('_performTextEdits', JSON.stringify(edits));
		const model = this._instaService.createInstance(BulkTextEdits, this._label || localize('workspaceEdit', "Workspace Edit"), this._code || 'undoredo.workspaceEdit', this._editor, undoRedoGroup, undoRedoSource, progress, this._token, edits);
		return await model.apply(reason);
	}

	private async _performCellEdits(edits: ResourceNotebookCellEdit[], undoRedoGroup: UndoRedoGroup, undoRedoSource: UndoRedoSource | undefined, progress: IProgress<void>): Promise<readonly URI[]> {
		this._logService.debug('_performCellEdits', JSON.stringify(edits));
		const model = this._instaService.createInstance(BulkCellEdits, undoRedoGroup, undoRedoSource, progress, this._token, edits);
		return await model.apply();
	}

	private async _performOpaqueEdits(edits: ResourceAttachmentEdit[], undoRedoGroup: UndoRedoGroup, undoRedoSource: UndoRedoSource | undefined, progress: IProgress<void>): Promise<readonly URI[]> {
		this._logService.debug('_performOpaqueEdits', JSON.stringify(edits));
		const model = this._instaService.createInstance(OpaqueEdits, undoRedoGroup, undoRedoSource, progress, this._token, edits);
		return await model.apply();
	}
}

export class BulkEditService implements IBulkEditService {

	declare readonly _serviceBrand: undefined;

	private readonly _activeUndoRedoGroups = new LinkedList<UndoRedoGroup>();
	private _previewHandler?: IBulkEditPreviewHandler;

	constructor(
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ILogService private readonly _logService: ILogService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILifecycleService private readonly _lifecycleService: ILifecycleService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IWorkingCopyService private readonly _workingCopyService: IWorkingCopyService,
		@IConfigurationService private readonly _configService: IConfigurationService,
	) { }

	setPreviewHandler(handler: IBulkEditPreviewHandler): IDisposable {
		this._previewHandler = handler;
		return toDisposable(() => {
			if (this._previewHandler === handler) {
				this._previewHandler = undefined;
			}
		});
	}

	hasPreviewHandler(): boolean {
		return Boolean(this._previewHandler);
	}

	async apply(editsIn: ResourceEdit[] | WorkspaceEdit, options?: IBulkEditOptions): Promise<IBulkEditResult> {
		let edits = liftEdits(Array.isArray(editsIn) ? editsIn : editsIn.edits);

		if (edits.length === 0) {
			return { ariaSummary: localize('nothing', "Made no edits"), isApplied: false };
		}

		if (this._previewHandler && (options?.showPreview || edits.some(value => value.metadata?.needsConfirmation))) {
			edits = await this._previewHandler(edits, options);
		}

		let codeEditor = options?.editor;
		// try to find code editor
		if (!codeEditor) {
			const candidate = this._editorService.activeTextEditorControl;
			if (isCodeEditor(candidate)) {
				codeEditor = candidate;
			} else if (isDiffEditor(candidate)) {
				codeEditor = candidate.getModifiedEditor();
			}
		}

		if (codeEditor && codeEditor.getOption(EditorOption.readOnly)) {
			// If the code editor is readonly still allow bulk edits to be applied #68549
			codeEditor = undefined;
		}

		// undo-redo-group: if a group id is passed then try to find it
		// in the list of active edits. otherwise (or when not found)
		// create a separate undo-redo-group
		let undoRedoGroup: UndoRedoGroup | undefined;
		let undoRedoGroupRemove = () => { };
		if (typeof options?.undoRedoGroupId === 'number') {
			for (const candidate of this._activeUndoRedoGroups) {
				if (candidate.id === options.undoRedoGroupId) {
					undoRedoGroup = candidate;
					break;
				}
			}
		}
		if (!undoRedoGroup) {
			undoRedoGroup = new UndoRedoGroup();
			undoRedoGroupRemove = this._activeUndoRedoGroups.push(undoRedoGroup);
		}

		const label = options?.quotableLabel || options?.label;
		const bulkEdit = this._instaService.createInstance(
			BulkEdit,
			label,
			options?.code,
			codeEditor,
			options?.progress ?? Progress.None,
			options?.token ?? CancellationToken.None,
			edits,
			undoRedoGroup,
			options?.undoRedoSource,
			!!options?.confirmBeforeUndo
		);

		let listener: IDisposable | undefined;
		try {
			listener = this._lifecycleService.onBeforeShutdown(e => e.veto(this._shouldVeto(label, e.reason), 'veto.blukEditService'));
			const resources = await bulkEdit.perform(options?.reason);

			// when enabled (option AND setting) loop over all dirty working copies and trigger save
			// for those that were involved in this bulk edit operation.
			if (options?.respectAutoSaveConfig && this._configService.getValue(autoSaveSetting) === true && resources.length > 1) {
				await this._saveAll(resources);
			}

			return { ariaSummary: bulkEdit.ariaMessage(), isApplied: edits.length > 0 };
		} catch (err) {
			// console.log('apply FAILED');
			// console.log(err);
			this._logService.error(err);
			throw err;
		} finally {
			listener?.dispose();
			undoRedoGroupRemove();
		}
	}

	private async _saveAll(resources: readonly URI[]) {
		const set = new ResourceSet(resources);
		const saves = this._workingCopyService.dirtyWorkingCopies.map(async (copy) => {
			if (set.has(copy.resource)) {
				await copy.save();
			}
		});

		const result = await Promise.allSettled(saves);
		for (const item of result) {
			if (item.status === 'rejected') {
				this._logService.warn(item.reason);
			}
		}
	}

	private async _shouldVeto(label: string | undefined, reason: ShutdownReason): Promise<boolean> {
		let message: string;
		switch (reason) {
			case ShutdownReason.CLOSE:
				message = localize('closeTheWindow.message', "Are you sure you want to close the window?");
				break;
			case ShutdownReason.LOAD:
				message = localize('changeWorkspace.message', "Are you sure you want to change the workspace?");
				break;
			case ShutdownReason.RELOAD:
				message = localize('reloadTheWindow.message', "Are you sure you want to reload the window?");
				break;
			default:
				message = isMacintosh ? localize('quitMessageMac', "Are you sure you want to quit?") : localize('quitMessage', "Are you sure you want to exit?");
				break;
		}

		const result = await this._dialogService.confirm({
			message,
			detail: localize('areYouSureQuiteBulkEdit.detail', "'{0}' is in progress.", label || localize('fileOperation', "File operation")),
		});

		return !result.confirmed;
	}
}

registerSingleton(IBulkEditService, BulkEditService, InstantiationType.Delayed);

const autoSaveSetting = 'files.refactoring.autoSave';

Registry.as<IConfigurationRegistry>(Extensions.Configuration).registerConfiguration({
	id: 'files',
	properties: {
		[autoSaveSetting]: {
			description: localize('refactoring.autoSave', "Controls if files that were part of a refactoring are saved automatically"),
			default: true,
			type: 'boolean'
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/bulkFileEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/bulkFileEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { WorkspaceFileEditOptions } from '../../../../editor/common/languages.js';
import { IFileService, FileSystemProviderCapabilities, IFileContent, IFileStatWithMetadata } from '../../../../platform/files/common/files.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IWorkingCopyFileService, IFileOperationUndoRedoInfo, IMoveOperation, ICopyOperation, IDeleteOperation, ICreateOperation, ICreateFileOperation } from '../../../services/workingCopy/common/workingCopyFileService.js';
import { IWorkspaceUndoRedoElement, UndoRedoElementType, IUndoRedoService, UndoRedoGroup, UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';
import { URI } from '../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { ResourceFileEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { Schemas } from '../../../../base/common/network.js';

interface IFileOperation {
	uris: URI[];
	perform(token: CancellationToken): Promise<IFileOperation>;
}

class Noop implements IFileOperation {
	readonly uris = [];
	async perform() { return this; }
	toString(): string {
		return '(noop)';
	}
}

class RenameEdit {
	readonly type = 'rename';
	constructor(
		readonly newUri: URI,
		readonly oldUri: URI,
		readonly options: WorkspaceFileEditOptions
	) { }
}

class RenameOperation implements IFileOperation {

	constructor(
		private readonly _edits: RenameEdit[],
		private readonly _undoRedoInfo: IFileOperationUndoRedoInfo,
		@IWorkingCopyFileService private readonly _workingCopyFileService: IWorkingCopyFileService,
		@IFileService private readonly _fileService: IFileService,
	) { }

	get uris() {
		return this._edits.flatMap(edit => [edit.newUri, edit.oldUri]);
	}

	async perform(token: CancellationToken): Promise<IFileOperation> {

		const moves: IMoveOperation[] = [];
		const undoes: RenameEdit[] = [];
		for (const edit of this._edits) {
			// check: not overwriting, but ignoring, and the target file exists
			const skip = edit.options.overwrite === undefined && edit.options.ignoreIfExists && await this._fileService.exists(edit.newUri);
			if (!skip) {
				moves.push({
					file: { source: edit.oldUri, target: edit.newUri },
					overwrite: edit.options.overwrite
				});

				// reverse edit
				undoes.push(new RenameEdit(edit.oldUri, edit.newUri, edit.options));
			}
		}

		if (moves.length === 0) {
			return new Noop();
		}

		await this._workingCopyFileService.move(moves, token, this._undoRedoInfo);
		return new RenameOperation(undoes, { isUndoing: true }, this._workingCopyFileService, this._fileService);
	}

	toString(): string {
		return `(rename ${this._edits.map(edit => `${edit.oldUri} to ${edit.newUri}`).join(', ')})`;
	}
}

class CopyEdit {
	readonly type = 'copy';
	constructor(
		readonly newUri: URI,
		readonly oldUri: URI,
		readonly options: WorkspaceFileEditOptions
	) { }
}

class CopyOperation implements IFileOperation {

	constructor(
		private readonly _edits: CopyEdit[],
		private readonly _undoRedoInfo: IFileOperationUndoRedoInfo,
		@IWorkingCopyFileService private readonly _workingCopyFileService: IWorkingCopyFileService,
		@IFileService private readonly _fileService: IFileService,
		@IInstantiationService private readonly _instaService: IInstantiationService
	) { }

	get uris() {
		return this._edits.flatMap(edit => [edit.newUri, edit.oldUri]);
	}

	async perform(token: CancellationToken): Promise<IFileOperation> {

		// (1) create copy operations, remove noops
		const copies: ICopyOperation[] = [];
		for (const edit of this._edits) {
			//check: not overwriting, but ignoring, and the target file exists
			const skip = edit.options.overwrite === undefined && edit.options.ignoreIfExists && await this._fileService.exists(edit.newUri);
			if (!skip) {
				copies.push({ file: { source: edit.oldUri, target: edit.newUri }, overwrite: edit.options.overwrite });
			}
		}

		if (copies.length === 0) {
			return new Noop();
		}

		// (2) perform the actual copy and use the return stats to build undo edits
		const stats = await this._workingCopyFileService.copy(copies, token, this._undoRedoInfo);
		const undoes: DeleteEdit[] = [];

		for (let i = 0; i < stats.length; i++) {
			const stat = stats[i];
			const edit = this._edits[i];
			undoes.push(new DeleteEdit(stat.resource, { recursive: true, folder: this._edits[i].options.folder || stat.isDirectory, ...edit.options }, false));
		}

		return this._instaService.createInstance(DeleteOperation, undoes, { isUndoing: true });
	}

	toString(): string {
		return `(copy ${this._edits.map(edit => `${edit.oldUri} to ${edit.newUri}`).join(', ')})`;
	}
}

class CreateEdit {
	readonly type = 'create';
	constructor(
		readonly newUri: URI,
		readonly options: WorkspaceFileEditOptions,
		readonly contents: VSBuffer | undefined,
	) { }
}

class CreateOperation implements IFileOperation {

	constructor(
		private readonly _edits: CreateEdit[],
		private readonly _undoRedoInfo: IFileOperationUndoRedoInfo,
		@IFileService private readonly _fileService: IFileService,
		@IWorkingCopyFileService private readonly _workingCopyFileService: IWorkingCopyFileService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ITextFileService private readonly _textFileService: ITextFileService
	) { }

	get uris() {
		return this._edits.map(edit => edit.newUri);
	}

	async perform(token: CancellationToken): Promise<IFileOperation> {

		const folderCreates: ICreateOperation[] = [];
		const fileCreates: ICreateFileOperation[] = [];
		const undoes: DeleteEdit[] = [];

		for (const edit of this._edits) {
			if (edit.newUri.scheme === Schemas.untitled) {
				continue; // ignore, will be handled by a later edit
			}
			if (edit.options.overwrite === undefined && edit.options.ignoreIfExists && await this._fileService.exists(edit.newUri)) {
				continue; // not overwriting, but ignoring, and the target file exists
			}
			if (edit.options.folder) {
				folderCreates.push({ resource: edit.newUri });
			} else {
				// If the contents are part of the edit they include the encoding, thus use them. Otherwise get the encoding for a new empty file.
				const encodedReadable = typeof edit.contents !== 'undefined' ? edit.contents : await this._textFileService.getEncodedReadable(edit.newUri);
				fileCreates.push({ resource: edit.newUri, contents: encodedReadable, overwrite: edit.options.overwrite });
			}
			undoes.push(new DeleteEdit(edit.newUri, edit.options, !edit.options.folder && !edit.contents));
		}

		if (folderCreates.length === 0 && fileCreates.length === 0) {
			return new Noop();
		}

		await this._workingCopyFileService.createFolder(folderCreates, token, this._undoRedoInfo);
		await this._workingCopyFileService.create(fileCreates, token, this._undoRedoInfo);

		return this._instaService.createInstance(DeleteOperation, undoes, { isUndoing: true });
	}

	toString(): string {
		return `(create ${this._edits.map(edit => edit.options.folder ? `folder ${edit.newUri}` : `file ${edit.newUri} with ${edit.contents?.byteLength || 0} bytes`).join(', ')})`;
	}
}

class DeleteEdit {
	readonly type = 'delete';
	constructor(
		readonly oldUri: URI,
		readonly options: WorkspaceFileEditOptions,
		readonly undoesCreate: boolean,
	) { }
}

class DeleteOperation implements IFileOperation {

	constructor(
		private _edits: DeleteEdit[],
		private readonly _undoRedoInfo: IFileOperationUndoRedoInfo,
		@IWorkingCopyFileService private readonly _workingCopyFileService: IWorkingCopyFileService,
		@IFileService private readonly _fileService: IFileService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@ILogService private readonly _logService: ILogService
	) { }

	get uris() {
		return this._edits.map(edit => edit.oldUri);
	}

	async perform(token: CancellationToken): Promise<IFileOperation> {
		// delete file

		const deletes: IDeleteOperation[] = [];
		const undoes: CreateEdit[] = [];

		for (const edit of this._edits) {
			let fileStat: IFileStatWithMetadata | undefined;
			try {
				fileStat = await this._fileService.resolve(edit.oldUri, { resolveMetadata: true });
			} catch (err) {
				if (!edit.options.ignoreIfNotExists) {
					throw new Error(`${edit.oldUri} does not exist and can not be deleted`);
				}
				continue;
			}

			deletes.push({
				resource: edit.oldUri,
				recursive: edit.options.recursive,
				useTrash: !edit.options.skipTrashBin && this._fileService.hasCapability(edit.oldUri, FileSystemProviderCapabilities.Trash) && this._configurationService.getValue<boolean>('files.enableTrash')
			});


			// read file contents for undo operation. when a file is too large it won't be restored
			let fileContent: IFileContent | undefined;
			let fileContentExceedsMaxSize = false;
			if (!edit.undoesCreate && !edit.options.folder) {
				fileContentExceedsMaxSize = typeof edit.options.maxSize === 'number' && fileStat.size > edit.options.maxSize;
				if (!fileContentExceedsMaxSize) {
					try {
						fileContent = await this._fileService.readFile(edit.oldUri);
					} catch (err) {
						this._logService.error(err);
					}
				}
			}
			if (!fileContentExceedsMaxSize) {
				undoes.push(new CreateEdit(edit.oldUri, edit.options, fileContent?.value));
			}
		}

		if (deletes.length === 0) {
			return new Noop();
		}

		await this._workingCopyFileService.delete(deletes, token, this._undoRedoInfo);

		if (undoes.length === 0) {
			return new Noop();
		}
		return this._instaService.createInstance(CreateOperation, undoes, { isUndoing: true });
	}

	toString(): string {
		return `(delete ${this._edits.map(edit => edit.oldUri).join(', ')})`;
	}
}

class FileUndoRedoElement implements IWorkspaceUndoRedoElement {

	readonly type = UndoRedoElementType.Workspace;

	readonly resources: readonly URI[];

	constructor(
		readonly label: string,
		readonly code: string,
		readonly operations: IFileOperation[],
		readonly confirmBeforeUndo: boolean
	) {
		this.resources = operations.flatMap(op => op.uris);
	}

	async undo(): Promise<void> {
		await this._reverse();
	}

	async redo(): Promise<void> {
		await this._reverse();
	}

	private async _reverse() {
		for (let i = 0; i < this.operations.length; i++) {
			const op = this.operations[i];
			const undo = await op.perform(CancellationToken.None);
			this.operations[i] = undo;
		}
	}

	toString(): string {
		return this.operations.map(op => String(op)).join(', ');
	}
}

export class BulkFileEdits {

	constructor(
		private readonly _label: string,
		private readonly _code: string,
		private readonly _undoRedoGroup: UndoRedoGroup,
		private readonly _undoRedoSource: UndoRedoSource | undefined,
		private readonly _confirmBeforeUndo: boolean,
		private readonly _progress: IProgress<void>,
		private readonly _token: CancellationToken,
		private readonly _edits: ResourceFileEdit[],
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
	) { }

	async apply(): Promise<readonly URI[]> {
		const undoOperations: IFileOperation[] = [];
		const undoRedoInfo = { undoRedoGroupId: this._undoRedoGroup.id };

		const edits: Array<RenameEdit | CopyEdit | DeleteEdit | CreateEdit> = [];
		for (const edit of this._edits) {
			if (edit.newResource && edit.oldResource && !edit.options?.copy) {
				edits.push(new RenameEdit(edit.newResource, edit.oldResource, edit.options ?? {}));
			} else if (edit.newResource && edit.oldResource && edit.options?.copy) {
				edits.push(new CopyEdit(edit.newResource, edit.oldResource, edit.options ?? {}));
			} else if (!edit.newResource && edit.oldResource) {
				edits.push(new DeleteEdit(edit.oldResource, edit.options ?? {}, false));
			} else if (edit.newResource && !edit.oldResource) {
				edits.push(new CreateEdit(edit.newResource, edit.options ?? {}, await edit.options.contents));
			}
		}

		if (edits.length === 0) {
			return [];
		}

		const groups: Array<RenameEdit | CopyEdit | DeleteEdit | CreateEdit>[] = [];
		groups[0] = [edits[0]];

		for (let i = 1; i < edits.length; i++) {
			const edit = edits[i];
			const lastGroup = groups.at(-1);
			if (lastGroup?.[0].type === edit.type) {
				lastGroup.push(edit);
			} else {
				groups.push([edit]);
			}
		}

		for (const group of groups) {

			if (this._token.isCancellationRequested) {
				break;
			}

			let op: IFileOperation | undefined;
			switch (group[0].type) {
				case 'rename':
					op = this._instaService.createInstance(RenameOperation, <RenameEdit[]>group, undoRedoInfo);
					break;
				case 'copy':
					op = this._instaService.createInstance(CopyOperation, <CopyEdit[]>group, undoRedoInfo);
					break;
				case 'delete':
					op = this._instaService.createInstance(DeleteOperation, <DeleteEdit[]>group, undoRedoInfo);
					break;
				case 'create':
					op = this._instaService.createInstance(CreateOperation, <CreateEdit[]>group, undoRedoInfo);
					break;
			}

			if (op) {
				const undoOp = await op.perform(this._token);
				undoOperations.push(undoOp);
			}
			this._progress.report(undefined);
		}

		const undoRedoElement = new FileUndoRedoElement(this._label, this._code, undoOperations, this._confirmBeforeUndo);
		this._undoRedoService.pushElement(undoRedoElement, this._undoRedoGroup, this._undoRedoSource);
		return undoRedoElement.resources;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/bulkTextEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/bulkTextEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { dispose, IDisposable, IReference } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditOperation, ISingleEditOperation } from '../../../../editor/common/core/editOperation.js';
import { Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { EndOfLineSequence, ITextModel } from '../../../../editor/common/model.js';
import { ITextModelService, IResolvedTextEditorModel } from '../../../../editor/common/services/resolverService.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IEditorWorkerService } from '../../../../editor/common/services/editorWorker.js';
import { IUndoRedoService, UndoRedoGroup, UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';
import { SingleModelEditStackElement, MultiModelEditStackElement } from '../../../../editor/common/model/editStack.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ResourceTextEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { SnippetController2 } from '../../../../editor/contrib/snippet/browser/snippetController2.js';
import { SnippetParser } from '../../../../editor/contrib/snippet/browser/snippetParser.js';
import { ISnippetEdit } from '../../../../editor/contrib/snippet/browser/snippetSession.js';
import { TextModelEditSource } from '../../../../editor/common/textModelEditSource.js';

type ValidationResult = { canApply: true } | { canApply: false; reason: URI };

type ISingleSnippetEditOperation = ISingleEditOperation & { insertAsSnippet?: boolean; keepWhitespace?: boolean };

class ModelEditTask implements IDisposable {

	readonly model: ITextModel;

	private _expectedModelVersionId: number | undefined;
	protected _edits: ISingleSnippetEditOperation[];
	protected _newEol: EndOfLineSequence | undefined;

	constructor(private readonly _modelReference: IReference<IResolvedTextEditorModel>) {
		this.model = this._modelReference.object.textEditorModel;
		this._edits = [];
	}

	dispose() {
		this._modelReference.dispose();
	}

	isNoOp() {
		if (this._edits.length > 0) {
			// contains textual edits
			return false;
		}
		if (this._newEol !== undefined && this._newEol !== this.model.getEndOfLineSequence()) {
			// contains an eol change that is a real change
			return false;
		}
		return true;
	}

	addEdit(resourceEdit: ResourceTextEdit): void {
		this._expectedModelVersionId = resourceEdit.versionId;
		const { textEdit } = resourceEdit;

		if (typeof textEdit.eol === 'number') {
			// honor eol-change
			this._newEol = textEdit.eol;
		}
		if (!textEdit.range && !textEdit.text) {
			// lacks both a range and the text
			return;
		}
		if (Range.isEmpty(textEdit.range) && !textEdit.text) {
			// no-op edit (replace empty range with empty text)
			return;
		}

		// create edit operation
		let range: Range;
		if (!textEdit.range) {
			range = this.model.getFullModelRange();
		} else {
			range = Range.lift(textEdit.range);
		}
		this._edits.push({ ...EditOperation.replaceMove(range, textEdit.text), insertAsSnippet: textEdit.insertAsSnippet, keepWhitespace: textEdit.keepWhitespace });
	}

	validate(): ValidationResult {
		if (typeof this._expectedModelVersionId === 'undefined' || this.model.getVersionId() === this._expectedModelVersionId) {
			return { canApply: true };
		}
		return { canApply: false, reason: this.model.uri };
	}

	getBeforeCursorState(): Selection[] | null {
		return null;
	}

	apply(reason?: TextModelEditSource): void {
		if (this._edits.length > 0) {
			this._edits = this._edits
				.map(this._transformSnippetStringToInsertText, this) // no editor -> no snippet mode
				.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
			this.model.pushEditOperations(null, this._edits, () => null, undefined, reason);
		}
		if (this._newEol !== undefined) {
			this.model.pushEOL(this._newEol);
		}
	}

	protected _transformSnippetStringToInsertText(edit: ISingleSnippetEditOperation): ISingleSnippetEditOperation {
		// transform a snippet edit (and only those) into a normal text edit
		// for that we need to parse the snippet and get its actual text, e.g without placeholder
		// or variable syntaxes
		if (!edit.insertAsSnippet) {
			return edit;
		}
		if (!edit.text) {
			return edit;
		}
		const text = SnippetParser.asInsertText(edit.text);
		return { ...edit, insertAsSnippet: false, text };
	}
}

class EditorEditTask extends ModelEditTask {

	private readonly _editor: ICodeEditor;

	constructor(modelReference: IReference<IResolvedTextEditorModel>, editor: ICodeEditor) {
		super(modelReference);
		this._editor = editor;
	}

	override getBeforeCursorState(): Selection[] | null {
		return this._canUseEditor() ? this._editor.getSelections() : null;
	}

	override apply(reason?: TextModelEditSource): void {

		// Check that the editor is still for the wanted model. It might have changed in the
		// meantime and that means we cannot use the editor anymore (instead we perform the edit through the model)
		if (!this._canUseEditor()) {
			super.apply();
			return;
		}

		if (this._edits.length > 0) {
			const snippetCtrl = SnippetController2.get(this._editor);
			if (snippetCtrl && this._edits.some(edit => edit.insertAsSnippet)) {
				// some edit is a snippet edit -> use snippet controller and ISnippetEdits
				const snippetEdits: ISnippetEdit[] = [];
				for (const edit of this._edits) {
					if (edit.range && edit.text !== null) {
						snippetEdits.push({
							range: Range.lift(edit.range),
							template: edit.insertAsSnippet ? edit.text : SnippetParser.escape(edit.text),
							keepWhitespace: edit.keepWhitespace
						});
					}
				}
				snippetCtrl.apply(snippetEdits, { undoStopBefore: false, undoStopAfter: false });

			} else {
				// normal edit
				this._edits = this._edits
					.map(this._transformSnippetStringToInsertText, this) // mixed edits (snippet and normal) -> no snippet mode
					.sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
				this._editor.executeEdits(reason, this._edits);
			}
		}
		if (this._newEol !== undefined) {
			if (this._editor.hasModel()) {
				this._editor.getModel().pushEOL(this._newEol);
			}
		}
	}

	private _canUseEditor(): boolean {
		return this._editor?.getModel()?.uri.toString() === this.model.uri.toString();
	}
}

export class BulkTextEdits {

	private readonly _edits = new ResourceMap<ResourceTextEdit[]>();

	constructor(
		private readonly _label: string,
		private readonly _code: string,
		private readonly _editor: ICodeEditor | undefined,
		private readonly _undoRedoGroup: UndoRedoGroup,
		private readonly _undoRedoSource: UndoRedoSource | undefined,
		private readonly _progress: IProgress<void>,
		private readonly _token: CancellationToken,
		edits: ResourceTextEdit[],
		@IEditorWorkerService private readonly _editorWorker: IEditorWorkerService,
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private readonly _textModelResolverService: ITextModelService,
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService
	) {

		for (const edit of edits) {
			let array = this._edits.get(edit.resource);
			if (!array) {
				array = [];
				this._edits.set(edit.resource, array);
			}
			array.push(edit);
		}
	}

	private _validateBeforePrepare(): void {
		// First check if loaded models were not changed in the meantime
		for (const array of this._edits.values()) {
			for (const edit of array) {
				if (typeof edit.versionId === 'number') {
					const model = this._modelService.getModel(edit.resource);
					if (model && model.getVersionId() !== edit.versionId) {
						// model changed in the meantime
						throw new Error(`${model.uri.toString()} has changed in the meantime`);
					}
				}
			}
		}
	}

	private async _createEditsTasks(): Promise<ModelEditTask[]> {

		const tasks: ModelEditTask[] = [];
		const promises: Promise<any>[] = [];

		for (const [key, edits] of this._edits) {
			const promise = this._textModelResolverService.createModelReference(key).then(async ref => {
				let task: ModelEditTask;
				let makeMinimal = false;
				if (this._editor?.getModel()?.uri.toString() === ref.object.textEditorModel.uri.toString()) {
					task = new EditorEditTask(ref, this._editor);
					makeMinimal = true;
				} else {
					task = new ModelEditTask(ref);
				}
				tasks.push(task);


				if (!makeMinimal) {
					edits.forEach(task.addEdit, task);
					return;
				}

				// group edits by type (snippet, metadata, or simple) and make simple groups more minimal

				const makeGroupMoreMinimal = async (start: number, end: number) => {
					const oldEdits = edits.slice(start, end);
					const newEdits = await this._editorWorker.computeMoreMinimalEdits(ref.object.textEditorModel.uri, oldEdits.map(e => e.textEdit), false);
					if (!newEdits) {
						oldEdits.forEach(task.addEdit, task);
					} else {
						newEdits.forEach(edit => task.addEdit(new ResourceTextEdit(ref.object.textEditorModel.uri, edit, undefined, undefined)));
					}
				};

				let start = 0;
				let i = 0;
				for (; i < edits.length; i++) {
					if (edits[i].textEdit.insertAsSnippet || edits[i].metadata) {
						await makeGroupMoreMinimal(start, i); // grouped edits until now
						task.addEdit(edits[i]); // this edit
						start = i + 1;
					}
				}
				await makeGroupMoreMinimal(start, i);

			});
			promises.push(promise);
		}

		await Promise.all(promises);
		return tasks;
	}

	private _validateTasks(tasks: ModelEditTask[]): ValidationResult {
		for (const task of tasks) {
			const result = task.validate();
			if (!result.canApply) {
				return result;
			}
		}
		return { canApply: true };
	}

	async apply(reason?: TextModelEditSource): Promise<readonly URI[]> {

		this._validateBeforePrepare();
		const tasks = await this._createEditsTasks();

		try {
			if (this._token.isCancellationRequested) {
				return [];
			}

			const resources: URI[] = [];
			const validation = this._validateTasks(tasks);
			if (!validation.canApply) {
				throw new Error(`${validation.reason.toString()} has changed in the meantime`);
			}
			if (tasks.length === 1) {
				// This edit touches a single model => keep things simple
				const task = tasks[0];
				if (!task.isNoOp()) {
					const singleModelEditStackElement = new SingleModelEditStackElement(this._label, this._code, task.model, task.getBeforeCursorState());
					this._undoRedoService.pushElement(singleModelEditStackElement, this._undoRedoGroup, this._undoRedoSource);
					task.apply(reason);
					singleModelEditStackElement.close();
					resources.push(task.model.uri);
				}
				this._progress.report(undefined);
			} else {
				// prepare multi model undo element
				const multiModelEditStackElement = new MultiModelEditStackElement(
					this._label,
					this._code,
					tasks.map(t => new SingleModelEditStackElement(this._label, this._code, t.model, t.getBeforeCursorState()))
				);
				this._undoRedoService.pushElement(multiModelEditStackElement, this._undoRedoGroup, this._undoRedoSource);
				for (const task of tasks) {
					task.apply();
					this._progress.report(undefined);
					resources.push(task.model.uri);
				}
				multiModelEditStackElement.close();
			}

			return resources;

		} finally {
			dispose(tasks);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/conflicts.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/conflicts.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IFileService } from '../../../../platform/files/common/files.js';
import { URI } from '../../../../base/common/uri.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { DisposableStore } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { ResourceEdit, ResourceFileEdit, ResourceTextEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { ResourceNotebookCellEdit } from './bulkCellEdits.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export class ConflictDetector {

	private readonly _conflicts = new ResourceMap<boolean>();
	private readonly _disposables = new DisposableStore();

	private readonly _onDidConflict = new Emitter<this>();
	readonly onDidConflict: Event<this> = this._onDidConflict.event;

	constructor(
		edits: ResourceEdit[],
		@IFileService fileService: IFileService,
		@IModelService modelService: IModelService,
		@ILogService logService: ILogService,
	) {

		const _workspaceEditResources = new ResourceMap<boolean>();

		for (const edit of edits) {
			if (edit instanceof ResourceTextEdit) {
				_workspaceEditResources.set(edit.resource, true);
				if (typeof edit.versionId === 'number') {
					const model = modelService.getModel(edit.resource);
					if (model && model.getVersionId() !== edit.versionId) {
						this._conflicts.set(edit.resource, true);
						this._onDidConflict.fire(this);
					}
				}

			} else if (edit instanceof ResourceFileEdit) {
				if (edit.newResource) {
					_workspaceEditResources.set(edit.newResource, true);

				} else if (edit.oldResource) {
					_workspaceEditResources.set(edit.oldResource, true);
				}
			} else if (edit instanceof ResourceNotebookCellEdit) {
				_workspaceEditResources.set(edit.resource, true);

			} else {
				logService.warn('UNKNOWN edit type', edit);
			}
		}

		// listen to file changes
		this._disposables.add(fileService.onDidFilesChange(e => {

			for (const uri of _workspaceEditResources.keys()) {
				// conflict happens when a file that we are working
				// on changes on disk. ignore changes for which a model
				// exists because we have a better check for models
				if (!modelService.getModel(uri) && e.contains(uri)) {
					this._conflicts.set(uri, true);
					this._onDidConflict.fire(this);
					break;
				}
			}
		}));

		// listen to model changes...?
		const onDidChangeModel = (model: ITextModel) => {

			// conflict
			if (_workspaceEditResources.has(model.uri)) {
				this._conflicts.set(model.uri, true);
				this._onDidConflict.fire(this);
			}
		};
		for (const model of modelService.getModels()) {
			this._disposables.add(model.onDidChangeContent(() => onDidChangeModel(model)));
		}
	}

	dispose(): void {
		this._disposables.dispose();
		this._onDidConflict.dispose();
	}

	list(): URI[] {
		return [...this._conflicts.keys()];
	}

	hasConflicts(): boolean {
		return this._conflicts.size > 0;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/opaqueEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/opaqueEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isObject } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ResourceEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { ICustomEdit, WorkspaceEditMetadata } from '../../../../editor/common/languages.js';
import { IProgress } from '../../../../platform/progress/common/progress.js';
import { IUndoRedoService, UndoRedoElementType, UndoRedoGroup, UndoRedoSource } from '../../../../platform/undoRedo/common/undoRedo.js';

export class ResourceAttachmentEdit extends ResourceEdit implements ICustomEdit {

	static is(candidate: unknown): candidate is ICustomEdit {
		if (candidate instanceof ResourceAttachmentEdit) {
			return true;
		} else {
			return isObject(candidate)
				&& (Boolean((<ICustomEdit>candidate).undo && (<ICustomEdit>candidate).redo));
		}
	}

	static lift(edit: ICustomEdit): ResourceAttachmentEdit {
		if (edit instanceof ResourceAttachmentEdit) {
			return edit;
		} else {
			return new ResourceAttachmentEdit(edit.resource, edit.undo, edit.redo, edit.metadata);
		}
	}

	constructor(
		readonly resource: URI,
		readonly undo: () => Promise<void> | void,
		readonly redo: () => Promise<void> | void,
		metadata?: WorkspaceEditMetadata
	) {
		super(metadata);
	}
}

export class OpaqueEdits {

	constructor(
		private readonly _undoRedoGroup: UndoRedoGroup,
		private readonly _undoRedoSource: UndoRedoSource | undefined,
		private readonly _progress: IProgress<void>,
		private readonly _token: CancellationToken,
		private readonly _edits: ResourceAttachmentEdit[],
		@IUndoRedoService private readonly _undoRedoService: IUndoRedoService,
	) { }

	async apply(): Promise<readonly URI[]> {
		const resources: URI[] = [];

		for (const edit of this._edits) {
			if (this._token.isCancellationRequested) {
				break;
			}

			await edit.redo();

			this._undoRedoService.pushElement({
				type: UndoRedoElementType.Resource,
				resource: edit.resource,
				label: edit.metadata?.label || 'Custom Edit',
				code: 'paste',
				undo: edit.undo,
				redo: edit.redo,
			}, this._undoRedoGroup, this._undoRedoSource);

			this._progress.report(undefined);
			resources.push(edit.resource);
		}

		return resources;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEdit.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEdit.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../../platform/registry/common/platform.js';
import { WorkbenchPhase, registerWorkbenchContribution2 } from '../../../../common/contributions.js';
import { IBulkEditService, ResourceEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { BulkEditPane } from './bulkEditPane.js';
import { IViewContainersRegistry, Extensions as ViewContainerExtensions, ViewContainerLocation, IViewsRegistry } from '../../../../common/views.js';
import { IViewsService } from '../../../../services/views/common/viewsService.js';
import { FocusedViewContext } from '../../../../common/contextkeys.js';
import { localize, localize2 } from '../../../../../nls.js';
import { ViewPaneContainer } from '../../../../browser/parts/views/viewPaneContainer.js';
import { RawContextKey, IContextKeyService, IContextKey, ContextKeyExpr } from '../../../../../platform/contextkey/common/contextkey.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { KeybindingWeight } from '../../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyMod, KeyCode } from '../../../../../base/common/keyCodes.js';
import { WorkbenchListFocusContextKey } from '../../../../../platform/list/browser/listService.js';
import { SyncDescriptor } from '../../../../../platform/instantiation/common/descriptors.js';
import { MenuId, registerAction2, Action2 } from '../../../../../platform/actions/common/actions.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../../common/editor.js';
import { EditorInput } from '../../../../common/editor/editorInput.js';
import type { ServicesAccessor } from '../../../../../platform/instantiation/common/instantiation.js';
import { CancellationTokenSource } from '../../../../../base/common/cancellation.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import Severity from '../../../../../base/common/severity.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { registerIcon } from '../../../../../platform/theme/common/iconRegistry.js';
import { IPaneCompositePartService } from '../../../../services/panecomposite/browser/panecomposite.js';

async function getBulkEditPane(viewsService: IViewsService): Promise<BulkEditPane | undefined> {
	const view = await viewsService.openView(BulkEditPane.ID, true);
	if (view instanceof BulkEditPane) {
		return view;
	}
	return undefined;
}

class UXState {

	private readonly _activePanel: string | undefined;

	constructor(
		@IPaneCompositePartService private readonly _paneCompositeService: IPaneCompositePartService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
	) {
		this._activePanel = _paneCompositeService.getActivePaneComposite(ViewContainerLocation.Panel)?.getId();
	}

	async restore(panels: boolean, editors: boolean): Promise<void> {

		// (1) restore previous panel
		if (panels) {
			if (typeof this._activePanel === 'string') {
				await this._paneCompositeService.openPaneComposite(this._activePanel, ViewContainerLocation.Panel);
			} else {
				this._paneCompositeService.hideActivePaneComposite(ViewContainerLocation.Panel);
			}
		}

		// (2) close preview editors
		if (editors) {
			for (const group of this._editorGroupsService.groups) {
				const previewEditors: EditorInput[] = [];
				for (const input of group.editors) {

					const resource = EditorResourceAccessor.getCanonicalUri(input, { supportSideBySide: SideBySideEditor.PRIMARY });
					if (resource?.scheme === BulkEditPane.Schema) {
						previewEditors.push(input);
					}
				}

				if (previewEditors.length) {
					group.closeEditors(previewEditors, { preserveFocus: true });
				}
			}
		}
	}
}

class PreviewSession {
	constructor(
		readonly uxState: UXState,
		readonly cts: CancellationTokenSource = new CancellationTokenSource(),
	) { }
}

class BulkEditPreviewContribution {

	static readonly ID = 'workbench.contrib.bulkEditPreview';

	static readonly ctxEnabled = new RawContextKey('refactorPreview.enabled', false);

	private readonly _ctxEnabled: IContextKey<boolean>;

	private _activeSession: PreviewSession | undefined;

	constructor(
		@IPaneCompositePartService private readonly _paneCompositeService: IPaneCompositePartService,
		@IViewsService private readonly _viewsService: IViewsService,
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IBulkEditService bulkEditService: IBulkEditService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		bulkEditService.setPreviewHandler(edits => this._previewEdit(edits));
		this._ctxEnabled = BulkEditPreviewContribution.ctxEnabled.bindTo(contextKeyService);
	}

	private async _previewEdit(edits: ResourceEdit[]): Promise<ResourceEdit[]> {
		this._ctxEnabled.set(true);

		const uxState = this._activeSession?.uxState ?? new UXState(this._paneCompositeService, this._editorGroupsService);
		const view = await getBulkEditPane(this._viewsService);
		if (!view) {
			this._ctxEnabled.set(false);
			return edits;
		}

		// check for active preview session and let the user decide
		if (view.hasInput()) {
			const { confirmed } = await this._dialogService.confirm({
				type: Severity.Info,
				message: localize('overlap', "Another refactoring is being previewed."),
				detail: localize('detail', "Press 'Continue' to discard the previous refactoring and continue with the current refactoring."),
				primaryButton: localize({ key: 'continue', comment: ['&& denotes a mnemonic'] }, "&&Continue")
			});

			if (!confirmed) {
				return [];
			}
		}

		// session
		let session: PreviewSession;
		if (this._activeSession) {
			await this._activeSession.uxState.restore(false, true);
			this._activeSession.cts.dispose(true);
			session = new PreviewSession(uxState);
		} else {
			session = new PreviewSession(uxState);
		}
		this._activeSession = session;

		// the actual work...
		try {

			return await view.setInput(edits, session.cts.token) ?? [];

		} finally {
			// restore UX state
			if (this._activeSession === session) {
				await this._activeSession.uxState.restore(true, true);
				this._activeSession.cts.dispose();
				this._ctxEnabled.set(false);
				this._activeSession = undefined;
			}
		}
	}
}


// CMD: accept
registerAction2(class ApplyAction extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.apply',
			title: localize2('apply', "Apply Refactoring"),
			category: localize2('cat', "Refactor Preview"),
			icon: Codicon.check,
			precondition: ContextKeyExpr.and(BulkEditPreviewContribution.ctxEnabled, BulkEditPane.ctxHasCheckedChanges),
			menu: [{
				id: MenuId.BulkEditContext,
				order: 1
			}],
			keybinding: {
				weight: KeybindingWeight.EditorContrib - 10,
				when: ContextKeyExpr.and(BulkEditPreviewContribution.ctxEnabled, FocusedViewContext.isEqualTo(BulkEditPane.ID)),
				primary: KeyMod.CtrlCmd + KeyCode.Enter,
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.accept();
	}
});

// CMD: discard
registerAction2(class DiscardAction extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.discard',
			title: localize2('Discard', "Discard Refactoring"),
			category: localize2('cat', "Refactor Preview"),
			icon: Codicon.clearAll,
			precondition: BulkEditPreviewContribution.ctxEnabled,
			menu: [{
				id: MenuId.BulkEditContext,
				order: 2
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.discard();
	}
});


// CMD: toggle change
registerAction2(class ToggleAction extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.toggleCheckedState',
			title: localize2('toogleSelection', "Toggle Change"),
			category: localize2('cat', "Refactor Preview"),
			precondition: BulkEditPreviewContribution.ctxEnabled,
			keybinding: {
				weight: KeybindingWeight.WorkbenchContrib,
				when: WorkbenchListFocusContextKey,
				primary: KeyCode.Space,
			},
			menu: {
				id: MenuId.BulkEditContext,
				group: 'navigation'
			}
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.toggleChecked();
	}
});


// CMD: toggle category
registerAction2(class GroupByFile extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.groupByFile',
			title: localize2('groupByFile', "Group Changes By File"),
			category: localize2('cat', "Refactor Preview"),
			icon: Codicon.ungroupByRefType,
			precondition: ContextKeyExpr.and(BulkEditPane.ctxHasCategories, BulkEditPane.ctxGroupByFile.negate(), BulkEditPreviewContribution.ctxEnabled),
			menu: [{
				id: MenuId.BulkEditTitle,
				when: ContextKeyExpr.and(BulkEditPane.ctxHasCategories, BulkEditPane.ctxGroupByFile.negate()),
				group: 'navigation',
				order: 3,
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.groupByFile();
	}
});

registerAction2(class GroupByType extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.groupByType',
			title: localize2('groupByType', "Group Changes By Type"),
			category: localize2('cat', "Refactor Preview"),
			icon: Codicon.groupByRefType,
			precondition: ContextKeyExpr.and(BulkEditPane.ctxHasCategories, BulkEditPane.ctxGroupByFile, BulkEditPreviewContribution.ctxEnabled),
			menu: [{
				id: MenuId.BulkEditTitle,
				when: ContextKeyExpr.and(BulkEditPane.ctxHasCategories, BulkEditPane.ctxGroupByFile),
				group: 'navigation',
				order: 3
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.groupByType();
	}
});

registerAction2(class ToggleGrouping extends Action2 {

	constructor() {
		super({
			id: 'refactorPreview.toggleGrouping',
			title: localize2('groupByType', "Group Changes By Type"),
			category: localize2('cat', "Refactor Preview"),
			icon: Codicon.listTree,
			toggled: BulkEditPane.ctxGroupByFile.negate(),
			precondition: ContextKeyExpr.and(BulkEditPane.ctxHasCategories, BulkEditPreviewContribution.ctxEnabled),
			menu: [{
				id: MenuId.BulkEditContext,
				order: 3
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const viewsService = accessor.get(IViewsService);
		const view = await getBulkEditPane(viewsService);
		view?.toggleGrouping();
	}
});

registerWorkbenchContribution2(
	BulkEditPreviewContribution.ID, BulkEditPreviewContribution, WorkbenchPhase.BlockRestore
);

const refactorPreviewViewIcon = registerIcon('refactor-preview-view-icon', Codicon.lightbulb, localize('refactorPreviewViewIcon', 'View icon of the refactor preview view.'));

const container = Registry.as<IViewContainersRegistry>(ViewContainerExtensions.ViewContainersRegistry).registerViewContainer({
	id: BulkEditPane.ID,
	title: localize2('panel', "Refactor Preview"),
	hideIfEmpty: true,
	ctorDescriptor: new SyncDescriptor(
		ViewPaneContainer,
		[BulkEditPane.ID, { mergeViewWithContainerWhenSingleView: true }]
	),
	icon: refactorPreviewViewIcon,
	storageId: BulkEditPane.ID
}, ViewContainerLocation.Panel);

Registry.as<IViewsRegistry>(ViewContainerExtensions.ViewsRegistry).registerViews([{
	id: BulkEditPane.ID,
	name: localize2('panel', "Refactor Preview"),
	when: BulkEditPreviewContribution.ctxEnabled,
	ctorDescriptor: new SyncDescriptor(BulkEditPane),
	containerIcon: refactorPreviewViewIcon,
}], container);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEdit.css]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEdit.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

.monaco-workbench .bulk-edit-panel .highlight.insert {
	background-color: var(--vscode-diffEditor-insertedTextBackground);
}

.monaco-workbench .bulk-edit-panel .highlight.remove {
	text-decoration: line-through;
	background-color: var(--vscode-diffEditor-removedTextBackground);
}

.monaco-workbench .bulk-edit-panel .message {
	padding: 10px 20px
}

.monaco-workbench .bulk-edit-panel[data-state="message"] .message,
.monaco-workbench .bulk-edit-panel[data-state="data"] .content
{
	display: flex;
}

.monaco-workbench .bulk-edit-panel[data-state="data"] .message,
.monaco-workbench .bulk-edit-panel[data-state="message"] .content
{
	display: none;
}

.monaco-workbench .bulk-edit-panel .content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.monaco-workbench .bulk-edit-panel .content .buttons {
	padding-left: 20px;
	padding-top: 10px;
}

.monaco-workbench .bulk-edit-panel .content .buttons .monaco-button {
	display: inline-flex;
	width: inherit;
	margin: 0 4px;
	padding: 4px 8px;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents {
	display: flex;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents .edit-checkbox {
	align-self: center;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents .edit-checkbox.disabled {
	opacity: .5;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents .monaco-icon-label.delete .monaco-icon-label-container {
	text-decoration: line-through;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents .details {
	margin-left: .5em;
	opacity: .7;
	font-size: 0.9em;
	white-space: pre
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents.category {
	display: flex;
	flex: 1;
	flex-flow: row nowrap;
	align-items: center;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents.category .theme-icon,
.monaco-workbench .bulk-edit-panel .monaco-tl-contents.textedit .theme-icon {
	margin-right: 4px;
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents.category .uri-icon,
.monaco-workbench .bulk-edit-panel .monaco-tl-contents.textedit .uri-icon,
.monaco-workbench.hc-light .bulk-edit-panel .monaco-tl-contents.category .uri-icon,
.monaco-workbench.hc-light .bulk-edit-panel .monaco-tl-contents.textedit .uri-icon  {
	background-repeat: no-repeat;
	background-image: var(--background-light);
	background-position: left center;
	background-size: contain;
	margin-right: 4px;
	height: 100%;
	width: 16px;
	min-width: 16px;
}

.monaco-workbench.vs-dark .bulk-edit-panel .monaco-tl-contents.category .uri-icon,
.monaco-workbench.hc-black .bulk-edit-panel .monaco-tl-contents.category .uri-icon,
.monaco-workbench.vs-dark .bulk-edit-panel .monaco-tl-contents.textedit .uri-icon,
.monaco-workbench.hc-black .bulk-edit-panel .monaco-tl-contents.textedit .uri-icon
{
	background-image: var(--background-dark);
}

.monaco-workbench .bulk-edit-panel .monaco-tl-contents.textedit .monaco-highlighted-label {
	overflow: hidden;
	text-overflow: ellipsis;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPane.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPane.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ButtonBar } from '../../../../../base/browser/ui/button/button.js';
import type { IAsyncDataTreeViewState } from '../../../../../base/browser/ui/tree/asyncDataTree.js';
import { ITreeContextMenuEvent } from '../../../../../base/browser/ui/tree/tree.js';
import { CachedFunction, LRUCachedFunction } from '../../../../../base/common/cache.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { FuzzyScore } from '../../../../../base/common/filters.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { Mutable } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import './bulkEdit.css';
import { ResourceEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { IMultiDiffEditorOptions, IMultiDiffResourceId } from '../../../../../editor/browser/widget/multiDiffEditor/multiDiffEditorWidgetImpl.js';
import { IRange } from '../../../../../editor/common/core/range.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { localize } from '../../../../../nls.js';
import { MenuId } from '../../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService, RawContextKey } from '../../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../../platform/contextview/browser/contextView.js';
import { IDialogService } from '../../../../../platform/dialogs/common/dialogs.js';
import { IHoverService } from '../../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import { IOpenEvent, WorkbenchAsyncDataTree } from '../../../../../platform/list/browser/listService.js';
import { IOpenerService } from '../../../../../platform/opener/common/opener.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { defaultButtonStyles } from '../../../../../platform/theme/browser/defaultStyles.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ResourceLabels } from '../../../../browser/labels.js';
import { ViewPane } from '../../../../browser/parts/views/viewPane.js';
import { IViewletViewOptions } from '../../../../browser/parts/views/viewsViewlet.js';
import { IMultiDiffEditorResource, IResourceDiffEditorInput } from '../../../../common/editor.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { BulkEditPreviewProvider, BulkFileOperation, BulkFileOperations, BulkFileOperationType } from './bulkEditPreview.js';
import { BulkEditAccessibilityProvider, BulkEditDataSource, BulkEditDelegate, BulkEditElement, BulkEditIdentityProvider, BulkEditNaviLabelProvider, BulkEditSorter, CategoryElement, CategoryElementRenderer, compareBulkFileOperations, FileElement, FileElementRenderer, TextEditElement, TextEditElementRenderer } from './bulkEditTree.js';
import { ACTIVE_GROUP, IEditorService, SIDE_GROUP } from '../../../../services/editor/common/editorService.js';

const enum State {
	Data = 'data',
	Message = 'message'
}

export class BulkEditPane extends ViewPane {

	static readonly ID = 'refactorPreview';
	static readonly Schema = 'vscode-bulkeditpreview-multieditor';

	static readonly ctxHasCategories = new RawContextKey('refactorPreview.hasCategories', false);
	static readonly ctxGroupByFile = new RawContextKey('refactorPreview.groupByFile', true);
	static readonly ctxHasCheckedChanges = new RawContextKey('refactorPreview.hasCheckedChanges', true);

	private static readonly _memGroupByFile = `${this.ID}.groupByFile`;

	private _tree!: WorkbenchAsyncDataTree<BulkFileOperations, BulkEditElement, FuzzyScore>;
	private _treeDataSource!: BulkEditDataSource;
	private _treeViewStates = new Map<boolean, IAsyncDataTreeViewState>();
	private _message!: HTMLSpanElement;

	private readonly _ctxHasCategories: IContextKey<boolean>;
	private readonly _ctxGroupByFile: IContextKey<boolean>;
	private readonly _ctxHasCheckedChanges: IContextKey<boolean>;

	private readonly _disposables = new DisposableStore();
	private readonly _sessionDisposables = new DisposableStore();
	private _currentResolve?: (edit?: ResourceEdit[]) => void;
	private _currentInput?: BulkFileOperations;
	private _currentProvider?: BulkEditPreviewProvider;

	constructor(
		options: IViewletViewOptions,
		@IInstantiationService private readonly _instaService: IInstantiationService,
		@IEditorService private readonly _editorService: IEditorService,
		@ILabelService private readonly _labelService: ILabelService,
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IDialogService private readonly _dialogService: IDialogService,
		@IContextMenuService private readonly _contextMenuService: IContextMenuService,
		@IStorageService private readonly _storageService: IStorageService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@IHoverService hoverService: IHoverService,
	) {
		super(
			{ ...options, titleMenuId: MenuId.BulkEditTitle },
			keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, _instaService, openerService, themeService, hoverService
		);

		this.element.classList.add('bulk-edit-panel', 'show-file-icons');
		this._ctxHasCategories = BulkEditPane.ctxHasCategories.bindTo(contextKeyService);
		this._ctxGroupByFile = BulkEditPane.ctxGroupByFile.bindTo(contextKeyService);
		this._ctxHasCheckedChanges = BulkEditPane.ctxHasCheckedChanges.bindTo(contextKeyService);
	}

	override dispose(): void {
		this._tree.dispose();
		this._disposables.dispose();
		super.dispose();
	}

	protected override renderBody(parent: HTMLElement): void {
		super.renderBody(parent);

		const resourceLabels = this._instaService.createInstance(
			ResourceLabels,
			{ onDidChangeVisibility: this.onDidChangeBodyVisibility }
		);
		this._disposables.add(resourceLabels);

		const contentContainer = document.createElement('div');
		contentContainer.className = 'content';
		parent.appendChild(contentContainer);

		// tree
		const treeContainer = document.createElement('div');
		contentContainer.appendChild(treeContainer);

		this._treeDataSource = this._instaService.createInstance(BulkEditDataSource);
		this._treeDataSource.groupByFile = this._storageService.getBoolean(BulkEditPane._memGroupByFile, StorageScope.PROFILE, true);
		this._ctxGroupByFile.set(this._treeDataSource.groupByFile);

		this._tree = this._instaService.createInstance(
			WorkbenchAsyncDataTree<BulkFileOperations, BulkEditElement, FuzzyScore>, this.id, treeContainer,
			new BulkEditDelegate(),
			[this._instaService.createInstance(TextEditElementRenderer), this._instaService.createInstance(FileElementRenderer, resourceLabels), this._instaService.createInstance(CategoryElementRenderer)],
			this._treeDataSource,
			{
				accessibilityProvider: this._instaService.createInstance(BulkEditAccessibilityProvider),
				identityProvider: new BulkEditIdentityProvider(),
				expandOnlyOnTwistieClick: true,
				multipleSelectionSupport: false,
				keyboardNavigationLabelProvider: new BulkEditNaviLabelProvider(),
				sorter: new BulkEditSorter(),
				selectionNavigation: true
			}
		);

		this._disposables.add(this._tree.onContextMenu(this._onContextMenu, this));
		this._disposables.add(this._tree.onDidOpen(e => this._openElementInMultiDiffEditor(e)));

		// buttons
		const buttonsContainer = document.createElement('div');
		buttonsContainer.className = 'buttons';
		contentContainer.appendChild(buttonsContainer);
		const buttonBar = new ButtonBar(buttonsContainer);
		this._disposables.add(buttonBar);

		const btnConfirm = buttonBar.addButton({ supportIcons: true, ...defaultButtonStyles });
		btnConfirm.label = localize('ok', 'Apply');
		btnConfirm.onDidClick(() => this.accept(), this, this._disposables);

		const btnCancel = buttonBar.addButton({ ...defaultButtonStyles, secondary: true });
		btnCancel.label = localize('cancel', 'Discard');
		btnCancel.onDidClick(() => this.discard(), this, this._disposables);

		// message
		this._message = document.createElement('span');
		this._message.className = 'message';
		this._message.innerText = localize('empty.msg', "Invoke a code action, like rename, to see a preview of its changes here.");
		parent.appendChild(this._message);

		//
		this._setState(State.Message);
	}

	protected override layoutBody(height: number, width: number): void {
		super.layoutBody(height, width);
		const treeHeight = height - 50;
		this._tree.getHTMLElement().parentElement!.style.height = `${treeHeight}px`;
		this._tree.layout(treeHeight, width);
	}

	private _setState(state: State): void {
		this.element.dataset['state'] = state;
	}

	async setInput(edit: ResourceEdit[], token: CancellationToken): Promise<ResourceEdit[] | undefined> {
		this._setState(State.Data);
		this._sessionDisposables.clear();
		this._treeViewStates.clear();

		if (this._currentResolve) {
			this._currentResolve(undefined);
			this._currentResolve = undefined;
		}

		const input = await this._instaService.invokeFunction(BulkFileOperations.create, edit);
		this._currentProvider = this._instaService.createInstance(BulkEditPreviewProvider, input);
		this._sessionDisposables.add(this._currentProvider);
		this._sessionDisposables.add(input);

		//
		const hasCategories = input.categories.length > 1;
		this._ctxHasCategories.set(hasCategories);
		this._treeDataSource.groupByFile = !hasCategories || this._treeDataSource.groupByFile;
		this._ctxHasCheckedChanges.set(input.checked.checkedCount > 0);

		this._currentInput = input;

		return new Promise<ResourceEdit[] | undefined>(resolve => {

			token.onCancellationRequested(() => resolve(undefined));

			this._currentResolve = resolve;
			this._setTreeInput(input);

			// refresh when check state changes
			this._sessionDisposables.add(input.checked.onDidChange(() => {
				this._tree.updateChildren();
				this._ctxHasCheckedChanges.set(input.checked.checkedCount > 0);
			}));
		});
	}

	hasInput(): boolean {
		return Boolean(this._currentInput);
	}

	private async _setTreeInput(input: BulkFileOperations) {

		const viewState = this._treeViewStates.get(this._treeDataSource.groupByFile);
		await this._tree.setInput(input, viewState);
		this._tree.domFocus();

		if (viewState) {
			return;
		}

		// async expandAll (max=10) is the default when no view state is given
		const expand = [...this._tree.getNode(input).children].slice(0, 10);
		while (expand.length > 0) {
			const { element } = expand.shift()!;
			if (element instanceof FileElement) {
				await this._tree.expand(element, true);
			}
			if (element instanceof CategoryElement) {
				await this._tree.expand(element, true);
				expand.push(...this._tree.getNode(element).children);
			}
		}
	}

	accept(): void {

		const conflicts = this._currentInput?.conflicts.list();

		if (!conflicts || conflicts.length === 0) {
			this._done(true);
			return;
		}

		let message: string;
		if (conflicts.length === 1) {
			message = localize('conflict.1', "Cannot apply refactoring because '{0}' has changed in the meantime.", this._labelService.getUriLabel(conflicts[0], { relative: true }));
		} else {
			message = localize('conflict.N', "Cannot apply refactoring because {0} other files have changed in the meantime.", conflicts.length);
		}

		this._dialogService.warn(message).finally(() => this._done(false));
	}

	discard() {
		this._done(false);
	}

	private _done(accept: boolean): void {
		this._currentResolve?.(accept ? this._currentInput?.getWorkspaceEdit() : undefined);
		this._currentInput = undefined;
		this._setState(State.Message);
		this._sessionDisposables.clear();
	}

	toggleChecked() {
		const [first] = this._tree.getFocus();
		if ((first instanceof FileElement || first instanceof TextEditElement) && !first.isDisabled()) {
			first.setChecked(!first.isChecked());
		} else if (first instanceof CategoryElement) {
			first.setChecked(!first.isChecked());
		}
	}

	groupByFile(): void {
		if (!this._treeDataSource.groupByFile) {
			this.toggleGrouping();
		}
	}

	groupByType(): void {
		if (this._treeDataSource.groupByFile) {
			this.toggleGrouping();
		}
	}

	toggleGrouping() {
		const input = this._tree.getInput();
		if (input) {

			// (1) capture view state
			const oldViewState = this._tree.getViewState();
			this._treeViewStates.set(this._treeDataSource.groupByFile, oldViewState);

			// (2) toggle and update
			this._treeDataSource.groupByFile = !this._treeDataSource.groupByFile;
			this._setTreeInput(input);

			// (3) remember preference
			this._storageService.store(BulkEditPane._memGroupByFile, this._treeDataSource.groupByFile, StorageScope.PROFILE, StorageTarget.USER);
			this._ctxGroupByFile.set(this._treeDataSource.groupByFile);
		}
	}

	private async _openElementInMultiDiffEditor(e: IOpenEvent<BulkEditElement | undefined>): Promise<void> {

		const fileOperations = this._currentInput?.fileOperations;
		if (!fileOperations) {
			return;
		}

		let selection: IRange | undefined = undefined;
		let fileElement: FileElement;
		if (e.element instanceof TextEditElement) {
			fileElement = e.element.parent;
			selection = e.element.edit.textEdit.textEdit.range;
		} else if (e.element instanceof FileElement) {
			fileElement = e.element;
			selection = e.element.edit.textEdits[0]?.textEdit.textEdit.range;
		} else {
			// invalid event
			return;
		}

		const result = await this._computeResourceDiffEditorInputs.get(fileOperations);
		const resourceId = await result.getResourceDiffEditorInputIdOfOperation(fileElement.edit);
		const options: Mutable<IMultiDiffEditorOptions> = {
			...e.editorOptions,
			viewState: {
				revealData: {
					resource: resourceId,
					range: selection,
				}
			}
		};
		const multiDiffSource = URI.from({ scheme: BulkEditPane.Schema });
		const label = 'Refactor Preview';
		this._editorService.openEditor({
			multiDiffSource,
			label,
			options,
			isTransient: true,
			description: label,
			resources: result.resources
		}, e.sideBySide ? SIDE_GROUP : ACTIVE_GROUP);
	}

	private readonly _computeResourceDiffEditorInputs = new LRUCachedFunction<
		BulkFileOperation[],
		Promise<{ resources: IMultiDiffEditorResource[]; getResourceDiffEditorInputIdOfOperation: (operation: BulkFileOperation) => Promise<IMultiDiffResourceId> }>
	>(async (fileOperations) => {
		const computeDiffEditorInput = new CachedFunction<BulkFileOperation, Promise<IMultiDiffEditorResource>>(async (fileOperation) => {
			const fileOperationUri = fileOperation.uri;
			const previewUri = this._currentProvider!.asPreviewUri(fileOperationUri);
			// delete
			if (fileOperation.type & BulkFileOperationType.Delete) {
				return {
					original: { resource: URI.revive(previewUri) },
					modified: { resource: undefined },
					goToFileResource: fileOperation.uri,
				} satisfies IMultiDiffEditorResource;

			}
			// rename, create, edits
			else {
				let leftResource: URI | undefined;
				try {
					(await this._textModelService.createModelReference(fileOperationUri)).dispose();
					leftResource = fileOperationUri;
				} catch {
					leftResource = BulkEditPreviewProvider.emptyPreview;
				}
				return {
					original: { resource: URI.revive(leftResource) },
					modified: { resource: URI.revive(previewUri) },
					goToFileResource: leftResource,
				} satisfies IMultiDiffEditorResource;
			}
		});

		const sortedFileOperations = fileOperations.slice().sort(compareBulkFileOperations);
		const resources: IResourceDiffEditorInput[] = [];
		for (const operation of sortedFileOperations) {
			resources.push(await computeDiffEditorInput.get(operation));
		}
		const getResourceDiffEditorInputIdOfOperation = async (operation: BulkFileOperation): Promise<IMultiDiffResourceId> => {
			const resource = await computeDiffEditorInput.get(operation);
			return { original: resource.original.resource, modified: resource.modified.resource };
		};
		return {
			resources,
			getResourceDiffEditorInputIdOfOperation
		};
	});

	private _onContextMenu(e: ITreeContextMenuEvent<any>): void {

		this._contextMenuService.showContextMenu({
			menuId: MenuId.BulkEditContext,
			contextKeyService: this.contextKeyService,
			getAnchor: () => e.anchor
		});
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPreview.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditPreview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITextModelContentProvider, ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { URI } from '../../../../../base/common/uri.js';
import { ILanguageService } from '../../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { createTextBufferFactoryFromSnapshot } from '../../../../../editor/common/model/textModel.js';
import { WorkspaceEditMetadata } from '../../../../../editor/common/languages.js';
import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { coalesceInPlace } from '../../../../../base/common/arrays.js';
import { Range } from '../../../../../editor/common/core/range.js';
import { EditOperation, ISingleEditOperation } from '../../../../../editor/common/core/editOperation.js';
import { ServicesAccessor, IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { Emitter, Event } from '../../../../../base/common/event.js';
import { ConflictDetector } from '../conflicts.js';
import { ResourceMap } from '../../../../../base/common/map.js';
import { localize } from '../../../../../nls.js';
import { extUri } from '../../../../../base/common/resources.js';
import { ResourceEdit, ResourceFileEdit, ResourceTextEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { generateUuid } from '../../../../../base/common/uuid.js';
import { SnippetParser } from '../../../../../editor/contrib/snippet/browser/snippetParser.js';
import { MicrotaskDelay } from '../../../../../base/common/symbols.js';
import { Schemas } from '../../../../../base/common/network.js';

export class CheckedStates<T extends object> {

	private readonly _states = new WeakMap<T, boolean>();
	private _checkedCount: number = 0;

	private readonly _onDidChange = new Emitter<T>();
	readonly onDidChange: Event<T> = this._onDidChange.event;

	dispose(): void {
		this._onDidChange.dispose();
	}

	get checkedCount() {
		return this._checkedCount;
	}

	isChecked(obj: T): boolean {
		return this._states.get(obj) ?? false;
	}

	updateChecked(obj: T, value: boolean): void {
		const valueNow = this._states.get(obj);
		if (valueNow === value) {
			return;
		}
		if (valueNow === undefined) {
			if (value) {
				this._checkedCount += 1;
			}
		} else {
			if (value) {
				this._checkedCount += 1;
			} else {
				this._checkedCount -= 1;
			}
		}
		this._states.set(obj, value);
		this._onDidChange.fire(obj);
	}
}

export class BulkTextEdit {

	constructor(
		readonly parent: BulkFileOperation,
		readonly textEdit: ResourceTextEdit
	) { }
}

export const enum BulkFileOperationType {
	TextEdit = 1,
	Create = 2,
	Delete = 4,
	Rename = 8,
}

export class BulkFileOperation {

	type = 0;
	textEdits: BulkTextEdit[] = [];
	originalEdits = new Map<number, ResourceTextEdit | ResourceFileEdit>();
	newUri?: URI;

	constructor(
		readonly uri: URI,
		readonly parent: BulkFileOperations
	) { }

	addEdit(index: number, type: BulkFileOperationType, edit: ResourceTextEdit | ResourceFileEdit) {
		this.type |= type;
		this.originalEdits.set(index, edit);
		if (edit instanceof ResourceTextEdit) {
			this.textEdits.push(new BulkTextEdit(this, edit));

		} else if (type === BulkFileOperationType.Rename) {
			this.newUri = edit.newResource;
		}
	}

	needsConfirmation(): boolean {
		for (const [, edit] of this.originalEdits) {
			if (!this.parent.checked.isChecked(edit)) {
				return true;
			}
		}
		return false;
	}
}

export class BulkCategory {

	private static readonly _defaultMetadata = Object.freeze({
		label: localize('default', "Other"),
		icon: Codicon.symbolFile,
		needsConfirmation: false
	});

	static keyOf(metadata?: WorkspaceEditMetadata) {
		return metadata?.label || '<default>';
	}

	readonly operationByResource = new Map<string, BulkFileOperation>();

	constructor(readonly metadata: WorkspaceEditMetadata = BulkCategory._defaultMetadata) { }

	get fileOperations(): IterableIterator<BulkFileOperation> {
		return this.operationByResource.values();
	}
}

export class BulkFileOperations {

	static async create(accessor: ServicesAccessor, bulkEdit: ResourceEdit[]): Promise<BulkFileOperations> {
		const result = accessor.get(IInstantiationService).createInstance(BulkFileOperations, bulkEdit);
		return await result._init();
	}

	readonly checked = new CheckedStates<ResourceEdit>();

	readonly fileOperations: BulkFileOperation[] = [];
	readonly categories: BulkCategory[] = [];
	readonly conflicts: ConflictDetector;

	constructor(
		private readonly _bulkEdit: ResourceEdit[],
		@IFileService private readonly _fileService: IFileService,
		@IInstantiationService instaService: IInstantiationService,
	) {
		this.conflicts = instaService.createInstance(ConflictDetector, _bulkEdit);
	}

	dispose(): void {
		this.checked.dispose();
		this.conflicts.dispose();
	}

	async _init() {
		const operationByResource = new Map<string, BulkFileOperation>();
		const operationByCategory = new Map<string, BulkCategory>();

		const newToOldUri = new ResourceMap<URI>();

		for (let idx = 0; idx < this._bulkEdit.length; idx++) {
			const edit = this._bulkEdit[idx];

			let uri: URI;
			let type: BulkFileOperationType;

			// store inital checked state
			this.checked.updateChecked(edit, !edit.metadata?.needsConfirmation);

			if (edit instanceof ResourceTextEdit) {
				type = BulkFileOperationType.TextEdit;
				uri = edit.resource;

			} else if (edit instanceof ResourceFileEdit) {
				if (edit.newResource && edit.oldResource) {
					type = BulkFileOperationType.Rename;
					uri = edit.oldResource;
					if (edit.options?.overwrite === undefined && edit.options?.ignoreIfExists && await this._fileService.exists(uri)) {
						// noop -> "soft" rename to something that already exists
						continue;
					}
					// map newResource onto oldResource so that text-edit appear for
					// the same file element
					newToOldUri.set(edit.newResource, uri);

				} else if (edit.oldResource) {
					type = BulkFileOperationType.Delete;
					uri = edit.oldResource;
					if (edit.options?.ignoreIfNotExists && !await this._fileService.exists(uri)) {
						// noop -> "soft" delete something that doesn't exist
						continue;
					}

				} else if (edit.newResource) {
					type = BulkFileOperationType.Create;
					uri = edit.newResource;
					if (edit.options?.overwrite === undefined && edit.options?.ignoreIfExists && await this._fileService.exists(uri)) {
						// noop -> "soft" create something that already exists
						continue;
					}

				} else {
					// invalid edit -> skip
					continue;
				}

			} else {
				// unsupported edit
				continue;
			}

			const insert = (uri: URI, map: Map<string, BulkFileOperation>) => {
				let key = extUri.getComparisonKey(uri, true);
				let operation = map.get(key);

				// rename
				if (!operation && newToOldUri.has(uri)) {
					uri = newToOldUri.get(uri)!;
					key = extUri.getComparisonKey(uri, true);
					operation = map.get(key);
				}

				if (!operation) {
					operation = new BulkFileOperation(uri, this);
					map.set(key, operation);
				}
				operation.addEdit(idx, type, edit);
			};

			insert(uri, operationByResource);

			// insert into "this" category
			const key = BulkCategory.keyOf(edit.metadata);
			let category = operationByCategory.get(key);
			if (!category) {
				category = new BulkCategory(edit.metadata);
				operationByCategory.set(key, category);
			}
			insert(uri, category.operationByResource);
		}

		operationByResource.forEach(value => this.fileOperations.push(value));
		operationByCategory.forEach(value => this.categories.push(value));

		// "correct" invalid parent-check child states that is
		// unchecked file edits (rename, create, delete) uncheck
		// all edits for a file, e.g no text change without rename
		for (const file of this.fileOperations) {
			if (file.type !== BulkFileOperationType.TextEdit) {
				let checked = true;
				for (const edit of file.originalEdits.values()) {
					if (edit instanceof ResourceFileEdit) {
						checked = checked && this.checked.isChecked(edit);
					}
				}
				if (!checked) {
					for (const edit of file.originalEdits.values()) {
						this.checked.updateChecked(edit, checked);
					}
				}
			}
		}

		// sort (once) categories atop which have unconfirmed edits
		this.categories.sort((a, b) => {
			if (a.metadata.needsConfirmation === b.metadata.needsConfirmation) {
				return a.metadata.label.localeCompare(b.metadata.label);
			} else if (a.metadata.needsConfirmation) {
				return -1;
			} else {
				return 1;
			}
		});

		return this;
	}

	getWorkspaceEdit(): ResourceEdit[] {
		const result: ResourceEdit[] = [];
		let allAccepted = true;

		for (let i = 0; i < this._bulkEdit.length; i++) {
			const edit = this._bulkEdit[i];
			if (this.checked.isChecked(edit)) {
				result[i] = edit;
				continue;
			}
			allAccepted = false;
		}

		if (allAccepted) {
			return this._bulkEdit;
		}

		// not all edits have been accepted
		coalesceInPlace(result);
		return result;
	}

	private async getFileEditOperation(edit: ResourceFileEdit): Promise<ISingleEditOperation | undefined> {
		const content = await edit.options.contents;
		if (!content) { return undefined; }
		return EditOperation.replaceMove(Range.lift({ startLineNumber: 0, startColumn: 0, endLineNumber: Number.MAX_VALUE, endColumn: 0 }), content.toString());
	}

	async getFileEdits(uri: URI): Promise<ISingleEditOperation[]> {

		for (const file of this.fileOperations) {
			if (file.uri.toString() === uri.toString()) {

				const result: Promise<ISingleEditOperation | undefined>[] = [];
				let ignoreAll = false;

				for (const edit of file.originalEdits.values()) {
					if (edit instanceof ResourceFileEdit) {
						result.push(this.getFileEditOperation(edit));
					} else if (edit instanceof ResourceTextEdit) {
						if (this.checked.isChecked(edit)) {
							result.push(Promise.resolve(EditOperation.replaceMove(Range.lift(edit.textEdit.range), !edit.textEdit.insertAsSnippet ? edit.textEdit.text : SnippetParser.asInsertText(edit.textEdit.text))));
						}

					} else if (!this.checked.isChecked(edit)) {
						// UNCHECKED WorkspaceFileEdit disables all text edits
						ignoreAll = true;
					}
				}

				if (ignoreAll) {
					return [];
				}

				return (await Promise.all(result)).filter(r => r !== undefined).sort((a, b) => Range.compareRangesUsingStarts(a.range, b.range));
			}
		}
		return [];
	}

	getUriOfEdit(edit: ResourceEdit): URI {
		for (const file of this.fileOperations) {
			for (const value of file.originalEdits.values()) {
				if (value === edit) {
					return file.uri;
				}
			}
		}
		throw new Error('invalid edit');
	}
}

export class BulkEditPreviewProvider implements ITextModelContentProvider {

	private static readonly Schema = 'vscode-bulkeditpreview-editor';

	static emptyPreview = URI.from({ scheme: this.Schema, fragment: 'empty' });


	static fromPreviewUri(uri: URI): URI {
		return URI.parse(uri.query);
	}

	private readonly _disposables = new DisposableStore();
	private readonly _ready: Promise<any>;
	private readonly _modelPreviewEdits = new Map<string, ISingleEditOperation[]>();
	private readonly _instanceId = generateUuid();

	constructor(
		private readonly _operations: BulkFileOperations,
		@ILanguageService private readonly _languageService: ILanguageService,
		@IModelService private readonly _modelService: IModelService,
		@ITextModelService private readonly _textModelResolverService: ITextModelService
	) {
		this._disposables.add(this._textModelResolverService.registerTextModelContentProvider(BulkEditPreviewProvider.Schema, this));
		this._ready = this._init();
	}

	dispose(): void {
		this._disposables.dispose();
	}

	asPreviewUri(uri: URI): URI {
		const path = uri.scheme === Schemas.untitled ? `/${uri.path}` : uri.path;
		return URI.from({ scheme: BulkEditPreviewProvider.Schema, authority: this._instanceId, path, query: uri.toString() });
	}

	private async _init() {
		for (const operation of this._operations.fileOperations) {
			await this._applyTextEditsToPreviewModel(operation.uri);
		}
		this._disposables.add(Event.debounce(this._operations.checked.onDidChange, (_last, e) => e, MicrotaskDelay)(e => {
			const uri = this._operations.getUriOfEdit(e);
			this._applyTextEditsToPreviewModel(uri);
		}));
	}

	private async _applyTextEditsToPreviewModel(uri: URI) {
		const model = await this._getOrCreatePreviewModel(uri);

		// undo edits that have been done before
		const undoEdits = this._modelPreviewEdits.get(model.id);
		if (undoEdits) {
			model.applyEdits(undoEdits);
		}
		// apply new edits and keep (future) undo edits
		const newEdits = await this._operations.getFileEdits(uri);
		const newUndoEdits = model.applyEdits(newEdits, true);
		this._modelPreviewEdits.set(model.id, newUndoEdits);
	}

	private async _getOrCreatePreviewModel(uri: URI) {
		const previewUri = this.asPreviewUri(uri);
		let model = this._modelService.getModel(previewUri);
		if (!model) {
			try {
				// try: copy existing
				const ref = await this._textModelResolverService.createModelReference(uri);
				const sourceModel = ref.object.textEditorModel;
				model = this._modelService.createModel(
					createTextBufferFactoryFromSnapshot(sourceModel.createSnapshot()),
					this._languageService.createById(sourceModel.getLanguageId()),
					previewUri
				);
				ref.dispose();

			} catch {
				// create NEW model
				model = this._modelService.createModel(
					'',
					this._languageService.createByFilepathOrFirstLine(previewUri),
					previewUri
				);
			}
			// this is a little weird but otherwise editors and other cusomers
			// will dispose my models before they should be disposed...
			// And all of this is off the eventloop to prevent endless recursion
			queueMicrotask(async () => {
				this._disposables.add(await this._textModelResolverService.createModelReference(model!.uri));
			});
		}
		return model;
	}

	async provideTextContent(previewUri: URI) {
		if (previewUri.toString() === BulkEditPreviewProvider.emptyPreview.toString()) {
			return this._modelService.createModel('', null, previewUri);
		}
		await this._ready;
		return this._modelService.getModel(previewUri);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditTree.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/browser/preview/bulkEditTree.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IAsyncDataSource, ITreeRenderer, ITreeNode, ITreeSorter } from '../../../../../base/browser/ui/tree/tree.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { FuzzyScore, createMatches } from '../../../../../base/common/filters.js';
import { IResourceLabel, ResourceLabels } from '../../../../browser/labels.js';
import { HighlightedLabel, IHighlight } from '../../../../../base/browser/ui/highlightedlabel/highlightedLabel.js';
import { IIdentityProvider, IListVirtualDelegate, IKeyboardNavigationLabelProvider } from '../../../../../base/browser/ui/list/list.js';
import { Range } from '../../../../../editor/common/core/range.js';
import * as dom from '../../../../../base/browser/dom.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { IDisposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { TextModel } from '../../../../../editor/common/model/textModel.js';
import { BulkFileOperations, BulkFileOperation, BulkFileOperationType, BulkTextEdit, BulkCategory } from './bulkEditPreview.js';
import { FileKind } from '../../../../../platform/files/common/files.js';
import { localize } from '../../../../../nls.js';
import { ILabelService } from '../../../../../platform/label/common/label.js';
import type { IListAccessibilityProvider } from '../../../../../base/browser/ui/list/listWidget.js';
import { IconLabel } from '../../../../../base/browser/ui/iconLabel/iconLabel.js';
import { basename } from '../../../../../base/common/resources.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { compare } from '../../../../../base/common/strings.js';
import { URI } from '../../../../../base/common/uri.js';
import { ResourceFileEdit } from '../../../../../editor/browser/services/bulkEditService.js';
import { PLAINTEXT_LANGUAGE_ID } from '../../../../../editor/common/languages/modesRegistry.js';
import { SnippetParser } from '../../../../../editor/contrib/snippet/browser/snippetParser.js';
import { AriaRole } from '../../../../../base/browser/ui/aria/aria.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import * as css from '../../../../../base/browser/cssValue.js';

// --- VIEW MODEL

export interface ICheckable {
	isChecked(): boolean;
	setChecked(value: boolean): void;
}

export class CategoryElement implements ICheckable {

	constructor(
		readonly parent: BulkFileOperations,
		readonly category: BulkCategory
	) { }

	isChecked(): boolean {
		const model = this.parent;
		let checked = true;
		for (const file of this.category.fileOperations) {
			for (const edit of file.originalEdits.values()) {
				checked = checked && model.checked.isChecked(edit);
			}
		}
		return checked;
	}

	setChecked(value: boolean): void {
		const model = this.parent;
		for (const file of this.category.fileOperations) {
			for (const edit of file.originalEdits.values()) {
				model.checked.updateChecked(edit, value);
			}
		}
	}
}

export class FileElement implements ICheckable {

	constructor(
		readonly parent: CategoryElement | BulkFileOperations,
		readonly edit: BulkFileOperation
	) { }

	isChecked(): boolean {
		const model = this.parent instanceof CategoryElement ? this.parent.parent : this.parent;

		let checked = true;

		// only text edit children -> reflect children state
		if (this.edit.type === BulkFileOperationType.TextEdit) {
			checked = !this.edit.textEdits.every(edit => !model.checked.isChecked(edit.textEdit));
		}

		// multiple file edits -> reflect single state
		for (const edit of this.edit.originalEdits.values()) {
			if (edit instanceof ResourceFileEdit) {
				checked = checked && model.checked.isChecked(edit);
			}
		}

		// multiple categories and text change -> read all elements
		if (this.parent instanceof CategoryElement && this.edit.type === BulkFileOperationType.TextEdit) {
			for (const category of model.categories) {
				for (const file of category.fileOperations) {
					if (file.uri.toString() === this.edit.uri.toString()) {
						for (const edit of file.originalEdits.values()) {
							if (edit instanceof ResourceFileEdit) {
								checked = checked && model.checked.isChecked(edit);
							}
						}
					}
				}
			}
		}

		return checked;
	}

	setChecked(value: boolean): void {
		const model = this.parent instanceof CategoryElement ? this.parent.parent : this.parent;
		for (const edit of this.edit.originalEdits.values()) {
			model.checked.updateChecked(edit, value);
		}

		// multiple categories and file change -> update all elements
		if (this.parent instanceof CategoryElement && this.edit.type !== BulkFileOperationType.TextEdit) {
			for (const category of model.categories) {
				for (const file of category.fileOperations) {
					if (file.uri.toString() === this.edit.uri.toString()) {
						for (const edit of file.originalEdits.values()) {
							model.checked.updateChecked(edit, value);
						}
					}
				}
			}
		}
	}

	isDisabled(): boolean {
		if (this.parent instanceof CategoryElement && this.edit.type === BulkFileOperationType.TextEdit) {
			const model = this.parent.parent;
			let checked = true;
			for (const category of model.categories) {
				for (const file of category.fileOperations) {
					if (file.uri.toString() === this.edit.uri.toString()) {
						for (const edit of file.originalEdits.values()) {
							if (edit instanceof ResourceFileEdit) {
								checked = checked && model.checked.isChecked(edit);
							}
						}
					}
				}
			}
			return !checked;
		}
		return false;
	}
}

export class TextEditElement implements ICheckable {

	constructor(
		readonly parent: FileElement,
		readonly idx: number,
		readonly edit: BulkTextEdit,
		readonly prefix: string, readonly selecting: string, readonly inserting: string, readonly suffix: string
	) { }

	isChecked(): boolean {
		let model = this.parent.parent;
		if (model instanceof CategoryElement) {
			model = model.parent;
		}
		return model.checked.isChecked(this.edit.textEdit);
	}

	setChecked(value: boolean): void {
		let model = this.parent.parent;
		if (model instanceof CategoryElement) {
			model = model.parent;
		}

		// check/uncheck this element
		model.checked.updateChecked(this.edit.textEdit, value);

		// make sure parent is checked when this element is checked...
		if (value) {
			for (const edit of this.parent.edit.originalEdits.values()) {
				if (edit instanceof ResourceFileEdit) {
					(<BulkFileOperations>model).checked.updateChecked(edit, value);
				}
			}
		}
	}

	isDisabled(): boolean {
		return this.parent.isDisabled();
	}
}

export type BulkEditElement = CategoryElement | FileElement | TextEditElement;

// --- DATA SOURCE

export class BulkEditDataSource implements IAsyncDataSource<BulkFileOperations, BulkEditElement> {

	public groupByFile: boolean = true;

	constructor(
		@ITextModelService private readonly _textModelService: ITextModelService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) { }

	hasChildren(element: BulkFileOperations | BulkEditElement): boolean {
		if (element instanceof FileElement) {
			return element.edit.textEdits.length > 0;
		}
		if (element instanceof TextEditElement) {
			return false;
		}
		return true;
	}

	async getChildren(element: BulkFileOperations | BulkEditElement): Promise<BulkEditElement[]> {

		// root -> file/text edits
		if (element instanceof BulkFileOperations) {
			return this.groupByFile
				? element.fileOperations.map(op => new FileElement(element, op))
				: element.categories.map(cat => new CategoryElement(element, cat));
		}

		// category
		if (element instanceof CategoryElement) {
			return Array.from(element.category.fileOperations, op => new FileElement(element, op));
		}

		// file: text edit
		if (element instanceof FileElement && element.edit.textEdits.length > 0) {
			// const previewUri = BulkEditPreviewProvider.asPreviewUri(element.edit.resource);
			let textModel: ITextModel;
			let textModelDisposable: IDisposable;
			try {
				const ref = await this._textModelService.createModelReference(element.edit.uri);
				textModel = ref.object.textEditorModel;
				textModelDisposable = ref;
			} catch {
				textModel = this._instantiationService.createInstance(TextModel, '', PLAINTEXT_LANGUAGE_ID, TextModel.DEFAULT_CREATION_OPTIONS, null);
				textModelDisposable = textModel;
			}

			const result = element.edit.textEdits.map((edit, idx) => {
				const range = textModel.validateRange(edit.textEdit.textEdit.range);

				//prefix-math
				const startTokens = textModel.tokenization.getLineTokens(range.startLineNumber);
				let prefixLen = 23; // default value for the no tokens/grammar case
				for (let idx = startTokens.findTokenIndexAtOffset(range.startColumn - 1) - 1; prefixLen < 50 && idx >= 0; idx--) {
					prefixLen = range.startColumn - startTokens.getStartOffset(idx);
				}

				//suffix-math
				const endTokens = textModel.tokenization.getLineTokens(range.endLineNumber);
				let suffixLen = 0;
				for (let idx = endTokens.findTokenIndexAtOffset(range.endColumn - 1); suffixLen < 50 && idx < endTokens.getCount(); idx++) {
					suffixLen += endTokens.getEndOffset(idx) - endTokens.getStartOffset(idx);
				}

				return new TextEditElement(
					element,
					idx,
					edit,
					textModel.getValueInRange(new Range(range.startLineNumber, range.startColumn - prefixLen, range.startLineNumber, range.startColumn)),
					textModel.getValueInRange(range),
					!edit.textEdit.textEdit.insertAsSnippet ? edit.textEdit.textEdit.text : SnippetParser.asInsertText(edit.textEdit.textEdit.text),
					textModel.getValueInRange(new Range(range.endLineNumber, range.endColumn, range.endLineNumber, range.endColumn + suffixLen))
				);
			});

			textModelDisposable.dispose();
			return result;
		}

		return [];
	}
}


export class BulkEditSorter implements ITreeSorter<BulkEditElement> {

	compare(a: BulkEditElement, b: BulkEditElement): number {
		if (a instanceof FileElement && b instanceof FileElement) {
			return compareBulkFileOperations(a.edit, b.edit);
		}

		if (a instanceof TextEditElement && b instanceof TextEditElement) {
			return Range.compareRangesUsingStarts(a.edit.textEdit.textEdit.range, b.edit.textEdit.textEdit.range);
		}

		return 0;
	}
}

export function compareBulkFileOperations(a: BulkFileOperation, b: BulkFileOperation): number {
	return compare(a.uri.toString(), b.uri.toString());
}

// --- ACCESSI

export class BulkEditAccessibilityProvider implements IListAccessibilityProvider<BulkEditElement> {

	constructor(@ILabelService private readonly _labelService: ILabelService) { }

	getWidgetAriaLabel(): string {
		return localize('bulkEdit', "Bulk Edit");
	}

	getRole(_element: BulkEditElement): AriaRole {
		return 'checkbox';
	}

	getAriaLabel(element: BulkEditElement): string | null {
		if (element instanceof FileElement) {
			if (element.edit.textEdits.length > 0) {
				if (element.edit.type & BulkFileOperationType.Rename && element.edit.newUri) {
					return localize(
						'aria.renameAndEdit', "Renaming {0} to {1}, also making text edits",
						this._labelService.getUriLabel(element.edit.uri, { relative: true }), this._labelService.getUriLabel(element.edit.newUri, { relative: true })
					);

				} else if (element.edit.type & BulkFileOperationType.Create) {
					return localize(
						'aria.createAndEdit', "Creating {0}, also making text edits",
						this._labelService.getUriLabel(element.edit.uri, { relative: true })
					);

				} else if (element.edit.type & BulkFileOperationType.Delete) {
					return localize(
						'aria.deleteAndEdit', "Deleting {0}, also making text edits",
						this._labelService.getUriLabel(element.edit.uri, { relative: true }),
					);
				} else {
					return localize(
						'aria.editOnly', "{0}, making text edits",
						this._labelService.getUriLabel(element.edit.uri, { relative: true }),
					);
				}

			} else {
				if (element.edit.type & BulkFileOperationType.Rename && element.edit.newUri) {
					return localize(
						'aria.rename', "Renaming {0} to {1}",
						this._labelService.getUriLabel(element.edit.uri, { relative: true }), this._labelService.getUriLabel(element.edit.newUri, { relative: true })
					);

				} else if (element.edit.type & BulkFileOperationType.Create) {
					return localize(
						'aria.create', "Creating {0}",
						this._labelService.getUriLabel(element.edit.uri, { relative: true })
					);

				} else if (element.edit.type & BulkFileOperationType.Delete) {
					return localize(
						'aria.delete', "Deleting {0}",
						this._labelService.getUriLabel(element.edit.uri, { relative: true }),
					);
				}
			}
		}

		if (element instanceof TextEditElement) {
			if (element.selecting.length > 0 && element.inserting.length > 0) {
				// edit: replace
				return localize('aria.replace', "line {0}, replacing {1} with {2}", element.edit.textEdit.textEdit.range.startLineNumber, element.selecting, element.inserting);
			} else if (element.selecting.length > 0 && element.inserting.length === 0) {
				// edit: delete
				return localize('aria.del', "line {0}, removing {1}", element.edit.textEdit.textEdit.range.startLineNumber, element.selecting);
			} else if (element.selecting.length === 0 && element.inserting.length > 0) {
				// edit: insert
				return localize('aria.insert', "line {0}, inserting {1}", element.edit.textEdit.textEdit.range.startLineNumber, element.selecting);
			}
		}

		return null;
	}
}

// --- IDENT

export class BulkEditIdentityProvider implements IIdentityProvider<BulkEditElement> {

	getId(element: BulkEditElement): { toString(): string } {
		if (element instanceof FileElement) {
			return element.edit.uri + (element.parent instanceof CategoryElement ? JSON.stringify(element.parent.category.metadata) : '');
		} else if (element instanceof TextEditElement) {
			return element.parent.edit.uri.toString() + element.idx;
		} else {
			return JSON.stringify(element.category.metadata);
		}
	}
}

// --- RENDERER

class CategoryElementTemplate {

	readonly icon: HTMLDivElement;
	readonly label: IconLabel;

	constructor(container: HTMLElement) {
		container.classList.add('category');
		this.icon = document.createElement('div');
		container.appendChild(this.icon);
		this.label = new IconLabel(container);
	}
}

export class CategoryElementRenderer implements ITreeRenderer<CategoryElement, FuzzyScore, CategoryElementTemplate> {

	static readonly id: string = 'CategoryElementRenderer';

	readonly templateId: string = CategoryElementRenderer.id;

	constructor(@IThemeService private readonly _themeService: IThemeService) { }

	renderTemplate(container: HTMLElement): CategoryElementTemplate {
		return new CategoryElementTemplate(container);
	}

	renderElement(node: ITreeNode<CategoryElement, FuzzyScore>, _index: number, template: CategoryElementTemplate): void {

		template.icon.style.setProperty('--background-dark', null);
		template.icon.style.setProperty('--background-light', null);
		template.icon.style.color = '';

		const { metadata } = node.element.category;
		if (ThemeIcon.isThemeIcon(metadata.iconPath)) {
			// css
			const className = ThemeIcon.asClassName(metadata.iconPath);
			template.icon.className = className ? `theme-icon ${className}` : '';
			template.icon.style.color = metadata.iconPath.color ? this._themeService.getColorTheme().getColor(metadata.iconPath.color.id)?.toString() ?? '' : '';


		} else if (URI.isUri(metadata.iconPath)) {
			// background-image
			template.icon.className = 'uri-icon';
			template.icon.style.setProperty('--background-dark', css.asCSSUrl(metadata.iconPath));
			template.icon.style.setProperty('--background-light', css.asCSSUrl(metadata.iconPath));

		} else if (metadata.iconPath) {
			// background-image
			template.icon.className = 'uri-icon';
			template.icon.style.setProperty('--background-dark', css.asCSSUrl(metadata.iconPath.dark));
			template.icon.style.setProperty('--background-light', css.asCSSUrl(metadata.iconPath.light));
		}

		template.label.setLabel(metadata.label, metadata.description, {
			descriptionMatches: createMatches(node.filterData),
		});
	}

	disposeTemplate(template: CategoryElementTemplate): void {
		template.label.dispose();
	}
}

class FileElementTemplate {

	private readonly _disposables = new DisposableStore();
	private readonly _localDisposables = new DisposableStore();

	private readonly _checkbox: HTMLInputElement;
	private readonly _label: IResourceLabel;
	private readonly _details: HTMLSpanElement;

	constructor(
		container: HTMLElement,
		resourceLabels: ResourceLabels,
		@ILabelService private readonly _labelService: ILabelService,
	) {

		this._checkbox = document.createElement('input');
		this._checkbox.className = 'edit-checkbox';
		this._checkbox.type = 'checkbox';
		this._checkbox.setAttribute('role', 'checkbox');
		container.appendChild(this._checkbox);

		this._label = resourceLabels.create(container, { supportHighlights: true });

		this._details = document.createElement('span');
		this._details.className = 'details';
		container.appendChild(this._details);
	}

	dispose(): void {
		this._localDisposables.dispose();
		this._disposables.dispose();
		this._label.dispose();
	}

	set(element: FileElement, score: FuzzyScore | undefined) {
		this._localDisposables.clear();

		this._checkbox.checked = element.isChecked();
		this._checkbox.disabled = element.isDisabled();
		this._localDisposables.add(dom.addDisposableListener(this._checkbox, 'change', () => {
			element.setChecked(this._checkbox.checked);
		}));

		if (element.edit.type & BulkFileOperationType.Rename && element.edit.newUri) {
			// rename: oldName → newName
			this._label.setResource({
				resource: element.edit.uri,
				name: localize('rename.label', "{0} → {1}", this._labelService.getUriLabel(element.edit.uri, { relative: true }), this._labelService.getUriLabel(element.edit.newUri, { relative: true })),
			}, {
				fileDecorations: { colors: true, badges: false }
			});

			this._details.innerText = localize('detail.rename', "(renaming)");

		} else {
			// create, delete, edit: NAME
			const options = {
				matches: createMatches(score),
				fileKind: FileKind.FILE,
				fileDecorations: { colors: true, badges: false },
				extraClasses: <string[]>[]
			};
			if (element.edit.type & BulkFileOperationType.Create) {
				this._details.innerText = localize('detail.create', "(creating)");
			} else if (element.edit.type & BulkFileOperationType.Delete) {
				this._details.innerText = localize('detail.del', "(deleting)");
				options.extraClasses.push('delete');
			} else {
				this._details.innerText = '';
			}
			this._label.setFile(element.edit.uri, options);
		}
	}
}

export class FileElementRenderer implements ITreeRenderer<FileElement, FuzzyScore, FileElementTemplate> {

	static readonly id: string = 'FileElementRenderer';

	readonly templateId: string = FileElementRenderer.id;

	constructor(
		private readonly _resourceLabels: ResourceLabels,
		@ILabelService private readonly _labelService: ILabelService,
	) { }

	renderTemplate(container: HTMLElement): FileElementTemplate {
		return new FileElementTemplate(container, this._resourceLabels, this._labelService);
	}

	renderElement(node: ITreeNode<FileElement, FuzzyScore>, _index: number, template: FileElementTemplate): void {
		template.set(node.element, node.filterData);
	}

	disposeTemplate(template: FileElementTemplate): void {
		template.dispose();
	}
}

class TextEditElementTemplate {

	private readonly _disposables = new DisposableStore();
	private readonly _localDisposables = new DisposableStore();

	private readonly _checkbox: HTMLInputElement;
	private readonly _icon: HTMLDivElement;
	private readonly _label: HighlightedLabel;

	constructor(container: HTMLElement, @IThemeService private readonly _themeService: IThemeService) {
		container.classList.add('textedit');

		this._checkbox = document.createElement('input');
		this._checkbox.className = 'edit-checkbox';
		this._checkbox.type = 'checkbox';
		this._checkbox.setAttribute('role', 'checkbox');
		container.appendChild(this._checkbox);

		this._icon = document.createElement('div');
		container.appendChild(this._icon);

		this._label = this._disposables.add(new HighlightedLabel(container));
	}

	dispose(): void {
		this._localDisposables.dispose();
		this._disposables.dispose();
	}

	set(element: TextEditElement) {
		this._localDisposables.clear();

		this._localDisposables.add(dom.addDisposableListener(this._checkbox, 'change', e => {
			element.setChecked(this._checkbox.checked);
			e.preventDefault();
		}));
		if (element.parent.isChecked()) {
			this._checkbox.checked = element.isChecked();
			this._checkbox.disabled = element.isDisabled();
		} else {
			this._checkbox.checked = element.isChecked();
			this._checkbox.disabled = element.isDisabled();
		}

		let value = '';
		value += element.prefix;
		value += element.selecting;
		value += element.inserting;
		value += element.suffix;

		const selectHighlight: IHighlight = { start: element.prefix.length, end: element.prefix.length + element.selecting.length, extraClasses: ['remove'] };
		const insertHighlight: IHighlight = { start: selectHighlight.end, end: selectHighlight.end + element.inserting.length, extraClasses: ['insert'] };

		let title: string | undefined;
		const { metadata } = element.edit.textEdit;
		if (metadata && metadata.description) {
			title = localize('title', "{0} - {1}", metadata.label, metadata.description);
		} else if (metadata) {
			title = metadata.label;
		}

		const iconPath = metadata?.iconPath;
		if (!iconPath) {
			this._icon.style.display = 'none';
		} else {
			this._icon.style.display = 'block';

			this._icon.style.setProperty('--background-dark', null);
			this._icon.style.setProperty('--background-light', null);

			if (ThemeIcon.isThemeIcon(iconPath)) {
				// css
				const className = ThemeIcon.asClassName(iconPath);
				this._icon.className = className ? `theme-icon ${className}` : '';
				this._icon.style.color = iconPath.color ? this._themeService.getColorTheme().getColor(iconPath.color.id)?.toString() ?? '' : '';


			} else if (URI.isUri(iconPath)) {
				// background-image
				this._icon.className = 'uri-icon';
				this._icon.style.setProperty('--background-dark', css.asCSSUrl(iconPath));
				this._icon.style.setProperty('--background-light', css.asCSSUrl(iconPath));

			} else {
				// background-image
				this._icon.className = 'uri-icon';
				this._icon.style.setProperty('--background-dark', css.asCSSUrl(iconPath.dark));
				this._icon.style.setProperty('--background-light', css.asCSSUrl(iconPath.light));
			}
		}

		this._label.set(value, [selectHighlight, insertHighlight], title, true);
		this._icon.title = title || '';
	}
}

export class TextEditElementRenderer implements ITreeRenderer<TextEditElement, FuzzyScore, TextEditElementTemplate> {

	static readonly id = 'TextEditElementRenderer';

	readonly templateId: string = TextEditElementRenderer.id;

	constructor(@IThemeService private readonly _themeService: IThemeService) { }

	renderTemplate(container: HTMLElement): TextEditElementTemplate {
		return new TextEditElementTemplate(container, this._themeService);
	}

	renderElement({ element }: ITreeNode<TextEditElement, FuzzyScore>, _index: number, template: TextEditElementTemplate): void {
		template.set(element);
	}

	disposeTemplate(_template: TextEditElementTemplate): void { }
}

export class BulkEditDelegate implements IListVirtualDelegate<BulkEditElement> {

	getHeight(): number {
		return 23;
	}

	getTemplateId(element: BulkEditElement): string {

		if (element instanceof FileElement) {
			return FileElementRenderer.id;
		} else if (element instanceof TextEditElement) {
			return TextEditElementRenderer.id;
		} else {
			return CategoryElementRenderer.id;
		}
	}
}


export class BulkEditNaviLabelProvider implements IKeyboardNavigationLabelProvider<BulkEditElement> {

	getKeyboardNavigationLabel(element: BulkEditElement) {
		if (element instanceof FileElement) {
			return basename(element.edit.uri);
		} else if (element instanceof CategoryElement) {
			return element.category.metadata.label;
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/bulkEdit/test/browser/bulkCellEdits.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/bulkEdit/test/browser/bulkCellEdits.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { URI } from '../../../../../base/common/uri.js';
import { mockObject } from '../../../../../base/test/common/mock.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';
import { IProgress } from '../../../../../platform/progress/common/progress.js';
import { UndoRedoGroup, UndoRedoSource } from '../../../../../platform/undoRedo/common/undoRedo.js';
import { BulkCellEdits, ResourceNotebookCellEdit } from '../../browser/bulkCellEdits.js';
import { NotebookTextModel } from '../../../notebook/common/model/notebookTextModel.js';
import { CellEditType, CellUri, IResolvedNotebookEditorModel } from '../../../notebook/common/notebookCommon.js';
import { INotebookEditorModelResolverService } from '../../../notebook/common/notebookEditorModelResolverService.js';
import { TestEditorService } from '../../../../test/browser/workbenchTestServices.js';

suite('BulkCellEdits', function () {
	const store = ensureNoDisposablesAreLeakedInTestSuite();

	async function runTest(inputUri: URI, resolveUri: URI) {
		const progress: IProgress<void> = { report: _ => { } };
		const editorService = store.add(new TestEditorService());

		const notebook = mockObject<NotebookTextModel>()();
		notebook.uri.returns(URI.file('/project/notebook.ipynb'));

		// eslint-disable-next-line local/code-no-any-casts
		const notebookEditorModel = mockObject<IResolvedNotebookEditorModel>()({ notebook: notebook as any });
		notebookEditorModel.isReadonly.returns(false);

		const notebookService = mockObject<INotebookEditorModelResolverService>()();
		notebookService.resolve.returns({ object: notebookEditorModel, dispose: () => { } });

		const edits = [
			new ResourceNotebookCellEdit(inputUri, { index: 0, count: 1, editType: CellEditType.Replace, cells: [] })
		];
		// eslint-disable-next-line local/code-no-any-casts
		const bce = new BulkCellEdits(new UndoRedoGroup(), new UndoRedoSource(), progress, CancellationToken.None, edits, editorService, notebookService as any);
		await bce.apply();

		const resolveArgs = notebookService.resolve.args[0];
		assert.strictEqual(resolveArgs[0].toString(), resolveUri.toString());
	}

	const notebookUri = URI.file('/foo/bar.ipynb');
	test('works with notebook URI', async () => {
		await runTest(notebookUri, notebookUri);
	});

	test('maps cell URI to notebook URI', async () => {
		await runTest(CellUri.generate(notebookUri, 5), notebookUri);
	});

	test('throws for invalid cell URI', async () => {
		const badCellUri = CellUri.generate(notebookUri, 5).with({ fragment: '' });
		await assert.rejects(async () => await runTest(badCellUri, notebookUri));
	});
});
```

--------------------------------------------------------------------------------

````
