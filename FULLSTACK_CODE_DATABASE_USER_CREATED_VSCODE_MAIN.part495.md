---
source_txt: user_created_projects/vscode-main
converted_utc: 2025-12-18T18:22:27Z
part: 495
parts_total: 552
---

# FULLSTACK CODE DATABASE USER CREATED vscode-main

## Verbatim Content (Part 495 of 552)

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

---[FILE: src/vs/workbench/services/actions/common/menusExtensionPoint.ts]---
Location: vscode-main/src/vs/workbench/services/actions/common/menusExtensionPoint.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { isFalsyOrWhitespace } from '../../../../base/common/strings.js';
import * as resources from '../../../../base/common/resources.js';
import { IJSONSchema } from '../../../../base/common/jsonSchema.js';
import { IExtensionPointUser, ExtensionMessageCollector, ExtensionsRegistry } from '../../extensions/common/extensionsRegistry.js';
import { ContextKeyExpr } from '../../../../platform/contextkey/common/contextkey.js';
import { MenuId, MenuRegistry, IMenuItem, ISubmenuItem } from '../../../../platform/actions/common/actions.js';
import { URI } from '../../../../base/common/uri.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { index } from '../../../../base/common/arrays.js';
import { isProposedApiEnabled } from '../../extensions/common/extensions.js';
import { ILocalizedString } from '../../../../platform/action/common/action.js';
import { IExtensionFeatureTableRenderer, IExtensionFeaturesRegistry, IRenderedData, IRowData, ITableData, Extensions as ExtensionFeaturesExtensions } from '../../extensionManagement/common/extensionFeatures.js';
import { IExtensionManifest, IKeyBinding } from '../../../../platform/extensions/common/extensions.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { SyncDescriptor } from '../../../../platform/instantiation/common/descriptors.js';
import { platform } from '../../../../base/common/process.js';
import { MarkdownString } from '../../../../base/common/htmlContent.js';
import { ResolvedKeybinding } from '../../../../base/common/keybindings.js';
import { IKeybindingService } from '../../../../platform/keybinding/common/keybinding.js';
import { ApiProposalName } from '../../../../platform/extensions/common/extensionsApiProposals.js';

interface IAPIMenu {
	readonly key: string;
	readonly id: MenuId;
	readonly description: string;
	readonly proposed?: ApiProposalName;
	readonly supportsSubmenus?: boolean; // defaults to true
}

const apiMenus: IAPIMenu[] = [
	{
		key: 'commandPalette',
		id: MenuId.CommandPalette,
		description: localize('menus.commandPalette', "The Command Palette"),
		supportsSubmenus: false
	},
	{
		key: 'touchBar',
		id: MenuId.TouchBarContext,
		description: localize('menus.touchBar', "The touch bar (macOS only)"),
		supportsSubmenus: false
	},
	{
		key: 'editor/title',
		id: MenuId.EditorTitle,
		description: localize('menus.editorTitle', "The editor title menu")
	},
	{
		key: 'editor/title/run',
		id: MenuId.EditorTitleRun,
		description: localize('menus.editorTitleRun', "Run submenu inside the editor title menu")
	},
	{
		key: 'editor/context',
		id: MenuId.EditorContext,
		description: localize('menus.editorContext', "The editor context menu")
	},
	{
		key: 'editor/context/copy',
		id: MenuId.EditorContextCopy,
		description: localize('menus.editorContextCopyAs', "'Copy as' submenu in the editor context menu")
	},
	{
		key: 'editor/context/share',
		id: MenuId.EditorContextShare,
		description: localize('menus.editorContextShare', "'Share' submenu in the editor context menu"),
		proposed: 'contribShareMenu'
	},
	{
		key: 'explorer/context',
		id: MenuId.ExplorerContext,
		description: localize('menus.explorerContext', "The file explorer context menu")
	},
	{
		key: 'explorer/context/share',
		id: MenuId.ExplorerContextShare,
		description: localize('menus.explorerContextShare', "'Share' submenu in the file explorer context menu"),
		proposed: 'contribShareMenu'
	},
	{
		key: 'editor/title/context',
		id: MenuId.EditorTitleContext,
		description: localize('menus.editorTabContext', "The editor tabs context menu")
	},
	{
		key: 'editor/title/context/share',
		id: MenuId.EditorTitleContextShare,
		description: localize('menus.editorTitleContextShare', "'Share' submenu inside the editor title context menu"),
		proposed: 'contribShareMenu'
	},
	{
		key: 'debug/callstack/context',
		id: MenuId.DebugCallStackContext,
		description: localize('menus.debugCallstackContext', "The debug callstack view context menu")
	},
	{
		key: 'debug/variables/context',
		id: MenuId.DebugVariablesContext,
		description: localize('menus.debugVariablesContext', "The debug variables view context menu")
	},
	{
		key: 'debug/watch/context',
		id: MenuId.DebugWatchContext,
		description: localize('menus.debugWatchContext', "The debug watch view context menu")
	},
	{
		key: 'debug/toolBar',
		id: MenuId.DebugToolBar,
		description: localize('menus.debugToolBar', "The debug toolbar menu")
	},
	{
		key: 'debug/createConfiguration',
		id: MenuId.DebugCreateConfiguration,
		proposed: 'contribDebugCreateConfiguration',
		description: localize('menus.debugCreateConfiguation', "The debug create configuration menu")
	},
	{
		key: 'notebook/variables/context',
		id: MenuId.NotebookVariablesContext,
		description: localize('menus.notebookVariablesContext', "The notebook variables view context menu")
	},
	{
		key: 'menuBar/home',
		id: MenuId.MenubarHomeMenu,
		description: localize('menus.home', "The home indicator context menu (web only)"),
		proposed: 'contribMenuBarHome',
		supportsSubmenus: false
	},
	{
		key: 'menuBar/edit/copy',
		id: MenuId.MenubarCopy,
		description: localize('menus.opy', "'Copy as' submenu in the top level Edit menu")
	},
	{
		key: 'scm/title',
		id: MenuId.SCMTitle,
		description: localize('menus.scmTitle', "The Source Control title menu")
	},
	{
		key: 'scm/sourceControl',
		id: MenuId.SCMSourceControl,
		description: localize('menus.scmSourceControl', "The Source Control menu")
	},
	{
		key: 'scm/repositories/title',
		id: MenuId.SCMSourceControlTitle,
		description: localize('menus.scmSourceControlTitle', "The Source Control Repositories title menu"),
		proposed: 'contribSourceControlTitleMenu'
	},
	{
		key: 'scm/repository',
		id: MenuId.SCMSourceControlInline,
		description: localize('menus.scmSourceControlInline', "The Source Control repository menu"),
	},
	{
		key: 'scm/resourceState/context',
		id: MenuId.SCMResourceContext,
		description: localize('menus.resourceStateContext', "The Source Control resource state context menu")
	},
	{
		key: 'scm/resourceFolder/context',
		id: MenuId.SCMResourceFolderContext,
		description: localize('menus.resourceFolderContext', "The Source Control resource folder context menu")
	},
	{
		key: 'scm/resourceGroup/context',
		id: MenuId.SCMResourceGroupContext,
		description: localize('menus.resourceGroupContext', "The Source Control resource group context menu")
	},
	{
		key: 'scm/change/title',
		id: MenuId.SCMChangeContext,
		description: localize('menus.changeTitle', "The Source Control inline change menu")
	},
	{
		key: 'scm/inputBox',
		id: MenuId.SCMInputBox,
		description: localize('menus.input', "The Source Control input box menu"),
		proposed: 'contribSourceControlInputBoxMenu'
	},
	{
		key: 'scm/history/title',
		id: MenuId.SCMHistoryTitle,
		description: localize('menus.scmHistoryTitle', "The Source Control History title menu"),
		proposed: 'contribSourceControlHistoryTitleMenu'
	},
	{
		key: 'scm/historyItem/context',
		id: MenuId.SCMHistoryItemContext,
		description: localize('menus.historyItemContext', "The Source Control history item context menu"),
		proposed: 'contribSourceControlHistoryItemMenu'
	},
	{
		key: 'scm/historyItemRef/context',
		id: MenuId.SCMHistoryItemRefContext,
		description: localize('menus.historyItemRefContext', "The Source Control history item reference context menu"),
		proposed: 'contribSourceControlHistoryItemMenu'
	},
	{
		key: 'scm/artifactGroup/context',
		id: MenuId.SCMArtifactGroupContext,
		description: localize('menus.artifactGroupContext', "The Source Control artifact group context menu"),
		proposed: 'contribSourceControlArtifactGroupMenu'
	},
	{
		key: 'scm/artifact/context',
		id: MenuId.SCMArtifactContext,
		description: localize('menus.artifactContext', "The Source Control artifact context menu"),
		proposed: 'contribSourceControlArtifactMenu'
	},
	{
		key: 'statusBar/remoteIndicator',
		id: MenuId.StatusBarRemoteIndicatorMenu,
		description: localize('menus.statusBarRemoteIndicator', "The remote indicator menu in the status bar"),
		supportsSubmenus: false
	},
	{
		key: 'terminal/context',
		id: MenuId.TerminalInstanceContext,
		description: localize('menus.terminalContext', "The terminal context menu")
	},
	{
		key: 'terminal/title/context',
		id: MenuId.TerminalTabContext,
		description: localize('menus.terminalTabContext', "The terminal tabs context menu")
	},
	{
		key: 'view/title',
		id: MenuId.ViewTitle,
		description: localize('view.viewTitle', "The contributed view title menu")
	},
	{
		key: 'viewContainer/title',
		id: MenuId.ViewContainerTitle,
		description: localize('view.containerTitle', "The contributed view container title menu"),
		proposed: 'contribViewContainerTitle'
	},
	{
		key: 'view/item/context',
		id: MenuId.ViewItemContext,
		description: localize('view.itemContext', "The contributed view item context menu")
	},
	{
		key: 'comments/comment/editorActions',
		id: MenuId.CommentEditorActions,
		description: localize('commentThread.editorActions', "The contributed comment editor actions"),
		proposed: 'contribCommentEditorActionsMenu'
	},
	{
		key: 'comments/commentThread/title',
		id: MenuId.CommentThreadTitle,
		description: localize('commentThread.title', "The contributed comment thread title menu")
	},
	{
		key: 'comments/commentThread/context',
		id: MenuId.CommentThreadActions,
		description: localize('commentThread.actions', "The contributed comment thread context menu, rendered as buttons below the comment editor"),
		supportsSubmenus: false
	},
	{
		key: 'comments/commentThread/additionalActions',
		id: MenuId.CommentThreadAdditionalActions,
		description: localize('commentThread.actions', "The contributed comment thread context menu, rendered as buttons below the comment editor"),
		supportsSubmenus: true,
		proposed: 'contribCommentThreadAdditionalMenu'
	},
	{
		key: 'comments/commentThread/title/context',
		id: MenuId.CommentThreadTitleContext,
		description: localize('commentThread.titleContext', "The contributed comment thread title's peek context menu, rendered as a right click menu on the comment thread's peek title."),
		proposed: 'contribCommentPeekContext'
	},
	{
		key: 'comments/comment/title',
		id: MenuId.CommentTitle,
		description: localize('comment.title', "The contributed comment title menu")
	},
	{
		key: 'comments/comment/context',
		id: MenuId.CommentActions,
		description: localize('comment.actions', "The contributed comment context menu, rendered as buttons below the comment editor"),
		supportsSubmenus: false
	},
	{
		key: 'comments/commentThread/comment/context',
		id: MenuId.CommentThreadCommentContext,
		description: localize('comment.commentContext', "The contributed comment context menu, rendered as a right click menu on the an individual comment in the comment thread's peek view."),
		proposed: 'contribCommentPeekContext'
	},
	{
		key: 'commentsView/commentThread/context',
		id: MenuId.CommentsViewThreadActions,
		description: localize('commentsView.threadActions', "The contributed comment thread context menu in the comments view"),
		proposed: 'contribCommentsViewThreadMenus'
	},
	{
		key: 'notebook/toolbar',
		id: MenuId.NotebookToolbar,
		description: localize('notebook.toolbar', "The contributed notebook toolbar menu")
	},
	{
		key: 'notebook/kernelSource',
		id: MenuId.NotebookKernelSource,
		description: localize('notebook.kernelSource', "The contributed notebook kernel sources menu"),
		proposed: 'notebookKernelSource'
	},
	{
		key: 'notebook/cell/title',
		id: MenuId.NotebookCellTitle,
		description: localize('notebook.cell.title', "The contributed notebook cell title menu")
	},
	{
		key: 'notebook/cell/execute',
		id: MenuId.NotebookCellExecute,
		description: localize('notebook.cell.execute', "The contributed notebook cell execution menu")
	},
	{
		key: 'interactive/toolbar',
		id: MenuId.InteractiveToolbar,
		description: localize('interactive.toolbar', "The contributed interactive toolbar menu"),
	},
	{
		key: 'interactive/cell/title',
		id: MenuId.InteractiveCellTitle,
		description: localize('interactive.cell.title', "The contributed interactive cell title menu"),
	},
	{
		key: 'issue/reporter',
		id: MenuId.IssueReporter,
		description: localize('issue.reporter', "The contributed issue reporter menu")
	},
	{
		key: 'testing/item/context',
		id: MenuId.TestItem,
		description: localize('testing.item.context', "The contributed test item menu"),
	},
	{
		key: 'testing/item/gutter',
		id: MenuId.TestItemGutter,
		description: localize('testing.item.gutter.title', "The menu for a gutter decoration for a test item"),
	},
	{
		key: 'testing/profiles/context',
		id: MenuId.TestProfilesContext,
		description: localize('testing.profiles.context.title', "The menu for configuring testing profiles."),
	},
	{
		key: 'testing/item/result',
		id: MenuId.TestPeekElement,
		description: localize('testing.item.result.title', "The menu for an item in the Test Results view or peek."),
	},
	{
		key: 'testing/message/context',
		id: MenuId.TestMessageContext,
		description: localize('testing.message.context.title', "A prominent button overlaying editor content where the message is displayed"),
	},
	{
		key: 'testing/message/content',
		id: MenuId.TestMessageContent,
		description: localize('testing.message.content.title', "Context menu for the message in the results tree"),
	},
	{
		key: 'extension/context',
		id: MenuId.ExtensionContext,
		description: localize('menus.extensionContext', "The extension context menu")
	},
	{
		key: 'timeline/title',
		id: MenuId.TimelineTitle,
		description: localize('view.timelineTitle', "The Timeline view title menu")
	},
	{
		key: 'timeline/item/context',
		id: MenuId.TimelineItemContext,
		description: localize('view.timelineContext', "The Timeline view item context menu")
	},
	{
		key: 'ports/item/context',
		id: MenuId.TunnelContext,
		description: localize('view.tunnelContext', "The Ports view item context menu")
	},
	{
		key: 'ports/item/origin/inline',
		id: MenuId.TunnelOriginInline,
		description: localize('view.tunnelOriginInline', "The Ports view item origin inline menu")
	},
	{
		key: 'ports/item/port/inline',
		id: MenuId.TunnelPortInline,
		description: localize('view.tunnelPortInline', "The Ports view item port inline menu")
	},
	{
		key: 'file/newFile',
		id: MenuId.NewFile,
		description: localize('file.newFile', "The 'New File...' quick pick, shown on welcome page and File menu."),
		supportsSubmenus: false,
	},
	{
		key: 'webview/context',
		id: MenuId.WebviewContext,
		description: localize('webview.context', "The webview context menu")
	},
	{
		key: 'file/share',
		id: MenuId.MenubarShare,
		description: localize('menus.share', "Share submenu shown in the top level File menu."),
		proposed: 'contribShareMenu'
	},
	{
		key: 'editor/inlineCompletions/actions',
		id: MenuId.InlineCompletionsActions,
		description: localize('inlineCompletions.actions', "The actions shown when hovering on an inline completion"),
		supportsSubmenus: false,
		proposed: 'inlineCompletionsAdditions'
	},
	{
		key: 'editor/content',
		id: MenuId.EditorContent,
		description: localize('merge.toolbar', "The prominent button in an editor, overlays its content"),
		proposed: 'contribEditorContentMenu'
	},
	{
		key: 'editor/lineNumber/context',
		id: MenuId.EditorLineNumberContext,
		description: localize('editorLineNumberContext', "The contributed editor line number context menu")
	},
	{
		key: 'mergeEditor/result/title',
		id: MenuId.MergeInputResultToolbar,
		description: localize('menus.mergeEditorResult', "The result toolbar of the merge editor"),
		proposed: 'contribMergeEditorMenus'
	},
	{
		key: 'multiDiffEditor/content',
		id: MenuId.MultiDiffEditorContent,
		description: localize('menus.multiDiffEditorContent', "A prominent button overlaying the multi diff editor"),
		proposed: 'contribEditorContentMenu'
	},
	{
		key: 'multiDiffEditor/resource/title',
		id: MenuId.MultiDiffEditorFileToolbar,
		description: localize('menus.multiDiffEditorResource', "The resource toolbar in the multi diff editor"),
		proposed: 'contribMultiDiffEditorMenus'
	},
	{
		key: 'diffEditor/gutter/hunk',
		id: MenuId.DiffEditorHunkToolbar,
		description: localize('menus.diffEditorGutterToolBarMenus', "The gutter toolbar in the diff editor"),
		proposed: 'contribDiffEditorGutterToolBarMenus'
	},
	{
		key: 'diffEditor/gutter/selection',
		id: MenuId.DiffEditorSelectionToolbar,
		description: localize('menus.diffEditorGutterToolBarMenus', "The gutter toolbar in the diff editor"),
		proposed: 'contribDiffEditorGutterToolBarMenus'
	},
	{
		key: 'searchPanel/aiResults/commands',
		id: MenuId.SearchActionMenu,
		description: localize('searchPanel.aiResultsCommands', "The commands that will contribute to the menu rendered as buttons next to the AI search title"),
	},
	{
		key: 'editor/context/chat',
		id: MenuId.ChatTextEditorMenu,
		description: localize('menus.chatTextEditor', "The Chat submenu in the text editor context menu."),
		supportsSubmenus: false,
		proposed: 'chatParticipantPrivate'
	},
	{
		key: 'chat/input/editing/sessionToolbar',
		id: MenuId.ChatEditingSessionChangesToolbar,
		description: localize('menus.chatEditingSessionChangesToolbar', "The Chat Editing widget toolbar menu for session changes."),
		proposed: 'chatSessionsProvider'
	},
	{
		// TODO: rename this to something like: `chatSessions/item/inline`
		key: 'chat/chatSessions',
		id: MenuId.AgentSessionsContext,
		description: localize('menus.chatSessions', "The Chat Sessions menu."),
		supportsSubmenus: false,
		proposed: 'chatSessionsProvider'
	},
	{
		key: 'chatSessions/newSession',
		id: MenuId.AgentSessionsCreateSubMenu,
		description: localize('menus.chatSessionsNewSession', "Menu for new chat sessions."),
		supportsSubmenus: false,
		proposed: 'chatSessionsProvider'
	},
	{
		key: 'chat/multiDiff/context',
		id: MenuId.ChatMultiDiffContext,
		description: localize('menus.chatMultiDiffContext', "The Chat Multi-Diff context menu."),
		supportsSubmenus: false,
		proposed: 'chatSessionsProvider',
	},
];

