---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 396
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 396 of 552)

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

---[FILE: src/vs/workbench/contrib/files/browser/explorerViewlet.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/explorerViewlet.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import './media/explorerviewlet.css';
import { localize, localize2 } from '../../../../nls.js';
import { mark } from '../../../../base/common/performance.js';
import { VIEWLET_ID, VIEW_ID, IFilesConfiguration, ExplorerViewletVisibleContext } from '../common/files.js';
import { IViewletViewOptions } from '../../../browser/parts/views/viewsViewlet.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ExplorerView } from './views/explorerView.js';
import { EmptyView } from './views/emptyView.js';
import { OpenEditorsView } from './views/openEditorsView.js';
import { IStorageService } from '../../../../platform/storage/common/storage.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IExtensionService } from '../../../services/extensions/common/extensions.js';
import { IWorkspaceContextService, WorkbenchState } from '../../../../platform/workspace/common/workspace.js';
import { ITelemetryService } from '../../../../platform/telemetry/common/telemetry.js';
import { IContextKeyService, IContextKey, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IThemeService } from '../../../../platform/theme/common/themeService.js';
import { IViewsRegistry, IViewDescriptor, Extensions, ViewContainer, IViewContainersRegistry, ViewContainerLocation, IViewDescriptorService, ViewContentGroups } from '../../../common/views.js';
import { IContextMenuService } from '../../../../platform/contextview/browser/contextView.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { IWorkbenchLayoutService } from '../../../services/layout/browser/layoutService.js';
import { ViewPaneContainer } from '../../../browser/parts/views/viewPaneContainer.js';
import { ViewPane } from '../../../browser/parts/views/viewPane.js';
import { KeyChord, KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IProgressService, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { WorkbenchStateContext, RemoteNameContext, OpenFolderWorkspaceSupportContext } from '../../../common/contextkeys.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { AddRootFolderAction, OpenFolderAction, OpenFolderViaWorkspaceAction } from '../../../browser/actions/workspaceActions.js';
import { OpenRecentAction } from '../../../browser/actions/windowActions.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { registerIcon } from '../../../../platform/theme/common/iconRegistry.js';
import { isMouseEvent } from '../../../../base/browser/dom.js';
import { ILogService } from '../../../../platform/log/common/log.js';

const explorerViewIcon = registerIcon('explorer-view-icon', Codicon.files, localize('explorerViewIcon', 'View icon of the explorer view.'));
const openEditorsViewIcon = registerIcon('open-editors-view-icon', Codicon.book, localize('openEditorsIcon', 'View icon of the open editors view.'));

export class ExplorerViewletViewsContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.explorerViewletViews';

	constructor(
		@IWorkspaceContextService private readonly workspaceContextService: IWorkspaceContextService,
		@IProgressService progressService: IProgressService
	) {
		super();

		progressService.withProgress({ location: ProgressLocation.Explorer }, () => workspaceContextService.getCompleteWorkspace()).finally(() => {
			this.registerViews();

			this._register(workspaceContextService.onDidChangeWorkbenchState(() => this.registerViews()));
			this._register(workspaceContextService.onDidChangeWorkspaceFolders(() => this.registerViews()));
		});
	}

	private registerViews(): void {
		mark('code/willRegisterExplorerViews');

		const viewDescriptors = viewsRegistry.getViews(VIEW_CONTAINER);

		const viewDescriptorsToRegister: IViewDescriptor[] = [];
		const viewDescriptorsToDeregister: IViewDescriptor[] = [];

		const openEditorsViewDescriptor = this.createOpenEditorsViewDescriptor();
		if (!viewDescriptors.some(v => v.id === openEditorsViewDescriptor.id)) {
			viewDescriptorsToRegister.push(openEditorsViewDescriptor);
		}

		const explorerViewDescriptor = this.createExplorerViewDescriptor();
		const registeredExplorerViewDescriptor = viewDescriptors.find(v => v.id === explorerViewDescriptor.id);
		const emptyViewDescriptor = this.createEmptyViewDescriptor();
		const registeredEmptyViewDescriptor = viewDescriptors.find(v => v.id === emptyViewDescriptor.id);

		if (this.workspaceContextService.getWorkbenchState() === WorkbenchState.EMPTY || this.workspaceContextService.getWorkspace().folders.length === 0) {
			if (registeredExplorerViewDescriptor) {
				viewDescriptorsToDeregister.push(registeredExplorerViewDescriptor);
			}
			if (!registeredEmptyViewDescriptor) {
				viewDescriptorsToRegister.push(emptyViewDescriptor);
			}
		} else {
			if (registeredEmptyViewDescriptor) {
				viewDescriptorsToDeregister.push(registeredEmptyViewDescriptor);
			}
			if (!registeredExplorerViewDescriptor) {
				viewDescriptorsToRegister.push(explorerViewDescriptor);
			}
		}

		if (viewDescriptorsToDeregister.length) {
			viewsRegistry.deregisterViews(viewDescriptorsToDeregister, VIEW_CONTAINER);
		}
		if (viewDescriptorsToRegister.length) {
			viewsRegistry.registerViews(viewDescriptorsToRegister, VIEW_CONTAINER);
		}

		mark('code/didRegisterExplorerViews');
	}

	private createOpenEditorsViewDescriptor(): IViewDescriptor {
		return {
			id: OpenEditorsView.ID,
			name: OpenEditorsView.NAME,
			ctorDescriptor: new SyncDescriptor(OpenEditorsView),
			containerIcon: openEditorsViewIcon,
			order: 0,
			canToggleVisibility: true,
			canMoveView: true,
			collapsed: false,
			hideByDefault: true,
			focusCommand: {
				id: 'workbench.files.action.focusOpenEditorsView',
				keybindings: { primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyE) }
			}
		};
	}

	private createEmptyViewDescriptor(): IViewDescriptor {
		return {
			id: EmptyView.ID,
			name: EmptyView.NAME,
			containerIcon: explorerViewIcon,
			ctorDescriptor: new SyncDescriptor(EmptyView),
			order: 1,
			canToggleVisibility: true,
			focusCommand: {
				id: 'workbench.explorer.fileView.focus'
			}
		};
	}

	private createExplorerViewDescriptor(): IViewDescriptor {
		return {
			id: VIEW_ID,
			name: localize2('folders', "Folders"),
			containerIcon: explorerViewIcon,
			ctorDescriptor: new SyncDescriptor(ExplorerView),
			order: 1,
			canMoveView: true,
			canToggleVisibility: false,
			focusCommand: {
				id: 'workbench.explorer.fileView.focus'
			}
		};
	}
}

export class ExplorerViewPaneContainer extends ViewPaneContainer {

	private viewletVisibleContextKey: IContextKey<boolean>;

	constructor(
		@IWorkbenchLayoutService layoutService: IWorkbenchLayoutService,
		@ITelemetryService telemetryService: ITelemetryService,
		@IWorkspaceContextService contextService: IWorkspaceContextService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService configurationService: IConfigurationService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@IContextMenuService contextMenuService: IContextMenuService,
		@IExtensionService extensionService: IExtensionService,
		@IViewDescriptorService viewDescriptorService: IViewDescriptorService,
		@ILogService logService: ILogService,
	) {

		super(VIEWLET_ID, { mergeViewWithContainerWhenSingleView: true }, instantiationService, configurationService, layoutService, contextMenuService, telemetryService, extensionService, themeService, storageService, contextService, viewDescriptorService, logService);

		this.viewletVisibleContextKey = ExplorerViewletVisibleContext.bindTo(contextKeyService);
		this._register(this.contextService.onDidChangeWorkspaceName(e => this.updateTitleArea()));
	}

	override create(parent: HTMLElement): void {
		super.create(parent);
		parent.classList.add('explorer-viewlet');
	}

	protected override createView(viewDescriptor: IViewDescriptor, options: IViewletViewOptions): ViewPane {
		if (viewDescriptor.id === VIEW_ID) {
			return this.instantiationService.createInstance(ExplorerView, {
				...options, delegate: {
					willOpenElement: e => {
						if (!isMouseEvent(e)) {
							return; // only delay when user clicks
						}

						const openEditorsView = this.getOpenEditorsView();
						if (openEditorsView) {
							let delay = 0;

							const config = this.configurationService.getValue<IFilesConfiguration>();
							if (config.workbench?.editor?.enablePreview) {
								// delay open editors view when preview is enabled
								// to accomodate for the user doing a double click
								// to pin the editor.
								// without this delay a double click would be not
								// possible because the next element would move
								// under the mouse after the first click.
								delay = 250;
							}

							openEditorsView.setStructuralRefreshDelay(delay);
						}
					},
					didOpenElement: e => {
						if (!isMouseEvent(e)) {
							return; // only delay when user clicks
						}

						const openEditorsView = this.getOpenEditorsView();
						openEditorsView?.setStructuralRefreshDelay(0);
					}
				}
			});
		}
		return super.createView(viewDescriptor, options);
	}

	getExplorerView(): ExplorerView {
		return <ExplorerView>this.getView(VIEW_ID);
	}

	getOpenEditorsView(): OpenEditorsView {
		return <OpenEditorsView>this.getView(OpenEditorsView.ID);
	}

	override setVisible(visible: boolean): void {
		this.viewletVisibleContextKey.set(visible);
		super.setVisible(visible);
	}

	override focus(): void {
		const explorerView = this.getView(VIEW_ID);
		if (explorerView && this.panes.every(p => !p.isExpanded())) {
			explorerView.setExpanded(true);
		}
		if (explorerView?.isExpanded()) {
			explorerView.focus();
		} else {
			super.focus();
		}
	}
}

const viewContainerRegistry = Registry.as<IViewContainersRegistry>(Extensions.ViewContainersRegistry);

/**
 * Explorer viewlet container.
 */
export const VIEW_CONTAINER: ViewContainer = viewContainerRegistry.registerViewContainer({
	id: VIEWLET_ID,
	title: localize2('explore', "Explorer"),
	ctorDescriptor: new SyncDescriptor(ExplorerViewPaneContainer),
	storageId: 'workbench.explorer.views.state',
	icon: explorerViewIcon,
	alwaysUseContainerInfo: true,
	hideIfEmpty: true,
	order: 0,
	openCommandActionDescriptor: {
		id: VIEWLET_ID,
		title: localize2('explore', "Explorer"),
		mnemonicTitle: localize({ key: 'miViewExplorer', comment: ['&& denotes a mnemonic'] }, "&&Explorer"),
		keybindings: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyE },
		order: 0
	},
}, ViewContainerLocation.Sidebar, { isDefault: true });

const openFolder = localize('openFolder', "Open Folder");
const addAFolder = localize('addAFolder', "add a folder");
const openRecent = localize('openRecent', "Open Recent");

const addRootFolderButton = `[${openFolder}](command:${AddRootFolderAction.ID})`;
const addAFolderButton = `[${addAFolder}](command:${AddRootFolderAction.ID})`;
const openFolderButton = `[${openFolder}](command:${OpenFolderAction.ID})`;
const openFolderViaWorkspaceButton = `[${openFolder}](command:${OpenFolderViaWorkspaceAction.ID})`;
const openRecentButton = `[${openRecent}](command:${OpenRecentAction.ID})`;

const viewsRegistry = Registry.as<IViewsRegistry>(Extensions.ViewsRegistry);
viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'noWorkspaceHelp', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change'] },
		"You have not yet added a folder to the workspace.\n{0}", addRootFolderButton),
	when: ContextKeyExpr.and(
		// inside a .code-workspace
		WorkbenchStateContext.isEqualTo('workspace'),
		// unless we cannot enter or open workspaces (e.g. web serverless)
		OpenFolderWorkspaceSupportContext
	),
	group: ViewContentGroups.Open,
	order: 1
});

viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'noFolderHelpWeb', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change'] },
		"You have not yet opened a folder.\n{0}\n{1}", openFolderViaWorkspaceButton, openRecentButton),
	when: ContextKeyExpr.and(
		// inside a .code-workspace
		WorkbenchStateContext.isEqualTo('workspace'),
		// we cannot enter workspaces (e.g. web serverless)
		OpenFolderWorkspaceSupportContext.toNegated()
	),
	group: ViewContentGroups.Open,
	order: 1
});

viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'remoteNoFolderHelp', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change'] },
		"Connected to remote.\n{0}", openFolderButton),
	when: ContextKeyExpr.and(
		// not inside a .code-workspace
		WorkbenchStateContext.notEqualsTo('workspace'),
		// connected to a remote
		RemoteNameContext.notEqualsTo(''),
		// but not in web
		IsWebContext.toNegated()),
	group: ViewContentGroups.Open,
	order: 1
});

viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'noFolderButEditorsHelp', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change'] },
		"You have not yet opened a folder.\n{0}\nOpening a folder will close all currently open editors. To keep them open, {1} instead.", openFolderButton, addAFolderButton),
	when: ContextKeyExpr.and(
		// editors are opened
		ContextKeyExpr.has('editorIsOpen'),
		ContextKeyExpr.or(
			// not inside a .code-workspace and local
			ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('workspace'), RemoteNameContext.isEqualTo('')),
			// not inside a .code-workspace and web
			ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('workspace'), IsWebContext)
		)
	),
	group: ViewContentGroups.Open,
	order: 1
});

viewsRegistry.registerViewWelcomeContent(EmptyView.ID, {
	content: localize({ key: 'noFolderHelp', comment: ['Please do not translate the word "command", it is part of our internal syntax which must not change'] },
		"You have not yet opened a folder.\n{0}", openFolderButton),
	when: ContextKeyExpr.and(
		// no editor is open
		ContextKeyExpr.has('editorIsOpen')?.negate(),
		ContextKeyExpr.or(
			// not inside a .code-workspace and local
			ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('workspace'), RemoteNameContext.isEqualTo('')),
			// not inside a .code-workspace and web
			ContextKeyExpr.and(WorkbenchStateContext.notEqualsTo('workspace'), IsWebContext)
		)
	),
	group: ViewContentGroups.Open,
	order: 1
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/fileActions.contribution.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/fileActions.contribution.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { ToggleAutoSaveAction, FocusFilesExplorer, GlobalCompareResourcesAction, ShowActiveFileInExplorer, CompareWithClipboardAction, NEW_FILE_COMMAND_ID, NEW_FILE_LABEL, NEW_FOLDER_COMMAND_ID, NEW_FOLDER_LABEL, TRIGGER_RENAME_LABEL, MOVE_FILE_TO_TRASH_LABEL, COPY_FILE_LABEL, PASTE_FILE_LABEL, FileCopiedContext, renameHandler, moveFileToTrashHandler, copyFileHandler, pasteFileHandler, deleteFileHandler, cutFileHandler, DOWNLOAD_COMMAND_ID, openFilePreserveFocusHandler, DOWNLOAD_LABEL, OpenActiveFileInEmptyWorkspace, UPLOAD_COMMAND_ID, UPLOAD_LABEL, CompareNewUntitledTextFilesAction, SetActiveEditorReadonlyInSession, SetActiveEditorWriteableInSession, ToggleActiveEditorReadonlyInSession, ResetActiveEditorReadonlyInSession } from './fileActions.js';
import { revertLocalChangesCommand, acceptLocalChangesCommand, CONFLICT_RESOLUTION_CONTEXT } from './editors/textFileSaveErrorHandler.js';
import { MenuId, MenuRegistry, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { ICommandAction } from '../../../../platform/action/common/action.js';
import { KeyMod, KeyCode } from '../../../../base/common/keyCodes.js';
import { openWindowCommand, newWindowCommand } from './fileCommands.js';
import { COPY_PATH_COMMAND_ID, REVEAL_IN_EXPLORER_COMMAND_ID, OPEN_TO_SIDE_COMMAND_ID, REVERT_FILE_COMMAND_ID, SAVE_FILE_COMMAND_ID, SAVE_FILE_LABEL, SAVE_FILE_AS_COMMAND_ID, SAVE_FILE_AS_LABEL, SAVE_ALL_IN_GROUP_COMMAND_ID, OpenEditorsGroupContext, COMPARE_WITH_SAVED_COMMAND_ID, COMPARE_RESOURCE_COMMAND_ID, SELECT_FOR_COMPARE_COMMAND_ID, ResourceSelectedForCompareContext, OpenEditorsDirtyEditorContext, COMPARE_SELECTED_COMMAND_ID, REMOVE_ROOT_FOLDER_COMMAND_ID, REMOVE_ROOT_FOLDER_LABEL, SAVE_FILES_COMMAND_ID, COPY_RELATIVE_PATH_COMMAND_ID, SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID, SAVE_FILE_WITHOUT_FORMATTING_LABEL, OpenEditorsReadonlyEditorContext, OPEN_WITH_EXPLORER_COMMAND_ID, NEW_UNTITLED_FILE_COMMAND_ID, NEW_UNTITLED_FILE_LABEL, SAVE_ALL_COMMAND_ID, OpenEditorsSelectedFileOrUntitledContext } from './fileConstants.js';
import { CommandsRegistry, ICommandHandler } from '../../../../platform/commands/common/commands.js';
import { ContextKeyExpr, ContextKeyExpression } from '../../../../platform/contextkey/common/contextkey.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { FilesExplorerFocusCondition, ExplorerRootContext, ExplorerFolderContext, ExplorerResourceWritableContext, ExplorerResourceCut, ExplorerResourceMoveableToTrash, ExplorerResourceAvailableEditorIdsContext, FoldersViewVisibleContext } from '../common/files.js';
import { ADD_ROOT_FOLDER_COMMAND_ID, ADD_ROOT_FOLDER_LABEL } from '../../../browser/actions/workspaceCommands.js';
import { CLOSE_SAVED_EDITORS_COMMAND_ID, CLOSE_EDITORS_IN_GROUP_COMMAND_ID, CLOSE_EDITOR_COMMAND_ID, CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID, REOPEN_WITH_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { AutoSaveAfterShortDelayContext } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { WorkbenchListDoubleSelection } from '../../../../platform/list/browser/listService.js';
import { Schemas } from '../../../../base/common/network.js';
import { DirtyWorkingCopiesContext, EnterMultiRootWorkspaceSupportContext, HasWebFileSystemAccess, WorkbenchStateContext, WorkspaceFolderCountContext, SidebarFocusContext, ActiveEditorCanRevertContext, ActiveEditorContext, ResourceContextKey, ActiveEditorAvailableEditorIdsContext, MultipleEditorsSelectedInGroupContext, TwoEditorsSelectedInGroupContext, SelectedEditorsInGroupFileOrUntitledResourceContextKey } from '../../../common/contextkeys.js';
import { IsWebContext } from '../../../../platform/contextkey/common/contextkeys.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { IExplorerService } from './files.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';

// Contribute Global Actions

registerAction2(GlobalCompareResourcesAction);
registerAction2(FocusFilesExplorer);
registerAction2(ShowActiveFileInExplorer);
registerAction2(CompareWithClipboardAction);
registerAction2(CompareNewUntitledTextFilesAction);
registerAction2(ToggleAutoSaveAction);
registerAction2(OpenActiveFileInEmptyWorkspace);
registerAction2(SetActiveEditorReadonlyInSession);
registerAction2(SetActiveEditorWriteableInSession);
registerAction2(ToggleActiveEditorReadonlyInSession);
registerAction2(ResetActiveEditorReadonlyInSession);

// Commands
CommandsRegistry.registerCommand('_files.windowOpen', openWindowCommand);
CommandsRegistry.registerCommand('_files.newWindow', newWindowCommand);

const explorerCommandsWeightBonus = 10; // give our commands a little bit more weight over other default list/tree commands

const RENAME_ID = 'renameFile';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: RENAME_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerRootContext.toNegated(), ExplorerResourceWritableContext),
	primary: KeyCode.F2,
	mac: {
		primary: KeyCode.Enter
	},
	handler: renameHandler
});

const MOVE_FILE_TO_TRASH_ID = 'moveFileToTrash';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: MOVE_FILE_TO_TRASH_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerResourceMoveableToTrash),
	primary: KeyCode.Delete,
	mac: {
		primary: KeyMod.CtrlCmd | KeyCode.Backspace,
		secondary: [KeyCode.Delete]
	},
	handler: moveFileToTrashHandler
});

