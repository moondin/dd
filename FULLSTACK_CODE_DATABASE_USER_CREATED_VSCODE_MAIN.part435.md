---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 435
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 435 of 552)

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

---[FILE: src/vs/workbench/contrib/preferences/browser/preferences.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferences.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Disposable, DisposableStore, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isBoolean, isObject, isString } from '../../../../base/common/types.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor, isCodeEditor } from '../../../../editor/browser/editorBrowser.js';
import { EditorContributionInstantiation, registerEditorContribution } from '../../../../editor/browser/editorExtensions.js';
import { Context as SuggestContext } from '../../../../editor/contrib/suggest/browser/suggest.js';
import * as nls from '../../../../nls.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { Action2, MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry, ICommandService } from '../../../../platform/commands/common/commands.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { InputFocusedContext, IsMacNativeContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { KeybindingWeight, KeybindingsRegistry } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { IListService } from '../../../../platform/list/browser/listService.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { PICK_WORKSPACE_FOLDER_COMMAND_ID } from '../../../browser/actions/workspaceCommands.js';
import { EditorPaneDescriptor, IEditorPaneRegistry } from '../../../browser/editor.js';
import { resolveCommandsContext } from '../../../browser/parts/editor/editorCommandsContext.js';
import { RemoteNameContext, ResourceContextKey, WorkbenchStateContext } from '../../../common/contextkeys.js';
import { IWorkbenchContribution, WorkbenchPhase, registerWorkbenchContribution2 } from '../../../common/contributions.js';
import { EditorExtensions, IEditorFactoryRegistry, IEditorSerializer } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { IEditorGroup, IEditorGroupsService } from '../../../services/editor/common/editorGroupsService.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { KeybindingsEditorInput } from '../../../services/preferences/browser/keybindingsEditorInput.js';
import { DEFINE_KEYBINDING_EDITOR_CONTRIB_ID, IDefineKeybindingEditorContribution, IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { PreferencesEditorInput, SettingsEditor2Input } from '../../../services/preferences/common/preferencesEditorInput.js';
import { SettingsEditorModel } from '../../../services/preferences/common/preferencesModels.js';
import { CURRENT_PROFILE_CONTEXT, IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { ExplorerFolderContext, ExplorerRootContext } from '../../files/common/files.js';
import { CONTEXT_AI_SETTING_RESULTS_AVAILABLE, CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS, CONTEXT_KEYBINDINGS_SEARCH_HAS_VALUE, CONTEXT_KEYBINDING_FOCUS, CONTEXT_SETTINGS_EDITOR, CONTEXT_SETTINGS_JSON_EDITOR, CONTEXT_SETTINGS_ROW_FOCUS, CONTEXT_SETTINGS_SEARCH_FOCUS, CONTEXT_TOC_ROW_FOCUS, CONTEXT_WHEN_FOCUS, KEYBINDINGS_EDITOR_COMMAND_ACCEPT_WHEN, KEYBINDINGS_EDITOR_COMMAND_ADD, KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_HISTORY, KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, KEYBINDINGS_EDITOR_COMMAND_COPY, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND, KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND_TITLE, KEYBINDINGS_EDITOR_COMMAND_DEFINE, KEYBINDINGS_EDITOR_COMMAND_DEFINE_WHEN, KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS, KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS, KEYBINDINGS_EDITOR_COMMAND_REJECT_WHEN, KEYBINDINGS_EDITOR_COMMAND_REMOVE, KEYBINDINGS_EDITOR_COMMAND_RESET, KEYBINDINGS_EDITOR_COMMAND_SEARCH, KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR, KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE, KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS, KEYBINDINGS_EDITOR_SHOW_EXTENSION_KEYBINDINGS, KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS, REQUIRE_TRUSTED_WORKSPACE_SETTING_TAG, SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS, SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU, SETTINGS_EDITOR_COMMAND_TOGGLE_AI_SEARCH } from '../common/preferences.js';
import { PreferencesContribution } from '../common/preferencesContribution.js';
import { KeybindingsEditor } from './keybindingsEditor.js';
import { ConfigureLanguageBasedSettingsAction } from './preferencesActions.js';
import { PreferencesEditor } from './preferencesEditor.js';
import { preferencesOpenSettingsIcon } from './preferencesIcons.js';
import { IPreferencesRenderer, UserSettingsRenderer, WorkspaceSettingsRenderer } from './preferencesRenderers.js';
import { SettingsEditor2, SettingsFocusContext } from './settingsEditor2.js';

const SETTINGS_EDITOR_COMMAND_SEARCH = 'settings.action.search';

const SETTINGS_EDITOR_COMMAND_FOCUS_FILE = 'settings.action.focusSettingsFile';
const SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_FROM_SEARCH = 'settings.action.focusSettingsFromSearch';
const SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_LIST = 'settings.action.focusSettingsList';
const SETTINGS_EDITOR_COMMAND_FOCUS_TOC = 'settings.action.focusTOC';
const SETTINGS_EDITOR_COMMAND_FOCUS_CONTROL = 'settings.action.focusSettingControl';
const SETTINGS_EDITOR_COMMAND_FOCUS_UP = 'settings.action.focusLevelUp';

const SETTINGS_EDITOR_COMMAND_SWITCH_TO_JSON = 'settings.switchToJSON';
const SETTINGS_EDITOR_COMMAND_FILTER_ONLINE = 'settings.filterByOnline';
const SETTINGS_EDITOR_COMMAND_FILTER_UNTRUSTED = 'settings.filterUntrusted';

const SETTINGS_COMMAND_OPEN_SETTINGS = 'workbench.action.openSettings';
const SETTINGS_COMMAND_FILTER_TELEMETRY = 'settings.filterByTelemetry';

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		SettingsEditor2,
		SettingsEditor2.ID,
		nls.localize('settingsEditor2', "Settings Editor 2")
	),
	[
		new SyncDescriptor(SettingsEditor2Input)
	]
);

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		PreferencesEditor,
		PreferencesEditor.ID,
		nls.localize('preferencesEditor', "Preferences Editor")
	),
	[
		new SyncDescriptor(PreferencesEditorInput)
	]
);

class PreferencesEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(editorInput: EditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): EditorInput {
		return instantiationService.createInstance(PreferencesEditorInput);
	}
}

Registry.as<IEditorPaneRegistry>(EditorExtensions.EditorPane).registerEditorPane(
	EditorPaneDescriptor.create(
		KeybindingsEditor,
		KeybindingsEditor.ID,
		nls.localize('keybindingsEditor', "Keybindings Editor")
	),
	[
		new SyncDescriptor(KeybindingsEditorInput)
	]
);

class KeybindingsEditorInputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(editorInput: EditorInput): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): EditorInput {
		return instantiationService.createInstance(KeybindingsEditorInput);
	}
}

class SettingsEditor2InputSerializer implements IEditorSerializer {

	canSerialize(editorInput: EditorInput): boolean {
		return true;
	}

	serialize(input: SettingsEditor2Input): string {
		return '';
	}

	deserialize(instantiationService: IInstantiationService): SettingsEditor2Input {
		return instantiationService.createInstance(SettingsEditor2Input);
	}
}

Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(PreferencesEditorInput.ID, PreferencesEditorInputSerializer);
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(KeybindingsEditorInput.ID, KeybindingsEditorInputSerializer);
Registry.as<IEditorFactoryRegistry>(EditorExtensions.EditorFactory).registerEditorSerializer(SettingsEditor2Input.ID, SettingsEditor2InputSerializer);

const OPEN_USER_SETTINGS_UI_TITLE = nls.localize2('openSettings2', "Open Settings (UI)");
const OPEN_USER_SETTINGS_JSON_TITLE = nls.localize2('openUserSettingsJson', "Open User Settings (JSON)");
const OPEN_APPLICATION_SETTINGS_JSON_TITLE = nls.localize2('openApplicationSettingsJson', "Open Application Settings (JSON)");
const category = Categories.Preferences;

interface IOpenSettingsActionOptions {
	openToSide?: boolean;
	query?: string;
	revealSetting?: {
		key: string;
		edit?: boolean;
	};
	focusSearch?: boolean;
}

function sanitizeBoolean(arg: unknown): boolean | undefined {
	return isBoolean(arg) ? arg : undefined;
}

function sanitizeString(arg: unknown): string | undefined {
	return isString(arg) ? arg : undefined;
}

function sanitizeOpenSettingsArgs(args: any): IOpenSettingsActionOptions {
	if (!isObject(args)) {
		args = {};
	}

	let sanitizedObject: IOpenSettingsActionOptions = {
		focusSearch: sanitizeBoolean(args?.focusSearch),
		openToSide: sanitizeBoolean(args?.openToSide),
		query: sanitizeString(args?.query)
	};

	if (isString(args?.revealSetting?.key)) {
		sanitizedObject = {
			...sanitizedObject,
			revealSetting: {
				key: args.revealSetting.key,
				edit: sanitizeBoolean(args.revealSetting?.edit)
			}
		};
	}

	return sanitizedObject;
}

class PreferencesActionsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.preferencesActions';

	constructor(
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@ILabelService private readonly labelService: ILabelService,
		@IExtensionService private readonly extensionService: IExtensionService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();

		this.registerSettingsActions();
		this.registerKeybindingsActions();

		this.updatePreferencesEditorMenuItem();
		this._register(workspaceContextService.onDidChangeWorkbenchState(() => this.updatePreferencesEditorMenuItem()));
		this._register(workspaceContextService.onDidChangeWorkspaceFolders(() => this.updatePreferencesEditorMenuItemForWorkspaceFolders()));
	}

	private registerSettingsActions() {
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_COMMAND_OPEN_SETTINGS,
					title: {
						...nls.localize2('settings', "Settings"),
						mnemonicTitle: nls.localize({ key: 'miOpenSettings', comment: ['&& denotes a mnemonic'] }, "&&Settings"),
					},
					keybinding: {
						weight: KeybindingWeight.WorkbenchContrib,
						when: null,
						primary: KeyMod.CtrlCmd | KeyCode.Comma,
					},
					menu: [{
						id: MenuId.GlobalActivity,
						group: '2_configuration',
						order: 2
					}, {
						id: MenuId.MenubarPreferencesMenu,
						group: '2_configuration',
						order: 2
					}],
				});
			}
			run(accessor: ServicesAccessor, args: string | IOpenSettingsActionOptions) {
				// args takes a string for backcompat
				const opts = typeof args === 'string' ? { query: args } : sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openSettings(opts);
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openSettings2',
					title: nls.localize2('openSettings2', "Open Settings (UI)"),
					category,
					f1: true,
				});
			}
			run(accessor: ServicesAccessor, args: IOpenSettingsActionOptions) {
				args = sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openSettings({ jsonEditor: false, ...args });
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openSettingsJson',
					title: OPEN_USER_SETTINGS_JSON_TITLE,
					metadata: {
						description: nls.localize2('workbench.action.openSettingsJson.description', "Opens the JSON file containing the current user profile settings")
					},
					category,
					f1: true,
				});
			}
			run(accessor: ServicesAccessor, args: IOpenSettingsActionOptions) {
				args = sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openSettings({ jsonEditor: true, ...args });
			}
		}));

		const that = this;
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openApplicationSettingsJson',
					title: OPEN_APPLICATION_SETTINGS_JSON_TITLE,
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: ContextKeyExpr.notEquals(CURRENT_PROFILE_CONTEXT.key, that.userDataProfilesService.defaultProfile.id)
					}
				});
			}
			run(accessor: ServicesAccessor, args: IOpenSettingsActionOptions) {
				args = sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openApplicationSettings({ jsonEditor: true, ...args });
			}
		}));

		// Opens the User tab of the Settings editor
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openGlobalSettings',
					title: nls.localize2('openGlobalSettings', "Open User Settings"),
					category,
					f1: true,
				});
			}
			run(accessor: ServicesAccessor, args: IOpenSettingsActionOptions) {
				args = sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openUserSettings(args);
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openRawDefaultSettings',
					title: nls.localize2('openRawDefaultSettings', "Open Default Settings (JSON)"),
					category,
					f1: true,
				});
			}
			run(accessor: ServicesAccessor) {
				return accessor.get(IPreferencesService).openRawDefaultSettings();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: ConfigureLanguageBasedSettingsAction.ID,
					title: ConfigureLanguageBasedSettingsAction.LABEL,
					category,
					f1: true,
				});
			}
			run(accessor: ServicesAccessor) {
				return accessor.get(IInstantiationService).createInstance(ConfigureLanguageBasedSettingsAction, ConfigureLanguageBasedSettingsAction.ID, ConfigureLanguageBasedSettingsAction.LABEL.value).run();
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openWorkspaceSettings',
					title: nls.localize2('openWorkspaceSettings', "Open Workspace Settings"),
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: WorkbenchStateContext.notEqualsTo('empty')
					}
				});
			}
			run(accessor: ServicesAccessor, args?: string | IOpenSettingsActionOptions) {
				// Match the behaviour of workbench.action.openSettings
				args = typeof args === 'string' ? { query: args } : sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openWorkspaceSettings(args);
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openAccessibilitySettings',
					title: nls.localize2('openAccessibilitySettings', "Open Accessibility Settings"),
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: WorkbenchStateContext.notEqualsTo('empty')
					}
				});
			}
			async run(accessor: ServicesAccessor) {
				await accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@tag:accessibility' });
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openWorkspaceSettingsFile',
					title: nls.localize2('openWorkspaceSettingsFile', "Open Workspace Settings (JSON)"),
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: WorkbenchStateContext.notEqualsTo('empty')
					}
				});
			}
			run(accessor: ServicesAccessor, args?: IOpenSettingsActionOptions) {
				args = sanitizeOpenSettingsArgs(args);
				return accessor.get(IPreferencesService).openWorkspaceSettings({ jsonEditor: true, ...args });
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openFolderSettings',
					title: nls.localize2('openFolderSettings', "Open Folder Settings"),
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: WorkbenchStateContext.isEqualTo('workspace')
					}
				});
			}
			async run(accessor: ServicesAccessor, args?: IOpenSettingsActionOptions) {
				const commandService = accessor.get(ICommandService);
				const preferencesService = accessor.get(IPreferencesService);
				const workspaceFolder = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID);
				if (workspaceFolder) {
					args = sanitizeOpenSettingsArgs(args);
					await preferencesService.openFolderSettings({ folderUri: workspaceFolder.uri, ...args });
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openFolderSettingsFile',
					title: nls.localize2('openFolderSettingsFile', "Open Folder Settings (JSON)"),
					category,
					menu: {
						id: MenuId.CommandPalette,
						when: WorkbenchStateContext.isEqualTo('workspace')
					}
				});
			}
			async run(accessor: ServicesAccessor, args?: IOpenSettingsActionOptions) {
				const commandService = accessor.get(ICommandService);
				const preferencesService = accessor.get(IPreferencesService);
				const workspaceFolder = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID);
				if (workspaceFolder) {
					args = sanitizeOpenSettingsArgs(args);
					await preferencesService.openFolderSettings({ folderUri: workspaceFolder.uri, jsonEditor: true, ...args });
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: '_workbench.action.openFolderSettings',
					title: nls.localize('openFolderSettings', "Open Folder Settings"),
					category,
					menu: {
						id: MenuId.ExplorerContext,
						group: '2_workspace',
						order: 20,
						when: ContextKeyExpr.and(ExplorerRootContext, ExplorerFolderContext)
					}
				});
			}
			async run(accessor: ServicesAccessor, resource?: URI) {
				if (URI.isUri(resource)) {
					await accessor.get(IPreferencesService).openFolderSettings({ folderUri: resource });
				} else {
					const commandService = accessor.get(ICommandService);
					const preferencesService = accessor.get(IPreferencesService);
					const workspaceFolder = await commandService.executeCommand<IWorkspaceFolder>(PICK_WORKSPACE_FOLDER_COMMAND_ID);
					if (workspaceFolder) {
						await preferencesService.openFolderSettings({ folderUri: workspaceFolder.uri });
					}
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FILTER_ONLINE,
					title: nls.localize({ key: 'miOpenOnlineSettings', comment: ['&& denotes a mnemonic'] }, "&&Online Services Settings"),
					menu: {
						id: MenuId.MenubarPreferencesMenu,
						group: '3_settings',
						order: 1,
					}
				});
			}
			run(accessor: ServicesAccessor) {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof SettingsEditor2) {
					editorPane.focusSearch(`@tag:usesOnlineServices`);
				} else {
					accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@tag:usesOnlineServices' });
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_TOGGLE_AI_SEARCH,
					precondition: CONTEXT_SETTINGS_EDITOR,
					keybinding: {
						primary: KeyMod.CtrlCmd | KeyCode.KeyI,
						weight: KeybindingWeight.EditorContrib,
						when: CONTEXT_AI_SETTING_RESULTS_AVAILABLE
					},
					category,
					f1: true,
					title: nls.localize2('settings.toggleAiSearch', "Toggle AI Settings Search")
				});
			}
			run(accessor: ServicesAccessor) {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof SettingsEditor2) {
					editorPane.toggleAiSearch();
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FILTER_UNTRUSTED,
					title: nls.localize2('filterUntrusted', "Show untrusted workspace settings"),
				});
			}
			run(accessor: ServicesAccessor) {
				accessor.get(IPreferencesService).openWorkspaceSettings({ jsonEditor: false, query: `@tag:${REQUIRE_TRUSTED_WORKSPACE_SETTING_TAG}` });
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_COMMAND_FILTER_TELEMETRY,
					title: nls.localize({ key: 'miOpenTelemetrySettings', comment: ['&& denotes a mnemonic'] }, "&&Telemetry Settings")
				});
			}
			run(accessor: ServicesAccessor) {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof SettingsEditor2) {
					editorPane.focusSearch(`@tag:telemetry`);
				} else {
					accessor.get(IPreferencesService).openSettings({ jsonEditor: false, query: '@tag:telemetry' });
				}
			}
		}));

		this.registerSettingsEditorActions();

		this.extensionService.whenInstalledExtensionsRegistered()
			.then(() => {
				const remoteAuthority = this.environmentService.remoteAuthority;
				const hostLabel = this.labelService.getHostLabel(Schemas.vscodeRemote, remoteAuthority) || remoteAuthority;
				this._register(registerAction2(class extends Action2 {
					constructor() {
						super({
							id: 'workbench.action.openRemoteSettings',
							title: nls.localize2('openRemoteSettings', "Open Remote Settings ({0})", hostLabel),
							category,
							menu: {
								id: MenuId.CommandPalette,
								when: RemoteNameContext.notEqualsTo('')
							}
						});
					}
					run(accessor: ServicesAccessor, args?: IOpenSettingsActionOptions) {
						args = sanitizeOpenSettingsArgs(args);
						return accessor.get(IPreferencesService).openRemoteSettings(args);
					}
				}));
				this._register(registerAction2(class extends Action2 {
					constructor() {
						super({
							id: 'workbench.action.openRemoteSettingsFile',
							title: nls.localize2('openRemoteSettingsJSON', "Open Remote Settings (JSON) ({0})", hostLabel),
							category,
							menu: {
								id: MenuId.CommandPalette,
								when: RemoteNameContext.notEqualsTo('')
							}
						});
					}
					run(accessor: ServicesAccessor, args?: IOpenSettingsActionOptions) {
						args = sanitizeOpenSettingsArgs(args);
						return accessor.get(IPreferencesService).openRemoteSettings({ jsonEditor: true, ...args });
					}
				}));
			});
	}

	private registerSettingsEditorActions() {
		function getPreferencesEditor(accessor: ServicesAccessor): SettingsEditor2 | null {
			const activeEditorPane = accessor.get(IEditorService).activeEditorPane;
			if (activeEditorPane instanceof SettingsEditor2) {
				return activeEditorPane;
			}
			return null;
		}

		function settingsEditorFocusSearch(accessor: ServicesAccessor) {
			const preferencesEditor = getPreferencesEditor(accessor);
			preferencesEditor?.focusSearch();
		}

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_SEARCH,
					precondition: CONTEXT_SETTINGS_EDITOR,
					keybinding: {
						primary: KeyMod.CtrlCmd | KeyCode.KeyF,
						weight: KeybindingWeight.EditorContrib,
						when: null
					},
					category,
					f1: true,
					title: nls.localize2('settings.focusSearch', "Focus Settings Search")
				});
			}

			run(accessor: ServicesAccessor) { settingsEditorFocusSearch(accessor); }
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS,
					precondition: CONTEXT_SETTINGS_EDITOR,
					keybinding: {
						primary: KeyCode.Escape,
						weight: KeybindingWeight.EditorContrib,
						when: CONTEXT_SETTINGS_SEARCH_FOCUS
					},
					category,
					f1: true,
					title: nls.localize2('settings.clearResults', "Clear Settings Search Results")
				});
			}

			run(accessor: ServicesAccessor) {
				const preferencesEditor = getPreferencesEditor(accessor);
				preferencesEditor?.clearSearchResults();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_FILE,
					precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_SEARCH_FOCUS, SuggestContext.Visible.toNegated()),
					keybinding: {
						primary: KeyCode.DownArrow,
						weight: KeybindingWeight.EditorContrib,
						when: null
					},
					title: nls.localize('settings.focusFile', "Focus settings file")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				preferencesEditor?.focusSettings();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_FROM_SEARCH,
					precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_SEARCH_FOCUS, SuggestContext.Visible.toNegated()),
					keybinding: {
						primary: KeyCode.DownArrow,
						weight: KeybindingWeight.WorkbenchContrib,
						when: null
					},
					title: nls.localize('settings.focusFile', "Focus settings file")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				preferencesEditor?.focusSettings();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_SETTINGS_LIST,
					precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR, CONTEXT_TOC_ROW_FOCUS),
					keybinding: {
						primary: KeyCode.Enter,
						weight: KeybindingWeight.WorkbenchContrib,
						when: null
					},
					title: nls.localize('settings.focusSettingsList', "Focus settings list")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				if (preferencesEditor instanceof SettingsEditor2) {
					preferencesEditor.focusSettings();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_TOC,
					precondition: CONTEXT_SETTINGS_EDITOR,
					f1: true,
					keybinding: [
						{
							primary: KeyCode.LeftArrow,
							weight: KeybindingWeight.WorkbenchContrib,
							when: CONTEXT_SETTINGS_ROW_FOCUS
						}],
					category,
					title: nls.localize2('settings.focusSettingsTOC', "Focus Settings Table of Contents")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				if (!(preferencesEditor instanceof SettingsEditor2)) {
					return;
				}

				preferencesEditor.focusTOC();
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_CONTROL,
					precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR, CONTEXT_SETTINGS_ROW_FOCUS),
					keybinding: {
						primary: KeyCode.Enter,
						weight: KeybindingWeight.WorkbenchContrib,
					},
					title: nls.localize('settings.focusSettingControl', "Focus Setting Control")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				if (!(preferencesEditor instanceof SettingsEditor2)) {
					return;
				}

				const activeElement = preferencesEditor.getContainer()?.ownerDocument.activeElement;
				if (activeElement?.classList.contains('monaco-list')) {
					preferencesEditor.focusSettings(true);
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_SHOW_CONTEXT_MENU,
					precondition: CONTEXT_SETTINGS_EDITOR,
					keybinding: {
						primary: KeyMod.Shift | KeyCode.F9,
						weight: KeybindingWeight.WorkbenchContrib,
						when: null
					},
					f1: true,
					category,
					title: nls.localize2('settings.showContextMenu', "Show Setting Context Menu")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				if (preferencesEditor instanceof SettingsEditor2) {
					preferencesEditor.showContextMenu();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_FOCUS_UP,
					precondition: ContextKeyExpr.and(CONTEXT_SETTINGS_EDITOR, CONTEXT_SETTINGS_SEARCH_FOCUS.toNegated(), CONTEXT_SETTINGS_JSON_EDITOR.toNegated()),
					keybinding: {
						primary: KeyCode.Escape,
						weight: KeybindingWeight.WorkbenchContrib,
						when: null
					},
					f1: true,
					category,
					title: nls.localize2('settings.focusLevelUp', "Move Focus Up One Level")
				});
			}

			run(accessor: ServicesAccessor): void {
				const preferencesEditor = getPreferencesEditor(accessor);
				if (!(preferencesEditor instanceof SettingsEditor2)) {
					return;
				}

				if (preferencesEditor.currentFocusContext === SettingsFocusContext.SettingControl) {
					preferencesEditor.focusSettings();
				} else if (preferencesEditor.currentFocusContext === SettingsFocusContext.SettingTree) {
					preferencesEditor.focusTOC();
				} else if (preferencesEditor.currentFocusContext === SettingsFocusContext.TableOfContents) {
					preferencesEditor.focusSearch();
				}
			}
		}));
	}

	private registerKeybindingsActions() {
		const that = this;
		const category = nls.localize2('preferences', "Preferences");
		const id = 'workbench.action.openGlobalKeybindings';
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id,
					title: nls.localize2('openGlobalKeybindings', "Open Keyboard Shortcuts"),
					shortTitle: nls.localize('keyboardShortcuts', "Keyboard Shortcuts"),
					category,
					icon: preferencesOpenSettingsIcon,
					keybinding: {
						when: null,
						weight: KeybindingWeight.WorkbenchContrib,
						primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyS)
					},
					menu: [
						{ id: MenuId.CommandPalette },
						{
							id: MenuId.EditorTitle,
							when: ResourceContextKey.Resource.isEqualTo(that.userDataProfileService.currentProfile.keybindingsResource.toString()),
							group: 'navigation',
							order: 1,
						},
						{
							id: MenuId.GlobalActivity,
							group: '2_configuration',
							order: 4
						}
					]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const query = typeof args[0] === 'string' ? args[0] : undefined;
				const groupId = getEditorGroupFromArguments(accessor, args)?.id;
				return accessor.get(IPreferencesService).openGlobalKeybindingSettings(false, { query, groupId });
			}
		}));
		this._register(MenuRegistry.appendMenuItem(MenuId.MenubarPreferencesMenu, {
			command: {
				id,
				title: nls.localize('keyboardShortcuts', "Keyboard Shortcuts"),
			},
			group: '2_configuration',
			order: 4
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openDefaultKeybindingsFile',
					title: nls.localize2('openDefaultKeybindingsFile', "Open Default Keyboard Shortcuts (JSON)"),
					category,
					menu: { id: MenuId.CommandPalette }
				});
			}
			run(accessor: ServicesAccessor) {
				return accessor.get(IPreferencesService).openDefaultKeybindingsFile();
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: 'workbench.action.openGlobalKeybindingsFile',
					title: nls.localize2('openGlobalKeybindingsFile', "Open Keyboard Shortcuts (JSON)"),
					category,
					icon: preferencesOpenSettingsIcon,
					menu: [
						{ id: MenuId.CommandPalette },
						{
							id: MenuId.EditorTitle,
							when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
							group: 'navigation',
						}
					]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const groupId = getEditorGroupFromArguments(accessor, args)?.id;
				return accessor.get(IPreferencesService).openGlobalKeybindingSettings(true, { groupId });
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: KEYBINDINGS_EDITOR_SHOW_DEFAULT_KEYBINDINGS,
					title: nls.localize2('showDefaultKeybindings', "Show System Keybindings"),
					menu: [
						{
							id: MenuId.EditorTitle,
							when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
							group: '1_keyboard_preferences_actions'
						}
					]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const group = getEditorGroupFromArguments(accessor, args);
				const editorPane = group?.activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.search('@source:system');
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: KEYBINDINGS_EDITOR_SHOW_EXTENSION_KEYBINDINGS,
					title: nls.localize2('showExtensionKeybindings', "Show Extension Keybindings"),
					menu: [
						{
							id: MenuId.EditorTitle,
							when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
							group: '1_keyboard_preferences_actions'
						}
					]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const group = getEditorGroupFromArguments(accessor, args);
				const editorPane = group?.activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.search('@source:extension');
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: KEYBINDINGS_EDITOR_SHOW_USER_KEYBINDINGS,
					title: nls.localize2('showUserKeybindings', "Show User Keybindings"),
					menu: [
						{
							id: MenuId.EditorTitle,
							when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
							group: '1_keyboard_preferences_actions'
						}
					]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const group = getEditorGroupFromArguments(accessor, args);
				const editorPane = group?.activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.search('@source:user');
				}
			}
		}));
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_RESULTS,
					title: nls.localize('clear', "Clear Search Results"),
					keybinding: {
						weight: KeybindingWeight.WorkbenchContrib,
						when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS, CONTEXT_KEYBINDINGS_SEARCH_HAS_VALUE),
						primary: KeyCode.Escape,
					}
				});
			}
			run(accessor: ServicesAccessor) {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.clearSearchResults();
				}
			}
		}));

		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: KEYBINDINGS_EDITOR_COMMAND_CLEAR_SEARCH_HISTORY,
					title: nls.localize('clearHistory', "Clear Keyboard Shortcuts Search History"),
					category,
					menu: [
						{
							id: MenuId.CommandPalette,
							when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
						}
					]
				});
			}
			run(accessor: ServicesAccessor) {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.clearKeyboardShortcutSearchHistory();
				}
			}
		}));

		this.registerKeybindingEditorActions();
	}

	private registerKeybindingEditorActions(): void {
		const that = this;

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_DEFINE,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS, CONTEXT_WHEN_FOCUS.toNegated()),
			primary: KeyCode.Enter,
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.defineKeybinding(editorPane.activeKeybindingEntry!, false);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_ADD,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyA),
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.defineKeybinding(editorPane.activeKeybindingEntry!, true);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_DEFINE_WHEN,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyE),
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor && editorPane.activeKeybindingEntry!.keybindingItem.keybinding) {
					editorPane.defineWhenExpression(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_REMOVE,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS, InputFocusedContext.toNegated()),
			primary: KeyCode.Delete,
			mac: {
				primary: KeyMod.CtrlCmd | KeyCode.Backspace
			},
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.removeKeybinding(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_RESET,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: 0,
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.resetKeybinding(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_SEARCH,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
			primary: KeyMod.CtrlCmd | KeyCode.KeyF,
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.focusSearch();
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_RECORD_SEARCH_KEYS,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS),
			primary: KeyMod.Alt | KeyCode.KeyK,
			mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyK },
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.recordSearchKeys();
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_SORTBY_PRECEDENCE,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR),
			primary: KeyMod.Alt | KeyCode.KeyP,
			mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyP },
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.toggleSortByPrecedence();
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_SHOW_SIMILAR,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: 0,
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.showSimilarKeybindings(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_COPY,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS, CONTEXT_WHEN_FOCUS.negate()),
			primary: KeyMod.CtrlCmd | KeyCode.KeyC,
			handler: async (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					await editorPane.copyKeybinding(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: 0,
			handler: async (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					await editorPane.copyKeybindingCommand(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_COPY_COMMAND_TITLE,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDING_FOCUS),
			primary: 0,
			handler: async (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					await editorPane.copyKeybindingCommandTitle(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_FOCUS_KEYBINDINGS,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_KEYBINDINGS_SEARCH_FOCUS),
			primary: KeyMod.CtrlCmd | KeyCode.DownArrow,
			handler: (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.focusKeybindings();
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_REJECT_WHEN,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_WHEN_FOCUS, SuggestContext.Visible.toNegated()),
			primary: KeyCode.Escape,
			handler: async (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.rejectWhenExpression(editorPane.activeKeybindingEntry!);
				}
			}
		});

		KeybindingsRegistry.registerCommandAndKeybindingRule({
			id: KEYBINDINGS_EDITOR_COMMAND_ACCEPT_WHEN,
			weight: KeybindingWeight.WorkbenchContrib,
			when: ContextKeyExpr.and(CONTEXT_KEYBINDINGS_EDITOR, CONTEXT_WHEN_FOCUS, SuggestContext.Visible.toNegated()),
			primary: KeyCode.Enter,
			handler: async (accessor, args: unknown) => {
				const editorPane = accessor.get(IEditorService).activeEditorPane;
				if (editorPane instanceof KeybindingsEditor) {
					editorPane.acceptWhenExpression(editorPane.activeKeybindingEntry!);
				}
			}
		});

		const profileScopedActionDisposables = this._register(new DisposableStore());
		const registerProfileScopedActions = () => {
			profileScopedActionDisposables.clear();
			profileScopedActionDisposables.add(registerAction2(class DefineKeybindingAction extends Action2 {
				constructor() {
					const when = ResourceContextKey.Resource.isEqualTo(that.userDataProfileService.currentProfile.keybindingsResource.toString());
					super({
						id: 'editor.action.defineKeybinding',
						title: nls.localize2('defineKeybinding.start', "Define Keybinding"),
						f1: true,
						precondition: when,
						keybinding: {
							weight: KeybindingWeight.WorkbenchContrib,
							when,
							primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyCode.KeyK)
						},
						menu: {
							id: MenuId.EditorContent,
							when,
						}
					});
				}

				async run(accessor: ServicesAccessor): Promise<void> {
					const codeEditor = accessor.get(IEditorService).activeTextEditorControl;
					if (isCodeEditor(codeEditor)) {
						codeEditor.getContribution<IDefineKeybindingEditorContribution>(DEFINE_KEYBINDING_EDITOR_CONTRIB_ID)?.showDefineKeybindingWidget();
					}
				}
			}));
		};

		registerProfileScopedActions();
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(() => registerProfileScopedActions()));
	}

	private updatePreferencesEditorMenuItem() {
		const commandId = '_workbench.openWorkspaceSettingsEditor';
		if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.WORKSPACE && !CommandsRegistry.getCommand(commandId)) {
			CommandsRegistry.registerCommand(commandId, () => this.preferencesService.openWorkspaceSettings({ jsonEditor: false }));
			MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
				command: {
					id: commandId,
					title: OPEN_USER_SETTINGS_UI_TITLE,
					icon: preferencesOpenSettingsIcon
				},
				when: ContextKeyExpr.and(ResourceContextKey.Resource.isEqualTo(this.preferencesService.workspaceSettingsResource!.toString()), WorkbenchStateContext.isEqualTo('workspace'), ContextKeyExpr.not('isInDiffEditor')),
				group: 'navigation',
				order: 1
			});
		}
		this.updatePreferencesEditorMenuItemForWorkspaceFolders();
	}

	private updatePreferencesEditorMenuItemForWorkspaceFolders() {
		for (const folder of this.workspaceContextService.getWorkspace().folders) {
			const commandId = `_workbench.openFolderSettings.${folder.uri.toString()}`;
			if (!CommandsRegistry.getCommand(commandId)) {
				CommandsRegistry.registerCommand(commandId, (accessor: ServicesAccessor, ...args: unknown[]) => {
					const groupId = getEditorGroupFromArguments(accessor, args)?.id;
					if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.FOLDER) {
						return this.preferencesService.openWorkspaceSettings({ jsonEditor: false, groupId });
					} else {
						return this.preferencesService.openFolderSettings({ folderUri: folder.uri, jsonEditor: false, groupId });
					}
				});
				MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
					command: {
						id: commandId,
						title: OPEN_USER_SETTINGS_UI_TITLE,
						icon: preferencesOpenSettingsIcon
					},
					when: ContextKeyExpr.and(ResourceContextKey.Resource.isEqualTo(this.preferencesService.getFolderSettingsResource(folder.uri)!.toString()), ContextKeyExpr.not('isInDiffEditor')),
					group: 'navigation',
					order: 1
				});
			}
		}
	}
}

class SettingsEditorTitleContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.settingsEditorTitleBarActions';

	constructor(
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();
		this.registerSettingsEditorTitleActions();
	}

	private registerSettingsEditorTitleActions() {
		const registerOpenUserSettingsEditorFromJsonActionDisposables = this._register(new MutableDisposable());
		const registerOpenUserSettingsEditorFromJsonAction = () => {
			const openUserSettingsEditorWhen = ContextKeyExpr.and(
				CONTEXT_SETTINGS_EDITOR.toNegated(),
				ContextKeyExpr.or(
					ResourceContextKey.Resource.isEqualTo(this.userDataProfileService.currentProfile.settingsResource.toString()),
					ResourceContextKey.Resource.isEqualTo(this.userDataProfilesService.defaultProfile.settingsResource.toString())),
				ContextKeyExpr.not('isInDiffEditor'));
			registerOpenUserSettingsEditorFromJsonActionDisposables.clear();
			registerOpenUserSettingsEditorFromJsonActionDisposables.value = registerAction2(class extends Action2 {
				constructor() {
					super({
						id: '_workbench.openUserSettingsEditor',
						title: OPEN_USER_SETTINGS_UI_TITLE,
						icon: preferencesOpenSettingsIcon,
						menu: [{
							id: MenuId.EditorTitle,
							when: openUserSettingsEditorWhen,
							group: 'navigation',
							order: 1
						}]
					});
				}
				run(accessor: ServicesAccessor, ...args: unknown[]) {
					const sanitizedArgs = sanitizeOpenSettingsArgs(args[0]);
					const groupId = getEditorGroupFromArguments(accessor, args)?.id;
					return accessor.get(IPreferencesService).openUserSettings({ jsonEditor: false, ...sanitizedArgs, groupId });
				}
			});
		};

		registerOpenUserSettingsEditorFromJsonAction();
		this._register(this.userDataProfileService.onDidChangeCurrentProfile(() => {
			// Force the action to check the context again.
			registerOpenUserSettingsEditorFromJsonAction();
		}));

		const openSettingsJsonWhen = ContextKeyExpr.and(CONTEXT_SETTINGS_JSON_EDITOR.toNegated(), CONTEXT_SETTINGS_EDITOR);
		this._register(registerAction2(class extends Action2 {
			constructor() {
				super({
					id: SETTINGS_EDITOR_COMMAND_SWITCH_TO_JSON,
					title: nls.localize2('openSettingsJson', "Open Settings (JSON)"),
					icon: preferencesOpenSettingsIcon,
					menu: [{
						id: MenuId.EditorTitle,
						when: openSettingsJsonWhen,
						group: 'navigation',
						order: 1
					}]
				});
			}
			run(accessor: ServicesAccessor, ...args: unknown[]) {
				const group = getEditorGroupFromArguments(accessor, args);
				const editorPane = group?.activeEditorPane;
				if (editorPane instanceof SettingsEditor2) {
					return editorPane.switchToSettingsFile();
				}
				return null;
			}
		}));
	}
}

class SettingsEditorContribution extends Disposable {
	static readonly ID: string = 'editor.contrib.settings';

	private currentRenderer: IPreferencesRenderer | undefined;
	private readonly disposables = this._register(new DisposableStore());

	constructor(
		private readonly editor: ICodeEditor,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IPreferencesService private readonly preferencesService: IPreferencesService,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService
	) {
		super();
		this._createPreferencesRenderer();
		this._register(this.editor.onDidChangeModel(e => this._createPreferencesRenderer()));
		this._register(this.workspaceContextService.onDidChangeWorkbenchState(() => this._createPreferencesRenderer()));
	}

	private async _createPreferencesRenderer(): Promise<void> {
		this.disposables.clear();
		this.currentRenderer = undefined;

		const model = this.editor.getModel();
		if (model && /\.(json|code-workspace)$/.test(model.uri.path)) {
			// Fast check: the preferences renderer can only appear
			// in settings files or workspace files
			const settingsModel = await this.preferencesService.createPreferencesEditorModel(model.uri);
			if (settingsModel instanceof SettingsEditorModel && this.editor.getModel()) {
				this.disposables.add(settingsModel);
				switch (settingsModel.configurationTarget) {
					case ConfigurationTarget.WORKSPACE:
						this.currentRenderer = this.disposables.add(this.instantiationService.createInstance(WorkspaceSettingsRenderer, this.editor, settingsModel));
						break;
					default:
						this.currentRenderer = this.disposables.add(this.instantiationService.createInstance(UserSettingsRenderer, this.editor, settingsModel));
						break;
				}
			}

			this.currentRenderer?.render();
		}
	}
}


function getEditorGroupFromArguments(accessor: ServicesAccessor, args: unknown[]): IEditorGroup | undefined {
	const context = resolveCommandsContext(args, accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IListService));
	return context.groupedEditors[0]?.group;
}