namespace schema {

	// --- menus, submenus contribution point

	export interface IUserFriendlyMenuItem {
		command: string;
		alt?: string;
		when?: string;
		group?: string;
	}

	export interface IUserFriendlySubmenuItem {
		submenu: string;
		when?: string;
		group?: string;
	}

	export interface IUserFriendlySubmenu {
		id: string;
		label: string;
		icon?: IUserFriendlyIcon;
	}

	export function isMenuItem(item: IUserFriendlyMenuItem | IUserFriendlySubmenuItem): item is IUserFriendlyMenuItem {
		return typeof (item as IUserFriendlyMenuItem).command === 'string';
	}

	export function isValidMenuItem(item: IUserFriendlyMenuItem, collector: ExtensionMessageCollector): boolean {
		if (typeof item.command !== 'string') {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
			return false;
		}
		if (item.alt && typeof item.alt !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'alt'));
			return false;
		}
		if (item.when && typeof item.when !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
			return false;
		}
		if (item.group && typeof item.group !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'group'));
			return false;
		}

		return true;
	}

	export function isValidSubmenuItem(item: IUserFriendlySubmenuItem, collector: ExtensionMessageCollector): boolean {
		if (typeof item.submenu !== 'string') {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'submenu'));
			return false;
		}
		if (item.when && typeof item.when !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
			return false;
		}
		if (item.group && typeof item.group !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'group'));
			return false;
		}

		return true;
	}

	export function isValidItems(items: (IUserFriendlyMenuItem | IUserFriendlySubmenuItem)[], collector: ExtensionMessageCollector): boolean {
		if (!Array.isArray(items)) {
			collector.error(localize('requirearray', "submenu items must be an array"));
			return false;
		}

		for (const item of items) {
			if (isMenuItem(item)) {
				if (!isValidMenuItem(item, collector)) {
					return false;
				}
			} else {
				if (!isValidSubmenuItem(item, collector)) {
					return false;
				}
			}
		}

		return true;
	}

	export function isValidSubmenu(submenu: IUserFriendlySubmenu, collector: ExtensionMessageCollector): boolean {
		if (typeof submenu !== 'object') {
			collector.error(localize('require', "submenu items must be an object"));
			return false;
		}

		if (typeof submenu.id !== 'string') {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'id'));
			return false;
		}
		if (typeof submenu.label !== 'string') {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'label'));
			return false;
		}

		return true;
	}

	const menuItem: IJSONSchema = {
		type: 'object',
		required: ['command'],
		properties: {
			command: {
				description: localize('vscode.extension.contributes.menuItem.command', 'Identifier of the command to execute. The command must be declared in the \'commands\'-section'),
				type: 'string'
			},
			alt: {
				description: localize('vscode.extension.contributes.menuItem.alt', 'Identifier of an alternative command to execute. The command must be declared in the \'commands\'-section'),
				type: 'string'
			},
			when: {
				description: localize('vscode.extension.contributes.menuItem.when', 'Condition which must be true to show this item'),
				type: 'string'
			},
			group: {
				description: localize('vscode.extension.contributes.menuItem.group', 'Group into which this item belongs'),
				type: 'string'
			}
		}
	};

	const submenuItem: IJSONSchema = {
		type: 'object',
		required: ['submenu'],
		properties: {
			submenu: {
				description: localize('vscode.extension.contributes.menuItem.submenu', 'Identifier of the submenu to display in this item.'),
				type: 'string'
			},
			when: {
				description: localize('vscode.extension.contributes.menuItem.when', 'Condition which must be true to show this item'),
				type: 'string'
			},
			group: {
				description: localize('vscode.extension.contributes.menuItem.group', 'Group into which this item belongs'),
				type: 'string'
			}
		}
	};

	const submenu: IJSONSchema = {
		type: 'object',
		required: ['id', 'label'],
		properties: {
			id: {
				description: localize('vscode.extension.contributes.submenu.id', 'Identifier of the menu to display as a submenu.'),
				type: 'string'
			},
			label: {
				description: localize('vscode.extension.contributes.submenu.label', 'The label of the menu item which leads to this submenu.'),
				type: 'string'
			},
			icon: {
				description: localize({ key: 'vscode.extension.contributes.submenu.icon', comment: ['do not translate or change "\\$(zap)", \\ in front of $ is important.'] }, '(Optional) Icon which is used to represent the submenu in the UI. Either a file path, an object with file paths for dark and light themes, or a theme icon references, like "\\$(zap)"'),
				anyOf: [{
					type: 'string'
				},
				{
					type: 'object',
					properties: {
						light: {
							description: localize('vscode.extension.contributes.submenu.icon.light', 'Icon path when a light theme is used'),
							type: 'string'
						},
						dark: {
							description: localize('vscode.extension.contributes.submenu.icon.dark', 'Icon path when a dark theme is used'),
							type: 'string'
						}
					}
				}]
			}
		}
	};

	export const menusContribution: IJSONSchema = {
		description: localize('vscode.extension.contributes.menus', "Contributes menu items to the editor"),
		type: 'object',
		properties: index(apiMenus, menu => menu.key, menu => ({
			markdownDescription: menu.proposed ? localize('proposed', "Proposed API, requires `enabledApiProposal: [\"{0}\"]` - {1}", menu.proposed, menu.description) : menu.description,
			type: 'array',
			items: menu.supportsSubmenus === false ? menuItem : { oneOf: [menuItem, submenuItem] }
		})),
		additionalProperties: {
			description: 'Submenu',
			type: 'array',
			items: { oneOf: [menuItem, submenuItem] }
		}
	};

	export const submenusContribution: IJSONSchema = {
		description: localize('vscode.extension.contributes.submenus', "Contributes submenu items to the editor"),
		type: 'array',
		items: submenu
	};

	// --- commands contribution point

	export interface IUserFriendlyCommand {
		command: string;
		title: string | ILocalizedString;
		shortTitle?: string | ILocalizedString;
		enablement?: string;
		category?: string | ILocalizedString;
		icon?: IUserFriendlyIcon;
	}

	export type IUserFriendlyIcon = string | { light: string; dark: string };

	export function isValidCommand(command: IUserFriendlyCommand, collector: ExtensionMessageCollector): boolean {
		if (!command) {
			collector.error(localize('nonempty', "expected non-empty value."));
			return false;
		}
		if (isFalsyOrWhitespace(command.command)) {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
			return false;
		}
		if (!isValidLocalizedString(command.title, collector, 'title')) {
			return false;
		}
		if (command.shortTitle && !isValidLocalizedString(command.shortTitle, collector, 'shortTitle')) {
			return false;
		}
		if (command.enablement && typeof command.enablement !== 'string') {
			collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'precondition'));
			return false;
		}
		if (command.category && !isValidLocalizedString(command.category, collector, 'category')) {
			return false;
		}
		if (!isValidIcon(command.icon, collector)) {
			return false;
		}
		return true;
	}

	function isValidIcon(icon: IUserFriendlyIcon | undefined, collector: ExtensionMessageCollector): boolean {
		if (typeof icon === 'undefined') {
			return true;
		}
		if (typeof icon === 'string') {
			return true;
		} else if (typeof icon.dark === 'string' && typeof icon.light === 'string') {
			return true;
		}
		collector.error(localize('opticon', "property `icon` can be omitted or must be either a string or a literal like `{dark, light}`"));
		return false;
	}

	function isValidLocalizedString(localized: string | ILocalizedString, collector: ExtensionMessageCollector, propertyName: string): boolean {
		if (typeof localized === 'undefined') {
			collector.error(localize('requireStringOrObject', "property `{0}` is mandatory and must be of type `string` or `object`", propertyName));
			return false;
		} else if (typeof localized === 'string' && isFalsyOrWhitespace(localized)) {
			collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", propertyName));
			return false;
		} else if (typeof localized !== 'string' && (isFalsyOrWhitespace(localized.original) || isFalsyOrWhitespace(localized.value))) {
			collector.error(localize('requirestrings', "properties `{0}` and `{1}` are mandatory and must be of type `string`", `${propertyName}.value`, `${propertyName}.original`));
			return false;
		}

		return true;
	}

	const commandType: IJSONSchema = {
		type: 'object',
		required: ['command', 'title'],
		properties: {
			command: {
				description: localize('vscode.extension.contributes.commandType.command', 'Identifier of the command to execute'),
				type: 'string'
			},
			title: {
				description: localize('vscode.extension.contributes.commandType.title', 'Title by which the command is represented in the UI'),
				type: 'string'
			},
			shortTitle: {
				markdownDescription: localize('vscode.extension.contributes.commandType.shortTitle', '(Optional) Short title by which the command is represented in the UI. Menus pick either `title` or `shortTitle` depending on the context in which they show commands.'),
				type: 'string'
			},
			category: {
				description: localize('vscode.extension.contributes.commandType.category', '(Optional) Category string by which the command is grouped in the UI'),
				type: 'string'
			},
			enablement: {
				description: localize('vscode.extension.contributes.commandType.precondition', '(Optional) Condition which must be true to enable the command in the UI (menu and keybindings). Does not prevent executing the command by other means, like the `executeCommand`-api.'),
				type: 'string'
			},
			icon: {
				description: localize({ key: 'vscode.extension.contributes.commandType.icon', comment: ['do not translate or change "\\$(zap)", \\ in front of $ is important.'] }, '(Optional) Icon which is used to represent the command in the UI. Either a file path, an object with file paths for dark and light themes, or a theme icon references, like "\\$(zap)"'),
				anyOf: [{
					type: 'string'
				},
				{
					type: 'object',
					properties: {
						light: {
							description: localize('vscode.extension.contributes.commandType.icon.light', 'Icon path when a light theme is used'),
							type: 'string'
						},
						dark: {
							description: localize('vscode.extension.contributes.commandType.icon.dark', 'Icon path when a dark theme is used'),
							type: 'string'
						}
					}
				}]
			}
		}
	};

	export const commandsContribution: IJSONSchema = {
		description: localize('vscode.extension.contributes.commands', "Contributes commands to the command palette."),
		oneOf: [
			commandType,
			{
				type: 'array',
				items: commandType
			}
		]
	};
}

const _commandRegistrations = new DisposableStore();

export const commandsExtensionPoint = ExtensionsRegistry.registerExtensionPoint<schema.IUserFriendlyCommand | schema.IUserFriendlyCommand[]>({
	extensionPoint: 'commands',
	jsonSchema: schema.commandsContribution,
	activationEventsGenerator: function* (contribs: readonly schema.IUserFriendlyCommand[]) {
		for (const contrib of contribs) {
			if (contrib.command) {
				yield `onCommand:${contrib.command}`;
			}
		}
	}
});

commandsExtensionPoint.setHandler(extensions => {

	function handleCommand(userFriendlyCommand: schema.IUserFriendlyCommand, extension: IExtensionPointUser<unknown>) {

		if (!schema.isValidCommand(userFriendlyCommand, extension.collector)) {
			return;
		}

		const { icon, enablement, category, title, shortTitle, command } = userFriendlyCommand;

		let absoluteIcon: { dark: URI; light?: URI } | ThemeIcon | undefined;
		if (icon) {
			if (typeof icon === 'string') {
				absoluteIcon = ThemeIcon.fromString(icon) ?? { dark: resources.joinPath(extension.description.extensionLocation, icon), light: resources.joinPath(extension.description.extensionLocation, icon) };

			} else {
				absoluteIcon = {
					dark: resources.joinPath(extension.description.extensionLocation, icon.dark),
					light: resources.joinPath(extension.description.extensionLocation, icon.light)
				};
			}
		}

		const existingCmd = MenuRegistry.getCommand(command);
		if (existingCmd) {
			if (existingCmd.source) {
				extension.collector.info(localize('dup1', "Command `{0}` already registered by {1} ({2})", userFriendlyCommand.command, existingCmd.source.title, existingCmd.source.id));
			} else {
				extension.collector.info(localize('dup0', "Command `{0}` already registered", userFriendlyCommand.command));
			}
		}
		_commandRegistrations.add(MenuRegistry.addCommand({
			id: command,
			title,
			source: { id: extension.description.identifier.value, title: extension.description.displayName ?? extension.description.name },
			shortTitle,
			tooltip: title,
			category,
			precondition: ContextKeyExpr.deserialize(enablement),
			icon: absoluteIcon
		}));
	}

	// remove all previous command registrations
	_commandRegistrations.clear();

	for (const extension of extensions) {
		const { value } = extension;
		if (Array.isArray(value)) {
			for (const command of value) {
				handleCommand(command, extension);
			}
		} else {
			handleCommand(value, extension);
		}
	}
});

interface IRegisteredSubmenu {
	readonly id: MenuId;
	readonly label: string;
	readonly icon?: { dark: URI; light?: URI } | ThemeIcon;
}

const _submenus = new Map<string, IRegisteredSubmenu>();

const submenusExtensionPoint = ExtensionsRegistry.registerExtensionPoint<schema.IUserFriendlySubmenu[]>({
	extensionPoint: 'submenus',
	jsonSchema: schema.submenusContribution
});

submenusExtensionPoint.setHandler(extensions => {

	_submenus.clear();

	for (const extension of extensions) {
		const { value, collector } = extension;

		for (const [, submenuInfo] of Object.entries(value)) {

			if (!schema.isValidSubmenu(submenuInfo, collector)) {
				continue;
			}

			if (!submenuInfo.id) {
				collector.warn(localize('submenuId.invalid.id', "`{0}` is not a valid submenu identifier", submenuInfo.id));
				continue;
			}
			if (_submenus.has(submenuInfo.id)) {
				collector.info(localize('submenuId.duplicate.id', "The `{0}` submenu was already previously registered.", submenuInfo.id));
				continue;
			}
			if (!submenuInfo.label) {
				collector.warn(localize('submenuId.invalid.label', "`{0}` is not a valid submenu label", submenuInfo.label));
				continue;
			}

			let absoluteIcon: { dark: URI; light?: URI } | ThemeIcon | undefined;
			if (submenuInfo.icon) {
				if (typeof submenuInfo.icon === 'string') {
					absoluteIcon = ThemeIcon.fromString(submenuInfo.icon) || { dark: resources.joinPath(extension.description.extensionLocation, submenuInfo.icon) };
				} else {
					absoluteIcon = {
						dark: resources.joinPath(extension.description.extensionLocation, submenuInfo.icon.dark),
						light: resources.joinPath(extension.description.extensionLocation, submenuInfo.icon.light)
					};
				}
			}

			const item: IRegisteredSubmenu = {
				id: MenuId.for(`api:${submenuInfo.id}`),
				label: submenuInfo.label,
				icon: absoluteIcon
			};

			_submenus.set(submenuInfo.id, item);
		}
	}
});

const _apiMenusByKey = new Map(apiMenus.map(menu => ([menu.key, menu])));
const _menuRegistrations = new DisposableStore();
const _submenuMenuItems = new Map<string /* menu id */, Set<string /* submenu id */>>();

const menusExtensionPoint = ExtensionsRegistry.registerExtensionPoint<{ [loc: string]: (schema.IUserFriendlyMenuItem | schema.IUserFriendlySubmenuItem)[] }>({
	extensionPoint: 'menus',
	jsonSchema: schema.menusContribution,
	deps: [submenusExtensionPoint]
});

menusExtensionPoint.setHandler(extensions => {

	// remove all previous menu registrations
	_menuRegistrations.clear();
	_submenuMenuItems.clear();

	for (const extension of extensions) {
		const { value, collector } = extension;

		for (const entry of Object.entries(value)) {
			if (!schema.isValidItems(entry[1], collector)) {
				continue;
			}

			let menu = _apiMenusByKey.get(entry[0]);

			if (!menu) {
				const submenu = _submenus.get(entry[0]);

				if (submenu) {
					menu = {
						key: entry[0],
						id: submenu.id,
						description: ''
					};
				}
			}

			if (!menu) {
				continue;
			}

			if (menu.proposed && !isProposedApiEnabled(extension.description, menu.proposed)) {
				collector.error(localize('proposedAPI.invalid', "{0} is a proposed menu identifier. It requires 'package.json#enabledApiProposals: [\"{1}\"]' and is only available when running out of dev or with the following command line switch: --enable-proposed-api {2}", entry[0], menu.proposed, extension.description.identifier.value));
				continue;
			}

			for (const menuItem of entry[1]) {
				let item: IMenuItem | ISubmenuItem;

				if (schema.isMenuItem(menuItem)) {
					const command = MenuRegistry.getCommand(menuItem.command);
					const alt = menuItem.alt && MenuRegistry.getCommand(menuItem.alt) || undefined;

					if (!command) {
						collector.error(localize('missing.command', "Menu item references a command `{0}` which is not defined in the 'commands' section.", menuItem.command));
						continue;
					}
					if (menuItem.alt && !alt) {
						collector.warn(localize('missing.altCommand', "Menu item references an alt-command `{0}` which is not defined in the 'commands' section.", menuItem.alt));
					}
					if (menuItem.command === menuItem.alt) {
						collector.info(localize('dupe.command', "Menu item references the same command as default and alt-command"));
					}

					item = { command, alt, group: undefined, order: undefined, when: undefined };
				} else {
					if (menu.supportsSubmenus === false) {
						collector.error(localize('unsupported.submenureference', "Menu item references a submenu for a menu which doesn't have submenu support."));
						continue;
					}

					const submenu = _submenus.get(menuItem.submenu);

					if (!submenu) {
						collector.error(localize('missing.submenu', "Menu item references a submenu `{0}` which is not defined in the 'submenus' section.", menuItem.submenu));
						continue;
					}

					let submenuRegistrations = _submenuMenuItems.get(menu.id.id);

					if (!submenuRegistrations) {
						submenuRegistrations = new Set();
						_submenuMenuItems.set(menu.id.id, submenuRegistrations);
					}

					if (submenuRegistrations.has(submenu.id.id)) {
						collector.warn(localize('submenuItem.duplicate', "The `{0}` submenu was already contributed to the `{1}` menu.", menuItem.submenu, entry[0]));
						continue;
					}

					submenuRegistrations.add(submenu.id.id);

					item = { submenu: submenu.id, icon: submenu.icon, title: submenu.label, group: undefined, order: undefined, when: undefined };
				}

				if (menuItem.group) {
					const idx = menuItem.group.lastIndexOf('@');
					if (idx > 0) {
						item.group = menuItem.group.substr(0, idx);
						item.order = Number(menuItem.group.substr(idx + 1)) || undefined;
					} else {
						item.group = menuItem.group;
					}
				}

				if (menu.id === MenuId.ViewContainerTitle && !menuItem.when?.includes('viewContainer == workbench.view.debug')) {
					// Not a perfect check but enough to communicate that this proposed extension point is currently only for the debug view container
					collector.error(localize('viewContainerTitle.when', "The {0} menu contribution must check {1} in its {2} clause.", '`viewContainer/title`', '`viewContainer == workbench.view.debug`', '"when"'));
					continue;
				}

				item.when = ContextKeyExpr.deserialize(menuItem.when);
				_menuRegistrations.add(MenuRegistry.appendMenuItem(menu.id, item));
			}
		}
	}
});

