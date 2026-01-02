---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 481
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 481 of 552)

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

---[FILE: src/vs/workbench/contrib/userDataSync/browser/userDataSync.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/browser/userDataSync.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toAction } from '../../../../base/common/actions.js';
import { getErrorMessage, isCancellationError } from '../../../../base/common/errors.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable, toDisposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { ServicesAccessor } from '../../../../editor/browser/editorExtensions.js';
import type { ITextModel } from '../../../../editor/common/model.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { ITextModelContentProvider, ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { localize, localize2 } from '../../../../nls.js';
import { MenuId, MenuRegistry, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, ContextKeyTrueExpr, IContextKey, IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { QuickPickItem, IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import {
	IUserDataAutoSyncService, IUserDataSyncService, registerConfiguration,
	SyncResource, SyncStatus, UserDataSyncError, UserDataSyncErrorCode, USER_DATA_SYNC_SCHEME, IUserDataSyncEnablementService,
	IResourcePreview, IUserDataSyncStoreManagementService, UserDataSyncStoreType, IUserDataSyncStore, IUserDataSyncResourceConflicts, IUserDataSyncResource, IUserDataSyncResourceError, USER_DATA_SYNC_LOG_ID
} from '../../../../platform/userDataSync/common/userDataSync.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IOutputService } from '../../../services/output/common/output.js';
import { IActivityService, IBadge, NumberBadge, ProgressBadge } from '../../../services/activity/common/activity.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { fromNow } from '../../../../base/common/date.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IAuthenticationService } from '../../../services/authentication/common/authentication.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { ViewContainerLocation, IViewContainersRegistry, Extensions, ViewContainer } from '../../../common/views.js';
import { UserDataSyncDataViews } from './userDataSyncViews.js';
import { IUserDataSyncWorkbenchService, getSyncAreaLabel, AccountStatus, CONTEXT_SYNC_STATE, CONTEXT_SYNC_ENABLEMENT, CONTEXT_ACCOUNT_STATE, CONFIGURE_SYNC_COMMAND_ID, SHOW_SYNC_LOG_COMMAND_ID, SYNC_VIEW_CONTAINER_ID, SYNC_TITLE, SYNC_VIEW_ICON, CONTEXT_HAS_CONFLICTS, DOWNLOAD_ACTIVITY_ACTION_DESCRIPTOR } from '../../../services/userDataSync/common/userDataSync.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { ctxIsMergeResultEditor, ctxMergeBaseUri } from '../../mergeEditor/common/mergeEditor.js';
import { IWorkbenchIssueService } from '../../issue/common/issue.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { isWeb } from '../../../../base/common/platform.js';

type ConfigureSyncQuickPickItem = { id: SyncResource; label: string; description?: string };

type SyncConflictsClassification = {
	owner: 'sandy081';
	comment: 'Response information when conflict happens during settings sync';
	source: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'settings sync resource. eg., settings, keybindings...' };
	action?: { classification: 'SystemMetaData'; purpose: 'FeatureInsight'; comment: 'action taken while resolving conflicts. Eg: acceptLocal, acceptRemote' };
};

const turnOffSyncCommand = { id: 'workbench.userDataSync.actions.turnOff', title: localize2('stop sync', 'Turn Off') };
const configureSyncCommand = { id: CONFIGURE_SYNC_COMMAND_ID, title: localize2('configure sync', 'Configure...') };
const showConflictsCommandId = 'workbench.userDataSync.actions.showConflicts';
const syncNowCommand = {
	id: 'workbench.userDataSync.actions.syncNow',
	title: localize2('sync now', 'Sync Now'),
	description(userDataSyncService: IUserDataSyncService): string | undefined {
		if (userDataSyncService.status === SyncStatus.Syncing) {
			return localize('syncing', "syncing");
		}
		if (userDataSyncService.lastSyncTime) {
			return localize('synced with time', "synced {0}", fromNow(userDataSyncService.lastSyncTime, true));
		}
		return undefined;
	}
};
const showSyncSettingsCommand = { id: 'workbench.userDataSync.actions.settings', title: localize2('sync settings', 'Show Settings'), };
const showSyncedDataCommand = { id: 'workbench.userDataSync.actions.showSyncedData', title: localize2('show synced data', 'Show Synced Data'), };

const CONTEXT_TURNING_ON_STATE = new RawContextKey<false>('userDataSyncTurningOn', false);

export class UserDataSyncWorkbenchContribution extends Disposable implements IWorkbenchContribution {

	private readonly turningOnSyncContext: IContextKey<boolean>;

	private readonly globalActivityBadgeDisposable = this._register(new MutableDisposable());
	private readonly accountBadgeDisposable = this._register(new MutableDisposable());

	constructor(
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IUserDataSyncWorkbenchService private readonly userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IActivityService private readonly activityService: IActivityService,
		@INotificationService private readonly notificationService: INotificationService,
		@IEditorService private readonly editorService: IEditorService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IDialogService private readonly dialogService: IDialogService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IOutputService private readonly outputService: IOutputService,
		@IUserDataAutoSyncService userDataAutoSyncService: IUserDataAutoSyncService,
		@ITextModelService textModelResolverService: ITextModelService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IProductService private readonly productService: IProductService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IAuthenticationService private readonly authenticationService: IAuthenticationService,
		@IUserDataSyncStoreManagementService private readonly userDataSyncStoreManagementService: IUserDataSyncStoreManagementService,
		@IHostService private readonly hostService: IHostService,
		@ICommandService private readonly commandService: ICommandService,
		@IWorkbenchIssueService private readonly workbenchIssueService: IWorkbenchIssueService
	) {
		super();

		this.turningOnSyncContext = CONTEXT_TURNING_ON_STATE.bindTo(contextKeyService);

		if (userDataSyncWorkbenchService.enabled) {
			registerConfiguration();

			this.updateAccountBadge();
			this.updateGlobalActivityBadge();
			this.onDidChangeConflicts(this.userDataSyncService.conflicts);

			this._register(Event.any(
				Event.debounce(userDataSyncService.onDidChangeStatus, () => undefined, 500),
				this.userDataSyncEnablementService.onDidChangeEnablement,
				this.userDataSyncWorkbenchService.onDidChangeAccountStatus
			)(() => {
				this.updateAccountBadge();
				this.updateGlobalActivityBadge();
			}));
			this._register(userDataSyncService.onDidChangeConflicts(() => this.onDidChangeConflicts(this.userDataSyncService.conflicts)));
			this._register(userDataSyncEnablementService.onDidChangeEnablement(() => this.onDidChangeConflicts(this.userDataSyncService.conflicts)));
			this._register(userDataSyncService.onSyncErrors(errors => this.onSynchronizerErrors(errors)));
			this._register(userDataAutoSyncService.onError(error => this.onAutoSyncError(error)));

			this.registerActions();
			this.registerViews();

			textModelResolverService.registerTextModelContentProvider(USER_DATA_SYNC_SCHEME, instantiationService.createInstance(UserDataRemoteContentProvider));

			this._register(Event.any(userDataSyncService.onDidChangeStatus, userDataSyncEnablementService.onDidChangeEnablement)
				(() => this.turningOnSync = !userDataSyncEnablementService.isEnabled() && userDataSyncService.status !== SyncStatus.Idle));
		}
	}

	private get turningOnSync(): boolean {
		return !!this.turningOnSyncContext.get();
	}

	private set turningOnSync(turningOn: boolean) {
		this.turningOnSyncContext.set(turningOn);
		this.updateGlobalActivityBadge();
	}

	private toKey({ syncResource: resource, profile }: IUserDataSyncResource): string {
		return `${profile.id}:${resource}`;
	}

	private readonly conflictsDisposables = new Map<string, IDisposable>();
	private onDidChangeConflicts(conflicts: IUserDataSyncResourceConflicts[]) {
		this.updateGlobalActivityBadge();
		this.registerShowConflictsAction();
		if (!this.userDataSyncEnablementService.isEnabled()) {
			return;
		}
		if (conflicts.length) {
			// Clear and dispose conflicts those were cleared
			for (const [key, disposable] of this.conflictsDisposables.entries()) {
				if (!conflicts.some(conflict => this.toKey(conflict) === key)) {
					disposable.dispose();
					this.conflictsDisposables.delete(key);
				}
			}

			for (const conflict of this.userDataSyncService.conflicts) {
				const key = this.toKey(conflict);
				// Show conflicts notification if not shown before
				if (!this.conflictsDisposables.has(key)) {
					const conflictsArea = getSyncAreaLabel(conflict.syncResource);
					const handle = this.notificationService.prompt(Severity.Warning, localize('conflicts detected', "Unable to sync due to conflicts in {0}. Please resolve them to continue.", conflictsArea.toLowerCase()),
						[
							{
								label: localize('replace remote', "Replace Remote"),
								run: () => {
									this.acceptLocal(conflict, conflict.conflicts[0]);
								}
							},
							{
								label: localize('replace local', "Replace Local"),
								run: () => {
									this.acceptRemote(conflict, conflict.conflicts[0]);
								}
							},
							{
								label: localize('show conflicts', "Show Conflicts"),
								run: () => {
									this.telemetryService.publicLog2<{ source: string; action?: string }, SyncConflictsClassification>('sync/showConflicts', { source: conflict.syncResource });
									this.userDataSyncWorkbenchService.showConflicts(conflict.conflicts[0]);
								}
							}
						],
						{
							sticky: true
						}
					);
					this.conflictsDisposables.set(key, toDisposable(() => {
						// close the conflicts warning notification
						handle.close();
						this.conflictsDisposables.delete(key);
					}));
				}
			}
		} else {
			this.conflictsDisposables.forEach(disposable => disposable.dispose());
			this.conflictsDisposables.clear();
		}
	}

	private async acceptRemote(syncResource: IUserDataSyncResource, conflict: IResourcePreview) {
		try {
			await this.userDataSyncService.accept(syncResource, conflict.remoteResource, undefined, this.userDataSyncEnablementService.isEnabled());
		} catch (e) {
			this.notificationService.error(localize('accept failed', "Error while accepting changes. Please check [logs]({0}) for more details.", `command:${SHOW_SYNC_LOG_COMMAND_ID}`));
		}
	}

	private async acceptLocal(syncResource: IUserDataSyncResource, conflict: IResourcePreview): Promise<void> {
		try {
			await this.userDataSyncService.accept(syncResource, conflict.localResource, undefined, this.userDataSyncEnablementService.isEnabled());
		} catch (e) {
			this.notificationService.error(localize('accept failed', "Error while accepting changes. Please check [logs]({0}) for more details.", `command:${SHOW_SYNC_LOG_COMMAND_ID}`));
		}
	}

	private onAutoSyncError(error: UserDataSyncError): void {
		switch (error.code) {
			case UserDataSyncErrorCode.SessionExpired:
				this.notificationService.notify({
					severity: Severity.Info,
					message: localize('session expired', "Settings sync was turned off because current session is expired, please sign in again to turn on sync."),
					actions: {
						primary: [toAction({
							id: 'turn on sync',
							label: localize('turn on sync', "Turn on Settings Sync..."),
							run: () => this.turnOn()
						})]
					}
				});
				break;
			case UserDataSyncErrorCode.TurnedOff:
				this.notificationService.notify({
					severity: Severity.Info,
					message: localize('turned off', "Settings sync was turned off from another device, please turn on sync again."),
					actions: {
						primary: [toAction({
							id: 'turn on sync',
							label: localize('turn on sync', "Turn on Settings Sync..."),
							run: () => this.turnOn()
						})]
					}
				});
				break;
			case UserDataSyncErrorCode.TooLarge:
				if (error.resource === SyncResource.Keybindings || error.resource === SyncResource.Settings || error.resource === SyncResource.Tasks) {
					this.disableSync(error.resource);
					const sourceArea = getSyncAreaLabel(error.resource);
					this.handleTooLargeError(error.resource, localize('too large', "Disabled syncing {0} because size of the {1} file to sync is larger than {2}. Please open the file and reduce the size and enable sync", sourceArea.toLowerCase(), sourceArea.toLowerCase(), '100kb'), error);
				}
				break;
			case UserDataSyncErrorCode.LocalTooManyProfiles:
				this.disableSync(SyncResource.Profiles);
				this.notificationService.error(localize('too many profiles', "Disabled syncing profiles because there are too many profiles to sync. Settings Sync supports syncing maximum 20 profiles. Please reduce the number of profiles and enable sync"));
				break;
			case UserDataSyncErrorCode.IncompatibleLocalContent:
			case UserDataSyncErrorCode.Gone:
			case UserDataSyncErrorCode.UpgradeRequired: {
				const message = localize('error upgrade required', "Settings sync is disabled because the current version ({0}, {1}) is not compatible with the sync service. Please update before turning on sync.", this.productService.version, this.productService.commit);
				const operationId = error.operationId ? localize('operationId', "Operation Id: {0}", error.operationId) : undefined;
				this.notificationService.notify({
					severity: Severity.Error,
					message: operationId ? `${message} ${operationId}` : message,
				});
				break;
			}
			case UserDataSyncErrorCode.MethodNotFound: {
				const message = localize('method not found', "Settings sync is disabled because the client is making invalid requests. Please report an issue with the logs.");
				const operationId = error.operationId ? localize('operationId', "Operation Id: {0}", error.operationId) : undefined;
				this.notificationService.notify({
					severity: Severity.Error,
					message: operationId ? `${message} ${operationId}` : message,
					actions: {
						primary: [
							toAction({
								id: 'Show Sync Logs',
								label: localize('show sync logs', "Show Log"),
								run: () => this.commandService.executeCommand(SHOW_SYNC_LOG_COMMAND_ID)
							}),
							toAction({
								id: 'Report Issue',
								label: localize('report issue', "Report Issue"),
								run: () => this.workbenchIssueService.openReporter()
							})
						]
					}
				});
				break;
			}
			case UserDataSyncErrorCode.IncompatibleRemoteContent:
				this.notificationService.notify({
					severity: Severity.Error,
					message: localize('error reset required', "Settings sync is disabled because your data in the cloud is older than that of the client. Please clear your data in the cloud before turning on sync."),
					actions: {
						primary: [
							toAction({
								id: 'reset',
								label: localize('reset', "Clear Data in Cloud..."),
								run: () => this.userDataSyncWorkbenchService.resetSyncedData()
							}),
							toAction({
								id: 'show synced data',
								label: localize('show synced data action', "Show Synced Data"),
								run: () => this.userDataSyncWorkbenchService.showSyncActivity()
							})
						]
					}
				});
				return;

			case UserDataSyncErrorCode.ServiceChanged:
				this.notificationService.notify({
					severity: Severity.Info,
					message: this.userDataSyncStoreManagementService.userDataSyncStore?.type === 'insiders' ?
						localize('service switched to insiders', "Settings Sync has been switched to insiders service") :
						localize('service switched to stable', "Settings Sync has been switched to stable service"),
				});

				return;

			case UserDataSyncErrorCode.DefaultServiceChanged:
				// Settings sync is using separate service
				if (this.userDataSyncEnablementService.isEnabled()) {
					this.notificationService.notify({
						severity: Severity.Info,
						message: localize('using separate service', "Settings sync now uses a separate service, more information is available in the [Settings Sync Documentation](https://aka.ms/vscode-settings-sync-help#_syncing-stable-versus-insiders)."),
					});
				}

				// If settings sync got turned off then ask user to turn on sync again.
				else {
					this.notificationService.notify({
						severity: Severity.Info,
						message: localize('service changed and turned off', "Settings sync was turned off because {0} now uses a separate service. Please turn on sync again.", this.productService.nameLong),
						actions: {
							primary: [toAction({
								id: 'turn on sync',
								label: localize('turn on sync', "Turn on Settings Sync..."),
								run: () => this.turnOn()
							})]
						}
					});
				}
				return;
		}
	}

	private handleTooLargeError(resource: SyncResource, message: string, error: UserDataSyncError): void {
		const operationId = error.operationId ? localize('operationId', "Operation Id: {0}", error.operationId) : undefined;
		this.notificationService.notify({
			severity: Severity.Error,
			message: operationId ? `${message} ${operationId}` : message,
			actions: {
				primary: [toAction({
					id: 'open sync file',
					label: localize('open file', "Open {0} File", getSyncAreaLabel(resource)),
					run: () => resource === SyncResource.Settings ? this.preferencesService.openUserSettings({ jsonEditor: true }) : this.preferencesService.openGlobalKeybindingSettings(true)
				})]
			}
		});
	}

	private readonly invalidContentErrorDisposables = new Map<string, IDisposable>();
	private onSynchronizerErrors(errors: IUserDataSyncResourceError[]): void {
		if (errors.length) {
			for (const { profile, syncResource: resource, error } of errors) {
				switch (error.code) {
					case UserDataSyncErrorCode.LocalInvalidContent:
						this.handleInvalidContentError({ profile, syncResource: resource });
						break;
					default: {
						const key = `${profile.id}:${resource}`;
						const disposable = this.invalidContentErrorDisposables.get(key);
						if (disposable) {
							disposable.dispose();
							this.invalidContentErrorDisposables.delete(key);
						}
					}
				}
			}
		} else {
			this.invalidContentErrorDisposables.forEach(disposable => disposable.dispose());
			this.invalidContentErrorDisposables.clear();
		}
	}