registerWorkbenchContribution2(PreferencesActionsContribution.ID, PreferencesActionsContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(PreferencesContribution.ID, PreferencesContribution, WorkbenchPhase.BlockStartup);
registerWorkbenchContribution2(SettingsEditorTitleContribution.ID, SettingsEditorTitleContribution, WorkbenchPhase.AfterRestored);

registerEditorContribution(SettingsEditorContribution.ID, SettingsEditorContribution, EditorContributionInstantiation.AfterFirstRender);

// Preferences menu

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	title: nls.localize({ key: 'miPreferences', comment: ['&& denotes a mnemonic'] }, "&&Preferences"),
	submenu: MenuId.MenubarPreferencesMenu,
	group: '5_autosave',
	order: 2,
	when: IsMacNativeContext.toNegated() // on macOS native the preferences menu is separate under the application menu
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Action } from '../../../../base/common/actions.js';
import { URI } from '../../../../base/common/uri.js';
import { getIconClasses } from '../../../../editor/common/services/getIconClasses.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import * as nls from '../../../../nls.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IPreferencesService } from '../../../services/preferences/common/preferences.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { Extensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { EditorExtensionsRegistry } from '../../../../editor/browser/editorExtensions.js';
import { MenuId, MenuRegistry, isIMenuItem } from '../../../../platform/actions/common/actions.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { isLocalizedString } from '../../../../platform/action/common/action.js';
import { IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';

export class ConfigureLanguageBasedSettingsAction extends Action {

	static readonly ID = 'workbench.action.configureLanguageBasedSettings';
	static readonly LABEL = nls.localize2('configureLanguageBasedSettings', "Configure Language Specific Settings...");

	constructor(
		id: string,
		label: string,
		@IModelService private readonly modelService: IModelService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IPreferencesService private readonly preferencesService: IPreferencesService
	) {
		super(id, label);
	}

	override async run(): Promise<void> {
		const languages = this.languageService.getSortedRegisteredLanguageNames();
		const picks: IQuickPickItem[] = languages.map(({ languageName, languageId }): IQuickPickItem => {
			const description: string = nls.localize('languageDescriptionConfigured', "({0})", languageId);
			// construct a fake resource to be able to show nice icons if any
			let fakeResource: URI | undefined;
			const extensions = this.languageService.getExtensions(languageId);
			if (extensions.length) {
				fakeResource = URI.file(extensions[0]);
			} else {
				const filenames = this.languageService.getFilenames(languageId);
				if (filenames.length) {
					fakeResource = URI.file(filenames[0]);
				}
			}
			return {
				label: languageName,
				iconClasses: getIconClasses(this.modelService, this.languageService, fakeResource),
				description
			};
		});

		await this.quickInputService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language") })
			.then(pick => {
				if (pick) {
					const languageId = this.languageService.getLanguageIdByLanguageName(pick.label);
					if (typeof languageId === 'string') {
						return this.preferencesService.openLanguageSpecificSettings(languageId);
					}
				}
				return undefined;
			});

	}
}

// Register a command that gets all settings
CommandsRegistry.registerCommand({
	id: '_getAllSettings',
	handler: () => {
		const configRegistry = Registry.as<IConfigurationRegistry>(Extensions.Configuration);
		const allSettings = configRegistry.getConfigurationProperties();
		return allSettings;
	}
});

//#region --- Register a command to get all actions from the command palette
CommandsRegistry.registerCommand('_getAllCommands', function (accessor, filterByPrecondition?: boolean) {
	const keybindingService = accessor.get(IKeybindingService);
	const contextKeyService = accessor.get(IContextKeyService);
	const actions: { command: string; label: string; keybinding: string; description?: string; precondition?: string }[] = [];
	for (const editorAction of EditorExtensionsRegistry.getEditorActions()) {
		const keybinding = keybindingService.lookupKeybinding(editorAction.id);
		if (filterByPrecondition && !contextKeyService.contextMatchesRules(editorAction.precondition)) {
			continue;
		}
		actions.push({
			command: editorAction.id,
			label: editorAction.label,
			description: isLocalizedString(editorAction.metadata?.description) ? editorAction.metadata.description.value : editorAction.metadata?.description,
			precondition: editorAction.precondition?.serialize(),
			keybinding: keybinding?.getLabel() ?? 'Not set'
		});
	}
	for (const menuItem of MenuRegistry.getMenuItems(MenuId.CommandPalette)) {
		if (isIMenuItem(menuItem)) {
			if (filterByPrecondition && !contextKeyService.contextMatchesRules(menuItem.when)) {
				continue;
			}
			const title = typeof menuItem.command.title === 'string' ? menuItem.command.title : menuItem.command.title.value;
			const category = menuItem.command.category ? typeof menuItem.command.category === 'string' ? menuItem.command.category : menuItem.command.category.value : undefined;
			const label = category ? `${category}: ${title}` : title;
			const description = isLocalizedString(menuItem.command.metadata?.description) ? menuItem.command.metadata.description.value : menuItem.command.metadata?.description;
			const keybinding = keybindingService.lookupKeybinding(menuItem.command.id);
			actions.push({
				command: menuItem.command.id,
				label,
				description,
				precondition: menuItem.when?.serialize(),
				keybinding: keybinding?.getLabel() ?? 'Not set'
			});
		}
	}

	return actions;
});
//#endregion
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesEditor.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesEditor.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/preferencesEditor.css';
import * as DOM from '../../../../base/browser/dom.js';
import { localize } from '../../../../nls.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { Event } from '../../../../base/common/event.js';
import { getInputBoxStyle } from '../../../../platform/theme/browser/defaultStyles.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { EditorPane } from '../../../browser/parts/editor/editorPane.js';
import { IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { CONTEXT_PREFERENCES_SEARCH_FOCUS } from '../common/preferences.js';
import { settingsTextInputBorder } from '../common/settingsEditorColorRegistry.js';
import { SearchWidget } from './preferencesWidgets.js';
import { ActionBar, ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IPreferencesEditorPaneRegistry, Extensions, IPreferencesEditorPaneDescriptor, IPreferencesEditorPane } from './preferencesEditorRegistry.js';
import { Action } from '../../../../base/common/actions.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IEditorOptions } from '../../../../platform/editor/common/editor.js';
import { IEditorOpenContext } from '../../../common/editor.js';
import { EditorInput } from '../../../common/editor/editorInput.js';
import { MutableDisposable } from '../../../../base/common/lifecycle.js';

class PreferenceTabAction extends Action {
	constructor(readonly descriptor: IPreferencesEditorPaneDescriptor, actionCallback: () => void) {
		super(descriptor.id, descriptor.title, '', true, actionCallback);
	}
}

export class PreferencesEditor extends EditorPane {

	static readonly ID: string = 'workbench.editor.preferences';

	private readonly editorPanesRegistry = Registry.as<IPreferencesEditorPaneRegistry>(Extensions.PreferencesEditorPane);

	private readonly element: HTMLElement;
	private readonly bodyElement: HTMLElement;
	private readonly searchWidget: SearchWidget;
	private readonly preferencesTabActionBar: ActionBar;
	private readonly preferencesTabActions: PreferenceTabAction[] = [];
	private readonly preferencesEditorPane = this._register(new MutableDisposable<IPreferencesEditorPane>());

	private readonly searchFocusContextKey: IContextKey<boolean>;

	private dimension: DOM.Dimension | undefined;

	constructor(
		group: IEditorGroup,
		@ITelemetryService telemetryService: ITelemetryService,
		@IThemeService themeService: IThemeService,
		@IStorageService storageService: IStorageService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
	) {
		super(PreferencesEditor.ID, group, telemetryService, themeService, storageService);

		this.searchFocusContextKey = CONTEXT_PREFERENCES_SEARCH_FOCUS.bindTo(contextKeyService);

		this.element = DOM.$('.preferences-editor');
		const headerContainer = DOM.append(this.element, DOM.$('.preferences-editor-header'));

		const searchContainer = DOM.append(headerContainer, DOM.$('.search-container'));
		this.searchWidget = this._register(this.instantiationService.createInstance(SearchWidget, searchContainer, {
			focusKey: this.searchFocusContextKey,
			inputBoxStyles: getInputBoxStyle({
				inputBorder: settingsTextInputBorder
			})
		}));
		this._register(Event.debounce(this.searchWidget.onDidChange, () => undefined, 300)(() => {
			this.preferencesEditorPane.value?.search(this.searchWidget.getValue());
		}));

		const preferencesTabsContainer = DOM.append(headerContainer, DOM.$('.preferences-tabs-container'));
		this.preferencesTabActionBar = this._register(new ActionBar(preferencesTabsContainer, {
			orientation: ActionsOrientation.HORIZONTAL,
			focusOnlyEnabledItems: true,
			ariaLabel: localize('preferencesTabSwitcherBarAriaLabel', "Preferences Tab Switcher"),
			ariaRole: 'tablist',
		}));
		this.onDidChangePreferencesEditorPane(this.editorPanesRegistry.getPreferencesEditorPanes(), []);
		this._register(this.editorPanesRegistry.onDidRegisterPreferencesEditorPanes(descriptors => this.onDidChangePreferencesEditorPane(descriptors, [])));
		this._register(this.editorPanesRegistry.onDidDeregisterPreferencesEditorPanes(descriptors => this.onDidChangePreferencesEditorPane([], descriptors)));

		this.bodyElement = DOM.append(this.element, DOM.$('.preferences-editor-body'));
	}

	protected createEditor(parent: HTMLElement): void {
		DOM.append(parent, this.element);
	}

	layout(dimension: DOM.Dimension): void {
		this.dimension = dimension;
		this.searchWidget.layout(dimension);
		this.searchWidget.inputBox.inputElement.style.paddingRight = `12px`;

		this.preferencesEditorPane.value?.layout(new DOM.Dimension(this.bodyElement.clientWidth, dimension.height - 87 /* header height */));
	}

	override async setInput(input: EditorInput, options: IEditorOptions | undefined, context: IEditorOpenContext, token: CancellationToken): Promise<void> {
		await super.setInput(input, options, context, token);
		if (this.preferencesTabActions.length) {
			this.onDidSelectPreferencesEditorPane(this.preferencesTabActions[0].id);
		}
	}

	private onDidChangePreferencesEditorPane(toAdd: readonly IPreferencesEditorPaneDescriptor[], toRemove: readonly IPreferencesEditorPaneDescriptor[]): void {
		for (const desc of toRemove) {
			const index = this.preferencesTabActions.findIndex(action => action.id === desc.id);
			if (index !== -1) {
				this.preferencesTabActionBar.pull(index);
				this.preferencesTabActions[index].dispose();
				this.preferencesTabActions.splice(index, 1);
			}
		}
		if (toAdd.length > 0) {
			const all = this.editorPanesRegistry.getPreferencesEditorPanes();
			for (const desc of toAdd) {
				const index = all.findIndex(action => action.id === desc.id);
				if (index !== -1) {
					const action = new PreferenceTabAction(desc, () => this.onDidSelectPreferencesEditorPane(desc.id));
					this.preferencesTabActions.splice(index, 0, action);
					this.preferencesTabActionBar.push(action, { index });
				}
			}
		}
	}

	private onDidSelectPreferencesEditorPane(id: string): void {
		let selectedAction: PreferenceTabAction | undefined;
		for (const action of this.preferencesTabActions) {
			if (action.id === id) {
				action.checked = true;
				selectedAction = action;
			} else {
				action.checked = false;
			}
		}

		if (selectedAction) {
			this.searchWidget.inputBox.setPlaceHolder(localize('FullTextSearchPlaceholder', "Search {0}", selectedAction.descriptor.title));
			this.searchWidget.inputBox.setAriaLabel(localize('FullTextSearchPlaceholder', "Search {0}", selectedAction.descriptor.title));
		}

		this.renderBody(selectedAction?.descriptor);

		if (this.dimension) {
			this.layout(this.dimension);
		}
	}

	private renderBody(descriptor?: IPreferencesEditorPaneDescriptor): void {
		this.preferencesEditorPane.value = undefined;
		DOM.clearNode(this.bodyElement);

		if (descriptor) {
			const editorPane = this.instantiationService.createInstance<IPreferencesEditorPane>(descriptor.ctorDescriptor.ctor);
			this.preferencesEditorPane.value = editorPane;
			this.bodyElement.appendChild(editorPane.getDomNode());
		}
	}

	override dispose(): void {
		super.dispose();
		this.preferencesTabActions.forEach(action => action.dispose());
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesEditorRegistry.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesEditorRegistry.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import * as DOM from '../../../../base/browser/dom.js';
import { Event, Emitter } from '../../../../base/common/event.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

export namespace Extensions {
	export const PreferencesEditorPane = 'workbench.registry.preferences.editorPanes';
}

export interface IPreferencesEditorPane extends IDisposable {

	getDomNode(): HTMLElement;

	layout(dimension: DOM.Dimension): void;

	search(text: string): void;

}

export interface IPreferencesEditorPaneDescriptor {

	/**
	 * The id of the view container
	 */
	readonly id: string;

	/**
	 * The title of the view container
	 */
	readonly title: string;

	/**
	 * Icon representation of the View container
	 */
	readonly icon?: ThemeIcon | URI;

	/**
	 * Order of the view container.
	 */
	readonly order: number;

	/**
	 * IViewPaneContainer Ctor to instantiate
	 */
	readonly ctorDescriptor: SyncDescriptor<IPreferencesEditorPane>;

	/**
	 * Storage id to use to store the view container state.
	 * If not provided, it will be derived.
	 */
	readonly storageId?: string;
}

export interface IPreferencesEditorPaneRegistry {
	readonly onDidRegisterPreferencesEditorPanes: Event<IPreferencesEditorPaneDescriptor[]>;
	readonly onDidDeregisterPreferencesEditorPanes: Event<IPreferencesEditorPaneDescriptor[]>;

	registerPreferencesEditorPane(descriptor: IPreferencesEditorPaneDescriptor): IDisposable;

	getPreferencesEditorPanes(): readonly IPreferencesEditorPaneDescriptor[];
}

class PreferencesEditorPaneRegistryImpl extends Disposable implements IPreferencesEditorPaneRegistry {

	private readonly descriptors = new Map<string, IPreferencesEditorPaneDescriptor>();

	private readonly _onDidRegisterPreferencesEditorPanes = this._register(new Emitter<IPreferencesEditorPaneDescriptor[]>());
	readonly onDidRegisterPreferencesEditorPanes = this._onDidRegisterPreferencesEditorPanes.event;

	private readonly _onDidDeregisterPreferencesEditorPanes = this._register(new Emitter<IPreferencesEditorPaneDescriptor[]>());
	readonly onDidDeregisterPreferencesEditorPanes = this._onDidDeregisterPreferencesEditorPanes.event;

	constructor() {
		super();
	}

	registerPreferencesEditorPane(descriptor: IPreferencesEditorPaneDescriptor): IDisposable {
		if (this.descriptors.has(descriptor.id)) {
			throw new Error(`PreferencesEditorPane with id ${descriptor.id} already registered`);
		}
		this.descriptors.set(descriptor.id, descriptor);
		this._onDidRegisterPreferencesEditorPanes.fire([descriptor]);
		return {
			dispose: () => {
				if (this.descriptors.delete(descriptor.id)) {
					this._onDidDeregisterPreferencesEditorPanes.fire([descriptor]);
				}
			}
		};
	}

	getPreferencesEditorPanes(): readonly IPreferencesEditorPaneDescriptor[] {
		return [...this.descriptors.values()].sort((a, b) => a.order - b.order);
	}

}

Registry.add(Extensions.PreferencesEditorPane, new PreferencesEditorPaneRegistryImpl());
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesIcons.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesIcons.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { localize } from '../../../../nls.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';

export const settingsScopeDropDownIcon = registerIcon('settings-folder-dropdown', Codicon.chevronDown, localize('settingsScopeDropDownIcon', 'Icon for the folder dropdown button in the split JSON Settings editor.'));
export const settingsMoreActionIcon = registerIcon('settings-more-action', Codicon.gear, localize('settingsMoreActionIcon', 'Icon for the \'more actions\' action in the Settings UI.'));

export const keybindingsRecordKeysIcon = registerIcon('keybindings-record-keys', Codicon.recordKeys, localize('keybindingsRecordKeysIcon', 'Icon for the \'record keys\' action in the keybinding UI.'));
export const keybindingsSortIcon = registerIcon('keybindings-sort', Codicon.sortPrecedence, localize('keybindingsSortIcon', 'Icon for the \'sort by precedence\' toggle in the keybinding UI.'));

export const keybindingsEditIcon = registerIcon('keybindings-edit', Codicon.edit, localize('keybindingsEditIcon', 'Icon for the edit action in the keybinding UI.'));
export const keybindingsAddIcon = registerIcon('keybindings-add', Codicon.add, localize('keybindingsAddIcon', 'Icon for the add action in the keybinding UI.'));

export const settingsEditIcon = registerIcon('settings-edit', Codicon.edit, localize('settingsEditIcon', 'Icon for the edit action in the Settings UI.'));

export const settingsRemoveIcon = registerIcon('settings-remove', Codicon.close, localize('settingsRemoveIcon', 'Icon for the remove action in the Settings UI.'));
export const settingsDiscardIcon = registerIcon('settings-discard', Codicon.discard, localize('preferencesDiscardIcon', 'Icon for the discard action in the Settings UI.'));

export const preferencesClearInputIcon = registerIcon('preferences-clear-input', Codicon.clearAll, localize('preferencesClearInput', 'Icon for clear input in the Settings and keybinding UI.'));
export const preferencesAiResultsIcon = registerIcon('preferences-ai-results', Codicon.sparkle, localize('preferencesAiResults', 'Icon for showing AI results in the Settings UI.'));
export const preferencesFilterIcon = registerIcon('preferences-filter', Codicon.filter, localize('settingsFilter', 'Icon for the button that suggests filters for the Settings UI.'));
export const preferencesOpenSettingsIcon = registerIcon('preferences-open-settings', Codicon.goToFile, localize('preferencesOpenSettings', 'Icon for open settings commands.'));
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesRenderers.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesRenderers.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { EventHelper, getDomNodePagePosition } from '../../../../base/browser/dom.js';
import { IAction, SubmenuAction } from '../../../../base/common/actions.js';
import { Delayer } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { ResourceMap } from '../../../../base/common/map.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { EditorOption } from '../../../../editor/common/config/editorOptions.js';
import { Position } from '../../../../editor/common/core/position.js';
import { IRange, Range } from '../../../../editor/common/core/range.js';
import { Selection } from '../../../../editor/common/core/selection.js';
import { ICursorPositionChangedEvent } from '../../../../editor/common/cursorEvents.js';
import * as editorCommon from '../../../../editor/common/editorCommon.js';
import * as languages from '../../../../editor/common/languages.js';
import { IModelDeltaDecoration, ITextModel, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { ModelDecorationOptions } from '../../../../editor/common/model/textModel.js';
import { ILanguageFeaturesService } from '../../../../editor/common/services/languageFeatures.js';
import { CodeActionKind } from '../../../../editor/contrib/codeAction/common/types.js';
import * as nls from '../../../../nls.js';
import { ConfigurationTarget, IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { Extensions as ConfigurationExtensions, ConfigurationScope, IConfigurationPropertySchema, IConfigurationRegistry, IRegisteredConfigurationPropertySchema, OVERRIDE_PROPERTY_REGEX, overrideIdentifiersFromKey } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IMarkerData, IMarkerService, MarkerSeverity, MarkerTag } from '../../../../platform/markers/common/markers.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { IUserDataProfilesService } from '../../../../platform/userDataProfile/common/userDataProfile.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IWorkspaceTrustManagementService } from '../../../../platform/workspace/common/workspaceTrust.js';
import { RangeHighlightDecorations } from '../../../browser/codeeditor.js';
import { settingsEditIcon } from './preferencesIcons.js';
import { EditPreferenceWidget } from './preferencesWidgets.js';
import { APPLICATION_SCOPES, APPLY_ALL_PROFILES_SETTING, IWorkbenchConfigurationService } from '../../../services/configuration/common/configuration.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { IPreferencesEditorModel, IPreferencesService, ISetting, ISettingsEditorModel, ISettingsGroup } from '../../../services/preferences/common/preferences.js';
import { DefaultSettingsEditorModel, SettingsEditorModel, WorkspaceConfigurationEditorModel } from '../../../services/preferences/common/preferencesModels.js';
import { IUserDataProfileService } from '../../../services/userDataProfile/common/userDataProfile.js';
import { EXPERIMENTAL_INDICATOR_DESCRIPTION, PREVIEW_INDICATOR_DESCRIPTION } from '../common/preferences.js';
import { mcpConfigurationSection } from '../../mcp/common/mcpConfiguration.js';
import { McpCommandIds } from '../../mcp/common/mcpCommandIds.js';

export interface IPreferencesRenderer extends IDisposable {
	render(): void;
	updatePreference(key: string, value: unknown, source: ISetting): void;
	focusPreference(setting: ISetting): void;
	clearFocus(setting: ISetting): void;
	editPreference(setting: ISetting): boolean;
}

export class UserSettingsRenderer extends Disposable implements IPreferencesRenderer {

	private settingHighlighter: SettingHighlighter;
	private editSettingActionRenderer: EditSettingRenderer;
	private modelChangeDelayer: Delayer<void> = new Delayer<void>(200);
	private associatedPreferencesModel!: IPreferencesEditorModel<ISetting>;

	private unsupportedSettingsRenderer: UnsupportedSettingsRenderer;
	private mcpSettingsRenderer: McpSettingsRenderer;

	constructor(protected editor: ICodeEditor, readonly preferencesModel: SettingsEditorModel,
		@IPreferencesService protected preferencesService: IPreferencesService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService protected instantiationService: IInstantiationService
	) {
		super();
		this.settingHighlighter = this._register(instantiationService.createInstance(SettingHighlighter, editor));
		this.editSettingActionRenderer = this._register(this.instantiationService.createInstance(EditSettingRenderer, this.editor, this.preferencesModel, this.settingHighlighter));
		this._register(this.editSettingActionRenderer.onUpdateSetting(({ key, value, source }) => this.updatePreference(key, value, source)));
		this._register(this.editor.getModel()!.onDidChangeContent(() => this.modelChangeDelayer.trigger(() => this.onModelChanged())));
		this.unsupportedSettingsRenderer = this._register(instantiationService.createInstance(UnsupportedSettingsRenderer, editor, preferencesModel));
		this.mcpSettingsRenderer = this._register(instantiationService.createInstance(McpSettingsRenderer, editor, preferencesModel));
	}

	render(): void {
		this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this.associatedPreferencesModel);
		this.unsupportedSettingsRenderer.render();
		this.mcpSettingsRenderer.render();
	}

	updatePreference(key: string, value: unknown, source: IIndexedSetting): void {
		const overrideIdentifiers = source.overrideOf ? overrideIdentifiersFromKey(source.overrideOf.key) : null;
		const resource = this.preferencesModel.uri;
		this.configurationService.updateValue(key, value, { overrideIdentifiers, resource }, this.preferencesModel.configurationTarget)
			.then(() => this.onSettingUpdated(source));
	}

	private onModelChanged(): void {
		if (!this.editor.hasModel()) {
			// model could have been disposed during the delay
			return;
		}
		this.render();
	}

	private onSettingUpdated(setting: ISetting) {
		this.editor.focus();
		setting = this.getSetting(setting)!;
		if (setting) {
			// TODO:@sandy Selection range should be template range
			this.editor.setSelection(setting.valueRange);
			this.settingHighlighter.highlight(setting, true);
		}
	}

	private getSetting(setting: ISetting): ISetting | undefined {
		const { key, overrideOf } = setting;
		if (overrideOf) {
			const setting = this.getSetting(overrideOf);
			for (const override of setting!.overrides!) {
				if (override.key === key) {
					return override;
				}
			}
			return undefined;
		}

		return this.preferencesModel.getPreference(key);
	}

	focusPreference(setting: ISetting): void {
		const s = this.getSetting(setting);
		if (s) {
			this.settingHighlighter.highlight(s, true);
			this.editor.setPosition({ lineNumber: s.keyRange.startLineNumber, column: s.keyRange.startColumn });
		} else {
			this.settingHighlighter.clear(true);
		}
	}

	clearFocus(setting: ISetting): void {
		this.settingHighlighter.clear(true);
	}

	editPreference(setting: ISetting): boolean {
		const editableSetting = this.getSetting(setting);
		return !!(editableSetting && this.editSettingActionRenderer.activateOnSetting(editableSetting));
	}

}

export class WorkspaceSettingsRenderer extends UserSettingsRenderer implements IPreferencesRenderer {

	private workspaceConfigurationRenderer: WorkspaceConfigurationRenderer;

	constructor(editor: ICodeEditor, preferencesModel: SettingsEditorModel,
		@IPreferencesService preferencesService: IPreferencesService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService
	) {
		super(editor, preferencesModel, preferencesService, configurationService, instantiationService);
		this.workspaceConfigurationRenderer = this._register(instantiationService.createInstance(WorkspaceConfigurationRenderer, editor, preferencesModel));
	}

	override render(): void {
		super.render();
		this.workspaceConfigurationRenderer.render();
	}
}

export interface IIndexedSetting extends ISetting {
	index: number;
	groupId: string;
}

class EditSettingRenderer extends Disposable {

	private editPreferenceWidgetForCursorPosition: EditPreferenceWidget<IIndexedSetting>;
	private editPreferenceWidgetForMouseMove: EditPreferenceWidget<IIndexedSetting>;

	private settingsGroups: ISettingsGroup[] = [];
	associatedPreferencesModel!: IPreferencesEditorModel<ISetting>;
	private toggleEditPreferencesForMouseMoveDelayer: Delayer<void>;

	private readonly _onUpdateSetting: Emitter<{ key: string; value: unknown; source: IIndexedSetting }> = this._register(new Emitter<{ key: string; value: unknown; source: IIndexedSetting }>());
	readonly onUpdateSetting: Event<{ key: string; value: unknown; source: IIndexedSetting }> = this._onUpdateSetting.event;

	constructor(private editor: ICodeEditor, private primarySettingsModel: ISettingsEditorModel,
		private settingHighlighter: SettingHighlighter,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService
	) {
		super();

		this.editPreferenceWidgetForCursorPosition = this._register(this.instantiationService.createInstance(EditPreferenceWidget<IIndexedSetting>, editor));
		this.editPreferenceWidgetForMouseMove = this._register(this.instantiationService.createInstance(EditPreferenceWidget<IIndexedSetting>, editor));
		this.toggleEditPreferencesForMouseMoveDelayer = new Delayer<void>(75);

		this._register(this.editPreferenceWidgetForCursorPosition.onClick(e => this.onEditSettingClicked(this.editPreferenceWidgetForCursorPosition, e)));
		this._register(this.editPreferenceWidgetForMouseMove.onClick(e => this.onEditSettingClicked(this.editPreferenceWidgetForMouseMove, e)));

		this._register(this.editor.onDidChangeCursorPosition(positionChangeEvent => this.onPositionChanged(positionChangeEvent)));
		this._register(this.editor.onMouseMove(mouseMoveEvent => this.onMouseMoved(mouseMoveEvent)));
		this._register(this.editor.onDidChangeConfiguration(() => this.onConfigurationChanged()));
	}

	render(settingsGroups: ISettingsGroup[], associatedPreferencesModel: IPreferencesEditorModel<ISetting>): void {
		this.editPreferenceWidgetForCursorPosition.hide();
		this.editPreferenceWidgetForMouseMove.hide();
		this.settingsGroups = settingsGroups;
		this.associatedPreferencesModel = associatedPreferencesModel;

		const settings = this.getSettings(this.editor.getPosition()!.lineNumber);
		if (settings.length) {
			this.showEditPreferencesWidget(this.editPreferenceWidgetForCursorPosition, settings);
		}
	}

	private isDefaultSettings(): boolean {
		return this.primarySettingsModel instanceof DefaultSettingsEditorModel;
	}

	private onConfigurationChanged(): void {
		if (!this.editor.getOption(EditorOption.glyphMargin)) {
			this.editPreferenceWidgetForCursorPosition.hide();
			this.editPreferenceWidgetForMouseMove.hide();
		}
	}

	private onPositionChanged(positionChangeEvent: ICursorPositionChangedEvent) {
		this.editPreferenceWidgetForMouseMove.hide();
		const settings = this.getSettings(positionChangeEvent.position.lineNumber);
		if (settings.length) {
			this.showEditPreferencesWidget(this.editPreferenceWidgetForCursorPosition, settings);
		} else {
			this.editPreferenceWidgetForCursorPosition.hide();
		}
	}

	private onMouseMoved(mouseMoveEvent: IEditorMouseEvent): void {
		const editPreferenceWidget = this.getEditPreferenceWidgetUnderMouse(mouseMoveEvent);
		if (editPreferenceWidget) {
			this.onMouseOver(editPreferenceWidget);
			return;
		}
		this.settingHighlighter.clear();
		this.toggleEditPreferencesForMouseMoveDelayer.trigger(() => this.toggleEditPreferenceWidgetForMouseMove(mouseMoveEvent));
	}

	private getEditPreferenceWidgetUnderMouse(mouseMoveEvent: IEditorMouseEvent): EditPreferenceWidget<ISetting> | undefined {
		if (mouseMoveEvent.target.type === MouseTargetType.GUTTER_GLYPH_MARGIN) {
			const line = mouseMoveEvent.target.position.lineNumber;
			if (this.editPreferenceWidgetForMouseMove.getLine() === line && this.editPreferenceWidgetForMouseMove.isVisible()) {
				return this.editPreferenceWidgetForMouseMove;
			}
			if (this.editPreferenceWidgetForCursorPosition.getLine() === line && this.editPreferenceWidgetForCursorPosition.isVisible()) {
				return this.editPreferenceWidgetForCursorPosition;
			}
		}
		return undefined;
	}

	private toggleEditPreferenceWidgetForMouseMove(mouseMoveEvent: IEditorMouseEvent): void {
		const settings = mouseMoveEvent.target.position ? this.getSettings(mouseMoveEvent.target.position.lineNumber) : null;
		if (settings && settings.length) {
			this.showEditPreferencesWidget(this.editPreferenceWidgetForMouseMove, settings);
		} else {
			this.editPreferenceWidgetForMouseMove.hide();
		}
	}

	private showEditPreferencesWidget(editPreferencesWidget: EditPreferenceWidget<ISetting>, settings: IIndexedSetting[]) {
		const line = settings[0].valueRange.startLineNumber;
		if (this.editor.getOption(EditorOption.glyphMargin) && this.marginFreeFromOtherDecorations(line)) {
			editPreferencesWidget.show(line, nls.localize('editTtile', "Edit"), settings);
			const editPreferenceWidgetToHide = editPreferencesWidget === this.editPreferenceWidgetForCursorPosition ? this.editPreferenceWidgetForMouseMove : this.editPreferenceWidgetForCursorPosition;
			editPreferenceWidgetToHide.hide();
		}
	}

	private marginFreeFromOtherDecorations(line: number): boolean {
		const decorations = this.editor.getLineDecorations(line);
		if (decorations) {
			for (const { options } of decorations) {
				if (options.glyphMarginClassName && options.glyphMarginClassName.indexOf(ThemeIcon.asClassName(settingsEditIcon)) === -1) {
					return false;
				}
			}
		}
		return true;
	}

	private getSettings(lineNumber: number): IIndexedSetting[] {
		const configurationMap = this.getConfigurationsMap();
		return this.getSettingsAtLineNumber(lineNumber).filter(setting => {
			const configurationNode = configurationMap[setting.key];
			if (configurationNode) {
				if (configurationNode.policy && this.configurationService.inspect(setting.key).policyValue !== undefined) {
					return false;
				}
				if (this.isDefaultSettings()) {
					if (setting.key === 'launch') {
						// Do not show because of https://github.com/microsoft/vscode/issues/32593
						return false;
					}
					return true;
				}
				if (configurationNode.type === 'boolean' || configurationNode.enum) {
					if ((<SettingsEditorModel>this.primarySettingsModel).configurationTarget !== ConfigurationTarget.WORKSPACE_FOLDER) {
						return true;
					}
					if (configurationNode.scope === ConfigurationScope.RESOURCE || configurationNode.scope === ConfigurationScope.LANGUAGE_OVERRIDABLE) {
						return true;
					}
				}
			}
			return false;
		});
	}

	private getSettingsAtLineNumber(lineNumber: number): IIndexedSetting[] {
		// index of setting, across all groups/sections
		let index = 0;

		const settings: IIndexedSetting[] = [];
		for (const group of this.settingsGroups) {
			if (group.range.startLineNumber > lineNumber) {
				break;
			}
			if (lineNumber >= group.range.startLineNumber && lineNumber <= group.range.endLineNumber) {
				for (const section of group.sections) {
					for (const setting of section.settings) {
						if (setting.range.startLineNumber > lineNumber) {
							break;
						}
						if (lineNumber >= setting.range.startLineNumber && lineNumber <= setting.range.endLineNumber) {
							if (!this.isDefaultSettings() && setting.overrides!.length) {
								// Only one level because override settings cannot have override settings
								for (const overrideSetting of setting.overrides!) {
									if (lineNumber >= overrideSetting.range.startLineNumber && lineNumber <= overrideSetting.range.endLineNumber) {
										settings.push({ ...overrideSetting, index, groupId: group.id });
									}
								}
							} else {
								settings.push({ ...setting, index, groupId: group.id });
							}
						}

						index++;
					}
				}
			}
		}
		return settings;
	}

	private onMouseOver(editPreferenceWidget: EditPreferenceWidget<ISetting>): void {
		this.settingHighlighter.highlight(editPreferenceWidget.preferences[0]);
	}

	private onEditSettingClicked(editPreferenceWidget: EditPreferenceWidget<IIndexedSetting>, e: IEditorMouseEvent): void {
		EventHelper.stop(e.event, true);

		const actions = this.getSettings(editPreferenceWidget.getLine()).length === 1 ? this.getActions(editPreferenceWidget.preferences[0], this.getConfigurationsMap()[editPreferenceWidget.preferences[0].key])
			: editPreferenceWidget.preferences.map(setting => new SubmenuAction(`preferences.submenu.${setting.key}`, setting.key, this.getActions(setting, this.getConfigurationsMap()[setting.key])));
		this.contextMenuService.showContextMenu({
			getAnchor: () => e.event,
			getActions: () => actions
		});
	}

	activateOnSetting(setting: ISetting): boolean {
		const startLine = setting.keyRange.startLineNumber;
		const settings = this.getSettings(startLine);
		if (!settings.length) {
			return false;
		}

		this.editPreferenceWidgetForMouseMove.show(startLine, '', settings);
		const actions = this.getActions(this.editPreferenceWidgetForMouseMove.preferences[0], this.getConfigurationsMap()[this.editPreferenceWidgetForMouseMove.preferences[0].key]);
		this.contextMenuService.showContextMenu({
			getAnchor: () => this.toAbsoluteCoords(new Position(startLine, 1)),
			getActions: () => actions
		});

		return true;
	}

	private toAbsoluteCoords(position: Position): { x: number; y: number } {
		const positionCoords = this.editor.getScrolledVisiblePosition(position);
		const editorCoords = getDomNodePagePosition(this.editor.getDomNode()!);
		const x = editorCoords.left + positionCoords!.left;
		const y = editorCoords.top + positionCoords!.top + positionCoords!.height;

		return { x, y: y + 10 };
	}

	private getConfigurationsMap(): { [qualifiedKey: string]: IConfigurationPropertySchema } {
		return Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
	}

	private getActions(setting: IIndexedSetting, jsonSchema: IJSONSchema): IAction[] {
		if (jsonSchema.type === 'boolean') {
			return [{
				id: 'truthyValue',
				label: 'true',
				tooltip: 'true',
				enabled: true,
				run: () => this.updateSetting(setting.key, true, setting),
				class: undefined
			}, {
				id: 'falsyValue',
				label: 'false',
				tooltip: 'false',
				enabled: true,
				run: () => this.updateSetting(setting.key, false, setting),
				class: undefined
			}];
		}
		if (jsonSchema.enum) {
			return jsonSchema.enum.map(value => {
				return {
					id: value,
					label: JSON.stringify(value),
					tooltip: JSON.stringify(value),
					enabled: true,
					run: () => this.updateSetting(setting.key, value, setting),
					class: undefined
				};
			});
		}
		return this.getDefaultActions(setting);
	}

	private getDefaultActions(setting: IIndexedSetting): IAction[] {
		if (this.isDefaultSettings()) {
			const settingInOtherModel = this.associatedPreferencesModel.getPreference(setting.key);
			return [{
				id: 'setDefaultValue',
				label: settingInOtherModel ? nls.localize('replaceDefaultValue', "Replace in Settings") : nls.localize('copyDefaultValue', "Copy to Settings"),
				tooltip: settingInOtherModel ? nls.localize('replaceDefaultValue', "Replace in Settings") : nls.localize('copyDefaultValue', "Copy to Settings"),
				enabled: true,
				run: () => this.updateSetting(setting.key, setting.value, setting),
				class: undefined
			}];
		}
		return [];
	}

	private updateSetting(key: string, value: unknown, source: IIndexedSetting): void {
		this._onUpdateSetting.fire({ key, value, source });
	}
}

class SettingHighlighter extends Disposable {

	private fixedHighlighter: RangeHighlightDecorations;
	private volatileHighlighter: RangeHighlightDecorations;

	constructor(private editor: ICodeEditor, @IInstantiationService instantiationService: IInstantiationService) {
		super();
		this.fixedHighlighter = this._register(instantiationService.createInstance(RangeHighlightDecorations));
		this.volatileHighlighter = this._register(instantiationService.createInstance(RangeHighlightDecorations));
	}

	highlight(setting: ISetting, fix: boolean = false) {
		this.volatileHighlighter.removeHighlightRange();
		this.fixedHighlighter.removeHighlightRange();

		const highlighter = fix ? this.fixedHighlighter : this.volatileHighlighter;
		highlighter.highlightRange({
			range: setting.valueRange,
			resource: this.editor.getModel()!.uri
		}, this.editor);

		this.editor.revealLineInCenterIfOutsideViewport(setting.valueRange.startLineNumber, editorCommon.ScrollType.Smooth);
	}

	clear(fix: boolean = false): void {
		this.volatileHighlighter.removeHighlightRange();
		if (fix) {
			this.fixedHighlighter.removeHighlightRange();
		}
	}
}

class UnsupportedSettingsRenderer extends Disposable implements languages.CodeActionProvider {

	private renderingDelayer: Delayer<void> = new Delayer<void>(200);

	private readonly codeActions = new ResourceMap<[Range, languages.CodeAction[]][]>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));

	constructor(
		private readonly editor: ICodeEditor,
		private readonly settingsEditorModel: SettingsEditorModel,
		@IMarkerService private readonly markerService: IMarkerService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@IWorkbenchConfigurationService private readonly configurationService: IWorkbenchConfigurationService,
		@IWorkspaceTrustManagementService private readonly workspaceTrustManagementService: IWorkspaceTrustManagementService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
		@IUserDataProfileService private readonly userDataProfileService: IUserDataProfileService,
		@IUserDataProfilesService private readonly userDataProfilesService: IUserDataProfilesService,
	) {
		super();
		this._register(this.editor.getModel()!.onDidChangeContent(() => this.delayedRender()));
		this._register(Event.filter(this.configurationService.onDidChangeConfiguration, e => e.source === ConfigurationTarget.DEFAULT)(() => this.delayedRender()));
		this._register(languageFeaturesService.codeActionProvider.register({ pattern: settingsEditorModel.uri.path }, this));
		this._register(userDataProfileService.onDidChangeCurrentProfile(() => this.delayedRender()));
	}

	private delayedRender(): void {
		this.renderingDelayer.trigger(() => this.render());
	}

	public render(): void {
		this.codeActions.clear();
		const markerData: IMarkerData[] = this.generateMarkerData();
		if (markerData.length) {
			this.markerService.changeOne('UnsupportedSettingsRenderer', this.settingsEditorModel.uri, markerData);
		} else {
			this.markerService.remove('UnsupportedSettingsRenderer', [this.settingsEditorModel.uri]);
		}
	}

	async provideCodeActions(model: ITextModel, range: Range | Selection, context: languages.CodeActionContext, token: CancellationToken): Promise<languages.CodeActionList> {
		const actions: languages.CodeAction[] = [];
		const codeActionsByRange = this.codeActions.get(model.uri);
		if (codeActionsByRange) {
			for (const [codeActionsRange, codeActions] of codeActionsByRange) {
				if (codeActionsRange.containsRange(range)) {
					actions.push(...codeActions);
				}
			}
		}
		return {
			actions,
			dispose: () => { }
		};
	}

	private generateMarkerData(): IMarkerData[] {
		const markerData: IMarkerData[] = [];
		const configurationRegistry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).getConfigurationProperties();
		for (const settingsGroup of this.settingsEditorModel.settingsGroups) {
			for (const section of settingsGroup.sections) {
				for (const setting of section.settings) {
					if (OVERRIDE_PROPERTY_REGEX.test(setting.key)) {
						if (setting.overrides) {
							this.handleOverrides(setting.overrides, configurationRegistry, markerData);
						}
						continue;
					}
					const configuration = configurationRegistry[setting.key];
					if (configuration) {
						this.handleUnstableSettingConfiguration(setting, configuration, markerData);
						if (this.handlePolicyConfiguration(setting, configuration, markerData)) {
							continue;
						}
						switch (this.settingsEditorModel.configurationTarget) {
							case ConfigurationTarget.USER_LOCAL:
								this.handleLocalUserConfiguration(setting, configuration, markerData);
								break;
							case ConfigurationTarget.USER_REMOTE:
								this.handleRemoteUserConfiguration(setting, configuration, markerData);
								break;
							case ConfigurationTarget.WORKSPACE:
								this.handleWorkspaceConfiguration(setting, configuration, markerData);
								break;
							case ConfigurationTarget.WORKSPACE_FOLDER:
								this.handleWorkspaceFolderConfiguration(setting, configuration, markerData);
								break;
						}
					} else {
						markerData.push(this.generateUnknownConfigurationMarker(setting));
					}
				}
			}
		}
		return markerData;
	}

	private handlePolicyConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): boolean {
		if (!configuration.policy) {
			return false;
		}
		if (this.configurationService.inspect(setting.key).policyValue === undefined) {
			return false;
		}
		if (this.settingsEditorModel.configurationTarget === ConfigurationTarget.DEFAULT) {
			return false;
		}
		markerData.push({
			severity: MarkerSeverity.Hint,
			tags: [MarkerTag.Unnecessary],
			...setting.range,
			message: nls.localize('unsupportedPolicySetting', "This setting cannot be applied because it is configured in the system policy.")
		});
		return true;
	}

	private handleOverrides(overrides: ISetting[], configurationRegistry: IStringDictionary<IRegisteredConfigurationPropertySchema>, markerData: IMarkerData[]): void {
		for (const setting of overrides || []) {
			const configuration = configurationRegistry[setting.key];
			if (configuration) {
				if (configuration.scope !== ConfigurationScope.LANGUAGE_OVERRIDABLE) {
					markerData.push({
						severity: MarkerSeverity.Hint,
						tags: [MarkerTag.Unnecessary],
						...setting.range,
						message: nls.localize('unsupportLanguageOverrideSetting', "This setting cannot be applied because it is not registered as language override setting.")
					});
				}
			} else {
				markerData.push(this.generateUnknownConfigurationMarker(setting));
			}
		}
	}

	private handleLocalUserConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): void {
		if (!this.userDataProfileService.currentProfile.isDefault && !this.userDataProfileService.currentProfile.useDefaultFlags?.settings) {
			if (isEqual(this.userDataProfilesService.defaultProfile.settingsResource, this.settingsEditorModel.uri) && !this.configurationService.isSettingAppliedForAllProfiles(setting.key)) {
				// If we're in the default profile setting file, and the setting cannot be applied in all profiles
				markerData.push({
					severity: MarkerSeverity.Hint,
					tags: [MarkerTag.Unnecessary],
					...setting.range,
					message: nls.localize('defaultProfileSettingWhileNonDefaultActive', "This setting cannot be applied while a non-default profile is active. It will be applied when the default profile is active.")
				});
			} else if (isEqual(this.userDataProfileService.currentProfile.settingsResource, this.settingsEditorModel.uri)) {
				if (configuration.scope && APPLICATION_SCOPES.includes(configuration.scope)) {
					// If we're in a profile setting file, and the setting is application-scoped, fade it out.
					markerData.push(this.generateUnsupportedApplicationSettingMarker(setting));
				} else if (this.configurationService.isSettingAppliedForAllProfiles(setting.key)) {
					// If we're in the non-default profile setting file, and the setting can be applied in all profiles, fade it out.
					markerData.push({
						severity: MarkerSeverity.Hint,
						tags: [MarkerTag.Unnecessary],
						...setting.range,
						message: nls.localize('allProfileSettingWhileInNonDefaultProfileSetting', "This setting cannot be applied because it is configured to be applied in all profiles using setting {0}. Value from the default profile will be used instead.", APPLY_ALL_PROFILES_SETTING)
					});
				}
			}
		}
		if (this.environmentService.remoteAuthority && (configuration.scope === ConfigurationScope.MACHINE || configuration.scope === ConfigurationScope.APPLICATION_MACHINE || configuration.scope === ConfigurationScope.MACHINE_OVERRIDABLE)) {
			markerData.push({
				severity: MarkerSeverity.Hint,
				tags: [MarkerTag.Unnecessary],
				...setting.range,
				message: nls.localize('unsupportedRemoteMachineSetting', "This setting cannot be applied in this window. It will be applied when you open a local window.")
			});
		}
	}

	private handleRemoteUserConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): void {
		if (configuration.scope === ConfigurationScope.APPLICATION) {
			markerData.push(this.generateUnsupportedApplicationSettingMarker(setting));
		}
	}

	private handleWorkspaceConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): void {
		if (configuration.scope && APPLICATION_SCOPES.includes(configuration.scope)) {
			markerData.push(this.generateUnsupportedApplicationSettingMarker(setting));
		}

		if (configuration.scope === ConfigurationScope.MACHINE) {
			markerData.push(this.generateUnsupportedMachineSettingMarker(setting));
		}

		if (!this.workspaceTrustManagementService.isWorkspaceTrusted() && configuration.restricted) {
			const marker = this.generateUntrustedSettingMarker(setting);
			markerData.push(marker);
			const codeActions = this.generateUntrustedSettingCodeActions([marker]);
			this.addCodeActions(marker, codeActions);
		}
	}

	private handleWorkspaceFolderConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): void {
		if (configuration.scope && APPLICATION_SCOPES.includes(configuration.scope)) {
			markerData.push(this.generateUnsupportedApplicationSettingMarker(setting));
		}

		if (configuration.scope === ConfigurationScope.MACHINE) {
			markerData.push(this.generateUnsupportedMachineSettingMarker(setting));
		}

		if (configuration.scope === ConfigurationScope.WINDOW) {
			markerData.push({
				severity: MarkerSeverity.Hint,
				tags: [MarkerTag.Unnecessary],
				...setting.range,
				message: nls.localize('unsupportedWindowSetting', "This setting cannot be applied in this workspace. It will be applied when you open the containing workspace folder directly.")
			});
		}

		if (!this.workspaceTrustManagementService.isWorkspaceTrusted() && configuration.restricted) {
			const marker = this.generateUntrustedSettingMarker(setting);
			markerData.push(marker);
			const codeActions = this.generateUntrustedSettingCodeActions([marker]);
			this.addCodeActions(marker, codeActions);
		}
	}

	private handleUnstableSettingConfiguration(setting: ISetting, configuration: IConfigurationPropertySchema, markerData: IMarkerData[]): void {
		if (configuration.tags?.includes('preview')) {
			markerData.push(this.generatePreviewSettingMarker(setting));
		} else if (configuration.tags?.includes('experimental')) {
			markerData.push(this.generateExperimentalSettingMarker(setting));
		}
	}

	private generateUnsupportedApplicationSettingMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Hint,
			tags: [MarkerTag.Unnecessary],
			...setting.range,
			message: nls.localize('unsupportedApplicationSetting', "This setting has an application scope and can only be set in the settings file from the Default profile.")
		};
	}

	private generateUnsupportedMachineSettingMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Hint,
			tags: [MarkerTag.Unnecessary],
			...setting.range,
			message: nls.localize('unsupportedMachineSetting', "This setting can only be applied in user settings in local window or in remote settings in remote window.")
		};
	}

	private generateUntrustedSettingMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Warning,
			...setting.range,
			message: nls.localize('untrustedSetting', "This setting can only be applied in a trusted workspace.")
		};
	}

	private generateUnknownConfigurationMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Hint,
			tags: [MarkerTag.Unnecessary],
			...setting.range,
			message: nls.localize('unknown configuration setting', "Unknown Configuration Setting")
		};
	}

	private generateUntrustedSettingCodeActions(diagnostics: IMarkerData[]): languages.CodeAction[] {
		return [{
			title: nls.localize('manage workspace trust', "Manage Workspace Trust"),
			command: {
				id: 'workbench.trust.manage',
				title: nls.localize('manage workspace trust', "Manage Workspace Trust")
			},
			diagnostics,
			kind: CodeActionKind.QuickFix.value
		}];
	}

	private generatePreviewSettingMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Hint,
			...setting.range,
			message: PREVIEW_INDICATOR_DESCRIPTION
		};
	}

	private generateExperimentalSettingMarker(setting: ISetting): IMarkerData {
		return {
			severity: MarkerSeverity.Hint,
			...setting.range,
			message: EXPERIMENTAL_INDICATOR_DESCRIPTION
		};
	}

	private addCodeActions(range: IRange, codeActions: languages.CodeAction[]): void {
		let actions = this.codeActions.get(this.settingsEditorModel.uri);
		if (!actions) {
			actions = [];
			this.codeActions.set(this.settingsEditorModel.uri, actions);
		}
		actions.push([Range.lift(range), codeActions]);
	}

	public override dispose(): void {
		this.markerService.remove('UnsupportedSettingsRenderer', [this.settingsEditorModel.uri]);
		this.codeActions.clear();
		super.dispose();
	}

}