class CommandsTableRenderer extends Disposable implements IExtensionFeatureTableRenderer {

	readonly type = 'table';

	constructor(
		@IKeybindingService private readonly _keybindingService: IKeybindingService
	) { super(); }

	shouldRender(manifest: IExtensionManifest): boolean {
		return !!manifest.contributes?.commands;
	}

	render(manifest: IExtensionManifest): IRenderedData<ITableData> {
		const rawCommands = manifest.contributes?.commands || [];
		const commands = rawCommands.map(c => ({
			id: c.command,
			title: c.title,
			keybindings: [] as ResolvedKeybinding[],
			menus: [] as string[]
		}));

		const byId = index(commands, c => c.id);

		const menus = manifest.contributes?.menus || {};

		// Add to commandPalette array any commands not explicitly contributed to it
		const implicitlyOnCommandPalette = index(commands, c => c.id);
		if (menus['commandPalette']) {
			for (const command of menus['commandPalette']) {
				delete implicitlyOnCommandPalette[command.command];
			}
		}

		if (Object.keys(implicitlyOnCommandPalette).length) {
			if (!menus['commandPalette']) {
				menus['commandPalette'] = [];
			}
			for (const command in implicitlyOnCommandPalette) {
				menus['commandPalette'].push({ command });
			}
		}

		for (const context in menus) {
			for (const menu of menus[context]) {

				// This typically happens for the commandPalette context
				if (menu.when === 'false') {
					continue;
				}
				if (menu.command) {
					let command = byId[menu.command];
					if (command) {
						if (!command.menus.includes(context)) {
							command.menus.push(context);
						}
					} else {
						command = { id: menu.command, title: '', keybindings: [], menus: [context] };
						byId[command.id] = command;
						commands.push(command);
					}
				}
			}
		}

		const rawKeybindings = manifest.contributes?.keybindings ? (Array.isArray(manifest.contributes.keybindings) ? manifest.contributes.keybindings : [manifest.contributes.keybindings]) : [];

		rawKeybindings.forEach(rawKeybinding => {
			const keybinding = this.resolveKeybinding(rawKeybinding);

			if (!keybinding) {
				return;
			}

			let command = byId[rawKeybinding.command];

			if (command) {
				command.keybindings.push(keybinding);
			} else {
				command = { id: rawKeybinding.command, title: '', keybindings: [keybinding], menus: [] };
				byId[command.id] = command;
				commands.push(command);
			}
		});

		if (!commands.length) {
			return { data: { headers: [], rows: [] }, dispose: () => { } };
		}

		const headers = [
			localize('command name', "ID"),
			localize('command title', "Title"),
			localize('keyboard shortcuts', "Keyboard Shortcuts"),
			localize('menuContexts', "Menu Contexts")
		];

		const rows: IRowData[][] = commands.sort((a, b) => a.id.localeCompare(b.id))
			.map(command => {
				return [
					new MarkdownString().appendMarkdown(`\`${command.id}\``),
					typeof command.title === 'string' ? command.title : command.title.value,
					command.keybindings,
					new MarkdownString().appendMarkdown(`${command.menus.sort((a, b) => a.localeCompare(b)).map(menu => `\`${menu}\``).join('&nbsp;')}`),
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

	private resolveKeybinding(rawKeyBinding: IKeyBinding): ResolvedKeybinding | undefined {
		let key: string | undefined;

		switch (platform) {
			case 'win32': key = rawKeyBinding.win; break;
			case 'linux': key = rawKeyBinding.linux; break;
			case 'darwin': key = rawKeyBinding.mac; break;
		}

		return this._keybindingService.resolveUserBinding(key ?? rawKeyBinding.key)[0];
	}

}

Registry.as<IExtensionFeaturesRegistry>(ExtensionFeaturesExtensions.ExtensionFeaturesRegistry).registerExtensionFeature({
	id: 'commands',
	label: localize('commands', "Commands"),
	access: {
		canToggle: false,
	},
	renderer: new SyncDescriptor(CommandsTableRenderer),
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/activity/browser/activityService.ts]---
Location: vscode-main/src/vs/workbench/services/activity/browser/activityService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActivityService, IActivity } from '../common/activity.js';
import { IDisposable, Disposable, toDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IViewDescriptorService, ViewContainer } from '../../../common/views.js';
import { GLOBAL_ACTIVITY_ID, ACCOUNTS_ACTIVITY_ID } from '../../../common/activity.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';

class ViewContainerActivityByView extends Disposable {

	private activity: IActivity | undefined = undefined;
	private activityDisposable: IDisposable = Disposable.None;

	constructor(
		private readonly viewId: string,
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IActivityService private readonly activityService: IActivityService,
	) {
		super();
		this._register(Event.filter(this.viewDescriptorService.onDidChangeContainer, e => e.views.some(view => view.id === viewId))(() => this.update()));
		this._register(Event.filter(this.viewDescriptorService.onDidChangeLocation, e => e.views.some(view => view.id === viewId))(() => this.update()));
	}

	setActivity(activity: IActivity): void {
		this.activity = activity;
		this.update();
	}

	clearActivity(): void {
		this.activity = undefined;
		this.update();
	}

	private update(): void {
		this.activityDisposable.dispose();
		const container = this.viewDescriptorService.getViewContainerByViewId(this.viewId);
		if (container && this.activity) {
			this.activityDisposable = this.activityService.showViewContainerActivity(container.id, this.activity);
		}
	}

	override dispose() {
		this.activityDisposable.dispose();
		super.dispose();
	}
}

interface IViewActivity {
	id: number;
	readonly activity: ViewContainerActivityByView;
}

export class ActivityService extends Disposable implements IActivityService {

	public _serviceBrand: undefined;

	private readonly viewActivities = new Map<string, IViewActivity>();

	private readonly _onDidChangeActivity = this._register(new Emitter<string | ViewContainer>());
	readonly onDidChangeActivity = this._onDidChangeActivity.event;

	private readonly viewContainerActivities = new Map<string, IActivity[]>();
	private readonly globalActivities = new Map<string, IActivity[]>();

	constructor(
		@IViewDescriptorService private readonly viewDescriptorService: IViewDescriptorService,
		@IInstantiationService private readonly instantiationService: IInstantiationService
	) {
		super();
	}

	showViewContainerActivity(viewContainerId: string, activity: IActivity): IDisposable {
		const viewContainer = this.viewDescriptorService.getViewContainerById(viewContainerId);
		if (!viewContainer) {
			return Disposable.None;
		}

		let activities = this.viewContainerActivities.get(viewContainerId);
		if (!activities) {
			activities = [];
			this.viewContainerActivities.set(viewContainerId, activities);
		}

		// add activity
		activities.push(activity);

		this._onDidChangeActivity.fire(viewContainer);

		return toDisposable(() => {
			activities.splice(activities.indexOf(activity), 1);
			if (activities.length === 0) {
				this.viewContainerActivities.delete(viewContainerId);
			}
			this._onDidChangeActivity.fire(viewContainer);
		});
	}

	getViewContainerActivities(viewContainerId: string): IActivity[] {
		const viewContainer = this.viewDescriptorService.getViewContainerById(viewContainerId);
		if (viewContainer) {
			return this.viewContainerActivities.get(viewContainerId) ?? [];
		}
		return [];
	}

	showViewActivity(viewId: string, activity: IActivity): IDisposable {
		let maybeItem = this.viewActivities.get(viewId);

		if (maybeItem) {
			maybeItem.id++;
		} else {
			maybeItem = {
				id: 1,
				activity: this.instantiationService.createInstance(ViewContainerActivityByView, viewId)
			};

			this.viewActivities.set(viewId, maybeItem);
		}

		const id = maybeItem.id;
		maybeItem.activity.setActivity(activity);

		const item = maybeItem;
		return toDisposable(() => {
			if (item.id === id) {
				item.activity.dispose();
				this.viewActivities.delete(viewId);
			}
		});
	}

	showAccountsActivity(activity: IActivity): IDisposable {
		return this.showActivity(ACCOUNTS_ACTIVITY_ID, activity);
	}

	showGlobalActivity(activity: IActivity): IDisposable {
		return this.showActivity(GLOBAL_ACTIVITY_ID, activity);
	}

	getActivity(id: string): IActivity[] {
		return this.globalActivities.get(id) ?? [];
	}

	private showActivity(id: string, activity: IActivity): IDisposable {
		let activities = this.globalActivities.get(id);
		if (!activities) {
			activities = [];
			this.globalActivities.set(id, activities);
		}
		activities.push(activity);
		this._onDidChangeActivity.fire(id);
		return toDisposable(() => {
			activities.splice(activities.indexOf(activity), 1);
			if (activities.length === 0) {
				this.globalActivities.delete(id);
			}
			this._onDidChangeActivity.fire(id);
		});
	}
}

registerSingleton(IActivityService, ActivityService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/activity/common/activity.ts]---
Location: vscode-main/src/vs/workbench/services/activity/common/activity.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Codicon } from '../../../../base/common/codicons.js';
import { Color } from '../../../../base/common/color.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { ThemeIcon } from '../../../../base/common/themables.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { activityErrorBadgeBackground, activityErrorBadgeForeground, activityWarningBadgeBackground, activityWarningBadgeForeground } from '../../../../platform/theme/common/colors/miscColors.js';
import { IColorTheme } from '../../../../platform/theme/common/themeService.js';
import { ViewContainer } from '../../../common/views.js';

export interface IActivity {
	readonly badge: IBadge;
}

export const IActivityService = createDecorator<IActivityService>('activityService');

export interface IActivityService {

	readonly _serviceBrand: undefined;

	/**
	 * Emitted when activity changes for a view container or when the activity of the global actions change.
	 */
	readonly onDidChangeActivity: Event<string | ViewContainer>;

	/**
	 * Show activity for the given view container
	 */
	showViewContainerActivity(viewContainerId: string, badge: IActivity): IDisposable;

	/**
	 * Returns the activity for the given view container
	 */
	getViewContainerActivities(viewContainerId: string): IActivity[];

	/**
	 * Show activity for the given view
	 */
	showViewActivity(viewId: string, badge: IActivity): IDisposable;

	/**
	 * Show accounts activity
	 */
	showAccountsActivity(activity: IActivity): IDisposable;

	/**
	 * Show global activity
	 */
	showGlobalActivity(activity: IActivity): IDisposable;

	/**
	 * Return the activity for the given action
	 */
	getActivity(id: string): IActivity[];
}

export interface IBadge {
	getDescription(): string;
	getColors(theme: IColorTheme): IBadgeStyles | undefined;
}

export interface IBadgeStyles {
	readonly badgeBackground: Color | undefined;
	readonly badgeForeground: Color | undefined;
	readonly badgeBorder: Color | undefined;
}

class BaseBadge<T = unknown> implements IBadge {

	constructor(
		protected readonly descriptorFn: (arg: T) => string,
		private readonly stylesFn: ((theme: IColorTheme) => IBadgeStyles | undefined) | undefined,
	) {
	}

	getDescription(): string {
		return this.descriptorFn(null as T);
	}

	getColors(theme: IColorTheme): IBadgeStyles | undefined {
		return this.stylesFn?.(theme);
	}
}

export class NumberBadge extends BaseBadge<number> {

	constructor(readonly number: number, descriptorFn: (num: number) => string) {
		super(descriptorFn, undefined);

		this.number = number;
	}

	override getDescription(): string {
		return this.descriptorFn(this.number);
	}
}

export class IconBadge extends BaseBadge<void> {
	constructor(
		readonly icon: ThemeIcon,
		descriptorFn: () => string,
		stylesFn?: (theme: IColorTheme) => IBadgeStyles | undefined,
	) {
		super(descriptorFn, stylesFn);
	}
}

export class ProgressBadge extends BaseBadge<void> {
	constructor(descriptorFn: () => string) {
		super(descriptorFn, undefined);
	}
}

export class WarningBadge extends IconBadge {
	constructor(descriptorFn: () => string) {
		super(Codicon.warning, descriptorFn, (theme: IColorTheme) => ({
			badgeBackground: theme.getColor(activityWarningBadgeBackground),
			badgeForeground: theme.getColor(activityWarningBadgeForeground),
			badgeBorder: undefined,
		}));
	}
}

export class ErrorBadge extends IconBadge {
	constructor(descriptorFn: () => string) {
		super(Codicon.error, descriptorFn, (theme: IColorTheme) => ({
			badgeBackground: theme.getColor(activityErrorBadgeBackground),
			badgeForeground: theme.getColor(activityErrorBadgeForeground),
			badgeBorder: undefined,
		}));
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiEmbeddingVector/common/aiEmbeddingVectorService.ts]---
Location: vscode-main/src/vs/workbench/services/aiEmbeddingVector/common/aiEmbeddingVectorService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancelablePromise, createCancelablePromise, raceCancellablePromises, timeout } from '../../../../base/common/async.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILogService } from '../../../../platform/log/common/log.js';

export const IAiEmbeddingVectorService = createDecorator<IAiEmbeddingVectorService>('IAiEmbeddingVectorService');

export interface IAiEmbeddingVectorService {
	readonly _serviceBrand: undefined;

	isEnabled(): boolean;
	getEmbeddingVector(str: string, token: CancellationToken): Promise<number[]>;
	getEmbeddingVector(strings: string[], token: CancellationToken): Promise<number[][]>;
	registerAiEmbeddingVectorProvider(model: string, provider: IAiEmbeddingVectorProvider): IDisposable;
}

export interface IAiEmbeddingVectorProvider {
	provideAiEmbeddingVector(strings: string[], token: CancellationToken): Promise<number[][]>;
}

export class AiEmbeddingVectorService implements IAiEmbeddingVectorService {
	readonly _serviceBrand: undefined;

	static readonly DEFAULT_TIMEOUT = 1000 * 10; // 10 seconds

	private readonly _providers: IAiEmbeddingVectorProvider[] = [];

	constructor(@ILogService private readonly logService: ILogService) { }

	isEnabled(): boolean {
		return this._providers.length > 0;
	}

	registerAiEmbeddingVectorProvider(model: string, provider: IAiEmbeddingVectorProvider): IDisposable {
		this._providers.push(provider);
		return {
			dispose: () => {
				const index = this._providers.indexOf(provider);
				if (index >= 0) {
					this._providers.splice(index, 1);
				}
			}
		};
	}

	getEmbeddingVector(str: string, token: CancellationToken): Promise<number[]>;
	getEmbeddingVector(strings: string[], token: CancellationToken): Promise<number[][]>;
	async getEmbeddingVector(strings: string | string[], token: CancellationToken): Promise<number[] | number[][]> {
		if (this._providers.length === 0) {
			throw new Error('No embedding vector providers registered');
		}

		const stopwatch = StopWatch.create();

		const cancellablePromises: Array<CancelablePromise<number[][]>> = [];

		const timer = timeout(AiEmbeddingVectorService.DEFAULT_TIMEOUT);
		const disposable = token.onCancellationRequested(() => {
			disposable.dispose();
			timer.cancel();
		});

		for (const provider of this._providers) {
			cancellablePromises.push(createCancelablePromise(async t => {
				try {
					return await provider.provideAiEmbeddingVector(
						Array.isArray(strings) ? strings : [strings],
						t
					);
				} catch (e) {
					// logged in extension host
				}
				// Wait for the timer to finish to allow for another provider to resolve.
				// Alternatively, if something resolved, or we've timed out, this will throw
				// as expected.
				await timer;
				throw new Error('Embedding vector provider timed out');
			}));
		}

		cancellablePromises.push(createCancelablePromise(async (t) => {
			const disposable = t.onCancellationRequested(() => {
				timer.cancel();
				disposable.dispose();
			});
			await timer;
			throw new Error('Embedding vector provider timed out');
		}));

		try {
			const result = await raceCancellablePromises(cancellablePromises);

			// If we have a single result, return it directly, otherwise return an array.
			// This aligns with the API overloads.
			if (result.length === 1) {
				return result[0];
			}
			return result;
		} finally {
			stopwatch.stop();
			this.logService.trace(`[AiEmbeddingVectorService]: getEmbeddingVector took ${stopwatch.elapsed()}ms`);
		}
	}
}

registerSingleton(IAiEmbeddingVectorService, AiEmbeddingVectorService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiRelatedInformation/common/aiRelatedInformation.ts]---
Location: vscode-main/src/vs/workbench/services/aiRelatedInformation/common/aiRelatedInformation.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IAiRelatedInformationService = createDecorator<IAiRelatedInformationService>('IAiRelatedInformationService');

export enum RelatedInformationType {
	SymbolInformation = 1,
	CommandInformation = 2,
	SearchInformation = 3,
	SettingInformation = 4
}

interface RelatedInformationBaseResult {
	type: RelatedInformationType;
	weight: number;
}

export interface CommandInformationResult extends RelatedInformationBaseResult {
	type: RelatedInformationType.CommandInformation;
	command: string;
}

export interface SettingInformationResult extends RelatedInformationBaseResult {
	type: RelatedInformationType.SettingInformation;
	setting: string;
}

export type RelatedInformationResult = CommandInformationResult | SettingInformationResult;

export interface IAiRelatedInformationService {
	readonly _serviceBrand: undefined;

	isEnabled(): boolean;
	getRelatedInformation(query: string, types: RelatedInformationType[], token: CancellationToken): Promise<RelatedInformationResult[]>;
	registerAiRelatedInformationProvider(type: RelatedInformationType, provider: IAiRelatedInformationProvider): IDisposable;
}

export interface IAiRelatedInformationProvider {
	provideAiRelatedInformation(query: string, token: CancellationToken): Promise<RelatedInformationResult[]>;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiRelatedInformation/common/aiRelatedInformationService.ts]---
Location: vscode-main/src/vs/workbench/services/aiRelatedInformation/common/aiRelatedInformationService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { CancelablePromise, createCancelablePromise, raceTimeout } from '../../../../base/common/async.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { StopWatch } from '../../../../base/common/stopwatch.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IAiRelatedInformationService, IAiRelatedInformationProvider, RelatedInformationType, RelatedInformationResult } from './aiRelatedInformation.js';

export class AiRelatedInformationService implements IAiRelatedInformationService {
	readonly _serviceBrand: undefined;

	static readonly DEFAULT_TIMEOUT = 1000 * 10; // 10 seconds

	private readonly _providers: Map<RelatedInformationType, IAiRelatedInformationProvider[]> = new Map();

	constructor(@ILogService private readonly logService: ILogService) { }

	isEnabled(): boolean {
		return this._providers.size > 0;
	}

	registerAiRelatedInformationProvider(type: RelatedInformationType, provider: IAiRelatedInformationProvider): IDisposable {
		const providers = this._providers.get(type) ?? [];
		providers.push(provider);
		this._providers.set(type, providers);


		return {
			dispose: () => {
				const providers = this._providers.get(type) ?? [];
				const index = providers.indexOf(provider);
				if (index !== -1) {
					providers.splice(index, 1);
				}
				if (providers.length === 0) {
					this._providers.delete(type);
				}
			}
		};
	}

	async getRelatedInformation(query: string, types: RelatedInformationType[], token: CancellationToken): Promise<RelatedInformationResult[]> {
		if (this._providers.size === 0) {
			throw new Error('No related information providers registered');
		}

		// get providers for each type
		const providers: IAiRelatedInformationProvider[] = [];
		for (const type of types) {
			const typeProviders = this._providers.get(type);
			if (typeProviders) {
				providers.push(...typeProviders);
			}
		}

		if (providers.length === 0) {
			throw new Error('No related information providers registered for the given types');
		}

		const stopwatch = StopWatch.create();

		const cancellablePromises: Array<CancelablePromise<RelatedInformationResult[]>> = providers.map((provider) => {
			return createCancelablePromise(async t => {
				try {
					const result = await provider.provideAiRelatedInformation(query, t);
					// double filter just in case
					return result.filter(r => types.includes(r.type));
				} catch (e) {
					// logged in extension host
				}
				return [];
			});
		});

		try {
			const results = await raceTimeout(
				Promise.allSettled(cancellablePromises),
				AiRelatedInformationService.DEFAULT_TIMEOUT,
				() => {
					cancellablePromises.forEach(p => p.cancel());
					this.logService.warn('[AiRelatedInformationService]: Related information provider timed out');
				}
			);
			if (!results) {
				return [];
			}
			const result = results
				.filter(r => r.status === 'fulfilled')
				.flatMap(r => (r as PromiseFulfilledResult<RelatedInformationResult[]>).value);
			return result;
		} finally {
			stopwatch.stop();
			this.logService.trace(`[AiRelatedInformationService]: getRelatedInformation took ${stopwatch.elapsed()}ms`);
		}
	}
}

registerSingleton(IAiRelatedInformationService, AiRelatedInformationService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiRelatedInformation/test/common/aiRelatedInformationService.test.ts]---
Location: vscode-main/src/vs/workbench/services/aiRelatedInformation/test/common/aiRelatedInformationService.test.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import * as sinon from 'sinon';
import { AiRelatedInformationService } from '../../common/aiRelatedInformationService.js';
import { NullLogService } from '../../../../../platform/log/common/log.js';
import { CommandInformationResult, IAiRelatedInformationProvider, RelatedInformationType, SettingInformationResult } from '../../common/aiRelatedInformation.js';
import { CancellationToken } from '../../../../../base/common/cancellation.js';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../../base/test/common/utils.js';

suite('AiRelatedInformationService', () => {
	const store = ensureNoDisposablesAreLeakedInTestSuite();
	let service: AiRelatedInformationService;

	setup(() => {
		service = new AiRelatedInformationService(store.add(new NullLogService()));
	});

	test('should check if providers are registered', () => {
		assert.equal(service.isEnabled(), false);
		store.add(service.registerAiRelatedInformationProvider(RelatedInformationType.CommandInformation, { provideAiRelatedInformation: () => Promise.resolve([]) }));
		assert.equal(service.isEnabled(), true);
	});

	test('should register and unregister providers', () => {
		const provider: IAiRelatedInformationProvider = { provideAiRelatedInformation: () => Promise.resolve([]) };
		const disposable = service.registerAiRelatedInformationProvider(RelatedInformationType.CommandInformation, provider);
		assert.strictEqual(service.isEnabled(), true);
		disposable.dispose();
		assert.strictEqual(service.isEnabled(), false);
	});

	test('should get related information', async () => {
		const command = 'command';
		const provider: IAiRelatedInformationProvider = {
			provideAiRelatedInformation: () => Promise.resolve([{ type: RelatedInformationType.CommandInformation, command, weight: 1 }])
		};
		service.registerAiRelatedInformationProvider(RelatedInformationType.CommandInformation, provider);
		const result = await service.getRelatedInformation('query', [RelatedInformationType.CommandInformation], CancellationToken.None);
		assert.strictEqual(result.length, 1);
		assert.strictEqual((result[0] as CommandInformationResult).command, command);
	});

	test('should get different types of related information', async () => {
		const command = 'command';
		const commandProvider: IAiRelatedInformationProvider = {
			provideAiRelatedInformation: () => Promise.resolve([{ type: RelatedInformationType.CommandInformation, command, weight: 1 }])
		};
		service.registerAiRelatedInformationProvider(RelatedInformationType.CommandInformation, commandProvider);
		const setting = 'setting';
		const settingProvider: IAiRelatedInformationProvider = {
			provideAiRelatedInformation: () => Promise.resolve([{ type: RelatedInformationType.SettingInformation, setting, weight: 1 }])
		};
		service.registerAiRelatedInformationProvider(RelatedInformationType.SettingInformation, settingProvider);
		const result = await service.getRelatedInformation(
			'query',
			[
				RelatedInformationType.CommandInformation,
				RelatedInformationType.SettingInformation
			],
			CancellationToken.None
		);
		assert.strictEqual(result.length, 2);
		assert.strictEqual((result[0] as CommandInformationResult).command, command);
		assert.strictEqual((result[1] as SettingInformationResult).setting, setting);
	});

	test('should return empty array on timeout', async () => {
		const clock = sinon.useFakeTimers({
			shouldAdvanceTime: true,
		});
		const provider: IAiRelatedInformationProvider = {
			provideAiRelatedInformation: () => new Promise((resolve) => {
				setTimeout(() => {
					resolve([{ type: RelatedInformationType.CommandInformation, command: 'command', weight: 1 }]);
				}, AiRelatedInformationService.DEFAULT_TIMEOUT + 100);
			})
		};

		service.registerAiRelatedInformationProvider(RelatedInformationType.CommandInformation, provider);

		try {
			const promise = service.getRelatedInformation('query', [RelatedInformationType.CommandInformation], CancellationToken.None);
			clock.tick(AiRelatedInformationService.DEFAULT_TIMEOUT + 200);
			const result = await promise;
			assert.strictEqual(result.length, 0);
		} finally {
			clock.restore();
		}
	});
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiSettingsSearch/common/aiSettingsSearch.ts]---
Location: vscode-main/src/vs/workbench/services/aiSettingsSearch/common/aiSettingsSearch.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Event } from '../../../../base/common/event.js';
import { IDisposable } from '../../../../base/common/lifecycle.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

export const IAiSettingsSearchService = createDecorator<IAiSettingsSearchService>('IAiSettingsSearchService');

export enum AiSettingsSearchResultKind {
	EMBEDDED = 1,
	LLM_RANKED = 2,
	CANCELED = 3,
}

export interface AiSettingsSearchResult {
	query: string;
	kind: AiSettingsSearchResultKind;
	settings: string[];
}

export interface AiSettingsSearchProviderOptions {
	limit: number;
	embeddingsOnly: boolean;
}

export interface IAiSettingsSearchService {
	readonly _serviceBrand: undefined;
	readonly onProviderRegistered: Event<void>;

	// Called from the Settings editor
	isEnabled(): boolean;
	startSearch(query: string, token: CancellationToken): void;
	getEmbeddingsResults(query: string, token: CancellationToken): Promise<string[] | null>;
	getLLMRankedResults(query: string, token: CancellationToken): Promise<string[] | null>;

	// Called from the main thread
	registerSettingsSearchProvider(provider: IAiSettingsSearchProvider): IDisposable;
	handleSearchResult(results: AiSettingsSearchResult): void;
}

export interface IAiSettingsSearchProvider {
	searchSettings(query: string, option: AiSettingsSearchProviderOptions, token: CancellationToken): void;
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/aiSettingsSearch/common/aiSettingsSearchService.ts]---
Location: vscode-main/src/vs/workbench/services/aiSettingsSearch/common/aiSettingsSearchService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DeferredPromise, raceCancellation } from '../../../../base/common/async.js';
import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable, IDisposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { AiSettingsSearchResult, AiSettingsSearchResultKind, IAiSettingsSearchProvider, IAiSettingsSearchService } from './aiSettingsSearch.js';

export class AiSettingsSearchService extends Disposable implements IAiSettingsSearchService {
	readonly _serviceBrand: undefined;
	private static readonly MAX_PICKS = 5;

	private _providers: IAiSettingsSearchProvider[] = [];
	private _llmRankedResultsPromises: Map<string, DeferredPromise<string[]>> = new Map();
	private _embeddingsResultsPromises: Map<string, DeferredPromise<string[]>> = new Map();

	private _onProviderRegistered: Emitter<void> = this._register(new Emitter<void>());
	readonly onProviderRegistered: Event<void> = this._onProviderRegistered.event;

	isEnabled(): boolean {
		return this._providers.length > 0;
	}

	registerSettingsSearchProvider(provider: IAiSettingsSearchProvider): IDisposable {
		this._providers.push(provider);
		this._onProviderRegistered.fire();
		return {
			dispose: () => {
				const index = this._providers.indexOf(provider);
				if (index !== -1) {
					this._providers.splice(index, 1);
				}
			}
		};
	}

	startSearch(query: string, token: CancellationToken): void {
		if (!this.isEnabled()) {
			throw new Error('No settings search providers registered');
		}

		this._embeddingsResultsPromises.delete(query);
		this._llmRankedResultsPromises.delete(query);

		this._providers.forEach(provider => provider.searchSettings(query, { limit: AiSettingsSearchService.MAX_PICKS, embeddingsOnly: false }, token));
	}

	async getEmbeddingsResults(query: string, token: CancellationToken): Promise<string[] | null> {
		if (!this.isEnabled()) {
			throw new Error('No settings search providers registered');
		}

		const existingPromise = this._embeddingsResultsPromises.get(query);
		if (existingPromise) {
			const result = await existingPromise.p;
			return result ?? null;
		}

		const promise = new DeferredPromise<string[]>();
		this._embeddingsResultsPromises.set(query, promise);
		const result = await raceCancellation(promise.p, token);
		return result ?? null;
	}

	async getLLMRankedResults(query: string, token: CancellationToken): Promise<string[] | null> {
		if (!this.isEnabled()) {
			throw new Error('No settings search providers registered');
		}

		const existingPromise = this._llmRankedResultsPromises.get(query);
		if (existingPromise) {
			const result = await existingPromise.p;
			return result ?? null;
		}

		const promise = new DeferredPromise<string[]>();
		this._llmRankedResultsPromises.set(query, promise);
		const result = await raceCancellation(promise.p, token);
		return result ?? null;
	}

	handleSearchResult(result: AiSettingsSearchResult): void {
		if (!this.isEnabled()) {
			return;
		}

		if (result.kind === AiSettingsSearchResultKind.EMBEDDED) {
			const promise = this._embeddingsResultsPromises.get(result.query);
			if (promise) {
				promise.complete(result.settings);
			} else {
				const parkedPromise = new DeferredPromise<string[]>();
				parkedPromise.complete(result.settings);
				this._embeddingsResultsPromises.set(result.query, parkedPromise);
			}
		} else if (result.kind === AiSettingsSearchResultKind.LLM_RANKED) {
			const promise = this._llmRankedResultsPromises.get(result.query);
			if (promise) {
				promise.complete(result.settings);
			} else {
				const parkedPromise = new DeferredPromise<string[]>();
				parkedPromise.complete(result.settings);
				this._llmRankedResultsPromises.set(result.query, parkedPromise);
			}
		}
	}
}

registerSingleton(IAiSettingsSearchService, AiSettingsSearchService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/assignment/common/assignmentFilters.ts]---
Location: vscode-main/src/vs/workbench/services/assignment/common/assignmentFilters.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { IExperimentationFilterProvider } from 'tas-client';
import { IExtensionService } from '../../extensions/common/extensions.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { Emitter } from '../../../../base/common/event.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IChatEntitlementService } from '../../chat/common/chatEntitlementService.js';

export enum ExtensionsFilter {

	/**
	 * Version of the github.copilot extension.
	 */
	CopilotExtensionVersion = 'X-Copilot-RelatedPluginVersion-githubcopilot',

	/**
	 * Version of the github.copilot-chat extension.
	 */
	CopilotChatExtensionVersion = 'X-Copilot-RelatedPluginVersion-githubcopilotchat',

	/**
	 * Version of the completions version.
	 */
	CompletionsVersionInCopilotChat = 'X-VSCode-CompletionsInChatExtensionVersion',

	/**
	 * SKU of the copilot entitlement.
	 */
	CopilotSku = 'X-GitHub-Copilot-SKU',

	/**
	 * The internal org of the user.
	 */
	MicrosoftInternalOrg = 'X-Microsoft-Internal-Org',
}

enum StorageVersionKeys {
	CopilotExtensionVersion = 'extensionsAssignmentFilterProvider.copilotExtensionVersion',
	CopilotChatExtensionVersion = 'extensionsAssignmentFilterProvider.copilotChatExtensionVersion',
	CompletionsVersion = 'extensionsAssignmentFilterProvider.copilotCompletionsVersion',
	CopilotSku = 'extensionsAssignmentFilterProvider.copilotSku',
	CopilotInternalOrg = 'extensionsAssignmentFilterProvider.copilotInternalOrg',
}

export class CopilotAssignmentFilterProvider extends Disposable implements IExperimentationFilterProvider {
	private copilotChatExtensionVersion: string | undefined;
	private copilotExtensionVersion: string | undefined;
	// TODO@benibenj remove this when completions have been ported to chat
	private copilotCompletionsVersion: string | undefined;

	private copilotInternalOrg: string | undefined;
	private copilotSku: string | undefined;

	private readonly _onDidChangeFilters = this._register(new Emitter<void>());
	readonly onDidChangeFilters = this._onDidChangeFilters.event;

	constructor(
		@IExtensionService private readonly _extensionService: IExtensionService,
		@ILogService private readonly _logService: ILogService,
		@IStorageService private readonly _storageService: IStorageService,
		@IChatEntitlementService private readonly _chatEntitlementService: IChatEntitlementService,
	) {
		super();

		this.copilotExtensionVersion = this._storageService.get(StorageVersionKeys.CopilotExtensionVersion, StorageScope.PROFILE);
		this.copilotChatExtensionVersion = this._storageService.get(StorageVersionKeys.CopilotChatExtensionVersion, StorageScope.PROFILE);
		this.copilotCompletionsVersion = this._storageService.get(StorageVersionKeys.CompletionsVersion, StorageScope.PROFILE);
		this.copilotSku = this._storageService.get(StorageVersionKeys.CopilotSku, StorageScope.PROFILE);
		this.copilotInternalOrg = this._storageService.get(StorageVersionKeys.CopilotInternalOrg, StorageScope.PROFILE);

		this._register(this._extensionService.onDidChangeExtensionsStatus(extensionIdentifiers => {
			if (extensionIdentifiers.some(identifier => ExtensionIdentifier.equals(identifier, 'github.copilot') || ExtensionIdentifier.equals(identifier, 'github.copilot-chat'))) {
				this.updateExtensionVersions();
			}
		}));

		this._register(this._chatEntitlementService.onDidChangeEntitlement(() => {
			this.updateCopilotEntitlementInfo();
		}));

		this.updateExtensionVersions();
		this.updateCopilotEntitlementInfo();
	}

	private async updateExtensionVersions() {
		let copilotExtensionVersion;
		let copilotChatExtensionVersion;
		let copilotCompletionsVersion;

		try {
			const [copilotExtension, copilotChatExtension] = await Promise.all([
				this._extensionService.getExtension('github.copilot'),
				this._extensionService.getExtension('github.copilot-chat'),
			]);

			copilotExtensionVersion = copilotExtension?.version;
			copilotChatExtensionVersion = copilotChatExtension?.version;
			copilotCompletionsVersion = (copilotChatExtension as typeof copilotChatExtension & { completionsCoreVersion?: string })?.completionsCoreVersion;
		} catch (error) {
			this._logService.error('Failed to update extension version assignments', error);
		}

		if (this.copilotCompletionsVersion === copilotCompletionsVersion &&
			this.copilotExtensionVersion === copilotExtensionVersion &&
			this.copilotChatExtensionVersion === copilotChatExtensionVersion) {
			return;
		}

		this.copilotExtensionVersion = copilotExtensionVersion;
		this.copilotChatExtensionVersion = copilotChatExtensionVersion;
		this.copilotCompletionsVersion = copilotCompletionsVersion;

		this._storageService.store(StorageVersionKeys.CopilotExtensionVersion, this.copilotExtensionVersion, StorageScope.PROFILE, StorageTarget.MACHINE);
		this._storageService.store(StorageVersionKeys.CopilotChatExtensionVersion, this.copilotChatExtensionVersion, StorageScope.PROFILE, StorageTarget.MACHINE);
		this._storageService.store(StorageVersionKeys.CompletionsVersion, this.copilotCompletionsVersion, StorageScope.PROFILE, StorageTarget.MACHINE);

		// Notify that the filters have changed.
		this._onDidChangeFilters.fire();
	}

	private updateCopilotEntitlementInfo() {
		const newSku = this._chatEntitlementService.sku;
		const newIsGitHubInternal = this._chatEntitlementService.organisations?.includes('github');
		const newIsMicrosoftInternal = this._chatEntitlementService.organisations?.includes('microsoft') || this._chatEntitlementService.organisations?.includes('ms-copilot') || this._chatEntitlementService.organisations?.includes('MicrosoftCopilot');
		const newInternalOrg = newIsGitHubInternal ? 'github' : newIsMicrosoftInternal ? 'microsoft' : undefined;

		if (this.copilotSku === newSku && this.copilotInternalOrg === newInternalOrg) {
			return;
		}

		this.copilotSku = newSku;
		this.copilotInternalOrg = newInternalOrg;

		this._storageService.store(StorageVersionKeys.CopilotSku, this.copilotSku, StorageScope.PROFILE, StorageTarget.MACHINE);
		this._storageService.store(StorageVersionKeys.CopilotInternalOrg, this.copilotInternalOrg, StorageScope.PROFILE, StorageTarget.MACHINE);

		// Notify that the filters have changed.
		this._onDidChangeFilters.fire();
	}

	/**
	 * Returns a version string that can be parsed by the TAS client.
	 * The tas client cannot handle suffixes lke "-insider"
	 * Ref: https://github.com/microsoft/tas-client/blob/30340d5e1da37c2789049fcf45928b954680606f/vscode-tas-client/src/vscode-tas-client/VSCodeFilterProvider.ts#L35
	 *
	 * @param version Version string to be trimmed.
	*/
	private static trimVersionSuffix(version: string): string {
		const regex = /\-[a-zA-Z0-9]+$/;
		const result = version.split(regex);

		return result[0];
	}

	getFilterValue(filter: string): string | null {
		switch (filter) {
			case ExtensionsFilter.CopilotExtensionVersion:
				return this.copilotExtensionVersion ? CopilotAssignmentFilterProvider.trimVersionSuffix(this.copilotExtensionVersion) : null;
			case ExtensionsFilter.CompletionsVersionInCopilotChat:
				return this.copilotCompletionsVersion ? CopilotAssignmentFilterProvider.trimVersionSuffix(this.copilotCompletionsVersion) : null;
			case ExtensionsFilter.CopilotChatExtensionVersion:
				return this.copilotChatExtensionVersion ? CopilotAssignmentFilterProvider.trimVersionSuffix(this.copilotChatExtensionVersion) : null;
			case ExtensionsFilter.CopilotSku:
				return this.copilotSku ?? null;
			case ExtensionsFilter.MicrosoftInternalOrg:
				return this.copilotInternalOrg ?? null;
			default:
				return null;
		}
	}

	getFilters(): Map<string, string | null> {
		const filters = new Map<string, string | null>();
		const filterValues = Object.values(ExtensionsFilter);
		for (const value of filterValues) {
			filters.set(value, this.getFilterValue(value));
		}

		return filters;
	}
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/assignment/common/assignmentService.ts]---
Location: vscode-main/src/vs/workbench/services/assignment/common/assignmentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../nls.js';
import { createDecorator, IInstantiationService } from '../../../../platform/instantiation/common/instantiation.js';
import type { IKeyValueStorage, IExperimentationTelemetry, ExperimentationService as TASClient } from 'tas-client';
import { Memento } from '../../../common/memento.js';
import { ITelemetryService, TelemetryLevel } from '../../../../platform/telemetry/common/telemetry.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { ITelemetryData } from '../../../../base/common/actions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ASSIGNMENT_REFETCH_INTERVAL, ASSIGNMENT_STORAGE_KEY, AssignmentFilterProvider, IAssignmentService, TargetPopulation } from '../../../../platform/assignment/common/assignment.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { workbenchConfigurationNodeBase } from '../../../common/configuration.js';
import { IConfigurationRegistry, Extensions as ConfigurationExtensions, ConfigurationScope } from '../../../../platform/configuration/common/configurationRegistry.js';
import { IWorkbenchEnvironmentService } from '../../environment/common/environmentService.js';
import { getTelemetryLevel } from '../../../../platform/telemetry/common/telemetryUtils.js';
import { importAMDNodeModule } from '../../../../amdX.js';
import { timeout } from '../../../../base/common/async.js';
import { CopilotAssignmentFilterProvider } from './assignmentFilters.js';
import { Disposable, DisposableStore } from '../../../../base/common/lifecycle.js';
import { Emitter, Event } from '../../../../base/common/event.js';

export interface IAssignmentFilter {
	exclude(assignment: string): boolean;
	onDidChange: Event<void>;
}

export const IWorkbenchAssignmentService = createDecorator<IWorkbenchAssignmentService>('assignmentService');

export interface IWorkbenchAssignmentService extends IAssignmentService {
	getCurrentExperiments(): Promise<string[] | undefined>;
	addTelemetryAssignmentFilter(filter: IAssignmentFilter): void;
}

class MementoKeyValueStorage implements IKeyValueStorage {

	private readonly mementoObj: Record<string, unknown>;

	constructor(private readonly memento: Memento<Record<string, unknown>>) {
		this.mementoObj = memento.getMemento(StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	async getValue<T>(key: string, defaultValue?: T | undefined): Promise<T | undefined> {
		const value = await this.mementoObj[key] as T | undefined;

		return value || defaultValue;
	}

	setValue<T>(key: string, value: T): void {
		this.mementoObj[key] = value;
		this.memento.saveMemento();
	}
}

class WorkbenchAssignmentServiceTelemetry extends Disposable implements IExperimentationTelemetry {

	private readonly _onDidUpdateAssignmentContext = this._register(new Emitter<void>());
	readonly onDidUpdateAssignmentContext = this._onDidUpdateAssignmentContext.event;

	private _previousAssignmentContext: string | undefined;
	private _lastAssignmentContext: string | undefined;
	get assignmentContext(): string[] | undefined {
		return this._lastAssignmentContext?.split(';');
	}

	private _assignmentFilters: IAssignmentFilter[] = [];
	private _assignmentFilterDisposables = this._register(new DisposableStore());

	constructor(
		private readonly telemetryService: ITelemetryService,
		private readonly productService: IProductService
	) {
		super();
	}

	private _filterAssignmentContext(assignmentContext: string): string {
		const assignments = assignmentContext.split(';');

		const filteredAssignments = assignments.filter(assignment => {
			for (const filter of this._assignmentFilters) {
				if (filter.exclude(assignment)) {
					return false;
				}
			}
			return true;
		});

		return filteredAssignments.join(';');
	}

	private _setAssignmentContext(value: string): void {
		const filteredValue = this._filterAssignmentContext(value);
		this._lastAssignmentContext = filteredValue;
		this._onDidUpdateAssignmentContext.fire();

		if (this.productService.tasConfig?.assignmentContextTelemetryPropertyName) {
			this.telemetryService.setExperimentProperty(this.productService.tasConfig.assignmentContextTelemetryPropertyName, filteredValue);
		}
	}

	addAssignmentFilter(filter: IAssignmentFilter): void {
		this._assignmentFilters.push(filter);
		this._assignmentFilterDisposables.add(filter.onDidChange(() => {
			if (this._previousAssignmentContext) {
				this._setAssignmentContext(this._previousAssignmentContext);
			}
		}));
		if (this._previousAssignmentContext) {
			this._setAssignmentContext(this._previousAssignmentContext);
		}
	}

	// __GDPR__COMMON__ "abexp.assignmentcontext" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	setSharedProperty(name: string, value: string): void {
		if (name === this.productService.tasConfig?.assignmentContextTelemetryPropertyName) {
			this._previousAssignmentContext = value;
			return this._setAssignmentContext(value);
		}

		this.telemetryService.setExperimentProperty(name, value);
	}

	postEvent(eventName: string, props: Map<string, string>): void {
		const data: ITelemetryData = {};
		for (const [key, value] of props.entries()) {
			data[key] = value;
		}

		/* __GDPR__
			"query-expfeature" : {
				"owner": "sbatten",
				"comment": "Logs queries to the experiment service by feature for metric calculations",
				"ABExp.queriedFeature": { "classification": "SystemMetaData", "purpose": "FeatureInsight", "comment": "The experimental feature being queried" }
			}
		*/
		this.telemetryService.publicLog(eventName, data);
	}
}

export class WorkbenchAssignmentService extends Disposable implements IAssignmentService {

	declare readonly _serviceBrand: undefined;

	private readonly tasClient: Promise<TASClient> | undefined;
	private readonly tasSetupDisposables = new DisposableStore();

	private networkInitialized = false;
	private readonly overrideInitDelay: Promise<void>;

	private readonly telemetry: WorkbenchAssignmentServiceTelemetry;
	private readonly keyValueStorage: IKeyValueStorage;

	private readonly experimentsEnabled: boolean;

	private readonly _onDidRefetchAssignments = this._register(new Emitter<void>());
	public readonly onDidRefetchAssignments = this._onDidRefetchAssignments.event;

	constructor(
		@ITelemetryService private readonly telemetryService: ITelemetryService,
		@IStorageService storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IProductService private readonly productService: IProductService,
		@IWorkbenchEnvironmentService environmentService: IWorkbenchEnvironmentService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super();

		this.experimentsEnabled = getTelemetryLevel(configurationService) === TelemetryLevel.USAGE &&
			!environmentService.disableExperiments &&
			!environmentService.extensionTestsLocationURI &&
			!environmentService.enableSmokeTestDriver &&
			configurationService.getValue('workbench.enableExperiments') === true;

		if (productService.tasConfig && this.experimentsEnabled) {
			this.tasClient = this.setupTASClient();
		}

		this.telemetry = this._register(new WorkbenchAssignmentServiceTelemetry(telemetryService, productService));
		this._register(this.telemetry.onDidUpdateAssignmentContext(() => this._onDidRefetchAssignments.fire()));

		this.keyValueStorage = new MementoKeyValueStorage(new Memento<Record<string, unknown>>('experiment.service.memento', storageService));

		// For development purposes, configure the delay until tas local tas treatment ovverrides are available
		const overrideDelaySetting = configurationService.getValue('experiments.overrideDelay');
		const overrideDelay = typeof overrideDelaySetting === 'number' ? overrideDelaySetting : 0;
		this.overrideInitDelay = timeout(overrideDelay);
	}

	async getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined> {
		const result = await this.doGetTreatment<T>(name);

		type TASClientReadTreatmentData = {
			treatmentName: string;
			treatmentValue: string;
		};

		type TASClientReadTreatmentClassification = {
			owner: 'sbatten';
			comment: 'Logged when a treatment value is read from the experiment service';
			treatmentValue: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The value of the read treatment' };
			treatmentName: { classification: 'SystemMetaData'; purpose: 'PerformanceAndHealth'; comment: 'The name of the treatment that was read' };
		};

		this.telemetryService.publicLog2<TASClientReadTreatmentData, TASClientReadTreatmentClassification>('tasClientReadTreatmentComplete', {
			treatmentName: name,
			treatmentValue: JSON.stringify(result)
		});

		return result;
	}

	private async doGetTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined> {
		await this.overrideInitDelay; // For development purposes, allow overriding tas assignments to test variants locally.

		const override = this.configurationService.getValue<T>(`experiments.override.${name}`);
		if (override !== undefined) {
			return override;
		}

		if (!this.tasClient) {
			return undefined;
		}

		if (!this.experimentsEnabled) {
			return undefined;
		}

		let result: T | undefined;
		const client = await this.tasClient;

		// The TAS client is initialized but we need to check if the initial fetch has completed yet
		// If it is complete, return a cached value for the treatment
		// If not, use the async call with `checkCache: true`. This will allow the module to return a cached value if it is present.
		// Otherwise it will await the initial fetch to return the most up to date value.
		if (this.networkInitialized) {
			result = client.getTreatmentVariable<T>('vscode', name);
		} else {
			result = await client.getTreatmentVariableAsync<T>('vscode', name, true);
		}

		result = client.getTreatmentVariable<T>('vscode', name);
		return result;
	}

	private async setupTASClient(): Promise<TASClient> {
		this.tasSetupDisposables.clear();

		const targetPopulation = this.productService.quality === 'stable' ?
			TargetPopulation.Public : (this.productService.quality === 'exploration' ?
				TargetPopulation.Exploration : TargetPopulation.Insiders);

		const filterProvider = new AssignmentFilterProvider(
			this.productService.version,
			this.productService.nameLong,
			this.telemetryService.machineId,
			this.telemetryService.devDeviceId,
			targetPopulation,
			this.productService.date ?? ''
		);

		const extensionsFilterProvider = this.instantiationService.createInstance(CopilotAssignmentFilterProvider);
		this.tasSetupDisposables.add(extensionsFilterProvider);
		this.tasSetupDisposables.add(extensionsFilterProvider.onDidChangeFilters(() => this.refetchAssignments()));

		const tasConfig = this.productService.tasConfig!;
		const tasClient = new (await importAMDNodeModule<typeof import('tas-client')>('tas-client', 'dist/tas-client.min.js')).ExperimentationService({
			filterProviders: [filterProvider, extensionsFilterProvider],
			telemetry: this.telemetry,
			storageKey: ASSIGNMENT_STORAGE_KEY,
			keyValueStorage: this.keyValueStorage,
			assignmentContextTelemetryPropertyName: tasConfig.assignmentContextTelemetryPropertyName,
			telemetryEventName: tasConfig.telemetryEventName,
			endpoint: tasConfig.endpoint,
			refetchInterval: ASSIGNMENT_REFETCH_INTERVAL,
		});

		await tasClient.initializePromise;
		tasClient.initialFetch.then(() => {
			this.networkInitialized = true;
		});

		return tasClient;
	}

	private async refetchAssignments(): Promise<void> {
		if (!this.tasClient) {
			return; // Setup has not started, assignments will use latest filters
		}

		// Await the client to be setup and the initial fetch to complete
		const tasClient = await this.tasClient;
		await tasClient.initialFetch;

		// Refresh the assignments
		await tasClient.getTreatmentVariableAsync('vscode', 'refresh', false);
	}

	async getCurrentExperiments(): Promise<string[] | undefined> {
		if (!this.tasClient) {
			return undefined;
		}

		if (!this.experimentsEnabled) {
			return undefined;
		}

		await this.tasClient;

		return this.telemetry.assignmentContext;
	}

	addTelemetryAssignmentFilter(filter: IAssignmentFilter): void {
		this.telemetry.addAssignmentFilter(filter);
	}
}

registerSingleton(IWorkbenchAssignmentService, WorkbenchAssignmentService, InstantiationType.Delayed);

const registry = Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration);
registry.registerConfiguration({
	...workbenchConfigurationNodeBase,
	'properties': {
		'workbench.enableExperiments': {
			'type': 'boolean',
			'description': localize('workbench.enableExperiments', "Fetches experiments to run from a Microsoft online service."),
			'default': true,
			'scope': ConfigurationScope.APPLICATION,
			'restricted': true,
			'tags': ['usesOnlineServices']
		}
	}
});
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/assignment/test/common/nullAssignmentService.ts]---
Location: vscode-main/src/vs/workbench/services/assignment/test/common/nullAssignmentService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Event } from '../../../../../base/common/event.js';
import { IAssignmentFilter, IWorkbenchAssignmentService } from '../../common/assignmentService.js';

export class NullWorkbenchAssignmentService implements IWorkbenchAssignmentService {
	_serviceBrand: undefined;

	readonly onDidRefetchAssignments: Event<void> = Event.None;

	async getCurrentExperiments(): Promise<string[] | undefined> {
		return [];
	}

	async getTreatment<T extends string | number | boolean>(name: string): Promise<T | undefined> {
		return undefined;
	}

	addTelemetryAssignmentFilter(filter: IAssignmentFilter): void { }
}
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationAccessService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationAccessService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { AllowedExtension } from '../common/authentication.js';

export const IAuthenticationAccessService = createDecorator<IAuthenticationAccessService>('IAuthenticationAccessService');
export interface IAuthenticationAccessService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeExtensionSessionAccess: Event<{ providerId: string; accountName: string }>;

	/**
	 * Check extension access to an account
	 * @param providerId The id of the authentication provider
	 * @param accountName The account name that access is checked for
	 * @param extensionId The id of the extension requesting access
	 * @returns Returns true or false if the user has opted to permanently grant or disallow access, and undefined
	 * if they haven't made a choice yet
	 */
	isAccessAllowed(providerId: string, accountName: string, extensionId: string): boolean | undefined;
	readAllowedExtensions(providerId: string, accountName: string): AllowedExtension[];
	updateAllowedExtensions(providerId: string, accountName: string, extensions: AllowedExtension[]): void;
	removeAllowedExtensions(providerId: string, accountName: string): void;
}

// TODO@TylerLeonhardt: Move this class to MainThreadAuthentication
// TODO@TylerLeonhardt: Should this class only keep track of allowed things and throw away disallowed ones?
export class AuthenticationAccessService extends Disposable implements IAuthenticationAccessService {
	_serviceBrand: undefined;

	private _onDidChangeExtensionSessionAccess: Emitter<{ providerId: string; accountName: string }> = this._register(new Emitter<{ providerId: string; accountName: string }>());
	readonly onDidChangeExtensionSessionAccess: Event<{ providerId: string; accountName: string }> = this._onDidChangeExtensionSessionAccess.event;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
		@IProductService private readonly _productService: IProductService
	) {
		super();
	}

	isAccessAllowed(providerId: string, accountName: string, extensionId: string): boolean | undefined {
		const trustedExtensionAuthAccess = this._productService.trustedExtensionAuthAccess;
		const extensionKey = ExtensionIdentifier.toKey(extensionId);
		if (Array.isArray(trustedExtensionAuthAccess)) {
			if (trustedExtensionAuthAccess.includes(extensionKey)) {
				return true;
			}
		} else if (trustedExtensionAuthAccess?.[providerId]?.includes(extensionKey)) {
			return true;
		}

		const allowList = this.readAllowedExtensions(providerId, accountName);
		const extensionData = allowList.find(extension => extension.id === extensionKey);
		if (!extensionData) {
			return undefined;
		}
		// This property didn't exist on this data previously, inclusion in the list at all indicates allowance
		return extensionData.allowed !== undefined
			? extensionData.allowed
			: true;
	}

	readAllowedExtensions(providerId: string, accountName: string): AllowedExtension[] {
		let trustedExtensions: AllowedExtension[] = [];
		try {
			const trustedExtensionSrc = this._storageService.get(`${providerId}-${accountName}`, StorageScope.APPLICATION);
			if (trustedExtensionSrc) {
				trustedExtensions = JSON.parse(trustedExtensionSrc);
			}
		} catch (err) { }

		// Add trusted extensions from product.json if they're not already in the list
		const trustedExtensionAuthAccess = this._productService.trustedExtensionAuthAccess;
		const trustedExtensionIds =
			// Case 1: trustedExtensionAuthAccess is an array
			Array.isArray(trustedExtensionAuthAccess)
				? trustedExtensionAuthAccess
				// Case 2: trustedExtensionAuthAccess is an object
				: typeof trustedExtensionAuthAccess === 'object'
					? trustedExtensionAuthAccess[providerId] ?? []
					: [];

		for (const extensionId of trustedExtensionIds) {
			const extensionKey = ExtensionIdentifier.toKey(extensionId);
			const existingExtension = trustedExtensions.find(extension => extension.id === extensionKey);
			if (!existingExtension) {
				// Add new trusted extension (name will be set by caller if they have extension info)
				trustedExtensions.push({
					id: extensionKey,
					name: extensionId, // Use original casing for display name
					allowed: true,
					trusted: true
				});
			} else {
				// Update existing extension to be trusted
				existingExtension.allowed = true;
				existingExtension.trusted = true;
			}
		}

		return trustedExtensions;
	}

	updateAllowedExtensions(providerId: string, accountName: string, extensions: AllowedExtension[]): void {
		const allowList = this.readAllowedExtensions(providerId, accountName);
		for (const extension of extensions) {
			const extensionKey = ExtensionIdentifier.toKey(extension.id);
			const index = allowList.findIndex(e => e.id === extensionKey);
			if (index === -1) {
				allowList.push({
					...extension,
					id: extensionKey
				});
			} else {
				allowList[index].allowed = extension.allowed;
				// Update name if provided and not already set to a proper name
				if (extension.name && extension.name !== extensionKey && allowList[index].name !== extension.name) {
					allowList[index].name = extension.name;
				}
			}
		}

		// Filter out trusted extensions before storing - they should only come from product.json, not user storage
		const userManagedExtensions = allowList.filter(extension => !extension.trusted);
		this._storageService.store(`${providerId}-${accountName}`, JSON.stringify(userManagedExtensions), StorageScope.APPLICATION, StorageTarget.USER);
		this._onDidChangeExtensionSessionAccess.fire({ providerId, accountName });
	}

	removeAllowedExtensions(providerId: string, accountName: string): void {
		this._storageService.remove(`${providerId}-${accountName}`, StorageScope.APPLICATION);
		this._onDidChangeExtensionSessionAccess.fire({ providerId, accountName });
	}
}

registerSingleton(IAuthenticationAccessService, AuthenticationAccessService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationExtensionsService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationExtensionsService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, dispose, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { scopesMatch } from '../../../../base/common/oauth.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IActivityService, NumberBadge } from '../../activity/common/activity.js';
import { IAuthenticationAccessService } from './authenticationAccessService.js';
import { IAuthenticationUsageService } from './authenticationUsageService.js';
import { AuthenticationSession, IAuthenticationProvider, IAuthenticationService, IAuthenticationExtensionsService, AuthenticationSessionAccount, IAuthenticationWwwAuthenticateRequest, isAuthenticationWwwAuthenticateRequest } from '../common/authentication.js';
import { Emitter } from '../../../../base/common/event.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { ExtensionIdentifier } from '../../../../platform/extensions/common/extensions.js';

// OAuth2 spec prohibits space in a scope, so use that to join them.
const SCOPESLIST_SEPARATOR = ' ';

interface SessionRequest {
	disposables: IDisposable[];
	requestingExtensionIds: string[];
}

interface SessionRequestInfo {
	[scopesList: string]: SessionRequest;
}

// TODO@TylerLeonhardt: This should all go in MainThreadAuthentication
export class AuthenticationExtensionsService extends Disposable implements IAuthenticationExtensionsService {
	declare readonly _serviceBrand: undefined;
	private _signInRequestItems = new Map<string, SessionRequestInfo>();
	private _sessionAccessRequestItems = new Map<string, { [extensionId: string]: { disposables: IDisposable[]; possibleSessions: AuthenticationSession[] } }>();
	private readonly _accountBadgeDisposable = this._register(new MutableDisposable());

	private _onDidAccountPreferenceChange: Emitter<{ providerId: string; extensionIds: string[] }> = this._register(new Emitter<{ providerId: string; extensionIds: string[] }>());
	readonly onDidChangeAccountPreference = this._onDidAccountPreferenceChange.event;

	private _inheritAuthAccountPreferenceParentToChildren: Record<string, string[]>;
	private _inheritAuthAccountPreferenceChildToParent: { [extensionId: string]: string };

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IStorageService private readonly storageService: IStorageService,
		@IDialogService private readonly dialogService: IDialogService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IProductService private readonly _productService: IProductService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IAuthenticationUsageService private readonly _authenticationUsageService: IAuthenticationUsageService,
		@IAuthenticationAccessService private readonly _authenticationAccessService: IAuthenticationAccessService
	) {
		super();
		this._inheritAuthAccountPreferenceParentToChildren = this._productService.inheritAuthAccountPreference || {};
		this._inheritAuthAccountPreferenceChildToParent = Object.entries(this._inheritAuthAccountPreferenceParentToChildren).reduce<{ [extensionId: string]: string }>((acc, [parent, children]) => {
			children.forEach((child: string) => {
				acc[child] = parent;
			});
			return acc;
		}, {});
		this.registerListeners();
	}

	private registerListeners() {
		this._register(this._authenticationService.onDidChangeSessions(e => {
			if (e.event.added?.length) {
				this.updateNewSessionRequests(e.providerId, e.event.added);
			}
			if (e.event.removed?.length) {
				this.updateAccessRequests(e.providerId, e.event.removed);
			}
		}));

		this._register(this._authenticationService.onDidUnregisterAuthenticationProvider(e => {
			const accessRequests = this._sessionAccessRequestItems.get(e.id) || {};
			Object.keys(accessRequests).forEach(extensionId => {
				this.removeAccessRequest(e.id, extensionId);
			});
		}));
	}

	updateNewSessionRequests(providerId: string, addedSessions: readonly AuthenticationSession[]): void {
		const existingRequestsForProvider = this._signInRequestItems.get(providerId);
		if (!existingRequestsForProvider) {
			return;
		}

		Object.keys(existingRequestsForProvider).forEach(requestedScopes => {
			// Parse the requested scopes from the stored key
			const requestedScopesArray = requestedScopes.split(SCOPESLIST_SEPARATOR);

			// Check if any added session has matching scopes (order-independent)
			if (addedSessions.some(session => scopesMatch(session.scopes, requestedScopesArray))) {
				const sessionRequest = existingRequestsForProvider[requestedScopes];
				sessionRequest?.disposables.forEach(item => item.dispose());

				delete existingRequestsForProvider[requestedScopes];
				if (Object.keys(existingRequestsForProvider).length === 0) {
					this._signInRequestItems.delete(providerId);
				} else {
					this._signInRequestItems.set(providerId, existingRequestsForProvider);
				}
				this.updateBadgeCount();
			}
		});
	}

	private updateAccessRequests(providerId: string, removedSessions: readonly AuthenticationSession[]): void {
		const providerRequests = this._sessionAccessRequestItems.get(providerId);
		if (providerRequests) {
			Object.keys(providerRequests).forEach(extensionId => {
				removedSessions.forEach(removed => {
					const indexOfSession = providerRequests[extensionId].possibleSessions.findIndex(session => session.id === removed.id);
					if (indexOfSession) {
						providerRequests[extensionId].possibleSessions.splice(indexOfSession, 1);
					}
				});

				if (!providerRequests[extensionId].possibleSessions.length) {
					this.removeAccessRequest(providerId, extensionId);
				}
			});
		}
	}

	private updateBadgeCount(): void {
		this._accountBadgeDisposable.clear();

		let numberOfRequests = 0;
		this._signInRequestItems.forEach(providerRequests => {
			Object.keys(providerRequests).forEach(request => {
				numberOfRequests += providerRequests[request].requestingExtensionIds.length;
			});
		});

		this._sessionAccessRequestItems.forEach(accessRequest => {
			numberOfRequests += Object.keys(accessRequest).length;
		});

		if (numberOfRequests > 0) {
			const badge = new NumberBadge(numberOfRequests, () => nls.localize('sign in', "Sign in requested"));
			this._accountBadgeDisposable.value = this.activityService.showAccountsActivity({ badge });
		}
	}

	private removeAccessRequest(providerId: string, extensionId: string): void {
		const providerRequests = this._sessionAccessRequestItems.get(providerId) || {};
		if (providerRequests[extensionId]) {
			dispose(providerRequests[extensionId].disposables);
			delete providerRequests[extensionId];
			this.updateBadgeCount();
		}
	}

	//#region Account/Session Preference

	updateAccountPreference(extensionId: string, providerId: string, account: AuthenticationSessionAccount): void {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		const parentExtensionId = this._inheritAuthAccountPreferenceChildToParent[realExtensionId] ?? realExtensionId;
		const key = this._getKey(parentExtensionId, providerId);

		// Store the preference in the workspace and application storage. This allows new workspaces to
		// have a preference set already to limit the number of prompts that are shown... but also allows
		// a specific workspace to override the global preference.
		this.storageService.store(key, account.label, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		this.storageService.store(key, account.label, StorageScope.APPLICATION, StorageTarget.MACHINE);

		const childrenExtensions = this._inheritAuthAccountPreferenceParentToChildren[parentExtensionId];
		const extensionIds = childrenExtensions ? [parentExtensionId, ...childrenExtensions] : [parentExtensionId];
		this._onDidAccountPreferenceChange.fire({ extensionIds, providerId });
	}

	getAccountPreference(extensionId: string, providerId: string): string | undefined {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		const key = this._getKey(this._inheritAuthAccountPreferenceChildToParent[realExtensionId] ?? realExtensionId, providerId);

		// If a preference is set in the workspace, use that. Otherwise, use the global preference.
		return this.storageService.get(key, StorageScope.WORKSPACE) ?? this.storageService.get(key, StorageScope.APPLICATION);
	}

	removeAccountPreference(extensionId: string, providerId: string): void {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		const key = this._getKey(this._inheritAuthAccountPreferenceChildToParent[realExtensionId] ?? realExtensionId, providerId);

		// This won't affect any other workspaces that have a preference set, but it will remove the preference
		// for this workspace and the global preference. This is only paired with a call to updateSessionPreference...
		// so we really don't _need_ to remove them as they are about to be overridden anyway... but it's more correct
		// to remove them first... and in case this gets called from somewhere else in the future.
		this.storageService.remove(key, StorageScope.WORKSPACE);
		this.storageService.remove(key, StorageScope.APPLICATION);
	}

	private _getKey(extensionId: string, providerId: string): string {
		return `${extensionId}-${providerId}`;
	}

	// TODO@TylerLeonhardt: Remove all of this after a couple iterations

	updateSessionPreference(providerId: string, extensionId: string, session: AuthenticationSession): void {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		// The 3 parts of this key are important:
		// * Extension id: The extension that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${realExtensionId}-${providerId}-${session.scopes.join(SCOPESLIST_SEPARATOR)}`;

		// Store the preference in the workspace and application storage. This allows new workspaces to
		// have a preference set already to limit the number of prompts that are shown... but also allows
		// a specific workspace to override the global preference.
		this.storageService.store(key, session.id, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		this.storageService.store(key, session.id, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	getSessionPreference(providerId: string, extensionId: string, scopes: string[]): string | undefined {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		// The 3 parts of this key are important:
		// * Extension id: The extension that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${realExtensionId}-${providerId}-${scopes.join(SCOPESLIST_SEPARATOR)}`;

		// If a preference is set in the workspace, use that. Otherwise, use the global preference.
		return this.storageService.get(key, StorageScope.WORKSPACE) ?? this.storageService.get(key, StorageScope.APPLICATION);
	}

	removeSessionPreference(providerId: string, extensionId: string, scopes: string[]): void {
		const realExtensionId = ExtensionIdentifier.toKey(extensionId);
		// The 3 parts of this key are important:
		// * Extension id: The extension that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${realExtensionId}-${providerId}-${scopes.join(SCOPESLIST_SEPARATOR)}`;

		// This won't affect any other workspaces that have a preference set, but it will remove the preference
		// for this workspace and the global preference. This is only paired with a call to updateSessionPreference...
		// so we really don't _need_ to remove them as they are about to be overridden anyway... but it's more correct
		// to remove them first... and in case this gets called from somewhere else in the future.
		this.storageService.remove(key, StorageScope.WORKSPACE);
		this.storageService.remove(key, StorageScope.APPLICATION);
	}

	private _updateAccountAndSessionPreferences(providerId: string, extensionId: string, session: AuthenticationSession): void {
		this.updateAccountPreference(extensionId, providerId, session.account);
		this.updateSessionPreference(providerId, extensionId, session);
	}

	//#endregion

	private async showGetSessionPrompt(provider: IAuthenticationProvider, accountName: string, extensionId: string, extensionName: string): Promise<boolean> {
		enum SessionPromptChoice {
			Allow = 0,
			Deny = 1,
			Cancel = 2
		}
		const { result } = await this.dialogService.prompt<SessionPromptChoice>({
			type: Severity.Info,
			message: nls.localize('confirmAuthenticationAccess', "The extension '{0}' wants to access the {1} account '{2}'.", extensionName, provider.label, accountName),
			buttons: [
				{
					label: nls.localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
					run: () => SessionPromptChoice.Allow
				},
				{
					label: nls.localize({ key: 'deny', comment: ['&& denotes a mnemonic'] }, "&&Deny"),
					run: () => SessionPromptChoice.Deny
				}
			],
			cancelButton: {
				run: () => SessionPromptChoice.Cancel
			}
		});

		if (result !== SessionPromptChoice.Cancel) {
			this._authenticationAccessService.updateAllowedExtensions(provider.id, accountName, [{ id: extensionId, name: extensionName, allowed: result === SessionPromptChoice.Allow }]);
			this.removeAccessRequest(provider.id, extensionId);
		}

		return result === SessionPromptChoice.Allow;
	}

	/**
	 * This function should be used only when there are sessions to disambiguate.
	 */
	async selectSession(providerId: string, extensionId: string, extensionName: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, availableSessions: AuthenticationSession[]): Promise<AuthenticationSession> {
		const allAccounts = await this._authenticationService.getAccounts(providerId);
		if (!allAccounts.length) {
			throw new Error('No accounts available');
		}
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick<{ label: string; session?: AuthenticationSession; account?: AuthenticationSessionAccount }>());
		quickPick.ignoreFocusOut = true;
		const accountsWithSessions = new Set<string>();
		const items: { label: string; session?: AuthenticationSession; account?: AuthenticationSessionAccount }[] = availableSessions
			// Only grab the first account
			.filter(session => !accountsWithSessions.has(session.account.label) && accountsWithSessions.add(session.account.label))
			.map(session => {
				return {
					label: session.account.label,
					session: session
				};
			});

		// Add the additional accounts that have been logged into the provider but are
		// don't have a session yet.
		allAccounts.forEach(account => {
			if (!accountsWithSessions.has(account.label)) {
				items.push({ label: account.label, account });
			}
		});
		items.push({ label: nls.localize('useOtherAccount', "Sign in to another account") });
		quickPick.items = items;
		quickPick.title = nls.localize(
			{
				key: 'selectAccount',
				comment: ['The placeholder {0} is the name of an extension. {1} is the name of the type of account, such as Microsoft or GitHub.']
			},
			"The extension '{0}' wants to access a {1} account",
			extensionName,
			this._authenticationService.getProvider(providerId).label
		);
		quickPick.placeholder = nls.localize('getSessionPlateholder', "Select an account for '{0}' to use or Esc to cancel", extensionName);

		return await new Promise((resolve, reject) => {
			disposables.add(quickPick.onDidAccept(async _ => {
				quickPick.dispose();
				let session = quickPick.selectedItems[0].session;
				if (!session) {
					const account = quickPick.selectedItems[0].account;
					try {
						session = await this._authenticationService.createSession(providerId, scopeListOrRequest, { account });
					} catch (e) {
						reject(e);
						return;
					}
				}
				const accountName = session.account.label;

				this._authenticationAccessService.updateAllowedExtensions(providerId, accountName, [{ id: extensionId, name: extensionName, allowed: true }]);
				this._updateAccountAndSessionPreferences(providerId, extensionId, session);
				this.removeAccessRequest(providerId, extensionId);

				resolve(session);
			}));

			disposables.add(quickPick.onDidHide(_ => {
				if (!quickPick.selectedItems[0]) {
					reject('User did not consent to account access');
				}
				disposables.dispose();
			}));

			quickPick.show();
		});
	}

	private async completeSessionAccessRequest(provider: IAuthenticationProvider, extensionId: string, extensionName: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest): Promise<void> {
		const providerRequests = this._sessionAccessRequestItems.get(provider.id) || {};
		const existingRequest = providerRequests[extensionId];
		if (!existingRequest) {
			return;
		}

		if (!provider) {
			return;
		}
		const possibleSessions = existingRequest.possibleSessions;

		let session: AuthenticationSession | undefined;
		if (provider.supportsMultipleAccounts) {
			try {
				session = await this.selectSession(provider.id, extensionId, extensionName, scopeListOrRequest, possibleSessions);
			} catch (_) {
				// ignore cancel
			}
		} else {
			const approved = await this.showGetSessionPrompt(provider, possibleSessions[0].account.label, extensionId, extensionName);
			if (approved) {
				session = possibleSessions[0];
			}
		}

		if (session) {
			this._authenticationUsageService.addAccountUsage(provider.id, session.account.label, session.scopes, extensionId, extensionName);
		}
	}

	requestSessionAccess(providerId: string, extensionId: string, extensionName: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, possibleSessions: AuthenticationSession[]): void {
		const providerRequests = this._sessionAccessRequestItems.get(providerId) || {};
		const hasExistingRequest = providerRequests[extensionId];
		if (hasExistingRequest) {
			return;
		}

		const provider = this._authenticationService.getProvider(providerId);
		const menuItem = MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '3_accessRequests',
			command: {
				id: `${providerId}${extensionId}Access`,
				title: nls.localize({
					key: 'accessRequest',
					comment: [`The placeholder {0} will be replaced with an authentication provider''s label. {1} will be replaced with an extension name. (1) is to indicate that this menu item contributes to a badge count`]
				},
					"Grant access to {0} for {1}... (1)",
					provider.label,
					extensionName)
			}
		});

		const accessCommand = CommandsRegistry.registerCommand({
			id: `${providerId}${extensionId}Access`,
			handler: async (accessor) => {
				this.completeSessionAccessRequest(provider, extensionId, extensionName, scopeListOrRequest);
			}
		});

		providerRequests[extensionId] = { possibleSessions, disposables: [menuItem, accessCommand] };
		this._sessionAccessRequestItems.set(providerId, providerRequests);
		this.updateBadgeCount();
	}

	async requestNewSession(providerId: string, scopeListOrRequest: ReadonlyArray<string> | IAuthenticationWwwAuthenticateRequest, extensionId: string, extensionName: string): Promise<void> {
		if (!this._authenticationService.isAuthenticationProviderRegistered(providerId)) {
			// Activate has already been called for the authentication provider, but it cannot block on registering itself
			// since this is sync and returns a disposable. So, wait for registration event to fire that indicates the
			// provider is now in the map.
			await new Promise<void>((resolve, _) => {
				const dispose = this._authenticationService.onDidRegisterAuthenticationProvider(e => {
					if (e.id === providerId) {
						dispose.dispose();
						resolve();
					}
				});
			});
		}

		let provider: IAuthenticationProvider;
		try {
			provider = this._authenticationService.getProvider(providerId);
		} catch (_e) {
			return;
		}

		const providerRequests = this._signInRequestItems.get(providerId);
		const signInRequestKey = isAuthenticationWwwAuthenticateRequest(scopeListOrRequest)
			? `${scopeListOrRequest.wwwAuthenticate}:${scopeListOrRequest.fallbackScopes?.join(SCOPESLIST_SEPARATOR) ?? ''}`
			: `${scopeListOrRequest.join(SCOPESLIST_SEPARATOR)}`;
		const extensionHasExistingRequest = providerRequests
			&& providerRequests[signInRequestKey]
			&& providerRequests[signInRequestKey].requestingExtensionIds.includes(extensionId);

		if (extensionHasExistingRequest) {
			return;
		}

		// Construct a commandId that won't clash with others generated here, nor likely with an extension's command
		const commandId = `${providerId}:${extensionId}:signIn${Object.keys(providerRequests || []).length}`;
		const menuItem = MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '2_signInRequests',
			command: {
				id: commandId,
				title: nls.localize({
					key: 'signInRequest',
					comment: [`The placeholder {0} will be replaced with an authentication provider's label. {1} will be replaced with an extension name. (1) is to indicate that this menu item contributes to a badge count.`]
				},
					"Sign in with {0} to use {1} (1)",
					provider.label,
					extensionName)
			}
		});

		const signInCommand = CommandsRegistry.registerCommand({
			id: commandId,
			handler: async (accessor) => {
				const authenticationService = accessor.get(IAuthenticationService);
				const session = await authenticationService.createSession(providerId, scopeListOrRequest);

				this._authenticationAccessService.updateAllowedExtensions(providerId, session.account.label, [{ id: extensionId, name: extensionName, allowed: true }]);
				this._updateAccountAndSessionPreferences(providerId, extensionId, session);
			}
		});


		if (providerRequests) {
			const existingRequest = providerRequests[signInRequestKey] || { disposables: [], requestingExtensionIds: [] };

			providerRequests[signInRequestKey] = {
				disposables: [...existingRequest.disposables, menuItem, signInCommand],
				requestingExtensionIds: [...existingRequest.requestingExtensionIds, extensionId]
			};
			this._signInRequestItems.set(providerId, providerRequests);
		} else {
			this._signInRequestItems.set(providerId, {
				[signInRequestKey]: {
					disposables: [menuItem, signInCommand],
					requestingExtensionIds: [extensionId]
				}
			});
		}

		this.updateBadgeCount();
	}
}