const DELETE_FILE_ID = 'deleteFile';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: DELETE_FILE_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: FilesExplorerFocusCondition,
	primary: KeyMod.Shift | KeyCode.Delete,
	mac: {
		primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.Backspace
	},
	handler: deleteFileHandler
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: DELETE_FILE_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerResourceMoveableToTrash.toNegated()),
	primary: KeyCode.Delete,
	mac: {
		primary: KeyMod.CtrlCmd | KeyCode.Backspace
	},
	handler: deleteFileHandler
});

const CUT_FILE_ID = 'filesExplorer.cut';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: CUT_FILE_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerRootContext.toNegated(), ExplorerResourceWritableContext),
	primary: KeyMod.CtrlCmd | KeyCode.KeyX,
	handler: cutFileHandler,
});

const COPY_FILE_ID = 'filesExplorer.copy';
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: COPY_FILE_ID,
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerRootContext.toNegated()),
	primary: KeyMod.CtrlCmd | KeyCode.KeyC,
	handler: copyFileHandler,
});

const PASTE_FILE_ID = 'filesExplorer.paste';

CommandsRegistry.registerCommand(PASTE_FILE_ID, pasteFileHandler);

KeybindingsRegistry.registerKeybindingRule({
	id: `^${PASTE_FILE_ID}`, // the `^` enables pasting files into the explorer by preventing default bubble up
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerResourceWritableContext),
	primary: KeyMod.CtrlCmd | KeyCode.KeyV,
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'filesExplorer.cancelCut',
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerResourceCut),
	primary: KeyCode.Escape,
	handler: async (accessor: ServicesAccessor) => {
		const explorerService = accessor.get(IExplorerService);
		await explorerService.setToCopy([], true);
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: 'filesExplorer.openFilePreserveFocus',
	weight: KeybindingWeight.WorkbenchContrib + explorerCommandsWeightBonus,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerFolderContext.toNegated()),
	primary: KeyCode.Space,
	handler: openFilePreserveFocusHandler
});

const copyPathCommand = {
	id: COPY_PATH_COMMAND_ID,
	title: nls.localize('copyPath', "Copy Path")
};

const copyRelativePathCommand = {
	id: COPY_RELATIVE_PATH_COMMAND_ID,
	title: nls.localize('copyRelativePath', "Copy Relative Path")
};

export const revealInSideBarCommand = {
	id: REVEAL_IN_EXPLORER_COMMAND_ID,
	title: nls.localize('revealInSideBar', "Reveal in Explorer View")
};

// Editor Title Context Menu
appendEditorTitleContextMenuItem(COPY_PATH_COMMAND_ID, copyPathCommand.title, ResourceContextKey.IsFileSystemResource, '1_cutcopypaste', true);
appendEditorTitleContextMenuItem(COPY_RELATIVE_PATH_COMMAND_ID, copyRelativePathCommand.title, ResourceContextKey.IsFileSystemResource, '1_cutcopypaste', true);
appendEditorTitleContextMenuItem(revealInSideBarCommand.id, revealInSideBarCommand.title, ResourceContextKey.IsFileSystemResource, '2_files', false, 1);

export function appendEditorTitleContextMenuItem(id: string, title: string, when: ContextKeyExpression | undefined, group: string, supportsMultiSelect: boolean, order?: number): void {
	const precondition = supportsMultiSelect !== true ? MultipleEditorsSelectedInGroupContext.negate() : undefined;

	// Menu
	MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, {
		command: { id, title, precondition },
		when,
		group,
		order,
	});
}

// Editor Title Menu for Conflict Resolution
appendSaveConflictEditorTitleAction('workbench.files.action.acceptLocalChanges', nls.localize('acceptLocalChanges', "Use your changes and overwrite file contents"), Codicon.check, -10, acceptLocalChangesCommand);
appendSaveConflictEditorTitleAction('workbench.files.action.revertLocalChanges', nls.localize('revertLocalChanges', "Discard your changes and revert to file contents"), Codicon.discard, -9, revertLocalChangesCommand);

function appendSaveConflictEditorTitleAction(id: string, title: string, icon: ThemeIcon, order: number, command: ICommandHandler): void {

	// Command
	CommandsRegistry.registerCommand(id, command);

	// Action
	MenuRegistry.appendMenuItem(MenuId.EditorTitle, {
		command: { id, title, icon },
		when: ContextKeyExpr.equals(CONFLICT_RESOLUTION_CONTEXT, true),
		group: 'navigation',
		order
	});
}

// Menu registration - command palette

export function appendToCommandPalette({ id, title, category, metadata }: ICommandAction, when?: ContextKeyExpression): void {
	MenuRegistry.appendMenuItem(MenuId.CommandPalette, {
		command: {
			id,
			title,
			category,
			metadata
		},
		when
	});
}

appendToCommandPalette({
	id: COPY_PATH_COMMAND_ID,
	title: nls.localize2('copyPathOfActive', "Copy Path of Active File"),
	category: Categories.File
});
appendToCommandPalette({
	id: COPY_RELATIVE_PATH_COMMAND_ID,
	title: nls.localize2('copyRelativePathOfActive', "Copy Relative Path of Active File"),
	category: Categories.File
});

appendToCommandPalette({
	id: SAVE_FILE_COMMAND_ID,
	title: SAVE_FILE_LABEL,
	category: Categories.File
});

appendToCommandPalette({
	id: SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID,
	title: SAVE_FILE_WITHOUT_FORMATTING_LABEL,
	category: Categories.File
});

appendToCommandPalette({
	id: SAVE_ALL_IN_GROUP_COMMAND_ID,
	title: nls.localize2('saveAllInGroup', "Save All in Group"),
	category: Categories.File
});

appendToCommandPalette({
	id: SAVE_FILES_COMMAND_ID,
	title: nls.localize2('saveFiles', "Save All Files"),
	category: Categories.File
});

appendToCommandPalette({
	id: REVERT_FILE_COMMAND_ID,
	title: nls.localize2('revert', "Revert File"),
	category: Categories.File
});

appendToCommandPalette({
	id: COMPARE_WITH_SAVED_COMMAND_ID,
	title: nls.localize2('compareActiveWithSaved', "Compare Active File with Saved"),
	category: Categories.File,
	metadata: {
		description: nls.localize2('compareActiveWithSavedMeta', "Opens a new diff editor to compare the active file with the version on disk.")
	}
});

appendToCommandPalette({
	id: SAVE_FILE_AS_COMMAND_ID,
	title: SAVE_FILE_AS_LABEL,
	category: Categories.File
});

appendToCommandPalette({
	id: NEW_FILE_COMMAND_ID,
	title: NEW_FILE_LABEL,
	category: Categories.File
}, WorkspaceFolderCountContext.notEqualsTo('0'));

appendToCommandPalette({
	id: NEW_FOLDER_COMMAND_ID,
	title: NEW_FOLDER_LABEL,
	category: Categories.File,
	metadata: { description: nls.localize2('newFolderDescription', "Create a new folder or directory") }
}, WorkspaceFolderCountContext.notEqualsTo('0'));

appendToCommandPalette({
	id: NEW_UNTITLED_FILE_COMMAND_ID,
	title: NEW_UNTITLED_FILE_LABEL,
	category: Categories.File
});

// Menu registration - open editors

const isFileOrUntitledResourceContextKey = ContextKeyExpr.or(ResourceContextKey.IsFileSystemResource, ResourceContextKey.Scheme.isEqualTo(Schemas.untitled));

const openToSideCommand = {
	id: OPEN_TO_SIDE_COMMAND_ID,
	title: nls.localize('openToSide', "Open to the Side")
};
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: 'navigation',
	order: 10,
	command: openToSideCommand,
	when: isFileOrUntitledResourceContextKey
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '1_open',
	order: 10,
	command: {
		id: REOPEN_WITH_COMMAND_ID,
		title: nls.localize('reopenWith', "Reopen Editor With...")
	},
	when: ContextKeyExpr.and(
		// Editors with Available Choices to Open With
		ActiveEditorAvailableEditorIdsContext,
		// Not: editor groups
		OpenEditorsGroupContext.toNegated()
	)
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '1_cutcopypaste',
	order: 10,
	command: copyPathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '1_cutcopypaste',
	order: 20,
	command: copyRelativePathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '2_save',
	order: 10,
	command: {
		id: SAVE_FILE_COMMAND_ID,
		title: SAVE_FILE_LABEL,
		precondition: OpenEditorsDirtyEditorContext
	},
	when: ContextKeyExpr.or(
		// Untitled Editors
		ResourceContextKey.Scheme.isEqualTo(Schemas.untitled),
		// Or:
		ContextKeyExpr.and(
			// Not: editor groups
			OpenEditorsGroupContext.toNegated(),
			// Not: readonly editors
			OpenEditorsReadonlyEditorContext.toNegated(),
			// Not: auto save after short delay
			AutoSaveAfterShortDelayContext.toNegated()
		)
	)
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '2_save',
	order: 20,
	command: {
		id: REVERT_FILE_COMMAND_ID,
		title: nls.localize('revert', "Revert File"),
		precondition: OpenEditorsDirtyEditorContext
	},
	when: ContextKeyExpr.and(
		// Not: editor groups
		OpenEditorsGroupContext.toNegated(),
		// Not: readonly editors
		OpenEditorsReadonlyEditorContext.toNegated(),
		// Not: untitled editors (revert closes them)
		ResourceContextKey.Scheme.notEqualsTo(Schemas.untitled),
		// Not: auto save after short delay
		AutoSaveAfterShortDelayContext.toNegated()
	)
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '2_save',
	order: 30,
	command: {
		id: SAVE_ALL_IN_GROUP_COMMAND_ID,
		title: nls.localize('saveAll', "Save All"),
		precondition: DirtyWorkingCopiesContext
	},
	// Editor Group
	when: OpenEditorsGroupContext
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '3_compare',
	order: 10,
	command: {
		id: COMPARE_WITH_SAVED_COMMAND_ID,
		title: nls.localize('compareWithSaved', "Compare with Saved"),
		precondition: OpenEditorsDirtyEditorContext
	},
	when: ContextKeyExpr.and(ResourceContextKey.IsFileSystemResource, AutoSaveAfterShortDelayContext.toNegated(), WorkbenchListDoubleSelection.toNegated())
});

const compareResourceCommand = {
	id: COMPARE_RESOURCE_COMMAND_ID,
	title: nls.localize('compareWithSelected', "Compare with Selected")
};
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '3_compare',
	order: 20,
	command: compareResourceCommand,
	when: ContextKeyExpr.and(ResourceContextKey.HasResource, ResourceSelectedForCompareContext, isFileOrUntitledResourceContextKey, WorkbenchListDoubleSelection.toNegated())
});

const selectForCompareCommand = {
	id: SELECT_FOR_COMPARE_COMMAND_ID,
	title: nls.localize('compareSource', "Select for Compare")
};
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '3_compare',
	order: 30,
	command: selectForCompareCommand,
	when: ContextKeyExpr.and(ResourceContextKey.HasResource, isFileOrUntitledResourceContextKey, WorkbenchListDoubleSelection.toNegated())
});

const compareSelectedCommand = {
	id: COMPARE_SELECTED_COMMAND_ID,
	title: nls.localize('compareSelected', "Compare Selected")
};
MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '3_compare',
	order: 30,
	command: compareSelectedCommand,
	when: ContextKeyExpr.and(ResourceContextKey.HasResource, WorkbenchListDoubleSelection, OpenEditorsSelectedFileOrUntitledContext)
});

MenuRegistry.appendMenuItem(MenuId.EditorTitleContext, {
	group: '1_compare',
	order: 30,
	command: compareSelectedCommand,
	when: ContextKeyExpr.and(ResourceContextKey.HasResource, TwoEditorsSelectedInGroupContext, SelectedEditorsInGroupFileOrUntitledResourceContextKey)
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '4_close',
	order: 10,
	command: {
		id: CLOSE_EDITOR_COMMAND_ID,
		title: nls.localize('close', "Close")
	},
	when: OpenEditorsGroupContext.toNegated()
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '4_close',
	order: 20,
	command: {
		id: CLOSE_OTHER_EDITORS_IN_GROUP_COMMAND_ID,
		title: nls.localize('closeOthers', "Close Others")
	},
	when: OpenEditorsGroupContext.toNegated()
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '4_close',
	order: 30,
	command: {
		id: CLOSE_SAVED_EDITORS_COMMAND_ID,
		title: nls.localize('closeSaved', "Close Saved")
	}
});

MenuRegistry.appendMenuItem(MenuId.OpenEditorsContext, {
	group: '4_close',
	order: 40,
	command: {
		id: CLOSE_EDITORS_IN_GROUP_COMMAND_ID,
		title: nls.localize('closeAll', "Close All")
	}
});

// Menu registration - explorer

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: 'navigation',
	order: 4,
	command: {
		id: NEW_FILE_COMMAND_ID,
		title: NEW_FILE_LABEL,
		precondition: ExplorerResourceWritableContext
	},
	when: ExplorerFolderContext
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: 'navigation',
	order: 6,
	command: {
		id: NEW_FOLDER_COMMAND_ID,
		title: NEW_FOLDER_LABEL,
		precondition: ExplorerResourceWritableContext
	},
	when: ExplorerFolderContext
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: 'navigation',
	order: 10,
	command: openToSideCommand,
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ResourceContextKey.HasResource)
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: 'navigation',
	order: 20,
	command: {
		id: OPEN_WITH_EXPLORER_COMMAND_ID,
		title: nls.localize('explorerOpenWith', "Open With..."),
	},
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ExplorerResourceAvailableEditorIdsContext),
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '3_compare',
	order: 20,
	command: compareResourceCommand,
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ResourceContextKey.HasResource, ResourceSelectedForCompareContext, WorkbenchListDoubleSelection.toNegated())
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '3_compare',
	order: 30,
	command: selectForCompareCommand,
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ResourceContextKey.HasResource, WorkbenchListDoubleSelection.toNegated())
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '3_compare',
	order: 30,
	command: compareSelectedCommand,
	when: ContextKeyExpr.and(ExplorerFolderContext.toNegated(), ResourceContextKey.HasResource, WorkbenchListDoubleSelection)
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '5_cutcopypaste',
	order: 8,
	command: {
		id: CUT_FILE_ID,
		title: nls.localize('cut', "Cut"),
	},
	when: ContextKeyExpr.and(ExplorerRootContext.toNegated(), ExplorerResourceWritableContext)
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '5_cutcopypaste',
	order: 10,
	command: {
		id: COPY_FILE_ID,
		title: COPY_FILE_LABEL,
	},
	when: ExplorerRootContext.toNegated()
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '5_cutcopypaste',
	order: 20,
	command: {
		id: PASTE_FILE_ID,
		title: PASTE_FILE_LABEL,
		precondition: ContextKeyExpr.and(ExplorerResourceWritableContext, FileCopiedContext)
	},
	when: ExplorerFolderContext
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, ({
	group: '5b_importexport',
	order: 10,
	command: {
		id: DOWNLOAD_COMMAND_ID,
		title: DOWNLOAD_LABEL
	},
	when: ContextKeyExpr.or(
		// native: for any remote resource
		ContextKeyExpr.and(IsWebContext.toNegated(), ResourceContextKey.Scheme.notEqualsTo(Schemas.file)),
		// web: for any files
		ContextKeyExpr.and(IsWebContext, ExplorerFolderContext.toNegated(), ExplorerRootContext.toNegated()),
		// web: for any folders if file system API support is provided
		ContextKeyExpr.and(IsWebContext, HasWebFileSystemAccess)
	)
}));

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, ({
	group: '5b_importexport',
	order: 20,
	command: {
		id: UPLOAD_COMMAND_ID,
		title: UPLOAD_LABEL,
	},
	when: ContextKeyExpr.and(
		// only in web
		IsWebContext,
		// only on folders
		ExplorerFolderContext,
		// only on writable folders
		ExplorerResourceWritableContext
	)
}));

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '6_copypath',
	order: 10,
	command: copyPathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '6_copypath',
	order: 20,
	command: copyRelativePathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '2_workspace',
	order: 10,
	command: {
		id: ADD_ROOT_FOLDER_COMMAND_ID,
		title: ADD_ROOT_FOLDER_LABEL,
	},
	when: ContextKeyExpr.and(ExplorerRootContext, ContextKeyExpr.or(EnterMultiRootWorkspaceSupportContext, WorkbenchStateContext.isEqualTo('workspace')))
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '2_workspace',
	order: 30,
	command: {
		id: REMOVE_ROOT_FOLDER_COMMAND_ID,
		title: REMOVE_ROOT_FOLDER_LABEL,
	},
	when: ContextKeyExpr.and(ExplorerRootContext, ExplorerFolderContext, ContextKeyExpr.and(WorkspaceFolderCountContext.notEqualsTo('0'), ContextKeyExpr.or(EnterMultiRootWorkspaceSupportContext, WorkbenchStateContext.isEqualTo('workspace'))))
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '7_modification',
	order: 10,
	command: {
		id: RENAME_ID,
		title: TRIGGER_RENAME_LABEL,
		precondition: ExplorerResourceWritableContext,
	},
	when: ExplorerRootContext.toNegated()
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '7_modification',
	order: 20,
	command: {
		id: MOVE_FILE_TO_TRASH_ID,
		title: MOVE_FILE_TO_TRASH_LABEL
	},
	alt: {
		id: DELETE_FILE_ID,
		title: nls.localize('deleteFile', "Delete Permanently")
	},
	when: ContextKeyExpr.and(ExplorerRootContext.toNegated(), ExplorerResourceMoveableToTrash)
});

MenuRegistry.appendMenuItem(MenuId.ExplorerContext, {
	group: '7_modification',
	order: 20,
	command: {
		id: DELETE_FILE_ID,
		title: nls.localize('deleteFile', "Delete Permanently")
	},
	when: ContextKeyExpr.and(ExplorerRootContext.toNegated(), ExplorerResourceMoveableToTrash.toNegated())
});

// Empty Editor Group / Editor Tabs Container Context Menu
for (const menuId of [MenuId.EmptyEditorGroupContext, MenuId.EditorTabsBarContext]) {
	MenuRegistry.appendMenuItem(menuId, { command: { id: NEW_UNTITLED_FILE_COMMAND_ID, title: nls.localize('newFile', "New Text File") }, group: '1_file', order: 10 });
	MenuRegistry.appendMenuItem(menuId, { command: { id: 'workbench.action.quickOpen', title: nls.localize('openFile', "Open File...") }, group: '1_file', order: 20 });
}