class McpSettingsRenderer extends Disposable implements languages.CodeActionProvider {

	private renderingDelayer: Delayer<void> = new Delayer<void>(200);
	private readonly codeActions = new ResourceMap<[Range, languages.CodeAction[]][]>(uri => this.uriIdentityService.extUri.getComparisonKey(uri));

	constructor(
		private readonly editor: ICodeEditor,
		private readonly settingsEditorModel: SettingsEditorModel,
		@IMarkerService private readonly markerService: IMarkerService,
		@IUriIdentityService private readonly uriIdentityService: IUriIdentityService,
		@ILanguageFeaturesService languageFeaturesService: ILanguageFeaturesService,
	) {
		super();
		this._register(this.editor.getModel()!.onDidChangeContent(() => this.delayedRender()));
		this._register(languageFeaturesService.codeActionProvider.register({ pattern: settingsEditorModel.uri.path }, this));
	}

	private delayedRender(): void {
		this.renderingDelayer.trigger(() => this.render());
	}

	public render(): void {
		this.codeActions.clear();
		const markerData: IMarkerData[] = this.generateMarkerData();
		if (markerData.length) {
			this.markerService.changeOne('McpSettingsRenderer', this.settingsEditorModel.uri, markerData);
		} else {
			this.markerService.remove('McpSettingsRenderer', [this.settingsEditorModel.uri]);
		}
	}