registerSingleton(IAuthenticationExtensionsService, AuthenticationExtensionsService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationMcpAccessService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationMcpAccessService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Emitter, Event } from '../../../../base/common/event.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';

export interface AllowedMcpServer {
	id: string;
	name: string;
	/**
	 * If true or undefined, the extension is allowed to use the account
	 * If false, the extension is not allowed to use the account
	 * TODO: undefined shouldn't be a valid value, but it is for now
	 */
	allowed?: boolean;
	lastUsed?: number;
	// If true, this comes from the product.json
	trusted?: boolean;
}

export const IAuthenticationMcpAccessService = createDecorator<IAuthenticationMcpAccessService>('IAuthenticationMcpAccessService');
export interface IAuthenticationMcpAccessService {
	readonly _serviceBrand: undefined;

	readonly onDidChangeMcpSessionAccess: Event<{ providerId: string; accountName: string }>;

	/**
	 * Check MCP server access to an account
	 * @param providerId The id of the authentication provider
	 * @param accountName The account name that access is checked for
	 * @param mcpServerId The id of the MCP server requesting access
	 * @returns Returns true or false if the user has opted to permanently grant or disallow access, and undefined
	 * if they haven't made a choice yet
	 */
	isAccessAllowed(providerId: string, accountName: string, mcpServerId: string): boolean | undefined;
	readAllowedMcpServers(providerId: string, accountName: string): AllowedMcpServer[];
	updateAllowedMcpServers(providerId: string, accountName: string, mcpServers: AllowedMcpServer[]): void;
	removeAllowedMcpServers(providerId: string, accountName: string): void;
}