	private handleInvalidContentError({ profile, syncResource: source }: IUserDataSyncResource): void {
		if (this.userDataProfileService.currentProfile.id !== profile.id) {
			return;
		}
		const key = `${profile.id}:${source}`;
		if (this.invalidContentErrorDisposables.has(key)) {
			return;
		}
		if (source !== SyncResource.Settings && source !== SyncResource.Keybindings && source !== SyncResource.Tasks) {
			return;
		}
		if (!this.hostService.hasFocus) {
			return;
		}
		const resource = source === SyncResource.Settings ? this.userDataProfileService.currentProfile.settingsResource
			: source === SyncResource.Keybindings ? this.userDataProfileService.currentProfile.keybindingsResource
				: this.userDataProfileService.currentProfile.tasksResource;
		const editorUri = EditorResourceAccessor.getCanonicalUri(this.editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (isEqual(resource, editorUri)) {
			// Do not show notification if the file in error is active
			return;
		}
		const errorArea = getSyncAreaLabel(source);
		const handle = this.notificationService.notify({
			severity: Severity.Error,
			message: localize('errorInvalidConfiguration', "Unable to sync {0} because the content in the file is not valid. Please open the file and correct it.", errorArea.toLowerCase()),
			actions: {
				primary: [toAction({
					id: 'open sync file',
					label: localize('open file', "Open {0} File", errorArea),
					run: () => source === SyncResource.Settings ? this.preferencesService.openUserSettings({ jsonEditor: true }) : this.preferencesService.openGlobalKeybindingSettings(true)
				})]
			}
		});
		this.invalidContentErrorDisposables.set(key, toDisposable(() => {
			// close the error warning notification
			handle.close();
			this.invalidContentErrorDisposables.delete(key);
		}));
	}

	private getConflictsCount(): number {
		return this.userDataSyncService.conflicts.reduce((result, { conflicts }) => { return result + conflicts.length; }, 0);
	}

	private async updateGlobalActivityBadge(): Promise<void> {
		this.globalActivityBadgeDisposable.clear();

		let badge: IBadge | undefined = undefined;
		if (this.userDataSyncService.conflicts.length && this.userDataSyncEnablementService.isEnabled()) {
			badge = new NumberBadge(this.getConflictsCount(), () => localize('has conflicts', "{0}: Conflicts Detected", SYNC_TITLE.value));
		} else if (this.turningOnSync) {
			badge = new ProgressBadge(() => localize('turning on syncing', "Turning on Settings Sync..."));
		}

		if (badge) {
			this.globalActivityBadgeDisposable.value = this.activityService.showGlobalActivity({ badge });
		}
	}

	private async updateAccountBadge(): Promise<void> {
		this.accountBadgeDisposable.clear();

		let badge: IBadge | undefined = undefined;

		if (this.userDataSyncService.status !== SyncStatus.Uninitialized && this.userDataSyncEnablementService.isEnabled() && this.userDataSyncWorkbenchService.accountStatus === AccountStatus.Unavailable) {
			badge = new NumberBadge(1, () => localize('sign in to sync', "Sign in to Sync Settings"));
		}

		if (badge) {
			this.accountBadgeDisposable.value = this.activityService.showAccountsActivity({ badge });
		}
	}

	private async turnOn(): Promise<void> {
		try {
			if (!this.userDataSyncWorkbenchService.authenticationProviders.length) {
				throw new Error(localize('no authentication providers', "No authentication providers are available."));
			}
			const turnOn = await this.askToConfigure();
			if (!turnOn) {
				return;
			}
			if (this.userDataSyncStoreManagementService.userDataSyncStore?.canSwitch) {
				await this.selectSettingsSyncService(this.userDataSyncStoreManagementService.userDataSyncStore);
			}
			await this.userDataSyncWorkbenchService.turnOn();
		} catch (e) {
			if (isCancellationError(e)) {
				return;
			}
			if (e instanceof UserDataSyncError) {
				switch (e.code) {
					case UserDataSyncErrorCode.TooLarge:
						if (e.resource === SyncResource.Keybindings || e.resource === SyncResource.Settings || e.resource === SyncResource.Tasks) {
							this.handleTooLargeError(e.resource, localize('too large while starting sync', "Settings sync cannot be turned on because size of the {0} file to sync is larger than {1}. Please open the file and reduce the size and turn on sync", getSyncAreaLabel(e.resource).toLowerCase(), '100kb'), e);
							return;
						}
						break;
					case UserDataSyncErrorCode.IncompatibleLocalContent:
					case UserDataSyncErrorCode.Gone:
					case UserDataSyncErrorCode.UpgradeRequired: {
						const message = localize('error upgrade required while starting sync', "Settings sync cannot be turned on because the current version ({0}, {1}) is not compatible with the sync service. Please update before turning on sync.", this.productService.version, this.productService.commit);
						const operationId = e.operationId ? localize('operationId', "Operation Id: {0}", e.operationId) : undefined;
						this.notificationService.notify({
							severity: Severity.Error,
							message: operationId ? `${message} ${operationId}` : message,
						});
						return;
					}
					case UserDataSyncErrorCode.IncompatibleRemoteContent:
						this.notificationService.notify({
							severity: Severity.Error,
							message: localize('error reset required while starting sync', "Settings sync cannot be turned on because your data in the cloud is older than that of the client. Please clear your data in the cloud before turning on sync."),
							actions: {
								primary: [
									toAction({
										id: 'reset',
										label: localize('reset', "Clear Data in Cloud..."),
										run: () => this.userDataSyncWorkbenchService.resetSyncedData()
									}),
									toAction({
										id: 'show synced data',
										label: localize('show synced data action', "Show Synced Data"),
										run: () => this.userDataSyncWorkbenchService.showSyncActivity()
									})
								]
							}
						});
						return;
					case UserDataSyncErrorCode.Unauthorized:
					case UserDataSyncErrorCode.Forbidden:
						this.notificationService.error(localize('auth failed', "Error while turning on Settings Sync: Authentication failed."));
						return;
				}
				this.notificationService.error(localize('turn on failed with user data sync error', "Error while turning on Settings Sync. Please check [logs]({0}) for more details.", `command:${SHOW_SYNC_LOG_COMMAND_ID}`));
			} else {
				this.notificationService.error(localize({ key: 'turn on failed', comment: ['Substitution is for error reason'] }, "Error while turning on Settings Sync. {0}", getErrorMessage(e)));
			}
		}
	}

	private async askToConfigure(): Promise<boolean> {
		return new Promise<boolean>((c, e) => {
			const disposables: DisposableStore = new DisposableStore();
			const quickPick = this.quickInputService.createQuickPick<ConfigureSyncQuickPickItem>();
			disposables.add(quickPick);
			quickPick.title = SYNC_TITLE.value;
			quickPick.ok = false;
			quickPick.customButton = true;
			quickPick.customLabel = localize('sign in and turn on', "Sign in");
			quickPick.description = localize('configure and turn on sync detail', "Please sign in to backup and sync your data across devices.");
			quickPick.canSelectMany = true;
			quickPick.ignoreFocusOut = true;
			quickPick.hideInput = true;
			quickPick.hideCheckAll = true;

			const items = this.getConfigureSyncQuickPickItems();
			quickPick.items = items;
			quickPick.selectedItems = items.filter(item => this.userDataSyncEnablementService.isResourceEnabled(item.id, true));
			let accepted: boolean = false;
			disposables.add(Event.any(quickPick.onDidAccept, quickPick.onDidCustom)(() => {
				accepted = true;
				quickPick.hide();
			}));
			disposables.add(quickPick.onDidHide(() => {
				try {
					if (accepted) {
						this.updateConfiguration(items, quickPick.selectedItems);
					}
					c(accepted);
				} catch (error) {
					e(error);
				} finally {
					disposables.dispose();
				}
			}));
			quickPick.show();
		});
	}

	private getConfigureSyncQuickPickItems(): ConfigureSyncQuickPickItem[] {
		const result = [{
			id: SyncResource.Settings,
			label: getSyncAreaLabel(SyncResource.Settings)
		}, {
			id: SyncResource.Keybindings,
			label: getSyncAreaLabel(SyncResource.Keybindings),
		}, {
			id: SyncResource.Snippets,
			label: getSyncAreaLabel(SyncResource.Snippets)
		}, {
			id: SyncResource.Tasks,
			label: getSyncAreaLabel(SyncResource.Tasks)
		}, {
			id: SyncResource.Mcp,
			label: getSyncAreaLabel(SyncResource.Mcp)
		}, {
			id: SyncResource.GlobalState,
			label: getSyncAreaLabel(SyncResource.GlobalState),
		}, {
			id: SyncResource.Extensions,
			label: getSyncAreaLabel(SyncResource.Extensions)
		}, {
			id: SyncResource.Profiles,
			label: getSyncAreaLabel(SyncResource.Profiles),
		}, {
			id: SyncResource.Prompts,
			label: getSyncAreaLabel(SyncResource.Prompts)
		}];


		return result;
	}

	private updateConfiguration(items: ConfigureSyncQuickPickItem[], selectedItems: ReadonlyArray<ConfigureSyncQuickPickItem>): void {
		for (const item of items) {
			const wasEnabled = this.userDataSyncEnablementService.isResourceEnabled(item.id);
			const isEnabled = !!selectedItems.filter(selected => selected.id === item.id)[0];
			if (wasEnabled !== isEnabled) {
				this.userDataSyncEnablementService.setResourceEnablement(item.id, isEnabled);
			}
		}
	}

	private async configureSyncOptions(): Promise<void> {
		return new Promise((c, e) => {
			const disposables: DisposableStore = new DisposableStore();
			const quickPick = this.quickInputService.createQuickPick<ConfigureSyncQuickPickItem>();
			disposables.add(quickPick);
			quickPick.title = localize('configure sync title', "{0}: Configure...", SYNC_TITLE.value);
			quickPick.placeholder = localize('configure sync placeholder', "Choose what to sync");
			quickPick.canSelectMany = true;
			quickPick.ignoreFocusOut = true;
			quickPick.ok = true;
			const items = this.getConfigureSyncQuickPickItems();
			quickPick.items = items;
			quickPick.selectedItems = items.filter(item => this.userDataSyncEnablementService.isResourceEnabled(item.id));
			disposables.add(quickPick.onDidAccept(async () => {
				if (quickPick.selectedItems.length) {
					this.updateConfiguration(items, quickPick.selectedItems);
					quickPick.hide();
				}
			}));
			disposables.add(quickPick.onDidHide(() => {
				disposables.dispose();
				c();
			}));
			quickPick.show();
		});
	}

	private async turnOff(): Promise<void> {
		const result = await this.dialogService.confirm({
			message: localize('turn off sync confirmation', "Do you want to turn off sync?"),
			detail: localize('turn off sync detail', "Your settings, keybindings, extensions, snippets and UI State will no longer be synced."),
			primaryButton: localize({ key: 'turn off', comment: ['&& denotes a mnemonic'] }, "&&Turn off"),
			checkbox: this.userDataSyncWorkbenchService.accountStatus === AccountStatus.Available ? {
				label: localize('turn off sync everywhere', "Turn off sync on all your devices and clear the data from the cloud.")
			} : undefined
		});
		if (result.confirmed) {
			return this.userDataSyncWorkbenchService.turnoff(!!result.checkboxChecked);
		}
	}

	private disableSync(source: SyncResource): void {
		switch (source) {
			case SyncResource.Settings: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Settings, false);
			case SyncResource.Keybindings: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Keybindings, false);
			case SyncResource.Snippets: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Snippets, false);
			case SyncResource.Tasks: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Tasks, false);
			case SyncResource.Extensions: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Extensions, false);
			case SyncResource.GlobalState: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.GlobalState, false);
			case SyncResource.Profiles: return this.userDataSyncEnablementService.setResourceEnablement(SyncResource.Profiles, false);
		}
	}

	private showSyncActivity(): Promise<void> {
		return this.outputService.showChannel(USER_DATA_SYNC_LOG_ID);
	}

	private async selectSettingsSyncService(userDataSyncStore: IUserDataSyncStore): Promise<void> {
		return new Promise<void>((c, e) => {
			const disposables: DisposableStore = new DisposableStore();
			const quickPick = disposables.add(this.quickInputService.createQuickPick<{ id: UserDataSyncStoreType; label: string; description?: string }>());
			quickPick.title = localize('switchSyncService.title', "{0}: Select Service", SYNC_TITLE.value);
			quickPick.description = localize('switchSyncService.description', "Ensure you are using the same settings sync service when syncing with multiple environments");
			quickPick.hideInput = true;
			quickPick.ignoreFocusOut = true;
			const getDescription = (url: URI): string | undefined => {
				const isDefault = isEqual(url, userDataSyncStore.defaultUrl);
				if (isDefault) {
					return localize('default', "Default");
				}
				return undefined;
			};
			quickPick.items = [
				{
					id: 'insiders',
					label: localize('insiders', "Insiders"),
					description: getDescription(userDataSyncStore.insidersUrl)
				},
				{
					id: 'stable',
					label: localize('stable', "Stable"),
					description: getDescription(userDataSyncStore.stableUrl)
				}
			];
			disposables.add(quickPick.onDidAccept(async () => {
				try {
					await this.userDataSyncStoreManagementService.switch(quickPick.selectedItems[0].id);
					c();
				} catch (error) {
					e(error);
				} finally {
					quickPick.hide();
				}
			}));
			disposables.add(quickPick.onDidHide(() => disposables.dispose()));
			quickPick.show();
		});
	}

	private registerActions(): void {
		if (this.userDataSyncEnablementService.canToggleEnablement()) {
			this.registerTurnOnSyncAction();
			this.registerTurnOffSyncAction();
		}
		this.registerTurningOnSyncAction();
		this.registerCancelTurnOnSyncAction();
		this.registerSignInAction(); // When Sync is turned on from CLI
		this.registerShowConflictsAction();

		this.registerEnableSyncViewsAction();
		this.registerManageSyncAction();
		this.registerSyncNowAction();
		this.registerConfigureSyncAction();
		this.registerShowSettingsAction();
		this.registerHelpAction();
		this.registerShowLogAction();
		this.registerResetSyncDataAction();
		this.registerAcceptMergesAction();

		if (isWeb) {
			this.registerDownloadSyncActivityAction();
		}
	}

	private registerTurnOnSyncAction(): void {
		const that = this;
		const when = ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_SYNC_ENABLEMENT.toNegated(), CONTEXT_TURNING_ON_STATE.negate());
		this._register(registerAction2(class TurningOnSyncAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userDataSync.actions.turnOn',
					title: localize2('global activity turn on sync', 'Backup and Sync Settings...'),
					category: SYNC_TITLE,
					f1: true,
					precondition: when,
					menu: [{
						group: '3_configuration',
						id: MenuId.GlobalActivity,
						when,
						order: 2
					}, {
						group: '3_configuration',
						id: MenuId.MenubarPreferencesMenu,
						when,
						order: 2
					}, {
						group: '1_settings',
						id: MenuId.AccountsContext,
						when,
						order: 2
					}]
				});
			}
			async run(): Promise<void> {
				return that.turnOn();
			}
		}));
	}

	private registerTurningOnSyncAction(): void {
		const when = ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_SYNC_ENABLEMENT.toNegated(), CONTEXT_TURNING_ON_STATE);
		this._register(registerAction2(class TurningOnSyncAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userData.actions.turningOn',
					title: localize('turning on sync', "Turning on Settings Sync..."),
					precondition: ContextKeyExpr.false(),
					menu: [{
						group: '3_configuration',
						id: MenuId.GlobalActivity,
						when,
						order: 2
					}, {
						group: '1_settings',
						id: MenuId.AccountsContext,
						when,
					}]
				});
			}
			async run(): Promise<void> { }
		}));
	}

	private registerCancelTurnOnSyncAction(): void {
		const that = this;
		this._register(registerAction2(class TurningOnSyncAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userData.actions.cancelTurnOn',
					title: localize('cancel turning on sync', "Cancel"),
					icon: Codicon.stopCircle,
					menu: {
						id: MenuId.ViewContainerTitle,
						when: ContextKeyExpr.and(CONTEXT_TURNING_ON_STATE, ContextKeyExpr.equals('viewContainer', SYNC_VIEW_CONTAINER_ID)),
						group: 'navigation',
						order: 1
					}
				});
			}
			async run(): Promise<void> {
				return that.userDataSyncWorkbenchService.turnoff(false);
			}
		}));
	}

	private registerSignInAction(): void {
		const that = this;
		const id = 'workbench.userData.actions.signin';
		const when = ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_SYNC_ENABLEMENT, CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Unavailable));
		this._register(registerAction2(class StopSyncAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userData.actions.signin',
					title: localize('sign in global', "Sign in to Sync Settings"),
					menu: {
						group: '3_configuration',
						id: MenuId.GlobalActivity,
						when,
						order: 2
					}
				});
			}
			async run(): Promise<void> {
				try {
					await that.userDataSyncWorkbenchService.signIn();
				} catch (e) {
					that.notificationService.error(e);
				}
			}
		}));
		this._register(MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '1_settings',
			command: {
				id,
				title: localize('sign in accounts', "Sign in to Sync Settings (1)"),
			},
			when
		}));
	}

	private getShowConflictsTitle(): ILocalizedString {
		return localize2('resolveConflicts_global', "Show Conflicts ({0})", this.getConflictsCount());
	}

	private readonly conflictsActionDisposable = this._register(new MutableDisposable());
	private registerShowConflictsAction(): void {
		this.conflictsActionDisposable.value = undefined;
		const that = this;
		this.conflictsActionDisposable.value = registerAction2(class TurningOnSyncAction extends Action2 {
			constructor() {
				super({
					id: showConflictsCommandId,
					get title() { return that.getShowConflictsTitle(); },
					category: SYNC_TITLE,
					f1: true,
					precondition: CONTEXT_HAS_CONFLICTS,
					menu: [{
						group: '3_configuration',
						id: MenuId.GlobalActivity,
						when: CONTEXT_HAS_CONFLICTS,
						order: 2
					}, {
						group: '3_configuration',
						id: MenuId.MenubarPreferencesMenu,
						when: CONTEXT_HAS_CONFLICTS,
						order: 2
					}]
				});
			}
			async run(): Promise<void> {
				return that.userDataSyncWorkbenchService.showConflicts();
			}
		});
	}

	private registerManageSyncAction(): void {
		const that = this;
		const when = ContextKeyExpr.and(CONTEXT_SYNC_ENABLEMENT, CONTEXT_ACCOUNT_STATE.notEqualsTo(AccountStatus.Unavailable), CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized));
		this._register(registerAction2(class SyncStatusAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userDataSync.actions.manage',
					title: localize('sync is on', "Settings Sync is On"),
					toggled: ContextKeyTrueExpr.INSTANCE,
					menu: [
						{
							id: MenuId.GlobalActivity,
							group: '3_configuration',
							when,
							order: 2
						},
						{
							id: MenuId.MenubarPreferencesMenu,
							group: '3_configuration',
							when,
							order: 2,
						},
						{
							id: MenuId.AccountsContext,
							group: '1_settings',
							when,
						}
					],
				});
			}
			run(accessor: ServicesAccessor): unknown {
				return new Promise<void>((c, e) => {
					const quickInputService = accessor.get(IQuickInputService);
					const commandService = accessor.get(ICommandService);
					const disposables = new DisposableStore();
					const quickPick = quickInputService.createQuickPick({ useSeparators: true });
					disposables.add(quickPick);
					const items: Array<QuickPickItem> = [];
					if (that.userDataSyncService.conflicts.length) {
						items.push({ id: showConflictsCommandId, label: `${SYNC_TITLE.value}: ${that.getShowConflictsTitle().original}` });
						items.push({ type: 'separator' });
					}
					items.push({ id: configureSyncCommand.id, label: `${SYNC_TITLE.value}: ${configureSyncCommand.title.original}` });
					items.push({ id: showSyncSettingsCommand.id, label: `${SYNC_TITLE.value}: ${showSyncSettingsCommand.title.original}` });
					items.push({ id: showSyncedDataCommand.id, label: `${SYNC_TITLE.value}: ${showSyncedDataCommand.title.original}` });
					items.push({ type: 'separator' });
					items.push({ id: syncNowCommand.id, label: `${SYNC_TITLE.value}: ${syncNowCommand.title.original}`, description: syncNowCommand.description(that.userDataSyncService) });
					if (that.userDataSyncEnablementService.canToggleEnablement()) {
						const account = that.userDataSyncWorkbenchService.current;
						items.push({ id: turnOffSyncCommand.id, label: `${SYNC_TITLE.value}: ${turnOffSyncCommand.title.original}`, description: account ? `${account.accountName} (${that.authenticationService.getProvider(account.authenticationProviderId).label})` : undefined });
					}
					quickPick.items = items;
					disposables.add(quickPick.onDidAccept(() => {
						if (quickPick.selectedItems[0] && quickPick.selectedItems[0].id) {
							commandService.executeCommand(quickPick.selectedItems[0].id);
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
		}));
	}

	private registerEnableSyncViewsAction(): void {
		const that = this;
		const when = ContextKeyExpr.and(CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Available), CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized));
		this._register(registerAction2(class SyncStatusAction extends Action2 {
			constructor() {
				super({
					id: showSyncedDataCommand.id,
					title: showSyncedDataCommand.title,
					category: SYNC_TITLE,
					precondition: when,
					menu: {
						id: MenuId.CommandPalette,
						when
					}
				});
			}
			run(accessor: ServicesAccessor): Promise<void> {
				return that.userDataSyncWorkbenchService.showSyncActivity();
			}
		}));
	}

	private registerSyncNowAction(): void {
		const that = this;
		this._register(registerAction2(class SyncNowAction extends Action2 {
			constructor() {
				super({
					id: syncNowCommand.id,
					title: syncNowCommand.title,
					category: SYNC_TITLE,
					menu: {
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.and(CONTEXT_SYNC_ENABLEMENT, CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Available), CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized))
					}
				});
			}
			run(accessor: ServicesAccessor): Promise<void> {
				return that.userDataSyncWorkbenchService.syncNow();
			}
		}));
	}

	private registerTurnOffSyncAction(): void {
		const that = this;
		this._register(registerAction2(class StopSyncAction extends Action2 {
			constructor() {
				super({
					id: turnOffSyncCommand.id,
					title: turnOffSyncCommand.title,
					category: SYNC_TITLE,
					menu: {
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_SYNC_ENABLEMENT),
					},
				});
			}
			async run(): Promise<void> {
				try {
					await that.turnOff();
				} catch (e) {
					if (!isCancellationError(e)) {
						that.notificationService.error(localize('turn off failed', "Error while turning off Settings Sync. Please check [logs]({0}) for more details.", `command:${SHOW_SYNC_LOG_COMMAND_ID}`));
					}
				}
			}
		}));
	}

	private registerConfigureSyncAction(): void {
		const that = this;
		const when = ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_SYNC_ENABLEMENT);
		this._register(registerAction2(class ConfigureSyncAction extends Action2 {
			constructor() {
				super({
					id: configureSyncCommand.id,
					title: configureSyncCommand.title,
					category: SYNC_TITLE,
					icon: Codicon.settingsGear,
					tooltip: localize('configure', "Configure..."),
					menu: [{
						id: MenuId.CommandPalette,
						when
					}, {
						id: MenuId.ViewContainerTitle,
						when: ContextKeyExpr.and(CONTEXT_SYNC_ENABLEMENT, ContextKeyExpr.equals('viewContainer', SYNC_VIEW_CONTAINER_ID)),
						group: 'navigation',
						order: 2
					}]
				});
			}
			run(): unknown { return that.configureSyncOptions(); }
		}));
	}

	private registerShowLogAction(): void {
		const that = this;
		this._register(registerAction2(class ShowSyncActivityAction extends Action2 {
			constructor() {
				super({
					id: SHOW_SYNC_LOG_COMMAND_ID,
					title: localize('show sync log title', "{0}: Show Log", SYNC_TITLE.value),
					tooltip: localize('show sync log toolrip', "Show Log"),
					icon: Codicon.output,
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized)),
					}, {
						id: MenuId.ViewContainerTitle,
						when: ContextKeyExpr.equals('viewContainer', SYNC_VIEW_CONTAINER_ID),
						group: 'navigation',
						order: 1
					}],
				});
			}
			run(): unknown { return that.showSyncActivity(); }
		}));
	}

	private registerShowSettingsAction(): void {
		this._register(registerAction2(class ShowSyncSettingsAction extends Action2 {
			constructor() {
				super({
					id: showSyncSettingsCommand.id,
					title: showSyncSettingsCommand.title,
					category: SYNC_TITLE,
					menu: {
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized)),
					},
				});
			}
			run(accessor: ServicesAccessor): void {
				accessor.get(IPreferencesService).openUserSettings({ jsonEditor: false, query: '@tag:sync' });
			}
		}));
	}

	private registerHelpAction(): void {
		const that = this;
		this._register(registerAction2(class HelpAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userDataSync.actions.help',
					title: SYNC_TITLE,
					category: Categories.Help,
					menu: [{
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized)),
					}],
				});
			}
			run(): unknown { return that.openerService.open(URI.parse('https://aka.ms/vscode-settings-sync-help')); }
		}));
		MenuRegistry.appendMenuItem(MenuId.ViewContainerTitle, {
			command: {
				id: 'workbench.userDataSync.actions.help',
				title: Categories.Help.value
			},
			when: ContextKeyExpr.equals('viewContainer', SYNC_VIEW_CONTAINER_ID),
			group: '1_help',
		});
	}

	private registerAcceptMergesAction(): void {
		const that = this;
		this._register(registerAction2(class AcceptMergesAction extends Action2 {
			constructor() {
				super({
					id: 'workbench.userDataSync.actions.acceptMerges',
					title: localize('complete merges title', "Complete Merge"),
					menu: [{
						id: MenuId.EditorContent,
						when: ContextKeyExpr.and(ctxIsMergeResultEditor, ContextKeyExpr.regex(ctxMergeBaseUri.key, new RegExp(`^${USER_DATA_SYNC_SCHEME}:`))),
					}],
				});
			}

			async run(accessor: ServicesAccessor, previewResource: URI): Promise<void> {
				const textFileService = accessor.get(ITextFileService);
				await textFileService.save(previewResource);
				const content = await textFileService.read(previewResource);
				await that.userDataSyncService.accept(this.getSyncResource(previewResource), previewResource, content.value, true);
			}

			private getSyncResource(previewResource: URI): IUserDataSyncResource {
				const conflict = that.userDataSyncService.conflicts.find(({ conflicts }) => conflicts.some(conflict => isEqual(conflict.previewResource, previewResource)));
				if (conflict) {
					return conflict;
				}
				throw new Error(`Unknown resource: ${previewResource.toString()}`);
			}
		}));
	}

	private registerDownloadSyncActivityAction(): void {
		this._register(registerAction2(class DownloadSyncActivityAction extends Action2 {
			constructor() {
				super(DOWNLOAD_ACTIVITY_ACTION_DESCRIPTOR);
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const userDataSyncWorkbenchService = accessor.get(IUserDataSyncWorkbenchService);
				const notificationService = accessor.get(INotificationService);
				const folder = await userDataSyncWorkbenchService.downloadSyncActivity();
				if (folder) {
					notificationService.info(localize('download sync activity complete', "Successfully downloaded Settings Sync activity."));
				}
			}

		}));
	}

	private registerViews(): void {
		const container = this.registerViewContainer();
		this.registerDataViews(container);
	}

	private registerViewContainer(): ViewContainer {
		return Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry).registerViewContainer(
			{
				id: SYNC_VIEW_CONTAINER_ID,
				title: SYNC_TITLE,
				ctorDescriptor: new SyncDescriptor(
					ViewPaneContainer,
					[SYNC_VIEW_CONTAINER_ID, { mergeViewWithContainerWhenSingleView: true }]
				),
				icon: SYNC_VIEW_ICON,
				hideIfEmpty: true,
			}, ViewContainerLocation.Sidebar);
	}

	private registerResetSyncDataAction(): void {
		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.actions.syncData.reset',
					title: localize('workbench.actions.syncData.reset', "Clear Data in Cloud..."),
					menu: [{
						id: MenuId.ViewContainerTitle,
						when: ContextKeyExpr.equals('viewContainer', SYNC_VIEW_CONTAINER_ID),
						group: '0_configure',
					}],
				});
			}
			run(): unknown { return that.userDataSyncWorkbenchService.resetSyncedData(); }
		}));
	}

	private registerDataViews(container: ViewContainer): void {
		this._register(this.instantiationService.createInstance(UserDataSyncDataViews, container));
	}

}