	async provideCodeActions(model: ITextModel, range: Range | Selection, context: languages.CodeActionContext, token: CancellationToken): Promise<languages.CodeActionList> {
		const actions: languages.CodeAction[] = [];
		const codeActionsByRange = this.codeActions.get(model.uri);
		if (codeActionsByRange) {
			for (const [codeActionsRange, codeActions] of codeActionsByRange) {
				if (codeActionsRange.containsRange(range)) {
					actions.push(...codeActions);
				}
			}
		}
		return {
			actions,
			dispose: () => { }
		};
	}

	private generateMarkerData(): IMarkerData[] {
		const markerData: IMarkerData[] = [];

		// Only check for MCP configuration in user local and user remote settings
		if (this.settingsEditorModel.configurationTarget !== ConfigurationTarget.USER_LOCAL &&
			this.settingsEditorModel.configurationTarget !== ConfigurationTarget.USER_REMOTE) {
			return markerData;
		}

		for (const settingsGroup of this.settingsEditorModel.settingsGroups) {
			for (const section of settingsGroup.sections) {
				for (const setting of section.settings) {
					if (setting.key === mcpConfigurationSection) {
						const marker = this.generateMcpConfigurationMarker(setting);
						markerData.push(marker);
						const codeActions = this.generateMcpConfigurationCodeActions([marker]);
						this.addCodeActions(setting.range, codeActions);
					}
				}
			}
		}
		return markerData;
	}

	private generateMcpConfigurationMarker(setting: ISetting): IMarkerData {
		const isRemote = this.settingsEditorModel.configurationTarget === ConfigurationTarget.USER_REMOTE;
		const message = isRemote
			? nls.localize('mcp.renderer.remoteConfigFound', 'MCP servers should not be configured in remote user settings. Use the dedicated MCP configuration instead.')
			: nls.localize('mcp.renderer.userConfigFound', 'MCP servers should not be configured in user settings. Use the dedicated MCP configuration instead.');

		return {
			severity: MarkerSeverity.Warning,
			...setting.range,
			message
		};
	}

	private generateMcpConfigurationCodeActions(diagnostics: IMarkerData[]): languages.CodeAction[] {
		const isRemote = this.settingsEditorModel.configurationTarget === ConfigurationTarget.USER_REMOTE;
		const openConfigLabel = isRemote
			? nls.localize('mcp.renderer.openRemoteConfig', 'Open Remote User MCP Configuration')
			: nls.localize('mcp.renderer.openUserConfig', 'Open User MCP Configuration');

		const commandId = isRemote ? McpCommandIds.OpenRemoteUserMcp : McpCommandIds.OpenUserMcp;

		return [{
			title: openConfigLabel,
			command: {
				id: commandId,
				title: openConfigLabel
			},
			diagnostics,
			kind: CodeActionKind.QuickFix.value
		}];
	}

	private addCodeActions(range: IRange, codeActions: languages.CodeAction[]): void {
		let actions = this.codeActions.get(this.settingsEditorModel.uri);
		if (!actions) {
			actions = [];
			this.codeActions.set(this.settingsEditorModel.uri, actions);
		}
		actions.push([Range.lift(range), codeActions]);
	}

	public override dispose(): void {
		this.markerService.remove('McpSettingsRenderer', [this.settingsEditorModel.uri]);
		this.codeActions.clear();
		super.dispose();
	}

}

class WorkspaceConfigurationRenderer extends Disposable {
	private static readonly supportedKeys = ['folders', 'tasks', 'launch', 'extensions', 'settings', 'remoteAuthority', 'transient'];

	private readonly decorations: editorCommon.IEditorDecorationsCollection;
	private renderingDelayer: Delayer<void> = new Delayer<void>(200);

	constructor(private editor: ICodeEditor, private workspaceSettingsEditorModel: SettingsEditorModel,
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IMarkerService private readonly markerService: IMarkerService
	) {
		super();
		this.decorations = this.editor.createDecorationsCollection();
		this._register(this.editor.getModel()!.onDidChangeContent(() => this.renderingDelayer.trigger(() => this.render())));
	}

	render(): void {
		const markerData: IMarkerData[] = [];
		if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.WORKSPACE && this.workspaceSettingsEditorModel instanceof WorkspaceConfigurationEditorModel) {
			const ranges: IRange[] = [];
			for (const settingsGroup of this.workspaceSettingsEditorModel.configurationGroups) {
				for (const section of settingsGroup.sections) {
					for (const setting of section.settings) {
						if (!WorkspaceConfigurationRenderer.supportedKeys.includes(setting.key)) {
							markerData.push({
								severity: MarkerSeverity.Hint,
								tags: [MarkerTag.Unnecessary],
								...setting.range,
								message: nls.localize('unsupportedProperty', "Unsupported Property")
							});
						}
					}
				}
			}
			this.decorations.set(ranges.map(range => this.createDecoration(range)));
		}
		if (markerData.length) {
			this.markerService.changeOne('WorkspaceConfigurationRenderer', this.workspaceSettingsEditorModel.uri, markerData);
		} else {
			this.markerService.remove('WorkspaceConfigurationRenderer', [this.workspaceSettingsEditorModel.uri]);
		}
	}

	private static readonly _DIM_CONFIGURATION_ = ModelDecorationOptions.register({
		description: 'dim-configuration',
		stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
		inlineClassName: 'dim-configuration'
	});

	private createDecoration(range: IRange): IModelDeltaDecoration {
		return {
			range,
			options: WorkspaceConfigurationRenderer._DIM_CONFIGURATION_
		};
	}

	override dispose(): void {
		this.markerService.remove('WorkspaceConfigurationRenderer', [this.workspaceSettingsEditorModel.uri]);
		this.decorations.clear();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesSearch.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { distinct } from '../../../../base/common/arrays.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IStringDictionary } from '../../../../base/common/collections.js';
import { IMatch, matchesBaseContiguousSubString, matchesContiguousSubString, matchesSubString, matchesWords } from '../../../../base/common/filters.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import * as strings from '../../../../base/common/strings.js';
import { TfIdfCalculator, TfIdfDocument } from '../../../../base/common/tfIdf.js';
import { IRange } from '../../../../editor/common/core/range.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IAiSettingsSearchService } from '../../../services/aiSettingsSearch/common/aiSettingsSearch.js';
import { IGroupFilter, ISearchResult, ISetting, ISettingMatch, ISettingMatcher, ISettingsEditorModel, ISettingsGroup, SettingKeyMatchTypes, SettingMatchType } from '../../../services/preferences/common/preferences.js';
import { nullRange } from '../../../services/preferences/common/preferencesModels.js';
import { EMBEDDINGS_SEARCH_PROVIDER_NAME, IAiSearchProvider, IPreferencesSearchService, IRemoteSearchProvider, ISearchProvider, IWorkbenchSettingsConfiguration, LLM_RANKED_SEARCH_PROVIDER_NAME, STRING_MATCH_SEARCH_PROVIDER_NAME, TF_IDF_SEARCH_PROVIDER_NAME } from '../common/preferences.js';

export interface IEndpointDetails {
	urlBase?: string;
	key?: string;
}

export class PreferencesSearchService extends Disposable implements IPreferencesSearchService {
	declare readonly _serviceBrand: undefined;

	private _remoteSearchProvider: IRemoteSearchProvider | undefined;
	private _aiSearchProvider: IAiSearchProvider | undefined;

	constructor(
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
	) {
		super();
	}

	getLocalSearchProvider(filter: string): LocalSearchProvider {
		return this.instantiationService.createInstance(LocalSearchProvider, filter);
	}

	private get remoteSearchAllowed(): boolean {
		const workbenchSettings = this.configurationService.getValue<IWorkbenchSettingsConfiguration>().workbench.settings;
		return workbenchSettings.enableNaturalLanguageSearch;
	}

	getRemoteSearchProvider(filter: string): IRemoteSearchProvider | undefined {
		if (!this.remoteSearchAllowed) {
			return undefined;
		}

		this._remoteSearchProvider ??= this.instantiationService.createInstance(RemoteSearchProvider);
		this._remoteSearchProvider.setFilter(filter);
		return this._remoteSearchProvider;
	}

	getAiSearchProvider(filter: string): IAiSearchProvider | undefined {
		if (!this.remoteSearchAllowed) {
			return undefined;
		}

		this._aiSearchProvider ??= this.instantiationService.createInstance(AiSearchProvider);
		this._aiSearchProvider.setFilter(filter);
		return this._aiSearchProvider;
	}
}

function cleanFilter(filter: string): string {
	// Remove " and : which are likely to be copypasted as part of a setting name.
	// Leave other special characters which the user might want to search for.
	return filter
		.replace(/[":]/g, ' ')
		.replace(/  /g, ' ')
		.trim();
}

export class LocalSearchProvider implements ISearchProvider {
	constructor(
		private _filter: string,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) {
		this._filter = cleanFilter(this._filter);
	}

	searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter) {
			return Promise.resolve(null);
		}

		const settingMatcher: ISettingMatcher = (setting: ISetting) => {
			let { matches, matchType, keyMatchScore } = new SettingMatches(
				this._filter,
				setting,
				true,
				this.configurationService
			);
			if (matchType === SettingMatchType.None || matches.length === 0) {
				return null;
			}
			if (strings.equalsIgnoreCase(this._filter, setting.key)) {
				matchType = SettingMatchType.ExactMatch;
			}
			return {
				matches,
				matchType,
				keyMatchScore,
				score: 0 // only used for RemoteSearchProvider matches.
			};
		};

		const filterMatches = preferencesModel.filterSettings(this._filter, this.getGroupFilter(this._filter), settingMatcher);

		// Check the top key match type.
		const topKeyMatchType = Math.max(...filterMatches.map(m => (m.matchType & SettingKeyMatchTypes)));
		// Always allow description matches as part of https://github.com/microsoft/vscode/issues/239936.
		const alwaysAllowedMatchTypes = SettingMatchType.DescriptionOrValueMatch | SettingMatchType.LanguageTagSettingMatch;
		const filteredMatches = filterMatches
			.filter(m => (m.matchType & topKeyMatchType) || (m.matchType & alwaysAllowedMatchTypes) || m.matchType === SettingMatchType.ExactMatch)
			.map(m => ({ ...m, providerName: STRING_MATCH_SEARCH_PROVIDER_NAME }));
		return Promise.resolve({
			filterMatches: filteredMatches,
			exactMatch: filteredMatches.some(m => m.matchType === SettingMatchType.ExactMatch)
		});
	}

	private getGroupFilter(filter: string): IGroupFilter {
		const regex = strings.createRegExp(filter, false, { global: true });
		return (group: ISettingsGroup) => {
			return group.id !== 'defaultOverrides' && regex.test(group.title);
		};
	}
}

export class SettingMatches {
	readonly matches: IRange[];
	matchType: SettingMatchType = SettingMatchType.None;
	/**
	 * A match score for key matches to allow comparing key matches against each other.
	 * Otherwise, all key matches are treated the same, and sorting is done by ToC order.
	 */
	keyMatchScore: number = 0;

	constructor(
		searchString: string,
		setting: ISetting,
		private searchDescription: boolean,
		private readonly configurationService: IConfigurationService
	) {
		this.matches = distinct(this._findMatchesInSetting(searchString, setting), (match) => `${match.startLineNumber}_${match.startColumn}_${match.endLineNumber}_${match.endColumn}_`);
	}

	private _findMatchesInSetting(searchString: string, setting: ISetting): IRange[] {
		const result = this._doFindMatchesInSetting(searchString, setting);
		return result;
	}

	private _keyToLabel(settingId: string): string {
		const label = settingId
			.replace(/[-._]/g, ' ')
			.replace(/([a-z]+)([A-Z])/g, '$1 $2')
			.replace(/([A-Za-z]+)(\d+)/g, '$1 $2')
			.replace(/(\d+)([A-Za-z]+)/g, '$1 $2')
			.toLowerCase();
		return label;
	}

	private _toAlphaNumeric(s: string): string {
		return s.replace(/[^\p{L}\p{N}]+/gu, '');
	}

	private _doFindMatchesInSetting(searchString: string, setting: ISetting): IRange[] {
		const descriptionMatchingWords: Map<string, IRange[]> = new Map<string, IRange[]>();
		const keyMatchingWords: Map<string, IRange[]> = new Map<string, IRange[]>();
		const valueMatchingWords: Map<string, IRange[]> = new Map<string, IRange[]>();

		// Key (ID) search
		// First, search by the setting's ID and label.
		const settingKeyAsWords: string = this._keyToLabel(setting.key);
		const queryWords = new Set<string>(searchString.split(' '));
		for (const word of queryWords) {
			// Check if the key contains the word. Use contiguous search.
			const keyMatches = matchesWords(word, settingKeyAsWords, true);
			if (keyMatches?.length) {
				keyMatchingWords.set(word, keyMatches.map(match => this.toKeyRange(setting, match)));
			}
		}
		if (keyMatchingWords.size === queryWords.size) {
			// All words in the query matched with something in the setting key.
			// Matches "edit format on paste" to "editor.formatOnPaste".
			this.matchType |= SettingMatchType.AllWordsInSettingsLabel;
		} else if (keyMatchingWords.size >= 2) {
			// Matches "edit paste" to "editor.formatOnPaste".
			// The if statement reduces noise by preventing "editor formatonpast" from matching all editor settings.
			this.matchType |= SettingMatchType.ContiguousWordsInSettingsLabel;
			this.keyMatchScore = keyMatchingWords.size;
		}
		const searchStringAlphaNumeric = this._toAlphaNumeric(searchString);
		const keyAlphaNumeric = this._toAlphaNumeric(setting.key);
		const keyIdMatches = matchesContiguousSubString(searchStringAlphaNumeric, keyAlphaNumeric);
		if (keyIdMatches?.length) {
			// Matches "editorformatonp" to "editor.formatonpaste".
			keyMatchingWords.set(setting.key, keyIdMatches.map(match => this.toKeyRange(setting, match)));
			this.matchType |= SettingMatchType.ContiguousQueryInSettingId;
		}

		// Fall back to non-contiguous key (ID) searches if nothing matched yet.
		if (this.matchType === SettingMatchType.None) {
			keyMatchingWords.clear();
			for (const word of queryWords) {
				const keyMatches = matchesWords(word, settingKeyAsWords, false);
				if (keyMatches?.length) {
					keyMatchingWords.set(word, keyMatches.map(match => this.toKeyRange(setting, match)));
				}
			}
			if (keyMatchingWords.size >= 2 || (keyMatchingWords.size === 1 && queryWords.size === 1)) {
				// Matches "edforonpas" to "editor.formatOnPaste".
				// The if statement reduces noise by preventing "editor fomonpast" from matching all editor settings.
				this.matchType |= SettingMatchType.NonContiguousWordsInSettingsLabel;
				this.keyMatchScore = keyMatchingWords.size;
			} else {
				const keyIdMatches = matchesSubString(searchStringAlphaNumeric, keyAlphaNumeric);
				if (keyIdMatches?.length) {
					// Matches "edfmonpas" to "editor.formatOnPaste".
					keyMatchingWords.set(setting.key, keyIdMatches.map(match => this.toKeyRange(setting, match)));
					this.matchType |= SettingMatchType.NonContiguousQueryInSettingId;
				}
			}
		}

		// Check if the match was for a language tag group setting such as [markdown].
		// In such a case, move that setting to be last.
		if (setting.overrides?.length && (this.matchType !== SettingMatchType.None)) {
			this.matchType = SettingMatchType.LanguageTagSettingMatch;
			const keyRanges = keyMatchingWords.size ?
				Array.from(keyMatchingWords.values()).flat() : [];
			return [...keyRanges];
		}

		// Description search
		// Search the description if we found non-contiguous key matches at best.
		const hasContiguousKeyMatchTypes = this.matchType >= SettingMatchType.ContiguousWordsInSettingsLabel;
		if (this.searchDescription && !hasContiguousKeyMatchTypes) {
			for (const word of queryWords) {
				// Search the description lines.
				for (let lineIndex = 0; lineIndex < setting.description.length; lineIndex++) {
					const descriptionMatches = matchesBaseContiguousSubString(word, setting.description[lineIndex]);
					if (descriptionMatches?.length) {
						descriptionMatchingWords.set(word, descriptionMatches.map(match => this.toDescriptionRange(setting, match, lineIndex)));
					}
				}
			}
			if (descriptionMatchingWords.size === queryWords.size) {
				this.matchType |= SettingMatchType.DescriptionOrValueMatch;
			} else {
				// Clear out the match for now. We want to require all words to match in the description.
				descriptionMatchingWords.clear();
			}
		}

		// Value search
		// Check if the value contains all the words.
		// Search the values if we found non-contiguous key matches at best.
		if (!hasContiguousKeyMatchTypes) {
			if (setting.enum?.length) {
				// Search all string values of enums.
				for (const option of setting.enum) {
					if (typeof option !== 'string') {
						continue;
					}
					valueMatchingWords.clear();
					for (const word of queryWords) {
						const valueMatches = matchesContiguousSubString(word, option);
						if (valueMatches?.length) {
							valueMatchingWords.set(word, valueMatches.map(match => this.toValueRange(setting, match)));
						}
					}
					if (valueMatchingWords.size === queryWords.size) {
						this.matchType |= SettingMatchType.DescriptionOrValueMatch;
						break;
					} else {
						// Clear out the match for now. We want to require all words to match in the value.
						valueMatchingWords.clear();
					}
				}
			} else {
				// Search single string value.
				const settingValue = this.configurationService.getValue(setting.key);
				if (typeof settingValue === 'string') {
					for (const word of queryWords) {
						const valueMatches = matchesContiguousSubString(word, settingValue);
						if (valueMatches?.length) {
							valueMatchingWords.set(word, valueMatches.map(match => this.toValueRange(setting, match)));
						}
					}
					if (valueMatchingWords.size === queryWords.size) {
						this.matchType |= SettingMatchType.DescriptionOrValueMatch;
					} else {
						// Clear out the match for now. We want to require all words to match in the value.
						valueMatchingWords.clear();
					}
				}
			}
		}

		const descriptionRanges = descriptionMatchingWords.size ?
			Array.from(descriptionMatchingWords.values()).flat() : [];
		const keyRanges = keyMatchingWords.size ?
			Array.from(keyMatchingWords.values()).flat() : [];
		const valueRanges = valueMatchingWords.size ?
			Array.from(valueMatchingWords.values()).flat() : [];
		return [...descriptionRanges, ...keyRanges, ...valueRanges];
	}

	private toKeyRange(setting: ISetting, match: IMatch): IRange {
		return {
			startLineNumber: setting.keyRange.startLineNumber,
			startColumn: setting.keyRange.startColumn + match.start,
			endLineNumber: setting.keyRange.startLineNumber,
			endColumn: setting.keyRange.startColumn + match.end
		};
	}

	private toDescriptionRange(setting: ISetting, match: IMatch, lineIndex: number): IRange {
		const descriptionRange = setting.descriptionRanges[lineIndex];
		if (!descriptionRange) {
			// This case occurs with added settings such as the
			// manage extension setting.
			return nullRange;
		}
		return {
			startLineNumber: descriptionRange.startLineNumber,
			startColumn: descriptionRange.startColumn + match.start,
			endLineNumber: descriptionRange.endLineNumber,
			endColumn: descriptionRange.startColumn + match.end
		};
	}

	private toValueRange(setting: ISetting, match: IMatch): IRange {
		return {
			startLineNumber: setting.valueRange.startLineNumber,
			startColumn: setting.valueRange.startColumn + match.start + 1,
			endLineNumber: setting.valueRange.startLineNumber,
			endColumn: setting.valueRange.startColumn + match.end + 1
		};
	}
}

class SettingsRecordProvider {
	private _settingsRecord: IStringDictionary<ISetting> = {};
	private _currentPreferencesModel: ISettingsEditorModel | undefined;

	constructor() { }

	updateModel(preferencesModel: ISettingsEditorModel) {
		if (preferencesModel === this._currentPreferencesModel) {
			return;
		}

		this._currentPreferencesModel = preferencesModel;
		this.refresh();
	}

	private refresh() {
		this._settingsRecord = {};

		if (!this._currentPreferencesModel) {
			return;
		}

		for (const group of this._currentPreferencesModel.settingsGroups) {
			if (group.id === 'mostCommonlyUsed') {
				continue;
			}
			for (const section of group.sections) {
				for (const setting of section.settings) {
					this._settingsRecord[setting.key] = setting;
				}
			}
		}
	}

	getSettingsRecord(): IStringDictionary<ISetting> {
		return this._settingsRecord;
	}
}

class EmbeddingsSearchProvider implements IRemoteSearchProvider {
	private static readonly EMBEDDINGS_SETTINGS_SEARCH_MAX_PICKS = 10;

	private readonly _recordProvider: SettingsRecordProvider;
	private _filter: string = '';

	constructor(
		private readonly _aiSettingsSearchService: IAiSettingsSearchService
	) {
		this._recordProvider = new SettingsRecordProvider();
	}

	setFilter(filter: string) {
		this._filter = cleanFilter(filter);
	}

	async searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter || !this._aiSettingsSearchService.isEnabled()) {
			return null;
		}

		this._recordProvider.updateModel(preferencesModel);
		this._aiSettingsSearchService.startSearch(this._filter, token);

		return {
			filterMatches: await this.getEmbeddingsItems(token),
			exactMatch: false
		};
	}

	private async getEmbeddingsItems(token: CancellationToken): Promise<ISettingMatch[]> {
		const settingsRecord = this._recordProvider.getSettingsRecord();
		const filterMatches: ISettingMatch[] = [];
		const settings = await this._aiSettingsSearchService.getEmbeddingsResults(this._filter, token);
		if (!settings) {
			return [];
		}

		const providerName = EMBEDDINGS_SEARCH_PROVIDER_NAME;
		for (const settingKey of settings) {
			if (filterMatches.length === EmbeddingsSearchProvider.EMBEDDINGS_SETTINGS_SEARCH_MAX_PICKS) {
				break;
			}
			filterMatches.push({
				setting: settingsRecord[settingKey],
				matches: [settingsRecord[settingKey].range],
				matchType: SettingMatchType.RemoteMatch,
				keyMatchScore: 0,
				score: 0, // the results are sorted upstream.
				providerName
			});
		}

		return filterMatches;
	}
}