// TODO@TylerLeonhardt: Should this class only keep track of allowed things and throw away disallowed ones?
export class AuthenticationMcpAccessService extends Disposable implements IAuthenticationMcpAccessService {
	_serviceBrand: undefined;

	private _onDidChangeMcpSessionAccess: Emitter<{ providerId: string; accountName: string }> = this._register(new Emitter<{ providerId: string; accountName: string }>());
	readonly onDidChangeMcpSessionAccess: Event<{ providerId: string; accountName: string }> = this._onDidChangeMcpSessionAccess.event;

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
		@IProductService private readonly _productService: IProductService
	) {
		super();
	}

	isAccessAllowed(providerId: string, accountName: string, mcpServerId: string): boolean | undefined {
		const trustedMCPServerAuthAccess = this._productService.trustedMcpAuthAccess;
		if (Array.isArray(trustedMCPServerAuthAccess)) {
			if (trustedMCPServerAuthAccess.includes(mcpServerId)) {
				return true;
			}
		} else if (trustedMCPServerAuthAccess?.[providerId]?.includes(mcpServerId)) {
			return true;
		}

		const allowList = this.readAllowedMcpServers(providerId, accountName);
		const mcpServerData = allowList.find(mcpServer => mcpServer.id === mcpServerId);
		if (!mcpServerData) {
			return undefined;
		}
		// This property didn't exist on this data previously, inclusion in the list at all indicates allowance
		return mcpServerData.allowed !== undefined
			? mcpServerData.allowed
			: true;
	}

	readAllowedMcpServers(providerId: string, accountName: string): AllowedMcpServer[] {
		let trustedMCPServers: AllowedMcpServer[] = [];
		try {
			const trustedMCPServerSrc = this._storageService.get(`mcpserver-${providerId}-${accountName}`, StorageScope.APPLICATION);
			if (trustedMCPServerSrc) {
				trustedMCPServers = JSON.parse(trustedMCPServerSrc);
			}
		} catch (err) { }

		// Add trusted MCP servers from product.json if they're not already in the list
		const trustedMcpServerAuthAccess = this._productService.trustedMcpAuthAccess;
		const trustedMcpServerIds =
			// Case 1: trustedMcpServerAuthAccess is an array
			Array.isArray(trustedMcpServerAuthAccess)
				? trustedMcpServerAuthAccess
				// Case 2: trustedMcpServerAuthAccess is an object
				: typeof trustedMcpServerAuthAccess === 'object'
					? trustedMcpServerAuthAccess[providerId] ?? []
					: [];

		for (const mcpServerId of trustedMcpServerIds) {
			const existingServer = trustedMCPServers.find(server => server.id === mcpServerId);
			if (!existingServer) {
				// Add new trusted server (name will be set by caller if they have server info)
				trustedMCPServers.push({
					id: mcpServerId,
					name: mcpServerId, // Default to ID, caller can update with proper name
					allowed: true,
					trusted: true
				});
			} else {
				// Update existing server to be trusted
				existingServer.allowed = true;
				existingServer.trusted = true;
			}
		}

		return trustedMCPServers;
	}

	updateAllowedMcpServers(providerId: string, accountName: string, mcpServers: AllowedMcpServer[]): void {
		const allowList = this.readAllowedMcpServers(providerId, accountName);
		for (const mcpServer of mcpServers) {
			const index = allowList.findIndex(e => e.id === mcpServer.id);
			if (index === -1) {
				allowList.push(mcpServer);
			} else {
				allowList[index].allowed = mcpServer.allowed;
				// Update name if provided and not already set to a proper name
				if (mcpServer.name && mcpServer.name !== mcpServer.id && allowList[index].name !== mcpServer.name) {
					allowList[index].name = mcpServer.name;
				}
			}
		}

		// Filter out trusted servers before storing - they should only come from product.json, not user storage
		const userManagedServers = allowList.filter(server => !server.trusted);
		this._storageService.store(`mcpserver-${providerId}-${accountName}`, JSON.stringify(userManagedServers), StorageScope.APPLICATION, StorageTarget.USER);
		this._onDidChangeMcpSessionAccess.fire({ providerId, accountName });
	}

	removeAllowedMcpServers(providerId: string, accountName: string): void {
		this._storageService.remove(`mcpserver-${providerId}-${accountName}`, StorageScope.APPLICATION);
		this._onDidChangeMcpSessionAccess.fire({ providerId, accountName });
	}
}