// File menu

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '1_new',
	command: {
		id: NEW_UNTITLED_FILE_COMMAND_ID,
		title: nls.localize({ key: 'miNewFile', comment: ['&& denotes a mnemonic'] }, "&&New Text File")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '4_save',
	command: {
		id: SAVE_FILE_COMMAND_ID,
		title: nls.localize({ key: 'miSave', comment: ['&& denotes a mnemonic'] }, "&&Save"),
		precondition: ContextKeyExpr.or(ActiveEditorContext, ContextKeyExpr.and(FoldersViewVisibleContext, SidebarFocusContext))
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '4_save',
	command: {
		id: SAVE_FILE_AS_COMMAND_ID,
		title: nls.localize({ key: 'miSaveAs', comment: ['&& denotes a mnemonic'] }, "Save &&As..."),
		precondition: ContextKeyExpr.or(ActiveEditorContext, ContextKeyExpr.and(FoldersViewVisibleContext, SidebarFocusContext))
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '4_save',
	command: {
		id: SAVE_ALL_COMMAND_ID,
		title: nls.localize({ key: 'miSaveAll', comment: ['&& denotes a mnemonic'] }, "Save A&&ll"),
		precondition: DirtyWorkingCopiesContext
	},
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '5_autosave',
	command: {
		id: ToggleAutoSaveAction.ID,
		title: nls.localize({ key: 'miAutoSave', comment: ['&& denotes a mnemonic'] }, "A&&uto Save"),
		toggled: ContextKeyExpr.notEquals('config.files.autoSave', 'off')
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '6_close',
	command: {
		id: REVERT_FILE_COMMAND_ID,
		title: nls.localize({ key: 'miRevert', comment: ['&& denotes a mnemonic'] }, "Re&&vert File"),
		precondition: ContextKeyExpr.or(
			// Active editor can revert
			ContextKeyExpr.and(ActiveEditorCanRevertContext),
			// Explorer focused but not on untitled
			ContextKeyExpr.and(ResourceContextKey.Scheme.notEqualsTo(Schemas.untitled), FoldersViewVisibleContext, SidebarFocusContext)
		),
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarFileMenu, {
	group: '6_close',
	command: {
		id: CLOSE_EDITOR_COMMAND_ID,
		title: nls.localize({ key: 'miCloseEditor', comment: ['&& denotes a mnemonic'] }, "&&Close Editor"),
		precondition: ContextKeyExpr.or(ActiveEditorContext, ContextKeyExpr.and(FoldersViewVisibleContext, SidebarFocusContext))
	},
	order: 2
});

// Go to menu

MenuRegistry.appendMenuItem(MenuId.MenubarGoMenu, {
	group: '3_global_nav',
	command: {
		id: 'workbench.action.quickOpen',
		title: nls.localize({ key: 'miGotoFile', comment: ['&& denotes a mnemonic'] }, "Go to &&File...")
	},
	order: 1
});


// Chat used attachment anchor context menu

MenuRegistry.appendMenuItem(MenuId.ChatAttachmentsContext, {
	group: 'navigation',
	order: 10,
	command: openToSideCommand,
	when: ContextKeyExpr.and(ResourceContextKey.IsFileSystemResource, ExplorerFolderContext.toNegated())
});

MenuRegistry.appendMenuItem(MenuId.ChatAttachmentsContext, {
	group: 'navigation',
	order: 20,
	command: revealInSideBarCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.ChatAttachmentsContext, {
	group: '1_cutcopypaste',
	order: 10,
	command: copyPathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

MenuRegistry.appendMenuItem(MenuId.ChatAttachmentsContext, {
	group: '1_cutcopypaste',
	order: 20,
	command: copyRelativePathCommand,
	when: ResourceContextKey.IsFileSystemResource
});

// Chat resource anchor attachments/anchors context menu

for (const menuId of [MenuId.ChatInlineResourceAnchorContext, MenuId.ChatInputResourceAttachmentContext]) {
	MenuRegistry.appendMenuItem(menuId, {
		group: 'navigation',
		order: 10,
		command: openToSideCommand,
		when: ContextKeyExpr.and(ResourceContextKey.HasResource, ExplorerFolderContext.toNegated())
	});

	MenuRegistry.appendMenuItem(menuId, {
		group: 'navigation',
		order: 20,
		command: revealInSideBarCommand,
		when: ResourceContextKey.IsFileSystemResource
	});

	MenuRegistry.appendMenuItem(menuId, {
		group: '1_cutcopypaste',
		order: 10,
		command: copyPathCommand,
		when: ResourceContextKey.IsFileSystemResource
	});

	MenuRegistry.appendMenuItem(menuId, {
		group: '1_cutcopypaste',
		order: 20,
		command: copyRelativePathCommand,
		when: ResourceContextKey.IsFileSystemResource
	});
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/fileActions.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/fileActions.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { isWindows, OperatingSystem, OS } from '../../../../base/common/platform.js';
import { extname, basename, isAbsolute } from '../../../../base/common/path.js';
import * as resources from '../../../../base/common/resources.js';
import { URI } from '../../../../base/common/uri.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { Action } from '../../../../base/common/actions.js';
import { dispose, IDisposable } from '../../../../base/common/lifecycle.js';
import { VIEWLET_ID, IFilesConfiguration, VIEW_ID, UndoConfirmLevel } from '../common/files.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { EditorResourceAccessor, SideBySideEditor } from '../../../common/editor.js';
import { IQuickInputService, ItemActivation } from '../../../../platform/quickinput/common/quickInput.js';
import { IInstantiationService, ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ITextModel } from '../../../../editor/common/model.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { REVEAL_IN_EXPLORER_COMMAND_ID, SAVE_ALL_IN_GROUP_COMMAND_ID, NEW_UNTITLED_FILE_COMMAND_ID } from './fileConstants.js';
import { ITextModelService, ITextModelContentProvider } from '../../../../editor/common/services/resolverService.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { ILanguageService } from '../../../../editor/common/languages/language.js';
import { IModelService } from '../../../../editor/common/services/model.js';
import { ICommandService, CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';
import { Schemas } from '../../../../base/common/network.js';
import { IDialogService, IConfirmationResult, getFileNamesMessage } from '../../../../platform/dialogs/common/dialogs.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Constants } from '../../../../base/common/uint.js';
import { CLOSE_EDITORS_AND_GROUP_COMMAND_ID } from '../../../browser/parts/editor/editorCommands.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { ExplorerItem, NewExplorerItem } from '../common/explorerModel.js';
import { getErrorMessage } from '../../../../base/common/errors.js';
import { triggerUpload } from '../../../../base/browser/dom.js';
import { IFilesConfigurationService } from '../../../services/filesConfiguration/common/filesConfigurationService.js';
import { IWorkingCopyService } from '../../../services/workingCopy/common/workingCopyService.js';
import { IWorkingCopy } from '../../../services/workingCopy/common/workingCopy.js';
import { timeout } from '../../../../base/common/async.js';
import { IWorkingCopyFileService } from '../../../services/workingCopy/common/workingCopyFileService.js';
import { Codicon } from '../../../../base/common/codicons.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { trim, rtrim } from '../../../../base/common/strings.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { ResourceFileEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { IExplorerService } from './files.js';
import { BrowserFileUpload, FileDownload } from './fileImportExport.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { IRemoteAgentService } from '../../../services/remote/common/remoteAgentService.js';
import { IPathService } from '../../../services/path/common/pathService.js';
import { Action2 } from '../../../../platform/actions/common/actions.js';
import { ActiveEditorCanToggleReadonlyContext, ActiveEditorContext, EmptyWorkspaceSupportContext } from '../../../common/contextkeys.js';
import { KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyChord, KeyCode, KeyMod } from '../../../../base/common/keyCodes.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { VSBuffer } from '../../../../base/common/buffer.js';
import { getPathForFile } from '../../../../platform/dnd/browser/dnd.js';

export const NEW_FILE_COMMAND_ID = 'explorer.newFile';
export const NEW_FILE_LABEL = nls.localize2('newFile', "New File...");
export const NEW_FOLDER_COMMAND_ID = 'explorer.newFolder';
export const NEW_FOLDER_LABEL = nls.localize2('newFolder', "New Folder...");
export const TRIGGER_RENAME_LABEL = nls.localize('rename', "Rename...");
export const MOVE_FILE_TO_TRASH_LABEL = nls.localize('delete', "Delete");
export const COPY_FILE_LABEL = nls.localize('copyFile', "Copy");
export const PASTE_FILE_LABEL = nls.localize('pasteFile', "Paste");
export const FileCopiedContext = new RawContextKey<boolean>('fileCopied', false);
export const DOWNLOAD_COMMAND_ID = 'explorer.download';
export const DOWNLOAD_LABEL = nls.localize('download', "Download...");
export const UPLOAD_COMMAND_ID = 'explorer.upload';
export const UPLOAD_LABEL = nls.localize('upload', "Upload...");
const CONFIRM_DELETE_SETTING_KEY = 'explorer.confirmDelete';
const MAX_UNDO_FILE_SIZE = 5000000; // 5mb

async function refreshIfSeparator(value: string, explorerService: IExplorerService): Promise<void> {
	if (value && ((value.indexOf('/') >= 0) || (value.indexOf('\\') >= 0))) {
		// New input contains separator, multiple resources will get created workaround for #68204
		await explorerService.refresh();
	}
}

async function deleteFiles(explorerService: IExplorerService, workingCopyFileService: IWorkingCopyFileService, dialogService: IDialogService, configurationService: IConfigurationService, filesConfigurationService: IFilesConfigurationService, elements: ExplorerItem[], useTrash: boolean, skipConfirm = false, ignoreIfNotExists = false): Promise<void> {
	let primaryButton: string;
	if (useTrash) {
		primaryButton = isWindows ? nls.localize('deleteButtonLabelRecycleBin', "&&Move to Recycle Bin") : nls.localize({ key: 'deleteButtonLabelTrash', comment: ['&& denotes a mnemonic'] }, "&&Move to Trash");
	} else {
		primaryButton = nls.localize({ key: 'deleteButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete");
	}

	// Handle dirty
	const distinctElements = resources.distinctParents(elements, e => e.resource);
	const dirtyWorkingCopies = new Set<IWorkingCopy>();
	for (const distinctElement of distinctElements) {
		for (const dirtyWorkingCopy of workingCopyFileService.getDirty(distinctElement.resource)) {
			dirtyWorkingCopies.add(dirtyWorkingCopy);
		}
	}

	if (dirtyWorkingCopies.size) {
		let message: string;
		if (distinctElements.length > 1) {
			message = nls.localize('dirtyMessageFilesDelete', "You are deleting files with unsaved changes. Do you want to continue?");
		} else if (distinctElements[0].isDirectory) {
			if (dirtyWorkingCopies.size === 1) {
				message = nls.localize('dirtyMessageFolderOneDelete', "You are deleting a folder {0} with unsaved changes in 1 file. Do you want to continue?", distinctElements[0].name);
			} else {
				message = nls.localize('dirtyMessageFolderDelete', "You are deleting a folder {0} with unsaved changes in {1} files. Do you want to continue?", distinctElements[0].name, dirtyWorkingCopies.size);
			}
		} else {
			message = nls.localize('dirtyMessageFileDelete', "You are deleting {0} with unsaved changes. Do you want to continue?", distinctElements[0].name);
		}

		const response = await dialogService.confirm({
			type: 'warning',
			message,
			detail: nls.localize('dirtyWarning', "Your changes will be lost if you don't save them."),
			primaryButton
		});

		if (!response.confirmed) {
			return;
		} else {
			skipConfirm = true;
		}
	}

	// Handle readonly
	if (!skipConfirm) {
		const readonlyResources = distinctElements.filter(e => filesConfigurationService.isReadonly(e.resource));
		if (readonlyResources.length) {
			let message: string;
			if (readonlyResources.length > 1) {
				message = nls.localize('readonlyMessageFilesDelete', "You are deleting files that are configured to be read-only. Do you want to continue?");
			} else if (readonlyResources[0].isDirectory) {
				message = nls.localize('readonlyMessageFolderOneDelete', "You are deleting a folder {0} that is configured to be read-only. Do you want to continue?", distinctElements[0].name);
			} else {
				message = nls.localize('readonlyMessageFolderDelete', "You are deleting a file {0} that is configured to be read-only. Do you want to continue?", distinctElements[0].name);
			}

			const response = await dialogService.confirm({
				type: 'warning',
				message,
				detail: nls.localize('continueDetail', "The read-only protection will be overridden if you continue."),
				primaryButton: nls.localize('continueButtonLabel', "Continue")
			});

			if (!response.confirmed) {
				return;
			}
		}
	}

	let confirmation: IConfirmationResult;

	// We do not support undo of folders, so in that case the delete action is irreversible
	const deleteDetail = distinctElements.some(e => e.isDirectory) ? nls.localize('irreversible', "This action is irreversible!") :
		distinctElements.length > 1 ? nls.localize('restorePlural', "You can restore these files using the Undo command.") : nls.localize('restore', "You can restore this file using the Undo command.");

	// Check if we need to ask for confirmation at all
	if (skipConfirm || (useTrash && configurationService.getValue<boolean>(CONFIRM_DELETE_SETTING_KEY) === false)) {
		confirmation = { confirmed: true };
	}

	// Confirm for moving to trash
	else if (useTrash) {
		let { message, detail } = getMoveToTrashMessage(distinctElements);
		detail += detail ? '\n' : '';
		if (isWindows) {
			detail += distinctElements.length > 1 ? nls.localize('undoBinFiles', "You can restore these files from the Recycle Bin.") : nls.localize('undoBin', "You can restore this file from the Recycle Bin.");
		} else {
			detail += distinctElements.length > 1 ? nls.localize('undoTrashFiles', "You can restore these files from the Trash.") : nls.localize('undoTrash', "You can restore this file from the Trash.");
		}

		confirmation = await dialogService.confirm({
			message,
			detail,
			primaryButton,
			checkbox: {
				label: nls.localize('doNotAskAgain', "Do not ask me again")
			}
		});
	}

	// Confirm for deleting permanently
	else {
		let { message, detail } = getDeleteMessage(distinctElements);
		detail += detail ? '\n' : '';
		detail += deleteDetail;
		confirmation = await dialogService.confirm({
			type: 'warning',
			message,
			detail,
			primaryButton
		});
	}

	// Check for confirmation checkbox
	if (confirmation.confirmed && confirmation.checkboxChecked === true) {
		await configurationService.updateValue(CONFIRM_DELETE_SETTING_KEY, false);
	}

	// Check for confirmation
	if (!confirmation.confirmed) {
		return;
	}

	// Call function
	try {
		const resourceFileEdits = distinctElements.map(e => new ResourceFileEdit(e.resource, undefined, { recursive: true, folder: e.isDirectory, ignoreIfNotExists, skipTrashBin: !useTrash, maxSize: MAX_UNDO_FILE_SIZE }));
		const options = {
			undoLabel: distinctElements.length > 1 ? nls.localize({ key: 'deleteBulkEdit', comment: ['Placeholder will be replaced by the number of files deleted'] }, "Delete {0} files", distinctElements.length) : nls.localize({ key: 'deleteFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file deleted'] }, "Delete {0}", distinctElements[0].name),
			progressLabel: distinctElements.length > 1 ? nls.localize({ key: 'deletingBulkEdit', comment: ['Placeholder will be replaced by the number of files deleted'] }, "Deleting {0} files", distinctElements.length) : nls.localize({ key: 'deletingFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file deleted'] }, "Deleting {0}", distinctElements[0].name),
		};
		await explorerService.applyBulkEdit(resourceFileEdits, options);
	} catch (error) {

		// Handle error to delete file(s) from a modal confirmation dialog
		let errorMessage: string;
		let detailMessage: string | undefined;
		let primaryButton: string;
		if (useTrash) {
			errorMessage = isWindows ? nls.localize('binFailed', "Failed to delete using the Recycle Bin. Do you want to permanently delete instead?") : nls.localize('trashFailed', "Failed to delete using the Trash. Do you want to permanently delete instead?");
			detailMessage = deleteDetail;
			primaryButton = nls.localize({ key: 'deletePermanentlyButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete Permanently");
		} else {
			errorMessage = toErrorMessage(error, false);
			primaryButton = nls.localize({ key: 'retryButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Retry");
		}

		const res = await dialogService.confirm({
			type: 'warning',
			message: errorMessage,
			detail: detailMessage,
			primaryButton
		});

		if (res.confirmed) {
			if (useTrash) {
				useTrash = false; // Delete Permanently
			}

			skipConfirm = true;
			ignoreIfNotExists = true;

			return deleteFiles(explorerService, workingCopyFileService, dialogService, configurationService, filesConfigurationService, elements, useTrash, skipConfirm, ignoreIfNotExists);
		}
	}
}

function getMoveToTrashMessage(distinctElements: ExplorerItem[]): { message: string; detail: string } {
	if (containsBothDirectoryAndFile(distinctElements)) {
		return {
			message: nls.localize('confirmMoveTrashMessageFilesAndDirectories', "Are you sure you want to delete the following {0} files/directories and their contents?", distinctElements.length),
			detail: getFileNamesMessage(distinctElements.map(e => e.resource))
		};
	}

	if (distinctElements.length > 1) {
		if (distinctElements[0].isDirectory) {
			return {
				message: nls.localize('confirmMoveTrashMessageMultipleDirectories', "Are you sure you want to delete the following {0} directories and their contents?", distinctElements.length),
				detail: getFileNamesMessage(distinctElements.map(e => e.resource))
			};
		}

		return {
			message: nls.localize('confirmMoveTrashMessageMultiple', "Are you sure you want to delete the following {0} files?", distinctElements.length),
			detail: getFileNamesMessage(distinctElements.map(e => e.resource))
		};
	}

	if (distinctElements[0].isDirectory && !distinctElements[0].isSymbolicLink) {
		return { message: nls.localize('confirmMoveTrashMessageFolder', "Are you sure you want to delete '{0}' and its contents?", distinctElements[0].name), detail: '' };
	}

	return { message: nls.localize('confirmMoveTrashMessageFile', "Are you sure you want to delete '{0}'?", distinctElements[0].name), detail: '' };
}

function getDeleteMessage(distinctElements: ExplorerItem[]): { message: string; detail: string } {
	if (containsBothDirectoryAndFile(distinctElements)) {
		return {
			message: nls.localize('confirmDeleteMessageFilesAndDirectories', "Are you sure you want to permanently delete the following {0} files/directories and their contents?", distinctElements.length),
			detail: getFileNamesMessage(distinctElements.map(e => e.resource))
		};
	}

	if (distinctElements.length > 1) {
		if (distinctElements[0].isDirectory) {
			return {
				message: nls.localize('confirmDeleteMessageMultipleDirectories', "Are you sure you want to permanently delete the following {0} directories and their contents?", distinctElements.length),
				detail: getFileNamesMessage(distinctElements.map(e => e.resource))
			};
		}

		return {
			message: nls.localize('confirmDeleteMessageMultiple', "Are you sure you want to permanently delete the following {0} files?", distinctElements.length),
			detail: getFileNamesMessage(distinctElements.map(e => e.resource))
		};
	}

	if (distinctElements[0].isDirectory) {
		return { message: nls.localize('confirmDeleteMessageFolder', "Are you sure you want to permanently delete '{0}' and its contents?", distinctElements[0].name), detail: '' };
	}

	return { message: nls.localize('confirmDeleteMessageFile', "Are you sure you want to permanently delete '{0}'?", distinctElements[0].name), detail: '' };
}

function containsBothDirectoryAndFile(distinctElements: ExplorerItem[]): boolean {
	const directory = distinctElements.find(element => element.isDirectory);
	const file = distinctElements.find(element => !element.isDirectory);

	return !!directory && !!file;
}


export async function findValidPasteFileTarget(
	explorerService: IExplorerService,
	fileService: IFileService,
	dialogService: IDialogService,
	targetFolder: ExplorerItem,
	fileToPaste: { resource: URI | string; isDirectory?: boolean; allowOverwrite: boolean },
	incrementalNaming: 'simple' | 'smart' | 'disabled'
): Promise<URI | undefined> {

	let name = typeof fileToPaste.resource === 'string' ? fileToPaste.resource : resources.basenameOrAuthority(fileToPaste.resource);
	let candidate = resources.joinPath(targetFolder.resource, name);

	// In the disabled case we must ask if it's ok to overwrite the file if it exists
	if (incrementalNaming === 'disabled') {
		const canOverwrite = await askForOverwrite(fileService, dialogService, candidate);
		if (!canOverwrite) {
			return;
		}
	}

	while (true && !fileToPaste.allowOverwrite) {
		if (!explorerService.findClosest(candidate)) {
			break;
		}

		if (incrementalNaming !== 'disabled') {
			name = incrementFileName(name, !!fileToPaste.isDirectory, incrementalNaming);
		}
		candidate = resources.joinPath(targetFolder.resource, name);
	}

	return candidate;
}

export function incrementFileName(name: string, isFolder: boolean, incrementalNaming: 'simple' | 'smart'): string {
	if (incrementalNaming === 'simple') {
		let namePrefix = name;
		let extSuffix = '';
		if (!isFolder) {
			extSuffix = extname(name);
			namePrefix = basename(name, extSuffix);
		}

		// name copy 5(.txt) => name copy 6(.txt)
		// name copy(.txt) => name copy 2(.txt)
		const suffixRegex = /^(.+ copy)( \d+)?$/;
		if (suffixRegex.test(namePrefix)) {
			return namePrefix.replace(suffixRegex, (match, g1?, g2?) => {
				const number = (g2 ? parseInt(g2) : 1);
				return number === 0
					? `${g1}`
					: (number < Constants.MAX_SAFE_SMALL_INTEGER
						? `${g1} ${number + 1}`
						: `${g1}${g2} copy`);
			}) + extSuffix;
		}

		// name(.txt) => name copy(.txt)
		return `${namePrefix} copy${extSuffix}`;
	}

	const separators = '[\\.\\-_]';
	const maxNumber = Constants.MAX_SAFE_SMALL_INTEGER;

	// file.1.txt=>file.2.txt
	const suffixFileRegex = RegExp('(.*' + separators + ')(\\d+)(\\..*)$');
	if (!isFolder && name.match(suffixFileRegex)) {
		return name.replace(suffixFileRegex, (match, g1?, g2?, g3?) => {
			const number = parseInt(g2);
			return number < maxNumber
				? g1 + String(number + 1).padStart(g2.length, '0') + g3
				: `${g1}${g2}.1${g3}`;
		});
	}

	// 1.file.txt=>2.file.txt
	const prefixFileRegex = RegExp('(\\d+)(' + separators + '.*)(\\..*)$');
	if (!isFolder && name.match(prefixFileRegex)) {
		return name.replace(prefixFileRegex, (match, g1?, g2?, g3?) => {
			const number = parseInt(g1);
			return number < maxNumber
				? String(number + 1).padStart(g1.length, '0') + g2 + g3
				: `${g1}${g2}.1${g3}`;
		});
	}

	// 1.txt=>2.txt
	const prefixFileNoNameRegex = RegExp('(\\d+)(\\..*)$');
	if (!isFolder && name.match(prefixFileNoNameRegex)) {
		return name.replace(prefixFileNoNameRegex, (match, g1?, g2?) => {
			const number = parseInt(g1);
			return number < maxNumber
				? String(number + 1).padStart(g1.length, '0') + g2
				: `${g1}.1${g2}`;
		});
	}

	// file.txt=>file.1.txt
	const lastIndexOfDot = name.lastIndexOf('.');
	if (!isFolder && lastIndexOfDot >= 0) {
		return `${name.substr(0, lastIndexOfDot)}.1${name.substr(lastIndexOfDot)}`;
	}

	// 123 => 124
	const noNameNoExtensionRegex = RegExp('(\\d+)$');
	if (!isFolder && lastIndexOfDot === -1 && name.match(noNameNoExtensionRegex)) {
		return name.replace(noNameNoExtensionRegex, (match, g1?) => {
			const number = parseInt(g1);
			return number < maxNumber
				? String(number + 1).padStart(g1.length, '0')
				: `${g1}.1`;
		});
	}

	// file => file1
	// file1 => file2
	const noExtensionRegex = RegExp('(.*)(\\d*)$');
	if (!isFolder && lastIndexOfDot === -1 && name.match(noExtensionRegex)) {
		return name.replace(noExtensionRegex, (match, g1?, g2?) => {
			let number = parseInt(g2);
			if (isNaN(number)) {
				number = 0;
			}
			return number < maxNumber
				? g1 + String(number + 1).padStart(g2.length, '0')
				: `${g1}${g2}.1`;
		});
	}

	// folder.1=>folder.2
	if (isFolder && name.match(/(\d+)$/)) {
		return name.replace(/(\d+)$/, (match, ...groups) => {
			const number = parseInt(groups[0]);
			return number < maxNumber
				? String(number + 1).padStart(groups[0].length, '0')
				: `${groups[0]}.1`;
		});
	}

	// 1.folder=>2.folder
	if (isFolder && name.match(/^(\d+)/)) {
		return name.replace(/^(\d+)(.*)$/, (match, ...groups) => {
			const number = parseInt(groups[0]);
			return number < maxNumber
				? String(number + 1).padStart(groups[0].length, '0') + groups[1]
				: `${groups[0]}${groups[1]}.1`;
		});
	}

	// file/folder=>file.1/folder.1
	return `${name}.1`;
}

/**
 * Checks to see if the resource already exists, if so prompts the user if they would be ok with it being overwritten
 * @param fileService The file service
 * @param dialogService The dialog service
 * @param targetResource The resource to be overwritten
 * @return A boolean indicating if the user is ok with resource being overwritten, if the resource does not exist it returns true.
 */
async function askForOverwrite(fileService: IFileService, dialogService: IDialogService, targetResource: URI): Promise<boolean> {
	const exists = await fileService.exists(targetResource);
	if (!exists) {
		return true;
	}
	// Ask for overwrite confirmation
	const { confirmed } = await dialogService.confirm({
		type: Severity.Warning,
		message: nls.localize('confirmOverwrite', "A file or folder with the name '{0}' already exists in the destination folder. Do you want to replace it?", basename(targetResource.path)),
		primaryButton: nls.localize('replaceButtonLabel', "&&Replace")
	});
	return confirmed;
}

// Global Compare with
export class GlobalCompareResourcesAction extends Action2 {

	static readonly ID = 'workbench.files.action.compareFileWith';
	static readonly LABEL = nls.localize2('globalCompareFile', "Compare Active File With...");

	constructor() {
		super({
			id: GlobalCompareResourcesAction.ID,
			title: GlobalCompareResourcesAction.LABEL,
			f1: true,
			category: Categories.File,
			precondition: ActiveEditorContext,
			metadata: {
				description: nls.localize2('compareFileWithMeta', "Opens a picker to select a file to diff with the active editor.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const textModelService = accessor.get(ITextModelService);
		const quickInputService = accessor.get(IQuickInputService);

		const activeInput = editorService.activeEditor;
		const activeResource = EditorResourceAccessor.getOriginalUri(activeInput);
		if (activeResource && textModelService.canHandleResource(activeResource)) {
			const picks = await quickInputService.quickAccess.pick('', { itemActivation: ItemActivation.SECOND });
			if (picks?.length === 1) {
				const resource = (picks[0] as unknown as { resource: unknown }).resource;
				if (URI.isUri(resource) && textModelService.canHandleResource(resource)) {
					editorService.openEditor({
						original: { resource: activeResource },
						modified: { resource: resource },
						options: { pinned: true }
					});
				}
			}
		}
	}
}

export class ToggleAutoSaveAction extends Action2 {
	static readonly ID = 'workbench.action.toggleAutoSave';

	constructor() {
		super({
			id: ToggleAutoSaveAction.ID,
			title: nls.localize2('toggleAutoSave', "Toggle Auto Save"),
			f1: true,
			category: Categories.File,
			metadata: { description: nls.localize2('toggleAutoSaveDescription', "Toggle the ability to save files automatically after typing") }
		});
	}

	override run(accessor: ServicesAccessor): Promise<void> {
		const filesConfigurationService = accessor.get(IFilesConfigurationService);
		return filesConfigurationService.toggleAutoSave();
	}
}

abstract class BaseSaveAllAction extends Action {
	private lastDirtyState: boolean;

	constructor(
		id: string,
		label: string,
		@ICommandService protected commandService: ICommandService,
		@INotificationService private notificationService: INotificationService,
		@IWorkingCopyService private readonly workingCopyService: IWorkingCopyService
	) {
		super(id, label);

		this.lastDirtyState = this.workingCopyService.hasDirty;
		this.enabled = this.lastDirtyState;

		this.registerListeners();
	}

	protected abstract doRun(context: unknown): Promise<void>;

	private registerListeners(): void {

		// update enablement based on working copy changes
		this._register(this.workingCopyService.onDidChangeDirty(workingCopy => this.updateEnablement(workingCopy)));
	}

	private updateEnablement(workingCopy: IWorkingCopy): void {
		const hasDirty = workingCopy.isDirty() || this.workingCopyService.hasDirty;
		if (this.lastDirtyState !== hasDirty) {
			this.enabled = hasDirty;
			this.lastDirtyState = this.enabled;
		}
	}

	override async run(context?: unknown): Promise<void> {
		try {
			await this.doRun(context);
		} catch (error) {
			this.notificationService.error(toErrorMessage(error, false));
		}
	}
}

export class SaveAllInGroupAction extends BaseSaveAllAction {

	static readonly ID = 'workbench.files.action.saveAllInGroup';
	static readonly LABEL = nls.localize('saveAllInGroup', "Save All in Group");

	override get class(): string {
		return 'explorer-action ' + ThemeIcon.asClassName(Codicon.saveAll);
	}

	protected doRun(context: unknown): Promise<void> {
		return this.commandService.executeCommand(SAVE_ALL_IN_GROUP_COMMAND_ID, {}, context);
	}
}

export class CloseGroupAction extends Action {

	static readonly ID = 'workbench.files.action.closeGroup';
	static readonly LABEL = nls.localize('closeGroup', "Close Group");

	constructor(id: string, label: string, @ICommandService private readonly commandService: ICommandService) {
		super(id, label, ThemeIcon.asClassName(Codicon.closeAll));
	}

	override run(context?: unknown): Promise<void> {
		return this.commandService.executeCommand(CLOSE_EDITORS_AND_GROUP_COMMAND_ID, {}, context);
	}
}

export class FocusFilesExplorer extends Action2 {

	static readonly ID = 'workbench.files.action.focusFilesExplorer';
	static readonly LABEL = nls.localize2('focusFilesExplorer', "Focus on Files Explorer");

	constructor() {
		super({
			id: FocusFilesExplorer.ID,
			title: FocusFilesExplorer.LABEL,
			f1: true,
			category: Categories.File,
			metadata: {
				description: nls.localize2('focusFilesExplorerMetadata', "Moves focus to the file explorer view container.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		await paneCompositeService.openPaneComposite(VIEWLET_ID, ViewContainerLocation.Sidebar, true);
	}
}

export class ShowActiveFileInExplorer extends Action2 {

	static readonly ID = 'workbench.files.action.showActiveFileInExplorer';
	static readonly LABEL = nls.localize2('showInExplorer', "Reveal Active File in Explorer View");

	constructor() {
		super({
			id: ShowActiveFileInExplorer.ID,
			title: ShowActiveFileInExplorer.LABEL,
			f1: true,
			category: Categories.File,
			metadata: {
				description: nls.localize2('showInExplorerMetadata', "Reveals and selects the active file within the explorer view.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const commandService = accessor.get(ICommandService);
		const editorService = accessor.get(IEditorService);
		const resource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (resource) {
			commandService.executeCommand(REVEAL_IN_EXPLORER_COMMAND_ID, resource);
		}
	}
}

export class OpenActiveFileInEmptyWorkspace extends Action2 {

	static readonly ID = 'workbench.action.files.showOpenedFileInNewWindow';
	static readonly LABEL = nls.localize2('openFileInEmptyWorkspace', "Open Active Editor in New Empty Workspace");

	constructor(
	) {
		super({
			id: OpenActiveFileInEmptyWorkspace.ID,
			title: OpenActiveFileInEmptyWorkspace.LABEL,
			f1: true,
			category: Categories.File,
			precondition: EmptyWorkspaceSupportContext,
			metadata: {
				description: nls.localize2('openFileInEmptyWorkspaceMetadata', "Opens the active editor in a new window with no folders open.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const hostService = accessor.get(IHostService);
		const dialogService = accessor.get(IDialogService);
		const fileService = accessor.get(IFileService);

		const fileResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (fileResource && fileService.hasProvider(fileResource)) {
			hostService.openWindow([{ fileUri: fileResource }], { forceNewWindow: true });
		} else {
			dialogService.error(nls.localize('openFileToShowInNewWindow.unsupportedschema', "The active editor must contain an openable resource."));
		}
	}
}

export function validateFileName(pathService: IPathService, item: ExplorerItem, name: string, os: OperatingSystem): { content: string; severity: Severity } | null {
	// Produce a well formed file name
	name = getWellFormedFileName(name);

	// Name not provided
	if (!name || name.length === 0 || /^\s+$/.test(name)) {
		return {
			content: nls.localize('emptyFileNameError', "A file or folder name must be provided."),
			severity: Severity.Error
		};
	}

	// Relative paths only
	if (name[0] === '/' || name[0] === '\\') {
		return {
			content: nls.localize('fileNameStartsWithSlashError', "A file or folder name cannot start with a slash."),
			severity: Severity.Error
		};
	}

	const names = coalesce(name.split(/[\\/]/));
	const parent = item.parent;

	if (name !== item.name) {
		// Do not allow to overwrite existing file
		const child = parent?.getChild(name);
		if (child && child !== item) {
			return {
				content: nls.localize('fileNameExistsError', "A file or folder **{0}** already exists at this location. Please choose a different name.", name),
				severity: Severity.Error
			};
		}
	}

	// Check for invalid file name.
	if (names.some(folderName => !pathService.hasValidBasename(item.resource, os, folderName))) {
		// Escape * characters
		const escapedName = name.replace(/\*/g, '\\*'); // CodeQL [SM02383] This only processes filenames which are enforced against having backslashes in them farther up in the stack.
		return {
			content: nls.localize('invalidFileNameError', "The name **{0}** is not valid as a file or folder name. Please choose a different name.", trimLongName(escapedName)),
			severity: Severity.Error
		};
	}

	if (names.some(name => /^\s|\s$/.test(name))) {
		return {
			content: nls.localize('fileNameWhitespaceWarning', "Leading or trailing whitespace detected in file or folder name."),
			severity: Severity.Warning
		};
	}

	return null;
}

function trimLongName(name: string): string {
	if (name?.length > 255) {
		return `${name.substr(0, 255)}...`;
	}

	return name;
}

function getWellFormedFileName(filename: string): string {
	if (!filename) {
		return filename;
	}

	// Trim tabs
	filename = trim(filename, '\t');

	// Remove trailing slashes
	filename = rtrim(filename, '/');
	filename = rtrim(filename, '\\');

	return filename;
}

export class CompareNewUntitledTextFilesAction extends Action2 {

	static readonly ID = 'workbench.files.action.compareNewUntitledTextFiles';
	static readonly LABEL = nls.localize2('compareNewUntitledTextFiles', "Compare New Untitled Text Files");

	constructor() {
		super({
			id: CompareNewUntitledTextFilesAction.ID,
			title: CompareNewUntitledTextFilesAction.LABEL,
			f1: true,
			category: Categories.File,
			metadata: {
				description: nls.localize2('compareNewUntitledTextFilesMeta', "Opens a new diff editor with two untitled files.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);

		await editorService.openEditor({
			original: { resource: undefined },
			modified: { resource: undefined },
			options: { pinned: true }
		});
	}
}

export class CompareWithClipboardAction extends Action2 {

	static readonly ID = 'workbench.files.action.compareWithClipboard';
	static readonly LABEL = nls.localize2('compareWithClipboard', "Compare Active File with Clipboard");

	private registrationDisposal: IDisposable | undefined;
	private static SCHEME_COUNTER = 0;

	constructor() {
		super({
			id: CompareWithClipboardAction.ID,
			title: CompareWithClipboardAction.LABEL,
			f1: true,
			category: Categories.File,
			keybinding: { primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyC), weight: KeybindingWeight.WorkbenchContrib },
			metadata: {
				description: nls.localize2('compareWithClipboardMeta', "Opens a new diff editor to compare the active file with the contents of the clipboard.")
			}
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const instantiationService = accessor.get(IInstantiationService);
		const textModelService = accessor.get(ITextModelService);
		const fileService = accessor.get(IFileService);

		const resource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		const scheme = `clipboardCompare${CompareWithClipboardAction.SCHEME_COUNTER++}`;
		if (resource && (fileService.hasProvider(resource) || resource.scheme === Schemas.untitled)) {
			if (!this.registrationDisposal) {
				const provider = instantiationService.createInstance(ClipboardContentProvider);
				this.registrationDisposal = textModelService.registerTextModelContentProvider(scheme, provider);
			}

			const name = resources.basename(resource);
			const editorLabel = nls.localize('clipboardComparisonLabel', "Clipboard ↔ {0}", name);

			await editorService.openEditor({
				original: { resource: resource.with({ scheme }) },
				modified: { resource: resource },
				label: editorLabel,
				options: { pinned: true }
			}).finally(() => {
				dispose(this.registrationDisposal);
				this.registrationDisposal = undefined;
			});
		}
	}

	dispose(): void {
		dispose(this.registrationDisposal);
		this.registrationDisposal = undefined;
	}
}

class ClipboardContentProvider implements ITextModelContentProvider {
	constructor(
		@IClipboardService private readonly clipboardService: IClipboardService,
		@ILanguageService private readonly languageService: ILanguageService,
		@IModelService private readonly modelService: IModelService
	) { }

	async provideTextContent(resource: URI): Promise<ITextModel> {
		const text = await this.clipboardService.readText();
		const model = this.modelService.createModel(text, this.languageService.createByFilepathOrFirstLine(resource), resource);

		return model;
	}
}

function onErrorWithRetry(notificationService: INotificationService, error: unknown, retry: () => Promise<unknown>): void {
	notificationService.prompt(Severity.Error, toErrorMessage(error, false),
		[{
			label: nls.localize('retry', "Retry"),
			run: () => retry()
		}]
	);
}

async function openExplorerAndCreate(accessor: ServicesAccessor, isFolder: boolean): Promise<void> {
	const explorerService = accessor.get(IExplorerService);
	const fileService = accessor.get(IFileService);
	const configService = accessor.get(IConfigurationService);
	const filesConfigService = accessor.get(IFilesConfigurationService);
	const editorService = accessor.get(IEditorService);
	const viewsService = accessor.get(IViewsService);
	const notificationService = accessor.get(INotificationService);
	const remoteAgentService = accessor.get(IRemoteAgentService);
	const commandService = accessor.get(ICommandService);
	const pathService = accessor.get(IPathService);

	const wasHidden = !viewsService.isViewVisible(VIEW_ID);
	const view = await viewsService.openView(VIEW_ID, true);
	if (wasHidden) {
		// Give explorer some time to resolve itself #111218
		await timeout(500);
	}
	if (!view) {
		// Can happen in empty workspace case (https://github.com/microsoft/vscode/issues/100604)

		if (isFolder) {
			throw new Error('Open a folder or workspace first.');
		}

		return commandService.executeCommand(NEW_UNTITLED_FILE_COMMAND_ID);
	}

	const stats = explorerService.getContext(false);
	const stat = stats.length > 0 ? stats[0] : undefined;
	let folder: ExplorerItem;
	if (stat) {
		folder = stat.isDirectory ? stat : (stat.parent || explorerService.roots[0]);
	} else {
		folder = explorerService.roots[0];
	}

	if (folder.isReadonly) {
		throw new Error('Parent folder is readonly.');
	}

	const newStat = new NewExplorerItem(fileService, configService, filesConfigService, folder, isFolder);
	folder.addChild(newStat);

	const onSuccess = async (value: string): Promise<void> => {
		try {
			const resourceToCreate = resources.joinPath(folder.resource, value);
			if (value.endsWith('/')) {
				isFolder = true;
			}
			await explorerService.applyBulkEdit([new ResourceFileEdit(undefined, resourceToCreate, { folder: isFolder })], {
				undoLabel: nls.localize('createBulkEdit', "Create {0}", value),
				progressLabel: nls.localize('creatingBulkEdit', "Creating {0}", value),
				confirmBeforeUndo: true
			});
			await refreshIfSeparator(value, explorerService);

			if (isFolder) {
				await explorerService.select(resourceToCreate, true);
			} else {
				await editorService.openEditor({ resource: resourceToCreate, options: { pinned: true } });
			}
		} catch (error) {
			onErrorWithRetry(notificationService, error, () => onSuccess(value));
		}
	};

	const os = (await remoteAgentService.getEnvironment())?.os ?? OS;

	await explorerService.setEditable(newStat, {
		validationMessage: value => validateFileName(pathService, newStat, value, os),
		onFinish: async (value, success) => {
			folder.removeChild(newStat);
			await explorerService.setEditable(newStat, null);
			if (success) {
				onSuccess(value);
			}
		}
	});
}

CommandsRegistry.registerCommand({
	id: NEW_FILE_COMMAND_ID,
	handler: async (accessor) => {
		await openExplorerAndCreate(accessor, false);
	}
});

CommandsRegistry.registerCommand({
	id: NEW_FOLDER_COMMAND_ID,
	handler: async (accessor) => {
		await openExplorerAndCreate(accessor, true);
	}
});

export const renameHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const notificationService = accessor.get(INotificationService);
	const remoteAgentService = accessor.get(IRemoteAgentService);
	const pathService = accessor.get(IPathService);
	const configurationService = accessor.get(IConfigurationService);

	const stats = explorerService.getContext(false);
	const stat = stats.length > 0 ? stats[0] : undefined;
	if (!stat) {
		return;
	}

	const os = (await remoteAgentService.getEnvironment())?.os ?? OS;

	await explorerService.setEditable(stat, {
		validationMessage: value => validateFileName(pathService, stat, value, os),
		onFinish: async (value, success) => {
			if (success) {
				const parentResource = stat.parent!.resource;
				const targetResource = resources.joinPath(parentResource, value);
				if (stat.resource.toString() !== targetResource.toString()) {
					try {
						await explorerService.applyBulkEdit([new ResourceFileEdit(stat.resource, targetResource)], {
							confirmBeforeUndo: configurationService.getValue<IFilesConfiguration>().explorer.confirmUndo === UndoConfirmLevel.Verbose,
							undoLabel: nls.localize('renameBulkEdit', "Rename {0} to {1}", stat.name, value),
							progressLabel: nls.localize('renamingBulkEdit', "Renaming {0} to {1}", stat.name, value),
						});
						await refreshIfSeparator(value, explorerService);
					} catch (e) {
						notificationService.error(e);
					}
				}
			}
			await explorerService.setEditable(stat, null);
		}
	});
};

export const moveFileToTrashHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const stats = explorerService.getContext(true).filter(s => !s.isRoot);
	if (stats.length) {
		await deleteFiles(accessor.get(IExplorerService), accessor.get(IWorkingCopyFileService), accessor.get(IDialogService), accessor.get(IConfigurationService), accessor.get(IFilesConfigurationService), stats, true);
	}
};

export const deleteFileHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const stats = explorerService.getContext(true).filter(s => !s.isRoot);

	if (stats.length) {
		await deleteFiles(accessor.get(IExplorerService), accessor.get(IWorkingCopyFileService), accessor.get(IDialogService), accessor.get(IConfigurationService), accessor.get(IFilesConfigurationService), stats, false);
	}
};

let pasteShouldMove = false;
export const copyFileHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const stats = explorerService.getContext(true);
	if (stats.length > 0) {
		await explorerService.setToCopy(stats, false);
		pasteShouldMove = false;
	}
};

export const cutFileHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const stats = explorerService.getContext(true);
	if (stats.length > 0) {
		await explorerService.setToCopy(stats, true);
		pasteShouldMove = true;
	}
};

const downloadFileHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const notificationService = accessor.get(INotificationService);
	const instantiationService = accessor.get(IInstantiationService);

	const context = explorerService.getContext(true);
	const explorerItems = context.length ? context : explorerService.roots;

	const downloadHandler = instantiationService.createInstance(FileDownload);

	try {
		await downloadHandler.download(explorerItems);
	} catch (error) {
		notificationService.error(error);

		throw error;
	}
};

CommandsRegistry.registerCommand({
	id: DOWNLOAD_COMMAND_ID,
	handler: downloadFileHandler
});

const uploadFileHandler = async (accessor: ServicesAccessor) => {
	const explorerService = accessor.get(IExplorerService);
	const notificationService = accessor.get(INotificationService);
	const instantiationService = accessor.get(IInstantiationService);

	const context = explorerService.getContext(false);
	const element = context.length ? context[0] : explorerService.roots[0];

	try {
		const files = await triggerUpload();
		if (files) {
			const browserUpload = instantiationService.createInstance(BrowserFileUpload);
			await browserUpload.upload(element, files);
		}
	} catch (error) {
		notificationService.error(error);

		throw error;
	}
};

CommandsRegistry.registerCommand({
	id: UPLOAD_COMMAND_ID,
	handler: uploadFileHandler
});

export const pasteFileHandler = async (accessor: ServicesAccessor, fileList?: FileList) => {
	const clipboardService = accessor.get(IClipboardService);
	const explorerService = accessor.get(IExplorerService);
	const fileService = accessor.get(IFileService);
	const notificationService = accessor.get(INotificationService);
	const editorService = accessor.get(IEditorService);
	const configurationService = accessor.get(IConfigurationService);
	const uriIdentityService = accessor.get(IUriIdentityService);
	const dialogService = accessor.get(IDialogService);
	const hostService = accessor.get(IHostService);

	const context = explorerService.getContext(false);
	const hasNativeFilesToPaste = fileList && fileList.length > 0;
	const confirmPasteNative = hasNativeFilesToPaste && configurationService.getValue<boolean>('explorer.confirmPasteNative');

	const toPaste = await getFilesToPaste(fileList, clipboardService, hostService);

	if (confirmPasteNative && toPaste.files.length >= 1) {
		const message = toPaste.files.length > 1 ?
			nls.localize('confirmMultiPasteNative', "Are you sure you want to paste the following {0} items?", toPaste.files.length) :
			nls.localize('confirmPasteNative', "Are you sure you want to paste '{0}'?", basename(toPaste.type === 'paths' ? toPaste.files[0].fsPath : toPaste.files[0].name));
		const detail = toPaste.files.length > 1 ? getFileNamesMessage(toPaste.files.map(item => {
			if (URI.isUri(item)) {
				return item.fsPath;
			}

			if (toPaste.type === 'paths') {
				const path = getPathForFile(item);
				if (path) {
					return path;
				}
			}

			return item.name;
		})) : undefined;
		const confirmation = await dialogService.confirm({
			message,
			detail,
			checkbox: {
				label: nls.localize('doNotAskAgain', "Do not ask me again")
			},
			primaryButton: nls.localize({ key: 'pasteButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Paste")
		});

		if (!confirmation.confirmed) {
			return;
		}

		// Check for confirmation checkbox
		if (confirmation.checkboxChecked === true) {
			await configurationService.updateValue('explorer.confirmPasteNative', false);
		}
	}
	const element = context.length ? context[0] : explorerService.roots[0];
	const incrementalNaming = configurationService.getValue<IFilesConfiguration>().explorer.incrementalNaming;

	const editableItem = explorerService.getEditable();
	// If it's an editable item, just do nothing
	if (editableItem) {
		return;
	}

	try {
		let targets: URI[] = [];

		if (toPaste.type === 'paths') { // Pasting from files on disk

			// Check if target is ancestor of pasted folder
			const sourceTargetPairs = coalesce(await Promise.all(toPaste.files.map(async fileToPaste => {
				if (element.resource.toString() !== fileToPaste.toString() && resources.isEqualOrParent(element.resource, fileToPaste)) {
					throw new Error(nls.localize('fileIsAncestor', "File to paste is an ancestor of the destination folder"));
				}
				const fileToPasteStat = await fileService.stat(fileToPaste);

				// Find target
				let target: ExplorerItem;
				if (uriIdentityService.extUri.isEqual(element.resource, fileToPaste)) {
					target = element.parent!;
				} else {
					target = element.isDirectory ? element : element.parent!;
				}

				const targetFile = await findValidPasteFileTarget(
					explorerService,
					fileService,
					dialogService,
					target,
					{ resource: fileToPaste, isDirectory: fileToPasteStat.isDirectory, allowOverwrite: pasteShouldMove || incrementalNaming === 'disabled' },
					incrementalNaming
				);

				if (!targetFile) {
					return undefined;
				}

				return { source: fileToPaste, target: targetFile };
			})));

			if (sourceTargetPairs.length >= 1) {
				// Move/Copy File
				if (pasteShouldMove) {
					const resourceFileEdits = sourceTargetPairs.map(pair => new ResourceFileEdit(pair.source, pair.target, { overwrite: incrementalNaming === 'disabled' }));
					const options = {
						confirmBeforeUndo: configurationService.getValue<IFilesConfiguration>().explorer.confirmUndo === UndoConfirmLevel.Verbose,
						progressLabel: sourceTargetPairs.length > 1 ? nls.localize({ key: 'movingBulkEdit', comment: ['Placeholder will be replaced by the number of files being moved'] }, "Moving {0} files", sourceTargetPairs.length)
							: nls.localize({ key: 'movingFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file moved.'] }, "Moving {0}", resources.basenameOrAuthority(sourceTargetPairs[0].target)),
						undoLabel: sourceTargetPairs.length > 1 ? nls.localize({ key: 'moveBulkEdit', comment: ['Placeholder will be replaced by the number of files being moved'] }, "Move {0} files", sourceTargetPairs.length)
							: nls.localize({ key: 'moveFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file moved.'] }, "Move {0}", resources.basenameOrAuthority(sourceTargetPairs[0].target))
					};
					await explorerService.applyBulkEdit(resourceFileEdits, options);
				} else {
					const resourceFileEdits = sourceTargetPairs.map(pair => new ResourceFileEdit(pair.source, pair.target, { copy: true, overwrite: incrementalNaming === 'disabled' }));
					await applyCopyResourceEdit(sourceTargetPairs.map(pair => pair.target), resourceFileEdits);
				}
			}

			targets = sourceTargetPairs.map(pair => pair.target);

		} else { // Pasting from file data
			const targetAndEdits = coalesce(await Promise.all(toPaste.files.map(async file => {
				const target = element.isDirectory ? element : element.parent!;

				const targetFile = await findValidPasteFileTarget(
					explorerService,
					fileService,
					dialogService,
					target,
					{ resource: file.name, isDirectory: false, allowOverwrite: pasteShouldMove || incrementalNaming === 'disabled' },
					incrementalNaming
				);
				if (!targetFile) {
					return;
				}
				return {
					target: targetFile,
					edit: new ResourceFileEdit(undefined, targetFile, {
						overwrite: incrementalNaming === 'disabled',
						contents: (async () => VSBuffer.wrap(new Uint8Array(await file.arrayBuffer())))(),
					})
				};
			})));

			await applyCopyResourceEdit(targetAndEdits.map(pair => pair.target), targetAndEdits.map(pair => pair.edit));
			targets = targetAndEdits.map(pair => pair.target);
		}

		if (targets.length) {
			const firstTarget = targets[0];
			await explorerService.select(firstTarget);
			if (targets.length === 1) {
				const item = explorerService.findClosest(firstTarget);
				if (item && !item.isDirectory) {
					await editorService.openEditor({ resource: item.resource, options: { pinned: true, preserveFocus: true } });
				}
			}
		}
	} catch (e) {
		notificationService.error(toErrorMessage(new Error(nls.localize('fileDeleted', "The file(s) to paste have been deleted or moved since you copied them. {0}", getErrorMessage(e))), false));
	} finally {
		if (pasteShouldMove) {
			// Cut is done. Make sure to clear cut state.
			await explorerService.setToCopy([], false);
			pasteShouldMove = false;
		}
	}

	async function applyCopyResourceEdit(targets: readonly URI[], resourceFileEdits: ResourceFileEdit[]) {
		const undoLevel = configurationService.getValue<IFilesConfiguration>().explorer.confirmUndo;
		const options = {
			confirmBeforeUndo: undoLevel === UndoConfirmLevel.Default || undoLevel === UndoConfirmLevel.Verbose,
			progressLabel: targets.length > 1 ? nls.localize({ key: 'copyingBulkEdit', comment: ['Placeholder will be replaced by the number of files being copied'] }, "Copying {0} files", targets.length)
				: nls.localize({ key: 'copyingFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file copied.'] }, "Copying {0}", resources.basenameOrAuthority(targets[0])),
			undoLabel: targets.length > 1 ? nls.localize({ key: 'copyBulkEdit', comment: ['Placeholder will be replaced by the number of files being copied'] }, "Paste {0} files", targets.length)
				: nls.localize({ key: 'copyFileBulkEdit', comment: ['Placeholder will be replaced by the name of the file copied.'] }, "Paste {0}", resources.basenameOrAuthority(targets[0]))
		};
		await explorerService.applyBulkEdit(resourceFileEdits, options);
	}
};

type FilesToPaste =
	| { type: 'paths'; files: URI[] }
	| { type: 'data'; files: File[] };

async function getFilesToPaste(fileList: FileList | undefined, clipboardService: IClipboardService, hostService: IHostService): Promise<FilesToPaste> {
	if (fileList && fileList.length > 0) {
		// with a `fileList` we support natively pasting file from disk from clipboard
		const resources = [...fileList].map(file => getPathForFile(file)).filter(filePath => !!filePath && isAbsolute(filePath)).map((filePath) => URI.file(filePath!));
		if (resources.length) {
			return { type: 'paths', files: resources, };
		}

		// Support pasting files that we can't read from disk
		return { type: 'data', files: [...fileList].filter(file => !getPathForFile(file)) };
	} else {
		// otherwise we fallback to reading resources from our clipboard service
		return { type: 'paths', files: resources.distinctParents(await clipboardService.readResources(), resource => resource) };
	}
}

export const openFilePreserveFocusHandler = async (accessor: ServicesAccessor) => {
	const editorService = accessor.get(IEditorService);
	const explorerService = accessor.get(IExplorerService);
	const stats = explorerService.getContext(true);

	await editorService.openEditors(stats.filter(s => !s.isDirectory).map(s => ({
		resource: s.resource,
		options: { preserveFocus: true }
	})));
};

class BaseSetActiveEditorReadonlyInSession extends Action2 {

	constructor(
		id: string,
		title: ILocalizedString,
		private readonly newReadonlyState: true | false | 'toggle' | 'reset'
	) {
		super({
			id,
			title,
			f1: true,
			category: Categories.File,
			precondition: ActiveEditorCanToggleReadonlyContext
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const editorService = accessor.get(IEditorService);
		const filesConfigurationService = accessor.get(IFilesConfigurationService);

		const fileResource = EditorResourceAccessor.getOriginalUri(editorService.activeEditor, { supportSideBySide: SideBySideEditor.PRIMARY });
		if (!fileResource) {
			return;
		}

		await filesConfigurationService.updateReadonly(fileResource, this.newReadonlyState);
	}
}

export class SetActiveEditorReadonlyInSession extends BaseSetActiveEditorReadonlyInSession {

	static readonly ID = 'workbench.action.files.setActiveEditorReadonlyInSession';
	static readonly LABEL = nls.localize2('setActiveEditorReadonlyInSession', "Set Active Editor Read-only in Session");

	constructor() {
		super(
			SetActiveEditorReadonlyInSession.ID,
			SetActiveEditorReadonlyInSession.LABEL,
			true
		);
	}
}

export class SetActiveEditorWriteableInSession extends BaseSetActiveEditorReadonlyInSession {

	static readonly ID = 'workbench.action.files.setActiveEditorWriteableInSession';
	static readonly LABEL = nls.localize2('setActiveEditorWriteableInSession', "Set Active Editor Writeable in Session");

	constructor() {
		super(
			SetActiveEditorWriteableInSession.ID,
			SetActiveEditorWriteableInSession.LABEL,
			false
		);
	}
}

export class ToggleActiveEditorReadonlyInSession extends BaseSetActiveEditorReadonlyInSession {

	static readonly ID = 'workbench.action.files.toggleActiveEditorReadonlyInSession';
	static readonly LABEL = nls.localize2('toggleActiveEditorReadonlyInSession', "Toggle Active Editor Read-only in Session");

	constructor() {
		super(
			ToggleActiveEditorReadonlyInSession.ID,
			ToggleActiveEditorReadonlyInSession.LABEL,
			'toggle'
		);
	}
}

export class ResetActiveEditorReadonlyInSession extends BaseSetActiveEditorReadonlyInSession {

	static readonly ID = 'workbench.action.files.resetActiveEditorReadonlyInSession';
	static readonly LABEL = nls.localize2('resetActiveEditorReadonlyInSession', "Reset Active Editor Read-only in Session");

	constructor() {
		super(
			ResetActiveEditorReadonlyInSession.ID,
			ResetActiveEditorReadonlyInSession.LABEL,
			'reset'
		);
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/fileCommands.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/fileCommands.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { URI } from '../../../../base/common/uri.js';
import { EditorResourceAccessor, IEditorCommandsContext, SideBySideEditor, IEditorIdentifier, SaveReason, EditorsOrder, EditorInputCapabilities } from '../../../common/editor.js';
import { SideBySideEditorInput } from '../../../common/editor/sideBySideEditorInput.js';
import { IWindowOpenable, IOpenWindowOptions, isWorkspaceToOpen, IOpenEmptyWindowOptions } from '../../../../platform/window/common/window.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { ServicesAccessor, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IWorkspaceContextService, UNTITLED_WORKSPACE_NAME } from '../../../../platform/workspace/common/workspace.js';
import { ExplorerFocusCondition, TextFileContentProvider, VIEWLET_ID, ExplorerCompressedFocusContext, ExplorerCompressedFirstFocusContext, ExplorerCompressedLastFocusContext, FilesExplorerFocusCondition, ExplorerFolderContext, VIEW_ID } from '../common/files.js';
import { ExplorerViewPaneContainer } from './explorerViewlet.js';
import { IClipboardService } from '../../../../platform/clipboard/common/clipboardService.js';
import { toErrorMessage } from '../../../../base/common/errorMessage.js';
import { CommandsRegistry, ICommandHandler, ICommandService } from '../../../../platform/commands/common/commands.js';
import { IContextKey, IContextKeyService, ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { IFileService } from '../../../../platform/files/common/files.js';
import { KeybindingsRegistry, KeybindingWeight } from '../../../../platform/keybinding/common/keybindingsRegistry.js';
import { KeyMod, KeyCode, KeyChord } from '../../../../base/common/keyCodes.js';
import { isWeb, isWindows } from '../../../../base/common/platform.js';
import { ITextModelService } from '../../../../editor/common/services/resolverService.js';
import { getResourceForCommand, getMultiSelectedResources, getOpenEditorsViewMultiSelection, IExplorerService } from './files.js';
import { IWorkspaceEditingService } from '../../../services/workspaces/common/workspaceEditing.js';
import { resolveCommandsContext } from '../../../browser/parts/editor/editorCommandsContext.js';
import { Schemas } from '../../../../base/common/network.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { EditorContextKeys } from '../../../../editor/common/editorContextKeys.js';
import { IEditorService, SIDE_GROUP, ISaveEditorsOptions } from '../../../services/editor/common/editorService.js';
import { IEditorGroupsService, GroupsOrder, IEditorGroup } from '../../../services/editor/common/editorGroupsService.js';
import { ILabelService } from '../../../../platform/label/common/label.js';
import { basename, joinPath, isEqual } from '../../../../base/common/resources.js';
import { IDisposable, dispose } from '../../../../base/common/lifecycle.js';
import { IEnvironmentService } from '../../../../platform/environment/common/environment.js';
import { ICodeEditorService } from '../../../../editor/browser/services/codeEditorService.js';
import { EmbeddedCodeEditorWidget } from '../../../../editor/browser/widget/codeEditor/embeddedCodeEditorWidget.js';
import { ITextFileService } from '../../../services/textfile/common/textfiles.js';
import { IUriIdentityService } from '../../../../platform/uriIdentity/common/uriIdentity.js';
import { isCancellationError } from '../../../../base/common/errors.js';
import { IAction, toAction } from '../../../../base/common/actions.js';
import { EditorOpenSource, EditorResolution } from '../../../../platform/editor/common/editor.js';
import { hash } from '../../../../base/common/hash.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IPaneCompositePartService } from '../../../services/panecomposite/browser/panecomposite.js';
import { ViewContainerLocation } from '../../../common/views.js';
import { IViewsService } from '../../../services/views/common/viewsService.js';
import { OPEN_TO_SIDE_COMMAND_ID, COMPARE_WITH_SAVED_COMMAND_ID, SELECT_FOR_COMPARE_COMMAND_ID, ResourceSelectedForCompareContext, COMPARE_SELECTED_COMMAND_ID, COMPARE_RESOURCE_COMMAND_ID, COPY_PATH_COMMAND_ID, COPY_RELATIVE_PATH_COMMAND_ID, REVEAL_IN_EXPLORER_COMMAND_ID, OPEN_WITH_EXPLORER_COMMAND_ID, SAVE_FILE_COMMAND_ID, SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID, SAVE_FILE_AS_COMMAND_ID, SAVE_ALL_COMMAND_ID, SAVE_ALL_IN_GROUP_COMMAND_ID, SAVE_FILES_COMMAND_ID, REVERT_FILE_COMMAND_ID, REMOVE_ROOT_FOLDER_COMMAND_ID, PREVIOUS_COMPRESSED_FOLDER, NEXT_COMPRESSED_FOLDER, FIRST_COMPRESSED_FOLDER, LAST_COMPRESSED_FOLDER, NEW_UNTITLED_FILE_COMMAND_ID, NEW_UNTITLED_FILE_LABEL, NEW_FILE_COMMAND_ID } from './fileConstants.js';
import { IFileDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { RemoveRootFolderAction } from '../../../browser/actions/workspaceActions.js';
import { OpenEditorsView } from './views/openEditorsView.js';
import { ExplorerView } from './views/explorerView.js';
import { IListService } from '../../../../platform/list/browser/listService.js';

export const openWindowCommand = (accessor: ServicesAccessor, toOpen: IWindowOpenable[], options?: IOpenWindowOptions) => {
	if (Array.isArray(toOpen)) {
		const hostService = accessor.get(IHostService);
		const environmentService = accessor.get(IEnvironmentService);

		// rewrite untitled: workspace URIs to the absolute path on disk
		toOpen = toOpen.map(openable => {
			if (isWorkspaceToOpen(openable) && openable.workspaceUri.scheme === Schemas.untitled) {
				return {
					workspaceUri: joinPath(environmentService.untitledWorkspacesHome, openable.workspaceUri.path, UNTITLED_WORKSPACE_NAME)
				};
			}

			return openable;
		});

		hostService.openWindow(toOpen, options);
	}
};

export const newWindowCommand = (accessor: ServicesAccessor, options?: IOpenEmptyWindowOptions) => {
	const hostService = accessor.get(IHostService);
	hostService.openWindow(options);
};

// Command registration

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: ExplorerFocusCondition,
	primary: KeyMod.CtrlCmd | KeyCode.Enter,
	mac: {
		primary: KeyMod.WinCtrl | KeyCode.Enter
	},
	id: OPEN_TO_SIDE_COMMAND_ID, handler: async (accessor, resource: URI | object) => {
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);
		const explorerService = accessor.get(IExplorerService);
		const resources = getMultiSelectedResources(resource, accessor.get(IListService), editorService, accessor.get(IEditorGroupsService), explorerService);

		// Set side input
		if (resources.length) {
			const untitledResources = resources.filter(resource => resource.scheme === Schemas.untitled);
			const fileResources = resources.filter(resource => resource.scheme !== Schemas.untitled);

			const items = await Promise.all(fileResources.map(async resource => {
				const item = explorerService.findClosest(resource);
				if (item) {
					// Explorer already resolved the item, no need to go to the file service #109780
					return item;
				}

				return await fileService.stat(resource);
			}));
			const files = items.filter(i => !i.isDirectory);
			const editors = files.map(f => ({
				resource: f.resource,
				options: { pinned: true }
			})).concat(...untitledResources.map(untitledResource => ({ resource: untitledResource, options: { pinned: true } })));

			await editorService.openEditors(editors, SIDE_GROUP);
		}
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib + 10,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerFolderContext.toNegated()),
	primary: KeyCode.Enter,
	mac: {
		primary: KeyMod.CtrlCmd | KeyCode.DownArrow
	},
	id: 'explorer.openAndPassFocus', handler: async (accessor, _resource: URI | object) => {
		const editorService = accessor.get(IEditorService);
		const explorerService = accessor.get(IExplorerService);
		const resources = explorerService.getContext(true);

		if (resources.length) {
			await editorService.openEditors(resources.map(r => ({ resource: r.resource, options: { preserveFocus: false, pinned: true } })));
		}
	}
});

const COMPARE_WITH_SAVED_SCHEMA = 'showModifications';
let providerDisposables: IDisposable[] = [];
KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: COMPARE_WITH_SAVED_COMMAND_ID,
	when: undefined,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyD),
	handler: async (accessor, resource: URI | object) => {
		const instantiationService = accessor.get(IInstantiationService);
		const textModelService = accessor.get(ITextModelService);
		const editorService = accessor.get(IEditorService);
		const fileService = accessor.get(IFileService);
		const listService = accessor.get(IListService);

		// Register provider at first as needed
		let registerEditorListener = false;
		if (providerDisposables.length === 0) {
			registerEditorListener = true;

			const provider = instantiationService.createInstance(TextFileContentProvider);
			providerDisposables.push(provider);
			providerDisposables.push(textModelService.registerTextModelContentProvider(COMPARE_WITH_SAVED_SCHEMA, provider));
		}

		// Open editor (only resources that can be handled by file service are supported)
		const uri = getResourceForCommand(resource, editorService, listService);
		if (uri && fileService.hasProvider(uri)) {
			const name = basename(uri);
			const editorLabel = nls.localize('modifiedLabel', "{0} (in file) ↔ {1}", name, name);

			try {
				await TextFileContentProvider.open(uri, COMPARE_WITH_SAVED_SCHEMA, editorLabel, editorService, { pinned: true });
				// Dispose once no more diff editor is opened with the scheme
				if (registerEditorListener) {
					providerDisposables.push(editorService.onDidVisibleEditorsChange(() => {
						if (!editorService.editors.some(editor => !!EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.SECONDARY, filterByScheme: COMPARE_WITH_SAVED_SCHEMA }))) {
							providerDisposables = dispose(providerDisposables);
						}
					}));
				}
			} catch {
				providerDisposables = dispose(providerDisposables);
			}
		}
	}
});

let globalResourceToCompare: URI | undefined;
let resourceSelectedForCompareContext: IContextKey<boolean>;
CommandsRegistry.registerCommand({
	id: SELECT_FOR_COMPARE_COMMAND_ID,
	handler: (accessor, resource: URI | object) => {
		globalResourceToCompare = getResourceForCommand(resource, accessor.get(IEditorService), accessor.get(IListService));
		if (!resourceSelectedForCompareContext) {
			resourceSelectedForCompareContext = ResourceSelectedForCompareContext.bindTo(accessor.get(IContextKeyService));
		}
		resourceSelectedForCompareContext.set(true);
	}
});

CommandsRegistry.registerCommand({
	id: COMPARE_SELECTED_COMMAND_ID,
	handler: async (accessor, resource: URI | object) => {
		const editorService = accessor.get(IEditorService);
		const resources = getMultiSelectedResources(resource, accessor.get(IListService), editorService, accessor.get(IEditorGroupsService), accessor.get(IExplorerService));

		if (resources.length === 2) {
			return editorService.openEditor({
				original: { resource: resources[0] },
				modified: { resource: resources[1] },
				options: { pinned: true }
			});
		}

		return true;
	}
});

CommandsRegistry.registerCommand({
	id: COMPARE_RESOURCE_COMMAND_ID,
	handler: (accessor, resource: URI | object) => {
		const editorService = accessor.get(IEditorService);
		const rightResource = getResourceForCommand(resource, editorService, accessor.get(IListService));
		if (globalResourceToCompare && rightResource) {
			editorService.openEditor({
				original: { resource: globalResourceToCompare },
				modified: { resource: rightResource },
				options: { pinned: true }
			});
		}
	}
});

async function resourcesToClipboard(resources: URI[], relative: boolean, clipboardService: IClipboardService, labelService: ILabelService, configurationService: IConfigurationService): Promise<void> {
	if (resources.length) {
		const lineDelimiter = isWindows ? '\r\n' : '\n';

		let separator: '/' | '\\' | undefined = undefined;
		const copyRelativeOrFullPathSeparatorSection = relative ? 'explorer.copyRelativePathSeparator' : 'explorer.copyPathSeparator';
		const copyRelativeOrFullPathSeparator: '/' | '\\' | undefined = configurationService.getValue(copyRelativeOrFullPathSeparatorSection);
		if (copyRelativeOrFullPathSeparator === '/' || copyRelativeOrFullPathSeparator === '\\') {
			separator = copyRelativeOrFullPathSeparator;
		}

		const text = resources.map(resource => labelService.getUriLabel(resource, { relative, noPrefix: true, separator })).join(lineDelimiter);
		await clipboardService.writeText(text);
	}
}

const copyPathCommandHandler: ICommandHandler = async (accessor, resource: unknown) => {
	const resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService));
	await resourcesToClipboard(resources, false, accessor.get(IClipboardService), accessor.get(ILabelService), accessor.get(IConfigurationService));
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: EditorContextKeys.focus.toNegated(),
	primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC,
	win: {
		primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyC
	},
	id: COPY_PATH_COMMAND_ID,
	handler: copyPathCommandHandler
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: EditorContextKeys.focus,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyC),
	win: {
		primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KeyC
	},
	id: COPY_PATH_COMMAND_ID,
	handler: copyPathCommandHandler
});

const copyRelativePathCommandHandler: ICommandHandler = async (accessor, resource: unknown) => {
	const resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService));
	await resourcesToClipboard(resources, true, accessor.get(IClipboardService), accessor.get(ILabelService), accessor.get(IConfigurationService));
};

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: EditorContextKeys.focus.toNegated(),
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyC,
	win: {
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC)
	},
	id: COPY_RELATIVE_PATH_COMMAND_ID,
	handler: copyRelativePathCommandHandler
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: EditorContextKeys.focus,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyMod.Alt | KeyCode.KeyC),
	win: {
		primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyC)
	},
	id: COPY_RELATIVE_PATH_COMMAND_ID,
	handler: copyRelativePathCommandHandler
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: undefined,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyP),
	id: 'workbench.action.files.copyPathOfActiveFile',
	handler: async accessor => {
		const editorService = accessor.get(IEditorService);
		const activeInput = editorService.activeEditor;
		const resource = EditorResourceAccessor.getOriginalUri(activeInput, { supportSideBySide: SideBySideEditor.PRIMARY });
		const resources = resource ? [resource] : [];
		await resourcesToClipboard(resources, false, accessor.get(IClipboardService), accessor.get(ILabelService), accessor.get(IConfigurationService));
	}
});

CommandsRegistry.registerCommand({
	id: REVEAL_IN_EXPLORER_COMMAND_ID,
	handler: async (accessor, resource: URI | object) => {
		const viewService = accessor.get(IViewsService);
		const contextService = accessor.get(IWorkspaceContextService);
		const explorerService = accessor.get(IExplorerService);
		const editorService = accessor.get(IEditorService);
		const listService = accessor.get(IListService);
		const uri = getResourceForCommand(resource, editorService, listService);

		if (uri && contextService.isInsideWorkspace(uri)) {
			const explorerView = await viewService.openView<ExplorerView>(VIEW_ID, false);
			if (explorerView) {
				const oldAutoReveal = explorerView.autoReveal;
				// Disable autoreveal before revealing the explorer to prevent a race betwene auto reveal + selection
				// Fixes #197268
				explorerView.autoReveal = false;
				explorerView.setExpanded(true);
				await explorerService.select(uri, 'force');
				explorerView.focus();
				explorerView.autoReveal = oldAutoReveal;
			}
		} else {
			// Do not reveal the open editors view if it's hidden explicitly
			// See https://github.com/microsoft/vscode/issues/227378
			const openEditorsView = viewService.getViewWithId(OpenEditorsView.ID);
			if (openEditorsView) {
				openEditorsView.setExpanded(true);
				openEditorsView.focus();
			}
		}
	}
});

CommandsRegistry.registerCommand({
	id: OPEN_WITH_EXPLORER_COMMAND_ID,
	handler: async (accessor, resource: URI | object) => {
		const editorService = accessor.get(IEditorService);
		const listService = accessor.get(IListService);
		const uri = getResourceForCommand(resource, editorService, listService);
		if (uri) {
			return editorService.openEditor({ resource: uri, options: { override: EditorResolution.PICK, source: EditorOpenSource.USER } });
		}

		return undefined;
	}
});

// Save / Save As / Save All / Revert

async function saveSelectedEditors(accessor: ServicesAccessor, options?: ISaveEditorsOptions): Promise<void> {
	const editorGroupService = accessor.get(IEditorGroupsService);
	const codeEditorService = accessor.get(ICodeEditorService);
	const textFileService = accessor.get(ITextFileService);

	// Retrieve selected or active editor
	let editors = getOpenEditorsViewMultiSelection(accessor);
	if (!editors) {
		const activeGroup = editorGroupService.activeGroup;
		if (activeGroup.activeEditor) {
			editors = [];

			// Special treatment for side by side editors: if the active editor
			// has 2 sides, we consider both, to support saving both sides.
			// We only allow this when saving, not for "Save As" and not if any
			// editor is untitled which would bring up a "Save As" dialog too.
			// In addition, we require the secondary side to be modified to not
			// trigger a touch operation unexpectedly.
			//
			// See also https://github.com/microsoft/vscode/issues/4180
			// See also https://github.com/microsoft/vscode/issues/106330
			// See also https://github.com/microsoft/vscode/issues/190210
			if (
				activeGroup.activeEditor instanceof SideBySideEditorInput &&
				!options?.saveAs && !(activeGroup.activeEditor.primary.hasCapability(EditorInputCapabilities.Untitled) || activeGroup.activeEditor.secondary.hasCapability(EditorInputCapabilities.Untitled)) &&
				activeGroup.activeEditor.secondary.isModified()
			) {
				editors.push({ groupId: activeGroup.id, editor: activeGroup.activeEditor.primary });
				editors.push({ groupId: activeGroup.id, editor: activeGroup.activeEditor.secondary });
			} else {
				editors.push({ groupId: activeGroup.id, editor: activeGroup.activeEditor });
			}
		}
	}

	if (!editors || editors.length === 0) {
		return; // nothing to save
	}

	// Save editors
	await doSaveEditors(accessor, editors, options);

	// Special treatment for embedded editors: if we detect that focus is
	// inside an embedded code editor, we save that model as well if we
	// find it in our text file models. Currently, only textual editors
	// support embedded editors.
	const focusedCodeEditor = codeEditorService.getFocusedCodeEditor();
	if (focusedCodeEditor instanceof EmbeddedCodeEditorWidget && !focusedCodeEditor.isSimpleWidget) {
		const resource = focusedCodeEditor.getModel()?.uri;

		// Check that the resource of the model was not saved already
		if (resource && !editors.some(({ editor }) => isEqual(EditorResourceAccessor.getCanonicalUri(editor, { supportSideBySide: SideBySideEditor.PRIMARY }), resource))) {
			const model = textFileService.files.get(resource);
			if (!model?.isReadonly()) {
				await textFileService.save(resource, options);
			}
		}
	}
}

function saveDirtyEditorsOfGroups(accessor: ServicesAccessor, groups: readonly IEditorGroup[], options?: ISaveEditorsOptions): Promise<void> {
	const dirtyEditors: IEditorIdentifier[] = [];
	for (const group of groups) {
		for (const editor of group.getEditors(EditorsOrder.MOST_RECENTLY_ACTIVE)) {
			if (editor.isDirty()) {
				dirtyEditors.push({ groupId: group.id, editor });
			}
		}
	}

	return doSaveEditors(accessor, dirtyEditors, options);
}

async function doSaveEditors(accessor: ServicesAccessor, editors: IEditorIdentifier[], options?: ISaveEditorsOptions): Promise<void> {
	const editorService = accessor.get(IEditorService);
	const notificationService = accessor.get(INotificationService);
	const instantiationService = accessor.get(IInstantiationService);

	try {
		await editorService.save(editors, options);
	} catch (error) {
		if (!isCancellationError(error)) {
			const actions: IAction[] = [toAction({ id: 'workbench.action.files.saveEditors', label: nls.localize('retry', "Retry"), run: () => instantiationService.invokeFunction(accessor => doSaveEditors(accessor, editors, options)) })];
			const editorsToRevert = editors.filter(({ editor }) => !editor.hasCapability(EditorInputCapabilities.Untitled) /* all except untitled to prevent unexpected data-loss */);
			if (editorsToRevert.length > 0) {
				actions.push(toAction({ id: 'workbench.action.files.revertEditors', label: editorsToRevert.length > 1 ? nls.localize('revertAll', "Revert All") : nls.localize('revert', "Revert"), run: () => editorService.revert(editorsToRevert) }));
			}

			notificationService.notify({
				id: editors.map(({ editor }) => hash(editor.resource?.toString())).join(), // ensure unique notification ID per set of editor
				severity: Severity.Error,
				message: nls.localize({ key: 'genericSaveError', comment: ['{0} is the resource that failed to save and {1} the error message'] }, "Failed to save '{0}': {1}", editors.map(({ editor }) => editor.getName()).join(', '), toErrorMessage(error, false)),
				actions: { primary: actions }
			});
		}
	}
}

KeybindingsRegistry.registerCommandAndKeybindingRule({
	when: undefined,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyMod.CtrlCmd | KeyCode.KeyS,
	id: SAVE_FILE_COMMAND_ID,
	handler: accessor => {
		return saveSelectedEditors(accessor, { reason: SaveReason.EXPLICIT, force: true /* force save even when non-dirty */ });
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	when: undefined,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyS),
	win: { primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyS) },
	id: SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID,
	handler: accessor => {
		return saveSelectedEditors(accessor, { reason: SaveReason.EXPLICIT, force: true /* force save even when non-dirty */, skipSaveParticipants: true });
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	id: SAVE_FILE_AS_COMMAND_ID,
	weight: KeybindingWeight.WorkbenchContrib,
	when: undefined,
	primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyS,
	handler: accessor => {
		return saveSelectedEditors(accessor, { reason: SaveReason.EXPLICIT, saveAs: true });
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	when: undefined,
	weight: KeybindingWeight.WorkbenchContrib,
	primary: undefined,
	mac: { primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyS },
	win: { primary: KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyS) },
	id: SAVE_ALL_COMMAND_ID,
	handler: accessor => {
		return saveDirtyEditorsOfGroups(accessor, accessor.get(IEditorGroupsService).getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE), { reason: SaveReason.EXPLICIT });
	}
});

CommandsRegistry.registerCommand({
	id: SAVE_ALL_IN_GROUP_COMMAND_ID,
	handler: (accessor, _: URI | object, editorContext: IEditorCommandsContext) => {
		const editorGroupsService = accessor.get(IEditorGroupsService);

		const resolvedContext = resolveCommandsContext([editorContext], accessor.get(IEditorService), editorGroupsService, accessor.get(IListService));

		let groups: readonly IEditorGroup[] | undefined = undefined;
		if (!resolvedContext.groupedEditors.length) {
			groups = editorGroupsService.getGroups(GroupsOrder.MOST_RECENTLY_ACTIVE);
		} else {
			groups = resolvedContext.groupedEditors.map(({ group }) => group);
		}

		return saveDirtyEditorsOfGroups(accessor, groups, { reason: SaveReason.EXPLICIT });
	}
});

CommandsRegistry.registerCommand({
	id: SAVE_FILES_COMMAND_ID,
	handler: async accessor => {
		const editorService = accessor.get(IEditorService);

		const res = await editorService.saveAll({ includeUntitled: false, reason: SaveReason.EXPLICIT });
		return res.success;
	}
});

CommandsRegistry.registerCommand({
	id: REVERT_FILE_COMMAND_ID,
	handler: async accessor => {
		const editorGroupService = accessor.get(IEditorGroupsService);
		const editorService = accessor.get(IEditorService);

		// Retrieve selected or active editor
		let editors = getOpenEditorsViewMultiSelection(accessor);
		if (!editors) {
			const activeGroup = editorGroupService.activeGroup;
			if (activeGroup.activeEditor) {
				editors = [{ groupId: activeGroup.id, editor: activeGroup.activeEditor }];
			}
		}

		if (!editors || editors.length === 0) {
			return; // nothing to revert
		}

		try {
			await editorService.revert(editors.filter(({ editor }) => !editor.hasCapability(EditorInputCapabilities.Untitled) /* all except untitled */), { force: true });
		} catch (error) {
			const notificationService = accessor.get(INotificationService);
			notificationService.error(nls.localize('genericRevertError', "Failed to revert '{0}': {1}", editors.map(({ editor }) => editor.getName()).join(', '), toErrorMessage(error, false)));
		}
	}
});

CommandsRegistry.registerCommand({
	id: REMOVE_ROOT_FOLDER_COMMAND_ID,
	handler: (accessor, resource: URI | object) => {
		const contextService = accessor.get(IWorkspaceContextService);
		const uriIdentityService = accessor.get(IUriIdentityService);
		const workspace = contextService.getWorkspace();
		const resources = getMultiSelectedResources(resource, accessor.get(IListService), accessor.get(IEditorService), accessor.get(IEditorGroupsService), accessor.get(IExplorerService)).filter(resource =>
			workspace.folders.some(folder => uriIdentityService.extUri.isEqual(folder.uri, resource)) // Need to verify resources are workspaces since multi selection can trigger this command on some non workspace resources
		);

		if (resources.length === 0) {
			const commandService = accessor.get(ICommandService);
			// Show a picker for the user to choose which folder to remove
			return commandService.executeCommand(RemoveRootFolderAction.ID);
		}

		const workspaceEditingService = accessor.get(IWorkspaceEditingService);
		return workspaceEditingService.removeFolders(resources);
	}
});

// Compressed item navigation

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib + 10,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerCompressedFocusContext, ExplorerCompressedFirstFocusContext.negate()),
	primary: KeyCode.LeftArrow,
	id: PREVIOUS_COMPRESSED_FOLDER,
	handler: accessor => {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);

		if (viewlet?.getId() !== VIEWLET_ID) {
			return;
		}

		const explorer = viewlet.getViewPaneContainer() as ExplorerViewPaneContainer;
		const view = explorer.getExplorerView();
		view.previousCompressedStat();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib + 10,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerCompressedFocusContext, ExplorerCompressedLastFocusContext.negate()),
	primary: KeyCode.RightArrow,
	id: NEXT_COMPRESSED_FOLDER,
	handler: accessor => {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);

		if (viewlet?.getId() !== VIEWLET_ID) {
			return;
		}

		const explorer = viewlet.getViewPaneContainer() as ExplorerViewPaneContainer;
		const view = explorer.getExplorerView();
		view.nextCompressedStat();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib + 10,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerCompressedFocusContext, ExplorerCompressedFirstFocusContext.negate()),
	primary: KeyCode.Home,
	id: FIRST_COMPRESSED_FOLDER,
	handler: accessor => {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);

		if (viewlet?.getId() !== VIEWLET_ID) {
			return;
		}

		const explorer = viewlet.getViewPaneContainer() as ExplorerViewPaneContainer;
		const view = explorer.getExplorerView();
		view.firstCompressedStat();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib + 10,
	when: ContextKeyExpr.and(FilesExplorerFocusCondition, ExplorerCompressedFocusContext, ExplorerCompressedLastFocusContext.negate()),
	primary: KeyCode.End,
	id: LAST_COMPRESSED_FOLDER,
	handler: accessor => {
		const paneCompositeService = accessor.get(IPaneCompositePartService);
		const viewlet = paneCompositeService.getActivePaneComposite(ViewContainerLocation.Sidebar);

		if (viewlet?.getId() !== VIEWLET_ID) {
			return;
		}

		const explorer = viewlet.getViewPaneContainer() as ExplorerViewPaneContainer;
		const view = explorer.getExplorerView();
		view.lastCompressedStat();
	}
});

KeybindingsRegistry.registerCommandAndKeybindingRule({
	weight: KeybindingWeight.WorkbenchContrib,
	when: null,
	primary: isWeb ? (isWindows ? KeyChord(KeyMod.CtrlCmd | KeyCode.KeyK, KeyCode.KeyN) : KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.KeyN) : KeyMod.CtrlCmd | KeyCode.KeyN,
	secondary: isWeb ? [KeyMod.CtrlCmd | KeyCode.KeyN] : undefined,
	id: NEW_UNTITLED_FILE_COMMAND_ID,
	metadata: {
		description: NEW_UNTITLED_FILE_LABEL,
		args: [
			{
				isOptional: true,
				name: 'New Untitled Text File arguments',
				description: 'The editor view type or language ID if known',
				schema: {
					'type': 'object',
					'properties': {
						'viewType': {
							'type': 'string'
						},
						'languageId': {
							'type': 'string'
						}
					}
				}
			}
		]
	},
	handler: async (accessor, args?: { languageId?: string; viewType?: string }) => {
		const editorService = accessor.get(IEditorService);

		await editorService.openEditor({
			resource: undefined,
			options: {
				override: args?.viewType,
				pinned: true
			},
			languageId: args?.languageId,
		});
	}
});

CommandsRegistry.registerCommand({
	id: NEW_FILE_COMMAND_ID,
	handler: async (accessor, args?: { languageId?: string; viewType?: string; fileName?: string }) => {
		const editorService = accessor.get(IEditorService);
		const dialogService = accessor.get(IFileDialogService);
		const fileService = accessor.get(IFileService);

		const createFileLocalized = nls.localize('newFileCommand.saveLabel', "Create File");
		const defaultFileUri = joinPath(await dialogService.defaultFilePath(), args?.fileName ?? 'Untitled.txt');

		const saveUri = await dialogService.showSaveDialog({ saveLabel: createFileLocalized, title: createFileLocalized, defaultUri: defaultFileUri });

		if (!saveUri) {
			return;
		}

		await fileService.createFile(saveUri, undefined, { overwrite: true });

		await editorService.openEditor({
			resource: saveUri,
			options: {
				override: args?.viewType,
				pinned: true
			},
			languageId: args?.languageId,
		});
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/fileConstants.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/fileConstants.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as nls from '../../../../nls.js';
import { RawContextKey } from '../../../../platform/contextkey/common/contextkey.js';

export const REVEAL_IN_EXPLORER_COMMAND_ID = 'revealInExplorer';
export const REVERT_FILE_COMMAND_ID = 'workbench.action.files.revert';
export const OPEN_TO_SIDE_COMMAND_ID = 'explorer.openToSide';
export const OPEN_WITH_EXPLORER_COMMAND_ID = 'explorer.openWith';
export const SELECT_FOR_COMPARE_COMMAND_ID = 'selectForCompare';

export const COMPARE_SELECTED_COMMAND_ID = 'compareSelected';
export const COMPARE_RESOURCE_COMMAND_ID = 'compareFiles';
export const COMPARE_WITH_SAVED_COMMAND_ID = 'workbench.files.action.compareWithSaved';
export const COPY_PATH_COMMAND_ID = 'copyFilePath';
export const COPY_RELATIVE_PATH_COMMAND_ID = 'copyRelativeFilePath';

export const SAVE_FILE_AS_COMMAND_ID = 'workbench.action.files.saveAs';
export const SAVE_FILE_AS_LABEL = nls.localize2('saveAs', "Save As...");
export const SAVE_FILE_COMMAND_ID = 'workbench.action.files.save';
export const SAVE_FILE_LABEL = nls.localize2('save', "Save");
export const SAVE_FILE_WITHOUT_FORMATTING_COMMAND_ID = 'workbench.action.files.saveWithoutFormatting';
export const SAVE_FILE_WITHOUT_FORMATTING_LABEL = nls.localize2('saveWithoutFormatting', "Save without Formatting");

export const SAVE_ALL_COMMAND_ID = 'saveAll';
export const SAVE_ALL_LABEL = nls.localize2('saveAll', "Save All");

export const SAVE_ALL_IN_GROUP_COMMAND_ID = 'workbench.files.action.saveAllInGroup';

export const SAVE_FILES_COMMAND_ID = 'workbench.action.files.saveFiles';

export const OpenEditorsGroupContext = new RawContextKey<boolean>('groupFocusedInOpenEditors', false);
export const OpenEditorsDirtyEditorContext = new RawContextKey<boolean>('dirtyEditorFocusedInOpenEditors', false);
export const OpenEditorsReadonlyEditorContext = new RawContextKey<boolean>('readonlyEditorFocusedInOpenEditors', false);
export const OpenEditorsSelectedFileOrUntitledContext = new RawContextKey<boolean>('openEditorsSelectedFileOrUntitled', true);
export const ResourceSelectedForCompareContext = new RawContextKey<boolean>('resourceSelectedForCompare', false);

export const REMOVE_ROOT_FOLDER_COMMAND_ID = 'removeRootFolder';
export const REMOVE_ROOT_FOLDER_LABEL = nls.localize('removeFolderFromWorkspace', "Remove Folder from Workspace");

export const PREVIOUS_COMPRESSED_FOLDER = 'previousCompressedFolder';
export const NEXT_COMPRESSED_FOLDER = 'nextCompressedFolder';
export const FIRST_COMPRESSED_FOLDER = 'firstCompressedFolder';
export const LAST_COMPRESSED_FOLDER = 'lastCompressedFolder';
export const NEW_UNTITLED_FILE_COMMAND_ID = 'workbench.action.files.newUntitledFile';
export const NEW_UNTITLED_FILE_LABEL = nls.localize2('newUntitledFile', "New Untitled Text File");
export const NEW_FILE_COMMAND_ID = 'workbench.action.files.newFile';
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/contrib/files/browser/fileImportExport.ts]---
Location: vscode-main/src/vs/workbench/contrib/files/browser/fileImportExport.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { CancellationToken, CancellationTokenSource } from '../../../../base/common/cancellation.js';
import { getFileNamesMessage, IConfirmation, IDialogService, IFileDialogService, IPromptButton } from '../../../../platform/dialogs/common/dialogs.js';
import { ByteSize, FileSystemProviderCapabilities, IFileService, IFileStatWithMetadata } from '../../../../platform/files/common/files.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from '../../../../platform/progress/common/progress.js';
import { IExplorerService } from './files.js';
import { IFilesConfiguration, UndoConfirmLevel, VIEW_ID } from '../common/files.js';
import { IEditorService } from '../../../services/editor/common/editorService.js';
import { Limiter, Promises, RunOnceWorker } from '../../../../base/common/async.js';
import { newWriteableBufferStream, VSBuffer } from '../../../../base/common/buffer.js';
import { basename, dirname, joinPath } from '../../../../base/common/resources.js';
import { ResourceFileEdit } from '../../../../editor/browser/services/bulkEditService.js';
import { ExplorerItem } from '../common/explorerModel.js';
import { URI } from '../../../../base/common/uri.js';
import { IHostService } from '../../../services/host/browser/host.js';
import { IWorkspaceContextService } from '../../../../platform/workspace/common/workspace.js';
import { extractEditorsAndFilesDropData } from '../../../../platform/dnd/browser/dnd.js';
import { IWorkspaceEditingService } from '../../../services/workspaces/common/workspaceEditing.js';
import { isWeb } from '../../../../base/common/platform.js';
import { getActiveWindow, isDragEvent, triggerDownload } from '../../../../base/browser/dom.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { FileAccess, Schemas } from '../../../../base/common/network.js';
import { listenStream } from '../../../../base/common/stream.js';
import { DisposableStore, toDisposable } from '../../../../base/common/lifecycle.js';
import { createSingleCallFunction } from '../../../../base/common/functional.js';
import { coalesce } from '../../../../base/common/arrays.js';
import { canceled } from '../../../../base/common/errors.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { WebFileSystemAccess } from '../../../../platform/files/browser/webFileSystemAccess.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

//#region Browser File Upload (drag and drop, input element)

interface IBrowserUploadOperation {
	startTime: number;
	progressScheduler: RunOnceWorker<IProgressStep>;

	filesTotal: number;
	filesUploaded: number;

	totalBytesUploaded: number;
}

interface IWebkitDataTransfer {
	items: IWebkitDataTransferItem[];
}

interface IWebkitDataTransferItem {
	webkitGetAsEntry(): IWebkitDataTransferItemEntry;
}

interface IWebkitDataTransferItemEntry {
	name: string | undefined;
	isFile: boolean;
	isDirectory: boolean;

	file(resolve: (file: File) => void, reject: () => void): void;
	createReader(): IWebkitDataTransferItemEntryReader;
}

interface IWebkitDataTransferItemEntryReader {
	readEntries(resolve: (file: IWebkitDataTransferItemEntry[]) => void, reject: () => void): void;
}

export class BrowserFileUpload {

	private static readonly MAX_PARALLEL_UPLOADS = 20;

	constructor(
		@IProgressService private readonly progressService: IProgressService,
		@IDialogService private readonly dialogService: IDialogService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IEditorService private readonly editorService: IEditorService,
		@IFileService private readonly fileService: IFileService
	) {
	}

	upload(target: ExplorerItem, source: DragEvent | FileList): Promise<void> {
		const cts = new CancellationTokenSource();

		// Indicate progress globally
		const uploadPromise = this.progressService.withProgress(
			{
				location: ProgressLocation.Window,
				delay: 800,
				cancellable: true,
				title: localize('uploadingFiles', "Uploading")
			},
			async progress => this.doUpload(target, this.toTransfer(source), progress, cts.token),
			() => cts.dispose(true)
		);

		// Also indicate progress in the files view
		this.progressService.withProgress({ location: VIEW_ID, delay: 500 }, () => uploadPromise);

		return uploadPromise;
	}

	private toTransfer(source: DragEvent | FileList): IWebkitDataTransfer {
		if (isDragEvent(source)) {
			return source.dataTransfer as unknown as IWebkitDataTransfer;
		}

		const transfer: IWebkitDataTransfer = { items: [] };

		// We want to reuse the same code for uploading from
		// Drag & Drop as well as input element based upload
		// so we convert into webkit data transfer when the
		// input element approach is used (simplified).
		for (const file of source) {
			transfer.items.push({
				webkitGetAsEntry: () => {
					return {
						name: file.name,
						isDirectory: false,
						isFile: true,
						createReader: () => { throw new Error('Unsupported for files'); },
						file: resolve => resolve(file)
					};
				}
			});
		}

		return transfer;
	}

	private async doUpload(target: ExplorerItem, source: IWebkitDataTransfer, progress: IProgress<IProgressStep>, token: CancellationToken): Promise<void> {
		const items = source.items;

		// Somehow the items thing is being modified at random, maybe as a security
		// measure since this is a DND operation. As such, we copy the items into
		// an array we own as early as possible before using it.
		const entries: IWebkitDataTransferItemEntry[] = [];
		for (const item of items) {
			entries.push(item.webkitGetAsEntry());
		}

		const results: { isFile: boolean; resource: URI }[] = [];
		const operation: IBrowserUploadOperation = {
			startTime: Date.now(),
			progressScheduler: new RunOnceWorker<IProgressStep>(steps => { progress.report(steps[steps.length - 1]); }, 1000),

			filesTotal: entries.length,
			filesUploaded: 0,

			totalBytesUploaded: 0
		};

		// Upload all entries in parallel up to a
		// certain maximum leveraging the `Limiter`
		const uploadLimiter = new Limiter(BrowserFileUpload.MAX_PARALLEL_UPLOADS);
		await Promises.settled(entries.map(entry => {
			return uploadLimiter.queue(async () => {
				if (token.isCancellationRequested) {
					return;
				}

				// Confirm overwrite as needed
				if (target && entry.name && target.getChild(entry.name)) {
					const { confirmed } = await this.dialogService.confirm(getFileOverwriteConfirm(entry.name));
					if (!confirmed) {
						return;
					}

					await this.explorerService.applyBulkEdit([new ResourceFileEdit(joinPath(target.resource, entry.name), undefined, { recursive: true, folder: target.getChild(entry.name)?.isDirectory })], {
						undoLabel: localize('overwrite', "Overwrite {0}", entry.name),
						progressLabel: localize('overwriting', "Overwriting {0}", entry.name),
					});

					if (token.isCancellationRequested) {
						return;
					}
				}

				// Upload entry
				const result = await this.doUploadEntry(entry, target.resource, target, progress, operation, token);
				if (result) {
					results.push(result);
				}
			});
		}));

		operation.progressScheduler.dispose();

		// Open uploaded file in editor only if we upload just one
		const firstUploadedFile = results[0];
		if (!token.isCancellationRequested && firstUploadedFile?.isFile) {
			await this.editorService.openEditor({ resource: firstUploadedFile.resource, options: { pinned: true } });
		}
	}

	private async doUploadEntry(entry: IWebkitDataTransferItemEntry, parentResource: URI, target: ExplorerItem | undefined, progress: IProgress<IProgressStep>, operation: IBrowserUploadOperation, token: CancellationToken): Promise<{ isFile: boolean; resource: URI } | undefined> {
		if (token.isCancellationRequested || !entry.name || (!entry.isFile && !entry.isDirectory)) {
			return undefined;
		}

		// Report progress
		let fileBytesUploaded = 0;
		const reportProgress = (fileSize: number, bytesUploaded: number): void => {
			fileBytesUploaded += bytesUploaded;
			operation.totalBytesUploaded += bytesUploaded;

			const bytesUploadedPerSecond = operation.totalBytesUploaded / ((Date.now() - operation.startTime) / 1000);

			// Small file
			let message: string;
			if (fileSize < ByteSize.MB) {
				if (operation.filesTotal === 1) {
					message = `${entry.name}`;
				} else {
					message = localize('uploadProgressSmallMany', "{0} of {1} files ({2}/s)", operation.filesUploaded, operation.filesTotal, ByteSize.formatSize(bytesUploadedPerSecond));
				}
			}

			// Large file
			else {
				message = localize('uploadProgressLarge', "{0} ({1} of {2}, {3}/s)", entry.name, ByteSize.formatSize(fileBytesUploaded), ByteSize.formatSize(fileSize), ByteSize.formatSize(bytesUploadedPerSecond));
			}

			// Report progress but limit to update only once per second
			operation.progressScheduler.work({ message });
		};
		operation.filesUploaded++;
		reportProgress(0, 0);

		// Handle file upload
		const resource = joinPath(parentResource, entry.name);
		if (entry.isFile) {
			const file = await new Promise<File>((resolve, reject) => entry.file(resolve, reject));

			if (token.isCancellationRequested) {
				return undefined;
			}

			// Chrome/Edge/Firefox support stream method, but only use it for
			// larger files to reduce the overhead of the streaming approach
			if (typeof file.stream === 'function' && file.size > ByteSize.MB) {
				await this.doUploadFileBuffered(resource, file, reportProgress, token);
			}

			// Fallback to unbuffered upload for other browsers or small files
			else {
				await this.doUploadFileUnbuffered(resource, file, reportProgress);
			}

			return { isFile: true, resource };
		}

		// Handle folder upload
		else {

			// Create target folder
			await this.fileService.createFolder(resource);

			if (token.isCancellationRequested) {
				return undefined;
			}

			// Recursive upload files in this directory
			const dirReader = entry.createReader();
			const childEntries: IWebkitDataTransferItemEntry[] = [];
			let done = false;
			do {
				const childEntriesChunk = await new Promise<IWebkitDataTransferItemEntry[]>((resolve, reject) => dirReader.readEntries(resolve, reject));
				if (childEntriesChunk.length > 0) {
					childEntries.push(...childEntriesChunk);
				} else {
					done = true; // an empty array is a signal that all entries have been read
				}
			} while (!done && !token.isCancellationRequested);

			// Update operation total based on new counts
			operation.filesTotal += childEntries.length;

			// Split up files from folders to upload
			const folderTarget = target?.getChild(entry.name) || undefined;
			const fileChildEntries: IWebkitDataTransferItemEntry[] = [];
			const folderChildEntries: IWebkitDataTransferItemEntry[] = [];
			for (const childEntry of childEntries) {
				if (childEntry.isFile) {
					fileChildEntries.push(childEntry);
				} else if (childEntry.isDirectory) {
					folderChildEntries.push(childEntry);
				}
			}

			// Upload files (up to `MAX_PARALLEL_UPLOADS` in parallel)
			const fileUploadQueue = new Limiter(BrowserFileUpload.MAX_PARALLEL_UPLOADS);
			await Promises.settled(fileChildEntries.map(fileChildEntry => {
				return fileUploadQueue.queue(() => this.doUploadEntry(fileChildEntry, resource, folderTarget, progress, operation, token));
			}));

			// Upload folders (sequentially give we don't know their sizes)
			for (const folderChildEntry of folderChildEntries) {
				await this.doUploadEntry(folderChildEntry, resource, folderTarget, progress, operation, token);
			}

			return { isFile: false, resource };
		}
	}

	private async doUploadFileBuffered(resource: URI, file: File, progressReporter: (fileSize: number, bytesUploaded: number) => void, token: CancellationToken): Promise<void> {
		const writeableStream = newWriteableBufferStream({
			// Set a highWaterMark to prevent the stream
			// for file upload to produce large buffers
			// in-memory
			highWaterMark: 10
		});
		const writeFilePromise = this.fileService.writeFile(resource, writeableStream);

		// Read the file in chunks using File.stream() web APIs
		try {
			const reader: ReadableStreamDefaultReader<Uint8Array> = file.stream().getReader();

			let res = await reader.read();
			while (!res.done) {
				if (token.isCancellationRequested) {
					break;
				}

				// Write buffer into stream but make sure to wait
				// in case the `highWaterMark` is reached
				const buffer = VSBuffer.wrap(res.value);
				await writeableStream.write(buffer);

				if (token.isCancellationRequested) {
					break;
				}

				// Report progress
				progressReporter(file.size, buffer.byteLength);

				res = await reader.read();
			}
			writeableStream.end(undefined);
		} catch (error) {
			writeableStream.error(error);
			writeableStream.end();
		}

		if (token.isCancellationRequested) {
			return undefined;
		}

		// Wait for file being written to target
		await writeFilePromise;
	}

	private doUploadFileUnbuffered(resource: URI, file: File, progressReporter: (fileSize: number, bytesUploaded: number) => void): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = async event => {
				try {
					if (event.target?.result instanceof ArrayBuffer) {
						const buffer = VSBuffer.wrap(new Uint8Array(event.target.result));
						await this.fileService.writeFile(resource, buffer);

						// Report progress
						progressReporter(file.size, buffer.byteLength);
					} else {
						throw new Error('Could not read from dropped file.');
					}

					resolve();
				} catch (error) {
					reject(error);
				}
			};

			// Start reading the file to trigger `onload`
			reader.readAsArrayBuffer(file);
		});
	}
}

//#endregion

//#region External File Import (drag and drop)

export class ExternalFileImport {

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IHostService private readonly hostService: IHostService,
		@IWorkspaceContextService private readonly contextService: IWorkspaceContextService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IDialogService private readonly dialogService: IDialogService,
		@IWorkspaceEditingService private readonly workspaceEditingService: IWorkspaceEditingService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IEditorService private readonly editorService: IEditorService,
		@IProgressService private readonly progressService: IProgressService,
		@INotificationService private readonly notificationService: INotificationService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
	}

	async import(target: ExplorerItem, source: DragEvent, targetWindow: Window): Promise<void> {
		const cts = new CancellationTokenSource();

		// Indicate progress globally
		const importPromise = this.progressService.withProgress(
			{
				location: ProgressLocation.Window,
				delay: 800,
				cancellable: true,
				title: localize('copyingFiles', "Copying...")
			},
			async () => await this.doImport(target, source, targetWindow, cts.token),
			() => cts.dispose(true)
		);

		// Also indicate progress in the files view
		this.progressService.withProgress({ location: VIEW_ID, delay: 500 }, () => importPromise);

		return importPromise;
	}

	private async doImport(target: ExplorerItem, source: DragEvent, targetWindow: Window, token: CancellationToken): Promise<void> {

		// Activate all providers for the resources dropped
		const candidateFiles = coalesce((await this.instantiationService.invokeFunction(accessor => extractEditorsAndFilesDropData(accessor, source))).map(editor => editor.resource));
		await Promise.all(candidateFiles.map(resource => this.fileService.activateProvider(resource.scheme)));

		// Check for dropped external files to be folders
		const files = coalesce(candidateFiles.filter(resource => this.fileService.hasProvider(resource)));
		const resolvedFiles = await this.fileService.resolveAll(files.map(file => ({ resource: file })));

		if (token.isCancellationRequested) {
			return;
		}

		// Pass focus to window
		this.hostService.focus(targetWindow);

		// Handle folders by adding to workspace if we are in workspace context and if dropped on top
		const folders = resolvedFiles.filter(resolvedFile => resolvedFile.success && resolvedFile.stat?.isDirectory).map(resolvedFile => ({ uri: resolvedFile.stat!.resource }));
		if (folders.length > 0 && target.isRoot) {
			enum ImportChoice {
				Copy = 1,
				Add = 2
			}

			const buttons: IPromptButton<ImportChoice | undefined>[] = [
				{
					label: folders.length > 1 ?
						localize('copyFolders', "&&Copy Folders") :
						localize('copyFolder', "&&Copy Folder"),
					run: () => ImportChoice.Copy
				}
			];

			let message: string;

			// We only allow to add a folder to the workspace if there is already a workspace folder with that scheme
			const workspaceFolderSchemas = this.contextService.getWorkspace().folders.map(folder => folder.uri.scheme);
			if (folders.some(folder => workspaceFolderSchemas.indexOf(folder.uri.scheme) >= 0)) {
				buttons.unshift({
					label: folders.length > 1 ?
						localize('addFolders', "&&Add Folders to Workspace") :
						localize('addFolder', "&&Add Folder to Workspace"),
					run: () => ImportChoice.Add
				});
				message = folders.length > 1 ?
					localize('dropFolders', "Do you want to copy the folders or add the folders to the workspace?") :
					localize('dropFolder', "Do you want to copy '{0}' or add '{0}' as a folder to the workspace?", basename(folders[0].uri));
			} else {
				message = folders.length > 1 ?
					localize('copyfolders', "Are you sure to want to copy folders?") :
					localize('copyfolder', "Are you sure to want to copy '{0}'?", basename(folders[0].uri));
			}

			const { result } = await this.dialogService.prompt({
				type: Severity.Info,
				message,
				buttons,
				cancelButton: true
			});

			// Add folders
			if (result === ImportChoice.Add) {
				return this.workspaceEditingService.addFolders(folders);
			}

			// Copy resources
			if (result === ImportChoice.Copy) {
				return this.importResources(target, files, token);
			}
		}

		// Handle dropped files (only support FileStat as target)
		else if (target instanceof ExplorerItem) {
			return this.importResources(target, files, token);
		}
	}

	private async importResources(target: ExplorerItem, resources: URI[], token: CancellationToken): Promise<void> {
		if (resources && resources.length > 0) {

			// Resolve target to check for name collisions and ask user
			const targetStat = await this.fileService.resolve(target.resource);

			if (token.isCancellationRequested) {
				return;
			}

			// Check for name collisions
			const targetNames = new Set<string>();
			const caseSensitive = this.fileService.hasCapability(target.resource, FileSystemProviderCapabilities.PathCaseSensitive);
			if (targetStat.children) {
				targetStat.children.forEach(child => {
					targetNames.add(caseSensitive ? child.name : child.name.toLowerCase());
				});
			}


			let inaccessibleFileCount = 0;
			const resourcesFiltered = coalesce((await Promises.settled(resources.map(async resource => {
				const fileDoesNotExist = !(await this.fileService.exists(resource));
				if (fileDoesNotExist) {
					inaccessibleFileCount++;
					return undefined;
				}

				if (targetNames.has(caseSensitive ? basename(resource) : basename(resource).toLowerCase())) {
					const confirmationResult = await this.dialogService.confirm(getFileOverwriteConfirm(basename(resource)));
					if (!confirmationResult.confirmed) {
						return undefined;
					}
				}

				return resource;
			}))));

			if (inaccessibleFileCount > 0) {
				this.notificationService.error(inaccessibleFileCount > 1 ? localize('filesInaccessible', "Some or all of the dropped files could not be accessed for import.") : localize('fileInaccessible', "The dropped file could not be accessed for import."));
			}

			// Copy resources through bulk edit API
			const resourceFileEdits = resourcesFiltered.map(resource => {
				const sourceFileName = basename(resource);
				const targetFile = joinPath(target.resource, sourceFileName);

				return new ResourceFileEdit(resource, targetFile, { overwrite: true, copy: true });
			});

			const undoLevel = this.configurationService.getValue<IFilesConfiguration>().explorer.confirmUndo;
			await this.explorerService.applyBulkEdit(resourceFileEdits, {
				undoLabel: resourcesFiltered.length === 1 ?
					localize({ comment: ['substitution will be the name of the file that was imported'], key: 'importFile' }, "Import {0}", basename(resourcesFiltered[0])) :
					localize({ comment: ['substitution will be the number of files that were imported'], key: 'importnFile' }, "Import {0} resources", resourcesFiltered.length),
				progressLabel: resourcesFiltered.length === 1 ?
					localize({ comment: ['substitution will be the name of the file that was copied'], key: 'copyingFile' }, "Copying {0}", basename(resourcesFiltered[0])) :
					localize({ comment: ['substitution will be the number of files that were copied'], key: 'copyingnFile' }, "Copying {0} resources", resourcesFiltered.length),
				progressLocation: ProgressLocation.Window,
				confirmBeforeUndo: undoLevel === UndoConfirmLevel.Verbose || undoLevel === UndoConfirmLevel.Default,
			});

			// if we only add one file, just open it directly
			const autoOpen = this.configurationService.getValue<IFilesConfiguration>().explorer.autoOpenDroppedFile;
			if (autoOpen && resourceFileEdits.length === 1) {
				const item = this.explorerService.findClosest(resourceFileEdits[0].newResource!);
				if (item && !item.isDirectory) {
					this.editorService.openEditor({ resource: item.resource, options: { pinned: true } });
				}
			}
		}
	}
}

//#endregion

//#region Download (web, native)

interface IDownloadOperation {
	startTime: number;
	progressScheduler: RunOnceWorker<IProgressStep>;

	filesTotal: number;
	filesDownloaded: number;

	totalBytesDownloaded: number;
	fileBytesDownloaded: number;
}

export class FileDownload {

	private static readonly LAST_USED_DOWNLOAD_PATH_STORAGE_KEY = 'workbench.explorer.downloadPath';

	constructor(
		@IFileService private readonly fileService: IFileService,
		@IExplorerService private readonly explorerService: IExplorerService,
		@IProgressService private readonly progressService: IProgressService,
		@ILogService private readonly logService: ILogService,
		@IFileDialogService private readonly fileDialogService: IFileDialogService,
		@IStorageService private readonly storageService: IStorageService
	) {
	}

	download(source: ExplorerItem[]): Promise<void> {
		const cts = new CancellationTokenSource();

		// Indicate progress globally
		const downloadPromise = this.progressService.withProgress(
			{
				location: ProgressLocation.Window,
				delay: 800,
				cancellable: isWeb,
				title: localize('downloadingFiles', "Downloading")
			},
			async progress => this.doDownload(source, progress, cts),
			() => cts.dispose(true)
		);

		// Also indicate progress in the files view
		this.progressService.withProgress({ location: VIEW_ID, delay: 500 }, () => downloadPromise);

		return downloadPromise;
	}

	private async doDownload(sources: ExplorerItem[], progress: IProgress<IProgressStep>, cts: CancellationTokenSource): Promise<void> {
		for (const source of sources) {
			if (cts.token.isCancellationRequested) {
				return;
			}

			// Web: use DOM APIs to download files with optional support
			// for folders and large files
			if (isWeb) {
				await this.doDownloadBrowser(source.resource, progress, cts);
			}

			// Native: use working copy file service to get at the contents
			else {
				await this.doDownloadNative(source, progress, cts);
			}
		}
	}

	private async doDownloadBrowser(resource: URI, progress: IProgress<IProgressStep>, cts: CancellationTokenSource): Promise<void> {
		const stat = await this.fileService.resolve(resource, { resolveMetadata: true });

		if (cts.token.isCancellationRequested) {
			return;
		}

		const maxBlobDownloadSize = 32 * ByteSize.MB; // avoid to download via blob-trick >32MB to avoid memory pressure
		const preferFileSystemAccessWebApis = stat.isDirectory || stat.size > maxBlobDownloadSize;

		// Folder: use FS APIs to download files and folders if available and preferred
		const activeWindow = getActiveWindow();
		if (preferFileSystemAccessWebApis && WebFileSystemAccess.supported(activeWindow)) {
			try {
				const parentFolder: FileSystemDirectoryHandle = await activeWindow.showDirectoryPicker();
				const operation: IDownloadOperation = {
					startTime: Date.now(),
					progressScheduler: new RunOnceWorker<IProgressStep>(steps => { progress.report(steps[steps.length - 1]); }, 1000),

					filesTotal: stat.isDirectory ? 0 : 1, // folders increment filesTotal within downloadFolder method
					filesDownloaded: 0,

					totalBytesDownloaded: 0,
					fileBytesDownloaded: 0
				};

				if (stat.isDirectory) {
					const targetFolder = await parentFolder.getDirectoryHandle(stat.name, { create: true });
					await this.downloadFolderBrowser(stat, targetFolder, operation, cts.token);
				} else {
					await this.downloadFileBrowser(parentFolder, stat, operation, cts.token);
				}

				operation.progressScheduler.dispose();
			} catch (error) {
				this.logService.warn(error);
				cts.cancel(); // `showDirectoryPicker` will throw an error when the user cancels
			}
		}

		// File: use traditional download to circumvent browser limitations
		else if (stat.isFile) {
			let bufferOrUri: Uint8Array | URI;
			try {
				bufferOrUri = (await this.fileService.readFile(stat.resource, { limits: { size: maxBlobDownloadSize } }, cts.token)).value.buffer;
			} catch (error) {
				bufferOrUri = FileAccess.uriToBrowserUri(stat.resource);
			}

			if (!cts.token.isCancellationRequested) {
				triggerDownload(bufferOrUri, stat.name);
			}
		}
	}

	private async downloadFileBufferedBrowser(resource: URI, target: FileSystemWritableFileStream, operation: IDownloadOperation, token: CancellationToken): Promise<void> {
		const contents = await this.fileService.readFileStream(resource, undefined, token);
		if (token.isCancellationRequested) {
			target.close();
			return;
		}

		return new Promise<void>((resolve, reject) => {
			const sourceStream = contents.value;

			const disposables = new DisposableStore();
			disposables.add(toDisposable(() => target.close()));

			disposables.add(createSingleCallFunction(token.onCancellationRequested)(() => {
				disposables.dispose();
				reject(canceled());
			}));

			listenStream(sourceStream, {
				onData: data => {
					target.write(data.buffer as Uint8Array<ArrayBuffer>);
					this.reportProgress(contents.name, contents.size, data.byteLength, operation);
				},
				onError: error => {
					disposables.dispose();
					reject(error);
				},
				onEnd: () => {
					disposables.dispose();
					resolve();
				}
			}, token);
		});
	}

	private async downloadFileUnbufferedBrowser(resource: URI, target: FileSystemWritableFileStream, operation: IDownloadOperation, token: CancellationToken): Promise<void> {
		const contents = await this.fileService.readFile(resource, undefined, token);
		if (!token.isCancellationRequested) {
			target.write(contents.value.buffer as Uint8Array<ArrayBuffer>);
			this.reportProgress(contents.name, contents.size, contents.value.byteLength, operation);
		}

		target.close();
	}

	private async downloadFileBrowser(targetFolder: FileSystemDirectoryHandle, file: IFileStatWithMetadata, operation: IDownloadOperation, token: CancellationToken): Promise<void> {

		// Report progress
		operation.filesDownloaded++;
		operation.fileBytesDownloaded = 0; // reset for this file
		this.reportProgress(file.name, 0, 0, operation);

		// Start to download
		const targetFile = await targetFolder.getFileHandle(file.name, { create: true });
		const targetFileWriter = await targetFile.createWritable();

		// For large files, write buffered using streams
		if (file.size > ByteSize.MB) {
			return this.downloadFileBufferedBrowser(file.resource, targetFileWriter, operation, token);
		}

		// For small files prefer to write unbuffered to reduce overhead
		return this.downloadFileUnbufferedBrowser(file.resource, targetFileWriter, operation, token);
	}

	private async downloadFolderBrowser(folder: IFileStatWithMetadata, targetFolder: FileSystemDirectoryHandle, operation: IDownloadOperation, token: CancellationToken): Promise<void> {
		if (folder.children) {
			operation.filesTotal += (folder.children.map(child => child.isFile)).length;

			for (const child of folder.children) {
				if (token.isCancellationRequested) {
					return;
				}

				if (child.isFile) {
					await this.downloadFileBrowser(targetFolder, child, operation, token);
				} else {
					const childFolder = await targetFolder.getDirectoryHandle(child.name, { create: true });
					const resolvedChildFolder = await this.fileService.resolve(child.resource, { resolveMetadata: true });

					await this.downloadFolderBrowser(resolvedChildFolder, childFolder, operation, token);
				}
			}
		}
	}

	private reportProgress(name: string, fileSize: number, bytesDownloaded: number, operation: IDownloadOperation): void {
		operation.fileBytesDownloaded += bytesDownloaded;
		operation.totalBytesDownloaded += bytesDownloaded;

		const bytesDownloadedPerSecond = operation.totalBytesDownloaded / ((Date.now() - operation.startTime) / 1000);

		// Small file
		let message: string;
		if (fileSize < ByteSize.MB) {
			if (operation.filesTotal === 1) {
				message = name;
			} else {
				message = localize('downloadProgressSmallMany', "{0} of {1} files ({2}/s)", operation.filesDownloaded, operation.filesTotal, ByteSize.formatSize(bytesDownloadedPerSecond));
			}
		}

		// Large file
		else {
			message = localize('downloadProgressLarge', "{0} ({1} of {2}, {3}/s)", name, ByteSize.formatSize(operation.fileBytesDownloaded), ByteSize.formatSize(fileSize), ByteSize.formatSize(bytesDownloadedPerSecond));
		}

		// Report progress but limit to update only once per second
		operation.progressScheduler.work({ message });
	}

	private async doDownloadNative(explorerItem: ExplorerItem, progress: IProgress<IProgressStep>, cts: CancellationTokenSource): Promise<void> {
		progress.report({ message: explorerItem.name });

		let defaultUri: URI;
		const lastUsedDownloadPath = this.storageService.get(FileDownload.LAST_USED_DOWNLOAD_PATH_STORAGE_KEY, StorageScope.APPLICATION);
		if (lastUsedDownloadPath) {
			defaultUri = joinPath(URI.file(lastUsedDownloadPath), explorerItem.name);
		} else {
			defaultUri = joinPath(
				explorerItem.isDirectory ?
					await this.fileDialogService.defaultFolderPath(Schemas.file) :
					await this.fileDialogService.defaultFilePath(Schemas.file),
				explorerItem.name
			);
		}

		const destination = await this.fileDialogService.showSaveDialog({
			availableFileSystems: [Schemas.file],
			saveLabel: localize('downloadButton', "Download"),
			title: localize('chooseWhereToDownload', "Choose Where to Download"),
			defaultUri
		});

		if (destination) {

			// Remember as last used download folder
			this.storageService.store(FileDownload.LAST_USED_DOWNLOAD_PATH_STORAGE_KEY, dirname(destination).fsPath, StorageScope.APPLICATION, StorageTarget.MACHINE);

			// Perform download
			await this.explorerService.applyBulkEdit([new ResourceFileEdit(explorerItem.resource, destination, { overwrite: true, copy: true })], {
				undoLabel: localize('downloadBulkEdit', "Download {0}", explorerItem.name),
				progressLabel: localize('downloadingBulkEdit', "Downloading {0}", explorerItem.name),
				progressLocation: ProgressLocation.Window
			});
		} else {
			cts.cancel(); // User canceled a download. In case there were multiple files selected we should cancel the remainder of the prompts #86100
		}
	}
}

//#endregion

//#region Helpers

export function getFileOverwriteConfirm(name: string): IConfirmation {
	return {
		message: localize('confirmOverwrite', "A file or folder with the name '{0}' already exists in the destination folder. Do you want to replace it?", name),
		detail: localize('irreversible', "This action is irreversible!"),
		primaryButton: localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
		type: 'warning'
	};
}

export function getMultipleFilesOverwriteConfirm(files: URI[]): IConfirmation {
	if (files.length > 1) {
		return {
			message: localize('confirmManyOverwrites', "The following {0} files and/or folders already exist in the destination folder. Do you want to replace them?", files.length),
			detail: getFileNamesMessage(files) + '\n' + localize('irreversible', "This action is irreversible!"),
			primaryButton: localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
			type: 'warning'
		};
	}

	return getFileOverwriteConfirm(basename(files[0]));
}

//#endregion
```

--------------------------------------------------------------------------------

````