class UserDataRemoteContentProvider implements ITextModelContentProvider {

	constructor(
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
	) {
	}

	provideTextContent(uri: URI): Promise<ITextModel> | null {
		if (uri.scheme === USER_DATA_SYNC_SCHEME) {
			return this.userDataSyncService.resolveContent(uri).then(content => this.modelService.createModel(content || '', this.languageService.createById('jsonc'), uri));
		}
		return null;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataSync/browser/userDataSyncConflictsView.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/browser/userDataSyncConflictsView.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ITreeItem, TreeItemCollapsibleState, TreeViewItemHandleArg, IViewDescriptorService } from '../../../common/views.js';
import { localize } from '../../../../nls.js';
import { TreeViewPane } from '../../../browser/parts/views/treeView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IUserDataSyncService, Change, MergeState, IUserDataSyncResource, IResourcePreview, IUserDataSyncEnablementService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { URI } from '../../../../base/common/uri.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { getSyncAreaLabel, IUserDataSyncConflictsView, IUserDataSyncWorkbenchService, SYNC_CONFLICTS_VIEW_ID } from '../../../services/userDataSync/common/userDataSync.js';
import { basename, isEqual } from '../../../../base/common/resources.js';
import * as DOM from '../../../../base/browser/dom.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { IUserDataProfile, IUserDataProfilesService, reviveProfile } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { DEFAULT_EDITOR_ASSOCIATION } from '../../../common/editor.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IAccessibleViewInformationService } from '../../../services/accessibility/common/accessibleViewInformationService.js';

type UserDataSyncConflictResource = IUserDataSyncResource & IResourcePreview;

export class UserDataSyncConflictsViewPane extends TreeViewPane implements IUserDataSyncConflictsView {

	constructor(
		options: IViewletViewOptions,
		@IEditorService private readonly editorService: IEditorService,
		@IKeybindingService keybindingService: IKeybindingService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IOpenerService openerService: IOpenerService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IHoverService hoverService: IHoverService,
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
		@IUserDataSyncWorkbenchService private readonly userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IAccessibleViewInformationService accessibleViewVisibilityService: IAccessibleViewInformationService,
	) {
		super(options, keybindingService, contextMenuService, configurationService, contextKeyService, viewDescriptorService, instantiationService, openerService, themeService, notificationService, hoverService, accessibleViewVisibilityService);
		this._register(this.userDataSyncService.onDidChangeConflicts(() => this.treeView.refresh()));
		this.registerActions();
	}

	protected override renderTreeView(container: HTMLElement): void {
		super.renderTreeView(DOM.append(container, DOM.$('')));

		const that = this;
		this.treeView.message = localize('explanation', "Please go through each entry and merge to resolve conflicts.");
		this.treeView.dataProvider = { getChildren() { return that.getTreeItems(); } };
	}

	private async getTreeItems(): Promise<ITreeItem[]> {
		const roots: ITreeItem[] = [];

		const conflictResources: UserDataSyncConflictResource[] = this.userDataSyncService.conflicts
			.map(conflict => conflict.conflicts.map(resourcePreview => ({ ...resourcePreview, syncResource: conflict.syncResource, profile: conflict.profile })))
			.flat()
			.sort((a, b) => a.profile.id === b.profile.id ? 0 : a.profile.isDefault ? -1 : b.profile.isDefault ? 1 : a.profile.name.localeCompare(b.profile.name));
		const conflictResourcesByProfile: [IUserDataProfile, UserDataSyncConflictResource[]][] = [];
		for (const previewResource of conflictResources) {
			let result = conflictResourcesByProfile[conflictResourcesByProfile.length - 1]?.[0].id === previewResource.profile.id ? conflictResourcesByProfile[conflictResourcesByProfile.length - 1][1] : undefined;
			if (!result) {
				conflictResourcesByProfile.push([previewResource.profile, result = []]);
			}
			result.push(previewResource);
		}

		for (const [profile, resources] of conflictResourcesByProfile) {
			const children: ITreeItem[] = [];
			for (const resource of resources) {
				const handle = JSON.stringify(resource);
				const treeItem = {
					handle,
					resourceUri: resource.remoteResource,
					label: { label: basename(resource.remoteResource), strikethrough: resource.mergeState === MergeState.Accepted && (resource.localChange === Change.Deleted || resource.remoteChange === Change.Deleted) },
					description: getSyncAreaLabel(resource.syncResource),
					collapsibleState: TreeItemCollapsibleState.None,
					command: { id: `workbench.actions.sync.openConflicts`, title: '', arguments: [{ $treeViewId: '', $treeItemHandle: handle } satisfies TreeViewItemHandleArg] },
					contextValue: `sync-conflict-resource`
				};
				children.push(treeItem);
			}
			roots.push({
				handle: profile.id,
				label: { label: profile.name },
				collapsibleState: TreeItemCollapsibleState.Expanded,
				children
			});
		}

		return conflictResourcesByProfile.length === 1 && conflictResourcesByProfile[0][0].isDefault ? roots[0].children ?? [] : roots;
	}

	private parseHandle(handle: string): UserDataSyncConflictResource {
		const parsed: UserDataSyncConflictResource = JSON.parse(handle);
		return {
			syncResource: parsed.syncResource,
			profile: reviveProfile(parsed.profile, this.userDataProfilesService.profilesHome.scheme),
			localResource: URI.revive(parsed.localResource),
			remoteResource: URI.revive(parsed.remoteResource),
			baseResource: URI.revive(parsed.baseResource),
			previewResource: URI.revive(parsed.previewResource),
			acceptedResource: URI.revive(parsed.acceptedResource),
			localChange: parsed.localChange,
			remoteChange: parsed.remoteChange,
			mergeState: parsed.mergeState,
		};
	}

	private registerActions(): void {
		const that = this;

		this._register(registerAction2(class OpenConflictsAction extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.openConflicts`,
					title: localize({ key: 'workbench.actions.sync.openConflicts', comment: ['This is an action title to show the conflicts between local and remote version of resources'] }, "Show Conflicts"),
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const conflict = that.parseHandle(handle.$treeItemHandle);
				return that.open(conflict);
			}
		}));

		this._register(registerAction2(class AcceptRemoteAction extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.acceptRemote`,
					title: localize('workbench.actions.sync.acceptRemote', "Accept Remote"),
					icon: Codicon.cloudDownload,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', SYNC_CONFLICTS_VIEW_ID), ContextKeyExpr.equals('viewItem', 'sync-conflict-resource')),
						group: 'inline',
						order: 1,
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const conflict = that.parseHandle(handle.$treeItemHandle);
				await that.userDataSyncWorkbenchService.accept({ syncResource: conflict.syncResource, profile: conflict.profile }, conflict.remoteResource, undefined, that.userDataSyncEnablementService.isEnabled());
			}
		}));

		this._register(registerAction2(class AcceptLocalAction extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.acceptLocal`,
					title: localize('workbench.actions.sync.acceptLocal', "Accept Local"),
					icon: Codicon.cloudUpload,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', SYNC_CONFLICTS_VIEW_ID), ContextKeyExpr.equals('viewItem', 'sync-conflict-resource')),
						group: 'inline',
						order: 2,
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const conflict = that.parseHandle(handle.$treeItemHandle);
				await that.userDataSyncWorkbenchService.accept({ syncResource: conflict.syncResource, profile: conflict.profile }, conflict.localResource, undefined, that.userDataSyncEnablementService.isEnabled());
			}
		}));
	}

	async open(conflictToOpen: IResourcePreview): Promise<void> {
		if (!this.userDataSyncService.conflicts.some(({ conflicts }) => conflicts.some(({ localResource }) => isEqual(localResource, conflictToOpen.localResource)))) {
			return;
		}

		const remoteResourceName = localize({ key: 'remoteResourceName', comment: ['remote as in file in cloud'] }, "{0} (Remote)", basename(conflictToOpen.remoteResource));
		const localResourceName = localize('localResourceName', "{0} (Local)", basename(conflictToOpen.remoteResource));
		await this.editorService.openEditor({
			input1: { resource: conflictToOpen.remoteResource, label: localize('Theirs', 'Theirs'), description: remoteResourceName },
			input2: { resource: conflictToOpen.localResource, label: localize('Yours', 'Yours'), description: localResourceName },
			base: { resource: conflictToOpen.baseResource },
			result: { resource: conflictToOpen.previewResource },
			options: {
				preserveFocus: true,
				revealIfVisible: true,
				pinned: true,
				override: DEFAULT_EDITOR_ASSOCIATION.id
			}
		});
		return;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataSync/browser/userDataSyncTrigger.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/browser/userDataSyncTrigger.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { isWeb } from '../../../../base/common/platform.js';
import { isEqual } from '../../../../base/common/resources.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IUserDataAutoSyncService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { VIEWLET_ID } from '../../extensions/common/extensions.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { KeybindingsEditorInput } from '../../../services/preferences/browser/keybindingsEditorInput.js';
import { SettingsEditor2Input } from '../../../services/preferences/common/preferencesEditorInput.js';

export class UserDataSyncTrigger extends Disposable implements IWorkbenchContribution {

	constructor(
		@IEditorService editorService: IEditorService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
		@IViewsService viewsService: IViewsService,
		@IUserDataAutoSyncService userDataAutoSyncService: IUserDataAutoSyncService,
		@IHostService hostService: IHostService,
	) {
		super();
		const event = Event.filter(
			Event.any<string | undefined>(
				Event.map(editorService.onDidActiveEditorChange, () => this.getUserDataEditorInputSource(editorService.activeEditor)),
				Event.map(Event.filter(viewsService.onDidChangeViewContainerVisibility, e => e.id === VIEWLET_ID && e.visible), e => e.id)
			), source => source !== undefined);
		if (isWeb) {
			this._register(Event.debounce<string, string[]>(
				Event.any<string>(
					Event.map(hostService.onDidChangeFocus, () => 'windowFocus'),
					Event.map(event, source => source!),
				), (last, source) => last ? [...last, source] : [source], 1000)
				(sources => userDataAutoSyncService.triggerSync(sources, { skipIfSyncedRecently: true })));
		} else {
			this._register(event(source => userDataAutoSyncService.triggerSync([source!], { skipIfSyncedRecently: true })));
		}
	}

	private getUserDataEditorInputSource(editorInput: EditorInput | undefined): string | undefined {
		if (!editorInput) {
			return undefined;
		}
		if (editorInput instanceof SettingsEditor2Input) {
			return 'settingsEditor';
		}
		if (editorInput instanceof KeybindingsEditorInput) {
			return 'keybindingsEditor';
		}
		const resource = editorInput.resource;
		if (isEqual(resource, this.userDataProfilesService.defaultProfile.settingsResource)) {
			return 'settingsEditor';
		}
		if (isEqual(resource, this.userDataProfilesService.defaultProfile.keybindingsResource)) {
			return 'keybindingsEditor';
		}
		return undefined;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataSync/browser/userDataSyncViews.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/browser/userDataSyncViews.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Registry } from '../../../../platform/registry/common/platform.js';
import { IViewsRegistry, Extensions, ITreeViewDescriptor, ITreeViewDataProvider, ITreeItem, TreeItemCollapsibleState, TreeViewItemHandleArg, ViewContainer } from '../../../common/views.js';
import { localize, localize2 } from '../../../../nls.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { TreeView, TreeViewPane } from '../../../browser/parts/views/treeView.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ALL_SYNC_RESOURCES, IUserDataSyncService, ISyncResourceHandle as IResourceHandle, SyncStatus, IUserDataSyncEnablementService, IUserDataAutoSyncService, UserDataSyncError, UserDataSyncErrorCode, getLastSyncResourceUri, SyncResource, ISyncUserDataProfile, IUserDataSyncResourceProviderService } from '../../../../platform/userDataSync/common/userDataSync.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { URI, UriDto } from '../../../../base/common/uri.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { FolderThemeIcon } from '../../../../platform/theme/common/themeService.js';
import { fromNow } from '../../../../base/common/date.js';
import { IDialogService, IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { Event } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { toAction } from '../../../../base/common/actions.js';
import { IUserDataSyncWorkbenchService, CONTEXT_SYNC_STATE, getSyncAreaLabel, CONTEXT_ACCOUNT_STATE, AccountStatus, CONTEXT_ENABLE_ACTIVITY_VIEWS, SYNC_TITLE, SYNC_CONFLICTS_VIEW_ID, CONTEXT_ENABLE_SYNC_CONFLICTS_VIEW, CONTEXT_HAS_CONFLICTS } from '../../../services/userDataSync/common/userDataSync.js';
import { IUserDataSyncMachinesService, IUserDataSyncMachine, isWebPlatform } from '../../../../platform/userDataSync/common/userDataSyncMachines.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { basename } from '../../../../base/common/resources.js';
import { API_OPEN_DIFF_EDITOR_COMMAND_ID, API_OPEN_EDITOR_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ICommandService } from '../../../../platform/commands/common/commands.js';
import { IUserDataProfile, IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { UserDataSyncConflictsViewPane } from './userDataSyncConflictsView.js';

export class UserDataSyncDataViews extends Disposable {

	constructor(
		container: ViewContainer,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IUserDataSyncEnablementService private readonly userDataSyncEnablementService: IUserDataSyncEnablementService,
		@IUserDataSyncMachinesService private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
		@IUserDataSyncService private readonly userDataSyncService: IUserDataSyncService,
	) {
		super();
		this.registerViews(container);
	}

	private registerViews(container: ViewContainer): void {
		this.registerConflictsView(container);

		this.registerActivityView(container, true);
		this.registerMachinesView(container);

		this.registerActivityView(container, false);
		this.registerTroubleShootView(container);
		this.registerExternalActivityView(container);
	}

	private registerConflictsView(container: ViewContainer): void {
		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		const viewName = localize2('conflicts', "Conflicts");
		const viewDescriptor: ITreeViewDescriptor = {
			id: SYNC_CONFLICTS_VIEW_ID,
			name: viewName,
			ctorDescriptor: new SyncDescriptor(UserDataSyncConflictsViewPane),
			when: ContextKeyExpr.and(CONTEXT_ENABLE_SYNC_CONFLICTS_VIEW, CONTEXT_HAS_CONFLICTS),
			canToggleVisibility: false,
			canMoveView: false,
			treeView: this.instantiationService.createInstance(TreeView, SYNC_CONFLICTS_VIEW_ID, viewName.value),
			collapsed: false,
			order: 100,
		};
		viewsRegistry.registerViews([viewDescriptor], container);
	}

	private registerMachinesView(container: ViewContainer): void {
		const id = `workbench.views.sync.machines`;
		const name = localize2('synced machines', "Synced Machines");
		const treeView = this.instantiationService.createInstance(TreeView, id, name.value);
		const dataProvider = this.instantiationService.createInstance(UserDataSyncMachinesViewDataProvider, treeView);
		treeView.showRefreshAction = true;
		treeView.canSelectMany = true;
		treeView.dataProvider = dataProvider;

		this._register(Event.any(this.userDataSyncMachinesService.onDidChange, this.userDataSyncService.onDidResetRemote)(() => treeView.refresh()));
		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		const viewDescriptor: ITreeViewDescriptor = {
			id,
			name,
			ctorDescriptor: new SyncDescriptor(TreeViewPane),
			when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Available), CONTEXT_ENABLE_ACTIVITY_VIEWS),
			canToggleVisibility: true,
			canMoveView: false,
			treeView,
			collapsed: false,
			order: 300,
		};
		viewsRegistry.registerViews([viewDescriptor], container);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.editMachineName`,
					title: localize('workbench.actions.sync.editMachineName', "Edit Name"),
					icon: Codicon.edit,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', id)),
						group: 'inline',
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const changed = await dataProvider.rename(handle.$treeItemHandle);
				if (changed) {
					await treeView.refresh();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.turnOffSyncOnMachine`,
					title: localize('workbench.actions.sync.turnOffSyncOnMachine', "Turn off Settings Sync"),
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', id), ContextKeyExpr.equals('viewItem', 'sync-machine')),
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg, selected?: TreeViewItemHandleArg[]): Promise<void> {
				if (await dataProvider.disable((selected || [handle]).map(handle => handle.$treeItemHandle))) {
					await treeView.refresh();
				}
			}
		}));

	}

	private registerActivityView(container: ViewContainer, remote: boolean): void {
		const id = `workbench.views.sync.${remote ? 'remote' : 'local'}Activity`;
		const name = remote ? localize2('remote sync activity title', "Sync Activity (Remote)") : localize2('local sync activity title', "Sync Activity (Local)");
		const treeView = this.instantiationService.createInstance(TreeView, id, name.value);
		treeView.showCollapseAllAction = true;
		treeView.showRefreshAction = true;
		treeView.dataProvider = remote ? this.instantiationService.createInstance(RemoteUserDataSyncActivityViewDataProvider)
			: this.instantiationService.createInstance(LocalUserDataSyncActivityViewDataProvider);

		this._register(Event.any(this.userDataSyncEnablementService.onDidChangeResourceEnablement,
			this.userDataSyncEnablementService.onDidChangeEnablement,
			this.userDataSyncService.onDidResetLocal,
			this.userDataSyncService.onDidResetRemote)(() => treeView.refresh()));
		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		const viewDescriptor: ITreeViewDescriptor = {
			id,
			name,
			ctorDescriptor: new SyncDescriptor(TreeViewPane),
			when: ContextKeyExpr.and(CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized), CONTEXT_ACCOUNT_STATE.isEqualTo(AccountStatus.Available), CONTEXT_ENABLE_ACTIVITY_VIEWS),
			canToggleVisibility: true,
			canMoveView: false,
			treeView,
			collapsed: false,
			order: remote ? 200 : 400,
			hideByDefault: !remote,
		};
		viewsRegistry.registerViews([viewDescriptor], container);

		this.registerDataViewActions(id);
	}

	private registerExternalActivityView(container: ViewContainer): void {
		const id = `workbench.views.sync.externalActivity`;
		const name = localize2('downloaded sync activity title', "Sync Activity (Developer)");
		const dataProvider = this.instantiationService.createInstance(ExtractedUserDataSyncActivityViewDataProvider, undefined);
		const treeView = this.instantiationService.createInstance(TreeView, id, name.value);
		treeView.showCollapseAllAction = false;
		treeView.showRefreshAction = false;
		treeView.dataProvider = dataProvider;

		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		const viewDescriptor: ITreeViewDescriptor = {
			id,
			name,
			ctorDescriptor: new SyncDescriptor(TreeViewPane),
			when: CONTEXT_ENABLE_ACTIVITY_VIEWS,
			canToggleVisibility: true,
			canMoveView: false,
			treeView,
			collapsed: false,
			hideByDefault: false,
		};
		viewsRegistry.registerViews([viewDescriptor], container);

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.loadActivity`,
					title: localize('workbench.actions.sync.loadActivity', "Load Sync Activity"),
					icon: Codicon.cloudUpload,
					menu: {
						id: MenuId.ViewTitle,
						when: ContextKeyExpr.equals('view', id),
						group: 'navigation',
					},
				});
			}
			async run(accessor: ServicesAccessor): Promise<void> {
				const fileDialogService = accessor.get(IFileDialogService);
				const result = await fileDialogService.showOpenDialog({
					title: localize('select sync activity file', "Select Sync Activity File or Folder"),
					canSelectFiles: true,
					canSelectFolders: true,
					canSelectMany: false,
				});
				if (!result?.[0]) {
					return;
				}
				dataProvider.activityDataResource = result[0];
				await treeView.refresh();
			}
		}));
	}

	private registerDataViewActions(viewId: string) {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.${viewId}.resolveResource`,
					title: localize('workbench.actions.sync.resolveResourceRef', "Show raw JSON sync data"),
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.regex('viewItem', /sync-resource-.*/i))
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const { resource } = <{ resource: string }>JSON.parse(handle.$treeItemHandle);
				const editorService = accessor.get(IEditorService);
				await editorService.openEditor({ resource: URI.parse(resource), options: { pinned: true } });
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.${viewId}.compareWithLocal`,
					title: localize('workbench.actions.sync.compareWithLocal', "Compare with Local"),
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.regex('viewItem', /sync-associatedResource-.*/i))
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const commandService = accessor.get(ICommandService);
				const { resource, comparableResource } = <{ resource: string; comparableResource: string }>JSON.parse(handle.$treeItemHandle);
				const remoteResource = URI.parse(resource);
				const localResource = URI.parse(comparableResource);
				return commandService.executeCommand(API_OPEN_DIFF_EDITOR_COMMAND_ID,
					remoteResource,
					localResource,
					localize('remoteToLocalDiff', "{0} ↔ {1}", localize({ key: 'leftResourceName', comment: ['remote as in file in cloud'] }, "{0} (Remote)", basename(remoteResource)), localize({ key: 'rightResourceName', comment: ['local as in file in disk'] }, "{0} (Local)", basename(localResource))),
					undefined
				);
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: `workbench.actions.sync.${viewId}.replaceCurrent`,
					title: localize('workbench.actions.sync.replaceCurrent', "Restore"),
					icon: Codicon.discard,
					menu: {
						id: MenuId.ViewItemContext,
						when: ContextKeyExpr.and(ContextKeyExpr.equals('view', viewId), ContextKeyExpr.regex('viewItem', /sync-resource-.*/i), ContextKeyExpr.notEquals('viewItem', `sync-resource-${SyncResource.Profiles}`)),
						group: 'inline',
					},
				});
			}
			async run(accessor: ServicesAccessor, handle: TreeViewItemHandleArg): Promise<void> {
				const dialogService = accessor.get(IDialogService);
				const userDataSyncService = accessor.get(IUserDataSyncService);
				const { syncResourceHandle, syncResource } = <{ syncResourceHandle: UriDto<ISyncResourceHandle>; syncResource: SyncResource }>JSON.parse(handle.$treeItemHandle);
				const result = await dialogService.confirm({
					message: localize({ key: 'confirm replace', comment: ['A confirmation message to replace current user data (settings, extensions, keybindings, snippets) with selected version'] }, "Would you like to replace your current {0} with selected?", getSyncAreaLabel(syncResource)),
					type: 'info',
					title: SYNC_TITLE.value
				});
				if (result.confirmed) {
					return userDataSyncService.replace({ created: syncResourceHandle.created, uri: URI.revive(syncResourceHandle.uri) });
				}
			}
		}));

	}

	private registerTroubleShootView(container: ViewContainer): void {
		const id = `workbench.views.sync.troubleshoot`;
		const name = localize2('troubleshoot', "Troubleshoot");
		const treeView = this.instantiationService.createInstance(TreeView, id, name.value);
		const dataProvider = this.instantiationService.createInstance(UserDataSyncTroubleshootViewDataProvider);
		treeView.showRefreshAction = true;
		treeView.dataProvider = dataProvider;

		const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
		const viewDescriptor: ITreeViewDescriptor = {
			id,
			name,
			ctorDescriptor: new SyncDescriptor(TreeViewPane),
			when: CONTEXT_ENABLE_ACTIVITY_VIEWS,
			canToggleVisibility: true,
			canMoveView: false,
			treeView,
			collapsed: false,
			order: 500,
			hideByDefault: true
		};
		viewsRegistry.registerViews([viewDescriptor], container);

	}

}

