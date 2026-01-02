---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 386
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 386 of 552)

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

---[FILE: src/vs/workbench/contrib/editSessions/browser/editSessionsStorageService.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/browser/editSessionsStorageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IQuickInputService, IQuickPickItem, IQuickPickSeparator } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { createSyncHeaders, IAuthenticationProvider, IResourceRefHandle } from '../../../../platform/userDataSync/common/userDataSync.js';
import { AuthenticationSession, AuthenticationSessionsChangeEvent, IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { EDIT_SESSIONS_SIGNED_IN, EditSession, EDIT_SESSION_SYNC_CATEGORY, IEditSessionsStorageService, EDIT_SESSIONS_SIGNED_IN_KEY, IEditSessionsLogService, SyncResource, EDIT_SESSIONS_PENDING_KEY } from '../common/editSessions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { getCurrentAuthenticationSessionInfo } from '../../../services/authentication/browser/authenticationService.js';
import { isWeb } from '../../../../base/common/platform.js';
import { IUserDataSyncMachinesService, UserDataSyncMachinesService } from '../../../../platform/userDataSync/common/userDataSyncMachines.js';
import { Emitter } from '../../../../base/common/event.js';
import { CancellationError } from '../../../../base/common/errors.js';
import { EditSessionsStoreClient } from '../common/editSessionsStorageClient.js';
import { ISecretStorageService } from '../../../../platform/secrets/common/secrets.js';

type ExistingSession = IQuickPickItem & { session: AuthenticationSession & { providerId: string } };
type AuthenticationProviderOption = IQuickPickItem & { provider: IAuthenticationProvider };

export class EditSessionsWorkbenchService extends Disposable implements IEditSessionsStorageService {

	declare _serviceBrand: undefined;

	public readonly SIZE_LIMIT = Math.floor(1024 * 1024 * 1.9); // 2 MB

	private serverConfiguration;
	private machineClient: IUserDataSyncMachinesService | undefined;

	private authenticationInfo: { sessionId: string; token: string; providerId: string } | undefined;
	private static CACHED_SESSION_STORAGE_KEY = 'editSessionAccountPreference';

	private initialized = false;
	private readonly signedInContext: IContextKey<boolean>;

	get isSignedIn() {
		return this.existingSessionId !== undefined;
	}

	private _didSignIn = new Emitter<void>();
	get onDidSignIn() {
		return this._didSignIn.event;
	}

	private _didSignOut = new Emitter<void>();
	get onDidSignOut() {
		return this._didSignOut.event;
	}

	private _lastWrittenResources = new Map<SyncResource, { ref: string; content: string }>();
	get lastWrittenResources() {
		return this._lastWrittenResources;
	}

	private _lastReadResources = new Map<SyncResource, { ref: string; content: string }>();
	get lastReadResources() {
		return this._lastReadResources;
	}

	storeClient: EditSessionsStoreClient | undefined; // TODO@joyceerhl lifecycle hack

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IStorageService private readonly storageService: IStorageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IEditSessionsLogService private readonly logService: IEditSessionsLogService,
		@IProductService private readonly productService: IProductService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IDialogService private readonly dialogService: IDialogService,
		@ISecretStorageService private readonly secretStorageService: ISecretStorageService
	) {
		super();
		this.serverConfiguration = this.productService['editSessions.store'];
		// If the user signs out of the current session, reset our cached auth state in memory and on disk
		this._register(this.authenticationService.onDidChangeSessions((e) => this.onDidChangeSessions(e.event)));

		// If another window changes the preferred session storage, reset our cached auth state in memory
		this._register(this.storageService.onDidChangeValue(StorageScope.APPLICATION, EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, this._store)(() => this.onDidChangeStorage()));

		this.registerSignInAction();
		this.registerResetAuthenticationAction();

		this.signedInContext = EDIT_SESSIONS_SIGNED_IN.bindTo(this.contextKeyService);
		this.signedInContext.set(this.existingSessionId !== undefined);
	}

	/**
	 * @param resource: The resource to retrieve content for.
	 * @param content An object representing resource state to be restored.
	 * @returns The ref of the stored state.
	 */
	async write(resource: SyncResource, content: string | EditSession): Promise<string> {
		await this.initialize('write', false);
		if (!this.initialized) {
			throw new Error('Please sign in to store your edit session.');
		}

		if (typeof content !== 'string' && content.machine === undefined) {
			content.machine = await this.getOrCreateCurrentMachineId();
		}

		content = typeof content === 'string' ? content : JSON.stringify(content);
		const ref = await this.storeClient!.writeResource(resource, content, null, undefined, createSyncHeaders(generateUuid()));

		this._lastWrittenResources.set(resource, { ref, content });

		return ref;
	}

	/**
	 * @param resource: The resource to retrieve content for.
	 * @param ref: A specific content ref to retrieve content for, if it exists.
	 * If undefined, this method will return the latest saved edit session, if any.
	 *
	 * @returns An object representing the requested or latest state, if any.
	 */
	async read(resource: SyncResource, ref: string | undefined): Promise<{ ref: string; content: string } | undefined> {
		await this.initialize('read', false);
		if (!this.initialized) {
			throw new Error('Please sign in to apply your latest edit session.');
		}

		let content: string | undefined | null;
		const headers = createSyncHeaders(generateUuid());
		try {
			if (ref !== undefined) {
				content = await this.storeClient?.resolveResourceContent(resource, ref, undefined, headers);
			} else {
				const result = await this.storeClient?.readResource(resource, null, undefined, headers);
				content = result?.content;
				ref = result?.ref;
			}
		} catch (ex) {
			this.logService.error(ex);
		}

		// TODO@joyceerhl Validate session data, check schema version
		if (content !== undefined && content !== null && ref !== undefined) {
			this._lastReadResources.set(resource, { ref, content });
			return { ref, content };
		}
		return undefined;
	}

	async delete(resource: SyncResource, ref: string | null) {
		await this.initialize('write', false);
		if (!this.initialized) {
			throw new Error(`Unable to delete edit session with ref ${ref}.`);
		}

		try {
			await this.storeClient?.deleteResource(resource, ref);
		} catch (ex) {
			this.logService.error(ex);
		}
	}

	async list(resource: SyncResource): Promise<IResourceRefHandle[]> {
		await this.initialize('read', false);
		if (!this.initialized) {
			throw new Error(`Unable to list edit sessions.`);
		}

		try {
			return this.storeClient?.getAllResourceRefs(resource) ?? [];
		} catch (ex) {
			this.logService.error(ex);
		}

		return [];
	}

	public async initialize(reason: 'read' | 'write', silent: boolean = false) {
		if (this.initialized) {
			return true;
		}
		this.initialized = await this.doInitialize(reason, silent);
		this.signedInContext.set(this.initialized);
		if (this.initialized) {
			this._didSignIn.fire();
		}
		return this.initialized;

	}

	/**
	 *
	 * Ensures that the store client is initialized,
	 * meaning that authentication is configured and it
	 * can be used to communicate with the remote storage service
	 */
	private async doInitialize(reason: 'read' | 'write', silent: boolean): Promise<boolean> {
		// Wait for authentication extensions to be registered
		await this.extensionService.whenInstalledExtensionsRegistered();

		if (!this.serverConfiguration?.url) {
			throw new Error('Unable to initialize sessions sync as session sync preference is not configured in product.json.');
		}

		if (this.storeClient === undefined) {
			return false;
		}

		this._register(this.storeClient.onTokenFailed(() => {
			this.logService.info('Clearing edit sessions authentication preference because of successive token failures.');
			this.clearAuthenticationPreference();
		}));

		if (this.machineClient === undefined) {
			this.machineClient = new UserDataSyncMachinesService(this.environmentService, this.fileService, this.storageService, this.storeClient, this.logService, this.productService);
		}

		// If we already have an existing auth session in memory, use that
		if (this.authenticationInfo !== undefined) {
			return true;
		}

		const authenticationSession = await this.getAuthenticationSession(reason, silent);
		if (authenticationSession !== undefined) {
			this.authenticationInfo = authenticationSession;
			this.storeClient.setAuthToken(authenticationSession.token, authenticationSession.providerId);
		}

		return authenticationSession !== undefined;
	}

	private cachedMachines: Map<string, string> | undefined;

	async getMachineById(machineId: string) {
		await this.initialize('read', false);

		if (!this.cachedMachines) {
			const machines = await this.machineClient!.getMachines();
			this.cachedMachines = machines.reduce((map, machine) => map.set(machine.id, machine.name), new Map<string, string>());
		}

		return this.cachedMachines.get(machineId);
	}

	private async getOrCreateCurrentMachineId(): Promise<string> {
		const currentMachineId = await this.machineClient!.getMachines().then((machines) => machines.find((m) => m.isCurrent)?.id);

		if (currentMachineId === undefined) {
			await this.machineClient!.addCurrentMachine();
			return await this.machineClient!.getMachines().then((machines) => machines.find((m) => m.isCurrent)!.id);
		}

		return currentMachineId;
	}

	private async getAuthenticationSession(reason: 'read' | 'write', silent: boolean) {
		// If the user signed in previously and the session is still available, reuse that without prompting the user again
		if (this.existingSessionId) {
			this.logService.info(`Searching for existing authentication session with ID ${this.existingSessionId}`);
			const existingSession = await this.getExistingSession();
			if (existingSession) {
				this.logService.info(`Found existing authentication session with ID ${existingSession.session.id}`);
				return { sessionId: existingSession.session.id, token: existingSession.session.idToken ?? existingSession.session.accessToken, providerId: existingSession.session.providerId };
			} else {
				this._didSignOut.fire();
			}
		}

		// If settings sync is already enabled, avoid asking again to authenticate
		if (this.shouldAttemptEditSessionInit()) {
			this.logService.info(`Reusing user data sync enablement`);
			const authenticationSessionInfo = await getCurrentAuthenticationSessionInfo(this.secretStorageService, this.productService);
			if (authenticationSessionInfo !== undefined) {
				this.logService.info(`Using current authentication session with ID ${authenticationSessionInfo.id}`);
				this.existingSessionId = authenticationSessionInfo.id;
				return { sessionId: authenticationSessionInfo.id, token: authenticationSessionInfo.accessToken, providerId: authenticationSessionInfo.providerId };
			}
		}

		// If we aren't supposed to prompt the user because
		// we're in a silent flow, just return here
		if (silent) {
			return;
		}

		// Ask the user to pick a preferred account
		const authenticationSession = await this.getAccountPreference(reason);
		if (authenticationSession !== undefined) {
			this.existingSessionId = authenticationSession.id;
			return { sessionId: authenticationSession.id, token: authenticationSession.idToken ?? authenticationSession.accessToken, providerId: authenticationSession.providerId };
		}

		return undefined;
	}

	private shouldAttemptEditSessionInit(): boolean {
		return isWeb && this.storageService.isNew(StorageScope.APPLICATION) && this.storageService.isNew(StorageScope.WORKSPACE);
	}

	/**
	 *
	 * Prompts the user to pick an authentication option for storing and getting edit sessions.
	 */
	private async getAccountPreference(reason: 'read' | 'write'): Promise<AuthenticationSession & { providerId: string } | undefined> {
		const disposables = new DisposableStore();
		const quickpick = disposables.add(this.quickInputService.createQuickPick<ExistingSession | AuthenticationProviderOption | IQuickPickItem>({ useSeparators: true }));
		quickpick.ok = false;
		quickpick.placeholder = reason === 'read' ? localize('choose account read placeholder', "Select an account to restore your working changes from the cloud") : localize('choose account placeholder', "Select an account to store your working changes in the cloud");
		quickpick.ignoreFocusOut = true;
		quickpick.items = await this.createQuickpickItems();

		return new Promise((resolve, reject) => {
			disposables.add(quickpick.onDidHide((e) => {
				reject(new CancellationError());
				disposables.dispose();
			}));

			disposables.add(quickpick.onDidAccept(async (e) => {
				const selection = quickpick.selectedItems[0];
				const session = 'provider' in selection ? { ...await this.authenticationService.createSession(selection.provider.id, selection.provider.scopes), providerId: selection.provider.id } : ('session' in selection ? selection.session : undefined);
				resolve(session);
				quickpick.hide();
			}));

			quickpick.show();
		});
	}

	private async createQuickpickItems(): Promise<(ExistingSession | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[]> {
		const options: (ExistingSession | AuthenticationProviderOption | IQuickPickSeparator | IQuickPickItem & { canceledAuthentication: boolean })[] = [];

		options.push({ type: 'separator', label: localize('signed in', "Signed In") });

		const sessions = await this.getAllSessions();
		options.push(...sessions);

		options.push({ type: 'separator', label: localize('others', "Others") });

		for (const authenticationProvider of (await this.getAuthenticationProviders())) {
			const signedInForProvider = sessions.some(account => account.session.providerId === authenticationProvider.id);
			if (!signedInForProvider || this.authenticationService.getProvider(authenticationProvider.id).supportsMultipleAccounts) {
				const providerName = this.authenticationService.getProvider(authenticationProvider.id).label;
				options.push({ label: localize('sign in using account', "Sign in with {0}", providerName), provider: authenticationProvider });
			}
		}

		return options;
	}

	/**
	 *
	 * Returns all authentication sessions available from {@link getAuthenticationProviders}.
	 */
	private async getAllSessions() {
		const authenticationProviders = await this.getAuthenticationProviders();
		const accounts = new Map<string, ExistingSession>();
		let currentSession: ExistingSession | undefined;

		for (const provider of authenticationProviders) {
			const sessions = await this.authenticationService.getSessions(provider.id, provider.scopes);

			for (const session of sessions) {
				const item = {
					label: session.account.label,
					description: this.authenticationService.getProvider(provider.id).label,
					session: { ...session, providerId: provider.id }
				};
				accounts.set(item.session.account.id, item);
				if (this.existingSessionId === session.id) {
					currentSession = item;
				}
			}
		}

		if (currentSession !== undefined) {
			accounts.set(currentSession.session.account.id, currentSession);
		}

		return [...accounts.values()].sort((a, b) => a.label.localeCompare(b.label));
	}

	/**
	 *
	 * Returns all authentication providers which can be used to authenticate
	 * to the remote storage service, based on product.json configuration
	 * and registered authentication providers.
	 */
	private async getAuthenticationProviders() {
		if (!this.serverConfiguration) {
			throw new Error('Unable to get configured authentication providers as session sync preference is not configured in product.json.');
		}

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

	private get existingSessionId() {
		return this.storageService.get(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
	}

	private set existingSessionId(sessionId: string | undefined) {
		this.logService.trace(`Saving authentication session preference for ID ${sessionId}.`);
		if (sessionId === undefined) {
			this.storageService.remove(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, StorageScope.APPLICATION);
		} else {
			this.storageService.store(EditSessionsWorkbenchService.CACHED_SESSION_STORAGE_KEY, sessionId, StorageScope.APPLICATION, StorageTarget.MACHINE);
		}
	}

	private async getExistingSession() {
		const accounts = await this.getAllSessions();
		return accounts.find((account) => account.session.id === this.existingSessionId);
	}

	private async onDidChangeStorage(): Promise<void> {
		const newSessionId = this.existingSessionId;
		const previousSessionId = this.authenticationInfo?.sessionId;

		if (previousSessionId !== newSessionId) {
			this.logService.trace(`Resetting authentication state because authentication session ID preference changed from ${previousSessionId} to ${newSessionId}.`);
			this.authenticationInfo = undefined;
			this.initialized = false;
		}
	}

	private clearAuthenticationPreference(): void {
		this.authenticationInfo = undefined;
		this.initialized = false;
		this.existingSessionId = undefined;
		this.signedInContext.set(false);
	}

	private onDidChangeSessions(e: AuthenticationSessionsChangeEvent): void {
		if (this.authenticationInfo?.sessionId && e.removed?.find(session => session.id === this.authenticationInfo?.sessionId)) {
			this.clearAuthenticationPreference();
		}
	}

	private registerSignInAction() {
		if (!this.serverConfiguration?.url) {
			return;
		}
		const that = this;
		const id = 'workbench.editSessions.actions.signIn';
		const when = ContextKeyExpr.and(ContextKeyExpr.equals(EDIT_SESSIONS_PENDING_KEY, false), ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, false));
		this._register(registerAction2(class ResetEditSessionAuthenticationAction extends Action2 {
			constructor() {
				super({
					id,
					title: localize('sign in', 'Turn on Cloud Changes...'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					precondition: when,
					menu: [{
						id: MenuId.CommandPalette,
					},
					{
						id: MenuId.AccountsContext,
						group: '2_editSessions',
						when,
					}]
				});
			}

			async run() {
				return await that.initialize('write', false);
			}
		}));

		this._register(MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '2_editSessions',
			command: {
				id,
				title: localize('sign in badge', 'Turn on Cloud Changes... (1)'),
			},
			when: ContextKeyExpr.and(ContextKeyExpr.equals(EDIT_SESSIONS_PENDING_KEY, true), ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, false))
		}));
	}

	private registerResetAuthenticationAction() {
		const that = this;
		this._register(registerAction2(class ResetEditSessionAuthenticationAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.resetAuth',
					title: localize('reset auth.v3', 'Turn off Cloud Changes...'),
					category: EDIT_SESSION_SYNC_CATEGORY,
					precondition: ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, true),
					menu: [{
						id: MenuId.CommandPalette,
					},
					{
						id: MenuId.AccountsContext,
						group: '2_editSessions',
						when: ContextKeyExpr.equals(EDIT_SESSIONS_SIGNED_IN_KEY, true),
					}]
				});
			}

			async run() {
				const result = await that.dialogService.confirm({
					message: localize('sign out of cloud changes clear data prompt', 'Do you want to disable storing working changes in the cloud?'),
					checkbox: { label: localize('delete all cloud changes', 'Delete all stored data from the cloud.') }
				});
				if (result.confirmed) {
					if (result.checkboxChecked) {
						that.storeClient?.deleteResource('editSessions', null);
					}
					that.clearAuthenticationPreference();
				}
			}
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/browser/editSessionsViews.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/browser/editSessionsViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { TreeView, TreeViewPane } from '../../../browser/parts/views/treeView.js';
import { Extensions, ITreeItem, ITreeViewDataProvider, ITreeViewDescriptor, IViewsRegistry, TreeItemCollapsibleState, TreeViewItemHandleArg, ViewContainer } from '../../../common/views.js';
import { ChangeType, EDIT_SESSIONS_DATA_VIEW_ID, EDIT_SESSIONS_SCHEME, EDIT_SESSIONS_SHOW_VIEW, EDIT_SESSIONS_TITLE, EditSession, IEditSessionsStorageService } from '../common/editSessions.js';
import { URI } from '../../../../base/common/uri.js';
import { fromNow } from '../../../../base/common/date.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { joinPath } from '../../../../base/common/resources.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { basename } from '../../../../base/common/path.js';
import { createCommandUri } from '../../../../base/common/htmlContent.js';