registerSingleton(IAuthenticationMcpAccessService, AuthenticationMcpAccessService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationMcpService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationMcpService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable, DisposableStore, dispose, IDisposable, MutableDisposable } from '../../../../base/common/lifecycle.js';
import { scopesMatch } from '../../../../base/common/oauth.js';
import * as nls from '../../../../nls.js';
import { MenuId, MenuRegistry } from '../../../../platform/actions/common/actions.js';
import { CommandsRegistry } from '../../../../platform/commands/common/commands.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { Severity } from '../../../../platform/notification/common/notification.js';
import { IQuickInputService } from '../../../../platform/quickinput/common/quickInput.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IActivityService, NumberBadge } from '../../activity/common/activity.js';
import { IAuthenticationMcpAccessService } from './authenticationMcpAccessService.js';
import { IAuthenticationMcpUsageService } from './authenticationMcpUsageService.js';
import { AuthenticationSession, IAuthenticationProvider, IAuthenticationService, AuthenticationSessionAccount } from '../common/authentication.js';
import { Emitter, Event } from '../../../../base/common/event.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';

// OAuth2 spec prohibits space in a scope, so use that to join them.
const SCOPESLIST_SEPARATOR = ' ';

interface SessionRequest {
	disposables: IDisposable[];
	requestingMcpServerIds: string[];
}