type Profile = IUserDataProfile | ISyncUserDataProfile;

interface ISyncResourceHandle extends IResourceHandle {
	profileId?: string;
	syncResource: SyncResource;
	previous?: IResourceHandle;
}

interface SyncResourceHandleTreeItem extends ITreeItem {
	syncResourceHandle: ISyncResourceHandle;
}

interface ProfileTreeItem extends ITreeItem {
	profile: Profile;
}

abstract class UserDataSyncActivityViewDataProvider<T = Profile> implements ITreeViewDataProvider {

	private readonly syncResourceHandlesByProfile = new Map<string, Promise<SyncResourceHandleTreeItem[]>>();

	constructor(
		@IUserDataSyncService protected readonly userDataSyncService: IUserDataSyncService,
		@IUserDataSyncResourceProviderService protected readonly userDataSyncResourceProviderService: IUserDataSyncResourceProviderService,
		@IUserDataAutoSyncService protected readonly userDataAutoSyncService: IUserDataAutoSyncService,
		@IUserDataSyncWorkbenchService private readonly userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@INotificationService private readonly notificationService: INotificationService,
		@IUserDataProfilesService protected readonly userDataProfilesService: IUserDataProfilesService,
	) { }

	async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		try {
			if (!element) {
				return await this.getRoots();
			}
			if ((<ProfileTreeItem>element).profile || element.handle === this.userDataProfilesService.defaultProfile.id) {
				let promise = this.syncResourceHandlesByProfile.get(element.handle);
				if (!promise) {
					this.syncResourceHandlesByProfile.set(element.handle, promise = this.getSyncResourceHandles(<T>(<ProfileTreeItem>element).profile));
				}
				return await promise;
			}
			if ((<SyncResourceHandleTreeItem>element).syncResourceHandle) {
				return await this.getChildrenForSyncResourceTreeItem(<SyncResourceHandleTreeItem>element);
			}
			return [];
		} catch (error) {
			if (!(error instanceof UserDataSyncError)) {
				error = UserDataSyncError.toUserDataSyncError(error);
			}
			if (error instanceof UserDataSyncError && error.code === UserDataSyncErrorCode.IncompatibleRemoteContent) {
				this.notificationService.notify({
					severity: Severity.Error,
					message: error.message,
					actions: {
						primary: [
							toAction({
								id: 'reset',
								label: localize('reset', "Reset Synced Data"),
								run: () => this.userDataSyncWorkbenchService.resetSyncedData()
							}),
						]
					}
				});
			} else {
				this.notificationService.error(error);
			}
			throw error;
		}
	}

	private async getRoots(): Promise<ITreeItem[]> {
		this.syncResourceHandlesByProfile.clear();

		const roots: ITreeItem[] = [];

		const profiles = await this.getProfiles();
		if (profiles.length) {
			const profileTreeItem = {
				handle: this.userDataProfilesService.defaultProfile.id,
				label: { label: this.userDataProfilesService.defaultProfile.name },
				collapsibleState: TreeItemCollapsibleState.Expanded,
			};
			roots.push(profileTreeItem);
		} else {
			const defaultSyncResourceHandles = await this.getSyncResourceHandles();
			roots.push(...defaultSyncResourceHandles);
		}

		for (const profile of profiles) {
			const profileTreeItem: ProfileTreeItem = {
				handle: profile.id,
				label: { label: profile.name },
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				profile,
			};
			roots.push(profileTreeItem);
		}

		return roots;
	}

	protected async getChildrenForSyncResourceTreeItem(element: SyncResourceHandleTreeItem): Promise<ITreeItem[]> {
		const syncResourceHandle = (<SyncResourceHandleTreeItem>element).syncResourceHandle;
		const associatedResources = await this.userDataSyncResourceProviderService.getAssociatedResources(syncResourceHandle);
		const previousAssociatedResources = syncResourceHandle.previous ? await this.userDataSyncResourceProviderService.getAssociatedResources(syncResourceHandle.previous) : [];
		return associatedResources.map(({ resource, comparableResource }) => {
			const handle = JSON.stringify({ resource: resource.toString(), comparableResource: comparableResource.toString() });
			const previousResource = previousAssociatedResources.find(previous => basename(previous.resource) === basename(resource))?.resource;
			return {
				handle,
				collapsibleState: TreeItemCollapsibleState.None,
				resourceUri: resource,
				command: previousResource ? {
					id: API_OPEN_DIFF_EDITOR_COMMAND_ID,
					title: '',
					arguments: [
						previousResource,
						resource,
						localize('sideBySideLabels', "{0} ↔ {1}", `${basename(resource)} (${fromNow(syncResourceHandle.previous!.created, true)})`, `${basename(resource)} (${fromNow(syncResourceHandle.created, true)})`),
						undefined
					]
				} : {
					id: API_OPEN_EDITOR_COMMAND_ID,
					title: '',
					arguments: [resource, undefined, undefined]
				},
				contextValue: `sync-associatedResource-${syncResourceHandle.syncResource}`
			};
		});
	}

	private async getSyncResourceHandles(profile?: T): Promise<SyncResourceHandleTreeItem[]> {
		const treeItems: SyncResourceHandleTreeItem[] = [];
		const result = await Promise.all(ALL_SYNC_RESOURCES.map(async syncResource => {
			const resourceHandles = await this.getResourceHandles(syncResource, profile);
			return resourceHandles.map((resourceHandle, index) => ({ ...resourceHandle, syncResource, previous: resourceHandles[index + 1] }));
		}));
		const syncResourceHandles = result.flat().sort((a, b) => b.created - a.created);
		for (const syncResourceHandle of syncResourceHandles) {
			const handle = JSON.stringify({ syncResourceHandle, syncResource: syncResourceHandle.syncResource });
			treeItems.push({
				handle,
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				label: { label: getSyncAreaLabel(syncResourceHandle.syncResource) },
				description: fromNow(syncResourceHandle.created, true),
				tooltip: new Date(syncResourceHandle.created).toLocaleString(),
				themeIcon: FolderThemeIcon,
				syncResourceHandle,
				contextValue: `sync-resource-${syncResourceHandle.syncResource}`
			});
		}
		return treeItems;
	}

	protected abstract getProfiles(): Promise<Profile[]>;
	protected abstract getResourceHandles(syncResource: SyncResource, profile?: T): Promise<IResourceHandle[]>;
}

class LocalUserDataSyncActivityViewDataProvider extends UserDataSyncActivityViewDataProvider<ISyncUserDataProfile> {

	protected getResourceHandles(syncResource: SyncResource, profile: ISyncUserDataProfile | undefined): Promise<IResourceHandle[]> {
		return this.userDataSyncResourceProviderService.getLocalSyncResourceHandles(syncResource, profile);
	}

	protected async getProfiles(): Promise<ISyncUserDataProfile[]> {
		return this.userDataProfilesService.profiles
			.filter(p => !p.isDefault)
			.map(p => ({
				id: p.id,
				collection: p.id,
				name: p.name,
			}));
	}
}

class RemoteUserDataSyncActivityViewDataProvider extends UserDataSyncActivityViewDataProvider<ISyncUserDataProfile> {

	private machinesPromise: Promise<IUserDataSyncMachine[]> | undefined;

	constructor(
		@IUserDataSyncService userDataSyncService: IUserDataSyncService,
		@IUserDataSyncResourceProviderService userDataSyncResourceProviderService: IUserDataSyncResourceProviderService,
		@IUserDataAutoSyncService userDataAutoSyncService: IUserDataAutoSyncService,
		@IUserDataSyncMachinesService private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
		@IUserDataSyncWorkbenchService userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@INotificationService notificationService: INotificationService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
	) {
		super(userDataSyncService, userDataSyncResourceProviderService, userDataAutoSyncService, userDataSyncWorkbenchService, notificationService, userDataProfilesService);
	}

	override async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		if (!element) {
			this.machinesPromise = undefined;
		}
		return super.getChildren(element);
	}

	private getMachines(): Promise<IUserDataSyncMachine[]> {
		if (this.machinesPromise === undefined) {
			this.machinesPromise = this.userDataSyncMachinesService.getMachines();
		}
		return this.machinesPromise;
	}

	protected getResourceHandles(syncResource: SyncResource, profile?: ISyncUserDataProfile): Promise<IResourceHandle[]> {
		return this.userDataSyncResourceProviderService.getRemoteSyncResourceHandles(syncResource, profile);
	}

	protected getProfiles(): Promise<ISyncUserDataProfile[]> {
		return this.userDataSyncResourceProviderService.getRemoteSyncedProfiles();
	}

	protected override async getChildrenForSyncResourceTreeItem(element: SyncResourceHandleTreeItem): Promise<ITreeItem[]> {
		const children = await super.getChildrenForSyncResourceTreeItem(element);
		if (children.length) {
			const machineId = await this.userDataSyncResourceProviderService.getMachineId(element.syncResourceHandle);
			if (machineId) {
				const machines = await this.getMachines();
				const machine = machines.find(({ id }) => id === machineId);
				children[0].description = machine?.isCurrent ? localize({ key: 'current', comment: ['Represents current machine'] }, "Current") : machine?.name;
			}
		}
		return children;
	}
}

class ExtractedUserDataSyncActivityViewDataProvider extends UserDataSyncActivityViewDataProvider<ISyncUserDataProfile> {

	private machinesPromise: Promise<IUserDataSyncMachine[]> | undefined;

	private activityDataLocation: URI | undefined;

	constructor(
		public activityDataResource: URI | undefined,
		@IUserDataSyncService userDataSyncService: IUserDataSyncService,
		@IUserDataSyncResourceProviderService userDataSyncResourceProviderService: IUserDataSyncResourceProviderService,
		@IUserDataAutoSyncService userDataAutoSyncService: IUserDataAutoSyncService,
		@IUserDataSyncWorkbenchService userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@INotificationService notificationService: INotificationService,
		@IUserDataProfilesService userDataProfilesService: IUserDataProfilesService,
		@IFileService private readonly fileService: IFileService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
		super(userDataSyncService, userDataSyncResourceProviderService, userDataAutoSyncService, userDataSyncWorkbenchService, notificationService, userDataProfilesService);
	}

	override async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		if (!element) {
			this.machinesPromise = undefined;
			if (!this.activityDataResource) {
				return [];
			}
			const stat = await this.fileService.resolve(this.activityDataResource);
			if (stat.isDirectory) {
				this.activityDataLocation = this.activityDataResource;
			} else {
				this.activityDataLocation = this.uriIdentityService.extUri.joinPath(this.uriIdentityService.extUri.dirname(this.activityDataResource), 'remoteActivity');
				try { await this.fileService.del(this.activityDataLocation, { recursive: true }); } catch (e) {/* ignore */ }
				await this.userDataSyncService.extractActivityData(this.activityDataResource, this.activityDataLocation);
			}
		}
		return super.getChildren(element);
	}

	protected getResourceHandles(syncResource: SyncResource, profile: ISyncUserDataProfile | undefined): Promise<IResourceHandle[]> {
		return this.userDataSyncResourceProviderService.getLocalSyncResourceHandles(syncResource, profile, this.activityDataLocation);
	}

	protected override async getProfiles(): Promise<ISyncUserDataProfile[]> {
		return this.userDataSyncResourceProviderService.getLocalSyncedProfiles(this.activityDataLocation);
	}

	protected override async getChildrenForSyncResourceTreeItem(element: SyncResourceHandleTreeItem): Promise<ITreeItem[]> {
		const children = await super.getChildrenForSyncResourceTreeItem(element);
		if (children.length) {
			const machineId = await this.userDataSyncResourceProviderService.getMachineId(element.syncResourceHandle);
			if (machineId) {
				const machines = await this.getMachines();
				const machine = machines.find(({ id }) => id === machineId);
				children[0].description = machine?.isCurrent ? localize({ key: 'current', comment: ['Represents current machine'] }, "Current") : machine?.name;
			}
		}
		return children;
	}

	private getMachines(): Promise<IUserDataSyncMachine[]> {
		if (this.machinesPromise === undefined) {
			this.machinesPromise = this.userDataSyncResourceProviderService.getLocalSyncedMachines(this.activityDataLocation);
		}
		return this.machinesPromise;
	}
}

class UserDataSyncMachinesViewDataProvider implements ITreeViewDataProvider {

	private machinesPromise: Promise<IUserDataSyncMachine[]> | undefined;

	constructor(
		private readonly treeView: TreeView,
		@IUserDataSyncMachinesService private readonly userDataSyncMachinesService: IUserDataSyncMachinesService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@INotificationService private readonly notificationService: INotificationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IUserDataSyncWorkbenchService private readonly userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
	) {
	}