const EDIT_SESSIONS_COUNT_KEY = 'editSessionsCount';
const EDIT_SESSIONS_COUNT_CONTEXT_KEY = new RawContextKey<number>(EDIT_SESSIONS_COUNT_KEY, 0);

export class EditSessionsDataViews extends Disposable {
	constructor(
		container: ViewContainer,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();
		this.registerViews(container);
	}

	private registerViews(container: ViewContainer): void {
		const viewId = EDIT_SESSIONS_DATA_VIEW_ID;
		const treeView = this.instantiationService.createInstance(TreeView, viewId, EDIT_SESSIONS_TITLE.value);
		treeView.showCollapseAllAction = true;
		treeView.showRefreshAction = true;
		treeView.dataProvider = this.instantiationService.createInstance(EditSessionDataViewDataProvider);

		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		// eslint-disable-next-line local/code-no-dangerous-type-assertions
		viewsRegistry.registerViews([<ITreeViewDescriptor>{
			id: viewId,
			name: EDIT_SESSIONS_TITLE,
			ctorDescriptor: new SyncDescriptor(TreeViewPane),
			canToggleVisibility: true,
			canMoveView: false,
			treeView,
			collapsed: false,
			when: ContextKeyExpr.and(EDIT_SESSIONS_SHOW_VIEW),
			order: 100,
			hideByDefault: true,
		}], container);

		viewsRegistry.registerViewWelcomeContent(viewId, {
			content: localize(
				'noStoredChanges',
				'You have no stored changes in the cloud to display.\n{0}',
				`[${localize('storeWorkingChangesTitle', 'Store Working Changes')}](${createCommandUri('workbench.editSessions.actions.store')})`,
			),
			when: ContextKeyExpr.equals(EDIT_SESSIONS_COUNT_KEY, 0),
			order: 1
		});

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.resume',
					title: localize('workbench.editSessions.actions.resume.v2', "Resume Working Changes"),
					icon: Codicon.desktopDownload,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.regex('viewItem', /edit-session/i)),
						group: 'inline'
					}
				});
			}

			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const editSessionId = URI.parse(handle.$treeItemHandle).path.substring(1);
				const commandService = accessor.get(ICommandService);
				await commandService.executeCommand('workbench.editSessions.actions.resumeLatest', editSessionId, true);
				await treeView.refresh();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.store',
					title: localize('workbench.editSessions.actions.store.v2', "Store Working Changes"),
					icon: Codicon.cloudUpload,
				});
			}

			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const commandService = accessor.get(ICommandService);
				await commandService.executeCommand('workbench.editSessions.actions.storeCurrent');
				await treeView.refresh();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.delete',
					title: localize('workbench.editSessions.actions.delete.v2', "Delete Working Changes"),
					icon: Codicon.trash,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.regex('viewItem', /edit-session/i)),
						group: 'inline'
					}
				});
			}

			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const editSessionId = URI.parse(handle.$treeItemHandle).path.substring(1);
				const dialogService = accessor.get(IDialogService);
				const editSessionStorageService = accessor.get(IEditSessionsStorageService);
				const result = await dialogService.confirm({
					message: localize('confirm delete.v2', 'Are you sure you want to permanently delete your working changes with ref {0}?', editSessionId),
					detail: localize('confirm delete detail.v2', ' You cannot undo this action.'),
					type: 'warning',
					title: EDIT_SESSIONS_TITLE.value
				});
				if (result.confirmed) {
					await editSessionStorageService.delete('editSessions', editSessionId);
					await treeView.refresh();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.editSessions.actions.deleteAll',
					title: localize('workbench.editSessions.actions.deleteAll', "Delete All Working Changes from Cloud"),
					icon: Codicon.trash,
					menu: {
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.greater(EDIT_SESSIONS_COUNT_KEY, 0)),
					}
				});
			}

			async run(accessor: ServicesAccessor): Promise<void> {
				const dialogService = accessor.get(IDialogService);
				const editSessionStorageService = accessor.get(IEditSessionsStorageService);
				const result = await dialogService.confirm({
					message: localize('confirm delete all', 'Are you sure you want to permanently delete all stored changes from the cloud?'),
					detail: localize('confirm delete all detail', ' You cannot undo this action.'),
					type: 'warning',
					title: EDIT_SESSIONS_TITLE.value
				});
				if (result.confirmed) {
					await editSessionStorageService.delete('editSessions', null);
					await treeView.refresh();
				}
			}
		}));
	}
}

class EditSessionDataViewDataProvider implements ITreeViewDataProvider {

	private editSessionsCount;

	constructor(
		@IEditSessionsStorageService private readonly editSessionsStorageService: IEditSessionsStorageService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IFileService private readonly fileService: IFileService,
	) {
		this.editSessionsCount = EDIT_SESSIONS_COUNT_CONTEXT_KEY.bindTo(this.contextKeyService);
	}

	async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		if (!element) {
			return this.getAllEditSessions();
		}

		const [ref, folderName, filePath] = URI.parse(element.handle).path.substring(1).split('/');

		if (ref && !folderName) {
			return this.getEditSession(ref);
		} else if (ref && folderName && !filePath) {
			return this.getEditSessionFolderContents(ref, folderName);
		}