interface SessionRequestInfo {
	[scopesList: string]: SessionRequest;
}

// TODO: Move this into MainThreadAuthentication
export const IAuthenticationMcpService = createDecorator<IAuthenticationMcpService>('IAuthenticationMcpService');
export interface IAuthenticationMcpService {
	readonly _serviceBrand: undefined;

	/**
	 * Fires when an account preference for a specific provider has changed for the specified MCP servers. Does not fire when:
	 * * An account preference is removed
	 * * A session preference is changed (because it's deprecated)
	 * * A session preference is removed (because it's deprecated)
	 */
	readonly onDidChangeAccountPreference: Event<{ mcpServerIds: string[]; providerId: string }>;
	/**
	 * Returns the accountName (also known as account.label) to pair with `IAuthenticationMCPServerAccessService` to get the account preference
	 * @param providerId The authentication provider id
	 * @param mcpServerId The MCP server id to get the preference for
	 * @returns The accountName of the preference, or undefined if there is no preference set
	 */
	getAccountPreference(mcpServerId: string, providerId: string): string | undefined;
	/**
	 * Sets the account preference for the given provider and MCP server
	 * @param providerId The authentication provider id
	 * @param mcpServerId The MCP server id to set the preference for
	 * @param account The account to set the preference to
	 */
	updateAccountPreference(mcpServerId: string, providerId: string, account: AuthenticationSessionAccount): void;
	/**
	 * Removes the account preference for the given provider and MCP server
	 * @param providerId The authentication provider id
	 * @param mcpServerId The MCP server id to remove the preference for
	 */
	removeAccountPreference(mcpServerId: string, providerId: string): void;
	/**
	 * @deprecated Sets the session preference for the given provider and MCP server
	 * @param providerId
	 * @param mcpServerId
	 * @param session
	 */
	updateSessionPreference(providerId: string, mcpServerId: string, session: AuthenticationSession): void;
	/**
	 * @deprecated Gets the session preference for the given provider and MCP server
	 * @param providerId
	 * @param mcpServerId
	 * @param scopes
	 */
	getSessionPreference(providerId: string, mcpServerId: string, scopes: string[]): string | undefined;
	/**
	 * @deprecated Removes the session preference for the given provider and MCP server
	 * @param providerId
	 * @param mcpServerId
	 * @param scopes
	 */
	removeSessionPreference(providerId: string, mcpServerId: string, scopes: string[]): void;
	selectSession(providerId: string, mcpServerId: string, mcpServerName: string, scopes: string[], possibleSessions: readonly AuthenticationSession[]): Promise<AuthenticationSession>;
	requestSessionAccess(providerId: string, mcpServerId: string, mcpServerName: string, scopes: string[], possibleSessions: readonly AuthenticationSession[]): void;
	requestNewSession(providerId: string, scopes: string[], mcpServerId: string, mcpServerName: string): Promise<void>;
}

// TODO@TylerLeonhardt: This should all go in MainThreadAuthentication
export class AuthenticationMcpService extends Disposable implements IAuthenticationMcpService {
	declare readonly _serviceBrand: undefined;
	private _signInRequestItems = new Map<string, SessionRequestInfo>();
	private _sessionAccessRequestItems = new Map<string, { [mcpServerId: string]: { disposables: IDisposable[]; possibleSessions: AuthenticationSession[] } }>();
	private readonly _accountBadgeDisposable = this._register(new MutableDisposable());

	private _onDidAccountPreferenceChange: Emitter<{ providerId: string; mcpServerIds: string[] }> = this._register(new Emitter<{ providerId: string; mcpServerIds: string[] }>());
	readonly onDidChangeAccountPreference = this._onDidAccountPreferenceChange.event;

	private _inheritAuthAccountPreferenceParentToChildren: Record<string, string[]>;
	private _inheritAuthAccountPreferenceChildToParent: { [mcpServerId: string]: string };

	constructor(
		@IActivityService private readonly activityService: IActivityService,
		@IStorageService private readonly storageService: IStorageService,
		@IDialogService private readonly dialogService: IDialogService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IProductService private readonly _productService: IProductService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@IAuthenticationMcpUsageService private readonly _authenticationUsageService: IAuthenticationMcpUsageService,
		@IAuthenticationMcpAccessService private readonly _authenticationAccessService: IAuthenticationMcpAccessService
	) {
		super();
		this._inheritAuthAccountPreferenceParentToChildren = this._productService.inheritAuthAccountPreference || {};
		this._inheritAuthAccountPreferenceChildToParent = Object.entries(this._inheritAuthAccountPreferenceParentToChildren).reduce<{ [mcpServerId: string]: string }>((acc, [parent, children]) => {
			children.forEach((child: string) => {
				acc[child] = parent;
			});
			return acc;
		}, {});
		this.registerListeners();
	}

	private registerListeners() {
		this._register(this._authenticationService.onDidChangeSessions(async e => {
			if (e.event.added?.length) {
				await this.updateNewSessionRequests(e.providerId, e.event.added);
			}
			if (e.event.removed?.length) {
				await this.updateAccessRequests(e.providerId, e.event.removed);
			}
			this.updateBadgeCount();
		}));

		this._register(this._authenticationService.onDidUnregisterAuthenticationProvider(e => {
			const accessRequests = this._sessionAccessRequestItems.get(e.id) || {};
			Object.keys(accessRequests).forEach(mcpServerId => {
				this.removeAccessRequest(e.id, mcpServerId);
			});
		}));
	}

	private async updateNewSessionRequests(providerId: string, addedSessions: readonly AuthenticationSession[]): Promise<void> {
		const existingRequestsForProvider = this._signInRequestItems.get(providerId);
		if (!existingRequestsForProvider) {
			return;
		}

		Object.keys(existingRequestsForProvider).forEach(requestedScopes => {
			// Parse the requested scopes from the stored key
			const requestedScopesArray = requestedScopes.split(SCOPESLIST_SEPARATOR);

			// Check if any added session has matching scopes (order-independent)
			if (addedSessions.some(session => scopesMatch(session.scopes, requestedScopesArray))) {
				const sessionRequest = existingRequestsForProvider[requestedScopes];
				sessionRequest?.disposables.forEach(item => item.dispose());

				delete existingRequestsForProvider[requestedScopes];
				if (Object.keys(existingRequestsForProvider).length === 0) {
					this._signInRequestItems.delete(providerId);
				} else {
					this._signInRequestItems.set(providerId, existingRequestsForProvider);
				}
			}
		});
	}

	private async updateAccessRequests(providerId: string, removedSessions: readonly AuthenticationSession[]) {
		const providerRequests = this._sessionAccessRequestItems.get(providerId);
		if (providerRequests) {
			Object.keys(providerRequests).forEach(mcpServerId => {
				removedSessions.forEach(removed => {
					const indexOfSession = providerRequests[mcpServerId].possibleSessions.findIndex(session => session.id === removed.id);
					if (indexOfSession) {
						providerRequests[mcpServerId].possibleSessions.splice(indexOfSession, 1);
					}
				});

				if (!providerRequests[mcpServerId].possibleSessions.length) {
					this.removeAccessRequest(providerId, mcpServerId);
				}
			});
		}
	}

	private updateBadgeCount(): void {
		this._accountBadgeDisposable.clear();

		let numberOfRequests = 0;
		this._signInRequestItems.forEach(providerRequests => {
			Object.keys(providerRequests).forEach(request => {
				numberOfRequests += providerRequests[request].requestingMcpServerIds.length;
			});
		});

		this._sessionAccessRequestItems.forEach(accessRequest => {
			numberOfRequests += Object.keys(accessRequest).length;
		});

		if (numberOfRequests > 0) {
			const badge = new NumberBadge(numberOfRequests, () => nls.localize('sign in', "Sign in requested"));
			this._accountBadgeDisposable.value = this.activityService.showAccountsActivity({ badge });
		}
	}

	private removeAccessRequest(providerId: string, mcpServerId: string): void {
		const providerRequests = this._sessionAccessRequestItems.get(providerId) || {};
		if (providerRequests[mcpServerId]) {
			dispose(providerRequests[mcpServerId].disposables);
			delete providerRequests[mcpServerId];
			this.updateBadgeCount();
		}
	}

	//#region Account/Session Preference