	async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		if (!element) {
			this.machinesPromise = undefined;
		}
		try {
			let machines = await this.getMachines();
			machines = machines.filter(m => !m.disabled).sort((m1, m2) => m1.isCurrent ? -1 : 1);
			this.treeView.message = machines.length ? undefined : localize('no machines', "No Machines");
			return machines.map(({ id, name, isCurrent, platform }) => ({
				handle: id,
				collapsibleState: TreeItemCollapsibleState.None,
				label: { label: name },
				description: isCurrent ? localize({ key: 'current', comment: ['Current machine'] }, "Current") : undefined,
				themeIcon: platform && isWebPlatform(platform) ? Codicon.globe : Codicon.vm,
				contextValue: 'sync-machine'
			}));
		} catch (error) {
			this.notificationService.error(error);
			return [];
		}
	}

	private getMachines(): Promise<IUserDataSyncMachine[]> {
		if (this.machinesPromise === undefined) {
			this.machinesPromise = this.userDataSyncMachinesService.getMachines();
		}
		return this.machinesPromise;
	}

	async disable(machineIds: string[]): Promise<boolean> {
		const machines = await this.getMachines();
		const machinesToDisable = machines.filter(({ id }) => machineIds.includes(id));
		if (!machinesToDisable.length) {
			throw new Error(localize('not found', "machine not found with id: {0}", machineIds.join(',')));
		}

		const result = await this.dialogService.confirm({
			type: 'info',
			message: machinesToDisable.length > 1 ? localize('turn off sync on multiple machines', "Are you sure you want to turn off sync on selected machines?")
				: localize('turn off sync on machine', "Are you sure you want to turn off sync on {0}?", machinesToDisable[0].name),
			primaryButton: localize({ key: 'turn off', comment: ['&& denotes a mnemonic'] }, "&&Turn off"),
		});

		if (!result.confirmed) {
			return false;
		}

		if (machinesToDisable.some(machine => machine.isCurrent)) {
			await this.userDataSyncWorkbenchService.turnoff(false);
		}

		const otherMachinesToDisable: [string, boolean][] = machinesToDisable.filter(machine => !machine.isCurrent)
			.map(machine => ([machine.id, false]));
		if (otherMachinesToDisable.length) {
			await this.userDataSyncMachinesService.setEnablements(otherMachinesToDisable);
		}

		return true;
	}

	async rename(machineId: string): Promise<boolean> {
		const disposableStore = new DisposableStore();
		const inputBox = disposableStore.add(this.quickInputService.createInputBox());
		inputBox.placeholder = localize('placeholder', "Enter the name of the machine");
		inputBox.busy = true;
		inputBox.show();
		const machines = await this.getMachines();
		const machine = machines.find(({ id }) => id === machineId);
		const enabledMachines = machines.filter(({ disabled }) => !disabled);
		if (!machine) {
			inputBox.hide();
			disposableStore.dispose();
			throw new Error(localize('not found', "machine not found with id: {0}", machineId));
		}
		inputBox.busy = false;
		inputBox.value = machine.name;
		const validateMachineName = (machineName: string): string | null => {
			machineName = machineName.trim();
			return machineName && !enabledMachines.some(m => m.id !== machineId && m.name === machineName) ? machineName : null;
		};
		disposableStore.add(inputBox.onDidChangeValue(() =>
			inputBox.validationMessage = validateMachineName(inputBox.value) ? '' : localize('valid message', "Machine name should be unique and not empty")));
		return new Promise<boolean>((c, e) => {
			disposableStore.add(inputBox.onDidAccept(async () => {
				const machineName = validateMachineName(inputBox.value);
				disposableStore.dispose();
				if (machineName && machineName !== machine.name) {
					try {
						await this.userDataSyncMachinesService.renameMachine(machineId, machineName);
						c(true);
					} catch (error) {
						e(error);
					}
				} else {
					c(false);
				}
			}));
		});
	}
}

class UserDataSyncTroubleshootViewDataProvider implements ITreeViewDataProvider {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IUserDataSyncWorkbenchService private readonly userDataSyncWorkbenchService: IUserDataSyncWorkbenchService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
	) {
	}

	async getChildren(element?: ITreeItem): Promise<ITreeItem[]> {
		if (!element) {
			return [{
				handle: 'SYNC_LOGS',
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				label: { label: localize('sync logs', "Logs") },
				themeIcon: Codicon.folder,
			}, {
				handle: 'LAST_SYNC_STATES',
				collapsibleState: TreeItemCollapsibleState.Collapsed,
				label: { label: localize('last sync states', "Last Synced Remotes") },
				themeIcon: Codicon.folder,
			}];
		}

		if (element.handle === 'LAST_SYNC_STATES') {
			return this.getLastSyncStates();
		}

		if (element.handle === 'SYNC_LOGS') {
			return this.getSyncLogs();
		}

		return [];
	}

	private async getLastSyncStates(): Promise<ITreeItem[]> {
		const result: ITreeItem[] = [];
		for (const syncResource of ALL_SYNC_RESOURCES) {
			const resource = getLastSyncResourceUri(undefined, syncResource, this.environmentService, this.uriIdentityService.extUri);
			if (await this.fileService.exists(resource)) {
				result.push({
					handle: resource.toString(),
					label: { label: getSyncAreaLabel(syncResource) },
					collapsibleState: TreeItemCollapsibleState.None,
					resourceUri: resource,
					command: { id: API_OPEN_EDITOR_COMMAND_ID, title: '', arguments: [resource, undefined, undefined] },
				});
			}
		}
		return result;
	}

	private async getSyncLogs(): Promise<ITreeItem[]> {
		const logResources = await this.userDataSyncWorkbenchService.getAllLogResources();
		const result: ITreeItem[] = [];
		for (const syncLogResource of logResources) {
			const logFolder = this.uriIdentityService.extUri.dirname(syncLogResource);
			result.push({
				handle: syncLogResource.toString(),
				collapsibleState: TreeItemCollapsibleState.None,
				resourceUri: syncLogResource,
				label: { label: this.uriIdentityService.extUri.basename(logFolder) },
				description: this.uriIdentityService.extUri.isEqual(logFolder, this.environmentService.logsHome) ? localize({ key: 'current', comment: ['Represents current log file'] }, "Current") : undefined,
				command: { id: API_OPEN_EDITOR_COMMAND_ID, title: '', arguments: [syncLogResource, undefined, undefined] },
			});
		}
		return result;
	}

}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/userDataSync/electron-browser/userDataSync.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/userDataSync/electron-browser/userDataSync.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { IUserDataSyncUtilService, SyncStatus } from '../../../../platform/userDataSync/common/userDataSync.js';
import { ISharedProcessService } from '../../../../platform/ipc/electron-browser/services.js';
import { registerAction2, Action2, MenuId } from '../../../../platform/actions/common/actions.js';
import { localize, localize2 } from '../../../../nls.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { INativeHostService } from '../../../../platform/native/common/native.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { CONTEXT_SYNC_STATE, DOWNLOAD_ACTIVITY_ACTION_DESCRIPTOR, IUserDataSyncWorkbenchService, SYNC_TITLE } from '../../../services/userDataSync/common/userDataSync.js';
import { Schemas } from '../../../../base/common/network.js';
import { ProxyChannel } from '../../../../base/parts/ipc/common/ipc.js';
import { Disposable } from '../../../../base/common/lifecycle.js';

class UserDataSyncServicesContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.userDataSyncServices';

	constructor(
		@IUserDataSyncUtilService userDataSyncUtilService: IUserDataSyncUtilService,
		@ISharedProcessService sharedProcessService: ISharedProcessService,
	) {
		super();
		sharedProcessService.registerChannel('userDataSyncUtil', ProxyChannel.fromService(userDataSyncUtilService, this._store));
	}
}

registerWorkbenchContribution2(UserDataSyncServicesContribution.ID, UserDataSyncServicesContribution, WorkbenchPhase.BlockStartup);

registerAction2(class OpenSyncBackupsFolder extends Action2 {
	constructor() {
		super({
			id: 'workbench.userData.actions.openSyncBackupsFolder',
			title: localize2('Open Backup folder', "Open Local Backups Folder"),
			category: SYNC_TITLE,
			menu: {
				id: MenuId.CommandPalette,
				when: CONTEXT_SYNC_STATE.notEqualsTo(SyncStatus.Uninitialized),
			}
		});
	}
	async run(accessor: ServicesAccessor): Promise<void> {
		const syncHome = accessor.get(IEnvironmentService).userDataSyncHome;
		const nativeHostService = accessor.get(INativeHostService);
		const fileService = accessor.get(IFileService);
		const notificationService = accessor.get(INotificationService);
		if (await fileService.exists(syncHome)) {
			const folderStat = await fileService.resolve(syncHome);
			const item = folderStat.children && folderStat.children[0] ? folderStat.children[0].resource : syncHome;
			return nativeHostService.showItemInFolder(item.with({ scheme: Schemas.file }).fsPath);
		} else {
			notificationService.info(localize('no backups', "Local backups folder does not exist"));
		}
	}
});