class TfIdfSearchProvider implements IRemoteSearchProvider {
	private static readonly TF_IDF_PRE_NORMALIZE_THRESHOLD = 50;
	private static readonly TF_IDF_POST_NORMALIZE_THRESHOLD = 0.7;
	private static readonly TF_IDF_MAX_PICKS = 5;

	private _currentPreferencesModel: ISettingsEditorModel | undefined;
	private _filter: string = '';
	private _documents: TfIdfDocument[] = [];
	private _settingsRecord: IStringDictionary<ISetting> = {};

	constructor() {
	}

	setFilter(filter: string) {
		this._filter = cleanFilter(filter);
	}

	keyToLabel(settingId: string): string {
		const label = settingId
			.replace(/[-._]/g, ' ')
			.replace(/([a-z]+)([A-Z])/g, '$1 $2')
			.replace(/([A-Za-z]+)(\d+)/g, '$1 $2')
			.replace(/(\d+)([A-Za-z]+)/g, '$1 $2')
			.toLowerCase();
		return label;
	}

	settingItemToEmbeddingString(item: ISetting): string {
		let result = `Setting Id: ${item.key}\n`;
		result += `Label: ${this.keyToLabel(item.key)}\n`;
		result += `Description: ${item.description}\n`;
		return result;
	}

	async searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter) {
			return null;
		}

		if (this._currentPreferencesModel !== preferencesModel) {
			// Refresh the documents and settings record
			this._currentPreferencesModel = preferencesModel;
			this._documents = [];
			this._settingsRecord = {};
			for (const group of preferencesModel.settingsGroups) {
				if (group.id === 'mostCommonlyUsed') {
					continue;
				}
				for (const section of group.sections) {
					for (const setting of section.settings) {
						this._documents.push({
							key: setting.key,
							textChunks: [this.settingItemToEmbeddingString(setting)]
						});
						this._settingsRecord[setting.key] = setting;
					}
				}
			}
		}

		return {
			filterMatches: await this.getTfIdfItems(token),
			exactMatch: false
		};
	}

	private async getTfIdfItems(token: CancellationToken): Promise<ISettingMatch[]> {
		const filterMatches: ISettingMatch[] = [];
		const tfIdfCalculator = new TfIdfCalculator();
		tfIdfCalculator.updateDocuments(this._documents);
		const tfIdfRankings = tfIdfCalculator.calculateScores(this._filter, token);
		tfIdfRankings.sort((a, b) => b.score - a.score);
		const maxScore = tfIdfRankings[0].score;

		if (maxScore < TfIdfSearchProvider.TF_IDF_PRE_NORMALIZE_THRESHOLD) {
			// Reject all the matches.
			return [];
		}

		for (const info of tfIdfRankings) {
			if (info.score / maxScore < TfIdfSearchProvider.TF_IDF_POST_NORMALIZE_THRESHOLD || filterMatches.length === TfIdfSearchProvider.TF_IDF_MAX_PICKS) {
				break;
			}
			const pick = info.key;
			filterMatches.push({
				setting: this._settingsRecord[pick],
				matches: [this._settingsRecord[pick].range],
				matchType: SettingMatchType.RemoteMatch,
				keyMatchScore: 0,
				score: info.score,
				providerName: TF_IDF_SEARCH_PROVIDER_NAME
			});
		}

		return filterMatches;
	}
}

class RemoteSearchProvider implements IRemoteSearchProvider {
	private _tfIdfSearchProvider: TfIdfSearchProvider;
	private _filter: string = '';

	constructor() {
		this._tfIdfSearchProvider = new TfIdfSearchProvider();
	}

	setFilter(filter: string): void {
		this._filter = filter;
		this._tfIdfSearchProvider.setFilter(filter);
	}

	async searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter) {
			return null;
		}

		const results = await this._tfIdfSearchProvider.searchModel(preferencesModel, token);
		return results;
	}
}

class AiSearchProvider implements IAiSearchProvider {
	private readonly _embeddingsSearchProvider: EmbeddingsSearchProvider;
	private readonly _recordProvider: SettingsRecordProvider;
	private _filter: string = '';

	constructor(
		@IAiSettingsSearchService private readonly aiSettingsSearchService: IAiSettingsSearchService
	) {
		this._embeddingsSearchProvider = new EmbeddingsSearchProvider(this.aiSettingsSearchService);
		this._recordProvider = new SettingsRecordProvider();
	}

	setFilter(filter: string): void {
		this._filter = filter;
		this._embeddingsSearchProvider.setFilter(filter);
	}

	async searchModel(preferencesModel: ISettingsEditorModel, token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter || !this.aiSettingsSearchService.isEnabled()) {
			return null;
		}

		this._recordProvider.updateModel(preferencesModel);
		const results = await this._embeddingsSearchProvider.searchModel(preferencesModel, token);
		return results;
	}

	async getLLMRankedResults(token: CancellationToken): Promise<ISearchResult | null> {
		if (!this._filter || !this.aiSettingsSearchService.isEnabled()) {
			return null;
		}

		const items = await this.getLLMRankedItems(token);
		return {
			filterMatches: items,
			exactMatch: false
		};
	}

	private async getLLMRankedItems(token: CancellationToken): Promise<ISettingMatch[]> {
		const settingsRecord = this._recordProvider.getSettingsRecord();
		const filterMatches: ISettingMatch[] = [];
		const settings = await this.aiSettingsSearchService.getLLMRankedResults(this._filter, token);
		if (!settings) {
			return [];
		}

		for (const settingKey of settings) {
			if (!settingsRecord[settingKey]) {
				// Non-existent setting.
				continue;
			}
			filterMatches.push({
				setting: settingsRecord[settingKey],
				matches: [settingsRecord[settingKey].range],
				matchType: SettingMatchType.RemoteMatch,
				keyMatchScore: 0,
				score: 0, // the results are sorted upstream.
				providerName: LLM_RANKED_SEARCH_PROVIDER_NAME
			});
		}

		return filterMatches;
	}
}

registerSingleton(IPreferencesSearchService, PreferencesSearchService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/preferences/browser/preferencesWidgets.ts]---
Location: vscode-main/src/vs/workbench/contrib/preferences/browser/preferencesWidgets.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as DOM from '../../../../base/browser/dom.js';
import { StandardKeyboardEvent } from '../../../../base/browser/keyboardEvent.js';
import { ActionBar, ActionsOrientation } from '../../../../base/browser/ui/actionbar/actionbar.js';
import { BaseActionViewItem, IActionViewItemOptions } from '../../../../base/browser/ui/actionbar/actionViewItems.js';
import type { IManagedHover } from '../../../../base/browser/ui/hover/hover.js';
import { getDefaultHoverDelegate } from '../../../../base/browser/ui/hover/hoverDelegateFactory.js';
import { HistoryInputBox, IHistoryInputOptions } from '../../../../base/browser/ui/inputbox/inputBox.js';
import { Widget } from '../../../../base/browser/ui/widget.js';
import { Action, IAction } from '../../../../base/common/actions.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { KeyCode } from '../../../../base/common/keyCodes.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { Schemas } from '../../../../base/common/network.js';
import { isEqual } from '../../../../base/common/resources.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { URI } from '../../../../base/common/uri.js';
import { ICodeEditor, IEditorMouseEvent, MouseTargetType } from '../../../../editor/browser/editorBrowser.js';
import { IEditorDecorationsCollection } from '../../../../editor/common/editorCommon.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IModelDeltaDecoration, TrackedRangeStickiness } from '../../../../editor/common/model.js';
import { localize } from '../../../../nls.js';
import { ConfigurationTarget } from '../../../../platform/configuration/common/configuration.js';
import { IContextKey, IContextKeyService } from '../../../../platform/contextkey/common/contextkey.js';
import { IContextMenuService, IContextViewService } from '../../../../platform/contextview/browser/contextView.js';
import { ContextScopedHistoryInputBox } from '../../../../platform/history/browser/contextScopedHistoryWidget.js';
import { showHistoryKeybindingHint } from '../../../../platform/history/browser/historyWidgetKeybindingHint.js';
import { IHoverService } from '../../../../platform/hover/browser/hover.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { asCssVariable, badgeBackground, badgeForeground, contrastBorder } from '../../../../platform/theme/common/colorRegistry.js';
import { isWorkspaceFolder, IWorkspaceContextService, IWorkspaceFolder, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { IWorkbenchEnvironmentService } from '../../../services/environment/common/environmentService.js';
import { settingsEditIcon, settingsScopeDropDownIcon } from './preferencesIcons.js';

export class FolderSettingsActionViewItem extends BaseActionViewItem {

	private _folder: IWorkspaceFolder | null;
	private _folderSettingCounts = new Map<string, number>();

	private container!: HTMLElement;
	private anchorElement!: HTMLElement;
	private anchorElementHover!: IManagedHover;
	private labelElement!: HTMLElement;
	private detailsElement!: HTMLElement;
	private dropDownElement!: HTMLElement;

	constructor(
		action: IAction,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IContextMenuService private readonly contextMenuService: IContextMenuService,
		@IHoverService private readonly hoverService: IHoverService,
	) {
		super(null, action);
		const workspace = this.contextService.getWorkspace();
		this._folder = workspace.folders.length === 1 ? workspace.folders[0] : null;
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.onWorkspaceFoldersChanged()));
	}

	get folder(): IWorkspaceFolder | null {
		return this._folder;
	}

	set folder(folder: IWorkspaceFolder | null) {
		this._folder = folder;
		this.update();
	}

	setCount(settingsTarget: URI, count: number): void {
		const workspaceFolder = this.contextService.getWorkspaceFolder(settingsTarget);
		if (!workspaceFolder) {
			throw new Error('unknown folder');
		}
		const folder = workspaceFolder.uri;
		this._folderSettingCounts.set(folder.toString(), count);
		this.update();
	}

	override render(container: HTMLElement): void {
		this.element = container;

		this.container = container;
		this.labelElement = DOM.$('.action-title');
		this.detailsElement = DOM.$('.action-details');
		this.dropDownElement = DOM.$('.dropdown-icon.hide' + ThemeIcon.asCSSSelector(settingsScopeDropDownIcon));
		this.anchorElement = DOM.$('a.action-label.folder-settings', {
			role: 'button',
			'aria-haspopup': 'true',
			'tabindex': '0'
		}, this.labelElement, this.detailsElement, this.dropDownElement);
		this.anchorElementHover = this._register(this.hoverService.setupManagedHover(getDefaultHoverDelegate('mouse'), this.anchorElement, ''));
		this._register(DOM.addDisposableListener(this.anchorElement, DOM.EventType.MOUSE_DOWN, e => DOM.EventHelper.stop(e)));
		this._register(DOM.addDisposableListener(this.anchorElement, DOM.EventType.CLICK, e => this.onClick(e)));
		this._register(DOM.addDisposableListener(this.container, DOM.EventType.KEY_UP, e => this.onKeyUp(e)));

		DOM.append(this.container, this.anchorElement);

		this.update();
	}

	private onKeyUp(event: KeyboardEvent): void {
		const keyboardEvent = new StandardKeyboardEvent(event);
		switch (keyboardEvent.keyCode) {
			case KeyCode.Enter:
			case KeyCode.Space:
				this.onClick(event);
				return;
		}
	}

	override onClick(event: DOM.EventLike): void {
		DOM.EventHelper.stop(event, true);
		if (!this.folder || this._action.checked) {
			this.showMenu();
		} else {
			this._action.run(this._folder);
		}
	}

	protected override updateEnabled(): void {
		this.update();
	}

	protected override updateChecked(): void {
		this.update();
	}

	private onWorkspaceFoldersChanged(): void {
		const oldFolder = this._folder;
		const workspace = this.contextService.getWorkspace();
		if (oldFolder) {
			this._folder = workspace.folders.filter(folder => isEqual(folder.uri, oldFolder.uri))[0] || workspace.folders[0];
		}
		this._folder = this._folder ? this._folder : workspace.folders.length === 1 ? workspace.folders[0] : null;

		this.update();

		if (this._action.checked) {
			this._action.run(this._folder);
		}
	}

	private update(): void {
		let total = 0;
		this._folderSettingCounts.forEach(n => total += n);

		const workspace = this.contextService.getWorkspace();
		if (this._folder) {
			this.labelElement.textContent = this._folder.name;
			this.anchorElementHover.update(this._folder.name);
			const detailsText = this.labelWithCount(this._action.label, total);
			this.detailsElement.textContent = detailsText;
			this.dropDownElement.classList.toggle('hide', workspace.folders.length === 1 || !this._action.checked);
		} else {
			const labelText = this.labelWithCount(this._action.label, total);
			this.labelElement.textContent = labelText;
			this.detailsElement.textContent = '';
			this.anchorElementHover.update(this._action.label);
			this.dropDownElement.classList.remove('hide');
		}

		this.anchorElement.classList.toggle('checked', this._action.checked);
		this.container.classList.toggle('disabled', !this._action.enabled);
	}

	private showMenu(): void {
		this.contextMenuService.showContextMenu({
			getAnchor: () => this.container,
			getActions: () => this.getDropdownMenuActions(),
			getActionViewItem: () => undefined,
			onHide: () => {
				this.anchorElement.blur();
			}
		});
	}

	private getDropdownMenuActions(): IAction[] {
		const actions: IAction[] = [];
		const workspaceFolders = this.contextService.getWorkspace().folders;
		if (this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE && workspaceFolders.length > 0) {
			actions.push(...workspaceFolders.map((folder, index) => {
				const folderCount = this._folderSettingCounts.get(folder.uri.toString());
				return {
					id: 'folderSettingsTarget' + index,
					label: this.labelWithCount(folder.name, folderCount),
					tooltip: this.labelWithCount(folder.name, folderCount),
					checked: !!this.folder && isEqual(this.folder.uri, folder.uri),
					enabled: true,
					class: undefined,
					run: () => this._action.run(folder)
				};
			}));
		}
		return actions;
	}

	private labelWithCount(label: string, count: number | undefined): string {
		// Append the count if it's >0 and not undefined
		if (count) {
			label += ` (${count})`;
		}

		return label;
	}
}