	updateAccountPreference(mcpServerId: string, providerId: string, account: AuthenticationSessionAccount): void {
		const parentMcpServerId = this._inheritAuthAccountPreferenceChildToParent[mcpServerId] ?? mcpServerId;
		const key = this._getKey(parentMcpServerId, providerId);

		// Store the preference in the workspace and application storage. This allows new workspaces to
		// have a preference set already to limit the number of prompts that are shown... but also allows
		// a specific workspace to override the global preference.
		this.storageService.store(key, account.label, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		this.storageService.store(key, account.label, StorageScope.APPLICATION, StorageTarget.MACHINE);

		const childrenMcpServers = this._inheritAuthAccountPreferenceParentToChildren[parentMcpServerId];
		const mcpServerIds = childrenMcpServers ? [parentMcpServerId, ...childrenMcpServers] : [parentMcpServerId];
		this._onDidAccountPreferenceChange.fire({ mcpServerIds, providerId });
	}

	getAccountPreference(mcpServerId: string, providerId: string): string | undefined {
		const key = this._getKey(this._inheritAuthAccountPreferenceChildToParent[mcpServerId] ?? mcpServerId, providerId);

		// If a preference is set in the workspace, use that. Otherwise, use the global preference.
		return this.storageService.get(key, StorageScope.WORKSPACE) ?? this.storageService.get(key, StorageScope.APPLICATION);
	}

	removeAccountPreference(mcpServerId: string, providerId: string): void {
		const key = this._getKey(this._inheritAuthAccountPreferenceChildToParent[mcpServerId] ?? mcpServerId, providerId);

		// This won't affect any other workspaces that have a preference set, but it will remove the preference
		// for this workspace and the global preference. This is only paired with a call to updateSessionPreference...
		// so we really don't _need_ to remove them as they are about to be overridden anyway... but it's more correct
		// to remove them first... and in case this gets called from somewhere else in the future.
		this.storageService.remove(key, StorageScope.WORKSPACE);
		this.storageService.remove(key, StorageScope.APPLICATION);
	}

	private _getKey(mcpServerId: string, providerId: string): string {
		return `${mcpServerId}-${providerId}`;
	}

	// TODO@TylerLeonhardt: Remove all of this after a couple iterations

	updateSessionPreference(providerId: string, mcpServerId: string, session: AuthenticationSession): void {
		// The 3 parts of this key are important:
		// * MCP server id: The MCP server that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${mcpServerId}-${providerId}-${session.scopes.join(SCOPESLIST_SEPARATOR)}`;

		// Store the preference in the workspace and application storage. This allows new workspaces to
		// have a preference set already to limit the number of prompts that are shown... but also allows
		// a specific workspace to override the global preference.
		this.storageService.store(key, session.id, StorageScope.WORKSPACE, StorageTarget.MACHINE);
		this.storageService.store(key, session.id, StorageScope.APPLICATION, StorageTarget.MACHINE);
	}

	getSessionPreference(providerId: string, mcpServerId: string, scopes: string[]): string | undefined {
		// The 3 parts of this key are important:
		// * MCP server id: The MCP server that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${mcpServerId}-${providerId}-${scopes.join(SCOPESLIST_SEPARATOR)}`;

		// If a preference is set in the workspace, use that. Otherwise, use the global preference.
		return this.storageService.get(key, StorageScope.WORKSPACE) ?? this.storageService.get(key, StorageScope.APPLICATION);
	}

	removeSessionPreference(providerId: string, mcpServerId: string, scopes: string[]): void {
		// The 3 parts of this key are important:
		// * MCP server id: The MCP server that has a preference
		// * Provider id: The provider that the preference is for
		// * The scopes: The subset of sessions that the preference applies to
		const key = `${mcpServerId}-${providerId}-${scopes.join(SCOPESLIST_SEPARATOR)}`;

		// This won't affect any other workspaces that have a preference set, but it will remove the preference
		// for this workspace and the global preference. This is only paired with a call to updateSessionPreference...
		// so we really don't _need_ to remove them as they are about to be overridden anyway... but it's more correct
		// to remove them first... and in case this gets called from somewhere else in the future.
		this.storageService.remove(key, StorageScope.WORKSPACE);
		this.storageService.remove(key, StorageScope.APPLICATION);
	}

	private _updateAccountAndSessionPreferences(providerId: string, mcpServerId: string, session: AuthenticationSession): void {
		this.updateAccountPreference(mcpServerId, providerId, session.account);
		this.updateSessionPreference(providerId, mcpServerId, session);
	}

	//#endregion

	private async showGetSessionPrompt(provider: IAuthenticationProvider, accountName: string, mcpServerId: string, mcpServerName: string): Promise<boolean> {
		enum SessionPromptChoice {
			Allow = 0,
			Deny = 1,
			Cancel = 2
		}
		const { result } = await this.dialogService.prompt<SessionPromptChoice>({
			type: Severity.Info,
			message: nls.localize('confirmAuthenticationAccess', "The MCP server '{0}' wants to access the {1} account '{2}'.", mcpServerName, provider.label, accountName),
			buttons: [
				{
					label: nls.localize({ key: 'allow', comment: ['&& denotes a mnemonic'] }, "&&Allow"),
					run: () => SessionPromptChoice.Allow
				},
				{
					label: nls.localize({ key: 'deny', comment: ['&& denotes a mnemonic'] }, "&&Deny"),
					run: () => SessionPromptChoice.Deny
				}
			],
			cancelButton: {
				run: () => SessionPromptChoice.Cancel
			}
		});

		if (result !== SessionPromptChoice.Cancel) {
			this._authenticationAccessService.updateAllowedMcpServers(provider.id, accountName, [{ id: mcpServerId, name: mcpServerName, allowed: result === SessionPromptChoice.Allow }]);
			this.removeAccessRequest(provider.id, mcpServerId);
		}

		return result === SessionPromptChoice.Allow;
	}

	/**
	 * This function should be used only when there are sessions to disambiguate.
	 */
	async selectSession(providerId: string, mcpServerId: string, mcpServerName: string, scopes: string[], availableSessions: AuthenticationSession[]): Promise<AuthenticationSession> {
		const allAccounts = await this._authenticationService.getAccounts(providerId);
		if (!allAccounts.length) {
			throw new Error('No accounts available');
		}
		const disposables = new DisposableStore();
		const quickPick = disposables.add(this.quickInputService.createQuickPick<{ label: string; session?: AuthenticationSession; account?: AuthenticationSessionAccount }>());
		quickPick.ignoreFocusOut = true;
		const accountsWithSessions = new Set<string>();
		const items: { label: string; session?: AuthenticationSession; account?: AuthenticationSessionAccount }[] = availableSessions
			// Only grab the first account
			.filter(session => !accountsWithSessions.has(session.account.label) && accountsWithSessions.add(session.account.label))
			.map(session => {
				return {
					label: session.account.label,
					session: session
				};
			});

		// Add the additional accounts that have been logged into the provider but are
		// don't have a session yet.
		allAccounts.forEach(account => {
			if (!accountsWithSessions.has(account.label)) {
				items.push({ label: account.label, account });
			}
		});
		items.push({ label: nls.localize('useOtherAccount', "Sign in to another account") });
		quickPick.items = items;
		quickPick.title = nls.localize(
			{
				key: 'selectAccount',
				comment: ['The placeholder {0} is the name of a MCP server. {1} is the name of the type of account, such as Microsoft or GitHub.']
			},
			"The MCP server '{0}' wants to access a {1} account",
			mcpServerName,
			this._authenticationService.getProvider(providerId).label
		);
		quickPick.placeholder = nls.localize('getSessionPlateholder', "Select an account for '{0}' to use or Esc to cancel", mcpServerName);

		return await new Promise((resolve, reject) => {
			disposables.add(quickPick.onDidAccept(async _ => {
				quickPick.dispose();
				let session = quickPick.selectedItems[0].session;
				if (!session) {
					const account = quickPick.selectedItems[0].account;
					try {
						session = await this._authenticationService.createSession(providerId, scopes, { account });
					} catch (e) {
						reject(e);
						return;
					}
				}
				const accountName = session.account.label;

				this._authenticationAccessService.updateAllowedMcpServers(providerId, accountName, [{ id: mcpServerId, name: mcpServerName, allowed: true }]);
				this._updateAccountAndSessionPreferences(providerId, mcpServerId, session);
				this.removeAccessRequest(providerId, mcpServerId);

				resolve(session);
			}));

			disposables.add(quickPick.onDidHide(_ => {
				if (!quickPick.selectedItems[0]) {
					reject('User did not consent to account access');
				}
				disposables.dispose();
			}));

			quickPick.show();
		});
	}

	private async completeSessionAccessRequest(provider: IAuthenticationProvider, mcpServerId: string, mcpServerName: string, scopes: string[]): Promise<void> {
		const providerRequests = this._sessionAccessRequestItems.get(provider.id) || {};
		const existingRequest = providerRequests[mcpServerId];
		if (!existingRequest) {
			return;
		}

		if (!provider) {
			return;
		}
		const possibleSessions = existingRequest.possibleSessions;

		let session: AuthenticationSession | undefined;
		if (provider.supportsMultipleAccounts) {
			try {
				session = await this.selectSession(provider.id, mcpServerId, mcpServerName, scopes, possibleSessions);
			} catch (_) {
				// ignore cancel
			}
		} else {
			const approved = await this.showGetSessionPrompt(provider, possibleSessions[0].account.label, mcpServerId, mcpServerName);
			if (approved) {
				session = possibleSessions[0];
			}
		}

		if (session) {
			this._authenticationUsageService.addAccountUsage(provider.id, session.account.label, session.scopes, mcpServerId, mcpServerName);
		}
	}

	requestSessionAccess(providerId: string, mcpServerId: string, mcpServerName: string, scopes: string[], possibleSessions: AuthenticationSession[]): void {
		const providerRequests = this._sessionAccessRequestItems.get(providerId) || {};
		const hasExistingRequest = providerRequests[mcpServerId];
		if (hasExistingRequest) {
			return;
		}

		const provider = this._authenticationService.getProvider(providerId);
		const menuItem = MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '3_accessRequests',
			command: {
				id: `${providerId}${mcpServerId}Access`,
				title: nls.localize({
					key: 'accessRequest',
					comment: [`The placeholder {0} will be replaced with an authentication provider''s label. {1} will be replaced with a MCP server name. (1) is to indicate that this menu item contributes to a badge count`]
				},
					"Grant access to {0} for {1}... (1)",
					provider.label,
					mcpServerName)
			}
		});

		const accessCommand = CommandsRegistry.registerCommand({
			id: `${providerId}${mcpServerId}Access`,
			handler: async (accessor) => {
				this.completeSessionAccessRequest(provider, mcpServerId, mcpServerName, scopes);
			}
		});

		providerRequests[mcpServerId] = { possibleSessions, disposables: [menuItem, accessCommand] };
		this._sessionAccessRequestItems.set(providerId, providerRequests);
		this.updateBadgeCount();
	}

	async requestNewSession(providerId: string, scopes: string[], mcpServerId: string, mcpServerName: string): Promise<void> {
		if (!this._authenticationService.isAuthenticationProviderRegistered(providerId)) {
			// Activate has already been called for the authentication provider, but it cannot block on registering itself
			// since this is sync and returns a disposable. So, wait for registration event to fire that indicates the
			// provider is now in the map.
			await new Promise<void>((resolve, _) => {
				const dispose = this._authenticationService.onDidRegisterAuthenticationProvider(e => {
					if (e.id === providerId) {
						dispose.dispose();
						resolve();
					}
				});
			});
		}

		let provider: IAuthenticationProvider;
		try {
			provider = this._authenticationService.getProvider(providerId);
		} catch (_e) {
			return;
		}

		const providerRequests = this._signInRequestItems.get(providerId);
		const scopesList = scopes.join(SCOPESLIST_SEPARATOR);
		const mcpServerHasExistingRequest = providerRequests
			&& providerRequests[scopesList]
			&& providerRequests[scopesList].requestingMcpServerIds.includes(mcpServerId);

		if (mcpServerHasExistingRequest) {
			return;
		}

		// Construct a commandId that won't clash with others generated here, nor likely with an MCP server's command
		const commandId = `${providerId}:${mcpServerId}:signIn${Object.keys(providerRequests || []).length}`;
		const menuItem = MenuRegistry.appendMenuItem(MenuId.AccountsContext, {
			group: '2_signInRequests',
			command: {
				id: commandId,
				title: nls.localize({
					key: 'signInRequest',
					comment: [`The placeholder {0} will be replaced with an authentication provider's label. {1} will be replaced with a MCP server name. (1) is to indicate that this menu item contributes to a badge count.`]
				},
					"Sign in with {0} to use {1} (1)",
					provider.label,
					mcpServerName)
			}
		});

		const signInCommand = CommandsRegistry.registerCommand({
			id: commandId,
			handler: async (accessor) => {
				const authenticationService = accessor.get(IAuthenticationService);
				const session = await authenticationService.createSession(providerId, scopes);

				this._authenticationAccessService.updateAllowedMcpServers(providerId, session.account.label, [{ id: mcpServerId, name: mcpServerName, allowed: true }]);
				this._updateAccountAndSessionPreferences(providerId, mcpServerId, session);
			}
		});


		if (providerRequests) {
			const existingRequest = providerRequests[scopesList] || { disposables: [], requestingMcpServerIds: [] };

			providerRequests[scopesList] = {
				disposables: [...existingRequest.disposables, menuItem, signInCommand],
				requestingMcpServerIds: [...existingRequest.requestingMcpServerIds, mcpServerId]
			};
			this._signInRequestItems.set(providerId, providerRequests);
		} else {
			this._signInRequestItems.set(providerId, {
				[scopesList]: {
					disposables: [menuItem, signInCommand],
					requestingMcpServerIds: [mcpServerId]
				}
			});
		}

		this.updateBadgeCount();
	}
}

registerSingleton(IAuthenticationMcpService, AuthenticationMcpService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

---[FILE: src/vs/workbench/services/authentication/browser/authenticationMcpUsageService.ts]---
Location: vscode-main/src/vs/workbench/services/authentication/browser/authenticationMcpUsageService.ts

```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Queue } from '../../../../base/common/async.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { InstantiationType, registerSingleton } from '../../../../platform/instantiation/common/extensions.js';
import { createDecorator } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IAuthenticationService } from '../common/authentication.js';

export interface IAuthenticationMcpUsage {
	mcpServerId: string;
	mcpServerName: string;
	lastUsed: number;
	scopes?: string[];
}

export const IAuthenticationMcpUsageService = createDecorator<IAuthenticationMcpUsageService>('IAuthenticationMcpUsageService');
export interface IAuthenticationMcpUsageService {
	readonly _serviceBrand: undefined;
	/**
	 * Initializes the cache of MCP servers that use authentication. Ideally used in a contribution that can be run eventually after the workspace is loaded.
	 */
	initializeUsageCache(): Promise<void>;
	/**
	 * Checks if an MCP server uses authentication
	 * @param mcpServerId The id of the MCP server to check
	 */
	hasUsedAuth(mcpServerId: string): Promise<boolean>;
	/**
	 * Reads the usages for an account
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 */
	readAccountUsages(providerId: string, accountName: string,): IAuthenticationMcpUsage[];
	/**
	 *
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 */
	removeAccountUsage(providerId: string, accountName: string): void;
	/**
	 * Adds a usage for an account
	 * @param providerId The id of the authentication provider to get usages for
	 * @param accountName The name of the account to get usages for
	 * @param mcpServerId The id of the MCP server to add a usage for
	 * @param mcpServerName The name of the MCP server to add a usage for
	 */
	addAccountUsage(providerId: string, accountName: string, scopes: ReadonlyArray<string>, mcpServerId: string, mcpServerName: string): void;
}

export class AuthenticationMcpUsageService extends Disposable implements IAuthenticationMcpUsageService {
	_serviceBrand: undefined;

	private _queue = new Queue();
	private _mcpServersUsingAuth = new Set<string>();

	constructor(
		@IStorageService private readonly _storageService: IStorageService,
		@IAuthenticationService private readonly _authenticationService: IAuthenticationService,
		@ILogService private readonly _logService: ILogService,
		@IProductService productService: IProductService,
	) {
		super();

		// If an MCP server is listed in `trustedMcpAuthAccess` we should consider it as using auth
		const trustedMcpAuthAccess = productService.trustedMcpAuthAccess;
		if (Array.isArray(trustedMcpAuthAccess)) {
			for (const mcpServerId of trustedMcpAuthAccess) {
				this._mcpServersUsingAuth.add(mcpServerId);
			}
		} else if (trustedMcpAuthAccess) {
			for (const mcpServers of Object.values(trustedMcpAuthAccess)) {
				for (const mcpServerId of mcpServers) {
					this._mcpServersUsingAuth.add(mcpServerId);
				}
			}
		}

		this._register(this._authenticationService.onDidRegisterAuthenticationProvider(
			provider => this._queue.queue(
				() => this._addToCache(provider.id)
			)
		));
	}

	async initializeUsageCache(): Promise<void> {
		await this._queue.queue(() => Promise.all(this._authenticationService.getProviderIds().map(providerId => this._addToCache(providerId))));
	}

	async hasUsedAuth(mcpServerId: string): Promise<boolean> {
		await this._queue.whenIdle();
		return this._mcpServersUsingAuth.has(mcpServerId);
	}

	readAccountUsages(providerId: string, accountName: string): IAuthenticationMcpUsage[] {
		const accountKey = `${providerId}-${accountName}-mcpserver-usages`;
		const storedUsages = this._storageService.get(accountKey, StorageScope.APPLICATION);
		let usages: IAuthenticationMcpUsage[] = [];
		if (storedUsages) {
			try {
				usages = JSON.parse(storedUsages);
			} catch (e) {
				// ignore
			}
		}

		return usages;
	}

	removeAccountUsage(providerId: string, accountName: string): void {
		const accountKey = `${providerId}-${accountName}-mcpserver-usages`;
		this._storageService.remove(accountKey, StorageScope.APPLICATION);
	}

	addAccountUsage(providerId: string, accountName: string, scopes: string[], mcpServerId: string, mcpServerName: string): void {
		const accountKey = `${providerId}-${accountName}-mcpserver-usages`;
		const usages = this.readAccountUsages(providerId, accountName);

		const existingUsageIndex = usages.findIndex(usage => usage.mcpServerId === mcpServerId);
		if (existingUsageIndex > -1) {
			usages.splice(existingUsageIndex, 1, {
				mcpServerId,
				mcpServerName,
				scopes,
				lastUsed: Date.now()
			});
		} else {
			usages.push({
				mcpServerId,
				mcpServerName,
				scopes,
				lastUsed: Date.now()
			});
		}

		this._storageService.store(accountKey, JSON.stringify(usages), StorageScope.APPLICATION, StorageTarget.MACHINE);
		this._mcpServersUsingAuth.add(mcpServerId);
	}

	private async _addToCache(providerId: string) {
		try {
			const accounts = await this._authenticationService.getAccounts(providerId);
			for (const account of accounts) {
				const usage = this.readAccountUsages(providerId, account.label);
				for (const u of usage) {
					this._mcpServersUsingAuth.add(u.mcpServerId);
				}
			}
		} catch (e) {
			this._logService.error(e);
		}
	}
}

registerSingleton(IAuthenticationMcpUsageService, AuthenticationMcpUsageService, InstantiationType.Delayed);
```

--------------------------------------------------------------------------------

````