registerAction2(class DownloadSyncActivityAction extends Action2 {
	constructor() {
		super(DOWNLOAD_ACTIVITY_ACTION_DESCRIPTOR);
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		const userDataSyncWorkbenchService = accessor.get(IUserDataSyncWorkbenchService);
		const notificationService = accessor.get(INotificationService);
		const hostService = accessor.get(INativeHostService);
		const folder = await userDataSyncWorkbenchService.downloadSyncActivity();
		if (folder) {
			notificationService.prompt(Severity.Info, localize('download sync activity complete', "Successfully downloaded Settings Sync activity."),
				[{
					label: localize('open', "Open Folder"),
					run: () => hostService.showItemInFolder(folder.fsPath)
				}]);
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/overlayWebview.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/overlayWebview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension, getWindowById } from '../../../../base/browser/dom.js';
import { FastDomNode } from '../../../../base/browser/fastDomNode.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { autorun, observableValue } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IContextKey, IContextKeyService, IScopedContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { IOverlayWebview, IWebview, IWebviewElement, IWebviewService, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_ENABLED, KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE, WebviewContentOptions, WebviewExtensionDescription, WebviewInitInfo, WebviewMessageReceivedEvent, WebviewOptions } from './webview.js';

/**
 * Webview that is absolutely positioned over another element and that can creates and destroys an underlying webview as needed.
 */
export class OverlayWebview extends Disposable implements IOverlayWebview {

	private _isFirstLoad = true;
	private readonly _firstLoadPendingMessages = new Set<{ readonly message: any; readonly transfer?: readonly ArrayBuffer[]; readonly resolve: (value: boolean) => void }>();
	private readonly _webview = this._register(new MutableDisposable<IWebviewElement>());
	private readonly _webviewEvents = this._register(new DisposableStore());

	private _html = '';
	private _title: string | undefined;
	private _initialScrollProgress: number = 0;
	private _state: string | undefined = undefined;

	private _extension: WebviewExtensionDescription | undefined;
	private _contentOptions: WebviewContentOptions;
	private _options: WebviewOptions;

	private _owner: any = undefined;

	private _windowId: number | undefined = undefined;
	private get window() { return getWindowById(this._windowId, true).window; }

	private readonly _scopedContextKeyService = this._register(new MutableDisposable<IScopedContextKeyService>());
	private _findWidgetVisible: IContextKey<boolean> | undefined;
	private _findWidgetEnabled: IContextKey<boolean> | undefined;
	private _shouldShowFindWidgetOnRestore = false;

	public readonly providedViewType?: string;

	public origin: string;

	private _container: FastDomNode<HTMLDivElement> | undefined;

	public constructor(
		initInfo: WebviewInitInfo,
		@IWorkbenchLayoutService private readonly _layoutService: IWorkbenchLayoutService,
		@IWebviewService private readonly _webviewService: IWebviewService,
		@IContextKeyService private readonly _baseContextKeyService: IContextKeyService
	) {
		super();

		this.providedViewType = initInfo.providedViewType;
		this.origin = initInfo.origin ?? generateUuid();

		this._title = initInfo.title;
		this._extension = initInfo.extension;
		this._options = initInfo.options;
		this._contentOptions = initInfo.contentOptions;
	}

	public get isFocused() {
		return !!this._webview.value?.isFocused;
	}

	private _isDisposed = false;

	private readonly _onDidDispose = this._register(new Emitter<void>());
	public readonly onDidDispose = this._onDidDispose.event;

	override dispose() {
		this._isDisposed = true;

		this._container?.domNode.remove();
		this._container = undefined;

		for (const msg of this._firstLoadPendingMessages) {
			msg.resolve(false);
		}
		this._firstLoadPendingMessages.clear();

		this._onDidDispose.fire();

		super.dispose();
	}

	public get container(): HTMLElement {
		if (this._isDisposed) {
			throw new Error(`OverlayWebview has been disposed`);
		}

		if (!this._container) {
			const node = document.createElement('div');
			node.style.position = 'absolute';
			node.style.overflow = 'hidden';
			this._container = new FastDomNode(node);
			this._container.setVisibility('hidden');

			// Webviews cannot be reparented in the dom as it will destroy their contents.
			// Mount them to a high level node to avoid this.
			this._layoutService.getContainer(this.window).appendChild(node);
		}

		return this._container.domNode;
	}

	public claim(owner: any, targetWindow: CodeWindow, scopedContextKeyService: IContextKeyService | undefined) {
		if (this._isDisposed) {
			return;
		}

		const oldOwner = this._owner;

		if (this._windowId !== targetWindow.vscodeWindowId) {
			// moving to a new window
			this.release(oldOwner);
			// since we are moving to a new window, we need to dispose the webview and recreate
			this._webview.clear();
			this._webviewEvents.clear();
			this._container?.domNode.remove();
			this._container = undefined;
		}

		this._owner = owner;
		this._windowId = targetWindow.vscodeWindowId;
		this._show(targetWindow);

		if (oldOwner !== owner) {
			const contextKeyService = (scopedContextKeyService || this._baseContextKeyService);

			// Explicitly clear before creating the new context.
			// Otherwise we create the new context while the old one is still around
			this._scopedContextKeyService.clear();
			this._scopedContextKeyService.value = contextKeyService.createScoped(this.container);

			const wasFindVisible = this._findWidgetVisible?.get();
			this._findWidgetVisible?.reset();
			this._findWidgetVisible = KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE.bindTo(contextKeyService);
			this._findWidgetVisible.set(!!wasFindVisible);

			this._findWidgetEnabled?.reset();
			this._findWidgetEnabled = KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_ENABLED.bindTo(contextKeyService);
			this._findWidgetEnabled.set(!!this.options.enableFindWidget);

			this._webview.value?.setContextKeyService(this._scopedContextKeyService.value);
		}
	}

	public release(owner: any) {
		if (this._owner !== owner) {
			return;
		}

		this._scopedContextKeyService.clear();

		this._owner = undefined;
		if (this._container) {
			this._container.setVisibility('hidden');
		}

		if (this._options.retainContextWhenHidden) {
			// https://github.com/microsoft/vscode/issues/157424
			// We need to record the current state when retaining context so we can try to showFind() when showing webview again
			this._shouldShowFindWidgetOnRestore = !!this._findWidgetVisible?.get();
			this.hideFind(false);
		} else {
			this._webview.clear();
			this._webviewEvents.clear();
		}
	}

	public layoutWebviewOverElement(element: HTMLElement, dimension?: Dimension, clippingContainer?: HTMLElement) {
		if (!this._container || !this._container.domNode.parentElement) {
			return;
		}

		const whenContainerStylesLoaded = this._layoutService.whenContainerStylesLoaded(this.window);
		if (whenContainerStylesLoaded) {
			// In floating windows, we need to ensure that the
			// container is ready for us to compute certain
			// layout related properties.
			whenContainerStylesLoaded.then(() => this.doLayoutWebviewOverElement(element, dimension, clippingContainer));
		} else {
			this.doLayoutWebviewOverElement(element, dimension, clippingContainer);
		}
	}

	private doLayoutWebviewOverElement(element: HTMLElement, dimension?: Dimension, clippingContainer?: HTMLElement) {
		if (!this._container || !this._container.domNode.parentElement) {
			return;
		}

		const frameRect = element.getBoundingClientRect();
		const containerRect = this._container.domNode.parentElement.getBoundingClientRect();
		const parentBorderTop = (containerRect.height - this._container.domNode.parentElement.clientHeight) / 2.0;
		const parentBorderLeft = (containerRect.width - this._container.domNode.parentElement.clientWidth) / 2.0;

		this._container.setTop(frameRect.top - containerRect.top - parentBorderTop);
		this._container.setLeft(frameRect.left - containerRect.left - parentBorderLeft);
		this._container.setWidth(dimension ? dimension.width : frameRect.width);
		this._container.setHeight(dimension ? dimension.height : frameRect.height);

		if (clippingContainer) {
			const { top, left, right, bottom } = computeClippingRect(frameRect, clippingContainer);
			this._container.domNode.style.clipPath = `polygon(${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px)`;
		}
	}

	private _show(targetWindow: CodeWindow) {
		if (this._isDisposed) {
			throw new Error('OverlayWebview is disposed');
		}

		if (!this._webview.value) {
			const webview = this._webviewService.createWebviewElement({
				providedViewType: this.providedViewType,
				origin: this.origin,
				title: this._title,
				options: this._options,
				contentOptions: this._contentOptions,
				extension: this.extension,
			});
			this._webview.value = webview;
			webview.state = this._state;

			if (this._scopedContextKeyService.value) {
				this._webview.value.setContextKeyService(this._scopedContextKeyService.value);
			}

			if (this._html) {
				webview.setHtml(this._html);
			}

			if (this._options.tryRestoreScrollPosition) {
				webview.initialScrollProgress = this._initialScrollProgress;
			}

			this._findWidgetEnabled?.set(!!this.options.enableFindWidget);

			webview.mountTo(this.container, targetWindow);

			// Forward events from inner webview to outer listeners
			this._webviewEvents.clear();
			this._webviewEvents.add(webview.onDidFocus(() => { this._onDidFocus.fire(); }));
			this._webviewEvents.add(webview.onDidBlur(() => { this._onDidBlur.fire(); }));
			this._webviewEvents.add(webview.onDidClickLink(x => { this._onDidClickLink.fire(x); }));
			this._webviewEvents.add(webview.onMessage(x => { this._onMessage.fire(x); }));
			this._webviewEvents.add(webview.onMissingCsp(x => { this._onMissingCsp.fire(x); }));
			this._webviewEvents.add(webview.onDidWheel(x => { this._onDidWheel.fire(x); }));
			this._webviewEvents.add(webview.onFatalError(x => { this._onFatalError.fire(x); }));
			this._webviewEvents.add(autorun(reader => {
				this.intrinsicContentSize.set(reader.readObservable(webview.intrinsicContentSize), undefined, undefined);
			}));

			this._webviewEvents.add(webview.onDidScroll(x => {
				this._initialScrollProgress = x.scrollYPercentage;
				this._onDidScroll.fire(x);
			}));

			this._webviewEvents.add(webview.onDidUpdateState(state => {
				this._state = state;
				this._onDidUpdateState.fire(state);
			}));

			if (this._isFirstLoad) {
				this._firstLoadPendingMessages.forEach(async msg => {
					msg.resolve(await webview.postMessage(msg.message, msg.transfer));
				});
			}
			this._isFirstLoad = false;
			this._firstLoadPendingMessages.clear();
		}

		// https://github.com/microsoft/vscode/issues/157424
		if (this.options.retainContextWhenHidden && this._shouldShowFindWidgetOnRestore) {
			this.showFind(false);
			// Reset
			this._shouldShowFindWidgetOnRestore = false;
		}

		this._container?.setVisibility('visible');
	}

	public setHtml(html: string) {
		this._html = html;
		this._withWebview(webview => webview.setHtml(html));
	}

	public setTitle(title: string) {
		this._title = title;
		this._withWebview(webview => webview.setTitle(title));
	}

	public get initialScrollProgress(): number { return this._initialScrollProgress; }
	public set initialScrollProgress(value: number) {
		this._initialScrollProgress = value;
		this._withWebview(webview => webview.initialScrollProgress = value);
	}

	public get state(): string | undefined { return this._state; }
	public set state(value: string | undefined) {
		this._state = value;
		this._withWebview(webview => webview.state = value);
	}

	public get extension(): WebviewExtensionDescription | undefined { return this._extension; }
	public set extension(value: WebviewExtensionDescription | undefined) {
		this._extension = value;
		this._withWebview(webview => webview.extension = value);
	}

	public get options(): WebviewOptions { return this._options; }
	public set options(value: WebviewOptions) { this._options = { customClasses: this._options.customClasses, ...value }; }

	public get contentOptions(): WebviewContentOptions { return this._contentOptions; }
	public set contentOptions(value: WebviewContentOptions) {
		this._contentOptions = value;
		this._withWebview(webview => webview.contentOptions = value);
	}

	public set localResourcesRoot(resources: URI[]) {
		this._withWebview(webview => webview.localResourcesRoot = resources);
	}

	private readonly _onDidFocus = this._register(new Emitter<void>());
	public readonly onDidFocus = this._onDidFocus.event;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	public readonly onDidBlur = this._onDidBlur.event;

	private readonly _onDidClickLink = this._register(new Emitter<string>());
	public readonly onDidClickLink = this._onDidClickLink.event;

	private readonly _onDidScroll = this._register(new Emitter<{ readonly scrollYPercentage: number }>());
	public readonly onDidScroll = this._onDidScroll.event;

	private readonly _onDidUpdateState = this._register(new Emitter<string | undefined>());
	public readonly onDidUpdateState = this._onDidUpdateState.event;

	private readonly _onMessage = this._register(new Emitter<WebviewMessageReceivedEvent>());
	public readonly onMessage = this._onMessage.event;

	private readonly _onMissingCsp = this._register(new Emitter<ExtensionIdentifier>());
	public readonly onMissingCsp = this._onMissingCsp.event;

	private readonly _onDidWheel = this._register(new Emitter<IMouseWheelEvent>());
	public readonly onDidWheel = this._onDidWheel.event;

	private readonly _onFatalError = this._register(new Emitter<{ readonly message: string }>());
	public onFatalError = this._onFatalError.event;

	public readonly intrinsicContentSize = observableValue<{ readonly width: number; readonly height: number } | undefined>('WebviewIntrinsicContentSize', undefined);

	public async postMessage(message: any, transfer?: readonly ArrayBuffer[]): Promise<boolean> {
		if (this._webview.value) {
			return this._webview.value.postMessage(message, transfer);
		}

		if (this._isFirstLoad) {
			let resolve: (x: boolean) => void;
			const p = new Promise<boolean>(r => resolve = r);
			this._firstLoadPendingMessages.add({ message, transfer, resolve: resolve! });
			return p;
		}

		return false;
	}

	focus(): void { this._webview.value?.focus(); }
	reload(): void { this._webview.value?.reload(); }
	selectAll(): void { this._webview.value?.selectAll(); }
	copy(): void { this._webview.value?.copy(); }
	paste(): void { this._webview.value?.paste(); }
	cut(): void { this._webview.value?.cut(); }
	undo(): void { this._webview.value?.undo(); }
	redo(): void { this._webview.value?.redo(); }

	showFind(animated = true) {
		if (this._webview.value) {
			this._webview.value.showFind(animated);
			this._findWidgetVisible?.set(true);
		}
	}

	hideFind(animated = true) {
		this._findWidgetVisible?.reset();
		this._webview.value?.hideFind(animated);
	}

	runFindAction(previous: boolean): void { this._webview.value?.runFindAction(previous); }

	private _withWebview(f: (webview: IWebview) => void): void {
		if (this._webview.value) {
			f(this._webview.value);
		}
	}

	windowDidDragStart() {
		this._webview.value?.windowDidDragStart();
	}

	windowDidDragEnd() {
		this._webview.value?.windowDidDragEnd();
	}

	setContextKeyService(contextKeyService: IContextKeyService) {
		this._webview.value?.setContextKeyService(contextKeyService);
	}
}

function computeClippingRect(frameRect: DOMRectReadOnly, clipper: HTMLElement) {
	const rootRect = clipper.getBoundingClientRect();

	const top = Math.max(rootRect.top - frameRect.top, 0);
	const right = Math.max(frameRect.width - (frameRect.right - rootRect.right), 0);
	const bottom = Math.max(frameRect.height - (frameRect.bottom - rootRect.bottom), 0);
	const left = Math.max(rootRect.left - frameRect.left, 0);

	return { top, right, bottom, left };
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/resourceLoading.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/resourceLoading.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { isUNC } from '../../../../base/common/extpath.js';
import { Schemas } from '../../../../base/common/network.js';
import { normalize, sep } from '../../../../base/common/path.js';
import { URI } from '../../../../base/common/uri.js';
import { FileOperationError, FileOperationResult, IFileService, IWriteFileOptions } from '../../../../platform/files/common/files.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { getWebviewContentMimeType } from '../../../../platform/webview/common/mimeTypes.js';

export namespace WebviewResourceResponse {
	export enum Type { Success, Failed, AccessDenied, NotModified }

	export class StreamSuccess {
		readonly type = Type.Success;

		constructor(
			public readonly stream: VSBufferReadableStream,
			public readonly etag: string | undefined,
			public readonly mtime: number | undefined,
			public readonly mimeType: string,
		) { }
	}

	export const Failed = { type: Type.Failed } as const;
	export const AccessDenied = { type: Type.AccessDenied } as const;

	export class NotModified {
		readonly type = Type.NotModified;

		constructor(
			public readonly mimeType: string,
			public readonly mtime: number | undefined,
		) { }
	}

	export type StreamResponse = StreamSuccess | typeof Failed | typeof AccessDenied | NotModified;
}

export async function loadLocalResource(
	requestUri: URI,
	options: {
		ifNoneMatch: string | undefined;
		roots: ReadonlyArray<URI>;
	},
	fileService: IFileService,
	logService: ILogService,
	token: CancellationToken,
): Promise<WebviewResourceResponse.StreamResponse> {
	const resourceToLoad = getResourceToLoad(requestUri, options.roots);

	logService.trace(`Webview.loadLocalResource - trying to load resource. requestUri=${requestUri}, resourceToLoad=${resourceToLoad}`);

	if (!resourceToLoad) {
		logService.trace(`Webview.loadLocalResource - access denied. requestUri=${requestUri}, resourceToLoad=${resourceToLoad}`);
		return WebviewResourceResponse.AccessDenied;
	}

	const mime = getWebviewContentMimeType(requestUri); // Use the original path for the mime

	try {
		const result = await fileService.readFileStream(resourceToLoad, { etag: options.ifNoneMatch }, token);
		logService.trace(`Webview.loadLocalResource - Loaded. requestUri=${requestUri}, resourceToLoad=${resourceToLoad}`);
		return new WebviewResourceResponse.StreamSuccess(result.value, result.etag, result.mtime, mime);
	} catch (err) {
		if (err instanceof FileOperationError) {
			const result = err.fileOperationResult;

			// NotModified status is expected and can be handled gracefully
			if (result === FileOperationResult.FILE_NOT_MODIFIED_SINCE) {
				logService.trace(`Webview.loadLocalResource - not modified. requestUri=${requestUri}, resourceToLoad=${resourceToLoad}`);
				return new WebviewResourceResponse.NotModified(mime, (err.options as IWriteFileOptions | undefined)?.mtime);
			}
		}

		// Otherwise the error is unexpected.
		logService.error(`Webview.loadLocalResource - Error using fileReader. requestUri=${requestUri}, resourceToLoad=${resourceToLoad}`);
		return WebviewResourceResponse.Failed;
	}
}

function getResourceToLoad(
	requestUri: URI,
	roots: ReadonlyArray<URI>,
): URI | undefined {
	for (const root of roots) {
		if (containsResource(root, requestUri)) {
			return normalizeResourcePath(requestUri);
		}
	}

	return undefined;
}

function containsResource(root: URI, resource: URI): boolean {
	if (root.scheme !== resource.scheme) {
		return false;
	}

	let resourceFsPath = normalize(resource.fsPath);
	let rootPath = normalize(root.fsPath + (root.fsPath.endsWith(sep) ? '' : sep));

	if (isUNC(root.fsPath) && isUNC(resource.fsPath)) {
		rootPath = rootPath.toLowerCase();
		resourceFsPath = resourceFsPath.toLowerCase();
	}

	return resourceFsPath.startsWith(rootPath);
}

function normalizeResourcePath(resource: URI): URI {
	// Rewrite remote uris to a path that the remote file system can understand
	if (resource.scheme === Schemas.vscodeRemote) {
		return URI.from({
			scheme: Schemas.vscodeRemote,
			authority: resource.authority,
			path: '/vscode-resource',
			query: JSON.stringify({
				requestResourcePath: resource.path
			})
		});
	}
	return resource;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/themeing.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/themeing.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DEFAULT_FONT_FAMILY } from '../../../../base/browser/fonts.js';
import { Emitter } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IEditorOptions, EditorFontLigatures } from '../../../../editor/common/config/editorOptions.js';
import { EDITOR_FONT_DEFAULTS } from '../../../../editor/common/config/fontInfo.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import * as colorRegistry from '../../../../platform/theme/common/colorRegistry.js';
import { ColorScheme } from '../../../../platform/theme/common/theme.js';
import { IWorkbenchColorTheme, IWorkbenchThemeService } from '../../../services/themes/common/workbenchThemeService.js';
import { WebviewStyles } from './webview.js';

interface WebviewThemeData {
	readonly activeTheme: string;
	readonly themeLabel: string;
	readonly themeId: string;
	readonly styles: Readonly<WebviewStyles>;
}

export class WebviewThemeDataProvider extends Disposable {

	private _cachedWebViewThemeData: WebviewThemeData | undefined = undefined;

	private readonly _onThemeDataChanged = this._register(new Emitter<void>());
	public readonly onThemeDataChanged = this._onThemeDataChanged.event;

	constructor(
		@IWorkbenchThemeService private readonly _themeService: IWorkbenchThemeService,
		@IConfigurationService private readonly _configurationService: IConfigurationService,
	) {
		super();

		this._register(this._themeService.onDidColorThemeChange(() => {
			this._reset();
		}));

		const webviewConfigurationKeys = ['editor.fontFamily', 'editor.fontWeight', 'editor.fontSize', 'editor.fontLigatures', 'accessibility.underlineLinks'];
		this._register(this._configurationService.onDidChangeConfiguration(e => {
			if (webviewConfigurationKeys.some(key => e.affectsConfiguration(key))) {
				this._reset();
			}
		}));
	}

	public getTheme(): IWorkbenchColorTheme {
		return this._themeService.getColorTheme();
	}

	public getWebviewThemeData(): WebviewThemeData {
		if (!this._cachedWebViewThemeData) {
			const configuration = this._configurationService.getValue<IEditorOptions>('editor');
			const editorFontFamily = configuration.fontFamily || EDITOR_FONT_DEFAULTS.fontFamily;
			const editorFontWeight = configuration.fontWeight || EDITOR_FONT_DEFAULTS.fontWeight;
			const editorFontSize = configuration.fontSize || EDITOR_FONT_DEFAULTS.fontSize;
			const editorFontLigatures = new EditorFontLigatures().validate(configuration.fontLigatures);
			const linkUnderlines = this._configurationService.getValue('accessibility.underlineLinks');

			const theme = this._themeService.getColorTheme();
			const exportedColors = colorRegistry.getColorRegistry().getColors().reduce<Record<string, string>>((colors, entry) => {
				const color = theme.getColor(entry.id);
				if (color) {
					colors['vscode-' + entry.id.replace('.', '-')] = color.toString();
				}
				return colors;
			}, {});

			const styles = {
				'vscode-font-family': DEFAULT_FONT_FAMILY,
				'vscode-font-weight': 'normal',
				'vscode-font-size': '13px',
				'vscode-editor-font-family': editorFontFamily,
				'vscode-editor-font-weight': editorFontWeight,
				'vscode-editor-font-size': editorFontSize + 'px',
				'text-link-decoration': linkUnderlines ? 'underline' : 'none',
				...exportedColors,
				'vscode-editor-font-feature-settings': editorFontLigatures,
			};

			const activeTheme = ApiThemeClassName.fromTheme(theme);
			this._cachedWebViewThemeData = { styles, activeTheme, themeLabel: theme.label, themeId: theme.settingsId };
		}

		return this._cachedWebViewThemeData;
	}

	private _reset() {
		this._cachedWebViewThemeData = undefined;
		this._onThemeDataChanged.fire();
	}
}

enum ApiThemeClassName {
	light = 'vscode-light',
	dark = 'vscode-dark',
	highContrast = 'vscode-high-contrast',
	highContrastLight = 'vscode-high-contrast-light',
}

namespace ApiThemeClassName {
	export function fromTheme(theme: IWorkbenchColorTheme): ApiThemeClassName {
		switch (theme.type) {
			case ColorScheme.LIGHT: return ApiThemeClassName.light;
			case ColorScheme.DARK: return ApiThemeClassName.dark;
			case ColorScheme.HIGH_CONTRAST_DARK: return ApiThemeClassName.highContrast;
			case ColorScheme.HIGH_CONTRAST_LIGHT: return ApiThemeClassName.highContrastLight;
		}
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webview.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webview.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getActiveElement } from '../../../../base/browser/dom.js';
import { MultiCommand, RedoCommand, SelectAllCommand, UndoCommand } from '../../../../editor/browser/editorExtensions.js';
import { CopyAction, CutAction, PasteAction } from '../../../../editor/contrib/clipboard/browser/clipboard.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IWebviewService, IWebview } from './webview.js';
import { WebviewInput } from '../../webviewPanel/browser/webviewEditorInput.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';


const PRIORITY = 100;

function overrideCommandForWebview(command: MultiCommand | undefined, f: (webview: IWebview) => void) {
	command?.addImplementation(PRIORITY, 'webview', accessor => {
		const webviewService = accessor.get(IWebviewService);
		const webview = webviewService.activeWebview;
		if (webview?.isFocused) {
			f(webview);
			return true;
		}

		// When focused in a custom menu try to fallback to the active webview
		// This is needed for context menu actions and the menubar
		if (getActiveElement()?.classList.contains('action-menu-item')) {
			const editorService = accessor.get(IEditorService);
			if (editorService.activeEditor instanceof WebviewInput) {
				f(editorService.activeEditor.webview);
				return true;
			}
		}

		return false;
	});
}

overrideCommandForWebview(UndoCommand, webview => webview.undo());
overrideCommandForWebview(RedoCommand, webview => webview.redo());
overrideCommandForWebview(SelectAllCommand, webview => webview.selectAll());
overrideCommandForWebview(CopyAction, webview => webview.copy());
overrideCommandForWebview(PasteAction, webview => webview.paste());
overrideCommandForWebview(CutAction, webview => webview.cut());

export const PreventDefaultContextMenuItemsContextKeyName = 'preventDefaultContextMenuItems';

if (CutAction) {
	MenuRegistry.appendMenuItem(MenuId.WebviewContext, {
		command: {
			id: CutAction.id,
			title: nls.localize('cut', "Cut"),
		},
		group: '5_cutcopypaste',
		order: 1,
		when: ContextKeyExpr.not(PreventDefaultContextMenuItemsContextKeyName),
	});
}

if (CopyAction) {
	MenuRegistry.appendMenuItem(MenuId.WebviewContext, {
		command: {
			id: CopyAction.id,
			title: nls.localize('copy', "Copy"),
		},
		group: '5_cutcopypaste',
		order: 2,
		when: ContextKeyExpr.not(PreventDefaultContextMenuItemsContextKeyName),
	});
}

if (PasteAction) {
	MenuRegistry.appendMenuItem(MenuId.WebviewContext, {
		command: {
			id: PasteAction.id,
			title: nls.localize('paste', "Paste"),
		},
		group: '5_cutcopypaste',
		order: 3,
		when: ContextKeyExpr.not(PreventDefaultContextMenuItemsContextKeyName),
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webview.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webview.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Dimension } from '../../../../base/browser/dom.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { equals } from '../../../../base/common/arrays.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { IObservable } from '../../../../base/common/observable.js';
import { isEqual } from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { IContextKeyService, RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWebviewPortMapping } from '../../../../platform/webview/common/webviewPortMapping.js';
import { Memento } from '../../../common/memento.js';

/**
 * Set when the find widget in a webview in a webview is visible.
 */
export const KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_VISIBLE = new RawContextKey<boolean>('webviewFindWidgetVisible', false);

/**
 * Set when the find widget in a webview is focused.
 */
export const KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED = new RawContextKey<boolean>('webviewFindWidgetFocused', false);

/**
 * Set when the find widget in a webview is enabled in a webview
 */
export const KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_ENABLED = new RawContextKey<boolean>('webviewFindWidgetEnabled', false);

export const IWebviewService = createDecorator<IWebviewService>('webviewService');

export interface IWebviewService {
	readonly _serviceBrand: undefined;

	/**
	 * The currently focused webview.
	 */
	readonly activeWebview: IWebview | undefined;

	/**
	 * All webviews.
	 */
	readonly webviews: Iterable<IWebview>;

	/**
	 * Fired when the currently focused webview changes.
	 */
	readonly onDidChangeActiveWebview: Event<IWebview | undefined>;

	/**
	 * Create a basic webview dom element.
	 */
	createWebviewElement(initInfo: WebviewInitInfo): IWebviewElement;

	/**
	 * Create a lazily created webview element that is overlaid on top of another element.
	 *
	 * Allows us to avoid re-parenting the webview (which destroys its contents) when
	 * moving webview around the workbench.
	 */
	createWebviewOverlay(initInfo: WebviewInitInfo): IOverlayWebview;
}

export interface WebviewInitInfo {
	readonly providedViewType?: string;
	readonly origin?: string;

	readonly title: string | undefined;

	readonly options: WebviewOptions;
	readonly contentOptions: WebviewContentOptions;

	readonly extension: WebviewExtensionDescription | undefined;
}

export const enum WebviewContentPurpose {
	NotebookRenderer = 'notebookRenderer',
	CustomEditor = 'customEditor',
	WebviewView = 'webviewView',
	ChatOutputItem = 'chatOutputItem',
}

export type WebviewStyles = { readonly [key: string]: string | number };

export interface WebviewOptions {
	/**
	 * The purpose of the webview; this is (currently) only used for filtering in js-debug
	 */
	readonly purpose?: WebviewContentPurpose;
	readonly customClasses?: string;
	readonly enableFindWidget?: boolean;

	/**
	 * Disable the service worker used for loading local resources in the webview.
	 */
	readonly disableServiceWorker?: boolean;

	readonly tryRestoreScrollPosition?: boolean;
	readonly retainContextWhenHidden?: boolean;
	transformCssVariables?(styles: WebviewStyles): WebviewStyles;
}

export interface WebviewContentOptions {
	/**
	 * Should the webview allow `acquireVsCodeApi` to be called multiple times? Defaults to false.
	 */
	readonly allowMultipleAPIAcquire?: boolean;

	/**
	 * Should scripts be enabled in the webview? Defaults to false.
	 */
	readonly allowScripts?: boolean;

	/**
	 * Should forms be enabled in the webview? Defaults to the value of {@link allowScripts}.
	 */
	readonly allowForms?: boolean;

	/**
	 * Set of root paths from which the webview can load local resources.
	 */
	readonly localResourceRoots?: readonly URI[];

	/**
	 * Set of localhost port mappings to apply inside the webview.
	 */
	readonly portMapping?: readonly IWebviewPortMapping[];

	/**
	 * Are command uris enabled in the webview? Defaults to false.
	 *
	 * TODO: This is only supported by mainThreadWebviews and should be removed from here.
	 */
	readonly enableCommandUris?: boolean | readonly string[];
}

/**
 * Check if two {@link WebviewContentOptions} are equal.
 */
export function areWebviewContentOptionsEqual(a: WebviewContentOptions, b: WebviewContentOptions): boolean {
	return (
		a.allowMultipleAPIAcquire === b.allowMultipleAPIAcquire
		&& a.allowScripts === b.allowScripts
		&& a.allowForms === b.allowForms
		&& equals(a.localResourceRoots, b.localResourceRoots, isEqual)
		&& equals(a.portMapping, b.portMapping, (a, b) => a.extensionHostPort === b.extensionHostPort && a.webviewPort === b.webviewPort)
		&& areEnableCommandUrisEqual(a, b)
	);
}

function areEnableCommandUrisEqual(a: WebviewContentOptions, b: WebviewContentOptions): boolean {
	if (a.enableCommandUris === b.enableCommandUris) {
		return true;
	}

	if (Array.isArray(a.enableCommandUris) && Array.isArray(b.enableCommandUris)) {
		return equals(a.enableCommandUris, b.enableCommandUris);
	}

	return false;
}

export interface WebviewExtensionDescription {
	readonly location?: URI;
	readonly id: ExtensionIdentifier;
}

export interface WebviewMessageReceivedEvent {
	readonly message: any;
	readonly transfer?: readonly ArrayBuffer[];
}

export interface IWebview extends IDisposable {

	/**
	 * The original view type of the webview.
	 */
	readonly providedViewType?: string;

	/**
	 * The origin this webview itself is loaded from. May not be unique.
	 */
	readonly origin: string;

	/**
	 * Set html content of the webview.
	 */
	setHtml(html: string): void;

	/**
	 * Set the title of the webview. This is set on the webview's iframe element.
	 */
	setTitle(title: string): void;

	/**
	 * Control what content is allowed/blocked inside the webview.
	 */
	contentOptions: WebviewContentOptions;

	/**
	 * List of roots from which local resources can be loaded.
	 *
	 * Requests for local resources not in this list are blocked.
	 */
	localResourcesRoot: readonly URI[];

	/**
	 * The extension that created/owns this webview.
	 */
	extension: WebviewExtensionDescription | undefined;

	initialScrollProgress: number;
	state: string | undefined;

	readonly isFocused: boolean;

	readonly onDidFocus: Event<void>;
	readonly onDidBlur: Event<void>;

	/**
	 * Fired when the webview is disposed of.
	 */
	readonly onDidDispose: Event<void>;

	readonly onDidClickLink: Event<string>;
	readonly onDidScroll: Event<{ readonly scrollYPercentage: number }>;
	readonly onDidWheel: Event<IMouseWheelEvent>;

	readonly onDidUpdateState: Event<string | undefined>;

	/**
	 * The natural size of the content inside the webview.
	 *
	 * This is computed by looking at the size of the webview's the document element.
	 */
	readonly intrinsicContentSize: IObservable<{ readonly width: number; readonly height: number } | undefined>;

	/**
	 * Fired when the webview cannot be loaded or is now in a non-functional state.
	 */
	readonly onFatalError: Event<{ readonly message: string }>;
	readonly onMissingCsp: Event<ExtensionIdentifier>;

	readonly onMessage: Event<WebviewMessageReceivedEvent>;

	postMessage(message: any, transfer?: readonly ArrayBuffer[]): Promise<boolean>;

	focus(): void;
	reload(): void;

	showFind(animated?: boolean): void;
	hideFind(animated?: boolean): void;
	runFindAction(previous: boolean): void;

	selectAll(): void;
	copy(): void;
	paste(): void;
	cut(): void;
	undo(): void;
	redo(): void;

	windowDidDragStart(): void;
	windowDidDragEnd(): void;

	setContextKeyService(scopedContextKeyService: IContextKeyService): void;
}

/**
 * Basic webview rendered directly in the dom
 */
export interface IWebviewElement extends IWebview {
	/**
	 * Append the webview to a HTML element.
	 *
	 * Note that the webview content will be destroyed if any part of the parent hierarchy
	 * changes. You can avoid this by using a {@link IOverlayWebview} instead.
	 *
	 * @param parent Element to append the webview to.
	 */
	mountTo(parent: HTMLElement, targetWindow: CodeWindow): void;

	reinitializeAfterDismount(): void;
}

/**
 * Lazily created {@link IWebview} that is absolutely positioned over another element.
 *
 * Absolute positioning lets us avoid having the webview be re-parented, which would destroy the
 * webview's content.
 *
 * Note that the underlying webview owned by a `WebviewOverlay` can be dynamically created
 * and destroyed depending on who has {@link IOverlayWebview.claim claimed} or {@link IOverlayWebview.release released} it.
 */
export interface IOverlayWebview extends IWebview {
	/**
	 * The HTML element that holds the webview.
	 */
	readonly container: HTMLElement;

	origin: string;

	options: WebviewOptions;

	/**
	 * Take ownership of the webview.
	 *
	 * This will create the underlying webview element.
	 *
	 * @param claimant Identifier for the object claiming the webview.
	 *   This must match the `claimant` passed to {@link IOverlayWebview.release}.
	 */
	claim(claimant: any, targetWindow: CodeWindow, scopedContextKeyService: IContextKeyService | undefined): void;

	/**
	 * Release ownership of the webview.
	 *
	 * If the {@link claimant} is still the current owner of the webview, this will
	 * cause the underlying webview element to be destoryed.
	 *
	 * @param claimant Identifier for the object releasing its claim on the webview.
	 *   This must match the `claimant` passed to {@link IOverlayWebview.claim}.
	 */
	release(claimant: any): void;

	/**
	 * Absolutely position the webview on top of another element in the DOM.
	 *
	 * @param element Element to position the webview on top of. This element should
	 *   be an placeholder for the webview since the webview will entirely cover it.
	 * @param dimension Optional explicit dimensions to use for sizing the webview.
	 * @param clippingContainer Optional container to clip the webview to. This should generally be a parent of `element`.
	 */
	layoutWebviewOverElement(element: HTMLElement, dimension?: Dimension, clippingContainer?: HTMLElement): void;
}

/**
 * Stores the unique origins for a webview.
 *
 * These are randomly generated
 */
export class WebviewOriginStore {

	private readonly _memento: Memento<Record<string, string>>;
	private readonly _state: Record<string, string | undefined>;

	constructor(
		rootStorageKey: string,
		@IStorageService storageService: IStorageService,
	) {
		this._memento = new Memento(rootStorageKey, storageService);
		this._state = this._memento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	public getOrigin(viewType: string, additionalKey: string | undefined): string {
		const key = this._getKey(viewType, additionalKey);

		const existing = this._state[key];
		if (existing && typeof existing === 'string') {
			return existing;
		}

		const newOrigin = generateUuid();
		this._state[key] = newOrigin;
		this._memento.saveMemento();
		return newOrigin;
	}

	private _getKey(viewType: string, additionalKey: string | undefined): string {
		return JSON.stringify({ viewType, key: additionalKey });
	}
}

/**
 * Stores the unique origins for a webview.
 *
 * These are randomly generated, but keyed on extension and webview viewType.
 */
export class ExtensionKeyedWebviewOriginStore {

	private readonly _store: WebviewOriginStore;

	constructor(
		rootStorageKey: string,
		@IStorageService storageService: IStorageService,
	) {
		this._store = new WebviewOriginStore(rootStorageKey, storageService);
	}

	public getOrigin(viewType: string, extId: ExtensionIdentifier): string {
		return this._store.getOrigin(viewType, extId.value);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webview.web.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webview.web.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IWebviewService } from './webview.js';
import { WebviewService } from './webviewService.js';

registerSingleton(IWebviewService, WebviewService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webviewElement.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webviewElement.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFirefox } from '../../../../base/browser/browser.js';
import { addDisposableListener, EventType, getWindow, getWindowById } from '../../../../base/browser/dom.js';
import { parentOriginHash } from '../../../../base/browser/iframe.js';
import { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { promiseWithResolvers, ThrottledDelayer } from '../../../../base/common/async.js';
import { streamToBuffer, VSBufferReadableStream } from '../../../../base/common/buffer.js';
import { CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { COI } from '../../../../base/common/network.js';
import { observableValue } from '../../../../base/common/observable.js';
import { URI } from '../../../../base/common/uri.js';
import { generateUuid } from '../../../../base/common/uuid.js';
import { localize } from '../../../../nls.js';
import { IAccessibilityService } from '../../../../platform/accessibility/common/accessibility.js';
import { MenuId } from '../../../../platform/actions/common/actions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService } from '../../../../platform/notification/common/notification.js';
import { IRemoteAuthorityResolverService } from '../../../../platform/remote/common/remoteAuthorityResolver.js';
import { ITunnelService } from '../../../../platform/tunnel/common/tunnel.js';
import { WebviewPortMappingManager } from '../../../../platform/webview/common/webviewPortMapping.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { decodeAuthority, webviewGenericCspSource, webviewRootResourceAuthority } from '../common/webview.js';
import { loadLocalResource, WebviewResourceResponse } from './resourceLoading.js';
import { WebviewThemeDataProvider } from './themeing.js';
import { areWebviewContentOptionsEqual, IWebviewElement, WebviewContentOptions, WebviewExtensionDescription, WebviewInitInfo, WebviewMessageReceivedEvent, WebviewOptions } from './webview.js';
import { WebviewFindDelegate, WebviewFindWidget } from './webviewFindWidget.js';
import { FromWebviewMessage, KeyEvent, ToWebviewMessage, WebViewDragEvent } from './webviewMessages.js';

interface WebviewContent {
	readonly html: string;
	readonly title: string | undefined;
	readonly options: WebviewContentOptions;
	readonly state: string | undefined;
}

namespace WebviewState {
	export const enum Type { Initializing, Ready }

	export class Initializing {
		readonly type = Type.Initializing;

		constructor(
			public pendingMessages: Array<{
				readonly channel: string;
				readonly data?: any;
				readonly transferable: Transferable[];
				readonly resolve: (posted: boolean) => void;
			}>
		) { }
	}

	export const Ready = { type: Type.Ready } as const;

	export type State = typeof Ready | Initializing;
}

interface WebviewActionContext {
	readonly webview?: string;
	readonly [key: string]: unknown;
}

const webviewIdContext = 'webviewId';

export class WebviewElement extends Disposable implements IWebviewElement, WebviewFindDelegate {

	protected readonly id = generateUuid();

	/**
	 * The provided identifier of this webview.
	 */
	public readonly providedViewType?: string;

	/**
	 * The origin this webview itself is loaded from. May not be unique
	 */
	public readonly origin: string;

	private _windowId: number | undefined = undefined;
	private get window() { return typeof this._windowId === 'number' ? getWindowById(this._windowId)?.window : undefined; }

	private _encodedWebviewOriginPromise?: Promise<string>;
	private _encodedWebviewOrigin: string | undefined;

	protected get platform(): string { return 'browser'; }

	private readonly _expectedServiceWorkerVersion = 4; // Keep this in sync with the version in service-worker.js

	private _element: HTMLIFrameElement | undefined;
	protected get element(): HTMLIFrameElement | undefined { return this._element; }

	private _focused: boolean | undefined;
	public get isFocused(): boolean {
		if (!this._focused) {
			return false;
		}
		// code window is only available after the webview is mounted.
		if (!this.window) {
			return false;
		}

		if (this.window.document.activeElement && this.window.document.activeElement !== this.element) {
			// looks like https://github.com/microsoft/vscode/issues/132641
			// where the focus is actually not in the `<iframe>`
			return false;
		}
		return true;
	}

	private _state: WebviewState.State = new WebviewState.Initializing([]);

	private _content: WebviewContent;

	private readonly _portMappingManager: WebviewPortMappingManager;

	private readonly _resourceLoadingCts = this._register(new CancellationTokenSource());

	private _contextKeyService: IContextKeyService | undefined;

	private _confirmBeforeClose: string;

	private readonly _focusDelayer = this._register(new ThrottledDelayer(50));

	private readonly _onDidHtmlChange: Emitter<string> = this._register(new Emitter<string>());
	protected readonly onDidHtmlChange = this._onDidHtmlChange.event;

	private _messagePort?: MessagePort;
	private readonly _messageHandlers = new Map<string, Set<(data: any, e: MessageEvent) => void>>();

	protected readonly _webviewFindWidget: WebviewFindWidget | undefined;
	public readonly checkImeCompletionState = true;

	public readonly intrinsicContentSize = observableValue<{ readonly width: number; readonly height: number } | undefined>('WebviewIntrinsicContentSize', undefined);

	private _disposed = false;


	public extension: WebviewExtensionDescription | undefined;
	private readonly _options: WebviewOptions;

	constructor(
		initInfo: WebviewInitInfo,
		protected readonly webviewThemeDataProvider: WebviewThemeDataProvider,
		@IConfigurationService configurationService: IConfigurationService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@INotificationService notificationService: INotificationService,
		@IWorkbenchEnvironmentService private readonly _environmentService: IWorkbenchEnvironmentService,
		@IFileService private readonly _fileService: IFileService,
		@ILogService private readonly _logService: ILogService,
		@IRemoteAuthorityResolverService private readonly _remoteAuthorityResolverService: IRemoteAuthorityResolverService,
		@ITunnelService private readonly _tunnelService: ITunnelService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IAccessibilityService private readonly _accessibilityService: IAccessibilityService,
	) {
		super();

		this.providedViewType = initInfo.providedViewType;
		this.origin = initInfo.origin ?? this.id;

		this._options = initInfo.options;
		this.extension = initInfo.extension;

		this._content = {
			html: '',
			title: initInfo.title,
			options: initInfo.contentOptions,
			state: undefined
		};

		this._portMappingManager = this._register(new WebviewPortMappingManager(
			() => this.extension?.location,
			() => this._content.options.portMapping || [],
			this._tunnelService
		));

		this._element = this._createElement(initInfo.options, initInfo.contentOptions);

		this._register(this.on('no-csp-found', () => {
			this.handleNoCspFound();
		}));

		this._register(this.on('did-click-link', ({ uri }) => {
			this._onDidClickLink.fire(uri);
		}));

		this._register(this.on('onmessage', ({ message, transfer }) => {
			this._onMessage.fire({ message, transfer });
		}));

		this._register(this.on('did-scroll', ({ scrollYPercentage }) => {
			this._onDidScroll.fire({ scrollYPercentage });
		}));

		this._register(this.on('do-reload', () => {
			this.reload();
		}));

		this._register(this.on('do-update-state', (state) => {
			this.state = state;
			this._onDidUpdateState.fire(state);
		}));

		this._register(this.on('did-focus', () => {
			this.handleFocusChange(true);
		}));

		this._register(this.on('did-blur', () => {
			this.handleFocusChange(false);
		}));

		this._register(this.on('did-scroll-wheel', (event) => {
			this._onDidWheel.fire(event);
		}));

		this._register(this.on('did-find', ({ didFind }) => {
			this._hasFindResult.fire(didFind);
		}));

		this._register(this.on('fatal-error', (e) => {
			notificationService.error(localize('fatalErrorMessage', "Error loading webview: {0}", e.message));
			this._onFatalError.fire({ message: e.message });
		}));

		this._register(this.on('did-keydown', (data) => {
			// Electron: workaround for https://github.com/electron/electron/issues/14258
			// We have to detect keyboard events in the <webview> and dispatch them to our
			// keybinding service because these events do not bubble to the parent window anymore.
			this.handleKeyEvent('keydown', data);
		}));

		this._register(this.on('did-keyup', (data) => {
			this.handleKeyEvent('keyup', data);
		}));

		this._register(this.on('did-context-menu', (data) => {
			if (!this.element) {
				return;
			}
			if (!this._contextKeyService) {
				return;
			}
			const elementBox = this.element.getBoundingClientRect();
			const contextKeyService = this._contextKeyService.createOverlay([
				...Object.entries(data.context),
				[webviewIdContext, this.providedViewType],
			]);
			contextMenuService.showContextMenu({
				menuId: MenuId.WebviewContext,
				menuActionOptions: { shouldForwardArgs: true },
				contextKeyService,
				getActionsContext: (): WebviewActionContext => ({ ...data.context, webview: this.providedViewType }),
				getAnchor: () => ({
					x: elementBox.x + data.clientX,
					y: elementBox.y + data.clientY
				})
			});
			this._send('set-context-menu-visible', { visible: true });
		}));

		this._register(this.on('load-resource', async (entry) => {
			try {
				// Restore the authority we previously encoded
				const authority = decodeAuthority(entry.authority);
				const uri = URI.from({
					scheme: entry.scheme,
					authority: authority,
					path: decodeURIComponent(entry.path), // This gets re-encoded
					query: entry.query ? decodeURIComponent(entry.query) : entry.query,
				});
				this.loadResource(entry.id, uri, entry.ifNoneMatch);
			} catch (e) {
				this._send('did-load-resource', {
					id: entry.id,
					status: 404,
					path: entry.path,
				});
			}
		}));

		this._register(this.on('load-localhost', (entry) => {
			this.localLocalhost(entry.id, entry.origin);
		}));

		this._register(Event.runAndSubscribe(webviewThemeDataProvider.onThemeDataChanged, () => this.style()));
		this._register(_accessibilityService.onDidChangeReducedMotion(() => this.style()));
		this._register(_accessibilityService.onDidChangeScreenReaderOptimized(() => this.style()));
		this._register(contextMenuService.onDidHideContextMenu(() => this._send('set-context-menu-visible', { visible: false })));

		this._confirmBeforeClose = configurationService.getValue<string>('window.confirmBeforeClose');

		this._register(configurationService.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('window.confirmBeforeClose')) {
				this._confirmBeforeClose = configurationService.getValue('window.confirmBeforeClose');
				this._send('set-confirm-before-close', this._confirmBeforeClose);
			}
		}));

		this._register(this.on('drag-start', () => {
			this._startBlockingIframeDragEvents();
		}));

		this._register(this.on('drag', (event) => {
			this.handleDragEvent('drag', event);
		}));

		this._register(this.on('updated-intrinsic-content-size', (event) => {
			this.intrinsicContentSize.set({ width: event.width, height: event.height }, undefined, undefined);
		}));

		if (initInfo.options.enableFindWidget) {
			this._webviewFindWidget = this._register(instantiationService.createInstance(WebviewFindWidget, this));
		}
	}

	override dispose(): void {
		this._disposed = true;

		this.element?.remove();
		this._element = undefined;

		this._messagePort = undefined;

		if (this._state.type === WebviewState.Type.Initializing) {
			for (const message of this._state.pendingMessages) {
				message.resolve(false);
			}
			this._state.pendingMessages = [];
		}

		this._onDidDispose.fire();

		this._resourceLoadingCts.dispose(true);

		super.dispose();
	}

	setContextKeyService(contextKeyService: IContextKeyService) {
		this._contextKeyService = contextKeyService;
	}

	private readonly _onMissingCsp = this._register(new Emitter<ExtensionIdentifier>());
	public readonly onMissingCsp = this._onMissingCsp.event;

	private readonly _onDidClickLink = this._register(new Emitter<string>());
	public readonly onDidClickLink = this._onDidClickLink.event;

	private readonly _onMessage = this._register(new Emitter<WebviewMessageReceivedEvent>());
	public readonly onMessage = this._onMessage.event;

	private readonly _onDidScroll = this._register(new Emitter<{ readonly scrollYPercentage: number }>());
	public readonly onDidScroll = this._onDidScroll.event;

	private readonly _onDidWheel = this._register(new Emitter<IMouseWheelEvent>());
	public readonly onDidWheel = this._onDidWheel.event;

	private readonly _onDidUpdateState = this._register(new Emitter<string | undefined>());
	public readonly onDidUpdateState = this._onDidUpdateState.event;

	private readonly _onDidFocus = this._register(new Emitter<void>());
	public readonly onDidFocus = this._onDidFocus.event;

	private readonly _onDidBlur = this._register(new Emitter<void>());
	public readonly onDidBlur = this._onDidBlur.event;

	private readonly _onFatalError = this._register(new Emitter<{ readonly message: string }>());
	public readonly onFatalError = this._onFatalError.event;

	private readonly _onDidDispose = this._register(new Emitter<void>());
	public readonly onDidDispose = this._onDidDispose.event;

	public postMessage(message: any, transfer?: ArrayBuffer[]): Promise<boolean> {
		return this._send('message', { message, transfer });
	}

	private async _send<K extends keyof ToWebviewMessage>(channel: K, data: ToWebviewMessage[K], _createElement: Transferable[] = []): Promise<boolean> {
		if (this._state.type === WebviewState.Type.Initializing) {
			const { promise, resolve } = promiseWithResolvers<boolean>();
			this._state.pendingMessages.push({ channel, data, transferable: _createElement, resolve });
			return promise;
		} else {
			return this.doPostMessage(channel, data, _createElement);
		}
	}

	private _createElement(options: WebviewOptions, _contentOptions: WebviewContentOptions) {
		// Do not start loading the webview yet.
		// Wait the end of the ctor when all listeners have been hooked up.
		const element = document.createElement('iframe');
		element.name = this.id;
		element.className = `webview ${options.customClasses || ''}`;
		element.sandbox.add('allow-scripts', 'allow-same-origin', 'allow-forms', 'allow-pointer-lock', 'allow-downloads');

		const allowRules = ['cross-origin-isolated', 'autoplay', 'local-network-access'];
		if (!isFirefox) {
			allowRules.push('clipboard-read', 'clipboard-write');
		}
		element.setAttribute('allow', allowRules.join('; '));

		element.style.border = 'none';
		element.style.width = '100%';
		element.style.height = '100%';

		element.focus = () => {
			this._doFocus();
		};

		return element;
	}

	private _initElement(encodedWebviewOrigin: string, extension: WebviewExtensionDescription | undefined, options: WebviewOptions, targetWindow: CodeWindow) {
		// The extensionId and purpose in the URL are used for filtering in js-debug:
		const params: { [key: string]: string } = {
			id: this.id,
			parentId: targetWindow.vscodeWindowId.toString(),
			origin: this.origin,
			swVersion: String(this._expectedServiceWorkerVersion),
			extensionId: extension?.id.value ?? '',
			platform: this.platform,
			'vscode-resource-base-authority': webviewRootResourceAuthority,
			parentOrigin: targetWindow.origin,
		};

		if (this._options.disableServiceWorker) {
			params.disableServiceWorker = 'true';
		}

		if (this._environmentService.remoteAuthority) {
			params.remoteAuthority = this._environmentService.remoteAuthority;
		}

		if (options.purpose) {
			params.purpose = options.purpose;
		}

		COI.addSearchParam(params, true, true);

		const queryString = new URLSearchParams(params).toString();

		this.perfMark('init/set-src');
		const fileName = 'index.html';
		this.element!.setAttribute('src', `${this.webviewContentEndpoint(encodedWebviewOrigin)}/${fileName}?${queryString}`);
	}

	public mountTo(element: HTMLElement, targetWindow: CodeWindow) {
		if (!this.element) {
			return;
		}

		this._windowId = targetWindow.vscodeWindowId;
		this._encodedWebviewOriginPromise = parentOriginHash(targetWindow.origin, this.origin).then(id => this._encodedWebviewOrigin = id);
		this._encodedWebviewOriginPromise.then(encodedWebviewOrigin => {
			if (!this._disposed) {
				this._initElement(encodedWebviewOrigin, this.extension, this._options, targetWindow);
			}
		});
		this._registerMessageHandler(targetWindow);

		if (this._webviewFindWidget) {
			element.appendChild(this._webviewFindWidget.getDomNode());
		}

		for (const eventName of [EventType.MOUSE_DOWN, EventType.MOUSE_MOVE, EventType.DROP]) {
			this._register(addDisposableListener(element, eventName, () => {
				this._stopBlockingIframeDragEvents();
			}));
		}

		for (const node of [element, targetWindow]) {
			this._register(addDisposableListener(node, EventType.DRAG_END, () => {
				this._stopBlockingIframeDragEvents();
			}));
		}

		element.id = this.id; // This is used by aria-flow for accessibility order

		this.perfMark('mounted');
		element.appendChild(this.element);
	}

	private _registerMessageHandler(targetWindow: CodeWindow) {
		const subscription = this._register(addDisposableListener(targetWindow, 'message', (e: MessageEvent) => {
			if (!this._encodedWebviewOrigin || e?.data?.target !== this.id) {
				return;
			}

			if (e.origin !== this._webviewContentOrigin(this._encodedWebviewOrigin)) {
				console.log(`Skipped renderer receiving message due to mismatched origins: ${e.origin} ${this._webviewContentOrigin}`);
				return;
			}

			if (e.data.channel === 'webview-ready') {
				if (this._messagePort) {
					return;
				}

				this.perfMark('webview-ready');
				this._logService.trace(`Webview(${this.id}): webview ready`);

				this._messagePort = e.ports[0];
				this._messagePort.onmessage = (e) => {
					const handlers = this._messageHandlers.get(e.data.channel);
					if (!handlers) {
						console.log(`No handlers found for '${e.data.channel}'`);
						return;
					}
					handlers?.forEach(handler => handler(e.data.data, e));
				};

				this.element?.classList.add('ready');

				if (this._state.type === WebviewState.Type.Initializing) {
					this._state.pendingMessages.forEach(({ channel, data, resolve }) => resolve(this.doPostMessage(channel, data)));
				}
				this._state = WebviewState.Ready;

				subscription.dispose();
			}
		}));
	}

	private perfMark(name: string) {
		performance.mark(`webview/webviewElement/${name}`, {
			detail: {
				id: this.id
			}
		});
	}

	private _startBlockingIframeDragEvents() {
		if (this.element) {
			this.element.style.pointerEvents = 'none';
		}
	}

	private _stopBlockingIframeDragEvents() {
		if (this.element) {
			this.element.style.pointerEvents = 'auto';
		}
	}

	protected webviewContentEndpoint(encodedWebviewOrigin: string): string {
		const webviewExternalEndpoint = this._environmentService.webviewExternalEndpoint;
		if (!webviewExternalEndpoint) {
			throw new Error(`'webviewExternalEndpoint' has not been configured. Webviews will not work!`);
		}

		const endpoint = webviewExternalEndpoint.replace('{{uuid}}', encodedWebviewOrigin);
		if (endpoint[endpoint.length - 1] === '/') {
			return endpoint.slice(0, endpoint.length - 1);
		}
		return endpoint;
	}

	private _webviewContentOrigin(encodedWebviewOrigin: string): string {
		const uri = URI.parse(this.webviewContentEndpoint(encodedWebviewOrigin));
		return uri.scheme + '://' + uri.authority.toLowerCase();
	}

	private doPostMessage(channel: string, data?: any, transferable: Transferable[] = []): boolean {
		if (this.element && this._messagePort) {
			this._messagePort.postMessage({ channel, args: data }, transferable);
			return true;
		}
		return false;
	}

	private on<K extends keyof FromWebviewMessage>(channel: K, handler: (data: FromWebviewMessage[K], e: MessageEvent) => void): IDisposable {
		let handlers = this._messageHandlers.get(channel);
		if (!handlers) {
			handlers = new Set();
			this._messageHandlers.set(channel, handlers);
		}

		handlers.add(handler);
		return toDisposable(() => {
			this._messageHandlers.get(channel)?.delete(handler);
		});
	}

	private _hasAlertedAboutMissingCsp = false;
	private handleNoCspFound(): void {
		if (this._hasAlertedAboutMissingCsp) {
			return;
		}
		this._hasAlertedAboutMissingCsp = true;

		if (this.extension?.id) {
			if (this._environmentService.isExtensionDevelopment) {
				this._onMissingCsp.fire(this.extension.id);
			}
		}
	}

	public reload(): void {
		this.doUpdateContent(this._content);
	}

	public reinitializeAfterDismount(): void {
		this._state = new WebviewState.Initializing([]);
		this._messagePort = undefined;

		this.mountTo(this.element!.parentElement!, getWindow(this.element));
		this.reload();
	}

	public setHtml(html: string) {
		this.doUpdateContent({ ...this._content, html });
		this._onDidHtmlChange.fire(html);
	}

	public setTitle(title: string) {
		this._content = { ...this._content, title };
		this._send('set-title', title);
	}

	public set contentOptions(options: WebviewContentOptions) {
		this._logService.debug(`Webview(${this.id}): will update content options`);

		if (areWebviewContentOptionsEqual(options, this._content.options)) {
			this._logService.debug(`Webview(${this.id}): skipping content options update`);
			return;
		}

		this.doUpdateContent({ ...this._content, options });
	}

	public set localResourcesRoot(resources: readonly URI[]) {
		this._content = {
			...this._content,
			options: { ...this._content.options, localResourceRoots: resources }
		};
	}

	public set state(state: string | undefined) {
		this._content = { ...this._content, state };
	}

	public set initialScrollProgress(value: number) {
		this._send('initial-scroll-position', value);
	}

	private doUpdateContent(newContent: WebviewContent) {
		this._logService.debug(`Webview(${this.id}): will update content`);

		this._content = newContent;

		const allowScripts = !!this._content.options.allowScripts;
		this.perfMark('set-content');
		this._send('content', {
			contents: this._content.html,
			title: this._content.title,
			options: {
				allowMultipleAPIAcquire: !!this._content.options.allowMultipleAPIAcquire,
				allowScripts: allowScripts,
				allowForms: this._content.options.allowForms ?? allowScripts, // For back compat, we allow forms by default when scripts are enabled
			},
			state: this._content.state,
			cspSource: webviewGenericCspSource,
			confirmBeforeClose: this._confirmBeforeClose,
		});
	}

	protected style(): void {
		let { styles, activeTheme, themeLabel, themeId } = this.webviewThemeDataProvider.getWebviewThemeData();
		if (this._options.transformCssVariables) {
			styles = this._options.transformCssVariables(styles);
		}

		const reduceMotion = this._accessibilityService.isMotionReduced();
		const screenReader = this._accessibilityService.isScreenReaderOptimized();

		this._send('styles', { styles, activeTheme, themeId, themeLabel, reduceMotion, screenReader });
	}


	protected handleFocusChange(isFocused: boolean): void {
		this._focused = isFocused;
		if (isFocused) {
			this._onDidFocus.fire();
		} else {
			this._onDidBlur.fire();
		}
	}

	private handleKeyEvent(type: 'keydown' | 'keyup', event: KeyEvent) {
		// Create a fake KeyboardEvent from the data provided
		const emulatedKeyboardEvent = new KeyboardEvent(type, event);
		// Force override the target
		Object.defineProperty(emulatedKeyboardEvent, 'target', {
			get: () => this.element,
		});
		// And re-dispatch
		this.window?.dispatchEvent(emulatedKeyboardEvent);
	}

	private handleDragEvent(type: 'drag', event: WebViewDragEvent) {
		// Create a fake DragEvent from the data provided
		const emulatedDragEvent = new DragEvent(type, event);
		// Force override the target
		Object.defineProperty(emulatedDragEvent, 'target', {
			get: () => this.element,
		});
		// And re-dispatch
		this.window?.dispatchEvent(emulatedDragEvent);
	}

	windowDidDragStart(): void {
		// Webview break drag and dropping around the main window (no events are generated when you are over them)
		// Work around this by disabling pointer events during the drag.
		// https://github.com/electron/electron/issues/18226
		this._startBlockingIframeDragEvents();
	}

	windowDidDragEnd(): void {
		this._stopBlockingIframeDragEvents();
	}

	public selectAll() {
		this.execCommand('selectAll');
	}

	public copy() {
		this.execCommand('copy');
	}

	public paste() {
		this.execCommand('paste');
	}

	public cut() {
		this.execCommand('cut');
	}

	public undo() {
		this.execCommand('undo');
	}

	public redo() {
		this.execCommand('redo');
	}

	private execCommand(command: string) {
		if (this.element) {
			this._send('execCommand', command);
		}
	}

	private async loadResource(id: number, uri: URI, ifNoneMatch: string | undefined) {
		try {
			const result = await loadLocalResource(uri, {
				ifNoneMatch,
				roots: this._content.options.localResourceRoots || [],
			}, this._fileService, this._logService, this._resourceLoadingCts.token);

			switch (result.type) {
				case WebviewResourceResponse.Type.Success: {
					const buffer = await this.streamToBuffer(result.stream);
					return this._send('did-load-resource', {
						id,
						status: 200,
						path: uri.path,
						mime: result.mimeType,
						data: buffer,
						etag: result.etag,
						mtime: result.mtime
					}, [buffer]);
				}
				case WebviewResourceResponse.Type.NotModified: {
					return this._send('did-load-resource', {
						id,
						status: 304, // not modified
						path: uri.path,
						mime: result.mimeType,
						mtime: result.mtime
					});
				}
				case WebviewResourceResponse.Type.AccessDenied: {
					return this._send('did-load-resource', {
						id,
						status: 401, // unauthorized
						path: uri.path,
					});
				}
			}
		} catch {
			// noop
		}

		return this._send('did-load-resource', {
			id,
			status: 404,
			path: uri.path,
		});
	}

	protected async streamToBuffer(stream: VSBufferReadableStream): Promise<ArrayBufferLike> {
		const vsBuffer = await streamToBuffer(stream);
		return vsBuffer.buffer.buffer;
	}

	private async localLocalhost(id: string, origin: string) {
		const authority = this._environmentService.remoteAuthority;
		const resolveAuthority = authority ? await this._remoteAuthorityResolverService.resolveAuthority(authority) : undefined;
		const redirect = resolveAuthority ? await this._portMappingManager.getRedirect(resolveAuthority.authority, origin) : undefined;
		return this._send('did-load-localhost', {
			id,
			origin,
			location: redirect
		});
	}

	public focus(): void {
		this._doFocus();

		// Handle focus change programmatically (do not rely on event from <webview>)
		this.handleFocusChange(true);
	}

	private _doFocus() {
		if (!this.element) {
			return;
		}

		try {
			this.element.contentWindow?.focus();
		} catch {
			// noop
		}

		// Workaround for https://github.com/microsoft/vscode/issues/75209
		// Focusing the inner webview is async so for a sequence of actions such as:
		//
		// 1. Open webview
		// 1. Show quick pick from command palette
		//
		// We end up focusing the webview after showing the quick pick, which causes
		// the quick pick to instantly dismiss.
		//
		// Workaround this by debouncing the focus and making sure we are not focused on an input
		// when we try to re-focus.
		this._focusDelayer.trigger(async () => {
			if (!this.isFocused || !this.element) {
				return;
			}

			if (this.window?.document.activeElement && this.window.document.activeElement !== this.element && this.window.document.activeElement?.tagName !== 'BODY') {
				return;
			}

			// It is possible for the webview to be contained in another window
			// that does not have focus. As such, also focus the body of the
			// webview's window to ensure it is properly receiving keyboard focus.
			this.window?.document.body?.focus();

			this._send('focus', undefined);
		});
	}

	protected readonly _hasFindResult = this._register(new Emitter<boolean>());
	public readonly hasFindResult: Event<boolean> = this._hasFindResult.event;

	protected readonly _onDidStopFind = this._register(new Emitter<void>());
	public readonly onDidStopFind: Event<void> = this._onDidStopFind.event;

	/**
	 * Webviews expose a stateful find API.
	 * Successive calls to find will move forward or backward through onFindResults
	 * depending on the supplied options.
	 *
	 * @param value The string to search for. Empty strings are ignored.
	 */
	public find(value: string, previous: boolean): void {
		if (!this.element) {
			return;
		}

		this._send('find', { value, previous });
	}

	public updateFind(value: string) {
		if (!value || !this.element) {
			return;
		}
		this._send('find', { value });
	}

	public stopFind(keepSelection?: boolean): void {
		if (!this.element) {
			return;
		}
		this._send('find-stop', { clearSelection: !keepSelection });
		this._onDidStopFind.fire();
	}

	public showFind(animated = true) {
		this._webviewFindWidget?.reveal(undefined, animated);
	}

	public hideFind(animated = true) {
		this._webviewFindWidget?.hide(animated);
	}

	public runFindAction(previous: boolean) {
		this._webviewFindWidget?.find(previous);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webviewFindWidget.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webviewFindWidget.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../base/common/event.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { SimpleFindWidget } from '../../codeEditor/browser/find/simpleFindWidget.js';
import { KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED } from './webview.js';

export interface WebviewFindDelegate {
	readonly hasFindResult: Event<boolean>;
	readonly onDidStopFind: Event<void>;
	readonly checkImeCompletionState: boolean;
	find(value: string, previous: boolean): void;
	updateFind(value: string): void;
	stopFind(keepSelection?: boolean): void;
	focus(): void;
}

export class WebviewFindWidget extends SimpleFindWidget {
	protected async _getResultCount(dataChanged?: boolean): Promise<{ resultIndex: number; resultCount: number } | undefined> {
		return undefined;
	}

	protected readonly _findWidgetFocused: IContextKey<boolean>;

	constructor(
		private readonly _delegate: WebviewFindDelegate,
		@IContextViewService contextViewService: IContextViewService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IHoverService hoverService: IHoverService,
		@IKeybindingService keybindingService: IKeybindingService
	) {
		super({
			showCommonFindToggles: false,
			checkImeCompletionState: _delegate.checkImeCompletionState,
			enableSash: true,
		}, contextViewService, contextKeyService, hoverService, keybindingService);
		this._findWidgetFocused = KEYBINDING_CONTEXT_WEBVIEW_FIND_WIDGET_FOCUSED.bindTo(contextKeyService);

		this._register(_delegate.hasFindResult(hasResult => {
			this.updateButtons(hasResult);
			this.focusFindBox();
		}));

		this._register(_delegate.onDidStopFind(() => {
			this.updateButtons(false);
		}));
	}

	public find(previous: boolean) {
		const val = this.inputValue;
		if (val) {
			this._delegate.find(val, previous);
		}
	}

	public override hide(animated = true) {
		super.hide(animated);
		this._delegate.stopFind(true);
		this._delegate.focus();
	}

	protected _onInputChanged(): boolean {
		const val = this.inputValue;
		if (val) {
			this._delegate.updateFind(val);
		} else {
			this._delegate.stopFind(false);
		}
		return false;
	}

	protected _onFocusTrackerFocus() {
		this._findWidgetFocused.set(true);
	}

	protected _onFocusTrackerBlur() {
		this._findWidgetFocused.reset();
	}

	protected _onFindInputFocusTrackerFocus() { }

	protected _onFindInputFocusTrackerBlur() { }

	findFirst() { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webviewMessages.d.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webviewMessages.d.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IMouseWheelEvent } from '../../../../base/browser/mouseEvent.js';
import type { WebviewStyles } from './webview.js';

type KeyEvent = {
	key: string;
	keyCode: number;
	code: string;
	shiftKey: boolean;
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	repeat: boolean;
}

type WebViewDragEvent = {
	shiftKey: boolean;
}

export type FromWebviewMessage = {
	'onmessage': { message: any; transfer?: ArrayBuffer[] };
	'did-click-link': { uri: string };
	'did-scroll': { scrollYPercentage: number };
	'did-focus': void;
	'did-blur': void;
	'did-load': void;
	'did-find': { didFind: boolean };
	'do-update-state': string;
	'do-reload': void;
	'load-resource': { id: number; path: string; query: string; scheme: string; authority: string; ifNoneMatch?: string };
	'load-localhost': { id: string; origin: string };
	'did-scroll-wheel': IMouseWheelEvent;
	'fatal-error': { message: string };
	'no-csp-found': void;
	'did-keydown': KeyEvent;
	'did-keyup': KeyEvent;
	'did-context-menu': { clientX: number; clientY: number; context: { [key: string]: unknown } };
	'drag-start': void;
	'drag': WebViewDragEvent;
	'updated-intrinsic-content-size': { width: number; height: number };
};

interface UpdateContentEvent {
	contents: string;
	title: string | undefined;
	options: {
		allowMultipleAPIAcquire: boolean;
		allowScripts: boolean;
		allowForms: boolean;
	};
	state: any;
	cspSource: string;
	confirmBeforeClose: string;
}

export type ToWebviewMessage = {
	'focus': void;
	'message': { message: any; transfer?: ArrayBuffer[] };
	'execCommand': string;
	'did-load-resource':
	| { id: number; status: 401 | 404; path: string }
	| { id: number; status: 304; path: string; mime: string; mtime: number | undefined }
	| { id: number; status: 200; path: string; mime: string; data: any; etag: string | undefined; mtime: number | undefined }
	;
	'did-load-localhost': {
		id: string;
		origin: string;
		location: string | undefined;
	};
	'set-confirm-before-close': string;
	'set-context-menu-visible': { visible: boolean };
	'initial-scroll-position': number;
	'content': UpdateContentEvent;
	'set-title': string | undefined;
	'styles': {
		styles: WebviewStyles;
		activeTheme: string;
		themeId: string;
		themeLabel: string;
		reduceMotion: boolean;
		screenReader: boolean;
	};
	'find': { value: string; previous?: boolean };
	'find-stop': { clearSelection?: boolean };
};


export interface WebviewHostMessaging {
	postMessage<K extends keyof FromWebviewMessage>(channel: K, data: FromWebviewMessage[K], transfer?: []): void;

	onMessage<K extends keyof ToWebviewMessage>(channel: K, handler: (e: Event, data: ToWebviewMessage[K]) => void): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webviewService.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webviewService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter } from '../../../../base/common/event.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { WebviewThemeDataProvider } from './themeing.js';
import { IOverlayWebview, IWebview, IWebviewElement, IWebviewService, WebviewInitInfo } from './webview.js';
import { WebviewElement } from './webviewElement.js';
import { OverlayWebview } from './overlayWebview.js';

export class WebviewService extends Disposable implements IWebviewService {
	declare readonly _serviceBrand: undefined;

	protected readonly _webviewThemeDataProvider: WebviewThemeDataProvider;

	constructor(
		@IInstantiationService protected readonly _instantiationService: IInstantiationService,
	) {
		super();
		this._webviewThemeDataProvider = this._instantiationService.createInstance(WebviewThemeDataProvider);
	}

	private _activeWebview?: IWebview;

	public get activeWebview() { return this._activeWebview; }

	private _updateActiveWebview(value: IWebview | undefined) {
		if (value !== this._activeWebview) {
			this._activeWebview = value;
			this._onDidChangeActiveWebview.fire(value);
		}
	}

	private _webviews = new Set<IWebview>();

	public get webviews(): Iterable<IWebview> {
		return this._webviews.values();
	}

	private readonly _onDidChangeActiveWebview = this._register(new Emitter<IWebview | undefined>());
	public readonly onDidChangeActiveWebview = this._onDidChangeActiveWebview.event;

	createWebviewElement(initInfo: WebviewInitInfo): IWebviewElement {
		const webview = this._instantiationService.createInstance(WebviewElement, initInfo, this._webviewThemeDataProvider);
		this.registerNewWebview(webview);
		return webview;
	}

	createWebviewOverlay(initInfo: WebviewInitInfo): IOverlayWebview {
		const webview = this._instantiationService.createInstance(OverlayWebview, initInfo);
		this.registerNewWebview(webview);
		return webview;
	}

	protected registerNewWebview(webview: IWebview) {
		this._webviews.add(webview);

		const store = new DisposableStore();

		store.add(webview.onDidFocus(() => {
			this._updateActiveWebview(webview);
		}));

		const onBlur = () => {
			if (this._activeWebview === webview) {
				this._updateActiveWebview(undefined);
			}
		};

		store.add(webview.onDidBlur(onBlur));
		store.add(webview.onDidDispose(() => {
			onBlur();
			store.dispose();
			this._webviews.delete(webview);
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/webviewWindowDragMonitor.ts]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/webviewWindowDragMonitor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { CodeWindow } from '../../../../base/browser/window.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWebview } from './webview.js';

/**
 * Allows webviews to monitor when an element in the VS Code editor is being dragged/dropped.
 *
 * This is required since webview end up eating the drag event. VS Code needs to see this
 * event so it can handle editor element drag drop.
 */
export class WebviewWindowDragMonitor extends Disposable {
	constructor(targetWindow: CodeWindow, getWebview: () => IWebview | undefined) {
		super();

		const onDragStart = () => {
			getWebview()?.windowDidDragStart();
		};

		const onDragEnd = () => {
			getWebview()?.windowDidDragEnd();
		};

		this._register(DOM.addDisposableListener(targetWindow, DOM.EventType.DRAG_START, () => {
			onDragStart();
		}));

		this._register(DOM.addDisposableListener(targetWindow, DOM.EventType.DRAG_END, onDragEnd));

		this._register(DOM.addDisposableListener(targetWindow, DOM.EventType.MOUSE_MOVE, currentEvent => {
			if (currentEvent.buttons === 0) {
				onDragEnd();
			}
		}));

		this._register(DOM.addDisposableListener(targetWindow, DOM.EventType.DRAG, (event) => {
			if (event.shiftKey) {
				onDragEnd();
			} else {
				onDragStart();
			}
		}));

		this._register(DOM.addDisposableListener(targetWindow, DOM.EventType.DRAG_OVER, (event) => {
			if (event.shiftKey) {
				onDragEnd();
			} else {
				onDragStart();
			}
		}));

	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/webview/browser/pre/fake.html]---
Location: vscode-main/src/vs/workbench/contrib/webview/browser/pre/fake.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Fake</title>
</head>
<body>
</body>
</html>
```

--------------------------------------------------------------------------------

````