		return [];
	}

	private async getAllEditSessions(): Promise<ITreeItem[]> {
		const allEditSessions = await this.editSessionsStorageService.list('editSessions');
		this.editSessionsCount.set(allEditSessions.length);
		const editSessions = [];

		for (const session of allEditSessions) {
			const resource = URI.from({ scheme: EDIT_SESSIONS_SCHEME, authority: 'remote-session-content', path: `/${session.ref}` });
			const sessionData = await this.editSessionsStorageService.read('editSessions', session.ref);
			if (!sessionData) {
				continue;
			}
			const content: EditSession = JSON.parse(sessionData.content);
			const label = content.folders.map((folder) => folder.name).join(', ') ?? session.ref;
			const machineId = content.machine;
			const machineName = machineId ? await this.editSessionsStorageService.getMachineById(machineId) : undefined;
			const description = machineName === undefined ? fromNow(session.created, true) : `${fromNow(session.created, true)}\u00a0\u00a0\u2022\u00a0\u00a0${machineName}`;

			editSessions.push({
				handle: resource.toString(),
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				label: { label },
				description: description,
				themeIcon: Codicon.repo,
				contextValue: `edit-session`
			});
		}

		return editSessions;
	}

	private async getEditSession(ref: string): Promise<ITreeItem[]> {
		const data = await this.editSessionsStorageService.read('editSessions', ref);

		if (!data) {
			return [];
		}
		const content: EditSession = JSON.parse(data.content);

		if (content.folders.length === 1) {
			const folder = content.folders[0];
			return this.getEditSessionFolderContents(ref, folder.name);
		}

		return content.folders.map((folder) => {
			const resource = URI.from({ scheme: EDIT_SESSIONS_SCHEME, authority: 'remote-session-content', path: `/${data.ref}/${folder.name}` });
			return {
				handle: resource.toString(),
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				label: { label: folder.name },
				themeIcon: Codicon.folder
			};
		});
	}

	private async getEditSessionFolderContents(ref: string, folderName: string): Promise<ITreeItem[]> {
		const data = await this.editSessionsStorageService.read('editSessions', ref);

		if (!data) {
			return [];
		}
		const content: EditSession = JSON.parse(data.content);

		const currentWorkspaceFolder = this.workspaceContextService.getWorkspace().folders.find((folder) => folder.name === folderName);
		const editSessionFolder = content.folders.find((folder) => folder.name === folderName);

		if (!editSessionFolder) {
			return [];
		}

		return Promise.all(editSessionFolder.workingChanges.map(async (change) => {
			const cloudChangeUri = URI.from({ scheme: EDIT_SESSIONS_SCHEME, authority: 'remote-session-content', path: `/${data.ref}/${folderName}/${change.relativeFilePath}` });

			if (currentWorkspaceFolder?.uri) {
				// find the corresponding file in the workspace
				const localCopy = joinPath(currentWorkspaceFolder.uri, change.relativeFilePath);
				if (change.type === ChangeType.Addition && await this.fileService.exists(localCopy)) {
					return {
						handle: cloudChangeUri.toString(),
						resourceUri: cloudChangeUri,
						collapsibleState: TreeItemCollapsibleState.None,
						label: { label: change.relativeFilePath },
						themeIcon: Codicon.file,
						command: {
							id: 'vscode.diff',
							title: localize('compare changes', 'Compare Changes'),
							arguments: [
								localCopy,
								cloudChangeUri,
								`${basename(change.relativeFilePath)} (${localize('local copy', 'Local Copy')} \u2194 ${localize('cloud changes', 'Cloud Changes')})`,
								undefined
							]
						}
					};
				}
			}

			return {
				handle: cloudChangeUri.toString(),
				resourceUri: cloudChangeUri,
				collapsibleState: TreeItemCollapsibleState.None,
				label: { label: change.relativeFilePath },
				themeIcon: Codicon.file,
				command: {
					id: API_OPEN_EDITOR_COMMAND_ID,
					title: localize('open file', 'Open File'),
					arguments: [cloudChangeUri, undefined, undefined]
				}
			};
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/common/editSessions.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/common/editSessions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { decodeBase64, VSBuffer } from '../../../../base/common/buffer.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { localize, localize2 } from '../../../../nls.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { IResourceRefHandle } from '../../../../platform/userDataSync/common/userDataSync.js';
import { Event } from '../../../../base/common/event.js';
import { StringSHA1 } from '../../../../base/common/hash.js';
import { EditSessionsStoreClient } from './editSessionsStorageClient.js';

export const EDIT_SESSION_SYNC_CATEGORY = localize2('cloud changes', 'Cloud Changes');

export type SyncResource = 'editSessions' | 'workspaceState';

export const IEditSessionsStorageService = createDecorator<IEditSessionsStorageService>('IEditSessionsStorageService');
export interface IEditSessionsStorageService {
	_serviceBrand: undefined;

	readonly SIZE_LIMIT: number;

	readonly isSignedIn: boolean;
	readonly onDidSignIn: Event<void>;
	readonly onDidSignOut: Event<void>;

	storeClient: EditSessionsStoreClient | undefined;

	lastReadResources: Map<SyncResource, { ref: string; content: string }>;
	lastWrittenResources: Map<SyncResource, { ref: string; content: string }>;

	initialize(reason: 'read' | 'write', silent?: boolean): Promise<boolean>;
	read(resource: SyncResource, ref: string | undefined): Promise<{ ref: string; content: string } | undefined>;
	write(resource: SyncResource, content: string | EditSession): Promise<string>;
	delete(resource: SyncResource, ref: string | null): Promise<void>;
	list(resource: SyncResource): Promise<IResourceRefHandle[]>;
	getMachineById(machineId: string): Promise<string | undefined>;
}

export const IEditSessionsLogService = createDecorator<IEditSessionsLogService>('IEditSessionsLogService');
export interface IEditSessionsLogService extends ILogService { }

export enum ChangeType {
	Addition = 1,
	Deletion = 2,
}

export enum FileType {
	File = 1,
}

interface Addition {
	relativeFilePath: string;
	fileType: FileType.File;
	contents: string;
	type: ChangeType.Addition;
}

interface Deletion {
	relativeFilePath: string;
	fileType: FileType.File;
	contents: undefined;
	type: ChangeType.Deletion;
}

export type Change = Addition | Deletion;

export interface Folder {
	name: string;
	canonicalIdentity: string | undefined;
	workingChanges: Change[];
	absoluteUri: string | undefined;
}

export const EditSessionSchemaVersion = 3;

export interface EditSession {
	version: number;
	workspaceStateId?: string;
	machine?: string;
	folders: Folder[];
}

export const EDIT_SESSIONS_SIGNED_IN_KEY = 'editSessionsSignedIn';
export const EDIT_SESSIONS_SIGNED_IN = new RawContextKey<boolean>(EDIT_SESSIONS_SIGNED_IN_KEY, false);

export const EDIT_SESSIONS_PENDING_KEY = 'editSessionsPending';
export const EDIT_SESSIONS_PENDING = new RawContextKey<boolean>(EDIT_SESSIONS_PENDING_KEY, false);

export const EDIT_SESSIONS_CONTAINER_ID = 'workbench.view.editSessions';
export const EDIT_SESSIONS_DATA_VIEW_ID = 'workbench.views.editSessions.data';
export const EDIT_SESSIONS_TITLE: ILocalizedString = localize2('cloud changes', 'Cloud Changes');

export const EDIT_SESSIONS_VIEW_ICON = registerIcon('edit-sessions-view-icon', Codicon.cloudDownload, localize('editSessionViewIcon', 'View icon of the cloud changes view.'));

export const EDIT_SESSIONS_SHOW_VIEW = new RawContextKey<boolean>('editSessionsShowView', false);

export const EDIT_SESSIONS_SCHEME = 'vscode-edit-sessions';

export function decodeEditSessionFileContent(version: number, content: string): VSBuffer {
	switch (version) {
		case 1:
			return VSBuffer.fromString(content);
		case 2:
			return decodeBase64(content);
		default:
			throw new Error('Upgrade to a newer version to decode this content.');
	}
}

export function hashedEditSessionId(editSessionId: string) {
	const sha1 = new StringSHA1();
	sha1.update(editSessionId);
	return sha1.digest();
}

export const editSessionsLogId = 'editSessions';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/common/editSessionsLogService.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/common/editSessionsLogService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { joinPath } from '../../../../base/common/resources.js';
import { localize } from '../../../../nls.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { AbstractLogger, ILogger, ILoggerService } from '../../../../platform/log/common/log.js';
import { windowLogGroup } from '../../../services/log/common/logConstants.js';
import { IEditSessionsLogService, editSessionsLogId } from './editSessions.js';

export class EditSessionsLogService extends AbstractLogger implements IEditSessionsLogService {

	declare readonly _serviceBrand: undefined;
	private readonly logger: ILogger;

	constructor(
		@ILoggerService loggerService: ILoggerService,
		@IEnvironmentService environmentService: IEnvironmentService
	) {
		super();
		this.logger = this._register(loggerService.createLogger(joinPath(environmentService.logsHome, `${editSessionsLogId}.log`), { id: editSessionsLogId, name: localize('cloudChangesLog', "Cloud Changes"), group: windowLogGroup }));
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

---[FILE: src/vs/workbench/contrib/editSessions/common/editSessionsStorageClient.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/common/editSessionsStorageClient.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UserDataSyncStoreClient } from '../../../../platform/userDataSync/common/userDataSyncStoreService.js';

export class EditSessionsStoreClient extends UserDataSyncStoreClient {
	_serviceBrand: undefined;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/common/workspaceStateSync.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/common/workspaceStateSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { parse, stringify } from '../../../../base/common/marshalling.js';
import { URI } from '../../../../base/common/uri.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IStorageEntry, IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { AbstractSynchroniser, IAcceptResult, IMergeResult, IResourcePreview, ISyncResourcePreview } from '../../../../platform/userDataSync/common/abstractSynchronizer.js';
import { IRemoteUserData, IResourceRefHandle, IUserDataSyncLocalStoreService, IUserDataSyncConfiguration, IUserDataSyncEnablementService, IUserDataSyncLogService, IUserDataSyncStoreService, IUserDataSynchroniser, IWorkspaceState, SyncResource, IUserDataSyncResourcePreview } from '../../../../platform/userDataSync/common/userDataSync.js';
import { EditSession, IEditSessionsStorageService } from './editSessions.js';
import { IWorkspaceIdentityService } from '../../../services/workspaces/common/workspaceIdentityService.js';


class NullBackupStoreService implements IUserDataSyncLocalStoreService {
	_serviceBrand: undefined;
	async writeResource(): Promise<void> {
		return;
	}
	async getAllResourceRefs(): Promise<IResourceRefHandle[]> {
		return [];
	}
	async resolveResourceContent(): Promise<string | null> {
		return null;
	}

}

class NullEnablementService implements IUserDataSyncEnablementService {
	_serviceBrand: undefined;

	private _onDidChangeEnablement = new Emitter<boolean>();
	readonly onDidChangeEnablement: Event<boolean> = this._onDidChangeEnablement.event;

	private _onDidChangeResourceEnablement = new Emitter<[SyncResource, boolean]>();
	readonly onDidChangeResourceEnablement: Event<[SyncResource, boolean]> = this._onDidChangeResourceEnablement.event;

	isEnabled(): boolean { return true; }
	canToggleEnablement(): boolean { return true; }
	setEnablement(_enabled: boolean): void { }
	isResourceEnabled(_resource: SyncResource): boolean { return true; }
	isResourceEnablementConfigured(_resource: SyncResource): boolean { return false; }
	setResourceEnablement(_resource: SyncResource, _enabled: boolean): void { }
	getResourceSyncStateVersion(_resource: SyncResource): string | undefined { return undefined; }

}

export class WorkspaceStateSynchroniser extends AbstractSynchroniser implements IUserDataSynchroniser {
	protected override version: number = 1;

	constructor(
		profile: IUserDataProfile,
		collection: string | undefined,
		userDataSyncStoreService: IUserDataSyncStoreService,
		logService: IUserDataSyncLogService,
		@IFileService fileService: IFileService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IConfigurationService configurationService: IConfigurationService,
		@IStorageService storageService: IStorageService,
		@IUriIdentityService uriIdentityService: IUriIdentityService,
		@IWorkspaceIdentityService private readonly workspaceIdentityService: IWorkspaceIdentityService,
		@IEditSessionsStorageService private readonly editSessionsStorageService: IEditSessionsStorageService,
	) {
		const userDataSyncLocalStoreService = new NullBackupStoreService();
		const userDataSyncEnablementService = new NullEnablementService();
		super({ syncResource: SyncResource.WorkspaceState, profile }, collection, fileService, environmentService, storageService, userDataSyncStoreService, userDataSyncLocalStoreService, userDataSyncEnablementService, telemetryService, logService, configurationService, uriIdentityService);
	}

	override async sync(): Promise<IUserDataSyncResourcePreview | null> {
		const cancellationTokenSource = new CancellationTokenSource();
		const folders = await this.workspaceIdentityService.getWorkspaceStateFolders(cancellationTokenSource.token);
		if (!folders.length) {
			return null;
		}

		// Ensure we have latest state by sending out onWillSaveState event
		await this.storageService.flush();

		const keys = this.storageService.keys(StorageScope.WORKSPACE, StorageTarget.USER);
		if (!keys.length) {
			return null;
		}

		const contributedData: IStringDictionary<string> = {};
		keys.forEach((key) => {
			const data = this.storageService.get(key, StorageScope.WORKSPACE);
			if (data) {
				contributedData[key] = data;
			}
		});

		const content: IWorkspaceState = { folders, storage: contributedData, version: this.version };
		await this.editSessionsStorageService.write('workspaceState', stringify(content));
		return null;
	}

	override async apply(): Promise<ISyncResourcePreview | null> {
		const payload = this.editSessionsStorageService.lastReadResources.get('editSessions')?.content;
		const workspaceStateId = payload ? (JSON.parse(payload) as EditSession).workspaceStateId : undefined;

		const resource = await this.editSessionsStorageService.read('workspaceState', workspaceStateId);
		if (!resource) {
			return null;
		}

		const remoteWorkspaceState: IWorkspaceState = parse(resource.content);
		if (!remoteWorkspaceState) {
			this.logService.info('Skipping initializing workspace state because remote workspace state does not exist.');
			return null;
		}

		// Evaluate whether storage is applicable for current workspace
		const cancellationTokenSource = new CancellationTokenSource();
		const replaceUris = await this.workspaceIdentityService.matches(remoteWorkspaceState.folders, cancellationTokenSource.token);
		if (!replaceUris) {
			this.logService.info('Skipping initializing workspace state because remote workspace state does not match current workspace.');
			return null;
		}

		const storage: IStringDictionary<any> = {};
		for (const key of Object.keys(remoteWorkspaceState.storage)) {
			storage[key] = remoteWorkspaceState.storage[key];
		}

		if (Object.keys(storage).length) {
			// Initialize storage with remote storage
			const storageEntries: Array<IStorageEntry> = [];
			for (const key of Object.keys(storage)) {
				// Deserialize the stored state
				try {
					const value = parse(storage[key]);
					// Run URI conversion on the stored state
					replaceUris(value);
					storageEntries.push({ key, value, scope: StorageScope.WORKSPACE, target: StorageTarget.USER });
				} catch {
					storageEntries.push({ key, value: storage[key], scope: StorageScope.WORKSPACE, target: StorageTarget.USER });
				}
			}
			this.storageService.storeAll(storageEntries, true);
		}

		this.editSessionsStorageService.delete('workspaceState', resource.ref);
		return null;
	}

	// TODO@joyceerhl implement AbstractSynchronizer in full
	protected override applyResult(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, result: [IResourcePreview, IAcceptResult][], force: boolean): Promise<void> {
		throw new Error('Method not implemented.');
	}
	protected override async generateSyncPreview(remoteUserData: IRemoteUserData, lastSyncUserData: IRemoteUserData | null, isRemoteDataFromCurrentMachine: boolean, userDataSyncConfiguration: IUserDataSyncConfiguration, token: CancellationToken): Promise<IResourcePreview[]> {
		return [];
	}
	protected override getMergeResult(resourcePreview: IResourcePreview, token: CancellationToken): Promise<IMergeResult> {
		throw new Error('Method not implemented.');
	}
	protected override getAcceptResult(resourcePreview: IResourcePreview, resource: URI, content: string | null | undefined, token: CancellationToken): Promise<IAcceptResult> {
		throw new Error('Method not implemented.');
	}
	protected override async hasRemoteChanged(lastSyncUserData: IRemoteUserData): Promise<boolean> {
		return true;
	}
	override async hasLocalData(): Promise<boolean> {
		return false;
	}
	override async resolveContent(uri: URI): Promise<string | null> {
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editSessions/test/browser/editSessions.test.ts]---
Location: vscode-main/src/vs/workbench/contrib/editSessions/test/browser/editSessions.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IFileService } from '../../../../../platform/files/common/files.js';
import { FileService } from '../../../../../platform/files/common/fileService.js';
import { Schemas } from '../../../../../base/common/network.js';
import { InMemoryFileSystemProvider } from '../../../../../platform/files/common/inMemoryFilesystemProvider.js';
import { TestInstantiationService } from '../../../../../platform/instantiation/test/common/instantiationServiceMock.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { EditSessionsContribution } from '../../browser/editSessions.contribution.js';
import { ProgressService } from '../../../../services/progress/browser/progressService.js';
import { IProgressService } from '../../../../../platform/progress/common/progress.js';
import { ISCMService } from '../../../scm/common/scm.js';
import { SCMService } from '../../../scm/common/scmService.js';
import { TestConfigurationService } from '../../../../../platform/configuration/test/common/testConfigurationService.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../../platform/workspace/common/workspace.js';
import { mock } from '../../../../../base/test/common/mock.js';
import * as sinon from 'sinon';
import assert from 'assert';
import { ChangeType, FileType, IEditSessionsLogService, IEditSessionsStorageService } from '../../common/editSessions.js';
import { URI } from '../../../../../base/common/uri.js';
import { joinPath } from '../../../../../base/common/resources.js';
import { INotificationService } from '../../../../../platform/notification/common/notification.js';
import { TestNotificationService } from '../../../../../platform/notification/test/common/testNotificationService.js';
import { TestEnvironmentService } from '../../../../test/browser/workbenchTestServices.js';
import { IEnvironmentService } from '../../../../../platform/environment/common/environment.js';
import { MockContextKeyService } from '../../../../../platform/keybinding/test/common/mockKeybindingService.js';
import { IContextKeyService } from '../../../../../platform/contextkey/common/contextkey.js';
import { IThemeService } from '../../../../../platform/theme/common/themeService.js';
import { Event } from '../../../../../base/common/event.js';
import { IViewDescriptorService } from '../../../../common/views.js';
import { ITextModelService } from '../../../../../editor/common/services/resolverService.js';
import { ILifecycleService } from '../../../../services/lifecycle/common/lifecycle.js';
import { IDialogService, IPrompt } from '../../../../../platform/dialogs/common/dialogs.js';
import { IEditorService, ISaveAllEditorsOptions } from '../../../../services/editor/common/editorService.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { NullTelemetryService } from '../../../../../platform/telemetry/common/telemetryUtils.js';
import { IRemoteAgentService } from '../../../../services/remote/common/remoteAgentService.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';
import { IEditSessionIdentityService } from '../../../../../platform/workspace/common/editSessions.js';
import { IUserDataProfilesService } from '../../../../../platform/userDataProfile/common/userDataProfile.js';
import { IProductService } from '../../../../../platform/product/common/productService.js';
import { IStorageService } from '../../../../../platform/storage/common/storage.js';
import { TestStorageService } from '../../../../test/common/workbenchTestServices.js';
import { IUriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentity.js';
import { UriIdentityService } from '../../../../../platform/uriIdentity/common/uriIdentityService.js';
import { IWorkspaceIdentityService, WorkspaceIdentityService } from '../../../../services/workspaces/common/workspaceIdentityService.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

const folderName = 'test-folder';
const folderUri = URI.file(`/${folderName}`);

suite('Edit session sync', () => {

	let instantiationService: TestInstantiationService;
	let editSessionsContribution: EditSessionsContribution;
	let fileService: FileService;
	let sandbox: sinon.SinonSandbox;

	const disposables = new DisposableStore();

	suiteSetup(() => {

		sandbox = sinon.createSandbox();

		instantiationService = new TestInstantiationService();

		// Set up filesystem
		const logService = new NullLogService();
		fileService = disposables.add(new FileService(logService));
		const fileSystemProvider = disposables.add(new InMemoryFileSystemProvider());
		fileService.registerProvider(Schemas.file, fileSystemProvider);

		// Stub out all services
		instantiationService.stub(IEditSessionsLogService, logService);
		instantiationService.stub(IFileService, fileService);
		instantiationService.stub(ILifecycleService, new class extends mock<ILifecycleService>() {
			override onWillShutdown = Event.None;
		});
		instantiationService.stub(INotificationService, new TestNotificationService());
		instantiationService.stub(IProductService, { 'editSessions.store': { url: 'https://test.com', canSwitch: true, authenticationProviders: {} } });
		instantiationService.stub(IStorageService, new TestStorageService());
		instantiationService.stub(IUriIdentityService, new UriIdentityService(fileService));
		instantiationService.stub(IEditSessionsStorageService, new class extends mock<IEditSessionsStorageService>() {
			override onDidSignIn = Event.None;
			override onDidSignOut = Event.None;
		});
		instantiationService.stub(IExtensionService, new class extends mock<IExtensionService>() {
			override onDidChangeExtensions = Event.None;
		});
		instantiationService.stub(IProgressService, ProgressService);
		instantiationService.stub(ISCMService, SCMService);
		instantiationService.stub(IEnvironmentService, TestEnvironmentService);
		instantiationService.stub(ITelemetryService, NullTelemetryService);
		instantiationService.stub(IDialogService, new class extends mock<IDialogService>() {
			override async prompt(prompt: IPrompt<any>) {
				const result = prompt.buttons?.[0].run({ checkboxChecked: false });
				return { result };
			}
			override async confirm() {
				return { confirmed: false };
			}
		});
		instantiationService.stub(IRemoteAgentService, new class extends mock<IRemoteAgentService>() {
			override async getEnvironment() {
				return null;
			}
		});
		instantiationService.stub(IConfigurationService, new TestConfigurationService({ workbench: { experimental: { editSessions: { enabled: true } } } }));
		instantiationService.stub(IWorkspaceContextService, new class extends mock<IWorkspaceContextService>() {
			override getWorkspace() {
				return {
					id: 'workspace-id',
					folders: [{
						uri: folderUri,
						name: folderName,
						index: 0,
						toResource: (relativePath: string) => joinPath(folderUri, relativePath)
					}]
				};
			}
			override getWorkbenchState() {
				return WorkbenchState.FOLDER;
			}
		});

		// Stub repositories
		instantiationService.stub(ISCMService, '_repositories', new Map());
		instantiationService.stub(IContextKeyService, new MockContextKeyService());
		instantiationService.stub(IThemeService, new class extends mock<IThemeService>() {
			override onDidColorThemeChange = Event.None;
			override onDidFileIconThemeChange = Event.None;
		});
		instantiationService.stub(IViewDescriptorService, {
			onDidChangeLocation: Event.None
		});
		instantiationService.stub(ITextModelService, new class extends mock<ITextModelService>() {
			override registerTextModelContentProvider = () => ({ dispose: () => { } });
		});
		instantiationService.stub(IEditorService, new class extends mock<IEditorService>() {
			override saveAll = async (_options: ISaveAllEditorsOptions) => { return { success: true, editors: [] }; };
		});
		instantiationService.stub(IEditSessionIdentityService, new class extends mock<IEditSessionIdentityService>() {
			override async getEditSessionIdentifier() {
				return 'test-identity';
			}
		});
		instantiationService.set(IWorkspaceIdentityService, instantiationService.createInstance(WorkspaceIdentityService));
		instantiationService.stub(IUserDataProfilesService, new class extends mock<IUserDataProfilesService>() {
			override defaultProfile = {
				id: 'default',
				name: 'Default',
				isDefault: true,
				location: URI.file('location'),
				globalStorageHome: URI.file('globalStorageHome'),
				settingsResource: URI.file('settingsResource'),
				keybindingsResource: URI.file('keybindingsResource'),
				tasksResource: URI.file('tasksResource'),
				mcpResource: URI.file('mcp.json'),
				snippetsHome: URI.file('snippetsHome'),
				promptsHome: URI.file('promptsHome'),
				extensionsResource: URI.file('extensionsResource'),
				cacheHome: URI.file('cacheHome'),
			};
		});

		editSessionsContribution = instantiationService.createInstance(EditSessionsContribution);
	});

	teardown(() => {
		sinon.restore();
		disposables.clear();
	});

	suiteTeardown(() => {
		disposables.dispose();
	});

	test('Can apply edit session', async function () {
		const fileUri = joinPath(folderUri, 'dir1', 'README.md');
		const fileContents = '# readme';
		const editSession = {
			version: 1,
			folders: [
				{
					name: folderName,
					workingChanges: [
						{
							relativeFilePath: 'dir1/README.md',
							fileType: FileType.File,
							contents: fileContents,
							type: ChangeType.Addition
						}
					]
				}
			]
		};

		// Stub sync service to return edit session data
		const readStub = sandbox.stub().returns({ content: JSON.stringify(editSession), ref: '0' });
		instantiationService.stub(IEditSessionsStorageService, 'read', readStub);

		// Create root folder
		await fileService.createFolder(folderUri);

		// Resume edit session
		await editSessionsContribution.resumeEditSession();

		// Verify edit session was correctly applied
		assert.equal((await fileService.readFile(fileUri)).value.toString(), fileContents);
	});

	test('Edit session not stored if there are no edits', async function () {
		const writeStub = sandbox.stub();
		instantiationService.stub(IEditSessionsStorageService, 'write', writeStub);

		// Create root folder
		await fileService.createFolder(folderUri);

		await editSessionsContribution.storeEditSession(true, CancellationToken.None);

		// Verify that we did not attempt to write the edit session
		assert.equal(writeStub.called, false);
	});

	ensureNoDisposablesAreLeakedInTestSuite();
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/editTelemetry.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/editTelemetry.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { EditTelemetryContribution } from './editTelemetryContribution.js';
import { EDIT_TELEMETRY_SETTING_ID, AI_STATS_SETTING_ID } from './settingIds.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { localize } from '../../../../nls.js';
import { EDIT_TELEMETRY_DETAILS_SETTING_ID, EDIT_TELEMETRY_SHOW_DECORATIONS, EDIT_TELEMETRY_SHOW_STATUS_BAR } from './settings.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IAiEditTelemetryService } from './telemetry/aiEditTelemetry/aiEditTelemetryService.js';
import { AiEditTelemetryServiceImpl } from './telemetry/aiEditTelemetry/aiEditTelemetryServiceImpl.js';
import { IRandomService, RandomService } from './randomService.js';

registerWorkbenchContribution2('EditTelemetryContribution', EditTelemetryContribution, WorkbenchPhase.AfterRestored);

const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
configurationRegistry.registerConfiguration({
	id: 'task',
	order: 100,
	title: localize('editTelemetry', "Edit Telemetry"),
	type: 'object',
	properties: {
		[EDIT_TELEMETRY_SETTING_ID]: {
			markdownDescription: localize('telemetry.editStats.enabled', "Controls whether to enable telemetry for edit statistics (only sends statistics if general telemetry is enabled)."),
			type: 'boolean',
			default: true,
			tags: ['experimental'],
		},
		[AI_STATS_SETTING_ID]: {
			markdownDescription: localize('editor.aiStats.enabled', "Controls whether to enable AI statistics in the editor. The gauge represents the average amount of code inserted by AI vs manual typing over a 24 hour period."),
			type: 'boolean',
			default: false,
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[EDIT_TELEMETRY_DETAILS_SETTING_ID]: {
			markdownDescription: localize('telemetry.editStats.detailed.enabled', "Controls whether to enable telemetry for detailed edit statistics (only sends statistics if general telemetry is enabled)."),
			type: 'boolean',
			default: false,
			tags: ['experimental'],
			experiment: {
				mode: 'auto'
			}
		},
		[EDIT_TELEMETRY_SHOW_STATUS_BAR]: {
			markdownDescription: localize('telemetry.editStats.showStatusBar', "Controls whether to show the status bar for edit telemetry."),
			type: 'boolean',
			default: false,
			tags: ['experimental'],
		},
		[EDIT_TELEMETRY_SHOW_DECORATIONS]: {
			markdownDescription: localize('telemetry.editStats.showDecorations', "Controls whether to show decorations for edit telemetry."),
			type: 'boolean',
			default: false,
			tags: ['experimental'],
		},
	}
});

registerSingleton(IAiEditTelemetryService, AiEditTelemetryServiceImpl, InstantiationType.Delayed);
registerSingleton(IRandomService, RandomService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/editTelemetryContribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/editTelemetryContribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { autorun, derived } from '../../../../base/common/observable.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { observableConfigValue } from '../../../../platform/observable/common/platformObservableUtils.js';
import { ITelemetryService, TelemetryLevel, telemetryLevelEnabled } from '../../../../platform/telemetry/common/telemetry.js';
import { AnnotatedDocuments } from './helpers/annotatedDocuments.js';
import { EditTrackingFeature } from './telemetry/editSourceTrackingFeature.js';
import { VSCodeWorkspace } from './helpers/vscodeObservableWorkspace.js';
import { AiStatsFeature } from './editStats/aiStatsFeature.js';
import { EDIT_TELEMETRY_SETTING_ID, AI_STATS_SETTING_ID } from './settingIds.js';

export class EditTelemetryContribution extends Disposable {
	constructor(
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super();

		const workspace = derived(reader => reader.store.add(this._instantiationService.createInstance(VSCodeWorkspace)));
		const annotatedDocuments = derived(reader => reader.store.add(this._instantiationService.createInstance(AnnotatedDocuments, workspace.read(reader))));

		const editSourceTrackingEnabled = observableConfigValue(EDIT_TELEMETRY_SETTING_ID, true, this._configurationService);
		this._register(autorun(r => {
			const enabled = editSourceTrackingEnabled.read(r);
			if (!enabled || !telemetryLevelEnabled(this._telemetryService, TelemetryLevel.USAGE)) {
				return;
			}
			r.store.add(this._instantiationService.createInstance(EditTrackingFeature, workspace.read(r), annotatedDocuments.read(r)));
		}));

		const aiStatsEnabled = observableConfigValue(AI_STATS_SETTING_ID, true, this._configurationService);
		this._register(autorun(r => {
			const enabled = aiStatsEnabled.read(r);
			if (!enabled) {
				return;
			}

			r.store.add(this._instantiationService.createInstance(AiStatsFeature, annotatedDocuments.read(r)));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/randomService.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/randomService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { generateUuid } from '../../../../base/common/uuid.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IRandomService = createDecorator<IRandomService>('randomService');

export interface IRandomService {
	readonly _serviceBrand: undefined;

	generateUuid(): string;
	generatePrefixedUuid(prefix: string): string;
}

export class RandomService implements IRandomService {
	readonly _serviceBrand: undefined;

	generateUuid(): string {
		return generateUuid();
	}

	/** Namespace should be 3 letter. */
	generatePrefixedUuid(namespace: string): string {
		return `${namespace}-${this.generateUuid()}`;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/settingIds.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/settingIds.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const EDIT_TELEMETRY_SETTING_ID = 'telemetry.editStats.enabled';
export const AI_STATS_SETTING_ID = 'editor.aiStats.enabled';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/settings.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/settings.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const EDIT_TELEMETRY_DETAILS_SETTING_ID = 'telemetry.editStats.details.enabled';
export const EDIT_TELEMETRY_SHOW_DECORATIONS = 'telemetry.editStats.showDecorations';
export const EDIT_TELEMETRY_SHOW_STATUS_BAR = 'telemetry.editStats.showStatusBar';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/editStats/aiStatsFeature.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/editStats/aiStatsFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { sumBy } from '../../../../../base/common/arrays.js';
import { TaskQueue, timeout } from '../../../../../base/common/async.js';
import { Lazy } from '../../../../../base/common/lazy.js';
import { Disposable, DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { autorun, derived, mapObservableArrayCached, observableValue, runOnChange } from '../../../../../base/common/observable.js';
import { AnnotatedStringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { isAiEdit, isUserEdit } from '../../../../../editor/common/textModelEditSource.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../../platform/storage/common/storage.js';
import { AnnotatedDocuments } from '../helpers/annotatedDocuments.js';
import { AiStatsStatusBar } from './aiStatsStatusBar.js';

export class AiStatsFeature extends Disposable {
	private readonly _data: IValue<IData>;
	private readonly _dataVersion = observableValue(this, 0);

	constructor(
		annotatedDocuments: AnnotatedDocuments,
		@IStorageService private readonly _storageService: IStorageService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		const storedValue = getStoredValue<IData>(this._storageService, 'aiStats', StorageScope.WORKSPACE, StorageTarget.USER);
		this._data = rateLimitWrite<IData>(storedValue, 1 / 60, this._store);

		this.aiRate.recomputeInitiallyAndOnChange(this._store);

		this._register(autorun(reader => {
			reader.store.add(this._instantiationService.createInstance(AiStatsStatusBar.hot.read(reader), this));
		}));


		const lastRequestIds: string[] = [];

		const obs = mapObservableArrayCached(this, annotatedDocuments.documents, (doc, store) => {
			store.add(runOnChange(doc.documentWithAnnotations.value, (_val, _prev, edit) => {
				const e = AnnotatedStringEdit.compose(edit.map(e => e.edit));

				const curSession = new Lazy(() => this._getDataAndSession());

				for (const r of e.replacements) {
					if (isAiEdit(r.data.editSource)) {
						curSession.value.currentSession.aiCharacters += r.newText.length;
					} else if (isUserEdit(r.data.editSource)) {
						curSession.value.currentSession.typedCharacters += r.newText.length;
					}
				}

				if (e.replacements.length > 0) {
					const sessionToUpdate = curSession.value.currentSession;
					const s = e.replacements[0].data.editSource;
					if (s.metadata.source === 'inlineCompletionAccept') {
						if (sessionToUpdate.acceptedInlineSuggestions === undefined) {
							sessionToUpdate.acceptedInlineSuggestions = 0;
						}
						sessionToUpdate.acceptedInlineSuggestions += 1;
					}

					if (s.metadata.source === 'Chat.applyEdits' && s.metadata.$$requestId !== undefined) {
						const didSeeRequestId = lastRequestIds.includes(s.metadata.$$requestId);
						if (!didSeeRequestId) {
							lastRequestIds.push(s.metadata.$$requestId);
							if (lastRequestIds.length > 10) {
								lastRequestIds.shift();
							}
							if (sessionToUpdate.chatEditCount === undefined) {
								sessionToUpdate.chatEditCount = 0;
							}
							sessionToUpdate.chatEditCount += 1;
						}
					}
				}

				if (curSession.hasValue) {
					this._data.writeValue(curSession.value.data);
					this._dataVersion.set(this._dataVersion.get() + 1, undefined);
				}
			}));
		});

		obs.recomputeInitiallyAndOnChange(this._store);
	}

	public readonly aiRate = this._dataVersion.map(() => {
		const val = this._data.getValue();
		if (!val) {
			return 0;
		}

		const r = average(val.sessions, session => {
			const sum = session.typedCharacters + session.aiCharacters;
			if (sum === 0) {
				return 0;
			}
			return session.aiCharacters / sum;
		});

		return r;
	});

	public readonly sessionCount = derived(this, r => {
		this._dataVersion.read(r);
		const val = this._data.getValue();
		if (!val) {
			return 0;
		}
		return val.sessions.length;
	});

	public readonly acceptedInlineSuggestionsToday = derived(this, r => {
		this._dataVersion.read(r);
		const val = this._data.getValue();
		if (!val) {
			return 0;
		}
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);

		const sessionsToday = val.sessions.filter(s => s.startTime > startOfToday.getTime());
		return sumBy(sessionsToday, s => s.acceptedInlineSuggestions ?? 0);
	});

	private _getDataAndSession(): { data: IData; currentSession: ISession } {
		const state = this._data.getValue() ?? { sessions: [] };

		const sessionLengthMs = 5 * 60 * 1000; // 5 minutes

		let lastSession = state.sessions.at(-1);
		const nowTime = Date.now();
		if (!lastSession || nowTime - lastSession.startTime > sessionLengthMs) {
			state.sessions.push({
				startTime: nowTime,
				typedCharacters: 0,
				aiCharacters: 0,
				acceptedInlineSuggestions: 0,
				chatEditCount: 0,
			});
			lastSession = state.sessions.at(-1)!;

			const dayMs = 24 * 60 * 60 * 1000; // 24h
			// Clean up old sessions, keep only the last 24h worth of sessions
			while (state.sessions.length > dayMs / sessionLengthMs) {
				state.sessions.shift();
			}
		}
		return { data: state, currentSession: lastSession };
	}
}

interface IData {
	sessions: ISession[];
}

// 5 min window
interface ISession {
	startTime: number;
	typedCharacters: number;
	aiCharacters: number;
	acceptedInlineSuggestions: number | undefined;
	chatEditCount: number | undefined;
}


function average<T>(arr: T[], selector: (item: T) => number): number {
	if (arr.length === 0) {
		return 0;
	}
	const s = sumBy(arr, selector);
	return s / arr.length;
}


interface IValue<T> {
	writeValue(value: T | undefined): void;
	getValue(): T | undefined;
}

function rateLimitWrite<T>(targetValue: IValue<T>, maxWritesPerSecond: number, store: DisposableStore): IValue<T> {
	const queue = new TaskQueue();
	let _value: T | undefined = undefined;
	let valueVersion = 0;
	let savedVersion = 0;
	store.add(toDisposable(() => {
		if (valueVersion !== savedVersion) {
			targetValue.writeValue(_value);
			savedVersion = valueVersion;
		}
	}));

	return {
		writeValue(value: T | undefined): void {
			valueVersion++;
			const v = valueVersion;
			_value = value;

			queue.clearPending();
			queue.schedule(async () => {
				targetValue.writeValue(value);
				savedVersion = v;
				await timeout(5000);
			});
		},
		getValue(): T | undefined {
			if (valueVersion > 0) {
				return _value;
			}
			return targetValue.getValue();
		}
	};
}

function getStoredValue<T>(service: IStorageService, key: string, scope: StorageScope, target: StorageTarget): IValue<T> {
	let lastValue: T | undefined = undefined;
	let hasLastValue = false;
	return {
		writeValue(value: T | undefined): void {
			if (value === undefined) {
				service.remove(key, scope);
			} else {
				service.store(key, JSON.stringify(value), scope, target);
			}
			lastValue = value;
		},
		getValue(): T | undefined {
			if (hasLastValue) {
				return lastValue;
			}
			const strVal = service.get(key, scope);
			lastValue = strVal === undefined ? undefined : JSON.parse(strVal) as T | undefined;
			hasLastValue = true;
			return lastValue;
		}
	};
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/editStats/aiStatsStatusBar.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/editStats/aiStatsStatusBar.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { n } from '../../../../../base/browser/dom.js';
import { ActionBar, IActionBarOptions, IActionOptions } from '../../../../../base/browser/ui/actionbar/actionbar.js';
import { IAction } from '../../../../../base/common/actions.js';
import { Codicon } from '../../../../../base/common/codicons.js';
import { createHotClass } from '../../../../../base/common/hotReloadHelpers.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { autorun, derived } from '../../../../../base/common/observable.js';
import { ThemeIcon } from '../../../../../base/common/themables.js';
import { localize } from '../../../../../nls.js';
import { ICommandService } from '../../../../../platform/commands/common/commands.js';
import { nativeHoverDelegate } from '../../../../../platform/hover/browser/hover.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IStatusbarService, StatusbarAlignment } from '../../../../services/statusbar/browser/statusbar.js';
import { AI_STATS_SETTING_ID } from '../settingIds.js';
import type { AiStatsFeature } from './aiStatsFeature.js';
import './media.css';

export class AiStatsStatusBar extends Disposable {
	public static readonly hot = createHotClass(this);

	constructor(
		private readonly _aiStatsFeature: AiStatsFeature,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@ICommandService private readonly _commandService: ICommandService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
	) {
		super();

		this._register(autorun((reader) => {
			const statusBarItem = this._createStatusBar().keepUpdated(reader.store);

			const store = this._register(new DisposableStore());

			reader.store.add(this._statusbarService.addEntry({
				name: localize('inlineSuggestions', "Inline Suggestions"),
				ariaLabel: localize('inlineSuggestionsStatusBar', "Inline suggestions status bar"),
				text: '',
				tooltip: {
					element: async (_token) => {
						this._sendHoverTelemetry();
						store.clear();
						const elem = this._createStatusBarHover();
						return elem.keepUpdated(store).element;
					},
					markdownNotSupportedFallback: undefined,
				},
				content: statusBarItem.element,
			}, 'aiStatsStatusBar', StatusbarAlignment.RIGHT, 100));
		}));
	}

	private _sendHoverTelemetry(): void {
		this._telemetryService.publicLog2<{
			aiRate: number;
		}, {
			owner: 'hediet';
			comment: 'Fired when the AI stats status bar hover tooltip is shown';
			aiRate: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The current AI rate percentage' };
		}>(
			'aiStatsStatusBar.hover',
			{
				aiRate: this._aiStatsFeature.aiRate.get(),
			}
		);
	}


	private _createStatusBar() {
		return n.div({
			style: {
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginLeft: '3px',
				marginRight: '3px',
			}
		}, [
			n.div(
				{
					class: 'ai-stats-status-bar',
					style: {
						display: 'flex',
						flexDirection: 'column',

						width: 50,
						height: 6,

						borderRadius: 6,
						borderWidth: '1px',
						borderStyle: 'solid',
					}
				},
				[
					n.div({
						style: {
							flex: 1,

							display: 'flex',
							overflow: 'hidden',

							borderRadius: 6,
							border: '1px solid transparent',
						}
					}, [
						n.div({
							style: {
								width: this._aiStatsFeature.aiRate.map(v => `${v * 100}%`),
								backgroundColor: 'currentColor',
							}
						})
					])
				]
			)
		]);
	}

	private _createStatusBarHover() {
		const aiRatePercent = this._aiStatsFeature.aiRate.map(r => `${Math.round(r * 100)}%`);

		return n.div({
			class: 'ai-stats-status-bar',
		}, [
			n.div({
				class: 'header',
				style: {
					minWidth: '200px',
				}
			},
				[
					n.div({ style: { flex: 1 } }, [localize('aiStatsStatusBarHeader', "AI Usage Statistics")]),
					n.div({ style: { marginLeft: 'auto' } }, actionBar([
						{
							action: {
								id: 'aiStats.statusBar.settings',
								label: '',
								enabled: true,
								run: () => openSettingsCommand({ ids: [AI_STATS_SETTING_ID] }).run(this._commandService),
								class: ThemeIcon.asClassName(Codicon.gear),
								tooltip: localize('aiStats.statusBar.configure', "Configure")
							},
							options: { icon: true, label: false, hoverDelegate: nativeHoverDelegate }
						}
					]))
				]
			),

			n.div({ style: { display: 'flex' } }, [
				n.div({ style: { flex: 1, paddingRight: '4px' } }, [
					localize('text1', "AI vs Typing Average: {0}", aiRatePercent.get()),
				]),
				/*
				TODO: Write article that explains the ratio and link to it.

				n.div({ style: { marginLeft: 'auto' } }, actionBar([
					{
						action: {
							id: 'aiStatsStatusBar.openSettings',
							label: '',
							enabled: true,
							run: () => { },
							class: ThemeIcon.asClassName(Codicon.info),
							tooltip: ''
						},
						options: { icon: true, label: true, }
					}
				]))*/
			]),
			n.div({ style: { flex: 1, paddingRight: '4px' } }, [
				localize('text2', "Accepted inline suggestions today: {0}", this._aiStatsFeature.acceptedInlineSuggestionsToday.get()),
			]),
		]);
	}
}

function actionBar(actions: { action: IAction; options: IActionOptions }[], options?: IActionBarOptions) {
	return derived((_reader) => n.div({
		class: [],
		style: {
		},
		ref: elem => {
			const actionBar = _reader.store.add(new ActionBar(elem, options));
			for (const { action, options } of actions) {
				actionBar.push(action, options);
			}
		}
	}));
}

class CommandWithArgs {
	constructor(
		public readonly commandId: string,
		public readonly args: unknown[] = [],
	) { }

	public run(commandService: ICommandService): void {
		commandService.executeCommand(this.commandId, ...this.args);
	}
}

function openSettingsCommand(options: { ids?: string[] } = {}) {
	return new CommandWithArgs('workbench.action.openSettings', [{
		query: options.ids ? options.ids.map(id => `@id:${id}`).join(' ') : undefined,
	}]);
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/editStats/media.css]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/editStats/media.css

```css
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Overall */

.ai-stats-status-bar {
	margin-top: 4px;
	margin-bottom: 4px;

	hr {
		margin-top: 8px;
		margin-bottom: 8px;
	}

	div.header {
		display: flex;
		align-items: center;
		color: var(--vscode-descriptionForeground);
		margin-bottom: 4px;
		font-size: 12px;
		font-weight: 600;
	}

	div.description {
		font-size: 11px;
		color: var(--vscode-descriptionForeground);
	}

	.monaco-button {
		margin-top: 5px;
		margin-bottom: 5px;
	}

	/* Setup for New User */

	.setup .chat-feature-container {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 4px;
	}

	/* Settings */

	.settings {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.settings .setting {
		display: flex;
		align-items: center;
	}

	.settings .setting .monaco-checkbox {
		height: 14px;
		width: 14px;
		margin-right: 5px;
	}

	.settings .setting .setting-label {
		cursor: pointer;
	}

	.settings .setting.disabled .setting-label {
		color: var(--vscode-disabledForeground);
	}


	/* Contributions */

	.contribution .body {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 5px;

		.description,
		.detail-item {
			display: flex;
			align-items: center;
			gap: 3px;
		}

		.detail-item,
		.detail-item a {
			margin-left: auto;
			color: var(--vscode-descriptionForeground);
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/helpers/annotatedDocuments.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/helpers/annotatedDocuments.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, mapObservableArrayCached, derived, derivedObservableWithCache, observableFromEvent, observableSignalFromEvent, IReader } from '../../../../../base/common/observable.js';
import { isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditorResourceAccessor } from '../../../../common/editor.js';
import { IEditorGroupsService } from '../../../../services/editor/common/editorGroupsService.js';
import { IDocumentWithAnnotatedEdits, EditSourceData, DocumentWithSourceAnnotatedEdits, CombineStreamedChanges, MinimizeEditsProcessor } from './documentWithAnnotatedEdits.js';
import { ObservableWorkspace, IObservableDocument } from './observableWorkspace.js';

export interface IAnnotatedDocuments {
	readonly documents: IObservable<readonly AnnotatedDocument[]>;
}

export class AnnotatedDocuments extends Disposable implements IAnnotatedDocuments {
	public readonly documents: IObservable<readonly AnnotatedDocument[]>;
	private readonly _states;

	constructor(
		private readonly _workspace: ObservableWorkspace,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		const uriVisibilityProvider = this._instantiationService.createInstance(UriVisibilityProvider);

		this._states = mapObservableArrayCached(this, this._workspace.documents, (doc, store) => {
			const docIsVisible = derived(reader => uriVisibilityProvider.isVisible(doc.uri, reader));
			const wasEverVisible = derivedObservableWithCache<boolean>(this, (reader, lastVal) => lastVal || docIsVisible.read(reader));
			return wasEverVisible.map(v => v ? store.add(this._instantiationService.createInstance(AnnotatedDocument, doc, docIsVisible)) : undefined);
		});

		this.documents = this._states.map((vals, reader) => vals.map(v => v.read(reader)).filter(isDefined));

		this.documents.recomputeInitiallyAndOnChange(this._store);
	}
}

export class UriVisibilityProvider {
	private readonly visibleUris: IObservable<Map<string, URI>>;

	constructor(
		@IEditorGroupsService private readonly _editorGroupsService: IEditorGroupsService
	) {
		const onDidAddGroupSignal = observableSignalFromEvent(this, this._editorGroupsService.onDidAddGroup);
		const onDidRemoveGroupSignal = observableSignalFromEvent(this, this._editorGroupsService.onDidRemoveGroup);
		const groups = derived(this, reader => {
			onDidAddGroupSignal.read(reader);
			onDidRemoveGroupSignal.read(reader);
			return this._editorGroupsService.groups;
		});

		this.visibleUris = mapObservableArrayCached(this, groups, g => {
			const editors = observableFromEvent(this, g.onDidModelChange, () => g.editors);
			return editors.map(e => e.map(editor => EditorResourceAccessor.getCanonicalUri(editor)));
		}).map((editors, reader) => {
			const map = new Map<string, URI>();
			for (const urisObs of editors) {
				for (const uri of urisObs.read(reader)) {
					if (isDefined(uri)) {
						map.set(uri.toString(), uri);
					}
				}
			}
			return map;
		});
	}

	public isVisible(uri: URI, reader: IReader): boolean {
		return this.visibleUris.read(reader).has(uri.toString());
	}
}

export class AnnotatedDocument extends Disposable {
	public readonly documentWithAnnotations;

	constructor(
		public readonly document: IObservableDocument,
		public readonly isVisible: IObservable<boolean>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		let processedDoc: IDocumentWithAnnotatedEdits<EditSourceData> = this._store.add(new DocumentWithSourceAnnotatedEdits(document));
		// Combine streaming edits into one and make edit smaller
		processedDoc = this._store.add(this._instantiationService.createInstance((CombineStreamedChanges<EditSourceData>), processedDoc));
		// Remove common suffix and prefix from edits
		processedDoc = this._store.add(new MinimizeEditsProcessor(processedDoc));

		this.documentWithAnnotations = processedDoc;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/helpers/documentWithAnnotatedEdits.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncReader, AsyncReaderEndOfStream } from '../../../../../base/common/async.js';
import { CachedFunction } from '../../../../../base/common/cache.js';
import { Disposable, DisposableStore } from '../../../../../base/common/lifecycle.js';
import { IObservableWithChange, ISettableObservable, observableValue, runOnChange } from '../../../../../base/common/observable.js';
import { AnnotatedStringEdit, IEditData, StringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { StringText } from '../../../../../editor/common/core/text/abstractText.js';
import { IEditorWorkerService } from '../../../../../editor/common/services/editorWorker.js';
import { TextModelEditSource } from '../../../../../editor/common/textModelEditSource.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { IObservableDocument } from './observableWorkspace.js';
import { iterateObservableChanges, mapObservableDelta } from './utils.js';

export interface IDocumentWithAnnotatedEdits<TEditData extends IEditData<TEditData> = EditKeySourceData> {
	readonly value: IObservableWithChange<StringText, { edit: AnnotatedStringEdit<TEditData> }>;
	waitForQueue(): Promise<void>;
}

/**
 * Creates a document that is a delayed copy of the original document,
 * but with edits annotated with the source of the edit.
*/
export class DocumentWithSourceAnnotatedEdits extends Disposable implements IDocumentWithAnnotatedEdits<EditSourceData> {
	public readonly value: IObservableWithChange<StringText, { edit: AnnotatedStringEdit<EditSourceData> }>;

	constructor(private readonly _originalDoc: IObservableDocument) {
		super();

		const v = this.value = observableValue(this, _originalDoc.value.get());

		this._register(runOnChange(this._originalDoc.value, (val, _prevVal, edits) => {
			const eComposed = AnnotatedStringEdit.compose(edits.map(e => {
				const editSourceData = new EditSourceData(e.reason);
				return e.mapData(() => editSourceData);
			}));

			v.set(val, undefined, { edit: eComposed });
		}));
	}

	public waitForQueue(): Promise<void> {
		return Promise.resolve();
	}
}

/**
 * Only joins touching edits if the source and the metadata is the same (e.g. requestUuids must be equal).
*/
export class EditSourceData implements IEditData<EditSourceData> {
	public readonly source;
	public readonly key;

	constructor(
		public readonly editSource: TextModelEditSource
	) {
		this.key = this.editSource.toKey(1);
		this.source = EditSourceBase.create(this.editSource);
	}

	join(data: EditSourceData): EditSourceData | undefined {
		if (this.editSource !== data.editSource) {
			return undefined;
		}
		return this;
	}

	toEditSourceData(): EditKeySourceData {
		return new EditKeySourceData(this.key, this.source, this.editSource);
	}
}

export class EditKeySourceData implements IEditData<EditKeySourceData> {
	constructor(
		public readonly key: string,
		public readonly source: EditSource,
		public readonly representative: TextModelEditSource,
	) { }

	join(data: EditKeySourceData): EditKeySourceData | undefined {
		if (this.key !== data.key) {
			return undefined;
		}
		if (this.source !== data.source) {
			return undefined;
		}
		// The representatives could be different! (But equal modulo key)
		return this;
	}
}

export abstract class EditSourceBase {
	private static _cache = new CachedFunction({ getCacheKey: v => v.toString() }, (arg: EditSource) => arg);

	public static create(reason: TextModelEditSource): EditSource {
		const data = reason.metadata;
		switch (data.source) {
			case 'reloadFromDisk':
				return this._cache.get(new ExternalEditSource());
			case 'inlineCompletionPartialAccept':
			case 'inlineCompletionAccept': {
				const type = 'type' in data ? data.type : undefined;
				if ('$nes' in data && data.$nes) {
					return this._cache.get(new InlineSuggestEditSource('nes', data.$extensionId ?? '', data.$providerId ?? '', type));
				}
				return this._cache.get(new InlineSuggestEditSource('completion', data.$extensionId ?? '', data.$providerId ?? '', type));
			}
			case 'snippet':
				return this._cache.get(new IdeEditSource('suggest'));
			case 'unknown':
				if (!data.name) {
					return this._cache.get(new UnknownEditSource());
				}
				switch (data.name) {
					case 'formatEditsCommand':
						return this._cache.get(new IdeEditSource('format'));
				}
				return this._cache.get(new UnknownEditSource());

			case 'Chat.applyEdits':
				return this._cache.get(new ChatEditSource('sidebar'));
			case 'inlineChat.applyEdits':
				return this._cache.get(new ChatEditSource('inline'));
			case 'cursor':
				return this._cache.get(new UserEditSource());
			default:
				return this._cache.get(new UnknownEditSource());
		}
	}

	public abstract getColor(): string;
}

export type EditSource = InlineSuggestEditSource | ChatEditSource | IdeEditSource | UserEditSource | UnknownEditSource | ExternalEditSource;

export class InlineSuggestEditSource extends EditSourceBase {
	public readonly category = 'ai';
	public readonly feature = 'inlineSuggest';
	constructor(
		public readonly kind: 'completion' | 'nes',
		public readonly extensionId: string,
		public readonly providerId: string,
		public readonly type: 'word' | 'line' | undefined,
	) { super(); }

	override toString() { return `${this.category}/${this.feature}/${this.kind}/${this.extensionId}/${this.type}`; }

	public getColor(): string { return '#00ff0033'; }
}

class ChatEditSource extends EditSourceBase {
	public readonly category = 'ai';
	public readonly feature = 'chat';
	constructor(
		public readonly kind: 'sidebar' | 'inline',
	) { super(); }

	override toString() { return `${this.category}/${this.feature}/${this.kind}`; }

	public getColor(): string { return '#00ff0066'; }
}

class IdeEditSource extends EditSourceBase {
	public readonly category = 'ide';
	constructor(
		public readonly feature: 'suggest' | 'format' | string,
	) { super(); }

	override toString() { return `${this.category}/${this.feature}`; }

	public getColor(): string { return this.feature === 'format' ? '#0000ff33' : '#80808033'; }
}

class UserEditSource extends EditSourceBase {
	public readonly category = 'user';
	constructor() { super(); }

	override toString() { return this.category; }

	public getColor(): string { return '#d3d3d333'; }
}

/** Caused by external tools that trigger a reload from disk */
class ExternalEditSource extends EditSourceBase {
	public readonly category = 'external';
	constructor() { super(); }

	override toString() { return this.category; }

	public getColor(): string { return '#009ab254'; }
}

class UnknownEditSource extends EditSourceBase {
	public readonly category = 'unknown';
	constructor() { super(); }

	override toString() { return this.category; }

	public getColor(): string { return '#ff000033'; }
}

export class CombineStreamedChanges<TEditData extends (EditKeySourceData | EditSourceData) & IEditData<TEditData>> extends Disposable implements IDocumentWithAnnotatedEdits<TEditData> {
	private readonly _value: ISettableObservable<StringText, { edit: AnnotatedStringEdit<TEditData> }>;
	readonly value: IObservableWithChange<StringText, { edit: AnnotatedStringEdit<TEditData> }>;
	private readonly _runStore = this._register(new DisposableStore());
	private _runQueue: Promise<void> = Promise.resolve();

	private readonly _diffService: DiffService;

	constructor(
		private readonly _originalDoc: IDocumentWithAnnotatedEdits<TEditData>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		this._diffService = this._instantiationService.createInstance(DiffService);
		this.value = this._value = observableValue(this, _originalDoc.value.get());
		this._restart();

	}

	async _restart(): Promise<void> {
		this._runStore.clear();
		const iterator = iterateObservableChanges(this._originalDoc.value, this._runStore)[Symbol.asyncIterator]();
		const p = this._runQueue;
		this._runQueue = this._runQueue.then(() => this._run(iterator));
		await p;
	}

	private async _run(iterator: AsyncIterator<{ value: StringText; prevValue: StringText; change: { edit: AnnotatedStringEdit<TEditData> }[] }, any, any>) {
		const reader = new AsyncReader(iterator);
		while (true) {
			let peeked = await reader.peek();
			if (peeked === AsyncReaderEndOfStream) {
				return;
			} else if (isChatEdit(peeked)) {
				const first = peeked;

				let last = first;
				let chatEdit = AnnotatedStringEdit.empty as AnnotatedStringEdit<TEditData>;

				do {
					reader.readBufferedOrThrow();
					last = peeked;
					chatEdit = chatEdit.compose(AnnotatedStringEdit.compose(peeked.change.map(c => c.edit)));
					const peekedOrUndefined = await reader.peekTimeout(1000);
					if (!peekedOrUndefined) {
						break;
					}
					peeked = peekedOrUndefined;
				} while (peeked !== AsyncReaderEndOfStream && isChatEdit(peeked));

				if (!chatEdit.isEmpty()) {
					const data = chatEdit.replacements[0].data;
					const diffEdit = await this._diffService.computeDiff(first.prevValue.value, last.value.value);
					const edit = diffEdit.mapData(_e => data);
					this._value.set(last.value, undefined, { edit });
				}
			} else {
				reader.readBufferedOrThrow();
				const e = AnnotatedStringEdit.compose(peeked.change.map(c => c.edit));
				this._value.set(peeked.value, undefined, { edit: e });
			}
		}
	}

	async waitForQueue(): Promise<void> {
		await this._originalDoc.waitForQueue();
		await this._restart();
	}
}

export class DiffService {
	constructor(
		@IEditorWorkerService private readonly _editorWorkerService: IEditorWorkerService,
	) {
	}

	public async computeDiff(original: string, modified: string): Promise<StringEdit> {
		const diffEdit = await this._editorWorkerService.computeStringEditFromDiff(original, modified, { maxComputationTimeMs: 500 }, 'advanced');
		return diffEdit;
	}
}

function isChatEdit(next: { value: StringText; change: { edit: AnnotatedStringEdit<EditKeySourceData | EditSourceData> }[] }) {
	return next.change.every(c => c.edit.replacements.every(e => {
		if (e.data.source.category === 'ai' && e.data.source.feature === 'chat') {
			return true;
		}
		return false;
	}));
}

export class MinimizeEditsProcessor<TEditData extends IEditData<TEditData>> extends Disposable implements IDocumentWithAnnotatedEdits<TEditData> {
	readonly value: IObservableWithChange<StringText, { edit: AnnotatedStringEdit<TEditData> }>;

	constructor(
		private readonly _originalDoc: IDocumentWithAnnotatedEdits<TEditData>,
	) {
		super();

		const v = this.value = observableValue(this, _originalDoc.value.get());

		let prevValue: string = this._originalDoc.value.get().value;
		this._register(runOnChange(this._originalDoc.value, (val, _prevVal, edits) => {
			const eComposed = AnnotatedStringEdit.compose(edits.map(e => e.edit));

			const e = eComposed.removeCommonSuffixAndPrefix(prevValue);
			prevValue = val.value;

			v.set(val, undefined, { edit: e });
		}));
	}

	async waitForQueue(): Promise<void> {
		await this._originalDoc.waitForQueue();
	}
}

/**
 * Removing the metadata allows touching edits from the same source to merged, even if they were caused by different actions (e.g. two user edits).
 */
export function createDocWithJustReason(docWithAnnotatedEdits: IDocumentWithAnnotatedEdits<EditSourceData>, store: DisposableStore): IDocumentWithAnnotatedEdits<EditKeySourceData> {
	const docWithJustReason: IDocumentWithAnnotatedEdits<EditKeySourceData> = {
		value: mapObservableDelta(docWithAnnotatedEdits.value, edit => ({ edit: edit.edit.mapData(d => d.data.toEditSourceData()) }), store),
		waitForQueue: () => docWithAnnotatedEdits.waitForQueue(),
	};
	return docWithJustReason;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/helpers/observableWorkspace.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/helpers/observableWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IObservableWithChange, derivedHandleChanges, observableValue, runOnChange, IObservable, autorun, derived } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { StringEdit, StringReplacement } from '../../../../../editor/common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../../../editor/common/core/ranges/offsetRange.js';
import { StringText } from '../../../../../editor/common/core/text/abstractText.js';
import { EditSources, TextModelEditSource } from '../../../../../editor/common/textModelEditSource.js';

export abstract class ObservableWorkspace {
	abstract get documents(): IObservable<readonly IObservableDocument[]>;


	getFirstOpenDocument(): IObservableDocument | undefined {
		return this.documents.get()[0];
	}

	getDocument(documentId: URI): IObservableDocument | undefined {
		return this.documents.get().find(d => d.uri.toString() === documentId.toString());
	}

	private _version = 0;

	/**
	 * Is fired when any open document changes.
	*/
	public readonly onDidOpenDocumentChange = derivedHandleChanges({
		owner: this,
		changeTracker: {
			createChangeSummary: () => ({ didChange: false }),
			handleChange: (ctx, changeSummary) => {
				if (!ctx.didChange(this.documents)) {
					changeSummary.didChange = true; // A document changed
				}
				return true;
			}
		}
	}, (reader, changeSummary) => {
		const docs = this.documents.read(reader);
		for (const d of docs) {
			d.value.read(reader); // add dependency
		}
		if (changeSummary.didChange) {
			this._version++; // to force a change
		}
		return this._version;

		// TODO@hediet make this work:
		/*
		const docs = this.openDocuments.read(reader);
		for (const d of docs) {
			if (reader.readChangesSinceLastRun(d.value).length > 0) {
				reader.reportChange(d);
			}
		}
		return undefined;
		*/
	});

	public readonly lastActiveDocument = derived((reader) => {
		const obs = observableValue('lastActiveDocument', undefined as IObservableDocument | undefined);
		reader.store.add(autorun((reader) => {
			const docs = this.documents.read(reader);
			for (const d of docs) {
				reader.store.add(runOnChange(d.value, () => {
					obs.set(d, undefined);
				}));
			}
		}));
		return obs;
	}).flatten();
}

export interface IObservableDocument {
	readonly uri: URI;
	readonly value: IObservableWithChange<StringText, StringEditWithReason>;

	/**
	 * Increases whenever the value changes. Is also used to reference document states from the past.
	*/
	readonly version: IObservable<number>;
	readonly languageId: IObservable<string>;
}

export class StringEditWithReason extends StringEdit {
	public static override replace(range: OffsetRange, newText: string, source: TextModelEditSource = EditSources.unknown({})): StringEditWithReason {
		return new StringEditWithReason([new StringReplacement(range, newText)], source);
	}

	constructor(
		replacements: StringEdit['replacements'],
		public readonly reason: TextModelEditSource,
	) {
		super(replacements);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/helpers/utils.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/helpers/utils.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AsyncIterableProducer } from '../../../../../base/common/async.js';
import { DisposableStore, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservableWithChange, observableValue, runOnChange, transaction, RemoveUndefined } from '../../../../../base/common/observable.js';

export function sumByCategory<T, TCategory extends string>(items: readonly T[], getValue: (item: T) => number, getCategory: (item: T) => TCategory): Record<TCategory, number | undefined> {
	return items.reduce((acc, item) => {
		const category = getCategory(item);
		acc[category] = (acc[category] || 0) + getValue(item);
		return acc;
		// eslint-disable-next-line local/code-no-any-casts
	}, {} as any as Record<TCategory, number>);
}

export function mapObservableDelta<T, TDelta, TDeltaNew>(obs: IObservableWithChange<T, TDelta>, mapFn: (value: TDelta) => TDeltaNew, store: DisposableStore): IObservableWithChange<T, TDeltaNew> {
	const obsResult = observableValue<T, TDeltaNew>('mapped', obs.get());
	store.add(runOnChange(obs, (value, _prevValue, changes) => {
		transaction(tx => {
			for (const c of changes) {
				obsResult.set(value, tx, mapFn(c));
			}
		});
	}));
	return obsResult;
}

export function iterateObservableChanges<T, TChange>(obs: IObservableWithChange<T, TChange>, store: DisposableStore): AsyncIterable<{ value: T; prevValue: T; change: RemoveUndefined<TChange>[] }> {
	return new AsyncIterableProducer<{ value: T; prevValue: T; change: RemoveUndefined<TChange>[] }>((e) => {
		if (store.isDisposed) {
			return;
		}
		store.add(runOnChange(obs, (value, prevValue, change) => {
			e.emitOne({ value, prevValue, change: change });
		}));

		return new Promise((res) => {
			store.add(toDisposable(() => {
				res(undefined);
			}));
		});
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/helpers/vscodeObservableWorkspace.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/helpers/vscodeObservableWorkspace.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Disposable, DisposableStore, IDisposable } from '../../../../../base/common/lifecycle.js';
import { derived, IObservable, IObservableWithChange, mapObservableArrayCached, observableSignalFromEvent, observableValue, transaction } from '../../../../../base/common/observable.js';
import { isDefined } from '../../../../../base/common/types.js';
import { URI } from '../../../../../base/common/uri.js';
import { StringText } from '../../../../../editor/common/core/text/abstractText.js';
import { ITextModel } from '../../../../../editor/common/model.js';
import { offsetEditFromContentChanges } from '../../../../../editor/common/model/textModelStringEdit.js';
import { IModelService } from '../../../../../editor/common/services/model.js';
import { IObservableDocument, ObservableWorkspace, StringEditWithReason } from './observableWorkspace.js';

export class VSCodeWorkspace extends ObservableWorkspace implements IDisposable {
	private readonly _documents;
	public get documents() { return this._documents; }

	private readonly _store = new DisposableStore();

	constructor(
		@IModelService private readonly _textModelService: IModelService,
	) {
		super();

		const onModelAdded = observableSignalFromEvent(this, this._textModelService.onModelAdded);
		const onModelRemoved = observableSignalFromEvent(this, this._textModelService.onModelRemoved);

		const models = derived(this, reader => {
			onModelAdded.read(reader);
			onModelRemoved.read(reader);
			const models = this._textModelService.getModels();
			return models;
		});

		const documents = mapObservableArrayCached(this, models, (m, store) => {
			if (m.isTooLargeForSyncing()) {
				return undefined;
			}
			return store.add(new VSCodeDocument(m));
		}).recomputeInitiallyAndOnChange(this._store).map(d => d.filter(isDefined));

		this._documents = documents;
	}

	dispose(): void {
		this._store.dispose();
	}
}

export class VSCodeDocument extends Disposable implements IObservableDocument {
	get uri(): URI { return this.textModel.uri; }
	private readonly _value;
	private readonly _version;
	private readonly _languageId;
	get value(): IObservableWithChange<StringText, StringEditWithReason> { return this._value; }
	get version(): IObservable<number> { return this._version; }
	get languageId(): IObservable<string> { return this._languageId; }

	constructor(
		public readonly textModel: ITextModel,
	) {
		super();

		this._value = observableValue<StringText, StringEditWithReason>(this, new StringText(this.textModel.getValue()));
		this._version = observableValue(this, this.textModel.getVersionId());
		this._languageId = observableValue(this, this.textModel.getLanguageId());

		this._register(this.textModel.onDidChangeContent((e) => {
			transaction(tx => {
				const edit = offsetEditFromContentChanges(e.changes);
				if (e.detailedReasons.length !== 1) {
					onUnexpectedError(new Error(`Unexpected number of detailed reasons: ${e.detailedReasons.length}`));
				}

				const change = new StringEditWithReason(edit.replacements, e.detailedReasons[0]);

				this._value.set(new StringText(this.textModel.getValue()), tx, change);
				this._version.set(this.textModel.getVersionId(), tx);
			});
		}));

		this._register(this.textModel.onDidChangeLanguage(e => {
			transaction(tx => {
				this._languageId.set(this.textModel.getLanguageId(), tx);
			});
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetryReporter.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetryReporter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { TimeoutTimer } from '../../../../../base/common/async.js';
import { Disposable, toDisposable } from '../../../../../base/common/lifecycle.js';
import { IObservableWithChange, IObservable, runOnChange } from '../../../../../base/common/observable.js';
import { BaseStringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { StringText } from '../../../../../editor/common/core/text/abstractText.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { ArcTracker } from '../../common/arcTracker.js';
import type { ScmRepoAdapter } from './scmAdapter.js';

export class ArcTelemetryReporter extends Disposable {
	private readonly _arcTracker;
	private readonly _initialBranchName: string | undefined;

	private readonly _initialLineCounts;

	constructor(
		private readonly _timesMs: number[],
		private readonly _documentValueBeforeTrackedEdit: StringText,
		private readonly _document: { value: IObservableWithChange<StringText, { edit: BaseStringEdit }> },
		// _markedEdits -> document.value
		private readonly _gitRepo: IObservable<ScmRepoAdapter | undefined>,
		private readonly _trackedEdit: BaseStringEdit,
		private readonly _sendTelemetryEvent: (res: ArcTelemetryReporterData) => void,
		private readonly _onBeforeDispose: () => void,
		@ITelemetryService private readonly _telemetryService: ITelemetryService
	) {
		super();

		this._arcTracker = new ArcTracker(this._documentValueBeforeTrackedEdit, this._trackedEdit);

		this._store.add(toDisposable(() => {
			this._onBeforeDispose();
		}));

		this._store.add(runOnChange(this._document.value, (_val, _prevVal, changes) => {
			const edit = BaseStringEdit.composeOrUndefined(changes.map(c => c.edit));
			if (edit) {
				this._arcTracker.handleEdits(edit);
			}
		}));

		this._initialLineCounts = this._arcTracker.getLineCountInfo();

		this._initialBranchName = this._gitRepo.get()?.headBranchNameObs.get();

		for (let i = 0; i < this._timesMs.length; i++) {
			const timeMs = this._timesMs[i];

			if (timeMs <= 0) {
				this._report(timeMs);
			} else {
				this._reportAfter(timeMs, i === this._timesMs.length - 1 ? () => {
					this.dispose();
				} : undefined);
			}
		}
	}

	private _reportAfter(timeoutMs: number, cb?: () => void) {
		const timer = new TimeoutTimer(() => {
			this._report(timeoutMs);
			timer.dispose();
			if (cb) {
				cb();
			}
		}, timeoutMs);
		this._store.add(timer);
	}

	private _report(timeMs: number): void {
		const currentBranch = this._gitRepo.get()?.headBranchNameObs.get();
		const didBranchChange = currentBranch !== this._initialBranchName;
		const currentLineCounts = this._arcTracker.getLineCountInfo();

		this._sendTelemetryEvent({
			telemetryService: this._telemetryService,
			timeDelayMs: timeMs,
			didBranchChange,
			arc: this._arcTracker.getAcceptedRestrainedCharactersCount(),
			originalCharCount: this._arcTracker.getOriginalCharacterCount(),

			currentLineCount: currentLineCounts.insertedLineCounts,
			currentDeletedLineCount: currentLineCounts.deletedLineCounts,
			originalLineCount: this._initialLineCounts.insertedLineCounts,
			originalDeletedLineCount: this._initialLineCounts.deletedLineCounts,
		});
	}
}

export interface ArcTelemetryReporterData {
	telemetryService: ITelemetryService;
	timeDelayMs: number;
	didBranchChange: boolean;
	arc: number;
	originalCharCount: number;

	currentLineCount: number;
	currentDeletedLineCount: number;
	originalLineCount: number;
	originalDeletedLineCount: number;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetrySender.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/arcTelemetrySender.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { onUnexpectedError } from '../../../../../base/common/errors.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { IObservable, runOnChange } from '../../../../../base/common/observable.js';
import { AnnotatedStringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { EditDeltaInfo, EditSuggestionId, ITextModelEditSourceMetadata } from '../../../../../editor/common/textModelEditSource.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { EditSourceData, IDocumentWithAnnotatedEdits, createDocWithJustReason } from '../helpers/documentWithAnnotatedEdits.js';
import { IAiEditTelemetryService } from './aiEditTelemetry/aiEditTelemetryService.js';
import type { ScmRepoAdapter } from './scmAdapter.js';
import { forwardToChannelIf, isCopilotLikeExtension } from '../../../../../platform/dataChannel/browser/forwardingTelemetryService.js';
import { ProviderId } from '../../../../../editor/common/languages.js';
import { ArcTelemetryReporter } from './arcTelemetryReporter.js';
import { IRandomService } from '../randomService.js';

export class EditTelemetryReportInlineEditArcSender extends Disposable {
	constructor(
		docWithAnnotatedEdits: IDocumentWithAnnotatedEdits<EditSourceData>,
		scmRepoBridge: IObservable<ScmRepoAdapter | undefined>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService
	) {
		super();

		this._register(runOnChange(docWithAnnotatedEdits.value, (_val, _prev, changes) => {
			const edit = AnnotatedStringEdit.compose(changes.map(c => c.edit));

			if (!edit.replacements.some(r => r.data.editSource.metadata.source === 'inlineCompletionAccept')) {
				return;
			}
			if (!edit.replacements.every(r => r.data.editSource.metadata.source === 'inlineCompletionAccept')) {
				onUnexpectedError(new Error('ArcTelemetrySender: Not all edits are inline completion accept edits!'));
				return;
			}
			if (edit.replacements[0].data.editSource.metadata.source !== 'inlineCompletionAccept') {
				return;
			}
			const data = edit.replacements[0].data.editSource.metadata;

			const docWithJustReason = createDocWithJustReason(docWithAnnotatedEdits, this._store);
			const reporter = this._store.add(this._instantiationService.createInstance(ArcTelemetryReporter, [0, 30, 120, 300, 600, 900].map(s => s * 1000), _prev, docWithJustReason, scmRepoBridge, edit, res => {
				res.telemetryService.publicLog2<{
					extensionId: string;
					extensionVersion: string;
					opportunityId: string;
					languageId: string;
					correlationId: string | undefined;
					didBranchChange: number;
					timeDelayMs: number;

					originalCharCount: number;
					originalLineCount: number;
					originalDeletedLineCount: number;
					arc: number;
					currentLineCount: number;
					currentDeletedLineCount: number;
				}, {
					owner: 'hediet';
					comment: 'Reports for each accepted inline suggestion (= inline completions + next edit suggestions) the accumulated retained character count after a certain time delay. This event is sent 0s, 30s, 120s, 300s, 600s and 900s after acceptance. @sentToGitHub';

					extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension id which provided this inline suggestion.' };
					extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension.' };
					opportunityId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for an opportunity to show an inline suggestion.' };
					languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id of the document.' };
					correlationId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The correlation id of the inline suggestion.' };

					didBranchChange: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Indicates if the branch changed in the meantime. If the branch changed (value is 1); this event should probably be ignored.' };
					timeDelayMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The time delay between the user accepting the edit and measuring the survival rate.' };

					originalCharCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original character count before any edits.' };
					originalLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original line count before any edits.' };
					originalDeletedLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original deleted line count before any edits.' };
					arc: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The accepted and retained character count.' };
					currentLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The current line count after edits.' };
					currentDeletedLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The current deleted line count after edits.' };
				}>('editTelemetry.reportInlineEditArc', {
					extensionId: data.$extensionId ?? '',
					extensionVersion: data.$extensionVersion ?? '',
					opportunityId: data.$$requestUuid ?? 'unknown',
					languageId: data.$$languageId,
					correlationId: data.$$correlationId,
					didBranchChange: res.didBranchChange ? 1 : 0,
					timeDelayMs: res.timeDelayMs,

					originalCharCount: res.originalCharCount,
					originalLineCount: res.originalLineCount,
					originalDeletedLineCount: res.originalDeletedLineCount,
					arc: res.arc,
					currentLineCount: res.currentLineCount,
					currentDeletedLineCount: res.currentDeletedLineCount,

					...forwardToChannelIf(isCopilotLikeExtension(data.$extensionId)),
				});
			}, () => {
				this._store.deleteAndLeak(reporter);
			}));
		}));
	}
}

export class CreateSuggestionIdForChatOrInlineChatCaller extends Disposable {
	constructor(
		docWithAnnotatedEdits: IDocumentWithAnnotatedEdits<EditSourceData>,
		@IAiEditTelemetryService private readonly _aiEditTelemetryService: IAiEditTelemetryService,
	) {
		super();

		this._register(runOnChange(docWithAnnotatedEdits.value, (_val, _prev, changes) => {
			const edit = AnnotatedStringEdit.compose(changes.map(c => c.edit));

			const supportedSource = new Set(['Chat.applyEdits', 'inlineChat.applyEdits'] as ITextModelEditSourceMetadata['source'][]);

			if (!edit.replacements.some(r => supportedSource.has(r.data.editSource.metadata.source))) {
				return;
			}
			if (!edit.replacements.every(r => supportedSource.has(r.data.editSource.metadata.source))) {
				onUnexpectedError(new Error(`ArcTelemetrySender: Not all edits are ${edit.replacements[0].data.editSource.metadata.source}!`));
				return;
			}
			let applyCodeBlockSuggestionId: EditSuggestionId | undefined = undefined;
			const data = edit.replacements[0].data.editSource;
			let feature: 'inlineChat' | 'sideBarChat';
			if (data.metadata.source === 'Chat.applyEdits') {
				feature = 'sideBarChat';
				if (data.metadata.$$mode === 'applyCodeBlock') {
					applyCodeBlockSuggestionId = data.metadata.$$codeBlockSuggestionId;
				}
			} else {
				feature = 'inlineChat';
			}

			const providerId = new ProviderId(data.props.$extensionId, data.props.$extensionVersion, data.props.$providerId);

			// TODO@hediet tie this suggestion id to hunks, so acceptance can be correlated.
			this._aiEditTelemetryService.createSuggestionId({
				applyCodeBlockSuggestionId,
				languageId: data.props.$$languageId,
				presentation: 'highlightedEdit',
				feature,
				source: providerId,
				modelId: data.props.$modelId,
				// eslint-disable-next-line local/code-no-any-casts
				modeId: data.props.$$mode as any,
				editDeltaInfo: EditDeltaInfo.fromEdit(edit, _prev),
			});
		}));
	}
}

export class EditTelemetryReportEditArcForChatOrInlineChatSender extends Disposable {
	constructor(
		docWithAnnotatedEdits: IDocumentWithAnnotatedEdits<EditSourceData>,
		scmRepoBridge: IObservable<ScmRepoAdapter | undefined>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IRandomService private readonly _randomService: IRandomService,
	) {
		super();

		this._register(runOnChange(docWithAnnotatedEdits.value, (_val, _prev, changes) => {
			const edit = AnnotatedStringEdit.compose(changes.map(c => c.edit));

			const supportedSource = new Set(['Chat.applyEdits', 'inlineChat.applyEdits'] as ITextModelEditSourceMetadata['source'][]);

			if (!edit.replacements.some(r => supportedSource.has(r.data.editSource.metadata.source))) {
				return;
			}
			if (!edit.replacements.every(r => supportedSource.has(r.data.editSource.metadata.source))) {
				onUnexpectedError(new Error(`ArcTelemetrySender: Not all edits are ${edit.replacements[0].data.editSource.metadata.source}!`));
				return;
			}
			const data = edit.replacements[0].data.editSource;

			const uniqueEditId = this._randomService.generateUuid();

			const docWithJustReason = createDocWithJustReason(docWithAnnotatedEdits, this._store);
			const reporter = this._store.add(this._instantiationService.createInstance(ArcTelemetryReporter, [0, 60, 300].map(s => s * 1000), _prev, docWithJustReason, scmRepoBridge, edit, res => {
				res.telemetryService.publicLog2<{
					sourceKeyCleaned: string;
					extensionId: string | undefined;
					extensionVersion: string | undefined;
					opportunityId: string | undefined;
					editSessionId: string | undefined;
					requestId: string | undefined;
					modelId: string | undefined;
					languageId: string | undefined;
					mode: string | undefined;
					uniqueEditId: string | undefined;

					didBranchChange: number;
					timeDelayMs: number;

					originalCharCount: number;
					originalLineCount: number;
					originalDeletedLineCount: number;
					arc: number;
					currentLineCount: number;
					currentDeletedLineCount: number;
				}, {
					owner: 'hediet';
					comment: 'Reports the accepted and retained character count for an inline completion/edit. @sentToGitHub';

					sourceKeyCleaned: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The key of the edit source.' };
					extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension id (copilot or copilot-chat); which provided this inline completion.' };
					extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension.' };
					opportunityId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for an opportunity to show an inline completion or NES.' };
					editSessionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The session id.' };
					requestId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The request id.' };
					modelId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The model id.' };
					languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id of the document.' };
					mode: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The mode chat was in.' };
					uniqueEditId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The unique identifier for the edit.' };

					didBranchChange: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Indicates if the branch changed in the meantime. If the branch changed (value is 1); this event should probably be ignored.' };
					timeDelayMs: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The time delay between the user accepting the edit and measuring the survival rate.' };

					originalCharCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original character count before any edits.' };
					originalLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original line count before any edits.' };
					originalDeletedLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The original deleted line count before any edits.' };
					arc: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The accepted and restrained character count.' };
					currentLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The current line count after edits.' };
					currentDeletedLineCount: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'The current deleted line count after edits.' };
				}>('editTelemetry.reportEditArc', {
					sourceKeyCleaned: data.toKey(Number.MAX_SAFE_INTEGER, {
						$extensionId: false,
						$extensionVersion: false,
						$$requestUuid: false,
						$$sessionId: false,
						$$requestId: false,
						$$languageId: false,
						$modelId: false,
					}),
					extensionId: data.props.$extensionId,
					extensionVersion: data.props.$extensionVersion,
					opportunityId: data.props.$$requestUuid,
					editSessionId: data.props.$$sessionId,
					requestId: data.props.$$requestId,
					modelId: data.props.$modelId,
					languageId: data.props.$$languageId,
					mode: data.props.$$mode,
					uniqueEditId,

					didBranchChange: res.didBranchChange ? 1 : 0,
					timeDelayMs: res.timeDelayMs,

					originalCharCount: res.originalCharCount,
					originalLineCount: res.originalLineCount,
					originalDeletedLineCount: res.originalDeletedLineCount,
					arc: res.arc,
					currentLineCount: res.currentLineCount,
					currentDeletedLineCount: res.currentDeletedLineCount,

					...forwardToChannelIf(isCopilotLikeExtension(data.props.$extensionId)),
				});
			}, () => {
				this._store.deleteAndLeak(reporter);
			}));
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/editSourceTrackingFeature.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/editSourceTrackingFeature.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { CachedFunction } from '../../../../../base/common/cache.js';
import { MarkdownString } from '../../../../../base/common/htmlContent.js';
import { Disposable } from '../../../../../base/common/lifecycle.js';
import { autorun, mapObservableArrayCached, derived, IObservable, ISettableObservable, observableValue, derivedWithSetter, observableFromEvent } from '../../../../../base/common/observable.js';
import { DynamicCssRules } from '../../../../../editor/browser/editorDom.js';
import { observableCodeEditor } from '../../../../../editor/browser/observableCodeEditor.js';
import { CodeEditorWidget } from '../../../../../editor/browser/widget/codeEditor/codeEditorWidget.js';
import { IModelDeltaDecoration } from '../../../../../editor/common/model.js';
import { CommandsRegistry } from '../../../../../platform/commands/common/commands.js';
import { IConfigurationService } from '../../../../../platform/configuration/common/configuration.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ServiceCollection } from '../../../../../platform/instantiation/common/serviceCollection.js';
import { observableConfigValue } from '../../../../../platform/observable/common/platformObservableUtils.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IEditorService } from '../../../../services/editor/common/editorService.js';
import { IStatusbarService, StatusbarAlignment } from '../../../../services/statusbar/browser/statusbar.js';
import { EditSource } from '../helpers/documentWithAnnotatedEdits.js';
import { EditSourceTrackingImpl } from './editSourceTrackingImpl.js';
import { IAnnotatedDocuments } from '../helpers/annotatedDocuments.js';
import { DataChannelForwardingTelemetryService } from '../../../../../platform/dataChannel/browser/forwardingTelemetryService.js';
import { EDIT_TELEMETRY_DETAILS_SETTING_ID, EDIT_TELEMETRY_SHOW_DECORATIONS, EDIT_TELEMETRY_SHOW_STATUS_BAR } from '../settings.js';
import { VSCodeWorkspace } from '../helpers/vscodeObservableWorkspace.js';
import { IExtensionService } from '../../../../services/extensions/common/extensions.js';

export class EditTrackingFeature extends Disposable {

	private readonly _editSourceTrackingShowDecorations;
	private readonly _editSourceTrackingShowStatusBar;
	private readonly _showStateInMarkdownDoc = 'editTelemetry.showDebugDetails';
	private readonly _toggleDecorations = 'editTelemetry.toggleDebugDecorations';

	constructor(
		private readonly _workspace: VSCodeWorkspace,
		private readonly _annotatedDocuments: IAnnotatedDocuments,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@IStatusbarService private readonly _statusbarService: IStatusbarService,

		@IEditorService private readonly _editorService: IEditorService,
		@IExtensionService private readonly _extensionService: IExtensionService,
	) {
		super();

		this._editSourceTrackingShowDecorations = makeSettable(observableConfigValue(EDIT_TELEMETRY_SHOW_DECORATIONS, false, this._configurationService));
		this._editSourceTrackingShowStatusBar = observableConfigValue(EDIT_TELEMETRY_SHOW_STATUS_BAR, false, this._configurationService);
		const editSourceDetailsEnabled = observableConfigValue(EDIT_TELEMETRY_DETAILS_SETTING_ID, false, this._configurationService);

		const extensions = observableFromEvent(this._extensionService.onDidChangeExtensions, () => {
			return this._extensionService.extensions;
		});
		const extensionIds = derived(reader => new Set(extensions.read(reader).map(e => e.id?.toLowerCase())));
		function getExtensionInfoObs(extensionId: string, extensionService: IExtensionService) {
			const extIdLowerCase = extensionId.toLowerCase();
			return derived(reader => extensionIds.read(reader).has(extIdLowerCase));
		}

		const copilotInstalled = getExtensionInfoObs('GitHub.copilot', this._extensionService);
		const copilotChatInstalled = getExtensionInfoObs('GitHub.copilot-chat', this._extensionService);

		const shouldSendDetails = derived(reader => editSourceDetailsEnabled.read(reader) || !!copilotInstalled.read(reader) || !!copilotChatInstalled.read(reader));

		const instantiationServiceWithInterceptedTelemetry = this._instantiationService.createChild(new ServiceCollection(
			[ITelemetryService, this._instantiationService.createInstance(DataChannelForwardingTelemetryService)]
		));
		const impl = this._register(instantiationServiceWithInterceptedTelemetry.createInstance(EditSourceTrackingImpl, shouldSendDetails, this._annotatedDocuments));

		this._register(autorun((reader) => {
			if (!this._editSourceTrackingShowDecorations.read(reader)) {
				return;
			}

			const visibleEditors = observableFromEvent(this, this._editorService.onDidVisibleEditorsChange, () => this._editorService.visibleTextEditorControls);

			mapObservableArrayCached(this, visibleEditors, (editor, store) => {
				if (editor instanceof CodeEditorWidget) {
					const obsEditor = observableCodeEditor(editor);

					const cssStyles = new DynamicCssRules(editor);
					const decorations = new CachedFunction((source: EditSource) => {
						const r = store.add(cssStyles.createClassNameRef({
							backgroundColor: source.getColor(),
						}));
						return r.className;
					});

					store.add(obsEditor.setDecorations(derived(reader => {
						const uri = obsEditor.model.read(reader)?.uri;
						if (!uri) { return []; }
						const doc = this._workspace.getDocument(uri);
						if (!doc) { return []; }
						const docsState = impl.docsState.read(reader).get(doc);
						if (!docsState) { return []; }

						const ranges = (docsState.longtermTracker.read(reader)?.getTrackedRanges(reader)) ?? [];

						return ranges.map<IModelDeltaDecoration>(r => ({
							range: doc.value.read(undefined).getTransformer().getRange(r.range),
							options: {
								description: 'editSourceTracking',
								inlineClassName: decorations.get(r.source),
							}
						}));
					})));
				}
			}).recomputeInitiallyAndOnChange(reader.store);
		}));

		this._register(autorun(reader => {
			if (!this._editSourceTrackingShowStatusBar.read(reader)) {
				return;
			}

			const statusBarItem = reader.store.add(this._statusbarService.addEntry(
				{
					name: '',
					text: '',
					command: this._showStateInMarkdownDoc,
					tooltip: 'Edit Source Tracking',
					ariaLabel: '',
				},
				'editTelemetry',
				StatusbarAlignment.RIGHT,
				100
			));

			const sumChangedCharacters = derived(reader => {
				const docs = impl.docsState.read(reader);
				let sum = 0;
				for (const state of docs.values()) {
					const t = state.longtermTracker.read(reader);
					if (!t) { continue; }
					const d = state.getTelemetryData(t.getTrackedRanges(reader));
					sum += d.totalModifiedCharactersInFinalState;
				}
				return sum;
			});

			const tooltipMarkdownString = derived(reader => {
				const docs = impl.docsState.read(reader);
				const docsDataInTooltip: string[] = [];
				const editSources: EditSource[] = [];
				for (const [doc, state] of docs) {
					const tracker = state.longtermTracker.read(reader);
					if (!tracker) {
						continue;
					}
					const trackedRanges = tracker.getTrackedRanges(reader);
					const data = state.getTelemetryData(trackedRanges);
					if (data.totalModifiedCharactersInFinalState === 0) {
						continue; // Don't include unmodified documents in tooltip
					}

					editSources.push(...trackedRanges.map(r => r.source));

					// Filter out unmodified properties as these are not interesting to see in the hover
					const filteredData = Object.fromEntries(
						Object.entries(data).filter(([_, value]) => !(typeof value === 'number') || value !== 0)
					);

					docsDataInTooltip.push([
						`### ${doc.uri.fsPath}`,
						'```json',
						JSON.stringify(filteredData, undefined, '\t'),
						'```',
						'\n'
					].join('\n'));
				}

				let tooltipContent: string;
				if (docsDataInTooltip.length === 0) {
					tooltipContent = 'No modified documents';
				} else if (docsDataInTooltip.length <= 3) {
					tooltipContent = docsDataInTooltip.join('\n\n');
				} else {
					const lastThree = docsDataInTooltip.slice(-3);
					tooltipContent = '...\n\n' + lastThree.join('\n\n');
				}

				const agenda = this._createEditSourceAgenda(editSources);

				const tooltipWithCommand = new MarkdownString(tooltipContent + '\n\n[View Details](command:' + this._showStateInMarkdownDoc + ')');
				tooltipWithCommand.appendMarkdown('\n\n' + agenda + '\n\nToggle decorations: [Click here](command:' + this._toggleDecorations + ')');
				tooltipWithCommand.isTrusted = { enabledCommands: [this._toggleDecorations] };
				tooltipWithCommand.supportHtml = true;

				return tooltipWithCommand;
			});

			reader.store.add(autorun(reader => {
				statusBarItem.update({
					name: 'editTelemetry',
					text: `$(edit) ${sumChangedCharacters.read(reader)} chars inserted`,
					ariaLabel: `Edit Source Tracking: ${sumChangedCharacters.read(reader)} modified characters`,
					tooltip: tooltipMarkdownString.read(reader),
					command: this._showStateInMarkdownDoc,
				});
			}));

			reader.store.add(CommandsRegistry.registerCommand(this._toggleDecorations, () => {
				this._editSourceTrackingShowDecorations.set(!this._editSourceTrackingShowDecorations.read(undefined), undefined);
			}));
		}));
	}

	private _createEditSourceAgenda(editSources: EditSource[]): string {
		// Collect all edit sources from the tracked documents
		const editSourcesSeen = new Set<string>();
		const editSourceInfo = [];
		for (const editSource of editSources) {
			if (!editSourcesSeen.has(editSource.toString())) {
				editSourcesSeen.add(editSource.toString());
				editSourceInfo.push({ name: editSource.toString(), color: editSource.getColor() });
			}
		}

		const agendaItems = editSourceInfo.map(info =>
			`<span style="background-color:${info.color};border-radius:3px;">${info.name}</span>`
		);

		return agendaItems.join(' ');
	}
}

function makeSettable<T>(obs: IObservable<T>): ISettableObservable<T> {
	const overrideObs = observableValue<T | undefined>('overrideObs', undefined);
	return derivedWithSetter(overrideObs, (reader) => {
		return overrideObs.read(reader) ?? obs.read(reader);
	}, (value, tx) => {
		overrideObs.set(value, tx);
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/editSourceTrackingImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/editSourceTrackingImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { reverseOrder, compareBy, numberComparator, sumBy } from '../../../../../base/common/arrays.js';
import { IntervalTimer, TimeoutTimer } from '../../../../../base/common/async.js';
import { toDisposable, Disposable } from '../../../../../base/common/lifecycle.js';
import { mapObservableArrayCached, derived, IObservable, observableSignal, runOnChange, autorun } from '../../../../../base/common/observable.js';
import { IInstantiationService } from '../../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../../platform/telemetry/common/telemetry.js';
import { IUserAttentionService } from '../../../../services/userAttention/common/userAttentionService.js';
import { AnnotatedDocument, IAnnotatedDocuments } from '../helpers/annotatedDocuments.js';
import { CreateSuggestionIdForChatOrInlineChatCaller, EditTelemetryReportEditArcForChatOrInlineChatSender, EditTelemetryReportInlineEditArcSender } from './arcTelemetrySender.js';
import { createDocWithJustReason, EditSource } from '../helpers/documentWithAnnotatedEdits.js';
import { DocumentEditSourceTracker, TrackedEdit } from './editTracker.js';
import { sumByCategory } from '../helpers/utils.js';
import { ScmAdapter, ScmRepoAdapter } from './scmAdapter.js';
import { IRandomService } from '../randomService.js';

export class EditSourceTrackingImpl extends Disposable {
	public readonly docsState;
	private readonly _states;

	constructor(
		private readonly _statsEnabled: IObservable<boolean>,
		private readonly _annotatedDocuments: IAnnotatedDocuments,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
	) {
		super();

		const scmBridge = this._instantiationService.createInstance(ScmAdapter);
		this._states = mapObservableArrayCached(this, this._annotatedDocuments.documents, (doc, store) => {
			return [doc.document, store.add(this._instantiationService.createInstance(TrackedDocumentInfo, doc, scmBridge, this._statsEnabled))] as const;
		});
		this.docsState = this._states.map((entries) => new Map(entries));

		this.docsState.recomputeInitiallyAndOnChange(this._store);
	}
}

class TrackedDocumentInfo extends Disposable {
	public readonly longtermTracker: IObservable<DocumentEditSourceTracker<undefined> | undefined>;
	public readonly windowedTracker: IObservable<DocumentEditSourceTracker<undefined> | undefined>;
	public readonly windowedFocusTracker: IObservable<DocumentEditSourceTracker<undefined> | undefined>;

	private readonly _repo: IObservable<ScmRepoAdapter | undefined>;

	constructor(
		private readonly _doc: AnnotatedDocument,
		private readonly _scm: ScmAdapter,
		private readonly _statsEnabled: IObservable<boolean>,
		@IInstantiationService private readonly _instantiationService: IInstantiationService,
		@ITelemetryService private readonly _telemetryService: ITelemetryService,
		@IRandomService private readonly _randomService: IRandomService,
		@IUserAttentionService private readonly _userAttentionService: IUserAttentionService,
	) {
		super();

		this._repo = derived(this, reader => this._scm.getRepo(_doc.document.uri, reader));

		const docWithJustReason = createDocWithJustReason(_doc.documentWithAnnotations, this._store);

		const longtermResetSignal = observableSignal('resetSignal');

		let longtermReason: '10hours' | 'hashChange' | 'branchChange' | 'closed' = 'closed';
		this.longtermTracker = derived((reader) => {
			if (!this._statsEnabled.read(reader)) { return undefined; }
			longtermResetSignal.read(reader);

			const t = reader.store.add(new DocumentEditSourceTracker(docWithJustReason, undefined));
			const startFocusTime = this._userAttentionService.totalFocusTimeMs;
			const startTime = Date.now();
			reader.store.add(toDisposable(() => {
				// send long term document telemetry
				if (!t.isEmpty()) {
					this.sendTelemetry('longterm', longtermReason, t, this._userAttentionService.totalFocusTimeMs - startFocusTime, Date.now() - startTime);
				}
				t.dispose();
			}));
			return t;
		}).recomputeInitiallyAndOnChange(this._store);

		this._store.add(new IntervalTimer()).cancelAndSet(() => {
			// Reset after 10 hours
			longtermReason = '10hours';
			longtermResetSignal.trigger(undefined);
			longtermReason = 'closed';
		}, 10 * 60 * 60 * 1000);

		// Reset on branch change or commit
		this._store.add(autorun(reader => {
			const repo = this._repo.read(reader);
			if (repo) {
				reader.store.add(runOnChange(repo.headCommitHashObs, () => {
					longtermReason = 'hashChange';
					longtermResetSignal.trigger(undefined);
					longtermReason = 'closed';
				}));
				reader.store.add(runOnChange(repo.headBranchNameObs, () => {
					longtermReason = 'branchChange';
					longtermResetSignal.trigger(undefined);
					longtermReason = 'closed';
				}));
			}
		}));

		this._store.add(this._instantiationService.createInstance(EditTelemetryReportInlineEditArcSender, _doc.documentWithAnnotations, this._repo));
		this._store.add(this._instantiationService.createInstance(EditTelemetryReportEditArcForChatOrInlineChatSender, _doc.documentWithAnnotations, this._repo));
		this._store.add(this._instantiationService.createInstance(CreateSuggestionIdForChatOrInlineChatCaller, _doc.documentWithAnnotations));

		// Wall-clock time based 5-minute window tracker
		const resetSignal = observableSignal('resetSignal');

		this.windowedTracker = derived((reader) => {
			if (!this._statsEnabled.read(reader)) { return undefined; }

			if (!this._doc.isVisible.read(reader)) {
				return undefined;
			}
			resetSignal.read(reader);

			// Reset after 5 minutes of wall-clock time
			reader.store.add(new TimeoutTimer(() => {
				resetSignal.trigger(undefined);
			}, 5 * 60 * 1000));

			const t = reader.store.add(new DocumentEditSourceTracker(docWithJustReason, undefined));
			const startFocusTime = this._userAttentionService.totalFocusTimeMs;
			const startTime = Date.now();
			reader.store.add(toDisposable(async () => {
				// send windowed document telemetry
				this.sendTelemetry('5minWindow', 'time', t, this._userAttentionService.totalFocusTimeMs - startFocusTime, Date.now() - startTime);
				t.dispose();
			}));

			return t;
		}).recomputeInitiallyAndOnChange(this._store);

		// Focus time based 10-minute window tracker
		const focusResetSignal = observableSignal('focusResetSignal');

		this.windowedFocusTracker = derived((reader) => {
			if (!this._statsEnabled.read(reader)) { return undefined; }

			if (!this._doc.isVisible.read(reader)) {
				return undefined;
			}
			focusResetSignal.read(reader);

			// Reset after 10 minutes of accumulated focus time
			reader.store.add(this._userAttentionService.fireAfterGivenFocusTimePassed(10 * 60 * 1000, () => {
				focusResetSignal.trigger(undefined);
			}));

			const t = reader.store.add(new DocumentEditSourceTracker(docWithJustReason, undefined));
			const startFocusTime = this._userAttentionService.totalFocusTimeMs;
			const startTime = Date.now();
			reader.store.add(toDisposable(async () => {
				// send focus-windowed document telemetry
				this.sendTelemetry('10minFocusWindow', 'time', t, this._userAttentionService.totalFocusTimeMs - startFocusTime, Date.now() - startTime);
				t.dispose();
			}));

			return t;
		}).recomputeInitiallyAndOnChange(this._store);

	}

	async sendTelemetry(mode: 'longterm' | '5minWindow' | '10minFocusWindow', trigger: string, t: DocumentEditSourceTracker, focusTime: number, actualTime: number) {
		const ranges = t.getTrackedRanges();
		const keys = t.getAllKeys();
		if (keys.length === 0) {
			return;
		}

		const data = this.getTelemetryData(ranges);

		const statsUuid = this._randomService.generateUuid();

		const sums = sumByCategory(ranges, r => r.range.length, r => r.sourceKey);
		const entries = Object.entries(sums).filter(([key, value]) => value !== undefined);
		entries.sort(reverseOrder(compareBy(([key, value]) => value!, numberComparator)));
		entries.length = mode === 'longterm' ? 30 : 10;

		for (const key of keys) {
			if (!sums[key]) {
				sums[key] = 0;
			}
		}

		for (const [key, value] of Object.entries(sums)) {
			if (value === undefined) {
				continue;
			}

			const repr = t.getRepresentative(key)!;
			const deltaModifiedCount = t.getTotalInsertedCharactersCount(key);

			this._telemetryService.publicLog2<{
				mode: string;
				sourceKey: string;

				sourceKeyCleaned: string;
				extensionId: string | undefined;
				extensionVersion: string | undefined;
				modelId: string | undefined;

				trigger: string;
				languageId: string;
				statsUuid: string;
				modifiedCount: number;
				deltaModifiedCount: number;
				totalModifiedCount: number;
			}, {
				owner: 'hediet';
				comment: 'Provides detailed character count breakdown for individual edit sources (typing, paste, inline completions, NES, etc.) within a session. Reports the top 10-30 sources per session with granular metadata including extension IDs and model IDs for AI edits. Sessions are scoped to either 5-minute wall-clock time windows, 10-minute focus time windows for visible documents, or longer periods ending on branch changes, commits, or 10-hour intervals. Focus time is computed as the accumulated time where VS Code has focus and there was recent user activity (within the last minute). This event complements editSources.stats by providing source-specific details. @sentToGitHub';

				mode: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Describes the session mode. Is either \'longterm\', \'5minWindow\', or \'10minFocusWindow\'.' };
				sourceKey: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'A description of the source of the edit.' };

				sourceKeyCleaned: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The source of the edit with some properties (such as extensionId, extensionVersion and modelId) removed.' };
				extensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension id.' };
				extensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension.' };
				modelId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The LLM id.' };

				languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id of the document.' };
				statsUuid: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The unique identifier of the session for which stats are reported. The sourceKey is unique in this session.' };

				trigger: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates why the session ended.' };

				modifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of characters inserted by the given edit source during the session that are still in the text document at the end of the session.'; isMeasurement: true };
				deltaModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of characters inserted by the given edit source during the session.'; isMeasurement: true };
				totalModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The number of characters inserted by any edit source during the session that are still in the text document at the end of the session.'; isMeasurement: true };

			}>('editTelemetry.editSources.details', {
				mode,
				sourceKey: key,

				sourceKeyCleaned: repr.toKey(1, { $extensionId: false, $extensionVersion: false, $modelId: false }),
				extensionId: repr.props.$extensionId,
				extensionVersion: repr.props.$extensionVersion,
				modelId: repr.props.$modelId,

				trigger,
				languageId: this._doc.document.languageId.get(),
				statsUuid: statsUuid,
				modifiedCount: value,
				deltaModifiedCount: deltaModifiedCount,
				totalModifiedCount: data.totalModifiedCharactersInFinalState,
			});
		}


		const isTrackedByGit = await data.isTrackedByGit;
		this._telemetryService.publicLog2<{
			mode: string;
			languageId: string;
			statsUuid: string;
			nesModifiedCount: number;
			inlineCompletionsCopilotModifiedCount: number;
			inlineCompletionsNESModifiedCount: number;
			otherAIModifiedCount: number;
			unknownModifiedCount: number;
			userModifiedCount: number;
			ideModifiedCount: number;
			totalModifiedCharacters: number;
			externalModifiedCount: number;
			isTrackedByGit: number;
			focusTime: number;
			actualTime: number;
			trigger: string;
		}, {
			owner: 'hediet';
			comment: 'Aggregates character counts by edit source category (user typing, AI completions, NES, IDE actions, external changes) for each editing session. Sessions represent units of work and end when documents close, branches change, commits occur, or time limits are reached (5 minutes of wall-clock time, 10 minutes of focus time for visible documents, or 10 hours otherwise). Focus time is computed as accumulated 1-minute blocks where VS Code has focus and there was recent user activity. Tracks both total characters inserted and characters remaining at session end to measure retention. This high-level summary complements editSources.details which provides granular per-source breakdowns. @sentToGitHub';

			mode: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'longterm, 5minWindow, or 10minFocusWindow' };
			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The language id of the document.' };
			statsUuid: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The unique identifier for the telemetry event.' };

			nesModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of nes modified characters'; isMeasurement: true };
			inlineCompletionsCopilotModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of inline completions copilot modified characters'; isMeasurement: true };
			inlineCompletionsNESModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of inline completions nes modified characters'; isMeasurement: true };
			otherAIModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of other AI modified characters'; isMeasurement: true };
			unknownModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of unknown modified characters'; isMeasurement: true };
			userModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of user modified characters'; isMeasurement: true };
			ideModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of IDE modified characters'; isMeasurement: true };
			totalModifiedCharacters: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Total modified characters'; isMeasurement: true };
			externalModifiedCount: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'Fraction of external modified characters'; isMeasurement: true };
			isTrackedByGit: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates if the document is tracked by git.' };
			focusTime: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The focus time in ms during the session.'; isMeasurement: true };
			actualTime: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The actual time in ms during the session.'; isMeasurement: true };
			trigger: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Indicates why the session ended.' };
		}>('editTelemetry.editSources.stats', {
			mode,
			languageId: this._doc.document.languageId.get(),
			statsUuid: statsUuid,
			nesModifiedCount: data.nesModifiedCount,
			inlineCompletionsCopilotModifiedCount: data.inlineCompletionsCopilotModifiedCount,
			inlineCompletionsNESModifiedCount: data.inlineCompletionsNESModifiedCount,
			otherAIModifiedCount: data.otherAIModifiedCount,
			unknownModifiedCount: data.unknownModifiedCount,
			userModifiedCount: data.userModifiedCount,
			ideModifiedCount: data.ideModifiedCount,
			totalModifiedCharacters: data.totalModifiedCharactersInFinalState,
			externalModifiedCount: data.externalModifiedCount,
			isTrackedByGit: isTrackedByGit ? 1 : 0,
			focusTime,
			actualTime,
			trigger,
		});
	}

	getTelemetryData(ranges: readonly TrackedEdit[]) {
		const getEditCategory = (source: EditSource) => {
			if (source.category === 'ai' && source.kind === 'nes') { return 'nes'; }

			if (source.category === 'ai' && source.kind === 'completion' && source.extensionId === 'github.copilot') { return 'inlineCompletionsCopilot'; }
			if (source.category === 'ai' && source.kind === 'completion' && source.extensionId === 'github.copilot-chat' && source.providerId === 'completions') { return 'inlineCompletionsCopilot'; }
			if (source.category === 'ai' && source.kind === 'completion' && source.extensionId === 'github.copilot-chat' && source.providerId === 'nes') { return 'inlineCompletionsNES'; }
			if (source.category === 'ai' && source.kind === 'completion') { return 'inlineCompletionsOther'; }

			if (source.category === 'ai') { return 'otherAI'; }
			if (source.category === 'user') { return 'user'; }
			if (source.category === 'ide') { return 'ide'; }
			if (source.category === 'external') { return 'external'; }
			if (source.category === 'unknown') { return 'unknown'; }

			return 'unknown';
		};

		const sums = sumByCategory(ranges, r => r.range.length, r => getEditCategory(r.source));
		const totalModifiedCharactersInFinalState = sumBy(ranges, r => r.range.length);

		return {
			nesModifiedCount: sums.nes ?? 0,
			inlineCompletionsCopilotModifiedCount: sums.inlineCompletionsCopilot ?? 0,
			inlineCompletionsNESModifiedCount: sums.inlineCompletionsNES ?? 0,
			otherAIModifiedCount: sums.otherAI ?? 0,
			userModifiedCount: sums.user ?? 0,
			ideModifiedCount: sums.ide ?? 0,
			unknownModifiedCount: sums.unknown ?? 0,
			externalModifiedCount: sums.external ?? 0,
			totalModifiedCharactersInFinalState,
			languageId: this._doc.document.languageId.get(),
			isTrackedByGit: this._repo.get()?.isIgnored(this._doc.document.uri),
		};
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/editTracker.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/editTracker.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { Disposable } from '../../../../../base/common/lifecycle.js';
import { observableSignal, runOnChange, IReader } from '../../../../../base/common/observable.js';
import { AnnotatedStringEdit } from '../../../../../editor/common/core/edits/stringEdit.js';
import { OffsetRange } from '../../../../../editor/common/core/ranges/offsetRange.js';
import { TextModelEditSource } from '../../../../../editor/common/textModelEditSource.js';
import { IDocumentWithAnnotatedEdits, EditKeySourceData, EditSource } from '../helpers/documentWithAnnotatedEdits.js';

/**
 * Tracks a single document.
*/
export class DocumentEditSourceTracker<T = void> extends Disposable {
	private _edits: AnnotatedStringEdit<EditKeySourceData> = AnnotatedStringEdit.empty;
	private _pendingExternalEdits: AnnotatedStringEdit<EditKeySourceData> = AnnotatedStringEdit.empty;

	private readonly _update = observableSignal(this);
	private readonly _representativePerKey: Map<string, TextModelEditSource> = new Map();
	private readonly _sumAddedCharactersPerKey: Map</* key */string, number> = new Map();

	constructor(
		private readonly _doc: IDocumentWithAnnotatedEdits,
		public readonly data: T,
	) {
		super();

		this._register(runOnChange(this._doc.value, (_val, _prevVal, edits) => {
			const eComposed = AnnotatedStringEdit.compose(edits.map(e => e.edit));
			if (eComposed.replacements.every(e => e.data.source.category === 'external')) {
				if (this._edits.isEmpty()) {
					// Ignore initial external edits
				} else {
					// queue pending external edits
					this._pendingExternalEdits = this._pendingExternalEdits.compose(eComposed);
				}
			} else {
				if (!this._pendingExternalEdits.isEmpty()) {
					this._applyEdit(this._pendingExternalEdits);
					this._pendingExternalEdits = AnnotatedStringEdit.empty;
				}
				this._applyEdit(eComposed);
			}

			this._update.trigger(undefined);
		}));
	}

	private _applyEdit(e: AnnotatedStringEdit<EditKeySourceData>): void {
		for (const r of e.replacements) {
			let existing = this._sumAddedCharactersPerKey.get(r.data.key);
			if (existing === undefined) {
				existing = 0;
				this._representativePerKey.set(r.data.key, r.data.representative);
			}
			const newCount = existing + r.getNewLength();
			this._sumAddedCharactersPerKey.set(r.data.key, newCount);
		}

		this._edits = this._edits.compose(e);
	}

	async waitForQueue(): Promise<void> {
		await this._doc.waitForQueue();
	}

	public getTotalInsertedCharactersCount(key: string): number {
		const val = this._sumAddedCharactersPerKey.get(key);
		return val ?? 0;
	}

	public getAllKeys(): string[] {
		return Array.from(this._sumAddedCharactersPerKey.keys());
	}

	public getRepresentative(key: string): TextModelEditSource | undefined {
		return this._representativePerKey.get(key);
	}

	public getTrackedRanges(reader?: IReader): TrackedEdit[] {
		this._update.read(reader);
		const ranges = this._edits.getNewRanges();
		return ranges.map((r, idx) => {
			const e = this._edits.replacements[idx];
			const te = new TrackedEdit(e.replaceRange, r, e.data.key, e.data.source, e.data.representative);
			return te;
		});
	}

	public isEmpty(): boolean {
		return this._edits.isEmpty();
	}

	public _getDebugVisualization() {
		const ranges = this.getTrackedRanges();
		const txt = this._doc.value.get().value;

		return {
			...{ $fileExtension: 'text.w' },
			'value': txt,
			'decorations': ranges.map(r => {
				return {
					range: [r.range.start, r.range.endExclusive],
					color: r.source.getColor(),
				};
			})
		};
	}
}

export class TrackedEdit {
	constructor(
		public readonly originalRange: OffsetRange,
		public readonly range: OffsetRange,
		public readonly sourceKey: string,
		public readonly source: EditSource,
		public readonly sourceRepresentative: TextModelEditSource,
	) { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/scmAdapter.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/scmAdapter.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { WeakCachedFunction } from '../../../../../base/common/cache.js';
import { Event } from '../../../../../base/common/event.js';
import { observableSignalFromEvent, IReader, IObservable, derived } from '../../../../../base/common/observable.js';
import { URI } from '../../../../../base/common/uri.js';
import { ISCMRepository, ISCMService } from '../../../scm/common/scm.js';

export class ScmAdapter {
	private readonly _repos = new WeakCachedFunction((repo: ISCMRepository) => new ScmRepoAdapter(repo));

	private readonly _reposChangedSignal;

	constructor(
		@ISCMService private readonly _scmService: ISCMService
	) {
		this._reposChangedSignal = observableSignalFromEvent(this, Event.any(this._scmService.onDidAddRepository, this._scmService.onDidRemoveRepository));
	}

	public getRepo(uri: URI, reader: IReader | undefined): ScmRepoAdapter | undefined {
		this._reposChangedSignal.read(reader);
		const repo = this._scmService.getRepository(uri);
		if (!repo) {
			return undefined;
		}
		return this._repos.get(repo);
	}
}

export class ScmRepoAdapter {
	public readonly headBranchNameObs: IObservable<string | undefined> = derived(reader => this._repo.provider.historyProvider.read(reader)?.historyItemRef.read(reader)?.name);
	public readonly headCommitHashObs: IObservable<string | undefined> = derived(reader => this._repo.provider.historyProvider.read(reader)?.historyItemRef.read(reader)?.revision);

	constructor(
		private readonly _repo: ISCMRepository
	) {
	}

	async isIgnored(uri: URI): Promise<boolean> {
		return false;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProviderId } from '../../../../../../editor/common/languages.js';
import { EditDeltaInfo, EditSuggestionId } from '../../../../../../editor/common/textModelEditSource.js';
import { createDecorator } from '../../../../../../platform/instantiation/common/instantiation.js';

export const IAiEditTelemetryService = createDecorator<IAiEditTelemetryService>('aiEditTelemetryService');

export interface IAiEditTelemetryService {
	readonly _serviceBrand: undefined;

	createSuggestionId(data: Omit<IEditTelemetryCodeSuggestedData, 'suggestionId'>): EditSuggestionId;

	handleCodeAccepted(data: IEditTelemetryCodeAcceptedData): void;
}

export interface IEditTelemetryBaseData {
	suggestionId: EditSuggestionId | undefined;

	feature:
	/** Code suggestions generated in the sidebar chat panel */
	| 'sideBarChat'
	/** Code suggestions generated through inline chat within the editor */
	| 'inlineChat'
	/** Inline code completion suggestions */
	| 'inlineSuggestion'
	| undefined;

	presentation:
	/** Code displayed in a code block within chat responses. Only possible when feature is `sideBarChat` or `inlineChat`. */
	| 'codeBlock'
	/** Code already applied to the editor and highlighted with diff-style formatting. Only possible when feature is `sideBarChat` or `inlineChat`. */
	| 'highlightedEdit'
	/** Code suggested inline as completion text. Only possible when feature is `inlineSuggestion`. */
	| 'inlineCompletion'
	/** Code shown as next edit suggestion. Only possible when feature is `nextEditSuggestion`. */
	| 'nextEditSuggestion';

	source: ProviderId | undefined;

	languageId: string | undefined;

	editDeltaInfo: EditDeltaInfo | undefined;

	modeId:
	/** User asking questions without requesting code changes */
	| 'ask'
	/** User requesting direct code edits or modifications */
	| 'edit'
	/** AI agent mode for autonomous task completion and multi-file edits */
	| 'agent'
	/** Custom mode defined by extensions or user settings */
	| 'custom'
	/** Applying a previously suggested code block */
	| 'applyCodeBlock'
	| undefined;
	applyCodeBlockSuggestionId: EditSuggestionId | undefined; // Is set if modeId is applyCodeBlock

	modelId: string | undefined; // e.g. 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'
}

export interface IEditTelemetryCodeSuggestedData extends IEditTelemetryBaseData {
}

export interface IEditTelemetryCodeAcceptedData extends IEditTelemetryBaseData {
	acceptanceMethod:
	/** Insert code at the current cursor position in the active editor. Only possible when presentation is `codeBlock`. */
	| 'insertAtCursor'
	/** Create a new file and insert the code there. Only possible when presentation is `codeBlock`. */
	| 'insertInNewFile'
	/** User manually copied the code. Only possible when presentation is `codeBlock`. */
	| 'copyManual'
	/** User clicked a copy button to copy the code. Only possible when presentation is `codeBlock`. */
	| 'copyButton'
	/** User accepted the suggestion by clicking 'keep' (when presentation is `highlightedEdit`) or pressing Tab (when feature is `inlineSuggestion`) */
	| 'accept';
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryServiceImpl.ts]---
Location: vscode-main/src/vs/workbench/contrib/editTelemetry/browser/telemetry/aiEditTelemetry/aiEditTelemetryServiceImpl.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EditSuggestionId } from '../../../../../../editor/common/textModelEditSource.js';
import { IInstantiationService } from '../../../../../../platform/instantiation/common/instantiation.js';
import { ITelemetryService } from '../../../../../../platform/telemetry/common/telemetry.js';
import { TelemetryTrustedValue } from '../../../../../../platform/telemetry/common/telemetryUtils.js';
import { DataChannelForwardingTelemetryService, forwardToChannelIf, isCopilotLikeExtension } from '../../../../../../platform/dataChannel/browser/forwardingTelemetryService.js';
import { IAiEditTelemetryService, IEditTelemetryCodeAcceptedData, IEditTelemetryCodeSuggestedData } from './aiEditTelemetryService.js';
import { IRandomService } from '../../randomService.js';

export class AiEditTelemetryServiceImpl implements IAiEditTelemetryService {
	declare readonly _serviceBrand: undefined;

	private readonly _telemetryService: ITelemetryService;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IRandomService private readonly _randomService: IRandomService,
	) {
		this._telemetryService = this.instantiationService.createInstance(DataChannelForwardingTelemetryService);
	}

	public createSuggestionId(data: Omit<IEditTelemetryCodeSuggestedData, 'suggestionId'>): EditSuggestionId {
		const suggestionId = EditSuggestionId.newId(ns => this._randomService.generatePrefixedUuid(ns));
		this._telemetryService.publicLog2<{
			eventId: string | undefined;
			suggestionId: string | undefined;

			presentation: 'codeBlock' | 'highlightedEdit' | 'inlineCompletion' | 'nextEditSuggestion' | undefined;
			feature: 'sideBarChat' | 'inlineChat' | 'inlineSuggestion' | string | undefined;

			sourceExtensionId: string | undefined;
			sourceExtensionVersion: string | undefined;
			sourceProviderId: string | undefined;

			languageId: string | undefined;
			editCharsInserted: number | undefined;
			editCharsDeleted: number | undefined;
			editLinesInserted: number | undefined;
			editLinesDeleted: number | undefined;

			modeId: 'ask' | 'edit' | 'agent' | 'custom' | 'applyCodeBlock' | undefined;
			modelId: TelemetryTrustedValue<string | undefined>;
			applyCodeBlockSuggestionId: string | undefined;
		}, {
			owner: 'hediet';
			comment: 'Reports when code from AI is suggested to the user. @sentToGitHub';

			eventId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for this event.' };
			suggestionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for this suggestion. Not always set.' };

			presentation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How the code suggestion is presented to the user. See #IEditTelemetryBaseData.presentation for possible values.' };
			feature: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The feature the code suggestion came from. See #IEditTelemetryBaseData.feature for possible values.' };

			sourceExtensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension that provided the code suggestion, if any.' };
			sourceExtensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension that provided the code suggestion, if any.' };
			sourceProviderId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider ID of the source that provided the code suggestion, if any.' };

			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The programming language of the code suggestion.' };
			editCharsInserted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of characters inserted in the edit.' };
			editCharsDeleted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of characters deleted in the edit.' };
			editLinesInserted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of lines inserted in the edit.' };
			editLinesDeleted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of lines deleted in the edit.' };

			modeId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The mode. See #IEditTelemetryBaseData.modeId for possible values.' };
			modelId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The AI model used to generate the suggestion.' };
			applyCodeBlockSuggestionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If this suggestion is for applying a suggested code block, this is the id of the suggested code block.' };
		}>('editTelemetry.codeSuggested', {
			eventId: this._randomService.generatePrefixedUuid('evt'),
			suggestionId: suggestionId as unknown as string,
			presentation: data.presentation,
			feature: data.feature,

			sourceExtensionId: data.source?.extensionId,
			sourceExtensionVersion: data.source?.extensionVersion,
			sourceProviderId: data.source?.providerId,

			languageId: data.languageId,
			editCharsInserted: data.editDeltaInfo?.charsAdded,
			editCharsDeleted: data.editDeltaInfo?.charsRemoved,
			editLinesInserted: data.editDeltaInfo?.linesAdded,
			editLinesDeleted: data.editDeltaInfo?.linesRemoved,

			modeId: data.modeId,
			modelId: new TelemetryTrustedValue(data.modelId),
			applyCodeBlockSuggestionId: data.applyCodeBlockSuggestionId as unknown as string,

			...forwardToChannelIf(isCopilotLikeExtension(data.source?.extensionId)),
		});

		return suggestionId;
	}

	public handleCodeAccepted(data: IEditTelemetryCodeAcceptedData): void {
		this._telemetryService.publicLog2<{
			eventId: string | undefined;
			suggestionId: string | undefined;

			presentation: 'codeBlock' | 'highlightedEdit' | 'inlineCompletion' | 'nextEditSuggestion' | undefined;
			feature: 'sideBarChat' | 'inlineChat' | 'inlineSuggestion' | string | undefined;

			sourceExtensionId: string | undefined;
			sourceExtensionVersion: string | undefined;
			sourceProviderId: string | undefined;


			languageId: string | undefined;
			editCharsInserted: number | undefined;
			editCharsDeleted: number | undefined;
			editLinesInserted: number | undefined;
			editLinesDeleted: number | undefined;

			modeId: 'ask' | 'edit' | 'agent' | 'custom' | 'applyCodeBlock' | undefined;
			modelId: TelemetryTrustedValue<string | undefined>;
			applyCodeBlockSuggestionId: string | undefined;

			acceptanceMethod:
			| 'insertAtCursor'
			| 'insertInNewFile'
			| 'copyManual'
			| 'copyButton'
			| 'applyCodeBlock'
			| 'accept';
		}, {
			owner: 'hediet';
			comment: 'Reports when code from AI is accepted by the user. @sentToGitHub';

			eventId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for this event.' };
			suggestionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'Unique identifier for this suggestion. Not always set.' };

			presentation: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How the code suggestion is presented to the user. See #IEditTelemetryBaseData.presentation for possible values.' };
			feature: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The feature the code suggestion came from. See #IEditTelemetryBaseData.feature for possible values.' };

			sourceExtensionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The extension that provided the code suggestion, if any.' };
			sourceExtensionVersion: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The version of the extension that provided the code suggestion, if any.' };
			sourceProviderId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The provider ID of the source that provided the code suggestion, if any.' };

			languageId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The programming language of the code suggestion.' };
			editCharsInserted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of characters inserted in the edit.' };
			editCharsDeleted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of characters deleted in the edit.' };
			editLinesInserted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of lines inserted in the edit.' };
			editLinesDeleted: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; isMeasurement: true; comment: 'Number of lines deleted in the edit.' };

			modeId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The mode. See #IEditTelemetryBaseData.modeId for possible values.' };
			modelId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'The AI model used to generate the suggestion.' };

			applyCodeBlockSuggestionId: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'If this suggestion is for applying a suggested code block, this is the id of the suggested code block.' };
			acceptanceMethod: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'How the user accepted the code suggestion. See #IEditTelemetryCodeAcceptedData.acceptanceMethod for possible values.' };
		}>('editTelemetry.codeAccepted', {
			eventId: this._randomService.generatePrefixedUuid('evt'),
			suggestionId: data.suggestionId as unknown as string,
			presentation: data.presentation,
			feature: data.feature,

			sourceExtensionId: data.source?.extensionId,
			sourceExtensionVersion: data.source?.extensionVersion,
			sourceProviderId: data.source?.providerId,

			languageId: data.languageId,
			editCharsInserted: data.editDeltaInfo?.charsAdded,
			editCharsDeleted: data.editDeltaInfo?.charsRemoved,
			editLinesInserted: data.editDeltaInfo?.linesAdded,
			editLinesDeleted: data.editDeltaInfo?.linesRemoved,

			modeId: data.modeId,
			modelId: new TelemetryTrustedValue(data.modelId),
			applyCodeBlockSuggestionId: data.applyCodeBlockSuggestionId as unknown as string,
			acceptanceMethod: data.acceptanceMethod,

			...forwardToChannelIf(isCopilotLikeExtension(data.source?.extensionId)),
		});
	}
}
```

--------------------------------------------------------------------------------

````