export type SettingsTarget = ConfigurationTarget.APPLICATION | ConfigurationTarget.USER_LOCAL | ConfigurationTarget.USER_REMOTE | ConfigurationTarget.WORKSPACE | URI;

export interface ISettingsTargetsWidgetOptions {
	enableRemoteSettings?: boolean;
}

export class SettingsTargetsWidget extends Widget {

	private settingsSwitcherBar!: ActionBar;
	private userLocalSettings!: Action;
	private userRemoteSettings!: Action;
	private workspaceSettings!: Action;
	private folderSettingsAction!: Action;
	private folderSettings!: FolderSettingsActionViewItem;
	private options: ISettingsTargetsWidgetOptions;

	private _settingsTarget: SettingsTarget | null = null;

	private readonly _onDidTargetChange = this._register(new Emitter<SettingsTarget>());
	readonly onDidTargetChange: Event<SettingsTarget> = this._onDidTargetChange.event;

	constructor(
		parent: HTMLElement,
		options: ISettingsTargetsWidgetOptions | undefined,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IWorkbenchEnvironmentService private readonly environmentService: IWorkbenchEnvironmentService,
		@ILabelService private readonly labelService: ILabelService,
		@ILanguageService private readonly languageService: ILanguageService
	) {
		super();
		this.options = options ?? {};
		this.create(parent);
		this._register(this.contextService.onDidChangeWorkbenchState(() => this.onWorkbenchStateChanged()));
		this._register(this.contextService.onDidChangeWorkspaceFolders(() => this.update()));
	}

	private resetLabels() {
		const remoteAuthority = this.environmentService.remoteAuthority;
		const hostLabel = remoteAuthority && this.labelService.getHostLabel(Schemas.vscodeRemote, remoteAuthority);
		this.userLocalSettings.label = localize('userSettings', "User");
		this.userRemoteSettings.label = localize('userSettingsRemote', "Remote") + (hostLabel ? ` [${hostLabel}]` : '');
		this.workspaceSettings.label = localize('workspaceSettings', "Workspace");
		this.folderSettingsAction.label = localize('folderSettings', "Folder");
	}

	private create(parent: HTMLElement): void {
		const settingsTabsWidget = DOM.append(parent, DOM.$('.settings-tabs-widget'));
		this.settingsSwitcherBar = this._register(new ActionBar(settingsTabsWidget, {
			orientation: ActionsOrientation.HORIZONTAL,
			focusOnlyEnabledItems: true,
			ariaLabel: localize('settingsSwitcherBarAriaLabel', "Settings Switcher"),
			ariaRole: 'tablist',
			actionViewItemProvider: (action: IAction, options: IActionViewItemOptions) => action.id === 'folderSettings' ? this.folderSettings : undefined
		}));

		this.userLocalSettings = this._register(new Action('userSettings', '', '.settings-tab', true, () => this.updateTarget(ConfigurationTarget.USER_LOCAL)));
		this.userLocalSettings.tooltip = localize('userSettings', "User");

		this.userRemoteSettings = this._register(new Action('userSettingsRemote', '', '.settings-tab', true, () => this.updateTarget(ConfigurationTarget.USER_REMOTE)));
		const remoteAuthority = this.environmentService.remoteAuthority;
		const hostLabel = remoteAuthority && this.labelService.getHostLabel(Schemas.vscodeRemote, remoteAuthority);
		this.userRemoteSettings.tooltip = localize('userSettingsRemote', "Remote") + (hostLabel ? ` [${hostLabel}]` : '');

		this.workspaceSettings = this._register(new Action('workspaceSettings', '', '.settings-tab', false, () => this.updateTarget(ConfigurationTarget.WORKSPACE)));

		this.folderSettingsAction = this._register(new Action('folderSettings', '', '.settings-tab', false, async folder => {
			this.updateTarget(isWorkspaceFolder(folder) ? folder.uri : ConfigurationTarget.USER_LOCAL);
		}));
		this.folderSettings = this._register(this.instantiationService.createInstance(FolderSettingsActionViewItem, this.folderSettingsAction));

		this.resetLabels();
		this.update();

		this.settingsSwitcherBar.push([this.userLocalSettings, this.userRemoteSettings, this.workspaceSettings, this.folderSettingsAction]);
	}

	get settingsTarget(): SettingsTarget | null {
		return this._settingsTarget;
	}

	set settingsTarget(settingsTarget: SettingsTarget | null) {
		this._settingsTarget = settingsTarget;
		this.userLocalSettings.checked = ConfigurationTarget.USER_LOCAL === this.settingsTarget;
		this.userRemoteSettings.checked = ConfigurationTarget.USER_REMOTE === this.settingsTarget;
		this.workspaceSettings.checked = ConfigurationTarget.WORKSPACE === this.settingsTarget;
		if (this.settingsTarget instanceof URI) {
			this.folderSettings.action.checked = true;
			this.folderSettings.folder = this.contextService.getWorkspaceFolder(this.settingsTarget as URI);
		} else {
			this.folderSettings.action.checked = false;
		}
	}

	setResultCount(settingsTarget: SettingsTarget, count: number): void {
		if (settingsTarget === ConfigurationTarget.WORKSPACE) {
			let label = localize('workspaceSettings', "Workspace");
			if (count) {
				label += ` (${count})`;
			}

			this.workspaceSettings.label = label;
		} else if (settingsTarget === ConfigurationTarget.USER_LOCAL) {
			let label = localize('userSettings', "User");
			if (count) {
				label += ` (${count})`;
			}

			this.userLocalSettings.label = label;
		} else if (settingsTarget instanceof URI) {
			this.folderSettings.setCount(settingsTarget, count);
		}
	}

	updateLanguageFilterIndicators(filter: string | undefined) {
		this.resetLabels();
		if (filter) {
			const languageToUse = this.languageService.getLanguageName(filter);
			if (languageToUse) {
				const languageSuffix = ` [${languageToUse}]`;
				this.userLocalSettings.label += languageSuffix;
				this.userRemoteSettings.label += languageSuffix;
				this.workspaceSettings.label += languageSuffix;
				this.folderSettingsAction.label += languageSuffix;
			}
		}
	}

	private onWorkbenchStateChanged(): void {
		this.folderSettings.folder = null;
		this.update();
		if (this.settingsTarget === ConfigurationTarget.WORKSPACE && this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE) {
			this.updateTarget(ConfigurationTarget.USER_LOCAL);
		}
	}

	updateTarget(settingsTarget: SettingsTarget): Promise<void> {
		const isSameTarget = this.settingsTarget === settingsTarget ||
			settingsTarget instanceof URI &&
			this.settingsTarget instanceof URI &&
			isEqual(this.settingsTarget, settingsTarget);

		if (!isSameTarget) {
			this.settingsTarget = settingsTarget;
			this._onDidTargetChange.fire(this.settingsTarget);
		}

		return Promise.resolve(undefined);
	}

	private async update(): Promise<void> {
		this.settingsSwitcherBar.domNode.classList.toggle('empty-workbench', this.contextService.getWorkbenchState() === WorkbenchState.EMPTY);
		this.userRemoteSettings.enabled = !!(this.options.enableRemoteSettings && this.environmentService.remoteAuthority);
		this.workspaceSettings.enabled = this.contextService.getWorkbenchState() !== WorkbenchState.EMPTY;
		this.folderSettings.action.enabled = this.contextService.getWorkbenchState() === WorkbenchState.WORKSPACE && this.contextService.getWorkspace().folders.length > 0;

		this.workspaceSettings.tooltip = localize('workspaceSettings', "Workspace");
	}
}

export interface SearchOptions extends IHistoryInputOptions {
	focusKey?: IContextKey<boolean>;
	showResultCount?: boolean;
	ariaLive?: string;
	ariaLabelledBy?: string;
}

export class SearchWidget extends Widget {

	domNode!: HTMLElement;

	private countElement!: HTMLElement;
	private searchContainer!: HTMLElement;
	inputBox!: HistoryInputBox;
	private controlsDiv!: HTMLElement;

	private readonly _onDidChange: Emitter<string> = this._register(new Emitter<string>());
	public get onDidChange(): Event<string> { return this._onDidChange.event; }

	private readonly _onFocus: Emitter<void> = this._register(new Emitter<void>());
	public get onFocus(): Event<void> { return this._onFocus.event; }

	constructor(parent: HTMLElement, protected options: SearchOptions,
		@IContextViewService private readonly contextViewService: IContextViewService,
		@IInstantiationService protected instantiationService: IInstantiationService,
		@IContextKeyService private readonly contextKeyService: IContextKeyService,
		@IKeybindingService protected readonly keybindingService: IKeybindingService
	) {
		super();
		this.create(parent);
	}

	private create(parent: HTMLElement) {
		this.domNode = DOM.append(parent, DOM.$('div.settings-header-widget'));
		this.createSearchContainer(DOM.append(this.domNode, DOM.$('div.settings-search-container')));
		this.controlsDiv = DOM.append(this.domNode, DOM.$('div.settings-search-controls'));

		if (this.options.showResultCount) {
			this.countElement = DOM.append(this.controlsDiv, DOM.$('.settings-count-widget'));

			this.countElement.style.backgroundColor = asCssVariable(badgeBackground);
			this.countElement.style.color = asCssVariable(badgeForeground);
			this.countElement.style.border = `1px solid ${asCssVariable(contrastBorder)}`;
		}

		this.inputBox.inputElement.setAttribute('aria-live', this.options.ariaLive || 'off');
		if (this.options.ariaLabelledBy) {
			this.inputBox.inputElement.setAttribute('aria-labelledBy', this.options.ariaLabelledBy);
		}
		const focusTracker = this._register(DOM.trackFocus(this.inputBox.inputElement));
		this._register(focusTracker.onDidFocus(() => this._onFocus.fire()));

		const focusKey = this.options.focusKey;
		if (focusKey) {
			this._register(focusTracker.onDidFocus(() => focusKey.set(true)));
			this._register(focusTracker.onDidBlur(() => focusKey.set(false)));
		}
	}

	private createSearchContainer(searchContainer: HTMLElement) {
		this.searchContainer = searchContainer;
		const searchInput = DOM.append(this.searchContainer, DOM.$('div.settings-search-input'));
		this.inputBox = this._register(this.createInputBox(searchInput));
		this._register(this.inputBox.onDidChange(value => this._onDidChange.fire(value)));
	}

	protected createInputBox(parent: HTMLElement): HistoryInputBox {
		const showHistoryHint = () => showHistoryKeybindingHint(this.keybindingService);
		return new ContextScopedHistoryInputBox(parent, this.contextViewService, { ...this.options, showHistoryHint }, this.contextKeyService);
	}

	showMessage(message: string): void {
		// Avoid setting the aria-label unnecessarily, the screenreader will read the count every time it's set, since it's aria-live:assertive. #50968
		if (this.countElement && message !== this.countElement.textContent) {
			this.countElement.textContent = message;
			this.inputBox.inputElement.setAttribute('aria-label', message);
			this.inputBox.inputElement.style.paddingRight = this.getControlsWidth() + 'px';
		}
	}

	layout(dimension: DOM.Dimension) {
		if (dimension.width < 400) {
			this.countElement?.classList.add('hide');

			this.inputBox.inputElement.style.paddingRight = '0px';
		} else {
			this.countElement?.classList.remove('hide');

			this.inputBox.inputElement.style.paddingRight = this.getControlsWidth() + 'px';
		}
	}

	private getControlsWidth(): number {
		const countWidth = this.countElement ? DOM.getTotalWidth(this.countElement) : 0;
		return countWidth + 20;
	}

	focus() {
		this.inputBox.focus();
		if (this.getValue()) {
			this.inputBox.select();
		}
	}

	hasFocus(): boolean {
		return this.inputBox.hasFocus();
	}

	clear() {
		this.inputBox.value = '';
	}

	getValue(): string {
		return this.inputBox.value;
	}

	setValue(value: string): string {
		return this.inputBox.value = value;
	}

	override dispose(): void {
		this.options.focusKey?.set(false);
		super.dispose();
	}
}

export class EditPreferenceWidget<T> extends Disposable {

	private _line: number = -1;
	private _preferences: T[] = [];

	private readonly _editPreferenceDecoration: IEditorDecorationsCollection;

	private readonly _onClick = this._register(new Emitter<IEditorMouseEvent>());
	readonly onClick: Event<IEditorMouseEvent> = this._onClick.event;

	constructor(private editor: ICodeEditor) {
		super();
		this._editPreferenceDecoration = this.editor.createDecorationsCollection();
		this._register(this.editor.onMouseDown((e: IEditorMouseEvent) => {
			if (e.target.type !== MouseTargetType.GUTTER_GLYPH_MARGIN || e.target.detail.isAfterLines || !this.isVisible()) {
				return;
			}
			this._onClick.fire(e);
		}));
	}

	get preferences(): T[] {
		return this._preferences;
	}

	getLine(): number {
		return this._line;
	}

	show(line: number, hoverMessage: string, preferences: T[]): void {
		this._preferences = preferences;
		const newDecoration: IModelDeltaDecoration[] = [];
		this._line = line;
		newDecoration.push({
			options: {
				description: 'edit-preference-widget-decoration',
				glyphMarginClassName: ThemeIcon.asClassName(settingsEditIcon),
				glyphMarginHoverMessage: new MarkdownString().appendText(hoverMessage),
				stickiness: TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
			},
			range: {
				startLineNumber: line,
				startColumn: 1,
				endLineNumber: line,
				endColumn: 1
			}
		});
		this._editPreferenceDecoration.set(newDecoration);
	}

	hide(): void {
		this._editPreferenceDecoration.clear();
	}

	isVisible(): boolean {
		return this._editPreferenceDecoration.length > 0;
	}

	override dispose(): void {
		this.hide();
		super.dispose();
	}
}
```

--------------------------------------------------------------------------------

````
